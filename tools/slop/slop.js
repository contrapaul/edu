// Slop: posters with observations, and a guess-then-reveal identifier where
// students drop pins, press Check, and every tell is ringed in marker.
// Regions are stored in the poster's own pixel coordinates as
// [x, y, width, height] with an optional fifth value, a rotation in degrees
// around the region's center, for slanted text. The SVG viewBox scales
// them with the image.

const SVGNS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs, parent) {
  const node = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.append(node);
  return node;
}

// Small seeded random generator, so each ring wobbles the same way every time.
function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h;
}

// A hand-drawn loop around a rectangle: an uneven, squarish ellipse that
// overshoots its starting point and drifts outward at the end, the way a
// marker does. The squarish shape keeps the ends of wide text inside.
function ringPath([x, y, w, h], seed, pad) {
  const rand = seeded(seed);
  const cx = x + w / 2, cy = y + h / 2;
  const rx = w / 2 + pad, ry = h / 2 + pad;
  const start = -Math.PI * 0.75 + rand() * 0.6;
  const sweep = Math.PI * 2 + 0.3 + rand() * 0.4;
  const p1 = rand() * 6.28, p2 = rand() * 6.28;
  const amp = 0.025 + rand() * 0.025;
  const steps = 80;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + sweep * t;
    const drift = t > 0.8 ? (t - 0.8) * 0.4 : 0;
    const k = 1 + amp * Math.sin(2 * a + p1) + amp * 0.6 * Math.sin(3 * a + p2) + drift;
    const ex = Math.sign(Math.cos(a)) * Math.abs(Math.cos(a)) ** 0.6;
    const ey = Math.sign(Math.sin(a)) * Math.abs(Math.sin(a)) ** 0.6;
    d += (i ? 'L' : 'M') + (cx + rx * k * ex).toFixed(1) + ' ' + (cy + ry * k * ey).toFixed(1);
  }
  return d;
}

const phone = matchMedia('(max-width: 899px)');
const lockScroll = (on) => document.documentElement.classList.toggle('locked', on);
const clamp = (lo, v, hi) => Math.min(Math.max(v, lo), hi);

function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text != null) node.textContent = text;
  return node;
}

function fillCite(box, c) {
  box.append(
    el('p', {}, `Made with ${c.tool} on ${c.date}. This is the prompt exactly as it was typed:`),
    el('blockquote', {}, c.prompt),
  );
}

// Full-screen viewer for reading the small print on any poster.

const viewer = document.querySelector('.viewer');
const viewerImg = viewer.querySelector('img');

function openViewer(poster) {
  viewerImg.src = poster.image;
  viewerImg.alt = poster.alt;
  viewer.hidden = false;
  lockScroll(true);
  viewer.querySelector('.viewer-close').focus();
}
function closeViewer() {
  viewer.hidden = true;
  lockScroll(false);
}
viewer.addEventListener('click', (e) => { if (e.target !== viewerImg) closeViewer(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !viewer.hidden) closeViewer(); });

// A poster with a numbered list of observations beside it.

function buildExhibit(section, poster, flip) {
  section.classList.toggle('flip', flip);
  section.append(el('h2', { class: 'reveal' }, poster.title));
  if (poster.intro) section.append(el('p', { class: 'intro reveal' }, poster.intro));

  const fig = el('figure', { class: 'poster reveal reveal-side' });
  const open = el('button', { type: 'button', class: 'poster-open', 'aria-label': `View ${poster.title} full screen` });
  open.append(el('img', {
    src: poster.image, alt: poster.alt, width: poster.width, height: poster.height,
    loading: 'lazy', decoding: 'async',
  }));
  open.addEventListener('click', () => openViewer(poster));
  fig.append(open);

  const list = el('ol', { class: 'obs' });
  for (const text of poster.observations) list.append(el('li', { class: 'reveal reveal-build' }, text));

  const workspace = el('div', { class: 'workspace' });
  workspace.append(fig, list);
  const cite = el('div', { class: 'cite reveal' });
  fillCite(cite, poster.citation);
  section.append(workspace, cite);
}

// The guess-then-reveal identifier. On phones the poster opens full screen
// and explanations pop up on the image instead of in the side note.

function buildActivity(section, poster) {
  const { width: W, height: H, tells } = poster;
  const cap = tells.length + 4;
  const pinR = W * 0.024;
  const pad = W * 0.012;

  const q = (sel) => section.querySelector(sel);
  const stage = q('.stage'), start = q('.start');
  const count = q('.count'), score = q('.score'), check = q('.check'), again = q('.again');
  const note = q('.note');

  const fig = q('.poster');
  fig.style.setProperty('--ratio', W / H);
  fig.append(el('img', { src: poster.image, alt: poster.alt, width: W, height: H, decoding: 'async' }));
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'overlay' }, fig);
  const ringLayer = svgEl('g', { class: 'rings' }, svg);
  const pinLayer = svgEl('g', { class: 'pins' }, svg);

  fillCite(q('.cite'), poster.citation);

  const pop = el('div', { class: 'popup', role: 'dialog', 'aria-live': 'polite', hidden: '' });
  pop.innerHTML = '<button type="button" class="round-close" aria-label="Close">&times;</button>'
    + '<p class="note-meta"><span class="pop-cat"></span> <span class="pop-status"></span></p>'
    + '<h3 class="note-title pop-title"></h3><p class="note-body pop-body"></p>';
  stage.append(pop);

  let pins = [];
  let revealed = false;
  let full = false;
  let found = new Set();
  let current = -1;
  const rings = [];

  const toImage = (e) => {
    const r = svg.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H];
  };

  const inShape = ([x, y], [sx, sy, sw, sh, deg = 0]) => {
    const cx = sx + sw / 2, cy = sy + sh / 2, a = -deg * Math.PI / 180;
    const dx = x - cx, dy = y - cy;
    const lx = dx * Math.cos(a) - dy * Math.sin(a);
    const ly = dx * Math.sin(a) + dy * Math.cos(a);
    return Math.abs(lx) <= sw / 2 + pad && Math.abs(ly) <= sh / 2 + pad;
  };
  const tellAt = (p) => tells.find((t) => t.shapes.some((s) => inShape(p, s)));

  function drawPins() {
    pinLayer.replaceChildren();
    pins.forEach((p, i) => {
      const state = revealed ? (tellAt(p) ? ' hit' : ' miss') : '';
      const g = svgEl('g', { class: 'pin' + state }, pinLayer);
      svgEl('circle', { cx: p[0], cy: p[1], r: pinR }, g);
      svgEl('text', { x: p[0], y: p[1], dy: '0.35em', 'font-size': pinR * 1.1 }, g).textContent = i + 1;
    });
    const left = cap - pins.length;
    count.textContent = `${left} ${left === 1 ? 'pin' : 'pins'} left`;
    check.disabled = pins.length === 0;
  }

  function enterFull() {
    full = true;
    section.classList.add('full');
    lockScroll(true);
    if (revealed) select(current < 0 ? 0 : current);
  }
  function exitFull() {
    full = false;
    hidePopup();
    section.classList.remove('full');
    lockScroll(false);
  }

  svg.addEventListener('click', (e) => {
    if (phone.matches && !full) { enterFull(); return; }
    if (revealed) return;
    const p = toImage(e);
    const near = pins.findIndex((o) => Math.hypot(o[0] - p[0], o[1] - p[1]) < pinR * 1.3);
    if (near >= 0) pins.splice(near, 1);
    else if (pins.length < cap) pins.push(p);
    drawPins();
  });

  function showPopup() {
    const t = tells[current];
    pop.querySelector('.pop-cat').textContent = t.category;
    pop.querySelector('.pop-status').textContent = found.has(t.id) ? '· you found this' : '· you missed this';
    pop.querySelector('.pop-title').textContent = t.title;
    pop.querySelector('.pop-body').textContent = t.body;
    pop.hidden = false;
    pop.scrollTop = 0;
    // Sit on whichever side of the ring has more room, and scroll inside
    // rather than cover the ring, unless the ring fills the screen.
    const r = rings[current].getBoundingClientRect();
    const bar = q('.controls').offsetHeight;
    const vw = innerWidth, vh = innerHeight;
    const below = vh - bar - 8 - (r.bottom + 10);
    const above = r.top - 10 - 8;
    pop.style.maxHeight = `${Math.max(180, Math.max(below, above))}px`;
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    const top = below >= above ? r.bottom + 10 : r.top - 10 - ph;
    pop.style.left = `${clamp(8, r.left + r.width / 2 - pw / 2, vw - pw - 8)}px`;
    pop.style.top = `${clamp(8, top, vh - bar - ph - 8)}px`;
  }
  function hidePopup() {
    pop.hidden = true;
    rings.forEach((g) => g.classList.remove('active'));
  }

  function select(i) {
    current = (i + tells.length) % tells.length;
    rings.forEach((g, j) => g.classList.toggle('active', j === current));
    const t = tells[current];
    q('.note-cat').textContent = t.category;
    q('.note-status').textContent = found.has(t.id) ? '· you found this' : '· you missed this';
    q('.note-title').textContent = t.title;
    q('.note-body').textContent = t.body;
    q('.note-pos').textContent = `${current + 1} / ${tells.length}`;
    note.hidden = false;
    if (full) showPopup();
  }

  // Inside full screen, a tap anywhere outside the popup and the rings closes it.
  stage.addEventListener('click', (e) => {
    if (!full || pop.hidden) return;
    if (e.target.closest('.ring')) return;
    if (pop.contains(e.target) && !e.target.closest('.round-close')) return;
    hidePopup();
  });

  function reveal() {
    revealed = true;
    found = new Set(pins.map(tellAt).filter(Boolean).map((t) => t.id));
    tells.forEach((t, i) => {
      const g = svgEl('g', {
        class: 'ring ' + (found.has(t.id) ? 'found' : 'missed'),
        tabindex: 0,
        role: 'button',
        'aria-label': `${t.title}, ${found.has(t.id) ? 'found' : 'missed'}`,
      }, ringLayer);
      t.shapes.forEach((s, j) => {
        const turn = `rotate(${s[4] || 0} ${s[0] + s[2] / 2} ${s[1] + s[3] / 2})`;
        svgEl('path', { d: ringPath(s, hash(t.id) + j, pad), pathLength: 1, transform: turn, style: `--delay:${i * 120}ms` }, g);
        svgEl('rect', { x: s[0], y: s[1], width: s[2], height: s[3], transform: turn, class: 'hit' }, g);
      });
      g.addEventListener('click', () => select(i));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); }
      });
      rings.push(g);
    });
    svg.classList.add('revealed');
    drawPins();
    score.textContent = `You found ${found.size} of ${tells.length}.`;
    count.hidden = true;
    check.hidden = true;
    again.hidden = false;
    start.textContent = 'See the answers';
    select(0);
  }

  function reset() {
    revealed = false;
    pins = [];
    found = new Set();
    current = -1;
    rings.length = 0;
    ringLayer.replaceChildren();
    svg.classList.remove('revealed');
    hidePopup();
    note.hidden = true;
    score.textContent = '';
    count.hidden = false;
    check.hidden = false;
    again.hidden = true;
    start.textContent = 'Tap to start';
    drawPins();
  }

  check.addEventListener('click', reveal);
  again.addEventListener('click', reset);
  start.addEventListener('click', enterFull);
  q('.stage-close').addEventListener('click', exitFull);
  q('.note-prev').addEventListener('click', () => select(current - 1));
  q('.note-next').addEventListener('click', () => select(current + 1));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !full) return;
    if (!pop.hidden) hidePopup();
    else exitFull();
  });
  phone.addEventListener('change', () => { if (!phone.matches && full) exitFull(); });

  drawPins();
}

// Scroll-in: anything marked .reveal fades and slides into place the first
// time it enters the viewport. Items arriving together are staggered.

const io = new IntersectionObserver((entries) => {
  let k = 0;
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.style.transitionDelay = `${k++ * 80}ms`;
    e.target.classList.add('in');
    io.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

const watch = () => document.querySelectorAll('.reveal:not(.in)').forEach((n) => io.observe(n));
watch();

fetch('data/posters.json')
  .then((r) => r.json())
  .then(({ posters }) => {
    let n = 0;
    for (const section of document.querySelectorAll('[data-poster]')) {
      const poster = posters.find((p) => p.id === section.dataset.poster);
      if (!poster) continue;
      if (section.classList.contains('activity')) buildActivity(section, poster);
      else buildExhibit(section, poster, n % 2 === 1);
      n++;
    }
    watch();
  });
