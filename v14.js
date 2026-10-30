(() => {
  "use strict";

  const works = [
    {
      cn: "回不去的乡",
      en: "Distant Homeland",
      type: "AI Short Film",
      copy: "时代记忆、土地和背影被压成一枚缓慢发光的记忆信号。镜头穿过黄昏、道路和远山，但不替乡愁作出解释。",
      symbols: "树、路、人物背影、黄昏、远山",
      motion: "低速向地平线推进，每一次靠近都被记忆轻微拉回。",
      process: "从乡土关键词、镜头构图到 AI 短片节奏测试。",
      edge: "保留未完成的家庭影像、废弃镜头与声音采样。"
    },
    {
      cn: "东方玄幻",
      en: "Oriental Fantasy",
      type: "Scene Design",
      copy: "宫殿、红衣与对峙关系被组织成一条持续收紧的中轴线。它不是静止的设定图，而是一种正在逼近的戏剧压力。",
      symbols: "红衣、王座、宫灯、金色木构、对称轴",
      motion: "镜头像穿过宫门，红色信号在空间中心持续逼近。",
      process: "角色设定、场景搭建、运动测试与镜头压力校正。",
      edge: "继续扩展为角色关系图和可航行的场景结构。"
    },
    {
      cn: "雨夜与红",
      en: "Wet Oriental Classicism",
      type: "Color Study",
      copy: "蓝灰雨幕和红色焦点构成色彩矛盾。这个节点像一场湿润、发光、有深度的雨，冷色环境不断吞没暖色信号。",
      symbols: "雨、红灯、剑光、湿地反射、蓝灰色",
      motion: "雨线按深度分层，红色光源在接近时产生反射拖尾。",
      process: "冷光设定、红色焦点控制、雨幕速度和地面反射测试。",
      edge: "发展为可复用的东方影像色彩方法样本。"
    },
    {
      cn: "骸骨之岸",
      en: "Echoes of the Abyss",
      type: "Film Concept",
      copy: "黑海、白瞳、骨骸和雾共同形成一段灾难史诗。观众不是站在岸边观看，而是在缓慢沉入这段没有幸存者的历史。",
      symbols: "黑海、白瞳、骨骸、雾、灾难遗迹",
      motion: "镜头低贴海面漂移，远处结构在雾中逐层显露。",
      process: "情绪图、世界观轮廓、尺度测试与运动预演。",
      edge: "保留无法解释的史前痕迹，让故事继续向未知生长。"
    },
    {
      cn: "民俗符号",
      en: "Northeast Ritual System",
      type: "Symbol Archive",
      copy: "器物、布料、火、烟和供桌不再作为装饰出现，而是被保存为一套仍在生长的东北民俗视觉语法。",
      symbols: "祭祀器物、布料、火、烟、供桌",
      motion: "烟雾向上生长，器物在暗部中被短暂照亮后再次隐去。",
      process: "田野关键词、器物采样、符号拆解与镜头组合。",
      edge: "持续补充地域资料，避免符号被简化成表面奇观。"
    }
  ];

  const visualStates = [
    {
      form: 0,
      explode: 0,
      tint: [1.03, 1.0, .93],
      exposure: 1,
      phase: 0,
      lens: .22,
      object: { x: .62, y: -.34, z: .15, scale: .88 },
      phaseName: "Seed / breathing"
    },
    {
      form: 1,
      explode: .14,
      tint: [.9, .95, 1.05],
      exposure: .94,
      phase: 1.35,
      lens: .34,
      object: { x: -.5, y: .08, z: -.15, scale: .78 },
      phaseName: "Halo / axial pressure"
    },
    {
      form: 2,
      explode: .2,
      tint: [.8, .95, 1.08],
      exposure: 1.03,
      phase: 2.8,
      lens: .46,
      object: { x: .78, y: .16, z: -.38, scale: .78 },
      phaseName: "Bloom / chromatic rain"
    },
    {
      form: 3,
      explode: .3,
      tint: [.68, .78, .88],
      exposure: .78,
      phase: 4.4,
      lens: .56,
      object: { x: -.7, y: -.24, z: -.42, scale: .7 },
      phaseName: "Constellation / abyss"
    },
    {
      form: .55,
      explode: .12,
      tint: [1.06, .88, .67],
      exposure: .92,
      phase: 6,
      lens: .38,
      object: { x: .18, y: .1, z: -.72, scale: .68 },
      phaseName: "Ritual orbit / ember"
    }
  ];

  const formLabels = [
    "Seed / 聚合",
    "Halo / 光环",
    "Bloom / 花冠",
    "Constellation / 星图"
  ];

  function cubicBezier(x1, y1, x2, y2) {
    const sample = (a1, a2, value) =>
      ((1 - 3 * a2 + 3 * a1) * value + (3 * a2 - 6 * a1)) * value * value +
      3 * a1 * value;
    const slope = (a1, a2, value) =>
      3 * (1 - 3 * a2 + 3 * a1) * value * value +
      2 * (3 * a2 - 6 * a1) * value +
      3 * a1;

    return (progress) => {
      let estimate = progress;
      for (let index = 0; index < 5; index += 1) {
        const currentSlope = slope(x1, x2, estimate);
        if (Math.abs(currentSlope) < .0001) break;
        estimate -= (sample(x1, x2, estimate) - progress) / currentSlope;
        estimate = Math.max(0, Math.min(1, estimate));
      }
      return sample(y1, y2, estimate);
    };
  }

  const materialEase = {
    standard: cubicBezier(.4, 0, .2, 1),
    enter: cubicBezier(0, 0, .2, 1),
    exit: cubicBezier(.4, 0, 1, 1),
    sharp: cubicBezier(.4, 0, .6, 1)
  };

  const viewportWidth = () =>
    Math.round(window.visualViewport?.width || document.documentElement.clientWidth || window.innerWidth);
  const viewportHeight = () =>
    Math.round(window.visualViewport?.height || document.documentElement.clientHeight || window.innerHeight);
  const isCompactViewport = () =>
    window.matchMedia("(max-width: 720px)").matches || viewportWidth() < 720;

  const stage = document.getElementById("stage");
  const voyage = document.getElementById("voyage");
  const loader = document.getElementById("loader");
  const entryGate = document.getElementById("entryGate");
  const entryButton = document.getElementById("entryButton");
  const workNav = document.getElementById("workNav");
  const indexOverlay = document.getElementById("indexOverlay");
  const memoryOverlay = document.getElementById("memoryOverlay");
  const cursor = document.getElementById("cursor");
  const cursorLabel = document.getElementById("cursorLabel");
  const shockwave = document.getElementById("shockwave");
  const backgroundRipple = document.getElementById("backgroundRipple");
  const authorityField = document.getElementById("authorityField");
  const objectPrompt = document.getElementById("objectPrompt");
  const phaseCode = document.getElementById("phaseCode");
  const phaseStatus = document.getElementById("phaseStatus");
  const fallback = document.getElementById("fallback");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let lenis = null;
  let activeWork = 0;
  let lastFocus = null;
  let travelProgress = 0;
  let scrollVelocity = 0;
  let backgroundAwakeTimer = 0;
  let hoverMorphTimer = 0;
  let interactionTimeline = null;
  let renderer;
  let objectScene;
  let objectCamera;
  let backgroundScene;
  let backgroundCamera;
  let backgroundMaterial;
  let backgroundReady = false;
  let clock;
  let objectGroup;
  let shardMesh;
  let shardData = [];
  let shardShapes = [];
  let core;
  let coreGlow;
  let orbitLines = [];
  let armillaryRings = [];
  let ringNodes = [];
  let coreShell;
  let objectHalo;
  let objectHaloData = [];
  let travelDust;
  let travelDustData = [];
  let hitTarget;
  let raycaster;
  let warmLight;
  let coldLight;
  let isObjectHover = false;
  let pointerReady = false;
  let currentBaseForm = 0;
  let currentBaseExplode = 0;
  let workLetterControllers = [];
  let heroLetterControllers = [];
  let magneticControllers = [];
  let experienceEntered = false;
  let layoutRevealed = false;
  const revealedWorks = new Set();

  const pointer = new THREE.Vector2(8, 8);
  const pointerSmooth = new THREE.Vector2(0, 0);
  const pointerUv = new THREE.Vector2(.5, .5);
  const pointerUvSmooth = new THREE.Vector2(.5, .5);
  const previousPointer = new THREE.Vector2(.5, .5);
  const objectTarget = { x: .62, y: -.34, z: .15, scale: .88 };
  const objectState = {
    form: 0,
    explode: 0,
    energy: .2,
    hover: 0,
    spin: 0
  };
  const rippleState = { value: 0 };
  const authorityState = {
    value: 0,
    speed: 0,
    hold: 0
  };
  const ringState = {
    spread: 0,
    aperture: 0,
    twist: 0
  };
  const tempObject = new THREE.Object3D();
  const tempPosition = new THREE.Vector3();
  const tempPositionB = new THREE.Vector3();
  const tempQuaternion = new THREE.Quaternion();
  const tempQuaternionB = new THREE.Quaternion();
  const tempScale = new THREE.Vector3();
  const tempEuler = new THREE.Euler();
  const tempColor = new THREE.Color();

  const backgroundVertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const backgroundFragmentShader = `
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec2 uRippleCenter;
    uniform vec3 uTint;
    uniform float uTime;
    uniform float uScroll;
    uniform float uVelocity;
    uniform float uLens;
    uniform float uRipple;
    uniform float uPhase;
    uniform float uExposure;
    uniform float uImageAspect;
    uniform float uAuthority;
    uniform float uPointerSpeed;
    uniform float uHold;
    varying vec2 vUv;

    vec2 coverUv(vec2 uv) {
      float screenAspect = uResolution.x / uResolution.y;
      vec2 result = uv;
      if (screenAspect < uImageAspect) {
        result.x = (uv.x - .5) * (screenAspect / uImageAspect) + .5;
      } else {
        result.y = (uv.y - .5) * (uImageAspect / screenAspect) + .5;
      }
      return result;
    }

    float hash21(vec2 value) {
      value = fract(value * vec2(123.34, 456.21));
      value += dot(value, value + 45.32);
      return fract(value.x * value.y);
    }

    float valueNoise(vec2 point) {
      vec2 cell = floor(point);
      vec2 local = fract(point);
      local = local * local * (3.0 - 2.0 * local);
      float a = hash21(cell);
      float b = hash21(cell + vec2(1.0, 0.0));
      float c = hash21(cell + vec2(0.0, 1.0));
      float d = hash21(cell + vec2(1.0, 1.0));
      return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
    }

    float flowNoise(vec2 point) {
      float value = 0.0;
      float amplitude = .55;
      for (int octave = 0; octave < 4; octave++) {
        value += valueNoise(point) * amplitude;
        point = point * 2.03 + vec2(7.1, 3.8);
        amplitude *= .5;
      }
      return value;
    }

    void main() {
      vec2 screenUv = vUv;
      vec2 uv = coverUv(screenUv);
      float aspect = uResolution.x / uResolution.y;
      float breath = sin(uTime * .19 + uPhase) * .5 + .5;

      vec2 cameraDrift = vec2(
        sin(uTime * .031 + uPhase),
        cos(uTime * .026 + uPhase * .7)
      ) * .0026;
      float cameraScale = 1.0 - uScroll * .028 - breath * .0016 - uAuthority * .0085;
      uv = (uv - .5) * cameraScale + .5;
      uv += cameraDrift + vec2(uScroll * .009, -uScroll * .003);

      vec2 mouseDelta = screenUv - uMouse;
      mouseDelta.x *= aspect;
      float mouseDistance = length(mouseDelta);
      vec2 mouseDirection = normalize(mouseDelta + vec2(.0001));
      float controlCore = exp(-mouseDistance * mouseDistance * 34.0);
      float controlHalo = exp(-pow(mouseDistance - .19, 2.0) * 145.0);
      float lensField = controlCore * uLens * uAuthority;

      // Keep the photographic layer stable: only a tightly bounded radial compression is allowed.
      uv -= mouseDirection * lensField * (.0038 + uHold * .0032);

      vec2 rippleDelta = screenUv - uRippleCenter;
      rippleDelta.x *= aspect;
      float rippleDistance = length(rippleDelta);
      float ring = sin(rippleDistance * 54.0 - uTime * 8.2) *
        exp(-rippleDistance * 6.4) * uRipple;
      uv += normalize(rippleDelta + vec2(.0001)) * ring * .0024;

      float velocityOffset = clamp(abs(uVelocity) * .000018, 0.0, .0014);
      float chroma = controlHalo * uAuthority * .0022 + velocityOffset;
      vec2 chromaDirection = mouseDirection * chroma;
      vec3 centerSample = texture2D(uTexture, clamp(uv, vec2(.001), vec2(.999))).rgb;
      float redSample = texture2D(uTexture, clamp(uv + chromaDirection, vec2(.001), vec2(.999))).r;
      float blueSample = texture2D(uTexture, clamp(uv - chromaDirection, vec2(.001), vec2(.999))).b;
      vec3 color = vec3(redSample, centerSample.g, blueSample);

      vec2 flowPoint = screenUv * vec2(3.4, 2.2);
      flowPoint += vec2(uTime * .018, -uTime * .011) + uPhase * .17;
      float slowFlow = flowNoise(flowPoint);
      float fineFlow = flowNoise(flowPoint * 2.7 - vec2(uTime * .026, 0.0));
      float volume = (slowFlow - .48) * .055 + (fineFlow - .5) * .018;
      color += vec3(.14, .25, .27) * volume;

      vec2 starCell = floor(screenUv * vec2(190.0, 108.0));
      vec2 starLocal = fract(screenUv * vec2(190.0, 108.0)) - .5;
      float starSeed = hash21(starCell);
      float movingStar = 1.0 - smoothstep(0.0, .045, length(starLocal));
      movingStar *= step(.985, starSeed);
      movingStar *= .28 + .72 * sin(uTime * (.45 + starSeed) + starSeed * 18.0) * .5 + .36;
      color += vec3(.54, .67, .69) * movingStar * .34;

      float authorityShade = uAuthority * (.07 + uHold * .045);
      color *= 1.0 - authorityShade * (1.0 - controlCore * .6);
      float foldContour = exp(-pow(mouseDistance - .125, 2.0) * 620.0) * uAuthority;
      color *= 1.0 - controlCore * uAuthority * (.13 + uHold * .08);
      color += vec3(.78, .64, .42) * controlHalo * uAuthority * .075;
      color += vec3(.46, .69, .71) * foldContour * .12;
      color += vec3(.32, .48, .5) * abs(ring) * .075;

      float pulseLight = abs(ring) * .15 + controlCore * uPointerSpeed * .08;
      color *= uTint * uExposure * (1.0 + breath * .018 + pulseLight);

      float vignette = smoothstep(.48, 1.05, length((screenUv - .5) * vec2(.9, 1.0)));
      color *= 1.0 - vignette * (.1 + uAuthority * .08);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothStep(value) {
    return value * value * (3 - 2 * value);
  }

  function buildInterface() {
    const indexList = document.getElementById("indexList");
    workNav.innerHTML = "";
    indexList.innerHTML = "";

    works.forEach((work, index) => {
      const navButton = document.createElement("button");
      navButton.type = "button";
      navButton.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><span>${work.cn}</span>`;
      navButton.setAttribute("aria-label", `前往作品：${work.cn}`);
      navButton.addEventListener("click", () => scrollToWork(index));
      workNav.appendChild(navButton);

      const indexButton = document.createElement("button");
      indexButton.type = "button";
      indexButton.className = "index-work";
      indexButton.innerHTML = `
        <span class="number">${String(index + 1).padStart(2, "0")}</span>
        <span class="title">${work.cn}</span>
        <span class="meta">${work.en} / ${work.type}</span>
        <span class="arrow">→</span>
      `;
      indexButton.addEventListener("click", () => {
        closeIndex(false);
        scrollToWork(index);
      });
      indexList.appendChild(indexButton);
    });

    setActiveWork(0, false);
  }

  function splitIntoWords(element) {
    const text = element.textContent.trim();
    let parts;
    if (window.Intl?.Segmenter) {
      parts = [...new Intl.Segmenter("zh-CN", { granularity: "word" }).segment(text)]
        .map((item) => item.segment);
    } else {
      parts = text.match(/[\u3400-\u9fff]{1,2}|[A-Za-z0-9]+|[^\s]/g) || [text];
    }
    element.innerHTML = parts.map((part) =>
      `<span class="reveal-word">${part.replace(/ /g, "&nbsp;")}</span>`
    ).join("");
  }

  function createMosaic(target, columns = 7, rows = 3) {
    target.querySelector(":scope > .mosaic-grid")?.remove();
    target.classList.add("mosaic-shell");
    const grid = document.createElement("span");
    grid.className = "mosaic-grid";
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    for (let index = 0; index < columns * rows; index += 1) {
      grid.appendChild(document.createElement("i"));
    }
    target.appendChild(grid);
    return [...grid.children];
  }

  function addMosaicReveal(timeline, target, position = 0) {
    const tiles = createMosaic(target);
    gsap.set(target, { filter: "blur(12px)", opacity: .28 });
    gsap.set(tiles, {
      opacity: () => .42 + Math.random() * .5,
      scale: () => .55 + Math.random() * .75
    });
    timeline
      .to(target, {
        filter: "blur(0px)",
        opacity: 1,
        duration: .82,
        ease: materialEase.enter
      }, position)
      .to(tiles, {
        opacity: 0,
        scale: .15,
        duration: .62,
        stagger: { amount: .72, from: "random" },
        ease: materialEase.exit
      }, position + .08)
      .set(tiles, { display: "none" });
  }

  function prepareRevealSystem() {
    document.querySelectorAll(".hero-copy > span").forEach(splitIntoWords);
    gsap.set([".topbar", ".hero", ".work-nav", ".object-prompt", ".ambient-status"], {
      autoAlpha: 0
    });
    gsap.set(".spatial-grid i", { scaleY: 0, transformOrigin: "top" });
    gsap.set("#workPanel", { autoAlpha: 0 });
  }

  function revealMainLayout() {
    if (layoutRevealed) return;
    layoutRevealed = true;
    const timeline = gsap.timeline();
    const titleLetters = [...document.querySelectorAll(".hero-char i")];
    const copyWords = [...document.querySelectorAll(".hero-copy .reveal-word")];

    gsap.set([".topbar", ".hero", ".work-nav", ".object-prompt", ".ambient-status"], {
      autoAlpha: 1
    });

    timeline
      .to(".spatial-grid i", {
        scaleY: 1,
        duration: 1.15,
        stagger: { each: .045, from: "edges" },
        ease: materialEase.enter
      }, 0)
      .fromTo(".brand", {
        x: -52,
        opacity: 0,
        clipPath: "inset(0 100% 0 0)"
      }, {
        x: 0,
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        duration: .78,
        ease: materialEase.enter
      }, .12)
      .fromTo(".index-trigger", {
        x: 46,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: .62,
        ease: materialEase.enter
      }, .24)
      .fromTo(".hero-kicker", {
        x: 74,
        opacity: 0,
        clipPath: "inset(0 0 0 100%)"
      }, {
        x: 0,
        opacity: 1,
        clipPath: "inset(0 0 0 0%)",
        duration: .86,
        ease: materialEase.enter
      }, .3);

    titleLetters.forEach((letter, index) => {
      const variants = [
        { from: { yPercent: 118, rotate: 7, opacity: 0 }, duration: .82 },
        { from: { x: 68, filter: "blur(11px)", opacity: 0 }, duration: .92 },
        { from: { scale: 1.42, filter: "blur(8px)", opacity: 0 }, duration: .78 },
        { from: { y: -54, x: -18, rotate: -5, opacity: 0 }, duration: .88 }
      ];
      const variant = variants[index % variants.length];
      timeline.fromTo(letter, variant.from, {
        x: 0,
        y: 0,
        yPercent: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: variant.duration,
        ease: index % 2 ? materialEase.standard : materialEase.enter
      }, .42 + index * .085);
    });

    addMosaicReveal(timeline, document.querySelector(".hero h1"), .38);

    timeline
      .fromTo(".hero-index", {
        y: 34,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: .58,
        ease: materialEase.enter
      }, .86)
      .fromTo(".hero-coordinate > span:first-child", {
        x: -28,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: .52,
        ease: materialEase.enter
      }, .92)
      .fromTo(".hero-coordinate i", {
        scaleX: 0,
        transformOrigin: "right"
      }, {
        scaleX: 1,
        duration: .72,
        ease: materialEase.standard
      }, .88)
      .fromTo(".hero-coordinate > span:last-child", {
        x: 36,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: .6,
        ease: materialEase.enter
      }, 1.02);

    copyWords.forEach((word, index) => {
      const isHorizontal = index % 3 === 1;
      timeline.fromTo(word, {
        x: isHorizontal ? 32 : 0,
        y: isHorizontal ? 0 : 18,
        filter: index % 4 === 0 ? "blur(7px)" : "blur(0px)",
        opacity: 0
      }, {
        x: 0,
        y: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: .48 + index * .018,
        ease: materialEase.enter
      }, 1.04 + index * .035);
    });

    timeline
      .fromTo(".work-nav button", {
        x: (index) => index % 2 ? 38 : -26,
        clipPath: "inset(0 100% 0 0)",
        opacity: 0
      }, {
        x: 0,
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: .66,
        stagger: .065,
        ease: materialEase.enter
      }, 1.18)
      .fromTo(["#objectPrompt", ".ambient-status"], {
        opacity: 0,
        y: 18
      }, {
        opacity: 1,
        y: 0,
        duration: .56,
        stagger: .16,
        ease: materialEase.enter
      }, 1.34);
  }

  function revealWork(index) {
    if (!experienceEntered || revealedWorks.has(index)) return;
    revealedWorks.add(index);
    const panel = document.getElementById("workPanel");
    const title = document.getElementById("workTitle");
    const letters = [...title.querySelectorAll(".work-letter")];
    const timeline = gsap.timeline();

    gsap.set(panel, { autoAlpha: 1, y: 0 });
    timeline
      .fromTo("#workSequence", {
        x: -42,
        opacity: 0,
        clipPath: "inset(0 100% 0 0)"
      }, {
        x: 0,
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        duration: .7,
        ease: materialEase.enter
      }, 0);

    letters.forEach((letter, letterIndex) => {
      const variants = [
        { x: 70, opacity: 0, filter: "blur(10px)" },
        { yPercent: 125, opacity: 0, rotate: 6 },
        { scale: 1.5, opacity: 0, filter: "blur(8px)" },
        { x: -44, y: -20, opacity: 0 }
      ];
      timeline.fromTo(letter, variants[(letterIndex + index) % variants.length], {
        x: 0,
        y: 0,
        yPercent: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: .72 + letterIndex * .045,
        ease: letterIndex % 2 ? materialEase.standard : materialEase.enter
      }, .14 + letterIndex * .07);
    });

    addMosaicReveal(timeline, title, .08);

    timeline
      .fromTo("#workMeta", {
        x: 46,
        opacity: 0,
        filter: "blur(6px)"
      }, {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: .72,
        ease: materialEase.enter
      }, .5)
      .fromTo(".enter-work", {
        y: 22,
        opacity: 0,
        clipPath: "inset(0 0 100% 0)"
      }, {
        y: 0,
        opacity: 1,
        clipPath: "inset(0 0 0% 0)",
        duration: .62,
        ease: materialEase.enter
      }, .68);
  }

  function setWorkTitle(text) {
    const title = document.getElementById("workTitle");
    title.setAttribute("aria-label", text);
    title.innerHTML = [...text].map((character) => `<span class="work-letter">${character}</span>`).join("");
    buildLetterControllers();
  }

  function setActiveWork(index, animate = true) {
    if (index === activeWork && animate) {
      if (stage.classList.contains("has-work")) revealWork(index);
      return;
    }
    activeWork = index;
    const work = works[index];
    const state = visualStates[index];

    [...workNav.children].forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });

    const updateText = () => {
      document.getElementById("workSequence").textContent =
        `Signal ${String(index + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}`;
      setWorkTitle(work.cn);
      document.getElementById("workMeta").textContent = `${work.en} / ${work.type}`;
    };

    updateText();

    stage.classList.remove("layout-0", "layout-1", "layout-2", "layout-3", "layout-4");
    stage.classList.add(`layout-${index}`);
    stage.dataset.work = String(index);
    applyVisualState(state, animate);
    if (animate && stage.classList.contains("has-work")) {
      if (revealedWorks.has(index)) {
        gsap.set("#workPanel", { autoAlpha: 1, x: 0, y: 0 });
      } else {
        revealWork(index);
      }
    }
  }

  function applyVisualState(state, animate) {
    currentBaseForm = state.form;
    currentBaseExplode = state.explode;
    const duration = animate && !reducedMotion ? .9 : 0;

    gsap.to(objectTarget, {
      ...state.object,
      duration,
      ease: materialEase.standard
    });
    gsap.to(ringState, {
      aperture: .08 + state.lens * .22,
      spread: state.explode * .26,
      twist: ringState.twist + (animate ? .48 : 0),
      duration,
      ease: materialEase.standard
    });

    if (backgroundMaterial) {
      gsap.to(backgroundMaterial.uniforms.uTint.value, {
        x: state.tint[0],
        y: state.tint[1],
        z: state.tint[2],
        duration: duration || .01,
        ease: materialEase.standard
      });
      gsap.to(backgroundMaterial.uniforms.uExposure, {
        value: state.exposure,
        duration: duration || .01,
        ease: materialEase.standard
      });
      gsap.to(backgroundMaterial.uniforms.uPhase, {
        value: state.phase,
        duration: duration || .01,
        ease: materialEase.standard
      });
      if (!isObjectHover) {
        gsap.to(backgroundMaterial.uniforms.uLens, {
          value: state.lens,
          duration: duration || .01,
          ease: materialEase.standard
        });
      }
    }

    phaseCode.textContent = `Form ${String(Math.round(state.form) + 1).padStart(2, "0")}`;
    phaseStatus.textContent = state.phaseName;

    if (!shardMesh || isObjectHover) return;
    interactionTimeline?.kill();
    interactionTimeline = gsap.timeline();
    interactionTimeline
      .to(objectState, {
        explode: Math.max(.78, currentBaseExplode),
        energy: .85,
        duration: animate ? .34 : 0,
        ease: materialEase.exit
      })
      .to(objectState, {
        form: currentBaseForm,
        duration: animate ? .72 : 0,
        ease: materialEase.standard
      })
      .to(objectState, {
        explode: currentBaseExplode,
        energy: .28,
        duration: animate ? .56 : 0,
        ease: materialEase.enter
      });
  }

  function scrollToWork(index) {
    const progress = .1 + (index + .18) / works.length * .87;
    const target = voyage.offsetTop + progress * Math.max(0, voyage.offsetHeight - window.innerHeight);
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.45 });
    } else {
      window.scrollTo({ top: target, behavior: reducedMotion ? "auto" : "smooth" });
    }
  }

  function openIndex(trigger) {
    lastFocus = trigger;
    indexOverlay.classList.add("is-open");
    lenis?.stop();
    gsap.fromTo(indexOverlay, { clipPath: "inset(0 0 100% 0)" }, {
      clipPath: "inset(0 0 0% 0)",
      duration: reducedMotion ? 0 : .85,
      ease: "power4.inOut"
    });
    gsap.fromTo(".index-work", { y: 20, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: reducedMotion ? 0 : .58,
      stagger: .055,
      delay: reducedMotion ? 0 : .32,
      ease: "power3.out"
    });
    document.getElementById("indexClose").focus();
  }

  function closeIndex(restoreFocus = true) {
    const finish = () => {
      indexOverlay.classList.remove("is-open");
      indexOverlay.style.clipPath = "";
      lenis?.start();
      if (restoreFocus) lastFocus?.focus();
    };

    if (reducedMotion) {
      finish();
    } else {
      gsap.to(indexOverlay, {
        clipPath: "inset(100% 0 0 0)",
        duration: .65,
        ease: "power3.inOut",
        onComplete: finish
      });
    }
  }

  function openMemory(trigger) {
    const work = works[activeWork];
    lastFocus = trigger;
    document.getElementById("memorySignal").textContent =
      `Memory signal ${String(activeWork + 1).padStart(2, "0")}`;
    document.getElementById("memoryKicker").textContent = `${work.type} / ${work.en}`;
    document.getElementById("memoryTitle").textContent = work.cn;
    document.getElementById("memoryEnglish").textContent = work.en;
    document.getElementById("memoryDescription").textContent = work.copy;
    document.getElementById("memorySymbols").textContent = work.symbols;
    document.getElementById("memoryMotion").textContent = work.motion;
    document.getElementById("memoryProcess").textContent = work.process;
    document.getElementById("memoryEdge").textContent = work.edge;
    memoryOverlay.dataset.work = String(activeWork + 1);
    memoryOverlay.classList.add("is-open");
    lenis?.stop();

    gsap.timeline()
      .fromTo(memoryOverlay, { clipPath: "inset(100% 0 0 0)" }, {
        clipPath: "inset(0% 0 0 0)",
        duration: reducedMotion ? 0 : .95,
        ease: "power4.inOut"
      })
      .fromTo(".memory-image img", { scale: 1.2, xPercent: -4 }, {
        scale: 1.03,
        xPercent: 0,
        duration: reducedMotion ? 0 : 1.35,
        ease: "power3.out"
      }, reducedMotion ? 0 : "-=.7")
      .fromTo(".memory-title-rail > *", {
        yPercent: 90,
        opacity: 0
      }, {
        yPercent: 0,
        opacity: 1,
        duration: reducedMotion ? 0 : .8,
        stagger: .08,
        ease: "power4.out"
      }, reducedMotion ? 0 : "-=1.05")
      .fromTo(".memory-fragments figure", {
        clipPath: "inset(100% 0 0 0)",
        y: 24
      }, {
        clipPath: "inset(0% 0 0 0)",
        y: 0,
        duration: reducedMotion ? 0 : .75,
        stagger: .1,
        ease: "power3.out"
      }, reducedMotion ? 0 : "-=.72")
      .fromTo(".memory-body > *", { y: 24, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: reducedMotion ? 0 : .65,
        stagger: .06,
        ease: "power3.out"
      }, reducedMotion ? 0 : "-=1");
    document.getElementById("memoryClose").focus();
  }

  function closeMemory() {
    const finish = () => {
      memoryOverlay.classList.remove("is-open");
      memoryOverlay.style.clipPath = "";
      lenis?.start();
      lastFocus?.focus();
    };

    if (reducedMotion) {
      finish();
    } else {
      gsap.to(memoryOverlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: .68,
        ease: "power3.inOut",
        onComplete: finish
      });
    }
  }

  function makeParticleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    const glow = context.createRadialGradient(32, 32, 0, 32, 32, 30);
    glow.addColorStop(0, "rgba(255,255,255,1)");
    glow.addColorStop(.18, "rgba(210,230,232,.82)");
    glow.addColorStop(.58, "rgba(180,204,208,.14)");
    glow.addColorStop(1, "rgba(180,204,208,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  function initThree() {
    if (!window.THREE) {
      fallback.classList.add("is-visible");
      return;
    }

    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("universe"),
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(viewportWidth(), viewportHeight());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();

    initBackgroundScene();
    initObjectScene();
    resizeThree();
    renderer.setAnimationLoop(renderThree);
  }

  function initBackgroundScene() {
    backgroundScene = new THREE.Scene();
    backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "./assets/space-hero.png",
      (texture) => {
        texture.colorSpace = THREE.NoColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        backgroundMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uResolution: { value: new THREE.Vector2(viewportWidth(), viewportHeight()) },
            uMouse: { value: new THREE.Vector2(.5, .5) },
            uRippleCenter: { value: new THREE.Vector2(.5, .5) },
            uTint: { value: new THREE.Vector3(1.03, 1, .93) },
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uVelocity: { value: 0 },
            uLens: { value: .22 },
            uRipple: { value: 0 },
            uPhase: { value: 0 },
            uExposure: { value: 1 },
            uImageAspect: { value: 1680 / 720 },
            uAuthority: { value: 0 },
            uPointerSpeed: { value: 0 },
            uHold: { value: 0 }
          },
          vertexShader: backgroundVertexShader,
          fragmentShader: backgroundFragmentShader,
          depthTest: false,
          depthWrite: false
        });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), backgroundMaterial);
        backgroundScene.add(plane);
        backgroundReady = true;
        stage.classList.add("webgl-ready");
        applyVisualState(visualStates[activeWork], false);
      },
      undefined,
      () => {
        fallback.classList.add("is-visible");
      }
    );
  }

  function initObjectScene() {
    objectScene = new THREE.Scene();
    objectCamera = new THREE.PerspectiveCamera(46, viewportWidth() / viewportHeight(), .1, 100);
    objectCamera.position.set(0, 0, 7);

    objectScene.add(new THREE.AmbientLight(0xaac2c8, 2.4));
    const frontLight = new THREE.DirectionalLight(0xe8f4f3, 4.2);
    frontLight.position.set(0, 1, 5);
    objectScene.add(frontLight);
    warmLight = new THREE.PointLight(0xd7ae79, 25, 28);
    warmLight.position.set(3.5, -1, 3.6);
    objectScene.add(warmLight);
    coldLight = new THREE.PointLight(0x9cc6d0, 22, 28);
    coldLight.position.set(-3.8, 2.7, 2.2);
    objectScene.add(coldLight);

    createShardObject();
    createTravelDust();
  }

  function quaternionForPosition(position, twist = 0) {
    tempObject.position.copy(position);
    tempObject.up.set(0, 1, 0);
    tempObject.lookAt(position.clone().multiplyScalar(2.2));
    tempObject.rotateZ(twist);
    return tempObject.quaternion.clone();
  }

  function createShapeData(count) {
    const shapes = [[], [], [], []];

    for (let index = 0; index < count; index++) {
      const band = index % 3;
      const bandIndex = Math.floor(index / 3);
      const bandCount = Math.ceil(count / 3);
      const theta = bandIndex / bandCount * Math.PI * 2 + band * .16;
      const radius = [.7, .9, 1.08][band];
      const seedPosition = new THREE.Vector3(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius,
        Math.sin(theta * 2 + band) * .08
      );
      seedPosition.applyEuler(new THREE.Euler(
        [.18, 1.12, .72][band],
        [.82, -.38, .28][band],
        [.12, .52, -.66][band]
      ));

      const haloBand = index % 3;
      const haloIndex = Math.floor(index / 3);
      const haloCount = Math.ceil(count / 3);
      const angle = haloIndex / haloCount * Math.PI * 2 + haloBand * .09;
      const haloRadius = [.72, .96, 1.2][haloBand];
      const haloPosition = new THREE.Vector3(
        Math.cos(angle) * haloRadius,
        Math.sin(angle) * haloRadius * .68,
        (haloBand - 1) * .17 + Math.sin(angle * 2.0) * .06
      );

      const petal = index % 8;
      const petalLayer = Math.floor(index / 8);
      const petalAngle = petal / 8 * Math.PI * 2 + petalLayer * .11;
      const petalRadius = .5 + petalLayer * .2;
      const bloomPosition = new THREE.Vector3(
        Math.cos(petalAngle) * petalRadius,
        Math.sin(petalAngle) * petalRadius,
        Math.sin(petalAngle * 2) * .24 + (petalLayer - 1) * .09
      );

      const spiralRatio = index / count;
      const spiralAngle = spiralRatio * Math.PI * 5.2;
      const constellationPosition = new THREE.Vector3(
        (spiralRatio - .5) * 2.35,
        Math.sin(spiralAngle) * .58,
        Math.cos(spiralAngle) * .42
      );

      const positions = [seedPosition, haloPosition, bloomPosition, constellationPosition];
      positions.forEach((position, shapeIndex) => {
        shapes[shapeIndex].push({
          position,
          quaternion: quaternionForPosition(position, theta + shapeIndex * .23)
        });
      });
    }
    return shapes;
  }

  function createShardObject() {
    const count = isCompactViewport() ? 24 : 36;
    const geometry = new THREE.OctahedronGeometry(.075, 0);
    geometry.scale(.66, 1.65, .52);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xdbe7e6,
      emissive: 0x203d42,
      emissiveIntensity: .72,
      roughness: .2,
      metalness: .7,
      clearcoat: 1,
      clearcoatRoughness: .08,
      iridescence: .34,
      iridescenceIOR: 1.5,
      flatShading: true,
      vertexColors: true,
      side: THREE.DoubleSide
    });

    shardMesh = new THREE.InstancedMesh(geometry, material, count);
    shardMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    shardMesh.frustumCulled = false;
    shardShapes = createShapeData(count);
    shardData = [];

    for (let index = 0; index < count; index++) {
      const scale = .68 + (index % 5) * .055;
      const tangent = new THREE.Vector3(
        Math.sin(index * 1.7),
        Math.cos(index * 1.13),
        Math.sin(index * .77)
      ).normalize();
      shardData.push({
        scale,
        tangent,
        speed: .45 + (index % 7) * .07,
        phase: index * .83
      });
      if (index % 9 === 0) tempColor.set(0xe9bd7d);
      else if (index % 3 === 0) tempColor.set(0xc9dcdd);
      else tempColor.set(0x688d92);
      shardMesh.setColorAt(index, tempColor);
    }
    shardMesh.instanceColor.needsUpdate = true;

    objectGroup = new THREE.Group();
    objectGroup.add(shardMesh);

    coreShell = new THREE.Mesh(
      new THREE.DodecahedronGeometry(.36, 1),
      new THREE.MeshPhysicalMaterial({
        color: 0x172529,
        emissive: 0x0b252a,
        emissiveIntensity: .65,
        roughness: .16,
        metalness: .74,
        clearcoat: 1,
        clearcoatRoughness: .08,
        iridescence: .38,
        iridescenceIOR: 1.45
      })
    );
    objectGroup.add(coreShell);

    const coreWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(.372, 1)),
      new THREE.LineBasicMaterial({
        color: 0xe0b673,
        transparent: true,
        opacity: .28,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    coreShell.add(coreWire);

    core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(.15, 3),
      new THREE.MeshPhysicalMaterial({
        color: 0x8ba8a9,
        emissive: 0xe0b673,
        emissiveIntensity: 1.1,
        roughness: .12,
        metalness: .58,
        clearcoat: 1
      })
    );
    objectGroup.add(core);

    coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeParticleTexture(),
      color: 0xd7ae79,
      transparent: true,
      opacity: .56,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    coreGlow.scale.set(.72, .72, 1);
    objectGroup.add(coreGlow);

    const ringConfigs = [
      { radius: .67, tube: .014, color: 0xe0b673, rotation: [.25, .82, .12] },
      { radius: .88, tube: .012, color: 0x9fc6c9, rotation: [1.08, -.36, .48] },
      { radius: 1.08, tube: .01, color: 0xdce7e4, rotation: [.72, .34, -1.02] }
    ];

    ringConfigs.forEach((config, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(config.radius, config.tube, 8, 180),
        new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: .48 - index * .08,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      ring.rotation.set(...config.rotation);
      ring.userData.baseRotation = new THREE.Euler(...config.rotation);
      ring.userData.speed = .13 + index * .085;
      armillaryRings.push(ring);
      objectGroup.add(ring);

      for (let nodeIndex = 0; nodeIndex < 3; nodeIndex += 1) {
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(.025 + index * .004, 10, 8),
          new THREE.MeshBasicMaterial({
            color: nodeIndex === 0 ? 0xe0b673 : 0xbfd4d5
          })
        );
        node.userData = {
          ring,
          radius: config.radius,
          phase: nodeIndex / 3 * Math.PI * 2 + index * .34,
          speed: .34 + index * .1
        };
        ringNodes.push(node);
        objectGroup.add(node);
      }
    });

    createObjectHalo();

    hitTarget = new THREE.Mesh(
      new THREE.SphereGeometry(1.42, 24, 16),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        colorWrite: false
      })
    );
    objectGroup.add(hitTarget);
    objectGroup.position.set(objectTarget.x, objectTarget.y, objectTarget.z);
    objectScene.add(objectGroup);
  }

  function createObjectHalo() {
    const count = isCompactViewport() ? 520 : 1100;
    const positions = new Float32Array(count * 3);
    objectHaloData = [];

    for (let index = 0; index < count; index += 1) {
      const direction = new THREE.Vector3(
        Math.random() - .5,
        Math.random() - .5,
        Math.random() - .5
      ).normalize();
      const radius = 1.15 + Math.pow(Math.random(), .72) * 3.6;
      positions[index * 3] = direction.x * radius;
      positions[index * 3 + 1] = direction.y * radius;
      positions[index * 3 + 2] = direction.z * radius;
      objectHaloData.push({
        direction,
        radius,
        phase: Math.random() * Math.PI * 2,
        speed: .18 + Math.random() * .55
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    objectHalo = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        map: makeParticleTexture(),
        color: 0xaacdd0,
        size: .022,
        transparent: true,
        opacity: .32,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    objectHalo.frustumCulled = false;
    objectGroup.add(objectHalo);
  }

  function createTravelDust() {
    const count = isCompactViewport() ? 300 : 620;
    const positions = new Float32Array(count * 3);
    travelDustData = [];
    for (let index = 0; index < count; index++) {
      const x = (Math.random() - .5) * 15;
      const y = (Math.random() - .5) * 9;
      const depth = Math.random() * 24;
      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = 4 - depth;
      travelDustData.push({
        x,
        y,
        depth,
        speed: .32 + Math.random() * .7,
        phase: Math.random() * Math.PI * 2
      });
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    travelDust = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        map: makeParticleTexture(),
        color: 0xc3d2d4,
        size: .032,
        transparent: true,
        opacity: .28,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    objectScene.add(travelDust);
  }

  function updateTravelDust(time) {
    if (!travelDust) return;
    const positions = travelDust.geometry.attributes.position.array;
    const authority = authorityState.value;
    const pointerX = pointerSmooth.x * 5.8;
    const pointerY = pointerSmooth.y * 3.3;

    travelDustData.forEach((data, index) => {
      const dx = data.x - pointerX;
      const dy = data.y - pointerY;
      const radius = Math.max(.25, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      const influence = Math.exp(-radius * .19) * authority;
      const twist = influence * (1.15 + authorityState.hold * 1.4);
      const drift = Math.sin(time * .3 + data.phase) * .035;

      positions[index * 3] = pointerX + Math.cos(angle + twist) * radius + drift;
      positions[index * 3 + 1] = pointerY + Math.sin(angle + twist) * radius - drift;
      positions[index * 3 + 2] =
        4 - ((data.depth + time * data.speed * (.42 + authority * 7.5)) % 24);
    });

    travelDust.geometry.attributes.position.needsUpdate = true;
    travelDust.material.size = .03 + authority * .026 + authorityState.hold * .018;
    travelDust.material.opacity = .2 + authority * .46 +
      clamp(Math.abs(scrollVelocity) / 90, 0, .24);
  }

  function updateObjectHalo(time) {
    if (!objectHalo) return;
    const positions = objectHalo.geometry.attributes.position.array;
    const expansion = 1 + objectState.explode * 1.15 + objectState.energy * .22;

    objectHaloData.forEach((data, index) => {
      const angle = time * data.speed * (.26 + objectState.energy * .72) + data.phase;
      const radius = data.radius * expansion *
        (1 + Math.sin(time * .52 + data.phase) * .045);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = data.direction.x * cos - data.direction.z * sin;
      const z = data.direction.x * sin + data.direction.z * cos;
      const verticalWave = Math.sin(angle * .7 + data.phase) * .12 * objectState.energy;

      positions[index * 3] = x * radius;
      positions[index * 3 + 1] = data.direction.y * radius + verticalWave;
      positions[index * 3 + 2] = z * radius;
    });

    objectHalo.geometry.attributes.position.needsUpdate = true;
    objectHalo.material.opacity = .16 + objectState.energy * .42;
    objectHalo.material.size = .018 + objectState.energy * .026;
    objectHalo.rotation.z = time * .018 + objectState.spin * .08;
  }

  function updateArmillary(time) {
    armillaryRings.forEach((ring, index) => {
      const base = ring.userData.baseRotation;
      const direction = index === 1 ? -1 : 1;
      ring.rotation.x = base.x + Math.sin(time * .31 + index) * .08 +
        time * ring.userData.speed * .2 * direction;
      ring.rotation.y = base.y + time * ring.userData.speed * direction +
        ringState.twist * (.22 + index * .1);
      ring.rotation.z = base.z + Math.cos(time * .27 + index) * .06;
      ring.position.z = (index - 1) * ringState.spread * .28;
      const apertureScale = 1 + ringState.aperture * (.08 + index * .055);
      ring.scale.setScalar(apertureScale);
      ring.material.opacity = .34 + objectState.energy * .22;
    });

    ringNodes.forEach((node, index) => {
      const data = node.userData;
      const angle = time * data.speed + data.phase + ringState.twist * .4;
      tempPosition.set(
        Math.cos(angle) * data.radius,
        Math.sin(angle) * data.radius,
        0
      );
      tempPosition.applyQuaternion(data.ring.quaternion);
      tempPosition.add(data.ring.position);
      node.position.copy(tempPosition);
      const nodeScale = 1 + Math.sin(time * 1.2 + index) * .24 +
        objectState.energy * .42;
      node.scale.setScalar(nodeScale);
    });

    coreShell.rotation.x = time * .28 + ringState.twist * .12;
    coreShell.rotation.y = -time * .36 - ringState.twist * .16;
    const shellPulse = 1 + Math.sin(time * .83) * .035 + ringState.aperture * .08;
    coreShell.scale.setScalar(shellPulse);
  }

  function updateShardInstances(time) {
    if (!shardMesh) return;
    const autoMorph = (Math.sin(time * .31 + activeWork) * .5 + .5) *
      .085 * (1 - objectState.hover);
    const clampedForm = clamp(objectState.form + autoMorph, 0, 3);
    const lowerForm = Math.floor(clampedForm);
    const upperForm = Math.min(3, lowerForm + 1);
    const formMix = smoothStep(clampedForm - lowerForm);

    for (let index = 0; index < shardData.length; index++) {
      const data = shardData[index];
      const source = shardShapes[lowerForm][index];
      const destination = shardShapes[upperForm][index];
      tempPosition.lerpVectors(source.position, destination.position, formMix);
      tempQuaternion.slerpQuaternions(source.quaternion, destination.quaternion, formMix);

      tempPositionB.copy(tempPosition).normalize();
      tempPositionB.multiplyScalar(objectState.explode * (.52 + (index % 4) * .075));
      tempPositionB.addScaledVector(data.tangent, objectState.explode * .22);
      tempPosition.add(tempPositionB);

      const livingMotion = Math.sin(time * data.speed * 1.7 + data.phase) *
        (.024 + objectState.energy * .038);
      tempPosition.addScaledVector(data.tangent, livingMotion);

      tempEuler.set(
        time * .22 * data.speed + data.phase * .03,
        time * .28 * data.speed,
        objectState.spin * .35 + data.phase * .02
      );
      tempQuaternionB.setFromEuler(tempEuler);
      tempQuaternion.multiply(tempQuaternionB);

      const pulse = 1 + Math.sin(time * 1.1 + data.phase) *
        (.025 + .045 * objectState.energy);
      tempScale.set(
        data.scale * pulse * (1 + objectState.energy * .06),
        data.scale * pulse,
        data.scale * pulse
      );
      tempObject.position.copy(tempPosition);
      tempObject.quaternion.copy(tempQuaternion);
      tempObject.scale.copy(tempScale);
      tempObject.updateMatrix();
      shardMesh.setMatrixAt(index, tempObject.matrix);
    }
    shardMesh.instanceMatrix.needsUpdate = true;
  }

  function setObjectHover(next) {
    if (next === isObjectHover || !shardMesh) return;
    isObjectHover = next;
    stage.classList.toggle("object-hover", next);
    cursor.classList.toggle("is-object", next);
    if (next) {
      stage.classList.remove("authority-active");
      gsap.to(authorityState, {
        value: .08,
        speed: 0,
        hold: 0,
        duration: .45,
        ease: "power3.out"
      });
    } else if (pointerReady) {
      stage.classList.add("authority-active");
    }
    clearTimeout(hoverMorphTimer);
    interactionTimeline?.kill();

    if (next) {
      cursorLabel.textContent = "Decompose / 点击换形";
      cursorLabel.style.opacity = "1";
      objectPrompt.textContent = "Surface unstable / decomposition";
      phaseStatus.textContent = "Decomposing into related form";
      stage.style.setProperty("--energy", "1");
      if (backgroundMaterial) {
        gsap.to(backgroundMaterial.uniforms.uLens, {
          value: 1.15,
          duration: .5,
          ease: "power3.out"
        });
        gsap.to(backgroundMaterial.uniforms.uExposure, {
          value: visualStates[activeWork].exposure + .07,
          duration: .55,
          ease: "power2.out"
        });
      }

      const hoverForms = [1, 2, 3, 2, 1];
      const targetForm = hoverForms[activeWork];
      interactionTimeline = gsap.timeline();
      interactionTimeline
        .to(objectState, {
          hover: 1,
          energy: 1,
          explode: 1,
          duration: .48,
          ease: materialEase.exit
        })
        .to(ringState, {
          spread: .78,
          aperture: .92,
          twist: ringState.twist + 1.05,
          duration: .48,
          ease: materialEase.exit
        }, "<")
        .add(() => {
          objectHalo.material.color.set(0xb9e3e5);
        })
        .add(() => {
          phaseCode.textContent = "Reassembly";
          phaseStatus.textContent = formLabels[Math.round(targetForm)];
        })
        .to(objectState, {
          form: targetForm,
          explode: .12,
          spin: objectState.spin + 1,
          duration: .9,
          ease: materialEase.standard
        })
        .to(ringState, {
          spread: .18,
          aperture: .48,
          duration: .9,
          ease: materialEase.standard
        }, "<");
    } else {
      cursorLabel.style.opacity = "0";
      objectPrompt.textContent = "Approach / begin decomposition";
      phaseCode.textContent = `Form ${String(Math.round(currentBaseForm) + 1).padStart(2, "0")}`;
      phaseStatus.textContent = visualStates[activeWork].phaseName;
      stage.style.setProperty("--energy", String(.2 + currentBaseExplode));
      if (backgroundMaterial) {
        gsap.to(backgroundMaterial.uniforms.uLens, {
          value: visualStates[activeWork].lens,
          duration: .85,
          ease: "power2.out"
        });
        gsap.to(backgroundMaterial.uniforms.uExposure, {
          value: visualStates[activeWork].exposure,
          duration: .8,
          ease: "power2.out"
        });
      }

      interactionTimeline = gsap.timeline();
      interactionTimeline
        .to(objectState, {
          explode: .88,
          energy: .75,
          duration: .3,
          ease: materialEase.exit
        })
        .to(ringState, {
          spread: .66,
          aperture: .74,
          duration: .3,
          ease: materialEase.exit
        }, "<")
        .add(() => {
          objectHalo.material.color.set(0xaacdd0);
        })
        .to(objectState, {
          form: currentBaseForm,
          duration: .66,
          ease: materialEase.standard
        })
        .to(objectState, {
          explode: currentBaseExplode,
          energy: .28,
          hover: 0,
          duration: .58,
          ease: materialEase.enter
        })
        .to(ringState, {
          spread: 0,
          aperture: 0,
          duration: .58,
          ease: materialEase.enter
        }, "<");
    }
  }

  function cycleObjectForm() {
    if (!shardMesh || reducedMotion) return;
    interactionTimeline?.kill();
    const nextForm = (Math.round(objectState.form) + 1) % 4;
    phaseCode.textContent = "Manual morph";
    phaseStatus.textContent = formLabels[nextForm];
    interactionTimeline = gsap.timeline();
    interactionTimeline
      .to(objectState, {
        explode: 1.15,
        energy: 1,
        duration: .34,
        ease: materialEase.exit
      })
      .to(ringState, {
        spread: .9,
        aperture: 1,
        twist: ringState.twist + 1.55,
        duration: .34,
        ease: materialEase.exit
      }, "<")
      .add(() => {
        objectHalo.material.color.set(nextForm === 2 ? 0xe4bd80 : 0xb9e3e5);
      })
      .to(objectState, {
        form: nextForm,
        spin: objectState.spin + 1.4,
        duration: .75,
        ease: materialEase.standard
      })
      .to(objectState, {
        explode: .18,
        energy: .82,
        duration: .62,
        ease: materialEase.enter
      })
      .to(ringState, {
        spread: .12,
        aperture: .44,
        duration: .62,
        ease: materialEase.enter
      }, "<");
    pulseBackground(pointerUv.x, pointerUv.y, .75);
  }

  function pulseBackground(x, y, strength = 1) {
    if (!backgroundMaterial || reducedMotion) return;
    backgroundMaterial.uniforms.uRippleCenter.value.set(x, y);
    gsap.killTweensOf(rippleState);
    rippleState.value = strength;
    backgroundMaterial.uniforms.uRipple.value = strength;
    gsap.to(rippleState, {
      value: 0,
      duration: 1.45,
      ease: "expo.out",
      onUpdate: () => {
        backgroundMaterial.uniforms.uRipple.value = rippleState.value;
      }
    });
    gsap.fromTo(backgroundRipple, {
      x: x * viewportWidth(),
      y: (1 - y) * viewportHeight(),
      scale: .2,
      opacity: .8
    }, {
      scale: 9,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out"
    });
  }

  function pulseObjectScreen() {
    if (!objectGroup || !objectCamera) return;
    const projected = objectGroup.position.clone().project(objectCamera);
    const x = (projected.x * .5 + .5) * viewportWidth();
    const y = (-projected.y * .5 + .5) * viewportHeight();
    gsap.fromTo(shockwave, {
      x,
      y,
      scale: .2,
      opacity: .9
    }, {
      scale: 7,
      opacity: 0,
      duration: 1.1,
      ease: "power2.out"
    });
  }

  function renderThree() {
    if (!renderer) return;
    const time = clock.getElapsedTime();
    pointerSmooth.lerp(pointer, .045);
    pointerUvSmooth.lerp(pointerUv, authorityState.hold ? .28 : .09);

    if (backgroundReady && backgroundMaterial) {
      backgroundMaterial.uniforms.uTime.value = time;
      backgroundMaterial.uniforms.uMouse.value.copy(pointerUvSmooth);
      backgroundMaterial.uniforms.uScroll.value = travelProgress;
      backgroundMaterial.uniforms.uVelocity.value +=
        (scrollVelocity - backgroundMaterial.uniforms.uVelocity.value) * .08;
      backgroundMaterial.uniforms.uAuthority.value +=
        (authorityState.value - backgroundMaterial.uniforms.uAuthority.value) * .12;
      backgroundMaterial.uniforms.uPointerSpeed.value +=
        (authorityState.speed - backgroundMaterial.uniforms.uPointerSpeed.value) * .18;
      backgroundMaterial.uniforms.uHold.value +=
        (authorityState.hold - backgroundMaterial.uniforms.uHold.value) * .14;
    }

    const mobile = isCompactViewport();
    const targetX = mobile ? 0 : objectTarget.x;
    const targetY = mobile ? -.48 : objectTarget.y;
    const autonomousX = Math.sin(time * .43 + activeWork * .7) * (mobile ? .035 : .085);
    const autonomousY = Math.sin(time * .61 + .8) * (mobile ? .045 : .11);
    const autonomousDepth = Math.cos(time * .37 + activeWork) * .07;
    objectGroup.position.x +=
      (targetX + autonomousX +
        pointerSmooth.x * (isObjectHover ? .22 : .045) - objectGroup.position.x) * .045;
    objectGroup.position.y +=
      (targetY + autonomousY +
        pointerSmooth.y * (isObjectHover ? .15 : .035) - objectGroup.position.y) * .045;
    objectGroup.position.z +=
      (objectTarget.z + autonomousDepth - objectGroup.position.z) * .045;
    const mobileScale = mobile ? .72 : 1;
    const autonomousBreath = 1 + Math.sin(time * .92) * .045;
    const scale = objectTarget.scale * mobileScale * autonomousBreath *
      (1 + objectState.energy * .035);
    objectGroup.scale.setScalar(scale);
    objectGroup.rotation.x += .0015 + objectState.energy * .0012;
    objectGroup.rotation.y += .0022 + objectState.energy * .0016;
    objectGroup.rotation.z = Math.sin(time * .28 + activeWork) * .12;

    updateShardInstances(time);
    updateArmillary(time);
    updateObjectHalo(time);
    core.rotation.x = time * .18;
    core.rotation.y = -time * .23;
    const corePulse = .9 + Math.sin(time * 1.25) * .08 + objectState.energy * .2;
    core.scale.setScalar(corePulse);
    core.material.emissiveIntensity = .65 + objectState.energy * 1.4;
    coreGlow.material.opacity = .24 + objectState.energy * .24;
    coreGlow.scale.setScalar(.62 + objectState.energy * .42);
    orbitLines.forEach((line, index) => {
      line.rotation.z += .0006 * (index + 1) * (1 + objectState.energy * 3);
      line.material.opacity = .04 + objectState.energy * .12;
    });

    warmLight.intensity = 18 + objectState.energy * 19;
    coldLight.intensity = 16 + objectState.energy * 14;
    updateTravelDust(time);
    travelDust.rotation.z = travelProgress * .06 + time * .012;

    if (pointerReady && experienceEntered) {
      objectScene.updateMatrixWorld(true);
      raycaster.setFromCamera(pointer, objectCamera);
      setObjectHover(raycaster.intersectObject(hitTarget, false).length > 0);
    }

    objectCamera.position.x += (pointerSmooth.x * .045 - objectCamera.position.x) * .04;
    objectCamera.position.y += (pointerSmooth.y * .03 - objectCamera.position.y) * .04;

    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    if (backgroundReady) {
      renderer.render(backgroundScene, backgroundCamera);
      renderer.clearDepth();
    }
    renderer.render(objectScene, objectCamera);
  }

  function resizeThree() {
    if (!renderer || !objectCamera) return;
    const width = viewportWidth();
    const height = viewportHeight();
    objectCamera.aspect = width / height;
    objectCamera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCompactViewport() ? 1.35 : 1.7));
    renderer.setSize(width, height);
    if (backgroundMaterial) {
      backgroundMaterial.uniforms.uResolution.value.set(width, height);
    }
  }

  function buildLetterController(element, radius, strength) {
    element.dataset.glyph = element.textContent;
    element.style.setProperty("--proximity", "0");
    return {
      element,
      radius,
      strength,
      xTo: gsap.quickTo(element, "x", { duration: .6, ease: "power3" }),
      yTo: gsap.quickTo(element, "y", { duration: .6, ease: "power3" }),
      rotateTo: gsap.quickTo(element, "rotation", { duration: .6, ease: "power3" }),
      scaleTo: gsap.quickTo(element, "scale", { duration: .55, ease: "power3" })
    };
  }

  function buildLetterControllers() {
    heroLetterControllers = [...document.querySelectorAll(".hero-char i")]
      .map((element) => buildLetterController(element, 190, 14));
    workLetterControllers = [...document.querySelectorAll(".work-letter")]
      .map((element) => buildLetterController(element, 135, 9));
  }

  function buildMagneticControllers() {
    magneticControllers = [...document.querySelectorAll(".brand, .index-trigger, .enter-work")].map((element) => ({
      element,
      xTo: gsap.quickTo(element, "x", { duration: .55, ease: "power3" }),
      yTo: gsap.quickTo(element, "y", { duration: .55, ease: "power3" })
    }));
  }

  function updateTextResponse(clientX, clientY) {
    [...heroLetterControllers, ...workLetterControllers].forEach((controller) => {
      const rect = controller.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - clientX;
      const dy = centerY - clientY;
      const distance = Math.hypot(dx, dy);
      const force = distance < controller.radius ? 1 - distance / controller.radius : 0;
      const angle = Math.atan2(dy, dx);
      controller.xTo(Math.cos(angle) * force * controller.strength);
      controller.yTo(Math.sin(angle) * force * controller.strength);
      controller.rotateTo(Math.cos(angle) * force * 3.6);
      controller.scaleTo(1 + force * .085);
      controller.element.style.setProperty("--proximity", force.toFixed(3));
    });

    magneticControllers.forEach((controller) => {
      const rect = controller.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const force = distance < 120 ? 1 - distance / 120 : 0;
      controller.xTo(dx * force * .12);
      controller.yTo(dy * force * .12);
    });
  }

  function enterExperience() {
    if (experienceEntered || entryGate.dataset.state === "entering") return;
    entryGate.dataset.state = "entering";
    entryGate.style.pointerEvents = "none";
    const entryCharacters = [...entryGate.querySelectorAll(".entry-title-line i")];
    const fieldLines = [...entryGate.querySelectorAll(".entry-field i")];
    const timeline = gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => {
        experienceEntered = true;
        document.body.classList.add("experience-entered");
        entryGate.setAttribute("aria-hidden", "true");
        lenis?.start();
        revealMainLayout();
        gsap.fromTo(objectState, {
          energy: 1,
          explode: .46
        }, {
          energy: .28,
          explode: currentBaseExplode,
          duration: 1.25,
          ease: materialEase.enter
        });
        gsap.fromTo(ringState, {
          spread: .82,
          aperture: 1,
          twist: ringState.twist + 1.2
        }, {
          spread: 0,
          aperture: 0,
          duration: 1.4,
          ease: materialEase.enter
        });
      }
    });

    timeline
      .to(".entry-axis i", {
        scaleX: 0,
        duration: .34,
        ease: materialEase.exit
      }, 0)
      .to(".entry-axis span, .entry-code span", {
        opacity: 0,
        duration: .3,
        stagger: .045,
        ease: materialEase.exit
      }, .04)
      .to(fieldLines[0], {
        scaleX: 0,
        transformOrigin: "right",
        duration: .66,
        ease: materialEase.standard
      }, .05)
      .to(fieldLines[1], {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: .74,
        ease: materialEase.standard
      }, .12)
      .to(fieldLines[2], {
        xPercent: -108,
        opacity: 0,
        duration: .72,
        ease: materialEase.exit
      }, .18)
      .to(fieldLines[3], {
        yPercent: 110,
        opacity: 0,
        duration: .62,
        ease: materialEase.exit
      }, .24);

    entryCharacters.forEach((character, index) => {
      const exits = [
        { y: -110, x: -18, rotate: -7 },
        { x: 132, y: -20, rotate: 9 },
        { scale: 1.8, filter: "blur(16px)" },
        { y: 100, x: 38, rotate: -5 }
      ];
      timeline.to(character, {
        ...exits[index],
        opacity: 0,
        duration: .68 + index * .06,
        ease: index < 2 ? materialEase.exit : materialEase.sharp
      }, .14 + index * .055);
    });

    timeline
      .to(".entry-title small", {
        x: 74,
        opacity: 0,
        duration: .42,
        ease: materialEase.exit
      }, .18)
      .to(entryGate, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.05,
        ease: materialEase.standard
      }, .66);
  }

  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger) {
      loader.style.display = "none";
      fallback.classList.add("is-visible");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    stage.classList.add("layout-0");

    if (window.Lenis && !reducedMotion) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        anchors: true
      });
      lenis.on("scroll", (event) => {
        scrollVelocity = event.velocity;
        ScrollTrigger.update();
      });
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }

    ScrollTrigger.create({
      trigger: voyage,
      start: "top top",
      end: "bottom bottom",
      scrub: reducedMotion ? false : .78,
      onUpdate: (self) => {
        travelProgress = self.progress;
        stage.classList.toggle("has-work", self.progress > .085);
        const normalized = clamp((self.progress - .08) / .92, 0, .999);
        const index = Math.min(works.length - 1, Math.floor(normalized * works.length));
        if (index !== activeWork) setActiveWork(index, true);
        else if (self.progress > .085) revealWork(index);
        gsap.set("#progressLine", { scaleX: self.progress });
      }
    });

    gsap.to("#hero", {
      y: -76,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: voyage,
        start: "top top",
        end: "15% top",
        scrub: .72
      }
    });

    gsap.from(".boundary > *", {
      y: (index) => index % 2 ? 54 : 30,
      x: (index) => index % 2 ? 0 : 42,
      opacity: 0,
      filter: (index) => index === 1 ? "blur(12px)" : "blur(0px)",
      duration: 1,
      stagger: .13,
      ease: materialEase.enter,
      scrollTrigger: {
        trigger: "#boundary",
        start: "top 75%",
        once: true
      }
    });

    gsap.timeline({
      onComplete: () => loader.setAttribute("aria-hidden", "true")
    })
      .to("#loaderLine", {
        scaleX: 1,
        duration: .72,
        ease: materialEase.standard
      })
      .to(loader, {
        yPercent: -100,
        duration: .78,
        ease: materialEase.standard
      });
  }

  function bindEvents() {
    const cursorX = gsap.quickTo(cursor, "x", { duration: .16, ease: "power3" });
    const cursorY = gsap.quickTo(cursor, "y", { duration: .16, ease: "power3" });
    const labelX = gsap.quickTo(cursorLabel, "x", { duration: .2, ease: "power3" });
    const labelY = gsap.quickTo(cursorLabel, "y", { duration: .2, ease: "power3" });
    const authorityX = gsap.quickTo(authorityField, "x", { duration: .28, ease: "power3" });
    const authorityY = gsap.quickTo(authorityField, "y", { duration: .28, ease: "power3" });

    window.addEventListener("pointermove", (event) => {
      pointerReady = true;
      const width = viewportWidth();
      const height = viewportHeight();
      pointer.x = event.clientX / width * 2 - 1;
      pointer.y = -(event.clientY / height * 2 - 1);
      pointerUv.set(event.clientX / width, 1 - event.clientY / height);
      const speed = pointerUv.distanceTo(previousPointer);
      previousPointer.copy(pointerUv);
      cursor.style.opacity = "1";
      cursorX(event.clientX);
      cursorY(event.clientY);
      labelX(event.clientX);
      labelY(event.clientY);
      authorityX(event.clientX);
      authorityY(event.clientY);
      if (!experienceEntered) return;
      updateTextResponse(event.clientX, event.clientY);

      stage.classList.add("background-awake");
      clearTimeout(backgroundAwakeTimer);
      backgroundAwakeTimer = setTimeout(() => stage.classList.remove("background-awake"), 650);

      if (backgroundMaterial && !isObjectHover) {
        const overInterface = Boolean(event.target.closest("button, .memory-overlay, .index-overlay"));
        if (!overInterface) {
          stage.classList.add("authority-active");
          gsap.to(authorityState, {
            value: clamp(.24 + speed * 11, .24, .86),
            speed: clamp(speed * 18, 0, 1),
            duration: .18,
            ease: "power2.out",
            overwrite: true
          });
          clearTimeout(authorityState.decayTimer);
          authorityState.decayTimer = setTimeout(() => {
            if (!authorityState.hold && !isObjectHover) {
              gsap.to(authorityState, {
                value: .18,
                speed: 0,
                duration: .85,
                ease: "power3.out"
              });
            }
          }, 150);
        }

        const baseLens = visualStates[activeWork].lens;
        gsap.to(backgroundMaterial.uniforms.uLens, {
          value: Math.min(1.2, baseLens + .28 + speed * 5),
          duration: .22,
          ease: "power2.out",
          overwrite: true
        });
        clearTimeout(backgroundMaterial.userData?.lensTimer);
        backgroundMaterial.userData = backgroundMaterial.userData || {};
        backgroundMaterial.userData.lensTimer = setTimeout(() => {
          if (!isObjectHover) {
            gsap.to(backgroundMaterial.uniforms.uLens, {
              value: baseLens,
              duration: 1.1,
              ease: "power2.out"
            });
          }
        }, 180);
      }
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      cursor.style.opacity = "0";
      cursorLabel.style.opacity = "0";
      pointerReady = false;
      setObjectHover(false);
      stage.classList.remove("authority-active");
      gsap.to(authorityState, {
        value: 0,
        speed: 0,
        hold: 0,
        duration: .8,
        ease: "power3.out"
      });
    });

    window.addEventListener("pointerdown", (event) => {
      if (
        !experienceEntered ||
        event.button !== 0 ||
        isObjectHover ||
        event.target.closest("button") ||
        indexOverlay.classList.contains("is-open") ||
        memoryOverlay.classList.contains("is-open")
      ) {
        return;
      }
      stage.classList.add("authority-active");
      gsap.to(authorityState, {
        value: 1,
        speed: 1,
        hold: 1,
        duration: .22,
        ease: "power3.out",
        overwrite: true
      });
      pulseBackground(pointerUv.x, pointerUv.y, 1.35);
    });

    window.addEventListener("pointerup", () => {
      if (!experienceEntered) return;
      if (!authorityState.hold) return;
      gsap.to(authorityState, {
        value: .28,
        speed: .08,
        hold: 0,
        duration: .95,
        ease: "expo.out",
        overwrite: true
      });
    });

    window.addEventListener("click", (event) => {
      if (!experienceEntered) return;
      if (event.target.closest("button") || indexOverlay.classList.contains("is-open") || memoryOverlay.classList.contains("is-open")) {
        return;
      }
      if (isObjectHover) {
        cycleObjectForm();
        pulseObjectScreen();
      } else {
        pulseBackground(pointerUv.x, pointerUv.y, 1.4);
        gsap.fromTo(authorityState, {
          value: 1,
          speed: 1
        }, {
          value: .22,
          speed: 0,
          duration: 1.25,
          ease: "expo.out",
          overwrite: true
        });
      }
    });

    window.addEventListener("resize", () => {
      resizeThree();
      buildLetterControllers();
      buildMagneticControllers();
      window.ScrollTrigger?.refresh();
    });

    document.getElementById("homeButton").addEventListener("click", () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.35 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.getElementById("indexTrigger").addEventListener("click", (event) => openIndex(event.currentTarget));
    document.getElementById("indexClose").addEventListener("click", () => closeIndex(true));
    document.getElementById("enterWork").addEventListener("click", (event) => openMemory(event.currentTarget));
    document.getElementById("memoryClose").addEventListener("click", closeMemory);
    entryGate.addEventListener("click", enterExperience);
    window.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (memoryOverlay.classList.contains("is-open")) closeMemory();
      else if (indexOverlay.classList.contains("is-open")) closeIndex(true);
    });
  }

  function init() {
    if (!window.THREE || !window.gsap || !window.ScrollTrigger) {
      loader.style.display = "none";
      fallback.classList.add("is-visible");
      return;
    }
    buildInterface();
    prepareRevealSystem();
    initThree();
    initMotion();
    buildLetterControllers();
    buildMagneticControllers();
    bindEvents();
  }

  window.addEventListener("load", init, { once: true });
  setTimeout(() => {
    if (!window.THREE || !window.gsap) {
      loader.style.display = "none";
      fallback.classList.add("is-visible");
    }
  }, 5000);
})();
