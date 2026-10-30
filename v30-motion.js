(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      state.dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 720 ? 1.15 : 1.5);
      state.width = Math.max(1, window.innerWidth);
      state.height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.width, state.height);
    }

    function spawn(x, y, burst = false) {
      if (!document.body.classList.contains("experience-entered")) return;
      const dx = x - state.lastX;
      const dy = y - state.lastY;
      const speed = clamp(Math.hypot(dx, dy) / 58, .16, 1.8);
      const count = burst ? 14 : Math.ceil(2 + speed * 3);
      for (let i = 0; i < count; i += 1) {
        const angle = Math.atan2(dy || Math.random() - .5, dx || Math.random() - .5) + (Math.random() - .5) * (burst ? 1.1 : .52);
        const force = (burst ? 5.8 : 2.6) * speed * (.55 + Math.random() * .7);
        state.traces.push({
          x: x + (Math.random() - .5) * 14,
          y: y + (Math.random() - .5) * 14,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force,
          burst,
          life: 52 + Math.random() * 46,
          maxLife: 84,
          radius: (burst ? 10 : 6) + Math.random() * (burst ? 18 : 9),
          length: (burst ? 46 : 28) + Math.random() * (burst ? 72 : 42),
          color: state.palette[(i + state.traces.length) % state.palette.length],
          phase: Math.random() * Math.PI * 2
        });
      }
      if (state.traces.length > 360) state.traces.splice(0, state.traces.length - 360);
    }

    function draw() {
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
        const alpha = Math.sin(k * Math.PI) * (p.burst ? .12 : .075);
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
        for (let step = 0; step < 5; step += 1) {
          const t = step / 4;
          const px = p.x + (x2 - p.x) * t + Math.sin(p.phase + step) * 3.2;
          const py = p.y + (y2 - p.y) * t + Math.cos(p.phase + step) * 2.4;
          const radius = p.radius * (1.25 + t * 2.8);
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

      requestAnimationFrame(draw);
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
    draw();
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

    const state = { width: 1, height: 1, dpr: 1, flakes: [], time: 0 };

    function resize() {
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.4);
      state.width = Math.max(1, window.innerWidth);
      state.height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      const count = Math.floor((state.width * state.height) / 3600);
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

    function draw() {
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
      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    draw();
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

    const state = { width: 1, height: 1, dpr: 1, particles: [], mx: .5, my: .5, time: 0 };

    function resize() {
      const rect = stage.getBoundingClientRect();
      state.width = Math.max(1, rect.width);
      state.height = Math.max(1, rect.height);
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.4);
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      state.particles = Array.from({ length: 320 }, (_, i) => {
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

    function draw() {
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

    const state = { width: 1, height: 1, dpr: 1, mx: .62, my: .48, time: 0 };

    function resize() {
      const rect = stage.getBoundingClientRect();
      state.width = Math.max(1, rect.width);
      state.height = Math.max(1, rect.height);
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.35);
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

    function draw() {
      state.time += .014;
      ctx.clearRect(0, 0, state.width, state.height);
      const breath = .72 + Math.sin(state.time * .86) * .28;
      const centerY = state.height * (.46 + (state.my - .5) * .12);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 7; i += 1) {
        drawBeam(centerY + (i - 3) * (17 + Math.sin(state.time + i) * 4), breath * (1 - Math.abs(i - 3) * .105), i * .7);
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
      signature.classList.toggle("is-traditional", mode === "traditional");
      text.textContent = mode === "traditional" ? "吳翔宇" : mode === "simple" ? "吴翔宇" : "wxy";
    };
    signature.addEventListener("pointermove", (event) => {
      const rect = signature.getBoundingClientRect();
      signature.style.setProperty("--name-x", `${event.clientX - rect.left}px`);
      signature.style.setProperty("--name-y", `${event.clientY - rect.top}px`);
    }, { passive: true });
    signature.addEventListener("mouseenter", () => setMode("simple"));
    signature.addEventListener("click", () => setMode("traditional"));
    signature.addEventListener("mouseleave", () => setMode("latin"));
  }

  function initCountdownPrelude() {
    const prelude = document.getElementById("countdownPrelude");
    const number = document.getElementById("countdownNumber");
    if (!prelude || !number) return;
    const values = ["03", "02", "01"];
    let index = 0;
    function tick() {
      number.textContent = values[index];
      number.classList.remove("is-ticking");
      void number.offsetWidth;
      number.classList.add("is-ticking");
      index += 1;
      if (index < values.length) {
        window.setTimeout(tick, 720);
      } else {
        window.setTimeout(() => {
          prelude.classList.add("is-hidden");
          window.setTimeout(() => prelude.remove(), 760);
        }, 640);
      }
    }
    window.setTimeout(tick, 280);
    prelude.addEventListener("click", () => {
      prelude.classList.add("is-hidden");
      window.setTimeout(() => prelude.remove(), 500);
    });
  }

  function initParticleTitles() {
    const applyTitle = (title) => {
      if (title.querySelector(".hero-char")) return;
      if (title.dataset.v27ParticleReady === "true") return;
      if (!title.textContent.trim()) return;
      title.dataset.v27ParticleReady = "true";
      const originalText = title.textContent;
      title.dataset.simpleText = originalText;
      title.dataset.traditionalText = [...originalText].map((char) => glyphMap.get(char) || char).join("");
      title.classList.add("particle-title");
      title.innerHTML = "";
      [...originalText].forEach((char, index) => {
        const span = document.createElement("span");
        span.className = "glyph-unit";
        span.textContent = char === " " ? "\u00a0" : char;
        span.dataset.simple = char;
        span.dataset.traditional = glyphMap.get(char) || char;
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
        title.classList.add("is-traditional");
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

  function initHeroTraditionalGlyphs() {
    const heroTitle = document.querySelector(".hero h1");
    if (!heroTitle || heroTitle.dataset.v27TraditionalReady === "true") return;
    heroTitle.dataset.v27TraditionalReady = "true";
    const letters = [...heroTitle.querySelectorAll(".hero-char i")];
    letters.forEach((letter) => {
      const simple = letter.textContent;
      letter.dataset.simple = simple;
      letter.dataset.traditional = glyphMap.get(simple) || simple;
    });
    heroTitle.addEventListener("mouseenter", () => {
      heroTitle.classList.add("is-traditional");
      letters.forEach((letter) => {
        letter.textContent = letter.dataset.traditional;
      });
    });
    heroTitle.addEventListener("mouseleave", () => {
      heroTitle.classList.remove("is-traditional");
      letters.forEach((letter) => {
        letter.textContent = letter.dataset.simple;
      });
    });
  }

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
      const image = panel.querySelector("img");
      const label = panel.querySelector(".ag-panel__text");
      if (image) image.src = frames[index % frames.length];
      if (label) label.textContent = demoItems[index % demoItems.length].label;
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
      panel.addEventListener("click", () => setActive(index));
    });
    setActive(active);
  }

  function initMorphFlow() {
    const root = document.getElementById("morphFlow");
    if (!root) return;
    root.innerHTML = "";
    demoItems.forEach((item, index) => {
      const image = document.createElement("img");
      image.src = frames[index];
      image.alt = item.label;
      image.className = index === 0 ? "is-active" : "";
      root.appendChild(image);
    });
    const caption = document.createElement("div");
    caption.className = "morph-caption";
    caption.innerHTML = `<small>morph / blur transition</small><strong>${demoItems[0].label}</strong>`;
    root.appendChild(caption);

    const images = [...root.querySelectorAll("img")];
    let index = 0;
    let timer = 0;
    let transitionTimer = 0;

    function show(next) {
      const previous = index;
      index = (next + images.length) % images.length;
      root.classList.add("is-transitioning");
      caption.querySelector("strong").textContent = demoItems[index].label;
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
    root.addEventListener("click", () => {
      show(index + 1);
      schedule();
    });
    if (!reducedMotion) schedule();
  }

  function initCircularGallery() {
    const root = document.getElementById("circularFlow");
    if (!root) return;
    root.innerHTML = "";
    const track = document.createElement("div");
    track.className = "circular-track";
    root.appendChild(track);
    const items = [...demoItems, ...demoItems];
    items.forEach((item, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "circular-card";
      card.innerHTML = `<img src="${frames[index % frames.length]}" alt="${item.label}"><span>${item.label}</span>`;
      track.appendChild(card);
    });

    let target = 0;
    let current = 0;
    let dragging = false;
    let startX = 0;
    let startTarget = 0;

    function layout() {
      current += (target - current) * .06;
      track.style.setProperty("--circle-x", `calc(-50% + ${current.toFixed(2)}px)`);
      const cards = [...track.children];
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
      requestAnimationFrame(layout);
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
    layout();
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
    const apply = () => {
      document.querySelectorAll(selectors.join(",")).forEach((element) => {
        element.classList.add("folder-motion");
      });
    };
    apply();
    const observer = new MutationObserver(apply);
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
      const items = () => [...root.querySelectorAll(selectors.join(","))].filter((item) => root === item || root.contains(item));
      const update = (event) => {
        const rootRect = root.getBoundingClientRect();
        const pointerY = event.clientY - rootRect.top;
        items().forEach((item) => {
          item.classList.add("line-proximity");
          const center = item.offsetTop + item.offsetHeight / 2;
          const distance = Math.abs(pointerY - center);
          const effect = falloff(clamp(1 - distance / 120, 0, 1));
          item.style.setProperty("--line-effect", effect.toFixed(4));
        });
      };
      const leave = () => {
        items().forEach((item) => item.style.setProperty("--line-effect", "0"));
      };
      root.addEventListener("pointermove", update, { passive: true });
      root.addEventListener("pointerleave", leave, { passive: true });
      items().forEach((item) => item.classList.add("line-proximity"));
    };

    const apply = () => {
      [
        document.getElementById("workNav"),
        document.getElementById("workPanel"),
        document.getElementById("indexList"),
        document.getElementById("memorySampleStrip"),
        document.getElementById("chapterLedger"),
        document.querySelector(".boundary-signals")
      ].filter(Boolean).forEach(bind);
      document.querySelectorAll(selectors.join(",")).forEach((item) => item.classList.add("line-proximity"));
    };
    apply();
    new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
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

    function openFrom(source) {
      if (!source || !image || !caption) return;
      const sourceImage = source.matches("img") ? source : source.querySelector("img");
      if (!sourceImage?.src) return;
      const label =
        source.getAttribute("aria-label") ||
        source.querySelector("figcaption, .ag-panel__text, span:last-child")?.textContent?.trim() ||
        sourceImage.alt ||
        "Image memory";
      image.src = sourceImage.src;
      image.alt = sourceImage.alt || label;
      caption.textContent = label;
      overlay.classList.remove("is-open");
      void overlay.offsetWidth;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      if (window.triggerPixelSwap) window.triggerPixelSwap();
    }

    function closePopout() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }

    document.addEventListener("click", (event) => {
      const target = event.target;
      const source = target.closest?.(".ag-panel, .circular-card, .morph-flow, .image-chapter figure, .memory-image, .memory-fragments figure, .atlas-strip img");
      if (!source || source.closest(".image-popout")) return;
      openFrom(source);
    });
    close?.addEventListener("click", closePopout);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closePopout();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePopout();
    });
  }

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

  function initEntryLiveField() {
    const clock = document.getElementById("entryClock");
    const flux = document.getElementById("entryFlux");
    const coord = document.getElementById("entryCoord");
    if (!clock || !flux || !coord) return;
    let tick = 0;
    function render() {
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

  function init() {
    initEntryLiveField();
    initGlobalMotionClass();
    initCountdownPrelude();
    initPixelSnow();
    initBreathingParticles();
    initLaserFlowStage();
    initLightflowCursor();
    initVoidObjectShell();
    initWxySignature();
    initAccordionGallery();
    initMorphFlow();
    initCircularGallery();
    initParticleTitles();
    initHeroTraditionalGlyphs();
    initPixelSwapTransition();
    initLogoLoop();
    initFolderMotion();
    initLineSidebarMotion();
    initImageCardPopout();
    initChapterImageMotion();
    initChapterToneFlow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
