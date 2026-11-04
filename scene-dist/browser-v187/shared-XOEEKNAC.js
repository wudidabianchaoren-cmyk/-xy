import{b as Se,c as he,e as Pe}from"./shared-DOUVESOF.js";import{A as H,Cb as ot,D as Ge,Fa as Y,Ga as Z,J as Qe,M as Be,N as $e,O as Je,P as Me,Q as Ke,Ua as q,ca as G,ea as B,fb as tt,g as A,hb as it,i as Xe,ia as et,j as le,jb as at,k as ce,l as ke,la as We,m as He,qa as W,ua as Te}from"./shared-CM3ENQPL.js";var k=null,mt=0,X=new Map;function st(r){k?.terminate(),k=null;for(let e of X.values())clearTimeout(e.timer),e.reject(r);X.clear()}async function Ye(r,e,t){if(!k){let i="onmessage=event=>{const{id,image,width,height}=event.data;try{const canvas=new OffscreenCanvas(width,height),context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);const pixels=context.getImageData(0,0,width,height).data;image.close();postMessage({id,pixels:pixels.buffer},[pixels.buffer]);}catch(error){postMessage({id,error:String(error)});}};",s=URL.createObjectURL(new Blob([i],{type:"text/javascript"}));try{k=new Worker(s)}finally{URL.revokeObjectURL(s)}k.onmessage=n=>{let p=X.get(n.data.id);p&&(X.delete(n.data.id),clearTimeout(p.timer),n.data.error?p.reject(Error(n.data.error)):p.resolve(new Uint8Array(n.data.pixels)))},k.onerror=()=>st(Error("Texture pixel worker failed"))}let a=await createImageBitmap(r,{premultiplyAlpha:"none",colorSpaceConversion:"none"}),o=++mt;return new Promise((i,s)=>{let n=setTimeout(()=>st(Error("Texture pixel worker deadline")),8e3);X.set(o,{resolve:i,reject:s,timer:n});try{k.postMessage({id:o,image:a,width:e,height:t},[a])}catch(p){X.delete(o),clearTimeout(n),a.close(),s(p)}})}typeof window<"u"&&new URLSearchParams(location.search).has("texturePixelAudit186")&&(window.texturePixels186=Ye);var nt=new WeakMap;async function St(r,e,t=!1){let a=e.image,o=e.isDataTexture,i=a?.naturalWidth||a?.width,s=a?.naturalHeight||a?.height;if(!i||!s||i*s<1e6||e instanceof tt||e instanceof it){r.initTexture(e);return}let n={source:e.source,image:a,isDataTexture:o,flipY:e.flipY,unpackAlignment:e.unpackAlignment,generateMipmaps:e.generateMipmaps,minFilter:e.minFilter,magFilter:e.magFilter},p=[e.wrapS,e.wrapT,e.wrapR||0,e.magFilter,e.minFilter,e.anisotropy,e.internalFormat,e.format,e.type,e.generateMipmaps,e.premultiplyAlpha,e.flipY,e.unpackAlignment,e.colorSpace].join("/"),l=nt.get(r);t&&!l&&(l=new WeakMap,nt.set(r,l));let D=t?l?.get(a)?.get(p):null,R=()=>{Object.assign(e,n),e.needsUpdate=!0},b=()=>{r.domElement.addEventListener("webglcontextrestored",R),e.addEventListener("dispose",()=>r.domElement.removeEventListener("webglcontextrestored",R))};if(D){e.source=D,Object.assign(e,{isDataTexture:!0,flipY:!1,unpackAlignment:1}),r.initTexture(e),b(),e.userData.cooperativeUpload={width:i,height:s,reusedSource:!0,sourcePixelsPreserved:!0,samplerSettingsPreserved:!0};return}let d=a.data,E=!1;if(!d&&!(a instanceof HTMLImageElement||a instanceof ImageBitmap||a instanceof HTMLCanvasElement)){r.initTexture(e);return}let v=e.format===Me?4:e.format===Je?3:0;if(!v){r.initTexture(e);return}if(t&&!d&&v===4&&typeof Worker<"u"&&typeof OffscreenCanvas<"u")try{d=await Ye(a,i,s),E=!0}catch{}let _=d?null:new OffscreenCanvas(i,64),C=_?.getContext("2d",{willReadFrequently:!0});e.source=new et(a),Object.assign(e,{isDataTexture:!0,image:{data:null,width:i,height:s},flipY:!1,unpackAlignment:1}),e.needsUpdate=!0;let M=performance.now(),T=M,g=0,S=0;r.initTexture(e),e.generateMipmaps=!1;let P=t&&d?Math.max(16,Math.min(256,Math.floor(2097152/(i*v*(d.BYTES_PER_ELEMENT||1))))):64;for(let c=0;c<s;){let u=Math.min(P,s-c),f;if(d){let y=d.subarray(c*i*v,(c+u)*i*v);f=n.flipY?(()=>{let N=new d.constructor(y.length);for(let U=0;U<u;U++)N.set(y.subarray(U*i*v,(U+1)*i*v),(u-1-U)*i*v);return N})():y}else _.height=u,C.setTransform(1,0,0,n.flipY?-1:1,0,n.flipY?u:0),C.drawImage(a,0,c,i,u,0,0,i,u),f=C.getImageData(0,0,i,u).data;let h=new q(f,i,u,e.format,e.type);h.colorSpace=e.colorSpace,h.flipY=!1,h.generateMipmaps=!1,h.unpackAlignment=1;let x=performance.now();r.copyTextureToTexture(h,e,null,new G(0,n.flipY?s-c-u:c));let m=performance.now()-x;S=Math.max(S,m),h.dispose(),c+=u,t&&d&&m>4&&(P=Math.max(16,Math.floor(P/2))),performance.now()-T>=2&&(g++,await new Promise(requestAnimationFrame),T=performance.now())}if(e.minFilter=n.minFilter,e.magFilter=n.magFilter,e.generateMipmaps=n.generateMipmaps,n.generateMipmaps){let c=r.getContext(),u=r.properties.get(e).__webglTexture;c.bindTexture(c.TEXTURE_2D,u),c.generateMipmap(c.TEXTURE_2D),r.resetState()}if(t){let c=l.get(a);c||(c=new Map,l.set(a,c)),c.set(p,e.source)}b(),e.userData.cooperativeUpload={width:i,height:s,yields:g,maxSlice:S,workerPixels:E,milliseconds:performance.now()-M,sourcePixelsPreserved:!0,samplerSettingsPreserved:!0}}var de={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new G},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new W},cameraProjectionMatrixInverse:{value:new W},cameraWorldMatrix:{value:new W},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new B(-1,-1,-1)},sceneBoxMax:{value:new B(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);
			if (depth >= 1.0) {
				discard;
				return;
			}
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},ue={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Ee={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function rt(r=5){let e=Math.floor(r)%2===0?Math.floor(r)+1:Math.floor(r),t=gt(e),a=t.length,o=new Uint8Array(a*4);for(let s=0;s<a;++s){let n=t[s],p=2*Math.PI*n/a,l=new B(Math.cos(p),Math.sin(p),0).normalize();o[s*4]=(l.x*.5+.5)*255,o[s*4+1]=(l.y*.5+.5)*255,o[s*4+2]=127,o[s*4+3]=255}let i=new q(o,e,e);return i.wrapS=H,i.wrapT=H,i.needsUpdate=!0,i}function gt(r){let e=Math.floor(r)%2===0?Math.floor(r)+1:Math.floor(r),t=e*e,a=Array(t).fill(0),o=Math.floor(e/2),i=e-1;for(let s=1;s<=t;){if(o===-1&&i===e?(i=e-2,o=0):(i===e&&(i=0),o<0&&(o=e-1)),a[o*e+i]!==0){i-=2,o++;continue}else a[o*e+i]=s++;i++,o--}return a}var fe={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Ze(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new G},cameraProjectionMatrixInverse:{value:new W},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Ze(r,e,t){let a=xt(r,e,t),o="vec3[SAMPLES](";for(let i=0;i<r;i++){let s=a[i];o+=`vec3(${s.x}, ${s.y}, ${s.z})${i<r-1?",":")"}`}return o}function xt(r,e,t){let a=[];for(let o=0;o<r;o++){let i=2*Math.PI*e*o/r,s=Math.pow(o/(r-1),t);a.push(new B(Math.cos(i),Math.sin(i),s))}return a}var De=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let a,o,i,s=.5*(Math.sqrt(3)-1),n=(e+t)*s,p=Math.floor(e+n),l=Math.floor(t+n),D=(3-Math.sqrt(3))/6,R=(p+l)*D,b=p-R,d=l-R,E=e-b,v=t-d,_,C;E>v?(_=1,C=0):(_=0,C=1);let M=E-_+D,T=v-C+D,g=E-1+2*D,S=v-1+2*D,P=p&255,c=l&255,u=this.perm[P+this.perm[c]]%12,f=this.perm[P+_+this.perm[c+C]]%12,h=this.perm[P+1+this.perm[c+1]]%12,x=.5-E*E-v*v;x<0?a=0:(x*=x,a=x*x*this._dot(this.grad3[u],E,v));let m=.5-M*M-T*T;m<0?o=0:(m*=m,o=m*m*this._dot(this.grad3[f],M,T));let y=.5-g*g-S*S;return y<0?i=0:(y*=y,i=y*y*this._dot(this.grad3[h],g,S)),70*(a+o+i)}noise3d(e,t,a){let o,i,s,n,l=(e+t+a)*.3333333333333333,D=Math.floor(e+l),R=Math.floor(t+l),b=Math.floor(a+l),d=1/6,E=(D+R+b)*d,v=D-E,_=R-E,C=b-E,M=e-v,T=t-_,g=a-C,S,P,c,u,f,h;M>=T?T>=g?(S=1,P=0,c=0,u=1,f=1,h=0):M>=g?(S=1,P=0,c=0,u=1,f=0,h=1):(S=0,P=0,c=1,u=1,f=0,h=1):T<g?(S=0,P=0,c=1,u=0,f=1,h=1):M<g?(S=0,P=1,c=0,u=0,f=1,h=1):(S=0,P=1,c=0,u=1,f=1,h=0);let x=M-S+d,m=T-P+d,y=g-c+d,N=M-u+2*d,U=T-f+2*d,Q=g-h+2*d,$=M-1+3*d,J=T-1+3*d,w=g-1+3*d,z=D&255,F=R&255,j=b&255,me=this.perm[z+this.perm[F+this.perm[j]]]%12,ve=this.perm[z+S+this.perm[F+P+this.perm[j+c]]]%12,ge=this.perm[z+u+this.perm[F+f+this.perm[j+h]]]%12,xe=this.perm[z+1+this.perm[F+1+this.perm[j+1]]]%12,O=.6-M*M-T*T-g*g;O<0?o=0:(O*=O,o=O*O*this._dot3(this.grad3[me],M,T,g));let I=.6-x*x-m*m-y*y;I<0?i=0:(I*=I,i=I*I*this._dot3(this.grad3[ve],x,m,y));let L=.6-N*N-U*U-Q*Q;L<0?s=0:(L*=L,s=L*L*this._dot3(this.grad3[ge],N,U,Q));let V=.6-$*$-J*J-w*w;return V<0?n=0:(V*=V,n=V*V*this._dot3(this.grad3[xe],$,J,w)),32*(o+i+s+n)}noise4d(e,t,a,o){let i=this.grad4,s=this.simplex,n=this.perm,p=(Math.sqrt(5)-1)/4,l=(5-Math.sqrt(5))/20,D,R,b,d,E,v=(e+t+a+o)*p,_=Math.floor(e+v),C=Math.floor(t+v),M=Math.floor(a+v),T=Math.floor(o+v),g=(_+C+M+T)*l,S=_-g,P=C-g,c=M-g,u=T-g,f=e-S,h=t-P,x=a-c,m=o-u,y=f>h?32:0,N=f>x?16:0,U=h>x?8:0,Q=f>m?4:0,$=h>m?2:0,J=x>m?1:0,w=y+N+U+Q+$+J,z=s[w][0]>=3?1:0,F=s[w][1]>=3?1:0,j=s[w][2]>=3?1:0,me=s[w][3]>=3?1:0,ve=s[w][0]>=2?1:0,ge=s[w][1]>=2?1:0,xe=s[w][2]>=2?1:0,O=s[w][3]>=2?1:0,I=s[w][0]>=1?1:0,L=s[w][1]>=1?1:0,V=s[w][2]>=1?1:0,qe=s[w][3]>=1?1:0,we=f-z+l,ye=h-F+l,Ce=x-j+l,Re=m-me+l,_e=f-ve+2*l,be=h-ge+2*l,Ue=x-xe+2*l,Ae=m-O+2*l,Ne=f-I+3*l,Oe=h-L+3*l,Ie=x-V+3*l,Le=m-qe+3*l,Ve=f-1+4*l,ze=h-1+4*l,Fe=x-1+4*l,je=m-1+4*l,K=_&255,ee=C&255,te=M&255,ie=T&255,ht=n[K+n[ee+n[te+n[ie]]]]%32,dt=n[K+z+n[ee+F+n[te+j+n[ie+me]]]]%32,ut=n[K+ve+n[ee+ge+n[te+xe+n[ie+O]]]]%32,ft=n[K+I+n[ee+L+n[te+V+n[ie+qe]]]]%32,pt=n[K+1+n[ee+1+n[te+1+n[ie+1]]]]%32,ae=.6-f*f-h*h-x*x-m*m;ae<0?D=0:(ae*=ae,D=ae*ae*this._dot4(i[ht],f,h,x,m));let oe=.6-we*we-ye*ye-Ce*Ce-Re*Re;oe<0?R=0:(oe*=oe,R=oe*oe*this._dot4(i[dt],we,ye,Ce,Re));let se=.6-_e*_e-be*be-Ue*Ue-Ae*Ae;se<0?b=0:(se*=se,b=se*se*this._dot4(i[ut],_e,be,Ue,Ae));let ne=.6-Ne*Ne-Oe*Oe-Ie*Ie-Le*Le;ne<0?d=0:(ne*=ne,d=ne*ne*this._dot4(i[ft],Ne,Oe,Ie,Le));let re=.6-Ve*Ve-ze*ze-Fe*Fe-je*je;return re<0?E=0:(re*=re,E=re*re*this._dot4(i[pt],Ve,ze,Fe,je)),27*(D+R+b+d+E)}_dot(e,t,a){return e[0]*t+e[1]*a}_dot3(e,t,a,o){return e[0]*t+e[1]*a+e[2]*o}_dot4(e,t,a,o,i){return e[0]*t+e[1]*a+e[2]*o+e[3]*i}};var pe=class r extends Se{constructor(e,t,a=512,o=512,i,s,n){super(),this.width=a,this.height=o,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=rt(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new We(this.width,this.height,{type:Be}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new Z({defines:Object.assign({},de.defines),uniforms:Y.clone(de.uniforms),vertexShader:de.vertexShader,fragmentShader:de.fragmentShader,blending:A,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new ot,this.normalMaterial.blending=A,this.pdMaterial=new Z({defines:Object.assign({},fe.defines),uniforms:Y.clone(fe.uniforms),vertexShader:fe.vertexShader,fragmentShader:fe.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new Z({defines:Object.assign({},ue.defines),uniforms:Y.clone(ue.uniforms),vertexShader:ue.vertexShader,fragmentShader:ue.fragmentShader,blending:A}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Z({uniforms:Y.clone(Pe.uniforms),vertexShader:Pe.vertexShader,fragmentShader:Pe.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:He,blendDst:ce,blendEquation:le,blendSrcAlpha:ke,blendDstAlpha:ce,blendEquationAlpha:le}),this.blendMaterial=new Z({uniforms:Y.clone(Ee.uniforms),vertexShader:Ee.vertexShader,fragmentShader:Ee.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Xe,blendSrc:He,blendDst:ce,blendEquation:le,blendSrcAlpha:ke,blendDstAlpha:ce,blendEquationAlpha:le}),this._fsQuad=new he(null),this._originalClearColor=new Te,this.setGBuffer(i?i.depthTexture:void 0,i?i.normalTexture:void 0),s!==void 0&&this.updateGtaoMaterial(s),n!==void 0&&this.updatePdMaterial(n)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new at,this.depthTexture.format=Ke,this.depthTexture.type=$e,this.normalRenderTarget=new We(this.width,this.height,{minFilter:Ge,magFilter:Ge,type:Be,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let a=this.normalTexture?1:0,o=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=a,this.gtaoMaterial.defines.DEPTH_SWIZZLING=o,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=a,this.pdMaterial.defines.DEPTH_SWIZZLING=o,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Ze(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,a){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case r.OUTPUT.Off:break;case r.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=a.texture,this.copyMaterial.blending=A,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case r.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=A,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case r.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=A,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case r.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case r.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=A,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case r.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=a.texture,this.copyMaterial.blending=A,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(e,t,a,o,i){e.getClearColor(this._originalClearColor);let s=e.getClearAlpha(),n=e.autoClear;e.setRenderTarget(a),e.autoClear=!1,o!=null&&(e.setClearColor(o),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=n,e.setClearColor(this._originalClearColor),e.setClearAlpha(s)}_renderOverride(e,t,a,o,i){e.getClearColor(this._originalClearColor);let s=e.getClearAlpha(),n=e.autoClear;e.setRenderTarget(a),e.autoClear=!1,o=t.clearColor||o,i=t.clearAlpha||i,o!=null&&(e.setClearColor(o),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=n,e.setClearColor(this._originalClearColor),e.setClearAlpha(s)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(a){(a.isPoints||a.isLine||a.isLine2)&&a.visible&&(a.visible=!1,t.push(a))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new De,a=e*e*4,o=new Uint8Array(a);for(let s=0;s<e;s++)for(let n=0;n<e;n++){let p=s,l=n;o[(s*e+n)*4]=(t.noise(p,l)*.5+.5)*255,o[(s*e+n)*4+1]=(t.noise(p+e,l)*.5+.5)*255,o[(s*e+n)*4+2]=(t.noise(p,l+e)*.5+.5)*255,o[(s*e+n)*4+3]=(t.noise(p+e,l+e)*.5+.5)*255}let i=new q(o,e,e,Me,Qe);return i.wrapS=H,i.wrapT=H,i.needsUpdate=!0,i}};pe.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var lt=class extends pe{refreshOcclusion=!0;copyQuad=new he(this.copyMaterial);blendQuad=new he(this.blendMaterial);render(e,t,a,o,i){if(this.refreshOcclusion){super.render(e,t,a,o,i);return}let s=e.autoClear;e.autoClear=!1,e.setRenderTarget(this.renderToScreen?null:t),this.copyMaterial.uniforms.tDiffuse.value=a.texture,this.copyMaterial.blending=A,this.copyQuad.render(e),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.blendQuad.render(e),e.autoClear=s}dispose(){this.copyQuad.dispose(),this.blendQuad.dispose(),super.dispose()}};var ct=class extends Se{constructor(e,t,a=null,o=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=a,this.clearColor=o,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Te}render(e,t,a){let o=e.autoClear;e.autoClear=!1;let i,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=o}};export{St as a,ct as b,lt as c};
//# sourceMappingURL=shared-XOEEKNAC.js.map
