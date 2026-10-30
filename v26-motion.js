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
          life: 52 + Math.random() * 46,
          maxLife: 84,
          radius: (burst ? 12 : 7) + Math.random() * (burst ? 20 : 10),
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
        const alpha = Math.sin(k * Math.PI) * .095;
        const [r, g, b] = p.color;
        p.vx *= .982;
        p.vy *= .982;
        p.x += p.vx + Math.sin(p.phase) * .18;
        p.y += p.vy + Math.cos(p.phase) * .14;
        p.phase += .035;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * (1.25 - k * .16));
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        gradient.addColorStop(.42, `rgba(${r}, ${g}, ${b}, ${alpha * .32})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.radius * 2.35, p.radius * .34, p.phase, 0, Math.PI * 2);
        ctx.fill();
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
      const count = Math.floor((state.width * state.height) / 5600);
      state.flakes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        z: Math.random(),
        size: 1 + Math.random() * 2.4,
        speed: .16 + Math.random() * .5,
        drift: (Math.random() - .5) * .42,
        phase: Math.random() * Math.PI * 2,
        square: i % 3 === 0
      }));
    }

    function draw() {
      state.time += .008;
      ctx.clearRect(0, 0, state.width, state.height);
      const breath = .58 + Math.sin(state.time * 1.15) * .24;
      state.flakes.forEach((flake) => {
        flake.x += flake.drift + Math.sin(state.time * 2 + flake.phase) * .09;
        flake.y += flake.speed * (1.1 + flake.z);
        if (flake.y > state.height + 12) flake.y = -12;
        if (flake.x < -12) flake.x = state.width + 12;
        if (flake.x > state.width + 12) flake.x = -12;
        const alpha = (.12 + flake.z * .32) * breath;
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
      ".enter-work"
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
      window.setTimeout(() => folder.classList.remove("is-open"), 560);
    });
  }

  function initChapterImageMotion() {
    const chapters = [...document.querySelectorAll(".image-chapter")];
    if (!chapters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-image-awake", entry.isIntersecting && entry.intersectionRatio > .32);
      });
    }, { threshold: [.32, .58] });
    chapters.forEach((chapter) => observer.observe(chapter));
  }

  function init() {
    initPixelSnow();
    initLightflowCursor();
    initAccordionGallery();
    initMorphFlow();
    initCircularGallery();
    initFolderMotion();
    initChapterImageMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
