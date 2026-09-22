import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normToken, toProb, findHidden, pickCandidates, parseLogprobs, buildSentence,
} from '../dev/capture-next-word.mjs';

test('normToken ignores the leading space and case', () => {
  assert.equal(normToken(' The'), 'the');
  assert.equal(normToken('THE'), 'the');
  assert.equal(normToken('  jam '), 'jam');
});

test('toProb is exp, and refuses non-finite input', () => {
  assert.equal(toProb(0), 1);
  assert.ok(Math.abs(toProb(Math.log(0.5)) - 0.5) < 1e-12);
  assert.equal(toProb(NaN), null);
  assert.equal(toProb(-Infinity), null);
  assert.equal(toProb(undefined), null);
});

test('findHidden matches across space and case, else -1', () => {
  const top = [{ token: ' The' }, { token: ' A' }];
  assert.equal(findHidden(top, 'the'), 0);
  assert.equal(findHidden(top, 'a'), 1);
  assert.equal(findHidden(top, 'handbook'), -1);
});

test('pickCandidates puts the hidden word first, keeps the model order, no duplicates', () => {
  const top = [
    { token: ' The', prob: 0.4 },
    { token: ' A', prob: 0.2 },
    { token: ' An', prob: 0.1 },
    { token: ' Guide', prob: 0.08 },
    { token: ' Handbook', prob: 0.05 },
    { token: ' History', prob: 0.03 },
  ];
  const c = pickCandidates(top, 'The', 5);
  assert.equal(c.length, 5);
  assert.equal(c[0].word, 'The');
  assert.equal(c[0].isHidden, true);
  assert.equal(c[0].isTop, true);   // the model also picked it
  assert.deepEqual(c.slice(1).map((x) => x.word), ['A', 'An', 'Guide', 'Handbook']);
  assert.ok(c.every((x, i) => x.word !== 'The' || i === 0));
});

test('pickCandidates marks the model top even when the hidden word is lower down', () => {
  const top = [
    { token: ' silent', prob: 0.3 },
    { token: ' quiet', prob: 0.25 },
    { token: ' wild', prob: 0.2 },
    { token: ' calm', prob: 0.1 },
    { token: ' mad', prob: 0.08 },
  ];
  const c = pickCandidates(top, 'quiet', 5);
  assert.equal(c[0].word, 'quiet');
  assert.equal(c[0].isTop, false);
  assert.equal(c[1].word, 'silent');
  assert.equal(c[1].isTop, true);
});

test('pickCandidates tolerates the hidden word being absent from the top list', () => {
  const top = [{ token: ' a', prob: 0.5 }, { token: ' the', prob: 0.3 }, { token: ' an', prob: 0.2 }];
  const c = pickCandidates(top, 'Grip', 5);
  assert.equal(c[0].word, 'Grip');
  assert.equal(c[0].prob, null);
  assert.ok(c.length >= 3);
});

test('parseLogprobs reads the current llama.cpp shape', () => {
  const resp = {
    logprobs: {
      tokens: [{
        token: ' jam', logprob: -0.9,
        top_logprobs: [
          { token: ' jam', logprob: -0.9 },
          { token: ' honey', logprob: -1.4 },
        ],
      }],
    },
  };
  const p = parseLogprobs(resp);
  assert.equal(p.sampled.token, ' jam');
  assert.equal(p.top.length, 2);
  assert.equal(p.top[1].token, ' honey');
});

test('parseLogprobs reads the OpenAI-compatible content shape', () => {
  const resp = {
    choices: [{
      text: ' red', index: 0,
      logprobs: { content: [{
        id: 2518, token: ' red', logprob: -4.3,
        top_logprobs: [
          { token: ' jelly', logprob: -0.9 },
          { token: ' jam', logprob: -1.4 },
        ],
      }] },
    }],
  };
  const p = parseLogprobs(resp);
  assert.equal(p.sampled.token, ' red');
  assert.deepEqual(p.top, [
    { token: ' jelly', logprob: -0.9 },
    { token: ' jam', logprob: -1.4 },
  ]);
});

test('parseLogprobs reads the older OpenAI-style shape (tokens as strings, top as a map)', () => {
  const resp = {
    logprobs: {
      tokens: [' bus'],
      token_logprobs: [-0.2],
      top_logprobs: [{ ' bus': -0.2, ' train': -1.1 }],
    },
  };
  const p = parseLogprobs(resp);
  assert.equal(p.sampled.token, ' bus');
  assert.deepEqual(p.top, [
    { token: ' bus', logprob: -0.2 },
    { token: ' train', logprob: -1.1 },
  ]);
});

test('buildSentence ranks the hidden word and keeps the model order', () => {
  const sent = { id: 'wall-title', kind: 'the-invented-title', prefix: '... "Hadrian\'s Wall: ', hidden: 'The', note: 'n' };
  const parsed = {
    sampled: { token: ' The', logprob: -0.8 },
    top: [
      { token: ' The', logprob: -0.8 },
      { token: ' A', logprob: -1.2 },
      { token: ' An', logprob: -1.6 },
    ],
  };
  const e = buildSentence(sent, parsed, 8);
  assert.equal(e.best, ' The');
  assert.ok(Math.abs(e.bestProb - Math.exp(-0.8)) < 1e-12);
  assert.equal(e.hiddenRank, 1);
  assert.equal(e.candidates[0].word, 'The');
  assert.equal(e.candidates.length, 3);   // hidden + 2, fewer than 5 because the top list is short
});

test('buildSentence sets hiddenRank null when the word is outside the top list', () => {
  const sent = { id: 'hill', prefix: '... hill called', hidden: 'Grip' };
  const parsed = {
    sampled: { token: ' the', logprob: -1.0 },
    top: [{ token: ' the', logprob: -1.0 }, { token: ' a', logprob: -1.3 }],
  };
  const e = buildSentence(sent, parsed, 8);
  assert.equal(e.hiddenRank, null);
  assert.equal(e.candidates[0].prob, null);
});
