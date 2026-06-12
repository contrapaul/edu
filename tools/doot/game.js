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
  note(type, freq, t0, dur, vol = 0.2, slide = 0) {
    const c = this.ctx, now = c.currentTime + t0;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, now);
    if (slide) o.frequency.linearRampToValueAtTime(Math.max(20, freq + slide), now + dur);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(vol, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g).connect(c.destination);
    o.start(now); o.stop(now + dur + 0.05);
  },
  noise(t0, dur, vol = 0.1, rampUp = false) {
    const c = this.ctx, now = c.currentTime + t0;
    const len = Math.ceil(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const env = rampUp ? i / len : 1 - i / len;
      d[i] = (Math.random() * 2 - 1) * env;
    }
    const s = c.createBufferSource(); s.buffer = buf;
    const g = c.createGain(); g.gain.value = vol;
    s.connect(g).connect(c.destination); s.start(now);
  },
  // C major pentatonic-ish pool so spam-firing plays accidental melodies
  dootScale: [261.6, 293.7, 329.6, 392.0, 440.0, 523.3],
  doot() {
    this.ensure();
    const f = this.dootScale[Math.floor(Math.random() * this.dootScale.length)];
    this.note('square', f, 0, 0.18, 0.12, 18);
    this.note('square', f * 2, 0, 0.1, 0.04);
  },
  fart() { // the tuba. a dignified instrument.
    this.ensure();
    const f = 55 + Math.random() * 25;
    this.note('sawtooth', f, 0, 0.45, 0.3, -25);
    this.note('sawtooth', f * 1.5, 0, 0.3, 0.15, -30);
    this.note('square', f * 0.5, 0.02, 0.35, 0.2, -10);
    this.noise(0, 0.15, 0.1);
  },
  inhale() { this.ensure(); this.noise(0, 1.6, 0.08, true); }, // big tuba breath reload
  pfff() { this.ensure(); this.noise(0, 0.25, 0.06); },
  screech() {
    this.ensure();
    this.note('sawtooth', 880 + Math.random() * 200, 0, 0.3, 0.07, -120);
    this.note('sawtooth', 893 + Math.random() * 200, 0, 0.3, 0.07, -100);
  },
  bassThrum() {
    this.ensure();
    this.note('sawtooth', 70, 0, 0.5, 0.18, -15);
    this.note('sawtooth', 71.5, 0, 0.5, 0.18, -15);
  },
  harpGliss() {
    this.ensure();
    [523.3, 587.3, 659.3, 698.5, 784].forEach((f, i) => this.note('triangle', f, i * 0.04, 0.2, 0.08));
  },
  pianoChord() { // dissonant cluster
    this.ensure();
    [220, 233.1, 246.9, 466.2, 493.9].forEach(f => this.note('square', f, 0, 0.5, 0.06));
  },
  hurt() { this.ensure(); this.note('sawtooth', 160, 0, 0.25, 0.15, -60); },
  enemyDeath() {
    this.ensure();
    const seq = [392, 349.2, 311.1, 233.1];
    seq.forEach((f, i) => this.note('sawtooth', f, i * 0.13, 0.22, 0.1, -10));
  },
  bossDeath() {
    this.ensure();
    [110, 103.8, 98, 92.5, 87.3, 82.4].forEach((f, i) => this.note('sawtooth', f, i * 0.25, 0.45, 0.18, -8));
    [880, 932, 988].forEach(f => this.note('square', f, 1.6, 1.2, 0.05, -400));
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
scene.background = new THREE.Color(0x2a2a4e); // lighter sky for contrast against dark walls
scene.fog = new THREE.Fog(0x2a2a4e, 20, 90);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.getElementById('game').appendChild(renderer.domElement);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// lighting: hemisphere sky/ground + warm ambient + point lights along the route
scene.add(new THREE.AmbientLight(0x666688, 1.1));
const hemi = new THREE.HemisphereLight(0x9999cc, 0x222233, 1.3);
scene.add(hemi);
const moody = [
  [0, 5, -8, 0xffaa44], [0, 5, -22, 0x7c3aed],
  [-14, 6, -40, 0xff6644], [14, 6, -40, 0x4fd0ff], [0, 7, -52, 0xffcc66], [-14, 6, -62, 0x4fd0ff], [14, 6, -62, 0xff6644],
  [31, 5, -50, 0x9fffe0],                                    // east wing
  [0, 5, -74, 0x7c3aed],                                     // corridor B
  [-16, 6, -88, 0xff6644], [16, 6, -88, 0x4fd0ff], [0, 7, -100, 0xffcc66], [-16, 6, -110, 0xffaa44], [16, 6, -110, 0x7c3aed],
  [-33, 5, -96, 0xfff5cc],                                   // sheet corridor
  [0, 6, -126, 0xff3333], [0, 6, -142, 0xff3333],            // boss room: ominous red
];
for (const [x, y, z, c] of moody) {
  const l = new THREE.PointLight(c, 50, 36);
  l.position.set(x, y, z);
  scene.add(l);
}

// ════════════════════════════════════════════════
//  NOTE TEXTURE (canvas-drawn ♪ — particles, tracers, enemy shots)
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
const noteTexGreen = makeNoteTexture('♬', '#8aff5c'); // tuba pellets
const noteTexRed = makeNoteTexture('♩', '#ff4040');   // enemy shots

// ════════════════════════════════════════════════
//  LEVEL — boxes [x, y, z, w, h, d, color]
//  spawn → corridor A → arena 1 (+ east wing) → corridor B
//  → arena 2 (+ sheet corridor west) → music gate → boss room
// ════════════════════════════════════════════════
const WALL = 0x3a3a5c, WALL2 = 0x4a3a68, FLOOR = 0x26263c, TRIM = 0x55557a;
const levelBoxes = [
  // ── floors ──
  [0, -0.5, -6, 20, 1, 16, FLOOR],        // spawn
  [0, -0.5, -22.5, 8, 1, 16, FLOOR],      // corridor A
  [0, -0.5, -50.5, 44, 1, 40, FLOOR],     // arena 1
  [31, -0.5, -50, 18, 1, 14, FLOOR],      // east wing
  [0, -0.5, -74.5, 8, 1, 8, FLOOR],       // corridor B
  [0, -0.5, -98.5, 50, 1, 40, FLOOR],     // arena 2
  [-33, -0.5, -96, 16, 1, 8, FLOOR],      // sheet corridor
  [0, -0.5, -133.5, 30, 1, 30, FLOOR],    // boss room
  // ── spawn room ──
  [-10.5, 3.5, -6, 1, 8, 16, WALL], [10.5, 3.5, -6, 1, 8, 16, WALL],
  [0, 3.5, 2.5, 22, 8, 1, WALL],
  [-7, 3.5, -14.5, 8, 8, 1, WALL], [7, 3.5, -14.5, 8, 8, 1, WALL],
  // ── corridor A ──
  [-4.5, 3.5, -22.5, 1, 8, 16, WALL2], [4.5, 3.5, -22.5, 1, 8, 16, WALL2],
  // ── arena 1 ──
  [-13, 3.5, -30.5, 19, 8, 1, WALL], [13, 3.5, -30.5, 19, 8, 1, WALL],
  [-22.5, 3.5, -50.5, 1, 8, 40, WALL],                                  // west wall (solid)
  [22.5, 3.5, -36.75, 1, 8, 12.5, WALL], [22.5, 3.5, -63.75, 1, 8, 13.5, WALL], // east wall w/ wing gap
  [-13.25, 3.5, -70.5, 18.5, 8, 1, WALL], [13.25, 3.5, -70.5, 18.5, 8, 1, WALL],
  // arena 1 pillars
  [-12, 2, -40, 2.5, 5, 2.5, WALL2], [12, 2, -40, 2.5, 5, 2.5, WALL2],
  [-12, 2, -60, 2.5, 5, 2.5, WALL2], [12, 2, -60, 2.5, 5, 2.5, WALL2],
  [0, 2, -50, 2.5, 5, 2.5, TRIM],
  // ── east wing ──
  [31, 3.5, -42.5, 18, 8, 1, WALL2], [31, 3.5, -57.5, 18, 8, 1, WALL2],
  [40.5, 3.5, -50, 1, 8, 16, WALL2],
  // ── corridor B ──
  [-4.5, 3.5, -74.5, 1, 8, 8, WALL2], [4.5, 3.5, -74.5, 1, 8, 8, WALL2],
  // ── arena 2 ──
  [-14.75, 3.5, -78.5, 21, 8, 1, WALL], [14.75, 3.5, -78.5, 21, 8, 1, WALL],
  [25.5, 3.5, -98.5, 1, 8, 40, WALL],                                   // east wall (solid)
  [-25.5, 3.5, -85.25, 1, 8, 13.5, WALL], [-25.5, 3.5, -109.25, 1, 8, 18.5, WALL], // west wall w/ sheet gap
  [-15.25, 3.5, -118.5, 21, 8, 1, WALL], [15.25, 3.5, -118.5, 21, 8, 1, WALL],
  // arena 2 pillars
  [-14, 2, -88, 2.5, 5, 2.5, WALL2], [14, 2, -88, 2.5, 5, 2.5, WALL2],
  [-14, 2, -110, 2.5, 5, 2.5, WALL2], [14, 2, -110, 2.5, 5, 2.5, WALL2],
  [-7, 2, -99, 2.5, 5, 2.5, TRIM], [7, 2, -99, 2.5, 5, 2.5, TRIM],
  // ── sheet corridor ──
  [-33.5, 3.5, -91.5, 17, 8, 1, WALL2], [-33.5, 3.5, -100.5, 17, 8, 1, WALL2],
  [-41.5, 3.5, -96, 1, 8, 10, WALL2],
  // ── boss room ──
  [-15.5, 4.5, -133.5, 1, 10, 30, WALL], [15.5, 4.5, -133.5, 1, 10, 30, WALL],
  [0, 4.5, -149, 32, 10, 1, WALL],
];

const solids = [];
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
for (const [x, y, z, w, h, d, c] of levelBoxes) {
  const m = new THREE.Mesh(boxGeo, new THREE.MeshLambertMaterial({ color: c }));
  m.scale.set(w, h, d); m.position.set(x, y, z);
  scene.add(m);
  solids.push(new THREE.Box3(
    new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
    new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2)));
}

// Giant placeholder metronome prop (arena 1)
{
  const grp = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(2, 5, 4), new THREE.MeshLambertMaterial({ color: 0x6b4a2c }));
  body.position.y = 2.5;
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 4, 0.15), new THREE.MeshLambertMaterial({ color: 0xffe066, emissive: 0x554400 }));
  arm.position.y = 2.2; arm.geometry.translate(0, 2, 0);
  grp.add(body, arm);
  grp.position.set(18, 0, -36);
  grp.userData.arm = arm;
  scene.add(grp);
  window._metronome = grp;
  solids.push(new THREE.Box3(new THREE.Vector3(16.5, 0, -37.5), new THREE.Vector3(19.5, 5, -34.5)));
}

// ── Music gate (arena 2 → boss room) ──
const door = new THREE.Mesh(
  new THREE.BoxGeometry(10, 8, 1),
  new THREE.MeshLambertMaterial({ color: 0x7c3aed, emissive: 0x2a1050 }));
door.position.set(0, 3.5, -118.5);
scene.add(door);
const doorSolid = new THREE.Box3(new THREE.Vector3(-5, -0.5, -119), new THREE.Vector3(5, 7.5, -118));
solids.push(doorSolid);
let doorState = 'locked'; // locked | opening | open

{
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128;
  const g = cv.getContext('2d');
  g.fillStyle = '#1a1028'; g.fillRect(0, 0, 512, 128);
  g.font = 'bold 44px Courier New'; g.textAlign = 'center'; g.fillStyle = '#ffe066';
  g.fillText('♬ SHEET MUSIC REQUIRED ♬', 256, 80);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) }));
  sign.position.set(0, 3.5, -117.9);
  scene.add(sign);
  door.userData.sign = sign;
}

// ── Sheet music pickup (end of the west corridor, far from the gate) ──
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
sheet.position.set(-39, 1.6, -96);
scene.add(sheet);
const sheetGlow = new THREE.PointLight(0xfff5cc, 8, 6);
sheetGlow.position.copy(sheet.position);
scene.add(sheetGlow);
let hasSheet = false;

// ── Victory pad (boss room, behind the boss) ──
const winPad = new THREE.Mesh(
  new THREE.CylinderGeometry(2.5, 2.5, 0.2, 24),
  new THREE.MeshLambertMaterial({ color: 0x9fffe0, emissive: 0x114433 }));
winPad.position.set(0, 0.1, -143);
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
  radius: 0.45, height: 1.6,
  doots: 0,
  dead: false, won: false,
};
const EYE = 1.6, SPEED = 9, ACCEL = 60, AIR_ACCEL = 18, JUMP = 8.5, GRAV = 24;

const keys = {};
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Digit1') switchWeapon(0);
  if (e.code === 'Digit2') switchWeapon(1);
});
addEventListener('keyup', e => keys[e.code] = false);

// AABB collision: move axis-by-axis, clip against solids
function collideMove(pos, delta) {
  const half = new THREE.Vector3(player.radius, player.height / 2, player.radius);
  const center = () => new THREE.Vector3(pos.x, pos.y - player.height / 2, pos.z);
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
      const c2 = center();
      pBox.min.copy(c2.clone().sub(half)); pBox.max.copy(c2.clone().add(half));
    }
  }
}

// ════════════════════════════════════════════════
//  WEAPONS — config objects + viewmodels
// ════════════════════════════════════════════════
const brass = new THREE.MeshLambertMaterial({ color: 0xd4af37, emissive: 0x332200 });

function buildTrumpetModel() {
  const g = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12), brass);
  tube.rotation.x = Math.PI / 2;
  const bell = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 16, 1, true), brass);
  bell.rotation.x = -Math.PI / 2; bell.position.z = -0.36;
  for (let i = 0; i < 3; i++) {
    const v = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 8), brass);
    v.position.set(0, 0.06, -0.02 + i * 0.07);
    g.add(v);
  }
  g.add(tube, bell);
  return g;
}
function buildTubaModel() {
  const g = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12), brass);
  tube.rotation.x = Math.PI / 2;
  const bell = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.35, 16, 1, true), brass);
  bell.rotation.x = -Math.PI / 2; bell.position.z = -0.38;
  const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 8, 16), brass);
  wrap.position.set(0, -0.08, 0.1);
  g.add(tube, bell, wrap);
  g.scale.setScalar(1.15);
  return g;
}

const WEAPONS = [
  { name: 'TRUMPET', auto: true,  interval: 0.16, cost: 4,  pellets: 1, spread: 0,    clip: Infinity, reload: 0,   tracerTex: () => noteTexCyan,
    sound: () => synth.doot(), model: buildTrumpetModel() },
  { name: 'TUBA',    auto: false, interval: 0.55, cost: 8,  pellets: 8, spread: 0.09, clip: 5,        reload: 1.8, tracerTex: () => noteTexGreen,
    sound: () => synth.fart(), model: buildTubaModel() },
];
let weaponIndex = 0;
let shotsLeft = WEAPONS.map(w => w.clip);
let reloadTimer = 0;

for (const w of WEAPONS) {
  w.model.position.set(0.32, -0.26, -0.7);
  w.model.visible = false;
  camera.add(w.model);
}
WEAPONS[0].model.visible = true;
scene.add(camera);
let recoil = 0;

function switchWeapon(i) {
  if (i === weaponIndex || i < 0 || i >= WEAPONS.length) return;
  WEAPONS[weaponIndex].model.visible = false;
  weaponIndex = i;
  WEAPONS[i].model.visible = true;
  reloadTimer = 0; fireTimer = Math.max(fireTimer, 0.2);
  recoil = 0.6; // little raise-the-horn flourish
}
addEventListener('wheel', e => {
  if (!controls.isLocked) return;
  switchWeapon((weaponIndex + (e.deltaY > 0 ? 1 : WEAPONS.length - 1)) % WEAPONS.length);
});

// ════════════════════════════════════════════════
//  PARTICLES — note bursts, gibs, tracers, enemy shots
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
const gibs = [];
function noteGibs(pos, count = 12) {
  for (let i = 0; i < count; i++) {
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
const tracers = [];
function fireTracer(origin, dir, tex) {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sp.position.copy(origin);
  sp.scale.setScalar(0.3);
  sp.userData = { vel: dir.clone().multiplyScalar(45), life: 0.6 };
  scene.add(sp);
  tracers.push(sp);
}
// enemy projectiles (harp arrows / piano chord blasts)
const enemyShots = [];
function fireEnemyShot(origin, target, speed, damage) {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: noteTexRed, transparent: true, depthWrite: false }));
  sp.position.copy(origin);
  sp.scale.setScalar(0.45);
  const dir = target.clone().sub(origin).normalize();
  sp.userData = { vel: dir.multiplyScalar(speed), damage, life: 4 };
  scene.add(sp);
  enemyShots.push(sp);
}

// ════════════════════════════════════════════════
//  ENEMY MESHES (placeholder demonic instruments)
// ════════════════════════════════════════════════
const matRed = new THREE.MeshLambertMaterial({ color: 0x8b1a1a, emissive: 0x300505 });
const matDark = new THREE.MeshLambertMaterial({ color: 0x2a0a0a });
const matBrown = new THREE.MeshLambertMaterial({ color: 0x5b3a1a, emissive: 0x1a0d05 });
const matGold = new THREE.MeshLambertMaterial({ color: 0xc9a227, emissive: 0x332200 });
const matBlack = new THREE.MeshLambertMaterial({ color: 0x111118 });
const matEye = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const matEyeRed = new THREE.MeshBasicMaterial({ color: 0xff2200 });

function addEyes(g, x, y, z, mat = matEye, r = 0.07) {
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), mat);
    eye.position.set(s * x, y, z);
    g.add(eye);
  }
}

function buildViolinMesh() {
  const g = new THREE.Group();
  const lower = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.95), matRed);
  const upper = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.25, 0.7), matRed);
  upper.position.z = -0.7;
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.8), matDark);
  neck.position.z = -1.35;
  const scroll = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.3, 6), matDark);
  scroll.rotation.x = -Math.PI / 2; scroll.position.z = -1.85;
  addEyes(g, 0.16, 0.16, -0.75);
  for (const s of [-1, 1]) {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.25, 6), matDark);
    horn.position.set(s * 0.25, 0.25, -0.85);
    horn.rotation.z = -s * 0.5;
    g.add(horn);
  }
  g.add(lower, upper, neck, scroll);
  g.rotation.x = 0.25;
  const wrap = new THREE.Group(); wrap.add(g);
  return wrap;
}

function buildBassMesh() { // Upright Bass: big, slow, hits like a truck
  const g = new THREE.Group();
  const lower = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 1.1), matBrown);
  const upper = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 0.8), matBrown);
  upper.position.set(0, 0.9, 0); lower.position.y = 0;
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 0.18), matDark);
  neck.position.y = 1.9;
  const scroll = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.4, 6), matDark);
  scroll.position.y = 2.6;
  // strings
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.02, 2.4, 0.02), matGold);
    s.position.set(-0.12 + i * 0.08, 1.1, 0.42);
    g.add(s);
  }
  addEyes(g, 0.3, 1.05, 0.42, matEyeRed, 0.1);
  for (const s of [-1, 1]) {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 6), matDark);
    horn.position.set(s * 0.45, 1.35, 0.2);
    horn.rotation.z = -s * 0.4;
    g.add(horn);
  }
  g.add(lower, upper, neck, scroll);
  const wrap = new THREE.Group(); wrap.add(g);
  return wrap;
}

function buildHarpMesh() { // Harp: keeps its distance, plucks razor notes at you
  const g = new THREE.Group();
  const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2, 0.16), matGold);
  pillar.position.set(0, 0, -0.7);
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.1, 0.22), matGold);
  board.rotation.x = 0.45; board.position.set(0, -0.05, 0.45);
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 1.5), matGold);
  top.position.set(0, 1, -0.1);
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.015, 1.6 - i * 0.18, 0.015), new THREE.MeshBasicMaterial({ color: 0xffeeaa }));
    s.position.set(0, 0.1 + i * 0.08, -0.55 + i * 0.2);
    g.add(s);
  }
  addEyes(g, 0.12, 1.05, -0.75, matEyeRed, 0.07);
  g.add(pillar, board, top);
  const wrap = new THREE.Group(); wrap.add(g);
  return wrap;
}

function buildPianoMesh() { // The Grand Demonic Piano. It has teeth.
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.3, 2.6), matBlack);
  body.position.y = 0.4;
  // keyboard = teeth
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 32;
  const c2 = cv.getContext('2d');
  c2.fillStyle = '#eee'; c2.fillRect(0, 0, 256, 32);
  c2.fillStyle = '#111';
  for (let i = 0; i < 18; i++) { c2.fillRect(i * 14 + 10, 0, 6, 18); }
  const teeth = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) }));
  teeth.position.set(0, 0.45, 1.32);
  // open lid like a screaming mouth
  const lid = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 2.6), matBlack);
  lid.position.set(0, 1.45, -0.5); lid.rotation.x = -0.55;
  // legs
  for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8), matBlack);
    leg.position.set(sx * 1.4, -0.6, sz * 1);
    g.add(leg);
  }
  addEyes(g, 0.7, 1.1, 1.2, matEyeRed, 0.18);
  for (const s of [-1, 1]) {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.7, 6), matRed);
    horn.position.set(s * 1.2, 1.4, 0.8);
    horn.rotation.z = -s * 0.35;
    g.add(horn);
  }
  g.add(body, teeth, lid);
  const wrap = new THREE.Group(); wrap.add(g);
  return wrap;
}

// ════════════════════════════════════════════════
//  ENEMY TYPES + SPAWNS
// ════════════════════════════════════════════════
const ENEMY_TYPES = {
  violin: { hp: 5,  speed: 4.2, sight: 24, attackRange: 1.8, damage: 12, cooldown: 1.1, hoverY: 1.3, gibCount: 12,
            build: buildViolinMesh, cry: () => synth.screech() },
  bass:   { hp: 14, speed: 2.0, sight: 22, attackRange: 2.6, damage: 25, cooldown: 1.7, hoverY: 1.1, gibCount: 18,
            build: buildBassMesh, cry: () => synth.bassThrum() },
  harp:   { hp: 8,  speed: 3.2, sight: 26, attackRange: 16,  damage: 0,  cooldown: 2.1, hoverY: 1.3, gibCount: 14,
            build: buildHarpMesh, cry: () => synth.harpGliss(),
            ranged: { speed: 16, damage: 8, keepAway: 8, shots: 1 } },
  piano:  { hp: 70, speed: 2.8, sight: 40, attackRange: 3.4, damage: 30, cooldown: 1.5, hoverY: 1.2, gibCount: 40,
            build: buildPianoMesh, cry: () => synth.pianoChord(), boss: true,
            ranged: { speed: 13, damage: 10, keepAway: 0, shots: 5, cooldown: 2.8 } },
};

const enemies = [];
let boss = null;

function spawnEnemy(type, x, z) {
  const cfg = ENEMY_TYPES[type];
  const mesh = cfg.build();
  mesh.position.set(x, cfg.hoverY, z);
  scene.add(mesh);
  const e = {
    type, cfg, mesh, hp: cfg.hp, state: 'idle',
    cooldown: 0, rangedCooldown: 1 + Math.random(),
    wanderDir: Math.random() * Math.PI * 2, wanderT: 0,
    bobPhase: Math.random() * Math.PI * 2, alive: true,
  };
  enemies.push(e);
  if (cfg.boss) boss = e;
  return e;
}

// ~34 enemies before the boss
const enemySpawns = [
  // arena 1: violins + a few basses, harps near the back
  ...[[-14,-38],[14,-44],[-6,-46],[8,-52],[-16,-56],[16,-62],[-8,-64],[5,-36]].map(p => ['violin', ...p]),
  ...[[-10,-50],[10,-56],[0,-64]].map(p => ['bass', ...p]),
  ...[[-18,-66],[18,-48],[0,-58]].map(p => ['harp', ...p]),
  // east wing: ambush
  ...[[28,-46],[35,-54]].map(p => ['harp', ...p]),
  ['bass', 34, -49], ['violin', 30, -52],
  // arena 2: the philharmonic of the damned
  ...[[-16,-86],[16,-90],[-8,-94],[10,-100],[-18,-104],[18,-108],[-4,-112],[6,-84],[-12,-108],[12,-114]].map(p => ['violin', ...p]),
  ...[[-14,-92],[14,-96],[0,-106],[-8,-114]].map(p => ['bass', ...p]),
  ...[[-20,-96],[20,-102],[0,-90],[-16,-116],[16,-86]].map(p => ['harp', ...p]),
  // sheet corridor guards
  ['harp', -36, -96], ['bass', -30, -96],
  // the boss, behind the music gate
  ['piano', 0, -134],
];
enemySpawns.forEach(([t, x, z]) => spawnEnemy(t, x, z));

function updateEnemies(dt) {
  const pPos = player.pos;
  for (const e of enemies) {
    if (!e.alive) continue;
    const m = e.mesh, cfg = e.cfg;
    e.bobPhase += dt * 3;
    m.position.y = cfg.hoverY + Math.sin(e.bobPhase) * 0.15;
    e.cooldown = Math.max(0, e.cooldown - dt);
    e.rangedCooldown = Math.max(0, e.rangedCooldown - dt);

    const toPlayer = new THREE.Vector3(pPos.x - m.position.x, 0, pPos.z - m.position.z);
    const dist = toPlayer.length();

    if (e.state === 'idle') {
      e.wanderT -= dt;
      if (e.wanderT <= 0) { e.wanderDir = Math.random() * Math.PI * 2; e.wanderT = 1.5 + Math.random() * 2; }
      m.position.x += Math.cos(e.wanderDir) * dt * 1.2;
      m.position.z += Math.sin(e.wanderDir) * dt * 1.2;
      m.rotation.y = -e.wanderDir + Math.PI / 2;
      // the boss does not wander; it looms
      if (cfg.boss) { m.rotation.y = Math.atan2(toPlayer.x, toPlayer.z); m.position.set(m.position.x, m.position.y, m.position.z); }
      if (dist < cfg.sight && !player.dead) { e.state = 'chase'; cfg.cry(); }
    } else if (e.state === 'chase') {
      if (player.dead) { e.state = 'idle'; continue; }
      m.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);
      const keepAway = cfg.ranged ? cfg.ranged.keepAway : 0;

      // movement: melee types close in; harps hold range
      if (dist > Math.max(cfg.ranged && !cfg.boss ? keepAway + 2 : cfg.attackRange, 0.1)) {
        const dir = toPlayer.clone().normalize();
        m.position.x += dir.x * cfg.speed * dt;
        m.position.z += dir.z * cfg.speed * dt;
      } else if (keepAway && dist < keepAway) {
        const dir = toPlayer.clone().normalize();
        m.position.x -= dir.x * cfg.speed * 0.8 * dt;
        m.position.z -= dir.z * cfg.speed * 0.8 * dt;
      }

      // melee
      if (cfg.damage > 0 && dist <= cfg.attackRange && e.cooldown === 0) {
        e.cooldown = cfg.cooldown;
        cfg.cry(); synth.hurt();
        damagePlayer(cfg.damage);
        m.scale.setScalar(cfg.boss ? 1.15 : 1.25);
      }
      // ranged
      if (cfg.ranged && dist < cfg.sight && dist > cfg.attackRange && e.rangedCooldown === 0) {
        e.rangedCooldown = cfg.ranged.cooldown || cfg.cooldown;
        cfg.cry();
        const origin = m.position.clone(); origin.y += 0.4;
        const target = new THREE.Vector3(pPos.x, pPos.y - 0.3, pPos.z);
        for (let i = 0; i < cfg.ranged.shots; i++) {
          const jitter = cfg.ranged.shots > 1
            ? new THREE.Vector3((Math.random()-.5)*3, (Math.random()-.5), (Math.random()-.5)*3) : new THREE.Vector3();
          fireEnemyShot(origin, target.clone().add(jitter), cfg.ranged.speed, cfg.ranged.damage);
        }
      }
      m.scale.lerp(new THREE.Vector3(1, 1, 1), dt * 6);
    }

    // push out of walls
    const eBox = new THREE.Box3().setFromCenterAndSize(m.position, new THREE.Vector3(1, 1, 1));
    for (const s of solids) {
      if (!eBox.intersectsBox(s)) continue;
      const cx = (s.min.x + s.max.x) / 2, cz = (s.min.z + s.max.z) / 2;
      const push = new THREE.Vector3(m.position.x - cx, 0, m.position.z - cz).normalize().multiplyScalar(dt * 8);
      m.position.add(push);
    }
  }
}

function damageEnemy(e, pt, dmg = 1) {
  e.hp -= dmg;
  noteBurst(pt, 4 + dmg * 2, noteTexPink, 4, 0.7);
  hitmarker();
  if (e.hp <= 0 && e.alive) {
    e.alive = false;
    scene.remove(e.mesh);
    noteGibs(e.mesh.position, e.cfg.gibCount);
    noteBurst(e.mesh.position, 14, noteTexYellow, 7, 1.2, 0.45);
    if (e.cfg.boss) { synth.bossDeath(); showMessage('🎹 THE GRAND DEMONIC PIANO IS DECOMPOSED 🎹\nThe stage is yours, maestro.', 4); }
    else synth.enemyDeath();
  }
}

// ════════════════════════════════════════════════
//  SHOOTING
// ════════════════════════════════════════════════
const raycaster = new THREE.Raycaster();
let firing = false, fireQueued = false, fireTimer = 0;
const BREATH_REGEN = 22;

addEventListener('mousedown', () => { if (controls.isLocked) { firing = true; fireQueued = true; } });
addEventListener('mouseup', () => firing = false);

function tryFire() {
  const w = WEAPONS[weaponIndex];
  if (reloadTimer > 0) return;
  if (player.breath < w.cost) { synth.ensure(); synth.pfff(); return; }
  if (shotsLeft[weaponIndex] <= 0) return;
  player.breath -= w.cost;
  player.doots++;
  w.sound();
  recoil = w.pellets > 1 ? 1.6 : 1;

  if (w.clip !== Infinity) {
    shotsLeft[weaponIndex]--;
    if (shotsLeft[weaponIndex] <= 0) { reloadTimer = w.reload; synth.inhale(); }
  }

  const camPos = camera.getWorldPosition(new THREE.Vector3());
  const baseDir = new THREE.Vector3();
  camera.getWorldDirection(baseDir);

  for (let p = 0; p < w.pellets; p++) {
    const dir = baseDir.clone();
    if (w.spread) {
      dir.x += (Math.random() - .5) * 2 * w.spread;
      dir.y += (Math.random() - .5) * 2 * w.spread;
      dir.z += (Math.random() - .5) * 2 * w.spread;
      dir.normalize();
    }
    fireTracer(camPos.clone().addScaledVector(dir, 0.8), dir, w.tracerTex());

    raycaster.set(camPos, dir);
    raycaster.far = 60;
    let best = null, bestDist = Infinity;
    for (const e of enemies) {
      if (!e.alive) continue;
      const hits = raycaster.intersectObject(e.mesh, true);
      if (hits.length && hits[0].distance < bestDist) { best = { e, pt: hits[0].point }; bestDist = hits[0].distance; }
    }
    let wallDist = Infinity;
    for (const s of solids) {
      if (s === doorSolid && doorState === 'open') continue;
      const hit = raycaster.ray.intersectBox(s, new THREE.Vector3());
      if (hit) wallDist = Math.min(wallDist, hit.distanceTo(raycaster.ray.origin));
    }
    if (best && bestDist < wallDist) damageEnemy(best.e, best.pt, 1);
  }
}

// ════════════════════════════════════════════════
//  HUD
// ════════════════════════════════════════════════
const $ = id => document.getElementById(id);
const hud = $('hud'), breathbar = $('breathbar'), hpbar = $('hpbar'),
      dootcount = $('dootcount'), sheetinv = $('sheetinv'), weaponlabel = $('weaponlabel'),
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
  const w = WEAPONS[weaponIndex];
  if (reloadTimer > 0) weaponlabel.textContent = w.name + ' — *HUGE INHALE*';
  else if (w.clip === Infinity) weaponlabel.textContent = w.name + ' ♪∞';
  else weaponlabel.textContent = w.name + ' ' + '♪'.repeat(shotsLeft[weaponIndex]) + '·'.repeat(w.clip - shotsLeft[weaponIndex]);
}

// ════════════════════════════════════════════════
//  GAME FLOW
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
  switchWeapon(0);
  shotsLeft = WEAPONS.map(w => w.clip);
  reloadTimer = 0;
  for (const e of enemies) scene.remove(e.mesh);
  enemies.length = 0; boss = null;
  enemySpawns.forEach(([t, x, z]) => spawnEnemy(t, x, z));
  for (const arr of [particles, gibs, tracers, enemyShots]) { arr.forEach(o => scene.remove(o)); arr.length = 0; }
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
    const hv = new THREE.Vector2(player.vel.x, player.vel.z);
    if (player.onGround && wish.lengthSq() === 0) hv.multiplyScalar(Math.max(0, 1 - 10 * dt));
    if (hv.length() > SPEED) hv.setLength(SPEED);
    player.vel.x = hv.x; player.vel.z = hv.y;

    if (keys.Space && player.onGround) { player.vel.y = JUMP; player.onGround = false; }
    player.vel.y -= GRAV * dt;

    collideMove(player.pos, player.vel.clone().multiplyScalar(dt));
    if (player.pos.y < -10) { player.pos.set(0, EYE, -2); player.vel.set(0, 0, 0); }
    controls.getObject().position.copy(player.pos);

    // ── firing ──
    fireTimer -= dt;
    reloadTimer = Math.max(0, reloadTimer - dt);
    if (reloadTimer === 0 && shotsLeft[weaponIndex] <= 0 && WEAPONS[weaponIndex].clip !== Infinity)
      shotsLeft[weaponIndex] = WEAPONS[weaponIndex].clip;
    const w = WEAPONS[weaponIndex];
    if (fireTimer <= 0 && (w.auto ? firing : fireQueued)) {
      tryFire();
      fireTimer = w.interval;
    }
    fireQueued = false;
    if (!firing) player.breath = Math.min(100, player.breath + BREATH_REGEN * dt);

    // viewmodel recoil + bob
    recoil = Math.max(0, recoil - dt * 6);
    const bob = Math.sin(t * 8) * 0.008 * Math.min(1, new THREE.Vector2(player.vel.x, player.vel.z).length() / SPEED);
    w.model.position.set(0.32, -0.26 + bob, -0.7 + recoil * 0.08);
    w.model.rotation.x = recoil * 0.25;

    // ── world interactions ──
    updateEnemies(dt);

    // enemy shots vs player + walls
    for (let i = enemyShots.length - 1; i >= 0; i--) {
      const s = enemyShots[i], u = s.userData;
      s.position.addScaledVector(u.vel, dt);
      u.life -= dt;
      let kill = u.life <= 0;
      if (!kill && s.position.distanceTo(player.pos) < 0.9) {
        damagePlayer(u.damage);
        noteBurst(s.position, 4, noteTexRed, 3, 0.5);
        kill = true;
      }
      if (!kill) for (const b of solids) { if (b.containsPoint(s.position)) { kill = true; break; } }
      if (kill) { scene.remove(s); s.material.dispose(); enemyShots.splice(i, 1); }
    }

    // sheet pickup
    if (sheet.visible && player.pos.distanceTo(sheet.position) < 1.6) {
      hasSheet = true;
      sheet.visible = false; sheetGlow.visible = false;
      synth.pickup();
      showMessage('♬ Picked up: Doot Sonata No. 1\nThe purple gate hums in anticipation.');
    }

    // music gate
    if (doorState === 'locked' && player.pos.distanceTo(door.position) < 6) {
      if (hasSheet) {
        doorState = 'opening';
        synth.doorOpen();
        showMessage('The gate reads your sheet music. It approves.');
        door.userData.sign.visible = false;
      } else showMessage('♬ SHEET MUSIC REQUIRED ♬\n(Rumor says it\'s stashed down a western corridor…)');
    }

    // win pad — only counts once the boss is decomposed
    if (!player.won && player.pos.distanceTo(winPad.position) < 2.6) {
      if (boss && boss.alive) showMessage('🎹 The Grand Demonic Piano demands a duel. 🎹');
      else win();
    }

    updateHUD();
  }

  if (doorState === 'opening') {
    door.position.y += dt * 3;
    if (door.position.y > 11) { doorState = 'open'; door.visible = false; }
  }

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
  player, enemies, controls, tryFire, resetGame, sheet, step, camera, switchWeapon,
  get boss() { return boss; },
  get weaponIndex() { return weaponIndex; },
  get shotsLeft() { return shotsLeft; },
  get reloadTimer() { return reloadTimer; },
  get hasSheet() { return hasSheet; },
  get doorState() { return doorState; },
};
