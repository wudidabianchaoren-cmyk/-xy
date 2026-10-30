"""Stable native CRT assets, reused across room visits; no shader rebuild per frame."""
import unreal as u,json,time
from pathlib import Path
P=Path(__file__).resolve().parents[1]
FILES=['assets/works/physical-universe-v103/film.mp4','assets/works/after-journey/trailer-v32-92.mp4','assets/works/mid-autumn/mid-autumn-web.mp4','assets/works/rural-return/film-sr-v32-92.mp4','assets/works/humid-southeast-asia/film-final-v149.mp4']
def assets():
 tools=u.AssetToolsHelpers.get_asset_tools();player=u.load_asset('/Game/V163/RoomMediaPlayer')or tools.create_asset('RoomMediaPlayer','/Game/V163',u.MediaPlayer,u.MediaPlayerFactoryNew());player.set_desired_player_name('ElectraPlayer');player.set_editor_property('play_on_open',True);player.set_looping(True)
 texture=u.load_asset('/Game/V163/RoomMediaTexture')or tools.create_asset('RoomMediaTexture','/Game/V163',u.MediaTexture,u.MediaTextureFactoryNew());texture.set_editor_property('new_style_output',True);texture.set_media_player(player);texture.update_resource();m=u.load_asset('/Game/V163/NativeCRT_Electra')
 if not m:
  m=tools.create_asset('NativeCRT_Electra','/Game/V163',u.Material,u.MaterialFactoryNew());mel=u.MaterialEditingLibrary;m.set_editor_property('shading_model',u.MaterialShadingModel.MSM_UNLIT)
  coord=mel.create_material_expression(m,u.MaterialExpressionTextureCoordinate);fit=mel.create_material_expression(m,u.MaterialExpressionCustom);fit.set_editor_property('code','float y=(U.y-.5)/.7734375+.5;return float3(U.x,1-y,step(0.,y)*step(y,1.));');fit.set_editor_property('output_type',u.CustomMaterialOutputType.CMOT_FLOAT3);ci=u.CustomInput();ci.set_editor_property('input_name','U');fit.set_editor_property('inputs',[ci]);assert mel.connect_material_expressions(coord,'',fit,'U')
  uv=mel.create_material_expression(m,u.MaterialExpressionComponentMask);mask=mel.create_material_expression(m,u.MaterialExpressionComponentMask)
  for channel in['r','g','b','a']:uv.set_editor_property(channel,channel in['r','g']);mask.set_editor_property(channel,channel=='b')
  for node in[uv,mask]:assert mel.connect_material_expressions(fit,'',node,'')
  sample=mel.create_material_expression(m,u.MaterialExpressionTextureSampleParameter2D);sample.set_editor_property('parameter_name','Program');sample.texture=texture;sample.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_COLOR;assert mel.connect_material_expressions(uv,'',sample,'UVs');power=mel.create_material_expression(m,u.MaterialExpressionScalarParameter);power.set_editor_property('parameter_name','Power');power.set_editor_property('default_value',1.)
  a=mel.create_material_expression(m,u.MaterialExpressionMultiply);b=mel.create_material_expression(m,u.MaterialExpressionMultiply)
  for left,right,pin in[(sample,a,'A'),(mask,a,'B'),(a,b,'A'),(power,b,'B')]:assert mel.connect_material_expressions(left,'RGB'if left==sample else'',right,pin)
  assert mel.connect_material_property(b,'',u.MaterialProperty.MP_EMISSIVE_COLOR);mel.recompile_material(m)
  for asset in[player,texture,m]:u.EditorAssetLibrary.save_loaded_asset(asset)
 return player,texture,m
def update(cache,data,state):
 if state is None:
  screen=next(a for a in cache.values()if isinstance(a,u.StaticMeshActor)and a.static_mesh_component.static_mesh and a.static_mesh_component.static_mesh.get_name()=='CRT_live_screen');player,texture,m=assets();mid=screen.static_mesh_component.create_dynamic_material_instance(0,m);mid.set_texture_parameter_value('Program',texture);state={'player':player,'texture':texture,'mid':mid,'work':None,'on':None,'source':None}
 work=max(0,min(4,int(data.get('roomWork',0))));on=bool(data.get('roomTV',True))
 if state['work']!=work:
  source=u.new_object(u.FileMediaSource);assert(P/FILES[work]).is_file();source.set_file_path(str(P/FILES[work]));state['source']=source;state['lastSeek']=time.monotonic();state['opened']=state['player'].open_source(source);state['work']=work
 if state['on']!=on:
  state['player'].play()if on else state['player'].pause();state['mid'].set_scalar_parameter_value('Power',1. if on else 0.);state['on']=on
 if state['player'].is_ready()and on and 'roomTime'in data:
  wanted=float(data['roomTime']);actual=u.MathLibrary.get_total_seconds(state['player'].get_time())
  if abs(wanted-actual)>2.5 and time.monotonic()-state.get('lastSeek',time.monotonic())>5.:
   state['player'].seek(u.MathLibrary.from_seconds(wanted));state['lastSeek']=time.monotonic()
 if time.monotonic()-state.get('reported',0)>1:
  state['reported']=time.monotonic();(P/'.verify/v32-163/room-media.json').write_text(json.dumps({'work':work,'on':on,'opened':state.get('opened'),'playing':state['player'].is_playing(),'ready':state['player'].is_ready(),'seconds':u.MathLibrary.get_total_seconds(state['player'].get_time()),'player':str(state['player'].get_player_name()),'textureWidth':state['texture'].get_width(),'uprightLetterbox':True,'nativeScreenSharesRoomCamera':True}))
 return state
