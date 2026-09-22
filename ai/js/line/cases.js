/* ============================================================
   Three cases from a teacher
   ------------------------------------------------------------
   Each case in three beats: what happened, why, then a question
   to the reader ("what would you have done?") that has to be
   answered before the pushback is shown. The answers stay on
   this device. Seeing all three pushbacks marks the section done.

   Data: data/cases.json, written in the teacher's first person
   and meant to be edited in place.
   ============================================================ */

import { load, markDone, setAnswer } from '../progress.js';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/** Pure: which cases have been answered, from a progress record. */
export function answeredCases(progress, ids, key) {
  const a = (progress.answers || {})[key] || {};
  return ids.filter((id) => a[id] && a[id].choice != null);
}

export async function mountCases(root, { url = './data/cases.json', gsap = window.gsap, reducedMotion = false } = {}) {
  const data = await (await fetch(url)).json();
  const S = data.strings;
  const key = root.closest('section')?.id || 'cases';
  root.classList.add('cases', 'tp-scope');
  root.appendChild(el('p', 'cases-intro', S.intro));

  const saved = { ...((load().answers || {})[key] || {}) };
  const save = () => {
    setAnswer(key, saved);
    if (data.cases.every((c) => saved[c.id]?.revealed)) markDone(key, saved);
  };

  const tabs = el('div', 'cases-tabs');
  tabs.setAttribute('role', 'tablist');
  const panels = el('div', 'cases-panels');
  root.append(tabs, panels);

  const panelEls = data.cases.map((c, i) => {
    const tab = el('button', 'cases-tab', `${i + 1}. ${c.title}`);
    tab.type = 'button'; tab.setAttribute('role', 'tab'); tab.id = `case-tab-${c.id}`;
    tabs.appendChild(tab);

    const panel = el('article', 'case');
    panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', tab.id);
    panel.hidden = true;

    panel.appendChild(el('h3', 'case-title', c.title));
    const happened = el('div', 'case-part');
    happened.appendChild(el('p', 'case-label', S.happened));
    for (const p of c.happened) happened.appendChild(el('p', 'case-p', p));
    panel.appendChild(happened);

    const why = el('div', 'case-part');
    why.appendChild(el('p', 'case-label', S.why));
    const ul = el('ul', 'case-why');
    for (const w of c.why) ul.appendChild(el('li', null, w));
    why.appendChild(ul);
    panel.appendChild(why);

    // the reader's move
    const ask = el('div', 'case-ask');
    ask.appendChild(el('p', 'case-label', S.ask));
    const opts = el('div', 'case-options');
    const state = saved[c.id] || {};
    S.options.forEach((label, oi) => {
      const b = el('button', 'tp-btn tp-btn--option', label); b.type = 'button';
      if (state.choice === oi) b.classList.add('is-picked');
      b.addEventListener('click', () => {
        saved[c.id] = { ...(saved[c.id] || {}), choice: oi };
        for (const x of opts.querySelectorAll('button')) x.classList.toggle('is-picked', x === b);
        reveal.disabled = false;
        save();
      });
      opts.appendChild(b);
    });
    const words = document.createElement('textarea');
    words.className = 'case-words'; words.rows = 2; words.placeholder = S.yourWords; words.value = state.words || '';
    words.addEventListener('input', () => { saved[c.id] = { ...(saved[c.id] || {}), words: words.value }; save(); });
    const reveal = el('button', 'tp-btn tp-btn--play', S.reveal); reveal.type = 'button';
    reveal.disabled = state.choice == null;
    ask.append(opts, words, reveal);
    panel.appendChild(ask);

    // the pushback, hidden until asked for
    const push = el('div', 'case-push');
    push.hidden = !state.revealed;
    push.appendChild(el('p', 'case-label', S.pushback));
    for (const pb of c.pushback) {
      const item = el('div', 'case-pb');
      item.appendChild(el('p', 'case-pb-q', pb.q));
      const a = el('p', 'case-pb-a');
      a.append(el('span', 'case-pb-alabel', S.response + ' '), document.createTextNode(pb.a));
      item.appendChild(a);
      push.appendChild(item);
    }
    const next = el('button', 'tp-btn case-next', S.next); next.type = 'button';
    if (i === data.cases.length - 1) next.hidden = true;
    next.addEventListener('click', () => show(i + 1));
    push.appendChild(next);
    panel.appendChild(push);
    if (state.revealed) reveal.hidden = true;

    reveal.addEventListener('click', () => {
      saved[c.id] = { ...(saved[c.id] || {}), revealed: true };
      push.hidden = false;
      reveal.hidden = true;
      save();
      if (gsap && !reducedMotion) gsap.from(push.querySelectorAll('.case-pb'), { y: 10, opacity: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out' });
      if (data.cases.every((x) => saved[x.id]?.revealed)) {
        root.classList.add('is-done');
        if (!root.querySelector('.cases-done')) root.appendChild(el('p', 'cases-done', S.done));
      }
    });

    panels.appendChild(panel);
    tab.addEventListener('click', () => show(i));
    return { tab, panel };
  });

  const show = (i) => {
    const j = Math.max(0, Math.min(data.cases.length - 1, i));
    panelEls.forEach((p, k) => {
      p.panel.hidden = k !== j;
      p.tab.classList.toggle('is-active', k === j);
      p.tab.setAttribute('aria-selected', String(k === j));
    });
    if (i !== 0) panelEls[j].panel.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
  };
  show(0);
  if (data.cases.every((c) => saved[c.id]?.revealed)) { root.classList.add('is-done'); root.appendChild(el('p', 'cases-done', S.done)); }
  return { show };
}
