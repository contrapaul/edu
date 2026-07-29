# Interactive PC History Web Activity: Project Plan

This document provides a complete, production-ready blueprint for building an interactive, technically rigorous web experience that teaches PC component history through 3D interaction, real hardware references, data-driven simulations, and a structured research component.

---

## 1. Project Architecture & Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Build/Dev** | Node.js 20+, npm, Vite, TypeScript | Fast bundling, module resolution, type safety |
| **3D Engine** | Three.js r160+, `@types/three`, `OrbitControls`, `GLTFLoader` | Scene rendering, camera control, model loading |
| **UI/UX** | Vanilla ES Modules + CSS Grid/Flexbox | Lightweight, no framework overhead, full control |
| **Data Viz** | Chart.js 4.x, `marked.js` (optional) | Graphs, benchmark rendering, markdown parsing |
| **State** | Custom lightweight store (Proxy-based) | Component selection, toggle states, simulation params |
| **Deployment** | GitHub Pages / Netlify / Vercel | Static hosting, CI/CD pipeline |

**Why this stack?** 
- Three.js is the industry standard for WebGL. Vite provides HMR, ES module resolution, and zero-config builds. TypeScript catches hardware spec mismatches early. Vanilla JS avoids framework bloat while maintaining full interactivity. All assets can be preloaded and cached for offline/low-bandwidth classrooms.

---

## 2. 3D Scene & Interaction Design

### Core Scene Setup
- **Camera**: PerspectiveCamera with `OrbitControls` (drag to rotate, scroll to zoom, right-click to pan)
- **Lighting**: Three-point studio lighting + ambient fill for clear component visibility
- **Scene**: Open mid-tower case (reference: Fractal Design Meshify C or Lian Li Lancool III) with modular component slots
- **Interaction Model**: 
  - Raycasting on click/tap → highlights selected component
  - UI sidebar toggles visibility per component (CPU, GPU, RAM, Storage, PSU, Mobo)
  - Clicking a component opens a contextual info panel with tabs: `Specs | History | Evolution | Simulator`

### Progressive Disclosure
- **Beginner Tab**: Basic specs, visual labels, simple animations
- **Advanced Tab**: IPC vs GHz charts, die shrink textures, queue depth diagrams, VRM phase counts, PCIe lane routing
- **Expert Tab**: Socket pinout maps, MCM vs monolithic die layouts, server dual-CPU motherboard routing, power delivery topologies

---

## 3. Component Modules (Deep Dive)

### A. CPU Module
**Real Hardware Examples to Model:**
| Year | Model | Socket | Process | Cores/Threads | Key Feature |
|------|-------|--------|---------|---------------|-------------|
| 1991 | Intel 80486DX2-66 | LGA 478 | 1µm | 1/1 | First x86 with on-die FPU |
| 1997 | AMD K6-2 450 | Socket 7 | 250nm | 1/1 | 3DNow! SIMD |
| 2002 | Intel Pentium 4 3.2GHz HT | LGA 478 | 130nm | 2/4 | Hyper-Threading (first x86) |
| 2006 | Intel Core 2 Duo E6600 | LGA 775 | 65nm | 2/2 | Dual-core, uncored architecture |
| 2017 | AMD Ryzen 5 3600 | AM4 | 12nm | 6/12 | MCM (CCD+I/O die) |
| 2020 | Apple M1 (MacBook Pro) | Custom | 5nm | 8/8 | Unified memory, ARM architecture |
| 2022 | Intel Core i9-13900K | LGA 1700 | 10nm (Intel 4) | 24/32 | Hybrid P/E cores |
| 2022 | AMD Ryzen 7 7800X3D | AM5 | 5nm | 8/16 | 3D V-Cache |

**Interactive Features:**
- **Die Shrink Animation**: Scale + texture swap showing process nodes (180nm → 3nm). Overlay shows transistor count (486: 1.2M → 7800X3D: 95.6M)
- **Hyperthreading Toggle**: Visualizes physical vs logical cores. Shows context-switch overhead vs throughput gains using real Cinebench R23 multi-threaded data
- **Dual-Core vs Multi-Core**: Animated core layout (monolithic vs MCM). Explains cache sharing, interconnect latency (AMD Infinity Fabric vs Intel Ring/U-Box)
- **Speed vs IPC**: Interactive chart plotting GHz vs IPC (Instructions Per Cycle). Highlights why 3.2GHz Pentium 4 < 2.4GHz Core 2 Duo in real workloads
- **Dual CPU Boards**: Shows server motherboard topology (dual Xeon LGA 3647, crossbar switches, NUMA zones)

### B. Storage Module
**Real Hardware Examples:**
| Year | Model | Interface | Capacity | Seq Read | Seq Write | Latency | Form Factor |
|------|-------|------------|----------|-----------|-----------|---------|-------------|
| 1994 | Seagate ST340014A | IDE/ATA-2 | 40 GB | 3 MB/s | 3 MB/s | ~15ms (seek) | 3.5" HDD |
| 2003 | WD Raptor 150GB 10k RPM | SATA 1.5 Gb/s | 150 GB | 50 MB/s | 50 MB/s | ~4ms | 3.5" HDD |
| 2014 | Samsung 840 EVO 128GB | SATA 6 Gb/s | 128 GB | 520 MB/s | 320 MB/s | ~0.1ms | 2.5" SATA SSD |
| 2018 | Samsung 970 EVO Plus 1TB | PCIe 3.0 x4 NVMe | 1 TB | 3,500 MB/s | 3,300 MB/s | ~0.08ms | M.2 2280 |
| 2021 | WD Black SN850X 2TB | PCIe 4.0 x4 NVMe | 2 TB | 7,300 MB/s | 6,600 MB/s | ~0.06ms | M.2 2280 |
| 2024 | Crucial T700 4TB | PCIe 5.0 x4 NVMe | 4 TB | 12,400 MB/s | 11,800 MB/s | ~0.04ms | M.2 2280 |

**Interactive Features:**
- **Drive Selector**: Dropdown to pick any of the 6 drives
- **Benchmark Simulator**: 
  - Input: File size (1GB, 10GB, 50GB)
  - Output: Animated copy progress bar + real-time speed graph + total time
  - HDD: Platter rotation + actuator arm seek animation (proportional to seek time)
  - SSD/NVMe: NAND die stack visualization + controller queue (CMD/Q) animation
  - Data mapping: `animationDuration = (fileSizeMB / realMBs) * 0.5` (scaled for visibility)
- **Latency Visualization**: Microsecond delay overlay showing OS call → controller → NAND/PLC → host response
- **Interface Evolution**: IDE ribbon → SATA data/power → M.2 key M → PCIe lane arbitration (Gen3→Gen5 signaling rates)

### C. GPU & RAM Modules (Brief but Rigorous)
- **GPU**: GeForce 256 (1999, first GPU), Radeon HD 5870 (2009, GDDR5, 1.6Gbps), RTX 2080 Ti (2018, RT/Tensor cores, 16GB GDDR6X), RX 7900 XTX (2022, 24GB GDDR6, 320-bit bus), Apple M3 Max (2023, unified memory, hardware ray tracing)
- **RAM**: 16MB SIMM (1993), 256MB PC133 DDR (2001), 8GB DDR4 3200 CL16 (2018), 32GB DDR5 6000 CL30 (2023), Apple Unified Memory (M-series, 128GB pool)
- **Motherboard/Socket**: LGA 478 → Socket 7 → LGA 775 → AM2 → AM3 → AM4 → AM5 → LGA 1700. VRM phases (4-phase 2005 → 16+2 phase 2023), M.2 slots, PCIe x16 lane distribution, BIOS → UEFI evolution

---

## 4. Interactive Features & Simulations

| Feature | Implementation | User Flow |
|---------|----------------|-----------|
| **3D Rotation** | `OrbitControls` with damping, min/max distance | Drag to rotate, scroll to zoom |
| **Hide/Show Elements** | `component.visible = false/true` + UI toggles | Sidebar checkboxes per component |
| **Selection & Info Panel** | Raycaster → highlight → open modal | Click → slides in right panel with tabs |
| **CPU Die Shrink** | Texture swap + scale animation + overlay labels | Slider 180nm→3nm → shows die, transistors, heat |
| **Hyperthreading/Cores** | SVG/Canvas overlay of core/thread layout | Toggle buttons → shows context switch vs throughput |
| **Storage Benchmark** | JS timer + progress bar + speed graph | Select drives → input file size → run → watch copy |
| **Real Data Mapping** | JSON/CSV benchmark DB → duration scaling | `time = (sizeMB / realMBps) * scaleFactor` |
| **Research Export** | `marked.js` renders `.md` → download `.md` | "Export Research" button → triggers file download |

---

## 5. Research Component & Markdown Template

### Required Research MD Structure (`research/template.md`)
```markdown
---
title: "PC Component History Research"
author: "[Your Name]"
date: 2024-06-15
status: "Draft"
---

# PC Component History Research

## 1. CPU Evolution
| Year | Model | Socket | Process | Cores/Threads | IPC vs GHz Note |
|------|-------|--------|---------|---------------|-----------------|
|      |       |        |         |               |                 |

**Required Examples:** Intel 486DX2, Pentium 4 HT, Core 2 Duo, Ryzen 5 3600, Apple M1, i9-13900K, 7800X3D

## 2. Storage Timeline
| Year | Model | Interface | Capacity | Seq Read | Seek/Latency | Form Factor |
|------|-------|------------|----------|----------|--------------|-------------|
|      |       |            |          |          |              |             |

**Required Examples:** ST340014A, WD Raptor, 840 EVO, 970 EVO Plus, SN850X, T700

## 3. Analysis Questions
1. How did the transition from single-core to multi-core change software development paradigms?
2. Why did NVMe overtake SATA despite similar physical interfaces?
3. Compare AMD MCM vs Intel monolithic approaches. What are the yield/thermal trade-offs?
4. How does unified memory (Apple Silicon) differ from traditional CPU+GPU RAM partitioning?
5. Predict the next 5 years for socket/interface standards. Justify with current bottlenecks.

## 4. Submission Guidelines
- Fill all tables with real hardware data.
- Include 3 benchmark comparisons from your simulator.
- Export as `.md` or `.html`. Submit via LMS or GitHub.
- Rubric: Accuracy (40%), Depth (30%), Visualization (20%), Reflection (10%)
```

**Integration:** 
- Site includes a "Start Research" button that clones this template into a local editable textarea or downloads it.
- Students can fill it out offline, then upload back to the site for auto-grading (regex/JSON validation) or manual review.

---

## 6. File Structure & Dependencies

### Project Directory
```
pc-history-interactive/
├── index.html
├── css/
│   ├── main.css
│   ├── panel.css
│   └── animations.css
├── js/
│   ├── main.js
│   ├── three-scene.js
│   ├── components/
│   │   ├── cpu-module.js
│   │   ├── storage-module.js
│   │   ├── gpu-module.js
│   │   └── ram-mobo-module.js
│   ├── utils/
│   │   ├── raycaster.js
│   │   ├── benchmark-simulator.js
│   │   └── data-loader.js
│   └── research/
│       └── template.js
├── data/
│   ├── hardware-specs.json
│   ├── benchmarks.csv
│   └── timeline-events.json
├── models/
│   ├── pc-case.glb
│   ├── cpu-die.glb
│   ├── hdd-platter.glb
│   └── ssd-nand.glb
├── research/
│   ├── template.md
│   └── rubric.md
├── package.json
├── vite.config.js
└── README.md
```

### `package.json` (Core Dependencies)
```json
{
  "name": "pc-history-interactive",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "three": "^0.160.0",
    "chart.js": "^4.4.1",
    "marked": "^12.0.0"
  },
  "devDependencies": {
    "vite": "^5.1.0",
    "@types/three": "^0.160.0"
  }
}
```

### `vite.config.js`
```js
import { defineConfig } from 'vite';
export default defineConfig({
  build: { target: 'esnext' },
  server: { open: true }
});
```

---

## 7. Development Workflow & Timeline

| Phase | Tasks | Deliverables |
|-------|-------|--------------|
| **1. Setup** | Node/npm, Vite, Three.js, VS Code, Git init | `package.json`, `vite.config.js`, folder structure |
| **2. 3D Scene** | Import GLTF, set up OrbitControls, lighting, raycasting | `three-scene.js`, `pc-case.glb` |
| **3. UI/UX** | Sidebar toggles, info panel, responsive CSS | `panel.css`, `main.js` |
| **4. CPU Module** | Die shrink slider, core/thread toggle, IPC chart | `cpu-module.js`, `hardware-specs.json` |
| **5. Storage Module** | Drive selector, benchmark simulator, animations | `storage-module.js`, `benchmarks.csv` |
| **6. GPU/RAM/Mobo** | Socket evolution, VRM, PCIe lanes, unified memory | `gpu-module.js`, `ram-mobo-module.js` |
| **7. Research** | MD template, export/download, validation | `research/template.md`, `research/template.js` |
| **8. Polish** | Accessibility, performance, error handling, docs | `README.md`, Lighthouse score >90 |
| **9. Deploy** | GitHub Pages/Netlify, CI/CD, testing | Live URL, offline cache manifest |

**Estimated Timeline:** 4-6 weeks (1 developer + 1 educator/content specialist)

---

## 8. Performance, Accessibility & Deployment

- **Performance**: 
  - Compress GLTF to `.glb` with Draco compression
  - Lazy-load modules on component selection
  - Limit draw calls (<500), use instancing for repeated elements (capacitors, pins)
  - Target 60fps on mid-range laptops (Intel i5/AMD Ryzen 5, 8GB RAM)
- **Accessibility**:
  - Keyboard navigation for 3D (arrow keys + Enter)
  - ARIA labels for all interactive elements
  - Colorblind-safe palettes (avoid red/green reliance)
  - Text alternatives for all 3D animations
  - `prefers-reduced-motion` respected
- **Deployment**: 
  - Static hosting (GitHub Pages/Netlify)
  - Service worker for offline classroom use
  - CI pipeline: `npm run build` → deploy → Lighthouse audit

---

## 9. Required Resources & Downloads

| Item | Purpose | Source |
|------|---------|--------|
| Node.js 20+ | Runtime & package manager | nodejs.org |
| VS Code | Code editor | code.visualstudio.com |
| Three.js r160 | 3D engine | threejs.org |
| Vite 5 | Build tool | vitejs.dev |
| Blender 4 | 3D modeling (optional) | blender.org |
| GLTF/GLB files | 3D models | Sketchfab (free), Kenney.nl, or export from Blender |
| Benchmark Archives | Real speed/latency data | PCMag, AnandTech, Tom's Hardware, PassMark |
| Intel ARK / AMD Spec Sheets | Official CPU/GPU data | intel.com, amd.com |
| Chart.js, marked.js | Graphs & markdown | npm, cdnjs |

**Recommended 3D Asset Strategy:**
- Use low-poly stylized case (10k-20k triangles)
- High-res PBR textures for dies/NAND (512x512 to 1024x1024)
- Provide fallback 2D diagrams if WebGL fails
- License: CC-BY or public domain for educational use

---

## 10. Next Steps for Implementation

1. **Initialize repo** with `npm create vite@latest pc-history-interactive -- --template vanilla`
2. **Import Three.js** + OrbitControls + GLTFLoader
3. **Model/import** `pc-case.glb` (use free mid-tower model or approximate with primitives)
4. **Implement raycasting** + component grouping
5. **Build CPU module** first (slider, toggle, chart)
6. **Build storage simulator** (drive selector, benchmark mapping, animation)
7. **Integrate info panel** + research template
8. **Test** on Chrome/Firefox, mobile, low-end hardware
9. **Deploy** + gather educator feedback
10. **Iterate** based on classroom usability

---

This plan delivers a technically rigorous, visually engaging, and pedagogically structured interactive experience. It avoids oversimplification by grounding every interaction in real hardware specifications, historical context, and data-driven simulations, while remaining accessible to high school students through progressive disclosure and clear UI. The modular codebase, explicit file structure, and ready-to-execute dependency list ensure smooth development and deployment.