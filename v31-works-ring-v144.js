(() => {
  "use strict";

  const archive = document.getElementById("worksOrbitArchive");
  const field = document.getElementById("worksWebglField");
  if (!archive || !field || !window.THREE) return;

  const T = window.THREE;
  const COUNT = 5;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const works = [
    ["后西游记", "人工智能长剧", "神话叙事", "长剧 · 场景与影像构建", "./assets/works/after-journey/cover-v32-92.webp", "./after-journey.html?v=32.139"],
    ["乡土归途", "乡土影像", "土地与记忆", "短片 · 环境与人物", "./assets/works/covers-v137/rural.webp", "./rural-return.html?v=32.139"],
    ["湖南卫视中秋之夜", "虚拟现实舞台", "中秋舞台", "虚拟现实 · 人工智能影像", "./assets/works/covers-v137/mid-autumn.webp", "./mid-autumn.html?v=32.139"],
    ["让画面发生", "代码影像双作", "图形与叙事", "代码创作 · 物理手感与手绘拼贴", "./assets/works/covers-v161/code-films.webp", "./physical-universe.html?v=32.139"],
    ["潮湿东南亚", "环保公益短片", "越南 · 水环境", "AI 影像 · 塑料袋的旅程", "./assets/works/humid-southeast-asia/cover.webp", "./humid-southeast-asia.html?v=32.139"]
  ].map((item, index) => ({
    title: item[0], english: item[1], type: item[2], medium: item[3], src: item[4], href:item[5], year: "2026"
  }));

  const closeButton = document.getElementById("worksOrbitClose");
  const indexTrigger = document.getElementById("worksOrbitIndexTrigger");
  const indexPanel = document.getElementById("worksOrbitIndex");
  const indexList = document.getElementById("worksOrbitIndexList");
  const titleList = document.getElementById("worksOrbitTitleList");
  const infoToggle = document.getElementById("worksOrbitInfoToggle");
  const infoPanel = document.getElementById("worksOrbitInfoPanel");
  const infoClose = document.getElementById("worksOrbitInfoClose");
  const infoLeft = archive.querySelector(".works-orbit-info-left");
  const infoRight = archive.querySelector(".works-orbit-info-right");
  const sceneTitle = document.getElementById("worksOrbitSceneTitle");
  const railTicks = document.getElementById("worksOrbitRailTicks");
  const railCurrent = document.getElementById("worksOrbitRailCurrent");
  const fields = {
    ordinal: document.getElementById("worksOrbitOrdinal"),
    title: document.getElementById("worksOrbitTitle"),
    english: document.getElementById("worksOrbitEnglish"),
    type: document.getElementById("worksOrbitType"),
    year: document.getElementById("worksOrbitYear"),
    medium: document.getElementById("worksOrbitMedium"),
    counter: document.getElementById("worksOrbitCounter"),
    position: document.getElementById("worksOrbitPosition"),
    status: document.getElementById("worksOrbitIntroStatus")
  };
  const infoFields = {
    ordinal: document.getElementById("worksOrbitInfoOrdinal"),
    title: document.getElementById("worksOrbitInfoTitle"),
    english: document.getElementById("worksOrbitInfoEnglish"),
    type: document.getElementById("worksOrbitInfoType"),
    medium: document.getElementById("worksOrbitInfoMedium"),
    year: document.getElementById("worksOrbitInfoYear")
  };
  const cursorLabel = document.getElementById("cursorLabel");
  let projectLeaving=false;
  const setText=(node,text)=>{if(node&&node.textContent!==text)node.textContent=text;};

  let renderer=null;
  let recoveryTimer=0;
  function ensureRenderer(){
    if(renderer&&!renderer.getContext().isContextLost())return;
    renderer?.dispose();field.querySelector('canvas')?.remove();
    renderer=new T.WebGLRenderer({alpha:true,antialias:false,powerPreference:'high-performance'});
    renderer.setPixelRatio(1);renderer.setClearColor(0x000000,0);field.appendChild(renderer.domElement);
    uniforms.uAtlas.value.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    renderer.domElement.addEventListener('webglcontextrestored',()=>{resize();lastInteraction=performance.now();requestRender();});
    renderer.domElement.addEventListener('webglcontextlost',event=>{
      event.preventDefault();cancelAnimationFrame(raf);raf=0;
      clearTimeout(recoveryTimer);
      recoveryTimer=setTimeout(async()=>{
        if(!opened||projectLeaving)return;
        if(renderer.getContext().isContextLost())ensureRenderer();
        resize();await renderer.compileAsync(scene,camera);lastInteraction=performance.now();lastPaintTime=0;requestRender();
      },180);
    });
  }

  const scene = new T.Scene();
  const camera = new T.Camera();
  const positions = Array.from({ length: COUNT }, () => new T.Vector2());
  const restPositions = Array.from({ length: COUNT }, () => new T.Vector2());
  const cardState = Array.from({ length: COUNT }, () => new T.Vector4(0, 0, 1, 0));
  const rotations = new Float32Array(COUNT);
  const linkA = Array.from({ length: COUNT }, () => new T.Vector2());
  const linkB = Array.from({ length: COUNT }, () => new T.Vector2());
  const linkPar = Array.from({ length: COUNT }, () => new T.Vector4(-100, -100, 0, 0));

  const blankAtlas = document.createElement("canvas");
  blankAtlas.width = 3;
  blankAtlas.height = 3;
  const atlasTexture = new T.CanvasTexture(blankAtlas);
  atlasTexture.minFilter = T.LinearFilter;
  atlasTexture.magFilter = T.LinearFilter;
  atlasTexture.generateMipmaps = false;

  function createAsciiTexture() {
    const glyphs = ".:+x*#@";
    const cell = 32;
    const canvas = document.createElement("canvas");
    canvas.width = cell * glyphs.length;
    canvas.height = cell;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
    context.font = "700 25px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (let index = 0; index < glyphs.length; index += 1) {
      context.fillText(glyphs[index], index * cell + cell * .5, cell * .52);
    }
    const texture = new T.CanvasTexture(canvas);
    texture.minFilter = T.LinearFilter;
    texture.magFilter = T.LinearFilter;
    texture.generateMipmaps = false;
    return texture;
  }

  const uniforms = {
    uResolution: { value: new T.Vector2(1, 1) },
    uAtlas: { value: atlasTexture },
    uAsciiTex: { value: createAsciiTexture() },
    uPos: { value: positions },
    uState: { value: cardState },
    uRot: { value: rotations },
    uSize: { value: new T.Vector2(400, 267) },
    uRadius: { value: 8 },
    uK: { value: 24 },
    uWobble: { value: 0 },
    uTime: { value: 0 },
    uLinkA: { value: linkA },
    uLinkB: { value: linkB },
    uLinkPar: { value: linkPar },
    uLinkCount: { value: 0 },
    uIntro: { value: new T.Vector4(0, 3.8, 13, .98) },
    uIntroHalf: { value: new T.Vector2(150, 100) },
    uSeedParticles: { value: new T.Vector4(0, 150, 13, .7) },
    uFocusPos: { value: new T.Vector2() },
    uFocusBox: { value: new T.Vector4() },
    uFocusParticles: { value: new T.Vector4() },
    uFocusMotion: { value: new T.Vector2() }
  };

  const material = new T.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform sampler2D uAtlas;
      uniform sampler2D uAsciiTex;
      uniform vec2 uPos[${COUNT}];
      uniform vec4 uState[${COUNT}];
      uniform float uRot[${COUNT}];
      uniform vec2 uSize;
      uniform float uRadius;
      uniform float uK;
      uniform float uWobble;
      uniform float uTime;
      uniform vec2 uLinkA[${COUNT}];
      uniform vec2 uLinkB[${COUNT}];
      uniform vec4 uLinkPar[${COUNT}];
      uniform int uLinkCount;
      uniform vec4 uIntro;
      uniform vec2 uIntroHalf;
      uniform vec4 uSeedParticles;
      uniform vec2 uFocusPos;
      uniform vec4 uFocusBox;
      uniform vec4 uFocusParticles;
      uniform vec2 uFocusMotion;

      float hash21(vec2 p){
        p=fract(p*vec2(123.34,456.21));
        p+=dot(p,p+45.32);
        return fract(p.x*p.y);
      }
      float sdRoundBox(vec2 p,vec2 b,float r){
        vec2 q=abs(p)-b+r;
        return min(max(q.x,q.y),0.0)+length(max(q,0.0))-r;
      }
      float smin(float a,float b,float k){
        if(k<=.0001)return min(a,b);
        float h=clamp(.5+.5*(b-a)/k,0.0,1.0);
        return mix(b,a,h)-k*h*(1.0-h);
      }
      float sdBridge(vec2 p,vec2 a,vec2 b,float rEnd,float rMid,float sag){
        vec2 ba=b-a;
        float len=length(ba);
        if(len<.001)return 1e6;
        vec2 dir=ba/len;
        vec2 nrm=vec2(-dir.y,dir.x);
        vec2 q=p-(a+b)*.5;
        float along=dot(q,dir);
        float across=dot(q,nrm);
        float h=clamp(along/len+.5,0.0,1.0);
        float bell=sin(3.14159265*h);
        across-=sag*bell;
        float endDistance=min(h,1.0-h);
        float root=1.0-smoothstep(0.0,.17,endDistance);
        root*=root;
        float organic=1.0+.035*sin(h*6.2831853+uTime*.28);
        float r=mix(rMid,rEnd,root)*organic;
        return max(abs(along)-len*.5,abs(across)-r);
      }
      vec2 turn(vec2 q,float a){
        float c=cos(a),s=sin(a);
        return vec2(q.x*c+q.y*s,-q.x*s+q.y*c);
      }
      vec2 atlasUV(vec2 uv,float cell){
        float col=mod(cell,3.0);
        float row=floor(cell/3.0);
        return vec2((col+uv.x)/3.0,1.0-(row+1.0-uv.y)/3.0);
      }
      vec3 artAt(vec2 uv,float cell){
        vec3 c=texture2D(uAtlas,atlasUV(clamp(uv,.004,.996),cell)).rgb;
        // The atlas is decoded to linear by the GPU; this authored shader outputs display RGB.
        return mix(c*12.92,1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-.055,step(vec3(.0031308),c));
      }
      float glyphMask(vec2 tile,float glyph,vec2 uv){
        return texture2D(uAsciiTex,vec2((glyph+uv.x)/7.0,uv.y)).a;
      }

      vec4 introParticles(vec2 p){
        float t=clamp(uIntro.x,0.0,1.0);
        float gather=t*t*(3.0-2.0*t);
        float cloudScale=mix(max(1.0,uIntro.y),1.0,gather);
        vec2 q=turn(p-uPos[0],uRot[0]);
        vec2 target=q/cloudScale;
        vec2 normalised=target/max(uIntroHalf,vec2(1.0));
        float diamondD=abs(normalised.x)+abs(normalised.y)-1.0;
        float boxD=max(abs(normalised.x),abs(normalised.y))-1.0;
        float shapeD=mix(diamondD,boxD,smoothstep(.35,.92,gather));
        if(shapeD>0.0)return vec4(0.0);
        float cell=max(uIntro.z,5.0);
        float radius=max(length(q),1.0);
        float ripple=sin(uTime*1.4+(abs(q.x)+abs(q.y))*.018);
        vec2 current=q+(q/radius)*ripple*cell*.38*(1.0-gather);
        vec2 gridP=abs(current/cell);
        vec2 tile=floor(gridP);
        vec2 guv=fract(gridP);
        float seed=hash21(tile+71.19);
        vec2 imageUv=target/(uIntroHalf*2.0)+.5;
        vec3 art=artAt(imageUv,0.0);
        float luminance=dot(art,vec3(.2126,.7152,.0722));
        float imageInfluence=smoothstep(.25,.88,gather);
        float density=mix(.28,.92,gather);
        float present=step(seed,density);
        float glyph=floor(clamp(mix(2.0+seed*3.0,(1.0-luminance)*5.4+seed*.7,imageInfluence),0.0,6.0));
        float mask=glyphMask(tile,glyph,guv);
        float born=smoothstep(0.0,.08,t);
        float handoff=1.0-smoothstep(.58,.97,t);
        float pulse=.82+.18*sin(uTime*3.2+seed*6.28318);
        float edge=1.0-smoothstep(-.17,0.0,shapeD);
        float alpha=mask*present*born*handoff*pulse*edge*uIntro.w;
        vec3 color=mix(vec3(.08,.095,.09),art,.72*imageInfluence);
        return vec4(color,alpha);
      }

      vec4 seedParticles(vec2 p){
        float gather=clamp(uIntro.x,0.0,1.0);
        float launch=clamp(uSeedParticles.x,0.0,1.0);
        float enter=smoothstep(.52,.94,gather);
        float leave=smoothstep(.04,.76,launch);
        float life=enter*(1.0-leave);
        if(life<=.001)return vec4(0.0);
        vec2 q=turn(p-uPos[0],uRot[0]);
        vec2 halfSize=max(uSize*.5*uState[0].xy,vec2(1.0));
        float cardD=sdRoundBox(q,halfSize,min(uRadius,halfSize.y));
        float reach=max(uSeedParticles.y,8.0);
        vec2 outerHalf=halfSize+vec2(reach*1.35,reach);
        float diamondD=abs(q.x/outerHalf.x)+abs(q.y/outerHalf.y)-1.0;
        float envelope=1.0-smoothstep(-.1,0.0,diamondD);
        float outside=smoothstep(1.5,5.0,cardD);
        float falloff=1.0-smoothstep(0.0,reach,cardD);
        float field=envelope*outside*pow(max(falloff,0.0),.72);
        if(field<=.001)return vec4(0.0);
        float cell=max(uSeedParticles.z,5.0);
        float radius=max(length(q),1.0);
        vec2 direction=q/radius;
        float travel=enter*2.2-leave*5.0+uTime*.16*life;
        vec2 gridP=abs((q+direction*cell*travel)/cell);
        vec2 tile=floor(gridP);
        vec2 guv=fract(gridP);
        float seed=hash21(tile+143.57);
        float density=mix(.12,.68,enter)*mix(.62,1.0,pow(max(falloff,0.0),.55));
        float glyph=floor(clamp(falloff*5.2+seed*1.45,0.0,6.0));
        float mask=glyphMask(tile,glyph,guv);
        float pulse=.76+.24*sin(uTime*3.0+hash21(tile+29.31)*6.28318);
        return vec4(vec3(.075,.09,.083),mask*step(seed,density)*field*life*pulse*uSeedParticles.w);
      }

      vec4 focusParticles(vec2 p){
        float amount=clamp(uFocusParticles.x,0.0,1.0);
        if(amount<=.001)return vec4(0.0);
        vec2 q=turn(p-uFocusPos,uFocusBox.w);
        vec2 halfSize=max(uFocusBox.xy,vec2(1.0));
        float cardD=sdRoundBox(q,halfSize,uFocusBox.z);
        float reach=max(uFocusParticles.y,8.0);
        float outside=smoothstep(1.5,5.0,cardD);
        float angle=atan(q.y,q.x);
        float contour=.72+.16*sin(angle*3.0+uTime*.22)+.1*sin(angle*5.0-uTime*.16);
        float localReach=reach*contour;
        float falloff=1.0-smoothstep(0.0,localReach,cardD);
        float coarse=hash21(floor((q+vec2(uTime*5.0,-uTime*3.0))/(uFocusParticles.z*2.8))+317.2);
        float breakup=smoothstep(.18,.8,coarse+falloff*.62);
        float field=outside*pow(max(falloff,0.0),1.42)*breakup;
        if(field<=.001)return vec4(0.0);
        float cell=max(uFocusParticles.z,5.0);
        float radius=max(length(q),1.0);
        vec2 direction=q/radius;
        float travel=(uFocusMotion.x+amount*3.6)*uFocusMotion.y;
        vec2 drift=vec2(uTime*.45*cell,sin(uTime*1.7+q.x*.013)*cell*.34)*uFocusMotion.y;
        vec2 gridP=(q+direction*cell*travel+drift)/cell;
        vec2 tile=floor(gridP);
        vec2 guv=fract(gridP);
        float seed=hash21(tile+223.41);
        float density=mix(.06,.54,pow(max(falloff,0.0),.82))*mix(.24,1.0,amount);
        float glyph=floor(clamp(falloff*6.35+(seed-.5)*1.35,0.0,6.0));
        float mask=glyphMask(tile,glyph,guv);
        float pulse=.84+.16*sin(uTime*2.1+hash21(tile+47.13)*6.28318);
        return vec4(vec3(.095,.11,.102),mask*step(seed,density)*field*amount*pulse*uFocusParticles.w);
      }

      void main(){
        vec2 p=(vUv-.5)*uResolution;
        float d=1e6;
        float d0=1e6,d1=1e6;
        vec2 uv0=vec2(.5),uv1=vec2(.5);
        float im0=0.0,im1=0.0,dm0=1.0,dm1=1.0;
        float halfSpan=length(uSize)*.5;
        for(int i=0;i<${COUNT};i++){
          vec4 st=uState[i];
          float grown=max(st.x,st.y);
          if(grown<=.0001)continue;
          vec2 delta=p-uPos[i];
          float cull=halfSpan*grown+uK+18.0;
          if(dot(delta,delta)>cull*cull)continue;
          vec2 q=turn(delta,uRot[i]);
          vec2 halfSize=max(uSize*.5*st.xy,vec2(.0001));
          float rMax=min(halfSize.x,halfSize.y);
          float r=min(rMax,mix(rMax,uRadius,smoothstep(.08,.30,min(st.x,st.y))));
          float di=sdRoundBox(q,halfSize,r);
          d=smin(d,di,uK);
          vec2 luv=q/(2.0*halfSize)+.5;
          if(di<d0){d1=d0;uv1=uv0;im1=im0;dm1=dm0;d0=di;uv0=luv;im0=st.w;dm0=st.z;}
          else if(di<d1){d1=di;uv1=luv;im1=st.w;dm1=st.z;}
        }
        float cardField=d;
        float bridgeField=1e6;
        for(int i=0;i<${COUNT};i++){
          if(i>=uLinkCount)break;
          vec4 par=uLinkPar[i];
          if(par.x<=-3.0)continue;
          vec2 mid=(uLinkA[i]+uLinkB[i])*.5;
          float reach=length(uLinkB[i]-uLinkA[i])*.5+par.x+par.w+8.0;
          if(dot(p-mid,p-mid)>reach*reach)continue;
          float db=sdBridge(p,uLinkA[i],uLinkB[i],par.x,par.y,par.z);
          bridgeField=smin(bridgeField,db,max(par.w,.001));
          d=smin(d,db,par.w);
        }
        if(uWobble>.001){
          float n=sin(p.x*.024+uTime*.7)*sin(p.y*.019-uTime*.5);
          d+=n*uWobble;
        }
        float aa=clamp(fwidth(d),.55,2.0);
        float shapeAlpha=1.0-smoothstep(-aa,aa,d);
        float cardAlpha=1.0-smoothstep(-aa,aa,cardField);
        float bridgeAlpha=1.0-smoothstep(-aa,aa,bridgeField);
        float alpha=max(cardAlpha,bridgeAlpha*.42);
        float nearest=smoothstep(-14.0,14.0,d1-d0);
        vec3 c0=artAt(uv0,im0);
        vec3 c1=artAt(uv1,im1);
        vec3 color=mix(c1,c0,nearest)*mix(dm1,dm0,nearest);
        float lum=dot(color,vec3(.2126,.7152,.0722));
        color=mix(vec3(lum),color,.94);
        float surfaceD=cardAlpha>.001?cardField:bridgeField;
        float edge=1.0-smoothstep(-1.2,-.2,surfaceD);
        color=mix(vec3(.58,.49,.36),color,edge);
        float bridgeOnly=bridgeAlpha*(1.0-cardAlpha);
        vec3 bridgeColor=mix(vec3(.28,.23,.16),vec3(.38,.32,.23),1.0-smoothstep(-3.5,0.0,bridgeField));
        color=mix(color,bridgeColor,bridgeOnly);

        vec4 seed=seedParticles(p);
        vec4 focus=focusParticles(p);
        vec4 intro=vec4(0.0);
        if(uIntro.w>.001&&uIntro.x<.999)intro=introParticles(p);
        if(alpha<=.001&&seed.a<=.001&&focus.a<=.001&&intro.a<=.001)discard;
        if(seed.a>.001){float combined=alpha+seed.a*(1.0-alpha);color=(color*alpha+seed.rgb*seed.a*(1.0-alpha))/max(combined,.0001);alpha=combined;}
        if(focus.a>.001){float combined=alpha+focus.a*(1.0-alpha);color=(color*alpha+focus.rgb*focus.a*(1.0-alpha))/max(combined,.0001);alpha=combined;}
        if(intro.a>.001){float combined=alpha+intro.a*(1.0-alpha);color=(color*alpha+intro.rgb*intro.a*(1.0-alpha))/max(combined,.0001);alpha=combined;}
        gl_FragColor=vec4(color,alpha);
      }
    `
  });
  material.extensions = { derivatives: true };
  scene.add(new T.Mesh(new T.PlaneGeometry(2, 2), material));

  let width = 1;
  let height = 1;
  let cardWidth = 400;
  let cardHeight = 267;
  let ringRadius = 1500;
  let ringCenterX = -1500;
  let resourcesPromise = null;
  let opened = false;
  let opener = null;
  let raf = 0;
  let introStart = 0;
  let introComplete = false;
  let rotation = 0;
  let velocity = 0;
  let selectedIndex = 0;
  let hoverIndex = -1;
  let hoverLink = -1;
  let hoverAmount = 0;
  let particleCard = -1;
  let particleAmount = 0;
  let particleFlow = 0;
  let dragging = false;
  let moved = false;
  let dragX = 0;
  let lastX = 0;
  let lastMoveTime = 0;
  let lastInteraction = 0;
  let lastRenderTime = 0;
  let lastPaintTime = 0;
  let renderScale = 0;
  let cardScreens = [];
  let linkScreens = [];
  let snapTarget = null;
  let closing = false;
  let closeTimer = 0;
  let wheelGestureActive = false;
  let wheelGestureTimer = 0;
  let wheelStepQueue = 0;
  const hoverEase = new Float32Array(COUNT);
  const sideEase = new Float32Array(COUNT);
  const linkHoverEase = new Float32Array(COUNT);
  const step = Math.PI * 2 / COUNT;

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const easeOut = value => 1 - Math.pow(1 - clamp(value), 3);
  const wrapAngle = value => Math.atan2(Math.sin(value), Math.cos(value));
  const normalizedIndex = value => ((value % COUNT) + COUNT) % COUNT;
  const slotOf = index => {
    const value = normalizedIndex(index);
    return value > COUNT / 2 ? value - COUNT : value;
  };
  const nearestTurn = target => target + Math.round((rotation - target) / (Math.PI * 2)) * Math.PI * 2;

  function qualityScale() {
    return .90;
  }

  function applyRenderScale(nextScale) {
    if(!renderer)return;
    if (Math.abs(nextScale - renderScale) < .005) return;
    renderScale = nextScale;
    renderer.setSize(Math.round(width * renderScale), Math.round(height * renderScale), false);
  }

  function requestRender() {
    if (!opened || projectLeaving || raf) return;
    raf = requestAnimationFrame(render);
  }

  function loadImage(src) {
    return new Promise(resolve => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }

  function drawCover(context, image, x, y, w, h) {
    if (!image) {
      context.fillStyle = "#cfd4d0";
      context.fillRect(x, y, w, h);
      return;
    }
    const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
    const sw = image.naturalWidth * scale, sh = image.naturalHeight * scale;
    context.save();context.beginPath();context.rect(x,y,w,h);context.clip();
    context.fillStyle = "#10110f";context.fillRect(x,y,w,h);
    context.drawImage(image, x+(w-sw)*.5, y+(h-sh)*.5, sw, sh);
    context.restore();
  }

  function loadResources() {
    if (resourcesPromise) return resourcesPromise;
    resourcesPromise = Promise.all(works.map(work => loadImage(work.src))).then(images => {
      const atlas = document.createElement("canvas");
      const cellW = 1280;
      const cellH = 720;
      atlas.width = cellW * 3;
      atlas.height = cellH * 3;
      const context = atlas.getContext("2d", { alpha: false });
      context.fillStyle = "#cfd4d0";
      context.fillRect(0, 0, atlas.width, atlas.height);
      images.forEach((image, index) => drawCover(context, image, (index % 3) * cellW, Math.floor(index / 3) * cellH, cellW, cellH));
      const texture = new T.CanvasTexture(atlas);
      texture.minFilter = T.LinearMipmapLinearFilter;
      texture.magFilter = T.LinearFilter;
      texture.generateMipmaps = true;
      texture.anisotropy = renderer?Math.min(8, renderer.capabilities.getMaxAnisotropy()):1;
      texture.colorSpace = T.SRGBColorSpace;
      uniforms.uAtlas.value.dispose();
      uniforms.uAtlas.value = texture;
    });
    return resourcesPromise;
  }

  function resize() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    renderScale = 0;
    applyRenderScale(qualityScale(introComplete ? "idle" : "intro"));
    uniforms.uResolution.value.set(width, height);
    cardWidth = clamp(width * .40, 640, 800);
    cardHeight = cardWidth * .5625;
    ringRadius = clamp(width * .55, 940, 1060);
    ringCenterX = -ringRadius;
    archive.style.setProperty("--works-ring-radius", `${ringRadius}px`);
    archive.style.setProperty("--works-ring-center-x", `${ringCenterX}px`);
    uniforms.uSize.value.set(cardWidth, cardHeight);
    uniforms.uRadius.value = 4;
    uniforms.uK.value = clamp(cardWidth * .045, 12, 15);
    uniforms.uIntroHalf.value.set(cardWidth * .55, cardHeight * .55);
    uniforms.uIntro.value.z = clamp(width * .0086, 11, 14);
    uniforms.uSeedParticles.value.y = clamp(width * .098, 118, 158);
    uniforms.uSeedParticles.value.z = uniforms.uIntro.value.z;
  }

  let infoTimer = 0;
  function updateInfo(index, immediate = false) {
    const work = works[index];
    selectedIndex = index;
    indexList?.querySelectorAll("button").forEach((button, buttonIndex) => button.classList.toggle("is-active", buttonIndex === index));
    titleList?.querySelectorAll("span").forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
    railTicks?.querySelectorAll("i").forEach((tick, tickIndex) => tick.classList.toggle("is-active", tickIndex === index));
    if (railCurrent) railCurrent.textContent = String(index + 1).padStart(2, "0");
    const apply = () => {
      fields.ordinal.textContent = String(index + 1).padStart(2, "0");
      fields.title.textContent = work.title;
      fields.english.textContent = work.english;
      setText(document.getElementById("worksOrbitDescription"), ["中国神话的长篇影像尝试，走向卫视黄金档。", "从远山到身边，保存土地与日常的记忆。", "真实表演与虚拟角色，共同构成中秋舞台。", "代码构建运动、材质与影像叙事。", "以越南为背景，沿着一只塑料袋看见水环境的处境。"][index]);
      fields.type.textContent = work.type;
      fields.year.textContent = work.year;
      fields.medium.textContent = work.medium;
      if (infoFields.ordinal) infoFields.ordinal.textContent = `作品资料 / ${String(index + 1).padStart(2, "0")}`;
      if (infoFields.title) infoFields.title.textContent = work.title;
      if (infoFields.english) infoFields.english.textContent = work.english;
      if (infoFields.type) infoFields.type.textContent = work.type;
      if (infoFields.medium) infoFields.medium.textContent = work.medium;
      if (infoFields.year) infoFields.year.textContent = work.year;
      const total = String(COUNT).padStart(2, "0");
      fields.counter.textContent = `${String(index + 1).padStart(2, "0")} / ${total}`;
      if (fields.position) fields.position.textContent = `${String(index + 1).padStart(2, "0")} / ${total}`;
      infoLeft.classList.remove("is-changing");
      infoRight.classList.remove("is-changing");
    };
    clearTimeout(infoTimer);
    if (immediate || reducedMotion) apply();
    else {
      infoLeft.classList.add("is-changing");
      infoRight.classList.add("is-changing");
      infoTimer = setTimeout(apply, 135);
    }
  }

  function buildIndex() {
    indexList.innerHTML = works.map((work, index) => `
      <button type="button" data-orbit-index="${index}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${work.title}</strong></button>
    `).join("");
    if (titleList) titleList.innerHTML = works.map((work, index) => `<span${index === 0 ? ' class="is-active"' : ""}>${work.title}</span>`).join("");
    if (railTicks) railTicks.innerHTML = works.map((_, index) => `<i${index === 0 ? ' class="is-active"' : ""}></i>`).join("");
  }

  function setIndexOpen(open) {
    indexPanel.classList.toggle("is-open", open);
    indexPanel.setAttribute("aria-hidden", String(!open));
    indexTrigger.setAttribute("aria-expanded", String(open));
  }

  function setInfoOpen(open) {
    if (!infoPanel || !infoToggle) return;
    infoPanel.classList.toggle("is-open", open);
    infoPanel.setAttribute("aria-hidden", String(!open));
    infoToggle.setAttribute("aria-expanded", String(open));
  }

  function playInfoIcon() {
    if (!infoToggle || reducedMotion) return;
    infoToggle.classList.remove("is-animating");
    void infoToggle.offsetWidth;
    infoToggle.classList.add("is-animating");
    window.setTimeout(() => infoToggle.classList.remove("is-animating"), 1000);
  }

  function introState(elapsed) {
    if (reducedMotion) return { gather: 1, launch: 1, spread: 1, zoom: 1 };
    return {
      gather: smooth(elapsed / 1450),
      launch: smooth((elapsed - 1800) / 650),
      spread: smooth((elapsed - 2450) / 1200),
      zoom: smooth((elapsed - 3900) / 1350)
    };
  }

  function updateLayout(now, dt, state) {
    const order = [];
    const finalPositions = [];
    const generationTravel = new Float32Array(COUNT + 1);
    const cumulativeTravel = new Float32Array(COUNT + 1);
    for (let generation = 1; generation < generationTravel.length; generation += 1) {
      const start = .08 + ((generation - 1) / 8) * .18;
      generationTravel[generation] = smooth((state.spread - start) / .74);
      cumulativeTravel[generation] = cumulativeTravel[generation - 1] + generationTravel[generation];
    }
    cardScreens = [];
    linkScreens = [];
    let frontIndex = 0;
    let frontDistance = Infinity;
    const previewRadius = Math.min(width, height) * .35;
    const activeRadius = previewRadius + (ringRadius - previewRadius) * state.zoom;
    const activeCenterX = ringCenterX * state.zoom;
    const introCardScale = .34 + .66 * state.zoom;

    for (let index = 0; index < COUNT; index += 1) {
      const slot = slotOf(index);
      const generation = Math.abs(slot);
      const travel = index === 0 ? 1 : generationTravel[generation];
      const travelledSlots = index === 0 ? 0 : Math.sign(slot) * cumulativeTravel[generation];
      const baseAngle = rotation + travelledSlots * step;
      const angle = baseAngle + (1 - state.zoom) * Math.PI * .5;
      const restAngle = rotation + slot * step;
      const restX = ringCenterX + Math.cos(restAngle) * ringRadius;
      const restY = Math.sin(restAngle) * ringRadius;
      const orbitX = activeCenterX + Math.cos(angle) * activeRadius;
      const orbitY = Math.sin(angle) * activeRadius;
      const introX = 0;
      const introY = 8;
      let x = index === 0 ? introX + (orbitX - introX) * state.launch : orbitX;
      let y = index === 0 ? introY + (orbitY - introY) * state.launch : orbitY;

      const wantedHover = index === hoverIndex ? 1 : 0;
      hoverEase[index] += (wantedHover - hoverEase[index]) * (1 - Math.exp(-dt * (wantedHover ? 11 : 7)));
      const neighbor = hoverIndex >= 0 && Math.abs(slotOf(hoverIndex) - slot) === 1;
      sideEase[index] += ((neighbor ? hoverAmount : 0) - sideEase[index]) * (1 - Math.exp(-dt * 8));
      const outwardX = Math.cos(restAngle);
      const outwardY = Math.sin(restAngle);
      x += outwardX * hoverEase[index] * 12;
      y += outwardY * hoverEase[index] * 12;
      if (neighbor) {
        const direction = slot < slotOf(hoverIndex) ? -1 : 1;
        x += -Math.sin(restAngle) * direction * sideEase[index] * 22;
        y += Math.cos(restAngle) * direction * sideEase[index] * 22;
      }

      let scale;
      if (index === 0) {
        const born = smooth((state.gather - .46) / .5);
        const condensedScale = 1.1 + (.34 - 1.1) * state.launch;
        scale = born * (state.launch < .999 ? condensedScale : introCardScale);
      } else {
        scale = easeOut(travel / .33) * introCardScale;
      }
      scale *= 1 + hoverEase[index] * .09 - sideEase[index] * .035;

      positions[index].set(x, y);
      restPositions[index].set(restX, restY);
      const visualAngle = introComplete ? angle : angle * state.zoom;
      rotations[index] = visualAngle;
      cardState[index].set(scale, scale, 1 - sideEase[index] * .15, index);
      finalPositions[index] = { x: restX, y: restY, angle: restAngle, scale };
      order.push(index);

      const screenX = width * .5 + x;
      const screenY = height * .5 - y;
      cardScreens[index] = { x: screenX, y: screenY, w: cardWidth * scale, h: cardHeight * scale, rotation: -visualAngle, visible: scale };
      const distance = Math.abs(wrapAngle(restAngle));
      if (distance < frontDistance) {
        frontDistance = distance;
        frontIndex = index;
      }
    }

    if (introComplete && snapTarget === null && frontIndex !== selectedIndex) updateInfo(frontIndex);
    order.sort((a, b) => slotOf(a) - slotOf(b));
    const closed = state.spread > .995;
    const count = closed ? COUNT : COUNT - 1;
    for (let link = 0; link < count; link += 1) {
      const a = order[link];
      const b = order[(link + 1) % COUNT];
      const pa = positions[a];
      const pb = positions[b];
      const currentDistance = Math.hypot(pa.x - pb.x, pa.y - pb.y);
      const scaleA = cardState[a].x;
      const scaleB = cardState[b].x;
      const minimumScale = Math.min(scaleA, scaleB);
      if (minimumScale < .11) {
        linkPar[link].set(-100, -100, 0, 0);
        continue;
      }
      const edgeA = cardHeight * .47 * scaleA;
      const edgeB = cardHeight * .47 * scaleB;
      const linkedHover = (a === hoverIndex || b === hoverIndex) ? hoverAmount : 0;
      const wantedLinkHover = link === hoverLink ? 1 : 0;
      linkHoverEase[link] += (wantedLinkHover - linkHoverEase[link]) * (1 - Math.exp(-dt * (wantedLinkHover ? 12 : 7)));
      const directHover = linkHoverEase[link];
      const breathWave = .5 + .5 * Math.sin(now * .0052 + link * .8);
      const lineRadius = 1.55 + linkedHover * (.45 + .2 * breathWave) + directHover * (.9 + .45 * breathWave);
      const dirX = currentDistance > .001 ? (pb.x - pa.x) / currentDistance : 0;
      const dirY = currentDistance > .001 ? (pb.y - pa.y) / currentDistance : 1;
      linkA[link].set(pa.x + dirX * edgeA, pa.y + dirY * edgeA);
      linkB[link].set(pb.x - dirX * edgeB, pb.y - dirY * edgeB);
      const sag = (link % 2 ? -1 : 1) * (1.4 + linkedHover * Math.sin(now * .0028 + link) * .8 + directHover * Math.sin(now * .004 + link) * 1.7);
      linkPar[link].set(lineRadius, lineRadius, sag, .7);
      linkScreens[link] = {
        ax: width * .5 + linkA[link].x,
        ay: height * .5 - linkA[link].y,
        bx: width * .5 + linkB[link].x,
        by: height * .5 - linkB[link].y,
        visible: true
      };
    }
    for (let link = count; link < COUNT; link += 1) {
      linkPar[link].set(-100, -100, 0, 0);
      linkHoverEase[link] += (0 - linkHoverEase[link]) * (1 - Math.exp(-dt * 7));
    }
    uniforms.uLinkCount.value = 0; // The user asked to remove the added connector lines.
    uniforms.uWobble.value = 0;

    const wantedParticle = introComplete ? hoverIndex : -1;
    if (particleCard < 0 && wantedParticle >= 0) {
      particleCard = wantedParticle;
      particleFlow = 0;
    }
    const entering = particleCard >= 0 && particleCard === wantedParticle;
    particleAmount += ((entering ? 1 : 0) - particleAmount) * (1 - Math.exp(-dt * (entering ? 10 : 7)));
    particleFlow += dt * (entering ? .75 : -3.2);
    if (!entering && particleAmount < .012) {
      particleCard = wantedParticle;
      particleAmount = 0;
      particleFlow = 0;
    }
    if (particleCard >= 0) {
      const st = cardState[particleCard];
      uniforms.uFocusPos.value.copy(positions[particleCard]);
      uniforms.uFocusBox.value.set(cardWidth * .5 * st.x, cardHeight * .5 * st.y, 8, rotations[particleCard]);
    }
    uniforms.uFocusParticles.value.set(particleAmount, clamp(width * .054, 64, 86), clamp(width * .0068, 9, 11), .5);
    uniforms.uFocusMotion.value.set(particleFlow, reducedMotion ? 0 : 1);
    uniforms.uIntro.value.x = state.gather;
    uniforms.uIntro.value.w = reducedMotion ? 0 : .98;
    uniforms.uSeedParticles.value.x = state.launch;
  }

  function updateRotation(now, dt) {
    if (!introComplete || dragging) return;
    if (snapTarget !== null) {
      rotation += (snapTarget - rotation) * (1 - Math.exp(-dt * 8.5));
      if (Math.abs(snapTarget - rotation) < .00035) {
        rotation = snapTarget;
        snapTarget = null;
        if (wheelStepQueue) {
          const direction = Math.sign(wheelStepQueue);
          wheelStepQueue -= direction;
          rotateTo(normalizedIndex(selectedIndex + direction), true);
        }
      }
      return;
    }
    if (Math.abs(velocity) > .0001) {
      rotation += velocity * dt;
      velocity *= Math.pow(.025, dt);
    }
    if (now - lastInteraction > 250 && Math.abs(velocity) < .16) {
      const target = Math.round(rotation / step) * step;
      rotation += (target - rotation) * (1 - Math.exp(-dt * 5.6));
      if (Math.abs(target - rotation) < .0002) rotation = target;
    }
  }

  function render(now) {
    if (!opened || projectLeaving) return;
    raf = 0;
    const moving = dragging || snapTarget !== null || Math.abs(velocity) > .004 || now - lastInteraction < 320;
    const hoverActive = hoverIndex >= 0 || hoverLink >= 0 || particleAmount > .015 || hoverAmount > .015 || linkHoverEase.some(value => value > .015);
    const frameInterval = moving ? 16 : (!introComplete ? 24 : (hoverActive ? 33 : 16));
    if (lastPaintTime && now - lastPaintTime < frameInterval) {
      raf = requestAnimationFrame(render);
      return;
    }
    lastPaintTime = now;
    const dt = lastRenderTime ? Math.min(.05, (now - lastRenderTime) / 1000) : .016;
    lastRenderTime = now;
    const elapsed = now - introStart;
    const state = introState(elapsed);
    if (!introComplete && (reducedMotion || elapsed >= 5800)) {
      introComplete = true;
      archive.classList.add("is-ready");
      setText(fields.status,"滚动切换作品");
    } else if (!introComplete) {
      setText(fields.status,elapsed < 1450 ? "画面凝聚" : elapsed < 1800 ? "形态成像" : elapsed < 2450 ? "影像展开" : elapsed < 3650 ? "空间展开" : elapsed < 5250 ? "作品入场" : "进入作品");
    }
    archive.classList.toggle("is-unfurling", !introComplete && state.spread > .12);
    archive.classList.toggle("is-ring-preview", !introComplete && state.spread > .82 && state.zoom < .38);
    applyRenderScale(qualityScale(!introComplete ? "intro" : moving ? "motion" : hoverActive ? "hover" : "idle"));
    updateRotation(now, dt);
    hoverAmount += ((hoverIndex >= 0 ? 1 : 0) - hoverAmount) * (1 - Math.exp(-dt * 8));
    updateLayout(now, dt, state);
    uniforms.uTime.value = now * .001;
    renderer.render(scene, camera);
    const keepAnimating = !introComplete || moving || hoverActive || now - lastInteraction < 760;
    if (keepAnimating) raf = requestAnimationFrame(render);
    else lastPaintTime = 0;
  }

  function hitTest(clientX, clientY) {
    for (let index = cardScreens.length - 1; index >= 0; index -= 1) {
      const card = cardScreens[index];
      if (!card || card.visible < .7) continue;
      const dx = clientX - card.x;
      const dy = clientY - card.y;
      const c = Math.cos(card.rotation);
      const s = Math.sin(card.rotation);
      const x = dx * c - dy * s;
      const y = dx * s + dy * c;
      if (Math.abs(x) <= card.w * .5 && Math.abs(y) <= card.h * .5) return index;
    }
    return -1;
  }

  function hitTestLink(clientX, clientY) {
    let nearest = -1;
    let nearestDistance = 18;
    linkScreens.forEach((link, index) => {
      if (!link?.visible) return;
      const abx = link.bx - link.ax;
      const aby = link.by - link.ay;
      const lengthSquared = abx * abx + aby * aby;
      if (lengthSquared < 1) return;
      const projection = clamp(((clientX - link.ax) * abx + (clientY - link.ay) * aby) / lengthSquared);
      const x = link.ax + abx * projection;
      const y = link.ay + aby * projection;
      const distance = Math.hypot(clientX - x, clientY - y);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function rotateTo(index, preserveQueue = false) {
    if (!preserveQueue) wheelStepQueue = 0;
    const target = nearestTurn(-slotOf(index) * step);
    snapTarget = target;
    velocity = 0;
    updateInfo(index);
    lastInteraction = performance.now();
    requestRender();
  }

  function open(source, resume = null) {
    if (opened) return;
    window.clearTimeout(closeTimer);
    opener = source || document.activeElement;
    opened = true;
    ensureRenderer();
    closing = false;
    archive.classList.remove("is-exiting", "is-exit-folding");
    archive.classList.add("is-open");
    archive.classList.remove("is-ready");
    archive.setAttribute("aria-hidden", "false");
    document.body.classList.add("works-orbit-open");
    setIndexOpen(false);
    setInfoOpen(false);
    rotation = resume ? -normalizedIndex(resume.index||0)*step : 0;
    velocity = 0;
    snapTarget = null;
    wheelStepQueue = 0;
    hoverIndex = -1;
    hoverLink = -1;
    hoverAmount = 0;
    particleCard = -1;
    particleAmount = 0;
    introComplete = reducedMotion || !!resume;
    archive.classList.toggle('is-ready',introComplete);
    hoverEase.fill(0);
    sideEase.fill(0);
    linkHoverEase.fill(0);
    fields.status.textContent = reducedMotion ? "滚动切换作品" : "画面凝聚";
    updateInfo(resume?normalizedIndex(resume.index||0):0, true);
    resize();
    sceneTitle?.classList.add("is-visible");
    loadResources().then(async () => {
      // Compile before starting the six-second choreography, rather than on its first frame.
      await renderer.compileAsync(scene,camera);
      if (!opened) return;
      introStart = performance.now()-(resume?6000:0);
      lastRenderTime = performance.now();
      lastPaintTime = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    });
    if (cursorLabel) cursorLabel.textContent = "转动作品";
    window.dispatchEvent(new CustomEvent("v31:works-orbit-open"));
  }

  function finishClose() {
    opened = false;
    cancelAnimationFrame(raf);
    raf = 0;
    archive.classList.remove("is-open", "is-ready", "is-exiting", "is-exit-folding");
    archive.classList.remove("is-unfurling", "is-ring-preview");
    archive.setAttribute("aria-hidden", "true");
    document.body.classList.remove("works-orbit-open");
    sceneTitle?.classList.remove("is-visible");
    setIndexOpen(false);
    setInfoOpen(false);
    if (cursorLabel) cursorLabel.textContent = "Disturb";
    window.dispatchEvent(new CustomEvent("v31:works-orbit-close"));
    setTimeout(() => opener?.focus?.({ preventScroll: true }), 80);
  }

  let projectFrame=null;
  function finishProjectReturn(){
    if(window.portfolioTransition){void window.portfolioTransition(performProjectReturn);return;}
    performProjectReturn();
  }
  function performProjectReturn(){
    projectFrame?.remove();projectFrame=null;document.querySelector('.works-project-transition')?.remove();
    document.body.classList.remove('is-project-leaving','is-project-active');projectLeaving=false;
    try{const s=JSON.parse(sessionStorage.getItem('brain-universe-work-return')||'null');if(s){s.active=false;sessionStorage.setItem('brain-universe-work-return',JSON.stringify(s));}}catch{}
    lastInteraction=performance.now();lastPaintTime=0;requestRender();closeButton.focus({preventScroll:true});
  }
  function openProject(pushHistory=true){
    const work=works[selectedIndex];if(!opened||!introComplete||projectLeaving||!work.href)return;
    projectLeaving=true;dragging=false;hoverIndex=hoverLink=-1;cancelAnimationFrame(raf);raf=0;
    const url=new URL(location.href);url.searchParams.set('v','32.91');url.searchParams.set('return','1');url.searchParams.set('work',new URL(work.href,location.href).pathname.split('/').pop().replace('.html',''));
    try{sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));sessionStorage.setItem('brain-universe-work-return',JSON.stringify({active:true,index:selectedIndex,scroll:scrollY,href:url.pathname+url.search}));}catch{}
    const veil=document.createElement('div');veil.className='works-project-transition';veil.setAttribute('aria-hidden','true');veil.innerHTML='<i class="project-shutter top"></i><i class="project-shutter bottom"></i><span class="project-play-cue">▷</span>';document.body.appendChild(veil);
    document.body.classList.add('is-project-leaving');
    // Keep the existing world and its GPU resources alive across this child route.
    // The child is a real standalone document; direct links and refresh still work.
    projectFrame=document.createElement('iframe');projectFrame.id='workProjectFrame';projectFrame.className='work-project-frame';projectFrame.title=work.title+' · 独立作品页';projectFrame.src=work.href+'&embedded=1';projectFrame.setAttribute('allow','autoplay');
    let loaded=false,curtainClosed=false;
    const reveal=()=>{if(!loaded||!curtainClosed||!projectFrame)return;document.body.classList.add('is-project-active');projectFrame.classList.add('is-visible');projectFrame.focus();projectFrame.contentWindow.postMessage({type:'brain-universe:project-visible'},location.origin);veil.animate([{opacity:1},{opacity:0}],{duration:reducedMotion?1:300,fill:'forwards'}).finished.then(()=>veil.remove());};
    projectFrame.addEventListener('load',()=>{loaded=true;reveal();},{once:true});document.body.appendChild(projectFrame);
    if(pushHistory)history.pushState({brainWork:url.searchParams.get('work')},'',new URL('./v31.html?v=32.152',location.href));
    setTimeout(()=>{curtainClosed=true;reveal();},reducedMotion?100:820);
  }
  window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===projectFrame?.contentWindow&&event.data?.type==='brain-universe:work-return'){history.replaceState(null,'',new URL('./v31.html?v=32.152',location.href));finishProjectReturn();}});
  window.addEventListener('popstate',event=>{const i=event.state?.brainWork?works.findIndex(w=>w.href&&new URL(w.href,location.href).pathname.endsWith('/'+event.state.brainWork+'.html')):-1;if(i<0){if(projectFrame)finishProjectReturn();}else if(!projectFrame){if(!opened)open(null,{index:i});rotation=-i*(Math.PI*2/COUNT);updateInfo(i,true);openProject(false);}});

  function close() {
    if (!opened || closing) return;
    if (reducedMotion) {
      finishClose();
      return;
    }
    closing = true;
    dragging = false;
    velocity = 0;
    snapTarget = null;
    wheelStepQueue = 0;
    hoverIndex = -1;
    hoverLink = -1;
    setIndexOpen(false);
    setInfoOpen(false);
    fields.status.textContent = "返回造境手记";
    archive.classList.add("is-exiting");
    requestRender();
    window.setTimeout(() => {
      if (closing && opened) archive.classList.add("is-exit-folding");
    }, 250);
    closeTimer = window.setTimeout(finishClose, 1080);
  }

  buildIndex();
  resize();
  updateInfo(0, true);
  const warmResources = () => {
    if (typeof requestIdleCallback === "function") requestIdleCallback(() => loadResources(), { timeout: 1800 });
    else setTimeout(() => loadResources(), 500);
  };
  if (document.body.dataset.openingComplete === "true") warmResources();
  else window.addEventListener("v85:home-intro-finished", warmResources, { once: true });
  closeButton.addEventListener("click", close);
  indexTrigger.addEventListener("click", () => setIndexOpen(!indexPanel.classList.contains("is-open")));
  infoToggle?.addEventListener("pointerenter", playInfoIcon);
  infoToggle?.addEventListener("focus", playInfoIcon);
  infoToggle?.addEventListener("click", () => {
    playInfoIcon();
    setInfoOpen(!infoPanel.classList.contains("is-open"));
  });
  infoClose?.addEventListener("click", () => {
    setInfoOpen(false);
    infoToggle?.focus({ preventScroll: true });
  });
  indexList.addEventListener("click", event => {
    const button = event.target.closest("[data-orbit-index]");
    if (!button) return;
    rotateTo(Number(button.dataset.orbitIndex));
    setIndexOpen(false);
  });

  field.addEventListener("pointermove", event => {
    if (!opened || closing || !introComplete) return;
    if (dragging) {
      const now = performance.now();
      const dx = event.clientX - lastX;
      if (Math.abs(event.clientX - dragX) > 6) moved = true;
      rotation += dx / width * 2.1;
      velocity = dx / Math.max(8, now - lastMoveTime) * 1.8;
      lastX = event.clientX;
      lastMoveTime = now;
      lastInteraction = now;
      hoverIndex = -1;
      hoverLink = -1;
      snapTarget = null;
    } else {
      hoverIndex = hitTest(event.clientX, event.clientY);
      hoverLink = hoverIndex >= 0 ? -1 : hitTestLink(event.clientX, event.clientY);
      if (cursorLabel) setText(cursorLabel,hoverIndex >= 0 ? (hoverIndex === selectedIndex ? (works[selectedIndex].href?"查看作品":"当前作品") : "聚焦") : hoverLink >= 0 ? "触动连线" : "转动作品");
    }
    requestRender();
  });
  field.addEventListener("pointerleave", () => {
    if (!dragging) {
      hoverIndex = -1;
      hoverLink = -1;
    }
    requestRender();
  });

  window.addEventListener("pointerdown", event => {
    if (!opened || closing || projectLeaving || !introComplete || event.button !== 0 || event.target.closest?.("button,.works-orbit-index,.works-orbit-info-panel")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    dragging = true;
    snapTarget = null;
    wheelStepQueue = 0;
    moved = false;
    dragX = lastX = event.clientX;
    lastMoveTime = performance.now();
    lastInteraction = lastMoveTime;
    field.classList.add("is-dragging");
    requestRender();
  }, true);
  window.addEventListener("pointerup", event => {
    if (!opened || !dragging) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    dragging = false;
    field.classList.remove("is-dragging");
    if (!moved) {
      const index = hitTest(event.clientX, event.clientY);
      if (index >= 0 && index !== selectedIndex) rotateTo(index);
      else if(index===selectedIndex)openProject();
    }
    lastInteraction = performance.now();
    requestRender();
  }, true);
  window.addEventListener("wheel", event => {
    if (!opened) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (closing || !introComplete || indexPanel.classList.contains("is-open")) return;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(delta) < 2) return;
    window.clearTimeout(wheelGestureTimer);
    wheelGestureTimer = window.setTimeout(() => { wheelGestureActive = false; }, 220);
    if (wheelGestureActive) return;
    wheelGestureActive = true;
    const direction = delta > 0 ? 1 : -1;
    rotateTo(normalizedIndex(selectedIndex + direction), true);
  }, { capture: true, passive: false });
  window.addEventListener("keydown", event => {
    if (!opened) return;
    if(event.key==='Enter'&&introComplete&&event.target===document.body){event.preventDefault();openProject();}
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (indexPanel.classList.contains("is-open")) setIndexOpen(false);
      else if (infoPanel?.classList.contains("is-open")) setInfoOpen(false);
      else close();
    }
    if (introComplete && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      rotateTo(normalizedIndex(selectedIndex + (event.key === "ArrowRight" ? 1 : -1)));
    }
  }, true);
  window.addEventListener("resize", () => {
    resize();
    requestRender();
  });

  function interceptWorksEntry(event) {
    const enter = event.target.closest?.("#enterWork");
    if (enter && document.getElementById("stage")?.dataset.work === "0") {
      event.preventDefault();
      event.stopImmediatePropagation();
      open(enter);
      return;
    }
    // Original directory owns its fade transition; keep the archive available through open().

  }
  document.addEventListener("pointerdown", interceptWorksEntry, true);
  document.addEventListener("click", interceptWorksEntry, true);
  window.worksOrbitState=()=>({motionVersion:164,restoredPriorMotion:true,contentCount:works.length,opened,ready:introComplete&&!!renderer&&!renderer.getContext().isContextLost(),selectedIndex,cards:cardScreens,projectLeaving,contextLost:renderer?renderer.getContext().isContextLost():false});
  window.openWorksOrbitArchive = open;
  const restoreProject=()=>{
    let saved;try{saved=JSON.parse(sessionStorage.getItem('brain-universe-work-return')||'null');}catch{}
    const url=new URL(location.href),explicit=['after-journey','rural-return','mid-autumn','physical-universe','humid-southeast-asia'].includes(url.searchParams.get('work')),historyReturn=performance.getEntriesByType('navigation')[0]?.type==='back_forward';
    if(saved?.kind==='home-creation'||(!explicit&&!(historyReturn&&saved?.active)))return;
    if(saved){saved.active=false;try{sessionStorage.setItem('brain-universe-work-return',JSON.stringify(saved));}catch{}}
    open(null,saved||{index:0});url.searchParams.delete('work');url.searchParams.delete('return');history.replaceState(history.state,'',url.pathname+url.search);
  };
  // Wait for the existing entry controller to resume Lenis and restore the page position.
  if(document.body.dataset.openingComplete==='true')setTimeout(restoreProject,220);
  else window.addEventListener('v31:opening-complete',()=>setTimeout(restoreProject,100),{once:true});
  window.addEventListener('pageshow',e=>{if(e.persisted){projectLeaving=false;document.querySelector('.works-project-transition')?.remove();document.body.classList.remove('is-project-leaving');lastInteraction=performance.now();requestRender();}});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);raf=0;});
})();
