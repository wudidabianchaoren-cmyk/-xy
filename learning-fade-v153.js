/* User-supplied React Bits FadeContent, adapted to the incumbent DOM.
 * Source: attachments/67f7a930-5fad-4dda-ac76-7c0e070215fa/已粘贴的文本.txt
 * Uses its focus/develop looks and exact exit + scrub measurement formula.
 * Link owns focus; its original img owns develop. No React migration or noise mask.
 */
(() => {
  'use strict';
  const gsap = window.gsap;
  if (!gsap) return;
  const clamp01 = value => Math.min(Math.max(value, 0), 1);
  const props = Object.freeze({ container: 'window', effect: ['focus', 'develop'], blur: 0, duration: 1.2, ease: 'power2.out', threshold: .1, initialOpacity: .25, trigger: 'scroll', once: false, exit: true, scrub: true });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = window.learningFadeState = { version: '32.153', source: 'user supplied React Bits FadeContent', props, reduced, updates: 0, pendingAnimationFrames: 0, images: [] };
  const records = [...document.querySelectorAll('.study-image')].map((element, index) => {
    const image = element.querySelector('img');
    element.dataset.fadeContent = 'focus-develop';
    const record = { index, element, image, figure: element.closest('figure'), progress: -1, timeline: null };
    if (!reduced) {
      record.timeline = gsap.timeline({ paused: true });
      // FadeContent focus: opacity share .6, blur 12px and scale .97.
      record.timeline.fromTo(element, { autoAlpha: props.initialOpacity }, { autoAlpha: 1, duration: props.duration * .6, ease: props.ease }, 0);
      record.timeline.fromTo(element, { filter: 'blur(12px)', scale: .97 }, { filter: 'blur(0px)', scale: 1, duration: props.duration, ease: props.ease }, 0);
      // FadeContent develop: grayscale / contrast / brightness, kept on a separate
      // nested target so its filter cannot overwrite the focus blur.
      record.timeline.fromTo(image, { autoAlpha: .55 }, { autoAlpha: 1, duration: props.duration * .5, ease: props.ease }, 0);
      record.timeline.fromTo(image, { filter: 'grayscale(1) contrast(.55) brightness(1.3) blur(0px)' }, { filter: 'grayscale(0) contrast(1) brightness(1) blur(0px)', duration: props.duration, ease: props.ease }, 0);
    }
    return record;
  });
  const stopUnusedTicker = () => {
    // Paused scrub timelines need no GSAP clock. Do not interrupt other active UI.
    if (!gsap.globalTimeline.getChildren(true, true, false).some(tween => tween.isActive())) gsap.ticker.sleep();
  };
  function update() {
    const height = innerHeight, scrolled = scrollY;
    const limit = Math.max(0, document.documentElement.scrollHeight - height);
    for (const record of records) {
      // Measure the untransformed figure; focus's .97 scale must not move its own
      // scroll threshold. The image height still defines the exit boundary.
      const top = record.figure.getBoundingClientRect().top + scrolled;
      const bottom = top + record.element.offsetHeight;
      const zone = height * Math.min(Math.max((1 - 2 * props.threshold) * .4, .05), .4);
      const revealed = Math.min(top - height * (1 - props.threshold) + zone, limit);
      let visible = clamp01((scrolled - revealed) / zone + 1);
      const outStart = Math.max(bottom - height * props.threshold - zone, 0);
      const outEnd = Math.max(bottom - height * props.threshold, outStart + zone / 2);
      visible = Math.min(visible, 1 - clamp01((scrolled - outStart) / (outEnd - outStart)));
      visible = reduced ? 1 : Math.round(visible * 1000) / 1000;
      if (visible !== record.progress) {
        record.progress = visible;
        record.timeline?.progress(visible);
        state.updates++;
      }
    }
    state.images = records.map(({ index, image, progress }) => ({ index, source: image.getAttribute('src'), progress }));
    stopUnusedTicker();
  }
  // The source's scrub=true performs direct progress updates, not a play-once
  // tween. Native scroll/resize/load drive it; there is no requestAnimationFrame loop.
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update, { passive: true });
  addEventListener('pageshow', update);
  for (const record of records) record.image.addEventListener('load', update);
  const observer = new ResizeObserver(update);
  records.forEach(record => observer.observe(record.figure));
  state.refresh = update;
  update();
})();
