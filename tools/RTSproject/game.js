// game.js — Main game engine: simulation loop, input, command processing, state management
//
// Host authority model:
//   - Host runs the authoritative simulation at 20 ticks/sec
//   - Clients receive full state 20x/sec and render it
//   - All commands flow: client → network → host validates → host applies → host broadcasts
//
// Reconnection:
//   - Host tracks disconnected peers with timestamps
//   - On reconnect, same peerId → same slot → full state sent immediately
//   - After DISCONNECT_TIMEOUT_MS, player's units go neutral (auto-defend only)

'use strict';

class GameEngine {
  constructor() {
    this.state    = null;       // authoritative game state (host runs it, clients receive it)
    this.renderer = null;
    this.ui       = null;
    this.network  = null;
    this.mapData  = null;
    this.pathFinder = null;

    this.isHost     = false;
    this.myPlayerId = null;  // our PeerJS ID

    // Input state
    this.input = {
      mouseX: 0, mouseY: 0,
      dragStart: null,    // {x,y} if dragging a selection box
      isDragging: false,
      keysDown: new Set(),
      edgeScrollTimer: 0,
    };

    // Selection state
    this.selection = { units: [], buildings: [] };

    // Placement mode (building placement)
    this.placement = { active: false, buildingType: null, workerId: null };

    // Hotkey groups (Ctrl+1-9)
    this.groups = {};

    // Simulation
    this._simInterval = null;
    this._tick = 0;

    // Reconnection tracking (host only)
    this._disconnectedPlayers = {};  // peerId → { slot, disconnectedAt }

    // Pending commands (host queues them between ticks)
    this._commandQueue = [];

    // Lobby state
    this._lobbyPlayers = [];  // [{peerId, name, colorIdx, isHost}]
    this._gameMeta = null;

    // Stats tracking
    this._stats = {};  // peerId → { unitsBuilt, unitsLost, materialsGathered }

    this._boundOnKeyDown  = this._onKeyDown.bind(this);
    this._boundOnKeyUp    = this._onKeyUp.bind(this);
    this._boundOnMouseMove= this._onMouseMove.bind(this);
    this._boundOnMouseDown= this._onMouseDown.bind(this);
    this._boundOnMouseUp  = this._onMouseUp.bind(this);
    this._boundOnWheel    = this._onWheel.bind(this);
    this._boundOnCtxMenu  = (e) => e.preventDefault();
  }

  // ===================== INIT =====================

  init() {
    const canvas = document.getElementById('game-canvas');
    const mmCanvas = document.getElementById('minimap-canvas');

    this.ui = new UIManager(this);
    this.ui.showScreen('lobby');

    this.renderer = new GameRenderer(canvas, mmCanvas);

    window.addEventListener('resize', () => this._onResize());
    this._onResize();

    // Start render loop
    this._renderLoop();
  }

  _onResize() {
    const canvas = document.getElementById('game-canvas');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    if (this.renderer) this.renderer.resize(canvas.width, canvas.height);
  }

  // ===================== LOBBY =====================

  async hostGame({ playerName, gameName, maxPlayers, pin }) {
    this._gameMeta = { name: gameName, maxPlayers, pin, playerName };
    this.ui.showLoading('Setting up game...');

    this.network = new NetworkManager((type, data) => this._onNetworkEvent(type, data));

    try {
      const { roomCode } = await this.network.hostGame({ name: gameName, maxPlayers, pin });
      this.isHost = true;
      this.myPlayerId = this.network.myPlayerId;

      // Host is slot 0
      this._lobbyPlayers = [{
        peerId: this.myPlayerId,
        name: playerName,
        colorIdx: 0,
        isHost: true,
      }];
      this._initStats(this.myPlayerId);

      this.ui.hideLoading();
      this.ui.showScreen('pregame');
      this.ui.updatePregame(roomCode, this._lobbyPlayers, true, maxPlayers);
    } catch (err) {
      this.ui.hideLoading();
      this.ui.setLobbyStatus('Failed to host: ' + err.message, true);
    }
  }

  async joinGame({ playerName, roomCode, pin }) {
    this.ui.showLoading('Joining game...');

    this.network = new NetworkManager((type, data) => this._onNetworkEvent(type, data));

    try {
      await this.network.joinGame(roomCode, playerName, pin);
      // Wait for join-accepted event
      this._pendingJoinName = playerName;
    } catch (err) {
      this.network.destroy();
      this.network = null;
      this.ui.hideLoading();
      this.ui.setLobbyStatus('Failed to join: ' + err.message, true);
    }
  }

  hostStartGame() {
    if (!this.isHost) return;
    if (this._lobbyPlayers.length < 1) return;

    const seed = Math.floor(Math.random() * 0xFFFFFF);
    this.network.broadcastGameStart(seed, this._lobbyPlayers);
    this._startGame(seed, this._lobbyPlayers);
  }

  leaveLobby() {
    if (this.network) { this.network.destroy(); this.network = null; }
    this._lobbyPlayers = [];
    this.ui.showScreen('lobby');
  }

  // ===================== NETWORK EVENTS =====================

  _onNetworkEvent(type, data) {
    switch (type) {
      case 'join-request':
        this._handleJoinRequest(data);
        break;

      case 'join-accepted': {
        // We are a client and got accepted
        this.isHost = false;
        this.myPlayerId = this.network.myPlayerId;
        this.ui.hideLoading();
        this.ui.showScreen('pregame');
        this.ui.updatePregame(
          this.network.roomCode,
          data.players,
          false,
          this._gameMeta?.maxPlayers || 4
        );
        this._lobbyPlayers = data.players;
        break;
      }

      case 'join-rejected':
        this.network.destroy();
        this.network = null;
        this.ui.hideLoading();
        this.ui.setLobbyStatus('Rejected: ' + (data.reason || 'Unknown'), true);
        break;

      case 'lobby-update':
        this._lobbyPlayers = data.players;
        this.ui.updatePregame(
          this.network.roomCode,
          data.players,
          false,
          this._gameMeta?.maxPlayers || 4
        );
        break;

      case 'game-start':
        this._lobbyPlayers = data.players;
        this._startGame(data.seed, data.players);
        break;

      case 'full-state':
        // Client receives authoritative state from host
        if (!this.isHost) {
          this._applyFullState(data.state);
        }
        break;

      case 'reconnect-state':
        this._applyFullState(data.state);
        break;

      case 'command':
        // Host receives a command from a client (or self)
        if (this.isHost) {
          this._commandQueue.push({ cmd: data.cmd, peerId: data.peerId });
        }
        break;

      case 'player-disconnected':
        this._handlePlayerDisconnected(data.peerId);
        break;

      case 'error':
        this.ui.notify('Network error: ' + data.message, 'danger');
        break;
    }
  }

  _handleJoinRequest(data) {
    if (!this.isHost) return;
    const { peerId, playerName } = data;

    // Check if reconnecting player
    const reconnectSlot = this._disconnectedPlayers[peerId];
    if (reconnectSlot !== undefined) {
      delete this._disconnectedPlayers[peerId];
      const slot = reconnectSlot.slot;
      const p = this._lobbyPlayers[slot];
      if (p) {
        p.connected = true;
        this.network.sendJoinAccepted(peerId, slot, slot, this._lobbyPlayers);
        this.network.sendFullState(peerId, this._serializeState());
        if (this.state) this.state.players[peerId].connected = true;
        this.ui.notify(`${playerName} reconnected!`, 'success');
        return;
      }
    }

    // New player — find open slot
    const maxPlayers = this._gameMeta?.maxPlayers || 4;
    if (this._lobbyPlayers.length >= maxPlayers) {
      this.network.sendJoinRejected(peerId, 'Game is full');
      return;
    }

    const colorIdx = this._lobbyPlayers.length;
    this._lobbyPlayers.push({ peerId, name: playerName, colorIdx, isHost: false, connected: true });
    this._initStats(peerId);

    this.network.sendJoinAccepted(peerId, colorIdx, colorIdx, this._lobbyPlayers);
    this.network.broadcastLobbyUpdate(this._lobbyPlayers);
    this.ui.updatePregame(this.network.roomCode, this._lobbyPlayers, true, maxPlayers);
    this.ui.notify(`${playerName} joined!`, 'success');
  }

  _handlePlayerDisconnected(peerId) {
    const slot = this._lobbyPlayers.findIndex(p => p.peerId === peerId);
    if (slot === -1) return;

    const name = this._lobbyPlayers[slot]?.name || 'A player';
    this.ui.notify(`${name} disconnected`, 'warning');

    if (this.isHost && this.state) {
      const player = this.state.players[peerId];
      if (player) {
        player.connected = false;
        player.disconnectedAt = Date.now();
        // Record for reconnection
        this._disconnectedPlayers[peerId] = { slot, disconnectedAt: Date.now() };
      }
    }

    if (this.isHost && !this.state) {
      // In lobby: remove the slot
      this._lobbyPlayers.splice(slot, 1);
      // Re-index colors
      this._lobbyPlayers.forEach((p, i) => p.colorIdx = i);
      this.network.broadcastLobbyUpdate(this._lobbyPlayers);
      this.ui.updatePregame(this.network.roomCode, this._lobbyPlayers, true, this._gameMeta?.maxPlayers || 4);
    }
  }

  // ===================== GAME START =====================

  _startGame(seed, players) {
    // Generate map
    this.mapData  = MapGenerator.generate(seed);
    this.pathFinder = new PathFinder(this.mapData);

    // Build initial game state
    this.state = this._buildInitialState(players);

    // Start input
    this._attachInputListeners();

    // Camera: pan to player's HQ
    const myPlayer = this.state.players[this.myPlayerId];
    if (myPlayer) {
      const sp = STARTING_POSITIONS[myPlayer.colorIdx];
      this.renderer.camera.panTo(sp.x, sp.y);
    }

    // Start simulation (host only)
    if (this.isHost) {
      this._simInterval = setInterval(() => this._simulateTick(), TICK_MS);
      this.network.startBroadcast(() => this._serializeState());
    }

    this.ui.showScreen('game');
    this.ui.notify('Game started! Collect materials and destroy enemy HQs.', 'success');
  }

  _buildInitialState(players) {
    const state = {
      tick: 0,
      players: {},
      units: {},
      buildings: {},
      resources: {},
      gameOver: null,
      map: this.mapData,
    };

    // Init players
    for (const p of players) {
      state.players[p.peerId] = {
        id: p.peerId,
        name: p.name,
        colorIdx: p.colorIdx,
        materials: 200,
        usedSupply: 0,
        maxSupply: 10,
        upgrades: { damage: 0, armor: 0, range: 0, critChance: 0 },
        connected: true,
        disconnectedAt: null,
        eliminated: false,
      };
    }

    // Init resources from map
    for (const res of this.mapData.resources) {
      state.resources[res.id] = { ...res };
    }

    // Place starting units and buildings for each player
    for (const p of players) {
      const sp = STARTING_POSITIONS[p.colorIdx];
      if (!sp) continue;

      // HQ
      const hqId = genId();
      state.buildings[hqId] = this._createBuilding('hq', sp.x, sp.y, p.peerId, 1.0);

      // 2 starting workers
      for (let i = 0; i < 2; i++) {
        const angle = (i / 2) * Math.PI * 2;
        const wx = sp.x + Math.cos(angle) * 4;
        const wy = sp.y + Math.sin(angle) * 4;
        const uid = genId();
        state.units[uid] = this._createUnit('worker', wx, wy, p.peerId);
      }
    }

    // Recompute supply
    for (const pid of Object.keys(state.players)) {
      state.players[pid].maxSupply  = calcMaxSupply(state.buildings, pid);
      state.players[pid].usedSupply = calcUsedSupply(state.units, pid);
    }

    // Rebuild walkability with buildings
    this.mapData.buildWalkable(state.buildings);

    return state;
  }

  _createUnit(type, x, y, playerId) {
    const def = getUnitDef(type);
    return {
      id: genId(),
      type,
      player: playerId,
      x, y,
      hp: def.hp,
      maxHp: def.hp,
      state: 'idle',
      // Movement
      targetX: x,
      targetY: y,
      path: [],
      pathIdx: 0,
      // Combat
      attackTarget: null,
      attackCooldown: 0,
      // Harvesting
      harvestTarget: null,
      harvestTimer: 0,
      // Building
      buildTarget: null,
      buildTimer: 0,
    };
  }

  _createBuilding(type, x, y, playerId, buildProgress = 0) {
    const def = getBuildingDef(type);
    return {
      id: genId(),
      type,
      player: playerId,
      x, y,
      hp: buildProgress >= 1 ? def.hp : Math.floor(def.hp * buildProgress),
      maxHp: def.hp,
      buildProgress,
      queue: [],
      upgradingTimer: null,
    };
  }

  // ===================== SIMULATION TICK (HOST ONLY) =====================

  _simulateTick() {
    if (!this.state || !this.isHost) return;
    this._tick++;
    this.state.tick = this._tick;

    const dt = 1 / TICK_RATE;

    // Process queued commands
    this._processCommandQueue();

    // Update player supply
    for (const pid of Object.keys(this.state.players)) {
      const p = this.state.players[pid];
      p.maxSupply  = calcMaxSupply(this.state.buildings, pid);
      p.usedSupply = calcUsedSupply(this.state.units, pid);

      // Timeout check for disconnected players
      if (!p.connected && p.disconnectedAt) {
        const elapsed = Date.now() - p.disconnectedAt;
        if (elapsed > DISCONNECT_TIMEOUT_MS) {
          p.neutral = true;  // Mark as neutral (auto-defend only)
        }
      }
    }

    // Update units
    for (const uid of Object.keys(this.state.units)) {
      const u = this.state.units[uid];
      if (u.hp <= 0) { this._onUnitDied(u); delete this.state.units[uid]; continue; }
      this._updateUnit(u, dt);
    }

    // Update buildings
    for (const bid of Object.keys(this.state.buildings)) {
      const b = this.state.buildings[bid];
      if (b.hp <= 0) { this._onBuildingDestroyed(b); delete this.state.buildings[bid]; continue; }
      this._updateBuilding(b, dt);
    }

    // Check win condition
    this._checkWinCondition();

    // Update walkability (buildings may have been added/completed)
    if (this._tick % 20 === 0) {
      this.mapData.buildWalkable(this.state.buildings);
    }
  }

  _updateUnit(u, dt) {
    const def = getUnitDef(u.type);
    if (!def) return;
    const player = this.state.players[u.player];
    if (!player) return;

    // Disconnected neutral units: only auto-retaliate
    if (player.neutral) {
      u.state = 'idle';
      // Auto-attack if being attacked (handled by combat logic below)
    }

    // Attack cooldown countdown
    if (u.attackCooldown > 0) u.attackCooldown -= dt;

    // State machine
    switch (u.state) {
      case 'idle':
        this._tryAutoAttack(u, def, player);
        break;

      case 'moving':
        this._moveUnit(u, def, dt);
        // Check if reached destination
        if (this._distSq(u.x, u.y, u.targetX, u.targetY) < 0.2 * 0.2) {
          u.state = 'idle';
          u.path = [];
        }
        this._tryAutoAttack(u, def, player);
        break;

      case 'attacking': {
        const target = this.state.units[u.attackTarget] || this.state.buildings[u.attackTarget];
        if (!target || target.hp <= 0) {
          u.state = 'idle';
          u.attackTarget = null;
          break;
        }
        const range = computeRange(def.range, player.upgrades);
        const dist  = Math.sqrt(this._distSq(u.x, u.y, target.x, target.y));
        if (dist > range + 0.5) {
          // Move toward target
          this._setPath(u, target.x, target.y);
          this._moveUnit(u, def, dt);
        } else {
          // In range — stop and attack
          u.path = [];
          if (u.attackCooldown <= 0) {
            this._doAttack(u, target, def, player);
          }
        }
        break;
      }

      case 'harvesting': {
        const res = this.state.resources[u.harvestTarget];
        if (!res || res.amount <= 0) {
          u.state = 'idle';
          u.harvestTarget = null;
          u.harvestTimer = 0;
          break;
        }
        const dist = Math.sqrt(this._distSq(u.x, u.y, res.x, res.y));
        if (dist > 2.5) {
          // Move toward resource
          u.state = 'moving';
          this._setPath(u, res.x, res.y);
          break;
        }
        // Harvest tick
        u.harvestTimer++;
        if (u.harvestTimer >= HARVEST_DURATION * TICK_RATE) {
          u.harvestTimer = 0;
          const harvest = Math.min(HARVEST_AMOUNT, res.amount);
          res.amount -= harvest;
          player.materials += harvest;
          if (this._stats[u.player]) this._stats[u.player].materialsGathered += harvest;
        }
        break;
      }

      case 'building': {
        const b = this.state.buildings[u.buildTarget];
        if (!b || b.buildProgress >= 1) {
          u.state = 'idle';
          u.buildTarget = null;
          break;
        }
        const dist = Math.sqrt(this._distSq(u.x, u.y, b.x, b.y));
        if (dist > getBuildingDef(b.type).footprint + 1.5) {
          u.state = 'moving';
          this._setPath(u, b.x, b.y);
          break;
        }
        const bdef = getBuildingDef(b.type);
        const buildRate = 1 / (bdef.buildTimeSec * TICK_RATE);
        b.buildProgress = Math.min(1, b.buildProgress + buildRate);
        b.hp = Math.floor(b.maxHp * b.buildProgress);
        if (b.buildProgress >= 1) {
          u.state = 'idle';
          u.buildTarget = null;
          this.ui?.notify('Building complete!', 'success');
        }
        break;
      }
    }

    // Enforce map boundaries
    u.x = Math.max(0.5, Math.min(MAP_SIZE - 0.5, u.x));
    u.y = Math.max(0.5, Math.min(MAP_SIZE - 0.5, u.y));
  }

  _tryAutoAttack(u, def, player) {
    if (player.neutral && u.attackCooldown > 0) return; // neutral: only retaliate
    const range = computeRange(def.visionRange, {});
    let closestDist = range * range;
    let closestId = null;

    for (const [tid, target] of Object.entries(this.state.units)) {
      if (target.player === u.player) continue;
      const d = this._distSq(u.x, u.y, target.x, target.y);
      if (d < closestDist) { closestDist = d; closestId = tid; }
    }
    if (!closestId) {
      for (const [tid, target] of Object.entries(this.state.buildings)) {
        if (target.player === u.player) continue;
        const d = this._distSq(u.x, u.y, target.x, target.y);
        if (d < closestDist) { closestDist = d; closestId = tid; }
      }
    }

    if (closestId) {
      u.state = 'attacking';
      u.attackTarget = closestId;
    }
  }

  _doAttack(u, target, def, attackerPlayer) {
    const dmg = computeDamage(def.damage, attackerPlayer.upgrades);
    const targetPlayer = this.state.players[target.player];
    const targetDef = getUnitDef(target.type) || getBuildingDef(target.type);
    const armor = targetDef ? computeArmor(targetDef.armor, targetPlayer?.upgrades || {}) : 0;
    const finalDmg = Math.max(1, dmg - armor);
    target.hp -= finalDmg;
    u.attackCooldown = ATTACK_PERIOD;

    // Auto-retaliate
    if (target.state === 'idle' && 'attackTarget' in target) {
      target.state = 'attacking';
      target.attackTarget = u.id;
    }
  }

  _moveUnit(u, def, dt) {
    // Follow path if available
    if (u.path && u.pathIdx < u.path.length) {
      const wp = u.path[u.pathIdx];
      const dx = wp.x - u.x, dy = wp.y - u.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 0.2) {
        u.pathIdx++;
        if (u.pathIdx >= u.path.length) { u.path = []; return; }
        return;
      }
      const speed = def.speed * dt;
      u.x += (dx / dist) * Math.min(speed, dist);
      u.y += (dy / dist) * Math.min(speed, dist);
    } else {
      // Direct movement (no path)
      const dx = u.targetX - u.x, dy = u.targetY - u.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 0.1) { u.state = 'idle'; return; }
      const speed = def.speed * dt;
      u.x += (dx / dist) * Math.min(speed, dist);
      u.y += (dy / dist) * Math.min(speed, dist);
    }

    // Simple collision: push away from other units
    this._resolveCollisions(u, def);
  }

  _resolveCollisions(u, def) {
    for (const other of Object.values(this.state.units)) {
      if (other.id === u.id) continue;
      const dx = u.x - other.x, dy = u.y - other.y;
      const distSq = dx*dx + dy*dy;
      const minDist = def.radius + (getUnitDef(other.type)?.radius || 0.35);
      if (distSq < minDist*minDist && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const push = (minDist - dist) / dist * 0.5;
        u.x += dx * push;
        u.y += dy * push;
      }
    }
  }

  _setPath(u, tx, ty) {
    u.targetX = tx;
    u.targetY = ty;
    const path = this.pathFinder.findPath(u.x, u.y, tx, ty);
    if (path) {
      u.path = path;
      u.pathIdx = 0;
    } else {
      u.path = [];
    }
  }

  _updateBuilding(b, dt) {
    const def = getBuildingDef(b.type);
    if (!def || b.buildProgress < 1) return;

    const player = this.state.players[b.player];
    if (!player) return;

    // Production queue
    if (b.queue && b.queue.length > 0) {
      const item = b.queue[0];
      item.timer--;
      if (item.timer <= 0) {
        b.queue.shift();
        // Spawn unit near building
        this._spawnUnit(item.type, b, player);
      }
    }

    // Upgrade timer
    if (b.upgradingTimer) {
      b.upgradingTimer.timer--;
      if (b.upgradingTimer.timer <= 0) {
        const { upgradeType } = b.upgradingTimer;
        player.upgrades[upgradeType] = (player.upgrades[upgradeType] || 0) + 1;
        b.upgradingTimer = null;
        this.ui?.notify(`${BUILDING_DEFS.armory.upgrades[upgradeType]?.name} research complete!`, 'success');
      }
    }
  }

  _spawnUnit(type, building, player) {
    const pid = player.id;
    const def = getBuildingDef(building.type);
    const spawnR = (def.footprint / 2) + 2;
    for (let a = 0; a < 12; a++) {
      const angle = (a / 12) * Math.PI * 2;
      const sx = building.x + Math.cos(angle) * spawnR;
      const sy = building.y + Math.sin(angle) * spawnR;
      if (this.mapData.walkable(Math.round(sx), Math.round(sy))) {
        const uid = genId();
        const u = this._createUnit(type, sx, sy, pid);
        u.id = uid;
        this.state.units[uid] = u;
        if (this._stats[pid]) this._stats[pid].unitsBuilt++;
        return;
      }
    }
    // Fallback: spawn at building center
    const uid = genId();
    const u = this._createUnit(type, building.x + 2, building.y + 2, pid);
    u.id = uid;
    this.state.units[uid] = u;
  }

  _onUnitDied(u) {
    if (this._stats[u.player]) this._stats[u.player].unitsLost++;
    // Clear references in other units
    for (const other of Object.values(this.state.units)) {
      if (other.attackTarget === u.id) { other.attackTarget = null; other.state = 'idle'; }
    }
  }

  _onBuildingDestroyed(b) {
    this.ui?.notify(`A building was destroyed!`, 'warning');
    for (const u of Object.values(this.state.units)) {
      if (u.attackTarget === b.id) { u.attackTarget = null; u.state = 'idle'; }
      if (u.buildTarget === b.id)  { u.buildTarget = null;  u.state = 'idle'; }
    }
  }

  _checkWinCondition() {
    if (this.state.gameOver) return;
    const activePlayers = [];
    for (const [pid, player] of Object.entries(this.state.players)) {
      if (player.eliminated) continue;
      const hasHQ = Object.values(this.state.buildings).some(b => b.type === 'hq' && b.player === pid);
      if (!hasHQ) {
        player.eliminated = true;
        this.ui?.notify(`${player.name} has been eliminated!`, 'danger');
      } else {
        activePlayers.push(pid);
      }
    }
    if (activePlayers.length === 1) {
      const winner = this.state.players[activePlayers[0]];
      this.state.gameOver = { winnerId: activePlayers[0], winnerName: winner.name };
      this._endGame(activePlayers[0]);
    } else if (activePlayers.length === 0) {
      this.state.gameOver = { winnerId: null, winnerName: 'Draw' };
      this._endGame(null);
    }
  }

  _endGame(winnerId) {
    if (this.isHost) {
      clearInterval(this._simInterval);
      this._simInterval = null;
      this.network.stopBroadcast();
    }
    const win = winnerId === this.myPlayerId;
    const winnerName = winnerId ? (this.state.players[winnerId]?.name || 'Unknown') : 'No one';
    const myStats = this._stats[this.myPlayerId] || {};
    this.ui.showGameOver(win, `${winnerName} wins!`, {
      'Materials gathered': myStats.materialsGathered || 0,
      'Units built': myStats.unitsBuilt || 0,
      'Units lost': myStats.unitsLost || 0,
    });
  }

  // ===================== COMMAND PROCESSING =====================

  _processCommandQueue() {
    const cmds = this._commandQueue.splice(0);
    for (const { cmd, peerId } of cmds) {
      this._applyCommand(cmd, peerId);
    }
  }

  _applyCommand(cmd, peerId) {
    const player = this.state.players[peerId];
    if (!player || player.eliminated) return;

    switch (cmd.type) {
      case 'MOVE': {
        const { unitIds, targetX, targetY } = cmd;
        const spread = this._computeFormationOffsets(unitIds.length);
        unitIds.forEach((uid, i) => {
          const u = this.state.units[uid];
          if (!u || u.player !== peerId) return;
          const ox = spread[i]?.dx || 0, oy = spread[i]?.dy || 0;
          u.state = 'moving';
          u.attackTarget = null;
          u.harvestTarget = null;
          u.buildTarget = null;
          this._setPath(u, targetX + ox, targetY + oy);
        });
        break;
      }

      case 'ATTACK': {
        const { unitIds, targetId } = cmd;
        const target = this.state.units[targetId] || this.state.buildings[targetId];
        if (!target) return;
        for (const uid of unitIds) {
          const u = this.state.units[uid];
          if (!u || u.player !== peerId) continue;
          u.state = 'attacking';
          u.attackTarget = targetId;
        }
        break;
      }

      case 'HARVEST': {
        const { unitIds, resourceId } = cmd;
        const res = this.state.resources[resourceId];
        if (!res || res.amount <= 0) return;
        for (const uid of unitIds) {
          const u = this.state.units[uid];
          if (!u || u.player !== peerId) continue;
          const def = getUnitDef(u.type);
          if (!def?.canHarvest) continue;
          u.state = 'harvesting';
          u.harvestTarget = resourceId;
          u.harvestTimer = 0;
          this._setPath(u, res.x, res.y);
        }
        break;
      }

      case 'BUILD': {
        const { workerId, buildingType, x, y } = cmd;
        const worker = this.state.units[workerId];
        if (!worker || worker.player !== peerId) return;
        const bdef = getBuildingDef(buildingType);
        if (!bdef) return;
        // Check cost
        if (player.materials < bdef.cost) { return; }
        // Check placement validity (server-side validation)
        if (!this._isValidServerPlacement(x, y, bdef.footprint)) return;

        player.materials -= bdef.cost;
        const bid = genId();
        const b = this._createBuilding(buildingType, x, y, peerId, 0.01);
        b.id = bid;
        this.state.buildings[bid] = b;
        worker.state = 'building';
        worker.buildTarget = bid;
        this._setPath(worker, x, y);
        this.mapData.buildWalkable(this.state.buildings);
        break;
      }

      case 'PRODUCE': {
        const { buildingId, unitType } = cmd;
        const building = this.state.buildings[buildingId];
        if (!building || building.player !== peerId || building.buildProgress < 1) return;
        const bdef = getBuildingDef(building.type);
        if (!bdef.produces.includes(unitType)) return;
        if (building.queue.length >= 5) return;
        const udef = getUnitDef(unitType);
        if (!udef) return;
        if (player.materials < udef.cost) return;
        const usedSup = calcUsedSupply(this.state.units, peerId);
        // Count queued supply too
        const queuedSup = building.queue.reduce((s, q) => s + (getUnitDef(q.type)?.supply || 0), 0);
        if (usedSup + queuedSup + udef.supply > player.maxSupply) return;

        player.materials -= udef.cost;
        building.queue.push({ type: unitType, timer: Math.round(udef.buildTimeSec * TICK_RATE) });
        break;
      }

      case 'CANCEL_PRODUCE': {
        const { buildingId } = cmd;
        const building = this.state.buildings[buildingId];
        if (!building || building.player !== peerId) return;
        if (building.queue.length === 0) return;
        const last = building.queue.pop();
        const udef = getUnitDef(last.type);
        if (udef) player.materials += Math.floor(udef.cost * 0.75); // 75% refund
        break;
      }

      case 'UPGRADE': {
        const { armoryId, upgradeType } = cmd;
        const armory = this.state.buildings[armoryId];
        if (!armory || armory.player !== peerId || armory.type !== 'armory') return;
        if (armory.buildProgress < 1 || armory.upgradingTimer) return;
        const upgDef = BUILDING_DEFS.armory.upgrades[upgradeType];
        if (!upgDef) return;
        const curLevel = player.upgrades[upgradeType] || 0;
        if (curLevel >= upgDef.maxLevel) return;
        const cost = upgDef.cost * (curLevel + 1);
        if (player.materials < cost) return;
        player.materials -= cost;
        armory.upgradingTimer = { upgradeType, timer: Math.round(15 * TICK_RATE) };
        break;
      }

      case 'STOP': {
        const { unitIds } = cmd;
        for (const uid of unitIds) {
          const u = this.state.units[uid];
          if (!u || u.player !== peerId) continue;
          u.state = 'idle';
          u.attackTarget = null;
          u.path = [];
        }
        break;
      }

      case 'SURRENDER': {
        if (!player) return;
        player.eliminated = true;
        this.ui?.notify(`${player.name} surrendered.`, 'warning');
        this._checkWinCondition();
        break;
      }
    }
  }

  _isValidServerPlacement(x, y, fp) {
    const half = Math.floor(fp / 2);
    for (let dy = -half; dy < fp - half; dy++) {
      for (let dx = -half; dx < fp - half; dx++) {
        const t = this.mapData.getTerrain(x+dx, y+dy);
        if (t === T.CLIFF || t === T.RESOURCE) return false;
      }
    }
    for (const b of Object.values(this.state.buildings)) {
      const bdef = getBuildingDef(b.type);
      if (!bdef) continue;
      const dist = Math.max(Math.abs(b.x - x), Math.abs(b.y - y));
      if (dist < (fp + bdef.footprint) / 2) return false;
    }
    return true;
  }

  _computeFormationOffsets(count) {
    const offsets = [];
    for (let i = 0; i < count; i++) {
      const ring = Math.floor(i / 6) + 1;
      const angle = (i % 6) * (Math.PI * 2 / 6) + ring * 0.3;
      offsets.push({ dx: Math.cos(angle) * ring * 1.2, dy: Math.sin(angle) * ring * 1.2 });
    }
    return offsets;
  }

  // ===================== CLIENT STATE APPLY =====================

  _applyFullState(serverState) {
    if (!serverState) return;

    // The map is never sent over the wire — clients generate it from the seed
    // in _startGame, so this.mapData is already set by the time we receive state.
    const map = this.state?.map || this.mapData;

    // Simple assignment (server state is already plain JSON on client side)
    this.state = Object.assign({}, serverState);
    this.state.map = map;

    // Ensure resources object exists
    if (!this.state.resources) this.state.resources = {};
  }

  _serializeState() {
    if (!this.state) return null;
    // Omit map object (clients generate it from seed in _startGame).
    // Manually copy only the plain-data fields to avoid circular refs.
    return {
      tick:      this.state.tick,
      players:   this.state.players,
      units:     this.state.units,
      buildings: this.state.buildings,
      resources: this.state.resources,
      gameOver:  this.state.gameOver,
    };
  }

  // ===================== INPUT HANDLING =====================

  _attachInputListeners() {
    const canvas = document.getElementById('game-canvas');
    canvas.addEventListener('mousedown',   this._boundOnMouseDown);
    canvas.addEventListener('mouseup',     this._boundOnMouseUp);
    canvas.addEventListener('mousemove',   this._boundOnMouseMove);
    canvas.addEventListener('wheel',       this._boundOnWheel, { passive: false });
    canvas.addEventListener('contextmenu', this._boundOnCtxMenu);
    window.addEventListener('keydown',     this._boundOnKeyDown);
    window.addEventListener('keyup',       this._boundOnKeyUp);
  }

  _onMouseMove(e) {
    this.input.mouseX = e.clientX;
    this.input.mouseY = e.clientY;

    if (this.input.dragStart && !this.placement.active) {
      const dx = e.clientX - this.input.dragStart.x;
      const dy = e.clientY - this.input.dragStart.y;
      if (dx*dx + dy*dy > 100) this.input.isDragging = true;

      if (this.input.isDragging && this.renderer) {
        this.renderer.dragBox = {
          x0: this.input.dragStart.x, y0: this.input.dragStart.y,
          x1: e.clientX, y1: e.clientY,
        };
      }
    }
  }

  _onMouseDown(e) {
    if (!this.state) return;
    const canvas = document.getElementById('game-canvas');
    // Ignore clicks on UI panels
    if (e.target !== canvas) return;

    if (e.button === 0) {
      this.input.dragStart = { x: e.clientX, y: e.clientY };
      this.input.isDragging = false;
    } else if (e.button === 2) {
      this._onRightClick(e);
    }
  }

  _onMouseUp(e) {
    if (!this.state) return;
    if (e.button !== 0) return;

    const canvas = document.getElementById('game-canvas');
    if (e.target !== canvas && !this.input.isDragging) {
      this.input.dragStart = null;
      return;
    }

    if (this.placement.active) {
      this._confirmPlacement(e);
    } else if (this.input.isDragging) {
      this._finishDragSelect(e);
    } else {
      this._onLeftClick(e);
    }

    this.input.dragStart = null;
    this.input.isDragging = false;
    if (this.renderer) this.renderer.dragBox = null;
  }

  _onLeftClick(e) {
    if (!this.renderer || !this.state) return;
    const g = this.renderer.camera.screenToGrid(e.clientX, e.clientY);
    const shift = e.shiftKey;

    // Find entity at click
    const hit = this._hitTest(g.x, g.y);
    if (hit) {
      if (!shift) this.selection = { units: [], buildings: [] };
      if (hit.kind === 'unit')     { this._addToSelection('units',     hit.id); }
      if (hit.kind === 'building') { this._addToSelection('buildings', hit.id); }
    } else {
      if (!shift) this.selection = { units: [], buildings: [] };
    }
  }

  _onRightClick(e) {
    if (!this.renderer || !this.state) return;

    // Cancel placement mode
    if (this.placement.active) {
      this.placement.active = false;
      this.ui.setPlacementMode(false);
      return;
    }

    const g = this.renderer.camera.screenToGrid(e.clientX, e.clientY);
    const hit = this._hitTest(g.x, g.y);
    const selUnits = this.selection.units.filter(id => this.state.units[id]?.player === this.myPlayerId);

    if (hit) {
      if (hit.kind === 'unit') {
        const target = this.state.units[hit.id];
        if (target && target.player !== this.myPlayerId && selUnits.length > 0) {
          // Attack enemy unit
          this.sendCommand({ type: 'ATTACK', unitIds: selUnits, targetId: hit.id });
          this.ui.notify('Attacking!', '');
          return;
        }
      } else if (hit.kind === 'building') {
        const target = this.state.buildings[hit.id];
        if (target && target.player !== this.myPlayerId && selUnits.length > 0) {
          this.sendCommand({ type: 'ATTACK', unitIds: selUnits, targetId: hit.id });
          return;
        }
      } else if (hit.kind === 'resource') {
        const workers = selUnits.filter(id => getUnitDef(this.state.units[id]?.type)?.canHarvest);
        if (workers.length > 0) {
          this.sendCommand({ type: 'HARVEST', unitIds: workers, resourceId: hit.id });
          this.ui.notify('Harvesting!', '');
          return;
        }
      }
    }

    // Move order
    if (selUnits.length > 0) {
      this.sendCommand({ type: 'MOVE', unitIds: selUnits, targetX: Math.round(g.x), targetY: Math.round(g.y) });
    }
  }

  _finishDragSelect(e) {
    if (!this.renderer) return;
    const box = {
      x0: Math.min(this.input.dragStart.x, e.clientX),
      y0: Math.min(this.input.dragStart.y, e.clientY),
      x1: Math.max(this.input.dragStart.x, e.clientX),
      y1: Math.max(this.input.dragStart.y, e.clientY),
    };

    const newSel = [];
    for (const [uid, u] of Object.entries(this.state.units)) {
      if (u.player !== this.myPlayerId) continue;
      const s = this.renderer.camera.gridToScreen(u.x, u.y);
      if (s.x >= box.x0 && s.x <= box.x1 && s.y >= box.y0 && s.y <= box.y1) {
        newSel.push(uid);
      }
    }
    if (newSel.length > 0) {
      this.selection = { units: newSel, buildings: [] };
    }
  }

  _confirmPlacement(e) {
    if (!this.renderer || !this.state) return;
    const g = this.renderer.camera.screenToGrid(e.clientX, e.clientY);
    const gx = Math.round(g.x), gy = Math.round(g.y);
    const def = getBuildingDef(this.placement.buildingType);
    if (!def) return;

    const valid = this.renderer._isValidPlacement(gx, gy, def.footprint, this.state);
    if (!valid) {
      this.ui.notify('Cannot place building there!', 'danger');
      return;
    }
    const player = this.state.players[this.myPlayerId];
    if (player && player.materials < def.cost) {
      this.ui.notify('Not enough materials!', 'danger');
      return;
    }

    this.sendCommand({
      type: 'BUILD',
      workerId: this.placement.workerId,
      buildingType: this.placement.buildingType,
      x: gx, y: gy,
    });

    this.placement.active = false;
    this.ui.setPlacementMode(false);
  }

  _hitTest(gx, gy) {
    if (!this.state) return null;
    const radius = 1.5 / this.renderer.camera.zoom;

    for (const [uid, u] of Object.entries(this.state.units)) {
      const def = getUnitDef(u.type);
      if (!def) continue;
      if (this._distSq(gx, gy, u.x, u.y) < (def.radius + 0.3) ** 2) {
        return { kind: 'unit', id: uid };
      }
    }
    for (const [bid, b] of Object.entries(this.state.buildings)) {
      const def = getBuildingDef(b.type);
      if (!def) continue;
      if (this._distSq(gx, gy, b.x, b.y) < (def.footprint / 2 + 0.5) ** 2) {
        return { kind: 'building', id: bid };
      }
    }
    for (const res of Object.values(this.state.resources || {})) {
      if (this._distSq(gx, gy, res.x, res.y) < 2.5) {
        return { kind: 'resource', id: res.id };
      }
    }
    return null;
  }

  _addToSelection(listName, id) {
    if (!this.selection[listName].includes(id)) {
      this.selection[listName].push(id);
    }
  }

  _onWheel(e) {
    e.preventDefault();
    if (!this.renderer) return;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    this.renderer.camera.zoomBy(delta, e.clientX, e.clientY);
  }

  _onKeyDown(e) {
    this.input.keysDown.add(e.key);

    // Number keys: select control group
    if (e.key >= '1' && e.key <= '9') {
      const n = parseInt(e.key);
      if (e.ctrlKey) {
        e.preventDefault();
        // Assign group
        this.groups[n] = { ...this.selection };
      } else if (this.groups[n]) {
        this.selection = { ...this.groups[n] };
      }
    }

    if (e.key === 'Escape') {
      this.placement.active = false;
      this.ui.setPlacementMode(false);
      this.selection = { units: [], buildings: [] };
    }

    // Camera keys handled in render loop
  }

  _onKeyUp(e) { this.input.keysDown.delete(e.key); }

  // ===================== RENDER LOOP =====================

  _renderLoop() {
    const loop = () => {
      if (this.state && this.renderer) {
        // Keyboard camera scroll
        this._updateCameraFromKeys();
        // Edge scroll
        this._updateEdgeScroll();

        // Update fog
        this.renderer.updateFog(
          this.state.units || {},
          this.state.buildings || {},
          this.myPlayerId
        );

        // Render
        this.renderer.render(
          this.state,
          this.myPlayerId,
          this.selection,
          this.placement,
          this.input
        );

        // Update HUD
        if (this.ui) {
          this.ui.updateHUD(this.state, this.myPlayerId);
          this.ui.updateSelection(this.selection, this.state, this.myPlayerId);
        }

        // Check for game over received from host
        if (this.state.gameOver && !this._gameOverShown) {
          this._gameOverShown = true;
          const go = this.state.gameOver;
          const win = go.winnerId === this.myPlayerId;
          const myStats = this._stats[this.myPlayerId] || {};
          this.ui.showGameOver(win, go.winnerId ? `${go.winnerName} wins!` : 'Draw!', {
            'Materials gathered': myStats.materialsGathered || 0,
            'Units built': myStats.unitsBuilt || 0,
            'Units lost': myStats.unitsLost || 0,
          });
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  _updateCameraFromKeys() {
    if (!this.renderer) return;
    const keys = this.input.keysDown;
    const speed = 8 / this.renderer.camera.zoom;
    if (keys.has('ArrowLeft')  || keys.has('a')) this.renderer.camera.pan(-speed, 0);
    if (keys.has('ArrowRight') || keys.has('d')) this.renderer.camera.pan( speed, 0);
    if (keys.has('ArrowUp')    || keys.has('w')) this.renderer.camera.pan(0, -speed);
    if (keys.has('ArrowDown')  || keys.has('s')) this.renderer.camera.pan(0,  speed);
  }

  _updateEdgeScroll() {
    if (!this.renderer) return;
    const m = this.input, edge = 24, speed = 6 / this.renderer.camera.zoom;
    const W = window.innerWidth, H = window.innerHeight;
    if (m.mouseX < edge)     this.renderer.camera.pan(-speed, 0);
    if (m.mouseX > W - edge) this.renderer.camera.pan( speed, 0);
    if (m.mouseY < edge)     this.renderer.camera.pan(0, -speed);
    if (m.mouseY > H - edge) this.renderer.camera.pan(0,  speed);
  }

  // ===================== PUBLIC API =====================

  sendCommand(cmd) {
    if (!this.network) return;
    this.network.sendCommand(cmd);
  }

  startPlacement(buildingType) {
    const selWorkers = this.selection.units.filter(id => {
      const u = this.state?.units[id];
      return u && u.player === this.myPlayerId && getUnitDef(u.type)?.canBuild;
    });
    if (selWorkers.length === 0) {
      this.ui.notify('Select a worker first!', 'warning');
      return;
    }
    this.placement.active = true;
    this.placement.buildingType = buildingType;
    this.placement.workerId = selWorkers[0];
    this.ui.setPlacementMode(true);
  }

  surrender() {
    this.sendCommand({ type: 'SURRENDER' });
  }

  quitGame() {
    if (this.isHost) {
      clearInterval(this._simInterval);
      this.network.stopBroadcast();
    }
    if (this.network) { this.network.destroy(); this.network = null; }
    this._cleanup();
    this.ui.showScreen('lobby');
  }

  returnToLobby() {
    this.ui.hideGameOver();
    this._gameOverShown = false;
    this.quitGame();
  }

  // ===================== HELPERS =====================

  _distSq(x0, y0, x1, y1) { const dx=x0-x1, dy=y0-y1; return dx*dx+dy*dy; }

  _initStats(peerId) {
    this._stats[peerId] = { unitsBuilt: 0, unitsLost: 0, materialsGathered: 0 };
  }

  _cleanup() {
    window.removeEventListener('keydown', this._boundOnKeyDown);
    window.removeEventListener('keyup',   this._boundOnKeyUp);
    const canvas = document.getElementById('game-canvas');
    canvas.removeEventListener('mousedown',   this._boundOnMouseDown);
    canvas.removeEventListener('mouseup',     this._boundOnMouseUp);
    canvas.removeEventListener('mousemove',   this._boundOnMouseMove);
    canvas.removeEventListener('wheel',       this._boundOnWheel);
    canvas.removeEventListener('contextmenu', this._boundOnCtxMenu);

    clearInterval(this._simInterval);
    this._simInterval = null;
    this.state = null;
    this.selection = { units: [], buildings: [] };
    this.placement = { active: false, buildingType: null, workerId: null };
    this._commandQueue = [];
    this._gameOverShown = false;
    if (this.renderer) { this.renderer.fogGrid.fill(0); this.renderer.dragBox = null; }
  }
}

// ===================== ENTRY POINT =====================
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();
  window.game.init();
});
