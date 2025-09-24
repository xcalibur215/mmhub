#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
import argparse
from pathlib import Path

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def send_head(self):
        path = self.translate_path(self.path)
        # Try file
        if os.path.isdir(path):
            index = os.path.join(path, 'index.html')
            if os.path.exists(index):
                path = index
        if os.path.exists(path) and os.path.isfile(path):
            return http.server.SimpleHTTPRequestHandler.send_head(self)
        # Fallback to index.html for SPA routes
        index_path = os.path.join(self.directory or '.', 'index.html')
        if os.path.exists(index_path):
            self.path = '/index.html'
            return http.server.SimpleHTTPRequestHandler.send_head(self)
        return http.server.SimpleHTTPRequestHandler.send_head(self)


def main():
    parser = argparse.ArgumentParser(description='Serve a SPA with history fallback')
    parser.add_argument('--dir', default='dist', help='Directory to serve (default: dist)')
    parser.add_argument('--port', type=int, default=8080, help='Port to listen on (default: 8080)')
    args = parser.parse_args()

    serve_dir = os.path.abspath(args.dir)
    if not os.path.isdir(serve_dir):
        print(f"[serve_spa] Directory not found: {serve_dir}", file=sys.stderr)
        sys.exit(1)

    handler = lambda *hargs, **hkwargs: SPARequestHandler(*hargs, directory=serve_dir, **hkwargs)
    with socketserver.TCPServer(("0.0.0.0", args.port), handler) as httpd:
        print(f"[serve_spa] Serving {serve_dir} on http://localhost:{args.port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            httpd.server_close()

if __name__ == '__main__':
    main()
