"""Only reconnect the saved viewport stream; do not rebuild or replace a scene."""
from pathlib import Path
import builtins
import json
import time
import unreal as u

P = Path(__file__).resolve().parents[1]
OUT = P / '.verify/v32-171'


def run():
    request = OUT / 'request.json'
    kind = json.loads(request.read_text(encoding='utf-8-sig'))['kind']
    if kind not in ('rebind-stream', 'runtime-performance'):
        raise ValueError('Unsupported V171 operation')
    world = u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
    if kind == 'runtime-performance':
        import ue_session_v171, importlib
        importlib.reload(ue_session_v171)
        result = {'at': time.time(), 'session': ue_session_v171.apply(), 'savedConfig': False,
                  'cvars': {key: u.SystemLibrary.get_console_variable_float_value(key)
                            for key in ['t.MaxFPS', 'Slate.bAllowThrottling', 't.IdleWhenNotForeground',
                                        'r.ScreenPercentage', 'PixelStreaming2.WebRTC.Fps']}}
        (OUT / 'runtime-performance-native.json').write_text(json.dumps(result))
        request.unlink()
        return
    component = getattr(builtins, '_zaojing_native_capture_v164', None)
    import ue_stream_v164, importlib
    importlib.reload(ue_stream_v164).ensure(refresh=True)
    u.SystemLibrary.execute_console_command(world, 't.MaxFPS 45')
    u.get_editor_subsystem(u.LevelEditorSubsystem).editor_invalidate_viewports()
    (OUT / 'rebind-native.json').write_text(json.dumps({
        'at': time.time(), 'kind': kind, 'sameWorld': world.get_name(),
        'explicitlyStoppedCapture': False, 'existingProducer': bool(component)}))
    request.unlink()
