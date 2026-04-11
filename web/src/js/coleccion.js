// coleccion.js — page-specific JS for coleccion only
// Handles: soap-nav active highlight on scroll, smooth scroll with offset

(() => {
  'use strict';

  // ── SOAP NAV — active highlight on scroll
  const soapNavItems = document.querySelectorAll('.soap-nav__item');
  const soapSections = [...document.querySelectorAll('.soap-section[id]')];

  if ('IntersectionObserver' in window && soapSections.length) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          soapNavItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.35 });
    soapSections.forEach(s => navObs.observe(s));
  }

  // ── SMOOTH SCROLL for soap-nav links (offset for fixed nav height)
  const navEl = document.getElementById('nav');
  const soapNavEl = document.querySelector('.soap-nav');

  soapNavItems.forEach(item => {
    item.addEventListener('click', e => {
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = navEl ? navEl.offsetHeight : 66;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
    });
  });

  // ── AT-TOP nav state for coleccion (starts solid, transparent at top)
  const nav = document.getElementById('nav');
  if (nav) {
    let ticking = false;
    const updateNav = () => {
      nav.classList.toggle('at-top', window.scrollY < 40);
      ticking = false;
    };
    // Set initial state
    updateNav();
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
    }, { passive: true });

    // :has() fallback — sync body.nav-scrolled with #nav.scrolled
    if (!CSS.supports('selector(:has(*))')) {
      const obs = new MutationObserver(() => {
        document.body.classList.toggle('nav-scrolled', nav.classList.contains('scrolled'));
      });
      obs.observe(nav, { attributes: true, attributeFilter: ['class'] });
    }
  }

  // ── FONT FIT — scale .soap-entry__name so widest word never overflows
  if (typeof window.fitTextAll === 'function') {
    window.fitTextAll('.soap-entry__name', { min: 18, max: 42 });
  }

})();
