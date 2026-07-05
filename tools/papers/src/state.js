// Central game state: a single object, with save/load to localStorage.
// Sandbox fields are declared now but inert in v1 (see PLAN.md §1 "sandbox hooks").

import { getCharacter } from './content/characters.js';

const SAVE_KEY = 'papers-please-save-v2';

export const PHASES = ['brief', 'design', 'testing', 'certification', 'production', 'marketing', 'launch'];

function blankState() {
  return {
    version: 2,
    character: null,        // 'mina' | 'leo' | 'samira'
    productIndex: 0,
    phase: 'brief',
    budget: 0,              // single live company cash pot — every spend deducts from here
    reputation: 50,
    staffMorale: {},        // staffId -> 0..100
    product: null,          // live working copy, populated when a product starts
    unlockedRegulations: [],
    inbox: [],
    competitorProgress: 0,  // 0..100

    // --- economy / simulation (Stage E fills clock/ledger/market) ---
    clock: { day: 0 },
    creditLimit: 0,         // how far cash may go negative (a credit line) before insolvency
    bankrupt: false,        // tripped only when debt blows past the credit limit
    ledger: [],             // dated { day, label, amount } entries (amount<0 = expense)
    competitor: { progress: 0, launched: false, capabilities: {}, intel: 0 },
    markets: [],            // post-launch ongoing per-product sales states (concurrent)
    companyFixes: [],       // company-level fixes that persist across products (e.g. 'address')

    // --- ambient interactive notifications (mid-phase popups) ---
    seenNotifications: [],  // notification ids already fired (each fires once per game)
    lastNotifyDay: -999,    // clock.day of the last notification, for cooldown spacing

    // --- sandbox hooks (inert in v1) ---
    countryPresence: {},
    facilities: [],
    staffRoster: [],
    worldEvents: [],
    namedProducts: {}
  };
}

// The live state object. Mutate via the helpers below so save() stays consistent.
export let state = blankState();

export function newGame(characterId) {
  const character = getCharacter(characterId);
  if (!character) throw new Error(`Unknown character: ${characterId}`);

  state = blankState();
  state.character = characterId;
  state.budget = character.startBudget;
  // A credit line worth half the starting cash: room to weather payroll and
  // finance a production run, but not infinite.
  state.creditLimit = Math.round(character.startBudget * 0.5);
  state.staffMorale = Object.fromEntries(character.staff.map(s => [s.id, 70]));
  save();
  return state;
}

// Initialise the live working copy of a product from its definition.
// Idempotent guard: only creates a fresh copy if none exists for this product.
export function initProduct(def) {
  if (state.product && state.product.id === def.id) return state.product;
  state.product = {
    id: def.id,
    name: def.name,
    selectedMarkets: [],
    requiredStandards: [],
    // pricing is now set late (Production phase); this default is a fallback
    targetPrice: def.priceRange.default,
    priceSet: false,        // becomes true once the player commits a price in Production
    // populated by later phases
    selectedMaterials: {},
    selectedSuppliers: {},  // slot id -> selected part-option id (or legacy supplier id)
    selectedProcess: null,
    investigated: { materials: [], suppliers: [] },  // ids paid to reveal hidden risk on, before committing
    technicalFile: null,
    testResults: [],
    certification: null,    // { resolved: {id:'corrected'|'argued'}, deskCleared, granted }
    manufacturing: null,    // { factory, inspection:{id:'accept'|'reject'}, marks:[], assemblyPerUnit }
    // --- new economy fields ---
    unitCost: 0,            // computed cache: bill-of-materials per device
    orderQty: null,         // set in Production
    marketing: {},          // channelId -> spend
    riskRolls: {},          // partId -> { fired, mitigated }
    launch: null,           // { fieldResolved, response, scorecard }
    issues: []
  };
  save();
  return state.product;
}

// Advance to a specific phase (validated against PHASES order is caller's job).
export function setPhase(phase) {
  if (!PHASES.includes(phase)) throw new Error(`Unknown phase: ${phase}`);
  state.phase = phase;
  save();
}

export function nextPhase() {
  const i = PHASES.indexOf(state.phase);
  if (i >= 0 && i < PHASES.length - 1) setPhase(PHASES[i + 1]);
}

// Add a standard to the player's Regulatory Library (deduped).
export function unlockRegulation(id) {
  if (!state.unlockedRegulations.includes(id)) {
    state.unlockedRegulations.push(id);
    save();
  }
}

// Cash you can still spend = current cash plus the unused credit line.
export function spendable() {
  return state.budget + (state.creditLimit || 0);
}
// Can this cost be covered without blowing past the credit line?
export function canSpend(cost) {
  return cost <= spendable();
}
// Current debt (0 when in the black).
export function debt() {
  return state.budget < 0 ? -state.budget : 0;
}

export function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save game:', e);
  }
}

// Returns the loaded state if a valid save exists, otherwise null.
export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 2 || !parsed.character) return null;
    state = { ...blankState(), ...parsed };
    // Backfill a credit line for saves made before the loan system existed.
    if (!state.creditLimit) {
      const ch = getCharacter(state.character);
      state.creditLimit = ch ? Math.round(ch.startBudget * 0.5) : 50000;
    }
    return state;
  } catch (e) {
    console.warn('Could not load game:', e);
    return null;
  }
}

export function hasSave() {
  return load() !== null;
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.warn('Could not clear save:', e);
  }
  state = blankState();
}
