// Final scorecard for a completed product. Pure function of accumulated state.
// All numbers are tunable here, deliberately isolated from engine/UI for
// later playtesting (see PLAN.md §4).

import { getCharacter } from '../content/characters.js';
import { getMarket } from '../content/markets.js';
import { getMaterial, getPart, getProcess } from '../content/materials.js';
import { productCaps } from './economy.js';

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

function letterGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'C-';
  if (score >= 50) return 'D';
  return 'F';
}

// Sales / revenue model. Demand is base reach scaled by:
//   value      — quality vs price (overpricing junk craters demand)
//   capability — losing a buyer-valued feature the competitor has (Stage D)
//   time       — competitor progress steals share
//   marketing  — ad-spend reach multiplier (Stage C)
// You can only sell what you ordered; unsold units are dead loss.
export function computeSales(state, def, satisfaction) {
  const p = state.product;
  const reach = p.selectedMarkets.reduce((sum, id) => sum + (getMarket(id)?.size ?? 0), 0);
  const price = p.targetPrice;
  const pr = def.priceRange;

  const quality01 = clamp(satisfaction, 0, 100) / 100;
  const pricePos = Math.max(0, Math.min(1, (price - pr.min) / (pr.max - pr.min)));
  const value = quality01 - pricePos;                  // -1..+1; negative = overpriced
  // Asymmetric: good value lifts demand modestly; bad value (overpriced junk)
  // collapses it hard — a flop should actually flop.
  const valueFactor = value >= 0
    ? Math.min(1.6, 1 + 0.8 * value)
    : Math.max(0.05, 1 + 2.4 * value);

  // Capability vs competitor: lose a slice for each buyer-valued cap the rival has
  // and you don't.
  const valued = def.market?.valuedCaps || {};
  const myCaps = productCaps(p, def);
  const compCaps = def.competitor?.caps || {};
  let capFactor = 1; const lostCaps = [];
  for (const [cap, weight] of Object.entries(valued)) {
    if (compCaps[cap] && !myCaps[cap]) { capFactor *= (1 - weight); lostCaps.push(cap); }
  }

  const timeFactor = Math.max(0.35, 1 - state.competitorProgress / 130);
  const marketingMult = p.marketingResult?.reachMult ?? 1;

  const demand = Math.round(def.phases.launch.baseUnits * reach * valueFactor * capFactor * timeFactor * marketingMult);
  const ordered = p.orderQty ?? demand;
  const units = Math.max(0, Math.min(demand, ordered));
  const unsold = Math.max(0, ordered - units);
  const revenue = Math.round(units * price);
  const spent = getCharacter(state.character).startBudget - state.budget;
  const profit = revenue - spent;
  return {
    units, demand, ordered, unsold, revenue, spent, profit,
    marketShare: Math.round(Math.min(1, timeFactor * capFactor * valueFactor) * 100),
    valueFactor: Number(valueFactor.toFixed(2)), capFactor: Number(capFactor.toFixed(2)), lostCaps
  };
}

export function computeScorecard(state, def) {
  const p = state.product;
  const character = getCharacter(state.character);
  const matComp = def.components.find(c => c.kind === 'material');
  const material = matComp ? getMaterial(p.selectedMaterials[matComp.id]) : null;

  const supplierRatings = def.components
    .filter(c => c.kind === 'supplier')
    .map(c => getPart(c, p.selectedSuppliers[c.id])?.rating ?? 3);
  const supplierAvg = supplierRatings.length
    ? supplierRatings.reduce((a, b) => a + b, 0) / supplierRatings.length : 3;

  // first-article inspection score (default neutral if somehow skipped)
  const inspectionScore = p.manufacturing?.inspectionScore ?? 70;

  const metrics = {
    certification: clamp(50 + state.reputation),              // reputation reflects how smoothly it went
    budget:        clamp(Math.round(state.budget / character.startBudget * 100)),
    time:          clamp(100 - state.competitorProgress),
    satisfaction:  clamp(Math.round(
                     0.45 * (supplierAvg * 20) +
                     0.30 * ((material?.acoustics ?? 3) * 20) +
                     0.25 * inspectionScore +
                     (p.launch?.satisfactionAdj ?? 0))),
    sustainability: clamp((material?.recyclability ?? 2) * 20 +
                     (material?.consequences?.some(c => c.kind === 'boost') ? 10 : 0))
  };

  const overall = Math.round(
    (metrics.certification + metrics.budget + metrics.time + metrics.satisfaction + metrics.sustainability) / 5
  );

  return { metrics, overall, grade: letterGrade(overall) };
}
