// Phase 1 — Product Brief & Requirements Gathering.
// Read the brief, choose target markets (live-updates required standards),
// allocate the budget across four buckets, set a target retail price.

import { state, save, unlockRegulation } from '../state.js';
import { MARKETS, requiredStandardsFor } from '../content/markets.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

const BUCKETS = [
  ['testing',       'Testing & Certification'],
  ['materials',     'Materials'],
  ['manufacturing', 'Manufacturing Setup'],
  ['consulting',    'Regulatory Consulting']
];

export function renderBrief(container, ctx) {
  const { def } = ctx;
  const brief = def.phases.brief;
  const p = state.product;

  const marketCards = MARKETS
    .filter(m => def.availableMarkets.includes(m.id))
    .map(m => {
      const on = p.selectedMarkets.includes(m.id) ? ' on' : '';
      return `<button class="market${on}" data-market="${m.id}">
        <span class="market-flag">${m.flag}</span>
        <span class="market-name">${m.name}${m.optional ? ' <em>(opt-in)</em>' : ''}</span>
        <span class="market-blurb">${m.blurb}</span>
      </button>`;
    }).join('');

  const buckets = BUCKETS.map(([key, label]) => `
    <label class="bucket">
      <span class="bucket-label">${label}</span>
      <span class="bucket-input">$<input type="number" min="0" step="1000"
        data-bucket="${key}" value="${p.budgetAllocation[key]}"></span>
    </label>`).join('');

  container.innerHTML = `
    <div class="phase phase-brief">
      <div class="brief-grid">
        <section class="memo">
          <span class="memo-from">Memo — from ${brief.from}</span>
          <p class="memo-body">${brief.memo}</p>
          <blockquote class="marketing-claim">${brief.marketingClaim}
            <span class="legal-note">${brief.legalNote}</span>
          </blockquote>
          <p class="intern-note">${brief.internNote}</p>
        </section>

        <section class="brief-panel">
          <h2>1 · Target markets</h2>
          <p class="panel-hint">${brief.hint}</p>
          <div class="markets">${marketCards}</div>

          <h3 class="req-title">Required certifications <span id="req-count"></span></h3>
          <ul class="req-list" id="req-list"></ul>

          <h2>2 · Budget allocation</h2>
          <div class="buckets">${buckets}</div>
          <p class="budget-readout" id="budget-readout"></p>

          <h2>3 · Target retail price</h2>
          <div class="price-row">
            <input type="range" id="price" min="${def.priceRange.min}" max="${def.priceRange.max}"
              step="5" value="${p.targetPrice}">
            <span class="price-val" id="price-val">$${p.targetPrice.toFixed(2)}</span>
          </div>

          <div class="phase-actions">
            <button class="btn-primary" id="confirm-brief" disabled>Lock the brief →</button>
            <span class="confirm-msg" id="confirm-msg"></span>
          </div>
        </section>
      </div>
    </div>`;

  // --- live state ---
  function recomputeStandards() {
    p.requiredStandards = requiredStandardsFor(p.selectedMarkets, def.categories);
    p.requiredStandards.forEach(s => unlockRegulation(s.id));
    const list = container.querySelector('#req-list');
    const count = container.querySelector('#req-count');
    if (p.requiredStandards.length === 0) {
      list.innerHTML = `<li class="req-empty">Select at least one market.</li>`;
      count.textContent = '';
    } else {
      list.innerHTML = p.requiredStandards
        .map(s => `<li><b>${s.label}</b> — ${s.note}</li>`).join('');
      count.textContent = `(${p.requiredStandards.length})`;
    }
  }

  function allocated() {
    return BUCKETS.reduce((sum, [k]) => sum + (p.budgetAllocation[k] || 0), 0);
  }

  function refreshValidity() {
    const used = allocated();
    const remaining = state.budget - used;
    const readout = container.querySelector('#budget-readout');
    readout.innerHTML = `Allocated <b>${money(used)}</b> of ${money(state.budget)} ·
      <span class="${remaining < 0 ? 'over' : 'ok'}">${remaining < 0 ? 'Over by ' + money(-remaining) : money(remaining) + ' unallocated'}</span>`;

    const hasMarket = p.selectedMarkets.length > 0;
    const inBudget = remaining >= 0;
    const btn = container.querySelector('#confirm-brief');
    const msg = container.querySelector('#confirm-msg');
    btn.disabled = !(hasMarket && inBudget);
    msg.textContent = !hasMarket ? 'Pick a market first.'
      : !inBudget ? 'Trim the budget — you are over.' : '';
  }

  // --- listeners ---
  container.querySelectorAll('[data-market]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.market;
      const i = p.selectedMarkets.indexOf(id);
      if (i >= 0) { p.selectedMarkets.splice(i, 1); btn.classList.remove('on'); }
      else { p.selectedMarkets.push(id); btn.classList.add('on'); }
      recomputeStandards();
      refreshValidity();
      save();
      ctx.refreshHud();
    });
  });

  container.querySelectorAll('[data-bucket]').forEach(inp => {
    inp.addEventListener('input', () => {
      p.budgetAllocation[inp.dataset.bucket] = Math.max(0, Number(inp.value) || 0);
      refreshValidity();
      save();
    });
  });

  const price = container.querySelector('#price');
  price.addEventListener('input', () => {
    p.targetPrice = Number(price.value);
    container.querySelector('#price-val').textContent = '$' + p.targetPrice.toFixed(2);
    save();
  });

  container.querySelector('#confirm-brief').addEventListener('click', () => {
    save();
    ctx.advance();
  });

  recomputeStandards();
  refreshValidity();
}
