import * as THREE from 'three';
const cache = new WeakMap<THREE.Object3D[], { count: number; meshes: THREE.Mesh[] }>();
const inverse = new THREE.Matrix4(), localRay = new THREE.Ray(), point = new THREE.Vector3();
/** Bounds only order/cull candidates; activation always requires the closest real triangle. */
export function pickRoom(ray: THREE.Raycaster, roots: THREE.Object3D[]) {
  let index = cache.get(roots);
  if (!index || index.count !== roots.length) {
    const meshes: THREE.Mesh[] = [];
    for (const root of roots) root.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.computeBoundingBox(); meshes.push(o); } });
    index = { count: roots.length, meshes }; cache.set(roots, index);
  }
  const candidates: { mesh: THREE.Mesh; near: number }[] = [];
  for (const mesh of index.meshes) {
    let shown = true; for (let n: THREE.Object3D | null = mesh; n; n = n.parent) if (!n.visible) { shown = false; break; }
    if (!shown || !mesh.geometry.boundingBox) continue;
    inverse.copy(mesh.matrixWorld).invert(); localRay.copy(ray.ray).applyMatrix4(inverse);
    if (!localRay.intersectBox(mesh.geometry.boundingBox, point)) continue;
    const near = mesh.geometry.boundingBox.containsPoint(localRay.origin) ? 0 : point.applyMatrix4(mesh.matrixWorld).distanceTo(ray.ray.origin);
    candidates.push({ mesh, near });
  }
  candidates.sort((a, b) => a.near - b.near);
  let best: THREE.Intersection | undefined;
  for (const candidate of candidates) {
    if (best && candidate.near > best.distance + .00001) break;
    const hit = ray.intersectObject(candidate.mesh, false)[0];
    if (hit && (!best || hit.distance < best.distance)) best = hit;
  }
  if (best) {
    let key = ''; for (let n: THREE.Object3D | null = best.object; n; n = n.parent) { key = n.userData.key || n.userData.pickKey || ''; if (key) break; }
    return { key, distance: best.distance, object: best.object.name, point: best.point, uv: best.uv };
  }
  return { key: '', distance: Infinity, object: '', point: new THREE.Vector3(), uv: undefined };
}
