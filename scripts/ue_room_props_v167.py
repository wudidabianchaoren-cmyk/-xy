"""Drive the original imported room props; never replace the room or recreate its art."""
import unreal as u,json
from pathlib import Path
P=Path(__file__).resolve().parents[1]
BINDINGS=json.loads((P/'assets/directory-v167/native-bindings.json').read_text())
cache_identity=None;groups={};previous={};originals={}

def update(cache,data):
 global cache_identity,groups,previous,originals
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
