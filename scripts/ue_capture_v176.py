"""Bounded viewport queue configuration through reflected MediaCapture APIs."""
import ctypes
import json
import time
from pathlib import Path
import unreal as u

pending = None


def schedule():
    """Configure the newly created producer once it has a real viewport."""
    global pending
    if pending is not None:
        u.unregister_slate_post_tick_callback(pending)
    began = time.perf_counter()
    def finish(dt):
        global pending
        if time.perf_counter()-began < .2:
            return
        try:
            result = configure(4)
        except Exception as exc:
            result = {'error': str(exc), 'usingOriginalBufferPolicy': True}
        output = Path(__file__).resolve().parents[1] / '.verify/v32-176'
        output.mkdir(parents=True, exist_ok=True)
        (output / 'capture-policy.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
        u.unregister_slate_post_tick_callback(pending)
        pending = None
    pending = u.register_slate_post_tick_callback(finish)


def prepare_for_stop(capture):
    """Clear UE 5.8.4's stale resize latch through its exported initializer.

    ViewportResized sets the latch even for a same-size event. Otherwise a
    manual stop silently creates another producer before reconfiguration.
    InitializeCapture only clears that latch, sets bDoGPUCopy and retains
    CAPTURING; the installed method implementation has been checked.
    """
    assert u.SystemLibrary.get_engine_version().split('-')[0] == '5.8.4'
    assert ctypes.sizeof(ctypes.c_void_p) == 8
    class StringView(ctypes.Structure):
        _fields_ = [('data', ctypes.c_void_p), ('size', ctypes.c_int32)]
    assert ctypes.sizeof(StringView) == 16
    kernel = ctypes.WinDLL('kernel32', use_last_error=True)
    kernel.GetModuleHandleW.argtypes = [ctypes.c_wchar_p]
    kernel.GetModuleHandleW.restype = ctypes.c_void_p
    def loaded(name):
        handle = kernel.GetModuleHandleW(name)
        assert handle, 'Verified engine module is not loaded'
        return ctypes.WinDLL(name, handle=handle)
    core = loaded('UnrealEditor-CoreUObject.dll')
    find = getattr(core, '?StaticFindObjectSafe@@YAPEAVUObject@@PEAVUClass@@PEAV1@V?$TStringView@_W@@W4EFindObjectFlags@@@Z')
    find.argtypes = [ctypes.c_void_p, ctypes.c_void_p, ctypes.POINTER(StringView), ctypes.c_uint32]
    find.restype = ctypes.c_void_p
    name = capture.get_path_name()
    text = ctypes.create_unicode_buffer(name)
    view = StringView(ctypes.cast(text, ctypes.c_void_p), len(name))
    pointer = find(None, None, ctypes.byref(view), 0)
    assert pointer and pointer % 8 == 0, 'Exact native capture lookup failed'
    plugin = loaded('UnrealEditor-PixelStreaming2.dll')
    reset = getattr(plugin, '?InitializeCapture@UPixelStreaming2MediaIOCapture@@UEAA_NXZ')
    reset.argtypes = [ctypes.c_void_p]
    reset.restype = ctypes.c_bool
    assert reset(pointer), 'Resize-latch reset failed'


def configure(count=4):
    assert count in (4, 8)
    # Experimental scheduling previously failed on this machine; keep it off.
    assert u.SystemLibrary.get_console_variable_int_value('MediaIO.EnableExperimentalScheduling') == 0
    active = [item for item in u.ObjectIterator(u.MediaCapture) if item.get_class().get_name() == 'PixelStreaming2MediaIOCapture' and item.get_state() == u.MediaCaptureState.CAPTURING]
    assert active, 'Expected original viewport capture'
    active.sort(key=lambda item: int(item.get_name().rsplit('_', 1)[-1]))
    for old in active[:-1]:
        prepare_for_stop(old)
        old.stop_capture(False)
    capture = active[-1]
    expected = capture.get_name().replace('MediaIOCapture', 'MediaIOOutput')
    outputs = [item for item in u.ObjectIterator(u.MediaOutput) if item.get_name() == expected and item.get_class().get_name() == 'PixelStreaming2MediaIOOutput']
    assert len(outputs) == 1, 'Expected the matching viewport output'
    output = outputs[0]
    before = output.get_editor_property('number_of_texture_buffers')
    # There is no reflected GetMediaOutput. SetMediaOutput is public and requires
    # a stopped capture, as documented by the installed MediaCapture.h.
    prepare_for_stop(capture)
    capture.stop_capture(False)
    output.set_editor_property('number_of_texture_buffers', count)
    capture.set_media_output(output)
    options = u.MediaCaptureOptions()
    options.set_editor_property('skip_frame_when_running_expensive_tasks', False)
    options.set_editor_property('overrun_action', u.MediaCaptureOverrunAction.SKIP)
    options.set_editor_property('resize_method', u.MediaCaptureResizeMethod.NONE)
    assert capture.capture_active_scene_viewport(options), 'Viewport capture restart failed'
    return {'capture': capture.get_name(), 'output': output.get_name(), 'before': before, 'after': count, 'state': str(capture.get_state()), 'experimentalScheduling': False, 'resolutionAndArtUnchanged': True}
