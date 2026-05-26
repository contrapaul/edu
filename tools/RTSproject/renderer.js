// renderer.js — Isometric rendering, fog of war, and camera management
//
// Isometric math:
//   screenX = (gridX - gridY) * HALF_TILE_W + camOffsetX
//   screenY = (gridX + gridY) * HALF_TILE_H + camOffsetY
// Where HALF_TILE_W = 32, HALF_TILE_H = 16 (tile = 64x32 diamond)
//
// Fog of war uses a second off-screen canvas composited as an overlay.

'use strict';

const TILE_W = 64;   // isometric tile width in pixels
const TILE_H = 32;   // isometric tile height in pixels
const HALF_W = 32;
const HALF_H = 16;

// Terrain tile colors
const TERRAIN_COLORS = {
  [T.PLAIN]:  '#2d5a1b',
  [T.DIRT]:   '#7a5c3a',
  [T.ROCK]:   '#555a60',
  [T.CLIFF]:  '#3a3a3a',
  [T.RESOURCE]:'#1a4a2a',
};
const CLIFF_SIDE_COLOR = '#222226';
const CLIFF_TOP_COLOR  = '#444450';
const CLIFF_HEIGHT_PX  = 20;   // pixel height of cliff side

class Camera {
  constructor(canvasW, canvasH) {
    this.x = 0;         // world-space pan (screen pixels)
    this.y = 0;
    this.zoom = 1.0;
    this.minZoom = 0.5;
    this.maxZoom = 1.5;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
  }

  // Convert grid coords to canvas pixel position
  gridToScreen(gx, gy) {
    const wx = (gx - gy) * HALF_W;
    const wy = (gx + gy) * HALF_H;
    return {
      x: (wx - this.x) * this.zoom + this.canvasW / 2,
      y: (wy - this.y) * this.zoom + this.canvasH / 2,
    };
  }

  // Convert canvas pixel position to grid coords
  screenToGrid(sx, sy) {
    const wx = (sx - this.canvasW / 2) / this.zoom + this.x;
    const wy = (sy - this.canvasH / 2) / this.zoom + this.y;
    return {
      x: (wx / HALF_W + wy / HALF_H) / 2,
      y: (wy / HALF_H - wx / HALF_W) / 2,
    };
  }

  pan(dx, dy) {
    this.x += dx / this.zoom;
    this.y += dy / this.zoom;
    this._clamp();
  }

  panTo(gx, gy) {
    this.x = (gx - gy) * HALF_W;
    this.y = (gx + gy) * HALF_H;
  }

  zoomBy(delta, pivotSX, pivotSY) {
    const oldZoom = this.zoom;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom + delta));
    // Keep pivot point stable
    const scale = this.zoom / oldZoom;
    const cx = this.canvasW / 2, cy = this.canvasH / 2;
    this.x += (pivotSX - cx) / oldZoom - (pivotSX - cx) / this.zoom;
    this.y += (pivotSY - cy) / oldZoom - (pivotSY - cy) / this.zoom;
    this._clamp();
  }

  _clamp() {
    const maxWorld = MAP_SIZE * HALF_H * 2;
    this.x = Math.max(-maxWorld, Math.min(maxWorld, this.x));
    this.y = Math.max(-maxWorld, Math.min(maxWorld, this.y));
  }
}

class GameRenderer {
  constructor(canvas, minimapCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.minimapCanvas = minimapCanvas;
    this.mmCtx = minimapCanvas.getContext('2d');
    this.camera = new Camera(canvas.width, canvas.height);

    // Off-screen fog canvas
    this.fogCanvas = document.createElement('canvas');
    this.fogCanvas.width  = canvas.width;
    this.fogCanvas.height = canvas.height;
    this.fogCtx = this.fogCanvas.getContext('2d');

    // Fog state: 0=unseen, 1=seen(dark), 2=visible
    this.fogGrid = new Uint8Array(MAP_SIZE * MAP_SIZE);

    // Drag select box
    this.dragBox = null;  // {x0,y0,x1,y1} in screen coords

    this._minimapDirtyTimer = 0;
    this._minimapCache = null;
  }

  resize(w, h) {
    this.canvas.width  = w;
    this.canvas.height = h;
    this.fogCanvas.width  = w;
    this.fogCanvas.height = h;
    this.camera.canvasW = w;
    this.camera.canvasH = h;
  }

  // ---- Fog of War ----
  updateFog(units, buildings, myPlayerId) {
    // Reset visible tiles to "seen" (not currently visible)
    for (let i = 0; i < this.fogGrid.length; i++) {
      if (this.fogGrid[i] === 2) this.fogGrid[i] = 1;
    }

    const reveal = (cx, cy, r) => {
      const r2 = r * r;
      const ir = Math.ceil(r);
      for (let dy = -ir; dy <= ir; dy++) {
        for (let dx = -ir; dx <= ir; dx++) {
          if (dx*dx + dy*dy <= r2) {
            const gx = Math.floor(cx + dx);
            const gy = Math.floor(cy + dy);
            if (gx >= 0 && gy >= 0 && gx < MAP_SIZE && gy < MAP_SIZE) {
              this.fogGrid[gy * MAP_SIZE + gx] = 2;
            }
          }
        }
      }
    };

    if (myPlayerId === null) {
      // Observer: see everything
      this.fogGrid.fill(2);
      return;
    }

    for (const u of Object.values(units)) {
      if (u.player !== myPlayerId) continue;
      const def = getUnitDef(u.type);
      if (def) reveal(u.x, u.y, def.visionRange);
    }
    for (const b of Object.values(buildings)) {
      if (b.player !== myPlayerId) continue;
      const def = getBuildingDef(b.type);
      if (def) reveal(b.x, b.y, def.visionRange + 1);
    }
  }

  isTileVisible(gx, gy) {
    if (gx < 0 || gy < 0 || gx >= MAP_SIZE || gy >= MAP_SIZE) return false;
    return this.fogGrid[gy * MAP_SIZE + gx] === 2;
  }

  isTileSeen(gx, gy) {
    if (gx < 0 || gy < 0 || gx >= MAP_SIZE || gy >= MAP_SIZE) return false;
    return this.fogGrid[gy * MAP_SIZE + gx] >= 1;
  }

  // ---- Main Render ----
  render(state, myPlayerId, selection, placementState, inputState) {
    if (!state) return;
    const { ctx, camera } = this;
    const W = this.canvas.width, H = this.canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Compute visible tile range (cull off-screen)
    const tl = camera.screenToGrid(0, 0);
    const br = camera.screenToGrid(W, H);
    const minGX = Math.max(0, Math.floor(Math.min(tl.x, br.x, tl.x+(br.y-tl.y))) - 2);
    const maxGX = Math.min(MAP_SIZE-1, Math.ceil(Math.max(tl.x, br.x, tl.x+(br.y-tl.y))) + 2);
    const minGY = Math.max(0, Math.floor(Math.min(tl.y, br.y)) - 2);
    const maxGY = Math.min(MAP_SIZE-1, Math.ceil(Math.max(tl.y, br.y, tl.y+(br.x-tl.x))) + 2);

    // Draw terrain tiles (Y-sorted)
    this._drawTerrain(state.map, minGX, maxGX, minGY, maxGY);

    // Draw resources
    this._drawResources(state.resources, myPlayerId);

    // Collect and Y-sort all entities
    const entities = [];
    for (const b of Object.values(state.buildings)) {
      entities.push({ sortKey: b.x + b.y, kind: 'building', data: b });
    }
    for (const u of Object.values(state.units)) {
      entities.push({ sortKey: u.x + u.y, kind: 'unit', data: u });
    }
    entities.sort((a, b) => a.sortKey - b.sortKey);

    for (const e of entities) {
      if (e.kind === 'building') {
        this._drawBuilding(e.data, state, myPlayerId, selection);
      } else {
        this._drawUnit(e.data, state, myPlayerId, selection);
      }
    }

    // Building placement preview
    if (placementState && placementState.active && inputState) {
      this._drawPlacementPreview(placementState, inputState, state);
    }

    // Drag selection box
    if (this.dragBox) {
      this._drawDragBox();
    }

    // Fog of war overlay
    this._drawFog(W, H);

    // Minimap (rate-limited)
    this._minimapDirtyTimer++;
    if (this._minimapDirtyTimer >= 3) {
      this._minimapDirtyTimer = 0;
      this._drawMinimap(state, myPlayerId);
    }
  }

  // ---- Terrain ----
  _drawTerrain(mapData, x0, x1, y0, y1) {
    if (!mapData) return;
    const { ctx, camera } = this;

    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        const t = mapData.getTerrain(gx, gy);
        const seen = this.isTileSeen(gx, gy);
        if (!seen) continue;

        const s = camera.gridToScreen(gx, gy);
        const z = camera.zoom;

        if (t === T.CLIFF) {
          // Draw cliff side (below tile) then top
          ctx.fillStyle = CLIFF_SIDE_COLOR;
          ctx.beginPath();
          ctx.moveTo(s.x,           s.y + HALF_H * z);
          ctx.lineTo(s.x + HALF_W * z, s.y + HALF_H * z + CLIFF_HEIGHT_PX * z);
          ctx.lineTo(s.x,           s.y + TILE_H  * z + CLIFF_HEIGHT_PX * z);
          ctx.lineTo(s.x - HALF_W * z, s.y + HALF_H * z + CLIFF_HEIGHT_PX * z);
          ctx.closePath();
          ctx.fill();

          // Cliff top (slightly lighter)
          ctx.fillStyle = CLIFF_TOP_COLOR;
          ctx.beginPath();
          ctx.moveTo(s.x,           s.y);
          ctx.lineTo(s.x + HALF_W * z, s.y + HALF_H * z);
          ctx.lineTo(s.x,           s.y + TILE_H  * z);
          ctx.lineTo(s.x - HALF_W * z, s.y + HALF_H * z);
          ctx.closePath();
          ctx.fill();
        } else {
          // Flat tile
          let color = TERRAIN_COLORS[t] || TERRAIN_COLORS[T.PLAIN];
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(s.x,           s.y);
          ctx.lineTo(s.x + HALF_W * z, s.y + HALF_H * z);
          ctx.lineTo(s.x,           s.y + TILE_H  * z);
          ctx.lineTo(s.x - HALF_W * z, s.y + HALF_H * z);
          ctx.closePath();
          ctx.fill();

          // Grid lines (subtle)
          ctx.strokeStyle = 'rgba(0,0,0,0.12)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // ---- Resources ----
  _drawResources(resources, myPlayerId) {
    if (!resources) return;
    const { ctx, camera } = this;

    for (const res of Object.values(resources)) {
      const gx = Math.floor(res.x), gy = Math.floor(res.y);
      if (!this.isTileSeen(gx, gy)) continue;
      const s = camera.gridToScreen(res.x, res.y);
      const z = camera.zoom;

      const visible = this.isTileVisible(gx, gy);
      const alpha = visible ? 1 : 0.4;

      // Crystal-like cluster
      ctx.globalAlpha = alpha;
      const size = 14 * z;
      ctx.fillStyle = '#1a8a6e';
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 1.5 * z;

      // Draw 3 crystals
      for (let i = 0; i < 3; i++) {
        const ox = (i - 1) * 8 * z;
        const oy = (i % 2) * (-4) * z;
        ctx.beginPath();
        ctx.moveTo(s.x + ox, s.y + oy - size * 0.6);
        ctx.lineTo(s.x + ox + size * 0.3, s.y + oy);
        ctx.lineTo(s.x + ox, s.y + oy + size * 0.4);
        ctx.lineTo(s.x + ox - size * 0.3, s.y + oy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Amount bar
      if (visible && res.amount > 0) {
        const pct = res.amount / res.maxAmount;
        const bw = 30 * z, bh = 4 * z;
        ctx.fillStyle = '#333';
        ctx.fillRect(s.x - bw/2, s.y + 18*z, bw, bh);
        ctx.fillStyle = '#4ecdc4';
        ctx.fillRect(s.x - bw/2, s.y + 18*z, bw * pct, bh);
      }
      ctx.globalAlpha = 1;
    }
  }

  // ---- Buildings ----
  _drawBuilding(b, state, myPlayerId, selection) {
    const def = getBuildingDef(b.type);
    if (!def) return;

    const gx = Math.floor(b.x), gy = Math.floor(b.y);
    if (!this.isTileSeen(gx, gy)) return;

    const visible = this.isTileVisible(gx, gy);
    // Enemy buildings only visible when in range
    if (b.player !== myPlayerId && !visible) return;

    const { ctx, camera } = this;
    const s = camera.gridToScreen(b.x, b.y);
    const z = camera.zoom;

    const pIdx = state.players[b.player]?.colorIdx ?? 0;
    const color = PLAYER_COLORS[pIdx];
    const fp = def.footprint;
    const bw = fp * HALF_W * z * 0.9;
    const bh = fp * HALF_H * z * 0.9;

    const dimmed = !visible ? 0.5 : (b.buildProgress < 1 ? 0.7 : 1);
    ctx.globalAlpha = dimmed;

    // Building shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(s.x, s.y + bh * 0.5, bw * 0.6, bh * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3D isometric box body
    const tw = bw * 0.85, th = bh * 0.85;
    const hpx = 20 * z * (fp / 2); // building height

    // Top face
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(s.x,     s.y - hpx);
    ctx.lineTo(s.x + tw/2, s.y - hpx + th/2);
    ctx.lineTo(s.x,     s.y - hpx + th);
    ctx.lineTo(s.x - tw/2, s.y - hpx + th/2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1 * z;
    ctx.stroke();

    // Right face
    ctx.fillStyle = this._shadeColor(color, -40);
    ctx.beginPath();
    ctx.moveTo(s.x + tw/2, s.y - hpx + th/2);
    ctx.lineTo(s.x + tw/2, s.y + th/2);
    ctx.lineTo(s.x,        s.y + th);
    ctx.lineTo(s.x,        s.y - hpx + th);
    ctx.closePath();
    ctx.fill();

    // Left face
    ctx.fillStyle = this._shadeColor(color, -60);
    ctx.beginPath();
    ctx.moveTo(s.x - tw/2, s.y - hpx + th/2);
    ctx.lineTo(s.x - tw/2, s.y + th/2);
    ctx.lineTo(s.x,        s.y + th);
    ctx.lineTo(s.x,        s.y - hpx + th);
    ctx.closePath();
    ctx.fill();

    // Construction progress overlay
    if (b.buildProgress < 1) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.moveTo(s.x,     s.y - hpx);
      ctx.lineTo(s.x + tw/2, s.y - hpx + th/2);
      ctx.lineTo(s.x,     s.y - hpx + th);
      ctx.lineTo(s.x - tw/2, s.y - hpx + th/2);
      ctx.closePath();
      ctx.fill();
      // Progress bar
      const bpw = 40 * z;
      ctx.fillStyle = '#333';
      ctx.fillRect(s.x - bpw/2, s.y - hpx - 8*z, bpw, 4*z);
      ctx.fillStyle = '#4fc3f7';
      ctx.fillRect(s.x - bpw/2, s.y - hpx - 8*z, bpw * b.buildProgress, 4*z);
    }

    // Building icon text
    if (z > 0.6) {
      ctx.globalAlpha = dimmed * 0.9;
      ctx.font = `${14 * z}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(def.icon, s.x, s.y - hpx + th/2 - 2*z);
    }

    // HP bar
    if (visible && b.hp < def.hp) {
      this._drawHPBar(ctx, s.x, s.y - hpx - 12*z, b.hp, def.hp, 40*z, 5*z);
    }

    // Selection ring
    if (selection.buildings.includes(b.id)) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2 * z;
      ctx.setLineDash([4*z, 4*z]);
      ctx.beginPath();
      ctx.ellipse(s.x, s.y + th/4, tw/2 + 4*z, th/4 + 3*z, 0, 0, Math.PI*2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  // ---- Units ----
  _drawUnit(u, state, myPlayerId, selection) {
    const def = getUnitDef(u.type);
    if (!def) return;

    const gx = Math.floor(u.x), gy = Math.floor(u.y);
    if (!this.isTileSeen(gx, gy)) return;

    const visible = this.isTileVisible(gx, gy);
    if (u.player !== myPlayerId && !visible) return;

    const { ctx, camera } = this;
    const s = camera.gridToScreen(u.x, u.y);
    const z = camera.zoom;

    const pIdx = state.players[u.player]?.colorIdx ?? 0;
    const color = PLAYER_COLORS[pIdx];
    const r = def.radius * HALF_W * z * 1.2;
    const dimmed = visible ? 1 : 0.5;

    ctx.globalAlpha = dimmed;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(s.x, s.y + r * 0.3, r * 0.8, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body shape: infantry = circle, vehicle = rectangle, worker = diamond
    const isVehicle = u.type === 'lightVehicle' || u.type === 'heavyVehicle';
    const isWorker  = u.type === 'worker';

    if (isVehicle) {
      // Rectangle body
      const vw = r * 1.6, vh = r * 1.0;
      ctx.fillStyle = color;
      ctx.fillRect(s.x - vw/2, s.y - vh, vw, vh);
      ctx.strokeStyle = this._shadeColor(color, 30);
      ctx.lineWidth = 1.5 * z;
      ctx.strokeRect(s.x - vw/2, s.y - vh, vw, vh);
      // Turret
      ctx.fillStyle = this._shadeColor(color, -20);
      ctx.beginPath();
      ctx.arc(s.x, s.y - vh * 0.6, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else if (isWorker) {
      // Diamond shape
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(s.x,     s.y - r);
      ctx.lineTo(s.x + r, s.y);
      ctx.lineTo(s.x,     s.y + r * 0.5);
      ctx.lineTo(s.x - r, s.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this._shadeColor(color, 30);
      ctx.lineWidth = 1.5 * z;
      ctx.stroke();
    } else {
      // Circle (infantry)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(s.x, s.y - r * 0.3, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = this._shadeColor(color, 30);
      ctx.lineWidth = 1.5 * z;
      ctx.stroke();
      // Helmet mark
      ctx.fillStyle = this._shadeColor(color, 30);
      ctx.beginPath();
      ctx.arc(s.x, s.y - r * 0.55, r * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // HP bar
    if (visible && u.hp < def.hp) {
      this._drawHPBar(ctx, s.x, s.y - r * 1.6, u.hp, def.hp, r * 2, 3 * z);
    }

    // Harvest progress indicator
    if (u.state === 'harvesting' && visible) {
      const pct = u.harvestTimer / (HARVEST_DURATION * TICK_RATE);
      ctx.fillStyle = '#4ecdc4';
      ctx.beginPath();
      ctx.arc(s.x, s.y - r * 1.2, 3 * z, -Math.PI/2, -Math.PI/2 + pct * Math.PI * 2);
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 2 * z;
      ctx.stroke();
    }

    // Selection indicator
    const sel = selection.units.includes(u.id);
    if (sel) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2 * z;
      ctx.beginPath();
      ctx.ellipse(s.x, s.y + r * 0.05, r + 3*z, r * 0.35 + 2*z, 0, 0, Math.PI*2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  // ---- Placement Preview ----
  _drawPlacementPreview(ps, inputState, state) {
    const { ctx, camera } = this;
    const def = getBuildingDef(ps.buildingType);
    if (!def) return;

    const g = camera.screenToGrid(inputState.mouseX, inputState.mouseY);
    const gx = Math.round(g.x), gy = Math.round(g.y);
    const s = camera.gridToScreen(gx, gy);
    const z = camera.zoom;
    const fp = def.footprint;
    const bw = fp * HALF_W * z * 0.9;
    const bh = fp * HALF_H * z * 0.9;

    // Check validity
    const valid = this._isValidPlacement(gx, gy, def.footprint, state);
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = valid ? 'rgba(0,255,100,0.3)' : 'rgba(255,0,0,0.3)';

    const tw = bw * 0.85, th = bh * 0.85;
    const hpx = 20 * z * (fp / 2);
    ctx.beginPath();
    ctx.moveTo(s.x,     s.y - hpx);
    ctx.lineTo(s.x + tw/2, s.y - hpx + th/2);
    ctx.lineTo(s.x,     s.y - hpx + th);
    ctx.lineTo(s.x - tw/2, s.y - hpx + th/2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = valid ? '#00ff64' : '#ff3333';
    ctx.lineWidth = 2 * z;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  _isValidPlacement(gx, gy, fp, state) {
    if (!state || !state.map) return false;
    const half = Math.floor(fp / 2);
    for (let dy = -half; dy < fp - half; dy++) {
      for (let dx = -half; dx < fp - half; dx++) {
        const t = state.map.getTerrain(gx+dx, gy+dy);
        if (t === T.CLIFF || t === T.RESOURCE) return false;
      }
    }
    // Check no building overlap
    for (const b of Object.values(state.buildings)) {
      const bdef = getBuildingDef(b.type);
      if (!bdef) continue;
      const dist = Math.max(Math.abs(b.x - gx), Math.abs(b.y - gy));
      if (dist < (fp + bdef.footprint) / 2) return false;
    }
    return true;
  }

  // ---- Fog of War ----
  // Approach: clear fog canvas to transparent, then paint:
  //   unseen tiles → 100% black diamond
  //   seen-not-visible tiles → 55% black diamond (game shows through dimly)
  //   visible tiles → nothing (transparent = game canvas shows through fully)
  _drawFog(W, H) {
    const { fogCtx, camera } = this;
    const z = camera.zoom;
    const tw = TILE_W * z, th = TILE_H * z;

    fogCtx.clearRect(0, 0, W, H);  // start transparent

    // Batch draws by color for performance
    fogCtx.beginPath();
    let hasUnseen = false;
    for (let gy = 0; gy < MAP_SIZE; gy++) {
      for (let gx = 0; gx < MAP_SIZE; gx++) {
        if (this.fogGrid[gy * MAP_SIZE + gx] !== 0) continue;
        const s = camera.gridToScreen(gx, gy);
        // Cull off-screen
        if (s.x < -tw || s.x > W + tw || s.y < -th || s.y > H + th) continue;
        fogCtx.moveTo(s.x,          s.y);
        fogCtx.lineTo(s.x + tw / 2, s.y + th / 2);
        fogCtx.lineTo(s.x,          s.y + th);
        fogCtx.lineTo(s.x - tw / 2, s.y + th / 2);
        fogCtx.closePath();
        hasUnseen = true;
      }
    }
    if (hasUnseen) { fogCtx.fillStyle = '#000'; fogCtx.fill(); }

    fogCtx.beginPath();
    let hasSeen = false;
    for (let gy = 0; gy < MAP_SIZE; gy++) {
      for (let gx = 0; gx < MAP_SIZE; gx++) {
        if (this.fogGrid[gy * MAP_SIZE + gx] !== 1) continue;
        const s = camera.gridToScreen(gx, gy);
        if (s.x < -tw || s.x > W + tw || s.y < -th || s.y > H + th) continue;
        fogCtx.moveTo(s.x,          s.y);
        fogCtx.lineTo(s.x + tw / 2, s.y + th / 2);
        fogCtx.lineTo(s.x,          s.y + th);
        fogCtx.lineTo(s.x - tw / 2, s.y + th / 2);
        fogCtx.closePath();
        hasSeen = true;
      }
    }
    if (hasSeen) { fogCtx.fillStyle = 'rgba(0,0,0,0.58)'; fogCtx.fill(); }

    // Composite fog canvas onto main canvas
    this.ctx.drawImage(this.fogCanvas, 0, 0);
  }

  // ---- Drag Selection Box ----
  _drawDragBox() {
    if (!this.dragBox) return;
    const { ctx } = this;
    const { x0, y0, x1, y1 } = this.dragBox;
    const rx = Math.min(x0, x1), ry = Math.min(y0, y1);
    const rw = Math.abs(x1 - x0), rh = Math.abs(y1 - y0);

    ctx.fillStyle = 'rgba(56,139,253,0.1)';
    ctx.fillRect(rx, ry, rw, rh);
    ctx.strokeStyle = 'rgba(56,139,253,0.8)';
    ctx.lineWidth = 1;
    ctx.strokeRect(rx, ry, rw, rh);
  }

  // ---- Minimap ----
  _drawMinimap(state, myPlayerId) {
    const { mmCtx } = this;
    const MW = 200, MH = 200;
    const scale = MW / MAP_SIZE;

    mmCtx.fillStyle = '#000';
    mmCtx.fillRect(0, 0, MW, MH);

    if (!state || !state.map) return;

    // Terrain
    for (let gy = 0; gy < MAP_SIZE; gy++) {
      for (let gx = 0; gx < MAP_SIZE; gx++) {
        const fog = this.fogGrid[gy * MAP_SIZE + gx];
        if (fog === 0) continue;
        const t = state.map.getTerrain(gx, gy);
        let color = TERRAIN_COLORS[t] || '#2d5a1b';
        if (fog === 1) color = this._desaturate(color);
        mmCtx.fillStyle = color;
        mmCtx.fillRect(gx * scale, gy * scale, scale + 0.5, scale + 0.5);
      }
    }

    // Resources
    for (const res of Object.values(state.resources || {})) {
      const fog = this.fogGrid[Math.floor(res.y) * MAP_SIZE + Math.floor(res.x)];
      if (fog === 0) continue;
      mmCtx.fillStyle = '#4ecdc4';
      mmCtx.fillRect(res.x * scale - 1, res.y * scale - 1, 3, 3);
    }

    // Buildings
    for (const b of Object.values(state.buildings || {})) {
      const fog = this.fogGrid[Math.floor(b.y) * MAP_SIZE + Math.floor(b.x)];
      if (fog === 0 && b.player !== myPlayerId) continue;
      const pIdx = state.players[b.player]?.colorIdx ?? 0;
      mmCtx.fillStyle = PLAYER_COLORS[pIdx];
      mmCtx.fillRect(b.x * scale - 2, b.y * scale - 2, 5, 5);
    }

    // Units
    for (const u of Object.values(state.units || {})) {
      const fog = this.fogGrid[Math.floor(u.y) * MAP_SIZE + Math.floor(u.x)];
      if (fog === 0 && u.player !== myPlayerId) continue;
      const pIdx = state.players[u.player]?.colorIdx ?? 0;
      mmCtx.fillStyle = PLAYER_COLORS[pIdx];
      mmCtx.fillRect(u.x * scale - 1, u.y * scale - 1, 2.5, 2.5);
    }

    // Camera viewport box
    const cam = this.camera;
    const camTL = cam.screenToGrid(0, 0);
    const camBR = cam.screenToGrid(this.canvas.width, this.canvas.height);
    mmCtx.strokeStyle = 'rgba(255,255,255,0.6)';
    mmCtx.lineWidth = 1;
    mmCtx.strokeRect(
      camTL.x * scale, camTL.y * scale,
      (camBR.x - camTL.x) * scale,
      (camBR.y - camTL.y) * scale
    );
  }

  // ---- Helpers ----
  _drawHPBar(ctx, x, y, hp, maxHp, width, height) {
    const pct = hp / maxHp;
    const color = pct > 0.6 ? '#3fb950' : pct > 0.3 ? '#d29922' : '#f85149';
    ctx.fillStyle = '#222';
    ctx.fillRect(x - width/2, y, width, height);
    ctx.fillStyle = color;
    ctx.fillRect(x - width/2, y, width * pct, height);
  }

  _shadeColor(color, amount) {
    const num = parseInt(color.slice(1), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  _desaturate(color) {
    const num = parseInt(color.slice(1), 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8)  & 0xff;
    const b = num & 0xff;
    const gray = Math.floor(r * 0.3 + g * 0.59 + b * 0.11);
    const mix = Math.floor(gray * 0.7);
    return '#' + ((mix << 16) | (mix << 8) | mix).toString(16).padStart(6, '0');
  }
}
