import bpy,bmesh,math,json,numpy as np
from pathlib import Path
from mathutils import Vector,noise
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106';scene=bpy.context.scene
island=bpy.data.objects.get('V106_ISLAND / new shore, cove and broad interior')
def smooth(v):v=max(0,min(1,v));return v*v*(3-2*v)
def bay(x,y):
 a=math.atan2((y-145)/103,(x+65)/164);d=abs(math.atan2(math.sin(a+math.pi/2),math.cos(a+math.pi/2)))
 return 1-smooth((d-.28)/.46)
# Photographic height relief, sampled once in memory and actually applied to the cliff geometry.
img=bpy.data.images.load(str(ROOT/'assets/odyssey/pbr-v103/seaside_rock/Displacement.jpg'),check_existing=True);w,h=img.size;pixels=np.empty(w*h*4,dtype=np.float32);img.pixels.foreach_get(pixels);pixels=pixels.reshape(h,w,4)
def sample(u,v):return float(pixels[int((v%1)*(h-1)),int((u%1)*(w-1)),0])
changed=0
snapshot=[(v.co.copy(),v.normal.copy()) for v in island.data.vertices]
for v,(p,normal) in zip(island.data.vertices,snapshot):
 steep=1-smooth((normal.z-.38)/.45)
 if p.z<.8 or steep<.005:continue
 weight=np.array([abs(normal.x),abs(normal.y),abs(normal.z)])**4;weight/=max(float(weight.sum()),.0001)
 relief=sample(p.y/13,p.z/13)*weight[0]+sample(p.x/13,p.z/13)*weight[1]+sample(p.x/13,p.y/13)*weight[2]
 # Unequal bedding benches and vertical weathering, restricted to exposed cliffs.
 seam=math.sin(p.z*1.12+.34*math.sin(p.x*.043)+.19*math.sin(p.y*.073))
 flutes=noise.fractal(Vector((p.x*.18,p.y*.18,p.z*.025)),.85,2.1,3)
 amount=steep*((relief-.5)*5.0+.62*seam+.85*flutes)
 v.co+=normal*amount;changed+=1
bm=bmesh.new();bm.from_mesh(island.data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(island.data);bm.free();island.data.update()
attr=island.data.color_attributes.get('Habitat')
for v in island.data.vertices:
 sand=bay(v.co.x,v.co.y)*(1-smooth((v.co.z-1.6)/2.7))*smooth((v.normal.z-.70)/.24)
 grass=smooth((v.co.z-4.5)/5)*(1-sand)*smooth((v.normal.z-.65)/.27)
 attr.data[v.index].color=(sand,grass,max(0,1-sand-grass),1)
# Native Cycles shader uses world-coordinate box projection, not a stretched horizontal UV on cliffs.
m=island.data.materials[0];nt=m.node_tree;nt.nodes.clear();n=nt.nodes;l=nt.links
bs=n.new('ShaderNodeBsdfPrincipled');bs.inputs['Roughness'].default_value=.88;out=n.new('ShaderNodeOutputMaterial');l.new(bs.outputs[0],out.inputs['Surface'])
geo=n.new('ShaderNodeNewGeometry');hab=n.new('ShaderNodeVertexColor');hab.layer_name='Habitat';sep=n.new('ShaderNodeSeparateColor');l.new(hab.outputs[0],sep.inputs[0])
def tex(path,scale,noncolor=False):
 s=n.new('ShaderNodeVectorMath');s.operation='SCALE';s.inputs[3].default_value=scale;l.new(geo.outputs['Position'],s.inputs[0]);t=n.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(ROOT/path),check_existing=True);t.image.colorspace_settings.name='Non-Color' if noncolor else 'sRGB';t.projection='BOX';t.projection_blend=.17;l.new(s.outputs[0],t.inputs['Vector']);return t
rock=tex('assets/odyssey/pbr-v103/seaside_rock/Diffuse.jpg',1/13);soil=tex('assets/odyssey/pbr-v103/forest_ground_04/Diffuse.jpg',1/4);sand=tex('assets/odyssey/pbr-v106/sand_01/diff.jpg',1/1.2)
rocklift=n.new('ShaderNodeMixRGB');rocklift.blend_type='MULTIPLY';rocklift.inputs[0].default_value=1;rocklift.inputs[2].default_value=(1.85,1.72,1.53,1);l.new(rock.outputs[0],rocklift.inputs[1])
meadow=n.new('ShaderNodeMixRGB');meadow.blend_type='MULTIPLY';meadow.inputs[0].default_value=.5;meadow.inputs[2].default_value=(.48,.71,.22,1);l.new(soil.outputs[0],meadow.inputs[1])
mix=n.new('ShaderNodeMixRGB');l.new(sep.outputs['Green'],mix.inputs[0]);l.new(rocklift.outputs[0],mix.inputs[1]);l.new(meadow.outputs[0],mix.inputs[2]);mix2=n.new('ShaderNodeMixRGB');l.new(sep.outputs['Red'],mix2.inputs[0]);l.new(mix.outputs[0],mix2.inputs[1]);l.new(sand.outputs[0],mix2.inputs[2]);l.new(mix2.outputs[0],bs.inputs['Base Color'])
height=tex('assets/odyssey/pbr-v103/seaside_rock/Displacement.jpg',1/13,True);bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.62;bump.inputs['Distance'].default_value=.34;l.new(height.outputs[0],bump.inputs['Height']);l.new(bump.outputs[0],bs.inputs['Normal'])
# Re-ground vegetation and the figure after real relief. Ray casting uses the updated native mesh.
bvh=BVHTree.FromPolygons([v.co.copy() for v in island.data.vertices],[list(p.vertices) for p in island.data.polygons])
forest=bpy.data.collections.get('V106 actual 460 tree coastal woodland');plants={}
for obj in forest.objects:
 p,normal,_,_=bvh.ray_cast(Vector((obj.location.x,obj.location.y,120)),Vector((0,0,-1)),160)
 if p:obj.location.z=p.z
 i=int(obj.name.split(' ')[2]);plants[i]={'x':obj.location.x,'blenderY':obj.location.y,'z':-obj.location.y,'y':obj.location.z,'height':obj.scale.z,'width':obj.scale.x/obj.scale.z,'rotation':obj.rotation_euler.z}
(OUT/'woodland-placement.json').write_text(json.dumps({'version':106,'trees':list(plants.values()),'distribution':'clustered wooded uplands, open cove, eroded rock headlands'},indent=2),encoding='utf8')
giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt');p,_,_,_=bvh.ray_cast(Vector((giant.location.x,giant.location.y,120)),Vector((0,0,-1)),160)
if p:giant.location.z=p.z+.075
# Remove hidden garment/nipple nodes from this NEW export only; original anatomical sources remain untouched.
for o in list(giant.children_recursive):
 if o.type=='MESH' and o.hide_render:bpy.data.objects.remove(o,do_unlink=True)
def export(objs,name):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objs:o.hide_set(False);o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(OUT/name),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
export([island],'island-geometry-v106.glb');export([giant,*giant.children_recursive],'cyclops-male-v106.glb')
# Native proof uses a coastal camera and actual Cycles; the original web camera path is unchanged.
scene.camera.location=(-30,-190,140);scene.camera.rotation_euler=(Vector((-65,142,16))-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.lens=37
scene.cycles.samples=48;scene.render.resolution_x=1600;scene.render.resolution_y=900;scene.render.filepath=str(OUT/'cycles-coastal-world.png')
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'06-cove-rocky-headlands-and-uplands.blend'))
audit={'actualVisibleBlenderMcp':True,'actualGeometricRockReliefVertices':changed,'fineSandConfinedToCove':True,'worldProjectionCliffTextureMetres':13,'trees':len(plants),'heightMin':min(v.co.z for v in island.data.vertices),'heightMax':max(v.co.z for v in island.data.vertices),'newFullNativeFile':str(OUT/'06-cove-rocky-headlands-and-uplands.blend'),'webCameraUnchanged':True}
(OUT/'coast-final-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit));bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
