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

*(Planning only. Nothing in this section has been built. Review before any of it turns into code.)*

Of the 17 `.planned-feature` notes tracked above, 11 are variations on three reusable
interaction patterns. Building each pattern once as a small shared engine, then
re-skinning it per page with that page's own data, is a lot less work than 17
one-off builds — and keeps the interaction consistent for students who hit more
than one of these across the course. The other 6 are closer to bespoke.

A general note on drag-and-drop: several of these are specced as "drag X onto Y."
Native HTML5 drag-and-drop is a poor fit for a classroom site — it doesn't work on
touch devices (iPads/Chromebooks are a realistic chunk of the audience here) and
isn't keyboard-accessible. The recommendation below for every drag-sort item is
**click/tap to select, then click/tap the target to place it**, with correct/incorrect
feedback reusing the same visual language the quiz already has
(`.quiz-option.correct` / `.incorrect`, green/red via the existing `--green`/`--green-bg`
tokens). Native drag can be layered on top later as a mouse-only nice-to-have; it
shouldn't be the only way to use the tool.

### Shared engines worth building once

**1. Drag-sort-to-category engine** (covers 5 features): a bank of item chips plus a
row of labelled target zones; click an item, click a zone, get immediate
correct/incorrect feedback per item, plus a short explanation string shown on
placement (mirrors the quiz's per-question feedback). Needs one config object per
page: `{ items: [{label, correctZone, explanation}], zones: [{id, label}] }`.
Everything else — markup, click handling, feedback rendering — is shared. A "dual
bucket" mode (place an item into two categorisations at once, needed for A3.3) is
the one variant: two zone rows instead of one, both must be correct.

**2. Drag-sort-to-order engine** (covers 1 feature, A2.2): same click-to-place
interaction, but zones are ordered slots (1st, 2nd, 3rd...) instead of labelled
categories, and checking compares the whole sequence rather than per-item.
Small enough it could be a mode on engine #1 rather than a separate script.

**3. Live-calculator engine** (covers 3 features): labelled number inputs, a
recompute-on-`input` handler (no submit button — this is not the quiz's
click-to-check pattern, it should update live), and a worked-solution readout
that shows the substituted formula, not just the answer, matching the site's
existing Paper 2 "show your working" style. Validation is inline text next to the
offending field (e.g. "R can't be 0"), not `alert()` — `alert()` is fine for the
quiz's one-time "answer everything first" nudge but would be unusable firing on
every keystroke here.

None of the "interactive diagram" items (load clicker, stress heatmap, numeric
load simulator) share enough to justify one engine — see the build-order note
below instead, which sequences them so each one's rendering approach can be
reused by the next.

### Suggested build order

Roughly cheapest/most-reusable first, so early sessions bank reusable pieces
before tackling the bespoke ones:

1. **Quick wins, no shared engine needed:** Ohm's law/power calculator (B3.4),
   gear/velocity-ratio calculator (B3.3). Pure algebra rearrangement, good first
   use of the live-calculator engine.
2. **Build drag-sort-to-category engine, ship its first feature:** Match the
   method to the question (A2.1) — smallest item/zone count, good first case.
3. **Reuse the engine for the rest:** Fidelity ladder sorter (A2.2, order mode),
   Match the mechanism (A3.3, dual-bucket mode), Production-system matcher (B4.1),
   Four-pleasure card sort (C1.3), Cradle-to-grave stage sorter (C3.2).
4. **Bespoke, medium complexity:** Physical vs. CAD compare slider (A2.2), Triple
   Bottom Line scoring tool (C2.1).
5. **Diagram/physics trio, build in this order because each reuses the last one's
   rendering approach:** Stress heatmap demo (B2.2, purely illustrative, no real
   maths per its own spec) → Load and equilibrium clicker (A3.2, qualitative
   stable/unstable check) → Numeric load simulator (B3.2, full reaction + SFD/BMD
   solver — the most complex item on this whole list).
6. **Needs a scope or sourcing decision before it can be built at all** (see
   individual notes): Percentile lookup tool (A1.1), SWOT quadrant builder (C3.1),
   Exploded-diagram teardown challenge (C4.1), Closed-loop diagram builder (C2.2).

### Per-feature notes

#### A1.1.3 — Percentile lookup tool
Pattern: live-calculator, lookup variant (pick inputs, read back a value instead
of computing one). **Open question before this can be built:** the tool needs a
real anthropometric dataset (dimension × population × percentile → value). Needs
a decision on source — a citable published table (e.g. Panero & Zelnik, or an
open dataset like ANSUR II) versus clearly-labelled illustrative values for
teaching purposes only. Steps once that's settled: (1) get the data into a small
JS lookup object or JSON file, (2) three dropdowns — dimension, population,
percentile, (3) render the looked-up value plus a one-line "what this means"
sentence, (4) cite the source inline near the tool.

#### A2.1.4 — Match the method to the question
Pattern: drag-sort-to-category engine, first use. Steps: (1) write 6–8 research
questions with one correct method each (field research / task analysis /
observation / interviews / surveys / focus group), (2) short explanation string
per question for the feedback state, (3) wire into the shared engine, (4) replace
the `.planned-feature` block at 2.1.4 with the built widget.

#### A2.2.1 — Fidelity ladder sorter
Pattern: drag-sort-to-order engine. Steps: (1) four prototype photos already
implied by the spec (sketch, cardboard mock-up, 3D-printed shell, working
electronic prototype) — needs real or representative photos, not stock, (2)
correct order is fixed (low→high fidelity), (3) wire into the order-mode engine,
(4) on success, echo back the fidelity table already on the page so the tool
reinforces rather than duplicates it.

#### A2.2.3 — Physical vs. CAD compare slider
Pattern: bespoke (before/after image compare). This is a well-known UI pattern —
a container with two stacked images and a draggable vertical handle that clips
one image via `clip-path`/width. Build from scratch rather than pulling in a
third-party slider library, consistent with the site having no build step or
dependencies. Steps: (1) source a matched pair of photos (an early physical
mock-up and its CAD render of the *same* product/feature — this pairing is the
hard part, needs a product where both exist and were photographed comparably),
(2) two stacked `<img>`s + draggable handle, (3) touch + mouse + keyboard
(arrow-key nudge) support on the handle.

#### A3.2.7 — Load and equilibrium clicker
Pattern: bespoke interactive diagram (see build-order note — do this after B2.2's
heatmap so the SVG-redraw approach is already proven). Steps: (1) a simple SVG
beam or truss, (2) click a point on it to place a force, drag or use +/- to set
magnitude, (3) live ΣF/ΣM readout, (4) visual state change (diagram tints or
shows a rotation arrow) when the structure goes unstable, (5) keep the maths
genuinely simple — 2D, single or two applied forces, not a general structural
solver.

#### A3.3.1 — Match the mechanism
Pattern: drag-sort-to-category engine, dual-bucket mode. Steps: (1) 4–6 real
products (can opener, umbrella, bicycle derailleur, sewing machine, etc.), each
with a correct mechanism type (cam/lever/gear train/linkage) AND a correct motion
conversion — two correct answers per item, (2) needs the dual-zone-row variant of
the engine, (3) explanation string per item covering both parts.

#### B2.2.4 — Stress heatmap demo
Pattern: bespoke interactive diagram, but build this one **first** among the
diagram trio — it's explicitly scoped as illustrative only ("without any of the
real underlying maths" per its own note), so it's the cheapest way to prove out
the SVG/canvas redraw-on-click approach the other two diagram items reuse. Steps:
(1) a simple shape (bracket or beam) as SVG, (2) click to place a load, (3) a
canned/interpolated colour gradient radiating from the load point (not a real FEA
solve), (4) explicitly label it as a simplified illustration somewhere in the UI
so students don't mistake it for real analysis.

#### B3.2.4 — Numeric load simulator
Pattern: bespoke interactive diagram — the most complex item on the list, build
last in the diagram trio once the rendering approach is proven. Steps: (1) inputs
for span, support types, and a point load or UDL, (2) compute support reactions,
(3) draw the free body diagram, (4) plot shear force and bending moment diagrams
live as inputs change, (5) this is real statics, so the maths needs checking
against the worked example already on the page, not just eyeballed.

#### B3.3.1 — Gear/velocity-ratio calculator
Pattern: live-calculator engine. Steps: (1) inputs for teeth counts or pulley
diameters, supports simple or compound drives, (2) compute MA, VR, output
speed/torque, (3) show the substituted formula as working, matching the worked
example already on the page.

#### B3.4.3 — Ohm's law/power calculator
Pattern: live-calculator engine. Steps: (1) inputs for any two of V/I/R (plus P
where relevant), (2) rearrange and solve for the rest, (3) show step-by-step
working, not just the answer.

#### B4.1.3 — Production-system matcher
Pattern: drag-sort-to-category engine. Steps: (1) 4–6 product+volume pairs
(bespoke wedding dress, limited sneaker drop, family car, crude oil, etc.), each
with a correct production system/scale, (2) explanation string per item
referencing the table already on the page.

#### C1.3.1 — Four-pleasure card sort
Pattern: drag-sort-to-category engine, with a wrinkle: the spec explicitly wants
"immediate feedback on borderline cases that arguably belong to more than one"
category. Steps: (1) 6–8 concrete product features, most with one clearly correct
pleasure category (physio/socio/psycho/ideo), 1–2 deliberately ambiguous ones,
(2) the engine needs a "secondary acceptable answer" field so an ambiguous item
can register as correct either way, with feedback text explaining the overlap
rather than just marking it right or wrong.

#### C2.1.3 — Triple Bottom Line scoring tool
Pattern: bespoke (sliders feeding a visualisation). Steps: (1) three sliders —
People/Planet/Profit, (2) plot the resulting point on the existing Venn diagram
(or a simplified ternary/triangle plot if the Venn doesn't translate well to a
single point), (3) a short generated sentence naming whichever dimension scored
lowest as "the dimension this trades away," (4) needs 2–3 pre-set example
products students can load as starting points, not just a blank slider.

#### C2.2.1 — Closed-loop diagram builder
Pattern: needs a scope decision — the spec as written ("drag stages into a flow
diagram and connect them") describes a free-form graph editor, which is a
meaningfully bigger build than anything else on this list (arbitrary node
placement, drawing connector lines, detecting cycles) and is likely
disproportionate to the pedagogical payoff. **Recommendation:** scope it down to
a fixed ring of 7 slots (extract/make/use/dispose/recover/reuse/recycle) that
students fill by dragging labels in; the tool auto-draws arrows between filled
slots in the order placed and simply checks whether the last filled slot loops
back to an early one (closed loop) or dead-ends at "dispose" (still linear). Same
pedagogical point, far less to build. Flagging this for a decision before
starting rather than assuming the scoped-down version is fine.

#### C3.1.3 — SWOT quadrant builder
Pattern: needs a scope decision — the spec says students "drag your own
observations" into quadrants, but if the observations are the student's own
words, there's nothing pre-written to drag. **Recommendation:** this is really a
lightweight structured note-taker, not a drag-sort: four labelled lists
(Strengths/Weaknesses/Opportunities/Threats), a text input to add a new note to
whichever quadrant is active, and a persistent inline hint distinguishing
internal factors (S/W) from external ones (O/T) since that's called out as the
most common mistake. Flagging the pattern mismatch for a decision before
starting.

#### C3.2.2 — Cradle-to-grave stage sorter
Pattern: drag-sort-to-category engine. Steps: (1) a jumbled list of activities
and impacts for one chosen product (needs picking a specific product with real
hotspot data, ideally one already used elsewhere on the page), (2) 5 zones
(pre-production/production/distribution/utilisation/disposal), (3) on completion,
compare against the hotspot data already on the page so the reveal reinforces
that content rather than repeating it.

#### C4.1.3 — Exploded-diagram teardown challenge
Pattern: bespoke (view + estimate + reveal), lowest priority of the six
scope/sourcing items. **Needs sourcing:** a real exploded-diagram photo of a
specific product with a known, defensible fastener count and joint-type
breakdown, plus reference assembly/disassembly-difficulty scores to check against
(e.g. an iFixit teardown could supply real numbers, similar to how C4.1's own
case study already uses iFixit). Steps once a product is picked: (1) show the
diagram, (2) inputs for fastener count and difficulty estimate, (3) reveal
compares against the sourced answer with a brief explanation of what was missed.
