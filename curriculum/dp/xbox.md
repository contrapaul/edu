# Xbox case study — working notes

Original summary notes distilled from Dean Takahashi's *Opening the Xbox*
(2002), for use in DP Design case studies (B2.1.1 and others). Written in
my own words as a reference for facts, dates, and design/business
decisions — not excerpts from the book. Source: full text, purchased
copy, kept local only.

## Timeline

- **1999-03-02** — Sony announces PlayStation 2 specs, well ahead of its
  Japan (spring 2000) and US (fall 2000) launches.
- **1999-03-18–20** — Microsoft executive retreat at Semiahmoo discusses
  a company-wide response to Sony; no console proposal exists yet.
- **1999 (~March)** — Four Microsoft employees — Seamus Blackley, Kevin
  Bachus, Ted Hase, and Otto Berkes — independently converge on what
  becomes the Xbox proposal, initially a Windows-based "Windows
  Entertainment Platform" rather than dedicated hardware.
- **1999-03-30** — The four formalise the pitch, code-named "Project
  Midway."
- **1999 (spring–summer)** — Internal competition ("meeting warfare")
  between the Xbox proposal and a rival WebTV-division proposal for the
  same budget and mandate.
- **1999-05-05** — First formal pitch to Bill Gates.
- **1999-06-17** — Second Gates/Ballmer pitch meeting; Xbox approach
  favoured over WebTV's.
- **1999-07-21** — Executive meeting formally greenlights the Xbox as a
  real business; Rick Thompson (hardware division VP) is assigned to run
  it, triggering the departure of three of the four original
  co-founders (Hase, Berkes, and — temporarily — Nat Brown) as the
  project shifts from a grassroots effort to a managed division.
- **1999 (August)** — J Allard joins as technical/project lead.
- **1999 (~October)** — Industrial designer Horace Luke begins concept
  sketches.
- **2000-03-06 to 03-09** — Final component decisions locked in days
  before the public announcement: Nvidia over GigaPixel for graphics,
  Intel over AMD for the CPU.
- **2000-03-10** — Gates and Blackley reveal Xbox at the Game Developers
  Conference, San Jose.
- **~20 months later** — Xbox ships to consumers.
- **Post-launch** — Nvidia comes under SEC investigation over
  expense-recording practices, surfaced via an unrelated insider-trading
  case tied to an employee front-running the Xbox deal announcement.

## Origin: how the opportunity was identified (Empathize/Define)

Blackley's founding insight (from an internal comparison of PlayStation
2 graphics vs PC graphics) was that PC graphics hardware was about to
outpace Sony's, and that a stable, single-spec "console" built from PC
components could combine the PC's technical edge with a console's
biggest usability advantage: developers only target one fixed hardware
configuration, instead of the huge variety of sound/graphics/CPU
configurations found in PCs.

This is a clean example of a **design opportunity identified through
competitor/product analysis** rather than direct end-user research: the
initial "user" being designed for was the game developer (a
business-to-business stakeholder), and the initial problem statement was
closer to "how do we make it economically and technically easy for
developers to build high-end games" than "what does a player want."

Separately, three Microsoft veterans — Hase (developer evangelism),
Bachus (DirectX marketing), and Berkes (DirectX graphics engineering) —
had independently reached the same conclusion: PC game developers were
defecting to consoles because the PC was an unstable, fragmented target
platform.

## Define: competing design briefs inside the same company

Unusually, Microsoft ran **two parallel, competing design proposals**
for months before choosing one — a useful real-world example of design
convergence through internal competition rather than a single linear
brief:

- **The Xbox proposal**: PC-derived components, DirectX-compatible,
  targeting hardcore 16–26-year-old male gamers, no royalty charged to
  developers (later reversed), higher up-front cost justified by
  performance and a 2-year hardware refresh cycle.
- **The rival WebTV proposal**: a cheaper, Windows CE-based console
  design from Microsoft's existing WebTV division (bought 1997, $425M),
  emphasising a low, fixed cost matched closely to Sony/Nintendo/Sega,
  and pitched as one part of a broader "convergence device" that could
  also handle internet/video functions.

The two teams pitched Gates directly, in the same room, on the same
day, more than once — a formal "beauty contest" process. Early Xbox
cost estimates were shown to be unreliable (the team's original
bill-of-materials didn't even account for the cost of screws), which
nearly cost them credibility versus the WebTV team's much more detailed
costing. The deciding factors that tipped Gates/Ballmer toward the Xbox
approach were: credibility with third-party game developers (Blackley
had already recruited outside advisers like Tim Sweeney of Epic and
John Carmack of id Software), and the WebTV team's failure to produce a
credible software/timeline story once challenged directly on stage.

A specific, well-documented product decision from this phase: whether
to include a hard disk drive. It added significant cost and neither the
PS2 nor other consoles had one. Games chief Ed Fries argued it would
enable online play, faster level-loading, and saved games without a
memory cartridge — Gates was persuaded and the hard drive stayed,
becoming one of the console's key differentiators.

## Ideate & securing stakeholder buy-in

The four co-founders had genuinely different, complementary
specialisms — Blackley (technical vision/game-developer credibility),
Bachus (business/marketing), Hase (internal politics/evangelism
strategy), Berkes (graphics engineering) — and explicitly did not
appoint a leader.

Once the project was approved as a real business unit, all but one of
the four original founders left or were sidelined as professional
managers (Thompson, then Allard) took over. This is a genuinely useful,
slightly uncomfortable case-study point: the people who conceive a
design and the people who are institutionally credited/rewarded for
shipping it are not always the same people. Several of the original
four were later omitted from the game's own internal credits list.

A recurring internal friction point, explicitly named by insiders as
the **"strategy tax"** — the cost, in time and compromise, of aligning
a new idea with a large company's existing product lines and messaging
(e.g., repeated pressure to make the Xbox "Windows compatible" even
after the team had technically decided against it, purely to keep
executive buy-in).

## Manufacturing, component sourcing & business-model decisions

- **Graphics chip — Nvidia vs. GigaPixel.** Microsoft ran a genuine
  competitive sourcing process between two graphics chip suppliers late
  into the schedule. GigaPixel (backed internally by the WebTV
  division) offered better raw benchmark numbers and a lower price, but
  it had never shipped a finished chip before and its software drivers
  were unproven — developers (consulted directly by Blackley's team)
  strongly favoured Nvidia's proven, stable driver software and
  generational compatibility over GigaPixel's specs. Nvidia won days
  before the public announcement, agreeing to a **sliding per-unit price
  tied to volume** (roughly $48/chip for the first 5 million units,
  falling to $30/chip past 30 million) plus a $200M upfront cash advance
  from Microsoft — Nvidia only had $61M cash at the time and needed the
  advance to compress its usual chip-development timeline.
- **CPU — Intel vs. AMD.** AMD had an informal deal for months
  (leveraging its then-newer, faster-bus Athlon chip) but tried to
  renegotiate late, requesting a $200–400M equity investment on top of
  chip pricing after an unexpectedly strong quarter reduced its
  financial urgency. That reopened the door for Intel, who came back
  with a faster clock speed (733MHz vs. the 600MHz originally discussed)
  to offset its slower system bus, plus debugging tools and motherboard
  design services. Intel won the contract essentially at the last
  minute. **Lesson for a case study:** supplier negotiations aren't
  static — a supplier's own business conditions during the negotiation
  materially change their willingness to deal.
- **Business model:** deliberately borrowed the console-industry
  "razor and blades" approach — sell hardware near or below cost,
  recover margin through per-game royalties (Microsoft settled on
  charging developers, matching Sony/Nintendo's ~$7/game, reversing an
  earlier plan to charge no royalty at all).
- **Cost engineering example:** the decision to exclude a dial-up modem
  (only Ethernet/broadband) was justified partly on simplifying the
  target platform for developers, and partly on a direct, quantified
  cost saving ($5.18/unit × a 43M-unit sales projection ≈ $221M).
- **Nvidia's own manufacturing history** (useful materials/manufacturing
  case-in-point, unrelated to the Xbox deal itself): Nvidia's first
  product (1995) commercially failed because it used a non-standard
  rendering technique ("quadratic curved surfaces") that didn't match
  the polygon-based tools the industry had already standardised on — a
  clear example of a technically capable product failing due to
  ecosystem/tooling incompatibility, not raw performance.
- **Moore's Law economics**, explicitly discussed as the underlying
  logic for the whole console generation: chip capability roughly
  doubles every ~18 months as circuitry shrinks. Console makers use that
  shrinkage to cut manufacturing cost on a *fixed* spec over a product's
  life, whereas PC makers use the same curve to add new capability at a
  roughly constant price point — the same technology curve exploited two
  different ways depending on business model.

## Industrial design of the physical console (directly relevant to
B2.1.1)

Lead industrial designer: **Horace Luke** (assigned ~October 1999,
previously a Nike brand designer). Useful, concrete design-process
material:

- **User research method:** Luke's team conducted home visits to
  observe how people actually used existing game consoles, not just
  interviews. Two specific field observations directly drove design
  decisions: (1) controller cables were consistently too short, so
  consoles ended up on the floor — the Xbox controller cable was
  deliberately made 9 feet long (vs. the ~6 ft industry norm), which in
  turn required a breakaway safety mechanism so a tripped cable wouldn't
  damage the console; (2) people habitually left drink cans on top of
  their consoles — so the case was designed with **no top-mounted
  vents**, to avoid spillage into the electronics. A clean example of
  ethnographic observation overriding an engineer's first-instinct
  layout.
- **Colour choice:** green was chosen partly because competitors (Sony,
  Nintendo, Sega) had all avoided it, and partly for its established
  association with "technology" in consumer research (traced back to
  early monochrome computer displays). The design team also wanted
  silver/chrome but it was cost-prohibitive for the production model
  (used only on the presentation/reveal prototype).
- **Design-vs-cost tension**, stated directly by Blackley: engineering
  cost constraints repeatedly overruled purely aesthetic choices — e.g.
  a symmetrical DVD-tray placement was moved off-centre for airflow, and
  a two-tone case colour was dropped because it added ~$1/unit to
  manufacturing cost at volume. This is a good, explicit example of
  form being constrained by manufacturing economics, not just
  aesthetics.
- **Component placement constraints:** the hard drive and DVD drive
  couldn't be positioned too close together (heat, and potential
  physical damage to each other if the unit was dropped), while the
  overall footprint still had to fit existing home A/V furniture
  (target: no larger than a VCR).
- **DVD drive type** (front-loading tray vs. side-loading vs. slot) was
  a direct manufacturing-cost decision: slot-loading and front-loading
  mechanisms each cost roughly $10/unit more than a basic side-loading
  tray, at the volumes involved.
- **Branding/logo:** developed with an external design studio (Cinco
  Design) through roughly 40–50 iterations over five months, paired
  with a written "brand story" — good example of a logo being developed
  alongside a narrative rationale, not chosen on visual grounds alone.
  Original concept used a cube motif, dropped after Nintendo announced
  its own console as "GameCube."
- **Controller — a documented design failure and correction:** initial
  research focused on the primary target demographic (young adult
  males), producing a large controller sized for bigger hands. Post-launch
  feedback — especially in Japan — showed this excluded a meaningful
  share of users; Microsoft had to design and ship a second, smaller
  controller (led by designer Alan Han) specifically for that market.
  Useful, concrete example of a product shipping before adequately
  testing against its *full* user range, not just its primary persona.

## Software/OS architecture decisions

- Early plans assumed the console would run a version of Windows; this
  was dropped once the team determined full Windows couldn't meet the
  split-second timing games need. The team stripped Windows NT down to
  a lightweight, games-only operating system (under 500,000 KB — small
  enough to fit on a floppy disk).
- The OS shipped **on the game DVD itself**, not installed on the
  console, specifically to avoid "DLL Hell" (a real PC-era problem where
  one application's shared library update could silently break another
  application) and to let each game ship with exactly the OS
  components it needed.
- This was a deliberate, debated trade-off: some team members wanted
  Xbox to run actual Windows software for broader appeal; the shipped
  decision prioritised game performance/stability over general-purpose
  flexibility — directly shaped by outside developer feedback favouring
  a minimal, fast, predictable platform.

## Ethics / responsibility of the designer (useful for C1.x topics)

- The 1999 Columbine/Littleton school shooting intensified political
  scrutiny of violent video games generally; the FTC published a
  September 2000 report examining whether the games industry marketed
  mature-rated content to minors.
- Internally at Microsoft, there was an explicit design/business
  decision point over how graphic to make content in an early
  Microsoft-published title (whether to depict blood on-screen) — a real
  design decision shaped directly by ethical/reputational risk, not
  just technical or aesthetic considerations.
- Demographic data cited from the Interactive Digital Software
  Association (industry trade group, c. 1999–2000): ~61% of players
  were adults, average player age 28, ~43% of players female — a good
  talking point on designers' assumptions about "who the user is"
  versus actual user data.

## Competitive/market context (useful for product-analysis exercises)

- PlayStation 2 (1999 spec announcement): claimed 66 million
  polygons/sec, a 128-bit "Emotion Engine" processor, backward
  compatibility with original PlayStation games, DVD playback —
  positioned as a general entertainment device, not just a games
  machine.
- Market share going into the console generation: Sony ~47%, Nintendo
  ~28%, Sega ~23% (1995–2000, worldwide).
- Sega's Dreamcast (1998) is repeatedly used as a cautionary example:
  strong early technology, discontinued in 2001 after failing to sustain
  market share against PS2 — useful for discussing why being first to
  market isn't sufficient without a sustained ecosystem/marketing
  strategy.

## People (for attribution in case-study text)

- **Seamus Blackley** — originator of the core technical pitch; prior
  credit was *Trespasser* (1998), a commercially unsuccessful DreamWorks
  game whose failure (~60,000 units sold against a 1-million target) is
  framed in the book as directly motivating his drive on Xbox.
- **Kevin Bachus** — marketing/business lead among the founding four.
- **Ted Hase** — developer relations/evangelism; left the project once
  it shifted from "improving Windows gaming" to "building a dedicated
  console."
- **Otto Berkes** — DirectX graphics engineering lead; advocated for a
  Windows-compatible design and lost that internal argument.
- **Rick Thompson** — Microsoft hardware-division VP brought in to run
  Xbox as a real business once the project was approved.
- **J Allard** — technical/project lead from ~August 1999; drove the
  decision to strip the OS down rather than run full Windows.
- **Horace Luke** — lead industrial designer of the physical console
  and controller.
- **Ed Fries** — ran Microsoft's existing PC games division (built on
  titles like *Age of Empires*); advocated successfully for the hard
  drive and for charging developer royalties.
- **Jen-Hsun Huang** — Nvidia co-founder/CEO; won the graphics-chip
  contract over GigaPixel days before launch.
