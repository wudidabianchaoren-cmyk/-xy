import * as T from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {TexturePass} from 'three/addons/postprocessing/TexturePass.js';
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass.js';
/** Antialias the already calibrated display image. No second exposure or tone
 * transform is applied to native light-field colour. */
export function displaySMAA(renderer:T.WebGLRenderer){let frame:T.FramebufferTexture|null=null;const composer=new EffectComposer(renderer,new T.WebGLRenderTarget(1,1,{type:T.UnsignedByteType,depthBuffer:false})),copy=new TexturePass(null as any),aa=new SMAAPass();composer.addPass(copy);composer.addPass(aa);const size=new T.Vector2();
 return{render(scene:T.Scene,camera:T.Camera,afterScene?:()=>void){renderer.setRenderTarget(null);renderer.render(scene,camera);afterScene?.();renderer.getDrawingBufferSize(size);if(!frame||frame.image.width!==size.x||frame.image.height!==size.y){frame?.dispose();frame=new T.FramebufferTexture(size.x,size.y);frame.minFilter=frame.magFilter=T.LinearFilter;composer.setPixelRatio(1);composer.setSize(size.x,size.y);}renderer.copyFramebufferToTexture(frame);copy.map=frame;composer.render();},dispose(){frame?.dispose();composer.dispose();copy.dispose();aa.dispose();}};
}
