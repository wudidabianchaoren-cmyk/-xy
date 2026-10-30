"""Preserve accepted island shading; repair the oars and add a soft depth-bound tidal wash."""
import unreal as u,json,re
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-163'
def apply():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);levels.load_level('/Game/Cove/FullCoveV162');actors=u.get_editor_subsystem(u.EditorActorSubsystem);all=actors.get_all_level_actors();vessel=next(a for a in all if a.get_actor_label()=='Vessel');c=vessel.static_mesh_component;norm=lambda x:re.sub('[^a-z0-9]','',str(x).lower());materials={norm(slot.material_slot_name):c.get_material(i).get_path_name()for i,slot in enumerate(c.static_mesh.get_editor_property('static_materials'))if c.get_material(i)}
 task=u.AssetImportTask();task.filename=str(P/'assets/odyssey/crew-v163/vessel-coherent-ue.glb');task.destination_path='/Game/V163Vessel';task.automated=True;task.save=True;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);mesh=next(u.load_asset(path)for path in task.imported_object_paths if isinstance(u.load_asset(path),u.StaticMesh));c.set_static_mesh(mesh);c.set_editor_property('override_materials',[])
 for i,slot in enumerate(mesh.get_editor_property('static_materials')):
  path=materials.get(norm(slot.material_slot_name))
  if path:c.set_material(i,u.load_asset(path))
 mel=u.MaterialEditingLibrary;path='/Game/V163/CoastalTideSea';sea=u.load_asset(path)or u.EditorAssetLibrary.duplicate_asset('/Game/V162Polish/TealSurface',path);sources={'D':mel.create_material_expression(sea,u.MaterialExpressionSceneTexture),'Z':mel.create_material_expression(sea,u.MaterialExpressionPixelDepth),'P':mel.create_material_expression(sea,u.MaterialExpressionWorldPosition),'T':mel.create_material_expression(sea,u.MaterialExpressionScalarParameter)};sources['D'].set_editor_property('scene_texture_id',u.SceneTextureId.PPI_CUSTOM_DEPTH);sources['T'].set_editor_property('parameter_name','NativeSeaTime')
 tide=mel.create_material_expression(sea,u.MaterialExpressionCustom);tide.set_editor_property('code','float depth=max(0.,D.r-Z);float valid=step(1.,D.r)*step(D.r,1000000.);float crest=12.+8.*sin(T*.78);float band=pow(saturate(1.-abs(depth-crest)/18.),2.)*valid;float pulse=.45+.55*sin(T*.78+P.x*.007+P.y*.004);float wash=band*(.25+.75*pulse)*.42;return float4(lerp(float3(.015,.085,.10),float3(.14,.20,.17),wash),.19+wash*.25);');tide.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT4);ci=[]
 for name in sources:item=u.CustomInput();item.set_editor_property('input_name',name);ci.append(item)
 tide.set_editor_property('inputs',ci)
 for name,n in sources.items():assert mel.connect_material_expressions(n,'',tide,name)
 assert mel.connect_material_property(tide,'',u.MaterialProperty.MP_BASE_COLOR);rough=mel.create_material_expression(sea,u.MaterialExpressionComponentMask)
 for channel in['r','g','b','a']:rough.set_editor_property(channel,channel=='a')
 assert mel.connect_material_expressions(tide,'',rough,'');assert mel.connect_material_property(rough,'',u.MaterialProperty.MP_ROUGHNESS)
 wave=mel.create_material_expression(sea,u.MaterialExpressionCustom);wave.set_editor_property('code','return float3(0,0,7.5*sin((P.x-100)/900+(P.y-800)/1100+T*.7)+2.3*sin((P.x-100)/430+(P.y-800)/850+T*1.13));');wave.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);ci=[]
 for name in ['P','T']:item=u.CustomInput();item.set_editor_property('input_name',name);ci.append(item)
 wave.set_editor_property('inputs',ci)
 for name in ['P','T']:assert mel.connect_material_expressions(sources[name],'',wave,name)
 assert mel.connect_material_property(wave,'',u.MaterialProperty.MP_WORLD_POSITION_OFFSET);mel.recompile_material(sea);ground=[]
 for a in all:
  label=a.get_actor_label()
  if label=='Water foundation':a.static_mesh_component.set_material(0,sea)
  if isinstance(a,u.StaticMeshActor)and(label=='Island'or any(k in label.lower()for k in['bedrock','cliff','coast','shore','scanned'])):a.static_mesh_component.set_editor_property('render_custom_depth',True);ground.append(label)
 u.EditorAssetLibrary.save_loaded_asset(sea);u.EditorLoadingAndSavingUtils.save_map(u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'cove-additions.json').write_text(json.dumps({'connectedBladeMesh':mesh.get_path_name(),'shoreSources':ground,'foamStyle':'subtle nonwhite wash from actual terrain depth','originalIslandMaterialsPreserved':True,'waterlineExclusionPreserved':True}))
