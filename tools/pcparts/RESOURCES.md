# PC History Interactive - Resources & Downloads

## Required Resources

| Item | Purpose | Source |
|------|---------|--------|
| Node.js 20+ | Runtime & package manager | [nodejs.org](https://nodejs.org) |
| VS Code | Code editor | [code.visualstudio.com](https://code.visualstudio.com) |
| Three.js r160 | 3D engine | [threejs.org](https://threejs.org) |
| Vite 5 | Build tool | [vitejs.dev](https://vitejs.dev) |
| Blender 4 | 3D modeling (optional) | [blender.org](https://blender.org) |

## 3D Asset Strategy

### Free Resources
- **Sketchfab** (sketchfab.com) - Search "computer case" or "motherboard"
- **Kenney.nl** (kenney.nl) - Game-ready low-poly assets
- **GrabCAD** (grabcad.com) - Engineering-grade models

### Recommended Approach
1. Use low-poly stylized case (10k-20k triangles)
2. High-res PBR textures for dies/NAND (512x512 to 1024x1024)
3. Provide fallback 2D diagrams if WebGL fails
4. License: CC-BY or public domain for educational use

## Hardware Data Sources

| Source | Data Type | URL |
|--------|-----------|-----|
| Intel ARK | CPU specifications | [ark.intel.com](https://ark.intel.com) |
| AMD Spec Sheets | CPU/GPU specifications | [amd.com](https://amd.com) |
| PassMark | Benchmark data | [passmark.com](https://passmark.com) |
| PCMag | Reviews and benchmarks | [pcmag.com](https://pcmag.com) |
| AnandTech | In-depth reviews | [anandtech.com](https://anandtech.com) |
| Tom's Hardware | Benchmarks | [tomshardware.com](https://tomshardware.com) |

## Installation Commands

```bash
# Initialize project
npm create vite@latest pc-history-interactive -- --template vanilla

# Install dependencies
cd pc-history-interactive
npm install

# Install 3D engine and utilities
npm install three@0.160.0
npm install chart.js@4.4.1
npm install marked@12.0.0

# Install dev dependencies
npm install -D vite@5.1.0 @types/three@0.160.0

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Testing

Test on the following browsers:
- Chrome 90+ (primary)
- Firefox 88+
- Safari 14+
- Edge 90+

Test on low-end hardware:
- Intel i5 / AMD Ryzen 5
- 8GB RAM
- Integrated graphics

## Deployment Options

### GitHub Pages (Free)
1. Build the project: `npm run build`
2. Push `dist/` contents to GitHub repository
3. Enable GitHub Pages from repository settings

### Netlify (Free)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

## Performance Checklist

- [ ] GLB files compressed with Draco
- [ ] Textures optimized (WebP format where possible)
- [ ] Lazy-load component modules on selection
- [ ] Limit draw calls (<500)
- [ ] Use instancing for repeated elements
- [ ] Target 60fps on mid-range laptops
- [ ] Service worker for offline classroom use
- [ ] Lighthouse score >90

## Troubleshooting

### WebGL not supported
- Ensure browser supports WebGL 2.0
- Update graphics drivers
- Check for hardware acceleration enabled

### Models not loading
- Verify GLB files are in `models/` directory
- Check browser console for errors
- Verify file paths are correct

### Performance issues
- Reduce polygon count on models
- Lower texture resolution
- Disable shadows on low-end devices
- Use `prefers-reduced-motion` media query
