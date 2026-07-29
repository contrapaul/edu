# 3D Models Required

This directory should contain 3D model files for the PC components.

## Required Models

| Model | Format | Description |
|-------|--------|-------------|
| `pc-case.glb` | GLB (glTF binary) | Mid-tower PC case (Fractal Design Meshify C or Lian Li Lancool III reference) |
| `cpu-die.glb` | GLB | CPU die with visible transistor pattern |
| `hdd-platter.glb` | GLB | HDD platter with actuator arm |
| `ssd-nand.glb` | GLB | SSD with NAND flash chips and controller |

## Recommended Specifications

- **Triangle Count**: 10,000-20,000 triangles per model (low-poly stylized)
- **Textures**: 512x512 to 1024x1024 PBR textures
- **Compression**: Draco compression for glTF files
- **License**: CC-BY or public domain for educational use

## Sources for Free Models

1. **Sketchfab** (sketchfab.com) - Filter by "Downloadable" and "CC-BY"
2. **Kenney.nl** (kenney.nl) - Various game assets
3. **Blender** (blender.org) - Create your own with Blender
4. **GrabCAD** (grabcad.com) - Engineering models

## Fallback

If 3D models cannot be loaded, the application will display 2D diagrams as fallback.

## Notes

- The current implementation uses Three.js primitives (boxes, cylinders) as placeholders
- Replace with real GLB models by updating `three-scene.js` to use `GLTFLoader`
- Ensure all models have proper UV mapping and reasonable polygon counts
