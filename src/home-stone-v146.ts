import * as THREE from 'three';
import {TessellateModifier} from 'three/addons/modifiers/TessellateModifier.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const hash=(x:number,y:number)=>{const a=Math.sin(x*127.1+y*311.7)*43758.5453;return a-Math.floor(a);};
function noise(x:number,y:number){const a=Math.floor(x),b=Math.floor(y);let u=x-a,v=y-b;u=u*u*(3-2*u);v=v*v*(3-2*v);return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(a,b),hash(a+1,b),u),THREE.MathUtils.lerp(hash(a,b+1),hash(a+1,b+1),u),v);}
// Irregular courses are recessed into a connected face. Worn shoulders give
// stone thickness without restoring the old floating raised-brick grid.
function masonry(x:number,y:number){
 const bed=(y+.078*Math.sin(y*1.64)+.025*noise(x*.85,y*.4))/.64,row=Math.floor(bed),fy=bed-row;
 const width=1.05+hash(row,8)*.58,run=x/width+hash(row,3)*.89+noise(x*.6,row)*.04,fx=run-Math.floor(run);
 const h=Math.min(fy,1-fy)*.64,v=Math.min(fx,1-fx)*width;
 return{edge:Math.min(h,v),joint:Math.max(Math.exp(-Math.pow(h/.011,2)),Math.exp(-Math.pow(v/.008,2))*.82),tone:hash(Math.floor(run),row)};
}
function reliefAt(x:number,y:number){
 const block=masonry(x,y),shoulder=THREE.MathUtils.smoothstep(block.edge,.006,.105);
 const relief=(noise(x*2.25,y*2.25)-.5)*.040+(noise(x*6.7,y*6.7)-.5)*.014;
 const face=shoulder*(.004+block.tone*.008)-block.joint*.007;
 const side=THREE.MathUtils.smoothstep(Math.min(x+2.605,2.305-x,y-.07),0,.08);
 let opening=1;
 for(const [left,right]of [[-1.125,-.554],[.255,.825]]){
  const dx=Math.max(left-x,0,x-right),dy=Math.max(7.228-y,0,y-7.992);
  opening*=THREE.MathUtils.smoothstep(Math.hypot(dx,dy),0,.065);
 }
 return (relief+face)*side*opening;
}

// Solid stone facing bonded into the existing wall: broad uneven beds, dressed
// window reveals and an actual projecting coping beneath the original roof.
export function buildClockMasonryV150(scene:THREE.Scene,stone:{map:THREE.Texture;normalMap:THREE.Texture;roughnessMap:THREE.Texture}){
 const stones:THREE.BufferGeometry[]=[],trim:THREE.BufferGeometry[]=[];let count=0;
 const roof=[[-2.605,8.015],[-2.40,8.10],[-1.78,8.51],[-1.49,8.90],[-.91,9.17],[-.45,9.26],[-.15,9.53],[.15,9.26],[.61,9.17],[1.19,8.90],[1.48,8.51],[2.10,8.10],[2.305,8.015]];
 const roofY=(x:number)=>{for(let i=1;i<roof.length;i++)if(x<=roof[i][0])return THREE.MathUtils.lerp(roof[i-1][1],roof[i][1],(x-roof[i-1][0])/(roof[i][0]-roof[i-1][0]));return roof.at(-1)![1];};
 type Rect={l:number;r:number;b:number;t:number};
 const windows:Rect[]=[{l:-1.19,r:-.49,b:7.16,t:8.07},{l:.19,r:.89,b:7.16,t:8.07}];
 const subtract=(r:Rect,h:Rect):Rect[]=>{if(r.r<=h.l||r.l>=h.r||r.t<=h.b||r.b>=h.t)return[r];const out:Rect[]=[];if(r.l<h.l)out.push({...r,r:h.l});if(r.r>h.r)out.push({...r,l:h.r});const l=Math.max(r.l,h.l),right=Math.min(r.r,h.r);if(r.b<h.b)out.push({l,r:right,b:r.b,t:h.b});if(r.t>h.t)out.push({l,r:right,b:h.t,t:r.t});return out;};
 function block(rect:Rect,seed:number,front:number,dressed=false){
  let{l,r,b,t}=rect;if(r-l<.09||t-b<.07)return;
  const gap=dressed?.002:.006;l+=gap;r-=gap;b+=gap;t-=gap;
  const boundaries=[l,r,...roof.filter(v=>v[0]>l&&v[0]<r).map(v=>v[0])];
  for(let i=1;i<roof.length;i++){const a=roof[i-1],z=roof[i],height=b+.04;if((a[1]-height)*(z[1]-height)<0){const x=a[0]+(z[0]-a[0])*(height-a[1])/(z[1]-a[1]);if(x>l&&x<r)boundaries.push(x);}}
  const valid=boundaries.filter(x=>roofY(x)>=b+.0399);if(valid.length<2)return;
  const left=Math.min(...valid),right=Math.max(...valid);
  if(right-left<.09)return;
  const chip=dressed?.006:.012+hash(seed,5)*.014;
  const topXs=[left,...roof.filter(v=>v[0]>left&&v[0]<right).map(v=>v[0]),right].sort((a,b)=>b-a);
  const points:[[number,number],...[number,number][]]=[[left+chip,b],[right-chip*.6,b+hash(seed,6)*chip],[right,b+chip]];
  for(const xx of topXs)points.push([xx,Math.min(t,roofY(xx)-.025)]);
  points.push([left,b+chip]);
  const shape=new THREE.Shape();shape.moveTo(...points[0]);for(const p of points.slice(1))shape.lineTo(...p);shape.closePath();
  const depth=front+.91,geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:dressed?.009:.014+hash(seed,9)*.012,bevelThickness:dressed?.009:.012,bevelSegments:1,steps:1,curveSegments:1});geometry.translate(0,0,-.91);
  const positions=geometry.getAttribute('position'),normals=geometry.getAttribute('normal'),colours=[];
  const shade=dressed?.98:.82+hash(seed,1)*.25;
  for(let i=0;i<positions.count;i++){
   const x=positions.getX(i),y=positions.getY(i);if(normals.getZ(i)>.7)positions.setZ(i,positions.getZ(i)+(noise(x*5.2+seed,y*5.2)-.5)*(dressed?.004:.014));
   colours.push(shade,shade*(.98+hash(seed,4)*.025),shade*.97);
  }
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colours,3));geometry.computeVertexNormals();(dressed?trim:stones).push(geometry);count++;
 }
 const courses=[.13,.58,1.13,1.72,2.18,2.81,3.36,3.85,4.46,5.03,5.54,6.19,6.68,7.14,7.68,8.16,8.70,9.21,9.59];
 for(let row=0;row<courses.length-1;row++){
  let x=-2.605,part=0;
  while(x<2.30){const width=.72+hash(row*7+part,2)*.92,right=Math.min(2.305,x+width),seed=row*31+part;
   let rects:Rect[]=[{l:x,r:right,b:courses[row],t:courses[row+1]}];for(const h of windows)rects=rects.flatMap(r=>subtract(r,h));
   for(const rect of rects)block(rect,seed,-.765+hash(seed,10)*.075);
   x=right;part++;
  }
 }
 // Jamb stones bond back into the wall; no loose decorative slabs are added.
 for(const [i,w]of windows.entries()){
  for(let k=0;k<3;k++){const b=7.16+k*.305;block({l:w.l-.13,r:w.l+.015,b,t:b+.30},1000+i*10+k,-.64,true);block({l:w.r-.015,r:w.r+.13,b,t:b+.30},1020+i*10+k,-.64,true);}
  block({l:w.l-.16,r:w.r+.16,b:8.035,t:8.18},1050+i,-.61,true);
  block({l:w.l-.16,r:w.r+.16,b:7.05,t:7.18},1060+i,-.58,true);
 }
 // Stepped limestone coping follows the existing ogee canopy and remains
 // beneath it. Each segment has its own bevelled thickness and return.
 for(let i=1;i<roof.length;i++){
  const a=roof[i-1],z=roof[i],shape=new THREE.Shape();shape.moveTo(a[0],a[1]-.18);shape.lineTo(z[0],z[1]-.18);shape.lineTo(z[0],z[1]-.055);shape.lineTo(a[0],a[1]-.055);shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.29,bevelEnabled:true,bevelSize:.009,bevelThickness:.009,bevelSegments:1,steps:1});geometry.translate(0,0,-.91);const c=[];for(let k=0;k<geometry.getAttribute('position').count;k++)c.push(.98,.98,.96);geometry.setAttribute('color',new THREE.Float32BufferAttribute(c,3));trim.push(geometry);count++;
 }
 // Keep the existing cut stone and warm light, with gentler mineral normals and
 // a small satin response on worn faces so the bevels read without a wet coat.
 const material=new THREE.MeshStandardMaterial({name:'V152 warm mineral dressed limestone with distinct worn edges',map:stone.map,normalMap:stone.normalMap,roughnessMap:stone.roughnessMap,color:new THREE.Color(.46,.435,.39),vertexColors:true,normalScale:new THREE.Vector2(.76,.76),roughness:.82,metalness:0,envMapIntensity:.16});
 const meshes:THREE.Mesh[]=[];
 for(const [name,parts]of [['bonded irregular loadbearing stone courses',stones],['dressed window jambs lintels and projecting sills',trim]] as const){
  const geometry=mergeGeometries(parts,false);if(!geometry)continue;const mesh=new THREE.Mesh(geometry,material);mesh.name='V150 clock '+name;mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);meshes.push(mesh);for(const g of parts)g.dispose();
 }
 return{solidStoneBlocks:count,architecturalMeshes:meshes.length,triangles:meshes.reduce((n,m)=>n+(m.geometry.index?.count??m.geometry.getAttribute('position').count)/3,0),depthMillimetres:[145,330],windowStoneReveals:2,windowLintels:2,windowProjectingSills:2,roofCopingSegments:12,originalRoofAndClockworkPreserved:true};
}

/** Connected stone, with millimetre relief and weathering tied to the building's exposure. */
export function finishStoneV146(scene:THREE.Scene,stone:{map:THREE.Texture;normalMap:THREE.Texture;roughnessMap:THREE.Texture}){
 let treated=0,triangles=0,minRelief=Infinity,maxRelief=-Infinity;
 const started=performance.now();
 scene.traverse(o=>{
  if(!(o instanceof THREE.Mesh)||!o.name.startsWith('V143 central tower continuous'))return;
  const old=o.material as THREE.MeshStandardMaterial,original=o.geometry;
  const g=new TessellateModifier(.18,11).modify(original),p=g.getAttribute('position'),n=g.getAttribute('normal');
  for(let i=0;i<p.count;i++){
   if(n.getZ(i)<.8)continue;
   const x=p.getX(i),y=p.getY(i),relief=reliefAt(x,y),epsilon=.012;
   p.setZ(i,p.getZ(i)+relief);minRelief=Math.min(minRelief,relief);maxRelief=Math.max(maxRelief,relief);
   // Tessellation produces unindexed triangles. Analytic height derivatives
   // share a smooth normal at every seam instead of flat triangle normals.
   const dx=(reliefAt(x+epsilon,y)-reliefAt(x-epsilon,y))/(epsilon*2);
   const dy=(reliefAt(x,y+epsilon)-reliefAt(x,y-epsilon))/(epsilon*2),length=Math.hypot(dx,dy,1);
   n.setXYZ(i,-dx/length,-dy/length,1/length);
  }
  p.needsUpdate=n.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();o.geometry=g;triangles+=p.count/3;original.dispose();
  const maps={map:stone.map.clone(),normalMap:stone.normalMap.clone(),roughnessMap:stone.roughnessMap.clone()};
  for(const t of Object.values(maps)){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.67,.67);t.anisotropy=8;t.needsUpdate=true;}
  const mat=new THREE.MeshStandardMaterial({name:'V149 eroded limestone / deep worn faces / mineral pores and rain traces',...maps,color:new THREE.Color(.53,.48,.405),roughness:.91,metalness:0,normalScale:new THREE.Vector2(1.02,1.02),envMapIntensity:.16});
  mat.onBeforeCompile=s=>{
   s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 stonePosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nstonePosition=position;');
   s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
    varying vec3 stonePosition;
    float stoneHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float stoneNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(stoneHash(i),stoneHash(i+vec2(1,0)),f.x),mix(stoneHash(i+vec2(0,1)),stoneHash(i+vec2(1,1)),f.x),f.y);}
    float stoneFbm(vec2 p){return stoneNoise(p)*.58+stoneNoise(p*2.07+9.)*.28+stoneNoise(p*4.13+17.)*.14;}
    vec3 stoneMasonry(vec2 p){float bed=(p.y+.078*sin(p.y*1.64)+.025*stoneNoise(p*vec2(.85,.4)))/.64;float row=floor(bed),fy=fract(bed);float width=1.05+stoneHash(vec2(row,8.))*.58;float run=p.x/width+stoneHash(vec2(row,3.))*.89+stoneNoise(vec2(p.x*.6,row))*.04;float fx=fract(run);float h=min(fy,1.-fy)*.64,v=min(fx,1.-fx)*width;return vec3(min(h,v),max(exp(-pow(h/.011,2.)),exp(-pow(v/.008,2.))*.82),stoneHash(vec2(floor(run),row)));}
    float stoneDamp(vec2 p){float base=(1.-smoothstep(.12,1.1,p.y))*(.35+.65*stoneFbm(p*2.));float runoff=stoneFbm(vec2(p.x*11.,p.y*.49));float streak=smoothstep(.47,.75,runoff);float belowWindow=(1.-smoothstep(6.05,7.3,p.y))*smoothstep(4.1,6.5,p.y);float underSill=exp(-pow((p.y-7.12)/.14,2.));return clamp(base*.60+streak*.31+belowWindow*streak*.24+underSill*.27,0.,.8);}
    float stoneChisel(vec2 p){float resolved=1.-smoothstep(.03,.11,length(fwidth(p)));float pits=pow(1.-stoneFbm(p*17.),3.)*.017;float chips=stoneFbm(p*vec2(8.5,12.))*.009;vec3 bed=stoneMasonry(p);return (chips-pits-bed.y*.004)*resolved;}
    vec3 stonePerturb(vec3 surface,vec3 baseNormal,float height){vec3 dx=dFdx(surface),dy=dFdy(surface);vec3 r1=cross(dy,baseNormal),r2=cross(baseNormal,dx);float determinant=dot(dx,r1);vec3 gradient=sign(determinant)*(dFdx(height)*r1+dFdy(height)*r2);return normalize(abs(determinant)*baseNormal-gradient);}`)
    .replace('#include <map_fragment>',`#include <map_fragment>
     vec2 sp=stonePosition.xy;float cloud=stoneFbm(sp*.82),salt=stoneFbm(sp*4.1);float damp=stoneDamp(sp);
     float luma=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));diffuseColor.rgb=mix(vec3(luma),diffuseColor.rgb,.62);
     vec3 block=stoneMasonry(sp);float mortar=block.y*(.52+.48*stoneNoise(vec2(sp.x*2.3,sp.y*.2)));
     diffuseColor.rgb*=mix(.74,1.14,cloud)*mix(.88,1.08,block.z)*(1.-mortar*.25);diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.52,.57,.52),damp);
     float mineral=smoothstep(.57,.80,salt)*(1.-damp);diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.16,1.14,1.08),mineral*.40);`)
    .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
     normal=stonePerturb(-vViewPosition,normal,stoneChisel(stonePosition.xy));`)
    .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
     roughnessFactor=clamp(.73+roughnessFactor*.20+stoneFbm(stonePosition.xy*5.)*.08-stoneDamp(stonePosition.xy)*.13,.70,.99);`);
  };
  mat.customProgramCacheKey=()=> 'v149-continuous-eroded-limestone-smooth-relief-1';o.material=mat;old.dispose();treated++;
 });
 const construction=treated?buildClockMasonryV150(scene,stone):null;
 return{treated,triangles,reliefMillimetres:Number(((maxRelief-minRelief)*1000).toFixed(2)),finishMilliseconds:Number((performance.now()-started).toFixed(1)),finish:'continuous wall with solid irregular bonded stone courses and dressed window structure',smoothAnalyticNormals:true,construction,uniformBrickTiles:false,extraDrawCalls:construction?.architecturalMeshes??0};
}
