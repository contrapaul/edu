# Showcase page: plan

Written 2026-09-18 at Paul's request. The current page one proves the plumbing (player, compare, reveals, themes) and looks basic. This plan is for a sample page that goes the other way: colour, movement, and something to do in every screen. It is built as `ai/sample.html`, kept separate from `index.html` until it earns its place, and it uses page one's content so nothing is thrown away if it does.

The rule for every idea below: the motion has to carry the point. An animation that only decorates gets cut in the polish pass. Every effect has a still version for `prefers-reduced-motion` and for teacher mode on a projector.

## What the page is

Page one, "What AI is now", rebuilt as nine screens. Each screen has its own colour, one main moving thing, and one thing the reader does. A progress rail down the side shows the nine as dots that fill as the reader passes and as activities get done. The page remembers what the reader did (localStorage) and builds a recap at the end from it.

## The nine screens

### 1. Hero: the token rain

The background is a slow rain of small word chips, the actual words of this page, falling and drifting on a canvas. Each chip carries a tiny token number, the way a model sees text. The title does not fade in; it is typed, at the transcript player's pace, with the cursor. As the reader scrolls, the rain speeds up and streaks (parallax on scroll velocity), then thins out as the next screen's colour band slides up over it.

What it says: a model sees your writing as numbered pieces, and it produces writing the same way, one piece at a time.

Reader action: none yet. This screen is the invitation.

Still version: a fixed scatter of chips, the title already typed.

### 2. The stuck belief: a scrubbed timeline

A pinned screen. The reader's scroll drives a timeline from 2001 to 2026. A single large quote card sits in the middle. As the year passes 2005, 2008, 2012 the card reads what teachers said about Wikipedia. As it passes 2023 the same card, same layout, same typeface, reads what teachers said about AI, and the two sentences are so close that the second one only needs three words swapped. The swapped words flip letter by letter. Behind the card, small event markers slide by (Wikipedia launches, the Nature comparison, ChatGPT launches, search arrives in chatbots).

What it says: the argument has the same shape both times.

Reader action: scroll drives it; a "play" button for teacher mode runs it on its own.

Still version: the two quote cards side by side, the swapped words highlighted.

### 3. The same questions: the scorecard race

The compare component as it exists, both players streaming, plus a scorecard pinned beside them on desktop (above them on a phone). The scorecard listens to the player's events. Each time an annotation is reached, a stamp slams down on the matching row: a red INVENTED, an amber CHECK, a green CONFIRMED, with a short shake. Counters tick: sources given, sources real, links that open. When both transcripts finish, the card flips to a summary and the reader is asked one question: which answer would you have trusted more before you saw the stamps?

What it says: the first pass looks like an obvious win for 2026. The stamps say it's more complicated.

Reader action: the question at the end, and the branch choice inside the 2023 transcript.

Still version: the scorecard already filled, the players at "show all".

### 4. The cutoff: the wall and the window

A pinned scene. A horizontal timeline runs across the screen. As the reader scrolls, bricks fly in and stack into a wall at the model's training cutoff date. Question cards ("Who won the 2024 election?", "When was Hadrian's Wall built?", "What's the weather tomorrow?") sit at the bottom. The reader drags one (or taps it) toward the timeline; a card whose answer lies before the wall lands with a soft glow, a card whose answer lies after the wall hits the bricks and bounces back. Then a big switch labelled "search" appears. Flip it and a window opens in the wall with light coming through; the bounced cards now pass through, and each one carries a small "read from the web" tag when it lands. Flip it off and the window closes.

What it says: the cutoff is a wall, search is a window, and the window is not always open.

Reader action: dragging cards, flipping the switch.

Still version: the wall with the window open, cards placed, a caption.

### 5. The next word: the probability race

A sentence types itself and stops at a hidden word. Five candidate chips bounce in. The reader taps one. Bars race out to each candidate's recorded probability, easing, with the numbers counting up. The reader's pick is outlined; the model's top choice pulses. If they match, a small burst of chips. Three sentences in a row, then a streak counter. The last sentence is the invented book title from the 2023 transcript, split at the point where the model committed to a book that doesn't exist, so the reader sees how likely the wrong word was.

What it says: prediction, not lookup, and the wrong answer was a likely one.

Reader action: picking words.

Data: probabilities recorded from a real model. A local model gives token probabilities directly (llama.cpp and LM Studio both expose them), which also keeps the whole page honest about where numbers come from. Stored in `data/next-word.json` with the model named.

Still version: the bars already out, the reader's pick disabled.

### 6. The web the model reads: the re-dated post

A fake browser window, with its own chrome, showing a mock recipe post. Nothing pulses at first; the reader has to look. Hovering (or tapping) anything reveals whether it was a clue: the "Updated 3 days ago" line with no note about what changed, the four affiliate links, the paragraph that says nothing, the comments dated before the "publish" date. Each found clue adds a sticker to the window's edge. Then a slider appears across the window: drag it and the page wipes to the original 2019 version. The only difference is the date line, and it lights up.

What it says: recency can be faked, and the check is cheap.

Reader action: finding clues, dragging the wipe.

Still version: all clues marked, the wipe at 50%.

### 7. Which model: the map

A short screen between the heavy ones. A world map (SVG, hand drawn, not a photo) with model names placed where their companies are: Hangzhou, Beijing, Shenzhen, San Francisco, Paris, London, Seoul, and a "your computer" marker for local models. Tapping a name flips a small card: can it search, is it open weights, where does your text go. The names float up from the map as the screen enters.

What it says: there are many tools, from many places, and they differ in ways that matter.

Reader action: tapping names.

Data: `data/models.json`, a dozen entries, each with a "checked on" date.

### 8. The recap

Assembled from what the reader actually did on this page: the branch they chose in the transcript, the words they picked, the cards they dragged, the clues they found, the models they tapped. Each item slides in as a line. If the reader did everything, a short burst of token chips falls, and the progress rail lights completely. A "copy this" button puts the recap on the clipboard as plain text, for a student who wants to bring it to class.

Reader action: none; this screen is the receipt.

### 9. Next part

A full-width band in the next page's colour, with the title of part two and a one-sentence description, sliding in from the right. The band's colour is the first thing the reader sees on the next page, so the two pages feel continuous.

## Global elements

Status 2026-09-22: these are no longer sample-only. Paul settled that the sample's look is the project's look, so the skin (per-section hues, the scroll-scrubbed tint, the skewed stripes, the section labels, the rail, the `.placeholder` coming panel and the `.band` hand-off) now lives in `css/site.css` with `js/stripes.js`, `js/rail.js` and `js/progress.js`, and every page of the site uses it. The one-off activities stay sample-specific. See `HANDOFF.md`.

**Colour stripes.** Each screen owns a hue. The page background is not one colour; a scroll-linked tint moves through the nine hues as the reader moves, so the transition between screens is a wash rather than a border. Between screens, a skewed band in the next screen's hue slides up under the current one (a diagonal stripe, the thing Paul asked for by name). Headings, the progress dot, the scroll cue and the underline colour all take the current hue.

**Progress rail.** A thin vertical rail on the right (desktop) or a thin bar under the header (phone). Nine dots. A dot fills when its screen has been seen and turns solid when its activity is done. Tapping a dot jumps there. The rail is the exploration reward from localai's plan, done quietly.

**Marginal notes.** On wide screens, short notes appear in the right margin as the reader passes certain lines, the way a teacher writes in the margin. They slide in from the right and stay. On a phone they become tappable marks in the text.

**Cursor and tilt.** On desktop, the hero chips and the wall's bricks respond a little to pointer position (parallax, a few pixels). On a phone, the same effect uses device tilt if the reader grants it, and does nothing otherwise.

**Celebrations.** Small, and only for doing something: matching the model's top word, finding every clue, finishing the recap. Never for scrolling.

**Sound.** None.

## Technical plan

- **GSAP 3 with ScrollTrigger**, self-hosted in `js/vendor/`. Free for all use since 2025 (confirm the current licence text before vendoring and keep a copy alongside). It does the pinned, scrubbed screens (2, 4), the tint interpolation, and the flip and stamp animations. Nothing else needs a library.
- **CSS scroll-driven animations** (`animation-timeline: view()`) for the simple progress-linked effects, with the GSAP version as the fallback where unsupported. Decide per effect; do not run both.
- **Canvas** for the token rain (screen 1) and the burst effects. Capped at a few hundred chips, `devicePixelRatio` capped at 2, paused when off screen, off entirely under reduced motion.
- **SVG** for the map, the wall and window, and the probability bars, hand drawn and inline so they take the page's tokens and themes.
- **The transcript player** as is. Screen 3 is built entirely on its events, which is the test of the event design.
- **Per-screen data files** in `data/`: `next-word.json`, `redated-post.json`, `models.json`, `timeline.json`. Every user-visible string in a data file or in the HTML, never in JS logic, because of the Chinese translation to come.
- **State** in localStorage under one key, `ai-progress`, as a small object. Read at load to fill the rail and the recap.
- **Structure**: `sample.html`, `css/sample.css`, `js/sample/` with one module per screen (`rain.js`, `timeline.js`, `scorecard.js`, `wall.js`, `nextword.js`, `redated.js`, `map.js`, `recap.js`) plus `stripes.js` and `rail.js` for the global pieces. All DOM-free logic (scoring, recap assembly, probability formatting) in pure functions with tests.
- **Performance budget**: 60 fps scrolling on a 2019 laptop and a mid-range phone; at most three backdrop filters on screen at once; transforms and opacity only in animations; no layout-triggering property animated. Measured in the browser's performance panel before sign-off, not guessed.
- **Reduced motion and teacher mode**: every screen has a still version described above. Teacher mode uses the still version plus a "play" control, because a projector at the front of a room should not move unless the teacher says so.
- **Phone**: everything works by tap; drag has a tap alternative; pinned screens shorten (less scroll distance) so a thumb can get through them.

## Build order, with checks

Status 2026-09-22: every step is built in `sample.html` except step 6 (next word), which waits on recorded probabilities, and step 10 (the polish pass). Step 1's global pieces now serve the whole site, not just this page. See `HANDOFF.md`.

1. **Global**: vendored GSAP, the tint and stripes, the rail, the nine empty screens with their hues. Check: scroll the page end to end at 60 fps on a phone; every dot fills.
2. **Screen 3, the scorecard.** Uses only what exists. Check: every annotation in both transcripts produces a stamp; the final tally matches the data.
3. **Screen 1, the rain and typed title.** Check: frame rate with 300 chips on a phone; still version under reduced motion.
4. **Screen 4, the wall.** The most work and the most important interactive. Check: drag and tap both work; the switch state is announced to a screen reader; the still version reads on its own.
5. **Screen 2, the timeline.** Check: the swap lands on the right words; the play button works in teacher mode.
6. **Screen 5, next word**, once probabilities are recorded. Check: the numbers on screen match the data file.
7. **Screen 6, the re-dated post.** Check: every clue is findable by tap on a phone.
8. **Screen 7, the map.** Check: every entry has a "checked on" date.
9. **Screens 8 and 9.** Check: the recap reflects a fresh session and a completed one.
10. **Polish pass**: cut any motion that doesn't carry a point; check contrast in both themes; check the teacher-mode still versions on a projector-sized viewport (1280 by 720 at 150% zoom).

## What Paul supplies

- Recorded next-word probabilities from a local model, for four or five sentences including the invented book title. The capture kit is ready (2026-09-22): pick the sentences in `data/next-word-sentences.json`, then one command against a local llama-server (`dev/capture-next-word.mjs`) writes `data/next-word.json` with full provenance. See `HANDOFF.md`.
- A decision on the mock recipe post: a wholly invented one (safe, clearly a mockup) or a real example with the site's name removed.
- The list of models for the map, and which ones he is comfortable naming.
- Copy. Everything above is described, not written. The drafts I write follow the style rules and he rewrites what he wants.

## What this costs

Rough order: the global pieces and screen 3 in one session; the wall and the rain in one each; the rest in one or two together. Call it five working sessions to a complete sample, before the polish pass. Half of it (rail, stripes, scorecard, wall, next word) carries straight into the real page one whether or not the rest survives.
