#!/usr/bin/env python3
"""Downscale the book's images to print resolution and re-encode as JPEG.

Chrome cannot pass WebP through into a PDF, so it embeds a decoded bitmap and
the file balloons (55MB from 13MB of sources). JPEG embeds directly via
DCTDecode, and nothing in the book is printed wider than the text column.

Reads out/book.html, writes out/img/, and rewrites the src attributes.
Animated WebP collapses to its first frame, which is what Chrome renders anyway.
"""

import hashlib
import os
import re
import sys

from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
IMG = os.path.join(OUT, 'img')
BOOKS = [os.path.join(OUT, f) for f in ('book-student.html', 'book-answers.html')]

# A4 text column is ~174mm. 1600px across that is ~230dpi, past what a study
# companion needs and well past what most of these sources actually contain.
MAX_WIDTH = int(os.environ.get('BOOK_IMG_WIDTH', 1100))
QUALITY = int(os.environ.get('BOOK_IMG_QUALITY', 80))


def main():
    os.makedirs(IMG, exist_ok=True)
    cache, before, after = {}, 0, 0

    def convert(src):
        if src in cache:
            return cache[src]
        name = hashlib.md5(src.encode()).hexdigest()[:12] + '.jpg'
        dest = os.path.join(IMG, name)
        try:
            im = Image.open(src)
            im.seek(0)  # first frame of any animation
            im = im.convert('RGB')
            if im.width > MAX_WIDTH:
                h = round(im.height * MAX_WIDTH / im.width)
                im = im.resize((MAX_WIDTH, h), Image.LANCZOS)
            im.save(dest, 'JPEG', quality=QUALITY, optimize=True,
                    progressive=True)
        except Exception as exc:
            print(f'  skipped {os.path.basename(src)}: {exc}', file=sys.stderr)
            cache[src] = src
            return src
        cache[src] = 'img/' + name
        return cache[src]

    for book in BOOKS:
        if not os.path.exists(book):
            continue
        html = open(book).read()
        head, body = html[:html.index('<body')], html[html.index('<body'):]
        for src in set(re.findall(r'src="([^"]+)"', body)):
            if not os.path.isfile(src) or src in cache:
                continue
            before += os.path.getsize(src)
            new_src = convert(src)
            if new_src != src:
                after += os.path.getsize(os.path.join(OUT, new_src))
        body = re.sub(r'src="([^"]+)"',
                      lambda m: f'src="{cache.get(m.group(1), m.group(1))}"', body)
        open(book, 'w').write(head + body)

    n = sum(1 for v in cache.values() if v.startswith('img/'))
    print(f'  {n} images: {before/1e6:.1f}MB -> {after/1e6:.1f}MB '
          f'(max {MAX_WIDTH}px, q{QUALITY})')


if __name__ == '__main__':
    main()
