"""Finish only V162: a real sunset HDR, matching warm key, and visible interior planks."""
import unreal as u,json
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162'
def apply():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);levels.load_level('/Game/Cove/FullCoveV162');actors=u.get_editor_subsystem(u.EditorActorSubsystem);all=actors.get_all_level_actors();tools=u.AssetToolsHelpers.get_asset_tools();mel=u.MaterialEditingLibrary
 hdr=u.load_asset('/Game/V162Polish/EveningMaritimeHDR')
 if not hdr:
  task=u.AssetImportTask();task.filename=str(P/'assets/odyssey/venice_sunset_1k.hdr');task.destination_path='/Game/V162Polish';task.destination_name='EveningMaritimeHDR';task.automated=True;task.save=True;tools.import_asset_tasks([task]);hdr=u.load_asset('/Game/V162Polish/EveningMaritimeHDR')
 assert isinstance(hdr,u.TextureCube),'Actual local HDR must import as a native cubemap'
 path='/Game/V162Polish/EveningSky';m=u.load_asset(path)or tools.create_asset('EveningSky','/Game/V162Polish',u.Material,u.MaterialFactoryNew());mel.delete_all_material_expressions(m);m.set_editor_property('two_sided',True);m.set_editor_property('shading_model',u.MaterialShadingModel.MSM_UNLIT)
 direction=mel.create_material_expression(m,u.MaterialExpressionCameraVectorWS);skyOnly=mel.create_material_expression(m,u.MaterialExpressionCustom);skyOnly.set_editor_property('code','float3 v=-D;v.z=max(v.z,length(v.xy)*.38);return normalize(v);');skyOnly.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);ci=u.CustomInput();ci.set_editor_property('input_name','D');skyOnly.set_editor_property('inputs',[ci]);assert mel.connect_material_expressions(direction,'',skyOnly,'D');sample=mel.create_material_expression(m,u.MaterialExpressionTextureSample);sample.texture=hdr;sample.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_LINEAR_COLOR;assert mel.connect_material_expressions(skyOnly,'',sample,'UVs');mul=mel.create_material_expression(m,u.MaterialExpressionMultiply);mul.set_editor_property('const_b',.7);assert mel.connect_material_expressions(sample,'RGB',mul,'A');assert mel.connect_material_property(mul,'',u.MaterialProperty.MP_EMISSIVE_COLOR);mel.recompile_material(m)
 repaired=[]
 for a in all:
  label=a.get_actor_label()
  if label=='Visible real daylight HDR':a.static_mesh_component.set_material(0,m)
  if isinstance(a,u.SkyLight):a.light_component.set_editor_property('cubemap',hdr);a.light_component.set_light_color(u.LinearColor(1.,.87,.69,1));a.light_component.set_intensity(.95);a.light_component.recapture_sky()
  if label=='V161 warm clear maritime sun':a.set_actor_rotation(u.MathLibrary.find_look_at_rotation(u.Vector(-9000,2500,5000),u.Vector(-700,-2000,800)),False);a.light_component.set_light_color(u.LinearColor(1.,.59,.24,1));a.light_component.set_intensity(8.5)
  if label=='Vessel':
   c=a.static_mesh_component
   for i in range(c.get_num_materials()):
    source=c.get_material(i)
    if not source or any(k in source.get_name().lower()for k in ['linen','flax','rope','bronze']):continue
    if any(k in str(c.static_mesh.get_editor_property('static_materials')[i].material_slot_name).lower()for k in ['wood','oak','timber','sawn']):
     name='Interior_'+source.get_name();dest='/Game/V162Polish/'+name;copy=u.load_asset(dest)or u.EditorAssetLibrary.duplicate_asset(source.get_path_name(),dest)
     if isinstance(copy,u.Material):copy.set_editor_property('two_sided',True);mel.recompile_material(copy);c.set_material(i,copy);repaired.append(i)
 mail=u.load_asset('/Game/V162Polish/HistoricalMail');rough=u.load_asset('/Game/V162Polish/MailRoughnessV162')
 if mail and rough:
  coord=mel.create_material_expression(mail,u.MaterialExpressionTextureCoordinate);coord.set_editor_property('u_tiling',.45);coord.set_editor_property('v_tiling',.45);sample=mel.create_material_expression(mail,u.MaterialExpressionTextureSample);sample.texture=rough;sample.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_LINEAR_COLOR;mel.connect_material_expressions(coord,'',sample,'UVs');contrast=mel.create_material_expression(mail,u.MaterialExpressionCustom);contrast.set_editor_property('code','return lerp(float3(.025,.03,.032),float3(.20,.22,.23),saturate((R.r-.48)*3.3));');contrast.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);ci=u.CustomInput();ci.set_editor_property('input_name','R');contrast.set_editor_property('inputs',[ci]);assert mel.connect_material_expressions(sample,'RGB',contrast,'R');assert mel.connect_material_property(contrast,'',u.MaterialProperty.MP_BASE_COLOR);mel.recompile_material(mail)
 sea=u.load_asset('/Game/V162Polish/TealSurface');polygon=json.loads((P/'assets/odyssey/crew-v162/native-hull-mask.json').read_text())['nativeXYcm'];sea.set_editor_property('blend_mode',u.BlendMode.BLEND_MASKED);inputs={'P':mel.create_material_expression(sea,u.MaterialExpressionWorldPosition)}
 for name,value in [('HullA',u.LinearColor(1,0,0,0)),('HullB',u.LinearColor(0,1,0,0)),('HullC',u.LinearColor(0,0,1,0)),('HullO',u.LinearColor(0,0,0,0))]:
  n=mel.create_material_expression(sea,u.MaterialExpressionVectorParameter);n.set_editor_property('parameter_name',name);n.set_editor_property('default_value',value);inputs[name]=n
 poly=','.join('float2('+str(x)+','+str(y)+')'for x,y in polygon);mask=mel.create_material_expression(sea,u.MaterialExpressionCustom);mask.set_editor_property('code','float3 q=float3(dot(P,HullA.xyz),dot(P,HullB.xyz),dot(P,HullC.xyz))+HullO.xyz;float2 h['+str(len(polygon))+']={'+poly+'};bool inside=true;for(int i=0;i<'+str(len(polygon))+';i++){float2 a=h[i],b=h[(i+1)%'+str(len(polygon))+'];float2 e=b-a,d=q.xy-a;if(e.x*d.y-e.y*d.x<0)inside=false;}return inside?0.:1.;');mask.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT1);ci=[]
 for name in inputs:
  item=u.CustomInput();item.set_editor_property('input_name',name);ci.append(item)
 mask.set_editor_property('inputs',ci)
 for name,n in inputs.items():assert mel.connect_material_expressions(n,'',mask,name)
 assert mel.connect_material_property(mask,'',u.MaterialProperty.MP_OPACITY_MASK);mel.recompile_material(sea)
 u.EditorAssetLibrary.save_directory('/Game/V162Polish');u.EditorLoadingAndSavingUtils.save_map(u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'final-atmosphere.json').write_text(json.dumps({'actualLocalHDR':str(P/'assets/odyssey/venice_sunset_1k.hdr'),'skyAndAmbientUseSameCubemap':True,'v162OnlyInteriorMaterialSlots':repaired,'mailRingContrast':True,'hullWaterExclusionVertices':len(polygon)}))
