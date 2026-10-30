import {pathToFileURL} from 'node:url';
import {readFile,writeFile} from 'node:fs/promises';
const sdk='E:/Brain-Universe-assets/V32-72/video-tools/node_modules/@modelcontextprotocol/sdk/dist/esm/client/';
const {Client}=await import(pathToFileURL(sdk+'index.js'));
const {StdioClientTransport}=await import(pathToFileURL(sdk+'stdio.js'));
const client=new Client({name:'brain-universe-native-production',version:'32.76'});
const transport=new StdioClientTransport({command:'C:/Users/HP/.local/bin/uvx.exe',args:['mcp-for-blender','--host','127.0.0.1','--port','9877'],env:{...process.env,UV_CACHE_DIR:'E:/Brain-Universe-assets/V32-73/uv-cache',BLENDER_MCP_DISABLE_TELEMETRY:'1'},stderr:'pipe'});
let stderr='';transport.stderr?.on('data',d=>stderr+=d);
try{
 await client.connect(transport);
 const listed=await client.listTools();console.log('Blender MCP tools: '+listed.tools.map(t=>t.name).join(', '));
 const source=process.argv[2];
 const code=source?await readFile(source,'utf8'):'';
 const wrapped='import bpy\nwith bpy.context.temp_override(window=bpy.context.window_manager.windows[0]):\n exec('+JSON.stringify(code)+')';
 const r=await client.callTool(source?{name:'execute_blender_code',arguments:{code:wrapped}}:{name:'get_scene_info',arguments:{}},undefined,{timeout:900000});
 await writeFile('.verify/v32-76/mcp-'+(process.argv[3]??(source?'production':'connection'))+'.json',JSON.stringify({toolNames:listed.tools.map(t=>t.name),actualMcpCall:true,result:r},null,2));
 console.log(JSON.stringify(r).slice(-2000));if(r.isError||r.content?.some(c=>c.type==='text'&&/^Error /i.test(c.text)))throw Error('Blender MCP tool reported an error');
}finally{await client.close();}
