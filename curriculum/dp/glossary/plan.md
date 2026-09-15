# Glossary auto-linking for DP topic pages

Goal: on every DP topic page, words that have a glossary entry appear in a
distinct colour. Hover shows the definition in a popover; click opens the
entry in `glossary/`. Readers learn that the colour means "definition here".

## What exists

| File | State |
|---|---|
| `glossary/glossary-data.js` | Generated from `IB definitions.numbers` by `build-glossary.py`. 317 terms, verbatim IB definitions, topic codes, 386 auto-aliases. Do not hand-edit. |
| `glossary/glossary-tip.js` | Popover for elements tagged `<span class="gloss">`. Written for hand-tagging, wired into no page yet. |
| `glossary/glossary.css` | Popover styles (part 1) and the glossary page (part 2). Tagged words currently get a dotted underline, which is what we are replacing. |
| `glossary/glossary-matches.js` | **New.** Hand-maintained surface forms per term: plurals, verb forms, US spellings, abbreviations, informal names. 310 of 317 terms covered, 1,141 forms. |
| `glossary/check-matches.py` | **New.** Validates the matches file and simulates linking against the 24 topic pages. |

`localai` (the model for this) hand-tags 25 words. With 317 terms across
24 pages that is not viable, so the linking is automatic: a scanner reads
the page text and wraps matches. The matches file is what makes automatic
linking accurate.

## How matching works

Rules are documented at the top of `glossary-matches.js` and mirrored in
`check-matches.py`. Summary:

- **`match`** links on every DP page. Whole words, case-insensitive. A space
  or hyphen in a form matches a space, hyphen or en dash on the page.
  Straight and curly apostrophes are interchangeable.
- **`local`** links only on the term's own topic pages and their A/B sibling
  (A3.4 and B3.4 are one family). Used for words that mean something else
  elsewhere: `stress`, `load`, `current`, `power`, `user`, `task`, `glass`,
  `column`, `cam`, `reach`, `switch`, `relay`, `elastic`, `composite`.
- **`exact`** is case-sensitive, for abbreviations: `LED` not "led", `ACT`
  not "act", `MA` not "mA", `SF`, `VR`, `IC`, `PIC`, `TBL`, `UTS`, `DfM`.
- **`also`** adds topic codes where `local` forms may link (`load` on the
  structures pages as well as mechanical).
- Longest form wins. Every form belongs to exactly one term; the checker
  fails on collisions.
- Seven terms are deliberately unlinked because the IB "definition" is a
  list, formula or cross-reference, or the word is too generic: Advantage of
  UCD, Disadvantages of UCD, Five Stages of UCD, Current/Resistance/Voltage,
  Levers (Mechanical Advantage), Research Methodologies, Form.

Run after any edit to the matches file:

```bash
python3 curriculum/dp/glossary/check-matches.py
```

It reports collisions and unknown ids as errors, and lists forms with no
hits, terms with no hits, and per-page link counts so generic words stand
out. Current state: no errors, 8,582 linkable occurrences across 24 pages
(roughly 360 per page). That number is why the scanner links the first
occurrence per section rather than every occurrence.

## Design decisions

### Colour, not underline

Two new tokens on `:root` in `style.css` and in every theme block in
`themes.css`: `--gloss` (text colour) and `--gloss-bg` (background,
transparent by default). Most themes set only `--gloss`. Paper and Xbox use
a highlighter instead: text stays readable and `--gloss-bg` carries the
meaning. Either way it must read as a different kind of link from
`--accent` (regular links) and never be confused with `--text`. Proposed
values, all first drafts to be eyeballed on a real page:

| Theme | accent | proposed `--gloss` | note |
|---|---|---|---|
| light | #1a5cb8 blue | #0f766e teal | 4.9:1 on white |
| dark | #58a6ff | #34d0b6 teal | |
| paper | #1c1b18 (ink) | text `--text`, bg #fff2a8 | highlighter: a student marking vocabulary |
| sketchbook | #46628c | #2e7d6e | |
| blueprint | #4fc3f7 cyan | #d8b4fe lavender | amber is already `--hl` |
| exam | #111 | #1f4e8c | the one colour on an otherwise B/W page |
| win95 | #000080 navy | #800000 maroon | |
| dos | #55FF55 green | #FF55FF CGA magenta | |
| dos-amber | #FFB000 | #FFD75E + solid underline | monochrome phosphor, colour alone is not enough |
| gameboy | #0f380f | #306230 + solid underline | four shades only, colour alone is not enough |
| xbox | #76e800 | text #000500, bg #76e800 | inverted block, the original dashboard look; check weight on a3.1 |
| gamer | #00e5ff | #b78cff violet | |
| nightmare | #ff1493 | #1e90ff | |
| hannah | #ff1493 | #7b2cbf | |

CSS in `glossary.css` part 1 becomes:

```css
.gloss {
  color: var(--gloss);
  background: var(--gloss-bg, transparent);
  padding: 0 0.15em;
  margin: 0 -0.15em;
  border-radius: 2px;
  box-decoration-break: clone;   /* wrapped terms highlight on every line */
  text-decoration: none;
}
.gloss:hover, .gloss:focus-visible, .gloss.is-open { text-decoration: underline; outline: none; }
```

Highlighter themes deepen `--gloss-bg` on hover instead of underlining.
No dotted border anywhere. `--gloss` also colours the popover's
term name and topic chips so the popover visibly belongs to the same system.

### Teaching the colour

A permanent key on the DP hub (`curriculum/dp/index.html`), next to the
existing Glossary link, and nothing on the topic pages themselves:

> Words in **this colour** have a glossary definition. Hover to read it,
> click to open the glossary.

"this colour" is itself a live `.gloss` element whose popover says
"Like this. Click any coloured word to open its glossary entry." The
reader tries the mechanic on the key itself. The glossary page gets one
sentence saying the same thing.

### Anchor, not span

Auto-linked words are real links:

```html
<a class="gloss" href="glossary/#young-s-modulus" data-term="young-s-modulus">Young's modulus</a>
```

Hover or keyboard focus shows the popover. Click follows the link. On
touch devices (`matchMedia('(hover: none)')`) tapping the word opens the
popover and tapping it again closes it; navigation happens from an
explicit "Open in glossary" link inside the popover. That link is shown on
every device, so hover users also get a visible affordance. Escape,
outside click and scroll-away close it, as now.

Hand-tagging with `<span class="gloss">` keeps working for cases where the
visible wording matches nothing in the matches file.

### Scope

The scanner runs inside `#course-notes` only. Quiz and Paper 2 are
excluded: a definition popover on a quiz stem or a markscheme leaks the
answer, and Paper 2 answers are meant to be read as exemplars, not
studied word by word. References are excluded because they are citations.

Within course notes the scanner skips text inside `a`, `button`, `h1`
to `h4`, `code`, `pre`, `svg`, `label`, `input`, `textarea`, `.gloss`,
`.obj-code`, and anything under `[data-nogloss]`. Learning outcomes
(`.obj-outcome`) are included; they are exactly where the IB vocabulary
appears.

Case-study modals live outside `#course-notes` at z-index 1000. Phase 1
leaves them unlinked. Phase 3 adds `.case-modal-content` to the scan and
raises `.gloss-pop` above 1000.

### One link per section

Each `.obj-section` gets at most one link per term, on its first
occurrence. Sections are the unit readers navigate to from the TOC, so a
reader who jumps to 3.1.6 still meets the link near the top. Linking every
occurrence would colour a tenth of the words on some pages.

### Presentation mode

`presentation.js` clones course-notes nodes into slides. The scanner runs
after `DOMContentLoaded` but slides are built lazily, so clones would
carry `.gloss` anchors. `presentation.css` gets
`.ps-slide .gloss { color: inherit; pointer-events: none; }` so slides
stay plain. Verbatim text is unaffected because wrapping does not change
`textContent`.

## Files to add or change

| File | Change |
|---|---|
| `glossary/glossary-link.js` | Done. Loads `DP_GLOSSARY` and `DP_GLOSSARY_MATCHES`, builds two regexes (case-insensitive and exact) sorted longest-first, reads `data-curr-page` from `body` for the local family, walks text nodes inside `#course-notes`, wraps first occurrence per section per term in an anchor, then calls `glossaryScan()` from `glossary-tip.js`. Sets `data-gloss-links` and `data-gloss-ms` on `#course-notes` for checking. |
| `glossary/glossary-tip.js` | Done. Anchors keep their native focus and href; click follows the link on hover devices. On touch, hover and focus listeners are not bound at all (a tap fires both before click, which toggled the popover shut), so tap opens and tap closes. Popover carries "Open in glossary". |
| `glossary/glossary.css` | Done. Colour-based `.gloss` with `--gloss-bg`, highlighter hover for paper and xbox, underline for gameboy and dos-amber, popover z-index 1100 with a `--gloss` left border. |
| `style.css`, `curriculum/themes.css` | Done. `--gloss` and `--gloss-bg`, 14 themes. |
| `curriculum/presentation.css` | Done. `.ps-overlay .ps-slide-body .gloss` neutralised; it has to come after the slide link rule that underlines every `a`. |
| 24 topic pages | One stylesheet link and four script tags. `a3.1` is wired; the other 23 follow in Phase 3 with one sed pass, since every page ends with the same five script tags. |
| `curriculum/dp/index.html` | The key line, next to the Glossary link. |
| `glossary/index.html` | One sentence explaining the colour. |
| `curriculum/dp/presentmode.md` | Note the `.gloss` rule. |

Load order on a topic page:

```html
<link rel="stylesheet" href="glossary/glossary.css">
...
<script src="glossary/glossary-data.js"></script>
<script src="glossary/glossary-matches.js"></script>
<script src="glossary/glossary-tip.js"></script>
<script src="glossary/glossary-link.js"></script>
```

## Phases

Each phase ends with a check that can fail.

**Phase 0, done.** Matches file and checker. `check-matches.py` exits 0,
and the spot checks in context are clean ("elastic bands", "a persona is
a composite", "fracture clinic", "sewing machine" and "polished model"
were caught and moved to `local` or dropped).

**Phase 1, done.** `--gloss` and `--gloss-bg` in `style.css` and all
theme blocks, `.gloss` rules in `glossary.css`. Verified on `a3.1` in all
14 themes: glossary words distinguishable from plain links and body text
in each. Paper's yellow highlighter and Xbox's black-on-lime blocks both
read well at the density a3.1 produces.

**Phase 2, done.** `glossary-link.js` written, `glossary-tip.js` adapted,
wired into `a3.1` only. Verified:
- 130 links on `a3.1`, identical section by section to
  `check-matches.py --page a3.1` (`--list` prints every linked word);
- none inside `#quiz`, `#paper2`, `#references`, headings, buttons or
  existing links; no `data-gloss="missing"`;
- hover, Tab focus, click-through to the entry, Escape all behave;
- mobile viewport: tap opens, tap again closes, URL unchanged;
- presentation mode: slides show plain text;
- console clean, scan 21 ms.

**Phase 3. Roll out.** Add the stylesheet and script tags to the other 23
pages with one sed pass. Key line on the DP hub. Include case-study modals
in the scan. Verify: open every page once and read the linked words on
the first screen; anything silly goes back into the matches file as a
`local` or a removal, then rerun the checker. Commit the matches file
changes separately so the tuning is visible in history.

**Phase 4, later.** Cross-links inside glossary definitions on the glossary
page. Linking in quiz explanations (shown only after answering) if wanted.
Linking on the hub and unit landing pages.

## Decisions, confirmed 2026-09-14

1. Course notes only.
2. First occurrence per section.
3. Touch: tap opens the popover, navigation is from the "Open in glossary"
   link inside it.
4. Key line lives on the DP hub, not on topic pages.
5. Colour values as in the table, with paper and Xbox as highlighters.
   All values get eyeballed in Phase 1 and may change.
