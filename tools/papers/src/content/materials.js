// Shared catalogs for the Design phase: enclosure materials, component
// suppliers, and manufacturing processes. Products reference these by id so
// the data is reusable across product lines.
//
// `consequences` drive the live warning panel in Phase 2 and are read by later
// phases (e.g. testing reads an enclosure's fireRating). Each is:
//   { kind: 'risk' | 'boost' | 'note', text: '...' }

export const ENCLOSURE_MATERIALS = [
  {
    id: 'abs', name: 'ABS Plastic', cost: 1,
    fireRating: 'UL94 HB', recyclability: 2, acoustics: 4, aesthetics: 3, prop65Risk: false,
    processes: ['injection', '3dprint'],
    consequences: [
      { kind: 'risk', text: 'UL94 HB only — burns steadily, may fail flammability testing.' }
    ]
  },
  {
    id: 'pcabs', name: 'PC/ABS Blend', cost: 2,
    fireRating: 'UL94 V-0', recyclability: 2, acoustics: 4, aesthetics: 4, prop65Risk: false,
    processes: ['injection'],
    consequences: [
      { kind: 'note', text: 'V-0 self-extinguishing — the safe default for enclosures.' }
    ]
  },
  {
    id: 'bamboo', name: 'Bamboo Composite', cost: 3,
    fireRating: 'Untreated', recyclability: 5, acoustics: 5, aesthetics: 5, prop65Risk: true,
    processes: ['cnc'],
    consequences: [
      { kind: 'boost', text: 'Sustainability story — unlocks an eco marketing angle.' },
      { kind: 'risk',  text: 'Needs flame treatment to pass flammability standards.' },
      { kind: 'risk',  text: 'Natural binding adhesives raise a Prop 65 disclosure question.' }
    ]
  },
  {
    id: 'aluminum', name: 'Recycled Aluminum', cost: 4,
    fireRating: 'Non-combustible', recyclability: 5, acoustics: 2, aesthetics: 5, prop65Risk: false,
    processes: ['cnc'],
    consequences: [
      { kind: 'boost', text: 'Metal body doubles as RF shielding — helps EMC.' },
      { kind: 'risk',  text: 'Rings acoustically; needs internal damping for sound quality.' }
    ]
  }
];

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

export const MANUFACTURING_PROCESSES = [
  {
    id: 'injection', name: 'Injection Molding', setupCost: 5, perUnit: 1, precision: 5,
    note: 'High tooling cost, lowest per-unit. The mass-production standard.'
  },
  {
    id: 'cnc', name: 'CNC Machining', setupCost: 3, perUnit: 3, precision: 5,
    note: 'Moderate setup, wide material range. Good for metal and composite.'
  },
  {
    id: '3dprint', name: '3D Printing', setupCost: 1, perUnit: 5, precision: 3,
    note: 'Cheap to start, expensive per unit. Really a prototype process.'
  }
];

export const getMaterial = (id) => ENCLOSURE_MATERIALS.find(m => m.id === id) || null;
export const getSupplier = (id) => SUPPLIERS.find(s => s.id === id) || null;
export const getProcess  = (id) => MANUFACTURING_PROCESSES.find(p => p.id === id) || null;
