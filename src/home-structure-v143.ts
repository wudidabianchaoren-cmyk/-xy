import * as THREE from 'three';

type Part={min:THREE.Vector3;max:THREE.Vector3;vertices:number[]};

/** The V24 facade contains 138 separate raised 80×35 cm tiles. Their real
 * 22 mm gaps survived every material edit. Replace that central facing (not
 * the tower, windows, pediment, clockwork, pilasters or cornices) with one
 * solid dressed-stone wall containing the original shutter openings. */
export function repairCourtyardStructure(scene:THREE.Scene){
  const meshes:THREE.Mesh[]=[];
  scene.traverse(o=>{if(o instanceof THREE.Mesh&&o.visible&&/^V16__quarried_warm_limestone_batch$/.test(o.name))meshes.push(o);});
  let removedBlocks=0,removedTriangles=0;const edited:{mesh:THREE.Mesh;before:THREE.BufferGeometry;after:THREE.BufferGeometry}[]=[];
  for(const mesh of meshes){
    const g=mesh.geometry,p=g.getAttribute('position'),ix=g.index;if(!ix)continue;
    const parent=new Int32Array(p.count);for(let i=0;i<p.count;i++)parent[i]=i;
    const find=(n:number):number=>{while(parent[n]!==n){parent[n]=parent[parent[n]];n=parent[n];}return n;};
    const join=(a:number,b:number)=>{a=find(a);b=find(b);if(a!==b)parent[b]=a;};
    const coincident=new Map<string,number>();
    for(let i=0;i<p.count;i++){const k=`${Math.round(p.getX(i)*1000)},${Math.round(p.getY(i)*1000)},${Math.round(p.getZ(i)*1000)}`,j=coincident.get(k);if(j===undefined)coincident.set(k,i);else join(i,j);}
    for(let i=0;i<ix.count;i+=3){join(ix.getX(i),ix.getX(i+1));join(ix.getX(i),ix.getX(i+2));}
    const parts=new Map<number,Part>(),v=new THREE.Vector3();
    for(let i=0;i<p.count;i++){const k=find(i);let part=parts.get(k);if(!part){part={min:new THREE.Vector3(Infinity,Infinity,Infinity),max:new THREE.Vector3(-Infinity,-Infinity,-Infinity),vertices:[]};parts.set(k,part);}v.fromBufferAttribute(p,i);part.min.min(v);part.max.max(v);part.vertices.push(i);}
    const removed=new Set<number>();
    for(const [key,part]of parts){const a=part.min,b=part.max;
      if(a.x> -2.62&&b.x<2.32&&a.y>.055&&b.y<8.72&&a.z>-.98&&b.z<-.81&&b.z-a.z<.15){removed.add(key);removedBlocks++;}
    }
    if(!removed.size)continue;
    const keep:number[]=[];for(let i=0;i<ix.count;i+=3){if(removed.has(find(ix.getX(i))))removedTriangles++;else keep.push(ix.getX(i),ix.getX(i+1),ix.getX(i+2));}
    const clean=g.clone();clean.setIndex(keep);clean.computeBoundingBox();clean.computeBoundingSphere();mesh.geometry=clean;edited.push({mesh,before:g,after:clean});
  }
  if(!removedBlocks)return{applied:false,removedBlocks,reason:'No retained central facade blocks matched; original architecture left intact'};

  const shape=new THREE.Shape();shape.moveTo(-2.605,.070);shape.lineTo(2.305,.070);shape.lineTo(2.305,8.015);
  // Follow the original ogee canopy, rather than allowing a rectangular top
  // corner to poke through its descending silhouette.
  for(const[x,y]of [[2.10,8.10],[1.48,8.51],[1.19,8.90],[.61,9.17],[.15,9.26],[-.15,9.53],[-.45,9.26],[-.91,9.17],[-1.49,8.90],[-1.78,8.51],[-2.40,8.10],[-2.605,8.015]])shape.lineTo(x,y);
  shape.closePath();
  // Actual negative space: the apostle shutters remain openable, with their
  // original reveals, frames, brass hinges and concealed moving figures.
  for(const [left,right]of [[-1.125,-.554],[.255,.825]]){const h=new THREE.Path();h.moveTo(left,7.228);h.lineTo(left,7.992);h.lineTo(right,7.992);h.lineTo(right,7.228);h.closePath();shape.holes.push(h);}
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.135,steps:1,bevelEnabled:true,bevelThickness:.003,bevelSize:.003,bevelSegments:1,curveSegments:2});
  geometry.translate(0,0,-.974);
  const material=new THREE.MeshStandardMaterial({name:'V143 continuous honed limestone facade',color:new THREE.Color(.295,.225,.142),roughness:.78,metalness:.012,envMapIntensity:.16});
  material.onBeforeCompile=s=>{
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 facadePosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nfacadePosition=position;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 facadePosition;');
    s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      // Broad mineral clouds only: no brick atlas, per-tile AO, hard mortar
      // groove, procedural animated grain or baked tiled self-shadow.
      float cloud=sin(facadePosition.x*1.72+sin(facadePosition.y*.81))*sin(facadePosition.y*1.21+facadePosition.x*.31);
      float grain=sin(facadePosition.x*120.)*sin(facadePosition.y*133.);
      float resolved=1.-smoothstep(.25,1.2,length(fwidth(facadePosition.xy*133.)));
      diffuseColor.rgb*=1.+cloud*.016+grain*.003*resolved;`);
  };
  material.customProgramCacheKey=()=> 'v143-continuous-honed-facade';
  const wall=new THREE.Mesh(geometry,material);wall.name='V143 central tower continuous solid wall with shutter openings';wall.castShadow=wall.receiveShadow=true;scene.add(wall);
  const audit={applied:true,removedBlocks,removedTriangles,addedTriangles:geometry.index?geometry.index.count/3:geometry.getAttribute('position').count/3,continuousWall:true,windowOpenings:2,originalClockworkPreserved:true,originalTreesAndLightsPreserved:true,method:'connected-component removal of raised facing blocks, solid continuous facade with real shutter holes; no coplanar facade overlay'};
  // The switch is a local inspection aid; production always starts repaired.
  (window as any).clockStructureReview={audit,mode:'repaired',setOriginal:(original:boolean)=>{for(const e of edited)e.mesh.geometry=original?e.before:e.after;wall.visible=!original;(window as any).clockStructureReview.mode=original?'original':'repaired';}};
  return audit;
}
