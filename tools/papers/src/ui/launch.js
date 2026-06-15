// Phase 7 — Launch & market open.
// Resolve any field issue, then open the product's market. From here you can let
// the market run month by month, or jump straight into developing the next
// product — the market keeps selling in the background while you do (see the
// Portfolio panel). The clock and cash are shared across everything.

import { state, save } from '../state.js';
import { computeScorecard, computeSales } from '../engine/scoring.js';
import { rollRisks, firedRisks } from '../engine/economy.js';
import { advanceTime } from '../engine/events.js';
import { openMarket, getMarket, boostMarketing } from '../engine/market.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

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
    // Open this product's market once.
    if (!getMarket(def.id)) {
      const sc = computeScorecard(state, def);
      p.launch.sales = computeSales(state, def, sc.metrics.satisfaction);
      p.launch.scorecard = sc;
      openMarket(def, p.launch.sales, sc);
      save();
    }
    draw();
  }

  function draw() {
    const m = getMarket(def.id);
    const sales = p.launch.sales;
    const unsoldNow = m.inventory - m.sold;

    const reportRows = m.reports.length
      ? m.reports.map(r => `<tr>
          <td>${r.month}</td><td>${r.units.toLocaleString('en-US')}</td>
          <td>${money(r.revenue)}</td>
          <td class="${r.net >= 0 ? 'pos' : 'neg'}">${money(r.net)}</td>
          <td>${r.competitor ? '🏴 rival live' : ''}</td>
        </tr>`).join('')
      : `<tr><td colspan="5" class="market-empty">No months elapsed yet. Sell here, or start the next product and let this one run in the background.</td></tr>`;

    const capNote = sales.lostCaps?.length
      ? `<p class="market-note">Launched missing <b>${sales.lostCaps.join(', ')}</b> — the rival has it, so demand started ${Math.round((1 - sales.capFactor) * 100)}% lower.</p>` : '';

    const gradeCard = m.grade ? `<div class="grade-card">
        <span class="grade-label">Launch grade</span>
        <span class="grade-big grade-${m.grade[0]}">${m.grade}</span>
        <span class="grade-num">${m.overall} / 100</span>
      </div>` : '';

    let controls;
    if (m.closed) {
      controls = `<p class="market-hint">This product has sold through / wound down. ${ctx.hasNextProduct ? '' : 'Its line is complete.'}</p>
        <div class="phase-actions">
          <button class="btn-primary" id="finish">${ctx.hasNextProduct ? 'Develop next product →' : 'Finish company →'}</button>
        </div>`;
    } else {
      controls = `
        <div class="market-controls">
          ${ctx.hasNextProduct ? '<button class="btn-primary" id="develop-next">Develop next product → <span class="btn-sub">(this market keeps selling)</span></button>' : ''}
          <button class="btn-secondary" id="advance-month">Advance one month</button>
          <label class="boost-field">Top up marketing $<input type="number" id="boost-amt" min="0" step="1000" value="0"></label>
          <button class="btn-secondary" id="boost-btn">Spend</button>
        </div>
        <p class="market-hint">${m.competitorLaunched ? '🏴 The rival has shipped — demand has stepped down.' : 'Demand fades each month unless you keep marketing. Develop the next product to earn while this one sells.'}
          ${!ctx.hasNextProduct ? ' Advance months to wind the line down.' : ''}</p>`;
    }

    container.innerHTML = `
      <div class="phase phase-launch">
        <p class="phase-intro">${cfg.intro}</p>
        ${capNote}
        <div class="market-summary">
          ${gradeCard}
          <div class="ms-stat"><span>Sold / made</span><b>${m.sold.toLocaleString('en-US')} / ${m.inventory.toLocaleString('en-US')}</b></div>
          <div class="ms-stat"><span>Unsold</span><b class="${unsoldNow > 0 ? 'neg' : ''}">${unsoldNow.toLocaleString('en-US')}</b></div>
          <div class="ms-stat"><span>Revenue to date</span><b>${money(m.cumRevenue)}</b></div>
          <div class="ms-stat"><span>Company cash</span><b class="${state.budget < 0 ? 'neg' : 'pos'}">${money(state.budget)}</b></div>
        </div>
        <table class="market-table">
          <thead><tr><th>Month</th><th>Units</th><th>Revenue</th><th>Net</th><th></th></tr></thead>
          <tbody>${reportRows}</tbody>
        </table>
        ${controls}
      </div>`;

    const dev = container.querySelector('#develop-next');
    if (dev) dev.addEventListener('click', () => ctx.completeProduct());

    const adv = container.querySelector('#advance-month');
    if (adv) adv.addEventListener('click', () => {
      advanceTime(30, 'Market');
      if (state.bankrupt) { ctx.refreshHud(); return; }
      draw(); ctx.refreshHud();
    });

    const boostBtn = container.querySelector('#boost-btn');
    if (boostBtn) boostBtn.addEventListener('click', () => {
      const amt = Math.max(0, Math.floor(Number(container.querySelector('#boost-amt').value) || 0));
      if (boostMarketing(def.id, amt)) { draw(); ctx.refreshHud(); }
    });

    const finish = container.querySelector('#finish');
    if (finish) finish.addEventListener('click', () => {
      if (ctx.hasNextProduct) { ctx.completeProduct(); return; }
      renderCompanySummary();
    });
  }

  function renderCompanySummary() {
    const rows = state.markets.map(m => `<tr>
      <td>${m.name}</td>
      <td>${m.sold.toLocaleString('en-US')} / ${m.inventory.toLocaleString('en-US')}</td>
      <td>${money(m.cumRevenue)}</td>
      <td>${m.grade ? `<span class="grade-pill grade-${m.grade[0]}">${m.grade}</span>` : '—'}</td>
    </tr>`).join('');
    container.innerHTML = `
      <div class="phase phase-launch complete">
        <h1>${ctx.character.company} — the whole line is out.</h1>
        <table class="market-table summary">
          <thead><tr><th>Product</th><th>Sold</th><th>Revenue</th><th>Grade</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="ph-line">Company cash <b>${money(state.budget)}</b> · ${state.clock.day} days elapsed</p>
        <button class="title-btn" id="to-title">← Back to title</button>
      </div>`;
    container.querySelector('#to-title').addEventListener('click', ctx.quit);
  }

  paint();
}
