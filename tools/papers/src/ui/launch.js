// Phase 6 — Market Launch & Post-Market Surveillance.
// Resolve any field issue your earlier corner-cutting produced, then show the
// sales result and the final scorecard.

import { state, save } from '../state.js';
import { getSupplier } from '../content/materials.js';
import { computeScorecard, computeSales } from '../engine/scoring.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

const METRIC_LABELS = {
  certification: 'Certification', budget: 'Budget Efficiency', time: 'Time to Market',
  satisfaction: 'Customer Satisfaction', sustainability: 'Sustainability'
};

// Which post-market issue (if any) fires, based on earlier choices.
function detectFieldIssue(def, p) {
  const critComp = def.components.find(c => c.critical);
  const crit = critComp ? getSupplier(p.selectedSuppliers[critComp.id]) : null;
  if (crit && crit.rating <= 2) {
    return { id: 'crit-burn', text: def.phases.launch.critBurnText ??
      'Customers report a faint burning smell from a cheap internal component under load. Support tickets are climbing and a tech reviewer just filmed it.' };
  }
  if (p.manufacturing?.shippedDefects?.length) {
    return { id: 'defect',
      text: 'Reviewers spotted the production defect you waved through at inspection. Photos are circulating with unflattering captions.' };
  }
  return null;
}

export function renderLaunch(container, ctx) {
  const { def } = ctx;
  const cfg = def.phases.launch;
  const p = state.product;

  if (!p.launch) p.launch = { fieldResolved: false, satisfactionAdj: 0 };

  function paint() {
    const issue = detectFieldIssue(def, p);
    if (issue && !p.launch.fieldResolved) renderFieldIssue(issue);
    else renderResults();
  }

  function renderFieldIssue(issue) {
    container.innerHTML = `
      <div class="phase phase-launch">
        <p class="phase-intro">${cfg.intro}</p>
        <div class="field-issue">
          <h2>⚠ Field issue</h2>
          <p>${issue.text}</p>
          <div class="responses">
            <button class="response" data-fi="recall">Issue a recall / field fix — ${money(5000)}, protects your reputation.</button>
            <button class="response" data-fi="ignore">Ride it out — costs nothing now, but reviews tank.</button>
          </div>
        </div>
      </div>`;

    container.querySelector('[data-fi="recall"]').addEventListener('click', () => {
      state.budget -= 5000;
      p.launch.satisfactionAdj = 0;
      p.launch.fieldResolved = true;
      save(); ctx.refreshHud(); renderResults();
    });
    container.querySelector('[data-fi="ignore"]').addEventListener('click', () => {
      state.reputation = Math.max(0, state.reputation - 10);
      p.launch.satisfactionAdj = -20;
      p.launch.fieldResolved = true;
      save(); ctx.refreshHud(); renderResults();
    });
  }

  function renderResults() {
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
            <div class="sales-row"><span>Units sold</span><b>${sales.units.toLocaleString('en-US')}</b></div>
            <div class="sales-row"><span>Revenue</span><b>${money(sales.revenue)}</b></div>
            <div class="sales-row"><span>Spent on development</span><b>${money(sales.spent)}</b></div>
            <div class="sales-row total"><span>Profit</span><b class="${profitClass}">${money(sales.profit)}</b></div>
            <div class="sales-row"><span>Market share captured</span><b>${sales.marketShare}%</b></div>
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
