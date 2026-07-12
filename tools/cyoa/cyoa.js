/* ═══════════════════════════════════════════════════════════════════
   Choose Your Own Adventure — engine.
   Reads CYOA_META / CYOA_PAGES from pages.js. No edits needed here
   when the story changes.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Elements ─────────────────────────────────────────────────────
  const cover      = document.getElementById('cover');
  const spread     = document.getElementById('spread');
  const flap       = document.getElementById('flipFlap');
  const bodyLeft   = document.getElementById('bodyLeft');
  const bodyRight  = document.getElementById('bodyRight');
  const numLeft    = document.getElementById('numLeft');
  const numRight   = document.getElementById('numRight');
  const headerLeft = document.getElementById('headerLeft');
  const headerRight= document.getElementById('headerRight');

  const narrToggle = document.getElementById('narrToggle');
  const narrStatus = document.getElementById('narrStatus');
  const narrPlay   = document.getElementById('narrPlayBtn');
  const narrPause  = document.getElementById('narrPauseBtn');
  const narrReplay = document.getElementById('narrReplayBtn');
  const narrNote   = document.getElementById('narrNote');
  const audio      = document.getElementById('narrAudio');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopSpread = window.matchMedia('(min-width: 720px)');

  let currentPage = null;
  let turning = false;

  // ── Story sanity checks (author aid, console only) ───────────────
  Object.keys(CYOA_PAGES).forEach(function (key) {
    const page = CYOA_PAGES[key];
    if (page.ending) return;
    if (!page.choices || !page.choices.length) {
      console.warn('CYOA: page ' + key + ' has no choices and is not an ending.');
      return;
    }
    page.choices.forEach(function (c) {
      if (!CYOA_PAGES[c.page]) {
        console.warn('CYOA: page ' + key + ' points to missing page ' + c.page + '.');
      }
    });
  });

  // ── Cover ─────────────────────────────────────────────────────────
  document.getElementById('coverTitle').textContent = CYOA_META.title;
  document.getElementById('coverSub').textContent = CYOA_META.subtitle;
  document.title = CYOA_META.title + ' — contrapaul edu';

  document.getElementById('beginBtn').addEventListener('click', function () {
    location.hash = 'page/' + CYOA_META.start;
  });

  // ── Navigation via URL hash (#page/N) ─────────────────────────────
  function parseHash() {
    const m = location.hash.match(/^#page\/(\d+)$/);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    return CYOA_PAGES[n] ? n : null;
  }

  function showCover() {
    stopNarration();
    currentPage = null;
    spread.hidden = true;
    cover.hidden = false;
  }

  function showSpread() {
    cover.hidden = true;
    spread.hidden = false;
  }

  window.addEventListener('hashchange', function () {
    const n = parseHash();
    if (n === null) { showCover(); return; }
    showSpread();
    turnTo(n);
  });

  // ── Rendering ─────────────────────────────────────────────────────
  function renderPage(n) {
    const page = CYOA_PAGES[n];
    currentPage = n;

    headerLeft.textContent = CYOA_META.title;
    headerRight.textContent = page.ending ? 'The End' : 'Choose wisely';
    numLeft.textContent = n;
    numRight.textContent = n;

    // Distribute paragraphs across the two pages by character count so
    // the text reads as one passage flowing over the spread.
    bodyLeft.innerHTML = '';
    bodyRight.innerHTML = '';
    const paras = page.paragraphs || [];
    const total = paras.reduce(function (sum, p) { return sum + p.length; }, 0);
    let leftChars = 0;
    paras.forEach(function (text) {
      const el = document.createElement('p');
      el.textContent = text;
      if (leftChars < total / 2) {
        bodyLeft.appendChild(el);
        leftChars += text.length;
      } else {
        bodyRight.appendChild(el);
      }
    });

    // Choices always end the right page.
    const choices = document.createElement('div');
    choices.className = 'choices';
    choices.appendChild(document.createElement('hr')).className = 'choices-rule';

    if (page.ending) {
      const end = document.createElement('div');
      end.className = 'the-end';
      end.textContent = 'The End';
      bodyRight.appendChild(end);

      choices.appendChild(makeChoiceButton('Read Again — return to page ' + CYOA_META.start, function () {
        location.hash = 'page/' + CYOA_META.start;
      }));
      const back = document.createElement('a');
      back.className = 'choice-btn';
      back.href = CYOA_META.toolsUrl;
      back.textContent = 'Return to /tools';
      choices.appendChild(back);
    } else {
      page.choices.forEach(function (c) {
        choices.appendChild(makeChoiceButton(c.label, function () {
          location.hash = 'page/' + c.page;
        }));
      });
    }
    bodyRight.appendChild(choices);

    narrateCurrentPage();
  }

  function makeChoiceButton(label, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  // ── Page-turn animation ───────────────────────────────────────────
  // One stylized flip for every jump, near or far. Desktop: a flap
  // hinged at the spine flips over; content swaps while it is edge-on.
  // Mobile: quick fade. Reduced motion: instant swap.
  function turnTo(n) {
    if (n === currentPage) return;
    if (reducedMotion.matches || currentPage === null) {
      renderPage(n);
      return;
    }
    if (turning) { renderPage(n); return; }
    turning = true;

    if (desktopSpread.matches) {
      flap.hidden = false;
      flap.classList.add('flipping');
      setTimeout(function () { renderPage(n); }, 220);
      setTimeout(function () {
        flap.classList.remove('flipping');
        flap.hidden = true;
        turning = false;
      }, 470);
    } else {
      spread.classList.remove('fade-in');
      void spread.offsetWidth; // restart animation
      renderPage(n);
      spread.classList.add('fade-in');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      turning = false;
    }
  }

  // ── Narration ─────────────────────────────────────────────────────
  // Recording for page N lives at audio/page-N.mp3 (or page.audio).
  const NARR_KEY = 'cyoa-narration';

  narrToggle.checked = localStorage.getItem(NARR_KEY) === 'on';

  narrToggle.addEventListener('change', function () {
    localStorage.setItem(NARR_KEY, narrToggle.checked ? 'on' : 'off');
    if (narrToggle.checked) {
      narrateCurrentPage();
    } else {
      stopNarration();
    }
  });

  function audioSrcFor(n) {
    return CYOA_PAGES[n].audio || ('audio/page-' + n + '.mp3');
  }

  function narrateCurrentPage() {
    if (!narrToggle.checked || currentPage === null) return;
    audio.src = audioSrcFor(currentPage);
    audio.currentTime = 0;
    audio.play().then(function () {
      setNarrState('playing');
    }).catch(function () {
      // Rejection means autoplay was blocked, or the file is missing
      // (audio.error is set in that case, possibly before this runs).
      setNarrState(audio.error ? 'missing' : 'blocked');
    });
  }

  function stopNarration() {
    audio.pause();
    audio.removeAttribute('src');
    setNarrState('hidden');
  }

  audio.addEventListener('error', function () {
    if (!narrToggle.checked || currentPage === null || !audio.getAttribute('src')) return;
    setNarrState('missing');
  });
  audio.addEventListener('ended', function () { setNarrState('ended'); });

  narrPlay.addEventListener('click', function () {
    audio.play().then(function () { setNarrState('playing'); });
  });
  narrPause.addEventListener('click', function () {
    audio.pause();
    setNarrState('paused');
  });
  narrReplay.addEventListener('click', function () {
    audio.currentTime = 0;
    audio.play().then(function () { setNarrState('playing'); });
  });

  function setNarrState(state) {
    narrStatus.hidden = state === 'hidden';
    narrPlay.hidden   = !(state === 'blocked' || state === 'paused');
    narrPause.hidden  = state !== 'playing';
    narrReplay.hidden = !(state === 'playing' || state === 'ended');
    narrNote.hidden   = state !== 'missing';
    if (state === 'missing') {
      narrNote.textContent = 'No recording yet for page ' + currentPage;
    }
  }

  // ── Boot ──────────────────────────────────────────────────────────
  const initial = parseHash();
  if (initial === null) {
    showCover();
  } else {
    showSpread();
    renderPage(initial);
  }
}());
