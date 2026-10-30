(() => {
  "use strict";

  const canvas = document.getElementById("homeArchitectureCanvas");
  if (!canvas || !window.THREE) return;
  const THREE = window.THREE;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.35));
  renderer.setClearColor(0x030506);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030506);
  scene.fog = new THREE.FogExp2(0x030506, .045);
  const camera = new THREE.PerspectiveCamera(39, 1, .1, 60);
  const root = new THREE.Group();
  root.position.set(.66, .13, 0);
  scene.add(root);

  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = grainCanvas.height = 256;
  const grainContext = grainCanvas.getContext("2d");
  const grainPixels = grainContext.createImageData(256, 256);
  let grainSeed = 7819;
  const noise = (x, y) => {
    let value = Math.imul(x, 374761393) + Math.imul(y, 668265263);
    value = Math.imul(value ^ (value >>> 13), 1274126177);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
  };
  const plaster = (x, y) => {
    const gx = Math.floor(x / 39);
    const gy = Math.floor(y / 39);
    const fx = (x / 39 - gx) ** 2 * (3 - 2 * (x / 39 - gx));
    const fy = (y / 39 - gy) ** 2 * (3 - 2 * (y / 39 - gy));
    const top = noise(gx, gy) * (1 - fx) + noise(gx + 1, gy) * fx;
    const bottom = noise(gx, gy + 1) * (1 - fx) + noise(gx + 1, gy + 1) * fx;
    return top * (1 - fy) + bottom * fy;
  };
  for (let i = 0; i < grainPixels.data.length; i += 4) {
    grainSeed = (grainSeed * 1664525 + 1013904223) >>> 0;
    const x = (i / 4) % 256;
    const y = Math.floor(i / 4 / 256);
    const value = Math.max(132, Math.min(215, 174 + (plaster(x, y) - .5) * 33 + ((grainSeed >>> 24) - 128) * .09));
    grainPixels.data[i] = value;
    grainPixels.data[i + 1] = value;
    grainPixels.data[i + 2] = value;
    grainPixels.data[i + 3] = 255;
  }
  grainContext.putImageData(grainPixels, 0, 0);
  const grain = new THREE.CanvasTexture(grainCanvas);
  grain.colorSpace = THREE.SRGBColorSpace;
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(1.12, 1.12);
  grain.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  const stone = new THREE.MeshStandardMaterial({ color: 0xbfc1b5, map: grain, roughness: .94, metalness: .02, bumpMap: grain, bumpScale: .048 });
  const bone = new THREE.MeshStandardMaterial({ color: 0xf4e8c6, map: grain, roughness: .9, metalness: .015, bumpMap: grain, bumpScale: .038 });
  const weathered = new THREE.MeshStandardMaterial({ color: 0x85877c, map: grain, roughness: .98, bumpMap: grain, bumpScale: .055 });
  const shadowStone = new THREE.MeshStandardMaterial({ color: 0x444037, roughness: .99 });
  const earth = new THREE.MeshStandardMaterial({ color: 0x3c3a32, map: grain, roughness: .99, bumpMap: grain, bumpScale: .035 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xb7a371, roughness: .55, metalness: .62 });
  const blue = new THREE.MeshStandardMaterial({ color: 0x243ca7, roughness: .74, metalness: .08, emissive: 0x090d31, emissiveIntensity: .12 });
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x8c836f, transparent: true, opacity: .3 });

  function object(geometry, material, x = 0, y = 0, z = 0) {
    const result = new THREE.Mesh(geometry, material);
    result.position.set(x, y, z);
    result.castShadow = true;
    result.receiveShadow = true;
    return result;
  }

  function slab(width, height, depth, material, x, y, z) {
    return object(new THREE.BoxGeometry(width, height, depth), material, x, y, z);
  }

  function beam(start, end, radius, material, sides = 7) {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const direction = b.clone().sub(a);
    const result = object(new THREE.CylinderGeometry(radius, radius, direction.length(), sides), material);
    result.position.copy(a).add(b).multiplyScalar(.5);
    result.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return result;
  }

  function panel(points, depth, material) {
    const shape = new THREE.Shape();
    points.forEach(([x, y], index) => index ? shape.lineTo(x, y) : shape.moveTo(x, y));
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelThickness: .025, bevelSize: .025, bevelSegments: 1,
      curveSegments: 16, steps: 1
    });
    geometry.computeVertexNormals();
    return object(geometry, material);
  }

  function annularArc(inner, outer, from, to, depth, material) {
    const shape = new THREE.Shape();
    shape.moveTo(Math.cos(from) * outer, Math.sin(from) * outer);
    shape.absarc(0, 0, outer, from, to, false);
    shape.lineTo(Math.cos(to) * inner, Math.sin(to) * inner);
    shape.absarc(0, 0, inner, to, from, true);
    shape.closePath();
    return object(new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelThickness: .035, bevelSize: .028,
      bevelSegments: 2, curveSegments: 56
    }), material);
  }

  const revealNodes = [];
  function reveal(group, delay, duration, lift = 0, fromScale = .15) {
    group.visible = false;
    revealNodes.push({ group, delay, duration, lift, fromScale, baseY: group.position.y });
    root.add(group);
    return group;
  }

  const floor = object(new THREE.PlaneGeometry(28, 18), earth, 0, -1.16, 0);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const base = new THREE.Group();
  for (let i = 0; i < 13; i += 1) {
    const fragment = slab(.22 + (i * 7 % 5) * .1, .04 + (i % 3) * .014, .18 + (i * 3 % 5) * .07,
      i % 4 ? weathered : bone, -3.2 + i * .53, -1.09, .54 + (i % 3) * .17);
    fragment.rotation.y = (i % 5 - 2) * .11;
    base.add(fragment);
  }
  reveal(base, .12, 1.45, .55, .75);

  const rearArchitecture = new THREE.Group();
  const rearArc = annularArc(1.65, 2.61, -.23, Math.PI * 1.13, .32, shadowStone);
  rearArc.position.set(.09, .12, -1.22);
  rearArchitecture.add(rearArc);
  const rearLeft = annularArc(1.24, 1.49, .48, Math.PI * 1.29, .25, weathered);
  rearLeft.position.set(-1.22, -.04, -.99);
  rearArchitecture.add(rearLeft);
  rearArchitecture.add(panel([[1.26, -1], [3.64, .8], [3.68, 2.03], [3.3, 1.66], [1.74, -.2]], .25, weathered));
  rearArchitecture.children[rearArchitecture.children.length - 1].position.z = -1.28;
  const rearButtress = panel([[-3.39, -1], [-3.25, .54], [-2.72, 1.53], [-1.99, -.55]], .27, weathered);
  rearButtress.position.z = -1.42;
  rearArchitecture.add(rearButtress);
  const farWall = panel([[2.78, -1.05], [4.26, -1.01], [4.26, 1.35], [3.66, .82]], .34, stone);
  farWall.position.z = -.97;
  rearArchitecture.add(farWall);
  const farWallFace = panel([[3.67, -.72], [4.25, -.7], [4.25, 1.28], [3.95, 1.05]], .025, weathered);
  farWallFace.position.z = -.62;
  rearArchitecture.add(farWallFace);
  for (let i = 0; i < 5; i += 1) {
    const slit = slab(.024, .37 + i * .12, .018, shadowStone,
      3.77 + i * .105, -.44 + i * .08, -.57);
    slit.rotation.z = -.12;
    rearArchitecture.add(slit);
  }
  reveal(rearArchitecture, .65, 2.4, .38, .6);

  const mast = new THREE.Group();
  mast.add(slab(.15, 5.58, .22, weathered, -1.83, 1.27, .12));
  mast.add(slab(.1, 4.63, .1, brass, -1.69, .95, .27));
  mast.add(slab(.32, 3.58, .25, shadowStone, -1.55, .67, -.2));
  mast.add(slab(1.64, .09, .22, bone, -2.14, 2.78, .22));
  mast.add(slab(.88, .08, .15, brass, -1.98, 1.86, .26));
  mast.add(slab(.69, .06, .13, brass, -1.71, .3, .27));
  mast.add(beam([-1.83, 3.86, .12], [-1.83, 4.65, .12], .035, brass));
  for (let i = 0; i < 9; i += 1) {
    mast.add(slab(.13, .027, .06, i % 3 === 0 ? bone : brass, -1.47, -1 + i * .46, .29));
  }
  reveal(mast, .18, 2.65, 2.6, .06);

  const circularBody = new THREE.Group();
  circularBody.position.set(.27, -.08, -.45);
  circularBody.add(annularArc(1.21, 2.54, -.1, Math.PI * 1.08, .42, bone));
  const innerArc = annularArc(1.09, 1.18, -.08, Math.PI * 1.11, .1, shadowStone);
  innerArc.position.z = .48;
  circularBody.add(innerArc);
  const rim = annularArc(2.53, 2.56, .05, Math.PI * 1.02, .025, weathered);
  rim.position.z = .48;
  circularBody.add(rim);
  for (let i = 0; i < 5; i += 1) {
    const angle = .32 + i * .26;
    const radius = 1.32 + i * .032;
    const groove = annularArc(radius, radius + .016, angle, Math.PI * 1.06, .009, i % 2 ? shadowStone : weathered);
    groove.position.z = .46 + i * .003;
    circularBody.add(groove);
  }
  const leftFace = panel([[-2.36, -.1], [-1.76, 1.62], [-1.4, 1.88], [-1.66, .61]], .08, weathered);
  leftFace.position.z = .44;
  circularBody.add(leftFace);
  const rightFace = panel([[1.22, 1.05], [2.25, .36], [2.39, -.25], [1.68, .44]], .07, stone);
  rightFace.position.z = .44;
  circularBody.add(rightFace);
  const crownFacet = panel([[-.22, 2.15], [.91, 2.09], [1.32, 1.74], [.47, 1.67]], .035, stone);
  crownFacet.position.z = .435;
  circularBody.add(crownFacet);
  const sideFacet = panel([[1.44, 1.84], [2.31, 1.04], [2.15, .65], [1.36, 1.35]], .045, weathered);
  sideFacet.position.z = .435;
  circularBody.add(sideFacet);
  reveal(circularBody, 1.1, 3, .7, .13);

  const shutters = new THREE.Group();
  shutters.position.set(.27, -.08, -.22);
  const shutterLeaves = [];
  for (let index = 0; index < 6; index += 1) {
    const pivot = new THREE.Group();
    pivot.position.set(-.7 + index * .28, -.14 + index * .1, .18 + index * .01);
    const leaf = panel([[0, -.4], [.36, -.27], [.48, 1.15], [.13, .93]], .045,
      index % 3 === 0 ? shadowStone : weathered);
    pivot.add(leaf);
    shutters.add(pivot);
    shutterLeaves.push(pivot);
  }
  reveal(shutters, 1.65, 2.7, 0, .22);

  const wingHinge = new THREE.Group();
  wingHinge.position.set(.52, -.85, -.18);
  const wing = new THREE.Group();
  const mainWing = panel([[0, -.12], [3.48, 2.03], [3.74, 1.65], [1.06, -.46]], .24, bone);
  mainWing.position.z = .02;
  wing.add(mainWing);
  const wingUnder = panel([[.07, -.22], [3.5, 1.9], [3.72, 1.65], [1.01, -.48]], .04, weathered);
  wingUnder.position.z = .31;
  wing.add(wingUnder);
  for (let i = 1; i < 5; i += 1) {
    const start = [.19 + i * .49, -.08 + i * .27, .33];
    const end = [.32 + i * .49, .02 + i * .27, .33];
    wing.add(beam(start, end, .009, shadowStone, 5));
  }
  wingHinge.add(wing);
  reveal(wingHinge, 2.2, 3.1, 0, .3);

  const blueForms = new THREE.Group();
  blueForms.position.set(.27, -.08, .51);
  const blueBeads = [];
  for (let i = 0; i < 11; i += 1) {
    const bead = object(new THREE.SphereGeometry(.088 + i * .006, 12, 9), blue);
    bead.scale.set(.78, .32, .7);
    blueForms.add(bead);
    blueBeads.push(bead);
  }
  reveal(blueForms, 3.25, 1.6, 0, .4);

  const groundFragments = new THREE.Group();
  for (let i = 0; i < 24; i += 1) {
    const side = i % 2 ? 1 : -1;
    const x = side * (2.65 + (i * 37 % 13) * .09);
    const height = .32 + (i * 17 % 7) * .19;
    const z = -.28 - (i % 4) * .17;
    groundFragments.add(beam([x, -1.1, z], [x + side * .06, -1.1 + height, z], .01, i % 3 ? stone : weathered, 5));
    if (i % 3 === 0) groundFragments.add(beam([x + side * .035, -1.1 + height * .55, z],
      [x + side * .24, -1.1 + height * .83, z + .04], .006, stone, 5));
  }
  function bareTree(x, z, height, material) {
    const trunkTop = [x + height * .08, -1.1 + height, z];
    groundFragments.add(beam([x, -1.1, z], trunkTop, .022, material, 6));
    for (let i = 0; i < 4; i += 1) {
      const side = i % 2 ? 1 : -1;
      const startY = -1.1 + height * (.4 + i * .13);
      const startX = x + height * .08 * (.4 + i * .13);
      const end = [startX + side * height * (.2 - i * .02), startY + height * (.24 - i * .025), z + (i % 2 ? .07 : -.06)];
      groundFragments.add(beam([startX, startY, z], end, .011 - i * .0013, material, 5));
      groundFragments.add(beam(end, [end[0] + side * height * .075, end[1] + height * .13, end[2]], .004, material, 5));
    }
  }
  bareTree(-3.64, -.68, 1.8, stone);
  bareTree(3.64, -.85, 1.56, weathered);
  bareTree(2.9, -1.85, 2.16, stone);
  reveal(groundFragments, 2.15, 1.6, .18, .5);

  const dustCount = 1000;
  const dustPositions = new Float32Array(dustCount * 3);
  let seed = 17391;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < dustCount; i += 1) {
    dustPositions[i * 3] = (random() - .5) * 13;
    dustPositions[i * 3 + 1] = (random() - .5) * 7 + .4;
    dustPositions[i * 3 + 2] = (random() - .5) * 6;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeometry,
    new THREE.PointsMaterial({ color: 0xc0ae8a, size: .018, transparent: true, opacity: .28, depthWrite: false }));
  scene.add(dust);

  const ambient = new THREE.HemisphereLight(0xd7ccb0, 0x071014, .37);
  scene.add(ambient);
  const key = new THREE.SpotLight(0xffe7af, 98, 24, .65, .72, 1.2);
  key.position.set(-3.7, 6.7, 5.7);
  key.target.position.set(.6, .4, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -.0002;
  scene.add(key, key.target);
  const fill = new THREE.PointLight(0x748db0, 10, 16, 2);
  fill.position.set(4.1, 2.6, 3.1);
  scene.add(fill);
  const underlight = new THREE.PointLight(0x9d3330, 5, 8, 2);
  underlight.position.set(.4, -1, 1.4);
  scene.add(underlight);

  const pointer = new THREE.Vector2();
  const pointerCurrent = new THREE.Vector2();
  const target = new THREE.Vector3(.68, .58, -.22);
  let active = false;
  let visible = true;
  let frame = 0;
  let startTime = 0;
  let elapsedSnapshot = 0;

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const smooth = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render(time) {
    frame = 0;
    if (!active || !visible) return;
    const elapsed = Math.max(0, (time - startTime) / 1000);
    elapsedSnapshot = elapsed;
    const cinematicTime = reducedMotion ? 14 : elapsed;
    const assembly = smooth((cinematicTime - 1.1) / 9.6);
    pointerCurrent.lerp(pointer, .035);

    revealNodes.forEach(item => {
      const progress = reducedMotion ? 1 : smooth((elapsed - item.delay) / (item.duration * 2.05));
      item.group.visible = progress > .002;
      const scale = item.fromScale + (1 - item.fromScale) * progress;
      item.group.scale.set(scale, scale, scale);
      item.group.position.y = item.baseY - item.lift * (1 - progress);
    });

    const orbit = -.19 + assembly * .32 + Math.max(0, cinematicTime - 10) * .018;
    camera.position.set(
      target.x + Math.sin(orbit) * 9.15 + pointerCurrent.x * .2,
      2.05 + Math.sin(cinematicTime * .23) * .11 + pointerCurrent.y * .13,
      target.z + Math.cos(orbit) * 9.15
    );
    camera.lookAt(target);
    root.rotation.y = -.12 + assembly * .08 + Math.sin(cinematicTime * .18) * .018;
    rearArchitecture.rotation.z = assembly * -.075;
    circularBody.rotation.z = -.045 + assembly * .085 + Math.max(0, cinematicTime - 10) * .002;
    shutters.rotation.z = -assembly * .08;
    shutterLeaves.forEach((leaf, index) => {
      leaf.rotation.z = assembly * (.06 + index % 3 * .025);
      leaf.children[0].rotation.y = assembly * 1.5;
    });
    wingHinge.rotation.y = -1.17 + assembly * 1.23 + Math.sin(cinematicTime * .24) * .025;
    wingHinge.rotation.z = -.38 + assembly * .38;
    blueBeads.forEach((bead, index) => {
      const angle = -.8 + index * .145 + cinematicTime * .035;
      const radius = 1.08 + index * .049;
      bead.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, .09 + index * .004);
    });
    dust.rotation.y = cinematicTime * .004;
    dust.position.y = Math.sin(cinematicTime * .31) * .04;
    const lightRise = reducedMotion ? 1 : smooth((cinematicTime - .2) / 6.8);
    ambient.intensity = .018 + lightRise * .36;
    key.intensity = (83 + Math.sin(cinematicTime * .7) * 13) * lightRise;
    fill.intensity = (11 + Math.sin(cinematicTime * .45) * 3) * lightRise;
    underlight.intensity = 5 * lightRise;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }

  function activate() {
    if (active) return;
    active = true;
    startTime = performance.now();
    resize();
    frame = requestAnimationFrame(render);
  }

  window.addEventListener("v31:opening-complete", activate, { once: true });
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", event => {
    pointer.set(event.clientX / innerWidth * 2 - 1, 1 - event.clientY / innerHeight * 2);
  }, { passive: true });
  new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? true;
    document.body.classList.toggle("is-architecture-home", visible);
    if (visible && active && !frame) frame = requestAnimationFrame(render);
  }, { threshold: .01 }).observe(canvas);
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden && canvas.getBoundingClientRect().bottom > 0;
    if (visible && active && !frame) frame = requestAnimationFrame(render);
  });

  resize();
  camera.position.set(-1, 2.05, 9);
  camera.lookAt(target);
  renderer.render(scene, camera);
  if (document.body.dataset.openingComplete === "true") activate();
  window.__homeArchitectureDebug = {
    get active() { return active; },
    get objects() { return revealNodes.length; },
    get elapsed() { return elapsedSnapshot; },
    get cameraX() { return camera.position.x; },
    get wingRotation() { return wingHinge.rotation.y; },
    get renderer() { return renderer; }
  };
})();
