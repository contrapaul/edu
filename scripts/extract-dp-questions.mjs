/* extract-dp-questions.mjs
   Reads the quiz block out of every DP topic page and writes the flat question
   bank the review tool at curriculum/dp/review/ fetches at runtime.

   Run by hand after editing a quiz on any topic page:
     node scripts/extract-dp-questions.mjs

   Nothing builds at deploy time; the JSON this writes is committed source. */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DP = join(ROOT, 'curriculum', 'dp');
const OUT = join(DP, 'review', 'questions.json');

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  middot: '·', mdash: '—', ndash: '–', hellip: '…',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  deg: '°', times: '×', divide: '÷', micro: 'µ',
  plusmn: '±', frac12: '½', frac14: '¼', sup2: '²',
  sup3: '³', larr: '←', rarr: '→', minus: '−',
  eacute: 'é', egrave: 'è', uuml: 'ü', ouml: 'ö',
  sup1: '¹', asymp: '≈', ne: '≠', le: '≤', ge: '≥',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
  theta: 'θ', lambda: 'λ', mu: 'μ', pi: 'π', rho: 'ρ',
  sigma: 'σ', tau: 'τ', phi: 'φ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Sigma: 'Σ',
  Phi: 'Φ', Omega: 'Ω'
};

const problems = [];

function decode(str, where) {
  const out = str
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z][a-z0-9]*);/gi, (m, name) => {
      const hit = NAMED[name];
      if (hit === undefined) { problems.push(`${where}: unknown entity ${m}`); return m; }
      return hit;
    });
  return out.replace(/\s+/g, ' ').trim();
}

/* Topic level and title come from the hub page's cards, which are the only
   place HL status is recorded. */
function readTopicIndex() {
  const html = readFileSync(join(DP, 'index.html'), 'utf8');
  const cardRe = /<a class="topic-card( is-hl)?" href="([^"]+\.html)">\s*<div class="topic-card-top"><span class="topic-card-code">([^<]+)<\/span><\/div>\s*<div class="topic-card-title">([^<]+)<\/div>/g;
  const topics = new Map();
  for (const m of html.matchAll(cardRe)) {
    topics.set(m[2], {
      file: m[2],
      topic: decode(m[3], m[2]),
      topicTitle: decode(m[4], m[2]),
      level: m[1] ? 'HL' : 'SL'
    });
  }
  return topics;
}

const QUESTION_RE = /<div class="quiz-q" data-answer="([A-D])">\s*<div class="quiz-q-num">([^<]*)<\/div>\s*<div class="quiz-q-text">([\s\S]*?)<\/div>\s*<div class="quiz-options">([\s\S]*?)<\/div>\s*<div class="quiz-answer">([\s\S]*?)<\/div>/g;
const OPTION_RE = /<button class="quiz-option" data-opt="([A-D])">([\s\S]*?)<\/button>/g;

function extractTopic(meta) {
  const html = readFileSync(join(DP, meta.file), 'utf8');
  const slug = meta.file.split('-')[0];
  const strand = meta.topic[0];
  const questions = [];

  for (const m of html.matchAll(QUESTION_RE)) {
    const where = `${meta.topic} Q${questions.length + 1}`;
    const label = decode(m[2], where);
    /* "Q1 · 1.1.2 Anthropometrics": the number is local to the topic, so it is
       prefixed with the strand letter to keep A1.1.1 and C1.1.1 apart. */
    const labelMatch = label.match(/^Q\d+\s*·\s*([\d.]+)\s*(.*)$/);
    if (!labelMatch) problems.push(`${where}: cannot read sub-topic from "${label}"`);

    const options = {};
    for (const o of m[4].matchAll(OPTION_RE)) {
      options[o[1]] = decode(o[2], where).replace(/^[A-D]\)\s*/, '');
    }
    const keys = Object.keys(options);
    if (keys.length !== 4) problems.push(`${where}: ${keys.length} options, expected 4`);
    if (!options[m[1]]) problems.push(`${where}: answer ${m[1]} has no matching option`);

    questions.push({
      id: `${slug}-q${questions.length + 1}`,
      topic: meta.topic,
      topicTitle: meta.topicTitle,
      topicFile: meta.file,
      level: meta.level,
      sub: labelMatch ? strand + labelMatch[1] : '',
      subTitle: labelMatch ? labelMatch[2] : '',
      text: decode(m[3], where),
      options,
      answer: m[1],
      commentary: decode(m[5], where)
    });
  }

  const declared = (html.match(/class="quiz-q"/g) || []).length;
  if (questions.length !== declared) {
    problems.push(`${meta.topic}: matched ${questions.length} of ${declared} question blocks`);
  }
  return questions;
}

const topics = readTopicIndex();
const questions = [];
for (const meta of topics.values()) questions.push(...extractTopic(meta));

if (problems.length) {
  console.error('Extraction failed:\n  ' + problems.join('\n  '));
  process.exit(1);
}

const counts = {};
for (const q of questions) counts[q.topic] = (counts[q.topic] || 0) + 1;

writeFileSync(OUT, JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  topics: [...topics.values()].map(t => ({
    topic: t.topic, title: t.topicTitle, level: t.level, file: t.file, count: counts[t.topic] || 0
  })),
  questions
}, null, 1) + '\n');

const hl = [...topics.values()].filter(t => t.level === 'HL').length;
console.log(`${questions.length} questions from ${topics.size} topics (${topics.size - hl} SL, ${hl} HL) -> ${OUT}`);
