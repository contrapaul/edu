/* ═══════════════════════════════════════════════════════════════════
   ELECTRONICS PARTS CATALOG: the content.
   Everything a student can pick up in the room, plus what it needs to
   work. Edit this file to add or change a part. Nothing here depends on
   the rest of the site.

   Version 1 covers the parts referenced in tools/macropad/, plus the
   accessories needed to actually build with them. See plan.md.
   ═══════════════════════════════════════════════════════════════════ */

const CATEGORIES = {
  boards:   { name: "Microcontroller Boards",   short: "Boards",      color: "#5aa9ff" },
  displays: { name: "Displays",                 short: "Displays",    color: "#4fd6c9" },
  controls: { name: "Controls and Inputs",      short: "Controls",    color: "#ffb454" },
  sensors:  { name: "Sensors",                  short: "Sensors",     color: "#b98cff" },
  outputs:  { name: "Outputs and Actuators",    short: "Outputs",     color: "#ff6b8a" },
  passives: { name: "Passive Components",       short: "Passives",    color: "#ffe536" },
  proto:    { name: "Prototyping and Connection", short: "Prototyping", color: "#9aa8c2" },
  power:    { name: "Power",                    short: "Power",       color: "#6ee36e" },
  tools:    { name: "Workshop Tools",           short: "Tools",       color: "#ff9ad5" }
};

const FILTERS = {
  signal: ["Digital in", "Analog in", "Digital out", "PWM", "I2C", "I2S", "SPI", "Power", "No signal"],
  difficulty: ["Easy", "Moderate", "Tricky"]
};

const PARTS = [

/* ═══ MICROCONTROLLER BOARDS ═══════════════════════════════════════ */

{
  slug: "esp32-s3",
  name: "ESP32-S3 N16R8",
  shortName: "ESP32-S3",
  category: "boards",
  alsoCalled: ["ESP32-S3 DevKitC", "S3 dev board"],
  blurb: "The main board for the macropad. Plenty of pins, USB keyboard support.",
  signal: ["Digital in", "Digital out", "Analog in", "PWM", "I2C", "SPI", "Power"],
  difficulty: "Moderate",
  voltage: "3.3V logic, 5V in over USB",
  whatItIs: [
    "A small computer on a board. It runs your code over and over, reads the pins you have wired things to, and drives the pins you have wired outputs to.",
    "The N16R8 label means 16 megabytes of program storage and 8 megabytes of extra memory. That is a lot for a class project, so you will not run out of room.",
    "The S3 can pretend to be a USB keyboard or mouse when plugged into a computer. That is what makes the macropad project possible. Not every microcontroller can do this."
  ],
  pins: [
    { name: "3V3", type: "Power out", note: "3.3 volts out. This is what most sensors and modules run on. There are two of these pins." },
    { name: "5VIN", type: "Power", note: "5 volts, passed through from the USB socket. Use it only for parts that need 5V." },
    { name: "GND", type: "Ground", note: "Ground, the return path for every circuit. Several GND pins, all the same. Every part you add needs one." },
    { name: "GPIO4 to GPIO7", type: "Analog in", note: "General pins that can also read a voltage as a number. Use these for potentiometers and joysticks." },
    { name: "GPIO8", type: "I2C", note: "Default SDA, the data line for I2C displays and sensors." },
    { name: "GPIO9", type: "I2C", note: "Default SCL, the clock line for I2C." },
    { name: "GPIO11 to GPIO14", type: "SPI", note: "Default SPI pins: MOSI, SCK, MISO, CS. Faster than I2C, uses more pins." },
    { name: "GPIO0, GPIO46, RST", type: "Avoid", note: "These control how the board starts up. Wiring things to them causes boot failures. Leave them alone." }
  ],
  wiring: [
    "Plug the board into the breadboard so the two rows of pins straddle the centre channel. If you push it in on one side only, half the pins short together.",
    "Run a jumper from a 3V3 pin to the red power rail, and one from a GND pin to the blue ground rail. Do this once and every part afterwards is two short wires.",
    "Connect the board to your computer with a USB-C cable that carries data. A charge-only cable powers the board but the computer will never see it.",
    "Check the board is alive before wiring anything else. A power LED should light. If it does not, stop and fix that first."
  ],
  goesWith: ["breadboard", "usb-c-cable", "jumper-wires", "ssd1306-i2c", "push-button"],
  watchOut: [
    "Logic is 3.3 volts. Feeding 5 volts into a GPIO pin can kill the pin, and sometimes the board.",
    "GPIO0 and GPIO46 are strapping pins. If something is pulling them the wrong way at power-up, the board will not boot and it looks like the board is dead.",
    "The two 3V3 pins can only supply so much current. A long strip of addressable LEDs needs its own 5V supply, not the board.",
    "Pin numbers printed on cheap clone boards are sometimes wrong. Test one pin with an LED before you plan a whole layout around the silkscreen."
  ],
  useItFor: "Any project where the product has to talk to a computer as a keyboard, a mouse, or a serial device. Start here unless you have a reason not to.",
  links: [
    { label: "Espressif ESP32-S3 datasheet", url: "https://www.espressif.com/en/products/socs/esp32-s3", kind: "Datasheet", vpn: false },
    { label: "MacroPad Builder, wire this board in the browser", url: "/tools/macropad/", kind: "Tool", vpn: false }
  ],
  media: {
    image: {
      src: "media/s3n16r8.webp",
      alt: "An ESP32-S3 N16R8 board seen from above on a white background, with two USB-C sockets on one edge, a silver radio shield marked S3-N16R8, and a GPIO number printed beside every pin hole.",
      caption: "The GPIO number is printed beside every hole, which is the quickest way to check a pin. This one came with its header pins loose in the bag, so they need soldering on before it will sit in a breadboard."
    },
    imageNeed: "Done.",
    detail: {
      src: "media/S3detail.webp",
      alt: "The same ESP32-S3 board straight on and filling the frame, with both rows of pin labels readable, the RST and BOOT buttons, the regulator and the RGB LED all visible.",
      caption: "Every pin label reads clearly here. The bottom row runs 3V3, 3V3, RST, then 4, 5, 6, 7, 15, 16, 17, 18, 8, 3, 46, 9, 10, 11, 12, 13, 14, 5Vin, GND. The small chip beside the sockets is the USB to serial converter, which is why one socket behaves differently from the other."
    },
    detailNeed: "Done."
  }
},

{
  slug: "esp32-s3-supermini",
  name: "ESP32-S3 Super Mini",
  shortName: "S3 Super Mini",
  category: "boards",
  alsoCalled: ["S3 Mini", "ESP32-S3 Zero"],
  blurb: "A full S3 shrunk to a thumbnail. Keyboard support in the smallest board.",
  signal: ["Digital in", "Digital out", "Analog in", "PWM", "I2C", "SPI", "Power"],
  difficulty: "Moderate",
  voltage: "3.3V logic, 5V in over USB",
  whatItIs: [
    "The same ESP32-S3 chip as the big development board, mounted on a board about the size of a thumbnail. The marking on the chip reads ESP32-S3, and that is worth checking, because the C3 Super Mini looks almost identical and cannot pretend to be a keyboard.",
    "Because it is a real S3 it keeps USB keyboard and mouse support, which the C3 boards do not have. That makes it the right choice for a macropad that has to fit inside a small printed case.",
    "The trade is pins. You get roughly a dozen usable GPIO instead of the thirty on the full size board, so the layout has to be planned before any wiring starts."
  ],
  pins: [
    { name: "5V", type: "Power", note: "5 volts from the USB socket." },
    { name: "3V3", type: "Power out", note: "3.3 volts out for sensors and modules. The regulator is small, so keep the total draw low." },
    { name: "GND", type: "Ground", note: "Ground. There are few of them, so a breadboard rail is not optional here." },
    { name: "Low numbered GPIO", type: "Analog in", note: "The single digit pins can read analog voltages. Check the silkscreen on your own board, as the layout differs between batches." },
    { name: "Higher numbered GPIO", type: "Digital", note: "Plain digital pins with PWM. The safest ones to start with." },
    { name: "GPIO48", type: "Digital out", note: "Usually drives the onboard RGB LED. Confirm on your board before using it for anything else." },
    { name: "USB-C", type: "Power", note: "Programming and power. On this board it is the chip's own USB, so the computer sees the S3 directly." }
  ],
  wiring: [
    "Read the chip marking before anything else. If it says ESP32-S3 you have this board. If it says ESP32-C3 you have the C3 Super Mini, which behaves differently.",
    "Solder the header pins on. These ship with the headers loose in the bag.",
    "Seat it across the breadboard centre channel and run 3V3 and GND to the rails.",
    "Write down which pin does what as you go. With a dozen pins there is no room to guess later."
  ],
  goesWith: ["esp32-s3", "esp32-c3-supermini", "header-pins", "soldering-iron"],
  watchOut: [
    "It is easy to mistake for the C3 Super Mini. The two are the same shape and the same price, and only the S3 can act as a USB keyboard.",
    "The 3.3V regulator is small. A servo or a motor run from 3V3 will brown the board out and cause random resets.",
    "Several of the low numbered pins affect how the board starts up. A part holding one of them the wrong way stops it booting.",
    "The USB-C socket is soldered to a very thin board. Support it when plugging and unplugging, or the socket tears off."
  ],
  useItFor: "A macropad, a handheld, or anything that has to behave like a keyboard while fitting inside a case a student can print.",
  links: [
    { label: "Espressif ESP32-S3 product page", url: "https://www.espressif.com/en/products/socs/esp32-s3", kind: "Datasheet", vpn: false },
    { label: "MacroPad Builder, plan a layout in the browser", url: "/tools/macropad/", kind: "Tool", vpn: false }
  ],
  media: {
    image: {
      src: "media/esps3mini.webp",
      alt: "A thumbnail sized ESP32-S3 Super Mini board at an angle, with soldered header pins, a USB-C socket at one end, two small buttons and a square chip marked ESP32-S3.",
      caption: "The chip marking is the only reliable way to tell this from the C3 Super Mini, and the difference decides whether the board can be a keyboard."
    },
    imageNeed: "Done.",
    detail: null,
    detailNeed: "Straight down on the board with every pin label readable, the same framing as the full size S3 shot."
  }
},

{
  slug: "esp32-c3-supermini",
  name: "ESP32-C3 Super Mini",
  shortName: "C3 Super Mini",
  category: "boards",
  alsoCalled: ["HW-466AB", "C3 Mini"],
  blurb: "Thumb sized board with sixteen pins. Cheap, tiny, easy to run out of pins.",
  signal: ["Digital in", "Digital out", "Analog in", "PWM", "I2C", "SPI", "Power"],
  difficulty: "Moderate",
  voltage: "3.3V logic, 5V in over USB",
  whatItIs: [
    "The same idea as the S3 in a much smaller package. About the size of a thumbnail, with eight pins down each side.",
    "It fits inside a case a student can actually print, which is the main reason to pick it. The cost is that you get eleven usable pins instead of thirty.",
    "Plan your pins before you start wiring. On this board you will use them all."
  ],
  pins: [
    { name: "5V", type: "Power", note: "5 volts from the USB socket." },
    { name: "3V3", type: "Power out", note: "3.3 volts out for sensors and modules." },
    { name: "GND", type: "Ground", note: "Ground. There is only one, so a breadboard rail is not optional here." },
    { name: "IO0 to IO4", type: "Analog in", note: "These five can read an analog voltage. IO0 and IO2 also affect boot, so use IO1, IO3, IO4 first." },
    { name: "IO5 to IO7", type: "Digital", note: "Plain digital pins with PWM. The safest ones to start with." },
    { name: "IO8", type: "I2C", note: "Default SDA. The onboard blue LED is also on this pin, so it flickers when I2C is busy." },
    { name: "IO9", type: "I2C", note: "Default SCL. Also the BOOT button, so hold nothing on this pin at power-up." },
    { name: "IO20, IO21", type: "Digital", note: "Usually the serial port. Fine as ordinary pins if you are not printing debug messages." }
  ],
  wiring: [
    "Solder header pins on before you do anything else. These boards ship with the headers loose in the bag.",
    "Seat it across the breadboard centre channel, same as any other board.",
    "Write down which pin does what as you go. With eleven pins you cannot afford to guess later.",
    "Keep IO8 and IO9 free if you plan to add a display, since those are the I2C pins."
  ],
  goesWith: ["esp32-s3", "header-pins", "soldering-iron", "breadboard"],
  watchOut: [
    "IO2, IO8 and IO9 all do a job at power-up. A part pulling one of them low can stop the board booting.",
    "The 3.3V regulator on these is small. A servo or a motor plugged into 3V3 will brown out the board and cause random resets.",
    "Some batches have a weak antenna and poor wifi range. This does not matter for a wired project.",
    "The USB socket is soldered to a thin board. Support the board when plugging and unplugging, or the socket tears off."
  ],
  useItFor: "A finished product that has to be small: a wearable, a handheld, anything going inside a printed case.",
  links: [
    { label: "Espressif ESP32-C3 product page", url: "https://www.espressif.com/en/products/socs/esp32-c3", kind: "Datasheet", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "The board next to a coin for scale, top down, both pin rows readable.",
    detail: null,
    detailNeed: "The underside, showing the antenna and the pin labels printed on the back."
  }
},

{
  slug: "esp32-c3-devkit",
  name: "ESP32-C3 Dev Board",
  shortName: "C3 Dev Board",
  category: "boards",
  alsoCalled: ["ESP32-C3 DevKitM", "C3 dev kit"],
  blurb: "Full size C3 board. More ground pins, more room, easier to probe.",
  signal: ["Digital in", "Digital out", "Analog in", "PWM", "I2C", "SPI", "Power"],
  difficulty: "Easy",
  voltage: "3.3V logic, 5V in over USB",
  whatItIs: [
    "The same C3 chip as the Super Mini, mounted on a bigger board with more pins broken out and clearer labels.",
    "Most of the extra pins are ground and power. That sounds boring and it is the reason this board is easier to work with: you can give every part its own ground without a rail.",
    "Use this one while you are developing, then move to the Super Mini if the finished product needs to be small."
  ],
  pins: [
    { name: "3V3", type: "Power out", note: "3.3 volts out. Two pins." },
    { name: "5V", type: "Power", note: "5 volts from USB. Two pins." },
    { name: "GND", type: "Ground", note: "Ground. Seven of them, spread down both sides." },
    { name: "IO0 to IO4", type: "Analog in", note: "Can read analog voltages. IO0 and IO2 also affect boot." },
    { name: "IO5 to IO7", type: "Digital", note: "Plain digital pins with PWM." },
    { name: "IO8, IO9", type: "I2C", note: "Default SDA and SCL. IO9 is also the BOOT button." },
    { name: "IO18, IO19", type: "USB", note: "The native USB data pins. Leave them alone." },
    { name: "RST", type: "Reset", note: "Pull to ground to restart the board. Handy for a panic button, not for anything else." }
  ],
  wiring: [
    "Seat the board across the breadboard centre channel. It is wide, so on a half size breadboard almost nothing else will fit beside it.",
    "Run power and ground to the rails as usual, though on this board you can also wire short parts straight to a nearby GND pin.",
    "Keep the BOOT and RESET buttons reachable. You will press them.",
    "Label your pin choices on masking tape stuck to the breadboard. Future you will thank present you."
  ],
  goesWith: ["esp32-c3-supermini", "breadboard", "usb-c-cable", "multimeter"],
  watchOut: [
    "It is wide. On a half size breadboard you get one free column on each side, which is not enough for much.",
    "IO18 and IO19 carry USB. Wire a part to them and the computer stops seeing the board.",
    "Still 3.3 volt logic. The extra size does not make it 5 volt tolerant."
  ],
  useItFor: "Developing and testing a circuit before you shrink it. Also the right board to hand to someone who has never wired anything.",
  links: [
    { label: "Espressif ESP32-C3 product page", url: "https://www.espressif.com/en/products/socs/esp32-c3", kind: "Datasheet", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Top down on a plain background, both pin rows and the two buttons visible.",
    detail: null,
    detailNeed: "The board on a half size breadboard, showing how little free space is left beside it."
  }
},

{
  slug: "xiao-samd21",
  name: "Seeed XIAO SAMD21",
  shortName: "XIAO",
  category: "boards",
  alsoCalled: ["Seeeduino XIAO", "XIAO SAMD21 M0"],
  blurb: "The smallest board in the room. Eleven pads, no wifi, very reliable USB.",
  signal: ["Digital in", "Digital out", "Analog in", "PWM", "I2C", "SPI", "Power"],
  difficulty: "Moderate",
  voltage: "3.3V logic only",
  whatItIs: [
    "A postage stamp sized board built around a SAMD21 chip. It has no wifi and no bluetooth, which is why it is so small and so cheap.",
    "Its USB support is solid, so it works well as a keyboard or a mouse. That makes it a good fallback for the macropad project when the ESP32 boards are out.",
    "The pads along the edges can be soldered directly to wires, so a finished build can be very flat."
  ],
  pins: [
    { name: "A0 to A5", type: "Analog in", note: "Six pins that read analog voltages. A0 can also output a real analog voltage, which almost no other board here can do." },
    { name: "D0 to D10", type: "Digital", note: "The same physical pins seen as digital. All of them do PWM except A0." },
    { name: "SDA, SCL", type: "I2C", note: "Fixed on A4 and A5. I2C displays and sensors go here." },
    { name: "3V3", type: "Power out", note: "3.3 volts out. The regulator is small, so keep the total draw low." },
    { name: "5V", type: "Power", note: "5 volts from USB." },
    { name: "GND", type: "Ground", note: "Ground. Only one pin, so use a breadboard rail." }
  ],
  wiring: [
    "Solder the headers on if you are breadboarding, or solder wires straight to the edge pads if the build is final.",
    "Seat it across the breadboard centre channel. It is narrow enough to leave plenty of room beside it.",
    "Wire 3V3 and GND to the rails first, as always.",
    "Double tap the reset pads with tweezers if the board stops appearing to your computer. That puts it into bootloader mode."
  ],
  goesWith: ["header-pins", "soldering-iron", "breadboard", "usb-c-cable"],
  watchOut: [
    "3.3 volts only, and it is not 5 volt tolerant at all. A 5V sensor output wired straight to a pin will damage it.",
    "There is no reset button, only two small pads. You need tweezers or a wire to short them.",
    "No wifi and no bluetooth. If the project brief needs wireless, this is the wrong board.",
    "The USB-C socket is surface mounted on a very thin board. Handle it gently."
  ],
  useItFor: "A build that has to be flat or hidden: something sewn into fabric, glued inside a model, or squeezed under a keycap plate.",
  links: [
    { label: "Seeed Studio XIAO SAMD21 wiki", url: "https://wiki.seeedstudio.com/Seeeduino-XIAO/", kind: "Docs", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Top down beside a coin for scale, pad labels readable.",
    detail: null,
    detailNeed: "Close on the edge pads with a wire soldered to one, showing what a direct solder joint looks like."
  }
},

/* ═══ DISPLAYS ═════════════════════════════════════════════════════ */

{
  slug: "ssd1306-i2c",
  name: "SSD1306 OLED, 0.96 inch, I2C",
  shortName: "OLED 0.96in",
  category: "displays",
  alsoCalled: ["0.96 OLED", "128x64 OLED", "4-pin OLED"],
  blurb: "Small bright screen, four wires. The default display for every project here.",
  signal: ["I2C", "Power"],
  difficulty: "Easy",
  voltage: "3.3V or 5V",
  whatItIs: [
    "A screen 128 pixels wide and 64 pixels tall. Every pixel is its own tiny light, so black really is black and the display is readable across a room.",
    "It talks over I2C, which means two wires carry all the data no matter how much you are drawing. Add the two power wires and the whole screen costs you four connections.",
    "Because I2C is a shared bus, a second I2C device uses the same two pins. You do not need more pins to add more devices."
  ],
  pins: [
    { name: "VCC", type: "Power", note: "Power in. Most of these modules accept either 3.3V or 5V. Check the back of the board." },
    { name: "GND", type: "Ground", note: "Ground." },
    { name: "SDA", type: "I2C", note: "Data line. Goes to the board's SDA pin, GPIO8 on the ESP32-S3." },
    { name: "SCL", type: "I2C", note: "Clock line. Goes to the board's SCL pin, GPIO9 on the ESP32-S3." }
  ],
  wiring: [
    "VCC to the 3.3V rail, GND to the ground rail.",
    "SDA to the board's SDA pin, SCL to the board's SCL pin. These two are not interchangeable, so check twice.",
    "Run an I2C scan sketch before writing any display code. It should report address 0x3C. If it reports nothing, the wiring is wrong.",
    "To run two of these at once, bridge the address solder pad on the second one so it answers to 0x3D instead."
  ],
  goesWith: ["esp32-s3", "sh1106", "jumper-wires", "breadboard"],
  watchOut: [
    "SDA and SCL swapped is the single most common failure. The screen stays black and nothing warns you.",
    "Two devices at the same I2C address means neither works. Scan the bus before you blame the code.",
    "Leaving one image on screen for hours burns it in faintly. Move the display or blank it if it will run all day.",
    "The glass panel is glued to the board along one edge with a thin ribbon. Bending the module cracks that ribbon and kills the screen."
  ],
  useItFor: "Showing the current mode, a sensor reading, or a menu. Any project where the user needs to know what state the product is in.",
  links: [
    { label: "Adafruit SSD1306 guide", url: "https://learn.adafruit.com/monochrome-oled-breakouts", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/ssd1306oledI2C.webp",
      alt: "A 0.96 inch SSD1306 OLED module on a blue circuit board, switched off, with four pins along the top labelled VCC, GND, SCL and SDA.",
      caption: "Read the four labels before wiring. On this board the order is VCC, GND, SCL, SDA, and other boards swap the last two. The thin ribbon running under the glass along the bottom edge is the part that breaks if the module gets bent."
    },
    imageNeed: "A second shot with the screen lit and showing text, so the size of the readable area is clear.",
    detail: null,
    detailNeed: "The back of the module, with the four pin labels and the address solder pads visible."
  }
},

{
  slug: "ssd1306-spi",
  name: "SSD1306 OLED, 0.96 inch, SPI",
  shortName: "OLED SPI",
  category: "displays",
  alsoCalled: ["7-pin OLED"],
  blurb: "Same screen, seven wires instead of four. Faster, but eats your pins.",
  signal: ["SPI", "Power"],
  difficulty: "Moderate",
  voltage: "3.3V or 5V",
  whatItIs: [
    "The same 128 by 64 panel as the I2C version, wired to talk over SPI instead. SPI pushes data much faster, so animation is smoother.",
    "The cost is pins. Where I2C needs two, SPI needs five, and three of those must be free GPIO pins that nothing else is using.",
    "For a display that shows a number and a mode name, the speed does not matter. Take the four wire version instead."
  ],
  pins: [
    { name: "VCC", type: "Power", note: "Power in, 3.3V or 5V." },
    { name: "GND", type: "Ground", note: "Ground." },
    { name: "D0 / SCK", type: "SPI", note: "Clock. Goes to the board's SPI clock pin, GPIO12 on the ESP32-S3." },
    { name: "D1 / MOSI", type: "SPI", note: "Data out from the board to the screen. GPIO11 on the ESP32-S3." },
    { name: "RES", type: "Digital out", note: "Reset. Any free GPIO pin. The driver pulses it once at startup." },
    { name: "DC", type: "Digital out", note: "Data or command select. Any free GPIO pin. Tells the screen whether the next byte is a picture or an instruction." },
    { name: "CS", type: "Digital out", note: "Chip select. Any free GPIO pin. Held low while the board is talking to this screen." }
  ],
  wiring: [
    "Power and ground first, as always.",
    "SCK and MOSI to the board's SPI pins. On the ESP32-S3 that is GPIO12 and GPIO11.",
    "Pick three free GPIO pins for RES, DC and CS, and write down which is which before you plug anything in.",
    "Tell the display library your three chosen pin numbers. Unlike I2C there is no scanning, so a wrong number just gives you a blank screen."
  ],
  goesWith: ["ssd1306-i2c", "esp32-s3", "jumper-wires"],
  watchOut: [
    "Seven wires in a row is easy to get off by one. Count from the labelled end every time.",
    "DC and CS swapped gives a screen that flickers with garbage rather than staying blank, which sends people hunting in the code.",
    "On a small board like the C3 Super Mini, this display uses nearly half your available pins."
  ],
  useItFor: "Anything that needs to redraw the whole screen quickly: a moving graph, an animated meter, a small game.",
  links: [
    { label: "Adafruit SSD1306 guide", url: "https://learn.adafruit.com/monochrome-oled-breakouts", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "The seven pin module face on with the screen lit.",
    detail: null,
    detailNeed: "Close on the pin header showing all seven labels in order, left to right."
  }
},

{
  slug: "sh1106",
  name: "SH1106 OLED, 1.3 inch",
  shortName: "OLED 1.3in",
  category: "displays",
  alsoCalled: ["1.3 OLED", "big OLED"],
  blurb: "Bigger version of the 0.96 screen. Same wiring, different driver chip.",
  signal: ["I2C", "Power"],
  difficulty: "Easy",
  voltage: "3.3V or 5V",
  whatItIs: [
    "A 1.3 inch screen with the same 128 by 64 pixels as the small one, so everything is the same size in code and simply larger on the desk.",
    "The driver chip inside is an SH1106, not an SSD1306. The two are close but not identical, and using the wrong library shifts the whole image sideways by two pixels.",
    "If your image looks correct but is offset with a stripe down one edge, you have the wrong driver."
  ],
  pins: [
    { name: "VCC", type: "Power", note: "Power in, 3.3V or 5V." },
    { name: "GND", type: "Ground", note: "Ground." },
    { name: "SDA", type: "I2C", note: "Data line, same pin as any other I2C device." },
    { name: "SCL", type: "I2C", note: "Clock line." }
  ],
  wiring: [
    "Wire it exactly as you would the 0.96 inch I2C screen: VCC, GND, SDA, SCL.",
    "Scan the I2C bus. It should answer at 0x3C, the same address as the small one.",
    "Load an SH1106 library, not an SSD1306 one.",
    "If you already had the small screen working, only the library import line needs to change."
  ],
  goesWith: ["ssd1306-i2c", "esp32-s3", "jumper-wires"],
  watchOut: [
    "Same I2C address as the SSD1306. You cannot put both on one bus without changing an address.",
    "The wrong library gives a two pixel offset and a bar of noise down one side. This looks like broken hardware and is not.",
    "It draws a little more current than the small screen. Not enough to matter on USB power, enough to matter on a coin cell."
  ],
  useItFor: "Any display a user has to read while standing back from the product, or from across a table.",
  links: [
    { label: "Adafruit displayio SH1106 driver", url: "https://github.com/adafruit/Adafruit_CircuitPython_DisplayIO_SH1106", kind: "Library", vpn: true }
  ],
  media: {
    image: null,
    imageNeed: "The 1.3 inch module beside the 0.96 inch one, both lit and showing the same text, so the size difference is obvious.",
    detail: null,
    detailNeed: "The driver chip marking on the back of the module, showing how to tell SH1106 from SSD1306."
  }
},

{
  slug: "ssd1309",
  name: "SSD1309 OLED, 1.54 inch",
  shortName: "OLED 1.54in",
  category: "displays",
  alsoCalled: ["1.54 OLED"],
  blurb: "The largest OLED here. Works over I2C or SPI, your choice.",
  signal: ["I2C", "SPI", "Power"],
  difficulty: "Moderate",
  voltage: "3.3V or 5V",
  whatItIs: [
    "A 1.54 inch panel, still 128 by 64 pixels. The pixels are simply bigger, so text is readable from further away.",
    "Most of these modules have solder pads on the back that pick between I2C and SPI. Out of the box they are usually set to SPI, which surprises people.",
    "The driver chip is close enough to the SSD1306 that the same library works."
  ],
  pins: [
    { name: "VCC", type: "Power", note: "Power in, 3.3V or 5V." },
    { name: "GND", type: "Ground", note: "Ground." },
    { name: "SDA / MOSI", type: "I2C or SPI", note: "Data. Which one it is depends on the solder pads on the back." },
    { name: "SCL / SCK", type: "I2C or SPI", note: "Clock." },
    { name: "RES", type: "Digital out", note: "Reset, used in SPI mode. Any free GPIO." },
    { name: "DC", type: "Digital out", note: "Data or command select, used in SPI mode. Any free GPIO." },
    { name: "CS", type: "Digital out", note: "Chip select, used in SPI mode. Any free GPIO." }
  ],
  wiring: [
    "Turn the module over and read the solder pads. Decide whether you want I2C or SPI before wiring anything.",
    "For I2C, wire VCC, GND, SDA and SCL only, and leave the other three pins unconnected.",
    "For SPI, wire all seven and pick three free GPIO pins for RES, DC and CS.",
    "Test with a scan or a blank fill before you write real drawing code."
  ],
  goesWith: ["ssd1306-i2c", "ssd1306-spi", "soldering-iron"],
  watchOut: [
    "The interface pads are set at the factory and are rarely documented. Check them rather than assuming.",
    "Changing between I2C and SPI means moving a solder blob, which needs a fine tip and a steady hand.",
    "Larger glass, same thin ribbon. It is the most fragile display in the room."
  ],
  useItFor: "A product with a display as its main feature: a desk clock, a weather station, a status board on a wall.",
  links: [
    { label: "Adafruit SSD1306 guide, applies to this driver too", url: "https://learn.adafruit.com/monochrome-oled-breakouts", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "All three OLED sizes lined up, lit, showing the same text.",
    detail: null,
    detailNeed: "The solder pads on the back that select I2C or SPI, close enough to see which is bridged."
  }
},

/* ═══ CONTROLS AND INPUTS ══════════════════════════════════════════ */

{
  slug: "push-button",
  name: "Tactile Push Button",
  shortName: "Push Button",
  category: "controls",
  alsoCalled: ["Tact switch", "momentary switch", "12mm button"],
  blurb: "Two wires, one job. The simplest input, and the one worth understanding first.",
  signal: ["Digital in"],
  difficulty: "Easy",
  voltage: "Any",
  whatItIs: [
    "A switch that connects two of its legs while you hold it down, and disconnects them when you let go. That is the whole part.",
    "The four legged ones are two pairs. Each pair is already joined inside, and the switch connects one pair to the other. Wire across the wrong pair and the button appears permanently pressed.",
    "A pin with nothing connected does not read as off. It floats and reports random values. The fix is a pull-up: a gentle connection to 3.3 volts that holds the pin high until the button pulls it to ground. Every microcontroller here has one built in, switched on in code."
  ],
  pins: [
    { name: "Leg 1", type: "Digital in", note: "To a GPIO pin. Turn on the internal pull-up for that pin in code." },
    { name: "Leg 2", type: "Ground", note: "To ground. Pressing the button pulls the GPIO pin down to ground." },
    { name: "Legs 3 and 4", type: "Duplicate", note: "On a four legged button these are joined to legs 1 and 2 inside the case. Use them or ignore them." }
  ],
  wiring: [
    "Straddle the breadboard centre channel with the button so each pair of legs is on its own side.",
    "One leg to a GPIO pin, the diagonally opposite leg to ground. Diagonal is the safe choice on a four legged button, because diagonal legs are never already joined.",
    "Switch on the internal pull-up for that pin in code, then read the pin. It reads high when released and low when pressed.",
    "Add debouncing in code. A mechanical contact bounces for a few milliseconds and a fast microcontroller sees one press as five."
  ],
  goesWith: ["esp32-s3", "breadboard", "resistor", "jumper-wires"],
  watchOut: [
    "Reading low when pressed feels backwards to students. Say it out loud once: pressed means connected to ground, and ground is zero, so pressed is low.",
    "Wiring across an already joined pair gives a button that is always on. Test with a multimeter in continuity mode if unsure.",
    "Without a pull-up the pin floats and the button triggers when someone walks past. It looks haunted. It is physics.",
    "Without debouncing, one press types your hotkey four times."
  ],
  useItFor: "Any user action: a mode change, a trigger, a menu step. Start every input design with a button and only add complexity once it is working.",
  links: [
    { label: "Adafruit, tactile switches", url: "https://learn.adafruit.com/make-it-switch", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/tactilebutton.webp",
      alt: "A 12 millimetre tactile push button standing in a white breadboard, its square black plunger raised above a metal body, with legs bent out to each side.",
      caption: "A 12mm button straddling the centre channel of a breadboard, which is how it should always be seated."
    },
    imageNeed: "Done.",
    detail: {
      src: "media/tactilebuttondetail.webp",
      alt: "The same button seen from directly above in a breadboard, showing two legs emerging from the left side and two from the right.",
      caption: "Two legs come out of each side. The pair on one side is already joined inside the case, so wire across the diagonal and you can never pick a joined pair by accident."
    },
    detailNeed: "Done."
  }
},

{
  slug: "ky-040",
  name: "KY-040 Rotary Encoder",
  shortName: "KY-040",
  category: "controls",
  alsoCalled: ["Rotary encoder module", "click encoder"],
  blurb: "A knob that turns forever and clicks. Reports direction, not position.",
  signal: ["Digital in", "Power"],
  difficulty: "Moderate",
  voltage: "3.3V or 5V",
  whatItIs: [
    "A knob with no end stops. Turning it sends a stream of pulses on two pins, CLK and DT. The order the two pulse in tells you which way it turned.",
    "It does not know where it is. It only reports that it moved one step, and in which direction. Your code keeps the count.",
    "The shaft is also a button. Pressing it connects the SW pin to ground, exactly like a push button."
  ],
  pins: [
    { name: "CLK", type: "Digital in", note: "First pulse line. Any GPIO pin." },
    { name: "DT", type: "Digital in", note: "Second pulse line. Any GPIO pin. Compare it with CLK to get the direction." },
    { name: "SW", type: "Digital in", note: "The push switch built into the shaft. Pulls to ground when pressed." },
    { name: "+", type: "Power", note: "Power in. 3.3V from the board." },
    { name: "GND", type: "Ground", note: "Ground." }
  ],
  wiring: [
    "Power the module from 3.3V and ground.",
    "CLK, DT and SW each go to their own GPIO pin. That is three pins for one knob, so budget for it.",
    "All three lines need pull-up resistors to 3.3V. Most KY-040 modules already have them soldered on the small board. Look for tiny black rectangles near the pins before adding your own.",
    "Test by printing the direction to the serial monitor before you connect it to anything that matters."
  ],
  goesWith: ["hw-040", "push-button", "resistor", "esp32-s3"],
  watchOut: [
    "Swapping CLK and DT reverses the direction. If your knob counts backwards, that is why, and swapping two wires is the fix.",
    "Cheap encoders skip and jitter. If a single detent sometimes counts twice, that is the hardware, not your code, and a small capacitor across each line helps.",
    "Three pins per knob adds up fast on a small board.",
    "The metal body is not connected to ground on all modules. Do not rely on it."
  ],
  useItFor: "Volume, scrolling, brightness, menu navigation. Anything where the user wants fine control without hunting for a start and end point.",
  links: [
    { label: "Rotary encoder explained", url: "https://en.wikipedia.org/wiki/Rotary_encoder", kind: "Wiki", vpn: true }
  ],
  media: {
    image: null,
    imageNeed: "The module with the knob fitted, at an angle so both the knob and the five pins show.",
    detail: null,
    detailNeed: "Close on the module board showing the built-in pull-up resistors, so students learn to check for them."
  }
},

{
  slug: "hw-040",
  name: "HW-040 Rotary Encoder",
  shortName: "HW-040",
  category: "controls",
  alsoCalled: ["Rotary encoder module"],
  blurb: "The same encoder under a different part number. Check the pin order.",
  signal: ["Digital in", "Power"],
  difficulty: "Moderate",
  voltage: "3.3V or 5V",
  whatItIs: [
    "Functionally the same as the KY-040. Same knob, same pulses, same push switch, same wiring.",
    "The only thing that changes between the two is which pin sits where on the header, and some batches label the switch pin differently.",
    "Read the labels printed on your actual board rather than copying a wiring diagram off the internet."
  ],
  pins: [
    { name: "CLK", type: "Digital in", note: "First pulse line." },
    { name: "DT", type: "Digital in", note: "Second pulse line." },
    { name: "SW", type: "Digital in", note: "The push switch. Sometimes printed as SWA or just S." },
    { name: "+ / VCC", type: "Power", note: "Power in, 3.3V." },
    { name: "GND", type: "Ground", note: "Ground." }
  ],
  wiring: [
    "Read the silkscreen on your board before wiring anything.",
    "Power from 3.3V and ground.",
    "CLK, DT and SW to three GPIO pins.",
    "Confirm the pull-up resistors are on the module. If not, add 10k resistors from each line to 3.3V."
  ],
  goesWith: ["ky-040", "resistor", "esp32-s3"],
  watchOut: [
    "The pin order differs between batches of the same part number. Never assume.",
    "Same skipping and jitter problems as the KY-040.",
    "A wiring guide found online may show a board laid out differently from yours."
  ],
  useItFor: "Exactly what you would use a KY-040 for. Reach for whichever one the drawer has more of.",
  links: [
    { label: "Rotary encoder explained", url: "https://en.wikipedia.org/wiki/Rotary_encoder", kind: "Wiki", vpn: true }
  ],
  media: {
    image: {
      src: "media/hw040encoder.webp",
      alt: "A rotary encoder module on a black circuit board marked Keyes, with a bare metal shaft and five pins labelled CLK, DT, SW, plus and GND.",
      caption: "Five pins in the order GND, +, SW, DT, CLK. The shaft has a flat on one side, so a knob only fits one way round."
    },
    imageNeed: "Done.",
    detail: {
      src: "media/hw040detail.webp",
      alt: "The underside of the encoder module, showing three resistor positions marked R1, R2 and R3, all labelled 10K, with R2 and R3 fitted and the R1 pads left empty.",
      caption: "This is the check worth making on every encoder. R2 and R3 are fitted, so those two lines have their 10k pull-ups. R1 is empty, so that line has none and needs the internal pull-up switched on in code."
    },
    detailNeed: "Done."
  }
},

{
  slug: "ps2-joystick",
  name: "PS2 Analog Joystick",
  shortName: "Joystick",
  category: "controls",
  alsoCalled: ["Thumbstick module", "KY-023", "HW-504"],
  blurb: "Two potentiometers and a button in a thumbstick. Reads position, not direction.",
  signal: ["Analog in", "Digital in", "Power"],
  difficulty: "Moderate",
  voltage: "3.3V or 5V",
  whatItIs: [
    "The stick from a game controller, on a small board. Inside are two potentiometers at right angles: one measures left and right, the other up and down.",
    "Each one gives a voltage that changes as the stick moves. The microcontroller turns that voltage into a number using its analog to digital converter, or ADC.",
    "Pushing the stick straight down closes a switch, so you get a button for free."
  ],
  pins: [
    { name: "VRX", type: "Analog in", note: "Left and right position, as a voltage. Must go to an ADC capable pin." },
    { name: "VRY", type: "Analog in", note: "Up and down position, as a voltage. Also needs an ADC pin." },
    { name: "SW", type: "Digital in", note: "The press switch. Pulls to ground when pressed, so it needs a pull-up like any button." },
    { name: "+5V / VCC", type: "Power", note: "Power in. Feed it 3.3V on a 3.3V board, not 5V, or the outputs will exceed what the pins can take." },
    { name: "GND", type: "Ground", note: "Ground." }
  ],
  wiring: [
    "Power from 3.3V, not 5V. The output voltage never rises above the supply, so a 3.3V supply keeps the outputs safe for the board.",
    "VRX and VRY to two ADC capable pins. On the ESP32-S3 that means GPIO1 to GPIO7 among others.",
    "SW to any GPIO pin with the internal pull-up switched on.",
    "Read the resting values first and write them down. A centred stick rarely reads exactly halfway, and your code has to allow for that."
  ],
  goesWith: ["hw-371", "esp32-s3", "push-button", "jumper-wires"],
  watchOut: [
    "Powering it from 5V on a 3.3V board pushes 5 volts into an analog pin. This damages the pin.",
    "The centre position drifts. Build a dead zone in code, a band around the centre that counts as no movement, or the pointer will creep on its own.",
    "The two axes are rarely calibrated the same. Measure both.",
    "The module has pull-up resistors for the axes but often none for SW. Use the internal pull-up."
  ],
  useItFor: "Pointing, steering, panning a view, or a four way menu. Anything where the user needs to say both a direction and an amount.",
  links: [
    { label: "Analog to digital conversion explained", url: "https://learn.sparkfun.com/tutorials/analog-to-digital-conversion", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/ps2joystick.webp",
      alt: "A PS2 style thumbstick module marked HW-504, with a black stick on a green circuit board and five pins labelled GND, plus 5V, VRx, VRy and SW.",
      caption: "The number printed on this board is HW-504. Feed the pin marked +5V with 3.3V on a 3.3V board, so the two analog outputs stay inside the range the pins can take."
    },
    imageNeed: "Done.",
    detail: null,
    detailNeed: "The underside, with the two potentiometer bodies visible, showing that a joystick really is two pots."
  }
},

{
  slug: "hw-371",
  name: "HW-371 Slide Potentiometer, 45mm",
  shortName: "Slide Pot 45mm",
  category: "controls",
  alsoCalled: ["Fader", "slider", "slide pot"],
  blurb: "A fader. Position is visible without powering anything on, which users like.",
  signal: ["Analog in", "Power"],
  difficulty: "Easy",
  voltage: "3.3V or 5V",
  whatItIs: [
    "A strip of resistive material with a contact, the wiper, that slides along it. Where the wiper sits decides the voltage it picks off.",
    "Connect one end of the strip to 3.3V and the other to ground, and the wiper gives you anything between the two. The microcontroller reads that as a number.",
    "The advantage over a knob is that a slider shows its setting even when the power is off. A user can see the volume before they switch anything on."
  ],
  pins: [
    { name: "OUT / wiper", type: "Analog in", note: "The middle pin. Goes to an ADC capable GPIO pin. This is the only signal wire." },
    { name: "VCC", type: "Power", note: "One end of the track, to 3.3V." },
    { name: "GND", type: "Ground", note: "The other end of the track, to ground." },
    { name: "OTA, OTB", type: "Track ends", note: "On the five pin modules these are the raw ends of the resistive track. The labelled VCC and GND pins already handle them." }
  ],
  wiring: [
    "VCC to 3.3V, GND to ground. If you swap these the slider simply runs backwards, which does no harm.",
    "The middle wiper pin to an ADC capable GPIO pin.",
    "Read the value at both extremes and note them. Real sliders rarely reach the full range, and your code should map what you measured, not what you expected.",
    "If the reading jitters, a 100nF capacitor from the wiper to ground smooths it."
  ],
  goesWith: ["slide-pot-75mm", "rotary-pot", "capacitor", "esp32-s3"],
  watchOut: [
    "The reading jumps around by a few counts even when nothing moves. This is normal. Smooth it in code or with a capacitor.",
    "Powering from 5V on a 3.3V board pushes too much voltage into the analog pin.",
    "The plastic body has no mounting flanges on some versions, so plan how it attaches to your enclosure early.",
    "Dust in the track causes crackles and dropouts. Sliders in a school workshop have a short life."
  ],
  useItFor: "Volume, speed, brightness, mixing. Anything a user wants to set and then see at a glance.",
  links: [
    { label: "Potentiometers explained", url: "https://learn.sparkfun.com/tutorials/resistors/types-of-resistors", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/Hw371slide.webp",
      alt: "An HW-371 slide potentiometer with a yellow knob on a red breakout board, labelled Slide pot HW-371, with a three pin header on each side of the track.",
      caption: "This one is on a breakout board with a three pin header on each side. The pins are marked GND, VCC and an output labelled OTA or OTB rather than OUT, so check your own board against the silkscreen before wiring."
    },
    imageNeed: "A second shot next to a ruler, so the 45mm travel can be compared with the 75mm slider.",
    detail: null,
    detailNeed: "The pin end of the slider, labels visible, showing which pin is the wiper."
  }
},

{
  slug: "slide-pot-75mm",
  name: "B10K Slide Potentiometer, 75mm",
  shortName: "Slide Pot 75mm",
  category: "controls",
  alsoCalled: ["Long fader", "75mm slider"],
  blurb: "Longer version of the 45mm fader. Same wiring, finer control.",
  signal: ["Analog in", "Power"],
  difficulty: "Easy",
  voltage: "3.3V or 5V",
  whatItIs: [
    "The same part as the 45mm slider with a longer track. The B in B10K means the resistance changes evenly along the travel, which is what you want for a control the code reads.",
    "The 10K is the total resistance in ohms. It matters very little for reading position, and any value from 1K to 100K works.",
    "The longer travel spreads the same range of numbers over more distance, so small movements make smaller changes. That is the whole reason to pick it."
  ],
  pins: [
    { name: "OUT / wiper", type: "Analog in", note: "Middle pin, to an ADC capable GPIO pin." },
    { name: "VCC", type: "Power", note: "One end of the track, to 3.3V." },
    { name: "GND", type: "Ground", note: "The other end, to ground." }
  ],
  wiring: [
    "Identical to the 45mm slider: 3.3V to one end, ground to the other, wiper to an ADC pin.",
    "Measure both extremes and map from what you measured.",
    "Cut the enclosure slot to the full 75mm plus a few millimetres, or the knob will hit the end of the slot before the fader reaches its limit."
  ],
  goesWith: ["hw-371", "rotary-pot", "esp32-s3"],
  watchOut: [
    "It is long. Check it fits your enclosure before designing around it.",
    "Same jitter and same dust problems as the shorter one.",
    "The mounting holes are far apart, which changes how you brace the panel."
  ],
  useItFor: "A control the user adjusts precisely and often, where a small hand movement should mean a small change.",
  links: [
    { label: "Potentiometer taper, B versus A", url: "https://learn.sparkfun.com/tutorials/resistors/types-of-resistors", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Both sliders side by side with a ruler, so the travel difference is obvious.",
    detail: null,
    detailNeed: "Not needed."
  }
},

{
  slug: "rotary-pot",
  name: "Rotary Potentiometer",
  shortName: "Rotary Pot",
  category: "controls",
  alsoCalled: ["Trim pot", "volume knob", "B10K pot"],
  blurb: "A knob with a start and an end. Cheapest analog input in the room.",
  signal: ["Analog in", "Power"],
  difficulty: "Easy",
  voltage: "3.3V or 5V",
  whatItIs: [
    "The same idea as a slider, curled into a circle. A wiper travels around a resistive track, usually about 270 degrees from stop to stop.",
    "It is not the same thing as a rotary encoder. A potentiometer knows exactly where it is and cannot turn past its stops. An encoder turns forever and only reports movement.",
    "Pick the potentiometer when the user should be able to see the setting on the knob. Pick the encoder when the setting lives on a screen."
  ],
  pins: [
    { name: "Wiper", type: "Analog in", note: "The middle of the three pins. To an ADC capable GPIO pin." },
    { name: "End 1", type: "Power", note: "To 3.3V." },
    { name: "End 2", type: "Ground", note: "To ground. Swapping the two ends reverses which way the numbers run." }
  ],
  wiring: [
    "The two outer pins go to 3.3V and ground, in whichever order gives you the direction you want.",
    "The middle pin goes to an ADC capable GPIO pin.",
    "Turn it fully both ways and record both readings before writing any mapping code.",
    "A 100nF capacitor from the wiper to ground steadies a noisy reading."
  ],
  goesWith: ["hw-371", "ky-040", "capacitor", "esp32-s3"],
  watchOut: [
    "Students confuse this with an encoder constantly. The test is simple: if it stops at both ends, it is a potentiometer.",
    "The small blue trim pots are meant to be set once with a screwdriver, not turned by a user. They wear out fast under a knob.",
    "The 3296 trimmers in this room are multi-turn. They take about 25 turns of the screw to cross the whole range, so nothing appears to happen at first and students assume they are broken.",
    "An A taper pot changes unevenly, quickly at one end and slowly at the other. That is right for audio and wrong for reading position. Use a B taper."
  ],
  useItFor: "Volume, brightness, a threshold a user sets by hand. Also useful for testing an analog input before the real sensor arrives.",
  links: [
    { label: "Potentiometers explained", url: "https://learn.sparkfun.com/tutorials/resistors/types-of-resistors", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/rotarypotentiometer.webp",
      alt: "A small blue 3296W multi-turn trimmer potentiometer standing in a breadboard, marked BAOTER 3296 and W103, with a gold adjusting screw on top.",
      caption: "This is the trimmer kind, marked 103 for 10k. It is a multi-turn part, so it takes around 25 turns of the screw to go end to end rather than the three quarters of a turn a knob pot gives you."
    },
    imageNeed: "A panel mount pot with a knob fitted, so the knob type and the trimmer type can be compared side by side.",
    detail: {
      src: "media/rotarypotentiometerdetail.webp",
      alt: "The face of the same trimmer filling the frame, with a resistor symbol moulded into the plastic, its ends numbered 1 and 3, the wiper arrow numbered 2, and the letters CW marking the clockwise direction.",
      caption: "The diagram is moulded into the body. Pin 2 is the wiper, pins 1 and 3 are the two ends of the track, and CW shows which way the numbers climb."
    },
    detailNeed: "Done."
  }
},

{
  slug: "toggle-switch",
  name: "Toggle and Slide Switch",
  shortName: "Toggle Switch",
  category: "controls",
  alsoCalled: ["SPDT switch", "latching switch", "power switch"],
  blurb: "Stays where you put it. Use it for power and settings, not triggers.",
  signal: ["Digital in", "No signal"],
  difficulty: "Easy",
  voltage: "Any",
  whatItIs: [
    "A switch that latches. Unlike a push button it holds its position when you let go, so the product's state is visible on the switch itself.",
    "SPDT means single pole, double throw: one common pin that connects to either of two others depending on the position. Wire the common pin plus whichever one you need.",
    "It can either carry the power to your whole circuit, or act as an input the microcontroller reads. Those are different jobs and they wire differently."
  ],
  pins: [
    { name: "Common", type: "Digital in", note: "The middle pin. Either to a GPIO pin, or into your power line." },
    { name: "Throw 1", type: "Ground", note: "To ground, if you are reading it as an input." },
    { name: "Throw 2", type: "Unused", note: "Often left unconnected on a simple on and off input." }
  ],
  wiring: [
    "As an input: common pin to a GPIO pin with the internal pull-up on, one throw to ground. Reads low in one position, high in the other.",
    "As a power switch: put it in the line between the battery positive and the board, so flipping it cuts power entirely.",
    "Never wire a switch straight across power and ground with nothing in between. That is a short circuit and it will get hot.",
    "Check the current rating printed on the body if it is switching anything with a motor in it."
  ],
  goesWith: ["push-button", "battery-holder", "multimeter"],
  watchOut: [
    "Cheap slide switches are rated for very little current. A motor through a small switch welds the contacts shut.",
    "Latching switches bounce as well. Debounce them if code reacts to the change.",
    "A switch in the ground line rather than the power line works but makes fault finding confusing. Switch the positive side."
  ],
  useItFor: "The main power switch on a battery powered product, or a setting the user picks once and leaves.",
  links: [
    { label: "Switch types explained", url: "https://learn.sparkfun.com/tutorials/switch-basics", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A toggle switch, a slide switch and a rocker switch together, contacts visible.",
    detail: null,
    detailNeed: "The three pins of an SPDT switch with the common pin marked on the photo."
  }
},

/* ═══ SENSORS ══════════════════════════════════════════════════════
   Seeded with the six a school kit almost always holds. This category
   is waiting for the real inventory list before it fills out.
   ════════════════════════════════════════════════════════════════ */

{
  slug: "ldr",
  name: "Light Dependent Resistor",
  shortName: "LDR",
  category: "sensors",
  alsoCalled: ["LDR", "photoresistor", "photocell"],
  blurb: "A resistor that changes with light. Two legs, no polarity, cents each.",
  signal: ["Analog in"],
  difficulty: "Easy",
  voltage: "Any",
  whatItIs: [
    "A small disc with a squiggle on the front. In bright light its resistance falls to a few hundred ohms. In darkness it climbs into the millions.",
    "A microcontroller cannot measure resistance directly, only voltage. So you pair the LDR with an ordinary resistor to make a voltage divider: two resistors in a line, with the reading taken from the point between them.",
    "As the light changes, the LDR's share of the voltage changes, and the pin between them reads higher or lower."
  ],
  pins: [
    { name: "Leg 1", type: "Power", note: "To 3.3V. Either leg works, there is no polarity." },
    { name: "Leg 2", type: "Analog in", note: "To an ADC pin, and also through a 10k resistor to ground. That junction is what you read." }
  ],
  wiring: [
    "One leg of the LDR to 3.3V.",
    "The other leg to an ADC capable GPIO pin.",
    "From that same point, a 10k resistor down to ground. This is the divider, and without it the pin reads nothing useful.",
    "Cover the sensor with your hand and watch the number move. If it does not move, the divider resistor is missing or the pin is not ADC capable."
  ],
  goesWith: ["resistor", "esp32-s3", "breadboard"],
  watchOut: [
    "Without the second resistor there is no divider and the reading is meaningless. This is the mistake, every time.",
    "The response is not a straight line. Doubling the light does not double the number.",
    "Room lighting flickers at mains frequency. Averaging several readings gives a much steadier result.",
    "Every LDR is slightly different. Calibrate the one you are actually using."
  ],
  useItFor: "A night light that switches itself on, a display that dims in a dark room, a beam broken by a passing hand.",
  links: [
    { label: "Voltage dividers explained", url: "https://learn.sparkfun.com/tutorials/voltage-dividers", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Several LDRs of different sizes on a plain background, squiggle face up.",
    detail: null,
    detailNeed: "An LDR and a 10k resistor built as a divider on a breadboard, with the reading point marked."
  }
},

{
  slug: "dht11",
  name: "DHT11 Temperature and Humidity Sensor",
  shortName: "DHT11",
  category: "sensors",
  alsoCalled: ["DHT22 is the better version", "temperature module"],
  blurb: "One wire gives you both temperature and humidity. Slow, and that is fine.",
  signal: ["Digital in", "Power"],
  difficulty: "Easy",
  voltage: "3.3V or 5V",
  whatItIs: [
    "A blue plastic box with a grille. Inside are two sensors and a small chip that packages both readings into a single stream of pulses on one data pin.",
    "It is not an analog sensor. The pin carries a coded message, not a voltage that means a temperature, so you need a library to decode it.",
    "It updates about once a second and no faster. Asking more often just returns the last answer."
  ],
  pins: [
    { name: "VCC", type: "Power", note: "Power in, 3.3V or 5V." },
    { name: "DATA", type: "Digital in", note: "The single data line. Any GPIO pin. Needs a 10k pull-up to VCC, usually built into the three pin modules." },
    { name: "GND", type: "Ground", note: "Ground." },
    { name: "NC", type: "Unused", note: "On the bare four pin sensors, the third pin does nothing. Leave it." }
  ],
  wiring: [
    "Power and ground first.",
    "DATA to any GPIO pin.",
    "If you have the bare four pin sensor rather than a module, add a 10k resistor from DATA to VCC. The three pin modules already have one.",
    "Read once a second at most, and expect the first reading after power-up to be wrong."
  ],
  goesWith: ["resistor", "esp32-s3", "ssd1306-i2c"],
  watchOut: [
    "The DHT11 rounds to whole degrees and whole percent. If the brief needs precision, use a DHT22.",
    "Reading it too fast returns stale data or an error. Slow down before you debug anything else.",
    "Its own circuitry warms it slightly. Mounted inside a sealed case it will read a degree or two high.",
    "The four pin bare sensor without a pull-up resistor gives nothing but read failures."
  ],
  useItFor: "A room monitor, a greenhouse alarm, anything measuring comfort. A good first sensor because the numbers mean something a person recognises.",
  links: [
    { label: "Adafruit DHT sensor guide", url: "https://learn.adafruit.com/dht", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "The blue DHT11 module and a white DHT22 side by side, grilles facing the camera.",
    detail: null,
    detailNeed: "The three pin module from behind, showing the pull-up resistor already fitted."
  }
},

{
  slug: "thermistor",
  name: "Thermistor",
  shortName: "Thermistor",
  category: "sensors",
  alsoCalled: ["NTC thermistor", "10k thermistor", "temperature resistor"],
  blurb: "A resistor that changes with heat. Wired exactly like a light sensor.",
  signal: ["Analog in"],
  difficulty: "Easy",
  voltage: "Any",
  whatItIs: [
    "A small bead with two legs whose resistance changes with temperature. The common NTC kind drops in resistance as it gets hotter, which is the opposite of what most people guess.",
    "The 10k on the packet is its resistance at 25 degrees, not a fixed value. That number is the one you pair it with, so a 10k thermistor wants a 10k resistor beside it.",
    "Like a light dependent resistor, it cannot be read directly. It goes in a voltage divider with an ordinary resistor, and the microcontroller reads the point between the two."
  ],
  pins: [
    { name: "Leg 1", type: "Power", note: "To 3.3V. There is no polarity, so either leg works." },
    { name: "Leg 2", type: "Analog in", note: "To an ADC pin, and also through a 10k resistor to ground. That junction is what you read." }
  ],
  wiring: [
    "One leg of the thermistor to 3.3V.",
    "The other leg to an ADC capable GPIO pin.",
    "From that same point, a 10k resistor down to ground. Without it there is no divider and the reading means nothing.",
    "Pinch the bead between your fingers and watch the number move. If it does not move, the divider resistor is missing or the pin cannot read analog."
  ],
  goesWith: ["ldr", "resistor", "dht11", "esp32-s3"],
  watchOut: [
    "The relationship between resistance and temperature is a curve, not a straight line. Mapping it as though it were straight gives readings that are close in the middle and badly wrong at the ends.",
    "Turning a reading into real degrees needs the Steinhart and Hart equation, or a lookup table. If the project only needs hotter and colder, skip the maths and use the raw number.",
    "NTC and PTC types behave in opposite directions. Most kit thermistors are NTC.",
    "The bead is small and responds to the warmth of a finger, so handle it by the legs when taking a reading you care about."
  ],
  useItFor: "A temperature alarm, a fan that switches itself on, a thermostat. Cheaper and faster to respond than a DHT11, though it measures only temperature.",
  links: [
    { label: "Voltage dividers explained", url: "https://learn.sparkfun.com/tutorials/voltage-dividers", kind: "Guide", vpn: false },
    { label: "Adafruit thermistor guide", url: "https://learn.adafruit.com/thermistor", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Several thermistors on a plain background, with one beside a 10k resistor so the pairing is visible.",
    detail: null,
    detailNeed: "A thermistor and its 10k partner built as a divider on a breadboard, with the reading point marked."
  }
},

{
  slug: "hc-sr04",
  name: "HC-SR04 Ultrasonic Distance Sensor",
  shortName: "HC-SR04",
  category: "sensors",
  alsoCalled: ["Ultrasonic sensor", "the eyes"],
  blurb: "Measures distance by timing an echo. Two pins, two centimetres to four metres.",
  signal: ["Digital in", "Digital out", "Power"],
  difficulty: "Moderate",
  voltage: "5V, output needs care on 3.3V boards",
  whatItIs: [
    "Two metal cylinders that look like eyes. One sends a burst of sound too high to hear, the other listens for it coming back.",
    "You pulse the TRIG pin for ten microseconds. The sensor sends its burst, then holds the ECHO pin high for exactly as long as the sound takes to return.",
    "Your code times how long ECHO stayed high and converts it to distance. Sound travels about 343 metres per second, and the sound made a round trip, so distance is time multiplied by 343 and then halved."
  ],
  pins: [
    { name: "VCC", type: "Power", note: "5V. Most of these do not work reliably at 3.3V." },
    { name: "TRIG", type: "Digital out", note: "You pulse this to start a measurement. Any GPIO pin." },
    { name: "ECHO", type: "Digital in", note: "The sensor holds this high while it waits. On a 3.3V board this pin needs a voltage divider first." },
    { name: "GND", type: "Ground", note: "Ground." }
  ],
  wiring: [
    "VCC to 5V, GND to ground.",
    "TRIG straight to any GPIO pin. The sensor is happy to be triggered by 3.3 volts.",
    "ECHO through a voltage divider before it reaches the board: a 1k resistor from ECHO to the pin, and a 2k resistor from that pin down to ground. This drops the 5 volt output to about 3.3.",
    "Test against a wall at a measured distance and check your maths before trusting the numbers."
  ],
  goesWith: ["resistor", "esp32-s3", "breadboard"],
  watchOut: [
    "ECHO puts out 5 volts. Wired straight to a 3.3V board it will damage the pin. This is the most common way students break an ESP32.",
    "Soft or angled surfaces scatter the sound and give no echo at all. The reading jumps to maximum.",
    "It cannot see anything closer than about two centimetres.",
    "Two of them near each other hear each other's bursts. Trigger them one at a time."
  ],
  useItFor: "A parking sensor, a hand wave trigger, a level gauge in a tank, an obstacle detector on a moving model.",
  links: [
    { label: "Voltage dividers explained", url: "https://learn.sparkfun.com/tutorials/voltage-dividers", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/hcsr04.webp",
      alt: "An HC-SR04 ultrasonic sensor on a blue board, with two metal transducers marked T and R, a crystal between them, and four pins labelled Vcc, Trig, Echo and Gnd.",
      caption: "T is the transducer that sends the burst and R is the one that listens for it. Echo puts out 5 volts, so it needs a divider before it reaches a 3.3V board."
    },
    imageNeed: "Done.",
    detail: null,
    detailNeed: "The ECHO voltage divider built on a breadboard, with the two resistor values readable."
  }
},

{
  slug: "pir-sensor",
  name: "HC-SR501 Motion Sensor",
  shortName: "PIR Sensor",
  category: "sensors",
  alsoCalled: ["PIR sensor", "motion detector"],
  blurb: "Notices warm things moving. Gives a plain high or low, no maths needed.",
  signal: ["Digital in", "Power"],
  difficulty: "Easy",
  voltage: "5V in, 3.3V out",
  whatItIs: [
    "A white plastic dome over a sensor that watches for changes in infrared heat. A person walking past changes the pattern and the sensor notices.",
    "It does all the work itself and gives you a single pin that goes high when it sees movement and low when it does not. From the code's point of view it is a button that presses itself.",
    "Two orange screws on the back set how sensitive it is and how long the output stays high after a trigger."
  ],
  pins: [
    { name: "VCC", type: "Power", note: "5V. It has its own regulator on board." },
    { name: "OUT", type: "Digital in", note: "Goes high on movement. Puts out 3.3 volts, so it is safe on any board here." },
    { name: "GND", type: "Ground", note: "Ground." }
  ],
  wiring: [
    "VCC to 5V, GND to ground.",
    "OUT to any GPIO pin. No pull-up resistor needed, the sensor drives the pin both ways.",
    "Leave it alone for about a minute after power-up. It has to learn what the still room looks like and it triggers constantly until it has.",
    "Set the two screws by testing, not by guessing. Turn one at a time so you know which did what."
  ],
  goesWith: ["esp32-s3", "led", "jumper-wires"],
  watchOut: [
    "It triggers on the way in and stays high for a set time, so it tells you movement happened, not that someone is still there.",
    "Sunlight through a window and a heater turning on both look like movement to it.",
    "Some modules have a jumper choosing between one trigger per event and repeated triggers. Check which way yours is set.",
    "It needs its warm-up minute after every power cycle."
  ],
  useItFor: "A light that comes on when someone enters, a display that wakes on approach, a counter for people passing a doorway.",
  links: [
    { label: "Adafruit PIR sensor guide", url: "https://learn.adafruit.com/pir-passive-infrared-proximity-motion-sensor", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "The sensor with its white dome, and a second one with the dome removed showing the sensor underneath.",
    detail: null,
    detailNeed: "The back of the module, both adjustment screws and the mode jumper labelled."
  }
},

{
  slug: "tilt-switch",
  name: "Tilt and Vibration Switch",
  shortName: "Tilt Switch",
  category: "sensors",
  alsoCalled: ["SW-520D", "ball switch", "vibration sensor"],
  blurb: "A metal ball in a tube. Closes a circuit when tipped or shaken.",
  signal: ["Digital in"],
  difficulty: "Easy",
  voltage: "Any",
  whatItIs: [
    "A sealed tube with a metal ball inside and two contacts at one end. Tip it one way and the ball bridges the contacts. Tip it back and the circuit opens.",
    "Electrically it is a push button that gravity presses. You wire it and read it exactly the same way.",
    "The vibration version has a loose spring instead of a ball, so it closes briefly whenever it is knocked."
  ],
  pins: [
    { name: "Leg 1", type: "Digital in", note: "To a GPIO pin with the internal pull-up on." },
    { name: "Leg 2", type: "Ground", note: "To ground." }
  ],
  wiring: [
    "One leg to a GPIO pin, one to ground, internal pull-up on. Same as a button.",
    "Mount it in the orientation you actually want to detect. Which way is closed depends entirely on how it is glued down.",
    "Debounce it. A rolling ball bounces far worse than a button.",
    "Test by tipping the whole breadboard rather than poking the part."
  ],
  goesWith: ["push-button", "esp32-s3", "breadboard"],
  watchOut: [
    "The trigger angle is vague and varies between parts. This is not a real angle sensor.",
    "It rattles. Any vibration nearby closes it briefly, so code has to ignore short pulses.",
    "The tube is glass in some versions. It breaks.",
    "For real orientation sensing you want an accelerometer, not this."
  ],
  useItFor: "A shake to reset, an alarm that fires when a box is opened or moved, a toy that reacts to being picked up.",
  links: [
    { label: "Switch basics", url: "https://learn.sparkfun.com/tutorials/switch-basics", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A tilt switch and a vibration switch side by side, close enough to see the ball and the spring.",
    detail: null,
    detailNeed: "Not needed."
  }
},

{
  slug: "hall-sensor",
  name: "Hall Effect Sensor",
  shortName: "Hall Sensor",
  category: "sensors",
  alsoCalled: ["A3144", "magnetic sensor", "reed switch alternative"],
  blurb: "Detects a magnet with no contact at all. Sealed products can still have inputs.",
  signal: ["Digital in", "Power"],
  difficulty: "Easy",
  voltage: "3.3V or 5V",
  whatItIs: [
    "A three legged part in a small black package that notices a magnetic field. Bring a magnet near and its output pin goes low. Take it away and the pin goes high.",
    "The useful part is that nothing has to touch it. The sensor can sit inside a sealed, waterproof case and still respond to a magnet held outside.",
    "The common A3144 is a latching type on some batches: one pole turns it on, the other turns it off. Test yours with both faces of a magnet."
  ],
  pins: [
    { name: "VCC", type: "Power", note: "Power in, 3.3V or 5V." },
    { name: "GND", type: "Ground", note: "Ground." },
    { name: "OUT", type: "Digital in", note: "Open collector on the bare sensor, so it needs a 10k pull-up to VCC. Modules include one." }
  ],
  wiring: [
    "Power and ground to the outer pins. Check the flat face of the package for the pin order, as it is easy to get backwards.",
    "OUT to any GPIO pin.",
    "On a bare A3144, add a 10k resistor from OUT to VCC. The pin will read nothing sensible without it.",
    "Test with both faces of the magnet. Only one of them may trigger it."
  ],
  goesWith: ["resistor", "esp32-s3", "toggle-switch"],
  watchOut: [
    "Wiring it backwards heats it up quickly and destroys it. Check the pin order against the flat face.",
    "It usually responds to only one magnetic pole. A magnet held the wrong way round does nothing.",
    "Range is a centimetre or two at best with a small magnet.",
    "Strong magnets near a microcontroller are fine, but keep them well away from any card reader or hard drive."
  ],
  useItFor: "A lid that knows when it is closed, a bike wheel speed counter, a control on a fully sealed enclosure.",
  links: [
    { label: "Hall effect sensor basics", url: "https://learn.sparkfun.com/tutorials/hall-effect-sensors", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A bare A3144 and a three pin module together, with a small magnet in shot.",
    detail: null,
    detailNeed: "Close on the flat face of the bare sensor, pins numbered on the photo."
  }
},

{
  slug: "i2s-microphone",
  name: "INMP441 I2S Microphone",
  shortName: "I2S Microphone",
  category: "sensors",
  alsoCalled: ["MEMS microphone", "INMP441", "I2S mic"],
  blurb: "Sound as numbers, straight off the bus. No analog wiring, no amplifier.",
  signal: ["I2S", "Power"],
  difficulty: "Tricky",
  voltage: "3.3V",
  whatItIs: [
    "A tiny microphone with the converter built into the same package. It hands the microcontroller a stream of numbers rather than a wobbling voltage, so there is no amplifier to build and no noise picked up along the way.",
    "It talks over I2S, which is a different bus from I2C despite the similar name. I2S carries audio only, and it needs three lines: a clock, a word select line that marks left from right, and the data line itself.",
    "The sound reaches the sensor through a small hole in the metal can on the underside of the board. That hole has to be left clear, so the board cannot simply be glued face down inside a case."
  ],
  pins: [
    { name: "VDD", type: "Power", note: "3.3 volts. This part is not 5V tolerant." },
    { name: "GND", type: "Ground", note: "Ground." },
    { name: "SCK", type: "I2S", note: "Serial clock. To an I2S clock pin on the board." },
    { name: "WS", type: "I2S", note: "Word select, sometimes called LRCL. Marks whether the current sample is the left or the right channel." },
    { name: "SD", type: "I2S", note: "Serial data out, from the microphone to the board." },
    { name: "L/R", type: "Digital in", note: "Channel select. Tie it to ground for the left channel or to 3.3V for the right. Leaving it floating gives unpredictable results." }
  ],
  wiring: [
    "VDD to 3.3V and GND to ground. Do not feed this one 5 volts.",
    "SCK, WS and SD each to a GPIO pin, then tell the I2S driver in code which pin you chose for each. On the ESP32 the I2S peripheral can be routed to almost any pin.",
    "Tie L/R to ground so the microphone always answers on the left channel, then read the left channel in code. This is the step people skip.",
    "Check the sound hole in the metal can is not blocked or covered by tape once the board is mounted."
  ],
  goesWith: ["esp32-s3", "speaker", "jumper-wires", "breadboard"],
  watchOut: [
    "I2S is not I2C. They are different buses with different wiring, and a guide for one will not work for the other.",
    "Leaving L/R unconnected gives silence, or sound on a channel your code is not reading. It looks like a dead microphone.",
    "It needs 3.3 volts. 5 volts will damage it.",
    "The data only makes sense as a stream. A single reading tells you nothing, so the code has to collect a block of samples before it can measure loudness."
  ],
  useItFor: "A sound level meter, a clap detector, a voice recorder, or anything that reacts to how loud a room is.",
  links: [
    { label: "What I2S is and how it differs from I2C", url: "https://en.wikipedia.org/wiki/I%C2%B2S", kind: "Wiki", vpn: true },
    { label: "Adafruit I2S microphone guide", url: "https://learn.adafruit.com/adafruit-i2s-mems-microphone-breakout", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/i2cmicrophone.webp",
      alt: "A small round circuit board with six pins soldered on, labelled SD, VDD and GND along one row and L slash R, WS and SCK along the other.",
      caption: "Six pins, and the three signal names SD, WS and SCK are what tell you this is an I2S part rather than an I2C one."
    },
    imageNeed: "Done.",
    detail: {
      src: "media/i2cmicrophonedetail.webp",
      alt: "The underside of the same board at an angle, showing a small silver metal can with a hole in it beside the marking U1, and the six pins on yellow headers.",
      caption: "The hole in the silver can is the sound inlet. Cover it, glue over it, or mount the board face down against a surface, and the microphone goes deaf."
    },
    detailNeed: "Done."
  }
},

/* ═══ OUTPUTS AND ACTUATORS ════════════════════════════════════════ */

{
  slug: "led",
  name: "LED",
  shortName: "LED",
  category: "outputs",
  alsoCalled: ["Light emitting diode", "indicator"],
  blurb: "Light in one direction only, and only with a resistor in front of it.",
  signal: ["Digital out", "PWM"],
  difficulty: "Easy",
  voltage: "About 2V across it, so it needs a resistor",
  whatItIs: [
    "A diode that gives off light. Current flows through it one way and not the other, so it has a right way round and a wrong way round.",
    "The long leg is the anode, the positive side. The short leg is the cathode, and there is a flat spot on the rim of the case beside it.",
    "An LED does not limit its own current. Connected straight across a supply it draws as much as it can and burns out. A resistor in series is not optional."
  ],
  pins: [
    { name: "Anode, long leg", type: "Digital out", note: "To a GPIO pin, through a resistor." },
    { name: "Cathode, short leg", type: "Ground", note: "To ground. The flat spot on the case is on this side." }
  ],
  wiring: [
    "Long leg towards the positive side, short leg towards ground. Backwards it simply does nothing, which is a safe kind of mistake.",
    "Put a resistor in series. From a 3.3V pin, 220 ohms is a good default. Anything from 150 to 1000 ohms works, and higher means dimmer.",
    "The resistor can go on either side of the LED. It limits the current through the loop, and there is only one loop.",
    "For brightness control, drive the pin with PWM instead of plain on and off."
  ],
  goesWith: ["resistor", "neopixel", "esp32-s3", "breadboard"],
  watchOut: [
    "No resistor means a bright flash and then a dead LED, and sometimes a damaged GPIO pin with it.",
    "Backwards is harmless but looks identical to broken. Try turning it round before deciding it is dead.",
    "Different colours need different voltages. Blue and white need more than red, so the same resistor gives a dimmer blue.",
    "Do not put several LEDs across one resistor in parallel. They will not share current evenly and one will be much brighter."
  ],
  useItFor: "Telling the user what the product is doing. Power on, mode selected, error, ready. The cheapest feedback there is.",
  links: [
    { label: "Adafruit, all about LEDs", url: "https://learn.adafruit.com/all-about-leds", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/leds.webp",
      alt: "Several dozen 5 millimetre LEDs scattered on a white surface in red, green, blue, yellow and clear, all with their legs still full length.",
      caption: "Legs still full length, which is how they arrive. The colour of the plastic is only a guide: a clear one can light up any colour at all."
    },
    imageNeed: "Done.",
    detail: {
      src: "media/leddetail.webp",
      alt: "Four LEDs in blue, green, yellow and red standing in a breadboard, photographed from the side so that one leg of each is clearly longer than the other.",
      caption: "One leg is longer on every one of them. The long leg is the anode, the positive side. Look along the row and the difference is obvious."
    },
    detailNeed: "Done."
  }
},

{
  slug: "neopixel",
  name: "WS2812B Addressable LED",
  shortName: "NeoPixel",
  category: "outputs",
  alsoCalled: ["NeoPixel", "WS2812", "addressable LED strip"],
  blurb: "A chain of LEDs on one data pin. Each one takes its own colour.",
  signal: ["Digital out", "Power"],
  difficulty: "Moderate",
  voltage: "5V for the LEDs, 3.3V data usually works",
  whatItIs: [
    "Each LED has a tiny chip inside it. You send a stream of colours down one wire, each LED takes the first one and passes the rest along.",
    "That means fifty LEDs cost you one pin, which is why they show up in so many projects.",
    "The chain is directional. The arrows printed on the strip point away from the microcontroller, and wiring into the wrong end gives you nothing at all."
  ],
  pins: [
    { name: "5V", type: "Power", note: "Power in. Each LED at full white draws about 60mA, so a strip needs its own supply." },
    { name: "DIN", type: "Digital out", note: "Data in. From a GPIO pin, ideally through a 330 ohm resistor." },
    { name: "GND", type: "Ground", note: "Ground. Must be shared with the microcontroller's ground, even on a separate supply." },
    { name: "DOUT", type: "Data out", note: "Carries the rest of the stream on to the next LED. Only used when chaining strips." }
  ],
  wiring: [
    "Check the arrows on the strip. Wire your data line into the DIN end.",
    "A 330 ohm resistor between the GPIO pin and DIN protects the first LED from the sharp edge of the signal.",
    "For more than about eight LEDs, power the strip from its own 5V supply rather than the board.",
    "Join the strip's ground to the board's ground. Without a shared ground the data signal has no reference and the colours go wild."
  ],
  goesWith: ["led", "resistor", "capacitor", "esp32-s3"],
  watchOut: [
    "A separate supply with no shared ground is the classic failure. Symptoms are random flickering that looks like a code bug.",
    "A full strip at white draws amps, far more than a USB port will give. Budget the current before you buy.",
    "Wiring into the DOUT end gives a completely dead strip with no clue as to why.",
    "A 1000uF capacitor across the strip's power leads absorbs the surge at switch-on and stops the first LED failing."
  ],
  useItFor: "Status shown in colour, lighting effects, an ambient display, backlighting a product. The most visually striking output for the least effort.",
  links: [
    { label: "Adafruit NeoPixel Uberguide", url: "https://learn.adafruit.com/adafruit-neopixel-uberguide", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A strip lit in several colours at once, plus a single loose WS2812B so the chip inside the LED is visible.",
    detail: null,
    detailNeed: "Close on the strip's solder pads with the direction arrow visible."
  }
},

{
  slug: "piezo-buzzer",
  name: "Piezo Buzzer",
  shortName: "Buzzer",
  category: "outputs",
  alsoCalled: ["Passive buzzer", "active buzzer", "beeper"],
  blurb: "Sound from one pin. Active buzzers beep, passive ones play notes.",
  signal: ["Digital out", "PWM"],
  difficulty: "Easy",
  voltage: "3.3V or 5V",
  whatItIs: [
    "A disc of crystal that flexes when voltage is applied. Flex it thousands of times a second and it pushes air, which is sound.",
    "An active buzzer has its own oscillator inside. Give it power and it beeps at one fixed pitch. It cannot do anything else.",
    "A passive buzzer has no oscillator, so you drive it with PWM and the frequency you choose is the note you hear. This is the one you want for anything musical."
  ],
  pins: [
    { name: "+", type: "Digital out", note: "To a GPIO pin. On an active buzzer, plain high and low. On a passive one, PWM at the pitch you want." },
    { name: "-", type: "Ground", note: "Ground." }
  ],
  wiring: [
    "Positive leg to a GPIO pin, negative to ground.",
    "For an active buzzer, set the pin high and it beeps. That is all it does.",
    "For a passive buzzer, use a PWM output and set the frequency to the note. 440Hz is a concert A.",
    "If it is loud enough to be annoying, put a 100 ohm resistor in series to quieten it."
  ],
  goesWith: ["led", "resistor", "esp32-s3"],
  watchOut: [
    "Active and passive buzzers look identical. If yours beeps the moment you power it, it is active and you cannot change the note.",
    "Some draw more than a GPIO pin should supply. If the board resets when it sounds, drive it through a transistor.",
    "They are much louder than students expect in a quiet classroom.",
    "The sealed ones are polarised and marked with a plus. The bare discs are not."
  ],
  useItFor: "An audible confirmation, an alarm, a timer, feedback for a user who is not looking at the product.",
  links: [
    { label: "Piezo buzzer basics", url: "https://learn.adafruit.com/adafruit-arduino-lesson-10-making-sounds", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/piezobuzzer.webp",
      alt: "A small round black sealed buzzer standing in a breadboard, with a sound hole in the centre of its top face and a plus symbol moulded beside it.",
      caption: "The plus moulded into the top face marks the positive leg. This one is sealed, so there is no way to tell from the outside whether it makes its own tone or needs one sent to it."
    },
    imageNeed: "Done.",
    detail: {
      src: "media/piezodetail.webp",
      alt: "The top face of the same buzzer filling the frame, with the sound hole and the moulded plus symbol both sharp.",
      caption: "Power it and listen. If it beeps on its own it is an active buzzer at one fixed pitch. If it stays silent it is passive, and you choose the note with PWM."
    },
    detailNeed: "Done."
  }
},

{
  slug: "speaker",
  name: "Enclosed Cavity Speaker",
  shortName: "Speaker",
  category: "outputs",
  alsoCalled: ["Cavity speaker", "8 ohm speaker", "JST speaker"],
  blurb: "Real sound rather than a beep. Needs an amplifier between it and the board.",
  signal: ["Digital out", "PWM"],
  difficulty: "Tricky",
  voltage: "Driven from an amplifier, not from a pin",
  whatItIs: [
    "A small speaker sealed inside a plastic box. The box is not packaging: a bare speaker cone pushes air out of the front and pulls it in at the back at the same time, and the two cancel out. The sealed cavity stops that, which is why this sounds far fuller than a bare driver of the same size.",
    "It ends in a two pin JST plug rather than bare wires, so it unplugs cleanly from a board that has the matching socket.",
    "It is a passive speaker. There is no electronics inside, so it cannot be driven from a GPIO pin the way a buzzer can. It needs a small amplifier board between it and the microcontroller."
  ],
  pins: [
    { name: "Red wire", type: "Output", note: "One side of the coil. To the positive output of an amplifier board." },
    { name: "Black wire", type: "Output", note: "The other side of the coil. To the negative output of the amplifier." },
    { name: "JST plug", type: "Connector", note: "Two pin. It only fits one way round, which is the main reason to keep the plug rather than cutting it off." }
  ],
  wiring: [
    "Do not wire it straight to a GPIO pin. A speaker coil is close to a short circuit as far as the pin is concerned, and the pin will not survive it.",
    "Put a small amplifier board between the two. The microcontroller feeds the amplifier and the amplifier drives the speaker.",
    "Speaker to the amplifier output, and the amplifier's own power to 5V and ground. Its ground has to be shared with the board.",
    "Start with the volume low. These are much louder than their size suggests and a full volume test in a quiet classroom is a memorable mistake."
  ],
  goesWith: ["piezo-buzzer", "i2s-microphone", "power-module", "esp32-s3"],
  watchOut: [
    "A speaker across a GPIO pin damages the pin. This is the single thing to get right.",
    "Polarity does not stop it working, but with two speakers wired opposite ways the bass cancels out between them.",
    "The thin wires break where they leave the plastic box. Add a strain relief if the build gets handled.",
    "Cutting the JST plug off to save time loses the one feature that makes it easy to unplug and reuse."
  ],
  useItFor: "Anything that has to say something rather than beep: a talking product, sound effects, an alarm that carries across a room, music.",
  links: [
    { label: "Adafruit, driving speakers from a microcontroller", url: "https://learn.adafruit.com/adafruit-max98357-i2s-class-d-mono-amp", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/speaker.webp",
      alt: "A small speaker sealed in a rectangular black plastic box with four mounting holes, its red and black lead coiled beside it and ending in a white two pin JST plug.",
      caption: "The plastic box is part of how it sounds, not just packaging. The two pin JST plug at the end of the lead only fits one way round."
    },
    imageNeed: "Done.",
    detail: null,
    detailNeed: "The speaker connected through a small amplifier board to a microcontroller, with the three stages laid out left to right so the signal path is obvious."
  }
},

{
  slug: "sg90-servo",
  name: "SG90 Micro Servo",
  shortName: "SG90 Servo",
  category: "outputs",
  alsoCalled: ["Micro servo", "9g servo", "blue servo"],
  blurb: "Moves to an angle and holds it. One signal wire, needs its own power.",
  signal: ["PWM", "Power"],
  difficulty: "Moderate",
  voltage: "5V power, 3.3V signal works",
  whatItIs: [
    "A small motor, a gearbox and a control circuit in one plastic box. You tell it an angle and it drives itself there and holds against a load.",
    "The instruction is a pulse repeated fifty times a second. A pulse of about one millisecond means one end of the travel, two milliseconds means the other, and one and a half means the middle.",
    "Most SG90s cover about 180 degrees. The continuous rotation version looks identical and spins instead, which catches people out."
  ],
  pins: [
    { name: "Orange or yellow", type: "PWM", note: "Signal. To a PWM capable GPIO pin." },
    { name: "Red", type: "Power", note: "5V power. Draws a spike of current every time it moves." },
    { name: "Brown or black", type: "Ground", note: "Ground. Must be shared with the microcontroller's ground." }
  ],
  wiring: [
    "Signal to a PWM pin. A 3.3 volt pulse is enough for the SG90 to understand.",
    "Power from 5V, and ideally not from the microcontroller board. Its current spikes cause resets.",
    "Join the servo ground to the board ground, always.",
    "Move it to the centre before fitting the horn, or the arm ends up pointing the wrong way and half your travel is wasted."
  ],
  goesWith: ["capacitor", "battery-holder", "esp32-s3", "breadboard"],
  watchOut: [
    "Powering a servo from a board's 3.3V pin browns out the board. The symptom is the board resetting the moment the servo moves.",
    "Driving it past its mechanical stop makes it buzz and strain, which strips the plastic gears.",
    "The continuous rotation version is the same shape and does something completely different. Check the label.",
    "The horn splines only fit one way. Forcing a horn on rounds them off."
  ],
  useItFor: "A moving indicator, a latch, a dispenser, a small door, a camera that turns. The cheapest controlled movement available.",
  links: [
    { label: "Adafruit servo guide", url: "https://learn.adafruit.com/adafruit-arduino-lesson-14-servo-motors", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "The servo with its bag of horns and screws laid out beside it.",
    detail: null,
    detailNeed: "The three wire connector with each colour labelled on the photo."
  }
},

{
  slug: "vibration-motor",
  name: "Coin Vibration Motor",
  shortName: "Vibration Motor",
  category: "outputs",
  alsoCalled: ["Haptic motor", "pancake motor", "buzz motor"],
  blurb: "Feedback the user feels rather than sees or hears. Needs a transistor.",
  signal: ["Digital out", "PWM"],
  difficulty: "Tricky",
  voltage: "3V, driven through a transistor",
  whatItIs: [
    "A flat motor the size of a coin with a deliberately unbalanced weight inside. Spinning it shakes the whole product.",
    "It draws more current than a GPIO pin can safely give, so it cannot be wired directly. A transistor does the switching, with the pin only telling the transistor what to do.",
    "A motor also kicks back a voltage spike when it stops. A diode across it gives that spike somewhere harmless to go."
  ],
  pins: [
    { name: "Red wire", type: "Power", note: "To 3V, through the transistor circuit rather than to a pin." },
    { name: "Blue or black wire", type: "Ground", note: "To the collector of the transistor, not straight to ground." }
  ],
  wiring: [
    "Motor positive to 3.3V. Motor negative to the collector leg of an NPN transistor.",
    "Transistor emitter to ground.",
    "Transistor base to a GPIO pin through a 1k resistor. The pin now switches the motor without carrying its current.",
    "Put a diode across the motor, band towards the positive side, to absorb the spike when it stops."
  ],
  goesWith: ["transistor", "diode", "resistor", "esp32-s3"],
  watchOut: [
    "Wired straight to a GPIO pin it will damage the pin, often not immediately, which makes the cause hard to find later.",
    "Without the diode the voltage spike travels back into the circuit and resets or damages the board.",
    "The vibration loosens breadboard connections and unglues things. Fix it down properly.",
    "The thin enamelled wires break at the motor body with very little handling."
  ],
  useItFor: "Confirming an action on a product the user is holding, an alert in a quiet room, feedback in a wearable.",
  links: [
    { label: "Driving motors with a transistor", url: "https://learn.adafruit.com/adafruit-arduino-lesson-13-dc-motors", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A coin motor with its adhesive backing, next to a cylindrical vibration motor.",
    detail: null,
    detailNeed: "The transistor driver circuit built on a breadboard, with the transistor, resistor and diode all identifiable."
  }
},

/* ═══ PASSIVE COMPONENTS ═══════════════════════════════════════════ */

{
  slug: "resistor",
  name: "Resistor",
  shortName: "Resistor",
  category: "passives",
  alsoCalled: ["Fixed resistor", "pull-up", "current limiting resistor"],
  blurb: "Restricts current. The part that stops other parts destroying themselves.",
  signal: ["No signal"],
  difficulty: "Easy",
  voltage: "Any",
  whatItIs: [
    "A small cylinder with a coloured band code and a leg at each end. It resists the flow of current, and how much is measured in ohms.",
    "It does three jobs in these projects. It limits current, which is what protects an LED. It makes a voltage divider, which is how a light sensor is read and how a 5 volt signal is brought down to 3.3. And it acts as a pull-up, holding a pin at a known level so it does not float.",
    "It has no polarity. Either way round is the same."
  ],
  pins: [
    { name: "Leg 1", type: "Either", note: "No polarity. There is no wrong way round." },
    { name: "Leg 2", type: "Either", note: "Same." }
  ],
  wiring: [
    "Count the bands first. The blue metal film resistors in this room have five, where most charts online show four, and the extra band is a third digit.",
    "Then measure it with a multimeter rather than reading the colours. It is faster, and it works under warm classroom lighting where brown and red look the same.",
    "For an LED on a 3.3V pin, use 220 ohms. On a five band part that is red, red, black, black, then brown.",
    "For a pull-up on a button or an I2C line, use 10k. On a five band part that is brown, black, black, red, then brown.",
    "For a voltage divider bringing 5 volts down to 3.3, use 1k on top and 2k below, and read the point between them."
  ],
  goesWith: ["led", "push-button", "ldr", "capacitor", "multimeter"],
  watchOut: [
    "The colour bands are hard to read under warm lighting, and brown and red look the same at a glance. Measure rather than squint.",
    "Four band and five band resistors are read differently. Reading a five band part off a four band chart gives an answer that is out by a factor of ten.",
    "The tolerance band is the one set slightly apart from the rest, and it marks the end you read towards, not from.",
    "10k and 100k differ by one band and behave completely differently in a divider.",
    "A resistor in the wrong place is invisible on a breadboard. Trace the circuit rather than staring at it."
  ],
  useItFor: "Every LED, every button, every analog sensor. If a part is directly connected to a supply with nothing in the way, ask whether it needs one.",
  links: [
    { label: "Resistor colour code calculator", url: "https://www.digikey.com/en/resources/conversion-calculators/conversion-calculator-resistor-color-code", kind: "Tool", vpn: false },
    { label: "SparkFun resistors tutorial", url: "https://learn.sparkfun.com/tutorials/resistors", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/resistors.webp",
      alt: "Ten blue bodied metal film resistors laid out in a row on white paper with their legs straight, each showing five coloured bands.",
      caption: "These are the blue metal film kind, and they carry five bands, not four. That extra band is a third digit, so a four band chart found online will give you the wrong answer. Measure them instead."
    },
    imageNeed: "Done.",
    detail: null,
    detailNeed: "One five band resistor filling the frame with each band numbered on the photo, since the classroom stock is five band and most charts are not."
  }
},

{
  slug: "capacitor",
  name: "Capacitor",
  shortName: "Capacitor",
  category: "passives",
  alsoCalled: ["Ceramic cap", "electrolytic cap", "decoupling capacitor"],
  blurb: "Stores a little charge. Smooths supplies and steadies noisy readings.",
  signal: ["No signal"],
  difficulty: "Easy",
  voltage: "Check the rating printed on it",
  whatItIs: [
    "A part that holds a small amount of charge and gives it back. Think of it as a very small, very fast battery that steadies whatever it is connected across.",
    "The small orange or blue discs are ceramic. They are not polarised, they are usually marked with a code like 104 for 100nF, and they sit next to a chip to absorb the fast dips when it draws current.",
    "The taller cylinders are electrolytic. They hold much more, they are polarised, and the stripe down the side marks the negative leg."
  ],
  pins: [
    { name: "Ceramic legs", type: "Either", note: "No polarity. Either way round." },
    { name: "Electrolytic, long leg", type: "Power", note: "Positive. To the positive side of the supply." },
    { name: "Electrolytic, striped leg", type: "Ground", note: "Negative. The stripe on the case points to this leg." }
  ],
  wiring: [
    "For decoupling, put a 100nF ceramic across the power and ground pins of a module, as close to the chip as you can get it.",
    "For smoothing a noisy analog reading, put a 100nF ceramic from the signal pin to ground.",
    "For a supply that dips when a motor or an LED strip kicks in, put a large electrolytic, 470uF or more, across the power rails.",
    "Read the code: 104 means 100nF, 103 means 10nF. The last digit is the number of zeros in picofarads."
  ],
  goesWith: ["resistor", "neopixel", "hw-371", "sg90-servo"],
  watchOut: [
    "An electrolytic wired backwards heats up, bulges and can burst. Check the stripe every time.",
    "The voltage rating printed on the case is a maximum. Do not put a 6.3V part on a 12V rail.",
    "A large capacitor holds charge after the power is off. Small ones are harmless, but never assume a circuit is dead the instant you unplug it.",
    "A capacitor that smooths a reading also slows it down. Too large and a fast input feels sluggish."
  ],
  useItFor: "Any circuit that behaves oddly when something else switches on, any analog reading that will not sit still, any module without decoupling of its own.",
  links: [
    { label: "SparkFun capacitors tutorial", url: "https://learn.sparkfun.com/tutorials/capacitors", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/capacitor.webp",
      alt: "A black electrolytic capacitor standing above a breadboard, printed 100 microfarads and 50 volts, with a cross shaped vent scored into the top.",
      caption: "An electrolytic, 100uF at 50V. The cross scored into the top is a vent, designed to split open if the part is ever wired backwards."
    },
    imageNeed: "Ceramic disc capacitors beside the electrolytics, so the two kinds can be told apart at a glance.",
    detail: {
      src: "media/capacitordetail.webp",
      alt: "A close view of the same capacitor showing a pale stripe running down one side of the black case, filled with repeated minus symbols.",
      caption: "The stripe down the side carries minus symbols and marks the negative leg. Check it every time, because this is the one component here that can burst if it goes in the wrong way round."
    },
    detailNeed: "Done."
  }
},

{
  slug: "diode",
  name: "Diode",
  shortName: "Diode",
  category: "passives",
  alsoCalled: ["1N4148", "1N4007", "flyback diode", "rectifier"],
  blurb: "A one way valve for current. Protects against backwards power and spikes.",
  signal: ["No signal"],
  difficulty: "Easy",
  voltage: "Any, check the rating",
  whatItIs: [
    "A part that lets current pass one way and blocks it the other. The band printed near one end marks the side current flows out of.",
    "In these projects it does two jobs. It protects a circuit against a battery fitted backwards, and it absorbs the voltage spike a motor or a relay throws out when it stops.",
    "That second job matters. A spinning motor is also a generator, and when the power is cut it dumps a spike back into the circuit. A diode across it gives that spike a harmless loop to die in."
  ],
  pins: [
    { name: "Anode", type: "Power", note: "The unbanded end. Current enters here." },
    { name: "Cathode", type: "Ground", note: "The banded end. Current leaves here. The band is always the marked end." }
  ],
  wiring: [
    "For protection across a motor, wire the diode in parallel with the motor, band towards the positive supply. In normal running it does nothing at all.",
    "For reverse polarity protection, put the diode in the positive supply line, band pointing towards the circuit.",
    "Remember that a diode in the supply line drops about 0.7 volts. On a 3.3 volt supply that is a lot.",
    "Check the current rating. The 1N4148 is a small signal part and the 1N4007 handles much more."
  ],
  goesWith: ["vibration-motor", "transistor", "sg90-servo", "led"],
  watchOut: [
    "Backwards across a motor it conducts all the time and shorts your supply. This gets hot fast.",
    "A diode in the supply line drops voltage. Two in series on a 3.3V rail leave you with under 2 volts.",
    "The band is small and dark on some parts. Use a multimeter's diode test to find the direction.",
    "An LED is a diode too, but it will not survive being used as a protection diode."
  ],
  useItFor: "Any circuit with a motor, a relay, or a battery a user could fit backwards.",
  links: [
    { label: "SparkFun diodes tutorial", url: "https://learn.sparkfun.com/tutorials/diodes", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A 1N4148 and a 1N4007 side by side, bands clearly visible.",
    detail: null,
    detailNeed: "Not needed."
  }
},

{
  slug: "transistor",
  name: "NPN Transistor",
  shortName: "Transistor",
  category: "passives",
  alsoCalled: ["2N2222", "S8050", "BC547", "switch transistor"],
  blurb: "A switch with no moving parts. Lets a tiny pin control a big load.",
  signal: ["Digital out"],
  difficulty: "Tricky",
  voltage: "3.3V control, load can be higher",
  whatItIs: [
    "A three legged part that acts as a switch controlled by electricity instead of a finger. A small current into the base leg allows a much larger current to flow between collector and emitter.",
    "This is how a 3.3 volt pin that can supply a few milliamps controls a motor that needs hundreds. The pin never carries the load current, it only opens the gate.",
    "The three legs are base, collector and emitter. Which leg is which depends on the part number, so look it up rather than guessing."
  ],
  pins: [
    { name: "Base", type: "Digital out", note: "The control leg. To a GPIO pin through a 1k resistor." },
    { name: "Collector", type: "Load", note: "To the negative side of whatever you are switching." },
    { name: "Emitter", type: "Ground", note: "To ground." }
  ],
  wiring: [
    "Look up the pinout for your exact part number. The 2N2222 and the S8050 are not in the same order.",
    "Base to a GPIO pin through a 1k resistor. Without that resistor the pin is driving straight into a junction and both parts suffer.",
    "Emitter to ground. Collector to the negative leg of the motor, buzzer or LED strip you are switching.",
    "The positive side of the load goes to the supply, not through the transistor."
  ],
  goesWith: ["vibration-motor", "diode", "resistor", "esp32-s3"],
  watchOut: [
    "Pinout differs by part number, and a transistor wired with base and collector swapped just gets hot.",
    "No base resistor means too much current into the pin and into the transistor.",
    "An NPN transistor switches the ground side of a load, not the positive side. Trying to switch the positive side with one does not work properly.",
    "For anything above about half an amp, use a MOSFET instead."
  ],
  useItFor: "Any output a GPIO pin cannot drive on its own: a motor, a relay, a long LED strip, a loud buzzer.",
  links: [
    { label: "SparkFun transistors tutorial", url: "https://learn.sparkfun.com/tutorials/transistors", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Several small signal transistors together with their part numbers readable, flat faces towards the camera.",
    detail: null,
    detailNeed: "One transistor with its three legs labelled base, collector and emitter on the photo, for that exact part number."
  }
},

/* ═══ PROTOTYPING AND CONNECTION ═══════════════════════════════════ */

{
  slug: "breadboard",
  name: "Solderless Breadboard",
  shortName: "Breadboard",
  category: "proto",
  alsoCalled: ["Protoboard", "prototyping board"],
  blurb: "Build a circuit without soldering. Learn how the holes join or nothing works.",
  signal: ["No signal"],
  difficulty: "Easy",
  voltage: "Any",
  whatItIs: [
    "A plastic block full of holes with metal clips underneath. Push a leg into a hole and it grips, and it also connects to the other holes in the same clip.",
    "The main area is split into rows of five. The five holes in one row are joined to each other and to nothing else. A channel runs down the centre, and the two sides of that channel are separate.",
    "The long strips down the edges are the power rails, joined all the way along. Red is for the positive supply, blue for ground, by convention rather than by wiring."
  ],
  pins: [
    { name: "Row of five", type: "Joined", note: "The five holes across one row are one connection. Anything in them is connected together." },
    { name: "Centre channel", type: "Separated", note: "The two sides are not joined. Chips and boards straddle it so their two pin rows stay apart." },
    { name: "Power rails", type: "Joined", note: "The long red and blue strips. Joined end to end, though on some boards there is a break in the middle." }
  ],
  wiring: [
    "Seat any board or chip across the centre channel. Pushed in on one side only, every pin shorts to its neighbour.",
    "Run one jumper from your board's 3.3V pin to the red rail and one from GND to the blue rail. Do this first, every time.",
    "Check whether your rails have a break in the middle. Many do, and half the board goes dead without a bridging wire.",
    "Keep wires short and flat. A nest of long jumpers is impossible to trace when something stops working."
  ],
  goesWith: ["jumper-wires", "esp32-s3", "header-pins", "perfboard"],
  watchOut: [
    "Rails broken in the middle catch out almost everyone once. Look for the gap in the printed line.",
    "The clips wear out. A hole used many times stops gripping and the connection becomes intermittent, which looks exactly like a code bug.",
    "Thick solid wire and component legs stretch the clips permanently. Do not force anything in.",
    "A breadboard cannot carry much current. It is not the place for a motor supply."
  ],
  useItFor: "Every circuit, before it is soldered. Prove the idea works here first, then move it to perfboard.",
  links: [
    { label: "SparkFun, how to use a breadboard", url: "https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A full size and a half size breadboard side by side, top down, rails and centre channel clear.",
    detail: null,
    detailNeed: "A breadboard with the backing peeled off, showing the metal clips underneath and how the rows are joined."
  }
},

{
  slug: "jumper-wires",
  name: "Jumper Wires",
  shortName: "Jumper Wires",
  category: "proto",
  alsoCalled: ["Dupont wires", "jumpers", "patch wires"],
  blurb: "Three kinds: male to male, male to female, female to female. Know which.",
  signal: ["No signal"],
  difficulty: "Easy",
  voltage: "Any",
  whatItIs: [
    "Short wires with a plug or a socket on each end. Male ends are pins that push into a breadboard. Female ends are sockets that fit over pins.",
    "Male to male joins one breadboard hole to another. Male to female joins a module's pin header to a breadboard. Female to female joins two pin headers directly.",
    "Which you need is decided by what is on each end of the connection. Working that out before you start saves a lot of rummaging."
  ],
  pins: [
    { name: "Male end", type: "Plug", note: "A pin. Goes into a breadboard hole or a socket." },
    { name: "Female end", type: "Socket", note: "A socket. Goes over a header pin on a module." }
  ],
  wiring: [
    "Use colour with meaning. Red for the positive supply, black for ground, and then whatever you like for signals, but stay consistent across the whole build.",
    "Pull on the plastic housing, never on the wire. The crimp inside pulls out easily.",
    "Keep them the shortest length that reaches. Long wires pick up noise and hide the circuit.",
    "Test a suspect wire with a multimeter in continuity mode. Broken jumpers are common and invisible."
  ],
  goesWith: ["breadboard", "header-pins", "multimeter", "esp32-s3"],
  watchOut: [
    "A wire that has failed inside its insulation looks perfect. This wastes more classroom time than any other fault.",
    "Ignoring colour convention makes it impossible for anyone else, including a teacher, to help you debug.",
    "The ribbon sets separate one wire at a time, and pulling too fast tears the housings off.",
    "Female sockets stretch. A well used one no longer grips a pin properly."
  ],
  useItFor: "Every connection on a breadboard. Buy more than you think you need, because they go missing.",
  links: [
    { label: "Connector basics", url: "https://learn.sparkfun.com/tutorials/connector-basics", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/jumperwires.webp",
      alt: "A bundle of around twenty male to male jumper wires in many colours, fanned out so the pin ends at both ends are visible.",
      caption: "These are male to male, a pin at each end, for joining one breadboard hole to another."
    },
    imageNeed: "Done.",
    detail: null,
    detailNeed: "All three types side by side, male to male next to male to female next to female to female, close enough to tell the ends apart."
  }
},

{
  slug: "header-pins",
  name: "Header Pins and Sockets",
  shortName: "Header Pins",
  category: "proto",
  alsoCalled: ["Dupont headers", "pin strip", "2.54mm header"],
  blurb: "The strips you snap and solder so a bare board can plug into anything.",
  signal: ["No signal"],
  difficulty: "Moderate",
  voltage: "Any",
  whatItIs: [
    "Strips of pins on a plastic spine, spaced 2.54 millimetres apart, which is the same spacing as every hole on a breadboard.",
    "Male headers are pins that stick up. Female headers are sockets. Snap a strip to length with side cutters, then solder it to your board.",
    "The spacing is the whole point. Because everything here uses 2.54mm, any board with headers fits any breadboard."
  ],
  pins: [
    { name: "Male strip", type: "Plug", note: "Pins pointing up. Solder to a board so it can plug into a breadboard." },
    { name: "Female strip", type: "Socket", note: "Sockets. Solder to a board so a module can plug into it and be removed later." }
  ],
  wiring: [
    "Count the pins and snap the strip one pin longer than you need, then trim, because the pin at the break is often damaged.",
    "Push the pins through the board and hold them square with a breadboard underneath. The breadboard keeps everything aligned while you solder.",
    "Solder one end pin, check the strip is straight, then do the rest. Reheating one joint to fix the angle is easy. Reheating twenty is not.",
    "Solder every pin, including the ones you think you will not use. A missed pin has no mechanical strength."
  ],
  goesWith: ["soldering-iron", "breadboard", "esp32-c3-supermini", "xiao-samd21"],
  watchOut: [
    "Headers soldered crooked will not seat in a breadboard, and straightening them afterwards means desoldering the lot.",
    "A cold joint looks dull and grey rather than shiny, and it works intermittently, which is worse than not working at all.",
    "Bridging two pins with too much solder is easy on a fine pitch board. Check between every pin with a magnifier.",
    "The plastic spine melts if you hold the iron on too long, and the pin then wanders out of line."
  ],
  useItFor: "Any bare board that ships with loose headers, and any module you want to be able to unplug and reuse next year.",
  links: [
    { label: "Adafruit, guide to excellent soldering", url: "https://learn.adafruit.com/adafruit-guide-excellent-soldering", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A long male strip, a long female strip, and a short snapped piece of each, together.",
    detail: null,
    detailNeed: "A board being soldered with a breadboard used as a jig to hold the header square."
  }
},

{
  slug: "perfboard",
  name: "Perfboard and Stripboard",
  shortName: "Perfboard",
  category: "proto",
  alsoCalled: ["Veroboard", "stripboard", "prototyping PCB"],
  blurb: "Where a working breadboard circuit goes to become permanent.",
  signal: ["No signal"],
  difficulty: "Tricky",
  voltage: "Any",
  whatItIs: [
    "A rigid board of holes at the same 2.54mm spacing as a breadboard, with copper pads to solder to.",
    "Plain perfboard gives each hole its own isolated pad, so every connection is a wire you add. Stripboard has copper strips running the length of the board, so holes in a line are already joined, like a breadboard.",
    "Stripboard is faster but you must cut the strips where you want a break, using a drill bit turned by hand or a proper track cutter."
  ],
  pins: [
    { name: "Plain pad", type: "Isolated", note: "On perfboard, one pad per hole. Every connection is a wire you solder." },
    { name: "Strip", type: "Joined", note: "On stripboard, a whole line of holes is already connected. Cut the strip to break it." }
  ],
  wiring: [
    "Draw the layout on squared paper first, counting holes. Working it out with the iron in your hand does not go well.",
    "Fit the lowest components first, so the board sits flat while you solder them.",
    "On stripboard, cut every break before soldering anything, and mark them on your drawing as you go.",
    "Check for accidental solder bridges under a light before applying power for the first time."
  ],
  goesWith: ["soldering-iron", "breadboard", "header-pins", "multimeter"],
  watchOut: [
    "A missed strip cut is a short circuit that looks like a working board until you power it.",
    "Perfboard needs a wire for every single connection, and the underside becomes a maze quickly.",
    "Rework is genuinely hard. Get the circuit right on a breadboard first.",
    "The fibreglass dust from cutting the board is unpleasant. Score and snap it rather than sawing where you can."
  ],
  useItFor: "The final build, once the breadboard version has worked reliably for a while. Not before.",
  links: [
    { label: "Stripboard layout basics", url: "https://en.wikipedia.org/wiki/Stripboard", kind: "Wiki", vpn: true }
  ],
  media: {
    image: {
      src: "media/perfboard.webp",
      alt: "A 6 by 8 centimetre green perfboard seen from above, covered in rows of separate ringed copper pads, with longer joined pads running down each long edge.",
      caption: "This is plain perfboard: every pad is its own island, so every connection is a wire you solder. Stripboard looks much the same from above but has whole rows already joined underneath."
    },
    imageNeed: "Done.",
    detail: null,
    detailNeed: "The underside of a finished student build on stripboard, with a track cut visible."
  }
},

{
  slug: "usb-c-cable",
  name: "USB-C Cable",
  shortName: "USB-C Cable",
  category: "proto",
  alsoCalled: ["Data cable", "programming cable"],
  blurb: "Half the cables in the room carry no data. Find out which yours is.",
  signal: ["Power", "No signal"],
  difficulty: "Easy",
  voltage: "5V",
  whatItIs: [
    "The cable that both powers the board and carries your code to it. Not every USB-C cable does the second job.",
    "Cables sold with phone chargers and power banks are often charge only. They have the power wires and nothing else, and they are physically identical to a full cable.",
    "A charge only cable powers the board perfectly, so the LED lights and everything looks fine, and the computer never sees the device. This wastes an enormous amount of time."
  ],
  pins: [
    { name: "VBUS", type: "Power", note: "5 volts from the computer or charger." },
    { name: "GND", type: "Ground", note: "Ground." },
    { name: "D+ and D-", type: "Data", note: "The data pair. Missing entirely in a charge only cable." }
  ],
  wiring: [
    "Test the cable before blaming the board. Plug in and check whether a new device appears on the computer.",
    "Mark your known good cables with tape or a label and keep them separate.",
    "If a board suddenly stops appearing, swap the cable before you change anything else.",
    "Support the board when plugging in. The socket is soldered to a thin board and levering the cable tears it off."
  ],
  goesWith: ["esp32-s3", "xiao-samd21", "power-supply"],
  watchOut: [
    "Charge only cables are the single most common cause of a board that seems dead but is not.",
    "A tugged cable rips the USB socket off the board, taking the pads with it, and that is not repairable in a classroom.",
    "Very long cables can drop enough voltage to cause resets on a board driving anything hungry.",
    "The socket wears out with repeated use. A board plugged and unplugged all year will eventually go loose."
  ],
  useItFor: "Programming and powering every board here. Keep two known good cables in the kit and guard them.",
  links: [
    { label: "USB-C explained", url: "https://en.wikipedia.org/wiki/USB-C", kind: "Wiki", vpn: true }
  ],
  media: {
    image: null,
    imageNeed: "Several USB-C cables together, with the known data ones marked, showing they look identical.",
    detail: null,
    detailNeed: "Not needed."
  }
},

{
  slug: "crocodile-clips",
  name: "Crocodile Clip Leads",
  shortName: "Croc Clips",
  category: "proto",
  alsoCalled: ["Alligator clips", "test leads"],
  blurb: "Grab onto anything with a leg or an edge. For testing, not for building.",
  signal: ["No signal"],
  difficulty: "Easy",
  voltage: "Any",
  whatItIs: [
    "Sprung metal jaws on a wire. They clamp onto a battery terminal, a component leg, a piece of foil, or anything else with an edge.",
    "They are a testing tool. Nothing held by a crocodile clip is a permanent connection, and clips fall off when the table is bumped.",
    "They are the fastest way to answer the question of whether a part works at all."
  ],
  pins: [
    { name: "Jaw", type: "Either", note: "Clamps onto a leg, a terminal or a foil edge. No polarity of its own." }
  ],
  wiring: [
    "Clip onto the thickest part available. Fine wires get cut by the teeth.",
    "Keep the two clips of a pair well apart. Metal jaws touching is a short circuit.",
    "Use the insulating boots if the leads have them, which stops the jaws touching anything they should not.",
    "Take them off before you move the build. They will come off anyway, at the worst moment."
  ],
  goesWith: ["multimeter", "battery-holder", "jumper-wires"],
  watchOut: [
    "Bare metal jaws touching each other or a nearby leg shorts the circuit instantly.",
    "The teeth cut through thin enamelled wire and through insulation.",
    "The internal crimp fails often and the lead reads open. Check with a multimeter before trusting one.",
    "Never use them on anything above battery voltages."
  ],
  useItFor: "Quick tests. Is this LED alive, is this battery flat, does this motor spin. Not for anything that has to stay connected.",
  links: [
    { label: "Connector basics", url: "https://learn.sparkfun.com/tutorials/connector-basics", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A set of croc leads in several colours, one pair clipped to a battery holder.",
    detail: null,
    detailNeed: "Not needed."
  }
},

/* ═══ POWER ════════════════════════════════════════════════════════ */

{
  slug: "power-supply",
  name: "USB Power Supply and Power Bank",
  shortName: "USB Power",
  category: "power",
  alsoCalled: ["Wall adapter", "power bank", "USB charger"],
  blurb: "Five volts from the wall or a pocket. Simplest power a project can have.",
  signal: ["Power"],
  difficulty: "Easy",
  voltage: "5V",
  whatItIs: [
    "A wall adapter or a battery pack with a USB socket. Plug the board in and it runs, with no wiring to get wrong.",
    "The board's own regulator turns the 5 volts into the 3.3 volts the chip needs, so nothing extra is required.",
    "A power bank makes a project portable without any battery circuitry of your own, which is often the right answer for a school project."
  ],
  pins: [
    { name: "USB socket", type: "Power", note: "5 volts out. How much current depends on the adapter, usually between 0.5 and 3 amps." }
  ],
  wiring: [
    "Plug the board in with a cable, exactly as you would to a computer.",
    "Check the current rating printed on the adapter against what your project draws. LED strips and motors add up fast.",
    "For a permanent build, a USB socket in the enclosure wall is tidier than a hole with a cable through it.",
    "Note that many power banks switch themselves off when the load is small. A board drawing 30 milliamps often looks like nothing to them."
  ],
  goesWith: ["usb-c-cable", "battery-holder", "lipo-charger", "esp32-s3"],
  watchOut: [
    "Power banks with an auto shutoff turn off on a low draw project after about thirty seconds. This is a known nuisance and there is no fix in your circuit.",
    "A cheap adapter under load can sag well below 5 volts and cause resets.",
    "5 volts goes to the board's 5V pin, never to a 3.3V pin.",
    "Never open a wall adapter. There are mains voltages inside."
  ],
  useItFor: "Any project that lives on a desk, and any portable project where a power bank in the enclosure is acceptable.",
  links: [
    { label: "USB power basics", url: "https://learn.sparkfun.com/tutorials/how-to-power-a-project", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A wall adapter and a small power bank together, ratings readable.",
    detail: null,
    detailNeed: "Not needed."
  }
},

{
  slug: "power-module",
  name: "Breadboard Power Supply Module",
  shortName: "Power Module",
  category: "power",
  alsoCalled: ["MB102 power module", "breadboard PSU", "rail supply"],
  blurb: "Clips onto the breadboard rails and feeds them 3.3V or 5V, your choice.",
  signal: ["Power"],
  difficulty: "Easy",
  voltage: "6V to 12V in, 3.3V or 5V out",
  whatItIs: [
    "A small board that pushes straight into the power rails at the end of a breadboard and supplies them. Power comes in through the barrel jack from a wall adapter, and the module regulates it down.",
    "The two yellow jumpers are the point of it. Each one selects 3.3V, 5V, or OFF for its own rail, so the two rails can run at different voltages at the same time. That is genuinely useful when a 5V sensor and a 3.3V board share one breadboard.",
    "It matters because a microcontroller's own 3V3 pin can only supply so much. Once a build has a servo, a strip of LEDs or a motor in it, the board cannot feed everything and this module takes over."
  ],
  pins: [
    { name: "Barrel jack", type: "Power", note: "6V to 12V in from a wall adapter. Check the adapter's rating before plugging it in." },
    { name: "USB-A socket", type: "Power", note: "5 volts out, for powering something with a USB cable." },
    { name: "Yellow jumpers", type: "Select", note: "One per rail. Three positions: 3.3V, OFF, and 5V. Set them before applying power." },
    { name: "Rail pins", type: "Power", note: "The two rows of pins underneath that push into the breadboard's red and blue rails." },
    { name: "Power switch", type: "Control", note: "Cuts the output without unplugging the adapter." }
  ],
  wiring: [
    "Set both yellow jumpers first, while the power is off. Read which position is 3.3V and which is 5V from the silkscreen, since guessing here can put 5 volts into a 3.3V board.",
    "Push the module into the rails at the end of the breadboard. It only fits one way, and the plus and minus markings should line up with the red and blue rails.",
    "Plug the adapter into the barrel jack and switch it on. The green LED lights when the output is live.",
    "Measure both rails with a multimeter before connecting anything to them. It takes ten seconds and it is the only way to be certain which rail is at which voltage."
  ],
  goesWith: ["breadboard", "power-supply", "multimeter", "sg90-servo"],
  watchOut: [
    "A jumper on the wrong setting puts 5 volts onto a rail feeding a 3.3V board. Measure before you connect, every time.",
    "Do not feed the rails from this module and from the microcontroller's own 3V3 pin at the same time. Two supplies fighting over one rail is a good way to damage both.",
    "It still needs its ground shared with everything else in the circuit.",
    "The regulator gets warm under load and has no heatsink. If it is too hot to touch, the build is drawing more than it can give."
  ],
  useItFor: "Any build that outgrows what the microcontroller's own pins can supply, and any breadboard that needs 3.3V and 5V on its two rails at once.",
  links: [
    { label: "How to power a project", url: "https://learn.sparkfun.com/tutorials/how-to-power-a-project", kind: "Guide", vpn: false }
  ],
  media: {
    image: {
      src: "media/power.webp",
      alt: "A breadboard power supply module on a dark circuit board, with a black barrel jack and a USB-A socket, a green power LED, a white switch, and a yellow jumper at each end selecting 3.3V, OFF or 5V.",
      caption: "One yellow jumper per rail, each with 3.3V, OFF and 5V positions. Set both before the power goes on, then check the rails with a meter."
    },
    imageNeed: "Done.",
    detail: null,
    detailNeed: "Close on one yellow jumper with the 3.3V, OFF and 5V silkscreen positions readable, so the setting can be checked at a glance."
  }
},

{
  slug: "battery-holder",
  name: "AA and AAA Battery Holder",
  shortName: "Battery Holder",
  category: "power",
  alsoCalled: ["Battery box", "cell holder"],
  blurb: "Cheap portable power. Four AA cells give about six volts, so plan a regulator.",
  signal: ["Power"],
  difficulty: "Easy",
  voltage: "1.5V per cell",
  whatItIs: [
    "A plastic box with sprung contacts that holds ordinary batteries and brings two wires out, red for positive and black for negative.",
    "Each alkaline cell gives about 1.5 volts, and cells in series add up. Three cells give 4.5 volts, four give 6.",
    "Where those volts go depends on the number. Four cells into a board's 5V pin is too much. Into a proper regulator, it is fine."
  ],
  pins: [
    { name: "Red wire", type: "Power", note: "Positive. To the board's power input, through a switch and ideally a regulator." },
    { name: "Black wire", type: "Ground", note: "Negative. To ground." }
  ],
  wiring: [
    "Count the cells and work out the voltage before connecting anything. Three alkaline cells at 4.5 volts is roughly safe for a 5V input. Four at 6 volts is not.",
    "Put a switch in the red wire so the product can be turned off.",
    "Put a diode in the red wire as well if a user could ever fit the cells backwards.",
    "Share the ground with everything else in the circuit."
  ],
  goesWith: ["toggle-switch", "diode", "lipo-charger", "multimeter"],
  watchOut: [
    "Batteries fitted backwards send reverse voltage into the board. A diode prevents this and costs almost nothing.",
    "Rechargeable NiMH cells give 1.2 volts each, not 1.5. Four of them come to 4.8, not 6.",
    "The thin wires break at the box where they flex. Add a strain relief.",
    "Never charge a non rechargeable cell, and never leave batteries in a project stored over a holiday. They leak."
  ],
  useItFor: "A portable product where the user replaces the batteries themselves, and any build where a rechargeable pack would be more risk than it is worth.",
  links: [
    { label: "How to power a project", url: "https://learn.sparkfun.com/tutorials/how-to-power-a-project", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Holders for two, three and four cells together, wires visible.",
    detail: null,
    detailNeed: "Not needed."
  }
},

{
  slug: "lipo-charger",
  name: "TP4056 LiPo Charger Module",
  shortName: "TP4056",
  category: "power",
  alsoCalled: ["LiPo charger", "18650 charger board", "TP4056 with protection"],
  blurb: "Charges a lithium cell over USB. Buy the version with protection, always.",
  signal: ["Power"],
  difficulty: "Tricky",
  voltage: "5V in, 4.2V out to the cell",
  whatItIs: [
    "A small red board with a USB socket that safely charges a single lithium cell and lets your circuit run from that cell.",
    "Two versions exist and they look almost the same. One has a protection chip that cuts the cell off if it goes too flat, too full, or draws too much. The other does not.",
    "Only use the protected version. An unprotected lithium cell run flat or shorted is a genuine fire risk, not a theoretical one."
  ],
  pins: [
    { name: "B+ and B-", type: "Battery", note: "To the cell. B+ to the positive terminal, B- to the negative." },
    { name: "OUT+ and OUT-", type: "Power", note: "To your circuit. On a protected board this output is the safe one to use." },
    { name: "USB socket", type: "Power", note: "5 volts in, for charging." }
  ],
  wiring: [
    "Confirm you have the protected version. It has a second small chip and two tiny transistors near the battery terminals.",
    "Cell to B+ and B-. Get this the right way round, and check with a multimeter before soldering.",
    "Your circuit to OUT+ and OUT-, not to the battery terminals directly. The protection only works on the output.",
    "Note that a lithium cell gives 3.7 volts nominal and up to 4.2 when full. That is above 3.3, so a board expecting 3.3V still needs its regulator in the path."
  ],
  goesWith: ["battery-holder", "power-supply", "multimeter", "soldering-iron"],
  watchOut: [
    "Lithium cells connected backwards, punctured, or run completely flat can catch fire. Treat them with more care than anything else in this catalogue.",
    "The unprotected board looks nearly identical to the protected one. Check before you buy and again before you build.",
    "Wiring your circuit to B+ and B- instead of OUT+ and OUT- bypasses all the protection.",
    "Never charge a cell unattended, and never store a damaged or swollen cell in the classroom."
  ],
  useItFor: "A rechargeable product that charges over USB, where a battery compartment would spoil the design.",
  links: [
    { label: "Lithium battery safety", url: "https://learn.adafruit.com/li-ion-and-lipoly-batteries", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "A protected and an unprotected TP4056 board side by side, close enough to spot the extra chip.",
    detail: null,
    detailNeed: "The protection chip and transistors circled on the photo, so the difference is unmistakable."
  }
},

/* ═══ WORKSHOP TOOLS ═══════════════════════════════════════════════ */

{
  slug: "multimeter",
  name: "Digital Multimeter",
  shortName: "Multimeter",
  category: "tools",
  alsoCalled: ["DMM", "meter", "tester"],
  blurb: "The only way to see what a circuit is actually doing. Learn continuity first.",
  signal: ["No signal"],
  difficulty: "Easy",
  voltage: "Measures, does not supply",
  whatItIs: [
    "A meter with two probes that measures voltage, resistance and current, and tests whether two points are connected.",
    "Continuity mode is the one to learn first. Touch both probes to two points and the meter beeps if they are joined. That single feature finds broken jumper wires, solder bridges, and which breadboard holes are connected.",
    "Voltage mode is next. Black probe on ground, red probe on the point of interest, and you read what that point actually sits at rather than what you assumed."
  ],
  pins: [
    { name: "COM socket", type: "Ground", note: "The black probe lives here, always." },
    { name: "VΩmA socket", type: "Measure", note: "The red probe, for voltage, resistance and small currents." },
    { name: "10A socket", type: "Measure", note: "The red probe moves here for large currents only. Usually unfused, so be careful." }
  ],
  wiring: [
    "Black probe in COM, red probe in the voltage socket. Leave them there unless you are measuring high current.",
    "For continuity, put the dial on the sound symbol and touch the probes together. It should beep.",
    "For voltage, put the dial on DC volts, black probe on the circuit's ground, red probe on the point you want to know about.",
    "For resistance, take the part out of the circuit first. Measured in place, the rest of the circuit reads along with it."
  ],
  goesWith: ["resistor", "jumper-wires", "breadboard", "crocodile-clips"],
  watchOut: [
    "Measuring current means breaking the circuit and putting the meter in the gap. Putting the meter across a supply on a current setting shorts it and blows the fuse.",
    "Resistance measured in a live circuit is meaningless. Power off and lift one leg.",
    "The probes are sharp and slip. Two probes touching neighbouring pins shorts them.",
    "A meter left on a current range in a drawer is a blown fuse waiting to happen."
  ],
  useItFor: "Every time something does not work. Check power, check ground, check continuity, and only then start reading the code.",
  links: [
    { label: "SparkFun, how to use a multimeter", url: "https://learn.sparkfun.com/tutorials/how-to-use-a-multimeter", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "The classroom meter with its dial visible, probes in the correct sockets.",
    detail: null,
    detailNeed: "The dial with the continuity and DC voltage positions marked on the photo."
  }
},

{
  slug: "soldering-iron",
  name: "Soldering Iron",
  shortName: "Soldering Iron",
  category: "tools",
  alsoCalled: ["Iron", "soldering station"],
  blurb: "Heat the joint, not the solder. Everything else follows from that.",
  signal: ["No signal"],
  difficulty: "Moderate",
  voltage: "Mains powered",
  whatItIs: [
    "A heated tip that melts solder so two pieces of metal join both electrically and mechanically.",
    "The rule that fixes most beginner problems: heat the joint, then feed the solder into the joint. Melting solder on the tip and dabbing it on gives a joint that looks fine and is not connected.",
    "Around 350 degrees is right for this work. Cooler and joints do not flow, hotter and pads lift off the board."
  ],
  pins: [
    { name: "Tip", type: "Hot", note: "350 degrees. It looks exactly the same hot or cold." },
    { name: "Sponge or brass wool", type: "Clean", note: "Wipe the tip on it before every joint. A dirty tip does not transfer heat." }
  ],
  wiring: [
    "Let it reach temperature fully, then tin the tip with a little solder.",
    "Hold the tip against both the pad and the leg for a second or two, so both get hot.",
    "Feed solder into the joint, not onto the tip. It should flow and form a small shiny cone.",
    "Take the solder away, then the iron, and hold everything still until it sets. Moving it while it cools gives a dull, cracked joint."
  ],
  goesWith: ["header-pins", "perfboard", "multimeter", "xiao-samd21"],
  watchOut: [
    "The tip looks identical hot and cold. It goes back in the stand every single time you put it down.",
    "Solder fumes are flux, not lead, and they still should not be breathed. Work in a ventilated space.",
    "Wash your hands afterwards if the solder contains lead.",
    "Holding the iron on a pad too long lifts the copper off the board, and that damage cannot be repaired in a classroom."
  ],
  useItFor: "Headers onto bare boards, wires onto modules, and the final perfboard build. Practise on scrap before touching a board that matters.",
  links: [
    { label: "Adafruit, guide to excellent soldering", url: "https://learn.adafruit.com/adafruit-guide-excellent-soldering", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "The classroom iron in its stand with solder and brass wool beside it.",
    detail: null,
    detailNeed: "A good joint and a cold joint side by side under magnification, both labelled."
  }
},

{
  slug: "wire-strippers",
  name: "Wire Strippers and Side Cutters",
  shortName: "Strippers",
  category: "tools",
  alsoCalled: ["Snips", "flush cutters", "wire cutters"],
  blurb: "Take the insulation off without cutting the copper. Use the right notch.",
  signal: ["No signal"],
  difficulty: "Easy",
  voltage: "Not applicable",
  whatItIs: [
    "Strippers have notches sized for different wire gauges. Put the wire in the matching notch, squeeze, and pull the insulation off with the copper intact.",
    "Side cutters trim legs and cut wire. The flush cutting ones leave a clean end and are the ones you want for component legs on a board.",
    "Using the wrong notch nicks the copper. The wire then looks fine and snaps the first time it is bent."
  ],
  pins: [
    { name: "Stripper notches", type: "Sized", note: "Marked with a gauge number. Use the one that matches the wire, or the next size up." },
    { name: "Cutting jaws", type: "Cut", note: "For wire and component legs only. Never for anything hardened." }
  ],
  wiring: [
    "Match the notch to the wire. If unsure, start too large and work down.",
    "Strip about five millimetres, enough for the joint and no more.",
    "Twist stranded wire between your fingers before soldering so no strand escapes.",
    "Hold the offcut when trimming a leg, or it flies across the room. Wear eye protection."
  ],
  goesWith: ["soldering-iron", "jumper-wires", "perfboard"],
  watchOut: [
    "A nicked wire fails later, usually inside a finished product where you cannot get at it.",
    "Cutting steel or hardened wire with electronics side cutters ruins them permanently.",
    "Trimmed legs fly. This is the most likely eye injury in the room.",
    "Stripping too much bare wire leaves conductor exposed next to the joint, waiting to short against something."
  ],
  useItFor: "Every wire you prepare and every leg you trim. Nothing exotic, and the tools that get abused the most.",
  links: [
    { label: "Working with wire", url: "https://learn.sparkfun.com/tutorials/working-with-wire", kind: "Guide", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Strippers and flush cutters together, the gauge markings on the strippers readable.",
    detail: null,
    detailNeed: "Not needed."
  }
}

];
