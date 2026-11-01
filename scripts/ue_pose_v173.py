"""Bridge uneven control arrivals with one bounded clock for camera, discs and glow."""
import math

stamp = None
began = 0.
duration = .022
source = target = presented = None
moving = changed = False


def vector(a, b, fraction):
    return [x+(y-x)*fraction for x, y in zip(a, b)]


def blend(a, b, fraction):
    if fraction >= 1:
        return b
    output = dict(b)
    for name in ('camera', 'target'):
        if name in a and name in b:
            output[name] = vector(a[name], b[name], fraction)
    originals = {item['id']: item for item in a.get('roomProps', [])}
    props = []
    for item in b.get('roomProps', []):
        old = originals.get(item['id'], item)
        part = dict(item)
        for name in ('p', 's'):
            part[name] = vector(old[name], item[name], fraction)
        # Normalized shortest-path quaternion interpolation avoids a wrap at +/-180.
        qa, qb = old['q'], item['q']
        if sum(x*y for x, y in zip(qa, qb)) < 0:
            qb = [-value for value in qb]
        rotation = vector(qa, qb, fraction)
        length = math.sqrt(sum(value*value for value in rotation))
        part['q'] = [value/length for value in rotation] if length else list(qb)
        part['visible'] = old.get('visible', True)
        if not old.get('commit', True) and item.get('commit', True):
            part['commit'] = False
        if old.get('glow') and item.get('glow'):
            part['glow'] = vector(old['glow'], item['glow'], fraction)
        elif old.get('glow') and not item.get('glow'):
            part['glow'] = old['glow']
        props.append(part)
    if 'roomProps' in b:
        output['roomProps'] = props
    return output


def frame(next_stamp, data, now):
    global stamp, began, duration, source, target, presented, moving, changed
    changed = moving
    if data is None:
        return None
    if data.get('scene') not in ('room', 'myth') or not data.get('active', True) or data.get('paused', False):
        stamp = next_stamp; source = target = presented = data; moving = False; changed = True
        return presented
    if stamp != next_stamp:
        pose_changed = target is None or any(target.get(name) != data.get(name) for name in ('scene', 'camera', 'target', 'roomProps'))
        if pose_changed:
            old = blend(source, target, min(1., max(0., (now-began)/duration))) if source is not None else data
            same_scene = old.get('scene') == data.get('scene') and old.get('active', True) and not old.get('paused', False)
            duration = min(.040, max(.015, now-began))
            source = old if same_scene else data
            began = now
            moving = any(source.get(name) != data.get(name) for name in ('camera', 'target', 'roomProps'))
        # Metadata/heartbeats must not restart a finished disc's arrival clock.
        target = data; stamp = next_stamp; changed = True
    fraction = min(1., max(0., (now-began)/duration))
    presented = blend(source, target, fraction)
    moving = moving and fraction < 1
    return presented


def current(fallback):
    return presented if presented is not None and presented.get('scene') == fallback.get('scene') else fallback
