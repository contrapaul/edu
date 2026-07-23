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

## Topic A — Knowledge & Theory

### A1.1 Ergonomics
*(1.1.5 already has the Xbox Controller / Standing Desk spotlights — skip)*
- [ ] **Interactive** (1.1.2/1.1.3) — Percentile lookup tool: pick a body dimension, a population, and a target percentile (5th/50th/95th), and read back a realistic value. Turns the abstract "design to 5th or 95th %ile" rule into something students can actually query.
- [ ] **Discussion** (1.1.6/1.1.7) — "The Wrong Body": show a product designed around the wrong sensory/physiological assumption (colour-blind-unfriendly signage, an alarm pitched above older adults' hearing range) and have students diagnose the failure.
- [ ] **Spotlight** (1.1.4) — Adjustable office chair (e.g. Aeron) as a second spotlight alongside the existing controller/desk pair — adjustability vs range-of-sizes, a natural partner to the standing desk spotlight already in progress.

### A2.1 User-centred Research Methods
- [ ] **Case study** (2.1.1–2.1.3) — IDEO's shopping cart redesign (classic, well-documented UCD process video/case).
- [ ] **Interactive** (2.1.4) — "Match the method to the question" drag-sort: given a research question, choose field research vs interview vs questionnaire vs focus group.
- [ ] **Feature** (2.1.5) — Don't rebuild a persona tool here — cross-link forward to B1.1's existing Persona Builder activity once a student reaches this point.

### A2.2 Prototyping Techniques
- [ ] **Interactive** (2.2.1) — Fidelity ladder sorter: drag prototype photos (sketch → foam model → 3D print → functional prototype) into low-to-high fidelity order.
- [ ] **Case study** (2.2.3/2.2.4) — Dyson's 5,127-prototype vacuum story, for physical iterative prototyping.
- [ ] **Feature** — Simple before/after image-compare slider contrasting an early physical mock-up with a CAD render of the same product.

### A3.1 Material Classification & Properties
- [ ] **Feature** (3.1.1–3.1.6) — Link `/tools/AshbyChart/` and `/tools/materialsactivity.html` in with a `tool-promo-card` (same pattern as B1.1's task-analysis link-out).
- [ ] **Feature** (3.1.7 Composites) — Link `/tools/craft/` (Infinite Composites).
- [ ] **Spotlight** (3.1.8 Smart materials) — Shape-memory alloy example (NASA Mars rover wheel, or self-adjusting eyeglass frames).
- [ ] **Discussion** (3.1.9) — "Compostable" plastic greenwashing: what "biodegradable" actually requires vs marketing claims.

### A3.2 Structural Systems
- [ ] **Interactive** (3.2.4/3.2.7) — Simple load/equilibrium clicker: apply a force to a beam or truss shape and see whether it stays in equilibrium or fails.
- [ ] **Case study** (3.2.4) — Tacoma Narrows Bridge collapse (dynamic/resonant forces).
- [ ] **Discussion** (3.2.9/3.2.10) — How much safety factor is "enough"? Cost-vs-risk discussion anchored to a real product recall.

### A3.3 Mechanical Systems
- [ ] **Interactive** (3.3.1–3.3.5) — Drag-match mechanism type (cam, lever, gear, linkage) to the real product that uses it (can opener, umbrella, bike derailleur).
- [ ] **Spotlight** (3.3.5) — Teardown of a wind-up toy or salad spinner, showing several motion types combined in one product.
- [ ] **Discussion/hands-on** — Physical Lego Technic gear-ratio build as an in-class supplement.

### A3.4 Electronic Systems
- [ ] **Spotlight** (3.4.1, 3.4.7–3.4.11) — Reuse `/tools/museumgame/` exhibits (Echo Dot as input–process–output–feedback; C64/NES as analogue-vs-digital era markers).
- [ ] **Feature** (3.4.6/3.4.13/3.4.14) — Link `/tools/macropad/` for a real embedded-systems/circuit project.
- [ ] **Discussion** (3.4.3/3.4.4) — Analogue vs digital signal quality: vinyl vs streaming debate.
- [ ] **Feature** — Link `/tools/microprocessors/` (Computer Parts: A History) as further reading for the digital-systems subtopics.

### A4.1 Manufacturing Techniques
- [ ] **Feature** (4.1.7/4.1.10) — Link `/tools/tolerance/` (Tolerance Run) for finishing/QC tolerance content.
- [ ] **Spotlight** (4.1.2–4.1.6) — MakerBot Replicator, already an exhibit in `/tools/museumgame/`, as an additive-manufacturing spotlight.
- [ ] **Case study** (4.1.9 Joining) — IKEA flat-pack fastener systems, or Boeing 787 composite fuselage joining.
- [ ] **Discussion** — "Why not just 3D print everything?" additive vs subtractive vs forming trade-offs.

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
