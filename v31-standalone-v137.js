(() => {
  "use strict";
  const ids = ["hobbyPage", "personalPage"];
  const pages = ids.map(id => document.getElementById(id)).filter(Boolean);
  const list = document.getElementById("indexList");

  function ensureDirectoryEntries() {
    if (!list) return;
    let personal = list.querySelector('[data-index-target="personalPage"]');
    if (personal) personal.dataset.openStandalone = "personalPage";
    if (!list.querySelector('[data-index-target="hobbyPage"]')) {
      const entry = document.createElement("button");
      entry.type = "button";
      entry.className = "index-work";
      entry.dataset.indexTarget = "hobbyPage";
      entry.dataset.openStandalone = "hobbyPage";
      entry.innerHTML = '<span class="number">05</span><span class="title">个人爱好</span><span class="meta">Personal interests / Image archive<br>圆形轨道 · 视觉札记 · 私人收藏</span><span class="arrow">↗</span>';
      personal = list.querySelector('[data-index-target="personalPage"]');
      list.insertBefore(entry, personal || null);
    }
  }

  function performOpen(target) {
    const page = document.getElementById(target);
    if (!page) return;
    pages.forEach(item => item.classList.remove("is-standalone-open"));
    page.scrollTop = 0;
    page.classList.add("is-standalone-open");
    page.setAttribute("aria-hidden", "false");
    document.body.classList.add("standalone-archive-open");
    window.dispatchEvent(new CustomEvent("v31:archive-open", { detail: { target } }));
    window.setTimeout(() => page.querySelector(".standalone-close")?.focus({ preventScroll: true }), 50);
  }

  function performClose(page) {
    if (!page) return;
    page.classList.remove("is-standalone-open");
    page.setAttribute("aria-hidden", "true");
    document.body.classList.remove("standalone-archive-open");
    window.dispatchEvent(new CustomEvent("v31:archive-close", { detail: { target: page.id } }));
    document.querySelector('[data-open-standalone="' + page.id + '"]')?.focus({ preventScroll: true });
  }

  function open(target){if(window.portfolioTransition)void window.portfolioTransition(()=>performOpen(target));else performOpen(target);}
  function close(page){if(window.portfolioTransition&&!window.portfolioNavigation?.returning)void window.portfolioTransition(()=>performClose(page));else performClose(page);}
  document.addEventListener("click", event => {
    const opener = event.target.closest("[data-open-standalone]");
    if (opener) {
      event.preventDefault();
      open(opener.dataset.openStandalone);
      return;
    }
    const closer = event.target.closest(".standalone-close");
    if (closer) close(closer.closest(".hobby-page,.personal-page"));
  });
  window.addEventListener("v31:open-standalone", event => open(event.detail?.target));
  window.addEventListener("wheel", event => {
    if (!document.body.classList.contains("standalone-archive-open") || document.body.classList.contains("hobby-modal-open")) return;
    if (event.target.closest?.(".is-standalone-open")) event.stopPropagation();
  }, { capture: true, passive: true });
  window.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const page = pages.find(item => item.classList.contains("is-standalone-open"));
    if (page && !document.body.classList.contains("hobby-modal-open")) close(page);
  });
  pages.forEach(page => page.setAttribute("aria-hidden", "true"));
  ensureDirectoryEntries();
  if (list) new MutationObserver(ensureDirectoryEntries).observe(list, { childList: true });
})();
