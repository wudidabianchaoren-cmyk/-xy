(() => {
  "use strict";

  // A browser refresh always starts a new entry, regardless of the saved section.
  try { const nav=performance.getEntriesByType('navigation')[0];
    if(nav?.type==='reload'){
      document.body.dataset.portfolioFreshReload='true';
      document.body.dataset.homeIntroReplay='true';
      document.body.dataset.returnedFromChild='false';
      history.scrollRestoration='manual';
      const url=new URL(location.href);url.searchParams.delete('return');url.hash='';
      history.replaceState(history.state,'',url.pathname+url.search);
      window.scrollTo({top:0,left:0,behavior:'instant'});
      window.addEventListener('load',()=>window.scrollTo({top:0,left:0,behavior:'instant'}),{once:true});
    }
  }catch{}
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener('click',event=>{const a=event.target.closest?.('a[href]');if(a&&/\/(?:reading|learning)\.html(?:[?#]|$)/.test(a.getAttribute('href'))){try{sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));}catch{}}},true);
  const rememberCurrentView=()=>{if(document.body.classList.contains('experience-entered')){try{sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));const home=document.querySelector('#voyage')?.getBoundingClientRect(),next=document.querySelector('#sandNarrative')?.getBoundingClientRect();const isHome=home&&home.bottom>innerHeight*.55&&home.top<innerHeight*.25&&(!next||next.top>innerHeight*.55)&&!document.body.classList.contains('works-orbit-open')&&!document.body.classList.contains('is-project-active');sessionStorage.setItem('brain-universe-last-view',isHome?'home':'other');}catch{}}};
  window.addEventListener('beforeunload',rememberCurrentView);
  window.addEventListener('pagehide',rememberCurrentView);
  let rememberTimer=0;window.addEventListener('scroll',()=>{clearTimeout(rememberTimer);rememberTimer=setTimeout(rememberCurrentView,120);},{passive:true});
  const demoItems = [
    { label: "Memory Field", tone: ["#6f8888", "#1a2222", "#d8ded8"] },
    { label: "Cliff Signal", tone: ["#718191", "#151a20", "#c8d3d6"] },
    { label: "Rain Archive", tone: ["#7d9aa4", "#101a1d", "#d9e5e8"] },
    { label: "Bamboo Drift", tone: ["#7f9274", "#121a12", "#d7d0ad"] },
    { label: "Palace Axis", tone: ["#8a7c74", "#191412", "#ded0bc"] },
    { label: "Dusk Residue", tone: ["#8a7972", "#1d1715", "#d9c7b3"] },
    { label: "Unknown Route", tone: ["#8a8a9a", "#12141b", "#d9d7df"] }
  ];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function makeDemoImage(item, index) {
    const [a, b, c] = item.tone;
    const lines = Array.from({ length: 9 }, (_, i) => {
      const y = 90 + i * 70;
      const alpha = (0.08 + i * 0.018).toFixed(3);
      return `<path d="M${-80 + i * 12} ${y} C 220 ${y - 90}, 580 ${y + 80}, 980 ${y - 40}, 1260 ${y + 28}" stroke="${c}" stroke-opacity="${alpha}" stroke-width="${1 + (i % 3)}" fill="none"/>`;
    }).join("");
    const text = item.label.toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760">
        <defs>
          <linearGradient id="g${index}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${a}"/>
            <stop offset=".58" stop-color="${b}"/>
            <stop offset="1" stop-color="${c}"/>
          </linearGradient>
          <radialGradient id="r${index}" cx="${35 + index * 7}%" cy="${28 + index * 5}%" r="54%">
            <stop offset="0" stop-color="${c}" stop-opacity=".34"/>
            <stop offset=".48" stop-color="${a}" stop-opacity=".12"/>
            <stop offset="1" stop-color="${b}" stop-opacity="0"/>
          </radialGradient>
          <filter id="grain${index}">
            <feTurbulence baseFrequency=".72" numOctaves="2" seed="${index + 4}" type="fractalNoise"/>
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer><feFuncA type="table" tableValues="0 .18"/></feComponentTransfer>
          </filter>
        </defs>
        <rect width="1200" height="760" fill="url(#g${index})"/>
        <rect width="1200" height="760" fill="url(#r${index})"/>
        ${lines}
        <circle cx="${210 + index * 46}" cy="${170 + index * 22}" r="${80 + index * 7}" fill="${c}" opacity=".08"/>
        <rect x="${80 + index * 18}" y="${420 - index * 16}" width="${320 + index * 22}" height="2" fill="${c}" opacity=".28"/>
        <text x="82" y="670" fill="${c}" opacity=".72" font-family="Consolas, monospace" font-size="34">${text}</text>
        <rect width="1200" height="760" filter="url(#grain${index})" opacity=".45"/>
      </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const frames = demoItems.map(makeDemoImage);
  const imageItems = [
    { label: "云岭开境", src: "./assets/journey/journey-mountain-valley.png", note: "巨幅山谷与云海，作为西游视觉宇宙的入口远景。", group: "world" },
    { label: "雾宫残影", src: "./assets/journey/mist-palace-dusk.png", note: "粉橙天光下的宫殿剪影，建立神话秩序的远处压力。", group: "palace" },
    { label: "天阶迷雾", src: "./assets/journey/cloud-stairway-01.png", note: "云雾吞没阶梯，保留不可抵达的神性方向。", group: "palace" },
    { label: "云上宫阙", src: "./assets/journey/cloud-stairway-02.png", note: "高处楼阁与云层互相遮蔽，形成缓慢显影的空间。", group: "palace" },
    { label: "青空神域", src: "./assets/journey/sky-palace-blue.png", note: "冷蓝云海与宫殿群，适合宏观世界观章节。", group: "sky" },
    { label: "暖竹光径", src: "./assets/journey/bamboo-sun-path.png", note: "低机位竹林与暖光通道，承担行进与呼吸感。", group: "bamboo" },
    { label: "鹤洞遗骨", src: "./assets/journey/crane-cave-skull.jpg", note: "洞穴、巨骨和水面，作为危险与古老遗迹的视觉锚点。", group: "abyss" },
    { label: "高竹幽径", src: "./assets/journey/dark-bamboo-tall.png", note: "高密竹林形成压迫纵深，适合转入紧张段落。", group: "bamboo" },
    { label: "雪原孤火", src: "./assets/journey/snow-campfire.png", note: "冷色雪林中的火光，制造孤立与临时庇护。", group: "snow" },
    { label: "恐竹夜行", src: "./assets/journey/horror-bamboo-01.png", note: "湿冷竹林空镜，强调低照度和恐惧氛围。", group: "bamboo" },
    { label: "冷竹压境", src: "./assets/journey/cold-bamboo-concept.png", note: "冷调竹林与水面反光，适合实验材质和气氛层。", group: "bamboo" },
    { label: "林晚赤云", src: "./assets/journey/forest-dusk-red-01.png", note: "红色晚云穿透林线，形成章节色彩转折。", group: "dusk" },
    { label: "赤云远林", src: "./assets/journey/forest-dusk-red-02.png", note: "橙红云团与剪影森林，适合作为高潮前的远景。", group: "dusk" },
    { label: "暖竹晨光", src: "./assets/journey/warm-bamboo-glade.png", note: "明亮暖调竹林，给作品保留可呼吸的回落段。", group: "bamboo" }
  ];
  const imageStudies = [
    { composition: "超宽幅群山压住前景，以云海分隔近、中、远三层空间。", color: "青绿山体与银灰云气形成清醒、开阔的开篇色温。", motion: "适合缓慢前推、雾层横移与瀑布细流的低频运动。", role: "世界观入口 / 地理尺度建立" },
    { composition: "宫殿被压在画面中轴远端，大片雾层承担视觉留白。", color: "粉橙天光进入冷灰建筑，制造温度与权力感的冲突。", motion: "采用极慢显影和雾幕擦拭，让建筑像记忆一样出现。", role: "神话秩序 / 远处压力" },
    { composition: "阶梯从右下向高处延伸，重复栏杆强化不可抵达的方向。", color: "低饱和青灰统一云、石与天空，降低现实感。", motion: "镜头沿阶梯微升，云层反向下沉，形成失重错觉。", role: "上升段落 / 神性距离" },
    { composition: "阶梯与楼阁占据右侧，左侧云海留出进入空间。", color: "雾黄高光包裹灰绿建筑，呈现旧胶片般的时间感。", motion: "通过景深呼吸与局部遮挡，让宫阙持续显隐。", role: "天界通道 / 空间显影" },
    { composition: "宫殿群落散落于云海，远近屋顶建立宏观层级。", color: "冷蓝空气贯穿全景，亮部仅保留薄雾的白。", motion: "云海横向流动，建筑保持稳定，强调世界尺度。", role: "宏观世界 / 秩序全景" },
    { composition: "泥径从低机位进入竹林，光束集中在画面右中部。", color: "深绿阴影与金色晨光构成明暗节奏。", motion: "尘粒顺光漂移，镜头贴地前行，带出真实行进感。", role: "行进过渡 / 呼吸段落" },
    { composition: "巨骨占据洞穴核心，小船提供尺度参照和叙事入口。", color: "黑绿岩壁包围乳白骨骼，水面反射扩大幽深感。", motion: "水纹、瀑布与小船轻移，形成危险中的缓慢探索。", role: "遗迹节点 / 危险锚点" },
    { composition: "高密竹竿形成垂直栅格，水洼把纵深延续到前景。", color: "墨绿压暗四周，以冷白天光切开中心路径。", motion: "前景竹影横移、远处薄雾推进，制造被包围的行走感。", role: "紧张转场 / 压迫纵深" },
    { composition: "孤火置于雪原中央，森林轮廓形成封闭半圆。", color: "深蓝环境包围橙色火焰，冷暖对比高度集中。", motion: "火星上升、火光闪烁，镜头几乎静止以放大孤独感。", role: "临时庇护 / 情绪停顿" },
    { composition: "竹林沿画面两侧夹出中间湿地，视线被雾引向深处。", color: "低照度蓝绿压住细节，水面保留少量冷光。", motion: "雾从深处漫出，近景水纹和竹叶产生不稳定微动。", role: "恐惧空镜 / 夜行段落" },
    { composition: "粗竹前后错位形成多层遮挡，中心水路保持唯一出口。", color: "青黑色调统一植被与水面，天空冷白制造压迫。", motion: "用极慢横移和水面反光漂移建立持续的不安。", role: "材质研究 / 冷调压境" },
    { composition: "树林轮廓包围低位落日，中央天空成为情绪窗口。", color: "深青阴影与赤橙天光正面对撞，色彩突然升温。", motion: "云层加速横移，树影轻摆，作为章节情绪转折。", role: "色彩转折 / 高潮预告" },
    { composition: "大面积赤云悬在远林上方，地景被压成低位剪影。", color: "橙红云团与蓝绿色森林形成异常天象感。", motion: "云体翻涌、远林缓慢推近，积累高潮前的重量。", role: "异象远景 / 高潮前奏" },
    { composition: "竹竿左右分列，中央亮区与浅水共同形成开放通道。", color: "暖白光、草绿和深竹色恢复自然呼吸。", motion: "光尘漂浮、水面闪烁，镜头缓慢退出紧张状态。", role: "节奏回落 / 下一轮入口" }
  ];
  imageItems.forEach((item, index) => {
    Object.assign(item, imageStudies[index]);
    item.preview = item.src
      .replace("./assets/journey/", "./assets/journey/previews/")
      .replace(/\.(png|jpe?g)$/i, ".webp");
  });
  const promptItems = [
    { label: "空间、光源与运镜", src: "./assets/prompt-lab/prompt-structure.webp", note: "以 Z 轴纵深组织前景、中景与后景；从动机光源和物理运镜建立可执行的提示词。" },
    { label: "AIGC 影视制作工作流", src: "./assets/prompt-lab/production-pipeline.webp", note: "从核心行动和三幕结构出发，整理场景资产、视觉锚点及角色一致性的制作路径。" },
    { label: "提示词工程与导演调度", src: "./assets/prompt-lab/director-orchestration.webp", note: "将视觉预演、场景分级生成与时空一致性控制连接为导演思维的调度系统。" }
  ];
  const glyphMap = new Map(Object.entries({
    "脑": "腦",
    "海": "海",
    "宇": "宇",
    "宙": "宙",
    "图": "圖",
    "像": "像",
    "流": "流",
    "动": "動",
    "乡": "鄉",
    "土": "土",
    "远": "遠",
    "景": "景",
    "桥": "橋",
    "上": "上",
    "凝": "凝",
    "视": "視",
    "黄": "黃",
    "昏": "昏",
    "背": "背",
    "影": "影",
    "宫": "宮",
    "殿": "殿",
    "双": "雙",
    "强": "強",
    "崖": "崖",
    "边": "邊",
    "相": "相",
    "遇": "遇",
    "雨": "雨",
    "夜": "夜",
    "竹": "竹",
    "林": "林",
    "材": "材",
    "质": "質",
    "星": "星",
    "未": "未",
    "来": "來",
    "航": "航",
    "线": "線",
    "系": "系",
    "统": "統",
    "修": "修",
    "正": "正",
    "边": "邊",
    "界": "界",
    "展": "展",
    "览": "覽",
    "目": "目",
    "录": "錄",
    "作": "作",
    "品": "品",
    "阅": "閱",
    "读": "讀",
    "学": "學",
    "习": "習",
    "实": "實",
    "验": "驗",
    "关": "關",
    "于": "於"
  }));

  function initLightflowCursor() {
    if (reducedMotion) return;
    const layer = document.createElement("div");
    layer.className = "lightflow-cursor-layer";
    layer.setAttribute("aria-hidden", "true");
    const canvas = document.createElement("canvas");
    canvas.id = "lightflowCursorCanvas";
    layer.appendChild(canvas);
    document.body.appendChild(layer);

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const state = {
      width: 1,
      height: 1,
      dpr: 1,
      lastX: 0,
      lastY: 0,
      traces: [],
      palette: [
        [167, 201, 203],
        [142, 168, 183],
        [176, 169, 190],
        [210, 222, 220]
      ]
    };

    function resize() {
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.08);
      state.width = Math.max(1, window.innerWidth);
      state.height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.width, state.height);
    }

    let cursorFrame=0;
    function spawn(x, y, burst = false) {
      if (!document.body.classList.contains("experience-entered")) return;
      const dx = x - state.lastX;
      const dy = y - state.lastY;
      const speed = clamp(Math.hypot(dx, dy) / 58, .16, 1.8);
      const count = burst ? 5 : Math.ceil(1 + speed * 1.1);
      for (let i = 0; i < count; i += 1) {
        const angle = Math.atan2(dy || Math.random() - .5, dx || Math.random() - .5) + (Math.random() - .5) * (burst ? 1.1 : .52);
        const force = (burst ? 5.8 : 2.6) * speed * (.55 + Math.random() * .7);
        state.traces.push({
          x: x + (Math.random() - .5) * 14,
          y: y + (Math.random() - .5) * 14,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force,
          burst,
          life: 30 + Math.random() * 28,
          maxLife: 58,
          radius: (burst ? 7 : 4) + Math.random() * (burst ? 10 : 5),
          length: (burst ? 34 : 20) + Math.random() * (burst ? 42 : 24),
          color: state.palette[(i + state.traces.length) % state.palette.length],
          phase: Math.random() * Math.PI * 2
        });
      }
      if (state.traces.length > 90) state.traces.splice(0, state.traces.length - 90);
      if (!cursorFrame) cursorFrame=requestAnimationFrame(draw);
    }

    function draw() {
      cursorFrame=0;
      if(!state.traces.length){ctx.clearRect(0,0,state.width,state.height);return;}
      if (document.body.classList.contains("standalone-archive-open")) { cursorFrame=requestAnimationFrame(draw); return; }
      if (document.hidden || document.body.classList.contains("memory-open") || document.body.classList.contains("v31-flow-open")) {
        cursorFrame=requestAnimationFrame(draw);
        return;
      }
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, .08)";
      ctx.fillRect(0, 0, state.width, state.height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = state.traces.length - 1; i >= 0; i -= 1) {
        const p = state.traces[i];
        p.life -= 1;
        if (p.life <= 0) {
          state.traces.splice(i, 1);
          continue;
        }
        const k = p.life / p.maxLife;
        const alpha = Math.sin(k * Math.PI) * (p.burst ? .09 : .052);
        const [r, g, b] = p.color;
        p.vx *= .982;
        p.vy *= .982;
        p.x += p.vx + Math.sin(p.phase) * .18;
        p.y += p.vy + Math.cos(p.phase) * .14;
        p.phase += .035;

        const angle = Math.atan2(p.vy || .1, p.vx || .1);
        const tail = p.length * (.45 + k * .8);
        const x2 = p.x - Math.cos(angle) * tail;
        const y2 = p.y - Math.sin(angle) * tail;
        for (let step = 0; step < 4; step += 1) {
          const t = step / 3;
          const px = p.x + (x2 - p.x) * t + Math.sin(p.phase + step) * 1.8;
          const py = p.y + (y2 - p.y) * t + Math.cos(p.phase + step) * 1.3;
          const radius = p.radius * (1 + t * 1.8);
          const glow = ctx.createRadialGradient(px, py, 0, px, py, radius);
          glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * (1 - t * .55)})`);
          glow.addColorStop(.45, `rgba(${r}, ${g}, ${b}, ${alpha * .26 * (1 - t)})`);
          glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.ellipse(px, py, radius * 1.6, radius * .58, angle + Math.sin(p.phase) * .25, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      cursorFrame=requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", (event) => {
      if (!state.lastX && !state.lastY) {
        state.lastX = event.clientX;
        state.lastY = event.clientY;
      }
      spawn(event.clientX, event.clientY);
      state.lastX = event.clientX;
      state.lastY = event.clientY;
    }, { passive: true });
    window.addEventListener("pointerdown", (event) => {
      if (event.button != null && event.button !== 0) return;
      spawn(event.clientX, event.clientY, true);
    }, { passive: true });
    window.addEventListener("pointerleave", () => {
      state.lastX = 0;
      state.lastY = 0;
    });
    resize();

  }

  function initPixelSnow() {
    if (reducedMotion) return;
    const layer = document.createElement("div");
    layer.className = "pixel-snow-field";
    layer.setAttribute("aria-hidden", "true");
    const canvas = document.createElement("canvas");
    canvas.id = "pixelSnowCanvas";
    layer.appendChild(canvas);
    document.body.prepend(layer);

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const state = { width: 1, height: 1, dpr: 1, flakes: [], time: 0, lastFrame: 0 };

    function resize() {
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.08);
      state.width = Math.max(1, window.innerWidth);
      state.height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      const count = Math.min(30, Math.floor((state.width * state.height) / 36000));
      state.flakes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        z: Math.random(),
        size: 1 + Math.random() * 2.4,
        speed: .2 + Math.random() * .72,
        drift: (Math.random() - .5) * .42,
        phase: Math.random() * Math.PI * 2,
        square: i % 3 === 0
      }));
    }

    function draw(now = 0) {
      requestAnimationFrame(draw);
      if (document.body.classList.contains("standalone-archive-open")) return;
      if (layer.classList.contains("is-motion-paused")) return;
      if (document.hidden || document.body.classList.contains("memory-open") || document.body.classList.contains("v31-flow-open")) {
        return;
      }
      if (now - state.lastFrame < 42) return;
      state.lastFrame = now;
      state.time += .008;
      ctx.clearRect(0, 0, state.width, state.height);
      const breath = .66 + Math.sin(state.time * 1.25) * .3;
      state.flakes.forEach((flake) => {
        flake.x += flake.drift + Math.sin(state.time * 2 + flake.phase) * .09;
        flake.y += flake.speed * (1.1 + flake.z);
        if (flake.y > state.height + 12) flake.y = -12;
        if (flake.x < -12) flake.x = state.width + 12;
        if (flake.x > state.width + 12) flake.x = -12;
        const alpha = (.15 + flake.z * .4) * breath;
        const size = flake.size * (1 + flake.z * 1.6);
        ctx.fillStyle = `rgba(185, 215, 218, ${alpha.toFixed(3)})`;
        if (flake.square) {
          ctx.fillRect(Math.round(flake.x), Math.round(flake.y), Math.max(1, Math.round(size)), Math.max(1, Math.round(size)));
        } else {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, size * .55, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    requestAnimationFrame(draw);
  }

  function initBreathingParticles() {
    if (reducedMotion) return;
    const canvas = document.createElement("canvas");
    canvas.id = "breathingParticlesCanvas";
    canvas.className = "breathing-particles-canvas";
    canvas.setAttribute("aria-hidden", "true");
    const stage = document.getElementById("stage");
    if (!stage) return;
    stage.appendChild(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const state = { width: 1, height: 1, dpr: 1, particles: [], mx: .5, my: .5, time: 0, lastFrame: 0 };

    function resize() {
      const rect = stage.getBoundingClientRect();
      state.width = Math.max(1, rect.width);
      state.height = Math.max(1, rect.height);
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.08);
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      const count = window.innerWidth < 900 ? 22 : 42;
      state.particles = Array.from({ length: count }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), .62) * Math.min(state.width, state.height) * .62;
        return {
          angle,
          radius,
          speed: (Math.random() - .5) * .0018,
          size: .8 + Math.random() * 2.8,
          depth: Math.random(),
          drift: i % 2 ? 1 : -1
        };
      });
    }

    let stageVisible=false;new IntersectionObserver(([e])=>{stageVisible=e.isIntersecting;},{rootMargin:"80px"}).observe(stage);
    function draw(now = 0) {
      if(!stageVisible||document.body.classList.contains("v31-index-open")){requestAnimationFrame(draw);return;}
      if (now - state.lastFrame < 30) {
        requestAnimationFrame(draw);
        return;
      }
      state.lastFrame = now;
      if (document.hidden || document.body.classList.contains("memory-open") || document.body.classList.contains("v31-flow-open")) {
        requestAnimationFrame(draw);
        return;
      }
      state.time += .012;
      ctx.clearRect(0, 0, state.width, state.height);
      const cx = state.width * (.55 + (state.mx - .5) * .05);
      const cy = state.height * (.49 + (state.my - .5) * .04);
      const breath = .78 + Math.sin(state.time * .9) * .22;
      ctx.globalCompositeOperation = "lighter";
      state.particles.forEach((p) => {
        p.angle += p.speed;
        const wave = Math.sin(state.time * (1 + p.depth) + p.radius * .01) * 18 * p.depth;
        const x = cx + Math.cos(p.angle) * (p.radius * breath + wave);
        const y = cy + Math.sin(p.angle * 1.16) * (p.radius * .56 * breath + wave * .42);
        const alpha = (.08 + p.depth * .24) * breath;
        ctx.fillStyle = `rgba(167, 201, 203, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size * (.55 + p.depth), 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", (event) => {
      state.mx = event.clientX / Math.max(1, window.innerWidth);
      state.my = event.clientY / Math.max(1, window.innerHeight);
    }, { passive: true });
    resize();
    draw();
  }

  function initLaserFlowStage() {
    if (reducedMotion) return;
    const stage = document.getElementById("stage");
    if (!stage) return;
    const canvas = document.createElement("canvas");
    canvas.id = "laserFlowCanvas";
    canvas.className = "laser-flow-canvas";
    canvas.setAttribute("aria-hidden", "true");
    stage.appendChild(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const state = { width: 1, height: 1, dpr: 1, mx: .62, my: .48, time: 0, lastFrame: 0 };

    function resize() {
      const rect = stage.getBoundingClientRect();
      state.width = Math.max(1, rect.width);
      state.height = Math.max(1, rect.height);
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.08);
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    }

    function drawBeam(y, strength, hueShift) {
      const wobble = Math.sin(state.time * .9 + hueShift) * 18;
      const gradient = ctx.createLinearGradient(0, y, state.width, y + wobble);
      gradient.addColorStop(0, "rgba(167, 201, 203, 0)");
      gradient.addColorStop(.34, `rgba(167, 201, 203, ${strength * .08})`);
      gradient.addColorStop(.58, `rgba(222, 240, 237, ${strength * .34})`);
      gradient.addColorStop(.76, `rgba(142, 168, 183, ${strength * .1})`);
      gradient.addColorStop(1, "rgba(167, 201, 203, 0)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1 + strength * 2.2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= state.width; x += 80) {
        const wave = Math.sin(x * .007 + state.time * 1.4 + hueShift) * (10 + strength * 12);
        ctx.lineTo(x, y + wave + wobble);
      }
      ctx.stroke();
    }

    let stageVisible=false;new IntersectionObserver(([e])=>{stageVisible=e.isIntersecting;},{rootMargin:"80px"}).observe(stage);
    function draw(now = 0) {
      if(!stageVisible||document.body.classList.contains("v31-index-open")){requestAnimationFrame(draw);return;}
      if (now - state.lastFrame < 32) {
        requestAnimationFrame(draw);
        return;
      }
      state.lastFrame = now;
      if (document.hidden || document.body.classList.contains("memory-open") || document.body.classList.contains("v31-flow-open")) {
        requestAnimationFrame(draw);
        return;
      }
      state.time += .014;
      ctx.clearRect(0, 0, state.width, state.height);
      const breath = .72 + Math.sin(state.time * .86) * .28;
      const centerY = state.height * (.46 + (state.my - .5) * .12);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 5; i += 1) {
        drawBeam(centerY + (i - 2) * (20 + Math.sin(state.time + i) * 4), breath * (1 - Math.abs(i - 2) * .14), i * .8);
      }
      const reveal = ctx.createRadialGradient(state.width * state.mx, state.height * state.my, 0, state.width * state.mx, state.height * state.my, state.width * .34);
      reveal.addColorStop(0, `rgba(205, 233, 232, ${.14 * breath})`);
      reveal.addColorStop(.36, `rgba(167, 201, 203, ${.055 * breath})`);
      reveal.addColorStop(1, "rgba(167, 201, 203, 0)");
      ctx.fillStyle = reveal;
      ctx.fillRect(0, 0, state.width, state.height);
      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      state.mx = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      state.my = clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
    }, { passive: true });
    resize();
    draw();
  }

  function initVoidObjectShell() {
    const shell = document.getElementById("voidObjectShell");
    const stage = document.getElementById("stage");
    if (!shell || !stage) return;

    const move = (event) => {
      const rect = shell.getBoundingClientRect();
      const nx = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1) - .5;
      const ny = clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1) - .5;
      shell.style.setProperty("--void-x", `${nx * 18}px`);
      shell.style.setProperty("--void-y", `${ny * 14}px`);
      shell.style.setProperty("--void-tilt-x", `${ny * -10}deg`);
      shell.style.setProperty("--void-tilt-y", `${nx * 13}deg`);
      shell.style.setProperty("--void-energy", "1");
    };
    const settle = () => {
      shell.style.setProperty("--void-x", "0px");
      shell.style.setProperty("--void-y", "0px");
      shell.style.setProperty("--void-tilt-x", "0deg");
      shell.style.setProperty("--void-tilt-y", "0deg");
      shell.style.setProperty("--void-energy", "0");
    };

    shell.addEventListener("pointerenter", () => {
      stage.classList.add("object-hover", "authority-active");
      if (window.triggerPixelSwap) window.triggerPixelSwap();
    });
    shell.addEventListener("pointermove", move, { passive: true });
    shell.addEventListener("pointerleave", () => {
      stage.classList.remove("object-hover", "authority-active");
      settle();
    });
    shell.addEventListener("pointerdown", () => {
      shell.animate([
        { filter: "brightness(1)", transform: "scale(1)" },
        { filter: "brightness(1.35)", transform: "scale(1.06)" },
        { filter: "brightness(1)", transform: "scale(1)" }
      ], { duration: 560, easing: "cubic-bezier(.16, 1, .3, 1)" });
      if (window.triggerPixelSwap) window.triggerPixelSwap();
    });
  }

  function initWxySignature() {
    const signature = document.getElementById("wxySignature");
    if (!signature) return;
    const text = signature.querySelector("span");
    if (!text) return;
    const setMode = (mode) => {
      signature.classList.toggle("is-hovered", mode === "simple");
      
      text.textContent = mode === "traditional" || mode === "simple" ? "吴翔宇" : "wxy";
    };
    signature.addEventListener("pointermove", (event) => {
      const rect = signature.getBoundingClientRect();
      signature.style.setProperty("--name-x", `${event.clientX - rect.left}px`);
      signature.style.setProperty("--name-y", `${event.clientY - rect.top}px`);
    }, { passive: true });
    signature.addEventListener("mouseenter", () => setMode("simple"));
    signature.addEventListener("click", () => setMode("simple"));
    signature.addEventListener("mouseleave", () => setMode("latin"));
  }

  function initCountdownPrelude() {
    const prelude = document.getElementById("countdownPrelude");
    const number = document.getElementById("countdownNumber");
    if (!prelude || !number) return;

    // A completed first visit owns the opening once per tab; child routes restore their origin.
    let returningThroughHistory=false;
    try{const navigation=performance.getEntriesByType('navigation')[0];returningThroughHistory=navigation?.type==='back_forward'&&sessionStorage.getItem('brain-universe-entered')==='1';}catch{}
    const freshReload=document.body.dataset.portfolioFreshReload==='true';
    if(!freshReload&&(new URLSearchParams(location.search).get('return')==='1'||returningThroughHistory)){
      prelude.remove();document.body.dataset.openingStarted='true';document.body.dataset.openingComplete='true';document.body.dataset.returnedFromChild='true';document.body.classList.add('is-home-architecture-live');
      const gate=document.getElementById('entryGate');if(gate){gate.style.display='none';gate.setAttribute('aria-hidden','true');}
      document.body.classList.add('experience-entered');
      // Return is an explicit route, independent of session storage or elapsed time.
      // Initialise the interface first: its Lenis instance starts stopped until entry completes.
      try{sessionStorage.setItem('brain-universe-entered','1');}catch{}
      setTimeout(()=>{
        window.dispatchEvent(new CustomEvent('v31:opening-complete'));
        window.__v31ResumeExperience?.();
        let resume=0;try{resume=Number(sessionStorage.getItem('brain-universe-return-scroll')||0);}catch{}
        window.__v31Lenis?.resize?.();window.__v31Lenis?.scrollTo?.(resume,{immediate:true,force:true});window.scrollTo(0,resume);
        window.addEventListener('load',()=>{window.__v31Lenis?.resize?.();window.__v31Lenis?.scrollTo?.(resume,{immediate:true,force:true});},{once:true});
        const url=new URL(location.href);url.searchParams.delete('return');history.replaceState(history.state,'',url.pathname+url.search);
      },120);
      return;
    }

    prelude.classList.add("is-video-mode");
    const video = document.createElement("video");
    video.className = "prelude-opening-video";
    const openingSource = "./assets/loading-study/loading-study-v32-84.mp4?v=32.83";
    video.dataset.openingSource = openingSource;
    video.poster = "./assets/loading-study/opening-poster-v32-84.png";
    video.autoplay = false;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("aria-label", "造境手记开场动画");
    number.replaceChildren(video);
    const progress = document.createElement('div');
    progress.className = 'opening-progress';
    progress.innerHTML = '<div class="opening-progress-meta"><span data-opening-phase>WARMING UP THE ARCHIVE</span><output data-opening-counter>000%</output></div><div class="opening-progress-track" role="progressbar" aria-label="作品集载入进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><div class="opening-progress-footer"><span>ZAOJING NOTES / A LIVING DIGITAL ARCHIVE</span><span data-opening-time>PLEASE STAY A LITTLE LONGER</span></div>';
    prelude.append(progress);
    const phaseLabel=progress.querySelector('[data-opening-phase]');
    const counter=progress.querySelector('[data-opening-counter]');
    const clock=progress.querySelector('[data-opening-time]');
    const track=progress.querySelector('[role="progressbar"]');
    const bar=track.querySelector('i');
    let lastProgressPercent=-1;
    function updateOpeningProgress(){
      const t=Math.min(20,video.currentTime||0),ratio=t/20;
      const percent=Math.round(ratio*100);
      if(percent!==lastProgressPercent){lastProgressPercent=percent;
      phaseLabel.textContent=t<5?'WARMING UP THE ARCHIVE':t<8.2?'GATHERING LITTLE WORLDS':t<11.4?'BRINGING STORIES TO LIFE':t<15.5?'FINDING THE LIGHT':t<18.7?'ALMOST THERE':'WELCOME TO ZAOJING NOTES';
      counter.textContent=String(Math.round(ratio*100)).padStart(3,'0')+'%';
      clock.textContent=t<15.5?'PLEASE STAY A LITTLE LONGER':t<18.7?'JUST A LITTLE MORE':'YOUR WORLD IS READY';
      bar.style.transform='scaleX('+ratio+')';track.setAttribute('aria-valuenow',String(Math.round(ratio*100)));
      }
      if(!video.ended&&progress.isConnected&&video.requestVideoFrameCallback)video.requestVideoFrameCallback(updateOpeningProgress);
    }
    video.addEventListener('playing',updateOpeningProgress,{once:true});
    if(!video.requestVideoFrameCallback)video.addEventListener('timeupdate',updateOpeningProgress);

    let finished = false;
    let fallbackTimer = 0;
    let started = false;
    let openingBlobUrl = "";

    function releaseEntryGate() {
      if (document.body.classList.contains("experience-entered")) return;
      const entryGate = document.getElementById("entryGate");
      document.getElementById("entryButton")?.click();
      window.setTimeout(() => {
        if (document.body.classList.contains("experience-entered")) return;
        document.body.classList.add("experience-entered");
        if (entryGate) {
          entryGate.setAttribute("aria-hidden", "true");
          entryGate.style.pointerEvents = "none";
          entryGate.style.display = "none";
        }
        document.querySelectorAll(".topbar, .hero, .work-nav, .ambient-status").forEach((element) => {
          element.style.opacity = "1";
          element.style.visibility = "visible";
        });
      }, 1800);
    }

    async function finishPrelude() {
      if (finished) return;
      finished = true;
      document.body.dataset.openingFilmEnded='true';
      if(document.body.dataset.openingStarted!=='true'){document.body.dataset.openingStarted='true';window.dispatchEvent(new CustomEvent('v31:opening-started'));}
      try {
        const message=prelude.querySelector('.opening-progress-footer');
        if(message)message.textContent='正在准备建筑与工作台';
        await window.portfolioBoot?.wait();
      } catch(error) {
        const retry=document.createElement('button');retry.type='button';retry.textContent='准备未完成 · 点击重试';retry.style.cssText='position:absolute;bottom:9%;left:50%;transform:translateX(-50%);padding:14px 24px;color:#eee8db;background:#18201b;border:1px solid #8b744b;cursor:pointer';retry.onclick=()=>location.reload();prelude.append(retry);console.error(error);return;
      }
      window.clearTimeout(fallbackTimer);
      document.body.dataset.openingComplete = "true";
      try{sessionStorage.setItem('brain-universe-entered','1');}catch{}
      document.body.classList.add("is-home-architecture-live");
      prelude.classList.add("is-hidden");
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("v31:opening-complete"));
        releaseEntryGate();
      }, 120);
      window.setTimeout(() => {
        prelude.remove();
        if (openingBlobUrl) URL.revokeObjectURL(openingBlobUrl);
      }, 1500);
    }

    function playOpening() {
      if (started || finished || video.readyState < 3) return;
      started = true;
      window.clearTimeout(fallbackTimer);
      video.play().catch(() => {
        video.muted = true;
        started = false;
        fallbackTimer = window.setTimeout(playOpening, 300);
      });
    }

    video.addEventListener("ended", finishPrelude, { once: true });
    video.addEventListener("error", finishPrelude, { once: true });
    video.addEventListener("playing", () => {
      document.body.dataset.openingStarted = "true";
      window.dispatchEvent(new CustomEvent("v31:opening-started"));
    }, { once: true });
    video.addEventListener("canplaythrough", playOpening, { once: true });
    video.addEventListener("canplay", playOpening, { once: true });
    // A complete small local film buffer cannot stall when the native model starts prefetching.
    fetch(openingSource).then(response => {
      if (!response.ok) throw new Error("Opening film unavailable");
      return response.blob();
    }).then(blob => {
      if (finished) return;
      openingBlobUrl = URL.createObjectURL(blob);
      video.src = openingBlobUrl;
      video.load();
    }).catch(() => {
      if (finished) return;
      video.src = openingSource;
      video.load();
    });
    fallbackTimer = window.setTimeout(() => { if (!started) finishPrelude(); }, 30000);
  }

  function initCountdownPreludeLegacy() {
    const prelude = document.getElementById("countdownPrelude");
    const number = document.getElementById("countdownNumber");
    if (!prelude || !number) return;

    const video = document.createElement("video");
    video.className = "prelude-video";
    video.src = "./assets/loading-study/loading-study-v32-68.mp4?v=32.68";
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = false;
    video.setAttribute("aria-label", "开场动画");

    const fallbackLabel = document.createElement("span");
    fallbackLabel.className = "prelude-label";
    fallbackLabel.textContent = "OPENING FIELD / ZAOJING NOTES";

    number.innerHTML = "";
    number.appendChild(video);
    number.appendChild(fallbackLabel);

    function releaseEntryGate() {
      if (document.body.classList.contains("experience-entered")) return;
      const entryGate = document.getElementById("entryGate");
      const entryButton = document.getElementById("entryButton");
      entryButton?.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
      }));
      window.setTimeout(() => {
        if (document.body.classList.contains("experience-entered")) return;
        document.body.classList.add("experience-entered");
        if (entryGate) {
          entryGate.setAttribute("aria-hidden", "true");
          entryGate.style.pointerEvents = "none";
          entryGate.style.display = "none";
        }
      }, 1200);
    }

    function finishPrelude() {
      prelude.classList.add("is-hidden");
      releaseEntryGate();
      window.setTimeout(() => prelude.remove(), 760);
    }

    const skipTimer = window.setTimeout(() => {
      if (!video.ended) finishPrelude();
    }, 5200);

    video.addEventListener("ended", () => {
      window.clearTimeout(skipTimer);
      finishPrelude();
    });

    video.addEventListener("error", () => {
      window.clearTimeout(skipTimer);
      fallbackLabel.textContent = "OPENING FIELD / SIGNAL LOST";
      window.setTimeout(finishPrelude, 420);
    });

    video.play().catch(() => {
      fallbackLabel.textContent = "OPENING FIELD / AUTO PLAY READY";
      window.setTimeout(finishPrelude, 420);
    });

    prelude.addEventListener("click", () => {
      window.clearTimeout(skipTimer);
      finishPrelude();
    });
  }

  function initParticleTitles() {
    const applyTitle = (title) => {
      if (title.querySelector(".hero-char")) return;
      if (title.closest(".rural-project") || title.hasAttribute("data-static-title")) {
        title.classList.remove("particle-title", "is-forming", "is-traditional");
        return;
      }
      if (title.id === "workTitle" || title.closest(".work-panel")) {
        title.classList.remove("particle-title", "is-forming", "is-traditional");
        delete title.dataset.v27ParticleReady;
        return;
      }
      if (title.dataset.v27ParticleReady === "true") return;
      if (!title.textContent.trim()) return;
      title.dataset.v27ParticleReady = "true";
      const originalText = title.textContent;
      title.dataset.simpleText = originalText;
      title.dataset.traditionalText = [...originalText].map((char) => char).join("");
      title.classList.add("particle-title");
      title.innerHTML = "";
      [...originalText].forEach((char, index) => {
        const span = document.createElement("span");
        span.className = "glyph-unit";
        span.textContent = char === " " ? "\u00a0" : char;
        span.dataset.simple = char;
        span.dataset.traditional = char;
        span.style.setProperty("--sx", `${(Math.random() - .5) * 130}px`);
        span.style.setProperty("--sy", `${(Math.random() - .5) * 90}px`);
        span.style.setProperty("--sr", `${(Math.random() - .5) * 24}deg`);
        span.style.setProperty("--pd", `${Math.min(index * 18, 420)}ms`);
        title.appendChild(span);
      });
      const replay = () => {
        title.classList.remove("is-forming");
        void title.offsetWidth;
        title.classList.add("is-forming");
      };
      title.addEventListener("mouseenter", () => {
        
        title.querySelectorAll(".glyph-unit").forEach((span) => {
          span.textContent = span.dataset.traditional === " " ? "\u00a0" : span.dataset.traditional;
        });
        replay();
      });
      title.addEventListener("mouseleave", () => {
        title.classList.remove("is-traditional");
        title.querySelectorAll(".glyph-unit").forEach((span) => {
          span.textContent = span.dataset.simple === " " ? "\u00a0" : span.dataset.simple;
        });
      });
      replay();
    };

    document.querySelectorAll("h1, h2").forEach(applyTitle);

    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        document.querySelectorAll("h1, h2").forEach(applyTitle);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initHeroTraditionalGlyphs() {}

  function initPixelSwapTransition() {
    const overlay = document.createElement("div");
    overlay.className = "pixel-swap";
    overlay.id = "pixelSwapOverlay";
    overlay.style.setProperty("--cols", "18");
    overlay.style.setProperty("--rows", "10");
    for (let y = 0; y < 10; y += 1) {
      for (let x = 0; x < 18; x += 1) {
        const cell = document.createElement("i");
        cell.className = "pixel-cell";
        const center = Math.hypot(x / 17 - .5, y / 9 - .5);
        cell.style.setProperty("--delay", `${Math.round(center * 420 + Math.random() * 120)}ms`);
        overlay.appendChild(cell);
      }
    }
    document.body.appendChild(overlay);
    let busy = false;
    window.triggerPixelSwap = () => {
      if (busy) return;
      busy = true;
      overlay.classList.remove("is-active");
      void overlay.offsetWidth;
      overlay.classList.add("is-active");
      window.setTimeout(() => {
        overlay.classList.remove("is-active");
        busy = false;
      }, 980);
    };

    const sections = [...document.querySelectorAll(".work-flow, .image-chapter, .boundary")];
    let current = "";
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id || visible.target.className;
      if (id === current) return;
      current = id;
      window.triggerPixelSwap();
    }, { threshold: [.58] });
    sections.forEach((section) => observer.observe(section));
  }

  function initLogoLoop() {
    const root = document.getElementById("logoLoopField");
    if (!root) return;
    const tokens = ["AI", "FILM", "MEMORY", "3D", "ARCHIVE", "RITUAL", "IMAGE", "SPACE", "MOTION", "SIGNAL"];
    const html = [...tokens, ...tokens].map((token) => `<span class="logo-token">${token}</span>`).join("");
    root.innerHTML = `<div class="logo-loop-track">${html}</div><div class="logo-loop-track">${html}</div>`;
  }

  function initAccordionGallery() {
    const gallery = document.getElementById("mindAccordion");
    if (!gallery) return;
    const panels = [...gallery.querySelectorAll(".ag-panel")];
    panels.forEach((panel, index) => {
      const item = imageItems[index % imageItems.length];
      const image = panel.querySelector("img");
      const label = panel.querySelector(".ag-panel__text");
      if (image) {
        image.src = item.preview;
        image.dataset.fullSrc = item.src;
        image.alt = item.label;
      }
      if (label) label.textContent = item.label;
      const labelWrap = panel.querySelector(".ag-panel__label");
      if (labelWrap && !labelWrap.querySelector(".ag-panel__note")) {
        const note = document.createElement("span");
        note.className = "ag-panel__note";
        labelWrap.appendChild(note);
      }
      const note = panel.querySelector(".ag-panel__note");
      if (note) note.textContent = item.note;
      panel.setAttribute("aria-label", item.label);
      panel.dataset.note = item.note;
    });
    let active = Math.min(2, panels.length - 1);

    function setActive(index) {
      active = index;
      panels.forEach((panel, i) => {
        panel.classList.toggle("is-active", i === active);
        const offset = i - active;
        panel.style.setProperty("--panel-tilt", `${clamp(offset * -4.5, -8, 8)}deg`);
        panel.style.setProperty("--panel-drift", `${clamp(offset * -18, -42, 42)}px`);
      });
    }

    panels.forEach((panel, index) => {
      panel.addEventListener("mouseenter", () => setActive(index));
      panel.addEventListener("focus", () => setActive(index));
      panel.addEventListener("click", (event) => {
        event.stopPropagation();
        setActive(index);
      });
    });
    setActive(active);
  }

  function initMorphFlow() {
    const root = document.getElementById("morphFlow");
    if (!root) return;
    root.innerHTML = "";
    imageItems.forEach((item, index) => {
      const image = document.createElement("img");
      image.src = item.preview;
      image.dataset.fullSrc = item.src;
      image.alt = item.label;
      image.className = index === 0 ? "is-active" : "";
      root.appendChild(image);
    });
    const caption = document.createElement("div");
    caption.className = "morph-caption";
    caption.innerHTML = `<small>morph / image current</small><strong>${imageItems[0].label}</strong><span>${imageItems[0].note}</span>`;
    root.appendChild(caption);

    const images = [...root.querySelectorAll("img")];
    let index = 0;
    let timer = 0;
    let transitionTimer = 0;
    let isVisible = false;

    function show(next) {
      const previous = index;
      index = (next + images.length) % images.length;
      root.classList.add("is-transitioning");
      caption.querySelector("strong").textContent = imageItems[index].label;
      caption.querySelector("span").textContent = imageItems[index].note;
      images[previous]?.classList.add("is-leaving");
      images[index]?.classList.add("is-entering", "is-active");
      images.forEach((image, i) => {
        if (i !== previous && i !== index) image.className = "";
      });
      root.style.setProperty("--scan-x", `${index % 2 ? 18 : -18}%`);
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => {
        images.forEach((image, i) => {
          image.classList.toggle("is-active", i === index);
          image.classList.remove("is-leaving", "is-entering");
        });
        root.classList.remove("is-transitioning");
      }, 1180);
    }

    function schedule() {
      window.clearTimeout(timer);
      if (!isVisible || reducedMotion) return;
      timer = window.setTimeout(() => {
        show(index + 1);
        schedule();
      }, 3100);
    }

    root.addEventListener("pointermove", (event) => {
      const rect = root.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width) - .5;
      const y = (event.clientY - rect.top) / Math.max(1, rect.height) - .5;
      root.style.setProperty("--flow-x", `${(x * -18).toFixed(2)}px`);
      root.style.setProperty("--flow-y", `${(y * -12).toFixed(2)}px`);
    }, { passive: true });
    root.addEventListener("click", (event) => {
      event.stopPropagation();
      show(index + 1);
      schedule();
    });
    if (!reducedMotion) {
      new IntersectionObserver(([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible) schedule();
        else window.clearTimeout(timer);
      }, { rootMargin: "180px" }).observe(root);
    }
  }

  function initCircularGallery() {
    const root = document.getElementById("circularFlow");
    if (!root) return;
    root.innerHTML = "";
    const track = document.createElement("div");
    track.className = "circular-track";
    root.appendChild(track);
    const items = [...imageItems, ...imageItems];
    items.forEach((item, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "circular-card";
      card.innerHTML = `<img src="${item.preview}" data-full-src="${item.src}" alt="${item.label}"><span>${item.label}</span><small>${item.note}</small>`;
      card.setAttribute("aria-label", `${item.label}，${item.note}`);
      card.addEventListener("click", (event) => {
        event.stopPropagation();
        target = -index * 188;
      });
      track.appendChild(card);
    });

    let target = 0;
    let current = 0;
    let dragging = false;
    let startX = 0;
    let startTarget = 0;
    let isVisible = false;
    let lastFrame = 0;
    const cards = [...track.children];

    new IntersectionObserver(([entry]) => {
      isVisible = Boolean(entry?.isIntersecting);
    }, { rootMargin: "220px" }).observe(root);

    function layout(now = 0) {
      requestAnimationFrame(layout);
      if (!isVisible || document.hidden || now - lastFrame < 34) return;
      lastFrame = now;
      current += (target - current) * .06;
      track.style.setProperty("--circle-x", `calc(-50% + ${current.toFixed(2)}px)`);
      const rootRect = root.getBoundingClientRect();
      const center = rootRect.left + rootRect.width / 2;
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const normalized = clamp((cardCenter - center) / (rootRect.width * .42), -1.4, 1.4);
        const abs = Math.abs(normalized);
        card.style.setProperty("--arc-y", `${(abs * abs * 78).toFixed(2)}px`);
        card.style.setProperty("--arc-r", `${(-normalized * 8).toFixed(2)}deg`);
        card.style.setProperty("--arc-ry", `${(normalized * -18).toFixed(2)}deg`);
        card.style.setProperty("--arc-scale", `${(1 - abs * .12).toFixed(3)}`);
        card.style.setProperty("--arc-opacity", `${(1 - abs * .42).toFixed(3)}`);
        card.classList.toggle("is-center", abs < .22);
      });
    }

    root.addEventListener("wheel", (event) => {
      target -= event.deltaY * .72;
    }, { passive: true });
    root.addEventListener("pointerdown", (event) => {
      dragging = true;
      startX = event.clientX;
      startTarget = target;
      root.setPointerCapture?.(event.pointerId);
    });
    root.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      target = startTarget + (event.clientX - startX) * 1.2;
    });
    root.addEventListener("pointerup", () => {
      dragging = false;
    });
    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") target -= 240;
      if (event.key === "ArrowLeft") target += 240;
    });
    requestAnimationFrame(layout);
  }

  function initFolderMotion() {
    const selectors = [
      ".index-work",
      ".memory-sample",
      ".chapter-ledger button",
      ".boundary-signals button",
      ".enter-work",
      ".work-panel"
    ];
    const selector=selectors.join(',');
    const apply = (root=document.body) => {
      if(root.matches?.(selector))root.classList.add('folder-motion');
      root.querySelectorAll(selector).forEach((element) => {
        element.classList.add("folder-motion");
      });
    };
    apply();
    const observer = new MutationObserver(mutations=>{for(const mutation of mutations)for(const node of mutation.addedNodes)if(node.nodeType===1)apply(node);});
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", (event) => {
      const folder = event.target.closest(".folder-motion");
      if (!folder) return;
      folder.classList.add("is-open");
      if (window.triggerPixelSwap) window.triggerPixelSwap();
      window.setTimeout(() => folder.classList.remove("is-open"), 560);
    });
  }

  function initLineSidebarMotion() {
    const selectors = [
      ".work-nav button",
      ".work-panel",
      ".index-work",
      ".memory-sample",
      ".chapter-ledger button",
      ".boundary-signals button",
      ".enter-work"
    ];
    const falloff = (p) => p * p * (3 - 2 * p);
    const bind = (root) => {
      if (root.dataset.v30LineReady === "true") return;
      root.dataset.v30LineReady = "true";
      root.classList.add("line-sidebar-ready");
      let cachedItems=null,moveFrame=0,lastPointer=null;
      const items = () => cachedItems||(cachedItems=[...root.querySelectorAll(selectors.join(","))]);
      root._refreshLineItems=()=>{cachedItems=null;};
      const update = (event) => {
        // Read all geometry before writing styles, so pointer movement forces one layout.
        const geometry=items().map(item=>({item,rect:item.getBoundingClientRect()}));
        geometry.forEach(({item,rect}) => {
          item.classList.add("line-proximity");
          const center = rect.top + rect.height / 2;
          const distance = Math.abs(event.clientY - center);
          const effect = falloff(clamp(1 - distance / 120, 0, 1));
          item.style.setProperty("--line-effect", effect.toFixed(4));
          item.style.setProperty("--line-proximity", effect.toFixed(4));
        });
      };
      const leave = () => {
        items().forEach((item) => {
          item.style.setProperty("--line-effect", "0");
          item.style.setProperty("--line-proximity", "0");
        });
      };
      root.addEventListener("pointermove", event=>{lastPointer=event;if(!moveFrame)moveFrame=requestAnimationFrame(()=>{moveFrame=0;update(lastPointer);});}, { passive: true });
      root.addEventListener("pointerleave", leave, { passive: true });
      items().forEach((item) => item.classList.add("line-proximity"));
    };

    const roots = [
        document.getElementById("workNav"),
        document.getElementById("workPanel"),
        document.getElementById("indexList"),
        document.getElementById("memorySampleStrip"),
        document.getElementById("chapterLedger"),
        document.querySelector(".boundary-signals")
      ].filter(Boolean);
    const selector=selectors.join(',');
    const apply = (root=document.body) => {
      roots.forEach(bind);
      roots.forEach(container=>{if(container.contains(root))container._refreshLineItems?.();});
      if(root.matches?.(selector))root.classList.add('line-proximity');
      root.querySelectorAll(selector).forEach((item) => item.classList.add("line-proximity"));
    };
    apply();
    new MutationObserver(mutations=>{for(const mutation of mutations)for(const node of mutation.addedNodes)if(node.nodeType===1)apply(node);}).observe(document.body, { childList: true, subtree: true });
  }

  function initImageCardPopout() {
    const overlay = document.createElement("div");
    overlay.className = "image-popout";
    overlay.id = "imagePopout";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <button class="image-popout-close" type="button" aria-label="关闭图片预览">×</button>
      <figure class="image-popout-card">
        <img alt="">
        <figcaption class="image-popout-caption"></figcaption>
      </figure>
    `;
    document.body.appendChild(overlay);
    const image = overlay.querySelector("img");
    const caption = overlay.querySelector(".image-popout-caption");
    const close = overlay.querySelector(".image-popout-close");
    const card = overlay.querySelector(".image-popout-card");

    function openFrom(source, clickedImage) {
      if (!source || !image || !caption) return;
      const sourceImage = clickedImage || (source.matches("img") ? source : source.querySelector("img"));
      if (!sourceImage?.src) return;
      const label =
        (source.closest(".rural-project-memory") ? sourceImage.alt : "") ||
        source.getAttribute("aria-label") ||
        source.querySelector("figcaption, .ag-panel__text, .circular-card span")?.textContent?.trim() ||
        sourceImage.alt ||
        "Image memory";
      const note = source.dataset.note || source.querySelector(".ag-panel__note, .circular-card small")?.textContent?.trim() || "";
      image.src = sourceImage.dataset.fullSrc || sourceImage.src;
      image.alt = sourceImage.alt || label;
      caption.textContent = note && !label.includes(note) ? `${label} / ${note}` : label;
      const rect = sourceImage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const targetWidth = Math.min(1120, window.innerWidth * .9);
      const startScale = clamp(rect.width / Math.max(1, targetWidth), .16, .72);
      overlay.style.setProperty("--pop-start-x", `${(centerX - window.innerWidth / 2).toFixed(2)}px`);
      overlay.style.setProperty("--pop-start-y", `${(centerY - window.innerHeight / 2).toFixed(2)}px`);
      overlay.style.setProperty("--pop-start-scale", startScale.toFixed(4));
      overlay.style.setProperty("--pop-start-rotate", `${source.closest(".image-chapter, .memory-visual") ? -2 : 3}deg`);
      card?.getAnimations().forEach((animation) => animation.cancel());
      overlay.classList.remove("is-open");
      void overlay.offsetWidth;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("image-popout-open");
      window.dispatchEvent(new CustomEvent("v85:image-viewer-open", { detail: overlay }));
    }

    function closePopout() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("image-popout-open");
      window.dispatchEvent(new Event("v85:image-viewer-close"));
    }

    document.addEventListener("click", (event) => {
      const target = event.target;
      const source = target.closest?.(".image-chapter figure, .memory-image, .memory-fragments figure");
      if (!source || source.closest(".image-popout")) return;
      const clickedImage = target.closest?.("img") || target.closest?.(".rural-memory-inset")?.querySelector("img");
      openFrom(source, clickedImage);
    });
    close?.addEventListener("click", closePopout);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closePopout();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePopout();
    });
  }

  function initJourneyImageHydration() {
    let cursor = 0;

    function hydrateImage(image, item) {
      if (!image || !item) return;
      image.src = item.preview;
      image.dataset.fullSrc = item.src;
      image.alt = item.label;
      image.dataset.journeyImage = "true";
    }

    function scrubLegacyImages(root = document) {
      const images = root.matches?.("img") ? [root] : [...root.querySelectorAll?.("img") || []];
      images.forEach((image) => {
        const src = image.getAttribute("src") || "";
        if (!src.includes("assets/works/") && !src.includes("space-hero.png")) return;
        hydrateImage(image, imageItems[cursor % imageItems.length]);
        cursor += 1;
      });
    }

    scrubLegacyImages();

    const chapterRail = document.getElementById("imageChapters");
    if (chapterRail) {
      chapterRail.replaceChildren();
      chapterRail.hidden=true;
      chapterRail.dataset.movedTo="learning.html#prompt-notes";
    }

    const memoryImage = document.querySelector("#memoryOverlay .memory-image img");
    hydrateImage(memoryImage, imageItems[0]);
    const fragments = document.getElementById("memoryFragments");
    if (fragments) {
      fragments.innerHTML = imageItems.slice(0, 3).map((item, index) => `
        <figure data-note="${item.note}">
          <img src="${item.preview}" data-full-src="${item.src}" alt="${item.label}">
          <figcaption>${String(index + 1).padStart(2, "0")} / ${item.label}</figcaption>
        </figure>
      `).join("");
    }

    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          scrubLegacyImages(mutation.target);
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) scrubLegacyImages(node);
        });
      });
    }).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"]
    });
  }

  function initMemoryImageCurrent() {
    const visual = document.querySelector("#memoryOverlay .memory-visual");
    const fragments = document.getElementById("memoryFragments");
    if (!visual || !fragments) return;

    const current = document.createElement("div");
    current.className = "memory-image-current";
    current.setAttribute("aria-hidden", "true");
    current.innerHTML = `<div class="memory-image-current-track"></div>`;
    visual.appendChild(current);
    const track = current.querySelector(".memory-image-current-track");

    function render() {
      const figures = [...fragments.querySelectorAll("figure")];
      let items = figures
        .map((figure, index) => {
          const image = figure.querySelector("img");
          if (!image?.src) return null;
          const caption = figure.querySelector("figcaption")?.textContent?.trim() || `Fragment ${index + 1}`;
          return { src: image.src, alt: image.alt || caption, caption };
        })
        .filter(Boolean);
      const usingFallback = items.length && items.every((item) => item.src.includes("space-hero.png"));
      if (!items.length || usingFallback) {
        const work = Number(document.getElementById("memoryOverlay")?.dataset.work || 1);
        const offset = Math.max(0, work - 1);
        items = imageItems.slice(offset, offset + 3);
        if (items.length < 3) items = [...items, ...imageItems.slice(0, 3 - items.length)];
        items = items.map((item) => ({ ...item, caption: `${item.label} / ${item.note}` }));
      }
      if (!items.length) return;
      const loop = [...items, ...items, ...items];
      track.innerHTML = loop.map((item, index) => `
        <figure style="--current-delay:${(index * -0.55).toFixed(2)}s">
          <img src="${item.preview || item.src}" data-full-src="${item.src}" alt="">
          <figcaption>${item.caption}</figcaption>
        </figure>
      `).join("");
    }

    const observer = new MutationObserver(() => {
      window.clearTimeout(current._renderTimer);
      current._renderTimer = window.setTimeout(render, 40);
    });
    observer.observe(fragments, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src", "alt"]
    });
    const memoryOverlay = document.getElementById("memoryOverlay");
    if (memoryOverlay) {
      observer.observe(memoryOverlay, {
        attributes: true,
        attributeFilter: ["data-work"]
      });
    }
    render();
  }

  function initV31InteractionCleanup() {
    const passthroughSelector = [
      "button",
      "a",
      ".ag-panel",
      ".circular-card",
      ".morph-flow",
      ".image-chapter figure",
      ".memory-image",
      ".memory-fragments figure",
      ".atlas-strip img",
      ".image-popout",
      "#hobbyCabinetStage",
      ".experience-console",
      ".home-rendered-architecture",
      ".odyssey-stage",
      ".works-orbit-archive",
      ".research-card",
      ".life-process-grid"
    ].join(",");

    function blockBackgroundPulse(event) {
      if (!document.body.classList.contains("experience-entered")) return;
      if (document.querySelector(".life-process-grid.is-expanded")) return;
      if (event.target.closest?.(passthroughSelector)) return;
      event.stopImmediatePropagation();
    }

    window.addEventListener("pointerdown", blockBackgroundPulse, true);
    window.addEventListener("click", blockBackgroundPulse, true);
  }

  function initV31IndexNavigationRepair() {
    const trigger = document.getElementById("indexTrigger");
    const overlay = document.getElementById("indexOverlay");
    const close = document.getElementById("indexClose");
    const list = document.getElementById("indexList");
    const nav = document.getElementById("workNav");
    if (!trigger || !overlay || !close || !list || !nav) return;
    trigger.dataset.v31IndexRepair = "true";
    for(const button of list.querySelectorAll('.index-work')) if(['实验','关于'].includes(button.querySelector('.title')?.textContent.trim()))button.remove();
    for(const button of nav.querySelectorAll('button'))if(['实验','关于'].includes(button.querySelector('span:last-child')?.textContent.trim()))button.remove();

    overlay.inert = true;
    overlay.setAttribute("aria-hidden", "true");
    let indexOpener = trigger;
    function openIndex(event) {
      event?.preventDefault();
      event?.stopImmediatePropagation();
      if(overlay.classList.contains("v31-index-open"))return;
      indexOpener = document.activeElement;
      overlay.inert = false;
      overlay.classList.add("is-open", "v31-index-open");
      overlay.style.clipPath = "inset(0 0 0 0)";
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("v31-index-open");
      window.setTimeout(() => close.focus(), 20);
    }

    function closeIndex(event, restoreFocus = true) {
      event?.preventDefault();
      event?.stopImmediatePropagation();
      overlay.classList.remove("is-open", "v31-index-open");
      overlay.style.clipPath = "";
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("v31-index-open");
      overlay.inert = true;
      if (restoreFocus) (indexOpener?.isConnected ? indexOpener : trigger).focus({preventScroll:true});
    }

    
    trigger.addEventListener("click", openIndex, true);
    
    close.addEventListener("click", closeIndex, true);
    const selectIndex = (event) => {
      const button = event.target.closest(".index-work");
      if (!button) return;
      const label=button.querySelector('.title')?.textContent.trim();
      if(label==='阅读'||label==='学习') { try{sessionStorage.setItem('brain-universe-return-scroll',String(window.scrollY));}catch{} closeIndex(event, false); window.portfolioNavigate?.(label==='阅读'?'./reading.html':'./learning.html');return; }
      const index = [...list.querySelectorAll(".index-work")].indexOf(button);
      closeIndex(event, false);
      if (["hobbyPage", "personalPage"].includes(button.dataset.indexTarget)) {
        window.dispatchEvent(new CustomEvent("v31:directory-open", {detail:{kind:button.dataset.indexTarget,source:button}}));
        return;
      }
      window.dispatchEvent(new CustomEvent("v31:directory-open",{detail:{kind:"works",source:button}}));
    };
    
    list.addEventListener("click", selectIndex, true);
    overlay.setAttribute('data-lenis-prevent','');
    overlay.addEventListener("wheel", (event) => event.stopPropagation(), { passive: true });
    window.addEventListener("keydown", (event) => {
      if (!overlay.classList.contains("v31-index-open")) return;
      if (event.key === "Escape") {closeIndex(event);return;}
      if (event.key === "Tab") {
        const items = [...overlay.querySelectorAll('button:not([disabled]),a[href],[tabindex="0"]')].filter(n=>n.getClientRects().length && getComputedStyle(n).visibility !== 'hidden');
        const i=items.indexOf(document.activeElement);
        if (!items.length) {event.preventDefault();return;}
        if (event.shiftKey && i<=0) {event.preventDefault();items.at(-1).focus();}
        else if (!event.shiftKey && (i===items.length-1||i<0)) {event.preventDefault();items[0].focus();}
        event.stopImmediatePropagation();
      }
    }, true);
    for (const type of ['v31:archive-close','v31:works-orbit-close']) window.addEventListener(type, () => {
      window.setTimeout(() => {
        // An entry inside the now-inert directory cannot receive focus on return.
        if (document.activeElement === document.body || overlay.contains(document.activeElement)) trigger.focus({preventScroll:true});
      }, 120);
    });
  }

  function initAtlasImageCurrent() {
    const strip = document.querySelector(".image-atlas .atlas-strip");
    if (!strip || strip.dataset.v31AtlasFlow === "true") return;
    strip.dataset.v31AtlasFlow = "true";
    const originals = [...strip.querySelectorAll("img")];
    originals.forEach((image, index) => {
      image.style.setProperty("--atlas-depth", String(index % 3));
      image.style.setProperty("--atlas-delay", `${index * -0.7}s`);
    });
    if (!document.querySelector('[data-compact-research], [data-separate-research]')) originals.forEach((image, index) => {
      const clone = image.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.style.setProperty("--atlas-depth", String(index % 3));
      clone.style.setProperty("--atlas-delay", `${(index + originals.length) * -0.7}s`);
      strip.appendChild(clone);
    });
    strip.addEventListener("click", (event) => {
      const image = event.target.closest("img");
      if (!image) return;
      event.stopPropagation();
      const width = image.getBoundingClientRect().width || 220;
      strip.scrollBy({ left: width * 1.25, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  function initTextKinetics() {
    const selector = [
      ".hero h1",
      ".hero-kicker",
      ".hero-coordinate",
      ".hero-copy span",
      ".work-panel h2",
      ".work-meta",
      ".work-summary",
      ".enter-work",
      ".work-nav button span",
      ".work-flow-heading small",
      ".work-flow-heading h2",
      ".ag-panel__text",
      ".ag-panel__note",
      ".morph-caption small",
      ".morph-caption strong",
      ".morph-caption span",
      ".circular-card span",
      ".circular-card small",
      ".image-chapter small",
      ".image-chapter h2",
      ".image-chapter p",
      ".boundary small",
      ".boundary h2",
      ".boundary p",
      ".memory-title-rail small",
      ".memory-title-rail h2",
      ".memory-english",
      ".memory-section-heading",
      ".memory-lead",
      ".memory-body dt",
      ".memory-body dd",
      ".memory-sample strong",
      ".memory-sample small",
      ".chapter-ledger button strong",
      ".chapter-ledger button small",
      ".ambient-status span"
    ].join(",");

    let nodes = [];
    let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let frame = 0;

    function collect() {
      nodes = [...document.querySelectorAll(selector)]
        .filter((node) => node.textContent.trim() && !node.closest(".image-popout, .image-chapters"));
      nodes.forEach((node) => node.classList.add("text-kinetic"));
    }

    function update() {
      frame = 0;
      const geometry=nodes.filter(node=>node.isConnected).map(node=>({node,rect:node.getBoundingClientRect()}));
      geometry.forEach(({node,rect}) => {
        if (rect.bottom < -40 || rect.top > window.innerHeight + 40) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;
        const distance = Math.hypot(dx, dy);
        const energy = clamp(1 - distance / 360, 0, 1);
        const eased = energy * energy * (3 - 2 * energy);
        node.style.setProperty("--text-energy", eased.toFixed(4));
        node.style.setProperty("--text-x", `${(-dx * eased * 0.012).toFixed(2)}px`);
        node.style.setProperty("--text-y", `${(-dy * eased * 0.01).toFixed(2)}px`);
      });
    }

    function schedule(event) {
      if (document.body.classList.contains("standalone-archive-open") || document.body.classList.contains("is-paper-reading") || document.body.classList.contains('works-orbit-open')) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    function reset() {
      nodes.forEach((node) => {
        node.style.setProperty("--text-energy", "0");
        node.style.setProperty("--text-x", "0px");
        node.style.setProperty("--text-y", "0px");
      });
    }

    collect();
    document.addEventListener("pointermove", schedule, { passive: true });
    document.addEventListener("pointerleave", reset, { passive: true });
    new MutationObserver(mutations => {
      // A text update doesn't change the list of kinetic elements.
      if(!mutations.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&(n.matches(selector)||n.querySelector(selector)))||[...m.removedNodes].some(n=>n.nodeType===1)))return;
      window.clearTimeout(initTextKinetics._timer);
      initTextKinetics._timer = window.setTimeout(collect, 80);
    }).observe(document.body, { childList: true, subtree: true });
  }

  function initV31HorizontalChapters() {
    const chapters = document.getElementById("imageChapters");
    if (!chapters) return;
    document.body.classList.add("v31-horizontal-ready");

    let wheelLock = false;
    function moveHorizontal(event) {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      chapters.scrollBy({
        left: event.deltaY * 1.15,
        behavior: wheelLock || reducedMotion ? "auto" : "smooth"
      });
      wheelLock = true;
      window.clearTimeout(chapters._wheelTimer);
      chapters._wheelTimer = window.setTimeout(() => {
        wheelLock = false;
      }, 180);
    }

    chapters.addEventListener("wheel", moveHorizontal, { passive: false, capture: true });
    window.addEventListener("wheel", (event) => {
      if (event.target.closest?.(".experience-console")) return;
      const rect = chapters.getBoundingClientRect();
      const inHorizontalZone = rect.top < window.innerHeight * .68 && rect.bottom > window.innerHeight * .32;
      if (!inHorizontalZone) return;
      moveHorizontal(event);
    }, { passive: false, capture: true });

    const cards = [...chapters.querySelectorAll(".image-chapter")];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-horizontal-active", entry.isIntersecting && entry.intersectionRatio > .56);
      });
    }, { root: chapters, threshold: [.36, .56, .82] });
    cards.forEach((card) => observer.observe(card));
  }

  function initJourneyImagePreload() {
    [0, 1].map((index) => imageItems[index]).forEach((item) => {
      const image = new Image();
      image.decoding = "async";
      image.loading = "eager";
      image.src = item.preview;
    });
  }

  function initV31PortfolioMemory() {
    const trigger = document.getElementById("enterWork");
    const overlay = document.getElementById("memoryOverlay");
    if (!trigger || !overlay) return;

    const fields = {
      signal: document.getElementById("memorySignal"),
      frame: document.getElementById("memoryFrameCode"),
      ordinal: document.getElementById("memoryOrdinal"),
      kicker: document.getElementById("memoryKicker"),
      title: document.getElementById("memoryTitle"),
      english: document.getElementById("memoryEnglish"),
      description: document.getElementById("memoryDescription"),
      role: document.getElementById("memoryRole"),
      goal: document.getElementById("memoryGoal"),
      tools: document.getElementById("memoryTools"),
      output: document.getElementById("memoryOutput"),
      reflection: document.getElementById("memoryReflection"),
      edge: document.getElementById("memoryEdge"),
      samples: document.getElementById("memorySampleStrip"),
      ledger: document.getElementById("chapterLedger"),
      map: document.getElementById("memoryMap"),
      mainImage: document.querySelector("#memoryOverlay .memory-image img"),
      fragments: document.getElementById("memoryFragments")
    };
    let projectDetail = overlay.querySelector(".v31-project-detail");
    let projectHeading = overlay.querySelector(".v31-project-heading");
    if (!projectHeading) {
      projectHeading = document.createElement("div");
      projectHeading.className = "v31-project-heading";
      projectHeading.innerHTML = `<small data-project-heading="meta"></small><h2 data-project-heading="title"></h2>`;
      overlay.querySelector(".memory-section-heading")?.insertAdjacentElement("afterend", projectHeading);
    }
    if (!projectDetail) {
      projectDetail = document.createElement("section");
      projectDetail.className = "v31-project-detail";
      projectDetail.innerHTML = `
        <div><span>构图关系</span><p data-project-field="composition"></p></div>
        <div><span>色彩方向</span><p data-project-field="color"></p></div>
        <div><span>动态设想</span><p data-project-field="motion"></p></div>
        <div><span>章节作用</span><p data-project-field="role"></p></div>
      `;
      fields.description?.insertAdjacentElement("afterend", projectDetail);
    }

    function setText(node, text) {
      if (node) node.textContent = text;
    }

    function renderFragments(index) {
      if (!fields.fragments) return;
      const group = [0, 1, 2].map((offset) => imageItems[(index + offset) % imageItems.length]);
      fields.fragments.innerHTML = group.map((item, offset) => `
        <figure data-note="${item.note}">
          <img src="${item.preview}" data-full-src="${item.src}" alt="${item.label}">
          <figcaption>${String(offset + 1).padStart(2, "0")} / ${item.label}</figcaption>
        </figure>
      `).join("");
    }

    function select(index) {
      const item = imageItems[index % imageItems.length];
      overlay.dataset.work = "v31-portfolio";
      overlay.dataset.signal = item.group;
      setText(fields.signal, `Journey visual ${String(index + 1).padStart(2, "0")}`);
      setText(fields.frame, `Image archive / ${String(index + 1).padStart(2, "0")}`);
      setText(fields.ordinal, String(index + 1).padStart(2, "0"));
      setText(fields.kicker, `${item.group.toUpperCase()} / Journey visual portfolio`);
      setText(fields.title, item.label);
      setText(fields.english, item.group);
      setText(fields.description, item.note);
      setText(projectHeading.querySelector('[data-project-heading="meta"]'), `${item.group.toUpperCase()} / IMAGE ${String(index + 1).padStart(2, "0")}`);
      setText(projectHeading.querySelector('[data-project-heading="title"]'), item.label);
      projectDetail.querySelectorAll("[data-project-field]").forEach((node) => {
        setText(node, item[node.dataset.projectField]);
      });
      if (fields.mainImage) {
        fields.mainImage.closest(".memory-image")?.classList.remove("is-project-changing");
        void fields.mainImage.offsetWidth;
        fields.mainImage.src = item.preview;
        fields.mainImage.dataset.fullSrc = item.src;
        fields.mainImage.alt = item.label;
        fields.mainImage.closest(".memory-image")?.classList.add("is-project-changing");
      }
      renderFragments(index);
      document.querySelectorAll("[data-v31-memory-index]").forEach((node) => {
        node.classList.toggle("is-active", Number(node.dataset.v31MemoryIndex) === index);
      });
      fields.samples?.scrollTo({ left: index * 158, behavior: reducedMotion ? "auto" : "smooth" });
    }

    function renderLists() {
      if (fields.samples) {
        fields.samples.innerHTML = imageItems.map((item, index) => `
          <button class="memory-sample" type="button" data-v31-memory-index="${index}">
            <img src="${item.preview}" data-full-src="${item.src}" alt="" loading="lazy">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${item.label}</strong>
            <small>${item.role}</small>
          </button>
        `).join("");
      }
      if (fields.ledger) {
        fields.ledger.innerHTML = imageItems.map((item, index) => `
          <button type="button" data-v31-memory-index="${index}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${item.label}</strong>
            <small>${item.group}</small>
            <i>→</i>
          </button>
        `).join("");
      }
      if (fields.map) {
        fields.map.innerHTML = imageItems.map((item, index) => `
          <button type="button" data-v31-memory-index="${index}" style="--node-x:${12 + (index % 7) * 12}%;--node-y:${18 + Math.floor(index / 7) * 38}%">
            <span class="memory-node-label"><strong>${item.label}</strong><small>${item.group}</small></span>
          </button>
        `).join("");
      }
      document.querySelectorAll("[data-v31-memory-index]").forEach((button) => {
        button.addEventListener("click", () => select(Number(button.dataset.v31MemoryIndex)));
      });
    }

    function openPortfolioArchive(event) {
      const title = document.getElementById("workTitle")?.textContent?.trim() || "";
      const activeNav = [...document.querySelectorAll("#workNav button")].find((button) => button.classList.contains("is-active"));
      const isWorksActive = !activeNav || activeNav.textContent.includes("作品") || title === "作品";
      if (!isWorksActive) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      renderLists();
      select(0);
      overlay.classList.add("is-open", "scan-active");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("memory-open");
    }

    trigger.addEventListener("click", openPortfolioArchive, true);
    trigger.addEventListener("click", openPortfolioArchive);
    document.addEventListener("click", (event) => {
      if (!event.target.closest?.("#enterWork")) return;
      openPortfolioArchive(event);
    }, true);
  }

  function initV31MainChapters() {
    if (document.body.dataset.homeArchitectureOnly === "true") return;
    const stage = document.getElementById("stage");
    const voyage = document.getElementById("voyage");
    const nav = document.getElementById("workNav");
    const legacyEnter = document.getElementById("enterWork");
    if (!stage || !voyage || !nav || !legacyEnter) return;

    const chapters = [
      { cn: "作品", traditional: "作品", en: "WORKS / SELECTED PROJECTS", summary: "从影像项目到场景练习，看看画面如何成为故事。", prompt: "选择一件作品", image: imageItems[0].src },
      { cn: "阅读", traditional: "閱讀", en: "READING / BOOK CONSTELLATION", summary: "阅读不是书单，而是影响镜头、空间与叙事判断的连接网络。文字在这里作为创作路径，而不是静态说明。", prompt: "进入阅读星图", image: imageItems[1].src },
      { cn: "学习", traditional: "學習", en: "LEARNING / PRACTICE ORBIT", summary: "从生成影像、三维空间到镜头语言，学习轨迹以输入、练习、失败和迁移四个阶段被保存。", prompt: "进入学习轨道", image: imageItems[4].src },
      { cn: "实验", traditional: "實驗", en: "EXPERIMENTS / PROCESS LAB", summary: "失败镜头、运动测试与材质判断在这里继续生长。实验不是附录，而是作品形成之前最真实的现场。", prompt: "进入实验现场", image: imageItems[10].src },
      { cn: "关于", traditional: "關於", en: "ABOUT / PERSONAL COORDINATE", summary: "吴翔宇的视觉方向以观察、采集、转化和持续开放为坐标，连接影像、记忆、地域经验与生成技术。", prompt: "进入个人坐标", image: imageItems[12].src }
    ];

    const viewport = document.createElement("div");
    viewport.className = "v31-main-viewport";
    viewport.innerHTML = `
      <div class="v31-main-track">
        ${chapters.map((chapter, index) => `
          <article class="v31-main-slide${index === 0 ? " is-active" : ""}" data-main-chapter="${index}" style="--slide-index:${index}">
            <div class="v31-main-media"><img src="${chapter.image}" alt="" draggable="false"></div>
            <div class="v31-main-shade"></div>
            <div class="v31-main-copy">
              <div class="v31-main-kicker">CHAPTER ${String(index + 1).padStart(2, "0")} / 05</div>
              <h2 class="v31-main-title" aria-label="${chapter.cn}">${[...chapter.cn].map((char) => `<span>${char}</span>`).join("")}</h2>
              <div class="v31-main-meta">${chapter.en}</div>
              <p>${chapter.summary}</p>
              <div class="v31-main-actions">
                <button class="v31-main-enter" type="button" data-enter-chapter="${index}">${chapter.prompt}<span>↗</span></button>
                ${index === 0 ? '<button class="v31-main-enter v31-main-flow" type="button" data-open-flow>打开图像流<span>≋</span></button>' : ""}
              </div>
            </div>
            <div class="v31-main-page-index"><b>0${index + 1}</b><span>${chapter.en.split(" / ")[0]}</span></div>
          </article>
        `).join("")}
      </div>
      <div class="v31-main-progress" aria-hidden="true"><i></i></div>
    `;
    stage.insertBefore(viewport, document.getElementById("workPanel"));
    document.body.classList.add("v31-main-shell-ready");

    const track = viewport.querySelector(".v31-main-track");
    const slides = [...viewport.querySelectorAll(".v31-main-slide")];
    const progress = viewport.querySelector(".v31-main-progress i");
    let active = 0;
    let locked = false;

    function syncLegacy(index) {
      const chapter = chapters[index];
      const title = document.getElementById("workTitle");
      const meta = document.getElementById("workMeta");
      const summary = document.getElementById("workSummary");
      const sequence = document.getElementById("workSequence");
      if (title) title.textContent = chapter.cn;
      if (meta) meta.textContent = chapter.en;
      if (summary) summary.textContent = chapter.summary;
      if (sequence) sequence.textContent = `Chapter ${String(index + 1).padStart(2, "0")} / 05`;
    }

    function setChapter(index, options = {}) {
      const next = clamp(index, 0, chapters.length - 1);
      if (next === active && !options.force) return;
      const direction = next > active ? 1 : -1;
      if (next !== active) {
        slides[active]?.classList.remove("is-active");
        slides[active]?.classList.add(direction > 0 ? "is-leaving-left" : "is-leaving-right");
      }
      active = next;
      track.style.transform = `translate3d(${-active * 100}vw, 0, 0)`;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === active);
        if (slideIndex === active) slide.classList.remove("is-leaving-left", "is-leaving-right");
        if (slideIndex !== active) window.setTimeout(() => slide.classList.remove("is-leaving-left", "is-leaving-right"), 900);
      });
      [...nav.querySelectorAll("button")].forEach((button, buttonIndex) => button.classList.toggle("is-active", buttonIndex === active));
      progress.style.transform = `scaleX(${(active + 1) / chapters.length})`;
      stage.dataset.work = String(active);
      stage.classList.remove("layout-0", "layout-1", "layout-2", "layout-3", "layout-4");
      stage.classList.add(`layout-${active}`);
      if (!options.skipLegacy) syncLegacy(active);
      window.dispatchEvent(new CustomEvent("v31:chapterchange", { detail: { index: active } }));
    }

    nav.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setChapter([...nav.querySelectorAll("button")].indexOf(button));
    }, true);

    viewport.addEventListener("click", (event) => {
      const button = event.target.closest("[data-enter-chapter]");
      if (!button) return;
      const index = Number(button.dataset.enterChapter);
      setChapter(index, { force: true });
      window.setTimeout(() => legacyEnter.click(), 40);
    });

    function navigateByWheel(event) {
      if (!document.body.classList.contains("experience-entered") || document.body.classList.contains("memory-open") || document.body.classList.contains("v31-flow-open")) return;
      if (event.target.closest?.(".experience-console")) return;
      if (document.querySelector(".index-overlay.is-open, .image-popout.is-open")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (locked || Math.abs(event.deltaY) + Math.abs(event.deltaX) < 8) return;
      const direction = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? Math.sign(event.deltaX) : Math.sign(event.deltaY);
      if (!direction) return;
      setChapter(active + direction);
      locked = true;
      window.setTimeout(() => { locked = false; }, 820);
    }
    window.addEventListener("wheel", navigateByWheel, { passive: false, capture: true });

    window.addEventListener("keydown", (event) => {
      if (["ArrowRight", "PageDown"].includes(event.key)) setChapter(active + 1);
      if (["ArrowLeft", "PageUp"].includes(event.key)) setChapter(active - 1);
    });

    let touchStartX = 0;
    let touchStartY = 0;
    viewport.addEventListener("touchstart", (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });
    viewport.addEventListener("touchend", (event) => {
      const dx = touchStartX - event.changedTouches[0].clientX;
      const dy = touchStartY - event.changedTouches[0].clientY;
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(delta) > 42) setChapter(active + Math.sign(delta));
    }, { passive: true });

    document.getElementById("homeButton")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setChapter(0, { force: true });
    }, true);

    document.getElementById("indexList")?.addEventListener("click", (event) => {
      const button = event.target.closest(".index-work");
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setChapter([...button.parentElement.children].indexOf(button));
      document.getElementById("indexClose")?.click();
    }, true);

    setChapter(0, { force: true, skipLegacy: true });
  }

  function initV31FlowOverlay() {
    const flow = document.getElementById("workFlow");
    const chapters = document.getElementById("imageChapters");
    const boundary = document.getElementById("boundary");
    if (!flow || !chapters || flow.dataset.presentation==='scroll-collage') return;

    const toolbar = document.createElement("div");
    toolbar.className = "v31-flow-toolbar";
    toolbar.innerHTML = `
      <div class="v31-flow-title"><small>WORKS / LIVING IMAGE SYSTEM</small><strong>图像流</strong></div>
      <div class="v31-flow-tabs" role="tablist" aria-label="图像流视图">
        <button type="button" role="tab" data-flow-view="accordion">折叠流</button>
        <button type="button" role="tab" data-flow-view="morph">变形场</button>
        <button type="button" role="tab" data-flow-view="orbit">环轨</button>
        <button type="button" role="tab" data-flow-view="atlas">星图</button>
        
      </div>
      <button class="v31-flow-close" type="button" aria-label="关闭图像流">×</button>
    `;
    flow.insertBefore(toolbar, flow.firstChild);
    flow.appendChild(chapters);
    if(boundary)flow.appendChild(boundary);

    const tabs = [...toolbar.querySelectorAll("[data-flow-view]")];
    function setView(view) {
      flow.dataset.flowView = view;
      tabs.forEach((tab) => {
        const selected = tab.dataset.flowView === view;
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
      if (view === "morph") window.triggerPixelSwap?.();
    }

    function openFlow() {
      setView("accordion");
      flow.setAttribute("aria-hidden", "false");
      document.body.classList.add("v31-flow-open");
    }

    function closeFlow() {
      flow.setAttribute("aria-hidden", "true");
      document.body.classList.remove("v31-flow-open");
    }

    tabs.forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.flowView)));
    toolbar.querySelector(".v31-flow-close")?.addEventListener("click", closeFlow);
    document.addEventListener("click", (event) => {
      if (!event.target.closest?.("[data-open-flow]")) return;
      event.preventDefault();
      event.stopPropagation();
      openFlow();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("v31-flow-open")) closeFlow();
    });
    setView("accordion");
    flow.setAttribute("aria-hidden", "true");
  }

  function initTraditionalTextHover() {}

  function initChapterImageMotion() {
    const chapters = [...document.querySelectorAll(".image-chapter")];
    if (!chapters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-image-awake", entry.isIntersecting && entry.intersectionRatio > .32);
        entry.target.classList.toggle("is-tone-active", entry.isIntersecting && entry.intersectionRatio > .48);
      });
    }, { threshold: [.32, .58] });
    chapters.forEach((chapter) => observer.observe(chapter));
  }

  function initRuralProjectVideo() {
    const lead = document.getElementById("ruralProjectLead");
    const video = document.getElementById("ruralProjectVideo");
    const state = document.getElementById("ruralFilmState");
    const progress = document.getElementById("ruralFilmProgress");
    if (!lead || !video) return;
    let active = false;

    const updateProgress = () => {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 83;
      progress?.style.setProperty("transform", `scaleX(${Math.min(1, video.currentTime / duration)})`);
    };
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("ended", () => {
      if (state) state.textContent = "COMPLETE";
      active = false;
    });

    new IntersectionObserver(([entry]) => {
      const shouldPlay = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .38);
      document.body.classList.toggle("rural-film-active", shouldPlay);
      if (shouldPlay) {
        if (!active || video.ended) video.currentTime = 0;
        active = true;
        video.muted = true;
        video.play().then(() => {
          lead.classList.add("is-playing");
          if (state) state.textContent = "PLAYING";
        }).catch(() => {
          if (state) state.textContent = "READY";
        });
      } else {
        video.pause();
        lead.classList.remove("is-playing");
        if (state && !video.ended) state.textContent = "PAUSED";
      }
    }, { threshold: [.12, .38, .72] }).observe(lead);
  }

  function initSectionMotionBudget() {
    const workFlow = document.getElementById("workFlow");
    const voyage = document.getElementById("voyage");
    const paperSections = [...document.querySelectorAll(".work-flow, .image-chapters, .boundary")];
    const snow = document.querySelector(".pixel-snow-field");
    if (workFlow) {
      new IntersectionObserver(([entry]) => {
        workFlow.classList.toggle("is-motion-awake", Boolean(entry?.isIntersecting));
      }, { rootMargin: "180px" }).observe(workFlow);
    }
    if (voyage && snow) {
      new IntersectionObserver(([entry]) => {
        snow.classList.toggle("is-motion-paused", !entry?.isIntersecting);
      }, { rootMargin: "120px" }).observe(voyage);
    }
    if (paperSections.length) {
      const visiblePaper = new Set();
      const paperObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visiblePaper.add(entry.target);
          else visiblePaper.delete(entry.target);
        });
        document.body.classList.toggle("is-paper-reading", visiblePaper.size > 0);
      }, { threshold: .02 });
      paperSections.forEach((section) => paperObserver.observe(section));
    }
  }

  function initEntryLiveField() {
    const clock = document.getElementById("entryClock");
    const flux = document.getElementById("entryFlux");
    const coord = document.getElementById("entryCoord");
    if (!clock || !flux || !coord) return;
    let tick = 0;
    function render() {
      if (document.hidden || document.body.classList.contains("experience-entered")) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const pulse = Math.round(480 + Math.sin(tick * .17) * 260 + Math.cos(tick * .07) * 120);
      clock.textContent = `${hh}:${mm}:${ss}`;
      flux.textContent = `FLUX ${String(Math.max(0, pulse)).padStart(3, "0")}`;
      coord.textContent = `X ${(Math.sin(tick * .043) * 23.7).toFixed(2)} / Y ${(Math.cos(tick * .037) * 18.4).toFixed(2)}`;
      tick += 1;
    }
    render();
    window.setInterval(render, 260);
  }

  function initChapterToneFlow() {
    const stage = document.getElementById("stage");
    const memory = document.getElementById("memoryOverlay");
    const tones = [
      ["rgba(167, 201, 203, .82)", "rgba(167, 201, 203, .14)"],
      ["rgba(178, 190, 162, .82)", "rgba(126, 160, 127, .16)"],
      ["rgba(207, 181, 138, .82)", "rgba(176, 126, 82, .16)"],
      ["rgba(188, 160, 150, .82)", "rgba(150, 80, 76, .15)"],
      ["rgba(155, 177, 198, .82)", "rgba(92, 128, 168, .16)"]
    ];
    const applyTone = (index) => {
      const [accent, glow] = tones[index % tones.length];
      [stage, memory, document.documentElement].forEach((node) => {
        if (!node) return;
        node.style.setProperty("--chapter-accent", accent);
        node.style.setProperty("--chapter-glow", glow);
      });
      if (stage) stage.dataset.tone = String(index + 1);
    };
    applyTone(0);

    const nav = document.getElementById("workNav");
    if (nav) {
      const sync = () => {
        const buttons = [...nav.querySelectorAll("button")];
        const active = buttons.findIndex((button) => button.classList.contains("is-active"));
        if (active >= 0) applyTone(active);
      };
      nav.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        const index = [...nav.querySelectorAll("button")].indexOf(button);
        if (index >= 0) applyTone(index);
      });
      new MutationObserver(sync).observe(nav, { subtree: true, attributes: true, attributeFilter: ["class"] });
      sync();
    }

    const sections = [...document.querySelectorAll(".image-chapter")];
    const observer = new IntersectionObserver((entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      applyTone(sections.indexOf(active.target));
    }, { threshold: [.42, .6] });
    sections.forEach((section) => observer.observe(section));
  }

  function initGlobalMotionClass() {
    document.documentElement.classList.add("v29-motion-ready");
    const activate = () => document.body.classList.add("v29-live");
    document.addEventListener("pointermove", activate, { once: true, passive: true });
    window.setTimeout(activate, 1200);
  }

  function initResearchJournal() {
    const board=document.querySelector('[data-compact-research]');
    const cards=[...document.querySelectorAll('[data-research-target]')],entries=[...document.querySelectorAll('[data-research-entry]')];
    if(!board||!cards.length)return;
    function select(id){
      if(!entries.some(e=>e.id===id))return;
      cards.forEach(c=>{const active=c.dataset.researchTarget===id;c.classList.toggle('is-active',active);c.setAttribute('aria-selected',String(active));c.tabIndex=active?0:-1;});
      entries.forEach(e=>{e.hidden=e.id!==id;});
      const panel=document.getElementById(id);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)panel.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'ease-out'});
      window.__v31Lenis?.resize?.();
    }
    cards.forEach((card,i)=>{
      card.addEventListener('click',()=>select(card.dataset.researchTarget));
      card.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();select(card.dataset.researchTarget);}if(['ArrowRight','ArrowLeft','Home','End'].includes(event.key)){event.preventDefault();const n=event.key==='Home'?0:event.key==='End'?cards.length-1:(i+(event.key==='ArrowRight'?1:cards.length-1))%cards.length;select(cards[n].dataset.researchTarget);cards[n].focus();}});
    });
    window.addEventListener('v31:research-open',e=>select(e.detail));
    document.addEventListener('click',e=>{const id=e.target.closest?.('[data-index-target]')?.dataset.indexTarget;if(id?.startsWith('research-'))select(id);},true);
    select('research-reading');
  }

  function initExhibition() {
    initJourneyImagePreload();
    initEntryLiveField();
    initGlobalMotionClass();
    initPixelSnow();
    initWxySignature();
    initJourneyImageHydration();
    initAccordionGallery();
    initMorphFlow();
    initCircularGallery();
    initLogoLoop();
    initFolderMotion();
    initLineSidebarMotion();
    initImageCardPopout();
    initAtlasImageCurrent();
    initMemoryImageCurrent();
    initV31InteractionCleanup();
    initChapterImageMotion();
    initRuralProjectVideo();
    initSectionMotionBudget();
    initChapterToneFlow();
    initTextKinetics();
    initV31PortfolioMemory();
    initResearchJournal();
    initV31IndexNavigationRepair();
    initTraditionalTextHover();
  }

  function init() {
    if (document.getElementById("countdownPrelude")) {
      window.addEventListener("v31:opening-complete", initExhibition, { once: true });
      initCountdownPrelude();
    } else initExhibition();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
