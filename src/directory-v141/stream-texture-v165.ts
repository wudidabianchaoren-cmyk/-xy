import * as THREE from 'three';

/** Upload unchanged source pixels a few rows per frame, so a 4K photo cannot monopolize the GPU. */
export async function streamTextureV165(renderer:THREE.WebGLRenderer,texture:THREE.Texture){
 const image=texture.image as HTMLImageElement,width=image.naturalWidth||image.width,height=image.naturalHeight||image.height,flip=texture.flipY;
 const canvas=new OffscreenCanvas(width,128),ctx=canvas.getContext('2d',{willReadFrequently:true})!;
 const source=image.currentSrc||image.src;texture.userData.originalImage=image;texture.userData.originalSource=source;
 Object.assign(texture,{isDataTexture:true,image:{data:null,width,height},flipY:false,unpackAlignment:1,generateMipmaps:false,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});texture.needsUpdate=true;
 let maxSlice=0,budgetStarted=performance.now(),yields=0;const started=performance.now();renderer.initTexture(texture);
 for(let y=0;y<height;y+=128){
  const rows=Math.min(128,height-y);canvas.height=rows;ctx.setTransform(1,0,0,flip?-1:1,0,flip?rows:0);ctx.drawImage(image,0,y,width,rows,0,0,width,rows);
  const data=ctx.getImageData(0,0,width,rows).data,tile=new THREE.DataTexture(data,width,rows,THREE.RGBAFormat,THREE.UnsignedByteType);tile.colorSpace=texture.colorSpace;tile.flipY=false;tile.generateMipmaps=false;
  const at=performance.now();renderer.copyTextureToTexture(tile,texture,null,new THREE.Vector2(0,flip?height-y-rows:y));maxSlice=Math.max(maxSlice,performance.now()-at);tile.dispose();
  // Small uploads can share a frame. Waiting a whole frame for every 128 rows
  // made unchanged textures take seconds even when each upload took <0.1 ms.
  if(performance.now()-budgetStarted>=2){yields++;await new Promise(requestAnimationFrame);budgetStarted=performance.now();}
 }
 return{mode:'unchanged pixels / 128-row tiles / 2ms cooperative budget',source:source.split('/').at(-1),width,height,maxSlice,yields,elapsed:performance.now()-started};
}
