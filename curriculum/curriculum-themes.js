/* ============================================================
   curriculum-themes.js
   Theme switcher — applies a [data-theme] attribute to <html>.
   Choices persisted to localStorage.

   Include on any page that should support theme switching.
   Requires themes.css for the variable overrides.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'edu-theme';

  var THEMES = [
    { id: 'light',     label: 'Default',           emoji: '☀️'  },
    { id: 'dark',      label: 'Dark',               emoji: '🌙'  },
    { id: 'win95',     label: 'Windows 95',         emoji: '🖥️'  },
    { id: 'dos',       label: 'MS-DOS',             emoji: '⌨️'  },
    { id: 'xbox',      label: 'Xbox OG',            emoji: '🎮'  },
    { id: 'nightmare', label: 'Nightmare',          emoji: '🌈'  },
    { id: 'hannah',    label: "Hannah's request",   emoji: '🎀'  }
  ];

  /* ── Apply theme immediately (before paint) ─────────────── */
  var _saved = localStorage.getItem(STORAGE_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', _saved);

  /* ── Helpers ─────────────────────────────────────────────── */
  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'light';
  }

  function applyTheme(id) {
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem(STORAGE_KEY, id);
    syncPickerState(id);
  }

  function findTheme(id) {
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === id) return THEMES[i];
    }
    return THEMES[0];
  }

  function syncPickerState(id) {
    var panel = document.getElementById('theme-picker-panel');
    if (!panel) return;
    /* Highlight active option */
    panel.querySelectorAll('.theme-option').forEach(function (btn) {
      btn.classList.toggle('theme-option-active', btn.getAttribute('data-theme-id') === id);
    });
    /* Update toggle button emoji */
    var toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      var t = findTheme(id);
      toggleBtn.querySelector('.theme-btn-icon').textContent = t.emoji;
      toggleBtn.title = 'Theme: ' + t.label;
    }
  }

  /* ── Build picker UI ─────────────────────────────────────── */
  function buildPicker() {
    var wrap = document.createElement('div');
    wrap.className = 'theme-picker-wrap';
    wrap.id = 'theme-picker-wrap';

    /* Panel (initially hidden) */
    var panel = document.createElement('div');
    panel.className = 'theme-picker-panel';
    panel.id = 'theme-picker-panel';
    panel.hidden = true;

    var title = document.createElement('div');
    title.className = 'theme-picker-title';
    title.textContent = 'Choose theme';
    panel.appendChild(title);

    THEMES.forEach(function (t) {
      var btn = document.createElement('button');
      btn.className = 'theme-option';
      btn.setAttribute('data-theme-id', t.id);
      btn.innerHTML =
        '<span class="theme-option-emoji">' + t.emoji + '</span>' +
        '<span class="theme-option-label">' + t.label + '</span>';
      btn.addEventListener('click', function () {
        applyTheme(t.id);
        panel.hidden = true;
      });
      panel.appendChild(btn);
    });

    /* Toggle button */
    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.id = 'theme-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Choose theme');
    toggleBtn.setAttribute('aria-controls', 'theme-picker-panel');
    toggleBtn.innerHTML = '<span class="theme-btn-icon">☀️</span>';

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.hidden = !panel.hidden;
    });

    wrap.appendChild(panel);
    wrap.appendChild(toggleBtn);
    document.body.appendChild(wrap);

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) panel.hidden = true;
    });

    /* Sync initial state */
    syncPickerState(getTheme());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPicker);
  } else {
    buildPicker();
  }

})();
