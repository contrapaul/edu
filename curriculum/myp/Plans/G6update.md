# G6 Lego Designers — Page Update Plan

Plan for rebuilding [g6-lego-designers.html](../g6-lego-designers.html) to match the quality and structure of [g10-studio-project.html](../g10-studio-project.html). The current G6 page is a 93-line stub whose intro text is inaccurate (describes a physical Lego building challenge; the real unit is designing a new Lego set in Bricklink Studio).

## Source documents reviewed

| File | What it provides |
|---|---|
| `Lego Designers 2025-2026 MB.pdf` | ManageBac unit plan: summary, concepts, SOI, inquiry questions, ATL skills, full day-by-day lesson sequence (~42 days), assessment list, teacher reflections |
| `G6 Lego Design B 2026.pdf` | Criterion B student task sheet (Canva): What & Why, Success Criteria, Inspiration, Rough Drafts, Design Specifications, B1–B4 rubric |
| `G6 Lego Set Design C.pdf` | Criterion C student task sheet: success criteria carry-over, 10-day plan, daily documentation pages, final poster, C1–C4 rubric |
| `G6 Lego Criteria D-1.pdf` | Criterion D worksheet: survey questions, success-criteria evaluation, improvements, goal reflection, D rubric |

**Gap: there is no Criterion A task sheet in the folder.** The ManageBac plan describes it (Lego research: choose sets, complete analysis of 4 different sets, "criteria A pamphlets" handed in on paper) but the actual task content and rubric are not available. Criterion A section will need to be drafted from the MB lesson notes — or provide the Criteria A pamphlet/task sheet to fill it in properly.

## Page framework (mirror G10 structure)

- Same HTML skeleton: `site-header`, `myp-hero`, `curr-page-layout` with sticky `curr-toc`, collapsible `curr-section` blocks with `curr-trigger`/`curr-body`, nested `obj-trigger` task blocks, `content-table` rubrics, `topic-page-nav` footer links.
- `body data-curr-type="myp" data-curr-page="g6-lego-designers"`.
- Per-criterion accent colors via `--curr-color` (reuse the G10 palette: intro `#5c5470`, A `#1a5cb8`, B `#3d6b4a`, C `#8b4a1a`, D `#4a3d7a`, reference `#2d7a6a`).
- Scripts: `curriculum.js`, `curr-toc.js`, `curriculum-themes.js`, plus a `g6-lego-designers.js` if the page needs the same expand/collapse wiring as G10's page script.
- Prev/next nav: link forward to `g7-lego-engineers.html` ("Next → Lego Engineers (Grade 7)"). G6 is first in the MYP sequence, so no Previous link (or link back to the MYP index).

## Hero block

- **Title:** Lego Designers
- **Meta:** Grade 6 · Year 1 · Teacher Resource
- **Statement of Inquiry:** "Designers must develop research, planning, and evaluation skills to create good products."
- **Intro paragraph (rewrite the stub):** Students engage with the design cycle and learn about product design to plan and create a new Lego set. They develop research, planning, and evaluation skills, using Bricklink Studio to construct sets, render images, and create instruction booklets. Skills lay a foundation for success across MYP and DP design.
- **Logistics chips:** `6 weeks · 40 hours` · `~42 lessons` · `Bricklink Studio` · `4 summative assessments (A–D)`

## Introduction section (00)

- **Unit overview:** description from MB plan; note the unit opens with ~7 lessons of Bricklink Studio skill-building (tutorials, building official sets from instructions, dice guided build, rendering, Part Designer custom pieces) before Criterion A begins.
- **Key/Related Concepts & Global Context:** Systems; Evaluation, Form; Personal and Cultural Expression.
- **Inquiry questions table** (from MB plan):
  - Factual: main Lego product lines and differences; how Bricklink Studio helps create 3D models; key elements of product design for Lego sets.
  - Conceptual: why research matters before designing; what makes a set engaging to build/play; how user feedback improves design.
  - Debatable: why package design matters; is Lego educational or just a toy?
- **ATL skills:** Research — Information Literacy; Thinking — Creative Thinking (short prose paragraph like G10, drawn from the MB skill lists).
- **Unit at a Glance table** (equivalent of G10's submission table), phases from the MB day-by-day plan:

  | Phase | Focus | Lessons |
  |---|---|---|
  | Studio Training | Bricklink Studio tutorials, builds, rendering, Part Designer | 1–7 |
  | Criterion A | Lego research — set analysis ×4, research pamphlet | 8–12 |
  | Design Challenge | Build a set from images only (piece recognition) | 13 |
  | Criterion B | Planning: success criteria, inspiration, rough drafts, specifications | 14–20 |
  | Criterion C | Creating the set: build, document daily, box design, renders, instructions | 22–34 |
  | Criterion D | Evaluating: surveys, interviews, success criteria review, improvements | 35–38 |
  | Final Revisions | Incorporate feedback, complete the design cycle | 39–41 |

- **Where to submit:** Canva workbooks exported as PDF to ManageBac; Criterion C also requires the Studio `.io` file; Criterion D is completed on paper and photographed.

## Criterion A — Inquiring and Analysing

Thinnest source material (no task sheet). Build from MB lesson notes; keep to one or two task blocks rather than inventing strands:

- **Task block — Lego Set Research:** students choose Lego sets to explore via Lego.com, Brickipedia, and Bricklink Studio, and complete analysis of **4 different sets** that could inspire their own work. Completed as a paper "research pamphlet," preceded by a formative practice research task.
- Note the formative scaffold: Design Studio Quiz (Bricklink Studio) and formative research task before the summative.
- **No rubric available** — placeholder pending the Criteria A task sheet. Flag clearly in the draft rather than fabricating descriptors.

## Criterion B — Developing Ideas (task sheet: `G6 Lego Design B 2026.pdf`)

Format note for intro: workbook is a Canva template with Mr. K's fantasy-football worked example ("Anvil Mountain Stadium" / Brick Bowl theme) on yellow pages that students delete before submitting. A grade 7–8 quality example is provided in full.

Task blocks:
1. **What and Why** — 1 sentence on what they want to design; 3–4 sentences on why it's a good idea (worked example: Lego fantasy football inspired by Blood Bowl).
2. **Success Criteria** — 4+ criteria, each explained in 1–2 sentences; must be ACHIEVABLE and MEASURABLE; revisited in Criterion D. Include the example table (2 teams of 11 players; looks fun; customizable; portable; under $150).
3. **Inspiration & Bits and Pieces** — collect images from the Lego website and Brickipedia to identify pieces and construction methods.
4. **Rough Drafts** — 3 rough pictures from Studio showing how the set could look.
5. **Design Specifications** — structured table: Name of Set, Estimated Pieces, Theme, Price (RMB and USD), Features, Description. Include the Anvil Mountain Stadium worked example.

**Rubric:** transcribe the four-strand task-specific clarifications (B1 Design Specification, B2 Develop Design Ideas, B3 Present Chosen Design, B4 Planning Drawings/Diagrams) into 1–2 / 3–4 / 5–6 / 7–8 tables, one per strand (same pattern as G10's per-task rubric tables).

## Criterion C — Creating the Solution (task sheet: `G6 Lego Set Design C.pdf`)

⚠️ **Source PDF contains stale Grade 7 template text** (title page SOI references Lego Technic machines, "Grade 7", "Creating Your Lego Machine"; rubric strands mix "machine" and "set" wording). The page should present the G6 set-design version consistently — cross-check against the MB plan (box design, renders, instructions, `.io` file). Worth also fixing the source Canva doc; note this as a follow-up.

Task blocks:
1. **Success Criteria Carry-Over** — copy success criteria from Criterion B to the front of the workbook; they steer the build.
2. **Production Plan** — 10-day plan completed before building, updated as work progresses. Required to-do items: check stability/strength, fix issues, ensure buildable in real life, made like a real Lego set, create instructions (pieces into steps), pose figures/background details, render lots of images, create final poster.
3. **Daily Documentation ×10** — each day: 1–3 pictures, what should be finished today (expanded plan detail), did you finish (explain / recovery plan), any changes to plans or ideas (what and why). Fresh start required — students may not reuse their Criterion B rough draft as the finished product.
4. **Final Deliverables** — box design (template provided), 2 pages of instructions, 6+ carefully planned renders, final poster (2 pictures of finished model, labels, 1 explanatory paragraph), Studio `.io` file. Submission: Canva PDF + box design PDF + instructions + `.io` to ManageBac.

**Rubric:** transcribe C1–C4 task-specific clarifications (plan quality; strong/stable build; followed plan + box design "looks like a real Lego set" + 6+ renders + organized instructions; changes documented) — normalizing "machine" → "set" per the stale-text note above.

**Policy note:** "NO AI USE AT ALL FOR THIS ASSESSMENT" appears throughout — surface in this section and in Clarifications.

## Criterion D — Evaluating (worksheet: `G6 Lego Criteria D-1.pdf`)

Format note: paper worksheet (bilingual EN/中文), photographed and uploaded to ManageBac. Goal framing: the set should look like it could really be sold by Lego AND meet the student's own success criteria.

Task blocks:
1. **Survey Questions (1a/1b)** — choose 5 survey questions; ask 3 students and 2 teachers outside the homeroom; record answers; ask follow-ups for incomplete answers. Uses Mr. K's question-helper tool (link it if it lives under /tools).
2. **Was it a Success? (2)** — restate each success criterion from the Criterion B planning SA and respond: was it achieved? Details and reasons required.
3. **How Can I Improve? (3)** — bulleted list with explanations of concrete improvements.
4. **Did You Accomplish the Goal? (4)** — 120+ words on whether the set looks like something Lego would sell (renders realistic? stability? built strongly? looks fun?).

**Rubric:** transcribe the 1–2 / 3–4 / 5–6 / 7–8 band descriptors (interview question quality → success stated against criteria → improvements outlined → impact on audience).

## Clarifications & Reference section

- **AI policy** — no AI use on assessments (consistent with the C task sheet; G10 has an equivalent section).
- **Formative work** — Design Studio Quiz, formative research task, formative planning task, rendering challenge, design challenges (build from images / speed challenges).
- **Tools & links** — Bricklink Studio, Lego.com, Brickipedia, question-helper tool.
- **Task sheet downloads** — `ref-list` cards for the three student-facing PDFs (Criteria B, C, D; add A when available). Decide whether to keep the dated filenames or produce year-agnostic copies like the G10 PDF ("No specific year info").
- **Command terms table** — optional; G10 includes the full MYP command-term table. For G6, a trimmed set (state / outline / describe / explain / create / evaluate) may fit the audience better.

## Open questions before building

1. **Criterion A task sheet** — can you provide the pamphlet/task sheet so the A section and rubric are real rather than reconstructed?
2. **Dates** — G10's page is year-agnostic. Strip specific dates (Nov 6, Nov 11) from the G6 page in favor of lesson counts?
3. **C task sheet cleanup** — should fixing the stale G7 "machine" text in the source Canva/PDF be part of this work, or page-only for now?
4. **Class-count chips** — MB says 6 weeks / 40 hours but the lesson table runs ~42 days; confirm which framing you want on the hero chips.

## Build checklist

1. Draft new `g6-lego-designers.html` following this plan → verify: structure matches G10 (TOC, collapsibles, rubrics render).
2. Copy student-facing PDFs referenced by download cards into `curriculum/myp/` (or link into `Plans/`) → verify: links download.
3. Add page script if needed for expand/collapse parity → verify: behavior matches the G10 page in browser preview.
4. Update `curriculum/myp/index.html` card text for G6 if it repeats the stale intro → verify: grep for old wording.
