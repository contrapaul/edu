// Marketing channels for the Marketing phase. Spend remaining cash across modern
// channels to drive launch demand. Each channel trades reach efficiency against
// credibility and audience fit:
//   efficiency  — reach per dollar (diminishing returns are applied in compute)
//   credibility — how much buyers trust it (low = "flashy"; can backfire)
//   markets     — null = fits everywhere; otherwise only fits if the player sells
//                 into one of these markets (else the spend is largely wasted)
//   flashy      — hype channels that backfire when the product can't back the hype

export const MARKETING_CHANNELS = [
  { id: 'amazon', name: 'Amazon sponsored placement', efficiency: 1.0, credibility: 0.8, flashy: false,
    markets: ['usa', 'california', 'eu', 'japan', 'australia'],
    desc: 'Sponsored listings on the dominant Western marketplace.' },
  { id: 'taobao', name: 'Taobao / Tmall placement', efficiency: 1.0, credibility: 0.8, flashy: false,
    markets: ['china'],
    desc: "Featured placement on China's largest marketplaces." },
  { id: 'search', name: 'Search ads (Google / Baidu)', efficiency: 1.0, credibility: 0.75, flashy: false,
    markets: null,
    desc: 'Capture buyers already searching. High intent, broad fit.' },
  { id: 'social', name: 'Social ads (Meta / TikTok)', efficiency: 1.1, credibility: 0.6, flashy: false,
    markets: null,
    desc: 'Targeted paid social. Efficient and broad.' },
  { id: 'influencer', name: 'Influencer / KOL gifting', efficiency: 1.35, credibility: 0.35, flashy: true,
    markets: null,
    desc: 'Send units to creators. Enormous reach — and it backfires loudly when the product disappoints.' },
  { id: 'tv', name: 'TV spot', efficiency: 0.5, credibility: 0.85, flashy: true,
    markets: null,
    desc: 'Mass-market reach and prestige, at a mass-market price.' },
  { id: 'ooh', name: 'Billboards, bus & elevator ads', efficiency: 0.6, credibility: 0.7, flashy: false,
    markets: null,
    desc: 'Out-of-home brand awareness. Weak direct conversion.' }
];

export const getChannel = (id) => MARKETING_CHANNELS.find(c => c.id === id) || null;

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// Pure marketing outcome from a spend map.
//   spends      — { channelId: dollars }
//   selectedMarkets — player's markets (for fit)
//   valueScore  — quality-minus-price, roughly -1..+1. Negative = overpriced junk.
// Returns a demand multiplier plus a backfire verdict for the launch maths.
export function computeMarketing(spends, selectedMarkets, valueScore) {
  let reachScore = 0, total = 0, flashySpend = 0;
  for (const ch of MARKETING_CHANNELS) {
    const spend = spends[ch.id] || 0;
    if (spend <= 0) continue;
    total += spend;
    if (ch.flashy) flashySpend += spend;
    const fit = ch.markets ? (ch.markets.some(m => selectedMarkets.includes(m)) ? 1 : 0.2) : 1;
    // sqrt → diminishing returns, so dumping everything in one channel underperforms.
    reachScore += Math.sqrt(spend / 1000) * ch.efficiency * fit;
  }

  let reachMult = 1 + clamp(reachScore / 12, 0, 1.4);   // up to ~2.4× demand
  const flashyShare = total > 0 ? flashySpend / total : 0;

  // Backfire: hype-heavy spend behind an overpriced / low-value product tanks
  // reviews — the "junk headphones at $200 to influencers" lesson.
  let backfired = false, repHit = 0;
  if (valueScore < -0.1 && flashyShare > 0.4 && flashySpend >= 2000) {
    backfired = true;
    const severity = clamp((-valueScore) * flashyShare, 0, 1);
    reachMult *= (1 - 0.55 * severity);     // the hype curdles into bad press
    repHit = Math.round(4 + 16 * severity);
  }

  return {
    total, reachMult: Number(reachMult.toFixed(3)),
    flashyShare: Number(flashyShare.toFixed(2)), backfired, repHit,
    reachScore: Number(reachScore.toFixed(2))
  };
}
