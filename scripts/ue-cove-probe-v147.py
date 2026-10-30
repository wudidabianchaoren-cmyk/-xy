import unreal as u,json
from pathlib import Path
P=Path(__file__).resolve().parents[1];u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV147');actors=u.get_editor_subsystem(u.EditorActorSubsystem);out={}
for a in actors.get_all_level_actors():
 if a.get_actor_label() in ['Island','Vessel','Cottage','Crew','Grass','Foliage 0','Foliage 1','Foliage 2','Water foundation']:
  b=a.get_actor_bounds(False);out[a.get_actor_label()]={'location':str(a.get_actor_location()),'rot':str(a.get_actor_rotation()),'center':list(b[0].to_tuple()),'extent':list(b[1].to_tuple())}
(P/'.verify/v32-147/ue-bounds.json').write_text(json.dumps(out,indent=2),encoding='utf-8');u.SystemLibrary.quit_editor()
