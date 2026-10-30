"""Use the ACTUALLY APPENDED CC0 full male anatomy. No old skin/body reused.
Root calls replace_giant(ROOT, OUT). No render/save/export/sea/light changes.
"""
import bpy,bmesh,math,json,random
import numpy as np
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree


def replace_giant(root,out):
    root,out=Path(root),Path(out);out.mkdir(parents=True,exist_ok=True)
    scene=bpy.context.scene
    if scene.get('v117_cc0_giant_replaced'):raise RuntimeError('Replacement already applied')
    giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt')
    source=bpy.data.objects.get('V117_CC0_MALE_INSPECT')
    if not giant or not source or source.type!='MESH':raise RuntimeError('Actual appended CC0 male inspection mesh and giant root required')
    legacy=list(giant.children_recursive)
    col=bpy.data.collections.new('V117_CC0_CYCLOPS / continuous male anatomy');scene.collection.children.link(col)
    data=source.data.copy();body=bpy.data.objects.new('V117 CC0 complete male anatomical cyclops body',data);col.objects.link(body);body.parent=giant
    body.matrix_parent_inverse=Matrix.Identity(4);body.location=(0,0,0);body.rotation_euler=(0,0,0);body.scale=(1,1,1)
    zmin=min(v.co.z for v in data.vertices);zmax=max(v.co.z for v in data.vertices);factor=1.73/(zmax-zmin)
    def bell(value,center,width):return math.exp(-((value-center)/width)**2)
    for v in data.vertices:
        v.co*=factor;v.co.z-=zmin*factor
        x,y,z=v.co
        # Whole real male anatomy, broad shoulder girdle and substantial neck.
        shoulder=bell(z,1.34,.14)
        v.co.x*=1+.13*shoulder+.07*bell(z,1.47,.06)
        if abs(x)<.24:v.co.y*=1+.08*shoulder
        # Relax bilateral eye recesses with smooth falloffs. Keep nose/lips and
        # surrounding whole face intact; no rectangular slabs or body holes.
        x,y,z=v.co
        if .018<abs(x)<.09 and 1.575<z<1.645 and y<-.06:
            w=bell(z,1.611,.023)*bell(abs(x),.047,.032)
            outer=-.128+.20*x*x
            if y>outer:v.co.y=y+(outer-y)*w*.95
        if abs(x)<.095 and 1.635<z<1.67 and y<-.075:
            v.co.y-=.009*bell(x,0,.065)*bell(z,1.644,.012)
    # Close actual paired ocular boundaries if this anatomy source leaves them
    # open for separate eyeballs. Never cap mouth or ears; the new single eye
    # is a separate, correctly positioned orbital assembly above this surface.
    bm=bmesh.new();bm.from_mesh(data)
    ocular_edges=[e for e in bm.edges if e.is_boundary and all(
        1.575<v.co.z<1.645 and .01<abs(v.co.x)<.09 and v.co.y<-.06 for v in e.verts)]
    ocular_caps=[]
    if ocular_edges:
        ocular_caps=bmesh.ops.holes_fill(bm,edges=ocular_edges,sides=64).get('faces',[])
        if ocular_caps:bmesh.ops.triangulate(bm,faces=ocular_caps,ngon_method='BEAUTY')
    ocular_cap_count=len(ocular_caps)
    bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(data);bm.free()
    # Keep manageable native topology. The CC0 file's Multires is deliberately
    # not copied to a changed base cage; one ordinary subdivision is explicit.
    for p in data.polygons:p.use_smooth=True
    sub=body.modifiers.new('V117 one bounded anatomical surface subdivision','SUBSURF');sub.levels=1;sub.render_levels=1
    data.update()
    # Skin uses a documented technical texture, not somebody else's UV atlas.
    size=512;yy,xx=np.mgrid[:size,:size].astype(np.float32)/size
    rng=np.random.default_rng(117)
    h=(.5+.11*np.sin(xx*math.tau*11+np.sin(yy*math.tau*7))+.07*np.sin(yy*math.tau*23)+rng.normal(0,.035,(size,size))).astype(np.float32)
    rgba=np.ones((size,size,4),dtype=np.float32);variation=.91+.17*h
    rgba[:,:,:3]=variation[:,:,None]*np.array([.34,.245,.173])
    def png(name,arr,noncolor=False):
        im=bpy.data.images.new(name,width=size,height=size,alpha=True);im.colorspace_settings.name='Non-Color' if noncolor else 'sRGB'
        im.pixels.foreach_set(np.ascontiguousarray(arr,dtype=np.float32).ravel());im.filepath_raw=str(out/(name+'.png'));im.file_format='PNG';im.save();return im
    pigment=png('v117-cyclops-technical-skin-pigment',rgba)
    dx=np.roll(h,-1,axis=1)-np.roll(h,1,axis=1);dy=np.roll(h,-1,axis=0)-np.roll(h,1,axis=0)
    norm=np.stack([-dx*.45,-dy*.45,np.ones_like(h)],axis=-1);norm/=np.linalg.norm(norm,axis=-1,keepdims=True)
    rgba=np.ones((size,size,4),dtype=np.float32);rgba[:,:,:3]=norm*.5+.5;normal=png('v117-cyclops-technical-pore-normal',rgba,True)
    skin=bpy.data.materials.new('V117 CC0 male skin / generated technical maps, no inherited atlas');skin.use_nodes=True
    nodes,links=skin.node_tree.nodes,skin.node_tree.links;bs=next(n for n in nodes if n.type=='BSDF_PRINCIPLED')
    bs.inputs['Roughness'].default_value=.76;bs.inputs['Subsurface Weight'].default_value=.04;bs.inputs['Specular IOR Level'].default_value=.23
    tex=nodes.new('ShaderNodeTexImage');tex.image=pigment;links.new(tex.outputs['Color'],bs.inputs['Base Color'])
    tex=nodes.new('ShaderNodeTexImage');tex.image=normal;nm=nodes.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.2;links.new(tex.outputs['Color'],nm.inputs['Color']);links.new(nm.outputs[0],bs.inputs['Normal'])
    data.materials.clear();data.materials.append(skin)
    if not data.uv_layers:
        uv=data.uv_layers.new(name='TechnicalSkinUV')
        for p in data.polygons:
            for li in p.loop_indices:
                c=data.vertices[data.loops[li].vertex_index].co;uv.data[li].uv=((math.atan2(c.y,c.x)/math.tau)%1,c.z/1.73)
    def material(name,color,rough):
        m=bpy.data.materials.new(name);m.use_nodes=True;b=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');b.inputs['Base Color'].default_value=(*color,1);b.inputs['Roughness'].default_value=rough;return m
    hairmat=material('V117 CC0 cyclops coarse umber hair',(.024,.015,.009),.95)
    sclera=material('V117 single cyclops eye sclera',(.34,.31,.25),.3)
    iris=material('V117 single cyclops iris',(.052,.031,.011),.32)
    pupil=material('V117 single cyclops pupil',(.002,.0015,.001),.22)
    def mesh(name,verts,faces,mat):
        d=bpy.data.meshes.new(name);d.from_pydata(verts,[],faces);d.update();o=bpy.data.objects.new(name,d);col.objects.link(o);o.parent=giant;d.materials.append(mat)
        for p in d.polygons:p.use_smooth=True
        return o
    # Exactly ONE integrated front-facing eye. Determine forehead surface from
    # actual new male geometry, avoiding floating eyeball guesses in worldspace.
    bvh=BVHTree.FromPolygons([v.co.copy() for v in data.vertices],[tuple(p.vertices) for p in data.polygons])
    ez=1.626;hit,_,_,_=bvh.ray_cast(Vector((0,-.8,ez)),Vector((0,1,0)),1.6)
    ey=(hit.y if hit else -.115)-.005
    def sphere(name,center,radius,mat,segments=40,rings=20):
        v=[];f=[]
        for row in range(rings+1):
            th=row*math.pi/rings
            for i in range(segments):
                ph=i*math.tau/segments;v.append(tuple(Vector(center)+Vector((radius[0]*math.sin(th)*math.cos(ph),radius[1]*math.sin(th)*math.sin(ph),radius[2]*math.cos(th)))))
        for row in range(rings):
            for i in range(segments):
                a=row*segments+i;b=row*segments+(i+1)%segments;f.append((a,a+segments,b+segments,b))
        return mesh(name,v,f,mat)
    sphere('V117 ONE anatomical cyclops eyeball',(0,ey,ez),(.033,.016,.020),sclera)
    sphere('V117 ONE brown cyclops iris',(0,ey-.0148,ez),(.0115,.0025,.0125),iris,32,16)
    sphere('V117 ONE black cyclops pupil',(0,ey-.0171,ez),(.0052,.0015,.007),pupil,24,12)
    # Skin upper/lower orbital folds: elliptical surfaces, not full torus goggles.
    for upper in [True,False]:
        vv=[];ff=[];steps=36
        for row in range(4):
            t=row/3
            for i in range(steps+1):
                a=(i/steps*math.pi)+(0 if upper else math.pi)
                rx=.033+.011*t;rz=.020+.008*t
                x=rx*math.cos(a);z=ez+rz*math.sin(a);y=ey-.006*(1-t)+.009*t
                vv.append((x,y,z))
        for row in range(3):
            for i in range(steps):a=row*(steps+1)+i;ff.append((a,a+steps+1,a+steps+2,a+1))
        fold=mesh('V117 continuous '+('upper heavy brow' if upper else 'lower orbital fold'),vv,ff,skin)
        for m in fold.data.materials:m.use_backface_culling=False
    # Short rough locks rooted in the NEW whole male head and jaw surfaces.
    rnd=random.Random(117)
    zones=[('scalp',[v.co.copy() for v in data.vertices if v.co.z>1.65 and (v.co.y>-.055 or abs(v.co.x)>.062)],450),
           ('beard',[v.co.copy() for v in data.vertices if 1.49<v.co.z<1.564 and v.co.y<-.075 and abs(v.co.x)<.079],420)]
    haircounts={}
    for name,pts,count in zones:
        vv=[];ff=[]
        if len(pts)<8:haircounts[name]=0;continue
        for i in range(count):
            p=rnd.choice(pts);direction=Vector((p.x,p.y,0));direction.normalize();side=Vector((-direction.y,direction.x,0));start=len(vv)
            length=rnd.uniform(.025,.057) if name=='beard' else rnd.uniform(.035,.065)
            for j in range(4):
                t=j/3;c=p+direction*(.001+.003*math.sin(t*math.pi))+Vector((0,0,-length*t));w=.0016*(1-t*.9)
                vv.extend([tuple(c-side*w),tuple(c+side*w)])
            for j in range(3):a=start+j*2;ff.append((a,a+2,a+3,a+1))
        mesh('V117 CC0 male rooted '+name,vv,ff,hairmat);haircounts[name]=count
    # Waist textile. This is a garment over actual pelvis, never a proxy body.
    cloth=bpy.data.materials.get('V117 crew woven tunic dye 2') or bpy.data.materials.get('V117 folded flax seam tape')
    if not cloth:cloth=material('V117 neutral rough woven wrap',(.18,.12,.07),.94)
    vv=[];ff=[];uv=[];N=128;R=14
    for row in range(R+1):
        t=row/R
        for i in range(N):
            a=i*math.tau/N;r=.207+.022*t+.004*math.sin(a*11)*math.sin(t*math.pi*.8)
            vv.append((r*math.cos(a),r*.73*math.sin(a),1.015-.335*t-.009*math.sin(a*7)*t*t));uv.append((i/N*4,t*3))
    for row in range(R):
        for i in range(N):a=row*N+i;b=row*N+(i+1)%N;ff.append((a,a+N,b+N,b))
    garment=mesh('V117 CC0 male thick woven waist wrap',vv,ff,cloth);uvlayer=garment.data.uv_layers.new(name='WovenUV')
    for p in garment.data.polygons:
        for li in p.loop_indices:uvlayer.data[li].uv=uv[garment.data.loops[li].vertex_index]
    sol=garment.modifiers.new('Woven garment actual thickness','SOLIDIFY');sol.thickness=.0025;sol.offset=-1
    # Only after the replacement is complete, hide legacy whole body, eye,
    # beard, wraps and temporary V117 meshes. Never hide unrelated scene assets.
    hidden=[]
    for obj in legacy:
        if not obj:continue
        obj.hide_render=True;obj.hide_set(True);hidden.append(obj.name)
    source.hide_render=True;source.hide_set(True)
    body.hide_render=False;body.hide_set(False)
    audit={'source':source.name,'sourceBaseVertices':len(source.data.vertices),'bodyObject':body.name,
        'continuousCC0MaleAnatomy':True,'bodyHeightLocalMetres':1.73,'parentScale':list(giant.scale),
        'exactlyOneNewEyeball':True,'pairedOcularBoundariesClosed':ocular_cap_count,'eyeCenterLocal':[0,ey,ez],'legacyHidden':hidden,
        'skinTexture':'generated technical pigment and pore normal; not measured scan, no old UV atlas',
        'nativeSubdivision':1,'hairCounts':haircounts,'seaLightingTerrainChanged':False,
        'limitation':'Single-eye facial sculpt is a bounded native adaptation of complete CC0 male anatomy, not production character sculpting.'}
    scene['v117_cc0_giant_replaced']=True;bpy.context.view_layer.update()
    (out/'cc0-male-replacement-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8')
    print('V117_CC0_MALE_REPLACED',json.dumps(audit),flush=True);return audit

if globals().get('V117_RUN_REPLACE_GIANT'):
    V117_REPLACE_GIANT_RESULT=replace_giant(ROOT,OUT)
