import { bindThemeToggle } from './theme.js';
import { initMode, bindModeToggle } from './mode.js';
import { loadGlossary, mountHoverCards } from './glossary.js';
import { mountVoices } from './voice.js';
import { initReveals, initSections } from './scroll.js';
import { mountAll } from './transcript-player.js';
import { mountAllCompares } from './compare.js';
import { initColour } from './stripes.js';
import { mountRail } from './rail.js';

initMode();
bindThemeToggle(document.querySelector('[data-theme-toggle]'));
bindModeToggle(document.querySelector('[data-mode-toggle]'));

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('[data-nav-toggle]');
if (navToggle && header) {
  navToggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// the site-wide skin: the page tint scrubs between the screens' hues,
// and the rail shows one dot per screen (filled when seen, solid when its activity is done)
const screens = Array.from(document.querySelectorAll('.screen'));
initReveals();
initSections();
initColour(screens, { reducedMotion });
const rail = document.querySelector('[data-rail]');
if (rail && screens.length) mountRail(rail, screens);
mountAll(document, { baseUrl: './data/transcripts/' });
mountAllCompares(document, { baseUrl: './data/transcripts/' });

// glossary hover cards on every marked term
loadGlossary('./data/glossary.json').then((g) => mountHoverCards(g)).catch(() => { /* no glossary, no cards */ });

// student quotes, where a page has a slot for one
mountVoices(document).catch(() => { /* no quotes file, no quotes */ });
