// 3D Scene Manager - Three.js setup and rendering
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { appState } from './utils/state.js';

class Scene3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.components = {};
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedComponent = null;
    this.animationId = null;
    this.isExploded = true;
    this.isWireframe = false;
    
    this.init();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e17);

    // Camera
    const { width, height } = this.getContainerSize();
    const aspect = width / height;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(5, 4, 6);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 20;
    this.controls.target.set(0, 0, 0);

    // Lighting
    this.setupLighting();

    // Build PC with primitives (no external models needed)
    this.buildPC();

    // Event listeners
    this.setupEvents();

    // Start animation loop
    this.animate();

    // Hide loading overlay
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');
  }

  // The canvas is sized via CSS (width/height: 100%), and three.js writes
  // its resolved pixel size back onto the canvas as an inline style. Reading
  // canvas.clientWidth/Height would then read that inline style back instead
  // of the actual available space, so measure the parent container instead.
  getContainerSize() {
    return {
      width: this.canvas.parentElement.clientWidth,
      height: this.canvas.parentElement.clientHeight
    };
  }

  setupLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x404060, 0.6);
    this.scene.add(ambient);

    // Key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x4a9eff, 0.4);
    fillLight.position.set(-5, 3, -3);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 0.3);
    rimLight.position.set(0, -3, -5);
    this.scene.add(rimLight);
  }

  buildPC() {
    const pcGroup = new THREE.Group();

    // Case (mid-tower)
    const caseGeo = new THREE.BoxGeometry(4, 5, 2);
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    caseMesh.position.y = -0.5;
    caseMesh.name = 'case';
    pcGroup.add(caseMesh);

    // Case frame (edges)
    const edgesGeo = new THREE.EdgesGeometry(caseGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x4a9eff });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    edges.position.y = -0.5;
    pcGroup.add(edges);

    // Motherboard
    const moboGeo = new THREE.BoxGeometry(3.6, 4.6, 0.1);
    const moboMat = new THREE.MeshStandardMaterial({
      color: 0x1a3a1a,
      metalness: 0.3,
      roughness: 0.7
    });
    const mobo = new THREE.Mesh(moboGeo, moboMat);
    mobo.position.set(0, -0.3, 0.9);
    mobo.name = 'mobo';
    mobo.userData = { component: 'mobo' };
    pcGroup.add(mobo);

    // Add motherboard details (chipset heatsink)
    const chipsetGeo = new THREE.BoxGeometry(0.8, 0.8, 0.15);
    const chipsetMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.9,
      roughness: 0.2
    });
    const chipset = new THREE.Mesh(chipsetGeo, chipsetMat);
    chipset.position.set(0.5, -1.5, 1.0);
    pcGroup.add(chipset);

    // CPU
    const cpuGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const cpuMat = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.95,
      roughness: 0.1
    });
    const cpu = new THREE.Mesh(cpuGeo, cpuMat);
    cpu.position.set(-0.5, 0.5, 1.0);
    cpu.name = 'cpu';
    cpu.userData = { component: 'cpu', position: { x: -0.5, y: 0.5, z: 1.0 } };
    pcGroup.add(cpu);

    // CPU cooler
    const coolerGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    const coolerMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.8,
      roughness: 0.3
    });
    const cooler = new THREE.Mesh(coolerGeo, coolerMat);
    cooler.position.set(-0.5, 0.8, 1.0);
    pcGroup.add(cooler);

    // Fan (visual)
    const fanGeo = new THREE.RingGeometry(0.1, 0.35, 32);
    const fanMat = new THREE.MeshStandardMaterial({
      color: 0x4a9eff,
      metalness: 0.5,
      roughness: 0.5,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const fan = new THREE.Mesh(fanGeo, fanMat);
    fan.position.set(-0.5, 1.0, 1.0);
    fan.rotation.x = Math.PI / 2;
    fan.name = 'fan';
    pcGroup.add(fan);

    // RAM sticks
    const ramGeo = new THREE.BoxGeometry(0.1, 2.5, 0.08);
    const ramMat = new THREE.MeshStandardMaterial({
      color: 0x1a3a1a,
      metalness: 0.4,
      roughness: 0.6
    });
    for (let i = 0; i < 4; i++) {
      const ram = new THREE.Mesh(ramGeo, ramMat);
      ram.position.set(0.3 + i * 0.15, 0.3, 1.0);
      ram.name = `ram-${i}`;
      ram.userData = { component: 'ram', index: i };
      pcGroup.add(ram);
    }

    // GPU
    const gpuGeo = new THREE.BoxGeometry(2.5, 0.3, 0.8);
    const gpuMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.7,
      roughness: 0.3
    });
    const gpu = new THREE.Mesh(gpuGeo, gpuMat);
    gpu.position.set(0, -1.5, 0.5);
    gpu.name = 'gpu';
    gpu.userData = { component: 'gpu' };
    pcGroup.add(gpu);

    // GPU fans
    for (let i = 0; i < 3; i++) {
      const fanGeo = new THREE.RingGeometry(0.15, 0.3, 32);
      const fanMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.5,
        roughness: 0.5,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      const fan = new THREE.Mesh(fanGeo, fanMat);
      fan.position.set(-0.8 + i * 0.8, -1.5, 0.1);
      fan.rotation.x = Math.PI / 2;
      fan.name = `gpu-fan-${i}`;
      pcGroup.add(fan);
    }

    // Storage (M.2 SSD)
    const ssdGeo = new THREE.BoxGeometry(0.6, 0.1, 0.05);
    const ssdMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a3e,
      metalness: 0.6,
      roughness: 0.4
    });
    const ssd = new THREE.Mesh(ssdGeo, ssdMat);
    ssd.position.set(1.0, -2.0, 0.95);
    ssd.name = 'storage';
    ssd.userData = { component: 'storage' };
    pcGroup.add(ssd);

    // PSU
    const psuGeo = new THREE.BoxGeometry(2.0, 1.2, 1.5);
    const psuMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.6,
      roughness: 0.5
    });
    const psu = new THREE.Mesh(psuGeo, psuMat);
    psu.position.set(0, -2.8, 0);
    psu.name = 'psu';
    psu.userData = { component: 'psu' };
    pcGroup.add(psu);

    // Power cables (simplified)
    const cableMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.3,
      roughness: 0.8
    });
    
    // PCIe power cable to GPU
    const cableGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    const cable = new THREE.Mesh(cableGeo, cableMat);
    cable.position.set(0, -2.0, 0.6);
    cable.rotation.z = 0.3;
    pcGroup.add(cable);

    this.components.case = caseMesh;
    this.components.mobo = mobo;
    this.components.cpu = cpu;
    this.components.gpu = gpu;
    this.components.storage = ssd;
    this.components.psu = psu;

    pcGroup.userData = { components: this.components };
    this.scene.add(pcGroup);
    this.pcGroup = pcGroup;

    // Grid helper (subtle)
    const grid = new THREE.GridHelper(20, 20, 0x2a3050, 0x1a2035);
    grid.position.y = -3;
    this.scene.add(grid);
  }

  setupEvents() {
    // Resize
    window.addEventListener('resize', () => this.onResize());

    // Click to select component
    this.canvas.addEventListener('click', (e) => this.onClick(e));

    // Hover highlight
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onResize() {
    const { width, height } = this.getContainerSize();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check intersections with component meshes
    const componentMeshes = Object.values(this.components);
    const intersects = this.raycaster.intersectObjects(componentMeshes, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const component = object.userData.component || object.name;
      if (component) {
        this.selectComponent(component, object);
      }
    } else {
      this.deselectComponent();
    }
  }

  onMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const componentMeshes = Object.values(this.components);
    const intersects = this.raycaster.intersectObjects(componentMeshes, true);

    this.canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
  }

  selectComponent(name, mesh) {
    // Reset previous selection
    if (this.selectedComponent && this.components[this.selectedComponent]) {
      const prevMesh = this.components[this.selectedComponent];
      if (prevMesh.material.emissive) {
        prevMesh.material.emissive.setHex(0x000000);
      }
    }

    this.selectedComponent = name;
    appState.set('selectedComponent', name);

    // Highlight selected
    if (mesh.material && mesh.material.emissive) {
      mesh.material.emissive.setHex(0x4a9eff);
      mesh.material.emissiveIntensity = 0.3;
    }

    // Open info panel
    this.openInfoPanel(name, mesh);
  }

  deselectComponent() {
    if (this.selectedComponent && this.components[this.selectedComponent]) {
      const mesh = this.components[this.selectedComponent];
      if (mesh.material && mesh.material.emissive) {
        mesh.material.emissive.setHex(0x000000);
      }
    }
    this.selectedComponent = null;
    appState.set('selectedComponent', null);
    this.closeInfoPanel();
  }

  openInfoPanel(componentName, mesh) {
    const panel = document.getElementById('info-panel');
    const title = document.getElementById('component-title');
    const desc = document.getElementById('component-desc');
    const specsGrid = document.getElementById('specs-grid');

    if (!panel || !title) return;

    // Set title and description
    const componentNames = {
      case: 'PC Case',
      cpu: 'Central Processing Unit (CPU)',
      gpu: 'Graphics Processing Unit (GPU)',
      ram: 'Random Access Memory (RAM)',
      storage: 'Storage Drive',
      mobo: 'Motherboard',
      psu: 'Power Supply Unit (PSU)'
    };

    title.textContent = componentNames[componentName] || componentName.toUpperCase();

    const descriptions = {
      case: 'The enclosure housing and protecting every other component, and shaping airflow for cooling.',
      cpu: 'The brain of the computer. Executes instructions and processes data.',
      gpu: 'Handles graphics rendering, parallel processing, and AI computations.',
      ram: 'Temporary fast-access memory for active programs and data.',
      storage: 'Long-term data storage - operating system, files, and applications.',
      mobo: 'The main circuit board connecting all components together.',
      psu: 'Converts AC power to DC power for all components.'
    };

    desc.textContent = descriptions[componentName] || '';

    // Populate specs
    specsGrid.innerHTML = '';
    const specs = this.getComponentSpecs(componentName);
    specs.forEach(spec => {
      const card = document.createElement('div');
      card.className = 'spec-card';
      card.innerHTML = `<h3>${spec.label}</h3><p>${spec.value}</p>`;
      specsGrid.appendChild(card);
    });

    // Show panel
    panel.classList.add('open');

    // Switch to specs tab
    this.switchTab('specs');
  }

  getComponentSpecs(componentName) {
    const specs = {
      case: [
        { label: 'Form Factor', value: 'Mid-tower ATX' },
        { label: 'Drive Bays', value: '2-4x 3.5"/2.5"' },
        { label: 'Expansion Slots', value: '7x PCIe' },
        { label: 'Front I/O', value: 'USB-A, USB-C, Audio' },
        { label: 'Airflow', value: '2-3 intake, 1-2 exhaust fans' },
        { label: 'Max GPU Length', value: '330-400mm' }
      ],
      cpu: [
        { label: 'Socket', value: 'LGA 1700 / AM5' },
        { label: 'Process', value: '5nm - 10nm' },
        { label: 'Cores/Threads', value: '8-32 / 16-64' },
        { label: 'Clock Speed', value: '3.0-5.8 GHz' },
        { label: 'TDP', value: '65-250W' },
        { label: 'Cache', value: '32MB - 96MB' }
      ],
      gpu: [
        { label: 'VRAM', value: '8GB - 24GB GDDR6X' },
        { label: 'Bus Width', value: '128-384 bit' },
        { label: 'Memory BW', value: '300-960 GB/s' },
        { label: 'CUDA/Stream Cores', value: '6000-18000' },
        { label: 'TDP', value: '150-355W' },
        { label: 'Features', value: 'RT, Tensor, FSR' }
      ],
      ram: [
        { label: 'Type', value: 'DDR4 / DDR5' },
        { label: 'Capacity', value: '8GB - 128GB' },
        { label: 'Speed', value: '3200-8000 MHz' },
        { label: 'Latency', value: 'CL14-CL40' },
        { label: 'Voltage', value: '1.1V - 1.2V' },
        { label: 'Channels', value: 'Dual / Quad' }
      ],
      storage: [
        { label: 'Interface', value: 'PCIe 5.0 NVMe' },
        { label: 'Capacity', value: '500GB - 8TB' },
        { label: 'Sequential Read', value: '3500-14000 MB/s' },
        { label: 'Sequential Write', value: '3000-11000 MB/s' },
        { label: 'Latency', value: '0.04-0.1ms' },
        { label: 'Form Factor', value: 'M.2 2280' }
      ],
      mobo: [
        { label: 'Socket', value: 'LGA 1700 / AM5' },
        { label: 'Chipset', value: 'Z790 / X670E' },
        { label: 'RAM Slots', value: '4x DDR5' },
        { label: 'PCIe Slots', value: 'x16, x4, x1' },
        { label: 'M.2 Slots', value: '2-4 slots' },
        { label: 'USB Ports', value: 'USB 3.2/4.0, Type-C' }
      ],
      psu: [
        { label: 'Standard', value: 'ATX 3.0' },
        { label: 'Wattage', value: '550-1200W' },
        { label: 'Efficiency', value: '80+ Gold/Titanium' },
        { label: 'Modularity', value: 'Fully modular' },
        { label: 'Connectors', value: 'PCIe 5x 8-pin' },
        { label: 'Warranty', value: '8-12 years' }
      ]
    };

    return specs[componentName] || [];
  }

  closeInfoPanel() {
    const panel = document.getElementById('info-panel');
    if (panel) panel.classList.remove('open');
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    const activeTab = document.getElementById(`tab-${tabName}`);
    if (activeTab) activeTab.classList.add('active');
  }

  setViewMode(mode) {
    this.isExploded = mode === 'exploded';
    this.isWireframe = mode === 'wireframe';

    // Animate component positions
    const positions = this.isExploded ? {
      cpu: { x: -0.5, y: 2.5, z: 1.0 },
      gpu: { x: 0, y: -2.5, z: 0.5 },
      mobo: { x: 0, y: -0.3, z: 0.9 },
      storage: { x: 1.0, y: -2.0, z: 1.5 },
      psu: { x: 0, y: -2.8, z: 0 }
    } : {
      cpu: { x: -0.5, y: 0.5, z: 1.0 },
      gpu: { x: 0, y: -1.5, z: 0.5 },
      mobo: { x: 0, y: -0.3, z: 0.9 },
      storage: { x: 1.0, y: -2.0, z: 0.95 },
      psu: { x: 0, y: -2.8, z: 0 }
    };

    Object.entries(positions).forEach(([key, pos]) => {
      if (this.components[key]) {
        this.animateToPosition(this.components[key], pos, 500);
      }
    });

    // Wireframe mode
    Object.values(this.components).forEach(mesh => {
      if (mesh.material) {
        mesh.material.wireframe = this.isWireframe;
      }
    });
  }

  animateToPosition(mesh, targetPos, duration) {
    const startPos = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z };
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);

      mesh.position.x = startPos.x + (targetPos.x - startPos.x) * eased;
      mesh.position.y = startPos.y + (targetPos.y - startPos.y) * eased;
      mesh.position.z = startPos.z + (targetPos.z - startPos.z) * eased;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  resetCamera() {
    this.camera.position.set(5, 4, 6);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    this.controls.update();

    // Animate fans
    const fans = this.scene.traverse(child => {
      if (child.name && child.name.includes('fan')) {
        child.rotation.z += 0.1;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  toggleComponent(name, visible) {
    if (this.components[name]) {
      this.components[name].visible = visible;
    }
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
  }
}

export default Scene3D;
