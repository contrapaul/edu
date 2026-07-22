/* testpage-audio.js — experimental audio-player toolbar for testpage.html
   Adds a "show/hide audio players", "listen to all topics" and
   "download audio" control next to Expand All Sections. */
(function () {
  'use strict';

  var expandBtn = document.querySelector('.curr-expand-all-btn');
  var audios = Array.prototype.slice.call(document.querySelectorAll('.topic-audio'));
  if (!expandBtn || !audios.length) return;

  /* ── TOOLBAR ──────────────────────────────────────────────── */
  var toolbar = document.createElement('div');
  toolbar.className = 'audio-toolbar';

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

  toolbar.appendChild(toggleBtn);
  toolbar.appendChild(listenAllBtn);
  toolbar.appendChild(downloadLink);
  expandBtn.parentNode.insertBefore(toolbar, expandBtn.nextSibling);

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

  function stopQueue() {
    queueActive = false;
    queueIndex = -1;
    audios.forEach(function (a) { a.classList.remove('is-queued'); });
    listenAllBtn.textContent = 'Listen to all topics';
    listenAllBtn.classList.remove('is-active');
  }

  function playNextInQueue() {
    if (!queueActive) return;
    audios.forEach(function (a) { a.classList.remove('is-queued'); });
    queueIndex++;
    if (queueIndex >= audios.length) { stopQueue(); return; }

    var next = audios[queueIndex];
    next.classList.add('is-queued');
    next.currentTime = 0;
    next.play().catch(function () { stopQueue(); });
  }

  audios.forEach(function (a) {
    a.addEventListener('ended', function () {
      if (queueActive && audios[queueIndex] === a) playNextInQueue();
    });
    /* Missing/未录制 files: <source> errors don't bubble, so listen on
       the capture phase to still advance the queue past them. */
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
