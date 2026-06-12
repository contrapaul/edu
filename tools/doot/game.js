// DooT — brass-powered FPS tech demo
// All "art" is placeholder geometry + canvas textures; all sound is WebAudio synth.

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// ════════════════════════════════════════════════
//  SYNTH — every sound in the game, zero asset files
// ════════════════════════════════════════════════
const synth = {
  ctx: null,
  ensure() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); if (this.ctx.state === 'suspended') this.ctx.resume(); },
  // single note: type, freq, start offset (s), duration, volume
  note(type, freq, t0, dur, vol = 0.2, slide = 0) {
    const c = this.ctx, now = c.currentTime + t0;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, now);
    if (slide) o.frequency.linearRampToValueAtTime(freq + slide, now + dur);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(vol, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g).connect(c.destination);
    o.start(now); o.stop(now + dur + 0.05);
  },
  noise(t0, dur, vol = 0.1) {
    const c = this.ctx, now = c.currentTime + t0;
    const len = Math.ceil(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = c.createBufferSource(); s.buffer = buf;
    const g = c.createGain(); g.gain.value = vol;
    s.connect(g).connect(c.destination); s.start(now);
  },
  // C major pentatonic-ish pool so spam-firing plays accidental melodies
  dootScale: [261.6, 293.7, 329.6, 392.0, 440.0, 523.3],
  doot() {
    this.ensure();
    const f = this.dootScale[Math.floor(Math.random() * this.dootScale.length)];
    this.note('square', f, 0, 0.18, 0.12, 18);   // the doot
    this.note('square', f * 2, 0, 0.1, 0.04);     // brassy overtone
  },
  pfff() { this.ensure(); this.noise(0, 0.25, 0.06); },
  screech() {
    this.ensure();
    this.note('sawtooth', 880 + Math.random() * 200, 0, 0.3, 0.07, -120);
    this.note('sawtooth', 893 + Math.random() * 200, 0, 0.3, 0.07, -100);
  },
  hurt() { this.ensure(); this.note('sawtooth', 160, 0, 0.25, 0.15, -60); },
  enemyDeath() { // sad descending riff
    this.ensure();
    const seq = [392, 349.2, 311.1, 233.1];
    seq.forEach((f, i) => this.note('sawtooth', f, i * 0.13, 0.22, 0.1, -10));
  },
  pickup() {
    this.ensure();
    [523.3, 659.3, 784, 1046.5].forEach((f, i) => this.note('triangle', f, i * 0.08, 0.25, 0.12));
  },
  doorOpen() {
    this.ensure();
    [261.6, 329.6, 392, 523.3].forEach((f, i) => this.note('square', f, i * 0.1, 0.4, 0.08));
  },
  fanfare() {
    this.ensure();
    const seq = [[392,0],[392,.15],[392,.3],[523.3,.45],[659.3,.75],[523.3,.95],[659.3,1.1],[784,1.35]];
    seq.forEach(([f, t]) => { this.note('square', f, t, 0.35, 0.12); this.note('square', f / 2, t, 0.35, 0.06); });
  },
  playerDeath() {
    this.ensure();
    [392, 370, 349.2, 329.6].forEach((f, i) => this.note('sawtooth', f, i * 0.35, 0.5, 0.12, -15));
  },
};

// ════════════════════════════════════════════════
//  RENDERER / SCENE
// ════════════════════════════════════════════════
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a14);
scene.fog = new THREE.Fog(0x0a0a14, 10, 55);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.getElementById('game').appendChild(renderer.domElement);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

scene.add(new THREE.AmbientLight(0x404060, 1.2));
const moody = [
  [0, 5, -8, 0xffaa44], [0, 5, -30, 0x7c3aed], [12, 5, -48, 0xff4444],
  [-10, 5, -48, 0x4fd0ff], [0, 5, -78, 0x9fffe0],
];
for (const [x, y, z, c] of moody) {
  const l = new THREE.PointLight(c, 30, 28);
  l.position.set(x, y, z);
  scene.add(l);
}

// ════════════════════════════════════════════════
//  NOTE TEXTURE (canvas-drawn ♪ — used for particles & tracers)
// ════════════════════════════════════════════════
function makeNoteTexture(glyph, color) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const g = cv.getContext('2d');
  g.font = 'bold 52px serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = color; g.shadowBlur = 10;
  g.fillStyle = color;
  g.fillText(glyph, 32, 34);
  return new THREE.CanvasTexture(cv);
}
const noteTexYellow = makeNoteTexture('♪', '#ffe066');
const noteTexPink = makeNoteTexture('♫', '#ff5cf0');
const noteTexCyan = makeNoteTexture('♪', '#9fffe0');

// ════════════════════════════════════════════════
//  LEVEL — boxes [x, y, z, w, h, d, color]
//  Layout (player walks toward -z):
//  spawn room → corridor → arena (enemies + sheet) → locked door → final room
// ════════════════════════════════════════════════
const WALL = 0x2c2c44, WALL2 = 0x3a2c50, FLOOR = 0x1c1c2c;
const levelBoxes = [
  // floors
  [0, -0.5, -6, 20, 1, 16, FLOOR],      // spawn room
  [0, -0.5, -22, 6, 1, 16, FLOOR],      // corridor
  [0, -0.5, -48, 36, 1, 36, FLOOR],     // arena
  [0, -0.5, -78, 20, 1, 20, FLOOR],     // final room
  // spawn room walls
  [-10.5, 2.5, -6, 1, 6, 16, WALL], [10.5, 2.5, -6, 1, 6, 16, WALL],
  [0, 2.5, 2.5, 22, 6, 1, WALL],
  [-6.5, 2.5, -14.5, 9, 6, 1, WALL], [6.5, 2.5, -14.5, 9, 6, 1, WALL],
  // corridor walls
  [-3.5, 2.5, -22, 1, 6, 16, WALL2], [3.5, 2.5, -22, 1, 6, 16, WALL2],
  // arena walls
  [-18.5, 3.5, -48, 1, 8, 36, WALL], [18.5, 3.5, -48, 1, 8, 36, WALL],
  [-11, 3.5, -30.5, 16, 8, 1, WALL], [11, 3.5, -30.5, 16, 8, 1, WALL],
  [-12, 3.5, -65.5, 14, 8, 1, WALL], [12, 3.5, -65.5, 14, 8, 1, WALL],
  // arena cover pillars
  [-8, 1.5, -42, 2, 4, 2, WALL2], [8, 1.5, -42, 2, 4, 2, WALL2],
  [-8, 1.5, -54, 2, 4, 2, WALL2], [8, 1.5, -54, 2, 4, 2, WALL2],
  // final room walls
  [-10.5, 3.5, -78, 1, 8, 20, WALL], [10.5, 3.5, -78, 1, 8, 20, WALL],
  [0, 3.5, -88.5, 22, 8, 1, WALL],
];

const solids = []; // THREE.Box3 list used for collision
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
for (const [x, y, z, w, h, d, c] of levelBoxes) {
  const m = new THREE.Mesh(boxGeo, new THREE.MeshLambertMaterial({ color: c }));
  m.scale.set(w, h, d); m.position.set(x, y, z);
  scene.add(m);
  solids.push(new THREE.Box3(
    new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
    new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2)));
}

// Giant placeholder metronome prop in the arena
{
  const grp = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(2, 5, 4), new THREE.MeshLambertMaterial({ color: 0x6b4a2c }));
  body.position.y = 2.5;
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 4, 0.15), new THREE.MeshLambertMaterial({ color: 0xffe066, emissive: 0x554400 }));
  arm.position.y = 2.2; arm.geometry.translate(0, 2, 0);
  grp.add(body, arm);
  grp.position.set(14, 0, -36);
  grp.userData.arm = arm;
  scene.add(grp);
  window._metronome = grp;
  solids.push(new THREE.Box3(new THREE.Vector3(12.5, 0, -37.5), new THREE.Vector3(15.5, 5, -34.5)));
}

// ── Locked door (arena → final room) ──
const door = new THREE.Mesh(
  new THREE.BoxGeometry(10, 8, 1),
  new THREE.MeshLambertMaterial({ color: 0x7c3aed, emissive: 0x2a1050 }));
door.position.set(0, 3.5, -65.5);
scene.add(door);
const doorSolid = new THREE.Box3(new THREE.Vector3(-5, -0.5, -66), new THREE.Vector3(5, 7.5, -65));
solids.push(doorSolid);
let doorState = 'locked'; // locked | opening | open

// Door sign: canvas texture "BRING SHEET MUSIC"
{
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128;
  const g = cv.getContext('2d');
  g.fillStyle = '#1a1028'; g.fillRect(0, 0, 512, 128);
  g.font = 'bold 44px Courier New'; g.textAlign = 'center'; g.fillStyle = '#ffe066';
  g.fillText('♬ SHEET MUSIC REQUIRED ♬', 256, 80);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) }));
  sign.position.set(0, 3.5, -64.9);
  scene.add(sign);
  door.userData.sign = sign;
}

// ── Sheet music pickup (floating, spinning) ──
function makeSheetTexture() {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 160;
  const g = cv.getContext('2d');
  g.fillStyle = '#f5f0e0'; g.fillRect(0, 0, 128, 160);
  g.strokeStyle = '#222'; g.lineWidth = 2;
  for (let s = 0; s < 3; s++) for (let i = 0; i < 5; i++) {
    const y = 25 + s * 45 + i * 6;
    g.beginPath(); g.moveTo(12, y); g.lineTo(116, y); g.stroke();
  }
  g.font = '20px serif'; g.fillStyle = '#111';
  g.fillText('♪ ♫ ♪♪ ♫', 20, 46); g.fillText('♫♪ ♪ ♫♪', 28, 92); g.fillText('♪♪♪ DOOT', 22, 138);
  return new THREE.CanvasTexture(cv);
}
const sheet = new THREE.Mesh(
  new THREE.PlaneGeometry(1.2, 1.5),
  new THREE.MeshBasicMaterial({ map: makeSheetTexture(), side: THREE.DoubleSide }));
sheet.position.set(14, 1.6, -58);
scene.add(sheet);
const sheetGlow = new THREE.PointLight(0xfff5cc, 8, 6);
sheetGlow.position.copy(sheet.position);
scene.add(sheetGlow);
let hasSheet = false;

// ── Victory trigger pad in final room ──
const winPad = new THREE.Mesh(
  new THREE.CylinderGeometry(2.5, 2.5, 0.2, 24),
  new THREE.MeshLambertMaterial({ color: 0x9fffe0, emissive: 0x114433 }));
winPad.position.set(0, 0.1, -82);
scene.add(winPad);

// ════════════════════════════════════════════════
//  PLAYER
// ════════════════════════════════════════════════
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

const player = {
  pos: new THREE.Vector3(0, 1.6, -2),
  vel: new THREE.Vector3(),
  onGround: false,
  hp: 100, breath: 100,
  radius: 0.45, height: 1.6, // eye height; feet at pos.y - height
  doots: 0,
  dead: false, won: false,
};
const EYE = 1.6, SPEED = 9, ACCEL = 60, AIR_ACCEL = 18, JUMP = 8.5, GRAV = 24;

const keys = {};
addEventListener('keydown', e => keys[e.code] = true);
addEventListener('keyup', e => keys[e.code] = false);

// AABB collision: move axis-by-axis, clip against solids
function collideMove(pos, delta) {
  const half = new THREE.Vector3(player.radius, player.height / 2, player.radius);
  const center = () => new THREE.Vector3(pos.x, pos.y - player.height / 2, pos.z); // body center (eye at top)
  player.onGround = false;
  for (const axis of ['y', 'x', 'z']) { // y first: ground penetration must be resolved before horizontal checks
    if (delta[axis] === 0) continue;
    pos[axis] += delta[axis];
    const c = center();
    const pBox = new THREE.Box3(c.clone().sub(half), c.clone().add(half));
    for (const s of solids) {
      if (s === doorSolid && doorState === 'open') continue;
      if (!pBox.intersectsBox(s)) continue;
      if (axis === 'y') {
        // 0.001 gap: resting exactly flush would count as intersecting on the x/z passes
        if (delta.y < 0) { pos.y = s.max.y + player.height + 0.001; player.onGround = true; }
        else pos.y = s.min.y - 0.01;
        player.vel.y = 0;
      } else {
        if (delta[axis] > 0) pos[axis] = s.min[axis] - half[axis] - 0.001;
        else pos[axis] = s.max[axis] + half[axis] + 0.001;
      }
      // refresh box after correction
      const c2 = center();
      pBox.min.copy(c2.clone().sub(half)); pBox.max.copy(c2.clone().add(half));
    }
  }
}

// ════════════════════════════════════════════════
//  TRUMPET VIEWMODEL
// ════════════════════════════════════════════════
const trumpet = new THREE.Group();
{
  const brass = new THREE.MeshLambertMaterial({ color: 0xd4af37, emissive: 0x332200 });
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12), brass);
  tube.rotation.x = Math.PI / 2;
  const bell = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 16, 1, true), brass);
  bell.rotation.x = -Math.PI / 2; bell.position.z = -0.36;
  const valves = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const v = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 8), brass);
    v.position.set(0, 0.06, -0.02 + i * 0.07);
    valves.add(v);
  }
  trumpet.add(tube, bell, valves);
  trumpet.position.set(0.32, -0.26, -0.7);
  camera.add(trumpet);
}
scene.add(camera);
let recoil = 0;

// ════════════════════════════════════════════════
//  PARTICLES — music note bursts (bleed + gibs)
// ════════════════════════════════════════════════
const particles = [];
function noteBurst(pos, count, tex, speed = 5, life = 0.9, scale = 0.35) {
  for (let i = 0; i < count; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sp.position.copy(pos);
    sp.scale.setScalar(scale * (0.7 + Math.random() * 0.6));
    sp.userData = {
      vel: new THREE.Vector3((Math.random() - .5) * speed, Math.random() * speed * 0.8 + 1, (Math.random() - .5) * speed),
      life, maxLife: life,
    };
    scene.add(sp);
    particles.push(sp);
  }
}
// big note "gib" chunks — tumbling planes that bounce on the floor
const gibs = [];
function noteGibs(pos) {
  for (let i = 0; i < 12; i++) {
    const tex = Math.random() < 0.5 ? noteTexPink : noteTexYellow;
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.5),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    m.position.copy(pos).add(new THREE.Vector3((Math.random()-.5)*.6, (Math.random()-.5)*.6, (Math.random()-.5)*.6));
    m.userData = {
      vel: new THREE.Vector3((Math.random()-.5)*8, Math.random()*7+2, (Math.random()-.5)*8),
      rot: new THREE.Vector3(Math.random()*8-4, Math.random()*8-4, Math.random()*8-4),
      life: 2.2,
    };
    scene.add(m);
    gibs.push(m);
  }
}

// tracer notes flying from the trumpet
const tracers = [];
function fireTracer(origin, dir) {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: noteTexCyan, transparent: true, depthWrite: false }));
  sp.position.copy(origin);
  sp.scale.setScalar(0.3);
  sp.userData = { vel: dir.clone().multiplyScalar(45), life: 0.6 };
  scene.add(sp);
  tracers.push(sp);
}

// ════════════════════════════════════════════════
//  ENEMIES — Demonic Strings (evil hovering violins)
// ════════════════════════════════════════════════
const ENEMY_CFG = {
  hp: 5, speed: 4.2, sightRange: 22, attackRange: 1.8,
  attackDamage: 12, attackCooldown: 1.1, hoverY: 1.3,
};
const enemies = [];

function buildViolinMesh() {
  const g = new THREE.Group();
  const red = new THREE.MeshLambertMaterial({ color: 0x8b1a1a, emissive: 0x300505 });
  const dark = new THREE.MeshLambertMaterial({ color: 0x2a0a0a });
  // body: two stacked boxes approximating a violin's figure-8
  const lower = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.95), red);
  const upper = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.25, 0.7), red);
  upper.position.z = -0.7;
  // neck + scroll
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.8), dark);
  neck.position.z = -1.35;
  const scroll = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.3, 6), dark);
  scroll.rotation.x = -Math.PI / 2; scroll.position.z = -1.85;
  // glowing eyes on the upper bout
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat);
    eye.position.set(s * 0.16, 0.16, -0.75);
    g.add(eye);
  }
  // little demon horns
  for (const s of [-1, 1]) {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.25, 6), dark);
    horn.position.set(s * 0.25, 0.25, -0.85);
    horn.rotation.z = -s * 0.5;
    g.add(horn);
  }
  g.add(lower, upper, neck, scroll);
  g.rotation.x = 0.25; // menacing forward tilt
  const wrap = new THREE.Group();
  wrap.add(g);
  return wrap;
}

function spawnEnemy(x, z) {
  const mesh = buildViolinMesh();
  mesh.position.set(x, ENEMY_CFG.hoverY, z);
  scene.add(mesh);
  enemies.push({
    mesh, hp: ENEMY_CFG.hp, state: 'idle',
    cooldown: 0, wanderDir: Math.random() * Math.PI * 2, wanderT: 0,
    bobPhase: Math.random() * Math.PI * 2, alive: true,
  });
}
const enemySpawns = [[-10, -40], [10, -46], [0, -52], [-12, -56], [13, -52]];
enemySpawns.forEach(([x, z]) => spawnEnemy(x, z));

function updateEnemies(dt) {
  const pPos = player.pos;
  for (const e of enemies) {
    if (!e.alive) continue;
    const m = e.mesh;
    e.bobPhase += dt * 3;
    m.position.y = ENEMY_CFG.hoverY + Math.sin(e.bobPhase) * 0.15;
    e.cooldown = Math.max(0, e.cooldown - dt);

    const toPlayer = new THREE.Vector3(pPos.x - m.position.x, 0, pPos.z - m.position.z);
    const dist = toPlayer.length();

    if (e.state === 'idle') {
      e.wanderT -= dt;
      if (e.wanderT <= 0) { e.wanderDir = Math.random() * Math.PI * 2; e.wanderT = 1.5 + Math.random() * 2; }
      m.position.x += Math.cos(e.wanderDir) * dt * 1.2;
      m.position.z += Math.sin(e.wanderDir) * dt * 1.2;
      m.rotation.y = -e.wanderDir + Math.PI / 2;
      if (dist < ENEMY_CFG.sightRange && !player.dead) { e.state = 'chase'; synth.screech(); }
    } else if (e.state === 'chase') {
      if (player.dead) { e.state = 'idle'; continue; }
      m.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);
      if (dist > ENEMY_CFG.attackRange) {
        toPlayer.normalize();
        m.position.x += toPlayer.x * ENEMY_CFG.speed * dt;
        m.position.z += toPlayer.z * ENEMY_CFG.speed * dt;
      } else if (e.cooldown === 0) {
        e.cooldown = ENEMY_CFG.attackCooldown;
        synth.screech(); synth.hurt();
        damagePlayer(ENEMY_CFG.attackDamage);
        // lunge animation: quick scale punch
        m.scale.setScalar(1.25);
      }
      m.scale.lerp(new THREE.Vector3(1, 1, 1), dt * 6);
    }

    // keep enemies out of walls (cheap: push out of any solid they enter)
    const eBox = new THREE.Box3().setFromCenterAndSize(m.position, new THREE.Vector3(1, 1, 1));
    for (const s of solids) {
      if (!eBox.intersectsBox(s)) continue;
      const cx = (s.min.x + s.max.x) / 2, cz = (s.min.z + s.max.z) / 2;
      const push = new THREE.Vector3(m.position.x - cx, 0, m.position.z - cz).normalize().multiplyScalar(dt * 8);
      m.position.add(push);
    }
  }
}

function damageEnemy(e, pt) {
  e.hp -= 1;
  noteBurst(pt, 6, noteTexPink, 4, 0.7);
  hitmarker();
  if (e.hp <= 0 && e.alive) {
    e.alive = false;
    scene.remove(e.mesh);
    noteGibs(e.mesh.position);
    noteBurst(e.mesh.position, 14, noteTexYellow, 7, 1.2, 0.45);
    synth.enemyDeath();
  }
}

// ════════════════════════════════════════════════
//  SHOOTING
// ════════════════════════════════════════════════
const raycaster = new THREE.Raycaster();
let firing = false, fireTimer = 0;
const FIRE_INTERVAL = 0.16, BREATH_COST = 4, BREATH_REGEN = 22;

addEventListener('mousedown', () => { if (controls.isLocked) firing = true; });
addEventListener('mouseup', () => firing = false);

function tryFire() {
  if (player.breath < BREATH_COST) { synth.ensure(); synth.pfff(); return; }
  player.breath -= BREATH_COST;
  player.doots++;
  synth.doot();
  recoil = 1;

  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const origin = camera.getWorldPosition(new THREE.Vector3()).addScaledVector(dir, 0.8);
  fireTracer(origin, dir);

  raycaster.set(camera.getWorldPosition(new THREE.Vector3()), dir);
  raycaster.far = 60;
  let best = null, bestDist = Infinity;
  for (const e of enemies) {
    if (!e.alive) continue;
    const hits = raycaster.intersectObject(e.mesh, true);
    if (hits.length && hits[0].distance < bestDist) { best = { e, pt: hits[0].point }; bestDist = hits[0].distance; }
  }
  // walls block shots
  let wallDist = Infinity;
  for (const s of solids) {
    if (s === doorSolid && doorState === 'open') continue;
    const hit = raycaster.ray.intersectBox(s, new THREE.Vector3());
    if (hit) wallDist = Math.min(wallDist, hit.distanceTo(raycaster.ray.origin));
  }
  if (best && bestDist < wallDist) damageEnemy(best.e, best.pt);
}

// ════════════════════════════════════════════════
//  HUD
// ════════════════════════════════════════════════
const $ = id => document.getElementById(id);
const hud = $('hud'), breathbar = $('breathbar'), hpbar = $('hpbar'),
      dootcount = $('dootcount'), sheetinv = $('sheetinv'),
      messageEl = $('message'), vignette = $('vignette'), hitmarkEl = $('hitmark');

let msgTimer = null;
function showMessage(text, dur = 2.5) {
  messageEl.textContent = text;
  messageEl.style.opacity = 1;
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => messageEl.style.opacity = 0, dur * 1000);
}
let hitTimer = null;
function hitmarker() {
  hitmarkEl.style.opacity = 1;
  clearTimeout(hitTimer);
  hitTimer = setTimeout(() => hitmarkEl.style.opacity = 0, 120);
}
function damagePlayer(amount) {
  if (player.dead || player.won) return;
  player.hp -= amount;
  vignette.style.opacity = 1;
  setTimeout(() => { if (player.hp > 0) vignette.style.opacity = 0; }, 350);
  if (player.hp <= 0) die();
}

function updateHUD() {
  breathbar.style.width = Math.max(0, player.breath) + '%';
  hpbar.style.width = Math.max(0, player.hp) + '%';
  dootcount.textContent = 'DOOTS: ' + player.doots;
  sheetinv.textContent = hasSheet ? 'SHEET MUSIC: ♬ Doot Sonata No. 1' : 'SHEET MUSIC: none';
}

// ════════════════════════════════════════════════
//  GAME FLOW — overlays, death, win, restart
// ════════════════════════════════════════════════
const titleOverlay = $('titleoverlay'), deathOverlay = $('deathoverlay'), winOverlay = $('winoverlay');

titleOverlay.addEventListener('click', () => { synth.ensure(); controls.lock(); });
deathOverlay.addEventListener('click', () => { resetGame(); controls.lock(); });
winOverlay.addEventListener('click', () => { resetGame(); controls.lock(); });

controls.addEventListener('lock', () => {
  titleOverlay.style.display = 'none';
  deathOverlay.style.display = 'none';
  winOverlay.style.display = 'none';
  hud.style.display = 'block';
});
controls.addEventListener('unlock', () => {
  if (player.dead) deathOverlay.style.display = 'flex';
  else if (player.won) winOverlay.style.display = 'flex';
  else titleOverlay.style.display = 'flex';
  hud.style.display = 'none';
  firing = false;
});

function die() {
  player.dead = true;
  synth.playerDeath();
  vignette.style.opacity = 1;
  setTimeout(() => controls.unlock(), 600);
}
function win() {
  if (player.won) return;
  player.won = true;
  synth.fanfare();
  showMessage('🎺 ENCORE! 🎺', 2);
  setTimeout(() => controls.unlock(), 1800);
}

function resetGame() {
  player.pos.set(0, EYE, -2);
  player.vel.set(0, 0, 0);
  player.hp = 100; player.breath = 100; player.doots = 0;
  player.dead = false; player.won = false;
  vignette.style.opacity = 0;
  hasSheet = false;
  sheet.visible = true; sheetGlow.visible = true;
  doorState = 'locked';
  door.position.y = 3.5; door.visible = true;
  door.userData.sign.visible = true;
  // respawn enemies
  for (const e of enemies) scene.remove(e.mesh);
  enemies.length = 0;
  enemySpawns.forEach(([x, z]) => spawnEnemy(x, z));
  // clear effects
  for (const arr of [particles, gibs, tracers]) { arr.forEach(o => scene.remove(o)); arr.length = 0; }
}

// ════════════════════════════════════════════════
//  MAIN LOOP
// ════════════════════════════════════════════════
const clock = new THREE.Clock();
let firstFrame = true;

function animate() {
  requestAnimationFrame(animate);
  step(Math.min(clock.getDelta(), 0.05));
}

function step(dt) {
  const t = clock.elapsedTime;

  if (controls.isLocked && !player.dead && !player.won) {
    // ── movement ──
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd); fwd.y = 0; fwd.normalize();
    const right = new THREE.Vector3(fwd.z, 0, -fwd.x).negate();
    const wish = new THREE.Vector3();
    if (keys.KeyW) wish.add(fwd);
    if (keys.KeyS) wish.sub(fwd);
    if (keys.KeyD) wish.add(right);
    if (keys.KeyA) wish.sub(right);
    if (wish.lengthSq() > 0) wish.normalize();

    const accel = player.onGround ? ACCEL : AIR_ACCEL;
    player.vel.x += wish.x * accel * dt;
    player.vel.z += wish.z * accel * dt;
    // friction / speed cap on horizontal velocity
    const hv = new THREE.Vector2(player.vel.x, player.vel.z);
    if (player.onGround && wish.lengthSq() === 0) hv.multiplyScalar(Math.max(0, 1 - 10 * dt));
    if (hv.length() > SPEED) hv.setLength(SPEED);
    player.vel.x = hv.x; player.vel.z = hv.y;

    if (keys.Space && player.onGround) { player.vel.y = JUMP; player.onGround = false; }
    player.vel.y -= GRAV * dt;

    collideMove(player.pos, player.vel.clone().multiplyScalar(dt));
    if (player.pos.y < -10) { player.pos.set(0, EYE, -2); player.vel.set(0, 0, 0); } // fell out of world
    controls.getObject().position.copy(player.pos);

    // ── firing ──
    fireTimer -= dt;
    if (firing && fireTimer <= 0) { tryFire(); fireTimer = FIRE_INTERVAL; }
    if (!firing) player.breath = Math.min(100, player.breath + BREATH_REGEN * dt);

    // trumpet recoil + bob
    recoil = Math.max(0, recoil - dt * 6);
    const bob = Math.sin(t * 8) * 0.008 * Math.min(1, new THREE.Vector2(player.vel.x, player.vel.z).length() / SPEED);
    trumpet.position.set(0.32, -0.26 + bob, -0.7 + recoil * 0.08);
    trumpet.rotation.x = recoil * 0.25;

    // ── world interactions ──
    updateEnemies(dt);

    // sheet pickup
    if (sheet.visible && player.pos.distanceTo(sheet.position) < 1.6) {
      hasSheet = true;
      sheet.visible = false; sheetGlow.visible = false;
      synth.pickup();
      showMessage('♬ Picked up: Doot Sonata No. 1\nThe purple door hums in anticipation.');
    }

    // door
    if (doorState === 'locked' && player.pos.distanceTo(door.position) < 5) {
      if (hasSheet) {
        doorState = 'opening';
        synth.doorOpen();
        showMessage('The door reads your sheet music. It approves.');
        door.userData.sign.visible = false;
      } else showMessage('♬ SHEET MUSIC REQUIRED ♬\n(There is some lying around the arena…)');
    }

    // win pad
    if (!player.won && player.pos.distanceTo(winPad.position) < 2.6) win();

    updateHUD();
  }

  // door slide animation (runs even while overlays up — harmless)
  if (doorState === 'opening') {
    door.position.y += dt * 3;
    if (door.position.y > 11) { doorState = 'open'; door.visible = false; }
  }

  // sheet + win pad idle spin
  sheet.rotation.y += dt * 2;
  sheet.position.y = 1.6 + Math.sin(t * 2) * 0.15;
  winPad.rotation.y += dt;
  if (window._metronome) window._metronome.userData.arm.rotation.z = Math.sin(t * 2.5) * 0.5;

  // ── effects ──
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i], u = p.userData;
    u.vel.y -= 9 * dt;
    p.position.addScaledVector(u.vel, dt);
    u.life -= dt;
    p.material.opacity = Math.max(0, u.life / u.maxLife);
    if (u.life <= 0) { scene.remove(p); p.material.dispose(); particles.splice(i, 1); }
  }
  for (let i = gibs.length - 1; i >= 0; i--) {
    const g = gibs[i], u = g.userData;
    u.vel.y -= 14 * dt;
    g.position.addScaledVector(u.vel, dt);
    if (g.position.y < 0.25 && u.vel.y < 0) { g.position.y = 0.25; u.vel.y *= -0.45; u.vel.x *= 0.8; u.vel.z *= 0.8; }
    g.rotation.x += u.rot.x * dt; g.rotation.y += u.rot.y * dt; g.rotation.z += u.rot.z * dt;
    u.life -= dt;
    g.material.opacity = Math.min(1, u.life);
    g.material.transparent = true;
    if (u.life <= 0) { scene.remove(g); g.material.dispose(); gibs.splice(i, 1); }
  }
  for (let i = tracers.length - 1; i >= 0; i--) {
    const tr = tracers[i], u = tr.userData;
    tr.position.addScaledVector(u.vel, dt);
    u.life -= dt;
    tr.material.opacity = Math.max(0, u.life / 0.6);
    if (u.life <= 0) { scene.remove(tr); tr.material.dispose(); tracers.splice(i, 1); }
  }

  if (firstFrame) { controls.getObject().position.copy(player.pos); firstFrame = false; }
  renderer.render(scene, camera);
}
animate();

// debug/test hook (also used by automated verification)
window.DOOT = {
  player, enemies, controls, tryFire, resetGame, sheet, step, camera,
  get hasSheet() { return hasSheet; },
  get doorState() { return doorState; },
};
