// Cross-cutting event/modifier helpers.
//
// applyModifiers is the sandbox seam (PLAN.md §1): every cost/time outcome can
// be routed through here so later sandbox modifiers (country presence,
// factories, global shortages) attach without rewriting phase logic. Inert in
// v1 — it returns the base value unchanged.

import { state, save } from '../state.js';

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

// Every active sandbox modifier: world events, owned facilities, hired staff.
// Each may carry an `effects` map of { actionTag: multiplier }.
function activeModifiers() {
  return [...state.worldEvents, ...state.facilities, ...state.staffRoster];
}

// Route a cost/time value through the registered modifiers. Inert when none are
// active (returns base unchanged) — this is the sandbox seam from PLAN.md §1.
// action: a string tag (e.g. 'test-cost', 'cert-fee', 'factory-setup').
export function applyModifiers(action, base) {
  let v = base;
  for (const m of activeModifiers()) {
    const factor = m.effects && m.effects[action];
    if (typeof factor === 'number') v *= factor;
  }
  return Math.round(v);
}

export function getMorale(staffId) {
  return state.staffMorale[staffId] ?? 50;
}

export function adjustMorale(staffId, delta) {
  if (!(staffId in state.staffMorale)) return;
  state.staffMorale[staffId] = clamp(getMorale(staffId) + delta);
  save();
}
