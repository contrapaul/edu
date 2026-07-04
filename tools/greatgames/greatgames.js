// ═══════════════════════════════════════════════════════════════════
//  You Should Play These Games.
//
//  Swipe/scroll sideways through the wheel of cover cards to browse.
//  Tap or click a card to pop up its details in a modal (same content
//  and colors as the card); close it by tapping the X or clicking away
//  to return to the wheel.
// ═══════════════════════════════════════════════════════════════════
(function () {
  const PLACEHOLDER_GLYPH = '\u{1F3AE}'; // 🎮 — obvious stand-in until real cover art is added.

  function buildCover(game, { big } = {}) {
    const cover = document.createElement('div');
    cover.className = big ? 'gg-detail-cover' : 'gg-cover';
    if (game.cover) {
      const img = document.createElement('img');
      img.src = game.cover;
      img.alt = `${game.title} cover art`;
      img.loading = 'lazy';
      cover.appendChild(img);
    } else {
      const glyph = document.createElement('span');
      glyph.className = 'gg-cover-glyph';
      glyph.setAttribute('aria-hidden', 'true');
      glyph.textContent = PLACEHOLDER_GLYPH;
      cover.appendChild(glyph);
      const tag = document.createElement('span');
      tag.className = 'gg-cover-tag';
      tag.textContent = 'Temp Art';
      cover.appendChild(tag);
    }
    return cover;
  }

  function buildCard(game, { clone } = {}) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'gg-card';
    card.style.setProperty('--accent', game.accent);
    if (clone) {
      // Duplicate cards exist only so the wheel can wrap seamlessly —
      // hide them from keyboard/screen-reader navigation.
      card.setAttribute('aria-hidden', 'true');
      card.tabIndex = -1;
    }
    card.appendChild(buildCover(game));

    const title = document.createElement('div');
    title.className = 'gg-card-title';
    title.textContent = game.title;
    card.appendChild(title);

    const tagline = document.createElement('div');
    tagline.className = 'gg-card-tagline';
    tagline.textContent = game.tagline;
    card.appendChild(tagline);

    return card;
  }

  function renderDetailContent(container, game, index, total) {
    container.replaceChildren();

    const inner = document.createElement('div');
    inner.className = 'gg-detail-inner';
    inner.appendChild(buildCover(game, { big: true }));

    const body = document.createElement('div');
    body.className = 'gg-detail-body';

    const eyebrow = document.createElement('div');
    eyebrow.className = 'gg-detail-eyebrow';
    eyebrow.textContent = `Game ${String(index + 1).padStart(2, '0')} of ${total}`;
    body.appendChild(eyebrow);

    const title = document.createElement('h2');
    title.className = 'gg-detail-title';
    title.textContent = game.title;
    body.appendChild(title);

    const tagline = document.createElement('p');
    tagline.className = 'gg-detail-tagline';
    tagline.textContent = game.tagline;
    body.appendChild(tagline);

    if (game.platforms && game.platforms.length) {
      const pills = document.createElement('div');
      pills.className = 'gg-platforms';
      game.platforms.forEach((p) => {
        const pill = document.createElement('span');
        pill.className = 'gg-platform-pill';
        pill.textContent = p;
        pills.appendChild(pill);
      });
      body.appendChild(pills);
    }

    const desc = document.createElement('p');
    desc.className = 'gg-detail-desc';
    desc.textContent = game.description;
    body.appendChild(desc);

    if (game.why && game.why.length) {
      const whyTitle = document.createElement('div');
      whyTitle.className = 'gg-why-title';
      whyTitle.textContent = 'Why play it';
      body.appendChild(whyTitle);

      const whyList = document.createElement('ul');
      whyList.className = 'gg-why-list';
      game.why.forEach((reason) => {
        const li = document.createElement('li');
        li.className = 'gg-why-item';
        li.textContent = reason;
        whyList.appendChild(li);
      });
      body.appendChild(whyList);
    }

    const ctaRow = document.createElement('div');
    ctaRow.className = 'gg-cta-row';
    const cta = document.createElement('a');
    cta.className = 'gg-cta';
    cta.href = game.link || '#';
    cta.textContent = 'Where to Play →';
    ctaRow.appendChild(cta);
    const ctaNote = document.createElement('span');
    ctaNote.className = 'gg-cta-note';
    ctaNote.textContent = 'Store link coming soon';
    ctaRow.appendChild(ctaNote);
    body.appendChild(ctaRow);

    inner.appendChild(body);
    container.appendChild(inner);
  }

  // The gallery is rendered as several clone sets on each side of one real
  // set — [clone][clone][real][clone][clone] — so that even a fast, long
  // fling lands well short of the actual scrollable edge; a single clone
  // set on each side could be outrun by a strong swipe, which briefly
  // exposes the hard boundary before the wraparound "catches up". Once a
  // swipe settles anywhere in a clone set, we silently re-center on the
  // equivalent real card — same content, so the jump is invisible —
  // giving the illusion of a wheel that scrolls forever in either
  // direction.
  const COPIES = 5;
  const MIDDLE_COPY = Math.floor(COPIES / 2);

  function render() {
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('detailModal');
    const modalBox = document.getElementById('detailModalBox');
    const modalContent = document.getElementById('detailModalContent');
    if (!gallery || !modal || !modalBox || !modalContent || typeof GAMES === 'undefined') return;

    const count = GAMES.length;
    const middleStart = count * MIDDLE_COPY;
    const cards = [];
    for (let setIndex = 0; setIndex < COPIES; setIndex++) {
      GAMES.forEach((game) => {
        const card = buildCard(game, { clone: setIndex !== MIDDLE_COPY });
        gallery.appendChild(card);
        cards.push(card);
      });
    }

    function openDetailFor(game) {
      modalBox.style.setProperty('--accent', game.accent);
      renderDetailContent(modalContent, game, GAMES.indexOf(game), count);
      modal.hidden = false;
    }
    function closeDetail() { modal.hidden = true; }

    modal.querySelectorAll('[data-modal-close]')
      .forEach((el) => el.addEventListener('click', closeDetail));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeDetail();
    });

    // Which card is nearest the gallery's horizontal center, measured
    // fresh from live geometry every time — used to highlight the active
    // card and to detect when a swipe has settled inside a clone region
    // (see recenterIfInCloneRegion).
    function centerMostCardIndex() {
      const galleryCenter = gallery.getBoundingClientRect().left + gallery.clientWidth / 2;
      let bestIdx = -1;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - galleryCenter);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });
      return bestIdx;
    }

    function updateActiveCard() {
      const idx = centerMostCardIndex();
      cards.forEach((card, i) => card.classList.toggle('active', i === idx));
    }

    function recenterIfInCloneRegion() {
      const idx = centerMostCardIndex();
      if (idx < 0) return;
      const targetIdx = middleStart + (idx % count);
      if (idx !== targetIdx) {
        cards[targetIdx].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
        updateActiveCard();
      }
    }

    let ticking = false;
    gallery.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveCard();
        ticking = false;
      });
    });

    if ('onscrollend' in window) {
      gallery.addEventListener('scrollend', recenterIfInCloneRegion);
    } else {
      let settleTimer;
      gallery.addEventListener('scroll', () => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(recenterIfInCloneRegion, 120);
      });
    }

    // Tapping a card centers it in the wheel (in case it wasn't already)
    // and pops up its details.
    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        card.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        openDetailFor(GAMES[i % count]);
      });
    });

    // Start centered on the first card of the real (middle) set, so
    // there's already clone sets to swipe into on either side immediately.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cards[middleStart].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
        updateActiveCard();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
