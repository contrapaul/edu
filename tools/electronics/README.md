# Electronics Parts Catalog

`edu.contrapaul.com/tools/electronics/`

A browsable catalogue of the microcontrollers, sensors, inputs and accessories
in the room, for the Grade 10 Electronics Design unit. Doubles as a shelf
reference and a wiring reference.

## Files

| File | What it is |
|---|---|
| `index.html` | Page shell. No content lives here. |
| `electronics.css` | All styling. |
| `data.js` | **The content.** Add and edit parts here. |
| `electronics.js` | Grid, filters, detail panel. |
| `media/` | Photographs you add later. |
| `plan.md` | Why the page is built the way it is. |
| `media-tasks.md` | The shoot list, generated from `data.js`. |
| `graphics.md` | Proposed diagrams, for a later pass. |

No build step. Cloudflare Pages serves these files directly. Every font is
self-hosted from this repo, so the page makes no external requests and cannot
be blocked from rendering.

## Adding a part

Add one object to the `PARTS` array in `data.js`:

```js
{
  slug: "unique-lowercase-hyphenated",
  name: "What it is called",
  shortName: "Short name",     // shown on the empty photo placeholder
  category: "sensors",         // a key from CATEGORIES
  alsoCalled: ["Other name"],  // [] if none
  blurb: "Max 14 words. This is all that fits on the card.",
  signal: ["Analog in"],       // values from FILTERS.signal
  difficulty: "Easy",          // a value from FILTERS.difficulty
  voltage: "3.3V or 5V",       // free text, shown as a tag
  whatItIs: ["Paragraph.", "Paragraph."],
  pins: [{ name: "VCC", type: "Power", note: "What it does." }],
  wiring: ["Step.", "Step."],
  goesWith: ["resistor", "breadboard"],   // slugs of other parts
  watchOut: ["A way this goes wrong."],
  useItFor: "What a student would actually build with it.",
  links: [{ label: "...", url: "...", kind: "Guide", vpn: false }],
  media: {
    image: null,  imageNeed:  "What the card photo should show.",
    detail: null, detailNeed: "What the close-up should show."
  }
}
```

Order in the array is the order on the page. Keep parts grouped by category so
the arrows in the detail panel walk through related things.

**Writing rules.** Grade 10, several students still learning English. Sentences
of 18 words or fewer. Gloss every piece of jargon the first time it appears:
pull-up, floating, debounce, decoupling, ADC. No em dashes anywhere in this
project.

**`vpn: true`** puts a small pink VPN marker on a link, warning that the site
may not load without one. Use it for Wikipedia, YouTube, and anything else
blocked in mainland China.

**`kind`** is the label on the left of the link. Currently used: Guide,
Datasheet, Docs, Library, Tool, Wiki. Any short word works.

## Filling a photo slot

An empty card photo draws a hatched panel carrying the part's `shortName`. An
empty detail slot draws a placeholder describing what should go there, taken
from `detailNeed`. To fill either:

```js
image:  { src: "media/resistor.jpg", alt: "A row of resistors on white paper", caption: "Optional caption." },
detail: { src: "media/resistor-detail.jpg", alt: "One resistor, bands labelled", caption: "Optional caption." }
```

Set `detailNeed: "Not needed."` to hide a slot entirely rather than show a
placeholder for something you have decided against. `media-tasks.md` lists every
outstanding shot, grouped by category.

Card photos are cropped to 4 by 3 and cover the frame, so leave a little room
around the part rather than filling the shot edge to edge.

## Categories

Nine of them, defined at the top of `data.js`. Each has a colour that drives its
filter chip, the spine down the left edge of its cards, and the accent inside
the detail panel. Changing one `color` value updates all three together.

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

## How the parts cross reference

`goesWith` holds slugs of other parts. Each becomes a clickable chip in the
detail panel that jumps straight to that part, clearing the filters first if the
target is currently filtered out. A slug that does not exist is skipped rather
than breaking the page, so it is safe to write the link before writing the part.

## Deep links

Every part has a URL: `.../tools/electronics/#resistor`. Opening one goes
straight to that detail panel, which is useful for linking a specific part from
the unit page or from a task sheet.
