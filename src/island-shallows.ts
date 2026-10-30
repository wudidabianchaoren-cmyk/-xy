import * as THREE from 'three';
/** Distance to sampled low shoreline vertices, not an ellipse around the island. */
export function islandShallows(scene:THREE.Scene,water:THREE.ShaderMaterial){
 const points:THREE.Vector3[]=[],p=new THREE.Vector3();scene.updateMatrixWorld(true);
 scene.traverse(o=>{if(o instanceof THREE.Mesh&&/V21.*solid.*inhabited/i.test(o.name+' '+o.parent?.name)){const a=o.geometry.getAttribute('position');for(let i=0;i<a.count;i+=2){p.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);if(p.y>-.8&&p.y<2.4)points.push(p.clone());}}});
 const bounds=new THREE.Box3().setFromPoints(points);bounds.expandByScalar(24);const size=bounds.getSize(new THREE.Vector3());
 const n=96,data=new Uint8Array(n*n*4),stride=Math.max(1,Math.ceil(points.length/1800));
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const wx=bounds.min.x+(x+.5)/n*size.x,wz=bounds.min.z+(y+.5)/n*size.z;let d=576;for(let i=0;i<points.length;i+=stride){const q=points[i];d=Math.min(d,(q.x-wx)**2+(q.z-wz)**2);}const a=Math.round((1-THREE.MathUtils.smoothstep(Math.sqrt(d),2,19))*255),j=(y*n+x)*4;data[j]=data[j+1]=data[j+2]=a;data[j+3]=255;}
 const texture=new THREE.DataTexture(data,n,n);texture.needsUpdate=true;texture.minFilter=texture.magFilter=THREE.LinearFilter;
 water.uniforms.coastalDepth={value:texture};water.uniforms.coastalBounds={value:new THREE.Vector4(bounds.min.x,bounds.min.z,size.x,size.z)};
 if(!water.userData.coastalShaderInstalled){water.userData.coastalShaderInstalled=true;water.fragmentShader=water.fragmentShader.replace('uniform sampler2D normalSampler;','uniform sampler2D normalSampler;uniform sampler2D coastalDepth;uniform vec4 coastalBounds;')
 .replace('gl_FragColor=vec4(outgoingLight,alpha);',`vec2 coastUV=(worldPosition.xz-coastalBounds.xy)/coastalBounds.zw;
 float coast=texture2D(coastalDepth,clamp(coastUV,0.,1.)).r*step(0.,coastUV.x)*step(0.,coastUV.y)*step(coastUV.x,1.)*step(coastUV.y,1.);
 outgoingLight=mix(outgoingLight,outgoingLight*.82+vec3(.026,.075,.053),coast*.46);gl_FragColor=vec4(outgoingLight,alpha);`);}
 return{shoreSamples:points.length,resolution:n,method:'distance to actual low shoreline vertices / muted green shallow-water attenuation'};
}
