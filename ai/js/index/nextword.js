/* ============================================================
   Screen 5: the next word, the probability race
   ------------------------------------------------------------
   The sentence types itself out and stops at the hidden word.
   Five chips: the sentence's word plus the model's top picks.
   The reader taps one; bars race out for all twelve recorded
   pieces plus "Other potential choices" (what is left of 100%), on
   one 0 to 100% scale, the numbers counting up. The reader's
   pick is outlined, the model's top pulses, a match gets a
   small burst of chips. Pieces are shown as the model sees
   them, with a leading space drawn as ␣, as in the rain on
   screen 1. A lesson from data/next-word-sentences.json says
   what this sentence's numbers show.

   Then the reader can let the model pick: a weighted random
   draw from the same numbers, the way a chatbot writes. Each
   pick fills the blank and adds to a count on its bar. Under
   reduced motion the bars are already out, the chips are
   disabled, and a pick lands without the flicker.

   Data: data/next-word.json, probabilities recorded from a
   local Qwen3-1.7B with the model, file and date. The numbers
   on screen are that file's numbers, and the source line reads
   the model and the date from it. The draws happen in the
   browser; only the odds are recorded.
   ============================================================ */

import { markDone } from '../progress.js';
import { typeInto } from '../typed.js';

const STRINGS = {
  prompt: 'What comes next? Pick one.',
  next: 'Next sentence',
  again: 'Go again',
  match: 'You picked the model\u2019s own top word. It put {prob} on \u201c{word}\u201d.',
  result: 'The model\u2019s top word was \u201c{top}\u201d ({topProb}). It put {pickProb} on \u201c{pick}\u201d.',
  oddsHead: 'The model\u2019s chances for the next piece',
  spaceKey: '\u2423 is a space',
  rest: 'Other potential choices',
  rollIntro: 'A chatbot does not always write its top piece. It picks at random, weighted by chances like these, so a piece with 40% comes up about 4 times in 10.',
  roll: 'Let the model pick',
  roll20: 'Pick 20 times',
  rolled: 'This time it picked \u201c{piece}\u201d. Picks so far: {n}.',
  rolledRest: 'This time it picked a piece outside its top 12, and the recording does not say which. Picks so far: {n}.',
  rolledMany: 'Twenty more picks. Picks so far: {n}.',
  done: 'That is all four sentences. A chatbot writes a whole answer this way, picking one piece at a time and adding it to the text before it picks the next. The chances stay the same, but the picks do not, which is why the same question can get a different answer.',
  src: 'Numbers recorded from {model} on {date}. The picks happen in your browser, weighted by those numbers.',
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

/** Pure: a bar's fill width in percent, on one 0 to 100% scale
 *  for every bar, so a sure model and an unsure one look it.
 *  (The CSS gives a fill a hairline minimum so tiny bars show.) */
export function barWidth(prob) {
  if (prob == null || !Number.isFinite(prob)) return 0;
  return Math.max(0, Math.min(100, prob * 100));
}

/** Pure: a token as the model sees it. " jam" -> "␣jam". */
export function showPiece(token) {
  return String(token).replace(/^ /, '\u2423');
}

/** Pure: what is left of 100% after the recorded top list. The
 *  numbers are over the model's full vocabulary, so this is the
 *  chance it gave to every piece that did not make the list. */
export function restProb(top) {
  const sum = top.reduce((a, t) => a + (t.prob || 0), 0);
  return Math.max(0, 1 - sum);
}

/** Pure: the index a weighted draw lands on. `r` is in [0, 1);
 *  the weights need not sum to 1. */
export function rollIndex(weights, r) {
  const total = weights.reduce((a, w) => a + w, 0);
  let x = r * total;
  for (let i = 0; i < weights.length; i++) {
    x -= weights[i];
    if (x < 0) return i;
  }
  return weights.length - 1;
}

/** Pure: the values a lesson's {placeholders} are filled with,
 *  all read from the recorded sentence. */
export function lessonVars(s) {
  const top = s.top[0];
  const hidden = s.candidates.find((c) => c.isHidden);
  const covered = s.top.reduce((a, t) => a + t.prob, 0);
  const digits = s.top.filter((t) => /^\d+$/.test(t.token)).reduce((a, t) => a + t.prob, 0);
  return {
    top: top.token.trim(),
    topProb: fmtProb(top.prob),
    hidden: s.hidden,
    hiddenProb: fmtProb(hidden && hidden.prob),
    rank: s.hiddenRank,
    covered: fmtProb(covered),
    rest: fmtProb(restProb(s.top)),
    digits: fmtProb(digits),
  };
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

export async function mountNextword(root, {
  reducedMotion = false,
  url = './data/next-word.json',
  lessonsUrl = './data/next-word-sentences.json',
  gsap = window.gsap,
} = {}) {
  const [data, input] = await Promise.all([url, lessonsUrl].map(async (u) => (await fetch(u)).json()));
  const sentences = data.sentences;
  const lessons = Object.fromEntries((input.sentences || []).map((s) => [s.id, s.lesson]));
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
  const status = el('p', 'nw-status', STRINGS.prompt);
  status.setAttribute('aria-live', 'polite');

  // after the pick: the odds on one side, the lesson and the draw on the other
  const result = el('div', 'nw-result');
  result.hidden = true;
  const odds = el('div', 'nw-odds');
  const oddsHead = el('p', 'nw-odds-head', STRINGS.oddsHead);
  oddsHead.append(el('span', 'nw-key', STRINGS.spaceKey));
  const bars = el('div', 'nw-bars');
  odds.append(oddsHead, bars);
  const side = el('div', 'nw-side');
  const lesson = el('p', 'nw-lesson');
  const roll = el('div', 'nw-roll tp-scope');
  const rollIntro = el('p', 'nw-roll-intro', STRINGS.rollIntro);
  const rollBar = el('div', 'nw-roll-bar');
  const rollOne = el('button', 'tp-btn nw-roll-btn', STRINGS.roll);
  rollOne.type = 'button';
  const rollMany = el('button', 'tp-btn', STRINGS.roll20);
  rollMany.type = 'button';
  rollBar.append(rollOne, rollMany);
  const rollStatus = el('p', 'nw-roll-status');
  rollStatus.setAttribute('aria-live', 'polite');
  roll.append(rollIntro, rollBar, rollStatus);
  side.append(lesson, roll);
  result.append(odds, side);

  const foot = el('div', 'nw-foot tp-scope');
  const src = el('p', 'nw-src', srcLine);
  const next = el('button', 'tp-btn', STRINGS.next);
  next.type = 'button';
  next.hidden = true;
  foot.append(src, next);
  card.append(sentence, chips, status, result, foot);
  root.appendChild(card);

  const screenId = root.closest('.screen')?.id || 's5';
  let idx = 0;
  const picks = [];
  let matched = 0;
  let finished = false;
  let rows = [];      // this sentence's bars: { piece, prob, row, fillEl, num, count, n }
  let rollCount = 0;
  let rolling = false;
  let gen = 0;        // bumped per sentence, so a pick still in flight cannot land on the next one

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
    rows = [];
    rollCount = 0;
    gen += 1;
    rolling = false;
    rollOne.disabled = rollMany.disabled = true;
    result.hidden = true;
    rollStatus.textContent = '';
    slot.textContent = '____';
    slot.classList.remove('is-filled', 'is-rolled');
    lesson.textContent = fill(lessons[s.id] || '', lessonVars(s));
    lesson.hidden = !lessons[s.id];
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
      const still = s.candidates.find((c) => c.isHidden) || s.candidates[0];
      pick(s, still, chipsEls.find((b) => b.dataset.word === still.word), true);
      return;
    }

    text.removeAttribute('data-typed'); // typeInto remembers its text there
    text.textContent = s.prefix; // typeInto reads the element's text, then types it
    typeInto(text, { cps: 30 });
    text.addEventListener('typed:done', () => {
      if (gsap) gsap.from(chipsEls, { y: 14, opacity: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(1.6)' });
    }, { once: true });
  }

  function barRow(piece, prob, cls) {
    const row = el('div', 'nw-bar' + (cls ? ' ' + cls : ''));
    const word = el('span', 'nw-bar-word', piece);
    const track = el('div', 'nw-bar-track');
    const fillEl = el('div', 'nw-bar-fill');
    track.appendChild(fillEl);
    const num = el('span', 'nw-bar-num', '0%');
    const count = el('span', 'nw-bar-count');
    row.append(word, track, num, count);
    bars.appendChild(row);
    return { piece, prob, row, fillEl, num, count, n: 0 };
  }

  function pick(s, c, chipEl, still = false) {
    if (finished) return;
    for (const b of chips.querySelectorAll('.nw-chip')) b.disabled = true;
    chipEl.classList.add('is-picked');

    // the recorded top list is already in the model's order; what is left of 100% goes last
    rows = s.top.map((t) => Object.assign(barRow(showPiece(t.token), t.prob), { token: t.token }));
    rows.push(barRow(STRINGS.rest, restProb(s.top), 'is-rest'));
    const topRow = rows[0];
    const pickedRow = rows.find((r) => r.token === c.token);
    const isMatch = c.isTop;
    result.hidden = false;

    const finish = () => {
      topRow.row.classList.add('is-top');
      if (pickedRow) pickedRow.row.classList.add('is-picked');
      slot.textContent = s.hidden;
      slot.classList.add('is-filled');
      const top = s.candidates.find((x) => x.isTop);
      status.textContent = isMatch
        ? fill(STRINGS.match, { prob: fmtProb(c.prob), word: c.word })
        : fill(STRINGS.result, {
            top: top.word, topProb: fmtProb(top.prob),
            pick: c.word, pickProb: fmtProb(c.prob),
          });
      rollOne.disabled = rollMany.disabled = false;
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
      rows.forEach((r) => { r.fillEl.style.width = barWidth(r.prob) + '%'; r.num.textContent = fmtProb(r.prob); });
      finish();
      return;
    }

    gsap.from([odds, side], { y: 12, opacity: 0, duration: 0.45, stagger: 0.12, ease: 'power2.out' });
    rows.forEach((r, i) => {
      gsap.to(r.fillEl, { width: barWidth(r.prob) + '%', duration: 0.9, delay: i * 0.05, ease: 'power2.out' });
      const proxy = { v: 0 };
      gsap.to(proxy, {
        v: 1, duration: 0.9, delay: i * 0.05, ease: 'power2.out',
        onUpdate: () => { r.num.textContent = fmtProb(r.prob * proxy.v); },
      });
    });
    const total = 0.9 + (rows.length - 1) * 0.05;
    if (isMatch) {
      const r = chipEl.getBoundingClientRect(), cr = card.getBoundingClientRect();
      burst(card, r.left - cr.left + r.width / 2, r.top - cr.top + r.height / 2, gsap);
    }
    setTimeout(finish, total * 1000 + 60);
  }

  /* ---------- letting the model pick ---------- */

  function land(r, times = 1) {
    r.n += times;
    r.count.textContent = '\u00d7' + r.n;
    rollCount += times;
    slot.textContent = r.row.classList.contains('is-rest') ? '\u2026' : (r.token.trim() || '\u2423');
    slot.classList.add('is-rolled');
    for (const x of rows) x.row.classList.remove('is-rolling', 'is-landed');
    r.row.classList.add('is-landed');
  }

  function draw() {
    return rows[rollIndex(rows.map((r) => r.prob), Math.random())];
  }

  rollOne.addEventListener('click', () => {
    if (rolling || !rows.length) return;
    const r = draw();
    const g = gen;
    const done = () => {
      land(r);
      rollStatus.textContent = r.row.classList.contains('is-rest')
        ? fill(STRINGS.rolledRest, { n: rollCount })
        : fill(STRINGS.rolled, { piece: r.piece, n: rollCount });
    };
    if (reducedMotion) { done(); return; }
    // a short flicker down the bars before the pick lands
    rolling = true;
    rollOne.disabled = rollMany.disabled = true;
    const steps = [40, 50, 60, 75, 95, 120, 150];
    let t = 0;
    steps.forEach((ms, i) => {
      t += ms;
      setTimeout(() => {
        if (g !== gen) return;
        for (const x of rows) x.row.classList.remove('is-rolling');
        rows[Math.floor(Math.random() * rows.length)].row.classList.add('is-rolling');
        if (i === steps.length - 1) {
          setTimeout(() => {
            if (g !== gen) return;
            done();
            rolling = false;
            rollOne.disabled = rollMany.disabled = false;
          }, 160);
        }
      }, t);
    });
  });

  rollMany.addEventListener('click', () => {
    if (rolling || !rows.length) return;
    for (let i = 0; i < 20; i++) land(draw());
    rollStatus.textContent = fill(STRINGS.rolledMany, { n: rollCount });
  });

  render();
  return { reset };
}
