// reveal.js — scroll-triggered reveal for all pages
// Targets .rv (product pages), .reveal (editorial pages), .soap-entry (coleccion)
// Adding .soap-entry costs nothing on pages that don't have it.

(() => {
  'use strict';

  const els = document.querySelectorAll('.rv, .reveal, .soap-entry');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('in'));
  }

})();
