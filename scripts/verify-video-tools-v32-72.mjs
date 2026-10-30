import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const root='E:/Brain-Universe-assets/V32-72/video-tools',modules=root+'/node_modules';
const result={date:new Date().toISOString(),oldAccountAuthorizationRestored:false,tools:[]};
for(const [name,pkg] of [['HyperFrames','hyperframes'],['Remotion','remotion'],['ElevenLabs CLI','@elevenlabs/cli'],['ElevenLabs SDK','@elevenlabs/elevenlabs-js'],['Captions documented MCP installer','@mintlify/mcp']]){
 const data=JSON.parse(await readFile(modules+'/'+pkg+'/package.json','utf8'));
 result.tools.push({name,package:pkg,version:data.version,installed:true,path:modules+'/'+pkg});
}
const run=async(file,args)=>new Promise(resolve=>{let output='';const p=spawn(process.execPath,[file,...args],{windowsHide:true,stdio:['ignore','pipe','pipe']});p.stdout.on('data',x=>output+=x);p.stderr.on('data',x=>output+=x);p.on('exit',code=>resolve({code,output:output.slice(0,12000)}));});
for(const pkg of ['hyperframes','@elevenlabs/cli']){
 const meta=JSON.parse(await readFile(modules+'/'+pkg+'/package.json','utf8'));const bin=typeof meta.bin==='string'?meta.bin:Object.values(meta.bin)[0];
 const response=await run(modules+'/'+pkg+'/'+bin,['--help']);
 result.tools.find(x=>x.package===pkg).cliHelpPassed=response.code===0;
 await writeFile('.verify/v32-72/'+pkg.split('/').at(-1)+'-help.txt',response.output);
}
const requests=[['captions-official-doc-index','https://captions.ai/help/llms.txt'],['captions-legacy-mcp-config','https://leaves.mintlify.com/api/mcp/config/captions'],['captions-remote-mcp','https://captions.mintlify.app/mcp']];
result.captionsEndpoints=[];
await mkdir('E:/Brain-Universe-assets/V32-72/captions-official',{recursive:true});
for(const [name,url]of requests){try{const response=await fetch(url,{signal:AbortSignal.timeout(20000)});const data=await response.text();result.captionsEndpoints.push({url,status:response.status,bytes:data.length});await writeFile('E:/Brain-Universe-assets/V32-72/captions-official/'+name+'.txt',data);}catch(e){result.captionsEndpoints.push({url,error:e.message});}}
result.elevenlabs={installed:true,environmentKeyAvailable:!!process.env.ELEVENLABS_API_KEY,authenticatedServiceCallPerformed:false};
result.captions={officialInstallerDownloaded:true,authenticatedServiceCallPerformed:false,environmentKeyAvailable:!!process.env.CAPTIONS_API_KEY,web:'https://captions.ai/signup',scope:'Downloaded official documented MCP installer; account and legacy server availability must be verified separately. Not a Windows offline video editor.'};
result.passed=result.tools.every(x=>x.installed)&&result.tools.filter(x=>x.cliHelpPassed!==undefined).every(x=>x.cliHelpPassed);
await writeFile('.verify/v32-72/video-tools-status.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
