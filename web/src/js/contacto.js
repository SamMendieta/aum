// contacto.js — FAQ accordion for contacto page only
// This JS must NOT be in nav.js or reveal.js — it is contacto-specific.

(() => {
  'use strict';

  const buttons = document.querySelectorAll('.faq-btn');
  if (!buttons.length) return;

  // Cache button–answer pairs once at init
  const pairs = [...buttons].map(btn => ({
    btn,
    answer: document.getElementById(btn.getAttribute('aria-controls'))
  }));

  // Single delegated listener on the FAQ container
  const faq = buttons[0].closest('.faq') || buttons[0].parentElement;
  faq.addEventListener('click', e => {
    const btn = e.target.closest('.faq-btn');
    if (!btn) return;

    const wasExpanded = btn.getAttribute('aria-expanded') === 'true';

    // Close all
    pairs.forEach(p => {
      p.btn.setAttribute('aria-expanded', 'false');
      if (p.answer) p.answer.classList.remove('open');
    });

    // Toggle clicked item if it was closed
    if (!wasExpanded) {
      btn.setAttribute('aria-expanded', 'true');
      const pair = pairs.find(p => p.btn === btn);
      if (pair && pair.answer) pair.answer.classList.add('open');
    }
  });

})();
