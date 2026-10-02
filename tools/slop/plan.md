# Slop: plan

Started 2026-10-01. A single, vertically scrolling page at `edu/tools/slop` that teaches students to recognize AI slop in the posters and texts they meet at school. It is a standalone companion to `edu/ai`: it links there, but it does not share its layout, scripts or look.

Nothing is built yet. This file is the plan and the place to record decisions.

## Purpose

- **For students:** a quick, satisfying way to name what they already sense about slop posters, and a vocabulary for it. The page assumes they are already good at this and lets them prove it before it explains anything.
- **For teachers (quietly):** the page never addresses teachers directly until the closing commentary. The posters are the kind that hang in our corridors, and every one of them on this page is cited with its tool, prompt and date, which is the thing the corridor posters never do. The page models the behavior instead of lecturing about it.

## The journey

One page, top to bottom. Each section is roughly one screen tall on a laptop, taller on a phone.

1. **Opening.** Title and Paul's opening commentary (placeholder copy at first). Ends with a single self-rating question: "How good are you at spotting AI slop?" on a 1 to 5 scale. The answer is kept and shown again at the end.
2. **Poster 1 (guided).** The student taps anywhere they think is a tell. After they press "Check", every tell is revealed as a hand-drawn marker ring, their taps are shown as hits or misses, and tapping a ring opens a short explanation of that tell. Score shown as "You found 5 of 9."
3. **Poster 2 (harder).** Same mechanic, no category hints, slightly stricter hit areas.
4. **Text slop.** Two or three short texts from older local models, presented as the student would actually meet them (a handout, a worksheet intro, a school newsletter paragraph). The student taps phrases or sentences; the reveal highlights the tells in place and explains each one.
5. **Poster 3 (the one about slop).** A poster about recognizing AI slop that is itself slop. The student now works with no help at all. The reveal makes the irony explicit only once, in the last explanation.
6. **Results.** Total found across all activities, broken down by category (see the taxonomy below), set beside the self-rating from the opening.
7. **Closing.** Paul's closing commentary, the part that turns gently towards teachers: students don't read these, cite your AI, and what to make instead. Links to `edu/ai`.

Each poster and text carries a small citation line under it: tool, model, prompt, date. This is part of the argument, so it is visible, not tucked into a footnote.

## Interactions

- **Guess, then reveal.** Every activity starts in guess mode. Taps drop a small numbered pin. A "Check" button reveals the answers. This is how the page measures what students already know, rather than handing them the answers to click through.
- **Hit detection.** A tap counts as a hit if it lands inside a tell's region (a rectangle or ellipse stored as percentages of the image, so it survives resizing). Several taps on one tell count once.
- **Explanations.** After the reveal, tapping a ring opens a short card: what the tell is, why AI produces it, and what a person making the poster by hand would have done instead. Two or three sentences each.
- **Zoom.** Posters are dense and tells are often in the small print, so on phones the poster opens in a pinch-zoomable view. On desktop a hover lens may be enough. To be tested on real devices.
- **Text tells.** Texts are rendered as real text, not images. Tells are stored as exact quoted phrases and matched in the text at load, so the texts can be edited without recalculating positions.
- **State.** Score and self-rating are kept in memory, with `localStorage` as a convenience so a reload doesn't lose progress. Nothing is sent anywhere. No accounts, no backend.
- **Keyboard and screen readers.** Every tell region is also a focusable button after the reveal, so the explanations are reachable without a mouse.

## Taxonomy of tells

Shared categories so the results can say "you're good at spotting fake text, less good at layout". Final list to be fitted to the actual images.

**Posters**

- *Lettering:* garbled or invented words in the small print, near-miss spellings, text that changes font mid-word, fake QR codes and logos.
- *People and hands:* extra or fused fingers, identical faces, the same perfectly diverse group of smiling teenagers, objects melting into hands.
- *Clutter:* more icons than ideas, icons that don't match the point beside them, lightbulbs, rockets, brains with circuit lines, sparkles.
- *Style:* glossy 3D "animated film" rendering, the warm orange and teal palette, soft glow on everything, no single consistent light source.
- *Layout:* everything centered and symmetrical, numbered steps that don't count correctly, boxes of equal size regardless of importance.
- *Content:* invented quotes or quotes with no source, statistics with no source, slogans that say nothing ("Unlock your potential").
- *Attribution:* no mention that AI made it.

**Text**

- *Vocabulary:* "delve", "tapestry", "navigate", "landscape", "crucial", "foster", "empower".
- *Openers and closers:* "In today's fast-paced world", "It's important to note", "In conclusion", "Ultimately".
- *Structure:* groups of three, "not only X but also Y", bold label followed by a colon on every bullet, every paragraph the same length.
- *Padding:* restating the question, summarizing what was just said, hedges that commit to nothing.
- *Vagueness:* no names, dates, numbers or local details; examples that could apply to any school anywhere.
- *Formatting:* emoji headings, em dashes, headings on a 150 word text.

## Look and feel

The page should look made by a person, because that is the point it argues. Proposal, to be confirmed:

- A photocopied zine or school noticeboard feel: off-white paper, black ink, one strong spot color (a marker red), visible grain. The opposite of the glossy posters it displays.
- Reveals drawn as hand-drawn marker rings and underlines (SVG paths with slight wobble), as if a teacher had marked the poster with a red pen.
- Explanations on small "sticky note" cards.
- One display face with character and one plain, very readable body face. Self-hosted or Google Fonts.
- Its own light and dark mode (dark as a "blackboard" variant). It does not use the site's `themes.css`.

## Writing

- Paul writes the bookend commentary and proposes the education texts; placeholder copy is marked clearly as placeholder.
- Site rules apply everywhere, including this file and code comments: no em dashes, no "not just X but Y", no double titling, no punchy fragment reveals, no triads used for rhythm. The irony of a slop page containing slop would not be lost on students.
- Reading level matches `edu/ai`: written at grade 6 to 8 for grade 9 to 12 readers, with terms defined in place.
- Explanations of tells say *why* the model produces them (for example, image models draw letters as shapes, not as spelling), because the mechanism is what makes the knowledge stick.

## Files

```
tools/slop/
  plan.md            this file
  index.html         the page
  slop.css
  slop.js            guess and reveal logic, scoring, text matching
  data/
    posters.json     per poster: image, citation, tell regions, explanations
    texts.json       per text: body, citation, quoted tells, explanations
  img/
    poster-1.webp    converted from the originals, about 1600px tall
    poster-2.webp
    poster-3.webp
    originals/       the untouched PNG exports, kept for the record
```

No build step, no libraries unless one earns its place (Cloudflare Pages serves source directly). JSON is loaded with `fetch`.

## Authoring the tell regions

I can look at the images and draft the regions, but percentages placed by eye will be rough. Proposed: a small authoring mode (`index.html?author`) where dragging on a poster draws a region and copies its JSON to the clipboard. It is hidden from students and saves a lot of fiddly editing. Optional; see open questions.

## What Paul provides

- [ ] Poster 1 (made in ChatGPT): original PNG, the exact prompt, date, model as shown in ChatGPT.
- [ ] Poster 2 and poster 3: same details. Prompts below.
- [ ] Two or three text outputs from older local models: the prompt, model name and size, date. A realistic school request works best ("Write an introduction for a Year 10 worksheet on renewable energy").
- [ ] The education texts and commentary, once the structure is in place.

## Poster prompts

Written the way a busy teacher would actually write them. Detailed design instructions would produce a cleaner, less representative poster, so these ask for the things that cause slop: lots of text, lots of icons, a quote, a mascot. Take the **first** image ChatGPT returns and don't regenerate for quality, so the page shows what a corridor poster really is. Record the prompt and date for the citation line.

**Poster 2, a typical school topic.** Swap the topic if it overlaps with poster 1 (good alternatives: Academic Honesty, Wellbeing Week, Lab Safety, Growth Mindset).

> Create a colorful, eye-catching poster for my high school classroom about Digital Citizenship. Title: "Be a Responsible Digital Citizen!" Include 6 key tips, each with an icon and a short explanation, illustrations of diverse students using laptops and phones, and an inspiring quote at the bottom. Make it bright, engaging and modern. Portrait, A3.

**Poster 3, the poster about slop.**

> Make an engaging educational poster for high school students titled "Can You Spot AI Slop?" that teaches them how to recognize low-quality AI-generated content. Include 8 warning signs, each with an icon and a short explanation, a friendly robot mascot holding a magnifying glass, a surprised student character, a QR code for more information, and a motivating slogan at the bottom. Bright, modern infographic style for a school hallway. Portrait, A3.

## Open questions

1. Is the zine / red-pen look right, or should it lean harder into a public safety announcement (hazard stripes, warning-label type)?
2. Should the page have a link on the tools index and on `edu/ai`, or stay unlisted until it's finished?
3. Do any posters show the school's name or logo? If so, blur it or regenerate without it.
4. Build the `?author` mode for placing regions, or will you be happy adjusting numbers I draft by eye?
5. Should results include a share line or nothing at all? Default is nothing.
6. Chinese translation later, as with `edu/ai`? If so, the text tells need their own handling, since the vocabulary tells are English-specific.
