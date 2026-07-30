# PC History Interactive - README

## Overview

An interactive, technically rigorous web experience that teaches PC component history through 3D interaction, real hardware references, data-driven simulations, and a structured research component.

## Features

- **3D Interactive Scene**: Explore a mock PC case with modular components (CPU, GPU, RAM, Storage, PSU, Motherboard)
- **Component Info Panels**: Click any component to view detailed specifications, history, and evolution
- **Progressive Disclosure**: Three difficulty levels (Beginner, Advanced, Expert)
- **Storage Benchmark Simulator**: Compare real drive speeds with animated copy simulations
- **Historical Timeline**: Interactive timelines for CPUs, GPUs, RAM, and motherboards
- **Data Visualization**: Charts showing IPC vs GHz, die shrink progression, memory bandwidth
- **Research Template**: Export your findings as Markdown for class submission

## Tech Stack

- **Three.js**: 3D rendering with OrbitControls
- **Chart.js**: Data visualization (optional, falls back to Canvas API)
- **Vanilla ES Modules**: No framework overhead
- **Vite**: Fast bundling and development server

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
pc-history-interactive/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── css/
│   ├── main.css            # Core styles
│   ├── panel.css           # Info panel styles
│   └── animations.css      # Animation keyframes
├── js/
│   ├── main.js             # Main application controller
│   ├── three-scene.js      # 3D scene setup and rendering
│   ├── components/
│   │   ├── cpu-module.js   # CPU visualization and data
│   │   ├── gpu-module.js   # GPU visualization and data
│   │   └── ram-mobo-module.js  # RAM and Motherboard data
│   ├── utils/
│   │   ├── benchmark-simulator.js  # Storage benchmark tool
│   │   ├── data-loader.js          # Data loading utility
│   │   └── state.js                # State management
│   └── research/
│       └── template.js         # Research template generator
├── data/
│   └── hardware-specs.json     # Hardware specifications database
├── research/
│   └── template.md             # Student research template
└── models/                     # 3D models (placeholder)
    └── README.md               # Model requirements
```

## Component Data

The site includes real hardware specifications for:

### CPUs
- Intel 486DX2-66 (1991)
- AMD K6-2 450 (1997)
- Intel Pentium 4 3.2GHz HT (2002)
- Intel Core 2 Duo E6600 (2006)
- AMD Ryzen 5 3600 (2017)
- Apple M1 (2020)
- Intel Core i9-13900K (2022)
- AMD Ryzen 7 7800X3D (2022)

### GPUs
- NVIDIA GeForce 256 (1999)
- AMD Radeon HD 5870 (2009)
- NVIDIA RTX 2080 Ti (2018)
- AMD RX 7900 XTX (2022)
- Apple M3 Max (2023)

### Storage
- Seagate ST340014A (1994) - IDE
- WD Raptor 150GB (2003) - SATA
- Samsung 840 EVO (2014) - SATA SSD
- Samsung 970 EVO Plus (2018) - NVMe
- WD Black SN850X (2021) - PCIe 4.0
- Crucial T700 (2024) - PCIe 5.0

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Accessibility

- Keyboard navigation for 3D scene
- ARIA labels for all interactive elements
- Colorblind-safe palettes
- `prefers-reduced-motion` respected
- Screen reader support for info panels

## Deployment

### GitHub Pages (current setup)

A GitHub Actions workflow (`.github/workflows/deploy-pcparts.yml` at the repo
root) builds this project with Vite and deploys it automatically on every push
to `main` that touches `tools/pcparts/`. No manual build/upload step is needed
as long as that workflow exists and GitHub Pages is set to deploy from
"GitHub Actions" (Settings → Pages → Source). Manual steps below are only for
deploying to a different host.

### Manual GitHub Pages

```bash
npm run build
# Upload dist/ contents to GitHub Pages
```

### Netlify

```bash
npm run build
# Connect repository to Netlify
# Set build command: npm run build
# Set publish directory: dist
```

### Vercel

```bash
npm run build
# Deploy with Vercel CLI
vercel --prod
```

## Performance Targets

- 60fps on mid-range laptops
- Initial load < 3 seconds
- Component modules lazy-loaded on selection
- All assets cached for offline use

## Future Enhancements

- [ ] Real 3D models (GLB files)
- [ ] VR support
- [ ] Multiplayer collaboration
- [ ] Auto-grading for research submissions
- [ ] Mobile-optimized touch controls
- [ ] Audio feedback for interactions

## License

Educational use. CC-BY for public distribution.

## Credits

Built for educational purposes. Hardware data sourced from:
- Intel ARK
- AMD Specifications
- PCMag, AnandTech, Tom's Hardware benchmarks
- PassMark benchmarks
