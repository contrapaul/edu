# Slop: plan

Started 2026-10-01. A single, vertically scrolling page at `edu/tools/slop` that teaches students to recognize AI slop in the posters and texts they meet at school. It is a standalone companion to `edu/ai`: it links there, but it does not share its layout, scripts or look.

This file is the plan and the place to record decisions.

**Built so far (2026-10-02):** `index.html`, `slop.css`, `slop.js` and `data/posters.json`, with the opening and closing commentary as placeholders and one activity, Phoenix Dumplings, using the guess-then-reveal identifier. Rings are drawn in code from the regions in the JSON, in one marker red (found) and dark ink (missed). This is the test of the coded method; Paul may later switch to his own annotations exported as transparent PNGs.

**Built 2026-10-03:** all six posters are on the page in this order: Goop, Digital Citizen, Rome, Dumplings (the only interactive one), Spot AI Slop, then the Warning Poster last, since its observations compare it to Spot AI Slop. The five static posters show a numbered list of observations beside the poster (alternating sides on desktop) and open in a full-screen viewer when tapped, for reading the small print. Paul will draw the callout shapes for these in Procreate.

- **Phones:** the Dumplings poster opens full screen ("Tap to start", or tap the poster). Pins, Check and the score sit in a bar along the bottom. After Check, tapping a ring opens a popup on the image beside the ring; tapping outside it or the round X closes it. A round X at the top right leaves full screen. The desktop side note is not used on phones.
- **Scroll-in:** sections build in as they enter the viewport. Headings and paragraphs rise and fade in, posters slide in from their side with a slight turn, and observation items slide in one after another. The masthead letters stamp in on load. All of it is off for readers who ask for reduced motion, and nothing is hidden if JavaScript fails.

## Purpose

- **For students:** a quick, satisfying way to name what they already sense about slop posters, and a vocabulary for it. The page assumes they are already good at this and lets them prove it before it explains anything.
- **For teachers (quietly):** the page never addresses teachers directly until the closing commentary. The posters are the kind that hang in our corridors, and every one of them on this page is cited with its tool, prompt and date, which is the thing the corridor posters never do. The page models the behavior instead of lecturing about it.

## The journey

One page, top to bottom. Each section is roughly one screen tall on a laptop, taller on a phone.

Updated 2026-10-02 for the six posters (details in "The posters" below).

1. **Opening.** Title and Paul's opening commentary (placeholder copy at first). Ends with a single self-rating question: "How good are you at spotting AI slop?" on a 1 to 5 scale. The answer is kept and shown again at the end.
2. **AI Slop Rainbow Goop (guided, the hook).** The funniest poster opens the page and teaches the four marker colors (see "Tell categories"). The student taps anywhere they think is a tell. After they press "Check", every tell is revealed as a hand-drawn marker ring in its category's color, their taps are shown as hits or misses, and tapping a ring opens a short explanation of that tell. Score shown as "You found 5 of 9." The color key is visible for this one only.
3. **Digital Citizen.** The archetype corridor poster, same mechanic, no key.
4. **A Day in the Life of a Roman (harder).** Same mechanic, no hints. The densest poster, and the only one with facts that are confidently wrong, which introduces the idea that slop can mislead as well as bore.
5. **Phoenix Dumplings (a different question).** This poster looks competent, so hunting for glitches undersells it. Instead the prompt is shown beside it and the student marks what the AI added that wasn't in the prompt. The reveal: almost every useful word came from the prompt, the AI added filler slogans and decoration, and it left out what a real shop poster needs (address, opening hours, prices). The "students say" bubble is the prompt pasted in word for word.
6. **Text slop.** Two or three short texts from older local models, presented as the student would actually meet them (a handout, a worksheet intro, a school newsletter paragraph). The student taps phrases or sentences; the reveal highlights the tells in place and explains each one.
7. **Same kid, every time.** A short interlude, light on interaction. The black-haired boy in the green hoodie appears in Digital Citizen, Spot AI Slop and the Warning Poster, which were made from different prompts on different days. Crops of him side by side, then the two slop posters' warning signs side by side, show that the tool has a house style and students have seen it hundreds of times.
8. **Can You Spot AI Slop? (unassisted).** A poster that lists the warning signs of slop while committing several of them. The student now works with no help at all. The reveal makes the irony explicit only once, in the last explanation.
9. **Results.** Total found across all activities, broken down by category (see the taxonomy below), set beside the self-rating from the opening.
10. **Closing.** Paul's closing commentary, the part that turns gently towards teachers: students don't read these, cite your AI, and what to make instead. Links to `edu/ai`.

Each poster and text carries a small citation line under it: tool, model, prompt, date. This is part of the argument, so it is visible, not tucked into a footnote.

## Interactions

- **Guess, then reveal.** Every activity starts in guess mode. Taps drop a small numbered pin. A "Check" button reveals the answers. This is how the page measures what students already know, rather than handing them the answers to click through.
- **Hit detection.** A tap counts as a hit if it lands inside a tell's region (a rectangle or ellipse stored as percentages of the image, so it survives resizing). Several taps on one tell count once.
- **Explanations.** After the reveal, tapping a ring opens a short card: what the tell is, why AI produces it, and what a person making the poster by hand would have done instead. Two or three sentences each.
- **Zoom.** Posters are dense and tells are often in the small print, so on phones the poster opens in a pinch-zoomable view. On desktop a hover lens may be enough. To be tested on real devices.
- **Text tells.** Texts are rendered as real text, not images. Tells are stored as exact quoted phrases and matched in the text at load, so the texts can be edited without recalculating positions.
- **State.** Score and self-rating are kept in memory, with `localStorage` as a convenience so a reload doesn't lose progress. Nothing is sent anywhere. No accounts, no backend.
- **Keyboard and screen readers.** Every tell region is also a focusable button after the reveal, so the explanations are reachable without a mouse.

## The posters

Six posters were made in ChatGPT on 2026-10-01 and 2026-10-02 (prompts at the end of this file). All are WebP, 1054 x 1492, except Dumplings at 1024 x 1536. None shows the school's name or logo. All were made on ChatGPT's free plan, which shows no model name, so citation lines read "ChatGPT (free plan)" with the date. Phoenix Dumplings is a fictional shop.

The page should say once, plainly, that these tells are common but not guaranteed. Paid plans and other tools put more effort into each image and may avoid some of them, and every new model fixes a few. The free plan is what most people making corridor posters use, so it's a fair sample, but students should learn to look rather than to tick off a checklist.

A fairness rule for the reveals: only count tells the prompt didn't ask for. The Rome prompt asked for cringe and the Goop prompt asked for satire, so the cringe and the jokes themselves are not scored. How they are written is fair game: the Goop prompt asked for selling points that are secretly negatives, and it did not ask for every one of them to be two clipped fragments. The citation line shows each prompt, so students can check this for themselves.

Tell lists below are drafts from looking at the images. Each will be checked again at full zoom when the regions are placed.

### AI Slop Rainbow Goop: keep, opening activity

Paul annotated this one by hand on an iPad (`AI_Slop_Rainbow_Goop_Ad.png`), and his four marker colors became the page's tell categories. It goes first because it's funny and because the reader doesn't expect a poster that is openly about slop to be full of slop tells.

- **AI speak (purple):** almost every line of copy is two clipped fragments. "Feels real. Isn't.", "100% confidence. 0% originality.", "Corporate speak. Now in goop form.", "Instant content. Zero effort.", "Less effort. More output.", "Same content. Different day.", "Less effort. More slop.", "4 Flavors, Endless Possibilities", "Real creativity? Over-rated." and "Quality? Optional." One of these is a joke; ten of them is a habit.
- **Visual inconsistency and artifacts (hot pink):** the clock icon's face sits off-center in its circle. The sticky note has ghost marks in its empty corner and a half-drawn smiley after "day."
- **Mistakes (lime):** the tub's label is printed with the same rainbow goop that's inside, so the label and the contents can't be told apart at the top and bottom of the tub. The icons fall apart on a second look: the brain starts as a front view with left and right halves, then grows what looks like a cerebellum at the bottom right while keeping the split down the middle. The "Dead Internet" icon is a blue square with a face, the "I Asked Chat" icon is a target inside a speech bubble, and the smiley has a second face layered over it. Each one passes a glance and fails a look.
- **Garbled text (electric blue):** "Ingredieats", "(optomal)" and the other ingredient lines losing their letters, and a barcode with no real numbers under it.
- Not marked yet, candidates for Paul: "Harmlessly addictve" is missing an i, and the tub promises 4 flavors of what is visibly one mixed goop.

### Be a Responsible Digital Citizen: keep, second activity

The poster students walk past every day.

- The closing quote is credited to Bill Gates with no source. I can't place it; to be verified before the page calls it invented.
- Tip 4 tells students to "check your sources" on a poster whose only quotation has none.
- Three em dashes in the body text, and "a tool, not a replacement for real life" in tip 6 is the "not X but Y" shape.
- Slogans in threes: "Think, Be Kind, Make a Positive Impact" and "Learn, Create, Support, Inspire" (four, but the same habit).
- The diversity checklist in tip 2: four students, each a different type, all with the same face shape and smile.
- Headphones on nearly every student, and the boy in the green hoodie (see "Same kid, every time").
- Six boxes of identical size and structure, each with an icon, regardless of how much each tip matters.
- Generic icons: shield with padlock, lightbulb on a laptop, magnifying glass.

### A Day in the Life of a Roman: keep, harder activity

The richest poster by far. It's also the one a history teacher would most plausibly hang, which makes its errors matter.

- **Anachronism:** the dome in the top right is St Peter's Basilica, finished in the late 1500s, more than a thousand years after the Western Roman Empire fell.
- **Confidently wrong:** "Reading, writing, or learning (yes, actual books!)". Romans read scrolls; the bound book (codex) came late. Times like "6 to 7am" assume clocks and fixed hours that Romans didn't use.
- **Garbled lettering:** the handwritten note on the breakfast photo ("a liittle diffferent") and the scribble on the market sign.
- **Prompt taken literally:** the prompt asked for "Roman flourishes all over" as decoration, and the poster made a section titled "ROMAN FLOURISHES".
- **The same idea three times:** "Same human nature. Different century.", "Different times. Same vibes." and "Different century. Same human story."
- **"Not just X" twice:** "Not just legionaries... real people!" and "more than just gladiators".
- A broken sentence: "NO TIKTOK? The problem. Roman teens spent their time doing..."
- The Colosseum three times and two near-identical marble busts.
- The modern teen in sunglasses and a toga over a T-shirt, and a bath scene that looks like a hotel pool.
- Em dashes in the body text.

### Phoenix Dumplings: keep, "what did the AI add?" activity

A different lesson. It looks like a good poster, and a student hunting for glitches will find few, which is itself worth learning.

- **Prompt echo:** "Students say their dumplings are 'delicious'!" is the prompt pasted onto the poster. The second bubble keeps the prompt's "they", so a customer quote reads as if about someone else.
- **Filler the prompt didn't ask for:** "Authentic flavors, Quality ingredients, Made with care", "Perfect with our house-made sauces!" and the smiley face.
- **Missing:** no address, hours, prices or phone number, and no Chinese characters on a jiaozi and baozi shop. The AI can't know these, so it leaves them out rather than asking.
- Decoration from a template: phoenix logo, red fret corners, brush strokes behind every label.

Built 2026-10-02 with the standard identifier and seven tells: the two prompt-echo bubbles, the tagline, "house-made sauces", no Chinese characters, the empty footer, and the template corners. The prompt is printed under the poster. The sauce bowls were dropped as a tell: at full size black vinegar and soy sauce are visibly different colors.

### Can You Spot AI Slop?: keep, final unassisted activity

The self-referential poster. Most of its advice is sound, which makes the tells sharper.

- Three slogans in threes in the bottom strip alone: "Real people. Real thinking. Real impact.", "Be Curious. Think Critically. Make Better Choices." and "Better questions. A smarter internet. A brighter future."
- Warning sign 1 ("too perfect") is illustrated with a flawless AI fairy-tale landscape, and sign 6 ("lack of real emotion") with an AI-generated girl. The examples are the problem they describe.
- The QR code. To be tested, but it is very likely not a real code, on a poster warning about fake sources.
- Eight equal boxes, each with icon, explanation and a handwritten catchphrase in the same position.
- The robot mascot with a magnifying glass, the surprised student (the green hoodie boy again), the lightbulb.
- An em dash in sign 7.

### AI Slop Warning Poster: drop as an activity, keep as supporting material

The prompt asked for an advert that used warning signs as selling points, "more like an ad for a product than an educational poster". ChatGPT made an educational poster anyway ("Spot the red flags. Avoid the slop.") that repeats Spot AI Slop: the same green hoodie boy, a QR code, "In today's fast-paced world" in both, and the same warning signs. As a third hunt it would be repetitive. Its value is in that repetition, so it appears only in the "Same kid, every time" interlude, beside Spot AI Slop, with its prompt shown to make the point that the tool drifted back to its default.

## Tell categories

Four categories, taken from the colors Paul used to mark up the Goop poster. The colors were for showing the categories, not a decision about the site; the built page uses one red for rings and shows the category as a label on each explanation note. The results breakdown will use these categories so a student finishes knowing where they're strong ("you catch AI speak, you miss garbled text").

| Color | Category | On posters | In text |
|---|---|---|---|
| Purple | **AI speak** | Two-fragment slogans ("Less effort. More slop."), slogans in threes, "not just X", slogans that say nothing, the same idea repeated, prompt words pasted in ("Students say their dumplings are delicious") | "Delve", "tapestry", "In today's fast-paced world", "It's important to note", groups of three, "not only X but also Y", padding, hedges, em dashes |
| Hot pink | **Visual inconsistency and artifacts** | Smudges and ghost marks, icons off-center, lighting from nowhere, identical faces, hands and objects melting together, repeated landmarks | Formatting that changes partway through: headings on a short text, bold labels on every bullet, emoji headings |
| Lime | **Mistakes** | Things that are wrong or nonsensical on a second look: the label made of goop, icons that fall apart, St Peter's in ancient Rome, books instead of scrolls, two identical sauces, an unsourced quote, missing information a real poster needs | Wrong facts stated confidently, invented sources, details that could apply to any school anywhere |
| Electric blue | **Garbled text** | Words decaying into nonsense, near-miss spellings, barcodes and QR codes that aren't real | Older local models repeating themselves, losing the thread or breaking off mid-sentence |

"Same kid, every time" (house style) is shown in its interlude and not scored.

## Look and feel

The page should look made by a person, because that is the point it argues. Proposal, to be confirmed:

- A photocopied zine or school noticeboard feel: off-white paper, black ink, visible grain. The opposite of the glossy posters it displays.
- One spot color, marker red, for found tells. Missed tells are ringed in dark ink. Rings and pins keep fixed colors in both themes because they sit on the poster, which is always light.
- Rings are SVG paths with a slight wobble that overshoot their start like a marker loop, drawn on in sequence when Check is pressed.
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
  ref/               Paul's annotated PNGs, source for the marks
  data/
    posters.json     per poster: image, citation, tell regions, explanations
    texts.json       per text: body, citation, quoted tells, explanations
  img/
    marks/           Paul's strokes, one transparent PNG per poster per color
    digital-citizen.webp
    rome.webp
    dumplings.webp
    spot-ai-slop.webp
    slop-goop.webp
    slop-warning.webp
```

The six images were moved into `img/` with the names above on 2026-10-03 (with `git mv`). They are already WebP at a sensible size, so no conversion is needed. Static posters' observations live in `posters.json` as an `observations` array, with an optional `intro` for fairness notes. Paul's annotated Goop PNG is still at the top of `tools/slop/` and is not loaded by the page. Crops for the "Same kid" interlude are done in CSS with `object-position`, not as extra files.

No build step, no libraries unless one earns its place (Cloudflare Pages serves source directly). JSON is loaded with `fetch`.

## Authoring the tell regions

Regions are stored in `posters.json` in the poster's own pixel coordinates, as `[x, y, width, height]` with an optional fifth value for rotation in degrees (used for the slanted tagline on Dumplings). A tell can have several regions (the four corners on Dumplings). For now I place them by eye from gridded crops of the image.

**Option under consideration: pure annotation.** Paul marks each poster on the iPad and exports only the markup as a transparent PNG at the poster's full size, with the poster itself left out. The page would fade that layer in on reveal, so students see a teacher's real marks. Hit regions and explanations would still live in the JSON. To be decided after testing the coded rings.

## What Paul provides

- [x] Posters, with prompts, dates and source (six, added 2026-10-02).
- [x] Model name: none shown on the free plan. Citations read "ChatGPT (free plan)".
- [x] Goop annotated (2026-10-02).
- [ ] A decision on coded rings or pure annotation, after trying the Dumplings activity.
- [ ] Two or three text outputs from older local models: the prompt, model name and size, date. A realistic school request works best ("Write an introduction for a Year 10 worksheet on renewable energy").
- [ ] The education texts and commentary, once the structure is in place.

## Open questions

1. Is the zine look right, or should it lean harder into a public safety announcement (hazard stripes, warning-label type)?
2. Should the page have a link on the tools index and on `edu/ai`, or stay unlisted until it's finished?
3. Should results include a share line or nothing at all? Default is nothing.
4. Chinese translation later, as with `edu/ai`? If so, the text tells need their own handling, since the AI speak tells are English-specific.
5. Keep the Warning Poster only as interlude material (recommended), or drop it entirely?

Settled 2026-10-02: Goop opens the page as the first activity; Phoenix Dumplings is fictional; no model name is shown on the free plan; regions are placed by hand in the JSON for now. The marker colors were illustrative, not a site decision.

## Prompts

1. Dumplings Oct 1, 2026- ChatGPT
Make me a poster advertising a dumping shop called 'Phoenix Dumplings". They have the best, freshest Jiaozi and Baozi, including vegetarian friendly fillings. Students say their dumplings are "delicious", and "so good they ordered another full plate!" They are offered steamed and fried, and have black vinegar, chili oil, ginger, and soy sauce for dipping.

2. Roman History Oct 2, 2026- ChatGPT
Create poster for a high school history classroom about being a citizen of Ancient Rome. Title: "A day in the life of a Roman" Include details about daily life, photorealistic pictures of life in Rome, "roman flourishes" all over, somewhat cringe-inducing comparisons to modern life- IE "Tiktok isn't invented for at least 2000 years, instead Roman teens spent their time doing..." Portrait, A3.

3. Digital Citizen Oct 1, 2026- ChatGPT
Create a colorful, eye-catching poster for my high school classroom about Digital Citizenship. Title: "Be a Responsible Digital Citizen!" Include 6 key tips, each with an icon and a short explanation, illustrations of diverse students using laptops and phones, and an inspiring quote at the bottom. Make it bright, engaging and modern. Portrait, A3.

4. Spotting AI Slop Oct 1, 2026- ChatGPT
Make an engaging educational poster for high school students titled "Can You Spot AI Slop?" that teaches them how to recognize low-quality AI-generated content. Include 8 warning signs, each with an icon and a short explanation, a friendly robot mascot holding a magnifying glass, a surprised student character, a QR code for more information, and a motivating slogan at the bottom. Bright, modern infographic style for a school hallway. Portrait, A3.

5. AI Slop Bucket Oct 2, 2026- ChatGPT
Create another poster advertising 'AI Slop', a rainbow goop that in flavors like brainrot, dead internet, "I asked chat", and "LinkedIn". Not an educational poster, but instead very tongue in cheek, with the many selling points being negatives that initially read as positives, like 'No thinking required', and 'You don't need to learn art anymore!". Aim for a photorealistic product and packaging. Portrait, A3

6. AI Slop with information Oct 2, 2026- ChatGPT
Create a poster advertising 'AI Slop' that uses warning signs as selling points, and looks more like an ad for a product than an educational poster. Portrait, A3