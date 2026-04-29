# MacroPad Builder -- code.py
# Works with: ESP32-S3 N16R8, ESP32-C3 Super Mini, ESP32-C3 Dev Board,
#             Seeed XIAO SAMD21
#
# Drop this file and config.json onto your CIRCUITPY drive root.
# Do NOT copy serve.py to the device -- that is only for running the
# configurator website locally on your computer.
#
# Required libraries in CIRCUITPY/lib/:
#   adafruit_hid              -- always required
#   adafruit_ssd1306          -- only if using SSD1306/SSD1309 OLED
#   adafruit_displayio_sh1107 -- only if using SH1106 OLED
#   adafruit_framebuf         -- only if using any OLED
#   adafruit_bus_device       -- only if using any OLED
#
# font5x8.bin must be in CIRCUITPY root if using an OLED display.

import time
import json
import board
import busio
import analogio
import digitalio
import rotaryio
import usb_hid

import adafruit_hid.keyboard
import adafruit_hid.keyboard_layout_us
import adafruit_hid.keycode
import adafruit_hid.consumer_control
import adafruit_hid.consumer_control_code
import adafruit_hid.mouse

# ---------------------------------------------------------------------------
# Debug mode -- set True to print pin resolution and events to serial console
# Open a serial monitor (Mu Editor, screen, PuTTY) to see boot output and
# confirm which buttons are being detected.
# ---------------------------------------------------------------------------
DEBUG = True

def dbg(msg):
    if DEBUG:
        print(msg)

# ---------------------------------------------------------------------------
# Load config
# ---------------------------------------------------------------------------

try:
    with open('/config.json', 'r') as f:
        CONFIG = json.load(f)
    dbg('config.json loaded OK')
    dbg('Device: ' + str(CONFIG.get('device', 'not set')))
    dbg('Buttons found: ' + str(len(CONFIG.get('buttons', {}))))
except Exception as e:
    print('ERROR loading config.json: ' + str(e))
    print('Make sure config.json is in the CIRCUITPY root folder.')
    CONFIG = {'buttons': {}, 'dial_modes': [], 'oleds': [], 'sliders': []}

DEVICE = CONFIG.get('device', 'esp32s3_n16r8')

# ---------------------------------------------------------------------------
# Pin resolver
# Each device maps the config.json pin ID to the CircuitPython board attr.
# ESP32 boards: GPIO4 -> IO4  (CircuitPython uses IO not GPIO)
# XIAO SAMD21:  D0-D10 directly
# ---------------------------------------------------------------------------

PIN_MAP = {
    'esp32s3_n16r8': {
        'GPIO0':  'IO0',  'GPIO1':  'IO1',  'GPIO2':  'IO2',  'GPIO3':  'IO3',
        'GPIO4':  'IO4',  'GPIO5':  'IO5',  'GPIO6':  'IO6',  'GPIO7':  'IO7',
        'GPIO8':  'IO8',  'GPIO9':  'IO9',  'GPIO10': 'IO10', 'GPIO11': 'IO11',
        'GPIO12': 'IO12', 'GPIO13': 'IO13', 'GPIO14': 'IO14', 'GPIO15': 'IO15',
        'GPIO16': 'IO16', 'GPIO17': 'IO17', 'GPIO18': 'IO18', 'GPIO19': 'IO19',
        'GPIO20': 'IO20', 'GPIO21': 'IO21', 'GPIO35': 'IO35', 'GPIO36': 'IO36',
        'GPIO37': 'IO37', 'GPIO38': 'IO38', 'GPIO39': 'IO39', 'GPIO40': 'IO40',
        'GPIO41': 'IO41', 'GPIO42': 'IO42', 'GPIO43': 'IO43', 'GPIO44': 'IO44',
        'GPIO45': 'IO45', 'GPIO46': 'IO46', 'GPIO47': 'IO47', 'GPIO48': 'IO48',
    },
    'esp32c3_super_mini': {
        'GPIO0':  'IO0',  'GPIO1':  'IO1',  'GPIO2':  'IO2',  'GPIO3':  'IO3',
        'GPIO4':  'IO4',  'GPIO5':  'IO5',  'GPIO6':  'IO6',  'GPIO7':  'IO7',
        'GPIO8':  'IO8',  'GPIO9':  'IO9',  'GPIO10': 'IO10',
        'GPIO20': 'IO20', 'GPIO21': 'IO21',
    },
    'esp32c3_devkit': {
        'GPIO0':  'IO0',  'GPIO1':  'IO1',  'GPIO2':  'IO2',  'GPIO3':  'IO3',
        'GPIO4':  'IO4',  'GPIO5':  'IO5',  'GPIO6':  'IO6',  'GPIO7':  'IO7',
        'GPIO8':  'IO8',  'GPIO9':  'IO9',  'GPIO10': 'IO10',
        'GPIO18': 'IO18', 'GPIO19': 'IO19', 'GPIO20': 'IO20', 'GPIO21': 'IO21',
        'GPIO43': 'IO43', 'GPIO44': 'IO44',
    },
    'xiao_samd21': {
        'D0': 'D0', 'D1': 'D1', 'D2':  'D2',  'D3':  'D3',
        'D4': 'D4', 'D5': 'D5', 'D6':  'D6',  'D7':  'D7',
        'D8': 'D8', 'D9': 'D9', 'D10': 'D10',
    },
}


def get_pin(config_pin_name):
    if not config_pin_name:
        return None
    dev_map    = PIN_MAP.get(DEVICE, {})
    board_attr = dev_map.get(config_pin_name)
    if board_attr and hasattr(board, board_attr):
        dbg('  ' + config_pin_name + ' -> board.' + board_attr)
        return getattr(board, board_attr)
    # Fallback: try name directly
    if hasattr(board, config_pin_name):
        dbg('  ' + config_pin_name + ' -> board.' + config_pin_name + ' (direct)')
        return getattr(board, config_pin_name)
    # Fallback: GPIO4 -> IO4
    if config_pin_name.startswith('GPIO'):
        alt = 'IO' + config_pin_name[5:]
        if hasattr(board, alt):
            dbg('  ' + config_pin_name + ' -> board.' + alt + ' (GPIO->IO fallback)')
            return getattr(board, alt)
    print('WARNING: cannot resolve pin "' + config_pin_name + '" on device ' + DEVICE)
    return None


# ---------------------------------------------------------------------------
# HID setup
# ---------------------------------------------------------------------------

keyboard = adafruit_hid.keyboard.Keyboard(usb_hid.devices)
layout   = adafruit_hid.keyboard_layout_us.KeyboardLayoutUS(keyboard)
consumer = adafruit_hid.consumer_control.ConsumerControl(usb_hid.devices)
mouse    = adafruit_hid.mouse.Mouse(usb_hid.devices)

# ---------------------------------------------------------------------------
# Key/consumer helpers
# ---------------------------------------------------------------------------

def keycode_for(name):
    KC = adafruit_hid.keycode.Keycode
    MAP = {
        'ctrl': KC.LEFT_CONTROL, 'shift': KC.LEFT_SHIFT,
        'alt':  KC.LEFT_ALT,     'win':   KC.LEFT_GUI,
        'cmd':  KC.LEFT_GUI,     'enter': KC.ENTER,
        'esc':  KC.ESCAPE,       'space': KC.SPACE,
        'backspace': KC.BACKSPACE, 'delete': KC.DELETE,
        'tab':  KC.TAB,
        'up':   KC.UP_ARROW,   'down':     KC.DOWN_ARROW,
        'left': KC.LEFT_ARROW, 'right':    KC.RIGHT_ARROW,
        'home': KC.HOME,       'end':      KC.END,
        'pageup': KC.PAGE_UP,  'pagedown': KC.PAGE_DOWN,
        'f1':  KC.F1,  'f2':  KC.F2,  'f3':  KC.F3,  'f4':  KC.F4,
        'f5':  KC.F5,  'f6':  KC.F6,  'f7':  KC.F7,  'f8':  KC.F8,
        'f9':  KC.F9,  'f10': KC.F10, 'f11': KC.F11, 'f12': KC.F12,
        '=':   KC.EQUALS,       '-':   KC.MINUS,
        '[':   KC.LEFT_BRACKET, ']':   KC.RIGHT_BRACKET,
        ';':   KC.SEMICOLON,    "'":   KC.QUOTE,
        ',':   KC.COMMA,        '.':   KC.PERIOD,
        '/':   KC.FORWARD_SLASH, '\\': KC.BACKSLASH,
        '`':   KC.GRAVE_ACCENT,
        '0': KC.ZERO,  '1': KC.ONE,   '2': KC.TWO,   '3': KC.THREE,
        '4': KC.FOUR,  '5': KC.FIVE,  '6': KC.SIX,   '7': KC.SEVEN,
        '8': KC.EIGHT, '9': KC.NINE,
    }
    if name in MAP:
        return MAP[name]
    if len(name) == 1 and name.isalpha():
        return getattr(KC, name.upper(), None)
    return None


def consumer_code_for(name):
    CC = adafruit_hid.consumer_control_code.ConsumerControlCode
    MAP = {
        'MUTE':                 CC.MUTE,
        'VOLUME_INCREMENT':     CC.VOLUME_INCREMENT,
        'VOLUME_DECREMENT':     CC.VOLUME_DECREMENT,
        'PLAY_PAUSE':           CC.PLAY_PAUSE,
        'SCAN_NEXT_TRACK':      CC.SCAN_NEXT_TRACK,
        'SCAN_PREVIOUS_TRACK':  CC.SCAN_PREVIOUS_TRACK,
        'BRIGHTNESS_INCREMENT': CC.BRIGHTNESS_INCREMENT,
        'BRIGHTNESS_DECREMENT': CC.BRIGHTNESS_DECREMENT,
    }
    return MAP.get(name)


# ---------------------------------------------------------------------------
# State
# ---------------------------------------------------------------------------

config_slot        = 0   # 0 = Config 1, 1 = Config 2
platform           = 'pc'
current_mode_index = 0

# ---------------------------------------------------------------------------
# OLED setup
# ---------------------------------------------------------------------------

displays = []

for oled_cfg in CONFIG.get('oleds', []):
    driver  = oled_cfg.get('driver', 'ssd1306_i2c')
    sda_pin = get_pin(oled_cfg.get('gpio_sda'))
    scl_pin = get_pin(oled_cfg.get('gpio_scl'))
    if sda_pin is None or scl_pin is None:
        print('OLED skipped: missing SDA/SCL pins')
        continue
    try:
        i2c      = busio.I2C(scl_pin, sda_pin)
        addr_str = oled_cfg.get('i2c_address', '0x3C')
        addr     = int(addr_str, 16)
        if driver in ('ssd1306_i2c', 'ssd1309'):
            import adafruit_ssd1306
            height  = 64 if driver == 'ssd1309' else 32
            display = adafruit_ssd1306.SSD1306_I2C(128, height, i2c, addr=addr)
        elif driver == 'sh1106':
            import adafruit_displayio_sh1107, displayio
            displayio.release_displays()
            bus     = displayio.I2CDisplay(i2c, device_address=addr)
            display = adafruit_displayio_sh1107.SH1107(
                bus, width=128, height=64, display_offset=96)
        else:
            print('Unknown OLED driver: ' + driver)
            continue
        displays.append({
            'display': display,
            'mode':    oled_cfg.get('display_mode', 'idle_status'),
        })
        dbg('OLED ready: ' + driver + ' @ ' + addr_str)
    except Exception as e:
        print('OLED init failed: ' + str(e))


def oled_show(lines, display_obj):
    try:
        display_obj.fill(0)
        y = 0
        for line in lines[:4]:
            display_obj.text(str(line), 0, y, 1)
            y += 10
        display_obj.show()
    except Exception as e:
        print('OLED draw error: ' + str(e))


def update_displays(label=''):
    slot_label = 'CFG ' + str(config_slot + 1)
    for d in displays:
        mode = d['mode']
        disp = d['display']
        if mode == 'macro_label':
            oled_show([label, slot_label], disp)
        elif mode == 'idle_status':
            oled_show(['MacroPad', slot_label,
                       'Mode: ' + str(current_mode_index + 1)], disp)


update_displays()

# ---------------------------------------------------------------------------
# Action execution
# ---------------------------------------------------------------------------

def execute_action(cfg):
    global config_slot, platform, current_mode_index
    if not cfg:
        return
    t = cfg.get('type')

    if t == 'hotkey':
        keys  = cfg.get('keys', [])
        auto  = cfg.get('auto_translate', False)
        codes = []
        for k in keys:
            if not k:
                continue
            if auto and platform == 'mac' and k == 'ctrl':
                k = 'cmd'
            elif auto and platform == 'pc' and k == 'cmd':
                k = 'ctrl'
            kc = keycode_for(k)
            if kc:
                codes.append(kc)
        if codes:
            keyboard.send(*codes)
            dbg('hotkey: ' + str(keys))

    elif t == 'consumer':
        cc = consumer_code_for(cfg.get('action', ''))
        if cc is not None:
            consumer.send(cc)
        else:
            print('WARNING: unknown consumer action: ' + str(cfg.get('action')))

    elif t == 'type':
        text = cfg.get('text', '')
        if text:
            layout.write(text)

    elif t == 'launch':
        if platform == 'mac':
            keyboard.send(adafruit_hid.keycode.Keycode.LEFT_GUI,
                          adafruit_hid.keycode.Keycode.SPACE)
        else:
            keyboard.send(adafruit_hid.keycode.Keycode.LEFT_GUI,
                          adafruit_hid.keycode.Keycode.R)
        time.sleep(0.4)
        layout.write(cfg.get('program', ''))
        time.sleep(0.1)
        keyboard.send(adafruit_hid.keycode.Keycode.ENTER)

    elif t == 'config_toggle':
        config_slot = 1 - config_slot
        dbg('Config slot -> ' + str(config_slot + 1))
        update_displays()

    elif t == 'mode_toggle':
        modes = CONFIG.get('dial_modes', [])
        if modes:
            current_mode_index = (current_mode_index + 1) % len(modes)
            dbg('Encoder mode -> ' + modes[current_mode_index].get('name', '?'))
            update_displays()

    elif t == 'mouse_scroll':
        mouse.move(wheel=cfg.get('direction', 1))


# ---------------------------------------------------------------------------
# Buttons
# ---------------------------------------------------------------------------

class Button:
    def __init__(self, cfg, cfg2, pin_obj):
        self.cfg      = cfg
        self.cfg2     = cfg2
        self.pin      = digitalio.DigitalInOut(pin_obj)
        self.pin.direction = digitalio.Direction.INPUT
        self.pin.pull      = digitalio.Pull.UP
        self._pressed = False

    def update(self):
        pressed = not self.pin.value  # active low with pull-up
        if pressed and not self._pressed:
            active = self.cfg2 if (config_slot == 1 and self.cfg2) else self.cfg
            execute_action(active)
            update_displays(active.get('label', ''))
        self._pressed = pressed


buttons = []
dbg('--- Setting up buttons ---')

for idx, btn_cfg in CONFIG.get('buttons', {}).items():
    pin_name = btn_cfg.get('gpio')
    dbg('Button ' + str(idx) + ': gpio=' + str(pin_name)
        + ' label=' + str(btn_cfg.get('label', '?')))
    pin_obj = get_pin(pin_name)
    if pin_obj is None:
        print('Button ' + str(idx) + ' SKIPPED -- pin "' + str(pin_name) + '" not found')
        continue

    # Build Config 2 action dict if enabled
    cfg2 = None
    if btn_cfg.get('has_config2'):
        a2 = btn_cfg.get('action_type2', 'hotkey')
        cfg2 = {'type': a2, 'label': btn_cfg.get('label', '')}
        if a2 == 'hotkey':
            cfg2['keys'] = [k for k in [
                btn_cfg.get('key1_2', ''),
                btn_cfg.get('key2_2', ''),
                btn_cfg.get('key3_2', '')] if k]
            cfg2['auto_translate'] = btn_cfg.get('auto_translate', False)
        elif a2 == 'actions':
            cfg2['type']   = 'consumer'
            cfg2['action'] = btn_cfg.get('consumer_action2', '')
        elif a2 == 'launch':
            cfg2['program'] = btn_cfg.get('program2', '')
        elif a2 == 'type':
            cfg2['text'] = btn_cfg.get('type_text2', '')

    buttons.append(Button(btn_cfg, cfg2, pin_obj))
    print('Button ' + str(idx) + ' ready: "' + str(btn_cfg.get('label', '?'))
          + '" on ' + str(pin_name))

dbg(str(len(buttons)) + ' of ' + str(len(CONFIG.get('buttons', {})))
    + ' buttons initialised')

# ---------------------------------------------------------------------------
# Encoders
# ---------------------------------------------------------------------------

class Encoder:
    def __init__(self, mode_cfg, clk_obj, dt_obj, sw_obj):
        self.mode_cfg = mode_cfg
        self.enc      = rotaryio.IncrementalEncoder(clk_obj, dt_obj)
        self._last    = self.enc.position
        if sw_obj:
            self.sw = digitalio.DigitalInOut(sw_obj)
            self.sw.direction = digitalio.Direction.INPUT
            self.sw.pull      = digitalio.Pull.UP
            self._sw_pressed  = False
        else:
            self.sw = None

    def update(self):
        pos   = self.enc.position
        delta = pos - self._last
        self._last = pos
        if delta > 0:
            execute_action(self.mode_cfg.get('cw', {}))
        elif delta < 0:
            execute_action(self.mode_cfg.get('ccw', {}))
        if self.sw:
            pressed = not self.sw.value
            if pressed and not self._sw_pressed:
                execute_action(self.mode_cfg.get('press'))
            self._sw_pressed = pressed


encoders = []
for enc_cfg in CONFIG.get('dial_modes', []):
    clk = get_pin(enc_cfg.get('gpio_clk'))
    dt  = get_pin(enc_cfg.get('gpio_dt'))
    sw  = get_pin(enc_cfg.get('gpio_sw'))
    if clk is None or dt is None:
        print('Encoder skipped: missing CLK or DT pins')
        continue
    encoders.append(Encoder(enc_cfg, clk, dt, sw))
    dbg('Encoder ready: ' + enc_cfg.get('name', '?'))

# ---------------------------------------------------------------------------
# Sliders
# ---------------------------------------------------------------------------

class Slider:
    SMOOTHING = 8
    THRESHOLD = 400

    def __init__(self, cfg, adc_obj):
        self.cfg      = cfg
        self.adc      = analogio.AnalogIn(adc_obj)
        self._buf     = [self.adc.value] * self.SMOOTHING
        self._idx     = 0
        self._last    = self._read()
        self.inverted = cfg.get('inverted', False)
        self.function = cfg.get('function', 'volume')

    def _read(self):
        self._buf[self._idx] = self.adc.value
        self._idx = (self._idx + 1) % self.SMOOTHING
        avg = sum(self._buf) // self.SMOOTHING
        return 65535 - avg if self.inverted else avg

    def update(self):
        val   = self._read()
        delta = val - self._last
        if abs(delta) < self.THRESHOLD:
            return
        self._last = val
        direction  = 1 if delta > 0 else -1
        if self.function == 'volume':
            cc = consumer_code_for(
                'VOLUME_INCREMENT' if direction > 0 else 'VOLUME_DECREMENT')
            if cc:
                consumer.send(cc)
        elif self.function == 'scroll_speed':
            mouse.move(wheel=direction)
        elif self.function == 'zoom_speed':
            kc  = adafruit_hid.keycode.Keycode
            mod = kc.LEFT_GUI if platform == 'mac' else kc.LEFT_CONTROL
            keyboard.send(mod, kc.EQUALS if direction > 0 else kc.MINUS)
        elif self.function == 'brightness':
            cc = consumer_code_for(
                'BRIGHTNESS_INCREMENT' if direction > 0 else 'BRIGHTNESS_DECREMENT')
            if cc:
                consumer.send(cc)


sliders = []
for sl_cfg in CONFIG.get('sliders', []):
    pin = get_pin(sl_cfg.get('gpio_out'))
    if pin is None:
        print('Slider skipped: no pin')
        continue
    sliders.append(Slider(sl_cfg, pin))
    dbg('Slider ready: ' + sl_cfg.get('label', '?'))

# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------

print('MacroPad running.')
print('Device: ' + DEVICE)
print('Buttons: ' + str(len(buttons)) + '  Encoders: ' + str(len(encoders))
      + '  Sliders: ' + str(len(sliders)))

while True:
    for btn in buttons:
        btn.update()
    for enc in encoders:
        enc.update()
    for sl in sliders:
        sl.update()
    time.sleep(0.008)
