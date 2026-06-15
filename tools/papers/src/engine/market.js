// Stage E — concurrent post-launch markets.
// Each launched product opens a market that keeps selling in the BACKGROUND as
// the company clock advances: while you develop the next product, the previous
// one is still posting monthly sales (and burning through its inventory). Demand
// decays with novelty, drops once that product's rival ships, and can be propped
// up with more marketing. Markets are ticked by the clock, not by hand.

import { state, save } from '../state.js';
import { logLedger } from './events.js';

const DECAY = 0.78;            // monthly novelty decay
const MAX_MONTHS = 8;
const COMPETITOR_FACTOR = 0.5; // demand multiplier once this product's rival ships
const MONTH = 30;

// Open a market for the product that just launched. `grade` is snapshotted now
// (development quality is fixed at launch) so a market can close in the
// background without needing the old product's full state.
export function openMarket(def, sales, scorecard) {
  const p = state.product;
  const reach = p.marketingResult?.reachMult ?? 1;
  const rawDemand = sales.demand / (reach || 1);     // strip the launch ad boost; re-applied via adStock
  const m = {
    productId: def.id,
    name: p.name,
    price: p.targetPrice,
    inventory: p.orderQty ?? sales.units,
    sold: 0,
    month: 0,
    baseMonthly: Math.max(1, Math.round(rawDemand / 6)),
    adStock: reach,
    adSpentThisMonth: 0,
    compProgress: state.competitorProgress || 0,
    competitorLaunched: false,
    cumRevenue: 0,
    reports: [],
    nextTickDay: state.clock.day + MONTH,
    closed: false,
    grade: scorecard?.grade ?? null,
    overall: scorecard?.overall ?? null,
    metrics: scorecard?.metrics ?? null,
    lostCaps: sales.lostCaps ?? []
  };
  state.markets.push(m);
  save();
  return m;
}

export const getMarket = (productId) => state.markets.find(m => m.productId === productId) || null;
export const openMarkets = () => state.markets.filter(m => !m.closed);

// Spend cash now to lift a market's marketing strength (diminishing returns).
export function boostMarketing(productId, amount) {
  const m = getMarket(productId);
  if (!m || m.closed || amount <= 0 || amount > state.budget) return false;
  state.budget -= amount;
  logLedger(`Marketing top-up — ${m.name}`, -amount);
  m.adSpentThisMonth += amount;
  m.adStock += Math.sqrt(amount / 1000) / 6;
  save();
  return true;
}

// Advance every open market to the current clock day, posting a report per month
// elapsed. Called by advanceTime, so markets tick whatever you're doing.
export function tickMarkets() {
  for (const m of state.markets) {
    while (!m.closed && state.clock.day >= m.nextTickDay) {
      monthTick(m);
      m.nextTickDay += MONTH;
    }
  }
}

function monthTick(m) {
  m.month += 1;
  const decay = Math.pow(DECAY, m.month - 1);
  const compFactor = m.competitorLaunched ? COMPETITOR_FACTOR : 1;
  const demand = Math.round(m.baseMonthly * m.adStock * decay * compFactor);
  const available = m.inventory - m.sold;
  const units = Math.max(0, Math.min(available, demand));
  const revenue = units * m.price;
  const adSpend = m.adSpentThisMonth;

  if (revenue > 0) { state.budget += revenue; logLedger(`Sales — ${m.name} m${m.month}`, revenue); }
  m.sold += units;
  m.cumRevenue += revenue;
  m.reports.push({ month: m.month, units, revenue, adSpend, net: revenue - adSpend, competitor: m.competitorLaunched });
  m.adSpentThisMonth = 0;
  m.adStock = 1 + (m.adStock - 1) * 0.6;

  // This product's own rival closes in (separate from the new product's dev race).
  m.compProgress = Math.min(100, m.compProgress + 18);
  if (!m.competitorLaunched && m.compProgress >= 100) m.competitorLaunched = true;

  if (m.sold >= m.inventory || demand < m.baseMonthly * 0.08 || m.month >= MAX_MONTHS) m.closed = true;
  save();
}
