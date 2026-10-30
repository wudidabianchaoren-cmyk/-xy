import bpy,json
# This is the owned MCP instance on 9877. Keep the saved native file intact.
count=0
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type=='VIEW_3D':
            area.type='CONSOLE'
            count+=1
print(json.dumps({'ownedMcpPort':9877,'pausedViewportAreas':count,'savedBlendUnchanged':True,'reason':'Release viewport GPU load without per-object dependency updates'}))
