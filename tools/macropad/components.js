// -- Component library ---------------------------------------------
// Each entry defines a hardware component's full spec.

const COMPONENT_LIBRARY = {

  button: {
    id: 'button',
    name: 'Push Button',
    shortName: 'Button',
    icon: '&#11036;',
    color: '#58a6ff',
    maxInstances: 12,
    libraries: [],
    description: 'Tactile push button. One leg to GPIO, other to GND. Internal pull-up used in firmware.',
    pinGroups: [
      { id: 'sig', label: 'Signal', type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'gnd', label: 'GND',    type: 'gnd',  required: true, fixed: true,  wireClass: 'wire-gnd',  fixedPin: 'GND_L' },
    ],
    passives: [],
    configSchema: {
      label:          { type: 'text',   label: 'Button label', default: 'My Button' },
      action_type:    { type: 'select', label: 'Action',
        options: ['hotkey','actions','launch','type','mode_toggle','config_toggle'],
        optionLabels:  ['Hotkey','Actions','Launch App','Type Text','Mode Toggle','Config Toggle'],
        default: 'hotkey' },
      key1:  { type: 'keyselect', label: 'Key 1', default: '', dependsOn: { action_type: ['hotkey'] } },
      key2:  { type: 'keyselect', label: 'Key 2', default: '', dependsOn: { action_type: ['hotkey'] } },
      key3:  { type: 'keyselect', label: 'Key 3', default: '', dependsOn: { action_type: ['hotkey'] } },
      auto_translate: { type: 'checkbox', label: 'Auto ctrl<->cmd on config switch', default: true, dependsOn: { action_type: ['hotkey'] } },
      consumer_action: { type: 'select', label: 'Action',
        options: ['MUTE','VOLUME_INCREMENT','VOLUME_DECREMENT','PLAY_PAUSE','SCAN_NEXT_TRACK','SCAN_PREVIOUS_TRACK','BRIGHTNESS_INCREMENT','BRIGHTNESS_DECREMENT'],
        optionLabels: ['Mute','Volume Up','Volume Down','Play / Pause','Next Track','Previous Track','Brightness Up','Brightness Down'],
        default: 'MUTE', dependsOn: { action_type: ['actions'] } },
      launch_os: { type: 'os_select', label: 'OS', default: 'windows', dependsOn: { action_type: ['launch'] } },
      program:   { type: 'launch_app', label: 'Program / app', default: '', dependsOn: { action_type: ['launch'] } },
      type_text: { type: 'text', label: 'Text to type', default: '', dependsOn: { action_type: ['type'] } },
      // Config 2
      has_config2:     { type: 'checkbox', label: 'Enable Config 2 for this button', default: false },
      action_type2:    { type: 'select', label: 'Action (Config 2)',
        options: ['hotkey','actions','launch','type','mode_toggle','config_toggle'],
        optionLabels:  ['Hotkey','Actions','Launch App','Type Text','Mode Toggle','Config Toggle'],
        default: 'hotkey', dependsOn: { has_config2: [true] } },
      key1_2:  { type: 'keyselect', label: 'Key 1', default: '', dependsOn: { has_config2: [true], action_type2: ['hotkey'] } },
      key2_2:  { type: 'keyselect', label: 'Key 2', default: '', dependsOn: { has_config2: [true], action_type2: ['hotkey'] } },
      key3_2:  { type: 'keyselect', label: 'Key 3', default: '', dependsOn: { has_config2: [true], action_type2: ['hotkey'] } },
      consumer_action2: { type: 'select', label: 'Action',
        options: ['MUTE','VOLUME_INCREMENT','VOLUME_DECREMENT','PLAY_PAUSE','SCAN_NEXT_TRACK','SCAN_PREVIOUS_TRACK','BRIGHTNESS_INCREMENT','BRIGHTNESS_DECREMENT'],
        optionLabels: ['Mute','Volume Up','Volume Down','Play / Pause','Next Track','Previous Track','Brightness Up','Brightness Down'],
        default: 'MUTE', dependsOn: { has_config2: [true], action_type2: ['actions'] } },
      launch_os2: { type: 'os_select', label: 'OS', default: 'windows', dependsOn: { has_config2: [true], action_type2: ['launch'] } },
      program2:   { type: 'launch_app', label: 'Program / app', default: '', dependsOn: { has_config2: [true], action_type2: ['launch'] } },
      type_text2: { type: 'text', label: 'Text to type', default: '', dependsOn: { has_config2: [true], action_type2: ['type'] } },
    }
  },

  ky040: {
    id: 'ky040',
    name: 'KY-040 Encoder',
    shortName: 'KY-040',
    icon: '&#127899;',
    color: '#c87941',
    maxInstances: 2,
    libraries: [],
    description: 'KY-040 rotary encoder. CLK/DT/SW need 10k&#937; pull-up resistors to 3V3 (often built into the module board). Encoder press cycles speed in Scroll/Zoom modes.',
    pinGroups: [
      { id: 'clk', label: 'CLK', type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'dt',  label: 'DT',  type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'sw',  label: 'SW',  type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'vcc', label: '+',   type: 'power',required: true, fixed: true,  wireClass: 'wire-power', fixedPin: '3V3_A' },
      { id: 'gnd', label: 'GND', type: 'gnd',  required: true, fixed: true,  wireClass: 'wire-gnd',   fixedPin: 'GND_L' }
    ],
    passives: [
      { on: ['clk','dt','sw'], type: 'resistor', value: '10k&#937;', note: 'Pull-up to 3V3. Many KY-040 modules include these on the PCB  --  check for SMD resistors near the pins before adding external ones.' }
    ],
    configSchema: {
      mode_name:  { type: 'text',   label: 'Mode name',     default: 'Volume' },
      cw_type:    { type: 'select', label: 'CW action',     options: ['consumer','hotkey','mouse_scroll'], default: 'consumer' },
      cw_consumer:{ type: 'select', label: 'CW media key',  options: ['VOLUME_INCREMENT','VOLUME_DECREMENT','SCAN_NEXT_TRACK','SCAN_PREVIOUS_TRACK','BRIGHTNESS_INCREMENT'], default: 'VOLUME_INCREMENT', dependsOn: { cw_type: ['consumer'] } },
      cw_keys:    { type: 'text',   label: 'CW keys (csv)', default: 'ctrl,=', dependsOn: { cw_type: ['hotkey'] } },
      ccw_type:   { type: 'select', label: 'CCW action',    options: ['consumer','hotkey','mouse_scroll'], default: 'consumer' },
      ccw_consumer:{ type: 'select',label: 'CCW media key', options: ['VOLUME_DECREMENT','VOLUME_INCREMENT','SCAN_PREVIOUS_TRACK','SCAN_NEXT_TRACK','BRIGHTNESS_DECREMENT'], default: 'VOLUME_DECREMENT', dependsOn: { ccw_type: ['consumer'] } },
      ccw_keys:   { type: 'text',   label: 'CCW keys (csv)',default: 'ctrl,-', dependsOn: { ccw_type: ['hotkey'] } },
      press_action:{ type: 'select',label: 'Press action',  options: ['consumer','hotkey','none'], default: 'consumer' },
      press_consumer:{ type: 'select', label: 'Press key',  options: ['MUTE','PLAY_PAUSE','SCAN_NEXT_TRACK'], default: 'MUTE', dependsOn: { press_action: ['consumer'] } },
      press_keys: { type: 'text',   label: 'Press keys',    default: 'ctrl,0', dependsOn: { press_action: ['hotkey'] } },
    }
  },

  hw040: {
    id: 'hw040',
    name: 'HW-040 Encoder',
    shortName: 'HW-040',
    icon: '&#127899;',
    color: '#c87941',
    maxInstances: 2,
    libraries: [],
    description: 'HW-040 rotary encoder. Functionally identical to KY-040. Same wiring. Some variants have the SW pin labeled differently  --  check your board.',
    pinGroups: [
      { id: 'clk', label: 'CLK', type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'dt',  label: 'DT',  type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'sw',  label: 'SW',  type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'vcc', label: '+',   type: 'power',required: true, fixed: true,  wireClass: 'wire-power', fixedPin: '3V3_A' },
      { id: 'gnd', label: 'GND', type: 'gnd',  required: true, fixed: true,  wireClass: 'wire-gnd',   fixedPin: 'GND_L' }
    ],
    passives: [
      { on: ['clk','dt','sw'], type: 'resistor', value: '10k&#937;', note: 'Pull-up resistors to 3V3. Check your module for built-in resistors.' }
    ],
    configSchema: {
      mode_name: { type: 'text', label: 'Mode name', default: 'Scroll' },
      cw_type:   { type: 'select', label: 'CW action', options: ['mouse_scroll','consumer','hotkey'], default: 'mouse_scroll' },
      ccw_type:  { type: 'select', label: 'CCW action',options: ['mouse_scroll','consumer','hotkey'], default: 'mouse_scroll' },
      press_action:{ type: 'select',label: 'Press action', options: ['consumer','hotkey','none'], default: 'none' },
    }
  },

  ssd1306_i2c: {
    id: 'ssd1306_i2c',
    name: 'SSD1306 OLED (I2C)',
    shortName: 'OLED 0.96"',
    icon: '&#128421;',
    color: '#3fb950',
    maxInstances: 2,
    libraries: ['adafruit_ssd1306', 'adafruit_framebuf', 'adafruit_bus_device'],
    description: '0.96" 128&#215;64 OLED, I2C interface (4-pin). Default I2C address 0x3C. Second instance must use 0x3D (check module for address solder bridge). Requires font5x8.bin in CIRCUITPY root.',
    pinGroups: [
      { id: 'sda', label: 'SDA', type: 'i2c_sda', required: true, fixed: false, wireClass: 'wire-i2c-sda', preferred: 'GPIO8' },
      { id: 'scl', label: 'SCL/SCK', type: 'i2c_scl', required: true, fixed: false, wireClass: 'wire-i2c-scl', preferred: 'GPIO9' },
      { id: 'vcc', label: 'VCC', type: 'power', required: true, fixed: true, wireClass: 'wire-power', fixedPin: '3V3_A' },
      { id: 'gnd', label: 'GND', type: 'gnd',   required: true, fixed: true, wireClass: 'wire-gnd',   fixedPin: 'GND_L' }
    ],
    passives: [],
    extraFiles: ['font5x8.bin'],
    configSchema: {
      i2c_address: { type: 'select', label: 'I2C address', options: ['0x3C','0x3D'], default: '0x3C' },
      display_mode: { type: 'select', label: 'Default display', options: ['idle_status','volume_bar','macro_label','custom_text'], default: 'idle_status' },
      custom_text:  { type: 'text', label: 'Custom text', default: 'MacroPad', dependsOn: { display_mode: ['custom_text'] } }
    }
  },

  ssd1306_spi: {
    id: 'ssd1306_spi',
    name: 'SSD1306 OLED (SPI)',
    shortName: 'OLED SPI',
    icon: '&#128421;',
    color: '#3fb950',
    maxInstances: 1,
    libraries: ['adafruit_ssd1306', 'adafruit_framebuf', 'adafruit_bus_device'],
    description: '0.96" SSD1306 OLED, SPI interface (7-pin). Faster than I2C but uses more GPIO pins. Wire: MOSI->MOSI, SCK->SCK, CS->any GPIO, DC->any GPIO, RST->any GPIO.',
    pinGroups: [
      { id: 'mosi', label: 'MOSI/SDA', type: 'spi', required: true, fixed: false, wireClass: 'wire-spi', preferred: 'GPIO35' },
      { id: 'sck',  label: 'SCK/CLK',  type: 'spi', required: true, fixed: false, wireClass: 'wire-spi', preferred: 'GPIO36' },
      { id: 'cs',   label: 'CS',        type: 'gpio',required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'dc',   label: 'DC',        type: 'gpio',required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'rst',  label: 'RST',       type: 'gpio',required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'vcc',  label: 'VCC',       type: 'power',required: true, fixed: true, wireClass: 'wire-power', fixedPin: '3V3_A' },
      { id: 'gnd',  label: 'GND',       type: 'gnd', required: true, fixed: true, wireClass: 'wire-gnd',   fixedPin: 'GND_L' }
    ],
    passives: [],
    extraFiles: ['font5x8.bin'],
    configSchema: {
      display_mode: { type: 'select', label: 'Default display', options: ['idle_status','volume_bar','macro_label','custom_text'], default: 'idle_status' },
    }
  },

  sh1106: {
    id: 'sh1106',
    name: 'SH1106 OLED 1.3"',
    shortName: 'OLED 1.3"',
    icon: '&#128421;',
    color: '#3fb950',
    maxInstances: 2,
    libraries: ['adafruit_displayio_sh1106', 'adafruit_display_text', 'adafruit_bus_device'],
    description: '1.3" 128&#215;64 OLED using SH1106 driver. Uses I2C same as SSD1306 but different library. Default address 0x3C. Note: uses displayio rather than framebuf.',
    pinGroups: [
      { id: 'sda', label: 'SDA', type: 'i2c_sda', required: true, fixed: false, wireClass: 'wire-i2c-sda', preferred: 'GPIO8' },
      { id: 'scl', label: 'SCL', type: 'i2c_scl', required: true, fixed: false, wireClass: 'wire-i2c-scl', preferred: 'GPIO9' },
      { id: 'vcc', label: 'VCC', type: 'power', required: true, fixed: true, wireClass: 'wire-power', fixedPin: '3V3_A' },
      { id: 'gnd', label: 'GND', type: 'gnd',   required: true, fixed: true, wireClass: 'wire-gnd',   fixedPin: 'GND_L' }
    ],
    passives: [],
    configSchema: {
      i2c_address:  { type: 'select', label: 'I2C address', options: ['0x3C','0x3D'], default: '0x3C' },
      display_mode: { type: 'select', label: 'Default display', options: ['idle_status','volume_bar','macro_label'], default: 'idle_status' },
    }
  },

  ssd1309: {
    id: 'ssd1309',
    name: 'SSD1309 OLED 1.54"',
    shortName: 'OLED 1.54"',
    icon: '&#128421;',
    color: '#3fb950',
    maxInstances: 1,
    libraries: ['adafruit_ssd1306', 'adafruit_framebuf', 'adafruit_bus_device'],
    description: '1.54" 128&#215;64 OLED with SSD1309 driver. Compatible with SSD1306 library. Supports both I2C and SPI  --  select interface mode below.',
    pinGroups: [
      { id: 'sda', label: 'SDA', type: 'i2c_sda', required: true, fixed: false, wireClass: 'wire-i2c-sda', preferred: 'GPIO8' },
      { id: 'scl', label: 'SCL', type: 'i2c_scl', required: true, fixed: false, wireClass: 'wire-i2c-scl', preferred: 'GPIO9' },
      { id: 'vcc', label: 'VCC', type: 'power', required: true, fixed: true, wireClass: 'wire-power', fixedPin: '3V3_A' },
      { id: 'gnd', label: 'GND', type: 'gnd',   required: true, fixed: true, wireClass: 'wire-gnd',   fixedPin: 'GND_L' }
    ],
    passives: [],
    extraFiles: ['font5x8.bin'],
    configSchema: {
      i2c_address:  { type: 'select', label: 'I2C address', options: ['0x3C','0x3D'], default: '0x3C' },
      display_mode: { type: 'select', label: 'Default display', options: ['idle_status','volume_bar','macro_label'], default: 'idle_status' },
    }
  },

  ps2_joystick: {
    id: 'ps2_joystick',
    name: 'PS2 Joystick',
    shortName: 'Joystick',
    icon: '&#128377;',
    color: '#bc8cff',
    maxInstances: 2,
    libraries: [],
    description: 'PS2-style analog joystick. VRX and VRY are analog (use ADC-capable pins). SW is the press button (digital). Move the joystick to control mouse, scroll, or custom actions.',
    pinGroups: [
      { id: 'vrx', label: 'VRX', type: 'analog', required: true, fixed: false, wireClass: 'wire-analog' },
      { id: 'vry', label: 'VRY', type: 'analog', required: true, fixed: false, wireClass: 'wire-analog' },
      { id: 'sw',  label: 'SW',  type: 'gpio',   required: true, fixed: false, wireClass: 'wire-data' },
      { id: 'vcc', label: 'VCC', type: 'power',  required: true, fixed: true,  wireClass: 'wire-power', fixedPin: '3V3_A' },
      { id: 'gnd', label: 'GND', type: 'gnd',    required: true, fixed: true,  wireClass: 'wire-gnd',   fixedPin: 'GND_L' }
    ],
    passives: [],
    configSchema: {
      mode:        { type: 'select', label: 'Joystick mode', options: ['mouse','scroll','custom'], default: 'mouse' },
      deadzone:    { type: 'range',  label: 'Deadzone',      min: 0, max: 20000, step: 500, default: 3000 },
      sensitivity: { type: 'range',  label: 'Sensitivity',   min: 1, max: 20,    step: 1,   default: 5 },
      invert_x:    { type: 'checkbox', label: 'Invert X axis', default: false },
      invert_y:    { type: 'checkbox', label: 'Invert Y axis', default: false },
      sw_action:   { type: 'select', label: 'Press action', options: ['mouse_click','hotkey','consumer','none'], default: 'mouse_click' },
    }
  },

  hw371: {
    id: 'hw371',
    name: 'HW-371 Slide Pot',
    shortName: 'Slide Pot',
    icon: '&#10710;',
    color: '#d29922',
    maxInstances: 4,
    libraries: [],
    description: 'HW-371 45mm slide potentiometer. Has 5 pins: OTA and OTB are the two ends of the resistive track (connect one to VCC, one to GND  --  the labelled VCC/GND pins handle this). The middle wiper pin (OUT) is the analog output you read. Only 3 connections matter: VCC, GND, and OUT to an ADC-capable GPIO.',
    pinGroups: [
      { id: 'out', label: 'OUT/WIPER', type: 'analog', required: true, fixed: false, wireClass: 'wire-analog' },
      { id: 'vcc', label: 'VCC',       type: 'power',  required: true, fixed: true,  wireClass: 'wire-power', fixedPin: '3V3_A' },
      { id: 'gnd', label: 'GND',       type: 'gnd',    required: true, fixed: true,  wireClass: 'wire-gnd',   fixedPin: 'GND_L' }
    ],
    passives: [
      { on: ['out'], type: 'capacitor', value: '100nF', note: 'Optional 100nF decoupling capacitor from wiper to GND reduces ADC noise. Recommended if you see jittery readings.' }
    ],
    configSchema: {
      label:    { type: 'text',   label: 'Label',    default: 'Slider' },
      function: { type: 'select', label: 'Controls', options: ['volume','scroll_speed','zoom_speed','brightness'], default: 'volume' },
      inverted: { type: 'checkbox', label: 'Invert direction', default: false },
    }
  },

  slide_pot_long: {
    id: 'slide_pot_long',
    name: 'B10K Slide Pot 75mm',
    shortName: 'Slide 75mm',
    icon: '&#10710;',
    color: '#d29922',
    maxInstances: 4,
    libraries: [],
    description: '75mm B10K linear slide potentiometer (longer travel than HW-371). Identical wiring. The longer throw gives finer control for volume or speed.',
    pinGroups: [
      { id: 'out', label: 'OUT/WIPER', type: 'analog', required: true, fixed: false, wireClass: 'wire-analog' },
      { id: 'vcc', label: 'VCC',       type: 'power',  required: true, fixed: true,  wireClass: 'wire-power', fixedPin: '3V3_A' },
      { id: 'gnd', label: 'GND',       type: 'gnd',    required: true, fixed: true,  wireClass: 'wire-gnd',   fixedPin: 'GND_L' }
    ],
    passives: [
      { on: ['out'], type: 'capacitor', value: '100nF', note: 'Optional 100nF decoupling cap on wiper to GND.' }
    ],
    configSchema: {
      label:    { type: 'text',   label: 'Label',    default: 'Fader' },
      function: { type: 'select', label: 'Controls', options: ['volume','scroll_speed','zoom_speed','brightness'], default: 'volume' },
      inverted: { type: 'checkbox', label: 'Invert direction', default: false },
    }
  }

};

// ESP32-S3 N16R8 GPIO pin map
// Physical layout with USB-C at the bottom.
// Left side top->bottom: 3V3 3V3 RST 4 5 6 7 15 16 17 18 8 3 46 9 10 11 12 13 14 5VIN GND
// Right side top->bottom: GND TX RX 1 2 42 41 40 39 38 37 36 35 0 45 48 47 21 20 19 GND GND
const ESP32S3_PINS = [
  // Left side (top to bottom)
  { id: '3V3_A',  label: '3V3',    side: 'left',  types: ['power'],                    note: '3.3V power output' },
  { id: '3V3_B',  label: '3V3',    side: 'left',  types: ['power'],                    note: '3.3V power output (second pin)' },
  { id: 'RST',    label: 'RST',    side: 'left',  types: ['gpio'],                     note: 'Reset pin -- avoid for GPIO use' },
  { id: 'GPIO4',  label: 'GPIO4',  side: 'left',  types: ['gpio','analog'],            note: 'ADC1_CH3' },
  { id: 'GPIO5',  label: 'GPIO5',  side: 'left',  types: ['gpio','analog'],            note: 'ADC1_CH4' },
  { id: 'GPIO6',  label: 'GPIO6',  side: 'left',  types: ['gpio','analog'],            note: 'ADC1_CH5' },
  { id: 'GPIO7',  label: 'GPIO7',  side: 'left',  types: ['gpio','analog'],            note: 'ADC1_CH6' },
  { id: 'GPIO15', label: 'GPIO15', side: 'left',  types: ['gpio','analog'],            note: 'ADC2_CH4' },
  { id: 'GPIO16', label: 'GPIO16', side: 'left',  types: ['gpio','analog'],            note: 'ADC2_CH5' },
  { id: 'GPIO17', label: 'GPIO17', side: 'left',  types: ['gpio','analog'],            note: 'ADC2_CH6' },
  { id: 'GPIO18', label: 'GPIO18', side: 'left',  types: ['gpio','analog'],            note: 'ADC2_CH7' },
  { id: 'GPIO8',  label: 'GPIO8',  side: 'left',  types: ['gpio','i2c_sda'],           note: 'Default I2C SDA' },
  { id: 'GPIO3',  label: 'GPIO3',  side: 'left',  types: ['gpio','analog'],            note: 'ADC1_CH2' },
  { id: 'GPIO46', label: 'GPIO46', side: 'left',  types: ['gpio'],                     note: 'Input only on some variants -- check datasheet' },
  { id: 'GPIO9',  label: 'GPIO9',  side: 'left',  types: ['gpio','i2c_scl'],           note: 'Default I2C SCL' },
  { id: 'GPIO10', label: 'GPIO10', side: 'left',  types: ['gpio'],                     note: 'General GPIO' },
  { id: 'GPIO11', label: 'GPIO11', side: 'left',  types: ['gpio','spi'],               note: 'SPI MOSI' },
  { id: 'GPIO12', label: 'GPIO12', side: 'left',  types: ['gpio','spi'],               note: 'SPI SCK' },
  { id: 'GPIO13', label: 'GPIO13', side: 'left',  types: ['gpio','spi'],               note: 'SPI MISO' },
  { id: 'GPIO14', label: 'GPIO14', side: 'left',  types: ['gpio','spi'],               note: 'SPI CS' },
  { id: '5VIN',   label: '5VIN',   side: 'left',  types: ['power'],                    note: '5V input -- USB passthrough when connected' },
  { id: 'GND_L',  label: 'GND',    side: 'left',  types: ['gnd'],                      note: 'Ground' },
  // Right side (top to bottom)
  { id: 'GND_R1', label: 'GND',    side: 'right', types: ['gnd'],                      note: 'Ground' },
  { id: 'GPIO43', label: 'TX',     side: 'right', types: ['gpio'],                     note: 'UART TX (GPIO43) -- avoid unless needed' },
  { id: 'GPIO44', label: 'RX',     side: 'right', types: ['gpio'],                     note: 'UART RX (GPIO44) -- avoid unless needed' },
  { id: 'GPIO1',  label: 'GPIO1',  side: 'right', types: ['gpio','analog'],            note: 'ADC1_CH0' },
  { id: 'GPIO2',  label: 'GPIO2',  side: 'right', types: ['gpio','analog'],            note: 'ADC1_CH1' },
  { id: 'GPIO42', label: 'GPIO42', side: 'right', types: ['gpio'],                     note: 'General GPIO' },
  { id: 'GPIO41', label: 'GPIO41', side: 'right', types: ['gpio'],                     note: 'General GPIO' },
  { id: 'GPIO40', label: 'GPIO40', side: 'right', types: ['gpio','analog'],            note: 'ADC1_CH9' },
  { id: 'GPIO39', label: 'GPIO39', side: 'right', types: ['gpio','analog'],            note: 'ADC1_CH8' },
  { id: 'GPIO38', label: 'GPIO38', side: 'right', types: ['gpio'],                     note: 'General GPIO' },
  { id: 'GPIO37', label: 'GPIO37', side: 'right', types: ['gpio','spi'],               note: 'SPI -- General GPIO' },
  { id: 'GPIO36', label: 'GPIO36', side: 'right', types: ['gpio','spi'],               note: 'SPI -- General GPIO' },
  { id: 'GPIO35', label: 'GPIO35', side: 'right', types: ['gpio','spi'],               note: 'SPI -- General GPIO' },
  { id: 'GPIO0',  label: 'GPIO0',  side: 'right', types: ['gpio'],                     note: 'Boot mode pin -- avoid if possible' },
  { id: 'GPIO45', label: 'GPIO45', side: 'right', types: ['gpio'],                     note: 'General GPIO' },
  { id: 'GPIO48', label: 'GPIO48', side: 'right', types: ['gpio'],                     note: 'General GPIO' },
  { id: 'GPIO47', label: 'GPIO47', side: 'right', types: ['gpio'],                     note: 'General GPIO' },
  { id: 'GPIO21', label: 'GPIO21', side: 'right', types: ['gpio'],                     note: 'General GPIO' },
  { id: 'GPIO20', label: 'GPIO20', side: 'right', types: ['gpio','analog'],            note: 'ADC2_CH9' },
  { id: 'GPIO19', label: 'GPIO19', side: 'right', types: ['gpio','analog'],            note: 'ADC2_CH8' },
  { id: 'GND_R2', label: 'GND',    side: 'right', types: ['gnd'],                      note: 'Ground' },
  { id: 'GND_R3', label: 'GND',    side: 'right', types: ['gnd'],                      note: 'Ground' },
];
// -- ESP32-C3 Super Mini (HW-466AB, confirmed from physical board) --
// USB-C at top. 8 pins per side, 16 total.
// Left top->bottom:  5V GND 3V3 GPIO4 GPIO3 GPIO2 GPIO1 GPIO0
// Right top->bottom: GPIO5 GPIO6 GPIO7 GPIO8 GPIO9 GPIO10 GPIO20 GPIO21
const ESP32C3_SUPERMINI_PINS = [
  { id: 'C3SM_5V',    label: '5V',    side: 'left',  types: ['power'],          note: '5V USB passthrough' },
  { id: 'C3SM_GND',   label: 'GND',   side: 'left',  types: ['gnd'],            note: 'Ground' },
  { id: 'C3SM_3V3',   label: '3V3',   side: 'left',  types: ['power'],          note: '3.3V output' },
  { id: 'GPIO4',      label: 'IO4',   side: 'left',  types: ['gpio','analog'],  note: 'ADC1_CH4, PWM' },
  { id: 'GPIO3',      label: 'IO3',   side: 'left',  types: ['gpio','analog'],  note: 'ADC1_CH3, PWM' },
  { id: 'GPIO2',      label: 'IO2',   side: 'left',  types: ['gpio','analog'],  note: 'ADC1_CH2, PWM. Strapping pin -- use with care.' },
  { id: 'GPIO1',      label: 'IO1',   side: 'left',  types: ['gpio','analog'],  note: 'ADC1_CH1' },
  { id: 'GPIO0',      label: 'IO0',   side: 'left',  types: ['gpio','analog'],  note: 'ADC1_CH0, PWM. Boot mode pin -- avoid if possible.' },
  { id: 'GPIO5',      label: 'IO5',   side: 'right', types: ['gpio'],           note: 'PWM' },
  { id: 'GPIO6',      label: 'IO6',   side: 'right', types: ['gpio'],           note: 'PWM' },
  { id: 'GPIO7',      label: 'IO7',   side: 'right', types: ['gpio'],           note: 'PWM' },
  { id: 'GPIO8',      label: 'IO8',   side: 'right', types: ['gpio','i2c_sda'], note: 'Onboard blue LED (active LOW). Strapping pin. Usable as SDA but LED flickers.' },
  { id: 'GPIO9',      label: 'IO9',   side: 'right', types: ['gpio','i2c_scl'], note: 'BOOT button. Strapping pin. Usable as SCL with care.' },
  { id: 'GPIO10',     label: 'IO10',  side: 'right', types: ['gpio','spi'],     note: 'SPI CS' },
  { id: 'GPIO20',     label: 'IO20',  side: 'right', types: ['gpio'],           note: 'UART RX' },
  { id: 'GPIO21',     label: 'IO21',  side: 'right', types: ['gpio'],           note: 'UART TX' },
];

// -- ESP32-C3 Dev Board (confirmed from physical board) -------------
// USB-C at bottom. 15 pins per side.
// Left top->bottom:  GND 3V3 3V3 GPIO2 GPIO3 GND RST GND GPIO0 GPIO1 GPIO10 GND 5V 5V GND
// Right top->bottom: GND TX RX GND GPIO9 RST GPIO8 GND GPIO7 PWR GPIO6 GPIO5 GPIO4 GND GPIO18 GPIO19 GND
const ESP32C3_DEVKIT_PINS = [
  { id: 'C3D_GND1',  label: 'GND',   side: 'left',  types: ['gnd'],            note: 'Ground' },
  { id: 'C3D_3V3A',  label: '3V3',   side: 'left',  types: ['power'],          note: '3.3V output' },
  { id: 'C3D_3V3B',  label: '3V3',   side: 'left',  types: ['power'],          note: '3.3V output (second pin)' },
  { id: 'GPIO2',     label: 'IO2',   side: 'left',  types: ['gpio','analog'],  note: 'ADC1_CH2. Strapping pin.' },
  { id: 'GPIO3',     label: 'IO3',   side: 'left',  types: ['gpio','analog'],  note: 'ADC1_CH3' },
  { id: 'C3D_GND2',  label: 'GND',   side: 'left',  types: ['gnd'],            note: 'Ground' },
  { id: 'C3D_RST',   label: 'RST',   side: 'left',  types: ['gpio'],           note: 'Reset / PU (pull-up enable). Avoid for GPIO use.' },
  { id: 'C3D_GND3',  label: 'GND',   side: 'left',  types: ['gnd'],            note: 'Ground' },
  { id: 'GPIO0',     label: 'IO0',   side: 'left',  types: ['gpio','analog'],  note: 'ADC1_CH0. Boot mode pin -- avoid if possible.' },
  { id: 'GPIO1',     label: 'IO1',   side: 'left',  types: ['gpio','analog'],  note: 'ADC1_CH1' },
  { id: 'GPIO10',    label: 'IO10',  side: 'left',  types: ['gpio','spi'],     note: 'SPI CS' },
  { id: 'C3D_GND4',  label: 'GND',   side: 'left',  types: ['gnd'],            note: 'Ground' },
  { id: 'C3D_5VA',   label: '5V',    side: 'left',  types: ['power'],          note: '5V USB passthrough' },
  { id: 'C3D_5VB',   label: '5V',    side: 'left',  types: ['power'],          note: '5V (second pin)' },
  { id: 'C3D_GND5',  label: 'GND',   side: 'left',  types: ['gnd'],            note: 'Ground' },
  { id: 'C3D_GND6',  label: 'GND',   side: 'right', types: ['gnd'],            note: 'Ground' },
  { id: 'GPIO43',    label: 'TX',    side: 'right', types: ['gpio'],           note: 'UART TX' },
  { id: 'GPIO44',    label: 'RX',    side: 'right', types: ['gpio'],           note: 'UART RX' },
  { id: 'C3D_GND7',  label: 'GND',   side: 'right', types: ['gnd'],            note: 'Ground' },
  { id: 'GPIO9',     label: 'IO9',   side: 'right', types: ['gpio','i2c_scl'], note: 'Default SCL. BOOT button. Strapping pin.' },
  { id: 'C3D_RST2',  label: 'RST',   side: 'right', types: ['gpio'],           note: 'Reset button connection. Avoid for GPIO.' },
  { id: 'GPIO8',     label: 'IO8',   side: 'right', types: ['gpio','i2c_sda'], note: 'Default SDA. RGB LED on some boards.' },
  { id: 'C3D_GND8',  label: 'GND',   side: 'right', types: ['gnd'],            note: 'Ground' },
  { id: 'GPIO7',     label: 'IO7',   side: 'right', types: ['gpio'],           note: 'General GPIO' },
  { id: 'C3D_PWR',   label: 'PWR',   side: 'right', types: ['power'],          note: 'Power LED indicator -- not a usable GPIO' },
  { id: 'GPIO6',     label: 'IO6',   side: 'right', types: ['gpio'],           note: 'General GPIO' },
  { id: 'GPIO5',     label: 'IO5',   side: 'right', types: ['gpio','analog'],  note: 'ADC2_CH0' },
  { id: 'GPIO4',     label: 'IO4',   side: 'right', types: ['gpio','analog'],  note: 'ADC1_CH4' },
  { id: 'C3D_GND9',  label: 'GND',   side: 'right', types: ['gnd'],            note: 'Ground' },
  { id: 'GPIO18',    label: 'IO18',  side: 'right', types: ['gpio'],           note: 'USB D- -- only free when USB CDC not active' },
  { id: 'GPIO19',    label: 'IO19',  side: 'right', types: ['gpio'],           note: 'USB D+ -- only free when USB CDC not active' },
  { id: 'C3D_GND10', label: 'GND',   side: 'right', types: ['gnd'],            note: 'Ground' },
];

// -- Seeed XIAO SAMD21 (confirmed from physical board) --------------
// USB-C at top. 7 pins per side + GND and VIN at bottom.
// Left top->bottom:  VCC GND 3V3 D10 D9 D8 D7
// Right top->bottom: D0  D1  D2  D3  D4  D5  D6
// Bottom: GND VIN
const XIAO_SAMD21_PINS = [
  { id: 'XIAO_VCC',  label: 'VCC',     side: 'left',  types: ['power'],                    note: '3.3V output to power external devices' },
  { id: 'XIAO_GND',  label: 'GND',     side: 'left',  types: ['gnd'],                      note: 'Ground' },
  { id: 'XIAO_3V3',  label: '3V3',     side: 'left',  types: ['power'],                    note: '3.3V regulated output. Max 700mA.' },
  { id: 'D10',       label: 'D10',     side: 'left',  types: ['gpio','spi'],               note: 'PA13. SPI MOSI / SS. PWM.' },
  { id: 'D9',        label: 'D9',      side: 'left',  types: ['gpio','spi'],               note: 'PA12. SPI MISO. PWM.' },
  { id: 'D8',        label: 'D8',      side: 'left',  types: ['gpio','spi'],               note: 'PA11. SPI SCK. PWM.' },
  { id: 'D7',        label: 'D7',      side: 'left',  types: ['gpio'],                     note: 'PA10. UART RX.' },
  { id: 'D0',        label: 'D0/A0',   side: 'right', types: ['gpio','analog'],            note: 'PA02. Analog A0. DAC output.' },
  { id: 'D1',        label: 'D1/A1',   side: 'right', types: ['gpio','analog'],            note: 'PA04. Analog A1. PWM.' },
  { id: 'D2',        label: 'D2/A2',   side: 'right', types: ['gpio','analog'],            note: 'PA05. Analog A2. PWM.' },
  { id: 'D3',        label: 'D3/A3',   side: 'right', types: ['gpio','analog'],            note: 'PA06. Analog A3. PWM.' },
  { id: 'D4',        label: 'D4/SDA',  side: 'right', types: ['gpio','analog','i2c_sda'],  note: 'PA07. I2C SDA. Analog A4.' },
  { id: 'D5',        label: 'D5/SCL',  side: 'right', types: ['gpio','analog','i2c_scl'],  note: 'PA08. I2C SCL. Analog A5.' },
  { id: 'D6',        label: 'D6/TX',   side: 'right', types: ['gpio'],                     note: 'PA09. UART TX.' },
  { id: 'XIAO_BGND', label: 'GND',     side: 'bottom',types: ['gnd'],                      note: 'Ground' },
  { id: 'XIAO_VIN',  label: 'VIN',     side: 'bottom',types: ['power'],                    note: 'Battery / external voltage input. 3.3V-5V.' },
];


const KEY_OPTIONS = [
  '', 'ctrl','shift','alt','win','cmd',
  'a','b','c','d','e','f','g','h','i','j','k','l','m',
  'n','o','p','q','r','s','t','u','v','w','x','y','z',
  '0','1','2','3','4','5','6','7','8','9',
  'f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12',
  'enter','esc','space','backspace','delete','tab',
  'up','down','left','right','home','end','pageup','pagedown',
  '=','-','[',']',';',"'",',','.','/','\\','`',
];
