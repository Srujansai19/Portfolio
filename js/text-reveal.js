/* ══════════════════════════════════════
   text-reveal.js — Clip-path word reveals
   ══════════════════════════════════════ */
(function () {
  'use strict';

  function splitIntoWordSpans(el) {
    if (!el || el.dataset.split) return;
    el.dataset.split = 'true';

    // Don't split elements that already have child elements (e.g. <br>, <span>)
    // Instead wrap each text node word-by-word
    const html = el.innerHTML;
    const wrapped = html.replace(/(<[^>]+>)|([^<>\s]+)/g, (match, tag, word) => {
      if (tag) return tag; // keep HTML tags intact
      return `<span class="word-reveal">${word}</span>`;
    });
    el.innerHTML = wrapped;
  }

  function initReveal() {
    // Target section labels and titles
    const targets = document.querySelectorAll('.sec-label, .sec-title, .hero-name');

    targets.forEach(el => {
      splitIntoWordSpans(el);
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const words = entry.target.querySelectorAll('.word-reveal');
        words.forEach((w, i) => {
          setTimeout(() => w.classList.add('revealed'), i * 80);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    targets.forEach(el => obs.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();
