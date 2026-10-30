import bpy,json
from pathlib import Path
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/ue-v147';bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(P/'assets/odyssey/refit-v146/vessel-unpruned.glb'));obs=[o for o in bpy.context.view_layer.objects if o.type=='MESH' and not o.name.startswith('Crew')];old=[o for o in obs if 'oar shaft' in o.name.lower()];assert len(old)==12,len(old);keep=[o for o in obs if o not in old];bpy.ops.object.select_all(action='DESELECT')
for o in keep:o.select_set(True)
bpy.context.view_layer.objects.active=keep[0];bpy.ops.export_scene.fbx(filepath=str(A/'Vessel-without-old-shafts-v148.fbx'),use_selection=True,object_types={'MESH'},bake_anim=False,axis_forward='-Y',axis_up='Z');(A/'v148-vessel-filter.json').write_text(json.dumps({'removedOldShafts':[o.name for o in old],'keptMeshes':len(keep),'bladesPreserved':True},indent=2));print('V148_VESSEL_READY',len(keep),flush=True)
