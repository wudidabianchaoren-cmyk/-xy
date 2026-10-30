/* Loaded only as the appended chapter approaches the viewport. */
(() => {
  "use strict";
  const section = document.getElementById("yangjianAppend");
  if (!section || section.dataset.yjAppendReady === "true") return;
  const art = section.querySelector("[data-yj-append-src]");
  if (art) {
    const reveal = () => { section.dataset.yjAppendArt = "ready"; };
    art.addEventListener("load", reveal, { once: true });
    art.addEventListener("error", () => { section.dataset.yjAppendArt = "unavailable"; }, { once: true });
    art.src = art.dataset.yjAppendSrc;
    if (art.complete && art.naturalWidth > 0) reveal();
  }
  section.dataset.yjAppendReady = "true";
})();
