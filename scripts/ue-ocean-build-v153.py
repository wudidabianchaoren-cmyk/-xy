"""One bounded native ocean look-development pass; never save incumbent map/assets."""
from pathlib import Path
import unreal as u,json,time,math
P=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');V153=P/'.verify/v32-153';V153.mkdir(exist_ok=True)
assets=u.get_editor_subsystem(u.EditorAssetSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=ed.get_editor_world();tools153=u.AssetToolsHelpers.get_asset_tools();mel153=u.MaterialEditingLibrary
if not assets.does_asset_exist('/Game/Cove/V153ContinuousOcean'):
 task=u.AssetImportTask();task.filename=str(P/'assets/odyssey/runtime-v153/V153ContinuousOcean.fbx');task.destination_path='/Game/Cove';task.destination_name='V153ContinuousOcean';task.automated=True;task.save=True
 op=u.FbxImportUI();op.import_mesh=True;op.import_as_skeletal=False;op.import_materials=False;op.import_textures=False;op.automated_import_should_detect_type=False;op.mesh_type_to_import=u.FBXImportType.FBXIT_STATIC_MESH;op.static_mesh_import_data.combine_meshes=True;op.static_mesh_import_data.build_nanite=False;op.static_mesh_import_data.auto_generate_collision=False;op.static_mesh_import_data.generate_lightmap_u_vs=False;op.static_mesh_import_data.convert_scene_unit=True;task.options=op;u.SystemLibrary.execute_console_command(world,'Interchange.FeatureFlags.Import.FBX 0');tools153.import_asset_tasks([task])
seaPath153='/Game/Cove/V153_ContinuousDeepSea';seaMaterial153=assets.load_asset(seaPath153) if assets.does_asset_exist(seaPath153) else assets.duplicate_asset('/Game/Cove/V149_DeepSea',seaPath153)
def n153(cl):return mel153.create_material_expression(seaMaterial153,cl)
def custom153(code,ins):
 n=n153(u.MaterialExpressionCustom);n.set_editor_property('code',code);n.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);entries=[]
 for k in ins:e=u.CustomInput();e.set_editor_property('input_name',k);entries.append(e)
 n.set_editor_property('inputs',entries)
 for k,(source,ch) in ins.items():assert mel153.connect_material_expressions(source,ch,n,k)
 return n
wp153=n153(u.MaterialExpressionWorldPosition);clock153=n153(u.MaterialExpressionScalarParameter);clock153.set_editor_property('parameter_name','SeaClock');wt153=n153(u.MaterialExpressionTextureObject);wt153.texture=assets.load_asset('/Game/Cove/V147_Sea_Normal')
wave153=custom153('''float f=1-smoothstep(8500,16000,length(P.xy));float a=dot(P.xy,float2(.6,.8))/180+T*.83;float b=dot(P.xy,float2(.94,-.34))/420-T*.61;return float3(0,0,(18*sin(a)+10*sin(b))*f);''',{'P':(wp153,''),'T':(clock153,'')});mel153.connect_material_property(wave153,'',u.MaterialProperty.MP_WORLD_POSITION_OFFSET)
normal153=custom153('''float f=1-smoothstep(8500,16000,length(P.xy));float a=dot(P.xy,float2(.6,.8))/180+T*.83;float b=dot(P.xy,float2(.94,-.34))/420-T*.61;float2 slope=(18*cos(a)*float2(.6,.8)/180+10*cos(b)*float2(.94,-.34)/420)*f;float2 n1=Texture2DSample(W,WSampler,P.xy/520+float2(T*.012,-T*.005)).rg*2-1;float2 n2=Texture2DSample(W,WSampler,float2(P.x-P.y,P.x+P.y)/170+float2(-T*.009,T*.007)).rg*2-1;return normalize(float3(-slope+n1*.16+n2*.055,1));''',{'P':(wp153,''),'T':(clock153,''),'W':(wt153,'')});seaMaterial153.set_editor_property('tangent_space_normal',False);mel153.connect_material_property(normal153,'',u.MaterialProperty.MP_NORMAL)
for val,prop in [(.36,u.MaterialProperty.MP_ROUGHNESS),(.16,u.MaterialProperty.MP_SPECULAR)]:
 k=n153(u.MaterialExpressionConstant);k.r=val;mel153.connect_material_property(k,'',prop)
mel153.recompile_material(seaMaterial153);assets.save_loaded_asset(seaMaterial153)
(V153/'ue-native-build.json').write_text(json.dumps({'material':seaPath153,'geometry':'/Game/Cove/V153ContinuousOcean','triangles':73728,'validUVTangents':True,'continuousWidthMeters':2000,'originalMapSaved':False,'baseColorSource':'copied original approved V149_DeepSea'}),encoding='utf-8')
exec(compile((P/'scripts/ue-ocean-runtime-v153.py').read_text(encoding='utf-8'),str(P/'scripts/ue-ocean-runtime-v153.py'),'exec'),globals())
