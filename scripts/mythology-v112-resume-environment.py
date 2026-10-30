import bpy,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-112';scene=bpy.context.scene
forest=bpy.data.collections['V112_FOREST / clustered canopy and shrub succession']
groups={}
for o in forest.objects:
 if o.name.startswith('V112 tree'):
  i=o.name.split()[2]
  if i not in groups:groups[i]={'x':o.location.x,'y':o.location.z,'z':-o.location.y,'blenderY':o.location.y,'height':o.scale.z,'rotation':o.rotation_euler.z,'width':o.scale.x/o.scale.z}
plant=list(groups.values());shrubs=len({o.name.split()[2] for o in forest.objects if o.name.startswith('V112 shrub')});protos=list({o.data.name:o.data for o in forest.objects if o.type=='MESH' and o.name.startswith('V112 tree')}.values());grasscount=len(bpy.data.objects['V112_GROUNDCOVER / connected woodland and coastal plants'].data.vertices)//8
rockprotos=list({o.data.name:o.data for o in bpy.data.collections['V112_ROCKS / scanned cliff assemblies'].objects if o.type=='MESH'}.values())
source=(ROOT/'scripts/mythology-v112-environment.py').read_text(encoding='utf8');exec(source[source.index('# Unified lighting.'):])
