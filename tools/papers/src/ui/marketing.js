// Phase 6 — Marketing.
// Spend whatever cash you have left across modern channels to drive launch
// demand. Channels trade reach against credibility and audience fit; pouring
// money into hype channels behind an overpriced, low-quality product backfires.

import { state, save } from '../state.js';
import { getPart, getMaterial } from '../content/materials.js';
import { MARKETING_CHANNELS, computeMarketing } from '../content/marketing.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

export function renderMarketing(container, ctx) {
  const { def } = ctx;
  const p = state.product;
  if (!p.marketing) p.marketing = {};

  // Quality-vs-price "value" the audience perceives. Negative = overpriced junk.
  function valueScore() {
    const ratings = def.components.filter(c => c.kind === 'supplier')
      .map(c => getPart(c, p.selectedSuppliers[c.id])?.rating ?? 3);
    const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 3;
    const q01 = (avg - 1) / 4;
    const insp = (p.manufacturing?.inspectionScore ?? 70) / 100;
    const quality = clamp(0.6 * q01 + 0.4 * insp, 0, 1);
    const pr = def.priceRange;
    const pricePos = clamp((Number(p.targetPrice) - pr.min) / (pr.max - pr.min), 0, 1);
    return quality - pricePos;
  }
  const value = valueScore();

  const rows = MARKETING_CHANNELS.map(ch => {
    const fits = !ch.markets || ch.markets.some(m => p.selectedMarkets.includes(m));
    const fitNote = ch.markets
      ? (fits ? '<span class="ch-fit ok">fits your markets</span>' : '<span class="ch-fit bad">poor fit for your markets</span>')
      : '';
    const flashy = ch.flashy ? '<span class="ch-flashy">hype</span>' : '';
    return `<div class="ch-row${fits ? '' : ' ch-dim'}">
      <div class="ch-info">
        <b>${ch.name}</b> ${flashy} ${fitNote}
        <span class="ch-desc">${ch.desc}</span>
      </div>
      <label class="ch-spend">$<input type="number" min="0" step="500" data-ch="${ch.id}" value="${p.marketing[ch.id] || 0}"></label>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="phase phase-marketing">
      <p class="phase-intro">The product is made and the order is placed. Now spend what's left to actually sell it. Reach drives demand — but credibility matters, and hype spent on a product that can't deliver curdles into bad reviews.</p>
      <div class="mkt-grid">
        <div class="mkt-channels">${rows}</div>
        <aside class="mkt-summary">
          <div class="mkt-card">
            <span class="mkt-label">Cash available</span>
            <span class="mkt-cash" id="mkt-cash">${money(state.budget)}</span>
          </div>
          <div class="mkt-meter">
            <span class="mkt-label">Projected demand boost</span>
            <span class="mkt-mult" id="mkt-mult">×1.00</span>
          </div>
          <p class="mkt-warn" id="mkt-warn"></p>
          <div class="phase-actions">
            <button class="btn-primary" id="mkt-launch" disabled>Launch →</button>
            <span class="confirm-msg" id="mkt-msg"></span>
          </div>
        </aside>
      </div>
    </div>`;

  function totalSpend() {
    return MARKETING_CHANNELS.reduce((s, ch) => s + (p.marketing[ch.id] || 0), 0);
  }

  function refresh() {
    const total = totalSpend();
    const res = computeMarketing(p.marketing, p.selectedMarkets, value);
    const overBudget = total > state.budget;

    container.querySelector('#mkt-cash').textContent = money(state.budget - total) + ' left';
    container.querySelector('#mkt-mult').textContent = '×' + res.reachMult.toFixed(2);

    const warn = container.querySelector('#mkt-warn');
    if (res.backfired) {
      warn.className = 'mkt-warn bad';
      warn.textContent = `⚠ Hype risk: you're pushing an overpriced / underwhelming product hard through hype channels. Expect reviews to turn on you (reputation −${res.repHit}, reach cut).`;
    } else if (total === 0) {
      warn.className = 'mkt-warn';
      warn.textContent = 'Spend nothing and you launch into silence — demand stays flat.';
    } else {
      warn.className = 'mkt-warn';
      warn.textContent = '';
    }

    const btn = container.querySelector('#mkt-launch');
    const msg = container.querySelector('#mkt-msg');
    btn.disabled = overBudget;
    msg.textContent = overBudget ? `Over budget by ${money(total - state.budget)}.` : '';
  }

  container.querySelectorAll('[data-ch]').forEach(inp => {
    inp.addEventListener('input', () => {
      p.marketing[inp.dataset.ch] = Math.max(0, Math.floor(Number(inp.value) || 0));
      save(); refresh();
    });
  });

  container.querySelector('#mkt-launch').addEventListener('click', () => {
    const total = totalSpend();
    state.budget -= total;
    p.marketingResult = computeMarketing(p.marketing, p.selectedMarkets, value);
    save();
    ctx.refreshHud();
    ctx.advance();
  });

  refresh();
}
