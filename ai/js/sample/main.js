import { bindThemeToggle } from '../theme.js';
import { initMode, bindModeToggle } from '../mode.js';
import { loadGlossary, mountHoverCards } from '../glossary.js';
import { mountVoices } from '../voice.js';
import { initReveals } from '../scroll.js';
import { mountAllCompares } from '../compare.js';
import { initColour } from '../stripes.js';
import { mountRail } from '../rail.js';
import { mountScorecard } from './scorecard.js';
import { mountRain } from './rain.js';
import { typeInto } from './typed.js';
import { mountWall } from './wall.js';
import { mountTimeline } from './timeline.js';
import { mountRedated } from './redated.js';
import { mountMap } from './map.js';
import { mountRecap, mountNextBand } from './recap.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const screens = Array.from(document.querySelectorAll('.screen'));
initReveals();
initColour(screens, { reducedMotion });
mountRail(document.querySelector('[data-rail]'), screens);
mountAllCompares(document, { baseUrl: './data/transcripts/' });
for (const el of document.querySelectorAll('[data-scorecard]')) mountScorecard(el, { reducedMotion });

// screen 1: rain behind the hero, and the title types itself
for (const host of document.querySelectorAll('[data-rain]')) mountRain(host, { reducedMotion });
const typed = document.querySelector('[data-typed]');
if (typed) {
  typed.addEventListener('typed:done', () => document.querySelectorAll('.after-typed').forEach((el, i) => {
    el.style.transitionDelay = (i * 120) + 'ms';
    el.classList.add('is-shown');
  }), { once: true });
  typeInto(typed, { reducedMotion, delay: 400 });
}

// screen 4: the wall and the window
for (const el of document.querySelectorAll('[data-wall]')) mountWall(el, { reducedMotion });

// screen 2: the scrubbed timeline
for (const el of document.querySelectorAll('[data-timeline]')) mountTimeline(el, { reducedMotion });

// screen 6: the re-dated post
for (const el of document.querySelectorAll('[data-redated]')) mountRedated(el, { reducedMotion });

// screen 7: the model map
for (const el of document.querySelectorAll('[data-map]')) mountMap(el, { reducedMotion });

// screens 8 and 9: the recap and the hand-off band
for (const el of document.querySelectorAll('[data-recap]')) mountRecap(el, { reducedMotion });
for (const el of document.querySelectorAll('[data-next-band]')) mountNextBand(el, { reducedMotion });

// glossary hover cards on every marked term
loadGlossary('./data/glossary.json').then((g) => mountHoverCards(g)).catch(() => { /* no glossary, no cards */ });

// student quotes, where a page has a slot for one
mountVoices(document).catch(() => { /* no quotes file, no quotes */ });
