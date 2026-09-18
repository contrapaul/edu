# AI in Education: handoff

Running record of what is built, what was decided, and what the next session should know. Newest at the top. Planning lives in `plans.md`, `style.md` and `interactive.md`; this file is the build log.

## 2026-09-19: screens 8 and 9, the recap and the hand-off band

The sample page is now complete except for screen 5, which waits on recorded next-word probabilities.

- `data/recap.json`: line templates per activity, short fallbacks for a progress record that lacks details (a reader who did the activities before an update still gets a sentence), the outcome words for the wall cards, the copy and clear labels, and the part-two band text.
- `js/sample/recap.js`: `buildLines(progress, strings)` is pure and tested; it writes one line per finished activity in the reader's own choices (the year they reached, who they said they'd trust, the branch they picked in the 2023 transcript, each card and its outcome, the stickers they found, the tools they tapped). `mountRecap` renders it, re-renders on every `ai:progress` event, slides new lines in, offers "Copy this" (plain numbered text to the clipboard) and "Clear my progress" (resets the record, which also empties the rail), and fires a one-off burst of token chips the first time every activity is done. `mountNextBand` slides the part-two band in from the right.
- To make the recap read like a receipt, the activities now record more than ids: the wall stores each card's text and outcome, the post stores the sticker names, the map stores the model names, and the scorecard records the branch chosen inside a transcript through a new `setAnswer()` in `progress.js` (an answer that marks nothing done).
- `ACTIVITY_SCREENS` in `recap.js` lists what counts (s2, s3, s4, s6, s7). Add s5 when it exists.
- Player fix found on the way: "Show all" did nothing when pressed during the pause between two messages (no stream in flight). `skip()` now advances directly in that case.
- Checked with a scripted run from an empty record through every activity: six lines, all dots solid, the burst, then clear back to empty.

## 2026-09-18 (end of day): screen 7, the model map

- `data/models.json`: thirteen entries. DeepSeek and Qwen (Hangzhou), Kimi, Doubao and GLM (Beijing), ChatGPT, Claude, Gemini and Llama (San Francisco area), Copilot (Redmond, the tool the school's Microsoft 365 provides), Mistral (Paris), HyperCLOVA X (Seoul), and "Local models" (LM Studio, llama.cpp, Unsloth) at "your computer". Grok is deliberately left out (Paul's call, 2026-09-18) and a test asserts it stays out. Each entry has `search` and `open` values with a short note, a `checkedOn` date, and `policy: null`: the "where your text goes" line is written only after Paul has read that company's policy, and the card says so until then. A test asserts every policy is still null. The search and open-weights notes are mine from memory and are the kind of claim that changes; Paul reviews them with the policies.
- `js/sample/map.js`: a rough equirectangular world map from hand-placed continent polygons (no Antarctica; cut at 58°S), one dot per city, labels on leader lines fanned into empty sea, a laptop marker below the map for local models. Tapping a label opens a card with the same four rows for every tool and the checked-on date. Four taps mark the screen done (progress `s7`).
- Trap: GSAP owns an SVG element's transform outright, so an animated `<g>` loses its `translate`. Position goes on an outer group; GSAP animates the inner one.
- Not yet checked on a phone (the pane's emulation wouldn't scroll to it). The SVG scales by viewBox and label text is 20px in viewBox units under 600px, so it should read, but look at it on a real phone.
- The continents are deliberately rough. If they read as sloppy rather than hand drawn, the polygons are in `LAND` at the top of the module and are easy to improve.

## 2026-09-18 (later still): screen 6, the re-dated post

- `data/redated.json`: an invented site ("Quick Crumbs", `quickcrumbs.example`), an invented no-knead bread post, three invented comments, five clues with their sticker text and explanation, and all strings. Paul chose invented over a real site with the name removed.
- `js/sample/redated.js`: a fake browser window (chrome, address bar, status bar that shows a link's real address on hover) holding two copies of the article. The current copy carries `data-clue` on five nodes: the update line with no changelog, the nameless byline, the paragraph that says nothing, the affiliate links (`?ref=quickcrumbs-20`), and comments older than the post. Nothing is highlighted until found. A click on anything else gets "Nothing wrong with that part." A hint button pulses the next unfound clue. Each find adds a sticker to the window's edge and explains itself in the status line. After all five, a wipe slider appears; the 2019 copy sits underneath, clipped from the left, with its date line highlighted. Past halfway the caption appears and the screen is done (progress `s6`).
- The two copies must align to the pixel for the wipe to read as one page. The underlay is `position: absolute; inset: 0 0 auto 0` so it is as tall as its content, and `align()` gives both meta lines the taller of their two heights (the only block that wraps differently), re-run on resize and when fonts load.
- The mock uses Georgia on purpose, so it reads as someone else's page, and its headings are `h3`/`h4` so it doesn't add a second `h1` to the real page. Its styles are scoped under `.rp-window` because the screen's own heading colour otherwise leaks in.

## 2026-09-18 (late): screen 2, the scrubbed timeline

- `data/timeline.json`: the axis range, the flip year (ChatGPT's launch), the quote as segments with `{a, b}` swap points, and ten dated events. The dates are from widely reported events (Wikipedia 2001, the Nature comparison 2005, Middlebury 2007, ChatGPT November 2022, the New York City block and its lifting in 2023, the IB's statement in 2023, web search in the main chatbots in 2024). Paul should verify each before publishing; the file says so.
- `js/sample/timeline.js`: a year readout, a sliding track of events (two lanes so neighbours don't collide), one quote card, and a closing line. When the year crosses the flip point the three swap spans scramble letter by letter into the AI wording (`flipText`) and the card's border turns to the warm accent; scrolling back flips them back. Done (progress `s2`) once the year passes 2025.
- The axis is stretched: `SEGMENTS` gives 95 px per year before 2021 and 400 after, and scroll progress maps to distance along the track (`progressToYear` via `yearToPx` and `pxToYear`), so the scrub lingers where the events are. Tested.
- Modes: above 900px and outside teacher mode, a 230vh stage with the scene sticky and a ScrollTrigger scrub. Otherwise a range slider and a "Play the timeline" button (a 14 s GSAP tween along the track). Under reduced motion, both cards side by side with the swaps highlighted, no motion, marked done on sight.
- The quote pair is mine and is the kind of thing Paul will want to rewrite: "You can't trust Wikipedia. Anyone can edit it, and it doesn't tell you who did." against "You can't trust a chatbot. It makes things up, and it doesn't tell you when."

## 2026-09-18 (night): showcase phases 3 and 4, the rain and the wall

### Screen 1: token rain and typed title

- `data/tokens-page1.json` (5 KB): page one's text tokenised against the real Qwen3 vocabulary subset from `make/localai` (`js/data/vocab.js`, 390 KB, not copied). 260 unique pieces with their real token ids; "chatbot" splits into " chat" and "bot", which is the lesson. Regenerate with the script in this session's history if the copy changes (it reads `sample.html`, strips tags and the "Coming" panels, greedy longest-first match). Provenance is in the file.
- `js/sample/rain.js`: canvas behind the hero. Chips show the piece (a leading space drawn as ␣) and the id. Capped at 180 chips (70 under 700px), DPR capped at 2, paused off screen and when the tab is hidden, sped up and stretched by scroll velocity. Under reduced motion it draws once and stays. A CSS mask thins the rain under the text column.
- `js/sample/typed.js`: `typeInto(el)` types an element's text with a cursor and fires `typed:done`; the hero's lede, note and scroll cue carry `.after-typed` and appear when it fires. Trap: `<h1 data-typed>` reads as an empty string, not null, so the code uses `||`, not `??`.

### Screen 4: the wall and the window

- `data/wall.json`: axis, cutoff, five cards (two before, two after, one timeless), all strings.
- `js/sample/wall.js`: inline SVG (axis, bonded brick wall at the cutoff, a light beam behind the window rows), a tray of card buttons, a search switch (`role="switch"`), a status line (`aria-live`), a reset. Drag or tap a card and it flies (GSAP timeline) to its year: lands before the cutoff, hits the wall and bounces after it, or dips through the open window when search is on. Cards stack when they land in the same stretch and are clamped inside the scene. Clicking a placed card returns it. Done (progress `s4`) after three cards and one flip of the switch.
- Building the wall: above 900px, not in teacher mode and not under reduced motion, the stage is 190vh tall with the scene sticky and a ScrollTrigger scrubbing the brick count. Otherwise the wall builds on arrival (phones, teacher mode) or is drawn complete with the window open (reduced motion).
- Pure helpers `yearToX` and `brickLayout` are tested.

### Checked

Desktop at the pane's width (build on arrival), 1440 wide (pinned, 0 to 30 bricks across the scroll), the full card loop with the switch, dark mode via the tint. Not checked on a real touch device; the drag uses pointer events with `touch-action: none` on the cards and a tap falls through to a throw.

### Next

Screen 2 (scrubbed timeline), then 5 (needs recorded probabilities), 6, 7, 8, 9.

## 2026-09-18 (evening): showcase phases 1 and 2 built

`sample.html` exists alongside `index.html`. Phase 1 (global) and phase 2 (the scorecard) from `showcase-plan.md` are done and checked in light, dark, desktop, 1440 wide and 375 wide.

### Files

| File | What |
|---|---|
| `sample.html` | Nine `.screen` sections, each with `--hue`, `data-title`, a `.stripe` band and, for the unbuilt ones, a `.soon` panel saying what's coming. Screen 3 has the scorecard and the compare. |
| `css/sample.css` | Tint (`--page-hue` on `<html>`, oklch background), per-screen ink and band colours from the hue, stripes, rail, scorecard. |
| `js/sample/main.js` | Wires theme, mode, nav, reveals, colour, rail, compares, scorecards. |
| `js/sample/stripes.js` | `initColour()`: a ScrollTrigger per screen scrubs `--page-hue` from the previous hue to this one (short way round, `mixHue`), and each stripe drifts a little with scroll. |
| `js/sample/rail.js` | The progress rail. Vertical on the right above 900px, a bar under the header below. Dots take their screen's hue; half-filled when seen, solid when done, scaled when current. |
| `js/sample/progress.js` | `ai-progress` in localStorage: `seen`, `done`, `answers`. `markSeen`, `markDone`, `tally`. Dispatches `ai:progress`. |
| `js/sample/scorecard.js` | Listens on a compare block. `tp:annotation` stamps the side's column (INVENTED, CHECK, CONFIRMED) and bumps the counter; `tp:messageend` on an assistant turn counts new distinct link hrefs. When both sides are done or waiting at a choice, it asks one question and stores the answer under the screen id. |
| `js/vendor/gsap.min.js`, `ScrollTrigger.min.js`, `GSAP-LICENSE.txt` | GSAP 3.15.0 from npm, standard "no charge" licence, text saved alongside. Loaded as classic scripts before the module. |
| `test/sample.test.mjs` | `mixHue`, `tally`, `countNewLinks`. 16/16 across both files. |

### Also changed

- `js/compare.js`: pane roots carry `data-side="0|1"` so the scorecard can tell them apart; autoplay uses `whenInView()` from `js/scroll.js`, a new helper with an observer plus a scroll sweep behind it.
- `.tp-scope` on the scorecard and the compare bar, so buttons outside a player still get the player's tokens.

### Traps

- The compare bar's "Show all" is the third "Show all" button on the screen; a ref-based click in the pane sometimes lands on the wrong one. Click through JS when verifying.
- Under phone emulation this pane neither fires IntersectionObserver nor honours `scrollIntoView`, so the streams don't start there. The layout was checked at 375px; the autoplay was checked at desktop width.
- The stamp strip keeps at most six stamps; older ones are removed. The counters are the record.

### Next (phase 3 onward, per the plan)

Screen 1 rain and typed title, then screen 4 the wall, then the timeline, next word (needs recorded probabilities), the re-dated post, the map, the recap.

## 2026-09-18 (later): three notes from Paul

- The player now holds on a prompt for reading time before the answer streams (800 ms plus 70 ms a word, between 1.4 and 4.5 s, scaled by speed). The pause before an answer starts is 700 ms.
- No double titling: the eyebrow-over-heading pattern is gone from page one. One title per section. Rule recorded in `style.md`, along with the AI-prose tells to avoid.
- Page one copy rewritten plainer. Paul will rewrite much of it anyway.
- `showcase-plan.md` written: nine screens, each with its own colour, one main motion and one thing to do, plus a progress rail, colour stripes, and a recap built from what the reader did. Not started.

## 2026-09-18: shell, scroll engine, compare component, page one skeleton

Paul chose a fully distinct look for `/ai` (own header, own tokens, no inherited site theme). Built and checked in light, dark, teacher mode, desktop and phone width.

### Files

| File | What |
|---|---|
| `index.html` | Page one, "What AI is now". Real copy for the hero, the Wikipedia parallel and the then-and-now section; honest `Placeholder` panels for the cutoff timeline, next-word guesser and re-dated post. Nav links to unbuilt pages are marked `is-soon`. |
| `css/tokens.css` | All tokens. Light and dark (system default, manual override), teacher mode type scale, `@font-face` for the self-hosted fonts. |
| `css/site.css` | Header, hero, sections, cards, claims list, placeholder panel, compare layout, reveal transitions. |
| `js/theme.js`, `js/mode.js` | `data-theme` and `data-mode` on `<html>`, stored as `ai-theme` and `ai-mode`. The pre-paint snippet in `index.html` mirrors both. |
| `js/scroll.js` | One-way reveals with stagger, `section:enter` events, and a load-time pass plus scroll sweep so nothing depends on IntersectionObserver firing. |
| `js/compare.js` | Two players side by side from `[data-compare data-left data-right]`, one bar driving both, tabs under 860px. Starts both when 35% in view. |
| `js/main.js` | Wires the above. |
| `fonts/` | IBM Plex Sans 400/400i/500/600/700 (OFL, licence file alongside) and JetBrains Mono 400/500 copied from the repo's own set. |

### Decisions

- Type: IBM Plex Sans for everything, JetBrains Mono for evidence labels (model, date, search) and eyebrows. Paper-toned light theme, warm dark theme, one blue accent plus a warm second accent for emphasis. The annotation colours (red, amber, green, blue) are tokens shared by the player and the page.
- The player's `--tp-*` tokens now resolve from the site tokens. `.tp-scope` on any element outside a player gives it the same tokens (the compare bar uses it).
- The player got a `follow` option: inside a scrollable log it keeps the cursor in view by scrolling the log, never the page. Compare panes cap the log at 70vh.
- The teacher-mode toggle exists and works (bigger type, a banner). It does nothing else yet, by design; classroom controls come with the activities.
- Page copy is written at the grade 6 to 8 level, headers are noun phrases, and every AI claim on the page is one the transcripts support.

### Traps

- In this browser pane, `requestAnimationFrame` and IntersectionObserver can both stall under phone emulation (the document reports itself hidden). The load-time reveal pass uses `setTimeout`, and a scroll sweep backs up the observer. Scaled screenshots from the pane can also be stale frames; take a full-size one before believing a blank hero.
- The header collapses to a Menu button below 1120px; below 600px the draft tag hides and the mode button reads "Teach".

### Next

- Glossary data file and hover cards, then mark the terms in page one's copy.
- The three placeholder interactives on page one, in the order they appear.
- Pages two and three as skeletons, so the nav works.
- Once Paul picks topics, swap the Hadrian's Wall pair for something students would be assigned.

## 2026-09-16 (later): the 2026 half of the comparison, and a wider markdown subset

Paul ran the manual's five Hadrian's Wall prompts through free-tier ChatGPT (GPT-5.6 Luna) and saved the raw output as `reference/hadrians.md`. It is now `data/transcripts/hadrians-wall-2026.json`, built by a script that split the file on the exact prompt strings so nothing was retyped. The 2023 file was extended to the same five prompts from the manual (PDF line wraps unwrapped, paragraph breaks restored where a line ended in a full stop). Both transcripts carry annotations; every claim marked `good` or `fabricated` was checked against the cited page on 2026-09-16, and the note says so.

The modern reply needed more markdown than the 2023 one: links, `###` headings, `>` quotes, pipe tables, `[n]: url "title"` reference lines, and images. All added to the parser, each minimal. Images render as a dashed "Image" chip with the URL in its title; they are never hotlinked (the six in the Antonine answer are on an OpenAI CDN with no provenance). Numbered lists now survive blank lines between items and keep their start number, because the model writes them that way. Annotation notes are positioned within the message body from the mark's last line fragment, since marks wrap across lines, and become a bottom sheet under 600px.

Findings from the comparison are in `interactive.md` under "Then and now: what the Hadrian's Wall pair shows".

## 2026-09-16: transcript player built

The first component, and the one most interactives sit on. Every AI interaction on the site plays through it; there are no live calls.

### Files

| File | What |
|---|---|
| `js/transcript-player.js` | The player. `TranscriptPlayer` class plus `mountAll()`. Pure parsing functions are exported for tests. |
| `css/transcript-player.css` | Neutral chat look. Tokens prefixed `--tp-` with fallbacks to the site's shared tokens. |
| `data/transcripts/hadrians-wall-2023.json` | Five prompts and replies from the 2023 manual, annotated. |
| `data/transcripts/hadrians-wall-2026.json` | The same five prompts to GPT-5.6 Luna, 2026-09-16, annotated. |
| `dev/player.html` | Test bed. `noindex`, unlinked. Shows the events the page receives. |
| `test/transcript-player.test.mjs` | 8 tests on the parsing and annotation functions, plus a check that every annotation in every transcript file matches its text. `npm test` from `ai/`. |
| `package.json` | Only for `"type": "module"` and the test script. Nothing is installed. |

### How it works

- A transcript is JSON: a label (model, date, search on or off), a source line, a `placeholder` flag, a pace, and a list of messages. The data shape is documented at the top of the JS file.
- The user's turn appears whole (a person typed it; we don't fake typing). The AI's turn streams one character at a time at `cps` characters per second. Blocks the stream hasn't reached are hidden, and a cursor element follows the writing point.
- Annotations are `{ match, kind, note }` on a message. The matched text becomes a `<mark>` that's invisible until the stream reaches it, then underlines in its kind's color (`fabricated` red, `check` amber, `good` green, `note` blue). The note shows on hover, focus, tap or Enter. Kinds are just class names, so adding one is a CSS rule.
- `note` messages are asides from the site, styled differently from the chat. `choice` messages pause playback and offer buttons; an option carries inline `messages` or a `next` transcript id to fetch. The chosen branch replaces whatever followed the choice.
- Events bubble from the root element: `tp:load`, `tp:start`, `tp:message`, `tp:annotation`, `tp:messageend`, `tp:choice`, `tp:choose`, `tp:done`. This is the pi.dev lesson: the page reacts to the recording.
- Autoplay when 40% of the player is in view (IntersectionObserver), once. Controls: play/pause, show all (finishes instantly up to the next choice or the end), replay, speed 1x/2x/instant. `prefers-reduced-motion` starts at instant.
- Markdown subset: paragraphs, numbered and bulleted lists, headings, quotes, pipe tables, reference lines, bold, inline code, links, image placeholders. Grown only as real transcripts needed it.
- Strings the reader sees are in a `STRINGS` object at the top of the JS, ready to move to a data file when translation starts.

### Things to know

- The three annotation markers are the control characters U+0001, U+0002 and U+0003, written in the source as JavaScript escape sequences. A first write put the raw bytes in the file, which works but is invisible in an editor. Keep them as escapes.
- The site-wide `serve_nocache.py` is used for local preview. `.claude/launch.json` got a second config, `edu-ai`, on port 8911, so two sessions can preview at once.
- The agent browser pane did fire IntersectionObserver this time (autoplay on scroll worked), unlike localai's experience. Don't rely on it either way; check reveals in a real window.
- The transcript JSON files contain whatever the model wrote, em dashes included, because they are verbatim recordings. The no-em-dash rule applies to everything the site writes, including annotation notes, and not to quoted AI output. An annotation `match` string has to contain one if the matched text does.
- `ai/reference/` is gitignored. It holds the school policy, the 2023 teacher manual, and any saved transcripts. `academicintegrity.md` and `aipolicy.md` were 0 bytes when first checked.

### Next

- Decide the visual direction and tokens before building page one; the player picks up whatever tokens the page defines.
- The "Ask the AI if it's sure" branch in the 2023 transcript is still a placeholder. A real capture of that follow-up (to a current model) would complete it.
- Add the same five prompts to one or two more models (a Chinese model with search, and a local model without) so the comparison isn't two OpenAI products.
- Real per-character timing is not supported yet. If a capture tool records it, add a `timing` array per message and teach `_tick` to read it. Nothing else changes.

## Source material: the 2023 manual

`ai/reference/ChatGPT for Educators Manual.pdf` is Paul's own guide, written February to March 2023, 129 pages, updated March 8, 2023. It contains dozens of genuine GPT-3.5 transcripts with prompts and full replies, plus Paul's critical notes at the time. It is the primary source for "then" in every then-and-now comparison. Sections most useful to this site: Academic Integrity and Ethical Considerations (pages 5 to 11, including the Hatchet example of prompting to evade detection), Student: Research (page 104 on, including the Hadrian's Wall sources with two invented book titles), Student: Writing Assistance, Student: Homework Assistance. The manual's own claims have aged in ways worth showing, such as "ChatGPT is not connected to the internet" and "as tools such as Bing Chat become available this will hardly be an issue."
