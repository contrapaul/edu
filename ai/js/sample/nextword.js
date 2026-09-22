/* ============================================================
   Screen 5: the next word, the probability race
   ------------------------------------------------------------
   The sentence types itself out and stops at the hidden word.
   Five chips: the sentence's word plus the model's top picks.
   The reader taps one; the bars race out to each candidate's
   recorded probability, the numbers count up. The reader's
   pick is outlined, the model's top pulses, a match gets a
   small burst of chips. Under reduced motion the bars are
   already out and the chips are disabled.

   Data: data/next-word.json, probabilities recorded from a
   local Qwen3-1.7B with the model, file and date. The numbers
   on screen are that file's numbers, and the source line reads
   the model and the date from it.
   ============================================================ */

import { markDone } from '../progress.js';
import { typeInto } from './typed.js';

const STRINGS = {
  prompt: 'What comes next? Pick one.',
  next: 'Next sentence',
  again: 'Go again',
  match: 'You picked the model\u2019s own top word. It put {prob} on \u201c{word}\u201d.',
  result: 'The model\u2019s top word was \u201c{top}\u201d ({topProb}). It put {pickProb} on \u201c{pick}\u201d.',
  done: 'That is all four sentences. Same model, same numbers, every time you run it.',
  src: 'Probabilities from {model}, {date}. Each bar is how likely the model thought that token was, not a share of 100%.',
};

function fill(tpl, vars) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? '' : String(vars[k])));
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/** Pure: 0.7746 -> "77%", 0.0825 -> "8.3%", 0.0067 -> "0.67%". */
export function fmtProb(p) {
  if (p == null || !Number.isFinite(p)) return '?';
  const pct = p * 100;
  if (pct >= 10) return pct.toFixed(0) + '%';
  if (pct >= 1) return pct.toFixed(1) + '%';
  return pct.toFixed(2) + '%';
}

/** Pure: the fill width for a bar, relative to the sentence's
 *  largest probability, with a 2% floor so tiny bars still read. */
export function barWidth(prob, max) {
  if (prob == null || !max || max <= 0) return 0;
  return Math.max(2, Math.min(100, (prob / max) * 100));
}

/** A small burst of token chips from a point inside the card. */
function burst(card, x, y, gsap) {
  if (!gsap) return;
  for (let i = 0; i < 12; i++) {
    const c = el('span', 'nw-burst-chip');
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    card.appendChild(c);
    const a = (Math.PI * 2 * i) / 12 + Math.random();
    gsap.to(c, {
      x: Math.cos(a) * (60 + Math.random() * 90),
      y: Math.sin(a) * (40 + Math.random() * 60) - 40,
      rotation: (Math.random() - 0.5) * 180,
      opacity: 0,
      duration: 0.9 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete: () => c.remove(),
    });
  }
}

export async function mountNextword(root, { reducedMotion = false, url = './data/next-word.json', gsap = window.gsap } = {}) {
  const data = await (await fetch(url)).json();
  const sentences = data.sentences;
  const srcLine = fill(STRINGS.src, { model: data.model.file, date: data.model.capturedOn });

  root.classList.add('nw');
  const card = el('div', 'nw-card');
  const sentence = el('p', 'nw-sentence');
  const text = el('span', 'nw-text');
  const slot = el('span', 'nw-slot');
  sentence.append(text, slot);
  const chips = el('div', 'nw-chips');
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', 'The next word, pick one');
  const bars = el('div', 'nw-bars');
  const status = el('p', 'nw-status', STRINGS.prompt);
  status.setAttribute('aria-live', 'polite');
  const note = el('p', 'nw-note');
  note.hidden = true;
  const foot = el('div', 'nw-foot tp-scope');
  const src = el('p', 'nw-src', srcLine);
  const next = el('button', 'tp-btn', STRINGS.next);
  next.type = 'button';
  next.hidden = true;
  foot.append(src, next);
  card.append(sentence, chips, bars, status, note, foot);
  root.appendChild(card);

  const screenId = root.closest('.screen')?.id || 's5';
  let idx = 0;
  const picks = [];
  let matched = 0;
  let finished = false;

  function reset() {
    idx = 0;
    picks.length = 0;
    matched = 0;
    finished = false;
    next.hidden = true;
    next.textContent = STRINGS.next;
    render();
  }
  next.addEventListener('click', () => { if (finished) { reset(); return; } idx += 1; render(); });

  function render() {
    const s = sentences[idx];
    chips.innerHTML = '';
    bars.innerHTML = '';
    slot.textContent = '____';
    slot.classList.remove('is-filled');
    note.hidden = true;
    note.textContent = s.note || '';
    status.textContent = STRINGS.prompt;
    next.hidden = true;

    const chipsEls = s.candidates.map((c) => {
      const b = el('button', 'nw-chip', c.word);
      b.type = 'button';
      b.dataset.word = c.word;
      b.addEventListener('click', () => pick(s, c, b));
      chips.appendChild(b);
      return b;
    });

    if (reducedMotion) {
      text.textContent = s.prefix;
      const stillChip = chipsEls.find((b) => b.dataset.word === (s.candidates.find((c) => c.isHidden) || s.candidates[0]).word);
      pick(s, s.candidates.find((c) => c.isHidden) || s.candidates[0], stillChip, true);
      return;
    }

    text.removeAttribute('data-typed'); // typeInto remembers its text there
    text.textContent = s.prefix; // typeInto reads the element's text, then types it
    typeInto(text, { cps: 30 });
    text.addEventListener('typed:done', () => {
      if (gsap) gsap.from(chipsEls, { y: 14, opacity: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(1.6)' });
    }, { once: true });
  }

  function pick(s, c, chipEl, still = false) {
    if (finished) return;
    for (const b of chips.querySelectorAll('.nw-chip')) b.disabled = true;
    chipEl.classList.add('is-picked');

    const rows = [...s.candidates].sort((a, b) => b.prob - a.prob).map((cand) => {
      const row = el('div', 'nw-bar');
      const word = el('span', 'nw-bar-word', cand.word);
      const track = el('div', 'nw-bar-track');
      const fillEl = el('div', 'nw-bar-fill');
      track.appendChild(fillEl);
      const num = el('span', 'nw-bar-num', '0%');
      row.append(word, track, num);
      bars.appendChild(row);
      return { cand, row, fillEl, num };
    });
    const topCand = rows.find((r) => r.cand.isTop);
    const pickedRow = rows.find((r) => r.cand.word === c.word);
    const isMatch = c.isTop;
    const maxProb = rows[0].cand.prob;
    const targets = rows.map((r) => barWidth(r.cand.prob, maxProb));

    const finish = () => {
      if (topCand) topCand.row.classList.add('is-top');
      if (pickedRow) pickedRow.row.classList.add('is-picked');
      slot.textContent = s.hidden;
      slot.classList.add('is-filled');
      if (note.textContent) note.hidden = false;
      status.textContent = isMatch
        ? fill(STRINGS.match, { prob: fmtProb(c.prob), word: c.word })
        : fill(STRINGS.result, {
            top: topCand.cand.word, topProb: fmtProb(topCand.cand.prob),
            pick: c.word, pickProb: fmtProb(c.prob),
          });
      picks.push(c.word);
      matched += isMatch ? 1 : 0;
      if (idx === sentences.length - 1) {
        finished = true;
        status.textContent += ' ' + STRINGS.done; // the last result is the point; keep it
        next.textContent = STRINGS.again;
        markDone(screenId, { picks, matched, total: sentences.length });
      }
      next.hidden = false;
    };

    if (still || !gsap) {
      rows.forEach((r, i) => { r.fillEl.style.width = targets[i] + '%'; r.num.textContent = fmtProb(r.cand.prob); });
      finish();
      return;
    }

    rows.forEach((r, i) => {
      gsap.to(r.fillEl, { width: targets[i] + '%', duration: 0.9, delay: i * 0.08, ease: 'power2.out' });
      const proxy = { v: 0 };
      gsap.to(proxy, {
        v: 1, duration: 0.9, delay: i * 0.08, ease: 'power2.out',
        onUpdate: () => { r.num.textContent = fmtProb(r.cand.prob * proxy.v); },
      });
    });
    const total = 0.9 + (rows.length - 1) * 0.08;
    if (isMatch) {
      const r = chipEl.getBoundingClientRect(), cr = card.getBoundingClientRect();
      burst(card, r.left - cr.left + r.width / 2, r.top - cr.top + r.height / 2, gsap);
    }
    setTimeout(finish, total * 1000 + 60);
  }

  render();
  return { reset };
}
