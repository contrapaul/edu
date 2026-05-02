(function () {
  'use strict';

  // ── SECTION ACCORDION (top level, one open at a time) ──────────
  var sectionTriggers = document.querySelectorAll('.section-trigger');

  function openSection(trigger) {
    var bodyId = trigger.getAttribute('aria-controls');
    var body = document.getElementById(bodyId);
    if (!body) return;
    trigger.setAttribute('aria-expanded', 'true');
    body.classList.add('open');
  }

  function closeSection(trigger) {
    var bodyId = trigger.getAttribute('aria-controls');
    var body = document.getElementById(bodyId);
    if (!body) return;
    trigger.setAttribute('aria-expanded', 'false');
    body.classList.remove('open');
  }

  sectionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      sectionTriggers.forEach(closeSection);
      if (!isOpen) openSection(trigger);
    });
  });

  // ── HERO TOC LINKS: open section and scroll ────────────────────
  document.querySelectorAll('.hero-toc a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = link.getAttribute('href').slice(1);
      var block = document.getElementById(targetId);
      if (!block) return;
      var trigger = block.querySelector('.section-trigger');
      if (trigger && trigger.getAttribute('aria-expanded') !== 'true') {
        sectionTriggers.forEach(closeSection);
        openSection(trigger);
      }
      setTimeout(function () {
        block.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    });
  });

  // ── SUB-SECTION ACCORDION ──────────────────────────────────────
  function closeAllSubsInSection(sectionBody) {
    sectionBody.querySelectorAll('.sub-trigger').forEach(function (t) {
      t.setAttribute('aria-expanded', 'false');
      var b = document.getElementById(t.getAttribute('aria-controls'));
      if (b) b.classList.remove('open');
    });
  }

  document.querySelectorAll('.sub-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      var bodyId = trigger.getAttribute('aria-controls');
      var body = document.getElementById(bodyId);
      if (!body) return;
      var parentSection = trigger.closest('.section-body');
      if (parentSection) closeAllSubsInSection(parentSection);
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }
    });
  });

  // ── STRAND NAV: open sub-section and scroll ────────────────────
  document.querySelectorAll('.strand-nav a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = link.getAttribute('href').slice(1);
      var sub = document.getElementById(targetId);
      if (!sub) return;
      var trigger = sub.querySelector('.sub-trigger');
      if (!trigger) return;
      var parentSection = sub.closest('.section-body');
      if (parentSection) closeAllSubsInSection(parentSection);
      trigger.setAttribute('aria-expanded', 'true');
      var body = document.getElementById(trigger.getAttribute('aria-controls'));
      if (body) body.classList.add('open');
      setTimeout(function () {
        sub.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    });
  });

  // ── COPY BUTTONS ───────────────────────────────────────────────
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pre = document.getElementById(btn.dataset.copyTarget);
      if (!pre) return;
      var text = pre.textContent || pre.innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(function () { showCopied(btn); })
          .catch(function () { fallbackCopy(text, btn); });
      } else {
        fallbackCopy(text, btn);
      }
    });
  });

  function showCopied(btn) {
    var orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('copied');
      btn.disabled = false;
    }, 2000);
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (err) {
      btn.textContent = 'Copy failed';
      setTimeout(function () { btn.textContent = 'Copy Text'; }, 2000);
    }
    document.body.removeChild(ta);
  }

  // ── DIALOG SYSTEM ──────────────────────────────────────────────
  // Opener: <button data-dialog="dialog-id">
  // Closer: <button class="dialog-close"> inside <dialog>
  // Backdrop click also closes

  document.querySelectorAll('[data-dialog]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dlg = document.getElementById(btn.dataset.dialog);
      if (dlg && dlg.showModal) dlg.showModal();
    });
  });

  document.querySelectorAll('.dialog-close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dlg = btn.closest('dialog');
      if (dlg) dlg.close();
    });
  });

  document.querySelectorAll('dialog').forEach(function (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) dlg.close();
    });
  });

  // ── AUDIO LISTEN BUTTONS ───────────────────────────────────────
  // <button class="listen-btn" data-audio="filename.mp3">
  // Disabled automatically if the mp3 file cannot be loaded.

  var currentAudio = null;
  var currentBtn = null;

  var PLAY_SVG  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5,3 19,12 5,21"/></svg>';
  var PAUSE_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';

  function setPlayState(btn) {
    btn.classList.add('playing');
    btn.innerHTML = PAUSE_SVG + ' Pause';
    btn.setAttribute('aria-label', 'Pause audio');
  }

  function setPauseState(btn) {
    btn.classList.remove('playing');
    btn.innerHTML = PLAY_SVG + ' Listen';
    btn.setAttribute('aria-label', 'Play audio');
  }

  function stopCurrent() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if (currentBtn) setPauseState(currentBtn);
    currentAudio = null;
    currentBtn = null;
  }

  document.querySelectorAll('.listen-btn').forEach(function (btn) {
    var audio = null;
    var failed = false;

    setPauseState(btn);

    function initAudio() {
      if (audio) return;
      audio = new Audio();
      audio.preload = 'none';

      audio.addEventListener('error', function () {
        failed = true;
        btn.disabled = true;
        btn.title = 'Audio file not available';
        if (currentBtn === btn) { currentAudio = null; currentBtn = null; }
      });

      audio.addEventListener('ended', function () {
        setPauseState(btn);
        currentAudio = null;
        currentBtn = null;
      });

      audio.src = btn.dataset.audio;
    }

    btn.addEventListener('click', function () {
      if (failed) return;

      // Clicking a playing button pauses it
      if (currentBtn === btn && currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        setPauseState(btn);
        currentAudio = null;
        currentBtn = null;
        return;
      }

      stopCurrent();
      initAudio();
      if (failed) return;

      currentAudio = audio;
      currentBtn = btn;
      setPlayState(btn);

      audio.play().catch(function () {
        setPauseState(btn);
        currentAudio = null;
        currentBtn = null;
      });
    });
  });

})();
