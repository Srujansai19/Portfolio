/* Scroll Reveal — Lightweight IntersectionObserver */
(function () {
  'use strict';
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        o.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -44px 0px' });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  });
})();
