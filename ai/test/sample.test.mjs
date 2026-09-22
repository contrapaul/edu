import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mixHue } from '../js/stripes.js';
import { tally, emptyProgress } from '../js/progress.js';
import { emptyTally, countNewLinks } from '../js/sample/scorecard.js';

test('mixHue goes the short way round the wheel', () => {
  assert.equal(Math.round(mixHue(350, 10, 0.5)), 0);
  assert.equal(Math.round(mixHue(10, 350, 0.5)), 0);
  assert.equal(Math.round(mixHue(100, 200, 0.25)), 125);
  assert.equal(Math.round(mixHue(325, 75, 1)), 75);
});

test('tally counts seen and done screens', () => {
  const p = emptyProgress();
  p.seen.s1 = 1; p.seen.s2 = 1; p.done.s2 = 1;
  assert.deepEqual(tally(p, ['s1', 's2', 's3']), { seen: 2, done: 1, total: 3 });
});

test('countNewLinks counts each href once per side', () => {
  const t = emptyTally('2026');
  assert.equal(countNewLinks(t, ['a', 'b', 'a']), 2);
  assert.equal(countNewLinks(t, ['b', 'c']), 1);
  assert.equal(t.links, 3);
});

test('yearToX pins years outside the axis to its ends', async () => {
  const { yearToX, brickLayout } = await import('../js/sample/wall.js');
  const axis = { from: 2016, to: 2026 };
  assert.equal(yearToX(122, axis), 60);
  assert.equal(yearToX(2040, axis), 940);
  assert.equal(yearToX(2021, axis), 500);
  const bricks = brickLayout(700);
  assert.ok(bricks.length > 20);
  assert.ok(bricks.every((b) => b.y >= 44 && b.y < 330));
});

test('timeline helpers map progress to years along a stretched axis', async () => {
  const { progressToYear, stateAt, yearToPx, pxToYear } = await import('../js/sample/timeline.js');
  const seg = [[2000, 2010, 10], [2010, 2020, 100]];
  assert.equal(yearToPx(2005, seg), 50);
  assert.equal(yearToPx(2015, seg), 600);
  assert.equal(pxToYear(600, seg), 2015);
  assert.equal(pxToYear(yearToPx(2003.5, seg), seg), 2003.5);
  assert.equal(progressToYear(0, 2000, 2020, seg), 2000);
  assert.equal(progressToYear(1.5, 2000, 2020, seg), 2020);
  // halfway along the track is deep in the stretched part, not at 2010
  assert.ok(progressToYear(0.5, 2000, 2020, seg) > 2013);
  assert.equal(stateAt(2008, 2022.92), 'a');
  assert.equal(stateAt(2023, 2022.92), 'b');
});

test('the re-dated post data has a clue node for every clue and only the date differs', async () => {
  const { readFile } = await import('node:fs/promises');
  const d = JSON.parse(await readFile(new URL('../data/redated.json', import.meta.url), 'utf8'));
  const ids = d.clues.map((c) => c.id);
  assert.deepEqual([...ids].sort(), ['byline', 'comments', 'filler', 'gear', 'updated']);
  assert.ok(d.post.updated !== d.post.publishedOnly);
  const { foundLine } = await import('../js/sample/redated.js');
  assert.equal(foundLine('Found {n} of {total}.', 2, 5), 'Found 2 of 5.');
});

test('the map projects longitude and latitude and the model data is consistent', async () => {
  const { project } = await import('../js/sample/map.js');
  assert.deepEqual(project(-180, 84), { x: 0, y: 0 });
  assert.equal(project(0, 0).x, 500);
  assert.ok(project(0, 0).y > 200 && project(0, 0).y < 260);
  const { readFile } = await import('node:fs/promises');
  const d = JSON.parse(await readFile(new URL('../data/models.json', import.meta.url), 'utf8'));
  assert.ok(d.models.length >= 12);
  assert.ok(!d.models.some((m) => /grok/i.test(m.name)), 'Grok is deliberately left out');
  assert.ok(d.models.some((m) => /unsloth/i.test(m.maker)));
  for (const m of d.models) {
    assert.ok(m.checkedOn, m.id + ' needs a checked-on date');
    assert.equal(m.policy, null, m.id + ': policy text is written only after review');
    assert.ok(d.strings.values[m.search.v], m.id + ' search value must be a known one');
  }
});

test('the recap writes one line per finished activity in the reader\'s own words', async () => {
  const { buildLines, remaining } = await import('../js/sample/recap.js');
  const { readFile } = await import('node:fs/promises');
  const S = JSON.parse(await readFile(new URL('../data/recap.json', import.meta.url), 'utf8')).strings;
  const p = { seen: {}, done: { s3: 1, s4: 1, s7: 1 }, answers: {
    s3: { trusted: '2026' }, 'branch-2023': 'Look each one up before using it',
    s4: { placed: ['a', 'b'], cards: [{ text: 'Who won the 2022 World Cup?', outcome: 'before' }, { text: "What's the newest phone?", outcome: 'blocked' }] },
    s7: { names: ['DeepSeek', 'Claude', 'Mistral', 'Local models'] },
  } };
  const lines = buildLines(p, S);
  assert.equal(lines.length, 4);
  assert.ok(lines[0].includes('trusted 2026'));
  assert.ok(lines[1].includes('Look each one up'));
  assert.ok(lines[2].includes('Who won the 2022 World Cup: from memory'));
  assert.ok(lines[3].includes('DeepSeek, Claude, Mistral and Local models'));
  assert.equal(remaining(p), 3); // s2, s5 and s6 are still open in this record
  assert.deepEqual(buildLines({ seen: {}, done: {}, answers: {} }, S), []);
  // an older record without the details still reads as a sentence
  const old = buildLines({ seen: {}, done: { s4: 1, s7: 1 }, answers: { s4: { placed: ['a'] }, s7: { seen: ['x'] } } }, S);
  assert.equal(old.length, 2);
  assert.ok(!old.some((l) => l.includes('()') || l.endsWith(': .')));
});

test('glossary data is complete and every marked term on the pages exists', async () => {
  const { readFile } = await import('node:fs/promises');
  const g = JSON.parse(await readFile(new URL('../data/glossary.json', import.meta.url), 'utf8'));
  const { letterIndex } = await import('../js/glossary.js');
  const ids = new Set(g.terms.map((t) => t.id));
  for (const t of g.terms) {
    assert.ok(t.short && t.full && t.links.length, t.id + ' needs short, full and a link');
    assert.ok(!/—/.test(t.short + t.full), t.id + ' has an em dash');
    for (const l of t.links) assert.match(l.url, /^https:\/\/en\.wikipedia\.org\/wiki\/\S+$/);
  }
  assert.ok(letterIndex(g.terms).size >= 8);
  for (const page of ['sample.html', 'index.html', 'learn.html', 'line.html']) {
    const html = await readFile(new URL('../' + page, import.meta.url), 'utf8');
    for (const m of html.matchAll(/data-term="([^"]+)"/g)) assert.ok(ids.has(m[1]), page + ' marks unknown term ' + m[1]);
  }
});

test('card sort helpers: zones, clamping and non-overlapping layout', async () => {
  const { clampPos, zoneOf, layout } = await import('../js/line/cards.js');
  assert.equal(clampPos(-1), 0); assert.equal(clampPos(2), 1); assert.equal(clampPos('0.4'), 0.4);
  assert.equal(zoneOf(0.1), 'fine'); assert.equal(zoneOf(0.5), 'depends'); assert.equal(zoneOf(0.9), 'cheating');
  const lay = layout({ a: 0.50, b: 0.52, c: 0.53, d: 0.9 });
  assert.equal(lay.a.row, 0); assert.equal(lay.b.row, 1); assert.equal(lay.c.row, 2); assert.equal(lay.d.row, 0);
  const { readFile } = await import('node:fs/promises');
  const d = JSON.parse(await readFile(new URL('../data/scenarios.json', import.meta.url), 'utf8'));
  assert.equal(d.cards.length, 15);
  assert.ok(d.cards.filter((c) => c.who === 'teacher').length >= 3, 'teacher cards are mixed in on purpose');
  for (const c of d.cards) assert.ok(c.consider, c.id + ' needs a consider note');
});

test('student quotes are never invented: the file starts empty and a slot without one shows a placeholder', async () => {
  const { readFile } = await import('node:fs/promises');
  const d = JSON.parse(await readFile(new URL('../data/quotes.json', import.meta.url), 'utf8'));
  const { quotesFor } = await import('../js/voice.js');
  assert.ok(Array.isArray(d.quotes));
  for (const q of d.quotes) assert.ok(q.text && q.grade && q.when && q.tags?.length, 'a quote needs text, grade, when and tags');
  assert.deepEqual(quotesFor(d, 'nothing'), []);
  assert.ok(d.placeholder.includes('{tag}'));
});

test('the citation builder writes MLA forms, credits, notes and comments by case', async () => {
  const { buildCitation, mlaDate, shortTitle } = await import('../js/line/cite.js');
  const { readFile } = await import('node:fs/promises');
  const data = JSON.parse(await readFile(new URL('../data/cite.json', import.meta.url), 'utf8'));
  assert.equal(mlaDate('2023-03-08', data.months), '8 Mar. 2023');
  assert.equal(mlaDate('2026-05-01', data.months), '1 May 2026');
  assert.equal(shortTitle('Describe the symbolism of the green light'), 'Describe the symbolism…');
  const tool = { name: 'ChatGPT', company: 'OpenAI', url: 'chatgpt.com' };
  const essay = buildCitation({ use: 'words', work: 'essay', tool, version: '13 Feb. version', date: '2023-03-08', prompt: 'Describe the symbolism of the green light' }, data);
  assert.equal(essay.blocks[0].text, '"Describe the symbolism of the green light" prompt. ChatGPT, 13 Feb. version, OpenAI, 8 Mar. 2023, chatgpt.com.');
  assert.equal(essay.blocks[1].text, '("Describe the symbolism…")');
  const edit = buildCitation({ use: 'edit', work: 'essay', tool, date: '2026-09-19', prompt: '' }, data);
  assert.equal(edit.blocks.length, 1); assert.equal(edit.blocks[0].kind, 'note');
  assert.ok(edit.blocks[0].text.startsWith('I used ChatGPT (OpenAI) on 19 September 2026.'));
  const poster = buildCitation({ use: 'image', work: 'poster', tool, date: '2026-09-19', prompt: 'a sheep in a field' }, data);
  assert.equal(poster.blocks[0].kind, 'credit');
  assert.ok(poster.blocks[0].text.startsWith('Image made with ChatGPT (OpenAI) on 19 September 2026 from the prompt'));
  assert.equal(poster.blocks[1].kind, 'worksCited');
  const code = buildCitation({ use: 'words', work: 'code', tool: { name: 'Claude', company: 'Anthropic' }, date: '2026-09-19', prompt: 'sort these rows' }, data);
  assert.ok(code.blocks[0].text.startsWith('// Written with help from Claude (Anthropic)'));
  const src = buildCitation({ use: 'sources', work: 'essay', tool, date: '2026-09-19' }, data);
  assert.ok(src.sourcesNote);
  const priv = buildCitation({ use: 'words', work: 'private', tool, date: '2026-09-19' }, data);
  assert.ok(priv.noneNeeded);
  const teach = buildCitation({ use: 'ideas', work: 'teaching', tool, date: '2026-09-19', prompt: 'ten questions on forces' }, data);
  assert.deepEqual(teach.blocks.map((b) => b.kind), ['credit', 'worksCited']);
});

test('the citation builder does not repeat a company that shares the tool\'s name', async () => {
  const { buildCitation } = await import('../js/line/cite.js');
  const { readFile } = await import('node:fs/promises');
  const data = JSON.parse(await readFile(new URL('../data/cite.json', import.meta.url), 'utf8'));
  const r = buildCitation({ use: 'words', work: 'essay', tool: { name: 'DeepSeek', company: 'DeepSeek', url: 'chat.deepseek.com' }, date: '2026-09-19', prompt: 'x' }, data);
  assert.equal(r.blocks[0].text, '"x" prompt. DeepSeek, 19 Sept. 2026, chat.deepseek.com.');
});

test('the cases data has three beats each and the pushback carries an answer', async () => {
  const { readFile } = await import('node:fs/promises');
  const d = JSON.parse(await readFile(new URL('../data/cases.json', import.meta.url), 'utf8'));
  const { answeredCases } = await import('../js/line/cases.js');
  assert.equal(d.cases.length, 3);
  for (const c of d.cases) {
    assert.ok(c.happened.length && c.why.length && c.pushback.length, c.id);
    for (const pb of c.pushback) assert.ok(pb.q && pb.a, c.id + ' pushback needs q and a');
  }
  assert.ok(!/—/.test(JSON.stringify(d)));
  const p = { answers: { cases: { papers: { choice: 1 }, code: { words: 'x' } } } };
  assert.deepEqual(answeredCases(p, ['papers', 'feedback', 'code'], 'cases'), ['papers']);
});
