# AI in Education: interactives and activities

Started 2026-09-16. Ideas for in-page activities, teacher-facing presentation interactives, and glossary connections. Paul's own list is still to come; everything under "Ideas" is proposed.

## From the brief

- Long pages with elements that load in as the reader scrolls.
- Activities along the way, within the pages.
- Glossary terms connected throughout the pages.
- Presentation-ready interactive pages for teachers to use in class.
- Activities that guide teachers and students through citation and usage scenarios, promote classroom debate, and propose guidelines.

## Ideas, by page

### Page 1: What AI is now

**Then and now.** The same prompt answered by GPT-3.5 in 2023 and by a current model with search on, side by side, with dates and model names. A few prompts: a factual question that changed after 2021, a request for sources, a math problem, a "what happened last week" question. Reader clicks through prompts. The point lands without commentary. Needs genuine archived 2023 transcripts or a clear "reconstructed" label.

**Then and now: what the Hadrian's Wall pair shows.** Findings from the first real comparison (five prompts, GPT-3.5 in March 2023 versus GPT-5.6 Luna free tier on 2026-09-16). These are the teaching points the page can be built around.

- *Sources.* 2023: seven items, four books, two with invented titles, no links. 2026: five items, all real pages, all links working, with inline citations. The change is search; the model read the pages before answering. But it recommended "at least one book" and then listed none, and four of its five pages are from one organisation. Better, and narrower.
- *The new failure mode.* 2026 wrote "English Heritage specifically notes that he never returned to Britain" and cited a page. The page doesn't say it. The claim is the accepted view, but the source didn't make it. In 2023 the model invented a book. In 2026 it invented what a real page says. That's the single sharpest lesson in the pair: asking for sources is step one, opening them is still step two.
- *Attribution drift.* The soldiers' home regions ("Spain, Romania, Germany, France, the Netherlands, North Africa, and Syria") are cited to a page that mentions Spain and Romania only. The wider claim is supportable elsewhere. A citation tells you where to look, not that the claim is there.
- *Verified claims.* "Less than 5% of the Wall has been archaeologically examined" and the souvenir pans are word for word on the cited pages. The site should show these too, or the lesson becomes "AI is wrong," which is the 2023 belief in new clothes.
- *Hedging improved.* 2023: Hadrian "inspected the progress of the construction work." 2026: visited Britain in AD 122, no strong evidence he walked the completed Wall, and here's how to phrase that in a report. The 2026 model also names the problem with the main written source (a biography written 200 years later) without naming the source (the Historia Augusta).
- *Same model, different modes.* The Antonine Wall answer in 2026 has no citations at all. Same conversation, same model, but it answered from memory rather than searching. The only clue was the missing sources. This is worth a dedicated moment on the page: "search on" is per answer, not per tool.
- *Coaching, or doing the thinking.* 2023 gave ten broad topics. 2026 gave thirteen arguable questions, sorted, with a shortlist table and a recommendation. Choosing an arguable question is the research skill, and the model is performing it. Whether that teaches or replaces it depends on what the student does next. Good scenario-card material.
- *Profiling.* The prompt said "grade 10." The reply said "If this is for an IB/MYP Grade 10 report." Guessed, or remembered from the account. Either way the tool is building a picture of the user. Feeds the data-policy activity.
- *Tracking.* Every link ends in `utm_source=chatgpt.com`. Strip it before citing.
- *Images.* Six photographs in the Antonine answer, hosted by OpenAI, no photographer, no source, no licence. Uncitable in a report. Feeds the image-citation discussion and case 3.
- *Tells.* The 2026 reply closes its last answer with the shape "you aren't just explaining X, [dash] you'd be doing Y." A denial, a long dash, a bigger claim. The site's own style rules ban exactly this shape, and the reason is on the page: it's how AI writes.
- *Tone and length.* 2023 reads like an encyclopedia entry with a school-essay closing paragraph. 2026 is three times longer, formatted with emoji headings and tables, and ends each answer by offering the next thing it could do. Neither is neutral.
- *Wikipedia.* Unprompted, the 2026 model warns against "relying on Wikipedia alone." The 2023 manual concluded that checking a Wikipedia article's references beat asking ChatGPT. The parallel writes itself.

**The cutoff and the window.** A timeline with a wall at the model's training cutoff. Toggle "search" and a window opens in the wall. Hover a question and it lands on the timeline where its answer lives, showing whether the model can reach it. Small, clear, and kills the "all LLMs are locked to a cutoff" belief in one interaction.

**Next-word guesser.** A sentence with the next word hidden, and a short bar chart of what the model would predict, with probabilities. Reader picks a word, then sees the model's list. Teaches that the model predicts rather than looks up, which is the root of both its fluency and its errors. Lighter than localai's tokenizer; probabilities can be pre-recorded for a fixed set of sentences.

**Which model.** A gallery or map of the tools people actually use, with company, country, whether it can search, whether it's open weights, and where its data goes: DeepSeek, Qwen, Kimi, Doubao, GLM, Copilot, ChatGPT, Claude, Gemini, Llama, Mistral, and local runners. The point is that there are many, from many places, and they differ in ways that matter. Chinese models are shown as the ordinary tools they are, since that's what many students here use. The site should never read as if there are only two or three models in the world.

**Wikipedia, then.** A short scroll sequence of the reasons Wikipedia was "banned," each paired with the mechanism that answered it (edit history, citations, revert speed, talk pages). Then the same layout for AI with the mechanisms this site teaches. Reader sees the shape of the argument repeat.

**Re-dated post detective.** A mockup blog post (a recipe is the obvious one). Reader clicks anything suspicious: the "updated" line with no changelog, the affiliate links, the paragraph that says nothing, the publish date that's newer than the comments. Each click reveals the signal. Then a Wayback-style comparison: the "updated" post and the original, diffed, with the only change highlighted in the date line. A second example that's actually fine (a real update with a changelog), so the lesson is "check," not "distrust everything."

**Recency test.** Three search results for the same query with different dates. Reader picks the best one. Sometimes the oldest is best (a settled topic), sometimes the newest matters (a policy, a price). Reveal explains why.

### Page 2: Using AI to learn

**One question versus a conversation.** A branching transcript. Reader starts with a real student prompt ("what were the causes of WW1"). After the answer, they choose the next move: copy it, ask for an explanation of one cause, ask for a source, challenge a claim, ask to be quizzed. Each path continues with a real recorded reply. At the end, two tallies: "what you got" and "what you could now explain to someone else." The copy path scores high on the first and zero on the second.

**Source check.** Five citations an AI produced for a topic. Some are real, some are fabricated, some are real but say something different from what the AI claimed. Reader checks each (the page links to the real ones, and the fake ones go nowhere). Teaches that asking for sources is step one and verifying them is step two. Uses real captured output, so the fabrications are genuine, not invented.

**Ask to be quizzed.** Show the prompt that turns an AI from an answer machine into a tutor: "don't tell me, ask me." Then a live or recorded version the reader can try. Pairs with the memory section.

**Retrieval built in.** The page itself practices what it teaches. A few sections in, a small unannounced check: "without scrolling back, what were the two things Wikipedia had that an LLM answer doesn't?" The reader types, then reveals. Later, the same question again. This is the spacing effect happening to the reader. Their answers stay in localStorage so the page can show them their own earlier answer.

**Explain it back.** Reader writes a two-sentence explanation of a concept they just read. The page shows a model explanation next to theirs (no scoring, no AI call needed). Optionally, with a live call: the AI critiques the explanation. This is the "Feynman" habit in miniature.

**Organizing research.** A walkthrough: a messy pile of notes (real, from a real topic) fed to an AI with the prompt shown, and the organized result, with the reader able to see what was kept, what was merged, and what the AI silently dropped. The dropped item is the lesson.

### Page 3: Where the line is

**Scenario cards.** The centerpiece. Each card is a short, concrete situation. Reader places it on a line from "clearly fine" to "clearly cheating," or into "it depends" with a reason. After placing, the reader sees where others placed it (see the backend question) or a distribution from a class Paul has already run. Example cards, mixed deliberately:
- Asked AI to explain a concept from class, then wrote the essay alone.
- Asked AI for an essay outline, wrote from the outline.
- Asked AI to fix grammar in a finished essay.
- Asked AI to rewrite a paragraph "to sound better."
- Asked AI to write the essay, then rewrote it in own words.
- Used AI to translate a source from another language.
- Used AI to make flashcards from class notes, then studied them.
- Asked AI to solve a math problem, then solved similar ones alone.
- Asked AI to solve the assigned problem set and copied the working.
- Used AI to generate the images for a poster, no citation.
- Used AI to summarize a 40-page reading instead of reading it.
- Used AI to check whether an essay meets the rubric before submitting.
- Teacher used AI to write the worksheet, no citation.
- Teacher used AI to give feedback on drafts (see case studies below).
- Teacher used AI to write a reference letter.

The teacher cards mixed in with the student cards is deliberate. It's the point of the page.

**Citation builder.** Pick what you did (drafted, brainstormed, edited, generated an image, got feedback), the tool and version, the date, and whether you're citing for an essay, a poster, or a lesson plan. The builder produces the citation in the school's chosen style, plus a plain-language acknowledgement line for non-academic work. Also shows when the honest answer is "this needs a note in the methodology, not a citation." Once the format is settled this is a small, high-use tool that teachers would actually keep open.

**The reluctance problem.** A short scenario, presented as a dialogue: a teacher who used AI for a worksheet is asked by a student whether that's allowed. Reader picks the teacher's reply. Each reply plays out. Built for classroom debate with teachers as the audience.

**Draft the guideline.** After the scenarios, a form: the class writes its own guideline for one situation. Print or copy out. A teacher running this in class ends up with a class-authored policy on the board.

### Case studies from Paul's practice

All three are usable as debate material and all are, in Claude's view, defensible. Paul has said he stands by them and is willing to have the site push back on them, may revise the wording to protect himself, and may collect real student feedback on the practice. The value for the site is in where each one is arguable, because that's where the class discussion lives. Notes for each, written as pushback a student or colleague might give, so the site can present the case fairly.

**Case 1: AI-drafted sample papers.**
Paul keeps a folder of past papers, sample papers, the subject guide and teacher support material. He used an AI tool to produce comprehensive guides for emulating official papers, then used AI to draft SL and HL sample papers from case study topics and requirements he supplied. He then added pictures and charts, formatted the work, adjusted questions and answers, and checked accuracy. He tells students how the papers were made and shares the method. His view: AI writes questions that read like IB questions better than he does; his own tend toward more plausible wrong answers and more complicated questions, which are good for challenge but bad for predicting performance on a real paper.

Strong points: transparency, human verification, expertise shaping every input and checking every output, and a stated reason why the tool did this job better than the person.

Where it's arguable:
- The IB's materials were the reference. Is a paper closely emulating a copyrighted exam format a derivative of that format, and does that matter for internal use?
- Do the sample papers themselves carry a citation or a note, or does the citation live only in what Paul says in class? A student who finds the PDF later has no way to know.
- "AI is better than I am at writing IB-style questions" is honest, and a student might ask: if the teacher outsources question writing, why can't I outsource essay writing? The answer (the teacher checks every question against expertise the student doesn't yet have, and the purpose of the task is different) is exactly the discussion the site wants.

**Case 2: AI feedback on IA first drafts.**
A similar folder for the IA, plus Paul's own guide, a comparison of three IAs across grading bands, and his own sample IA. He used an AI tool with all of that as reference to give feedback on students' first drafts, plus general notes to him about issues to address. He wrote his own handwritten notes on each draft first, then read the AI feedback afterwards, because he felt the AI comments would have colored his own and he didn't want to pass off work that wasn't his as authentic. Students were not aware their drafts had been processed by an AI tool until he explained it in class, where he also gave his reasons: reference material ensures more granular coverage than an hour per report would allow, the AI has no bias about the student, it catches things a person misses when cross-referencing everything, and trend spotting gives class-level feedback.

Strong points: transparency after the fact, a richer reference base than a rushed human read, class-level trends, and the order of reading. Writing his own notes first and reading the AI's second is a technique worth naming on the site ("blind first"), because it's the difference between AI checking a teacher's judgment and AI replacing it.

Where it's arguable, and what the site should build from it:
- **Students didn't know beforehand.** Their work was sent to a company's servers without their knowledge. Paul's view is that this is the right place to open the discussion of what information is retained, cached, or accessible to a company once a user provides it. This becomes an activity of its own: read the actual data policy of three or four tools (a Chinese provider, a US provider, Copilot under a school M365 tenancy, and a local model) and answer the same five questions for each. What's kept? For how long? Is it used for training? Who can see it? Can you delete it? The local model answers all five in one word, which is the case for local AI, but the real lesson is that the answer differs per company and per plan, so you check the policy every time.
- **"The AI is unbiased"** is worth stating precisely. It has no bias about the student, which is the real point. It is biased toward the sample IAs and reference material it was shown, and toward whatever those emphasized.
- **IB rules on draft feedback.** The IB limits teacher feedback on the IA to one round of advice on a draft, without editing. AI feedback delivered by the teacher almost certainly counts as that round, which is fine, but the site should check the current guide before saying anything about it.
- **Whose feedback was it?** The student received two voices. Which one carries the teacher's authority, and did the student know which was which?

**Case 3: code versus images.**
Paul uses AI for code assistance and creation (this site included) and dislikes AI poster generation. His argument for treating them differently: an AI-generated JPEG can't be modified easily, can't be perfectly duplicated, and needs another generation to fix a spelling mistake or garbled text; code can be perfectly replicated, easily modified, was trained on the capabilities of the language rather than on the artwork of humans, and can be entirely changed by hand afterward.

This is a good case because it separates two questions students usually merge: "is it made by AI" and "what is it made of, and who does it belong to." A scenario card pair (the same student uses AI for a poster image and for a script to sort their data) makes the distinction concrete. The pushback a student might raise: code models were also trained on human-written code, some of it under licenses that mattered to its authors. That's a fair challenge and the site should let it stand rather than settle it.

Each case could be presented as: the situation, what Paul did and why, then "what would you have done differently," then a reveal of the pushback points. Teachers see it modeled by a teacher who is open about it, which addresses the reluctance problem directly.

## Learn mode and teacher mode

Settled 2026-09-16: one experience, with a toggle.

- **Learn mode** is the default and the whole site. Anyone can go straight through it alone, form opinions, and take something away, with no other user involved. There's no "student mode"; a teacher reads it the same way a student does.
- **Teacher mode** is a toggle that turns the same activities into something a teacher can present: bigger type, a reveal step, a vote, a timer, and the option to open a live session that students join on their phones. The vast majority of visitors never flip it.
- Every activity must work in learn mode without a session. The live session is an add-on to teacher mode, never a requirement.

## Teacher-facing presentation pages

Different from the DP present mode (which turns notes into slides). These are activity-driven: a teacher drives them from the front of the room, students respond, the page shows the result. Design constraints:

- Large type, high contrast, nothing that depends on hover. Works on a touch screen and with a keyboard or clicker.
- One activity per screen. The teacher's controls are obvious. A "reveal" step for every activity, so the class commits before seeing the answer.
- The scenario cards, the recency test, the source check, and the re-dated post detective all work as whole-class activities with a vote.
- Voting: hands-up with the teacher entering the count works everywhere and needs nothing. Live voting on students' own devices uses the pattern from the `blurt` and `cloud` repos: a share code, anonymous join, one Durable Object per session, WebSocket updates. See `plans.md` for what that means for this repo. Both should exist, and the hands-up version is built first.
- Timer, and a reset. Teachers reuse these across periods.
- Deep links to a specific activity so a teacher can put one URL in a lesson plan.

## Glossary connections

- One data file, one entry per term: `id`, `term`, `short` (hover card), `full` (glossary page), `links` (verified).
- Every marked term on every page gets a hover card and a deep link, as localai did. Listeners delegated from the document.
- Proposed extra: a "terms on this page" strip near the top of each long page, so a teacher can preview the vocabulary before teaching.
- Likely terms: large language model, model, training data, knowledge cutoff, search grounding, context window, token, prompt, hallucination, citation, acknowledgement, paraphrase, plagiarism, academic integrity, primary and secondary source, provenance, recency bias, content farm, SEO, affiliate link, retrieval practice, spacing, prompt engineering (or a plainer word for it), generative AI, agent (maybe), open weights (maybe, if local models come up).

## Mechanisms from `make/localai` worth knowing about

Not to be copied, but they show what worked in a similar static, no-build setup.

Scroll reveals
- `data-reveal` on any element. An IntersectionObserver with a `-10% 0px` root margin adds `.in-view` the first time the element enters, then unobserves it. CSS handles the transition. Siblings get a `--i` index for a 60 ms stagger.
- Reveals are one-way. Reversible reveals bounced when a reader stopped at the trigger edge, and were reverted. Ambient background motion stayed continuous and separate from reveals.
- All motion is killed under `prefers-reduced-motion`.
- Trap: the agent browser pane reports `visibilityState: hidden`, so IntersectionObserver never fires there. Scroll reveals have to be checked in a real browser window.

Glossary
- In-page markup: `<a class="gloss" data-term="token" href="#/glossary/token">`. Hover or keyboard focus shows the short definition; click goes to the full entry.
- Every link URL was checked live for HTTP 200 and canonical title before shipping.

Recorded versus live
- localai's race streamed real recorded model answers token by token at their real speed, labeled with machine and date. The same discipline applies to every transcript here: recorded, dated, model named.

Exploration rewards
- Per-tab visited badges, a progress ring, a small celebration when everything had been seen. Nothing gated. Could translate here to a per-page activity tracker.

Tests
- DOM-free modules so logic was unit-testable in Node with a fake document. The scenario scoring, citation builder, and glossary renderer would benefit.

## Constraints on any interactive

- No build step. Vanilla JS modules with relative imports, or an `importmap` to unpkg for a library.
- Everything drawn with CSS, SVG or canvas unless the direction calls for imagery. Mockup web pages (the recipe post) are HTML, which is fine.
- Works with touch and keyboard, not only hover.
- Responsive. Mobile layout is not secondary here.
- No live AI calls, ever. Settled 2026-09-16. Every AI interaction on the site is recorded or simulated, and the experience is fully curated. No API keys, nothing to maintain over time.
- Nothing fetched from another host. Fonts, libraries and data all live in this repo. A blocking request to an unreachable host stops a page loading in China. (The `cloud` repo states this rule and the reason; the main edu `style.css` currently imports from cdnfonts.com, which is worth raising.)
- Every string that a reader sees lives in a data file, not in JS logic, because Chinese translations and translanguaged elements are planned once the English build is done.
