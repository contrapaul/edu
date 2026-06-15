// Character definitions. Chunk 1 only needs enough for the select screen;
// product data lives separately under content/products/.

export const CHARACTERS = [
  {
    id: 'mina',
    name: 'Mina Chen',
    company: 'LuminaTech',
    tagline: 'Consumer Electronics & Smart Home',
    blurb: 'Methodical and detail-oriented. Lives and dies by the technical file.',
    difficulty: 2,
    startBudget: 150000,
    products: ['Smart Speaker', 'Wireless Earbuds', 'Smart Lamp'],
    focus: 'Electronics compliance, wireless certification',
    accent: '#1a5cb8',
    staff: [
      { id: 'gunther', name: 'Gunther', role: 'Regulatory Specialist', disposition: 'compliance', translator: true, note: 'Former TÜV auditor. Speaks in directive numbers.' },
      { id: 'priya',   name: 'Priya',   role: 'Electrical Engineer',   disposition: 'shortcut', note: 'Brilliant, overworked, keeps suggesting shortcuts.' },
      { id: 'marcus',  name: 'Marcus',  role: 'Industrial Designer',   disposition: 'neutral', note: 'Obsessed with aesthetics. At war with engineering.' }
    ]
  },
  {
    id: 'leo',
    name: 'Leo Anderson',
    company: 'AeroCube',
    tagline: 'Recreational Drones & RC Toys',
    blurb: 'Enthusiastic tinkerer and former drone racing champion.',
    difficulty: 2,
    startBudget: 140000,
    products: ['Micro Drone', 'RC Racing Car', 'Camera Drone'],
    focus: 'Mechanical safety, radio control, child safety',
    accent: '#0f766e',
    staff: [
      { id: 'sarah', name: 'Sarah', role: 'Mechanical Engineer', disposition: 'compliance', translator: true, note: 'Pragmatic, safety-obsessed, quotes crash-test data.' },
      { id: 'jake',  name: 'Jake',  role: 'Firmware Developer',   disposition: 'neutral', note: 'Coding genius. Documentation? Never heard of her.' },
      { id: 'elena', name: 'Elena', role: 'Supply Chain Manager', disposition: 'shortcut', note: 'Knows every factory in Shenzhen. That cuts both ways.' }
    ]
  },
  {
    id: 'samira',
    name: 'Samira Okonkwo',
    company: 'Biome Solutions',
    tagline: 'Sustainable Kitchen & Home',
    blurb: 'Passionate environmentalist who pushes the greenest option — even when it complicates compliance.',
    difficulty: 3,
    startBudget: 130000,
    products: ['Countertop Composter', 'Reusable Bottle', 'Solar Cooker'],
    focus: 'Materials science, food contact, environmental claims',
    accent: '#4d7c0f',
    staff: [
      { id: 'okeke',  name: 'Dr. Okeke', role: 'Materials Scientist',    disposition: 'compliance', translator: true, note: 'Academic expert. Answers in research papers.' },
      { id: 'carlos', name: 'Carlos',    role: 'Manufacturing Engineer', disposition: 'shortcut', note: 'Realist. Pushes back with cost and feasibility.' },
      { id: 'anya',   name: 'Anya',      role: 'Sustainability Officer',  disposition: 'neutral', note: 'Wants everything carbon-neutral. Generates extra certs.' }
    ]
  }
];

export const getCharacter = (id) => CHARACTERS.find(c => c.id === id) || null;
