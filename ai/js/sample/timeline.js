/* ============================================================
   The stuck belief: a scrubbed timeline
   ------------------------------------------------------------
   One quote card. As the year passes along a track of events,
   the card reads what teachers said about Wikipedia. When the
   year crosses the launch of ChatGPT the same card, same layout,
   reads what teachers say about AI, and only three phrases
   change, flipping letter by letter. Scrolling drives the year
   on desktop (sticky scene in a tall stage); a slider and a play
   button drive it everywhere else. Under reduced motion both
   versions of the card sit side by side, still.

   Data: data/timeline.json.
   ============================================================ */

import { markDone } from './progress.js';

const SCRAMBLE = 'abcdefghijklmnopqrstuvwxyz';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/** The axis is stretched: the years with the events get more room.
 *  Segments are [fromYear, toYear, pixelsPerYear]. */
export const SEGMENTS = [[2001, 2021, 95], [2021, 2027, 400]];

/** Pure: a year's position along the track in pixels. */
export function yearToPx(year, segments = SEGMENTS) {
  let px = 0;
  for (const [a, b, k] of segments) {
    if (year <= a) break;
    px += (Math.min(year, b) - a) * k;
  }
  return px;
}

/** Pure: the inverse of yearToPx. */
export function pxToYear(px, segments = SEGMENTS) {
  let left = px;
  for (const [a, b, k] of segments) {
    const len = (b - a) * k;
    if (left <= len) return a + left / k;
    left -= len;
  }
  return segments[segments.length - 1][1];
}

/** Pure: progress 0..1 to a year, by distance along the stretched
 *  track between `from` and `to`, so scrolling moves at a steady
 *  visual speed rather than a steady number of years. */
export function progressToYear(p, from, to, segments = SEGMENTS) {
  const c = Math.max(0, Math.min(1, p));
  const a = yearToPx(from, segments), b = yearToPx(to, segments);
  return pxToYear(a + c * (b - a), segments);
}

/** Pure: which state the card shows at a year. */
export function stateAt(year, flipAt) {
  return year >= flipAt ? 'b' : 'a';
}

/** Flip a span's text from one string to another, letter by letter,
 *  with a short scramble ahead of the settled letters. Returns a
 *  cancel function. Instant when reducedMotion. */
export function flipText(span, to, { reducedMotion = false, ms = 520 } = {}) {
  if (span._cancelFlip) span._cancelFlip();
  if (reducedMotion) { span.textContent = to; return () => {}; }
  const from = span.textContent;
  const len = Math.max(from.length, to.length);
  let raf = null;
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / ms);
    const settled = Math.floor(p * len);
    let out = '';
    for (let i = 0; i < len; i++) {
      if (i < settled) out += to[i] || '';
      else if (i < to.length) out += (to[i] === ' ' ? ' ' : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]);
    }
    span.textContent = out;
    if (p < 1) raf = requestAnimationFrame(tick);
    else { span.textContent = to; span._cancelFlip = null; }
  };
  raf = requestAnimationFrame(tick);
  const cancel = () => { if (raf) cancelAnimationFrame(raf); span._cancelFlip = null; };
  span._cancelFlip = cancel;
  return cancel;
}

export async function mountTimeline(root, { reducedMotion = false, url = './data/timeline.json', gsap = window.gsap, ScrollTrigger = window.ScrollTrigger } = {}) {
  const data = await (await fetch(url)).json();
  const S = data.strings;
  const teacher = document.documentElement.getAttribute('data-mode') === 'teacher';
  const pinned = !reducedMotion && !teacher && window.innerWidth > 900 && !!gsap && !!ScrollTrigger;

  root.classList.add('tl-stage');
  root.classList.toggle('is-pinned', pinned);

  /* ----- still version: both cards, no motion ----- */
  const buildCard = (state) => {
    const card = el('blockquote', 'tl-card');
    const p = el('p', 'tl-quote');
    const swaps = [];
    for (const seg of data.quote.segments) {
      if (typeof seg === 'string') p.appendChild(document.createTextNode(seg));
      else {
        const s = el('span', 'tl-swap', seg[state]);
        s.setAttribute('data-a', seg.a);
        s.setAttribute('data-b', seg.b);
        p.appendChild(s);
        swaps.push(s);
      }
    }
    const by = el('footer', 'tl-by', state === 'a' ? data.quote.byA : data.quote.byB);
    card.append(p, by);
    return { card, swaps, by };
  };

  if (reducedMotion) {
    const grid = el('div', 'tl-still');
    for (const state of ['a', 'b']) {
      const col = el('div', 'tl-still-col');
      col.appendChild(el('p', 'tl-still-label', state === 'a' ? S.stillA : S.stillB));
      const { card, swaps } = buildCard(state);
      swaps.forEach((s) => s.classList.add('is-marked'));
      col.appendChild(card);
      grid.appendChild(col);
    }
    grid.appendChild(el('p', 'tl-end is-shown', S.end));
    root.appendChild(grid);
    markDone(root.closest('.screen')?.id || 's2', { still: true });
    return {};
  }

  /* ----- moving version ----- */
  const scene = el('div', 'tl-scene');
  root.appendChild(scene);

  const yearEl = el('div', 'tl-year', String(data.from));
  yearEl.setAttribute('aria-live', 'off');
  scene.appendChild(yearEl);

  // the track: events laid out by year, slid so the current year sits at the pointer
  const trackWrap = el('div', 'tl-track-wrap');
  const pointer = el('div', 'tl-pointer');
  pointer.setAttribute('aria-hidden', 'true');
  const track = el('div', 'tl-track');
  const px0 = yearToPx(data.from);
  const trackLen = yearToPx(data.to) - px0;
  track.style.width = trackLen + 'px';
  const eventEls = data.events.map((ev, i) => {
    const e = el('div', 'tl-event' + (i % 2 ? ' tl-event--alt' : ''));
    e.style.left = (yearToPx(ev.year) - px0) + 'px';
    e.append(el('span', 'tl-event-dot'), el('span', 'tl-event-year', String(Math.floor(ev.year))), el('span', 'tl-event-text', ev.text));
    track.appendChild(e);
    return { ...ev, el: e };
  });
  trackWrap.append(pointer, track);
  scene.appendChild(trackWrap);

  const { card, swaps, by } = buildCard('a');
  scene.appendChild(card);
  const end = el('p', 'tl-end', S.end);
  scene.appendChild(end);

  // controls for the unpinned version
  let slider = null, playBtn = null;
  if (!pinned) {
    const bar = el('div', 'tl-bar tp-scope');
    playBtn = el('button', 'tp-btn tp-btn--play', S.play);
    playBtn.type = 'button';
    slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0'; slider.max = '1000'; slider.value = '0';
    slider.className = 'tl-slider';
    slider.setAttribute('aria-label', S.yearLabel);
    bar.append(playBtn, slider);
    scene.appendChild(bar);
  }

  let state = 'a';
  let year = data.from;
  let done = false;
  const setYear = (y) => {
    year = y;
    yearEl.textContent = String(Math.floor(y));
    const center = trackWrap.clientWidth / 2;
    track.style.transform = `translateX(${center - (yearToPx(y) - px0)}px)`;
    for (const ev of eventEls) ev.el.classList.toggle('is-passed', y >= ev.year);
    const next = stateAt(y, data.flipAt);
    if (next !== state) {
      state = next;
      card.classList.toggle('is-b', state === 'b');
      swaps.forEach((s, i) => setTimeout(() => flipText(s, s.getAttribute('data-' + state), { reducedMotion }), i * 140));
      by.textContent = state === 'a' ? data.quote.byA : data.quote.byB;
    }
    const finished = y >= data.doneAt;
    end.classList.toggle('is-shown', finished);
    if (finished && !done) { done = true; markDone(root.closest('.screen')?.id || 's2', { reached: Math.floor(y) }); }
    if (slider && document.activeElement !== slider) slider.value = String(Math.round(((yearToPx(y) - px0) / trackLen) * 1000));
  };

  if (pinned) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: root,
      start: 'top top+=60',
      end: () => '+=' + Math.round(window.innerHeight * 1.6),
      scrub: 0.4,
      onUpdate: (self) => setYear(progressToYear(self.progress, data.from, data.to)),
    });
  } else {
    slider.addEventListener('input', () => { stopPlay(); setYear(progressToYear(Number(slider.value) / 1000, data.from, data.to)); });
    let tween = null;
    const stopPlay = () => { if (tween) { tween.kill(); tween = null; playBtn.textContent = S.play; } };
    playBtn.addEventListener('click', () => {
      if (tween) { stopPlay(); return; }
      const proxy = { y: year >= data.to - 0.1 ? data.from : year };
      playBtn.textContent = S.pause;
      if (gsap) {
        const p0 = { p: (yearToPx(proxy.y) - px0) / trackLen };
        tween = gsap.to(p0, { p: 1, duration: 14 * (1 - p0.p), ease: 'none', onUpdate: () => setYear(progressToYear(p0.p, data.from, data.to)), onComplete: () => { tween = null; playBtn.textContent = S.play; } });
      } else {
        setYear(data.to); playBtn.textContent = S.play;
      }
    });
  }
  window.addEventListener('resize', () => setYear(year));
  setYear(data.from);
  return { setYear };
}
