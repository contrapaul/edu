/* ============================================================
   Scenario cards: the card sort
   ------------------------------------------------------------
   Fifteen short situations, student and teacher mixed. The
   reader drags each card onto a line from "clearly fine" to
   "clearly cheating", or taps a card and then taps the line, or
   picks one of three buttons. A placed card can be tapped to see
   what makes it arguable, and dragged again. Placements are
   remembered on this device.

   Teacher mode adds a class run: one card at a time, three
   columns for hands up, tap a column per hand, a live bar, and a
   results board at the end. No backend; the teacher counts.

   Data: data/scenarios.json.
   ============================================================ */

import { load, markDone, setAnswer } from '../progress.js';

const KEY_CLASS = 'ai-line-class';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

/** Pure: clamp a position to the line. */
export function clampPos(x) { return Math.max(0, Math.min(1, Number(x) || 0)); }

/** Pure: which zone a position falls in. */
export function zoneOf(x) { return x < 1 / 3 ? 'fine' : x < 2 / 3 ? 'depends' : 'cheating'; }

/** Pure: lay placed cards out so they don't overlap: cards within
 *  `minGap` of each other on the line stack upward. Returns
 *  {id: {x, row}}. */
export function layout(placements, minGap = 0.16) {
  const items = Object.entries(placements).map(([id, x]) => ({ id, x: clampPos(x) })).sort((a, b) => a.x - b.x);
  const rows = [];   // last x used in each row
  const out = {};
  for (const it of items) {
    let row = 0;
    while (rows[row] != null && it.x - rows[row] < minGap) row += 1;
    rows[row] = it.x;
    out[it.id] = { x: it.x, row };
  }
  return out;
}

export async function mountCards(root, { url = './data/scenarios.json', gsap = window.gsap, reducedMotion = false } = {}) {
  const data = await (await fetch(url)).json();
  const S = data.strings;
  const total = data.cards.length;
  const screenId = root.closest('section')?.id || 'line-cards';

  root.classList.add('cs', 'tp-scope');
  const status = el('p', 'cs-status', S.intro);
  status.setAttribute('aria-live', 'polite');
  const tray = el('div', 'cs-tray');
  const lineWrap = el('div', 'cs-line-wrap');
  const line = el('div', 'cs-line');
  line.setAttribute('role', 'group');
  line.setAttribute("aria-label", `${data.scale.left} to ${data.scale.right}`);
  const labels = el('div', 'cs-scale');
  labels.append(el('span', 'cs-scale-l', data.scale.left), el('span', 'cs-scale-m', data.scale.mid), el('span', 'cs-scale-r', data.scale.right));
  const field = el('div', 'cs-field');
  line.append(field);
  lineWrap.append(line, labels);
  const picker = el('div', 'cs-picker');
  picker.hidden = true;
  const consider = el('div', 'cs-consider');
  consider.hidden = true;
  const foot = el('div', 'cs-foot');
  const reset = el('button', 'tp-btn', S.reset); reset.type = 'button';
  const compare = el('button', 'tp-btn', S.compare); compare.type = 'button';
  const run = el('button', 'tp-btn tp-btn--play cs-run', S.run); run.type = 'button';
  foot.append(reset, compare, run);
  root.append(status, tray, lineWrap, picker, consider, foot);

  /* ----- state ----- */
  const saved = load().answers[screenId]?.placements || {};
  const placements = { ...saved };
  let armed = null;
  const cardEls = new Map();

  const save = () => {
    const n = Object.keys(placements).length;
    setAnswer(screenId, { placements });
    if (n === total) markDone(screenId, { placements });
  };

  const buildCard = (c) => {
    const card = el('button', 'cs-card cs-card--' + c.who);
    card.type = 'button';
    card.setAttribute('data-id', c.id);
    card.append(el('span', 'cs-who', S.who[c.who]), el('span', 'cs-text', c.text));
    cardEls.set(c.id, card);
    return card;
  };
  for (const c of data.cards) tray.appendChild(buildCard(c));

  const say = (text) => { status.textContent = text; };
  const countLeft = () => total - Object.keys(placements).length;

  const render = () => {
    const lay = layout(placements);
    for (const c of data.cards) {
      const card = cardEls.get(c.id);
      const p = lay[c.id];
      if (p) {
        if (card.parentElement !== field) field.appendChild(card);
        card.classList.add('is-placed');
        card.classList.remove('is-armed');
        card.style.setProperty('--x', (p.x * 100) + '%');
        card.style.setProperty('--row', String(p.row));
        card.setAttribute('data-zone', zoneOf(p.x));
      } else {
        if (card.parentElement !== tray) tray.appendChild(card);
        card.classList.remove('is-placed');
        card.style.removeProperty('--x'); card.style.removeProperty('--row');
        card.removeAttribute('data-zone');
      }
    }
    // the field grows with its tallest stack
    const maxRow = Math.max(-1, ...Object.values(lay).map((p) => p.row));
    const rowH = window.innerWidth <= 600 ? 52 : 58;
    field.style.minHeight = Math.max(250, 40 + (maxRow + 1) * rowH + 30) + 'px';
    const left = countLeft();
    root.classList.toggle('is-complete', left === 0);
    if (!armed) say(left === 0 ? S.placedAll : fill(S.left, { n: left }));
  };

  const place = (id, x) => {
    placements[id] = clampPos(x);
    armed = null;
    picker.hidden = true;
    save();
    render();
    const card = cardEls.get(id);
    if (gsap && !reducedMotion) gsap.from(card, { scale: 1.15, duration: 0.35, ease: 'back.out(2)' });
    root.dispatchEvent(new CustomEvent('cs:place', { bubbles: true, detail: { id, x: placements[id] } }));
  };

  const arm = (id) => {
    armed = id;
    for (const [k, c] of cardEls) c.classList.toggle('is-armed', k === id);
    picker.innerHTML = '';
    picker.appendChild(el('span', 'cs-picker-label', S.armed));
    // the quick buttons fan cards out across their zone rather than piling them on one spot
    for (const [label, zone, lo, hi] of [[S.fine, 'fine', 0.06, 0.28], [S.depends, 'depends', 0.39, 0.61], [S.cheating, 'cheating', 0.72, 0.94]]) {
      const b = el('button', 'tp-btn', label); b.type = 'button';
      b.addEventListener('click', () => {
        const n = Object.entries(placements).filter(([k, x]) => k !== id && zoneOf(x) === zone).length;
        const steps = 4;
        place(id, lo + ((n % steps) / (steps - 1)) * (hi - lo));
      });
      picker.appendChild(b);
    }
    picker.hidden = false;
    consider.hidden = true;
    say(S.armed);
  };

  const showConsider = (id) => {
    const c = data.cards.find((x) => x.id === id);
    consider.innerHTML = '';
    consider.append(el('p', 'cs-consider-text', c.text), el('p', 'cs-consider-note', c.consider));
    consider.hidden = false;
    for (const [k, card] of cardEls) card.classList.toggle('is-open', k === id);
  };

  /* ----- pointer: drag from tray or field onto the line; a tap arms ----- */
  const lineX = (clientX) => {
    const r = field.getBoundingClientRect();
    return clampPos((clientX - r.left) / r.width);
  };
  for (const [id, card] of cardEls) {
    let drag = null;
    card.addEventListener('pointerdown', (e) => {
      drag = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
      card.setPointerCapture(e.pointerId);
    });
    card.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 5) { drag.moved = true; card.classList.add('is-dragging'); }
      if (drag.moved) {
        // a placed card is centred with translateX(-50%); keep that while it moves
        const base = placements[id] != null ? `calc(-50% + ${dx}px)` : `${dx}px`;
        card.style.transform = `translate(${base}, ${dy}px) rotate(${dx / 60}deg)`;
        const r = field.getBoundingClientRect();
        field.classList.toggle('is-over', e.clientY > r.top - 30 && e.clientY < r.bottom + 30);
      }
    });
    const end = (e) => {
      if (!drag) return;
      const wasDrag = drag.moved;
      drag = null;
      card.classList.remove('is-dragging');
      card.style.transform = '';
      field.classList.remove('is-over');
      if (wasDrag) {
        const r = field.getBoundingClientRect();
        if (e.clientY > r.top - 40 && e.clientY < r.bottom + 40) place(id, lineX(e.clientX));
        else render();
      } else if (placements[id] != null) {
        showConsider(id);
      } else {
        arm(id);
      }
    };
    card.addEventListener('pointerup', end);
    card.addEventListener('pointercancel', end);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); placements[id] != null ? showConsider(id) : arm(id); }
      if (placements[id] != null && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        place(id, placements[id] + (e.key === 'ArrowLeft' ? -0.05 : 0.05));
      }
    });
  }
  field.addEventListener('click', (e) => {
    if (!armed) return;
    if (e.target.closest('.cs-card')) return;
    place(armed, lineX(e.clientX));
  });

  reset.addEventListener('click', () => {
    for (const k of Object.keys(placements)) delete placements[k];
    armed = null; picker.hidden = true; consider.hidden = true;
    setAnswer(screenId, { placements: {} });
    render();
  });
  compare.addEventListener('click', () => say(S.compareSoon));

  /* ----- teacher mode: run it with the class ----- */
  const readClass = () => { try { return JSON.parse(localStorage.getItem(KEY_CLASS)) || {}; } catch { return {}; } };
  const writeClass = (v) => { try { localStorage.setItem(KEY_CLASS, JSON.stringify(v)); } catch { /* private mode */ } };

  const stage = el('div', 'cs-stage');
  stage.hidden = true;
  root.appendChild(stage);
  let idx = 0;
  let votes = readClass();

  const renderStage = () => {
    stage.innerHTML = '';
    const bar = el('div', 'cs-stage-bar');
    const exit = el('button', 'tp-btn', S.exit); exit.type = 'button';
    exit.addEventListener('click', () => { stage.hidden = true; root.classList.remove('is-running'); });
    const clear = el('button', 'tp-btn', S.clearClass); clear.type = 'button';
    clear.addEventListener('click', () => { votes = {}; writeClass(votes); renderStage(); });
    bar.append(exit, clear);
    stage.appendChild(bar);

    if (idx >= total) {
      stage.appendChild(el('h3', 'cs-stage-title', S.results));
      const board = el('div', 'cs-board');
      for (const c of data.cards) {
        const v = votes[c.id] || { fine: 0, depends: 0, cheating: 0 };
        const sum = v.fine + v.depends + v.cheating || 1;
        const row = el('div', 'cs-board-row');
        row.appendChild(el('span', 'cs-board-text', c.text));
        const bars = el('div', 'cs-board-bars');
        for (const z of ['fine', 'depends', 'cheating']) {
          const seg = el('span', 'cs-seg cs-seg--' + z, v[z] ? String(v[z]) : '');
          seg.style.width = (v[z] / sum * 100) + '%';
          bars.appendChild(seg);
        }
        row.appendChild(bars);
        board.appendChild(row);
      }
      stage.appendChild(board);
      const back = el('button', 'tp-btn', S.prev); back.type = 'button';
      back.addEventListener('click', () => { idx = total - 1; renderStage(); });
      stage.appendChild(back);
      return;
    }

    const c = data.cards[idx];
    votes[c.id] = votes[c.id] || { fine: 0, depends: 0, cheating: 0 };
    stage.appendChild(el('p', 'cs-stage-n', fill(S.cardOf, { i: idx + 1, n: total })));
    const big = el('div', 'cs-big cs-big--' + c.who);
    big.append(el('span', 'cs-who', S.who[c.who]), el('p', 'cs-big-text', c.text));
    stage.appendChild(big);
    stage.appendChild(el('p', 'cs-hands', S.hands));
    const cols = el('div', 'cs-cols');
    const sum = () => votes[c.id].fine + votes[c.id].depends + votes[c.id].cheating || 1;
    const colEls = {};
    for (const [z, label] of [['fine', S.fine], ['depends', S.depends], ['cheating', S.cheating]]) {
      const col = el('button', 'cs-col cs-col--' + z); col.type = 'button';
      const n = el('span', 'cs-col-n', String(votes[c.id][z]));
      const fillEl = el('span', 'cs-col-fill');
      col.append(fillEl, n, el('span', 'cs-col-label', label));
      const minus = el('button', 'cs-col-minus', '−'); minus.type = 'button'; minus.setAttribute('aria-label', S.minus);
      minus.addEventListener('click', (e) => { e.stopPropagation(); votes[c.id][z] = Math.max(0, votes[c.id][z] - 1); writeClass(votes); update(); });
      col.appendChild(minus);
      col.addEventListener('click', () => { votes[c.id][z] += 1; writeClass(votes); update(); if (gsap && !reducedMotion) gsap.fromTo(n, { scale: 1.5 }, { scale: 1, duration: 0.3 }); });
      cols.appendChild(col);
      colEls[z] = { n, fillEl };
    }
    const update = () => {
      for (const z of ['fine', 'depends', 'cheating']) {
        colEls[z].n.textContent = String(votes[c.id][z]);
        colEls[z].fillEl.style.height = (votes[c.id][z] / sum() * 100) + '%';
      }
    };
    update();
    stage.appendChild(cols);
    const nav = el('div', 'cs-stage-nav');
    const prev = el('button', 'tp-btn', S.prev); prev.type = 'button'; prev.disabled = idx === 0;
    prev.addEventListener('click', () => { idx -= 1; renderStage(); });
    const next = el('button', 'tp-btn tp-btn--play', idx === total - 1 ? S.finish : S.next); next.type = 'button';
    next.addEventListener('click', () => { idx += 1; renderStage(); });
    nav.append(prev, next);
    stage.appendChild(nav);
  };
  run.addEventListener('click', () => { idx = 0; stage.hidden = false; root.classList.add('is-running'); renderStage(); stage.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' }); });

  render();
  return { place, placements };
}
