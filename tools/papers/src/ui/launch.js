// Phase 6 — Market Launch & Post-Market Surveillance.
// Resolve any field issue your earlier corner-cutting produced, then show the
// sales result and the final scorecard.

import { state, save } from '../state.js';
import { computeScorecard, computeSales } from '../engine/scoring.js';
import { rollRisks, firedRisks } from '../engine/economy.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

const METRIC_LABELS = {
  certification: 'Certification', budget: 'Budget Efficiency', time: 'Time to Market',
  satisfaction: 'Customer Satisfaction', sustainability: 'Sustainability'
};

// Post-market issues = component risks that actually fired this run + any real
// defect you shipped at inspection. Returns a list of issue texts (or null).
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

  // Roll component risks once, the moment the product reaches the field.
  rollRisks(p, def);
  save();

  function paint() {
    const issues = detectFieldIssues(def, p);
    if (issues && !p.launch.fieldResolved) renderFieldIssue(issues);
    else renderResults();
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
      save(); ctx.refreshHud(); renderResults();
    });
    container.querySelector('[data-fi="ignore"]').addEventListener('click', () => {
      state.reputation = Math.max(0, state.reputation - 10 * issues.length);
      p.launch.satisfactionAdj = -20 * issues.length;
      p.launch.fieldResolved = true;
      save(); ctx.refreshHud(); renderResults();
    });
  }

  function renderResults() {
    // A marketing backfire (hype behind an overpriced product) hits reputation once.
    if (p.marketingResult?.backfired && !p.launch.marketingApplied) {
      state.reputation = Math.max(0, state.reputation - p.marketingResult.repHit);
      p.launch.marketingApplied = true;
      save(); ctx.refreshHud();
    }
    const scorecard = computeScorecard(state, def);
    const sales = computeSales(state, def, scorecard.metrics.satisfaction);
    p.launch.scorecard = scorecard;
    p.launch.sales = sales;
    save();

    const bars = Object.entries(scorecard.metrics).map(([k, v]) =>
      `<div class="metric">
        <span class="metric-label">${METRIC_LABELS[k]}</span>
        <span class="metric-bar"><span class="metric-fill" style="width:${v}%"></span></span>
        <span class="metric-val">${v}</span>
      </div>`).join('');

    const profitClass = sales.profit >= 0 ? 'pos' : 'neg';

    container.innerHTML = `
      <div class="phase phase-launch">
        <p class="phase-intro">${cfg.intro}</p>

        <div class="results-grid">
          <div class="sales-card">
            <h2>Launch numbers</h2>
            <div class="sales-row"><span>Demand</span><b>${sales.demand.toLocaleString('en-US')}</b></div>
            <div class="sales-row"><span>Units sold (of ${sales.ordered.toLocaleString('en-US')} made)</span><b>${sales.units.toLocaleString('en-US')}</b></div>
            ${sales.unsold > 0 ? `<div class="sales-row"><span>Unsold inventory (sunk cost)</span><b class="neg">${sales.unsold.toLocaleString('en-US')}</b></div>` : ''}
            <div class="sales-row"><span>Revenue</span><b>${money(sales.revenue)}</b></div>
            <div class="sales-row"><span>Total spent</span><b>${money(sales.spent)}</b></div>
            <div class="sales-row total"><span>Profit</span><b class="${profitClass}">${money(sales.profit)}</b></div>
            <div class="sales-row"><span>Market share captured</span><b>${sales.marketShare}%</b></div>
            ${sales.lostCaps?.length ? `<div class="sales-row"><span>Lost to ${def.competitor?.name || 'the competitor'} (missing ${sales.lostCaps.join(', ')})</span><b class="neg">−${Math.round((1 - sales.capFactor) * 100)}%</b></div>` : ''}
          </div>

          <div class="grade-card">
            <span class="grade-label">Overall grade</span>
            <span class="grade-big grade-${scorecard.grade[0]}">${scorecard.grade}</span>
            <span class="grade-num">${scorecard.overall} / 100</span>
          </div>
        </div>

        <div class="metrics">${bars}</div>

        <div class="phase-actions">
          <button class="btn-primary" id="finish">${ctx.hasNextProduct ? 'Develop next product →' : 'Finish product →'}</button>
          <span class="confirm-msg">${ctx.hasNextProduct
            ? 'Success unlocks your next product, with budget reinvested from the profit.'
            : 'This is the last product in your line.'}</span>
        </div>
      </div>`;

    container.querySelector('#finish').addEventListener('click', () => {
      if (ctx.hasNextProduct) { ctx.completeProduct(); return; }
      container.innerHTML = `
        <div class="phase phase-launch complete">
          <h1>${p.name} — shipped.</h1>
          <p class="ph-line">Final grade <b>${scorecard.grade}</b> · Profit <b>${money(sales.profit)}</b></p>
          <p class="ph-note">You've taken this company's whole product line from brief to market. The sandbox layer (factories, hiring, global events) arrives in a later chunk.</p>
          <button class="title-btn" id="to-title">← Back to title</button>
        </div>`;
      container.querySelector('#to-title').addEventListener('click', ctx.quit);
    });
  }

  paint();
}
