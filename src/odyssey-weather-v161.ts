import * as THREE from 'three';
type Clock={value:number};
export const northwestWind=new THREE.Vector3(.7071,0,.7071);
export function sailWind(material:THREE.MeshStandardMaterial,time:Clock){
 material.side=THREE.DoubleSide;const old=material.onBeforeCompile;
 material.onBeforeCompile=(s,r)=>{old.call(material,s,r);s.uniforms.windTime=time;s.uniforms.windDirection={value:northwestWind};s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float windTime;uniform vec3 windDirection;attribute vec2 sailWindUV;');s.vertexShader=s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
  float edgePin=pow(max(0.,sin(clamp(sailWindUV.x,0.,1.)*3.14159265)),.8)*max(0.,sin(clamp(sailWindUV.y,0.,1.)*3.14159265));
  edgePin*=1.-exp(-pow((sailWindUV.x-.5)*13.,2.));
  float pressure=1.05+.24*sin(windTime*.63)+.10*sin(windTime*1.19);
  float flutter=.035*sin(windTime*2.1+position.y*2.2+position.x*.7);
  transformed+=windDirection*edgePin*(0.48*pressure+flutter);
  transformed.y-=edgePin*.025*(1.+sin(windTime*.63));`);};material.customProgramCacheKey=()=> 'v144-restrained-sail-billowing';
}
export function foliageWind(material:THREE.MeshStandardMaterial,time:Clock,index:number){
 const old=material.onBeforeCompile,key=material.customProgramCacheKey();material.onBeforeCompile=(s,r)=>{old.call(material,s,r);s.uniforms.woodlandTime=time;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float woodlandTime;');s.vertexShader=s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
  vec3 treeAnchor=instanceMatrix[3].xyz;float crown=smoothstep(.35,4.,position.y);
  float sway=sin(woodlandTime*.63-treeAnchor.x*.06-treeAnchor.z*.06)*crown*${index===2?'.055':'.020'};
  float flutter=${index===2?'.009*sin(woodlandTime*2.1+position.x*7.+position.z*6.)':'0.'};
  transformed.x+=(sway+flutter)*.7071;transformed.z+=(sway+flutter)*.7071;`);};material.customProgramCacheKey=()=>key+' / northwest-wind-v139';
}
export function dayNight(scene:THREE.Scene,renderer:THREE.WebGLRenderer,sun:THREE.DirectionalLight,ambient:THREE.HemisphereLight,sky:THREE.ShaderMaterial,water:THREE.Mesh,boat:THREE.Group,house:number[],state:any){
 const factor={value:0},moonDirection=new THREE.Vector3(-.38,.68,-.62).normalize(),dayDirection=sun.position.clone().sub(sun.target.position).normalize(),dayColor=sun.color.clone(),moonColor=new THREE.Color(0xabc8e5);let target=0;const dayPower=sun.intensity,dayAmbient=ambient.intensity,daySky=ambient.color.clone(),dayGround=ambient.groundColor.clone();
 sky.uniforms.nightFactor=factor;sky.fragmentShader=sky.fragmentShader.replace('uniform float time;','uniform float time;uniform float nightFactor;');sky.fragmentShader=sky.fragmentShader.replace('gl_FragColor=vec4(sky,1.);',`vec2 starUV=vec2(atan(d.z,d.x)/6.2831853+.5,asin(clamp(d.y,-1.,1.))/3.14159265+.5)*vec2(1100.,550.);vec2 starCell=floor(starUV);float starSeed=hash(starCell);float stars=pow(max(0.,1.-length(fract(starUV)-.5)*2.6),3.)*step(.996,starSeed)*smoothstep(.02,.4,d.y);
  vec3 nightSky=mix(vec3(.004,.010,.023),vec3(.025,.044,.069),h);nightSky=mix(nightSky,vec3(.008,.015,.025),mass*.50);nightSky+=vec3(.55,.65,.80)*stars*(.85+.15*sin(time*.7+starSeed*30.));
  vec3 moonDirection=normalize(vec3(-.38,.68,-.62));float moonDot=dot(d,moonDirection);float moon=smoothstep(.99986,.99996,moonDot);float lunarDetail=.75+.25*fbm(d.xz*600.);nightSky+=vec3(.80,.87,1.0)*moon*lunarDetail*1.6;nightSky+=vec3(.05,.08,.12)*pow(max(moonDot,0.),1500.);
  sky=mix(sky,nightSky,nightFactor);gl_FragColor=vec4(sky,1.);`);
 const baked:{m:THREE.MeshBasicMaterial;c:THREE.Color}[]=[],seen=new Set<THREE.Material>();scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m instanceof THREE.MeshBasicMaterial&&!seen.has(m)){seen.add(m);baked.push({m,c:m.color.clone()});}}});
 const lampMaterials:THREE.MeshBasicMaterial[]=[],lights:THREE.PointLight[]=[],glassMaterials:THREE.MeshBasicMaterial[]=[];
 const brass=new THREE.MeshStandardMaterial({color:0x4b3b24,metalness:.75,roughness:.48});
 for(const x of [-8.2,9.4]){
  const lantern=new THREE.Group();lantern.position.set(x,2.50,8.2);boat.add(lantern);
  const flame=new THREE.MeshBasicMaterial({name:'V139 ship lantern flame',color:0xffbd67,transparent:true,opacity:0});lampMaterials.push(flame);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(.052,12,8),flame);lantern.add(bulb);
  for(const y of [-.13,.13]){const cap=new THREE.Mesh(new THREE.CylinderGeometry(.11,.10,.035,12),brass);cap.position.y=y;lantern.add(cap);}
  for(const [x,z]of [[-.08,-.06],[-.08,.06],[.08,-.06],[.08,.06]]){const bar=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.26,6),brass);bar.position.set(x,0,z);lantern.add(bar);}
  const light=new THREE.PointLight(0xffba70,0,10,2);light.position.y=.01;lantern.add(light);lights.push(light);
 }
 const[hx,hy,hz]=house;
 for(const side of [-1,1]){
  const glow=new THREE.MeshBasicMaterial({name:'V139 warm light through cottage shutters',color:0xffc885,transparent:true,opacity:0,depthWrite:false});glassMaterials.push(glow);
  for(let j=0;j<5;j++){const slit=new THREE.Mesh(new THREE.PlaneGeometry(.82,.032),glow);slit.rotation.y=side*Math.PI/2;slit.position.set(hx+side*2.57,hy+1.64+j*.13,hz-.26);scene.add(slit);}
  const light=new THREE.PointLight(0xffbb76,0,7,2);light.position.set(hx+side*2.8,hy+1.7,hz-.26);scene.add(light);lights.push(light);
 }
 const button=document.querySelector<HTMLButtonElement>('[data-odyssey-night]');function setNight(on:boolean){target=on?1:0;document.body.classList.toggle('odyssey-night',on);state.nightTarget=!!target;button?.setAttribute('aria-pressed',String(!!target));if(button)button.textContent=target?'切回白天':'切换夜晚';state.dayNightChanges=(state.dayNightChanges||0)+1;}
 if(button)button.onclick=()=>setNight(!target);state.setNight=setNight;state.wind={from:'northwest',toward:'southeast',vector:northwestWind.toArray(),sailsPinnedAtEdges:true,sharedGust:true,independentNormalizedWindUV:true};
 function update(dt:number,time:number){factor.value=THREE.MathUtils.damp(factor.value,target,2.3,dt);if(Math.abs(factor.value-target)<.001)factor.value=target;const n=factor.value;state.nightMix=n;state.timeOfDay=n>.5?'night':'day';
  sun.color.copy(dayColor).lerp(moonColor,n);sun.intensity=THREE.MathUtils.lerp(dayPower,.55,n);const dir=dayDirection.clone().lerp(moonDirection,n).normalize();sun.position.copy(sun.target.position).addScaledVector(dir,120);
  ambient.color.copy(daySky).lerp(new THREE.Color(0x526a93),n);ambient.groundColor.copy(dayGround).lerp(new THREE.Color(0x111724),n);ambient.intensity=THREE.MathUtils.lerp(dayAmbient,.06,n);
  scene.environmentIntensity=THREE.MathUtils.lerp(.45,.075,n);(scene.fog as THREE.FogExp2).color.set(0xd6ddd5).lerp(new THREE.Color(0x101d2d),n);const bounce=scene.getObjectByName('V158 golden hour sea-bounce') as THREE.DirectionalLight;if(bounce)bounce.intensity=THREE.MathUtils.lerp(.06,.012,n);
  const tint=new THREE.Color(1,1,1).lerp(new THREE.Color(.105,.16,.25),n);for(const {m,c}of baked)m.color.copy(c).multiply(tint);
  const w=water.material as THREE.ShaderMaterial;w.uniforms.sunDirection.value.copy(dayDirection.clone()).lerp(moonDirection,n).normalize();w.uniforms.sunColor.value.setRGB(1,.69,.36).lerp(new THREE.Color(.10,.15,.22),n);w.uniforms.waterColor.value.set(0x064a50).lerp(new THREE.Color(0x061321),n);
  const flame=.96+.035*Math.sin(time*3.1)+.015*Math.sin(time*7.3);lights.forEach((l,i)=>l.intensity=(i<2?13:4.5)*n*flame);lampMaterials.forEach(m=>m.opacity=n*.95);glassMaterials.forEach(m=>m.opacity=n*.82);renderer.toneMappingExposure=THREE.MathUtils.lerp(.85,1.,n);
  state.updateUEReflection?.(n);
  state.nightLights={shipLanterns:2,cottageShutterWindows:2,active:n>.05};
 }
 return{update,get changing(){return Math.abs(factor.value-target)>.001;}};
}
