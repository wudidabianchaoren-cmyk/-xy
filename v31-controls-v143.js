(() => {
  "use strict";
  const consoleNode = document.getElementById("experienceConsole");
  const audioTool = document.getElementById("experienceAudio");
  const audio = document.getElementById("portfolioAudio");
  const toggle = document.getElementById("musicToggle");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeValue = document.getElementById("musicVolumeValue");
  const brightnessSlider = document.getElementById("brightnessSlider");
  const brightnessValue = document.getElementById("brightnessValue");
  const veil = document.getElementById("brightnessVeil");
  if (!consoleNode || !audioTool || !audio || !toggle || !volumeSlider || !volumeValue || !brightnessSlider || !brightnessValue || !veil) return;

  const storage = {
    get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch (error) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (error) {} }
  };

  function refreshIcons() {
    if (window.lucide?.createIcons) window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }

  function decayOverflow(value, maximum = 50) {
    const entry = value / maximum;
    return 2 * (1 / (1 + Math.exp(-entry)) - .5) * maximum;
  }

  function initElasticSlider(node, options) {
    const min = options.min;
    const max = options.max;
    const step = options.step || 1;
    let value = options.value;
    let pointerId = null;

    function clamp(next) { return Math.max(min, Math.min(max, next)); }
    function snap(next) { return Math.round(clamp(next) / step) * step; }
    function render(next, notify = true) {
      value = snap(next);
      const progress = (value - min) / (max - min);
      node.style.setProperty("--range", `${progress * 100}%`);
      node.setAttribute("aria-valuenow", String(value));
      if (notify) options.onInput(value);
      node.dispatchEvent(new CustomEvent('v84:slider-sync',{detail:value}));
    }
    function resetElastic() {
      node.dataset.region = "middle";
      node.style.setProperty("--overflow", "0px");
      node.style.setProperty("--stretch", "1");
      node.style.setProperty("--squash", "1");
      node.closest(".elastic-control")?.querySelectorAll(".elastic-end").forEach(edge => {
        edge.style.setProperty("--edge-shift", "0px");
        edge.style.setProperty("--edge-scale", "1");
      });
    }
    function updateFromPointer(event) {
      const rect = node.getBoundingClientRect();
      const raw = event.clientX - rect.left;
      const outside = raw < 0 ? raw : raw > rect.width ? raw - rect.width : 0;
      const region = outside < 0 ? "left" : outside > 0 ? "right" : "middle";
      const overflow = decayOverflow(Math.min(100, Math.abs(outside)));
      const direction = region === "left" ? -1 : 1;
      const stretch = 1 + overflow / Math.max(80, rect.width);
      const squash = 1 - Math.min(.34, overflow / 135);
      node.dataset.region = region;
      node.style.setProperty("--overflow", `${overflow}px`);
      node.style.setProperty("--stretch", stretch.toFixed(3));
      node.style.setProperty("--squash", squash.toFixed(3));
      node.closest(".elastic-control")?.querySelectorAll(".elastic-end").forEach((edge, index) => {
        const isActive = (region === "left" && index === 0) || (region === "right" && index === 1);
        edge.style.setProperty("--edge-shift", isActive ? `${direction * overflow * .34}px` : "0px");
        edge.style.setProperty("--edge-scale", isActive ? String(1 + overflow / 95) : "1");
      });
      const unitProgress = Math.max(0, Math.min(1, raw / rect.width));
      render(min + unitProgress * (max - min));
    }

    node.addEventListener("pointerdown", event => {
      if(event.target.closest('.slider-container')) return;
      pointerId = event.pointerId;
      node.classList.add("is-dragging");
      updateFromPointer(event);
      try { node.setPointerCapture(pointerId); } catch (error) {}
    });
    window.addEventListener("pointermove", event => { if (pointerId === event.pointerId) updateFromPointer(event); });
    function release() {
      if (pointerId === null) return;
      if (node.hasPointerCapture(pointerId)) node.releasePointerCapture(pointerId);
      pointerId = null;
      node.classList.remove("is-dragging");
      resetElastic();
    }
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    node.addEventListener("lostpointercapture", () => {
      pointerId = null;
      node.classList.remove("is-dragging");
      resetElastic();
    });
    node.addEventListener("wheel", event => {
      event.preventDefault();
      event.stopPropagation();
      render(value - Math.sign(event.deltaY) * step * 2);
    }, { passive: false });
    node.addEventListener("keydown", event => {
      if (!["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") render(min);
      else if (event.key === "End") render(max);
      else render(value + (["ArrowUp", "ArrowRight"].includes(event.key) ? step : -step));
    });
    node.addEventListener("dblclick", () => render(options.reset));
    node.addEventListener('v84:slider-value',e=>render(e.detail));
    resetElastic();
    render(value, true);
  }

  function setPlaying(playing) {
    audioTool.classList.toggle("is-playing", playing);
    toggle.setAttribute("aria-label", playing ? "暂停背景音乐" : "播放背景音乐");
    toggle.title = playing ? "暂停背景音乐" : "播放背景音乐";
    toggle.innerHTML = `<i data-lucide="${playing ? "volume-1" : "volume-x"}" aria-hidden="true"></i>`;
    refreshIcons();
  }

  const defaultTrack = audio.dataset.defaultTrack?.trim();
  let autoplayPending = Boolean(defaultTrack);
  if (defaultTrack) {
    audio.src = defaultTrack;
    audio.autoplay = false;
  }

  const volumeCalibrated = storage.get("v31-volume-calibrated-v2", "0") === "1";
  const savedVolume = Number(storage.get("v31-volume", "20"));
  const initialVolume = volumeCalibrated && Number.isFinite(savedVolume) ? Math.max(0, Math.min(100, savedVolume)) : 20;
  initElasticSlider(volumeSlider, {
    min: 0, max: 100, step: 1, value: initialVolume, reset: 20,
    onInput(value) {
      audio.volume = value / 100;
      audio.muted = value === 0;
      volumeValue.value = String(value).padStart(2, "0");
      storage.set("v31-volume", String(value));
      storage.set("v31-volume-calibrated-v2", "1");
    }
  });

  function setBrightness(value) {
    const level = Math.max(60, Math.min(115, Math.round(value)));
    const raised = level > 100;
    const opacity = level < 100 ? (100 - level) / 40 * .24 : raised ? (level - 100) / 15 * .12 : 0;
    brightnessValue.value = String(level);
    veil.style.background = raised ? "#ffffff" : "#020405";
    veil.style.opacity = opacity.toFixed(3);
    veil.style.visibility = opacity > 0 ? "visible" : "hidden";
    document.body.classList.toggle("is-display-adjusted", opacity > 0);
    storage.set("v31-brightness", String(level));
  }
  const savedBrightness = Number(storage.get("v31-brightness", "100"));
  initElasticSlider(brightnessSlider, {
    min: 60, max: 115, step: 1, value: Number.isFinite(savedBrightness) ? savedBrightness : 100, reset: 100,
    onInput: setBrightness
  });

  async function play() {
    if (!audio.src || audio.volume === 0 || window.portfolioHomeAudioAllowed?.()===false) return;
    try { await audio.play(); autoplayPending = false; }
    catch (error) { setPlaying(false); }
  }
  async function tryAutoplay() {
    if (!autoplayPending || !audio.src || window.portfolioHomeAudioAllowed?.()===false) return;
    try { await audio.play(); autoplayPending = false; }
    catch (error) {}
  }
  toggle.addEventListener("click", () => audio.paused ? play() : audio.pause());
  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("ended", () => setPlaying(false));
  audio.addEventListener("error", () => setPlaying(false));

  if (defaultTrack) {
    window.addEventListener("v31:opening-complete", tryAutoplay, { once: true });
    ["pointerdown", "wheel", "keydown"].forEach(type => document.addEventListener(type, tryAutoplay, { once: true, capture: true, passive: type === "wheel" }));
  }
  setPlaying(false);
  refreshIcons();
})();
