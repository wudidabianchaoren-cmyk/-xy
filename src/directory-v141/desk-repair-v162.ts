import * as T from'three';
/** Replace the damaged open shade with one continuous, solid spun-metal shell. */
export function repairDeskV162(scene:T.Scene,model:T.Object3D){
 let removed=0;model.updateMatrixWorld(true);const v=new T.Vector3(),c=new T.Vector3();
 model.traverse(o=>{if(!(o instanceof T.Mesh))return;const g=o.geometry,p=g.getAttribute('position'),idx=g.index,ms=Array.isArray(o.material)?o.material:[o.material],groups=g.groups.length?[...g.groups]:[{start:0,count:idx?.count??p.count,materialIndex:0}],keep:number[]=[],next:any[]=[];
  for(const q of groups){const start=keep.length,metal=/brass|porcelain|ceramic/i.test(ms[q.materialIndex??0]?.name??'');for(let i=q.start;i<q.start+q.count;i+=3){const ids=[0,1,2].map(j=>idx?idx.getX(i+j):i+j);c.set(0,0,0);ids.forEach(j=>c.add(v.fromBufferAttribute(p,j).applyMatrix4(o.matrixWorld)));c.multiplyScalar(1/3);if(metal&&c.y>1.324&&c.y<1.538&&Math.hypot(c.x+.94,c.z+.015)<.199){removed++;continue;}keep.push(...ids);}if(keep.length>start)next.push({start,count:keep.length-start,materialIndex:q.materialIndex});}g.setIndex(keep);g.clearGroups();next.forEach(q=>g.addGroup(q.start,q.count,q.materialIndex));g.computeBoundingBox();g.computeBoundingSphere();
 });
 const brass=new T.MeshPhysicalMaterial({name:'V162 continuous spun brass opaque lamp shade',color:0x8e713e,metalness:.92,roughness:.43,clearcoat:.035,envMapIntensity:.8,side:T.DoubleSide,transmission:0,opacity:1});
 const profile=[[.190,0],[.192,.002],[.073,.200],[.071,.203],[.068,.200],[.186,.003],[.190,0]].map(p=>new T.Vector2(...p as[number,number]));
 const shade=new T.Mesh(new T.LatheGeometry(profile,128),brass);shade.name='V162 closed continuous lamp shade / no missing wedge';shade.position.set(-.94,1.33,-.015);shade.castShadow=shade.receiveShadow=true;scene.add(shade);
 for(const[r,y]of[[.19,1.332],[.071,1.532]]){const lip=new T.Mesh(new T.TorusGeometry(r,.0025,8,128),brass);lip.rotation.x=Math.PI/2;lip.position.set(-.94,y,-.015);lip.castShadow=lip.receiveShadow=true;scene.add(lip);}
 return{version:162,removedShadeTriangles:removed,segments:128,wallThickness:.003,opaque:true,potCalendarSeparation:.21};
}
