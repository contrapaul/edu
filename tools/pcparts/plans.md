# Inside a Desktop PC: plan

Replaces the earlier Three.js plan. That version built a fictional PC out of
geometric primitives, hid the interesting content behind three clicks, and
needed a bundler the rest of this repo does not use. The 3D case has been
dropped entirely. There is no build step.

## What this teaches

Change over time. A student should be able to look at any component and answer
"what actually got better between 2005 and 2015, and what did that mean in
practice". Everything on the site serves that question.

## Structure

One modern desktop is the entry point, filling the page. Clicking a part opens
a popup over the machine with a short description and a link into that
component's own page, and the part then disappears, so the case empties out as
the student works through it. A faint tray in the corner puts parts back. The
stripped down state is saved to `localStorage` under `pcparts-removed`, so a
student returning after a lesson picks up where they left off.

Components are reached by clicking them. There is no secondary list of links on
the front page.

Desktop browsers are the target. Phone layout is not a priority.

## Styling

Self contained. These pages do not load `/style.css`, `/curriculum/themes.css`
or the site theme script, and they do not use the site header or footer. The
only chrome is a link back to `/tools`. Tokens live in `css/pcparts.css`, and
the font is copied into `assets/` rather than referenced from the site root, so
nothing outside this directory is a dependency.

Nothing in this directory should be lifted into the shared stylesheet, and
shared site files must not be edited to serve this tool.

```
tools/pcparts/
  index.html          the machine
  cpu/                processors, 1971 to now
  gpu/                graphics
  memory/             RAM
  storage/            drives, plus the speed tester
  motherboard/        sockets, buses, slots
  sound/              audio, from one beep to onboard codecs
  expansion/          cards that existed for a few years and stopped
  power/              power draw and heat
  software/           where the extra speed went
  assets/  css/  data/  js/
```

## The diagram

`assets/pc.svg` is placeholder art, to be replaced by a hand-drawn version.
The replacement must keep the layer contract:

| Layer id | Contents |
|---|---|
| `case-shell` | case body, front bezel, rear panel |
| `mobo-bare` | board with **empty** socket, DIMM, PCIe and M.2 slots |
| `part-*` | one group per removable component |
| `case-glass` | side panel, must be the last element in the file |
| `hit` | one simple shape per part, id `hit-<part>` |

Rules that the export has to satisfy:

- ids must survive. Minifying presets strip layer names and produce a picture
  with no handles in it.
- names must be unique, lowercase, hyphenated. Spaces and duplicates get
  silently rewritten.
- no live effects. Blur, glow and gradient mesh cannot be expressed in SVG, so
  the exporter rasterises those objects into embedded PNGs. That inflates the
  file and makes the layer impossible to recolour.
- stacking order carries the occlusion logic. `part-storage` must come before
  `part-gpu`, and `part-cpu` before `part-cooler`, so that a part drawn on top
  genuinely covers what is under it.

Occlusion is declared in `data/machine.json` as `blockedBy`, and the code
refuses clicks, keyboard focus and restore while a blocker is present.

## Interactives

One per component page, built independently, shipped as they are finished.

1. Storage speed tester. Port of the existing simulator.
2. Graphics walkthrough. A representative image every year or two with the
   technique named. Screenshots to be captured first-hand.
3. Software demand against hardware capability. Boot times, install sizes,
   memory footprints plotted against the hardware of the same year.
4. Memory: what a given capacity actually held at the time.
5. Sound and the expansion dead ends: what the card did, and what absorbed it.

## Data

`data/hardware-specs.json` holds the existing 87 entries. Target is roughly
180, weighted so no decade is thin:

| Set | Now | Target |
|---|---|---|
| CPU | 25 | 45 |
| GPU | 20 | 40 |
| Storage | 10 | 25 |
| Memory | 9 | 20 |
| Sockets and buses | 23 | 25 |
| Sound | 0 | 15 |
| Expansion dead ends | 0 | 10 |

Specs are drafted, then reviewed by hand. Generic parts are acceptable where a
specific model adds nothing, which is most of memory and much of storage.
Sources get added in a later pass alongside images.

## Writing

Upper middle and high school. Correct terminology, defined where it first
appears. No labels on self evident controls. Full thoughts rather than
one clause facts.

## Known gaps

- `software/` has no physical counterpart in the machine, so nothing on the
  front page links to it. It needs a route in from the component pages, most
  naturally from CPU and memory.
- A tower drawn side on is roughly square, and a monitor is not, so the diagram
  letterboxes on a widescreen display. Either the drawing gets a wider scene or
  the empty margin stays as backdrop.
- `js/components/*.js` and `js/utils/benchmark-simulator.js` are retained from
  the old build as source material. They are not loaded by anything and should
  be removed once their content has been ported.
