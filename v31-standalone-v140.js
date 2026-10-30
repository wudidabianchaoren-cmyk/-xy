(() => {
  "use strict";
  const ids = ["hobbyPage", "personalPage"];
  const pages = ids.map(id => document.getElementById(id)).filter(Boolean);
  const list = document.getElementById("indexList");

  function ensureDirectoryEntries() {
    if (!list) return;
    let personal = list.querySelector('[data-index-target="personalPage"]');
    if (personal){personal.dataset.openStandalone="personalPage";const n=personal.querySelector(".number");if(n)n.textContent="05";}
    list.querySelector('[data-index-target="hobbyPage"]')?.remove();
  }

  let parentPersonal=false,personalScroll=0,outerScroll=null,outerRoom=false;
  function performOpen(target) {
    parentPersonal=target==="hobbyPage"&&document.getElementById("personalPage")?.classList.contains("is-standalone-open");if(parentPersonal)personalScroll=document.getElementById("personalPage").scrollTop;
    const previous=pages.find(p=>p.classList.contains("is-standalone-open"));if(previous)window.dispatchEvent(new CustomEvent("v31:archive-close",{detail:{target:previous.id}}));
    const page = document.getElementById(target);
    if (!page) return;
    if(!previous&&outerScroll===null){outerRoom=document.body.classList.contains('directory-section-active');const room=outerRoom&&document.getElementById('archiveDirectory');outerScroll=room?window.scrollY+room.getBoundingClientRect().top:window.scrollY;}
    window.__v31Lenis?.stop();
    pages.forEach(item => {item.classList.remove("is-standalone-open");item.setAttribute("aria-hidden","true");});
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
    if(page.id==="hobbyPage"&&parentPersonal){window.dispatchEvent(new CustomEvent("v31:archive-close",{detail:{target:page.id}}));parentPersonal=false;performOpen("personalPage");document.getElementById("personalPage").scrollTop=personalScroll;document.querySelector("#personalHobbies")?.focus({preventScroll:true});return;}
    document.body.classList.remove("standalone-archive-open");
    if(outerScroll!==null){const saved=outerScroll,fromRoom=outerRoom;outerScroll=null;outerRoom=false;requestAnimationFrame(()=>{const room=fromRoom&&document.getElementById('archiveDirectory'),y=room?window.scrollY+room.getBoundingClientRect().top:saved;window.__v31Lenis?.scrollTo(y,{immediate:true,force:true});window.scrollTo({top:y,behavior:'instant'});window.__v31Lenis?.start();});}else window.__v31Lenis?.start();
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
    if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;
    const page = pages.find(item => item.classList.contains("is-standalone-open"));
    if (page && !document.body.classList.contains("hobby-modal-open")) close(page);
  });
  pages.forEach(page => {page.setAttribute("aria-hidden", "true");page.setAttribute('data-lenis-prevent','');page.style.overscrollBehavior='contain';});
  ensureDirectoryEntries();
  if (list) new MutationObserver(ensureDirectoryEntries).observe(list, { childList: true });
})();
