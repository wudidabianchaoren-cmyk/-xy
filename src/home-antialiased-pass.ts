import * as THREE from 'three';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
/** Resolve the scene's geometric edges once; AO and grading do not need multisampled buffers. */
export class HomeAntialiasedPass extends RenderPass {
 private colour=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,samples:0});
 private resolve=new FullScreenQuad(new THREE.ShaderMaterial({uniforms:{map:{value:null}},vertexShader:'varying vec2 p;void main(){p=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform sampler2D map;varying vec2 p;void main(){gl_FragColor=texture2D(map,p);}',depthTest:false,depthWrite:false}));
 override setSize(width:number,height:number){this.colour.setSize(width,height);}
 setSamples(samples:number){if(this.colour.samples===samples)return;this.colour.samples=samples;this.colour.dispose();}
 override render(renderer:THREE.WebGLRenderer,write:THREE.WebGLRenderTarget,read:THREE.WebGLRenderTarget,delta:number,mask:boolean){
  super.render(renderer,write,this.colour,delta,mask);
  const material=this.resolve.material as THREE.ShaderMaterial;material.uniforms.map.value=this.colour.texture;
  renderer.setRenderTarget(read);this.resolve.render(renderer);
 }
 override dispose(){this.colour.dispose();this.resolve.dispose();super.dispose();}
}
