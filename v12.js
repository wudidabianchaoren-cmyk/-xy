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

  const viewportWidth = () =>
    Math.round(window.visualViewport?.width || document.documentElement.clientWidth || window.innerWidth);
  const viewportHeight = () =>
    Math.round(window.visualViewport?.height || document.documentElement.clientHeight || window.innerHeight);
  const isCompactViewport = () =>
    window.matchMedia("(max-width: 720px)").matches || viewportWidth() < 720;

  const stage = document.getElementById("stage");
  const voyage = document.getElementById("voyage");
  const loader = document.getElementById("loader");
  const workNav = document.getElementById("workNav");
  const indexOverlay = document.getElementById("indexOverlay");
  const memoryOverlay = document.getElementById("memoryOverlay");
  const cursor = document.getElementById("cursor");
  const cursorLabel = document.getElementById("cursorLabel");
  const shockwave = document.getElementById("shockwave");
  const backgroundRipple = document.getElementById("backgroundRipple");
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
  let travelDust;
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

    void main() {
      vec2 screenUv = vUv;
      vec2 uv = coverUv(screenUv);
      float aspect = uResolution.x / uResolution.y;
      float breath = sin(uTime * .24 + uPhase) * .5 + .5;

      uv = (uv - .5) * (1.0 - uScroll * .034 - breath * .0025) + .5;
      uv.x += uScroll * .011;
      uv.y += sin(uv.x * 4.0 + uTime * .17 + uPhase) * .0018;

      vec2 mouseDelta = screenUv - uMouse;
      mouseDelta.x *= aspect;
      float mouseDistance = length(mouseDelta);
      vec2 mouseDirection = normalize(mouseDelta + vec2(.0001));
      float lensField = exp(-mouseDistance * mouseDistance * 15.0) * uLens;
      uv -= mouseDirection * lensField * (.012 + abs(uVelocity) * .00016);

      vec2 rippleDelta = screenUv - uRippleCenter;
      rippleDelta.x *= aspect;
      float rippleDistance = length(rippleDelta);
      float ring = sin(rippleDistance * 62.0 - uTime * 5.4) * exp(-rippleDistance * 5.2) * uRipple;
      uv += normalize(rippleDelta + vec2(.0001)) * ring * .006;

      float velocityOffset = clamp(abs(uVelocity) * .000025, 0.0, .0025);
      float chroma = lensField * .004 + velocityOffset;
      vec2 chromaDirection = mouseDirection * chroma;
      vec3 centerSample = texture2D(uTexture, clamp(uv, vec2(.001), vec2(.999))).rgb;
      float redSample = texture2D(uTexture, clamp(uv + chromaDirection, vec2(.001), vec2(.999))).r;
      float blueSample = texture2D(uTexture, clamp(uv - chromaDirection, vec2(.001), vec2(.999))).b;
      vec3 color = vec3(redSample, centerSample.g, blueSample);

      float pulseLight = lensField * .08 + abs(ring) * .12;
      color *= uTint * uExposure * (1.0 + breath * .026 + pulseLight);

      float vignette = smoothstep(.48, 1.05, length((screenUv - .5) * vec2(.9, 1.0)));
      color *= 1.0 - vignette * .12;
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

  function setWorkTitle(text, animate) {
    const title = document.getElementById("workTitle");
    title.setAttribute("aria-label", text);
    title.innerHTML = [...text].map((character) => `<span class="work-letter">${character}</span>`).join("");
    buildLetterControllers();
    if (animate && !reducedMotion) {
      gsap.fromTo(title.querySelectorAll(".work-letter"), {
        yPercent: 115,
        rotate: 5,
        opacity: 0
      }, {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration: .72,
        stagger: .055,
        ease: "power4.out"
      });
    }
  }

  function setActiveWork(index, animate = true) {
    if (index === activeWork && animate) return;
    activeWork = index;
    const work = works[index];
    const state = visualStates[index];

    [...workNav.children].forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });

    const updateText = () => {
      document.getElementById("workSequence").textContent =
        `Signal ${String(index + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}`;
      setWorkTitle(work.cn, animate);
      document.getElementById("workMeta").textContent = `${work.en} / ${work.type}`;
    };

    if (!animate || reducedMotion || !window.gsap) {
      updateText();
    } else {
      gsap.to("#workPanel", {
        y: 18,
        autoAlpha: 0,
        duration: .24,
        ease: "power2.in",
        onComplete: () => {
          updateText();
          gsap.fromTo("#workPanel", { y: -18 }, {
            y: 0,
            autoAlpha: 1,
            duration: .58,
            ease: "power3.out"
          });
        }
      });
    }

    stage.classList.remove("layout-0", "layout-1", "layout-2", "layout-3", "layout-4");
    stage.classList.add(`layout-${index}`);
    stage.dataset.work = String(index);
    applyVisualState(state, animate);
  }

  function applyVisualState(state, animate) {
    currentBaseForm = state.form;
    currentBaseExplode = state.explode;
    const duration = animate && !reducedMotion ? .9 : 0;

    gsap.to(objectTarget, {
      ...state.object,
      duration,
      ease: "power3.inOut"
    });

    if (backgroundMaterial) {
      gsap.to(backgroundMaterial.uniforms.uTint.value, {
        x: state.tint[0],
        y: state.tint[1],
        z: state.tint[2],
        duration: duration || .01,
        ease: "power2.inOut"
      });
      gsap.to(backgroundMaterial.uniforms.uExposure, {
        value: state.exposure,
        duration: duration || .01,
        ease: "power2.inOut"
      });
      gsap.to(backgroundMaterial.uniforms.uPhase, {
        value: state.phase,
        duration: duration || .01,
        ease: "power2.inOut"
      });
      if (!isObjectHover) {
        gsap.to(backgroundMaterial.uniforms.uLens, {
          value: state.lens,
          duration: duration || .01,
          ease: "power2.inOut"
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
        ease: "power2.in"
      })
      .to(objectState, {
        form: currentBaseForm,
        duration: animate ? .72 : 0,
        ease: "expo.inOut"
      })
      .to(objectState, {
        explode: currentBaseExplode,
        energy: .28,
        duration: animate ? .56 : 0,
        ease: "power3.out"
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
    memoryOverlay.classList.add("is-open");
    lenis?.stop();

    gsap.timeline()
      .fromTo(memoryOverlay, { clipPath: "inset(100% 0 0 0)" }, {
        clipPath: "inset(0% 0 0 0)",
        duration: reducedMotion ? 0 : .95,
        ease: "power4.inOut"
      })
      .fromTo(".memory-image img", { scale: 1.2, xPercent: -4 }, {
        scale: 1.06,
        xPercent: 0,
        duration: reducedMotion ? 0 : 1.35,
        ease: "power3.out"
      }, reducedMotion ? 0 : "-=.7")
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
            uImageAspect: { value: 1680 / 720 }
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
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < count; index++) {
      const ratio = index / Math.max(1, count - 1);
      const y = 1 - ratio * 2;
      const radial = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * index;
      const shellPulse = .88 + Math.sin(theta * 2.0) * .08;
      const seedPosition = new THREE.Vector3(
        Math.cos(theta) * radial * .72 * shellPulse,
        y * .84,
        Math.sin(theta) * radial * .62 * shellPulse
      );

      const haloBand = index % 2;
      const haloIndex = Math.floor(index / 2);
      const haloCount = Math.ceil(count / 2);
      const angle = haloIndex / haloCount * Math.PI * 2 + haloBand * .1;
      const haloRadius = haloBand ? .78 : 1.06;
      const haloPosition = new THREE.Vector3(
        Math.cos(angle) * haloRadius,
        Math.sin(angle) * haloRadius * (haloBand ? .68 : .72),
        Math.sin(angle * 3 + haloBand) * .18 + (haloBand ? -.12 : .12)
      );

      const petal = index % 6;
      const petalLayer = Math.floor(index / 6);
      const petalAngle = petal / 6 * Math.PI * 2 + petalLayer * .14;
      const petalRadius = .38 + petalLayer * .2;
      const bloomPosition = new THREE.Vector3(
        Math.cos(petalAngle) * petalRadius,
        Math.sin(petalAngle) * petalRadius,
        .18 + Math.sin(petalLayer * .9) * .22
      );
      bloomPosition.x *= 1.18;

      const spiralRatio = index / count;
      const spiralAngle = spiralRatio * Math.PI * 4.5;
      const constellationPosition = new THREE.Vector3(
        (spiralRatio - .5) * 2.15,
        Math.sin(spiralAngle) * .65,
        Math.cos(spiralAngle) * .52
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
    const count = isCompactViewport() ? 40 : 58;
    const geometry = new THREE.OctahedronGeometry(.12, 0);
    geometry.scale(.52, 1.32, .36);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xe3eceb,
      emissive: 0x31555c,
      emissiveIntensity: 1.25,
      roughness: .24,
      metalness: .46,
      clearcoat: 1,
      clearcoatRoughness: .1,
      iridescence: .62,
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
      const scale = .78 + (index % 5) * .065;
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
      if (index % 11 === 0) tempColor.set(0xf0ca91);
      else if (index % 4 === 0) tempColor.set(0xd2e8e8);
      else tempColor.set(0x8db8be);
      shardMesh.setColorAt(index, tempColor);
    }
    shardMesh.instanceColor.needsUpdate = true;

    objectGroup = new THREE.Group();
    objectGroup.add(shardMesh);

    core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(.11, 3),
      new THREE.MeshPhysicalMaterial({
        color: 0x172d32,
        emissive: 0xd7ae79,
        emissiveIntensity: .7,
        roughness: .16,
        metalness: .45,
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
    coreGlow.scale.set(.58, .58, 1);
    objectGroup.add(coreGlow);

    for (let index = 0; index < 2; index++) {
      const curve = new THREE.EllipseCurve(0, 0, 1.02 + index * .2, .55 + index * .08, 0, Math.PI * 2);
      const points = curve.getPoints(150).map((point) => new THREE.Vector3(point.x, point.y, 0));
      const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: index ? 0xd7ae79 : 0xa9c0ca,
          transparent: true,
          opacity: .08,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      line.rotation.x = Math.PI / 2 + index * .55;
      line.rotation.y = index * .7;
      orbitLines.push(line);
      objectGroup.add(line);
    }

    hitTarget = new THREE.Mesh(
      new THREE.SphereGeometry(1.36, 24, 16),
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

  function createTravelDust() {
    const count = isCompactViewport() ? 300 : 620;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index++) {
      positions[index * 3] = (Math.random() - .5) * 15;
      positions[index * 3 + 1] = (Math.random() - .5) * 9;
      positions[index * 3 + 2] = -Math.random() * 20 + 4;
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

  function updateShardInstances(time) {
    if (!shardMesh) return;
    const clampedForm = clamp(objectState.form, 0, 3);
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

      const livingMotion = Math.sin(time * data.speed + data.phase) * (.012 + objectState.energy * .024);
      tempPosition.addScaledVector(data.tangent, livingMotion);

      tempEuler.set(
        time * .08 * data.speed + data.phase * .03,
        time * .12 * data.speed,
        objectState.spin * .35 + data.phase * .02
      );
      tempQuaternionB.setFromEuler(tempEuler);
      tempQuaternion.multiply(tempQuaternionB);

      const pulse = 1 + Math.sin(time * .7 + data.phase) * .035 * objectState.energy;
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
          ease: "power3.in"
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
          ease: "expo.inOut"
        });
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
          ease: "power2.in"
        })
        .to(objectState, {
          form: currentBaseForm,
          duration: .66,
          ease: "expo.inOut"
        })
        .to(objectState, {
          explode: currentBaseExplode,
          energy: .28,
          hover: 0,
          duration: .58,
          ease: "power3.out"
        });
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
        ease: "power3.in"
      })
      .to(objectState, {
        form: nextForm,
        spin: objectState.spin + 1.4,
        duration: .75,
        ease: "expo.inOut"
      })
      .to(objectState, {
        explode: .18,
        energy: .82,
        duration: .62,
        ease: "elastic.out(1, .72)"
      });
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
    pointerUvSmooth.lerp(pointerUv, .05);

    if (backgroundReady && backgroundMaterial) {
      backgroundMaterial.uniforms.uTime.value = time;
      backgroundMaterial.uniforms.uMouse.value.copy(pointerUvSmooth);
      backgroundMaterial.uniforms.uScroll.value = travelProgress;
      backgroundMaterial.uniforms.uVelocity.value +=
        (scrollVelocity - backgroundMaterial.uniforms.uVelocity.value) * .08;
    }

    const mobile = isCompactViewport();
    const targetX = mobile ? 0 : objectTarget.x;
    const targetY = mobile ? -.48 : objectTarget.y;
    objectGroup.position.x +=
      (targetX + pointerSmooth.x * (isObjectHover ? .22 : .045) - objectGroup.position.x) * .045;
    objectGroup.position.y +=
      (targetY + pointerSmooth.y * (isObjectHover ? .15 : .035) - objectGroup.position.y) * .045;
    objectGroup.position.z += (objectTarget.z - objectGroup.position.z) * .045;
    const mobileScale = mobile ? .72 : 1;
    const scale = objectTarget.scale * mobileScale * (1 + objectState.energy * .035);
    objectGroup.scale.setScalar(scale);
    objectGroup.rotation.x += .0013 + objectState.energy * .0018;
    objectGroup.rotation.y += .0018 + objectState.energy * .0025;
    objectGroup.rotation.z = Math.sin(time * .13 + activeWork) * .08;

    updateShardInstances(time);
    core.rotation.x = time * .18;
    core.rotation.y = -time * .23;
    const corePulse = .9 + Math.sin(time * 1.25) * .08 + objectState.energy * .2;
    core.scale.setScalar(corePulse);
    core.material.emissiveIntensity = .65 + objectState.energy * 1.4;
    coreGlow.material.opacity = .24 + objectState.energy * .24;
    coreGlow.scale.setScalar(.48 + objectState.energy * .32);
    orbitLines.forEach((line, index) => {
      line.rotation.z += .0006 * (index + 1) * (1 + objectState.energy * 3);
      line.material.opacity = .04 + objectState.energy * .12;
    });

    warmLight.intensity = 18 + objectState.energy * 19;
    coldLight.intensity = 16 + objectState.energy * 14;
    travelDust.position.z = (travelProgress * 9 + time * .025) % 12;
    travelDust.rotation.z = travelProgress * .06 + time * .006;
    travelDust.material.opacity = .2 + clamp(Math.abs(scrollVelocity) / 90, 0, .28);

    if (pointerReady) {
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
      y: 48,
      opacity: 0,
      duration: 1,
      stagger: .11,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#boundary",
        start: "top 75%"
      }
    });

    gsap.timeline({
      onComplete: () => loader.setAttribute("aria-hidden", "true")
    })
      .to("#loaderLine", { scaleX: 1, duration: .9, ease: "power2.inOut" })
      .to(loader, { yPercent: -100, duration: 1, ease: "power4.inOut" })
      .from(".hero-char i", { yPercent: 112, duration: .95, stagger: .055, ease: "power4.out" }, "-=.62")
      .from(".hero-kicker, .hero-copy", { y: 18, opacity: 0, duration: .68, stagger: .08, ease: "power3.out" }, "-=.68")
      .from("#objectPrompt, .work-nav button, .ambient-status", {
        opacity: 0,
        y: 10,
        duration: .5,
        stagger: .045,
        ease: "power2.out"
      }, "-=.48");
  }

  function bindEvents() {
    const cursorX = gsap.quickTo(cursor, "x", { duration: .16, ease: "power3" });
    const cursorY = gsap.quickTo(cursor, "y", { duration: .16, ease: "power3" });
    const labelX = gsap.quickTo(cursorLabel, "x", { duration: .2, ease: "power3" });
    const labelY = gsap.quickTo(cursorLabel, "y", { duration: .2, ease: "power3" });

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
      updateTextResponse(event.clientX, event.clientY);

      stage.classList.add("background-awake");
      clearTimeout(backgroundAwakeTimer);
      backgroundAwakeTimer = setTimeout(() => stage.classList.remove("background-awake"), 650);

      if (backgroundMaterial && !isObjectHover) {
        const baseLens = visualStates[activeWork].lens;
        gsap.to(backgroundMaterial.uniforms.uLens, {
          value: Math.min(1, baseLens + .18 + speed * 4),
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
    });

    window.addEventListener("click", (event) => {
      if (event.target.closest("button") || indexOverlay.classList.contains("is-open") || memoryOverlay.classList.contains("is-open")) {
        return;
      }
      if (isObjectHover) {
        cycleObjectForm();
        pulseObjectScreen();
      } else {
        pulseBackground(pointerUv.x, pointerUv.y, 1);
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
