"""Dense whole-canopy leaf proxies; run only in the existing Blender session.

No automatic execution, save, export or render. Call build_leaf_proxy_lods().
Native full leaf data/materials/instances are never changed. Every near leaf
survives, reduced from 24 triangles to a UV-fitted alpha-cutout quad (2tri).
"""
import bpy
import numpy as np
import random
from collections import defaultdict, Counter
from pathlib import Path
import time


def _proxy_material(texture_dir):
    mat = bpy.data.materials.new('V117_WEB / photographed leaf alpha proxy')
    mat.use_nodes = True
    mat.use_backface_culling = False
    if hasattr(mat, 'surface_render_method'):
        mat.surface_render_method = 'DITHERED'
    if hasattr(mat, 'blend_method'):
        mat.blend_method = 'CLIP'
    if hasattr(mat, 'alpha_threshold'):
        mat.alpha_threshold = .40
    mat['WEB_ALPHA_TEST'] = .40
    mat['WEB_TRANSPARENT'] = False
    mat['WEB_DOUBLE_SIDED'] = True
    n, links = mat.node_tree.nodes, mat.node_tree.links
    bs = next(n for n in n if n.type == 'BSDF_PRINCIPLED')
    bs.inputs['Roughness'].default_value = .84
    if 'Subsurface Weight' in bs.inputs:
        bs.inputs['Subsurface Weight'].default_value = .025
    color = n.new('ShaderNodeTexImage')
    # Real RGBA atlas ALREADY exists. The JPEG version has black rectangle
    # backgrounds; it must not be used as opaque quad diffuse.
    color.image = bpy.data.images.load(str(texture_dir/'island_tree_01_leaves_diff_1k.png'), check_existing=False)
    color.image.colorspace_settings.name = 'sRGB'
    links.new(color.outputs['Color'], bs.inputs['Base Color'])
    links.new(color.outputs['Alpha'], bs.inputs['Alpha'])
    normal = n.new('ShaderNodeTexImage')
    normal.image = bpy.data.images.load(str(texture_dir/'island_tree_01_leaves_nor_gl_1k.png'), check_existing=False)
    normal.image.colorspace_settings.name = 'Non-Color'
    normalmap = n.new('ShaderNodeNormalMap')
    normalmap.inputs['Strength'].default_value = .55
    links.new(normal.outputs['Color'], normalmap.inputs['Color'])
    links.new(normalmap.outputs['Normal'], bs.inputs['Normal'])
    rough = n.new('ShaderNodeTexImage')
    rough.image = bpy.data.images.load(str(texture_dir/'island_tree_01_leaves_rough_1k.png'), check_existing=False)
    rough.image.colorspace_settings.name = 'Non-Color'
    links.new(rough.outputs['Color'], bs.inputs['Roughness'])
    return mat


def build_leaf_proxy_lods(source=None, far_leaf_count=15000,
                          near_scale=1.0, far_scale=1.25, seed=117,
                          root=None):
    """Return ((nearObject, farObject), audit). Hidden prototype objects only.

    Expected measured source: 44,168 disconnected components *24 triangles;
    near=88,336 triangles, far=30,000. No percentage Decimate anywhere.
    Far budget can range 10,000..20,000 leaves (20..40k triangles).
    Source coords are local, as in V112 normalized native leaf prototype.
    """
    t0 = time.perf_counter()
    if not 10000 <= far_leaf_count <= 20000:
        raise ValueError('Far leaf count must be 10000..20000.')
    if source is None:
        candidates = [o for o in bpy.context.scene.objects
                      if o.type == 'MESH' and not o.name.startswith('V117_WEB')
                      and any(m and 'leaves' in m.name.lower() for m in o.data.materials)]
        if not candidates:
            raise RuntimeError('Pass original FULL native leaf source explicitly.')
        source = max(candidates, key=lambda o: len(o.data.polygons))
    mesh = source.data
    before = (len(mesh.vertices), len(mesh.polygons), len(mesh.loops))
    if not mesh.uv_layers.active:
        raise RuntimeError('Source has no UV atlas; do not generate opaque fake leaves.')
    leaf_materials = {i for i,m in enumerate(mesh.materials) if m and 'leaves' in m.name.lower()}
    co = np.empty(len(mesh.vertices)*3, dtype=np.float32)
    mesh.vertices.foreach_get('co', co)
    co = co.reshape((-1,3))
    vi = np.empty(len(mesh.loops), dtype=np.int32)
    mesh.loops.foreach_get('vertex_index', vi)
    uv = np.empty(len(mesh.loops)*2, dtype=np.float32)
    mesh.uv_layers.active.data.foreach_get('uv', uv)
    uv = uv.reshape((-1,2))
    parent = list(range(len(mesh.vertices)))
    ranks = bytearray(len(parent))

    def find(v):
        while parent[v] != v:
            parent[v] = parent[parent[v]]
            v = parent[v]
        return v

    def join(a,b):
        a,b = find(a),find(b)
        if a == b:
            return
        if ranks[a] < ranks[b]:
            a,b = b,a
        parent[b] = a
        if ranks[a] == ranks[b]:
            ranks[a] += 1

    polys = [p for p in mesh.polygons if p.material_index in leaf_materials]
    for p in polys:
        first = int(vi[p.loop_start])
        for i in range(p.loop_start+1,p.loop_start+p.loop_total):
            join(first,int(vi[i]))
    groups = defaultdict(list)
    firstpoly = {}
    histogram = Counter()
    for p in polys:
        key = find(int(vi[p.loop_start]))
        groups[key].extend(range(p.loop_start,p.loop_start+p.loop_total))
        firstpoly.setdefault(key,p.index)
        histogram[key] += p.loop_total-2
    records = []
    rejected = Counter()
    residuals = []
    for key, looplist in groups.items():
        if histogram[key] > 256:
            rejected['large_welded_component'] += 1
            continue
        idx = np.asarray(looplist, dtype=np.int32)
        tex, xyz = uv[idx].astype(np.float64), co[vi[idx]].astype(np.float64)
        uvlo,uvhi = tex.min(axis=0),tex.max(axis=0)
        if np.min(uvhi-uvlo) < 1e-7:
            rejected['degenerate_uv'] += 1
            continue
        # All original corners constrain one UV->3D affine patch. Unlike global
        # Decimate this cannot connect one leaf to a neighboring leaf.
        A = np.column_stack((tex,np.ones(len(tex))))
        coeff,_,rank,_ = np.linalg.lstsq(A,xyz,rcond=None)
        if rank < 3:
            rejected['singular_uv'] += 1
            continue
        u0,v0 = uvlo
        u1,v1 = uvhi
        corners_uv = np.array([[u0,v0],[u1,v0],[u1,v1],[u0,v1]],dtype=np.float64)
        corners = np.column_stack((corners_uv,np.ones(4))) @ coeff
        normal = np.cross(coeff[0],coeff[1])
        length = np.linalg.norm(normal)
        if length < 1e-12:
            rejected['zero_area_fit'] += 1
            continue
        normal /= length
        original_normal = np.array(mesh.polygons[firstpoly[key]].normal)
        if float(normal @ original_normal) < 0:
            corners,corners_uv = corners[[0,3,2,1]],corners_uv[[0,3,2,1]]
            normal *= -1
        extent = np.linalg.norm(np.ptp(xyz,axis=0))
        residual = np.sqrt(np.mean(np.sum((A@coeff-xyz)**2,axis=1))) / max(extent,1e-9)
        residuals.append(float(residual))
        records.append({'key':key,'center':corners.mean(axis=0),'corners':corners,
                        'uv':corners_uv,'normal':normal})
    if len(records) < far_leaf_count:
        raise RuntimeError('Insufficient source leaves; source must be native FULL canopy.')
    lo = np.min([r['center'] for r in records],axis=0)
    span = np.maximum(np.ptp([r['center'] for r in records],axis=0),1e-8)
    buckets = defaultdict(list)
    rng = random.Random(seed)
    for r in records:
        cell = tuple(np.minimum(7,((r['center']-lo)/span*8).astype(int)))
        r['random'] = rng.random()
        buckets[cell].append(r)
    for bucket in buckets.values():
        bucket.sort(key=lambda r:r['random'])
    cells = sorted(buckets)
    rng.shuffle(cells)
    far_records = []
    roundidx = 0
    while len(far_records) < far_leaf_count:
        added = False
        for cell in cells:
            if roundidx < len(buckets[cell]) and len(far_records) < far_leaf_count:
                far_records.append(buckets[cell][roundidx])
                added = True
        if not added:
            break
        roundidx += 1
    root = Path(root) if root else Path(__file__).resolve().parent.parent
    material = _proxy_material(root/'assets/odyssey/vegetation-v104/island_tree_01/textures')
    coll = bpy.data.collections.get('V117_WEB_PROTOTYPES / export only')
    if coll is None:
        coll = bpy.data.collections.new('V117_WEB_PROTOTYPES / export only')
        bpy.context.scene.collection.children.link(coll)

    def make(rows,name,scale):
        vertices,faces,tex,normals = [],[],[],[]
        for r in rows:
            base = len(vertices)
            vertices.extend((r['center']+(r['corners']-r['center'])*scale).tolist())
            faces.append((base,base+1,base+2,base+3))
            tex.extend(r['uv'].reshape(-1).tolist())
            normals.extend([tuple(r['normal'])]*4)
        data = bpy.data.meshes.new(name+' mesh')
        data.from_pydata(vertices,[],faces)
        data.update()
        data.materials.append(material)
        layer = data.uv_layers.new(name=mesh.uv_layers.active.name)
        layer.data.foreach_set('uv',np.asarray(tex,dtype=np.float32))
        data.normals_split_custom_set(normals)
        data.update()
        obj = bpy.data.objects.new(name,data)
        coll.objects.link(obj)
        obj.hide_render = True
        obj.hide_set(True)
        obj['leaf_count'] = len(rows)
        obj['triangle_count'] = len(rows)*2
        obj['WEB_ALPHA_TEST'] = .40
        obj['native_mesh_untouched'] = True
        return obj

    near = make(records,'V117_WEB_LEAF_PROXY_NEAR',near_scale)
    far = make(far_records,'V117_WEB_LEAF_PROXY_FAR',far_scale)
    assert before == (len(mesh.vertices),len(mesh.polygons),len(mesh.loops))
    audit = {'sourceObject':source.name,'sourceMesh':mesh.name,
             'sourceTriangles':sum(histogram.values()),'sourceComponents':len(groups),
             'componentHistogram':dict(Counter(histogram.values())),
             'rejectedComponents':dict(rejected),'nearLeaves':len(records),
             'nearTriangles':len(records)*2,'farLeaves':len(far_records),
             'farTriangles':len(far_records)*2,'nearScale':near_scale,'farScale':far_scale,
             'nearFullCanopyCoverage':len(records)==len(groups),
             'sourceNativeUnchanged':True,'usedDecimate':False,
             'photographicRgbaAtlas':'island_tree_01_leaves_diff_1k.png',
             'alphaThresholdRecommended':.40,
             'webIntegrationMustUseAlphaTestAndDoubleSide':True,
             'fitRelativeRmsMedian':float(np.median(residuals)),
             'fitRelativeRms95':float(np.quantile(residuals,.95)),
             'tradeoff':'Preserves leaf count/UV/orientation, flattens per-leaf curvature. '
                        'Far spatial subset uses mild leaf enlargement. '
                        'Web loader must alphaTest=.40, transparent=false, DoubleSide.',
             'seconds':round(time.perf_counter()-t0,3)}
    return (near,far),audit
