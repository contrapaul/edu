// Single source of truth for the Regulatory Library. Keyed by the same
// standard ids used in markets.js. Entries are written in student-friendly
// language with the real regulation number, so the library doubles as a study
// resource. Standards are added to state.unlockedRegulations as encountered.
//
// `realWorld` adds a concrete, real case or consequence for each standard —
// a second educational layer on top of `plain`'s definition, so the library
// doubles as "here's a rule" AND "here's why it exists / what happens when
// it's ignored."

export const REGULATIONS = {
  'fcc-15': {
    number: '47 CFR Part 15', title: 'FCC Part 15 — Radio-Frequency Devices', market: 'USA',
    plain: 'US rules limiting the electromagnetic noise a device may emit. "Intentional radiators" (Wi-Fi, Bluetooth) face stricter limits than incidental ones. This is what the EMC pre-scan is checking against.',
    realWorld: 'Every certified device gets an FCC ID printed on it (often under "contains FCC ID: XXX"). Look one up at fcc.gov/oet/ea/fccid and you can read the actual lab test report for your own phone, router, or headphones.'
  },
  'ul-safety': {
    number: 'UL 62368-1', title: 'UL / ETL Safety Listing', market: 'USA',
    plain: 'Independent safety certification for mains-powered electronics, focused on fire and electric-shock hazards. Retailers and insurers in the US effectively require it.',
    realWorld: 'UL was founded in 1894 after an engineer investigated fire risks at the Chicago World\'s Fair electrical exhibits. Today counterfeit "UL-listed" phone chargers — real UL logo, no real testing — are a recurring cause of house fires and CPSC recalls.'
  },
  'prop65': {
    number: 'Cal. Health & Safety Code §25249.6', title: 'California Proposition 65', market: 'California',
    plain: 'Requires a warning if a product can expose people to listed chemicals. Some adhesives, plastics, and coatings trigger it — which is why material choice matters.',
    realWorld: 'In 2018 a California court ruled coffee sellers had to carry a Prop 65 cancer warning over acrylamide (a byproduct of roasting) — which is why, for a while, coffee cups everywhere carried the warning, before a 2019 rule carved out an exemption.'
  },
  'ce-emc': {
    number: 'Directive 2014/30/EU', title: 'CE — EMC Directive', market: 'EU',
    plain: 'The EU electromagnetic-compatibility rule: a device must not emit excessive interference and must tolerate normal interference. Part of what the CE mark certifies.',
    realWorld: 'Some counterfeit goods carry a logo nearly identical to the CE mark but slightly reshaped, informally nicknamed "China Export" by EU market-surveillance officers — it looks compliant at a glance but was never actually tested.'
  },
  'ce-red': {
    number: 'Directive 2014/53/EU', title: 'CE — Radio Equipment Directive', market: 'EU',
    plain: 'Covers anything with a radio (Wi-Fi/Bluetooth/cellular) sold in the EU — efficient spectrum use, safety, and EMC together.',
    realWorld: 'A 2022 amendment to this directive is the EU\'s "common charger" law mandating USB-C on phones and tablets — the real reason Apple switched the iPhone from its Lightning port to USB-C starting with the iPhone 15.'
  },
  'rohs': {
    number: 'Directive 2011/65/EU', title: 'RoHS', market: 'EU',
    plain: 'Restricts hazardous substances (lead, mercury, certain flame retardants) in electronics. Drives lead-free solder and careful component sourcing.',
    realWorld: 'RoHS traces back to a 2001 Dutch customs seizure: Sony PlayStation cables were found to contain excess cadmium, and Sony had to scrap or rework roughly 1.3 million units — a scandal regulators cite as a direct trigger for RoHS.'
  },
  'weee': {
    number: 'Directive 2012/19/EU', title: 'WEEE', market: 'EU',
    plain: 'Waste Electrical and Electronic Equipment: producers must register and fund take-back/recycling of e-waste. The crossed-out wheelie-bin symbol comes from here.',
    realWorld: 'That crossed-out bin icon is one of the most-printed symbols in the world — it\'s on nearly every phone, charger, and appliance sold in Europe, and it\'s why retailers like those in the EU are required to take back your old electronics for recycling.'
  },
  'ccc': {
    number: 'CNCA-C', title: 'China Compulsory Certification (CCC)', market: 'China',
    plain: 'Mandatory certification for many product categories sold in China. Without the CCC mark, customs will not clear the goods.',
    realWorld: 'Shipments without a valid CCC mark are routinely held or turned back at Chinese customs — which is why some global products are simply never sold in mainland China rather than pay for a separate certification run.'
  },
  'pse': {
    number: 'DENAN Act', title: 'PSE Mark', market: 'Japan',
    plain: "Japan's electrical-appliance safety scheme. Round PSE for most products, diamond PSE for higher-risk categories.",
    realWorld: 'When Japan\'s PSE law took full effect in 2006, it technically made it illegal to resell used electronics — including vintage synthesizers and guitar amps — without new testing. The backlash ("PSE shock") forced the government to add exemptions for secondhand goods.'
  },
  'vcci': {
    number: 'VCCI-CISPR', title: 'VCCI', market: 'Japan',
    plain: 'A voluntary (but expected) Japanese standard controlling electromagnetic interference, aligned with international CISPR limits.',
    realWorld: 'Unlike PSE, VCCI is enforced by an industry association, not the government — but retailers and other manufacturers expect the mark anyway, so in practice it behaves like a requirement even though no law demands it.'
  },
  'rcm': {
    number: 'AS/NZS', title: 'Regulatory Compliance Mark (RCM)', market: 'Australia',
    plain: 'A single mark for Australia/New Zealand bundling electrical safety and EMC compliance under one supplier registration.',
    realWorld: 'The RCM replaced the older separate C-Tick (EMC) and A-Tick (telecom) marks in 2013, specifically to cut the paperwork of certifying the same product twice for one combined Australia/New Zealand market.'
  },
  'fda-fc': {
    number: '21 CFR 170–199', title: 'FDA Food-Contact Materials', market: 'USA',
    plain: 'US rules on substances that may contact food. Materials and coatings must be approved or compliant, and must not leach harmful amounts into food or drink.',
    realWorld: 'The FDA never banned BPA in food-contact plastics outright — it maintains the chemical is safe at typical exposure levels. Nearly every "BPA-free" water bottle on US shelves exists because of consumer pressure and voluntary industry action, not a direct rule.'
  },
  'ftc-green': {
    number: 'FTC Green Guides', title: 'Environmental Marketing Claims', market: 'USA',
    plain: 'You can only call a product "eco-friendly", "compostable", or "recyclable" if you can substantiate it. Unqualified green claims are treated as deceptive advertising.',
    realWorld: 'In 2022 the FTC fined major retailers, including Kohl\'s and Walmart, millions of dollars for labeling ordinary rayon textiles as sustainably made from bamboo — a textbook "greenwashing" case brought under these guides.'
  },
  'ec-1935': {
    number: 'Regulation (EC) 1935/2004', title: 'EU Food-Contact Framework', market: 'EU',
    plain: 'The EU framework for materials intended to contact food. Items must not transfer constituents in quantities that endanger health or change the food unacceptably.',
    realWorld: 'The EU banned BPA in baby bottles outright in 2011 — a full year before the US took comparable action — a good example of how the same underlying safety concern can produce very different regulatory speeds in different markets.'
  },
  'eu-green': {
    number: 'EU Green Claims Directive', title: 'Substantiation of Green Claims', market: 'EU',
    plain: 'Environmental claims in the EU must be backed by evidence and, increasingly, independent verification. Vague "eco" labelling without proof is prohibited.',
    realWorld: 'A 2024 EU directive went further than the US FTC Green Guides by naming and banning specific vague terms outright — including plain "eco-friendly" and "climate neutral" claims — unless backed by independently verified evidence.'
  },
  'gb-fc': {
    number: 'GB 4806', title: 'China Food-Contact Safety', market: 'China',
    plain: "China's national standards for food-contact materials — migration limits and labelling for anything that touches food or drink.",
    realWorld: "China significantly overhauled its food-safety framework, including these standards, after the 2008 melamine milk scandal exposed how much damage a single contamination case can do to public trust and export markets."
  }
};

export const getRegulation = (id) => REGULATIONS[id] || null;
