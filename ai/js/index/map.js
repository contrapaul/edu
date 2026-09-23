/* ============================================================
   Which model: the map
   ------------------------------------------------------------
   A rough hand-drawn world map (inline SVG, equirectangular)
   with model names placed where their makers are, and a marker
   for models that run on the reader's own computer. Tapping a
   name opens a card with the same four facts for every tool.
   Names float up from the map as the screen enters.

   Data: data/models.json. The "where your text goes" line is
   filled in only after each company's policy has been read.
   ============================================================ */

import { markDone } from '../progress.js';

const VB = { w: 1000, h: 470 };
const MAP_H = 400;   // the map itself; the strip below is for the local marker
const LAT_TOP = 84, LAT_BOT = -58;   // no Antarctica, less empty ocean

// Rough continent outlines as [lon, lat] points. Drawn by hand, on purpose.
const LAND = [
  [[-168,66],[-140,70],[-95,72],[-75,62],[-55,50],[-66,44],[-75,35],[-81,25],[-97,26],[-105,20],[-110,23],[-118,33],[-124,42],[-130,55],[-150,60],[-165,58]],
  [[-55,60],[-20,70],[-25,83],[-60,82],[-70,77]],
  [[-80,10],[-60,12],[-50,0],[-35,-8],[-40,-22],[-50,-30],[-58,-40],[-66,-52],[-72,-45],[-76,-20],[-81,-5]],
  [[-10,36],[-9,43],[-2,48],[3,51],[8,54],[10,58],[5,62],[15,68],[25,71],[30,70],[40,66],[45,60],[35,45],[28,41],[20,38],[12,38],[0,37]],
  [[-17,15],[-17,22],[-5,36],[10,37],[32,31],[43,12],[51,11],[40,-5],[35,-25],[20,-35],[12,-17],[8,4],[-12,8]],
  [[30,70],[60,72],[100,76],[140,73],[180,68],[165,60],[145,50],[135,35],[120,25],[108,10],[100,5],[95,20],[80,8],[72,20],[60,25],[55,37],[35,45],[45,60],[40,66]],
  [[114,-22],[130,-12],[142,-11],[153,-27],[150,-38],[135,-35],[115,-35]],
  [[130,32],[135,34],[141,38],[142,44],[139,43],[135,35]],
  [[126,38],[129,38],[129,35],[126,34]],
  [[-6,50],[2,52],[-2,58],[-7,56]],
];

/** Pure: lon/lat to viewBox x/y. */
export function project(lon, lat) {
  return { x: ((lon + 180) / 360) * VB.w, y: ((LAT_TOP - lat) / (LAT_TOP - LAT_BOT)) * MAP_H };
}

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

export async function mountMap(root, { reducedMotion = false, url = './data/models.json', gsap = window.gsap } = {}) {
  const data = await (await fetch(url)).json();
  const S = data.strings;
  root.classList.add('mm');

  const svg = svgEl('svg', { class: 'mm-svg', viewBox: `0 0 ${VB.w} ${VB.h}`, role: 'img', 'aria-label': 'A world map with AI tools placed where their makers are' });
  const land = svgEl('g', { class: 'mm-land' });
  for (const poly of LAND) {
    land.appendChild(svgEl('path', { d: 'M' + poly.map(([lon, lat]) => { const p = project(lon, lat); return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' L') + ' Z' }));
  }
  svg.appendChild(land);

  const markers = svgEl('g', { class: 'mm-markers' });
  const labels = svgEl('g', { class: 'mm-labels' });
  svg.append(markers, labels);
  root.appendChild(svg);

  // the local marker lives in the strip under the map
  const localPos = { x: 90, y: MAP_H + 38 };

  const panel = el('div', 'mm-panel');
  const hintLine = el('p', 'mm-hint', S.intro);
  panel.appendChild(hintLine);
  root.appendChild(panel);
  root.appendChild(el('p', 'mm-more', S.more));

  const seen = new Set();
  const labelEls = [];
  const placeAt = (m) => (m.lon == null ? localPos : project(m.lon, m.lat));

  // one dot per place
  const places = new Map();
  for (const m of data.models) {
    const p = placeAt(m);
    const key = p.x.toFixed(0) + ',' + p.y.toFixed(0);
    if (!places.has(key)) {
      places.set(key, p);
      if (m.lon == null) {
        const g = svgEl('g', { class: 'mm-laptop', transform: `translate(${p.x - 16}, ${p.y - 12})` });
        g.append(svgEl('rect', { x: 0, y: 0, width: 32, height: 20, rx: 3 }), svgEl('rect', { x: -4, y: 20, width: 40, height: 4, rx: 2 }));
        markers.appendChild(g);
      } else {
        markers.appendChild(svgEl('circle', { class: 'mm-dot', cx: p.x, cy: p.y, r: 5 }));
      }
    }
  }

  const select = (m, labelEl) => {
    for (const l of labelEls) l.classList.toggle('is-active', l === labelEl);
    panel.innerHTML = '';
    const card = el('div', 'mm-card');
    card.appendChild(el('h3', 'mm-card-title', m.name));
    const rows = el('dl', 'mm-rows');
    const row = (k, v, note, cls) => {
      const dt = el('dt', null, k);
      const dd = el('dd', cls);
      dd.appendChild(el('span', 'mm-v', v));
      if (note) dd.appendChild(el('span', 'mm-note', note));
      rows.append(dt, dd);
    };
    row(S.madeBy, m.maker + (m.city ? ', ' + m.city : '') + (m.country ? ', ' + m.country : ''));
    row(S.search, S.values[m.search.v] || m.search.v, m.search.note, 'mm-' + m.search.v.replace(/\s/g, '-'));
    row(S.open, S.values[m.open.v] || m.open.v, m.open.note, 'mm-' + m.open.v.replace(/\s/g, '-'));
    if (m.lon == null) row(S.policy, S.local, null, 'mm-yes');
    else row(S.policy, m.policy || S.policyPending, null, m.policy ? '' : 'mm-pending');
    card.appendChild(rows);
    card.appendChild(el('p', 'mm-checked', S.checked + ' ' + m.checkedOn));
    panel.appendChild(card);
    if (gsap && !reducedMotion) gsap.from(card, { y: 8, opacity: 0, duration: 0.3, ease: 'power2.out' });

    seen.add(m.id);
    if (seen.size >= 4) {
      const names = data.models.filter((x) => seen.has(x.id)).map((x) => x.name);
      markDone(root.closest('.screen')?.id || 's7', { seen: Array.from(seen), names });
      if (!root.classList.contains('is-done')) root.classList.add('is-done');
      panel.appendChild(el('p', 'mm-done', S.done));
    }
  };

  for (const m of data.models) {
    const p = placeAt(m);
    const lx = p.x + m.dx, ly = p.y + m.dy;
    if (m.dx || m.dy) labels.appendChild(svgEl('line', { class: 'mm-leader', x1: p.x, y1: p.y, x2: lx + (m.dx < 0 ? 4 : -4), y2: ly }));
    // an outer group holds the position; GSAP animates the inner one,
    // because it takes over an SVG element's transform entirely
    const pos = svgEl('g', { transform: `translate(${lx}, ${ly})` });
    const g = svgEl('g', { class: 'mm-label', tabindex: 0, role: 'button' });
    const text = svgEl('text', { x: m.dx < 0 ? -6 : 6, y: 4, 'text-anchor': m.dx < 0 ? 'end' : 'start' });
    text.textContent = m.lon == null ? S.yourComputer : m.name;
    const box = svgEl('rect', { rx: 6 });
    g.append(box, text);
    pos.appendChild(g);
    labels.appendChild(pos);
    // size the pill to its text once it is in the document
    requestAnimationFrame(() => {
      try {
        const b = text.getBBox();
        box.setAttribute('x', b.x - 7); box.setAttribute('y', b.y - 4);
        box.setAttribute('width', b.width + 14); box.setAttribute('height', b.height + 8);
      } catch { /* not rendered yet */ }
    });
    const open = () => select(m, g);
    g.addEventListener('click', open);
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    labelEls.push(g);
  }

  // float the names up as the screen enters
  if (!reducedMotion && gsap) {
    gsap.set(labelEls, { opacity: 0, y: 14 });
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.disconnect();
        gsap.to(labelEls, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.05 });
      }
    }, { threshold: 0.3 });
    io.observe(root);
    setTimeout(() => { if (root.getBoundingClientRect().top < window.innerHeight) { io.disconnect(); gsap.to(labelEls, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }); } }, 1500);
  }

  return { select, labelEls };
}
