/* Aquila Executive: melhoria progressiva, sem dependências ou requisições externas. */
(() => {
  'use strict';
  const slider = document.querySelector('.executive-slider');
  if (!slider) return;
  const controls = slider.querySelector('.executive-controls');
  const indicators = [...slider.querySelectorAll('[data-slide-to]')];
  const playback = slider.querySelector('.executive-playback');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const slides = [slider.querySelector('[data-slide="0"]')];
  const pending = new Map();
  const failed = new Set();
  const interval = 7000;
  let current = 0, timer, started = 0, remaining = interval, request = 0, transition;
  let stopped = false, ready = false;

  function paused() {
    return stopped || motion.matches || document.hidden || slider.matches(':focus-within, :hover') || Boolean(document.querySelector('dialog[open]'));
  }

  function sync() {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
      remaining = Math.max(0, remaining - (performance.now() - started));
    }
    const running = ready && !paused();
    slider.classList.toggle('is-running', running);
    const label = motion.matches ? 'Reprodução automática desativada: movimento reduzido' : stopped ? 'Iniciar apresentação automática' : 'Pausar apresentação automática';
    playback.setAttribute('aria-label', label);
    playback.firstElementChild.textContent = stopped || motion.matches ? '▶' : 'Ⅱ';
    // Movimento reduzido sempre prevalece; seleção manual continua disponível.
    playback.disabled = motion.matches;
    if (running) {
      started = performance.now();
      timer = setTimeout(() => {
        timer = undefined;
        remaining = interval;
        let next = (current + 1) % indicators.length;
        while (failed.has(next) && next !== current) next = (next + 1) % indicators.length;
        if (next !== current) show(next, true);
        else { stopped = true; sync(); }
      }, remaining);
    }
  }

  async function load(index) {
    if (failed.has(index)) return null;
    if (pending.has(index)) return pending.get(index);
    if (slides[index]) return slides[index];
    const slide = slider.querySelector(`[data-executive-slide="${index}"]`).content.firstElementChild.cloneNode(true);
    const image = slide.querySelector('img');
    slider.insertBefore(slide, controls);
    const promise = image.decode().then(() => {
      slides[index] = slide;
      return slide;
    }).catch(() => {
      failed.add(index);
      slide.remove();
      return null;
    });
    pending.set(index, promise);
    return promise;
  }

  function settle() {
    clearTimeout(transition);
    for (const slide of slides.filter(Boolean)) {
      slide.classList.remove('is-entering');
      slide.classList.toggle('is-current', slide === slides[current]);
    }
  }

  async function show(index, automatic = false) {
    const ticket = ++request;
    if (index === current) return;
    const next = await load(index);
    if (ticket !== request) return;
    if (!next || (automatic && paused())) { sync(); return; }
    // Finaliza a composição anterior antes de iniciar outra (cliques rápidos).
    settle();
    const previous = slides[current];
    previous.setAttribute('aria-hidden', 'true');
    next.removeAttribute('aria-hidden');
    next.classList.add('is-current');
    if (!motion.matches) next.classList.add('is-entering');
    current = index;
    for (const [i, indicator] of indicators.entries()) {
      if (i === index) indicator.setAttribute('aria-current', 'true');
      else indicator.removeAttribute('aria-current');
    }
    clearTimeout(timer);
    timer = undefined;
    remaining = interval;
    sync();
    if (motion.matches) settle();
    else transition = setTimeout(settle, 900);
  }

  for (const [index, indicator] of indicators.entries()) indicator.addEventListener('click', () => { show(index); });
  controls.addEventListener('keydown', event => {
    const index = indicators.indexOf(document.activeElement);
    if (index < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? indicators.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + indicators.length) % indicators.length;
    indicators[next].focus();
    show(next);
  });
  playback.addEventListener('click', () => { stopped = !stopped; sync(); });
  slider.addEventListener('focusin', sync);
  slider.addEventListener('focusout', () => queueMicrotask(sync));
  slider.addEventListener('mouseenter', sync);
  slider.addEventListener('mouseleave', sync);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', () => { clearTimeout(timer); timer = undefined; remaining = interval; if (motion.matches) settle(); sync(); });
  // O popup de privacidade usa o foco modal, fora do figure.
  for (const dialog of document.querySelectorAll('dialog')) new MutationObserver(sync).observe(dialog, {attributes: true, attributeFilter: ['open']});

  controls.hidden = false;
  const first = slides[0].querySelector('img');
  first.decode().then(() => { ready = true; sync(); }).catch(() => {
    // Se a primeira imagem falhar, ainda é possível recuperar outra fotografia.
    failed.add(0); ready = true; show(1);
  });
  // Prepara somente a próxima foto, depois do carregamento crítico. Sem JS, fica a foto inicial.
  function warm() {
    setTimeout(() => {
      if (!motion.matches && !navigator.connection?.saveData && !document.hidden) load(1);
    }, 3000);
  }
  if (document.readyState === 'complete') warm();
  else window.addEventListener('load', warm, {once: true});
})();
