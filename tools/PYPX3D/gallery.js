import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const TARGET_SIZE = 2.5;
const GOLDEN_ANGLE = 2.399963;
const PLACEHOLDER_COLORS = [0x7c3aed, 0x2563eb, 0x059669, 0xd97706, 0xdc2626, 0xdb2777];

const canvas = document.getElementById('gallery-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050b1a);
scene.fog = new THREE.FogExp2(0x050b1a, 0.008);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 20);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 80;
controls.enablePan = false;
controls.target.set(0, 1, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
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

const fillLight = new THREE.PointLight(0x4466cc, 0.4);
fillLight.position.set(0, -1, 4);
scene.add(fillLight);

const rimLight = new THREE.PointLight(0xffaa66, 0.35);
rimLight.position.set(-4, 4, -6);
scene.add(rimLight);

// Floor
const gridHelper = new THREE.GridHelper(60, 30, 0x88aaff, 0x223366);
gridHelper.position.y = -0.5;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.4;
scene.add(gridHelper);

const floorGeo = new THREE.PlaneGeometry(60, 60);
const floorMat = new THREE.ShadowMaterial({ opacity: 0.35, transparent: true });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.49;
floor.receiveShadow = true;
scene.add(floor);

// State
const artworks = [];
const basePositions = [];
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerDownPos = { x: 0, y: 0 };
let totalModels = 0;
let loadedModels = 0;

function spiralPosition(index) {
  const angle = index * GOLDEN_ANGLE;
  const radius = 4 + index * 2.5;
  return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
}

function updateLoadingBar() {
  const bar = document.getElementById('loading-progress');
  if (!bar) return;
  const pct = totalModels > 0 ? (loadedModels / totalModels) * 100 : 0;
  bar.style.width = pct + '%';
  if (loadedModels >= totalModels) {
    setTimeout(() => {
      const wrap = document.getElementById('loading-bar');
      if (wrap) wrap.style.opacity = '0';
    }, 400);
  }
}

function placeModel(model, position) {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0) model.scale.setScalar(TARGET_SIZE / maxDim);

  // Re-compute after scaling to center on bounding box
  const box2 = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  box2.getCenter(center);
  model.position.sub(center);
  model.position.y += TARGET_SIZE / 2;

  const wrapper = new THREE.Group();
  wrapper.position.copy(position);
  wrapper.add(model);

  model.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  return wrapper;
}

async function layoutAndLoad(entries) {
  totalModels = entries.length;
  const loader = new GLTFLoader();

  entries.forEach((entry, index) => {
    const position = spiralPosition(index);

    loader.load(
      './models/' + entry.file,
      (gltf) => {
        const wrapper = placeModel(gltf.scene, position);
        wrapper.userData = { name: entry.name, student: entry.student, description: entry.description };
        scene.add(wrapper);
        artworks.push(wrapper);
        basePositions.push(position.y);
        loadedModels++;
        updateLoadingBar();
      },
      undefined,
      () => {
        // Fallback: colored wireframe cube
        const color = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];
        const geo = new THREE.BoxGeometry(2, 2, 2);
        const mat = new THREE.MeshBasicMaterial({ color, wireframe: true });
        const cube = new THREE.Mesh(geo, mat);

        const wrapper = new THREE.Group();
        wrapper.position.copy(position);
        wrapper.position.y = TARGET_SIZE / 2;
        wrapper.add(cube);
        wrapper.userData = { name: entry.name, student: entry.student, description: entry.description };
        scene.add(wrapper);
        artworks.push(wrapper);
        basePositions.push(wrapper.position.y);
        loadedModels++;
        updateLoadingBar();
      }
    );
  });
}

async function loadGallery() {
  try {
    const res = await fetch('./gallery-data.json');
    const data = await res.json();

    const titleEl = document.getElementById('gallery-title');
    if (titleEl && data.galleryTitle) titleEl.textContent = data.galleryTitle;

    await layoutAndLoad(data.entries || []);
  } catch (err) {
    console.error('Failed to load gallery-data.json:', err);
  }
}

function showInspect(userData) {
  document.getElementById('inspect-name').textContent = userData.name || '';
  document.getElementById('inspect-student').textContent = userData.student ? 'by ' + userData.student : '';
  document.getElementById('inspect-desc').textContent = userData.description || '';
  document.getElementById('inspect-panel').classList.remove('hidden');
}

function hideInspect() {
  document.getElementById('inspect-panel').classList.add('hidden');
}

function onPointerDown(e) {
  pointerDownPos = { x: e.clientX, y: e.clientY };
}

function onPointerUp(e) {
  // Only treat as a click if the pointer barely moved (not a drag)
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
    if (obj?.userData?.name) {
      showInspect(obj.userData);
      return;
    }
  }

  hideInspect();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  artworks.forEach((art, i) => {
    const base = basePositions[i] ?? 0;
    art.position.y = base + Math.sin(t * 0.5 + i * 0.8) * 0.15;
    art.rotation.y += 0.003;
  });

  controls.update();
  renderer.render(scene, camera);
}

document.getElementById('inspect-close').addEventListener('click', hideInspect);
canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointerup', onPointerUp);
window.addEventListener('resize', onResize);

loadGallery();
animate();
