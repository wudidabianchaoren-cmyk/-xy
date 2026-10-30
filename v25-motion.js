(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const imageItems = [
    { src: "./assets/works/rural-field.png", label: "乡土远景" },
    { src: "./assets/works/rural-bridge.png", label: "桥上凝视" },
    { src: "./assets/works/rural-dusk.png", label: "黄昏背影" },
    { src: "./assets/works/xianxia-duel.png", label: "宫殿双强" },
    { src: "./assets/works/xianxia-cliff.png", label: "崖边相遇" },
    { src: "./assets/works/rain-palace.png", label: "雨夜宫殿" },
    { src: "./assets/works/bamboo-forest.png", label: "竹林材质" }
  ];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function initInkCursor() {
    if (reducedMotion) return;

    const layer = document.createElement("div");
    layer.className = "ink-cursor-layer";
    layer.setAttribute("aria-hidden", "true");

    const canvas = document.createElement("canvas");
    canvas.id = "inkCursorCanvas";
    layer.appendChild(canvas);
    document.body.appendChild(layer);

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const palette = [
      [118, 124, 100],
      [134, 119, 87],
      [112, 133, 126],
      [151, 137, 104]
    ];

    const state = {
      width: 1,
      height: 1,
      dpr: 1,
      lastX: 0,
      lastY: 0,
      particles: [],
      color: 0
    };

    function resize() {
      state.dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 720 ? 1.15 : 1.45);
      state.width = Math.max(1, window.innerWidth);
      state.height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.width, state.height);
    }

    function addTrace(x, y, vx, vy, radius, life) {
      if (state.particles.length > 240) state.particles.splice(0, state.particles.length - 240);
      state.particles.push({
        x,
        y,
        vx,
        vy,
        radius,
        life,
        maxLife: life,
        color: palette[state.color % palette.length],
        phase: Math.random() * Math.PI * 2
      });
    }

    function spawn(x, y, burst = false) {
      if (!document.body.classList.contains("experience-entered")) return;
      const dx = x - state.lastX;
      const dy = y - state.lastY;
      const speed = clamp(Math.hypot(dx, dy) / 52, .12, 1.6);
      const count = burst ? 16 : Math.ceil(2 + speed * 4);
      state.color += burst ? 1 : 0;

      for (let i = 0; i < count; i += 1) {
        const angle = Math.atan2(dy || Math.random() - .5, dx || Math.random() - .5) + (Math.random() - .5) * (burst ? 2.1 : .9);
        const force = (burst ? 5.2 : 2.1) * (.4 + Math.random()) * speed;
        addTrace(
          x + (Math.random() - .5) * 18,
          y + (Math.random() - .5) * 18,
          Math.cos(angle) * force,
          Math.sin(angle) * force,
          (burst ? 18 : 9) + Math.random() * (burst ? 28 : 12),
          46 + Math.random() * 42
        );
      }
    }

    function draw() {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, .11)";
      ctx.fillRect(0, 0, state.width, state.height);
      ctx.globalCompositeOperation = "source-over";

      for (let i = state.particles.length - 1; i >= 0; i -= 1) {
        const p = state.particles[i];
        p.life -= 1;
        if (p.life <= 0) {
          state.particles.splice(i, 1);
          continue;
        }

        const k = p.life / p.maxLife;
        const alpha = Math.sin(k * Math.PI) * .16;
        const [r, g, b] = p.color;
        p.vx *= .975;
        p.vy *= .975;
        p.x += p.vx + Math.sin(p.phase) * .08;
        p.y += p.vy + Math.cos(p.phase) * .08;
        p.phase += .025;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * (1.6 - k * .35));
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        gradient.addColorStop(.5, `rgba(${r}, ${g}, ${b}, ${alpha * .38})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.radius * 1.45, p.radius * .72, p.phase, 0, Math.PI * 2);
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

  function initAccordionGallery() {
    const gallery = document.getElementById("mindAccordion");
    if (!gallery) return;
    const panels = [...gallery.querySelectorAll(".ag-panel")];
    if (!panels.length) return;
    let active = Math.min(3, panels.length - 1);

    function setActive(index) {
      active = index;
      panels.forEach((panel, i) => {
        panel.classList.toggle("is-active", i === active);
        const offset = i - active;
        panel.style.setProperty("--panel-tilt", `${clamp(offset * -4, -7, 7)}deg`);
        panel.style.setProperty("--panel-drift", `${clamp(offset * -16, -34, 34)}px`);
      });
    }

    panels.forEach((panel, index) => {
      panel.addEventListener("mouseenter", () => setActive(index));
      panel.addEventListener("focus", () => setActive(index));
      panel.addEventListener("click", () => setActive(index));
      panel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          setActive((index + 1) % panels.length);
          panels[(index + 1) % panels.length].focus();
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          const previous = (index - 1 + panels.length) % panels.length;
          setActive(previous);
          panels[previous].focus();
        }
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
      image.src = item.src;
      image.alt = item.label;
      image.className = index === 0 ? "is-active" : "";
      root.appendChild(image);
    });

    const images = [...root.querySelectorAll("img")];
    let index = 0;
    let timer = 0;

    function show(next) {
      index = (next + images.length) % images.length;
      images.forEach((image, i) => image.classList.toggle("is-active", i === index));
      root.style.setProperty("--scan-x", `${(index % 2 ? 18 : -18)}%`);
    }

    function schedule() {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        show(index + 1);
        schedule();
      }, 3600);
    }

    root.addEventListener("pointermove", (event) => {
      const rect = root.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width) - .5;
      const y = (event.clientY - rect.top) / Math.max(1, rect.height) - .5;
      root.style.setProperty("--flow-x", `${(x * -16).toFixed(2)}px`);
      root.style.setProperty("--flow-y", `${(y * -10).toFixed(2)}px`);
    }, { passive: true });

    root.addEventListener("click", () => {
      show(index + 1);
      schedule();
    });

    if (!reducedMotion) schedule();
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
    initInkCursor();
    initAccordionGallery();
    initMorphFlow();
    initChapterImageMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
