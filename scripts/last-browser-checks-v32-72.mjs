import {spawn} from 'node:child_process';
for(const file of ['.verify/verify-v32-72-layout.mjs','.verify/verify-odyssey-v32-72.mjs','.verify/protected-v32-72.mjs']){
 console.log('Checking '+file);
 const task=spawn(process.execPath,[file],{windowsHide:true,stdio:['ignore','pipe','pipe']});let output='';task.stdout.on('data',x=>output+=x);task.stderr.on('data',x=>output+=x);
 const code=await new Promise(resolve=>task.on('exit',resolve));
 if(code){console.log(output.slice(-6500));throw Error(file+' failed');}console.log(file+' passed');
}
