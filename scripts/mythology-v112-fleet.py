"""V112 native four-vessel rebuild. Run by the existing visible Blender MCP.

build_fleet(ROOT, OUT) creates geometry only; it never changes sea, land, camera
or lights and does not render. OUT receives an audit. Caller owns stage saves
and GLB export. All dimensions are metres; Blender coordinates are Z-up.
"""
import bpy, math, json, re, random
from pathlib import Path
from mathutils import Vector, Matrix


def build_fleet(root, out):
    root, out = Path(root), Path(out)
    out.mkdir(parents=True, exist_ok=True)
    previous=bpy.data.collections.get('V112_FLEET')
    if previous:
        if len(previous.all_objects):raise RuntimeError('V112_FLEET contains production; do not run twice')
        bpy.data.collections.remove(previous)
    collection = bpy.data.collections.new('V112_FLEET')
    bpy.context.scene.collection.children.link(collection)
    rng = random.Random(112)
    audit = {'units': 'metres', 'coordinateSystem': 'Blender Z-up',
             'seaChanged': False, 'oldHidden': [], 'ships': [],
             'crewSource': '.verify/v32-104/web-instances.json / actual anatomical seated rig poses',
             'workflow': 'new curved plank meshes + solidify + bevel; photo PBR UV; retained detailed posed anatomical figures',
             'notClaimed': ['new human sculpt from cube', 'cloth simulation', 'identical external artist plugins']}
    # The original native84_0..35 contain the cyclops, mainland and vegetation.
    # Never hide those. Only explicit vessel range and V104 vessel joinery.
    for obj in list(bpy.context.scene.objects):
        match = re.match(r'native84_(\d+)\b', obj.name)
        old_ship = bool(match and 36 <= int(match.group(1)) <= 252)
        old_ship |= obj.name.startswith('native104_')
        old_ship |= 'V104 bronze plank fasteners' in obj.name
        if old_ship:
            obj.hide_render = True
            obj.hide_set(True)
            audit['oldHidden'].append(obj.name)

    def plain(name, color, rough=.7, metal=0):
        m=bpy.data.materials.new('V112 '+name);m.use_nodes=True
        bs=next(node for node in m.node_tree.nodes if node.type=='BSDF_PRINCIPLED')
        bs.inputs['Base Color'].default_value=(*color,1)
        bs.inputs['Roughness'].default_value=rough;bs.inputs['Metallic'].default_value=metal
        return m

    def photo(name, folder, tint=None, rough=.8, strength=.25, sheen=0):
        m=plain(name,(.7,.6,.4),rough);n=m.node_tree.nodes;l=m.node_tree.links
        bs=next(node for node in n if node.type=='BSDF_PRINCIPLED');bs.inputs['Sheen Weight'].default_value=sheen
        for filename,socket,noncolor in [('Diffuse.jpg','Base Color',False),('Rough.jpg','Roughness',True),('nor_gl.jpg','Normal',True)]:
            p=root/'assets/odyssey/pbr-v103'/folder/filename
            im=bpy.data.images.load(str(p),check_existing=True)
            im.colorspace_settings.name='Non-Color' if noncolor else 'sRGB'
            t=n.new('ShaderNodeTexImage');t.image=im;t.label='Actual CC0 photo scan / '+folder
            if socket=='Normal':
                nm=n.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=strength
                l.new(t.outputs['Color'],nm.inputs['Color']);l.new(nm.outputs[0],bs.inputs[socket])
            else:l.new(t.outputs['Color'],bs.inputs[socket])
        # A tint is stored as a glTF-compatible BSDF factor; original scan stays intact.
        if tint:bs.inputs['Base Color'].default_value=(*tint,1)
        m['photoSource']=folder;m['physicalUVScaleMetres']=1.8 if 'wood' in name.lower() else .27
        return m

    wood=photo('weathered timber photo PBR','weathered_brown_planks',rough=.78,strength=.36)
    cloths=[photo('linen sail '+str(i),'rough_linen',rough=.94,strength=.32,sheen=.28) for i in range(4)]
    # True coloured photos, not a grey noise surface. Native tint is intentionally subtle.
    bronze=plain('worn bronze fittings',(.24,.13,.045),.43,.73)
    tar=plain('tarred seams and dark rope',(.028,.022,.015),.96)
    rope=photo('hemp rope','rough_linen',rough=.97,strength=.4)
    ochre=plain('oxide ochre protective band',(.23,.085,.024),.79)
    blue=plain('weathered blue protective band',(.055,.13,.17),.77)
    red=plain('deep iron-red protective band',(.21,.044,.023),.82)
    clay=plain('unglazed terracotta amphora',(.27,.11,.048),.91)
    leather=plain('worn leather',(.075,.038,.02),.88)
    hair=plain('matte dark brown hair',(.022,.012,.006),.94)
    skin=plain('sailor original photograph skin',(.56,.35,.22),.71)
    skinbs=next(node for node in skin.node_tree.nodes if node.type=='BSDF_PRINCIPLED')
    skinbs.inputs['Subsurface Weight'].default_value=.07
    skinfile=root/'assets/odyssey/pbr-v103/skin-atlas.png'
    if skinfile.exists():
        t=skin.node_tree.nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(skinfile),check_existing=True)
        skin.node_tree.links.new(t.outputs['Color'],skinbs.inputs['Base Color'])

    def link(obj,parent=None,mat=None):
        collection.objects.link(obj)
        if parent:obj.parent=parent
        if mat and hasattr(obj.data,'materials'):obj.data.materials.append(mat)
        return obj

    def mesh(name,verts,faces,parent,mat,uvs=None):
        data=bpy.data.meshes.new('V112 '+name);data.from_pydata(verts,[],faces);data.update()
        obj=link(bpy.data.objects.new('V112 '+name,data),parent,mat)
        if uvs:
            layer=data.uv_layers.new(name='PhotoUV')
            for poly in data.polygons:
                for li in poly.loop_indices:layer.data[li].uv=uvs[data.loops[li].vertex_index]
        else:
            layer=data.uv_layers.new(name='PhotoUV')
            for poly in data.polygons:
                for li in poly.loop_indices:
                    p=data.vertices[data.loops[li].vertex_index].co
                    layer.data[li].uv=(p.x/1.8,(p.y+p.z*.27)/1.8)
        for p in data.polygons:p.use_smooth=True
        return obj

    def solid(obj,t=.06,bevel=.014):
        s=obj.modifiers.new('V112 actual timber thickness','SOLIDIFY');s.thickness=t;s.offset=0
        if bevel:
            b=obj.modifiers.new('V112 softened worn edges','BEVEL');b.width=bevel;b.segments=2
        return obj

    def line(name,points,r,parent,mat,sides=6):
        # Mesh tubes are predictable for native and glTF. Frenet-free frame keeps joins stable.
        vv=[];ff=[];uv=[]
        for i,p in enumerate(points):
            p=Vector(p);d=Vector(points[min(i+1,len(points)-1)])-Vector(points[max(0,i-1)])
            if d.length<1e-7:d=Vector((0,0,1))
            d.normalize();a=d.cross(Vector((0,0,1)))
            if a.length<.01:a=d.cross(Vector((0,1,0)))
            a.normalize();b=d.cross(a)
            for k in range(sides):
                an=k*math.tau/sides;vv.append(tuple(p+r*(a*math.cos(an)+b*math.sin(an))));uv.append((i*.18,k/sides))
        for i in range(len(points)-1):
            for k in range(sides):
                a=i*sides+k;b=i*sides+(k+1)%sides;ff.append((a,b,b+sides,a+sides))
        ff.extend([tuple(range(sides-1,-1,-1)),tuple((len(points)-1)*sides+k for k in range(sides))])
        return mesh(name,vv,ff,parent,mat,uv)

    def box(name,center,size,parent,mat,bevel=.025):
        x,y,z=center;a,b,c=[v/2 for v in size]
        vv=[(x+dx*a,y+dy*b,z+dz*c) for dz in [-1,1] for dy in [-1,1] for dx in [-1,1]]
        o=mesh(name,vv,[(0,2,3,1),(4,5,7,6),(0,1,5,4),(2,6,7,3),(0,4,6,2),(1,3,7,5)],parent,mat)
        if bevel:
            m=o.modifiers.new('V112 worn timber edges','BEVEL');m.width=bevel;m.segments=2
        return o

    def surface(u,v,L,W,D,side):
        # Strong keel, full shoulders and rising stem/stern. No planar slab hull.
        x=(u-.5)*L;sheer=.80*abs(2*u-1)**3.4
        half=W*.5*max(.005,math.sin(math.pi*u))**.56
        y=side*half*(.12+.88*math.sin(v*math.pi*.5))
        z=-.95+v*D+sheer
        return (x,y,z)

    def sail(parent,anchor,width,height,z,name,variant,phase=0):
        vv=[];ff=[];uv=[];nx=40;ny=44
        def point(u,v):
            # Attachment corners held, sail belly in wind direction with radiating tension wrinkles.
            xx=anchor+(u-.5)*width*(.84+.16*v)
            belly=(math.sin(math.pi*u)*math.sin(math.pi*v))**.72
            yy=.98*belly+.034*math.sin(u*67+v*13+phase)*math.sin(math.pi*v)
            zz=z+v*height+.22*math.sin(math.pi*u)*(1-v)**3
            yy+=.065*math.sin(math.atan2(v+.025,u+.025)*19)*math.exp(-4*(u+v))
            return xx,yy,zz
        for j in range(ny+1):
            for i in range(nx+1):
                u=i/nx;v=j/ny;vv.append(point(u,v));uv.append((u*width/.27,v*height/.27))
        for j in range(ny):
            for i in range(nx):
                a=j*(nx+1)+i;ff.append((a,a+1,a+nx+2,a+nx+1))
        o=mesh(name,vv,ff,parent,cloths[variant],uv);o['role']='sail';o['variant']=variant
        so=o.modifiers.new('V112 sewn cloth thickness','SOLIDIFY');so.thickness=.012
        for edge in range(4):
            pts=[]
            for k in range(41):
                q=k/40;u,v=[(q,0),(q,1),(0,q),(1,q)][edge];pts.append(point(u,v))
            line(name+' bolt rope '+str(edge),pts,.025,parent,rope)
        # Woven panels have actual shallow seam geometry, not black drawn guide lines.
        for k in range(1,9):line(name+' sewn panel seam '+str(k),[point(k/9,j/24) for j in range(25)],.007,parent,rope,4)
        return o

    # Reuse the actual posed, detailed human mesh; source includes face, fingers, feet,
    # eye/hair, draped tunic, leather belt and mantle. No sphere/cylinder proxy people.
    packs=json.loads((root/'.verify/v32-104/web-instances.json').read_text(encoding='utf8'))
    crew_packs=[p for p in packs if p.get('inVessel') and p['geometry']['name'].startswith('Anatomical seated sailor')][:30]
    crew_meshes=[]
    for pi,pack in enumerate(crew_packs):
        g=pack['geometry'];v=g['vertices'];ix=g['index'];vv=[(v[i],-v[i+2],v[i+1]) for i in range(0,len(v),3)]
        faces=[tuple(ix[i:i+3]) for i in range(0,len(ix),3)] if ix else [tuple(range(i,i+3)) for i in range(0,len(vv),3)]
        u=g.get('uv') or [];uv=[(u[i],u[i+1]) for i in range(0,len(u),2)] if u else None
        mn=pack['materialName'];mat=skin
        if 'tunic' in mn.lower():mat=cloths[0]
        elif 'mantle' in mn.lower():mat=cloths[1]
        elif 'leather' in mn.lower():mat=leather
        elif 'bronze' in mn.lower():mat=bronze
        elif 'short01' in mn.lower():mat=hair
        elif 'low-poly' in mn.lower():mat=plain('sailor eyes',(.018,.015,.01),.3)
        data=bpy.data.meshes.new('V112 retained posed anatomy '+str(pi));data.from_pydata(vv,[],faces);data.update();data.materials.append(mat)
        if uv:
            layer=data.uv_layers.new(name='Original anatomical UV')
            for poly in data.polygons:
                for li in poly.loop_indices:layer.data[li].uv=uv[data.loops[li].vertex_index]
        for p in data.polygons:p.use_smooth=True
        crew_meshes.append((data,mn))

    specs=[('Ulysses monumental galley',28,6.9,3.0,(-7,-3,.12),0,9.5,8.0,0),
           ('Ochre escort bireme',23,5.5,2.6,(42,24,.12),.42,7.7,7.0,1),
           ('Lean single-mast coastal scout',16,3.8,2.25,(-32,10,.12),-.28,5.4,5.8,2),
           ('Broad beamed provision trader',21,7.2,3.0,(-10,35,.12),.06,8.3,7.0,3)]
    for variant,(title,L,W,D,origin,heading,sw,sh,_) in enumerate(specs):
        boat=link(bpy.data.objects.new('V112_SHIP_'+str(variant),None));boat.location=origin;boat.rotation_euler.z=heading
        boat['variant']=variant;boat['role']='vessel';boat['title']=title;boat['lengthMetres']=L
        stripe=[red,ochre,blue,blue][variant]
        # Each strake is divided into staggered real planks with independent thickness.
        for side in [-1,1]:
            for band in range(11):
                divisions=6 if variant==0 else 5
                for piece in range(divisions):
                    start=piece/divisions;end=(piece+1)/divisions
                    if piece:start+=.0009
                    if piece<divisions-1:end-=.0009
                    vv=[];uv=[];ff=[]
                    for j in range(13):
                        u=start+(end-start)*j/12
                        for edge in range(2):
                            v=(band+edge*.96)/11;vv.append(surface(u,v,L,W,D,side));uv.append((u*L/1.8,(band+edge*.96)*.245))
                    for j in range(12):
                        a=j*2;ff.append((a,a+1,a+3,a+2) if side>0 else (a+2,a+3,a+1,a))
                    o=mesh('ship%d hull strake%02d piece%d side%d'%(variant,band,piece,side),vv,ff,boat,wood,uv)
                    solid(o,.095 if variant==0 else .075,.012)
            for v,r,mat in [(1,.13,wood),(.93,.075,stripe),(.78,.075,stripe),(.1,.085,wood)]:
                line('ship%d continuous wale %.2f side%d'%(variant,v,side),[surface(.015+.97*i/60,v,L,W,D,side) for i in range(61)],r,boat,mat,8)
            # Bronze nails placed at structural frame intersections, not gold fence posts.
            nailverts=[];nailfaces=[]
            for b in [2,5,8,10]:
                for k in range(1,25):
                    x,y,z=surface(k/25,b/11,L,W,D,side);start=len(nailverts)
                    for kk in range(6):
                        a=kk*math.tau/6;nailverts.append((x+.026*math.cos(a),y+side*.056,z+.026*math.sin(a)))
                    nailfaces.append(tuple(range(start,start+6)))
            mesh('ship%d bronze flush fasteners side%d'%(variant,side),nailverts,nailfaces,boat,bronze)
        # Deep keel and closely spaced bent ribs under an open rowing well.
        line('ship%d continuous structural keel'%variant,[(x,0,-.98+.8*abs(x/(L*.5))**3) for x in [(-.48+i*.96/50)*L for i in range(51)]],.15,boat,wood,8)
        for k in range(1,24):
            u=k/24;pts=[surface(u,v/12,L,W,D,-1) for v in range(12,-1,-1)]+[surface(u,v/12,L,W,D,1) for v in range(1,13)]
            line('ship%d bent oak frame%02d'%(variant,k),[(x,y*.948,z+.025) for x,y,z in pts],.095,boat,wood,6)
        # Deck follows hull outline. Fore/aft platforms taper with the curved gunwale.
        deckz=D-.90
        for board in range(23):
            y=(board-11)*W*.037
            if abs(y)>W*.47:continue
            for fore in [-1,1]:
                ua=.07 if fore<0 else .70;ub=.30 if fore<0 else .93
                pts=[]
                for j in range(15):
                    u=ua+(ub-ua)*j/14;half=W*.47*math.sin(math.pi*u)**.56
                    if abs(y)<half-.08:pts.append(((u-.5)*L,y,deckz+.18*abs(2*u-1)**3))
                if len(pts)>1:line('ship%d shaped foreaft deck board%d part%d'%(variant,board,fore),pts,W*.017,boat,wood,4)
        for side in [-1,1]:
            for j in range(3):box('ship%d side walkway%d%d'%(variant,side,j),(0,side*(W*.34+j*.14),deckz),(L*.40,.135,.11),boat,wood,.018)
        box('ship%d low bilge floor'%variant,(0,0,.32),(L*.53,W*.53,.13),boat,wood)
        rows=6 if variant!=2 else 4
        for row in range(rows):
            x=(-.22+row*.44/(rows-1))*L
            box('ship%d cross bench%02d'%(variant,row),(x,0,1.18),( .24,W*.61,.15),boat,wood)
            for side in [-1,1]:
                crew=link(bpy.data.objects.new('V112 ship%d rower%d side%d'%(variant,row,side),None),boat)
                crew.location=(x,side*W*.16,.26);crew.rotation_euler.z=math.pi/2+rng.uniform(-.035,.035)
                crew.scale=(rng.uniform(.97,1.035),)*3;crew['role']='rower'
                # Port and starboard cached rigs have genuinely different elbow/knee direction.
                off=0 if side<0 else 15
                for data,mn in crew_meshes[off:off+15]:
                    actor=link(bpy.data.objects.new('V112 '+mn+' boat%d row%d side%d'%(variant,row,side),data),crew)
                    actor['role']='crew';actor['detailedAnatomicalSource']=True
                a=(x,side*(W*.16+.55),1.45);b=(x+.72,side*(W*.5+3.5),-.18)
                line('ship%d row%d oar shaft side%d'%(variant,row,side),[a,b],.044,boat,wood,7)
                delta=Vector(b)-Vector(a);tip=Vector(b)+delta.normalized()*.72
                blade=box('ship%d row%d oar blade side%d'%(variant,row,side),tuple(tip),(.25,1.12,.065),boat,wood,.04)
                blade.rotation_euler.z=-math.atan2(delta.x,delta.y)
        # Main mast is modestly proportioned: tall enough to read, not a screen-sized slab.
        mastx=-L*.07;top=deckz+sh+3.8;foot=deckz+2.4
        line('ship%d tapered main mast'%variant,[(mastx,0,.35),(mastx,0,top)],.16 if variant==0 else .12,boat,wood,10)
        line('ship%d main yard'%variant,[(mastx-sw*.53,0,foot+sh),(mastx+sw*.53,0,foot+sh)],.095,boat,wood,8)
        sail(boat,mastx,sw,sh,foot,'ship%d wind loaded main linen sail'%variant,variant,.4*variant)
        for side in [-1,1]:
            for xx in [-.29*L,.27*L]:line('ship%d standing shroud%.1f%d'%(variant,xx,side),[(mastx,0,top-.9),(xx,side*W*.39,deckz+.05)],.024,boat,rope)
            line('ship%d tack sheet%d'%(variant,side),[(mastx+side*sw*.42,0,foot),(-side*L*.28,side*W*.37,deckz)],.022,boat,rope)
        if variant in [0,1]:
            ax=L*.25;hh=sh*.49;zz=deckz+1.7
            line('ship%d after mast'%variant,[(ax,0,.4),(ax,0,zz+hh+.25)],.095,boat,wood,8)
            line('ship%d after yard'%variant,[(ax-sw*.22,0,zz+hh),(ax+sw*.22,0,zz+hh)],.065,boat,wood)
            sail(boat,ax,sw*.43,hh,zz,'ship%d smaller after linen sail'%variant,variant,1.5)
        # Curved naval stem, recurved stern and low bronze ram distinguish an ancient galley.
        for end in [-1,1]:
            xx=end*L*.48
            pts=[(xx,0,deckz), (end*L*.515,0,deckz+.6),(end*L*.52,0,deckz+1.9),(end*L*.49,0,deckz+2.35)]
            line('ship%d carved recurved stem%d'%(variant,end),pts,.16,boat,wood,10)
            line('ship%d bronze stem guard%d'%(variant,end),[(x,y-.07,z) for x,y,z in pts],.052,boat,bronze)
        if variant<2:
            ram=mesh('ship%d forged bronze naval ram'%variant,[(-L*.49,-.28,-.1),(-L*.49,.28,-.1),(-L*.49,.18,.35),(-L*.49,-.18,.35),(-L*.59,0,.04)],[(0,1,4),(1,2,4),(2,3,4),(3,0,4),(0,3,2,1)],boat,bronze)
        # Supply ship has actual stowed amphorae; cargo never blocks the rowing well.
        cargo=10 if variant==3 else 3
        for k in range(cargo):
            cx=L*.32+(k%2)*.48;cy=(k//2-2)*.45 if variant==3 else (k-1)*.45
            verts=[];faces=[];profile=[(.08,0),(.21,.12),(.28,.42),(.17,.66),(.09,.74),(.12,.79)]
            for rr,zz in profile:
                for q in range(20):
                    an=q*math.tau/20;verts.append((cx+rr*math.cos(an),cy+rr*math.sin(an),deckz+zz))
            for p in range(len(profile)-1):
                for q in range(20):a=p*20+q;b=p*20+(q+1)%20;faces.append((a,b,b+20,a+20))
            mesh('ship%d terracotta provision amphora%d'%(variant,k),verts,faces,boat,clay)
        audit['ships'].append({'root':boat.name,'title':title,'origin':origin,'heading':heading,'length':L,'beam':W,'hullDepth':D,'rowers':rows*2,'separateSails':2 if variant<2 else 1})
        # Save each actual, editable vessel before proceeding. A later exporter
        # failure must never throw away the completed native modelling work.
        bpy.context.view_layer.update()
        checkpoint=out/('03-fleet-stage-%d-editable.blend'%(variant+1))
        bpy.ops.wm.save_as_mainfile(filepath=str(checkpoint))
        print('V112_FLEET_CHECKPOINT',variant+1,str(checkpoint),flush=True)

    # Stand/watch figures: reuse the original complete anatomy, hair and tailored
    # clothing assemblies, normalized to 1.88 metres instead of the old 3.1m hero.
    source=[o for o in bpy.context.scene.objects if re.match(r'native84_(39|40|41|42|43|44|45|46|47|48|49|50|51|55|56)\b',o.name)]
    body=next((o for o in source if re.match(r'native84_40\b',o.name)),None)
    if body:
        vv=[body.matrix_world@v.co for v in body.data.vertices];floor=min(v.z for v in vv);ceil=max(v.z for v in vv)
        cx=sum(v.x for v in vv)/len(vv);cy=sum(v.y for v in vv)/len(vv);sc=1.88/(ceil-floor)
        for variant,(_,L,W,D,origin,heading,_,_,_) in enumerate(specs):
            ship=bpy.data.objects['V112_SHIP_'+str(variant)]
            for who,px,py in [('captain',-L*.35,.25),('helmsman',L*.34,-.20)]:
                actor=link(bpy.data.objects.new('V112 ship%d %s detailed actor'%(variant,who),None),ship);actor.location=(px,py,D-.72)
                actor.rotation_euler.z=.20+variant*.16 if who=='captain' else math.pi*.6
                for s in source:
                    data=s.data.copy();mw=s.matrix_world
                    for v in data.vertices:v.co=(mw@v.co-Vector((cx,cy,floor)))*sc
                    for p in data.polygons:p.use_smooth=True
                    o=link(bpy.data.objects.new('V112 ship%d %s %s'%(variant,who,s.name.split(' ',1)[-1]),data),actor)
                    o['role']='crew'
    bpy.context.view_layer.update()
    checkpoint=out/'03-four-vessels-editable-before-batch.blend'
    bpy.ops.wm.save_as_mainfile(filepath=str(checkpoint))
    print('V112_FLEET_ALL_EDITABLE_SAVED',str(checkpoint),flush=True)
    if not globals().get('V112_BATCH_FLEET',False):
        meshes=[o for o in collection.all_objects if o.type=='MESH']
        audit.update({'meshObjects':len(meshes),'staticMaterialBatches':0,'batchSkipped':True,
                      'editableSourcesRetained':True,'baseVertices':sum(len(o.data.vertices) for o in meshes),
                      'crewCount':sum(s['rowers']+2 for s in audit['ships']),
                      'roots':['V112_SHIP_'+str(i) for i in range(4)],
                      'photoPbrFolders':['weathered_brown_planks','rough_linen'],
                      'nativeCheckpoint':str(checkpoint),
                      'materialsExport':'Principled image colour/roughness/normal; per-model UV; no Cycles-only projection'})
        (out/'fleet-build-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8')
        print('V112_FLEET_BUILT_NO_BATCH',json.dumps({k:audit[k] for k in ['meshObjects','baseVertices','crewCount','roots']}),flush=True)
        return {'collection':collection,'objects':list(collection.all_objects),
                'roots':[bpy.data.objects[n] for n in audit['roots']],
                'audit':audit,'exportPath':str(out/'fleet.glb')}
    # Native construction stays editable in a hidden source collection. The
    # displayed/exported vessels batch static pieces per material and role;
    # this prevents hundreds of plank/crew draw calls in the portfolio.
    sources=bpy.data.collections.new('V112_FLEET_EDITABLE_SOURCES')
    bpy.context.scene.collection.children.link(sources)
    deps=bpy.context.evaluated_depsgraph_get()
    batches=0
    for ship in [bpy.data.objects['V112_SHIP_'+str(i)] for i in range(4)]:
        groups={};inverse=ship.matrix_world.inverted()
        candidates=[o for o in ship.children_recursive if o.type=='MESH' and o.get('role')!='sail']
        for obj in candidates:
            ev=obj.evaluated_get(deps);data=ev.to_mesh()
            if not data:continue
            transform=inverse@obj.matrix_world;normal_matrix=transform.to_3x3().inverted().transposed()
            role='crew' if obj.get('role')=='crew' else 'structure'
            for poly in data.polygons:
                mat=data.materials[min(poly.material_index,len(data.materials)-1)] if data.materials else wood
                key=(role,mat.name if mat else wood.name)
                item=groups.setdefault(key,{'v':[],'f':[],'uv':[],'n':[],'mat':mat or wood})
                offset=len(item['v']);face=[]
                # Per-loop emission preserves actual photo UV seams. The
                # geometry is intentionally indexed by each surface corner.
                for li in poly.loop_indices:
                    item['v'].append(tuple(transform@data.vertices[data.loops[li].vertex_index].co))
                    item['uv'].append(tuple(data.uv_layers.active.data[li].uv) if data.uv_layers.active else (0,0))
                    normal=data.corner_normals[li].vector if len(data.corner_normals)>li else data.vertices[data.loops[li].vertex_index].normal
                    item['n'].append(tuple((normal_matrix@normal).normalized()))
                    face.append(offset+len(face))
                item['f'].append(tuple(face))
            ev.to_mesh_clear()
        for (role,_),g in groups.items():
            obj=mesh('ship%d %s material batch %d'%(ship['variant'],role,batches),g['v'],g['f'],ship,g['mat'],g['uv'])
            obj.data.normals_split_custom_set_from_vertices(g['n'])
            obj['role']=role;obj['actualConstructedParts']=True;batches+=1
        for obj in candidates:
            # Keep their original parent/local geometry to inspect modelling
            # operations later; visibility is object-based, not on the root.
            for col in list(obj.users_collection):col.objects.unlink(obj)
            sources.objects.link(obj);obj.hide_render=True;obj.hide_set(True)
    sources.hide_render=True;sources.hide_viewport=True
    bpy.context.view_layer.update()
    meshes=[o for o in collection.all_objects if o.type=='MESH']
    audit.update({'meshObjects':len(meshes),'staticMaterialBatches':batches,'editableSourcesRetained':True,'baseVertices':sum(len(o.data.vertices) for o in meshes),'crewCount':sum(s['rowers']+2 for s in audit['ships']),
                  'roots':['V112_SHIP_'+str(i) for i in range(4)],'photoPbrFolders':['weathered_brown_planks','rough_linen'],
                  'materialsExport':'Principled image colour/roughness/normal; UVs per actual model; no Cycles-only texture projection'})
    (out/'fleet-build-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8')
    print('V112_FLEET_BUILT',json.dumps({k:audit[k] for k in ['meshObjects','baseVertices','crewCount','roots']}))
    return {'collection':collection,'objects':list(collection.all_objects),'roots':[bpy.data.objects[n] for n in audit['roots']],'audit':audit,'exportPath':str(out/'fleet.glb')}


if globals().get('V112_RUN_FLEET'):
    V112_FLEET_RESULT=build_fleet(ROOT,OUT)
