"""Bounded performance capture and current room-media refresh; original art is retained."""
from pathlib import Path
import unreal as u,json,time,importlib
P=Path(__file__).resolve().parents[1];O=P/'.verify/v32-172'
def run():
    request=O/'request.json';data=json.loads(request.read_text(encoding='utf-8-sig'));kind=data['kind']
    w=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
    if kind=='profile':
        label=data.get('label','room-before')
        if label not in ['room-before','room-after','myth-after']:raise ValueError('Unsupported profile')
        for command in ['csvprofile STARTFILE=v172-'+label+'.csv','csvprofile FRAMES=240']:
            u.SystemLibrary.execute_console_command(w,command)
        result={'kind':kind,'label':label,'frames':240,'at':time.time(),'world':w.get_name()}
    elif kind=='media-refresh':
        import ue_room_media_v169
        # Reload functions without losing the existing decoded media pair.
        session=ue_room_media_v169.SESSION
        importlib.reload(ue_room_media_v169)
        ue_room_media_v169.SESSION=session
        result={'kind':kind,'sameWorld':w.get_name(),'retainedPlayers':len(session),'at':time.time()}
    else:raise ValueError('Unsupported V172 operation')
    (O/'native-last-operation.json').write_text(json.dumps(result),encoding='utf-8');request.unlink()
