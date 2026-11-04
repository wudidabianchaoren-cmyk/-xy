import type * as T from 'three';
/** Compile the exact previously captured shader text while geometry travels.
 * It never substitutes a program/material in Three: normal compilation and
 * validation still run. Any unsupported warm-up is discarded safely. */
export function prewarmCourtyardPrograms186(renderer:T.WebGLRenderer){
 const gl=renderer.getContext() as WebGL2RenderingContext,extension=gl.getExtension('KHR_parallel_shader_compile');
 const shaders=new Map<string,WebGLShader>(),programs:WebGLProgram[]=[],began=performance.now();
 const audit:any={startedAt:began,phase:'fetching',programs:0,distinctShaderStages:0,readyAt:0,error:null};
 const release=()=>{for(const p of programs)gl.deleteProgram(p);for(const s of shaders.values())gl.deleteShader(s);programs.length=0;shaders.clear();};
 const ready=(async()=>{
  if(new URLSearchParams(location.search).has('skipShaderPrefetch186')||!extension){audit.phase='skipped';return;}
  try{
   const response=await fetch('./assets/browser-v186/shaders/home-programs.json');if(!response.ok)throw Error('Courtyard shader warm-up unavailable');const pack=await response.json();
   if(pack.version!==186||!Array.isArray(pack.programs)||pack.programs.length>100)throw Error('Invalid courtyard shader warm-up');audit.phase='compiling';
   const stage=(type:number,source:string)=>{const key=type+':'+source;let s=shaders.get(key);if(!s){s=gl.createShader(type)!;gl.shaderSource(s,source);gl.compileShader(s);shaders.set(key,s);}return s;};
   for(const item of pack.programs){if(gl.isContextLost())throw Error('Graphics context changed');const p=gl.createProgram()!;gl.attachShader(p,stage(gl.VERTEX_SHADER,item.vertex));gl.attachShader(p,stage(gl.FRAGMENT_SHADER,item.fragment));gl.linkProgram(p);programs.push(p);audit.programs=programs.length;await new Promise(requestAnimationFrame);}
   gl.flush();audit.distinctShaderStages=shaders.size;
   while(programs.some(p=>!gl.getProgramParameter(p,extension.COMPLETION_STATUS_KHR))){if(gl.isContextLost()||performance.now()-began>90000)throw Error('Courtyard warm-up deadline');await new Promise(resolve=>setTimeout(resolve,25));}
   if(programs.some(p=>!gl.getProgramParameter(p,gl.LINK_STATUS)))throw Error('Warm-up source differs from this graphics device');audit.phase='ready';audit.readyAt=performance.now();
  }catch(error){audit.phase='discarded';audit.error=String(error);release();}
 })();
 return{audit,ready,release};
}
