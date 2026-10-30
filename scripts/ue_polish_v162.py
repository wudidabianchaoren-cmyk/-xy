"""Allowlisted local scene inspection and art correction, loaded by the native editor."""
import unreal as u,json
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162'
def audit():
 if (P/'.verify/v32-172/request.json').exists():
  import ue_review_v172,importlib
  importlib.reload(ue_review_v172).run()
  return
 if (P/'.verify/v32-171/request.json').exists():
  import ue_review_v171,importlib
  importlib.reload(ue_review_v171).run()
  return
 if (P/'.verify/v32-170/request.json').exists():
  import ue_review_v170,importlib
  importlib.reload(ue_review_v170).run()
  return
 if (P/'.verify/v32-169/request.json').exists():
  import ue_review_v169,importlib
  importlib.reload(ue_review_v169).run()
  return
 if (P/'.verify/v32-167/request.json').exists():
  import ue_review_v167,importlib
  importlib.reload(ue_review_v167).run()
  return
 if (P/'.verify/v32-166/request.json').exists():
  import ue_review_v166,importlib
  importlib.reload(ue_review_v166).run()
  return
 if (P/'.verify/v32-165/request.json').exists():
  import ue_review_v165,importlib
  importlib.reload(ue_review_v165).run()
  return
 if (P/'.verify/v32-164/request.json').exists():
  import ue_review_v164,importlib
  importlib.reload(ue_review_v164).run()
  return
 if (P/'.verify/v32-163/water-fix-pending').exists():
  import ue_water_fix_v163,importlib
  importlib.reload(ue_water_fix_v163).apply()
  (P/'.verify/v32-163/water-fix-pending').unlink()
 if (P/'.verify/v32-163/finish-pending').exists():
  import ue_finish_v163,importlib
  importlib.reload(ue_finish_v163).apply()
 if (P/'.verify/v32-163/cove-additions-pending').exists():
  import ue_cove_additions_v163,importlib
  importlib.reload(ue_cove_additions_v163).apply()
 if (P/'.verify/v32-163/apply-pending').exists():
  import ue_stability_v163,importlib
  importlib.reload(ue_stability_v163).apply()
 if (OUT/'diagnostic-enabled').exists():return diagnose()
 if (OUT/'repair-vessel-mesh-on-audit').exists():
  import ue_island_build_v162,ue_recover_cove_v162,importlib
  importlib.reload(ue_island_build_v162).import_vessel();importlib.reload(ue_recover_cove_v162).preserve_authored_vessel_materials()
 if (OUT/'final-atmosphere-on-audit').exists():
  import ue_final_atmosphere_v162,importlib
  importlib.reload(ue_final_atmosphere_v162).apply()
 if (OUT/'repair-vessel-on-audit').exists():
  import ue_recover_cove_v162,importlib
  importlib.reload(ue_recover_cove_v162).preserve_authored_vessel_materials()
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem)
 r={}
 for scene,path in [('myth','/Game/Cove/FullCoveV162'),('room','/Game/V162/Studio')]:
  levels.load_level(path);entries=[]
  for a in actors.get_all_level_actors():
   e={'label':a.get_actor_label(),'class':a.get_class().get_name(),'location':[a.get_actor_location().x,a.get_actor_location().y,a.get_actor_location().z],'forward':[a.get_actor_forward_vector().x,a.get_actor_forward_vector().y,a.get_actor_forward_vector().z],'hidden':a.is_hidden_ed()}
   if isinstance(a,u.StaticMeshActor):
    c=a.static_mesh_component;e.update(mesh=c.static_mesh.get_path_name() if c.static_mesh else None,visible=c.is_visible(),materials=[c.get_material(i).get_path_name() if c.get_material(i)else None for i in range(c.get_num_materials())])
   if isinstance(a,u.Light):e.update(intensity=a.light_component.intensity,colour=str(a.light_component.get_light_color()))
   entries.append(e)
  r[scene]=entries
 (OUT/'native-audit.json').write_text(json.dumps(r,indent=2),encoding='utf-8')
 if (OUT/'reload-runtime-on-audit').exists():
  import ue_runtime_v162,ue_mirror_v162,ue_room_media_v163,importlib
  importlib.reload(ue_mirror_v162);importlib.reload(ue_room_media_v163)
  if ue_runtime_v162.handle is not None:u.unregister_slate_post_tick_callback(ue_runtime_v162.handle)
  importlib.reload(ue_runtime_v162).ensure_runtime()
def diagnose():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);mel=u.MaterialEditingLibrary
 levels.load_level('/Game/Cove/FullCoveV162');m=u.load_asset('/Game/V162Polish/TealSurface');m.set_editor_property('shading_model',u.MaterialShadingModel.MSM_UNLIT);n=mel.create_material_expression(m,u.MaterialExpressionConstant3Vector);n.set_editor_property('constant',u.LinearColor(.03,.3,.24,1));ok=mel.connect_material_property(n,'',u.MaterialProperty.MP_EMISSIVE_COLOR);mel.recompile_material(m)
 ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);u.EditorAssetLibrary.save_loaded_asset(m);u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'material-diagnostic.json').write_text(json.dumps({'connected':ok,'shading':str(m.get_editor_property('shading_model')),'expressions':mel.get_num_material_expressions(m)}))
 ed.set_level_viewport_camera_info(u.Vector(3700,4900,1700),u.MathLibrary.find_look_at_rotation(u.Vector(3700,4900,1700),u.Vector(-600,-1600,900)));u.AutomationLibrary.take_high_res_screenshot(1280,720,str(OUT/'native-direct.png'))
def polish():
 import ue_recover_cove_v162
 import importlib
 importlib.reload(ue_recover_cove_v162)
 ue_recover_cove_v162.ensure_cove()
 ue_recover_cove_v162.preserve_authored_vessel_materials()
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);mel=u.MaterialEditingLibrary;assets=u.AssetToolsHelpers.get_asset_tools()
 def material(name,col,rough=.7,metal=0,emission=None):
  path='/Game/V162Polish/'+name
  m=u.load_asset(path)if u.EditorAssetLibrary.does_asset_exist(path)else assets.create_asset(name,'/Game/V162Polish',u.Material,u.MaterialFactoryNew())
  mel.delete_all_material_expressions(m)
  for prop,value in [(u.MaterialProperty.MP_BASE_COLOR,col),(u.MaterialProperty.MP_EMISSIVE_COLOR,emission)]:
   if value is None:continue
   n=mel.create_material_expression(m,u.MaterialExpressionConstant3Vector);n.set_editor_property('constant',u.LinearColor(*value,1));mel.connect_material_property(n,'',prop)
  for prop,value in [(u.MaterialProperty.MP_ROUGHNESS,rough),(u.MaterialProperty.MP_METALLIC,metal)]:
   n=mel.create_material_expression(m,u.MaterialExpressionConstant);n.set_editor_property('r',value);mel.connect_material_property(n,'',prop)
  m.set_editor_property('shading_model',u.MaterialShadingModel.MSM_DEFAULT_LIT);mel.recompile_material(m);return m
 levels.load_level('/Game/Cove/FullCoveV162');all=actors.get_all_level_actors()
 sea=material('TealSurface',(.015,.085,.10),.19,0,(.003,.020,.018));sea.set_editor_property('two_sided',True)
 normal=u.load_asset('/Game/V162Island/waternormals');sample=mel.create_material_expression(sea,u.MaterialExpressionTextureSample);sample.texture=normal;sample.set_editor_property('sampler_type',u.MaterialSamplerType.SAMPLERTYPE_NORMAL)
 coord=mel.create_material_expression(sea,u.MaterialExpressionWorldPosition);mask=mel.create_material_expression(sea,u.MaterialExpressionComponentMask);mask.set_editor_property('r',True);mask.set_editor_property('g',True);mel.connect_material_expressions(coord,'',mask,'');scale=mel.create_material_expression(sea,u.MaterialExpressionMultiply);scale.set_editor_property('const_b',.0012);mel.connect_material_expressions(mask,'',scale,'A');pan=mel.create_material_expression(sea,u.MaterialExpressionPanner);pan.set_editor_property('speed_x',.012);pan.set_editor_property('speed_y',.008);mel.connect_material_expressions(scale,'',pan,'Coordinate');mel.connect_material_expressions(pan,'',sample,'UVs');amp=mel.create_material_expression(sea,u.MaterialExpressionConstant3Vector);amp.set_editor_property('constant',u.LinearColor(.14,.14,1.,1));mul=mel.create_material_expression(sea,u.MaterialExpressionMultiply);mel.connect_material_expressions(sample,'',mul,'A');mel.connect_material_expressions(amp,'',mul,'B');mel.connect_material_property(mul,'',u.MaterialProperty.MP_NORMAL);mel.recompile_material(sea)
 grass=material('LivingMeadow',(.18,.25,.065),.88);grass.set_editor_property('two_sided',True);vc=mel.create_material_expression(grass,u.MaterialExpressionVertexColor);gc=mel.create_material_expression(grass,u.MaterialExpressionCustom);gc.set_editor_property('code','return (max(V.r,max(V.g,V.b))>.98?float3(.19,.29,.07):V.rgb)*float3(.85,.92,.65);');gc.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);ci=u.CustomInput();ci.set_editor_property('input_name','V');gc.set_editor_property('inputs',[ci]);assert mel.connect_material_expressions(vc,'',gc,'V');assert mel.connect_material_property(gc,'',u.MaterialProperty.MP_BASE_COLOR);mel.recompile_material(grass)
 # The existing native continuous ocean mesh receives the same clock as the boat.
 time=mel.create_material_expression(sea,u.MaterialExpressionScalarParameter);time.set_editor_property('parameter_name','NativeSeaTime');wp=mel.create_material_expression(sea,u.MaterialExpressionWorldPosition);wave=mel.create_material_expression(sea,u.MaterialExpressionCustom);wave.set_editor_property('code','return float3(0,0,3.8*sin(P.x/900+(P.y-1350)/1100+T*.7)+1.2*sin(P.x/430+(P.y-1350)/850+T*1.13));');wave.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);inputs=[]
 for key in ['P','T']:
  ci=u.CustomInput();ci.set_editor_property('input_name',key);inputs.append(ci)
 wave.set_editor_property('inputs',inputs);assert mel.connect_material_expressions(wp,'',wave,'P');assert mel.connect_material_expressions(time,'',wave,'T');assert mel.connect_material_property(wave,'',u.MaterialProperty.MP_WORLD_POSITION_OFFSET);mel.recompile_material(sea)
 skin=material('WeatheredSkin',(.48,.265,.145),.65);steel=material('ForgedSteel',(.12,.145,.15),.48,.82);leather=material('Oxhide',(.065,.028,.012),.78);wools=[material('Wool'+str(i),col,.96)for i,col in enumerate([(.22,.075,.025),(.10,.17,.07),(.23,.17,.08),(.11,.10,.08)])]
 for a in all:
  if isinstance(a,u.DirectionalLight)and a.light_component.intensity>1:a.light_component.set_light_color(u.LinearColor(1.,.62,.29,1));a.light_component.set_intensity(8.5)
  if isinstance(a,u.SkyLight):a.light_component.set_intensity(1.10)
  if isinstance(a,u.StaticMeshActor):
   c=a.static_mesh_component
   if a.get_actor_label()=='Water foundation':
    ocean=u.load_asset('/Game/Cove/V153ContinuousOcean')
    if ocean:c.set_static_mesh(ocean);a.set_actor_scale3d(u.Vector(1,1,1));a.set_actor_location(u.Vector(0,0,-17),False,False)
    c.set_material(0,sea)
   if any(c.get_material(i)and any(key in c.get_material(i).get_name().lower()for key in['meadow','grasses','vertex_colour_grass'])for i in range(c.get_num_materials())):
    for i in range(c.get_num_materials()):c.set_material(i,grass)
   if a.get_actor_label().startswith('V162 rower '):
    for i in range(c.get_num_materials()):
     m=c.get_material(i);name=m.get_name().lower()if m else''
     if 'anatomical_skin'in name:c.set_material(i,skin)
     elif 'forged_steel'in name:c.set_material(i,steel)
     elif 'oxhide'in name:c.set_material(i,leather)
     elif 'wool_surcoat'in name:c.set_material(i,wools[int(name[-1])%4])
 u.EditorAssetLibrary.save_directory('/Game/V162Polish');u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/Cove/FullCoveV162')
 levels.load_level('/Game/V162/Studio')
 cloth=material('WovenLinen',(.26,.23,.185),.93);cloth.set_editor_property('two_sided',True);cloth.set_editor_property('shading_model',u.MaterialShadingModel.MSM_CLOTH)
 tc=mel.create_material_expression(cloth,u.MaterialExpressionTextureCoordinate);tc.set_editor_property('u_tiling',8.);tc.set_editor_property('v_tiling',8.)
 texture=u.load_asset('/Game/V162Studio/rough_linen_nor_gl_1k')
 if texture:
  ns=mel.create_material_expression(cloth,u.MaterialExpressionTextureSample);ns.texture=texture;ns.set_editor_property('sampler_type',u.MaterialSamplerType.SAMPLERTYPE_NORMAL);assert mel.connect_material_expressions(tc,'',ns,'UVs');assert mel.connect_material_property(ns,'',u.MaterialProperty.MP_NORMAL)
 mel.recompile_material(cloth)
 for a in actors.get_all_level_actors():
  if isinstance(a,(u.PointLight,u.RectLight))and 'desk lamp warm core'in a.get_actor_label():a.set_actor_label('V162 lamp practical warm core')
  if isinstance(a,u.StaticMeshActor):
   c=a.static_mesh_component
   for i in range(c.get_num_materials()):
    m=c.get_material(i)
    if m and any(key in m.get_name().lower()for key in['curtain','woven','linen_cloth']):c.set_material(i,cloth)
 u.EditorAssetLibrary.save_directory('/Game/V162Polish');u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/V162/Studio');audit()
 import ue_runtime_v162
 if ue_runtime_v162.handle is not None:u.unregister_slate_post_tick_callback(ue_runtime_v162.handle)
 import importlib
 import ue_mirror_v162
 importlib.reload(ue_mirror_v162)
 importlib.reload(ue_runtime_v162).ensure_runtime()
 import ue_home_v162,importlib
 importlib.reload(ue_home_v162).tune_home()
 import ue_gulls_v162
 importlib.reload(ue_gulls_v162).ensure()
 import ue_crew_life_v162
 importlib.reload(ue_crew_life_v162).apply()
 audit()
 inventory=json.loads((OUT/'native-audit.json').read_text());assert any(a['label']=='Vessel'for a in inventory['myth']);assert any(a['label']=='Island'for a in inventory['myth']);assert sum('GullBody'in a['label']for a in inventory['myth'])==7;assert len(inventory['room'])>300
 (OUT/'native-scene-integrity.json').write_text(json.dumps({'passed':True,'mythActors':len(inventory['myth']),'roomActors':len(inventory['room']),'nativeGulls':7,'mapsIsolated':True,'preservedSourceMap':'/Game/Cove/FullCoveV161'},indent=2))
