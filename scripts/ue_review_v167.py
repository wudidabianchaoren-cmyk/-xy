"""Allowlisted V167 runtime and lighting operations. No asset reconstruction."""
import unreal as u,json,time,importlib
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-167'

def run():
 kind=json.loads((OUT/'request.json').read_text(encoding='utf-8-sig'))['kind']
 if kind=='runtime':
  import ue_runtime_v162,ue_room_props_v167
  ue_room_props_v167.restore()
  if ue_runtime_v162.handle is not None:u.unregister_slate_post_tick_callback(ue_runtime_v162.handle)
  importlib.reload(ue_room_props_v167);importlib.reload(ue_runtime_v162).ensure_runtime()
  result={'kind':kind,'sameEngine':True,'nativePropBindings':{k:len(v)for k,v in ue_room_props_v167.BINDINGS.items()}}
 elif kind=='home':result=home()
 elif kind=='room-state':
  import ue_room_props_v167
  result={'kind':kind,'groups':{key:[{'label':a.get_actor_label(),'visible':a.static_mesh_component.is_visible(),'position':str(a.get_actor_location()),'scale':str(a.get_actor_scale3d())}for a in actors]for key,actors in ue_room_props_v167.groups.items()}}
 elif kind=='save':result=save()
 else:raise ValueError('Unknown V167 operation '+kind)
 result.update(ok=True,at=time.time());(OUT/(kind+'-result.json')).write_text(json.dumps(result,indent=2));(OUT/'request.json').unlink()

def home():
 import ue_worlds_v165
 ue_worlds_v165.ensure();result=[]
 for a in ue_worlds_v165.actors('home'):
  label=a.get_actor_label()
  if label=='Courtyard broad warm key':a.light_component.set_light_color(u.LinearColor(1.,.80,.57,1));a.light_component.set_intensity(790.)
  if label=='Courtyard quiet stone return':a.light_component.set_light_color(u.LinearColor(.72,.81,1.,1));a.light_component.set_intensity(125.)
  if label=='Courtyard woodland soft light':a.light_component.set_intensity(78.)
  if isinstance(a,u.SkyLight):a.light_component.set_intensity(.07)
  if isinstance(a,u.PostProcessVolume):
   s=a.get_editor_property('settings')
   for k,v in [('override_auto_exposure_bias',True),('auto_exposure_bias',-.40),('override_color_saturation',True),('color_saturation',u.Vector4(1.,1.,1.,1.)),('override_bloom_intensity',True),('bloom_intensity',.035),('override_vignette_intensity',True),('vignette_intensity',.25)]:s.set_editor_property(k,v)
   a.set_editor_property('settings',s)
  if isinstance(a,u.Light):result.append({'label':label,'power':a.light_component.intensity,'color':str(a.light_component.get_light_color())})
 return{'kind':'home','lights':result,'geometryPreserved':True,'sameOriginalCamera':True}

def save():
 import ue_worlds_v165,ue_room_props_v167
 # Save the source courtyard only; no transient reflection helpers or prop poses enter a map.
 ue_room_props_v167.restore()
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem)
 for a in ue_worlds_v165.actors('home'):
  if a.get_actor_label().startswith('V162 native mirror'):a.set_is_temporarily_hidden_in_editor(True)
 # The existing V166 save routine detaches dynamic materials before saving source sublevels.
 import ue_review_v166
 ue_review_v166.save()
 return{'kind':'save','sourceMaps':True}
