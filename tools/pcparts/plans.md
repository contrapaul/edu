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

Everything is on one page. Explorations open as a full overlay over the
machine and close back to it. There are no secondary HTML documents and no
links off the page except the one back to `/tools`.

```
tools/pcparts/
  index.html              the whole site
  assets/pc.svg           layered diagram, placeholder art
  data/machine.json       parts, occlusion rules, popup copy
  data/topics/*.json      the nine explorations
  js/machine.js           the machine
  js/explore.js           overlay shell and block renderer
  js/views/*.js           interactives
  css/                    pcparts, machine, explore, tools
```

A topic file is a flat list of blocks, so the writing controls the pacing
rather than a fixed template:

| Block | Renders |
|---|---|
| `era` | a heading with a paragraph of context. Omit `years` when there is no real date range; do not invent a filler label |
| `entry` | one piece of hardware: year, spec line, note, optional `url`, optional image |
| `interactive` | mounts a module from `js/views/` |
| `link` | a pointer into another topic |

An entry's `url` turns its name into an outward link. **English Wikipedia only.**
Every URL has been checked against the Wikipedia API; re-run that check after
adding any. Redirects are fine, missing pages are not.

Because content is data and rendering is a module, any topic could be mounted
in a standalone page later without rewriting a word of it.

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

Two modules in `js/views/`, both driven entirely by the topic JSON so a new
instance needs no new code.

- `storage-test` races a file copy across two drives at their real measured
  speeds, with a seek penalty for anything with an arm to move. Real time is
  compressed so the slowest run takes about twelve seconds, and the
  compression ratio is stated on screen.
- `demand-chart` plots any number of series on a shared log scale, used in
  four topics. A log axis is not decoration here; the values span seven
  orders of magnitude and a linear axis would show a flat line and a spike.

## Data

218 entries across nine topics.

| Topic | Entries |
|---|---|
| Processors | 57 |
| Graphics | 36 |
| Motherboard | 23 |
| Storage | 23 |
| Memory | 18 |
| Sound | 18 |
| Software demand | 18 |
| Power and heat | 16 |
| Dead end cards | 13 |

222 entries in total, 211 of them carrying a Wikipedia link.

Specs are drafted and need review by hand. Generic parts are acceptable where
a specific model adds nothing, which is most of memory and much of storage.
Sources get added in a later pass alongside images.

## Writing

Upper middle and high school. Correct terminology, defined where it first
appears. No labels on self evident controls. Full thoughts rather than
one clause facts.

## Known gaps

- Images are placeholders. Eleven slots are marked in the graphics topic and
  render as a labelled dashed box until a file is dropped into
  `assets/shots/` and named in the topic JSON.
- Specs are drafted and need review. Sources come in a later pass.
- A tower drawn side on is roughly square, and a monitor is not, so the diagram
  letterboxes on a widescreen display. Either the drawing gets a wider scene or
  the empty margin stays as backdrop.
