// Phase 3 — Pre-Certification Testing.
// Spend budget to run internal tests. EMC launches the interactive mini-game;
// the others resolve automatically from the design choices. Results land in
// product.testResults and are read by certification (Chunk 5).

import { state, save, canSpend } from '../state.js';
import { getMaterial, getProcess, getPart } from '../content/materials.js';
import { renderEmc } from '../minigames/emc.js';
import { renderDropTest } from '../minigames/droptest.js';
import { applyModifiers, adjustMorale, advanceTime } from '../engine/events.js';
import { productCaps } from '../engine/economy.js';

const CAP_LABELS = { bluetooth: 'Bluetooth', wifi: 'Wi-Fi' };
const capLabel = (c) => CAP_LABELS[c] || c;

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const STATUS_LABEL = { pass: 'PASS', conditional: 'CONDITIONAL', fail: 'FAIL' };

// Interactive test id -> mini-game renderer. Config lives at def.phases.testing[id].
const MINIGAMES = { emc: renderEmc, droptest: renderDropTest };

// Resolve a non-interactive test from the current design.
function resolveAutoTest(testId, p, def) {
  const matComp = def.components.find(c => c.kind === 'material');
  const mat = matComp ? getMaterial(p.selectedMaterials[matComp.id]) : null;
  const proc = getProcess(p.selectedProcess);

  if (testId === 'battery') {
    const battComp = def.components.find(c => c.id === 'battery');
    const batt = battComp ? getPart(battComp, p.selectedSuppliers[battComp.id]) : null;
    if (batt && batt.rating <= 2)
      return { status: 'fail', details: `${batt.name} cells lack UN 38.3 transport test data — a genuine safety and air-freight blocker.` };
    if (batt && batt.rating === 3)
      return { status: 'conditional', details: 'Cells pass basic checks but thermal margin is thin; acceptable with a charge-rate limit.' };
    return { status: 'pass', details: 'Cells carry full UN 38.3 documentation and pass thermal/short-circuit tests.' };
  }

  if (testId === 'flammability') {
    const fr = mat?.fireRating;
    if (fr === 'UL94 V-0' || fr === 'Non-combustible')
      return { status: 'pass', details: `${mat.name} (${fr}) self-extinguishes well within the limit.` };
    if (fr === 'Untreated')
      return { status: 'fail', details: `${mat.name} is untreated — it sustains a flame. Needs flame treatment.` };
    return { status: 'fail', details: `${mat?.name} (${fr}) burns steadily and fails the flammability standard.` };
  }

  if (testId === 'mechanical') {
    if (proc?.id === '3dprint')
      return { status: 'conditional', details: '3D-printed housing is prototype-grade; layer adhesion is marginal under load.' };
    if (mat?.id === 'bamboo')
      return { status: 'conditional', details: 'Composite shows variable strength at the seams; acceptable with reinforcement.' };
    return { status: 'pass', details: `${mat?.name} housing survives drop and load testing.` };
  }

  if (testId === 'chemical') {
    if (mat?.prop65Risk)
      return { status: 'conditional', details: `${mat.name} flags a Prop 65 substance — sellable with a disclosure warning.` };
    return { status: 'pass', details: `${mat?.name} clears RoHS and Prop 65 screening.` };
  }

  return { status: 'pass', details: 'No issues found.' };
}

export function renderTesting(container, ctx) {
  const { def } = ctx;
  const cfg = def.phases.testing;
  const p = state.product;

  const resultFor = (id) => p.testResults.find(r => r.testId === id);
  const testCost = (t) => applyModifiers('test-cost', t.cost);

  // Random focus-group feature memo: decided once per product. It demands a
  // buyer-valued capability. If the design already has it you reassure the team;
  // if not, you must go back to Design and choose a part that provides it.
  if (p.featureMemo === undefined) {
    const valued = Object.keys(def.market?.valuedCaps || {});
    p.featureMemo = (valued.length && Math.random() < 0.6)
      ? { cap: valued[Math.floor(Math.random() * valued.length)], resolved: false }
      : { cap: null, resolved: true };
    save();
  }
  const memoCap = p.featureMemo.cap;
  const memoSatisfied = () => !memoCap || !!productCaps(p, def)[memoCap];

  function render() {
    const cards = cfg.tests.map(t => {
      const res = resultFor(t.id);
      const cost = testCost(t);
      const affordable = canSpend(cost);
      const surcharge = cost > t.cost ? ' <span class="cost-up">▲</span>' : cost < t.cost ? ' <span class="cost-down">▼</span>' : '';
      // After a non-pass result you can re-test. Interactive tests let you
      // replay the mini-game; auto tests are fixed by your design, so we say so
      // rather than charge for a guaranteed-identical result.
      let retest = '';
      if (res && res.status !== 'pass') {
        retest = t.interactive
          ? `<button class="btn-secondary test-retest" data-retest="${t.id}" ${affordable ? '' : 'disabled'}>Re-test · ${money(cost)}${surcharge}</button>`
          : `<span class="retest-note">Determined by your design — change the design next time to fix this.</span>`;
      }
      const body = res
        ? `<div class="test-result status-${res.status}">
             <span class="test-badge">${STATUS_LABEL[res.status]}</span>
             <span class="test-details">${res.details}</span>
           </div>${retest}`
        : `<button class="btn-primary test-run" data-run="${t.id}" ${affordable ? '' : 'disabled'}>
             Run · ${money(cost)}${surcharge} · ${t.days}d${affordable ? '' : ' (over budget)'}
           </button>`;
      return `<div class="test-card${res ? ' done' : ''}">
        <div class="test-head"><h3>${t.name}</h3>${t.interactive ? '<span class="test-tag">interactive</span>' : ''}</div>
        <p class="test-desc">${t.desc}</p>
        ${body}
      </div>`;
    }).join('');

    const tested = p.testResults.length;
    const fails = p.testResults.filter(r => r.status === 'fail').length;

    // Feature-memo banner.
    let memoBanner = '';
    const memoMissing = memoCap && !memoSatisfied() && !p.featureMemo.resolved;
    if (memoCap && memoSatisfied() && !p.featureMemo.resolved) {
      memoBanner = `<div class="memo-event ok">
        <b>📣 Focus group:</b> the panel insists the product must have <b>${capLabel(memoCap)}</b>.
        Good news — it already does. <button class="btn-secondary" data-action="reassure">Reassure the team</button>
      </div>`;
    } else if (memoMissing) {
      memoBanner = `<div class="memo-event bad">
        <b>📣 Focus group:</b> the panel says we <b>cannot ship without ${capLabel(memoCap)}</b> — and the current
        design doesn't have it. Go back to Design and choose a part that provides ${capLabel(memoCap)}.
      </div>`;
    }

    // A hard failure OR an unmet must-have feature has to be fixed at the source.
    const actions = (fails > 0 || memoMissing)
      ? `<button class="btn-primary" data-action="redesign">← Back to Design</button>
         <span class="submit-warn">${fails > 0 ? `${fails} failing result${fails === 1 ? '' : 's'}. ` : ''}${memoMissing ? `Missing the required ${capLabel(memoCap)}. ` : ''}This is a design fault — fix it at the source. (Redesigning costs time.)</span>`
      : `<button class="btn-primary" data-action="advance">Submit to certification →</button>
         ${tested < cfg.tests.length
            ? `<span class="submit-warn">${cfg.tests.length - tested} test${cfg.tests.length - tested === 1 ? '' : 's'} not run — you'll submit those blind.</span>`
            : `<span class="submit-ok">All tests run and passing. Strong position.</span>`}`;

    container.innerHTML = `
      <div class="phase phase-testing">
        <p class="phase-intro">${cfg.intro}</p>
        ${memoBanner}
        <div class="test-grid">${cards}</div>
        <div class="phase-actions">${actions}</div>
      </div>`;

    const reassureBtn = container.querySelector('[data-action="reassure"]');
    if (reassureBtn) reassureBtn.addEventListener('click', () => {
      p.featureMemo.resolved = true;
      ctx.character.staff.forEach(s => adjustMorale(s.id, 3));
      save(); render();
    });

    container.querySelectorAll('[data-run]').forEach(btn =>
      btn.addEventListener('click', () => runTest(btn.dataset.run)));
    const redesignBtn = container.querySelector('[data-action="redesign"]');
    if (redesignBtn) redesignBtn.addEventListener('click', () => ctx.goTo('design'));
    container.querySelectorAll('[data-retest]').forEach(btn =>
      btn.addEventListener('click', () => {
        const id = btn.dataset.retest;
        // Drop the old result, then run it again (charges the fee, replays the game).
        p.testResults = p.testResults.filter(r => r.testId !== id);
        save();
        runTest(id);
      }));
    const advanceBtn = container.querySelector('[data-action="advance"]');
    if (advanceBtn) advanceBtn.addEventListener('click', ctx.advance);
  }

  function runTest(id) {
    const test = cfg.tests.find(t => t.id === id);
    const cost = test ? testCost(test) : 0;
    if (!test || !canSpend(cost) || resultFor(id)) return;

    // Charge the (modifier-adjusted) fee and the days the lab takes (payroll runs).
    state.budget -= cost;
    advanceTime(test.days || 0, test.name);
    save();
    ctx.refreshHud();

    if (test.interactive && MINIGAMES[test.minigame]) {
      launchMinigame(test, cost);
    } else {
      // A product may define a bespoke `resolve(p, def)`; otherwise use the
      // shared resolver for the common material/supplier-driven tests.
      const r = typeof test.resolve === 'function' ? test.resolve(p, def) : resolveAutoTest(id, p, def);
      p.testResults.push({ testId: id, label: test.name, ...r });
      save();
      render();
    }
  }

  function launchMinigame(test, paidCost) {
    const modal = document.createElement('div');
    modal.className = 'emc-modal';   // reused full-screen modal shell
    document.body.appendChild(modal);
    const host = document.createElement('div');
    host.className = 'emc-modal-inner';
    modal.appendChild(host);

    // The config builder lives on the test config (lets each product tweak it).
    const config = buildMinigameConfig(test);

    MINIGAMES[test.minigame](host, config, (result) => {
      modal.remove();
      if (result) {
        p.testResults.push({ testId: test.id, label: test.name, ...result });
        save();
      } else {
        // Aborted — refund the fee so backing out isn't punished.
        state.budget += paidCost;
        save();
        ctx.refreshHud();
      }
      render();
    });
  }

  // Assemble a mini-game's config, applying any design-driven difficulty.
  function buildMinigameConfig(test) {
    const raw = cfg[test.minigame];
    if (test.minigame === 'emc') {
      // A cheap critical supplier worsens "sensitive" peaks.
      const critComp = def.components.find(c => c.critical);
      const critSupplier = critComp ? getPart(critComp, p.selectedSuppliers[critComp.id]) : null;
      const penalty = critSupplier && critSupplier.rating <= 2 ? 4 : 0;
      const peaks = raw.peaks.map(pk => pk.psuSensitive ? { ...pk, excess: pk.excess + penalty } : { ...pk });
      return { standardLabel: raw.standardLabel, maxApplications: raw.maxApplications, peaks };
    }
    // droptest and others pass their config straight through.
    return { ...raw, points: raw.points ? raw.points.map(x => ({ ...x })) : undefined };
  }

  render();
}
