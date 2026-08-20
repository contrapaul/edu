# Game Mechanics Catalog: build plan

Location: `tools/mechanics/`
Audience: Grade 9 MYP Design students building tabletop games, many of them EAL.
Doubles as a cheat sheet (skim the grid) and a research tool (open a card, follow links).

---

## Phase 1: Construction

### Files

| File | Purpose |
|---|---|
| `index.html` | Page shell: header, filter bar, grid container, modal container. No content in markup. |
| `mechanics.css` | All styling. Self-contained, does not import `style.css`. |
| `data.js` | `const MECHANICS = [...]` plus `const FAMILIES = {...}`. Plain script tag, no fetch, so it works from `file://` too. |
| `mechanics.js` | Render grid, filter, open/close modal, keyboard handling. |
| `diagrams.js` | Inline SVG diagram builders, keyed by id, called from the modal renderer. |
| `media/` | Images and video posters you drop in later. |
| `README.md` | How to add a mechanic, how to fill a media slot. |
| `tasks.md` | Phase 3 deliverable: the media sourcing list. |

Matches the `tools/greatgames/` pattern: standalone sub-site, own CSS, data file separate from logic, no build step.

### Fonts (all self-hosted, nothing external)

- **Bespoke Slab**: card titles and headings. Already at `/Fonts/`.
- **Lexend**: body copy. Designed for reading proficiency, the right call for EAL readers.
- **JetBrains Mono**: filter chips, tags, labels.
- **IBM VGA**: used sparingly, only on the badge marking mechanics that came from video games.

### Layout

- Grid: `repeat(auto-fill, minmax(230px, 1fr))` inside a `max-width: 1200px` container, which lands on 4 across at desktop and steps down to 3, 2, 1 on its own.
- Cards: `aspect-ratio: 1 / 1`.
- Square card composition: family texture and the family mark occupy the upper area, title and blurb sit pinned to the bottom on a legibility scrim. This stops the empty-middle problem that square text cards usually have. If a mechanic name plus blurb overflows at the 2-column breakpoint, the blurb clamps to 3 lines.
- **Flag:** square is good for scanning and for the family look, but it caps the blurb at roughly 14 words. If that turns out too tight once real copy is in, the fallback is `4 / 3`. I will build square, load real content, and show you both before settling.

### Header / footer

- Header: "Game Mechanics Catalog", a one-line description of what the page is for, and a link back to the [Tabletop Game Design unit](/curriculum/myp/g9-game-design.html).
- Footer: "A project by Mr. K, more at edu.contrapaul.com/tools", linked.

### Filter bar (sticky under the header)

Five controls, all combinable, all reflected in a live result count:

1. **Search**: matches name, other names for the same thing, blurb, and game examples.
2. **Family**: the 10 groups below. Chips carry each family's own colour, so the filter teaches the visual language.
3. **What you need**: dice, cards, board or grid, tokens, timer, paper and pencil, nothing.
4. **How hard to build**: simple, medium, complex.
5. **Player count**: works at 2, works at 3 to 4, works at 5 or more.

Plus a "Clear all" and a "Surprise me" that opens one card at random, which is genuinely useful when a group is stuck.

### Modal

Full-screen panel over a dimmed backdrop. Closes on Escape, backdrop click, and the close button. Focus is trapped while open and returns to the originating card on close. Body scroll locks. Layout inside:

1. Family tag and title
2. **What it is**: two or three short paragraphs
3. **How it works in play**: a numbered sequence
4. Media zone: image slot, video slot, diagram slot
5. **Games that use it**: each with one line on how that game uses it
6. **Watch out for**: one or two failure modes
7. **Try this in your game**: a design prompt
8. **Find out more**: links, each tagged by kind (rules, wiki, video, article) and marked if it may need a VPN

Prev / next arrows move between cards inside the current filter, so a filtered set reads like a chapter.

### Verify before moving to Phase 2

- Grid is 4 / 3 / 2 / 1 across at 1440, 1100, 820, 500 px.
- Cards stay square with real 14-word blurbs, no clipped text.
- Modal opens, traps focus, closes three ways, restores focus.
- Two filters plus a search term combine correctly, count is right, empty state reads properly.
- Console clean, no external network requests at all.

---

## Phase 2: The mechanics

Target 60 to 70 mechanics across 10 families, six or seven per family.

### Families and their card styling

Each family takes one style from `tools/cards.html` plus its own accent colour, so related mechanics look related before anyone touches the filter.

| Family | Card style | Idea |
|---|---|---|
| Turn Order and Sequence | `cs-flap` split-flap board | Who acts, and when |
| Movement and Space | `cs-graph` graph paper | Where pieces go and how far |
| Chance and Randomness | `cs-riso` risograph | Dice, draws, and probability |
| Cards and Decks | `cs-fan` card fan | Hands, decks, and building them |
| Resources and Economy | `cs-press` letterpress | Getting, spending, and trading |
| Conflict and Combat | `cs-ember` ember tablet | Attacking, defending, damage |
| Hidden Information | `cs-frost` frosted glass | Secrets, bluffing, fog of war |
| Fairness and Catch-Up | `cs-chrome` brushed chrome | Keeping a losing player in the game |
| Progress and Growth | `cs-topo` topographic | Levelling, upgrading, unlocking |
| Goals and Scoring | `cs-marquee` marquee bulbs | How you win, how you count |

### Data shape per mechanic

```js
{
  slug, name, family, alsoCalled: [],
  blurb,                       // max 14 words, plain English
  complexity, components: [], playerFit: [], origin,  // "tabletop" | "video game"
  whatItIs: [],                // 2-3 short paragraphs
  howItWorks: [],              // numbered steps
  games: [{ title, note }],
  watchOut: [],
  tryThis,
  links: [{ label, url, kind, vpn }],
  media: { image: null, video: null, diagram: null }
}
```

### Writing rules

- Sentences of 15 words or fewer wherever possible.
- Common words over precise ones. Any game jargon gets a plain gloss the first time it appears.
- No idioms, no phrasal verbs where a plain verb exists.
- Every mechanic answers the same question in the same order, so students learn the page's shape once.
- Every mechanic names at least two real games, and at least one that students in this room have plausibly played.

### Sample of what goes in

Your three examples anchor three different families:

- **You Go, I Go** (Kill Team) → Turn Order, alongside simultaneous action selection, action points, initiative bidding, variable turn order.
- **Movement patterns** (Chess) → Movement and Space, alongside grid vs hex, area movement, line of sight, zone of control, push and pull.
- **The Coin** (Hearthstone) → Fairness and Catch-Up, alongside rubber-banding from Mario Kart, first-player compensation, handicap systems, bidding for turn order.

Video game mechanics that carry over cleanly get included and marked: cooldowns, fog of war, aggro, respawn timers, tech trees, roguelike runs, combo meters.

### Diagrams I will draw

Inline SVG, theme-aware, no external files, for the mechanics where a picture does the teaching: turn order patterns, chess movement, grid vs hex, line of sight, area control scoring, deck cycle, action point spending, tech tree shape. Roughly 12 to 15 of these. Everything else gets a slot and lands on your task list instead.

---

## Phase 3: Your media task list

`tasks.md`, sorted so you can knock out a whole shoot or a whole search in one sitting. Each row carries: mechanic, family, game it comes from, what the media should show, format (photo / video / diagram / scan), whether you can produce it from your own shelf or need to source it, and a difficulty flag. Grouped into:

1. **Photograph from your own collection**: physical components on a table, the cheapest wins.
2. **Screen capture**: short clips from games you own.
3. **Source online**: where a publisher image or an existing video is the only realistic option, with a licensing note.
4. **Already covered**: diagrams I generated, listed so you know not to duplicate work.

---

## Order of work

1. Shell, CSS, grid, filter, modal, with 6 mechanics across 3 families → verify the checks above.
2. Show you the square card with real copy, confirm or switch aspect ratio.
3. Write all 10 families to full count.
4. Draw the diagrams.
5. Produce `tasks.md` and `README.md`.
