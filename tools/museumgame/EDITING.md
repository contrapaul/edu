# Editing the Museum Game

This is the owner's cookbook for `/tools/museumgame/`. Each recipe is
self-contained — you don't need to be a game developer, and (except for
recipe 7) you never touch the engine code.

**The three files you'll edit most:**

| What you want to change | File | How |
|---|---|---|
| The floor plan / walls / decorations | `assets/map/museum.tmx` | Tiled editor (recipe 2) |
| Exhibit text, images, display type | `exhibits.json` | any text editor (recipe 4) |
| Audio guides | `audio/*.mp3` | just drop files in (recipe 5) |

---

## 1. Setup

1. **Install Tiled** (free map editor): https://www.mapeditor.org — download for Mac/Windows. This project was built against the Tiled 1.10 file format; any 1.10+ release is fine.
2. **Run the site locally** from the repo root:
   ```
   python3 serve_nocache.py
   ```
   then open http://localhost:5501/tools/museumgame/ — the `serve_nocache` server disables caching, so a browser refresh always shows your latest edits.

## 2. Edit the map

1. Open `assets/map/museum.tmx` in Tiled.
2. Paint on the four tile layers (select a layer in the *Layers* panel, pick tiles from the *Tilesets* panel):
   - **ground** — floors, carpets, the red runner.
   - **decor** — flat things drawn *on top of the floor but under the player* (the brass medallions).
   - **walls** — walls, pedestals, benches, plants: anything solid. A tile is solid if it has the `collides` property (recipe 3).
   - **overhead** — drawn *above the player* (tops of doorways, hanging signs). Empty right now — this is where you add depth effects later.
3. **Export**: File → Export As → `museum.json` (in the same folder, overwriting the old one). **The game loads the `.json`, not the `.tmx` — if you skip this step, your changes won't appear.**

**Export checklist (important):**
- Tilesets must stay **embedded in the map** (they already are — if you add a new tileset, tick "Embed in map" when adding it).
- Map → Map Properties → *Tile Layer Format* must stay **CSV**. Phaser can't read compressed layer data.

## 3. Add a wall or solid object

Paint any tile that has the `collides` property onto the **walls** layer. Done — the game calls `setCollisionByProperty({collides: true})`, so solidity comes from the tile itself.

To make a **new** tile solid: open the tileset (click the wrench icon in the Tilesets panel), select the tile, and in *Custom Properties* add a **bool** property named `collides`, checked. Re-export.

## 4. Add an exhibit

Two halves: a marker on the map, and a content record in `exhibits.json`.

**(a) Place the marker in Tiled:**
1. Select the **exhibits** object layer.
2. Use *Insert Point* (shortcut **I**), click where the display stands (usually right on a pedestal tile you painted on the walls layer).
3. With the new point selected, add a Custom Property: type **string**, name `exhibit`, value = a new id, e.g. `zune`. (The object's *Name* field is just a label for you.)
4. Export to `museum.json` (recipe 2, step 3).

**(b) Add the content — copy one of these templates into the `exhibits` array of `exhibits.json`:**

Text only:
```json
{
  "id": "zune",
  "title": "Microsoft Zune (Brown)",
  "zone": "Software & Digital Culture",
  "type": "text",
  "body": "<p>The beloved brown Zune. HTML works here: <strong>bold</strong>, <em>italics</em>, lists, links.</p>"
}
```

One image + text:
```json
{
  "id": "zune",
  "title": "Microsoft Zune (Brown)",
  "zone": "Software & Digital Culture",
  "type": "image-text",
  "body": "<p>Story goes here.</p>",
  "images": [ { "src": "img/zune.jpg", "caption": "The brown one. Really." } ]
}
```

Multi-image gallery:
```json
{
  "id": "zune",
  "title": "Microsoft Zune (Brown)",
  "zone": "Software & Digital Culture",
  "type": "gallery",
  "body": "<p>Story goes here.</p>",
  "images": [
    { "src": "img/zune-1.jpg", "caption": "Front" },
    { "src": "img/zune-2.jpg", "caption": "Back" }
  ]
}
```

Put image files in `img/`. `zone` is optional but colors the chip in the popup — use one of: `Vintage Hardware`, `Gaming History`, `Cameras & Photography`, `3D Printing & Fabrication`, `Artificial Intelligence`, `Software & Digital Culture` (or add a new zone color in `ui.js` → `zoneColors`).

5. Refresh the browser and walk to the marker. If you typo the id, the game shows a "still being installed" popup and logs a warning in the console naming the bad id — it won't crash.

## 5. Add an audio guide

1. Record narration on your phone (Voice Memos works) or computer, export/convert to **MP3**.
2. Name it after the exhibit id and drop it in `audio/`: e.g. `audio/zune.mp3`.
3. That's it — no JSON or code edit. **F** near the display (or the ▶ button in the popup) plays it. Exhibits without a file show a polite "coming soon" toast.

(If you want a different filename, add `"audio": "audio/whatever.mp3"` to the exhibit record — that overrides the convention.)

## 6. Add an animated sprite (decor with animation)

1. Make a horizontal spritesheet PNG — all frames side by side, same size — and put it in `assets/sprites/`, e.g. `fountain.png` with four 16×16 frames.
2. Register it in `assets/sprites/sprites.json`:
   ```json
   {
     "key": "fountain",
     "file": "assets/sprites/fountain.png",
     "frameWidth": 16,
     "frameHeight": 16,
     "anims": [ { "key": "flow", "frames": [0, 1, 2, 3], "frameRate": 6, "repeat": -1 } ]
   }
   ```
3. In Tiled, on the **exhibits** object layer, insert a Point where it should appear and give it a string property `sprite` = `fountain`. Export.

The game loads every manifest entry automatically and plays its first animation. The **player character itself** is the `player` entry in the same manifest — replace `assets/sprites/player.png` (4 columns × 4 rows: down, left, right, up) to reskin the hero.

## 7. Swap in professional art (recommended upgrade)

The current tiles/character are generated placeholder art. These free **CC0** packs are drop-in quality upgrades (couldn't be bundled from this environment, but you can download them freely):

- **ArMM1998 "Zelda-like tilesets and sprites"** — https://opengameart.org/content/zelda-like-tilesets-and-sprites — 16×16 interior/overworld tiles **and** a 4-direction animated character.
- **Kenney "Roguelike/RPG pack"** — https://kenney.nl/assets/roguelike-rpg-pack — ~1,700 16×16 tiles of furniture and props.
- **Kenney "Input Prompts"** — https://kenney.nl/assets/input-prompts — key/button icons if you want graphical E/F prompts.

How to swap tilesets: in Tiled, Map → *Replace Tileset* (or add the new image as a second embedded tileset and repaint at your leisure). Keep tile size 16×16. Re-mark solid tiles with `collides` (recipe 3), re-export, and update `assets/CREDITS.md`.

## 8. Troubleshooting

**Black screen?** Open the browser console (F12). The three usual causes:
1. **Tileset not embedded** — the exported JSON references a `.tsx` file. Fix: in Tiled select the tileset tab → Tileset menu → *Embed in Map*, re-export.
2. **Forgot to re-export** — you edited `museum.tmx` but the game loads `museum.json`. File → Export As again.
3. **Compressed layer data** — Map Properties → Tile Layer Format must be **CSV**.

**Exhibit popup says "still being installed"** — the marker's `exhibit` property doesn't match any `id` in `exhibits.json`. The console warning names the offending id.

**Changes not showing?** Hard-refresh (Cmd/Ctrl+Shift+R). Locally, use `serve_nocache.py`, not another server.

**JSON won't load after editing `exhibits.json`?** You probably have a trailing comma or unquoted text — paste the file into https://jsonlint.com to find the line.

**Testing on your phone** before deploying: run the local server, find your computer's LAN IP, and open `http://<that-ip>:5501/tools/museumgame/` on the phone (same Wi-Fi). This is the real test for the touch controls and audio.
