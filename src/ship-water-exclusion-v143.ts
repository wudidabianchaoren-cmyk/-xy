import * as THREE from 'three';

/** Exclude only water inside the preserved, animated hull's measured closed section. */
export function shipWaterExclusion(water: THREE.Mesh, boat: THREE.Object3D) {
  const material = water.material as THREE.ShaderMaterial;
  const inverse = { value: new THREE.Matrix4() };
  material.uniforms.shipHullInverse = inverse;
  material.fragmentShader = material.fragmentShader.replace(
    'uniform sampler2D normalSampler;',
    `uniform sampler2D normalSampler;
uniform mat4 shipHullInverse;
bool insideSealedShip(vec3 worldPoint) {
  vec3 p = (shipHullInverse * vec4(worldPoint, 1.0)).xyz;
  float u = (p.x + 13.0) / 28.0;
  if (u <= 0.0 || u >= 1.0) return false;
  float sheer = 0.80 * pow(abs(2.0 * u - 1.0), 3.4);
  float v = (p.y + 0.83 - sheer) / 3.0;
  if (v < 0.0 || v > 1.0) return false;
  float halfWidth = 3.45 * pow(max(0.005, sin(3.14159265359 * u)), 0.56)
    * (0.12 + 0.88 * sin(v * 1.57079632679));
  return abs(p.z - 8.0) < max(0.0, halfWidth - 0.035);
}`,
  ).replace('void main() {', 'void main() {\nif (insideSealedShip(worldPosition.xyz)) discard;');
  const update = () => {
    boat.updateWorldMatrix(true, false);
    inverse.value.copy(boat.matrixWorld).invert();
  };
  update();
  return { update, mode: 'inverse animated hull matrix / original measured analytic sections' };
}
