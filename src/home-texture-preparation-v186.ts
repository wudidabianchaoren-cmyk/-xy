import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const tasks:Promise<void>[]=[];
const audit={requested:0,finished:0,failed:[] as string[],mode:'compile unchanged materials while original images download'};
if(typeof window!=='undefined')(window as any).homeTexturePreparation=audit;
const filters:Record<number,T.TextureFilter>={9728:T.NearestFilter,9729:T.LinearFilter,9984:T.NearestMipmapNearestFilter,9985:T.LinearMipmapNearestFilter,9986:T.NearestMipmapLinearFilter,9987:T.LinearMipmapLinearFilter};
const wraps:Record<number,T.Wrapping>={33071:T.ClampToEdgeWrapping,33648:T.MirroredRepeatWrapping,10497:T.RepeatWrapping};
const original=GLTFLoader.prototype.parse;
// GLTF files share external images. Reuse their in-flight decode as well as
// the HTTP resource, with identical loader options and credentials.
const bitmaps=new Map<string,Promise<ImageBitmap>>(),loadBitmap=T.ImageBitmapLoader.prototype.load;
T.ImageBitmapLoader.prototype.load=function(url:string,onLoad:any,onProgress:any,onError:any){
 if(!url.includes('/assets/browser-v186/shared/'))return loadBitmap.call(this,url,onLoad,onProgress,onError);
 const key=JSON.stringify([new URL(url,location.href).href,this.crossOrigin,this.options]),cached=bitmaps.get(key);
 if(cached){this.manager.itemStart(url);cached.then(bitmap=>{onLoad?.(bitmap);this.manager.itemEnd(url);},error=>{onError?.(error);this.manager.itemError(url);this.manager.itemEnd(url);});return;}
 let resolve!:(image:ImageBitmap)=>void,reject!:(error:unknown)=>void;const job=new Promise<ImageBitmap>((a,b)=>{resolve=a;reject=b;});bitmaps.set(key,job);job.catch(()=>bitmaps.delete(key));
 return loadBitmap.call(this,url,image=>{resolve(image);onLoad?.(image);},onProgress,error=>{reject(error);onError?.(error);});
};
// The GLB geometry can arrive much later than its image list. Start those exact
// shared ImageBitmap jobs now; subsequent GLTF loads consume the same promises.
if(document.getElementById('voyage'))for(const path of (window as any).PORTFOLIO_RESOURCES_V180?.homeSharedImages186||[]){
 void new T.ImageBitmapLoader().loadAsync(path).catch(()=>{});
}
GLTFLoader.prototype.parse=function(data:any,path:string,onLoad:any,onError:any){
 if(!document.getElementById('voyage')||!/\/reference-architecture-v(?:16|18|19|20|24)\/$/.test(path))return original.call(this,data,path,onLoad,onError);
 const factory=(parser:any)=>({name:'PortfolioImagePreparation186',beforeRoot(){
  const get=parser.getDependency.bind(parser),ready=new Map<number,T.Texture>();
  parser.getDependency=(kind:string,index:number)=>{
   if(kind!=='texture')return get(kind,index);
   if(ready.has(index))return Promise.resolve(ready.get(index));
   const definition=parser.json.textures[index],sampler=parser.json.samplers?.[definition.sampler]||{},texture=new T.Texture();
   texture.flipY=false;texture.magFilter=(filters[sampler.magFilter]||T.LinearFilter)as T.MagnificationTextureFilter;texture.minFilter=(filters[sampler.minFilter]||T.LinearMipmapLinearFilter)as T.MinificationTextureFilter;texture.wrapS=wraps[sampler.wrapS]||T.RepeatWrapping;texture.wrapT=wraps[sampler.wrapT]||T.RepeatWrapping;texture.generateMipmaps=texture.minFilter!==T.NearestFilter&&texture.minFilter!==T.LinearFilter;texture.name=definition.name||'';ready.set(index,texture);parser.associations.set(texture,{textures:index});audit.requested++;
   const job=get('texture',index).then((loaded:T.Texture)=>{
    if(!loaded?.source?.data)throw Error('Courtyard image failed to load: texture '+index+' in '+path);
    // Texture transforms clone Texture but retain Source. Keep that shared Source
    // stable so every material clone receives the very same final image pixels.
    texture.source.data=loaded.source.data;texture.source.needsUpdate=true;texture.needsUpdate=true;if(!texture.name)texture.name=loaded.name;audit.finished++;loaded.dispose();
   }).catch((error:unknown)=>{audit.failed.push(String(error));throw error;});job.catch(()=>{});tasks.push(job);
   return Promise.resolve(texture);
  };
 }});
 this.register(factory);return original.call(this,data,path,onLoad,onError);
};
export function homeImagesReadyV186(){return Promise.all(tasks);}
