/* ============================================================
   The recap: a receipt built from what the reader actually did
   ------------------------------------------------------------
   Reads the page's progress record and writes one line per
   activity, in the reader's own choices. Updates live as more
   gets done. A copy button puts the lines on the clipboard as
   plain text. When everything is done, a short burst of token
   chips falls once.

   Data: data/recap.json. Pure: buildLines().
   ============================================================ */

import { load, reset } from './progress.js';

/** The screens that count as activities. Screen 5 joins when it exists. */
export const ACTIVITY_SCREENS = ['s2', 's3', 's4', 's6', 's7'];

function fill(tpl, vars) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? '' : String(vars[k])));
}

function list(items) {
  const a = items.filter(Boolean);
  if (a.length <= 1) return a.join('');
  return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
}

/** Pure: the recap lines for a progress record, in page order. */
export function buildLines(p, S) {
  const L = S.lines;
  const out = [];
  const ans = p.answers || {};
  if (p.done.s2) out.push(fill(L.s2, { reached: ans.s2?.reached ?? '' }));
  if (p.done.s3) out.push(fill(L.s3, { trusted: ans.s3?.trusted ?? '' }));
  if (ans['branch-2023']) out.push(fill(L['branch-2023'], { branch: ans['branch-2023'] }));
  if (p.done.s4) {
    const cards = (ans.s4?.cards || []).map((c) => `${c.text.replace(/\?$/, '')}: ${S.outcomes[c.outcome] || c.outcome}`);
    out.push(cards.length ? fill(L.s4, { n: cards.length, cards: cards.join('; ') }) : L.s4short);
  }
  if (p.done.s6) {
    const stickers = (ans.s6?.stickers || []).map((s) => s.toLowerCase());
    out.push(stickers.length ? fill(L.s6, { stickers: list(stickers) }) : L.s6short);
  }
  if (p.done.s7) {
    const names = ans.s7?.names || [];
    out.push(names.length ? fill(L.s7, { n: names.length, names: list(names) }) : L.s7short);
  }
  return out;
}

/** Pure: how many activities are left. */
export function remaining(p, screens = ACTIVITY_SCREENS) {
  return screens.filter((id) => !p.done[id]).length;
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/** A one-off burst of token chips inside `host`. */
function burst(host, hues) {
  const canvas = document.createElement('canvas');
  canvas.className = 'recap-burst';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = host.clientWidth, h = host.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const chips = Array.from({ length: 70 }, () => ({
    x: w / 2 + (Math.random() - 0.5) * 80, y: h * 0.6,
    vx: (Math.random() - 0.5) * 520, vy: -380 - Math.random() * 360,
    r: (Math.random() - 0.5) * 6, w: 14 + Math.random() * 22, hgt: 8 + Math.random() * 6,
    hue: hues[Math.floor(Math.random() * hues.length)], a: 1,
  }));
  let last = performance.now();
  const t0 = last;
  const tick = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    ctx.clearRect(0, 0, w, h);
    for (const c of chips) {
      c.vy += 900 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.a = Math.max(0, 1 - (t - t0) / 1800);
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.r * (t - t0) / 1000);
      ctx.fillStyle = `oklch(72% 0.16 ${c.hue} / ${c.a})`;
      ctx.beginPath(); ctx.roundRect(-c.w / 2, -c.hgt / 2, c.w, c.hgt, 3); ctx.fill();
      ctx.restore();
    }
    if (t - t0 < 1800) requestAnimationFrame(tick); else canvas.remove();
  };
  requestAnimationFrame(tick);
}

export async function mountRecap(root, { reducedMotion = false, url = './data/recap.json', gsap = window.gsap, hues = [232, 285, 22, 48, 150, 195, 325, 75] } = {}) {
  const data = await (await fetch(url)).json();
  const S = data.strings;
  root.classList.add('recap');

  const card = el('div', 'recap-card');
  const listEl = el('ol', 'recap-list');
  const empty = el('p', 'recap-empty', S.empty);
  const foot = el('div', 'recap-foot tp-scope');
  const count = el('p', 'recap-count');
  const copy = el('button', 'tp-btn', S.copy);
  copy.type = 'button';
  const clear = el('button', 'tp-btn recap-clear', S.clear);
  clear.type = 'button';
  foot.append(count, copy, clear);
  card.append(empty, listEl, foot);
  root.appendChild(card);

  let lines = [];
  let celebrated = false;
  const render = (p = load()) => {
    const next = buildLines(p, S);
    const fresh = next.filter((l) => !lines.includes(l));
    lines = next;
    listEl.innerHTML = '';
    for (const line of lines) {
      const li = el('li', 'recap-line', line);
      if (fresh.includes(line)) li.classList.add('is-new');
      listEl.appendChild(li);
    }
    empty.hidden = lines.length > 0;
    copy.disabled = lines.length === 0;
    const left = remaining(p);
    count.textContent = left === 0 ? S.allDone : fill(S.remaining, { n: left });
    root.classList.toggle('is-complete', left === 0);
    if (gsap && !reducedMotion && fresh.length) {
      gsap.from(listEl.querySelectorAll('.is-new'), { x: -12, opacity: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' });
    }
    if (left === 0 && !celebrated && lines.length) {
      celebrated = true;
      if (!reducedMotion) burst(card, hues);
    }
  };

  copy.addEventListener('click', async () => {
    const text = lines.map((l, i) => `${i + 1}. ${l}`).join('\n');
    try { await navigator.clipboard.writeText(text); copy.textContent = S.copied; } catch { copy.textContent = S.copy; }
    setTimeout(() => { copy.textContent = S.copy; }, 1600);
  });
  clear.addEventListener('click', () => { celebrated = false; reset(); });

  document.addEventListener('ai:progress', (e) => render(e.detail));
  render();
  return { render };
}

/** Screen 9: the band slides in from the right as it enters. */
export function mountNextBand(root, { reducedMotion = false, gsap = window.gsap } = {}) {
  if (reducedMotion || !gsap) return;
  gsap.set(root, { x: 80, opacity: 0 });
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.disconnect();
      gsap.to(root, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
    }
  }, { threshold: 0.3 });
  io.observe(root);
  setTimeout(() => { if (root.getBoundingClientRect().top < window.innerHeight) { io.disconnect(); gsap.to(root, { x: 0, opacity: 1, duration: 0.7 }); } }, 1500);
}
