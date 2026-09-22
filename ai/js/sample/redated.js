/* ============================================================
   The re-dated post
   ------------------------------------------------------------
   A mock recipe page inside a fake browser window. Nothing is
   highlighted at first; the reader clicks anything that looks
   wrong. Five clues: the "updated" line with no changelog, the
   nameless byline, a paragraph that says nothing, affiliate
   links, and comments older than the post. Each found clue adds
   a sticker to the window's edge. When all five are found, a
   wipe slider reveals the 2019 version underneath, and the only
   line that differs lights up.

   Data: data/redated.json. The site, the post and the comments
   are invented.
   ============================================================ */

import { markDone } from '../progress.js';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/** Pure: the "found n of total" line. */
export function foundLine(tpl, n, total) {
  return tpl.replace('{n}', String(n)).replace('{total}', String(total));
}

/** Build one copy of the article. `original` drops the update line
 *  (the one thing that differs) and skips the clue attributes. */
function buildArticle(data, { original = false } = {}) {
  const P = data.post;
  const art = el('article', 'rp-article' + (original ? ' rp-article--orig' : ''));
  const clue = (node, id) => { if (!original) node.setAttribute('data-clue', id); return node; };

  art.appendChild(el('h3', 'rp-title', P.title));
  const meta = el('p', 'rp-meta');
  meta.appendChild(clue(el('span', 'rp-byline', P.byline), 'byline'));
  meta.appendChild(document.createTextNode(' · '));
  const dates = el('span', 'rp-dates');
  if (original) {
    dates.appendChild(el('span', 'rp-date rp-date--orig', P.publishedOnly));
  } else {
    dates.append(el('span', 'rp-date', P.updated), document.createTextNode(' · '), el('span', 'rp-date rp-date--muted', P.published));
    clue(dates, 'updated');
  }
  meta.appendChild(dates);
  art.appendChild(meta);

  const fig = el('div', 'rp-figure');
  fig.setAttribute('aria-hidden', 'true');
  fig.appendChild(el('div', 'rp-loaf'));
  art.appendChild(fig);

  art.appendChild(clue(el('p', 'rp-p', P.intro[0]), 'filler'));
  art.appendChild(el('p', 'rp-p', P.intro[1]));

  art.appendChild(el('h4', 'rp-h2', P.gearIntro));
  const gear = el('p', 'rp-p rp-gear');
  P.gear.forEach((g, i) => {
    if (i > 0) gear.appendChild(document.createTextNode(i === P.gear.length - 1 ? ' and ' : ', '));
    const a = el('a', 'rp-link', g.text);
    a.href = g.href;
    a.addEventListener('click', (e) => e.preventDefault());
    gear.appendChild(a);
  });
  gear.appendChild(document.createTextNode('.'));
  art.appendChild(clue(gear, 'gear'));

  art.appendChild(el('h4', 'rp-h2', P.ingredientsTitle));
  const ul = el('ul', 'rp-list');
  for (const i of P.ingredients) ul.appendChild(el('li', null, i));
  art.appendChild(ul);

  art.appendChild(el('h4', 'rp-h2', P.methodTitle));
  const ol = el('ol', 'rp-list');
  for (const m of P.method) ol.appendChild(el('li', null, m));
  art.appendChild(ol);

  art.appendChild(el('h4', 'rp-h2', P.commentsTitle));
  const cs = el('div', 'rp-comments');
  for (const c of P.comments) {
    const box = el('div', 'rp-comment');
    box.append(el('span', 'rp-comment-who', c.who), el('span', 'rp-comment-when', c.when), el('p', 'rp-comment-text', c.text));
    cs.appendChild(box);
  }
  art.appendChild(clue(cs, 'comments'));
  return art;
}

export async function mountRedated(root, { reducedMotion = false, url = './data/redated.json', gsap = window.gsap } = {}) {
  const data = await (await fetch(url)).json();
  const S = data.strings;
  const total = data.clues.length;
  const found = new Set();

  root.classList.add('rp');
  const win = el('div', 'rp-window');
  const chrome = el('div', 'rp-chrome');
  chrome.append(el('span', 'rp-dot'), el('span', 'rp-dot'), el('span', 'rp-dot'), el('span', 'rp-url', data.site.url));
  const stickers = el('div', 'rp-stickers');
  stickers.setAttribute('aria-hidden', 'true');
  const body = el('div', 'rp-body');
  const current = buildArticle(data);
  const original = buildArticle(data, { original: true });
  const origLayer = el('div', 'rp-layer rp-layer--orig');
  origLayer.appendChild(original);
  body.append(current, origLayer);
  const statusBar = el('div', 'rp-statusbar', S.statusIdle);
  win.append(chrome, body, statusBar, stickers);

  const bar = el('div', 'rp-bar tp-scope');
  const status = el('p', 'rp-status', S.intro);
  status.setAttribute('aria-live', 'polite');
  const hint = el('button', 'tp-btn', S.hint);
  hint.type = 'button';
  bar.append(status, hint);

  const wipeWrap = el('div', 'rp-wipe');
  const wipe = document.createElement('input');
  wipe.type = 'range'; wipe.min = '0'; wipe.max = '100'; wipe.value = '0';
  wipe.className = 'rp-wipe-range';
  wipe.setAttribute('aria-label', S.wipeLabel);
  const wipeCaption = el('p', 'rp-wipe-caption', S.wipeCaption);
  wipeWrap.append(wipe, wipeCaption);

  root.append(win, bar, wipeWrap);

  // The two copies must line up exactly for the wipe to read as one page
  // with one line changed. The meta line is the only block that can wrap
  // differently, so give both copies the taller of the two heights.
  const align = () => {
    const a = current.querySelector('.rp-meta'), b = original.querySelector('.rp-meta');
    a.style.minHeight = b.style.minHeight = '0';
    const h = Math.max(a.getBoundingClientRect().height, b.getBoundingClientRect().height);
    a.style.minHeight = b.style.minHeight = h + 'px';
  };
  align();
  window.addEventListener('resize', align);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);

  // the fake status bar shows where a link really goes
  body.addEventListener('mouseover', (e) => {
    const a = e.target.closest && e.target.closest('a.rp-link');
    statusBar.textContent = a ? a.getAttribute('href') : S.statusIdle;
  });
  body.addEventListener('mouseout', () => { statusBar.textContent = S.statusIdle; });

  let toast = null;
  const say = (text, cls) => {
    status.textContent = text;
    status.className = 'rp-status' + (cls ? ' ' + cls : '');
    if (toast) clearTimeout(toast);
  };

  const sticker = (c) => {
    const s = el('span', 'rp-sticker', c.sticker);
    stickers.appendChild(s);
    if (gsap && !reducedMotion) gsap.from(s, { scale: 2, rotation: 8, opacity: 0, duration: 0.35, ease: 'back.out(2)' });
  };

  const reveal = (id) => {
    if (found.has(id)) return;
    found.add(id);
    const c = data.clues.find((x) => x.id === id);
    for (const node of current.querySelectorAll(`[data-clue="${id}"]`)) node.classList.add('is-found');
    sticker(c);
    if (found.size === total) {
      hint.hidden = true;
      say(S.allFound, 'is-all');
      root.classList.add('is-all-found');
      wipeWrap.classList.add('is-shown');
      if (gsap && !reducedMotion) gsap.from(wipeWrap, { y: 10, opacity: 0, duration: 0.4 });
    } else {
      say(foundLine(S.found, found.size, total) + ' ' + c.note);
    }
    root.dispatchEvent(new CustomEvent('rp:found', { bubbles: true, detail: { id, found: found.size } }));
  };

  current.addEventListener('click', (e) => {
    const target = e.target.closest && e.target.closest('[data-clue]');
    if (target) { reveal(target.getAttribute('data-clue')); return; }
    if (found.size < total) {
      say(S.miss, 'is-miss');
      toast = setTimeout(() => say(foundLine(S.found, found.size, total)), 1800);
    }
  });

  hint.addEventListener('click', () => {
    const next = data.clues.find((c) => !found.has(c.id));
    if (!next) return;
    const node = current.querySelector(`[data-clue="${next.id}"]`);
    node.classList.add('is-hinted');
    node.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' });
    setTimeout(() => node.classList.remove('is-hinted'), 2400);
  });

  let wiped = false;
  const setWipe = (v) => {
    body.style.setProperty('--wipe', v + '%');
    const past = v >= 50;
    wipeCaption.classList.toggle('is-shown', past);
    if (past && !wiped) {
      wiped = true;
      say(S.done, 'is-all');
      markDone(root.closest('.screen')?.id || 's6', { found: Array.from(found), stickers: data.clues.filter((c) => found.has(c.id)).map((c) => c.sticker) });
    }
  };
  wipe.addEventListener('input', () => setWipe(Number(wipe.value)));
  setWipe(0);

  return { reveal, setWipe, found };
}
