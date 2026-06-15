// Phase 1 — Product Brief & Requirements Gathering.
// Read the brief and choose target markets (live-updates required standards).
// Money is a single company cash pot now: there's no up-front budget split and
// no up-front price — you commit price and order size late, in Production.

import { state, save, unlockRegulation } from '../state.js';
import { MARKETS, requiredStandardsFor } from '../content/markets.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

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

          <p class="cash-readout">You have <b>${money(state.budget)}</b> in company cash. Every
            component, test, certification fee and marketing push spends from it — and you don't set
            a price until the product exists. Spend with intent.</p>

          <div class="phase-actions">
            <button class="btn-primary" id="confirm-brief" disabled>Lock the brief →</button>
            <span class="confirm-msg" id="confirm-msg"></span>
          </div>
        </section>
      </div>
    </div>`;

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

  function refreshValidity() {
    const hasMarket = p.selectedMarkets.length > 0;
    const btn = container.querySelector('#confirm-brief');
    const msg = container.querySelector('#confirm-msg');
    btn.disabled = !hasMarket;
    msg.textContent = hasMarket ? '' : 'Pick a market first.';
  }

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

  container.querySelector('#confirm-brief').addEventListener('click', () => {
    save();
    ctx.advance();
  });

  recomputeStandards();
  refreshValidity();
}
