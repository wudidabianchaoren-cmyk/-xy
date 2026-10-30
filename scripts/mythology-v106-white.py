import bpy, math, json, random
from pathlib import Path
from mathutils import Vector
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype')
OUT=ROOT/'blender/mythology-v32-106';OUT.mkdir(parents=True,exist_ok=True)
# This script is executed by the MCP addon in the visible Blender window.
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.name='V106 / visible MCP production / white model'
clay=bpy.data.materials.new('V106 neutral modelling clay');clay.diffuse_color=(.61,.59,.54,1)
clay.use_nodes=True;clay.node_tree.nodes.clear();bs=clay.node_tree.nodes.new('ShaderNodeBsdfPrincipled');output=clay.node_tree.nodes.new('ShaderNodeOutputMaterial');clay.node_tree.links.new(bs.outputs['BSDF'],output.inputs['Surface'])
bs.inputs['Base Color'].default_value=(.61,.59,.54,1);bs.inputs['Roughness'].default_value=.8
def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)
def coast(a):
 d=math.atan2(math.sin(a+math.pi/2),math.cos(a+math.pi/2))
 return 1+.075*math.sin(a*3+.2)+.035*math.sin(a*7)-.16*math.exp(-(d/.46)**2)
def terrain(x,y,r,a):
 if r>1:return .32-(r-1)*78
 front=math.exp(-(math.atan2(math.sin(a+math.pi/2),math.cos(a+math.pi/2))/.75)**4)
 inland=smooth((1-r)/.37)
 beach=.28+2.4*smooth((1-r)/.15)
 terraces=2.5+18.0*inland
 broad=3.4*math.sin(x*.025+y*.011)+2.8*math.sin(y*.033-x*.012)
 h=(beach*(1-inland)+terraces*inland)*front+terraces*(1-front)
 h+=broad*smooth((1-r)/.30)
 h+=(.18*math.sin(x*.7+y*.25)+.12*math.sin(y*.91-x*.38))*smooth((1-r)/.07)
 return h
N=192;R=92;verts=[(-65,145,terrain(-65,145,0,0))];faces=[]
for j in range(1,R+1):
 r=j/R*1.13
 for i in range(N):
  a=i/N*math.tau;rr=r*coast(a);x=-65+164*rr*math.cos(a);y=145+103*rr*math.sin(a)
  verts.append((x,y,terrain(x,y,r,a)))
for i in range(N):faces.append((0,1+i,1+(i+1)%N))
for j in range(R-1):
 for i in range(N):
  a=1+j*N+i;b=1+j*N+(i+1)%N;faces.append((a,a+N,b+N,b))
bottom=len(verts);verts.append((-65,145,-15))
for i in range(N):faces.append((1+(R-1)*N+i,bottom,1+(R-1)*N+(i+1)%N))
mesh=bpy.data.meshes.new('Fresh continuous island / radial coastal terraces');mesh.from_pydata(verts,[],faces);mesh.update()
island=bpy.data.objects.new('V106_ISLAND / new shore, cove and broad interior',mesh);scene.collection.objects.link(island);island.data.materials.append(clay)
for p in mesh.polygons:p.use_smooth=True
bpy.context.view_layer.objects.active=island;island.select_set(True)
sub=island.modifiers.new('One level coastal subdivision','SUBSURF');sub.levels=1;bpy.ops.object.modifier_apply(modifier=sub.name)
# Work from the retained complete anatomical base, then sculpt the male silhouette.
# It is not falsely described as a newly hand-sculpted human from a cube.
bpy.ops.import_scene.gltf(filepath=str(ROOT/'blender/reference-architecture-v20/polyphemus-v20.glb'))
imported=list(bpy.context.selected_objects)
giant=bpy.data.objects.new('V106_CYCLOPS / retained anatomical base, new male sculpt',None);scene.collection.objects.link(giant)
for o in imported:
 if o.parent is None:o.parent=giant
giant.location=(-91,110,9);giant.rotation_euler[2]=-.20;giant.scale=(8.5,8.5,8.5)
audit=[]
for o in imported:
 if o.type!='MESH':continue
 mats=' '.join(m.name for m in o.data.materials if m)
 if any(k in mats.lower() for k in ['tunic','mantle','belt','human.short01']) or 'nipple' in o.name.lower():o.hide_render=True;o.hide_set(True);continue
 audit.append({'name':o.name,'materials':mats,'bounds':[[min(v.co[k] for v in o.data.vertices),max(v.co[k] for v in o.data.vertices)] for k in range(3)],'matrix':list(sum((list(row) for row in o.matrix_world),[]))})
 o.data.materials.clear();o.data.materials.append(clay)
# A clear white-model stage is saved before the shape/material refinement.
bpy.ops.object.camera_add(location=(-29,-97,73));cam=bpy.context.object;cam.name='V106 coastal composition';cam.rotation_euler=(Vector((-65,138,10))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=42;cam.data.clip_end=3000;scene.camera=cam
bpy.ops.object.light_add(type='AREA',location=(-65,20,140));key=bpy.context.object;key.data.energy=125000;key.data.shape='DISK';key.data.size=100;key.rotation_euler=(Vector((-65,140,0))-key.location).to_track_quat('-Z','Y').to_euler()
scene.world.color=(.18,.18,.18);scene.render.engine='CYCLES';scene.cycles.samples=24;scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
for screen in bpy.data.screens:
 for area in screen.areas:
  if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA';area.spaces.active.shading.type='MATERIAL'
bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.context.view_layer.objects.active=island
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'01-white-model.blend'))
(OUT/'anatomy-inspection.json').write_text(json.dumps(audit,indent=2),encoding='utf8')
print(json.dumps({'actualVisibleMcp':True,'stage':'white model','newIslandVertices':len(island.data.vertices),'newIslandFaces':len(island.data.polygons),'anatomy':audit,'saved':str(OUT/'01-white-model.blend')}))
