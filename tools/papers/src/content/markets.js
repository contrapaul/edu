// Target markets and the standards each one pulls in.
// A product's required standards = union of selected markets' standards,
// filtered to those that apply to the product category (see appliesTo).
//
// `appliesTo` tags let one market list cover many product types. A standard with
// no appliesTo always applies. Categories used so far: 'wireless', 'mains-power',
// 'battery', 'electronics'.

export const MARKETS = [
  {
    id: 'usa', name: 'United States', flag: '🇺🇸', region: 'North America', size: 1.0,
    blurb: 'Largest single market. FCC governs anything that radiates RF.',
    standards: [
      { id: 'fcc-15',  label: 'FCC Part 15',     note: 'Unintentional/intentional radiators', appliesTo: ['electronics', 'wireless'] },
      { id: 'ul-safety', label: 'UL / ETL listing', note: 'Product safety (mains powered)', appliesTo: ['mains-power'] },
      { id: 'fda-fc',  label: 'FDA 21 CFR',      note: 'Food-contact materials', appliesTo: ['food-contact'] },
      { id: 'ftc-green', label: 'FTC Green Guides', note: 'Environmental marketing claims', appliesTo: ['eco-claim'] }
    ]
  },
  {
    id: 'california', name: 'California (opt-in)', flag: '🐻', region: 'North America', size: 0.3,
    blurb: 'Lucrative but adds Prop 65 chemical-disclosure obligations.',
    optional: true,
    standards: [
      { id: 'prop65', label: 'California Prop 65', note: 'Chemical exposure warnings' }
    ]
  },
  {
    id: 'eu', name: 'European Union', flag: '🇪🇺', region: 'Europe', size: 0.9,
    blurb: 'CE mark covers several directives at once. RoHS + WEEE apply to electronics.',
    standards: [
      { id: 'ce-emc',  label: 'CE — EMC Directive', note: '2014/30/EU electromagnetic compatibility', appliesTo: ['electronics', 'wireless'] },
      { id: 'ce-red',  label: 'CE — RED',           note: '2014/53/EU radio equipment', appliesTo: ['wireless'] },
      { id: 'rohs',    label: 'RoHS',               note: 'Restriction of hazardous substances', appliesTo: ['electronics'] },
      { id: 'weee',    label: 'WEEE',               note: 'E-waste take-back registration', appliesTo: ['electronics'] },
      { id: 'ec-1935', label: 'EC 1935/2004',       note: 'Food-contact materials framework', appliesTo: ['food-contact'] },
      { id: 'eu-green', label: 'EU Green Claims',    note: 'Substantiation of environmental claims', appliesTo: ['eco-claim'] }
    ]
  },
  {
    id: 'china', name: 'China', flag: '🇨🇳', region: 'Asia', size: 0.8,
    blurb: 'CCC certification is mandatory for many categories.',
    standards: [
      { id: 'ccc', label: 'China CCC', note: 'Compulsory certification', appliesTo: ['electronics', 'mains-power'] },
      { id: 'gb-fc', label: 'GB 4806', note: 'Food-contact safety standard', appliesTo: ['food-contact'] }
    ]
  },
  {
    id: 'japan', name: 'Japan', flag: '🇯🇵', region: 'Asia', size: 0.4,
    blurb: 'PSE for electrical safety, VCCI for emissions.',
    standards: [
      { id: 'pse',  label: 'PSE',  note: 'Electrical appliance safety', appliesTo: ['mains-power'] },
      { id: 'vcci', label: 'VCCI', note: 'Voluntary EMI control', appliesTo: ['electronics'] }
    ]
  },
  {
    id: 'australia', name: 'Australia', flag: '🇦🇺', region: 'Oceania', size: 0.25,
    blurb: 'RCM mark bundles electrical safety and EMC.',
    standards: [
      { id: 'rcm', label: 'RCM', note: 'Regulatory Compliance Mark', appliesTo: ['electronics', 'mains-power'] }
    ]
  }
];

export const getMarket = (id) => MARKETS.find(m => m.id === id) || null;

// Returns the de-duplicated list of standards required for a product's
// categories given a set of selected market ids. `categories` may be a single
// string or an array; a standard with no appliesTo always applies.
export function requiredStandardsFor(marketIds, categories) {
  const cats = Array.isArray(categories) ? categories : [categories];
  const seen = new Set();
  const out = [];
  for (const id of marketIds) {
    const market = getMarket(id);
    if (!market) continue;
    for (const std of market.standards) {
      const applies = !std.appliesTo || std.appliesTo.some(c => cats.includes(c));
      if (applies && !seen.has(std.id)) {
        seen.add(std.id);
        out.push({ ...std, market: market.id });
      }
    }
  }
  return out;
}
