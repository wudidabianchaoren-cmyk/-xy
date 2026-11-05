import type * as T from 'three';
/** A submitted WebGL frame is not yet a painted frame on a busy GPU. */
export async function waitForPaint191(renderer:T.WebGLRenderer){
 const gl=renderer.getContext() as WebGL2RenderingContext;
 if(gl.fenceSync&&!gl.isContextLost()){
  const fence=gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE,0);gl.flush();
  if(fence)try{await new Promise<void>((resolve,reject)=>{const started=performance.now();const poll=()=>{if(gl.isContextLost()){reject(Error('Graphics context lost before first frame'));return;}const result=gl.clientWaitSync(fence,0,0);if(result===gl.ALREADY_SIGNALED||result===gl.CONDITION_SATISFIED){resolve();return;}if(result===gl.WAIT_FAILED||performance.now()-started>30000){reject(Error('First frame GPU deadline'));return;}requestAnimationFrame(poll);};poll();});}finally{gl.deleteSync(fence);}
 }
 await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
}
