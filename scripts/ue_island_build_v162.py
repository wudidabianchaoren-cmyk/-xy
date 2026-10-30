import unreal as u,math,json
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162';actors=u.get_editor_subsystem(u.EditorActorSubsystem);levels=u.get_editor_subsystem(u.LevelEditorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);mel=u.MaterialEditingLibrary
def expr(m,cls,x=0,y=0):return mel.create_material_expression(m,cls,x,y)
def scalar(m,property,value):
 n=expr(m,u.MaterialExpressionConstant);n.set_editor_property('r',value);mel.connect_material_property(n,'',property)
def colour(m,property,value):
 n=expr(m,u.MaterialExpressionConstant3Vector);n.set_editor_property('constant',u.LinearColor(*value));mel.connect_material_property(n,'',property)
def material(name):
 path='/Game/V162Island/'+name
 if u.EditorAssetLibrary.does_asset_exist(path):return u.load_asset(path)
 return u.AssetToolsHelpers.get_asset_tools().create_asset(name,'/Game/V162Island',u.Material,u.MaterialFactoryNew())
def refine_island():
 levels.load_level('/Game/Cove/FullCoveV162'if u.EditorAssetLibrary.does_asset_exist('/Game/Cove/FullCoveV162')else'/Game/Cove/FullCoveV161');world=ed.get_editor_world();all=actors.get_all_level_actors();r={'map':'/Game/Cove/FullCoveV162','grassMaterials':0,'errors':[]}
 grass=material('V162_Actual_Vertex_Colour_Grass');grass.set_editor_property('two_sided',True);v=expr(grass,u.MaterialExpressionVertexColor);mul=expr(grass,u.MaterialExpressionMultiply);mul.set_editor_property('const_b',.65);mel.connect_material_expressions(v,'',mul,'A');tint=expr(grass,u.MaterialExpressionConstant3Vector);tint.set_editor_property('constant',u.LinearColor(.30,.43,.105,1));mel.connect_material_expressions(tint,'',mul,'B');mel.connect_material_property(mul,'',u.MaterialProperty.MP_BASE_COLOR);scalar(grass,u.MaterialProperty.MP_ROUGHNESS,.88);mel.recompile_material(grass)
 sea=material('V162_Living_Teal_Sea');colour(sea,u.MaterialProperty.MP_BASE_COLOR,(.015,.12,.11,1));colour(sea,u.MaterialProperty.MP_EMISSIVE_COLOR,(.018,.075,.068,1));scalar(sea,u.MaterialProperty.MP_ROUGHNESS,.23);scalar(sea,u.MaterialProperty.MP_SPECULAR,.62)
 task=u.AssetImportTask();task.filename=str(P/'assets/odyssey/waternormals.jpg');task.destination_path='/Game/V162Island';task.automated=True;task.replace_existing=True;task.save=True;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);normal=next((u.load_asset(p)for p in task.imported_object_paths if isinstance(u.load_asset(p),u.Texture2D)),u.load_asset('/Game/V162Island/waternormals'));if_missing_normal=normal is None
 if if_missing_normal:raise RuntimeError('Expected existing UE water normal texture')
 normal.set_editor_property('compression_settings',u.TextureCompressionSettings.TC_NORMALMAP);normal.set_editor_property('srgb',False)
 sample=expr(sea,u.MaterialExpressionTextureSample);sample.texture=normal;sample.set_editor_property('sampler_type',u.MaterialSamplerType.SAMPLERTYPE_NORMAL);pan=expr(sea,u.MaterialExpressionPanner);pan.set_editor_property('speed_x',.012);pan.set_editor_property('speed_y',.006);coord=expr(sea,u.MaterialExpressionWorldPosition);mask=expr(sea,u.MaterialExpressionComponentMask);mask.set_editor_property('r',True);mask.set_editor_property('g',True);mel.connect_material_expressions(coord,'',mask,'');scale=expr(sea,u.MaterialExpressionMultiply);scale.set_editor_property('const_b',.004);mel.connect_material_expressions(mask,'',scale,'A');mel.connect_material_expressions(scale,'',pan,'Coordinate');mel.connect_material_expressions(pan,'',sample,'UVs');mel.connect_material_property(sample,'',u.MaterialProperty.MP_NORMAL);mel.recompile_material(sea)
 sail=material('V162_Real_Ivory_Linen');sail.set_editor_property('two_sided',True);colour(sail,u.MaterialProperty.MP_BASE_COLOR,(.62,.58,.44,1));scalar(sail,u.MaterialProperty.MP_ROUGHNESS,.92);flax=u.load_asset('/Game/Cove/V147T_T_undyed_flax_photo_derived_color')
 if flax:
  tex=expr(sail,u.MaterialExpressionTextureSample);tex.texture=flax;mel.connect_material_property(tex,'',u.MaterialProperty.MP_BASE_COLOR)
 mel.recompile_material(sail)
 for a in all:
  if isinstance(a,u.StaticMeshActor):
   comp=a.static_mesh_component;name=comp.static_mesh.get_name().lower()if comp.static_mesh else''
   names=' '.join(comp.get_material(i).get_name().lower()for i in range(comp.get_num_materials())if comp.get_material(i))
   if any(key in name+' '+names for key in['physical_coastal_grasses','coastal_meadow','coastal_grass']):
    for i in range(comp.get_num_materials()):comp.set_material(i,grass);r['grassMaterials']+=1
   if a.get_actor_label() in ['Water foundation','V153 Continuous geometric sea','V152 Moving sea patch']:comp.set_material(0,sea);r['seaMaterial']=sea.get_path_name()
   if a.get_actor_label()=='Vessel':
    for i in range(comp.get_num_materials()):
     current=comp.get_material(i)
     if current and any(k in current.get_name().lower()for k in['linen','sail','canvas']):comp.set_material(i,sail)
  if isinstance(a,u.DirectionalLight)and a.light_component.intensity>1:
   a.set_actor_rotation(u.MathLibrary.find_look_at_rotation(u.Vector(-9000,2500,3800),u.Vector(-700,-2000,800)),False);a.light_component.set_light_color(u.LinearColor(1.,.58,.25,1));a.light_component.set_intensity(8.5);a.light_component.set_editor_property('light_source_angle',1.6)
  if isinstance(a,u.SkyLight):a.light_component.set_intensity(.95)
  if isinstance(a,u.PostProcessVolume):
   s=a.get_editor_property('settings');s.set_editor_property('override_color_saturation',True);s.set_editor_property('color_saturation',u.Vector4(1.12,1.12,1.12,1));s.set_editor_property('auto_exposure_bias',.65);a.set_editor_property('settings',s)
 u.EditorAssetLibrary.save_directory('/Game/V162Island');u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'ue-island-build.json').write_text(json.dumps(r,indent=2));return r['map']
def import_crew():
 levels.load_level('/Game/Cove/FullCoveV162');world=ed.get_editor_world();hidden=[]
 for a in actors.get_all_level_actors():
  if a.get_actor_label()=='Crew' or a.get_actor_label().startswith('V162 rower '):hidden.append(a.get_actor_label());actors.destroy_actor(a)
 task=u.AssetImportTask();task.filename=str(P/'assets/odyssey/crew-v162/medieval-rowers-ue.glb');task.destination_path='/Game/V162Crew';task.automated=True;task.replace_existing=True;task.save=True;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);count=0
 for p in task.imported_object_paths:
  asset=u.load_asset(p)
  if isinstance(asset,u.StaticMesh):
   a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector());a.set_actor_label('V162 rower '+asset.get_name());a.static_mesh_component.set_static_mesh(asset);a.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE);count+=1
 u.EditorAssetLibrary.save_directory('/Game/V162Crew');u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'ue-crew-build.json').write_text(json.dumps({'imported':count,'source':task.filename,'oldCrewRemoved':hidden},indent=2));return '/Game/Cove/FullCoveV162'
def import_vessel():
 levels.load_level('/Game/Cove/FullCoveV162');world=ed.get_editor_world();vessel=next(a for a in actors.get_all_level_actors()if a.get_actor_label()=='Vessel')
 task=u.AssetImportTask();task.filename=str(P/'assets/odyssey/crew-v162/vessel-oarports-ue.glb');task.destination_path='/Game/V162Vessel';task.automated=True;task.replace_existing=True;task.save=True;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);mesh=next(u.load_asset(p)for p in task.imported_object_paths if isinstance(u.load_asset(p),u.StaticMesh));comp=vessel.static_mesh_component;comp.set_static_mesh(mesh);comp.set_editor_property('override_materials',[]);u.EditorAssetLibrary.save_directory('/Game/V162Vessel');u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'ue-vessel-build.json').write_text(json.dumps({'source':task.filename,'actualOarports':12,'staticMesh':mesh.get_path_name()}));return '/Game/Cove/FullCoveV162'
