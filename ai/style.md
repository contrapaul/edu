# AI in Education: style notes

Starting point, 2026-09-16. Visual and writing direction for `edu/ai`. Everything here is provisional until Paul supplies the motivation and direction for the project.

## From the brief

- 1 to 3 long, responsive pages. Elements load in as the reader scrolls.
- Slick, interactive, presentation-ready pages that teachers can use in class.
- A glossary connected to terms throughout the pages.
- Space for rationale and explanation of the project itself.
- Lives at `edu/ai`. May earn a place among the personal projects and perhaps the site header later.
- `make/localai` is a reference for broad ideas, not for copying style or specific functions. To be revisited once the project is built.

## Site constraints that apply here

- Served by Cloudflare Pages straight from source. No build step, no bundlers, no bare module specifiers. Load JSON with `fetch`.
- Shared tokens live in `/style.css` (`--bg`, `--surface`, `--accent`, `--font-body` and so on). Light, dark and win95 themes live in `/curriculum/themes.css`, applied by `data-theme` on `<html>` and stored in `localStorage` as `edu-theme`. Decide early whether these pages inherit the site's themes or carry their own look. If they carry their own, they still need a light and dark mode.
- The site header markup in `/index.html` is the reference if these pages take the standard header.

## Writing rules (site-wide, absolute)

- No em dashes anywhere, in any file: page copy, JS strings, comments, markdown.
- No "not just X, it's Y" in any variant.
- Don't label the obvious. No "interactive diagram" tags over a diagram.
- Audience is upper middle and high school students, plus their teachers. Use correct terminology and define it in place. Complete sentences, not single-clause fragments.

## Worth borrowing from `make/localai/style-guide.md`

These held up well there and fit this project's audience.

- Two failure modes: talking down and assuming. The target is a good textbook, plain and unhurried.
- Every technical term gets defined in plain words at first appearance in body text, then marked up as a glossary term. Never define a term with another undefined term. Define once, then rely on the glossary.
- Headers are plain noun phrases that name the topic. No rhetorical questions, no metaphors, no term making its first appearance in a header.
- No rule of three, no reveals, no throat clearing. State the mechanism, not the vibe.
- Second person, active voice, contractions, the everyday word.
- Three to six sentences per explanatory block, then a visual, a control or a break.
- Every number carries a referent the reader can hold, and every authoritative number carries a source.

## Visual direction (open)

- localai went with glassmorphism, a single indigo to cyan accent, system font stack, a 4/8/12/16/24/32/48 spacing scale, and a 13 to 48 px type scale. None of that should be copied, but the discipline of tokenizing everything (colors, spacing, type, motion durations and easings) in one CSS file is worth keeping.
- All visuals built from CSS, SVG and canvas so nothing needs external assets. Same approach here unless the direction calls for imagery.
- Motion: one-way scroll reveals (arrive, then stay). localai learned the hard way that reversible reveals bounce when a reader stops scrolling at the trigger edge. Respect `prefers-reduced-motion`.
- Presentation pages need to read well when projected: large type, high contrast, generous spacing, and nothing that depends on hover.

## Open questions for Paul

- Inherit the edu site themes and header, or a distinct look for this project?
- Desktop first with mobile secondary (localai's choice), or fully responsive from the start? The brief says responsive.
- Tone for the rationale section: first person from Paul, or the same textbook voice as the rest?
