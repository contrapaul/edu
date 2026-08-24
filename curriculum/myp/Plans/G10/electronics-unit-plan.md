# Grade 10 Electronics Product Design: 16 strand assessment plan

Working document. Strand descriptors below are the 7-8 band, task specific.
Companion to `curriculum/myp/Plans/G9/tabletop-unit-plan.md`, which this follows
in structure so that students meet the same 16 strand rhythm two years running.

## Unit parameters

| | |
|---|---|
| Grouping | **Individual builds.** Every student designs, builds and keeps their own device. |
| Length | 33 assessed classes plus a launch class and 2 bench classes, so 36 of a 30 to 40 budget. |
| Client | Assigned demographic brief card, as in G9. A real named group at school, curated by the teacher to fit what the student says they want to make. |
| Board | Every student is issued an **ESP32-S3 SuperMini**. Any other board must be argued for in Biii and costed in Biv. |
| Parts | The room stocks the catalog. Cheap additions bought on request. Students may buy their own; anything bought is declared on the BOM with its cost and lead time. |
| Code | **AI assisted, from zero prior programming.** The assessed skill is specifying behaviour and troubleshooting it, not typing syntax. See "the AI problem" below. |
| Soldering | Taught and certified inside the B phase. No student solders before certification. |
| Take home | Devices go home at the end of the unit if the student wants them. |
| Submission | Every strand uploaded to **ManageBac** as it finishes, including strands also assessed live in class. |
| Key tool | [Electronics Parts Catalog](https://edu.contrapaul.com/tools/electronics/), 49 parts in 9 categories, every part deep linkable as `#slug`. |
| Second tool | [MacroPad Builder](https://edu.contrapaul.com/tools/macropad/) for pin planning on ESP32 projects. |

---

## The two non-negotiables

Both are written into the Bi specification and tested in Di and Dii, so a device
that misses either cannot reach the top band however well it is made.

**1. It senses, decides, and acts.** Three parts, all required. A device that
maps an input straight to an output has no decision in it, and a button wired to
an LED is not a design. There must be at least one thing the device works out for
itself: a threshold, a count, a timer, a remembered state, a comparison between
now and a moment ago. The student must be able to point at the decision and say
what would happen if it were removed.

The failure mode to catch early is **the sticky note test**: if a pencil, a
label, a timer already on the wall, or a phone the client owns would solve the
problem better, the electronics are not justified. Catch it in Ai, not in Dii.

**2. It survives being unplugged from you.** At handover the device works on the
client's desk, on its own power, with no laptop attached, no serial monitor open,
no wires held in place by a finger, and no designer standing next to it
explaining. Enclosed, labelled, switched on, working.

These two are the electronics equivalents of "meaningful choices" and "fits a
recess". They are what separates a project from a demonstration.

---

## The AI problem, and how this plan solves it

The G9 plan had a grouping problem to solve. This unit's equivalent is that a
language model will write working firmware for any student who asks it to. This
is fine and intended: students start from zero, the interesting design work is
elsewhere, and refusing the tool would just move the use out of sight. But
Cii says "demonstrates excellent technical skills", and pasted code demonstrates
nothing. Four devices carry the technical grade:

1. **The behaviour is specified before the code exists.** Biv requires a state
   diagram and a written firmware plan. The student designs what the device does;
   the model writes the syntax that does it. A student who cannot draw the state
   diagram has not designed anything, and this shows up in B, before C.

2. **The code viva.** Twice in the build block, the teacher points at three lines
   of the student's own firmware and asks what each does and what breaks if it
   changes. Two minutes per student. Unglamorous and completely decisive.
   Code you cannot explain is code you did not make, and students are told this
   in class 1 so it is a rule rather than a trap.

3. **The bug diary.** Every debugging episode logged: symptom, what I thought was
   wrong, what I tried, what actually happened. A model can produce code. It
   cannot produce the record of a student narrowing down their own fault. This is
   the single best evidence of technical skill in the whole unit.

4. **Hardware does not lie.** Wiring, soldering, current draw, enclosure fit and
   connector strain relief are not assisted by anything. Three of the four Cii
   skill tracks are physical for exactly this reason.

**Say all four out loud in the launch class.** The message is that using the model
well is expected, and that the assessment sits in the places the model cannot
reach.

---

## Sequence at a glance

| Class | Strand | Individual deliverable |
|---|---|---|
| 1 | Launch | Demographic brief cards issued, boards issued, bench drill 0 |
| 2-3 | Bench block | Survival electronics, 3 drills, no grade |
| 4 | Ai | Need Statement, 1 page |
| 5 | Aii | Research Plan, prioritised, 1 page |
| 6-8 | Aiii | 4 Black Box Cards plus a synthesis page |
| 9 | Aiv | Design Brief, 1 page with evidence column |
| 10 | Bi | Design Specification, 8 to 12 testable specs |
| 11-13 | Bii | 6 annotated concepts plus 2 breadboard proofs |
| 14-15 | Biii | Decision matrix, feasibility gates, critical justification |
| 16-18 | Biv | Production Pack, 6 to 9 pages. Solder School runs alongside |
| 19 | Ci | Build plan, peer tested |
| 20-29 | C build block | Covers Cii, Ciii, Civ |
| 30-31 | Di | Test Plan with the instruments actually built |
| 32-33 | Dii | Client session, then point by point evaluation |
| 34 | Diii | Ranked improvements traced to Dii |
| 35-36 | Div | Client demo session, impact report and demo video |

**Where the extra Biii class came from.** Biii runs three feasibility gates, a
weighted matrix and a critical justification, which does not fit in one class.
The slack class pays for it, so the unit now fills all 36 with nothing spare. If
slack matters more than the second Biii class, the cheapest class to recover is
**Aiii class 1**, the modelled teardown, which can move into bench class 3 where
students already have devices in their hands. That leaves Aiii at 2 classes for
four cards and a synthesis, which is tight but survivable.

---

# The bench block (classes 1 to 3, ungraded)

Not assessed, but everything in Criterion B assumes it. Three drills, each ending
in something that works on a breadboard. Students who arrive already able to do
this run the extension instead of sitting through it.

| Class | Drill | What it establishes |
|---|---|---|
| 1 | **Blink and measure.** LED, resistor, breadboard, board. Then measure the rail with a multimeter and read the current. | Power and ground are a habit, not a step. The multimeter is a normal object. |
| 2 | **Sense, decide, act.** LDR or button in, LED or buzzer out, with a threshold in between that the student picks and changes. | The unit's first non-negotiable, felt in the hand before it is written in a spec. |
| 3 | **Break it and fix it.** Teacher-broken circuits and teacher-broken code at four stations. Students diagnose using the troubleshooting protocol. | Troubleshooting as a method rather than as re-prompting. |

**The troubleshooting protocol**, taught in class 3 and posted on the wall for
the rest of the unit. Students write it into the bug diary in this order.

1. What did I expect, and what actually happened? Be specific about both.
2. Is it power, wiring, or code? Prove which before changing anything.
3. What is the smallest test that would tell me? Run that one.
4. Change one thing. Test. Write down the result.
5. Only now ask for help, and bring answers to 1 through 4 with you.

Point 5 is the AI rule as well. Asking the model to "fix this" without steps 1 to
4 is what the bug diary is designed to expose.

---

# Criterion A: Inquiring and analysing

## Ai (1 class)

> Explains and justifies the need for a solution to a problem for a client/target audience.

**Task.** Each student draws a demographic brief card naming a real group at
school: the Grade 6 form class, the library lunch crowd, the ESL support group,
the Grade 12 common room, the after school care group, the front office staff,
the art room, the PE department storeroom. As in G9, cards are curated by the
teacher to fit what the student says they want to build.

**Deliverable.** One page Need Statement:
- Who the audience is, in specifics rather than generalities
- The situation as it stands, with at least one piece of evidence
- **Why this needs to be electronic.** What the device will sense, work out, or
  remember that a person, a label, a printed chart or an existing phone app
  cannot do as well here
- What happens if nothing is made

**What separates 7-8 from 5-6.** The third bullet is the whole strand and it is
the one students skip. A 5-6 explains that the audience exists and a gadget would
be nice. A 7-8 argues why the problem has a sensing, timing, counting or
remembering shape to it, which is what makes electronics the right answer rather
than the fun one.

**Common failure.** Arriving with a device already in mind and reverse
engineering a need to fit it. Ban naming any component in the first draft. If the
need statement cannot be written without the word "sensor", it is a product
pitch.

## Aii (1 class)

> Constructs a detailed research plan, which identifies and prioritizes the primary and secondary research needed to develop a solution to the problem independently.

Same objection as in G9: MYP Design has no space to grade a research paper, so the
plan is the artefact and it has to visibly prioritise. The G9 token budget carries
over almost unchanged, with one addition that makes it electronics research
rather than general research.

**The research budget.** 12 tokens. Every activity has a cost:

| Activity | Cost | Primary or secondary |
|---|---|---|
| Read a catalog part page and note what it can and cannot do | 1 | Secondary |
| Any other secondary source: datasheet, teardown video, product page, guide | 1 | Secondary |
| Questionnaire | 2 | Primary |
| Structured observation of the audience | 3 | Primary |
| Interview | 3 | Primary |
| **Bench test: breadboard a part and measure whether it does what I need** | 3 | Primary |
| Focus group | 4 | Primary |

**Two spending rules**, which stop the two predictable failures:
- At least **4 tokens on people**. Otherwise the whole plan is datasheets.
- At least **3 tokens on technical feasibility**, meaning a bench test or two
  part studies. Otherwise the whole plan is opinions and the first build class
  discovers the sensor cannot do the thing.

**The bench test is the important addition.** It is primary research, it generates
real data, it is unavailable to a student who only reads, and it is the row that
most often changes a design before it costs anything to change. A student who
spends 3 tokens finding out that the HC-SR04 cannot see a person sitting still has
bought themselves a working project.

**Deliverable.** One page Research Plan table:

| Question I need answered | Method | Primary or secondary | Cost | Priority | What decision this unlocks | When |
|---|---|---|---|---|---|---|

Plus two short paragraphs:
- **Why these, in this order.** Which activity had to happen first, and why.
- **What I gave up.** What could not be afforded, and the risk that creates.

The "what decision this unlocks" column does the work, as in G9. It turns
prioritisation from an opinion into an argument.

## Aiii (3 classes)

> Analyses a range of existing products that inspire a solution to the problem in detail.

**Task: four black box teardowns, then one synthesis.** No product is opened. The
analysis is inferring the system from the outside, which is a harder and more
useful skill than unscrewing something, and it uses the parts catalog as the
shared vocabulary in the way G9 used the mechanics catalog.

**Required range**, one from each:
1. A product in the room, in the student's bag, or at home, that can be handled
2. A product aimed at, or usable by, their demographic
3. A product with **no screen**, which must therefore talk to the user through
   light, sound, movement or vibration
4. A product that is **badly designed**, chosen deliberately

**Deliverable, per product: one Black Box Card.**
- What it is, who it is for, what it costs, how it is powered
- **What it must be sensing**, and the evidence for that guess. A device that
  wakes when you approach is sensing something: which of the catalog sensors
  could produce that behaviour, and which are ruled out by the evidence?
- **What it must be deciding.** The behaviour that cannot be explained by a wire
  from input to output
- **What it does back**, and through which output
- **Inferred block diagram**, drawn with catalog parts named by slug, so the
  claim is specific enough to be wrong
- **Power**: mains, battery, rechargeable, and what that choice forced
- **Interface**: every control and every indicator, and what the user has to
  already know to use it
- One sentence: what I would take from this, and what I would leave

**Checking the guess.** Where a teardown video or an iFixit entry exists, students
find it and record where their inference was right and where it was wrong.
Getting it wrong and saying so is worth more than a vague card that cannot be
checked. Mark this explicitly.

**Deliverable, synthesis page.** A comparison matrix across all four against the
same criteria, ending in 3 to 5 numbered **design implications**, each written as
"Because..., my device should...". These are quoted directly in Aiv and Bi.

**What separates 7-8.** The synthesis, exactly as in G9. Four good cards and no
synthesis is a 5-6, because the analysis has not been carried anywhere.

**Class shape.** Class 1 is a teardown led from the front, thinking aloud, then
students do the handheld product. Class 2 does two more. Class 3 is the synthesis
and the implications.

## Aiv (1 class)

> Develops a detailed design brief, which summarizes the analysis of relevant research.

The verb is **summarises the analysis**, so this is a synthesis document, not a
specification. Bi is where measurable criteria appear. Keeping the two apart is
the thing students most often get wrong, and the "brief versus spec sort"
formative exists for this alone.

**Deliverable.** One page Design Brief with a mandatory evidence column:

| Section | Content | Evidence |
|---|---|---|
| Audience | Who they are, and what matters about them here | Ai, Aii |
| The need | Restated in one sentence | Ai |
| What the research showed | 3 to 5 findings, human and technical | Aii, Aiii |
| Design implications | Carried from the Aiii synthesis | Aiii |
| **Technical envelope** | What it must sense, decide and do. Where power comes from. Where it lives | Aii, Aiii |
| Constraints | Time, parts available, cost ceiling, board issued, skills held | Given |
| Design intent | One paragraph on what will be made and for whom | Synthesis |

The technical envelope row is the electronics addition. It is the bridge from
research to specification and it is what Bi turns into numbers.

**Optional flourish.** Present the design intent as the back of a retail box:
product name, one line of promise, three bullet features, a spec strip along the
bottom. On theme, forces brevity, and prints well for the portfolio. Keep the
evidence table as the graded part.

---

# Criterion B: Developing ideas

## Bi (1 class)

> Develops detailed design specifications, which explain the success criteria for the design of a solution based on the analysis of the research.

The most important single page in the unit, because Dii tests against it line by
line and Di builds an instrument for every row. Time spent here is repaid twice.

**Deliverable.** A one page specification, 8 to 12 rows:

| # | Specification | Measurable success criterion | How it will be tested | Source |
|---|---|---|---|---|
| 3 | Runs a full school day on its battery | 8 hours minimum from one charge | Measured current draw, then a timed run to failure | Aiii implication 2 |
| 7 | A Grade 6 can use it without being taught | 4 of 5 first time users complete the main task unaided | Cold start observation, tallied | Ai, Aii interview |

**Required categories**, at least one each:

| Category | The question it answers |
|---|---|
| Audience fit | Does it suit the people in the brief card |
| Function | What it senses, what it decides, what it does |
| Interface and feedback | How the user knows it heard them and knows what it is doing |
| Power and runtime | What it runs on and for how long |
| Physical form | Size, weight, where it lives, how it mounts or sits |
| Reliability | How often it is allowed to fail, and how it fails |
| Safety | Voltage, heat, sharp edges, battery handling, small parts |
| Cost | Total build cost, with a ceiling |
| Buildability | It can be made with the skills, tools and time actually available |

**Three hard rules.**
- If it cannot be measured, it is not a specification. "Responsive" fails.
  "Reacts within 0.5 seconds, measured over 20 trials" passes.
- The "how it will be tested" column is written now, not in Di. Di expands it into
  real instruments. Writing it now is what stops untestable specs existing.
- **Every part named in a specification links to its catalog page** using the
  deep link, for example `tools/electronics/#hc-sr04`. A specification that
  depends on a part links to what that part can actually do, which is how a spec
  stays honest about the hardware.

**The two non-negotiables appear here as rows** and are not optional: one
specification for the decision the device makes, and one for working unattended on
its own power at the client's desk.

## Bii (3 classes)

> Develops a range of feasible design ideas, using an appropriate medium(s) and detailed annotation, which can be correctly interpreted by others.

**Three parts, mirroring the G9 shape.**

**1. Forced range: the double draw.** Each student draws two cards, one from the
input deck and one from the output deck, and must generate a concept using both.
Draw three times.

| Input deck | Output deck |
|---|---|
| Something the user does on purpose: button, dial, slider, joystick, switch | A screen |
| Something about the room: light, temperature, humidity, sound | Light, single or addressable |
| Something about a person: presence, motion, proximity, touch | Sound |
| Something about an object: tilt, magnet, weight, vibration | Movement, servo or vibration |
| Time itself: elapsed, scheduled, counted | Something sent elsewhere, over USB or wireless |

Across the full set of concepts a student must touch **at least three different
input rows and three different output rows**. This produces genuine range rather
than six versions of the first idea, which is what the descriptor is asking for.

**2. Six annotated concepts** on a standard A3 template so annotation has
somewhere to live. Each concept carries **four things, always in the same
places**, so the sheet is learned once:

- **Block diagram.** Input, process, output, with the actual catalog parts named
  by slug. The process box says what is decided, not "ESP32".
- **Form sketch.** The physical object, at rough scale, in its place. Where it
  sits, what it mounts to, how big it is relative to a hand.
- **Interaction storyboard, three frames.** What the user does, what the device
  does back, and what state it is left in. This is the frame that catches devices
  which work but cannot be understood.
- **Annotation.** How the concept serves the audience, referencing Bi specs by
  number, plus **one named risk**: the part most likely to fail, and why.

Hand drawing is the better medium, as in G9, because MYP rewards annotation
density and students annotate more freely by hand. Digital is allowed where the
annotation is as rich.

**3. Two breadboard proofs, actually built.** Feasibility is in the descriptor,
and in electronics an untested idea is not a feasible one. For two different
concepts, breadboard the single riskiest part for twenty minutes: the sensor that
might not read what you need, the display that might be too slow, the servo that
might not have the torque. Deliverable is a photo, the reading or behaviour
observed, and one sentence on what it means for the concept. **A proof that fails
is worth full marks.** It is feasibility evidence either way, and it is why this
happens in B rather than being discovered in build class 4.

**The interpretation test, which is also the formative.** Swap sheets with a
classmate. From the block diagram alone, with no talking from you, they say out
loud which board pin each part would go to and what the code would have to check
first. You write down everything they could not answer. That list is submitted
with the concepts, and it is direct evidence for "can be correctly interpreted by
others", which is otherwise the hardest phrase in the strand to evidence.

**Class shape.** Class 1 double draw and rapid concepts. Class 2 develop and
annotate the best six. Class 3 breadboard proofs and the interpretation test.

## Biii (2 classes)

> Presents the chosen design and justifies fully and critically its selection with detailed reference to the design specification.

The strand where students write "I picked this one because it is the best". Two
fixes: make the case against the winner compulsory, and put a technical gate in
front of the choice so it cannot be a beauty contest.

**Part 1: the three feasibility gates.** Before a concept can be chosen, it is run
through all three, and the working is shown. A concept may still be chosen after
failing a gate, but then the justification must say exactly how the gate will be
cleared, by when, and at what cost.

| Gate | The check | Fails when |
|---|---|---|
| **Pins** | Every part mapped to a specific pin on the issued ESP32-S3 SuperMini, using the catalog pin tables and the MacroPad Builder | More parts than pins, two parts on one pin, or something on a boot pin |
| **Power** | Current draw of every part added up at worst case, against what the supply or battery can give, with a runtime estimate | Servos and LED strips, almost every time |
| **Parts** | Every part is in the room, in the catalog, or has a named source with a price and a lead time | Something has to arrive from abroad in week three |

The power gate is the one that teaches the most. A student who discovers that
their five servos want more current than a USB port will give is learning
something that no amount of sketching would have taught them.

**Part 2: the weighted decision matrix.** Three finalist concepts scored against
every Bi specification, with weights assigned and the weighting justified in a
sentence each. Weighting is where the judgement is, so it is graded.

**Part 3: the critical justification, one to two pages**, four required sections:
- Why the chosen design wins, referencing specs by number
- **The case against it.** What it does worse than the concepts rejected, and
  what is being given up. This section is what turns "justifies" into "justifies
  critically", and without it the ceiling is 5-6
- What was carried across from the rejected concepts into the final design
- What is still unresolved, including any gate not yet cleared, and how the build
  will resolve it

**The board case.** A student who wants a board other than the issued SuperMini
argues it here, against the gates: what the SuperMini cannot do, what the
alternative gives, what it costs, and when it must be ordered by. This is a real
justification with a real answer, which makes it good practice for the whole
strand.

**Class shape.** Class 1 is the gates, run on all three finalists, which is bench
and calculator work and produces a result the student did not know in advance.
Class 2 is the matrix and the written justification, by which point the gates
have usually decided more than the matrix has. Say that out loud: a matrix that
merely confirms what the power budget already ruled out is doing no work.

## Biv (3 classes)

> Develops accurate and detailed planning drawings/diagrams and outlines requirements for the creation of the chosen solution.

The richest strand in the unit and the one that makes the rest of it work.
"Planning drawings" is not one drawing, it is a production pack, and in
electronics it is the pack that lets a student build without inventing decisions
at the bench.

**Deliverable: Production Pack, 6 to 9 pages.**

| Page | Content | Why it earns its place |
|---|---|---|
| System block diagram | Final version, every part named, every signal labelled with its type | The one page that shows the design at a glance |
| **Schematic** | Proper symbols, every component, every value, power and ground rails drawn | The document an electronics designer actually produces |
| **Wiring and pin map** | A table: board pin, part, signal type, wire colour, and any resistor in the line | What is followed at the bench, and what makes wiring assessable |
| **State diagram** | Every state the device can be in, what it does in each, and what event moves it to the next | See below. This is the most important page in the pack |
| Firmware plan | Pseudocode or flowchart per state, the libraries needed, and what each is for | The specification the model writes code against |
| Enclosure drawings | Orthographic, dimensioned, title block, with every cutout for connectors, controls and displays located and sized | Where the cutouts are wrong, the device does not close |
| **Bill of materials** | Part, catalog link, quantity, source, unit cost, total, lead time | Cost is a Bi specification, so it needs a page |
| Requirements | Tools, machines, consumables, time per stage, and what must be ordered or printed first | Turns into the Ci plan directly |
| Test points | Where a multimeter probe goes to prove each rail and each signal, decided now | Makes Cii debugging possible and Di measurement easy |

**Why the state diagram carries the pack.** It is the answer to the AI problem. A
student who can draw every state their device can be in, and every event that
moves between them, has done the design work, and a model writing the syntax
afterwards changes nothing about that. A student who cannot draw it does not yet
have a design, and Biv is the right place to find that out. Teach it with three
worked examples: a two state device, a device with a settings mode, and one with
a timeout that returns it to rest.

**Solder School runs alongside these three classes.** Biv is desk work and
tolerates rotation, so a bench of six runs a soldering clinic through each class
while the rest draw. Every student is certified before build class 1.

| Session | Content | Certification |
|---|---|---|
| 1 | Iron care, tinning, heat and time, a good joint against a cold one and a bridge | Five joints on scrap perfboard, inspected |
| 2 | Header rows kept square, wire to pad, heat shrink, strain relief | A three wire connector that survives a firm pull |
| 3 | Desoldering, fixing a bridge, rescuing a lifted pad | Repair a joint the teacher has deliberately ruined |

**Route for a student who cannot solder safely.** Screw terminals, crimped
connectors, JST leads and header sockets carry the same marks in the Cii wiring
track. A device may be built entirely without solder. Nothing in the assessment
requires it, but everyone is taught it.

---

# Criterion C: Creating the solution

## Ci (1 class)

> Constructs a detailed and logical plan, which describes the efficient use of time and resources, sufficient for peers to be able to follow to create the solution.

Individual builds make this cleaner than G9. One plan, one owner, ten build
classes to fill.

**Deliverable: a build plan over the 10 build classes.** Fixed columns, so the
scaffold is the same for everyone and the banding comes from what is written in
them:

| # | Task | Class | Time | Needs (parts, tools, machines) | Depends on | Done when | If it fails |
|---|---|---|---|---|---|---|---|

**Four things that must appear**, each of which is where a band is decided:
- **The critical path**, marked. What blocks everything else if it slips.
- **The order deadline.** Anything bought, printed or sent to a machine is named
  with the class by which it must be started. Lead time is a resource.
- **A "done when" for every row.** A task with no finish condition cannot be
  followed by a peer, and "work on enclosure" is not a task.
- **A fallback on every row on the critical path.** The printer queue is full, the
  part does not arrive, the sensor does not read what the bench test said.

**How the bands separate**, which is the part worth publishing to students:

| Band | What the plan looks like |
|---|---|
| 1-2 | A list of things to do, in no particular order, with no times |
| 3-4 | Ordered and timed, but resources are vague and nothing depends on anything |
| 5-6 | Sequenced with dependencies and real resource names. A peer could mostly follow it |
| 7-8 | All of that, plus a marked critical path, order deadlines, finish conditions, and fallbacks that show the student has thought about what will actually go wrong |

**The peer test, which is the descriptor.** "Sufficient for peers to follow" is
testable, so test it. Swap plans. Your partner reads for five minutes and then
narrates exactly what they would do in build class 1 and build class 6, out loud,
with no help. Anything they cannot answer is a gap. Record the gaps, revise, and
submit both versions. The revision is the evidence.

## Cii (during the build block)

> Demonstrates excellent technical skills when making the solution.

**Four skill tracks.** Technical skill here is not only fabrication. Choosing the
right part is a technical skill, so is a wiring loom that can be serviced, and so
is an interface a Grade 6 can read across a desk.

| Track | Skills | Kit |
|---|---|---|
| **Circuit and wiring** | Breadboard discipline and rail habits; a loom that is colour coded, cut to length, and strain relieved; correct resistor and pull-up choices with the arithmetic shown; decoupling where it is needed; proving a rail or a signal with the multimeter at the Biv test points | Breadboard, jumpers, passives, multimeter |
| **Soldering and assembly** | Clean through-hole joints; perfboard laid out before it is soldered; header and connector work; heat shrink and strain relief; at least one connector that can be unplugged for service without cutting anything | Irons, perfboard, headers, JST leads, heat shrink |
| **Firmware and logic** | The Biv state machine actually implemented; debounce; non-blocking timing with no blocking delay in the main loop; reading a raw value and mapping it to something meaningful; calibration held in one place; at least one bug found by hypothesis and test rather than by re-prompting | Board, laptop, the model |
| **Interface and enclosure** | Control placement that matches the hand and the task; labels legible at the distance the device is used from; feedback the user notices without being told to look; cutouts that line up; fit, finish, edges and corners | 3D printers, small laser etcher, craft supplies, printer |

**Kit notes.** The 3D printers and the small etcher are the dependable digital
routes. The large laser cutter is unreliable, so nothing may depend on it without
a stated fallback in Ci. Print shop orders cost money and need lead time, so
anything going to the shop is finalised before everything else, which is a
decision that belongs on the Biv requirements page.

**Requirement.** Each student demonstrates **three skills at depth, across at
least two tracks**. Three done properly beats ten touched lightly, and the two
track minimum stops a student spending ten classes on an enclosure and calling it
a build.

**Evidence: the making log.** For each of the three skills:
- A dated in-progress photo with the student's own hand or initials visible on
  the work
- A photo of the outcome
- A note on what went wrong, what changed, and what the second attempt did better

**Why this shape.** Excellent skill needs something to be excellent against. One
clean photograph shows a good outcome, not skill. A poor first attempt beside a
fixed second one shows both.

**Evidence: the bug diary**, which sits inside the making log and runs the whole
build block. One entry per debugging episode, in the troubleshooting protocol
order: expected, observed, power or wiring or code, smallest test, what changed,
what happened. Entries are dated and must be spread across the block.

**Evidence: the code viva.** Twice, at build class 4 and build class 9. Two
minutes. Three lines, chosen by the teacher from the student's own firmware:
what does this do, why is it here, what breaks if I change it. Recorded on a
simple three point scale against the firmware track. Students are told about this
in class 1, told again in Biv, and told which classes it falls in.

## Ciii (during the build block, assessed at the end)

> Follows the plan to create the solution, which functions as intended and is presented appropriately.

**Deliverable: the finished device**, which means all of the following.

- It does what the Bi specification says it does, including the decision it makes
- It runs on its own power, unattached to a laptop, for as long as spec says
- It is enclosed, or deliberately and neatly open with every board mounted and
  nothing loose
- Every control and indicator is labelled in a way the client can read
- There is a way to turn it on and off
- Wiring is tidy enough that a repair is possible, and connectors can be unplugged
- It comes with a one page user sheet: what it does, how to start it, what each
  light or sound means, what to do when it misbehaves

**The cold start test**, which is both the Ciii evidence and the rehearsal for Di.
Someone who has never seen the device is handed it, switched on, with the user
sheet and nothing else. They attempt the main task. The student watches in
silence and records every wrong guess, every control tried in the wrong order, and
every question asked. Silence is the hard part and it is worth saying so.

## Civ (ongoing, logged every build class)

> Fully justifies changes made to the chosen design and plan when making the solution.

**Deliverable: the change log**, dated, one row per change:

| Date | What changed | Design, plan, code, or part | What triggered it | Options considered | Why this one | Effect on spec, plan, or BOM |
|---|---|---|---|---|---|---|

**The part substitution rule.** Every time a part changes, three documents change
with it: the pin map, the BOM, and any Bi specification that named it. The row is
not complete until it says which. This is the habit that keeps the Biv pack alive
through the build instead of becoming a historical document.

**The one thing that makes or breaks this strand.** Students write the whole log
the night before it is due, and it always shows. Build in a **five minute log
stop** at the end of every build class, written in place. Entries must be dated
and the dates must be spread. Say plainly that an undated log written in one
sitting cannot reach 7-8.

**Prompt for a good entry.** A change with no trigger is a whim. A change with no
options considered is a reaction. 7-8 needs both, every row.

---

# Criterion D: Evaluating

## Di (2 classes)

> Designs detailed and relevant testing methods, which generate data, to measure the success of the solution.

The G9 model, expanded for electronics with a second family of tests. Human
methods come from DP A2.1 user centred research. Technical methods are new here,
and they are what makes an electronics evaluation different from a game
evaluation: a device can be measured, not only asked about.

**Requirement: every Bi specification gets a test, and across the plan there are
at least three technical tests producing numbers and at least two human tests.**

**Technical tests worth teaching**, with the instrument each needs:

| Test | What it measures | Instrument |
|---|---|---|
| Current draw | Milliamps at rest and at worst case | Multimeter in series |
| Runtime | Hours to failure, or calculated from draw and battery capacity | Stopwatch, or arithmetic shown |
| Response time | Delay from event to reaction, over 20 trials | Stopwatch, or timestamps printed over serial |
| Accuracy | Sensor reading against a trusted reference, 10 paired readings, error table | Reference thermometer, ruler, scale, phone light meter |
| Reliability | Failures per 100 actuations | Tally sheet |
| Cold start | Seconds from power on to useful | Stopwatch |
| Environment | Does it still work in the dark, in noise, in the actual room it will live in | The client's room |

**Human tests**: cold start observation with a tally of wrong guesses, task
completion trial, interview with the client, short questionnaire, observation of
observation of the device in use during the client session.

**Deliverable: the Test Plan, with the instruments actually built.** Naming a
method is not designing one.

| Which spec | Method | Human or technical | Participants or trials | Data type | Instrument | Success threshold |
|---|---|---|---|---|---|---|

Then the instruments themselves, attached:
- The questionnaire, with its actual questions
- The observation sheet, with what is being tallied and how
- The interview script, with its prompts
- The trial protocol, with what is timed or counted and by whom
- **The measurement log sheet**, with the instrument named, the units, the number
  of readings, and a row for the reference value

**Teach the distinction explicitly.** Qualitative tells you why, quantitative
tells you how much. A 7-8 plan uses both and knows which specification needs
which.

**Match the method to the spec.** Battery life needs a multimeter, not an opinion.
Interface clarity needs an observation of wrong guesses, not a question asking
whether the interface was clear. Students default to questionnaires for
everything, and this is the reflex to correct.

## Dii (2 classes)

> Critically evaluates the success of the solution against the design specification based on authentic product testing.

**Class 1: the client session.** The device goes to the people on the brief card
and is used by them. Every student runs their own instruments and collects their
own data. The technical tests can run before or after, since they need a bench
rather than an audience. Data from this session is what the Dii table is built
on, so students leave with their sheets filled in rather than with impressions.

**Class 2: the evaluation.** Point by point against every Bi specification:

| Spec | Test used | Data collected | Met, partly met, not met | Evidence | What this means |
|---|---|---|---|---|---|

**Where "critically" lives.** A closing section on the limits of the student's own
evidence: one unit tested rather than a production run, tested largely by its
designer who knows how to hold it, a single session, a room that is not the room
it will live in, testers who wanted to be kind. A student who reports a spec as
met on the basis of four testers and says so is showing more judgement than one
who claims certainty.

**The electronics addition to "critically".** A device that works when its
designer operates it is not the same as a device that works. Any specification
tested only by the student is flagged as such in the evidence column. This one
convention lifts the honesty of the whole table.

## Diii (1 class)

> Explains how the solution could be improved.

**Deliverable.** Ranked improvements, each traced to evidence:

| Improvement | Type | Which spec it addresses | Dii evidence that prompted it | Why this would work | Cost and time | Rank |

**Type** is the electronics addition, and it is what makes the ranking mean
something, because it tells you what an improvement actually costs:

| Type | What it takes |
|---|---|
| Firmware | An evening. Free |
| Wiring | An hour at the bench. Nearly free |
| Part | Money and lead time. The BOM changes |
| Enclosure | A reprint. A day, and material |
| Concept | A rebuild. Not happening this unit, but worth saying |

Rank by impact against cost, and say which ranking rule was used.

**Two rules.**
- Every improvement traces to a specific Dii finding. An improvement with no
  evidence behind it is a preference.
- Include **one improvement for something that passed**. Meeting a specification
  is not the same as being as good as it could be, and noticing that is a 7-8
  move.

## Div (2 classes)

> Explains the impact of the product on the client/target audience.

Impact is easy to confuse with satisfaction. "They liked it" is a Dii finding.
Impact asks what the device does to the people who have it, and to people around
them, and to the room it sits in.

**Class 1: the client demo session.** This is a use session, not a show. The
device goes to the people on the brief card, in the place it would live, and it
runs there for the length of the class. Three parts, in this order:

1. **Hand it over and say nothing.** The client does the real task with it while
   the student watches and records. Ten minutes, minimum
2. **The impact interview.** Six questions, which are what generate impact
   evidence from a single session rather than satisfaction:
   - What would you stop doing if you had this?
   - What would you start doing?
   - Who else in this room would notice it, and would they mind?
   - What would annoy you about it by the third week?
   - Who would charge it, or fix it, or turn it back on when it stops?
   - Would you want to keep it, and what would have to be true for that?
3. **Film the demo video**, during the session, while the client is actually
   using it. Not afterwards on a desk

**On the strength of this evidence.** One session is thinner than a week of use,
and questions 1, 2 and 4 are asking the client to predict rather than to report.
Students say so in the report and label those answers as projections. Impact
claimed from a demonstration and honestly bounded is worth more than impact
asserted from a demonstration and dressed up as observation.

**Class 2: the impact report**, individual, in two parts.

**Part 1: the demo video, 3 minutes.** The client using the device, in the place
it would live, doing the real task, with their own words over it. Devices go home
with students afterwards, so without this the only record of the device in use
disappears. The video is also what makes the strand submittable to ManageBac as
evidence rather than as description.

**Part 2: the written report, 2 pages**, six required sections, which are what
push past "they liked it":

1. **Who was affected**, including people beyond the direct user. Who else is in
   that room, who has to look at it, who has to charge it
2. **Intended against actual impact**, quoting the Ai need statement directly
3. **Evidence** from the demo session and, as a second occasion, from the Dii
   client session: quotes, tallies, what people did rather than what they said.
   Two sessions is not many, and saying so is part of the section
4. **Unintended effects**, positive and negative. Did anyone use it for something
   else? Did the sound annoy someone two desks away? Did it become a distraction,
   or a status object, or a thing people argued over?
5. **Wider impact**, at least three of: what happens to this device when it
   breaks and who could fix it; where it goes when it is finished with, including
   the battery; what it draws from the wall over a year; what it would cost to
   make twenty; whether the labels and the interface work for a multilingual
   audience; who is excluded by the dexterity, hearing, sight or reading it
   assumes
6. **Was the original need met**, answered plainly, yes, partly or no, with
   reasons

**The bookend.** Quoting their own Ai need statement closes a loop that has been
open for 36 classes, and it is where the strongest students show they understood
the whole arc rather than sixteen separate tasks.

**Section 5 is the electronics one.** Repairability, e-waste and battery disposal
are where this unit reaches the material that DP C2 circular economy covers
formally. It is worth flagging to students that this is the conversation the
whole industry is currently having.

---

# Practice material and formative assessment

Formatives are ungraded unless marked otherwise. Each is small enough to sit
inside the class before the strand it prepares for, or inside the bench block.

## Criterion A

| For | Formative | Time | What it fixes |
|---|---|---|---|
| Ai | **Sticky note test.** 10 problems on cards. For each, decide whether electronics is justified or whether a label, a timer, a person or a phone would do it better. | 15 min | The whole unit's founding error, caught in one activity |
| Ai | **Need or want sort.** 12 statements about a demographic, sorted into need, want, and assumption. Carried over from G9. | 15 min | Wants asserted as needs |
| Ai | **Weak brief autopsy.** A deliberately vague need statement written by you. In pairs, find the three unjustified claims. | 15 min | Shows justification by its absence |
| Aii | **Spend the tokens.** A practice research budget on a fake brief before doing it for real. | 20 min | Prioritisation without the stakes |
| Aii | **Question quality ladder.** Rank six research questions from useless to sharp. "Do people like gadgets?" against "How long does a Grade 6 stay at a desk before getting up?" | 10 min | Question quality |
| Aii | **What a bench test buys you.** Two research plans, one with a bench test and one without. Both hit build class 4. What happens to each? | 10 min | Why 3 tokens on hardware is not wasted |
| Aiii | **Guess the block diagram, together.** You lead a full black box teardown of one device from the front, thinking aloud, then play the teardown video and mark your own guesses. | 30 min | Models the depth expected, and models being wrong in public |
| Aiii | **Name that part.** Show a behaviour, students name every catalog part that could produce it and rule out the ones that could not. | 15 min | Builds the shared catalog vocabulary |
| Aiii | **The badly designed thing.** Bring a genuinely annoying device. Locate the failure precisely: is it the sensor, the decision, the feedback, or the interface? | 20 min | Analysis rather than complaint |
| Aiv | **Brief versus spec sort.** 10 statements, decide which belong in Aiv and which in Bi. | 10 min | The single most common A to B confusion |

## Criterion B

| For | Formative | Time | What it fixes |
|---|---|---|---|
| Bi | **Make it measurable.** 8 unmeasurable specs, rewrite each with a number, a unit and a test. | 20 min | "Responsive", "reliable", "user friendly" |
| Bi | **Spec to test matching.** Given a spec, choose the method that could actually test it, and say which instrument it needs. | 15 min | Sets up Di early |
| Bi | **Find the untestable spec.** A specification page with three rows that cannot be tested. Find them, fix them. | 15 min | Rule two of Bi |
| Bii | **Double draw sprint.** Draw an input and an output card, sketch a concept in 8 minutes. Three rounds. | 30 min | Fluency and range before it counts |
| Bii | **Block diagram drill.** Given a described device, draw the block diagram naming catalog parts. Six devices, increasing in difficulty. | 20 min | The core drawing of the unit |
| Bii | **Annotation density check.** Two sketches of the same idea, one bare and one annotated. Count what can only be learned from the annotated one. | 15 min | Annotation is the assessed part, not the drawing |
| Bii | **Interpretation rehearsal.** Wire a partner's block diagram on a breadboard, from the sheet alone, with no talking. | 20 min | Reveals what a reader actually needs |
| Biii | **Blow the power budget.** A parts list that draws more than the supply can give. Find it, then fix it three different ways. | 20 min | The gate that catches the most projects |
| Biii | **Pin collision hunt.** A pin map with a boot pin used, two parts on one pin, and an analog part on a digital-only pin. | 15 min | The pins gate, and how to read a catalog pin table |
| Biii | **Matrix with a rigged winner.** A decision matrix where the highest scoring option is obviously wrong. What did the matrix miss? | 20 min | Stops blind trust in the numbers |
| Biii | **Write the case against.** Practise arguing against a design you like. | 15 min | The hardest half of Biii |
| Biv | **State diagram drill.** Draw the state diagram for three familiar objects: a microwave, a set of traffic lights, a game controller that sleeps. | 25 min | The page that carries the pack |
| Biv | **Schematic to breadboard, and back.** Given a schematic, build it. Given a built breadboard, draw the schematic. | 30 min | Schematic symbols become readable rather than decorative |
| Biv | **Cutout disaster.** An enclosure drawing with the USB cutout 3 mm out and the screen window rotated. Find the errors before printing. | 20 min | Why dimensioned drawings exist |
| Biv | **Price a build.** Take a finished project and write its full BOM with real prices and lead times. | 25 min | Cost is a specification |
| Biv | **Solder School clinics.** Three rotating bench sessions, ending in certification. Runs during the Biv classes. | 3 x 25 min | Nobody solders before they can |

## Criterion C

| For | Formative | Time | What it fixes |
|---|---|---|---|
| Ci | **Follow a bad plan.** A vague plan. Ask students to state exactly what they would do first. They cannot. | 15 min | Makes "sufficient for peers to follow" concrete |
| Ci | **Critical path hunt.** 10 build tasks with dependencies and lead times. Find what blocks everything. | 20 min | Sequencing, not listing |
| Ci | **What could go wrong.** For five build tasks, write the fallback. The printer is queued, the part has not arrived, the sensor reads noise. | 15 min | The column that separates 5-6 from 7-8 |
| Cii | **Rail check drill.** Before power on, every time: power right, ground right, polarity right, nothing bridging the centre channel. Run it as a chant until it is automatic. | 5 min, repeated | Prevents most of the smoke |
| Cii | **Joint gallery.** Photos of a good joint, a cold joint, a bridge, a lifted pad, a starved joint. Identify each, then match them against your own work. | 15 min | Self-assessment in the soldering track |
| Cii | **Loom clinic.** One tidy colour coded strain relieved loom beside one bird's nest, both working. Which is worth more marks, and why? | 10 min | Wiring is a graded skill, not a means to an end |
| Cii | **Break it and fix it, round two.** Broken circuits and broken code at four stations, harder than the bench block version. Diagnose using the protocol, log it as a bug diary entry. | 30 min | Troubleshooting as a method |
| Cii | **Viva rehearsal.** In pairs, point at three lines of each other's code and ask the three questions. | 15 min | Removes the surprise, keeps the standard |
| Cii | **Delay is a trap.** A blocking sketch that misses button presses while it waits. Fix it without a blocking delay. | 20 min | The single most common firmware weakness |
| Civ | **Log stop.** Five minutes at the end of every build class, written in place. | 5 min x 10 | The highest value routine in the unit |
| Civ | **Trigger, options, choice.** Rewrite three weak change log entries so each has all three. | 15 min | Turns a diary into a justification |
| Civ | **The substitution chain.** One part changes. Find all three documents that must change with it. | 10 min | Keeps the Biv pack alive through the build |
| Ciii | **Cold start, internal.** Swap devices between students a week before the deadline. Watch in silence. Record wrong guesses. | 30 min | Finds interface failures while there is still time |
| Ciii | **Label legibility check.** Read each other's labels from the distance the device is actually used at. | 10 min | Labels written at 20 cm, read at 2 m |

## Criterion D

| For | Formative | Time | What it fixes |
|---|---|---|---|
| Di | **Method matching.** Six specs, choose the right method for each and name the instrument. | 20 min | The questionnaire-for-everything reflex |
| Di | **Measure something.** Current draw of three different circuits, tabulated, with the multimeter in series. | 25 min | Technical testing becomes normal |
| Di | **Accuracy against a reference.** Ten paired readings of a sensor against a trusted instrument. Build the error table. | 25 min | What "generates data" means |
| Di | **Write five bad questions.** Leading, double barrelled, vague. Then fix them. | 20 min | Instrument quality |
| Di | **Observation sheet build.** Watch a 5 minute clip of someone using a device badly, tally the wrong guesses using a sheet you designed. | 25 min | Observation generates data too |
| Dii | **Met, partly met, not met.** Given data and a spec, decide and defend. | 15 min | Students over-claim "met" |
| Dii | **Limits of the evidence.** Given a result from one unit and four testers, list four reasons to be cautious. | 15 min | Where "critically" lives |
| Dii | **It works when I do it.** A device only its designer can operate. Why is that a failure and not a defence? | 10 min | The electronics addition to "critically" |
| Diii | **Type the improvement.** Given ten improvements, classify each as firmware, wiring, part, enclosure or concept, then rank by cost against impact. | 20 min | Makes the ranking mean something |
| Diii | **Trace the improvement.** Given a Dii table, propose improvements and mark which have no evidence behind them. | 20 min | Preference against finding |
| Div | **Satisfaction against impact sort.** 10 statements sorted into "they enjoyed it" and "it changed something". | 15 min | The core confusion in Div |
| Div | **Unintended effects hunt.** For a familiar device, list three effects the designer did not intend. | 15 min | Section 4 of the report |
| Div | **Where does it go.** Trace a small electronic device to its end of life: who repairs it, who recycles it, what happens to the battery. | 20 min | Section 5, and the link to DP C2 |
| Div | **Observed or predicted.** 10 client statements, sorted into what was seen happen and what the client thinks would happen. | 10 min | Keeps the demo session's projections honestly labelled |
| Div | **Three minute cut.** Storyboard the demo video before filming it. Six shots, no more. | 20 min | Stops a 3 minute video being one static shot |

---

# Reusable class routines

- **Rail check.** Before any power on: power right, ground right, polarity right,
  nothing bridging the centre channel. Said aloud until it stops being said.
- **Log stop.** Last five minutes of every build class, Civ entry written in
  place, dated.
- **Catalog callout.** Whenever a part comes up in discussion, name it and its
  slug. Builds the shared vocabulary at no time cost, exactly as the mechanics
  catalog does in G9.
- **Spec check.** Open the Bi page at the start of every B, C and D class. Specs
  that are never reread do not get met.
- **Swap and read.** Any deliverable claiming to be readable by others is read by
  others before submission. Applies to Bii, Biv, Ci and Ciii.
- **Bug diary entry before help.** A student asking for help brings the first four
  steps of the troubleshooting protocol written down. This applies to asking the
  teacher and to asking the model.

---

# Decisions made

| Question | Decision |
|---|---|
| Grouping | Individual builds |
| Client | Assigned demographic brief cards, curated by the teacher, as in G9. Two contact sessions: the Dii client session and the Div demo. No loan period |
| Length | 36 classes: 1 launch, 2 bench, 33 assessed. No slack. Recover a class from Aiii if slack is needed |
| Board | ESP32-S3 SuperMini issued to every student. Alternatives argued in Biii, costed in Biv |
| Stock | Not a constraint. Cheap additions bought on request; students may buy their own |
| Soldering | Taught and certified in three clinics during Biv. A no-solder route exists and carries the same marks |
| Take home | Devices go home at the end if the student wants them, which is why Div needs the demo video as its record |
| Cost | Teacher buys cheap parts. Students may buy their own. Everything appears on the BOM with cost and lead time |
| Prior coding | Assume zero. AI assisted throughout. Assessment sits in specification, troubleshooting and the code viva |
| Submission | ManageBac at every strand, including strands also assessed live |

---

# Still to build

**The teacher facing unit page.** `curriculum/myp/g10-electronics-design.html`
currently holds a four criterion skeleton with every task sheet section marked as
placeholder. It needs rebuilding to the 16 strand shape that
`curriculum/myp/g9-game-design.html` uses, with all 16 strands, the formative
tables, the bench block, Solder School and the class sequence.

**Catalog additions**, driven by what this plan assumes:
- A **pin table** on the ESP32-S3 SuperMini page complete enough to run the pins
  gate against, including which pins must be left alone
- A **current draw** figure on every part that has one, so the power gate is
  arithmetic rather than guesswork
- A **"could this part do that"** framing on sensor pages, which is what Aiii
  black box inference needs

**Tools worth stubbing on the unit page**, in rough order of value:

1. **Power budget calculator.** Add parts, get worst case draw, supply headroom
   and a runtime estimate. Feeds the Biii power gate directly
2. **Pin map planner.** The MacroPad Builder generalised beyond the macropad, so
   any project can be mapped and collisions caught
3. **State diagram sketcher.** States, events, transitions, exported as an image
   for the Biv pack
4. **Specification builder** with a no-number warning, shared with G9
5. **Research budget planner**, shared with G9
6. **Change log and bug diary** with real timestamps, so an entry written on the
   night cannot claim to have been written in build class 3
7. **Student progress tracker** across the 16 strands, shared with G9

**Practice materials themselves**, which do not exist yet: the sticky note test
cards, the weak brief, the rigged matrix, the blown power budget, the pin
collision sheet, the joint gallery photographs, the bad questions set, and the
badly designed device for the Aiii formative.

**Next step.** Class by class breakdown, in the same shape as the G9 one.
