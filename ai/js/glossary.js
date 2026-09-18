/* ============================================================
   Glossary
   ------------------------------------------------------------
   One data file (data/glossary.json) feeds two surfaces:

     1. Hover cards. Any element marked
          <a class="gloss" data-term="token" href="glossary.html#token">
        shows the term's short definition on hover, focus or tap,
        with a link to the full entry. One card element is shared.
     2. The glossary page: every term, its full definition, and
        its "Learn more" links, each entry anchored by id.

   Listeners are delegated from the document, so terms rendered
   later still work. No DOM access at import time.
   ============================================================ */

export async function loadGlossary(url = './data/glossary.json') {
  const data = await (await fetch(url)).json();
  const byId = new Map(data.terms.map((t) => [t.id, t]));
  return { ...data, byId };
}

/** Pure: entries grouped by first letter, for the index. */
export function letterIndex(terms) {
  const groups = new Map();
  for (const t of [...terms].sort((a, b) => a.term.localeCompare(b.term))) {
    const L = t.term[0].toUpperCase();
    if (!groups.has(L)) groups.set(L, []);
    groups.get(L).push(t);
  }
  return groups;
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/* ---------- hover cards ---------- */

export function mountHoverCards(glossary, { doc = document, pagePath = 'glossary.html', strings = { more: 'Full definition' } } = {}) {
  const card = el('div', 'gloss-card');
  card.setAttribute('role', 'tooltip');
  card.hidden = true;
  const title = el('p', 'gloss-card-term');
  const body = el('p', 'gloss-card-short');
  const more = el('a', 'gloss-card-more', strings.more);
  card.append(title, body, more);
  doc.body.appendChild(card);

  let current = null;
  let hideTimer = null;

  const place = (anchor) => {
    const r = anchor.getBoundingClientRect();
    const cw = Math.min(360, window.innerWidth - 24);
    card.style.width = cw + 'px';
    let left = r.left;
    if (left + cw > window.innerWidth - 12) left = window.innerWidth - 12 - cw;
    if (left < 12) left = 12;
    const below = r.bottom + 8;
    const cardH = card.offsetHeight || 120;
    const top = below + cardH > window.innerHeight - 12 && r.top - cardH - 8 > 0 ? r.top - cardH - 8 : below;
    card.style.left = left + window.scrollX + 'px';
    card.style.top = top + window.scrollY + 'px';
  };

  const show = (anchor) => {
    const id = anchor.getAttribute('data-term');
    const t = glossary.byId.get(id);
    if (!t) return;
    clearTimeout(hideTimer);
    current = anchor;
    title.textContent = t.term;
    body.textContent = t.short;
    more.href = pagePath + '#' + t.id;
    card.hidden = false;
    anchor.setAttribute('aria-describedby', 'gloss-card');
    card.id = 'gloss-card';
    place(anchor);
    requestAnimationFrame(() => card.classList.add('is-shown'));
  };
  const hide = () => {
    hideTimer = setTimeout(() => {
      card.classList.remove('is-shown');
      card.hidden = true;
      if (current) current.removeAttribute('aria-describedby');
      current = null;
    }, 120);
  };

  const anchorOf = (t) => (t && t.closest ? t.closest('.gloss[data-term]') : null);
  doc.addEventListener('mouseover', (e) => { const a = anchorOf(e.target); if (a) show(a); });
  doc.addEventListener('mouseout', (e) => { const a = anchorOf(e.target); if (a && !card.contains(e.relatedTarget)) hide(); });
  card.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  card.addEventListener('mouseleave', hide);
  doc.addEventListener('focusin', (e) => { const a = anchorOf(e.target); if (a) show(a); });
  doc.addEventListener('focusout', (e) => { const a = anchorOf(e.target); if (a) hide(); });
  // touch: the first tap opens the card instead of following the link
  doc.addEventListener('click', (e) => {
    const a = anchorOf(e.target);
    if (!a) { if (!card.contains(e.target) && current) { clearTimeout(hideTimer); hide(); } return; }
    if (matchMedia('(hover: none)').matches && current !== a) { e.preventDefault(); show(a); }
  });
  doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current) { clearTimeout(hideTimer); hide(); } });
  window.addEventListener('scroll', () => { if (current) place(current); }, { passive: true });

  return { card, show, hide };
}

/* ---------- the glossary page ---------- */

export function renderGlossary(glossary, root, { strings = { learnMore: 'Learn more', checked: 'Links checked' } } = {}) {
  root.innerHTML = '';
  const groups = letterIndex(glossary.terms);

  const index = el('nav', 'gloss-index');
  index.setAttribute('aria-label', 'Terms by letter');
  for (const [L, terms] of groups) {
    const a = el('a', 'gloss-index-letter', L);
    a.href = '#letter-' + L;
    index.appendChild(a);
    void terms;
  }
  root.appendChild(index);

  for (const [L, terms] of groups) {
    const section = el('section', 'gloss-group');
    section.id = 'letter-' + L;
    section.appendChild(el('h2', 'gloss-letter', L));
    for (const t of terms) {
      const entry = el('article', 'gloss-entry');
      entry.id = t.id;
      const h = el('h3', 'gloss-term');
      const link = el('a', null, t.term);
      link.href = '#' + t.id;
      h.appendChild(link);
      entry.append(h, el('p', 'gloss-full', t.full));
      if (t.links && t.links.length) {
        const p = el('p', 'gloss-links');
        p.appendChild(document.createTextNode(strings.learnMore + ': '));
        t.links.forEach((l, i) => {
          if (i > 0) p.appendChild(document.createTextNode(', '));
          const a = el('a', null, l.source + ' “' + l.title + '”');
          a.href = l.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
          p.appendChild(a);
        });
        entry.appendChild(p);
      }
      section.appendChild(entry);
    }
    root.appendChild(section);
  }
  root.appendChild(el('p', 'gloss-checked', strings.checked + ' ' + glossary.checkedOn + '.'));

  // arriving with a hash: highlight that entry
  const mark = (scroll) => {
    for (const e of root.querySelectorAll('.gloss-entry.is-target')) e.classList.remove('is-target');
    const id = location.hash.slice(1);
    const target = id && root.querySelector('#' + CSS.escape(id) + '.gloss-entry');
    if (target) {
      target.classList.add('is-target');
      if (scroll) target.scrollIntoView({ block: 'start' });   // the entry did not exist when the browser tried
    }
  };
  window.addEventListener('hashchange', () => mark(false));
  mark(true);
}
