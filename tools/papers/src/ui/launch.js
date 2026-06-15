// Phase 7 — Launch & ongoing market.
// Resolve any field issue your corner-cutting produced, then run the product's
// market month by month: demand decays, the competitor eventually ships, and you
// can top up marketing to prop up sales. Each month posts a report. When the
// market closes you get the final grade.

import { state, save } from '../state.js';
import { computeScorecard, computeSales } from '../engine/scoring.js';
import { rollRisks, firedRisks } from '../engine/economy.js';
import { initMarket, tickMonth, boostMarketing } from '../engine/market.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

const METRIC_LABELS = {
  certification: 'Certification', budget: 'Budget Efficiency', time: 'Time to Market',
  satisfaction: 'Customer Satisfaction', sustainability: 'Sustainability'
};

// Post-market issues = component risks that fired this run + any real defect shipped.
function detectFieldIssues(def, p) {
  const items = firedRisks(p).map(f => f.text);
  if (p.manufacturing?.shippedDefects?.length) {
    items.push('Reviewers spotted the production defect you waved through at inspection. Photos are circulating with unflattering captions.');
  }
  return items.length ? items : null;
}

export function renderLaunch(container, ctx) {
  const { def } = ctx;
  const cfg = def.phases.launch;
  const p = state.product;

  if (!p.launch) p.launch = { fieldResolved: false, satisfactionAdj: 0 };

  rollRisks(p, def);
  save();

  function paint() {
    const issues = detectFieldIssues(def, p);
    if (issues && !p.launch.fieldResolved) renderFieldIssue(issues);
    else renderMarket();
  }

  function renderFieldIssue(issues) {
    const recallCost = 5000 * issues.length;
    const list = issues.map(t => `<li>${t}</li>`).join('');
    container.innerHTML = `
      <div class="phase phase-launch">
        <p class="phase-intro">${cfg.intro}</p>
        <div class="field-issue">
          <h2>⚠ Field issue${issues.length > 1 ? 's' : ''}</h2>
          <ul class="field-issue-list">${list}</ul>
          <div class="responses">
            <button class="response" data-fi="recall">Issue a recall / field fix — ${money(recallCost)}, protects your reputation.</button>
            <button class="response" data-fi="ignore">Ride it out — costs nothing now, but reviews tank.</button>
          </div>
        </div>
      </div>`;

    container.querySelector('[data-fi="recall"]').addEventListener('click', () => {
      state.budget -= recallCost;
      p.launch.satisfactionAdj = 0;
      p.launch.fieldResolved = true;
      save(); ctx.refreshHud(); paint();
    });
    container.querySelector('[data-fi="ignore"]').addEventListener('click', () => {
      state.reputation = Math.max(0, state.reputation - 10 * issues.length);
      p.launch.satisfactionAdj = -20 * issues.length;
      p.launch.fieldResolved = true;
      save(); ctx.refreshHud(); paint();
    });
  }

  function renderMarket() {
    // Marketing backfire hits reputation once, before the market opens.
    if (p.marketingResult?.backfired && !p.launch.marketingApplied) {
      state.reputation = Math.max(0, state.reputation - p.marketingResult.repHit);
      p.launch.marketingApplied = true;
      save(); ctx.refreshHud();
    }
    // Open the market once (uses the one-shot launch demand as the starting point).
    if (!state.market || state.market.productId !== def.id) {
      const sc = computeScorecard(state, def);
      p.launch.sales = computeSales(state, def, sc.metrics.satisfaction);
      initMarket(def, p.launch.sales);
    }
    draw();
  }

  function draw() {
    const m = state.market;
    const sales = p.launch.sales;
    const unsoldNow = m.inventory - m.sold;

    const reportRows = m.reports.length
      ? m.reports.map(r => `<tr>
          <td>${r.month}</td><td>${r.units.toLocaleString('en-US')}</td>
          <td>${money(r.revenue)}</td><td>${money(r.payroll + r.adSpend)}</td>
          <td class="${r.net >= 0 ? 'pos' : 'neg'}">${money(r.net)}</td>
          <td>${r.competitor ? '🏴 rival live' : ''}</td>
        </tr>`).join('')
      : `<tr><td colspan="6" class="market-empty">No months elapsed yet. Advance to start selling your ${m.inventory.toLocaleString('en-US')} units.</td></tr>`;

    const capNote = sales.lostCaps?.length
      ? `<p class="market-note">Launched missing <b>${sales.lostCaps.join(', ')}</b> — the rival has it, so demand started ${Math.round((1 - sales.capFactor) * 100)}% lower.</p>` : '';

    let controls;
    if (!m.closed) {
      controls = `
        <div class="market-controls">
          <button class="btn-primary" id="advance-month">Advance one month →</button>
          <label class="boost-field">Top up marketing $<input type="number" id="boost-amt" min="0" step="1000" value="0"></label>
          <button class="btn-secondary" id="boost-btn">Spend on marketing</button>
        </div>
        <p class="market-hint">${m.competitorLaunched ? '🏴 The rival has shipped — demand has stepped down.' : 'Demand fades each month unless you keep marketing. The rival is racing to launch.'}</p>`;
    } else {
      const sc = computeScorecard(state, def);
      p.launch.scorecard = sc;
      save();
      const bars = Object.entries(sc.metrics).map(([k, v]) =>
        `<div class="metric"><span class="metric-label">${METRIC_LABELS[k]}</span>
          <span class="metric-bar"><span class="metric-fill" style="width:${v}%"></span></span>
          <span class="metric-val">${v}</span></div>`).join('');
      controls = `
        <div class="market-closed">
          <div class="grade-card">
            <span class="grade-label">Overall grade</span>
            <span class="grade-big grade-${sc.grade[0]}">${sc.grade}</span>
            <span class="grade-num">${sc.overall} / 100</span>
          </div>
          <div class="metrics">${bars}</div>
        </div>
        <div class="phase-actions">
          <button class="btn-primary" id="finish">${ctx.hasNextProduct ? 'Develop next product →' : 'Finish company →'}</button>
          <span class="confirm-msg">${ctx.hasNextProduct
            ? 'Your remaining cash carries over as the budget for the next product.'
            : 'This is the last product in your line.'}</span>
        </div>`;
    }

    container.innerHTML = `
      <div class="phase phase-launch">
        <p class="phase-intro">${cfg.intro}</p>
        ${capNote}
        <div class="market-summary">
          <div class="ms-stat"><span>Sold / made</span><b>${m.sold.toLocaleString('en-US')} / ${m.inventory.toLocaleString('en-US')}</b></div>
          <div class="ms-stat"><span>Unsold inventory</span><b class="${unsoldNow > 0 ? 'neg' : ''}">${unsoldNow.toLocaleString('en-US')}</b></div>
          <div class="ms-stat"><span>Revenue to date</span><b>${money(m.cumRevenue)}</b></div>
          <div class="ms-stat"><span>Company cash</span><b class="${state.budget < 0 ? 'neg' : 'pos'}">${money(state.budget)}</b></div>
        </div>
        <table class="market-table">
          <thead><tr><th>Month</th><th>Units</th><th>Revenue</th><th>Costs</th><th>Net</th><th></th></tr></thead>
          <tbody>${reportRows}</tbody>
        </table>
        ${controls}
      </div>`;

    const adv = container.querySelector('#advance-month');
    if (adv) adv.addEventListener('click', () => {
      tickMonth();
      if (state.bankrupt) { ctx.refreshHud(); return; }   // reroutes to the insolvency screen
      draw(); ctx.refreshHud();
    });
    const boostBtn = container.querySelector('#boost-btn');
    if (boostBtn) boostBtn.addEventListener('click', () => {
      const amt = Math.max(0, Math.floor(Number(container.querySelector('#boost-amt').value) || 0));
      if (boostMarketing(amt)) { draw(); ctx.refreshHud(); }
    });
    const finish = container.querySelector('#finish');
    if (finish) finish.addEventListener('click', () => {
      if (ctx.hasNextProduct) { ctx.completeProduct(); return; }
      container.innerHTML = `
        <div class="phase phase-launch complete">
          <h1>${p.name} — wound down.</h1>
          <p class="ph-line">Final grade <b>${p.launch.scorecard.grade}</b> · Company cash <b>${money(state.budget)}</b></p>
          <p class="ph-note">You've taken this company's whole product line from brief to market and back.</p>
          <button class="title-btn" id="to-title">← Back to title</button>
        </div>`;
      container.querySelector('#to-title').addEventListener('click', ctx.quit);
    });
  }

  paint();
}
