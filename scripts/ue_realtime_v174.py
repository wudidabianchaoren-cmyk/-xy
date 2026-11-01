"""Latest valid numeric loopback packet. No Unreal calls or filesystem I/O here."""
import json, math, socket, threading, time

latest = (0, None)
worker = None
error = ''


def valid(data):
    if not isinstance(data, dict) or data.get('bridgeProtocol') != 'portfolio-numeric-v174':
        return False
    if data.get('scene') not in ('room', 'home', 'myth') or not isinstance(data.get('seq'), int):
        return False
    if not isinstance(data.get('bridgeEpoch'), str) or len(data['bridgeEpoch']) > 64:
        return False
    if not isinstance(data.get('at'), (int, float)) or not math.isfinite(data['at']):
        return False
    for key in ('camera', 'target'):
        values = data.get(key)
        if not isinstance(values, list) or len(values) != 3 or not all(isinstance(x, (int, float)) and math.isfinite(x) and abs(x) < 100000 for x in values):
            return False
    for key in ('active', 'paused', 'night', 'lamp', 'roomTV', 'directCamera'):
        if key in data and not isinstance(data[key], bool):
            return False
    for key, limit in (('roomProps', 9), ('homeParts', 64)):
        entries = data.get(key, [])
        if not isinstance(entries, list) or len(entries) > limit:
            return False
        for item in entries:
            if not isinstance(item, dict) or not isinstance(item.get('id'), str) or len(item['id']) > 160:
                return False
            for name, size in (('p', 3), ('q', 4), ('s', 3)):
                values = item.get(name)
                if not isinstance(values, list) or len(values) != size or not all(isinstance(x, (int, float)) and math.isfinite(x) and abs(x) < 100000 for x in values):
                    return False
    return True


def _work():
    global latest, error
    try:
        channel = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        channel.bind(('127.0.0.1', 8891))
        while True:
            payload, address = channel.recvfrom(32769)
            if address[0] != '127.0.0.1' or len(payload) > 32768:
                continue
            try:
                data = json.loads(payload)
                if not valid(data):
                    continue
                key = (data['bridgeEpoch'], data['seq'])
                if latest[1] and key[0] == latest[0][0] and key[1] <= latest[0][1]:
                    continue
                latest = (key, data)
            except (ValueError, TypeError, KeyError):
                continue
    except OSError as exc:
        error = str(exc)


def current(fallback):
    global worker
    if worker is None:
        worker = threading.Thread(target=_work, name='PortfolioRealtimeInput', daemon=True)
        worker.start()
    data = latest[1]
    if data and (fallback[1] is None or data['at'] >= fallback[1].get('at', 0)):
        return latest
    return fallback
