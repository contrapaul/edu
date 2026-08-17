#!/usr/bin/env python3
"""Convert images to WebP and repoint HTML references at them.

Animated GIFs go through gif2webp (animation preserved); everything else
through cwebp. Originals are left on disk unless --delete-originals.

  ./scripts/webpify.py                      # convert + rewrite, whole repo
  ./scripts/webpify.py curriculum/dp/A3.3   # limit to a folder
  ./scripts/webpify.py --dry-run            # show what would happen
  ./scripts/webpify.py --refs-only          # skip conversion, just repoint HTML
"""

import argparse
import os
import re
import subprocess
import sys

RASTER = ('.gif', '.png', '.jpg', '.jpeg')


def is_animated_gif(path):
    with open(path, 'rb') as fh:
        return fh.read().count(b'\x00\x21\xf9\x04') > 1


def convert(path, quality, dry_run):
    """Convert one image to a .webp sibling. Returns (orig, new) byte sizes."""
    out = os.path.splitext(path)[0] + '.webp'
    if os.path.exists(out):
        return None

    if path.lower().endswith('.gif') and is_animated_gif(path):
        # Animated line art compresses better lossless; gif2webp defaults to it.
        # -mixed lets the encoder pick per frame, which wins on photographic clips.
        cmd = ['gif2webp', '-mt', '-quiet', '-mixed', path, '-o', out]
    elif path.lower().endswith('.gif'):
        cmd = ['gif2webp', '-mt', '-quiet', path, '-o', out]
    else:
        cmd = ['cwebp', '-quiet', '-q', str(quality), path, '-o', out]

    if dry_run:
        print(f'  would convert {path}')
        return None

    try:
        subprocess.run(cmd, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError) as exc:
        print(f'  FAILED {path}: {exc}', file=sys.stderr)
        return None
    return os.path.getsize(path), os.path.getsize(out)


def rewrite_refs(root, dry_run):
    """Repoint src/href at .webp wherever a sibling exists. Idempotent."""
    total = 0
    for dirpath, _, names in os.walk(root):
        if '.git' in dirpath:
            continue
        for name in names:
            if not name.endswith('.html'):
                continue
            path = os.path.join(dirpath, name)
            with open(path) as fh:
                src = fh.read()
            hits = []

            def sub(match):
                attr, ref = match.group(1), match.group(2)
                if ref.startswith(('http', '//', 'data:')):
                    return match.group(0)
                target = os.path.normpath(os.path.join(dirpath, ref))
                if not os.path.exists(os.path.splitext(target)[0] + '.webp'):
                    return match.group(0)
                hits.append(ref)
                return f'{attr}="{os.path.splitext(ref)[0]}.webp"'

            out = re.sub(r'(src|href)="([^"]*\.(?:png|jpg|jpeg|gif))"', sub, src)
            if hits:
                total += len(hits)
                print(f'  {len(hits):3d}  {path}')
                if not dry_run:
                    with open(path, 'w') as fh:
                        fh.write(out)
    return total


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('paths', nargs='*', default=['.'])
    ap.add_argument('--quality', type=int, default=82)
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--refs-only', action='store_true')
    ap.add_argument('--delete-originals', action='store_true')
    args = ap.parse_args()
    paths = args.paths or ['.']

    converted = []
    if not args.refs_only:
        print('Converting:')
        for root in paths:
            for dirpath, _, names in os.walk(root):
                if '.git' in dirpath:
                    continue
                for name in sorted(names):
                    if not name.lower().endswith(RASTER):
                        continue
                    full = os.path.join(dirpath, name)
                    sizes = convert(full, args.quality, args.dry_run)
                    if sizes:
                        before, after = sizes
                        pct = 100 * (1 - after / before)
                        print(f'  {before/1e6:6.1f}MB -> {after/1e6:5.1f}MB  '
                              f'({pct:4.1f}% smaller)  {full}')
                        converted.append((full, before, after))
        if converted:
            b = sum(c[1] for c in converted)
            a = sum(c[2] for c in converted)
            print(f'\n  {len(converted)} converted: {b/1e6:.1f}MB -> {a/1e6:.1f}MB '
                  f'({100*(1-a/b):.1f}% smaller)')
        elif not args.dry_run:
            print('  nothing to convert')

    print('\nRewriting references:')
    total = rewrite_refs('.', args.dry_run)
    verb = 'would be rewritten' if args.dry_run else 'rewritten'
    print(f'  {total} reference(s) {verb}' if total else '  none needed')

    if args.delete_originals and not args.dry_run:
        for full, _, _ in converted:
            os.remove(full)
        print(f'\nDeleted {len(converted)} original(s)')
    elif converted:
        print('\nOriginals kept. Re-run with --delete-originals once you have '
              'checked the output.')


if __name__ == '__main__':
    main()
