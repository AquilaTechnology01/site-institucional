/* Entrada progressiva: o conteúdo permanece visível sem JS ou suporte a animações. */
(() => {
  'use strict';
  const section = document.querySelector('#projetos');
  if (!section || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = [...section.querySelectorAll('.project-card')];
  const animations = new Map();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (motion.matches || entry.target.matches(':focus-within')) continue;
      const index = cards.indexOf(entry.target);
      const animation = entry.target.animate([
        {opacity: 0, transform: 'translateY(12px)'},
        {opacity: 1, transform: 'translateY(0)'}
      ], {duration: 500, delay: (index % 2) * 80, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'backwards'});
      animations.set(entry.target, animation);
      animation.onfinish = () => animations.delete(entry.target);
    }
  }, {threshold: .08});
  cards.forEach(card => observer.observe(card));
  section.addEventListener('focusin', event => {
    const card = event.target.closest('.project-card');
    animations.get(card)?.finish();
  });
  motion.addEventListener('change', () => {
    if (motion.matches) animations.forEach(animation => animation.finish());
  });
})();
