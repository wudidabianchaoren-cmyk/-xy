"""Bounded live diagnostics; no scene rebuilding, quality changes or code inbox."""
from pathlib import Path
import cProfile, io, json, pstats, time, importlib, inspect, ast
import unreal as u

P = Path(__file__).resolve().parents[1]
OUT = P / '.verify/v32-173'
probe = None
probe_handle = None


def run():
    global probe, probe_handle
    request = OUT / 'request.json'
    data = json.loads(request.read_text(encoding='utf-8-sig'))
    kind = data['kind']
    world = u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
    if kind == 'profile':
        label = data.get('label', 'baseline')
        if label not in ('baseline', 'after', 'realtime', 'scheduling', 'myth', 'capture-off', 'vp8'):
            raise ValueError('Unsupported profile label')
        if probe is not None:
            raise RuntimeError('Profile already running')
        probe = cProfile.Profile()
        deadline = time.monotonic() + 9
        def finish(dt):
            global probe, probe_handle
            if time.monotonic() < deadline:
                return
            probe.disable()
            output = io.StringIO()
            pstats.Stats(probe, stream=output).strip_dirs().sort_stats('cumulative').print_stats(65)
            (OUT / (label + '-python.txt')).write_text(output.getvalue(), encoding='utf-8')
            probe.dump_stats(str(OUT / (label + '.pstats')))
            probe = None
            u.unregister_slate_post_tick_callback(probe_handle)
            probe_handle = None
        probe_handle = u.register_slate_post_tick_callback(finish)
        for command in ['csvprofile STARTFILE=v173-' + label + '.csv', 'csvprofile FRAMES=300']:
            u.SystemLibrary.execute_console_command(world, command)
        probe.enable()
    elif kind == 'reload-control':
        # Replace only the two known callbacks, retaining all live scene/player state.
        frame = inspect.currentframe()
        while frame and Path(frame.f_code.co_filename).name != 'ue-live-final-v162.py':
            frame = frame.f_back
        if frame is None:
            raise RuntimeError('Live control callback scope unavailable')
        scope = frame.f_globals
        import ue_io_v173
        io_source = Path(ue_io_v173.__file__)
        io_tree = ast.parse(io_source.read_text(encoding='utf-8-sig'))
        io_functions = [node for node in io_tree.body if isinstance(node, ast.FunctionDef) and node.name in ('report', 'job')]
        exec(compile(ast.Module(body=io_functions, type_ignores=[]), str(io_source), 'exec'), ue_io_v173.__dict__)
        # Leave the running control-reader thread intact. Its old report slot
        # is no longer used; the independent writer also works before input exists.
        ue_io_v173.pending_report = None
        import ue_pose_v173
        pose_source = Path(ue_pose_v173.__file__)
        pose_tree = ast.parse(pose_source.read_text(encoding='utf-8-sig'))
        pose_functions = [node for node in pose_tree.body if isinstance(node, ast.FunctionDef) and node.name in ('vector', 'blend', 'frame', 'current')]
        exec(compile(ast.Module(body=pose_functions, type_ignores=[]), str(pose_source), 'exec'), ue_pose_v173.__dict__)
        source = P / 'scripts/ue-live-final-v162.py'
        tree = ast.parse(source.read_text(encoding='utf-8-sig'))
        selected = [node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name in ('tick', 'note')]
        if len(selected) != 2:
            raise RuntimeError('Unexpected control callback source')
        exec(compile(ast.Module(body=selected, type_ignores=[]), str(source), 'exec'), scope)
        u.unregister_slate_post_tick_callback(scope['handle'])
        scope['handle'] = u.register_slate_post_tick_callback(scope['tick'])
        import ue_runtime_v162 as runtime
        source = P / 'scripts/ue_runtime_v162.py'
        tree = ast.parse(source.read_text(encoding='utf-8-sig'))
        selected = [node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'tick']
        exec(compile(ast.Module(body=selected, type_ignores=[]), str(source), 'exec'), runtime.__dict__)
        u.unregister_slate_post_tick_callback(runtime.handle)
        runtime.handle = u.register_slate_post_tick_callback(runtime.tick)
        runtime.realtime = None
        import ue_io_v173
        ue_io_v173.start()
        (OUT / 'reload-control.json').write_text(json.dumps({'sameWorld': world.get_name(), 'at': time.time(), 'playersRetained': bool(runtime.roomMedia)}))
    elif kind == 'studio-dependencies':
        registry = u.AssetRegistryHelpers.get_asset_registry()
        options = u.AssetRegistryDependencyOptions()
        options.set_editor_property('include_hard_package_references', True)
        options.set_editor_property('include_soft_package_references', True)
        pending = ['/Game/V162/Studio']; graph = {}
        while pending:
            package = pending.pop()
            if package in graph:
                continue
            if len(graph) >= 2000:
                raise RuntimeError('Studio dependency traversal exceeded bounds')
            dependencies = sorted(str(name) for name in registry.get_dependencies(package, options) if str(name).startswith('/Game/'))
            graph[package] = dependencies
            pending.extend(name for name in dependencies if name not in graph)
        (OUT / 'studio-registry-dependencies.json').write_text(json.dumps({'entry': '/Game/V162/Studio', 'readOnly': True, 'packages': sorted(graph), 'graph': graph}, indent=2), encoding='utf-8')
    elif kind == 'quality-read':
        from ue_stability_v163 import QUALITY
        from ue_art_v164 import QUALITY as LATER_QUALITY
        keys = sorted({command.split()[0] for command in QUALITY + LATER_QUALITY if command.startswith('r.')})
        result = {'readOnly': True, 'at': time.time(), 'cvars': {key: u.SystemLibrary.get_console_variable_string_value(key) for key in keys}}
        (OUT / 'native-quality.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
    elif kind == 'reload-display':
        import ue_room_props_v167, ue_room_media_v169
        for module, names in [(ue_room_props_v167, ('update', 'update_glow', 'hide_glow')), (ue_room_media_v169, ('update', 'pair'))]:
            source = Path(module.__file__)
            tree = ast.parse(source.read_text(encoding='utf-8-sig'))
            selected = [node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name in names]
            if len(selected) != len(names):
                raise RuntimeError('Unexpected room display callback source')
            exec(compile(ast.Module(body=selected, type_ignores=[]), str(source), 'exec'), module.__dict__)
    elif kind == 'frame-sample':
        label = data.get('label', 'fps45')
        if label not in ('fps45', 'fps60', 'room-final', 'myth-final'):
            raise ValueError('Unsupported frame sample')
        began = time.perf_counter(); times = []; holder = {}
        def sample_frame(dt):
            now = time.perf_counter()
            if now - began < 2:
                return
            times.append(now)
            if now - began < 10:
                return
            intervals = [(b-a)*1000 for a,b in zip(times,times[1:])]
            (OUT / ('frames-' + label + '.json')).write_text(json.dumps({'at': time.time(), 'seconds': times[-1]-times[0], 'frames': len(times)-1, 'intervalsMs': intervals}))
            u.unregister_slate_post_tick_callback(holder['handle'])
        holder['handle'] = u.register_slate_post_tick_callback(sample_frame)
    elif kind in ('fps60', 'fps45'):
        import builtins
        fps = 60 if kind == 'fps60' else 45
        component = getattr(builtins, '_zaojing_native_capture_v164')
        component.set_editor_property('stream_fps_override', fps)
        component.start_streaming()
        u.SystemLibrary.execute_console_command(world, 'PixelStreaming2.WebRTC.Fps ' + str(fps))
        u.SystemLibrary.execute_console_command(world, 't.MaxFPS ' + str(fps))
    elif kind == 'media-fix':
        import ue_room_display_v173, ue_room_media_v169, ue_room_props_v167
        material, glow = importlib.reload(ue_room_display_v173).prepare()
        session = ue_room_media_v169.SESSION
        importlib.reload(ue_room_media_v169)
        ue_room_media_v169.SESSION = session
        # Existing prop originals must survive the code update as well.
        old_originals = ue_room_props_v167.originals
        importlib.reload(ue_room_props_v167)
        ue_room_props_v167.originals = old_originals
        (OUT / 'media-fix.json').write_text(json.dumps({'at': time.time(), 'material': material.get_path_name(), 'glow': glow.get_path_name(), 'originalMediaBytesUnchanged': True}))
    elif kind in ('slate-cache', 'slate-reset'):
        before = u.SystemLibrary.get_console_variable_int_value('Slate.EnableGlobalInvalidation')
        value = 1 if kind == 'slate-cache' else 0
        u.SystemLibrary.execute_console_command(world, 'Slate.EnableGlobalInvalidation ' + str(value))
        (OUT / (kind + '.json')).write_text(json.dumps({'before': before, 'after': value, 'sessionOnly': True, 'qualityChanged': False}))
    elif kind == 'scheduling':
        names = ['r.VSync', 'r.VSyncEditor', 'r.OneFrameThreadLag', 'r.FinishCurrentFrame', 'r.GTSyncType', 'rhi.SyncInterval']
        before = {key: u.SystemLibrary.get_console_variable_int_value(key) for key in names}
        for command in ['r.VSync 0', 'r.VSyncEditor 0', 'r.FinishCurrentFrame 0', 'r.OneFrameThreadLag 1']:
            u.SystemLibrary.execute_console_command(world, command)
        (OUT / 'native-scheduling.json').write_text(json.dumps({'before': before, 'at': time.time()}))
    elif kind == 'trace':
        u.SystemLibrary.execute_console_command(world, 'Trace.File E:/codex/unreal/ZaOjIngV146/Saved/Profiling/v173-main-cpu.utrace cpu,frame,bookmark')
        deadline = time.monotonic() + 20
        holder = {}
        def finish_trace(dt):
            if time.monotonic() < deadline:
                return
            u.SystemLibrary.execute_console_command(world, 'Trace.Stop')
            u.unregister_slate_post_tick_callback(holder['handle'])
        holder['handle'] = u.register_slate_post_tick_callback(finish_trace)
    elif kind == 'inspect':
        import ue_runtime_v162 as runtime, ue_room_media_v169 as media
        state = runtime.roomMedia or {}
        result = {'at': time.time(), 'scene': runtime.cachedScene,
                  'actors': len(runtime.cache), 'media': {},
                  'cvars': {key: u.SystemLibrary.get_console_variable_string_value(key) for key in [
                      't.MaxFPS', 'PixelStreaming2.Encoder.Codec', 'PixelStreaming2.Encoder.VP9Threads',
                      'PixelStreaming2.WebRTC.Fps', 'MediaIO.EnableExperimentalScheduling']}}
        for key in ('work', 'pending', 'on', 'opened', 'requested_at'):
            result['media'][key] = state.get(key)
        player = state.get('player')
        if player:
            result['media'].update(width=player.get_video_track_dimensions(0, 0).x,
                                   height=player.get_video_track_dimensions(0, 0).y,
                                   fps=player.get_video_track_frame_rate(0, 0),
                                   texture=[state['texture'].get_width(), state['texture'].get_height()],
                                   playing=player.is_playing())
        (OUT / 'native-inspect.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
    else:
        raise ValueError('Unsupported V173 operation')
    request.unlink()
