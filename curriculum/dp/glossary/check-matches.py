"""check-matches.py - validates glossary-matches.js against glossary-data.js
and the topic pages.

Run from the repo root:  python3 curriculum/dp/glossary/check-matches.py

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

hits_by_form = collections.Counter()
hits_by_term = collections.Counter()
hits_by_page = collections.Counter()
top_by_page = collections.defaultdict(collections.Counter)

pages = sorted(glob.glob(os.path.join(DP, '[abc][0-9].[0-9]-*.html')))
for path in pages:
    name = os.path.basename(path)
    code = name.split('-')[0].upper()          # 'a3.4' -> 'A3.4'
    text = page_text(path)
    taken = []                                 # (start, end) already linked
    def free(a, b):
        return all(b <= s or a >= e for s, e in taken)
    for f, tid, kind in forms:
        if kind == 'local' and family(code) not in allowed_topics(tid):
            continue
        flags = 0 if kind == 'exact' else re.I
        for m in re.finditer(pattern(f), text, flags):
            if free(m.start(), m.end()):
                taken.append((m.start(), m.end()))
                hits_by_form[(tid, f)] += 1
                hits_by_term[tid] += 1
                hits_by_page[name] += 1
                top_by_page[name][tid] += 1

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
