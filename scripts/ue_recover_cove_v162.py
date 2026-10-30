"""Recover only the new V162 scene copy from the preserved V161 map; reuse completed V162 assets."""
import unreal as u,json,re
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162'
def ensure_cove():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem)
 levels.load_level('/Game/Cove/FullCoveV162')
 if any(a.get_actor_label()=='Vessel'for a in actors.get_all_level_actors()):return False
 levels.load_level('/Game/Cove/FullCoveV161');all=actors.get_all_level_actors();vessel=next((a for a in all if a.get_actor_label()=='Vessel'),None);assert vessel,'Preserved V161 must contain the original vessel'
 mesh=u.load_asset('/Game/V162Vessel/vessel-oarports-ue/StaticMeshes/vessel-oarports-ue');crew=u.load_asset('/Game/V162Crew/medieval-rowers-ue/StaticMeshes/medieval-rowers-ue');assert isinstance(mesh,u.StaticMesh)and isinstance(crew,u.StaticMesh)
 vessel.static_mesh_component.set_static_mesh(mesh);vessel.static_mesh_component.set_editor_property('override_materials',[]);linen=u.load_asset('/Game/Cove/V147_NaturalLinen');assert linen
 c=vessel.static_mesh_component
 for i in range(c.get_num_materials()):
  m=c.get_material(i)
  if m and any(k in m.get_name().lower()for k in['linen','sail','canvas']):c.set_material(i,linen)
 for a in all:
  if isinstance(a,u.StaticMeshActor)and(a.get_actor_label()=='Crew'or a.get_actor_label().startswith('V162 rower ')):actors.destroy_actor(a)
 a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector());a.set_actor_label('V162 rower medieval-rowers-ue');a.static_mesh_component.set_static_mesh(crew);a.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE)
 assert any(a.get_actor_label()=='Island'for a in actors.get_all_level_actors()),'Preserved island must be present'
 u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'cove-recovery.json').write_text(json.dumps({'sourceUnmodified':'/Game/Cove/FullCoveV161','recoveredCopy':'/Game/Cove/FullCoveV162','completedV162CrewAndOarportAssetsReused':True,'actorsBeforeNewGulls':len(actors.get_all_level_actors())}));return True
def preserve_authored_vessel_materials():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);levels.load_level('/Game/Cove/FullCoveV161');old=next(a for a in actors.get_all_level_actors()if a.get_actor_label()=='Vessel').static_mesh_component;normal=lambda s:re.sub('[^a-z0-9]','',str(s).lower());source=[];byName={}
 for i,slot in enumerate(old.static_mesh.get_editor_property('static_materials')):
  name=str(slot.material_slot_name);path=old.get_material(i).get_path_name()if old.get_material(i)else None;source.append({'slot':name,'material':path})
  if path and any(k in name.lower()for k in['oak','timber','wood','bronze','linen','rope','sawn','ash','leather','iron','flax']):byName[normal(name)]=path
 levels.load_level('/Game/Cove/FullCoveV162');current=next(a for a in actors.get_all_level_actors()if a.get_actor_label()=='Vessel').static_mesh_component;current.set_editor_property('override_materials',[]);mapped=[]
 for i,slot in enumerate(current.static_mesh.get_editor_property('static_materials')):
  name=str(slot.material_slot_name);path=byName.get(normal(name))
  if any(k in name.lower()for k in['linen','sail','canvas']):path='/Game/Cove/V147_NaturalLinen'
  if path:current.set_material(i,u.load_asset(path));mapped.append({'slot':name,'material':path})
 u.EditorLoadingAndSavingUtils.save_map(u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'vessel-authored-materials.json').write_text(json.dumps({'sourceMapUnmodified':'/Game/Cove/FullCoveV161','matching':'semantic material slot names, never numeric index','nativeMaterialSlotsReused':len(mapped),'newOarportSlotRetained':True,'source':source,'mapped':mapped},indent=2))
