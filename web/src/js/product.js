// product.js — product page scripts
// Font fitting delegated to fit-text.js shared utility.

(function () {
  'use strict';
  var el = document.querySelector('.cblock__crystal-name');
  if (!el) return;
  el.style.hyphens = 'none';
  el.style.webkitHyphens = 'none';
  el.style.overflowWrap = 'normal';
  el.style.wordBreak = 'normal';

  if (typeof window.fitTextAll === 'function') {
    window.fitTextAll('.cblock__crystal-name', { min: 20, max: 150 });
  }
})();

// ── Lightbox gallery ──
(function () {
  'use strict';

  var lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  var img = lightbox.querySelector('.lightbox__img');
  var counter = lightbox.querySelector('.lightbox__counter');
  var thumbs = document.querySelectorAll('.gallery__thumb');
  var closeBtn = lightbox.querySelector('.lightbox__close');
  var prevBtn = lightbox.querySelector('.lightbox__prev');
  var nextBtn = lightbox.querySelector('.lightbox__next');
  var sources = [];
  var alts = [];
  var current = 0;
  var previousFocus = null;
  var focusable = [closeBtn, prevBtn, nextBtn];

  // Collect image sources from thumbnails
  thumbs.forEach(function (thumb) {
    var thumbImg = thumb.querySelector('img');
    if (thumbImg) {
      sources.push(thumbImg.src);
      alts.push(thumbImg.alt || '');
    }
  });

  if (!sources.length) return;

  function show(index) {
    current = (index + sources.length) % sources.length;
    img.classList.remove('loaded');
    img.src = sources[current];
    img.alt = alts[current];
    counter.textContent = (current + 1) + ' / ' + sources.length;
  }

  function open(index) {
    previousFocus = document.activeElement;
    show(index);
    lightbox.removeAttribute('hidden');
    // Force reflow before adding visible state
    lightbox.offsetHeight;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    var restoreTarget = previousFocus;
    setTimeout(function () {
      lightbox.setAttribute('hidden', '');
    }, 300);
    if (restoreTarget) restoreTarget.focus();
  }

  // Image loaded handler
  img.addEventListener('load', function () {
    img.classList.add('loaded');
  });

  // Thumbnail clicks
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var index = parseInt(thumb.getAttribute('data-index'), 10);
      open(index);
    });
  });

  // Close button
  closeBtn.addEventListener('click', close);

  // Prev / Next
  prevBtn.addEventListener('click', function () {
    show(current - 1);
  });
  nextBtn.addEventListener('click', function () {
    show(current + 1);
  });

  // Click backdrop to close
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__stage')) {
      close();
    }
  });

  // Keyboard navigation + focus trap
  document.addEventListener('keydown', function (e) {
    if (lightbox.getAttribute('aria-hidden') !== 'false') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'Tab') {
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();
