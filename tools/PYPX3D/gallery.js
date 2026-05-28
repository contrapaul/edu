import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const TARGET_SIZE = 2.5;
const GOLDEN_ANGLE = 2.399963;
const PLACEHOLDER_COLORS = [0x7c3aed, 0x2563eb, 0x059669, 0xd97706, 0xdc2626, 0xdb2777];
const FRAME_COLOR = 0xc9a87c;
const BEZEL_COLOR = 0x222222;

// ── Renderer ──────────────────────────────────────────────────────────────────
const canvas = document.getElementById('gallery-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ── Scene ─────────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050b1a);
scene.fog = new THREE.FogExp2(0x050b1a, 0.008);

// ── Camera ────────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 20);
camera.lookAt(0, 0, 0);

// ── Controls ──────────────────────────────────────────────────────────────────
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 80;
controls.enablePan = false;
controls.target.set(0, 1, 0);

// ── Lighting ──────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x404060, 0.5));

const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
mainLight.position.set(5, 10, 7);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 100;
mainLight.shadow.camera.left = -30;
mainLight.shadow.camera.right = 30;
mainLight.shadow.camera.top = 30;
mainLight.shadow.camera.bottom = -30;
scene.add(mainLight);

const fillLight = new THREE.PointLight(0x4466cc, 0.35);
fillLight.position.set(0, -1, 4);
scene.add(fillLight);

const rimLight = new THREE.PointLight(0xffaa66, 0.3);
rimLight.position.set(-4, 4, -6);
scene.add(rimLight);

// ── Environment ───────────────────────────────────────────────────────────────
function createEnvironment() {
  // Reflective floor
  const floorMesh = new THREE.Mesh(
    new THREE.CircleGeometry(80, 64),
    new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.08, metalness: 0.85 })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -0.5;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // Subtle grid for spatial reference
  const grid = new THREE.GridHelper(60, 30, 0x88aaff, 0x223366);
  grid.position.y = -0.48;
  grid.material.transparent = true;
  grid.material.opacity = 0.15;
  scene.add(grid);

  // Center anchor ring
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    emissive: 0x3b1a8a,
    emissiveIntensity: 0.6,
    roughness: 0.3,
    metalness: 0.6,
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.06, 8, 48), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -0.44;
  scene.add(ring);

  // Warm ceiling PointLights + visible fixtures
  const ceilingPositions = [
    [8, 12, 8], [-8, 12, 8], [-8, 12, -8], [8, 12, -8]
  ];
  const fixtureMat = new THREE.MeshStandardMaterial({
    color: 0xfff5e0,
    emissive: 0xffcc88,
    emissiveIntensity: 0.9,
  });
  ceilingPositions.forEach(([x, y, z]) => {
    const light = new THREE.PointLight(0xffcc88, 0.65, 30);
    light.position.set(x, y, z);
    scene.add(light);
    const fixture = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), fixtureMat);
    fixture.position.set(x, y, z);
    scene.add(fixture);
  });
}

// ── Particles ─────────────────────────────────────────────────────────────────
let particles;
function createParticles() {
  const count = 400;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 40;
    pos[i * 3 + 1] = Math.random() * 6;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffbb66, size: 0.04, transparent: true, opacity: 0.35 });
  particles = new THREE.Points(geo, mat);
  scene.add(particles);
}

// ── Hover label ───────────────────────────────────────────────────────────────
let hoverLabel;
function createHoverLabel() {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 160;
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.7),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false })
  );
  mesh.visible = false;
  scene.add(mesh);
  hoverLabel = { mesh, cv, ctx, tex };
}

function updateHoverLabel(art) {
  if (!hoverLabel) return;
  if (!art) {
    hoverLabel.mesh.visible = false;
    return;
  }
  const { cv, ctx, tex } = hoverLabel;
  ctx.clearRect(0, 0, cv.width, cv.height);

  // Background pill
  ctx.fillStyle = 'rgba(5,11,26,0.88)';
  const r = 28;
  ctx.beginPath();
  ctx.roundRect(0, 0, cv.width, cv.height, r);
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(124,58,237,0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(2, 2, cv.width - 4, cv.height - 4, r - 1);
  ctx.stroke();

  // Name
  ctx.fillStyle = '#c4b5fd';
  ctx.font = 'bold 52px Inter, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(art.userData.name || '', cv.width / 2, 62, cv.width - 32);

  // Student
  if (art.userData.student) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = 'italic 34px Inter, Helvetica, sans-serif';
    ctx.fillText('by ' + art.userData.student, cv.width / 2, 114, cv.width - 32);
  }

  tex.needsUpdate = true;

  // Position above artwork
  const worldPos = new THREE.Vector3();
  art.getWorldPosition(worldPos);
  hoverLabel.mesh.position.set(worldPos.x, worldPos.y + TARGET_SIZE + 0.7, worldPos.z);
  hoverLabel.mesh.visible = true;
}

// ── State ─────────────────────────────────────────────────────────────────────
const artworks = [];
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerDownPos = { x: 0, y: 0 };
let totalItems = 0;
let loadedItems = 0;
let currentAudio = null;
let galleryTitle = 'Student 3D Gallery';

// ── Helpers ───────────────────────────────────────────────────────────────────
function spiralPosition(index) {
  const angle = index * GOLDEN_ANGLE;
  const radius = 4 + index * 2.5;
  return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
}

function updateLoadingBar() {
  const bar = document.getElementById('loading-progress');
  if (!bar) return;
  const pct = totalItems > 0 ? (loadedItems / totalItems) * 100 : 0;
  bar.style.width = pct + '%';
  if (loadedItems >= totalItems) {
    setTimeout(() => {
      const wrap = document.getElementById('loading-bar');
      if (wrap) wrap.style.opacity = '0';
    }, 400);
  }
}

function registerArtwork(wrapper, baseY, phase, rotate, extra = {}) {
  wrapper.userData = { ...wrapper.userData, baseY, phase, rotate, ...extra };
  artworks.push(wrapper);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(5,11,26,0.9)', color: '#c4b5fd',
    padding: '8px 20px', borderRadius: '20px', fontSize: '13px',
    border: '1px solid rgba(124,58,237,0.4)', backdropFilter: 'blur(8px)',
    zIndex: '1000', transition: 'opacity 0.4s', pointerEvents: 'none',
  });
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; }, 2000);
  setTimeout(() => t.remove(), 2500);
}

function makeFlatFallback(label, color, w, h, pos, phase, entryMeta) {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 512;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0') + '33';
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = '#' + color.toString(16).padStart(6, '0');
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 500);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = 'bold 64px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 256, 256);
  const tex = new THREE.CanvasTexture(cv);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
  );
  const wrapper = new THREE.Group();
  wrapper.position.copy(pos);
  wrapper.position.y = h / 2 + 0.5;
  wrapper.rotation.y = (Math.random() - 0.5) * 0.4;
  wrapper.add(mesh);
  wrapper.userData = { ...entryMeta };
  scene.add(wrapper);
  registerArtwork(wrapper, wrapper.position.y, phase, false);
  loadedItems++;
  updateLoadingBar();
}

function addFrame(group, w, h, depth = 0.05, fw = 0.1) {
  const mat = new THREE.MeshStandardMaterial({ color: FRAME_COLOR, metalness: 0.5, roughness: 0.5 });
  const top    = new THREE.Mesh(new THREE.BoxGeometry(w + fw * 2, fw, depth), mat);
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(w + fw * 2, fw, depth), mat);
  const left   = new THREE.Mesh(new THREE.BoxGeometry(fw, h, depth), mat);
  const right  = new THREE.Mesh(new THREE.BoxGeometry(fw, h, depth), mat);
  top.position.set(0,  h / 2 + fw / 2, 0.02);
  bottom.position.set(0, -h / 2 - fw / 2, 0.02);
  left.position.set(-w / 2 - fw / 2, 0, 0.02);
  right.position.set( w / 2 + fw / 2, 0, 0.02);
  group.add(top, bottom, left, right);
}

function addBezel(group, w, h) {
  const mat = new THREE.MeshStandardMaterial({ color: BEZEL_COLOR, metalness: 0.8, roughness: 0.3 });
  const bz = 0.08;
  const top    = new THREE.Mesh(new THREE.BoxGeometry(w + bz * 2, bz, 0.06), mat);
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(w + bz * 2, bz, 0.06), mat);
  const left   = new THREE.Mesh(new THREE.BoxGeometry(bz, h, 0.06), mat);
  const right  = new THREE.Mesh(new THREE.BoxGeometry(bz, h, 0.06), mat);
  top.position.set(0,  h / 2 + bz / 2, 0.01);
  bottom.position.set(0, -h / 2 - bz / 2, 0.01);
  left.position.set(-w / 2 - bz / 2, 0, 0.01);
  right.position.set( w / 2 + bz / 2, 0, 0.01);
  group.add(top, bottom, left, right);
}

// ── Content loaders ───────────────────────────────────────────────────────────

function loadModel(entry, index, pos, phase) {
  const gltfLoader = new GLTFLoader();
  const meta = { name: entry.name, student: entry.student, description: entry.description, type: 'model', audioFile: entry.audioFile };

  gltfLoader.load(
    './models/' + entry.file,
    (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) model.scale.setScalar(TARGET_SIZE / maxDim);

      const box2 = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box2.getCenter(center);
      model.position.sub(center);
      model.position.y += TARGET_SIZE / 2;

      model.traverse((node) => {
        if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; }
      });

      const wrapper = new THREE.Group();
      wrapper.position.copy(pos);
      wrapper.add(model);
      wrapper.userData = { ...meta };
      scene.add(wrapper);
      registerArtwork(wrapper, TARGET_SIZE / 2, phase, true);
      loadedItems++;
      updateLoadingBar();
    },
    undefined,
    () => {
      const color = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshBasicMaterial({ color, wireframe: true })
      );
      const wrapper = new THREE.Group();
      wrapper.position.copy(pos);
      wrapper.position.y = TARGET_SIZE / 2;
      wrapper.add(cube);
      wrapper.userData = { ...meta };
      scene.add(wrapper);
      registerArtwork(wrapper, TARGET_SIZE / 2, phase, true);
      loadedItems++;
      updateLoadingBar();
    }
  );
}

function loadImage(entry, index, pos, phase) {
  const meta = { name: entry.name, student: entry.student, description: entry.description, type: 'image', audioFile: entry.audioFile };
  const texLoader = new THREE.TextureLoader();

  texLoader.load(
    './images/' + entry.file,
    (texture) => {
      const aspect = texture.image.width / texture.image.height;
      let w, h;
      if (aspect >= 1) { w = TARGET_SIZE; h = TARGET_SIZE / aspect; }
      else             { h = TARGET_SIZE; w = TARGET_SIZE * aspect; }

      texture.colorSpace = THREE.SRGBColorSpace;
      const artwork = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.4, side: THREE.DoubleSide })
      );

      const wrapper = new THREE.Group();
      addFrame(wrapper, w, h);
      wrapper.add(artwork);
      wrapper.position.copy(pos);
      wrapper.position.y = h / 2 + 0.5;
      wrapper.rotation.y = (Math.random() - 0.5) * 0.4;
      wrapper.userData = { ...meta };
      scene.add(wrapper);
      registerArtwork(wrapper, wrapper.position.y, phase, false);
      loadedItems++;
      updateLoadingBar();
    },
    undefined,
    () => makeFlatFallback('[ image ]', 0x9b7ed4, TARGET_SIZE, TARGET_SIZE, pos, phase, meta)
  );
}

function loadVideo(entry, index, pos, phase) {
  const meta = { name: entry.name, student: entry.student, description: entry.description, type: 'video', audioFile: entry.audioFile };
  const w = TARGET_SIZE * (16 / 9);
  const h = TARGET_SIZE;

  const video = document.createElement('video');
  video.src = './videos/' + entry.file;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.colorSpace = THREE.SRGBColorSpace;

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide })
  );

  const wrapper = new THREE.Group();
  addBezel(wrapper, w, h);
  wrapper.add(screen);
  wrapper.position.copy(pos);
  wrapper.position.y = h / 2 + 0.5;
  wrapper.rotation.y = (Math.random() - 0.5) * 0.4;
  wrapper.userData = { ...meta, videoEl: video };
  scene.add(wrapper);
  registerArtwork(wrapper, wrapper.position.y, phase, false);

  video.addEventListener('error', () => {
    screen.material = new THREE.MeshBasicMaterial({
      map: (() => {
        const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180;
        const ctx = cv.getContext('2d');
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, 320, 180);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('[ video ]', 160, 90);
        return new THREE.CanvasTexture(cv);
      })(),
      side: THREE.DoubleSide
    });
  });

  video.play().catch(() => {});
  loadedItems++;
  updateLoadingBar();
}

function createText(entry, index, pos, phase) {
  const meta = { name: entry.name, student: entry.student, description: entry.description, type: 'text', audioFile: entry.audioFile };
  const CW = 1024, CH = 768;
  const cv = document.createElement('canvas');
  cv.width = CW; cv.height = CH;
  const ctx = cv.getContext('2d');

  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, CW, CH);
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, CW - 16, CH - 16);

  ctx.fillStyle = '#2c1810';
  ctx.font = 'bold 56px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(entry.name || '', CW / 2, 90);

  ctx.strokeStyle = '#c9a87c';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(80, 120); ctx.lineTo(CW - 80, 120); ctx.stroke();

  if (entry.student) {
    ctx.fillStyle = '#5a4030';
    ctx.font = 'italic 30px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('by ' + entry.student + (entry.year ? '  ·  ' + entry.year : ''), CW / 2, 162);
  }

  const content = entry.content || entry.description || '';
  ctx.fillStyle = '#333';
  ctx.font = '28px Helvetica, Arial, sans-serif';
  ctx.textAlign = 'left';
  const maxW = CW - 100;
  const lineH = 42;
  let y = 220;
  const words = content.split(' ');
  let line = '';
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), 50, y);
      line = word + ' ';
      y += lineH;
      if (y > CH - 60) break;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line.trim(), 50, y);

  const tex = new THREE.CanvasTexture(cv);
  const w = TARGET_SIZE * (CW / CH);
  const h = TARGET_SIZE;

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, side: THREE.DoubleSide })
  );

  const wrapper = new THREE.Group();
  wrapper.add(mesh);
  wrapper.position.copy(pos);
  wrapper.position.y = h / 2 + 0.5;
  wrapper.rotation.y = (Math.random() - 0.5) * 0.4;
  wrapper.userData = { ...meta };
  scene.add(wrapper);
  registerArtwork(wrapper, wrapper.position.y, phase, false);
  loadedItems++;
  updateLoadingBar();
}

// ── Gallery loader ────────────────────────────────────────────────────────────
function layoutAndLoad(entries) {
  totalItems = entries.length;
  entries.forEach((entry, index) => {
    const pos = spiralPosition(index);
    const phase = index * 0.8;
    switch (entry.type ?? 'model') {
      case 'model': loadModel(entry, index, pos, phase); break;
      case 'image': loadImage(entry, index, pos, phase); break;
      case 'video': loadVideo(entry, index, pos, phase); break;
      case 'text':  createText(entry, index, pos, phase); break;
      default:      loadModel(entry, index, pos, phase);
    }
  });
}

async function loadGallery() {
  try {
    const res = await fetch('./gallery-data.json');
    const data = await res.json();
    if (data.galleryTitle) {
      galleryTitle = data.galleryTitle;
      const titleEl = document.getElementById('gallery-title');
      if (titleEl) titleEl.textContent = galleryTitle;
    }
    layoutAndLoad(data.entries || []);
  } catch (err) {
    console.error('Failed to load gallery-data.json:', err);
  }
}

// ── Inspect panel ─────────────────────────────────────────────────────────────
function showInspect(userData) {
  document.getElementById('inspect-name').textContent = userData.name || '';
  document.getElementById('inspect-student').textContent = userData.student ? 'by ' + userData.student : '';
  document.getElementById('inspect-desc').textContent = userData.description || '';

  const audioEl = document.getElementById('inspect-audio');
  if (audioEl) audioEl.classList.add('hidden');

  if (userData.audioFile) {
    if (currentAudio) { currentAudio.pause(); currentAudio.src = ''; }
    currentAudio = new Audio('./audio/' + userData.audioFile);
    currentAudio.play().catch(() => {});
    if (audioEl) {
      audioEl.textContent = '🔊 Playing narration';
      audioEl.classList.remove('hidden');
    }
    currentAudio.addEventListener('ended', () => {
      if (audioEl) audioEl.classList.add('hidden');
    });
  }

  document.getElementById('inspect-panel').classList.remove('hidden');
}

function hideInspect() {
  if (currentAudio) { currentAudio.pause(); currentAudio.src = ''; currentAudio = null; }
  const audioEl = document.getElementById('inspect-audio');
  if (audioEl) audioEl.classList.add('hidden');
  document.getElementById('inspect-panel').classList.add('hidden');
}

// ── Screenshot ────────────────────────────────────────────────────────────────
function takeScreenshot() {
  const dataURL = renderer.domElement.toDataURL('image/png');
  const link = document.createElement('a');
  const safe = galleryTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  link.download = 'gallery-' + safe + '-' + Date.now() + '.png';
  link.href = dataURL;
  link.click();
  showToast('📸 Photo saved!');
}

// ── Event handlers ────────────────────────────────────────────────────────────
function onPointerDown(e) {
  pointerDownPos = { x: e.clientX, y: e.clientY };
}

function onPointerUp(e) {
  const dx = Math.abs(e.clientX - pointerDownPos.x);
  const dy = Math.abs(e.clientY - pointerDownPos.y);
  if (dx > 5 || dy > 5) return;

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(artworks, true);

  if (hits.length > 0) {
    let obj = hits[0].object;
    while (obj && !obj.userData?.name) obj = obj.parent;
    if (obj?.userData?.name) { showInspect(obj.userData); return; }
  }
  hideInspect();
}

function onPointerMove(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(artworks, true);

  if (hits.length > 0) {
    let obj = hits[0].object;
    while (obj && !obj.userData?.name) obj = obj.parent;
    canvas.style.cursor = 'pointer';
    updateHoverLabel(obj?.userData?.name ? obj : null);
  } else {
    canvas.style.cursor = 'default';
    updateHoverLabel(null);
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ── Animate ───────────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  artworks.forEach((art) => {
    art.position.y = art.userData.baseY + Math.sin(t * 0.5 + art.userData.phase) * 0.15;
    if (art.userData.rotate) art.rotation.y += 0.003;
  });

  if (particles) particles.rotation.y += 0.0003;

  if (hoverLabel?.mesh.visible) {
    hoverLabel.mesh.lookAt(camera.position);
  }

  controls.update();
  renderer.render(scene, camera);
}

// ── Init ──────────────────────────────────────────────────────────────────────
createEnvironment();
createParticles();
createHoverLabel();

document.getElementById('inspect-close').addEventListener('click', hideInspect);
document.getElementById('photo-btn')?.addEventListener('click', takeScreenshot);
canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointerup', onPointerUp);
canvas.addEventListener('pointermove', onPointerMove);
window.addEventListener('resize', onResize);
window.addEventListener('keypress', (e) => { if (e.key.toLowerCase() === 'p') takeScreenshot(); });

loadGallery();
animate();
