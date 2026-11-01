"""Drive the original imported room props; never replace the room or recreate its art."""
import unreal as u,json
from pathlib import Path
P=Path(__file__).resolve().parents[1]
BINDINGS=json.loads((P/'assets/directory-v167/native-bindings.json').read_text())
cache_identity=None;groups={};previous={};originals={};glow_actor=None

def hide_glow():
 if glow_actor:glow_actor.static_mesh_component.set_visibility(False,True)

def update_glow(data):
 global glow_actor
 info=next((item.get('glow')for item in data.get('roomProps',[])if item.get('glow')),None)
 if not info:
  hide_glow();return
 if glow_actor is None:
  material=u.load_asset('/Game/V173/TransferGlow')
  if material is None:return
  glow_actor=u.get_editor_subsystem(u.EditorActorSubsystem).spawn_actor_from_class(u.StaticMeshActor,u.Vector())
  glow_actor.set_actor_label('V173 synchronized CD transfer light')
  c=glow_actor.static_mesh_component;c.set_mobility(u.ComponentMobility.MOVABLE);c.set_static_mesh(u.load_asset('/Engine/BasicShapes/Sphere'));c.set_material(0,material);c.set_editor_property('cast_shadow',False);c.set_collision_enabled(u.CollisionEnabled.NO_COLLISION)
 # Keep the point on the front of the jewel case rather than inside its opaque print.
 glow_actor.set_actor_location(u.Vector(info[0]*100,(info[2]+.012)*100,info[1]*100),False,False)
 glow_actor.set_actor_scale3d(u.Vector(*([max(.002,info[3]*.30)]*3)))
 glow_actor.static_mesh_component.set_visibility(True,True)

def update(cache,data):
 global cache_identity,groups,previous,originals
 update_glow(data)
 if cache_identity is not cache:
  cache_identity=cache;groups={};previous={}
  for key,labels in BINDINGS.items():
   groups[key]=[cache[label]for label in labels if label in cache]
   for actor in groups[key]:
    if actor not in originals:originals[actor]=actor.get_actor_transform()
    actor.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE)
 for item in data.get('roomProps',[]):
  key=item['id'];pose=tuple(item['p']+item['q']+item['s'])+(item['visible'],)
  if previous.get(key)==pose:continue
  previous[key]=pose;p=item['p'];q=item['q'];s=item['s'];rotation=u.Quat(-q[0],-q[2],-q[1],q[3])
  change=u.Transform(location=u.Vector(p[0]*100,p[2]*100,p[1]*100),rotation=rotation.rotator(),scale=u.Vector(s[0],s[2],s[1]))
  for actor in groups.get(key,[]):
   actor.set_actor_transform(u.MathLibrary.compose_transforms(originals[actor],change),False,False)
   actor.static_mesh_component.set_visibility(item['visible'],True)

def restore():
 for actor,transform in originals.items():
  actor.set_actor_transform(transform,False,False);actor.static_mesh_component.set_visibility(True,True)
 previous.clear()
