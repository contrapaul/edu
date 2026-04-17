// ── Component library ─────────────────────────────────────────────

// Each entry defines a hardware component's full spec.

const COMPONENT_LIBRARY = {

button: {

id: 'button',

name: 'Push Button',

shortName: 'Button',

icon: '⬜',

color: '#58a6ff',

maxInstances: 12,

libraries: [],

description: 'Tactile push button. One leg to GPIO, other to GND. Internal pull-up used in firmware. Optional LED: connect LED anode to a GPIO via a 220Ω–470Ω current-limiting resistor, cathode to GND.',

pinGroups: [

{ id: 'sig', label: 'Signal', type: 'gpio', required: true,  fixed: false, wireClass: 'wire-data' },

{ id: 'gnd', label: 'GND',    type: 'gnd',  required: true,  fixed: true,  wireClass: 'wire-gnd',  fixedPin: 'GND' },

{ id: 'led', label: 'LED',    type: 'gpio', required: false, fixed: false, wireClass: 'wire-led',  conditional: 'has_led' },

],

passives: [

{ on: ['led'], type: 'resistor', value: '330Ω', note: 'Current-limiting resistor for the LED. Place between GPIO and LED anode. 220Ω–470Ω all work; 330Ω is a safe default for most standard LEDs at 3.3V.', conditional: 'has_led' }

],

configSchema: {

label:          { type: 'text',   label: 'Button label',   default: 'My Button' },

action_type:    { type: 'select', label: 'Action',

options: ['hotkey','consumer','launch','type','mode_toggle','platform_toggle'],

default: 'hotkey' },

key1:  { type: 'keyselect', label: 'Key 1', default: '', dependsOn: { action_type: ['hotkey'] } },

key2:  { type: 'keyselect', label: 'Key 2', default: '', dependsOn: { action_type: ['hotkey'] } },

key3:  { type: 'keyselect', label: 'Key 3', default: '', dependsOn: { action_type: ['hotkey'] } },

auto_translate: { type: 'checkbox', label: 'Auto ctrl↔cmd on platform switch', default: true, dependsOn: { action_type: ['hotkey'] } },

consumer_action: { type: 'select', label: 'Media key',

options: ['MUTE','VOLUME_INCREMENT','VOLUME_DECREMENT','PLAY_PAUSE','SCAN_NEXT_TRACK','SCAN_PREVIOUS_TRACK','BRIGHTNESS_INCREMENT','BRIGHTNESS_DECREMENT'],

default: 'MUTE', dependsOn: { action_type: ['consumer'] } },

program: { type: 'text', label: 'Program / app', default: 'cmd', dependsOn: { action_type: ['launch'] } },

type_text: { type: 'text', label: 'Text to type', default: '', dependsOn: { action_type: ['type'] } },

has_led:   { type: 'checkbox', label: 'Add LED to this button', default: false },

led_mode:  { type: 'select', label: 'LED behaviour', options: ['on_press','on_hold','always_on','toggle'], default: 'on_press', dependsOn: { has_led: [true] } },

}

},

ky040: {

id: 'ky040',

name: 'KY-040 Encoder',

shortName: 'KY-040',

icon: '🎛',

color: '#c87941',

maxInstances: 2,

libraries: [],

description: 'KY-040 rotary encoder. CLK/DT/SW need 10kΩ pull-up resistors to 3V3 (often built into the module board). Encoder press cycles speed in Scroll/Zoom modes.',

pinGroups: [

{ id: 'clk', label: 'CLK', type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },

{ id: 'dt',  label: 'DT',  type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },

{ id: 'sw',  label: 'SW',  type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },

{ id: 'vcc', label: '+',   type: 'power',required: true, fixed: true,  wireClass: 'wire-power', fixedPin: '3V3' },

{ id: 'gnd', label: 'GND', type: 'gnd',  required: true, fixed: true,  wireClass: 'wire-gnd',   fixedPin: 'GND' }

],

passives: [

{ on: ['clk','dt','sw'], type: 'resistor', value: '10kΩ', note: 'Pull-up to 3V3. Many KY-040 modules include these on the PCB — check for SMD resistors near the pins before adding external ones.' }

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

icon: '🎛',

color: '#c87941',

maxInstances: 2,

libraries: [],

description: 'HW-040 rotary encoder. Functionally identical to KY-040. Same wiring. Some variants have the SW pin labeled differently — check your board.',

pinGroups: [

{ id: 'clk', label: 'CLK', type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },

{ id: 'dt',  label: 'DT',  type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },

{ id: 'sw',  label: 'SW',  type: 'gpio', required: true, fixed: false, wireClass: 'wire-data' },

{ id: 'vcc', label: '+',   type: 'power',required: true, fixed: true,  wireClass: 'wire-power', fixedPin: '3V3' },

{ id: 'gnd', label: 'GND', type: 'gnd',  required: true, fixed: true,  wireClass: 'wire-gnd',   fixedPin: 'GND' }

],

passives: [

{ on: ['clk','dt','sw'], type: 'resistor', value: '10kΩ', note: 'Pull-up resistors to 3V3. Check your module for built-in resistors.' }

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

shortName: 'OLED 0.96”',

icon: '🖥',

color: '#3fb950',

maxInstances: 2,

libraries: ['adafruit_ssd1306', 'adafruit_framebuf', 'adafruit_bus_device'],

description: '0.96” 128×64 OLED, I2C interface (4-pin). Default I2C address 0x3C. Second instance must use 0x3D (check module for address solder bridge). Requires font5x8.bin in CIRCUITPY root.',

pinGroups: [

{ id: 'sda', label: 'SDA', type: 'i2c_sda', required: true, fixed: false, wireClass: 'wire-i2c-sda', preferred: 'GPIO8' },

{ id: 'scl', label: 'SCL/SCK', type: 'i2c_scl', required: true, fixed: false, wireClass: 'wire-i2c-scl', preferred: 'GPIO9' },

{ id: 'vcc', label: 'VCC', type: 'power', required: true, fixed: true, wireClass: 'wire-power', fixedPin: '3V3' },

{ id: 'gnd', label: 'GND', type: 'gnd',   required: true, fixed: true, wireClass: 'wire-gnd',   fixedPin: 'GND' }

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

icon: '🖥',

color: '#3fb950',

maxInstances: 1,

libraries: ['adafruit_ssd1306', 'adafruit_framebuf', 'adafruit_bus_device'],

description: '0.96” SSD1306 OLED, SPI interface (7-pin). Faster than I2C but uses more GPIO pins. Wire: MOSI→MOSI, SCK→SCK, CS→any GPIO, DC→any GPIO, RST→any GPIO.',

pinGroups: [

{ id: 'mosi', label: 'MOSI/SDA', type: 'spi', required: true, fixed: false, wireClass: 'wire-spi', preferred: 'GPIO35' },

{ id: 'sck',  label: 'SCK/CLK',  type: 'spi', required: true, fixed: false, wireClass: 'wire-spi', preferred: 'GPIO36' },

{ id: 'cs',   label: 'CS',        type: 'gpio',required: true, fixed: false, wireClass: 'wire-data' },

{ id: 'dc',   label: 'DC',        type: 'gpio',required: true, fixed: false, wireClass: 'wire-data' },

{ id: 'rst',  label: 'RST',       type: 'gpio',required: true, fixed: false, wireClass: 'wire-data' },

{ id: 'vcc',  label: 'VCC',       type: 'power',required: true, fixed: true, wireClass: 'wire-power', fixedPin: '3V3' },

{ id: 'gnd',  label: 'GND',       type: 'gnd', required: true, fixed: true, wireClass: 'wire-gnd',   fixedPin: 'GND' }

],

passives: [],

extraFiles: ['font5x8.bin'],

configSchema: {

display_mode: { type: 'select', label: 'Default display', options: ['idle_status','volume_bar','macro_label','custom_text'], default: 'idle_status' },

}

},

sh1106: {

id: 'sh1106',

name: 'SH1106 OLED 1.3”',

shortName: 'OLED 1.3”',

icon: '🖥',

color: '#3fb950',

maxInstances: 2,

libraries: ['adafruit_displayio_sh1106', 'adafruit_display_text', 'adafruit_bus_device'],

description: '1.3” 128×64 OLED using SH1106 driver. Uses I2C same as SSD1306 but different library. Default address 0x3C. Note: uses displayio rather than framebuf.',

pinGroups: [

{ id: 'sda', label: 'SDA', type: 'i2c_sda', required: true, fixed: false, wireClass: 'wire-i2c-sda', preferred: 'GPIO8' },

{ id: 'scl', label: 'SCL', type: 'i2c_scl', required: true, fixed: false, wireClass: 'wire-i2c-scl', preferred: 'GPIO9' },

{ id: 'vcc', label: 'VCC', type: 'power', required: true, fixed: true, wireClass: 'wire-power', fixedPin: '3V3' },

{ id: 'gnd', label: 'GND', type: 'gnd',   required: true, fixed: true, wireClass: 'wire-gnd',   fixedPin: 'GND' }

],

passives: [],

configSchema: {

i2c_address:  { type: 'select', label: 'I2C address', options: ['0x3C','0x3D'], default: '0x3C' },

display_mode: { type: 'select', label: 'Default display', options: ['idle_status','volume_bar','macro_label'], default: 'idle_status' },

}

},

ssd1309: {

id: 'ssd1309',

name: 'SSD1309 OLED 1.54”',

shortName: 'OLED 1.54”',

icon: '🖥',

color: '#3fb950',

maxInstances: 1,

libraries: ['adafruit_ssd1306', 'adafruit_framebuf', 'adafruit_bus_device'],

description: '1.54” 128×64 OLED with SSD1309 driver. Compatible with SSD1306 library. Supports both I2C and SPI — select interface mode below.',

pinGroups: [

{ id: 'sda', label: 'SDA', type: 'i2c_sda', required: true, fixed: false, wireClass: 'wire-i2c-sda', preferred: 'GPIO8' },

{ id: 'scl', label: 'SCL', type: 'i2c_scl', required: true, fixed: false, wireClass: 'wire-i2c-scl', preferred: 'GPIO9' },

{ id: 'vcc', label: 'VCC', type: 'power', required: true, fixed: true, wireClass: 'wire-power', fixedPin: '3V3' },

{ id: 'gnd', label: 'GND', type: 'gnd',   required: true, fixed: true, wireClass: 'wire-gnd',   fixedPin: 'GND' }

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

icon: '🕹',

color: '#bc8cff',

maxInstances: 1,

libraries: [],

description: 'PS2-style analog joystick. VRX and VRY are analog (use ADC-capable pins). SW is the press button (digital). Move the joystick to control mouse, scroll, or custom actions.',

pinGroups: [

{ id: 'vrx', label: 'VRX', type: 'analog', required: true, fixed: false, wireClass: 'wire-analog' },

{ id: 'vry', label: 'VRY', type: 'analog', required: true, fixed: false, wireClass: 'wire-analog' },

{ id: 'sw',  label: 'SW',  type: 'gpio',   required: true, fixed: false, wireClass: 'wire-data' },

{ id: 'vcc', label: 'VCC', type: 'power',  required: true, fixed: true,  wireClass: 'wire-power', fixedPin: '3V3' },

{ id: 'gnd', label: 'GND', type: 'gnd',    required: true, fixed: true,  wireClass: 'wire-gnd',   fixedPin: 'GND' }

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

icon: '⧖',

color: '#d29922',

maxInstances: 4,

libraries: [],

description: 'HW-371 45mm slide potentiometer. Has 5 pins: OTA and OTB are the two ends of the resistive track (connect one to VCC, one to GND — the labelled VCC/GND pins handle this). The middle wiper pin (OUT) is the analog output you read. Only 3 connections matter: VCC, GND, and OUT to an ADC-capable GPIO.',

pinGroups: [

{ id: 'out', label: 'OUT/WIPER', type: 'analog', required: true, fixed: false, wireClass: 'wire-analog' },

{ id: 'vcc', label: 'VCC',       type: 'power',  required: true, fixed: true,  wireClass: 'wire-power', fixedPin: '3V3' },

{ id: 'gnd', label: 'GND',       type: 'gnd',    required: true, fixed: true,  wireClass: 'wire-gnd',   fixedPin: 'GND' }

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

icon: '⧖',

color: '#d29922',

maxInstances: 4,

libraries: [],

description: '75mm B10K linear slide potentiometer (longer travel than HW-371). Identical wiring. The longer throw gives finer control for volume or speed.',

pinGroups: [

{ id: 'out', label: 'OUT/WIPER', type: 'analog', required: true, fixed: false, wireClass: 'wire-analog' },

{ id: 'vcc', label: 'VCC',       type: 'power',  required: true, fixed: true,  wireClass: 'wire-power', fixedPin: '3V3' },

{ id: 'gnd', label: 'GND',       type: 'gnd',    required: true, fixed: true,  wireClass: 'wire-gnd',   fixedPin: 'GND' }

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

// type: gpio | analog | i2c_sda | i2c_scl | spi | power | gnd

const ESP32S3_PINS = [

// Left side (top to bottom)

{ id: 'GPIO0',  label: 'GPIO0',  side: 'left', types: ['gpio'],              note: 'Boot mode pin — avoid if possible' },

{ id: 'GPIO1',  label: 'GPIO1',  side: 'left', types: ['gpio','analog'],     note: 'ADC1_CH0' },

{ id: 'GPIO2',  label: 'GPIO2',  side: 'left', types: ['gpio','analog'],     note: 'ADC1_CH1' },

{ id: 'GPIO3',  label: 'GPIO3',  side: 'left', types: ['gpio','analog'],     note: 'ADC1_CH2' },

{ id: 'GPIO4',  label: 'GPIO4',  side: 'left', types: ['gpio','analog'],     note: 'ADC1_CH3' },

{ id: 'GPIO5',  label: 'GPIO5',  side: 'left', types: ['gpio','analog'],     note: 'ADC1_CH4' },

{ id: 'GPIO6',  label: 'GPIO6',  side: 'left', types: ['gpio','analog'],     note: 'ADC1_CH5' },

{ id: 'GPIO7',  label: 'GPIO7',  side: 'left', types: ['gpio','analog'],     note: 'ADC1_CH6' },

{ id: 'GPIO8',  label: 'GPIO8',  side: 'left', types: ['gpio','i2c_sda'],    note: 'Default I2C SDA' },

{ id: 'GPIO9',  label: 'GPIO9',  side: 'left', types: ['gpio','i2c_scl'],    note: 'Default I2C SCL' },

{ id: 'GPIO10', label: 'GPIO10', side: 'left', types: ['gpio'],              note: 'General GPIO' },

{ id: 'GPIO11', label: 'GPIO11', side: 'left', types: ['gpio'],              note: 'General GPIO' },

{ id: 'GPIO12', label: 'GPIO12', side: 'left', types: ['gpio'],              note: 'General GPIO' },

{ id: 'GPIO13', label: 'GPIO13', side: 'left', types: ['gpio'],              note: 'General GPIO' },

{ id: '3V3',    label: '3V3',    side: 'left', types: ['power'],             note: '3.3V power output — max ~600mA total from this pin' },

{ id: 'GND',    label: 'GND',    side: 'left', types: ['gnd'],               note: 'Ground — multiple GND pins available' },

// Right side (top to bottom)

{ id: 'GPIO14', label: 'GPIO14', side: 'right', types: ['gpio'],             note: 'General GPIO' },

{ id: 'GPIO15', label: 'GPIO15', side: 'right', types: ['gpio'],             note: 'General GPIO' },

{ id: 'GPIO16', label: 'GPIO16', side: 'right', types: ['gpio'],             note: 'General GPIO' },

{ id: 'GPIO17', label: 'GPIO17', side: 'right', types: ['gpio'],             note: 'General GPIO' },

{ id: 'GPIO18', label: 'GPIO18', side: 'right', types: ['gpio'],             note: 'General GPIO' },

{ id: 'GPIO21', label: 'GPIO21', side: 'right', types: ['gpio'],             note: 'General GPIO' },

{ id: 'GPIO35', label: 'GPIO35', side: 'right', types: ['gpio','spi'],       note: 'SPI MOSI' },

{ id: 'GPIO36', label: 'GPIO36', side: 'right', types: ['gpio','spi'],       note: 'SPI SCK' },

{ id: 'GPIO37', label: 'GPIO37', side: 'right', types: ['gpio','spi'],       note: 'SPI MISO' },

{ id: 'GPIO38', label: 'GPIO38', side: 'right', types: ['gpio'],             note: 'General GPIO' },

{ id: 'GPIO39', label: 'GPIO39', side: 'right', types: ['gpio','analog'],    note: 'ADC1_CH8' },

{ id: 'GPIO40', label: 'GPIO40', side: 'right', types: ['gpio','analog'],    note: 'ADC1_CH9' },

{ id: 'GPIO41', label: 'GPIO41', side: 'right', types: ['gpio'],             note: 'General GPIO' },

{ id: 'GPIO42', label: 'GPIO42', side: 'right', types: ['gpio'],             note: 'General GPIO' },

{ id: 'GPIO43', label: 'GPIO43', side: 'right', types: ['gpio'],             note: 'UART TX — avoid unless needed' },

{ id: 'GPIO44', label: 'GPIO44', side: 'right', types: ['gpio'],             note: 'UART RX — avoid unless needed' },

{ id: 'GND_R',  label: 'GND',    side: 'right', types: ['gnd'],              note: 'Ground' },

{ id: '5V',     label: '5V',     side: 'right', types: ['power'],            note: 'USB 5V passthrough — only available when USB connected' },

];

const KEY_OPTIONS = [

'', 'ctrl','shift','alt','win','cmd',

'a','b','c','d','e','f','g','h','i','j','k','l','m',

'n','o','p','q','r','s','t','u','v','w','x','y','z',

'0','1','2','3','4','5','6','7','8','9',

'f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12',

'enter','esc','space','backspace','delete','tab',

'up','down','left','right','home','end','pageup','pagedown',

'=','-','[',']',';',”'”,',','.','/','\','`',

];
 