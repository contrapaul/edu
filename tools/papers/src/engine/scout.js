// Competitor scouting: turns the GloboCorp progress bar from a passive meter
// into an active target. Spend cash to learn where the rival is stuck, then
// choose whether to spend more to press the advantage (real progress relief)
// or just bank the information for free. Capped per product so it's a
// resource to budget, not a free rewind button.
//
// Reuses state.competitor.intel — a field reserved for exactly this back in
// the original state shape but never wired up until now.

import { state, save, canSpend } from '../state.js';
import { applyModifiers, logLedger } from './events.js';
import { SCOUT_REPORTS } from '../content/scouting.js';
import { showPopup } from '../ui/popup.js';

const MAX_SCOUTS_PER_PRODUCT = 3;
const BASE_COST = 600;
const COST_STEP = 300;      // each use makes the next one pricier — a rival on alert
const EXPLOIT_COST = 1200;
const EXPLOIT_RELIEF = 12;  // competitorProgress points

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

export function scoutsUsed() {
  return state.competitor.intel || 0;
}

export function scoutsRemaining() {
  return Math.max(0, MAX_SCOUTS_PER_PRODUCT - scoutsUsed());
}

export function scoutCost() {
  return applyModifiers('scout-cost', BASE_COST + scoutsUsed() * COST_STEP);
}

export function canScout() {
  return !!state.product && !state.bankrupt && scoutsRemaining() > 0 && canSpend(scoutCost());
}

// Runs the scouting action: charges the fee, shows the field report, and lets
// the player choose to press the advantage (extra cost, real relief) or just
// keep the intel. `onResolved` fires once the popup choice is made, so the
// caller can refresh its HUD.
export function runScout(onResolved) {
  if (!canScout()) return;
  const cost = scoutCost();
  state.budget -= cost;
  logLedger('Competitor scouting', -cost);
  state.competitor.intel = scoutsUsed() + 1;
  save();

  const report = SCOUT_REPORTS[Math.floor(Math.random() * SCOUT_REPORTS.length)];
  const exploitCost = applyModifiers('scout-exploit-cost', EXPLOIT_COST);

  showPopup({
    name: 'Field Report',
    role: 'Competitive intelligence',
    text: `Your scout on GloboCorp: “${report}”`,
    choices: [
      {
        label: 'Press the advantage',
        hint: `Costs ${money(exploitCost)}. GloboCorp loses ground (−${EXPLOIT_RELIEF} progress).`,
        onSelect: () => {
          if (canSpend(exploitCost)) {
            state.budget -= exploitCost;
            logLedger('Pressed advantage over GloboCorp', -exploitCost);
            state.competitorProgress = Math.max(0, state.competitorProgress - EXPLOIT_RELIEF);
          }
          save();
          onResolved && onResolved();
        }
      },
      {
        label: 'Just bank the intel',
        hint: 'No further cost. No change to their progress.',
        onSelect: () => { save(); onResolved && onResolved(); }
      }
    ]
  });
}
