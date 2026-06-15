# Regulatory Papers, Please — World Wiki

*An in-universe guide to the people, companies, and antagonists of the
compliance-industrial complex. Half lore, half developer reference — read it for
flavour, write to it when you add content so the world stays consistent.*

> **Premise.** You run a small hardware company trying to get genuinely good
> products onto shelves around the world. Standing between your idea and the
> market is everyone: regulators, customs, your own staff, a cartoonishly
> well-funded rival, and a supplier whose certificates are spelled wrong. The
> rules are real. The suffering is comedic.

---

## The three companies

Each playable company is a different lens on design technology. They share an
engine and a tone, but their regulatory pain is distinct — pick the company,
pick the curriculum.

### 🔵 LuminaTech — Mina Chen
*"Consumer Electronics & Smart Home." Difficulty ★★☆ · Start budget $150k.*

Mina is methodical and lives by the technical file. LuminaTech makes the clean,
museum-shelf gadgets everyone photographs — which means the whole electronics
rulebook lands on her desk: emissions, wireless, batteries, eye-safety. If a
product radiates, transmits, or glows, it's a LuminaTech problem.

**Theme:** EMC, wireless certification, lithium safety, photobiological safety.
**Signature mini-game:** the EMC spectrum analyzer.

### 🟢 AeroCube — Leo Anderson
*"Recreational Drones & RC Toys." Difficulty ★★☆ · Start budget $140k.*

Leo is a former drone-racing champion who builds things that fly into walls.
Everything AeroCube makes is *also a toy*, which stacks child-safety law on top
of radio and battery rules — and by the third product, full aviation law. Leo's
enthusiasm is the company's greatest asset and its biggest compliance risk.

**Theme:** mechanical/impact safety, child safety (ASTM F963 / EU Toy Directive),
radio control, aviation (FAA Remote ID), privacy (GDPR).
**Signature mini-game:** the drop / crash test.

### 🟩 Biome Solutions — Samira Okonkwo
*"Sustainable Kitchen & Home." Difficulty ★★★ · Start budget $130k.*

Samira is the true believer. Biome makes things that touch food and make
environmental promises — the two most heavily policed claims a product can make.
Her products are the hardest because honesty is expensive: every "compostable,"
"BPA-free," and "eco-friendly" is a claim someone will demand you prove. Two of
her three products aren't even electronic, so there's nowhere to hide behind a
PCB — it's all materials and integrity.

**Theme:** food-contact safety (FDA 21 CFR, EC 1935/2004), environmental-claim
substantiation (FTC Green Guides, EU Green Claims), materials science.
**Signature mini-game:** the drop test (used for non-electronic durability).

---

## The staff

Each CEO has three specialists. Mechanically, every staffer carries a
**disposition** that drives the morale system, and one is the **translator** who
can decode regulatory letters for free when their morale is high (≥75).

| Company | Specialist | Role | Disposition | Notes |
|---------|-----------|------|-------------|-------|
| LuminaTech | **Gunther** | Regulatory Specialist | `compliance` · *translator* | Former TÜV auditor. Speaks fluent directive number. The conscience of the company. |
| LuminaTech | **Priya** | Electrical Engineer | `shortcut` | Brilliant and overworked; always has a faster, riskier way. |
| LuminaTech | **Marcus** | Industrial Designer | `neutral` | Aesthetics zealot. At permanent war with engineering. Wants the bamboo. |
| AeroCube | **Sarah** | Mechanical Engineer | `compliance` · *translator* | Safety-obsessed, keeps a folder of crash videos she *will* make you watch. |
| AeroCube | **Jake** | Firmware Developer | `neutral` | Coding genius; documentation is his personal hell ("if it's not written down it doesn't exist"). |
| AeroCube | **Elena** | Supply Chain Manager | `shortcut` | Knows every factory in Shenzhen. That cuts both ways. |
| Biome | **Dr. Okeke** | Materials Scientist | `compliance` · *translator* | Academic. Answers questions in research papers. Right about the migration test. |
| Biome | **Carlos** | Manufacturing Engineer | `shortcut` | The cost realist who pushes back on idealism with a spreadsheet. |
| Biome | **Anya** | Sustainability Officer | `neutral` | Wants carbon-neutral everything; refuses to let the company greenwash. |

> **Disposition mechanic.** When you lock in the technical file, cheap sourcing
> (supplier ≤2★) pleases the `shortcut` staffer and worries the `compliance`
> one; premium sourcing (≥4★) does the reverse. `neutral` staff don't react to
> sourcing. The `translator` flag picks who offers the free-translation perk.

---

## The product lines

Nine products, each a real-world regulatory archetype. Model numbers follow
`<COMPANY-PREFIX><N>`.

### LuminaTech
1. **Lumina Smart Speaker** (LS-1) — FCC Part 15, CE EMC, UL safety. The
   tutorial product: EMC, enclosure materials, mains power.
2. **LuminaBuds Wireless Earbuds** (LB-2) — battery safety (UN 38.3), drop
   survival, miniaturisation. Introduces the drop test and the critical battery.
3. **LumiGlow Smart Lamp** (LG-3) — photobiological/eye safety (IEC 62471),
   thermal management, Prop 65, China CCC. Cheap LEDs blind people.

### AeroCube
1. **Aero Micro Drone** (MD-1) — toy safety (ASTM F963), propeller-guard impact,
   LiPo. Uses *both* mini-games.
2. **Storm RC Racing Car** (RC-2) — radio-transmitter cert, the EU Toy Directive
   **speed limit**, phthalates. Go too fast and you lose Europe.
3. **SkyView Camera Drone** (SV-3) — the flagship: FAA Remote ID, CE C-class,
   **GDPR** (it has a camera), geo-fencing, lithium air-transport (IATA).

### Biome Solutions
1. **BioBoost Countertop Composter** (BB-1) — food-contact migration, off-gassing
   /Prop 65, electrical safety, the EU rules on the word "compost."
2. **EverFlask Reusable Bottle** (EF-2) — *non-electronic*: FDA/EU food contact,
   BPA leaching, and the **insulation claim** you must actually prove.
3. **SolChef Solar Cooker** (SC-3) — *non-electronic*: reflective-material UV
   durability, food-safe temperatures, burn hazard, and **FTC green-claim
   substantiation** (say "eco-friendly," prove "eco-friendly").

---

## Recurring cast (the people who make it worse)

- **GloboCorp** — the faceless mega-rival. A bar that fills every phase you
  spend; if it reaches market first you lose sales. Has infinite money and no
  scruples. You will never see a person from GloboCorp. That's the point.
- **Mr. Zhang, of the Ministry of Being Very Thorough** — the certification
  clerk at the document desk. Cross-references everything. Does not round.
  Stamps `REJECTED` with the serenity of a man who has all the time in the world.
- **Kevin, the intern** — agent of chaos. Suggested selling in North Korea
  (now in mandatory compliance training), flew a prototype into a sprinkler,
  filmed the CEO's parking space with the camera drone (now a data-protection
  incident), and tried to cook a whole chicken in nine minutes ("the chicken
  incident"). Means well. Is a liability.
- **Steve** — the voice of corner-cutting in the design phase. Always knows a
  guy with a pallet of undocumented components that are "FINE. Probably."
- **Janet, from Marketing** — has already promised influencers a launch date
  that is not real, and would like the product to also do several things it
  legally cannot claim to do.
- **DEFINITELY CERTIFIED ELECTRONICS CO.** — the 1★ supplier. Their datasheet
  says "CE Cetrified" and "FFC approve." Payment first, documentation "soon."
- **The test labs** — chaotically thorough. They will also flush your product
  down a toilet, race it down a corridor, or leave it pointed at a houseplant
  for 72 hours, purely out of curiosity. Morale, somehow, remains high.

### The supply chain (shared catalog)
| Supplier | Rating | Vibe |
|----------|--------|------|
| Apex Components | ★★★★★ | Every cert verifiable. Expensive. The right answer. |
| Meridian Supply | ★★★★☆ | Solid mid-tier, thorough if slow. |
| Shenzhen Bargain Electronics | ★★☆☆☆ | Steve's pick. Certs "coming next week, probably." |
| DEFINITELY CERTIFIED ELECTRONICS CO. | ★☆☆☆☆ | See above. Do not. |

**Factories:** Shenzhen MegaFab (fast, cheap, "improves" your design uninvited),
Hanoi Precision (reliable, holds your spec), Brno Assembly / EU (immaculate,
audited, priced like it).

---

## Tone notes (for writers)

- **The regulations are real; the suffering is comedy.** Keep standard numbers
  and mechanisms accurate — the game is a study aid — but let the *people*
  around them be absurd. The humour is the spoonful of sugar.
- **Every shortcut has a face.** A cheap choice isn't an abstract penalty; it's
  Steve, or Elena's guy, or the factory's "helpful" substitution. Consequences
  should arrive as a named character doing a specific, funny, plausible thing.
- **Marketing over-promises; Legal strikes it through.** The Phase 1 memo gag
  (an absurd claim, then a red `— REMOVED`) is the house style. Escalate the
  claim per product.
- **The CEO's values bleed into their products.** Mina trusts the file, Leo
  trusts the build, Samira trusts the cause — write their memos in that voice.

---

## Developer reference

Everything above maps to data. To extend the world without touching the engine:

| You want to… | Edit |
|--------------|------|
| Add/adjust a company or staffer (incl. `disposition`, `translator`) | [`src/content/characters.js`](src/content/characters.js) |
| Add a product | new file in [`src/content/products/`](src/content/products/), then register in [`products/index.js`](src/content/products/index.js) |
| Add a market or standard | [`src/content/markets.js`](src/content/markets.js) |
| Add a Regulatory Library entry | [`src/content/regulations.js`](src/content/regulations.js) |
| Add sandbox events/facilities/hires | [`src/content/sandbox.js`](src/content/sandbox.js) |
| Materials & supplier catalog | [`src/content/materials.js`](src/content/materials.js) |

**A product is one data file** describing all six phases (`brief`, `design`,
`testing`, `certification`, `manufacturing`, `launch`). Key hooks:
- a component with `kind: 'material'` is the material slot; one with
  `critical: true` drives the cert "unverifiable certificate" risk, the EMC
  difficulty penalty, and the launch field issue;
- a test with `interactive: true` + `minigame: 'emc' | 'droptest'` launches a
  mini-game; otherwise it auto-resolves, and a `resolve(p, def)` function lets a
  product define a **bespoke test** (optical, speed-limit, GDPR, food-contact,
  leaching, insulation, food-temp, green-claims) without engine changes;
- `phases.certification.toleranceCheck` is the product's one genuinely
  within-tolerance discrepancy (the others must be corrected);
- non-electronic products simply omit electronics `categories` and EMC tests —
  the standards filter and mini-game registry handle the rest.

See [`PLAN.md`](PLAN.md) for the build history and architecture decisions, and
[`TEACHER_GUIDE.md`](TEACHER_GUIDE.md) for the curriculum mapping.
