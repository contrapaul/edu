// Shared catalogs for the Design phase: materials, component suppliers, and
// manufacturing processes. Products reference these by id so the data is reusable
// across product lines.
//
// MATERIAL SCHEMA (every material carries the full set so any downstream reader
// is safe regardless of which set a product draws from):
//   id, name, cost (1–5 relative), unitCost ($ per device)
//   fireRating (string), prop65Risk (bool)
//   recyclability, acoustics, aesthetics, toughness, insulation, reflectivity,
//   foodSafe  — all 1–5 scales; tests read the PROPERTY, never the id
//   processes (compatible manufacturing-process ids)
//   consequences: [{ kind: 'risk' | 'boost' | 'note', text }]  (drive Phase 2 panel)

// --- individual materials (defined once, composed into sets below) -----------
const M = {
  // General plastics / electronics enclosures
  abs: {
    id: 'abs', name: 'ABS Plastic', cost: 1, unitCost: 1.10, fireRating: 'UL94 HB', prop65Risk: false,
    recyclability: 2, acoustics: 4, aesthetics: 3, toughness: 3, insulation: 2, reflectivity: 1, foodSafe: 1,
    processes: ['injection', '3dprint'],
    consequences: [{ kind: 'risk', text: 'UL94 HB only — burns steadily, may fail flammability testing.' }]
  },
  pcabs: {
    id: 'pcabs', name: 'PC/ABS Blend', cost: 2, unitCost: 1.85, fireRating: 'UL94 V-0', prop65Risk: false,
    recyclability: 2, acoustics: 4, aesthetics: 4, toughness: 4, insulation: 2, reflectivity: 1, foodSafe: 1,
    processes: ['injection'],
    consequences: [{ kind: 'note', text: 'V-0 self-extinguishing — the safe default for enclosures.' }]
  },
  recycledAbs: {
    id: 'recycled-abs', name: 'Recycled ABS', cost: 1, unitCost: 0.95, fireRating: 'UL94 HB', prop65Risk: false,
    recyclability: 4, acoustics: 4, aesthetics: 3, toughness: 3, insulation: 2, reflectivity: 1, foodSafe: 1,
    processes: ['injection', '3dprint'],
    consequences: [
      { kind: 'boost', text: 'Recycled content — a modest, defensible eco story.' },
      { kind: 'risk',  text: 'Still UL94 HB; flammability is no better than virgin ABS.' }
    ]
  },
  oceanPlastic: {
    id: 'ocean-plastic', name: 'Recovered Ocean Plastic', cost: 3, unitCost: 2.30, fireRating: 'UL94 HB', prop65Risk: false,
    recyclability: 5, acoustics: 4, aesthetics: 3, toughness: 2, insulation: 2, reflectivity: 1, foodSafe: 1,
    processes: ['injection'],
    consequences: [
      { kind: 'boost', text: 'Reclaimed ocean plastic — a strong sustainability headline.' },
      { kind: 'risk',  text: 'Variable feedstock: slightly brittle and still flammable (HB).' }
    ]
  },
  bamboo: {
    id: 'bamboo', name: 'Bamboo Composite', cost: 3, unitCost: 3.40, fireRating: 'Untreated', prop65Risk: true,
    recyclability: 5, acoustics: 5, aesthetics: 5, toughness: 2, insulation: 3, reflectivity: 1, foodSafe: 2,
    processes: ['cnc'],
    consequences: [
      { kind: 'boost', text: 'Sustainability story — unlocks an eco marketing angle.' },
      { kind: 'risk',  text: 'Needs flame treatment to pass flammability standards.' },
      { kind: 'risk',  text: 'Natural binding adhesives raise a Prop 65 disclosure question.' }
    ]
  },
  aluminum: {
    id: 'aluminum', name: 'Recycled Aluminum', cost: 4, unitCost: 5.20, fireRating: 'Non-combustible', prop65Risk: false,
    recyclability: 5, acoustics: 2, aesthetics: 5, toughness: 4, insulation: 3, reflectivity: 3, foodSafe: 4,
    processes: ['cnc', 'stamping'],
    consequences: [
      { kind: 'boost', text: 'Metal body doubles as RF shielding — helps EMC.' },
      { kind: 'risk',  text: 'Rings acoustically; needs internal damping for sound quality.' }
    ]
  },

  // Translucent diffusers (lamp shades)
  frostedPc: {
    id: 'frosted-pc', name: 'Frosted Polycarbonate', cost: 2, unitCost: 2.10, fireRating: 'UL94 V-0', prop65Risk: false,
    recyclability: 2, acoustics: 3, aesthetics: 4, toughness: 5, insulation: 2, reflectivity: 1, foodSafe: 2,
    processes: ['injection', 'thermoform'],
    consequences: [{ kind: 'note', text: 'Tough and V-0; diffuses light evenly over a hot LED.' }]
  },
  opalAcrylic: {
    id: 'opal-acrylic', name: 'Opal Acrylic (PMMA)', cost: 2, unitCost: 1.70, fireRating: 'UL94 HB', prop65Risk: false,
    recyclability: 2, acoustics: 3, aesthetics: 5, toughness: 2, insulation: 2, reflectivity: 1, foodSafe: 1,
    processes: ['injection', 'thermoform'],
    consequences: [
      { kind: 'boost', text: 'Best-in-class light diffusion — a premium glow.' },
      { kind: 'risk',  text: 'Acrylic is flammable (HB) — a real concern over a hot lamp.' }
    ]
  },
  borosilicate: {
    id: 'borosilicate', name: 'Borosilicate Glass', cost: 4, unitCost: 4.80, fireRating: 'Non-combustible', prop65Risk: false,
    recyclability: 4, acoustics: 3, aesthetics: 5, toughness: 2, insulation: 4, reflectivity: 2, foodSafe: 5,
    processes: ['glassform'],
    consequences: [
      { kind: 'boost', text: 'Inert, food-safe, premium glass.' },
      { kind: 'risk',  text: 'Heavy, and shatters on a hard impact.' }
    ]
  },
  bambooVeneer: {
    id: 'bamboo-veneer', name: 'Bamboo Veneer', cost: 3, unitCost: 3.60, fireRating: 'Untreated', prop65Risk: true,
    recyclability: 5, acoustics: 4, aesthetics: 5, toughness: 2, insulation: 3, reflectivity: 1, foodSafe: 2,
    processes: ['cnc'],
    consequences: [
      { kind: 'boost', text: 'Natural veneer — a beautiful eco statement.' },
      { kind: 'risk',  text: 'Barely translucent — it dims the lamp noticeably.' },
      { kind: 'risk',  text: 'Needs flame treatment sitting over a heat source.' }
    ]
  },

  // Structural (drones, RC)
  gfNylon: {
    id: 'gf-nylon', name: 'Glass-Filled Nylon', cost: 2, unitCost: 2.60, fireRating: 'UL94 V-2', prop65Risk: false,
    recyclability: 2, acoustics: 3, aesthetics: 3, toughness: 5, insulation: 2, reflectivity: 1, foodSafe: 1,
    processes: ['injection'],
    consequences: [{ kind: 'note', text: 'Stiff and impact-tough — a structural workhorse.' }]
  },
  eppFoam: {
    id: 'epp-foam', name: 'EPP Foam', cost: 1, unitCost: 0.80, fireRating: 'UL94 HBF', prop65Risk: false,
    recyclability: 4, acoustics: 2, aesthetics: 2, toughness: 5, insulation: 4, reflectivity: 1, foodSafe: 1,
    processes: ['foammold'],
    consequences: [
      { kind: 'boost', text: 'Bounces off walls — ideal for a crash-prone micro drone.' },
      { kind: 'note',  text: 'Low-end finish; nobody buys foam for the looks.' }
    ]
  },
  polycarbonate: {
    id: 'polycarbonate', name: 'Polycarbonate (Lexan)', cost: 2, unitCost: 2.00, fireRating: 'UL94 V-2', prop65Risk: false,
    recyclability: 2, acoustics: 3, aesthetics: 4, toughness: 5, insulation: 2, reflectivity: 1, foodSafe: 2,
    processes: ['injection', 'thermoform'],
    consequences: [{ kind: 'note', text: 'Near-unbreakable — the RC bodyshell standard.' }]
  },
  carbonComposite: {
    id: 'carbon-composite', name: 'Carbon-Fiber Composite', cost: 5, unitCost: 8.50, fireRating: 'UL94 V-0', prop65Risk: false,
    recyclability: 1, acoustics: 3, aesthetics: 5, toughness: 5, insulation: 2, reflectivity: 1, foodSafe: 1,
    processes: ['layup', 'cnc'],
    consequences: [
      { kind: 'boost', text: 'Stiff, light and premium — the flagship feel.' },
      { kind: 'risk',  text: 'Effectively unrecyclable; it tanks your sustainability score.' }
    ]
  },
  magnesium: {
    id: 'magnesium', name: 'Magnesium Alloy', cost: 4, unitCost: 6.40, fireRating: 'Flammable (chips)', prop65Risk: false,
    recyclability: 4, acoustics: 2, aesthetics: 5, toughness: 4, insulation: 3, reflectivity: 3, foodSafe: 3,
    processes: ['diecast', 'cnc'],
    consequences: [
      { kind: 'boost', text: 'Light metal — premium feel and built-in RF shielding.' },
      { kind: 'risk',  text: 'Costly tooling, and machining swarf is a fire hazard.' }
    ]
  },

  // Food contact / containers
  foodPp: {
    id: 'food-pp', name: 'Food-Grade Polypropylene', cost: 1, unitCost: 1.20, fireRating: 'UL94 HB', prop65Risk: false,
    recyclability: 4, acoustics: 3, aesthetics: 3, toughness: 3, insulation: 2, reflectivity: 1, foodSafe: 5,
    processes: ['injection', 'blow'],
    consequences: [{ kind: 'note', text: 'Certified food-grade, inexpensive, and recyclable.' }]
  },
  stainless: {
    id: 'stainless', name: 'Stainless Steel', cost: 4, unitCost: 4.10, fireRating: 'Non-combustible', prop65Risk: false,
    recyclability: 5, acoustics: 2, aesthetics: 5, toughness: 5, insulation: 5, reflectivity: 4, foodSafe: 5,
    processes: ['stamping', 'deepdraw'],
    consequences: [
      { kind: 'boost', text: 'Inert and food-safe; double-wall stainless insulates superbly.' },
      { kind: 'risk',  text: 'Heavier and pricier than plastic.' }
    ]
  },
  tritan: {
    id: 'tritan', name: 'Tritan Copolyester', cost: 2, unitCost: 2.40, fireRating: 'UL94 HB', prop65Risk: false,
    recyclability: 2, acoustics: 3, aesthetics: 4, toughness: 4, insulation: 2, reflectivity: 1, foodSafe: 5,
    processes: ['injection', 'blow'],
    consequences: [
      { kind: 'boost', text: 'Clear, BPA-free and food-safe — lighter than glass or steel.' },
      { kind: 'note',  text: 'Single-wall plastic: it won\'t insulate like a flask.' }
    ]
  },

  // Reflectors (solar cooker)
  polishedAluminum: {
    id: 'polished-aluminum', name: 'Polished Aluminum', cost: 4, unitCost: 4.90, fireRating: 'Non-combustible', prop65Risk: false,
    recyclability: 5, acoustics: 2, aesthetics: 5, toughness: 4, insulation: 3, reflectivity: 5, foodSafe: 4,
    processes: ['stamping', 'cnc'],
    consequences: [
      { kind: 'boost', text: 'Mirror finish concentrates sunlight efficiently — and it\'s recyclable.' }
    ]
  },
  mirrorSteel: {
    id: 'mirror-steel', name: 'Mirror Stainless', cost: 4, unitCost: 4.60, fireRating: 'Non-combustible', prop65Risk: false,
    recyclability: 5, acoustics: 2, aesthetics: 5, toughness: 5, insulation: 4, reflectivity: 5, foodSafe: 5,
    processes: ['stamping'],
    consequences: [
      { kind: 'boost', text: 'Durable mirror finish — reflects hard and lasts for years.' },
      { kind: 'risk',  text: 'Heavy.' }
    ]
  },
  aluminizedFilm: {
    id: 'aluminized-film', name: 'Aluminized Mylar Film', cost: 1, unitCost: 0.60, fireRating: 'Flammable', prop65Risk: false,
    recyclability: 1, acoustics: 1, aesthetics: 3, toughness: 1, insulation: 1, reflectivity: 5, foodSafe: 1,
    processes: ['lamination'],
    consequences: [
      { kind: 'boost', text: 'Dirt-cheap and extremely reflective — at first.' },
      { kind: 'risk',  text: 'Hazes and degrades under UV; its low recyclability undermines eco claims.' }
    ]
  }
};

// Back-compat: the original four, still importable by name.
export const ENCLOSURE_MATERIALS = [M.abs, M.pcabs, M.bamboo, M.aluminum];

// Generic supplier pool for electronic components. Rating is 1–5 stars.
export const SUPPLIERS = [
  {
    id: 'apex', name: 'Apex Components', rating: 5, costFactor: 1.0, docsComplete: true,
    note: 'Complete documentation packet, every cert verifiable.'
  },
  {
    id: 'meridian', name: 'Meridian Supply', rating: 4, costFactor: 0.85, docsComplete: true,
    note: 'Solid mid-tier. Paperwork is thorough if a little slow.'
  },
  {
    id: 'shenzhen-bargain', name: 'Shenzhen Bargain Electronics', rating: 2, costFactor: 0.55, docsComplete: false,
    note: "Steve's pick. Cheap, but certs are \"coming next week, probably.\""
  },
  {
    id: 'definitely', name: 'DEFINITELY CERTIFIED ELECTRONICS CO.', rating: 1, costFactor: 0.4, docsComplete: false,
    note: 'Their datasheet says "CE Cetrified" and "FFC approved". Hmm.'
  }
];

// Manufacturing processes. Design shows only the ones the chosen material
// supports, so the list is always product-appropriate.
export const MANUFACTURING_PROCESSES = [
  { id: 'injection',  name: 'Injection Molding',     setupCost: 5, perUnit: 1, precision: 5, note: 'High tooling cost, lowest per-unit. The mass-production standard for plastics.' },
  { id: 'cnc',        name: 'CNC Machining',          setupCost: 3, perUnit: 3, precision: 5, note: 'Moderate setup, wide material range. Good for metal and composite.' },
  { id: '3dprint',    name: '3D Printing',            setupCost: 1, perUnit: 5, precision: 3, note: 'Cheap to start, expensive per unit. Really a prototype process.' },
  { id: 'stamping',   name: 'Sheet-Metal Stamping',   setupCost: 4, perUnit: 2, precision: 4, note: 'Presses sheet metal at speed — for steel and aluminium bodies.' },
  { id: 'deepdraw',   name: 'Deep Drawing',           setupCost: 4, perUnit: 2, precision: 4, note: 'Draws sheet metal into seamless vessels — the steel-bottle method.' },
  { id: 'thermoform', name: 'Thermoforming',          setupCost: 2, perUnit: 3, precision: 3, note: 'Heats and forms plastic sheet; good for shades and trays.' },
  { id: 'blow',       name: 'Blow Molding',           setupCost: 4, perUnit: 1, precision: 3, note: 'Inflates plastic into hollow bodies — the plastic-bottle standard.' },
  { id: 'glassform',  name: 'Glass Forming',          setupCost: 5, perUnit: 3, precision: 4, note: 'Moulds molten glass; premium and energy-intensive.' },
  { id: 'foammold',   name: 'Foam Molding',           setupCost: 2, perUnit: 2, precision: 2, note: 'Moulds expanded foam — light, impact-absorbing parts.' },
  { id: 'layup',      name: 'Composite Layup',        setupCost: 3, perUnit: 5, precision: 4, note: 'Press-laid carbon fibre — premium, slow, costly per unit.' },
  { id: 'diecast',    name: 'Die Casting',            setupCost: 5, perUnit: 2, precision: 5, note: 'Injects molten metal — strong, precise magnesium/aluminium parts.' },
  { id: 'lamination', name: 'Film Lamination',        setupCost: 1, perUnit: 1, precision: 2, note: 'Bonds reflective film to a backing — cheap, low durability.' }
];

// Material sets: each product's material component points at one via `materialSet`.
// A material may appear in several sets (ids are globally unique, so getMaterial
// still resolves it). Pick options that actually make sense for the product.
export const MATERIAL_SETS = {
  // Opaque electronics housings (smart speaker, earbud case)
  enclosure:   [M.abs, M.pcabs, M.recycledAbs, M.oceanPlastic, M.bamboo, M.aluminum],
  // Translucent lamp diffuser — opaque metals/woods make a poor shade
  diffuser:    [M.frostedPc, M.opalAcrylic, M.borosilicate, M.bambooVeneer],
  // Lightweight, impact-tough drone airframe
  droneFrame:  [M.eppFoam, M.abs, M.gfNylon, M.polycarbonate],
  // RC bodyshell — drop-and-bash plastics
  rcBody:      [M.abs, M.polycarbonate, M.gfNylon, M.recycledAbs],
  // Premium camera-drone shell
  droneShell:  [M.gfNylon, M.carbonComposite, M.magnesium, M.abs],
  // Food-contact appliance housing that also takes heat
  foodHousing: [M.foodPp, M.stainless, M.recycledAbs, M.aluminum],
  // Drink bottle body
  bottleBody:  [M.stainless, M.borosilicate, M.tritan, M.aluminum],
  // Solar-cooker reflector — it has to actually reflect
  reflector:   [M.polishedAluminum, M.mirrorSteel, M.aluminizedFilm, M.aluminum]
};

export const materialsForSet = (name) => MATERIAL_SETS[name] || MATERIAL_SETS.enclosure;

export const getMaterial = (id) =>
  Object.values(MATERIAL_SETS).flat().find(m => m.id === id) || null;
export const getSupplier = (id) => SUPPLIERS.find(s => s.id === id) || null;
export const getProcess  = (id) => MANUFACTURING_PROCESSES.find(p => p.id === id) || null;

// Resolve the chosen option for a sourcing component slot. New-schema products
// author `component.options` (specific parts with real unitCost); legacy products
// fall back to the shared SUPPLIERS pool. Both stash the id in selectedSuppliers,
// and both expose `rating`/`docsComplete` so downstream readers are unchanged.
export const getPart = (comp, id) =>
  (comp && comp.options ? comp.options.find(o => o.id === id) : getSupplier(id)) || null;
