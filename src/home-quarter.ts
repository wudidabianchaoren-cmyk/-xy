import * as THREE from 'three';

type Builder={add:(g:THREE.BufferGeometry,m:THREE.Material,p:number[],r?:number[])=>void;box:(p:number[],s:number[],m:THREE.Material)=>void;rod:(a:number[],b:number[],r:number,m:THREE.Material)=>void;curve:(p:number[][],r:number,m:THREE.Material)=>void;stone:THREE.Material;blueStone:THREE.Material;oak:THREE.Material;slate:THREE.Material;glass:THREE.Material;dark:THREE.Material;gold:THREE.Material;plaster:THREE.Material};

/** Inhabited side streets share the existing ground and leave the clock's central silhouette open. */
export function buildArchiveQuarter(b:Builder){
  const {add,box,rod,curve,stone,blueStone,oak,slate,glass,dark,gold,plaster}=b;
  const arch=(x:number,y:number,z:number,w:number,h:number)=>{
    const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(-w/2,h*.60);s.quadraticCurveTo(-w*.44,h*.84,0,h);s.quadraticCurveTo(w*.44,h*.84,w/2,h*.60);s.lineTo(w/2,0);s.closePath();
    add(new THREE.ExtrudeGeometry(s,{depth:.13,bevelEnabled:true,bevelSize:.015,bevelThickness:.012,bevelSegments:2}),dark,[x,y,z]);
    const frame=[[-w/2,0],[ -w/2,h*.60],[-w*.28,h*.86],[0,h],[w*.28,h*.86],[w/2,h*.60],[w/2,0]].map(p=>[x+p[0],y+p[1],z+.17]);curve(frame,.055,stone);
    box([x,y+.03,z+.20],[w+.19,.12,.30],stone);
    box([x,y+h*.38,z+.155],[w*.71,h*.67,.04],glass);
    rod([x,y+.09,z+.21],[x,y+h*.83,z+.21],.021,oak);rod([x-w*.31,y+h*.43,z+.21],[x+w*.31,y+h*.43,z+.21],.020,oak);
  };
  function guildHouse(x:number,z:number,w:number,h:number,d:number,timber:boolean){
    box([x,h*.5,z-d*.5],[w,h,d],timber?plaster:blueStone);
    box([x,.22,z-d*.5],[w+.12,.40,d+.12],stone);
    const gable=new THREE.Shape();gable.moveTo(-w*.5,0);gable.lineTo(w*.5,0);gable.lineTo(0,1.38);gable.closePath();
    add(new THREE.ExtrudeGeometry(gable,{depth:d,bevelEnabled:true,bevelSize:.015,bevelThickness:.012,bevelSegments:2}),timber?plaster:stone,[x,h,z-d]);
    const slope=Math.atan2(1.43,w*.5+.10),length=Math.hypot(w*.5+.10,1.43);
    for(const side of [-1,1]){
      add(new THREE.BoxGeometry(length,.11,d+.33),slate,[x+side*w*.25,h+.72,z-d*.5],[0,0,-side*slope]);
      for(let row=0;row<6;row++)for(let col=0;col<9;col++){
        const dx=side*(.08+row*(w*.5)/6);add(new THREE.BoxGeometry(w/11,.035,(d+.20)/9),slate,[x+dx,h+1.41-Math.abs(dx)*Math.tan(slope)+.026,z-d-.06+col*(d+.24)/9],[0,0,-side*slope]);
      }
      rod([x+side*(w*.5+.05),h,z+.18],[x,h+1.43,z+.18],.065,timber?oak:stone);
    }
    box([x+w*.28,h+1.16,z-d*.70],[.42,1.30,.48],blueStone);box([x+w*.28,h+1.81,z-d*.70],[.54,.12,.60],stone);
    for(const dx of [-w*.37,w*.37])for(const y of [.60,h*.52])arch(x+dx,y,z+.035,.58,.88);
    if(timber){
      for(const dx of [-w*.5,0,w*.5])box([x+dx,h*.5,z+.16],[.10,h,.16],oak);
      for(const y of [h*.49,h])box([x,y,z+.17],[w+.15,.12,.18],oak);
      for(const side of [-1,1])for(const y of [.14,h*.5])rod([x+side*w*.48,y,z+.17],[x+side*.04,y+h*.46,z+.17],.044,oak);
      rod([x,h,z+.17],[x,h+1.35,z+.17],.050,oak);
    }else{
      for(const side of [-1,1])for(let row=0;row<8;row++)box([x+side*w*.49,.36+row*.38,z+.105],[.27,.20,.19],stone);
      box([x,h*.5,z+.10],[w+.1,.11,.24],stone);
    }
    // Door returns, oak panels, carved lintel and ironwork make a building, rather than a backdrop prop.
    box([x,.94,z+.14],[.74,1.83,.10],dark);for(let i=0;i<5;i++)box([x-.28+i*.14,.92,z+.215],[.128,1.70,.075],oak);
    for(const y of [.40,1.30])box([x,y,z+.263],[.65,.045,.020],dark);
    box([x,1.93,z+.21],[1.01,.16,.28],stone);add(new THREE.TorusGeometry(.050,.010,6,18),gold,[x+.23,.93,z+.278]);
    for(const side of [-1,1]){box([x+side*w*.58,.13,z+.20],[.42,.22,.55],stone);rod([x+side*w*.58,.23,z+.20],[x+side*w*.58,1.41,z+.20],.024,dark);box([x+side*w*.58,1.30,z+.20],[.16,.24,.16],gold);box([x+side*w*.58,1.30,z+.30],[.09,.15,.01],glass);}
  }
  guildHouse(-13.8,-6.3,3.25,3.72,3.0,true);
  guildHouse(14.0,-6.2,3.38,3.2,3.3,false);
  // A lower rear archive wing links the two side streets without a straight fortress wall or dome.
  for(const x of [-8.3,8.3]){
    box([x,2.0,-15.0],[4.5,4.0,2.3],blueStone);box([x,4.08,-15.0],[4.7,.18,2.55],stone);
    for(const dx of [-1.35,0,1.35])arch(x+dx,2.22,-13.80,.64,1.25);
    for(const side of [-1,1])add(new THREE.BoxGeometry(2.65,.12,2.62),slate,[x+side*1.13,4.44,-15],[0,0,-side*.29]);
  }
  // Real oak shutters, book niches and a brass sign enrich the flanks at human scale.
  for(const [x,z] of [[-11.35,-3.6],[11.4,-3.25]]){
    box([x,1.17,z],[.55,2.30,.45],oak);box([x,2.42,z],[.69,.16,.54],stone);
    for(let row=0;row<3;row++){box([x,.40+row*.57,z+.26],[.52,.07,.10],oak);for(let i=0;i<4;i++)box([x-.16+i*.104,.61+row*.57,z+.24],[.085,.36,.12],i%2?dark:gold);}
    rod([x-.50,2.98,z],[x+.50,2.98,z],.030,dark);rod([x,2.98,z],[x,2.50,z],.019,dark);
    box([x,2.56,z+.06],[.77,.42,.055],gold);
    for(const side of [-1,1])box([x+side*.055,2.56,z+.10],[.10,.19,.025],oak);
  }
  return ['half-timbered western manuscript house','eastern stone guildhall with recessed oak doors','connected rear archive wings','shuttered book niches and hanging brass signs'];
}
