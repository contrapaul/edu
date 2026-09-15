"""check-matches.py - validates glossary-matches.js against glossary-data.js
and the topic pages.

Run from the repo root:  python3 curriculum/dp/glossary/check-matches.py

With --page a3.1 it instead reports what glossary-link.js should produce on
that page: first occurrence of each term per .obj-section inside
#course-notes and per case-study modal body, with the same skipped
elements. Compare the total with the
data-gloss-links attribute the script sets on #course-notes.

Errors (exit 1):
  - a key that is not a term id in glossary-data.js
  - the same surface form claimed by two terms (a case-sensitive form that
    equals a case-insensitive one is a collision too)
  - an empty form, or a form repeated inside one term
Reports (informational):
  - forms that never occur in any topic page
  - terms with no hits at all
  - how many words each page would link, so generic words can be spotted

Matching mirrors the rules described at the top of glossary-matches.js:
whole words, case-insensitive unless the form is in "exact", a space or
hyphen in a form matches a space, hyphen or en dash on the page, straight
and curly apostrophes are interchangeable, longest form wins.
"""
import json, re, glob, html, os, sys, collections

DP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

def load_js(path, prefix):
    s = open(path, encoding='utf-8').read()
    i = s.index(prefix) + len(prefix)
    return json.loads(s[i:s.rindex('}') + 1])

G = load_js(os.path.join(DP, 'glossary', 'glossary-data.js'), 'window.DP_GLOSSARY = ')
M = load_js(os.path.join(DP, 'glossary', 'glossary-matches.js'), 'window.DP_GLOSSARY_MATCHES = ')
by_id = {t['id']: t for t in G['terms']}

errors = []

# ---- structural checks -------------------------------------------------

def norm(form):
    return re.sub(r'[\s\-]+', ' ', form.replace('’', "'").strip()).lower()

ci_owner = {}   # case-insensitive forms (match, local)
cs_owner = {}   # case-sensitive forms (exact), case preserved
for tid, e in M.items():
    if tid not in by_id:
        errors.append(f'unknown term id: {tid}')
        continue
    for key in e:
        if key not in ('match', 'local', 'exact', 'also'):
            errors.append(f'{tid}: unknown key "{key}"')
    seen = set()
    for key in ('match', 'local', 'exact'):
        for f in e.get(key, []):
            if not f.strip():
                errors.append(f'{tid}: empty form in {key}')
                continue
            n = norm(f)
            k = (key == 'exact', norm(f) if key != 'exact' else f.strip())
            if k in seen:
                errors.append(f'{tid}: "{f}" listed twice (same form under the matching rules)')
            seen.add(k)
            if key == 'exact':
                if f.strip() in cs_owner and cs_owner[f.strip()] != tid:
                    errors.append(f'collision: "{f}" belongs to both {cs_owner[f.strip()]} and {tid}')
                cs_owner[f.strip()] = tid
                if n in ci_owner and ci_owner[n] != tid:
                    errors.append(f'collision: exact "{f}" ({tid}) is also a case-insensitive form of {ci_owner[n]}')
            else:
                if n in ci_owner and ci_owner[n] != tid:
                    errors.append(f'collision: "{f}" belongs to both {ci_owner[n]} and {tid}')
                ci_owner[n] = tid
                for cs, owner in cs_owner.items():
                    if norm(cs) == n and owner != tid:
                        errors.append(f'collision: "{f}" ({tid}) is also the exact form "{cs}" of {owner}')
    for code in e.get('also', []):
        if code not in [t['code'] for t in G['topics']]:
            errors.append(f'{tid}: unknown topic code in also: {code}')

# ---- corpus simulation --------------------------------------------------

def page_text(path):
    t = open(path, encoding='utf-8').read()
    t = re.sub(r'<script.*?</script>', '', t, flags=re.S)
    t = re.sub(r'<style.*?</style>', '', t, flags=re.S)
    m = re.search(r'<main.*?</main>', t, flags=re.S)
    t = m.group(0) if m else t
    t = re.sub(r'<[^>]+>', ' ', t)
    return re.sub(r'\s+', ' ', html.unescape(t))

def pattern(form):
    parts = re.split(r'[\s\-]+', form.replace('’', "'").strip())
    body = r"[\s\-–]+".join(re.escape(p).replace("'", "['’]") for p in parts)
    return r'(?<![\w])' + body + r'(?![\w])'

def family(code):
    return code[1:]  # 'A3.4' -> '3.4'

def allowed_topics(tid):
    fams = {family(c) for c, _, _ in by_id[tid]['topics']}
    fams |= {family(c) for c in M[tid].get('also', [])}
    return fams

# Every form, longest first, as (regex, term, kind)
forms = []
for tid, e in M.items():
    if tid not in by_id:
        continue
    for f in e.get('match', []): forms.append((f, tid, 'match'))
    for f in e.get('local', []): forms.append((f, tid, 'local'))
    for f in e.get('exact', []): forms.append((f, tid, 'exact'))
forms.sort(key=lambda x: -len(x[0]))
compiled = [(re.compile(pattern(f), 0 if kind == 'exact' else re.I), f, tid, kind) for f, tid, kind in forms]

def claims(text, fam):
    """Non-overlapping matches in text as (start, term, form, word), the way
    glossary-link.js resolves them: exact forms first, then case-insensitive,
    each pass leftmost-first with the longest form winning at a given start."""
    taken = []
    def free(a, b):
        return all(b <= s or a >= e for s, e in taken)
    out = []
    for want in ('exact', 'ci'):
        found = []
        for rx, f, tid, kind in compiled:
            if (kind == 'exact') != (want == 'exact'):
                continue
            if kind == 'local' and fam not in allowed_topics(tid):
                continue
            for m in rx.finditer(text):
                found.append((m.start(), -(m.end() - m.start()), tid, f, m.group(0)))
        for start, neglen, tid, f, word in sorted(found):
            if free(start, start - neglen):
                taken.append((start, start - neglen))
                out.append((start, tid, f, word))
    return sorted(out)

hits_by_form = collections.Counter()
hits_by_term = collections.Counter()
hits_by_page = collections.Counter()
top_by_page = collections.defaultdict(collections.Counter)

pages = sorted(glob.glob(os.path.join(DP, '[abc][0-9].[0-9]-*.html')))
for path in ([] if '--page' in sys.argv else pages):
    name = os.path.basename(path)
    code = name.split('-')[0].upper()          # 'a3.4' -> 'A3.4'
    text = page_text(path)
    for start, tid, f, word in claims(text, family(code)):
        hits_by_form[(tid, f)] += 1
        hits_by_term[tid] += 1
        hits_by_page[name] += 1
        top_by_page[name][tid] += 1

# ---- per-page section mode (mirrors glossary-link.js) -----------------

SKIP_TAGS = {'a', 'button', 'h1', 'h2', 'h3', 'h4', 'code', 'pre', 'svg', 'figcaption',
             'label', 'input', 'textarea', 'select', 'script', 'style'}
SKIP_CLASSES = {'gloss', 'obj-code'}

def page_links(path):
    """Text nodes of #course-notes and every .case-modal-body, grouped by
    section (.obj-section id, .case-modal id, or 'intro'), skips applied."""
    from html.parser import HTMLParser
    class P(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=True)
            self.stack = []          # (tag, skip, is_root, section_opened)
            self.chunks = []         # (section, text)
            self.section = 'intro'
        def handle_starttag(self, tag, attrs):
            a = dict(attrs)
            classes = set((a.get('class') or '').split())
            skip = tag in SKIP_TAGS or bool(classes & SKIP_CLASSES) or 'data-nogloss' in a
            is_root = a.get('id') == 'course-notes' or 'case-modal-body' in classes
            sec = None
            if 'obj-section' in classes or 'case-modal' in classes:
                sec = self.section
                self.section = a.get('id') or 'section'
            parent_skip = any(f[1] for f in self.stack)
            self.stack.append((tag, skip or parent_skip, is_root, sec))
        def handle_startendtag(self, tag, attrs):
            self.handle_starttag(tag, attrs); self.handle_endtag(tag)
        def handle_endtag(self, tag):
            while self.stack:
                f = self.stack.pop()
                if f[3] is not None: self.section = f[3]
                if f[0] == tag: break
        def handle_data(self, data):
            in_root = any(f[2] for f in self.stack)
            if in_root and self.stack and not self.stack[-1][1] and data.strip():
                self.chunks.append((self.section, data))
    p = P(); p.feed(open(path, encoding='utf-8').read())
    return p.chunks

def run_page(code):
    matches = glob.glob(os.path.join(DP, code.lower() + '-*.html'))
    if not matches:
        print('no page for', code); sys.exit(1)
    path = matches[0]
    fam = family(code.upper())
    seen = collections.defaultdict(set)
    per_section = collections.Counter()
    linked = []
    for section, text in page_links(path):
        for _, tid, f, word in claims(text, fam):
            if tid in seen[section]:
                continue
            seen[section].add(tid)
            per_section[section] += 1
            linked.append((section, tid, word))
    print(os.path.basename(path))
    for sec, n in per_section.items():
        print(f'  {sec:14s} {n}')
    print(f'  total          {sum(per_section.values())}')
    if '--list' in sys.argv:
        for sec, tid, word in linked:
            print(f'    {sec:12s} {tid:40s} {word}')
    sys.exit(0)

if '--page' in sys.argv:
    run_page(sys.argv[sys.argv.index('--page') + 1])

# ---- report -------------------------------------------------------------

if errors:
    print('ERRORS')
    for e in errors: print('  ' + e)
    print()

covered = [t for t in by_id if t in M]
print(f'{len(by_id)} terms in glossary-data.js, {len(covered)} have match rules, '
      f'{len(forms)} forms, {sum(hits_by_term.values())} linkable occurrences across {len(pages)} pages')
print()

print('terms with no hits in any page:')
for tid in sorted(covered):
    if not hits_by_term[tid]:
        print(f'  {tid}')
print()

print('forms with no hits (fine to keep, listed so you know):')
for f, tid, kind in sorted(forms, key=lambda x: x[1]):
    if not hits_by_form[(tid, f)]:
        print(f'  {tid}: "{f}" [{kind}]')
print()

print('hits per page (top 6 terms):')
for path in pages:
    name = os.path.basename(path)
    top = ', '.join(f'{t} {n}' for t, n in top_by_page[name].most_common(6))
    print(f'  {name:48s} {hits_by_page[name]:5d}   {top}')
print()

print('not auto-linked:')
for tid in sorted(by_id):
    if tid not in M:
        print(f'  {tid}')

sys.exit(1 if errors else 0)
