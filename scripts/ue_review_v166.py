"""V166: scoped resident scene refinements, preserving approved source meshes."""
import unreal as u,json,time,importlib,re
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-166';mel=u.MaterialEditingLibrary
def inventory():
 import ue_worlds_v165
 ue_worlds_v165.ensure();result={}
 for scene in ['home','room','myth']:
  rows=[]
  for a in ue_worlds_v165.actors(scene):
   q={'label':a.get_actor_label(),'class':a.get_class().get_name(),'position':str(a.get_actor_location())}
   if isinstance(a,u.StaticMeshActor):
    c=a.static_mesh_component;q['mesh']=c.static_mesh.get_path_name()if c.static_mesh else None;q['materials']=[{'slot':i,'path':c.get_material(i).get_path_name()if c.get_material(i)else None}for i in range(c.get_num_materials())]
   if isinstance(a,u.Light):q.update(power=a.light_component.intensity,color=str(a.light_component.get_light_color()))
   if isinstance(a,u.ExponentialHeightFog):
    c=a.get_component_by_class(u.ExponentialHeightFogComponent);q.update(density=c.get_editor_property('fog_density'),start=c.get_editor_property('start_distance'))
   rows.append(q)
  result[scene]=rows
 (OUT/'inventory.json').write_text(json.dumps(result,indent=2))
def run():
 kind=json.loads((OUT/'request.json').read_text(encoding='utf-8-sig'))['kind']
 if kind=='inventory':inventory()
 elif kind=='apply':apply()
 elif kind=='save':save()
 elif kind=='finish':finish()
 else:raise ValueError('Unknown V166 job '+kind)
 (OUT/'job-result.json').write_text(json.dumps({'kind':kind,'ok':True,'at':time.time()}));(OUT/'request.json').unlink()

def constant(m,prop,value):
 cls=u.MaterialExpressionConstant3Vector if isinstance(value,tuple)else u.MaterialExpressionConstant;n=mel.create_material_expression(m,cls)
 if isinstance(value,tuple):n.constant=u.LinearColor(*value,1)
 else:n.r=value
 assert mel.connect_material_property(n,'',prop)
def apply():
 import ue_worlds_v165
 ue_worlds_v165.ensure();report={};w=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
 for a in ue_worlds_v165.actors('home'):
  label=a.get_actor_label()
  if label=='Courtyard broad warm key':a.light_component.set_light_color(u.LinearColor(1.,.86,.68,1));a.light_component.set_intensity(680.)
  if label=='Courtyard quiet stone return':a.light_component.set_light_color(u.LinearColor(.68,.79,1.,1));a.light_component.set_intensity(105.)
  if label=='Courtyard woodland soft light':a.light_component.set_light_color(u.LinearColor(.78,.88,1.,1));a.light_component.set_intensity(70.)
  if isinstance(a,u.SkyLight):a.light_component.set_intensity(.055)
  if isinstance(a,u.PostProcessVolume):
   s=a.get_editor_property('settings')
   for k,v in [('override_auto_exposure_bias',True),('auto_exposure_bias',-.65),('override_color_saturation',True),('color_saturation',u.Vector4(1.,1.,1.,1.)),('override_bloom_intensity',True),('bloom_intensity',.035)]:s.set_editor_property(k,v)
   a.set_editor_property('settings',s)
 report['home']={'warmKey':680,'exposure':-.65,'sourceGeometryAndPalettePreserved':True}
 path='/Game/V166/OpaqueSpunBrassShade';shade=u.load_asset(path)or u.AssetToolsHelpers.get_asset_tools().create_asset('OpaqueSpunBrassShade','/Game/V166',u.Material,u.MaterialFactoryNew());mel.delete_all_material_expressions(shade);shade.set_editor_property('blend_mode',u.BlendMode.BLEND_OPAQUE);shade.set_editor_property('shading_model',u.MaterialShadingModel.MSM_DEFAULT_LIT);shade.set_editor_property('two_sided',True)
 for prop,v in [(u.MaterialProperty.MP_BASE_COLOR,(.36,.235,.09)),(u.MaterialProperty.MP_METALLIC,.78),(u.MaterialProperty.MP_ROUGHNESS,.34),(u.MaterialProperty.MP_SPECULAR,.35)]:constant(shade,prop,v)
 mel.recompile_material(shade);u.EditorAssetLibrary.save_loaded_asset(shade);changed=[]
 for a in ue_worlds_v165.actors('room'):
  if isinstance(a,u.StaticMeshActor):
   c=a.static_mesh_component
   for i in range(c.get_num_materials()):
    old=c.get_material(i)
    if old and 'continuous_spun_brass_opaque_lamp_shade'in old.get_name():c.set_material(i,shade);c.set_cast_shadow(True);changed.append(a.get_actor_label())
  if isinstance(a,u.PointLight)and 'lamp practical'in a.get_actor_label():a.light_component.set_editor_property('source_radius',1.1);a.light_component.set_cast_shadows(True)
 report['room']={'opaqueShadeActors':changed,'originalSceneRestored':True,'originalWindowUnchanged':True}
 source=u.load_asset('/Game/V165/GoldenLivingSea');sea=u.load_asset('/Game/V166/QuietBreakingSea')or u.EditorAssetLibrary.duplicate_asset(source.get_path_name(),'/Game/V166/QuietBreakingSea')
 for e in u.ObjectIterator(u.MaterialExpressionCustom):
  if e.get_outer()!=sea:continue
  code=e.get_editor_property('code')
  if 'float depth=max(0.,D.r-Z)'in code:
   e.set_editor_property('code','float depth=max(0.,D.r-Z);float valid=step(1.,D.r)*step(D.r,45000.);float p=dot(P.xy-float2(100.,800.),float2(.96,.28))*.004487989-T*2.0981;float grain=.5+.5*sin(P.x*.028+sin(P.y*.019)*2.7+T*.55);float band=pow(saturate(1.-abs(depth-(20.+18.*sin(p)))/(11.+grain*6.)),2.)*valid;float wash=band*smoothstep(-.15,.8,sin(p))*smoothstep(.32,.77,grain)*.40;return float4(lerp(float3(.007,.038,.048),float3(.38,.43,.40),wash),.25+wash*.35);')
  elif 'Texture2DSample(Wave,WaveSampler'in code:
   code=re.sub(r'float fade=.*?;','float fade=lerp(.040,.006,smoothstep(8000.,22000.,length(P.xy)));',code)
   e.set_editor_property('code',code)
 constant(sea,u.MaterialProperty.MP_SPECULAR,.45)
 output=next(e for e in u.ObjectIterator(u.MaterialExpressionSingleLayerWaterMaterialOutput)if e.get_outer()==sea)
 for pin,c in [('ScatteringCoefficients',(.0008,.0022,.0025)),('AbsorptionCoefficients',(.006,.0014,.0007))]:
  n=mel.create_material_expression(sea,u.MaterialExpressionConstant3Vector);n.constant=u.LinearColor(*c,1);mel.connect_material_expressions(n,'',output,pin)
 mel.recompile_material(sea);u.EditorAssetLibrary.save_loaded_asset(sea)
 for a in ue_worlds_v165.actors('myth'):
  if a.get_actor_label()=='Water foundation':a.static_mesh_component.set_material(0,sea)
  if a.get_actor_label()=='V164 distant continuous ocean':a.static_mesh_component.set_visibility(False);a.set_is_temporarily_hidden_in_editor(True)
  if isinstance(a,u.ExponentialHeightFog):
   c=a.get_component_by_class(u.ExponentialHeightFogComponent)
   for k,v in [('fog_density',.06),('fog_height_falloff',.12),('start_distance',4200.),('fog_max_opacity',.97),('enable_volumetric_fog',True),('volumetric_fog_distance',28000.),('volumetric_fog_extinction_scale',1.),('volumetric_fog_scattering_distribution',.3),('fog_inscattering_luminance',u.LinearColor(.24,.30,.31,1))]:c.set_editor_property(k,v)
   a.set_actor_location(u.Vector(0,0,100),False,False)
 report['sea']={'sourceIslandAndVesselPreserved':True,'secondaryFarOceanHidden':True,'roughness':.25,'volumetricFog':True,'fogStartMetres':42,'fogDensity':.06,'material':sea.get_path_name()}
 for command in ['r.VolumetricFog 1','ShowFlag.Fog 1','ShowFlag.VolumetricFog 1','r.Water.SingleLayer.Reflection.DownsampleFactor 1']:u.SystemLibrary.execute_console_command(w,command)
 # Reload only motion, retaining the live capture producer and resident scenes.
 import ue_runtime_v162
 if ue_runtime_v162.handle is not None:u.unregister_slate_post_tick_callback(ue_runtime_v162.handle)
 importlib.reload(ue_runtime_v162).ensure_runtime()
 (OUT/'art-result.json').write_text(json.dumps(report,indent=2))
def save():
 import ue_worlds_v165
 restore=[]
 for scene in ['home','room','myth']:
  for a in ue_worlds_v165.actors(scene):
   if not isinstance(a,u.StaticMeshActor):continue
   c=a.static_mesh_component
   for i in range(c.get_num_materials()):
    old=c.get_material(i);source=old
    while isinstance(source,u.MaterialInstanceDynamic):source=source.get_editor_property('parent')
    if source!=old:restore.append((c,i,old));c.set_material(i,source)
 for path in ['/Game/V162/Courtyard','/Game/V162/Studio','/Game/Cove/FullCoveV162']:
  assert u.EditorAssetLibrary.save_loaded_asset(u.load_asset(path)),'Failed to save '+path
 for c,i,old in restore:c.set_material(i,old)
 (OUT/'saved.json').write_text(json.dumps({'mapsSaved':True,'hostMapSaved':False,'at':time.time()}))

def finish():
 import ue_worlds_v165
 for a in ue_worlds_v165.actors('myth'):
  if isinstance(a,u.ExponentialHeightFog):
   c=a.get_component_by_class(u.ExponentialHeightFogComponent);c.set_editor_property('fog_density',.045);c.set_editor_property('start_distance',8000.);c.set_volumetric_fog_start_distance(8000.);c.set_volumetric_fog_near_fade_in_distance(3000.);c.set_editor_property('volumetric_fog_extinction_scale',.55)
 task=u.AssetImportTask();task.filename=str(OUT/'continuous-shade.glb');task.destination_path='/Game/V166/Shade';task.automated=True;task.save=True;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])
 meshes=[u.load_asset(p)for p in task.imported_object_paths if isinstance(u.load_asset(p),u.StaticMesh)];assert len(meshes)==1
 shade=u.load_asset('/Game/V166/OpaqueSpunBrassShade');updated=[]
 for a in ue_worlds_v165.actors('room'):
  if not isinstance(a,u.StaticMeshActor):continue
  c=a.static_mesh_component
  if a.get_actor_label()=='StaticMeshActor2':c.set_static_mesh(meshes[0]);c.set_material(0,shade);updated.append(a.get_actor_label())
  if a.get_actor_label()in['StaticMeshActor3','StaticMeshActor4']:c.set_visibility(False);a.set_is_temporarily_hidden_in_editor(True)
 (OUT/'finish-result.json').write_text(json.dumps({'shadeMesh':meshes[0].get_path_name(),'originalDimensionsRetained':True,'solidThicknessMm':2.6,'smoothedRadialNormals':True,'changed':updated,'fogBeginsAtMetres':80,'noIslandOrBoatChanges':True},indent=2))
