## Introduction:

Use the following entries to plan and build interactive elements on pages. These range from super simple diagrams with hover elements to more elaborate activities and 'games'. The 5 below are a start, I'll write more as I think of them. 

A1.1.2: several normal curves/distributions. A few examples where we can see the distribution of human height, foot size, and another notable figure would be great. Interactive elements would involve letting a person choose 'Global', 'North America', 'Europe', 'China', to see how the curve changes; toggling 5th-95th, and adding your own numbers to the curve and getting feedback on the input. (Specific percentile)

  - **Build notes.** Its own widget in 1.1.2, separate from the 1.1.3 percentile calculator. Inline SVG in `a1.1.js`, wrapped in `.diagram-widget` so presentation mode picks it up. Men and women are drawn as two overlaid curves, which shows the mixed-population point from 1.1.3 without extra text. Controls: measure (height, foot length, hand length), region (Global, North America, Europe, China), a 5th to 95th band toggle, and a "your measurement" input that places a marker and reports the percentile using the normal cumulative distribution.
  - **Data.** Mean and SD per region, sex and measure are approximate and labelled as such on the widget. Height means are rounded to published national averages (NCD-RisC), SDs are typical values, and foot and hand lengths are scaled from stature using ANSUR II proportions. **Sourcing task:** replace the `DATA` table at the curve widget in `a1.1.js` with cited mean and SD per cell.

A1.1.2: A simple demo showing static data vs dynamic. Ideally users can input some data for their sample person and have a (nicer) stick figure person made with shapes that match the input- then let us click through collecting the data- static is easy enough, but ideally we get different results for dynamic depending on the height/weight/other input. 

  - **Build notes.** Inline SVG figure built from rounded shapes, in `a1.1.js`. Inputs: height, weight, age group and shoulder mobility. Height scales the figure, weight changes its width. Two buttons: "Collect static data" draws measurement lines for stature, shoulder breadth and arm length; "Collect dynamic data" snaps the figure into a reaching pose with the arm raised as far as its shoulder range allows, and reports shoulder range and overhead reach. Once collected, each data set stays in the readout, so changing the age afterwards shows the static figures holding still while the dynamic ones move. Static readings depend only on body size. Dynamic readings also depend on age and mobility, so two figures of the same height give different dynamic results. No animation between poses, it snaps.

B1.1.4: A Poka yoke demo, letting us drag AA batteries into 'error proofed' slots vs. ambiguous ones. (Remote turns on, and doesn't in the ambiguous slots- we get a pop-up explainer.) This resets on page refresh. 

  - **Build notes.** Custom SVG in `b1.1.js` (drag-sort does not fit). Tap a battery, then tap a slot, matching the site's tap-to-place rule. No flipping. Two AA cells in the tray point the same way, as they come out of the pack, while the two slots in the remote run in opposite directions, so one cell always goes in backwards. Stage 1: a compartment with a spring plate at both ends accepts both cells, the remote stays dead, and an explainer shows the reversed cell. Stage 2: the error-proofed compartment has a recessed positive contact between plastic ribs (the notch), so the reversed cell bounces back out. A close-up then shows why: the positive button reaches the contact through the notch, the flat negative end cannot. The cell is turned round for the user, the remote lights up, and a closing panel links it to the Errors objective. Nothing is stored, so a refresh resets it.

A3.3.1: A set of vector animations to demonstrate the types of motion would be brilliant. No real interactive element, just a visual in motion. 

  - **Build notes.** Four tiles of inline SVG, animated with CSS keyframes and no JavaScript. Each tile shows its example from the page text (drawer, wheel, pendulum, piston) with the path drawn faintly behind the moving part: a straight line, a circle, an arc, and a straight line with arrowheads at both ends. The path is what separates oscillating from reciprocating. With reduced motion turned on, the parts are frozen mid-travel and the paths still show.

A2.1.3: A matching activity for a fictional product team where we drag the contributor/role to their input. IE Human Factors Engineer to something the HFE did. 

  - **Build notes.** `DragSort.init` in `a2.1.js`, the same pattern as "Match the Method" on 2.1.4. Fictional product: a smart pill dispenser for older adults living at home. One contribution per role from the page's list of ten, each with an explanation.


## Status (2026-09-30)

All five are built and checked in the browser at desktop and phone widths:

- A1.1.2 curve explorer and static/dynamic figure: `a1.1-ergonomics.html`, `a1.1.js`
- A2.1.3 pill dispenser team matching: `a2.1-user-centred-research.html`, `a2.1.js`
- A3.3.1 motion animations: `a3.3-mechanical-systems.html` (CSS only)
- B1.1.4 poka-yoke remote: `b1.1-user-centred-design.html`, `b1.1.js`

Styles for all of them are at the end of `curriculum.css`.
