import {GLTFLoader,type GLTF} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
const pending=new Map<string,Promise<GLTF>>();
export function retainedCourtyardModel186(path:string){let job=pending.get(path);if(!job){job=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(path);job.catch(()=>pending.delete(path));pending.set(path,job);}return job;}
export function preloadCourtyardDetails186(){for(const path of ['./blender/reference-architecture-v18/courtyard-additions.glb','./blender/reference-architecture-v19/architectural-profiles.glb','./blender/reference-architecture-v20/courtyard-depth.glb'])void retainedCourtyardModel186(path).catch(()=>{});}
