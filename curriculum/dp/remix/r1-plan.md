# R1 cross-reference page: plan

**Status:** approved and built 10 October 2026 as `r1-crossref.html`, with a notes box per row. Quizzes, Paper 2 practice and references (sections 4 to 6) were left off the test build.

## What the page is for

An editorial worksheet for R1 Bodies and inclusion. It puts the existing content for R1 on one long page, with the parts that would merge laid out side by side, so you can read across and decide what to merge, keep and cut. It is not a draft of the final unit page and does not try to look like one.

## Where it lives

| File | Purpose |
| --- | --- |
| `curriculum/dp/remix/r1-crossref.html` | The page. Unlisted: no links to it from the site, and `noindex` in the head. |
| `curriculum/dp/remix/build-crossref.py` | A script that assembles the page from the live topic pages. It copies content, it does not rewrite it. Re-running it picks up any edits made to the source pages since. Written so R2 onwards can reuse it with a different row list. |
| `curriculum/dp/remix/r1-plan.md` | This file. |

Building from a script rather than by hand means the copy on the cross-reference page is exactly the copy on the topic pages, and nothing drifts while you are annotating.

## What goes on the page, top to bottom

### 1. Unit focus

Taken from the R1 section of `remix.md`: guiding question, the understandings it absorbs, what it teaches once, why these belong together, value measures, IA link. A one-line key below it showing which source page each colour of label stands for (A1.1, C1.2, B1.1).

### 2. Course notes introductions

The A1.1 and C1.2 introductions side by side, since a merged unit needs one introduction.

### 3. Merge rows

Each row is one idea in the proposed R1 order. Each column is one source, labelled with its code, its understanding and "students must" text, its source page, and a link back to that objective on the original page. Rows with only one source run full width.

| Row | Idea | Columns |
| --- | --- | --- |
| 1 | What ergonomics is | A1.1.1 |
| 2 | Measuring bodies, and what changes the data | A1.1.2 |
| 3 | Percentiles, and why the average fits nobody | A1.1.3, A1.1.5, C1.2.2 |
| 4 | Fitting a range: adjustability and sizes | A1.1.4 |
| 5 | Physical limits and designing for impairment | A1.1.6, C1.2.1 |
| 6 | Design for extremes | C1.2.3, the B1.1 "Method of Extremes" box |

A1.1.5 sits in row 3 because most of it (reach against clearance, the multivariate problem) is percentile reasoning, and that is what C1.2.2 repeats. A1.1.2's paragraph on disability also relates to row 5; it stays in row 2 with a visible note pointing to row 5, rather than being copied twice.

A1.1.7 (psychology and the senses) is not on the page. It belongs to R3.

### 4. Quiz questions under each row

The quiz questions are already tagged by objective (for example "Q4 · 1.1.3 Percentiles"), so each row shows its own questions under the content, with answers and explanations visible. That puts the duplicated questions next to each other: A1.1 Q4 and Q5 sit beside C1.2 Q5 to Q7 in row 3, for example. A1.1 Q10 and Q11 are 1.1.7 questions and are left out.

### 5. Paper 2 practice

The three A1.1 questions and three C1.2 questions side by side at the end, with example answers and markschemes visible. These are tagged by topic rather than objective, so they cannot be placed under rows.

### 6. References

Both reference lists side by side, so duplicate sources are easy to spot.

## How content is shown

- Everything is visible. No accordions, no collapsed sections, no "show answer" buttons.
- Spotlight and case-study cards (Xbox controller, standing desks, Aeron, Typewriter) are shown with their full modal text inline under the card, instead of opening a modal.
- Interactives keep working: the three A1.1 widgets (Static or Dynamic, Where Do You Fit on the Curve, Percentile Lookup) run from the existing `a1.1.js`. They will appear in rows 2 and 3, where they already sit.
- Images use the existing files, with paths adjusted for the new folder. Images that have an empty `src` (13 across A1.1 and C1.2, some of them in A1.1.7) keep their alt text, shown as a visible placeholder so you can see what is meant to go there.
- Styling is `curriculum.css` only, for tables, concept boxes and activity blocks to read normally, plus a few lines of layout for the columns. No themes, presentation mode, table of contents or glossary tooltips.
- Columns are equal width and use the full window, since side-by-side reading needs the space. Below roughly 900 px they stack.

## Your notes

Two options. I would suggest the first.

1. **A notes box at the end of every row**, typed into directly, saved in your browser as you go, with a "Copy all notes" button at the top that copies them as Markdown grouped by row. You could then paste them back to me as the brief for the merge.
2. **No notes box.** You annotate however you prefer (print, PDF markup, a separate file).

## Checks before handing it over

- Every R1 understanding (A1.1.1 to 1.1.6, C1.2.1 to 1.2.3) and the B1.1.2 box appears exactly once.
- Every quiz question for those objectives appears exactly once, with nothing from 1.1.7.
- All three widgets work, images load, and the browser console shows no errors.
- Spot checks that copied text matches the source pages word for word.

## Questions for you

1. Notes box (option 1) or no notes box (option 2)?
2. Is the row order and grouping above how you want to read it, or would you rather see the original page order with matches pulled alongside?
3. Should the quizzes sit under each row (as planned), or all together at the end like Paper 2?
