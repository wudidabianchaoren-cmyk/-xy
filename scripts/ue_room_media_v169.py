"""One world-space CRT; retain the previous program until the next frame is decoded."""
import unreal as u,json,time
from pathlib import Path
P=Path(__file__).resolve().parents[1]
FILES=['assets/works/physical-universe-v103/film.mp4','assets/works/after-journey/trailer-v32-92.mp4','assets/works/mid-autumn/mid-autumn-web.mp4','assets/works/rural-return/film-sr-v32-92.mp4','assets/works/humid-southeast-asia/film-final-v149.mp4']
SESSION={}
def pair():
 player=u.new_object(u.MediaPlayer);player.set_desired_player_name('ElectraPlayer');player.set_editor_property('play_on_open',True);player.set_looping(True)
 texture=u.new_object(u.MediaTexture);texture.set_editor_property('new_style_output',True);texture.set_editor_property('enable_gen_mips',True);texture.set_media_player(player);texture.update_resource()
 return player,texture
def update(cache,data,state):
 # Resolve the existing screen once per room visit. Repeating reflected mesh
 # property queries for every room actor consumed the game thread on each frame.
 if state is None:
  screen=next(a for a in cache.values()if isinstance(a,u.StaticMeshActor)and a.static_mesh_component.static_mesh and a.static_mesh_component.static_mesh.get_name()=='CRT_live_screen')
  identity=screen.get_path_name();state=SESSION.get(identity)
 if state is None:
  material=u.load_asset('/Game/V163/NativeCRT_Electra')or u.load_asset('/Game/V163/NativeCRT');assert material,'Existing CRT material is required'
  player,texture=pair();standby,standby_texture=pair();mid=screen.static_mesh_component.create_dynamic_material_instance(0,material);mid.set_texture_parameter_value('Program',texture)
  state={'player':player,'texture':texture,'standby':standby,'standby_texture':standby_texture,'mid':mid,'work':None,'pending':None,'on':None,'source':None};SESSION[identity]=state
 work=max(0,min(4,int(data.get('roomWork',0))));on=bool(data.get('roomTV',True))
 if not state.get('containConfigured'):
  import ue_room_display_v173
  material=u.load_asset('/Game/V174/NativeCRT_Clear')or u.load_asset('/Game/V173/NativeCRT_Contain')
  if material:
   screen=next(a for a in cache.values()if isinstance(a,u.StaticMeshActor)and a.static_mesh_component.static_mesh and a.static_mesh_component.static_mesh.get_name()=='CRT_live_screen')
   state['mid']=screen.static_mesh_component.create_dynamic_material_instance(0,material);state['mid'].set_texture_parameter_value('Program',state['texture']);state['on']=None;state['containConfigured']=True;state['clearConfigured']=material.get_name()=='NativeCRT_Clear'
 if state['pending'] is not None and state['pending']!=work and state['work']==work:
  state['standby'].close();state['pending']=None;state['prepared']=False
 if state['work']!=work and state['pending']!=work:
  source=u.new_object(u.FileMediaSource);source.set_file_path(str(P/FILES[work]));state['source']=source;state['pending']=work;state['prepared']=False;state['opened']=state['standby'].open_source(source);state['requested_at']=time.monotonic()
 transfer=next((item for item in data.get('roomProps',[])if item['id']=='tape'+str(work)),{})
 commit=transfer.get('commit',True)
 if state['pending'] is not None and not state.get('prepared') and state['standby'].is_ready() and state['standby_texture'].get_width()>16 and u.MathLibrary.get_total_seconds(state['standby'].get_time())>.04:
  state['standby'].pause();state['standby'].seek(u.MathLibrary.from_seconds(0.));state['prepared']=True
 if state['pending'] is not None and state.get('prepared') and commit:
  state['player'].pause();state['player'],state['standby']=state['standby'],state['player'];state['texture'],state['standby_texture']=state['standby_texture'],state['texture'];state['work']=state['pending'];state['pending']=None;state['mid'].set_texture_parameter_value('Program',state['texture']);state['on']=None
  state['fitSize']=None;state['switched_at']=time.monotonic()
 if state.get('containConfigured'):
  import ue_room_display_v173
  ue_room_display_v173.set_fit(state)
 if state['on']!=on:
  state['player'].play()if on else state['player'].pause();state['mid'].set_scalar_parameter_value('Power',1. if on else 0.);state['on']=on
 if on and state['player'].is_ready()and not state['player'].is_playing():state['player'].play()
 if time.monotonic()-state.get('reported',0)>1:
  import ue_io_v173
  state['reported']=time.monotonic();ue_io_v173.report({'work':state['work'],'pending':state['pending'],'on':on,'opened':state.get('opened'),'playing':state['player'].is_playing(),'ready':state['player'].is_ready(),'seconds':u.MathLibrary.get_total_seconds(state['player'].get_time()),'textureWidth':state['texture'].get_width(),'textureHeight':state['texture'].get_height(),'fitSize':state.get('fitSize'),'commit':commit,'prepared':state.get('prepared'),'switchedAt':state.get('switched_at'),'nativeScreenSharesRoomCamera':True,'persistentPair':True,'shaderRecompiledOnReturn':False},'media')
 return state
