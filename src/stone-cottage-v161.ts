import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** Physical rubble masonry, deep apertures and overlapping barrel tiles. Metres, +Z door. */
export async function stoneCottageV161(state:any){
 const root=new T.Group();root.name='V161 old coastal stone keeper house';
 const tx=new T.TextureLoader(),path='./assets/odyssey/pbr-v103/seaside_rock/';
 const [map,normal,rough]=await Promise.all(['Diffuse.jpg','nor_gl.jpg','Rough.jpg'].map(n=>tx.loadAsync(path+n)));
 map.colorSpace=T.SRGBColorSpace;for(const t of[map,normal,rough]){t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;}
 const bins=new Map<T.Material,T.BufferGeometry[]>(),dummy=new T.Object3D();
 let seed=16127;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const stone=Array.from({length:7},(_,i)=>new T.MeshStandardMaterial({name:'V161 weathered limestone '+i,color:new T.Color().setRGB(.91+i*.055,.87+i*.047,.73+i*.040),map,normalMap:normal,normalScale:new T.Vector2(.64,.64),roughnessMap:rough,roughness:.96,envMapIntensity:.55}));
 const mortar=new T.MeshStandardMaterial({name:'V161 recessed lime mortar',color:0x766d57,roughness:1});
 const oak=new T.MeshStandardMaterial({name:'V161 salt-weathered oak grain',color:0x55422b,roughness:.91,envMapIntensity:.45});
 const oakLight=oak.clone();oakLight.name='V161 worn oak end grain';oakLight.color.set(0x7c6947);
 const iron=new T.MeshStandardMaterial({name:'V161 hand-forged iron',color:0x393630,metalness:.72,roughness:.78});
 const tiles=Array.from({length:5},(_,i)=>new T.MeshStandardMaterial({name:'V161 aged terracotta '+i,color:new T.Color().setHSL(.042+i*.007,.29,.29+i*.035),roughness:.94,envMapIntensity:.45,side:T.DoubleSide}));
 function add(g:T.BufferGeometry,m:T.Material,p:number[],s=[1,1,1],r=[0,0,0]){dummy.position.fromArray(p);dummy.scale.fromArray(s);dummy.rotation.set(r[0],r[1],r[2]);dummy.updateMatrix();g.applyMatrix4(dummy.matrix);const a=bins.get(m)||[];a.push(g);bins.set(m,a);}
 function box(p:number[],s:number[],m:T.Material,bevel=.035,tilt=0){const g=new RoundedBoxGeometry(s[0],s[1],s[2],2,Math.min(bevel,...s.map(v=>v*.18)));const uv=g.getAttribute('uv'),n=g.getAttribute('normal'),v=g.getAttribute('position');for(let i=0;i<uv.count;i++){const a=Math.abs(n.getX(i)),b=Math.abs(n.getY(i)),x=v.getX(i),y=v.getY(i),z=v.getZ(i);uv.setXY(i,(a>.7?z:x)*.95,(b>.7?z:y)*.95);if(stone.includes(m as any)){const ripple=Math.sin(x*17.1+z*11.3+p[0]*4.7)*Math.sin(y*23.7+z*9.1+p[1]*7.3)*.012;v.setXYZ(i,x+n.getX(i)*ripple,y+n.getY(i)*ripple,z+n.getZ(i)*ripple);}}g.computeVertexNormals();add(g,m,p,[1,1,1],[0,tilt,0]);}
 // Solid wall cores end at real door/window openings; mortar sits behind the stone face.
 for(const x of[-1.65,1.65])box([x,1.53,1.94],[1.84,3.06,.36],mortar,.015);
 box([0,2.80,1.94],[1.46,.55,.36],mortar,.015);box([0,1.53,-1.94],[5.14,3.06,.36],mortar,.015);
 for(const side of[-1,1]){for(const z of[-1.35,1.25])box([side*2.39,1.53,z],[.36,3.06,1.38],mortar,.015);box([side*2.39,.49,-.10],[.36,.98,1.25],mortar,.015);box([side*2.39,2.66,-.10],[.36,.80,1.25],mortar,.015);}
 let stones=0;
 function course(axis:'front'|'side',sign:number,row:number){const y=.21+row*.405,height=.37+rand()*.04,end=axis==='front'?2.60:2.12;let at=-end-(row%2?.30:0);
  while(at<end-.04){let w=.52+rand()*.42;w=Math.min(w,end-at);const mid=at+w/2,top=y+height/2,bottom=y-height/2;const gap=axis==='front'&&sign===1&&Math.abs(mid)<.76+w/2&&bottom<2.42;const window=axis==='side'&&Math.abs(mid+.10)<.64+w/2&&top>1.07&&bottom<2.32;
   if(!gap&&!window&&w>.10){const depth=.49+rand()*.065;box(axis==='front'?[mid,y,sign*1.98]:[sign*2.43,y,mid],axis==='front'?[w-.022,height,depth]:[depth,height,w-.022],stone[Math.floor(rand()*stone.length)],.055,(rand()-.5)*.025);stones++;}at+=w;
  }
 }
 for(let row=0;row<8;row++)for(const sign of[-1,1]){course('front',sign,row);course('side',sign,row);}
 // Gables and the worn, slightly proud corner quoins.
 const gableShape=new T.Shape();gableShape.moveTo(-2.56,3.05);gableShape.lineTo(2.56,3.05);gableShape.lineTo(0,4.64);gableShape.closePath();
 for(const z of[-2.00,1.78])add(new T.ExtrudeGeometry(gableShape,{depth:.23,bevelEnabled:false,steps:1}),mortar,[0,0,z]);
 for(const sign of[-1,1])for(let row=0;row<4;row++){const y=3.34+row*.34,half=Math.max(.08,2.48*(4.58-y)/1.5);let x=-half;while(x<half-.03){const w=Math.min(.64+rand()*.25,half-x);box([x+w/2,y,sign*1.98],[w-.018,.32,.46],stone[Math.floor(rand()*7)],.045);stones++;x+=w;}}
 for(const x of[-2.43,2.43])for(const z of[-1.98,1.98])for(let row=0;row<8;row++)box([x,.20+row*.405,z],[.57+row%2*.09,.39,.59],stone[(row+3)%7],.055);
 // Door stones, inset oak planks, forged hinges and iron ring.
 for(const x of[-.83,.83])for(let row=0;row<6;row++)box([x,.21+row*.38,2.06],[.36,.355,.68],stone[(row+2)%7],.045);
 box([0,2.46,2.075],[2.12,.30,.72],stone[5],.055);
 for(let j=0;j<6;j++)box([-.557+j*.223,1.12,1.89],[.21,2.22,.15],j%3===0?oakLight:oak,.012);
 for(const y of[.50,1.80]){box([0,y,1.992],[1.27,.085,.055],iron,.012);for(const x of[-.45,.43])box([x,y,2.03],[.04,.04,.035],iron,.008);}
 const ring=new T.TorusGeometry(.072,.012,6,18);add(ring,iron,[.35,1.12,2.03]);
 box([0,-.10,2.40],[2.12,.25,.76],stone[4],.055);box([0,-.29,2.80],[2.36,.22,.82],stone[3],.07);
 // The shutters sit inside half-metre reveals. Each board and shutter slat is physical.
 for(const side of[-1,1]){for(const z of[-.81,.61])box([side*2.45,1.70,z],[.63,1.36,.22],stone[5],.045);box([side*2.47,1.02,-.1],[.78,.20,1.74],stone[6],.05);box([side*2.44,2.39,-.1],[.65,.25,1.72],stone[4],.045);
  for(let j=0;j<7;j++)box([side*2.30,1.7,-.64+j*.18],[.12,1.17,.165],j%2?oak:oakLight,.012);
  for(const y of[1.3,2.05])box([side*2.38,y,-.1],[.055,.07,1.22],iron,.008);
 }
 // Oak rafters and overlapping curved ceramic channels, with varied weathered colour.
 for(const x of[-1,1])box([x*2.86,3.10,0],[.16,.18,5.04],oak,.02,0);
 box([0,4.45,0],[.18,.19,5.04],oak,.02);
 let tileCount=0;const roofSlope=.52;
 for(const side of[-1,1])for(let row=0;row<7;row++)for(let col=0;col<18;col++){
  const p:number[]=[],uv:number[]=[],indices:number[]=[];const u0=row*.43-.06,z0=-2.50+col*.28;
  for(let a=0;a<=2;a++)for(let b=0;b<=6;b++){const u=u0+a*.26,z=z0+b/6*.292;const crown=Math.sin(b/6*Math.PI)*.060;const x=side*u,y=4.65-u*roofSlope+crown+row*.003;p.push(x,y,z);uv.push(u*.9,z*.9);}
  for(let a=0;a<2;a++)for(let b=0;b<6;b++){const i=a*7+b;if(side>0)indices.push(i,i+1,i+7,i+1,i+8,i+7);else indices.push(i,i+7,i+1,i+1,i+7,i+8);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();add(g,tiles[Math.floor(rand()*5)],[0,0,0]);tileCount++;
 }
 // Ridge caps and a substantial stone chimney.
 for(let j=0;j<14;j++){const g=new T.CylinderGeometry(.15,.17,.39,10,1,true,-Math.PI/2,Math.PI);g.rotateX(-Math.PI/2);add(g,tiles[j%5],[0,4.66,-2.45+j*.37]);}
 for(let row=0;row<6;row++)box([-1.44,4.15+row*.26,-1.04],[.70,.245,.68],stone[row%7],.04);
 box([-1.44,5.69,-1.04],[.90,.15,.86],stone[3],.04);
 // Low irregular foundation is embedded in the original sampled ground.
 for(let row=0;row<3;row++)for(const sign of[-1,1]){for(let j=0;j<8;j++)box([-2.32+j*.66,-.22-row*.28,sign*2.01],[.65,.29,.65],stone[(j+row)%7],.055);for(let j=0;j<6;j++)box([sign*2.44,-.22-row*.28,-1.66+j*.66],[.65,.29,.65],stone[(j+row+1)%7],.055);}
 for(const[m,gs]of bins){const plain=gs.map(g=>g.index?g.toNonIndexed():g),g=mergeGeometries(plain,false);if(!g)continue;const mesh=new T.Mesh(g,m);mesh.name=m.name;mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);gs.forEach(x=>x.dispose());plain.forEach(x=>x.dispose());}
 state.cottageCraft={version:161,physicalRubbleMasonry:true,stones,wallThickness:.52,deepDoorReveal:true,shutterReveals:true,individualCurvedTiles:tileCount,forgeIron:true,embeddedFoundation:true,batches:root.children.length};
 return root;
}
