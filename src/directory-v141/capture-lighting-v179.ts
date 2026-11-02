import * as T from 'three';

function base64(bytes:Uint8Array){let s='';for(let i=0;i<bytes.length;i+=32768)s+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(s);}

/** Local authoring only: retain a genuine UE frame and this same scene's visibility.
 * No UE map, source mesh, input texture or renderer setting is saved or modified.
 */
export async function captureLightingV179(renderer:T.WebGLRenderer,scene:T.Scene,sourceCamera:T.PerspectiveCamera,video:HTMLVideoElement,expectedScene:'room'|'myth'='room'){
 if(!video?.videoWidth||video.readyState<2)throw Error('A real native video frame is required');
 const guard=()=>{
  const native=(window as any).__portfolioNativeHubV167?.native;
  const direction=new T.Vector3().fromArray(native?.target||[0,0,0]).sub(new T.Vector3().fromArray(native?.appliedCamera||[0,0,0])).normalize();
  if(native?.scene!==expectedScene||!native.appliedCamera?.every((v:number,i:number)=>Math.abs(v-sourceCamera.position.getComponent(i))<.003)||direction.dot(sourceCamera.getWorldDirection(new T.Vector3()))<.999999)throw Error('Native scene/camera identity has not settled; stale frames must not be baked');
  return native;
 };guard();
 const image=document.createElement('canvas');image.width=video.videoWidth;image.height=video.videoHeight;const context=image.getContext('2d',{willReadFrequently:true})!,samples:Uint8ClampedArray[]=[],frameTimes:number[]=[];
 // Remove transient rain and temporal noise from the static lighting record.
 // The source images are untouched; the generated texture is a median of real frames.
 for(let i=0;i<3;i++){if(i)await new Promise(resolve=>setTimeout(resolve,180));await new Promise<void>(resolve=>video.requestVideoFrameCallback(()=>resolve()));context.drawImage(video,0,0);samples.push(context.getImageData(0,0,image.width,image.height).data);frameTimes.push(video.currentTime);}
 const median=context.createImageData(image.width,image.height);for(let i=0;i<median.data.length;i++){const a=samples[0][i],b=samples[1][i],c=samples[2][i];median.data[i]=a+b+c-Math.min(a,b,c)-Math.max(a,b,c);}context.putImageData(median,0,0);const native=guard();
 const camera=sourceCamera.clone();camera.aspect=image.width/image.height;camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
 const width=image.width,height=image.height,pixels=new Uint8Array(width*height*4);
 const target=new T.WebGLRenderTarget(width,height,{type:T.UnsignedByteType,format:T.RGBAFormat,minFilter:T.NearestFilter,magFilter:T.NearestFilter,depthBuffer:true});
 const previous={target:renderer.getRenderTarget(),override:scene.overrideMaterial,background:scene.background,color:renderer.getClearColor(new T.Color()),alpha:renderer.getClearAlpha(),autoClear:renderer.autoClear,shadows:renderer.shadowMap.enabled};
 const hidden:T.Object3D[]=[],replaced:{mesh:T.Mesh;material:T.Material|T.Material[];before:T.Mesh['onBeforeRender']}[]=[],depths:T.Material[]=[];
 scene.traverse(object=>{
  if(!(object instanceof T.Mesh||object instanceof T.Points||object instanceof T.LineSegments))return;
  const mats=Array.isArray(object.material)?object.material:[object.material];
  if(object.visible&&!object.userData.nativeLightingSurface&&mats.some(m=>m.transparent||!m.depthWrite)){hidden.push(object);object.visible=false;return;}
  if(!(object instanceof T.Mesh))return;
  replaced.push({mesh:object,material:object.material,before:object.onBeforeRender});if(object.userData.coastalWater)object.onBeforeRender=()=>{};
  const next=mats.map(old=>{
   const original=old as T.MeshStandardMaterial;
   const depth=object.customDepthMaterial instanceof T.MeshDepthMaterial?object.customDepthMaterial.clone():new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,side:old.side,map:old.alphaTest>0?original.map:null,alphaMap:original.alphaMap||null,alphaTest:old.alphaTest,displacementMap:original.displacementMap||null,displacementScale:original.displacementScale??1,displacementBias:original.displacementBias??0});
   depth.depthPacking=T.RGBADepthPacking;depth.toneMapped=false;
   if(object.customDepthMaterial)depth.onBeforeCompile=object.customDepthMaterial.onBeforeCompile;
   else if(original.alphaMap&&!old.userData.materialFamily){const hook=old.onBeforeCompile;depth.onBeforeCompile=(shader,r)=>{const fragment=shader.fragmentShader;hook.call(depth,shader,r);shader.fragmentShader=fragment;};}
   depths.push(depth);return depth;
  });object.material=Array.isArray(object.material)?next:next[0];
 });
 try{
  scene.overrideMaterial=null;scene.background=null;renderer.shadowMap.enabled=false;renderer.autoClear=true;renderer.setClearColor(0xffffff,1);renderer.setRenderTarget(target);renderer.clear();renderer.render(scene,camera);renderer.readRenderTargetPixels(target,0,0,width,height,pixels);
 }finally{
  hidden.forEach(o=>o.visible=true);replaced.forEach(({mesh,material,before})=>{mesh.material=material;mesh.onBeforeRender=before;});scene.overrideMaterial=previous.override;scene.background=previous.background;renderer.shadowMap.enabled=previous.shadows;renderer.setRenderTarget(previous.target);renderer.setClearColor(previous.color,previous.alpha);renderer.autoClear=previous.autoClear;target.dispose();depths.forEach(m=>m.dispose());
 }
 const direction=camera.getWorldDirection(new T.Vector3());
 return{image:image.toDataURL('image/png'),depth:base64(pixels),width:image.width,height:image.height,depthWidth:width,depthHeight:height,near:camera.near,far:camera.far,fov:camera.fov,position:camera.position.toArray(),direction:direction.toArray(),viewProjection:new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).toArray(),depthFormat:'RGBA packed perspective depth / bottom-up / alpha-tested geometry / no colorspace transform',threeRevision:T.REVISION,nativeFrameTime:video.currentTime,nativeFrameTimes:frameTimes,medianSamples:3,sourceScene:native.scene,sourceAppliedCamera:native.appliedCamera,sourceTarget:native.target,sourceTimestamp:native.at};
}
