"""Actual cut island / embedded high-poly cliffs / complete masked foliage / HDR sky."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]
exec((P/'scripts/ue-lookdev-v146.py').read_text(encoding='utf-8').split('try:\n u.SystemLibrary.execute_console_command')[0])
P=Path(__file__).resolve().parents[1];V=P/'.verify/v32-147';A=P/'assets/odyssey/ue-v147';u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV147');ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=ed.get_editor_world();u.SystemLibrary.execute_console_command(world,'Interchange.FeatureFlags.Import.FBX 0');sm=u.get_editor_subsystem(u.StaticMeshEditorSubsystem)
newIsland=imp(A/'Island-cut.fbx','V147_IslandCut',True)
for a in actors.get_all_level_actors():
 if a.get_actor_label()=='Island':a.static_mesh_component.set_static_mesh(newIsland);a.static_mesh_component.set_material(0,assets.load_asset('/Game/Cove/V147_Terrain'))
 if a.get_actor_label() in ['Scanned fractured bedrock 0','Scanned fractured bedrock 1']:actors.destroy_actor(a)
for name in ['coastal_cliff_02','coastal_cliff_04']:
 mesh=imp(A/(name+'-embedded.fbx'),'V147_Embedded_'+name,True);place(mesh,'Native embedded bedrock '+name,mat=assets.load_asset('/Game/Cove/V147_PBR_'+name))
# Thin leaf cards use their explicit alpha channel and conventional rasterization.
# Nanite remains enabled on the dense photogrammetric rock geometry.
leafmesh=assets.load_asset('/Game/Cove/V147_Vegetation_00');ns=sm.get_nanite_settings(leafmesh);ns.enabled=False;sm.set_nanite_settings(leafmesh,ns,True)
ld=P/'assets/odyssey/ue-v147/textures/T_island_tree_01_leaves_diff_1k.png';lt=texture(ld,'V147_LeavesRGBA');lt.set_editor_property('compression_settings',u.TextureCompressionSettings.TC_DEFAULT);lt.set_editor_property('srgb',True)
try:lt.set_editor_property('compression_no_alpha',False)
except:pass
assets.save_loaded_asset(lt);lm=tools.create_asset('V147_ExplicitLeafMask','/Game/Cove',u.Material,u.MaterialFactoryNew()) if not assets.does_asset_exist('/Game/Cove/V147_ExplicitLeafMask') else assets.load_asset('/Game/Cove/V147_ExplicitLeafMask');mel.delete_all_material_expressions(lm);lm.set_editor_property('two_sided',True);lm.set_editor_property('blend_mode',u.BlendMode.BLEND_MASKED);lm.set_editor_property('opacity_mask_clip_value',.18);n=mel.create_material_expression(lm,u.MaterialExpressionTextureSample);n.texture=lt;n.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_COLOR;mel.connect_material_property(n,'RGB',u.MaterialProperty.MP_BASE_COLOR);mel.connect_material_property(n,'A',u.MaterialProperty.MP_OPACITY_MASK);r=mel.create_material_expression(lm,u.MaterialExpressionConstant);r.r=.90;mel.connect_material_property(r,'',u.MaterialProperty.MP_ROUGHNESS);mel.recompile_material(lm);assets.save_loaded_asset(lm);leafmesh.set_material(0,lm);assets.save_loaded_asset(leafmesh)
for a in actors.get_all_level_actors():
 if isinstance(a,u.StaticMeshActor) and a.static_mesh_component.static_mesh==leafmesh:a.static_mesh_component.set_material(0,lm)
# Visible sky uses the same actual HDR as ambient lighting, independent of sun lux.
skyMat=tools.create_asset('V147_VisibleHDRSky','/Game/Cove',u.Material,u.MaterialFactoryNew()) if not assets.does_asset_exist('/Game/Cove/V147_VisibleHDRSky') else assets.load_asset('/Game/Cove/V147_VisibleHDRSky');mel.delete_all_material_expressions(skyMat);skyMat.set_editor_property('two_sided',True);skyMat.set_editor_property('shading_model',u.MaterialShadingModel.MSM_UNLIT)
direction=mel.create_material_expression(skyMat,u.MaterialExpressionReflectionVectorWS);skytex=mel.create_material_expression(skyMat,u.MaterialExpressionTextureSample);skytex.texture=assets.load_asset('/Game/Cove/DaylightHDR');skytex.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_LINEAR_COLOR;assert mel.connect_material_expressions(direction,'',skytex,'UVs');mul=mel.create_material_expression(skyMat,u.MaterialExpressionMultiply);intensity=mel.create_material_expression(skyMat,u.MaterialExpressionConstant);intensity.r=.65;mel.connect_material_expressions(skytex,'RGB',mul,'A');mel.connect_material_expressions(intensity,'',mul,'B');mel.connect_material_property(mul,'',u.MaterialProperty.MP_EMISSIVE_COLOR);mel.recompile_material(skyMat);assets.save_loaded_asset(skyMat)
sky=place(assets.load_asset('/Engine/BasicShapes/Sphere'),'Visible real daylight HDR',scale=(20000,20000,20000),mat=skyMat);sky.static_mesh_component.set_editor_property('cast_shadow',False)
try:sky.static_mesh_component.set_editor_property('affect_distance_field_lighting',False)
except:pass
cams={a.get_actor_label():a for a in actors.get_all_level_actors() if isinstance(a,u.CineCameraActor)};cam=cams['Full cove'];cam.set_actor_location(u.Vector(3700,4900,1700),False,False);cam.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cam.get_actor_location(),u.Vector(-600,-1600,900)),False);cam.get_cine_camera_component().set_editor_property('current_focal_length',32.);shore=cams['Rock shore'];shore.set_actor_location(u.Vector(-1700,900,650),False,False);shore.set_actor_rotation(u.MathLibrary.find_look_at_rotation(shore.get_actor_location(),u.Vector(-1700,-1800,650)),False);shore.get_cine_camera_component().set_editor_property('current_focal_length',38.);ed.set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation());u.SystemLibrary.execute_console_command(world,'r.DepthOfFieldQuality 0');u.SystemLibrary.execute_console_command(world,'r.MotionBlurQuality 0');assets.save_directory('/Game/Cove');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV147');start=time.monotonic();phase=0;handle=None
def tick(dt):
 global phase,handle
 t=time.monotonic()-start
 if phase==0 and t>50:u.AutomationLibrary.take_high_res_screenshot(2560,1440,str(V/'ue-cove-integrated.png'),camera=cam);phase=1
 elif phase==1 and t>65:ed.set_level_viewport_camera_info(shore.get_actor_location(),shore.get_actor_rotation());phase=2
 elif phase==2 and t>85:u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V/'ue-shore-integrated.png'),camera=shore);phase=3
 elif phase==3 and t>100:
  (V/'ue-integration.json').write_text(json.dumps({'cutIsland':True,'newGeometry':'assets/odyssey/ue-v147/Island-cut.fbx','embeddedNativeScans':True,'thinLeafCardsConventionalRaster':True,'denseCliffsNanite':True,'actualHDRSky':True,'artApproval':'pending image inspection'}),encoding='utf-8');u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
handle=u.register_slate_post_tick_callback(tick)
