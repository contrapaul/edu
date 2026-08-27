/* ═══════════════════════════════════════════════════════════════════
   GAME MECHANICS CATALOG: behaviour.
   Renders the grid, runs the filters, drives the detail window.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const grid = $("grid"), empty = $("empty"), count = $("count");
  const modal = $("modal"), modalBox = $("modalBox"), modalScroll = $("modalScroll");
  const prevBtn = $("prevBtn"), nextBtn = $("nextBtn"), navPos = $("navPos");
  const searchInput = $("search"), clearBtn = $("clearBtn");

  const state = { search: "", family: new Set(), components: new Set(), complexity: new Set(), playerFit: new Set() };
  let visible = [];        // mechanics currently passing the filters
  let openIndex = -1;      // index into `visible`
  let lastFocused = null;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ── FILTER CHIPS ─────────────────────────────────────────────── */

  function chip(key, value, label, color) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "mc-chip";
    b.setAttribute("aria-pressed", "false");
    b.dataset.key = key;
    b.dataset.value = value;
    if (color) {
      b.style.setProperty("--chip-color", color);
      b.innerHTML = '<span class="mc-chip-dot"></span>' + esc(label);
    } else {
      b.textContent = label;
    }
    b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", on ? "false" : "true");
      on ? state[key].delete(value) : state[key].add(value);
      apply();
    });
    return b;
  }

  function buildChips() {
    const famBox = $("chips-family");
    Object.entries(FAMILIES).forEach(([key, f]) => famBox.appendChild(chip("family", key, f.short, f.color)));
    ["components", "complexity", "playerFit"].forEach((key) => {
      const box = $("chips-" + key);
      FILTERS[key].forEach((v) => box.appendChild(chip(key, v, v, null)));
    });
  }

  /* ── FILTERING ────────────────────────────────────────────────── */

  function matches(m) {
    if (state.family.size && !state.family.has(m.family)) return false;
    if (state.complexity.size && !state.complexity.has(m.complexity)) return false;
    if (state.components.size && !m.components.some((c) => state.components.has(c))) return false;
    if (state.playerFit.size && !m.playerFit.some((p) => state.playerFit.has(p))) return false;
    if (state.search) {
      const hay = [m.name, m.blurb, m.alsoCalled.join(" "), FAMILIES[m.family].name, m.games.map((g) => g.title).join(" ")]
        .join(" ").toLowerCase();
      if (!hay.includes(state.search)) return false;
    }
    return true;
  }

  function activeCount() {
    return state.family.size + state.components.size + state.complexity.size + state.playerFit.size + (state.search ? 1 : 0);
  }

  function apply() {
    visible = MECHANICS.filter(matches);
    render();
    const n = visible.length, total = MECHANICS.length;
    count.textContent = n === total ? `${total} mechanics` : `${n} of ${total} mechanics`;
    empty.hidden = n > 0;
    clearBtn.hidden = activeCount() === 0;
  }

  function clearAll() {
    state.search = "";
    searchInput.value = "";
    ["family", "components", "complexity", "playerFit"].forEach((k) => state[k].clear());
    document.querySelectorAll('.mc-chip[aria-pressed="true"]').forEach((c) => c.setAttribute("aria-pressed", "false"));
    apply();
  }

  /* ── GRID ─────────────────────────────────────────────────────── */

  /* Some family looks need extra layers that cannot be done with the
     two pseudo-elements the card already spends on its scrim and flap. */
  const FAM_LAYERS = {
    chance: '<span class="mc-riso-a"></span><span class="mc-riso-b"></span>',
    cards:  '<span class="mc-fan-a"></span><span class="mc-fan-b"></span>',
    hidden: '<span class="mc-frost-veil"></span>',
    fair:   '<span class="mc-chrome-sheen"></span>',
    goals:  '<span class="mc-bulbs"></span>'
  };

  /* A diagram whose content reaches past its declared viewBox would be
     clipped by the card or the panel. Rather than trust every viewBox by
     hand, grow it to fit whatever was actually drawn. Never shrinks it,
     so the intended framing is kept. */
  function fitDiagram(svg) {
    if (!svg) return;
    dgWrapText(svg);
    let box;
    try { box = svg.getBBox(); } catch (e) { return; }
    if (!box || !box.width) return;
    const vb = svg.viewBox.baseVal;
    const w = Math.max(vb.width, Math.ceil(box.x + box.width) + 2);
    const h = Math.max(vb.height, Math.ceil(box.y + box.height) + 2);
    if (w !== vb.width || h !== vb.height) svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  }

  function fitAll(root) {
    (root || document).querySelectorAll(".mc-card-art svg, .mc-slot-diagram svg").forEach(fitDiagram);
  }

  function render() {
    grid.innerHTML = "";
    visible.forEach((m, i) => {
      const fam = FAMILIES[m.family];
      const card = document.createElement("button");
      card.type = "button";
      card.className = "mc-card " + fam.cls;
      card.dataset.index = i;
      card.style.setProperty("--fam-color", fam.color);
      card.setAttribute("aria-label", m.name + ". " + m.blurb);
      /* The card wears a quiet, wordless copy of its own diagram. The
         labels are hidden in CSS, so what is left is a shape that hints
         at the mechanic before anyone opens anything. */
      const art = m.media.diagram && DIAGRAMS[m.media.diagram]
        ? '<span class="mc-card-art" aria-hidden="true">' + DIAGRAMS[m.media.diagram]() + "</span>"
        : "";
      card.innerHTML =
        (FAM_LAYERS[m.family] || "") + art +
        '<span class="mc-card-top">' +
          '<span class="mc-card-fam">' + esc(fam.short) + "</span>" +
          (m.origin === "video game" ? '<span class="mc-card-origin">VIDEO GAME</span>' : "") +
        "</span>" +
        '<span class="mc-card-body">' +
          '<span class="mc-card-title">' + esc(m.name) + "</span>" +
          '<span class="mc-card-blurb">' + esc(m.blurb) + "</span>" +
        "</span>";
      card.addEventListener("click", () => open(i));
      grid.appendChild(card);
    });
    fitAll(grid);
  }

  /* ── DETAIL WINDOW ────────────────────────────────────────────── */

  function slot(kind, content, need, caption) {
    if (content) {
      return '<div class="mc-slot">' + content +
        (caption ? '<p class="mc-slot-caption">' + esc(caption) + "</p>" : "") + "</div>";
    }
    if (!need || /^not needed/i.test(need)) return "";

    /* ── PLACEHOLDERS HIDDEN ──────────────────────────────────
       Empty photo and video slots are switched off while the real
       media is being produced. Until then they ate a large part of
       every panel to promise something that is not there yet.

       A slot with an actual file still shows, through the `content`
       branch above, so The Coin keeps its card image.

       To bring the placeholders back, delete the `return "";` line
       below and uncomment the block under it. The task list in
       tasks.md is unaffected either way; it reads data.js, not this.
       ────────────────────────────────────────────────────────── */
    return "";

    /*
    return '<div class="mc-slot mc-slot-todo"><div class="mc-slot-empty">' +
      '<span class="mc-slot-kind">' + kind + " to come</span>" +
      '<p class="mc-slot-need">' + esc(need) + "</p></div></div>";
    */
  }

  function detailHTML(m) {
    const fam = FAMILIES[m.family];
    let h = "";

    h += '<div class="mc-detail-head" style="--fam-color:' + fam.color + '">';
    h += '<p class="mc-detail-fam">' + esc(fam.name) + "</p>";
    h += '<h2 id="modalTitle">' + esc(m.name) + "</h2>";
    if (m.alsoCalled.length) h += '<p class="mc-detail-alias">Also called: ' + esc(m.alsoCalled.join(", ")) + "</p>";
    h += '<div class="mc-detail-meta">';
    h += '<span class="mc-meta-tag">' + esc(m.complexity) + " to build</span>";
    m.components.forEach((c) => { h += '<span class="mc-meta-tag">' + esc(c) + "</span>"; });
    m.playerFit.forEach((p) => { h += '<span class="mc-meta-tag">' + esc(p) + "</span>"; });
    if (m.origin === "video game") h += '<span class="mc-meta-tag">From a video game</span>';
    h += "</div></div>";

    h += '<div class="mc-sec"><h3>What it is</h3>' + m.whatItIs.map((p) => "<p>" + esc(p) + "</p>").join("") + "</div>";

    h += '<div class="mc-sec"><h3>How it works in play</h3><ol class="mc-steps">' +
      m.howItWorks.map((s) => "<li>" + esc(s) + "</li>").join("") + "</ol></div>";

    const dg = m.media.diagram && DIAGRAMS[m.media.diagram] ? DIAGRAMS[m.media.diagram]() : null;
    const media =
      (dg ? '<div class="mc-slot mc-slot-diagram">' + dg + "</div>" : "") +
      slot("Photo", m.media.image ? '<img src="' + esc(m.media.image.src) + '" alt="' + esc(m.media.image.alt) + '">' : null, m.media.imageNeed, m.media.image && m.media.image.caption) +
      slot("Video", m.media.video ? '<iframe src="' + esc(m.media.video.src) + '" title="' + esc(m.name) + '" allowfullscreen loading="lazy"></iframe>' : null, m.media.videoNeed, m.media.video && m.media.video.caption);
    if (media) h += '<div class="mc-sec"><h3>See it</h3><div class="mc-media">' + media + "</div></div>";

    h += '<div class="mc-sec"><h3>Games that use it</h3><div class="mc-games">' +
      m.games.map((g) => '<div class="mc-game"><p class="mc-game-title">' + esc(g.title) + '</p><p class="mc-game-note">' + esc(g.note) + "</p></div>").join("") +
      "</div></div>";

    h += '<div class="mc-sec"><h3>Watch out for</h3><ul class="mc-warn">' +
      m.watchOut.map((w) => "<li>" + esc(w) + "</li>").join("") + "</ul></div>";

    h += '<div class="mc-sec"><h3>Try this in your game</h3><div class="mc-try"><p>' + esc(m.tryThis) + "</p></div></div>";

    if (m.links.length) {
      h += '<div class="mc-sec"><h3>Find out more</h3><div class="mc-links">' +
        m.links.map((l) =>
          '<a class="mc-link" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="mc-link-kind">' + esc(l.kind) + "</span>" +
          '<span class="mc-link-label">' + esc(l.label) + "</span>" +
          (l.vpn ? '<span class="mc-link-vpn" title="This site may not load without a VPN">VPN</span>' : "") +
          "</a>").join("") +
        "</div></div>";
    }
    return h;
  }

  function show(i) {
    const m = visible[i];
    openIndex = i;
    modalBox.style.setProperty("--fam-color", FAMILIES[m.family].color);
    modalScroll.innerHTML = detailHTML(m);
    fitAll(modalScroll);
    modalScroll.scrollTop = 0;
    navPos.textContent = (i + 1) + " / " + visible.length;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === visible.length - 1;
    history.replaceState(null, "", "#" + m.slug);
  }

  function open(i) {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    show(i);
    modalBox.querySelector(".mc-modal-close").focus();
  }

  function close() {
    const wasOn = openIndex;
    modal.hidden = true;
    document.body.style.overflow = "";
    openIndex = -1;
    history.replaceState(null, "", location.pathname + location.search);
    /* Return focus to the card just being read, not the one that opened
       the window, since the arrows may have moved on since then. */
    const card = grid.children[wasOn];
    if (card) card.focus();
    else if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
  }

  function step(d) {
    const i = openIndex + d;
    if (i >= 0 && i < visible.length) show(i);
  }

  /* Keep tabbing inside the dialog while it is open. */
  function trap(e) {
    if (e.key !== "Tab" || modal.hidden) return;
    const items = modalBox.querySelectorAll('button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])');
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ── WIRING ───────────────────────────────────────────────────── */

  buildChips();
  apply();

  /* Text is measured above, so the fit is only final once the real fonts
     have replaced the fallbacks. */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitAll());

  searchInput.addEventListener("input", () => { state.search = searchInput.value.trim().toLowerCase(); apply(); });
  clearBtn.addEventListener("click", clearAll);
  document.querySelectorAll("[data-clear-all]").forEach((b) => b.addEventListener("click", clearAll));

  $("randomBtn").addEventListener("click", () => {
    if (visible.length) open(Math.floor(Math.random() * visible.length));
  });

  const moreToggle = $("moreToggle"), more = $("moreFilters");
  moreToggle.addEventListener("click", () => {
    const on = moreToggle.getAttribute("aria-expanded") === "true";
    moreToggle.setAttribute("aria-expanded", on ? "false" : "true");
    more.classList.toggle("open", !on);
  });

  modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", close));
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else trap(e);
  });

  /* Deep link straight to one mechanic. */
  if (location.hash) {
    const i = visible.findIndex((m) => m.slug === location.hash.slice(1));
    if (i > -1) open(i);
  }
})();
