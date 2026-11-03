import type * as T from 'three';
/** Small rolling CPU/draw counters; GPU timer queries are opt-in diagnostics. */
export function frameProfile(renderer:T.WebGLRenderer,state:any){
 renderer.info.autoReset=false;
 const cpu:number[]=[],gl=renderer.getContext() as WebGL2RenderingContext,ext=new URLSearchParams(location.search).has('performanceAudit')?gl.getExtension('EXT_disjoint_timer_query_webgl2'):null;
 const pending:WebGLQuery[]=[];let active:WebGLQuery|null=null,frames=0,last=performance.now();
 state.performance={frames:0,calls:0,triangles:0,cpuMs:0,gpuMs:null};
 return{begin(){renderer.info.reset();if(ext&&frames%30===0&&pending.length<3){active=gl.createQuery();if(active)gl.beginQuery(ext.TIME_ELAPSED_EXT,active);}return performance.now();},end(start:number){
  if(active){gl.endQuery(ext!.TIME_ELAPSED_EXT);pending.push(active);active=null;}
  if(ext&&pending.length&&gl.getQueryParameter(pending[0],gl.QUERY_RESULT_AVAILABLE)){const q=pending.shift()!;if(!gl.getParameter(ext.GPU_DISJOINT_EXT))state.performance.gpuMs=gl.getQueryParameter(q,gl.QUERY_RESULT)/1e6;gl.deleteQuery(q);}
  const now=performance.now();cpu.push(now-start);if(cpu.length>120)cpu.shift();frames++;Object.assign(state.performance,{frames,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,cpuMs:now-start,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures});
  if(now-last>1000){const sorted=[...cpu].sort((a,b)=>a-b);state.performance.cpuP95Ms=sorted[Math.floor((sorted.length-1)*.95)];last=now;}
 }};
}
