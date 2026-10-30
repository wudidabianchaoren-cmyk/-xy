"""Actual UE5 editor import, Nanite mesh build, Lumen lighting and viewport captures."""
import unreal as u,json,time,traceback
u.EditorPythonScripting.set_keep_python_script_alive(True)
from pathlib import Path
P=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');E=Path('E:/codex/unreal/ZaOjIngV146');V=P/'.verify/v32-146';V.mkdir(exist_ok=True)
report={'engine':u.SystemLibrary.get_engine_version(),'stage':'starting','errors':[]};tools=u.AssetToolsHelpers.get_asset_tools();mel=u.MaterialEditingLibrary;assets=u.get_editor_subsystem(u.EditorAssetSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem)
def save_report(): (V/'ue-lookdev.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
def imp(path,name,mesh=False):
 dst='/Game/Cove/'+name
 if assets.does_asset_exist(dst):return assets.load_asset(dst)
 t=u.AssetImportTask();t.filename=str(path);t.destination_path='/Game/Cove';t.destination_name=name;t.automated=True;t.save=True;t.replace_existing=True
 if mesh:
  op=u.FbxImportUI();op.import_mesh=True;op.import_as_skeletal=False;op.import_materials=False;op.import_textures=False;op.automated_import_should_detect_type=False;op.mesh_type_to_import=u.FBXImportType.FBXIT_STATIC_MESH
  op.static_mesh_import_data.combine_meshes=True;op.static_mesh_import_data.build_nanite=True;op.static_mesh_import_data.auto_generate_collision=False;op.static_mesh_import_data.generate_lightmap_u_vs=False;op.static_mesh_import_data.convert_scene_unit=True;t.options=op
 tools.import_asset_tasks([t]);paths=t.imported_object_paths
 if not paths:raise RuntimeError('Import produced no asset: '+str(path))
 return assets.load_asset(paths[0])
def texture(path,name,kind='color',flip=False):
 t=imp(path,name)
 if kind!='color':t.set_editor_property('srgb',False)
 if kind=='normal':t.set_editor_property('compression_settings',u.TextureCompressionSettings.TC_NORMALMAP);t.set_editor_property('flip_green_channel',flip)
 elif kind=='masks':t.set_editor_property('compression_settings',u.TextureCompressionSettings.TC_MASKS)
 assets.save_loaded_asset(t);return t
def material(name,base,normal,orm=None,rough=.9,metal=0):
 dst='/Game/Cove/'+name
 if assets.does_asset_exist(dst):return assets.load_asset(dst)
 m=tools.create_asset(name,'/Game/Cove',u.Material,u.MaterialFactoryNew())
 def node(tex,typ):
  n=mel.create_material_expression(m,u.MaterialExpressionTextureSample);n.texture=tex;n.sampler_type=typ;return n
 b=node(base,u.MaterialSamplerType.SAMPLERTYPE_COLOR);mel.connect_material_property(b,'RGB',u.MaterialProperty.MP_BASE_COLOR)
 n=node(normal,u.MaterialSamplerType.SAMPLERTYPE_NORMAL);mel.connect_material_property(n,'RGB',u.MaterialProperty.MP_NORMAL)
 if orm:
  a=node(orm,u.MaterialSamplerType.SAMPLERTYPE_MASKS)
  for channel,prop in [('R',u.MaterialProperty.MP_AMBIENT_OCCLUSION),('G',u.MaterialProperty.MP_ROUGHNESS),('B',u.MaterialProperty.MP_METALLIC)]:mel.connect_material_property(a,channel,prop)
 else:
  for val,prop in [(rough,u.MaterialProperty.MP_ROUGHNESS),(metal,u.MaterialProperty.MP_METALLIC)]:c=mel.create_material_expression(m,u.MaterialExpressionConstant);c.r=val;mel.connect_material_property(c,'',prop)
 mel.recompile_material(m);assets.save_loaded_asset(m);return m
def flat(name,color,rough=.9,metal=0):
 dst='/Game/Cove/'+name
 if assets.does_asset_exist(dst):return assets.load_asset(dst)
 m=tools.create_asset(name,'/Game/Cove',u.Material,u.MaterialFactoryNew());c=mel.create_material_expression(m,u.MaterialExpressionConstant3Vector);c.constant=u.LinearColor(*color,1);mel.connect_material_property(c,'',u.MaterialProperty.MP_BASE_COLOR)
 for val,prop in [(rough,u.MaterialProperty.MP_ROUGHNESS),(metal,u.MaterialProperty.MP_METALLIC)]:n=mel.create_material_expression(m,u.MaterialExpressionConstant);n.r=val;mel.connect_material_property(n,'',prop)
 mel.recompile_material(m);assets.save_loaded_asset(m);return m
def place(mesh,label,pos=(0,0,0),scale=(1,1,1),rot=(0,0,0),mat=None):
 a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector(*pos),u.Rotator(pitch=rot[0],yaw=rot[1],roll=rot[2]));a.set_actor_label(label);a.static_mesh_component.set_static_mesh(mesh);a.set_actor_scale3d(u.Vector(*scale))
 if mat:
  for i in range(a.static_mesh_component.get_num_materials()):a.static_mesh_component.set_material(i,mat)
 return a
try:
 u.SystemLibrary.execute_console_command(None,'Interchange.FeatureFlags.Import.FBX 0')
 world=u.EditorLoadingAndSavingUtils.new_blank_map(False)
 src=P/'assets/odyssey/source-v145/coastal_cliff_02/textures';cliff=imp(P/'assets/odyssey/refit-v145/coastal_cliff_02-nanite.fbx','SM_CoastalCliff02',True)
 sm=u.get_editor_subsystem(u.StaticMeshEditorSubsystem);ns=sm.get_nanite_settings(cliff);ns.enabled=True;sm.set_nanite_settings(cliff,ns,True)
 cm=material('M_ScannedCliff',texture(src/'coastal_cliff_02_diff_4k.jpg','Cliff_Albedo'),texture(src/'coastal_cliff_02_nor_gl_4k.jpg','Cliff_Normal','normal',True),texture(src/'coastal_cliff_02_arm_4k.jpg','Cliff_ORM','masks'))
 rock=place(cliff,'Actual fractured scanned cliff',pos=(0,0,-70),scale=(.38,.38,.38),rot=(0,180,0),mat=cm)
 cube=assets.load_asset('/Engine/BasicShapes/Cube');ground=place(cube,'Sand foundation',pos=(0,0,-105),scale=(60,60,.7),mat=flat('M_Sand',(.39,.34,.24)))
 water=place(cube,'Sea plane',pos=(0,0,-95),scale=(1000,1000,.02),mat=flat('M_Sea',(.018,.13,.14),.13))
 heroPath=P/'assets/odyssey/refit-v146/warrior-lookdev.fbx'
 if heroPath.exists():
  hero=imp(heroPath,'SM_Warrior',True);tx=P/'assets/odyssey/refit-v145/textures';hm=material('M_WarriorPBR',texture(tx/'warrior_basecolor.png','Warrior_Albedo'),texture(tx/'warrior_normal.png','Warrior_Normal','normal',True),texture(tx/'warrior_orm.png','Warrior_ORM','masks'));ha=place(hero,'Complete clothed warrior',pos=(100,-280,-72),rot=(0,180,0),mat=hm);report['heroBounds']=str(ha.get_actor_bounds(False))
 sun=actors.spawn_actor_from_class(u.DirectionalLight,u.Vector(0,0,1200),u.Rotator(pitch=-34,yaw=125,roll=0));sun.light_component.set_mobility(u.ComponentMobility.MOVABLE);sun.light_component.set_intensity(5);sun.light_component.set_light_color(u.LinearColor(1,.91,.80,1));sun.light_component.set_editor_property('atmosphere_sun_light',True)
 sky=actors.spawn_actor_from_class(u.SkyAtmosphere,u.Vector());sl=actors.spawn_actor_from_class(u.SkyLight,u.Vector(0,0,800));sl.light_component.set_mobility(u.ComponentMobility.MOVABLE);sl.light_component.set_editor_property('real_time_capture',False);sl.light_component.set_editor_property('source_type',u.SkyLightSourceType.SLS_SPECIFIED_CUBEMAP);sl.light_component.set_editor_property('cubemap',imp(P/'assets/odyssey/refit-v145/daylight.hdr','DaylightHDR'));sl.light_component.set_intensity(1.0)
 pp=actors.spawn_actor_from_class(u.PostProcessVolume,u.Vector());pp.set_editor_property('unbound',True);settings=pp.get_editor_property('settings')
 for name,value in [('override_dynamic_global_illumination_method',True),('dynamic_global_illumination_method',u.DynamicGlobalIlluminationMethod.LUMEN),('override_reflection_method',True),('reflection_method',u.ReflectionMethod.LUMEN),('override_auto_exposure_method',True),('auto_exposure_method',u.AutoExposureMethod.AEM_MANUAL),('override_auto_exposure_bias',True),('auto_exposure_bias',0.0),('override_auto_exposure_apply_physical_camera_exposure',True),('auto_exposure_apply_physical_camera_exposure',False)]:
  try:settings.set_editor_property(name,value)
  except Exception as ex:report['errors'].append(name+': '+str(ex))
 pp.set_editor_property('settings',settings)
 cam=actors.spawn_actor_from_class(u.CineCameraActor,u.Vector(1100,-1750,450));target=u.Vector(0,-20,170);cam.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cam.get_actor_location(),target),False);cam.get_cine_camera_component().set_editor_property('current_focal_length',38.0);cam.get_cine_camera_component().set_editor_property('post_process_settings',settings);cam.get_cine_camera_component().set_editor_property('post_process_blend_weight',1.0)
 ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);ed.set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation())
 assets.save_directory('/Game/Cove');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/Lookdev')
 report['uvChannels']=sm.get_num_uv_channels(cliff,0);report['assignedMaterial']=rock.static_mesh_component.get_material(0).get_path_name();report['texturePaths']=[x.get_path_name() for x in mel.get_used_textures(cm)]
 report.update(stage='saved native level',nanite=bool(sm.get_nanite_settings(cliff).enabled),rockBounds=str(rock.get_actor_bounds(False)),project=str(E/'ZaOjIngV146.uproject'),map='/Game/Cove/Lookdev',lumen=True);save_report()
 capture=actors.spawn_actor_from_class(u.SceneCapture2D,cam.get_actor_location(),cam.get_actor_rotation());comp=capture.get_component_by_class(u.SceneCaptureComponent2D);rt=u.RenderingLibrary.create_render_target2d(world,1800,1100,u.TextureRenderTargetFormat.RTF_RGBA8);comp.texture_target=rt;comp.capture_source=u.SceneCaptureSource.SCS_FINAL_COLOR_LDR;comp.fov_angle=50;comp.post_process_settings=settings;comp.post_process_blend_weight=1.0;comp.capture_every_frame=True
 start=time.monotonic();phase=0;handle=None
 def tick(dt):
  global phase,handle
  elapsed=time.monotonic()-start
  if phase==0 and elapsed>35:
   comp.capture_scene();u.RenderingLibrary.export_render_target(world,rt,str(V),'ue-cliff-reviewed.png');u.AutomationLibrary.take_high_res_screenshot(1800,1100,str(V/'ue-cliff-lumen.png'),camera=cam);phase=1
  elif phase==1 and elapsed>45:
   report['stage']='render requested';save_report();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
 handle=u.register_slate_post_tick_callback(tick)
except Exception:
 report['failure']=traceback.format_exc();save_report();u.log_error(report['failure']);u.SystemLibrary.quit_editor()
