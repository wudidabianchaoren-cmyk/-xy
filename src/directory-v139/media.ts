import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

type V = THREE.Vector3;
function canvas(w: number, h: number) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  return { c, x: c.getContext('2d')! };
}
function texture(c: HTMLCanvasElement, color = true) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8; return t;
}
function fitImage(x: CanvasRenderingContext2D, im: HTMLImageElement, bx: number, by: number, bw: number, bh: number, crop = false) {
  const s = (crop ? Math.max : Math.min)(bw / im.naturalWidth, bh / im.naturalHeight);
  x.save(); x.beginPath(); x.rect(bx, by, bw, bh); x.clip();
  x.drawImage(im, bx + (bw - im.naturalWidth * s) / 2, by + (bh - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s); x.restore();
}
// Different microsurfaces: neither paper nor moulded plastic is smooth metal.
function microSurface(kind: 'paper' | 'plastic') {
  const { c, x } = canvas(256, 256), { c: n, x: nx } = canvas(256, 256);
  const p = x.createImageData(256, 256), q = nx.createImageData(256, 256);
  let seed = kind === 'paper' ? 5731 : 971;
  const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let y = 0; y < 256; y++) for (let z = 0; z < 256; z++) {
    const j = (y * 256 + z) * 4, r = rand() - .5;
    const rough = kind === 'paper' ? 213 + r * 30 : 108 + r * 18;
    p.data[j] = p.data[j + 1] = p.data[j + 2] = rough; p.data[j + 3] = 255;
    q.data[j] = 128 + r * (kind === 'paper' ? 13 : 4);
    q.data[j + 1] = 128 + (rand() - .5) * (kind === 'paper' ? 13 : 4);
    q.data[j + 2] = 255; q.data[j + 3] = 255;
  }
  x.putImageData(p, 0, 0); nx.putImageData(q, 0, 0);
  const roughness = texture(c, false), normal = texture(n, false);
  for (const t of [roughness, normal]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); }
  return { roughness, normal };
}
function imageCover(id: number, im: HTMLImageElement) {
  const { c, x } = canvas(1024, 1440);
  if (id === 0) { fitImage(x, im, 0, 0, 1024, 1440); return c; }
  const ink = id === 1; x.fillStyle = ink ? '#252625' : '#2c403b'; x.fillRect(0, 0, 1024, 1440);
  x.fillStyle = ink ? '#eee9df' : '#e1d3ad'; x.font = '600 104px "SimSun",serif';
  x.fillText(ink ? '劈山' : '尤利西斯', 84, 194);
  x.font = '48px "SimSun",serif'; x.fillText(ink ? '杨戬救母' : '嘲弄波吕菲摩斯', 88, 276);
  fitImage(x, im, 84, 354, 856, 760, true);
  x.font = '28px "SimSun",serif'; x.fillText(ink ? '水墨 · 声音 · 交互叙事' : '光影 · 材质 · 实时三维', 88, 1280);
  return c;
}
function rotatePrint(source: HTMLCanvasElement) {
  const { c, x } = canvas(source.height, source.width); x.translate(c.width / 2, c.height / 2);
  x.rotate(Math.PI / 2); x.drawImage(source, -source.width / 2, -source.height / 2); return texture(c);
}
function spinePrint(title: string, index: number) {
  const { c, x } = canvas(2048, 192), letters = [...title.replace(/[ ·]/g, '')];
  x.fillStyle = '#ede4cf'; x.textAlign = 'center'; x.textBaseline = 'middle';
  const step = Math.min(160, 1460 / letters.length), start = 1024 + (letters.length - 1) * step / 2;
  x.font = '600 126px "SimSun",serif';
  letters.forEach((letter, i) => { x.save(); x.translate(start - i * step, 96); x.rotate(Math.PI / 2); x.fillText(letter, 0, 0); x.restore(); });
  x.save(); x.translate(235, 96); x.rotate(Math.PI / 2); x.font = '68px Georgia,serif'; x.fillText(String(index + 1).padStart(2, '0'), 0, 0); x.restore();
  return texture(c);
}
function pageMap() {
  const { c, x } = canvas(512, 256); x.fillStyle = '#dfd7c6'; x.fillRect(0, 0, 512, 256);
  for (let y = 0; y < 256; y++) {
    x.fillStyle = `rgba(98,80,54,${.018 + (y * 17 % 11) / 340})`; x.fillRect(0, y, 512, 1);
    if (y % 17 === 0) { x.fillStyle = 'rgba(255,251,234,.18)'; x.fillRect(0, y, 512, 1); }
  }
  return texture(c);
}
function filmCover(im: HTMLImageElement, title: string, i: number) {
  const { c, x } = canvas(1024, 1024), colors = ['#e0e4d7', '#d8c4a8', '#c2cfdb', '#ced5bd', '#b9c8af'];
  x.fillStyle = colors[i]; x.fillRect(0, 0, 1024, 1024); x.fillStyle = '#26332f';
  x.textAlign = 'left'; x.font = '600 82px "SimSun",serif'; x.fillText(title, 58, 152, 830);
  fitImage(x, im, 44, 220, 936, 590);
  x.font = '112px Georgia,serif'; x.fillText(String(i + 1).padStart(2, '0'), 58, 960);
  x.textAlign = 'right'; x.font = '32px Georgia,serif'; x.fillText('MIND UNIVERSE / FILM', 958, 944);
  return texture(c);
}
function mesh(g: THREE.Group, geometry: THREE.BufferGeometry, material: THREE.Material, at: [number, number, number]) {
  const m = new THREE.Mesh(geometry, material); m.position.set(...at); g.add(m); return m;
}

export async function createMedia(loader: THREE.TextureLoader, linenNormal: THREE.Texture, linenRough: THREE.Texture) {
  const books: THREE.Group[] = [], bookStarts: V[] = [], tapes: THREE.Group[] = [], tapeStarts: V[] = [];
  const titles = ['电影美学', '劈山 · 杨戬救母', '尤利西斯'];
  const sources = ['./assets/reading/cinema-aesthetics/cover-v32-79.png', './assets/yangjian-v116/video/opening-poster.png', './assets/odyssey/turner-ulysses-1829.jpg'];
  const covers = await Promise.all(sources.map(u => loader.loadAsync(u))), page = pageMap();
  const paperSurface = microSurface('paper'), plasticSurface = microSurface('plastic');
  const weaveN = linenNormal.clone(), weaveR = linenRough.clone();
  for (const t of [weaveN, weaveR]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2.5, 4); t.needsUpdate = true; }
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group(); g.name = 'Standing cloth reading volume / ' + titles[i];
    const cloth = new THREE.MeshPhysicalMaterial({ color: [0x68705d, 0x53534d, 0x45625a][i], roughness: .91, roughnessMap: weaveR, normalMap: weaveN, normalScale: new THREE.Vector2(.16, .16), sheen: .24, sheenColor: new THREE.Color(0xaaa28a), sheenRoughness: .9, envMapIntensity: .72 });
    const paper = new THREE.MeshStandardMaterial({ color: 0xf2ebdc, map: page, roughness: 1, roughnessMap: paperSurface.roughness, normalMap: paperSurface.normal, normalScale: new THREE.Vector2(.09, .09) });
    mesh(g, new RoundedBoxGeometry(.453, .043, .283, 2, .0011), paper, [0, 0, -.010]);
    for (const y of [-.0275, .0275]) mesh(g, new RoundedBoxGeometry(.47, .0065, .32, 3, .0015), cloth, [0, y, 0]);
    const spine = mesh(g, new THREE.CylinderGeometry(.028, .028, .46, 28), cloth, [0, 0, .138]); spine.rotation.z = Math.PI / 2;
    const jacket = mesh(g, new THREE.PlaneGeometry(.433, .307), new THREE.MeshPhysicalMaterial({ map: rotatePrint(imageCover(i, covers[i].image as HTMLImageElement)), roughness: .9, roughnessMap: paperSurface.roughness, normalMap: paperSurface.normal, normalScale: new THREE.Vector2(.08, .08), clearcoat: .045, clearcoatRoughness: .7, envMapIntensity: .55 }), [0, .0311, 0]); jacket.rotation.x = -Math.PI / 2;
    const geo = new THREE.PlaneGeometry(.412, .029, 12, 6), a = geo.getAttribute('position');
    for (let n = 0; n < a.count; n++) { const y = a.getY(n); a.setZ(n, Math.sqrt(.028 * .028 - y * y) - .028 + .00025); } geo.computeVertexNormals();
    mesh(g, geo, new THREE.MeshStandardMaterial({ map: spinePrint(titles[i], i), transparent: true, alphaTest: .035, depthWrite: false, roughness: .81, envMapIntensity: .5 }), [0, 0, .166]);
    // Headbands are woven fabric at the ends of a bound book, not metal trim.
    const headband = new THREE.MeshStandardMaterial({ color: 0xb3a486, roughness: .92 });
    for (const x of [-.224, .224]) mesh(g, new RoundedBoxGeometry(.0025, .041, .013, 2, .001), headband, [x, 0, .123]);
    g.position.set(1.02 + [2,0,1][i] * .10, .99, -.38); g.rotation.set(0, .28, Math.PI / 2, 'YXZ');
    g.userData.pickKey = 'book' + i; g.userData.materialKind = 'woven cloth binding / matte printed cover / ivory paper block';
    books.push(g); bookStarts.push(g.position.clone());
  }
  const names = ['让画面发生', '后西游记', '中秋之夜', '乡土归途', '潮湿东南亚'];
  const arts = await Promise.all(['./assets/works/covers-v139/code-films.webp', './assets/works/after-journey/cover-v32-92.webp', './assets/works/covers-v137/mid-autumn.webp', './assets/works/covers-v137/rural.webp', './assets/works/humid-southeast-asia/cover.webp'].map(u => loader.loadAsync(u)));
  for (let i = 0; i < names.length; i++) {
    const g = new THREE.Group(); g.name = 'Individually selectable film CD / ' + names[i];
    g.userData.pickKey = 'tape' + i; g.userData.materialKind = 'moulded polycarbonate case / printed paper insert / aluminium optical disc';
    const plastic = new THREE.MeshPhysicalMaterial({ color: 0xd5ddda, roughness: .48, roughnessMap: plasticSurface.roughness, normalMap: plasticSurface.normal, normalScale: new THREE.Vector2(.055, .055), metalness: 0, transparent: true, opacity: .17, depthWrite: false, clearcoat: .86, clearcoatRoughness: .19, envMapIntensity: .78 });
    const trayMat = new THREE.MeshStandardMaterial({ color: 0x2b302f, roughness: .48, roughnessMap: plasticSurface.roughness, envMapIntensity: .65 });
    mesh(g, new RoundedBoxGeometry(.212, .004, .208, 3, .0015), trayMat, [0, -.0045, 0]);
    // Actual subtle moulded sidewalls and hinges, not bright drawn outlines.
    for (const [x, z, w, d] of [[-.106, 0, .0015, .21], [.106, 0, .0015, .21], [0, -.104, .211, .0015], [0, .104, .211, .0015]]) mesh(g, new RoundedBoxGeometry(w, .012, d, 2, .00055), plastic, [x, 0, z]);
    const disc = mesh(g, new THREE.RingGeometry(.009, .096, 64), new THREE.MeshPhysicalMaterial({ color: 0xc8ccca, metalness: .88, roughness: .28, clearcoat: .12, iridescence: .18, iridescenceIOR: 1.35, iridescenceThicknessRange: [260, 360], envMapIntensity: .75, side: THREE.DoubleSide }), [0, -.0018, 0]); disc.rotation.x = -Math.PI / 2;
    const hub = mesh(g, new THREE.TorusGeometry(.0093, .0012, 6, 32), trayMat, [0, -.0008, 0]); hub.rotation.x = -Math.PI / 2;
    const print = mesh(g, new THREE.PlaneGeometry(.193, .193), new THREE.MeshStandardMaterial({ map: filmCover(arts[i].image as HTMLImageElement, names[i], i), roughness: .9, roughnessMap: paperSurface.roughness, normalMap: paperSurface.normal, normalScale: new THREE.Vector2(.05, .05), envMapIntensity: .5 }), [0, .001, 0]); print.rotation.x = -Math.PI / 2;
    mesh(g, new RoundedBoxGeometry(.211, .001, .207, 2, .00045), plastic, [0, .006, 0]);
    for (const z of [-.070, .070]) mesh(g, new RoundedBoxGeometry(.004, .009, .014, 2, .0007), plastic, [-.105, 0, z]);
    const slot=[[.405,.895,.245],[.645,.895,.245],[.525,1.105,-.005],[.765,1.105,-.005],[.885,.895,.245]][i];g.position.set(...slot as [number,number,number]);g.rotation.x=1.40;g.userData.sharedRack='five-film stepped rack';
    tapes.push(g); tapeStarts.push(g.position.clone());
  }
  return { books, bookStarts, tapes, tapeStarts };
}
