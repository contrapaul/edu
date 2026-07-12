# Narration recordings

Drop one MP3 per story page into this folder, named after the page number
in `../pages.js`:

```
audio/page-1.mp3
audio/page-2.mp3
audio/page-3.mp3
...
audio/page-15.mp3
```

No code changes are needed — the engine looks for `audio/page-N.mp3`
automatically when the reader turns to page N with narration on. Pages
without a recording show a quiet "No recording yet for page N" note.

If a page needs a differently named file, add an `audio` field to that
page in `pages.js`, e.g. `audio: "audio/intro-take2.mp3"`.
