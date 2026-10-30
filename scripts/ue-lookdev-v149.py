"""Scoped native look development; preserves V147 map/assets, stays alive for streaming."""
from pathlib import Path
P=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype')
exec((P/'scripts/ue-lookdev-v146.py').read_text(encoding='utf-8').split('try:\n u.SystemLibrary.execute_console_command')[0])
import math
V=P/'.verify/v32-149';V.mkdir(exist_ok=True)
report={'stage':'lookdev starting','errors':[],'sourceMap':'/Game/Cove/FullCoveV147','nativeMap':'/Game/Cove/FullCoveV149'}
ed=u.get_editor_subsystem(u.UnrealEditorSubsystem)
u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV147')
world=ed.get_editor_world()
u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV149')
def note(): (V/'ue-live.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
def node(m,cl):return mel.create_material_expression(m,cl)
def const(m,val):
 n=node(m,u.MaterialExpressionConstant);n.r=val;return n
def col(m,val):
 n=node(m,u.MaterialExpressionConstant3Vector);n.constant=u.LinearColor(*val,1);return n
def custom(m,code,ins,out=3):
 n=node(m,u.MaterialExpressionCustom);n.set_editor_property('code',code);n.set_editor_property('output_type',{1:u.CustomMaterialOutputType.CMOT_FLOAT1,2:u.CustomMaterialOutputType.CMOT_FLOAT2,3:u.CustomMaterialOutputType.CMOT_FLOAT3}[out])
 ci=[]
 for k in ins:
  entry=u.CustomInput();entry.set_editor_property('input_name',k);ci.append(entry)
 n.set_editor_property('inputs',ci)
 for k,v in ins.items():assert mel.connect_material_expressions(v[0],v[1],n,k),k
 return n
def fresh(name):
 path='/Game/Cove/'+name
 m=assets.load_asset(path) if assets.does_asset_exist(path) else tools.create_asset(name,'/Game/Cove',u.Material,u.MaterialFactoryNew())
 mel.delete_all_material_expressions(m);return m
def obj(m,path):
 n=node(m,u.MaterialExpressionTextureObject);n.texture=assets.load_asset(path);return n
def finish(m):mel.recompile_material(m);assets.save_loaded_asset(m);return m
try:
 allActors=actors.get_all_level_actors();byName={a.get_actor_label():a for a in allActors}
 inventory=[]
 for a in allActors:
  if isinstance(a,u.StaticMeshActor):
   inventory.append({'label':a.get_actor_label(),'mesh':str(a.static_mesh_component.static_mesh.get_path_name()),'slots':[str(s.material_slot_name) for s in a.static_mesh_component.static_mesh.get_editor_property('static_materials')],'materials':[a.static_mesh_component.get_material(i).get_path_name() if a.static_mesh_component.get_material(i) else None for i in range(a.static_mesh_component.get_num_materials())],'bounds':str(a.get_actor_bounds(False))})
 (V/'ue-inventory.json').write_text(json.dumps(inventory,indent=2),encoding='utf-8')
 # Real scanned limestone is projected in three world planes on the old cliff.
 # The shore loses the UV grid, while high ground gets mottled olive earth.
 m=fresh('V149_TriplanarCoast');wp=node(m,u.MaterialExpressionWorldPosition);normal=node(m,u.MaterialExpressionVertexNormalWS)
 ins={'P':(wp,''),'N':(normal,''),'Rock':(obj(m,'/Game/Cove/V147_coastal_cliff_02_Color'),''),'Sand':(obj(m,'/Game/Cove/V147_Sand_Color'),''),'Soil':(obj(m,'/Game/Cove/V147_Soil_Color'),'')}
 code='''float3 w=pow(abs(N),4);w/=max(w.x+w.y+w.z,0.001);
 float3 p=P/430;
 float3 r=Texture2DSample(Rock,RockSampler,p.yz).rgb*w.x+Texture2DSample(Rock,RockSampler,p.xz).rgb*w.y+Texture2DSample(Rock,RockSampler,p.xy).rgb*w.z;
 float3 s=Texture2DSample(Sand,SandSampler,P.xy/520).rgb;
 float3 s2=Texture2DSample(Sand,SandSampler,float2(P.x+P.y,-P.x+P.y)/830+0.37).rgb;
 s=lerp(s,s2,0.48)*float3(0.79,0.76,0.66);
 float macro=0.5+0.22*sin(P.x/940+sin(P.y/710))+0.12*sin(P.y/237+P.x/343);
 float3 soil=Texture2DSample(Soil,SoilSampler,P.xy/590).rgb;
 float3 upland=lerp(soil*float3(0.62,0.71,0.39),float3(0.135,0.155,0.063),0.32+macro*0.2);
 float above=smoothstep(100,390,P.z+macro*65);
 float3 base=lerp(s,upland,above);
 float slope=smoothstep(0.23,0.58,1-abs(N.z));
 return lerp(base,r*float3(0.83,0.81,0.72),slope);'''
 c=custom(m,code,ins);mel.connect_material_property(c,'',u.MaterialProperty.MP_BASE_COLOR)
 mel.connect_material_property(const(m,.92),'',u.MaterialProperty.MP_ROUGHNESS)
 # Actual scanned relief read as a world-space normal, avoiding the sand grid.
 rn=obj(m,'/Game/Cove/V147_coastal_cliff_02_Normal')
 nc=custom(m,'''float3 w=pow(abs(N),4);w/=max(w.x+w.y+w.z,0.001);float3 p=P/430;
 float3 nx=Texture2DSample(RockN,RockNSampler,p.yz).rgb*2-1;
 float3 ny=Texture2DSample(RockN,RockNSampler,p.xz).rgb*2-1;
 float3 nz=Texture2DSample(RockN,RockNSampler,p.xy).rgb*2-1;
 float3 nn=normalize(float3(nx.z*sign(N.x),nx.x,nx.y)*w.x+float3(ny.x,ny.z*sign(N.y),ny.y)*w.y+float3(nz.x,nz.y,nz.z*sign(N.z))*w.z);
 return normalize(lerp(N,nn,0.44));''',{'P':(wp,''),'N':(normal,''),'RockN':(rn,'')})
 m.set_editor_property('tangent_space_normal',False);mel.connect_material_property(nc,'',u.MaterialProperty.MP_NORMAL);finish(m);byName['Island'].static_mesh_component.set_material(0,m)
 # Slate-green deep water, broad swells, smaller moving wind texture.
 m=fresh('V149_DeepSea');wp=node(m,u.MaterialExpressionWorldPosition);tm=node(m,u.MaterialExpressionTime);nt=obj(m,'/Game/Cove/V147_Sea_Normal')
 ins={'P':(wp,''),'T':(tm,''),'WaterN':(nt,'')}
 nc=custom(m,'''float2 uv=P.xy/920;uv+=float2(T*0.012,T*0.004);
 float3 a=Texture2DSample(WaterN,WaterNSampler,uv).rgb*2-1;
 float3 b=Texture2DSample(WaterN,WaterNSampler,float2(P.x-P.y,P.x+P.y)/250+float2(-T*0.016,T*0.007)).rgb*2-1;
 float2 broad=float2(cos(P.x/1200+P.y/2100+T*0.52)*0.11,cos(P.y/890-P.x/1700+T*0.39)*0.08);
 return normalize(float3(a.xy*0.35+b.xy*0.14+broad,1));''',ins)
 mel.connect_material_property(nc,'',u.MaterialProperty.MP_NORMAL)
 color=custom(m,'''float macro=0.5+0.3*sin(P.x/5500+sin(P.y/7200))+0.15*sin(P.y/3300);
 return lerp(float3(0.009,0.024,0.029),float3(0.024,0.053,0.051),saturate(macro));''',{'P':(wp,'')})
 mel.connect_material_property(color,'',u.MaterialProperty.MP_BASE_COLOR);mel.connect_material_property(const(m,.29),'',u.MaterialProperty.MP_ROUGHNESS);mel.connect_material_property(const(m,.42),'',u.MaterialProperty.MP_SPECULAR);finish(m);byName['Water foundation'].static_mesh_component.set_material(0,m)
 # Make the large scale coast read in warm raking light, retaining a cool fill.
 for a in allActors:
  if isinstance(a,u.DirectionalLight):
   a.set_actor_rotation(u.Rotator(pitch=-21,yaw=-118,roll=0),False);lc=a.light_component;lc.set_intensity(12.);lc.set_light_color(u.LinearColor(1.0,.79,.52,1));lc.set_editor_property('volumetric_scattering_intensity',1.3);lc.set_editor_property('cast_volumetric_shadow',True);lc.set_editor_property('light_source_angle',1.6)
  if isinstance(a,u.SkyLight):a.light_component.set_intensity(1.85)
  if isinstance(a,u.PostProcessVolume):
   settings=a.get_editor_property('settings')
   for k,v in [('override_auto_exposure_bias',True),('auto_exposure_bias',.3),('override_color_saturation',True),('color_saturation',u.Vector4(.93,.93,.93,1)),('override_bloom_intensity',True),('bloom_intensity',.16),('override_motion_blur_amount',True),('motion_blur_amount',0.)]:settings.set_editor_property(k,v)
   a.set_editor_property('settings',settings)
 fog=actors.spawn_actor_from_class(u.ExponentialHeightFog,u.Vector(0,0,-250));fog.set_actor_label('V149 Sea haze and warm shafts');fc=fog.get_component_by_class(u.ExponentialHeightFogComponent)
 fc.set_fog_density(.009);fc.set_fog_height_falloff(.32);fc.set_fog_max_opacity(.65);fc.set_start_distance(1300);fc.set_fog_inscattering_color(u.LinearColor(.36,.42,.43,1));fc.set_directional_inscattering_color(u.LinearColor(.65,.47,.25,1));fc.set_editor_property('enable_volumetric_fog',True);fc.set_editor_property('volumetric_fog_scattering_distribution',.5);fc.set_editor_property('volumetric_fog_extinction_scale',.65);fc.set_editor_property('volumetric_fog_distance',35000.)
 # Leaves retain their exact alpha mask and acquire transmitted warm sunlight.
 old=assets.load_asset('/Game/Cove/V147_ExplicitLeafMask');leaf=assets.duplicate_asset(old.get_path_name(),'/Game/Cove/V149_TranslucentLeaves') if not assets.does_asset_exist('/Game/Cove/V149_TranslucentLeaves') else assets.load_asset('/Game/Cove/V149_TranslucentLeaves')
 leaf.set_editor_property('shading_model',u.MaterialShadingModel.MSM_TWO_SIDED_FOLIAGE);base=mel.get_material_property_input_node(leaf,u.MaterialProperty.MP_BASE_COLOR);mnode=node(leaf,u.MaterialExpressionMultiply);mel.connect_material_expressions(base,'RGB',mnode,'A');mel.connect_material_expressions(col(leaf,(.38,.49,.19)),'',mnode,'B');mel.connect_material_property(mnode,'',u.MaterialProperty.MP_SUBSURFACE_COLOR);finish(leaf)
 for a in allActors:
  if isinstance(a,u.StaticMeshActor):
   for i in range(a.static_mesh_component.get_num_materials()):
    if a.static_mesh_component.get_material(i)==old:a.static_mesh_component.set_material(i,leaf)
 # Existing authored materials get physical roughness/normal detail only on their intended slots.
 cottage=byName['Cottage'];slots=cottage.static_mesh_component.static_mesh.get_editor_property('static_materials')
 for i,s in enumerate(slots):
  name=str(s.material_slot_name).lower()
  if 'limestone' in name or 'limewash' in name:
   mm=fresh('V149_CottageLime_'+str(i));wp2=node(mm,u.MaterialExpressionWorldPosition);norm2=node(mm,u.MaterialExpressionVertexNormalWS);rock=obj(mm,'/Game/Cove/V147_coastal_cliff_02_Color')
   cc=custom(mm,'''float3 w=pow(abs(N),4);w/=max(w.x+w.y+w.z,0.001);float3 c=Texture2DSample(R,RSampler,P.yz/190).rgb*w.x+Texture2DSample(R,RSampler,P.xz/190).rgb*w.y+Texture2DSample(R,RSampler,P.xy/190).rgb*w.z;return lerp(c*float3(.80,.76,.62),float3(.53,.48,.36),.6);''',{'P':(wp2,''),'N':(norm2,''),'R':(rock,'')});mel.connect_material_property(cc,'',u.MaterialProperty.MP_BASE_COLOR);mel.connect_material_property(const(mm,.94),'',u.MaterialProperty.MP_ROUGHNESS);finish(mm);cottage.static_mesh_component.set_material(i,mm)
 cams={a.get_actor_label():a for a in allActors if isinstance(a,u.CineCameraActor)};cam=cams['Full cove'];shore=cams['Rock shore']
 for cc in cams.values():
  if 'settings' in globals():cc.get_cine_camera_component().set_editor_property('post_process_settings',settings)
 ed.set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation())
 for command in ['r.DepthOfFieldQuality 0','r.MotionBlurQuality 0','r.Streaming.PoolSize 2300','r.Streaming.FullyLoadUsedTextures 1','r.ScreenPercentage 85','r.AntiAliasingMethod 4','r.VolumetricFog.GridPixelSize 12','t.MaxFPS 40']:
  u.SystemLibrary.execute_console_command(world,command)
 assets.save_directory('/Game/Cove');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV149');report.update(stage='saved local lookdev, waiting shader warmup',actors=len(actors.get_all_level_actors()));note()
except Exception:
 report['failure']=traceback.format_exc();note();u.log_error(report['failure'])

start=time.monotonic();phase=0;lastCommand=None;lastPoll=0;handle=None
def tick149(dt):
 global phase,lastCommand,lastPoll
 t=time.monotonic()-start
 try:
  if phase==0 and t>45 and 'cam' in globals():
   u.AutomationLibrary.take_high_res_screenshot(2560,1440,str(V/'ue-cove-lookdev.png'),camera=cam);phase=1;report['stage']='first lookdev capture requested';note()
  elif phase==1 and t>65:
   ed.set_level_viewport_camera_info(shore.get_actor_location(),shore.get_actor_rotation());phase=2
  elif phase==2 and t>85:
   u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V/'ue-shore-lookdev.png'),camera=shore);phase=3
  elif phase==3 and t>100:
   ed.set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation());phase=4;report['stage']='lookdev captures ready / live bridge';note()
  if t-lastPoll>.25:
   lastPoll=t;command=V/'ue-command.json'
   if command.exists():
    stamp=command.stat().st_mtime_ns
    if stamp!=lastCommand:
     lastCommand=stamp;job=json.loads(command.read_text(encoding='utf-8-sig'));sp=(P/job['script']).resolve()
     if not str(sp).startswith(str(P/'scripts')):raise RuntimeError('Script must be within project scripts')
     exec(compile(sp.read_text(encoding='utf-8'),str(sp),'exec'),globals());report['lastCommand']=job;report['lastCommandOK']=True;note()
 except Exception:
  report['commandError']=traceback.format_exc();note();u.log_error(report['commandError'])
handle=u.register_slate_post_tick_callback(tick149)
