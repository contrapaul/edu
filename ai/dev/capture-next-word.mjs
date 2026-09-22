#!/usr/bin/env node
/* ============================================================
   Capture next-word probabilities for screen 5, "The next word".

   Reads the sentence splits from data/next-word-sentences.json,
   asks a running llama.cpp server for the top-k next-token
   probabilities at each split point, and writes
   data/next-word.json with full provenance.

   Run it:
     llama-server -m Qwen3-1.7B-Q4_K_M.gguf --port 8080
     node dev/capture-next-word.mjs

   Options:
     --base http://127.0.0.1:8080   the llama-server address
     --top 8                        how many top tokens to record
     --model-file NAME              the .gguf file name, for the record
     --sentences PATH               default data/next-word-sentences.json
     --out PATH                     default data/next-word.json
     --dry-run                      check the sentences, no server needed

   Honesty notes, and why the output shape is what it is:
   - One pass per sentence, greedy decode. The probabilities are
     exp(logprob) over the model's full vocabulary, so the top
     list does not sum to 1. That is the point: each number is
     how likely the model thought that token was, and the page
     says so.
   - The output records what the server reports the model to be,
     the file name if given, the date, and the address. The page
   labels the numbers the same way it labels a transcript.
   - If a hidden word is not in the recorded top list, the file
     is still written but the run ends with a warning and a
     non-zero code: move that split point and run it again.
   ============================================================ */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* ---------- pure helpers (tested in test/nextword.test.mjs) ---------- */

/** " The" -> "the". Tokens carry their leading space; words do not. */
export function normToken(t) {
  return String(t).trim().toLowerCase();
}

/** logprob -> probability. A logprob that is not a finite number
 *  becomes null rather than a silent 0 or NaN in the data file. */
export function toProb(logprob) {
  if (typeof logprob !== 'number' || !Number.isFinite(logprob)) return null;
  return Math.exp(logprob);
}

/** Index (into `top`) of the first token that reads as `word`,
 *  or -1. Comparison ignores the leading space and case. */
export function findHidden(top, hidden) {
  const h = normToken(hidden);
  return top.findIndex((t) => normToken(t.token) === h);
}

/** The chips the reader picks from: the hidden word first, then
 *  the model's top picks that are not that word, in the model's
 *  order. `isTop` marks the model's own top choice. If the hidden
 *  word is not in `top`, its chip carries prob null and the run
 *  is flagged for a new split point. */
export function pickCandidates(top, hidden, count = 5) {
  const out = [];
  const used = new Set();
  const seen = new Set();
  const hIdx = findHidden(top, hidden);
  if (hIdx >= 0) {
    used.add(hIdx);
    seen.add(normToken(top[hIdx].token));
    out.push({ word: hidden, token: top[hIdx].token, prob: top[hIdx].prob, isHidden: true, isTop: hIdx === 0 });
  } else {
    seen.add(normToken(hidden));
    out.push({ word: hidden, token: null, prob: null, isHidden: true, isTop: false });
  }
  top.forEach((t, i) => {
    if (out.length >= count || used.has(i)) return;
    const n = normToken(t.token);
    if (seen.has(n)) return;
    used.add(i);
    seen.add(n);
    out.push({ word: String(t.token).trim(), token: t.token, prob: t.prob, isHidden: false, isTop: i === 0 });
  });
  return out;
}

/** Pull the sampled token and its top list out of a response.
 *  Handles the current llama.cpp shape
 *  (logprobs.tokens[0] = { token, logprob, top_logprobs: [{token, logprob}] })
 *  and the older OpenAI-style one
 *  (logprobs.tokens[0] a string, top_logprobs[0] a map or a list). */
export function parseLogprobs(resp) {
  const lp = resp && resp.logprobs;
  if (!lp || !Array.isArray(lp.tokens) || !lp.tokens.length) {
    throw new Error('response has no logprobs.tokens: ' + JSON.stringify(resp).slice(0, 200));
  }
  const t0 = lp.tokens[0];
  if (t0 && typeof t0 === 'object' && 'top_logprobs' in t0) {
    const top = (t0.top_logprobs || []).map((t) => ({ token: t.token, logprob: t.logprob }));
    return { sampled: { token: t0.token, logprob: t0.logprob }, top };
  }
  if (typeof t0 === 'string') {
    const raw = (lp.top_logprobs && lp.top_logprobs[0]) || [];
    const top = Array.isArray(raw)
      ? raw.map((t) => ({ token: t.token, logprob: t.logprob }))
      : Object.entries(raw).map(([token, logprob]) => ({ token, logprob }));
    return { sampled: { token: t0, logprob: (lp.token_logprobs || [null])[0] }, top };
  }
  throw new Error('unrecognised logprobs shape: ' + JSON.stringify(lp).slice(0, 200));
}

/** Turn one sentence plus one parsed response into the data-file entry. */
export function buildSentence(sent, parsed, topK = 8) {
  let top = parsed.top.map((t) => ({ token: t.token, prob: toProb(t.logprob) }));
  if (!top.length || normToken(top[0].token) !== normToken(parsed.sampled.token)) {
    top.unshift({ token: parsed.sampled.token, prob: toProb(parsed.sampled.logprob) });
  }
  top = top.slice(0, topK);
  const hiddenRank = findHidden(top, sent.hidden) + 1;
  return {
    id: sent.id,
    kind: sent.kind,
    prefix: sent.prefix,
    hidden: sent.hidden,
    best: top[0].token,
    bestProb: top[0].prob,
    hiddenRank: hiddenRank >= 1 ? hiddenRank : null,
    top,
    candidates: pickCandidates(top, sent.hidden),
    note: sent.note || null,
  };
}

/* ---------- the run itself ---------- */

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

async function main() {
  const opts = {
    base: arg('base', 'http://127.0.0.1:8080').replace(/\/$/, ''),
    top: Number(arg('top', '8')),
    modelFile: arg('model-file', '') || null,
    sentences: arg('sentences', 'data/next-word-sentences.json'),
    out: arg('out', 'data/next-word.json'),
    dryRun: process.argv.includes('--dry-run'),
  };
  const path = (p) => (p.startsWith('/') ? p : resolve(ROOT, p));

  const input = JSON.parse(readFileSync(path(opts.sentences), 'utf8'));
  const sents = (input.sentences || []).filter((s) => !s.optional || process.argv.includes('--optional'));
  for (const s of sents) {
    if (!s.id || !s.prefix || !s.hidden) throw new Error('every sentence needs id, prefix and hidden: ' + JSON.stringify(s));
  }
  if (!sents.length) throw new Error('no sentences to capture');

  if (opts.dryRun) {
    for (const s of sents) console.log(s.id.padEnd(12) + ' ..."' + s.prefix + '"  [' + s.hidden + ']');
    console.log(sents.length + ' sentences, all have id, prefix and hidden. OK.');
    return;
  }

  let models;
  try {
    models = await (await fetch(opts.base + '/v1/models')).json();
  } catch (e) {
    console.error('Could not reach ' + opts.base + '. Is llama-server running? (node dev/capture-next-word.mjs --dry-run checks the sentences without a server.)');
    process.exit(1);
  }
  const modelName = (models.data || [])[0] && models.data[0].id;
  if (!modelName) throw new Error('server returned no model: ' + JSON.stringify(models).slice(0, 200));
  console.log('model served: ' + modelName);

  const sentences = [];
  for (const s of sents) {
    const resp = await (await fetch(opts.base + '/v1/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model: modelName, prompt: s.prefix, max_tokens: 1, logprobs: opts.top }),
    })).json();
    const entry = buildSentence(s, parseLogprobs(resp), opts.top);
    sentences.push(entry);
    const rank = entry.hiddenRank ? entry.hiddenRank : 'NOT IN TOP-' + opts.top;
    console.log(s.id.padEnd(12) + ' top: "' + entry.best.trim() + '" (' + (entry.bestProb == null ? '?' : entry.bestProb.toFixed(3)) + ')   hidden "' + s.hidden + '" at ' + rank);
  }

  const file = {
    note: 'Recorded next-word probabilities for screen 5, "The next word". One pass per sentence, greedy decode. Captured with dev/capture-next-word.mjs.',
    model: {
      name: modelName,
      file: opts.modelFile,
      servedBy: opts.base,
      capturedOn: new Date().toISOString().slice(0, 10),
      topK: opts.top,
    },
    normalisation: 'prob is exp(logprob) over the model\'s full vocabulary, so the top list does not sum to 1. Each number is how likely the model thought that token was.',
    sentences,
  };
  writeFileSync(path(opts.out), JSON.stringify(file, null, 2) + '\n');
  console.log('wrote ' + opts.out);

  const missing = sentences.filter((s) => s.hiddenRank == null);
  if (missing.length) {
    console.error('');
    console.error('WARNING: the hidden word is not in the top ' + opts.top + ' for: ' + missing.map((s) => s.id).join(', '));
    console.error('Move those split points (data/next-word-sentences.json) and run the capture again.');
    process.exit(1);
  }
}

// Run only when executed directly, not when the pure helpers are imported by tests.
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
}
