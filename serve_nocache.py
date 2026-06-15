"""Tiny static server that disables caching — for local dev/preview only.
ES modules are aggressively cached by browsers; no-cache headers make edits
show up on reload without stale module artifacts.
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5501
    ThreadingHTTPServer(("", port), NoCacheHandler).serve_forever()
