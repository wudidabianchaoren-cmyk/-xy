import{$ as v,B as O,D as y,E as M,Fa as pe,L as re,M as ae,Oa as ce,P as H,S as oe,Ta as ue,U as ne,Wa as de,Z as le,ba as z,ca as he,da as fe,fa as L,ga as V,h as K,p as q,q as J,r as Z,s as ee,t as te,u as ie,v as se}from"./chunk-TGTUO4J7.js";var I=class extends ce{constructor(e){super(e),this.type=M}parse(e){let a=function(t,o){switch(t){case 1:throw new Error("THREE.HDRLoader: Read Error: "+(o||""));case 2:throw new Error("THREE.HDRLoader: Write Error: "+(o||""));case 3:throw new Error("THREE.HDRLoader: Bad File Format: "+(o||""));default:case 4:throw new Error("THREE.HDRLoader: Memory Error: "+(o||""))}},j=function(t,o,n){o=o||1024;let u=t.pos,c=-1,s=0,d="",l=String.fromCharCode.apply(null,new Uint16Array(t.subarray(u,u+128)));for(;0>(c=l.indexOf(`
`))&&s<o&&u<t.byteLength;)d+=l,s+=l.length,u+=128,l+=String.fromCharCode.apply(null,new Uint16Array(t.subarray(u,u+128)));return-1<c?(n!==!1&&(t.pos+=s+c+1),d+l.slice(0,c)):!1},Re=function(t){let o=/^#\?(\S+)/,n=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,p=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,u=/^\s*FORMAT=(\S+)\s*$/,c=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,s={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},d,l;for((t.pos>=t.byteLength||!(d=j(t)))&&a(1,"no header found"),(l=d.match(o))||a(3,"bad initial token"),s.valid|=1,s.programtype=l[1],s.string+=d+`
`;d=j(t),d!==!1;){if(s.string+=d+`
`,d.charAt(0)==="#"){s.comments+=d+`
`;continue}if((l=d.match(n))&&(s.gamma=parseFloat(l[1])),(l=d.match(p))&&(s.exposure=parseFloat(l[1])),(l=d.match(u))&&(s.valid|=2,s.format=l[1]),(l=d.match(c))&&(s.valid|=4,s.height=parseInt(l[1],10),s.width=parseInt(l[2],10)),s.valid&2&&s.valid&4)break}return s.valid&2||a(3,"missing format specifier"),s.valid&4||a(3,"missing image size specifier"),s},Me=function(t,o,n){let p=o;if(p<8||p>32767||t[0]!==2||t[1]!==2||t[2]&128)return new Uint8Array(t);p!==(t[2]<<8|t[3])&&a(3,"wrong scanline width");let u=new Uint8Array(4*o*n);u.length||a(4,"unable to allocate buffer space");let c=0,s=0,d=4*p,l=new Uint8Array(4),w=new Uint8Array(d),Y=n;for(;Y>0&&s<t.byteLength;){s+4>t.byteLength&&a(1),l[0]=t[s++],l[1]=t[s++],l[2]=t[s++],l[3]=t[s++],(l[0]!=2||l[1]!=2||(l[2]<<8|l[3])!=p)&&a(3,"bad rgbe scanline format");let x=0,E;for(;x<d&&s<t.byteLength;){E=t[s++];let C=E>128;if(C&&(E-=128),(E===0||x+E>d)&&a(3,"bad scanline data"),C){let R=t[s++];for(let $=0;$<E;$++)w[x++]=R}else w.set(t.subarray(s,s+E),x),x+=E,s+=E}let Te=p;for(let C=0;C<Te;C++){let R=0;u[c]=w[C+R],R+=p,u[c+1]=w[C+R],R+=p,u[c+2]=w[C+R],R+=p,u[c+3]=w[C+R],c+=4}Y--}return u},Se=function(t,o,n,p){let u=t[o+3],c=Math.pow(2,u-128)/255;n[p+0]=t[o+0]*c,n[p+1]=t[o+1]*c,n[p+2]=t[o+2]*c,n[p+3]=1},we=function(t,o,n,p){let u=t[o+3],c=Math.pow(2,u-128)/255;n[p+0]=v.toHalfFloat(Math.min(t[o+0]*c,65504)),n[p+1]=v.toHalfFloat(Math.min(t[o+1]*c,65504)),n[p+2]=v.toHalfFloat(Math.min(t[o+2]*c,65504)),n[p+3]=v.toHalfFloat(1)},N=new Uint8Array(e);N.pos=0;let b=Re(N),W=b.width,X=b.height,F=Me(N.subarray(N.pos),W,X),U,k,S;switch(this.type){case y:S=F.length/4;let t=new Float32Array(S*4);for(let n=0;n<S;n++)Se(F,n*4,t,n*4);U=t,k=y;break;case M:S=F.length/4;let o=new Uint16Array(S*4);for(let n=0;n<S;n++)we(F,n*4,o,n*4);U=o,k=M;break;default:throw new Error("THREE.HDRLoader: Unsupported type: "+this.type)}return{width:W,height:X,data:U,header:b.string,gamma:b.gamma,exposure:b.exposure,type:k}}setDataType(e){return this.type=e,this}load(e,i,h,f){function r(a,m){switch(a.type){case y:case M:a.colorSpace=re,a.minFilter=O,a.magFilter=O,a.generateMipmaps=!1,a.flipY=!0;break}i&&i(a,m)}return super.load(e,r,h,f)}};var ge=class extends I{constructor(e){console.warn("RGBELoader has been deprecated. Please use HDRLoader instead."),super(e)}};var g=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},be=new ue(-1,1,1,-1,0,1),Q=class extends he{constructor(){super(),this.setAttribute("position",new z([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new z([0,2,0,0,2,0],2))}},xe=new Q,T=class{constructor(e){this._mesh=new fe(xe,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,be)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var D=class extends g{constructor(e,i="tDiffuse"){super(),this.textureID=i,this.uniforms=null,this.material=null,e instanceof V?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=L.clone(e.uniforms),this.material=new V({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new T(this.material)}render(e,i,h){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=h.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var _e={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var A=class extends g{constructor(e,i){super(),this.scene=e,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,i,h){let f=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,m;this.inverse?(a=0,m=1):(a=1,m=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(f.REPLACE,f.REPLACE,f.REPLACE),r.buffers.stencil.setFunc(f.ALWAYS,a,4294967295),r.buffers.stencil.setClear(m),r.buffers.stencil.setLocked(!0),e.setRenderTarget(h),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(f.EQUAL,1,4294967295),r.buffers.stencil.setOp(f.KEEP,f.KEEP,f.KEEP),r.buffers.stencil.setLocked(!0)}},B=class extends g{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var me=class{constructor(e,i){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),i===void 0){let h=e.getSize(new H);this._width=h.width,this._height=h.height,i=new ne(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:M}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new D(_e),this.copyPass.material.blending=K,this.clock=new de}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,i){this.passes.splice(i,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let i=this.passes.indexOf(e);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(e){for(let i=e+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let i=this.renderer.getRenderTarget(),h=!1;for(let f=0,r=this.passes.length;f<r;f++){let a=this.passes[f];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(f),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,h),a.needsSwap){if(h){let m=this.renderer.getContext(),G=this.renderer.state.buffers.stencil;G.setFunc(m.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),G.setFunc(m.EQUAL,1,4294967295)}this.swapBuffers()}A!==void 0&&(a instanceof A?h=!0:a instanceof B&&(h=!1))}}this.renderer.setRenderTarget(i)}reset(e){if(e===void 0){let i=this.renderer.getSize(new H);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,i){this._width=e,this._height=i;let h=this._width*this._pixelRatio,f=this._height*this._pixelRatio;this.renderTarget1.setSize(h,f),this.renderTarget2.setSize(h,f);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(h,f)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Ee=class extends g{constructor(e,i,h=null,f=null,r=null){super(),this.scene=e,this.camera=i,this.overrideMaterial=h,this.clearColor=f,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new le}render(e,i,h){let f=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:h),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=f}};var P={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Ce=class extends g{constructor(){super(),this.uniforms=L.clone(P.uniforms),this.material=new pe({name:P.name,uniforms:this.uniforms,vertexShader:P.vertexShader,fragmentShader:P.fragmentShader}),this._fsQuad=new T(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,i,h){this.uniforms.tDiffuse.value=h.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},oe.getTransfer(this._outputColorSpace)===ae&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===q?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===J?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Z?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ee?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ie?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===se?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===te&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};export{ge as a,_e as b,g as c,T as d,D as e,me as f,Ee as g,Ce as h};
//# sourceMappingURL=chunk-XPYU5BP2.js.map
