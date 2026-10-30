import * as THREE from 'three';
import {courtyardPoint} from './home-restoration';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {ageMasonry} from './home-surfaces';
import {buildArchiveQuarter} from './home-quarter';

/** Additive courtyard furnishings. Coordinates share the existing V16 world and six cameras. */
export function createMedievalDetails(scene:THREE.Scene,maps:{map:THREE.Texture;normalMap:THREE.Texture;roughnessMap:THREE.Texture},timber?:{map:THREE.Texture;normalMap:THREE.Texture;roughnessMap:THREE.Texture}){
  const root=new THREE.Group();root.name='V32.70 / inhabited medieval archive quarter';scene.add(root);
  const stone=new THREE.MeshStandardMaterial({...maps,color:0xc6c1ae,roughness:.89,normalScale:new THREE.Vector2(.65,.65),envMapIntensity:.38});ageMasonry(stone,.18);
  const westStone=new THREE.MeshStandardMaterial({...maps,color:0xa8ae9e,roughness:.93,normalScale:new THREE.Vector2(.52,.52),envMapIntensity:.40});ageMasonry(westStone,.25);
  const blueStone=new THREE.MeshStandardMaterial({...maps,color:0x6e7e82,roughness:.95,normalScale:new THREE.Vector2(.47,.47),envMapIntensity:.35});ageMasonry(blueStone,.24);
  const dark=new THREE.MeshStandardMaterial({color:0x252018,roughness:.7,metalness:.18});
  const gold=new THREE.MeshStandardMaterial({color:0xb6944c,metalness:.92,roughness:.3,envMapIntensity:1.15});
  const oak=new THREE.MeshStandardMaterial({...timber,color:0x6d4831,normalScale:new THREE.Vector2(.25,.25),roughness:.84,envMapIntensity:.24});
  const plaster=new THREE.MeshStandardMaterial({color:0xb8ab90,normalMap:maps.normalMap,roughnessMap:maps.roughnessMap,normalScale:new THREE.Vector2(.12,.12),roughness:.96,envMapIntensity:.23});ageMasonry(plaster,.07);
  const vellum=new THREE.MeshStandardMaterial({color:0xd3ba87,roughness:.96,side:THREE.DoubleSide});
  const red=new THREE.MeshStandardMaterial({color:0x642c25,roughness:.89,side:THREE.DoubleSide});
  const blue=new THREE.MeshPhysicalMaterial({color:0x073d43,metalness:.12,roughness:.24,clearcoat:.55,clearcoatRoughness:.23});
  const glass=new THREE.MeshPhysicalMaterial({color:0xa36b27,metalness:.08,roughness:.23,clearcoat:.7,emissive:0x54270a,emissiveIntensity:.23});
  const slate=new THREE.MeshStandardMaterial({color:0x26343b,roughness:.84,metalness:.08});
  const leafGreen=new THREE.MeshStandardMaterial({color:0x485144,roughness:1});
  const pieces=new Map<THREE.Material,THREE.BufferGeometry[]>();
  function add(g:THREE.BufferGeometry,m:THREE.Material,p:number[],r:number[]=[0,0,0]){
    const matrix=new THREE.Matrix4().compose(new THREE.Vector3(...p as [number,number,number]),new THREE.Quaternion().setFromEuler(new THREE.Euler(...r as [number,number,number])),new THREE.Vector3(1,1,1));
    const geometry=g.index?g.toNonIndexed():g.clone();geometry.applyMatrix4(matrix);
    if(!geometry.attributes.uv)geometry.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.position.count*2),2));
    // Stone veins are sampled at the same metre scale as the native masonry.
    if([stone,westStone,blueStone].includes(m as THREE.MeshStandardMaterial)){const p=geometry.attributes.position,u=geometry.attributes.uv,n=geometry.attributes.normal;for(let i=0;i<p.count;i++){const x=Math.abs(n.getX(i)),y=Math.abs(n.getY(i)),z=Math.abs(n.getZ(i));u.setXY(i,(x>y&&x>z?p.getZ(i):p.getX(i))*.45,(y>x&&y>z?p.getZ(i):p.getY(i))*.45);}}
    const parts=pieces.get(m)??[];parts.push(geometry);pieces.set(m,parts);g.dispose();
  }
  const box=(p:number[],s:number[],m:THREE.Material)=>add(new RoundedBoxGeometry(...s as [number,number,number],2,Math.min(...s)*.12),m,p);
  function rod(a:number[],b:number[],radius:number,m:THREE.Material){const start=new THREE.Vector3(...a as [number,number,number]),end=new THREE.Vector3(...b as [number,number,number]);const g=new THREE.CylinderGeometry(radius,radius,end.distanceTo(start),8);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize()));add(g,m,new THREE.Vector3(...a as [number,number,number]).add(new THREE.Vector3(...b as [number,number,number])).multiplyScalar(.5).toArray());}
  function curve(points:number[][],radius:number,m:THREE.Material){add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p as [number,number,number]))),36,radius,8,false),m,[0,0,0]);}
  function ring(p:number[],radius:number,tube:number,m:THREE.Material,r:number[]=[0,0,0]){add(new THREE.TorusGeometry(radius,tube,8,72),m,p,r);}
  function pointedHole(x:number,y:number,w:number,h:number){const p=new THREE.Path();p.moveTo(x-w/2,y);p.lineTo(x-w/2,y+h*.58);p.quadraticCurveTo(x-w*.46,y+h*.82,x,y+h);p.quadraticCurveTo(x+w*.46,y+h*.82,x+w/2,y+h*.58);p.lineTo(x+w/2,y);p.closePath();return p;}
  // The clock is the front of an inhabited tower: deep rear wings and a masonry
  // stair turret extend beyond its face, so their side surfaces remain visible.
  for(const side of [-1,1]){
    const x=side*2.62,h=side===1?6.92:5.45;
    box([x,h/2,-4.0],[1.9,h,5.7],side===1?stone:westStone);
    for(const edge of [-1,1])box([x+edge*.83,h/2,-1.05],[.23,h,.35],stone);
    for(const y of [1.0,3.1,5.15])if(y+.8<h){box([x,y,-.96],[.51,1.24,.055],dark);box([x,y,-.92],[.33,1.02,.03],glass);rod([x,y-.48,-.87],[x,y+.48,-.87],.025,gold);box([x,y-.65,-.89],[.78,.14,.34],stone);}
    for(const slope of [-1,1])add(new RoundedBoxGeometry(1.42,.15,6.15,2,.025),slate,[x+slope*.47,h+.28,-3.95],[0,0,-slope*.47]);
    box([x,h+.53,-3.95],[.12,.12,6.2],dark);
  }
  for(const x of [-14.8,13.6]){rod([x,0,4.8],[x,2.5,4.8],.055,dark);box([x,2.45,4.8],[.31,.47,.29],glass);box([x,2.70,4.8],[.44,.09,.40],dark);}
  // Deep west guildhouse, retaining the original window locations and light interaction.
  const westFacade=new THREE.Shape();westFacade.moveTo(-1.10,0);westFacade.lineTo(1.10,0);westFacade.lineTo(1.10,4.06);westFacade.lineTo(0,5.04);westFacade.lineTo(-1.10,4.06);westFacade.closePath();
  westFacade.holes.push(pointedHole(0,.43,.79,1.40),pointedHole(0,2.28,.85,1.45));
  const roseHole=new THREE.Path();roseHole.absarc(0,4.54,.37,0,Math.PI*2,true);westFacade.holes.push(roseHole);
  add(new THREE.ExtrudeGeometry(westFacade,{depth:.45,bevelEnabled:true,bevelSize:.027,bevelThickness:.025,bevelSegments:3}),westStone,[-8.1,0,-1.59]);
  for(const x of [-9.09,-7.11])box([x,1.99,-2.94],[.30,3.98,2.75],westStone);
  box([-8.1,1.99,-4.28],[2.05,3.98,.35],westStone);
  box([-8.1,.12,-2.67],[2.50,.24,3.58],stone);
  for(const y of [.45,2.28])for(const side of [-1,1]){const x=-8.1+side*.51;box([x,y+.51,-1.05],[.13,1.02,.30],stone);curve([[x,y+1.0,-1.0],[-8.1+side*.30,y+1.36,-1.0],[-8.1,y+1.59,-1.0]],.076,stone);}
  for(const side of [-1,1]){
    const g=new RoundedBoxGeometry(1.62,.12,3.58,2,.035);add(g,slate,[-8.1+side*.56,4.54,-2.68],[0,0,-side*.73]);
    for(let i=0;i<7;i++)for(let j=0;j<13;j++){const xx=side*(.08+i*.158);add(new RoundedBoxGeometry(.20,.045,.29,1,.012),slate,[-8.1+xx,5.03-Math.abs(xx)*.90+.035,-4.34+j*.265],[0,0,-side*.73]);}
  }
  for(const y of [1.96,3.95])box([-8.1,y,-1.13],[2.28,.10,.35],stone);
  function shield(x:number,y:number,z:number,scale:number,colour:THREE.Material){
    const shape=new THREE.Shape();shape.moveTo(-.40,.48);shape.lineTo(.40,.48);shape.lineTo(.36,-.09);shape.quadraticCurveTo(.22,-.44,0,-.60);shape.quadraticCurveTo(-.22,-.44,-.36,-.09);shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth:.09,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2});g.scale(scale,scale,scale);add(g,colour,[x,y,z]);
    // Raised trefoil and lily relief, rather than a decal or a flat image.
    const stem=.34*scale;rod([x,y-stem*.85,z+.13],[x,y+stem*.88,z+.13],.022*scale,gold);
    for(const side of [-1,1])curve([[x,y+.18*scale,z+.13],[x+side*.14*scale,y+.36*scale,z+.13],[x+side*.22*scale,y+.13*scale,z+.13],[x+side*.08*scale,y-.07*scale,z+.13]],.023*scale,gold);
    rod([x-.16*scale,y-.02*scale,z+.14],[x+.16*scale,y-.02*scale,z+.14],.019*scale,gold);
  }
  // Rose tracery stays above the west window; its original light and silhouettes remain visible.
  const rose=[-8.1,4.54,-1.20];ring(rose,.46,.057,stone);ring([rose[0],rose[1],rose[2]+.035],.375,.022,dark);
  add(new THREE.CircleGeometry(.37,48),glass,[rose[0],rose[1],rose[2]+.008]);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;ring([rose[0]+Math.sin(a)*.205,rose[1]+Math.cos(a)*.205,rose[2]+.055],.145,.018,stone);}
  ring([rose[0],rose[1],rose[2]+.06],.095,.021,gold);
  for(const [x,y,z] of [[-2.76,4.15,.08],[2.61,4.15,.08]])shield(x,y,z,.70,blue);
  // Brocade hanging from wrought brackets flanks the dial rather than covering it.
  for(const side of [-1,1]){
    const x=side<0?-3.27:3.15,y=4.7,z=-.65;
    rod([x-.38,y+.15,z],[x+.38,y+.15,z],.035,dark);
    const geometry=new THREE.PlaneGeometry(.59,2.35,10,24),p=geometry.attributes.position;
    for(let i=0;i<p.count;i++){const xx=p.getX(i),yy=p.getY(i);p.setZ(i,.07*Math.cos(xx*24)+.055*Math.sin(yy*5));p.setY(i,yy-(yy<-.85?.11*(1-Math.abs(xx)/.30):0));}geometry.computeVertexNormals();add(geometry,red,[x,y-1.10,z]);
    rod([x-.265,y-.02,z+.09],[x-.265,y-2.17,z+.09],.008,gold);rod([x+.265,y-.02,z+.09],[x+.265,y-2.17,z+.09],.008,gold);
    shield(x,y-.91,z+.105,.37,gold);
  }
  // Carved crockets provide readable profiles in the existing automaton and window shots.
  for(const x of [-2.4,2.15])for(const y of [2.9,5.8,8.3]){
    add(new THREE.ConeGeometry(.095,.28,6),stone,[x,y+.12,-.40]);
    for(const side of [-1,1])add(new THREE.SphereGeometry(.069,8,6),stone,[x+side*.075,y+.035,-.40]);
  }
  // A coherent four-bay Gothic cloister replaces the small detached arcade.
  // Western stone campanile around the retained, interactive bronze bell.
  const bellWall=new THREE.Shape();bellWall.moveTo(-.64,.12);bellWall.lineTo(.64,.12);bellWall.lineTo(.64,3.42);bellWall.lineTo(-.64,3.42);bellWall.closePath();bellWall.holes.push(pointedHole(0,1.80,.38,1.17));
  add(new THREE.ExtrudeGeometry(bellWall,{depth:.28,bevelEnabled:true,bevelSize:.017,bevelThickness:.017,bevelSegments:2}),westStone,[-4.75,0,-2.62]);
  box([-4.75,1.68,-3.43],[1.35,3.31,.28],westStone);
  for(const x of [-5.28,-4.22])box([x,1.71,-2.88],[.29,3.38,1.23],westStone);
  box([-4.75,.15,-2.89],[1.66,.28,1.76],stone);
  for(const x of [-5.20,-4.30])for(const z of [-3.22,-2.40])box([x,2.58,z],[.17,4.97,.17],stone);
  for(const y of [.32,1.58,3.25,5.06])box([-4.75,y,-2.81],[1.17,.12,1.12],stone);
  for(const y of [.40,1.66,3.33])for(const x of [-5.20,-4.30])box([x,y+.09,-2.39],[.27,.12,.25],stone);
  for(const y of [1.65,3.36]){
    const shape=new THREE.Shape();shape.moveTo(-.38,0);shape.quadraticCurveTo(-.36,.39,0,.58);shape.quadraticCurveTo(.36,.39,.38,0);shape.lineTo(.29,0);shape.quadraticCurveTo(.27,.31,0,.47);shape.quadraticCurveTo(-.27,.31,-.29,0);shape.closePath();
    add(new THREE.ExtrudeGeometry(shape,{depth:.10,bevelEnabled:true,bevelSize:.012,bevelThickness:.01,bevelSegments:2}),stone,[-4.75,y,-2.34]);
  }
  const roof=new THREE.Shape();roof.moveTo(-.69,0);roof.lineTo(0,.86);roof.lineTo(.69,0);roof.lineTo(.59,-.05);roof.lineTo(0,.72);roof.lineTo(-.59,-.05);roof.closePath();
  add(new THREE.ExtrudeGeometry(roof,{depth:1.22,bevelEnabled:true,bevelSize:.013,bevelThickness:.012,bevelSegments:2}),slate,[-4.75,5.15,-3.43]);
  const gable=new THREE.Shape();gable.moveTo(-.60,0);gable.lineTo(.60,0);gable.lineTo(0,.74);gable.closePath();
  for(const z of [-3.40,-2.30])add(new THREE.ExtrudeGeometry(gable,{depth:.12,bevelEnabled:true,bevelSize:.014,bevelThickness:.014,bevelSegments:2}),westStone,[-4.75,5.12,z]);
  for(const side of [-1,1])add(new RoundedBoxGeometry(.99,.09,1.59,2,.02),slate,[-4.75+side*.32,5.52,-2.80],[0,0,-side*.89]);
  rod([-4.75,5.94,-3.43],[-4.75,5.94,-2.21],.035,dark);
  // Deep pointed archivolts, masonry piers, capitals and vault ribs share the hall's stone.
  box([7.93,.11,-.25],[4.40,.20,1.02],stone);
  for(let i=0;i<5;i++){
    const x=5.95+i*.99;
    box([x,.19,-.24],[.40,.17,.88],stone);box([x,.72,-.25],[.19,1.03,.65],stone);
    box([x,1.24,-.25],[.33,.13,.78],stone);
    for(const side of [-1,1])curve([[x+side*.09,.30,.10],[x+side*.075,.72,.10],[x+side*.075,1.21,.10]],.018,stone);
  }
  for(let i=0;i<4;i++){
    const x=6.445+i*.99;
    const shape=new THREE.Shape();shape.moveTo(-.46,0);shape.quadraticCurveTo(-.45,.44,0,.72);shape.quadraticCurveTo(.45,.44,.46,0);
    shape.lineTo(.34,0);shape.quadraticCurveTo(.32,.35,0,.58);shape.quadraticCurveTo(-.32,.35,-.34,0);shape.closePath();
    add(new THREE.ExtrudeGeometry(shape,{depth:.66,bevelEnabled:true,bevelSize:.018,bevelThickness:.014,bevelSegments:2}),stone,[x,1.28,.10]);
    for(const side of [-1,1])curve([[x+side*.40,1.28,.12],[x+side*.29,1.69,.12],[x,1.92,.12]],.030,stone);
    // The rear vault joins the main building; it is an inhabited portico rather than loose arch toys.
    curve([[x-.40,1.28,-.50],[x,1.79,-.77],[x+.40,1.28,-.50]],.036,stone);
  }
  box([7.93,2.035,-.24],[4.42,.10,.87],stone);box([7.93,2.13,-.24],[4.54,.075,.94],stone);
  // Paired buttresses and dressed corner stones give both wings depth in shadow.
  for(const x of [-9.08,-7.13]){
    box([x,1.6,-1.24],[.20,3.05,.32],stone);box([x,.18,-1.18],[.34,.25,.45],stone);
    for(let y=.48;y<3.7;y+=.39)box([x,y,-1.057],[.27,.12,.09],stone);
  }
  for(const x of [5.55,10.03]){
    const h=x<6?2.48:5.85;box([x,h*.5,-.70],[.25,h,.48],stone);
    for(let y=.28;y<h;y+=.43)box([x,y,-.435],[.29,.115,.085],stone);
  }
  // A restrained carved frieze at the eastern eave is visible during the original three-window shot.
  for(let i=0;i<9;i++){const x=5.98+i*.49,y=2.21;ring([x,y,-.61],.104,.025,stone);add(new THREE.SphereGeometry(.026,8,6),gold,[x,y,-.565]);}
  // Buildings stand on the retained, level, 24 cm native paving. No second platform or broad steps.
  const quarterLabels=buildArchiveQuarter({add,box,rod,curve,stone,blueStone,oak,slate,glass,dark,gold,plaster});
  // A coherent archive guild: illuminated heraldry, a cloister garden and carved book emblems.
  // Furnishings stay against the wings, keeping the central clock and foreground sightline open.
  for(const [x,z] of [[-6.15,-3.55],[10.5,-3.1]]){
    rod([x,.10,z],[x,3.25,z],.039,dark);rod([x-.43,3.15,z],[x+.43,3.15,z],.028,gold);
    const banner=new THREE.Shape();banner.moveTo(-.36,0);banner.lineTo(.36,0);banner.lineTo(.36,-1.33);banner.lineTo(0,-1.64);banner.lineTo(-.36,-1.33);banner.closePath();
    add(new THREE.ExtrudeGeometry(banner,{depth:.025,bevelEnabled:false}),red,[x,3.10,z+.03]);
    ring([x,2.45,z+.07],.20,.019,gold);rod([x-.13,2.44,z+.09],[x+.13,2.44,z+.09],.015,gold);rod([x,2.26,z+.09],[x,2.64,z+.09],.015,gold);
    box([x,.12,z],[.38,.22,.38],stone);
  }
  for(const x of [-9.55,10.65]){
    box([x,.18,-5.80],[.80,.48,2.00],blueStone);box([x,.44,-5.8],[.84,.10,2.04],stone);
    for(let n=0;n<5;n++){const z=-6.50+n*.33;rod([x,.5,z],[x,1.0+n%2*.20,z],.016,dark);
      for(const side of [-1,1]){const leaf=new THREE.SphereGeometry(.12,8,6);leaf.scale(.7,1.65,.4);add(leaf,leafGreen,[x+side*.10,.76+n%2*.18,z],[0,0,side*.68]);}
    }
  }
  for(const x of [5.95,9.91]){
    // Two tiny carved manuscript reliefs on the capitals, rather than loose modern props.
    for(const side of [-1,1])box([x+side*.074,1.20,.131],[.137,.20,.065],vellum);
    rod([x,1.10,.18],[x,1.30,.18],.012,gold);
  }
  for(const [material,geometries] of pieces){const geometry=mergeGeometries(geometries);if(!geometry)throw Error('Medieval detail batching failed');const position=geometry.attributes.position;for(let i=0;i<position.count;i++){const q=courtyardPoint(new THREE.Vector3().fromBufferAttribute(position,i));position.setXYZ(i,q.x,q.y,q.z);}const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=mesh.receiveShadow=true;mesh.name='Medieval solid relief and furnishings / '+material.uuid;root.add(mesh);geometries.forEach(g=>g.dispose());}
  const words:THREE.Mesh[]=[];
  for(const [text,x,y,z] of [['ASTRONOMIA',-10.8,6.85,-13.8],['MEMORIA',9.8,7.05,-13.0]] as [string,number,number,number][]){const c=document.createElement('canvas');c.width=1024;c.height=160;const ctx=c.getContext('2d')!;ctx.font='36px Georgia';ctx.letterSpacing='10px';ctx.fillStyle='#aa9568';ctx.fillText(text,30,105);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(4.7,.735),new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:.31,depthWrite:false}));m.position.set(x,y,z);m.userData.originY=y;scene.add(m);words.push(m);}
  return{root,labels:['rose tracery and warm glass','raised heraldic lilies','brocade standards','carved clock crockets','four-bay pointed Gothic cloister','dressed quoins and engaged buttresses','masonry bell tower with original bronze bell','deep west guildhouse and perched cat','level native paving without a second platform','inhabited side streets without the former dome or fortress wall','archive guild standards','walled cloister planting beds','carved manuscript capitals',...quarterLabels],update:(t:number)=>{glass.emissiveIntensity=.23+.07*Math.sin(t*.47)+.018*Math.sin(t*2.3);words.forEach((m,i)=>{m.position.y=m.userData.originY+.08*Math.sin(t*.21+i);m.rotation.y=.035*Math.sin(t*.12+i);});}};
}
