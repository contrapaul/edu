#!/usr/bin/env python3
"""
MacroPad Builder -- local dev server
Run from the folder containing index.html:
    python serve.py
Then open http://localhost:8080 in your browser.
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import threading

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    # Serve JS files with correct MIME type
    def guess_type(self, path):
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        return super().guess_type(path)

    # Suppress request logging noise
    def log_message(self, format, *args):
        pass

def open_browser():
    webbrowser.open(f'http://localhost:{PORT}')

if __name__ == '__main__':
    # Change to the directory this script lives in
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # Check all required files are present
    required = ['index.html', 'app.js', 'components.js', 'style.css']
    missing = [f for f in required if not os.path.exists(f)]
    if missing:
        print(f'ERROR: Missing files: {", ".join(missing)}')
        print(f'Make sure serve.py is in the same folder as your macropad files.')
        sys.exit(1)

    # Open browser after a short delay
    threading.Timer(0.5, open_browser).start()

    print(f'MacroPad Builder running at http://localhost:{PORT}')
    print(f'Press Ctrl+C to stop.\n')

    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nServer stopped.')
