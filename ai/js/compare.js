/* ============================================================
   Compare: two transcript players side by side
   ------------------------------------------------------------
   <div data-compare data-left="id-a" data-right="id-b"
        data-left-label="2023" data-right-label="2026"></div>

   Both players start together when the block scrolls into view.
   One bar drives both (play, show all, replay). Under 860px the
   panes stack and a pair of tabs picks which one is shown; both
   keep playing.
   ============================================================ */

import { TranscriptPlayer } from './transcript-player.js';
import { whenInView } from './scroll.js';

const STRINGS = { playBoth: 'Play both', pauseBoth: 'Pause', showAll: 'Show all', replay: 'Replay' };

function btn(doc, cls, text) {
  const b = doc.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.textContent = text;
  return b;
}

export function mountCompare(root, opts = {}) {
  const doc = root.ownerDocument;
  const ids = [root.getAttribute('data-left'), root.getAttribute('data-right')];
  const labels = [root.getAttribute('data-left-label') || 'A', root.getAttribute('data-right-label') || 'B'];
  root.classList.add('compare');

  const bar = doc.createElement('div');
  bar.className = 'compare-bar tp-scope';
  const play = btn(doc, 'tp-btn tp-btn--play', STRINGS.playBoth);
  const showAll = btn(doc, 'tp-btn', STRINGS.showAll);
  const replay = btn(doc, 'tp-btn', STRINGS.replay);
  const tabs = doc.createElement('div');
  tabs.className = 'compare-tabs';
  tabs.setAttribute('role', 'tablist');
  bar.append(play, showAll, replay, tabs);

  const panes = doc.createElement('div');
  panes.className = 'compare-panes';
  const roots = ids.map((_, i) => { const d = doc.createElement('div'); d.setAttribute('data-side', String(i)); panes.appendChild(d); return d; });
  root.append(bar, panes);

  const players = roots.map((r) => new TranscriptPlayer(r, { ...opts, autoplay: false, follow: true }));
  ids.forEach((id, i) => players[i].load(id));

  const tabBtns = labels.map((label, i) => {
    const b = btn(doc, 'tp-btn tp-btn--speed', label);
    b.setAttribute('role', 'tab');
    b.addEventListener('click', () => show(i));
    tabs.appendChild(b);
    return b;
  });
  const show = (i) => {
    roots.forEach((r, j) => r.classList.toggle('is-shown', i === j));
    tabBtns.forEach((b, j) => { b.classList.toggle('is-active', i === j); b.setAttribute('aria-selected', String(i === j)); });
  };
  show(0);

  const anyPlaying = () => players.some((p) => p.playing);
  const sync = () => {
    play.textContent = anyPlaying() ? STRINGS.pauseBoth : STRINGS.playBoth;
    play.disabled = players.every((p) => p.done);
  };
  play.addEventListener('click', () => { anyPlaying() ? players.forEach((p) => p.pause()) : players.forEach((p) => p.play()); sync(); });
  showAll.addEventListener('click', () => { players.forEach((p) => p.skip()); sync(); });
  replay.addEventListener('click', () => { players.forEach((p) => p.replay()); sync(); });
  for (const ev of ['tp:start', 'tp:done', 'tp:choice', 'tp:choose', 'tp:messageend']) root.addEventListener(ev, sync);

  whenInView(root, () => {
    players.forEach((p) => { if (p.transcript) p.play(); else p.root.addEventListener('tp:load', () => p.play(), { once: true }); });
    sync();
  });
  sync();
  return { players, root };
}

export function mountAllCompares(root = document, opts = {}) {
  return Array.from(root.querySelectorAll('[data-compare]')).map((el) => mountCompare(el, opts));
}
