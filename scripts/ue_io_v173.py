"""Move control-file I/O off the editor frame thread; latest numeric state wins."""
from pathlib import Path
import json, os, threading, time

OUT = Path(__file__).resolve().parents[1] / '.verify/v32-162'
INPUT = OUT / 'ue-camera-input.json'
latest = (0, None)
pending_report = None
error = ''
worker = None


def _work():
    global latest, pending_report, error
    while True:
        try:
            stamp = INPUT.stat().st_mtime_ns
            if stamp != latest[0]:
                data = json.loads(INPUT.read_text(encoding='utf-8-sig'))
                if INPUT.stat().st_mtime_ns == stamp:
                    latest = (stamp, data)
            payload = pending_report
            if payload is not None:
                pending_report = None
                temporary = OUT / 'ue-live.v173-tmp'
                temporary.write_text(json.dumps(payload), encoding='utf-8')
                os.replace(temporary, OUT / 'ue-live.json')
            error = ''
        except (OSError, ValueError) as exc:
            error = str(exc)
        time.sleep(.008)


def start():
    global worker
    if worker is None or not worker.is_alive():
        worker = threading.Thread(target=_work, name='PortfolioControlIO', daemon=True)
        worker.start()


def control():
    start()
    return latest


def report(data):
    global pending_report
    pending_report = dict(data)

