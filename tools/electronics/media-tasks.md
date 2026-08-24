# Photo task list

Generated from the `media` fields in `data.js`. A slot with a photo in it drops
off this list automatically. Until a slot is filled the page draws a labelled
placeholder saying what should go there, so the page is presentable at any stage.

To fill a slot, drop the file in `media/` and edit that part in `data.js`:

```js
image:  { src: "media/hcsr04.webp", alt: "What it shows", caption: "Optional" },
detail: { src: "media/hcsr04-detail.webp", alt: "What it shows", caption: "Optional" }
```

Shoot at 4:3 and at least 1600 by 1200. The card crops to 4:3 and fills the
frame, so leave a little space around the part rather than filling the shot
edge to edge.

| | count |
|---|---|
| Parts with a card photo | 18 of 48 |
| Card photos still needed | 30 |
| Extra shots requested | 4 |
| Close-ups still needed | 32 |
| **Total shots outstanding** | **66** |

Almost all of these are one part on a plain background under a desk lamp. A
phone on a small tripod and a sheet of white paper covers the whole list. Shoot
a whole category in one sitting, since the lighting setup does not change.

---

## 1. Microcontroller Boards (7 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | ESP32-S3 Super Mini | Close-up | `esp32-s3-supermini-detail.webp` | Straight down on the board with every pin label readable, the same framing as the full size S3 shot. |
| [ ] | ESP32-C3 Super Mini | Card photo | `esp32-c3-supermini.webp` | The board next to a coin for scale, top down, both pin rows readable. |
| [ ] | ESP32-C3 Super Mini | Close-up | `esp32-c3-supermini-detail.webp` | The underside, showing the antenna and the pin labels printed on the back. |
| [ ] | ESP32-C3 Dev Board | Card photo | `esp32-c3-devkit.webp` | Top down on a plain background, both pin rows and the two buttons visible. |
| [ ] | ESP32-C3 Dev Board | Close-up | `esp32-c3-devkit-detail.webp` | The board on a half size breadboard, showing how little free space is left beside it. |
| [ ] | Seeed XIAO SAMD21 | Card photo | `xiao-samd21.webp` | Top down beside a coin for scale, pad labels readable. |
| [ ] | Seeed XIAO SAMD21 | Close-up | `xiao-samd21-detail.webp` | Close on the edge pads with a wire soldered to one, showing what a direct solder joint looks like. |

## 2. Displays (8 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | SSD1306 OLED, 0.96 inch, I2C | Extra shot | `ssd1306-i2c-2.webp` | A second shot with the screen lit and showing text, so the size of the readable area is clear. |
| [ ] | SSD1306 OLED, 0.96 inch, I2C | Close-up | `ssd1306-i2c-detail.webp` | The back of the module, with the four pin labels and the address solder pads visible. |
| [ ] | SSD1306 OLED, 0.96 inch, SPI | Card photo | `ssd1306-spi.webp` | The seven pin module face on with the screen lit. |
| [ ] | SSD1306 OLED, 0.96 inch, SPI | Close-up | `ssd1306-spi-detail.webp` | Close on the pin header showing all seven labels in order, left to right. |
| [ ] | SH1106 OLED, 1.3 inch | Card photo | `sh1106.webp` | The 1.3 inch module beside the 0.96 inch one, both lit and showing the same text, so the size difference is obvious. |
| [ ] | SH1106 OLED, 1.3 inch | Close-up | `sh1106-detail.webp` | The driver chip marking on the back of the module, showing how to tell SH1106 from SSD1306. |
| [ ] | SSD1309 OLED, 1.54 inch | Card photo | `ssd1309.webp` | All three OLED sizes lined up, lit, showing the same text. |
| [ ] | SSD1309 OLED, 1.54 inch | Close-up | `ssd1309-detail.webp` | The solder pads on the back that select I2C or SPI, close enough to see which is bridged. |

## 3. Controls and Inputs (9 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | KY-040 Rotary Encoder | Card photo | `ky-040.webp` | The module with the knob fitted, at an angle so both the knob and the five pins show. |
| [ ] | KY-040 Rotary Encoder | Close-up | `ky-040-detail.webp` | Close on the module board showing the built-in pull-up resistors, so students learn to check for them. |
| [ ] | PS2 Analog Joystick | Close-up | `ps2-joystick-detail.webp` | The underside, with the two potentiometer bodies visible, showing that a joystick really is two pots. |
| [ ] | HW-371 Slide Potentiometer, 45mm | Extra shot | `hw-371-2.webp` | A second shot next to a ruler, so the 45mm travel can be compared with the 75mm slider. |
| [ ] | HW-371 Slide Potentiometer, 45mm | Close-up | `hw-371-detail.webp` | The pin end of the slider, labels visible, showing which pin is the wiper. |
| [ ] | B10K Slide Potentiometer, 75mm | Card photo | `slide-pot-75mm.webp` | Both sliders side by side with a ruler, so the travel difference is obvious. |
| [ ] | Rotary Potentiometer | Extra shot | `rotary-pot-2.webp` | A panel mount pot with a knob fitted, so the knob type and the trimmer type can be compared side by side. |
| [ ] | Toggle and Slide Switch | Card photo | `toggle-switch.webp` | A toggle switch, a slide switch and a rocker switch together, contacts visible. |
| [ ] | Toggle and Slide Switch | Close-up | `toggle-switch-detail.webp` | The three pins of an SPDT switch with the common pin marked on the photo. |

## 4. Sensors (12 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | Light Dependent Resistor | Card photo | `ldr.webp` | Several LDRs of different sizes on a plain background, squiggle face up. |
| [ ] | Light Dependent Resistor | Close-up | `ldr-detail.webp` | An LDR and a 10k resistor built as a divider on a breadboard, with the reading point marked. |
| [ ] | DHT11 Temperature and Humidity Sensor | Card photo | `dht11.webp` | The blue DHT11 module and a white DHT22 side by side, grilles facing the camera. |
| [ ] | DHT11 Temperature and Humidity Sensor | Close-up | `dht11-detail.webp` | The three pin module from behind, showing the pull-up resistor already fitted. |
| [ ] | Thermistor | Card photo | `thermistor.webp` | Several thermistors on a plain background, with one beside a 10k resistor so the pairing is visible. |
| [ ] | Thermistor | Close-up | `thermistor-detail.webp` | A thermistor and its 10k partner built as a divider on a breadboard, with the reading point marked. |
| [ ] | HC-SR04 Ultrasonic Distance Sensor | Close-up | `hc-sr04-detail.webp` | The ECHO voltage divider built on a breadboard, with the two resistor values readable. |
| [ ] | HC-SR501 Motion Sensor | Card photo | `pir-sensor.webp` | The sensor with its white dome, and a second one with the dome removed showing the sensor underneath. |
| [ ] | HC-SR501 Motion Sensor | Close-up | `pir-sensor-detail.webp` | The back of the module, both adjustment screws and the mode jumper labelled. |
| [ ] | Tilt and Vibration Switch | Card photo | `tilt-switch.webp` | A tilt switch and a vibration switch side by side, close enough to see the ball and the spring. |
| [ ] | Hall Effect Sensor | Card photo | `hall-sensor.webp` | A bare A3144 and a three pin module together, with a small magnet in shot. |
| [ ] | Hall Effect Sensor | Close-up | `hall-sensor-detail.webp` | Close on the flat face of the bare sensor, pins numbered on the photo. |

## 5. Outputs and Actuators (7 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | WS2812B Addressable LED | Card photo | `neopixel.webp` | A strip lit in several colours at once, plus a single loose WS2812B so the chip inside the LED is visible. |
| [ ] | WS2812B Addressable LED | Close-up | `neopixel-detail.webp` | Close on the strip's solder pads with the direction arrow visible. |
| [ ] | Enclosed Cavity Speaker | Close-up | `speaker-detail.webp` | The speaker connected through a small amplifier board to a microcontroller, with the three stages laid out left to right so the signal path is obvious. |
| [ ] | SG90 Micro Servo | Card photo | `sg90-servo.webp` | The servo with its bag of horns and screws laid out beside it. |
| [ ] | SG90 Micro Servo | Close-up | `sg90-servo-detail.webp` | The three wire connector with each colour labelled on the photo. |
| [ ] | Coin Vibration Motor | Card photo | `vibration-motor.webp` | A coin motor with its adhesive backing, next to a cylindrical vibration motor. |
| [ ] | Coin Vibration Motor | Close-up | `vibration-motor-detail.webp` | The transistor driver circuit built on a breadboard, with the transistor, resistor and diode all identifiable. |

## 6. Passive Components (5 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | Resistor | Close-up | `resistor-detail.webp` | One five band resistor filling the frame with each band numbered on the photo, since the classroom stock is five band and most charts are not. |
| [ ] | Capacitor | Extra shot | `capacitor-2.webp` | Ceramic disc capacitors beside the electrolytics, so the two kinds can be told apart at a glance. |
| [ ] | Diode | Card photo | `diode.webp` | A 1N4148 and a 1N4007 side by side, bands clearly visible. |
| [ ] | NPN Transistor | Card photo | `transistor.webp` | Several small signal transistors together with their part numbers readable, flat faces towards the camera. |
| [ ] | NPN Transistor | Close-up | `transistor-detail.webp` | One transistor with its three legs labelled base, collector and emitter on the photo, for that exact part number. |

## 7. Prototyping and Connection (8 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | Solderless Breadboard | Card photo | `breadboard.webp` | A full size and a half size breadboard side by side, top down, rails and centre channel clear. |
| [ ] | Solderless Breadboard | Close-up | `breadboard-detail.webp` | A breadboard with the backing peeled off, showing the metal clips underneath and how the rows are joined. |
| [ ] | Jumper Wires | Close-up | `jumper-wires-detail.webp` | All three types side by side, male to male next to male to female next to female to female, close enough to tell the ends apart. |
| [ ] | Header Pins and Sockets | Card photo | `header-pins.webp` | A long male strip, a long female strip, and a short snapped piece of each, together. |
| [ ] | Header Pins and Sockets | Close-up | `header-pins-detail.webp` | A board being soldered with a breadboard used as a jig to hold the header square. |
| [ ] | Perfboard and Stripboard | Close-up | `perfboard-detail.webp` | The underside of a finished student build on stripboard, with a track cut visible. |
| [ ] | USB-C Cable | Card photo | `usb-c-cable.webp` | Several USB-C cables together, with the known data ones marked, showing they look identical. |
| [ ] | Crocodile Clip Leads | Card photo | `crocodile-clips.webp` | A set of croc leads in several colours, one pair clipped to a battery holder. |

## 8. Power (5 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | USB Power Supply and Power Bank | Card photo | `power-supply.webp` | A wall adapter and a small power bank together, ratings readable. |
| [ ] | Breadboard Power Supply Module | Close-up | `power-module-detail.webp` | Close on one yellow jumper with the 3.3V, OFF and 5V silkscreen positions readable, so the setting can be checked at a glance. |
| [ ] | AA and AAA Battery Holder | Card photo | `battery-holder.webp` | Holders for two, three and four cells together, wires visible. |
| [ ] | TP4056 LiPo Charger Module | Card photo | `lipo-charger.webp` | A protected and an unprotected TP4056 board side by side, close enough to spot the extra chip. |
| [ ] | TP4056 LiPo Charger Module | Close-up | `lipo-charger-detail.webp` | The protection chip and transistors circled on the photo, so the difference is unmistakable. |

## 9. Workshop Tools (5 shots)

| Done | Part | Shot | Suggested filename | What it needs to show |
|---|---|---|---|---|
| [ ] | Digital Multimeter | Card photo | `multimeter.webp` | The classroom meter with its dial visible, probes in the correct sockets. |
| [ ] | Digital Multimeter | Close-up | `multimeter-detail.webp` | The dial with the continuity and DC voltage positions marked on the photo. |
| [ ] | Soldering Iron | Card photo | `soldering-iron.webp` | The classroom iron in its stand with solder and brass wool beside it. |
| [ ] | Soldering Iron | Close-up | `soldering-iron-detail.webp` | A good joint and a cold joint side by side under magnification, both labelled. |
| [ ] | Wire Strippers and Side Cutters | Card photo | `wire-strippers.webp` | Strippers and flush cutters together, the gauge markings on the strippers readable. |

---

## Already shot

Card photo wired up, and a close-up too where one is listed.

| Part | Card photo | Close-up |
|---|---|---|
| ESP32-S3 N16R8 | `s3n16r8.webp` | `S3detail.webp` |
| ESP32-S3 Super Mini | `esps3mini.webp` |  |
| SSD1306 OLED, 0.96 inch, I2C | `ssd1306oledI2C.webp` |  |
| Tactile Push Button | `tactilebutton.webp` | `tactilebuttondetail.webp` |
| HW-040 Rotary Encoder | `hw040encoder.webp` | `hw040detail.webp` |
| PS2 Analog Joystick | `ps2joystick.webp` |  |
| HW-371 Slide Potentiometer, 45mm | `Hw371slide.webp` |  |
| Rotary Potentiometer | `rotarypotentiometer.webp` | `rotarypotentiometerdetail.webp` |
| HC-SR04 Ultrasonic Distance Sensor | `hcsr04.webp` |  |
| INMP441 I2S Microphone | `i2cmicrophone.webp` | `i2cmicrophonedetail.webp` |
| LED | `leds.webp` | `leddetail.webp` |
| Piezo Buzzer | `piezobuzzer.webp` | `piezodetail.webp` |
| Enclosed Cavity Speaker | `speaker.webp` |  |
| Resistor | `resistors.webp` |  |
| Capacitor | `capacitor.webp` | `capacitordetail.webp` |
| Jumper Wires | `jumperwires.webp` |  |
| Perfboard and Stripboard | `perfboard.webp` |  |
| Breadboard Power Supply Module | `power.webp` |  |

---

## Shots that need more than a desk lamp

A few of these are worth flagging because they are not simply a part on paper.

- **Breadboard close-up.** Needs a board with the adhesive backing peeled off so the metal clips underneath are visible. Sacrifice one dead breadboard for this. It explains more than any diagram would.
- **Soldering close-up.** A good joint and a cold joint side by side, under magnification. Worth doing properly once, since students will be sent back to it all year.
- **TP4056 protected versus unprotected.** The difference is one small chip. Shoot both boards at the same angle and distance so they can be compared directly.
- **Five band resistor.** Sharp focus and neutral light, each band numbered on the photo. The classroom stock is five band and most charts online are four band, which is exactly the confusion the photo has to settle.
- **HC-SR04 voltage divider.** A working breadboard build with both resistor values readable. Half a lesson of trouble every year comes from this one connection.
- **Transistor pinout.** Must be shot for the exact part number in the drawer, not a generic transistor, because the leg order changes between part numbers.
- **Speaker signal path.** Microcontroller, amplifier board and speaker laid out left to right, since the amplifier in the middle is the part students leave out.

## Sourcing rather than shooting

Nothing on this list needs to be sourced online. Every part is either in the
room already or is cheap enough to buy one of for the photo. Keeping every
image self-shot also keeps the page free of licensing questions and free of
external requests.
