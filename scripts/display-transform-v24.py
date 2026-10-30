import bpy,json,pathlib,array,math
out=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/reference-architecture-v24');s=bpy.context.scene;n=33
values=array.array('f');scale=math.log2(4097)
for z in range(n):
 for y in range(n):
  for x in range(n):values.extend(((2**(x/(n-1)*scale)-1)/64,(2**(y/(n-1)*scale)-1)/64,(2**(z/(n-1)*scale)-1)/64,1))
im=bpy.data.images.new('Actual saved Blender display transform lattice',width=n*n,height=n,float_buffer=True);im.colorspace_settings.name='Linear Rec.709';im.pixels.foreach_set(values)
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.image_settings.color_depth='16';im.save_render(str(out/'display-transform.png'),scene=s)
result=bpy.data.images.load(str(out/'display-transform.png'));result.colorspace_settings.name='Non-Color';pixels=array.array('f',[0])*(n*n*n*4);result.pixels.foreach_get(pixels)
(out/'display-transform.bin').write_bytes(bytes(max(0,min(255,round(v*255))) for v in pixels))
meta={'size':n,'logScale':scale,'viewTransform':s.view_settings.view_transform,'look':s.view_settings.look,'exposureEV':s.view_settings.exposure,'displayDevice':s.display_settings.display_device,'format':'RGBA uint8, final sRGB display values','method':'Scene-linear lattice passed through the actual saved Blender view transform using image.save_render; no invented color grading'}
(out/'display-transform.json').write_text(json.dumps(meta,indent=2));print(json.dumps(meta))
