// ═══════════════════════════════════════════════════════════════════
//  You Should Play These Games.
//
//  Swipe/scroll sideways through the wheel of cover cards to browse.
//  Tap or click a card to pop up its details in a modal (same content
//  and colors as the card); close it by tapping the X or clicking away
//  to return to the wheel. An expandable filter bar (System, Type,
//  Violence, Age, Educational Focus) narrows which games appear in
//  the wheel.
// ═══════════════════════════════════════════════════════════════════
(function () {
  const PLACEHOLDER_GLYPH = '\u{1F3AE}'; // 🎮 — obvious stand-in until real cover art is added.

  // ── FILTER CATEGORIES ────────────────────────────────────────────
  // `field` is the matching property on each game object in games.js.
  // `cumulative` (age only) means selecting an option shows that option
  // AND every "younger" option too, rather than an exact-match toggle.
  const FILTER_CATEGORIES = [
    { key: "system", label: "System", field: "platforms", options: ["PC", "Mac", "Switch", "Mobile", "Consoles"] },
    { key: "type", label: "Type", field: "type", options: ["Action", "Puzzle", "Strategy", "RPG", "Simulation", "Sandbox/Building", "Platformer", "Sports/Racing", "Party/Multiplayer", "Educational"] },
    { key: "violence", label: "Violence", field: "violence", options: ["None", "Some", "Lots"] },
    { key: "age", label: "Age", field: "age", options: ["7+", "10+", "13+", "16+"], cumulative: true },
    { key: "eduFocus", label: "Educational Focus", field: "eduFocus", options: ["Design & Engineering", "Logic & Math", "Creativity", "Strategy & Planning", "History & Culture"] },
  ];
  const AGE_ORDER = ["7+", "10+", "13+", "16+"];

  const filterState = {};
  FILTER_CATEGORIES.forEach((cat) => { filterState[cat.key] = new Set(); });

  function matchesFilters(game) {
    return FILTER_CATEGORIES.every((cat) => {
      const selected = filterState[cat.key];
      if (selected.size === 0) return true;
      if (cat.cumulative) {
        const maxRank = Math.max(...Array.from(selected).map((v) => AGE_ORDER.indexOf(v)));
        return AGE_ORDER.indexOf(game[cat.field]) <= maxRank;
      }
      const values = Array.isArray(game[cat.field]) ? game[cat.field] : [game[cat.field]];
      return values.some((v) => selected.has(v));
    });
  }

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

  function buildTagRow(game) {
    const row = document.createElement('div');
    row.className = 'gg-tag-row';
    const tags = [
      ...(game.platforms || []),
      ...(game.type || []),
      game.violence ? `${game.violence} Violence` : null,
      game.age ? `Age ${game.age}` : null,
      ...(game.eduFocus || []),
    ].filter(Boolean);
    tags.forEach((t) => {
      const pill = document.createElement('span');
      pill.className = 'gg-tag-pill';
      pill.textContent = t;
      row.appendChild(pill);
    });
    return row;
  }

  function renderDetailContent(container, game) {
    container.replaceChildren();

    const inner = document.createElement('div');
    inner.className = 'gg-detail-inner';
    inner.appendChild(buildCover(game, { big: true }));

    const body = document.createElement('div');
    body.className = 'gg-detail-body';

    body.appendChild(buildTagRow(game));

    const title = document.createElement('h2');
    title.className = 'gg-detail-title';
    title.textContent = game.title;
    body.appendChild(title);

    const tagline = document.createElement('p');
    tagline.className = 'gg-detail-tagline';
    tagline.textContent = game.tagline;
    body.appendChild(tagline);

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
    const filtersToggle = document.getElementById('filtersToggle');
    const filtersCollapse = document.getElementById('filtersCollapse');
    const filtersPanel = document.getElementById('filtersPanel');
    const filtersCount = document.getElementById('filtersCount');
    const filtersClear = document.getElementById('filtersClear');
    if (!gallery || !modal || !modalBox || !modalContent || !filtersPanel || typeof GAMES === 'undefined') return;

    let cards = [];
    let count = 0;
    let middleStart = 0;

    function openDetailFor(game) {
      modalBox.style.setProperty('--accent', game.accent);
      renderDetailContent(modalContent, game);
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
      if (count === 0) return;
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

    // Rebuilds the wheel from scratch for the given (already-filtered)
    // list of games — called on load and every time a filter changes.
    function buildWheel(gamesList) {
      gallery.replaceChildren();
      cards = [];
      count = gamesList.length;
      middleStart = count * MIDDLE_COPY;

      if (count === 0) {
        const empty = document.createElement('div');
        empty.className = 'gg-empty-state';
        empty.textContent = 'No games match these filters.';
        gallery.appendChild(empty);
        return;
      }

      for (let setIndex = 0; setIndex < COPIES; setIndex++) {
        gamesList.forEach((game) => {
          const card = buildCard(game, { clone: setIndex !== MIDDLE_COPY });
          card.addEventListener('click', () => {
            card.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
            openDetailFor(game);
          });
          gallery.appendChild(card);
          cards.push(card);
        });
      }

      // Start centered on the first card of the real (middle) set, so
      // there's already clone sets to swipe into on either side immediately.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cards[middleStart].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
          updateActiveCard();
        });
      });
    }

    function applyFilters() {
      buildWheel(GAMES.filter(matchesFilters));
    }

    // ── FILTER BAR ────────────────────────────────────────────────
    function refreshChipStates() {
      filtersPanel.querySelectorAll('.gg-filter-chip').forEach((chip) => {
        const selected = filterState[chip.dataset.category].has(chip.dataset.value);
        chip.setAttribute('aria-pressed', String(selected));
      });
    }

    function updateFilterCount() {
      const total = FILTER_CATEGORIES.reduce((sum, cat) => sum + filterState[cat.key].size, 0);
      filtersCount.textContent = String(total);
      filtersCount.hidden = total === 0;
      filtersClear.hidden = total === 0;
    }

    function toggleFilterValue(cat, value) {
      const set = filterState[cat.key];
      if (cat.cumulative) {
        // Ordinal threshold, not an independent toggle: picking a value
        // replaces any previous one; picking the same value again clears it.
        const wasOnlySelection = set.has(value) && set.size === 1;
        set.clear();
        if (!wasOnlySelection) set.add(value);
      } else if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      refreshChipStates();
      updateFilterCount();
      applyFilters();
    }

    FILTER_CATEGORIES.forEach((cat) => {
      const group = document.createElement('div');
      group.className = 'gg-filter-group';

      const label = document.createElement('span');
      label.className = 'gg-filter-label';
      label.textContent = cat.label;
      group.appendChild(label);

      cat.options.forEach((opt) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'gg-filter-chip';
        chip.textContent = opt;
        chip.dataset.category = cat.key;
        chip.dataset.value = opt;
        chip.setAttribute('aria-pressed', 'false');
        chip.addEventListener('click', () => toggleFilterValue(cat, opt));
        group.appendChild(chip);
      });

      filtersPanel.appendChild(group);
    });

    filtersToggle.addEventListener('click', () => {
      const expanded = filtersToggle.getAttribute('aria-expanded') === 'true';
      filtersToggle.setAttribute('aria-expanded', String(!expanded));
      filtersCollapse.classList.toggle('expanded', !expanded);
    });

    filtersClear.addEventListener('click', () => {
      FILTER_CATEGORIES.forEach((cat) => filterState[cat.key].clear());
      refreshChipStates();
      updateFilterCount();
      applyFilters();
    });

    buildWheel(GAMES);
  }

  document.addEventListener('DOMContentLoaded', render);
})();
