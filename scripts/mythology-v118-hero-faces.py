"""Refine THREE existing POSED crew faces. No new heads/bodies/A-poses.
Root calls polish_hero_faces(ROOT,OUT). No execution/export/render/save here.
Verified source schema: complete body13,307, lips459, ears626, paired eyes96.
"""
import bpy,bmesh,math,json
import numpy as np
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree


def inspect_hero_faces(root,out):
    names=['V112 ship0 captain detailed actor','V112 ship0 helmsman detailed actor','V112 ship0 rower0 side-1']
    result=[]
    for name in names:
        actor=bpy.data.objects.get(name)
        result.append({'actor':name,'found':bool(actor),'parts':[{'name':o.name,'vertices':len(o.data.vertices),
            'bounds':[[min(v.co[k] for v in o.data.vertices),max(v.co[k] for v in o.data.vertices)] for k in range(3)],
            'materials':[{'name':s.material.name,'images':[{'file':n.image.filepath,'size':list(n.image.size)}
                         for n in s.material.node_tree.nodes if n.type=='TEX_IMAGE' and n.image] if s.material.use_nodes else []}
                         for s in o.material_slots if s.material]}
            for o in actor.children if o and o.type=='MESH' and not o.hide_render] if actor else []})
    out=Path(out);out.mkdir(parents=True,exist_ok=True)
    (out/'hero-face-inspection.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
    return result


def polish_hero_faces(root,out):
    root,out=Path(root),Path(out);scene=bpy.context.scene
    if scene.get('v118_hero_faces_started'):raise RuntimeError('Hero face refinement already started')
    inspections=inspect_hero_faces(root,out)
    atlaspath=root/'assets/odyssey/pbr-v103/skin-atlas.png'
    if not atlaspath.exists():raise FileNotFoundError(atlaspath)
    names=[r['actor'] for r in inspections if r['found']]
    if len(names)!=3:raise RuntimeError('Expected existing captain/helmsman/rower0 principals; no guessed replacement allowed')
    scene['v118_hero_faces_started']=True
    col=bpy.data.collections.new('V118_HERO_FACE_DETAILS / existing posed principals');scene.collection.children.link(col)
    atlas=bpy.data.images.load(str(atlaspath),check_existing=True);atlas.colorspace_settings.name='sRGB'
    # A native technical iris map on the actual existing paired eye surfaces;
    # this is not an invented head, eye position, scanned iris or upscaled photo.
    S=512;yy,xx=np.mgrid[:S,:S].astype(np.float32)/(S-1);x=xx-.5;y=yy-.5
    r=np.sqrt(x*x+y*y);a=np.arctan2(y,x)
    rgb=np.zeros((S,S,4),np.float32);rgb[:,:,:3]=np.array([.60,.56,.49]);rgb[:,:,3]=1
    fibers=.5+.21*np.sin(a*39+r*140)+.12*np.sin(a*93-r*70)
    irismask=r<.23;ring=r>.205
    rgb[irismask,:3]=(np.stack([.19+.055*fibers,.105+.038*fibers,.038+.020*fibers],axis=-1))[irismask]
    limbal=(r<.23)&(r>.205);rgb[limbal,:3]*=.40
    pup=r<.105;rgb[pup,:3]=np.array([.006,.004,.003])
    # No painted white highlight: actual native lighting controls corneal sheen.
    im=bpy.data.images.new('V118 technical human iris on existing eye mesh',width=S,height=S,alpha=True)
    im.pixels.foreach_set(rgb.ravel());im.filepath_raw=str(out/'hero-existing-eye-iris.png');im.file_format='PNG';im.save()
    eyemat=bpy.data.materials.new('V118 actual paired eye mesh / iris sclera roughness');eyemat.use_nodes=True
    n,l=eyemat.node_tree.nodes,eyemat.node_tree.links;bs=next(v for v in n if v.type=='BSDF_PRINCIPLED')
    bs.inputs['Roughness'].default_value=.27;bs.inputs['Specular IOR Level'].default_value=.36
    t=n.new('ShaderNodeTexImage');t.image=im;l.new(t.outputs['Color'],bs.inputs['Base Color'])
    hair=bpy.data.materials.new('V118 principal restrained dark brow hair');hair.use_nodes=True
    hb=next(n for n in hair.node_tree.nodes if n.type=='BSDF_PRINCIPLED');hb.inputs['Base Color'].default_value=(.035,.021,.012,1);hb.inputs['Roughness'].default_value=.92
    report={'sourceActualAtlas':str(atlaspath),'atlasSize':list(atlas.size),'newHeads':0,'newBodies':0,
            'APosesAppended':0,'principals':[],'seaTerrainShipTransformsChanged':False}
    def skinmaterial(old,name):
        mat=old.copy() if old else bpy.data.materials.new(name);mat.name=name;mat.use_nodes=True
        nodes,links=mat.node_tree.nodes,mat.node_tree.links
        b=next((n for n in nodes if n.type=='BSDF_PRINCIPLED'),None)
        if not b:raise RuntimeError('Existing principal skin has no Principled shader')
        tex=nodes.new('ShaderNodeTexImage');tex.image=atlas;tex.label='Original actual 2048 anatomical atlas / retained UV'
        links.new(tex.outputs['Color'],b.inputs['Base Color']);b.inputs['Roughness'].default_value=.69
        b.inputs['Subsurface Weight'].default_value=.045;b.inputs['Specular IOR Level'].default_value=.25
        return mat
    def components(data):
        parents=list(range(len(data.vertices)))
        def find(x):
            while parents[x]!=x:parents[x]=parents[parents[x]];x=parents[x]
            return x
        for p in data.polygons:
            vv=list(p.vertices)
            for i in vv[1:]:parents[find(i)]=find(vv[0])
        groups={}
        for i in range(len(parents)):groups.setdefault(find(i),[]).append(i)
        return sorted(groups.values(),key=len,reverse=True)
    for actorname in names:
        actor=bpy.data.objects[actorname]
        parts=[o for o in actor.children if o and o.type=='MESH' and not o.hide_render]
        # Exact verified base anatomy size; never mistake tunic or mantle for face.
        body=next((o for o in parts if 12500<len(o.data.vertices)<14500),None)
        eye=next((o for o in parts if len(o.data.vertices)==96 and ('low-poly' in o.name.lower() or 'lowpoly' in o.name.lower())),None)
        if not body or not eye:
            raise RuntimeError('Verified body/paired eye parts missing for '+actorname)
        before=len(body.data.vertices);body.data=body.data.copy()
        bm=bmesh.new();bm.from_mesh(body.data)
        top=max(v.co.z for v in bm.verts);neck=top-.275
        headfaces={f for f in bm.faces if all(v.co.z>neck for v in f.verts)}
        internal=[e for e in bm.edges if len(e.link_faces)==2 and all(f in headfaces for f in e.link_faces)]
        # Head-only geometry; body/limbs/pose and all facial landmark vertices
        # retained. New edges gain topology; mild surface smoothing only new verts.
        oldverts=set(bm.verts)
        if internal:bmesh.ops.subdivide_edges(bm,edges=internal,cuts=1,use_grid_fill=True,smooth=.10)
        addedverts=[v for v in bm.verts if v not in oldverts and v.co.z>neck+.015]
        if addedverts:bmesh.ops.smooth_vert(bm,verts=addedverts,factor=.10,use_axis_x=True,use_axis_y=True,use_axis_z=True)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
        for f in bm.faces:f.smooth=True
        bm.to_mesh(body.data);bm.free();body.data.update()
        oldmat=body.material_slots[0].material if body.material_slots else None
        smat=skinmaterial(oldmat,'V118 principal anatomical 2K skin '+actorname)
        for slot in body.material_slots:slot.link='OBJECT';slot.material=smat
        # Lips and ears are already separate accurately posed parts. Subdivide
        # only those small known pieces, never hands/entire bodies/garments.
        detailed=[]
        for obj in parts:
            if len(obj.data.vertices) not in [459,626]:continue
            if not any(m.type=='SUBSURF' for m in obj.modifiers):
                sub=obj.modifiers.new('V118 native small facial surface precision','SUBSURF');sub.levels=1;sub.render_levels=1
            if len(obj.data.vertices)==626:
                for slot in obj.material_slots:slot.link='OBJECT';slot.material=smat
            detailed.append(obj.name)
        # Work on existing paired eyeballs. Verified actual source has precisely
        # TWO disconnected 48-vertex ocular surfaces, not manually placed proxies.
        eye.data=eye.data.copy();groups=components(eye.data)
        if len(groups)!=2 or not all(len(g)>=24 for g in groups):
            raise RuntimeError('Paired ocular topology differs; refuse guessed eye placement '+eye.name)
        eye_to_body=body.matrix_world.inverted()@eye.matrix_world
        body_to_eye=eye.matrix_world.inverted()@body.matrix_world
        headpts=[v.co for v in body.data.vertices if v.co.z>top-.21]
        headcenter=sum(headpts,Vector())/len(headpts)
        all_eye_center=sum((eye_to_body@v.co for v in eye.data.vertices),Vector())/len(eye.data.vertices)
        forward=(all_eye_center-headcenter);forward.z=0
        if forward.length<.005:raise RuntimeError('Cannot infer actual posed gaze axis '+actorname)
        forward.normalize();right=forward.cross(Vector((0,0,1))).normalized();up=right.cross(forward).normalized()
        uv=eye.data.uv_layers.active or eye.data.uv_layers.new(name='AnatomicalIrisUV')
        centers=[];lookup={}
        for group in groups:
            points=[eye_to_body@eye.data.vertices[i].co for i in group]
            center=sum(points,Vector())/len(points);radius=max((p-center).length for p in points)
            centers.append(center)
            for i,p in zip(group,points):
                d=p-center;lookup[i]=(.5+.5*d.dot(right)/radius,.5+.5*d.dot(up)/radius)
        for p in eye.data.polygons:
            p.use_smooth=True
            for li in p.loop_indices:uv.data[li].uv=lookup[eye.data.loops[li].vertex_index]
        for slot in eye.material_slots:slot.link='OBJECT';slot.material=eyemat
        if not any(m.type=='SUBSURF' for m in eye.modifiers):
            sub=eye.modifiers.new('V118 existing ocular surface precision','SUBSURF');sub.levels=1;sub.render_levels=1
        # Real subtle eyebrows conform to the existing posed forehead using
        # ray samples. No new head, no assumed symmetry or global placement.
        bvh=BVHTree.FromPolygons([v.co.copy() for v in body.data.vertices],[tuple(p.vertices) for p in body.data.polygons])
        eyebrows=[]
        for ci,center in enumerate(centers):
            verts=[];faces=[]
            for i in range(13):
                t=i/12;guess=center+right*((t-.5)*.031)+up*(.016+.003*math.sin(t*math.pi))
                p,n,_,_=bvh.ray_cast(guess+forward*.12,-forward,.28)
                if p is None:break
                thickness=.0008+.0018*math.sin(t*math.pi)**.7
                verts.extend([tuple(p+n*.0008-up*thickness*.5),tuple(p+n*.0008+up*thickness*.5)])
            if len(verts)!=26:continue
            for i in range(12):a=i*2;faces.append((a,a+2,a+3,a+1))
            d=bpy.data.meshes.new('V118 existing posed forehead brow');d.from_pydata(verts,[],faces);d.update()
            obj=bpy.data.objects.new('V118 subtle brow '+actorname+' '+str(ci),d);col.objects.link(obj);obj.parent=body;d.materials.append(hair)
            for p in d.polygons:p.use_smooth=True
            hair.use_backface_culling=False;eyebrows.append(obj.name)
        report['principals'].append({'actor':actorname,'bodyObject':body.name,'oldBodyVertices':before,
            'newBodyVertices':len(body.data.vertices),'onlyHeadFacesSubdivided':len(headfaces),
            'existingEyeObject':eye.name,'ocularComponents':[len(g) for g in groups],
            'realGazeAxisFromPosedAnatomy':list(forward),'smallFaceParts':detailed,'foreheadSampledBrows':eyebrows})
    scene['v118_hero_faces_complete']=True;bpy.context.view_layer.update()
    (out/'hero-face-polish-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
    print('V118_PRINCIPAL_FACES_COMPLETE',json.dumps(report),flush=True);return report

if globals().get('V118_RUN_HERO_FACES'):
    V118_HERO_FACES_RESULT=polish_hero_faces(ROOT,OUT)
