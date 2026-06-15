// Central game state: a single object, with save/load to localStorage.
// Sandbox fields are declared now but inert in v1 (see PLAN.md §1 "sandbox hooks").

import { getCharacter } from './content/characters.js';

const SAVE_KEY = 'papers-please-save-v1';

export const PHASES = ['brief', 'design', 'testing', 'certification', 'manufacturing', 'launch'];

function blankState() {
  return {
    version: 1,
    character: null,        // 'mina' | 'leo' | 'samira'
    productIndex: 0,
    phase: 'brief',
    budget: 0,
    reputation: 50,
    staffMorale: {},        // staffId -> 0..100
    product: null,          // live working copy, populated when a product starts
    unlockedRegulations: [],
    inbox: [],
    competitorProgress: 0,  // 0..100

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
    budgetAllocation: { ...def.defaultBudgetAllocation },
    targetPrice: def.priceRange.default,
    // populated by later phases
    selectedMaterials: {},
    selectedSuppliers: {},
    selectedProcess: null,
    technicalFile: null,
    testResults: [],
    certification: null,    // { resolved: {id:'corrected'|'argued'}, deskCleared, granted }
    manufacturing: null,    // { factory, inspection:{id:'accept'|'reject'}, marks:[] }
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
    if (!parsed || parsed.version !== 1 || !parsed.character) return null;
    state = { ...blankState(), ...parsed };
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
