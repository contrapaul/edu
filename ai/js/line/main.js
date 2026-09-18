import { mountCards } from './cards.js';
import { mountCite } from './cite.js';
import { mountCases } from './cases.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
for (const el of document.querySelectorAll('[data-cards]')) mountCards(el, { reducedMotion });
for (const el of document.querySelectorAll('[data-cite]')) mountCite(el);
for (const el of document.querySelectorAll('[data-cases]')) mountCases(el, { reducedMotion });
