# AI in Education: plans

Started 2026-09-16. Scope, motivation and structure for `edu/ai`. Sections marked "proposed" are Claude's suggestions awaiting Paul's call.

## What the brief asks for

1. One to three long, responsive pages about AI in education, with elements that load in on scroll and activities along the way.
2. A glossary, connected to terms throughout the pages.
3. A set of slick, interactive, presentation-ready pages teachers can use in class.
4. Space for the rationale and explanation of the project.
5. "And more," to be defined.

Lives at `edu/ai`. May later join the personal projects listing and perhaps the site header.

## Motivation (from Paul, 2026-09-16)

The genesis: it is becoming harder for students to avoid interacting with AI, and the "old way" of internet research is less possible than teachers think. Meanwhile a widely held opinion about AI, formed by limited use of GPT-3.5 in early 2023, holds that AI is deeply unreliable and unsuited for research. That opinion is now as antiquated as the belief that Wikipedia can't be used for research because "anyone can change it." Both beliefs are still held, in dwindling numbers.

The problems the site addresses:

1. **Stale mental models.** Students and many teachers have no concept of how an LLM works. Many assume every model is still locked to a knowledge cutoff. Many are, but many can search.
2. **Surface-level use.** Students use AI a lot, but often ask one question and never clarify, never ask for an explanation, never push back. They find the answer and learn nothing.
3. **Nothing sticks.** Volume and availability mean learning isn't committed to memory. "I can just Google it or ask AI again."
4. **The polluted web.** A growing share of recent, "relevant" search results is AI generated, created quickly to exploit our learned recency bias even when recency doesn't matter. Recipe and blog sites re-date posts ("updated on X, originally published Y") with no detail about the update, because the update was the date itself, or a new affiliate link.
5. **Where the line is.** Some usage is obviously cheating. Many cases are edge cases. Students need to discuss them to learn where the line sits.
6. **Citation.** When and how to cite AI-generated material is a challenge for students, and many teachers fail to cite too. Sometimes because the material is "non-academic" (a presentation, a poster, assembly images). Sometimes because they feel their own ideas and requests are enough to skip citation on worksheets, lesson plans, or assessments. Sometimes because they're reluctant to address their own usage while telling students none is acceptable.

What the site should do:

- Demonstrate how AI can be used for research, to organize research, to find sources, and to make learning memorable.
- Show obviously inappropriate use and many edge cases, so students can discuss and learn where the line is.
- Guide teachers and students through citation scenarios, promote classroom debate, and propose guidelines for citing AI work.
- Be honest about teacher use, including Paul's own (see the case studies in `interactive.md`).

## The Wikipedia parallel (proposed framing)

This is the strongest single idea in the brief and could anchor the rationale page or the opening of the first long page. The parallel holds on several points and breaks on others, and the places it breaks are teaching material too.

Where it holds:
- A blanket "don't use it" rule that ignored how the tool actually worked (edit history, citations, talk pages, revert speed).
- The rule was taught by people who had used the tool little, or once, years earlier.
- Students used it anyway, unguided, and so learned bad habits (copy the summary, never click a footnote).
- The useful lesson was never "don't use it." It was "here's how it works, so here's how to use it well": read the sources it cites, check the edit history, treat it as a starting point.

Where it breaks:
- Wikipedia shows its work. Every claim has (or should have) a footnote, every edit has a history. An LLM's answer has no history and, without search grounding, no footnotes. That difference is the whole reason the "how it works" material matters.
- Wikipedia's errors get corrected in place over time. An LLM's confident error is regenerated fresh each time and can differ per conversation.
- Wikipedia is a source. An LLM is closer to a tool, or a collaborator, and the citation rules for tools are different from the rules for sources.

## Proposed page structure

Three long pages, each with a teacher-facing presentation counterpart. Working titles only.

1. **What AI is now.** How an LLM works, in plain terms and at less depth than localai (prediction, training data, knowledge cutoff, context, search grounding, hallucination). GPT-3.5 in 2023 versus today, with recorded and dated examples. The Wikipedia parallel. The AI-generated web, recency bias, and re-dated posts.
2. **Using AI to learn.** Conversation versus one-shot questions. AI for research: finding sources, verifying them, organizing notes, asking to be quizzed rather than told. Making learning stick: retrieval, explaining back, spacing. The difference between finding the answer and learning something.
3. **Where the line is.** Clear cheating, clear fine, and the edge cases between. Citation: when, how, and in what format. Teacher scenarios, including Paul's own. Proposed guidelines students and teachers can argue with.

Plus:
- **About / rationale.** Why this exists, Paul's position, methodology, and (proposed) a statement of how AI was used to build the site itself. Practicing the citation guidance on the site that gives it.
- **Glossary.** Rendered from one data file, hover cards on every marked term.
- **Present.** Teacher-facing interactive pages, one per long page or one per activity. See `interactive.md`.

An alternative split worth considering: the teacher-facing material (citing your own use, feedback on student work, the reluctance problem) may want its own page rather than being mixed into page 3, since the audience and the tone shift.

## Reference: `make/localai`

A useful point of reference for broad ideas at the start. Not to be copied for style or specific functions. Revisit once this project has taken shape.

What it is: a single hash-routed page with five tabs (Home, How It Works, Hardware Lab, Local vs Cloud, Glossary) for high school students and educators, explaining how local AI models run. Static HTML/CSS/JS, no build step, everything drawn with CSS/SVG/canvas.

Ideas from it worth keeping in mind:

- It started from a written Q&A (`plans.md`) that pinned down audience, scope, controls, data sources, and constraints before any code. The answers fed an outline, then a blueprint with numbered phases and acceptance criteria. That sequence worked.
- One glossary data file fed two surfaces: the glossary page and hover cards on marked-up terms. Clicking a term navigates to the full entry. Each entry has a short and a full definition plus verified outbound links.
- Exploration rewards (visited badges, a progress ring, a small celebration when everything has been seen) encouraged readers to see the whole thing without gating content.
- An honesty rule: never present a modeled estimate as a measurement, label assumptions in plain words, cite authoritative numbers. Here that becomes: every AI transcript shown is real, dated, and names the model and whether search was on.
- A `HANDOFF.md` kept a running record of decisions, reversals and traps for the next session. Worth doing here from the start.

Things it did that this project probably should not:

- Tabs inside one document with a hash router. The brief asks for long scrolling pages, so multiple real pages are more likely.
- Desktop first with mobile secondary. The brief asks for responsive.
- Its "How It Works" tab goes far deeper into hardware and inference than students here need. This site needs enough mechanism to dispel myths (cutoff, search, hallucination, context), then stops.

## Site constraints

- Cloudflare Pages serves source directly. No bundlers, no bare imports, JSON via `fetch`.
- `functions/api/` exists for Pages Functions, so a small server-side piece (live class voting, or a proxied AI call) is possible without breaking the no-build rule. Whether to use it is an open question below.
- Shared tokens in `/style.css`, themes in `/curriculum/themes.css`. See `style.md` for the inherit-or-not question.
- Presentation mode already exists for the DP curriculum pages (`curriculum/presentation.js`, `presentation.css`, docs in `curriculum/dp/presentmode.md`). It builds a deck from page content at runtime, verbatim, for a teacher projecting in class. The teacher-facing pages here have a different brief ("slick, interactive, presentation-ready") and are built around activities rather than notes, so they are probably their own thing.

## Honesty rules for this site (proposed)

- Every AI transcript on the site is real, captured on a stated date, from a named model, with search on or off stated. No invented "typical" AI answers.
- Where a 2023 example is shown, it is either a genuine archived transcript or clearly labeled as reconstructed.
- Fabricated-web examples (the re-dated recipe, the content-farm post) are mockups and say so, unless a real example is used with permission or is clearly fair to quote.
- The site cites its own AI use. If a page was drafted with an AI tool, the about page says which, and for what.
- Claims about IB policy quote the current policy and link to it. Policies change; the page carries a "checked on" date.

## Likely structure (placeholder)

```
ai/
  index.html          landing, or page 1
  learn.html          page 2
  line.html           page 3
  about.html          rationale, methodology, the site's own AI citation
  glossary.html
  present/            teacher-facing interactive pages
  css/  js/  data/    data/ holds glossary, scenarios, transcripts
  style.md  plans.md  interactive.md  HANDOFF.md (once building starts)
```

## Settled (Paul, 2026-09-16)

- **Tools.** No school-recommended AI beyond Microsoft Copilot via the M365 subscription. Students have access to Chinese models, and the school is on a VPN. The site reads as location agnostic, includes China, and normalizes Chinese models and companies rather than treating US models as the default. Any company can be named at any point, but the site must never read as if only two or three models exist globally. Paul's own outputs (the cases in `interactive.md`, and this site) were made with Claude, via Claude Code connected to his repos.
- **No live AI calls.** Recorded and simulated only. No API, nothing to update over time. A fully curated experience.
- **Audience.** Grades 9 to 12. Language level: grade 6 to 8. The glossary, hover definitions and examples scaffold the complexity. This applies to teacher-facing language too, so understanding doesn't depend on strong English and the text translates cleanly. Chinese translations and translanguaged elements come after the English build. No other languages.
- **Citation.** The school uses MLA. Paul uses "citation" loosely to mean sourcing or crediting. An AI-generated poster doesn't need an MLA citation, just a clear note about how it was made. The citation builder should offer both: the formal MLA form and the plain acknowledgement.
- **Live sessions.** Use the pattern from `github/blurt` and `github/cloud` for session codes and joining. But one experience must run straight through with no other user, so: learn mode by default, teacher mode as a toggle. See `interactive.md`.
- **School policy.** Exists; Paul wrote it. This site is for people beyond the school. Paul will place the policy, his early-2023 teacher guide to ChatGPT, and any saved 2023 transcripts in a folder inside `/ai/` for reference, not necessarily for inclusion.
- **Paul's cases.** He stands by them and is happy for the site to push back. He may revise the wording to avoid handing anyone a stick, and may collect real student feedback on the practice. His use of AI for code is a further case, especially against image generation (see case 3).
- **Build order.** A slick, engaging experience first, with placeholders where content isn't developed. The site must be genuinely fun to use or students won't stay.

## Live sessions: what the blurt/cloud pattern means here

Both repos run a Cloudflare Pages site plus a separate Worker holding one Durable Object per session. The Pages Function is the only thing that talks to the DO, identity is an anonymous token in localStorage, there are no accounts and no database. `cloud` is the better precedent because it was built for 100+ participants: delta broadcasts rather than whole-state, coalesced votes flushed every 150 ms, SQLite storage.

For this repo, that means:

- `edu` currently has one Pages Function (`functions/api/contact.js`) and no `wrangler.toml`. A DO binding needs a `wrangler.toml` at the repo root naming the Worker and class, plus a new Worker (`ai-live` or similar) deployed separately, first.
- The session feature is teacher-mode only and is built last, after the learn experience is done. Nothing in learn mode may depend on it.
- What a session needs is small: create, join by code, vote on a scenario card, show the distribution. Simpler than either precedent.

## Toolkit (proposed, from reading pi.html and the site's constraints)

What pi.dev actually is, from its HTML alone (the CSS and JS weren't saved, so this is inference from structure):

- Plain HTML with hand-written CSS and a handful of small vanilla JS files (`home-inline.js`, `nav-sheet.js`, `theme-toggle.js`). No framework, no framework markers in the markup. Hosted on Cloudflare.
- The "videos" are not video. They're asciinema recordings: JSON files of terminal text plus timing (`/recordings/*.cast`), played by `asciinema-player` in the browser. A hidden `#demoRegistry` lists each recording with its size, speed and theme. Each page section has a `section-demo-slot`, and as a section scrolls into view the JS mounts the player into it and starts playback.
- Because the recording is data, the page can react to it. Caption slots (`data-inline-caption-slot`, `data-inline-ended-caption-slot`) change during and after playback. That's the "site elements change in real time to match the recording" effect.
- Scroll reveals are a class (`home-scroll-fade-item`) toggled by an observer, the same mechanism as localai.
- Sections each hold one demo, so the reader is encouraged to stop and watch each one in turn.

The lesson to take: **play back data, not video.** An AI transcript is text plus timing, exactly like a terminal recording. If every transcript on this site is a JSON file played by a small transcript player, then the page can react to it (highlight the hallucinated citation as it appears, flip a label when search kicks in, pause for a "what would you ask next" choice). That single component is the engine for the "then and now" comparison, the branching conversation, the source check, and the "ask to be quizzed" demo, and it's what "simulated calls" means in practice.

The toolkit:

1. **Vanilla HTML, CSS and JS modules**, relative imports, no build. Same as the rest of edu, localai, pi.dev, blurt and cloud.
2. **Scroll: IntersectionObserver first.** One-way reveals with stagger, and section-enter events that start players. CSS scroll-driven animations (`animation-timeline: view()`) for progress-linked effects where supported, always as an enhancement with a static fallback.
3. **GSAP with ScrollTrigger, self-hosted in `js/vendor/`.** GSAP has been free including its formerly paid plugins since 2025. It's the standard tool for pinned, scrubbed scroll sequences (a timeline that builds as you scroll, a wall that opens when search turns on), works without a build step, and handles reduced motion. Add it when the first pinned sequence is designed, not before. Skip smooth-scroll libraries such as Lenis; they fight touch devices and accessibility for little gain.
4. **A transcript player**, custom, small. Input: `{ model, version, date, search, messages: [{ role, text, delayMs? }] }`. Streams at the recorded pace or a chosen one, emits events (`message-start`, `token`, `message-end`, `done`) that the page listens to, supports branching (a message can offer choices that select the next file), and renders the model/date/search label the same way every time.
5. **Data as JSON in `data/`**, fetched. Transcripts, scenario cards, glossary, the model gallery, and every user-visible string, so translation is a data job later.
6. **SVG by hand** for the few charts (next-word probabilities, vote distributions). No chart library.
7. **Self-hosted fonts** in `ai/fonts/` as woff2. Nothing from another host.
8. **Tests** with Node's built-in runner for the DOM-free modules (player timing, scenario scoring, citation builder, glossary render), following localai's approach.
9. **Live sessions**, last, as above.

## Reference files in `/ai/`

- `pi.html`: the pi.dev homepage HTML, saved 2026-09-16 as a motion and pacing reference. Not the final word on style.
- `reference/` (gitignored): the school AI policy, Paul's early-2023 "ChatGPT for Educators" manual (129 pages of genuine GPT-3.5 transcripts with his notes at the time; the primary "then" source), and any saved transcripts. See `HANDOFF.md` for what's in the manual.

## Build log

See `HANDOFF.md`. First component built 2026-09-16: the transcript player, with the Hadrian's Wall 2023 transcript from the manual as its first recording.
