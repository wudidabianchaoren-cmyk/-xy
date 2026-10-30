"""Build two small native assets and material graphs once; preserve the saved V149 world."""
from pathlib import Path
import unreal as u,json,time,math
P=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');V152=P/'.verify/v32-152';V152.mkdir(exist_ok=True)
assets=u.get_editor_subsystem(u.EditorAssetSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=ed.get_editor_world();tools152=u.AssetToolsHelpers.get_asset_tools();mel152=u.MaterialEditingLibrary
def mesh152(name):
 path='/Game/Cove/'+name
 if assets.does_asset_exist(path):return assets.load_asset(path)
 task=u.AssetImportTask();task.filename=str(P/'assets/odyssey/runtime-v152'/(name+'.fbx'));task.destination_path='/Game/Cove';task.destination_name=name;task.automated=True;task.save=True
 opt=u.FbxImportUI();opt.import_mesh=True;opt.import_as_skeletal=False;opt.import_materials=False;opt.import_textures=False;opt.automated_import_should_detect_type=False;opt.mesh_type_to_import=u.FBXImportType.FBXIT_STATIC_MESH;opt.static_mesh_import_data.combine_meshes=True;opt.static_mesh_import_data.build_nanite=False;opt.static_mesh_import_data.auto_generate_collision=False;opt.static_mesh_import_data.generate_lightmap_u_vs=False;opt.static_mesh_import_data.convert_scene_unit=True;opt.static_mesh_import_data.vertex_color_import_option=u.VertexColorImportOption.REPLACE;task.options=opt
 u.SystemLibrary.execute_console_command(world,'Interchange.FeatureFlags.Import.FBX 0');tools152.import_asset_tasks([task]);return assets.load_asset(task.imported_object_paths[0])
def mat152(name):
 path='/Game/Cove/'+name
 if assets.does_asset_exist(path):return assets.load_asset(path)
 return tools152.create_asset(name,'/Game/Cove',u.Material,u.MaterialFactoryNew())
def n152(m,cl):return mel152.create_material_expression(m,cl)
def sc152(m,val):n=n152(m,u.MaterialExpressionConstant);n.r=val;return n
def rgb152(m,val):n=n152(m,u.MaterialExpressionConstant3Vector);n.constant=u.LinearColor(*val,1);return n
def custom152(m,code,ins,out=3):
 n=n152(m,u.MaterialExpressionCustom);n.set_editor_property('code',code);n.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3 if out==3 else u.CustomMaterialOutputType.CMOT_FLOAT1);entries=[]
 for k in ins:e=u.CustomInput();e.set_editor_property('input_name',k);entries.append(e)
 n.set_editor_property('inputs',entries)
 for k,(source,channel) in ins.items():assert mel152.connect_material_expressions(source,channel,n,k)
 return n
seaMesh152=mesh152('V152NearSea');birdMesh152=mesh152('V152DistantGull')
seaMat152=mat152('V152_LiveSea');mel152.delete_all_material_expressions(seaMat152);seaMat152.set_editor_property('tangent_space_normal',False)
wp152=n152(seaMat152,u.MaterialExpressionWorldPosition);clock152=n152(seaMat152,u.MaterialExpressionScalarParameter);clock152.set_editor_property('parameter_name','SeaClock');waterObj152=n152(seaMat152,u.MaterialExpressionTextureObject);waterObj152.texture=assets.load_asset('/Game/Cove/V147_Sea_Normal')
waveCode152='''float r=length(P.xy);float fade=1-smoothstep(12500,19500,r);float w=14*sin(dot(P.xy,float2(.6,.8))/220+T*.72)+6*sin(dot(P.xy,float2(.94,-.34))/530-T*.93);return float3(0,0,w*fade);'''
wave152=custom152(seaMat152,waveCode152,{'P':(wp152,''),'T':(clock152,'')});mel152.connect_material_property(wave152,'',u.MaterialProperty.MP_WORLD_POSITION_OFFSET)
normal152=custom152(seaMat152,'''float a=dot(P.xy,float2(.6,.8))/220+T*.72;float b=dot(P.xy,float2(.94,-.34))/530-T*.93;float2 slope=(14*cos(a)*float2(.6,.8)/220+6*cos(b)*float2(.94,-.34)/530)*(1-smoothstep(12500,19500,length(P.xy)));float2 fine=(Texture2DSample(W,WSampler,P.xy/470+float2(T*.012,-T*.006)).rg*2-1)*.11;return normalize(float3(-slope+fine,1));''',{'P':(wp152,''),'T':(clock152,''),'W':(waterObj152,'')});mel152.connect_material_property(normal152,'',u.MaterialProperty.MP_NORMAL)
color152=custom152(seaMat152,'''float v=.5+.2*sin(P.x/4400+sin(P.y/6000))+.12*sin(P.y/2400);return lerp(float3(.025,.060,.066),float3(.047,.092,.091),saturate(v));''',{'P':(wp152,'')});mel152.connect_material_property(color152,'',u.MaterialProperty.MP_BASE_COLOR);mel152.connect_material_property(sc152(seaMat152,.26),'',u.MaterialProperty.MP_ROUGHNESS);mel152.connect_material_property(sc152(seaMat152,.40),'',u.MaterialProperty.MP_SPECULAR);mel152.connect_material_property(rgb152(seaMat152,(.006,.014,.015)),'',u.MaterialProperty.MP_EMISSIVE_COLOR);mel152.recompile_material(seaMat152);assets.save_loaded_asset(seaMat152)
birdMat152=mat152('V152_DistantGullSurface');mel152.delete_all_material_expressions(birdMat152);birdMat152.set_editor_property('two_sided',True);mel152.connect_material_property(rgb152(birdMat152,(.48,.50,.46)),'',u.MaterialProperty.MP_BASE_COLOR);mel152.connect_material_property(sc152(birdMat152,.9),'',u.MaterialProperty.MP_ROUGHNESS)
bc152=n152(birdMat152,u.MaterialExpressionScalarParameter);bc152.set_editor_property('parameter_name','SeaClock');phase152=n152(birdMat152,u.MaterialExpressionScalarParameter);phase152.set_editor_property('parameter_name','BirdPhase');vc152=n152(birdMat152,u.MaterialExpressionVertexColor)
flap152=custom152(birdMat152,'''float glide=smoothstep(-.3,.2,sin(T*.23+Phase));return float3(0,0,sin(T*4.3+Phase)*Weight*25*glide);''',{'T':(bc152,''),'Phase':(phase152,''),'Weight':(vc152,'R')});mel152.connect_material_property(flap152,'',u.MaterialProperty.MP_WORLD_POSITION_OFFSET);mel152.recompile_material(birdMat152);assets.save_loaded_asset(birdMat152)
(V152/'ue-build-assets.json').write_text(json.dumps({'seaMesh':seaMesh152.get_path_name(),'seaTriangles':73728,'birdMesh':birdMesh152.get_path_name(),'birdTriangles':14,'seaMaterial':seaMat152.get_path_name(),'birdMaterial':birdMat152.get_path_name(),'originalMapSaved':False}),encoding='utf-8')
exec(compile((P/'scripts/ue-motion-runtime-v152.py').read_text(encoding='utf-8'),str(P/'scripts/ue-motion-runtime-v152.py'),'exec'),globals())
