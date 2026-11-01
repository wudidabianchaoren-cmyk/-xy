"""Small active-frame window measured without capture jobs or Python profiling."""
from collections import deque

samples = deque()
previous = None
scene_key = None
reported = 0.


def update(scene, active, now):
    global previous, scene_key, reported
    if not active or scene != scene_key:
        samples.clear(); previous = None; scene_key = scene
    if not active:
        return None
    if previous is not None:
        samples.append((now, (now-previous)*1000))
    previous = now
    while samples and now-samples[0][0] > 8:
        samples.popleft()
    if now-reported < 1 or len(samples) < 2:
        return None
    reported = now
    values = sorted(value for _, value in samples)
    seconds = sum(values)/1000
    return {'scene': scene, 'seconds': seconds, 'frames': len(values),
            'fps': len(values)/seconds, 'p95Ms': values[int(len(values)*.95)],
            'maxMs': values[-1], 'over50ms': sum(value>50 for value in values),
            'method': 'native post-tick / active eight-second window'}
