"""Single continuous ocean and waterline-fitted ship; shares the existing SeaClock."""
from pathlib import Path
import unreal as u,json,time,math
P=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');V153=P/'.verify/v32-153';V153.mkdir(exist_ok=True);assets=u.get_editor_subsystem(u.EditorAssetSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=ed.get_editor_world();label153={a.get_actor_label():a for a in actors.get_all_level_actors()}
for handleName153 in ['motionHandle152','oceanHandle153']:
 if handleName153 in globals():
  try:u.unregister_slate_post_tick_callback(globals()[handleName153])
  except Exception:pass
sea153=label153.get('V153 Continuous geometric sea')
if sea153 is None:sea153=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector());sea153.set_actor_label('V153 Continuous geometric sea')
sea153.static_mesh_component.set_static_mesh(assets.load_asset('/Game/Cove/V153ContinuousOcean'));sea153.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE);sea153.static_mesh_component.set_material(0,assets.load_asset('/Game/Cove/V153_ContinuousDeepSea'));sea153.static_mesh_component.set_editor_property('cast_shadow',False);sea153.set_is_temporarily_hidden_in_editor(False);sea153.set_actor_hidden_in_game(False);seaMID149=sea153.static_mesh_component.create_dynamic_material_instance(0)
for name in ['Water foundation','V152 Moving sea patch']:
 aa=label153.get(name)
 if aa:aa.set_is_temporarily_hidden_in_editor(True);aa.set_actor_hidden_in_game(True)
waterline153=json.loads((P/'assets/odyssey/runtime-v153/waterline.json').read_text(encoding='utf-8'));cx153,cy153=waterline153['centerXYcm'];pivot153=u.Vector(cx153,cy153,waterline153['seaZcm']);halfL153=waterline153['lengthCm']*.40;halfB153=waterline153['beamCm']*.40
if 'rigBase153' not in globals():rigBase153=globals().get('rigBase152',[(label153[n],label153[n].get_actor_location(),label153[n].get_actor_rotation()) for n in ['Vessel','Crew']])
for a,base,rotation in rigBase153:a.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE)
birds153=[]
for i in range(4):
 aa=label153.get('V152 Distant gull '+str(i))
 if aa:birds153.append((aa,aa.static_mesh_component.create_dynamic_material_instance(0),i));birds153[-1][1].set_scalar_parameter_value('BirdPhase',i*1.9)
fogActor153=next((a for a in actors.get_all_level_actors() if isinstance(a,u.ExponentialHeightFog)),None);fog153=fogActor153.get_component_by_class(u.ExponentialHeightFogComponent) if fogActor153 else None
if fog153:
 if 'fogBefore153' not in globals():fogBefore153={k:fog153.get_editor_property(k) for k in ['fog_density','fog_height_falloff','start_distance','fog_max_opacity','volumetric_fog_extinction_scale','volumetric_fog_distance','volumetric_fog_scattering_distribution']}
 fog153.set_fog_density(.008);fog153.set_fog_height_falloff(.16);fog153.set_start_distance(9000);fog153.set_fog_max_opacity(.5);fog153.set_editor_property('enable_volumetric_fog',True);fog153.set_editor_property('volumetric_fog_extinction_scale',.35);fog153.set_editor_property('volumetric_fog_distance',45000.);fog153.set_editor_property('volumetric_fog_scattering_distribution',.4)
level153=u.get_editor_subsystem(u.LevelEditorSubsystem);level153.editor_set_game_view(True);actors.clear_actor_selection_set();oceanFrames153=0;oceanLast153=0.;fogNight153=None
def wh153(x,y,t):
 r=math.hypot(x,y);f=1. if r<=8500 else 0. if r>=16000 else 1-((r-8500)/7500)**2*(3-2*(r-8500)/7500)
 return (18*math.sin((x*.6+y*.8)/180+t*.83)+10*math.sin((x*.94-y*.34)/420-t*.61))*f
def oceanTick153(dt):
 global oceanFrames153,oceanLast153,fogNight153
 t=float(globals().get('seaClock149',0.));samples=[]
 for x in [-halfL153,0.,halfL153]:
  for y in [-halfB153,halfB153]:samples.append(wh153(cx153+x,cy153+y,t))
 heave=sum(samples)/6;pitch=math.degrees(math.atan2((samples[4]+samples[5]-samples[0]-samples[1])/2,halfL153*2));roll=-math.degrees(math.atan2((samples[1]+samples[3]+samples[5]-samples[0]-samples[2]-samples[4])/3,halfB153*2))
 for a,base,rotation in rigBase153:
  rel=base-pivot153;rotated=u.MathLibrary.rotate_angle_axis(rel,-pitch,u.Vector(0,1,0));rotated=u.MathLibrary.rotate_angle_axis(rotated,roll,u.Vector(1,0,0));a.set_actor_location(pivot153+rotated+u.Vector(0,0,heave),False,False);a.set_actor_rotation(u.Rotator(pitch=rotation.pitch+pitch,yaw=rotation.yaw,roll=rotation.roll+roll),False)
 for a,mi,i in birds153:
  ph=t*.035+i*1.2;a.set_actor_location(u.Vector(-6500+2600*math.cos(ph),-900+1500*math.sin(ph),2300+260*math.sin(ph*.8+i)),False,False);a.set_actor_rotation(u.Rotator(pitch=3*math.sin(ph+i),yaw=math.degrees(math.atan2(1500*math.cos(ph),-2600*math.sin(ph)))-90,roll=-10*math.sin(ph+i)),False);mi.set_scalar_parameter_value('SeaClock',t)
 night=bool(globals().get('night149',False))
 if fog153 and night!=fogNight153:
  fogNight153=night;fog153.set_fog_inscattering_color(u.LinearColor(.045,.06,.09,1) if night else u.LinearColor(.25,.29,.30,1));fog153.set_directional_inscattering_color(u.LinearColor(.04,.06,.10,1) if night else u.LinearColor(.55,.39,.22,1))
 if fog153:fog153.set_fog_density(.008*(1+.035*math.sin(t*.055)))
 oceanFrames153+=1;now=time.monotonic()
 if now-oceanLast153>1:
  oceanLast153=now;obj={'waterTime':t,'paused':bool(globals().get('paused149',False)),'night':night,'heaveCm':heave,'pitchDegrees':pitch,'rollDegrees':roll,'sampleHeightsCm':samples,'waterlineCenterCm':[cx153,cy153,-17],'waterlineLengthBeamCm':[waterline153['lengthCm'],waterline153['beamCm']],'rigLocations':[[a.get_actor_location().x,a.get_actor_location().y,a.get_actor_location().z] for a,_,_ in rigBase153],'bird0':[birds153[0][0].get_actor_location().x,birds153[0][0].get_actor_location().y,birds153[0][0].get_actor_location().z] if birds153 else None,'birds':len(birds153),'oceanMeshesVisible':1,'gameView':level153.editor_get_game_view(),'frames':oceanFrames153,'at':time.time()};tmp=V153/'ue-motion-state.tmp';tmp.write_text(json.dumps(obj),encoding='utf-8');tmp.replace(V153/'ue-motion-state.json')
oceanHandle153=u.register_slate_post_tick_callback(oceanTick153)
(V153/'ue-runtime.json').write_text(json.dumps({'world':world.get_path_name(),'sourceMapFileSaved':False,'oneContinuousOcean':True,'originalCubeHiddenForRollback':True,'waterline':waterline153,'fogStartCm':9000,'fogDensity':.008,'newBirds':0}),encoding='utf-8')
