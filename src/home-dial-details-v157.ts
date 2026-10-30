import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
/** Small applied gilt chapter details on the existing astronomical clock faces. */
export function accentClockV157(scene:T.Scene){
 const gilt=new T.MeshStandardMaterial({name:'V157 aged gilt chapter accents',color:0xb88b3c,metalness:.88,roughness:.32,envMapIntensity:.62}),parts:T.BufferGeometry[]=[];
 for(const [cy,r]of [[5.45,1.94],[1.77,1.43]]){
  const rim=new T.TorusGeometry(r+.012,.012,8,144);rim.translate(-.15,cy,.15);parts.push(rim);
  const shape=new T.Shape();shape.moveTo(0,.065);shape.bezierCurveTo(.028,.02,.032,-.025,0,-.052);shape.bezierCurveTo(-.032,-.025,-.028,.02,0,.065);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2,g=new T.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2,steps:1});g.rotateZ(-a);g.translate(-.15+Math.sin(a)*(r-.10),cy+Math.cos(a)*(r-.10),.16);parts.push(g);}
 }
 const geometry=mergeGeometries(parts.map(g=>{const flat=g.index?g.toNonIndexed():g;flat.deleteAttribute('uv');return flat;}),false),detail=new T.Mesh(geometry,gilt);detail.name='V157 chased astronomical chapter rims and lancet index details';detail.castShadow=false;detail.receiveShadow=true;scene.add(detail);parts.forEach(g=>g.dispose());
 const seen=new Set<T.Material>();let chapters=0;scene.traverse(o=>{if(!(o instanceof T.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(seen.has(m))continue;seen.add(m);if(m instanceof T.MeshStandardMaterial&&/machined silver chapter|chased pale gold|burnished solar copper/i.test(m.name)){m.color.setRGB(.59,.36,.12);m.metalness=.89;m.roughness=.34;m.envMapIntensity=.62;chapters++;}}});
 return{newTriangles:geometry.attributes.position.count/3,chapterMaterials:chapters,originalDialsAndHandsRetained:true,style:'chased gilt rims and lancet chapter accents'};
}
