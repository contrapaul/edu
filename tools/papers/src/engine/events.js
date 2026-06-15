// Cross-cutting event/modifier helpers.
//
// applyModifiers is the sandbox seam (PLAN.md §1): every cost/time outcome can
// be routed through here so later sandbox modifiers (country presence,
// factories, global shortages) attach without rewriting phase logic. Inert in
// v1 — it returns the base value unchanged.

import { state, save } from '../state.js';
import { getCharacter } from '../content/characters.js';

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

// --- Stage E: company clock, payroll, ledger -------------------------------
// Every staff member draws a monthly salary; time spent developing burns it.
export const SALARY_PER_STAFF_MONTH = 5000;

// Record a dated money movement (amount < 0 = expense) for the reports.
export function logLedger(label, amount) {
  state.ledger.push({ day: state.clock.day, label, amount: Math.round(amount) });
}

// Advance the company clock by `days`, deducting payroll for the elapsed time.
// Running the bank account dry trips the bankruptcy flag (handled by the engine).
export function advanceTime(days, label = 'Development') {
  if (!days || days <= 0) return;
  state.clock.day += days;
  const staffCount = getCharacter(state.character)?.staff.length || 0;
  const payroll = Math.round((SALARY_PER_STAFF_MONTH / 30) * staffCount * days);
  if (payroll > 0) {
    state.budget -= payroll;
    logLedger(`Payroll — ${label} (${days}d)`, -payroll);
  }
  if (state.budget < 0) state.bankrupt = true;
  save();
}

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
