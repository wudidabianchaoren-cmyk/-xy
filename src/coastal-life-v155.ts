import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

/** Dense near-field sampling, with the same continuous surface extending to the horizon. */
export function seaGridV155(){
 const n=224,p=new Float32Array((n+1)*(n+1)*3),uv=new Float32Array((n+1)*(n+1)*2),idx:number[]=[];
 const at=(v:number)=>{const a=Math.abs(v);return Math.sign(v)*(a<.66?a/.66*135:135+Math.pow((a-.66)/.34,2)*2865);};
 for(let z=0;z<=n;z++)for(let x=0;x<=n;x++){const i=z*(n+1)+x;p[i*3]=at(x/n*2-1);p[i*3+1]=at(z/n*2-1);uv[i*2]=x/n;uv[i*2+1]=z/n;}
 for(let z=0;z<n;z++)for(let x=0;x<n;x++){const a=z*(n+1)+x,b=a+1,c=a+n+1,d=c+1;idx.push(a,b,d,a,d,c);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));g.setAttribute('uv',new T.BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}

/** Reuse the existing native gull geometry; wind-driven wing bend and circular flight. */
export async function coastalLifeV155(scene:T.Scene,loader:GLTFLoader,clock:{value:number},state:any){
 const source=await loader.loadAsync('./assets/odyssey/runtime-v152/V152DistantGull.glb');let base:T.Mesh|undefined;
 source.scene.traverse(o=>{if(o instanceof T.Mesh&&!base)base=o;});
 const gulls:T.Mesh[]=[];
 if(base){const mat=new T.MeshStandardMaterial({color:0xf3e7cb,roughness:.8,side:T.DoubleSide});
  mat.onBeforeCompile=s=>{s.uniforms.gullClock=clock;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float gullClock;').replace('#include <begin_vertex>',`#include <begin_vertex>
    float tip=pow(clamp(abs(position.x)/.84,0.,1.),1.25);transformed.y+=sin(gullClock*3.1)*tip*.30;`);};
  for(let i=0;i<7;i++){const bird=new T.Mesh(base.geometry,mat);bird.scale.setScalar(.65+(i%3)*.13);bird.frustumCulled=false;scene.add(bird);gulls.push(bird);}
 }
 state.birds={count:gulls.length,source:'existing V152 gull geometry',animated:true};
 return{update(t:number){gulls.forEach((bird,i)=>{const angle=t*(.045+i*.0015)+i*.91,r=24+i*4;bird.position.set(-9+Math.cos(angle)*r,25+i*1.7+Math.sin(angle*1.9)*1.8,-30+Math.sin(angle)*r*.65);bird.rotation.set(0,-angle,Math.sin(angle*1.7)*.13);});state.birds.time=t;state.birds.positions=gulls.map(b=>b.position.toArray());}};
}
