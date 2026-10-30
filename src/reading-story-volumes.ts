import * as THREE from 'three';
export const shelfVolumes=[{id:'yangjian',title:'劈山 · 杨戬救母',url:'./yangjian.html?v=32.137',image:'./assets/yangjian-v111/video/opening-poster.png',center:-2.66},{id:'odyssey',title:'尤利西斯嘲弄波吕菲摩斯',url:'./mythology.html?v=32.137',image:'./assets/odyssey/turner-ulysses-1829.jpg',center:0}];
export function storyVolumes(scene:THREE.Scene){
 const group=new THREE.Group();group.name='Reading shelf / original story entrances';scene.add(group);
 const books:THREE.Group[]=[],loader=new THREE.TextureLoader(),covers:Record<string,HTMLCanvasElement>={};
 for(const v of shelfVolumes){
  const book=new THREE.Group();book.name=v.title;book.userData.shelfVolume=v.id;book.position.set(v.center,1.91,.02);group.add(book);books.push(book);
  const cloth=new THREE.MeshStandardMaterial({color:v.id==='yangjian'?0x17191a:0x173632,roughness:.82}),paper=new THREE.MeshStandardMaterial({color:0xd8cfb8,roughness:.96});
  const part=(w:number,h:number,d:number,m:THREE.Material,x=0,z=0)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,0,z);o.castShadow=o.receiveShadow=true;book.add(o);return o;};
  part(2.34,3.32,.24,paper,0,-.12);part(2.41,3.41,.035,cloth,0,-.255);part(2.41,3.41,.035,cloth,0,.025);part(.07,3.41,.30,cloth,-1.2,-.115);
  const face=new THREE.Mesh(new THREE.PlaneGeometry(2.36,3.35),new THREE.MeshStandardMaterial({roughness:.65,color:0xffffff}));face.position.z=.045;book.add(face);
  void loader.loadAsync(v.image).then(t=>{const canvas=coverCanvas(v.id,t.image as HTMLImageElement),map=new THREE.CanvasTexture(canvas);covers[v.id]=canvas;map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=8;(face.material as THREE.MeshStandardMaterial).map=map;face.material.needsUpdate=true;t.dispose();});
 }
 return {group,books,covers,enter:(id:string)=>{const v=shelfVolumes.find(v=>v.id===id);if(!v)return;if(id==='yangjian')sessionStorage.setItem('brain-universe-yangjian-return',JSON.stringify({active:true,href:'./reading.html?v=32.137'}));if((window as any).portfolioNavigate)(window as any).portfolioNavigate(v.url);else location.assign(v.url);}};
}
function coverCanvas(id:string,im:HTMLImageElement){
 const c=document.createElement('canvas');c.width=960;c.height=1362;const x=c.getContext('2d')!,ink=id==='yangjian',bg=ink?'#17191a':'#173530',fg=ink?'#eeeae0':'#d3bd82';
 x.fillStyle=bg;x.fillRect(0,0,960,1362);
 // Restrained printed grain, ruled board and a distinct binding edge.
 for(let i=0;i<18000;i++){const a=(Math.sin(i*127.1)*43758.5453)%1;x.fillStyle=`rgba(240,230,200,${Math.abs(a)*.035})`;x.fillRect((i*167)%960,(i*233)%1362,1,1);}
 x.strokeStyle=fg;x.lineWidth=1.4;x.strokeRect(44,44,872,1274);x.globalAlpha=.35;x.strokeRect(55,55,850,1252);x.globalAlpha=1;
 x.fillStyle='#00000035';x.fillRect(0,0,26,1362);x.fillStyle=fg;x.textAlign='center';x.font='24px "SimSun",serif';x.fillText(ink?'神 话 叙 事':'经 典 重 释',480,116);
 if(ink){x.font='bold 190px "KaiTi","STKaiti","SimSun",serif';x.fillText('劈 山',480,330);x.font='38px "SimSun",serif';x.fillText('杨 戬 救 母',480,412);}
 else{x.font='72px "SimSun",serif';x.fillText('尤利西斯',480,255);x.font='55px "SimSun",serif';x.fillText('嘲弄波吕菲摩斯',480,350);x.font='italic 25px Georgia,serif';x.fillText('After J. M. W. Turner',480,410);}
 const box={x:88,y:476,w:784,h:646};x.save();x.beginPath();x.rect(box.x,box.y,box.w,box.h);x.clip();const iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,scale=Math.max(box.w/iw,box.h/ih),pos=ink?.69:.53;x.drawImage(im,box.x-(iw*scale-box.w)*pos,box.y-(ih*scale-box.h)*.5,iw*scale,ih*scale);x.restore();
 x.strokeStyle=fg;x.globalAlpha=.6;x.strokeRect(box.x,box.y,box.w,box.h);x.globalAlpha=1;x.fillStyle=fg;x.font='26px "SimSun",serif';x.fillText(ink?'一段穿过风雨的归途':'一幅画里的海上世界',480,1210);x.font='18px "SimSun",serif';x.fillText(ink?'水墨 · 声音 · 交互故事':'光影 · 材质 · 实时三维',480,1264);
 return c;
}
