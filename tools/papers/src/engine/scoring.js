// Final scorecard for a completed product. Pure function of accumulated state.
// All numbers are tunable here, deliberately isolated from engine/UI for
// later playtesting (see PLAN.md §4).

import { getCharacter } from '../content/characters.js';
import { getMarket } from '../content/markets.js';
import { getMaterial, getSupplier, getProcess } from '../content/materials.js';

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

// Sales / revenue model — simple, deterministic, tunable.
export function computeSales(state, def, satisfaction) {
  const reach = state.product.selectedMarkets
    .reduce((sum, id) => sum + (getMarket(id)?.size ?? 0), 0);
  const price = state.product.targetPrice;
  const priceFactor = clamp(1.4 - price / 150, 0.4, 1.3);
  const timeFactor = 1 - state.competitorProgress / 200;      // rivals steal share
  const qualityFactor = 0.7 + (satisfaction / 100) * 0.5;     // reviews drive sales

  const units = Math.round((def.phases.launch.baseUnits) * reach * priceFactor * timeFactor * qualityFactor);
  const revenue = Math.round(units * price);
  const spent = getCharacter(state.character).startBudget - state.budget;
  const profit = revenue - spent;
  return { units, revenue, spent, profit, marketShare: Math.round(timeFactor * 100) };
}

export function computeScorecard(state, def) {
  const p = state.product;
  const character = getCharacter(state.character);
  const matComp = def.components.find(c => c.kind === 'material');
  const material = matComp ? getMaterial(p.selectedMaterials[matComp.id]) : null;

  const supplierRatings = Object.values(p.selectedSuppliers)
    .map(id => getSupplier(id)?.rating ?? 3);
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
