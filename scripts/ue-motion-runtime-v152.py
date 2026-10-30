"""Seek-safe sea/rig/birds driven by the existing pause-aware SeaClock; no map save."""
from pathlib import Path
import unreal as u,json,time,math
P=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');V152=P/'.verify/v32-152';V152.mkdir(exist_ok=True);assets=u.get_editor_subsystem(u.EditorAssetSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=ed.get_editor_world();labels152={a.get_actor_label():a for a in actors.get_all_level_actors()};level152=u.get_editor_subsystem(u.LevelEditorSubsystem)
if 'motionHandle152' in globals():
 try:u.unregister_slate_post_tick_callback(motionHandle152)
 except Exception:pass
def vec152(v):return [v.x,v.y,v.z]
def spawn152(meshpath,label,material):
 a=labels152.get(label)
 if a is None:a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector());a.set_actor_label(label)
 a.static_mesh_component.set_static_mesh(assets.load_asset(meshpath));a.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE);a.static_mesh_component.set_material(0,material);return a
normalOnlySea152=assets.does_asset_exist('/Game/Cove/V152_NormalOnlySea')
seaAsset152=assets.load_asset('/Game/Cove/V152_NormalOnlySea' if normalOnlySea152 else '/Game/Cove/V152_LiveSeaMatched' if assets.does_asset_exist('/Game/Cove/V152_LiveSeaMatched') else '/Game/Cove/V152_LiveSea');birdAsset152=assets.load_asset('/Game/Cove/V152_DistantGullSurface')
nearSea152=spawn152('/Game/Cove/V152NearSea','V152 Moving sea patch',seaAsset152);nearSea152.static_mesh_component.set_editor_property('cast_shadow',False);seaMID149=nearSea152.static_mesh_component.create_dynamic_material_instance(0)
nearSea152.set_is_temporarily_hidden_in_editor(normalOnlySea152);nearSea152.set_actor_hidden_in_game(normalOnlySea152)
foundation152=labels152['Water foundation']
foundation152.static_mesh_component.set_material(0,seaAsset152);farSeaMID152=foundation152.static_mesh_component.create_dynamic_material_instance(0)
if 'foundationBase152' not in globals():foundationBase152=foundation152.get_actor_location()
foundation152.set_actor_location(foundationBase152 if normalOnlySea152 else u.Vector(foundationBase152.x,foundationBase152.y,foundationBase152.z-80),False,False)
if normalOnlySea152:seaMID149=farSeaMID152
rigActors152=[labels152[n] for n in ['Vessel','Crew'] if n in labels152]
if 'rigBase152' not in globals():rigBase152=[(a,a.get_actor_location(),a.get_actor_rotation()) for a in rigActors152]
for a,_,_ in rigBase152:a.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE)
birds152=[]
for i in range(4):
 a=spawn152('/Game/Cove/V152DistantGull','V152 Distant gull '+str(i),birdAsset152);a.static_mesh_component.set_editor_property('cast_shadow',False);mi=a.static_mesh_component.create_dynamic_material_instance(0);mi.set_scalar_parameter_value('BirdPhase',i*1.9);birds152.append((a,mi,i))
actors.clear_actor_selection_set();level152.editor_set_game_view(True)
for cmd152 in ['ShowFlag.SelectionOutline 0','ShowFlag.CompositeEditorPrimitives 0','r.Streaming.FullyLoadUsedTextures 1','r.Streaming.UseAllMips 1','r.Streaming.PoolSize 2300','r.Lumen.ScreenProbeGather.Temporal.MaxFramesAccumulated 6']:
 u.SystemLibrary.execute_console_command(world,cmd152)
def waveHeight152(x,y,t):return 14*math.sin((x*.6+y*.8)/220+t*.72)+6*math.sin((x*.94-y*.34)/530-t*.93)
pivot152=u.Vector(9,536,-17);motionLast152=0.;motionFrames152=0
def motionTick152(dt):
 global motionLast152,motionFrames152
 t=float(globals().get('seaClock149',0.));cx,cy=pivot152.x,pivot152.y;h=waveHeight152(cx,cy,t);pitch=math.degrees(math.atan2(waveHeight152(cx+1100,cy,t)-waveHeight152(cx-1100,cy,t),2200));roll=-math.degrees(math.atan2(waveHeight152(cx,cy+330,t)-waveHeight152(cx,cy-330,t),660))
 farSeaMID152.set_scalar_parameter_value('SeaClock',t)
 for a,base,rotation in rigBase152:
  rel=base-pivot152;rotated=u.MathLibrary.rotate_angle_axis(rel,-pitch,u.Vector(0,1,0));rotated=u.MathLibrary.rotate_angle_axis(rotated,roll,u.Vector(1,0,0));loc=pivot152+rotated+u.Vector(0,0,h);a.set_actor_location(loc,False,False);a.set_actor_rotation(u.Rotator(pitch=rotation.pitch+pitch,yaw=rotation.yaw,roll=rotation.roll+roll),False)
 for a,mi,i in birds152:
  phase=t*.035+i*1.2;x=-6500+2600*math.cos(phase);y=-900+1500*math.sin(phase);z=2300+260*math.sin(phase*.8+i);a.set_actor_location(u.Vector(x,y,z),False,False);a.set_actor_rotation(u.Rotator(pitch=3*math.sin(phase+i),yaw=math.degrees(math.atan2(1500*math.cos(phase),-2600*math.sin(phase)))-90,roll=-10*math.sin(phase+i)),False);mi.set_scalar_parameter_value('SeaClock',t)
 motionFrames152+=1;now=time.monotonic()
 if now-motionLast152>1:
  motionLast152=now;out={'waterTime':t,'paused':bool(globals().get('paused149',False)),'heaveCm':h,'pitchDegrees':pitch,'rollDegrees':roll,'rigActors':[a.get_actor_label() for a in rigActors152],'rigLocations':[vec152(a.get_actor_location()) for a in rigActors152],'birds':4,'bird0':vec152(birds152[0][0].get_actor_location()),'gameView':level152.editor_get_game_view(),'frames':motionFrames152,'at':time.time()};tmp=V152/'ue-motion-state.tmp';tmp.write_text(json.dumps(out),encoding='utf-8');tmp.replace(V152/'ue-motion-state.json')
motionHandle152=u.register_slate_post_tick_callback(motionTick152)
(V152/'ue-runtime-installed.json').write_text(json.dumps({'map':world.get_path_name(),'sourceMapFileUnchanged':True,'newRuntimeActors':5,'boatAndCrewSameRigidTransform':True,'waveAmplitudeCm':[14,6],'waterClock':'existing SeaClock149','pauseAndNight':'existing control bridge','gameView':level152.editor_get_game_view()}),encoding='utf-8')
