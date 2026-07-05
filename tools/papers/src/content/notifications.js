// Ambient interactive notifications: things that arrive uninvited while a
// product is in development. Each one is a real choice — cost/benefit spelled
// out in the hint, and there's always a free "no" — rather than a forced click.
// Fires at most once per game per id (engine/notify.js tracks state.seenNotifications).
//
// `ctx` (built by engine/notify.js) exposes: companyName, productName, character,
// spend(amount,label), earn(amount,label), reputation(delta).

const OTHER_FOUNDERS = {
  mina:   { name: 'Leo', other: 'Samira' },
  leo:    { name: 'Mina', other: 'Samira' },
  samira: { name: 'Mina', other: 'Leo' }
};

export const NOTIFICATIONS = [
  {
    id: 'partner-bundle',
    weight: 2,
    minDay: 3,
    from: () => 'Partnerships @ Northline Retail',
    role: 'Business Development',
    text: (ctx) => `We want to bundle ${ctx.productName} with our holiday gift set. Free shelf space, but we'll want a cut and a rush on your timeline.`,
    choices: [
      { label: 'Sign the bundle deal', hint: 'Costs $1,500 in co-marketing now. Reputation +3.',
        effects: (ctx) => { ctx.spend(1500, 'Bundle deal — Northline'); ctx.reputation(3); } },
      { label: 'Negotiate a smaller cut first', hint: 'No cost, but a coin flip — they might walk.',
        effects: (ctx) => { ctx.reputation(Math.random() < 0.5 ? 1 : -1); } },
      { label: 'Pass — stay focused', hint: 'No effect.', effects: () => {} }
    ]
  },
  {
    id: 'influencer-freebie',
    weight: 2,
    minDay: 4,
    from: () => '@unbox.everything (140k followers)',
    role: 'Influencer',
    text: (ctx) => `OMG your ${ctx.productName} looks INSANE. Send me a free unit and I'll post about it to my whole feed 🙏`,
    choices: [
      { label: 'Send a free review unit', hint: 'Costs $250 (sample + shipping). Reputation +4.',
        effects: (ctx) => { ctx.spend(250, 'Influencer sample unit'); ctx.reputation(4); } },
      { label: 'Offer a discount code instead', hint: 'No cost. Reputation +1.',
        effects: (ctx) => { ctx.reputation(1); } },
      { label: 'Ignore it', hint: 'No effect.', effects: () => {} }
    ]
  },
  {
    id: 'fake-reviews-offer',
    weight: 1,
    minDay: 6,
    from: () => 'ReviewBoost Solutions',
    role: '"Marketing Services"',
    text: (ctx) => `For a flat fee we can get ${ctx.productName} fifty verified 5-star reviews by launch day. No one has to know.`,
    choices: [
      { label: 'Pay for the reviews', hint: 'Costs $2,000. Reputation +5 now — but a real chance it surfaces and costs you double.',
        effects: (ctx) => {
          ctx.spend(2000, 'ReviewBoost "marketing services"');
          ctx.reputation(Math.random() < 0.4 ? -10 : 5);
        } },
      { label: 'Turn them down', hint: 'No cost, no risk. The honest move.', effects: () => {} }
    ]
  },
  {
    id: 'knockoff-license',
    weight: 1,
    minDay: 8,
    from: () => 'Mr. Zhang, Sourcing Broker',
    role: 'Unsolicited offer',
    text: () => `I can move your production numbers up fast — just let my other clients "reference" your design for a small fee. Nobody will trace it back.`,
    choices: [
      { label: 'Take the fee', hint: 'Earns $3,000 now. If it surfaces, expect a real reputation hit.',
        effects: (ctx) => {
          ctx.earn(3000, 'Sourcing broker fee (undisclosed)');
          if (Math.random() < 0.5) ctx.reputation(-12);
        } },
      { label: 'Report him to your supplier network', hint: 'No cost. Reputation +2 for the goodwill.',
        effects: (ctx) => { ctx.reputation(2); } },
      { label: 'Just decline', hint: 'No effect.', effects: () => {} }
    ]
  },
  {
    id: 'charity-ask',
    weight: 1,
    minDay: 10,
    from: () => 'Westbrook Middle School Robotics Club',
    role: 'Sponsorship request',
    text: (ctx) => `We're raising funds for regionals and would love a donated ${ctx.productName} or a small sponsorship.`,
    choices: [
      { label: 'Donate a unit + sponsorship', hint: 'Costs $500. Reputation +3.',
        effects: (ctx) => { ctx.spend(500, 'Robotics club sponsorship'); ctx.reputation(3); } },
      { label: 'Send an encouraging email instead', hint: 'No cost, no effect.', effects: () => {} },
      { label: 'Ignore it', hint: 'No effect.', effects: () => {} }
    ]
  },
  {
    id: 'crossover-collab',
    weight: 1,
    minDay: 12,
    from: (ctx) => OTHER_FOUNDERS[ctx.character.id]?.name || 'A fellow founder',
    role: 'Founder-to-founder',
    text: (ctx) => {
      const f = OTHER_FOUNDERS[ctx.character.id];
      return `Heard you're deep in ${ctx.productName}. ${f?.name || 'I'} think${f ? 's' : ''} there's a fun crossover here. ${f?.other || 'Someone else'} thinks it's a terrible idea for several reasons. Want to grab coffee about it?`;
    },
    choices: [
      { label: 'Take the meeting', hint: 'No cost. 50/50 something useful comes of it.',
        effects: (ctx) => { if (Math.random() < 0.5) ctx.reputation(2); } },
      { label: 'Politely decline', hint: 'No effect.', effects: () => {} }
    ]
  },
  {
    id: 'expedite-bribe',
    weight: 1,
    minDay: 14,
    from: () => '"Independent Consultant"',
    role: 'Unsolicited offer',
    text: () => `I know someone at the notified body. For a rush fee, your paperwork jumps the queue. Off the books, of course.`,
    choices: [
      { label: 'Pay the rush fee', hint: 'Costs $1,000. If it’s ever audited, this looks very bad.',
        effects: (ctx) => {
          ctx.spend(1000, 'Rush fee (unofficial)');
          ctx.reputation(Math.random() < 0.35 ? -15 : 1);
        } },
      { label: 'Decline and file properly', hint: 'No effect. The slow way is still the only safe way.', effects: () => {} }
    ]
  }
];
