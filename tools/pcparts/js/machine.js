/* Front page interaction.
 *
 * The SVG is fetched and injected into the document rather than referenced
 * with <img>, because an <img> is opaque to CSS and JS: nothing inside it can
 * be styled, hidden or clicked. Once inlined, every layer exported from the
 * drawing program is an ordinary element addressed by its id.
 *
 * Two rules drive everything:
 *   removable parts disappear once explored, and come back from the tray
 *   a part cannot be clicked while another part is drawn on top of it
 */

import { openTopic } from './explore.js';

const STAGE = document.getElementById('stage');
const TRAY = document.getElementById('tray');
const DETAIL = document.getElementById('detail');
const DETAIL_BODY = document.getElementById('detail-body');
const STORE_KEY = 'pcparts-removed';

const removed = new Set();
let parts = [];
let lastTarget = null;

init();

async function init() {
  try {
    const [svg, data] = await Promise.all([
      fetch('assets/pc.svg').then(r => r.text()),
      fetch('data/machine.json').then(r => r.json())
    ]);
    // insertAdjacentHTML rather than innerHTML: the popup and tray live inside
    // the stage, and rewriting innerHTML would replace them with fresh nodes
    // that nothing holds a reference to.
    STAGE.querySelector('.stage-loading')?.remove();
    STAGE.insertAdjacentHTML('afterbegin', svg);
    parts = data.parts;
  } catch (err) {
    STAGE.innerHTML = '<p class="stage-loading">The diagram could not be loaded.</p>';
    console.error(err);
    return;
  }

  parts.forEach(wire);
  load();
  refresh();
}

/* ── persistence ─────────────────────────────────────── */

function load() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORE_KEY));
  } catch {
    return;
  }
  if (!Array.isArray(saved)) return;
  const known = new Set(parts.map(p => p.id));
  saved.filter(id => known.has(id)).forEach(id => removed.add(id));
}

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...removed]));
  } catch {
    // Private browsing, or storage is full. The page still works, it just
    // forgets between visits.
  }
}

/* ── wiring ──────────────────────────────────────────── */

/* The hit shape for `part-cpu` is `hit-cpu`. Entries that are already a hit id
   are fixed features of the board with no removable artwork behind them. */
function hitIdFor(part) {
  return part.id.startsWith('hit-') ? part.id : 'hit-' + part.id.replace(/^(part|case)-/, '');
}

function wire(part) {
  const hit = document.getElementById(hitIdFor(part));
  if (!hit) {
    console.warn('no hit shape for', part.id);
    return;
  }
  const art = part.id.startsWith('hit-') ? null : document.getElementById(part.id);

  hit.setAttribute('role', 'button');
  hit.setAttribute('aria-label', part.label);
  if (!art) hit.classList.add('is-fixed');

  hit.addEventListener('mouseenter', () => {
    if (art) art.classList.add(part.removable ? 'is-lit' : 'is-lit-fixed');
  });
  hit.addEventListener('mouseleave', () => {
    if (art) art.classList.remove('is-lit', 'is-lit-fixed');
  });

  hit.addEventListener('click', () => select(part));
  hit.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(part);
    }
  });

  part._hit = hit;
  part._art = art;
}

function isBlocked(part) {
  return part.blockedBy.some(id => !removed.has(id));
}

function select(part) {
  if (isBlocked(part)) return;
  openDetail(part);
  if (part.removable) {
    removed.add(part.id);
    if (part._art) part._art.classList.remove('is-lit', 'is-lit-fixed');
  }
  refresh();
}

function restore(part) {
  removed.delete(part.id);
  refresh();
  part._hit.focus();
}

function refresh() {
  parts.forEach(part => {
    const gone = removed.has(part.id);
    const blocked = isBlocked(part);

    if (part._art) part._art.classList.toggle('is-removed', gone);

    // A removed part has no artwork left to click, and a blocked one is
    // underneath something, so neither takes pointer or keyboard focus.
    const inert = gone || blocked;
    part._hit.classList.toggle('is-blocked', inert);
    part._hit.setAttribute('tabindex', inert ? '-1' : '0');
    part._hit.setAttribute('aria-hidden', inert ? 'true' : 'false');
  });

  drawTray();
  save();
}

function drawTray() {
  TRAY.textContent = '';
  parts.filter(p => removed.has(p.id)).forEach(part => {
    const blocked = isBlocked(part);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = part.label;
    if (blocked) {
      // Putting this back would hide it under something still in place.
      btn.setAttribute('aria-disabled', 'true');
      btn.title = 'Covered by another part';
    } else {
      btn.addEventListener('click', () => restore(part));
    }
    TRAY.append(btn);
  });
}

/* ── popup ───────────────────────────────────────────── */

function openDetail(part) {
  lastTarget = part._hit;
  DETAIL_BODY.textContent = '';

  const h = document.createElement('h2');
  h.id = 'detail-title';
  h.textContent = part.label;
  DETAIL_BODY.append(h);

  const spec = document.createElement('p');
  spec.className = 'detail-spec';
  spec.textContent = part.spec;
  DETAIL_BODY.append(spec);

  part.body.forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    DETAIL_BODY.append(p);
  });

  if (part.topic) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'detail-link';
    btn.textContent = part.linkText;
    btn.addEventListener('click', () => {
      closeDetail();
      openTopic(part.topic, part._hit);
    });
    DETAIL_BODY.append(btn);
  }

  DETAIL.hidden = false;
  DETAIL.scrollTop = 0;
  DETAIL.focus();
}

function closeDetail() {
  if (DETAIL.hidden) return;
  DETAIL.hidden = true;
  // Only pull focus back if it is still inside the popup, so closing by
  // clicking elsewhere does not yank the page around.
  if (DETAIL.contains(document.activeElement) && lastTarget) lastTarget.focus();
}

document.getElementById('detail-close').addEventListener('click', closeDetail);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDetail();
});

document.addEventListener('click', e => {
  if (DETAIL.hidden) return;
  if (DETAIL.contains(e.target)) return;
  if (e.target.closest('#hit, .tray')) return;
  closeDetail();
});
