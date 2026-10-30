import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** Solid, articulated gulls. +Z is beak/flight direction; flights stay seaward of island and ship. */
export function createGullsV158(scene:T.Scene,clock:{value:number},state:any,camera?:T.Camera){
 const palette={white:new T.Color('#eeede5'),grey:new T.Color('#aeb4b4'),dark:new T.Color('#29343c'),beak:new T.Color('#d0a551'),eye:new T.Color('#151a1c')};
 const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.78,metalness:0});
 const sphere=new T.SphereGeometry(1,14,10),parts:T.BufferGeometry[]=[];
 function paint(g:T.BufferGeometry,color:T.Color){g.deleteAttribute('uv');const count=g.attributes.position.count,c=new Float32Array(count*3);for(let i=0;i<count;i++)color.toArray(c,i*3);g.setAttribute('color',new T.BufferAttribute(c,3));return g;}
 function ellipsoid(x:number,y:number,z:number,sx:number,sy:number,sz:number,color:T.Color){const g=sphere.clone();g.scale(sx,sy,sz);g.translate(x,y,z);parts.push(paint(g,color));}
 // Rounded breast, separate mantle, throat and skull: a real silhouette from every direction.
 ellipsoid(0,0,-.04,.125,.112,.32,palette.white);ellipsoid(0,.075,-.09,.145,.066,.285,palette.grey);
 ellipsoid(0,.055,.22,.095,.115,.20,palette.white);ellipsoid(0,.100,.384,.084,.083,.112,palette.white);
 const beak=new T.ConeGeometry(.032,.16,10);beak.rotateX(Math.PI/2);beak.scale(1,.65,1);beak.translate(0,.087,.551);parts.push(paint(beak,palette.beak));
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
 for(let i=0;i<7;i++){const root=new T.Group();root.name=`V158 solid gull ${i+1}`;const body=new T.Mesh(bodyGeometry,material);root.add(body);const wings:typeof birds[number]['wings']=[];
  for(const side of[-1,1]){const geometry=wingGeometries.get(side)!,inner=new T.Group(),outer=new T.Group();inner.position.set(side*.10,.065,.035);outer.position.set(side*.52,.018,-.105);inner.add(new T.Mesh(geometry.inner,material));outer.add(new T.Mesh(geometry.outer,material));inner.add(outer);root.add(inner);wings.push({side,inner,outer});}
  root.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=false;o.receiveShadow=false;}});const scale=.36+(i%3)*.025;root.scale.setScalar(scale);scene.add(root);birds.push({root,wings,phase:i*1.37,scale});
 }
 const hash=(n:number)=>{const q=Math.sin(n*127.1+31.7)*43758.5453;return q-Math.floor(q);};
 // Different closed, centripetal splines have precomputed arc-length tables. Flight speed no longer
 // depends on the random distance between two anchors, and no bird is attached to the camera.
 const tracks=birds.map((_bird,i)=>{const points:T.Vector3[]=[];const cx=-4+hash(i*7+2)*17,cz=49+hash(i*7+3)*4,rx=31+hash(i+23)*12,rz=18+hash(i+37)*3;
  for(let k=0;k<11;k++){const a=k/11*Math.PI*2+hash(i+10)*6.28,r=Math.sin(a*2+i*1.3)*3;points.push(new T.Vector3(cx+Math.cos(a)*(rx+r),8.4+Math.sin(a*2+i)*2.4+Math.sin(a*3+i*1.7)*.7,cz+Math.sin(a)*(rz+Math.sin(a*3+i)*.8)));}
  const curve=new T.CatmullRomCurve3(points,true,'centripetal');curve.arcLengthDivisions=768;curve.updateArcLengths();return{curve,length:curve.getLength(),speed:8.5+(i%4)*1.15,offset:i*.139+hash(i+3)*.04,sign:i%2?-1:1};});
 const pos=new T.Vector3(),next=new T.Vector3(),later=new T.Vector3(),velocity=new T.Vector3(),after=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(),worldUp=new T.Vector3(0,1,0),basis=new T.Matrix4(),desired=new T.Quaternion(),roll=new T.Quaternion(),zAxis=new T.Vector3(0,0,1);
 const triangleCount=(g:T.BufferGeometry)=>g.index?g.index.count/3:g.attributes.position.count/3;
 const trianglesPerBird=triangleCount(bodyGeometry)+[...wingGeometries.values()].reduce((n,g)=>n+triangleCount(g.inner)+triangleCount(g.outer),0);
 state.birds={count:7,source:'V158 original solid procedural geometry',body3D:true,featherThickness:.020,wingJoints:4,trianglesPerBird,totalTriangles:trianglesPerBird*7,flight:'independent constant-speed centripetal tracks / no camera anchors / time-based banking',scale:[.36,.41],speeds:tracks.map(t=>t.speed),minimumSeaHeight:5.0,maximumHeight:11.7};
 let previousTime:number|undefined;
 function point(i:number,t:number,out:T.Vector3){const path=tracks[i],u=T.MathUtils.euclideanModulo(path.offset+path.sign*t*path.speed/path.length,1);return path.curve.getPointAt(u,out);}
 function update(t=clock.value){const jump=previousTime===undefined||t<previousTime||t-previousTime>.35,dt=jump?0:Math.max(0,t-previousTime!);previousTime=t;
  for(let i=0;i<birds.length;i++){const bird=birds[i],path=tracks[i];point(i,t,pos);point(i,t+.08,next);point(i,t+.24,later);velocity.subVectors(next,pos).normalize();after.subVectors(later,next).normalize();bird.root.position.copy(pos);
   right.crossVectors(worldUp,velocity).normalize();up.crossVectors(velocity,right).normalize();basis.makeBasis(right,up,velocity);desired.setFromRotationMatrix(basis);
   const turn=velocity.clone().cross(after).y,bank=T.MathUtils.clamp(-Math.atan2(turn*path.speed,1.5),-.48,.48);roll.setFromAxisAngle(zAxis,bank);desired.multiply(roll);if(jump)bird.root.quaternion.copy(desired);else bird.root.quaternion.slerp(desired,1-Math.exp(-dt*8)).rotateTowards(desired,dt*.20);
   const climb=T.MathUtils.smoothstep(velocity.y,.02,.35),burst=T.MathUtils.smoothstep(Math.sin(t*.53+bird.phase),.56,.86),effort=Math.max(climb,burst),stroke=t*(6.8+i*.15)+bird.phase,flap=Math.sin(stroke)*(.025+.44*effort),dive=1-T.MathUtils.smoothstep(velocity.y,-.30,-.06);
   for(const wing of bird.wings){wing.inner.rotation.z=wing.side*(.035+flap);wing.inner.rotation.y=wing.side*(.025+dive*.10);wing.outer.rotation.z=wing.side*(-.08+Math.sin(stroke-.72)*(.018+.21*effort));wing.outer.rotation.y=wing.side*(.045+dive*.22);}
  }
  state.birds.time=t;state.birds.positions=birds.map(b=>b.root.position.toArray());state.birds.wingAngles=birds.map(b=>b.wings[0].inner.rotation.z);
 }
 update(0);return{update,birds:birds.map(b=>b.root),dispose(){for(const b of birds)scene.remove(b.root);bodyGeometry.dispose();for(const g of wingGeometries.values()){g.inner.dispose();g.outer.dispose();}material.dispose();}};
}
