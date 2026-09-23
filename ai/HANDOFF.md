# AI in Education: handoff

Running record of what is built, what was decided, and what the next session should know. Newest at the top. Planning lives in `plans.md`, `style.md` and `interactive.md`; this file is the build log.

## 2026-09-23 (later still): page two gets "The web after AI"

- **What was asked.** An extra part of `learn.html` laying out the case that old-school web research is now difficult to do, and may be less reliable, in the year after AI proliferation: AI-produced websites, SEO getting in the way of research, strong sources hard to find. Explicitly not a claim that AI-assisted research is better.
- **What was built.** A new third section, `id="web"`, hue 232: the section head plus a five-paragraph `.prose` column (first use of `.prose` on the site; each paragraph carries its own `data-reveal`). The beats: who is writing (content farms, bulk model-written pages); the date (re-dating, recency bias, the affiliate link, with a pointer to page one's re-dated post at `index.html#s6`); the order of the list (the ranking mixes relevance with who pays); the strong sources (plainer, lower in the list, older; a summary of a summary); and the honest limit (no claim that the chatbot is the better researcher, the defence is the same in both cases, and the old default of just looking it up was the whole method and is now its start).
- **Glossary.** First marks on page two: `content-farm`, `affiliate-link`, `recency-bias`, `source`, all existing terms, first occurrence only. 46/46 tests.
- **Renumbering.** The four following sections now read "4 of 6" to "6 of 6"; the first two "N of 5" labels were caught in the same pass after the first edit missed them.
- **Deliberate choice.** Argument-only section: no activity and no placeholder panel, unlike its four neighbours. If an activity is wanted, the obvious candidate is sorting a result list from strong to weak source, and it belongs in `interactive.md` before it is built.

## 2026-09-23 (later): the header tags and "Screen" labels are out; the merge put them back on page one

- **What was asked.** No status tag on the wordmark in the shared header (learn, line and glossary read "· draft"; page one read "· sample"), no "Screen" in page one's section labels ("1 of 9", not "Screen 1 of 9"), and no "sample" in the tab title.
- **What was done (committed as `c5963e6`, "Update").** The `wordmark-sub` span came out of all four pages, page one's nine labels became numbers only, the title is "What AI is now · AI in Education", and the two now-orphaned `.wordmark-sub` rules in `css/site.css` (base rule and the 600px media-query line) went with it. Minutes later the same treatment went to pages two and three: their ten "Section N of 5" labels are numbers only ("1 of 5" to "5 of 5"). Older entries below keep the old paths and old labels as they were at the time.
- **The merge wrinkle.** `57adedb` merged origin/main, which carried the other session's rename of `sample.html` to `index.html` (`2a7eef7`, `19aede3`). Both sides had touched the same lines of the same (renamed) file, and the merge took origin's version for them, so page one came back with the "· draft" tag and the "Screen N of 9" labels while the other three pages kept the clean header. The tag would have rendered as plain text: the `.wordmark-sub` styles are already gone. **Re-applied the cleanup to `index.html`** (span out, labels numbers only). The title needed nothing; both sides were already clean. This is uncommitted local work, and origin/main is what the live site builds from, so the live header still carries "· draft" and "Screen" until it is pushed.
- **Also noticed.** `reference/academicintegrity.md` and `reference/aipolicy.md` are no longer empty (7.8 KB and 2.7 KB); the 2026-09-16 note about them being 0 bytes is spent.

### Next

1. Push the page-one cleanup above, so the live header matches the rest of the site.
2. **Real data, in `data/`, edited in place:** student quotes into `quotes.json` (still empty; slots `ai-images` on page one, `ai-posters` and `teacher-hypocrisy` on page three; the file says nothing is ever invented); the thirteen `policy: null` lines in `models.json` ("where your text goes" is written only after each company's policy has been read, and the search, open-weights and `url` notes are review too); the ten dated events in `timeline.json` ("Paul to verify before publishing"); and the wording of the three cases in `cases.json`, which Paul most wants to control.
3. Screen 5's confirming run: a fifth sentence, the wall-title prefix without its trailing space, captured as before; if the numbers fit, the two sentences side by side are the strongest version of the screen.
4. The 2023 transcript's "Ask the AI if it's sure" branch is still a placeholder; a real capture of that follow-up would complete it. The same five prompts also deserve a Chinese model with search and a local model without, so the comparison is not two OpenAI products.
5. Page two: `learn.html` is still four `Placeholder` panels (conversation, sources, memory, organising); the activities are specified in `interactive.md`. The about/rationale page the brief asks for does not exist yet (nav marks About `is-soon`).
6. If page one's copy is rewritten, `data/tokens-page1.json` must be regenerated, and the script that does it lives only in session history, not in the repo; get it into `dev/` before the rewrite.
7. The "Compare with a class" stub on page three waits on the live-session backend (the blurt/cloud pattern), built last.

## 2026-09-23: page one is `index.html`, titles centred, screen 5 reworked

Paul's three asks: undo the redirect merge, change the layout, and get more out of screen 5 from the recorded data.

### The merge, done properly

- `sample.html` moved to `index.html` with `git mv`, over the redirect stub. `/ai/` now loads page one with no redirect. The title and description are the old page one's; the wordmark tag reads "draft", like the other pages.
- The "1. What AI is now" link on every page points at `./`, not `index.html`: Cloudflare Pages redirects `/index.html` to the folder, so `./` is the address with no hop.
- `/ai/sample.html` no longer exists. It was `noindex` and nothing outside the site's own nav linked to it. The plain version of page one is in the git history (`2d0fbb0^:ai/index.html`).
- Nothing the page loads is called "sample" any more (Paul): `css/sample.css` is `css/index.css`, `js/sample/` is `js/index/`, and `test/sample.test.mjs` is `test/index.test.mjs`, following page three's `line.html`, `css/line.css`, `js/line/`. The modules import their neighbours with `../`, at the same depth, so the move changed only the two tags in `index.html` and the test imports. Older entries below keep the old paths as they were at the time.
- **Deploying.** The live site builds from `main`. Until this branch is merged there, edu.contrapaul.com/ai still serves `main`'s redirect stub to `sample.html`, whatever the browser cache holds.

### Layout (site-wide, `css/site.css`)

- Titles are centred: the mono section label, the section heading, the hero title and the scroll cue. The copy under them (`.section-head p`, the hero lede, the rain note) is no longer held to `--measure`; it runs as wide as the activities below it and stays left-aligned. Rule recorded in `style.md`.
- The hero's bottom padding grew. The wider lede ran into the next section's stripe, which rises toward the right edge.
- The rain's mask now thins the middle of the hero, where the text is, instead of the left.
- `line.html` section 2 had a second `<div class="wrap">` inside the first, left over from the skin conversion, so the card sort ran 80px narrower than everything else. Removed.

### Screen 5, from what the recording shows

The screen showed five of the twelve recorded pieces on a scale relative to the biggest. The recording holds more than that:

- **How sure the model was.** The numbers are over the full vocabulary, so the top twelve plus "everything else" is 100%. For jar the top twelve cover 35%; for bus, 98%. That difference is invisible if every chart is scaled to its own top bar.
- **Sure is not right.** Bus: "at the stop" points to a bus and the model gave "train" 77%.
- **Pieces, not words.** Jar's list has "␣mar" (the start of "marmalade"), a bare "␣", and "...".
- **The space in the wall-title prompt.** The prefix ends in a space, and the model gave 98% to digits. See below.

What the screen does now (`js/index/nextword.js`, `css/index.css`):

- The guess is unchanged (five chips, the sentence types itself).
- The reveal shows all twelve pieces plus "every other piece" on one 0 to 100% scale, drawn as the model sees them (leading space as ␣, the rain's convention). The reader's pick is outlined; the top pulses.
- Beside the bars, a lesson per sentence says what its numbers show. The lessons live in `data/next-word-sentences.json` as `lesson`, next to the capture input Paul already edits; the screen fetches that file alongside `data/next-word.json` and joins by id. Every percentage in a lesson is a `{placeholder}` filled from the recording (`lessonVars`), and a test fails if a lesson types a percentage in by hand. `data/next-word.json` is untouched.
- "Let the model pick" draws one piece at random, weighted by the recorded numbers; "Pick 20 times" draws twenty. Each pick fills the blank (in the warm accent, so it reads as the model's word, not the writer's) and counts on its bar. A pick that lands in "every other piece" shows "…" and says the recording does not name it. The draws happen in the browser; the source line says so.
- The closing line after the fourth sentence now says what the draws show: a chatbot writes this way one piece at a time, and the picks vary, which is why the same question can get a different answer.
- The card is full width like the other activities (it was capped at 760px); two columns above 860px, stacked below.
- Pure and tested: `barWidth` (now absolute), `showPiece`, `restProb`, `rollIndex`, `lessonVars`. 46/46.
- Checked in Chromium at 1440 and 390 wide, in dark mode, and under reduced motion (bars already out, picks land without the flicker), through all four sentences to "Go again"; the progress record and recap line are unchanged.

### The wall-title prompt ends in a space

The capture sent `You could also read a book called "Hadrian's Wall: ` with the trailing space. Qwen's tokenizer attaches a word's space to the front of the word ("␣The"), and never to a digit, so a space standing alone as the last piece is, in ordinary text, usually followed by a number. The model gave 98% to digits, and the recorded "␣The" at 0.67% is a second space plus "The". The lesson for that sentence explains this, because it is the clearest thing the data shows about pieces, and it ties back to screen 1.

That explanation is an inference from how the tokenizer splits text. The numbers fit it (98% on digits; jar's list also holds a bare "␣"), but no capture has tested it. **The confirming run** is a fifth sentence with the same prefix without the trailing space, `…"Hadrian's Wall:`, hidden `The`, captured on Paul's machine as before. It could not be run here: this session's network blocks Hugging Face. If it comes back as expected, the two sentences side by side (the same title, one space apart) would be the strongest version of the screen, and the "The" number would finally be the one the original plan wanted.

### Noticed, not fixed (reduced motion only)

- The recap's timeline line reads "You ran the timeline through to , and…": the still timeline records `{ still: true }`, not `reached`, and `s2` has no short fallback.
- The still timeline's two cards sit left in a three-column grid, because `.tl-end` spans every track, so `auto-fit` cannot collapse the empty one.

## 2026-09-22 (later): the re-dated post's comments clue, reworded

Paul spotted the weakest clue in screen 6: the sticker read "Older than the post", but the comments (2019, 2020, 2021) are newer than the 2019 publication and older than the claimed 2026 update, and stale comments on their own are not a red flag at all. Two fixes were offered; Paul chose the rewording (option A), keeping the dates as they are.

- The sticker is now **"Dead since 2021"** and the note states the actual argument: the newest comment is five years before the claimed 2026 update, a page that was really updated gets some readers, this one got none, so the date moved to look fresh and the recipe never changed. That is the screen's real lesson ("the update was the date itself"), and the wipe already proves the text is identical.
- The anachronism option (a 2026 comment thanking the page for an update that had not happened) was considered and set aside for now; it would be the stronger slam-dunk version if the clue ever needs more force.
- Changed: the comments entry in `data/redated.json`, the header line in `js/sample/redated.js` that repeated the old framing, and the same phrasing in `showcase-plan.md` screen 6 ("comments dated before the 'publish' date"). No component logic touched; the screen reads everything from the data file. 42/42 tests.

## 2026-09-22 (last): the page-one merge

Paul asked for the merge to be handled. `index.html` (the plain version of page one) is now a meta-refresh redirect to `sample.html`, keeping the old title and `noindex`. Redirect rather than delete: any link that already points at `/ai/` or `/ai/index.html` lands on page one instead of a 404. The sample's footer lost its "Plain version of this page" link, which would have pointed at itself. Nothing else linked there: every nav points at `sample.html`, and `style.md`'s reference to `/index.html` is the site-root page, not this one. The glossary test still loads the file (it carries no `data-term` marks now, so it passes on its own). `plans.md` reads "redirects" instead of "delete or redirect when the merge happens", and its pages table shows all nine screens built. The one open item left over from the old decision list is gone with it.

## 2026-09-22 (and then): screen 5 is built

The probability race is in, on the recorded numbers.

- `js/sample/nextword.js`: the sentence types itself out (the player's `typeInto`) and stops at the blank; the five chips bounce in; the reader taps one and the bars race out, sorted biggest first, the numbers counting up to the data file's probabilities. The reader's pick is outlined on chip and bar, the model's top pulses, a match gets a small chip burst. Four sentences, then a "Go again" that resets without touching the progress record. `fmtProb` and `barWidth` are pure and tested; a throwaway DOM-shim drive of the whole component (four picks, the finish line, the still version) checked that the numbers on screen equal `data/next-word.json`, then deleted itself.
- Still version: the sentence in full, chips disabled, bars already out, numbers set. (The first draft crashed here on a call to a function that was never named; the shim caught it.)
- The last result is kept under the done line, not replaced by it: on the wall-title sentence the reader sees \"The 0.67%\" against \"2 39%\" and then the closing words, in one status line.
- `css/sample.css`: the screen 5 block, between the map and the recap, using the screen's own `--ink`/`--band`.
- Wiring: `data-nextword` in `sample.html` (the placeholder is gone), the mount in `js/sample/main.js`, `s5` in `ACTIVITY_SCREENS`, and the recap lines `s5`/`s5short` in `data/recap.json` (\"You picked the next word {n} times. The model's top pick was yours {matched} of those.\"), with the short one for a record that lacks the details.
- Tests: `test/nextword-screen.test.mjs` (formatting, widths, the recap line in page order, and that every candidate the screen shows is a token in the data file's top list), and `sample.test.mjs`'s recap count moved from two open to three, since six screens now count. 42/42.
- Not yet seen in a real browser: the typing, the bounce and the pulse are GSAP-driven and were driven here only through the shim with GSAP off. Look at it in a window before the polish pass, on a phone and under reduced motion.

## 2026-09-22 (later still): the capture ran, and the numbers are in

Paul's decisions, then the run. Qwen3-**1.7B** (not 4B); the proper-name sentence is **dropped** (removed from `data/next-word-sentences.json`); capture on **this machine**. This box does have the tooling after all: LM Studio ships `llama-server` at `~/.lmstudio/extensions/backends/llama.cpp-linux-x86_64-avx2-2.31.2/`. No install.

### What happened

- The Qwen HF repo has changed since the handoff was written: `Qwen/Qwen3-1.7B-GGUF` now holds only `Q8_0` (1.83 GB); the `Q4_K_M` folder is gone (community copies are on `unsloth`). Downloaded the official **Q8_0** to `/home/paul/Qwen3-1.7B-Q8_0.gguf` (size matches HF's exactly). Same 1.7B model, better quant, still the Qwen3 family the rain and the map use.
- LM Studio's own server already holds port 8080 (it wants an API key), so the capture server ran on **8123** and the script got `--base http://127.0.0.1:8123`. The server was stopped after the run.
- This llama.cpp is newer than the kit expected and speaks the OpenAI-compatible logprobs shape (`choices[0].logprobs.content`). `parseLogprobs` now handles it, with a test for it (38 tests pass).
- Two bugs found on the run, both fixed and tested: `buildSentence` duplicated the sampled token when it was already in the top list, and the request was not actually greedy (the server sampled at temperature 0.8, so the "sampled" token was not the top-1). The request now sends `temperature: 0`, matching the "greedy decode" note in the data file.
- First run: **crowd** and **wall-title** missed the top 8. Fixes: the crowd split lost "home" ("…and the crowd went" puts "quiet" at 7); wall-title needed `--top 12` ("The" is 10th). Both are the handoff's sanctioned fixes, not fudges.
- Final run, exit 0: `data/next-word.json` has all four sentences, model name, file, date, top-12 lists, the normalisation note. jar: "jam" at 2. bus: "bus" at 2. crowd: "quiet" at 7. wall-title: "The" at 10, **behind nine digits** ("2" at 39%, "1" at 35%).

### The wall-title result is stranger and better than planned

The model, asked what follows `"Hadrian's Wall: ` in a book title, thinks the next token is a **number**. The reader's five chips will read The, 2, 1, 3, 5, and the bar the reader's pick gets is 0.7% against the model's 39%. That is a more honest lesson than the planned one: the invented title was not even the model's likely word, let alone its best. Paul should look at it and decide it reads well, because the screen's copy will lean on it. (jar's chips also include the fragment token "mar" and the word "some"; the chip list is the model's honest top picks, and the screen should probably not filter them.)

### State

The capture kit, the data, and the fixes are in the working tree, **not committed** (`data/next-word.json` is new). Screen 5 is now unblocked: `js/sample/nextword.js`, its CSS in `css/sample.css`, the `s5` line in `ACTIVITY_SCREENS` and a recap line in `data/recap.json` (which currently jumps s4 to s6), the mount in `js/sample/main.js`, and the placeholder in `sample.html`'s s5 section coming out. The numbers on screen must match `data/next-word.json`, and the bars' label reads model and date from it.

## 2026-09-22 (evening): the next-word capture kit, and how to run it

Screen 5's capture is ready to run. Paul is moving this PC and powering it down; everything needed to come back to this is in this entry. Nothing has been run against a real model yet.

### What exists

- `data/next-word-sentences.json`: five sentence splits to pick from (four firm, one optional proper-name). Each has `prefix`, `hidden`, and a `note` saying what the split is meant to teach. The last is fixed: the invented book title from the 2023 transcript, split right after "Hadrian's Wall: ".
- `dev/capture-next-word.mjs`: points at a running llama.cpp server (`--base`, default `127.0.0.1:8080`), records the top 8 tokens and probabilities at each split (`exp(logprob)` over the full vocabulary, so the list does not sum to 1, and the file says so), and writes `data/next-word.json` with the model name as reported by the server, the `--model-file` name, the date, and the normalisation note. It handles both the current and the legacy llama-server logprobs shapes. If a hidden word is not in the top list it still writes the file, names the splits to move, and exits non-zero. `--dry-run` checks the sentence file with no server. The pure helpers are exported and covered by `test/nextword.test.mjs`; 37/37 pass, and the whole run was checked end to end against a mock server (the mock and its output were deleted afterwards; nothing of them is in the repo).
- This machine has none of the capture tooling: no llama.cpp, no Python ML stack, no model files. So the run happens on Paul's own machine, or an install is approved here.

### The run, step by step

1. **The model.** Qwen3-1.7B at Q4_K_M, a single `.gguf` of about 1.2 GB, from Qwen's GGUF repository on Hugging Face (`Qwen/Qwen3-1.7B-GGUF`; the file lives under its quant folder, e.g. `Q4_K_M/Qwen3-1.7B-Q4_K_M.gguf` in the current layout). 4B instead of 1.7B is fine if the machine has the RAM; 1.7B runs on a plain CPU and is enough, since this is a dozen single-token predictions. Why Qwen3: screen 1's token rain is tokenised against the Qwen3 vocabulary, so the probabilities then come from the same family as the tokens the reader watched fall, and Qwen is already on the model map.
2. **llama.cpp.** A prebuilt `llama-server` binary (a GitHub release for the platform, or `brew install llama.cpp`). No build needed.
3. **Serve and capture.**
   ```
   llama-server -m /path/to/Qwen3-1.7B-Q4_K_M.gguf --port 8080
   # in another terminal, from edu/ai:
   node dev/capture-next-word.mjs --model-file Qwen3-1.7B-Q4_K_M.gguf
   ```
   The script reads `data/next-word-sentences.json` by default and writes `data/next-word.json` by default; `--base`, `--top`, `--sentences`, `--out` override. `--optional` includes the proper-name sentence; `--dry-run` needs no server.
4. **Check the run.** The console prints, per sentence, the model's top token with its probability and where the hidden word ranked. Look at `data/next-word.json`: `model` (name, file, date), `normalisation`, and per sentence `best`, `hiddenRank`, `top`, `candidates` (the five chips, hidden word first, the model's top marked `isTop`). The `wall-title` entry is the one that matters: the hidden word "The" should rank inside the top 8, and its `note` records that the full title is the 2023 model's invention and what the real Collingwood Bruce book is.
5. **If a hidden word is not in the top list**, the script says which splits to move. Adjust `prefix`/`hidden` in `data/next-word-sentences.json` and re-run; the capture is seconds, so iterating is cheap. (Bumping `--top` to 12 or 16 is also an option, but moving the split is the more honest fix.)
6. **Then build screen 5**: a `js/sample/nextword.js` (bar race from `candidates`, the reader's pick outlined, the model's top pulsing, the still version under reduced motion), its CSS in `css/sample.css`, tests for any pure helpers, `s5` added to `ACTIVITY_SCREENS` in `js/sample/recap.js`, and the label on the bars reading the model and date from the data file. After that, the polish pass (showcase-plan step 10).

### Decisions left to Paul

- 1.7B or 4B; keep or drop the optional proper-name sentence (and its placeholder name "Grip").
- Whether the capture happens on his machine (better provenance: "captured on Paul's machine") or an install here.
- The usual page-one merge: `index.html` is the spare now that the sample is page one; delete or redirect it.

### State of the repo at power-down

All of this session's work is in the working tree but **not committed** (the skin move, the page conversions, the capture kit, the doc updates). A checkpoint commit is the first thing to do on return, before any further edits.

## 2026-09-22 (later): page one is settled

- Paul: `sample.html` is page one. `index.html` is the spare; delete or redirect it when the merge happens (not done yet).
- Next on page one: the next-word capture for screen 5 (recorded probabilities from a small local model), then the polish pass.

## 2026-09-22: the sample's skin becomes the site

Paul's call: the look found on `sample.html` is the correct one for the whole project. The global touches now apply to every page; the one-off activities (rain, scorecard, wall, timeline, re-dated post, map, recap) stayed on the sample and were not used as a guide anywhere else. Blocked components stayed blocked.

### What moved

- `js/sample/stripes.js`, `js/sample/rail.js` and `js/sample/progress.js` are now `js/stripes.js`, `js/rail.js` and `js/progress.js`. They were global all along; page three's activities already imported progress across directories. Importers updated: everything in `js/sample/`, all of `js/line/`, and `test/sample.test.mjs`. Tests still 27/27.
- The global skin moved out of `css/sample.css` into `css/site.css`: the `--page-hue` tint tokens and the tinted body background, `.screen` (padding, `--ink`/`--band` derived from the section's `--hue`), the skewed `.stripe`, the mono `.screen-n` section label, the progress rail, and the hand-off `.band`. The unbuilt-interactive panel is `.placeholder` everywhere now; the sample's one `.soon` panel became a `.placeholder` (same look). `css/sample.css` now holds only the one-off activities, and its header says where the skin lives.
- Out of `site.css`: `.hero-glow` and its keyframe, the `.section` padding and border rules (sections are `.screen` now), the old striped `.placeholder`, and `.next-link` (replaced by the band).
- `js/main.js` now sets the skin on every page it serves: `initColour()` scrubs the page hue between the sections' hues, and `mountRail()` mounts the rail from the sections. `glossary.html`'s inline module does the same two calls.
- The four pages converted, section by section. Each section is now a `.screen` with a `--hue`, a `data-title`, a `.stripe`, and a "Section N of M" label; the heroes lost their glow divs:
  - `index.html`: seven screens, hues 232, 285, 22, 48, 150, 195, 205 (mirroring the sample's corresponding sections). The "next part" link is now the sample's band and links to `learn.html`, which exists (it is a skeleton, but a page).
  - `learn.html`: five screens, hues 150, 285, 22, 325, 48. The sections got ids: `intro`, `conversation`, `sources`, `memory`, `organising`.
  - `line.html`: five screens, hues 22, 48, 285, 150, 325. The dialogue section got `id="awkward"`. The rail dots for `cards`, `cite` and `cases` fill solid from the existing `markDone` calls in `js/line/`, no change there.
  - `glossary.html`: one screen, hue 232.
- `dev/player.html` is a test bed, not a page of the site; it keeps its own inline styles.

### Trap found on the way

`.screen > .wrap` had `z-index: 1` but was not positioned, so the z-index did nothing and the skewed stripe (a positioned element) painted over the top of the section copy on wide viewports, where the skew pushes the band lower on one side. The rule now also sets `position: relative`, so the copy is always above the stripe.

### What did not move

- The one-off activity components and their CSS (rain, typed title, scorecard, wall, timeline, re-dated post, map, recap) stay in `sample.html` and `css/sample.css`.
- Everything blocked on Paul's input stayed blocked: screen 5 (recorded probabilities), the page-two placeholders, the page-three dialogue, the "Compare with a class" stub.

## 2026-09-19 (late night): three cases from a teacher

- `data/cases.json`: the three cases in Paul's first person, written from his own accounts in `interactive.md` and meant to be edited in place. Each has `happened` (paragraphs), `why` (list), and `pushback` (each item a question a student or colleague might ask, `q`, and Paul's answer, `a`). The strings include the four "what would you have done" options.
- `js/line/cases.js`: tabs for the three cases, one panel at a time. Each panel: what happened, why, then the reader's move (pick one of four options, optional free text) which enables "Show the pushback"; the pushback then animates in with the answers. Choices and text persist under `answers.cases`; revealing all three marks `cases` done and shows a closing line. `answeredCases` is pure and tested.
- Page three's third section has `id="cases"`. Styles in `css/line.css`.
- The copy is the part Paul most wants to control. Everything a reader sees is in the JSON file, nothing in the JS.

## 2026-09-19 (night): the citation builder

- `data/cite.json`: the six uses (quoted or paraphrased words; an image, sound or video; ideas or outline; edit, grammar or translate; feedback; finding sources), the five kinds of work (essay; poster, slides or display; a teacher's worksheet, lesson or assessment; code; not handing it in), a "why" paragraph per case, MLA month abbreviations, and all strings.
- `data/models.json` gained a `url` per tool (the chat address, for MLA entries). Paul reviews these with the rest.
- `js/line/cite.js`: `buildCitation(input, data)` is pure and tested. It returns the blocks for the case: an MLA Works Cited entry (`"prompt" prompt. Tool, version, Company, 8 Mar. 2023, address.`) and in-text form for quoted, paraphrased or image use in an essay; a credit line on the work itself for posters and teacher materials (plus the Works Cited when the use is a citing one); a comment for code; a note in the reader's own words for editing and feedback; "cite the sources themselves" for source-finding; "nothing required" for private work. A company that shares the tool's name is not repeated. The form: two radio groups, a tool select from `models.json` with an "another tool" option that opens name, company and address fields, version, date (local, defaults to today), and the prompt. Output re-renders on every input, each block has a copy button, and the first copy marks `cite` done.
- The MLA forms follow the MLA Style Center's 2023 guidance on generative AI (prompt description as title, tool as container, version, company, date, URL; functional uses acknowledged rather than cited). The page says so and tells the reader to check the school's own rule too.
- Page three's second section has `id="cite"`. Styles in `css/line.css`.

## 2026-09-19 (evening): the card sort, and student voice

### Card sort (page three, first section)

- `data/scenarios.json`: fifteen cards, twelve student and three teacher, deliberately mixed, each with a `consider` note that poses the question rather than answers it. The scale labels and every string.
- `js/line/cards.js`: a tray of cards and a line from "clearly fine" to "clearly cheating" with a tinted field. Drag a card onto the line; or tap it, then tap the line or one of three quick buttons (which fan cards across their zone rather than piling them). A placed card shows its consider note when tapped and can be dragged again; arrow keys nudge a focused placed card. Stacks: cards within 16% of each other on the line stack upward (`layout()`, pure, tested) and the field grows with its tallest stack. Placements persist under `answers.cards`; all fifteen placed marks `cards` done. "Compare with a class" is a stub that says it is coming.
- Teacher mode adds "Run it with the class": one card at a time in large type, three tap-to-count columns (fine, it depends, cheating) with a minus on each, a live fill, previous and next, and a results board of stacked bars at the end. Votes persist under `ai-line-class` in localStorage so a refresh mid-lesson loses nothing; a button clears them. This is the hands-up version from the plan; the live-device version needs the backend and comes later.
- `css/line.css` is page three's stylesheet. `js/line/main.js` mounts the sort. Page three's first section has `id="cards"`.
- Trap: a `display: flex` rule on an element defeats the `hidden` attribute. `[hidden]` is now explicit for the picker, the stage and the consider panel.

### Student voice

Paul wants real student quotes through the site (see `plans.md` motivation item 7 and "Student voice" in `interactive.md`). Built: `data/quotes.json` (empty, with the format and the rule), `js/voice.js` (`quotesFor` is pure and tested; a slot with no quote shows a marked placeholder), styles in `site.css`, and three slots: `ai-images` on page one by the map, `ai-posters` and `teacher-hypocrisy` on page three. Paul adds the quotes. Nothing is ever invented.

## 2026-09-19 (later): portrait windows, the glossary, pages two and three

### Portrait windows

Paul reported that tall, narrow browser windows broke the look. Causes and fixes:
- Anything sized in `vh` ballooned: the hero (`92vh`), the compare panes (`70vh`), the mock post body (`62vh`), the wall SVG (`52vh`). All are now capped in pixels with `min()` or `clamp()`.
- Pinned scenes stuck to the top of a very tall viewport with a void below. `centreSticky(scene)` in `js/scroll.js` sets the sticky `top` so the scene sits vertically centred when there is room, re-run on resize and font load. The wall and timeline use it.
- The pinned stage heights are `calc(100vh + <scroll distance>)` rather than a multiple of the viewport.
- Checked at 760 by 1300 (unpinned) and 1000 by 1500 (pinned).

### Glossary

- `data/glossary.json`: sixteen terms with `short` (hover card, 1 to 2 sentences), `full` (the page), and `links` to Wikipedia. Every URL was checked live on 2026-09-19 and every title is the article's name after redirects ("Training data" lands on "Training, validation, and test data sets"). The Wikipedia API rate-limits after about ten quick requests; space them out when re-checking.
- `js/glossary.js`: `loadGlossary`, `mountHoverCards` (one shared card, delegated listeners, hover, focus, tap on touch where the first tap opens the card instead of following the link, Escape closes, repositions on scroll, flips above the term when there is no room below), `renderGlossary` (letter index, grouped entries, "Learn more" links, highlight and scroll to a hashed entry after render), and `letterIndex` (pure).
- `glossary.html` renders it. Markup for a term anywhere: `<a class="gloss" data-term="token" href="glossary.html#token">…</a>`. Eleven terms are marked on `sample.html`, first occurrence only. A test asserts every `data-term` on every page exists in the data.
- Styles are in `css/site.css` (dotted accent underline, the card, the page).

### Pages two and three

`learn.html` and `line.html` are skeletons: the shell, a hero, four sections each with a heading, a paragraph and a `Placeholder` panel naming the interactive from `interactive.md`. Nothing built. They exist so the nav works and the shape of the site is visible.

### Nav

All pages share one header block (in the generating script in this session; copy it from any page). "1. What AI is now" points at `sample.html`, since that is the version being built; `index.html` (the plain one) still exists with its own nav and a "plain" tag. Decide which one is page one before publishing and delete or redirect the other.

## 2026-09-19: screens 8 and 9, the recap and the hand-off band

The sample page is now complete except for screen 5, which waits on recorded next-word probabilities.

- `data/recap.json`: line templates per activity, short fallbacks for a progress record that lacks details (a reader who did the activities before an update still gets a sentence), the outcome words for the wall cards, the copy and clear labels, and the part-two band text.
- `js/sample/recap.js`: `buildLines(progress, strings)` is pure and tested; it writes one line per finished activity in the reader's own choices (the year they reached, who they said they'd trust, the branch they picked in the 2023 transcript, each card and its outcome, the stickers they found, the tools they tapped). `mountRecap` renders it, re-renders on every `ai:progress` event, slides new lines in, offers "Copy this" (plain numbered text to the clipboard) and "Clear my progress" (resets the record, which also empties the rail), and fires a one-off burst of token chips the first time every activity is done. `mountNextBand` slides the part-two band in from the right.
- To make the recap read like a receipt, the activities now record more than ids: the wall stores each card's text and outcome, the post stores the sticker names, the map stores the model names, and the scorecard records the branch chosen inside a transcript through a new `setAnswer()` in `progress.js` (an answer that marks nothing done).
- `ACTIVITY_SCREENS` in `recap.js` lists what counts (s2, s3, s4, s6, s7). Add s5 when it exists.
- Player fix found on the way: "Show all" did nothing when pressed during the pause between two messages (no stream in flight). `skip()` now advances directly in that case.
- Checked with a scripted run from an empty record through every activity: six lines, all dots solid, the burst, then clear back to empty.

## 2026-09-18 (end of day): screen 7, the model map

- `data/models.json`: thirteen entries. DeepSeek and Qwen (Hangzhou), Kimi, Doubao and GLM (Beijing), ChatGPT, Claude, Gemini and Llama (San Francisco area), Copilot (Redmond, the tool the school's Microsoft 365 provides), Mistral (Paris), HyperCLOVA X (Seoul), and "Local models" (LM Studio, llama.cpp, Unsloth) at "your computer". Grok is deliberately left out (Paul's call, 2026-09-18) and a test asserts it stays out. Each entry has `search` and `open` values with a short note, a `checkedOn` date, and `policy: null`: the "where your text goes" line is written only after Paul has read that company's policy, and the card says so until then. A test asserts every policy is still null. The search and open-weights notes are mine from memory and are the kind of claim that changes; Paul reviews them with the policies.
- `js/sample/map.js`: a rough equirectangular world map from hand-placed continent polygons (no Antarctica; cut at 58°S), one dot per city, labels on leader lines fanned into empty sea, a laptop marker below the map for local models. Tapping a label opens a card with the same four rows for every tool and the checked-on date. Four taps mark the screen done (progress `s7`).
- Trap: GSAP owns an SVG element's transform outright, so an animated `<g>` loses its `translate`. Position goes on an outer group; GSAP animates the inner one.
- Not yet checked on a phone (the pane's emulation wouldn't scroll to it). The SVG scales by viewBox and label text is 20px in viewBox units under 600px, so it should read, but look at it on a real phone.
- The continents are deliberately rough. If they read as sloppy rather than hand drawn, the polygons are in `LAND` at the top of the module and are easy to improve.

## 2026-09-18 (later still): screen 6, the re-dated post

- `data/redated.json`: an invented site ("Quick Crumbs", `quickcrumbs.example`), an invented no-knead bread post, three invented comments, five clues with their sticker text and explanation, and all strings. Paul chose invented over a real site with the name removed.
- `js/sample/redated.js`: a fake browser window (chrome, address bar, status bar that shows a link's real address on hover) holding two copies of the article. The current copy carries `data-clue` on five nodes: the update line with no changelog, the nameless byline, the paragraph that says nothing, the affiliate links (`?ref=quickcrumbs-20`), and comments older than the post. Nothing is highlighted until found. A click on anything else gets "Nothing wrong with that part." A hint button pulses the next unfound clue. Each find adds a sticker to the window's edge and explains itself in the status line. After all five, a wipe slider appears; the 2019 copy sits underneath, clipped from the left, with its date line highlighted. Past halfway the caption appears and the screen is done (progress `s6`).
- The two copies must align to the pixel for the wipe to read as one page. The underlay is `position: absolute; inset: 0 0 auto 0` so it is as tall as its content, and `align()` gives both meta lines the taller of their two heights (the only block that wraps differently), re-run on resize and when fonts load.
- The mock uses Georgia on purpose, so it reads as someone else's page, and its headings are `h3`/`h4` so it doesn't add a second `h1` to the real page. Its styles are scoped under `.rp-window` because the screen's own heading colour otherwise leaks in.

## 2026-09-18 (late): screen 2, the scrubbed timeline

- `data/timeline.json`: the axis range, the flip year (ChatGPT's launch), the quote as segments with `{a, b}` swap points, and ten dated events. The dates are from widely reported events (Wikipedia 2001, the Nature comparison 2005, Middlebury 2007, ChatGPT November 2022, the New York City block and its lifting in 2023, the IB's statement in 2023, web search in the main chatbots in 2024). Paul should verify each before publishing; the file says so.
- `js/sample/timeline.js`: a year readout, a sliding track of events (two lanes so neighbours don't collide), one quote card, and a closing line. When the year crosses the flip point the three swap spans scramble letter by letter into the AI wording (`flipText`) and the card's border turns to the warm accent; scrolling back flips them back. Done (progress `s2`) once the year passes 2025.
- The axis is stretched: `SEGMENTS` gives 95 px per year before 2021 and 400 after, and scroll progress maps to distance along the track (`progressToYear` via `yearToPx` and `pxToYear`), so the scrub lingers where the events are. Tested.
- Modes: above 900px and outside teacher mode, a 230vh stage with the scene sticky and a ScrollTrigger scrub. Otherwise a range slider and a "Play the timeline" button (a 14 s GSAP tween along the track). Under reduced motion, both cards side by side with the swaps highlighted, no motion, marked done on sight.
- The quote pair is mine and is the kind of thing Paul will want to rewrite: "You can't trust Wikipedia. Anyone can edit it, and it doesn't tell you who did." against "You can't trust a chatbot. It makes things up, and it doesn't tell you when."

## 2026-09-18 (night): showcase phases 3 and 4, the rain and the wall

### Screen 1: token rain and typed title

- `data/tokens-page1.json` (5 KB): page one's text tokenised against the real Qwen3 vocabulary subset from `make/localai` (`js/data/vocab.js`, 390 KB, not copied). 260 unique pieces with their real token ids; "chatbot" splits into " chat" and "bot", which is the lesson. Regenerate with the script in this session's history if the copy changes (it reads `sample.html`, strips tags and the "Coming" panels, greedy longest-first match). Provenance is in the file.
- `js/sample/rain.js`: canvas behind the hero. Chips show the piece (a leading space drawn as ␣) and the id. Capped at 180 chips (70 under 700px), DPR capped at 2, paused off screen and when the tab is hidden, sped up and stretched by scroll velocity. Under reduced motion it draws once and stays. A CSS mask thins the rain under the text column.
- `js/sample/typed.js`: `typeInto(el)` types an element's text with a cursor and fires `typed:done`; the hero's lede, note and scroll cue carry `.after-typed` and appear when it fires. Trap: `<h1 data-typed>` reads as an empty string, not null, so the code uses `||`, not `??`.

### Screen 4: the wall and the window

- `data/wall.json`: axis, cutoff, five cards (two before, two after, one timeless), all strings.
- `js/sample/wall.js`: inline SVG (axis, bonded brick wall at the cutoff, a light beam behind the window rows), a tray of card buttons, a search switch (`role="switch"`), a status line (`aria-live`), a reset. Drag or tap a card and it flies (GSAP timeline) to its year: lands before the cutoff, hits the wall and bounces after it, or dips through the open window when search is on. Cards stack when they land in the same stretch and are clamped inside the scene. Clicking a placed card returns it. Done (progress `s4`) after three cards and one flip of the switch.
- Building the wall: above 900px, not in teacher mode and not under reduced motion, the stage is 190vh tall with the scene sticky and a ScrollTrigger scrubbing the brick count. Otherwise the wall builds on arrival (phones, teacher mode) or is drawn complete with the window open (reduced motion).
- Pure helpers `yearToX` and `brickLayout` are tested.

### Checked

Desktop at the pane's width (build on arrival), 1440 wide (pinned, 0 to 30 bricks across the scroll), the full card loop with the switch, dark mode via the tint. Not checked on a real touch device; the drag uses pointer events with `touch-action: none` on the cards and a tap falls through to a throw.

### Next

Screen 2 (scrubbed timeline), then 5 (needs recorded probabilities), 6, 7, 8, 9.

## 2026-09-18 (evening): showcase phases 1 and 2 built

`sample.html` exists alongside `index.html`. Phase 1 (global) and phase 2 (the scorecard) from `showcase-plan.md` are done and checked in light, dark, desktop, 1440 wide and 375 wide.

### Files

| File | What |
|---|---|
| `sample.html` | Nine `.screen` sections, each with `--hue`, `data-title`, a `.stripe` band and, for the unbuilt ones, a `.soon` panel saying what's coming. Screen 3 has the scorecard and the compare. |
| `css/sample.css` | Tint (`--page-hue` on `<html>`, oklch background), per-screen ink and band colours from the hue, stripes, rail, scorecard. |
| `js/sample/main.js` | Wires theme, mode, nav, reveals, colour, rail, compares, scorecards. |
| `js/sample/stripes.js` | `initColour()`: a ScrollTrigger per screen scrubs `--page-hue` from the previous hue to this one (short way round, `mixHue`), and each stripe drifts a little with scroll. |
| `js/sample/rail.js` | The progress rail. Vertical on the right above 900px, a bar under the header below. Dots take their screen's hue; half-filled when seen, solid when done, scaled when current. |
| `js/sample/progress.js` | `ai-progress` in localStorage: `seen`, `done`, `answers`. `markSeen`, `markDone`, `tally`. Dispatches `ai:progress`. |
| `js/sample/scorecard.js` | Listens on a compare block. `tp:annotation` stamps the side's column (INVENTED, CHECK, CONFIRMED) and bumps the counter; `tp:messageend` on an assistant turn counts new distinct link hrefs. When both sides are done or waiting at a choice, it asks one question and stores the answer under the screen id. |
| `js/vendor/gsap.min.js`, `ScrollTrigger.min.js`, `GSAP-LICENSE.txt` | GSAP 3.15.0 from npm, standard "no charge" licence, text saved alongside. Loaded as classic scripts before the module. |
| `test/sample.test.mjs` | `mixHue`, `tally`, `countNewLinks`. 16/16 across both files. |

### Also changed

- `js/compare.js`: pane roots carry `data-side="0|1"` so the scorecard can tell them apart; autoplay uses `whenInView()` from `js/scroll.js`, a new helper with an observer plus a scroll sweep behind it.
- `.tp-scope` on the scorecard and the compare bar, so buttons outside a player still get the player's tokens.

### Traps

- The compare bar's "Show all" is the third "Show all" button on the screen; a ref-based click in the pane sometimes lands on the wrong one. Click through JS when verifying.
- Under phone emulation this pane neither fires IntersectionObserver nor honours `scrollIntoView`, so the streams don't start there. The layout was checked at 375px; the autoplay was checked at desktop width.
- The stamp strip keeps at most six stamps; older ones are removed. The counters are the record.

### Next (phase 3 onward, per the plan)

Screen 1 rain and typed title, then screen 4 the wall, then the timeline, next word (needs recorded probabilities), the re-dated post, the map, the recap.

## 2026-09-18 (later): three notes from Paul

- The player now holds on a prompt for reading time before the answer streams (800 ms plus 70 ms a word, between 1.4 and 4.5 s, scaled by speed). The pause before an answer starts is 700 ms.
- No double titling: the eyebrow-over-heading pattern is gone from page one. One title per section. Rule recorded in `style.md`, along with the AI-prose tells to avoid.
- Page one copy rewritten plainer. Paul will rewrite much of it anyway.
- `showcase-plan.md` written: nine screens, each with its own colour, one main motion and one thing to do, plus a progress rail, colour stripes, and a recap built from what the reader did. Not started.

## 2026-09-18: shell, scroll engine, compare component, page one skeleton

Paul chose a fully distinct look for `/ai` (own header, own tokens, no inherited site theme). Built and checked in light, dark, teacher mode, desktop and phone width.

### Files

| File | What |
|---|---|
| `index.html` | Page one, "What AI is now". Real copy for the hero, the Wikipedia parallel and the then-and-now section; honest `Placeholder` panels for the cutoff timeline, next-word guesser and re-dated post. Nav links to unbuilt pages are marked `is-soon`. |
| `css/tokens.css` | All tokens. Light and dark (system default, manual override), teacher mode type scale, `@font-face` for the self-hosted fonts. |
| `css/site.css` | Header, hero, sections, cards, claims list, placeholder panel, compare layout, reveal transitions. |
| `js/theme.js`, `js/mode.js` | `data-theme` and `data-mode` on `<html>`, stored as `ai-theme` and `ai-mode`. The pre-paint snippet in `index.html` mirrors both. |
| `js/scroll.js` | One-way reveals with stagger, `section:enter` events, and a load-time pass plus scroll sweep so nothing depends on IntersectionObserver firing. |
| `js/compare.js` | Two players side by side from `[data-compare data-left data-right]`, one bar driving both, tabs under 860px. Starts both when 35% in view. |
| `js/main.js` | Wires the above. |
| `fonts/` | IBM Plex Sans 400/400i/500/600/700 (OFL, licence file alongside) and JetBrains Mono 400/500 copied from the repo's own set. |

### Decisions

- Type: IBM Plex Sans for everything, JetBrains Mono for evidence labels (model, date, search) and eyebrows. Paper-toned light theme, warm dark theme, one blue accent plus a warm second accent for emphasis. The annotation colours (red, amber, green, blue) are tokens shared by the player and the page.
- The player's `--tp-*` tokens now resolve from the site tokens. `.tp-scope` on any element outside a player gives it the same tokens (the compare bar uses it).
- The player got a `follow` option: inside a scrollable log it keeps the cursor in view by scrolling the log, never the page. Compare panes cap the log at 70vh.
- The teacher-mode toggle exists and works (bigger type, a banner). It does nothing else yet, by design; classroom controls come with the activities.
- Page copy is written at the grade 6 to 8 level, headers are noun phrases, and every AI claim on the page is one the transcripts support.

### Traps

- In this browser pane, `requestAnimationFrame` and IntersectionObserver can both stall under phone emulation (the document reports itself hidden). The load-time reveal pass uses `setTimeout`, and a scroll sweep backs up the observer. Scaled screenshots from the pane can also be stale frames; take a full-size one before believing a blank hero.
- The header collapses to a Menu button below 1120px; below 600px the draft tag hides and the mode button reads "Teach".

### Next

- Glossary data file and hover cards, then mark the terms in page one's copy.
- The three placeholder interactives on page one, in the order they appear.
- Pages two and three as skeletons, so the nav works.
- Once Paul picks topics, swap the Hadrian's Wall pair for something students would be assigned.

## 2026-09-16 (later): the 2026 half of the comparison, and a wider markdown subset

Paul ran the manual's five Hadrian's Wall prompts through free-tier ChatGPT (GPT-5.6 Luna) and saved the raw output as `reference/hadrians.md`. It is now `data/transcripts/hadrians-wall-2026.json`, built by a script that split the file on the exact prompt strings so nothing was retyped. The 2023 file was extended to the same five prompts from the manual (PDF line wraps unwrapped, paragraph breaks restored where a line ended in a full stop). Both transcripts carry annotations; every claim marked `good` or `fabricated` was checked against the cited page on 2026-09-16, and the note says so.

The modern reply needed more markdown than the 2023 one: links, `###` headings, `>` quotes, pipe tables, `[n]: url "title"` reference lines, and images. All added to the parser, each minimal. Images render as a dashed "Image" chip with the URL in its title; they are never hotlinked (the six in the Antonine answer are on an OpenAI CDN with no provenance). Numbered lists now survive blank lines between items and keep their start number, because the model writes them that way. Annotation notes are positioned within the message body from the mark's last line fragment, since marks wrap across lines, and become a bottom sheet under 600px.

Findings from the comparison are in `interactive.md` under "Then and now: what the Hadrian's Wall pair shows".

## 2026-09-16: transcript player built

The first component, and the one most interactives sit on. Every AI interaction on the site plays through it; there are no live calls.

### Files

| File | What |
|---|---|
| `js/transcript-player.js` | The player. `TranscriptPlayer` class plus `mountAll()`. Pure parsing functions are exported for tests. |
| `css/transcript-player.css` | Neutral chat look. Tokens prefixed `--tp-` with fallbacks to the site's shared tokens. |
| `data/transcripts/hadrians-wall-2023.json` | Five prompts and replies from the 2023 manual, annotated. |
| `data/transcripts/hadrians-wall-2026.json` | The same five prompts to GPT-5.6 Luna, 2026-09-16, annotated. |
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
- Markdown subset: paragraphs, numbered and bulleted lists, headings, quotes, pipe tables, reference lines, bold, inline code, links, image placeholders. Grown only as real transcripts needed it.
- Strings the reader sees are in a `STRINGS` object at the top of the JS, ready to move to a data file when translation starts.

### Things to know

- The three annotation markers are the control characters U+0001, U+0002 and U+0003, written in the source as JavaScript escape sequences. A first write put the raw bytes in the file, which works but is invisible in an editor. Keep them as escapes.
- The site-wide `serve_nocache.py` is used for local preview. `.claude/launch.json` got a second config, `edu-ai`, on port 8911, so two sessions can preview at once.
- The agent browser pane did fire IntersectionObserver this time (autoplay on scroll worked), unlike localai's experience. Don't rely on it either way; check reveals in a real window.
- The transcript JSON files contain whatever the model wrote, em dashes included, because they are verbatim recordings. The no-em-dash rule applies to everything the site writes, including annotation notes, and not to quoted AI output. An annotation `match` string has to contain one if the matched text does.
- `ai/reference/` is gitignored. It holds the school policy, the 2023 teacher manual, and any saved transcripts. `academicintegrity.md` and `aipolicy.md` were 0 bytes when first checked.

### Next

- Decide the visual direction and tokens before building page one; the player picks up whatever tokens the page defines.
- The "Ask the AI if it's sure" branch in the 2023 transcript is still a placeholder. A real capture of that follow-up (to a current model) would complete it.
- Add the same five prompts to one or two more models (a Chinese model with search, and a local model without) so the comparison isn't two OpenAI products.
- Real per-character timing is not supported yet. If a capture tool records it, add a `timing` array per message and teach `_tick` to read it. Nothing else changes.

## Source material: the 2023 manual

`ai/reference/ChatGPT for Educators Manual.pdf` is Paul's own guide, written February to March 2023, 129 pages, updated March 8, 2023. It contains dozens of genuine GPT-3.5 transcripts with prompts and full replies, plus Paul's critical notes at the time. It is the primary source for "then" in every then-and-now comparison. Sections most useful to this site: Academic Integrity and Ethical Considerations (pages 5 to 11, including the Hatchet example of prompting to evade detection), Student: Research (page 104 on, including the Hadrian's Wall sources with two invented book titles), Student: Writing Assistance, Student: Homework Assistance. The manual's own claims have aged in ways worth showing, such as "ChatGPT is not connected to the internet" and "as tools such as Bing Chat become available this will hardly be an issue."
