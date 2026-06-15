// Stage E — post-launch market simulation.
// After launch the product doesn't just post one number: it enters an ongoing
// market that ticks a month at a time. Demand decays as the novelty fades and
// drops further once the competitor ships; you can re-inject marketing cash to
// prop it up. Each month posts an earnings/expense report. The market closes
// when inventory sells out, demand dies, or the run reaches its horizon.

import { state, save } from '../state.js';
import { getCharacter } from '../content/characters.js';
import { advanceTime, logLedger, SALARY_PER_STAFF_MONTH } from './events.js';

const MONTH_DAYS = 30;
const DECAY = 0.78;            // monthly novelty decay
const MAX_MONTHS = 8;
const COMPETITOR_FACTOR = 0.5; // demand multiplier once the rival ships

const payrollPerMonth = () =>
  Math.round((SALARY_PER_STAFF_MONTH / 30) * (getCharacter(state.character)?.staff.length || 0) * MONTH_DAYS);

// Begin the ongoing market from the one-shot launch demand.
export function initMarket(def, sales) {
  const p = state.product;
  const reach = p.marketingResult?.reachMult ?? 1;
  const rawDemand = sales.demand / (reach || 1);     // strip the launch ad boost; re-applied via adStock
  state.market = {
    productId: def.id,
    name: p.name,
    price: p.targetPrice,
    inventory: p.orderQty ?? sales.units,
    sold: 0,
    month: 0,
    baseMonthly: Math.max(1, Math.round(rawDemand / 6)),
    adStock: reach,
    adSpentThisMonth: 0,
    competitorLaunched: false,
    cumRevenue: 0,
    reports: [],
    closed: false
  };
  save();
  return state.market;
}

export function marketActive() {
  return state.market && state.market.productId === state.product?.id && !state.market.closed;
}

// Spend cash now to lift this month's marketing strength (diminishing returns).
export function boostMarketing(amount) {
  const m = state.market;
  if (!m || amount <= 0 || amount > state.budget) return false;
  state.budget -= amount;
  logLedger('Marketing top-up', -amount);
  m.adSpentThisMonth += amount;
  m.adStock += Math.sqrt(amount / 1000) / 6;   // e.g. ~+0.5 for $9k
  save();
  return true;
}

// Advance one month: sell from inventory, bank revenue, pay salaries, log a report.
export function tickMonth() {
  const m = state.market;
  if (!m || m.closed) return null;
  m.month += 1;

  const decay = Math.pow(DECAY, m.month - 1);
  const compFactor = m.competitorLaunched ? COMPETITOR_FACTOR : 1;
  const demand = Math.round(m.baseMonthly * m.adStock * decay * compFactor);
  const available = m.inventory - m.sold;
  const units = Math.max(0, Math.min(available, demand));

  const revenue = units * m.price;
  const adSpend = m.adSpentThisMonth;
  const payroll = payrollPerMonth();

  // Revenue lands first so a profitable month can't trip a false bankruptcy on payroll.
  if (revenue > 0) { state.budget += revenue; logLedger(`Sales — month ${m.month}`, revenue); }
  m.sold += units;
  m.cumRevenue += revenue;
  advanceTime(MONTH_DAYS, `Market month ${m.month}`);   // deducts payroll, logs it, may bankrupt

  m.reports.push({ month: m.month, units, revenue, adSpend, payroll, net: revenue - payroll - adSpend, competitor: m.competitorLaunched });
  m.adSpentThisMonth = 0;
  m.adStock = 1 + (m.adStock - 1) * 0.6;   // the boost fades toward baseline

  // The competitor closes in each month and eventually ships a rival.
  state.competitorProgress = Math.min(100, state.competitorProgress + 18);
  if (!m.competitorLaunched && state.competitorProgress >= 100) m.competitorLaunched = true;

  // Close when sold out, demand has withered, or the horizon is reached.
  if (m.sold >= m.inventory || demand < m.baseMonthly * 0.08 || m.month >= MAX_MONTHS) m.closed = true;

  save();
  return m.reports[m.reports.length - 1];
}
