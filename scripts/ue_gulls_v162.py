import unreal as u,json
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162'
def ensure():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);levels.load_level('/Game/Cove/FullCoveV162');actors=u.get_editor_subsystem(u.EditorActorSubsystem)
 if any(a.get_actor_label()=='V162 Gull 0 GullBody'for a in actors.get_all_level_actors()):return
 tools=u.AssetToolsHelpers.get_asset_tools();meshes={}
 for path in u.EditorAssetLibrary.list_assets('/Game/V162Gull',True,False):
  asset=u.load_asset(path)
  if isinstance(asset,u.StaticMesh):meshes[asset.get_name()]=asset
 if len(meshes)!=5:
  task=u.AssetImportTask();task.filename=str(P/'assets/odyssey/crew-v162/gull-native.glb');task.destination_path='/Game/V162Gull';task.automated=True;task.replace_existing=True;task.save=True;tools.import_asset_tasks([task]);meshes={u.load_asset(p).get_name():u.load_asset(p)for p in task.imported_object_paths if isinstance(u.load_asset(p),u.StaticMesh)}
 assert len(meshes)==5,str(meshes.keys())
 material=u.load_asset('/Game/V162Gull/ActualGullVertexColours')or tools.create_asset('ActualGullVertexColours','/Game/V162Gull',u.Material,u.MaterialFactoryNew());mel=u.MaterialEditingLibrary;mel.delete_all_material_expressions(material);vc=mel.create_material_expression(material,u.MaterialExpressionVertexColor);assert mel.connect_material_property(vc,'',u.MaterialProperty.MP_BASE_COLOR);n=mel.create_material_expression(material,u.MaterialExpressionConstant);n.r=.84;assert mel.connect_material_property(n,'',u.MaterialProperty.MP_ROUGHNESS);mel.recompile_material(material);meta=json.loads((OUT/'gull-native.json').read_text())
 for i in range(7):
  created={}
  for part in meta:
   a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector(0,4900,840));a.set_actor_label('V162 Gull '+str(i)+' '+part['name']);c=a.static_mesh_component;c.set_static_mesh(meshes[part['name']]);c.set_material(0,material);c.set_mobility(u.ComponentMobility.MOVABLE);c.set_cast_shadow(False);created[part['name']]=a
   if part['parent']:
    a.attach_to_actor(created[part['parent']],'',u.AttachmentRule.KEEP_RELATIVE,u.AttachmentRule.KEEP_RELATIVE,u.AttachmentRule.KEEP_RELATIVE,False);p=part['position'];a.set_actor_relative_location(u.Vector(p[0]*100,p[2]*100,p[1]*100),False,False)
  s=.36+(i%3)*.025;created['GullBody'].set_actor_scale3d(u.Vector(s,s,s))
 u.EditorAssetLibrary.save_directory('/Game/V162Gull');u.EditorLoadingAndSavingUtils.save_map(u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'native-gulls.json').write_text(json.dumps({'count':7,'source':'exact V158 web body and four articulated solid feather wings','meshes':list(meshes),'actualNativeActors':35}))
