import bpy,bmesh,math,json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/crew-v162';bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(P/'assets/odyssey/refit-v146/vessel-unpruned.glb'))
for o in list(bpy.context.scene.objects):
 if o.type=='MESH'and('oar shaft'in o.name.lower()or'crew'in o.name.lower()):bpy.data.objects.remove(o,do_unlink=True)
objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];targets=[o for o in objects if any(k in o.name.lower()for k in['hull strake','gunwale','hull lining'])];deps=bpy.context.evaluated_depsgraph_get();bvh=[]
for o in targets:
 try:bvh.append((o,BVHTree.FromObject(o,deps)))
 except:pass
cuts=bpy.data.collections.new('V162 actual twelve oarport cutters');bpy.context.scene.collection.children.link(cuts);hits=[]
for record in json.loads((P/'assets/odyssey/refit-v146/crew-grip-v148.json').read_text())['grips']:
 a=Vector(record['newInner']);b=Vector(record['seaEnd']);direction=(b-a).normalized();best=None
 for ob,tree in bvh:
  inv=ob.matrix_world.inverted();origin=inv@a;localdir=(inv.to_3x3()@direction).normalized();hit,normal,index,distance=tree.ray_cast(origin,localdir,(b-a).length)
  if hit is None:continue
  world=ob.matrix_world@hit;dist=(world-a).length
  if .05<dist<4 and(best is None or dist<best[0]):best=(dist,world,ob)
 if best is None:continue
 centre=best[1];bpy.ops.mesh.primitive_cylinder_add(vertices=32,radius=.105,depth=.85,location=centre);c=bpy.context.object;c.name='V162 circular oarport cutter';c.rotation_euler=direction.to_track_quat('Z','Y').to_euler()
 for collection in list(c.users_collection):collection.objects.unlink(c)
 cuts.objects.link(c);hits.append({'actor':record['actor'],'centre':list(centre),'axis':list(direction),'hull':best[2].name})
affected=0
for ob,tree in bvh:
 box=[ob.matrix_world@Vector(v)for v in ob.bound_box];lo=Vector(tuple(min(p[i]for p in box)for i in range(3)));hi=Vector(tuple(max(p[i]for p in box)for i in range(3)))
 if not any(all(lo[i]-.5<h['centre'][i]<hi[i]+.5 for i in range(3))for h in hits):continue
 bpy.context.view_layer.objects.active=ob
 # The source lining includes single-sided open strips. A Boolean on those
 # strips can remove an entire triangular region instead of just the port.
 bm=bmesh.new();bm.from_mesh(ob.data);closed=all(e.is_manifold for e in bm.edges);bm.free()
 if not closed:
  solid=ob.modifiers.new('Real thickness before port cutting','SOLIDIFY');solid.thickness=.025;solid.offset=0.;solid.use_quality_normals=True;bpy.ops.object.modifier_apply(modifier=solid.name)
 mod=ob.modifiers.new('V162 real oarport openings','BOOLEAN');mod.operation='DIFFERENCE';mod.operand_type='COLLECTION';mod.collection=cuts;mod.solver='EXACT';mod.use_self=True
 try:bpy.ops.object.modifier_apply(modifier=mod.name);affected+=1
 except Exception:ob.modifiers.remove(mod)
for o in list(cuts.objects):bpy.data.objects.remove(o,do_unlink=True)
metal=bpy.data.materials.new('V162 worn bronze oarport collars');metal.use_nodes=True;pr=next((n for n in metal.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
if pr is None:pr=metal.node_tree.nodes.new('ShaderNodeBsdfPrincipled');out=metal.node_tree.nodes.new('ShaderNodeOutputMaterial');metal.node_tree.links.new(pr.outputs[0],out.inputs[0])
pr.inputs['Base Color'].default_value=(.16,.105,.047,1);pr.inputs['Metallic'].default_value=.8;pr.inputs['Roughness'].default_value=.7
for h in hits:
 bpy.ops.mesh.primitive_torus_add(major_radius=.099,minor_radius=.008,major_segments=32,minor_segments=8,location=h['centre']);ring=bpy.context.object;ring.name='V162 actual oarport bronze collar '+str(h['actor']);ring.rotation_euler=Vector(h['axis']).to_track_quat('Z','Y').to_euler();ring.data.materials.append(metal)
bpy.ops.object.select_all(action='DESELECT');mesh=[o for o in bpy.context.view_layer.objects if o.type=='MESH']
print('ACTUAL_PORTS',len(hits),'AFFECTED_HULL',affected,flush=True)
for o in mesh:o.hide_set(False);o.select_set(True)
bpy.context.view_layer.objects.active=mesh[0];bpy.ops.wm.save_as_mainfile(filepath=str(P/'blender/mythology-v32-162/vessel-oarports.blend'));bpy.ops.export_scene.gltf(filepath=str(A/'vessel-oarports.glb'),export_format='GLB',use_selection=True,export_animations=False,export_yup=True)
bpy.ops.object.join();bpy.context.object.name='V162 original vessel with actual oarports';bpy.ops.export_scene.gltf(filepath=str(A/'vessel-oarports-ue.glb'),export_format='GLB',use_selection=True,export_animations=False,export_yup=True)
(A/'oarports.json').write_text(json.dumps({'openings':len(hits),'modifiedHullParts':affected,'ports':hits,'radius':.105,'realBooleanCut':True},indent=2));print('V162_OARPORTS_READY',len(hits),affected,flush=True)
