"""Bounded inspection and repair of the retained cottage roof only."""
import unreal as u,json,time
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-169'
def run():
 import ue_worlds_v165
 kind=json.loads((OUT/'request.json').read_text(encoding='utf-8-sig')).get('kind')
 if kind=='roof':
  changed=[]
  shared=u.load_asset('/InterchangeAssets/gltf/M_Default.M_Default')
  if shared:shared.set_editor_property('two_sided',False);u.MaterialEditingLibrary.recompile_material(shared);u.EditorAssetLibrary.save_loaded_asset(shared)
  for a in ue_worlds_v165.actors('myth'):
   if not isinstance(a,u.StaticMeshActor)or 'V161_aged_terracotta'not in a.get_actor_label():continue
   c=a.static_mesh_component
   for i in range(c.get_num_materials()):
    m=c.get_material(i)
    while isinstance(m,u.MaterialInstanceDynamic):m=m.get_editor_property('parent')
    if not isinstance(m,(u.Material,u.MaterialInstanceConstant))or m.get_path_name()in changed:continue
    if isinstance(m,u.MaterialInstanceConstant):
     overrides=m.get_editor_property('base_property_overrides');overrides.set_editor_property('override_two_sided',True);overrides.set_editor_property('two_sided',True);m.set_editor_property('base_property_overrides',overrides)
    else:m.set_editor_property('two_sided',True);u.MaterialEditingLibrary.recompile_material(m)
    u.EditorAssetLibrary.save_loaded_asset(m);changed.append(m.get_path_name())
  (OUT/'roof-fixed.json').write_text(json.dumps({'at':time.time(),'twoSidedRoofMaterials':changed,'originalGeometryAndColorPreserved':True},indent=2));(OUT/'request.json').unlink();return
 items=[]
 for a in ue_worlds_v165.actors('myth'):
  if not isinstance(a,u.StaticMeshActor):continue
  c=a.static_mesh_component;mesh=c.static_mesh
  if not any(k in (a.get_actor_label()+' '+(mesh.get_name()if mesh else'')).lower()for k in ['cottage','roof','house','limewashed']):continue
  origin,extent=a.get_actor_bounds(False)
  items.append({'label':a.get_actor_label(),'mesh':mesh.get_path_name()if mesh else None,'visible':c.is_visible(),'position':str(a.get_actor_location()),'origin':[origin.x,origin.y,origin.z],'extent':[extent.x,extent.y,extent.z],'materials':[str(c.get_material(i).get_path_name())for i in range(c.get_num_materials())]})
 (OUT/'roof-inventory.json').write_text(json.dumps({'at':time.time(),'items':items},indent=2));(OUT/'request.json').unlink()
