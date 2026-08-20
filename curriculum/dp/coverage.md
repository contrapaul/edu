# Curriculum Coverage Assessment

Cross-references each HTML page's content against the corresponding source markdown file to judge whether the website material is comprehensive enough to stand alone in place of the textbook, sub-point by sub-point.

**Scope of this file (as of 20 Aug 2026):** sub-points assessed ✅ Comprehensive have been removed. What remains is the open work: 46 ⚠️ and 10 ❌ sub-points, every one of them re-checked against the live HTML on 20 Aug 2026. Outstanding image and asset requests for *all* sub-points, including the completed ones, are collected at the end under [Outstanding graphics and assets](#outstanding-graphics-and-assets).

**Legend**
- ⚠️ **Adequate but thin** — the core concept is present and teachable, but specific facts, examples, or sub-points from the MD are missing.
- ❌ **Needs expansion** — a meaningful chunk of MD content (a whole example category, a sub-concept, a named model/tool) has no equivalent anywhere on the page.

**Note on A3/B3:** those markdown files had equations, tables, and figures stripped out during conversion, which sometimes leaves the *markdown* reading as incomplete, confusing, or interrupted. Where that's the case, it's flagged as an MD limitation and the HTML is judged on its own merits rather than penalized against a broken baseline.

**Revision passes completed** (ESL readability rewrite + text-gap closure, in the order they were done): **A2.1**, **B1.1**, **A1.1**. Each of these is now ✅ across every sub-point, with only image/graphic requests outstanding. Pages not on this list have not yet had a readability pass.

**Fully covered, no open text gaps:** A1.1 (7/7), A2.1 (5/5), B1.1 (5/5), C1.2 (3/3), C1.3 (2/2), C2.1 (4/4).

---

## A2 — Design Methodologies: User-Centred Research & Prototyping

### A2.2 Prototyping Techniques — [a2.2-prototyping-techniques.html](a2.2-prototyping-techniques.html) vs [A2.md](A2.md) (A2.2 section)

*Note: the HTML splits its content into six sub-points (2.2.1–2.2.6) that don't map one-to-one onto the MD's own headers — MD combines "A2.2.2 and A2.2.3" into one drawings-focused block, while HTML separates 2.2.2 (Drawings) from 2.2.3 (Physical vs Virtual, a purpose-of-prototyping framing largely synthesized rather than lifted from a specific MD passage). Each is assessed against its relevant MD content regardless of numbering.*

- **A2.2.2** (Drawings) — ⚠️ Adequate but thin. All five drawing types (freehand, isometric, orthographic, exploded, perspective) are covered with a useful comparison table. Missing: the annotation-practices discussion (MD's four specific reasons designers annotate sketches), the general-assembly vs sub-assembly drawing hierarchy for complex products, the deeper first/third-angle mechanics (MD's HP/VP notation and folding-line explanation, and the full country list — MD says Australia/Canada/US use third-angle, HTML only says "USA and UK"), and the historical grounding for perspective drawing (Albrecht Dürer and "Dürer's window"). **Factual error fixed, 20 Aug 2026:** the page had stated twice, in the 2.2.2 body and again in the quiz answer, that third-angle projection is "used in the USA and the UK". The UK uses *first*-angle. Both spots now read third-angle for the USA, Canada and Australia, and first-angle for the UK and Europe. *Expand: add annotation practices and the assembly/sub-assembly drawing concept.*

- **A2.2.4** (Physical prototypes) — ⚠️ Adequate but thin. Tangibility, the Dyson example (expanded into a full case study), materials list and disadvantages all track MD well. *Re-checked 20 Aug 2026: the clay-modelling gap is closed* — the page now carries a full-size clay model case study (Mercedes/Ford/Hyundai/Toyota/JLR, industrial modelling clay over an armature, CNC roughing then hand finishing by modellers, and why a physical highlight beats a rendered one). Still missing: architectural-model specifics (MD's 1:100 landscape vs 1:20 building scale convention and its dedicated materials list), and — notably — MD's explicit 7-item advantages list has no itemized HTML equivalent; only the Dyson narrative implies benefits. *Expand: add an explicit advantages list and the architectural-modelling scale conventions.*

- **A2.2.5** (Virtual prototypes / CAD) — ⚠️ Adequate but thin. *Aug 2026: the generative-design gap below is now closed.* The page carries a full generative-design explanation built around the constraint set (preserve geometry, obstacle geometry, load cases, material and manufacturing method, goals), the optimisation loop that follows, and why the output looks organic. Autodesk Fusion is named as the tool students are most likely to reach, with its actual workflow and two honest warnings (paid extension, and results that are awkward to 3D print because of support material). A Key Concept box then distinguishes generative design from agentic modelling, using the Claude and Blender connector (Blender MCP, 2025) as the worked example: what the Model Context Protocol does, the fact that the model writes Python for Blender to execute rather than manipulating geometry directly, and why the observe-and-correct loop is what makes it agentic. The box closes on the exam-relevant distinction, that generative design optimises against physics while agentic modelling only accelerates authoring, plus an IA documentation note. A cross-reference sends students to the Airbus Bionic Partition case study in B2.2.3 rather than duplicating it. **Still outstanding:** the haptic-technology taxonomy below, and the general thinness against MD's named real-world applications. The original assessment follows.

  This is MD's largest and densest section — covering CAD basics, surface vs solid modelling, generative design, digital humans, motion capture, haptic technology, animation, VR, AR and FEA, each with extensive named real-world applications (Formula One fuel-mixture modelling, 3D scanning, Matsushita kitchen design, 4D cinema, NASA Goddard star-motion simulation, a Zuckerberg VR quote, aviation HUD history). HTML covers the same technology list at a basic, accurate level but is roughly a third of the length. Most notably, **generative design is named explicitly in the page's own "Students must be able to" objective line but is never actually explained in the body content** — a genuine gap against the page's own stated learning objective, not just against the MD. Haptic technology is also thinned dramatically: MD's three-category taxonomy (graspable/wearable/touchable) with named devices (haptic rings for visually impaired users, GPS-direction smartwatches, telepresence systems) collapses into a single generic paragraph in HTML. *Expand: add a generative-design explanation (required — it's in the stated objective), and restore the haptic-technology taxonomy.*

The generative-design *text* is now written, so this is no longer a required fix.

**A2.2 overall:** Strong at both ends (fidelity and rapid prototyping), with virtual prototyping still the thinnest part of the middle. The direct miss against the page's own listed learning objective has been fixed: generative design is now taught properly in 2.2.5, alongside a contrast with agentic AI modelling (Claude and Blender) that has no MD equivalent and is genuinely current. What remains in 2.2.5 is depth rather than absence, mainly the haptic-technology taxonomy and MD's bank of named real-world applications.

**A2 overall:** Consistent with A1's pattern before its revision pass. Clear, accurate teaching of core concepts, often with good original structural additions (tables, interactive tools, case studies), but real depth is lost wherever the MD source material was unusually dense. A2.1 has since been brought to full coverage, and A2.2.5 no longer leaves a student under-prepared against the page's own stated objectives. A2.2.2 (drawings, missing annotation practices and the assembly/sub-assembly hierarchy) and A2.2.4 (physical prototypes, missing the explicit advantages list and architectural scale conventions) are now the largest remaining text gaps in this topic.

---

## B2 — Design Innovation & Human-Centred Design: The Design Process & Modelling

*B2.md is by far the densest source file reviewed so far (1536 lines across 21 sub-points). HTML splits it across two pages: [b2.1-design-process.html](b2.1-design-process.html) (15 sub-points) and [b2.2-modelling-prototyping.html](b2.2-modelling-prototyping.html) (6 sub-points).*

### B2.1 The Design Process — vs [B2.md](B2.md) (B2.1 section, lines 1-1031)

- **B2.1.2 & B2.1.3** (Research Overview / Primary Research) — ❌ Needs expansion. The primary-vs-secondary and qualitative-vs-quantitative distinctions and the six primary-research methods are all present, but two substantial named content blocks are missing entirely: MD's extended **"taste in product design"** framework (a four-category theory of aesthetic taste — user-centred appeal, cultural relevance, brand identity, sustainability/longevity — illustrated with Apple/IKEA), and MD's bank of named **accessibility-technology examples** illustrating qualitative data in practice (text-to-speech, translation apps, audio tactile lane markings, braille banknotes, tactile pavements, AI currency-reader apps). Also missing: raw data's defining characteristics, and the specific primary-research analysis techniques (regression analysis, thematic coding of interviews/focus groups). *Expand: at minimum restore the taste-in-design framework — it's genuinely distinct theoretical content with no equivalent anywhere else in the curriculum.*

- **B2.1.4 & B2.1.5** (Secondary Research / Personas) — ❌ Needs expansion — the single largest gap found in the entire review. Secondary source types and the persona/psychographics content (including a strong original Einstein/Chaplin demographics-trap example) are covered reasonably. But MD's entire **"Common issues and challenges" section is completely absent**: the taxonomy of eight named research biases across three categories (cognitive: confirmation, framing effect, anchoring, availability heuristic; social/cultural: social desirability, Hawthorne effect, cultural bias; researcher: selection bias, leading questions, interpretation bias — each with a worked example), the stakeholder-impact-by-design-stage mapping, and the legal/ethical research considerations (GDPR, informed consent, power dynamics, cultural sensitivity in research). Also missing: meta-analysis as a defined term, the 6-step persona-development process, and AI's growing role (and risks — hallucinated citations) in literature reviews. *Expand: this is a priority — the bias taxonomy alone is dense, clearly delineated, and highly exam-relevant content with zero current coverage.*

- **B2.1.7** (Product Analysis) — ⚠️ Adequate but differently framed. HTML organizes product analysis around six *dimensions* (function, performance, form, UI, manufacturing, target user), while MD organizes it around six *techniques* (market assessment, A/B comparison, benchmarking, SWOT, usability testing, market performance). Both are valid, complementary lenses, but MD's named techniques — A/B testing, benchmarking and SWOT specifically — don't appear under this topic (SWOT is taught in C3.1, a different subject area a B2-only student wouldn't necessarily reach). *Expand: name-check A/B testing, benchmarking and SWOT as techniques, even briefly.*

- **B2.1.8** (Problem Statement) — ⚠️ Different content, real gap. HTML's "Problem Statement" (who/what/context/why framework) is good original material addressing a real skill, but it doesn't correspond to MD's actual B2.1.8 topic, which is about writing a **design brief** (six elements) with a full worked example — a detailed sample brief for an airport luggage tag, including market analysis, timeline and legislative context. That worked example is absent from the whole page. *Expand: the design-brief concept is touched on in 2.1.9, but the full worked luggage-tag brief would be a strong concrete anchor to restore.*

- **B2.1.11** (Iterative Evaluation) — ❌ Content mismatch. HTML's "Iterative Evaluation" (design/decision matrices, comparing ideas against specs) is useful original material, but MD's actual B2.1.11 is a specific, detailed worked example: an AI-assisted (ChatGPT) design walkthrough for the luggage-tag brief, covering product naming, logo generation and final design output. That entire worked example — notable for being a distinctly modern, AI-relevant case study — is absent from the page. *Expand: consider restoring some version of the AI-assisted design walkthrough, given its topical relevance.*

- **B2.1.12** (Model–Test–Refine) — ⚠️ Adequate but thin. The PDSA cycle and model-test-refine loop are well covered. Missing: **Agile** methodology (sprints, iterative planning/execution/feedback) and **Kaizen** (the lean-manufacturing continuous-improvement philosophy underlying PDSA, including its origin) — both named concepts in MD with no equivalent here.

- **B2.1.13** (Prototyping) — ⚠️ Adequate but thin, reasonably so. Lo-fi/hi-fi distinction and purpose are solid. MD's 8-item list of hi-fi performance-data types (task completion, time-on-task, error tracking, satisfaction, interaction logs, eye-tracking, comfort/fit, control accessibility) is trimmed to about 3 items, and the three named advantages of hi-fi prototyping (stakeholder engagement, usability testing quality, developer handoff) aren't itemized. This is a reasonable trim given the page explicitly defers deeper prototyping coverage to B2.2.

- **B2.1.14** (Technical Drawings) — ⚠️ Adequate but thin. Orthographic projection, dimensioning, scale, assembly and detail drawings are all covered well. Missing entirely: the discussion of drawing **standards** (MD names the Australian AS 1100 series specifically, with seven named reasons standards matter — uniformity, legal/contractual weight, compliance, workflow, CAD interoperability, safety, quality assurance). *Expand: add a brief standards/regulatory-context note.*

- **B2.1.15** (Presenting Solutions) — ❌ Needs expansion. HTML's presentation-tools framework (virtual representations, annotated renders, appearance prototypes, testing evidence) is solid but generic. MD's two flagship named case studies — the **Sydney Opera House** (Jørn Utzon's spherical-geometry solution to the shell problem) and the **Guggenheim Bilbao** (Frank Gehry, CATIA software, titanium panelling, and a formal definition of **BIM** — Building Information Modelling — plus the "Bilbao Effect") — are both completely absent from the page. BIM in particular is a named, defined, testable term with zero coverage anywhere in B2. *Expand: this is a priority — both case studies are memorable, exam-useful anchors, and BIM is a real content gap, not just missing colour.*

**B2.1 overall:** The widest range of outcomes seen in the review so far — several sub-points genuinely exceed the MD (2.1.1, 2.1.9, 2.1.10), while two represent the largest content gaps found across the whole project: the entire research-bias/ethics taxonomy (2.1.4/2.1.5) and the Sydney Opera House/Guggenheim Bilbao/BIM case studies (2.1.15). Both are self-contained, clearly bounded blocks that would be straightforward to restore without disrupting the page's existing structure.

### B2.2 Modelling and Prototyping — vs [B2.md](B2.md) (B2.2 section, lines 1032-1536)

- **B2.2.2** (Physical Prototypes) — ⚠️ Adequate but thin. Low/medium/high fidelity and aesthetic/functional/hybrid categories are covered, but MD's more systematic 3×2 fidelity-by-purpose matrix (each cell with its own materials, advantages and limitations) is compressed into general prose, and MD's three-step "reviewing a prototype" checklist is absent.

- **B2.2.3** (CAD Models) — ⚠️ Adequate but thin, strong bonus content. Surface/solid/virtual models and generative design are all correctly explained, and the Airbus Bionic Partition case study is a genuine highlight. But MD's extensive discussion of *why* CAD matters across the whole product lifecycle (seven paragraphs covering parametric precision, automation, refinement, visualisation, simulation, manufacturing integration and PLM/collaboration) is almost entirely absent, as is the named modelling-technique vocabulary MD provides — NURBS, polygon meshes, subdivision surfaces for surface modelling; CSG and B-rep for solid modelling.

- **B2.2.5** (Rapid Prototyping) — ❌ Needs expansion. This is the second major gap in B2.2. MD provides a detailed, genuinely practical **7-step CAD-construction workflow** for rapid prototyping (define objectives → sketch geometry → build 3D features → assemble → apply materials → check manufacturability → export) and a **6-category testing checklist** with specific numeric thresholds (e.g., 1.2mm minimum wall thickness for FDM, 45° overhang angle before supports are needed). HTML replaces this with a shorter, less structured requirements list — good STL/mesh-resolution sidebar content aside, the actionable, IA-relevant construction workflow is largely gone. *Expand: this is a priority — it's exactly the kind of practical process content students would want for their own project work.*

- **B2.2.6** (Prototypes & Feedback) — ⚠️ Adequate but thin. The stakeholder-matching principle (end users/clients/engineers/manufacturers, each needing different prototype types) is taught well, though MD's fifth stakeholder category ("design teams") is dropped, and MD's four-type data taxonomy (quantitative/qualitative/technical/behavioural) isn't itemized. More notably, MD's rich **"Generative AI modelling"** content — the three computational approaches (rule-based systems, optimisation/genetic algorithms, machine learning) and the detailed 2019 Philippe Starck/Kartell/Autodesk AI-designed chair narrative — doesn't appear here or in 2.2.3 (which covers generative design more briefly, via the Airbus case study instead).

**B2.2 overall:** A tale of two halves — 2.2.1 and 2.2.4 are among the strongest sub-points in the whole review (excellent original interactive/narrative content), while 2.2.5's loss of the practical CAD-construction workflow is a clear, fixable gap. Combined with B2.1, this topic has the most total content to restore of anything reviewed so far, concentrated in a small number of well-defined blocks: the B2.1 bias/ethics taxonomy, the B2.1.15 case studies, and the B2.2.5 rapid-prototyping workflow.

---

## C1 — Responsibility, Inclusivity and Beyond Usability

### C1.1 Responsibility of the Designer — [c1.1-responsibility-of-designer.html](c1.1-responsibility-of-designer.html) vs [C1.md](C1.md)

- **C1.1.1** (Designer's Responsibilities) — ⚠️ Adequate but thin. The Brundtland Report, Triple Bottom Line framing, Minamata disease, fast fashion, PFAS and microplastics (with a strong bonus Key Concept sidebar) all survive and are well presented. Missing: MD's detailed **Kaizen/Deming/Shewhart/PDCA history** (the origin of continuous-improvement philosophy — reduced to a single passing mention later in 1.1.3), most of the catalogue of five named **eco-friendly product categories** (*corrected 20 Aug 2026:* three of the five — reusable organic-cotton bags, solar-powered devices and biodegradable materials — do survive, in a single closing sentence of the sustainable-design section; recycled PET and recycled clothing are absent, and none of the three is developed beyond a name-check), the "other sustainability tips" list, and several named pollution specifics (CFC/HCFC ozone depletion, disposable ocean plastic, mercury/kidney damage, atmospheric lead/NOₓ/PM2.5). Kaizen itself appears on the page only as a quiz distractor and a line in a quiz answer, never taught. *Expand: develop the surviving eco-friendly examples past a name-check, add recycled PET and recycled clothing, and teach Kaizen properly with its Deming/Shewhart/PDCA lineage.*

- **C1.1.3** (Planned Obsolescence) — ⚠️ Adequate but thin, one substantial specific gap. Functional, technological, style and social obsolescence are all defined and exampled, the Veblen effect is retained, and there's an excellent bonus Discussion prompt (Apple battery throttling, printer-ink DRM). But MD's **detailed technological-obsolescence historical catalogue** — timekeeping, refrigeration, displays (CRT→plasma→LCD→OLED), sound recording formats (cylinders→78s→vinyl→tape→CD→streaming), steelmaking processes, data storage formats — is a rich, self-contained mini history-of-technology unit with zero equivalent in the HTML. Also lost: the specific named fads (Troll Dolls, Pet Rocks, Beanie Babies, Tamagotchi) and the cultural detail behind style-obsolescence examples (Cab Calloway/zoot suits, Dynasty/Diana/Thatcher/shoulder pads). *Expand: the technological-obsolescence timeline is the priority — it's genuinely distinct, well-structured content that would be easy to restore as a table or timeline graphic.*

---

## C2 — Sustainability and the Circular Economy

### C2.2 Design for a Circular Economy — [c2.2-circular-economy.html](c2.2-circular-economy.html) vs [C2.md](C2.md)

- **C2.2.4** (Recovery and Restoration) — ⚠️ Adequate but thin, one specific and sizeable gap. Reuse, repair, recondition and recycling are all covered, and the page's resin-identification-code detail and its bonus Extended Producer Responsibility sidebar and Fairphone case study genuinely exceed MD in those areas. But MD's **very specific EU end-of-life legislation detail is missing**: the ELV Directive (2000/53/EC) with its exact recovery-rate targets (85% by 2006, rising to 95% by 2015) and 2022 recovery statistics (4.7 million vehicles), and the WEEE Directive's nine named product categories — both reduced to generic mentions. *Expand: restore the ELV Directive's specific percentages/dates and the WEEE product-category list — these are exactly the kind of precise, quotable facts that earn marks in Paper 2.*

**C2.2 overall:** Four of five sub-points comprehensive or better than source; only C2.2.4 has a real gap, and it's a narrow, well-defined one (specific EU legislation figures) rather than a structural problem.

**C2 overall:** The strongest-performing pair of topics in the entire review — nearly every sub-point in both C2.1 and C2.2 matches or exceeds the source material, likely helped by this page having already been closely reviewed once during the earlier duplication-cleanup pass. Only one real gap (C2.2.4's EU legislation specifics) and one minor proofreading inconsistency (C2.1.3's TBL coining year) were found across nine sub-points.

---

## C3 — Product Analysis and Life-Cycle Analysis

### C3.1 Product Analysis and Evaluation — [c3.1-product-analysis.html](c3.1-product-analysis.html) vs [C3.md](C3.md)

*This is one of the strongest-covered sub-pages in the whole review, with unusually vivid original worked examples (a kombucha bottle, a "Pizza Dog" restaurant concept, a Steam Deck teardown, Game Boy vs. Game Gear) layered on top of accurate coverage of every MD concept.*

- **C3.1.5** (Benchmarking & opportunities) — ⚠️ Adequate but thin. The weakness-to-opportunity relationship, value proposition mapping and customer reviews are all covered with a good original decision-framework (invest/leave unchanged/discontinue) addition. Missing: MD's discussion of in-house testing's confirmation-bias risk and the case for commissioning independent external labs.

**C3.1 overall:** Comprehensive or better across all seven sub-points — one of the strongest-performing pages in the entire review, with only two narrow, minor omissions.

### C3.2 Life-Cycle Analysis — [c3.2-life-cycle-analysis.html](c3.2-life-cycle-analysis.html) vs [C3.md](C3.md)

*Structural note: MD organizes this content under three headings (C3.2.1, C3.2.2, C3.2.3), while the HTML page's table of contents lists only two (3.2.1, 3.2.2). Much of C3.2.3's factual content — the British Motor Industry 90/10 study, the Prius 75% figure, the consumer-electronics hotspot finding, and the five LCA-scope approaches (cradle-to-grave/gate/cradle, gate-to-gate, well-to-wheel) — has been successfully redistributed into the two remaining sub-points. What has not survived is discussed below.*

- **The missing piece: C3.2.3's Environmental Impact Assessment Matrix** — ❌ Needs expansion. MD's C3.2.3 introduces a specific analytical *technique* — a weighted 0-4 scoring matrix for comparing environmental impact across life-cycle stages, illustrated with a worked fuel-comparison example (diesel vs. biodiesel vs. hydrogen) and a Streamlined LCA (SLCA) concept — that has no equivalent anywhere on the page. Also missing: the designer/manufacturer/user role-responsibility framing (each party's distinct obligations across the product life cycle), and the two named real-world reports MD cites (the EPA Automotive Trends Report and the Transportation Energy Institute's Life Cycle Analysis Comparison). *Expand: the impact-assessment matrix is a genuinely distinct practical technique, not just supporting narrative — it's the one significant structural gap in an otherwise very strong page.*

**C3.2 overall:** Strong on LCA fundamentals and hotspot analysis, but the specific SLCA/impact-assessment-matrix methodology from C3.2.3 — a hands-on technique students could actually apply, not just a concept to know — has no home on the page.

**C3 overall:** C3.1 is essentially flawless; C3.2 is strong on concepts but has lost one genuinely useful practical technique. Together, the strongest-performing topic pairing after C2.

---

## C4 — Design for Manufacture

### C4.1 Design for Manufacture Strategies — [c4.1-design-for-manufacture.html](c4.1-design-for-manufacture.html) vs [C4.md](C4.md)

*This page was also touched during the earlier duplication-cleanup pass (the Yurt and smartphone-DFD sections were reworded there), which is reflected in strong coverage in those specific spots.*

- **C4.1.1** (DfM overview) — ⚠️ Adequate but thin. The three-strategy comparison table (DfP/DFA/DFD) is a clean, useful overview, and MD's dense original content has been sensibly redistributed into 4.1.2–4.1.4. But two things are lost outright: the **Formentini & Ramanujan (2023)** academic citation on design-for-disassembly's role in the circular economy, and — more significantly — the **Thonet No. 14 bistro chair** case study, MD's richest worked example, which traces a single product (over 50 million sold since 1859, a Le Corbusier quote, arguably the first flat-pack furniture) through all three DfM strategies at once. Nothing in the HTML plays that same "one product, all three strategies" unifying role. *Expand: the Thonet chair is a strong, self-contained case study worth restoring, ideally in 4.1.1 where it would tie the three-strategy table together.*

- **C4.1.2** (Design for Process) — ⚠️ Adequate but thin. The five DfP guidelines and the Apple Unibody MacBook case study (enhanced here with a specific waste figure MD doesn't give — 30-50% aluminium billet lost as swarf) are well covered, plus a good bonus interactive tolerance-vs-throughput tool. Missing: MD's second worked example, a step-by-step smartphone-stand design walkthrough (define requirements → simplify → select materials → optimise process), which has no equivalent anywhere on the page.

- **C4.1.4** (Design for Disassembly) — ⚠️ Adequate but thin. The DFD guidelines table, the Yurt case study, and the smartphone-teardown case study are all strong (helped by the earlier duplication-fix work), and the bonus iFixit Repairability Score case study is excellent. But MD's detailed **flashlight/torch worked example** — a mechanically specific walkthrough of DFD principles (snap-fit casing, modular lens/reflector, standardised O-rings, no special tools required) applied to a simple, concrete product — is completely absent, and MD's explicit 9-item advantages list is only implicit in the guidelines table rather than spelled out.

**C4.1 overall:** A clear, consistent pattern across this page: real-world case studies (Bosch, IKEA, Yurt, Fairphone, iFixit) are handled very well, but MD's three step-by-step *design walkthrough* examples — the Thonet chair, the smartphone stand, and the flashlight teardown — are all missing, even though each was a self-contained, concrete illustration of a strategy in action. Worth restoring at least the Thonet chair, since it's the one MD example that ties all three DfM strategies together in a single product.

---

## A4 — Manufacturing Techniques

### A4.1 Manufacturing Techniques — [a4.1-manufacturing-techniques.html](a4.1-manufacturing-techniques.html) vs [A4.md](A4.md)

*A4.md is by far the densest, most technically granular source file in the curriculum (1171 lines across 11 sub-points, much of it highly specific process engineering detail — exact temperatures, pressures, chemical formulations, historical dates). The HTML page compresses this skilfully into clean comparison tables with several excellent original additions (interactive tolerance tools, product spotlights, an outstanding smartphone-teardown case study in 4.1.11). But at this density, compression inevitably drops named sub-processes and historical narratives that a table format can't hold.*

- **A4.1.1** (Five categories) — ⚠️ Adequate but thin. The five-category table (additive/subtractive/forming/joining/finishing) is clean and well-illustrated, with a good bonus "why not just 3D print everything?" discussion. Missing: MD's foundational **discrete vs. process manufacturing** distinction — the very first concept in the chapter, separating countable individual products (cars, furniture) from continuously/batch-produced materials (chemicals, food) — which isn't addressed anywhere on the page.

- **A4.1.2** (Additive techniques) — ⚠️ Adequate but thin. An excellent six-process comparison table (SLA/FDM/SLS/Material Jetting/Binder Jetting/DED) with a genuinely valuable bonus "Isotropic vs Anisotropic Strength" concept explainer. Missing: MD's **paper-based rapid prototyping** section (Selective Deposition Lamination and Laminated Object Manufacturing, including the Mcor Technologies/MacCormack brothers 2003 origin story) — a distinct named technology category with no equivalent anywhere on the page.

- **A4.1.4** (Low-volume production) — this HTML sub-point covers different, entirely original ground (real industry applications: Invisalign, GE LEAP nozzles, F1 brake ducts, Adidas 4D midsoles, ICON 3D-printed concrete homes) with no MD equivalent — a genuine bonus. Meanwhile, MD's actual A4.1.4 (a detailed technical breakdown of all seven ISO/ASTM 52900:2021 AM process categories, including Powder Bed Fusion's four named sub-variants — MJF, SLM, EBM, SLS — each with distinct temperatures and mechanisms) has been mostly folded into 4.1.2's table, but with real thinning: **sheet lamination and vat photopolymerisation aren't named as distinct categories**, and the PBF sub-variants lose their individual technical detail (e.g., EBM's 2000°C vacuum operation, the SLM-vs-DMLS distinction). *Expand: the ISO 52900 standard citation and the PBF sub-variant detail would be worth restoring given how specific and testable this content is.*

- **A4.1.7** (Subtractive techniques) — ⚠️ Adequate but thin. A strong six-process table (turning/milling/EDM/laser/plasma/waterjet) plus a good bonus CNC/G-code explainer. Missing: **oxy-acetylene cutting** as a named process entirely (including its flashback-arrestor safety mechanism and its specific advantages/disadvantages), and the CEREC dental-CNC real-world example.

- **A4.1.8** (Forming techniques) — ❌ Needs significant expansion, clearly the weakest sub-point in A4. MD's densest section by far covers bending (with a horseshoe/farrier worked example and steam-bending for wood), press forming, deep drawing, hydroforming, hot-chamber vs. cold-chamber die casting (with specific alloy temperature thresholds), and an extensive suite of composite-moulding processes (hand lay-up, spray-up, vacuum bagging, resin transfer moulding with an F-22/F-35 example, pultrusion, compression moulding). The HTML page covers only two compact tables (metal casting, polymer moulding) — **bending, press forming, hydroforming, and every composite-moulding process are entirely absent**, and investment casting's rich history (Mesopotamia c. 3000 BCE origins, Cellini's 1554 Perseus, WWII-era jet-turbine-blade adoption) is reduced to a single table entry with no narrative. *Expand: this is the priority fix in A4 — an entire manufacturing category (composites) and several named metal-forming processes have no coverage at all.*

- **A4.1.9** (Joining techniques) — ⚠️ Adequate but thin, bordering on needing expansion. A solid eight-row joining-technique table plus an excellent bonus IKEA Cam Lock case study. But three of MD's richest narrative passages are completely missing: the **detailed historical account of hot riveting** (the four-person team, heating and throwing the rivet, factory/shop head formation), **metal stitching** (the 1930s cold-repair technique for cracked cast iron), and **weaving's history** (chain mail, and Stephanie Kwolek's 1966 Kevlar patent story). MD's ten named specific adhesive types are also collapsed to three examples in the table.

**A4.1 overall:** A page with real range — several sub-points (4.1.5, 4.1.6, 4.1.11) genuinely exceed the source, while A4.1.8 (Forming) stands out as a significant, clearly-bounded gap: an entire manufacturing category (composite moulding) and several distinct metal-forming processes (bending, press forming, hydroforming) have no coverage anywhere on the page. A4.1.9's lost historical narratives (riveting, metal stitching, Kevlar) are the second priority.

---

## B4 — Production Systems

### B4.1 Production Systems — [b4.1-production-systems.html](b4.1-production-systems.html) vs [B4.md](B4.md)

- **B4.1.1 & B4.1.2** (Production system types / Advantages & disadvantages) — ⚠️ Adequate but thin. MD packs an enormous amount into this single combined section covering craft, mechanised, automated, assembly-line, hybrid and CIM production. HTML's two comparison tables (system type/volume/products, and advantages/disadvantages) are clean and cover all six systems completely for the stated learning objectives, and the Ford "any colour as long as it's black" quote survives. But MD's rich historical narrative is almost entirely lost: pre-industrial craft production's social history (village self-sufficiency, proto-industrialisation, the "living cultural treasures" designation used in Korea/Japan/China, and restoration case studies like Notre Dame and St George's Hall at Windsor Castle), James Watt's steam engine as the trigger for mechanisation, and — most notably — **Joseph Marie Jacquard's 1804 punch-card loom**, a genuinely significant precursor to computer-controlled automation that has no mention anywhere on the page. The Gunasekaran et al. (2001) academic citation on CIM adoption is also dropped. *Expand: Jacquard's loom is the standout omission — it's the direct historical ancestor of the CNC/CAM content taught elsewhere on this same page.*

**B4.1 overall:** Strong throughout — four of six sub-points are comprehensive or better, and the one weak spot (4.1.1/4.1.2) is weak specifically because MD crams an unusual amount of social and technological history into a single section. Jacquard's loom is worth restoring on its own merits, given it ties directly into the CNC/automation content already on the page.

---

## A3 — Material Science, Structures and Mechanical/Electronic Systems

*A3.md carries known conversion damage: several passages reference "the table below" or specific diagrams (a Young's Modulus materials table in A3.2.6, a strengthening-methods summary table repeated in A3.2.8 and A3.2.9, a lever diagram in A3.3.9, an SMA phase-change diagram in A3.1.8, and multiple electrical-equation blocks in A3.4.4 that render as garbled fragments) with no surviving content. Per the project-wide note above, these are flagged as MD limitations and the HTML is judged on what it teaches, not on reproducing a figure that no longer exists.*

### A3.1 Material Classification & Properties — [a3.1-material-classification.html](a3.1-material-classification.html) vs [A3.md](A3.md)

- **A3.1.1** (Classifying materials) — ⚠️ Adequate but thin. The physical/chemical/mechanical three-category framework, Aristotle's four-element system, and the advantages of classification (CES EduPack, Ashby charts) are all covered well, with a bonus Interactive Material Selection Game. Missing: the Three-Ages System (C.J. Thomsen, 1826, Stone/Bronze/Iron Age) and the periodic table's development as a classification tool (Mendeleev 1869, Moseley's 1913 revision to atomic number) — both distinct historical classification systems MD covers at length that have no equivalent on the page.

- **A3.1.4** (Physical properties) — ⚠️ Adequate but thin. Density, thermal expansion, thermal conductivity, melting point and electrical conductivity/resistivity are all covered with good quantitative examples (aluminium vs. steel density, the mild-steel expansion coefficient). Missing: the deeper explanatory mechanisms MD provides — why intermolecular/metallic bond strength determines melting point (with the ice/hydrogen-bond and mercury examples), and the electron-scattering explanation of why resistivity rises with temperature.

- **A3.1.5** (Chemical properties) — ⚠️ Adequate but thin. Corrosion/passivation, food-safety reactivity (migration, oxidation, hydrolysis, with specific EU 10/2011 and FDA citations exceeding MD's detail), hygroscopy and flammability are all well covered. Missing: the specific corrosion-prevention techniques MD describes — the three conditions required for corrosion (anode, cathode, electrolyte) and sacrificial anode/cathodic protection (the zinc-bar ship-hull example), which have no equivalent on the page.

- **A3.1.6** (Mechanical properties) — ⚠️ Adequate but thin. This is an unusually strong ⚠️: tensile/compressive strength, stiffness, toughness (Charpy/Izod) and eight named hardness tests (Brinell, Rockwell, Vickers, Knoop, Durometer, Janka, pencil test, Shore Scleroscope) are all covered, plus a bonus Ashby Chart Game and a genuinely good Paper 2 sample answer contrasting three hardness tests. Missing: Mohs scale history (Friedrich Mohs, 1812, and its famous non-linearity), the Constance Tipper/Liberty Ships brittle-fracture story (a vivid, testable historical case MD spends real space on), and the fracture toughness (K­IC) concept.

- **A3.1.7** (Composites) — ⚠️ Adequate but thin. All three composite categories (particle, fibre, laminar) are covered with strong matching examples (concrete, cemented carbide, CFRP, GFRP, plywood, laminated glass, cardboard, sailcloth). Missing: tempered/toughened glass as a distinct process (MD gives it real detail — 2-3× the strength of annealed glass, the "dicing" fracture pattern, why it can't be cut after tempering) is absent even though laminated glass is covered; also missing are prestressed/post-tensioned concrete and free-machining steel's MnS-stringer mechanism.

**A3.1 overall:** A solid page pulled down to mostly ⚠️ by a pattern of dropped historical narratives and named techniques (the Three-Ages System, Mohs/Tipper history, sacrificial anodes, tempered glass) rather than any conceptual gap — every core learning objective is taught adequately, but the vivid, quotable specifics that would earn marks in Paper 2 are frequently the casualty of compression. A3.1.8 and A3.1.9 (smart and biodegradable materials) are genuine standouts that exceed the source.

### A3.2 Structural Systems — [a3.2-structural-systems.html](a3.2-structural-systems.html) vs [A3.md](A3.md)

*One of the strongest-performing pages in the whole review.*

- **A3.2.8** (Strengthening techniques) — ⚠️ Adequate but thin. Struts/triangulation (with the Burj Khalifa I-beam case study matching MD closely), shape optimisation and lamination (glulam, laminated glass, plywood, CFRP) are all well covered, plus a good bonus "Second Moment of Area" concept explainer. Missing: composite materials as a fourth named strengthening strategy (MD's concrete/reinforced-concrete/prestressed-and-post-tensioned-concrete case study), and MD's striking list of named record-breaking CLT/timber buildings (Melbourne's Forté, London's Dalston Works and The Smile, Norway's Mjøstårnet, the planned Atlassian Sydney tower) — all absent. *Expand: the CLT building list is a compact, quotable set of real-world examples worth restoring alongside the existing lamination content.*

**A3.2 overall:** Comprehensive or better across nine of ten sub-points, with excellent use of case studies (Burj Khalifa, Tacoma Narrows, Junkers J 1) that match or extend MD's own historical examples. The one real gap — A3.2.8's missing CLT building list and composite-concrete case study — is narrow and easily restored; everything else on this page could already stand alone in place of the textbook.

### A3.3 Mechanical Systems — [a3.3-mechanical-systems.html](a3.3-mechanical-systems.html) vs [A3.md](A3.md)

- **A3.3.1** (Four types of motion / simple machines) — ⚠️ Adequate but thin. The four motion types are covered cleanly, and MD's simple-machine mechanical-advantage content is sensibly redistributed into 3.3.3 (inclined plane, wedge, pulleys, wheel and axle all present with formulas). Missing: the screw as the sixth simple machine — MD's detail on thread pitch, nominal vs. pitch diameter, and the MA = circumference/pitch formula has no equivalent anywhere on the page, even though screws are mentioned in passing later (3.3.5's car-jack example).

- **A3.3.6** (Gear systems) — ⚠️ Adequate but thin, bordering on needing expansion. Spur, bevel, hypoid, rack and pinion, worm, ratchet and pawl, idler and compound gears are all covered accurately with applications. *Re-checked 20 Aug 2026: ring gears are now covered* as their own category, with a Lego Technic image and the planetary-gear/starter-motor/automatic-transmission applications. Still missing: helical gears as a distinct category (a gear type MD gives significant advantages/disadvantages/applications detail to, and one of the most common real-world gear types in automotive transmissions) — helical appears on the page only in passing, inside the worm-gear description and a further-reading link — and spline shafts, which have no mention at all. *Expand: helical gears are the most consequential omission here given their prevalence in the real world MD is drawing examples from.*

- **A3.3.8** (Cams) — ⚠️ Adequate but thin. Pear, circular/eccentric, triangular, oval and snail cam profiles are all covered accurately with good applications (including retaining the Agricola cam-and-hammer connection). Missing: the heart-shaped cam — a seventh, distinct MD profile (Post Office master clocks, sewing-machine bobbin winders, modern dishwasher/washing-machine controllers) with no equivalent on the page.

**A3.3 overall:** Strong across most of the page, with two clearly-bounded named-category gaps standing out: A3.3.6 is missing three of MD's eleven gear types (most notably helical gears, given how common they are), and A3.3.8 drops the heart cam. Both are narrow, restorable gaps rather than structural weaknesses — the core mechanics (motion types, MA, levers, linkages, belts) are taught as well as or better than MD throughout.

### A3.4 Electronic Systems — [a3.4-electronic-systems.html](a3.4-electronic-systems.html) vs [A3.md](A3.md)

- **A3.4.2** (Electronics in everyday life / responsible design) — ⚠️ Adequate but thin. Safety (CE/UL marking), energy efficiency (EU Ecodesign Directive), standby power limits, e-waste/RoHS and data privacy are all covered soundly. Missing: the EPEAT eco-labelling system (Bronze/Silver/Gold) entirely, and MD's genuinely rich international energy-label history — Canada's 1978 EnerGuide (the world's first mandatory label), the USA's 1979 EnergyGuide and 1992 Energy Star, Australia's six-star scale (1986/1992), and the EU's A–G scale (1992–95, rescaled 2021) — none of which appear anywhere on the page.

- **A3.4.4** (Analogue signals and SI units) — ⚠️ Adequate but thin. Voltage, current, resistance, frequency and power are all covered correctly with SI units and a full multiplier-prefix table. Missing: capacitor circuit theory entirely — capacitance's definition (charge per unit voltage), series/parallel capacitor formulas, the RC time constant and capacitive reactance, and the Michael Faraday attribution — plus Franklin's conventional-current convention and Tesla's 1888 AC transmission history, all present in MD (much of MD's own equation notation here is garbled by the conversion, an MD limitation, but the underlying concepts are coherent and simply absent from the HTML).

- **A3.4.8** (Processing devices) — ❌ Needs expansion. The HTML's "processing devices" content (logic ICs, microcontrollers, SBCs, FPGAs) is solid and well organised, but it covers different ground from MD's actual A3.4.8, which is about analogue signal conditioning (amplification, attenuation, filtering, isolation, AC coupling, DC offset correction) and analogue-to-digital conversion — including the Nyquist-Shannon sampling theorem and a fully worked quantisation-step-size example (8-bit codeword, 1 V full-scale → 3.91 mV steps). None of this ADC/quantisation content, nor MD's specific historical narrative on PIC microcontrollers (General Instrument, 1977, .hex files, MPLABX), survives anywhere on the page. *Expand: the ADC/quantisation/Nyquist material is genuinely testable, self-contained content with no home on the page — it's the single clearest content gap in A3.4.*

Needs multiple elements to explain. 

**A3.4 overall:** The strongest page in A3 by sub-point count, with several sections (3.4.6, 3.4.12, 3.4.14) substantially exceeding a source that is itself sometimes thin or historically-focused rather than technical. The one clear gap is A3.4.8: MD's ADC/Nyquist-Shannon quantisation content and the PIC-specific historical narrative were dropped rather than redistributed, leaving a self-contained, testable block of content with no home on the page. A3.4.2's missing EPEAT/energy-label history is the second priority.

**A3 overall:** Across all four sub-pages, the pattern is consistent with the rest of this review — HTML compresses MD's often-excessive density into cleaner tables and adds genuinely valuable bonus content (interactive tools, Product Spotlights, worked numeric examples that fill in gaps left by MD's missing figures), but that compression has a cost. The recurring casualties are named historical narratives and named sub-categories rather than core concepts: the Three-Ages System and Mohs/Tipper history in A3.1, the CLT building list in A3.2, helical gears and the heart cam in A3.3, and — the single most significant gap in the whole topic — the ADC/Nyquist-Shannon quantisation theory dropped from A3.4.8. A3.2 (Structural Systems) is comfortably the strongest of the four sub-pages, with nine of ten sub-points fully comprehensive or better; A3.1 (Material Classification) is the weakest, with five of nine sub-points landing at ⚠️ due to a consistent pattern of dropped historical specifics rather than any single large gap.

---

## B3 — Material Selection, Structural, Mechanical and Electronic Systems Application

*B3.md carries the same conversion damage as A3.md — see the project-wide note above — with the density concentrated in B3.2 (a ~200-line truss-analysis block built entirely around worked numeric examples and figures that render as disconnected numbers and "shows examples of..." fragments) and B3.4 (equation blocks in B3.4.3/B3.4.4 that garble mid-derivation). Flagged inline as MD limitations where relevant. Two pages here were also touched during the earlier duplication-cleanup pass: B3.2 (the shear/torsion definitions in 3.2.1 were reworded, and the safety-factor worked example's numbers were deliberately changed from MD's 16 mm/590 MPa/FOS 4 to 20 mm/500 MPa/FOS 5 to make it a distinct problem) and B3.4 (a metastability-adjacent sentence was reworded, and the MD's full "Australia 3G shutdown" question-and-answer block was deliberately deleted per explicit user instruction as non-critical — the underlying concept survives as a shorter inline case study and a quiz question in 3.4.11, so its shorter form below is not flagged as a gap).*

### B3.1 Material Selection — [b3.1-material-selection.html](b3.1-material-selection.html) vs [B3.md](B3.md) (B3.1 section, lines 1–204)

- **B3.1.2** (Aesthetic characteristics) — ⚠️ Adequate but thin. HTML's five-sense aesthetic framework (colour, texture, form, sound, smell) is a genuinely stronger taxonomy than MD's own treatment, and the functional-vs-aesthetic-finish distinction (galvanising is functional, not aesthetic) is retained precisely. But MD's discussion of **product personality via marketing** is dropped almost entirely: celebrity endorsement as a mechanism for creating brand association, the research finding that personas congruent with a consumer's self-image build stronger attachment, and the specific lifestyle associations marketers lean on (sophistication, sport, travel, self-sufficiency, leisure) have no equivalent anywhere on the page. *Expand: add a short section on celebrity endorsement and self-image congruence as product-personality mechanisms.*

- **B3.1.4** (Primary and secondary research) — ⚠️ Adequate but thin. The primary/secondary research taxonomy is more thoroughly exampled than MD (specific test types — Charpy/Izod, Brinell/Vickers, salt-spray — and named secondary sources — MatWeb, ASM Handbook, Ecoinvent, REACH) and adds a clean four-step justification structure MD doesn't spell out. But MD's own worked example — developing a lightweight bicycle frame, secondary research identifying bamboo/steel/carbon-fibre/aluminium/titanium as candidates, primary research gathering cyclist feedback via focus groups — has no direct equivalent; the page's bicycle-frame example elsewhere (Paper 2 Q3) illustrates performance indices, not this specific primary/secondary research workflow.

**B3.1 overall:** The strongest of the four B3 sub-pages — three of four sub-points are comprehensive or better, with B3.1.3 in particular turning one of MD's thinnest paragraphs into the page's best section. The one real gap, B3.1.2's dropped marketing/personality content, is narrow and self-contained.

### B3.2 Structural Systems Application — [b3.2-structural-systems-application.html](b3.2-structural-systems-application.html) vs [B3.md](B3.md) (B3.2 section, lines 205–1040)

- **B3.2.2** (Young's Modulus & stress-strain) — ⚠️ Adequate but thin. Stress, strain, Young's Modulus, the full stress-strain-graph walkthrough (elastic region, elastic/proportional limit, yield point, 0.2% proof stress, UTS, necking, fracture) and the temperature-softening effect are all covered precisely, with a clean worked example. But two things MD gives real attention to are absent: the **historical attributions for Hooke's Law and Young's Modulus** (Robert Hooke, 1635–1705, and his spring work; Thomas Young, 1773–1829, and why the modulus bears his name rather than Hooke's) and the **engineering-stress-vs-true-stress distinction** (why true stress, based on the instantaneous cross-section, is used for metal-forming and crash simulations instead of engineering stress). Also missing: MD's explicit four-item list of ways to strengthen a structure (reinforcement, bracing, increasing material thickness/density, stronger connections) has no equivalent anywhere on the page. *Expand: restore the four-means-of-strengthening list and the Hooke/Young attributions — both are compact and easy to slot in.*

- **B3.2.3** (Structural failure & FEA) — ⚠️ Adequate but thin, bordering on comprehensive, with strong bonus content. The four failure-mode categories (overloading, wrong material, wrong size/shape, buckling), the Quebec Bridge and Tacoma Narrows case studies, and FEA's core mechanics (contour plots, applications, interpretation) are all covered well, and the page adds two genuine standouts MD doesn't have: an **Euler's Critical Buckling Load** Key Concept (with the P_cr = π²EI/L_e² formula and its design implications) and a full **Hyatt Regency Walkway Collapse** case study with discussion prompt. But MD's **Sampoong Department Store collapse** (Seoul, 1995 — 502 deaths, a vivid case of design changes made without engineering review, mid-project column removal and a rooftop AC unit added after the fact) is dropped entirely, as is the Bent Pyramid (2600 BCE) example and FEA's void-vs-crack modelling distinction. *Expand: the Sampoong case study is the standout omission — it's as dramatic and instructive as the two bridge collapses that are covered, and illustrates a different failure mechanism (negligence and unauthorised design changes rather than a calculation error).*

- **B3.2.4** (Force diagrams) — ❌ Needs expansion. Free body diagrams, force polygons, support reactions (roller vs. pinned), shear force and bending moment diagrams, UDLs and cantilever beams are all covered clearly, with a genuinely strong bonus interactive Numeric Load Simulator. But MD devotes roughly 200 lines to **truss analysis** — beam-and-truss bridge construction (I-beam vs. box beam, why trusses use triangulation), a named catalogue of truss types (Howe, Warren, Brunel, Fink, K, Pegram, Pratt) and two full worked solving methods (the **method of joints** and the **method of sections**, each with numeric examples) — none of which appears anywhere on the page. Much of MD's specific numeric working here is figure-dependent and reads as broken (an MD limitation), but the named truss types and the two named solving methods are coherent, examinable content independent of the missing diagrams. *Expand: this is the priority fix in B3.2 — trusses and their two standard analysis methods are a distinct, nameable technique with zero coverage, not just thinned detail.*

**B3.2 overall:** *Re-checked 20 Aug 2026: B3.2.1 is now ✅ and has been removed — the ongoing-inspection-through-service-life point it was missing is covered on the page, in the safety-factor maintenance table ("safety factors applied not just at commissioning but maintained through inspection and maintenance throughout design life", plus regular inspection schedules and the Genoa replacement bridge's inspection robots) and in the Morandi Bridge case study.* Strong on the calculation-heavy learning objectives (stress-strain, FEA interpretation, safety factors), with two bonus case studies (Euler buckling, Hyatt Regency) that exceed anything in MD. The clear priority gap is B3.2.4's missing truss-analysis content — a self-contained, named technique (truss types, method of joints, method of sections) that MD covers at length and the HTML doesn't touch at all. B3.2.3's dropped Sampoong Department Store collapse is the second-priority restoration, given how well the two bridge case studies that did survive work as teaching tools.

### B3.3 Mechanical Systems Application — [b3.3-mechanical-systems-application.html](b3.3-mechanical-systems-application.html) vs [B3.md](B3.md) (B3.3 section, lines 1041–1556)

- **B3.3.1** (Mechanical advantage) — ⚠️ Adequate but thin. The MA formula for belt/pulley systems (MA = Load/Effort = d₂/d₁ = N₁/N₂), the force-multiplier-vs-speed-multiplier distinction and belt-drive characteristics (friction transmission, V-belts, slip as overload protection) are clearly taught with a good worked example and a bonus interactive Gear/Velocity-Ratio Calculator. But MD's own B3.3.1 leads with **gear history** (gears since 2600 BCE, wood-and-animal-fat construction, the rolling-vs-sliding-contact distinction between spur and worm gears), **gear/pinion terminology** and the **IMA vs. AMA** (ideal vs. actual mechanical advantage) distinction — none of which survive. Also missing: the **belt-drive history** (spinning-wheel/textile origins, the Industrial Revolution lineshaft system distributing power via pulleys before electric motors), MD's applications list (conveyor systems, garage doors, 3D-printer axes, bandsaws) and the fan-belt-to-serpentine-belt history. *Expand: the IMA/AMA distinction is the most testable of the missing items and would be a natural addition alongside the existing MA formula.*

- **B3.3.4** (Gear & belt systems) — ⚠️ Adequate but thin. Idler gears, compound gear trains, multi-stage speed calculations and overdrive gearboxes are all covered well, with a strong original worked compound-belt-drive example and a bonus Bicycle Derailleur Product Spotlight. But several of MD's named mechanisms are missing: the **stepped cone pulley** (used for drill-press and bandsaw speed control), the mechanical distinction between **chain and belt drives** (sprocket/chain terminology, chains not needing friction so tolerating greater loads), and MD's belt material/cross-section options (leather/plastic/rubber/steel; flat/square/round/vee shapes).

- **B3.3.5** (Cams and followers) — ⚠️ Adequate but thin. Rise/fall/dwell terminology (a clearer framing than MD provides explicitly), follower types (knife-edge/roller/flat-faced), and the historical throughline (Han Dynasty trip hammers, al-Jazari's 12th-century programmable camshaft and Mechanical Servant automaton) all match or exceed MD, and the sewing-machine and IC-engine valve-timing applications are covered in more technical depth. Missing: MD's broader applications list — textile machinery, automated packaging systems, mechanical toys (a duck's-beak-opening example) and printing presses — reduced to the two flagship examples only.

**B3.3 overall:** Consistently strong on the calculation-heavy objectives (velocity ratio, efficiency, oblique-force lever equilibrium) that this "application" page is explicitly built around, with B3.3.2, 3.3.3 and 3.3.6 all exceeding MD. The recurring casualty is named historical and terminological detail rather than core mechanics: gear/belt history and the IMA/AMA distinction in 3.3.1, the stepped cone pulley and chain/belt mechanics in 3.3.4, and MD's fuller cam-application list in 3.3.5.

### B3.4 Electronic Systems Application — [b3.4-electronic-systems-application.html](b3.4-electronic-systems-application.html) vs [B3.md](B3.md) (B3.4 section, lines 1557–2821)

*The densest and most unevenly-covered sub-page in the B3 topic — MD's B3.4 is unusually rich in named historical and standards content (component-invention history, communication-protocol taxonomies), and the HTML's compression here drops more of that named material than elsewhere in B3, even as several individual sub-points substantially exceed MD.*

- **B3.4.1** (Electronics in products) — ❌ Needs expansion, the weakest sub-point on the page. The IPO framework and the product-category list (home appliances, entertainment, communication, automotive, wearables) survive, but MD's B3.4.1 is a dense, nearly 200-line section and almost none of its other content appears: the **electrical-vs-electronic distinction**, the full **invention history** of consumer electronics (Henry/Davy's 1830s electromagnetic relay, the 1947 Bell Labs transistor — Bardeen, Brattain and Shockley's 1956 Nobel Prize — and the Kilby/Noyce integrated-circuit race, including Kilby's 2000 Nobel Prize and why he used germanium over silicon), the detailed **domestic refrigerator case study** (electromechanical thermostats pre-1970s through to the Samsung Bespoke AI's camera-based food recognition), and MD's explicit eight-step list for incorporating electronic systems into a product (early integration, cross-disciplinary collaboration, system architecture, EDA/module reuse, PCB design, prototyping, verification, finalisation) are all absent. *Expand: this is the priority fix in B3.4 — restoring even a condensed version of the transistor/IC history and the refrigerator case study would bring this in line with the rest of the page.*

- **B3.4.3** (V, I, R and P) — ⚠️ Adequate but thin. Ohm's Law, the three power formulas, single-phase vs. three-phase power and the IEC 60309 plug colour-coding are all covered accurately with a strong worked-example table and interactive calculator. But MD's **conductance** (the siemens/mho unit, its inverse relationship to resistance) and **resistivity** (the intrinsic-vs-extrinsic distinction between resistivity and resistance, R = ρL/A) are both absent, as is MD's list of specific **resistor construction materials** (carbon film, metal film, metal-oxide film, Nichrome wirewound) and the Watt-rating concept for resistors. *Expand: conductance/resistivity is a distinct, nameable concept pair with no equivalent anywhere on the page.*

- **B3.4.6** (System diagrams) — ⚠️ Adequate but thin. Block, circuit, logic and flow diagrams are clearly distinguished (with block diagram content pulled forward from MD's B3.4.5, as noted above), and the bonus "Mapping a Smoke Detector" case study — one product shown through all four diagram types — is an excellent original teaching device. But MD's **wiring diagrams** (a fifth, distinct diagram category showing physical wire routing and colour, as opposed to the logical circuit diagram) aren't named as their own type, and a substantial block of MD content on international wiring standards is dropped entirely: country-by-country wire colour codes, the ~15 global plug types (A/B/C/G named specifically), the single-phase-vs-three-phase plug/pin-count differences, the IEC 60309 clock-position keying system, and the Perilex five-pin domestic three-phase plug (Germany/Austria/Netherlands). *Expand: restoring wiring diagrams as a named fifth diagram type is the more important fix; the country-plug-type trivia is lower priority given it sits at the edge of the stated learning objective.*

- **B3.4.8** (Process stage) — ⚠️ Adequate but thin. The embedded-system definition and microcontroller component breakdown (processor, flash/ROM, RAM, digital I/O, ADC, timers/PWM/comms interfaces) are accurate and well organised, with Arduino/Raspberry Pi and industrial-MCU (STM32/PIC/ATmega) examples MD doesn't provide. Missing: the **bus concept** (how CPU, memory and I/O peripherals communicate internally via signal paths) and MD's **programming-language taxonomy** (low-level assembly vs. high-level BASIC/C/C++, and the point that language support is manufacturer-determined) — both distinct, nameable concepts with no equivalent on the page.

- **B3.4.9** (Logic) — ⚠️ Adequate but thin. Binary representation, Boolean algebra (AND/OR/NOT), truth tables and the combinational-vs-sequential distinction (with flip-flops correctly identified as the memory element behind sequential circuits) are all covered accurately. Missing: MD's **XNOR-gate-based digital/magnitude comparators** (comparing multi-bit binary numbers from MSB to LSB to determine greater-than/less-than/equal-to) and the **synchronous vs. asynchronous** sequential-circuit distinction (whether a clock coordinates state changes) — both named sub-concepts absent from the page.

- **B3.4.11** (Communication protocols) — ⚠️ Adequate but thin. Bluetooth (2.4 GHz, frequency hopping, GAP for device discovery), Wi-Fi and 5G are clearly compared against the page's own stated objective, with a clean range/speed/power/infrastructure comparison table and the Australia 3G-shutdown case study retained in shortened form (per the duplication-cleanup note above, this is expected and not a gap). But MD devotes a very large section to communication-protocol taxonomy that mostly doesn't survive: the **TCP/IP four-layer model** (Application/Transport/Internet/Link, with HTTP, POP3, TCP, UDP, IP and Ethernet/IEEE 802.3 each named and explained) has no equivalent at all, and of MD's roughly fifteen named Bluetooth sub-protocols (GATT, ATT, SMP, RFCOMM, OBEX, A2DP, L2CAP, HCI, Voice CODEC, Link Manager, LMP, and others), only GAP is individually explained — the rest are absent rather than just summarised. MD's Wi-Fi Alliance origin story (founded 1999, the 2018 shift to simplified "Wi-Fi 6"-style generational naming) and the Bluetooth name's etymology (10th-century Danish king Harald "Bluetooth" Gormsson, referenced in the logo's combined runes) are both dropped. *Expand: the TCP/IP model is the more consequential gap given how foundational it is to networked-product design generally, though it sits somewhat outside this sub-point's narrowly-stated Wi-Fi/Bluetooth/5G objective.*

**B3.4 overall:** The most uneven sub-page in B3 — five sub-points (3.4.2, 3.4.4, 3.4.5, 3.4.7, 3.4.10) are comprehensive or clearly exceed MD, several of them substantially, while B3.4.1 stands out as the clearest single gap in the whole B3 topic: a nearly-200-line MD section (transistor/IC invention history, the refrigerator case study, the eight-step integration process) reduced to a single introductory paragraph. The rest of the page's weaknesses are consistent with a pattern seen throughout B3.4 — named historical attributions (Hooke, Young, the Bell Labs transistor team, Wi-Fi Alliance, Bluetooth's Harald Gormsson etymology) and named sub-taxonomies (conductance/resistivity, XNOR comparators, the TCP/IP stack, most of Bluetooth's protocol stack) are the recurring casualties of compression, not the core calculation-based learning objectives, which are taught at least as well as MD throughout.

**B3 overall:** A more uneven topic than A3, its companion — B3.1 (Material Selection) is comprehensive across three of four sub-points, but B3.2, B3.3 and B3.4 each carry at least one significant, clearly-bounded gap: B3.2.4's missing truss-analysis methods (method of joints, method of sections, named truss types), B3.3.1's dropped gear/belt history and IMA/AMA terminology, and — the largest single gap found anywhere in B3 — B3.4.1's near-total loss of MD's transistor/IC invention history and refrigerator case study. Encouragingly, the calculation-heavy "application" objectives that give this topic its name (stress-strain worked examples, safety factors, velocity ratio and efficiency, Ohm's Law and RC circuits, sensor selection) are taught as well as or better than MD almost everywhere, with several standout bonus additions (Euler's Critical Buckling Load, the Hyatt Regency and Smoke Detector case studies, PWM). The recurring pattern across all four sub-pages is consistent with the rest of this review: named historical narratives, named sub-taxonomies and secondary worked examples are the first casualty of compression, while the core testable mechanics survive intact or improved.

---

## Outstanding graphics and assets

Every image, diagram, video and activity still to be made or sourced, including those belonging to sub-points whose text is complete. Tasks already finished have been removed.

### A1.1

- **A1.1.1** — Applied product example images (office chair, keyboard/mouse, medical device, automotive HUD, kitchen knife).
- **A1.1.2** — Chart of anthropometric measurement methods (calipers, 3D scanning) and demographic data ranges.
- **A1.1.3** — Crash-test-dummy timeline graphic (Sierra Sam, first female dummy 1980s, 2022 Swedish dummy) and an SD/68-95% distribution chart.
- **A1.1.5** — Diagram showing multivariate body-dimension variation (why one percentile choice doesn't guarantee coverage across dimensions).
- **A1.1.6** — Sporting-equipment ergonomics images (tennis racquet, golf club, javelin) and visual/hearing design-application examples (push/pull door signage, volume limiters, alarm acoustics).
- **A1.1.7** — Office-environment comfort model chart (lighting/acoustics/air quality/worker density).

### A2.1

- **A2.1.1** — Overcomplication example images (microwave control panel, ATM, texting-while-walking accident statistic).
- **A2.1.2** — Stay-on-tab can historical image (Petroski example).
- **A2.1.3** — Multidisciplinary team diagram showing all ~10 named disciplines.
- **A2.1.4** — Worked business-example images (supermarket field research, gaming user observation, coffee-machine focus group).
- **A2.1.5** — Driving-side history timeline/map and UK/Australia plug earth-pin safety comparison graphic.

### A2.2

- **A2.2.2** — Pictures from old textbook.
- **A2.2.2** — General-assembly vs sub-assembly drawing example and a Dürer's-window historical image.
- **A2.2.4** — Architectural-model scale-convention images (1:100 landscape vs 1:20 building). *Clay-modelling imagery is no longer needed; the case study now carries it.*
- **A2.2.5** — Before/after graphic of a solid bracket beside its optimised lattice version; ideally a screenshot of the Fusion outcome-comparison scatter plot.
- **A2.2.5** — Haptic-technology taxonomy diagram (graspable/wearable/touchable) with named devices.

### B1.1

- **B1.1.2** — A likert survey specific to my site to get actual feedback.
- **B1.1.2** — Method of Extremes diagram (95th-percentile doorway/escape hatch, 5th-percentile control force).
- **B1.1.3** — Anti-persona real-world example graphic (McDonald's/vegan customers, Trainline non-purchaser flow, cybersecurity hacker defence).
- **B1.1.4** — Poka-yoke examples gallery (battery-placement keying, child-proof medication caps, colour-coded fuel nozzles, medical sponge-count checklists, limit switches).

### B2.1

- **B2.1.2 & B2.1.3** — Taste-in-design framework graphic (user-centred appeal, cultural relevance, brand identity, sustainability/longevity) with Apple/IKEA examples.
- **B2.1.2 & B2.1.3** — Accessibility-technology example images (text-to-speech, braille banknotes, tactile pavements, AI currency-reader apps).
- **B2.1.4 & B2.1.5** — Research-bias taxonomy chart (cognitive: confirmation/framing/anchoring/availability; social: social desirability/Hawthorne/cultural; researcher: selection/leading questions/interpretation) with worked examples.
- **B2.1.6** — Walkthrough for user journey storyboard.
- **B2.1.6** — Use the same idea and create a 'comic strip' to represent the user journey storyboard, focusing on a refrigerator that doesn't fully seal when the shelves inside the door are loaded with bottles (as intended)
- **B2.1.7** — A/B testing, benchmarking and SWOT technique name-check graphic.
- **B2.1.8** — Full worked design-brief example (airport luggage tag) including market analysis and timeline.
- **B2.1.11** — AI-assisted (ChatGPT) design walkthrough example for the luggage-tag brief (naming, logo generation).
- **B2.1.12** — Agile sprint-cycle diagram and Kaizen/PDCA origin graphic.
- **B2.1.14** — Drawing-standards note (AS 1100 series) with the seven reasons standards matter.
- **B2.1.15** — Sydney Opera House (Utzon spherical geometry) and Guggenheim Bilbao (Gehry, CATIA, titanium, BIM) case-study images.

### B2.2

- **B2.2.2** — Fidelity-by-purpose 3×2 matrix chart and a prototype-review checklist.
- **B2.2.3** — Surface vs solid modelling technique diagram (NURBS, polygon meshes, subdivision surfaces vs. CSG, B-rep).
- **B2.2.5** — 7-step CAD-construction workflow diagram and a testing checklist (1.2mm min wall thickness, 45° overhang threshold).
- **B2.2.6** — Generative-AI modelling case study images (2019 Starck/Kartell/Autodesk AI-designed chair).

### C1.1

- **C1.1.1** — Eco-friendly product category images (reusable bags, recycled PET, solar devices, biodegradable products, recycled clothing) to balance the negative examples.
- **C1.1.3** — Technological-obsolescence timeline graphic (timekeeping, refrigeration, displays CRT→OLED, sound formats cylinder→streaming).
- **C1.1.3** — Named-fad images (Troll Dolls, Pet Rocks, Beanie Babies, Tamagotchi).

### C2.2

- **C2.2.4** — ELV Directive recovery-rate chart (85% by 2006, 95% by 2015) and a WEEE nine-category product list.

### C3.1

- **C3.1.5** — Case study on in-house testing confirmation-bias risk vs. commissioning independent external labs.

### C3.2

- **C3.2.1** — LCA historical-development timeline (early-1990s origin, EU Integrated Product Policy) and a Fortune 500 sustainability-reporting stat graphic.
- **C3.2.3** — Environmental Impact Assessment Matrix worked example (diesel vs. biodiesel vs. hydrogen, 0-4 scoring) and an SLCA (Streamlined LCA) concept graphic.

### C4.1

- **C4.1.1** — Thonet No. 14 bistro chair case-study images (ties DfP/DFA/DFD together, 50M+ sold since 1859).
- **C4.1.2** — Smartphone-stand design walkthrough diagram (define requirements → simplify → select materials → optimise process).
- **C4.1.3** — Flat-pack housing origin images (1849 corrugated-iron houses, Sears Roebuck's 1908 mail-order house kits).
- **C4.1.4** — Flashlight/torch DFD worked-example diagram (snap-fit casing, modular lens/reflector, standardised O-rings).

### A4.1

- **A4.1.1** — Discrete vs process manufacturing comparison graphic.
- **A4.1.2** — Paper-based rapid-prototyping (SDL/LOM) example images.
- **A4.1.4** — ISO/ASTM 52900 seven-category AM chart with PBF sub-variant detail (MJF, SLM, EBM, SLS).
- **A4.1.7** — Oxy-acetylene cutting process image/video (flashback arrestor safety mechanism).
- **A4.1.8** — Bending/press-forming/hydroforming process diagrams.
- **A4.1.8** — Composite-moulding process images (hand lay-up, vacuum bagging, resin transfer moulding, pultrusion, compression moulding).
- **A4.1.8** — Investment-casting history images (Cellini's Perseus, WWII jet-turbine-blade adoption).
- **A4.1.9** — Hot-riveting historical image/video (four-person team) and a Kevlar/Kwolek history graphic.
- **A4.1.10** — Electro-galvanising vs Sherardising comparison graphic.

### B4.1

- **B4.1.1 & B4.1.2** — Jacquard's 1804 punch-card loom historical image — direct ancestor of the CNC/automation content on this page.

### A3.1

- **A3.1.1** — Still open (checked Aug 2026: this line was marked "Complete!" but the page contains no periodic-table content and there is no matching page under `tools/`). Need to add periodic table of elements, which can be built as an activity that shows course-related uses of elements.
- **A3.1.1** — Metal classificiation chart showing ferrous and non-ferrous.
- **A3.1.1** — A chart of composites that breaks down by matrix or reinforcement.
- **A3.1.2** — Images showing **solid** and **combination** structures. (Shell and frame are done: `A3.2/shell.jpg` and `A3.2/frame.jpg`, though both are currently used only on the A3.2 page, not on A3.1.)
- **A3.1.4** — Chart covering thermal conductivity for a range of materials.
- **A3.1.4** — Chart covering melting point for a range of materials.
- **A3.1.4** — Chart covering electrical resistivity and conductivity for a range of materials.
- **A3.1.4** — Provide representation of insulators, semiconductors, and conductors- as an interactive or semi-animated.
- **A3.1.5** — Locate and share food safety labels and chemical warning labels.
- **A3.1.6** — Animated stress-strain graph.
- **A3.1.6** — Create Young's Modulus activity/chart.
- **A3.1.7** — Provide videos and pictures of composites in action.
- **A3.1.8** — A visual for piezoelectricity (a lighter will do)
- **A3.1.8** — Visuals for a shape memory material.
- **A3.1.9** — Add a table detailing biodegradeable materials, how long they take to decompose, and what is required.

### A3.2

- **A3.2.1** — Shell and frame visuals are in place (`A3.2/shell.jpg`, `A3.2/frame.jpg`). Still need a **solid** structure visual, and one for **combination** structures.
- **A3.2.2** — Shell and frame visuals are in place (`A3.2/shell.jpg`, `A3.2/frame.jpg`). Still need a **solid** structure visual, and one for **combination** structures.
- **A3.2.3** — Images (Build Lego representations).
- **A3.2.4** — Create an activity allowing students to explore forces on a structure.
- **A3.2.6** — A table detailing materials, modulus of elasticity, and applications.
- **A3.2.8** — Images- construct with Lego.
- **A3.2.8** — Details about pre-stressed/pre-tensioned concrete and where struts, shape, lamination, and composite materials are used in structures.

### A3.3

- **A3.3.1** — Include demonstrations of the four mechanical systems constructed with Lego technic (and real examples)
- **A3.3.3** — Ensure topic is adequately explained.
- **A3.3.4** — Simple illustration to show operations.
- **A3.3.5** — Create a Lego representation of a salad spinner and others.
- **A3.3.7** — Create belt demonstrations using Lego technic.
- **A3.3.10** — Demonstrate bolt cutters for reverse linkage.
- **A3.3.10** — Create a parallel linkage extension X pattern demonstration.

### A3.4

- **A3.4.2** — Source enery rating labels.
- **A3.4.4** — Web activity for electrical diagrams.
- **A3.4.4** — Link to circuit building web resource.
- **A3.4.4** — Explore frequency with drawings, web materials.
- **A3.4.5** — Locate logic gate activity or create one.
- **A3.4.7** — Images of sensors from the workshop.
- **A3.4.9** — Photo examples.
- **A3.4.14** — A chart of all electrical circuit diagram symbols.

### B3.1

- **B3.1.2** — Source images/swatches demonstrating the five aesthetic senses (colour, texture, form, sound, smell) across different material finishes.
- **B3.1.4** — Photos or video of hardness/toughness test equipment (Charpy, Izod, Brinell, Vickers, salt-spray) in use.

### B3.2

- **B3.2.2** — Or link to an animated stress-strain graph walkthrough.
- **B3.2.3** — Source images/footage of the Quebec Bridge, Tacoma Narrows, and Hyatt Regency collapses.
- **B3.2.4** — Truss diagram images (Howe, Warren, Pratt, Fink, K) for future truss-analysis content.

### B3.3

- **B3.3.1** — Build a Lego Technic belt/pulley demonstration for mechanical advantage.
- **B3.3.4** — Build Lego Technic compound gear train and stepped cone pulley demonstrations.
- **B3.3.5** — Build a Lego Technic cam-and-follower demonstration showing rise/fall/dwell.

### B3.4

- **B3.4.1** — Source a transistor/IC invention history timeline graphic (Bell Labs, Kilby/Noyce) and refrigerator case-study images.
- **B3.4.2** — Workshop photos of DMM, DSO, clamp meter and function generator setups.
- **B3.4.3** — Resistor construction images (carbon film, metal film, Nichrome wirewound) and an IEC 60309 plug colour chart.
- **B3.4.6** — Wiring diagram examples and international plug-type images.
- **B3.4.7** — Photos of sensors from the workshop.
- **B3.4.8** — Photos of embedded boards (Arduino, Raspberry Pi, STM32/PIC) from the workshop.
- **B3.4.9** — Locate or create a logic-gate/XNOR comparator activity.
