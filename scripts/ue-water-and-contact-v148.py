"""One local water-material pass and clear actual rower contact photograph."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]
exec((P/'scripts/ue-lookdev-v146.py').read_text(encoding='utf-8').split('try:\n u.SystemLibrary.execute_console_command')[0])
P=Path(__file__).resolve().parents[1];V=P/'.verify/v32-147';u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV147');ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=ed.get_editor_world();m=assets.load_asset('/Game/Cove/V147_Sea');mel.delete_all_material_expressions(m);wp=mel.create_material_expression(m,u.MaterialExpressionWorldPosition)
def scalar(val):
 n=mel.create_material_expression(m,u.MaterialExpressionConstant);n.r=val;return n
def color(rgb):
 n=mel.create_material_expression(m,u.MaterialExpressionConstant3Vector);n.constant=u.LinearColor(*rgb,1);return n
coords=[]
for vec in [(1,0,0),(0,1,0)]:
 d=mel.create_material_expression(m,u.MaterialExpressionDotProduct);c=color(vec);mel.connect_material_expressions(wp,'',d,'A');mel.connect_material_expressions(c,'',d,'B');coords.append(d)
uv=mel.create_material_expression(m,u.MaterialExpressionAppendVector);mel.connect_material_expressions(coords[0],'',uv,'A');mel.connect_material_expressions(coords[1],'',uv,'B');tx=assets.load_asset('/Game/Cove/V147_Sea_Normal');tx.set_editor_property('compression_settings',u.TextureCompressionSettings.TC_NORMALMAP);tx.set_editor_property('srgb',False);assets.save_loaded_asset(tx);normals=[]
for wavelength in [350.,85.]:
 d=mel.create_material_expression(m,u.MaterialExpressionDivide);mel.connect_material_expressions(uv,'',d,'A');mel.connect_material_expressions(scalar(wavelength),'',d,'B');n=mel.create_material_expression(m,u.MaterialExpressionTextureSample);n.texture=tx;n.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_NORMAL;mel.connect_material_expressions(d,'',n,'UVs');normals.append(n)
fine=mel.create_material_expression(m,u.MaterialExpressionMultiply);mel.connect_material_expressions(normals[1],'RGB',fine,'A');mel.connect_material_expressions(scalar(.40),'',fine,'B');add=mel.create_material_expression(m,u.MaterialExpressionAdd);mel.connect_material_expressions(normals[0],'RGB',add,'A');mel.connect_material_expressions(fine,'',add,'B');scale=mel.create_material_expression(m,u.MaterialExpressionMultiply);mel.connect_material_expressions(add,'',scale,'A');mel.connect_material_expressions(color((.82,.82,1.)),'',scale,'B');normalize=mel.create_material_expression(m,u.MaterialExpressionNormalize);assert mel.connect_material_expressions(scale,'',normalize,'');mel.connect_material_property(normalize,'',u.MaterialProperty.MP_NORMAL)
variation=mel.create_material_expression(m,u.MaterialExpressionAdd);mel.connect_material_expressions(normals[0],'R',variation,'A');mel.connect_material_expressions(scalar(1.),'',variation,'B');half=mel.create_material_expression(m,u.MaterialExpressionMultiply);mel.connect_material_expressions(variation,'',half,'A');mel.connect_material_expressions(scalar(.5),'',half,'B');tint=mel.create_material_expression(m,u.MaterialExpressionLinearInterpolate);mel.connect_material_expressions(color((.012,.115,.16)),'',tint,'A');mel.connect_material_expressions(color((.024,.235,.225)),'',tint,'B');mel.connect_material_expressions(half,'',tint,'Alpha');mel.connect_material_property(tint,'',u.MaterialProperty.MP_BASE_COLOR);mel.connect_material_property(scalar(.18),'',u.MaterialProperty.MP_ROUGHNESS);mel.connect_material_property(scalar(.25),'',u.MaterialProperty.MP_SPECULAR);mel.recompile_material(m);assets.save_loaded_asset(m)
cams={a.get_actor_label():a for a in actors.get_all_level_actors() if isinstance(a,u.CineCameraActor)};cam=cams['V148 actual rower grip'];cam.set_actor_location(u.Vector(-80,720,380),False,False);cam.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cam.get_actor_location(),u.Vector(-500,910,150)),False);cam.get_cine_camera_component().set_editor_property('current_focal_length',45.);full=cams['Full cove'];ed.set_level_viewport_camera_info(full.get_actor_location(),full.get_actor_rotation());u.SystemLibrary.execute_console_command(world,'r.DepthOfFieldQuality 0');u.SystemLibrary.execute_console_command(world,'r.Streaming.PoolSize 2000');u.SystemLibrary.execute_console_command(world,'r.Streaming.FullyLoadUsedTextures 1');assets.save_directory('/Game/Cove');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV147');start=time.monotonic();phase=0;handle=None
def tick(dt):
 global phase,handle
 t=time.monotonic()-start
 if phase==0 and t>50:u.AutomationLibrary.take_high_res_screenshot(2560,1440,str(V/'ue-cove-water-v148.png'),camera=full);phase=1
 elif phase==1 and t>65:ed.set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation());phase=2
 elif phase==2 and t>85:u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V/'ue-rower-contact-v148.png'),camera=cam);phase=3
 elif phase==3 and t>100:
  (V/'ue-water-v148.json').write_text(json.dumps({'normalTextures':2,'coordinates':'actual world XY / 350cm + 85cm','roughness':.18,'specular':.25,'largeWaterSystemAdded':False,'savedNative':'/Game/Cove/FullCoveV147','captures':['ue-cove-water-v148.png','ue-rower-contact-v148.png'],'requiresVisualReview':True}),encoding='utf-8');u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
handle=u.register_slate_post_tick_callback(tick)
