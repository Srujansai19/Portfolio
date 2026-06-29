/* ══════════════════════════════════════════════
   main.js — Core interactions for portfolio
   ══════════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── Header scroll morph + progress fallback ────
  const header = document.querySelector('.header');
  const progressBar = document.querySelector('.scroll-progress');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 48);

    // Scroll progress fallback for non-Chrome browsers
    if (progressBar && !CSS.supports('animation-timeline', 'scroll()')) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = docH > 0 ? window.scrollY / docH : 0;
      progressBar.style.transform = `scaleX(${pct})`;
    }

    // Active nav link spy
    const sections = document.querySelectorAll('section[id]');
    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) cur = s.id;
    });
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        a.classList.toggle('active', href === '#' + cur);
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Mobile Menu ────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navMobile.classList.toggle('open', open);
      document.body.classList.toggle('no-scroll', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.classList.remove('no-scroll');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ─── Parallax tilt on avatar scene (desktop only) ────
  const avatarScene = document.querySelector('.avatar-scene');
  if (avatarScene && window.matchMedia('(min-width:900px) and (pointer:fine)').matches) {
    document.addEventListener('mousemove', e => {
      const { innerWidth: W, innerHeight: H } = window;
      const rx = ((e.clientY / H) - 0.5) * -8;
      const ry = ((e.clientX / W) - 0.5) * 10;
      avatarScene.style.transform =
        `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    document.addEventListener('mouseleave', () => {
      avatarScene.style.transform = '';
    });
  }

  // ─── Project filter ─────────────────────────
  const pfBtns  = document.querySelectorAll('.pf-btn');
  const pfCards = document.querySelectorAll('.proj-card');

  pfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      pfCards.forEach(card => {
        const match = f === 'all' || card.dataset.cat === f;
        if (match) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.transition = 'opacity 0.25s ease';
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // ─── Skills tabs ────────────────────────────
  const sTabs   = document.querySelectorAll('.s-tab');
  const sPanels = document.querySelectorAll('.skills-panel');

  sTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const target = tab.dataset.tab;
      sPanels.forEach(p => {
        const show = p.dataset.panel === target;
        if (show) {
          p.classList.add('shown');
          p.style.animation = 'fadeUp 0.38s ease both';
          p.addEventListener('animationend', () => p.style.animation = '', { once: true });
        } else {
          p.classList.remove('shown');
        }
      });
    });
  });

  // ─── Contact form — proper mailto using anchor click ──
  const form       = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form && formStatus) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name    = (form.querySelector('#f-name')    || {}).value || '';
      const email   = (form.querySelector('#f-email')   || {}).value || '';
      const subject = (form.querySelector('#f-subject') || {}).value || '';
      const message = (form.querySelector('#f-message') || {}).value || '';

      // Validate
      if (!name || !email || !subject || !message) {
        formStatus.className = 'err';
        formStatus.textContent = 'Please fill in all fields before sending.';
        return;
      }

      const submitBtn = form.querySelector('[type=submit]');
      const origText  = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Opening email… <i class="fas fa-circle-notch fa-spin"></i>';

      const body = `Hi Srujan,\n\nMy name is ${name} (${email}).\n\n${message}`;
      const mailtoHref = `mailto:srujansaim04@gmail.com`
        + `?subject=${encodeURIComponent(subject)}`
        + `&body=${encodeURIComponent(body)}`;

      // Create a hidden anchor and click it — most reliable cross-browser approach
      const a = document.createElement('a');
      a.href   = mailtoHref;
      a.target = '_blank';
      a.rel    = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      formStatus.className = 'ok';
      formStatus.textContent = '✓ Your email client should open with the message pre-filled. If it didn\'t open, email srujansaim04@gmail.com directly.';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled  = false;
        submitBtn.innerHTML = origText;
        formStatus.className = '';
        formStatus.textContent = '';
      }, 6000);
    });
  }

  // ─── Smooth scroll with nav offset ──────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 76;
      window.scrollTo({ top: target.offsetTop - offset + 2, behavior: 'smooth' });
    });
  });

})();
