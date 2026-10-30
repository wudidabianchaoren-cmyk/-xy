"""Retain subtle independent breathing in the native view, without moving hands off the oars."""
import unreal as u,json
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162'
def apply():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);levels.load_level('/Game/Cove/FullCoveV162');actors=u.get_editor_subsystem(u.EditorActorSubsystem);crew=next(a for a in actors.get_all_level_actors()if a.get_actor_label().startswith('V162 rower '));mel=u.MaterialEditingLibrary;tools=u.AssetToolsHelpers.get_asset_tools();roots=json.loads((OUT/'native-crew-roots.json').read_text());assert len(roots)==14
 values=','.join('float4('+','.join(str(round(v,5))for v in r['positionUEcm'])+','+str(round(r['phase'],5))+')'for r in roots)
 code='float4 roots[14]={'+values+'};int best=0;float distance=1e20;for(int i=0;i<14;i++){float2 d=P.xy-roots[i].xy;float q=dot(d,d);if(q<distance){distance=q;best=i;}}float h=P.z-roots[best].z;float chest=smoothstep(70,112,h)*(1-smoothstep(145,168,h));float breath=sin(T*(1.03+(best%3)*.045)+roots[best].w)*.33*chest;float2 radial=normalize(P.xy-roots[best].xy+float2(.001,0));return float3(radial*breath,breath*.07);'
 def breathe(m):
  p=mel.create_material_expression(m,u.MaterialExpressionWorldPosition);t=mel.create_material_expression(m,u.MaterialExpressionScalarParameter);t.set_editor_property('parameter_name','NativeLifeTime');custom=mel.create_material_expression(m,u.MaterialExpressionCustom);custom.set_editor_property('code',code);custom.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);ci=[]
  for key in ['P','T']:
   item=u.CustomInput();item.set_editor_property('input_name',key);ci.append(item)
  custom.set_editor_property('inputs',ci);assert mel.connect_material_expressions(p,'',custom,'P');assert mel.connect_material_expressions(t,'',custom,'T');assert mel.connect_material_property(custom,'',u.MaterialProperty.MP_WORLD_POSITION_OFFSET);mel.recompile_material(m);u.EditorAssetLibrary.save_loaded_asset(m)
 path='/Game/V162Polish/HistoricalMail';mail=u.load_asset(path)or tools.create_asset('HistoricalMail','/Game/V162Polish',u.Material,u.MaterialFactoryNew());mel.delete_all_material_expressions(mail)
 col=mel.create_material_expression(mail,u.MaterialExpressionConstant3Vector);col.constant=u.LinearColor(.13,.145,.14,1);assert mel.connect_material_property(col,'',u.MaterialProperty.MP_BASE_COLOR)
 metal=mel.create_material_expression(mail,u.MaterialExpressionConstant);metal.r=.82;assert mel.connect_material_property(metal,'',u.MaterialProperty.MP_METALLIC)
 for name,file,prop,normal in [('MailNormalsV162','mail-normal.png',u.MaterialProperty.MP_NORMAL,True),('MailRoughnessV162','mail-rough.png',u.MaterialProperty.MP_ROUGHNESS,False)]:
  texture=u.load_asset('/Game/V162Polish/'+name)
  if not texture:
   task=u.AssetImportTask();task.filename=str(P/'assets/odyssey/crew-v162'/file);task.destination_path='/Game/V162Polish';task.destination_name=name;task.automated=True;task.save=True;tools.import_asset_tasks([task]);texture=u.load_asset('/Game/V162Polish/'+name)
  assert texture;texture.set_editor_property('srgb',False)
  if normal:texture.set_editor_property('compression_settings',u.TextureCompressionSettings.TC_NORMALMAP)
  node=mel.create_material_expression(mail,u.MaterialExpressionTextureSample);node.texture=texture;node.set_editor_property('sampler_type',u.MaterialSamplerType.SAMPLERTYPE_NORMAL if normal else u.MaterialSamplerType.SAMPLERTYPE_LINEAR_COLOR);assert mel.connect_material_property(node,'',prop)
 breathe(mail);component=crew.static_mesh_component;applied=[]
 for i in range(component.get_num_materials()):
  m=component.get_material(i);name=m.get_name().lower()if m else''
  if 'interlocked_iron_mail'in name or'historicalmail'in name:component.set_material(i,mail);applied.append(mail.get_name())
  elif name.startswith('wool')and isinstance(m,u.Material):breathe(m);applied.append(m.get_name())
 u.EditorAssetLibrary.save_directory('/Game/V162Polish');u.EditorLoadingAndSavingUtils.save_map(u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'native-crew-life.json').write_text(json.dumps({'figures':14,'method':'native material vertex breathing, not skeletal animation playback','maximumClothExpansionCm':.33,'handsAndOarsDisplaced':False,'actualRigPositions':roots,'materials':applied},indent=2))
