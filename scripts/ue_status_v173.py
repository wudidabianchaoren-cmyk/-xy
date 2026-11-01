"""Coalesced status writes and bounded job-file reads, away from the render thread."""
from pathlib import Path
import json, os, threading, time

P = Path(__file__).resolve().parents[1]
OUT = P / '.verify/v32-162'
JOB = OUT / 'asset-update.json'
PATHS = {'live': OUT / 'ue-live.json', 'motion': OUT / 'native-motion.json',
         'media': P / '.verify/v32-163/room-media.json'}
pending = {}
job_state = (0, None)
worker = None
error = ''


def _work():
    global job_state, error
    while True:
        try:
            stamp = JOB.stat().st_mtime_ns
            if stamp != job_state[0]:
                data = json.loads(JOB.read_text(encoding='utf-8-sig'))
                if JOB.stat().st_mtime_ns == stamp:
                    job_state = (stamp, data)
        except FileNotFoundError:
            job_state = (0, None)
        except (OSError, ValueError) as exc:
            error = str(exc)
        # Each pop/set is atomic in the editor's CPython. A newer value written
        # after a pop remains queued for the next pass; no lock includes I/O.
        for name, target in PATHS.items():
            payload = pending.pop(name, None)
            if payload is None:
                continue
            try:
                target.parent.mkdir(parents=True, exist_ok=True)
                temporary = target.with_name(target.name + '.status-v173-tmp')
                temporary.write_text(json.dumps(payload), encoding='utf-8')
                os.replace(temporary, target)
            except OSError as exc:
                error = str(exc)
        time.sleep(.008)


def start():
    global worker
    if worker is None or not worker.is_alive():
        worker = threading.Thread(target=_work, name='PortfolioStatusIO', daemon=True)
        worker.start()


def report(data, name='live'):
    if name not in PATHS:
        raise ValueError('Unsupported portfolio status output')
    pending[name] = dict(data)
    start()


def job():
    start()
    return job_state
