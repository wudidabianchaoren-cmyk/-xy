import * as THREE from 'three';
/** The original lettering occupied a thin coplanar bronze batch. Preserve its location,
 * replace only those triangles with projected typography, independent of surface lighting. */
export function replaceCourtyardInscription(root:THREE.Group){
 root.updateMatrixWorld(true);
 root.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const g=o.geometry,p=g.getAttribute('position'),idx=g.index,keep:number[]=[];let removed=0;const v=new THREE.Vector3();
 const inText=(i:number)=>{v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);return v.x>1.7&&v.x<12&&v.y>8.60&&v.y<10&&v.z>-12&&v.z<-8;};
 for(let i=0;i<(idx?.count??p.count);i+=3){const a=idx?idx.getX(i):i,b=idx?idx.getX(i+1):i+1,c=idx?idx.getX(i+2):i+2;if(inText(a)&&inText(b)&&inText(c))removed++;else keep.push(a,b,c);}if(removed){o.geometry=g.clone();o.geometry.setIndex(keep);o.geometry.computeBoundingSphere();}
 });
}
