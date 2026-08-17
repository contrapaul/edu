/* build.js — assemble the DP curriculum pages into print-ready HTML.

   Produces two documents from one extraction pass:
     student  → the book a student reads, with no answers anywhere
     answers  → the answer key / teacher support materials

   Everything is generated from the live pages, so a rebuild after editing a
   topic always produces correct documents. Book-specific decisions live in
   config.js as rules, never as edits to the output. */

'use strict';

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const config = require('./config');
const { readActivities } = require('./activities');

const DP = path.resolve(__dirname, '../../curriculum/dp');
const OUT = path.resolve(__dirname, 'out');
const SITE = 'https://edu.contrapaul.com';

const stats = {
  chapters: 0, figuresDropped: 0, widgets: 0, links: 0, images: 0,
  rewrites: 0, cases: 0, activities: 0, activityItems: 0, media: 0,
};
const warnings = [];

/* ── chapter order comes from the DP landing page, so adding a topic to the
      site adds it to both documents with no change here ───────────────── */
function chapterFiles() {
  const $ = cheerio.load(fs.readFileSync(path.join(DP, 'index.html'), 'utf8'));
  const seen = new Set();
  const files = [];
  $('a[href$=".html"]').each((_, a) => {
    const href = $(a).attr('href');
    if (href.startsWith('http') || href.includes('/') || href === 'index.html') return;
    if (seen.has(href) || config.exclude.includes(href)) return;
    seen.add(href);
    files.push(href);
  });
  return files;
}

/* Slug used for in-document anchors: a1.1-ergonomics.html -> ch-a1-1 */
function chapterId(file) {
  return 'ch-' + file.replace(/\.html$/, '').split('-')[0].replace(/\./g, '-');
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ── paper matching activity ─────────────────────────────────────────────
   Students draw lines between the two columns; the answer key carries the
   pairings and the authored explanations. */
function renderActivity(act, title, intro, url, showAnswers) {
  const zoneLabel = Object.fromEntries(act.zones.map((z) => [z.id, z.label]));

  if (!showAnswers) {
    const items = act.items.map((it, n) =>
      `<li class="bk-match-item"><span class="bk-match-n">${n + 1}</span>${esc(it.label)}</li>`).join('');
    const zones = act.zones.map((z, n) =>
      `<li class="bk-match-zone"><span class="bk-match-l">${String.fromCharCode(65 + n)}</span>${esc(z.label)}</li>`).join('');
    return `<aside class="bk-activity">
      <div class="bk-activity-label">Activity · match the pairs</div>
      ${title ? `<div class="bk-activity-title">${esc(title)}</div>` : ''}
      ${intro ? `<p class="bk-activity-intro">${esc(intro)}</p>` : ''}
      <p class="bk-activity-how">Draw a line from each item on the left to its category on the right.</p>
      <div class="bk-match">
        <ol class="bk-match-col">${items}</ol>
        <ol class="bk-match-col bk-match-col-b">${zones}</ol>
      </div>
      <p class="bk-activity-note">Answers in the answer key. Interactive version at
        <span class="bk-url">${url}</span></p>
    </aside>`;
  }

  const rows = act.items.map((it, n) => `
    <tr>
      <td class="bk-ak-n">${n + 1}</td>
      <td>${esc(it.label)}</td>
      <td class="bk-ak-correct">${esc(zoneLabel[it.correctZone] || it.correctZone)}</td>
      <td class="bk-ak-why">${esc(it.explanation)}</td>
    </tr>`).join('');
  return `<div class="bk-ak-activity">
    <div class="bk-ak-title">${esc(title || 'Matching activity')}</div>
    <table class="bk-ak-table">
      <thead><tr><th></th><th>Item</th><th>Correct category</th><th>Why</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function extractChapter(file, index, variant) {
  const raw = fs.readFileSync(path.join(DP, file), 'utf8');
  const $ = cheerio.load(raw);
  const id = chapterId(file);
  const showAnswers = variant.showAnswers;

  const code = ($('.topic-breadcrumb').text().trim().split('/').pop() || '').trim();
  const title = $('.topic-title').text().trim().replace(/\s*\|.*$/, '');
  const guiding = $('.topic-guiding-q').clone().children('.gq-label').remove().end().text().trim();
  const colourMatch = ($('.topic-hero').attr('style') || '').match(/--topic-color:\s*([^;]+)/);
  const colour = colourMatch ? colourMatch[1].trim() : '#444';

  const main = $('.curr-main');
  if (!main.length) throw new Error(`no .curr-main in ${file}`);

  const url = `edu.contrapaul.com/curriculum/dp/${file}`;
  const activities = readActivities(path.join(DP, file.split('-')[0] + '.js'));
  if (activities.__error) warnings.push(activities.__error);

  /* Case studies live outside .curr-main and are hidden behind a modal, so
     they never reached the book. Fold each one inline after its card. */
  $('.case-study-card[data-modal]').each((_, card) => {
    const $card = $(card);
    const modal = $(`#${$card.attr('data-modal')}`);
    if (!modal.length) return;
    const heading = modal.find('.case-modal-header h2').first().text().trim();
    const bodyHtml = modal.find('.case-modal-body').first().html();
    if (!bodyHtml) return;
    stats.cases++;
    $card.after(`<div class="bk-case">
      <div class="bk-case-label">Case study</div>
      ${heading ? `<h4 class="bk-case-title">${esc(heading)}</h4>` : ''}
      <div class="bk-case-body">${bodyHtml}</div>
    </div>`);
  });

  /* On-page nav, site chrome and screen-only controls have no place in print. */
  main.find('.curr-toc, .topic-page-nav').remove();
  config.stripSelectors.forEach((sel) => main.find(sel).remove());

  /* Prose written for a clicking reader. */
  config.textRewrites.forEach(({ selector, find, replace }) => {
    const text = typeof replace === 'string' ? replace : replace[variant.name];
    if (text === undefined) return;
    main.find(selector).each((_, el) => {
      const $el = $(el);
      if ($el.html() && $el.html().includes(find)) {
        $el.html($el.html().split(find).join(text));
        stats.rewrites++;
      }
    });
  });

  /* Collapsibles: unwrap the trigger buttons, keep the headings they hold. */
  main.find('.curr-trigger, .obj-trigger').each((_, el) => {
    const $el = $(el);
    $el.find('.curr-chevron, .obj-chevron').remove();
    $el.replaceWith(`<div class="bk-head">${$el.find('.curr-trigger-left, .obj-trigger-left').html() || ''}</div>`);
  });
  main.find('.curr-body, .obj-body').addClass('bk-open');
  main.find('details').attr('open', 'open');

  /* Quiz. The student book shows the questions only; the key shows the
     correct option and the explanation. */
  main.find('.quiz-q').each((_, el) => {
    const $q = $(el);
    const answer = $q.attr('data-answer');
    $q.find('.quiz-option').each((__, opt) => {
      const $opt = $(opt);
      const correct = $opt.attr('data-opt') === answer;
      $opt.replaceWith(
        `<li class="bk-opt${correct && showAnswers ? ' bk-opt-correct' : ''}">${$opt.html()}</li>`);
    });
    $q.find('.quiz-options').each((__, o) => {
      $(o).replaceWith(`<ul class="bk-opts">${$(o).html()}</ul>`);
    });
    if (showAnswers) {
      $q.find('.quiz-answer').prepend(
        `<span class="bk-ans-label">Answer ${esc(answer || '')}</span> `);
    } else {
      $q.find('.quiz-answer').remove();
    }
  });

  /* Paper 2 model answers belong only in the key. */
  if (!showAnswers) {
    main.find('.p2-answer').remove();
    main.find('.p2-reveal').remove();
  }

  /* Widgets. Matching activities become paper tasks; the genuinely
     screen-dependent ones become a compact pointer. */
  config.widgetSelectors.forEach((sel) => {
    main.find(sel).each((_, el) => {
      const $w = $(el);
      const wid = $w.attr('id');
      const wTitle = $w.find('.drag-sort-title, .live-calc-title, .diagram-title').first().text().trim();
      const wIntro = $w.find('.drag-sort-intro, .live-calc-intro, .diagram-intro').first().text().trim();
      const act = wid && activities[wid];

      if (act && act.items && act.items.length) {
        stats.activities++;
        stats.activityItems += act.items.length;
        $w.replaceWith(renderActivity(act, wTitle, wIntro, url, showAnswers));
        return;
      }
      stats.widgets++;
      $w.replaceWith(
        `<p class="bk-online">${wTitle ? `<strong>${esc(wTitle)}</strong> ` : ''}` +
        `Interactive tool, online only: <span class="bk-url">${url}</span></p>`);
    });
  });

  /* Time-based media has no paper equivalent: a <video> prints as a black
     rectangle and an <audio> as dead controls. Replace with a pointer. */
  main.find('video, audio, iframe').each((_, el) => {
    const $el = $(el);
    const kind = el.tagName.toLowerCase();
    const label = kind === 'audio' ? 'Audio' : kind === 'video' ? 'Video' : 'Embedded media';
    const $fig = $el.closest('figure');
    const caption = $fig.find('figcaption').first().text().trim();
    stats.media++;
    ($fig.length ? $fig : $el).replaceWith(
      `<p class="bk-online">${label}, online only${caption ? `: ${esc(caption)}` : ''} ` +
      `<span class="bk-url">${url}</span></p>`);
  });

  /* Drop the unfilled figure placeholders; they render as empty boxes. */
  main.find('img').each((_, img) => {
    const $img = $(img);
    const src = $img.attr('src');
    if (!src) {
      const $fig = $img.closest('figure');
      ($fig.length ? $fig : $img).remove();
      stats.figuresDropped++;
      return;
    }
    $img.attr('src', path.join(DP, src));
    $img.removeAttr('loading').removeAttr('decoding');
    stats.images++;
  });

  /* Links: cross-chapter ones jump inside the document, external ones stay
     clickable. Deep links keep their fragment so they land on the section. */
  main.find('a[href]').each((_, a) => {
    const $a = $(a);
    const href = $a.attr('href');
    stats.links++;
    if (href.startsWith('#')) {
      $a.attr('href', `#${id}${href}`);
    } else if (/^[a-z0-9.]+-[a-z0-9-]+\.html/.test(href)) {
      const [target, frag] = href.split('#');
      $a.attr('href', `#${chapterId(target)}${frag ? '-' + frag : ''}`).addClass('bk-xref');
    } else if (href.startsWith('/')) {
      $a.attr('href', SITE + href).addClass('bk-ext');
    } else if (href.startsWith('http')) {
      $a.addClass('bk-ext');
    }
  });

  /* Namespace every id so anchors stay unique once chapters are merged. */
  main.find('[id]').each((_, el) => {
    $(el).attr('id', `${id}-${$(el).attr('id')}`);
  });

  /* The answer key keeps only the assessment sections. */
  if (variant.assessmentOnly) {
    const keep = main.find('.curr-section').filter((_, s) => {
      const secId = ($(s).attr('id') || '').replace(`${id}-`, '');
      return config.assessmentSections.includes(secId);
    });
    const held = keep.map((_, s) => $.html(s)).get().join('\n');
    const acts = main.find('.bk-ak-activity').map((_, s) => $.html(s)).get().join('\n');
    main.empty().append(acts + held);
  }

  stats.chapters++;
  return { id, code, title, guiding, colour, file, number: index + 1, html: main.html() };
}

function render(chapters, variant) {
  const fontDir = path.resolve(__dirname, '../..', config.fontDir);
  const css = fs.readFileSync(path.join(__dirname, 'book.css'), 'utf8')
    .split('BOOK_FONT_DIR').join(fontDir);

  /* Inlining the site CSS breaks its relative url() references, which silently
     drops the self-hosted fonts. Chrome then falls back to the macOS system
     font, which it can only embed as Type 3 and the PDF balloons. */
  const siteCss = config.siteStylesheets
    .map((f) => {
      const dir = path.dirname(path.resolve(__dirname, '../..', f));
      return fs.readFileSync(path.resolve(__dirname, '../..', f), 'utf8')
        .replace(/url\((['"]?)(?!data:|https?:|\/)([^)'"]+)\1\)/g,
                 (_, q, rel) => `url("${path.resolve(dir, rel)}")`);
    })
    .join('\n');

  const toc = chapters.map((c) => `
    <li class="bk-toc-item">
      <a href="#${c.id}">
        <span class="bk-toc-code" style="--c:${c.colour}">${c.code.split(' ')[0]}</span>
        <span class="bk-toc-title">${esc(c.title)}</span>
      </a>
    </li>`).join('');

  const body = chapters.map((c) => `
    <section class="bk-chapter" id="${c.id}" style="--topic-color:${c.colour}">
      <header class="bk-chapter-head">
        <div class="bk-chapter-code">${c.code.split(' ')[0]}</div>
        <h1 class="bk-chapter-title">${esc(c.title)}</h1>
        ${c.guiding && !variant.assessmentOnly
          ? `<p class="bk-chapter-gq"><span>Guiding question</span>${esc(c.guiding)}</p>` : ''}
      </header>
      ${c.html}
    </section>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(variant.title)}</title>
<style>${siteCss}</style>
<style>${css}</style>
</head>
<body class="bk-body bk-${variant.name}">

<section class="bk-cover">
  <div class="bk-cover-kicker">${esc(config.kicker)}</div>
  <h1 class="bk-cover-title">${esc(variant.title)}</h1>
  <p class="bk-cover-sub">${esc(variant.subtitle)}</p>
  <div class="bk-cover-meta">
    <div>${esc(config.author)}</div>
    <div>${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</div>
  </div>
</section>

<section class="bk-toc">
  <h1 class="bk-toc-heading">Contents</h1>
  <ol class="bk-toc-list">${toc}</ol>
</section>

${body}
</body>
</html>`;
}

function main() {
  const files = chapterFiles();
  fs.mkdirSync(OUT, { recursive: true });
  console.log(`Chapters: ${files.length}\n`);

  config.variants.forEach((variant) => {
    Object.keys(stats).forEach((k) => { stats[k] = 0; });
    const chapters = files.map((f, i) => extractChapter(f, i, variant));
    fs.writeFileSync(path.join(OUT, `book-${variant.name}.html`), render(chapters, variant));
    console.log(`${variant.name}:`);
    console.log(`  ${stats.chapters} chapters, ${stats.images} images, ${stats.links} links`);
    console.log(`  ${stats.cases} case studies expanded, ${stats.activities} activities ` +
                `(${stats.activityItems} items), ${stats.widgets + stats.media} online-only pointers`);
    console.log(`  ${stats.figuresDropped} empty figures dropped, ${stats.rewrites} text rewrites`);
    console.log(`  -> out/book-${variant.name}.html\n`);
  });

  [...new Set(warnings)].forEach((w) => console.warn(`  WARNING ${w}`));
}

main();
