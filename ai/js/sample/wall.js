/* ============================================================
   The wall and the window
   ------------------------------------------------------------
   A timeline with a wall of bricks at the model's training
   cutoff. Scrolling builds the wall (a sticky scene inside a tall
   stage, progress from ScrollTrigger). Question cards sit in a
   tray: drag one onto the timeline, or tap it, and it flies to
   the year its answer comes from. Before the cutoff it lands.
   After the cutoff it hits the wall and bounces, unless the
   search switch is on, in which case a window is open in the
   wall and the card passes through.

   Data: data/wall.json. Needs window.gsap for the flights; falls
   back to instant placement without it.
   ============================================================ */

import { markDone } from './progress.js';

const VB = { w: 1000, h: 400 };
const AXIS_Y = 330;
const WALL_TOP = 44;
const BRICK_H = 18;
const BRICK_W = 46;
const WINDOW_ROWS = [5, 6, 7, 8, 9];   // rows that open

const svgNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs = {}) {
  const e = document.createElementNS(svgNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/** Pure: a year's x in viewBox units. Years before the axis start
 *  are pinned to the left edge; after the end, to the right. */
export function yearToX(year, axis) {
  const t = (year - axis.from) / (axis.to - axis.from);
  const c = Math.max(0, Math.min(1, t));
  return 60 + c * (VB.w - 120);
}

/** Pure: brick layout for a wall centred on x, as rows of rects. */
export function brickLayout(wallX) {
  const bricks = [];
  const rows = Math.floor((AXIS_Y - WALL_TOP) / BRICK_H);
  for (let r = 0; r < rows; r++) {
    const y = AXIS_Y - (r + 1) * BRICK_H;
    const offset = r % 2 ? BRICK_W / 2 : 0;
    // two half-width columns make a bonded pattern
    for (let c = 0; c < 2; c++) {
      const x = wallX - BRICK_W + c * BRICK_W - offset;
      bricks.push({ x, y, w: BRICK_W - 2, h: BRICK_H - 2, row: r, i: bricks.length });
    }
  }
  return bricks;
}

export async function mountWall(root, { reducedMotion = false, url = './data/wall.json', gsap = window.gsap, ScrollTrigger = window.ScrollTrigger } = {}) {
  const data = await (await fetch(url)).json();
  const S = data.strings;
  const wallX = yearToX(data.cutoff.year, data.axis);
  const pinned = !reducedMotion && window.innerWidth > 900 && !!gsap && !!ScrollTrigger
    && document.documentElement.getAttribute('data-mode') !== 'teacher';

  root.classList.add('wall-stage');
  root.classList.toggle('is-pinned', pinned);
  const scene = el('div', 'wall-scene');
  root.appendChild(scene);

  /* ----- svg: axis, wall, window light ----- */
  const svg = svgEl('svg', { class: 'wall-svg', viewBox: `0 0 ${VB.w} ${VB.h}`, 'aria-hidden': 'true' });
  const defs = svgEl('defs');
  const grad = svgEl('linearGradient', { id: 'wall-beam', x1: 0, y1: 0, x2: 1, y2: 0 });
  grad.append(svgEl('stop', { offset: 0, 'stop-color': 'var(--beam)', 'stop-opacity': 0.55 }), svgEl('stop', { offset: 1, 'stop-color': 'var(--beam)', 'stop-opacity': 0 }));
  defs.appendChild(grad);
  svg.appendChild(defs);

  // beam behind the wall (visible when the window is open)
  const winTop = AXIS_Y - (Math.max(...WINDOW_ROWS) + 1) * BRICK_H;
  const winBot = AXIS_Y - Math.min(...WINDOW_ROWS) * BRICK_H;
  const beam = svgEl('polygon', { class: 'wall-beam', points: `${wallX},${winTop} ${VB.w},${winTop - 70} ${VB.w},${winBot + 70} ${wallX},${winBot}`, fill: 'url(#wall-beam)' });
  svg.appendChild(beam);

  // axis
  svg.appendChild(svgEl('line', { class: 'wall-axis', x1: 40, y1: AXIS_Y, x2: VB.w - 40, y2: AXIS_Y }));
  for (const y of data.axis.labels) {
    const x = yearToX(y, data.axis);
    svg.appendChild(svgEl('line', { class: 'wall-tick', x1: x, y1: AXIS_Y - 6, x2: x, y2: AXIS_Y + 6 }));
    const t = svgEl('text', { class: 'wall-year', x, y: AXIS_Y + 26, 'text-anchor': 'middle' });
    t.textContent = String(y);
    svg.appendChild(t);
  }
  const before = svgEl('text', { class: 'wall-year wall-year--edge', x: 60, y: AXIS_Y + 48, 'text-anchor': 'middle' });
  before.textContent = '← long before';
  svg.appendChild(before);

  // bricks
  const bricks = brickLayout(wallX);
  const wallG = svgEl('g', { class: 'wall-bricks' });
  const brickEls = bricks.map((b) => {
    const r = svgEl('rect', { class: 'brick' + (WINDOW_ROWS.includes(b.row) ? ' brick--window' : ''), x: b.x, y: b.y, width: b.w, height: b.h, rx: 2 });
    r.style.setProperty('--dx', (b.x + b.w / 2 < wallX ? -1 : 1) * 30 + 'px');
    wallG.appendChild(r);
    return r;
  });
  svg.appendChild(wallG);
  const cut = svgEl('text', { class: 'wall-label', x: wallX, y: WALL_TOP - 14, 'text-anchor': 'middle' });
  cut.textContent = data.cutoff.label;
  svg.appendChild(cut);
  scene.appendChild(svg);

  const setBuilt = (p) => {
    const n = Math.round(p * brickEls.length);
    brickEls.forEach((b, i) => b.classList.toggle('is-set', i < n));
    scene.classList.toggle('is-built', n >= brickEls.length);
  };

  /* ----- controls: switch, status, reset ----- */
  const bar = el('div', 'wall-bar tp-scope');
  const sw = el('button', 'wall-switch');
  sw.type = 'button';
  sw.setAttribute('role', 'switch');
  sw.setAttribute('aria-checked', 'false');
  const knob = el('span', 'wall-knob');
  knob.setAttribute('aria-hidden', 'true');
  const swLabel = el('span', 'wall-switch-label', S.searchOff);
  sw.append(knob, swLabel);
  const status = el('p', 'wall-status', S.intro);
  status.setAttribute('aria-live', 'polite');
  const reset = el('button', 'tp-btn', S.reset);
  reset.type = 'button';
  bar.append(sw, reset);
  scene.append(bar, status);

  let searchOn = false;
  let toggled = false;
  const setSearch = (on) => {
    searchOn = on;
    sw.setAttribute('aria-checked', String(on));
    swLabel.textContent = on ? S.searchOn : S.searchOff;
    scene.classList.toggle('is-open', on);
  };
  sw.addEventListener('click', () => { toggled = true; setSearch(!searchOn); checkDone(); });

  /* ----- cards ----- */
  const tray = el('div', 'wall-tray');
  scene.appendChild(tray);
  const placed = new Set();
  const cards = data.cards.map((c) => {
    const card = el('button', 'wcard', c.text);
    card.type = 'button';
    card.setAttribute('data-id', c.id);
    tray.appendChild(card);
    return { ...c, el: card, tag: null };
  });

  // viewBox → pixel, relative to the scene
  const toPx = (x, y) => {
    const r = svg.getBoundingClientRect();
    const s = scene.getBoundingClientRect();
    return { x: r.left - s.left + (x / VB.w) * r.width, y: r.top - s.top + (y / VB.h) * r.height };
  };

  const fmt = (tpl, q) => tpl.replace('{q}', q.endsWith('?') ? q : q + '.');

  const fly = (c) => {
    if (c.placed) return;
    c.placed = true;
    placed.add(c.id);
    const card = c.el;
    const home = card.getBoundingClientRect();
    const s = scene.getBoundingClientRect();
    // lift the card out of the tray into scene coordinates
    card.classList.add('is-flying');
    card.style.left = (home.left - s.left) + 'px';
    card.style.top = (home.top - s.top) + 'px';
    card.style.width = home.width + 'px';
    const ghost = el('span', 'wcard-ghost');
    ghost.style.width = home.width + 'px';
    ghost.style.height = home.height + 'px';
    tray.insertBefore(ghost, card);
    scene.appendChild(card);
    c.ghost = ghost;

    const target = toPx(yearToX(c.year, data.axis), AXIS_Y - 40);
    const wall = toPx(wallX, AXIS_Y - 40);
    const cw = home.width;
    const after = c.kind === 'after';
    const blocked = after && !searchOn;

    let kindOut = c.kind === 'timeless' ? 'timeless' : (after ? (blocked ? 'blocked' : 'through') : 'before');
    const tagText = blocked ? S.tagBlocked : (after ? S.tagWeb : S.tagMemory);
    const message = kindOut === 'timeless' ? S.timeless : kindOut === 'before' ? S.landedBefore : kindOut === 'blocked' ? S.blocked : S.throughWindow;

    const finish = () => {
      c.outcome = kindOut;
      card.classList.add('is-placed', 'is-' + kindOut);
      const tag = el('span', 'wcard-tag', tagText);
      card.appendChild(tag);
      status.textContent = fmt(message, c.text);
      if (gsap && !reducedMotion) gsap.from(tag, { scale: 0.4, opacity: 0, duration: 0.35, ease: 'back.out(2.5)' });
      checkDone();
    };

    const maxX = scene.clientWidth - cw - 10;
    const endX = Math.max(10, Math.min(maxX, blocked ? (wall.x - cw - 26) : (target.x - cw / 2)));
    // stack above any card already resting in the same stretch of the axis
    let endY = target.y - 30;
    const ch = home.height + 10;
    const resting = cards.filter((o) => o !== c && o.placed && o.rest);
    let bumped = true;
    while (bumped) {
      bumped = false;
      for (const o of resting) {
        const overlapX = endX < o.rest.x + o.rest.w && endX + cw > o.rest.x;
        const overlapY = Math.abs(endY - o.rest.y) < ch;
        if (overlapX && overlapY) { endY = o.rest.y - ch; bumped = true; }
      }
    }
    c.rest = { x: endX, y: endY, w: cw };
    if (!gsap || reducedMotion) {
      card.style.left = endX + 'px';
      card.style.top = endY + 'px';
      finish();
      return;
    }
    const tl = gsap.timeline({ onComplete: finish });
    if (blocked) {
      // fly at the wall, hit it, bounce back
      tl.to(card, { left: wall.x - cw - 4, top: endY, rotation: 2, duration: 0.55, ease: 'power2.in' })
        .to(wallG, { x: 3, duration: 0.05, yoyo: true, repeat: 3, ease: 'none' }, '<0.5')
        .to(card, { left: endX, rotation: -3, duration: 0.45, ease: 'bounce.out' })
        .to(card, { rotation: 0, duration: 0.2 });
    } else if (after) {
      // through the window: dip to the window's height, pass, land
      const winY = toPx(wallX, (winTop + winBot) / 2).y - 20;
      tl.to(card, { left: wall.x - cw / 2, top: winY, rotation: -4, duration: 0.6, ease: 'power2.inOut' })
        .to(card, { left: endX, top: endY, rotation: 0, duration: 0.55, ease: 'power2.out' });
    } else {
      tl.to(card, { left: endX, top: endY - 40, rotation: -6, duration: 0.5, ease: 'power2.out' })
        .to(card, { top: endY, rotation: 0, duration: 0.35, ease: 'bounce.out' });
    }
  };

  const restore = (c) => {
    if (!c.placed) return;
    c.placed = false;
    placed.delete(c.id);
    c.rest = null;
    c.el.classList.remove('is-flying', 'is-placed', 'is-before', 'is-blocked', 'is-through', 'is-timeless');
    c.el.style.cssText = '';
    c.el.querySelector('.wcard-tag')?.remove();
    if (c.ghost) { tray.replaceChild(c.el, c.ghost); c.ghost = null; } else tray.appendChild(c.el);
  };
  reset.addEventListener('click', () => { cards.forEach(restore); status.textContent = S.intro; });

  // drag or tap. A drag that ends above the tray throws the card;
  // anything else (a tap, a short drag) throws it too, so touch works.
  for (const c of cards) {
    let start = null;
    c.el.addEventListener('pointerdown', (e) => {
      if (c.placed) return;
      start = { x: e.clientX, y: e.clientY, moved: false };
      c.el.setPointerCapture(e.pointerId);
      c.el.classList.add('is-dragging');
    });
    c.el.addEventListener('pointermove', (e) => {
      if (!start || c.placed) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) start.moved = true;
      c.el.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 40}deg)`;
    });
    const up = () => {
      if (!start) return;
      start = null;
      c.el.classList.remove('is-dragging');
      c.el.style.transform = '';
      if (!c.placed) fly(c);
    };
    c.el.addEventListener('pointerup', up);
    c.el.addEventListener('pointercancel', up);
    c.el.addEventListener('click', (e) => { if (c.placed) { e.preventDefault(); restore(c); } });
  }

  const checkDone = () => {
    if (placed.size >= 3 && toggled) {
      markDone(root.closest('.screen')?.id || 's4', {
        placed: Array.from(placed),
        cards: cards.filter((c) => c.placed).map((c) => ({ text: c.text, outcome: c.outcome })),
        searchTried: true,
      });
      if (!scene.classList.contains('is-done')) {
        scene.classList.add('is-done');
        status.textContent = S.done;
      }
    }
  };

  /* ----- build the wall ----- */
  if (pinned) {
    gsap.registerPlugin(ScrollTrigger);
    setBuilt(0);
    ScrollTrigger.create({
      trigger: root,
      start: 'top top+=60',
      end: () => '+=' + Math.round(window.innerHeight * 0.9),
      scrub: 0.3,
      onUpdate: (self) => setBuilt(self.progress),
    });
  } else if (reducedMotion) {
    setBuilt(1);
    setSearch(true);
  } else {
    // phones and teacher mode: build on arrival, once
    setBuilt(0);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.disconnect();
        let p = 0;
        const step = () => { p += 0.04; setBuilt(Math.min(1, p)); if (p < 1) setTimeout(step, 40); };
        step();
      }
    }, { threshold: 0.4 });
    io.observe(scene);
    setTimeout(() => { if (!scene.classList.contains('is-built') && scene.getBoundingClientRect().top < window.innerHeight) { let p = 0; const step = () => { p += 0.04; setBuilt(Math.min(1, p)); if (p < 1) setTimeout(step, 40); }; step(); io.disconnect(); } }, 1500);
  }

  return { setBuilt, setSearch, cards };
}
