import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createGullsV157} from './gulls-v157';

/** Dense near-field sampling, with the same continuous surface extending to the horizon. */
export function seaGridV155(){
 const n=224,p=new Float32Array((n+1)*(n+1)*3),uv=new Float32Array((n+1)*(n+1)*2),idx:number[]=[];
 const at=(v:number)=>{const a=Math.abs(v);return Math.sign(v)*(a<.66?a/.66*135:135+Math.pow((a-.66)/.34,2)*2865);};
 for(let z=0;z<=n;z++)for(let x=0;x<=n;x++){const i=z*(n+1)+x;p[i*3]=at(x/n*2-1);p[i*3+1]=at(z/n*2-1);uv[i*2]=x/n;uv[i*2+1]=z/n;}
 for(let z=0;z<n;z++)for(let x=0;x<n;x++){const a=z*(n+1)+x,b=a+1,c=a+n+1,d=c+1;idx.push(a,b,d,a,d,c);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));g.setAttribute('uv',new T.BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}

export async function coastalLifeV157(scene:T.Scene,_loader:GLTFLoader,clock:{value:number},state:any,camera?:T.Camera){return createGullsV157(scene,clock,state,camera);}
