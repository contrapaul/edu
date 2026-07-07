# Museum of Mr. K's Technology — 2D

A Zelda/Pokemon-style top-down museum: walk around with WASD/arrows (or the
on-screen pad on phones), press **E** at a display to read about it, **F** to
hear its audio guide. Replaces the 3D museum experiments, which required
Pointer Lock and didn't work on mobile.

**To edit the museum (map, exhibits, audio, art), see [`EDITING.md`](EDITING.md).**

## Architecture in 10 lines

1. `index.html` — full-bleed page: canvas mount + all DOM overlays (prompt, popup, toast, touch controls).
2. `game.js` — one Phaser scene: loads the map + sprites, moves the player, detects the nearest exhibit.
3. `ui.js` — everything DOM: the exhibit popup (3 display types), audio-guide player, toast, prompt.
4. `controls.js` — keyboard + touch d-pad, exposed as simple direction flags and E/F callbacks.
5. `assets/map/museum.tmx` — the map **source**, edited in Tiled; exported to `museum.json`, which the game loads.
6. `exhibits.json` — all exhibit content (HTML text, images, optional audio path), keyed by id.
7. Tiled markers link to content by id: point object property `exhibit: "c64"` ↔ `"id": "c64"`.
8. `assets/sprites/sprites.json` — animation manifest; new animated sprites need no code changes.
9. `audio/<exhibit-id>.mp3` — audio guides by naming convention; missing files degrade to a toast.
10. No build step: everything is plain scripts served statically, engine vendored in `lib/`.

## Pinned versions

- **Phaser 3.90.0** (vendored at `lib/phaser-3.90.0.min.js`; from npm `phaser@3.90.0`). If you upgrade, stay on 3.x — keep ≥ 3.60 for Tiled 1.9+ format support — and rename the file so the version stays visible.
- **Tiled 1.10 file format** (`museum.tmx` / `museum.json`). Any Tiled 1.10+ works.

## Testing locally

```
python3 serve_nocache.py     # from the repo root
# open http://localhost:5501/tools/museumgame/
```

Art/audio placeholders are generated originals (see `assets/CREDITS.md`);
upgrade paths to CC0 packs are in EDITING.md §7.
