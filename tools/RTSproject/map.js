// map.js — Map generation, terrain, resource placement, and pathfinding
// Architecture: MapData is a pure data object. MapGenerator creates it from a seed.
// PathFinder provides A* on the walkability grid.

'use strict';

const MAP_SIZE = 128;           // 128 x 128 grid tiles

// Terrain type IDs
const T = {
  PLAIN:   0,   // flat grass, passable
  DIRT:    1,   // flat dirt, passable
  ROCK:    2,   // rocky ground, passable but varied color
  CLIFF:   3,   // impassable cliff wall
  RESOURCE:4,   // resource patch tile (impassable center)
};

// Player starting corner positions (grid coords of HQ center)
const STARTING_POSITIONS = [
  { x: 8,  y: 8  },   // top-left  → Red
  { x: 119, y: 8  },  // top-right → Blue
  { x: 8,  y: 119 },  // bot-left  → Green
  { x: 119, y: 119 }, // bot-right → Yellow
];

// ---- Seeded PRNG (Mulberry32) ----
function makePRNG(seed) {
  let s = seed >>> 0;
  return function() {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---- Map Data Container ----
class MapData {
  constructor(size) {
    this.size = size;
    this.terrain = new Uint8Array(size * size);  // T.* values
    this.height  = new Uint8Array(size * size);  // 0=low,1=high (for cliff rendering)
    this.resources = [];  // [{id, x, y, amount, maxAmount}]
    this.startingPositions = STARTING_POSITIONS.slice();
    // walkability cache: true = can walk, false = blocked
    this._walkable = null;
  }

  idx(x, y) { return y * this.size + x; }

  getTerrain(x, y) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) return T.CLIFF;
    return this.terrain[this.idx(x, y)];
  }

  setTerrain(x, y, t) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) return;
    this.terrain[this.idx(x, y)] = t;
  }

  isWalkable(x, y) {
    const t = this.getTerrain(x, y);
    return t !== T.CLIFF && t !== T.RESOURCE;
  }

  // Build walkability grid (call after generation or after buildings change)
  buildWalkable(buildings) {
    const w = new Uint8Array(this.size * this.size);
    for (let i = 0; i < w.length; i++) {
      const t = this.terrain[i];
      w[i] = (t !== T.CLIFF && t !== T.RESOURCE) ? 1 : 0;
    }
    // Mark building footprints as impassable
    if (buildings) {
      for (const b of Object.values(buildings)) {
        if (b.buildProgress < 1) continue; // under construction: still passable
        const def = getBuildingDef(b.type);
        if (!def) continue;
        const fp = def.footprint;
        const ox = Math.floor(b.x - fp / 2);
        const oy = Math.floor(b.y - fp / 2);
        for (let dy = 0; dy < fp; dy++) {
          for (let dx = 0; dx < fp; dx++) {
            const nx = ox + dx, ny = oy + dy;
            if (nx >= 0 && ny >= 0 && nx < this.size && ny < this.size) {
              w[this.idx(nx, ny)] = 0;
            }
          }
        }
      }
    }
    this._walkable = w;
  }

  walkable(x, y) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) return false;
    if (!this._walkable) return this.isWalkable(x, y);
    return this._walkable[this.idx(x, y)] === 1;
  }
}

// ---- Map Generator ----
class MapGenerator {
  static generate(seed) {
    const rng = makePRNG(seed);
    const map = new MapData(MAP_SIZE);

    // 1) Fill with plain terrain
    map.terrain.fill(T.PLAIN);

    // 2) Add terrain variety (dirt and rock patches)
    MapGenerator._addTerrainVariety(map, rng);

    // 3) Add cliff formations
    MapGenerator._addCliffs(map, rng);

    // 4) Place resource patches
    MapGenerator._addResources(map, rng);

    // 5) Clear starting positions (ensure they're open)
    for (const sp of STARTING_POSITIONS) {
      MapGenerator._clearArea(map, sp.x, sp.y, 6);
    }

    // 6) Build initial walkability grid
    map.buildWalkable(null);

    return map;
  }

  static _addTerrainVariety(map, rng) {
    // Scatter dirt and rock patches
    const patchCount = 60;
    for (let i = 0; i < patchCount; i++) {
      const cx = Math.floor(rng() * MAP_SIZE);
      const cy = Math.floor(rng() * MAP_SIZE);
      const r  = 2 + Math.floor(rng() * 5);
      const t  = rng() < 0.5 ? T.DIRT : T.ROCK;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx*dx + dy*dy <= r*r) {
            map.setTerrain(cx + dx, cy + dy, t);
          }
        }
      }
    }
  }

  static _addCliffs(map, rng) {
    // Central plateau
    MapGenerator._buildPlateau(map, 56, 56, 16, 12, rng);

    // Additional cliff formations (avoid corners)
    const cliffConfigs = [
      { cx: 30, cy: 30, w: 10, h: 8 },
      { cx: 95, cy: 30, w: 10, h: 8 },
      { cx: 30, cy: 95, w: 10, h: 8 },
      { cx: 95, cy: 95, w: 10, h: 8 },
      { cx: 64, cy: 20, w:  8, h: 6 },
      { cx: 64, cy: 108,w:  8, h: 6 },
      { cx: 20, cy: 64, w:  6, h: 8 },
      { cx: 108,cy: 64, w:  6, h: 8 },
    ];
    for (const cfg of cliffConfigs) {
      MapGenerator._buildPlateau(map, cfg.cx, cfg.cy, cfg.w, cfg.h, rng);
    }

    // Random small outcrops
    for (let i = 0; i < 10; i++) {
      const cx = 15 + Math.floor(rng() * (MAP_SIZE - 30));
      const cy = 15 + Math.floor(rng() * (MAP_SIZE - 30));
      // Skip if too close to starting positions
      let tooClose = false;
      for (const sp of STARTING_POSITIONS) {
        const dx = cx - sp.x, dy = cy - sp.y;
        if (dx*dx + dy*dy < 20*20) { tooClose = true; break; }
      }
      if (!tooClose) {
        MapGenerator._buildPlateau(map, cx, cy, 4 + Math.floor(rng()*4), 3 + Math.floor(rng()*3), rng);
      }
    }
  }

  static _buildPlateau(map, cx, cy, w, h, rng) {
    const halfW = Math.floor(w / 2);
    const halfH = Math.floor(h / 2);
    for (let dy = -halfH; dy <= halfH; dy++) {
      for (let dx = -halfW; dx <= halfW; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x < 2 || y < 2 || x >= MAP_SIZE-2 || y >= MAP_SIZE-2) continue;
        // Border tiles are cliff walls, interior is rock (top of plateau)
        const onEdge = Math.abs(dx) === halfW || Math.abs(dy) === halfH;
        map.setTerrain(x, y, T.CLIFF);
        map.height[map.idx(x, y)] = 1;
      }
    }
  }

  static _addResources(map, rng) {
    // Place resource patches evenly around the map
    // Near each starting position (1 close, 1 mid)
    const basePositions = [];
    for (const sp of STARTING_POSITIONS) {
      // Close patch
      basePositions.push({ x: sp.x + 8, y: sp.y + 4 });
      basePositions.push({ x: sp.x - 4, y: sp.y + 8 });
      // Mid-map patch
      const midX = Math.floor((sp.x + 64) / 2);
      const midY = Math.floor((sp.y + 64) / 2);
      basePositions.push({ x: midX, y: midY });
    }
    // Center resources
    basePositions.push({ x: 64, y: 64 });
    basePositions.push({ x: 58, y: 70 });
    basePositions.push({ x: 70, y: 58 });

    let rid = 0;
    for (const pos of basePositions) {
      const x = Math.max(3, Math.min(MAP_SIZE-4, pos.x + Math.floor((rng()-0.5)*6)));
      const y = Math.max(3, Math.min(MAP_SIZE-4, pos.y + Math.floor((rng()-0.5)*6)));

      // Skip if would overlap cliff or be too close to HQ
      if (map.getTerrain(x, y) === T.CLIFF) continue;
      let tooClose = false;
      for (const sp of STARTING_POSITIONS) {
        const dx = x-sp.x, dy = y-sp.y;
        if (dx*dx+dy*dy < 16) { tooClose = true; break; }
      }
      if (tooClose) continue;

      // Mark 2x2 area as resource terrain
      for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          map.setTerrain(x+dx, y+dy, T.RESOURCE);
        }
      }

      map.resources.push({
        id: 'res_' + rid++,
        x: x + 0.5,
        y: y + 0.5,
        amount: 800 + Math.floor(rng() * 400),
        maxAmount: 1200,
      });
    }
  }

  static _clearArea(map, cx, cy, r) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx*dx + dy*dy <= r*r) {
          map.setTerrain(cx+dx, cy+dy, T.PLAIN);
          map.height[map.idx(Math.max(0,Math.min(MAP_SIZE-1,cx+dx)), Math.max(0,Math.min(MAP_SIZE-1,cy+dy)))] = 0;
        }
      }
    }
  }
}

// ---- A* Pathfinder ----
class PathFinder {
  constructor(mapData) {
    this.map = mapData;
  }

  // Returns array of {x,y} waypoints from (sx,sy) to (tx,ty), or null if unreachable.
  // Uses integer grid coords. Smooth diagonal movement included.
  findPath(sx, sy, tx, ty, maxNodes = 2000) {
    sx = Math.round(sx); sy = Math.round(sy);
    tx = Math.round(tx); ty = Math.round(ty);

    if (!this.map.walkable(tx, ty)) {
      // Find nearest walkable tile
      const fallback = this._nearestWalkable(tx, ty);
      if (!fallback) return null;
      tx = fallback.x; ty = fallback.y;
    }
    if (sx === tx && sy === ty) return [{ x: tx, y: ty }];

    const size = this.map.size;
    const open  = new BinaryHeap(n => n.f);
    const gMap  = new Float32Array(size * size).fill(Infinity);
    const cameFrom = new Int32Array(size * size).fill(-1);
    const closed = new Uint8Array(size * size);

    const startIdx = sy * size + sx;
    gMap[startIdx] = 0;
    open.push({ x: sx, y: sy, f: this._h(sx, sy, tx, ty), g: 0, idx: startIdx });

    let nodes = 0;
    while (open.size() > 0 && nodes++ < maxNodes) {
      const cur = open.pop();
      const { x, y, idx } = cur;
      if (closed[idx]) continue;
      closed[idx] = 1;

      if (x === tx && y === ty) {
        return this._reconstruct(cameFrom, idx, size, sx, sy);
      }

      // 8-directional neighbors
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x+dx, ny = y+dy;
          if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
          if (!this.map.walkable(nx, ny)) continue;
          // Diagonal movement: check both cardinal neighbors
          if (dx && dy && !this.map.walkable(x+dx, y) && !this.map.walkable(x, y+dy)) continue;

          const nIdx = ny * size + nx;
          if (closed[nIdx]) continue;
          const cost = dx && dy ? 1.414 : 1;
          const ng = cur.g + cost;
          if (ng < gMap[nIdx]) {
            gMap[nIdx] = ng;
            cameFrom[nIdx] = idx;
            open.push({ x: nx, y: ny, f: ng + this._h(nx, ny, tx, ty), g: ng, idx: nIdx });
          }
        }
      }
    }
    return null; // unreachable
  }

  _h(x, y, tx, ty) {
    // Octile heuristic
    const dx = Math.abs(x - tx), dy = Math.abs(y - ty);
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
  }

  _reconstruct(cameFrom, endIdx, size, sx, sy) {
    const path = [];
    let idx = endIdx;
    while (idx !== -1) {
      path.push({ x: idx % size, y: Math.floor(idx / size) });
      const prev = cameFrom[idx];
      if (prev === idx) break;
      idx = prev;
    }
    path.reverse();
    return path;
  }

  _nearestWalkable(tx, ty) {
    for (let r = 1; r < 10; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const nx = tx+dx, ny = ty+dy;
          if (this.map.walkable(nx, ny)) return { x: nx, y: ny };
        }
      }
    }
    return null;
  }
}

// ---- Minimal Binary Heap (min-heap) ----
class BinaryHeap {
  constructor(scoreFunc) {
    this.score = scoreFunc;
    this.data = [];
  }
  push(el) {
    this.data.push(el);
    this._bubbleUp(this.data.length - 1);
  }
  pop() {
    const top = this.data[0];
    const end = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = end;
      this._sinkDown(0);
    }
    return top;
  }
  size() { return this.data.length; }
  _bubbleUp(n) {
    const el = this.data[n];
    while (n > 0) {
      const pi = ((n+1) >> 1) - 1;
      const parent = this.data[pi];
      if (this.score(el) >= this.score(parent)) break;
      this.data[pi] = el;
      this.data[n] = parent;
      n = pi;
    }
  }
  _sinkDown(n) {
    const len = this.data.length;
    const el = this.data[n];
    while (true) {
      const c2 = (n+1) << 1, c1 = c2 - 1;
      let swap = null, swapScore;
      if (c1 < len) {
        swapScore = this.score(this.data[c1]);
        if (swapScore < this.score(el)) swap = c1;
      }
      if (c2 < len) {
        const s2 = this.score(this.data[c2]);
        if (s2 < (swap === null ? this.score(el) : swapScore)) swap = c2;
      }
      if (swap === null) break;
      this.data[n] = this.data[swap];
      this.data[swap] = el;
      n = swap;
    }
  }
}
