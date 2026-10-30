(() => {
  'use strict';
  if (document.body.dataset.project !== 'home-creation') return;
  const gallery = document.getElementById('gallery');
  const film = document.getElementById('film');
  const about = document.getElementById('about');
  if (!gallery || !film || !about) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = window.homeGalleryBoundary = {
    entries: 0, forwardedGestures: 0, blockedEvents: 0,
    minimumDwell: 1200, gestureQuiet: 280, wheelThreshold: 100,
    phase: 'film', holdUntil: 0, version: '32.102'
  };
  let lastWheel = -Infinity, accumulated = 0, consumed = false, lastDirection = 0;
  let arriving = false, departing = false, departureUntil = 0;
  const positions = {gallery: gallery.offsetTop, about: about.offsetTop};
  new ResizeObserver(() => {
    positions.gallery = gallery.offsetTop;
    positions.about = about.offsetTop;
  }).observe(document.querySelector('main'));
  const aligned = () => Math.abs(scrollY - positions.gallery) < 12;
  const stop = event => { event.preventDefault(); event.stopImmediatePropagation(); state.blockedEvents++; };
  function arrive() {
    arriving = true; departing = false; consumed = true; accumulated = 0;
    state.entries++; state.phase = 'arriving'; state.holdUntil = performance.now() + 1850;
    window.scrollTo({top: positions.gallery, behavior: reduced ? 'instant' : 'smooth'});
  }
  window.addEventListener('scroll', () => {
    if (aligned()) {
      if (arriving) {
        arriving = false; state.holdUntil = performance.now() + state.minimumDwell;
      } else if (state.phase !== 'gallery' && !departing) {
        state.entries++; state.holdUntil = performance.now() + state.minimumDwell;
      }
      state.phase = 'gallery';
    } else if (!arriving && !departing) {
      state.phase = scrollY < positions.gallery ? 'film' : 'description';
    }
  }, {passive: true});
  window.addEventListener('wheel', event => {
    if (event.ctrlKey) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (Math.abs(delta) < 2) return;
    const now = performance.now(), direction = Math.sign(delta);
    const freshGesture = now - lastWheel > state.gestureQuiet || direction !== lastDirection;
    if (freshGesture) { consumed = false; accumulated = 0; }
    lastWheel = now; lastDirection = direction;
    if (departing && now < departureUntil) { stop(event); return; }
    if (departing) departing = false;
    const enteringFromFilm = direction > 0 && scrollY < positions.gallery - 12;
    const enteringFromDescription = direction < 0 && scrollY > positions.gallery + 12 && scrollY <= positions.about + innerHeight * .65;
    if (arriving || aligned()) {
      if (arriving || now < state.holdUntil || consumed || !window.afterJourneyState?.ready || window.afterJourneyState.animating) {
        // A gesture that starts during the hold is consumed in full, even if its inertia
        // continues after the timer ends. Only a fresh gesture can advance again.
        consumed = true;
        stop(event); return;
      }
      accumulated += Math.abs(delta);
      if (accumulated < state.wheelThreshold) { stop(event); return; }
      consumed = true; accumulated = 0; state.forwardedGestures++;
      state.holdUntil = now + state.minimumDwell + (reduced ? 0 : 720);
      const current = window.afterJourneyState;
      if ((direction < 0 && current.index === 0) || (direction > 0 && current.index === current.views - 1)) {
        departing = true; departureUntil = now + 1050; state.phase = 'departing';
      }
      // Exactly one accepted gesture reaches the existing synchronized image/mirror animation.
      // The rest of a mouse or trackpad burst stays on the current gallery view.
      return;
    }
    if (enteringFromFilm || enteringFromDescription) {
      stop(event); accumulated += Math.abs(delta);
      if (!consumed && accumulated >= state.wheelThreshold) arrive();
    }
  }, {capture: true, passive: false});
  window.addEventListener('keydown', event => {
    if (!['ArrowDown','ArrowUp','PageDown','PageUp',' '].includes(event.key) || event.target.closest('input,textarea,select,button,a')) return;
    if (!aligned() && !arriving) return;
    const now = performance.now();
    if (arriving || now < state.holdUntil || window.afterJourneyState?.animating || event.repeat) {
      stop(event); return;
    }
    event.preventDefault(); event.stopImmediatePropagation();
    lastWheel = -Infinity;
    const down = ['ArrowDown','PageDown',' '].includes(event.key);
    window.dispatchEvent(new WheelEvent('wheel', {deltaY: down ? 120 : -120, cancelable: true}));
  }, {capture: true});
})();
