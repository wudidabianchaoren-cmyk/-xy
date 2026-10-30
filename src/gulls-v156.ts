import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** Solid, articulated gulls. +Z is beak/flight direction; flights stay seaward of island and ship. */
export function createGullsV156(scene:T.Scene,clock:{value:number},state:any,camera?:T.Camera){
 const palette={white:new T.Color('#eeede5'),grey:new T.Color('#aeb4b4'),dark:new T.Color('#29343c'),beak:new T.Color('#d0a551'),eye:new T.Color('#151a1c')};
 const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.78,metalness:0});
 const sphere=new T.SphereGeometry(1,14,10),parts:T.BufferGeometry[]=[];
 function paint(g:T.BufferGeometry,color:T.Color){g.deleteAttribute('uv');const count=g.attributes.position.count,c=new Float32Array(count*3);for(let i=0;i<count;i++)color.toArray(c,i*3);g.setAttribute('color',new T.BufferAttribute(c,3));return g;}
 function ellipsoid(x:number,y:number,z:number,sx:number,sy:number,sz:number,color:T.Color){const g=sphere.clone();g.scale(sx,sy,sz);g.translate(x,y,z);parts.push(paint(g,color));}
 // Rounded breast, separate mantle, throat and skull: a real silhouette from every direction.
 ellipsoid(0,0,-.04,.155,.14,.36,palette.white);ellipsoid(0,.075,-.09,.145,.066,.285,palette.grey);
 ellipsoid(0,.055,.22,.095,.115,.20,palette.white);ellipsoid(0,.105,.395,.108,.105,.13,palette.white);
 const beak=new T.ConeGeometry(.046,.19,10);beak.rotateX(Math.PI/2);beak.scale(1,.65,1);beak.translate(0,.087,.551);parts.push(paint(beak,palette.beak));
 for(const side of[-1,1]){ellipsoid(side*.100,.13,.419,.013,.014,.015,palette.eye);ellipsoid(side*.109,.135,.423,.0035,.004,.004,palette.white);}
 /** Closed, cambered feather with an elliptical thickness profile, not a card or V plane. */
 function feather(a:T.Vector3,b:T.Vector3,width:number,grey:boolean,blackTip=false){
  const p:number[]=[],c:number[]=[],idx:number[]=[],rings=7,sides=8,d=b.clone().sub(a),side=new T.Vector3(-d.z,0,d.x).normalize();
  for(let j=0;j<=rings;j++){const u=j/rings,centre=a.clone().addScaledVector(d,u);centre.y+=Math.sin(u*Math.PI)*.026;const taper=Math.max(.045,Math.pow(Math.sin(Math.PI*u),.55));
   for(let k=0;k<sides;k++){const angle=k/sides*Math.PI*2,v=centre.clone().addScaledVector(side,Math.cos(angle)*width*taper);v.y+=Math.sin(angle)*.010*taper;p.push(v.x,v.y,v.z);const col=blackTip&&u>.72?palette.dark:(grey&&Math.sin(angle)>.0?palette.grey:palette.white);c.push(col.r,col.g,col.b);}}
  for(let j=0;j<rings;j++)for(let k=0;k<sides;k++){const a=j*sides+k,b=j*sides+(k+1)%sides,c=a+sides,d=b+sides;idx.push(a,c,b,b,c,d);}for(let k=1;k<sides-1;k++){idx.push(0,k+1,k);const e=rings*sides;idx.push(e,e+k,e+k+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(c,3));g.setIndex(idx);g.computeVertexNormals();return g;
 }
 for(let i=0;i<5;i++)parts.push(feather(new T.Vector3((i-2)*.035,-.005,-.27),new T.Vector3((i-2)*.048,-.01,-.58-Math.abs(i-2)*.015),.034,false));
 for(const side of[-1,1])for(let j=0;j<5;j++)parts.push(feather(new T.Vector3(side*(.108-j*.006),.085-j*.006,.13-j*.058),new T.Vector3(side*(.14-j*.01),.055-j*.005,-.045-j*.063),.028,true));
 const bodyGeometry=mergeGeometries(parts);parts.forEach(g=>g.dispose());sphere.dispose();
 const wingGeometries=new Map<number,{inner:T.BufferGeometry,outer:T.BufferGeometry}>();
 for(const side of[-1,1]){const inner:T.BufferGeometry[]=[],outer:T.BufferGeometry[]=[];
  // Overlapping solid coverts bridge the shoulder, then long swept primaries form a fingered edge.
  for(let j=0;j<7;j++)inner.push(feather(new T.Vector3(side*(.08+j*.061),.015,-.005-j*.025),new T.Vector3(side*(.16+j*.069),.020,-.24-j*.012),.080,true));
  for(let j=0;j<8;j++)outer.push(feather(new T.Vector3(side*(j*.047),.012,-j*.022),new T.Vector3(side*(.29+j*.054),-.015,-.31-j*.025),.056,true,j>3));
  const a=mergeGeometries(inner),b=mergeGeometries(outer);inner.forEach(g=>g.dispose());outer.forEach(g=>g.dispose());wingGeometries.set(side,{inner:a,outer:b});
 }
 const birds:{root:T.Group,wings:{side:number,inner:T.Group,outer:T.Group}[],phase:number,scale:number}[]=[];
 for(let i=0;i<7;i++){const root=new T.Group();root.name=`V156 solid gull ${i+1}`;const body=new T.Mesh(bodyGeometry,material);root.add(body);const wings:typeof birds[number]['wings']=[];
  for(const side of[-1,1]){const geometry=wingGeometries.get(side)!,inner=new T.Group(),outer=new T.Group();inner.position.set(side*.10,.065,.035);outer.position.set(side*.52,.018,-.105);inner.add(new T.Mesh(geometry.inner,material));outer.add(new T.Mesh(geometry.outer,material));inner.add(outer);root.add(inner);wings.push({side,inner,outer});}
  root.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=false;o.receiveShadow=false;}});const scale=.76+(i%3)*.045;root.scale.setScalar(scale);scene.add(root);birds.push({root,wings,phase:i*1.37,scale});
 }
 const hash=(n:number)=>{const q=Math.sin(n*127.1+31.7)*43758.5453;return q-Math.floor(q);};
 const anchors=new Map<string,T.Vector3>(),forward=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(0,1,0);
 function anchor(i:number,k:number){const key=i+':'+k;if(anchors.has(key))return anchors.get(key)!;const r=(n:number)=>hash(i*97+k*23+n),p=new T.Vector3(-44+r(2)*104,3.2+r(5)*9.3,26+r(8)*39);
  // Two independent middle-distance tracks cross the visible front-water corridor; the others roam wider/lower.
  if(i===2||i===3)p.set(20+r(2)*10,11+r(5)*2.5,26+r(8)*9);
  // One occasional crossing is anchored once to the camera, never attached to its subsequent movement.
  if(camera&&i<2&&(k+i)%5===0&&camera.position.z>13){camera.getWorldDirection(forward);right.crossVectors(forward,up).normalize();p.copy(camera.position).addScaledVector(forward,10+i*4).addScaledVector(right,k%2?-1.7:1.7);p.y=T.MathUtils.clamp(camera.position.y-2.8,5,14.2);p.z=Math.max(26,p.z);}
  anchors.set(key,p);return p;
 }
 function point(i:number,t:number,out:T.Vector3){const duration=8.2+i*.79,part=t/duration+i*.61,k=Math.floor(part),u=part-k,a=anchor(i,k-1),b=anchor(i,k),c=anchor(i,k+1),d=anchor(i,k+2);const u2=u*u,u3=u2*u;
  out.copy(b).multiplyScalar(2).addScaledVector(a,-u+2*u2-u3).addScaledVector(b,-5*u2+3*u3).addScaledVector(c,u+4*u2-3*u3).addScaledVector(d,-u2+u3).multiplyScalar(.5);out.z=Math.max(24.5,out.z);out.y=T.MathUtils.clamp(out.y,2.7,14.2);
  // Actual vessel world bounds (including mast) end at z=20.47; clear its front, rather than raising every bird.
  return out;
 }
 const pos=new T.Vector3(),next=new T.Vector3(),later=new T.Vector3(),velocity=new T.Vector3(),after=new T.Vector3();
 const triangleCount=(g:T.BufferGeometry)=>g.index?g.index.count/3:g.attributes.position.count/3;
 const trianglesPerBird=triangleCount(bodyGeometry)+[...wingGeometries.values()].reduce((n,g)=>n+triangleCount(g.inner)+triangleCount(g.outer),0);
 state.birds={count:7,source:'V156 original solid procedural geometry',body3D:true,featherThickness:.020,wingJoints:4,trianglesPerBird,totalTriangles:trianglesPerBird*7,flight:'independent non-circular Catmull paths / seaward envelope z>=24.5 / low swoops',minimumSeaHeight:2.7,maximumHeight:14.2};
 function update(t=clock.value){for(let i=0;i<birds.length;i++){const bird=birds[i];point(i,t,pos);point(i,t+.10,next);point(i,t+.22,later);velocity.subVectors(next,pos).normalize();after.subVectors(later,next).normalize();bird.root.position.copy(pos);bird.root.rotation.set(-Math.asin(T.MathUtils.clamp(velocity.y,-.7,.7)),Math.atan2(velocity.x,velocity.z),T.MathUtils.clamp(velocity.clone().cross(after).y*5,-.44,.44),'YXZ');const climb=T.MathUtils.clamp(velocity.y*2+.2,0,1),burst=T.MathUtils.smoothstep(Math.sin(t*.41+bird.phase),.2,.65),stroke=t*(7.1+i*.24)+bird.phase,flap=Math.sin(stroke)*(.055+.45*Math.max(climb,burst)),dive=1-T.MathUtils.smoothstep(velocity.y,-.42,-.10);for(const wing of bird.wings){wing.inner.rotation.z=wing.side*(.08+flap);wing.inner.rotation.y=wing.side*(.035+dive*.13);wing.outer.rotation.z=wing.side*(-.12+Math.sin(stroke-.5)*(.025+.11*Math.max(climb,burst)));wing.outer.rotation.y=wing.side*(.06+dive*.35);}}
  state.birds.time=t;state.birds.positions=birds.map(b=>b.root.position.toArray());state.birds.wingAngles=birds.map(b=>b.wings[0].inner.rotation.z);}
 update(0);return{update,birds:birds.map(b=>b.root),dispose(){for(const b of birds)scene.remove(b.root);bodyGeometry.dispose();for(const g of wingGeometries.values()){g.inner.dispose();g.outer.dispose();}material.dispose();}};
}
