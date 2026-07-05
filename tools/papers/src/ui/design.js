// Phase 2 — Initial Design & Prototype.
// Choose enclosure material, source electronic components, pick a manufacturing
// process. Selections drive a live consequences panel and produce a
// Preliminary Technical File that later phases consume.

import { state, save, canSpend } from '../state.js';
import {
  SUPPLIERS, MANUFACTURING_PROCESSES,
  getMaterial, getPart, getProcess, materialsForSet
} from '../content/materials.js';
import { adjustMorale, advanceTime, applyModifiers, logLedger } from '../engine/events.js';
import { unitCost } from '../engine/economy.js';

const money2 = (n) => '$' + n.toFixed(2);
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

const stars = (n) => '★★★★★'.slice(0, n).padEnd(5, '☆');
const dots  = (n) => '●●●●●'.slice(0, n).padEnd(5, '○');

const INVESTIGATE_COST = 350;

// The same risk logic gatherConsequences() uses for the *selected* option,
// generalized to any option so it can be investigated before committing.
const materialRisks = (m) => m.consequences.filter(c => c.kind === 'risk').map(c => c.text);
const supplierRisk = (s, comp) => !s.docsComplete
  ? `${s.name} can't supply complete certs${comp.critical ? ' — and this is a critical safety part.' : '.'}`
  : null;

// Renders either the revealed risk note (once paid for) or the investigate
// button (before). `risks` is an array of strings — empty means "clean."
function investigateHTML(revealed, risks, attrs) {
  if (revealed) {
    return risks.length
      ? `<div class="opt-risk-note risk">🔍 ${risks.join(' ')}</div>`
      : `<div class="opt-risk-note clean">🔍 No hidden risks found — this one's clean.</div>`;
  }
  const cost = applyModifiers('investigate-cost', INVESTIGATE_COST);
  return `<button class="opt-investigate" ${attrs} ${canSpend(cost) ? '' : 'disabled'}>🔍 Investigate · ${money(cost)}</button>`;
}

export function renderDesign(container, ctx) {
  const { def } = ctx;
  const design = def.phases.design;
  const p = state.product;
  const supplierComps = def.components.filter(c => c.kind === 'supplier');
  const matComp = def.components.find(c => c.kind === 'material');
  const matKey = matComp.id;   // slot key in p.selectedMaterials (e.g. 'enclosure', 'case')
  const materials = materialsForSet(matComp.materialSet);

  // Cards show neutral datasheet specs only. We deliberately do NOT flag
  // downstream risks here (flammability, Prop 65) — those are for the player to
  // weigh and, if they get it wrong, discover in testing/certification.
  const materialCards = materials.map(m => {
    const on = p.selectedMaterials[matKey] === m.id ? ' on' : '';
    return `<div class="opt-wrap">
      <button class="opt material-opt${on}" data-material="${m.id}">
        <span class="opt-name">${m.name}${typeof m.unitCost === 'number' ? `<span class="opt-unitcost">${money2(m.unitCost)}/unit</span>` : ''}</span>
        <span class="opt-props">
          <span>Cost ${dots(m.cost)}</span>
          <span>Fire: ${m.fireRating}</span>
          <span>Recycl. ${dots(m.recyclability)}</span>
          <span>Tough ${dots(m.toughness)}</span>
        </span>
      </button>
      ${investigateHTML(p.investigated.materials.includes(m.id), materialRisks(m), `data-inv-material="${m.id}"`)}
    </div>`;
  }).join('');

  const supplierBlocks = supplierComps.map(comp => {
    const parts = comp.options || SUPPLIERS;
    const cards = parts.map(s => {
      const on = p.selectedSuppliers[comp.id] === s.id ? ' on' : '';
      const cost = typeof s.unitCost === 'number'
        ? `<span class="opt-unitcost">${money2(s.unitCost)}/unit</span>` : '';
      const mfr = s.mfr ? `<span class="opt-mfr">${s.mfr}</span>` : '';
      const invKey = `${comp.id}:${s.id}`;
      const risk = supplierRisk(s, comp);
      return `<div class="opt-wrap">
        <button class="opt supplier-opt${on}" data-comp="${comp.id}" data-supplier="${s.id}">
          <span class="opt-name">${s.name}${cost}</span>
          ${mfr}
          <span class="opt-stars" title="Sourcing / compliance rating">${stars(s.rating)}</span>
          <span class="opt-note">${s.note}</span>
        </button>
        ${investigateHTML(p.investigated.suppliers.includes(invKey), risk ? [risk] : [], `data-inv-supplier="${invKey}"`)}
      </div>`;
    }).join('');
    return `<div class="supplier-block">
      <h3>${comp.name}${comp.critical ? ' <span class="crit">critical</span>' : ''}</h3>
      ${comp.note ? `<p class="comp-hint">${comp.note}</p>` : ''}
      <div class="opt-grid">${cards}</div>
    </div>`;
  }).join('');

  // Only the processes the chosen material can actually be made by — so the list
  // is product-appropriate (no "injection-mould this stainless bottle").
  function processCardsHTML() {
    const mat = getMaterial(p.selectedMaterials[matKey]);
    if (!mat) return `<p class="panel-hint">Choose a material first — it determines how the product can be made.</p>`;
    const compat = MANUFACTURING_PROCESSES.filter(pr => mat.processes.includes(pr.id));
    return `<div class="opt-grid">${compat.map(pr => {
      const on = p.selectedProcess === pr.id ? ' on' : '';
      return `<button class="opt process-opt${on}" data-process="${pr.id}">
        <span class="opt-name">${pr.name}</span>
        <span class="opt-props">
          <span>Setup ${dots(pr.setupCost)}</span>
          <span>Per-unit ${dots(pr.perUnit)}</span>
          <span>Precision ${dots(pr.precision)}</span>
        </span>
        <span class="opt-note">${pr.note}</span>
      </button>`;
    }).join('')}</div>`;
  }

  container.innerHTML = `
    <div class="phase phase-design">
      <p class="phase-intro">${design.intro}</p>
      <p class="steve-note">${design.steveNote}</p>

      <div class="design-grid">
        <div class="design-main">
          <h2>1 · ${matComp.name} material</h2>
          <div class="opt-grid">${materialCards}</div>

          <h2>2 · Component sourcing</h2>
          ${supplierBlocks}

          <h2>3 · Manufacturing process</h2>
          <div id="process-section">${processCardsHTML()}</div>
        </div>

        <aside class="consequences">
          <div class="unit-cost-card" id="unit-cost-card">
            <span class="ucc-label">Cost per device</span>
            <span class="ucc-val" id="ucc-val">—</span>
            <span class="ucc-note" id="ucc-note">Pick every component to see the full bill of materials.</span>
          </div>
          <h3>Design consequences</h3>
          <ul class="cons-list" id="cons-list"></ul>
          <div class="phase-actions">
            <button class="btn-primary" id="gen-tf" disabled>Generate Technical File →</button>
            <span class="confirm-msg" id="design-msg"></span>
          </div>
        </aside>
      </div>
    </div>`;

  // --- live consequences ---
  function gatherConsequences() {
    const out = [];
    const mat = getMaterial(p.selectedMaterials[matKey]);
    if (mat) mat.consequences.forEach(c => out.push({ ...c, src: mat.name }));

    supplierComps.forEach(comp => {
      const s = getPart(comp, p.selectedSuppliers[comp.id]);
      if (!s) return;
      if (!s.docsComplete) {
        out.push({
          kind: 'risk', src: comp.name,
          text: `${s.name} can't supply complete certs${comp.critical ? ' — and this is a critical safety part.' : '.'}`
        });
      }
    });

    const proc = getProcess(p.selectedProcess);
    if (mat && proc && !mat.processes.includes(proc.id)) {
      // A hard, immediate design constraint (kind 'block') — not a downstream
      // telegraph — so it stays visible and gates generation.
      out.push({ kind: 'block', src: 'Manufacturing',
        text: `${mat.name} can't be made by ${proc.name}. Pick a compatible process.` });
    }
    return out;
  }

  function refreshUnitCost() {
    const chosen = supplierComps.every(c => p.selectedSuppliers[c.id]) && !!p.selectedMaterials[matKey];
    const uc = unitCost(p, def);
    p.unitCost = uc;
    const valEl = container.querySelector('#ucc-val');
    const noteEl = container.querySelector('#ucc-note');
    if (uc > 0) valEl.textContent = money2(uc); else valEl.textContent = '—';
    noteEl.textContent = chosen
      ? 'Full bill of materials. You set price and order size in Production.'
      : 'Running total — pick every component for the full bill of materials.';
    ctx.refreshHud();
  }

  function refresh() {
    refreshUnitCost();
    // Only show positives, neutral notes, and hard blocks. Downstream risks
    // ('risk') are recorded into the technical file but NOT telegraphed here —
    // the player has to make the call and live with it.
    const shown = gatherConsequences().filter(c => c.kind !== 'risk');
    const list = container.querySelector('#cons-list');
    if (shown.length === 0) {
      list.innerHTML = `<li class="cons-empty">Your choices look internally consistent. Whether they survive testing is another matter.</li>`;
    } else {
      list.innerHTML = shown.map(c =>
        `<li class="cons cons-${c.kind}"><b>${c.src}:</b> ${c.text}</li>`).join('');
    }

    const matChosen = !!p.selectedMaterials[matKey];
    const allSuppliers = supplierComps.every(c => p.selectedSuppliers[c.id]);
    const procChosen = !!p.selectedProcess;
    const mat = getMaterial(p.selectedMaterials[matKey]);
    const proc = getProcess(p.selectedProcess);
    const compatible = !(mat && proc) || mat.processes.includes(proc.id);

    const ready = matChosen && allSuppliers && procChosen && compatible;
    const btn = container.querySelector('#gen-tf');
    const msg = container.querySelector('#design-msg');
    btn.disabled = !ready;
    msg.textContent = !matChosen ? 'Choose a material.'
      : !allSuppliers ? 'Source every component.'
      : !procChosen ? 'Pick a manufacturing process.'
      : !compatible ? 'Material and process are incompatible.'
      : '';
  }

  // Rebuild + rebind the process cards (they depend on the chosen material).
  function renderProcesses() {
    const section = container.querySelector('#process-section');
    section.innerHTML = processCardsHTML();
    section.querySelectorAll('[data-process]').forEach(btn => {
      btn.addEventListener('click', () => {
        p.selectedProcess = btn.dataset.process;
        section.querySelectorAll('[data-process]').forEach(b => b.classList.toggle('on', b === btn));
        refresh(); save();
      });
    });
  }

  // --- listeners ---
  container.querySelectorAll('[data-material]').forEach(btn => {
    btn.addEventListener('click', () => {
      p.selectedMaterials[matKey] = btn.dataset.material;
      container.querySelectorAll('[data-material]').forEach(b => b.classList.toggle('on', b === btn));
      // Drop a now-incompatible process so you must re-pick a valid one.
      const mat = getMaterial(btn.dataset.material);
      if (p.selectedProcess && mat && !mat.processes.includes(p.selectedProcess)) p.selectedProcess = null;
      renderProcesses();
      refresh(); save();
    });
  });

  // Selecting/comparing suppliers is free — morale only moves when the design is
  // locked in (see the Generate Technical File handler below).
  container.querySelectorAll('[data-supplier]').forEach(btn => {
    btn.addEventListener('click', () => {
      const comp = btn.dataset.comp;
      p.selectedSuppliers[comp] = btn.dataset.supplier;
      container.querySelectorAll(`[data-comp="${comp}"]`).forEach(b => b.classList.toggle('on', b === btn));
      refresh(); save();
    });
  });

  // Pay to reveal an option's hidden risk BEFORE committing to it — a real
  // trade-off between cash now and gambling blind. Re-renders the whole phase
  // since the option card itself (not just the consequences panel) changes.
  container.querySelectorAll('[data-inv-material]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cost = applyModifiers('investigate-cost', INVESTIGATE_COST);
      if (!canSpend(cost)) return;
      state.budget -= cost;
      logLedger(`Investigate — ${getMaterial(btn.dataset.invMaterial)?.name || 'material'}`, -cost);
      p.investigated.materials.push(btn.dataset.invMaterial);
      save();
      ctx.refreshHud();
      renderDesign(container, ctx);
    });
  });
  container.querySelectorAll('[data-inv-supplier]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cost = applyModifiers('investigate-cost', INVESTIGATE_COST);
      if (!canSpend(cost)) return;
      const [compId, supId] = btn.dataset.invSupplier.split(':');
      const comp = supplierComps.find(c => c.id === compId);
      const part = comp ? getPart(comp, supId) : null;
      state.budget -= cost;
      logLedger(`Investigate — ${part?.name || 'supplier'}`, -cost);
      p.investigated.suppliers.push(btn.dataset.invSupplier);
      save();
      ctx.refreshHud();
      renderDesign(container, ctx);
    });
  });

  renderProcesses();   // bind the initial (material-filtered) process cards

  container.querySelector('#gen-tf').addEventListener('click', () => {
    const signature = JSON.stringify([p.selectedMaterials[matKey], p.selectedSuppliers, p.selectedProcess]);

    // If you came back and actually changed the design, the work downstream is
    // invalidated: tests, certification, the production order and risk rolls all
    // reset, and the lost time lets the competitor close in. Re-locking an
    // unchanged design is free.
    if (p.technicalFile && p.technicalFile.signature !== signature) {
      p.testResults = [];
      p.certification = null;
      p.manufacturing = null;
      p.launch = null;
      p.riskRolls = {};
      p.priceSet = false;
      p.orderQty = null;
      state.competitorProgress = Math.min(100, state.competitorProgress + 6);
      advanceTime(10, 'Redesign');   // reworking the design burns days (and payroll)
    }

    p.technicalFile = {
      signature,
      material: p.selectedMaterials[matKey],
      suppliers: { ...p.selectedSuppliers },
      process: p.selectedProcess,
      riskFlags: gatherConsequences().filter(c => c.kind === 'risk').map(c => `${c.src}: ${c.text}`)
    };

    // Apply team morale once, based on the FINAL sourcing decisions. Cheap parts
    // please the shortcut-liker and worry the compliance-minded; premium parts
    // the reverse. (Guarded so re-entering the locked design can't double-apply.)
    if (!p.moraleApplied) {
      const shortcut = ctx.character.staff.find(x => x.disposition === 'shortcut');
      const compliance = ctx.character.staff.find(x => x.disposition === 'compliance');
      for (const comp of supplierComps) {
        const s = getPart(comp, p.selectedSuppliers[comp.id]);
        if (!s) continue;
        if (s.rating <= 2) {
          if (shortcut) adjustMorale(shortcut.id, 4);
          if (compliance) adjustMorale(compliance.id, -5);
        } else if (s.rating >= 4) {
          if (compliance) adjustMorale(compliance.id, 4);
          if (shortcut) adjustMorale(shortcut.id, -2);
        }
      }
      p.moraleApplied = true;
    }

    save();
    ctx.advance();
  });

  refresh();
}
