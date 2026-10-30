"""Local portfolio preview with byte-range support for video seeking."""
import re
import json
from native_runtime_v171 import NativeRuntime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class PreviewHandler(SimpleHTTPRequestHandler):
    def runtime_reply(self, code, body):
        content = json.dumps(body).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_GET(self):
        if self.path.split('?', 1)[0] == '/_runtime/status':
            return self.runtime_reply(200, self.server.native_runtime.status())
        return super().do_GET()

    def do_POST(self):
        endpoint = self.path.split('?', 1)[0]
        if endpoint not in ('/_runtime/ensure', '/_runtime/refresh'):
            return self.send_error(404)
        origin = self.headers.get('Origin')
        if origin and origin not in ('http://127.0.0.1:8031', 'http://localhost:8031'):
            return self.runtime_reply(403, {'error': 'Unsupported origin'})
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length < 0 or length > 512:
                return self.runtime_reply(413, {'error': 'Request too large'})
            body = json.loads(self.rfile.read(length) or b'{}')
            scene = body.get('scene', 'room')
            operation = self.server.native_runtime.refresh if endpoint.endswith('refresh') else self.server.native_runtime.ensure
            state = operation(scene)
            return self.runtime_reply(200 if state['ready'] else 202, state)
        except (ValueError, TypeError, AttributeError):
            return self.runtime_reply(400, {'error': 'Unsupported runtime request'})

    def end_headers(self):
        if Path(self.path.split('?', 1)[0]).suffix.lower() in {'.html', '.js', '.css', '.json'} or '/assets/native-v164/' in self.path:
            self.send_header('Cache-Control', 'no-store, max-age=0')
        super().end_headers()

    def __init__(self, *args, **kwargs):
        self.remaining = None
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        self.remaining = None
        path = Path(self.translate_path(self.path))
        if not path.is_file() or path.suffix.lower() not in {'.mp4', '.webm', '.mov', '.mp3', '.m4a', '.ogg', '.wav'}:
            return super().send_head()
        size = path.stat().st_size
        start, end = 0, size - 1
        requested = self.headers.get('Range')
        if requested:
            match = re.fullmatch(r'bytes=(\d*)-(\d*)', requested.strip())
            if not match or not any(match.groups()):
                self.send_error(400, 'Invalid byte range')
                return None
            first, last = match.groups()
            if first:
                start = int(first)
                end = min(int(last), end) if last else end
            else:
                start = max(0, size - int(last))
            if start > end or start >= size:
                self.send_response(416)
                self.send_header('Content-Range', f'bytes */{size}')
                self.send_header('Content-Length', '0')
                self.end_headers()
                return None
        source = path.open('rb')
        source.seek(start)
        self.remaining = end - start + 1
        self.send_response(206 if requested else 200)
        self.send_header('Content-type', self.guess_type(str(path)))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Length', str(self.remaining))
        self.send_header('Last-Modified', self.date_time_string(path.stat().st_mtime))
        if requested:
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.end_headers()
        return source

    def copyfile(self, source, outputfile):
        try:
            if self.remaining is None:
                return super().copyfile(source, outputfile)
            while self.remaining:
                chunk = source.read(min(65536, self.remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                self.remaining -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass


if __name__ == '__main__':
    print('Portfolio preview: http://localhost:8031/v31.html', flush=True)
    server = ThreadingHTTPServer(('127.0.0.1', 8031), PreviewHandler)
    server.native_runtime = NativeRuntime(ROOT)
    server.serve_forever()
