"""Bounded V164 editor jobs; diagnostics before editing accepted scenes."""
import unreal as u,json,importlib
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-164';OUT.mkdir(exist_ok=True)
def audit():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);r={}
 for scene,path in [('home','/Game/V162/Courtyard'),('room','/Game/V162/Studio'),('myth','/Game/Cove/FullCoveV162')]:
  levels.load_level(path);entries=[]
  for a in actors.get_all_level_actors():
   e={'label':a.get_actor_label(),'class':a.get_class().get_name()}
   if isinstance(a,u.StaticMeshActor):
    c=a.static_mesh_component;e['mesh']=c.static_mesh.get_path_name()if c.static_mesh else None;e['materials']=[c.get_material(i).get_path_name()if c.get_material(i)else None for i in range(c.get_num_materials())];o,b=a.get_actor_bounds(False);e['bounds']=[o.x,o.y,o.z,b.x,b.y,b.z]
   if isinstance(a,u.Light):e['intensity']=a.light_component.intensity;e['color']=str(a.light_component.get_light_color())
   entries.append(e)
  r[scene]=entries
 (OUT/'native-inventory.json').write_text(json.dumps(r,indent=2))
def run():
 request=OUT/'request.json';v=json.loads(request.read_text());kind=v['kind']
 if kind=='audit':audit()
 elif kind=='details':details()
 elif kind=='stream':
  import ue_stream_v164
  importlib.reload(ue_stream_v164).ensure(refresh=True)
 elif kind in ['home','room','myth','runtime','sea_finish','cloud','tide','window_finish']:
  import ue_art_v164
  getattr(importlib.reload(ue_art_v164),kind)()
 else:raise ValueError('Unsupported V164 job')
 (OUT/'job-result.json').write_text(json.dumps({'kind':kind,'ok':True}));request.unlink()

def details():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);r={}
 for scene,path in [('home','/Game/V162/Courtyard'),('room','/Game/V162/Studio'),('myth','/Game/Cove/FullCoveV162')]:
  levels.load_level(path);ms={};lights=[]
  for a in actors.get_all_level_actors():
   if isinstance(a,u.Light):lights.append({'label':a.get_actor_label(),'class':a.get_class().get_name(),'intensity':a.light_component.intensity})
   if isinstance(a,u.StaticMeshActor):
    c=a.static_mesh_component
    for i in range(c.get_num_materials()):
     m=c.get_material(i)
     if not m or m.get_path_name()in ms:continue
     if scene=='myth'and a.get_actor_label()not in ['Vessel','Water foundation']:continue
     expr=[]
     for e in u.ObjectIterator(u.MaterialExpression):
      if e.get_outer()!=m:continue
      d={'class':e.get_class().get_name(),'name':e.get_name()}
      for prop in ['texture','code','parameter_name','r','constant']:
       try:
        v=e.get_editor_property(prop);d[prop]=v.get_path_name()if isinstance(v,u.Object)else str(v)
       except Exception:pass
      expr.append(d)
     d={'actors':[a.get_actor_label()],'class':m.get_class().get_name(),'expressions':expr}
     if isinstance(m,u.MaterialInstanceConstant):
      d['parent']=m.get_editor_property('parent').get_path_name()
      for kind in ['scalar','vector','texture']:
       d[kind]={}
       for name in getattr(u.MaterialEditingLibrary,'get_'+kind+'_parameter_names')(m):
        v=getattr(u.MaterialEditingLibrary,'get_material_instance_'+kind+'_parameter_value')(m,name)
        d[kind][str(name)]=v.get_path_name()if isinstance(v,u.Object)else str(v)
     ms[m.get_path_name()]=d
  r[scene]={'materials':ms,'lights':lights}
 (OUT/'material-details.json').write_text(json.dumps(r,indent=2))
