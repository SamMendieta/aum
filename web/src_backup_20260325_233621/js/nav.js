// nav.js — unified nav JS for all 11 pages
// Handles: drawer open/close, focus trap, Escape key, scroll state
// Standardised on System B IDs: id="nav", id="navToggle", id="navDrawer"
// All pages will use these IDs after Phase 2 migration.

(() => {
  'use strict';

  // ── Nav scroll state (adds .scrolled class on scroll)
  // Used by nosotros, index (scrolled) and coleccion, contacto (at-top variant)
  const nav = document.getElementById('nav');
  if (nav) {
    let ticking = false;
    const updateNav = () => {
      nav.classList.toggle('scrolled', window.scrollY > 56);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
    }, { passive: true });
  }

  // ── Drawer open/close with focus trap
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('navDrawer');
  if (!toggle || !drawer) return;

  const drawerLinks = drawer.querySelectorAll('a');
  let isOpen = false;

  const openD = () => {
    isOpen = true;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (drawerLinks.length) drawerLinks[0].focus();
  };

  const closeD = () => {
    isOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú de navegación');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    toggle.focus();
  };

  toggle.addEventListener('click', () => isOpen ? closeD() : openD());
  drawerLinks.forEach(a => a.addEventListener('click', closeD));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeD();
  });

  drawer.addEventListener('keydown', e => {
    if (!isOpen || e.key !== 'Tab') return;
    const first = drawerLinks[0];
    const last  = drawerLinks[drawerLinks.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

})();
