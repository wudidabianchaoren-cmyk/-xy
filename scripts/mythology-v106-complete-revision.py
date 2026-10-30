import bpy,bmesh,math,json,random
from pathlib import Path
from mathutils import Vector,noise
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106';scene=bpy.context.scene
island=bpy.data.objects.get('V106_ISLAND / new shore, cove and broad interior');giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt')
def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)
def support(x,y):return bvh.ray_cast(Vector((x,y,120)),Vector((0,0,-1)),160)
source=(ROOT/'scripts/mythology-v106-landform-revision.py').read_text(encoding='utf8');marker='bvh=BVHTree.FromPolygons([v.co.copy() for v in island.data.vertices],[list(p.vertices) for p in island.data.polygons]);by_id={}'
exec(source[source.index(marker):])
