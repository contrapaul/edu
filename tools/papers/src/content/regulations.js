// Single source of truth for the Regulatory Library. Keyed by the same
// standard ids used in markets.js. Entries are written in student-friendly
// language with the real regulation number, so the library doubles as a study
// resource. Standards are added to state.unlockedRegulations as encountered.

export const REGULATIONS = {
  'fcc-15': {
    number: '47 CFR Part 15', title: 'FCC Part 15 — Radio-Frequency Devices', market: 'USA',
    plain: 'US rules limiting the electromagnetic noise a device may emit. "Intentional radiators" (Wi-Fi, Bluetooth) face stricter limits than incidental ones. This is what the EMC pre-scan is checking against.'
  },
  'ul-safety': {
    number: 'UL 62368-1', title: 'UL / ETL Safety Listing', market: 'USA',
    plain: 'Independent safety certification for mains-powered electronics, focused on fire and electric-shock hazards. Retailers and insurers in the US effectively require it.'
  },
  'prop65': {
    number: 'Cal. Health & Safety Code §25249.6', title: 'California Proposition 65', market: 'California',
    plain: 'Requires a warning if a product can expose people to listed chemicals. Some adhesives, plastics, and coatings trigger it — which is why material choice matters.'
  },
  'ce-emc': {
    number: 'Directive 2014/30/EU', title: 'CE — EMC Directive', market: 'EU',
    plain: 'The EU electromagnetic-compatibility rule: a device must not emit excessive interference and must tolerate normal interference. Part of what the CE mark certifies.'
  },
  'ce-red': {
    number: 'Directive 2014/53/EU', title: 'CE — Radio Equipment Directive', market: 'EU',
    plain: 'Covers anything with a radio (Wi-Fi/Bluetooth/cellular) sold in the EU — efficient spectrum use, safety, and EMC together.'
  },
  'rohs': {
    number: 'Directive 2011/65/EU', title: 'RoHS', market: 'EU',
    plain: 'Restricts hazardous substances (lead, mercury, certain flame retardants) in electronics. Drives lead-free solder and careful component sourcing.'
  },
  'weee': {
    number: 'Directive 2012/19/EU', title: 'WEEE', market: 'EU',
    plain: 'Waste Electrical and Electronic Equipment: producers must register and fund take-back/recycling of e-waste. The crossed-out wheelie-bin symbol comes from here.'
  },
  'ccc': {
    number: 'CNCA-C', title: 'China Compulsory Certification (CCC)', market: 'China',
    plain: 'Mandatory certification for many product categories sold in China. Without the CCC mark, customs will not clear the goods.'
  },
  'pse': {
    number: 'DENAN Act', title: 'PSE Mark', market: 'Japan',
    plain: "Japan's electrical-appliance safety scheme. Round PSE for most products, diamond PSE for higher-risk categories."
  },
  'vcci': {
    number: 'VCCI-CISPR', title: 'VCCI', market: 'Japan',
    plain: 'A voluntary (but expected) Japanese standard controlling electromagnetic interference, aligned with international CISPR limits.'
  },
  'rcm': {
    number: 'AS/NZS', title: 'Regulatory Compliance Mark (RCM)', market: 'Australia',
    plain: 'A single mark for Australia/New Zealand bundling electrical safety and EMC compliance under one supplier registration.'
  },
  'fda-fc': {
    number: '21 CFR 170–199', title: 'FDA Food-Contact Materials', market: 'USA',
    plain: 'US rules on substances that may contact food. Materials and coatings must be approved or compliant, and must not leach harmful amounts into food or drink.'
  },
  'ftc-green': {
    number: 'FTC Green Guides', title: 'Environmental Marketing Claims', market: 'USA',
    plain: 'You can only call a product "eco-friendly", "compostable", or "recyclable" if you can substantiate it. Unqualified green claims are treated as deceptive advertising.'
  },
  'ec-1935': {
    number: 'Regulation (EC) 1935/2004', title: 'EU Food-Contact Framework', market: 'EU',
    plain: 'The EU framework for materials intended to contact food. Items must not transfer constituents in quantities that endanger health or change the food unacceptably.'
  },
  'eu-green': {
    number: 'EU Green Claims Directive', title: 'Substantiation of Green Claims', market: 'EU',
    plain: 'Environmental claims in the EU must be backed by evidence and, increasingly, independent verification. Vague "eco" labelling without proof is prohibited.'
  },
  'gb-fc': {
    number: 'GB 4806', title: 'China Food-Contact Safety', market: 'China',
    plain: "China's national standards for food-contact materials — migration limits and labelling for anything that touches food or drink."
  }
};

export const getRegulation = (id) => REGULATIONS[id] || null;
