# Present mode

How the "Present topic" slide deck on the DP curriculum pages works, what it relies on, and what to keep in mind when adding content or extending it. Written 2026-09-12 after the feature was rolled out to all 24 DP topic pages.

## What it is

Two shared files build a slide deck, at runtime, from the content already on a topic page:

- `curriculum/presentation.js`
- `curriculum/presentation.css`

Nothing is pre-generated and there is no build step (the site is served straight from source, see the repo notes on Cloudflare Pages). A page opts in with two tags, placed after the theme includes:

```html
<link rel="stylesheet" href="../presentation.css">   <!-- after themes.css -->
<script src="../presentation.js"></script>            <!-- after curriculum-themes.js -->
```

The script must load after `curriculum.js` because it places its "Present topic" button next to the "Collapse all sections" button that curriculum.js inserts, and it reuses the page's modals and lightbox.

`curriculum/dp/presentationtest.html` is a copy of A3.3 kept as a test bed. It carries a `noindex` meta and is not linked from anywhere. It is safe to overwrite it with a copy of any other page when a different structure needs testing.

## Design decisions (settled, do not relitigate)

- The primary user is a teacher projecting in class. Student study mode is not a goal.
- One deck per topic. Every objective gets a divider slide. Deep links jump to any objective or slide.
- Slide text is the page text, verbatim. The deck never summarises, rewrites or drops sentences.
- Content is split rather than shrunk. A paragraph splits at a sentence, a list at an item, a table at a row. Only a block that cannot be split gets scaled down, and a widget that still does not fit scrolls.
- Images sit beside the text they illustrate, textbook style. A hint opts a figure into a large centred image.
- Authoring hints in the page HTML are welcome as long as they change nothing about how the page reads outside the deck.
- The site theme carries into the deck unchanged and the theme picker stays reachable inside it.

## Deck order

1. Cover: topic code, title and guiding question, read from `.topic-title` and `.topic-guiding-q`.
2. Introduction: the paragraphs in `#course-notes .curr-body` that sit before `.obj-list`.
3. For each `.obj-section`: a divider slide (code, statement, the "Students must be able to" outcome), then that objective's content slides.
4. Quiz: a divider, then one slide per `#quiz .quiz-q[data-answer]`.
5. Paper 2: a divider, then per `#paper2 .p2-question` the stimulus slides, and for each part a question slide, the example answer, and the markscheme.
6. Linking questions: the list in `.curr-main .linking-qs`.

References and the topic page navigation are not in the deck.

## How the page is read

`collectSections()` builds the section list above. Each objective's short title in the slide kicker comes from the page's table of contents (`.curr-toc [data-section="obj-x.y.z"] a`), with the leading code stripped, so a TOC entry like "3.3.6 Gear systems" becomes the running header "3.3.6 · Gear systems". If a page's TOC entry is missing, the full objective statement is used instead.

`collectUnits()` turns the direct children of an objective body into units. Units carry a `kind`:

| kind | Source | Behaviour |
|---|---|---|
| `text` | `<p>`, `.content-formula`, `.content-note` | Merges with neighbours, splits at sentence boundaries |
| `data` | `<ul>`, `<ol>`, `.content-table-wrap`, `.p2-table-wrap`, `<table>` | Owns its slide apart from a lead-in above it; splits by item or row |
| `figure` | `<figure>` or any element holding a usable `<img>` | Starts a slide, the text after it joins on the right |
| `box` | `.discussion-box`, `.topic-link-blurb`, `.concept-box`, `.activity-block`, `.tool-promo-card`, and any other `<div>`, `<section>`, `<aside>` or `<article>` | Slide of its own; unwraps into its children if it cannot fit |
| `live` | `.drag-sort`, `.diagram-widget`, `.live-calc`, `.compare-slider-widget`, `.swot-build`, `.tbl-tool`, `.mclass-diagram`, or anything containing an `input`, `select`, `textarea` or `canvas` | The real element is moved into the deck and put back on close |
| `hero` | `.case-study-grid` cards | Title slide, followed by the modal body as normal units |
| `break` | `<hr>` or `data-ps="break"` | Forces a new slide |

Things to know about that pipeline:

- **Headings.** A paragraph opening with `<strong>Label:</strong>` gives up the label as the slide heading. A short paragraph on its own that ends in a colon ("DFD design guidelines:") becomes the heading of whatever follows rather than a slide of its own. A list or table with no heading borrows the heading of the paragraph before it, shown only when they land on different slides, marked "continued".
- **Lead-ins.** A paragraph ending in a colon, or a "Table 1:" caption, starts a fresh slide so the list or table it introduces can sit under it.
- **Photos inside lists.** A3.3 puts `<figure>` elements between `<li>` elements inside an `<ol>`. Such a list becomes one unit per item, with each photo attached to the item after it, and the `start` attribute keeps the numbering right. Two photos in a row share the media column when they fit.
- **Case study cards.** `.case-study-grid` cards become a hero slide (cover art, kicker, title, teaser), then the modal body from `[data-modal]` is unwrapped (`.case-phase` wrappers are flattened) and fed through the pipeline. A card or modal figure with an empty `src` is skipped. Cover art repeated at the top of the modal is skipped once.
- **Links.** Links to other pages get `target="_blank"` in the deck so it survives a click. Same-page `#obj-…` links jump within the deck. The `<a>` wrapping a `.case-photo` image is removed and the image opens the page's `#case-lightbox` instead.
- **Live widgets.** The real node is moved into the slide and a comment placeholder marks its spot. `closeDeck()` moves it back. Any script that keeps a reference to the node keeps working; any script that queries the widget by position in the page during the presentation will not find it.

## Packing and fitting

`packSection()` is greedy. It appends units to the current slide and measures. `overflows()` compares `scrollHeight` against `clientHeight` on `.ps-slide-inner`, so **a slide must be attached to `.ps-stage` before it is measured**. Detached slides report zero and always pass. This was a real bug once, in the quiz and Paper 2 builders.

Rules in `accepts()`:

- A figure may only start a slide, and a slide holds at most two figures.
- A data unit may follow at most one text block, and nothing follows a data unit except a `trailer` (used for Paper 2 award lines).
- A text slide holds at most three blocks. Beside a figure, at most two.
- `hard` units (boxes, live widgets, heroes, anything with `data-ps="solo"`) are alone.

When a unit does not fit on an empty slide, `splitUnit()` halves it (text by sentence, list by item, table by row, box by unwrapping its children under the box's title). If it cannot be split, `shrinkToFit()` applies CSS `zoom` down to 0.55, or 0.7 for live widgets, which then get `ps-slide--scroll` and scroll inside the stage.

The deck is packed for the current stage size. A resize (entering fullscreen, mirroring to a projector) rebuilds it in place and lands on the same slide.

Images are preloaded before packing, with a three second cap, because a lazy-loaded photo has no height until it arrives.

## Authoring hints

Attributes on page HTML that change the deck only. None affect the page.

| Hint | Effect |
|---|---|
| `data-ps="skip"` | Leave the element out of the deck |
| `data-ps="break"` | Start a new slide before this element |
| `data-ps="solo"` | Give the element a slide of its own |
| `data-ps="feature"` | On a figure: large centred image, caption as the description |
| `data-ps="live"` | Move the real element into the deck (for widgets the class list above misses) |
| `data-ps="trailer"` | A short note allowed to follow a list or table on the same slide |
| `data-ps-title="…"` | Heading shown above this element on its slide |
| `data-ps-side="left"` | On a figure: image on the left of the text, default is right |

## Quiz slides

Each `.quiz-q` is cloned with its states reset. The first press of → or Space reveals the answer (marks the correct option, marks a chosen wrong option, shows `.quiz-answer`), the next press advances. Clicking an option, or pressing A to D, commits that choice and reveals. The green and red states are the page's own `.correct` and `.incorrect` classes, and `.answered` on `.quiz-q` shows the explanation exactly as curriculum.css does on the page.

## Paper 2 slides

Per `.p2-question`, the `.p2-q-header` children are walked in order, so multi-part stimuli ("Case study · part 2" before question (b)) come out in the right sequence.

- `.p2-stimulus` blocks go through the normal pipeline with the stimulus label as their heading.
- Each `<p>` inside `.p2-q-text` is a part. Its letter is read from the leading "(a)".
- The example answer and markscheme panels are split into parts by the same leading letter (`p2Parts()`). Paragraphs without a letter continue the previous part, which is how (d) on A3.3 gets five paragraphs.
- The part slide is built with the answer visible, measured attached, and if it fits the answer is hidden until revealed. If it does not fit, the answer goes on its own "Example answer (d)" slides and → simply advances.
- A markscheme part is one `<p>` of `<br>`-separated lines. `markschemeNodes()` turns it into a statement paragraph plus a `<ul>`, with group lines like "Gains:" becoming headings, so long ones split by point. The `.p2-award` paragraph is a `trailer` so it stays at the foot of the list.

A question with no lettered parts gets a single part slide holding the whole answer panel. The old `<details class="p2-reveal">` format on `testpage.html` produces no Paper 2 section at all.

## Interaction and chrome

- Keys: → ← Space PgUp PgDn Home End, O contents, F fullscreen, P print, ? help, Esc (closes a panel, leaves fullscreen, then returns to the page). A to D on quiz slides.
- Swipe left and right on touch screens. Swiping forward on a reveal slide reveals first.
- Focus rests on `.ps-stage` (tabindex -1) between interactions so Space is never swallowed by a focused toolbar button. `focusStage()` is called after every navigation and reveal. Focus inside a live widget is left alone.
- Fullscreen is requested on `document.documentElement`, not the overlay, so the theme picker, modals and lightbox (which live outside the overlay) stay visible. `body.ps-presenting` raises their z-index above the overlay's 2000.
- Contents panel lists cover, every section and the slide count of each. Hash routing: `#present`, `#present/3.3.6`, `#present/3.3.6/4`, `#present/quiz/2`, `#present/paper2/13`. The hash updates as you move. Closing the deck replaces the hash with the objective anchor and scrolls the page there.
- PDF export is `window.print()` with a print stylesheet: one landscape page per slide, chrome hidden, the overlay made static. Verified with headless Edge. What is revealed at print time is what prints.

## CSS conventions

- Everything is prefixed `.ps-`. The overlay uses only site variables (`--bg`, `--surface`, `--text`, `--curr-color`, the fonts, the radii), which is what makes every theme in themes.css carry across.
- Typography selectors start with `.ps-overlay` deliberately. The page's `.obj-body > p` and `.obj-body ul:not([class]) li` rules set 0.9rem text and outrank a plain `.ps-slide-body p`. Add new slide typography under the same prefix.
- Slide text scales with the viewport: `--ps-fs: clamp(1.05rem, 1.9vw, 1.9rem)` on `.ps-stage`. Image heights use `vh`. Both re-flow proportionally in print.
- `.ps-overlay [hidden] { display: none !important }` exists because the button pills have their own `display` rule, which beats the hidden attribute otherwise.
- `.ps-slide-inner` uses `justify-content: safe center` so centred content that overflows is measurable and scrollable instead of clipped at the top.

## Testing

Open any page with `#present` on the URL and the deck builds on load. From the browser console, this gives the numbers that matter:

```js
var ss=[...document.querySelectorAll('.ps-slide')];
({ n: ss.length,
   overflowing: ss.filter(s=>{var i=s.querySelector('.ps-slide-inner'); return i.scrollHeight>i.clientHeight+2||i.scrollWidth>i.clientWidth+2}).map(s=>ss.indexOf(s)),
   zoomed: ss.map((s,i)=>[i,s.querySelector('.ps-slide-inner')?.style.zoom]).filter(x=>x[1]) })
```

Zero overflowing slides is the target. Zoomed slides are acceptable only for boxes and widgets. To try the script on a page that does not include it yet, inject the two files:

```js
var l=document.createElement('link'); l.rel='stylesheet'; l.href='../presentation.css'; document.head.appendChild(l);
var s=document.createElement('script'); s.src='../presentation.js'; document.body.appendChild(s);
```

Headless PDF check (Edge is installed on this Mac, Chrome is not):

```bash
"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" --headless=new --disable-gpu --no-first-run --window-size=1440,900 --timeout=15000 --no-pdf-header-footer --print-to-pdf=deck.pdf --user-data-dir=/tmp/edge-profile "http://localhost:8899/curriculum/dp/a3.3-mechanical-systems.html#present"
```

As of the rollout, every DP page builds with zero overflowing slides. Counts range from 65 (C3.2) to 135 (B2.1).

## Known limits and things that will bite

- **Measure attached.** Any new slide builder must append the slide to `.ps-stage` before calling `overflows()`.
- **New block types default to boxes.** An unfamiliar `<div>` becomes a hard box slide. If it is interactive, add its class to `LIVE_SEL` or give it `data-ps="live"`; the form-control check catches most cases automatically.
- **Images in answers.** Figures inside a `.p2-stimulus` or a modal body already go through the figure path. A figure inside an inline Paper 2 answer is cloned into the answer panel with no sizing rule of its own, so once images are added to Paper 2 answers, check `.ps-p2-answer img` and expect long answers to move to their own slides more often.
- **The lightbox.** Clicking a deck image sets the page's `#case-lightbox`. Its own close handler resets body scrolling, which the deck re-locks a tick later. A page without `#case-lightbox` simply gets no zoom on click.
- **`curr-toc.js` owns nothing in the hash.** The `#present` hash coexists with the TOC only because the TOC never reads `location.hash`. If that changes, the hash key in `HASH_KEY` may need to move to a query parameter.
- **Screenshots in the desktop app's browser pane** render at a quarter size after any keypress. That is the pane, not the deck; the viewport reports normal values. Use DOM checks or a fresh page load for visuals.

## Not done yet

- **MYP pages.** Their bodies use a different vocabulary (`.lesson-body`, `.unit-fcard`, `.sh-*`, `.unit-h`) and 133 `.obj-body` sections spread over 11 pages. `collectSections()` needs a second dialect that recognises those containers, and the kicker lookup needs an equivalent of the DP TOC. Nothing else in the pipeline is DP-specific.
- **Speaker notes.** A hidden notes element per slide and a presenter view were discussed and not built.
- **Section dividers for intro and linking questions** are intentionally absent; they read as part of the flow.
