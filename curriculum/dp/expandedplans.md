# Expanded Plans — DP Design Technology

A brainstorm + tracker for interactive activities, discussion prompts, case studies,
product spotlights, and other features that could be added to each DP topic page,
in the same spirit as the work already done on **A1.1.5** (product spotlights),
**B1.1** (activity generators, persona builder, usability grid — essentially
the whole topic), and **B2.1** (case study cards). Those three are considered
done and are deliberately left off this list.

Nothing here has been added to any topic page yet — this file is notes only.
Tick items off as they get built.

## Existing `/tools` assets not yet linked from any DP page

Aside from `/tools/taskanalysis/` (linked from B1.1.5), none of the tools below
are currently referenced from `curriculum/dp/`. They're called out again under
the topic(s) they best fit, but listing them once here avoids re-discovering
them from scratch later.

- `/tools/AshbyChart/` — Ashby Chart Game (materials, log-log property charts)
- `/tools/craft/` — Infinite Composites (materials combination game)
- `/tools/materialsactivity.html` — Material Selection Game
- `/tools/central-middlezhong-adventure.html` — Material Selection Text Adventure
- `/tools/papers/` — Regulatory Papers, Please (concept → market compliance game; explicitly maps to production, sustainability/green-claims, and human-factors safety testing per its own teacher guide)
- `/tools/tolerance/` — Tolerance Run (manufacturing tolerance / QC accept-reject game)
- `/tools/microprocessors/` — Computer Parts: A History
- `/tools/macropad/` — Macropad Builder (real embedded electronics project, ESP32)
- `/tools/museumgame/` — 2D tech-history museum (Commodore 64, Macintosh 128K, NES, Game Boy, Polaroid OneStep, MakerBot Replicator, Amazon Echo Dot, Windows 95 exhibits)

---

## Topic A — Knowledge & Theory ✅ built

All items below are live on their pages: case studies/spotlights are real card+modal
components with placeholder images (`src=""`) awaiting real photos; items marked
*(planned)* are `.planned-feature` notes only, per the no-code rule — nothing was
coded for those. Discussions use the new `.discussion-box` component.

### A1.1 Ergonomics
*(1.1.5 already has the Xbox Controller / Standing Desk spotlights — skip)*
- [x] **Interactive** (1.1.3) — *(planned)* Percentile lookup tool.
- [x] **Discussion** (1.1.7) — "The Wrong Body": colour-blind signage, presbycusis and alarm pitch, cross-links to A2.1 for the research method that would catch it.
- [x] **Spotlight** (1.1.4) — Added as a third card to the existing 1.1.5 spotlight-grid: "The Aeron's Three Frames" (Herman Miller Aeron, range-of-sizes vs adjustability).

### A2.1 User-centred Research Methods
- [x] **Case study** (2.1.1) — IDEO's Shopping Cart ("The Deep Dive", Nightline 1999).
- [x] **Interactive** (2.1.4) — *(planned)* Match-the-method drag-sort.
- [x] **Feature** (2.1.5) — `topic-link-blurb` cross-link to B1.1's Persona Builder activity (`b1.1-user-centred-design.html#act-1.1.3-a`).

### A2.2 Prototyping Techniques
- [x] **Interactive** (2.2.1) — *(planned)* Fidelity ladder sorter.
- [x] **Case study** (2.2.4) — Dyson's 5,127 Prototypes (expands the one-line mention already in the base text).
- [x] **Interactive** (2.2.3) — *(planned, reclassified from Feature)* Physical vs. CAD compare slider — needs real interactivity, so it got a planned-addition note rather than being built.

### A3.1 Material Classification & Properties
- [x] **Feature** (3.1.1) — `tool-promo-card` → `/tools/materialsactivity.html`.
- [x] **Feature** (3.1.6) — `tool-promo-card` → `/tools/AshbyChart/`.
- [x] **Feature** (3.1.7) — `tool-promo-card` → `/tools/craft/` (Infinite Composites).
- [x] **Spotlight** (3.1.8) — NASA's Shape-Memory Tyre (Nitinol superelastic mesh tyre; picked over the eyeglass-frame/stent angle since those are already covered in the base text).
- [x] **Discussion** (3.1.9) — "Is 'compostable' a lie?" greenwashing prompt.

### A3.2 Structural Systems
- [x] **Interactive** (3.2.7) — *(planned)* Load/equilibrium clicker.
- [x] **Case study** (3.2.4) — Tacoma Narrows Bridge, explicitly correcting the "wind-induced resonance" simplification already stated at 3.2.7 (real cause: aeroelastic flutter).
- [x] **Discussion** (3.2.9) — "How much safety factor is enough?"

### A3.3 Mechanical Systems
- [x] **Interactive** (3.3.1) — *(planned)* Match-the-mechanism drag-match.
- [x] **Spotlight** (3.3.5) — Inside a Salad Spinner (cord/spindle/gear teardown).
- [x] **Discussion/hands-on** (3.3.6) — Physical Lego Technic gear-ratio build, written as a real hands-on activity (no code needed, so not a planned-addition note).

### A3.4 Electronic Systems
- [x] **Spotlight** (3.4.1) — "The IPO Loop, Decades Apart" (Amazon Echo Dot vs. NES), retitled from "Fifty Years Apart" once the actual date gap was checked.
- [x] **Feature** (3.4.6) — `tool-promo-card` → `/tools/macropad/`.
- [x] **Feature** (3.4.13) — `tool-promo-card` → `/tools/microprocessors/`.
- [x] **Discussion** (3.4.3) — Vinyl vs. streaming, extends the existing analogue/digital comparison table into a debate prompt.

### A4.1 Manufacturing Techniques
- [x] **Discussion** (4.1.1) — "Why not just 3D print everything?"
- [x] **Spotlight** (4.1.2) — The MakerBot Replicator, ties directly into the isotropic/anisotropic concept box already on the page.
- [x] **Feature** (4.1.7) — `tool-promo-card` → `/tools/tolerance/`.
- [x] **Case study** (4.1.9) — IKEA's Cam Lock (chose the flat-pack fastener angle over Boeing 787 joining, since it's a cleaner match for the temporary/permanent fastener table right above it).

---

## Topic B — Design & Application ✅ built

*(B1.1 and B2.1 already substantially expanded — skipped.)*

### B2.2 Modelling & Prototyping
- [x] **Interactive** (2.2.4) — *(planned)* FEA stress-heatmap demo note, as scoped.
- [x] **Spotlight** (2.2.5) — "Built to Fail, on Purpose" (SpaceX Starship prototypes), built in place of the planned "prototyping mishaps" gallery — a single strong narrative fit the spotlight card format better than a multi-item gallery.
- [x] **Case study** (2.2.3) — "Airbus's Bionic Partition" (generative-design/FEA-driven redesign), swapped in for the originally suggested F1 front-wing story since it's a cleaner, better-documented CAD/FEA narrative. Reused the same `case-study-grid` component already built for B2.1, per the original plan.

### B3.1 Material Selection
- [x] **Feature** (3.1.1) — `tool-promo-card` → `/tools/AshbyChart/` and `/tools/materialsactivity.html`.
- [x] **Feature** (3.1.3) — `tool-promo-card` → `/tools/papers/`.
- [x] **Interactive/Feature** (3.1.4) — `tool-promo-card` → `/tools/central-middlezhong-adventure.html`.

### B3.2 Structural Systems: Application & Selection
- [x] **Interactive** (3.2.4) — *(planned)* Numeric load simulator note, as scoped.
- [x] **Case study** (3.2.3) — "The Hyatt Regency Walkway Collapse," chosen over a generic crane collapse since the page already covers Quebec Bridge, Tacoma Narrows, and the Genoa Morandi bridge in prose — this needed to be a fourth, distinct failure mode (fabrication-detail/connection failure, not resonance or fatigue).
- [x] **Discussion** (3.2.3) — Tied directly to the Hyatt Regency case (safety-factor/connection-detail trade-off), rather than a separate standalone worked example at 3.2.5 — kept the discussion anchored to the case study it follows.

### B3.3 Mechanical Systems: Application & Selection
- [x] **Interactive** (3.3.1) — *(planned)* Gear/velocity-ratio calculator note, as scoped.
- [x] **Discussion** (3.3.3) — "Chasing the last few percent," extending the page's existing efficiency-loss content rather than repeating it.
- [x] **Spotlight** (3.3.4) — "The Bicycle Derailleur" teardown, as scoped.

### B3.4 Electronic Systems: Application & Selection
- [x] **Interactive** (3.4.3) — *(planned)* Ohm's law / power calculator note, as scoped.
- [x] **Feature** (3.4.2) — `tool-promo-card` → `/tools/macropad/`, placed here as the better "application" home per the original note.
- [x] **Case study** (3.4.6) — "Mapping a Smoke Detector" onto a system diagram, swapped in for the suggested Echo Dot since the Echo Dot teardown was already used at A3.4.

### B4.1 Production Systems
- [x] **Feature** (4.1.1) — `tool-promo-card` → `/tools/papers/`.
- [x] **Interactive** (4.1.3) — *(planned)* Production-system matcher note, as scoped.
- [x] **Discussion** (4.1.3) — "Is mass customisation actually customisation?", critically interrogating the Nike By You/Dell/Invisalign examples the page already names, rather than a separate case study — sharpened from the original "mass customisation case study" framing into a direct discussion prompt.

---

## Topic C — Design, Society & Sustainability ✅ built

### C1.1 Responsibility of the Designer
- [x] **Feature** (1.1.1) — `tool-promo-card` → `/tools/papers/`.
- [x] **Case study** (1.1.2) — "The Therac-25," taking the starker safety-responsibility option over Boeing 737 MAX MCAS, and written carefully given the sensitive subject matter to match the page's existing measured tone around Minamata disease.
- [x] **Discussion** (1.1.3) — Planned-obsolescence debate, using the Apple battery-throttling settlement and printer-cartridge DRM as the concrete examples.

### C1.2 Inclusive Design
- [x] **Case study** (1.2.1) — "The Typewriter" (Pellegrino Turri, 1808), swapped in for OXO Good Grips since 1.2.3 already covers OXO in depth elsewhere on the page — needed a distinct example rather than a duplicate.
- [x] **Discussion** (1.2.3) — "Find the next curb cut," as scoped.
- [x] **Feature** (1.2.3) — `topic-link-blurb` cross-link back to A1.1's anthropometric content, as scoped.

### C1.3 Beyond Usability
- [x] **Interactive** (1.3.1) — *(planned)* Four-pleasure framework card-sort note, as scoped.
- [x] **Case study** (1.3.2) — "ACT in a Retail Space" (Apple Store/Genius Bar), applying the ACT model as scoped.
- [x] **Discussion** (1.3.2) — "Products we love vs. products that just work," paired directly with the ACT case study rather than left standalone.

### C2.1 Design for Sustainability
- [x] **Feature** (2.1.1) — `tool-promo-card` → `/tools/papers/`.
- [x] **Case study** (2.1.2) — "Patagonia's Worn Wear," mapped against Datschefski's five principles as scoped.
- [x] **Interactive** (2.1.3) — *(planned)* Triple Bottom Line scoring-tool note, as scoped.

### C2.2 Circular Economy
- [x] **Interactive** (2.2.1) — *(planned)* Closed-loop diagram-builder note, as scoped.
- [x] **Discussion** (2.2.2) — "Is recycling actually circular, or just a slower line?", building on the page's existing Jevons Paradox content rather than repeating it.
- [x] **Case study** (2.2.4) — "Fairphone," as scoped.

### C3.1 Product Analysis
- [x] **Interactive** (3.1.3) — *(planned)* SWOT quadrant-builder note, as scoped.
- [x] **Spotlight** (3.1.4) — "Teardown: Game Boy vs. Game Gear," expanded from a single-exhibit teardown into a comparative spotlight for a sharper contrast (battery life/cost vs. backlit colour screen trade-off).
- [x] **Discussion** (3.1.6) — "Practise constructive discontent, right now," as scoped.

### C3.2 Life-cycle Analysis
- [x] **Case study** (3.2.1) — "The Reusable Cup Problem," the single-use vs. reusable LCA comparison as scoped.
- [x] **Interactive** (3.2.2) — *(planned)* Cradle-to-grave stage-sorter note, as scoped.
- [x] **Feature** (3.2.2) — `topic-link-blurb` cross-link to C2.2's closed-loop content, as scoped.

### C4.1 Design for Manufacture
- [x] **Feature** (4.1.2) — `tool-promo-card` → `/tools/tolerance/`, as scoped.
- [x] **Interactive** (4.1.3) — *(planned)* Exploded-diagram teardown-challenge note, as scoped.
- [x] **Case study** (4.1.4) — "iFixit's Repairability Score," taking the iFixit angle specifically rather than Fairphone, since Fairphone was already used as the C2.2 case study.

---

## Round 2 — bulk-out pass ✅ done (build-out plans below awaiting review)

Triggered by a review of everything above: replacing the one Musk-business example
that had crept in, bulking out content that read as thin next to the site's
stronger examples, and turning the 17 `.planned-feature` notes into real build
plans (not implementations — planning only, pending review before any of it gets
built).

### Non-negotiable swap
- [x] **B2.2 Spotlight (2.2.5)** — "Built to Fail, on Purpose" (SpaceX Starship) replaced with **"Shaken Apart, on Purpose"** (E-Defense, the full-scale seismic shake-table facility in Miki, Japan). Same card/modal structure, same "deliberately destroy a full-scale prototype to learn from the failure" lesson, no rocketry required. Repo-wide sweep for SpaceX/Tesla/Starlink/Neuralink/other Musk-business examples came back clean otherwise (a few `x\.com`/"musket" regex false-positives, nothing real).

### Bulk-out pass — audit results

Read all 23 pages against a calibration bar set by the strongest existing examples
(Therac-25, Hyatt Regency, Airbus Bionic Partition: card teaser + two ~80–140-word
modal paragraphs each, concrete numbers, a clear takeaway). Result: **every
tracked case study, spotlight, discussion and cross-link across Topics A, B and C
came back solid** — this was a genuinely careful pass, not much to bulk out. Two
real issues turned up, both outside the tracked checklist, both fixed:

- [x] **B3.4 (3.4.6)** — "Mapping a Smoke Detector" case study promised four
  diagram types (matching the block/circuit/logic/flow taxonomy taught earlier on
  the same page) but the modal only ever delivered three, and explicitly said
  "Three completely different pictures", a direct contradiction of its own setup.
  Added the missing logic-diagram paragraph (the alarm-trigger decision as
  AND/OR/NOT gate logic: smoke detected AND NOT hushed, OR test button pressed)
  and fixed the count.
- [x] **A1.1 (spotlight grid, 1.1.5)** — "Adjustable Standing Desks" was a genuine
  unfinished placeholder (`Placeholder description/text to be written`) sitting in
  the same spotlight-grid as the freshly-written Aeron chair card, with real media
  already in place (`A1.1/desk1.png`, `A1.1/desk2.mp4`: an IKEA MITTZON product
  video and IKEA's own dimension diagram) but no copy ever written. Filled in
  using the real spec numbers already visible in `desk1.png` (62–124cm motorised
  height range) and framed as a direct contrast with the neighbouring Aeron card:
  a desk only has to solve one coupled dimension (height), so a motor handles it;
  the Aeron needed three frame sizes because seat depth, armrest width and lumbar
  position don't scale together across a population. Also fixed a malformed
  `<figcaption>` (stray unmatched `</a>` tag) on the same card while in there.

No other placeholder or thin content was found among the tracked items. Three
things came up that are explicitly **out of scope for this round** (pre-existing,
site-wide, not part of the expandedplans.md checklist) — noted here so they don't
get lost, not acted on:
- Every case-study/spotlight modal photo, across every topic, has an empty
  `img src=""` and a literal "Placeholder caption." — images haven't been sourced
  site-wide yet. This is a real project of its own, not a quick fix.
- The "00 Introduction" section on roughly half the DP pages still has the literal
  stub "Overview and teacher commentary will appear here."
- A1.1's other spotlight-grid neighbour, "Xbox Controller Redesign," is fine —
  only the Standing Desk card was actually unfinished.

---

## Suggested build steps — planned interactive features

*(Phases 1–4 ✅ built 2026-07-23 — see "Suggested build order" below. Phase 5
and the Deferred items are still planning only; review before any of those turn
into code.)*

### Decisions locked in (2026-07-23)

A round of questions settled the choices that shape everything below:

- **Scope:** build all 17, phased. Two are deferred to the very end rather than
  dropped — see "Deferred" at the bottom of the per-feature notes.
- **Interaction model:** click/tap to select an item, click/tap a target to place
  it — for every drag-sort feature, full stop. This is now the spec, not a
  recommendation weighed against native drag-and-drop.
- **A1.1 Percentile lookup tool:** proceed now with clearly-labelled illustrative
  data rather than waiting on a sourced table. Its per-feature note below has the
  exact list of real values to go find and swap in later.
- **C4.1 Exploded-diagram teardown challenge:** wasn't part of the original
  question round, but has the same "needs real external data" shape as the
  percentile tool — applying the same proceed-with-placeholder-and-track-sourcing
  pattern here too, with a candidate product proposed below. Flag if this one
  should actually be handled differently.
- **C3.1 SWOT quadrant builder and C2.2 Closed-loop diagram builder:** shelved
  until every other feature on this list is built, then revisited in more detail.
  Both keep their full spec and my proposed simplifications below, neither
  approved nor rejected — just not scheduled yet.

### Definition of done, for any feature below

Replaces the `.planned-feature` block with the working widget · works via
click-to-place on mouse, touch *and* keyboard, not mouse-only · correct/incorrect
feedback reuses the quiz's existing green/red visual language
(`.quiz-option.correct`/`.incorrect`, `--green`/`--green-bg`) · checked live in the
browser preview before being ticked off, not just eyeballed in the editor.

Of the 17 `.planned-feature` notes tracked above, 9 are variations on three reusable
interaction patterns (6 drag-sort + 3 live-calculator). Building each pattern once
as a small shared engine, then re-skinning it per page with that page's own data,
is a lot less work than 17 one-off builds — and keeps the interaction consistent
for students who hit more than one of these across the course. 6 more are closer
to bespoke, one-off builds. The remaining 2 (SWOT, Closed-loop) are deferred —
see the end of the per-feature notes below.

Native HTML5 drag-and-drop was considered and ruled out for every drag-sort item:
it doesn't work on touch devices (iPads/Chromebooks are a realistic chunk of the
audience here) and isn't keyboard-accessible. **Click/tap to select, then click/tap
the target to place it** is the decided interaction for all six drag-sort features
below — no native-drag layer planned on top.

### Shared engines worth building once

**1. Drag-sort-to-category engine** (covers all 6 drag-sort features) — ✅
**built 2026-07-23, all 6 shipped.** A bank of item chips plus a row of
labelled target zones; click an item, click a zone, get immediate
correct/incorrect feedback, plus a short explanation string shown on placement
(mirrors the quiz's per-question feedback). Shared code lives in
`curriculum/drag-sort.js` (`window.DragSort.init({ bankEl, zonesEl, statusEl,
resetBtn, items: [{id, label, correctZone, explanation}], zones: [{id,
label}] })`) plus `.drag-sort*` classes in `curriculum.css`. Two things worth
knowing before wiring up anything else with it:
- **A zone can (and often must) hold more than one correct item.** The first
  version locked a zone after its first correct placement, on the assumption
  every widget would be a strict 1:1 matching game like A2.1's six
  questions/six methods. It isn't — C1.3's four pleasure categories and
  A3.3's five mechanism types each have multiple correct items per zone, and
  the lock silently swallowed every placement after the first into a given
  zone. Caught this by actually running each widget to completion rather than
  spot-checking one placement, fixed by dropping the lock (the `.solved` CSS
  class still applies for the visual dashed→solid-green treatment, it just
  no longer blocks further placements).
- `correctZone` accepts an array instead of a single id, for an item that's
  legitimately correct in more than one zone (C1.3's two ambiguous items).
  The feedback text should explain the overlap, not just confirm it's right.
- The click listener lives on the whole zone card (`.drag-sort-zone-wrap`),
  not just the visible label button — clicking the "Tap here" placeholder
  text below the label needs to work too, and that's a separate sibling
  `<div>` for valid-HTML reasons (a `<button>` can't contain block content
  like the multi-`<p>` solved-state card). Listening on the wrap and relying
  on click-bubbling from the inner button handles this without breaking
  keyboard activation.

**2. Drag-sort-to-order engine** — turned out not to be needed as a separate
mode. A2.2's fidelity ladder is just the category engine with ordered
positions as the zone labels ("1st — lowest fidelity" … "4th — highest") and
each item's one correct position as its `correctZone`. Simpler than building
and maintaining a second interaction mode for one feature.

**Dual-axis mode** (needed for A3.3, not originally counted as its own
numbered engine) — ✅ **built 2026-07-23.** Two independent zone rows; an item
needs both `correctZone` (axis 1) and `correctZone2` (axis 2) matched before
it's fully solved. Getting one right without the other leaves the item in the
bank with a `.partial` marker (a green checkmark prefix) rather than removing
it, so it can be picked up again for the remaining axis. Same
multiple-items-per-zone fix applies here too — e.g. A3.3's "Gear-driven" zone
correctly holds two different products. Config: pass `zonesEl2`/`zones2` to
`DragSort.init` and give items a `correctZone2`; the engine dispatches to
dual-axis mode automatically when `zonesEl2` is present, single-axis
otherwise, so existing single-axis call sites didn't need to change.

**3. Live-calculator engine** (covers 3 features) — ✅ **built 2026-07-23.**
Labelled number inputs, a recompute-on-`input`/`change` handler (no submit
button — this is not the quiz's click-to-check pattern, it updates live), and a
worked-solution readout that shows the substituted formula, not just the
answer, matching the site's existing Paper 2 "show your working" style.
Validation is inline text next to the offending field (e.g. "Must be greater
than 0"), not `alert()`. Shared code lives in `curriculum/live-calc.js`
(formatting, inline field errors, working-steps rendering — deliberately kept
to presentation/interaction only, not formula logic, since Ohm's law's
"solve-for-unknown-given-any-2" shape and the gear calculator's
straightforward forward calculation are different enough that forcing one
formula abstraction over both would've been a worse fit than just sharing the
UI layer) plus new `.live-calc*` classes in `curriculum.css`. Each page's own
`<page>.js` holds that page's formulas/data and wires them to the shared
helpers. Three widgets built on it: B3.4.3 Ohm's law/power calculator, B3.3.1
gear/velocity-ratio calculator (supports up to 3 compound stages), A1.1.3
percentile lookup tool.

None of the "interactive diagram" items (load clicker, stress heatmap, numeric
load simulator) share enough to justify one engine — see the build-order note
below instead, which sequences them so each one's rendering approach can be
reused by the next.

### Suggested build order

Roughly cheapest/most-reusable first, so early sessions bank reusable pieces
before tackling the bespoke ones. 15 active features across 5 phases; SWOT and
Closed-loop are deliberately absent from this list — see "Deferred" below.

1. ✅ **Built (2026-07-23).** Quick wins, first use of the live-calculator engine:
   Ohm's law/power calculator (B3.4), gear/velocity-ratio calculator (B3.3),
   Percentile lookup tool (A1.1). All three are pure input-in, formula-out
   calculators, the simplest possible proof of the engine before anything else
   depends on it.
2. ✅ **Built (2026-07-23).** Drag-sort-to-category engine, first feature: Match
   the method to the question (A2.1) — smallest item/zone count, good first case.
3. ✅ **Built (2026-07-23).** Reused the engine for the rest: Fidelity ladder
   sorter (A2.2, positions-as-zones), Match the mechanism (A3.3, dual-axis mode
   — the actual reference table for mechanism type lives at 3.3.4 further down
   the same page, not 3.3.1 itself; see that feature's note below),
   Production-system matcher (B4.1), Four-pleasure card sort (C1.3, two items
   using the secondary-acceptable-answer array), Cradle-to-grave stage sorter
   (C3.2). Caught and fixed the multi-item-per-zone bug (see engine #1's note
   above) while testing this batch — every widget in this phase, including the
   already-shipped A2.1, was re-verified end to end afterward.
4. ✅ **Built (2026-07-23).** Bespoke, medium complexity: Physical vs. CAD
   compare slider (A2.2), Triple Bottom Line scoring tool (C2.1, an actual SVG
   Venn diagram, not a static image — see its note below), Exploded-diagram
   teardown challenge (C4.1, product confirmed as wireless earbuds, real data
   still needed — see its note below).
5. **Diagram/physics trio, build in this order because each reuses the last one's
   rendering approach:** Stress heatmap demo (B2.2, purely illustrative, no real
   maths per its own spec) → Load and equilibrium clicker (A3.2, qualitative
   stable/unstable check) → Numeric load simulator (B3.2, full reaction + SFD/BMD
   solver — the most complex item on this whole list).

### Per-feature notes

#### A1.1.3 — Percentile lookup tool
**Status:** ✅ Built 2026-07-23. Pattern: live-calculator, lookup variant (pick
inputs, read back a value instead of computing one). Lives in `a1.1.js`; the
`.planned-feature` block at 1.1.3 is replaced with the working `#calc-percentile`
widget, 6 dimensions × 4 populations, illustrative-values flag visible under the
result. Verified in-browser at desktop and mobile widths, no console errors.

Built with clearly-labelled illustrative values ("for teaching purposes only —
not measured data") rather than waiting on a sourced table, per the decision
below. The placeholder mean/SD table actually shipped is the same one recorded
here — **still needs real data**, nothing above has changed on that front:

| Dimension (cm) | Adult male | Adult female | Child (8–12) | Older adult (65+) |
|---|---|---|---|---|
| Standing height (stature) | 175 / 7 | 162 / 6.5 | 140 / 10 | 166 / 8 |
| Seated eye height | 118 / 5 | 109 / 4.5 | 95 / 7 | 112 / 6 |
| Seated elbow height | 24 / 3 | 23 / 3 | 18 / 3 | 23 / 3.5 |
| Standing elbow height | 110 / 5 | 102 / 4.5 | 88 / 7 | 104 / 6 |
| Hand length | 19 / 1.2 | 17.5 / 1 | 15 / 1.5 | 18 / 1.3 |
| Hand breadth | 8.7 / 0.6 | 7.6 / 0.5 | 6.5 / 0.7 | 8 / 0.6 |

(mean / SD, all made up to be plausible-shaped, not measured — this is the
exact table in `a1.1.js`'s `DATA` object right now.) Candidate sources to check
when it's time to replace these with real numbers: Panero & Zelnik's *Human
Dimension & Interior Space*, an open dataset like ANSUR II (US military, skews
the population but is free and well-documented), or a published paediatric
anthropometry table for the child column specifically (military/adult datasets
won't cover it). Whichever is used, cite it inline near the tool once real
numbers go in.

#### A2.1.4 — Match the method to the question
**Status:** ✅ Built 2026-07-23. Pattern: drag-sort-to-category engine, first
use. Lives in `a2.1.js`; 6 questions, one per method (field research / task
analysis / user observation / interviews / surveys-Likert / focus groups),
each scenario reworded from the page's own "Best suited when…" table so it's
unambiguous which method fits. Verified end-to-end in-browser: correct
placement, incorrect placement (flash + stays in bank, retry allowed),
clicking the placeholder text (not just the zone label) after the bug fix
described above, an already-solved zone correctly rejecting a new item, the
completion message's wrong-attempt count, and the reset button — all via both
direct DOM/event testing and live mouse clicks. No console errors.

#### A2.2.1 — Fidelity ladder sorter
**Status:** ✅ Built 2026-07-23. Pattern: drag-sort-to-category engine, ordered
positions used as zones ("1st — lowest fidelity" … "4th — highest") rather
than a separate order-mode engine. Lives in `a2.2.js`; 4 items (pencil sketch
→ cardboard mock-up → 3D-printed shell → working electronic prototype),
explanations tie back to the low/mid/high table already on the page. Verified
full completion in-browser, no console errors.

#### A2.2.3 — Physical vs. CAD compare slider
**Status:** ✅ Built 2026-07-23. Pattern: bespoke (before/after image compare),
built from scratch rather than pulling in a third-party slider library. Lives
in `a2.2.js`; two stacked `<img>`s (both still `src=""` placeholders, matching
the site's existing convention — the matched-photo-pair sourcing problem
noted in the original plan is unchanged, still needs a real product where
both a physical mock-up and its CAD render exist and were photographed
comparably) with a draggable handle clipping the top layer via `clip-path`.
Uses the Pointer Events API (`pointerdown`/`pointermove`/`pointerup`) so mouse
and touch share one code path, plus arrow-key/Home/End keyboard support.
Verified in-browser: dragging, clicking anywhere on the track to jump the
handle, and that a stray pointermove after release no longer moves it. No
console errors.

#### A3.2.7 — Load and equilibrium clicker
**Status:** Phase 5 (second of the diagram trio). Pattern: bespoke interactive
diagram (see build-order note — do this after B2.2's
heatmap so the SVG-redraw approach is already proven). Steps: (1) a simple SVG
beam or truss, (2) click a point on it to place a force, drag or use +/- to set
magnitude, (3) live ΣF/ΣM readout, (4) visual state change (diagram tints or
shows a rotation arrow) when the structure goes unstable, (5) keep the maths
genuinely simple — 2D, single or two applied forces, not a general structural
solver.

#### A3.3.1 — Match the mechanism
**Status:** ✅ Built 2026-07-23. Pattern: drag-sort-to-category engine, dual-axis
mode. Lives in `a3.3.js`; 6 products, each matched against mechanism type
(gear-driven/belt-driven/cam/lever/linkage) AND motion type
(linear/rotary/oscillating/reciprocating), both required. **Content note:**
the original spec named "cam, lever, gear train or linkage" as the mechanism
taxonomy, but that table doesn't actually live at 3.3.1 (which only covers
motion types) — it's at 3.3.4 further down the page ("Identify gear-driven,
belt-driven, cam, lever and linkage systems"), and it's 5 categories, not 4
(belt-driven was missing from the original plan). Used the real 3.3.4 table
and added "belt-driven" as a category; the widget's intro text flags that
3.3.4 covers mechanism types in more depth, since a reader hitting this at
3.3.1 hasn't seen that table yet. Products and their answers were chosen to
reuse the exact examples already named in the page's own opening paragraph
(scissors/lever, bicycle/gear, engine valve/cam, scissor lift-style
linkage/wipers) rather than inventing new ones that might not match later
content. Verified in-browser: partial-progress state (one axis done, one to
go), both axes fully solved, an incorrect placement, and two zones each
correctly holding two different products (gear-driven, oscillating) — see the
engine's multi-item-per-zone note above. No console errors.

#### B2.2.4 — Stress heatmap demo
**Status:** Phase 5 (first of the diagram trio). Pattern: bespoke interactive
diagram, build this one **first** among the
diagram trio — it's explicitly scoped as illustrative only ("without any of the
real underlying maths" per its own note), so it's the cheapest way to prove out
the SVG/canvas redraw-on-click approach the other two diagram items reuse. Steps:
(1) a simple shape (bracket or beam) as SVG, (2) click to place a load, (3) a
canned/interpolated colour gradient radiating from the load point (not a real FEA
solve), (4) explicitly label it as a simplified illustration somewhere in the UI
so students don't mistake it for real analysis.

#### B3.2.4 — Numeric load simulator
**Status:** Phase 5 (last of the diagram trio). Pattern: bespoke interactive
diagram — the most complex item on the list, build
last in the diagram trio once the rendering approach is proven. Steps: (1) inputs
for span, support types, and a point load or UDL, (2) compute support reactions,
(3) draw the free body diagram, (4) plot shear force and bending moment diagrams
live as inputs change, (5) this is real statics, so the maths needs checking
against the worked example already on the page, not just eyeballed.

#### B3.3.1 — Gear/velocity-ratio calculator
**Status:** ✅ Built 2026-07-23. Pattern: live-calculator engine. Lives in
`b3.3.js`; supports up to 3 compound stages (stage 2/3 hidden behind an "add
stage" button), driver/driven size inputs plus optional input speed and
torque, outputs MA/VR/output speed/output torque with working shown. Verified
against the page's own worked example (d₁=100, d₂=300 → MA=3, N₂=100 rpm) and
a 2-stage compound case (overall MA=9) in-browser, no console errors.

#### B3.4.3 — Ohm's law/power calculator
**Status:** ✅ Built 2026-07-23. Pattern: live-calculator engine. Lives in
`b3.4.js`; any 2 of V/I/R/P solve the other 2, with a redundancy check if 3+
fields are filled (flags the odd one out if it doesn't match, rather than
silently ignoring it). Verified against the page's own worked example
(V=12, R=470 → I≈0.026 A, P=0.306 W) in-browser, no console errors.

#### B4.1.3 — Production-system matcher
**Status:** ✅ Built 2026-07-23. Pattern: drag-sort-to-category engine. Lives in
`b4.1.js`; 5 products matched to the page's 5 production-scale categories
(one-off through continuous), including a mass-customisation item (Nike
By You/Dell-style build-to-order laptop) the original 4-example spec had
missed. Verified full completion in-browser, no console errors.

#### C1.3.1 — Four-pleasure card sort
**Status:** ✅ Built 2026-07-23. Pattern: drag-sort-to-category engine,
`correctZone` as an array for the ambiguous items. Lives in `c1.3.js`; 7
product features across the 4 pleasure categories, 2 deliberately ambiguous
(a loyalty badge = socio or psycho; buying ethical trainers to be seen doing
so = socio or ideo), each with explanation text that argues both readings
rather than just confirming correctness. Verified in-browser: an ambiguous
item rejected by an unrelated zone but accepted via its secondary answer (not
just its primary), two different items correctly stacking in the same
physio-pleasure zone, and full completion. No console errors.

#### C2.1.3 — Triple Bottom Line scoring tool
**Status:** ✅ Built 2026-07-23. Pattern: bespoke (sliders feeding a
visualisation). Lives in `c2.1.js`. **Content note:** the page's own "Venn
diagram" isn't an actual element on the page, just prose description plus a
reference-section pointer to search for an external image — so there was
nothing existing to plot a point onto. Built a real inline SVG three-circle
Venn diagram instead: each circle's colour lightness is driven directly by
its slider score (pale near 0, saturated near 10) with `mix-blend-mode:
multiply` so overlaps blend naturally — a weak dimension visibly fails to
"confirm" the centre zone, which demonstrates the page's own point (only the
triple-overlap counts as genuinely sustainable) without needing custom
region-specific paths. Verdict text reuses the page's own three named
conflict scenarios (Profit+Planet-fails-People, etc.) keyed to whichever
dimension scores lowest, with a distinct message when scores tie or when all
three are strong. Three presets (fast-fashion T-shirt, a repaired jacket
echoing this page's own Patagonia case study, small-batch artisan furniture)
plus free adjustment. Verified in-browser: preset loading, manual override
clearing the active preset, the tied-lowest case, a clean single-weak-link
case with correct conflict text, and the all-strong case. No console errors.

#### C3.2.2 — Cradle-to-grave stage sorter
**Status:** ✅ Built 2026-07-23. Pattern: drag-sort-to-category engine. Lives in
`c3.2.js`; a smartphone's lifecycle (matching the page's own "Consumer
electronics" hotspot-table row, not the reusable-cup case study used
elsewhere on the same page, to give a fresh example) across the 5 LCA stages,
with the manufacturing-stage item's explanation explicitly calling back to
the hotspot table's own conclusion that electronics buck the trend (impact
concentrated in manufacturing, not the use phase). Verified in-browser,
including one incorrect placement, no console errors.

#### C4.1.3 — Exploded-diagram teardown challenge
**Status:** ✅ Built 2026-07-23. Pattern: bespoke (guess, then reveal). Lives in
`c4.1.js`; product confirmed as a pair of wireless earbuds (AirPods-style),
per the candidate proposed earlier. **Still needs real sourcing** — the
fastener count (2) and repairability score (1/10) shipped are illustrative
placeholders, clearly flagged in the UI (same amber flag as the percentile
tool), not pulled from an actual iFixit teardown yet. Whoever picks this up:
pull the real numbers from iFixit's actual teardown page for this exact
product and swap them into the `REAL` object in `c4.1.js`.

**Scope note:** since there's no real exploded-diagram photo yet either (same
`src=""` placeholder pattern as everywhere else on the site), "count the
fasteners visible in the diagram" wasn't literally buildable — reframed as a
guess-first, reveal-after estimation exercise instead (guess a number, then
see the real one and why it's often surprising), which doesn't depend on a
real photo to work and arguably fits the "teardowns are surprising" lesson
better anyway. Verified in-browser: an over-guess, an exact-guess, and the
reveal text correctly explaining glued construction as a deliberate DFA/DFD
trade-off (water resistance and thinness over repairability). No console
errors.

### Deferred — revisit after Phase 5

Shelved on 2026-07-23: build everything above first, then come back and work
through these two in more detail. Not dropped, not scheduled — the specs and my
proposed simplifications are kept here so that future conversation has a
starting point instead of starting cold.

#### C2.2.1 — Closed-loop diagram builder
**Status:** Deferred. Pattern: undecided — the spec as written ("drag stages
into a flow diagram and connect them") describes a free-form graph editor, which
is a meaningfully bigger build than anything else on this list (arbitrary node
placement, drawing connector lines, detecting cycles) and is likely
disproportionate to the pedagogical payoff. **Proposed simplification, not yet
approved:** scope it down to a fixed ring of 7 slots
(extract/make/use/dispose/recover/reuse/recycle) that students fill by dragging
labels in; the tool auto-draws arrows between filled slots in the order placed
and simply checks whether the last filled slot loops back to an early one
(closed loop) or dead-ends at "dispose" (still linear). Same pedagogical point,
far less to build — but shelved rather than decided, so this is still open when
we come back to it.

#### C3.1.3 — SWOT quadrant builder
**Status:** Deferred. Pattern: undecided — the spec says students "drag your own
observations" into quadrants, but if the observations are the student's own
words, there's nothing pre-written to drag. **Proposed simplification, not yet
approved:** this is really a lightweight structured note-taker, not a drag-sort:
four labelled lists (Strengths/Weaknesses/Opportunities/Threats), a text input
to add a new note to whichever quadrant is active, and a persistent inline hint
distinguishing internal factors (S/W) from external ones (O/T) since that's
called out as the most common mistake. Still open when we come back to it.
