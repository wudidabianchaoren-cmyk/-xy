/* V131: one bounded, reversible reading sequence for the existing glass rooms. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const records = [];
  const states = window.glassGalleries = {};
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const topOf = element => element.getBoundingClientRect().top + scrollY;
  // Retire the fully transparent arrival layer after its existing entrance ends.
  document.querySelector('.project-arrival')?.addEventListener('animationend', event => { event.currentTarget.hidden = true; }, { once: true });
  let travelling = null, travelTimer = 0, lastInput = -Infinity, lastDirection = 0;
  let touch = null;

  function travel(record, direction, entering) {
    const target = entering ? record.gallery : direction > 0 ? record.after : record.before;
    if (!target) return;
    if (entering) record.reset(direction);
    travelling = { record, top: topOf(target) };
    clearTimeout(travelTimer);
    window.scrollTo({ top: travelling.top, behavior: reduced ? 'instant' : 'smooth' });
    travelTimer = setTimeout(() => { travelling = null; }, 1000);
  }
  function candidate(direction, delta) {
    const sorted = direction > 0 ? records : [...records].reverse();
    return sorted.find(record => {
      if (record.state.error) return false;
      const top = topOf(record.gallery), distance = top - scrollY;
      if (Math.abs(distance) <= 3) return true;
      const neighbour = direction > 0 ? record.before : record.after;
      if (neighbour && Math.abs(scrollY - topOf(neighbour)) <= 16) return true;
      return direction > 0
        ? distance > 0 && distance <= Math.max(Math.abs(delta), innerHeight * .3)
        : distance < 0 && -distance <= Math.max(Math.abs(delta), innerHeight * .3);
    });
  }
  function navigate(record, direction, now, deliberate = false) {
    const state = record.state;
    const fresh = now - lastInput > 180 || direction !== lastDirection;
    lastInput = now; lastDirection = direction;
    if (!state.ready || state.animating || now < record.nextStep) return;
    const atBoundary = direction > 0 ? state.row === record.stops.length - 1 : state.row === 0;
    if (atBoundary) {
      // Inertia that just arrived at the last image cannot also dismiss it.
      if ((fresh || deliberate) && now - record.settledAt >= 180) travel(record, direction, false);
      return;
    }
    record.move(state.row + direction);
  }
  function handle(delta, event, deliberate = false) {
    if (!delta) return false;
    const direction = Math.sign(delta), now = performance.now();
    if (travelling) {
      if (Math.abs(scrollY - travelling.top) <= 3) travelling = null;
      else { event.preventDefault(); return true; }
    }
    const record = candidate(direction, delta);
    if (!record) return false;
    // Decode failure or a stalled request must always leave ordinary scrolling usable.
    if (!record.state.ready && now - record.created > 8000) return false;
    event.preventDefault();
    record.state.wheelEvents++;
    if (Math.abs(scrollY - topOf(record.gallery)) > 3) {
      travel(record, direction, true);
      lastInput = now; lastDirection = direction;
    } else navigate(record, direction, now, deliberate);
    return true;
  }

  window.addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (Math.abs(delta) >= 2) handle(delta, event);
  }, { passive: false });
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey ||
        event.target.closest('input,textarea,select,button,a,[contenteditable="true"]')) return;
    const down = ['ArrowDown', 'PageDown', ' '].includes(event.key) && !event.shiftKey;
    const up = ['ArrowUp', 'PageUp'].includes(event.key) || event.key === ' ' && event.shiftKey;
    if (down || up) handle((down ? 1 : -1) * innerHeight, event, true);
  });
  window.addEventListener('touchstart', event => {
    touch = event.touches.length === 1
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY, used: false } : null;
  }, { passive: true });
  window.addEventListener('touchmove', event => {
    if (!touch || event.touches.length !== 1) return;
    const dx = touch.x - event.touches[0].clientX, dy = touch.y - event.touches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) || Math.abs(dy) < 30) return;
    if (touch.used) {
      if (records.some(record => Math.abs(scrollY - topOf(record.gallery)) < 4) || travelling) event.preventDefault();
    } else if (handle(dy, event, true)) touch.used = true;
  }, { passive: false });
  for (const name of ['touchend', 'touchcancel', 'blur']) window.addEventListener(name, () => { touch = null; }, { passive: true });
  window.addEventListener('pagehide', () => { travelling = null; touch = null; clearTimeout(travelTimer); });
  window.addEventListener('scroll', () => {
    if (travelling && Math.abs(scrollY - travelling.top) <= 3) {
      travelling = null; clearTimeout(travelTimer);
    }
    for (const record of records) record.state.visible = Math.abs(scrollY - topOf(record.gallery)) <= 4;
  }, { passive: true });

  function initialize(gallery) {
    const stage = gallery.querySelector('.glass-stage');
    if (!stage) return;
    const project = document.body.dataset.project;
    const before = document.getElementById(gallery.dataset.before) || gallery.previousElementSibling;
    const after = document.getElementById(gallery.dataset.after) || gallery.nextElementSibling;
    const manifest = gallery.dataset.glassManifest || document.body.dataset.galleryManifest || `./assets/works/${project}/manifest.json`;
    const url = new URL(manifest, location.href);
    const state = states[gallery.id] = {
      version: '32.142', ready: false, frames: 0, views: 0, index: 0, row: 0,
      position: 0, target: 0, maximum: 0, visible: false, animating: false,
      autoEnabled: false, renders: 0, wheelEvents: 0, manualChanges: 0, sourceIndices: [],
      renderer: 'CSS complete independent frames; synchronized reflections; bounded manual navigation'
    };
    if (project === 'physical-universe') window.codeFilmsState.galleries[gallery.id] = state;
    if (!window.afterJourneyState) window.afterJourneyState = state;
    if (project === 'home-creation') window.homeGalleryState = window.homeGalleryBoundary = state;
    const room = document.createElement('div');
    room.className = 'glass-room'; room.setAttribute('aria-hidden', 'true');
    const artwork = '<div class="glass-artwork"><div class="glass-track"></div></div>';
    room.innerHTML = `<div class="glass-frame"><div class="glass-plane glass-ceiling">${artwork}</div><div class="glass-wall">${artwork}</div><div class="glass-plane glass-floor">${artwork}</div></div><div class="glass-reflection reflection-top">${artwork}</div><div class="glass-reflection reflection-bottom">${artwork}</div>`;
    stage.prepend(room);
    const tracks = [...room.querySelectorAll('.glass-track')];
    const controls = document.createElement('div'); controls.className = 'glass-reading-controls'; controls.hidden = true;
    const previous = document.createElement('button'), next = document.createElement('button');
    const status = document.createElement('span'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    for (const [button, direction] of [[previous, -1], [next, 1]]) {
      button.type = 'button';
      button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" ${direction < 0 ? 'transform="rotate(180 12 12)"' : ''}/></svg>`;
      button.addEventListener('click', () => {
        if (Math.abs(scrollY - topOf(gallery)) > 3) travel(record, direction, true);
        else navigate(record, direction, performance.now(), true);
      });
    }
    const enlarge=document.createElement('button');enlarge.className='glass-enlarge';enlarge.textContent='查看原图';enlarge.type='button';enlarge.setAttribute('aria-label','放大查看当前完整图片');enlarge.addEventListener('click',()=>{const img=sequence[state.row];if(!img)return;const d=document.createElement('dialog');d.className='glass-original-dialog';const close=document.createElement('button');close.textContent='关闭原图';close.onclick=()=>d.close();const full=img.cloneNode();full.removeAttribute('style');d.append(close,full);d.addEventListener('click',e=>{if(e.target===d)d.close()});d.addEventListener('close',()=>d.remove(),{once:true});document.body.append(d);d.showModal();});controls.append(previous,status,next,enlarge);gallery.append(controls);
    let sequence = [], entries = [], starts = [], raf = 0, animation = null;
    const record = { gallery, stage, before, after, state, created: performance.now(), stops: [0], nextStep: 0, settledAt: -Infinity, entryDirection: 1, move, reset };
    records.push(record);
    function announce() {
      let frame = 0;
      while (frame < starts.length - 1 && starts[frame + 1] <= state.target + .001) frame++;
      if (state.row === record.stops.length - 1) frame = sequence.length - 1;
      state.frameIndex = frame;
      const label = entries[frame]?.title || entries[frame]?.subject || '制作图';
      status.textContent = `${frame + 1} / ${sequence.length}　${label}`;
      previous.setAttribute('aria-label', state.row === 0 ? '返回上一段' : '浏览上一幅');
      next.setAttribute('aria-label', state.row === record.stops.length - 1 ? '继续下一段' : '浏览下一幅');
    }
    function draw() {
      fitFrame();
      for (const track of tracks) track.style.transform = `translate3d(0,${-state.position * 100}%,0)`;
      state.progress = state.maximum ? state.position / state.maximum : 0; state.renders++;
    }
    function fitFrame() {
      const image = sequence[state.row];
      if (!image) return;
      const w = stage.clientWidth, h = stage.clientHeight;
      const mobile = innerWidth <= 700, code = gallery.classList.contains('code-gallery');
      const maxWidth = w * (mobile || code && innerWidth <= 850 ? .8 : code ? .84 : .64);
      const maxHeight = h * (mobile ? .6 : code ? .7 : project === 'home-creation' ? .76 : .6);
      const ratio = image.naturalWidth / image.naturalHeight || sequence[0]?.naturalWidth / sequence[0]?.naturalHeight || 16/9;
      const width = Math.min(maxWidth, maxHeight * ratio), height = width / ratio;
      const left = (w - width) / 2, top = (h - height) / 2;const reflectionHeight=code?Math.min(112,h*.13,height*.32):null;
      const key = `${width}/${height}/${w}/${h}`;
      if (room.dataset.geometry === key) return;
      room.dataset.geometry = key;
      Object.assign(room.querySelector('.glass-frame').style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` });
      for (const [selector, y, size, artworkTop] of [['.reflection-top',reflectionHeight===null?0:top-reflectionHeight,reflectionHeight===null?top:reflectionHeight,reflectionHeight===null?top-height:reflectionHeight-height], ['.reflection-bottom',top+height,reflectionHeight===null?h-top-height:reflectionHeight,0]]) {
        const reflection = room.querySelector(selector);
        Object.assign(reflection.style, { top: `${y}px`, height: `${size}px` });
        Object.assign(reflection.querySelector('.glass-artwork').style, { left: `${left}px`, width: `${width}px`, height: `${height}px`, top: `${artworkTop}px` });
      }
      Object.assign(state, { imageWidth: width, wallHeight: height, imageRatio: ratio,reflectionHeight });
    }
    function tick(now) {
      if (!animation || document.hidden) { raf = 0; return; }
      const p = clamp((now - animation.start) / 440, 0, 1), eased = 1 - Math.pow(1 - p, 3);
      state.position = animation.from + (state.target - animation.from) * eased;
      draw();
      if (p < 1) raf = requestAnimationFrame(tick);
      else { animation = null; raf = 0; state.animating = false; record.settledAt = now; }
    }
    function move(row) {
      const nextImage=sequence[clamp(row,0,record.stops.length-1)];
      if(nextImage&&(!nextImage.complete||!nextImage.naturalWidth)){if(state.waitingImage191)return;state.waitingImage191=true;nextImage.loading='eager';void nextImage.decode().then(()=>{state.waitingImage191=false;move(row);}).catch(()=>{state.waitingImage191=false;});return;}
      state.row = state.index = clamp(row, 0, record.stops.length - 1);
      state.target = record.stops[state.row]; state.manualChanges++;
      cancelAnimationFrame(raf); animation = null;
      if (reduced) { state.position = state.target; state.animating = false; draw(); record.settledAt = performance.now(); }
      else { state.animating = true; animation = { from: state.position, start: performance.now() }; raf = requestAnimationFrame(tick); }
      record.nextStep = performance.now() + (reduced ? 180 : 500); announce();
    }
    function reset(direction) {
      record.entryDirection = direction;
      cancelAnimationFrame(raf); raf = 0; animation = null;
      state.row = state.index = direction > 0 ? 0 : record.stops.length - 1;
      state.position = state.target = record.stops[state.row]; state.animating = false;
      record.settledAt = performance.now(); record.nextStep = performance.now() + 250;
      if (state.ready) { draw(); announce(); }
    }
    function layout() {
      if (!sequence.length) return;
      cancelAnimationFrame(raf); animation = null; state.animating = false;
      starts = sequence.map((_, index) => index);
      record.stops = [...starts]; state.maximum = sequence.length - 1;
      state.row = state.index = clamp(state.row, 0, state.maximum);
      state.position = state.target = state.row; state.views = sequence.length;
      const frame = room.querySelector('.glass-frame');
      Object.assign(state, { imageWidth: frame.clientWidth, wallHeight: frame.clientHeight, anchors: [...starts] });
      room.style.setProperty('--room-perspective', `${stage.clientHeight * 1.666}px`);
      draw(); announce();
    }
    new ResizeObserver(layout).observe(stage);
    fetch(url).then(response => { if (!response.ok) throw Error('图片目录加载失败'); return response.json(); }).then(async data => {
      const indices = data.views?.flat() ?? data.gallerySelection ?? data.frames.map((_, index) => index);
      state.sourceIndices = indices; entries = indices.map(index => data.frames[index]);
      const cache = new Map();
      sequence = entries.map((entry,index) => {
        const src = new URL(entry.image || entry.src, url).href;
        if (!cache.has(src)) {
          const image = new Image(); image.decoding = 'async'; image.loading=index<2?'eager':'lazy'; image.fetchPriority=index===0?'high':'low';image.src = src;
          cache.set(src, image);
        }
        return cache.get(src);
      });
      // The original first photograph can paint without waiting for every
      // later full-resolution frame in this gallery.
      await sequence[0].decode();state.firstImageReadyAt191=performance.now();
      state.frames = sequence.length; state.textureCount = cache.size;
      tracks.forEach(track => sequence.forEach((image, index) => {
        const copy = image.cloneNode(); copy.alt = entries[index].alt || entries[index].title || entries[index].subject || '';
        copy.style.top = `${index * 100}%`; copy.dataset.frame = String(index); track.append(copy);
      }));
      state.ready = true; layout();
      if (record.entryDirection < 0) reset(-1);
      stage.classList.add('is-ready'); controls.hidden = false;
      stage.setAttribute('aria-label', `${sequence.length}幅图片，滚轮、上下方向键或滑动逐幅浏览；末幅后进入下一段`);
    }).catch(error => {
      state.error = error.message; controls.hidden = false;
      previous.hidden = next.hidden = true; status.textContent = '图片暂未加载，请刷新重试';
      stage.classList.add('has-error');
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animation) { cancelAnimationFrame(raf); raf = 0; animation = null; state.position = state.target; state.animating = false; draw(); }
    });
    window.addEventListener('pagehide', () => { cancelAnimationFrame(raf); raf = 0; animation = null; state.animating = false; });
    window.addEventListener('pageshow', () => { if (state.ready) { state.position = state.target; draw(); } });
    window.addEventListener('resize', () => {
      if (state.visible && !travelling) window.scrollTo({top:topOf(gallery),behavior:'instant'});
    });
  }
  document.querySelectorAll('.project-gallery').forEach(initialize);
})();
