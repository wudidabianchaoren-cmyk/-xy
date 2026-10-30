import fs from 'node:fs/promises';
const file='blender/reference-architecture-v20/polyphemus-v20.glb',b=await fs.readFile(file);
const length=b.readUInt32LE(12),j=JSON.parse(b.subarray(20,20+length)),binary=28+length;
const mat=j.materials.find(m=>m.name==='Human.body.001'),t=j.textures[mat.pbrMetallicRoughness.baseColorTexture.index],im=j.images[t.source],view=j.bufferViews[im.bufferView];
await fs.writeFile('assets/odyssey/pbr-v103/skin-atlas.png',b.subarray(binary+(view.byteOffset||0),binary+(view.byteOffset||0)+view.byteLength));
await fs.writeFile('assets/odyssey/pbr-v103/skin-source.json',JSON.stringify({source:file,material:mat.name,image:im.name,method:'Original embedded anatomy texture, extracted byte-for-byte; UV layout unchanged.'},null,2));
