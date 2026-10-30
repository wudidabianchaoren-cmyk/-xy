"""Native UE5 full incumbent cove assembly, true PBR, Nanite and Lumen."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]
exec((P/'scripts/ue-lookdev-v146.py').read_text(encoding='utf-8').split('try:\n u.SystemLibrary.execute_console_command')[0])
import re,math
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/ue-v147';V=P/'.verify/v32-147';V.mkdir(exist_ok=True)
ledger=json.loads((A/'ledger.json').read_text(encoding='utf-8'));report={'engine':u.SystemLibrary.get_engine_version(),'scope':'complete native cove / 14 crew / incumbent ship cottage foliage / actual scanned cliffs','errors':[]}
def save_report():(V/'ue-cove.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
materials={};textures={}
def autox(info,role):
 path=Path(info['path']);name='V147T_'+re.sub('[^a-zA-Z0-9_]','_',path.stem)[:65]+'_'+role
 if name not in textures:textures[name]=texture(path,name,'normal' if role=='normal' else 'color' if role=='color' else 'masks',role=='normal')
 return textures[name]
def autom(name):
 if name in materials:return materials[name]
 d=ledger['materials'].get(name)
 if not d:
  # FBX sanitizes material slot identifiers.
  d=next((v for k,v in ledger['materials'].items() if re.sub('[^a-zA-Z0-9_]','_',k)==name),None)
 if not d:return flat('V147_Default',(.19,.17,.12),.9)
 dst='V147M_'+str(len(materials))
 if assets.does_asset_exist('/Game/Cove/'+dst):materials[name]=assets.load_asset('/Game/Cove/'+dst);return materials[name]
 m=tools.create_asset(dst,'/Game/Cove',u.Material,u.MaterialFactoryNew());m.set_editor_property('two_sided',True)
 if d['alpha']:m.set_editor_property('blend_mode',u.BlendMode.BLEND_MASKED);m.set_editor_property('opacity_mask_clip_value',.4)
 for role,prop in [('color',u.MaterialProperty.MP_BASE_COLOR),('normal',u.MaterialProperty.MP_NORMAL),('roughness',u.MaterialProperty.MP_ROUGHNESS),('metallic',u.MaterialProperty.MP_METALLIC),('alpha',u.MaterialProperty.MP_OPACITY_MASK)]:
  if role in d['maps']:
   inf=d['maps'][role];n=mel.create_material_expression(m,u.MaterialExpressionTextureSample);n.texture=autox(inf,role);n.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_NORMAL if role=='normal' else u.MaterialSamplerType.SAMPLERTYPE_COLOR if role=='color' else u.MaterialSamplerType.SAMPLERTYPE_MASKS
   ch='RGB' if role in ['color','normal'] else {'Red':'R','Green':'G','Blue':'B','Alpha':'A'}.get(inf['channel'],'R');mel.connect_material_property(n,ch,prop)
  elif role=='color':
   n=mel.create_material_expression(m,u.MaterialExpressionConstant3Vector);n.constant=u.LinearColor(*d['color'][:3],1);mel.connect_material_property(n,'',prop)
  elif role in ['roughness','metallic']:
   n=mel.create_material_expression(m,u.MaterialExpressionConstant);n.r=max(.65,d['roughness']) if role=='roughness' else d['metallic'];mel.connect_material_property(n,'',prop)
 mel.recompile_material(m);assets.save_loaded_asset(m);materials[name]=m;return m
def slots(mesh):
 for i,s in enumerate(mesh.get_editor_property('static_materials')):
  mesh.set_material(i,autom(str(s.material_slot_name)))
 assets.save_loaded_asset(mesh)
try:
 u.SystemLibrary.execute_console_command(None,'Interchange.FeatureFlags.Import.FBX 0')
 world=u.EditorLoadingAndSavingUtils.new_blank_map(False);sm=u.get_editor_subsystem(u.StaticMeshEditorSubsystem);made={}
 for d in ledger['parts']:
  name=d['name'];mesh=imp(A/(name+'.fbx'),'V147_'+name,True);slots(mesh);made[name]=mesh
  if not name.startswith('Vegetation'):place(mesh,name)
 report['meshParts']=list(made);report['stage']='all incumbent meshes imported';save_report()
 # Reconstruct the original 132 plants from their exact stored world placements.
 placements=json.loads((P/'assets/odyssey/compact-v134/vegetation.json').read_text())
 for i,p in enumerate(placements):
  mesh=made.get('Vegetation_%02d'%p['prototype'])
  if mesh:
   x,h,z=p['position'];place(mesh,'Foliage '+str(i),pos=(x*100,-z*100,h*100),scale=tuple(p['scale']),rot=(0,-p['angle']*180/math.pi,0))
 # True high-resolution scan geometry, same physical metre units as the cove.
 for j,(name,pos,sc,yaw) in enumerate([('coastal_cliff_02',(-1700,1900,-30),.85,180),('coastal_cliff_04',(1300,2400,-15),.30,165),('coastal_cliff_02',(-3700,3900,-60),.6,205),('coast_rocks_02',(-500,1100,-55),.45,195)]):
  mesh=imp(P/f'assets/odyssey/refit-v145/{name}-nanite.fbx','V147_'+name,True);src=P/f'assets/odyssey/source-v145/{name}/textures';mat=material('V147_PBR_'+name,texture(src/(name+'_diff_4k.jpg'),'V147_'+name+'_Color'),texture(src/(name+'_nor_gl_4k.jpg'),'V147_'+name+'_Normal','normal',True),texture(src/(name+'_arm_4k.jpg'),'V147_'+name+'_ORM','masks'));place(mesh,'Scanned fractured bedrock '+str(j),pos=pos,scale=(sc,sc,sc),rot=(0,yaw,0),mat=mat)
 # Terrain: physical sand at shore, natural soil higher up, world-coordinate UV.
 terrain=assets.load_asset('/Game/Cove/V147_Terrain') if assets.does_asset_exist('/Game/Cove/V147_Terrain') else tools.create_asset('V147_Terrain','/Game/Cove',u.Material,u.MaterialFactoryNew());mel.delete_all_material_expressions(terrain);wp=mel.create_material_expression(terrain,u.MaterialExpressionWorldPosition);div=mel.create_material_expression(terrain,u.MaterialExpressionDivide);con=mel.create_material_expression(terrain,u.MaterialExpressionConstant);con.r=350;mel.connect_material_expressions(wp,'',div,'A');mel.connect_material_expressions(con,'',div,'B')
 sd=P/'assets/odyssey/pbr-v103/coast_sand_03';n=mel.create_material_expression(terrain,u.MaterialExpressionTextureSample);n.texture=texture(sd/'Diffuse.jpg','V147_Sand_Color');mel.connect_material_expressions(div,'',n,'UVs');mel.connect_material_property(n,'RGB',u.MaterialProperty.MP_BASE_COLOR);nn=mel.create_material_expression(terrain,u.MaterialExpressionTextureSample);nn.texture=texture(sd/'nor_gl.jpg','V147_Sand_Normal','normal',True);nn.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_NORMAL;mel.connect_material_expressions(div,'',nn,'UVs');mel.connect_material_property(nn,'RGB',u.MaterialProperty.MP_NORMAL);r=mel.create_material_expression(terrain,u.MaterialExpressionConstant);r.r=.95;mel.connect_material_property(r,'',u.MaterialProperty.MP_ROUGHNESS);mel.recompile_material(terrain);assets.save_loaded_asset(terrain)
 for a in actors.get_all_level_actors():
  if a.get_actor_label()=='Island':a.static_mesh_component.set_material(0,terrain)
 cube=assets.load_asset('/Engine/BasicShapes/Cube');place(cube,'Water foundation',pos=(0,0,-18),scale=(2000,2000,.02),mat=flat('V147_Sea',(.018,.16,.18),.09))
 sun=actors.spawn_actor_from_class(u.DirectionalLight,u.Vector(0,0,12000),u.Rotator(pitch=-31,yaw=120,roll=0));sun.light_component.set_mobility(u.ComponentMobility.MOVABLE);sun.light_component.set_intensity(5.5);sun.light_component.set_light_color(u.LinearColor(1,.94,.84,1));sun.light_component.set_editor_property('atmosphere_sun_light',True)
 actors.spawn_actor_from_class(u.SkyAtmosphere,u.Vector());sl=actors.spawn_actor_from_class(u.SkyLight,u.Vector(0,0,8000));sl.light_component.set_mobility(u.ComponentMobility.MOVABLE);sl.light_component.set_editor_property('source_type',u.SkyLightSourceType.SLS_SPECIFIED_CUBEMAP);sl.light_component.set_editor_property('cubemap',assets.load_asset('/Game/Cove/DaylightHDR'));sl.light_component.set_intensity(1.5)
 pp=actors.spawn_actor_from_class(u.PostProcessVolume,u.Vector());pp.set_editor_property('unbound',True);settings=pp.get_editor_property('settings')
 for k,v in [('override_dynamic_global_illumination_method',True),('dynamic_global_illumination_method',u.DynamicGlobalIlluminationMethod.LUMEN),('override_reflection_method',True),('reflection_method',u.ReflectionMethod.LUMEN),('override_auto_exposure_method',True),('auto_exposure_method',u.AutoExposureMethod.AEM_MANUAL),('override_auto_exposure_bias',True),('auto_exposure_bias',0.),('override_auto_exposure_apply_physical_camera_exposure',True),('auto_exposure_apply_physical_camera_exposure',False)]:settings.set_editor_property(k,v)
 pp.set_editor_property('settings',settings);cam=actors.spawn_actor_from_class(u.CineCameraActor,u.Vector(5300,-7200,3300));target=u.Vector(-700,2200,850);cam.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cam.get_actor_location(),target),False);cc=cam.get_cine_camera_component();cc.set_editor_property('current_focal_length',38.);cc.set_editor_property('post_process_settings',settings);cc.set_editor_property('post_process_blend_weight',1.)
 ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);ed.set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation());assets.save_directory('/Game/Cove');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV147');report.update(stage='full native cove saved',actors=len(actors.get_all_level_actors()),lumen=True,nanite=True,map='/Game/Cove/FullCoveV147',materials=len(materials));save_report()
 capture=actors.spawn_actor_from_class(u.SceneCapture2D,cam.get_actor_location(),cam.get_actor_rotation());comp=capture.get_component_by_class(u.SceneCaptureComponent2D);rt=u.RenderingLibrary.create_render_target2d(world,1920,1080,u.TextureRenderTargetFormat.RTF_RGBA8);comp.texture_target=rt;comp.capture_source=u.SceneCaptureSource.SCS_FINAL_COLOR_LDR;comp.fov_angle=54;comp.post_process_settings=settings;comp.post_process_blend_weight=1.;comp.capture_every_frame=True
 start=time.monotonic();phase=0;handle=None
 def tick(dt):
  global phase,handle
  t=time.monotonic()-start
  if phase==0 and t>40:
   u.RenderingLibrary.export_render_target(world,rt,str(V),'ue-full-cove.png');u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V/'ue-full-cove-viewport.png'),camera=cam);phase=1;report['stage']='full native cove capture saved';save_report()
  elif phase==1 and t>50:u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
 handle=u.register_slate_post_tick_callback(tick)
except Exception:
 report['failure']=traceback.format_exc();save_report();u.log_error(report['failure']);u.SystemLibrary.quit_editor()
