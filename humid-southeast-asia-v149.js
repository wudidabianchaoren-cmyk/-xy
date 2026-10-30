/* V149: a complete user-supplied film with native playback and seeking controls. */
(() => {
  'use strict';
  const film = document.getElementById('projectFilm');
  const section = document.getElementById('film');
  const state = window.workProjectState = { version: '32.149', playing: false, visible: false, mutedFallback: false, returned: false };
  let visible = false, disposed = false, userPaused = false, programmaticPause = false;
  const visibleNow = () => {
    const bounds = section.getBoundingClientRect();
    return Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0) >= innerHeight * .5;
  };
  const pause = () => {
    if (!film || film.paused) return;
    programmaticPause = true;
    film.pause();
  };
  async function play() {
    if (!film || !visible || document.hidden || disposed || userPaused) return;
    try { await film.play(); }
    catch {
      if (!visible || disposed) return;
      film.muted = true;
      state.mutedFallback = true;
      try { await film.play(); } catch { /* Native play controls remain available. */ }
    }
  }
  if (film) {
    film.src = film.dataset.src;
    film.controls = true;
    film.addEventListener('play', () => { state.playing = true; userPaused = false; });
    film.addEventListener('pause', () => {
      state.playing = false;
      if (!programmaticPause && visible && !film.ended && !document.hidden && !disposed) userPaused = true;
      programmaticPause = false;
    });
    film.addEventListener('volumechange', () => { state.mutedFallback = film.muted; });
    film.addEventListener('canplay', () => { void play(); });
    // Native controls own play/pause, scrubbing, volume and fullscreen.
    new IntersectionObserver(entries => {
      visible = entries[0].intersectionRatio >= .5;
      state.visible = visible;
      if (visible) void play(); else pause();
    }, { threshold: [0, .5] }).observe(section);
  }
  document.querySelectorAll('[data-project-return]').forEach(link => link.addEventListener('click', event => {
    state.returned = true; pause();
    if (window.parent !== window) {
      event.preventDefault();
      window.parent.postMessage({ type: 'brain-universe:work-return' }, location.origin);
      return;
    }
    let context;
    try { context = JSON.parse(sessionStorage.getItem('brain-universe-work-return') || 'null'); } catch {}
    if (context?.active && context.href) { event.preventDefault(); location.href = context.href; }
  }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause(); else { visible = visibleNow(); state.visible = visible; void play(); }
  });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== window.parent || event.data?.type !== 'brain-universe:project-visible') return;
    visible = visibleNow(); state.visible = visible; void play();
  });
  window.addEventListener('pagehide', () => { disposed = true; pause(); });
  window.addEventListener('pageshow', () => { disposed = false; visible = visibleNow(); state.visible = visible; void play(); });
})();
