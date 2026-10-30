"""Actual mirrored scene capture projected onto the courtyard's existing paving mesh."""
import unreal as u,math
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162'
def install(world,actors):
 mel=u.MaterialEditingLibrary;tools=u.AssetToolsHelpers.get_asset_tools();ed=u.get_editor_subsystem(u.UnrealEditorSubsystem)
 # MaterialInstanceDynamic names do not retain their parent's name after a map
 # switch. Identify the authored paving slot, rather than a transient instance.
 floor=next((a for a in actors.values()if isinstance(a,u.StaticMeshActor)and a.static_mesh_component.static_mesh and any('marble'in str(s.material_slot_name).lower()for s in a.static_mesh_component.static_mesh.get_editor_property('static_materials'))),None)
 if not floor:return None
 existing=next((a for a in u.get_editor_subsystem(u.EditorActorSubsystem).get_all_level_actors()if isinstance(a,u.SceneCapture2D)and a.get_actor_label()=='V162 actual planar courtyard reflection'),None)
 if existing:
  capture=existing.get_component_by_class(u.SceneCaptureComponent2D);mid=floor.static_mesh_component.get_material(0)
  if isinstance(mid,u.MaterialInstanceDynamic):return{'actor':existing,'capture':capture,'target':capture.get_editor_property('texture_target'),'mid':mid,'last':0,'captures':0}
 path='/Game/V162Polish/CourtyardProjectedReflection';m=u.load_asset(path)if u.EditorAssetLibrary.does_asset_exist(path)else tools.create_asset('CourtyardProjectedReflection','/Game/V162Polish',u.Material,u.MaterialFactoryNew())
 if mel.get_num_material_expressions(m)<10:
  def node(cls):return mel.create_material_expression(m,cls)
  def scalar(prop,value):
   n=node(u.MaterialExpressionConstant);n.r=value;assert mel.connect_material_property(n,'',prop)
  tex=node(u.MaterialExpressionTextureSample);tex.texture=u.load_asset('/Game/V162Polish/Marble012_diff_2k');tint=node(u.MaterialExpressionConstant3Vector);tint.constant=u.LinearColor(.14,.13,.11,1);mul=node(u.MaterialExpressionMultiply);assert mel.connect_material_expressions(tex,'',mul,'A');assert mel.connect_material_expressions(tint,'',mul,'B');assert mel.connect_material_property(mul,'',u.MaterialProperty.MP_BASE_COLOR);scalar(u.MaterialProperty.MP_ROUGHNESS,.17);scalar(u.MaterialProperty.MP_SPECULAR,.24)
  inputs={'P':(node(u.MaterialExpressionWorldPosition),'')}
  for key in ['C','F','R','U']:
   n=node(u.MaterialExpressionVectorParameter);n.set_editor_property('parameter_name',key);inputs[key]=(n,'')
  for key in ['H','V']:
   n=node(u.MaterialExpressionScalarParameter);n.set_editor_property('parameter_name',key);n.set_editor_property('default_value',.5);inputs[key]=(n,'')
  mirror=node(u.MaterialExpressionTextureObjectParameter);mirror.set_editor_property('parameter_name','MirrorTex');mirror.texture=u.load_asset('/Engine/EngineResources/DefaultTexture');inputs['MirrorTex']=(mirror,'')
  custom=node(u.MaterialExpressionCustom);custom.set_editor_property('code','float3 d=P-C.xyz;float z=max(.001,dot(d,F.xyz));float2 uv=float2(.5+dot(d,R.xyz)/(2*z*H),.5-dot(d,U.xyz)/(2*z*V));float valid=step(0,uv.x)*step(0,uv.y)*step(uv.x,1)*step(uv.y,1);return Texture2DSample(MirrorTex,MirrorTexSampler,saturate(uv)).rgb*valid*.62;');custom.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);arr=[]
  for name in inputs:
   item=u.CustomInput();item.set_editor_property('input_name',name);arr.append(item)
  custom.set_editor_property('inputs',arr)
  for name,(n,pin)in inputs.items():assert mel.connect_material_expressions(n,pin,custom,name),name
  exposure=node(u.MaterialExpressionEyeAdaptation);stable=node(u.MaterialExpressionDivide);assert mel.connect_material_expressions(custom,'',stable,'A');assert mel.connect_material_expressions(exposure,'',stable,'B');assert mel.connect_material_property(stable,'',u.MaterialProperty.MP_EMISSIVE_COLOR);mel.recompile_material(m);u.EditorAssetLibrary.save_loaded_asset(m)
 target=u.RenderingLibrary.create_render_target2d(world,1024,576,u.TextureRenderTargetFormat.RTF_RGBA16F,u.LinearColor(0,0,0,1),False,False);actor=u.get_editor_subsystem(u.EditorActorSubsystem).spawn_actor_from_class(u.SceneCapture2D,u.Vector(0,0,-620));actor.set_actor_label('V162 actual planar courtyard reflection');capture=actor.get_component_by_class(u.SceneCaptureComponent2D);capture.set_editor_property('texture_target',target);capture.set_editor_property('capture_every_frame',False);capture.set_editor_property('capture_on_movement',False);capture.set_editor_property('capture_source',u.SceneCaptureSource.SCS_SCENE_COLOR_HDR);capture.hide_actor_components(floor);capture.set_editor_property('always_persist_rendering_state',True)
 capture.set_editor_property('capture_source',u.SceneCaptureSource.SCS_FINAL_COLOR_LDR);settings=u.PostProcessSettings()
 for k,v in [('override_auto_exposure_method',True),('auto_exposure_method',u.AutoExposureMethod.AEM_MANUAL),('override_auto_exposure_bias',True),('auto_exposure_bias',-.3),('override_auto_exposure_apply_physical_camera_exposure',True),('auto_exposure_apply_physical_camera_exposure',False),('override_bloom_intensity',True),('bloom_intensity',0.)]:settings.set_editor_property(k,v)
 capture.set_editor_property('post_process_settings',settings);capture.set_editor_property('post_process_blend_weight',1.)
 for gizmo in actor.get_components_by_class(u.PrimitiveComponent):gizmo.set_visibility(False);gizmo.set_hidden_in_game(True)
 # The original courtyard has a separate, continuous mortar bed below its tiles.
 # Hide every broad ground layer from the reflected camera, which sits below it.
 # Hiding just the marble leaves the mortar bed occluding the entire capture.
 if world.get_name()=='PortfolioLiveV165':
  import ue_worlds_v165
  for scene in ['myth','room']:
   for other in ue_worlds_v165.actors(scene):capture.hide_actor_components(other)
 ground=[]
 for a in actors.values():
  if not isinstance(a,u.StaticMeshActor):continue
  origin,extent=a.get_actor_bounds(False)
  if origin.z+extent.z<5 and max(extent.x,extent.y)>1000:capture.hide_actor_components(a);ground.append(a.get_actor_label())
 import json
 (OUT/'courtyard-mirror-setup.json').write_text(json.dumps({'floor':floor.get_actor_label(),'groundLayersHiddenOnlyInMirror':ground,'capturesActualNativeGeometry':True,'captureFormat':'final color / inverse viewport exposure','reflectionUpdatesHz':15}))
 c=floor.static_mesh_component;mid=c.create_dynamic_material_instance(0,m);mid.set_texture_parameter_value('MirrorTex',target)
 return {'actor':actor,'capture':capture,'target':target,'mid':mid,'last':0,'captures':0}
def update(mirror,now,data):
 if not mirror:return
 poseKey=(data.get('camera'),data.get('target'),data.get('homeWest'));moving=mirror.get('lastInput')!=poseKey
 if now-mirror['last']<(1/8 if moving else .5):return
 mirror['lastInput']=poseKey
 mirror['last']=now;p=data['camera'];t=data['target'];loc=u.Vector(p[0]*100,p[2]*100,-p[1]*100);target=u.Vector(t[0]*100,t[2]*100,-t[1]*100);rot=u.MathLibrary.find_look_at_rotation(loc,target);a=mirror['actor'];pose=tuple(p+t);
 if mirror.get('pose')!=pose:a.set_actor_location_and_rotation(loc,rot,False,False);mirror['pose']=pose
 mid=mirror['mid'];vectors={'C':loc,'F':u.MathLibrary.get_forward_vector(rot),'R':u.MathLibrary.get_right_vector(rot),'U':u.MathLibrary.get_up_vector(rot)}
 for key,v in vectors.items():mid.set_vector_parameter_value(key,u.LinearColor(v.x,v.y,v.z,1))
 vfov=float(data.get('fov',29));hfov=math.degrees(2*math.atan(math.tan(math.radians(vfov)/2)*(16/9)))if data.get('verticalFov')else vfov;mirror['capture'].set_editor_property('fov_angle',hfov);h=math.tan(math.radians(hfov)/2);mid.set_scalar_parameter_value('H',h);mid.set_scalar_parameter_value('V',h/(16/9));mirror['capture'].capture_scene()
 mirror['captures']+=1
 if mirror['captures']==30 and(OUT/'mirror-diagnostic').exists():u.RenderingLibrary.export_render_target(u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world(),mirror['target'],str(OUT),'courtyard-actual-mirror.hdr')
