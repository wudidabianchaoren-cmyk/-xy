import * as THREE from 'three';
type Grain = { normal: THREE.Texture; rough: THREE.Texture };
/** Physical microstructure, independent of the room's lighting atlas and display pixels. */
function grain(kind: string): Grain {
  const size = 256, height = new Float32Array(size * size), n = new Uint8Array(size * size * 4), r = new Uint8Array(size * size * 4);
  const hash = (x: number, y: number) => { let v = Math.imul(x + 29, 374761393) ^ Math.imul(y + 61, 668265263); v = Math.imul(v ^ (v >>> 13), 1274126177); return ((v ^ (v >>> 16)) >>> 0) / 4294967295; };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const q = hash(x, y), brushed = kind === 'brass', weave = kind === 'cloth';
    height[y * size + x] = brushed ? .5 + .19 * (hash(x, 0) - .5) + .035 * (q - .5) : weave ? .5 + .13 * Math.sin(x * Math.PI / 2) * Math.sin(y * Math.PI / 2) + .04 * q : .5 + (q - .5) * (kind === 'paper' ? .12 : .07);
  }
  const sample = (x: number, y: number) => height[((y + size) % size) * size + (x + size) % size];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4, dx = sample(x + 1, y) - sample(x - 1, y), dy = sample(x, y + 1) - sample(x, y - 1), v = new THREE.Vector3(-dx * 3, -dy * 3, 1).normalize();
    n.set([Math.round((v.x * .5 + .5) * 255), Math.round((v.y * .5 + .5) * 255), Math.round((v.z * .5 + .5) * 255), 255], i);
    const value = Math.round((.79 + (sample(x, y) - .5) * .50) * 255); r.set([value, value, value, 255], i);
  }
  const make = (data: Uint8Array) => { const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = 8; t.needsUpdate = true; return t; };
  return { normal: make(n), rough: make(r) };
}
export async function createSurfaces(inputs: {
  loader: THREE.TextureLoader; base: string;
  off: THREE.Texture; lamp: THREE.Texture; tv: THREE.Texture; lampLevel: { value: number }; screen: { value: THREE.Color };
  scale: (name: string, fallback: number) => number; woodNormal: THREE.Texture; woodRough: THREE.Texture; woodColor: THREE.Texture; linenNormal: THREE.Texture; linenRough: THREE.Texture;
}) {
  const grains = new Map<string, Grain>([['plaster', grain('plaster')]]);
  await Promise.all(Object.entries({ brass: 'brass', aluminium: 'aluminium', plastic: 'abs', paper: 'paper', ceramic: 'porcelain', leather: 'rubber' }).map(async ([family, file]) => {
    const [normal, rough] = await Promise.all(['normal', 'roughness'].map(kind => inputs.loader.loadAsync(inputs.base + 'materials/' + file + '-' + kind + '.png')));
    for (const t of [normal, rough]) { t.colorSpace = THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; }
    grains.set(family, { normal, rough });
  }));
  const created: THREE.MeshPhysicalMaterial[] = [];
  const apply = (old: THREE.MeshStandardMaterial, useBake = true) => {
    const name = old.name.toLowerCase();
    const family = /walnut|wood/.test(name) ? 'wood' : /alumin|silver/.test(name) ? 'aluminium' : /brass|copper|bronze|metal/.test(name) ? 'brass' : /porcelain|ceramic|glaze/.test(name) ? 'ceramic' : /paper|card|calendar|ink|print|pencil|pigment/.test(name) ? 'paper' : /cloth|foam|fabric|canvas/.test(name) ? 'cloth' : /leather|padding/.test(name) ? 'leather' : /abs|television|crt|plastic|headphones|rubber|remote/.test(name) ? 'plastic' : 'plaster';
    const wood = family === 'wood', micro = grains.get(family)!, pureMetal = (old.metalness ?? 0) > .5 && !old.metalnessMap;
    const roughness = wood ? .63 : /brass|aluminium/.test(family) ? .95 : family === 'ceramic' ? 1 : family === 'paper' ? 1 : family === 'cloth' ? .97 : family === 'leather' ? .90 : family === 'plastic' ? .85 : .95;
    const m = new THREE.MeshPhysicalMaterial({ color: old.color?.clone() ?? new THREE.Color(0xffffff),
      map: old.map ?? null, metalnessMap: old.metalnessMap ?? null, roughness,
      metalness: old.metalness ?? 0, normalMap: wood ? inputs.woodNormal : family === 'cloth' ? inputs.linenNormal : micro.normal,
      roughnessMap: wood ? inputs.woodRough : family === 'cloth' ? inputs.linenRough : micro.rough,
      normalScale: new THREE.Vector2(wood ? .20 : family === 'brass' ? .09 : family === 'paper' ? .13 : .10, wood ? .20 : family === 'brass' ? .09 : family === 'paper' ? .13 : .10),
      clearcoat: wood ? .30 : family === 'ceramic' ? .38 : family === 'plastic' ? .08 : family === 'brass' ? .06 : 0,
      clearcoatRoughness: wood ? .34 : family === 'ceramic' ? .28 : .48,
      envMapIntensity: pureMetal ? 1.05 : wood ? .85 : family === 'ceramic' ? .78 : .65,
      anisotropy: pureMetal && family === 'brass' ? .35 : 0, anisotropyRotation: Math.PI / 2,
      sheen: family === 'cloth' ? .15 : 0, sheenRoughness: .8
    });
    m.name = old.name + ' / V125 ' + family; m.userData.materialFamily = family; m.userData.realNormalAndRoughness = true; m.userData.pureMetalPBR = pureMetal;
    m.onBeforeCompile = s => {
      Object.assign(s.uniforms, { dirOff: { value: inputs.off }, dirLampMap: { value: inputs.lamp }, dirTV: { value: inputs.tv }, dirLamp: inputs.lampLevel, dirScreen: inputs.screen, dirWood: { value: inputs.woodColor } });
      const scale = wood ? .48 : family === 'paper' ? 22 : family === 'brass' ? 15 : family === 'plastic' ? 19 : 12;
      s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vDirUV; varying vec2 vSurfaceUV;')
        .replace('#include <uv_vertex>', `#include <uv_vertex>
          vDirUV=uv;vec3 wp=(modelMatrix*vec4(position,1.)).xyz;vec3 wn=normalize(mat3(modelMatrix)*normal);
          vSurfaceUV=(abs(wn.y)>.55?wp.xz:abs(wn.z)>.55?wp.xy:wp.zy)*${scale.toFixed(2)};
          vNormalMapUv=vSurfaceUV;vRoughnessMapUv=vSurfaceUV;`);
      if (!pureMetal && useBake) {
        s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec2 vDirUV;varying vec2 vSurfaceUV;uniform sampler2D dirWood,dirOff,dirLampMap,dirTV;uniform float dirLamp;uniform vec3 dirScreen;')
          .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
            vec3 baked=pow(texture2D(dirOff,vDirUV).rgb,vec3(3.))*${inputs.scale('room-off', 2).toFixed(3)}+pow(texture2D(dirLampMap,vDirUV).rgb,vec3(3.))*${inputs.scale('room-lamp', 64).toFixed(3)}*dirLamp+pow(texture2D(dirTV,vDirUV).rgb,vec3(3.))*${inputs.scale('room-tv', 2).toFixed(3)}*dirScreen;
            ${wood ? 'float detail=dot(texture2D(dirWood,vSurfaceUV).rgb,vec3(.2126,.7152,.0722))/max(.025,dot(texture2D(dirWood,vSurfaceUV,4.).rgb,vec3(.2126,.7152,.0722)));baked*=mix(1.,clamp(detail,.76,1.26),.8);' : ''}
            reflectedLight.directDiffuse=vec3(0.);reflectedLight.indirectDiffuse=baked;
            #ifdef USE_ENVMAP
              vec3 e=baked/max(material.diffuseColor,vec3(.035));
              float so=clamp(1.10*PI*dot(e,vec3(.2126,.7152,.0722))/max(dot(iblIrradiance,vec3(.2126,.7152,.0722)),.0001),0.,1.);
              reflectedLight.indirectSpecular*=so;
              #ifdef USE_CLEARCOAT
                clearcoatSpecularIndirect*=so;
              #endif
            #endif`);
      }
    };
    m.customProgramCacheKey = () => 'V125-physical-family-' + family + (pureMetal ? '-metal' : useBake ? '-baked' : '-live'); created.push(m); return m;
  };
  return { apply, created, micro: (kind: string) => grains.get(kind), destroy() { created.forEach(m => m.dispose()); grains.forEach(g => { g.normal.dispose(); g.rough.dispose(); }); } };
}
