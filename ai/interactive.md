# AI in Education: interactives and activities

Starting point, 2026-09-16. A holding place for interactive ideas. Paul will supply his own list next; nothing here is decided.

## From the brief

- Long pages with elements that load in as the reader scrolls.
- Activities along the way, within the pages.
- Glossary terms connected throughout the pages.
- Presentation-ready interactive pages for teachers to use in class.

## Mechanisms from `make/localai` worth knowing about

Not to be copied, but they show what worked in a similar static, no-build setup.

Scroll reveals
- `data-reveal` on any element. An IntersectionObserver with a `-10% 0px` root margin adds `.in-view` the first time the element enters, then unobserves it. CSS handles the transition. Siblings get a `--i` index for a 60 ms stagger.
- Reveals are one-way. Reversible reveals bounced when a reader stopped at the trigger edge, and were reverted. Ambient background motion (drifting blobs, a marquee) stayed continuous and separate from reveals.
- All motion is killed under `prefers-reduced-motion`.
- Trap: the agent browser pane reports `visibilityState: hidden`, so IntersectionObserver never fires there. Scroll reveals have to be checked in a real browser window.

Glossary
- One data file, one entry per term: `id`, `term`, `short` (1 to 2 sentences, for the hover card), `full` (the glossary page entry), `links` (verified outbound "Learn more" links).
- In-page markup: `<a class="gloss" data-term="token" href="#/glossary/token">`. Hover or keyboard focus shows the short definition; click goes to the full entry. Listeners delegated from the document so terms rendered later still work.
- Every link URL was checked live for HTTP 200 and canonical title before shipping.

Simulation and live numbers
- A shared store held the current configuration; every tab subscribed and repainted from it. An estimation engine turned the configuration into numbers with the assumptions labeled on the page.
- A "race" streamed real recorded model answers token by token at the speed they were really produced, so the reader saw what they got for the wait. Recorded runs were labeled with machine and date so nobody read a one-off as a general claim.

Exploration rewards
- Per-tab visited badges, a progress ring on the home tab, a small celebration when everything had been seen. Nothing was gated.

Tests
- DOM-free modules (no DOM access at import time) so the engine and renderers were unit-testable in Node with a fake document. Worth keeping if this project has any logic worth testing.

## Categories to fill in

Placeholders only. Paul's ideas come next.

- In-page activities on the long pages (prompts to try, sorting or matching, short self-checks, "what would you do" scenarios).
- Teacher-facing presentation interactives (something a teacher can drive from the front of the room, touch and keyboard friendly, legible when projected).
- Glossary connections (hover cards, deep links, maybe a "terms on this page" panel).
- Progress and exploration cues across pages.

## Constraints on any interactive

- No build step. Vanilla JS modules with relative imports, or an `importmap` to unpkg for a library.
- Everything drawn with CSS, SVG or canvas unless the direction calls for imagery.
- Works with touch and keyboard, not only hover.
- Responsive: the brief asks for it, so mobile layout is not secondary here.
