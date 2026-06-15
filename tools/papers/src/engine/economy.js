// Economy spine: the single source of truth for cost-per-device.
//
// unitCost = Σ selected part unitCost (incl. enclosure material) + per-unit assembly.
// Design shows it live; Production turns it into an order cost; Launch turns the
// gap between price and unitCost into profit. Keeping it here means every screen
// computes the same number the same way.

import { getMaterial, getPart } from '../content/materials.js';

// Resolve the chosen option object for a component slot, new-schema or legacy.
export function selectedPart(comp, p) {
  if (comp.kind === 'material') return getMaterial(p.selectedMaterials[comp.id]);
  return getPart(comp, p.selectedSuppliers[comp.id]);
}

// Per-device bill-of-materials cost for the current selections. Missing
// selections contribute 0 so the readout climbs as the player fills slots in.
export function unitCost(p, def) {
  let sum = 0;
  for (const comp of def.components) {
    const opt = selectedPart(comp, p);
    if (opt && typeof opt.unitCost === 'number') sum += opt.unitCost;
  }
  sum += p.manufacturing?.assemblyPerUnit || 0;
  return sum;
}

// True once every component slot has a selection (so the readout is complete).
export function allPartsChosen(p, def) {
  return def.components.every(comp => !!selectedPart(comp, p));
}

const money2 = (n) => '$' + n.toFixed(2);
export const fmtUnit = money2;

// Boolean capabilities the finished product actually has, unioned across every
// selected part (e.g. { wifi:true, bluetooth:true }). Drives capability-vs-
// competitor demand in the sales model (Stage D).
export function productCaps(p, def) {
  const caps = {};
  for (const comp of def.components) {
    const opt = selectedPart(comp, p);
    if (opt && opt.caps) for (const [k, v] of Object.entries(opt.caps)) if (v === true) caps[k] = true;
  }
  return caps;
}

// Roll each part's latent risk ONCE per product and persist on p.riskRolls, so a
// 0.25-risk part is fine ~3 of 4 playthroughs but reloads don't re-roll. Caller
// saves. Returns the rolls map.
export function rollRisks(p, def) {
  if (p.riskRolls && p.riskRolls._done) return p.riskRolls;
  const rolls = { _done: true };
  for (const comp of def.components) {
    const opt = selectedPart(comp, p);
    if (!opt || typeof opt.riskChance !== 'number' || opt.riskChance <= 0) continue;
    rolls[opt.id] = {
      fired: Math.random() < opt.riskChance,
      text: opt.risk?.text || `${opt.name} developed an unexpected fault in the field.`,
      comp: comp.name
    };
  }
  p.riskRolls = rolls;
  return rolls;
}

// Risks that actually fired this playthrough.
export function firedRisks(p) {
  return Object.entries(p.riskRolls || {})
    .filter(([k, v]) => k !== '_done' && v.fired)
    .map(([id, v]) => ({ id, ...v }));
}
