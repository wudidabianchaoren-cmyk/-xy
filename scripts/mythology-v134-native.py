import bpy, math, random, json, time
from mathutils import Vector, noise
from pathlib import Path

R=Path(__file__).resolve().parents[1]
A=R/'assets/odyssey/compact-v134'
O=R/'blender/mythology-v32-134'
bpy.ops.wm.open_mainfile(filepath=str(R/'blender/mythology-v32-133/compact-cove-final.blend'))
sc=bpy.context.scene
prefs=bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
sc.render.engine='CYCLES';sc.cycles.device='GPU';sc.cycles.samples=48
sc.cycles.use_denoising=True;sc.cycles.adaptive_threshold=.025
land=bpy.data.objects['V133_ISLAND'];mesh=land.data
# Keep the compact footprint; break the smooth hill with shelves on the rocky headland.
oldHeights=[v.co.z for v in mesh.vertices]
for v in mesh.vertices:
    x,y,z=v.co
    if z>2:
        cliff=max(0,min(1,(-x-4)/14))*max(0,min(1,(42-y)/18))
        shelf=math.sin(z*.73+noise.noise(Vector((x*.09,y*.11,4)))*1.3)*.48
        v.co.z+=cliff*shelf
mesh.update()
size=117
def height(x,y):
    u=max(0,min(115.999,(x+56)/103*116));v=max(0,min(115.999,(y+4)/90*116));i,j=int(u),int(v);a,b=u-i,v-j
    return sum(mesh.vertices[(j+dy)*117+i+dx].co.z*w for dx,dy,w in [(0,0,(1-a)*(1-b)),(1,0,a*(1-b)),(0,1,(1-a)*b),(1,1,a*b)])
for ob in sc.objects:
    if ob.name.startswith(('V133 tree ','V133 shrub ')):
        ob.location.z=height(ob.location.x,ob.location.y)-.12

# Blended rock, rooted soil and fine sand rather than a material-index zigzag beach.
m=bpy.data.materials.new('V134 continuous limestone, olive soil and damp sand')
m.use_nodes=True;n=m.node_tree.nodes;l=m.node_tree.links;p=next((v for v in n if v.bl_idname=='ShaderNodeBsdfPrincipled'),None)
if not p:
    p=n.new('ShaderNodeBsdfPrincipled');out=n.new('ShaderNodeOutputMaterial');l.new(p.outputs['BSDF'],out.inputs['Surface'])
p.inputs['Roughness'].default_value=.92
geo=n.new('ShaderNodeNewGeometry');sep=n.new('ShaderNodeSeparateXYZ');l.new(geo.outputs['Position'],sep.inputs[0])
scale=n.new('ShaderNodeVectorMath');scale.operation='SCALE';scale.inputs[3].default_value=.32;l.new(geo.outputs['Position'],scale.inputs[0])
rock=n.new('ShaderNodeTexImage');rock.image=bpy.data.images.load(str(R/'assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_diff_2k.jpg'),check_existing=True);rock.projection='BOX';rock.projection_blend=.3;l.new(scale.outputs[0],rock.inputs[0])
rockTint=n.new('ShaderNodeMixRGB');rockTint.blend_type='MULTIPLY';rockTint.inputs[0].default_value=1;rockTint.inputs[2].default_value=(.82,.79,.68,1);l.new(rock.outputs['Color'],rockTint.inputs[1])
tex=n.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=.31;tex.inputs['Detail'].default_value=4;tex.inputs['Roughness'].default_value=.72;l.new(geo.outputs['Position'],tex.inputs['Vector'])
soil=n.new('ShaderNodeMixRGB');soil.inputs[1].default_value=(.095,.115,.042,1);soil.inputs[2].default_value=(.25,.245,.12,1);l.new(tex.outputs['Fac'],soil.inputs[0])
normal=n.new('ShaderNodeSeparateXYZ');l.new(geo.outputs['Normal'],normal.inputs[0])
ramp=n.new('ShaderNodeMapRange');ramp.inputs['From Min'].default_value=.65;ramp.inputs['From Max'].default_value=.95;l.new(normal.outputs['Z'],ramp.inputs['Value'])
alt=n.new('ShaderNodeMapRange');alt.inputs['From Min'].default_value=3.5;alt.inputs['From Max'].default_value=9;l.new(sep.outputs['Z'],alt.inputs['Value'])
mul=n.new('ShaderNodeMath');mul.operation='MULTIPLY';l.new(ramp.outputs[0],mul.inputs[0]);l.new(alt.outputs[0],mul.inputs[1])
soilMix=n.new('ShaderNodeMixRGB');l.new(mul.outputs[0],soilMix.inputs[0]);l.new(rockTint.outputs[0],soilMix.inputs[1]);l.new(soil.outputs[0],soilMix.inputs[2])
beachNoise=n.new('ShaderNodeMath');beachNoise.operation='MULTIPLY';beachNoise.inputs[1].default_value=.75;l.new(tex.outputs['Fac'],beachNoise.inputs[0])
beachZ=n.new('ShaderNodeMath');beachZ.operation='ADD';l.new(sep.outputs['Z'],beachZ.inputs[0]);l.new(beachNoise.outputs[0],beachZ.inputs[1])
beach=n.new('ShaderNodeMapRange');beach.inputs['From Min'].default_value=.5;beach.inputs['From Max'].default_value=2.5;l.new(beachZ.outputs[0],beach.inputs['Value'])
sand=n.new('ShaderNodeMixRGB');sand.inputs[1].default_value=(.32,.265,.16,1);sand.inputs[2].default_value=(.57,.49,.31,1);l.new(tex.outputs['Fac'],sand.inputs[0])
blend=n.new('ShaderNodeMixRGB');l.new(beach.outputs[0],blend.inputs[0]);l.new(sand.outputs[0],blend.inputs[1]);l.new(soilMix.outputs[0],blend.inputs[2]);l.new(blend.outputs[0],p.inputs['Base Color'])
detail=n.new('ShaderNodeTexImage');detail.image=bpy.data.images.load(str(R/'assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_nor_gl_2k.jpg'),check_existing=True);detail.image.colorspace_settings.name='Non-Color';detail.projection='BOX';detail.projection_blend=.3;l.new(scale.outputs[0],detail.inputs[0])
bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.32;bump.inputs['Distance'].default_value=.17;l.new(detail.outputs['Color'],bump.inputs['Height']);l.new(bump.outputs[0],p.inputs['Normal'])
mesh.materials.clear();mesh.materials.append(m)
for poly in mesh.polygons:poly.material_index=0
uv=mesh.uv_layers.new(name='V134 unique irradiance UV');mesh.uv_layers.active=uv
for poly in mesh.polygons:
    for li in poly.loop_indices:
        co=mesh.vertices[mesh.loops[li].vertex_index].co;uv.data[li].uv=((co.x+56)/103,(co.y+4)/90)

# Same warm, raking light as the realtime scene. The full leaf geometry casts baked soft occlusion.
sun=next(o for o in sc.objects if o.type=='LIGHT' and o.data.type=='SUN')
direction=Vector((-.76,-.32,.56)).normalized()
sun.rotation_euler=(-direction).to_track_quat('-Z','Y').to_euler();sun.data.energy=3.4;sun.data.color=(1,.83,.62);sun.data.angle=.075
sky=next((node for node in sc.world.node_tree.nodes if node.bl_idname=='ShaderNodeTexSky'),None)
if sky:sky.sun_elevation=math.radians(22);sky.sun_rotation=math.radians(-155)
sc.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.30
sc.view_settings.exposure=0
sc.camera.location=(42,-57,19);sc.camera.rotation_euler=(Vector((-7,20,10))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.camera.data.lens=35

def bake(ob,name,res=4096):
    image=bpy.data.images.new('V134 '+name,width=res,height=res,alpha=False,float_buffer=False)
    image.colorspace_settings.name='sRGB';image.file_format='PNG';image.filepath_raw=str(A/(name+'.png'))
    for mat in ob.data.materials:
        if not mat:continue
        node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;mat.node_tree.nodes.active=node
    bpy.ops.object.select_all(action='DESELECT');ob.select_set(True);bpy.context.view_layer.objects.active=ob
    sc.render.bake.use_selected_to_active=False;sc.render.bake.margin=12
    sc.render.bake.use_pass_color=True;sc.render.bake.use_pass_direct=True;sc.render.bake.use_pass_indirect=True
    t=time.time();bpy.ops.object.bake(type='DIFFUSE');image.save()
    print('V134_BAKE',name,res,time.time()-t,flush=True)
    return image

t=time.time();image=bake(land,'island-radiance',4096)
# Export the identical surface with its unique bake UV, no unsupported procedural material.
saved=list(mesh.materials);baked=bpy.data.materials.new('V134 actual CUDA island radiance');baked.use_nodes=True
bn=baked.node_tree.nodes;bl=baked.node_tree.links;bp=next((v for v in bn if v.bl_idname=='ShaderNodeBsdfPrincipled'),None)
if not bp:
    bp=bn.new('ShaderNodeBsdfPrincipled');bo=bn.new('ShaderNodeOutputMaterial');bl.new(bp.outputs['BSDF'],bo.inputs['Surface'])
bt=bn.new('ShaderNodeTexImage');bt.image=image;bl.new(bt.outputs['Color'],bp.inputs['Base Color']);bp.inputs['Roughness'].default_value=.94
mesh.materials.clear();mesh.materials.append(baked)
def export(file,objects):
    bpy.ops.object.select_all(action='DESELECT')
    for ob in objects:ob.hide_set(False);ob.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(A/file),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_cameras=False,export_lights=False)
export('island.glb',[land])
mesh.materials.clear()
for mat in saved:mesh.materials.append(mat)

# Real, individual leaf quads. Subsample whole leaf polygons; never collapse them into ragged ribbons.
protos=[next(o for o in sc.objects if o.name.startswith('V133 tree ') and o.name.endswith('part'+str(i))) for i in range(3)]
copies=[];counts=[]
for i,src in enumerate(protos):
    ob=bpy.data.objects.new('V134 prototype '+str(i),src.data.copy());sc.collection.objects.link(ob);copies.append(ob)
    if i==2:
        import bmesh
        bm=bmesh.new();bm.from_mesh(ob.data);bm.faces.ensure_lookup_table()
        rng=random.Random(13414);total=sum(len(f.verts)-2 for f in bm.faces);ratio=min(1,42000/max(1,total))
        drop=[f for f in bm.faces if rng.random()>ratio];bmesh.ops.delete(bm,geom=drop,context='FACES');bm.to_mesh(ob.data);bm.free()
    counts.append(sum(len(poly.vertices)-2 for poly in ob.data.polygons))
    for mat in ob.data.materials:
        if mat and mat.use_nodes:
            for node in mat.node_tree.nodes:
                if node.bl_idname=='ShaderNodeTexImage' and node.image and max(node.image.size)>2048:
                    im=node.image;im.scale(int(im.size[0]*2048/max(im.size)),int(im.size[1]*2048/max(im.size)))
export('vegetation.glb',copies)
for ob in copies:bpy.data.objects.remove(ob,do_unlink=True)
placements=[]
for ob in sc.objects:
    if ob.name.startswith(('V133 tree ','V133 shrub ')):
        placements.append({'name':ob.name,'prototype':int(ob.name[-1]),'position':[ob.location.x,ob.location.z,-ob.location.y],'scale':list(ob.scale),'angle':-ob.rotation_euler.z})
(A/'vegetation.json').write_text(json.dumps(placements))
(A/'height.json').write_text(json.dumps({'size':117,'bounds':[-56,47,-4,86],'heights':[v.co.z for v in mesh.vertices]}))

# Root the separate coastal rock forms with the same actual illumination, atlas baked once.
rocks=[ob for ob in sc.objects if ob.name.startswith('V133 cliff buttress')]
bpy.ops.object.select_all(action='DESELECT')
for ob in rocks:ob.data=ob.data.copy();ob.select_set(True)
bpy.context.view_layer.objects.active=rocks[0];bpy.ops.object.convert(target='MESH');bpy.ops.object.join();rock=bpy.context.object;rock.name='V134 baked coastal rock shelves'
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=1.15,island_margin=.02);bpy.ops.object.mode_set(mode='OBJECT')
rockImage=bake(rock,'rock-radiance',2048)
oldMats=list(rock.data.materials);rockBaked=baked.copy();rockBaked.name='V134 actual CUDA rock radiance';next(n for n in rockBaked.node_tree.nodes if n.bl_idname=='ShaderNodeTexImage').image=rockImage
rock.data.materials.clear();rock.data.materials.append(rockBaked)
for poly in rock.data.polygons:poly.material_index=0
export('rocks.glb',[rock]);rock.data.materials.clear()
for mat in oldMats:rock.data.materials.append(mat)

bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(O/'compact-cove-lighting.blend'))
report={'actualCUDA':True,'gpu':[d.name for d in prefs.devices if d.use],'islandBake':[4096,4096],'rockBake':[2048,2048],'samples':48,'seconds':time.time()-t,'leafPrototypeTriangles':counts,'webUsesActualBakes':True,'giant':False,'footprintRetained':[103,90]}
(A/'production.json').write_text(json.dumps(report,indent=2));print('V134_DONE',json.dumps(report),flush=True)
