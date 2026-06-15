// Sandbox-layer definitions. Each item carries an `effects` map of
// { actionTag: multiplier } that engine/events.js applies to the matching
// cost/time value. Adding items here changes outcomes without touching phase
// logic — that's the whole point of the applyModifiers seam.
//
// Action tags currently routed through applyModifiers:
//   'test-cost'      — pre-certification test fees (Phase 3)
//   'cert-fee'       — document corrections + translation (Phase 4)
//   'factory-setup'  — factory tooling/setup cost (Phase 5)

// Global events the player can trigger (or that fire later automatically).
export const WORLD_EVENTS = [
  {
    id: 'chip-shortage', kind: 'event', label: 'Global Semiconductor Shortage',
    desc: 'Components and bench testing get pricier until supply recovers.',
    effects: { 'test-cost': 1.3, 'cert-fee': 1.2 }
  },
  {
    id: 'trade-tension', kind: 'event', label: 'Trade Tensions & New Tariffs',
    desc: 'Cross-border setup and certification fees rise.',
    effects: { 'factory-setup': 1.25, 'cert-fee': 1.15 }
  }
];

// Facilities the player can open. Owning one grants its effects permanently and
// can also relieve competitor pressure (time fast-tracked by local presence).
export const FACILITIES = [
  {
    id: 'fac-vn', kind: 'facility', label: 'Open a factory in Vietnam', cost: 30000,
    desc: 'Local manufacturing halves factory setup and trims the competitor lead.',
    effects: { 'factory-setup': 0.5 }, competitorRelief: 10
  },
  {
    id: 'fac-eu', kind: 'facility', label: 'Open an EU compliance office', cost: 40000,
    desc: 'Strong EU presence fast-tracks European certification paperwork.',
    effects: { 'cert-fee': 0.6 }
  }
];

// Staff the player can hire beyond the scripted three.
export const HIRES = [
  {
    id: 'hire-reg', kind: 'hire', label: 'Hire a Regulatory Contractor', cost: 15000,
    desc: 'Corrections and translations come cheaper; testing a touch faster.',
    effects: { 'cert-fee': 0.7, 'test-cost': 0.9 }
  },
  {
    id: 'hire-buyer', kind: 'hire', label: 'Hire a Supply-Chain Buyer', cost: 12000,
    desc: 'Better component deals soften shortages and trim test costs.',
    effects: { 'test-cost': 0.85 }
  }
];

export const ALL_SANDBOX = [...WORLD_EVENTS, ...FACILITIES, ...HIRES];
