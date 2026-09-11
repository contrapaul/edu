// Phase 3 — Pre-Certification Testing.
// Spend budget to run internal tests. EMC / drop tests launch a mini-game; the
// others resolve automatically from the design choices. Anything the design
// already guarantees is pre-cleared for free from datasheets, so the only tests
// left to "Run" are the ones the paperwork can't vouch for. Results land in
// product.testResults and are read by certification (Chunk 5).

import { state, save, canSpend } from '../state.js';
import { getMaterial, getProcess, getPart } from '../content/materials.js';
import { renderEmc } from '../minigames/emc.js';
import { renderDropTest } from '../minigames/droptest.js';
import { applyModifiers, adjustMorale, advanceTime } from '../engine/events.js';
import { productCaps } from '../engine/economy.js';

const CAP_LABELS = { bluetooth: 'Bluetooth', wifi: 'Wi-Fi' };
const capLabel = (c) => CAP_LABELS[c] || c;

// Why each common test matters and what skipping it costs you later — so
// "Run" reads as an informed choice, not a box you must click. A product can
// override either line per-test with `why` / `skipNote` on its test def;
// these are the fallback for the common test ids shared across products.
const TEST_NOTES = {
  emc:          { why: 'Confirms the product won’t jam other devices or blow past the radio-emissions limit for the markets you picked.', skip: 'Submit blind — a certifier who finds emissions issues later can reject the whole filing.' },
  flammability: { why: 'Confirms the enclosure self-extinguishes fast enough to meet the fire-safety standard.', skip: 'A real fire risk can surface at certification (or worse, in the field) instead of here, where it’s cheap to fix.' },
  mechanical:   { why: 'Confirms the housing survives drop and load stress instead of cracking in someone’s bag.', skip: 'A weak point ships hidden and can turn into a field failure and a reputation hit.' },
  chemical:     { why: 'Screens materials for restricted substances (RoHS, Prop 65) before a regulator finds them for you.', skip: 'A flagged substance found at certification means a late redesign, not a quick fix.' },
  battery:      { why: 'Confirms the cells carry real safety/transport documentation and won’t overheat under normal charging.', skip: 'Bad cells are a genuine safety and air-freight blocker — this is the cheapest place to catch it.' },
  droptest:     { why: 'Finds the weak point in the housing before a customer does.', skip: 'Ships as-is; a crack shows up later as a field issue instead of a design fix now.' }
};

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const STATUS_LABEL = { pass: 'PASS', conditional: 'CONDITIONAL', fail: 'FAIL' };

// Interactive test id -> mini-game renderer. Config lives at def.phases.testing[id].
const MINIGAMES = { emc: renderEmc, droptest: renderDropTest };

// How much a part's sourcing rating (or a material's toughness) moves a peak /
// stress point, in dB or "weakness". Peaks are authored at +4..+7, so a rating-5
// part clears its peak outright, a rating-4 part leaves it marginal, and a
// cheap part makes it worse than authored.
const RATING_SHIFT = { 5: -7, 4: -4, 3: -1, 2: 3, 1: 5 };
const shiftFor = (rating) => RATING_SHIFT[Math.max(1, Math.min(5, Math.round(rating)))] ?? 0;

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
    if (fr === 'UL94 V-2' || fr === 'UL94 HBF')
      return { status: 'conditional', details: `${mat.name} (${fr}) self-extinguishes slowly — passable with the right rating and labelling.` };
    if (fr === 'Untreated')
      return { status: 'fail', details: `${mat.name} is untreated — it sustains a flame. Needs flame treatment.` };
    return { status: 'fail', details: `${mat?.name} (${fr}) burns steadily and fails the flammability standard.` };
  }

  if (testId === 'mechanical') {
    if (proc?.id === '3dprint')
      return { status: 'conditional', details: '3D-printed housing is prototype-grade; layer adhesion is marginal under load.' };
    const t = mat?.toughness ?? 3;
    if (t <= 1)
      return { status: 'fail', details: `${mat?.name} is too brittle/flimsy — it fails the drop and load test outright.` };
    if (t === 2)
      return { status: 'conditional', details: `${mat?.name} shows variable strength at the seams; acceptable with reinforcement.` };
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

  // Tests the design already guarantees are recorded up front at no cost. An
  // auto test that resolves to PASS is a datasheet fact; a bench whose every
  // peak / stress point sits under the limit needs no bench time. Whatever is
  // left to Run is genuinely uncertain, so the fee buys real information.
  function preClearTests() {
    let changed = false;
    for (const t of cfg.tests) {
      if (resultFor(t.id)) continue;
      let r = null;
      if (t.interactive && MINIGAMES[t.minigame]) {
        const config = buildMinigameConfig(t);
        const items = config.peaks || config.points || [];
        const over = items.filter(x => (x.excess ?? x.weakness) > 0);
        if (!over.length) {
          const credits = [...new Set(items.filter(x => x.note).map(x => x.note))];
          r = { status: 'pass', details: `Every ${config.peaks ? 'emission peak' : 'stress point'} sits under the limit on paper. ${credits.join(' ')}` };
        }
      } else {
        const auto = typeof t.resolve === 'function' ? t.resolve(p, def) : resolveAutoTest(t.id, p, def);
        if (auto.status === 'pass') r = auto;
      }
      if (r) {
        p.testResults.push({ testId: t.id, label: t.name, preCleared: true, ...r });
        changed = true;
      }
    }
    if (changed) save();
  }

  function render() {
    preClearTests();
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
        ? `<div class="test-result status-${res.status}${res.preCleared ? ' pre-cleared' : ''}">
             <span class="test-badge">${res.preCleared ? 'PRE-CLEARED · $0' : STATUS_LABEL[res.status]}</span>
             <span class="test-details">${res.details}</span>
             ${res.preCleared ? '<span class="test-precleared-note">Datasheets and certificates cover this. No lab time needed.</span>' : ''}
           </div>${retest}`
        : `<button class="btn-primary test-run" data-run="${t.id}" ${affordable ? '' : 'disabled'}>
             Run · ${money(cost)}${surcharge} · ${t.days}d${affordable ? '' : ' (over budget)'}
           </button>`;
      const notes = TEST_NOTES[t.id] || {};
      const why = t.why || notes.why;
      const skipNote = t.skipNote || notes.skip;
      return `<div class="test-card${res ? ' done' : ''}">
        <div class="test-head"><h3>${t.name}</h3>${t.interactive ? '<span class="test-tag">interactive</span>' : ''}</div>
        <p class="test-desc">${t.desc}</p>
        ${why && !res?.preCleared ? `<p class="test-why"><b>Why it matters:</b> ${why}</p>` : ''}
        ${!res && skipNote ? `<p class="test-skip"><b>If you skip it:</b> ${skipNote}</p>` : ''}
        ${body}
      </div>`;
    }).join('');

    const tested = p.testResults.length;
    const fails = p.testResults.filter(r => r.status === 'fail').length;
    const preCleared = p.testResults.filter(r => r.preCleared).length;
    const preClearNote = preCleared
      ? `<p class="preclear-summary">${preCleared === cfg.tests.length
          ? 'Your engineer has pre-cleared every test from the datasheets and certificates you sourced. Nothing here needs lab time.'
          : `${preCleared} test${preCleared === 1 ? '' : 's'} pre-cleared from datasheets and certificates. The rest can't be vouched for on paper: pay the lab to find out, or submit blind.`}</p>`
      : '';

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
        ${preClearNote}
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

  // Assemble a mini-game's config, applying the design-driven difficulty.
  // Every peak / stress point is shifted by the part (or material) it comes
  // from, and carries a `note` explaining that shift so the bench and the
  // pre-clearance text can credit or blame the actual sourcing decision.
  function buildMinigameConfig(test) {
    const raw = cfg[test.minigame];
    const supplierComps = def.components.filter(c => c.kind === 'supplier');
    const partFor = (comp) => comp ? getPart(comp, p.selectedSuppliers[comp.id]) : null;
    if (test.minigame === 'emc') {
      const peaks = raw.peaks.map(pk => {
        if (pk.excess <= 0) return { ...pk };   // authored as already-filtered; leave it
        // Tied part: explicit `component`, else the average of everything
        // sourced (overall board quality).
        const comp = pk.component ? def.components.find(c => c.id === pk.component) : null;
        const part = partFor(comp);
        let rating, who;
        if (part) { rating = part.rating; who = `${part.mfr} ${part.name}`; }
        else {
          const parts = supplierComps.map(partFor).filter(Boolean);
          rating = parts.length ? parts.reduce((a, x) => a + x.rating, 0) / parts.length : 3;
          who = 'the board as a whole';
        }
        const shift = shiftFor(rating);
        const excess = pk.excess + shift;
        const note = shift < 0
          ? `${who} is well-documented: the ${pk.label} sits ${-shift} dB lower than a typical build${excess <= 0 ? ', under the limit' : ''}.`
          : shift > 0
            ? `${who} is a cheap, thinly-documented part: the ${pk.label} is ${shift} dB worse than a typical build.`
            : `${who} is average: the ${pk.label} is where a typical build puts it.`;
        return { ...pk, excess, note };
      });
      return { standardLabel: raw.standardLabel, maxApplications: raw.maxApplications, peaks };
    }

    if (test.minigame === 'droptest') {
      const matComp = def.components.find(c => c.kind === 'material');
      const mat = matComp ? getMaterial(p.selectedMaterials[matComp.id]) : null;
      const proc = getProcess(p.selectedProcess);
      const matShift = shiftFor(mat?.toughness ?? 3);
      const procShift = proc?.id === '3dprint' ? 3 : 0;
      const points = raw.points.map(pt => {
        if (pt.weakness <= 0) return { ...pt };
        const weakness = pt.weakness + matShift + procShift;
        const parts = [];
        if (mat) parts.push(matShift < 0
          ? `${mat.name} is tough (${mat.toughness}/5): every stress point takes ${-matShift} less strain than a typical build`
          : matShift > 0
            ? `${mat.name} is brittle (${mat.toughness}/5): every stress point takes ${matShift} more strain than a typical build`
            : `${mat.name} is average toughness: stress points behave like a typical build`);
        if (procShift) parts.push('3D-printed layers add strain at every joint');
        return { ...pt, weakness, note: parts.join('; ') + '.' };
      });
      return { ...raw, points };
    }

    return { ...raw };
  }

  render();
}
