(() => {
  "use strict";

  const root = document.getElementById("portfolioProgress");
  const bar = document.getElementById("portfolioProgressBar");
  const percent = document.getElementById("portfolioProgressPercent");
  if (!root || !bar || !percent) return;

  let frame = 0;
  function update() {
    frame = 0;
    const distance = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.min(1, Math.max(0, scrollY / distance));
    bar.style.transform = `scaleY(${progress})`;
    percent.textContent = `${String(Math.round(progress * 100)).padStart(2, "0")}%`;
  }
  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate, { passive: true });
  new ResizeObserver(requestUpdate).observe(document.body);
  update();
})();
