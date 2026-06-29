/* ══════════════════════════════════════
   tilt.js — 3D tilt effect on project cards
   ══════════════════════════════════════ */
(function () {
  'use strict';

  // Only on devices with fine pointer (mouse)
  if (!window.matchMedia('(pointer:fine)').matches) return;

  const MAX_TILT = 9; // degrees
  const PERSPECTIVE = 800;

  function applyTilt(card, e) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const tiltX = (dy / (rect.height / 2)) * -MAX_TILT;
    const tiltY = (dx / (rect.width  / 2)) *  MAX_TILT;

    card.style.transform =
      `perspective(${PERSPECTIVE}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.025) translateY(-4px)`;
    card.style.boxShadow =
      `0 24px 56px rgba(0,0,0,0.5), 0 0 24px rgba(124,58,237,0.25)`;

    // Move inner glow toward cursor
    const glowEl = card.querySelector('.tilt-glow');
    if (glowEl) {
      const px = ((e.clientX - rect.left) / rect.width)  * 100;
      const py = ((e.clientY - rect.top)  / rect.height) * 100;
      glowEl.style.background =
        `radial-gradient(circle at ${px}% ${py}%, rgba(124,58,237,0.18) 0%, transparent 65%)`;
    }
  }

  function resetTilt(card) {
    card.style.transform  = '';
    card.style.boxShadow  = '';
    const glowEl = card.querySelector('.tilt-glow');
    if (glowEl) glowEl.style.background = '';
  }

  function initTilt() {
    document.querySelectorAll('.proj-card').forEach(card => {
      // Inject glow layer
      if (!card.querySelector('.tilt-glow')) {
        const glow = document.createElement('div');
        glow.className = 'tilt-glow';
        card.prepend(glow);
      }

      card.style.transition = 'transform 0.08s ease-out, box-shadow 0.08s ease-out';
      card.style.willChange = 'transform';

      card.addEventListener('mousemove',  e => applyTilt(card, e));
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.4s var(--ease-out), box-shadow 0.4s ease';
        resetTilt(card);
        // Restore fast transition after settle
        setTimeout(() => {
          card.style.transition = 'transform 0.08s ease-out, box-shadow 0.08s ease-out';
        }, 400);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }
})();
