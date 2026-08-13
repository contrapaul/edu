# Inside a Desktop PC

Static pages under `/tools/pcparts/`. No build step, no dependencies, no
bundler. Cloudflare Pages serves the files exactly as they sit in the repo,
which is the same way every other tool in this repo works.

## Running it

Anything that serves the repo root over HTTP. The front page fetches
`assets/pc.svg` and `data/machine.json`, so opening `index.html` from the
filesystem will not work.

```bash
python3 -m http.server 8899
```

Then open `http://localhost:8899/tools/pcparts/`.

## Files

```
index.html          the machine
assets/pc.svg       layered diagram, placeholder art
assets/*.woff       font, copied here so nothing outside is a dependency
data/machine.json   part descriptions and occlusion rules
js/machine.js       inlines the SVG, handles selection and removal
css/pcparts.css     tokens, reset and header, shared across all pages here
css/machine.css     front page only
```

Styling is self contained. These pages do not load `/style.css`,
`/curriculum/themes.css` or the site theme script, and they do not use the site
header or footer. Do not edit shared site files to serve this tool, and do not
lift anything from here into the shared stylesheet.

See `plans.md` for the layer contract the SVG has to satisfy, the page
structure, and what is still missing.

## History

This was previously a Three.js and Vite project. It never loaded in a browser,
because Cloudflare served the unbundled source and the browser cannot resolve
`import * as THREE from 'three'` without an import map. The GitHub Actions
workflow that was supposed to build it had been failing on every run since
GitHub Pages was never enabled on the repo. Both are gone.
