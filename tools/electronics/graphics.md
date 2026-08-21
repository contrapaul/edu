# Proposed diagrams and graphics

Nothing in this list is built. Version 1 is deliberately photograph only, as
agreed. This is the list of places where a drawing would teach something a
photograph cannot, ranked so the top of the list can be built first and the
bottom can be ignored without loss.

A photograph shows what a part looks like. A diagram shows what is happening
inside it, or where the current goes. Every item below is on this list because
a photo of the part genuinely fails to answer the question students ask.

If these get built, they should be inline SVG in a `diagrams.js`, keyed by name
and named from a part's data, the same way `tools/mechanics/diagrams.js` works.
That keeps them theme aware, keeps the page free of external requests, and lets
each one pick up its category colour.

---

## Tier 1: the ones that would change how a lesson goes

These six answer questions that come up in every single class, and where the
answer is currently a teacher drawing on a whiteboard.

| # | Diagram | Where it goes | What it has to show |
|---|---|---|---|
| 1 | **Breadboard connection map** | `breadboard` | The board seen from above with the hidden connections drawn on: rows of five joined, the centre channel splitting them, the rails running the length, and the break in the middle of the rails. This is the single highest value drawing on the list. |
| 2 | **Pull-up resistor, floating versus held** | `push-button` | Three states side by side: a floating pin reading nonsense, a pin held high by a pull-up, and the same pin pulled to ground by a pressed button. Explains in one picture what takes three paragraphs. |
| 3 | **Voltage divider** | `resistor`, `ldr`, `hc-sr04` | Two resistors in a line with the reading point marked, and the same drawing repeated with an LDR in the top position. One shape, three uses, so it should be one diagram parameterised rather than three drawings. |
| 4 | **The complete LED circuit** | `led` | Pin, resistor, LED, ground, drawn as a loop so the idea of a circuit as a loop is visible. Also worth showing that the resistor works on either side of the LED. |
| 5 | **Transistor as a switch** | `transistor`, `vibration-motor` | Small current in at the base, large current through collector to emitter, with the load on the collector side. Should make clear that the GPIO pin never carries the load current. |
| 6 | **Board pinout, one per board** | all four in `boards` | The physical board shape with every pin labelled and colour coded by what it can do: power, ground, analog capable, I2C, SPI, avoid. Four drawings, and the most work on this list, but they replace hunting for a pinout image online. |

## Tier 2: worth building once tier 1 is done

| # | Diagram | Where it goes | What it has to show |
|---|---|---|---|
| 7 | **I2C bus with several devices** | `ssd1306-i2c` | Two wires reaching three modules, each with its own address, showing why adding a device costs no extra pins and why two devices at one address collide. |
| 8 | **I2C versus SPI, pins used** | `ssd1306-spi` | Two pin count bars side by side. Makes the tradeoff a number rather than a claim. |
| 9 | **Encoder pulse timing** | `ky-040` | CLK and DT square waves offset from each other, drawn twice, once for each direction, with the difference marked. This is the only honest way to explain how direction is worked out. |
| 10 | **Servo pulse width to angle** | `sg90-servo` | Three pulses of 1ms, 1.5ms and 2ms, with the horn drawn at the matching angle beside each. |
| 11 | **Ultrasonic echo timing** | `hc-sr04` | The trigger pulse, the burst travelling out and back, and the echo pin held high for the round trip, with the halving step marked. |
| 12 | **Potentiometer versus encoder** | `rotary-pot` | Two knobs side by side, one with end stops and a position, one without and only a direction. Students confuse these constantly and a picture settles it faster than words. |

## Tier 3: nice, not necessary

| # | Diagram | Where it goes | What it has to show |
|---|---|---|---|
| 13 | **Flyback diode doing its job** | `diode` | The motor's collapsing field and the loop the spike takes through the diode instead of through the board. |
| 14 | **Resistor colour code reader** | `resistor` | An interactive strip where picking band colours gives the value. Genuinely useful, and the only item here that would be a small widget rather than a picture. |
| 15 | **NeoPixel data passing down the chain** | `neopixel` | The stream entering the first LED, one colour being taken, and the rest passing on. Explains the direction arrows better than a photo of them. |
| 16 | **Power path, wall to chip** | `power-supply`, `lipo-charger` | 5V in, regulator, 3.3V rail, and where each part in a typical build hangs off it. Ties the whole power category together. |
| 17 | **Signal type legend** | page header or unit page | One strip explaining digital in, analog in, PWM, I2C and SPI, so the filter chips mean something before a student has opened anything. |

## Graphics that are not diagrams

Two other things would help and are not drawings of circuits.

- **A category key card**, printable, matching the nine category colours on the page, to pin above the parts drawers so the physical shelf and the website use the same colour language. Low effort, and it makes the site's organisation visible in the room.
- **A one page pin budget worksheet** for the ESP32-S3 and the C3 Super Mini, listing every pin with a blank beside it. Students fill it in before wiring. This solves the running out of pins problem better than anything on screen, and it belongs on the unit page rather than here.

## What deliberately does not need a diagram

Listed so nobody builds them later thinking they were missed. A photograph
already does the job for: every enclosure and body shape, jumper wire types,
header strips, croc clips, battery holders, the multimeter dial, the soldering
iron, wire strippers, and the difference between the three OLED sizes.
