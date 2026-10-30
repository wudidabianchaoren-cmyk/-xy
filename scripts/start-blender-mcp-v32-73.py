import bpy,sys
from pathlib import Path
sys.path.insert(0,str(Path.home()/'AppData/Roaming/Blender Foundation/Blender/5.1/scripts/addons'))
import blender_mcp
blender_mcp.register()
bpy.context.scene.blendermcp_auto_start_server=False
bpy.context.scene.blendermcp_port=9877
server=blender_mcp.BlenderMCPServer(host='127.0.0.1',port=9877)
server.start()
bpy.types.blender_mcp_server=server
print('PORTFOLIO_MCP_READY 9877',flush=True)
