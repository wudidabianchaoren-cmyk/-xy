import * as THREE from 'three';
/** Vapour starts above the actual .914m rim, with slowly curling translucent density. */
export function createCupEffect(scene: THREE.Scene) {
  const uniforms = { clock: { value: 0 }, fade: { value: 0 } };
  const plumes: THREE.Mesh[] = [];
  for (let i = 0; i < 2; i++) {
    const material = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { ...uniforms, phase: { value: i * 2.3 } },
      vertexShader: 'varying vec2 tex;void main(){tex=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: `varying vec2 tex;uniform float clock,fade,phase;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){vec2 a=floor(p),b=fract(p);b=b*b*(3.-2.*b);return mix(mix(hash(a),hash(a+vec2(1,0)),b.x),mix(hash(a+vec2(0,1)),hash(a+vec2(1,1)),b.x),b.y);}
        void main(){float y=tex.y;float bend=sin(y*8.-clock*.85+phase)*(.015+y*.13)+sin(y*17.-clock*.7+phase)*y*.045;
        float core=exp(-pow((tex.x-.5-bend)/(.055+y*.11),2.));float billow=.35+.65*noise(vec2(tex.x*8.+phase,y*10.-clock*.55));
        float alpha=core*billow*smoothstep(0.,.10,y)*(1.-smoothstep(.46,1.,y))*fade*.22;
        gl_FragColor=vec4(vec3(.88,.865,.82),alpha);}`
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(.15, .32), material);
    mesh.name = 'Tea steam / soft rising vapour ' + i;
    mesh.position.set(-.73 + i * .014, 1.075 + i * .015, .56);
    mesh.renderOrder = 4; mesh.visible = false; scene.add(mesh); plumes.push(mesh);
  }
  let last = -100;
  const status = { active: false, origin: [-.73, .916, .56], clicks: 0 };
  return {
    status, pulse(t: number) { last = t; status.clicks++; },
    update(t: number, reduced: boolean, camera?: THREE.Camera) {
      const a = t - last; status.active = a >= 0 && a < 8; uniforms.clock.value = reduced ? 0 : t;
      uniforms.fade.value = status.active ? Math.min(1, a / .65) * (1 - THREE.MathUtils.smoothstep(a, 5.7, 8)) : 0;
      for (const mesh of plumes) { mesh.visible = status.active; if (camera) mesh.quaternion.copy(camera.quaternion); }
    },
    destroy() { for (const p of plumes) { scene.remove(p); p.geometry.dispose(); (p.material as THREE.Material).dispose(); } }
  };
}
