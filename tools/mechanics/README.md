# Game Mechanics Catalog

`edu.contrapaul.com/tools/mechanics/`

A browsable catalogue of tabletop game mechanics for the Grade 9 Tabletop Game
Design unit. Doubles as a cheat sheet and a research starting point.

## Files

| File | What it is |
|---|---|
| `index.html` | Page shell. No content lives here. |
| `mechanics.css` | All styling, including the ten family looks. |
| `data.js` | **The content.** Add and edit mechanics here. |
| `mechanics.js` | Grid, filters, detail window. |
| `diagrams.js` | Inline SVG diagrams, keyed by name. |
| `media/` | Images and videos you add later. |

No build step. Cloudflare Pages serves these files directly. Every font is
self-hosted from this repo, so the page makes no external requests and cannot
be blocked from rendering.

## Adding a mechanic

Add one object to the `MECHANICS` array in `data.js`:

```js
{
  slug: "unique-lowercase-hyphenated",
  name: "What it is called",
  family: "turn",              // a key from FAMILIES
  alsoCalled: ["Other name"],  // [] if none
  blurb: "Max 14 words. This is all that fits on the card.",
  complexity: "Simple",        // must be a value in FILTERS.complexity
  components: ["Dice"],        // values from FILTERS.components
  playerFit: ["Works at 2"],   // values from FILTERS.playerFit
  origin: "tabletop",          // or "video game", which adds a badge
  whatItIs: ["Paragraph.", "Paragraph."],
  howItWorks: ["Step.", "Step."],
  games: [{ title: "Game", note: "How that game uses it." }],
  watchOut: ["A way this goes wrong."],
  tryThis: "A design task the student can actually do this week.",
  links: [{ label: "...", url: "...", kind: "Rules", vpn: false }],
  media: { image: null, imageNeed: "...", video: null, videoNeed: "...", diagram: null }
}
```

**Writing rules.** Grade 9, many students still learning English. Sentences of
15 words or fewer. Common words over precise ones. Gloss any game jargon the
first time it appears. No idioms.

**`vpn: true`** puts a small pink VPN marker on the link, warning that the site
may not load without one. Use it for Wikipedia, YouTube, and anything else
blocked in mainland China.

**`kind`** is the label on the left of the link. Currently used: Rules, Wiki,
Article, Tool. Any short word works.

## Filling a media slot

An empty slot shows a dashed placeholder describing what should go there, taken
from `imageNeed` / `videoNeed`. To fill it:

```js
image: { src: "media/kill-team-round.jpg", alt: "Two players reaching across a board", caption: "One round of alternating activation." }
video: { src: "https://player.bilibili.com/player.html?bvid=...", caption: "..." }
```

Set `videoNeed: "Not needed."` to hide a slot entirely rather than show a
placeholder for something you have decided against.

## Adding a diagram

Add a key to `DIAGRAMS` in `diagrams.js` returning an SVG string, then name that
key in a mechanic's `media.diagram`. Use the `dg-` CSS classes so the diagram
picks up the family colour and works on the dark background.

Each diagram is drawn twice. Full size and in colour inside the detail window,
and again small, wordless, and in one colour on the card itself, where it fills
the upper half. Anything using the `dg-t`, `dg-s`, `dg-k`, or `dg-on` text
classes is hidden on the card, so **put every label in one of those classes**.
What is left should still read as a recognisable shape at about 200 pixels
wide. Colour comes from the `--fam-color` and `--dg-alt` variables, never from
a hard-coded hex value, or the card version will not go monochrome.

## Families

Ten of them, seven mechanics each, 70 in total. Defined at the top of `data.js`.

| Family | Card style | Covers |
|---|---|---|
| Turn Order and Sequence | split-flap board | Who acts, and when |
| Movement and Space | graph paper | Where pieces go and how far |
| Chance and Randomness | risograph | Dice, draws, and probability |
| Cards and Decks | card fan | Hands, decks, and building them |
| Resources and Economy | letterpress | Getting, spending, and trading |
| Conflict and Combat | ember tablet | Attacking, defending, damage |
| Hidden Information | frosted glass | Secrets, bluffing, fog of war |
| Fairness and Catch-Up | brushed chrome | Keeping a losing player in the game |
| Progress and Growth | topographic | Levelling, upgrading, unlocking |
| Goals and Scoring | marquee bulbs | How you win, and how you count |

Each family pairs a card style from `tools/cards.html` with an accent colour, so
related mechanics look related before anyone touches the filter. Changing a
family's `color` updates its filter chip, its detail-window accent, and its
diagram colour together.
