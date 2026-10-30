(() => {
  "use strict";

  const pages = [...document.querySelectorAll(".page")];
  const dial = document.getElementById("chapterDial");
  const readoutIndex = document.getElementById("readoutIndex");
  const readoutTitle = document.getElementById("readoutTitle");
  const blackCut = document.getElementById("blackCut");
  const cutLabel = document.getElementById("cutLabel");
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");

  let active = 0;
  let locked = false;
  let wheelTimer = 0;

  const titles = pages.map((page) => page.dataset.title || "未命名章节");

  function pad(index) {
    return String(index).padStart(2, "0");
  }

  function buildDial() {
    dial.innerHTML = "";
    titles.forEach((title, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = `<span>${pad(index)}</span>`;
      button.setAttribute("aria-label", `前往页面：${title}`);
      button.addEventListener("click", () => goTo(index, `CUT TO ${pad(index)}`));
      dial.appendChild(button);
    });
  }

  function syncUi() {
    pages.forEach((page, index) => {
      page.classList.toggle("is-active", index === active);
      page.setAttribute("aria-hidden", index === active ? "false" : "true");
    });
    [...dial.children].forEach((button, index) => {
      button.classList.toggle("is-active", index === active);
      button.style.setProperty("--p", index === active ? "1" : "0");
    });
    readoutIndex.textContent = pad(active);
    readoutTitle.textContent = titles[active];
    prevPage.disabled = active === 0;
    nextPage.disabled = active === pages.length - 1;
  }

  function goTo(index, label = "IMAGE CUT") {
    const next = Math.max(0, Math.min(pages.length - 1, index));
    if (next === active || locked) return;
    locked = true;
    cutLabel.textContent = label;
    blackCut.classList.add("is-active");

    window.setTimeout(() => {
      active = next;
      syncUi();
    }, 260);

    window.setTimeout(() => {
      blackCut.classList.remove("is-active");
      locked = false;
    }, 620);
  }

  function move(step) {
    goTo(active + step, step > 0 ? "NEXT IMAGE" : "PREVIOUS IMAGE");
  }

  function bindEvents() {
    prevPage.addEventListener("click", () => move(-1));
    nextPage.addEventListener("click", () => move(1));
    document.querySelectorAll("[data-jump]").forEach((button) => {
      button.addEventListener("click", () => goTo(Number(button.dataset.jump), "RETURN TO 00"));
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        move(1);
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "Home") goTo(0, "RETURN TO 00");
      if (event.key === "End") goTo(pages.length - 1, "CUT TO END");
    });

    window.addEventListener("wheel", (event) => {
      if (locked) return;
      clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        if (Math.abs(event.deltaY) < 18) return;
        move(event.deltaY > 0 ? 1 : -1);
      }, 18);
    }, { passive: true });

    window.addEventListener("pointermove", (event) => {
      [...dial.children].forEach((button) => {
        if (button.classList.contains("is-active")) return;
        const rect = button.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const distance = Math.abs(event.clientY - centerY);
        const radius = 82;
        const force = distance < radius ? 1 - distance / radius : 0;
        button.style.setProperty("--p", force.toFixed(3));
      });
    }, { passive: true });
  }

  buildDial();
  syncUi();
  bindEvents();
})();
