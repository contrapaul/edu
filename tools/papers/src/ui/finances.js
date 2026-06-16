// Finances panel: the company ledger. Shows current cash / debt, the credit
// line, and every dated money movement so "how did we run low?" is always
// answerable. Read-only — spending happens in the phases.

import { state } from '../state.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

export function openFinances(onClose) {
  const overlay = document.createElement('div');
  overlay.className = 'pp-overlay';
  document.body.appendChild(overlay);

  const cl = state.creditLimit || 0;
  const onCredit = state.budget < 0;
  const left = cl + state.budget;

  // Totals by sign, for a quick "in vs out" read.
  const income = state.ledger.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0);
  const outgo = state.ledger.filter(e => e.amount < 0).reduce((s, e) => s + e.amount, 0);

  const rows = state.ledger.length
    ? [...state.ledger].reverse().map(e =>
        `<tr><td>d${e.day}</td><td>${e.label}</td><td class="${e.amount < 0 ? 'neg' : 'pos'}">${money(e.amount)}</td></tr>`).join('')
    : '<tr><td colspan="3" class="market-empty">No transactions yet.</td></tr>';

  overlay.innerHTML = `
    <div class="pp-modal-box library-box">
      <header class="pp-modal-head">
        <h2>💰 Finances</h2>
        <button class="pp-close" aria-label="Close">✕</button>
      </header>
      <div class="fin-summary">
        <div class="fin-stat"><span>${onCredit ? 'On credit' : 'Cash'}</span><b class="${onCredit ? 'neg' : 'pos'}">${money(state.budget)}</b></div>
        <div class="fin-stat"><span>Credit line</span><b>${money(cl)}</b></div>
        <div class="fin-stat"><span>${onCredit ? 'Credit left' : 'Spendable'}</span><b class="${onCredit && left < cl * 0.25 ? 'neg' : ''}">${money(onCredit ? left : state.budget + cl)}</b></div>
        <div class="fin-stat"><span>Total in / out</span><b><span class="pos">${money(income)}</span> / <span class="neg">${money(outgo)}</span></b></div>
      </div>
      ${onCredit ? `<p class="fin-credit-note">You're operating on your credit line — ${money(-state.budget)} borrowed, interest accruing each month. Revenue from launched products pays it down. Exceed ${money(cl)} of debt and the company is insolvent.</p>` : ''}
      <div class="fin-list">
        <table class="market-table ledger-table">
          <thead><tr><th>Day</th><th>Transaction</th><th>Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;

  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); onClose && onClose(); };
  overlay.querySelector('.pp-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', onKey);
  overlay.querySelector('.pp-close').focus();
}
