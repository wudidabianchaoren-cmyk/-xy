(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const palette = [
    [215, 176, 111],
    [155, 190, 192],
    [142, 173, 138],
    [233, 124, 88],
    [240, 232, 205]
  ];

  const layer = document.createElement("div");
  layer.className = "splash-cursor-layer";
  layer.setAttribute("aria-hidden", "true");
  layer.dataset.reactBits = "SplashCursor static adapter";

  const canvas = document.createElement("canvas");
  canvas.id = "splashCursorCanvas";
  layer.appendChild(canvas);
  document.body.appendChild(layer);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    lastX: 0,
    lastY: 0,
    pointerX: 0,
    pointerY: 0,
    hasPointer: false,
    glow: 0,
    hueIndex: 0,
    particles: [],
    raf: 0
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function resize() {
    state.dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 720 ? 1.2 : 1.6);
    state.width = Math.max(1, window.innerWidth);
    state.height = Math.max(1, window.innerHeight);
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    ctx.clearRect(0, 0, state.width, state.height);
  }

  function currentColor(offset = 0) {
    const color = palette[(state.hueIndex + offset) % palette.length];
    return {
      r: color[0],
      g: color[1],
      b: color[2]
    };
  }

  function addParticle(x, y, vx, vy, size, life, color, spin = 0) {
    const limit = window.innerWidth < 720 ? 180 : 420;
    if (state.particles.length > limit) state.particles.splice(0, state.particles.length - limit);
    state.particles.push({
      x,
      y,
      vx,
      vy,
      size,
      baseSize: size,
      life,
      maxLife: life,
      color,
      spin,
      drift: Math.random() * Math.PI * 2
    });
  }

  function splat(x, y, force = 1, burst = false) {
    if (!document.body.classList.contains("experience-entered")) return;
    const dx = x - state.lastX;
    const dy = y - state.lastY;
    const speed = clamp(Math.hypot(dx, dy) / 42, .18, 2.2) * force;
    const count = burst ? 32 : Math.ceil(4 + speed * 7);

    state.hueIndex = (state.hueIndex + 1) % palette.length;

    for (let i = 0; i < count; i += 1) {
      const angle = Math.atan2(dy || Math.random() - .5, dx || Math.random() - .5) + (Math.random() - .5) * Math.PI * (burst ? 1.55 : .78);
      const velocity = (burst ? 8 : 4.2) * speed * (.35 + Math.random());
      const color = currentColor(i);
      addParticle(
        x + (Math.random() - .5) * 22,
        y + (Math.random() - .5) * 22,
        Math.cos(angle) * velocity + (Math.random() - .5) * 1.8,
        Math.sin(angle) * velocity + (Math.random() - .5) * 1.8,
        (burst ? 13 : 8) + Math.random() * (burst ? 32 : 18) * speed,
        48 + Math.random() * (burst ? 58 : 44),
        color,
        (Math.random() - .5) * .18
      );
    }

    state.glow = burst ? 1 : clamp(.3 + speed * .28, .3, .86);
    layer.style.setProperty("--splash-x", `${(x / state.width * 100).toFixed(2)}%`);
    layer.style.setProperty("--splash-y", `${(y / state.height * 100).toFixed(2)}%`);
    layer.style.setProperty("--splash-glow", state.glow.toFixed(3));
  }

  function fadeCanvas() {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, .085)";
    ctx.fillRect(0, 0, state.width, state.height);
    ctx.globalCompositeOperation = "lighter";
  }

  function drawParticle(particle) {
    const progress = particle.life / particle.maxLife;
    const alpha = Math.sin(progress * Math.PI) * .28;
    const radius = particle.size * (.32 + progress * .92);
    const core = radius * .22;
    const { r, g, b } = particle.color;
    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      core,
      particle.x,
      particle.y,
      radius
    );
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
    gradient.addColorStop(.42, `rgba(${r}, ${g}, ${b}, ${alpha * .32})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      particle.x,
      particle.y,
      radius * (1.18 + Math.sin(particle.drift) * .12),
      radius * (.72 + Math.cos(particle.drift) * .09),
      particle.drift,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  function tick() {
    fadeCanvas();

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const particle = state.particles[i];
      particle.life -= 1;
      if (particle.life <= 0) {
        state.particles.splice(i, 1);
        continue;
      }

      const pullX = state.hasPointer ? (state.pointerX - particle.x) * .0009 : 0;
      const pullY = state.hasPointer ? (state.pointerY - particle.y) * .0009 : 0;
      particle.vx += pullX + Math.sin(particle.drift) * .012;
      particle.vy += pullY + Math.cos(particle.drift) * .012;
      particle.vx *= .982;
      particle.vy *= .982;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.size = particle.baseSize * (1 + (1 - particle.life / particle.maxLife) * .55);
      particle.drift += particle.spin;
      drawParticle(particle);
    }

    state.glow *= .92;
    if (state.glow < .02) state.glow = 0;
    layer.style.setProperty("--splash-glow", state.glow.toFixed(3));
    state.raf = window.requestAnimationFrame(tick);
  }

  function isOverlayOpen() {
    return Boolean(document.querySelector(".memory-overlay.is-open, .index-overlay.is-open"));
  }

  function onPointerMove(event) {
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.hasPointer = true;
    if (isOverlayOpen()) return;
    if (!state.lastX && !state.lastY) {
      state.lastX = event.clientX;
      state.lastY = event.clientY;
    }
    splat(event.clientX, event.clientY, .82, false);
    state.lastX = event.clientX;
    state.lastY = event.clientY;
  }

  function onPointerDown(event) {
    if (event.button != null && event.button !== 0) return;
    if (isOverlayOpen()) return;
    splat(event.clientX, event.clientY, 1.45, true);
  }

  function onPointerLeave() {
    state.hasPointer = false;
    state.lastX = 0;
    state.lastY = 0;
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerleave", onPointerLeave, { passive: true });
  tick();
})();
