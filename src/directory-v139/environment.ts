import * as THREE from 'three';

export async function loadRoomEnvironment(base: string) {
  const response = await fetch(base + 'web-environment.json');
  if (!response.ok) throw Error('Room reflection preparation is missing');
  const meta = await response.json();
  const entries = await Promise.all(meta.states.map(async (entry: any) => {
    const r = await fetch(base + entry.file); if (!r.ok) throw Error('Room reflection texture unavailable');
    const bytes = await r.arrayBuffer();
    if (bytes.byteLength !== entry.width * entry.height * 8) throw Error('Invalid reflection texture dimensions');
    const texture = new THREE.DataTexture(new Uint16Array(bytes), entry.width, entry.height, THREE.RGBAFormat, THREE.HalfFloatType);
    texture.mapping = THREE.CubeUVReflectionMapping; texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.magFilter = THREE.LinearFilter; texture.minFilter = THREE.LinearFilter; texture.generateMipmaps = false; texture.flipY = false; texture.needsUpdate = true;
    const probe = new THREE.LightProbe(); probe.sh.fromArray(entry.sh); probe.intensity = 0;
    return { texture, probe };
  }));
  return { entries, meta };
}
