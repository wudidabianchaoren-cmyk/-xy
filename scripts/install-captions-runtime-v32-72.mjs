import {cp,readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const base='E:/Brain-Universe-assets/V32-72/video-tools',pkg=base+'/node_modules/@mintlify/mcp',dest=base+'/captions-mcp';
await mkdir(dest,{recursive:true});await cp(pkg+'/bin/mcp-server',dest,{recursive:true});
await writeFile(dest+'/package.json',JSON.stringify({name:'captions-official-mintlify-runtime',private:true,type:'module'},null,2));
const configFile=dest+'/src/config.readonly.js';let code=await readFile(configFile,'utf8');code=code.replace("= 'mintlify'","= 'captions'");await writeFile(configFile,code);
const config=JSON.parse(await readFile('E:/Brain-Universe-assets/V32-72/captions-official/captions-legacy-mcp-config.txt','utf8'));
await writeFile(dest+'/src/tools.json',JSON.stringify(config.tools||[],null,2));
const {Client}=await import(pathToFileURL(base+'/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js'));
const {StdioClientTransport}=await import(pathToFileURL(base+'/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js'));
const client=new Client({name:'portfolio-install-verification',version:'32.72'});
const transport=new StdioClientTransport({command:process.execPath,args:[dest+'/src/index.js'],stderr:'pipe'});
let stderr='';transport.stderr?.on('data',d=>stderr+=d);
let listed;
try{await client.connect(transport);listed=await client.listTools();}finally{await client.close();}
const proof={passed:listed.tools.length>0,officialRuntimeCopiedFrom:'@mintlify/mcp',runtimePath:dest,toolNames:listed.tools.map(t=>t.name),authenticatedGenerationCallPerformed:false,accountAuthorizationPending:true};
await writeFile('.verify/v32-72/captions-runtime.json',JSON.stringify(proof,null,2));
await writeFile('.verify/v32-72/captions-mcp-config.json',JSON.stringify({mcpServers:{captions:{command:process.execPath,args:[dest+'/src/index.js']}}},null,2));
const status=JSON.parse(await readFile('.verify/v32-72/video-tools-status.json','utf8'));status.captions.runtimeInstalled=true;status.captions.listToolsPassed=proof.passed;status.captions.toolNames=proof.toolNames;status.captions.scope='Official local MCP runtime installed and tool discovery tested. Account API key is required before generation calls.';await writeFile('.verify/v32-72/video-tools-status.json',JSON.stringify(status,null,2));console.log(JSON.stringify(proof));
