/* ============================================================
   About page: the story motion and the read-through
   ------------------------------------------------------------
   - the hero title types itself in, then the copy below steps
     in one line at a time
   - the "one sentence" assembles word by word as you scroll
     (pinned when the viewport allows, plain otherwise)
   - the end moment plays once, when the reader actually
     reaches the end: the thanks line types, the stamp lands,
     the closing words arrive
   - the rail dots fill as each part is read through, so the
     rail is the page's own read receipt

   Reduced motion and teacher mode get the same content, shown
   without movement.
   ============================================================ */

import { typeInto } from '../typed.js';
import { load, markDone } from '../progress.js';
import { centreSticky } from '../scroll.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const teacher = document.documentElement.getAttribute('data-mode') === 'teacher';

/* ----- the hero: the title types itself in ----- */

const typed = document.querySelector('[data-typed]');
if (typed) {
  typed.addEventListener('typed:done', () => {
    typed.closest('.screen').querySelectorAll('.after-typed').forEach((el, i) => {
      el.style.transitionDelay = (i * 120) + 'ms';
      el.classList.add('is-shown');
    });
  }, { once: true });
  typeInto(typed, { reducedMotion, delay: 400 });
}

/* ----- the one sentence: it assembles as you scroll ----- */

const assemble = document.querySelector('[data-assemble]');
if (assemble) {
  const line = assemble.querySelector('.assemble-line');
  const words = line.textContent.trim().split(/\s+/);
  line.textContent = '';
  for (const w of words) {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = w;
    line.append(s, ' ');
  }

  assemble.classList.add('assemble-stage');
  const pinned = !reducedMotion && !teacher && window.innerWidth > 900 && window.gsap && window.ScrollTrigger;
  if (pinned) {
    assemble.classList.add('is-pinned');
    const scene = document.createElement('div');
    scene.className = 'assemble-scene';
    assemble.appendChild(scene);
    scene.appendChild(line);
    centreSticky(scene);
    const tl = window.gsap.timeline({
      scrollTrigger: { trigger: assemble, start: 'top top', end: '+=100%', scrub: true },
      defaults: { ease: 'none' },
    });
    tl.fromTo(line.querySelectorAll('.w'),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 });
  }
}

/* ----- the end moment: it plays only when you reach the end ----- */

const end = document.getElementById('end');
if (end) {
  const moment = end.querySelector('.end-moment');
  const endLine = end.querySelector('.end-line');
  const earned = !!(load().done && load().done[end.id]);
  if (!earned) moment.classList.add('is-pending');

  let played = false;
  function playEnd() {
    if (played) return;
    played = true;
    markDone(end.id);
    if (earned || reducedMotion) {
      // already read it, or no motion: everything simply appears
      moment.classList.remove('is-pending');
      moment.classList.add('is-playing');
      return;
    }
    moment.classList.add('is-playing');
    typeInto(endLine, { cps: 14, delay: 250 });
    endLine.addEventListener('typed:done', () => {
      moment.classList.remove('is-pending');
    }, { once: true });
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) playEnd();
  }, { threshold: 0.5 });
  io.observe(end);

  // sweep for embedded browsers where intersection observers misbehave
  let lastY = -1;
  addEventListener('scroll', () => {
    if (window.scrollY === lastY) return;
    lastY = window.scrollY;
    const r = end.getBoundingClientRect();
    if (r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5) playEnd();
  }, { passive: true });
}

/* ----- the read-through: the rail fills as you read ----- */
/* A part counts as read once it has left the top half of the
   page. The last part is read when half of it is on screen,
   which is the same moment the end plays. */

const screens = [...document.querySelectorAll('main .screen')];
if (screens.length) {
  const lastId = screens[screens.length - 1].id;
  const marked = new Set();
  function readThrough(s) {
    if (!s || s.id === lastId || marked.has(s.id)) return;
    marked.add(s.id);
    markDone(s.id);
  }
  const seen = new Set();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { seen.add(e.target.id); continue; }
      if (seen.has(e.target.id)) readThrough(e.target);
    }
  }, { rootMargin: '0px 0px -50% 0px' });
  screens.forEach((s) => { if (s.id !== lastId) io.observe(s); });

  // sweep: also covers embedded browsers, and refreshes mid-page
  let lastY = -1;
  function sweep() {
    const mid = innerHeight * 0.5;
    for (const s of screens) if (s.getBoundingClientRect().bottom < mid) readThrough(s);
  }
  requestAnimationFrame(sweep);
  addEventListener('scroll', () => {
    if (window.scrollY === lastY) return;
    lastY = window.scrollY;
    sweep();
  }, { passive: true });
}
