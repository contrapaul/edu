# Regulatory Papers, Please — Project Plan

> Working plan for the game at `edu.contrapaul.com/tools/papers`.
> Derived from `Instructions.md`, adapted to this repo's conventions and `CLAUDE.md`.

---

## 0. Decisions (locked)

| Decision | Choice | Why |
|----------|--------|-----|
| **Stack** | Vanilla HTML/CSS/JS, ES modules, no build step | Matches every other tool in `/tools` (see `tools/doot`). No toolchain to maintain. `CLAUDE.md` §2 Simplicity. |
| **Architecture** | Data-driven: engine code is fixed; game *content* lives in plain data files | Lets us author 54 content nodes as data, not code. Makes the late-game sandbox a matter of adding modifiers to data, not rewriting logic. |
| **Sandbox (factories, hiring, shortages, naming, country presence)** | Design the hooks in v1, build the systems later | Keeps v1 shippable. The state model + event pipeline reserve space for modifiers so no rewrite is needed. |
| **First milestone** | Vertical slice — Mina's Smart Speaker, all 6 phases | Proves the whole loop + one mini-game before we scale content. |
| **Libraries** | Prefer none. SVG + CSS for mini-games. Reach for a CDN importmap only if a specific mini-game demands it. | The DooT game uses three.js via importmap; precedent exists but we don't need it. |

**Deviation from `Instructions.md`:** It recommends React + TS + Vite + Firebase. We are *not* using that — it conflicts with the repo. Save/load uses `localStorage`; an optional teacher dashboard can be revisited later as a separate concern.

---

## 1. Architecture overview

```
tools/papers/
  index.html            # shell: title, character select, game container, library modal
  style.css             # game styling (can borrow tokens from /tools/style.css)
  src/
    main.js             # boot, routing between scenes
    state.js            # GameState object, save/load (localStorage), reducers
    engine/
      phases.js         # phase controller — drives the 6-phase loop, generic
      events.js         # email/event queue + modifier pipeline (sandbox hook lives here)
      scoring.js        # scorecard + grade calc
      render.js         # small DOM helpers (no framework)
    minigames/
      emc.js            # EMC spectrum analyzer (flagship, built in slice)
      flammability.js   # (later)
      droptest.js       # (later)
      docverify.js      # Papers-Please document desk (later)
    ui/
      charselect.js
      brief.js          # Phase 1
      design.js         # Phase 2
      testing.js        # Phase 3
      certification.js  # Phase 4
      manufacturing.js  # Phase 5
      launch.js         # Phase 6
      library.js        # Regulatory Library modal
      inbox.js          # email popup system
  content/
    characters.js       # 3 characters + staff
    regulations.js      # shared regulatory library (FCC, CE, RoHS, Prop 65, ...)
    materials.js        # shared material option catalog
    markets.js          # market -> required standards map
    products/
      mina-speaker.js   # one product = data for all 6 phases  ← slice target
      mina-earbuds.js   # (later) ...
    sandbox.js          # (later) modifier definitions — country presence, factories, etc.
```

**Core principle:** `engine/*` never hardcodes a product. It reads a `Product` data object and renders the appropriate phase. Adding a product = adding one file under `content/products/`.

### State shape (v1, with sandbox slots reserved)

```js
GameState = {
  character: 'mina' | 'leo' | 'samira' | null,
  productIndex: 0,
  phase: 'brief'|'design'|'testing'|'certification'|'manufacturing'|'launch',
  budget: Number,
  reputation: Number,
  staffMorale: { [staffId]: Number },
  product: { /* live working copy: selectedMaterials, suppliers, testResults, ... */ },
  unlockedRegulations: [ standardId ],
  inbox: [ Email ],
  competitorProgress: Number,        // 0-100
  // --- sandbox hooks (declared now, inert in v1) ---
  countryPresence: {},               // market -> presence level → speeds processes
  facilities: [],                    // owned factories → cost/time/compliance modifiers
  staffRoster: [],                   // hired staff beyond the scripted three
  worldEvents: [],                   // active global shortages / tensions
  namedProducts: {}                  // player-chosen product names
}
```

### The modifier pipeline (the sandbox seam)

Every cost/time outcome passes through `events.applyModifiers(action, base)`. In v1 this is a pass-through. In the sandbox phase, modifiers (e.g. "factory in Vietnam → −2 days on manufacturing", "global chip shortage → +30% component cost") register here. **This single seam is what makes sandbox additive rather than a rewrite.** Building it now (as a no-op) is the whole point of "design hooks now."

---

## 2. Milestones (manageable chunks)

Each chunk is independently demoable. ✅ = done.

### Chunk 1 — Skeleton & shell  *(small)*
- [ ] `index.html` + `style.css` shell; title screen; routing in `main.js`.
- [ ] `state.js`: GameState, `save()`/`load()` via localStorage, reset.
- [ ] Character select screen (3 desks) wired to set `state.character`.
- **Verify:** Load page → pick Mina → land on an empty Phase 1 screen; refresh restores selection.

### Chunk 2 — Phase engine + Phase 1 (Brief)  *(medium)*  ✅
- [x] `engine/phases.js` generic 6-phase controller (next/prev, gating).
- [x] Persistent HUD: budget, phase indicator, staff panel, competitor bar.
- [x] `content/markets.js`, `content/characters.js` (Mina + staff only for now).
- [x] Phase 1 UI: read brief, select markets (list), allocate budget, set price.
- **Verify:** ✅ USA+EU writes exactly [fcc-15, ul-safety, ce-emc, ce-red, rohs, weee]; budget over/under guard + advance + reload-resume all confirmed.

### Chunk 3 — Phase 2 (Design)  *(medium)*  ✅
- [x] `content/materials.js` catalog with trade-off properties.
- [x] Material selection, supplier sourcing, manufacturing process pick.
- [x] Generate "Preliminary Technical File" summary object (with `riskFlags` for later phases).
- **Verify:** ✅ ABS → flammability risk; ABS×CNC incompatibility blocks generation; bad critical-PSU supplier risk flows into technicalFile; choices persist across reload.

### Chunk 4 — Phase 3 (Testing) + EMC mini-game  *(large — flagship)*  ✅
- [x] `minigames/emc.js`: SVG spectrum analyzer, limit line, clickable peaks, click-to-apply fixes (ferrite/shield/filter), limited fix budget.
- [x] Test running + budget deduction; auto-resolved tests (flammability/mechanical/chemical) from design; results feed `product.testResults`.
- **Verify:** ✅ EMC winnable (3 correct fixes → PASS, score 85) and losable (wrong fixes exhaust budget → FAIL); cheap PSU worsens the switching peak (+4 dB); ABS auto-fails flammability; budget + HUD sync.

### Chunk 5 — Phase 4 (Certification)  *(large)*  ✅
- [x] `minigames/docverify.js`: Papers-Please document desk, file-vs-form rows, correct/argue resolution, stamps.
- [x] Dynamic discrepancies derived from design/test choices (bad PSU → cert gap, skipped/failed EMC, flammability fail).
- [x] Correspondence with paid Gunther "Translate" + right/wrong responses.
- **Verify:** ✅ Discrepancies block submission until resolved; arguing a real error → REJECTED + reputation −8; arguing a tolerance case → accepted; correct charges budget; translate −$200; wrong letter response penalizes & retries, correct grants → manufacturing.

### Chunk 6 — Phases 5 & 6 (Manufacturing + Launch)  *(medium)*  ✅
- [x] Factory pick (cost/speed/compliance), first-article inspection scoring, mark placement validated against markets.
- [x] Launch sales model, conditional field issues, scorecard + letter grade, completion screen.
- [x] `engine/scoring.js` (isolated, tunable metrics + sales model).
- **Verify:** ✅ Full Smart Speaker playthrough start→grade. Good run → B+ (82), profit $1.17M, no field issue. Bad PSU → burning-smell field issue; ignore → reputation −10, satisfaction −20, grade B−. Mark validation blocks missing + false marks; slow factory advances competitor; inspection mis-judgment surfaces at launch. **Vertical slice closed.**

### Chunk 7 — Supporting systems  *(medium)*  ✅
- [x] `ui/inbox.js` email system (per-phase enqueue, unread badge, mark-read) + humor emails across all phases.
- [x] `ui/library.js` Regulatory Library modal + `content/regulations.js`; unlocks on market selection.
- [x] `engine/events.js`: morale helpers + the inert `applyModifiers` sandbox seam (ready for Chunk 9).
- **Verify:** ✅ Library badge 0→6 as USA+EU markets picked; 6 entries render; phase emails arrive (brief 2, design 2…), opening inbox clears badge; premium suppliers raise Gunther 70→82 → translation becomes FREE (no budget deducted).

### Chunk 8 — Content expansion  *(large, parallelizable)*  ✅ (flammability mini-game deferred as optional)
**Engine generalization (done — unblocks all remaining products):**
- [x] Made design/testing/certification/scoring/launch fully product-agnostic (no hardcoded `enclosure`/`psu`/`emc`); component slots, tolerance checks, test-report discrepancies, and field issues all derive from product data.
- [x] Product-progression flow: finishing a product unlocks the next with reinvested budget; "company complete" screen when the line ends.
- [x] Drop-test mini-game (`minigames/droptest.js`) + generic interactive-test launcher + battery auto-test.

**Products:**
- [x] Mina P1 — Smart Speaker (Chunks 2–7).
- [x] Mina P2 — **LuminaBuds** (battery + drop test), verified incl. progression from P1.
- [x] Mina P3 — **LumiGlow Smart Lamp** (bespoke optical/IEC 62471 test), verified start→company-complete. **Mina's line done.**
- [x] Engine: products can define a bespoke `test.resolve(p, def)` for custom auto-tests (no engine edit per product).
- [x] **Role-based morale**: staff carry `disposition` (shortcut/compliance/neutral) + `translator`; design morale + free-translate now work for any character. Verified with Leo (Elena/Sarah).
- [x] Leo P1 — **Aero Micro Drone** (EMC + drop test, toy safety, LiPo); translator = Sarah.
- [x] Leo P2 — **Storm RC Racing Car** (EMC + bespoke EU speed-limit test, phthalates), verified incl. speed FAIL → cert.
- [x] Leo P3 — **SkyView Camera Drone** (EMC + drop test + bespoke GDPR privacy test, Remote ID marks), verified start→company-complete (grade A). **Leo's line done.**
- [x] Samira path — **Composter** (EMC + bespoke food-contact & electrical), **EverFlask Bottle** (non-electronic: drop test + bespoke leaching & insulation-claim), **SolChef Cooker** (non-electronic: drop test + bespoke food-safe-temp & FTC green-claims). All verified start→company-complete; translator = Dr. Okeke.
- [x] `markets.js` + `regulations.js` extended with food-contact (FDA 21 CFR, EC 1935/2004, GB 4806) and green-claims (FTC Green Guides, EU Green Claims) standards.
- [ ] Flammability mini-game — deferred (optional; mechanical/flammability auto-resolve).
- **Verify:** ✅ **All 9 products** (3×3) completable end-to-end. Non-electronic products correctly get food-contact-only standards (no EMC). Bespoke tests (optical / speed / GDPR / food-contact / leaching / insulation / food-temp / green-claims) all fail on the wrong choice and flow into certification. Role-based morale + translator confirmed for all three characters.

> Dev note: added `serve_nocache.py` + `edu-nocache` launch config (port 5501) — the plain `http.server` lets browsers cache ES modules, hiding edits during verification.

> Note: staff-morale effects in `design.js`/`certification.js` reference Mina's staff by id (`priya`/`gunther`); for Leo/Samira they no-op safely. Re-key by staff *role* when building those paths.

### Chunk 9 — Sandbox layer  *(separate phase)*  ✅
- [x] `applyModifiers` activated: routes `test-cost`/`cert-fee`/`factory-setup` through the seam; modifiers stack multiplicatively.
- [x] `content/sandbox.js` + `ui/sandbox.js` Operations panel (HUD 🌐 button).
- [x] Facilities (open-a-factory → cheaper setup + competitor relief), hires (cheaper corrections/tests), world events (shortage/tariffs raise costs).
- [x] Product naming (HUD + persisted in `namedProducts`).
- **Verify:** ✅ Chip shortage raised EMC fee $2,500→$3,250 (×1.3, ▲); shortage+hire stacked to $2,925; facility halved factory-setup ($20k→$10k) and relieved competitor; cert-fee 2000→1680 (shortage×1.2 × hire×0.7); product renamed live in HUD. **Seam proven — only cost values were wrapped, no phase logic restructured.**

### Chunk 10 — Polish & integration  *(medium)*  ✅
- [x] Linked from `tools/index.html` — fixed the `cs-papers` card's broken href (was `innovation-models.html`) → `/tools/papers/`, refreshed the description.
- [x] Accessibility: ✓/✕ glyphs + screen-reader labels on EMC & drop-test (colourblind-safe), `:focus-visible` outlines, Escape-to-close + focus on modals, aria-labels on icon HUD buttons.
- [x] Mobile responsiveness: fixed grid blowout (HUD min-content) — 0 px horizontal overflow at 375 px across title/charselect/brief/testing; EMC modal SVG fits (270 px); single-column phases ≤560 px.
- [x] Teacher companion: `TEACHER_GUIDE.md` (curriculum mapping, lesson flow, assessment ideas).
- [ ] SME content review — external/human task; regulations modelled faithfully but should be spot-checked by a subject expert before classroom use.
- **Verify:** ✅ Card → game loads; glyphs render ✕✕✕✓ with per-peak aria-labels; Escape closes modals; 375 px overflow = 0; clean console.

### Chunk 11 — "Real time" feel: ambient interrupts + explained choices  ✅
- [x] `ui/popup.js`: generic docked-portrait + speech-bubble component. The portrait is a colored circle + initial today — this is the seam for the student illustrator's art (swap the `<span>` for an `<img>`, no layout change needed). Reusable beyond notifications (staff barks, audits, etc.) later.
- [x] `content/notifications.js` + `engine/notify.js`: a pool of interactive mid-development notifications (partner/bundle offers, fan & influencer asks, shady offers to turn down — bribes, fake reviews, knockoff licensing) that interrupt whatever phase the player is on, not just phase transitions. Each fires at most once per game, spaced by a cooldown (`state.lastNotifyDay`) and gated by day-eligibility (`minDay`), so it reads as ambient rather than a spam wall. Every notification always has a free "decline" choice — nothing is a trap.
- [x] Wired into `engine/phases.js`: `maybeTrigger` runs on phase entry (`paint`) and after any HUD-affecting action (`repaintHud`, which every phase module already calls via `ctx.refreshHud`) — no changes needed to individual phase UIs.
- [x] HUD budget/clock numbers animate (count up/down + a brief color flash) instead of snapping between values, so time/money read as continuously ticking rather than a lump-sum jump on "advance."
- [x] `ui/testing.js`: each test card now shows "Why it matters" / "If you skip it" — a shared `TEST_NOTES` map by test id, overridable per-test via `why`/`skipNote` fields on the content data — so Running a test (or not) reads as an informed trade-off instead of a mandatory click.
- **Verify:** ✅ Automated Playwright run: brief→design transition fired the "Northline bundle" popup with 3 real choices; picking "Sign the bundle deal" animated the HUD budget $143,000→$141,500 with the cost flash. A second, unrelated notification (school sponsorship ask) fired independently on entering the Testing phase, confirming interrupts aren't tied to one transition. All 4 Testing test cards render distinct why/skip text.
- **Not done (future work):** the 7 notification templates are generic across all 9 products/3 characters rather than bespoke per product — a natural place to add more voice once the illustrator's character art exists. Bespoke test ids (speed, GDPR, food-contact, etc. from Chunk 8) fall back to the generic engine text unless a product author adds its own `why`/`skipNote`.

---

## 3. Content authoring template

One product = one data file exporting all six phases' content. Lets writing happen in parallel with engine work and keeps `Instructions.md`'s 54-node matrix as *data*:

```js
export default {
  id: 'mina-speaker',
  name: 'Lumina Smart Speaker',
  difficulty: 2,
  components: [ /* enclosure, amp, PSU, wifi... each with materialOptions */ ],
  availableMarkets: ['USA','EU','China','Japan','Australia'],
  phases: {
    brief:        { memo, marketingGag, budgetDefault, ... },
    design:       { componentChoices, steveSuggestion, ... },
    testing:      { availableTests, minigame: 'emc', failNarratives, ... },
    certification:{ requiredDocs, discrepancies, correspondence, ... },
    manufacturing:{ factories, firstArticleIssues, requiredMarks, ... },
    launch:       { salesModel, fieldIssues, ... }
  }
}
```

---

## 4. Open questions / risks
- **Mini-game scope creep** — each mini-game is a mini-project. Build EMC fully first (Chunk 4) as the template; keep later ones to the same SVG+DOM budget.
- **Content volume (~40–60k words)** — engine must be done enough that writing is pure data entry before Chunk 8. Consider drafting content separately.
- **Regulatory accuracy** — real standard numbers are an asset; keep a `content/regulations.js` single source of truth and have an SME spot-check before launch.
- **Scoring balance** — needs playtesting; isolate all tunable numbers in data, not engine.

---

## 5. Immediate next step
Build **Chunk 1** (shell + state + character select). It's small, establishes the file structure above, and gives an interactive thing to click within one session.
```
```
