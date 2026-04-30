// network.js — PeerJS WebRTC networking, host authority, LAN discovery, reconnection
//
// Architecture:
//   Host: creates a Peer, generates roomCode, broadcasts state 20x/sec,
//         receives commands from clients, validates and applies them.
//   Client: joins via roomCode, receives authoritative state, sends commands.
//
// LAN Discovery (no backend needed):
//   The PeerJS default server exposes GET https://0.peerjs.com/peerjs/peers
//   which lists all currently-connected peer IDs.
//   We prefix game-beacon IDs with "rtslite-" so clients can discover them.
//   Format: rtslite-{roomCode}-{base64(gameMetaJSON)}
//   This works on any network where both parties can reach peerjs.com.

'use strict';

const PEERJS_HOST = '0.peerjs.com';
const PEERJS_PORT = 443;
const PEERJS_PATH = '/';
const DISCOVERY_PREFIX = 'rtslite-';
const BROADCAST_RATE_MS = 50;   // 20 Hz state broadcast
const DISCONNECT_TIMEOUT_MS = 5 * 60 * 1000;  // 5 min → neutral
const RECONNECT_WINDOW_MS   = 30 * 60 * 1000; // 30 min slot reserved

class NetworkManager {
  constructor(onEvent) {
    this.onEvent = onEvent;    // callback(eventType, data)
    this.peer = null;          // our own PeerJS Peer
    this.beaconPeer = null;    // host-only discovery beacon Peer
    this.connections = {};     // peerId → DataConnection
    this.roomCode = null;
    this.isHost = false;
    this.myPlayerId = null;    // our PeerJS ID (stable slot key)
    this.gameMeta = null;      // {name, maxPlayers, pin, mapName}
    this.broadcastTimer = null;
    this.latencies = {};       // peerId → ms
    this._pingTimers = {};
  }

  // ---- Host Setup ----
  async hostGame(meta) {
    this.isHost = true;
    this.gameMeta = { ...meta, startedAt: null };

    return new Promise((resolve, reject) => {
      this.peer = new Peer(undefined, {
        host: PEERJS_HOST, port: PEERJS_PORT, path: PEERJS_PATH,
        secure: true, debug: 1,
      });

      this.peer.on('open', (id) => {
        this.myPlayerId = id;
        this.roomCode = this._genRoomCode();

        // Register discovery beacon peer
        this._registerBeacon(this.roomCode, meta);

        // Listen for incoming connections
        this.peer.on('connection', (conn) => this._onIncomingConnection(conn));

        resolve({ peerId: id, roomCode: this.roomCode });
      });

      this.peer.on('error', (err) => {
        console.error('[Network] Peer error:', err);
        this.onEvent('error', { message: err.message || String(err) });
        reject(err);
      });

      this.peer.on('disconnected', () => {
        this.onEvent('peer-disconnected', {});
        setTimeout(() => { try { this.peer.reconnect(); } catch(e){} }, 2000);
      });
    });
  }

  // ---- Client Setup ----
  async joinGame(roomCode, playerName, pin) {
    this.isHost = false;
    this.roomCode = roomCode.toUpperCase();

    return new Promise((resolve, reject) => {
      this.peer = new Peer(undefined, {
        host: PEERJS_HOST, port: PEERJS_PORT, path: PEERJS_PATH,
        secure: true, debug: 1,
      });

      this.peer.on('open', (id) => {
        this.myPlayerId = id;

        // Connect to the host's beacon peer to get host's actual ID
        const beaconId = DISCOVERY_PREFIX + this.roomCode;
        const beaconConn = this.peer.connect(beaconId, { reliable: true, metadata: { type: 'beacon-query' } });

        beaconConn.on('open', () => {
          beaconConn.send({ type: 'QUERY', playerName });
        });

        beaconConn.on('data', (data) => {
          beaconConn.close();
          if (data.type === 'BEACON_RESPONSE') {
            // Check PIN if needed
            if (data.pin && data.pin !== pin) {
              reject(new Error('Incorrect PIN'));
              return;
            }
            // Connect to actual host
            this._connectToHost(data.hostId, playerName, resolve, reject);
          } else if (data.type === 'GAME_FULL') {
            reject(new Error('Game is full'));
          }
        });

        beaconConn.on('error', (err) => {
          // Beacon not found — try direct connect with roomCode as host ID fallback
          reject(new Error('Game not found. Check room code.'));
        });
      });

      this.peer.on('error', (err) => {
        this.onEvent('error', { message: err.message || String(err) });
        reject(err);
      });
    });
  }

  _connectToHost(hostId, playerName, resolve, reject) {
    const conn = this.peer.connect(hostId, {
      reliable: true,
      metadata: { type: 'player', name: playerName, peerId: this.myPlayerId },
    });

    const timeout = setTimeout(() => reject(new Error('Connection timed out')), 10000);

    conn.on('open', () => {
      clearTimeout(timeout);
      this.connections[hostId] = conn;
      this._setupConnection(conn, hostId);
      conn.send({ type: 'JOIN_REQUEST', playerName, peerId: this.myPlayerId });
      resolve({ peerId: this.myPlayerId, hostId });
    });

    conn.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  }

  // ---- Discovery Beacon (host only) ----
  _registerBeacon(roomCode, meta) {
    const beaconId = DISCOVERY_PREFIX + roomCode;
    this.beaconPeer = new Peer(beaconId, {
      host: PEERJS_HOST, port: PEERJS_PORT, path: PEERJS_PATH,
      secure: true, debug: 0,
    });

    this.beaconPeer.on('open', () => {
      console.log('[Network] Beacon registered:', beaconId);
    });

    this.beaconPeer.on('connection', (conn) => {
      conn.on('data', (data) => {
        if (data.type === 'QUERY') {
          const playerCount = Object.keys(this.connections).length + 1;
          if (playerCount >= meta.maxPlayers) {
            conn.send({ type: 'GAME_FULL' });
          } else {
            conn.send({
              type: 'BEACON_RESPONSE',
              hostId: this.myPlayerId,
              gameName: meta.name,
              maxPlayers: meta.maxPlayers,
              currentPlayers: playerCount,
              pin: meta.pin || null,
              mapName: 'Plains of Battle',
            });
          }
          setTimeout(() => { try { conn.close(); } catch(e){} }, 500);
        }
      });
    });

    this.beaconPeer.on('error', (err) => {
      // Beacon ID conflict or server issue — not fatal
      console.warn('[Network] Beacon error (non-fatal):', err.type);
    });
  }

  // ---- LAN / Network Discovery ----
  static async discoverGames() {
    // Fetch the PeerJS server's peer list and filter for our beacon prefix.
    // This works as "network discovery" — any game visible to the PeerJS server appears.
    const results = [];
    try {
      const url = `https://${PEERJS_HOST}/peerjs/peers`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const peers = await res.json();

      for (const peerId of peers) {
        if (!peerId.startsWith(DISCOVERY_PREFIX)) continue;
        const roomCode = peerId.slice(DISCOVERY_PREFIX.length);
        if (roomCode.length !== 6) continue;

        // Query each beacon for game details
        try {
          const info = await NetworkManager._queryBeacon(peerId);
          if (info) {
            results.push({ roomCode, ...info, ping: info._ping });
          }
        } catch (e) {
          // Skip unreachable beacons
        }
      }
    } catch (e) {
      console.warn('[Network] Discovery fetch failed:', e.message);
    }
    return results;
  }

  static async _queryBeacon(beaconPeerId) {
    // We need a temporary peer to connect to the beacon.
    // Returns game info or null.
    return new Promise((resolve) => {
      let done = false;
      const tmpPeer = new Peer(undefined, {
        host: PEERJS_HOST, port: PEERJS_PORT, path: PEERJS_PATH,
        secure: true, debug: 0,
      });

      const cleanup = (result) => {
        if (done) return;
        done = true;
        try { tmpPeer.destroy(); } catch(e) {}
        resolve(result);
      };

      setTimeout(() => cleanup(null), 6000);

      tmpPeer.on('open', () => {
        const t0 = Date.now();
        const conn = tmpPeer.connect(beaconPeerId, { reliable: true, metadata: { type: 'beacon-query' } });
        conn.on('open', () => conn.send({ type: 'QUERY', playerName: '' }));
        conn.on('data', (data) => {
          if (data.type === 'BEACON_RESPONSE') {
            data._ping = Date.now() - t0;
            cleanup(data);
          } else {
            cleanup(null);
          }
        });
        conn.on('error', () => cleanup(null));
      });
      tmpPeer.on('error', () => cleanup(null));
    });
  }

  // ---- Incoming Connection Handling (host) ----
  _onIncomingConnection(conn) {
    // Skip beacon connections (handled separately)
    if (conn.metadata && conn.metadata.type === 'beacon-query') return;

    const peerId = conn.peer;
    conn.on('open', () => {
      this.connections[peerId] = conn;
      this._setupConnection(conn, peerId);
      console.log('[Network] Client connected:', peerId);
    });
    conn.on('error', (err) => {
      console.warn('[Network] Connection error:', peerId, err);
    });
  }

  _setupConnection(conn, peerId) {
    conn.on('data', (msg) => {
      if (!msg || !msg.type) return;
      this._handleMessage(msg, peerId);
    });

    conn.on('close', () => {
      console.log('[Network] Connection closed:', peerId);
      delete this.connections[peerId];
      this.onEvent('player-disconnected', { peerId });
    });

    // Start ping timer
    this._pingTimers[peerId] = setInterval(() => {
      if (conn.open) conn.send({ type: 'PING', t: Date.now() });
    }, 2000);
  }

  _handleMessage(msg, fromPeerId) {
    switch (msg.type) {
      case 'PING':
        // Client pings host, host replies with PONG
        if (this.isHost && this.connections[fromPeerId]) {
          this.connections[fromPeerId].send({ type: 'PONG', t: msg.t });
        }
        break;
      case 'PONG':
        this.latencies[fromPeerId] = Date.now() - msg.t;
        break;
      case 'JOIN_REQUEST':
        // Host receives join request — delegate to game engine
        this.onEvent('join-request', { peerId: fromPeerId, playerName: msg.playerName });
        break;
      case 'JOIN_ACCEPTED':
        // Client receives acceptance from host
        this.onEvent('join-accepted', { slot: msg.slot, colorIdx: msg.colorIdx, players: msg.players });
        break;
      case 'JOIN_REJECTED':
        this.onEvent('join-rejected', { reason: msg.reason });
        break;
      case 'FULL_STATE':
        if (!this.isHost) this.onEvent('full-state', { state: msg.state, tick: msg.tick });
        break;
      case 'DELTA_STATE':
        if (!this.isHost) this.onEvent('delta-state', { delta: msg.delta, tick: msg.tick });
        break;
      case 'COMMAND':
        // Client sends command to host
        if (this.isHost) this.onEvent('command', { cmd: msg.cmd, peerId: fromPeerId });
        break;
      case 'CHAT':
        this.onEvent('chat', { text: msg.text, peerId: fromPeerId });
        break;
      case 'LOBBY_UPDATE':
        if (!this.isHost) this.onEvent('lobby-update', { players: msg.players });
        break;
      case 'GAME_START':
        if (!this.isHost) this.onEvent('game-start', { seed: msg.seed, players: msg.players });
        break;
      case 'RECONNECT_STATE':
        if (!this.isHost) this.onEvent('reconnect-state', { state: msg.state });
        break;
      default:
        // Unknown message type — ignore
        break;
    }
  }

  // ---- Sending ----

  // Host: broadcast state to all clients
  broadcastState(state, full = false) {
    if (!this.isHost) return;
    const msg = full
      ? { type: 'FULL_STATE', state, tick: state.tick }
      : { type: 'FULL_STATE', state, tick: state.tick }; // simplified: always full for PoC
    this._broadcastToAll(msg);
  }

  // Host: send full state to one client (e.g., on reconnect)
  sendFullState(peerId, state) {
    this._sendTo(peerId, { type: 'RECONNECT_STATE', state });
  }

  // Host: send lobby update to all
  broadcastLobbyUpdate(players) {
    this._broadcastToAll({ type: 'LOBBY_UPDATE', players });
  }

  // Host: tell clients game is starting
  broadcastGameStart(seed, players) {
    this._broadcastToAll({ type: 'GAME_START', seed, players });
  }

  // Host: accept a joining player
  sendJoinAccepted(peerId, slot, colorIdx, players) {
    this._sendTo(peerId, { type: 'JOIN_ACCEPTED', slot, colorIdx, players });
  }

  // Host: reject a joining player
  sendJoinRejected(peerId, reason) {
    this._sendTo(peerId, { type: 'JOIN_REJECTED', reason });
  }

  // Client: send a command to host
  sendCommand(cmd) {
    if (this.isHost) {
      // Host processes own commands directly
      this.onEvent('command', { cmd, peerId: this.myPlayerId });
      return;
    }
    const hostId = Object.keys(this.connections)[0];
    if (hostId) this._sendTo(hostId, { type: 'COMMAND', cmd });
  }

  _sendTo(peerId, msg) {
    const conn = this.connections[peerId];
    if (conn && conn.open) {
      try { conn.send(msg); } catch(e) { console.warn('[Network] Send error:', e); }
    }
  }

  _broadcastToAll(msg) {
    for (const conn of Object.values(this.connections)) {
      if (conn.open) {
        try { conn.send(msg); } catch(e) {}
      }
    }
  }

  // ---- Start periodic state broadcast (host) ----
  startBroadcast(getStateFn) {
    if (this.broadcastTimer) clearInterval(this.broadcastTimer);
    this.broadcastTimer = setInterval(() => {
      const state = getStateFn();
      if (state) this.broadcastState(state);
    }, BROADCAST_RATE_MS);
  }

  stopBroadcast() {
    if (this.broadcastTimer) { clearInterval(this.broadcastTimer); this.broadcastTimer = null; }
  }

  // ---- Cleanup ----
  destroy() {
    this.stopBroadcast();
    for (const timer of Object.values(this._pingTimers)) clearInterval(timer);
    for (const conn of Object.values(this.connections)) { try { conn.close(); } catch(e){} }
    try { if (this.beaconPeer) this.beaconPeer.destroy(); } catch(e) {}
    try { if (this.peer) this.peer.destroy(); } catch(e) {}
    this.connections = {};
  }

  getLatency(peerId) { return this.latencies[peerId] ?? null; }

  // ---- Helpers ----
  _genRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  }
}
