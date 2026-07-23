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
