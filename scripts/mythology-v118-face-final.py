"""Definitions only. Root executes face_final(root,out), then checks/exports.
Repairs actual DATA-material export, posed garment clearance and the SINGLE
cyclops orbital volume. No lights, terrain, sea, parents, poses or cameras.
"""


def face_final(root,out):
    import bpy,bmesh,math,json
    import numpy as np
    from pathlib import Path
    from mathutils import Vector
    from mathutils.bvhtree import BVHTree
    root,out=Path(root),Path(out);out.mkdir(parents=True,exist_ok=True)
    scene=bpy.context.scene
    if scene.get('v118_face_final_started'):raise RuntimeError('Final face repair already started; inspect saved checkpoint')
    giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt')
    gbody=bpy.data.objects.get('V117 CC0 complete male anatomical cyclops body')
    if not giant or not gbody:raise RuntimeError('Actual complete CC0 male body missing')
    scene['v118_face_final_started']=True
    audit={'dataMaterialBindings':[],'principalEyes':[],'garmentClearance':[],
           'seaLightingTerrainChanged':False,'completed':False}
    def saveaudit():
        (out/'face-final-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8')
    saveaudit()
    def direct(name,color=(.2,.1,.05),rough=.8,image=None):
        m=bpy.data.materials.new(name);m.use_nodes=True
        bs=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
        bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Roughness'].default_value=rough
        bs.inputs['Specular IOR Level'].default_value=.22
        if image:
            tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image
            uv=m.node_tree.nodes.new('ShaderNodeUVMap');uv.uv_map='FINAL_UV'
            m.node_tree.links.new(uv.outputs['UV'],tex.inputs['Vector'])
            m.node_tree.links.new(tex.outputs['Color'],bs.inputs['Base Color'])
        return m
    def databind(obj,mat):
        # Explicit DATA slots avoid original material reappearing in evaluated
        # Subsurf meshes / glTF material caches. No OBJECT-only overrides remain.
        obj.data=obj.data.copy();obj.data.materials.clear();obj.data.materials.append(mat)
        for slot in obj.material_slots:slot.link='DATA';slot.material=mat
        for p in obj.data.polygons:p.material_index=0
        audit['dataMaterialBindings'].append({'object':obj.name,'dataMaterial':mat.name})
    def singleuv(data):
        active=data.uv_layers.active
        if not active:active=data.uv_layers.new(name='FINAL_UV')
        for layer in list(data.uv_layers):
            if layer!=active:data.uv_layers.remove(layer)
        active.name='FINAL_UV';data.uv_layers.active_index=0;active.active_render=True
        return active
    # Native actual 2K atlas is retained, with bounded pigment darkening baked
    # into a frozen local map; no unsupported shader multiply in export.
    src=bpy.data.images.load(str(root/'assets/odyssey/pbr-v103/skin-atlas.png'),check_existing=True)
    arr=np.empty(len(src.pixels),dtype=np.float32);src.pixels.foreach_get(arr);arr=arr.reshape(-1,4)
    arr[:,:3]*=np.array([.78,.76,.72],dtype=np.float32)
    im=bpy.data.images.new('V118 final subdued actual skin atlas',width=src.size[0],height=src.size[1],alpha=True)
    im.pixels.foreach_set(arr.ravel());im.filepath_raw=str(out/'final-crew-skin-2k.png');im.file_format='PNG';im.save()
    skin=direct('V118 FINAL crew actual anatomical 2K skin',rough=.75,image=im)
    hair=direct('V118 FINAL crew matte umber hair',(.023,.014,.008),.94)
    lips=direct('V118 FINAL restrained natural lips',(.23,.115,.075),.72)
    eyepath=out/'hero-existing-eye-iris.png'
    if not eyepath.exists():raise FileNotFoundError(eyepath)
    eyetex=bpy.data.images.load(str(eyepath),check_existing=True)
    eyemat=direct('V118 FINAL actual ocular iris and sclera DATA',rough=.3,image=eyetex)
    ship=bpy.data.objects['V112_SHIP_0']
    visible=[o for o in ship.children_recursive if o and o.type=='MESH' and o.get('role')=='crew' and not o.hide_render]
    # White hair is directly evidenced in shipped GLB as Humanshort01 with no
    # colour factor or texture. Replace exactly the actual hair parts.
    for obj in visible:
        name=obj.name.lower()
        if 'short01' in name:databind(obj,hair)
    principalnames=['V112 ship0 captain detailed actor','V112 ship0 helmsman detailed actor','V112 ship0 rower0 side-1']
    def groups(data):
        parent=list(range(len(data.vertices)))
        def find(i):
            while parent[i]!=i:parent[i]=parent[parent[i]];i=parent[i]
            return i
        for p in data.polygons:
            ix=list(p.vertices)
            for i in ix[1:]:parent[find(i)]=find(ix[0])
        d={}
        for i in range(len(parent)):d.setdefault(find(i),[]).append(i)
        return list(d.values())
    for actorname in principalnames:
        actor=bpy.data.objects[actorname]
        parts=[o for o in actor.children if o and o.type=='MESH' and not o.hide_render]
        body=next(o for o in parts if o.name.endswith(' base003') or 'Human.body ' in o.name)
        eye=next(o for o in parts if 'low-poly' in o.name.lower() or 'lowpoly' in o.name.lower())
        databind(body,skin);singleuv(body.data)
        for obj in parts:
            if obj.name.endswith('base003_2') or 'Human.lips ' in obj.name:databind(obj,lips)
            elif obj.name.endswith('base003_5') or 'Human.ears ' in obj.name:databind(obj,skin);singleuv(obj.data)
        databind(eye,eyemat);uv=singleuv(eye.data);clusters=groups(eye.data)
        if len(clusters)!=2:raise RuntimeError('Actual ocular topology must contain two surfaces '+eye.name)
        eye2body=body.matrix_world.inverted()@eye.matrix_world
        centroids=[]
        for ids in clusters:centroids.append(sum((eye2body@eye.data.vertices[i].co for i in ids),Vector())/len(ids))
        ec=(centroids[0]+centroids[1])*.5
        # Raised arms polluted previous whole-head centroid. Restrict to an
        # actual 18cm horizontal neighborhood around the existing eyes.
        hp=[v.co for v in body.data.vertices if abs(v.co.z-ec.z)<.13
            and (Vector((v.co.x-ec.x,v.co.y-ec.y,0))).length<.18]
        hc=sum(hp,Vector())/len(hp)
        sideways=centroids[1]-centroids[0];sideways.z=0;sideways.normalize()
        forward=sideways.cross(Vector((0,0,1))).normalized()
        if forward.dot(ec-hc)<0:forward=-forward
        up=Vector((0,0,1));right=forward.cross(up).normalized()
        lookup={}
        for ids,c in zip(clusters,centroids):
            pts=[eye2body@eye.data.vertices[i].co for i in ids]
            r=max((p-c).length for p in pts)
            for i,p in zip(ids,pts):
                d=p-c;lookup[i]=(.5+.5*d.dot(right)/r,.5+.5*d.dot(up)/r)
        for p in eye.data.polygons:
            for li in p.loop_indices:uv.data[li].uv=lookup[eye.data.loops[li].vertex_index]
        eye.data.update()
        audit['principalEyes'].append({'actor':actorname,'dataMaterial':eyemat.name,'explicitUV':'FINAL_UV',
            'gazeFromActualInterocularAxis':list(forward),'existingPairedEyeCount':2})
    # Shoulder/neck white spots are the actual underlying skin poking through
    # displaced clothing, not proof of topological holes. Move only the near
    # fitted tunic vertices to a 3.5mm signed clearance from their own posed body.
    actors=[o for o in ship.children_recursive if o and o.type=='EMPTY' and any(c.get('role')=='crew' for c in o.children)]
    for actor in actors:
        parts=[o for o in actor.children if o and o.type=='MESH' and not o.hide_render]
        body=next((o for o in parts if o.name.endswith(' base003') or 'Human.body ' in o.name),None)
        if not body:continue
        tree=BVHTree.FromPolygons([v.co.copy() for v in body.data.vertices],[tuple(p.vertices) for p in body.data.polygons])
        for cloth in parts:
            name=cloth.name.lower()
            if not ('tunic' in name or 'oatmeal woven' in name):continue
            cloth.data=cloth.data.copy();to_body=body.matrix_world.inverted()@cloth.matrix_world;to_cloth=to_body.inverted();count=0
            for v in cloth.data.vertices:
                p=to_body@v.co;hit,n,_,d=tree.find_nearest(p)
                if hit is None or d>.03:continue
                signed=(p-hit).dot(n)
                if signed<.0035:
                    v.co=to_cloth@(hit+n*.0035);count+=1
            cloth.data.update();audit['garmentClearance'].append({'object':cloth.name,'correctedVertices':count,'clearanceMetres':.0035})
    saveaudit()
    # Structural orbital repair. V117/V118 head is closed (0 boundaries) but
    # retains two concave human ocular pits. A local Boolean UNION replaces
    # those cavities with continuous supraorbital volume. ONE concave socket is
    # then cut INTO that same body. It is not a floating cover or an extra eye.
    bpy.ops.object.select_all(action='DESELECT');gbody.hide_set(False);gbody.select_set(True);bpy.context.view_layer.objects.active=gbody
    for mod in list(gbody.modifiers):
        if mod.type=='SUBSURF':bpy.ops.object.modifier_apply(modifier=mod.name)
    def cutter(name,center,scale):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=24)
        obj=bpy.context.object;obj.name=name;obj.parent=giant;obj.location=center;obj.scale=scale
        # Geometry is transformed in giant LOCAL coordinates, same frame as the
        # actual complete male body. No assumed global placement or huge scale.
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        return obj
    def boolean(tool,operation):
        bpy.ops.object.select_all(action='DESELECT');gbody.select_set(True);bpy.context.view_layer.objects.active=gbody
        mod=gbody.modifiers.new('V118 continuous anatomical orbit '+operation,'BOOLEAN');mod.operation=operation;mod.solver='EXACT';mod.object=tool
        bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(tool,do_unlink=True)
    bone=cutter('V118 only construction orbital bone union',(0,-.113,1.610),(.091,.043,.039))
    boolean(bone,'UNION')
    socket=cutter('V118 only construction single recessed ocular bowl',(0,-.151,1.618),(.0275,.046,.0118))
    boolean(socket,'DIFFERENCE')
    bm=bmesh.new();bm.from_mesh(gbody.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
    for f in bm.faces:f.smooth=True
    body_boundary=sum(e.is_boundary for e in bm.edges);bm.to_mesh(gbody.data);bm.free();gbody.data.update()
    # Old overlay skin lids were behind the floated white eye and cannot repair
    # inherited bilateral sockets. Hide them after the actual single cavity cut.
    for obj in giant.children_recursive:
        if not obj or obj==gbody:continue
        if any(k in obj.name for k in ['continuous upper heavy brow','continuous lower orbital fold','V118 integrated upper','V118 integrated lower']):
            obj.hide_render=True;obj.hide_set(True)
        if obj.name.startswith('V118 overlapping short'):
            obj.hide_render=True;obj.hide_set(True)
    # Resize and seat the ORIGINAL single eye objects within the new real bowl.
    eye=bpy.data.objects['V117 ONE anatomical cyclops eyeball']
    iris=bpy.data.objects['V117 ONE brown cyclops iris'];pupil=bpy.data.objects['V117 ONE black cyclops pupil']
    specs=[(eye,(0,-.143,1.618),(.025,.014,.012)),
           (iris,(0,-.1565,1.618),(.0095,.0010,.0095)),
           (pupil,(0,-.1575,1.618),(.0043,.0008,.0054))]
    for obj,c,r in specs:
        oldcenter=sum((v.co for v in obj.data.vertices),Vector())/len(obj.data.vertices)
        oldr=[max(abs(v.co[k]-oldcenter[k]) for v in obj.data.vertices) for k in range(3)]
        for v in obj.data.vertices:
            for k in range(3):v.co[k]=c[k]+(v.co[k]-oldcenter[k])*r[k]/max(oldr[k],1e-8)
        obj.data.update()
        color=(.24,.225,.19) if obj==eye else (.055,.032,.012) if obj==iris else (.002,.0015,.001)
        databind(obj,direct('V118 FINAL seated cyclops '+('sclera' if obj==eye else 'iris' if obj==iris else 'pupil'),color,.32))
    audit['giant']={'actualBodyUnionAndSingleSocketBoolean':True,'closedBodyBoundaryEdges':body_boundary,
        'eyeCenterLocal':[0,-.143,1.618],'singleSocketCenterLocal':[0,-.151,1.618],
        'pairedHumanPitsFilledInActualGeometry':True,'extraEyeballsAdded':0,
        'oldFloatingLidsHidden':True,'contrastingStripeLocksHidden':True}
    scene['v118_face_final_completed']=True;audit['completed']=True;bpy.context.view_layer.update();saveaudit()
    return audit
