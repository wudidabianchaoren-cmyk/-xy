import * as T from 'three';
/** Retain every card, instance, alpha edge and wind vertex hook. The derived
 * table changes where its static illumination is computed, not its geometry. */
export async function applyLeafRadiance186(sources:T.InstancedMesh[],state:any){
 const address='./assets/browser-v186/leaf-radiance/manifest.json',response=await fetch(address);if(!response.ok)throw Error('Leaf lighting table unavailable');const manifest=await response.json(),base=new URL(response.url),leaves=sources.filter(s=>!!(s.material as T.MeshStandardMaterial).alphaMap);
 if(leaves.length!==manifest.groups.length)throw Error('Leaf lighting group mismatch');
 const hash=async(data:ArrayBufferView)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new Uint8Array(data.buffer,data.byteOffset,data.byteLength))),n=>n.toString(16).padStart(2,'0')).join('');
 for(let i=0;i<leaves.length;i++){const s=leaves[i],g=manifest.groups[i];if(s.count!==g.instances||s.geometry.index!.count!==g.cards*6||await hash(s.geometry.attributes.position.array)!==g.positionSHA256||await hash(s.geometry.index!.array)!==g.indexSHA256||await hash(s.instanceMatrix.array)!==g.matrixSHA256)throw Error('Leaf lighting source geometry changed');}
 const buffers=await Promise.all(['day','night'].map(async mode=>{const r=await fetch(new URL(manifest[mode].file,base));if(!r.ok)throw Error('Leaf '+mode+' lighting unavailable');const b=await new Response(r.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();if(b.byteLength!==manifest.width*manifest.height*4)throw Error('Incomplete leaf lighting');return b;}));
 const maps=buffers.map(b=>{const t=new T.DataTexture(new Uint8Array(b),manifest.width,manifest.height,T.RGBAFormat,T.UnsignedByteType);t.colorSpace=T.SRGBColorSpace;t.minFilter=t.magFilter=T.NearestFilter;t.generateMipmaps=false;t.flipY=false;t.needsUpdate=true;return t;}),night={value:state.nightMix||0};
 for(let i=0;i<leaves.length;i++){
  const source=leaves[i],layout=manifest.groups[i],original=source.material as T.MeshStandardMaterial,geometry=source.geometry,index=geometry.index!,ids=new Float32Array(geometry.attributes.position.count);for(let c=0;c<layout.cards;c++)for(let v=0;v<6;v++)ids[index.getX(c*6+v)]=c;
  geometry.setAttribute('nativeLeafCard186',new T.BufferAttribute(ids,1));geometry.setAttribute('nativeLeafInstance186',new T.InstancedBufferAttribute(Float32Array.from({length:source.count},(_,n)=>n),1));
  const material=new T.MeshBasicMaterial({name:original.name+' / retained card illumination',map:original.map,alphaMap:original.alphaMap,alphaTest:original.alphaTest,side:original.side,transparent:original.transparent,opacity:original.opacity,depthWrite:original.depthWrite,toneMapped:false,fog:false});material.alphaToCoverage=original.alphaToCoverage;
  const vertexHook=original.userData.nativeSourceVertexHook||original.onBeforeCompile;
  material.onBeforeCompile=(shader,renderer)=>{const fragment=shader.fragmentShader;vertexHook.call(original,shader,renderer);shader.fragmentShader=fragment;Object.assign(shader.uniforms,{leafDay186:{value:maps[0]},leafNight186:{value:maps[1]},leafNightMix186:night,leafAtlas186:{value:new T.Vector2(manifest.width,manifest.height)},leafLayout186:{value:new T.Vector2(layout.cards,layout.offset)}});
   shader.vertexShader='attribute float nativeLeafCard186,nativeLeafInstance186;uniform sampler2D leafDay186,leafNight186;uniform float leafNightMix186;uniform vec2 leafAtlas186,leafLayout186;varying vec3 nativeLeafColour186;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
    float leafId186=nativeLeafCard186+nativeLeafInstance186*leafLayout186.x+leafLayout186.y;
    vec2 leafUv186=(vec2(mod(leafId186,leafAtlas186.x),floor(leafId186/leafAtlas186.x))+.5)/leafAtlas186;
    nativeLeafColour186=mix(texture2D(leafDay186,leafUv186).rgb,texture2D(leafNight186,leafUv186).rgb,leafNightMix186);`);
   shader.fragmentShader='varying vec3 nativeLeafColour186;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb=nativeLeafColour186;');
  };material.customProgramCacheKey=()=> 'retained-leaf-light186/'+i;source.material=material;
 }
 const audit=state.leafRadiance186={enabled:true,cards:manifest.cards,instances:manifest.groups.reduce((n:number,g:any)=>n+g.instances,0),sourceTrianglesPreserved:true,sourceWindPreserved:true,alphaCoveragePreserved:true,lighting:'derived retained day/night card illumination / candidate visual comparison required'};
 return{update:(n:number)=>{night.value=n;},audit};
}
