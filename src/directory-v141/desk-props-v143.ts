import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

type Surfaces = { apply: (old: THREE.MeshStandardMaterial, baked?: boolean) => THREE.MeshPhysicalMaterial; micro: (kind: string) => { normal: THREE.Texture; rough: THREE.Texture } | undefined };

/** Replace only two props in the merged room. The desk, lighting atlas and all other objects stay intact. */
export function refineDeskPropsV143(scene: THREE.Scene, model: THREE.Object3D, surfaces: Surfaces) {
  const removed = { penHolder: 0, phone: 0 };
  const penBounds = new THREE.Box3(new THREE.Vector3(-1.532, .749, .148), new THREE.Vector3(-1.428, .905, .252));
  const phoneBounds = new THREE.Box3(new THREE.Vector3(1.208, .750, -.824), new THREE.Vector3(1.628, .957, -.376));
  const centre = new THREE.Vector3(), vertex = new THREE.Vector3();
  model.updateMatrixWorld(true);
  model.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    const geometry = object.geometry.clone(), positions = geometry.getAttribute('position'), index = geometry.index;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    const groups = geometry.groups.length ? [...geometry.groups] : [{ start: 0, count: index?.count ?? positions.count, materialIndex: 0 }];
    const kept: number[] = [], nextGroups: { start: number; count: number; materialIndex: number }[] = [], tuckedPencilVertices = new Set<number>();
    for (const group of groups) {
      const start = kept.length;
      const material = materials[group.materialIndex ?? 0];
      for (let offset = group.start; offset < group.start + group.count; offset += 3) {
        const ids = [0, 1, 2].map(k => index ? index.getX(offset + k) : offset + k);
        centre.set(0, 0, 0);
        for (const id of ids) centre.add(vertex.fromBufferAttribute(positions, id).applyMatrix4(object.matrixWorld));
        centre.multiplyScalar(1 / 3);
        const name = material?.name ?? '';
        const oldRod=centre.x> -1.56&&centre.x< -1.40&&centre.z>.12&&centre.z<.28&&centre.y>.775&&centre.y<1.24&&/walnut|graphite|pencil/i.test(name);
        const pen = (penBounds.containsPoint(centre) && /brass|pen holder dark/i.test(name))||oldRod;
        const phone = phoneBounds.containsPoint(centre) && /landline ABS|rubber feet|graphite molded ABS/i.test(name);
        if (penBounds.containsPoint(centre) && /walnut|graphite molded ABS/i.test(name)) ids.forEach(id => tuckedPencilVertices.add(id));
        if (pen) removed.penHolder++;
        else if (phone) removed.phone++;
        else kept.push(...ids);
      }
      if (kept.length > start) nextGroups.push({ start, count: kept.length - start, materialIndex: group.materialIndex ?? 0 });
    }
    geometry.setIndex(kept); geometry.clearGroups();
    nextGroups.forEach(g => geometry.addGroup(g.start, g.count, g.materialIndex));
    // Old leaning pencil rods pierced the original cup and read as a yellow stripe.
    // Move only their buried end vertices to the mouth plane; their visible upper lengths stay in place.
    const inverse = object.matrixWorld.clone().invert();
    for (const id of tuckedPencilVertices) { vertex.fromBufferAttribute(positions, id).applyMatrix4(object.matrixWorld); if (vertex.y < .903) { vertex.y = .903; vertex.applyMatrix4(inverse); positions.setXYZ(id, vertex.x, vertex.y, vertex.z); } }
    positions.needsUpdate = true;
    object.geometry = geometry;
  });

  const group = new THREE.Group(); group.name = 'V143 tactile pen holder and landline'; scene.add(group);
  const material = (name: string, color: number, roughness: number, metalness = 0) => {
    const m = surfaces.apply(new THREE.MeshStandardMaterial({ name, color, roughness, metalness }), false);
    m.roughness = roughness; m.roughnessMap = null; m.envMapIntensity = .70;
    m.normalScale.set(.035, .035); m.clearcoat = .04; m.clearcoatRoughness = .45;
    const compile = m.onBeforeCompile.bind(m), cache = m.customProgramCacheKey.bind(m);
    m.onBeforeCompile = (shader, renderer) => { compile(shader, renderer); shader.vertexShader = shader.vertexShader.replace('vNormalMapUv=vSurfaceUV;vRoughnessMapUv=vSurfaceUV;', '\n#ifdef USE_NORMALMAP\n vNormalMapUv=vSurfaceUV;\n#endif\n#ifdef USE_ROUGHNESSMAP\n vRoughnessMapUv=vSurfaceUV;\n#endif\n'); };
    m.customProgramCacheKey = () => cache() + '-v143-optional-micro-maps';
    return m;
  };
  const bronze = material('V143 satin aged bronze pen holder', 0x776647, .88, .25);
  bronze.anisotropy = 0; bronze.anisotropyRotation = Math.PI / 2; bronze.envMapIntensity = .12; bronze.clearcoat = 0;
  const inner = material('V143 dark pen holder interior', 0x322d24, .78, .16);
  const ivory = material('V143 landline ABS eggshell', 0xc9c6b9, .40);
  ivory.clearcoat = .16; ivory.clearcoatRoughness = .35;
  const keyMat = material('V143 landline ABS key caps', 0xb9b8af, .48);
  const recess = material('V143 landline dark rubber seams', 0x252824, .80);
  recess.normalMap = null; recess.metalness = 0;
  const foot = material('V143 telephone rubber feet', 0x1e211e, .88);
  const geometries: THREE.BufferGeometry[] = [], extraMaterials: THREE.Material[] = [], textures: THREE.Texture[] = [];
  const add = (name: string, geometry: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, parent: THREE.Group = group) => {
    const mesh = new THREE.Mesh(geometry, mat); mesh.name = name; mesh.position.set(x, y, z); mesh.castShadow=mesh.receiveShadow=true;mesh.layers.enable(1); parent.add(mesh); geometries.push(geometry); return mesh;
  };
  const rounded = (name: string, size: [number, number, number], mat: THREE.Material, pos: [number, number, number], radius = .004, parent = group) => add(name, new RoundedBoxGeometry(...size, 3, radius), mat, ...pos, parent);

  // Closed wall thickness, a rounded mouth and a dark inner floor. No luminous rim or painted yellow stripe.
  const section = [[0, 0], [.045, 0], [.048, .0015], [.049, .004], [.049, .144], [.0487, .147], [.0475, .149], [.045, .149], [.0437, .147], [.0435, .144], [.0435, .013], [0, .013]].map(([x, y]) => new THREE.Vector2(x, y));
  const pens=new THREE.Group();pens.name='V161 large fortune pot with rectangular wooden slips';pens.position.set(-1.45,.753,.30);pens.scale.setScalar(1.65);pens.userData.pickKey='pens';group.add(pens);
  add('V161 pen holder continuous rolled wall', new THREE.LatheGeometry(section, 80), bronze, 0,0,0,pens);
  add('V161 pen holder deep inner floor', new THREE.CylinderGeometry(.0434,.0434,.001,48),inner,0,.0135,0,pens);
  const slip=material('V161 square section warm wooden fortune slips',0xc6a674,.84);slip.metalness=0;
  for(let i=0;i<7;i++){const a=i*2.3999,r=i===0?0:.027;const stick=rounded('V161 flat wooden fortune slip '+i,[.014,.15+(i%3)*.014,.0055],slip,[Math.cos(a)*r,.145+(i%3)*.007,Math.sin(a)*r],.0015,pens);stick.rotation.z=(i-3)*.025;}

  // The measured table plane is y=.752. Four compressed rubber feet meet that plane exactly.
  const phone = new THREE.Group(); phone.name = 'V143 landline, grounded on desk';phone.userData.pickKey='about'; phone.position.set(1.41, .752, -.68); group.add(phone);
  for (const x of [-.125, .125]) for (const z of [-.084, .084]) rounded('V143 landline rubber contact foot', [.034, .004, .026], foot, [x, .002, z], .0017, phone);
  rounded('V143 landline lower chassis', [.325, .029, .247], recess, [0, .019, 0], .012, phone);
  const shell = new RoundedBoxGeometry(.333, .079, .257, 5, .015);
  const p = shell.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i), z = p.getZ(i);
    // The operating face rises away from the viewer instead of reading as a floating flat block.
    p.setY(i, y + .014 * (-z / .1285) * THREE.MathUtils.smoothstep(y, -.035, .035));
  }
  shell.computeVertexNormals(); add('V143 softly wedge-shaped moulded telephone shell', shell, ivory, 0, .059, 0, phone);
  rounded('V143 handset cradle left', [.035, .021, .058], ivory, [-.135, .114, -.053], .009, phone);
  rounded('V143 handset cradle right', [.035, .021, .058], ivory, [.135, .114, -.053], .009, phone);
  // A shallow arc with thicker receiver ends gives the handset a human grip, not a rectangular bar.
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-.137, .133, -.057), new THREE.Vector3(-.085, .151, -.062), new THREE.Vector3(0, .156, -.062), new THREE.Vector3(.085, .151, -.062), new THREE.Vector3(.137, .133, -.057)]);
  add('V143 handset curved grip', new THREE.TubeGeometry(curve, 32, .015, 12, false), ivory, 0, 0, 0, phone);
  for (const x of [-.145, .145]) {
    rounded('V143 handset receiver earpiece', [.074, .044, .067], ivory, [x, .129, -.055], .018, phone);
    rounded('V143 receiver underside recess', [.051, .002, .042], recess, [x, .1055, -.055], .009, phone);
    // Actual perforation marks on the exposed face, rather than one untextured solid cap.
    for (let row = -1; row <= 1; row++) for (let col = -2; col <= 2; col++) {
      const dot = add('V143 receiver acoustic perforation', new THREE.CircleGeometry(.0014, 8), recess, x + col * .007, .126 + row * .007, -.0207, phone);
      dot.rotation.x = -.15;
    }
  }
  const labelCanvas = document.createElement('canvas'); labelCanvas.width = 384; labelCanvas.height = 512;
  const ctx = labelCanvas.getContext('2d')!; ctx.clearRect(0, 0, 384, 512); ctx.fillStyle = '#353832'; ctx.font = '500 54px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '∗', '0', '#'].forEach((n, i) => ctx.fillText(n, (i % 3) * 128 + 64, Math.floor(i / 3) * 128 + 65));
  const labels = new THREE.CanvasTexture(labelCanvas); labels.colorSpace = THREE.SRGBColorSpace; labels.anisotropy = 4; textures.push(labels);
  const ink = new THREE.MeshStandardMaterial({ map: labels, transparent: true, alphaTest: .05, roughness: .82, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }); extraMaterials.push(ink);
  const keyAngle = -.10;
  for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) {
    const x = -.063 + col * .043, z = -.011 + row * .031, y = .100 - z * .10;
    const key = rounded('V143 tactile numbered dial key', [.032, .007, .024], keyMat, [x, y, z], .003, phone); key.rotation.x = keyAngle;
    const face = new THREE.PlaneGeometry(.027, .022), uv = face.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (col + uv.getX(i)) / 3, (3 - row + uv.getY(i)) / 4);
    const label = add('V143 legible dial number', face, ink, x, y + .0038, z, phone); label.rotation.x = -Math.PI / 2 + keyAngle;
  }
  // Narrow chassis joint, moulded branding inset and cable socket add construction detail without ornament.
  rounded('V143 small brand inset', [.055, .0011, .011], keyMat, [.090, .093, .073], .001, phone);
  rounded('V143 cable strain relief', [.018, .013, .026], recess, [.169, .064, -.029], .004, phone);
  const cablePoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 200; i++) { const t = i / 200, a = t * 24 * Math.PI; cablePoints.push(new THREE.Vector3(.179 + .011 * Math.sin(a), .060 + .010 * Math.cos(a) - .030 * t, -.035 + .275 * t)); }
  add('V143 telephone curled cable', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cablePoints), 480, .0023, 8, false), recess, 0, 0, 0, phone);

  // A soft local contact term reinforces the same table plane without rebaking unrelated room lighting.
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = 128; shadowCanvas.height = 128;
  const sc = shadowCanvas.getContext('2d')!;
  const gradient = sc.createRadialGradient(64, 64, 25, 64, 64, 64); gradient.addColorStop(0, 'rgba(0,0,0,.42)'); gradient.addColorStop(.55, 'rgba(0,0,0,.23)'); gradient.addColorStop(1, 'rgba(0,0,0,0)'); sc.fillStyle = gradient; sc.fillRect(0, 0, 128, 128);
  const shadowMap = new THREE.CanvasTexture(shadowCanvas); textures.push(shadowMap);
  const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }); extraMaterials.push(shadowMaterial);
  const shadow = add('V143 telephone soft contact on table', new THREE.PlaneGeometry(.39, .31), shadowMaterial, 1.41, .7524, -.68); shadow.rotation.x = -Math.PI / 2;
  const status = { version: 143, removedTriangles: removed, penFinish: 'continuous satin bronze / closed wall, open mouth / no emissive stripe', telephone: 'soft wedge ABS shell, chassis seam, curved handset, twelve labeled keys, acoustic holes, four contact feet', phoneContactPlaneY: .752, phoneFootBottomY: .752, replacesOnlyTwoProps: true };
  group.userData.refinementV143 = status;
  Object.assign(status,{version:161,fortunePotPosition:pens.position.toArray(),fortunePotScale:1.65,woodenSlips:7,slipSection:[.014,.0055],realGeometryPicking:true});
  return { status,pens,phone,destroy() { scene.remove(group); geometries.forEach(g => g.dispose()); extraMaterials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); } };
}
