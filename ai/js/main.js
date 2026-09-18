import { bindThemeToggle } from './theme.js';
import { initMode, bindModeToggle } from './mode.js';
import { initReveals, initSections } from './scroll.js';
import { mountAll } from './transcript-player.js';
import { mountAllCompares } from './compare.js';

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

initReveals();
initSections();
mountAll(document, { baseUrl: './data/transcripts/' });
mountAllCompares(document, { baseUrl: './data/transcripts/' });
