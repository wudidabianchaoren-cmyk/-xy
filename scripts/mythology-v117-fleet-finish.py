"""Bounded additive V117 finishing for the actual editable V112 native fleet.

Root calls finish_fleet(ROOT, OUT) once in its existing visible Blender session.
Does not load/save a .blend, render, export, change camera/lights/terrain/sea,
or install plugins. Materials are direct image->Principled PBR, exportable to
glTF. Existing anatomical models/poses are retained, not replaced by proxies.
"""
import bpy, math, json, re, hashlib, random
from pathlib import Path
import numpy as np
from mathutils import Vector


def finish_fleet(root, out):
    root, out = Path(root), Path(out)
    scene = bpy.context.scene
    if scene.get('v117_fleet_finish_started'):
        raise RuntimeError('V117 finishing already started: inspect audit/load checkpoint, do not apply twice')
    fleet = bpy.data.collections.get('V112_FLEET')
    ships = [bpy.data.objects.get('V112_SHIP_' + str(i)) for i in range(4)]
    if not fleet or not all(ships):
        raise RuntimeError('Requires the editable V112 native four-vessel scene')
    fleet_objects = list(fleet.all_objects)
    source_parts = [o for ship in ships for o in ship.children_recursive
                    if o and o.type=='MESH' and o.name.startswith('V112 ')
                    and any('FLEET' in c.name and ('SOURCE' in c.name.upper()) for c in o.users_collection)]
    active_batches = [o for ship in ships for o in ship.children_recursive
                      if o and o.type=='MESH' and 'material batch' in o.name and not o.hide_render]
    # Promote ONLY the retained editable counterparts, and retire corresponding
    # material batches. Never enable hidden native84/history geometry. Parent
    # matrices are untouched. Shared mesh data stays shared; no geometry copies.
    restored_collection = None
    if source_parts and active_batches:
        restored_collection=bpy.data.collections.new('V117_EDITABLE_FLEET / restored original constructed parts')
        scene.collection.children.link(restored_collection)
        for o in source_parts:
            restored_collection.objects.link(o)
            o.hide_render=False;o.hide_set(False)
            if o not in fleet_objects:fleet_objects.append(o)
        for o in active_batches:o.hide_render=True;o.hide_set(True)
    sails = [o for o in fleet_objects if o and o.type == 'MESH' and o.get('role') == 'sail' and not o.hide_render]
    if len(sails) != 6:
        raise RuntimeError('Expected six native V112 cloth surfaces (two + two + one + one), got ' + str(len(sails)))
    editable = [o for o in fleet_objects if o and o.type == 'MESH' and 'hull strake' in o.name and not o.hide_render]
    if len(editable) < 100:
        raise RuntimeError('Needs editable planks, not a material-batched web export')
    giant = bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt')
    if not giant:
        raise RuntimeError('Original retained cyclops anatomy root missing')
    visible_giant = [o for o in giant.children_recursive if o.type == 'MESH' and not o.hide_render]
    pupils = [o for o in visible_giant if 'pupil' in o.name.lower()]
    eyeballs = [o for o in visible_giant if 'eyeball' in o.name.lower()]
    if len(pupils) != 1 or len(eyeballs) != 1:
        raise RuntimeError('Cyclops must already contain exactly ONE visible pupil and eyeball; inspect anatomy before finishing')
    sources = root / 'assets/odyssey/pbr-v103'
    for folder in ('weathered_brown_planks', 'rough_linen'):
        for name in ('Diffuse.jpg', 'Rough.jpg', 'nor_gl.jpg'):
            if not (sources / folder / name).exists():
                raise FileNotFoundError(sources / folder / name)
    scene['v117_fleet_finish_started'] = True
    out.mkdir(parents=True, exist_ok=True)
    texdir = out / 'fleet-materials'
    texdir.mkdir(exist_ok=True)
    added = bpy.data.collections.new('V117_FLEET_FINISH / sail reinforcement and rigging')
    scene.collection.children.link(added)
    audit = {'version':117, 'completed':False, 'sourceFleet':'V112_FLEET',
             'sails':[], 'photoDerivatives':[], 'crew':{}, 'cyclops':{},
             'restoredEditableParts':len(source_parts) if restored_collection else 0,
             'retiredCorrespondingBatches':[o.name for o in active_batches] if restored_collection else [],
             'seaChanged':False, 'terrainChanged':False, 'lightsChanged':False,
             'notClaimed':['new human sculpt', 'cloth simulation', 'downloaded leather scan',
                           'same unverified ArtStation plugin stack', 'Cycles procedural shader exported unchanged']}
    auditfile = out / 'fleet-finish-audit.json'

    def record():
        auditfile.write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding='utf8')
    record()

    def load(path, noncolor=False):
        im = bpy.data.images.load(str(path), check_existing=True)
        im.colorspace_settings.name = 'Non-Color' if noncolor else 'sRGB'
        return im

    def pixels_from(path, size):
        # Copy then downsample; never mutate a source scan shared by other pages.
        src = load(path)
        work = src.copy()
        work.scale(size, size)
        arr = np.empty(size * size * 4, dtype=np.float32)
        work.pixels.foreach_get(arr)
        bpy.data.images.remove(work)
        return arr.reshape(size, size, 4)

    def save_pixels(name, data, source=None, processing=None, noncolor=False):
        size = data.shape[0]
        im = bpy.data.images.new('V117 ' + name, width=size, height=size, alpha=True)
        im.colorspace_settings.name = 'Non-Color' if noncolor else 'sRGB'
        im.pixels.foreach_set(np.ascontiguousarray(data, dtype=np.float32).ravel())
        im.filepath_raw = str(texdir / (name + '.png'))
        im.file_format = 'PNG'; im.save()
        audit['photoDerivatives'].append({'file':im.filepath_raw, 'source':str(source) if source else None,
            'processing':processing, 'sha256':hashlib.sha256(Path(im.filepath_raw).read_bytes()).hexdigest()})
        return im

    linenpath = sources / 'rough_linen/Diffuse.jpg'
    linen = pixels_from(linenpath, 1024)
    lum = np.clip(linen[:,:,:3] @ np.array([.2126,.7152,.0722], dtype=np.float32), .015, 1)
    # Actual weave variation retained, blue dye removed in an image rather than a
    # Cycles-only MixRGB chain. No false statement that the scan was white flax.
    lnorm = np.clip(lum / max(float(np.median(lum)), .03), .58, 1.30)
    flaxarr = np.ones_like(linen)
    flaxarr[:,:,:3] = np.clip(lnorm[:,:,None] * np.array([.63,.585,.49]), 0, 1)
    flax = save_pixels('undyed-flax-photo-derived', flaxarr, linenpath,
                      'neutralise photographed blue dye; preserve measured weave luminance; flax pigment')
    normal_linen = load(sources/'rough_linen/nor_gl.jpg', True)
    rough_linen = load(sources/'rough_linen/Rough.jpg', True)
    normal_wood = load(sources/'weathered_brown_planks/nor_gl.jpg', True)
    rough_wood = load(sources/'weathered_brown_planks/Rough.jpg', True)

    def pbr(name, color=(.5,.5,.5), image=None, normal=None, rough_image=None,
            rough=.8, strength=.3, metal=0, sheen=0):
        m = bpy.data.materials.new('V117 ' + name); m.use_nodes = True
        nodes, links = m.node_tree.nodes, m.node_tree.links
        bs = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
        bs.inputs['Base Color'].default_value = (*color,1)
        bs.inputs['Roughness'].default_value = rough
        bs.inputs['Metallic'].default_value = metal
        bs.inputs['Sheen Weight'].default_value = sheen
        bs.inputs['Specular IOR Level'].default_value = .25 if sheen else .35
        if image:
            n=nodes.new('ShaderNodeTexImage');n.image=image;n.label='Frozen photo-derived colour / glTF direct'
            links.new(n.outputs['Color'],bs.inputs['Base Color'])
        if rough_image:
            n=nodes.new('ShaderNodeTexImage');n.image=rough_image
            links.new(n.outputs['Color'],bs.inputs['Roughness'])
        if normal:
            n=nodes.new('ShaderNodeTexImage');n.image=normal
            nm=nodes.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=strength
            links.new(n.outputs['Color'],nm.inputs['Color']);links.new(nm.outputs[0],bs.inputs['Normal'])
        m['v117ExportContract']='direct image basecolour + image normal + image roughness; no procedural-only correction'
        return m

    sailmat = pbr('flax sail / sun-softened woven canvas', image=flax, normal=normal_linen,
                  rough_image=rough_linen, strength=.22, sheen=.28)
    seammat = pbr('folded flax seam tape', image=flax, normal=normal_linen, rough=.94, strength=.18)
    ropemat = pbr('natural hemp boltropes',(.26,.21,.135),normal=normal_linen,rough=.95,strength=.3)
    woodpix = pixels_from(sources/'weathered_brown_planks/Diffuse.jpg',1024)
    woodmats=[]
    for k in range(4):
        data=woodpix.copy();data[:,:,:3]=np.clip(data[:,:,:3]*(.73+k*.055),0,1)
        im=save_pixels('timber-weathering-tone-'+str(k),data,sources/'weathered_brown_planks/Diffuse.jpg',
                       'bounded linear scan tint; keeps photographed grain and knots; four staggered plank tones')
        woodmats.append(pbr('weathered oak tone '+str(k), image=im, normal=normal_wood,
                            rough_image=rough_wood,strength=.32))

    def assign(obj,mat):
        if not obj.data.materials:
            obj.data.materials.append(mat)
        # OBJECT link is critical: anatomical rowers use shared original mesh.
        for slot in obj.material_slots:
            slot.link='OBJECT';slot.material=mat

    def mesh(name, verts, faces, parent, mat, uvs=None):
        d=bpy.data.meshes.new('V117 '+name);d.from_pydata(verts,[],faces);d.update()
        o=bpy.data.objects.new('V117 '+name,d);added.objects.link(o);o.parent=parent
        d.materials.append(mat)
        if uvs:
            uv=d.uv_layers.new(name='PhotoUV')
            for p in d.polygons:
                for li in p.loop_indices:uv.data[li].uv=uvs[d.loops[li].vertex_index]
        for p in d.polygons:p.use_smooth=True
        return o

    def tube(name, points, radius, parent, mat, sides=6):
        vv=[];ff=[];uv=[];distance=0
        for i,point in enumerate(points):
            p=Vector(point)
            if i:distance+=(p-Vector(points[i-1])).length
            tangent=Vector(points[min(i+1,len(points)-1)])-Vector(points[max(0,i-1)])
            if tangent.length<1e-8:tangent=Vector((0,0,1))
            tangent.normalize();a=tangent.cross(Vector((0,0,1)))
            if a.length<.01:a=tangent.cross(Vector((0,1,0)))
            a.normalize();b=tangent.cross(a)
            for j in range(sides):
                an=j*math.tau/sides;vv.append(tuple(p+radius*(a*math.cos(an)+b*math.sin(an))))
                uv.append((distance/.2,j/sides))
        for i in range(len(points)-1):
            for j in range(sides):
                a=i*sides+j;b=i*sides+(j+1)%sides;ff.append((a,b,b+sides,a+sides))
        return mesh(name,vv,ff,parent,mat,uv)

    wood_count=0
    for obj in fleet_objects:
        if not obj:continue
        if obj.type!='MESH' or obj.hide_render:continue
        old=' '.join(s.material.name for s in obj.material_slots if s.material).lower()
        if 'weathered timber' in old:
            h=int(hashlib.sha1(obj.name.encode()).hexdigest()[:6],16)
            assign(obj,woodmats[h%4]);wood_count+=1
            # Hull UVs remain longitudinal, but each real plank samples a distinct
            # scan row. This removes a repeated large dark knot aligned on every strake.
            if 'hull strake' in obj.name and obj.data.uv_layers.active:
                for loop in obj.data.uv_layers.active.data:
                    loop.uv.x+=((h//4)%17)*.137
                    loop.uv.y+=((h//68)%13)*.071
            for mod in obj.modifiers:
                if mod.type=='BEVEL':mod.segments=3;mod.width=min(mod.width,.018)
        elif 'hemp rope' in old:
            assign(obj,ropemat)

    def surface(obj,u,v):
        # Exact V112 grid, bilinear evaluation, including original load-bearing belly.
        nx,ny=40,44
        x=min(nx-1,int(u*nx));y=min(ny-1,int(v*ny));a=u*nx-x;b=v*ny-y
        c=[obj.data.vertices[j*(nx+1)+i].co for i,j in [(x,y),(x+1,y),(x,y+1),(x+1,y+1)]]
        return c[0]*(1-a)*(1-b)+c[1]*a*(1-b)+c[2]*(1-a)*b+c[3]*a*b

    for si,sail in enumerate(sails):
        if len(sail.data.vertices)!=1845:
            raise RuntimeError('Unexpected sail topology '+sail.name)
        assign(sail,sailmat)
        for mod in sail.modifiers:
            if mod.type=='SOLIDIFY':mod.thickness=.0025;mod.offset=0
        # V112 solid rope-like 14mm seam tubes were visibly oversized. Tighten
        # existing seam geometry radially without adding polygon density.
        shrunk=0
        for obj in sail.parent.children_recursive:
            if not obj or obj.hide_render:continue
            if obj.type!='MESH' or sail.name not in obj.name:continue
            if 'sewn panel seam' in obj.name and len(obj.data.vertices)%4==0:
                for off in range(0,len(obj.data.vertices),4):
                    ring=list(obj.data.vertices)[off:off+4]
                    cen=sum((v.co for v in ring),Vector())/4
                    for vv in ring:vv.co=cen+(vv.co-cen)*.32
                assign(obj,seammat);shrunk+=1
        before=len(added.objects)
        # Double folded seam strips follow the real curved surface. 32mm lap,
        # shallow normal offset, and small corner patches show construction.
        for k in range(1,9):
            u=k/9;verts=[];uv=[]
            span=(surface(sail,1,.5)-surface(sail,0,.5)).length
            half=.016/max(span,.1)
            for j in range(25):
                v=j/24
                for q in [u-half,u+half]:
                    p=surface(sail,q,v)+Vector((0,.009,0));verts.append(tuple(p));uv.append((q*span/.27,v*8/.27))
            faces=[(j*2,j*2+1,j*2+3,j*2+2) for j in range(24)]
            mesh('sail%d double-lapped woven seam%d'%(si,k),verts,faces,sail.parent,seammat,uv)
        for ci,(u0,v0) in enumerate([(0,0),(1,0),(0,1),(1,1)]):
            su=1 if u0==0 else -1;sv=1 if v0==0 else -1
            uvpoints=[(u0,v0),(u0+su*.065,v0),(u0,v0+sv*.07)]
            vv=[tuple(surface(sail,u,v)+Vector((0,.018,0))) for u,v in uvpoints]
            mesh('sail%d stitched corner reinforcement%d'%(si,ci),vv,[(0,1,2)],sail.parent,seammat,
                 [(u*20,v*20) for u,v in uvpoints])
            # Small rope eye seized into corner; not a disconnected decorative knot.
            p=surface(sail,u0,v0)+Vector((0,.032,0));rr=.055
            pts=[tuple(p+Vector((math.cos(j*math.tau/16)*rr,0,math.sin(j*math.tau/16)*rr))) for j in range(17)]
            tube('sail%d corner eye%d'%(si,ci),pts,.012,sail.parent,ropemat)
        audit['sails'].append({'name':sail.name,'retainedVertices':len(sail.data.vertices),
            'clothThicknessMetres':.0025,'oversizedSeamsReduced':shrunk,
            'addedReinforcementObjects':len(added.objects)-before,'simulation':False})
    audit['woodObjectsWithDirectPbr']=wood_count
    record()

    # Crew clothing receives real, photo-derived woven colour maps. Reuse shared
    # anatomy; do not generate 48 high-resolution body duplicates/subdivisions.
    palette=[(.46,.43,.35),(.28,.31,.255),(.33,.205,.14),(.37,.34,.29),(.29,.32,.31),(.49,.405,.28)]
    wardrobe=[]
    small=linen[::2,::2,:].copy();small_lum=lnorm[::2,::2]
    for k,tint in enumerate(palette):
        a=small.copy();a[:,:,:3]=np.clip(small_lum[:,:,None]*np.array(tint),0,1)
        im=save_pixels('crew-natural-dyed-weave-'+str(k),a,linenpath,'actual weave luminance / muted natural dye variation')
        wardrobe.append(pbr('crew woven tunic dye '+str(k),image=im,normal=normal_linen,rough=.92,strength=.18,sheen=.14))
    variants={};cloth_thickness=[]
    for obj in fleet_objects:
        if not obj:continue
        if obj.type!='MESH' or obj.get('role')!='crew' or obj.hide_render:continue
        name=obj.name.lower();mn=' '.join(s.material.name for s in obj.material_slots if s.material).lower()
        iscloth=any(k in name+' '+mn for k in ['tunic','mantle','linen','sleeve'])
        if not iscloth:continue
        h=int(hashlib.sha1((obj.parent.name if obj.parent else obj.name).encode()).hexdigest()[:6],16)
        index=h%len(wardrobe)
        if 'mantle' in name:index=(index+2)%len(wardrobe)
        assign(obj,wardrobe[index]);variants[str(index)]=variants.get(str(index),0)+1
        # Only close main-ship garment shells; modifiers <= 6mm, no subdivision.
        if 'ship0' in name and len(obj.data.vertices)<12000 and not any(m.type=='SOLIDIFY' for m in obj.modifiers):
            counts={}
            for poly in obj.data.polygons:
                vv=list(poly.vertices)
                for j,a in enumerate(vv):
                    key=tuple(sorted((a,vv[(j+1)%len(vv)])));counts[key]=counts.get(key,0)+1
            if any(v==1 for v in counts.values()):
                so=obj.modifiers.new('V117 actual garment hem thickness','SOLIDIFY');so.thickness=.004;so.offset=-1
                cloth_thickness.append(obj.name)
    audit['crew']={'retainedDetailedAnatomy':True,'sharedMeshRetained':True,'wardrobeCounts':variants,
                   'closeGarmentsWithThickness':cloth_thickness,'addedSubdivisionLevels':0}

    # Cyclops: retained single-eye topology; sun-worn skin photo, low oil sheen.
    # No paired eye creation, no feminine breast primitives, no anatomy proxy.
    body=next((o for o in visible_giant if 'human.body' in o.name.lower()),None)
    if not body:raise RuntimeError('Retained complete giant body missing')
    # Widen the ONE existing eye assembly in its real anatomical socket rather
    # than adding a second pair, floating sphere, or a new forehead decoration.
    eye = eyeballs[0]
    eye_center = sum((v.co for v in eye.data.vertices),Vector()) / len(eye.data.vertices)
    eye_parts=[o for o in visible_giant if any(x in o.name.lower() for x in
               ['eyeball','pupil','iris','eyelid','socket support'])]
    for obj in eye_parts:
        for v in obj.data.vertices:
            d=v.co-eye_center;v.co.x=eye_center.x+d.x*1.42;v.co.z=eye_center.z+d.z*1.20
        obj.data.update()
    brow_edits=0
    for v in body.data.vertices:
        x,y,z=v.co
        if abs(x-eye_center.x)<.10 and 1.625<z<1.666 and y<-.075:
            weight=math.sin(math.pi*(z-1.625)/.041)**2*max(0,1-((x-eye_center.x)/.10)**2)
            v.co.y-=.012*weight;brow_edits+=1
    atlas=next((n.image for m in body.data.materials if m and m.use_nodes
                for n in m.node_tree.nodes if n.type=='TEX_IMAGE' and n.image),None)
    skinmat=None
    if atlas:
        work=atlas.copy();work.scale(1024,1024);a=np.empty(1024*1024*4,dtype=np.float32)
        work.pixels.foreach_get(a);bpy.data.images.remove(work);a=a.reshape(1024,1024,4)
        gray=a[:,:,:3]@np.array([.2126,.7152,.0722],dtype=np.float32)
        a[:,:,:3]=np.clip((a[:,:,:3]*.65+gray[:,:,None]*.35)*np.array([.88,.86,.80]),0,1)
        im=save_pixels('cyclops-sunweathered-retained-atlas',a,atlas.filepath,
                       'retained real original UV skin atlas; reduced saturation; earthy sun weathering')
        skinmat=pbr('cyclops sun-worn anatomical skin',image=im,rough=.79)
        bs=next(n for n in skinmat.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
        bs.inputs['Subsurface Weight'].default_value=.035
        bs.inputs['Specular IOR Level'].default_value=.22
        for obj in visible_giant:
            if any(x in obj.name.lower() for x in ['human.body','eyelid','socket support','human.ears']):assign(obj,skinmat)
    # Verify/retain the existing broad flat male chest; do not repeatedly scale
    # the full body. Clamp only residual front protrusions in the actual torso.
    edited=0
    for v in body.data.vertices:
        x,y,z=v.co
        if abs(x)<.19 and 1.12<z<1.38 and y<-.132:
            blend=math.sin(math.pi*(z-1.12)/.26)**2
            target=-.128-.012*(1-(x/.19)**2)
            if y<target:v.co.y=y+(target-y)*blend*.65;edited+=1
    body.data.update()
    # Coarse geometry locks rooted on retained actual scalp/jaw surface. No
    # particle engine dependency and no transparent floating hair billboard.
    hairmat=pbr('cyclops coarse dark umber hair',(.027,.019,.012),rough=.96)
    rng=random.Random(117)
    scalp=[v.co.copy() for v in body.data.vertices if 1.642<v.co.z<1.73 and (v.co.y>-.072 or abs(v.co.x)>.070)]
    jaw=[v.co.copy() for v in body.data.vertices if 1.477<v.co.z<1.55 and v.co.y<-.10 and abs(v.co.x)<.085]
    hair_counts={}
    for label,candidates,count in [('scalp',scalp,520),('jaw beard',jaw,300)]:
        vv=[];ff=[]
        if len(candidates)<12:
            hair_counts[label]=0;continue
        for i in range(count):
            p=rng.choice(candidates);r=rng.uniform(.0010,.0021)
            length=rng.uniform(.026,.068) if label=='jaw beard' else rng.uniform(.036,.080)
            outward=Vector((p.x, p.y+.015,0))
            if outward.length<1e-6:outward=Vector((0,-1,0))
            outward.normalize();across=Vector((-outward.y,outward.x,0))
            start=len(vv)
            for j in range(4):
                t=j/3;center=p+outward*(.002+.006*math.sin(t*math.pi*.7))+Vector((.003*math.sin(i+t*4)*t,0,-length*t))
                w=r*(1-.84*t);vv.extend([tuple(center-across*w),tuple(center+across*w)])
            for j in range(3):ff.append((start+j*2,start+j*2+1,start+j*2+3,start+j*2+2))
        hair=mesh('cyclops rooted coarse '+label,vv,ff,giant,hairmat)
        hair_counts[label]=count
        if label=='jaw beard':
            for old in giant.children_recursive:
                if old and old.name=='V106 rooted beard':old.hide_render=True;old.hide_set(True)
    hide=next((o for o in visible_giant if 'rough hide waist wrap' in o.name.lower()),None)
    if hide:
        if not hide.data.uv_layers:
            uv=hide.data.uv_layers.new(name='RoughHideUV')
            for p in hide.data.polygons:
                for li in p.loop_indices:
                    v=hide.data.vertices[hide.data.loops[li].vertex_index].co
                    uv.data[li].uv=((math.atan2(v.y/.72,v.x)/math.tau)%1,(v.z-.59)/.34)
        # Mild drape folds on the existing garment, not a new generic cone.
        for v in hide.data.vertices:
            a=math.atan2(v.co.y/.72,v.co.x);f=(.91-v.co.z)/.32
            radial=1+.018*math.sin(a*11+.3)*max(0,min(1,f))
            v.co.x*=radial;v.co.y*=radial
        hide.data.update()
        # Procedural hide pigment is explicitly labelled, never a downloaded scan.
        size=512;y,x=np.mgrid[0:size,0:size].astype(np.float32)/size
        mottled=.83+.09*np.sin(x*math.tau*9+np.sin(y*math.tau*3))+.055*np.sin(y*math.tau*23+x*math.tau*4)
        rgba=np.ones((size,size,4),dtype=np.float32);rgba[:,:,:3]=mottled[:,:,None]*np.array([.15,.105,.06])
        him=save_pixels('rough-hide-generated-pigment',rgba,None,'native generated leather pigment; not a photo scan')
        assign(hide,pbr('cyclops rough untreated hide',image=him,rough=.96))
        for mod in hide.modifiers:
            if mod.type=='SOLIDIFY':mod.thickness=.003
    audit['cyclops']={'root':giant.name,'visiblePupils':len(pupils),'visibleEyeballs':len(eyeballs),
        'retainedWholeAnatomicalMesh':body.name,'residualMaleChestVerticesFlattened':edited,
        'singleEyeAssemblyScaleXZ':[1.42,1.20],'anatomicalBrowVerticesEdited':brow_edits,
        'meshHairLocksRootedOnActualScalpAndJaw':hair_counts,
        'originalSkinAtlasPreserved':bool(atlas),'roughHidePleatsModified':bool(hide),
        'newBodyPrimitives':0,'singleEyeTopologyUnchanged':True}
    audit['addedMeshObjects']=len(added.objects)
    audit['addedBaseVertices']=sum(len(o.data.vertices) for o in added.objects if o.type=='MESH')
    audit['completed']=True
    scene['v117_fleet_finish_completed']=True
    bpy.context.view_layer.update();record()
    print('V117_FLEET_FINISH_COMPLETE',json.dumps({'sails':len(sails),'wood':wood_count,
          'addedObjects':len(added.objects),'audit':str(auditfile)}),flush=True)
    return {'audit':audit,'collection':added,'editableCollection':restored_collection,'ships':ships,'giant':giant}


if globals().get('V117_RUN_FLEET_FINISH'):
    V117_FLEET_FINISH_RESULT=finish_fleet(ROOT,OUT)
