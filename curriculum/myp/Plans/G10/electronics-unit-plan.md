# Grade 10 Electronics Product Design: 16 strand assessment plan

Working document. Strand descriptors below are the 7-8 band, task specific.
Sibling document to `../G9/tabletop-unit-plan.md`, which several devices here are
lifted from deliberately, so a student who did G9 recognises the shape and the
teaching time goes into the electronics instead of into the format.

## Unit parameters

| | |
|---|---|
| Grouping | **Individual.** Every student designs and builds their own device. |
| Length | 33 assessed classes plus a launch class and 2 slack, so 36. |
| Client | Assigned demographic brief cards naming a real group at school, curated by the teacher. Same device as G9. |
| Scope | **Catalog bounded.** Anything buildable from the parts in the catalog. Nothing outside it without a logged approval. |
| Submission | Each strand submitted separately as it finishes, added to a running portfolio. |
| User documentation | **1 page user sheet maximum.** The equivalent of G9's 4 page rulebook cap. |
| Core requirement | The device **must sense, decide and act**, and it must **leave the bench**. See below. |
| Key tool | [Electronics Parts Catalog](https://edu.contrapaul.com/tools/electronics/), 49 parts in 9 categories, every part deep linkable. |
| Second tool | [MacroPad Builder](https://edu.contrapaul.com/tools/macropad/), for anyone whose device is an input device. |

## The two non-negotiables

Both are written into the Bi specification and tested in Di and Dii, so a device
that misses either cannot reach the top band however well it is made.

**1. It senses, decides and acts.** At least one input from the world or the user,
at least one output, and code that makes a real decision between them. The failure
mode is the **passthrough**: a button that lights an LED, a potentiometer that
moves a servo. The input is doing all the work and the code decides nothing. This
has to be caught in Bii, not in Dii when the thing is already soldered. The test is
one sentence a student must be able to write: *it senses ___, and if ___ then it
does ___, otherwise it does ___.* A concept that cannot fill the "otherwise" is a
passthrough.

**2. It leaves the bench.** The device ends up housed, labelled, powered from its
own supply, and running its code on power-up with no computer attached. A
breadboard with a laptop plugged into it is a prototype, not a solution. This is
the single largest predictor of a weak Ciii and it needs saying in the launch
class, because students budget their time as if the last three classes were free.

**The individual build problem, and how this plan solves it.** Individual builds
make every strand honest evidence with no group machinery needed, which is why they
were chosen. What they cost is the peer pressure and the second pair of eyes that a
group build supplies for free. Four routines put that back, and each one is also
the direct evidence for the descriptor it sits under:

1. **The interpretation test** in Bii. A classmate explains your concept back from
   the sheet alone.
2. **The challenge round** in Biii. Three classmates attack your chosen design.
3. **The build from the pack test** in Biv. A classmate wires your first subsystem
   from your drawings alone.
4. **The cold hands test** in Ciii. A stranger uses your finished device with the
   user sheet and nothing else.

Every one of these produces a written record of what another person could not do,
which is worth more as evidence than anything the student says about their own work.

## Where the skills training goes

Thirty six classes with no dedicated skills block is tight for electronics, and
pretending otherwise would sink the build. The answer is the **bench drill**: a 10
to 15 minute starter at the front of most A and B classes, listed in the formative
section below. Ten of them, run before the build begins, cost no assessed class and
mean students arrive at Ci already able to strip a wire, read a meter, and build a
three part circuit from a schematic. Skill taught during the build block is skill
taught too late.

---

## Sequence at a glance

| Strand | Classes | Individual deliverable |
|---|---|---|
| Launch | 1 | Demographic brief cards issued, catalog tour, the two non-negotiables |
| Ai | 1 | Need Statement, 1 page |
| Aii | 1 | Research Plan, prioritised, 1 page |
| Aiii | 3 | 4 Teardown Cards plus a synthesis page |
| Aiv | 1 | Design Brief, 1 page with evidence column |
| Bi | 1 | Design Specification, 8 to 12 testable specs |
| Bii | 3 | 6 to 8 annotated concepts plus 2 breadboard spikes |
| Biii | 2 | Decision matrix, challenge round record, critical justification |
| Biv | 3 | Production Pack, 5 to 8 pages |
| Ci | 1 | Build schedule plus order of assembly argument |
| Cii | in build | Making Log, 3 skills at depth across 2 tracks |
| Ciii | in build | The finished device, cold hands tested, plus 1 page user sheet |
| Civ | ongoing | Change Log, dated entries |
| C build block | 10 | (covers Cii, Ciii, Civ) |
| Di | 2 | Test Plan with the instruments and rigs actually built |
| Dii | 2 | Point by point evaluation against every spec |
| Diii | 1 | Ranked improvements, split into fixes and next version |
| Div | 2 | Handover session, then impact video plus 1 page summary |
| Slack | 2 | |

---

# Criterion A: Inquiring and analysing

## Ai (1 class)

> Explains and justifies the need for a solution to a problem for a client/target audience.

**Task.** Each student draws a demographic brief card naming a real group at school:
the Grade 6 form class, the library lunch crowd, the ESL support group, the Grade 12
common room, the after school care group, the art room, the front office, staff at
break. They identify, explain and justify the need for an **electronic** device for
that audience.

**Deliverable.** One page Need Statement:
- Who the audience is, in specifics rather than generalities
- The situation as it currently stands, with at least one piece of evidence
- **Why this needs electricity.** Why a device beats a printed sign, a rule, a
  mechanical object, a person, or a phone app
- What happens if nothing is made

**The phone test, which is the electronics-specific move.** Almost every idea a
Grade 10 has is something a phone already does. The justification has to say what a
dedicated device does better: it is always on, it does one thing, it needs no
unlock and no account, it tolerates wet or gloved hands, it sits where a phone would
not be left, everyone in the room can see it at once. A student who cannot answer
the phone test has an idea, not a need.

**What separates 7-8 from 5-6.** The justification is the whole strand. A 5-6
establishes that the audience exists and would find a gadget useful. A 7-8 argues
why this audience, this need, and why an electronic device specifically beats every
alternative including doing nothing.

**Common failure.** Writing about the device they want to build rather than about
the audience. Ban the word "I" from the first draft.

## Aii (1 class)

> Constructs a detailed research plan, which identifies and prioritizes the primary and secondary research needed to develop a solution to the problem independently.

MYP Design has no space to grade a research paper, so the plan itself has to be the
artefact and it has to visibly prioritise. The G9 token device transfers directly,
with one addition that matters a great deal in electronics.

**The research budget.** Students receive 12 research tokens. Every activity has a
cost, and they cannot afford everything.

| Activity | Cost | Primary or secondary |
|---|---|---|
| Read a catalog part entry and record pins, voltage, difficulty | 1 | Secondary |
| Other secondary source: datasheet, build guide, tutorial, teardown | 1 | Secondary |
| Questionnaire to the audience | 2 | Primary |
| Product observation, an existing product in use | 2 | Primary |
| Structured observation of the audience in the real place | 3 | Primary |
| Interview with a client representative | 3 | Primary |
| **Bench test: wire a part up and find out what it actually does** | 3 | Primary |
| Focus group | 4 | Primary |

**Two spending rules.**
- At least 3 tokens on primary research.
- **At least 3 tokens on a bench test.** In electronics you cannot plan around a
  part you have never made work. The datasheet says the ultrasonic sensor reads to
  four metres. It does not say what happens when the target is a jumper, at an
  angle, in a noisy corridor. That is a research question and the only instrument
  that answers it is the part itself.

**Deliverable.** One page Research Plan table, one row per activity:

| Question I need answered | Method | Primary or secondary | Cost | Priority | What decision this unlocks | When |
|---|---|---|---|---|---|---|

Plus two short paragraphs below the table:
- **Why these, in this order.** Which activity had to happen first and why.
- **What I gave up.** The activity they could not afford, and the risk that creates.

The "what decision this unlocks" column does the work. It turns prioritisation from
an opinion into an argument. In electronics the entries should be concrete and they
should name parts: whether the HC-SR04 or the PIR, whether 3.3V drives the servo or
whether it needs its own supply, whether the display goes I2C or SPI, whether the
thing runs on a battery at all.

## Aiii (3 classes)

> Analyses a range of existing products that inspire a solution to the problem in detail.

**Task: the inferred teardown.** Nothing gets opened. Students take a real product
they can hold or watch and reconstruct what is inside it from what it does. The
catalog is the vocabulary, so a guess has a name and a page rather than being "a
sensor thing".

This is a better task than a physical teardown for this unit. Opening a product
shows you a board covered in parts nobody in the room can identify. Watching one
carefully and arguing your way to its block diagram is the actual analytical skill,
and it is exactly what Bii asks them to do in reverse.

**Required range, one from each:**
1. A product the assigned demographic actually uses
2. A product using a sensor the student has never used
3. A product with no screen, where every piece of feedback is light, sound or
   movement
4. Free choice, may be something they own

Products that work well: motion sensor lights, automatic soap dispensers, electric
kettles, microwave keypads, bike computers, card readers, hand dryers, rice cookers,
smart plugs, car key fobs, digital thermometers, lift call panels, vending machines.

**Deliverable, per product. One Teardown Card:**
- What it is, who uses it, where it lives, how it is powered
- **Observable behaviour log.** What it does when you do X, at least six trials,
  and the trials must include edge cases: block the sensor, hold the button, press
  two at once, unplug it mid use, give it something it cannot handle
- **Inferred block diagram.** Input, process, output, drawn, with arrows labelled
- **Bill of materials guess, named from the catalog**, with a confidence mark and
  the evidence for each guess
- One sentence: what I take from this, what I leave

The confidence column is where the analysis lives. "Probably a PIR sensor, high
confidence, because it triggers on movement but not on a hand held still, and it has
the white segmented dome" is analysis. "PIR sensor" is a list.

**The verification pass, in class 3.** After guessing, students find a real teardown,
a manual, or a datasheet and mark where they were right and where they were wrong. A
well argued wrong guess with an honest correction is stronger evidence than a lucky
right one, and students need telling that.

**Deliverable, synthesis page.** A comparison matrix across all four products
against the same criteria, ending in 3 to 5 numbered **design implications**, each
a sentence beginning "Because..., my device should...".

**What separates 7-8.** The synthesis. Four good teardown cards with no synthesis is
a 5-6, because the analysis has not been carried forward. The implications are what
Aiv and Bi quote directly.

**Class shape.** Class 1: teacher led model teardown thinking aloud, then two
products in the room. Class 2: two more, one researched online. Class 3:
verification pass and synthesis.

## Aiv (1 class)

> Develops a detailed design brief, which summarizes the analysis of relevant research.

Note the verb. It **summarises the analysis**, so this is a synthesis document, not a
specification. Bi is where measurable criteria appear. Keeping these apart is the
main thing students get wrong, and it is worth a 10 minute sort before they start.

**Deliverable.** One page Design Brief with a mandatory evidence column, so every
claim points back at a source:

| Section | Content | Evidence |
|---|---|---|
| Audience | Who, and what matters about them | Ai, Aii |
| The need | Restated in one sentence | Ai |
| What the research showed | 3 to 5 findings | Aii, Aiii |
| Design implications | Carried from the Aiii synthesis | Aiii |
| Technical constraints | Voltage available, pin count, parts in the catalog, what code the student can write, bench time | Catalog, Aii bench test |
| Human and physical constraints | Where it lives, who touches it, mounting, safety, mains or battery | Ai, Aiii |
| Design intent | One paragraph on what will be made and for whom | Synthesis |

**The closing line, which is compulsory.** The design intent paragraph ends with the
sentence from non-negotiable 1: *it senses ___, and if ___ then it does ___,
otherwise it does ___.* Putting it here rather than in Bii means a passthrough gets
caught a week earlier.

**Optional flourish.** Present the design intent as the side panel of a retail box:
feature bullets and a small spec block. On theme, and it forces brevity. Keep the
evidence table as the graded part.

---

# Criterion B: Developing ideas

## Bi (1 class)

> Develops detailed design specifications, which explain the success criteria for the design of a solution based on the analysis of the research.

The most important single page in the unit, because Dii tests against it line by
line and Di builds instruments for it. Time spent here is repaid twice.

**Deliverable.** A one page specification, 8 to 12 rows. Every one has four parts:

| # | Specification | Measurable success criterion | How it will be tested | Source |
|---|---|---|---|---|
| 1 | Reacts fast enough to feel immediate | Output changes within 300 ms of the trigger, over 20 trials | Video at 60 fps, frame count | Aiii implication 2 |
| 2 | Runs a full school day on its battery | 8 hours minimum from a full charge | Run to flat, current logged at the start | Aii bench test |

**Required categories**, at least one each:

| Category | What it pins down |
|---|---|
| Function | What it senses, what it decides, what it does |
| Response and timing | How fast, how often, how long |
| Power | Source, voltage, current draw, runtime |
| Physical and enclosure | Size, mounting, where it lives, what it survives |
| Interface and feedback | How the user knows what it is doing and what went wrong |
| Reliability | Behaviour on bad input, on power loss, on lock up |
| Safety | Heat, current, exposed conductors, small parts, water |
| Cost and parts | Named from the catalog, with quantities |

**Three hard rules.**
- If it cannot be measured, it is not a specification. "Responsive" fails. "Lights
  within 300 ms of the door opening, over 20 trials" passes.
- **Every part named in a spec is linked to its catalog page.** The catalog is deep
  linkable, so `.../tools/electronics/#hc-sr04` goes straight to the part. This is
  what the user asked for and it is also self policing: a student who cannot link
  the part has not chosen it yet.
- **At least two specs must be a number that cannot be met by trying harder.** Volts,
  milliamps, milliseconds, millimetres, hours. Effort does not change a voltage. These
  are the specs that force engineering rather than enthusiasm, and they are the ones
  Di will measure with an instrument rather than a questionnaire.

**Write the test column now, not in Di.** Di expands these into real instruments.
Writing them here is what stops a student setting a spec nothing could ever test.

## Bii (3 classes)

> Develops a range of feasible design ideas, using an appropriate medium(s) and detailed annotation, which can be correctly interpreted by others.

**Task, three parts.**

**1. Forced range: the constraint draw.** Each student draws two cards from the
catalog, one input part and one output part, and must generate a concept using both.
Draw three times. Without this, a student produces six versions of one idea, all of
them a box with a screen. With it, they are made to think about what a tilt switch
and a vibration motor could possibly be for, which is where the interesting concepts
come from. Across the full set, concepts must use at least **three different sensor
or input parts and three different outputs**.

**2. Six to eight annotated concepts**, on a standard A3 template so the annotation
has somewhere to live. Each concept shows:

- **System block diagram**, input to process to output, with the actual catalog
  parts named and the arrows labelled with what travels along them
- **Sketch of the physical object in the place it will live**, with a hand or a body
  for scale. A device drawn floating on white paper has not been designed for anywhere
- **The decision, written out**, as an if-then-otherwise sentence or as five lines of
  pseudocode. This is the electronics equivalent of a core loop diagram, and it is
  where feasibility is proven or lost
- Parts named from the catalog, with the pin count added up
- Annotation on how it serves the audience, referencing a Bi spec by number
- **One risk**: the part most likely to not work, named

Hand drawing is the better medium, because MYP rewards annotation density and
students annotate more freely by hand. Digital is allowed if the annotation is as
rich.

**3. Two breadboard spikes, actually built.** Feasibility is in the descriptor, and
an idea nobody has wired is not demonstrably feasible. A spike is not the concept, it
is the riskiest ten minutes of it: does the sensor read at that distance, does the
board drive that load, does the display show that many characters. Evidence is a
photo and one line of what it actually did, including when the answer was no. A spike
that failed is more useful than one that worked, because it fails now instead of in
build class 6.

**The interpretation test, which is also the formative.** Swap sheets with a
classmate. They explain your concept back to you from the sheet alone, with no
talking from you, and they must be able to state what it senses, what it decides and
what it does. You write down what they got wrong. That list is submitted with the
concepts and is direct evidence for "can be correctly interpreted by others", which
is otherwise very hard to evidence.

**Class shape.** Class 1: constraint draw and rapid concepts. Class 2: develop and
annotate the best six. Class 3: breadboard spikes and the interpretation test.

## Biii (2 classes)

> Presents the chosen design and justifies fully and critically its selection with detailed reference to the design specification.

This is the strand where students write "I chose this one because it is the best".
The fix is to make the case against the winner compulsory. G9 got that for free from
the group vote, since a student whose concept lost had to justify someone else's.
Individual builds remove that, so it has to be built.

**Task: the challenge round.** Each student presents their chosen concept to a panel
of three classmates whose job is to attack it. The panel works from a challenge card
set, so the attacks are technical rather than polite:

- Where does the power come from, and how much does it draw?
- What happens when two things happen at once?
- What if the sensor is wrong? How would the user even know?
- Which Bi spec does this fail, and what would it cost to fix?
- What happens the first time someone who did not build it picks it up?
- What if that part is out of stock, or arrives dead?
- What happens when the battery is nearly flat?

The student records the three hardest challenges and answers them in writing.

**Deliverable, two parts.**

**1. Weighted decision matrix.** Three finalist concepts scored against every Bi
specification, with weights assigned and justified. The weights are justified from
the research, not from taste: a spec that came out of an Aiii implication or an
interview outweighs one the student invented.

**2. Critical justification, one to two pages**, four required sections:
- Why the chosen design wins, referencing specs by number
- **The case against it.** What it does worse than the concepts rejected, plus the
  three hardest challenges from the panel and honest answers. This is the section
  that converts "justifies" into "justifies critically"
- What was carried over from the rejected concepts into the final design
- **What is still unresolved, and the named fallback.** For the riskiest component,
  a second catalog part that could replace it and what would have to change if it
  did. A chosen design with no plan B for the part most likely to fail has not been
  fully justified

## Biv (3 classes)

> Develops accurate and detailed planning drawings/diagrams and outlines requirements for the creation of the chosen solution.

Genuinely rich in electronics, and richer than in tabletop, because "planning
drawings" here means several different kinds of drawing that each say something the
others cannot. A schematic tells you what connects to what. A wiring layout tells you
where it physically goes. Neither tells you what the code does.

**Deliverable: Production Pack, 5 to 8 pages.**

| Page | Content |
|---|---|
| System block diagram | Every input, the processing, every output. Arrows labelled with what travels along them |
| Circuit schematic | Every component and every connection, drawn to convention with proper symbols. A schematic, not a picture of a breadboard |
| **Pin map table** | Every pin used: board pin, what it connects to, mode (digital in, analog in, PWM, I2C, SPI), and **why that pin**. Pins to avoid marked as reserved |
| Wiring and layout drawing | How it physically goes together: breadboard or perfboard layout, wire colours, connector and cable positions |
| Enclosure drawings | Orthographic, dimensioned, with a title block. Every cutout positioned from a datum, sized for the real part with a stated tolerance |
| **Program flowchart or state diagram** | What the code does, including what happens at startup and what happens on bad input |
| Requirements | Parts list with catalog slugs and quantities, tools, consumables, cost, time per stage, and lead times for anything ordered or printed |

**The pin map is the page that saves the build.** Most build class disasters are a
pin conflict or a pin that cannot do what was asked of it, discovered after
soldering. Requiring a "why that pin" column forces the student to read the board's
catalog entry properly and notice the strapping pins that break the boot.

**Skills teaching needed.** Schematic symbol conventions, the difference between a
schematic and a wiring picture, flowchart notation, and a reteach of dimensioning
and title blocks. Most Grade 10s met dimensioning in G8 bridge or G9. Expect one
reteach, ideally as bench drills rather than a class.

**The build from the pack test, which is the descriptor made testable.** Hand the
pack and the parts to a classmate. They wire the first subsystem from the pack
alone, with no talking from the author. Every question they ask is a gap in the
drawings. Record the gaps, revise, submit both versions.

---

# Criterion C: Creating the solution

## Ci (1 class)

> Constructs a detailed and logical plan, which describes the efficient use of time and resources, sufficient for peers to be able to follow to create the solution.

The tension worth naming: a template tight enough to scaffold a weak student can
look like it flattens the grade range. It does not. **Scaffold the format, not the
content.** Everyone gets the same columns. The 1 to 8 range lives in what goes in
them, and the gap between a plan that says "build it" and a plan with a marked
critical path, estimates informed by the Bii spikes, and named fallbacks is
enormous and obvious at a glance.

**Deliverable, two linked parts.**

**1. Build schedule** across the 10 build classes:

| Class | Task | What must be done first | Time estimate | Parts and tools | Where it happens | Fallback if blocked |
|---|---|---|---|---|---|---|

with the **critical path marked**, and every task needing a **shared resource**
named with its class number. The 3D printers, the soldering stations, the print
shop, and the multimeters are contended. Booking them in Ci is what stops four
students discovering in build class 6 that they all planned to print that day.

**2. The order of assembly argument**, half a page. Electronics has a right order
and several expensive wrong ones, and a student who can argue their order
understands the build. The rules that should appear:

- Test every subsystem on the breadboard before soldering anything
- Get the code working while the circuit is still reachable
- Solder before enclosing, never the reverse
- Leave the board reprogrammable after the enclosure closes, or plan to open it
- Anything going to the print shop or a long print is finalised first, because it
  has a lead time and everything else does not

**The peer test, which is the descriptor.** "Sufficient for peers to follow" is
testable, so test it. Swap plans. They read yours for five minutes, then narrate
what they would do in build class 1 and build class 5. Anything they cannot answer
is a gap. Record the gaps, revise, submit both versions.

**The ladder, which students should be shown.** 1-2 fills the table with "build it".
3-4 lists tasks in no particular order. 5-6 has dependencies and time estimates. 7-8
has a marked critical path, estimates that reflect what the Bii spikes actually
took, a named fallback on every task that could block, and shared resources booked.

## Cii (during the build block)

> Demonstrates excellent technical skills when making the solution.

Technical skill in this unit is not only soldering. Choosing between two parts that
both nearly work and defending the choice is a technical skill. So is writing a loop
that does not block. So is a cutout that fits the switch first time.

**Four skill tracks, matched to the room.**

| Track | Skills |
|---|---|
| Circuit construction | Strategic breadboard layout: rails wired first, short jumpers, no wires crossing the board. Soldering to perfboard, joint quality, strain relief, wire colour discipline, connectors that can be taken apart |
| Programming | Structuring code into functions, reading a sensor reliably (debounce, smoothing, calibration), state machines, non-blocking timing instead of delay, serial debugging, comments written for a reader |
| Part selection and integration | Choosing between two parts that both nearly work and justifying it, reading a datasheet for voltage and current, pull-ups and level differences, decoupling, driving a load the board cannot drive directly |
| Enclosure and interface | Housing design and fabrication, cutouts and tolerance for real parts, labelling and iconography, control layout and reach, surface finish, mounting the board so it survives being picked up |

**Requirement: three skills at depth, across at least two tracks.** Three done
properly beats ten touched lightly, and the two track minimum stops a student
spending ten classes writing code and calling it a build, or ten classes at a 3D
printer and calling it electronics.

**Evidence: the making log.** For each skill, three things: a dated photo of work in
progress with their own hand or initials visible on the part, a photo of the
outcome, and a note covering what went wrong, what they changed, and what the second
attempt did better.

**Code needs a different evidence form, and this needs saying.** For a programming
skill, the "photo of work in progress" is a before and after code excerpt, plus the
serial output or a five second video of the behaviour changing. A screenshot of
working code shows a good outcome, not a skill.

**The meter reading, which is the cheapest strong evidence in the unit.** A photo of
a multimeter at a point in the circuit, with what was expected written beside what
was measured, takes thirty seconds and is unarguable technical evidence. Ask for at
least one per student.

**Why this shape.** Excellent skill needs something to be excellent against. One
clean photograph shows a good outcome. A poor first attempt beside a fixed second
one shows both the outcome and the skill that produced it.

**Kit notes.** The 3D printers and the small laser etcher are the dependable digital
routes. The large laser cutter is unreliable and nothing should depend on it without
a stated fallback. Print shop orders cost money and need lead time, so anything going
there is finalised before everything else, and that decision belongs on the Biv
requirements page.

## Ciii (during the build block)

> Follows the plan to create the solution, which functions as intended and is presented appropriately.

**Deliverable: the finished device**, off the breadboard, meaning:

- Every function named in the Bi specification is present and works
- Housed, with the electronics not visible unless they are meant to be
- Powered from its own supply, running its code on power-up, no computer attached
- Every control labelled, so a stranger knows what it does before pressing it
- A **one page user sheet**: what it does, how to use it, what the lights mean, and
  what to do when it misbehaves

Presented appropriately means it survives being handed to a stranger and being
picked up by the cable. Cable management, no exposed solder joints, no hot glue
where a screw belongs, consistent labelling. Photograph it in the place it was
designed for, which also feeds Div.

**The cold hands test.** Someone who has never seen the device is handed it,
powered, with the user sheet and nothing else. They use it for five minutes. The
student watches in silence and records every question asked, every wrong press,
every time the device did something the user did not expect, and every time the user
was not sure whether it had worked. This is evidence for Ciii and it is the
rehearsal for Di.

## Civ (ongoing, logged every build class)

> Fully justifies changes made to the chosen design and plan when making the solution.

**Deliverable: Change Log**, dated, one row per change:

| Date | What changed | What triggered it | Options considered | Why this option | What it invalidated |
|---|---|---|---|---|---|

**The last column is the electronics-specific rigour.** Nearly every change breaks a
drawing. Move a pin and the pin map is wrong. Swap a sensor and the schematic, the
parts list and probably a spec are wrong. An entry that does not name which Biv page
it invalidated is incomplete, and this one requirement keeps the production pack
alive instead of letting it die the moment the build starts.

**The change types students forget to log**, because they only log the dramatic
ones. Prompt for these explicitly:
- Part substitutions
- Pin reassignments
- Code architecture changes, which are usually the biggest and the least logged
- Enclosure dimension changes
- **Spec relaxations.** If a spec was quietly softened during the build, it must be
  logged and justified here, or Dii is being marked against a moving target

**The one thing that makes or breaks this strand.** Students write the whole log the
night before it is due and it shows. Build in a **five minute log stop** at the end
of every build class, written in place. Entries must be dated and the dates must be
spread. Say plainly that an undated log written in one sitting cannot reach 7-8.

**Prompt for a good entry.** A change with no trigger is a whim. A change with no
options considered is a reaction. 7-8 needs both.

---

# Criterion D: Evaluating

## Di (2 classes)

> Designs detailed and relevant testing methods, which generate data, to measure the success of the solution.

**The expansion beyond G9 is that this unit has two kinds of testing.** A tabletop
game only needs people. An electronic device has specifications no human can report
on. Battery life is measured, not surveyed. Response time is timed, not remembered.
Current draw is metered. A test plan that is all questionnaires cannot reach 7-8
here, and this is the single most important thing to teach in Di.

**Human methods**, from DP A2.1 user centred research: user observation, interview,
focus group, questionnaire, user trial, scenario walkthrough.

**Bench methods**, which are the addition:

| Method | Reads | Instrument |
|---|---|---|
| Response time | Milliseconds between trigger and output | Video at 60 fps, frame counted |
| Current draw | Milliamps in each state, idle and active | Multimeter in series |
| Voltage under load | Whether the rail sags when the motor starts | Multimeter at the rail |
| Battery runtime | Hours from full to failure | Run to flat, timestamped |
| Reliability | Successes out of n trials | Tally over repeated trials |
| Range or threshold | The distance, light level or temperature where behaviour changes | Marked test rig, stepped trials |
| **Abuse test** | What it does when misused | Deliberate protocol, recorded |

**Deliverable: Test Plan, with the instruments actually built.** Naming a method is
not designing one.

| Which spec | Method | Participants or equipment | Data type | Instrument | Success threshold | Number of trials |
|---|---|---|---|---|---|---|

Then the instruments themselves, attached:
- The questionnaire, with its actual questions
- The observation sheet, with what is being tallied
- The interview script, with its prompts
- The trial protocol, stating exactly what is measured and how
- **The test rig**, if one is needed: a taped distance mark for the ultrasonic
  sensor, a covered box for the LDR, a fixed mounting so trials are comparable

**Four things to teach explicitly.**
- Qualitative tells you why, quantitative tells you how much. A 7-8 plan uses both
  and knows which spec needs which.
- **Match the method to the spec.** Students will ask people whether the device felt
  fast. Time it. They will ask whether the labels were clear. Watch someone use it.
- **Repeat trials.** One reading is an anecdote. A sensor that worked once is not a
  sensor that works. Every bench test states its n, and n is not 1.
- **The failure test is a test.** Every device gets at least one test designed to
  break it, and whatever happens is data.

## Dii (2 classes)

> Critically evaluates the success of the solution against the design specification based on authentic product testing.

**Class 1: the real session.** Client representatives use the device, in the place it
was designed for where that is possible. The bench tests run the same day, because
the device is assembled and working and that will not stay true for long.

**Class 2: the evaluation.** Point by point against every Bi specification, no
skipping the ones that went badly:

| Spec | Test used | Data collected | Met, partly met, not met | Evidence | What this means |
|---|---|---|---|---|---|

**Where "critically" lives.** A closing section on the limits of the student's own
evidence: sample size, one session only, testers who knew the designer, the room
being quieter and better lit than the real place, a runtime figure extrapolated from
one hour, the difference between what people said and what they did.

One limit is specific to this unit and worth naming for students: **you know how to
hold your own device.** The designer's success rate is not the device's success
rate, and a student who separates those two numbers is showing real judgement.

A student who reports a spec as met on three trials and says so plainly is showing
more judgement than one who claims certainty.

## Diii (1 class)

> Explains how the solution could be improved.

**Deliverable.** Ranked improvements, each traced to evidence:

| Improvement | Which spec it addresses | Dii evidence that prompted it | Why this would work, technically | Parts, cost and time | Fix or next version | Rank |

**Three rules.**
- Every improvement traces to a specific Dii finding. An improvement with no
  evidence behind it is a preference.
- **"Why this would work" must be technical and must name parts.** "Make the sensor
  better" is a wish. "Replace the HC-SR04 with a PIR, because every one of the six
  failures happened when the person approached at an angle rather than head on" is
  an improvement.
- Include **one improvement for something that passed**. Meeting a spec is not the
  same as being as good as it could be, and noticing that is a 7-8 move.

**The fix or next version column** is the electronics addition. Some improvements
are a wire and ten minutes. Some need a different board, a PCB, or a part the school
does not have. Sorting them and then ranking across both tells you what is worth
doing now and what would mean starting again, which is a more useful answer than a
flat wish list.

## Div (2 classes)

> Explains the impact of the product on the client/target audience.

Impact is easy to confuse with satisfaction. "They liked it" is a Dii finding.
Impact asks what the device does to the audience and to the people around them, and
in this unit it asks one thing a tabletop unit barely touches: **an electronic device
has a battery, a plug, a board and an end of life.** That is a real impact dimension
and it belongs here.

**Class 1: the handover session.** The device goes to its own client group, in the
place it was designed for. Not a demo table. Where the device can safely be left with
them between the two classes, leave it, because a few days of ordinary use produces
better impact evidence than twenty minutes of being shown off.

**Class 2: the impact report.** Individual, delivered as a **three minute video**
with a one page written summary. Video is the right medium here because a working
device is best evidenced moving, and because the video survives after the device is
taken apart and the parts go back in the drawers, which they will.

**Required sections**, which are what push past "they liked it":

1. **Who was affected**, including people beyond the direct user
2. **Intended impact against actual impact**, quoting the Ai need statement directly
3. **Evidence** from the handover: quotes, observation tallies, what people did
   rather than what they said
4. **Unintended effects**, positive and negative. Did behaviour around it change?
   Did the light, the noise or the placement bother anyone? Could everyone reach it,
   see it, hear it, and operate it?
5. **Wider impact**, at least two of: the power it uses and where that power comes
   from; what happens to it at end of life; the parts inside it and where they came
   from; cost and who could afford one; accessibility; and **what it senses about
   people**, because a sensor pointed at a person is a privacy question and Grade 10
   is old enough to be asked it
6. **Was the original need met**, answered plainly, yes, partly or no, with reasons

**The bookend.** Quoting their own Ai need statement closes a loop that has been open
for 36 classes. It is where the strongest students show they understood the arc.

---

# Practice material and formative assessment

Formatives are ungraded unless marked otherwise. Each is small enough to sit inside
the class that precedes the strand it prepares for.

## The bench drills

Ten to fifteen minutes at the front of A and B classes, before the build begins.
These are the skills training, and they cost no assessed class. Run roughly one per
class through Ai to Biv.

| # | Drill | Time | What it fixes |
|---|---|---|---|
| 1 | **Strip and tin.** Strip three wires to length, tin two. | 10 min | Nicked cores, burnt insulation |
| 2 | **One good joint.** Solder one joint on scrap, judge it against a photo of good and bad joints. | 15 min | Cold joints, and knowing one by sight |
| 3 | **Predict then measure.** Voltage at three points in a working circuit, written prediction first. | 15 min | The meter as a thinking tool, not a last resort |
| 4 | **Continuity.** Find the broken wire in a bundle of five. | 10 min | Debugging by measurement |
| 5 | **Schematic to breadboard.** Three parts, from a schematic, no picture given. | 15 min | Reading a schematic as instructions |
| 6 | **Blink without delay.** Rewrite a blocking blink as non-blocking. | 15 min | The single most useful code idea in the unit |
| 7 | **Debounce.** Count button presses before and after the fix. | 15 min | Why a clean press reads as four |
| 8 | **Read, print, smooth.** An analog sensor to the serial monitor, then averaged. | 15 min | Noisy data is normal data |
| 9 | **One line on the display.** Wire an I2C display and get text on it. | 15 min | Addresses, pull-ups, and I2C fear |
| 10 | **Find the fault.** A prebuilt circuit with one deliberate error, five minutes to find it. | 15 min | Systematic debugging, and the best drill on this list |

## Criterion A

| For | Formative | Time | What it fixes |
|---|---|---|---|
| Ai | **Why electricity?** 12 problems, sort into needs a device, needs a sign, needs a rule, needs a person. | 15 min | The reflex to electrify everything |
| Ai | **The phone test.** Five product ideas, say for each what a dedicated device does better than an app. | 15 min | The core Ai justification move |
| Ai | **Weak brief autopsy.** A deliberately vague need statement written by you. In pairs, find the three unjustified claims. | 15 min | Shows justification by its absence |
| Aii | **Spend the tokens.** Practice run of the research budget on a fake brief. | 20 min | Prioritisation without the stakes |
| Aii | **Bench test or web search?** Six research questions, decide which need a part on the bench and which a datasheet answers. | 15 min | Googling what you could measure in two minutes |
| Aii | **Question quality ladder.** Rank six research questions from useless to sharp. | 10 min | "Do people like gadgets?" versus "How far from the door does a Grade 6 start reaching for the handle?" |
| Aiii | **Teardown together.** You lead a full inferred teardown of one product, thinking aloud. | 1 class portion | Models the depth expected |
| Aiii | **Guess the block diagram.** A 30 second clip of a product working. Students draw input, process, output, then compare. | 15 min | Speed and vocabulary |
| Aiii | **Confidence calibration.** Five component guesses with reasons of varying quality, rank by how well evidenced. | 15 min | The confidence column, which is where the analysis is |
| Aiv | **Brief versus spec sort.** 10 statements, decide which belong in Aiv and which in Bi. | 10 min | The most common A to B confusion |

## Criterion B

| For | Formative | Time | What it fixes |
|---|---|---|---|
| Bi | **Make it measurable.** 8 unmeasurable specs, rewrite each with a number, a unit, and a test. | 20 min | "Responsive", "reliable", "easy to use" |
| Bi | **Find the unit.** Given specs, name the unit and the instrument that reads it. | 15 min | Volts, milliamps, milliseconds, hours |
| Bi | **Spec to test matching.** Given a spec, choose a method that could actually test it. | 15 min | Sets up Di early |
| Bii | **Two card challenge.** Draw an input and an output part, sketch a concept in 8 minutes. Repeat three times. | 30 min | Fluency and range before it counts |
| Bii | **Write the decision.** Given a concept, write the if-then-otherwise sentence that is its whole behaviour. | 15 min | Concepts that decide nothing |
| Bii | **Passthrough hunt.** Six concepts, find the three where the code does no work. | 15 min | Non-negotiable 1, caught early |
| Bii | **Annotation density check.** Two sketches of the same idea, one bare and one annotated. Count what only the annotated one tells you. | 15 min | Annotation is the assessed part, not the drawing |
| Bii | **Interpretation rehearsal.** Explain a partner's sketch back to them, first run, ungraded. | 15 min | Reveals what a reader actually needs |
| Biii | **Matrix with a rigged winner.** A matrix where the highest scoring option is obviously wrong. Discuss what it missed. | 20 min | Blind trust in the numbers |
| Biii | **Challenge round rehearsal.** Practise attacking a design with the challenge card set. | 20 min | Technical attacks instead of polite ones |
| Biv | **Schematic or picture?** A wiring photo and a schematic of the same circuit. List what only the schematic tells you. | 15 min | Why both pages exist |
| Biv | **Read it, build it.** A simple schematic, built on a breadboard, no picture supplied. | 25 min | Schematic literacy, and it doubles as bench drill 5 |
| Biv | **Pin map a real project.** Take a MacroPad Builder output and write its full pin map with reasons. | 25 min | The page that saves the build |
| Biv | **Flowchart the toaster.** A familiar appliance, including startup and the error case. | 20 min | Flowcharts that cover more than the happy path |

## Criterion C

| For | Formative | Time | What it fixes |
|---|---|---|---|
| Ci | **Follow a bad plan.** A vague plan, ask students to state exactly what they would do first. They cannot. | 15 min | Makes "sufficient for peers to follow" concrete |
| Ci | **Wrong order.** A plan that solders before testing and encloses before coding. What will it cost? | 15 min | The order of assembly argument |
| Ci | **Critical path hunt.** 10 tasks with dependencies, find what blocks everything. | 20 min | Sequencing, not listing |
| Cii | **The good failure.** Show your own first attempt beside your fixed second attempt. | 10 min | Normalises documenting failure |
| Cii | **The meter habit.** Predict, then measure, three points in a circuit. | 15 min | The cheapest Cii evidence there is |
| Cii | **Code before and after.** A working but blocking sketch, rewrite it non-blocking, keep both. | 20 min | What programming evidence looks like |
| Civ | **Log stop.** Five minutes at the end of every build class, written in place. | 5 min x 10 | The highest value routine in the unit |
| Civ | **Trigger, options, choice.** Rewrite three weak log entries to include all three. | 15 min | Turns a diary into a justification |
| Civ | **Which drawing did this break?** Five changes, name the Biv page each invalidates. | 15 min | Keeps the production pack alive |
| Ciii | **Cold hands rehearsal**, internal, a week before the deadline. | 30 min | Finds interface failures while there is still time |
| Ciii | **User sheet swap.** Read a classmate's user sheet, list what you still could not do. | 20 min | One page is harder than three |

## Criterion D

| For | Formative | Time | What it fixes |
|---|---|---|---|
| Di | **Survey it or measure it?** Ten specs, sort into human method and bench method. | 15 min | The core Di expansion for this unit |
| Di | **Method matching.** Six specs, choose the right method for each and say why. | 20 min | The questionnaire-for-everything reflex |
| Di | **Write five bad questions.** Leading, double barrelled, vague. Then fix them. | 20 min | Instrument quality |
| Di | **Design the abuse test.** Given a device, list five ways a user could break it, pick two to test. | 15 min | Failure testing as a method |
| Di | **Observation sheet build.** Watch a 5 minute clip of someone using a gadget, tally using a sheet you designed. | 25 min | Observation generates data too |
| Dii | **Met, partly met, not met.** Given data and a spec, decide and defend. | 15 min | Students over-claim "met" |
| Dii | **Limits of the evidence.** Given a result from 3 trials, list four reasons to be cautious. | 15 min | Where "critically" lives |
| Diii | **Trace the improvement.** Given a Dii table, propose improvements and mark which have no evidence. | 20 min | Preference versus finding |
| Diii | **Fix or next version?** Sort ten improvements into the two columns. | 15 min | Realism about what is actually possible |
| Div | **Satisfaction versus impact sort.** 10 statements, sort into "they enjoyed it" and "it changed something". | 15 min | The core Div confusion |
| Div | **The whole life of a device.** For a familiar gadget, trace its power, its parts, and its end of life. | 20 min | Section 5 of the report |
| Div | **Unintended effects hunt.** For a familiar product, list three effects the designer did not intend. | 15 min | Section 4 of the report |
| Div | **Three minutes.** Storyboard and rehearse the impact video in pairs. | 20 min | Video quality, and brevity |

---

# Reusable class routines

- **Bench drill.** First 10 to 15 minutes of most A and B classes. The skills
  training, paid for out of time that would otherwise be settling in.
- **Log stop.** Last five minutes of every build class, Civ entry written in place.
- **Catalog callout.** Whenever a part comes up in discussion, name it and its
  category aloud. Builds the shared vocabulary at no time cost, and it is what makes
  the Aiii confidence guesses possible.
- **Spec check.** Open the Bi page at the start of every B and C class. Specs that
  are never reread do not get met.
- **Swap and read.** Any deliverable claiming to be readable by others gets read by
  others before submission. Applies to Bii, Biv, Ci and Ciii, and each swap is the
  evidence for its own strand.
- **Power down and photograph.** Last two minutes of every build class, one photo of
  the current state. Feeds Cii and Civ, and costs nothing.

---

# Decisions made

| Question | Decision |
|---|---|
| Grouping | Individual builds. Peer routines supply what the group build would have. |
| Scope | Catalog bounded. Anything in the parts catalog, nothing outside it without approval. |
| Client | Assigned demographic brief cards, curated by the teacher, as in G9. |
| Length | 36 classes: 33 assessed, 1 launch, 2 slack. |
| Skills training | Bench drills as class starters through A and B. No dedicated classes. |
| User documentation | 1 page user sheet maximum. |
| Fabrication kit | 3D printers and the small etcher are dependable. The large laser cutter is not and nothing may depend on it without a fallback. Print shop needs lead time and money. |
| Div logistics | Each student hands over to their own client group, in place, and leaves the device there between the two classes where possible. |
| Div medium | Three minute video plus a one page summary. |
| Core requirements | Senses, decides and acts; and leaves the bench. Both tested in Di and Dii. |

# Open questions

These need answers before the class by class breakdown.

1. **Stock.** Individual builds against a 49 part catalog means every student needs
   a board, and popular sensors will run out. How many ESP32 boards, displays and
   servos are actually in the room? The answer may force a "one per student" list
   and a "first come" list, and that distinction belongs on the catalog page itself.
2. **Soldering.** How much per student, with what supervision ratio, and is there a
   route for a student who cannot solder safely? Cii currently allows a build with no
   soldering at all, through the other three tracks. Confirm that is intended.
3. **Take home.** Do finished devices go home, and do the parts come back? The Div
   video exists partly because the answer is usually that they come back.
4. **Cost.** Who pays when a design needs a part the room does not have, and what is
   the ceiling?
5. **Prior knowledge.** How much code have these students written before? The bench
   drills assume close to none, which is safe but may be wasteful if they have done a
   coding unit.
6. **Assessment upload.** Where each strand is submitted, which the unit page has as
   a placeholder.

# Still to build

The teacher facing version of this plan goes on `curriculum/myp/g10-electronics-design.html`,
which is currently a skeleton of placeholders waiting on the task sheet. It needs
all 16 strands, the formatives, the bench drills and the class sequence, in the shape
`g9-game-design.html` already uses.

Tools worth stubbing on that page as planned features:

1. **Pin map builder** with a conflict checker and reserved pin warnings (Biv)
2. **Block diagram builder**, drag inputs and outputs from the catalog (Bii, Biv)
3. **Research budget planner** (Aii), the G9 tool reskinned
4. **Specification builder** with a missing unit warning (Bi)
5. **Build planner** with critical path and shared resource booking (Ci)
6. **Change log** with real timestamps and a "which drawing did this break" field (Civ)
7. **Passthrough checker**: paste your if-then-otherwise sentence, get told if the
   code decides anything (Bii)
8. **Student progress tracker** across 16 strands

The MacroPad Builder already covers part of tool 1 and tool 2 for input devices. The
cheapest route to both may be generalising it rather than starting again.

Next step after this document: the class by class breakdown, and the practice
materials themselves. The ones that need writing rather than generating in the
moment are the sort card sets, the weak brief, the rigged matrix, the challenge card
set, the bad question set, and the deliberate faults for bench drill 10.
