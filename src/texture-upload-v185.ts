import * as THREE from 'three';

/** Preserve source pixels and sampler settings; bound each upload task. */
export async function uploadTextureCooperatively(renderer:THREE.WebGLRenderer,texture:THREE.Texture){
 const originalImage=texture.image,originalData=(texture as THREE.DataTexture).isDataTexture;
 const width=originalImage?.naturalWidth||originalImage?.width,height=originalImage?.naturalHeight||originalImage?.height;
 if(!width||!height||width*height<1000000||texture instanceof THREE.VideoTexture||texture instanceof THREE.CompressedTexture){renderer.initTexture(texture);return;}
 const state={source:texture.source,image:originalImage,isDataTexture:originalData,flipY:texture.flipY,unpackAlignment:texture.unpackAlignment,generateMipmaps:texture.generateMipmaps,minFilter:texture.minFilter,magFilter:texture.magFilter};
 const raw=originalImage.data as ArrayBufferView|undefined;
 if(!raw&&!(originalImage instanceof HTMLImageElement||originalImage instanceof ImageBitmap||originalImage instanceof HTMLCanvasElement)){renderer.initTexture(texture);return;}
 const channels=texture.format===THREE.RGBAFormat?4:texture.format===THREE.RGBFormat?3:0;
 if(!channels){renderer.initTexture(texture);return;}
 const canvas=!raw?new OffscreenCanvas(width,64):null,context=canvas?.getContext('2d',{willReadFrequently:true});
 // glTF texture transforms clone Texture objects while sharing their Source.
 // A temporary allocation image must never replace that shared source's pixels.
 texture.source=new THREE.Source(originalImage);
 Object.assign(texture,{isDataTexture:true,image:{data:null,width,height},flipY:false,unpackAlignment:1});texture.needsUpdate=true;
 const started=performance.now();let sliceStarted=started,yields=0,maxSlice=0;renderer.initTexture(texture);texture.generateMipmaps=false;
 for(let y=0;y<height;y+=64){
  const rows=Math.min(64,height-y);let pixels:any;
  if(raw){const values=(raw as any).subarray(y*width*channels,(y+rows)*width*channels);pixels=state.flipY?(()=>{const flipped=new (raw as any).constructor(values.length);for(let row=0;row<rows;row++)flipped.set(values.subarray(row*width*channels,(row+1)*width*channels),(rows-1-row)*width*channels);return flipped;})():values;}
  else{canvas!.height=rows;context!.setTransform(1,0,0,state.flipY?-1:1,0,state.flipY?rows:0);context!.drawImage(originalImage,0,y,width,rows,0,0,width,rows);pixels=context!.getImageData(0,0,width,rows).data;}
  const tile=new THREE.DataTexture(pixels,width,rows,texture.format,texture.type);tile.colorSpace=texture.colorSpace;tile.flipY=false;tile.generateMipmaps=false;tile.unpackAlignment=1;
  const before=performance.now();renderer.copyTextureToTexture(tile,texture,null,new THREE.Vector2(0,state.flipY?height-y-rows:y));maxSlice=Math.max(maxSlice,performance.now()-before);tile.dispose();
  if(performance.now()-sliceStarted>=2){yields++;await new Promise(requestAnimationFrame);sliceStarted=performance.now();}
 }
 texture.minFilter=state.minFilter;texture.magFilter=state.magFilter;texture.generateMipmaps=state.generateMipmaps;
 if(state.generateMipmaps){const gl=renderer.getContext(),handle=(renderer.properties.get(texture)as any).__webglTexture;gl.bindTexture(gl.TEXTURE_2D,handle);gl.generateMipmap(gl.TEXTURE_2D);renderer.resetState();}
 // A restored context must receive real source data, never the allocation-only
 // null image used while streaming. Keep the original for that recovery path.
 const restore=()=>{Object.assign(texture,state);texture.needsUpdate=true;};
 renderer.domElement.addEventListener('webglcontextrestored',restore);
 texture.addEventListener('dispose',()=>renderer.domElement.removeEventListener('webglcontextrestored',restore));
 texture.userData.cooperativeUpload={width,height,yields,maxSlice,milliseconds:performance.now()-started,sourcePixelsPreserved:true,samplerSettingsPreserved:true};
}
