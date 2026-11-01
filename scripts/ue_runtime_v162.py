"""Native editor motion and bounded homepage mechanism updates. No arbitrary code inbox."""
import unreal as u,json,time,math,builtins,importlib
import ue_room_media_v169
importlib.reload(ue_room_media_v169)
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162';handle=None;world=None;cache={};clock=0.;last=0.;lastReport=0;mirror=None;seaMID=None;crewMID=[];nightVolume=None;nightBlend=0.;realtime=None;transformCache={};keyCache=None;roomMedia=None;sailMID=[];homeLeafMID=[];cachedScene=None;mirrorCache={};boatPose=None
HOME_PARTS=json.loads((OUT/'courtyard-current.json').read_text())['parts']

def living_sea(x,y,t):
 h=dx=dy=0.
 for vx,vy,length,amplitude,phase in[(.96,.28,1800.,22.,0.),(-.35,.93675,4200.,12.,1.7),(.72,.69397,850.,7.,.6)]:
  k=2*math.pi/length;omega=math.sqrt(981*k);theta=((x-100)*vx+(y-800)*vy)*k-t*omega+phase;second=.16 if length==1800 else .07
  h+=amplitude*(math.sin(theta)+second*math.sin(theta*2));slope=amplitude*k*(math.cos(theta)+second*2*math.cos(theta*2));dx+=vx*slope;dy+=vy*slope
 return h,dx,dy

def vec(a):return u.Vector(a[0]*100,a[2]*100,a[1]*100)
def tick(dt):
 global world,cache,clock,last,lastReport,mirror,seaMID,crewMID,nightVolume,nightBlend,realtime,transformCache,keyCache,roomMedia,sailMID,homeLeafMID,cachedScene,mirrorCache,boatPose
 now=time.perf_counter()
 if getattr(builtins,'_zaojing_ue_busy',False):return
 if now-last<1/60:return
 delta=min(.05,now-last)if last else 0;last=now;builtins._zaojing_ue_busy=True
 try:
  import ue_io_v173
  _,data=ue_io_v173.control()
  if data is None:return
  active=data.get('active',True)and time.time()-data.get('at',0)/1000<5.;paused=data.get('paused',False);scene=data.get('scene','myth');ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);levels=u.get_editor_subsystem(u.LevelEditorSubsystem);w=ed.get_editor_world()
  import ue_worlds_v165
  resident=w.get_name()=='PortfolioLiveV165'and ue_worlds_v165.active==scene
  if not resident and w.get_name()!={'home':'Courtyard','room':'Studio','myth':'FullCoveV162'}.get(scene):return
  if w!=world or scene!=cachedScene:
   if cachedScene=='room':
    import ue_room_props_v167
    ue_room_props_v167.hide_glow()
   if nightVolume:
    try:nightVolume.set_editor_property('blend_weight',0.)
    except Exception:pass
   if w!=world:mirrorCache={}
   cachedScene=scene;boatPose=None
   if roomMedia:
    try:roomMedia['player'].pause()
    except Exception:pass
   world=w;cache={a.get_actor_label():a for a in(ue_worlds_v165.actors(scene)if resident else u.get_editor_subsystem(u.EditorActorSubsystem).get_all_level_actors())};levels.editor_set_game_view(True);u.get_editor_subsystem(u.EditorActorSubsystem).clear_actor_selection_set();mirror=None;seaMID=None;crewMID=[];nightVolume=None;nightBlend=0.;realtime=None;transformCache={};keyCache=None;roomMedia=None;homeLeafMID=[]
   for flag in ['ShowFlag.CameraFrustums 0','ShowFlag.CompositeEditorPrimitives 0','ShowFlag.Grid 0']:u.SystemLibrary.execute_console_command(w,flag)
   if scene=='home':
    import ue_mirror_v162
    mirror=mirrorCache.get(scene)or ue_mirror_v162.install(world,cache);mirrorCache[scene]=mirror;homeLeafMID=[];sharedLeaves={}
    for a in cache.values():
     if not isinstance(a,u.StaticMeshActor):continue
     c=a.static_mesh_component
     for i in range(c.get_num_materials()):
      mat=c.get_material(i);source=mat
      while isinstance(source,u.MaterialInstanceDynamic):source=source.get_editor_property('parent')
      if source and 'HomeLivingOak'in source.get_name()and 'living_oak_canopy'in source.get_name():
       key=source.get_path_name()
       if key not in sharedLeaves:sharedLeaves[key]=mat if isinstance(mat,u.MaterialInstanceDynamic)else c.create_dynamic_material_instance(i,source);homeLeafMID.append(sharedLeaves[key])
       else:c.set_material(i,sharedLeaves[key])
   if scene=='myth':
    nightVolume=cache.get('V162 native night exposure')or next((a for a in u.get_editor_subsystem(u.EditorActorSubsystem).get_all_level_actors()if a.get_actor_label()=='V162 native night exposure'),None)or u.get_editor_subsystem(u.EditorActorSubsystem).spawn_actor_from_class(u.PostProcessVolume,u.Vector());nightVolume.set_actor_label('V162 native night exposure');nightVolume.set_editor_property('unbound',True);nightVolume.set_editor_property('priority',100.);nightVolume.set_editor_property('blend_weight',0.);s=u.PostProcessSettings()
    for k,v in [('override_auto_exposure_method',True),('auto_exposure_method',u.AutoExposureMethod.AEM_MANUAL),('override_auto_exposure_bias',True),('auto_exposure_bias',-3.),('override_auto_exposure_apply_physical_camera_exposure',True),('auto_exposure_apply_physical_camera_exposure',False),('override_color_gain',True),('color_gain',u.Vector4(.55,.72,1.,1.))]:s.set_editor_property(k,v)
    nightVolume.set_editor_property('settings',s)
    sailMID=[]
    if 'Vessel'in cache:
     c=cache['Vessel'].static_mesh_component
     for i in range(c.get_num_materials()):
      existing=c.get_material(i);source=existing
      while isinstance(source,u.MaterialInstanceDynamic):source=source.get_editor_property('parent')
      if source and 'QuietNaturalLinen'in source.get_name():sailMID.append(existing if isinstance(existing,u.MaterialInstanceDynamic)else c.create_dynamic_material_instance(i))
    if'Water foundation'in cache:
     wc=cache['Water foundation'].static_mesh_component;refined=u.load_asset('/Game/V170/WeightedCoveSea');
     if refined:wc.set_material(0,refined)
     existing=wc.get_material(0);seaMID=existing if isinstance(existing,u.MaterialInstanceDynamic)else wc.create_dynamic_material_instance(0)
    if seaMID and 'V164 distant continuous ocean'in cache:cache['V164 distant continuous ocean'].static_mesh_component.set_material(0,seaMID)
    crewMID=[]
    for label,a in cache.items():
     if label.startswith('V162 rower '):
      c=a.static_mesh_component
      for i in range(c.get_num_materials()):
       m=c.get_material(i);source=m
       while isinstance(source,u.MaterialInstanceDynamic):source=source.get_editor_property('parent')
       if source and any(s in source.get_name().lower()for s in['historicalmail','wool']):crewMID.append(m if isinstance(m,u.MaterialInstanceDynamic)else c.create_dynamic_material_instance(i))
  if not active or paused:
   import ue_stream_v164
   ue_stream_v164.set_active(False)
   if realtime is not False:
    u.SystemLibrary.execute_console_command(w,'t.MaxFPS 10');realtime=False
   levels.editor_invalidate_viewports()
   if now-lastReport>1:lastReport=now;(OUT/'native-motion.json').write_text(json.dumps({'scene':scene,'time':clock,'paused':paused,'active':active,'at':time.time(),'mirrorReady':bool(mirror),'homeLeafMaterials':len(homeLeafMID),'gulls':sum('GullBody'in k for k in cache)}))
   return
  import ue_stream_v164
  ue_stream_v164.set_active(True)
  if realtime is not True:
   # The subsystem's True path removes its named override, so pair it with
   # False first to avoid a missing-override ensure in long-running sessions.
   levels.editor_set_viewport_realtime(False)
   levels.editor_set_viewport_realtime(True)
   u.SystemLibrary.execute_console_command(w,'t.MaxFPS 45');realtime=True
  if not paused:clock+=delta
  if scene=='home':
   for material in homeLeafMID:material.set_scalar_parameter_value('NativeHomeWindTime',clock)
   import ue_mirror_v162
   ue_mirror_v162.update(mirror,now,data)
   key=cache.get('Courtyard broad warm key');position=data.get('homeKey')
   if key and isinstance(position,list)and len(position)==3 and position!=keyCache:
    keyCache=position;key.set_actor_location(vec(position),False,False);key.set_actor_rotation(u.MathLibrary.find_look_at_rotation(key.get_actor_location(),u.Vector(0,-100,400)),False)
   west=cache.get('V162 original west window practical')
   if data.get('homeWest')and not west:
    west=u.get_editor_subsystem(u.EditorActorSubsystem).spawn_actor_from_class(u.PointLight,u.Vector(-810,-210,297));west.set_actor_label('V162 original west window practical');west.light_component.set_mobility(u.ComponentMobility.MOVABLE);west.light_component.set_light_color(u.LinearColor(1,.55,.22,1));west.light_component.set_attenuation_radius(350);cache[west.get_actor_label()]=west
   if west and west.light_component.intensity!=(60. if data.get('homeWest')else 0.):west.light_component.set_intensity(60. if data.get('homeWest')else 0.)
   parts=HOME_PARTS;deltas={d['id']:d for d in data.get('homeParts',[])}
   for part in parts:
    a=cache.get(part['name']);d=deltas.get(part.get('anchor',''))
    if a and d:
     poseKey=tuple(round(x,4)for x in d['p']+d['q']+d['s'])
     if transformCache.get(part['name'])==poseKey:continue
     transformCache[part['name']]=poseKey;q=d['q'];rotation=u.Quat(-q[0],-q[2],-q[1],q[3]).rotator();a.set_actor_location_and_rotation(vec(d['p']),rotation,False,False);s=d['s'];a.set_actor_scale3d(u.Vector(s[0],s[2],s[1]))
  elif scene=='room':
   import ue_room_calendar_v170
   ue_room_calendar_v170.update(cache)
   import ue_room_props_v167
   ue_room_props_v167.update(cache,data)
   import ue_room_media_v169 as ue_room_media_v163b
   roomMedia=ue_room_media_v163b.update(cache,data,roomMedia)
  elif scene=='myth':
   nightBlend+=(float(bool(data.get('night')))-nightBlend)*(1-math.exp(-delta*4));nightVolume.set_editor_property('blend_weight',nightBlend)
   if seaMID:seaMID.set_scalar_parameter_value('NativeSeaTime',clock)
   for m in crewMID:m.set_scalar_parameter_value('NativeLifeTime',clock)
   for m in sailMID:m.set_scalar_parameter_value('NativeWindTime',clock)
   h=sum(living_sea(100.+x,800.,clock)[0]for x in[-950.,-475.,0.,475.,950.])/5.;sx=(living_sea(1100.,800.,clock)[0]-living_sea(-900.,800.,clock)[0])/2000.;sy=(living_sea(100.,960.,clock)[0]-living_sea(100.,640.,clock)[0])/320.;pitch=max(-.55,min(.55,math.degrees(math.atan(sx))*.45));roll=max(-.75,min(.75,-math.degrees(math.atan(sy))*.38));h=max(-14.,min(14.,h))
   if boatPose is None:boatPose=[h,pitch,roll]
   for i,value in enumerate([h,pitch,roll]):boatPose[i]+=(value-boatPose[i])*(1-math.exp(-delta*(2.6 if i==0 else 1.8)))
   h,pitch,roll=boatPose;rotation=u.Rotator(pitch=pitch,yaw=0,roll=roll);offset=u.Vector(100,800,h)-u.MathLibrary.get_forward_vector(rotation)*100-u.MathLibrary.get_right_vector(rotation)*800
   for label,a in cache.items():
    if label=='Vessel'or label.startswith('V162 rower '):a.set_actor_location_and_rotation(offset,rotation,False,False)
   if seaMID and 'Vessel'in cache:
    transform=cache['Vessel'].get_actor_transform();o=u.MathLibrary.inverse_transform_location(transform,u.Vector());x=u.MathLibrary.inverse_transform_location(transform,u.Vector(1,0,0))-o;y=u.MathLibrary.inverse_transform_location(transform,u.Vector(0,1,0))-o;z=u.MathLibrary.inverse_transform_location(transform,u.Vector(0,0,1))-o
    for name,v in [('HullA',u.Vector(x.x,y.x,z.x)),('HullB',u.Vector(x.y,y.y,z.y)),('HullC',u.Vector(x.z,y.z,z.z)),('HullO',o)]:seaMID.set_vector_parameter_value(name,u.LinearColor(v.x,v.y,v.z,0))
   for i in range(7):
    body=cache.get('V162 Gull '+str(i)+' GullBody')
    if not body:continue
    t=clock*(.055+i*.003)*(1 if i%2 else-1)+i*.9;x=(-4+math.cos(t)*(31+i)) *100;y=(-4+math.sin(t)*(18+i*.4))*100;z=(14.+math.sin(t*2+i)*3.0)*100;dx=-math.sin(t)*(31+i);dy=math.cos(t)*(18+i*.4);yaw=math.degrees(math.atan2(dy,dx))-90+(180 if i%2==0 else 0);body.set_actor_location_and_rotation(u.Vector(x,y,z),u.Rotator(pitch=0,yaw=yaw,roll=math.sin(t)*12),False,False)
    for side,name in[(-1,'Left'),(1,'Right')]:
     for part,lag,amp in[('Inner',0,.22),('Outer',-.72,.14)]:
      wing=cache.get('V162 Gull '+str(i)+' Gull'+part+name)
      if wing:wing.set_actor_relative_rotation(u.Rotator(pitch=side*math.degrees(math.sin(clock*(2.2+i*.06)+i*1.37+lag)*amp),yaw=0,roll=0),False,False)
  # Realtime already draws the active viewport. Invalidating every tick also
  # invalidates editor hit proxies, causing unnecessary synchronous redraw work.
  if now-lastReport>1:lastReport=now;(OUT/'native-motion.json').write_text(json.dumps({'scene':scene,'time':clock,'paused':paused,'active':active,'at':time.time(),'actors':len(cache),'boatPose':boatPose,'mirrorReady':bool(mirror),'homeLeafMaterials':len(homeLeafMID),'gulls':sum('GullBody'in k for k in cache)}))
 except (PermissionError,FileNotFoundError,json.JSONDecodeError):pass
 except Exception as e:
  world=None;cache={};mirror=None;seaMID=None;crewMID=[];(OUT/'native-motion-error.txt').write_text(str(e))
 finally:builtins._zaojing_ue_busy=False
def ensure_runtime():
 global handle
 if handle is None:handle=u.register_slate_post_tick_callback(tick)
