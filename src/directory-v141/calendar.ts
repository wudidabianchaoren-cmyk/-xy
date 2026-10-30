import * as THREE from 'three';

export function createCalendar(scene: THREE.Scene, micro?: { normal: THREE.Texture; rough: THREE.Texture }) {
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 896;
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8;
  const material = new THREE.MeshPhysicalMaterial({ map: texture, color: 0xffffff, roughness: 1,
    normalMap: micro?.normal ?? null, roughnessMap: micro?.rough ?? null, normalScale: new THREE.Vector2(.05, .05),
    envMapIntensity: .35, emissive: 0x000000, emissiveIntensity: 0 });
  const page = new THREE.Mesh(new THREE.PlaneGeometry(.194, .220), material);
  page.name = 'Live clean white calendar page / Asia Shanghai'; page.position.set(-1.24, .88835, .30285); page.rotation.x = -13 * Math.PI / 180;
  scene.add(page);
  const status = { date: '', day: '', month: '', weekday: '', timeZone: 'Asia/Shanghai', live: true };
  let checked = -Infinity;
  function update(now = Date.now()) {
    if (now - checked < 15000 && now >= checked) return;
    checked = now;
    const date = new Date(now), key = new Intl.DateTimeFormat('en-CA', { timeZone: status.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    if (status.date === key) return;
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: status.timeZone, year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).formatToParts(date);
    const part = (type: string) => parts.find(p => p.type === type)?.value ?? '';
    Object.assign(status, { date: key, day: part('day'), month: part('month'), weekday: part('weekday') });
    const c = canvas.getContext('2d')!; c.fillStyle = '#fafaf7'; c.fillRect(0, 0, 768, 896);
    c.fillStyle = '#424441'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = '500 39px Georgia, serif'; c.fillText(part('month').toUpperCase() + ' ' + part('year'), 384, 115);
    c.font = '600 352px Georgia, serif'; c.fillStyle = '#8b3027'; c.fillText(part('day'), 384, 452, 650);
    c.font = '500 35px Georgia, serif'; c.fillStyle = '#44483e'; c.fillText(part('weekday').toUpperCase(), 384, 736);
    texture.needsUpdate = true;
  }
  update();
  return { page, texture, status, update, destroy() { scene.remove(page); page.geometry.dispose(); material.dispose(); texture.dispose(); } };
}
