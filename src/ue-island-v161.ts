import * as T from'three';
/** Actual V161 UE viewport environment, confined to island and cottage materials. */
export async function attachUEIslandV161(roots:T.Object3D[],state:any){
 const base='./assets/ue-v161/island-ue5-cubeuv';const [meta,res]=await Promise.all([fetch(base+'.json').then(r=>{if(!r.ok)throw Error('Island UE metadata');return r.json()}),fetch(base+'.bin.gz')]);
 if(!res.ok||!meta.ready||meta.revision!==T.REVISION)throw Error('Island UE probe unavailable');
 const bytes=await new Response(res.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();if(bytes.byteLength!==meta.bytes)throw Error('Incomplete island probe');
 const probe=new T.DataTexture(new Uint16Array(bytes),meta.width,meta.height,T.RGBAFormat,T.HalfFloatType);probe.mapping=T.CubeUVReflectionMapping;probe.colorSpace=T.LinearSRGBColorSpace;probe.minFilter=probe.magFilter=T.LinearFilter;probe.generateMipmaps=false;probe.needsUpdate=true;
 const materials=new Map<T.MeshStandardMaterial,number>();for(const root of roots)root.traverse(o=>{if(!(o instanceof T.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof T.MeshStandardMaterial&&!materials.has(m)){const strength=/iron/i.test(m.name)?.58:.42;materials.set(m,strength);m.envMap=probe;m.envMapIntensity=strength;m.needsUpdate=true;}});
 state.ueIsland={engine:meta.engine,map:meta.sourceMap,sixNativeEXR:true,bytes:bytes.byteLength,materials:materials.size,sourceMapModified:false,nightScale:1,scope:'UE-rendered environment contribution on the same island, physical grass and stone house; web remains interactive Three.js'};
 return{update(night:number){const scale=(1-night)*(1-night);materials.forEach((base,m)=>m.envMapIntensity=base*scale);state.ueIsland.nightScale=scale;}};
}
