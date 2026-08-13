/* Explorations open as a full overlay on top of the machine. Everything lives
 * on this one page, so a topic is a JSON file plus whatever interactive it
 * asks for, never a separate document.
 *
 * A topic file is a flat list of blocks so the writing controls the pacing:
 *   era          a heading with a paragraph of context
 *   entry        one piece of hardware, with year, spec line and a note
 *   interactive  mounts a module from js/views/
 */

import mountStorageTest from './views/storage-test.js';
import mountDemandChart from './views/demand-chart.js';

const INTERACTIVES = {
  'storage-test': mountStorageTest,
  'demand-chart': mountDemandChart
};

const OVERLAY = document.getElementById('explore');
const TITLE = document.getElementById('explore-title');
const SPAN = document.getElementById('explore-span');
const SCROLL = document.getElementById('explore-scroll');
const INNER = document.getElementById('explore-inner');

const cache = new Map();
let onClose = null;

export async function openTopic(id, returnFocusTo) {
  onClose = returnFocusTo || null;

  let topic = cache.get(id);
  if (!topic) {
    try {
      topic = await fetch(`data/topics/${id}.json`).then(r => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      });
    } catch (err) {
      console.error(`topic ${id} failed to load`, err);
      return;
    }
    cache.set(id, topic);
  }

  render(topic);
  OVERLAY.hidden = false;
  SCROLL.scrollTop = 0;
  document.body.classList.add('is-exploring');
  document.getElementById('explore-back').focus();
}

export function closeTopic() {
  if (OVERLAY.hidden) return;
  OVERLAY.hidden = true;
  document.body.classList.remove('is-exploring');
  if (onClose) onClose.focus();
}

function render(topic) {
  TITLE.textContent = topic.title;
  SPAN.textContent = topic.span || '';
  INNER.textContent = '';

  if (topic.intro) {
    const p = document.createElement('p');
    p.className = 'explore-intro';
    p.textContent = topic.intro;
    INNER.append(p);
  }

  topic.blocks.forEach(block => {
    const node = BUILD[block.type]?.(block);
    if (node) INNER.append(node);
  });
}

const BUILD = {
  era(block) {
    const section = document.createElement('section');
    section.className = 'era';

    if (block.years) {
      const years = document.createElement('p');
      years.className = 'era-years';
      years.textContent = block.years;
      section.append(years);
    }

    const h = document.createElement('h3');
    h.textContent = block.title;
    section.append(h);

    if (block.text) {
      const p = document.createElement('p');
      p.textContent = block.text;
      section.append(p);
    }
    return section;
  },

  entry(block) {
    const row = document.createElement('article');
    row.className = 'entry' + (block.key ? ' is-key' : '');

    const year = document.createElement('div');
    year.className = 'entry-year';
    year.textContent = block.year;
    row.append(year);

    const body = document.createElement('div');

    const name = document.createElement('p');
    name.className = 'entry-name';
    if (block.url) {
      // Wikipedia only. Opens in a new tab so a student reading down the page
      // does not lose their place in the exploration.
      const a = document.createElement('a');
      a.href = block.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = block.name;
      a.title = 'Read about this on Wikipedia';
      name.append(a);
    } else {
      name.textContent = block.name;
    }
    body.append(name);

    if (block.spec) {
      const spec = document.createElement('p');
      spec.className = 'entry-spec';
      spec.textContent = block.spec;
      body.append(spec);
    }

    if (block.shot) body.append(figure(block.shot));

    if (block.text) {
      const text = document.createElement('p');
      text.className = 'entry-text';
      text.textContent = block.text;
      body.append(text);
    }

    row.append(body);
    return row;
  },

  /* A pointer from one topic into another. Some subjects have no counterpart
     in the case, so this is how they are reached. */
  link(block) {
    const wrap = document.createElement('div');
    wrap.className = 'cross-link';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'detail-link';
    btn.textContent = block.label;
    btn.addEventListener('click', () => openTopic(block.to, onClose));
    wrap.append(btn);

    if (block.text) {
      const p = document.createElement('p');
      p.textContent = block.text;
      wrap.prepend(p);
    }
    return wrap;
  },

  interactive(block) {
    const mount = INTERACTIVES[block.id];
    if (!mount) {
      console.warn('unknown interactive', block.id);
      return null;
    }
    const host = document.createElement('div');
    host.className = 'interactive';
    mount(host, block);
    return host;
  }
};

/* Images are captured by hand and dropped into assets/shots/. Until one
   exists, the slot renders as a marked placeholder rather than a broken
   image, so the page is complete either way. */
function figure(shot) {
  const fig = document.createElement('figure');
  fig.className = 'shot';

  if (shot.src) {
    const img = document.createElement('img');
    img.src = `assets/shots/${shot.src}`;
    img.alt = shot.alt || '';
    img.loading = 'lazy';
    fig.append(img);
  } else {
    const box = document.createElement('div');
    box.className = 'placeholder';
    box.textContent = shot.slot || 'image';
    fig.append(box);
  }

  if (shot.caption) {
    const cap = document.createElement('figcaption');
    cap.textContent = shot.caption;
    fig.append(cap);
  }
  return fig;
}

document.getElementById('explore-back').addEventListener('click', closeTopic);

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || OVERLAY.hidden) return;
  // A pinned chart readout is the innermost thing open, so it gets the first
  // Escape and this handler takes the next one.
  if (OVERLAY.querySelector('.chart-tip[data-pinned]')) return;
  closeTopic();
});
