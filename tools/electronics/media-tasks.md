# Photo task list

Generated from the `media` fields in `data.js`. Every part has a card photo
slot, and most have a second slot for a wiring close-up. Until a slot is filled
the page draws a labelled placeholder saying what should go there, so the page
is complete and presentable with none of these done.

To fill a slot, drop the file in `media/` and edit that part in `data.js`:

```js
image:  { src: "media/resistor.jpg",        alt: "A row of resistors", caption: "Optional" },
detail: { src: "media/resistor-detail.jpg", alt: "Colour bands labelled", caption: "Optional" }
```

The filenames below are only a suggestion. Nothing reads them automatically,
so use whatever you like as long as `data.js` matches.

| | count |
|---|---|
| Card photos | 43 |
| Wiring close-ups | 33 |
| **Total shots** | **76** |

Almost all of these are one part on a plain background under a desk lamp. A
phone on a small tripod and a sheet of white paper covers the whole list. Shoot
a whole category in one sitting, since the lighting setup does not change.

---

## 1. Microcontroller Boards (8 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | ESP32-S3 N16R8 | Card photo | `esp32-s3.jpg` | The board on a plain background, top down, USB socket at the bottom, both pin rows readable. |
| [ ] | ESP32-S3 N16R8 | Close-up | `esp32-s3-detail.jpg` | The board seated in a breadboard across the centre channel, with power and ground jumpers already run. |
| [ ] | ESP32-C3 Super Mini | Card photo | `esp32-c3-supermini.jpg` | The board next to a coin for scale, top down, both pin rows readable. |
| [ ] | ESP32-C3 Super Mini | Close-up | `esp32-c3-supermini-detail.jpg` | The underside, showing the antenna and the pin labels printed on the back. |
| [ ] | ESP32-C3 Dev Board | Card photo | `esp32-c3-devkit.jpg` | Top down on a plain background, both pin rows and the two buttons visible. |
| [ ] | ESP32-C3 Dev Board | Close-up | `esp32-c3-devkit-detail.jpg` | The board on a half size breadboard, showing how little free space is left beside it. |
| [ ] | Seeed XIAO SAMD21 | Card photo | `xiao-samd21.jpg` | Top down beside a coin for scale, pad labels readable. |
| [ ] | Seeed XIAO SAMD21 | Close-up | `xiao-samd21-detail.jpg` | Close on the edge pads with a wire soldered to one, showing what a direct solder joint looks like. |

## 2. Displays (8 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | SSD1306 OLED, 0.96 inch, I2C | Card photo | `ssd1306-i2c.jpg` | The module face on, screen lit and showing text, so the size of the readable area is clear. |
| [ ] | SSD1306 OLED, 0.96 inch, I2C | Close-up | `ssd1306-i2c-detail.jpg` | The back of the module, with the four pin labels and the address solder pads visible. |
| [ ] | SSD1306 OLED, 0.96 inch, SPI | Card photo | `ssd1306-spi.jpg` | The seven pin module face on with the screen lit. |
| [ ] | SSD1306 OLED, 0.96 inch, SPI | Close-up | `ssd1306-spi-detail.jpg` | Close on the pin header showing all seven labels in order, left to right. |
| [ ] | SH1106 OLED, 1.3 inch | Card photo | `sh1106.jpg` | The 1.3 inch module beside the 0.96 inch one, both lit and showing the same text, so the size difference is obvious. |
| [ ] | SH1106 OLED, 1.3 inch | Close-up | `sh1106-detail.jpg` | The driver chip marking on the back of the module, showing how to tell SH1106 from SSD1306. |
| [ ] | SSD1309 OLED, 1.54 inch | Card photo | `ssd1309.jpg` | All three OLED sizes lined up, lit, showing the same text. |
| [ ] | SSD1309 OLED, 1.54 inch | Close-up | `ssd1309-detail.jpg` | The solder pads on the back that select I2C or SPI, close enough to see which is bridged. |

## 3. Controls and Inputs (14 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | Tactile Push Button | Card photo | `push-button.jpg` | Several buttons of different sizes side by side, legs visible, with one turned over. |
| [ ] | Tactile Push Button | Close-up | `push-button-detail.jpg` | A four legged button on a breadboard with the two internally joined pairs marked on the photo. |
| [ ] | KY-040 Rotary Encoder | Card photo | `ky-040.jpg` | The module with the knob fitted, at an angle so both the knob and the five pins show. |
| [ ] | KY-040 Rotary Encoder | Close-up | `ky-040-detail.jpg` | Close on the module board showing the built-in pull-up resistors, so students learn to check for them. |
| [ ] | HW-040 Rotary Encoder | Card photo | `hw-040.jpg` | HW-040 and KY-040 side by side, pin headers facing the camera, so the differences are visible. |
| [ ] | HW-040 Rotary Encoder | Close-up | `hw-040-detail.jpg` | Close on the silkscreen pin labels of the HW-040. |
| [ ] | PS2 Analog Joystick | Card photo | `ps2-joystick.jpg` | The module at an angle showing the stick and the five pins. |
| [ ] | PS2 Analog Joystick | Close-up | `ps2-joystick-detail.jpg` | The underside, with the two potentiometer bodies visible, showing that a joystick really is two pots. |
| [ ] | HW-371 Slide Potentiometer, 45mm | Card photo | `hw-371.jpg` | The slider from above with the knob fitted, next to a ruler so the 45mm travel is clear. |
| [ ] | HW-371 Slide Potentiometer, 45mm | Close-up | `hw-371-detail.jpg` | The pin end of the slider, labels visible, showing which pin is the wiper. |
| [ ] | B10K Slide Potentiometer, 75mm | Card photo | `slide-pot-75mm.jpg` | Both sliders side by side with a ruler, so the travel difference is obvious. |
| [ ] | Rotary Potentiometer | Card photo | `rotary-pot.jpg` | A panel mount pot with a knob, a bare pot, and a small blue trim pot, all in one shot. |
| [ ] | Toggle and Slide Switch | Card photo | `toggle-switch.jpg` | A toggle switch, a slide switch and a rocker switch together, contacts visible. |
| [ ] | Toggle and Slide Switch | Close-up | `toggle-switch-detail.jpg` | The three pins of an SPDT switch with the common pin marked on the photo. |

## 4. Sensors (11 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | Light Dependent Resistor | Card photo | `ldr.jpg` | Several LDRs of different sizes on a plain background, squiggle face up. |
| [ ] | Light Dependent Resistor | Close-up | `ldr-detail.jpg` | An LDR and a 10k resistor built as a divider on a breadboard, with the reading point marked. |
| [ ] | DHT11 Temperature and Humidity Sensor | Card photo | `dht11.jpg` | The blue DHT11 module and a white DHT22 side by side, grilles facing the camera. |
| [ ] | DHT11 Temperature and Humidity Sensor | Close-up | `dht11-detail.jpg` | The three pin module from behind, showing the pull-up resistor already fitted. |
| [ ] | HC-SR04 Ultrasonic Distance Sensor | Card photo | `hc-sr04.jpg` | The sensor face on, both transducers and the four pins visible. |
| [ ] | HC-SR04 Ultrasonic Distance Sensor | Close-up | `hc-sr04-detail.jpg` | The ECHO voltage divider built on a breadboard, with the two resistor values readable. |
| [ ] | HC-SR501 Motion Sensor | Card photo | `pir-sensor.jpg` | The sensor with its white dome, and a second one with the dome removed showing the sensor underneath. |
| [ ] | HC-SR501 Motion Sensor | Close-up | `pir-sensor-detail.jpg` | The back of the module, both adjustment screws and the mode jumper labelled. |
| [ ] | Tilt and Vibration Switch | Card photo | `tilt-switch.jpg` | A tilt switch and a vibration switch side by side, close enough to see the ball and the spring. |
| [ ] | Hall Effect Sensor | Card photo | `hall-sensor.jpg` | A bare A3144 and a three pin module together, with a small magnet in shot. |
| [ ] | Hall Effect Sensor | Close-up | `hall-sensor-detail.jpg` | Close on the flat face of the bare sensor, pins numbered on the photo. |

## 5. Outputs and Actuators (9 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | LED | Card photo | `led.jpg` | Several LED colours and sizes together, legs uncut, so the long and short legs are visible. |
| [ ] | LED | Close-up | `led-detail.jpg` | Close on the rim of an LED showing the flat spot beside the cathode. |
| [ ] | WS2812B Addressable LED | Card photo | `neopixel.jpg` | A strip lit in several colours at once, plus a single loose WS2812B so the chip inside the LED is visible. |
| [ ] | WS2812B Addressable LED | Close-up | `neopixel-detail.jpg` | Close on the strip's solder pads with the direction arrow visible. |
| [ ] | Piezo Buzzer | Card photo | `piezo-buzzer.jpg` | A sealed buzzer, a bare piezo disc and an active module together. |
| [ ] | SG90 Micro Servo | Card photo | `sg90-servo.jpg` | The servo with its bag of horns and screws laid out beside it. |
| [ ] | SG90 Micro Servo | Close-up | `sg90-servo-detail.jpg` | The three wire connector with each colour labelled on the photo. |
| [ ] | Coin Vibration Motor | Card photo | `vibration-motor.jpg` | A coin motor with its adhesive backing, next to a cylindrical vibration motor. |
| [ ] | Coin Vibration Motor | Close-up | `vibration-motor-detail.jpg` | The transistor driver circuit built on a breadboard, with the transistor, resistor and diode all identifiable. |

## 6. Passive Components (7 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | Resistor | Card photo | `resistor.jpg` | A row of resistors of common values on white paper, bands sharp and readable. |
| [ ] | Resistor | Close-up | `resistor-detail.jpg` | A single resistor filling the frame, each band labelled with its number on the photo. |
| [ ] | Capacitor | Card photo | `capacitor.jpg` | Ceramic discs and electrolytic cylinders of several sizes together, markings readable. |
| [ ] | Capacitor | Close-up | `capacitor-detail.jpg` | An electrolytic capacitor with the negative stripe and the short leg both clearly visible. |
| [ ] | Diode | Card photo | `diode.jpg` | A 1N4148 and a 1N4007 side by side, bands clearly visible. |
| [ ] | NPN Transistor | Card photo | `transistor.jpg` | Several small signal transistors together with their part numbers readable, flat faces towards the camera. |
| [ ] | NPN Transistor | Close-up | `transistor-detail.jpg` | One transistor with its three legs labelled base, collector and emitter on the photo, for that exact part number. |

## 7. Prototyping and Connection (10 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | Solderless Breadboard | Card photo | `breadboard.jpg` | A full size and a half size breadboard side by side, top down, rails and centre channel clear. |
| [ ] | Solderless Breadboard | Close-up | `breadboard-detail.jpg` | A breadboard with the backing peeled off, showing the metal clips underneath and how the rows are joined. |
| [ ] | Jumper Wires | Card photo | `jumper-wires.jpg` | All three types fanned out together with their ends visible, labelled male to male, male to female, female to female. |
| [ ] | Jumper Wires | Close-up | `jumper-wires-detail.jpg` | Close on a male and a female end together, showing how they mate. |
| [ ] | Header Pins and Sockets | Card photo | `header-pins.jpg` | A long male strip, a long female strip, and a short snapped piece of each, together. |
| [ ] | Header Pins and Sockets | Close-up | `header-pins-detail.jpg` | A board being soldered with a breadboard used as a jig to hold the header square. |
| [ ] | Perfboard and Stripboard | Card photo | `perfboard.jpg` | Plain perfboard and stripboard side by side, both sides shown, so the copper difference is clear. |
| [ ] | Perfboard and Stripboard | Close-up | `perfboard-detail.jpg` | The underside of a finished student build on stripboard, with a track cut visible. |
| [ ] | USB-C Cable | Card photo | `usb-c-cable.jpg` | Several USB-C cables together, with the known data ones marked, showing they look identical. |
| [ ] | Crocodile Clip Leads | Card photo | `crocodile-clips.jpg` | A set of croc leads in several colours, one pair clipped to a battery holder. |

## 8. Power (4 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | USB Power Supply and Power Bank | Card photo | `power-supply.jpg` | A wall adapter and a small power bank together, ratings readable. |
| [ ] | AA and AAA Battery Holder | Card photo | `battery-holder.jpg` | Holders for two, three and four cells together, wires visible. |
| [ ] | TP4056 LiPo Charger Module | Card photo | `lipo-charger.jpg` | A protected and an unprotected TP4056 board side by side, close enough to spot the extra chip. |
| [ ] | TP4056 LiPo Charger Module | Close-up | `lipo-charger-detail.jpg` | The protection chip and transistors circled on the photo, so the difference is unmistakable. |

## 9. Workshop Tools (5 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | Digital Multimeter | Card photo | `multimeter.jpg` | The classroom meter with its dial visible, probes in the correct sockets. |
| [ ] | Digital Multimeter | Close-up | `multimeter-detail.jpg` | The dial with the continuity and DC voltage positions marked on the photo. |
| [ ] | Soldering Iron | Card photo | `soldering-iron.jpg` | The classroom iron in its stand with solder and brass wool beside it. |
| [ ] | Soldering Iron | Close-up | `soldering-iron-detail.jpg` | A good joint and a cold joint side by side under magnification, both labelled. |
| [ ] | Wire Strippers and Side Cutters | Card photo | `wire-strippers.jpg` | Strippers and flush cutters together, the gauge markings on the strippers readable. |

---

## Shots that need more than a desk lamp

A few of these are worth flagging because they are not simply a part on paper.

- **Breadboard close-up.** Needs a board with the adhesive backing peeled off so the metal clips underneath are visible. Sacrifice one dead breadboard for this. It explains more than any diagram would.
- **Soldering close-up.** A good joint and a cold joint side by side, under magnification. Worth doing properly once, since students will be sent back to it all year.
- **TP4056 protected versus unprotected.** The difference is one small chip. Shoot both boards at the same angle and same distance so they can be compared directly.
- **Resistor colour bands.** Needs sharp focus and neutral light. Warm classroom lighting makes brown and red look identical, which is exactly the problem the photo is meant to solve.
- **HC-SR04 voltage divider.** A working breadboard build with both resistor values readable. Half a lesson of trouble every year comes from this one connection.
- **Transistor pinout.** Must be shot for the exact part number in the drawer, not a generic transistor, because the leg order changes between part numbers.

## Sourcing rather than shooting

Nothing on this list needs to be sourced online. Every part is either in the
room already or is cheap enough to buy one of for the photo. Keeping every
image self-shot also keeps the page free of licensing questions and free of
external requests.
