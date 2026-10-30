"""V164 narrowly scoped native lighting/material corrections, with isolated material copies."""
import unreal as u,json,math,importlib,inspect
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-164';mel=u.MaterialEditingLibrary

def context(path):
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);levels.load_level(path)
 return levels,u.get_editor_subsystem(u.EditorActorSubsystem),u.get_editor_subsystem(u.UnrealEditorSubsystem)

def material(name,source=None):
 path='/Game/V164/'+name
 m=u.load_asset(path)
 if not m:m=u.EditorAssetLibrary.duplicate_asset(source,path)if source else u.AssetToolsHelpers.get_asset_tools().create_asset(name,'/Game/V164',u.Material,u.MaterialFactoryNew())
 return m

def node(m,cls):return mel.create_material_expression(m,cls)
def scalar(m,prop,x):
 n=node(m,u.MaterialExpressionConstant);n.r=x;assert mel.connect_material_property(n,'',prop);return n
def color(m,prop,c):
 n=node(m,u.MaterialExpressionConstant3Vector);n.constant=u.LinearColor(*c,1);assert mel.connect_material_property(n,'',prop);return n
def save(ed,path):
 u.EditorAssetLibrary.save_directory('/Game/V164');u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),path)

QUALITY=['r.ScreenPercentage 75','r.Lumen.Reflections.DownsampleFactor 2','r.Water.SingleLayer.Reflection.DownsampleFactor 2','r.VolumetricCloud.ViewRaySampleMaxCount 32','r.VolumetricFog.GridPixelSize 16','t.MaxFPS 45','ShowFlag.Cloud 1','ShowFlag.VolumetricFog 1','PixelStreaming2.WebRTC.MinBitrate 16000000','PixelStreaming2.WebRTC.MaxBitrate 40000000','PixelStreaming2.Encoder.TargetBitrate 24000000','PixelStreaming2.Encoder.MinQuality 75','PixelStreaming2.WebRTC.Fps 45','r.TSR.History.ScreenPercentage 100','r.Shadow.Virtual.SMRT.RayCountLocal 8','r.Shadow.Virtual.SMRT.SamplesPerRayLocal 8','r.Lumen.ScreenProbeGather.Temporal.MaxFramesAccumulated 32','r.Lumen.Reflections.Temporal.MaxFramesAccumulated 24','r.MaxAnisotropy 16']

def runtime():
 for c in QUALITY:u.SystemLibrary.execute_console_command(u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world(),c)
 import ue_runtime_v162,ue_mirror_v162,ue_room_media_v163b
 if ue_runtime_v162.handle is not None:u.unregister_slate_post_tick_callback(ue_runtime_v162.handle)
 importlib.reload(ue_mirror_v162);importlib.reload(ue_room_media_v163b);importlib.reload(ue_runtime_v162).ensure_runtime()
 import ue_stream_v164
 importlib.reload(ue_stream_v164).ensure(refresh=True)
 (OUT/'runtime-applied.json').write_text(json.dumps({'quality':QUALITY,'sameEditor':True}))

def home():
 levels,actors,ed=context('/Game/V162/Courtyard');changed={}
 for a in actors.get_all_level_actors():
  label=a.get_actor_label()
  if label=='Courtyard broad warm key':a.light_component.set_light_color(u.LinearColor(1.,.84,.65,1));a.light_component.set_intensity(730.)
  if label=='Courtyard quiet stone return':a.light_component.set_light_color(u.LinearColor(.72,.82,1.,1));a.light_component.set_intensity(160.)
  if label=='Courtyard woodland soft light':a.light_component.set_light_color(u.LinearColor(.83,.90,1.,1));a.light_component.set_intensity(105.)
  if isinstance(a,u.SkyLight):a.light_component.set_intensity(.065)
  if isinstance(a,u.PostProcessVolume):
   s=a.get_editor_property('settings')
   for k,v in [('override_auto_exposure_bias',True),('auto_exposure_bias',-.55),('override_film_grain_intensity',True),('film_grain_intensity',0.),('override_bloom_intensity',True),('bloom_intensity',.035),('override_lumen_scene_lighting_quality',True),('lumen_scene_lighting_quality',2.),('override_lumen_final_gather_quality',True),('lumen_final_gather_quality',2.)]:s.set_editor_property(k,v)
   a.set_editor_property('settings',s)
  if not isinstance(a,u.StaticMeshActor):continue
  c=a.static_mesh_component
  for i in range(c.get_num_materials()):
   old=c.get_material(i)
   if not isinstance(old,u.MaterialInstanceConstant):continue
   name=old.get_name();low=name.lower()
   if not any(k in low for k in ['limestone','enamel','gold','brass','bronze']):continue
   if name not in changed:
    m=material('Home_'+name,old.get_path_name())
    if 'limestone'in low:
     mel.set_material_instance_vector_parameter_value(m,'BaseColorFactor',u.LinearColor(.58,.53,.43,1));mel.set_material_instance_scalar_parameter_value(m,'NormalScale',.25 if 'v149'in low or 'v152'in low else .035);mel.set_material_instance_scalar_parameter_value(m,'OcclusionStrength',.18);mel.set_material_instance_scalar_parameter_value(m,'RoughnessFactor',.79);mel.set_material_instance_scalar_parameter_value(m,'SpecularFactor',.22)
    elif 'enamel'in low:
     mel.set_material_instance_scalar_parameter_value(m,'RoughnessFactor',.36);mel.set_material_instance_scalar_parameter_value(m,'SpecularFactor',.48)
    else:
     mel.set_material_instance_scalar_parameter_value(m,'RoughnessFactor',.38);mel.set_material_instance_scalar_parameter_value(m,'NormalScale',.13)
    mel.update_material_instance(m);changed[name]=m
   c.set_material(i,changed[name])
 save(ed,'/Game/V162/Courtyard');runtime();(OUT/'home-art.json').write_text(json.dumps({'privateMaterials':list(changed),'neutralWarmKey':730,'coolFill':160,'geometryPreserved':True}))

def room():
 levels,actors,ed=context('/Game/V162/Studio');changed=[]
 # A single photograph is projected from one physical plane across the entire opening.
 # Imported distant cylinders are hidden to avoid a second copy behind each pane.
 photo=u.load_asset('/Game/V162Studio/berlin-night');m=material('OriginalCityWindow');mel.delete_all_material_expressions(m);m.set_editor_property('two_sided',True);m.set_editor_property('shading_model',u.MaterialShadingModel.MSM_UNLIT)
 wp=node(m,u.MaterialExpressionWorldPosition);uv=node(m,u.MaterialExpressionCustom);uv.set_editor_property('code','return float2(saturate((P.x+151.)/302.),saturate(1.-(P.z-97.)/156.)*.62+.19);');uv.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT2);ci=u.CustomInput();ci.set_editor_property('input_name','P');uv.set_editor_property('inputs',[ci]);mel.connect_material_expressions(wp,'',uv,'P')
 tex=node(m,u.MaterialExpressionTextureSample);tex.texture=photo;mel.connect_material_expressions(uv,'',tex,'UVs');gain=node(m,u.MaterialExpressionMultiply);gain.set_editor_property('const_b',1.25);mel.connect_material_expressions(tex,'',gain,'A');ex=node(m,u.MaterialExpressionEyeAdaptation);div=node(m,u.MaterialExpressionDivide);mel.connect_material_expressions(gain,'',div,'A');mel.connect_material_expressions(ex,'',div,'B');mel.connect_material_property(div,'',u.MaterialProperty.MP_EMISSIVE_COLOR);mel.recompile_material(m)
 for a in actors.get_all_level_actors():
  if not isinstance(a,u.StaticMeshActor):continue
  c=a.static_mesh_component;o,b=a.get_actor_bounds(False)
  if a.get_actor_label()=='V159 original night photograph inside window opening':c.set_material(0,m);continue
  if max(b.x,b.y,b.z)>1500 and any('Night'in(c.get_material(i).get_name()if c.get_material(i)else'')for i in range(c.get_num_materials())):c.set_visibility(False,True)
  # CD insert maps get full source resolution, stable diffuse printing and filtered micro normals.
  for i in range(c.get_num_materials()):
   old=c.get_material(i)
   if not isinstance(old,u.MaterialInstanceConstant):continue
   name=old.get_name()
   if name.startswith('CD_'):
    name=name[3:];old=u.load_asset('/Game/V162Studio/room-current/Materials/'+name);c.set_material(i,old)
   if name not in ['room-current_material_'+str(x)for x in [122,126,130,134,138]]:continue
   n=material('CD_'+name,old.get_path_name());mel.set_material_instance_scalar_parameter_value(n,'NormalScale',0.);mel.set_material_instance_scalar_parameter_value(n,'RoughnessFactor',.82);mel.set_material_instance_scalar_parameter_value(n,'SpecularFactor',.12);mel.set_material_instance_vector_parameter_value(n,'BaseColorFactor',u.LinearColor(1,1,1,1));t=mel.get_material_instance_texture_parameter_value(n,'BaseColorTexture')
   if t:t.set_editor_property('lod_bias',0);t.set_editor_property('never_stream',True);t.set_editor_property('max_texture_size',4096);u.EditorAssetLibrary.save_loaded_asset(t)
   mel.update_material_instance(n);c.set_material(i,n);changed.append({'actor':a.get_actor_label(),'material':name,'texture':t.get_path_name()if t else None})
 save(ed,'/Game/V162/Studio');(OUT/'room-art.json').write_text(json.dumps({'originalPhotographRetained':True,'oneContinuousProjection':True,'exposureIndependent':True,'cdSlots':changed},indent=2))

def myth():
 levels,actors,ed=context('/Game/Cove/FullCoveV162');all=actors.get_all_level_actors();changed=[]
 sea=material('CoastalLivingWater','/Game/V163/CoastalTideSea')
 for e in u.ObjectIterator(u.MaterialExpressionCustom):
  if e.get_outer()!=sea:continue
  code=e.get_editor_property('code')
  if '7.5*sin'in code:e.set_editor_property('code',code.replace('7.5*sin','12.0*sin').replace('2.3*sin','3.3*sin'))
  if 'float depth=max'in code:e.set_editor_property('code','float depth=max(0.,D.r-Z);float valid=step(1.,D.r)*step(D.r,45000.);float crest=24.+16.*sin(T*.7);float band=pow(saturate(1.-abs(depth-crest)/32.),2.)*valid;float pulse=.5+.5*sin(T*.7+P.x*.003+P.y*.002);float wash=band*(.3+.7*pulse)*.65;return float4(lerp(float3(.009,.045,.052),float3(.19,.23,.20),wash),.27+wash*.3);')
 # Dual broad normals remove the tiny bright specular points on the open ocean.
 wp=node(sea,u.MaterialExpressionWorldPosition);t=node(sea,u.MaterialExpressionScalarParameter);t.set_editor_property('parameter_name','NativeSeaTime');normal=node(sea,u.MaterialExpressionCustom);normal.set_editor_property('code','float a=(P.x-100.)/900.+(P.y-800.)/1100.+T*.7;float b=(P.x-100.)/430.+(P.y-800.)/850.+T*1.13;float dx=12./900.*cos(a)+3.3/430.*cos(b)+.035*sin(P.x*.013+P.y*.007+T*1.4);float dy=12./1100.*cos(a)+3.3/850.*cos(b)+.028*cos(P.y*.016-P.x*.006+T*1.1);return normalize(float3(-dx,-dy,1.));');normal.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);inputs=[]
 for k in ['P','T']:ci=u.CustomInput();ci.set_editor_property('input_name',k);inputs.append(ci)
 normal.set_editor_property('inputs',inputs);mel.connect_material_expressions(wp,'',normal,'P');mel.connect_material_expressions(t,'',normal,'T');mel.connect_material_property(normal,'',u.MaterialProperty.MP_NORMAL);sea.set_editor_property('tangent_space_normal',False);scalar(sea,u.MaterialProperty.MP_SPECULAR,.35)
 mel.recompile_material(sea)
 linen=material('QuietNaturalLinen','/Game/Cove/V147_NaturalLinen')
 scalar(linen,u.MaterialProperty.MP_SPECULAR,.10);scalar(linen,u.MaterialProperty.MP_ROUGHNESS,.97)
 ns=next((e for e in u.ObjectIterator(u.MaterialExpressionTextureSample)if e.get_outer()==linen and e.texture and 'Normal'in e.texture.get_name()),None)
 if ns:
  strength=node(linen,u.MaterialExpressionConstant3Vector);strength.constant=u.LinearColor(.12,.12,1,1);mul=node(linen,u.MaterialExpressionMultiply);mel.connect_material_expressions(ns,'',mul,'A');mel.connect_material_expressions(strength,'',mul,'B');mel.connect_material_property(mul,'',u.MaterialProperty.MP_NORMAL)
 # The actual woven sail bends at its free edge on the same pause-safe clock as sea and boat.
 p=node(linen,u.MaterialExpressionWorldPosition);sailtime=node(linen,u.MaterialExpressionScalarParameter);sailtime.set_editor_property('parameter_name','NativeWindTime');wind=node(linen,u.MaterialExpressionCustom);wind.set_editor_property('code','float free=saturate(abs(P.x-100.)/650.);return float3(0,free*(3.5*sin(T*1.15+P.x*.006+P.z*.004)+1.4*sin(T*2.2-P.z*.013)),0);');wind.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);inputs=[]
 for k in ['P','T']:ci=u.CustomInput();ci.set_editor_property('input_name',k);inputs.append(ci)
 wind.set_editor_property('inputs',inputs);mel.connect_material_expressions(p,'',wind,'P');mel.connect_material_expressions(sailtime,'',wind,'T');mel.connect_material_property(wind,'',u.MaterialProperty.MP_WORLD_POSITION_OFFSET);mel.recompile_material(linen)
 for a in all:
  if a.get_actor_label()=='Water foundation':a.static_mesh_component.set_material(0,sea)
  if a.get_actor_label()=='Vessel':
   c=a.static_mesh_component
   for i in range(c.get_num_materials()):
    m=c.get_material(i)
    if m and m.get_name()=='V147_NaturalLinen':c.set_material(i,linen);changed.append(i)
  if isinstance(a,u.ExponentialHeightFog):
   f=a.get_component_by_class(u.ExponentialHeightFogComponent)
   for k,v in [('fog_density',.018),('fog_height_falloff',.12),('start_distance',1800.),('fog_max_opacity',.72),('enable_volumetric_fog',True),('volumetric_fog_distance',45000.),('volumetric_fog_scattering_distribution',.45),('fog_inscattering_luminance',u.LinearColor(.19,.25,.28,1))]:f.set_editor_property(k,v)
  if isinstance(a,u.DirectionalLight)and a.light_component.intensity>1:a.light_component.set_editor_property('light_source_angle',1.8)
 if not any(isinstance(a,u.VolumetricCloud)for a in all):
  cloud=actors.spawn_actor_from_class(u.VolumetricCloud,u.Vector());cloud.set_actor_label('V164 maritime atmosphere clouds');c=cloud.get_component_by_class(u.VolumetricCloudComponent);c.set_editor_property('material',u.load_asset('/Engine/EngineSky/VolumetricClouds/m_SimpleVolumetricCloud_Inst'));c.set_editor_property('layer_bottom_altitude',1.5);c.set_editor_property('layer_height',2.0)
 save(ed,'/Game/Cove/FullCoveV162');runtime();(OUT/'myth-art.json').write_text(json.dumps({'islandGeometryAndMaterialsUnchanged':True,'sameWaveBoat':True,'waveCm':[12.,3.3],'sailSlots':changed,'nativeVolumetricClouds':True,'nativeVolumetricFog':True}))

def sea_finish():
 levels,actors,ed=context('/Game/Cove/FullCoveV162');all=actors.get_all_level_actors();m=u.load_asset('/Game/V164/CoastalLivingWater')
 # Interfere two filtered wave-normal fields, with the broader gravity-wave slope.
 wp=node(m,u.MaterialExpressionWorldPosition);time=node(m,u.MaterialExpressionScalarParameter);time.set_editor_property('parameter_name','NativeSeaTime');texture=node(m,u.MaterialExpressionTextureObject);texture.texture=u.load_asset('/Game/V162Island/waternormals')
 n=node(m,u.MaterialExpressionCustom);n.set_editor_property('code','float2 a=P.xy*.00085+float2(T*.007,T*.003);float2 b=P.xy*.0014+float2(-T*.005,T*.004);float3 x=Texture2DSample(Wave,WaveSampler,a).rgb*2.-1.;float3 y=Texture2DSample(Wave,WaveSampler,b).rgb*2.-1.;float q=(P.x-100.)/900.+(P.y-800.)/1100.+T*.7;float r=(P.x-100.)/430.+(P.y-800.)/850.+T*1.13;float2 slope=float2(12./900.*cos(q)+3.3/430.*cos(r),12./1100.*cos(q)+3.3/850.*cos(r));float fade=lerp(.08,.025,saturate(length(P.xy)/50000.));return normalize(float3((x.xy+y.xy*.7)*fade-slope,1.));');n.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);ci=[]
 for k in ['P','T','Wave']:v=u.CustomInput();v.set_editor_property('input_name',k);ci.append(v)
 n.set_editor_property('inputs',ci)
 for k,v in [('P',wp),('T',time),('Wave',texture)]:mel.connect_material_expressions(v,'',n,k)
 mel.connect_material_property(n,'',u.MaterialProperty.MP_NORMAL);scalar(m,u.MaterialProperty.MP_SPECULAR,.24);mel.recompile_material(m)
 # The old mesh ends at one kilometre. A lower continuous water surface carries the horizon to 20 km.
 if not any(a.get_actor_label()=='V164 distant continuous ocean'for a in all):
  a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector(0,0,-55));a.set_actor_label('V164 distant continuous ocean');a.static_mesh_component.set_static_mesh(u.load_asset('/Engine/BasicShapes/Plane'));a.set_actor_scale3d(u.Vector(40000,40000,1));a.static_mesh_component.set_material(0,m);a.static_mesh_component.set_cast_shadow(False)
 cloud=next(a for a in all if isinstance(a,u.VolumetricCloud));c=cloud.get_component_by_class(u.VolumetricCloudComponent);cm=material('MaritimeClouds','/Engine/EngineSky/VolumetricClouds/m_SimpleVolumetricCloud_Inst');mel.set_material_instance_scalar_parameter_value(cm,'Cloud_GlobalCoverage',.18);mel.update_material_instance(cm);values={str(k):mel.get_material_instance_scalar_parameter_value(cm,k)for k in mel.get_scalar_parameter_names(cm)};c.set_editor_property('material',cm)
 for command in ['r.VolumetricCloud 1','r.VolumetricFog 1','ShowFlag.Cloud 1','ShowFlag.VolumetricFog 1','ShowFlag.Fog 1','r.VolumetricCloud.ViewRaySampleMaxCount 64']:u.SystemLibrary.execute_console_command(ed.get_editor_world(),command)
 save(ed,'/Game/Cove/FullCoveV162');runtime();(OUT/'sea-finish.json').write_text(json.dumps({'normalLayers':2,'seaHorizonMetres':20000,'cloudParameters':values},indent=2))

def cloud():
 levels,actors,ed=context('/Game/Cove/FullCoveV162');m=u.load_asset('/Game/V164/MaritimeClouds');mel.set_material_instance_scalar_parameter_value(m,'Cloud_GlobalCoverage',.18);mel.update_material_instance(m)
 r={'cloudParameters':{str(k):mel.get_material_instance_scalar_parameter_value(m,k)for k in mel.get_scalar_parameter_names(m)},'sun':[],'fog':[]}
 for a in actors.get_all_level_actors():
  if a.get_actor_label()=='Visible real daylight HDR'and isinstance(a,u.StaticMeshActor):a.static_mesh_component.set_visibility(False,True);r['opaqueHDRDomeHidden']=True
  if isinstance(a,u.DirectionalLight):
   c=a.light_component;c.set_editor_property('atmosphere_sun_light',c.intensity>1);r['sun'].append({'label':a.get_actor_label(),'sun':c.get_editor_property('atmosphere_sun_light'),'rotation':str(a.get_actor_rotation())})
  if isinstance(a,u.ExponentialHeightFog):
   c=a.get_component_by_class(u.ExponentialHeightFogComponent);r['fog'].append({'location':str(a.get_actor_location()),'density':c.get_editor_property('fog_density'),'extinction':c.get_editor_property('volumetric_fog_extinction_scale')})
 for command in ['ShowFlag.Cloud 1','ShowFlag.VolumetricFog 1','ShowFlag.Atmosphere 1']:u.SystemLibrary.execute_console_command(ed.get_editor_world(),command)
 r['cvars']={n:u.SystemLibrary.get_console_variable_int_value(n)for n in ['r.VolumetricCloud','r.VolumetricFog','ShowFlag.Cloud','ShowFlag.Fog','ShowFlag.VolumetricFog']}
 (OUT/'atmosphere.json').write_text(json.dumps(r,indent=2))
 save(ed,'/Game/Cove/FullCoveV162')

def tide():
 levels,actors,ed=context('/Game/Cove/FullCoveV162');m=u.load_asset('/Game/V164/CoastalLivingWater')
 for e in u.ObjectIterator(u.MaterialExpressionCustom):
  if e.get_outer()!=m:continue
  code=e.get_editor_property('code');e.set_editor_property('code',code.replace('12.0*sin','16.0*sin').replace('3.3*sin','4.5*sin').replace('12./','16./').replace('3.3/','4.5/'))
 for a in actors.get_all_level_actors():
  if a.get_actor_label()=='Water foundation':a.set_actor_location(u.Vector(0,0,0),False,False)
  if a.get_actor_label()=='V164 distant continuous ocean':a.set_actor_location(u.Vector(0,0,-38),False,False)
 mel.recompile_material(m);save(ed,'/Game/Cove/FullCoveV162');runtime();(OUT/'tide.json').write_text(json.dumps({'waveCm':[16.,4.5],'meanSeaZcm':-17,'actualShoreIntersection':True,'boatUsesSameWave':True}))

def window_finish():
 levels,actors,ed=context('/Game/V162/Studio');m=u.load_asset('/Game/V164/OriginalCityWindow')
 for e in u.ObjectIterator(u.MaterialExpressionCustom):
  if e.get_outer()==m:e.set_editor_property('code','return float2(saturate((P.x+1800.)/3600.),saturate((1100.-P.z)/1800.));')
 mel.recompile_material(m)
 for a in actors.get_all_level_actors():
  if a.get_actor_label()=='V159 original night photograph inside window opening':a.set_actor_location(u.Vector(0,-2000,200),False,False);a.set_actor_scale3d(u.Vector(36,18,1))
 save(ed,'/Game/V162/Studio');(OUT/'window-finish.json').write_text(json.dumps({'originalPhotoRetained':True,'distanceMetres':20,'panesShareContinuousWorldProjection':True,'windowCameraCannotCrossBackdrop':True}))
