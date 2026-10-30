(() => {
  "use strict";
  const items = [
    { en: "Analog Observation", cn: "模拟观察", note: "光线、颗粒与取景方式，构成持续观察的练习。", english: "Light, grain and framing. A study in how an ordinary object becomes an image." },
    { en: "Stacked References", cn: "叠放的参考", note: "书页、材料与视觉线索，被保存为可以重新调用的参考层。", english: "Pages become layers. Texture, sequence and the quiet weight of a reference kept close." },
    { en: "Private Frequencies", cn: "私人频率", note: "声音为独处的时间带来节奏，也改变影像被感知的速度。", english: "A private rhythm. Sound changes the pace at which an image is felt." },
    { en: "After the Rain", cn: "雨后街道", note: "城市夜色中的反射、霓虹和空白，成为颜色与光线的观察样本。", english: "Colour stays on the pavement after the rain. Red light, blue distance, an empty street." },
    { en: "Distant Trails", cn: "远处路径", note: "行走、山雾与尺度变化，留下关于空间距离的视觉记录。", english: "The path disappears into mist. Distance is measured in layers rather than steps." },
    { en: "Drawn Pauses", cn: "手绘停顿", note: "速写与短暂停留，让尚未成形的想法先拥有轮廓。", english: "A page left open. A pause between looking and making, before an idea finds its final form." },
    { en: "Projected Light", cn: "放映之光", note: "电影与光束提供另一种观看时间，连接镜头、空间与叙事。", english: "A beam holds the room. Cinema makes time visible through light and shadow." },
    { en: "Red / Black / Paper", cn: "红黑纸面", note: "平面构成、强烈色块与纸张触感，构成反复出现的视觉偏好。", english: "Red against black, form against texture. A small study in visual tension." },
    { en: "Form in Space", cn: "空间中的形", note: "三维形态、材质与光影的关系，保留为持续发展的空间练习。", english: "One object, one surface, one shadow. Material and proportion become a spatial conversation." }
  ];
  const angles = [-90, -61, -30, 0, 29, 61, 90, 120, 151, 181, 210, 240];
  const sizes = [[52, 68], [60, 46], [48, 64], [58, 48], [49, 66], [60, 46]];
  function init() {
    const page = document.getElementById("hobbyPage");
    if (!page) return;
    const $ = id => document.getElementById(id);
    const stage = page.querySelector(".hobby-orbit-stage"), orbit = $("hobbyOrbit");
    const inspector = $("hobbyInspector"), caption = $("hobbyHoverCaption"), host = $("hobbyCabinetStage");
    const transition = $("hobbyRoomTransition"), transitionCards = $("hobbyTransitionCards");
    const cards = [], images = [], textures = [], posterTextures = [];
    let active=false, modal=false, rotation=0, wheel=0, orbitFrame=0, orbitTime=0,entryRunning=false,entryRun=0,entryTimers=[];
    let pointer={x:-9999,y:-9999}, scene, camera, renderer, raycaster, cases=[], sceneFrame=0, sceneTime=0;
    let collection=[], selected=-1, detailIndex=0, sourceCard, cameraTarget=0, cameraDistance=8.5, drag=null, loading=false;
    let transitionTimers=[], transitioning=false, closing=false, forming=false, storingSlot=-1, openedSlot=-1, storyProgress=0;
    const CASE_COUNT=5, MID_SLOT=2;
    const stackDepth=slot=>[3,1,0,2,4][slot]*.14;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    function sprite(node,index) {
      if(images[index]) {
        node.style.backgroundImage=`url("${images[index]}")`;node.style.backgroundSize="cover";node.style.backgroundPosition="center";
      } else node.style.backgroundPosition=`${index%3*50}% ${Math.floor(index/3)*50}%`;
      node.dataset.sprite=index;
    }
    // Exact authored crops replace nine synchronous canvas encodes at the portfolio entry.
    // JPEGs retain the old DOM appearance; lossless PNGs retain the original 3D texture pixels.
    items.forEach((_,i)=>{images[i]=`./assets/hobby-tiles-v32-67/${i}.jpg`;});
    let sheetReady;
    function ensureSpriteTextures(){
      if(sheetReady)return sheetReady;
      const loader=new THREE.TextureLoader();
      sheetReady=Promise.all(items.map((_,i)=>loader.loadAsync(`./assets/hobby-tiles-v32-67/${i}.png`).then(t=>{t.colorSpace=THREE.SRGBColorSpace;textures[i]=t;})));
      return sheetReady;
    }
    page.querySelectorAll("[data-hobby-sprite]").forEach(node=>sprite(node,Number(node.dataset.hobbySprite)||0));
    angles.forEach((angle,index)=>{
      const card=document.createElement("button"),thumb=document.createElement("span"),itemIndex=index%items.length;
      const [width,height]=sizes[index%sizes.length];
      card.type="button";card.className="hobby-orbit-card";
      card.style.setProperty("--card-w",`${width}px`);card.style.setProperty("--card-h",`${height}px`);
      card.setAttribute("aria-label",`${items[itemIndex].en} / ${items[itemIndex].cn}`);
      thumb.className="hobby-orbit-thumb hobby-sprite";sprite(thumb,itemIndex);card.append(thumb);
      const show=visible=>{
        caption.querySelector("strong").textContent=items[itemIndex].en.toUpperCase();
        caption.querySelector("span").textContent=items[itemIndex].cn;caption.classList.toggle("is-visible",visible);
        $("hobbyOrbitCurrent").textContent=String(index+1).padStart(2,"0");
      };
      card.addEventListener("pointerenter",()=>show(true));card.addEventListener("pointerleave",()=>show(false));
      card.addEventListener("focus",()=>show(true));card.addEventListener("blur",()=>show(false));
      card.addEventListener("click",()=>openRoom(itemIndex,card));orbit.append(card);
      cards.push({card,thumb,angle,itemIndex,x:0,y:0,energy:0});
    });
    function orbitRender(time) {
      orbitFrame=0;if(!active||document.hidden||modal)return;
      const dt=Math.min(40,time-orbitTime||16);orbitTime=time;
      rotation+=reduced?0:dt*.00055+wheel*dt/16;wheel*=Math.pow(.90,dt/16);
      const r=stage.getBoundingClientRect(),radius=Math.min(r.width*.26,r.height*.32)*(1+storyProgress*1.85);
      const cx=r.left+r.width/2,cy=r.top+r.height*.46,smooth=1-Math.exp(-dt/125);
      cards.forEach(c=>{
        const angle=c.angle+rotation,a=angle*Math.PI/180,x=Math.cos(a)*radius,y=Math.sin(a)*radius;
        const dx=cx+x-pointer.x,dy=cy+y-pointer.y,distance=Math.hypot(dx,dy),energy=Math.max(0,1-distance/95),force=energy*5;
        c.x+=((distance?dx/distance*force:0)-c.x)*smooth;c.y+=((distance?dy/distance*force:0)-c.y)*smooth;c.energy+=(energy-c.energy)*smooth;
        const twist=c.energy*(dx>0?1.4:-1.4);
        c.card.classList.toggle("is-near",c.energy>.03);c.card.style.setProperty("--energy",c.energy.toFixed(3));c.card.style.opacity=String(Math.max(0,1-storyProgress*1.45));
        c.card.style.transform=`translate3d(calc(-50% + ${(x+c.x).toFixed(2)}px),calc(-50% + ${(y+c.y).toFixed(2)}px),0) rotate(${(angle+90+twist).toFixed(2)}deg) perspective(600px) rotateY(${twist.toFixed(2)}deg) scale(${(1+c.energy*.022).toFixed(3)})`;
      });orbitFrame=requestAnimationFrame(orbitRender);
    }
    function resumeOrbit(){if(active&&!modal&&!entryRunning&&!document.hidden&&!orbitFrame){orbitTime=performance.now();orbitFrame=requestAnimationFrame(orbitRender);}}
    stage.addEventListener("pointermove",e=>{pointer={x:e.clientX,y:e.clientY};});
    stage.addEventListener("pointerleave",()=>{pointer={x:-9999,y:-9999};caption.classList.remove("is-visible");});
    stage.addEventListener("wheel",e=>{if(!modal)wheel+=Math.max(-.12,Math.min(.12,e.deltaY*.0003));},{passive:true});
    function updateStory(){
      const legacyOffset=page.querySelector("#hobbyPhotography")?.offsetHeight||0;const legacyScroll=Math.max(0,page.scrollTop-legacyOffset);
      storyProgress=Math.max(0,Math.min(1,legacyScroll/(innerHeight*.82)));
      page.classList.toggle("is-story-one",legacyScroll>innerHeight*.28);
      page.classList.toggle("is-story-two",legacyScroll>innerHeight*1.22);
      resumeOrbit();
    }
    page.addEventListener("scroll",updateStory,{passive:true});
    const entrySequence=$("hobbyEntrySequence"),entryImages=$("hobbyEntryImages"),entryStatus=$("hobbyEntryStatus");
    const scatter=[[-41,-31,-7],[-26,-25,-4],[1,-37,2],[24,-29,6],[41,-9,4],[34,18,7],[20,35,5],[-3,33,-3],[-27,36,-6],[-42,9,-5],[-13,5,3],[11,-4,5]];
    function clearEntryTimers(){entryTimers.forEach(clearTimeout);entryTimers=[];}
    function buildEntryImages(){
      entryImages.replaceChildren();
      scatter.forEach(([x,y,r],index)=>{
        const image=document.createElement("i");image.className="hobby-entry-image hobby-sprite";sprite(image,index%items.length);
        const angle=index/angles.length*Math.PI*2-Math.PI/2,ringRadius=Math.min(innerWidth*.31,innerHeight*.37);
        image.style.setProperty("--scatter-x",`${x}vw`);image.style.setProperty("--scatter-y",`${y}vh`);image.style.setProperty("--scatter-r",`${r}deg`);
        image.style.setProperty("--row-x",`${(index-(angles.length-1)/2)*5.25}vw`);image.style.setProperty("--row-r",`${((index-(angles.length-1)/2)*1.25).toFixed(2)}deg`);
        image.style.setProperty("--arc-y",`${(-Math.abs(index-(angles.length-1)/2)*7).toFixed(1)}px`);
        image.style.setProperty("--ring-x",`${(Math.cos(angle)*ringRadius).toFixed(1)}px`);image.style.setProperty("--ring-y",`${(Math.sin(angle)*ringRadius).toFixed(1)}px`);image.style.setProperty("--ring-r",`${(angle*180/Math.PI+90).toFixed(1)}deg`);
        image.style.setProperty("--entry-delay",`${index*20}ms`);entryImages.append(image);
      });
    }
    function setEntryPhase(name,status){entrySequence.dataset.phase=name;entryStatus.textContent=status;}
    function finishEntry(run){
      if(run!==entryRun)return;entryRunning=false;page.classList.add("is-intro-handoff");setEntryPhase("ring","ARCHIVE READY");resumeOrbit();
      entryTimers.push(setTimeout(()=>{if(run!==entryRun)return;entrySequence.classList.remove("is-active");page.classList.remove("is-intro-playing","is-intro-handoff");entrySequence.dataset.phase="idle";},1050));
    }
    async function playEntry(){
      const run=++entryRun;clearEntryTimers();entryRunning=true;cancelAnimationFrame(orbitFrame);orbitFrame=0;page.scrollTop=0;page.classList.add("is-intro-playing");page.classList.remove("is-intro-handoff");
      entrySequence.classList.add("is-active");setEntryPhase("paper","PREPARING THE ARCHIVE");
      try{await ensureSpriteTextures();}catch(e){}
      if(run!==entryRun)return;buildEntryImages();
      entryTimers.push(setTimeout(()=>{if(run===entryRun)setEntryPhase("scatter","MATERIALISING THE IMAGES");},700));
      entryTimers.push(setTimeout(()=>{if(run===entryRun)setEntryPhase("row","ORDERING THE COLLECTION");},2000));
      entryTimers.push(setTimeout(()=>{if(run===entryRun)setEntryPhase("arc","OPENING THE FIELD");},3300));
      entryTimers.push(setTimeout(()=>{if(run===entryRun)setEntryPhase("ring","FORMING THE ORBIT");},4600));
      entryTimers.push(setTimeout(()=>finishEntry(run),5700));
    }
    page.addEventListener("wheel",event=>{if(page.classList.contains("is-intro-playing"))event.preventDefault();},{passive:false,capture:true});
    window.addEventListener("v31:archive-open",event=>{if(event.detail?.target!=="hobbyPage")return;active=true;page.scrollTop=0;storyProgress=0;updateStory();if(!page.querySelector("#hobbyPhotography"))playEntry();else resumeOrbit();});
    window.addEventListener("v31:archive-close",event=>{if(event.detail?.target!=="hobbyPage")return;entryRun++;clearEntryTimers();entryRunning=false;entrySequence.classList.remove("is-active");entrySequence.dataset.phase="idle";page.classList.remove("is-intro-playing","is-intro-handoff");active=false;cancelAnimationFrame(orbitFrame);orbitFrame=0;});
    new IntersectionObserver(([entry])=>{
      active=entry.isIntersecting&&page.classList.contains("is-standalone-open");page.classList.toggle("is-hobby-visible",active);document.body.classList.toggle("hobby-reading",active);
      if(active)resumeOrbit();else{cancelAnimationFrame(orbitFrame);orbitFrame=0;}
    },{threshold:.18}).observe(stage);
    function box(parent,w,h,d,x,y,z,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
    function frame(parent,w,h,depth,material,z=0,t=.035){
      // One hollow solid avoids coplanar faces at the four rail joints.
      const outerW=(w+t)/2,outerH=(h+t)/2,innerW=(w-t)/2,innerH=(h-t)/2;
      const shape=new THREE.Shape();shape.moveTo(-outerW,-outerH);shape.lineTo(outerW,-outerH);shape.lineTo(outerW,outerH);shape.lineTo(-outerW,outerH);shape.closePath();
      const hole=new THREE.Path();hole.moveTo(-innerW,-innerH);hole.lineTo(-innerW,innerH);hole.lineTo(innerW,innerH);hole.lineTo(innerW,-innerH);hole.closePath();shape.holes.push(hole);
      const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,steps:1,curveSegments:1});geometry.translate(0,0,-depth/2);
      const mesh=new THREE.Mesh(geometry,material);mesh.position.z=z;parent.add(mesh);return mesh;
    }
    function posterTexture(index){
      if(!posterTextures[index]){const map=textures[index].clone();map.repeat.set(.34,1);map.offset.set(.33,0);map.needsUpdate=true;posterTextures[index]=map;}
      return posterTextures[index];
    }
    function createCase(itemIndex,slot) {
      const T=THREE,group=new T.Group(),door=new T.Group(),w=1.02,h=3.28;
      const tones=[0xb8c1c2,0xc8c5bc,0xb6bec9,0xd4bdb7,0xbabccb,0xc5c8bc,0xc3bec4];
      const metal=new T.MeshStandardMaterial({color:tones[slot],metalness:.40,roughness:.36});
      const inner=new T.MeshStandardMaterial({color:0x4c5355,metalness:.54,roughness:.44});
      const chrome=new T.MeshStandardMaterial({color:0xe8ecec,metalness:.62,roughness:.30});
      const baseX=(slot-MID_SLOT)*1.82;
      group.position.set(forming?0:baseX,.12,forming?-.72-stackDepth(slot):0);group.rotation.y=-.25;group.scale.setScalar(forming?.76:1);
      box(group,w+.07,h+.07,.36,0,0,-.22,metal);
      const map=posterTexture(itemIndex);
      const poster=new T.Mesh(new T.PlaneGeometry(w-.09,h-.09),new T.MeshBasicMaterial({map}));poster.position.z=-.014;group.add(poster);
      poster.userData.isArtwork=true;
      frame(group,w+.025,h+.025,.035,inner,.005,.016);frame(group,w+.14,h+.14,.50,metal,-.23,.05);frame(group,w-.055,h-.055,.020,chrome,.048,.012);
      box(group,.03,h-.20,.46,-w/2-.097,0,-.21,chrome);
      box(group,.03,h-.20,.46,w/2+.097,0,-.21,inner);
      box(group,w+.05,.075,.60,0,h/2+.05,-.20,chrome);
      box(group,w+.05,.075,.60,0,-h/2-.05,-.20,metal);
      box(group,.035,h*.58,.05,w/2-.065,.18,.105,new T.MeshStandardMaterial({color:0x252a2c,metalness:.2,roughness:.5}));
      box(group,.048,.32,.055,w/2-.058,-.72,.112,chrome);
      // Glass and its hardware swing on one hinge; the photograph stays inside the cabinet.
      door.position.set(-w/2,0,.15);
      const glassMaterial=new T.MeshBasicMaterial({color:0xf2f7f8,transparent:true,opacity:.045,side:T.DoubleSide,forceSinglePass:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
      const glass=new T.Mesh(new T.PlaneGeometry(w-.10,h-.10),glassMaterial);glass.position.set(w/2,0,.014);glass.renderOrder=20;door.add(glass);
      const perimeter=new T.Group();perimeter.position.x=w/2;
      frame(perimeter,w+.035,h+.035,.075,metal,0,.032);frame(perimeter,w-.045,h-.045,.022,chrome,.024,.010);door.add(perimeter);
      box(door,.026,.13,.035,w-.043,-.04,.037,chrome);
      [-1.12,1.12].forEach(y=>box(group,.035,.16,.075,-w/2-.015,y,.055,inner));
      const screwGeometry=new T.SphereGeometry(.009,6,4);
      [-w/2+.045,w/2-.045].forEach(x=>[-h/2+.045,h/2-.045].forEach(y=>{const screw=new T.Mesh(screwGeometry,inner);screw.position.set(x+w/2,y,.024);door.add(screw);}));
      const reflection=new T.Mesh(new T.PlaneGeometry(.055,h-.22),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.13,side:T.DoubleSide,forceSinglePass:true,depthWrite:false}));reflection.position.set(w*.78,0,.032);reflection.renderOrder=21;door.add(reflection);
      door.traverse(n=>{n.userData.isDoor=true;});
      group.add(door);group.traverse(n=>{n.userData.caseSlot=slot;});scene.add(group);
      cases.push({group,door,poster,itemIndex,slot,baseX,doorTarget:0});
    }
    function buildScene() {
      if(renderer)return;if(!window.THREE)throw new Error("3D engine unavailable");
      const T=THREE;renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance",precision:"highp"});renderer.setPixelRatio(1);renderer.setClearColor(0xfaf9f7,1);renderer.outputColorSpace=T.SRGBColorSpace;renderer.sortObjects=true;host.append(renderer.domElement);
      scene=new T.Scene();camera=new T.PerspectiveCamera(38,innerWidth/innerHeight,.1,100);camera.position.set(0,.65,8.5);
      scene.add(new T.HemisphereLight(0xffffff,0xadb0b6,2.5));
      const key=new T.DirectionalLight(0xffffff,3.2);key.position.set(-4,7,6);key.castShadow=true;key.shadow.mapSize.set(512,512);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=6;key.shadow.camera.bottom=-4;scene.add(key);
      const fill=new T.DirectionalLight(0xd8e4ff,1.2);fill.position.set(5,2,5);scene.add(fill);
      const shelf=new T.Mesh(new T.PlaneGeometry(30,3),new T.ShadowMaterial({color:0x6d726e,transparent:true,opacity:.09}));shelf.rotation.x=-Math.PI/2;shelf.position.set(0,-1.64,-.15);shelf.receiveShadow=true;scene.add(shelf);
      scene.traverse(object=>{if(object.isMesh&&object!==shelf&&!object.material.transparent)object.castShadow=true;});
      raycaster=new T.Raycaster();resizeScene();
      renderer.domElement.addEventListener("pointerdown",e=>{drag={x:e.clientX,camera:cameraTarget,moved:false};});
      renderer.domElement.addEventListener("pointermove",e=>{
        if(drag){if(Math.abs(e.clientX-drag.x)>7)drag.moved=true;if(drag.moved){cameraTarget=Math.max(-4.6,Math.min(4.6,drag.camera-(e.clientX-drag.x)*.009));resumeScene();}}
        else renderer.domElement.style.cursor=hitCase(e)?"pointer":"default";
      });
      renderer.domElement.addEventListener("pointerup",e=>{if(drag&&!drag.moved){const hit=hitCase(e);if(hit)activateHit(hit);}drag=null;});
      renderer.domElement.addEventListener("pointerleave",()=>{drag=null;});
      host.addEventListener("wheel",e=>{if(!modal||inspector.classList.contains("is-detail"))return;e.preventDefault();cameraTarget=Math.max(-4.6,Math.min(4.6,cameraTarget+(e.deltaX||e.deltaY)*.002));resumeScene();},{passive:false});
    }
    function hitCase(e){
      const r=renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);
      const hits=raycaster.intersectObjects(cases.map(c=>c.group),true);
      if(hits[0]?.object.userData.isDoor)return hits[0].object;
      if(selected>=0&&openedSlot===selected){
        const artwork=hits.find(hit=>hit.object.userData.isArtwork&&hit.object.userData.caseSlot===selected);
        if(artwork)return artwork.object;
      }
      return hits[0]?.object;
    }
    function activateHit(hit){
      const slot=hit.userData.caseSlot;
      if(slot===selected&&slot===openedSlot&&hit.userData.isArtwork){storeThenOpenDetail(slot);return;}
      if(slot===selected&&slot===openedSlot){closeSelectedCase();return;}
      selectCase(slot);
    }
    function closeSelectedCase(){
      if(transitioning||selected<0)return;
      cases.forEach(c=>{c.doorTarget=0;});selected=-1;openedSlot=-1;cameraTarget=0;cameraDistance=8.5;
      inspector.classList.remove("is-case-open");host.dataset.selected="-1";
      [...$("hobbyCabinetControls").children].forEach(b=>b.classList.remove("is-active"));resumeScene();
    }
    function resizeScene(){if(!renderer)return;const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();resumeScene();}
    function sceneRender(time) {
      sceneFrame=0;if(!modal||document.hidden||inspector.classList.contains("is-detail"))return;
      const dt=Math.min(100,time-sceneTime||16);sceneTime=time;const smooth=1-Math.exp(-dt/260);
      let settled=Math.abs(cameraTarget-camera.position.x)<.002&&Math.abs(cameraDistance-camera.position.z)<.002;
      camera.position.x+=(cameraTarget-camera.position.x)*smooth;camera.position.z+=(cameraDistance-camera.position.z)*smooth;
      cases.forEach(c=>{
        const yaw=selected<0?-.25:c.slot===selected?0:c.slot<selected?.22:-.22;
        const targetX=closing||forming?0:c.baseX;
        const targetZ=forming?-.72-stackDepth(c.slot):closing?-stackDepth(c.slot):0,targetScale=forming?.76:(selected===c.slot?1.1:1);
        if(Math.abs(yaw-c.group.rotation.y)>.002||Math.abs(c.doorTarget-c.door.rotation.y)>.002||Math.abs(targetX-c.group.position.x)>.002||Math.abs(targetZ-c.group.position.z)>.002||Math.abs(targetScale-c.group.scale.x)>.002)settled=false;
        c.group.position.x+=(targetX-c.group.position.x)*smooth;
        c.group.position.z+=(targetZ-c.group.position.z)*smooth;
        c.group.rotation.y+=(yaw-c.group.rotation.y)*smooth;
        const scale=c.group.scale.x+(targetScale-c.group.scale.x)*smooth;c.group.scale.setScalar(scale);
        c.group.position.y=.12+(scale-1)*1.64;
        c.door.rotation.y+=(c.doorTarget-c.door.rotation.y)*(1-Math.exp(-dt/290));
      });
      if(selected>=0&&cases[selected].doorTarget<-2&&cases[selected].door.rotation.y<-2.05)openedSlot=selected;
      if(settled){
        camera.position.x=cameraTarget;camera.position.z=cameraDistance;
        cases.forEach(c=>{c.door.rotation.y=c.doorTarget;c.group.rotation.y=selected<0?-.25:c.slot===selected?0:c.slot<selected?.22:-.22;c.group.position.x=closing||forming?0:c.baseX;c.group.position.z=forming?-.72-stackDepth(c.slot):closing?-stackDepth(c.slot):0;const scale=forming?.76:selected===c.slot?1.1:1;c.group.scale.setScalar(scale);c.group.position.y=.12+(scale-1)*1.64;});
      }
      renderer.render(scene,camera);host.dataset.doorAngle=selected>=0?cases[selected].door.rotation.y.toFixed(3):"0";
      host.dataset.detailDoorAngle=cases[detailIndex]?.door.rotation.y.toFixed(3)||"0";
      host.dataset.renderFrames=String(Number(host.dataset.renderFrames||0)+1);
      host.dataset.cameraZ=camera.position.z.toFixed(3);
      host.dataset.doors=JSON.stringify(cases.map(c=>Number(c.door.rotation.y.toFixed(3))));
      if(storingSlot>=0){
        const stored=cases[storingSlot];
        const ready=Math.abs(stored.door.rotation.y)<.025&&stored.group.scale.x<1.008&&Math.abs(camera.position.x-cameraTarget)<.025&&Math.abs(camera.position.z-cameraDistance)<.025;
        if(ready){
          const slot=storingSlot;storingSlot=-1;transitioning=false;inspector.classList.remove("is-storing");
          window.setTimeout(()=>openDetail(slot),100);return;
        }
      }
      if(!settled)sceneFrame=requestAnimationFrame(sceneRender);
    }
    function resumeScene(){if(modal&&!document.hidden&&!sceneFrame&&!inspector.classList.contains("is-detail")){sceneTime=performance.now();sceneFrame=requestAnimationFrame(sceneRender);}}
    function clearTransitionTimers(){transitionTimers.forEach(window.clearTimeout);transitionTimers=[];transitionCards.querySelectorAll(".hobby-transition-card").forEach(card=>card.getAnimations().forEach(animation=>animation.cancel()));}
    function buildTransitionCards(){
      transitionCards.replaceChildren();
      collection.forEach((itemIndex,slot)=>{
        const card=document.createElement("i"),image=document.createElement("span");
        const fanY=[18,-10,-22,-7,20][slot],fanTilt=[-3.5,-1.6,0,1.8,3.7][slot];
        card.className=`hobby-transition-card${slot===MID_SLOT?" is-primary":""}`;card.style.setProperty("--slot",slot-MID_SLOT);card.style.setProperty("--fan-y",`${fanY}px`);card.style.setProperty("--fan-tilt",`${fanTilt}deg`);card.style.setProperty("--fan-yaw",`${(-fanTilt*1.1).toFixed(2)}deg`);card.style.setProperty("--card-delay",`${Math.abs(slot-MID_SLOT)*28}ms`);
        image.className="hobby-sprite";sprite(image,itemIndex);card.append(image);transitionCards.append(card);
      });
    }
    function playEntrance(card){
      clearTransitionTimers();buildTransitionCards();transitioning=true;closing=false;
      transition.className="hobby-room-transition is-visible";transition.querySelector("small").textContent="FORMING THE COLLECTION";
      inspector.classList.add("is-transition");
      const rect=card.getBoundingClientRect(),primary=transitionCards.querySelector(".is-primary");
      const dx=rect.left+rect.width/2-innerWidth/2,dy=rect.top+rect.height/2-innerHeight/2;
      primary.animate([
        {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(${rect.width/138},${rect.height/426})`,opacity:1,filter:"brightness(.72)"},
        {transform:"translate(-50%,-50%) scale(1)",opacity:1,filter:"brightness(1)"}
      ],{duration:720,easing:"cubic-bezier(.16,1,.3,1)",fill:"both"});
      transitionTimers.push(window.setTimeout(()=>{
        primary.getAnimations().forEach(animation=>animation.cancel());forming=false;transition.classList.add("is-split","is-materialize","is-handoff");transition.querySelector("small").textContent="FORMING FIVE CASES";inspector.classList.add("is-room-ready");resumeScene();
        transitionTimers.push(window.setTimeout(()=>{
          transition.className="hobby-room-transition";inspector.classList.remove("is-transition");transitioning=false;$("hobbyInspectorClose").focus({preventScroll:true});
        },1250));
      },700));
    }
    async function openRoom(index,card) {
      if(loading||modal)return;loading=true;
      try {
        await ensureSpriteTextures();buildScene();sourceCard=card;modal=false;selected=-1;openedSlot=-1;forming=true;cameraTarget=0;cameraDistance=8.5;camera.position.set(0,.65,8.5);
        collection=Array.from({length:CASE_COUNT},(_,i)=>(index+i-MID_SLOT+items.length)%items.length);
        if(!cases.length)collection.forEach(createCase);
        else cases.forEach((c,slot)=>{c.itemIndex=collection[slot];c.poster.material.map=posterTexture(c.itemIndex);c.poster.material.needsUpdate=true;c.door.rotation.y=0;c.doorTarget=0;c.group.position.set(0,-.2736,-.72-stackDepth(slot));c.group.scale.setScalar(.76);c.group.rotation.set(0,-.25,0);});
        $("hobbyCabinetControls").replaceChildren();
        collection.forEach((itemIndex,slot)=>{const b=document.createElement("button");b.type="button";b.className="hobby-case-control";b.setAttribute("aria-label",`开关 ${items[itemIndex].en} 展柜`);b.title=items[itemIndex].cn;b.textContent=String(slot+1).padStart(2,"0");b.addEventListener("click",()=>{if(selected===slot&&openedSlot===slot)closeSelectedCase();else selectCase(slot);});$("hobbyCabinetControls").append(b);});
        resizeScene();modal=true;
        inspector.className="hobby-inspector is-transition";void inspector.offsetWidth;inspector.classList.add("is-open");inspector.setAttribute("aria-hidden","false");document.body.classList.add("hobby-modal-open");cancelAnimationFrame(orbitFrame);orbitFrame=0;
        resumeScene();playEntrance(card);
      }catch(e){console.error(e);}finally{loading=false;}
    }
    function selectCase(slot) {
      if(transitioning)return;
      if(selected===slot)return;
      openedSlot=-1;
      selected=slot;detailIndex=slot;cases.forEach(c=>{c.doorTarget=c.slot===slot?-2.18:0;});cameraTarget=cases[slot].group.position.x;cameraDistance=7.3;
      inspector.classList.add("is-case-open");host.dataset.selected=slot;
      const item=items[collection[slot]],total=String(collection.length).padStart(2,"0");$("hobbyCaseTitle").textContent=item.en;$("hobbyCaseMeta").textContent=`SCENE ${String(slot+1).padStart(2,"0")} / ${total}  ·  2026 / IMAGE`;$("hobbyCaseNote").textContent=item.english;
      [...$("hobbyCabinetControls").children].forEach((b,i)=>b.classList.toggle("is-active",i===slot));resumeScene();
    }
    function updateDetail(slot) {
      detailIndex=(slot+collection.length)%collection.length;
      const itemIndex=collection[detailIndex],item=items[itemIndex],count=`${String(detailIndex+1).padStart(2,"0")} / ${String(collection.length).padStart(2,"0")}`;
      sprite($("hobbyDetailImage"),itemIndex);$("hobbyArchiveSeries").textContent="PERSONAL INTERESTS";$("hobbyArchiveCount").textContent=count;$("hobbyDetailMeta").textContent="2026 / IMAGE";
      $("hobbyDetailTitle").textContent=item.en;$("hobbyDetailSubtitle").textContent=item.cn;$("hobbyDetailEn").textContent=item.english;$("hobbyDetailCn").textContent=item.note;$("hobbyDetailTime").textContent="2026";$("hobbyDetailScene").textContent=count;
      $("hobbyImageCaption").textContent=`${item.cn} / ${String(detailIndex+1).padStart(2,"0")}`;$("hobbyImageProgress").style.width=`${(detailIndex+1)/collection.length*100}%`;
      [...$("hobbyArchiveThumbnails").children].forEach((b,i)=>{b.classList.toggle("is-active",i===detailIndex);b.setAttribute("aria-current",i===detailIndex?"true":"false");});
    }
    function openDetail(slot) {
      $("hobbyArchiveThumbnails").replaceChildren();collection.forEach((itemIndex,i)=>{
        const b=document.createElement("button"),image=document.createElement("span"),number=document.createElement("small");b.type="button";b.title=items[itemIndex].cn;b.setAttribute("aria-label",items[itemIndex].en);image.className="hobby-sprite";sprite(image,itemIndex);number.textContent=String(i+1).padStart(2,"0");b.append(image,number);b.addEventListener("click",()=>updateDetail(i));$("hobbyArchiveThumbnails").append(b);
      });updateDetail(slot);inspector.classList.add("is-detail");cancelAnimationFrame(sceneFrame);sceneFrame=0;$("hobbyArchiveBack").focus({preventScroll:true});
    }
    function storeThenOpenDetail(slot){
      if(transitioning||slot<0)return;
      if(openedSlot!==slot)return;
      openDetail(slot);
    }
    function backToRoom(){inspector.classList.remove("is-detail");if(selected!==detailIndex)selectCase(detailIndex);resumeScene();$("hobbyViewWork").focus({preventScroll:true});}
    function finishClose(){
      clearTransitionTimers();modal=false;closing=false;forming=false;transitioning=false;storingSlot=-1;openedSlot=-1;transition.className="hobby-room-transition";inspector.className="hobby-inspector";inspector.setAttribute("aria-hidden","true");document.body.classList.remove("hobby-modal-open");cancelAnimationFrame(sceneFrame);sceneFrame=0;pointer={x:-9999,y:-9999};sourceCard?.focus({preventScroll:true});resumeOrbit();
    }
    function closeRoom(){
      if(transitioning||inspector.classList.contains("is-detail"))return;
      clearTransitionTimers();buildTransitionCards();transitioning=true;closing=true;selected=-1;cameraTarget=0;cameraDistance=8.5;cases.forEach(c=>{c.doorTarget=0;});resumeScene();
      transition.className="hobby-room-transition is-visible is-split is-exit";transition.querySelector("small").textContent="CLOSING THE COLLECTION";inspector.classList.add("is-closing");
      transitionTimers.push(window.setTimeout(()=>{
        transition.classList.add("is-folding");transition.querySelector("small").textContent="RETURNING TO ORBIT";
        transitionTimers.push(window.setTimeout(()=>{
        const primary=transitionCards.querySelector(".is-primary"),rect=sourceCard.getBoundingClientRect();
        [...transitionCards.children].forEach(card=>card.classList.toggle("is-withdrawn",!card.classList.contains("is-primary")));
        const dx=rect.left+rect.width/2-innerWidth/2,dy=rect.top+rect.height/2-innerHeight/2;
        const returning=primary.animate([
          {transform:"translate(-50%,-50%) scale(1)",opacity:1},
          {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(${rect.width/140},${rect.height/200})`,opacity:.2}
        ],{duration:570,easing:"cubic-bezier(.7,0,.84,0)",fill:"both"});
        returning.finished.then(finishClose).catch(()=>{});
        },720));
      },620));
    }
    $("hobbyInspectorClose").addEventListener("click",closeRoom);$("hobbyViewWork").addEventListener("click",()=>{if(selected>=0&&openedSlot===selected)storeThenOpenDetail(selected);});$("hobbyArchiveBack").addEventListener("click",backToRoom);
    $("hobbyCloseDoor").addEventListener("click",closeSelectedCase);
    $("hobbyImagePrev").addEventListener("click",()=>updateDetail(detailIndex-1));$("hobbyImageNext").addEventListener("click",()=>updateDetail(detailIndex+1));
    window.addEventListener("keydown",e=>{
      if(!modal||transitioning)return;
      if(e.key==="Escape"){if(inspector.classList.contains("is-detail"))backToRoom();else if(selected>=0)closeSelectedCase();else closeRoom();}
      if(inspector.classList.contains("is-detail")&&["ArrowLeft","ArrowRight"].includes(e.key)){e.preventDefault();updateDetail(detailIndex+(e.key==="ArrowRight"?1:-1));}
      if(e.key==="Tab"){
        const focusable=[...inspector.querySelectorAll("button")].filter(b=>b.getClientRects().length&&getComputedStyle(b).visibility!=="hidden"),first=focusable[0],last=focusable.at(-1);
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
      }
    });
    window.addEventListener("resize",resizeScene);document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(orbitFrame);orbitFrame=0;cancelAnimationFrame(sceneFrame);sceneFrame=0;}else{resumeOrbit();resumeScene();}});
  }
  if(document.getElementById("countdownPrelude")&&document.body.dataset.openingComplete!=="true")window.addEventListener("v31:opening-complete",init,{once:true});
  else if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
