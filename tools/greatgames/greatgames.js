// ═══════════════════════════════════════════════════════════════════
//  You Should Play These Games — renders the swipeable cover gallery
//  and the stacked detail sections from the GAMES data (games.js),
//  and highlights whichever cover card is centered while swiping.
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
    const card = document.createElement('a');
    card.className = 'gg-card';
    card.href = `#${game.slug}`;
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

  function buildDetail(game, index, all) {
    const section = document.createElement('section');
    section.className = 'gg-detail';
    section.id = game.slug;
    section.style.setProperty('--accent', game.accent);

    const inner = document.createElement('div');
    inner.className = 'gg-detail-inner';
    inner.appendChild(buildCover(game, { big: true }));

    const body = document.createElement('div');
    body.className = 'gg-detail-body';

    const eyebrow = document.createElement('div');
    eyebrow.className = 'gg-detail-eyebrow';
    eyebrow.textContent = `Game ${String(index + 1).padStart(2, '0')} of ${all.length}`;
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

    const navRow = document.createElement('div');
    navRow.className = 'gg-detail-nav';
    const back = document.createElement('a');
    back.href = '#gallery';
    back.textContent = '↑ Back to gallery';
    navRow.appendChild(back);
    const next = all[(index + 1) % all.length];
    const nextLink = document.createElement('a');
    nextLink.href = `#${next.slug}`;
    nextLink.textContent = `Next: ${next.title} ↓`;
    navRow.appendChild(nextLink);
    body.appendChild(navRow);

    inner.appendChild(body);
    section.appendChild(inner);
    return section;
  }

  // The gallery is rendered as [clone set][real set][clone set] so that
  // swiping past either end reveals the wraparound neighbour (last game
  // appears before the first, and vice versa). Once the swipe settles
  // inside a clone set, we silently re-center on the equivalent real
  // card — same content, so the jump is invisible — giving the illusion
  // of a wheel that scrolls forever in either direction.
  function render() {
    const gallery = document.getElementById('gallery');
    const details = document.getElementById('details');
    if (!gallery || !details || typeof GAMES === 'undefined') return;

    const count = GAMES.length;
    const cards = [];
    [GAMES, GAMES, GAMES].forEach((set, setIndex) => {
      set.forEach((game) => {
        const card = buildCard(game, { clone: setIndex !== 1 });
        gallery.appendChild(card);
        cards.push(card);
      });
    });
    GAMES.forEach((game, i) => details.appendChild(buildDetail(game, i, GAMES)));

    const ratios = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.set(entry.target, entry.intersectionRatio));
        let bestCard = null;
        let bestRatio = 0;
        ratios.forEach((ratio, card) => {
          if (ratio > bestRatio) { bestRatio = ratio; bestCard = card; }
        });
        cards.forEach((card) => card.classList.toggle('active', card === bestCard));
      },
      { root: gallery, threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
    );
    cards.forEach((card) => observer.observe(card));

    // Computed fresh (not read from the IntersectionObserver, which
    // updates asynchronously and can race with 'scrollend') so the wrap
    // check always reflects exactly where the gallery has actually settled.
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

    function recenterIfInCloneRegion() {
      const idx = centerMostCardIndex();
      if (idx < 0) return;
      let realIdx = null;
      if (idx < count) realIdx = idx + count;
      else if (idx >= count * 2) realIdx = idx - count;
      if (realIdx !== null) {
        cards[realIdx].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
      }
    }

    if ('onscrollend' in window) {
      gallery.addEventListener('scrollend', recenterIfInCloneRegion);
    } else {
      let settleTimer;
      gallery.addEventListener('scroll', () => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(recenterIfInCloneRegion, 120);
      });
    }

    // Start centered on the first card of the real (middle) set, so
    // there's already a clone set to swipe backward into immediately.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cards[count].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
