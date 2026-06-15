// Portfolio panel: every product you've launched and how its market is doing.
// Markets keep selling in the background as the clock advances; this is where you
// watch them and top up their marketing while you develop the next product.

import { state } from '../state.js';
import { boostMarketing } from '../engine/market.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

export function activeMarketCount() {
  return state.markets.filter(m => !m.closed).length;
}

export function openPortfolio(onClose) {
  const overlay = document.createElement('div');
  overlay.className = 'pp-overlay';
  document.body.appendChild(overlay);

  function render() {
    const cards = state.markets.length === 0
      ? '<p class="pp-empty">No products launched yet. Your first market opens at launch.</p>'
      : state.markets.map(m => {
          const unsold = m.inventory - m.sold;
          const last = m.reports[m.reports.length - 1];
          const status = m.closed
            ? `<span class="pf-status closed">wound down</span>`
            : `<span class="pf-status live">selling</span>`;
          const grade = m.grade ? `<span class="grade-pill grade-${m.grade[0]}">${m.grade}</span>` : '';
          const boost = m.closed ? '' : `
            <div class="pf-boost">
              <label>Top up marketing $<input type="number" min="0" step="1000" value="0" data-boost="${m.productId}"></label>
              <button class="btn-secondary" data-boostbtn="${m.productId}">Spend</button>
            </div>`;
          return `<article class="pf-card">
            <div class="pf-head"><b>${m.name}</b> ${status} ${grade}</div>
            <div class="pf-stats">
              <span>Sold ${m.sold.toLocaleString('en-US')} / ${m.inventory.toLocaleString('en-US')}</span>
              <span>Unsold ${unsold.toLocaleString('en-US')}</span>
              <span>Revenue ${money(m.cumRevenue)}</span>
              <span>Month ${m.month}${m.competitorLaunched ? ' · 🏴 rival live' : ''}</span>
            </div>
            ${last ? `<div class="pf-last">Last month: ${last.units.toLocaleString('en-US')} units, ${money(last.revenue)}</div>` : '<div class="pf-last">No sales month elapsed yet.</div>'}
            ${boost}
          </article>`;
        }).join('');

    overlay.innerHTML = `
      <div class="pp-modal-box library-box">
        <header class="pp-modal-head">
          <h2>📈 Market Portfolio</h2>
          <button class="pp-close" aria-label="Close">✕</button>
        </header>
        <p class="library-sub">Launched products keep selling as time passes. Cash from these markets funds your next product.</p>
        <div class="pf-list">${cards}</div>
      </div>`;

    overlay.querySelector('.pp-close').addEventListener('click', close);
    overlay.querySelectorAll('[data-boostbtn]').forEach(btn =>
      btn.addEventListener('click', () => {
        const id = btn.dataset.boostbtn;
        const inp = overlay.querySelector(`[data-boost="${id}"]`);
        const amt = Math.max(0, Math.floor(Number(inp.value) || 0));
        if (boostMarketing(id, amt)) render();
      }));
  }

  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); onClose && onClose(); };
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', onKey);

  render();
  overlay.querySelector('.pp-close').focus();
}
