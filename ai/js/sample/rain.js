/* ============================================================
   Token rain: the words of this page, as a model sees them,
   falling slowly behind the hero.
   ------------------------------------------------------------
   Each chip is a real token piece with its real id (see
   data/tokens-page1.json for provenance). Canvas, capped chip
   count, DPR capped at 2, paused when the hero is off screen or
   the tab is hidden. Scroll speed stretches and hurries the rain.
   Under reduced motion the chips are drawn once, still.
   ============================================================ */

const CHIP_FONT = '500 11px "IBM Plex Sans", system-ui, sans-serif';
const ID_FONT = '400 9px "JetBrains Mono", ui-monospace, monospace';

function readHue(el) {
  const v = getComputedStyle(el).getPropertyValue('--hue').trim();
  return Number(v) || 230;
}

function isDark() {
  const t = document.documentElement.getAttribute('data-theme');
  if (t) return t === 'dark';
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

export function mountRain(host, { reducedMotion = false, url = './data/tokens-page1.json' } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'rain';
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let chips = [];
  let w = 0, h = 0, dpr = 1;
  let running = false;
  let raf = null;
  let last = 0;
  let scrollV = 0;          // px per frame, decays
  let lastScrollY = window.scrollY;

  const count = () => {
    const area = w * h;
    const n = Math.round(area / 9000);          // one chip per ~95px square
    return Math.max(40, Math.min(w < 700 ? 70 : 180, n));
  };

  const resize = () => {
    const r = host.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const measure = (text) => {
    ctx.font = CHIP_FONT;
    return ctx.measureText(text).width;
  };

  const spawn = (piece, fromTop) => {
    const [text, id] = piece;
    const label = text.replace(/^ /, '␣');   // show the leading space the model keeps
    const tw = measure(label);
    return {
      text: label, id: String(id),
      w: tw + 18, hgt: 24,
      x: Math.random() * (w + 60) - 30,
      y: fromTop ? -30 - Math.random() * 80 : Math.random() * h,
      vy: 10 + Math.random() * 18,             // px per second
      vx: (Math.random() - 0.5) * 6,
      a: 0.22 + Math.random() * 0.3,
      s: 0.8 + Math.random() * 0.3,
    };
  };

  let pieces = [];
  const seed = () => {
    chips = [];
    if (!pieces.length) return;
    const n = count();
    for (let i = 0; i < n; i++) chips.push(spawn(pieces[i % pieces.length], false));
  };

  const draw = (dt) => {
    ctx.clearRect(0, 0, w, h);
    const hue = readHue(host);
    const dark = isDark();
    const fill = dark ? `oklch(38% 0.08 ${hue} / ` : `oklch(80% 0.09 ${hue} / `;
    const ink = dark ? `oklch(88% 0.05 ${hue} / ` : `oklch(35% 0.12 ${hue} / `;
    const stretch = 1 + Math.min(2.5, Math.abs(scrollV) / 22);
    const hurry = 1 + Math.min(6, Math.abs(scrollV) / 10);

    for (const c of chips) {
      if (dt) {
        c.y += c.vy * hurry * dt;
        c.x += c.vx * dt;
        if (c.y > h + 40) {
          const np = spawn(pieces[Math.floor(Math.random() * pieces.length)], true);
          Object.assign(c, np);
        }
      }
      const cw = c.w * c.s, ch = c.hgt * c.s * stretch;
      const x = c.x, y = c.y;
      ctx.beginPath();
      ctx.roundRect(x, y, cw, ch, 6 * c.s);
      ctx.fillStyle = fill + (c.a * 0.55) + ')';
      ctx.fill();
      ctx.font = CHIP_FONT;
      ctx.fillStyle = ink + c.a + ')';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.text, x + 8 * c.s, y + ch / 2);
      ctx.font = ID_FONT;
      ctx.fillStyle = ink + (c.a * 0.7) + ')';
      ctx.fillText(c.id, x + cw + 4, y + ch / 2);
    }
  };

  const frame = (t) => {
    raf = null;
    if (!running) return;
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    const sy = window.scrollY;
    scrollV = scrollV * 0.85 + (sy - lastScrollY) * 0.15;
    lastScrollY = sy;
    draw(dt);
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || reducedMotion) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  };

  // visibility: only animate while the hero is on screen and the tab is shown
  const onScreen = () => {
    const r = host.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };
  const check = () => { if (onScreen() && document.visibilityState !== 'hidden') start(); else stop(); };
  window.addEventListener('scroll', check, { passive: true });
  document.addEventListener('visibilitychange', check);
  window.addEventListener('resize', () => { resize(); seed(); if (reducedMotion) draw(0); });
  document.addEventListener('ai:theme', () => { if (reducedMotion) draw(0); });

  resize();
  fetch(url).then((r) => r.json()).then((data) => {
    pieces = (data.tokens || []).filter((p) => p[0] && p[0].trim());
    seed();
    if (reducedMotion) draw(0); else check();
  }).catch(() => { /* no rain, no harm */ });

  return { start, stop, canvas };
}
