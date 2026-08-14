/* What the area is spent on, then and now.
 *
 * Schematic blocks laid out on a 100 x 100 grid, not traced from die
 * photographs. The proportions carry the argument: cache goes from a corner
 * of the die to a band across the middle of it.
 */

import { placeTip } from './tip.js';

export default function mountFloorplan(host, block) {
  const views = block.views;

  host.innerHTML = `
    <div class="tool">
      <div class="fp-switch">
        ${views.map((v, i) => `
          <button type="button" data-view="${i}" aria-pressed="${i === 0}">${esc(v.label)}</button>
        `).join('')}
      </div>
      <div class="fp-stage">
        <svg viewBox="0 0 100 100" class="fp-svg" role="img" aria-label="Processor die floorplan"
             preserveAspectRatio="xMidYMid meet"></svg>
      </div>
      ${block.caption ? `<p class="tool-note">${esc(block.caption)}</p>` : ''}
      <div class="chart-tip fp-tip" hidden>
        <span class="tip-name"></span>
        <span class="tip-value"></span>
        <span class="tip-meta"></span>
      </div>
    </div>`;

  const svg = host.querySelector('.fp-svg');
  const stage = host.querySelector('.fp-stage');
  const toolEl = host.querySelector('.tool');
  const tip = host.querySelector('.fp-tip');
  let pinned = null;

  function render(n) {
    const view = views[n];
    svg.innerHTML = view.blocks.map((b, i) => `
      <g class="fp-block" data-block="${i}" data-kind="${b.kind}">
        <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="0.8"/>
      </g>`).join('');
    svg.dataset.view = n;
    clear();
  }

  function show(g) {
    const view = views[+svg.dataset.view];
    const b = view.blocks[+g.dataset.block];
    tip.querySelector('.tip-name').textContent = b.name;
    tip.querySelector('.tip-value').textContent = view.label;
    tip.querySelector('.tip-meta').textContent = b.text || '';
    placeTip(tip, g.querySelector('rect'), toolEl);
    svg.querySelectorAll('.fp-block.is-active').forEach(x => x.classList.remove('is-active'));
    g.classList.add('is-active');
  }

  function hide() {
    if (pinned) return show(pinned);
    clear();
  }

  function clear() {
    pinned = null;
    tip.hidden = true;
    svg.querySelectorAll('.fp-block.is-active').forEach(x => x.classList.remove('is-active'));
  }

  stage.addEventListener('pointerover', e => {
    const g = e.target.closest('.fp-block');
    if (g && g !== pinned) show(g);
  });
  stage.addEventListener('pointerout', e => {
    if (e.target.closest('.fp-block')) hide();
  });
  stage.addEventListener('click', e => {
    const g = e.target.closest('.fp-block');
    if (!g) return clear();
    if (pinned === g) return clear();
    pinned = null;
    show(g);
    pinned = g;
  });

  host.querySelectorAll('.fp-switch button').forEach(btn => {
    btn.addEventListener('click', () => {
      host.querySelectorAll('.fp-switch button')
        .forEach(b => b.setAttribute('aria-pressed', b === btn));
      render(+btn.dataset.view);
    });
  });

  render(0);
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
