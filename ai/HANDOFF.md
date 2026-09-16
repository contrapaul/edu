# AI in Education: handoff

Running record of what is built, what was decided, and what the next session should know. Newest at the top. Planning lives in `plans.md`, `style.md` and `interactive.md`; this file is the build log.

## 2026-09-16: transcript player built

The first component, and the one most interactives sit on. Every AI interaction on the site plays through it; there are no live calls.

### Files

| File | What |
|---|---|
| `js/transcript-player.js` | The player. `TranscriptPlayer` class plus `mountAll()`. Pure parsing functions are exported for tests. |
| `css/transcript-player.css` | Neutral chat look. Tokens prefixed `--tp-` with fallbacks to the site's shared tokens. |
| `data/transcripts/hadrians-wall-2023.json` | First real transcript, from the 2023 manual (see below). |
| `dev/player.html` | Test bed. `noindex`, unlinked. Shows the events the page receives. |
| `test/transcript-player.test.mjs` | 8 tests on the parsing and annotation functions, plus a check that every annotation in every transcript file matches its text. `npm test` from `ai/`. |
| `package.json` | Only for `"type": "module"` and the test script. Nothing is installed. |

### How it works

- A transcript is JSON: a label (model, date, search on or off), a source line, a `placeholder` flag, a pace, and a list of messages. The data shape is documented at the top of the JS file.
- The user's turn appears whole (a person typed it; we don't fake typing). The AI's turn streams one character at a time at `cps` characters per second. Blocks the stream hasn't reached are hidden, and a cursor element follows the writing point.
- Annotations are `{ match, kind, note }` on a message. The matched text becomes a `<mark>` that's invisible until the stream reaches it, then underlines in its kind's color (`fabricated` red, `check` amber, `good` green, `note` blue). The note shows on hover, focus, tap or Enter. Kinds are just class names, so adding one is a CSS rule.
- `note` messages are asides from the site, styled differently from the chat. `choice` messages pause playback and offer buttons; an option carries inline `messages` or a `next` transcript id to fetch. The chosen branch replaces whatever followed the choice.
- Events bubble from the root element: `tp:load`, `tp:start`, `tp:message`, `tp:annotation`, `tp:messageend`, `tp:choice`, `tp:choose`, `tp:done`. This is the pi.dev lesson: the page reacts to the recording.
- Autoplay when 40% of the player is in view (IntersectionObserver), once. Controls: play/pause, show all (finishes instantly up to the next choice or the end), replay, speed 1x/2x/instant. `prefers-reduced-motion` starts at instant.
- Markdown subset only: paragraphs, numbered and bulleted lists, bold, inline code. Deliberate. Add more only when a real transcript needs it.
- Strings the reader sees are in a `STRINGS` object at the top of the JS, ready to move to a data file when translation starts.

### Things to know

- The three annotation markers are the control characters U+0001, U+0002 and U+0003, written in the source as JavaScript escape sequences. A first write put the raw bytes in the file, which works but is invisible in an editor. Keep them as escapes.
- The site-wide `serve_nocache.py` is used for local preview. `.claude/launch.json` got a second config, `edu-ai`, on port 8911, so two sessions can preview at once.
- The agent browser pane did fire IntersectionObserver this time (autoplay on scroll worked), unlike localai's experience. Don't rely on it either way; check reveals in a real window.
- `ai/reference/` is gitignored. It holds the school policy, the 2023 teacher manual, and any saved transcripts. `academicintegrity.md` and `aipolicy.md` were 0 bytes when first checked.

### Next

- Decide the visual direction and tokens before building page one; the player picks up whatever tokens the page defines.
- Capture the "now" half of the Hadrian's Wall comparison: the same two prompts to a current model with search on, saved as a second transcript with real dates. Then the third branch option ("Ask the AI if it's sure") can carry a real reply instead of a placeholder.
- Real per-character timing is not supported yet. If a capture tool records it, add a `timing` array per message and teach `_tick` to read it. Nothing else changes.

## Source material: the 2023 manual

`ai/reference/ChatGPT for Educators Manual.pdf` is Paul's own guide, written February to March 2023, 129 pages, updated March 8, 2023. It contains dozens of genuine GPT-3.5 transcripts with prompts and full replies, plus Paul's critical notes at the time. It is the primary source for "then" in every then-and-now comparison. Sections most useful to this site: Academic Integrity and Ethical Considerations (pages 5 to 11, including the Hatchet example of prompting to evade detection), Student: Research (page 104 on, including the Hadrian's Wall sources with two invented book titles), Student: Writing Assistance, Student: Homework Assistance. The manual's own claims have aged in ways worth showing, such as "ChatGPT is not connected to the internet" and "as tools such as Bing Chat become available this will hardly be an issue."
