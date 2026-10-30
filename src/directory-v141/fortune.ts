import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
const blessings = [
  ['心有山海', '眼中有光，脚下有路'], ['万事可期', '慢慢来，好事正在发生'],
  ['灵感常在', '落笔有神，所创皆新'], ['如愿以偿', '认真走的路，终有回响'],
  ['前程锦绣', '愿你所行，皆向明处'], ['平安喜乐', '有热爱，也有好好休息的日子']
];
export function createFortune(scene: THREE.Scene, wood: THREE.Texture) {
  const group = new THREE.Group(); group.name = 'Bamboo blessing lot / from pencil pot';
  const material = new THREE.MeshPhysicalMaterial({ color: 0xe5c693, bumpMap: wood, bumpScale: .00012, roughness: .69, clearcoat: .06, clearcoatRoughness: .5, envMapIntensity: .8, emissive: 0xb19870, emissiveIntensity: .32 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(.13, .57, .009, 4, .007), material); group.add(body);
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 2048;
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8;
  const print = new THREE.Mesh(new THREE.PlaneGeometry(.118, .553), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
  print.position.z = .0048; group.add(print); group.visible = false; scene.add(group);
  const status = { open: false, title: '', blessing: '', index: -1 };
  let start = -100, closing = false, closeAt = -100;
  function draw() {
    const c = canvas.getContext('2d')!; c.clearRect(0, 0, 512, 2048);
    c.fillStyle = '#8c3528'; c.textAlign = 'center'; c.font = '92px DirectoryHand, KaiTi, serif'; c.fillText('上 上 签', 256, 204);
    c.fillStyle = '#473a29'; c.font = '118px DirectoryHand, KaiTi, serif';
    [...status.title].forEach((letter, i) => c.fillText(letter, 256, 485 + i * 153));
    c.font = '55px DirectoryHand, KaiTi, serif';
    const lines = status.blessing.split(/[，、]/);
    lines.forEach((line, col) => [...line].forEach((letter, i) => c.fillText(letter, lines.length > 1 ? 330 - col * 145 : 256, 1190 + i * 75)));
    c.font = '42px DirectoryHand, KaiTi, serif'; c.fillStyle = '#806b4c'; c.fillText('造 境 手 记', 256, 1940); texture.needsUpdate = true;
  }
  const from = new THREE.Vector3(-1.45, 1.04, .30), tilt = new THREE.Quaternion();
  return {
    group, status,
    open(t: number) { status.index = (status.index + 1) % blessings.length; [status.title, status.blessing] = blessings[status.index]; draw(); status.open = true; closing = false; start = t; group.visible = true; },
    close(t: number) { status.open = false; closing = true; closeAt = t; },
    update(t: number, camera: THREE.Camera, reduced: boolean) {
      if (!group.visible) return;
      const u = reduced ? 1 : THREE.MathUtils.clamp((t - start) / 1.05, 0, 1), ease = 1 - Math.pow(1 - u, 3);
      const center = camera.localToWorld(new THREE.Vector3(0, -.015, -1.18));
      group.position.copy(from).lerp(center, ease); group.position.y += Math.sin(u * Math.PI) * .27;
      tilt.setFromEuler(new THREE.Euler(0, 0, 0));
      group.quaternion.copy(camera.quaternion).multiply(tilt);
      if (closing) { const k = reduced ? 1 : THREE.MathUtils.clamp((t - closeAt) / .45, 0, 1); group.position.lerp(from, k * k); group.scale.setScalar(1 - k * .98); if (k === 1) { group.visible = false; closing = false; } }
      else group.scale.setScalar(.24 + .76 * ease);
    },
    destroy() { scene.remove(group); body.geometry.dispose(); material.dispose(); print.geometry.dispose(); (print.material as THREE.Material).dispose(); texture.dispose(); }
  };
}
