(() => {
  'use strict';
  const film = document.getElementById('projectFilm');
  const state = window.workProjectState = {playing:false,visible:false,mutedFallback:false,returned:false};
  let visible = false, disposed = false, sourceReady = false, parentVisible=window.parent===window;
  async function play() {
    if (!film || !sourceReady || !visible || !parentVisible || document.hidden || disposed) return;
    try { await film.play(); }
    catch {
      if (!visible || disposed) return;
      film.muted = true; state.mutedFallback = true;
      try { await film.play(); } catch { /* A subsequent user gesture can start playback. */ }
    }
  }
  if (film) {
    film.controls = false;
    film.autoplay = true;
    film.playsInline = true;
    film.preload = 'auto';
    // Keep the authored cover visible until the compositor has an actual
    // movie frame. A media element's black background must not cover it early.
    film.style.opacity='0';
    const revealFrame=()=>{const shown=()=>{film.style.opacity='1';state.firstFrameAt??=performance.now();document.dispatchEvent(new Event('portfolio:work-first-frame'));};if(film.requestVideoFrameCallback)film.requestVideoFrameCallback(shown);else if(film.readyState>=2)requestAnimationFrame(shown);};
    film.addEventListener('playing',revealFrame);
    film.addEventListener('loadeddata',()=>{if(film.paused&&film.readyState>=2){film.style.opacity='1';state.coverReadyAt=performance.now();}});
    film.addEventListener('play', () => { state.playing = true; });
    film.addEventListener('pause', () => { state.playing = false; });
    film.addEventListener('canplay', () => { void play(); });
    film.addEventListener('click', () => {
      if (film.muted && state.mutedFallback) { film.muted = false; state.mutedFallback = false; void play(); }
      else if (film.paused) void play(); else film.pause();
    });
    const reveal = src => {
      if (!src || disposed) return;
      film.src = src; film.hidden = false; sourceReady = true; void play();
    };
    if (film.dataset.src) reveal(film.dataset.src);
    else fetch('./assets/works/' + document.body.dataset.project + '/manifest.json')
      .then(r => { if (!r.ok) throw Error('Project media manifest unavailable'); return r.json(); })
      .then(data => { if (data.film) reveal(data.film); })
      .catch(error => console.error(error));
    new IntersectionObserver(entries => {
      visible = entries[0].intersectionRatio >= .5; state.visible = visible;
      if (visible) void play(); else film.pause();
    }, {threshold:[0,.5]}).observe(document.getElementById('film'));
  }
  document.querySelectorAll('[data-project-return]').forEach(link => link.addEventListener('click', event => {
    state.returned = true; film?.pause();
    if (window.parent !== window) {
      event.preventDefault(); window.parent.postMessage({type:'brain-universe:work-return'}, location.origin); return;
    }
    let context; try { context = JSON.parse(sessionStorage.getItem('brain-universe-work-return') || 'null'); } catch {}
    if (context?.active && context.href) { event.preventDefault(); location.href = context.href; }
  }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) film?.pause(); else void play(); });
  window.addEventListener('message', event => {
    if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='brain-universe:project-visible'||!film)return;
    const bounds=document.getElementById('film').getBoundingClientRect();
    parentVisible=true;visible=Math.min(bounds.bottom,innerHeight)-Math.max(bounds.top,0)>=innerHeight*.5;state.visible=visible;void play();
  });
  window.addEventListener('pagehide', () => { disposed = true; film?.pause(); });
  window.addEventListener('pageshow', () => { disposed = false; void play(); });
})();
