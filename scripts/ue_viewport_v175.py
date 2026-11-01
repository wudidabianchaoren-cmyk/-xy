"""Restore real editor rendering through installed public UE 5.8 methods.

The reflected LevelEditor setter pushes/removes one named override; it does
not set the viewport's underlying realtime flag. Never write engine memory.
Run on the editor game thread, using only verified exported public methods.
"""
import ctypes
import json
import time
from pathlib import Path
import unreal as u

last_result = None


def ensure():
    global last_result
    if not u.SystemLibrary.get_engine_version().startswith('5.8.'):
        raise RuntimeError('Viewport binding requires the verified UE 5.8 ABI')
    kernel = ctypes.WinDLL('kernel32', use_last_error=True)
    kernel.GetModuleHandleW.argtypes = [ctypes.c_wchar_p]
    kernel.GetModuleHandleW.restype = ctypes.c_void_p
    handle = kernel.GetModuleHandleW('UnrealEditor-UnrealEd.dll')
    if not handle:
        raise RuntimeError('Existing UnrealEd module is not loaded')
    module = ctypes.WinDLL('UnrealEditor-UnrealEd.dll', handle=handle)
    viewport = ctypes.c_void_p.in_dll(module, '?GCurrentLevelEditingViewportClient@@3PEAVFLevelEditorViewportClient@@EA').value
    if not viewport or viewport % ctypes.sizeof(ctypes.c_void_p):
        raise RuntimeError('No active level editing viewport')
    pop = getattr(module, '?PopRealtimeOverride@FEditorViewportClient@@QEAA_NXZ')
    pop.argtypes = [ctypes.c_void_p]
    pop.restype = ctypes.c_bool
    set_realtime = getattr(module, '?SetRealtime@FEditorViewportClient@@QEAAX_N@Z')
    set_realtime.argtypes = [ctypes.c_void_p, ctypes.c_bool]
    set_realtime.restype = None
    removed = 0
    while removed < 64 and pop(viewport):
        removed += 1
    if removed == 64:
        raise RuntimeError('Unexpected viewport override depth')
    set_realtime(viewport, True)
    last_result = {'at': time.time(), 'removedOverrides': removed,
                   'baseRealtime': True, 'engine': u.SystemLibrary.get_engine_version(),
                   'binding': 'public exported PopRealtimeOverride and SetRealtime'}
    output = Path(__file__).resolve().parents[1] / '.verify/v32-175'
    output.mkdir(parents=True, exist_ok=True)
    (output / 'realtime.json').write_text(json.dumps(last_result, indent=2), encoding='utf-8')
    return last_result
