import json, re, unicodedata, collections, difflib

# Reads the Numbers source directly:  pip install numbers-parser
# Run from the repo root:  python3 curriculum/dp/glossary/build-glossary.py
from numbers_parser import Document
rows=[r[:2] for r in Document('curriculum/dp/IB definitions.numbers').sheets[0].tables[0].rows(values_only=True) if r[0]]
assert len(rows)==350, len(rows)

# (start_index, code, title, file)
GROUPS=[
 (0,  'A1.1','Ergonomics','a1.1-ergonomics.html'),
 (14, 'A2.1','User-centred Research Methods','a2.1-user-centred-research.html'),
 (32, 'A2.2','Prototyping Techniques','a2.2-prototyping-techniques.html'),
 (60, 'A3.1','Material Classification & Properties','a3.1-material-classification.html'),
 (97, 'B1.1','User-centred Design','b1.1-user-centred-design.html'),
 (108,'B2.1','Design Process','b2.1-design-process.html'),
 (127,'B2.2','Modelling & Prototyping','b2.2-modelling-prototyping.html'),
 (134,'B3.1','Material Selection','b3.1-material-selection.html'),
 (140,'C1.1','Responsibility of the Designer','c1.1-responsibility-of-designer.html'),
 (146,'C1.2','Inclusive Design','c1.2-inclusive-design.html'),
 (149,'C1.3','Beyond Usability','c1.3-beyond-usability.html'),
 (156,'C2.1','Design for Sustainability','c2.1-design-for-sustainability.html'),
 (159,'C2.2','Circular Economy','c2.2-circular-economy.html'),
 (165,'C3.1','Product Analysis','c3.1-product-analysis.html'),
 (168,'A3.2','Introduction to Structural Systems','a3.2-structural-systems.html'),
 (198,'A3.3','Introduction to Mechanical Systems','a3.3-mechanical-systems.html'),
 (228,'A3.4','Introduction to Electronic Systems','a3.4-electronic-systems.html'),
 (271,'A4.1','Manufacturing Techniques','a4.1-manufacturing-techniques.html'),
 (307,'B3.2','Structural Systems in Application','b3.2-structural-systems-application.html'),
 (311,'B3.3','Mechanical Systems in Application','b3.3-mechanical-systems-application.html'),
 (319,'B3.4','Electronic Systems in Application','b3.4-electronic-systems-application.html'),
 (332,'B4.1','Production Systems','b4.1-production-systems.html'),
 (343,'C3.2','Life-cycle Analysis','c3.2-life-cycle-analysis.html'),
 (346,'C4.1','Design for Manufacture','c4.1-design-for-manufacture.html'),
]

def topic_at(i):
    for j,(s,c,t,f) in enumerate(GROUPS):
        end = GROUPS[j+1][0] if j+1 < len(GROUPS) else 350
        if s <= i < end: return (c,t,f)
    raise ValueError(i)

# term-label typo fixes (source spelling errors); definitions stay verbatim
TERM_FIX={
 'Electrical Resistivity (Electical Conductivity)':'Electrical Resistivity (Electrical Conductivity)',
 'Stereolithograpy (SLA)':'Stereolithography (SLA)',
 'Finite element analysis (FEA)':'Finite Element Analysis (FEA)',
 'User-centred research Methods':'User-Centred Research Methods',
}
# rows whose definition text is a copy-paste of another term's definition;
# kept as topic cross-references only
BAD_DEF={128,133}

def clean(s):
    return re.sub(r'\s+',' ',s).strip()

def strip_xref(s):
    s=clean(s)
    return clean(re.sub(r'\s*(See\s+)?[A-C]\d\.\d[^.]*\.?\s*$','',s))

def is_xref_only(s):
    return bool(re.fullmatch(r'(See\s+)?[A-C]\d\.\d.*', clean(s)))

def slug(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode()
    return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')

entries={}
order=[]
for i,(rawterm,rawdef) in enumerate(rows):
    term=clean(rawterm)
    term=TERM_FIX.get(term,term)
    code,title,file=topic_at(i)
    key=slug(term)
    d=clean(rawdef)
    body='' if (i in BAD_DEF or is_xref_only(d)) else strip_xref(d)
    e=entries.get(key)
    if e is None:
        e={'id':key,'term':term,'def':'','topics':[],'notes':[]}
        entries[key]=e; order.append(key)
    def distinct(a,b):
        return bool(a) and bool(b) and difflib.SequenceMatcher(None,a,b).ratio() < 0.9
    # first non-empty definition wins; later distinct wordings become notes
    if not e['def']:
        e['def']=body
    elif distinct(body, e['def']):
        e['notes'].append(body)
    if code not in [t[0] for t in e['topics']]:
        e['topics'].append([code,title,file])

# a handful of source cells are bare cross-references with no definition
# anywhere in the sheet; keep the source text rather than shipping a blank
for i,(rawterm,rawdef) in enumerate(rows):
    key=slug(TERM_FIX.get(clean(rawterm),clean(rawterm)))
    if not entries[key]['def']:
        entries[key]['def']=clean(rawdef)

missing=[e['term'] for e in entries.values() if not e['def']]
print('unique terms:',len(entries),'| missing def:',missing)

alias=collections.defaultdict(set)
for e in entries.values():
    t=e['term']
    cands={t}
    m=re.match(r'^(.*?)\s*\(([^)]+)\)\s*$',t)
    if m:
        cands.add(m.group(1))
        if len(m.group(2))<=6 or m.group(2).isupper(): cands.add(m.group(2))
    for c in list(cands):
        s=slug(c)
        if s: alias[s].add(e['id'])
        if s and not s.endswith('s'): alias[s+'s'].add(e['id'])
aliases={k:list(v)[0] for k,v in alias.items() if len(v)==1 and k not in entries}
ambiguous=sorted(k for k,v in alias.items() if len(v)>1)
print('aliases:',len(aliases),'| ambiguous dropped:',ambiguous)

data={
 'topics':[{'code':c,'title':t,'file':f} for _,c,t,f in sorted(GROUPS,key=lambda g:g[1])],
 'terms':[entries[k] for k in sorted(order,key=lambda k:entries[k]['term'].lower())],
 'aliases':aliases,
}
with open('curriculum/dp/glossary/glossary-data.js','w') as fh:
    fh.write('/* Generated from curriculum/dp/IB definitions.numbers - do not hand-edit.\n')
    fh.write('   %d source rows, %d unique terms. */\n' % (len(rows),len(entries)))
    fh.write('window.DP_GLOSSARY = ')
    json.dump(data,fh,ensure_ascii=False,separators=(',',':'))
    fh.write(';\n')
print('multi-topic terms:',sum(1 for e in entries.values() if len(e['topics'])>1))
print('with notes:',[e['term'] for e in entries.values() if e['notes']])
