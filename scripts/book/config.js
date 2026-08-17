/* config.js — the editable surface of the book build.
   Change things here rather than in build.js or in generated output, so a
   rebuild after revising a topic page stays a one-command operation. */

module.exports = {
  kicker: 'contrapaul / edu',
  author: 'Paul Kwiatkowski',

  /* The two documents built from one extraction pass. */
  variants: [
    {
      name: 'student',
      title: 'Design Technology',
      subtitle: 'A study companion for the IB Diploma Programme',
      showAnswers: false,
      assessmentOnly: false,
    },
    {
      name: 'answers',
      title: 'Answer Key',
      subtitle: 'Teacher support materials for the Design Technology study companion',
      showAnswers: true,
      assessmentOnly: true,
    },
  ],

  /* Section ids the answer key keeps. Everything else is dropped there. */
  assessmentSections: ['quiz', 'paper2'],

  /* Pages in curriculum/dp/ to keep out of the book. */
  exclude: ['testpage.html'],

  /* Site CSS the book inherits, so the PDF matches the site by construction.
     book.css loads after these and overrides what does not suit print. */
  siteStylesheets: [
    'style.css',
    'curriculum/curriculum.css',
  ],

  /* Where book.css finds the Lexend webfonts, relative to the repo root. */
  fontDir: 'Fonts/Lexend Family/webfonts',

  /* Interactive elements replaced by an "available online" callout. */
  widgetSelectors: [
    '.drag-sort',
    '.live-calc',
    '.diagram-widget',
    '.compare-slider-widget',
  ],

  /* Screen-only controls: removed outright, no callout. */
  stripSelectors: [
    '.quiz-submit-btn',
    '.case-modal-close',
    '.tool-btn',
    '.tool-btn-sm',
    '.tbl-preset-btn',
    '.curr-share',
    'script',
    'noscript',
  ],

  /* Prose that instructs the reader to click something. Applied as a plain
     substring swap inside the matched elements. `replace` is either a string
     or an object keyed by variant name, since the student book and the key
     need to promise different things. */
  textRewrites: [
    {
      selector: '.quiz-intro',
      find: 'Select one answer per question, then click "Check all answers" to see your score and the explanations.',
      replace: {
        student: 'Answers and explanations are in the answer key.',
        answers: 'Correct options are marked, with the explanation beneath each question.',
      },
    },
  ],
};
