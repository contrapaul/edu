#!/usr/bin/env python3
"""Build an editorial cross-reference page for a remix unit.

Copies course-note content from the live DP topic pages into one page,
with the objectives that would merge laid out side by side. Content is
copied, not rewritten: only paths, popups and empty images are adjusted
so the copy works from curriculum/dp/remix/.

Usage (from anywhere):
    python3 curriculum/dp/remix/build-crossref.py r1

Re-run after editing any source page to refresh the cross-reference.
"""
import html
import re
import sys
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
DP = HERE.parent

SOURCES = {
    'A1.1': {'file': 'a1.1-ergonomics.html', 'title': 'Ergonomics', 'colour': '#2c5f6e'},
    'B1.1': {'file': 'b1.1-user-centred-design.html', 'title': 'User-centred design', 'colour': '#1a5cb8'},
    'C1.2': {'file': 'c1.2-inclusive-design.html', 'title': 'Inclusive design', 'colour': '#3d6b4a'},
}

# Each column is ('obj', topic, number) for a whole objective, or
# ('box', topic, number, heading text) for one concept box inside an objective.
UNITS = {
    'r1': {
        'title': 'R1 Bodies and inclusion',
        'remix_heading': '#### R1 Bodies and inclusion',
        'intros': ['A1.1', 'C1.2'],
        'scripts': ['../../live-calc.js', '../a1.1.js'],
        'rows': [
            {'idea': 'What ergonomics is', 'cols': [('obj', 'A1.1', '1.1.1')]},
            {'idea': 'Measuring bodies, and what changes the data', 'cols': [('obj', 'A1.1', '1.1.2')],
             'note': 'The paragraph on disability under "Factors that change the data" also relates to row 5.'},
            {'idea': 'Percentiles, and why the average fits nobody',
             'cols': [('obj', 'A1.1', '1.1.3'), ('obj', 'A1.1', '1.1.5'), ('obj', 'C1.2', '1.2.2')]},
            {'idea': 'Fitting a range: adjustability and sizes', 'cols': [('obj', 'A1.1', '1.1.4')]},
            {'idea': 'Physical limits and designing for impairment',
             'cols': [('obj', 'A1.1', '1.1.6'), ('obj', 'C1.2', '1.2.1')]},
            {'idea': 'Design for extremes',
             'cols': [('obj', 'C1.2', '1.2.3'), ('box', 'B1.1', '1.1.2', 'The Method of Extremes')]},
        ],
    },
}


def balanced_div(src, start):
    """Return (start, end) of the <div> that opens at src[start]."""
    depth = 0
    for m in re.compile(r'<div\b|</div>').finditer(src, start):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            return start, m.end()
    raise ValueError('unbalanced div at %d' % start)


def inner(block):
    return block[block.index('>') + 1:block.rindex('</div>')]


def fix_paths(fragment, source_file):
    """Point relative URLs one level up, and in-page anchors back at the source page."""
    def repl(m):
        attr, quote, url = m.group(1), m.group(2), m.group(3)
        if url.startswith('#'):
            url = '../' + source_file + url
        elif url and not re.match(r'^(?:[a-z]+:|/|data:)', url):
            url = '../' + url
        return '%s=%s%s%s' % (attr, quote, url, quote)
    return re.sub(r'\b(src|href|poster)=(["\'])(.*?)\2', repl, fragment)


def show_empty_images(fragment):
    def repl(m):
        alt = re.search(r'\balt="([^"]*)"', m.group(0))
        text = alt.group(1) if alt and alt.group(1) else 'no alt text'
        return '<span class="img-placeholder">Image to come: %s</span>' % text
    return re.sub(r'<img\b[^>]*\bsrc=""[^>]*>', repl, fragment)


def inline_popups(fragment, page):
    """After each card grid, add the full text of the popups its cards open."""
    out, pos = [], 0
    for m in re.finditer(r'<div class="case-study-grid[^"]*">', fragment):
        if m.start() < pos:
            continue
        s, e = balanced_div(fragment, m.start())
        grid = fragment[s:e]
        extra = []
        for mid in re.findall(r'data-modal="([^"]+)"', grid):
            ms = page.index('<div class="case-modal" id="%s"' % mid)
            modal = page[ms:balanced_div(page, ms)[1]]
            title = re.sub(r'<[^>]+>', '', re.search(r'<h2[^>]*>(.*?)</h2>', modal, re.S).group(1)).strip()
            bs = modal.index('<div class="case-modal-body">')
            body = inner(modal[bs:balanced_div(modal, bs)[1]])
            extra.append('<div class="popup-inline"><div class="popup-label">Popup content</div>'
                         '<h4>%s</h4>%s</div>' % (html.escape(title, quote=False), body))
        out.append(fragment[pos:e] + ''.join(extra))
        pos = e
    out.append(fragment[pos:])
    return ''.join(out)


def objective(page, topic, num):
    s = page.index('<div class="obj-section" id="obj-%s">' % num)
    section = page[s:balanced_div(page, s)[1]]
    h3 = re.search(r'<h3>(.*?)</h3>', section, re.S).group(1)
    outcome = re.search(r'<p class="obj-outcome"><span class="obj-outcome-label">(.*?)</span>(.*?)</p>', section, re.S)
    bs = section.index('<div class="obj-body"')
    body = inner(section[bs:balanced_div(section, bs)[1]])
    body = body.replace(outcome.group(0), '', 1)
    return h3, outcome.group(1), outcome.group(2), body


def concept_box(page, num, heading):
    _, _, _, body = objective(page, None, num)
    i = body.index(heading)
    s = body.rindex('<div class="concept-box"', 0, i)
    return body[s:balanced_div(body, s)[1]]


def course_intro(page):
    s = page.index('<div class="curr-body" id="body-course-notes">')
    body = page[s:balanced_div(page, s)[1]]
    body = body[body.index('>') + 1:]
    return body[:body.index('<div class="obj-list">')]


def prep(fragment, topic, page):
    f = SOURCES[topic]['file']
    return show_empty_images(fix_paths(inline_popups(fragment, page), f))


def remix_focus(heading):
    """Convert the unit's table and paragraphs in remix.md to simple HTML."""
    md = (DP / 'remix.md').read_text()
    s = md.index(heading)
    e = md.find('\n#### ', s + len(heading))
    block = md[s + len(heading):e if e > 0 else None].strip()

    def inl(t):
        t = html.escape(t, quote=False)
        t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
        return re.sub(r'`(.+?)`', r'<code>\1</code>', t)
    rows, paras = [], []
    for line in block.splitlines():
        line = line.strip()
        if line.startswith('|'):
            cells = [c.strip() for c in line.strip('|').split('|')]
            if cells[0] and not set(cells[0]) <= set('- '):
                rows.append('<tr><th>%s</th><td>%s</td></tr>' % (inl(cells[0]), inl(cells[1])))
        elif line:
            paras.append('<p>%s</p>' % inl(line))
    return '<table class="focus-table">%s</table>%s' % (''.join(rows), ''.join(paras))


CSS = """
:root { --gap: 1.5rem; }
body { background: var(--bg, #fff); color: var(--text, #1a1a1a); margin: 0; }
.xref { padding: 1.5rem 16px 4rem; max-width: none; }
.xref-head h1 { margin: 0 0 0.25rem; }
.xref-meta { color: var(--muted, #666); font-size: 0.85rem; margin: 0 0 1rem; }
.toolbar { position: sticky; top: 0; z-index: 10; background: var(--bg, #fff); border-bottom: 1px solid #ccc;
  padding: 0.6rem 0; display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
.toolbar button { font: inherit; padding: 0.4rem 0.9rem; cursor: pointer; }
.toolbar a { font-size: 0.85rem; }
.copy-status { font-size: 0.85rem; color: var(--muted, #666); }
.focus-table { border-collapse: collapse; margin: 0.5rem 0 1rem; max-width: 70rem; }
.focus-table th, .focus-table td { text-align: left; vertical-align: top; border: 1px solid #ccc; padding: 0.5rem 0.75rem; }
.focus-table th { white-space: nowrap; }
.key { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.85rem; }
.key span, .src-tag { display: inline-block; padding: 0.1rem 0.5rem; border-radius: 3px; color: #fff; font-weight: 600; }
.xrow { border-top: 3px solid #333; margin-top: 3rem; padding-top: 1rem; }
.xrow > h2 { margin: 0 0 0.25rem; }
.row-note { background: #fff6d6; border: 1px solid #e0c96b; padding: 0.4rem 0.75rem; font-size: 0.85rem; margin: 0.5rem 0 1rem; }
.cols { display: grid; gap: var(--gap); grid-template-columns: repeat(var(--n), minmax(0, 1fr)); }
@media (max-width: 900px) { .cols { grid-template-columns: 1fr; } }
.col { border-top: 6px solid var(--c); padding-top: 0.75rem; min-width: 0; }
.col-head { margin-bottom: 1rem; }
.col-head h3 { margin: 0.4rem 0; font-size: 1.05rem; }
.col-head .outcome { font-size: 0.85rem; background: #f3f3f3; padding: 0.4rem 0.6rem; margin: 0.4rem 0; }
.col-head .outcome b { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; }
.col-head .src-link { font-size: 0.8rem; }
.col img, .col video { max-width: 100%; height: auto; }
.col .content-table-wrap, .col table { max-width: 100%; overflow-x: auto; }
.popup-inline { border: 2px dashed #999; padding: 0.75rem; margin: 1rem 0; }
.popup-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #666; }
.img-placeholder { display: block; border: 2px dashed #bbb; padding: 1.25rem 0.75rem; color: #666; font-size: 0.85rem; text-align: center; margin: 0.5rem 0; }
.notes { margin-top: 1.5rem; }
.notes label { font-weight: 700; display: block; margin-bottom: 0.3rem; }
.notes textarea { width: 100%; min-height: 8rem; font: inherit; padding: 0.5rem; box-sizing: border-box; }
"""

JS = """
(function () {
  var KEY = 'remix-notes-%(unit)s';
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.notes textarea'));
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { saved = {}; }
  boxes.forEach(function (b) {
    if (saved[b.id]) b.value = saved[b.id];
    b.addEventListener('input', function () {
      saved[b.id] = b.value;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    });
  });
  var status = document.querySelector('.copy-status');
  document.getElementById('copy-notes').addEventListener('click', function () {
    var lines = ['# %(title)s: editorial notes', ''];
    boxes.forEach(function (b) {
      lines.push('## ' + b.getAttribute('data-heading'), '');
      lines.push(b.value.trim() || '(no notes)', '');
    });
    var text = lines.join('\\n');
    function done(msg) { status.textContent = msg; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done('Notes copied as Markdown.'); },
        function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done('Notes copied as Markdown.'); } catch (e) { done('Copy failed: select the text manually.'); }
      document.body.removeChild(t);
    }
  });
})();
"""


def notes_box(nid, heading):
    return ('<div class="notes"><label for="%s">Notes: %s</label>'
            '<textarea id="%s" data-heading="%s" placeholder="What to merge, keep or cut"></textarea></div>'
            % (nid, html.escape(heading), nid, html.escape(heading)))


def src_tag(topic):
    return '<span class="src-tag" style="background:%s">%s</span>' % (SOURCES[topic]['colour'], topic)


def build(unit_key):
    u = UNITS[unit_key]
    pages = {t: (DP / s['file']).read_text() for t, s in SOURCES.items()}
    parts = []

    used = []
    for row in u['rows']:
        for c in row['cols']:
            used.append(c[1])
    key = ' '.join('%s %s' % (src_tag(t), html.escape(SOURCES[t]['title'])) for t in SOURCES if t in used)

    parts.append('<header class="xref-head"><h1>%s: cross-reference</h1>'
                 '<p class="xref-meta">Editorial worksheet, built %s from the live topic pages by '
                 '<code>remix/build-crossref.py</code>. Copy is unchanged from the source pages.</p></header>'
                 % (html.escape(u['title']), date.today().isoformat()))
    parts.append('<div class="toolbar"><button id="copy-notes" type="button">Copy all notes as Markdown</button>'
                 '<span class="copy-status" aria-live="polite"></span>'
                 '<a href="#focus">Focus</a><a href="#intros">Introductions</a>%s</div>'
                 % ''.join('<a href="#row-%d">Row %d</a>' % (i + 1, i + 1) for i in range(len(u['rows']))))

    parts.append('<section id="focus"><h2>Unit focus (from remix.md)</h2>%s<div class="key">%s</div>%s</section>'
                 % (remix_focus(u['remix_heading']), key, notes_box('notes-focus', 'Unit focus')))

    cols = []
    for t in u['intros']:
        cols.append('<div class="col" style="--c:%s"><div class="col-head">%s <strong>Course notes introduction</strong> '
                    '<a class="src-link" href="../%s#course-notes">source</a></div>%s</div>'
                    % (SOURCES[t]['colour'], src_tag(t), SOURCES[t]['file'], prep(course_intro(pages[t]), t, pages[t])))
    parts.append('<section class="xrow" id="intros"><h2>Course notes introductions</h2>'
                 '<div class="cols" style="--n:%d">%s</div>%s</section>'
                 % (len(cols), ''.join(cols), notes_box('notes-intros', 'Course notes introductions')))

    for i, row in enumerate(u['rows'], 1):
        cols = []
        codes = []
        for c in row['cols']:
            kind, topic, num = c[0], c[1], c[2]
            page = pages[topic]
            f = SOURCES[topic]['file']
            h3, label, outcome, body = objective(page, topic, num)
            code = topic[0] + num
            if kind == 'box':
                content = concept_box(page, num, c[3])
                title = '%s, concept box only: %s' % (code, c[3])
                codes.append('%s (%s box)' % (code, c[3]))
            else:
                content = body
                title = code
                codes.append(code)
            cols.append('<div class="col" style="--c:%s"><div class="col-head">%s <strong>%s</strong> '
                        '<a class="src-link" href="../%s#obj-%s">source</a><h3>%s</h3>'
                        '<p class="outcome"><b>%s</b>%s</p></div>%s</div>'
                        % (SOURCES[topic]['colour'], src_tag(topic), html.escape(title), f, num, h3, label, outcome,
                           prep(content, topic, page)))
        heading = 'Row %d: %s (%s)' % (i, row['idea'], ', '.join(codes))
        note = '<p class="row-note">%s</p>' % html.escape(row['note']) if row.get('note') else ''
        parts.append('<section class="xrow" id="row-%d"><h2>%s</h2>%s<div class="cols" style="--n:%d">%s</div>%s</section>'
                     % (i, html.escape(heading), note, len(cols), ''.join(cols), notes_box('notes-row-%d' % i, heading)))

    scripts = ''.join('<script src="%s"></script>' % s for s in u['scripts'])
    doc = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>%(title)s cross-reference</title>
<link rel="stylesheet" href="../../../style.css">
<link rel="stylesheet" href="../../curriculum.css">
<style>%(css)s</style>
</head>
<body>
<main class="xref">
%(body)s
</main>
%(scripts)s
<script>%(js)s</script>
</body>
</html>
""" % {'title': html.escape(u['title']), 'css': CSS, 'body': '\n'.join(parts), 'scripts': scripts,
       'js': JS % {'unit': unit_key, 'title': u['title']}}
    out = HERE / ('%s-crossref.html' % unit_key)
    out.write_text(doc)
    print('wrote', out.relative_to(DP.parent.parent))


if __name__ == '__main__':
    build(sys.argv[1] if len(sys.argv) > 1 else 'r1')
