// ui.js — All UI management: lobby, in-game HUD, selection panel, minimap, menus

'use strict';

class UIManager {
  constructor(game) {
    this.game = game;

    // Screen elements
    this.$lobby    = document.getElementById('lobby-screen');
    this.$pregame  = document.getElementById('pregame-screen');
    this.$game     = document.getElementById('game-screen');

    // Lobby
    this.$lobbyStatus   = document.getElementById('lobby-status');
    this.$hostName      = document.getElementById('host-player-name');
    this.$hostGameName  = document.getElementById('host-game-name');
    this.$hostMaxPlayers= document.getElementById('host-max-players');
    this.$hostPin       = document.getElementById('host-pin');
    this.$btnHost       = document.getElementById('btn-host');
    this.$joinName      = document.getElementById('join-player-name');
    this.$gameList      = document.getElementById('game-list');
    this.$btnRefresh    = document.getElementById('btn-refresh');
    this.$joinRoomCode  = document.getElementById('join-room-code');
    this.$btnJoinCode   = document.getElementById('btn-join-code');

    // Pre-game
    this.$pregameTitle  = document.getElementById('pregame-title');
    this.$roomCode      = document.getElementById('room-code-display');
    this.$btnCopyCode   = document.getElementById('btn-copy-code');
    this.$playerSlots   = document.getElementById('player-slots');
    this.$btnStart      = document.getElementById('btn-start-game');
    this.$pregameStatus = document.getElementById('pregame-status');
    this.$btnLeave      = document.getElementById('btn-leave-lobby');

    // HUD
    this.$resourceCount = document.getElementById('resource-count');
    this.$supplyCount   = document.getElementById('supply-count');
    this.$playerListHUD = document.getElementById('player-list-hud');
    this.$selectionInfo = document.getElementById('selection-info');
    this.$selPortrait   = document.getElementById('selection-portrait');
    this.$selDetails    = document.getElementById('selection-details');
    this.$selHealthBar  = document.getElementById('selection-health-bar');
    this.$selHealthFill = document.getElementById('selection-health-fill');
    this.$commandCard   = document.getElementById('command-card');
    this.$notifArea     = document.getElementById('notification-area');
    this.$placementHint = document.getElementById('placement-hint');
    this.$btnMenu       = document.getElementById('btn-menu');

    // Overlays
    this.$menuOverlay   = document.getElementById('menu-overlay');
    this.$btnSurrender  = document.getElementById('btn-surrender');
    this.$btnQuit       = document.getElementById('btn-quit');
    this.$btnCloseMenu  = document.getElementById('btn-close-menu');
    this.$pinDialog     = document.getElementById('pin-dialog');
    this.$pinInput      = document.getElementById('pin-input');
    this.$btnPinSubmit  = document.getElementById('btn-pin-submit');
    this.$btnPinCancel  = document.getElementById('btn-pin-cancel');
    this.$gameoverScreen= document.getElementById('gameover-screen');
    this.$gameoverTitle = document.getElementById('gameover-title');
    this.$gameoverMsg   = document.getElementById('gameover-message');
    this.$gameoverStats = document.getElementById('gameover-stats');
    this.$btnGameoverOK = document.getElementById('btn-gameover-ok');
    this.$loadingOverlay= document.getElementById('loading-overlay');
    this.$loadingMsg    = document.getElementById('loading-message');

    this._pendingJoinRoom = null;
    this._notifTimers = [];

    this._bindEvents();
  }

  _bindEvents() {
    // Lobby
    this.$btnHost.addEventListener('click', () => this._onHostClick());
    this.$btnRefresh.addEventListener('click', () => this._onRefreshClick());
    this.$btnJoinCode.addEventListener('click', () => this._onJoinCodeClick());
    this.$joinRoomCode.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._onJoinCodeClick();
      this.$joinRoomCode.value = this.$joinRoomCode.value.toUpperCase();
    });

    // Pre-game
    this.$btnCopyCode.addEventListener('click', () => {
      navigator.clipboard.writeText(this.$roomCode.textContent).catch(() => {});
      this.notify('Room code copied!', 'success');
    });
    this.$btnStart.addEventListener('click', () => this.game.hostStartGame());
    this.$btnLeave.addEventListener('click', () => this.game.leaveLobby());

    // Menu
    this.$btnMenu.addEventListener('click', () => this.showMenu());
    this.$btnCloseMenu.addEventListener('click', () => this.hideMenu());
    this.$btnSurrender.addEventListener('click', () => {
      this.hideMenu();
      this.game.surrender();
    });
    this.$btnQuit.addEventListener('click', () => {
      if (confirm('Quit? Other players can continue. You can rejoin with your room code.')) {
        this.game.quitGame();
      }
    });

    // PIN dialog
    this.$btnPinSubmit.addEventListener('click', () => this._onPinSubmit());
    this.$btnPinCancel.addEventListener('click', () => { this.$pinDialog.classList.add('hidden'); });
    this.$pinInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') this._onPinSubmit(); });

    // Game over
    this.$btnGameoverOK.addEventListener('click', () => this.game.returnToLobby());

    // Minimap click → move camera
    document.getElementById('minimap-canvas').addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      const fx = (e.clientX - rect.left) / rect.width;
      const fy = (e.clientY - rect.top)  / rect.height;
      const gx = fx * MAP_SIZE, gy = fy * MAP_SIZE;
      if (this.game.renderer) this.game.renderer.camera.panTo(gx, gy);
    });
  }

  // ---- Screen Management ----
  showScreen(name) {
    this.$lobby.classList.remove('active');
    this.$pregame.classList.remove('active');
    this.$game.classList.remove('active');
    if (name === 'lobby')   { this.$lobby.classList.add('active'); }
    if (name === 'pregame') { this.$pregame.classList.add('active'); }
    if (name === 'game')    { this.$game.classList.add('active'); }
  }

  setLobbyStatus(msg, error = false) {
    this.$lobbyStatus.textContent = msg;
    this.$lobbyStatus.style.color = error ? '#f85149' : '#58a6ff';
  }

  showLoading(msg = 'Connecting...') {
    this.$loadingMsg.textContent = msg;
    this.$loadingOverlay.classList.remove('hidden');
  }
  hideLoading() { this.$loadingOverlay.classList.add('hidden'); }

  // ---- Lobby Actions ----
  _onHostClick() {
    const name     = this.$hostName.value.trim() || 'Commander';
    const gameName = this.$hostGameName.value.trim() || `${name}'s Game`;
    const max      = parseInt(this.$hostMaxPlayers.value, 10) || 4;
    const pin      = this.$hostPin.value.trim() || null;
    this.game.hostGame({ playerName: name, gameName, maxPlayers: max, pin });
  }

  async _onRefreshClick() {
    this.$btnRefresh.disabled = true;
    this.$gameList.innerHTML = '<div class="game-list-empty">Scanning...</div>';
    try {
      const games = await NetworkManager.discoverGames();
      this._renderGameList(games);
    } catch (e) {
      this.$gameList.innerHTML = '<div class="game-list-empty">Scan failed. Check connection.</div>';
    }
    this.$btnRefresh.disabled = false;
  }

  _renderGameList(games) {
    if (!games || games.length === 0) {
      this.$gameList.innerHTML = '<div class="game-list-empty">No games found. Host one or enter a code.</div>';
      return;
    }
    this.$gameList.innerHTML = '';
    for (const g of games) {
      const div = document.createElement('div');
      div.className = 'game-entry';
      const playerStr = `${g.currentPlayers || 1}/${g.maxPlayers || 4} players`;
      const pingStr = g.ping ? `${g.ping}ms` : '?';
      div.innerHTML = `
        <div class="game-entry-info">
          <div class="game-name">${this._esc(g.gameName || 'Unnamed Game')}</div>
          <div class="game-meta">${playerStr} &bull; ${pingStr} &bull; ${g.mapName || 'Plains of Battle'}</div>
        </div>
        <div class="game-entry-right">
          ${g.pin ? '<span class="lock-icon">🔒</span>' : ''}
          <span class="ping-badge">${pingStr}</span>
        </div>`;
      div.addEventListener('click', () => this._onGameEntryClick(g));
      this.$gameList.appendChild(div);
    }
  }

  _onGameEntryClick(gameInfo) {
    this._pendingJoinRoom = gameInfo.roomCode;
    if (gameInfo.pin) {
      this.$pinInput.value = '';
      this.$pinDialog.classList.remove('hidden');
    } else {
      this._doJoin(gameInfo.roomCode, null);
    }
  }

  _onPinSubmit() {
    const pin = this.$pinInput.value.trim();
    this.$pinDialog.classList.add('hidden');
    if (this._pendingJoinRoom) this._doJoin(this._pendingJoinRoom, pin);
  }

  _onJoinCodeClick() {
    const code = this.$joinRoomCode.value.trim().toUpperCase();
    if (code.length !== 6) {
      this.setLobbyStatus('Enter a valid 6-character room code.', true);
      return;
    }
    this._doJoin(code, null);
  }

  _doJoin(roomCode, pin) {
    const name = this.$joinName.value.trim() || 'Commander';
    this.game.joinGame({ playerName: name, roomCode, pin });
  }

  // ---- Pre-Game Lobby UI ----
  updatePregame(roomCode, players, isHost, maxPlayers) {
    this.$roomCode.textContent = roomCode;
    this.$btnStart.classList.toggle('hidden', !isHost);
    this.$pregameStatus.textContent = isHost ? 'Waiting for players...' : 'Waiting for host to start...';

    this.$playerSlots.innerHTML = '';
    for (let i = 0; i < maxPlayers; i++) {
      const p = players[i];
      const div = document.createElement('div');
      div.className = 'player-slot' + (p ? '' : ' empty');
      div.innerHTML = p ? `
        <div class="player-slot-color" style="background:${PLAYER_COLORS[i]}"></div>
        <span class="player-slot-name">${this._esc(p.name)}</span>
        <span class="player-slot-status">${p.isHost ? '👑 Host' : 'Ready'}</span>
      ` : `
        <div class="player-slot-color" style="background:${PLAYER_COLORS[i]};opacity:0.3"></div>
        <span class="player-slot-name">Waiting...</span>
        <span class="player-slot-status"></span>
      `;
      this.$playerSlots.appendChild(div);
    }
  }

  // ---- In-Game HUD ----
  updateHUD(state, myPlayerId) {
    if (!state || !myPlayerId) return;
    const player = state.players[myPlayerId];
    if (!player) return;

    this.$resourceCount.textContent = Math.floor(player.materials);
    this.$supplyCount.textContent   = `${player.usedSupply}/${player.maxSupply}`;

    // Player list
    this.$playerListHUD.innerHTML = '';
    for (const p of Object.values(state.players)) {
      const div = document.createElement('div');
      div.className = 'player-hud-entry' + (p.eliminated ? ' eliminated' : '');
      const statusText = p.eliminated ? 'Defeated' : (p.connected ? '' : '⚡ Disconnected');
      div.innerHTML = `
        <div class="player-hud-dot" style="background:${PLAYER_COLORS[p.colorIdx]}"></div>
        <span class="player-hud-name">${this._esc(p.name)}</span>
        ${statusText ? `<span class="player-hud-status">${statusText}</span>` : ''}
      `;
      this.$playerListHUD.appendChild(div);
    }
  }

  // ---- Selection Panel ----
  updateSelection(selection, state, myPlayerId) {
    if (!state) return;
    const { units: selUnits, buildings: selBuildings } = selection;
    const totalSel = selUnits.length + selBuildings.length;

    // Reset
    this.$selPortrait.innerHTML = '';
    this.$selDetails.innerHTML = '';
    this.$selHealthBar.classList.add('hidden');
    this.$commandCard.innerHTML = '';

    if (totalSel === 0) {
      this.$selDetails.innerHTML = '<p class="no-selection">Nothing selected</p>';
      return;
    }

    if (totalSel === 1) {
      // Single selection
      const id = selUnits[0] || selBuildings[0];
      const isUnit = selUnits.length > 0;
      const entity = isUnit ? state.units[id] : state.buildings[id];
      if (!entity) return;

      const def = isUnit ? getUnitDef(entity.type) : getBuildingDef(entity.type);
      if (!def) return;

      const pIdx = state.players[entity.player]?.colorIdx ?? 0;
      const isOwn = entity.player === myPlayerId;

      // Portrait
      this.$selPortrait.textContent = def.icon;
      this.$selPortrait.style.borderColor = PLAYER_COLORS[pIdx];

      // Details
      const hpPct = entity.hp / def.hp;
      const hpColor = hpPct > 0.6 ? '#3fb950' : hpPct > 0.3 ? '#d29922' : '#f85149';
      let html = `<div class="sel-name">${def.name}</div>`;
      html += `<div class="sel-stat">HP: <strong style="color:${hpColor}">${Math.ceil(entity.hp)}/${def.hp}</strong></div>`;
      html += `<div class="sel-stat">Owner: <strong>${this._esc(state.players[entity.player]?.name || '?')}</strong></div>`;
      if (isUnit) {
        html += `<div class="sel-stat">State: <strong>${entity.state}</strong></div>`;
        if (entity.state === 'harvesting') {
          const pct = Math.floor((entity.harvestTimer / (HARVEST_DURATION * TICK_RATE)) * 100);
          html += `<div class="sel-stat">Harvesting: <strong>${pct}%</strong></div>`;
        }
      } else {
        // Building: show queue
        if (entity.buildProgress < 1) {
          html += `<div class="sel-stat">Building: <strong>${Math.floor(entity.buildProgress * 100)}%</strong></div>`;
        } else if (entity.queue && entity.queue.length > 0) {
          html += '<div class="production-queue">';
          for (const qi of entity.queue) {
            const qdef = getUnitDef(qi.type);
            if (!qdef) continue;
            const qpct = 1 - qi.timer / (qdef.buildTimeSec * TICK_RATE);
            html += `<div class="queue-item">
              <span class="queue-item-name">${qdef.icon} ${qdef.name}</span>
              <div class="queue-progress-bar"><div class="queue-progress-fill" style="width:${qpct*100}%"></div></div>
            </div>`;
          }
          html += '</div>';
        }
        // Show upgrade levels for armory
        if (entity.type === 'armory' && isOwn) {
          const player = state.players[entity.player];
          if (player) {
            const upg = player.upgrades;
            html += '<div style="margin-top:4px">';
            for (const [key, val] of Object.entries(upg)) {
              const def2 = BUILDING_DEFS.armory.upgrades[key];
              if (!def2) continue;
              html += `<div class="upgrade-row">${def2.icon} ${def2.name.split(' ')[0]}:
                <div class="upgrade-pips">
                  ${[0,1,2].map(i => `<div class="upgrade-pip ${i<val?' filled':''}"></div>`).join('')}
                </div></div>`;
            }
            html += '</div>';
          }
        }
      }
      this.$selDetails.innerHTML = html;

      // HP bar
      this.$selHealthBar.classList.remove('hidden');
      this.$selHealthFill.style.width = `${hpPct * 100}%`;
      this.$selHealthFill.style.background = hpColor;

      // Command card (own units only)
      if (isOwn && entity.buildProgress !== undefined && entity.buildProgress < 1) {
        // Under construction — no commands
        return;
      }
      if (isOwn) {
        this._buildCommandCard(entity, def, isUnit, state, myPlayerId);
      }

    } else {
      // Multi-selection summary
      this.$selPortrait.textContent = '✦';
      this.$selPortrait.style.borderColor = '#58a6ff';
      let html = `<div class="sel-name">${totalSel} units selected</div>`;
      const types = {};
      for (const id of selUnits) {
        const u = state.units[id];
        if (u) types[u.type] = (types[u.type] || 0) + 1;
      }
      for (const [t, n] of Object.entries(types)) {
        const d = getUnitDef(t);
        html += `<div class="sel-stat">${d ? d.icon + ' ' + d.name : t}: <strong>${n}</strong></div>`;
      }
      this.$selDetails.innerHTML = html;
      // Move/stop commands for multi-select
      this._addCmd('🚶 Move', 'Move selected units (right-click ground)', false, null);
      this._addCmd('⛔ Stop', 'Stop all selected units', false, () => {
        this.game.sendCommand({ type: 'STOP', unitIds: selUnits });
      });
    }
  }

  _buildCommandCard(entity, def, isUnit, state, myPlayerId) {
    const player = state.players[myPlayerId];
    if (!player) return;

    if (isUnit && entity.type === 'worker') {
      // Worker: build commands (no HQ — it's a starting building only)
      this._addCmd('⚔ Barracks', `Barracks (${BUILDING_DEFS.barracks.cost}m)`, player.materials < BUILDING_DEFS.barracks.cost, () => this.game.startPlacement('barracks'));
      this._addCmd('🏭 Factory', `Factory (${BUILDING_DEFS.factory.cost}m)`, player.materials < BUILDING_DEFS.factory.cost, () => this.game.startPlacement('factory'));
      this._addCmd('🔬 Armory', `Armory (${BUILDING_DEFS.armory.cost}m)`, player.materials < BUILDING_DEFS.armory.cost, () => this.game.startPlacement('armory'));
      this._addCmd('⛔ Stop', 'Stop moving', false, () => {
        this.game.sendCommand({ type: 'STOP', unitIds: [entity.id] });
      });
    } else if (isUnit) {
      this._addCmd('⛔ Stop', 'Stop unit', false, () => {
        this.game.sendCommand({ type: 'STOP', unitIds: [entity.id] });
      });
    } else if (!isUnit && def.produces && def.produces.length > 0 && entity.buildProgress >= 1) {
      // Producing building
      const queueFull = entity.queue && entity.queue.length >= 5;
      for (const ut of def.produces) {
        const udef = getUnitDef(ut);
        if (!udef) continue;
        const cantAfford = player.materials < udef.cost;
        const supplyFull = player.usedSupply + udef.supply > player.maxSupply;
        const disabled = queueFull || cantAfford || supplyFull;
        const hint = queueFull ? 'Queue full' : cantAfford ? 'Need materials' : supplyFull ? 'Supply cap!' : `Produce (${udef.cost}m)`;
        this._addCmd(`${udef.icon} ${udef.name}`, hint, disabled, () => {
          this.game.sendCommand({ type: 'PRODUCE', buildingId: entity.id, unitType: ut });
        });
      }
      if (entity.queue && entity.queue.length > 0) {
        this._addCmd('✕ Cancel', 'Cancel last queued unit', false, () => {
          this.game.sendCommand({ type: 'CANCEL_PRODUCE', buildingId: entity.id });
        });
      }
    } else if (!isUnit && entity.type === 'armory' && entity.buildProgress >= 1) {
      // Armory upgrades
      for (const [key, upg] of Object.entries(BUILDING_DEFS.armory.upgrades)) {
        const curLevel = player.upgrades[key] || 0;
        if (curLevel >= upg.maxLevel) {
          this._addCmd(`${upg.icon} ${key.replace(/([A-Z])/g,' $1')} MAX`, 'Max level', true, null);
        } else {
          const nextCost = upg.cost * (curLevel + 1);
          const cantAfford = player.materials < nextCost;
          const upgrading = entity.upgradingTimer !== null;
          this._addCmd(`${upg.icon} ${upg.name}`, `Level ${curLevel+1} (${nextCost}m)`, cantAfford || upgrading, () => {
            this.game.sendCommand({ type: 'UPGRADE', armoryId: entity.id, upgradeType: key });
          });
        }
      }
    }
  }

  _addCmd(label, title, disabled, onClick) {
    const btn = document.createElement('button');
    btn.className = 'cmd-btn' + (disabled ? ' disabled' : '');
    btn.title = title || '';
    btn.innerHTML = label;
    if (!disabled && onClick) btn.addEventListener('click', onClick);
    this.$commandCard.appendChild(btn);
  }

  // ---- Notifications ----
  notify(text, type = '') {
    const div = document.createElement('div');
    div.className = 'notification' + (type ? ` ${type}` : '');
    div.textContent = text;
    this.$notifArea.appendChild(div);
    const t = setTimeout(() => {
      div.style.opacity = '0';
      div.style.transition = 'opacity 0.3s';
      setTimeout(() => div.remove(), 300);
    }, 3000);
    this._notifTimers.push(t);
    // Limit notifications shown
    while (this.$notifArea.children.length > 5) {
      this.$notifArea.firstChild.remove();
    }
  }

  // ---- Placement Mode UI ----
  setPlacementMode(active) {
    this.$placementHint.classList.toggle('hidden', !active);
  }

  // ---- Menu ----
  showMenu() { this.$menuOverlay.classList.remove('hidden'); }
  hideMenu() { this.$menuOverlay.classList.add('hidden'); }

  // ---- Game Over ----
  showGameOver(win, message, stats) {
    this.$gameoverTitle.textContent = win ? '🏆 Victory!' : '💀 Defeated';
    this.$gameoverTitle.className = win ? 'win' : 'lose';
    this.$gameoverMsg.textContent = message || '';

    let statsHtml = '';
    if (stats) {
      for (const [key, val] of Object.entries(stats)) {
        statsHtml += `<div class="gameover-stat"><span>${key}</span><strong>${val}</strong></div>`;
      }
    }
    this.$gameoverStats.innerHTML = statsHtml;
    this.$gameoverScreen.classList.remove('hidden');
  }

  hideGameOver() { this.$gameoverScreen.classList.add('hidden'); }

  // ---- Utility ----
  _esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}
