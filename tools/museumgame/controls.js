// Input: keyboard (WASD/arrows + E/F/ESC) and on-screen touch controls.
// Movement is exposed as boolean flags read by game.js each frame;
// E/F/ESC fire callbacks assigned by game.js.
const Controls = {
  up: false, down: false, left: false, right: false,
  onInteract: null, onAudio: null, onEscape: null,

  init() {
    const keymap = {
      ArrowUp: 'up', KeyW: 'up',
      ArrowDown: 'down', KeyS: 'down',
      ArrowLeft: 'left', KeyA: 'left',
      ArrowRight: 'right', KeyD: 'right',
    };
    window.addEventListener('keydown', (e) => {
      if (keymap[e.code]) {
        this[keymap[e.code]] = true;
        e.preventDefault(); // keep arrow keys from scrolling the page
      } else if (e.code === 'KeyE') {
        e.preventDefault();
        if (this.onInteract) this.onInteract();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        if (this.onAudio) this.onAudio();
      } else if (e.code === 'Escape') {
        if (this.onEscape) this.onEscape();
      }
    });
    window.addEventListener('keyup', (e) => {
      if (keymap[e.code]) this[keymap[e.code]] = false;
    });
    // Don't get stuck walking if the tab loses focus mid-keypress.
    window.addEventListener('blur', () => this.reset());

    this.initTouch();
  },

  initTouch() {
    const touch = document.getElementById('touch');
    const coarse = matchMedia('(pointer: coarse)');
    const apply = () => {
      touch.classList.toggle('visible', coarse.matches);
      document.body.classList.toggle('touch-mode', coarse.matches);
    };
    apply();
    coarse.addEventListener('change', apply);

    touch.querySelectorAll('[data-dir]').forEach((btn) => {
      const dir = btn.dataset.dir;
      const press = (e) => { e.preventDefault(); btn.classList.add('held'); this[dir] = true; };
      const release = (e) => { e.preventDefault(); btn.classList.remove('held'); this[dir] = false; };
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release);
      btn.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    const wire = (id, cb) => {
      document.getElementById(id).addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (this[cb]) this[cb]();
      });
    };
    wire('btn-interact', 'onInteract');
    wire('btn-audio', 'onAudio');
  },

  reset() {
    this.up = this.down = this.left = this.right = false;
  },
};
