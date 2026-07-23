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

## Topic B — Design & Application

*(B1.1 and B2.1 already substantially expanded — skipped.)*

### B2.2 Modelling & Prototyping
- [ ] **Interactive** (2.2.4 FEA) — A simplified visual "stress heatmap" demo: click load points on a shape, see a colour-coded result, without real FEA maths.
- [ ] **Feature** — Reuse the existing `case-study-grid`/modal component (already built for B2.1) for a small "prototyping mishaps" gallery (e.g. early iPhone screen-crack testing, rocket static-fire failures).
- [ ] **Case study** — A CAD/FEA-driven redesign story (e.g. an F1 front wing revision cycle).

### B3.1 Material Selection
- [ ] **Feature** (3.1.1–3.1.4) — Add `tool-promo-card` links for all three tools you named: `/tools/AshbyChart/`, `/tools/craft/`, and `/tools/materialsactivity.html`. None are linked from this page yet.
- [ ] **Interactive** (3.1.1–3.1.3) — Link `/tools/central-middlezhong-adventure.html` (Material Selection Text Adventure) — applies selection criteria in a narrative context.
- [ ] **Feature/Case study** (3.1.3/3.1.4) — Link `/tools/papers/`; its material/cost/sustainability trade-off decisions fit the "additional factors" and "justify selection through research" objectives directly.

### B3.2 Structural Systems: Application & Selection
- [ ] **Interactive** (3.2.4) — Numeric version of A3.2's load simulator, with real beam-sizing and force-diagram values.
- [ ] **Case study** (3.2.3) — A documented structural failure/redesign post-mortem (crane collapse, bicycle frame recall).
- [ ] **Discussion** (3.2.5) — Safety-factor cost trade-off worked example.

### B3.3 Mechanical Systems: Application & Selection
- [ ] **Interactive** (3.3.1/3.3.2) — Gear/velocity-ratio calculator: input teeth counts or pulley diameters, get ratio plus the speed/torque trade-off.
- [ ] **Spotlight** (3.3.4) — Bicycle derailleur or car gearbox teardown.
- [ ] **Discussion** (3.3.3) — Why no real machine hits 100% efficiency — friction and heat losses.

### B3.4 Electronic Systems: Application & Selection
- [ ] **Interactive** (3.4.3) — Ohm's law / power mini-calculator (V = IR, P = VI) with a few worked circuit examples.
- [ ] **Feature** (3.4.2/3.4.6) — This is arguably the better home for `/tools/macropad/` than A3.4, since it's the "application" topic — link it here instead or in addition.
- [ ] **Case study** (3.4.5/3.4.6) — A consumer-electronics teardown mapped onto a system diagram (Echo Dot, again via the museum exhibit).

### B4.1 Production Systems
- [ ] **Feature** (4.1.1–4.1.3) — Link `/tools/papers/`; its own documentation explicitly maps to "final production" and "innovation & markets" DP content.
- [ ] **Interactive** (4.1.2/4.1.3) — Production-system matcher: match a product (bespoke furniture, smartphone, soft drink) to job/batch/mass/continuous production.
- [ ] **Discussion** (4.1.4/4.1.6) — Mass customisation case study (Nike By You, print-on-demand).

---

## Topic C — Design, Society & Sustainability

### C1.1 Responsibility of the Designer
- [ ] **Discussion** (1.1.3) — Planned obsolescence debate (battery throttling, printer-cartridge lockouts).
- [ ] **Case study** (1.1.1/1.1.2) — A designer-responsibility failure (Boeing 737 MAX MCAS, or the Therac-25 for a starker safety-responsibility case).
- [ ] **Feature** — Cross-link `/tools/papers/`'s recall/consequence mechanic as a "what happens when responsibility fails" tie-in.

### C1.2 Inclusive Design
- [ ] **Case study** (1.2.1/1.2.3) — OXO Good Grips origin story (arthritis-friendly tool that became a mainstream best-seller — a clean "design for extremes" example).
- [ ] **Discussion** (1.2.3) — The "curb-cut effect": who beyond the original target group benefits from disability-driven design.
- [ ] **Feature** — Cross-link back to A1.1's percentile/anthropometric content.

### C1.3 Beyond Usability
- [ ] **Interactive** (1.3.1) — Four-pleasure framework card sort: sort product features into physio/socio/psycho/ideo pleasure categories.
- [ ] **Case study** (1.3.2) — ACT model applied to a retail store or an app's onboarding flow.
- [ ] **Discussion** — "Products we love vs products that just work" — students bring their own example of each.

### C2.1 Design for Sustainability
- [ ] **Interactive** (2.1.3/2.1.4) — Triple Bottom Line scoring tool: score a chosen product on People/Planet/Profit sliders.
- [ ] **Case study** (2.1.2) — Patagonia's Worn Wear repair programme, mapped against Datschefski's five principles.
- [ ] **Feature** — Link `/tools/papers/`'s FTC Green Guides / green-claim-substantiation content as real-world grounding.

### C2.2 Circular Economy
- [ ] **Interactive** (2.2.1/2.2.2) — Closed-loop diagram builder: drag stages (extract, make, use, recover) into circular vs linear flows.
- [ ] **Case study** (2.2.3/2.2.4) — Fairphone (modular, repairable, recyclable-by-design).
- [ ] **Discussion** (2.2.2) — Is recycling actually circular economy, or just a "less bad" linear economy?

### C3.1 Product Analysis
- [ ] **Interactive** (3.1.3) — SWOT quadrant builder for a chosen product.
- [ ] **Spotlight** (3.1.4) — Guided teardown of a `/tools/museumgame/` exhibit (Game Boy or Polaroid OneStep both teardown well).
- [ ] **Discussion** (3.1.6) — "Constructive discontent": list three things about a daily-use product that mildly annoy you.

### C3.2 Life-cycle Analysis
- [ ] **Interactive** (3.2.2) — Cradle-to-grave stage sorter/timeline builder for a chosen product.
- [ ] **Case study** (3.2.1) — Single-use vs reusable coffee cup LCA comparison (real published data exists for this).
- [ ] **Feature** — Cross-link to C2.2's closed-loop tool — LCA and circular economy pair naturally.

### C4.1 Design for Manufacture
- [ ] **Interactive** (4.1.3/4.1.4) — Exploded-diagram teardown challenge: count fasteners/joints, estimate assembly/disassembly difficulty.
- [ ] **Case study** (4.1.3–4.1.5) — Fairphone again, or an iFixit repairability-score case, for design-for-disassembly.
- [ ] **Feature** (4.1.2) — Link `/tools/tolerance/` here too — DfM strategy connects directly to manufacturing tolerance.
