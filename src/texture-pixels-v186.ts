/** Read a decoded image once on a worker, instead of forcing dozens of
 * canvas/GPU readbacks on the scrolling/video thread. No resampling occurs. */
let worker:Worker|null=null,next=0;
const jobs=new Map<number,{resolve:(data:Uint8Array)=>void;reject:(error:Error)=>void;timer:ReturnType<typeof setTimeout>}>();
function close(error:Error){worker?.terminate();worker=null;for(const job of jobs.values()){clearTimeout(job.timer);job.reject(error);}jobs.clear();}
export async function texturePixels186(image:CanvasImageSource,width:number,height:number){
 if(!worker){
  const source=`onmessage=event=>{const{id,image,width,height}=event.data;try{const canvas=new OffscreenCanvas(width,height),context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);const pixels=context.getImageData(0,0,width,height).data;image.close();postMessage({id,pixels:pixels.buffer},[pixels.buffer]);}catch(error){postMessage({id,error:String(error)});}};`;
  const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));try{worker=new Worker(url);}finally{URL.revokeObjectURL(url);}
  worker.onmessage=event=>{const job=jobs.get(event.data.id);if(!job)return;jobs.delete(event.data.id);clearTimeout(job.timer);if(event.data.error)job.reject(Error(event.data.error));else job.resolve(new Uint8Array(event.data.pixels));};worker.onerror=()=>close(Error('Texture pixel worker failed'));
 }
 const bitmap=await createImageBitmap(image,{premultiplyAlpha:'none',colorSpaceConversion:'none'}),id=++next;
 return new Promise<Uint8Array>((resolve,reject)=>{const timer=setTimeout(()=>close(Error('Texture pixel worker deadline')),8000);jobs.set(id,{resolve,reject,timer});try{worker!.postMessage({id,image:bitmap,width,height},[bitmap]);}catch(error){jobs.delete(id);clearTimeout(timer);bitmap.close();reject(error);}});
}
if(typeof window!=='undefined'&&new URLSearchParams(location.search).has('texturePixelAudit186'))(window as any).texturePixels186=texturePixels186;
