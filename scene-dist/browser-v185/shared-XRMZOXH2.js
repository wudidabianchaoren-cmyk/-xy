import{b as Me,c as le,e as Te}from"./shared-NK3IH7V4.js";import{Ab as tt,B as je,Da as k,Ea as B,H as qe,K as Ge,L as Ye,M as Xe,N as ge,O as Qe,Sa as W,aa as H,ca as j,db as Je,fb as Ke,g as U,ga as $e,hb as et,i as Ze,j as ne,ja as ke,k as re,l as Fe,m as He,oa as G,sa as xe,y as F}from"./shared-LZ7QSBR5.js";async function ft(r,e){let t=e.image,s=e.isDataTexture,i=t?.naturalWidth||t?.width,a=t?.naturalHeight||t?.height;if(!i||!a||i*a<1e6||e instanceof Je||e instanceof Ke){r.initTexture(e);return}let o={source:e.source,image:t,isDataTexture:s,flipY:e.flipY,unpackAlignment:e.unpackAlignment,generateMipmaps:e.generateMipmaps,minFilter:e.minFilter,magFilter:e.magFilter},n=t.data;if(!n&&!(t instanceof HTMLImageElement||t instanceof ImageBitmap||t instanceof HTMLCanvasElement)){r.initTexture(e);return}let u=e.format===ge?4:e.format===Xe?3:0;if(!u){r.initTexture(e);return}let l=n?null:new OffscreenCanvas(i,64),D=l?.getContext("2d",{willReadFrequently:!0});e.source=new $e(t),Object.assign(e,{isDataTexture:!0,image:{data:null,width:i,height:a},flipY:!1,unpackAlignment:1}),e.needsUpdate=!0;let y=performance.now(),R=y,T=0,S=0;r.initTexture(e),e.generateMipmaps=!1;for(let c=0;c<a;c+=64){let d=Math.min(64,a-c),f;if(n){let P=n.subarray(c*i*u,(c+d)*i*u);f=o.flipY?(()=>{let E=new n.constructor(P.length);for(let g=0;g<d;g++)E.set(P.subarray(g*i*u,(g+1)*i*u),(d-1-g)*i*u);return E})():P}else l.height=d,D.setTransform(1,0,0,o.flipY?-1:1,0,o.flipY?d:0),D.drawImage(t,0,c,i,d,0,0,i,d),f=D.getImageData(0,0,i,d).data;let h=new W(f,i,d,e.format,e.type);h.colorSpace=e.colorSpace,h.flipY=!1,h.generateMipmaps=!1,h.unpackAlignment=1;let p=performance.now();r.copyTextureToTexture(h,e,null,new H(0,o.flipY?a-c-d:c)),S=Math.max(S,performance.now()-p),h.dispose(),performance.now()-R>=2&&(T++,await new Promise(requestAnimationFrame),R=performance.now())}if(e.minFilter=o.minFilter,e.magFilter=o.magFilter,e.generateMipmaps=o.generateMipmaps,o.generateMipmaps){let c=r.getContext(),d=r.properties.get(e).__webglTexture;c.bindTexture(c.TEXTURE_2D,d),c.generateMipmap(c.TEXTURE_2D),r.resetState()}let w=()=>{Object.assign(e,o),e.needsUpdate=!0};r.domElement.addEventListener("webglcontextrestored",w),e.addEventListener("dispose",()=>r.domElement.removeEventListener("webglcontextrestored",w)),e.userData.cooperativeUpload={width:i,height:a,yields:T,maxSlice:S,milliseconds:performance.now()-y,sourcePixelsPreserved:!0,samplerSettingsPreserved:!0}}var ce={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new H},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new G},cameraProjectionMatrixInverse:{value:new G},cameraWorldMatrix:{value:new G},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new j(-1,-1,-1)},sceneBoxMax:{value:new j(1,1,1)}},vertexShader:`

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
		}`},he={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
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

		}`},Se={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
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
		}`};function it(r=5){let e=Math.floor(r)%2===0?Math.floor(r)+1:Math.floor(r),t=dt(e),s=t.length,i=new Uint8Array(s*4);for(let o=0;o<s;++o){let n=t[o],u=2*Math.PI*n/s,l=new j(Math.cos(u),Math.sin(u),0).normalize();i[o*4]=(l.x*.5+.5)*255,i[o*4+1]=(l.y*.5+.5)*255,i[o*4+2]=127,i[o*4+3]=255}let a=new W(i,e,e);return a.wrapS=F,a.wrapT=F,a.needsUpdate=!0,a}function dt(r){let e=Math.floor(r)%2===0?Math.floor(r)+1:Math.floor(r),t=e*e,s=Array(t).fill(0),i=Math.floor(e/2),a=e-1;for(let o=1;o<=t;){if(i===-1&&a===e?(a=e-2,i=0):(a===e&&(a=0),i<0&&(i=e-1)),s[i*e+a]!==0){a-=2,i++;continue}else s[i*e+a]=o++;a++,i--}return s}var de={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Be(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new H},cameraProjectionMatrixInverse:{value:new G},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

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
		}`};function Be(r,e,t){let s=ut(r,e,t),i="vec3[SAMPLES](";for(let a=0;a<r;a++){let o=s[a];i+=`vec3(${o.x}, ${o.y}, ${o.z})${a<r-1?",":")"}`}return i}function ut(r,e,t){let s=[];for(let i=0;i<r;i++){let a=2*Math.PI*e*i/r,o=Math.pow(i/(r-1),t);s.push(new j(Math.cos(a),Math.sin(a),o))}return s}var Pe=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let s,i,a,o=.5*(Math.sqrt(3)-1),n=(e+t)*o,u=Math.floor(e+n),l=Math.floor(t+n),D=(3-Math.sqrt(3))/6,y=(u+l)*D,R=u-y,T=l-y,S=e-R,w=t-T,c,d;S>w?(c=1,d=0):(c=0,d=1);let f=S-c+D,h=w-d+D,p=S-1+2*D,P=w-1+2*D,E=u&255,g=l&255,_=this.perm[E+this.perm[g]]%12,m=this.perm[E+c+this.perm[g+d]]%12,v=this.perm[E+1+this.perm[g+1]]%12,x=.5-S*S-w*w;x<0?s=0:(x*=x,s=x*x*this._dot(this.grad3[_],S,w));let M=.5-f*f-h*h;M<0?i=0:(M*=M,i=M*M*this._dot(this.grad3[m],f,h));let N=.5-p*p-P*P;return N<0?a=0:(N*=N,a=N*N*this._dot(this.grad3[v],p,P)),70*(s+i+a)}noise3d(e,t,s){let i,a,o,n,l=(e+t+s)*.3333333333333333,D=Math.floor(e+l),y=Math.floor(t+l),R=Math.floor(s+l),T=1/6,S=(D+y+R)*T,w=D-S,c=y-S,d=R-S,f=e-w,h=t-c,p=s-d,P,E,g,_,m,v;f>=h?h>=p?(P=1,E=0,g=0,_=1,m=1,v=0):f>=p?(P=1,E=0,g=0,_=1,m=0,v=1):(P=0,E=0,g=1,_=1,m=0,v=1):h<p?(P=0,E=0,g=1,_=0,m=1,v=1):f<p?(P=0,E=1,g=0,_=0,m=1,v=1):(P=0,E=1,g=0,_=1,m=1,v=0);let x=f-P+T,M=h-E+T,N=p-g+T,Z=f-_+2*T,q=h-m+2*T,Y=p-v+2*T,X=f-1+3*T,Q=h-1+3*T,C=p-1+3*T,V=D&255,z=y&255,L=R&255,fe=this.perm[V+this.perm[z+this.perm[L]]]%12,pe=this.perm[V+P+this.perm[z+E+this.perm[L+g]]]%12,me=this.perm[V+_+this.perm[z+m+this.perm[L+v]]]%12,ve=this.perm[V+1+this.perm[z+1+this.perm[L+1]]]%12,A=.6-f*f-h*h-p*p;A<0?i=0:(A*=A,i=A*A*this._dot3(this.grad3[fe],f,h,p));let b=.6-x*x-M*M-N*N;b<0?a=0:(b*=b,a=b*b*this._dot3(this.grad3[pe],x,M,N));let O=.6-Z*Z-q*q-Y*Y;O<0?o=0:(O*=O,o=O*O*this._dot3(this.grad3[me],Z,q,Y));let I=.6-X*X-Q*Q-C*C;return I<0?n=0:(I*=I,n=I*I*this._dot3(this.grad3[ve],X,Q,C)),32*(i+a+o+n)}noise4d(e,t,s,i){let a=this.grad4,o=this.simplex,n=this.perm,u=(Math.sqrt(5)-1)/4,l=(5-Math.sqrt(5))/20,D,y,R,T,S,w=(e+t+s+i)*u,c=Math.floor(e+w),d=Math.floor(t+w),f=Math.floor(s+w),h=Math.floor(i+w),p=(c+d+f+h)*l,P=c-p,E=d-p,g=f-p,_=h-p,m=e-P,v=t-E,x=s-g,M=i-_,N=m>v?32:0,Z=m>x?16:0,q=v>x?8:0,Y=m>M?4:0,X=v>M?2:0,Q=x>M?1:0,C=N+Z+q+Y+X+Q,V=o[C][0]>=3?1:0,z=o[C][1]>=3?1:0,L=o[C][2]>=3?1:0,fe=o[C][3]>=3?1:0,pe=o[C][0]>=2?1:0,me=o[C][1]>=2?1:0,ve=o[C][2]>=2?1:0,A=o[C][3]>=2?1:0,b=o[C][0]>=1?1:0,O=o[C][1]>=1?1:0,I=o[C][2]>=1?1:0,We=o[C][3]>=1?1:0,De=m-V+l,Ee=v-z+l,we=x-L+l,Ce=M-fe+l,ye=m-pe+2*l,Re=v-me+2*l,_e=x-ve+2*l,Ne=M-A+2*l,Ue=m-b+3*l,Ae=v-O+3*l,be=x-I+3*l,Oe=M-We+3*l,Ie=m-1+4*l,Ve=v-1+4*l,ze=x-1+4*l,Le=M-1+4*l,$=c&255,J=d&255,K=f&255,ee=h&255,st=n[$+n[J+n[K+n[ee]]]]%32,nt=n[$+V+n[J+z+n[K+L+n[ee+fe]]]]%32,rt=n[$+pe+n[J+me+n[K+ve+n[ee+A]]]]%32,lt=n[$+b+n[J+O+n[K+I+n[ee+We]]]]%32,ct=n[$+1+n[J+1+n[K+1+n[ee+1]]]]%32,te=.6-m*m-v*v-x*x-M*M;te<0?D=0:(te*=te,D=te*te*this._dot4(a[st],m,v,x,M));let ie=.6-De*De-Ee*Ee-we*we-Ce*Ce;ie<0?y=0:(ie*=ie,y=ie*ie*this._dot4(a[nt],De,Ee,we,Ce));let ae=.6-ye*ye-Re*Re-_e*_e-Ne*Ne;ae<0?R=0:(ae*=ae,R=ae*ae*this._dot4(a[rt],ye,Re,_e,Ne));let oe=.6-Ue*Ue-Ae*Ae-be*be-Oe*Oe;oe<0?T=0:(oe*=oe,T=oe*oe*this._dot4(a[lt],Ue,Ae,be,Oe));let se=.6-Ie*Ie-Ve*Ve-ze*ze-Le*Le;return se<0?S=0:(se*=se,S=se*se*this._dot4(a[ct],Ie,Ve,ze,Le)),27*(D+y+R+T+S)}_dot(e,t,s){return e[0]*t+e[1]*s}_dot3(e,t,s,i){return e[0]*t+e[1]*s+e[2]*i}_dot4(e,t,s,i,a){return e[0]*t+e[1]*s+e[2]*i+e[3]*a}};var ue=class r extends Me{constructor(e,t,s=512,i=512,a,o,n){super(),this.width=s,this.height=i,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=it(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new ke(this.width,this.height,{type:Ge}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new B({defines:Object.assign({},ce.defines),uniforms:k.clone(ce.uniforms),vertexShader:ce.vertexShader,fragmentShader:ce.fragmentShader,blending:U,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new tt,this.normalMaterial.blending=U,this.pdMaterial=new B({defines:Object.assign({},de.defines),uniforms:k.clone(de.uniforms),vertexShader:de.vertexShader,fragmentShader:de.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new B({defines:Object.assign({},he.defines),uniforms:k.clone(he.uniforms),vertexShader:he.vertexShader,fragmentShader:he.fragmentShader,blending:U}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new B({uniforms:k.clone(Te.uniforms),vertexShader:Te.vertexShader,fragmentShader:Te.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:He,blendDst:re,blendEquation:ne,blendSrcAlpha:Fe,blendDstAlpha:re,blendEquationAlpha:ne}),this.blendMaterial=new B({uniforms:k.clone(Se.uniforms),vertexShader:Se.vertexShader,fragmentShader:Se.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Ze,blendSrc:He,blendDst:re,blendEquation:ne,blendSrcAlpha:Fe,blendDstAlpha:re,blendEquationAlpha:ne}),this._fsQuad=new le(null),this._originalClearColor=new xe,this.setGBuffer(a?a.depthTexture:void 0,a?a.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),n!==void 0&&this.updatePdMaterial(n)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new et,this.depthTexture.format=Qe,this.depthTexture.type=Ye,this.normalRenderTarget=new ke(this.width,this.height,{minFilter:je,magFilter:je,type:Ge,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let s=this.normalTexture?1:0,i=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=s,this.gtaoMaterial.defines.DEPTH_SWIZZLING=i,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=s,this.pdMaterial.defines.DEPTH_SWIZZLING=i,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Be(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,s){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case r.OUTPUT.Off:break;case r.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=s.texture,this.copyMaterial.blending=U,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case r.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=U,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case r.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=U,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case r.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case r.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=U,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case r.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=s.texture,this.copyMaterial.blending=U,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(e,t,s,i,a){e.getClearColor(this._originalClearColor);let o=e.getClearAlpha(),n=e.autoClear;e.setRenderTarget(s),e.autoClear=!1,i!=null&&(e.setClearColor(i),e.setClearAlpha(a||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=n,e.setClearColor(this._originalClearColor),e.setClearAlpha(o)}_renderOverride(e,t,s,i,a){e.getClearColor(this._originalClearColor);let o=e.getClearAlpha(),n=e.autoClear;e.setRenderTarget(s),e.autoClear=!1,i=t.clearColor||i,a=t.clearAlpha||a,i!=null&&(e.setClearColor(i),e.setClearAlpha(a||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=n,e.setClearColor(this._originalClearColor),e.setClearAlpha(o)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(s){(s.isPoints||s.isLine||s.isLine2)&&s.visible&&(s.visible=!1,t.push(s))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new Pe,s=e*e*4,i=new Uint8Array(s);for(let o=0;o<e;o++)for(let n=0;n<e;n++){let u=o,l=n;i[(o*e+n)*4]=(t.noise(u,l)*.5+.5)*255,i[(o*e+n)*4+1]=(t.noise(u+e,l)*.5+.5)*255,i[(o*e+n)*4+2]=(t.noise(u,l+e)*.5+.5)*255,i[(o*e+n)*4+3]=(t.noise(u+e,l+e)*.5+.5)*255}let a=new W(i,e,e,ge,qe);return a.wrapS=F,a.wrapT=F,a.needsUpdate=!0,a}};ue.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var at=class extends ue{refreshOcclusion=!0;copyQuad=new le(this.copyMaterial);blendQuad=new le(this.blendMaterial);render(e,t,s,i,a){if(this.refreshOcclusion){super.render(e,t,s,i,a);return}let o=e.autoClear;e.autoClear=!1,e.setRenderTarget(this.renderToScreen?null:t),this.copyMaterial.uniforms.tDiffuse.value=s.texture,this.copyMaterial.blending=U,this.copyQuad.render(e),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.blendQuad.render(e),e.autoClear=o}dispose(){this.copyQuad.dispose(),this.blendQuad.dispose(),super.dispose()}};var ot=class extends Me{constructor(e,t,s=null,i=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=s,this.clearColor=i,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new xe}render(e,t,s){let i=e.autoClear;e.autoClear=!1;let a,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}};export{ft as a,ot as b,at as c};
//# sourceMappingURL=shared-XRMZOXH2.js.map
