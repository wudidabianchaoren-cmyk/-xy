import * as THREE from 'three';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {FullScreenQuad} from 'three/addons/postprocessing/Pass.js';

/** Reuse occlusion while the view is fixed; always composite the current live lighting. */
export class CachedCourtyardAO extends GTAOPass {
  refreshOcclusion=true;
  private copyQuad=new FullScreenQuad(this.copyMaterial);
  private blendQuad=new FullScreenQuad(this.blendMaterial);
  override render(renderer:THREE.WebGLRenderer,writeBuffer:THREE.WebGLRenderTarget,readBuffer:THREE.WebGLRenderTarget,deltaTime:number,maskActive:boolean){
    if(this.refreshOcclusion){super.render(renderer,writeBuffer,readBuffer,deltaTime,maskActive);return;}
    const autoClear=renderer.autoClear;renderer.autoClear=false;
    renderer.setRenderTarget(this.renderToScreen?null:writeBuffer);
    this.copyMaterial.uniforms.tDiffuse.value=readBuffer.texture;this.copyMaterial.blending=THREE.NoBlending;
    this.copyQuad.render(renderer);
    this.blendMaterial.uniforms.intensity.value=this.blendIntensity;
    this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture;this.blendQuad.render(renderer);
    renderer.autoClear=autoClear;
  }
  override dispose(){this.copyQuad.dispose();this.blendQuad.dispose();super.dispose();}
}
