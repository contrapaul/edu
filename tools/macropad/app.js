# MacroPad Builder – code.py
# Drop this file onto your CIRCUITPY drive along with config.json.
# The firmware reads config.json at boot and initialises only the
# components you configured in the web tool. Nothing is hardcoded.
#
# Required libraries (copy from Adafruit CircuitPython Bundle into CIRCUITPY/lib/):
# adafruit_hid          – always required
# adafruit_ssd1306      – if you have an SSD1306 or SSD1309 OLED
# adafruit_displayio_sh1107  – if you have an SH1106 OLED
# adafruit_framebuf     – if you have any OLED
# adafruit_bus_device   – if you have any OLED
#
# Also place font5x8.bin in the CIRCUITPY root if using an OLED.
import time
import json
import board
import busio
import analogio
import digitalio
import rotaryio
import supervisor
import usb_hid
import adafruit_hid.keyboard
import adafruit_hid.keyboard_layout_us
import adafruit_hid.keycode
import adafruit_hid.consumer_control
import adafruit_hid.consumer_control_code
import adafruit_hid.mouse
# —————————————————————————
# Helpers
# —————————————————————————
def get_pin(name):
“”“Return a board pin object from a string like ‘GPIO4’.”””
if name is None:
return None
attr = name.replace(‘GPIO’, ‘IO’) if name.startswith(‘GPIO’) else name
# CircuitPython on ESP32-S3 uses board.IO4 style
if hasattr(board, attr):
return getattr(board, attr)
# Fallback: try the raw name
if hasattr(board, name):
return getattr(board, name)
print(f’WARNING: unknown pin {name}’)
return None
def keycode_for(name):
“”“Convert a key name string to an adafruit_hid Keycode value.”””
KC = adafruit_hid.keycode.Keycode
MAP = {
‘ctrl’:      KC.LEFT_CONTROL,
‘shift’:     KC.LEFT_SHIFT,
‘alt’:       KC.LEFT_ALT,
‘win’:       KC.LEFT_GUI,
‘cmd’:       KC.LEFT_GUI,
‘enter’:     KC.ENTER,
‘esc’:       KC.ESCAPE,
‘space’:     KC.SPACE,
‘backspace’: KC.BACKSPACE,
‘delete’:    KC.DELETE,
‘tab’:       KC.TAB,
‘up’:        KC.UP_ARROW,
‘down’:      KC.DOWN_ARROW,
‘left’:      KC.LEFT_ARROW,
‘right’:     KC.RIGHT_ARROW,
‘home’:      KC.HOME,
‘end’:       KC.END,
‘pageup’:    KC.PAGE_UP,
‘pagedown’:  KC.PAGE_DOWN,
‘f1’: KC.F1, ‘f2’: KC.F2,  ‘f3’: KC.F3,  ‘f4’:  KC.F4,
‘f5’: KC.F5, ‘f6’: KC.F6,  ‘f7’: KC.F7,  ‘f8’:  KC.F8,
‘f9’: KC.F9, ‘f10’:KC.F10, ‘f11’:KC.F11, ‘f12’: KC.F12,
‘=’: KC.EQUALS, ‘-’: KC.MINUS, ‘[’: KC.LEFT_BRACKET,
‘]’: KC.RIGHT_BRACKET, ‘;’: KC.SEMICOLON, “’”: KC.QUOTE,
‘,’: KC.COMMA, ‘.’: KC.PERIOD, ‘/’: KC.FORWARD_SLASH,
‘\’: KC.BACKSLASH, ‘`’: KC.GRAVE_ACCENT,
‘0’: KC.ZERO,  ‘1’: KC.ONE,   ‘2’: KC.TWO,   ‘3’: KC.THREE,
‘4’: KC.FOUR,  ‘5’: KC.FIVE,  ‘6’: KC.SIX,   ‘7’: KC.SEVEN,
‘8’: KC.EIGHT, ‘9’: KC.NINE,
}
if name in MAP:
return MAP[name]
# Single letter a-z
if len(name) == 1 and name.isalpha():
return getattr(KC, name.upper(), None)
return None
def consumer_code_for(name):
CC = adafruit_hid.consumer_control_code.ConsumerControlCode
MAP = {
‘MUTE’:               CC.MUTE,
‘VOLUME_INCREMENT’:   CC.VOLUME_INCREMENT,
‘VOLUME_DECREMENT’:   CC.VOLUME_DECREMENT,
‘PLAY_PAUSE’:         CC.PLAY_PAUSE,
‘SCAN_NEXT_TRACK’:    CC.SCAN_NEXT_TRACK,
‘SCAN_PREVIOUS_TRACK’:CC.SCAN_PREVIOUS_TRACK,
‘BRIGHTNESS_INCREMENT’: CC.BRIGHTNESS_INCREMENT,
‘BRIGHTNESS_DECREMENT’: CC.BRIGHTNESS_DECREMENT,
}
return MAP.get(name)
# —————————————————————————
# Load config
# —————————————————————————
try:
with open(’/config.json’, ‘r’) as f:
CONFIG = json.load(f)
except Exception as e:
print(f’ERROR loading config.json: {e}’)
CONFIG = {‘buttons’: {}, ‘dial_modes’: [], ‘oleds’: [], ‘sliders’: []}
# —————————————————————————
# HID setup
# —————————————————————————
keyboard  = adafruit_hid.keyboard.Keyboard(usb_hid.devices)
layout    = adafruit_hid.keyboard_layout_us.KeyboardLayoutUS(keyboard)
consumer  = adafruit_hid.consumer_control.ConsumerControl(usb_hid.devices)
mouse     = adafruit_hid.mouse.Mouse(usb_hid.devices)
# —————————————————————————
# Platform tracking (mac vs pc, toggled by platform_toggle button)
# —————————————————————————
platform = ‘pc’   # ‘pc’ or ‘mac’
# —————————————————————————
# Mode tracking (cycled by mode_toggle button)
# —————————————————————————
current_mode_index = 0
# —————————————————————————
# OLED setup
# —————————————————————————
displays = []
for oled_cfg in CONFIG.get(‘oleds’, []):
driver = oled_cfg.get(‘driver’, ‘ssd1306_i2c’)
sda_pin = get_pin(oled_cfg.get(‘gpio_sda’))
scl_pin = get_pin(oled_cfg.get(‘gpio_scl’))
if sda_pin is None or scl_pin is None:
print(f’OLED skipped: missing SDA/SCL pins’)
continue
try:
i2c = busio.I2C(scl_pin, sda_pin)
addr_str = oled_cfg.get(‘i2c_address’, ‘0x3C’)
addr = int(addr_str, 16)
```
   if driver in ('ssd1306_i2c', 'ssd1309'):
       import adafruit_ssd1306
       width  = 128
       height = 32 if driver == 'ssd1306_i2c' else 64
       display = adafruit_ssd1306.SSD1306_I2C(width, height, i2c, addr=addr)
   elif driver == 'sh1106':
       import adafruit_displayio_sh1107
       import displayio
       displayio.release_displays()
       display_bus = displayio.I2CDisplay(i2c, device_address=addr)
       display = adafruit_displayio_sh1107.SH1107(
           display_bus, width=128, height=64, display_offset=96)
   else:
       print(f'Unknown OLED driver: {driver}')
       continue
   displays.append({
       'display': display,
       'driver':  driver,
       'mode':    oled_cfg.get('display_mode', 'idle_status'),
   })
   print(f'OLED ready: {driver} @ {addr_str}')
except Exception as e:
   print(f'OLED init failed: {e}')
```
def oled_show(text_lines, display_obj, driver):
“”“Write up to 4 lines of text to an SSD1306-style display.”””
try:
import adafruit_framebuf
display_obj.fill(0)
y = 0
for line in text_lines[:4]:
display_obj.text(str(line), 0, y, 1)
y += 10
display_obj.show()
except Exception as e:
print(f’OLED draw error: {e}’)
def update_displays(label=’’):
for d in displays:
mode = d[‘mode’]
disp = d[‘display’]
drv  = d[‘driver’]
if mode == ‘macro_label’:
oled_show([label], disp, drv)
elif mode == ‘idle_status’:
oled_show([‘MacroPad’, f’Mode: {current_mode_index+1}’, f’Plat: {platform.upper()}’], disp, drv)
elif mode == ‘custom_text’:
pass  # static – set at boot only
# Initial display
update_displays()
# —————————————————————————
# Buttons setup
# —————————————————————————
class Button:
def **init**(self, cfg, gpio_pin):
self.cfg      = cfg
self.pin      = digitalio.DigitalInOut(gpio_pin)
self.pin.direction = digitalio.Direction.INPUT
self.pin.pull      = digitalio.Pull.UP
self._last    = True
self._pressed = False
```
@property
def just_pressed(self):
   val = self.pin.value
   pressed = not val  # active low with pull-up
   edge = pressed and not self._pressed
   self._pressed = pressed
   return edge
@property
def just_released(self):
   val = self.pin.value
   released = val and self._pressed
   self._pressed = not val
   return released
```
buttons = []
for idx, btn_cfg in CONFIG.get(‘buttons’, {}).items():
pin_name = btn_cfg.get(‘gpio’)
pin = get_pin(pin_name)
if pin is None:
print(f’Button {idx} skipped: no pin’)
continue
buttons.append(Button(btn_cfg, pin))
print(f’Button {idx} ready on {pin_name}: {btn_cfg.get(“label”,”?”)}’)
def execute_action(cfg):
“”“Execute a button or encoder action dict.”””
global platform, current_mode_index
```
action_type = cfg.get('type')
if action_type == 'hotkey':
   keys = cfg.get('keys', [])
   auto = cfg.get('auto_translate', False)
   codes = []
   for k in keys:
       # Auto-translate ctrl <-> cmd when on mac
       if auto and platform == 'mac' and k == 'ctrl':
           k = 'cmd'
       elif auto and platform == 'pc' and k == 'cmd':
           k = 'ctrl'
       kc = keycode_for(k)
       if kc:
           codes.append(kc)
   if codes:
       keyboard.send(*codes)
elif action_type == 'consumer':
   cc = consumer_code_for(cfg.get('action', ''))
   if cc is not None:
       consumer.send(cc)
elif action_type == 'type':
   text = cfg.get('text', '')
   if text:
       layout.write(text)
elif action_type == 'launch':
   # Launch via Win+R on PC, Cmd+Space on Mac (opens spotlight)
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
elif action_type == 'mode_toggle':
   modes = CONFIG.get('dial_modes', [])
   if modes:
       current_mode_index = (current_mode_index + 1) % len(modes)
       print(f'Mode -> {modes[current_mode_index].get("name","?")}')
       update_displays()
elif action_type == 'platform_toggle':
   platform = 'mac' if platform == 'pc' else 'pc'
   print(f'Platform -> {platform}')
   update_displays()
elif action_type == 'mouse_scroll':
   direction = cfg.get('direction', 1)
   mouse.move(wheel=direction)
```
# —————————————————————————
# Encoders setup
# —————————————————————————
class Encoder:
def **init**(self, mode_cfg, clk_pin, dt_pin, sw_pin):
self.mode_cfg = mode_cfg
self.enc      = rotaryio.IncrementalEncoder(clk_pin, dt_pin)
self._last_pos = self.enc.position
if sw_pin:
self.sw = digitalio.DigitalInOut(sw_pin)
self.sw.direction = digitalio.Direction.INPUT
self.sw.pull      = digitalio.Pull.UP
self._sw_last = True
else:
self.sw = None
```
def update(self):
   pos = self.enc.position
   delta = pos - self._last_pos
   self._last_pos = pos
   if delta > 0:
       execute_action(self.mode_cfg.get('cw', {}))
   elif delta < 0:
       execute_action(self.mode_cfg.get('ccw', {}))
   if self.sw:
       pressed = not self.sw.value
       if pressed and self._sw_last:
           press_cfg = self.mode_cfg.get('press')
           if press_cfg:
               execute_action(press_cfg)
       self._sw_last = not pressed
```
encoders = []
for enc_cfg in CONFIG.get(‘dial_modes’, []):
clk = get_pin(enc_cfg.get(‘gpio_clk’))
dt  = get_pin(enc_cfg.get(‘gpio_dt’))
sw  = get_pin(enc_cfg.get(‘gpio_sw’))
if clk is None or dt is None:
print(‘Encoder skipped: missing CLK or DT pin’)
continue
encoders.append(Encoder(enc_cfg, clk, dt, sw))
print(f’Encoder ready: {enc_cfg.get(“name”,”?”)}’)
# —————————————————————————
# Sliders (analog pots) setup
# —————————————————————————
class Slider:
SMOOTHING = 8        # number of samples to average
THRESHOLD = 300      # ADC units of change before acting (0-65535)
```
def __init__(self, cfg, adc_pin):
   self.cfg      = cfg
   self.adc      = analogio.AnalogIn(adc_pin)
   self._samples = [self.adc.value] * self.SMOOTHING
   self._idx     = 0
   self._last_val = self._read()
   self.inverted  = cfg.get('inverted', False)
   self.function  = cfg.get('function', 'volume')
def _read(self):
   self._samples[self._idx] = self.adc.value
   self._idx = (self._idx + 1) % self.SMOOTHING
   avg = sum(self._samples) // self.SMOOTHING
   if self.inverted:
       avg = 65535 - avg
   return avg
def update(self):
   val = self._read()
   delta = val - self._last_val
   if abs(delta) < self.THRESHOLD:
       return
   self._last_val = val
   # Map 0-65535 to -1 or +1 scroll/zoom steps, or volume
   direction = 1 if delta > 0 else -1
   if self.function == 'volume':
       cc = consumer_code_for(
           'VOLUME_INCREMENT' if direction > 0 else 'VOLUME_DECREMENT')
       if cc:
           consumer.send(cc)
   elif self.function == 'scroll_speed':
       mouse.move(wheel=direction)
   elif self.function == 'zoom_speed':
       kc = adafruit_hid.keycode.Keycode
       mod = kc.LEFT_GUI if platform == 'mac' else kc.LEFT_CONTROL
       key = kc.EQUALS if direction > 0 else kc.MINUS
       keyboard.send(mod, key)
   elif self.function == 'brightness':
       cc = consumer_code_for(
           'BRIGHTNESS_INCREMENT' if direction > 0 else 'BRIGHTNESS_DECREMENT')
       if cc:
           consumer.send(cc)
```
sliders = []
for sl_cfg in CONFIG.get(‘sliders’, []):
pin = get_pin(sl_cfg.get(‘gpio_out’))
if pin is None:
print(‘Slider skipped: no pin’)
continue
sliders.append(Slider(sl_cfg, pin))
print(f’Slider ready: {sl_cfg.get(“label”,”?”)} -> {sl_cfg.get(“function”,”?”)}’)
# —————————————————————————
# Main loop
# —————————————————————————
print(‘MacroPad running.’)
while True:
# Buttons
for btn in buttons:
if btn.just_pressed:
execute_action(btn.cfg)
update_displays(btn.cfg.get(‘label’, ‘’))
```
# Encoders
for enc in encoders:
   enc.update()
# Sliders
for sl in sliders:
   sl.update()
time.sleep(0.01)
```
