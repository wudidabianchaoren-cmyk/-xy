"""V118 scoped character polish. Root calls polish(root,out) in native V117/08.
No MCP/render/export/save, body/ship positions, sea, terrain or light mutations.
The existing complete CC0 giant and all existing posed crew anatomies remain.
"""
import bpy,bmesh,math,json,random,hashlib
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from mathutils.kdtree import KDTree


def polish(root,out):
    root,out=Path(root),Path(out);out.mkdir(parents=True,exist_ok=True)
    scene=bpy.context.scene
    if scene.get('v118_character_polish_started'):
        raise RuntimeError('Character polish already started. Inspect audit/checkpoint, never apply twice.')
    giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt')
    body=bpy.data.objects.get('V117 CC0 complete male anatomical cyclops body')
    eye=bpy.data.objects.get('V117 ONE anatomical cyclops eyeball')
    iris=bpy.data.objects.get('V117 ONE brown cyclops iris')
    pupil=bpy.data.objects.get('V117 ONE black cyclops pupil')
    if not giant or not body or not eye or not iris or not pupil:
        raise RuntimeError('Requires V117 actual CC0 complete male replacement, single eye assembly')
    ships=[bpy.data.objects.get('V112_SHIP_'+str(i)) for i in range(4)]
    if not all(ships):raise RuntimeError('Original four posed fleet roots missing')
    skin=body.material_slots[0].material
    if not skin:raise RuntimeError('Current CC0 skin PBR missing')
    scene['v118_character_polish_started']=True
    added=bpy.data.collections.new('V118_CHARACTER_POLISH / integrated eye and tailored seams')
    scene.collection.children.link(added)
    audit={'version':118,'completed':False,'existingMaleAnatomyRetained':body.name,
           'bodyDuplicated':False,'posesReset':False,'seaTerrainLightsChanged':False,
           'giant':{},'crew':{},'newObjects':[]}
    def record():
        (out/'character-polish-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8')
    record()
    def mesh(name,verts,faces,parent,mat,uv=None):
        d=bpy.data.meshes.new(name);d.from_pydata(verts,[],faces);d.update()
        o=bpy.data.objects.new(name,d);added.objects.link(o);o.parent=parent;d.materials.append(mat)
        for f in d.polygons:f.use_smooth=True
        layer=d.uv_layers.new(name='PhysicalDetailUV')
        for f in d.polygons:
            for li in f.loop_indices:
                vi=d.loops[li].vertex_index
                layer.data[li].uv=uv[vi] if uv else (verts[vi][0]*8,verts[vi][2]*8)
        audit['newObjects'].append(name)
        return o
    def simple(name,color,rough):
        m=bpy.data.materials.new(name);m.use_nodes=True
        b=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
        b.inputs['Base Color'].default_value=(*color,1);b.inputs['Roughness'].default_value=rough
        b.inputs['Specular IOR Level'].default_value=.18
        return m
    # Sample the actual complete forehead. Eye exposure is limited by the real
    # body surface, then the skin folds bridge aperture -> existing forehead.
    tree=BVHTree.FromPolygons([v.co.copy() for v in body.data.vertices],
                             [tuple(p.vertices) for p in body.data.polygons])
    ez=1.626
    def front(x,z,fallback=-.145):
        p,n,_,_=tree.ray_cast(Vector((x,-.8,z)),Vector((0,1,0)),1.6)
        return p.y if p is not None else fallback
    surface=front(0,ez)
    oldcenter=sum((v.co for v in eye.data.vertices),Vector())/len(eye.data.vertices)
    cy=surface+.0038
    for obj,olddepth,newdepth in [(eye,.016,.0105),(iris,.0025,.0018),(pupil,.0015,.0010)]:
        # Preserve the pupil/iris modelling and outward normals. The frontmost
        # cornea is now only ~7mm proud of the real forehead, previously ~21mm.
        cen=sum((v.co for v in obj.data.vertices),Vector())/len(obj.data.vertices)
        targety=cy if obj==eye else cy-.0097 if obj==iris else cy-.0110
        for v in obj.data.vertices:
            v.co.x*=.79
            v.co.z=ez+(v.co.z-ez)*.70
            v.co.y=targety+(v.co.y-cen.y)*(newdepth/olddepth)
        obj.data.update()
        for slot in obj.material_slots:
            mat=slot.material
            if not mat or not mat.use_nodes:continue
            bs=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
            if bs:
                bs.inputs['Roughness'].default_value=.31 if obj==eye else .29
                bs.inputs['Specular IOR Level'].default_value=.3
                if obj==eye:bs.inputs['Base Color'].default_value=(.26,.245,.205,1)
    for name in ['V117 continuous upper heavy brow','V117 continuous lower orbital fold']:
        old=bpy.data.objects.get(name)
        if old:old.hide_render=True;old.hide_set(True)
    # Separate upper/lower apertures: heavier upper hood, shallow lower lid.
    # Their outside border samples the actual face at every point, making a
    # continuous recessed socket instead of a bright ring around a googly eye.
    for upper in [True,False]:
        vv=[];ff=[];uv=[];N=44;rows=6
        for row in range(rows+1):
            t=row/rows;s=t*t*(3-2*t)
            for i in range(N+1):
                a=i*math.pi/N+(0 if upper else math.pi)
                innerx=.0257*math.cos(a)
                innerz=ez+(.0075 if upper else .0092)*math.sin(a)
                outerx=.044*math.cos(a)
                outerz=ez+(.027 if upper else .021)*math.sin(a)
                x=innerx*(1-s)+outerx*s;z=innerz*(1-s)+outerz*s
                edge_y=front(outerx,outerz,surface)-.0008
                lid_y=cy-.0075
                y=lid_y*(1-s)+edge_y*s
                # A broad hood projects 3mm locally; it does not form a torus.
                if upper:y-=.0032*math.sin(t*math.pi)*math.sin(a)**2
                vv.append((x,y,z));uv.append((x/.27,z/.27))
        for row in range(rows):
            for i in range(N):
                a=row*(N+1)+i;ff.append((a,a+N+1,a+N+2,a+1))
        lid=mesh('V118 integrated '+('upper eyelid and brow hood' if upper else 'lower eyelid cheek transition'),vv,ff,giant,skin,uv)
        for mat in lid.data.materials:mat.use_backface_culling=False
    audit['giant']['eye']={'count':1,'oldCenter':list(oldcenter),'newCenter':[0,cy,ez],
        'foreheadSurfaceY':surface,'exposedDepthMetres':surface-(cy-.0105),
        'widthScale':.79,'heightScale':.70,'outerLidsFollowActualForehead':True}
    # Replace stripe-like isolated hairs with actual surface-following caps and
    # shorter overlapping locks. The low profile cap provides coherent density.
    hair=simple('V118 rough umber scalp and coherent beard',(.026,.016,.010),.95)
    hairLight=simple('V118 scattered weathered brown hair locks',(.044,.029,.018),.94)
    hidden=[]
    for obj in list(giant.children_recursive):
        if obj and obj.name.startswith('V117 CC0 male rooted'):
            obj.hide_render=True;obj.hide_set(True);hidden.append(obj.name)
    d=body.data;d.update()
    rng=random.Random(118)
    def inzone(p,zone):
        x,y,z=p
        if zone=='scalp':
            return (z>1.69 or (z>1.635 and (y>-.045 or abs(x)>.063)))
        # Leave lips visible and let cheek density rise gradually at the sides.
        top=1.548+.025*min(1,abs(x)/.066)
        return abs(x)<.083 and y<-.068 and 1.495<z<top
    for zone,lock_count in [('scalp',150),('beard',105)]:
        vv=[];ff=[];centers=[]
        for poly in d.polygons:
            pts=[d.vertices[i].co for i in poly.vertices]
            center=sum(pts,Vector())/len(pts)
            if not inzone(center,zone):continue
            if zone=='beard' and poly.normal.y>-.15:continue
            start=len(vv)
            for i in poly.vertices:
                v=d.vertices[i];vv.append(tuple(v.co+v.normal*.0015))
            ff.append(tuple(range(start,start+len(pts))))
            centers.append((center.copy(),poly.normal.copy()))
        if not ff:
            audit['giant'][zone]={'capFaces':0,'locks':0,'warning':'No anatomical face candidates'};continue
        cap=mesh('V118 continuous surface-following '+zone+' cap',vv,ff,giant,hair)
        # Locks follow tangential gravity around head/jaw with rounded three-
        # point spread; their tips overlap the cap, never long free wire stripes.
        lv=[];lf=[]
        for k in range(lock_count):
            p,n=rng.choice(centers);n.normalize()
            gravity=Vector((0,0,-1));flow=gravity-n*gravity.dot(n)
            if flow.length<.15:flow=Vector((0,.6,-.3))-n*Vector((0,.6,-.3)).dot(n)
            flow.normalize();side=n.cross(flow).normalized()
            length=rng.uniform(.014,.027) if zone=='scalp' else rng.uniform(.010,.023)
            width=rng.uniform(.0015,.0032);start=len(lv)
            for j in range(5):
                t=j/4;c=p+flow*(length*t)+n*(.0017+.0012*math.sin(t*math.pi))
                w=width*(math.sin((.12+.83*t)*math.pi)**.65)
                lv.extend([tuple(c-side*w),tuple(c+side*w)])
            for j in range(4):a=start+j*2;lf.append((a,a+2,a+3,a+1))
        locks=mesh('V118 overlapping short '+zone+' locks',lv,lf,giant,hairLight)
        for m in locks.data.materials:m.use_backface_culling=False
        audit['giant'][zone]={'capFaces':len(ff),'locks':lock_count,'longStripeMeshesHidden':hidden}
    record()
    # All anatomy/poses stay. Cloth mesh data shared between repeated rowers is
    # refined ONCE per mesh, keeping the same instance sharing and body count.
    crew=[o for ship in ships for o in ship.children_recursive
          if o and o.type=='MESH' and o.get('role')=='crew' and not o.hide_render]
    cloth=[o for o in crew if any(k in (o.name+' '+' '.join(s.material.name for s in o.material_slots if s.material)).lower()
                                  for k in ['tunic','mantle','linen','sleeve','woven'])]
    unique={o.data.name:o for o in cloth};folds=[];loop_cache={}
    def boundary_loops(data):
        # Temporary welded topology locates garment openings even when the
        # actual source keeps split UV seam vertices. Never weld the real mesh.
        bm=bmesh.new();bm.from_mesh(data)
        bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00001)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.normal_update()
        edges={e for e in bm.edges if e.is_boundary};result=[]
        while edges:
            first=next(iter(edges));start=first.verts[0];current=start;path=[];valid=True
            for step in range(600):
                path.append((current.co.copy(),current.normal.copy()))
                candidates=[e for e in current.link_edges if e in edges]
                if not candidates:valid=False;break
                e=candidates[0];edges.remove(e);current=e.other_vert(current)
                if current==start:break
            else:valid=False
            if valid and 8<=len(path)<=220:
                length=sum((path[(i+1)%len(path)][0]-p).length for i,(p,_) in enumerate(path))
                if .16<length<2.4:result.append((path,length))
        bm.free();return result
    for name,obj in unique.items():
        data=obj.data;data.update()
        loops=boundary_loops(data);loop_cache[name]=loops
        boundary=[]
        for path,_ in loops:boundary.extend(p for p,n in path)
        kd=KDTree(len(boundary)) if boundary else None
        if kd:
            for bi,point in enumerate(boundary):kd.insert(point,bi)
            kd.balance()
        # Physically readable gravity pleats, strongest below the waist gather,
        # zero near fixed garment edges. No normal-noise displacement on skin.
        zlo=min(v.co.z for v in data.vertices);zhi=max(v.co.z for v in data.vertices)
        xmid=(min(v.co.x for v in data.vertices)+max(v.co.x for v in data.vertices))/2
        ymid=(min(v.co.y for v in data.vertices)+max(v.co.y for v in data.vertices))/2
        changed=0
        for v in data.vertices:
            p=v.co;t=(p.z-zlo)/max(zhi-zlo,.001)
            if not .04<t<.86:continue
            # Fixed neck/cuffs/hem are protected by actual boundary proximity.
            dist=kd.find(p)[2] if kd else .1
            pin=min(1,max(0,(dist-.004)/.035))
            angle=math.atan2(p.y-ymid,p.x-xmid)
            gather=math.exp(-((t-.44)/.27)**2)
            amplitude=.0052*pin*gather*math.sin(angle*16+t*1.4)
            # Extra small gravity sag between tied vertical pleats.
            v.co+=v.normal*amplitude
            v.co.z-=.0026*pin*gather*(.5+.5*math.cos(angle*16))
            if abs(amplitude)>.0001:changed+=1
        # Scale existing anatomical garment UVs to actual scan width 27cm.
        uv=data.uv_layers.active;ratios=[]
        if uv:
            for p in list(data.polygons)[::max(1,len(data.polygons)//160)]:
                lis=list(p.loop_indices)
                for j,li in enumerate(lis):
                    lj=lis[(j+1)%len(lis)];a=data.loops[li].vertex_index;b=data.loops[lj].vertex_index
                    du=(uv.data[li].uv-uv.data[lj].uv).length;distance=(data.vertices[a].co-data.vertices[b].co).length
                    if du>.001 and .003<distance<.3:ratios.append(distance/du)
            scale=min(8,max(.6,sorted(ratios)[len(ratios)//2]/.27)) if ratios else 1
            for loop in uv.data:loop.uv*=scale
        else:scale=1
        for p in data.polygons:p.use_smooth=True
        data.update();folds.append({'mesh':name,'sharedUsers':data.users,'verticesRefined':changed,
            'maxFoldAmplitudeMetres':.0052,'photoUVScaleFactor':scale,'actualOpenings':len(loops)})
    # Real folded collar/cuff/hem strips on the closest vessel only. They follow
    # each EXISTING POSED garment opening and keep that object's parent space.
    seam=bpy.data.materials.get('V117 folded flax seam tape') or bpy.data.materials.get('V117 crew woven tunic dye 0')
    if not seam:seam=simple('V118 neutral woven hem binding',(.31,.28,.21),.93)
    bindings=[]
    near_cloth=[]
    for o in cloth:
        parent=o.parent
        while parent and parent!=ships[0]:parent=parent.parent
        if parent==ships[0]:near_cloth.append(o)
    for obj in near_cloth:
        loops=loop_cache.get(obj.data.name,[])
        if not loops:continue
        for index,(path,length) in enumerate(sorted(loops,key=lambda item:item[1])[:4]):
            center=sum((p for p,n in path),Vector())/len(path);vv=[];uv=[]
            cumulative=0
            for i,(p,n) in enumerate(path):
                prev=path[(i-1)%len(path)][0];nxt=path[(i+1)%len(path)][0];tangent=(nxt-prev).normalized()
                side=n.cross(tangent)
                if side.length<.01:continue
                side.normalize()
                if side.dot(p-center)<0:side=-side
                if i:cumulative+=(p-prev).length
                width=.010 if length<.8 else .007
                vv.extend([tuple(p+n*.0016),tuple(p+side*width+n*.0021)])
                uv.extend([(cumulative/.27,0),(cumulative/.27,width/.27)])
            if len(vv)!=len(path)*2:continue
            ff=[]
            for i in range(len(path)):
                a=i*2;b=((i+1)%len(path))*2;ff.append((a,b,b+1,a+1))
            name='V118 folded garment opening '+obj.name+' '+str(index)
            band=mesh(name,vv,ff,obj,seam,uv)
            solid=band.modifiers.new('Actual doubled sewn binding thickness','SOLIDIFY');solid.thickness=.0015;solid.offset=0
            bindings.append(name)
    audit['crew']={'existingVisibleAnatomyParts':len(crew),'existingPosedClothingParts':len(cloth),
        'uniqueSharedGarmentMeshesRefined':folds,'nearShipFoldedBindings':bindings,
        'anatomicalBodiesDuplicated':0,'newAPoses':0,'nearGarmentInstanceCount':len(near_cloth),
        'textileReferenceWidthMetres':.27}
    audit['completed']=True;audit['addedBaseVertices']=sum(len(o.data.vertices) for o in added.objects if o.type=='MESH')
    scene['v118_character_polish_completed']=True;bpy.context.view_layer.update();record()
    print('V118_CHARACTER_POLISH_COMPLETE',json.dumps({'garmentMeshes':len(unique),'bindings':len(bindings),
          'addedObjects':len(added.objects),'giantSingleEye':True}),flush=True)
    return {'audit':audit,'collection':added,'giant':giant,'ships':ships}


if globals().get('V118_RUN_CHARACTER_POLISH'):
    V118_CHARACTER_POLISH_RESULT=polish(ROOT,OUT)
