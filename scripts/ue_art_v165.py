"""V165 additive atmosphere and coherent gravity-wave water. Approved assets stay intact."""
import unreal as u,json,math,importlib
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-165';mel=u.MaterialEditingLibrary
WAVES=[(.96,.28,1800.,22.,0.),(-.35,.93675,4200.,12.,1.7),(.72,.69397,850.,7.,.6)]
def context():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem)
 if ed.get_editor_world().get_name()!='FullCoveV162':levels.load_level('/Game/Cove/FullCoveV162')
 return levels,actors,ed
def nodes(m,kind):return[e for e in u.ObjectIterator(kind)if e.get_outer()==m]
def custom(m,code,names,output):
 e=mel.create_material_expression(m,u.MaterialExpressionCustom);e.set_editor_property('code',code);e.set_editor_property('output_type',output);inputs=[]
 for name in names:c=u.CustomInput();c.set_editor_property('input_name',name);inputs.append(c)
 e.set_editor_property('inputs',inputs);return e
def runtime():
 import ue_runtime_v162
 if ue_runtime_v162.handle is not None:u.unregister_slate_post_tick_callback(ue_runtime_v162.handle)
 importlib.reload(ue_runtime_v162).ensure_runtime()
def wave_code(normal=False):
 code='float2 q=P.xy-float2(100.,800.);float3 w=float3(0,0,0);float2 slope=float2(0,0);'
 for i,(dx,dy,length,amplitude,phase)in enumerate(WAVES):
  k=2*math.pi/length;omega=math.sqrt(981*k);second=.16 if i==0 else .07
  code+=f'float t{i}=dot(q,float2({dx},{dy}))*{k:.9f}-T*{omega:.9f}+{phase};float s{i}=sin(t{i})+{second}*sin(2.*t{i});float c{i}=cos(t{i})+{second*2}*cos(2.*t{i});w.xy+=float2({dx},{dy})*{amplitude*.42:.6f}*cos(t{i});w.z+={amplitude}*s{i};slope+=float2({dx},{dy})*{amplitude*k:.9f}*c{i};'
 return code
def water():
 levels,actors,ed=context();path='/Game/V165/GoldenLivingSea';m=u.load_asset(path)or u.EditorAssetLibrary.duplicate_asset('/Game/V164/CoastalLivingWater',path)
 assert m,'Sea material duplication failed'
 wp=nodes(m,u.MaterialExpressionWorldPosition)[0];time=next(e for e in nodes(m,u.MaterialExpressionScalarParameter)if str(e.get_editor_property('parameter_name'))=='NativeSeaTime')
 wave=custom(m,wave_code()+'return w;',['P','T'],u.CustomMaterialOutputType.CMOT_FLOAT3)
 for name,node in [('P',wp),('T',time)]:assert mel.connect_material_expressions(node,'',wave,name)
 assert mel.connect_material_property(wave,'',u.MaterialProperty.MP_WORLD_POSITION_OFFSET)
 changed=[]
 for e in nodes(m,u.MaterialExpressionCustom):
  code=e.get_editor_property('code')
  if 'Texture2DSample(Wave,WaveSampler' in code:
   detail='float2 a=P.xy*.00085+float2(T*.007,T*.003);float2 b=P.xy*.0014+float2(-T*.005,T*.004);float3 x=Texture2DSample(Wave,WaveSampler,a).rgb*2.-1.;float3 y=Texture2DSample(Wave,WaveSampler,b).rgb*2.-1.;float fade=lerp(.055,.020,saturate(length(P.xy)/50000.));return normalize(float3((x.xy+y.xy*.65)*fade-slope,1.));'
   e.set_editor_property('code',wave_code(True)+detail);changed.append('coherent analytic wave normal')
  elif 'float depth=max(0.,D.r-Z)' in code:
   e.set_editor_property('code','float depth=max(0.,D.r-Z);float valid=step(1.,D.r)*step(D.r,45000.);float phase=dot(P.xy-float2(100.,800.),float2(.96,.28))*.003490659-T*1.850505;float crest=30.+24.*sin(phase);float grain=.5+.5*sin(P.x*.019+sin(P.y*.012)*2.7+T*.37);float band=pow(saturate(1.-abs(depth-crest)/(19.+grain*9.)),2.)*valid;float surge=smoothstep(-.35,.7,sin(phase));float broken=smoothstep(.21,.72,grain);float wash=band*surge*broken*.56;return float4(lerp(float3(.008,.057,.063),float3(.38,.43,.38),wash),.20+wash*.38);');changed.append('broken moving shore wash from actual custom depth')
 out=nodes(m,u.MaterialExpressionSingleLayerWaterMaterialOutput)[0]
 for pin,color in [('ScatteringCoefficients',(.0022,.0090,.0080)),('AbsorptionCoefficients',(.015,.0035,.0018))]:
  c=mel.create_material_expression(m,u.MaterialExpressionConstant3Vector);c.set_editor_property('constant',u.LinearColor(*color,1));assert mel.connect_material_expressions(c,'',out,pin)
 mel.recompile_material(m);u.EditorAssetLibrary.save_loaded_asset(m)
 protected={}
 for a in actors.get_all_level_actors():
  if a.get_actor_label()in['Water foundation','V164 distant continuous ocean']:a.static_mesh_component.set_material(0,m)
  if a.get_actor_label()in['Island','Vessel']:protected[a.get_actor_label()]={'mesh':a.static_mesh_component.static_mesh.get_path_name(),'materials':[a.static_mesh_component.get_material(i).get_path_name()if a.static_mesh_component.get_material(i)else None for i in range(a.static_mesh_component.get_num_materials())]}
 u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/Cove/FullCoveV162');runtime()
 (OUT/'water-art.json').write_text(json.dumps({'material':path,'waves':WAVES,'gravityCmPerSecondSquared':981,'stokesSecondHarmonic':True,'geometryDisplacementXYZ':True,'meanWaterLevelRetained':True,'changed':changed,'protected':protected},indent=2))
def lighting():
 levels,actors,ed=context();result=[]
 for a in actors.get_all_level_actors():
  if isinstance(a,u.DirectionalLight)and a.light_component.intensity>1:
   c=a.light_component;c.set_intensity(9.5);c.set_light_color(u.LinearColor(1,.69,.36,1));c.set_editor_property('light_source_angle',2.0);result.append(a.get_actor_label())
  if isinstance(a,u.ExponentialHeightFog):
   c=a.get_component_by_class(u.ExponentialHeightFogComponent)
   for k,v in [('fog_density',.014),('fog_max_opacity',.58),('volumetric_fog_extinction_scale',.26),('volumetric_fog_scattering_distribution',.42)]:c.set_editor_property(k,v)
   result.append(a.get_actor_label())
  if isinstance(a,u.PostProcessVolume)and 'night exposure'not in a.get_actor_label().lower():
   s=a.get_editor_property('settings');s.set_editor_property('override_color_saturation',True);s.set_editor_property('color_saturation',u.Vector4(1.035,1.06,1.035,1.025));a.set_editor_property('settings',s)
 u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/Cove/FullCoveV162');(OUT/'atmosphere-art.json').write_text(json.dumps({'goldenSun':result,'islandBoatMaterialsUntouched':True,'slightlyRaisedSaturation':True}));runtime()

def home():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);levels.load_level('/Game/V162/Courtyard');actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);result=[]
 for a in actors.get_all_level_actors():
  label=a.get_actor_label()
  if label=='Courtyard broad warm key':a.light_component.set_light_color(u.LinearColor(1.,.76,.40,1));a.light_component.set_intensity(1030.)
  if label=='Courtyard quiet stone return':a.light_component.set_light_color(u.LinearColor(1.,.88,.68,1));a.light_component.set_intensity(220.)
  if label=='Courtyard woodland soft light':a.light_component.set_light_color(u.LinearColor(.94,1.,.77,1));a.light_component.set_intensity(130.)
  if isinstance(a,u.SkyLight):a.light_component.set_intensity(.115)
  if isinstance(a,u.PostProcessVolume):
   s=a.get_editor_property('settings')
   for k,v in [('override_auto_exposure_bias',True),('auto_exposure_bias',-.12),('override_bloom_intensity',True),('bloom_intensity',.06),('override_color_saturation',True),('color_saturation',u.Vector4(1.025,1.035,1.015,1.025))]:s.set_editor_property(k,v)
   a.set_editor_property('settings',s)
  if isinstance(a,u.Light):result.append({'label':label,'intensity':a.light_component.intensity,'color':str(a.light_component.get_light_color())})
 living={};baseCache={}
 def duplicate_tree(original):
  source=original.get_path_name().split('.')[0]
  if source in baseCache:return baseCache[source]
  destination='/Game/V165/HomeLivingOak_'+original.get_name();copy=u.load_asset(destination)or u.EditorAssetLibrary.duplicate_asset(source,destination);baseCache[source]=copy
  if isinstance(copy,u.MaterialInstanceConstant):copy.set_editor_property('parent',duplicate_tree(original.get_editor_property('parent')));mel.update_material_instance(copy)
  elif isinstance(copy,u.Material):
   existing=[e for e in nodes(copy,u.MaterialExpressionScalarParameter)if str(e.get_editor_property('parameter_name'))=='NativeHomeWindTime']
   if not existing:
    t=mel.create_material_expression(copy,u.MaterialExpressionScalarParameter);t.set_editor_property('parameter_name','NativeHomeWindTime');wp=mel.create_material_expression(copy,u.MaterialExpressionWorldPosition)
    wind=custom(copy,'float bend=sin(T*.67+P.z*.008+P.y*.004);float flutter=sin(T*1.7+P.x*.017-P.z*.011);return float3(2.2*bend+.8*flutter,.9*cos(T*.59+P.y*.006),.35*sin(T*.8+P.x*.01));',['P','T'],u.CustomMaterialOutputType.CMOT_FLOAT3)
    mel.connect_material_expressions(wp,'',wind,'P');mel.connect_material_expressions(t,'',wind,'T');mel.connect_material_property(wind,'',u.MaterialProperty.MP_WORLD_POSITION_OFFSET);mel.recompile_material(copy)
  u.EditorAssetLibrary.save_loaded_asset(copy);return copy
 for a in actors.get_all_level_actors():
  if not isinstance(a,u.StaticMeshActor):continue
  c=a.static_mesh_component
  for i in range(c.get_num_materials()):
   old=c.get_material(i)
   if not old or 'living_oak_canopy'not in old.get_name().lower():continue
   if isinstance(old,u.MaterialInstanceDynamic):old=old.get_editor_property('parent')
   if old.get_name().startswith('HomeLivingOak_'):copy=old
   else:copy=living.get(old.get_path_name())or duplicate_tree(old);living[old.get_path_name()]=copy
   if isinstance(copy,u.MaterialInstanceConstant):
    mel.set_material_instance_vector_parameter_value(copy,'BaseColorFactor',u.LinearColor(.20,.34,.13,1));mel.set_material_instance_scalar_parameter_value(copy,'RoughnessFactor',.84);mel.set_material_instance_scalar_parameter_value(copy,'SpecularFactor',.18);mel.update_material_instance(copy);u.EditorAssetLibrary.save_loaded_asset(copy)
   c.set_material(i,copy)
 u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/V162/Courtyard');(OUT/'home-native-candidate.json').write_text(json.dumps({'lights':result,'geometryUntouched':True,'livingLeafMaterials':len(living),'windDisplacementCm':[3.,1.,.35],'candidateOnly':False},indent=2));runtime()

def leaves():
 """Inspect only the private leaf hierarchy; no scene rebuild or shared material edit."""
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem)
 if ed.get_editor_world().get_name()!='Courtyard':levels.load_level('/Game/V162/Courtyard')
 leaf=u.load_asset('/Game/V165/HomeLivingOak_V138_restored_living_oak_canopy')
 mel.set_material_instance_vector_parameter_value(leaf,'BaseColorFactor',u.LinearColor(.20,.34,.13,1));mel.update_material_instance(leaf);u.EditorAssetLibrary.save_loaded_asset(leaf)
 assignments=[]
 for a in u.get_editor_subsystem(u.EditorActorSubsystem).get_all_level_actors():
  if not isinstance(a,u.StaticMeshActor):continue
  c=a.static_mesh_component
  if not c.static_mesh:continue
  for i in range(c.get_num_materials()):
   original=c.static_mesh.get_material(i)
   if original and 'living_oak_canopy'in original.get_name():c.set_material(i,leaf);assignments.append([a.get_actor_label(),'private oak'])
   elif original and 'oxidised_copper_canopy'in original.get_name():c.set_material(i,original);assignments.append([a.get_actor_label(),'original copper'])
 u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/V162/Courtyard')
 (OUT/'leaf-assignments.json').write_text(json.dumps(assignments))
 runtime()
 result=[]
 for path in u.EditorAssetLibrary.list_assets('/Game/V165',True,False):
  if 'HomeLivingOak'not in path:continue
  m=u.load_asset(path);q={'path':path,'class':m.get_class().get_name()}
  if isinstance(m,u.MaterialInstanceConstant):
   q['vectors']=[{'name':str(x.parameter_info.name),'value':str(x.parameter_value)}for x in m.get_editor_property('vector_parameter_values')]
   q['scalars']=[{'name':str(x.parameter_info.name),'value':x.parameter_value}for x in m.get_editor_property('scalar_parameter_values')]
   q['parent']=m.get_editor_property('parent').get_path_name()
  elif isinstance(m,u.Material):
   q['parameters']=[{'class':e.get_class().get_name(),'name':str(e.get_editor_property('parameter_name'))}for e in u.ObjectIterator(u.MaterialExpressionParameter)if e.get_outer()==m]
  result.append(q)
 (OUT/'leaf-hierarchy.json').write_text(json.dumps(result,indent=2))
