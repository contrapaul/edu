# Electronics Parts Catalog: build plan

Location: `tools/electronics/`
Audience: Grade 10 MYP Design students on the Electronics Design unit.
Returns to `curriculum/myp/g10-electronics-design.html` from the header button.

Doubles as a shelf reference (skim the grid, find the part you are holding) and a
wiring reference (open a card, read the pins and the steps).

---

## What this is not

The game mechanics catalogue aimed at completeness. This one does not. Version 1
covers the parts already referenced in `tools/macropad/components.js`, plus the
accessories a student needs to actually build with them: passives, breadboard,
jumpers, power, and the few workshop tools that come up every lesson. Mr. K
supplies the list of additions after reviewing this version.

## Built around photographs, not drawings

No custom vector art in this version. Every card carries a photo slot and every
detail panel carries a second slot for a close wiring shot. Until a photo lands,
the slot renders a labelled placeholder saying what it should show, so the page
is presentable while empty. `media-tasks.md` is the shoot list. `graphics.md` is
the separate list of diagrams that would earn their place later.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Page shell. Header, filter bar, grid container, detail panel. No content in markup. |
| `electronics.css` | All styling. Self-contained, does not import `/style.css`. |
| `data.js` | `const PARTS = [...]`, `const CATEGORIES = {...}`, `const FILTERS = {...}`. Plain script tag, works from `file://`. |
| `electronics.js` | Grid, filters, detail panel, keyboard handling, deep links. |
| `media/` | Photographs, dropped in later. |
| `README.md` | How to add a part, how to fill a photo slot. |
| `media-tasks.md` | The shoot and source list. |
| `graphics.md` | Proposed diagrams and graphics, for a later pass. |

Same pattern as `tools/mechanics/`: standalone sub-site, own CSS, data separate
from logic, no build step. Cloudflare Pages serves the files directly.

## Fonts

Self-hosted from this repo, so nothing external can block the page.

- **Bespoke Slab**: card titles and headings.
- **Lexend**: body copy.
- **JetBrains Mono**: chips, pin labels, tags, part numbers.

## Layout

- Grid: `repeat(auto-fill, minmax(220px, 1fr))` in a 1240px container.
- Card: photo panel on top at 4 / 3, then category label, name, blurb below.
  Photo-forward, because for a parts catalogue the picture is the identifier. A
  student holding a black rectangle with pins on it needs to match it by sight.
- The empty photo state is a hatched panel carrying the part name in mono, so a
  card without a photo still reads at a glance and looks deliberate.

## Filter bar (sticky)

1. **Search**: matches name, other names, part numbers, blurb.
2. **Category**: nine chips, each in its own colour.
3. **Signal type**: Digital in, Analog in, Digital out, PWM, I2C, SPI, Power, No signal.
4. **How hard to wire**: Easy, Moderate, Tricky.

Plus "Clear all" and a live count.

## Detail panel

Full-screen over a dimmed backdrop. Escape, backdrop, and close button all close
it. Focus trapped while open, returned to the card on close. Prev and next move
through the current filtered set. Sections, in the same order every time:

1. Category, name, other names, meta tags (signal, voltage, difficulty)
2. **What it is**
3. **Pins and connections**: a table of every pin with what it does
4. **Wiring it up**: numbered steps
5. **See it**: photo slot, wiring close-up slot
6. **Watch out for**
7. **Goes with**: clickable chips jumping to related parts
8. **Use it for**: a design prompt tied to the unit
9. **Find out more**: links, tagged by kind, VPN marked where relevant

## Categories

| Key | Category | Covers |
|---|---|---|
| `boards` | Microcontroller Boards | The brain of the build |
| `displays` | Displays | Showing something back to the user |
| `controls` | Controls and Inputs | What the user pushes, turns, or slides |
| `sensors` | Sensors | What the build measures about the world |
| `outputs` | Outputs and Actuators | Light, sound, and movement |
| `passives` | Passive Components | Resistors, capacitors, diodes, transistors |
| `proto` | Prototyping and Connection | Breadboard, jumpers, headers, cable |
| `power` | Power | Getting the volts in |
| `tools` | Workshop Tools | What sits on the bench |

Sensors is seeded thin on purpose. It holds the six that a school kit almost
always has, and waits for the real list.

## Writing rules

- Grade 10, several students still learning English. Sentences of 18 words or
  fewer wherever possible.
- Gloss every piece of jargon the first time it appears. Pull-up, floating,
  debounce, decoupling, and ADC all get a plain sentence.
- Every part answers the same questions in the same order, so the shape is
  learned once.
- No em dashes anywhere in this project.

## Order of work

1. Shell, CSS, grid, filter bar, detail panel.
2. Write all nine categories to their version 1 count.
3. Produce `media-tasks.md`, `graphics.md`, `README.md`.
4. Hand over for the additions list.
