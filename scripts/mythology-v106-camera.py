import bpy
from mathutils import Vector
scene=bpy.context.scene;cam=scene.camera;cam.location=(-35,-190,155);cam.rotation_euler=(Vector((-65,142,13))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=36;cam.data.sensor_width=36;cam.data.sensor_fit='HORIZONTAL';scene.render.resolution_x=1600;scene.render.resolution_y=900
for screen in bpy.data.screens:
 for area in screen.areas:
  if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA';area.spaces.active.shading.type='MATERIAL'
print('Complete revised island camera, flat cove and 52.7-metre back ridge')
