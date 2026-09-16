# AI in Education: plans

Starting point, 2026-09-16. Scope and structure for `edu/ai`. Paul will supply the motivation, direction, and interactive ideas next; nothing below is settled.

## What the brief asks for

1. One to three long, responsive pages about AI in education, with elements that load in on scroll and activities along the way.
2. A glossary, connected to terms throughout the pages.
3. A set of slick, interactive, presentation-ready pages teachers can use in class.
4. Space for the rationale and explanation of the project.
5. "And more," to be defined.

Lives at `edu/ai`. May later join the personal projects listing and perhaps the site header.

## Reference: `make/localai`

A useful point of reference for broad ideas at the start. Not to be copied for style or specific functions. Revisit once this project has taken shape.

What it is: a single hash-routed page with five tabs (Home, How It Works, Hardware Lab, Local vs Cloud, Glossary) for high school students and educators, explaining how local AI models run. Static HTML/CSS/JS, no build step, everything drawn with CSS/SVG/canvas.

Ideas from it worth keeping in mind:

- It started from a written Q&A (`plans.md`) that pinned down audience, scope, controls, data sources, and constraints before any code. The answers fed an outline, then a blueprint with numbered phases and acceptance criteria. That sequence worked.
- A shared state store drove numbers across tabs, so a choice made in one place changed what other tabs showed. Whether this project has shared state depends on the interactives.
- One glossary data file fed two surfaces: the glossary page and hover cards on marked-up terms. Clicking a term navigates to the full entry. Each entry has a short and a full definition plus verified outbound links.
- Exploration rewards (visited badges, a progress ring, a small celebration when everything has been seen) encouraged readers to see the whole thing without gating content.
- An honesty rule: never present a modeled estimate as a measurement, label assumptions in plain words, cite authoritative numbers. Relevant here whenever a page makes claims about AI capability or use in schools.
- A `HANDOFF.md` kept a running record of decisions, reversals and traps for the next session. Worth doing here from the start.

Things it did that this project probably should not:

- Tabs inside one document with a hash router. The brief asks for long scrolling pages, so multiple real pages are more likely.
- Desktop first with mobile secondary. The brief asks for responsive.

## Site constraints

- Cloudflare Pages serves source directly. No bundlers, no bare imports, JSON via `fetch`.
- Shared tokens in `/style.css`, themes in `/curriculum/themes.css`. See `style.md` for the inherit-or-not question.
- Presentation mode already exists for the DP curriculum pages (`curriculum/presentation.js`, `presentation.css`, docs in `curriculum/dp/presentmode.md`). It builds a deck from page content at runtime, verbatim, for a teacher projecting in class. The teacher-facing pages here have a different brief ("slick, interactive, presentation-ready"), so they may be built as their own thing rather than reusing that script. Worth a look before deciding.

## Likely structure (placeholder)

```
ai/
  index.html          landing or first long page
  ...                 further long pages
  glossary.html       or glossary rendered from data
  present/            teacher-facing presentation pages
  about.html          rationale and explanation of the project
  css/  js/  data/
  style.md  plans.md  interactive.md
```

## Waiting on Paul

- Motivation and rationale for the project.
- Direction: what the pages argue or teach, and for whom first (students, teachers, both).
- Ideas for interactives (see `interactive.md`).
- Whether these pages get the site header and themes.
- How the teacher presentation pages relate to the long pages: the same content in a different mode, or separate material.
