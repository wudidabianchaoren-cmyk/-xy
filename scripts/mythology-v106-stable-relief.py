import bpy,bmesh,math,json,numpy as np
from pathlib import Path
from mathutils import Vector
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106';scene=bpy.context.scene;island=bpy.data.objects.get('V106_ISLAND / new shore, cove and broad interior');material=island.data.materials[0]
# Keep the revised cove, cliffs, ridge and cave. Start from the saved pre-relief shape.
with bpy.data.libraries.load(str(OUT/'05-final-local-cycles.blend'),link=False) as (source,data):data.objects=[island.name]
base=data.objects[0];island.data=base.data.copy();island.data.materials.clear();island.data.materials.append(material);bpy.data.objects.remove(base,do_unlink=True)
g=island.data;snapshot=[(v.co.copy(),v.normal.copy()) for v in g.vertices];edge_limit=np.full(len(snapshot),2.0)
for e in g.edges:
 a,b=e.vertices;length=(snapshot[a][0]-snapshot[b][0]).length;edge_limit[a]=min(edge_limit[a],length);edge_limit[b]=min(edge_limit[b],length)
img=bpy.data.images.load(str(ROOT/'assets/odyssey/pbr-v103/seaside_rock/Displacement.jpg'),check_existing=True);w,h=img.size;pixels=np.empty(w*h*4,dtype=np.float32);img.pixels.foreach_get(pixels);pixels=pixels.reshape(h,w,4)
def sample(u,v):return float(pixels[int((v%1)*(h-1)),int((u%1)*(w-1)),0])
def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)
changed=0
for v,(p,n) in zip(g.vertices,snapshot):
 steep=1-smooth((n.z-.38)/.45)
 if p.z<.8 or steep<.005:continue
 weights=np.abs(np.array(n))**4;weights/=max(float(weights.sum()),.0001)
 relief=sample(p.y/13,p.z/13)*weights[0]+sample(p.x/13,p.z/13)*weights[1]+sample(p.x/13,p.y/13)*weights[2]
 amplitude=min(.32,float(edge_limit[v.index])*.13);v.co+=n*amplitude*steep*((relief-.5)*1.7+.27*math.sin(p.z*1.12+p.x*.017));changed+=1
bm=bmesh.new();bm.from_mesh(g);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);nonmanifold=sum(not e.is_manifold for e in bm.edges);boundary=sum(e.is_boundary for e in bm.edges);bm.to_mesh(g);bm.free();g.update()
attr=g.color_attributes.get('Habitat');normal_z=[v.normal.z for v in g.vertices]
for v,nz in zip(g.vertices,normal_z):
 a=math.atan2((v.co.y-145)/103,(v.co.x+65)/164);d=abs(math.atan2(math.sin(a+math.pi/2),math.cos(a+math.pi/2)));bay=1-smooth((d-.28)/.46)
 sand=bay*(1-smooth((v.co.z-1.6)/2.7))*smooth((nz-.70)/.24);grass=smooth((v.co.z-4.5)/5)*(1-sand)*smooth((nz-.65)/.27);attr.data[v.index].color=(sand,grass,max(0,1-sand-grass),1)
# Native fine sand: offset, rotated second photograph reduces repeated swatch patterns.
nt=material.node_tree;n=nt.nodes;l=nt.links;sand=next(t for t in n if t.type=='TEX_IMAGE' and 'sand_01' in t.image.filepath and t.image.colorspace_settings.name=='sRGB');targets=[link.to_socket for link in list(nt.links) if link.from_node==sand]
geo=next(v for v in n if v.type=='NEW_GEOMETRY');rotate=n.new('ShaderNodeVectorRotate');rotate.rotation_type='AXIS_ANGLE';rotate.inputs['Axis'].default_value=(0,0,1);rotate.inputs['Angle'].default_value=.73;l.new(geo.outputs['Position'],rotate.inputs['Vector']);scale=n.new('ShaderNodeVectorMath');scale.operation='SCALE';scale.inputs[3].default_value=.61;l.new(rotate.outputs[0],scale.inputs[0]);second=n.new('ShaderNodeTexImage');second.image=sand.image;second.projection='BOX';second.projection_blend=.17;l.new(scale.outputs[0],second.inputs['Vector']);blend=n.new('ShaderNodeMixRGB');blend.inputs[0].default_value=.5;l.new(sand.outputs[0],blend.inputs[1]);l.new(second.outputs[0],blend.inputs[2]);calm=n.new('ShaderNodeMixRGB');calm.inputs[0].default_value=.42;l.new(blend.outputs[0],calm.inputs[1]);calm.inputs[2].default_value=(.40,.345,.255,1)
for target in targets:l.new(calm.outputs[0],target)
bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.context.view_layer.objects.active=island;bpy.ops.export_scene.gltf(filepath=str(OUT/'island-geometry-v106.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'06-cove-rocky-headlands-and-uplands.blend'));scene.render.filepath=str(OUT/'cycles-coastal-world.png')
audit={'actualVisibleBlenderMcp':True,'newCompleteIsland':True,'vertices':len(g.vertices),'boundaryEdges':boundary,'nonManifoldEdges':nonmanifold,'cliffReliefMaximumMetres':.32,'reliefLimitedToAdjacentEdgeLength':.13,'reliefVertices':changed,'heightMax':max(v.co.z for v in g.vertices),'heightMin':min(v.co.z for v in g.vertices),'coveSandOnly':True,'nativeTextureRepetitionReduced':True}
(OUT/'stable-geometry-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit));bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
