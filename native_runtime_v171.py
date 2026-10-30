"""One local, bounded startup path for the portfolio's saved live scenes."""
from pathlib import Path
import json
import os
import subprocess
import threading
import time
import urllib.request


class NativeRuntime:
    def __init__(self, project, read_health=None, start=None, clock=time.time):
        self.project = Path(project)
        self.clock = clock
        self.read_health = read_health or self._read_health
        self.start = start or self._start
        self.lock = threading.Lock()
        self.child = None
        self.attempted_at = 0
        self.last_error = ""
        self.last_good = None
        self.last_refresh = 0

    def _read_health(self):
        with urllib.request.urlopen('http://127.0.0.1:8089/health', timeout=1) as response:
            return json.load(response)

    def status(self):
        signal = False
        try:
            data = self.read_health()
            signal = True
            if data.get('native'):
                self.last_good = data
        except (OSError, ValueError):
            data = self.last_good or {}
        native = data.get('native') or {}
        age = max(0, self.clock() - native.get('heartbeat', 0))
        ready = bool(signal and data.get('streamers') and age < 6 and
                     native.get('phase') == 'native viewport live')
        running = self.child is not None and self.child.poll() is None
        if self.child is not None and not running and self.child.poll() and not ready:
            self.last_error = 'Native startup exited with code ' + str(self.child.poll())
        return {'version': 171, 'ready': ready, 'signalReady': signal,
                'starting': bool(not ready and running),
                'heartbeatAge': round(age, 2), 'processId': native.get('processId'),
                'startedAt': self.attempted_at, 'error': '' if ready else self.last_error}

    def _start(self, scene):
        state = self.project.parent / '.maintenance' / 'portfolio-service'
        state.mkdir(parents=True, exist_ok=True)
        script = self.project / 'scripts' / 'start-ue-v162.ps1'
        with (state / 'native-start-v171.log').open('ab') as log:
            return subprocess.Popen(
                ['powershell.exe', '-NoProfile', '-ExecutionPolicy', 'Bypass',
                 '-File', str(script), '-Scene', scene, '-Codec', 'VP9'],
                cwd=str(self.project), stdin=subprocess.DEVNULL, stdout=log, stderr=log,
                creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))

    def ensure(self, scene='room'):
        if scene not in ('home', 'room', 'myth'):
            raise ValueError('Unsupported scene')
        with self.lock:
            state = self.status()
            if state['ready'] or state['starting']:
                return state
            if state['signalReady'] and state['heartbeatAge'] < 6:
                self._request_rebind()
                return {**state, 'starting': True}
            # The startup script also holds a cross-process mutex. Avoid a spawn
            # storm while another launcher is obtaining the same saved runtime.
            if self.clock() - self.attempted_at < 8:
                return {**state, 'starting': True}
            self.attempted_at = self.clock()
            self.last_error = ''
            try:
                self.child = self.start(scene)
            except OSError as error:
                self.last_error = str(error)
                return {**state, 'error': self.last_error, 'starting': False}
            return {**state, 'starting': True, 'startedAt': self.attempted_at}

    def refresh(self, scene='room'):
        if scene not in ('home', 'room', 'myth'):
            raise ValueError('Unsupported scene')
        state = self.ensure(scene)
        if not state['ready']:
            return state
        with self.lock:
            if self.clock() - self.last_refresh < 15:
                return state
            self.last_refresh = self.clock()
            self._request_rebind(force=True)
            return {**state, 'refreshRequested': True}

    def _request_rebind(self, force=False):
        if not force and self.clock() - self.last_refresh < 15:
            return
        self.last_refresh = self.clock()
        for target, payload in [
            (self.project / '.verify/v32-171/request.json', {'kind': 'rebind-stream'}),
            (self.project / '.verify/v32-162/asset-update.json', {'kind': 'audit'})]:
            target.parent.mkdir(parents=True, exist_ok=True)
            temporary = target.with_name(target.name + '.runtime-tmp')
            temporary.write_text(json.dumps(payload), encoding='utf-8')
            os.replace(temporary, target)
