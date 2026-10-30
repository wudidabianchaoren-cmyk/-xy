import * as THREE from 'three';
/** Continuous coastline-to-inland volumes, including seaward skirts; the centre is land, never a gap. */
export function continentalVolumes(parent:THREE.Group){
 const width=26000,distances=[1100,3400,6100];
 for(let layer=0;layer<3;layer++){
  const p:number[]=[],colors:number[]=[],ix:number[]=[],Nx=768,Nz=96,depth=6100;
  for(let j=0;j<=Nz;j++)for(let i=0;i<=Nx;i++){
   const x=-width/2+width*i/Nx,coast=-distances[layer]+170*Math.sin(x*.0015+layer)+85*Math.sin(x*.0048)+28*Math.sin(x*.012);
   const inland=j/Nz*depth,z=coast-inland;
   const ridge=210+235*Math.pow(.5+.5*Math.sin(x*.0011+layer*.8),1.6)+100*Math.sin(x*.0022+z*.0006)**2;
   const hill=130*Math.sin(x*.004+z*.0018)**2+55*Math.sin(x*.008-z*.0031)**2;
   // The seaward foothills rise gradually into crossing ridges, rather than one tall, vertical skirt.
   const rise=1-Math.exp(-inland/580),crossRidge=.68+.32*Math.sin(inland*.0021+x*.0014+layer)**2;
   const valley=.20*Math.exp(-Math.pow(Math.sin(x*.0019+inland*.0007)*3.5,2));
   const y=-12+rise*(ridge+hill)*crossRidge*(1-valley)*(1+layer*.4);
   p.push(x,y,z);const color=new THREE.Color(layer===0?0x414d37:layer===1?0x586353:0x728075);color.multiplyScalar(.8+.28*rise+.12*Math.sin(x*.002+z*.001));colors.push(color.r,color.g,color.b);
   if(i<Nx&&j<Nz){const a=j*(Nx+1)+i,b=a+Nx+1;ix.push(a,a+1,b,a+1,b+1,b);}
  }
  const perimeter:number[]=[];for(let i=0;i<=Nx;i++)perimeter.push(i);for(let j=1;j<=Nz;j++)perimeter.push(j*(Nx+1)+Nx);for(let i=Nx-1;i>=0;i--)perimeter.push(Nz*(Nx+1)+i);for(let j=Nz-1;j>0;j--)perimeter.push(j*(Nx+1));
  const offset=p.length/3;for(const a of perimeter){p.push(p[a*3],-70,p[a*3+2]);colors.push(colors[a*3]*.65,colors[a*3+1]*.65,colors[a*3+2]*.65);}
  for(let i=0;i<perimeter.length;i++){const n=(i+1)%perimeter.length;ix.push(perimeter[i],offset+i,perimeter[n],perimeter[n],offset+i,offset+n);}
  const centre=p.length/3;p.push(0,-70,-distances[layer]-depth/2);colors.push(.08,.1,.07);for(let i=0;i<perimeter.length;i++)ix.push(centre,offset+(i+1)%perimeter.length,offset+i);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(ix);g.computeVertexNormals();
  // Broad mineral variation and diffuse sky bounce remain visible on the backlit slopes.
  // This is attached to the new terrain; the original 64-second lighting track is untouched.
  const normal=g.getAttribute('normal'),position=g.getAttribute('position'),color=g.getAttribute('color');
  for(let i=0;i<offset;i++){
   const nx=normal.getX(i),ny=normal.getY(i),nz=normal.getZ(i),x=position.getX(i),y=position.getY(i),z=position.getZ(i);
   const skylight=.46+.40*Math.max(0,ny)+.24*Math.max(0,nx*.62+ny*.55+nz*.56);
   const mineral=.90+.10*Math.sin(x*.007+z*.004)*Math.sin(x*.003-z*.008);
   const bare=THREE.MathUtils.smoothstep(y,210+layer*100,490+layer*150)*(1-THREE.MathUtils.smoothstep(ny,.72,.96))*.42;
   color.setXYZ(i,(color.getX(i)*(1-bare)+.29*bare)*skylight*mineral,(color.getY(i)*(1-bare)+.27*bare)*skylight*mineral,(color.getZ(i)*(1-bare)+.21*bare)*skylight*mineral);
  }
  const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.98,envMapIntensity:.025,emissive:0xffffff,emissiveIntensity:.085});
  m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n#ifdef USE_COLOR\n totalEmissiveRadiance*=vColor;\n#endif');};
  m.customProgramCacheKey=()=> 'continental-sky-bounce-v32-75';
  const mesh=new THREE.Mesh(g,m);mesh.name='Closed continent '+layer+' / rounded ridges, valleys, shoreline and submerged sides';parent.add(mesh);
 }
 return {width,distances,closedVolumes:true};
}
