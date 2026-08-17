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
a popup **beside that part**, not in a fixed corner, with the link into its
topic as the first thing in the panel and the first tab stop. Both of those
exist to keep the mouse near where it already was. `placePanel` in
`js/views/tip.js` puts it on whichever side has room and centres it on the
part, falling back to the middle when neither side fits. If a part is removable
it then disappears, so the case empties out as the student works through it. A faint tray in the corner puts parts back. The
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

Everything is on one page. Explorations open as a panel with open margins over
a blurred machine, and close back to it. There are no secondary HTML documents
and no links off the page except the one back to `/tools`.

Three ways out of an exploration: Escape, the link in its header, and clicking
the margin around the panel. The blur is deliberately light so the machine
stays readable behind it, since seeing what you would return to is what says
the margin is live. Escape resolves innermost first: an open screenshot, then a
pinned chart readout, then the exploration.

```
tools/pcparts/
  index.html              the whole site
  js/circuit.js           generated trace backdrop
  assets/pc.svg           layered diagram, generated from assets/source/
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

## The backdrop

`js/circuit.js` generates the circuit traces behind the machine: horizontal,
vertical and 45 degree runs only, turning an eighth at a time and ending in a
via, from a fixed seed so the layout is the same on every visit. Each trace
carries `pathLength="100"`, so the travelling dash is written in percentages
and no path has to be measured.

Every click on the machine advances the colour one step through a loop of
twelve hues, blue through green, yellow, orange, red and back round. The
change is a fade, not a snap: the strokes read their colour from custom
properties through `var()`, so changing a property re-computes `stroke` and
the declared 1.4s transition interpolates. This needs no `@property`
registration and works everywhere.

The layer is behind the machine, ignores the pointer, and pauses its
animations while an exploration is over the top.

**Density and animation are separate settings, and only one of them costs.**
`TRACES` is how many are drawn; `PULSING` is how many carry a travelling dash.
Animating `stroke-dashoffset` cannot be handed to the compositor, so each
animated path repaints its bounds every frame over a large area, while static
traces are painted once and are then free.

Measured on a 120 Hz display at devicePixelRatio 2. An early version drew 30
traces with 60 animations and showed a 95th percentile frame time of 16.6 ms
against an 8.3 ms budget, with a worst frame of 25 ms: visible stutter. At 26
traces and 10 animations the frame times are identical whether the animation
runs or is paused, with no frames over 10 ms. Raise `PULSING` only with a
measurement to hand.

## The diagram

`assets/pc.svg` is **generated** from Paul's drawing at
`assets/source/mobo.svg` by `assets/source/rebuild-pc-svg.py`. Edit the
drawing and re-run the script; do not hand edit `pc.svg`. The script is an
authoring helper, not a build step, and the site ships the generated file.

Affinity dropped every layer name on export, so the drawing arrives as fifteen
anonymous top level elements and the script maps them by position. If the
drawing is re-exported with layers added, removed or reordered, check the
`LAYERS` list against a numbered render before running it.

The board is micro ATX and roughly square, which fits a widescreen display
better than a tall ATX tower would.

| Layer id | Contents |
|---|---|
| `case-shell` | outline round everything, drawn by the script |
| `mobo-bare` | board and chipset heatsink only |
| `part-*` | one group per component, removable or not |
| `case-glass` | side panel, must be the last element before the hit layer |
| `hit` | one shape per part, id `hit-<part>`; `rect` or `path` |

Pointing at anything names it. The readout shows the label and the spec, plus a
`hint` sentence where a part has one. The small board features (SATA, power
connectors, network, expansion slots) carry hints because a hover is the only
place they say anything; the larger parts say the rest in the popup when
clicked. Placement reuses `js/views/tip.js`, the same helper the charts use.

Not every part comes out. `removable` in `data/machine.json` decides. The
processor, memory, storage, expansion slots and rear ports stay put: they
highlight and open their topic but do not disappear, because there is no empty
socket artwork underneath them to reveal. Only the side panel, cooler, graphics
card, power supply and fans are removable, and each of those does reveal
something real: the cooler uncovers the processor, and the graphics card
uncovers both the expansion slots and the SATA ports, which the card almost
completely hides in this drawing.

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

Four modules in `js/views/`, all driven entirely by the topic JSON so a new
instance needs no new code.

- `storage-test` races a file copy across two drives at their real measured
  speeds, with a seek penalty for anything with an arm to move. Real time is
  compressed so the slowest run takes about twelve seconds, and the
  compression ratio is stated on screen.
- `demand-chart` plots any number of series on a shared log scale, used in
  four topics. A log axis is not decoration here; the values span seven
  orders of magnitude and a linear axis would show a flat line and a spike.
- `die-view` has two modes. `area` draws the die at its real area beside a
  coin, and clicking pins an outline to compare against. `transistors` holds
  the square at a constant size and puts one dot per transistor in it, which
  stops being possible at the 80286 in 1982; from there the readout says how
  many transistors each dot stands for. Running out of pixels is the point,
  so do not rescale to hide it.
- `floorplan` switches between schematic die layouts. Blocks are hand placed
  on a 100 x 100 grid and are **not** traced from die photographs, which the
  caption says on the page.

Readout boxes are placed by `js/views/tip.js`, shared by the chart and the
floorplan. It keeps the box inside the tool: above the point by default,
flipped below when there is no room, and opening sideways into the plot when
centring would run past an edge. The box must live in `.tool` rather than in
`.chart-wrap`, because that wrapper has `overflow-x: auto` and a scroll
container clips vertically as well.

Nothing carries usage instructions. A slider looks like a slider, blocks
respond to hover, and pinning is found by clicking.

## Data

Entry counts by topic:

| Topic | Entries |
|---|---|
| Processors | 57 |
| Graphics | 49 |
| Motherboard | 37 |
| Storage | 43 |
| Memory | 27 |
| Sound | 25 |
| Software demand | 32 |
| Power and heat | 29 |
| Dead end cards | 26 |

325 entries in total, every one carrying a Wikipedia link, and about 23,750 words.

All nine topics have had a second pass adding the cautionary tales: failed
bets, recalls, lawsuits and the reasons companies disappeared.

Entries run in year order within a topic. `software` is the exception and
restarts its timeline for each themed section, which is deliberate; each of its
sections is internally ordered.

Wikipedia links: check the redirect target, not just that the page exists. Two
links passed a not-missing check while landing on a disambiguation page and on
an unrelated console article.

Specs are drafted and need review by hand. Generic parts are acceptable where
a specific model adds nothing, which is most of memory and much of storage.
Sources get added in a later pass alongside images.

## Writing

Upper middle and high school. Correct terminology, defined where it first
appears. No labels on self evident controls. Full thoughts rather than
one clause facts.

## Screenshots

A `shot` on an entry has three fields:

| Field | Use |
|---|---|
| `src` | filename in `assets/shots/`. Absent means the slot is still empty |
| `slot` | what the picture will show, seen in the placeholder |
| `caption` | the real caption, seen under the preview once `src` exists |
| `note` | a reminder about how to capture it. **Never rendered** |

With a `src` the image shows as a small preview that opens full size when
clicked, closed by Escape, the close button or clicking away. Without one the
slot renders a dashed box reading "I haven't taken a screenshot for this game
yet" plus the `slot` line, so the page is complete either way.

The preview is sized by a fixed height and the full size view by viewport
units rather than a percentage of the parent. The lightbox centres its figure
with `place-items: center`, so the figure shrinks to fit the image and a
percentage width there would be measured against a width that depends on the
image itself. Viewport units also cap it against the window, which is what
matters in that view.

## Known gaps

- Images are placeholders. Eleven slots are marked in the graphics topic.
- Specs are drafted and need review. Sources come in a later pass.
- A tower drawn side on is roughly square, and a monitor is not, so the diagram
  letterboxes on a widescreen display. Either the drawing gets a wider scene or
  the empty margin stays as backdrop.
