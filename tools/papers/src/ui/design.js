// Phase 2 — Initial Design & Prototype.
// Choose enclosure material, source electronic components, pick a manufacturing
// process. Selections drive a live consequences panel and produce a
// Preliminary Technical File that later phases consume.

import { state, save } from '../state.js';
import {
  ENCLOSURE_MATERIALS, SUPPLIERS, MANUFACTURING_PROCESSES,
  getMaterial, getPart, getProcess
} from '../content/materials.js';
import { adjustMorale } from '../engine/events.js';
import { unitCost } from '../engine/economy.js';

const money2 = (n) => '$' + n.toFixed(2);

const stars = (n) => '★★★★★'.slice(0, n).padEnd(5, '☆');
const dots  = (n) => '●●●●●'.slice(0, n).padEnd(5, '○');

export function renderDesign(container, ctx) {
  const { def } = ctx;
  const design = def.phases.design;
  const p = state.product;
  const supplierComps = def.components.filter(c => c.kind === 'supplier');
  const matComp = def.components.find(c => c.kind === 'material');
  const matKey = matComp.id;   // slot key in p.selectedMaterials (e.g. 'enclosure', 'case')

  const materialCards = ENCLOSURE_MATERIALS.map(m => {
    const on = p.selectedMaterials[matKey] === m.id ? ' on' : '';
    return `<button class="opt material-opt${on}" data-material="${m.id}">
      <span class="opt-name">${m.name}${typeof m.unitCost === 'number' ? `<span class="opt-unitcost">${money2(m.unitCost)}/unit</span>` : ''}</span>
      <span class="opt-props">
        <span>Cost ${dots(m.cost)}</span>
        <span>Fire: ${m.fireRating}</span>
        <span>Recycl. ${dots(m.recyclability)}</span>
        <span>Acoustics ${dots(m.acoustics)}</span>
        ${m.prop65Risk ? '<span class="opt-warn">Prop 65 risk</span>' : ''}
      </span>
    </button>`;
  }).join('');

  const supplierBlocks = supplierComps.map(comp => {
    const parts = comp.options || SUPPLIERS;
    const cards = parts.map(s => {
      const on = p.selectedSuppliers[comp.id] === s.id ? ' on' : '';
      const cost = typeof s.unitCost === 'number'
        ? `<span class="opt-unitcost">${money2(s.unitCost)}/unit</span>` : '';
      const mfr = s.mfr ? `<span class="opt-mfr">${s.mfr}</span>` : '';
      return `<button class="opt supplier-opt${on}" data-comp="${comp.id}" data-supplier="${s.id}">
        <span class="opt-name">${s.name}${cost}</span>
        ${mfr}
        <span class="opt-stars" title="Sourcing / compliance rating">${stars(s.rating)}</span>
        <span class="opt-note">${s.note}</span>
      </button>`;
    }).join('');
    return `<div class="supplier-block">
      <h3>${comp.name}${comp.critical ? ' <span class="crit">critical</span>' : ''}</h3>
      ${comp.note ? `<p class="comp-hint">${comp.note}</p>` : ''}
      <div class="opt-grid">${cards}</div>
    </div>`;
  }).join('');

  const processCards = MANUFACTURING_PROCESSES.map(pr => {
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
  }).join('');

  container.innerHTML = `
    <div class="phase phase-design">
      <p class="phase-intro">${design.intro}</p>
      <p class="steve-note">${design.steveNote}</p>

      <div class="design-grid">
        <div class="design-main">
          <h2>1 · Enclosure material</h2>
          <div class="opt-grid">${materialCards}</div>

          <h2>2 · Component sourcing</h2>
          ${supplierBlocks}

          <h2>3 · Manufacturing process</h2>
          <div class="opt-grid">${processCards}</div>
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
      out.push({ kind: 'risk', src: 'Manufacturing',
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
    const cons = gatherConsequences();
    const list = container.querySelector('#cons-list');
    if (cons.length === 0) {
      list.innerHTML = `<li class="cons-empty">Make your selections to see consequences.</li>`;
    } else {
      list.innerHTML = cons.map(c =>
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
    msg.textContent = !matChosen ? 'Choose an enclosure material.'
      : !allSuppliers ? 'Source every component.'
      : !procChosen ? 'Pick a manufacturing process.'
      : !compatible ? 'Material and process are incompatible.'
      : '';
  }

  // --- listeners ---
  container.querySelectorAll('[data-material]').forEach(btn => {
    btn.addEventListener('click', () => {
      p.selectedMaterials[matKey] = btn.dataset.material;
      container.querySelectorAll('[data-material]').forEach(b => b.classList.toggle('on', b === btn));
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

  container.querySelectorAll('[data-process]').forEach(btn => {
    btn.addEventListener('click', () => {
      p.selectedProcess = btn.dataset.process;
      container.querySelectorAll('[data-process]').forEach(b => b.classList.toggle('on', b === btn));
      refresh(); save();
    });
  });

  container.querySelector('#gen-tf').addEventListener('click', () => {
    p.technicalFile = {
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
