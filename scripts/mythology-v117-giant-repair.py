"""Focused native repair; root calls repair_giant(ROOT,OUT), once. No render/export.

Keeps ONE existing giant object and current transforms/material ownership. Loads
only V112 body mesh into the existing object, then repairs inherited flat chest
caps and inward hide/hair normals. Does not restore the rest of the old scene.
"""
import bpy, bmesh, math, json
from pathlib import Path
from mathutils import Vector
from mathutils.kdtree import KDTree


def repair_giant(root,out):
    root,out=Path(root),Path(out)
    scene=bpy.context.scene
    if scene.get('v117_giant_repair_complete'):raise RuntimeError('Repair already completed; do not repeat')
    giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt')
    if not giant:raise RuntimeError('Original giant root missing')
    body=next(o for o in giant.children_recursive if o and o.type=='MESH' and 'Human.body' in o.name)
    source=root/'blender/mythology-v32-112/06-local-cycles-detailed-canopy.blend'
    original_name=body.name
    retained_mats=[slot.material for slot in body.material_slots]
    # An unlinked library object is used ONLY to extract data. No second giant
    # or old scenery is linked into the active scene.
    with bpy.data.libraries.load(str(source),link=False) as (src,dst):
        if original_name not in src.objects:raise RuntimeError('Source body not found '+original_name)
        dst.objects=[original_name]
    carrier=dst.objects[0]
    body.data=carrier.data.copy()
    bpy.data.objects.remove(carrier,do_unlink=True)
    body.data.materials.clear()
    for m in retained_mats:
        if m:body.data.materials.append(m)
    bm=bmesh.new();bm.from_mesh(body.data)
    uv=bm.loops.layers.uv.active
    # Historical two n-gon hole fills had constant UVs and planar triangulation.
    # Work only in the torso and preserve all surrounding original topology.
    caps=[f for f in bm.faces if len(f.verts)>6
          and all(1.03<v.co.z<1.46 and abs(v.co.x)<.24 and v.co.y<-.055 for v in f.verts)]
    samples=[]
    if uv:
        for v in bm.verts:
            if 1.0<v.co.z<1.5 and abs(v.co.x)<.28 and v.co.y<-.05:
                loops=[l for l in v.link_loops if l.face not in caps]
                if loops:samples.append((v.co.copy(),sum((l[uv].uv.copy() for l in loops),Vector((0,0)))/len(loops)))
    # Triangulate caps and subdivide internal patch edges only; no T-junctions
    # are introduced along the existing torso perimeter.
    triangles=bmesh.ops.triangulate(bm,faces=caps,quad_method='BEAUTY',ngon_method='BEAUTY').get('faces',[])
    patch_set=set(triangles)
    interior=[e for e in bm.edges if len(e.link_faces)==2 and all(f in patch_set for f in e.link_faces)]
    if interior:bmesh.ops.subdivide_edges(bm,edges=interior,cuts=2,use_grid_fill=False)
    changed=0
    for v in bm.verts:
        x,y,z=v.co
        if abs(x)<.24 and 1.03<z<1.46 and y<-.065:
            # Broad thorax relief, continuous falloff at every border. Never
            # flatten to a Y plane, never add paired spherical breast volumes.
            w=math.sin(math.pi*(z-1.03)/.43)**2*max(0,1-(abs(x)/.24)**2)**2
            relief=.012*w
            v.co.y-=relief;changed+=1
    if uv and samples:
        kd=KDTree(len(samples))
        for i,(co,_) in enumerate(samples):kd.insert(co,i)
        kd.balance()
        for f in bm.faces:
            if not all(1.03<v.co.z<1.46 and abs(v.co.x)<.24 and v.co.y<-.055 for v in f.verts):continue
            for loop in f.loops:
                old=loop[uv].uv
                # Only replace the documented constant-filled or generated UVs.
                if (old-Vector((.02,.98))).length<.03 or loop.vert.index>=13307:
                    near=kd.find_n(loop.vert.co,4);total=0;value=Vector((0,0))
                    for _,i,d in near:
                        weight=1/max(d,.001)**2;total+=weight;value+=samples[i][1]*weight
                    loop[uv].uv=value/max(total,1e-9)
    # Gentle Gaussian brow below forehead; original eye assembly stays single.
    brow=0
    for v in bm.verts:
        x,y,z=v.co
        if y<-.075 and 1.62<z<1.67 and abs(x)<.11:
            w=math.exp(-((x+.004)/.068)**2-((z-1.645)/.011)**2)
            v.co.y-=.005*w;brow+=1
    bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
    for face in bm.faces:face.smooth=True
    bm.to_mesh(body.data);bm.free();body.data.update()
    # Direct actual anatomical skin atlas: previous giant material had NO image
    # in its saved native graph, accounting for its smooth uniformly pale skin.
    atlaspath=root/'assets/odyssey/pbr-v103/skin-atlas.png'
    mat=bpy.data.materials.new('V117 repaired anatomical UV skin / actual atlas');mat.use_nodes=True
    n,l=mat.node_tree.nodes,mat.node_tree.links
    bs=next(x for x in n if x.type=='BSDF_PRINCIPLED');bs.inputs['Roughness'].default_value=.79
    bs.inputs['Subsurface Weight'].default_value=.035;bs.inputs['Specular IOR Level'].default_value=.2
    tex=n.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(atlaspath),check_existing=True)
    tex.image.colorspace_settings.name='sRGB';l.new(tex.outputs['Color'],bs.inputs['Base Color'])
    for obj in giant.children_recursive:
        if not obj or obj.type!='MESH':continue
        if any(k in obj.name.lower() for k in ['human.body','human.ears']):
            if not obj.data.materials:obj.data.materials.append(mat)
            for slot in obj.material_slots:slot.link='OBJECT';slot.material=mat
    # Rebuild the SAME hide mesh with outward continuous winding, more drape
    # samples and irregular hem; preserve object, material and parent identity.
    hide=next((o for o in giant.children_recursive if o and o.type=='MESH' and 'rough hide waist wrap' in o.name),None)
    if hide:
        vv=[];ff=[];n=128;rows=12
        for row in range(rows+1):
            t=row/rows
            for i in range(n):
                a=i*math.tau/n;r=.186+.032*t+.0035*math.sin(a*9+.35)*math.sin(t*math.pi*.8)
                z=.915-.275*t-.013*math.sin(a*7+.4)*t**3
                vv.append((math.cos(a)*r,math.sin(a)*r*.72,z))
        for row in range(rows):
            for i in range(n):
                a=row*n+i;b=row*n+(i+1)%n;ff.append((a,a+n,b+n,b))
        oldm=[m for m in hide.data.materials if m]
        d=bpy.data.meshes.new('V117 repaired outward hide with continuous folds');d.from_pydata(vv,[],ff);d.update()
        hide.data=d
        for m in oldm:d.materials.append(m)
        uvh=d.uv_layers.new(name='HideUV')
        for p in d.polygons:
            p.use_smooth=True
            for li in p.loop_indices:
                vi=d.loops[li].vertex_index;row,i=divmod(vi,n);u=i/n
                if i==0 and any(d.loops[k].vertex_index%n==n-1 for k in p.loop_indices):u=1
                uvh.data[li].uv=(u,row/rows)
        for mod in hide.modifiers:
            if mod.type=='SOLIDIFY':mod.thickness=.0025;mod.offset=-1
    hair_flipped=[]
    for obj in giant.children_recursive:
        if not obj or obj.type!='MESH' or not obj.name.startswith('V117 cyclops rooted coarse'):continue
        bm=bmesh.new();bm.from_mesh(obj.data);bmesh.ops.reverse_faces(bm,faces=list(bm.faces));bm.to_mesh(obj.data);bm.free();obj.data.update()
        for m in obj.data.materials:
            if m:m.use_backface_culling=False
        hair_flipped.append(obj.name)
    audit={'source':str(source),'restoredBodyObject':body.name,'bodyTransformPreserved':True,
           'flatHistoricalCapFacesRepaired':len(caps),'continuousThoraxVertices':changed,
           'gentleBrowVertices':brow,'noPlanarClamp':True,'skinAtlas':str(atlaspath),
           'hideTopology':{'angularSegments':128,'heightRows':12,'outwardWinding':True} if hide else None,
           'hairWindingFixed':hair_flipped,'seaTerrainLightingChanged':False,
           'warning':'Foreground vegetation can still visually occlude the body; green leaf triangles are not necessarily mesh holes.'}
    out.mkdir(parents=True,exist_ok=True);(out/'giant-focused-repair-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8')
    scene['v117_giant_repair_complete']=True;bpy.context.view_layer.update();print('V117_GIANT_REPAIR_COMPLETE',json.dumps(audit),flush=True)
    return audit


if globals().get('V117_RUN_GIANT_REPAIR'):
    V117_GIANT_REPAIR_RESULT=repair_giant(ROOT,OUT)
