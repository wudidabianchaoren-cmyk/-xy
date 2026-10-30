(() => {
  "use strict";

  function initPersonalPage() {
    const page = document.getElementById("personalPage");
    const host = document.getElementById("personalTextScene");
    const list = document.getElementById("indexList");
    const hobby = document.getElementById("hobbyPage");
    const stage = document.getElementById("stage");
    if (!page || !host || !list || !hobby || !stage) return;

    const entry = document.createElement("button");
    entry.type = "button";
    entry.className = "index-work";
    entry.dataset.indexTarget = "personalPage";
    entry.innerHTML = '<span class="number">06</span><span class="title">个人介绍</span><span class="meta">Personal archive / Resume<br>吴翔宇 · 视觉传达设计 · AIGC 影像</span><span class="arrow">↗</span>';
    const ensureDirectoryEntry = () => {
      if (!entry.isConnected) list.appendChild(entry);
    };
    ensureDirectoryEntry();
    new MutationObserver(ensureDirectoryEntry).observe(list, { childList: true });

    // Stable DOM text: no WebGL canvas, continuous ascent or perspective distortion.
    host.dataset.layout = "rectangular";
    let entrance = [];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function resume() {
      entrance.forEach(animation => animation.cancel());
      entrance = [];
      if (reduced) return;
      [page.querySelector(".personal-portrait"), host].filter(Boolean).forEach((node, index) => {
        entrance.push(node.animate([
          { opacity: .55, translate: "0 10px" },
          { opacity: 1, translate: "0 0" }
        ], { duration: 560, delay: index * 70, easing: "cubic-bezier(.16,1,.3,1)" }));
      });
    }

    function openHobby(event) {
      if (!event.target.closest?.("#enterWork") || !stage.classList.contains("layout-4")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.dispatchEvent(new CustomEvent("v31:open-standalone", { detail: { target: "hobbyPage" } }));
    }

    function updateHobbyLayout() {
      const rect = hobby.getBoundingClientRect();
      const travel = Math.max(1, hobby.offsetHeight - innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      hobby.style.setProperty("--hobby-progress", progress.toFixed(4));
      hobby.querySelectorAll(".hobby-aperture").forEach((item, index) => {
        const direction = index % 2 ? -1 : 1;
        item.style.transform = `translate3d(0, ${(progress - .5) * direction * (34 + index * 7)}px, 0) rotate(${(progress - .5) * direction * 2.2}deg)`;
      });
    }

    document.addEventListener("click", openHobby, true);
    hobby.addEventListener("scroll", updateHobbyLayout, { passive: true });
    window.addEventListener("v31:archive-open", (event) => {
      if (event.detail?.target !== "personalPage") return;
      resume();
    });
    window.addEventListener("v31:archive-close", (event) => {
      if (event.detail?.target !== "personalPage") return;
      entrance.forEach(animation => animation.cancel());
      entrance = [];
    });
  }

  if (document.getElementById("countdownPrelude") && document.body.dataset.openingComplete !== "true") window.addEventListener("v31:opening-complete", initPersonalPage, { once: true });
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initPersonalPage, { once: true });
  else initPersonalPage();
})();
