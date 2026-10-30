"""Resident original scenes: change editor visibility without unloading the captured world."""
import unreal as u,json,time
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-165'
PATH='/Game/V165/PortfolioLiveV165';MAPS={'home':'/Game/V162/Courtyard','myth':'/Game/Cove/FullCoveV162','room':'/Game/V162/Studio'}
world=None;streams={};groups={};sun_defaults={};volume_defaults={};component_defaults={};active=None;visibility_groups={}

def ensure():
 global world,streams,groups,sun_defaults,volume_defaults,component_defaults,active,visibility_groups
 ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);levels=u.get_editor_subsystem(u.LevelEditorSubsystem)
 created=not u.EditorAssetLibrary.does_asset_exist(PATH)
 if ed.get_editor_world().get_name()!='PortfolioLiveV165':
  if u.EditorAssetLibrary.does_asset_exist(PATH):assert levels.load_level(PATH)
  else:assert levels.new_level(PATH)
 w=ed.get_editor_world()
 if world==w and len(streams)==3:return w
 previous_components={};previous_volumes={}
 previous_suns={}
 world=w;visibility_groups={};streams={};groups={};sun_defaults={};volume_defaults={};component_defaults={};active=None;began=time.monotonic()
 for scene,path in MAPS.items():
  streaming=u.GameplayStatics.get_streaming_level(w,path)
  if not streaming:streaming=u.EditorLevelUtils.add_level_to_world(w,path,u.LevelStreamingAlwaysLoaded)
  assert streaming,'Could not preload '+scene
  level=streaming.get_loaded_level();assert level,'Scene not resident: '+scene;streams[scene]=streaming
 all_actors=u.get_editor_subsystem(u.EditorActorSubsystem).get_all_level_actors()
 for scene,streaming in streams.items():
  level=streaming.get_loaded_level();group=[a for a in all_actors if a.get_level()==level];groups[scene]=group
  sun_defaults[scene]=[(a,*previous_suns.get(a.get_path_name(),(a.light_component.intensity,a.light_component.get_light_color())))for a in group if isinstance(a,u.DirectionalLight)]
  for a in group:
   if isinstance(a,u.PostProcessVolume):volume_defaults[a]=True
   if isinstance(a,(u.Light,u.ExponentialHeightFog,u.SkyAtmosphere,u.VolumetricCloud)):
    for c in a.get_components_by_class(u.SceneComponent):component_defaults[c]=True
 show('home')
 if created:u.EditorLoadingAndSavingUtils.save_map(w,PATH)
 (OUT/'resident-scenes.json').write_text(json.dumps({'world':PATH,'maps':MAPS,'actors':{k:len(v)for k,v in groups.items()},'preloadedSeconds':time.monotonic()-began,'originalMapsSaved':False,'switch':'resident level visibility only'},indent=2))
 return w

def show(scene):
 global active
 if world is None:ensure()
 if scene==active:return groups[scene]
 started=time.monotonic()
 u.EditorLevelUtils.set_levels_visibility([s.get_loaded_level()for s in streams.values()],[key==scene for key in streams],False,u.LevelVisibilityDirtyMode.DONT_MODIFY)
 if not visibility_groups:
  for key,group in groups.items():
   volumes=[];components=[]
   for a in group:
    if isinstance(a,u.PostProcessVolume):volumes.append((a,volume_defaults.get(a,True)))
    if isinstance(a,(u.Light,u.ExponentialHeightFog,u.SkyAtmosphere,u.VolumetricCloud)):
     for c in a.get_components_by_class(u.SceneComponent):components.append((c,component_defaults.get(c,True)))
   visibility_groups[key]={'volumes':volumes,'components':components}
 for key,entry in visibility_groups.items():
  on=key==scene
  for a,enabled in entry['volumes']:a.set_editor_property('enabled',enabled and on)
  for c,visible in entry['components']:c.set_visibility(visible and on)
 for a,power,color in sun_defaults[scene]:a.light_component.set_intensity(power);a.light_component.set_light_color(color)
 active=scene;u.get_editor_subsystem(u.LevelEditorSubsystem).editor_invalidate_viewports()
 (OUT/'resident-switch.json').write_text(json.dumps({'scene':scene,'seconds':time.monotonic()-started,'worldUnloaded':False,'at':time.time()}))
 return groups[scene]

def actors(scene):return groups[scene]
def day_lights(scene):return sun_defaults[scene]
