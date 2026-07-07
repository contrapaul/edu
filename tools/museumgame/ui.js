// DOM layer: exhibit popup, proximity prompt, toast, and the audio-guide
// player. Everything content-related happens here, outside the canvas.
const UI = {
  exhibits: {},          // id -> exhibit record from exhibits.json
  nearest: null,         // exhibit record the player is standing near
  current: null,         // exhibit shown in the open popup
  popupOpen: false,
  zoneColors: {          // accents shared with the old 3D museum
    'Vintage Hardware': '#C4944A', 'Gaming History': '#6B8E23',
    'Cameras & Photography': '#4A7B9D', '3D Printing & Fabrication': '#8B6914',
    'Artificial Intelligence': '#4682B4', 'Software & Digital Culture': '#7B4A8B',
  },

  init(exhibitList) {
    exhibitList.forEach((ex) => { this.exhibits[ex.id] = ex; });
    this.els = {
      prompt: document.getElementById('prompt'),
      promptTitle: document.getElementById('prompt-title'),
      toast: document.getElementById('toast'),
      backdrop: document.getElementById('popup-backdrop'),
      popup: document.getElementById('popup'),
      title: document.getElementById('popup-title'),
      zone: document.getElementById('popup-zone'),
      body: document.getElementById('popup-body'),
      close: document.getElementById('popup-close'),
      audioBtn: document.getElementById('popup-audio'),
      btnE: document.getElementById('btn-interact'),
      btnF: document.getElementById('btn-audio'),
    };
    this.els.close.addEventListener('click', () => this.closePopup());
    this.els.backdrop.addEventListener('click', (e) => {
      if (e.target === this.els.backdrop) this.closePopup();
    });
    this.els.audioBtn.addEventListener('click', () => {
      if (this.current) this.toggleAudio(this.current);
    });
    // Keep Tab inside the dialog while it is open.
    this.els.popup.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = this.els.popup.querySelectorAll('button, a[href]');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  },

  // Called by game.js each frame with the nearest marker (or null).
  setNearest(marker) {
    if (!marker) {
      if (this.nearest) {
        this.nearest = null;
        this.els.prompt.hidden = true;
        this.setActionButtons(false);
      }
      return;
    }
    const ex = this.exhibits[marker.id] || {
      id: marker.id,
      title: marker.name || marker.id,
      type: 'text',
      body: '<p>This exhibit is still being installed. (No entry with id <code>' +
        marker.id + '</code> in <code>exhibits.json</code>.)</p>',
      missing: true,
    };
    if (this.exhibits[marker.id] === undefined) {
      console.warn('museumgame: Tiled marker references unknown exhibit id "' +
        marker.id + '" — add it to exhibits.json');
    }
    if (this.nearest !== ex) {
      this.nearest = ex;
      this.els.promptTitle.textContent = ex.title;
      this.els.prompt.hidden = false;
      this.setActionButtons(true);
    }
  },

  setActionButtons(inRange) {
    if (this.els.btnE) {
      this.els.btnE.classList.toggle('in-range', inRange);
      this.els.btnF.classList.toggle('in-range', inRange);
    }
  },

  openExhibit(ex) {
    this.current = ex;
    this.popupOpen = true;
    this.els.title.textContent = ex.title;
    if (ex.zone) {
      this.els.zone.textContent = ex.zone;
      this.els.zone.style.background = this.zoneColors[ex.zone] || '#888';
      this.els.zone.hidden = false;
    } else {
      this.els.zone.hidden = true;
    }
    this.els.body.innerHTML = this.renderBody(ex);
    this.els.body.scrollTop = 0;
    this.els.backdrop.hidden = false;
    this.els.close.focus();
  },

  renderBody(ex) {
    const body = ex.body || '';
    const figs = (ex.images || []).map((img) =>
      '<figure><img src="' + img.src + '" alt="' + (img.caption || ex.title) + '">' +
      (img.caption ? '<figcaption>' + img.caption + '</figcaption>' : '') +
      '</figure>').join('');
    if (ex.type === 'gallery') {
      return '<div class="gallery">' + figs + '</div>' + body;
    }
    if (ex.type === 'image-text') {
      return figs + body;
    }
    return body; // "text"
  },

  closePopup() {
    if (!this.popupOpen) return;
    this.popupOpen = false;
    this.current = null;
    this.els.backdrop.hidden = true;
    const canvas = document.querySelector('#game canvas');
    if (canvas) canvas.focus();
  },

  // ---- audio guide ------------------------------------------------------
  audio: { el: null, id: null },

  toggleAudio(ex) {
    const a = this.audio;
    if (!a.el) {
      a.el = new Audio();
      a.el.preload = 'none';
      a.el.addEventListener('error', () => {
        a.id = null;
        this.toast('Audio guide coming soon for this exhibit.');
      });
      a.el.addEventListener('ended', () => { a.id = null; });
    }
    if (a.id === ex.id) {           // same exhibit: toggle pause/resume
      if (a.el.paused) a.el.play().catch(() => {});
      else a.el.pause();
      return;
    }
    a.el.pause();
    a.id = ex.id;
    a.el.src = ex.audio || 'audio/' + ex.id + '.mp3';
    // Called synchronously from the E/F gesture handler, so iOS allows it.
    a.el.play().catch(() => { /* error event shows the toast */ });
  },

  // ---- toast --------------------------------------------------------------
  toastTimer: null,
  toast(msg) {
    const t = this.els.toast;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { t.hidden = true; }, 2500);
  },
};
