/* ══════════════════════════════════════
   loader.js — Intro screen animation
   ══════════════════════════════════════ */
(function () {
  'use strict';

  const loader = document.getElementById('site-loader');
  if (!loader) return;

  // Only play on first visit per session
  if (sessionStorage.getItem('srujan_loaded')) {
    loader.style.display = 'none';
    return;
  }

  document.documentElement.classList.add('is-loading');

  // Step 1: logo animates in (handled by CSS)
  // Step 2: bar fills over 1s
  // Step 3: at 1.4s → split panels exit, reveal site

  setTimeout(() => {
    loader.classList.add('exit');
    document.documentElement.classList.remove('is-loading');
    sessionStorage.setItem('srujan_loaded', '1');

    loader.addEventListener('transitionend', () => {
      loader.style.display = 'none';
    }, { once: true });
  }, 1600);
})();
