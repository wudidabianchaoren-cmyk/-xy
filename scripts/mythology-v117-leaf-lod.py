"""Whole-leaf web LOD. Run only inside the already-owned Blender session.

Creates a HIDDEN, unplaced WEB prototype; does not replace native objects,
save a .blend, export, render, open a file, or start another Blender process.
Root integration should instance result.data, retaining original transforms.
Default source can be overridden with V117_LEAF_SOURCE = bpy.data.objects[...].
Standalone builds near 38,400 and far 12,000 triangle prototypes. Defaults
can be overridden with V117_LEAF_BUDGET / V117_LEAF_FAR_BUDGET. Uniform
per-leaf enlargement compensates some coverage loss, never changes native.
"""
import bpy
import json
import math
import random
import time
from array import array
from collections import Counter, defaultdict
from pathlib import Path


def build_web_leaf_lod(source=None, target_triangles=38400, seed=117,
                       name='V117_WEB_LEAF_PROTO', leaf_scale=1.0):
    started = time.perf_counter()
    if source is None:
        candidates = [o for o in bpy.context.scene.objects
                      if o.type == 'MESH' and not o.name.startswith('V117_WEB')
                      and any(m and 'leaves' in m.name.lower()
                              for m in o.data.materials)]
        if not candidates:
            raise RuntimeError('No native leaf mesh found; pass source explicitly.')
        source = max(candidates, key=lambda o: len(o.data.polygons))
    if source.type != 'MESH':
        raise TypeError('source must be a Blender MESH object.')
    mesh = source.data
    source_counts = (len(mesh.vertices), len(mesh.polygons), len(mesh.loops))
    if not 6000 <= target_triangles <= 60000:
        raise ValueError('Web leaf budget must stay within 6000..60000 triangles.')
    if not 0.5 <= leaf_scale <= 2.5:
        raise ValueError('Uniform leaf scale outside bounded LOD range.')
    leaf_materials = {i for i, m in enumerate(mesh.materials)
                      if m and 'leaves' in m.name.lower()}
    if not leaf_materials:
        raise RuntimeError('No confirmed leaf material on selected source.')

    # No spatial welding: touching and overlapping leaves remain separate.
    # Union only vertices that already belong to one polygon.
    parent = array('i', range(len(mesh.vertices)))
    rank = bytearray(len(mesh.vertices))
    loops = array('i', [0]) * len(mesh.loops)
    mesh.loops.foreach_get('vertex_index', loops)

    def find(v):
        while parent[v] != v:
            parent[v] = parent[parent[v]]
            v = parent[v]
        return v

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return
        if rank[ra] < rank[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        if rank[ra] == rank[rb]:
            rank[ra] += 1

    leaf_polys = []
    for poly in mesh.polygons:
        if poly.material_index not in leaf_materials:
            continue
        if poly.loop_total < 3:
            continue
        leaf_polys.append(poly.index)
        start = poly.loop_start
        first = loops[start]
        for j in range(start + 1, start + poly.loop_total):
            union(first, loops[j])

    records = {}
    for pi in leaf_polys:
        poly = mesh.polygons[pi]
        root = find(loops[poly.loop_start])
        rec = records.get(root)
        if rec is None:
            rec = {'root': root, 'polys': [], 'triangles': 0,
                   'lo': [math.inf]*3, 'hi': [-math.inf]*3, 'vertices': 0}
            records[root] = rec
        rec['polys'].append(pi)
        rec['triangles'] += poly.loop_total - 2
    positions = array('f', [0]) * (3 * len(mesh.vertices))
    mesh.vertices.foreach_get('co', positions)
    for vi in range(len(mesh.vertices)):
        root = find(vi)
        rec = records.get(root)
        if rec is None:
            continue
        rec['vertices'] += 1
        for k in range(3):
            v = positions[vi*3+k]
            rec['lo'][k] = min(rec['lo'][k], v)
            rec['hi'][k] = max(rec['hi'][k], v)
    if not records:
        raise RuntimeError('No polygon-connected leaf components found.')
    lo = [min(r['lo'][k] for r in records.values()) for k in range(3)]
    hi = [max(r['hi'][k] for r in records.values()) for k in range(3)]
    span = [max(hi[k]-lo[k], 1e-8) for k in range(3)]
    min_diag = max(span)*1e-5
    eligible = []
    rejected = Counter()
    for rec in records.values():
        diag = math.sqrt(sum((rec['hi'][k]-rec['lo'][k])**2 for k in range(3)))
        if diag <= min_diag:
            rejected['degenerate'] += 1
        elif rec['triangles'] > 256 or rec['vertices'] > 256:
            # Never silently treat a welded entire canopy as an individual leaf.
            rejected['large_welded_component'] += 1
        else:
            rec['center'] = [(rec['lo'][k]+rec['hi'][k])*0.5 for k in range(3)]
            eligible.append(rec)
    source_leaf_triangles = sum(r['triangles'] for r in records.values())
    if sum(r['triangles'] for r in eligible) < target_triangles:
        raise RuntimeError('Too few whole-leaf components for budget. '
                           'Check source topology; no Decimate fallback permitted.')

    # Equal spatial strata keep outer silhouette/top/base populated, unlike a
    # global random reduction dominated by the dense middle of the canopy.
    rng = random.Random(seed)
    buckets = defaultdict(list)
    for rec in sorted(eligible, key=lambda r: r['root']):
        cell = tuple(min(5, max(0, int((rec['center'][k]-lo[k])/span[k]*6)))
                     for k in range(3))
        rec['random'] = rng.random()
        buckets[cell].append(rec)
    for bucket in buckets.values():
        bucket.sort(key=lambda r: r['random'])
    cells = sorted(buckets)
    rng.shuffle(cells)
    selected = []
    tri = 0
    round_index = 0
    while True:
        added = False
        for cell in cells:
            bucket = buckets[cell]
            if round_index >= len(bucket):
                continue
            rec = bucket[round_index]
            if tri + rec['triangles'] <= target_triangles:
                selected.append(rec)
                tri += rec['triangles']
                added = True
        round_index += 1
        if not added or tri >= target_triangles:
            break
    if tri < target_triangles * 0.90:
        raise RuntimeError('Spatial sampling unexpectedly missed triangle budget.')

    selected_polys = sorted(pi for rec in selected for pi in rec['polys'])
    vertex_to_new = {}
    vertices, faces, source_loop_indices = [], [], []
    centers = {r['root']: r['center'] for r in selected}
    for pi in selected_polys:
        poly = mesh.polygons[pi]
        face = []
        for li in range(poly.loop_start, poly.loop_start+poly.loop_total):
            vi = loops[li]
            if vi not in vertex_to_new:
                vertex_to_new[vi] = len(vertices)
                co = [positions[vi*3+k] for k in range(3)]
                if leaf_scale != 1.0:
                    center = centers[find(vi)]
                    co = [center[k]+(co[k]-center[k])*leaf_scale for k in range(3)]
                vertices.append(co)
            face.append(vertex_to_new[vi])
            source_loop_indices.append(li)
        faces.append(face)

    output = bpy.data.meshes.new(name+' mesh')
    output.from_pydata(vertices, [], faces)
    output.update()
    for material in mesh.materials:
        output.materials.append(material)
    for dst, pi in zip(output.polygons, selected_polys):
        old = mesh.polygons[pi]
        dst.material_index = old.material_index
        dst.use_smooth = old.use_smooth

    # UVs must follow ORIGINAL corner order, not averaged vertex UVs. This
    # preserves atlas boundaries and the leaf silhouette/normal texture.
    for old_uv in mesh.uv_layers:
        new_uv = output.uv_layers.new(name=old_uv.name)
        src_uv = array('f', [0]) * (2*len(mesh.loops))
        old_uv.data.foreach_get('uv', src_uv)
        dst_uv = array('f')
        for li in source_loop_indices:
            dst_uv.extend((src_uv[li*2], src_uv[li*2+1]))
        new_uv.data.foreach_set('uv', dst_uv)
    if mesh.uv_layers.active:
        output.uv_layers.active_index = mesh.uv_layers.active_index
    try:
        source_normals = mesh.corner_normals
        output.normals_split_custom_set(
            [tuple(source_normals[li].vector) for li in source_loop_indices])
        copied_normals = True
    except (AttributeError, RuntimeError, TypeError):
        copied_normals = False
    output.update()

    collection = bpy.data.collections.get('V117_WEB_PROTOTYPES / export only')
    if collection is None:
        collection = bpy.data.collections.new('V117_WEB_PROTOTYPES / export only')
        bpy.context.scene.collection.children.link(collection)
    obj = bpy.data.objects.new(name, output)
    collection.objects.link(obj)
    obj.matrix_world.identity()
    obj.hide_render = True
    obj.hide_set(True)
    obj['purpose'] = 'Whole-leaf WEB prototype only; native full canopy untouched'
    obj['source_mesh'] = mesh.name
    obj['leaf_scale'] = leaf_scale
    obj['triangles'] = tri
    obj['complete_leaf_components'] = len(selected)
    obj['algorithm'] = 'Existing-index components, seeded 6x6x6 spatial strata, no Decimate'
    assert source_counts == (len(mesh.vertices), len(mesh.polygons), len(mesh.loops))
    report = {
        'sourceObject': source.name, 'sourceMesh': mesh.name,
        'sourceCountsUnchanged': True,
        'sourceLeafTriangles': source_leaf_triangles,
        'sourceLeafComponents': len(records),
        'componentTriangleHistogram': dict(Counter(r['triangles'] for r in records.values())),
        'eligibleComponents': len(eligible), 'rejected': dict(rejected),
        'webObject': obj.name, 'webMesh': output.name,
        'webTriangles': tri, 'webVertices': len(vertices),
        'webLeafComponents': len(selected), 'spatialCells': len(cells),
        'seed': seed, 'leafScale': leaf_scale,
        'uvLayersPreserved': [u.name for u in output.uv_layers],
        'customCornerNormalsCopied': copied_normals,
        'materialSlotsPreserved': len(output.materials) == len(mesh.materials),
        'sourceLocalCoordinatesPreserved': leaf_scale == 1.0,
        'leafCentersAndOriginalUvPreserved': True,
        'coverageCompensation': 'Uniform component-centered leaf scaling only; '
            'may look broader near-camera. Sparse LOD cannot equal full native canopy.',
        'nativeInstancesReplaced': False, 'decimateUsed': False,
        'automaticRenderOrSave': False,
        'seconds': round(time.perf_counter()-started, 3),
    }
    return obj, report


def build_web_leaf_lods(source=None, near_triangles=38400, far_triangles=12000,
                        near_leaf_scale=1.4, far_leaf_scale=1.6, seed=117):
    """Near and far same seed/spatial order; far selects a subset of near.

    Source topology is reused between calls through Blender's mesh, not edited.
    Separate union scans avoid retaining a second million-vertex permanent
    Python cache after this bounded preparation task. No running LOD logic is
    installed: root chooses distances, counts and material/export handling.
    """
    near, near_report = build_web_leaf_lod(
        source=source, target_triangles=near_triangles, seed=seed,
        name='V117_WEB_LEAF_PROTO', leaf_scale=near_leaf_scale)
    if source is None:
        source = bpy.data.objects[near_report['sourceObject']]
    far, far_report = build_web_leaf_lod(
        source=source, target_triangles=far_triangles, seed=seed,
        name='V117_WEB_LEAF_PROTO_FAR', leaf_scale=far_leaf_scale)
    return (near, far), {'near': near_report, 'far': far_report,
                        'sourceNativePreserved': True,
                        'distanceSelectionInstalled': False,
                        'densityAndCoverageTradeoffExplicit': True}


if __name__ == '__main__':
    objects, report = build_web_leaf_lods(
        source=globals().get('V117_LEAF_SOURCE'),
        near_triangles=globals().get('V117_LEAF_BUDGET', 38400),
        far_triangles=globals().get('V117_LEAF_FAR_BUDGET', 12000),
        near_leaf_scale=globals().get('V117_LEAF_SCALE', 1.4),
        far_leaf_scale=globals().get('V117_LEAF_FAR_SCALE', 1.6))
    root = Path(__file__).resolve().parent.parent if '__file__' in globals() else Path(bpy.data.filepath).parent.parent.parent
    out = root/'.verify/v32-117/leaf-lod-audit.json'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf8')
    print('V117_WHOLE_LEAF_LOD', json.dumps(report))
