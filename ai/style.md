# AI in Education: style notes

Started 2026-09-16. Visual and writing direction for `edu/ai`. Provisional until the visual direction is chosen.

## From the brief

- 1 to 3 long, responsive pages. Elements load in as the reader scrolls.
- Slick, interactive, presentation-ready pages that teachers can use in class.
- A glossary connected to terms throughout the pages.
- Space for rationale and explanation of the project itself.
- Lives at `edu/ai`. May earn a place among the personal projects and perhaps the site header later.
- `make/localai` is a reference for broad ideas, not for copying style or specific functions. To be revisited once the project is built.

## Tone (proposed, from the motivation)

The site argues a position: the 2023 opinion of AI is stale, and students need to be taught to use it well rather than told not to. That position has to be earned on the page, which sets the tone.

- **Not an advertisement.** The site is written by a teacher who uses these tools and has seen students misuse them. Every claim that AI helps is paired with the way it fails if used badly. The "one question versus a conversation" activity is the model: the tool is the same, the outcome depends on the person.
- **Show, then say.** The stale-opinion argument is made by a real 2023 transcript next to a real current one, dated. Not by a paragraph saying "AI has improved."
- **Concrete over abstract.** "Asked AI to fix grammar in a finished essay" beats "using AI for editing." Every scenario, every example, every activity is a specific situation a student or teacher would recognize.
- **Fair to the other side.** The teacher who says "no AI" has a reason, and the site says what it is (they've seen students hand in AI essays) before arguing with it. Same for the Wikipedia ban: it was wrong, but it wasn't stupid.
- **Honest about the author.** Paul's own cases are presented with their pushback points, and the site cites its own AI use on the about page. Teachers reading the reluctance material see it modeled rather than preached.
- **Two audiences on one page.** Students are the main reader. Teachers read over their shoulder and also have their own material. Where the two need different voices (the reluctance scenario is for teachers), say who it's for at the top of the section rather than switching tone mid-page.
- **Rationale page in first person.** The about page is Paul's voice. The rest is the textbook voice below. Proposed; Paul to confirm.

## Site constraints that apply here

- Served by Cloudflare Pages straight from source. No build step, no bundlers, no bare module specifiers. Load JSON with `fetch`.
- Shared tokens live in `/style.css` (`--bg`, `--surface`, `--accent`, `--font-body` and so on). Light, dark and win95 themes live in `/curriculum/themes.css`, applied by `data-theme` on `<html>` and stored in `localStorage` as `edu-theme`. Decide early whether these pages inherit the site's themes or carry their own look. If they carry their own, they still need a light and dark mode.
- The site header markup in `/index.html` is the reference if these pages take the standard header.

## Reading level (settled 2026-09-16)

Target readers are grades 9 to 12. The language is written at a grade 6 to 8 level, for students and teachers alike, so that understanding doesn't depend on strong English and the text translates cleanly into Chinese later. Complexity is scaffolded by the glossary, hover definitions and examples, not by harder sentences. In practice: short common words, one idea per sentence where possible, technical terms defined at first use and marked for the glossary, and no idioms that don't survive translation. This is a constraint on vocabulary and sentence structure, not on ideas. The ideas stay as sharp as they are.

## Writing rules (site-wide, absolute)

- **No double titling.** A section gets one title. Not a small uppercase label above a heading that says the same thing twice ("A BELIEF THAT GOT STUCK" over "Wikipedia, then AI"). Paul calls this a hallmark of AI-assisted web design (2026-09-18). Small labels are for metadata that isn't a title: a model name, a date, a status tag such as "Placeholder".
- **The page must not read as AI-written.** Paul will rewrite much of the copy, but the drafts should give him something to keep. The tells to avoid, beyond the em dash and "not just X": short punchy fragments used as reveals ("That tool no longer exists."), the closing clause that restates the point ("That is also the lesson here."), triads, and the colon that splits a catchy half from an explanatory half. Prefer a longer, complete sentence that says the mechanism.
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

## Transcripts and mockups (proposed conventions)

- Every AI transcript carries a small label: model name and version, date captured, search on or off. Same label design everywhere so readers learn to look for it (and, ideally, start expecting it elsewhere).
- Transcripts are shown as chat, in a neutral style that doesn't imitate any one product's interface.
- Mockup web pages (the re-dated recipe) look like a generic blog, not a real site, and carry a "mockup" mark somewhere a careful reader finds it.
- Scenario cards share one format: situation in one or two sentences, no editorializing on the card itself. The judgment is the reader's job.

## Models and companies

Name any company when it's relevant. Never let the site read as if two or three US models are the world. Chinese models and companies appear as ordinary tools, because for many readers they are. Examples and transcripts should come from a spread of models across the site. See "Which model" in `interactive.md`.

## Visual direction

Settled 2026-09-22 (Paul): the look found on the sample page is the look of the project. The site-wide skin, on every page:

- Every section is a `.screen` that owns a hue (`--hue`). Its heading, links, labels, dashed coming panel and hand-off band take ink and band colours derived from that hue; the page background is a light tint of the current hue, scrubbed by scroll from one section's hue to the next.
- A skewed band (the stripe) crosses the top of every section after the first.
- A mono "Section N of M" label opens each section.
- A progress rail: one dot per section, half-filled when seen, solid when the section's activity is done, scaled when current. A bar under the header on phones.
- Unbuilt interactives are `.placeholder` panels: dashed border in the section's ink, a tinted fill, a mono uppercase tag. They stay until the component is built.
- The hand-off to the next page is the `.band`: a tinted, bordered block with a mono eyebrow, a large title and an arrow.
- Layout (Paul, 2026-09-23): titles and the section label are centred; the copy under them runs as wide as the activities and stays left-aligned.

The one-off activities on the sample page (rain, scorecard, wall, timeline, re-dated post, map, recap) are not the standard for other elements; they carry their own looks and stay where they are.

Open:

- localai went with glassmorphism, a single indigo to cyan accent, system font stack, a 4/8/12/16/24/32/48 spacing scale, and a 13 to 48 px type scale. None of that should be copied, but the discipline of tokenizing everything (colors, spacing, type, motion durations and easings) in one CSS file is worth keeping.
- All visuals built from CSS, SVG and canvas so nothing needs external assets. Same approach here unless the direction calls for imagery.
- Motion: one-way scroll reveals (arrive, then stay). localai learned the hard way that reversible reveals bounce when a reader stops scrolling at the trigger edge. Respect `prefers-reduced-motion`.
- Presentation pages need to read well when projected: large type, high contrast, generous spacing, and nothing that depends on hover. A teacher standing at the front should be able to drive every activity with a touch screen, a clicker, or arrow keys.
- One thought on look: the subject is trust and verification, so a design that feels clean and legible (paper-like surfaces, clear hierarchy, evidence-style labels on transcripts) may serve the argument better than a glossy AI-product aesthetic. Proposed, not decided.
- The hero's old radial glow (`hero-glow`) was removed from all pages when the skin went site-wide (2026-09-22). The sample's rain fills that slot on the sample only.

## Open questions for Paul

- Inherit the edu site themes and header, or a distinct look for this project?
- Fully responsive from the start (the brief says responsive).
- Rationale page in first person, and the rest in the textbook voice?
