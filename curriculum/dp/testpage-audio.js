/* testpage-audio.js — experimental audio-player toolbar for testpage.html
   Adds a "show/hide audio players", "listen to all topics" and
   "download audio" control next to Expand All Sections, and replaces
   each native <audio> with a small custom player styled from the
   site's theme variables (so it recolors live with the theme picker). */
(function () {
  'use strict';

  var expandBtn = document.querySelector('.curr-expand-all-btn');
  var audios = Array.prototype.slice.call(document.querySelectorAll('.topic-audio'));
  if (!expandBtn || !audios.length) return;

  /* ── CUSTOM PLAYER (built from var(--accent) etc., not native controls) */
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

    /* Move the real <audio> inside the wrap — it stays in the DOM
       (still driving playback/events) but is visually hidden by CSS. */
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

    function seekFromClientX(clientX) {
      if (!audio.duration) return;
      var rect = track.getBoundingClientRect();
      var pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
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

    track.addEventListener('click', function (e) { seekFromClientX(e.clientX); });
    track.addEventListener('keydown', function (e) {
      if (!audio.duration) return;
      if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
      else if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
    });

    /* Missing/未录制 files: <source> errors don't bubble, so listen on
       the capture phase to disable this player gracefully. */
    audio.addEventListener('error', function () {
      playBtn.disabled = true;
      wrap.classList.add('is-unavailable');
      playBtn.title = 'Audio not available yet';
      time.textContent = 'Not recorded yet';
    }, true);
  }

  audios.forEach(enhanceAudio);

  /* ── TOOLBAR ──────────────────────────────────────────────── */
  /* Wrap expand-all together with the new controls in one flex
     row so they all sit inline instead of wrapping to their own line. */
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
  listenAllBtn.textContent = 'Listen to all topics';

  var downloadLink = document.createElement('a');
  downloadLink.className = 'curr-expand-all-btn';
  downloadLink.href = 'B2.1/B2-1complete.mp3';
  downloadLink.setAttribute('download', '');
  downloadLink.textContent = 'Download audio';

  row.appendChild(toggleBtn);
  row.appendChild(listenAllBtn);
  row.appendChild(downloadLink);

  /* ── SHOW / HIDE AUDIO PLAYERS (visible by default) ──────────── */
  toggleBtn.addEventListener('click', function () {
    var hidden = document.body.classList.toggle('audio-players-hidden');
    toggleBtn.textContent = hidden ? 'Show audio players' : 'Hide audio players';
    toggleBtn.classList.toggle('is-active', hidden);
  });

  /* ── ONLY ONE PLAYER AT A TIME ────────────────────────────── */
  audios.forEach(function (a) {
    a.addEventListener('play', function () {
      audios.forEach(function (other) {
        if (other !== a && !other.paused) other.pause();
      });
      if (queueActive && a !== audios[queueIndex]) stopQueue();
    });
  });

  /* ── LISTEN TO ALL TOPICS (sequential playback) ──────────────── */
  var queueActive = false;
  var queueIndex = -1;

  function clearQueueHighlight() {
    audios.forEach(function (a) { a.parentNode.classList.remove('is-queued'); });
  }

  function stopQueue() {
    queueActive = false;
    queueIndex = -1;
    clearQueueHighlight();
    listenAllBtn.textContent = 'Listen to all topics';
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
    /* A missing file rejects this promise, but the dedicated 'error'
       listener below (bound to the same audio element) still fires
       and advances the queue — don't also stopQueue() here, or a
       single missing track would abort the whole run. */
    next.play().catch(function () {});
  }

  audios.forEach(function (a) {
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
    /* Expand every section first so users can follow along visually */
    if (!expandBtn.classList.contains('is-expanded')) expandBtn.click();

    queueActive = true;
    queueIndex = -1;
    listenAllBtn.textContent = 'Stop listening';
    listenAllBtn.classList.add('is-active');
    playNextInQueue();
  });

})();
