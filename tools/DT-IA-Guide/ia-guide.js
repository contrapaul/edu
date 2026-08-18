/* ia-guide.js — page behaviour for the DP Design Tech IA Guide.
   Accordions, expand-all and TOC highlighting come from the shared
   curriculum.js / curr-toc.js. This file adds two things:
     1. Custom audio players + toolbar (modelled on the B2.1 test page).
     2. Copy buttons on the template blocks.
   Both are built from theme variables, so they recolor with the picker. */
(function () {
  'use strict';

  /* ── AUDIO ────────────────────────────────────────────────── */

  var PLAY_SVG  = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6,4 20,12 6,20"/></svg>';
  var PAUSE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function enhanceAudio(audio) {
    var wrap = document.createElement('div');
    wrap.className = 'audio-player';

    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'audio-play-btn';
    playBtn.setAttribute('aria-label', 'Play audio');
    playBtn.innerHTML = PLAY_SVG;

    var track = document.createElement('div');
    track.className = 'audio-progress';
    track.setAttribute('role', 'slider');
    track.setAttribute('aria-label', 'Seek');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '100');
    track.setAttribute('aria-valuenow', '0');
    track.tabIndex = 0;

    var fill = document.createElement('div');
    fill.className = 'audio-progress-fill';
    track.appendChild(fill);

    var time = document.createElement('span');
    time.className = 'audio-time';
    time.textContent = '0:00 / 0:00';

    wrap.appendChild(playBtn);
    wrap.appendChild(track);
    wrap.appendChild(time);

    /* Keep the real <audio> in the DOM — it still drives playback and
       fires the events below — but hidden by CSS behind this player. */
    audio.parentNode.insertBefore(wrap, audio);
    wrap.appendChild(audio);

    function updateProgress() {
      if (wrap.classList.contains('is-unavailable')) return;
      var dur = audio.duration || 0;
      var cur = audio.currentTime || 0;
      var pct = dur ? (cur / dur) * 100 : 0;
      fill.style.width = pct + '%';
      track.setAttribute('aria-valuenow', String(Math.round(pct)));
      time.textContent = formatTime(cur) + ' / ' + formatTime(dur);
    }

    playBtn.addEventListener('click', function () {
      if (playBtn.disabled) return;
      if (audio.paused) audio.play().catch(function () {}); else audio.pause();
    });

    audio.addEventListener('play',  function () { wrap.classList.add('is-playing');    playBtn.innerHTML = PAUSE_SVG; playBtn.setAttribute('aria-label', 'Pause audio'); });
    audio.addEventListener('pause', function () { wrap.classList.remove('is-playing'); playBtn.innerHTML = PLAY_SVG;  playBtn.setAttribute('aria-label', 'Play audio'); });
    audio.addEventListener('ended', function () { wrap.classList.remove('is-playing'); playBtn.innerHTML = PLAY_SVG;  playBtn.setAttribute('aria-label', 'Play audio'); });
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);

    track.addEventListener('click', function (e) {
      if (!audio.duration) return;
      var rect = track.getBoundingClientRect();
      var pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
    });
    track.addEventListener('keydown', function (e) {
      if (!audio.duration) return;
      if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
      else if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
    });

    /* Not-yet-recorded files: <source> errors don't bubble, so listen on
       the capture phase and disable this player gracefully. */
    audio.addEventListener('error', function () {
      playBtn.disabled = true;
      wrap.classList.add('is-unavailable');
      playBtn.title = 'Audio not available yet';
      time.textContent = 'Not recorded yet';
    }, true);
  }

  var audios = Array.prototype.slice.call(document.querySelectorAll('.topic-audio'));
  audios.forEach(enhanceAudio);

  /* ── AUDIO TOOLBAR ────────────────────────────────────────── */

  var expandBtn = document.querySelector('.curr-expand-all-btn');

  if (expandBtn && audios.length) {
    /* Put expand-all and the audio controls in one flex row. */
    var row = document.createElement('div');
    row.className = 'curr-toolbar-row';
    expandBtn.parentNode.insertBefore(row, expandBtn);
    row.appendChild(expandBtn);

    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'curr-expand-all-btn';
    toggleBtn.textContent = 'Hide audio players';

    var listenAllBtn = document.createElement('button');
    listenAllBtn.type = 'button';
    listenAllBtn.className = 'curr-expand-all-btn';
    listenAllBtn.textContent = 'Listen to all sections';

    row.appendChild(toggleBtn);
    row.appendChild(listenAllBtn);

    /* Download appears only when a combined file has been declared,
       so there is never a button pointing at a file that isn't there. */
    var fullAudio = document.body.getAttribute('data-full-audio');
    if (fullAudio) {
      var downloadLink = document.createElement('a');
      downloadLink.className = 'curr-expand-all-btn';
      downloadLink.href = fullAudio;
      downloadLink.setAttribute('download', '');
      downloadLink.textContent = 'Download audio';
      row.appendChild(downloadLink);
    }

    toggleBtn.addEventListener('click', function () {
      var hidden = document.body.classList.toggle('audio-players-hidden');
      toggleBtn.textContent = hidden ? 'Show audio players' : 'Hide audio players';
      toggleBtn.classList.toggle('is-active', hidden);
    });

    /* ── Only one player at a time ── */
    var queueActive = false;
    var queueIndex = -1;

    function clearQueueHighlight() {
      audios.forEach(function (a) { a.parentNode.classList.remove('is-queued'); });
    }

    function stopQueue() {
      queueActive = false;
      queueIndex = -1;
      clearQueueHighlight();
      listenAllBtn.textContent = 'Listen to all sections';
      listenAllBtn.classList.remove('is-active');
    }

    function playNextInQueue() {
      if (!queueActive) return;
      clearQueueHighlight();
      queueIndex++;
      if (queueIndex >= audios.length) { stopQueue(); return; }

      var next = audios[queueIndex];
      next.parentNode.classList.add('is-queued');
      next.currentTime = 0;
      /* A missing file rejects this promise, but the 'error' listener
         below advances the queue, so don't stopQueue() here or one
         unrecorded section would abort the whole run. */
      next.play().catch(function () {});
    }

    audios.forEach(function (a) {
      a.addEventListener('play', function () {
        audios.forEach(function (other) {
          if (other !== a && !other.paused) other.pause();
        });
        if (queueActive && a !== audios[queueIndex]) stopQueue();
      });
      a.addEventListener('ended', function () {
        if (queueActive && audios[queueIndex] === a) playNextInQueue();
      });
      a.addEventListener('error', function () {
        if (queueActive && audios[queueIndex] === a) playNextInQueue();
      }, true);
    });

    listenAllBtn.addEventListener('click', function () {
      if (queueActive) {
        audios.forEach(function (a) { if (!a.paused) a.pause(); });
        stopQueue();
        return;
      }
      /* Expand every section first so the page follows along. */
      if (!expandBtn.classList.contains('is-expanded')) expandBtn.click();

      queueActive = true;
      queueIndex = -1;
      listenAllBtn.textContent = 'Stop listening';
      listenAllBtn.classList.add('is-active');
      playNextInQueue();
    });
  }

  /* ── COPY BUTTONS ON TEMPLATE BLOCKS ──────────────────────── */

  document.querySelectorAll('.template-copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pre = document.getElementById(btn.dataset.copyTarget);
      if (!pre) return;

      function flash(label) {
        btn.textContent = label;
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1800);
      }

      /* file:// and some browser contexts block the clipboard API. Selecting
         the text leaves the student one keystroke away, so say so rather
         than claiming a copy that did not happen. */
      function selectFallback() {
        var range = document.createRange();
        range.selectNodeContents(pre);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        flash('Selected, press Ctrl+C');
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pre.textContent).then(function () {
          flash('Copied');
        }, selectFallback);
      } else {
        selectFallback();
      }
    });
  });

}());
