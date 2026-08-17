# DP textbook builder

Generates two A4 PDFs from the live pages in `curriculum/dp/`. Nothing is
hand-edited: every run re-reads the pages, so a rebuild after revising a topic
always produces correct documents.

| Output | Contents |
|---|---|
| `out/dp-textbook.pdf` | The student book. **No answers anywhere.** |
| `out/dp-answer-key.pdf` | Answer key / teacher support materials: quiz answers, Paper 2 model answers, matching-activity solutions with explanations. |

## Usage

```bash
cd scripts/book
npm install        # first time only
npm run pdf
```

`npm run build` stops after the HTML if you want to inspect
`out/book-student.html` or `out/book-answers.html` in a browser first.
`npm run pdf:student` and `npm run pdf:answers` render one document each.

Image resolution can be overridden per run:

```bash
BOOK_IMG_WIDTH=1600 BOOK_IMG_QUALITY=85 npm run pdf
```

## How it works

1. **`build.js`** reads chapter order from `curriculum/dp/index.html`, pulls
   `.curr-main` out of each page, and applies the transformations below.
2. **`prepare-images.py`** downscales images to print resolution.
3. **`pagedjs-cli`** paginates and renders to PDF.

Transformations:

- Collapsible sections and objectives are forced open.
- **Case studies are folded in from their modals.** They live *outside*
  `.curr-main` and are `display: none` on screen, so they reach the book only
  because `build.js` looks them up by each card's `data-modal`.
- **Matching activities become paper tasks**: numbered items on the left,
  lettered categories on the right, for drawing lines. The data comes from
  `activities.js`, which runs each topic script in a sandbox and captures what
  it passes to `DragSort.init` rather than parsing it.
- Genuinely screen-dependent tools (calculators, canvas diagrams, sliders) and
  time-based media (`video`, `audio`, `iframe`) become a one-line pointer to
  the page URL. The PDF does not pretend to be the full experience.
- Quizzes are compacted to two-column options. Answers appear **only** in the
  answer key, where the correct option is ticked and the explanation follows.
- Figures float so text wraps beside them; `.case-study-img` stays full width.
- Empty `<img src="">` figure placeholders are dropped.
- Cross-chapter links become in-document jumps annotated with the target page
  number; site-relative links are absolutised.
- Every `id` is namespaced per chapter so anchors stay unique.

## Editing the book

Change `config.js`, not `build.js` and never the generated output:

| Field | Purpose |
|---|---|
| `variants` | The two documents: name, cover text, `showAnswers`, `assessmentOnly` |
| `assessmentSections` | Section ids the answer key keeps (`quiz`, `paper2`) |
| `kicker`, `author` | Cover text shared by both |
| `exclude` | Pages in `curriculum/dp/` to keep out |
| `siteStylesheets` | Site CSS the book inherits |
| `fontDir` | Where the Lexend webfonts live |
| `widgetSelectors` | Elements replaced by a paper activity or a pointer |
| `stripSelectors` | Screen-only controls removed outright |
| `textRewrites` | Prose that tells the reader to click something. `replace` takes a string, or an object keyed by variant name when the two documents must promise different things |

Page design lives in `book.css`, which loads *after* the site stylesheets so
the book inherits the site's type and topic colours by default.

## Gotchas worth remembering

**Scroll containers silently eat content.** `overflow-x: hidden` computes
`overflow-y` to `auto`, and paged.js cannot fragment a scroll container, so
everything past its first page is dropped without warning. This cost ~400 pages
before it was caught. Any new `overflow` rule on a content container in
`curriculum.css` needs a matching override in the `overflow: visible` block of
`book.css`. **After adding one, check the page count did not fall.**

**Undeclared font families bloat the PDF.** A family named in CSS but never
loaded via `@font-face` reaches Chrome as a system font, which it can only embed
as Type 3: vectorised glyphs, one subset per page. `book.css` declares Lexend
for this reason. Check with `pdffonts out/dp-textbook.pdf` — Type 3 entries in
the second column mean something is not loading.

**Chrome will not pass JPEG through** into the PDF when CSS scales an image, so
every image is re-stored as a raw bitmap. This is why images are pre-downscaled;
it is also why the PDF is ~22MB rather than ~8MB. Installing ghostscript and
running a recompression pass would close most of that gap.
