# Card clips (`.cs-video`)

Three cards on `/tools/` use a short silent clip as the card background: it sits paused on
its poster frame, plays from the start on hover or keyboard focus, and rewinds when the
pointer leaves. Files expected here:

| Card | Poster | Clip |
| --- | --- | --- |
| localAI | `localai-poster.webp` | `localai.webm` + `localai.mp4` |
| Runestone Expedition | `runestone-poster.webp` | `runestone.webm` + `runestone.mp4` |
| Castle Assault | `castle-poster.webp` | `castle.webm` + `castle.mp4` |

The posters currently in this folder are **placeholders**. The `.webm`/`.mp4` files do not
exist yet — the cards fall back to the poster, so the page looks finished without them.
The `<source>` tags are left live, so dropping a correctly named file into this folder is
the whole job; until then, hovering a card logs a 404 and nothing else happens.

Keep the title **out** of the poster frame: the card draws its own `<h3>` over the clip, so a
poster that repeats the name reads as a double title. If you would rather the clip's own title
frame be the visible title, hide the `<h3>` with a visually-hidden class instead of deleting it.

## Target dimensions

**720 × 400**, which is exactly 2× the 360 × 200 card, so nothing is cropped by
`object-fit: cover` and it stays sharp on a Retina display. Both numbers divide by 16, which
is what video encoders want.

- 3–6 seconds, **no audio track** (`-an`) — it saves bytes and avoids autoplay blocking.
- 24 or 30 fps. 24 is fine for UI motion and cheaper.
- Structure: hold the title for ~0.8–1.2 s, then cut to gameplay. The poster should be that
  same title frame, so there is no visible jump when playback starts.
- Design the title for 360 px wide, not for 1080p shrunk down — set type large.
- Budget roughly **150–350 KB** per clip. Three cards preload nothing until hover, so page
  weight is only the three posters (~10–13 KB each).

## Encoding

Source at 720 × 400 (or crop/scale to it), then:

```bash
ffmpeg -i source.mov -an -vf "scale=720:400:flags=lanczos,fps=24" \
  -c:v libvpx-vp9 -crf 32 -b:v 0 -g 48 -row-mt 1 -pix_fmt yuv420p runestone.webm
```

```bash
ffmpeg -i source.mov -an -vf "scale=720:400:flags=lanczos,fps=24" \
  -c:v libx264 -crf 24 -preset slow -profile:v high -g 48 \
  -pix_fmt yuv420p -movflags +faststart runestone.mp4
```

Poster, from the frame you want held:

```bash
ffmpeg -i source.mov -ss 0.4 -frames:v 1 -vf "scale=720:400:flags=lanczos" poster.png
cwebp -q 82 poster.png -o runestone-poster.webp
```

## Why not GIF

Same clip, same 720 × 400: a GIF lands around 2–5 MB and is capped at 256 colours, so
gradients band and gameplay smears. VP9 or H.264 gets the same seconds under ~300 KB, keeps
full colour, and is decoded by the GPU rather than the CPU. WebM first and MP4 second in the
`<source>` list gives the smaller file where VP9 is supported and a universally
hardware-decoded fallback everywhere else.

The `cs-banner` cards (`cloud.webp`, `time.webp`) are still stills; converting them to this
pattern is the same job as above.
