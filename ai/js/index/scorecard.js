/* ============================================================
   Scorecard: keeps score while two transcripts stream.
   ------------------------------------------------------------
   Listens to the transcript player's events on a compare block.
   Each annotation the stream reaches stamps the matching column
   (INVENTED, CHECK, CONFIRMED) and bumps a counter; each answer
   that carries links bumps the links counter. When both sides
   finish, the card asks one question and records the answer.

   <div data-scorecard data-for="#compare-id"
        data-left-label="2023" data-right-label="2026"></div>
   ============================================================ */

import { markDone, setAnswer } from '../progress.js';

const KINDS = [
  { kind: 'fabricated', label: 'Invented', stamp: 'INVENTED' },
  { kind: 'check', label: 'Worth checking', stamp: 'CHECK' },
  { kind: 'good', label: 'Confirmed', stamp: 'CONFIRMED' },
];

const STRINGS = {
  links: 'Links that open',
  question: 'Before you saw the stamps, which answer would you have trusted more?',
  neither: 'Neither',
  thanks: 'Noted. Now look at the stamps again.',
  summary: (l, r) => `The ${r.label} answers gave ${r.links} links that open and still had ${r.fabricated} invented claim${r.fabricated === 1 ? '' : 's'}. The ${l.label} answers gave ${l.links} and had ${l.fabricated}.`,
};

/** Pure: a fresh tally for one side. */
export function emptyTally(label) {
  return { label, fabricated: 0, check: 0, good: 0, links: 0, hrefs: new Set() };
}

/** Pure: count links in a message element not seen before on this side. */
export function countNewLinks(tally, hrefs) {
  let n = 0;
  for (const h of hrefs) {
    if (tally.hrefs.has(h)) continue;
    tally.hrefs.add(h);
    n += 1;
  }
  tally.links += n;
  return n;
}

function el(doc, tag, cls, text) {
  const e = doc.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export function mountScorecard(root, { gsap = window.gsap, reducedMotion = false } = {}) {
  const doc = root.ownerDocument;
  const compare = doc.querySelector(root.getAttribute('data-for'));
  if (!compare) return null;
  const labels = [root.getAttribute('data-left-label') || 'A', root.getAttribute('data-right-label') || 'B'];
  const tallies = labels.map(emptyTally);
  root.classList.add('scorecard', 'tp-scope');

  const cols = labels.map((label, side) => {
    const col = el(doc, 'div', 'sc-col');
    col.setAttribute('data-side', String(side));
    col.appendChild(el(doc, 'h3', 'sc-title', label));
    const rows = el(doc, 'div', 'sc-rows');
    for (const k of KINDS) {
      const row = el(doc, 'div', 'sc-row sc-row--' + k.kind);
      row.setAttribute('data-kind', k.kind);
      row.append(el(doc, 'span', 'sc-n', '0'), el(doc, 'span', 'sc-label', k.label));
      rows.appendChild(row);
    }
    const linksRow = el(doc, 'div', 'sc-row sc-row--links');
    linksRow.setAttribute('data-kind', 'links');
    linksRow.append(el(doc, 'span', 'sc-n', '0'), el(doc, 'span', 'sc-label', STRINGS.links));
    rows.appendChild(linksRow);
    col.appendChild(rows);
    const stamps = el(doc, 'div', 'sc-stamps');
    stamps.setAttribute('aria-hidden', 'true');
    col.appendChild(stamps);
    return col;
  });
  const grid = el(doc, 'div', 'sc-grid');
  grid.append(...cols);
  root.appendChild(grid);

  const sideOf = (target) => {
    const pane = target.closest && target.closest('[data-side]');
    return pane ? Number(pane.getAttribute('data-side')) : -1;
  };

  const bump = (side, kind) => {
    const row = cols[side].querySelector(`.sc-row[data-kind="${kind}"] .sc-n`);
    row.textContent = String(tallies[side][kind]);
    if (gsap && !reducedMotion) gsap.fromTo(row, { scale: 1.6 }, { scale: 1, duration: 0.45, ease: 'back.out(2)' });
  };

  const stamp = (side, k) => {
    const strip = cols[side].querySelector('.sc-stamps');
    const s = el(doc, 'span', 'sc-stamp sc-stamp--' + k.kind, k.stamp);
    strip.appendChild(s);
    if (gsap && !reducedMotion) {
      gsap.fromTo(s, { scale: 2.6, opacity: 0, rotation: -14 }, { scale: 1, opacity: 1, rotation: -6, duration: 0.32, ease: 'power3.in' })
        .then(() => gsap.fromTo(strip, { x: -3 }, { x: 0, duration: 0.25, ease: 'elastic.out(1, 0.3)' }));
    }
    // keep the strip short: oldest stamps shrink into chips
    const all = strip.querySelectorAll('.sc-stamp');
    if (all.length > 6) all[0].remove();
  };

  compare.addEventListener('tp:annotation', (e) => {
    const side = sideOf(e.target);
    const k = KINDS.find((x) => x.kind === e.detail.annotation.kind);
    if (side < 0 || !k) return;
    tallies[side][k.kind] += 1;
    bump(side, k.kind);
    stamp(side, k);
  });

  compare.addEventListener('tp:messageend', (e) => {
    const side = sideOf(e.target);
    if (side < 0 || e.detail.message.role !== 'assistant') return;
    const hrefs = Array.from(e.detail.el.querySelectorAll('a.tp-link')).map((a) => a.getAttribute('href'));
    if (countNewLinks(tallies[side], hrefs) > 0) bump(side, 'links');
  });

  // A side counts as finished when its stream is done, or when it is
  // waiting on the reader at a choice (the choice is the reader's move,
  // and the question should not wait behind it).
  const settled = [false, false];
  let asked = false;
  const settle = (e) => {
    const side = sideOf(e.target);
    if (side < 0) return;
    settled[side] = true;
    if (!asked && settled.every(Boolean)) { asked = true; ask(); }
  };
  compare.addEventListener('tp:done', settle);
  compare.addEventListener('tp:choice', settle);
  compare.addEventListener('tp:choose', (e) => {
    const side = sideOf(e.target);
    if (side >= 0) setAnswer('branch-' + labels[side], e.detail.option.label);
  });

  const ask = () => {
    const q = el(doc, 'div', 'sc-question');
    q.appendChild(el(doc, 'p', 'sc-q', STRINGS.question));
    const opts = el(doc, 'div', 'sc-options');
    const choices = [...labels, STRINGS.neither];
    for (const c of choices) {
      const b = el(doc, 'button', 'tp-btn tp-btn--option', c);
      b.type = 'button';
      b.addEventListener('click', () => {
        for (const x of opts.querySelectorAll('button')) { x.disabled = true; x.classList.toggle('is-picked', x === b); }
        markDone(root.closest('.screen')?.id || 'scorecard', { trusted: c });
        const done = el(doc, 'p', 'sc-done');
        done.append(STRINGS.thanks + ' ', STRINGS.summary(tallies[0], tallies[1]));
        q.appendChild(done);
        if (gsap && !reducedMotion) gsap.from(done, { y: 8, opacity: 0, duration: 0.4, ease: 'power2.out' });
        root.dispatchEvent(new CustomEvent('sc:answered', { bubbles: true, detail: { trusted: c, tallies } }));
      });
      opts.appendChild(b);
    }
    q.appendChild(opts);
    root.appendChild(q);
    if (gsap && !reducedMotion) gsap.from(q, { y: 12, opacity: 0, duration: 0.5, ease: 'power2.out' });
  };

  return { tallies, cols };
}
