# Audio guides

Drop MP3 files in this folder named after the exhibit id from `../exhibits.json`:

```
audio/c64.mp3      → plays for the exhibit with "id": "c64"
audio/zune.mp3     → plays for "id": "zune"
```

No code or JSON changes needed — pressing **F** near a display (or ▶ in its
popup) looks for `audio/<id>.mp3` automatically. Exhibits without a file show
a "coming soon" toast instead.

`sample.mp3` / `c64.mp3` are placeholder chimes proving the pipeline works —
replace them with real recordings (phone Voice Memos exported to MP3 is fine).
