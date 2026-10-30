"""Import the exact current browser courtyard, retaining its mesh, UVs and moving-group anchors."""
import unreal as u,json,math
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162'
def vec(a):return u.Vector(a[0]*100,a[2]*100,a[1]*100)
def build_home():
 meta=json.loads((OUT/'courtyard-current.json').read_text());actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);u.EditorLoadingAndSavingUtils.new_blank_map(False)
 task=u.AssetImportTask();task.filename=str(OUT/'courtyard-current.glb');task.destination_path='/Game/V162Courtyard';task.automated=True;task.replace_existing=True;task.save=True;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);parts={p['name']:p for p in meta['parts']};r={'engine':u.SystemLibrary.get_engine_version(),'source':task.filename,'parts':[],'errors':[]}
 for path in task.imported_object_paths:
  asset=u.load_asset(path)
  if not isinstance(asset,u.StaticMesh):continue
  a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector());c=a.static_mesh_component;c.set_static_mesh(asset);c.set_mobility(u.ComponentMobility.MOVABLE);name=asset.get_name();a.set_actor_label(name);r['parts'].append({'name':name,'materials':[c.get_material(i).get_name()if c.get_material(i)else''for i in range(c.get_num_materials())]})
 def rect(label,p,t,col,power,w,h):
  a=actors.spawn_actor_from_class(u.RectLight,vec(p));a.set_actor_label(label);a.set_actor_rotation(u.MathLibrary.find_look_at_rotation(a.get_actor_location(),vec(t)),False);c=a.light_component;c.set_mobility(u.ComponentMobility.MOVABLE);c.set_light_color(u.LinearColor(*col,1));c.set_editor_property('intensity_units',u.LightUnits.CANDELAS);c.set_intensity(power);c.set_editor_property('source_width',w);c.set_editor_property('source_height',h);c.set_attenuation_radius(12000);return a
 rect('Courtyard broad warm key',[-8,9,6],[0,4,-1],[1.,.76,.47],2800,400,480)
 rect('Courtyard quiet stone return',[7,6,3],[0,4,-1],[1.,.75,.52],200,500,500)
 rect('Courtyard woodland soft light',[-14,13,0],[-8,5,-20],[1.,.88,.72],450,500,500)
 sky=actors.spawn_actor_from_class(u.SkyLight,u.Vector(0,0,500));c=sky.light_component;c.set_mobility(u.ComponentMobility.MOVABLE);c.set_editor_property('source_type',u.SkyLightSourceType.SLS_SPECIFIED_CUBEMAP);c.set_editor_property('cubemap',u.load_asset('/Game/Cove/DaylightHDR'));c.set_intensity(.025)
 # Preserve the physical window practicals exported from the current browser cue.
 for i,l in enumerate(meta['lights']):
  if l['type']!='PointLight'or l['intensity']<.01:continue
  a=actors.spawn_actor_from_class(u.PointLight,vec(l['position']));a.set_actor_label('Courtyard window '+str(i));c=a.light_component;c.set_mobility(u.ComponentMobility.MOVABLE);c.set_light_color(u.LinearColor(*l['colour'],1));c.set_editor_property('intensity_units',u.LightUnits.CANDELAS);c.set_intensity(min(150,l['intensity']*6));c.set_attenuation_radius(700);c.set_editor_property('source_radius',8.)
 s=u.PostProcessSettings()
 for k,v in [('override_dynamic_global_illumination_method',True),('dynamic_global_illumination_method',u.DynamicGlobalIlluminationMethod.LUMEN),('override_reflection_method',True),('reflection_method',u.ReflectionMethod.LUMEN),('override_auto_exposure_method',True),('auto_exposure_method',u.AutoExposureMethod.AEM_MANUAL),('override_auto_exposure_apply_physical_camera_exposure',True),('auto_exposure_apply_physical_camera_exposure',False),('override_auto_exposure_bias',True),('auto_exposure_bias',-.3),('override_bloom_intensity',True),('bloom_intensity',.08),('override_motion_blur_amount',True),('motion_blur_amount',0.)]:s.set_editor_property(k,v)
 pp=actors.spawn_actor_from_class(u.PostProcessVolume,u.Vector());pp.set_editor_property('unbound',True);pp.set_editor_property('settings',s)
 cam=meta['camera'];ed.set_level_viewport_camera_info(vec(cam['position']),u.MathLibrary.find_look_at_rotation(vec(cam['position']),vec(cam['target'])));lev=u.get_editor_subsystem(u.LevelEditorSubsystem);lev.set_level_viewport_fov(math.degrees(2*math.atan(math.tan(math.radians(cam['fov'])/2)*cam['aspect'])),lev.get_active_viewport_config_key());lev.editor_set_game_view(True)
 u.EditorAssetLibrary.save_directory('/Game/V162Courtyard');u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/V162/Courtyard');r['savedMap']='/Game/V162/Courtyard';(OUT/'ue-home-build.json').write_text(json.dumps(r,indent=2));return r['savedMap']
def tune_home():
 lev=u.get_editor_subsystem(u.LevelEditorSubsystem);lev.load_level('/Game/V162/Courtyard');actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);mel=u.MaterialEditingLibrary;tools=u.AssetToolsHelpers.get_asset_tools()
 def material(name):
  path='/Game/V162Polish/'+name;m=u.load_asset(path)if u.EditorAssetLibrary.does_asset_exist(path)else tools.create_asset(name,'/Game/V162Polish',u.Material,u.MaterialFactoryNew());mel.delete_all_material_expressions(m);return m
 def node(m,cls):return mel.create_material_expression(m,cls)
 def scalar(m,prop,x):
  n=node(m,u.MaterialExpressionConstant);n.r=x;assert mel.connect_material_property(n,'',prop)
 leaf=material('CourtyardLivingLeaves');leaf.set_editor_property('two_sided',True);leaf.set_editor_property('shading_model',u.MaterialShadingModel.MSM_TWO_SIDED_FOLIAGE);vc=node(leaf,u.MaterialExpressionVertexColor);col=node(leaf,u.MaterialExpressionConstant3Vector);col.constant=u.LinearColor(.22,.36,.085,1);mul=node(leaf,u.MaterialExpressionMultiply);assert mel.connect_material_expressions(vc,'',mul,'A');assert mel.connect_material_expressions(col,'',mul,'B');assert mel.connect_material_property(mul,'',u.MaterialProperty.MP_BASE_COLOR);assert mel.connect_material_property(col,'',u.MaterialProperty.MP_SUBSURFACE_COLOR);scalar(leaf,u.MaterialProperty.MP_ROUGHNESS,.82);mel.recompile_material(leaf)
 wet=material('CourtyardWetMarble');task=u.AssetImportTask();task.filename=str(P/'assets/home/Marble012_diff_2k.jpg');task.destination_path='/Game/V162Polish';task.automated=True;task.replace_existing=True;task.save=True;tools.import_asset_tasks([task]);texture=u.load_asset('/Game/V162Polish/Marble012_diff_2k');assert texture
 tex=node(wet,u.MaterialExpressionTextureSample);tex.texture=texture;col=node(wet,u.MaterialExpressionConstant3Vector);col.constant=u.LinearColor(.18,.17,.145,1);mul=node(wet,u.MaterialExpressionMultiply);assert mel.connect_material_expressions(tex,'',mul,'A');assert mel.connect_material_expressions(col,'',mul,'B');assert mel.connect_material_property(mul,'',u.MaterialProperty.MP_BASE_COLOR);scalar(wet,u.MaterialProperty.MP_ROUGHNESS,.10);scalar(wet,u.MaterialProperty.MP_SPECULAR,.68);mel.recompile_material(wet)
 for a in actors.get_all_level_actors():
  if a.get_actor_label()=='V162 actual planar courtyard reflection':actors.destroy_actor(a);continue
  if a.get_actor_label()=='Courtyard broad warm key':a.light_component.set_intensity(850.)
  if a.get_actor_label()=='Courtyard quiet stone return':a.light_component.set_intensity(95.)
  if a.get_actor_label()=='Courtyard woodland soft light':a.light_component.set_intensity(210.)
  if isinstance(a,u.StaticMeshActor):
   c=a.static_mesh_component
   for i in range(c.get_num_materials()):
    m=c.get_material(i);name=m.get_name().lower()if m else''
    if 'leaf_underside'in name or 'livingleaves'in name:c.set_material(i,leaf)
    if 'honed_silver_marble'in name or 'wetmarble'in name:c.set_material(i,wet)
 for c in ['r.Lumen.Reflections.ScreenTraces 1','r.Lumen.Reflections.MaxRoughnessToTrace .6','r.Lumen.Reflections.DownsampleFactor 1','r.Lumen.ScreenProbeGather.ScreenTraces 1','r.SSR.Quality 4']:u.SystemLibrary.execute_console_command(ed.get_editor_world(),c)
 u.EditorAssetLibrary.save_directory('/Game/V162Polish');u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/V162/Courtyard')
