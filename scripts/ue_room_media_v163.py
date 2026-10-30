"""Native CRT media: one actual screen in the same camera as all room props."""
import unreal as u,json,time
from pathlib import Path
P=Path(__file__).resolve().parents[1]
FILES=['assets/works/physical-universe-v103/film.mp4','assets/works/after-journey/trailer-v32-92.mp4','assets/works/mid-autumn/mid-autumn-web.mp4','assets/works/rural-return/film-sr-v32-92.mp4','assets/works/humid-southeast-asia/film-final-v149.mp4']
def update(cache,data,state):
 if state is None:
  screen=next(a for a in cache.values()if isinstance(a,u.StaticMeshActor)and a.static_mesh_component.static_mesh and a.static_mesh_component.static_mesh.get_name()=='CRT_live_screen')
  tools=u.AssetToolsHelpers.get_asset_tools();player=u.load_asset('/Game/V163/RoomMediaPlayer')or tools.create_asset('RoomMediaPlayer','/Game/V163',u.MediaPlayer,u.MediaPlayerFactoryNew());player.set_desired_player_name('ElectraPlayer');player.set_editor_property('play_on_open',True);player.set_looping(True);texture=u.load_asset('/Game/V163/RoomMediaTexture')or tools.create_asset('RoomMediaTexture','/Game/V163',u.MediaTexture,u.MediaTextureFactoryNew());texture.set_editor_property('new_style_output',True);texture.set_media_player(player);texture.update_resource();path='/Game/V163/NativeCRT';m=u.load_asset(path)or tools.create_asset('NativeCRT','/Game/V163',u.Material,u.MaterialFactoryNew());mel=u.MaterialEditingLibrary;mel.delete_all_material_expressions(m);m.set_editor_property('shading_model',u.MaterialShadingModel.MSM_UNLIT);n=mel.create_material_expression(m,u.MaterialExpressionTextureSampleParameter2D);n.set_editor_property('parameter_name','Program');n.texture=texture;n.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_COLOR;power=mel.create_material_expression(m,u.MaterialExpressionScalarParameter);power.set_editor_property('parameter_name','Power');power.set_editor_property('default_value',1.);mul=mel.create_material_expression(m,u.MaterialExpressionMultiply);assert mel.connect_material_expressions(n,'RGB',mul,'A');assert mel.connect_material_expressions(power,'',mul,'B');assert mel.connect_material_property(mul,'',u.MaterialProperty.MP_EMISSIVE_COLOR);mel.recompile_material(m);mid=screen.static_mesh_component.create_dynamic_material_instance(0,m);mid.set_texture_parameter_value('Program',texture);state={'player':player,'texture':texture,'material':m,'mid':mid,'work':None,'on':None,'source':None}
 work=int(data.get('roomWork',0));work=max(0,min(4,work));on=bool(data.get('roomTV',True))
 if state['work']!=work:
  source=u.new_object(u.FileMediaSource);assert(P/FILES[work]).is_file();source.set_file_path(str(P/FILES[work]));state['source']=source;state['opened']=state['player'].open_source(source);state['work']=work
 if state['on']!=on:
  state['player'].play()if on else state['player'].pause();state['mid'].set_scalar_parameter_value('Power',1. if on else 0.);state['on']=on
 if state['player'].is_ready()and not state.get('refreshed'):
  state['texture'].update_resource();state['refreshed']=True
 if time.monotonic()-state.get('reported',0)>1:
  state['reported']=time.monotonic();(P/'.verify/v32-163/room-media.json').write_text(json.dumps({'work':work,'on':on,'opened':state.get('opened'),'playing':state['player'].is_playing(),'ready':state['player'].is_ready(),'seconds':u.MathLibrary.get_total_seconds(state['player'].get_time()),'player':str(state['player'].get_player_name()),'textureWidth':state['texture'].get_width(),'tickMethods':[n for n in dir(state['player'])if 'tick'in n],'nativeScreenSharesRoomCamera':True}))
 return state
