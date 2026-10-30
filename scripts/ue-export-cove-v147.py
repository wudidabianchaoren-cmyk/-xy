"""Export incumbent cove pieces with actual PBR texture/slot ledger for UE."""
import bpy,json,re,math
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/ue-v147';A.mkdir(parents=True,exist_ok=True);T=A/'textures';T.mkdir(exist_ok=True)
report={'parts':[],'materials':{}};images={}
def imagepath(im):
 if im.name in images:return images[im.name]
 known=P/'assets/odyssey/refit-v145/textures'/(im.name.split('.')[0]+'.png')
 if known.exists():images[im.name]=str(known);return str(known)
 name='T_'+re.sub('[^a-zA-Z0-9_]','_',im.name)[:90]+'.png';out=T/name
 if not out.exists():
  im.filepath_raw=str(out);im.file_format='PNG';im.save()
 images[im.name]=str(out);return str(out)
def trace(sock,visited=None):
 if not sock.is_linked:return None
 link=sock.links[0];node=link.from_node
 if node.type=='TEX_IMAGE' and node.image:return {'path':imagepath(node.image),'channel':link.from_socket.name}
 if node.type in ['SEPARATE_COLOR','SEPRGB']:
  r=trace(node.inputs[0]);
  if r:r['channel']=link.from_socket.name
  return r
 if node.type=='NORMAL_MAP':return trace(node.inputs['Color'])
 for i in node.inputs:
  if i.is_linked:
   r=trace(i)
   if r:return r
 return None
def mats(obs):
 for o in obs:
  for slot in o.material_slots:
   m=slot.material
   if not m or m.name in report['materials']:continue
   name=m.name;pr=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None) if m.node_tree else None
   d={'name':name,'color':list(m.diffuse_color),'roughness':.85,'metallic':0,'alpha':False,'maps':{}}
   if pr:
    d['color']=list(pr.inputs['Base Color'].default_value);d['roughness']=pr.inputs['Roughness'].default_value;d['metallic']=pr.inputs['Metallic'].default_value
    for s,k in [('Base Color','color'),('Normal','normal'),('Roughness','roughness'),('Metallic','metallic'),('Alpha','alpha')]:
     r=trace(pr.inputs[s]);
     if r:d['maps'][k]=r
    d['alpha']=pr.inputs['Alpha'].is_linked or pr.inputs['Alpha'].default_value<.99
   report['materials'][name]=d
def exp(name,obs):
 bpy.ops.object.select_all(action='DESELECT')
 for o in obs:o.hide_set(False);o.hide_render=False;o.select_set(True)
 bpy.context.view_layer.objects.active=obs[0];mats(obs)
 bpy.ops.export_scene.fbx(filepath=str(A/(name+'.fbx')),use_selection=True,object_types={'MESH'},bake_anim=False,axis_forward='-Y',axis_up='Z',path_mode='ABSOLUTE',use_mesh_modifiers=True)
 report['parts'].append({'name':name,'meshes':len(obs),'vertices':sum(len(o.data.vertices) for o in obs)})
 (A/'ledger.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
def glb(path):
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(P/path));bpy.context.view_layer.update();return [o for o in bpy.context.view_layer.objects if o.type=='MESH' and not o.name.startswith('Crew')]
obs=glb('assets/odyssey/compact-v134/island.glb');exp('Island',obs)
obs=glb('assets/odyssey/refit-v146/vessel-unpruned.glb');exp('Vessel',obs)
obs=glb('assets/odyssey/refit-v138/coastal-cottage.glb');exp('Cottage',obs)
obs=glb('assets/odyssey/compact-v134/grass.glb');exp('Grass',obs)
obs=glb('assets/odyssey/compact-v134/vegetation.glb')
for i,o in enumerate(obs):exp('Vegetation_%02d'%i,[o])
report['vegetationNames']=[o.name for o in obs]
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-146/rigged-fleet-v146.blend'));bpy.context.scene.frame_set(1);dg=bpy.context.evaluated_depsgraph_get();obs=[]
for o in list(bpy.context.scene.objects):
 if o.type=='MESH' and o.parent and o.parent.type=='ARMATURE':
  ev=o.evaluated_get(dg);me=bpy.data.meshes.new_from_object(ev);ob=bpy.data.objects.new('Posed_'+o.name,me);bpy.context.scene.collection.objects.link(ob);ob.matrix_world=o.matrix_world.copy();obs.append(ob)
exp('Crew',obs)
report['vegetationNames']=[x['name'] for x in report['parts'] if x['name'].startswith('Vegetation')]
(A/'ledger.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print('UE_COVE_EXPORT_READY',report['parts'],flush=True)
