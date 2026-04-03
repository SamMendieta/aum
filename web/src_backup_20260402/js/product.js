// product.js — product page scripts
// Scales .cblock__crystal-name so the widest word always fits the column without any breaks.
// Approach: binary-search font size by measuring each word in a hidden probe element.

(function () {
  'use strict';

  var el = document.querySelector('.cblock__crystal-name');
  if (!el) return;

  // Override any CSS hyphens/wrap rules — no mid-word breaks allowed
  el.style.hyphens = 'none';
  el.style.webkitHyphens = 'none';
  el.style.overflowWrap = 'normal';
  el.style.wordBreak = 'normal';

  function fit() {
    var parent = el.parentElement;
    if (!parent) return;
    var available = parent.clientWidth;
    if (!available) return;

    var words = (el.textContent || '').trim().split(/\s+/);
    var cs = getComputedStyle(el);

    // Probe element: invisible, single-line, same font settings as the target
    var probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
      'position:absolute;top:-9999px;left:-9999px;visibility:hidden;' +
      'white-space:nowrap;pointer-events:none;' +
      'font-family:' + cs.fontFamily + ';' +
      'font-weight:' + cs.fontWeight + ';' +
      'letter-spacing:' + cs.letterSpacing + ';';
    document.body.appendChild(probe);

    // Measure the widest word at a given font size (px)
    function widestAt(size) {
      probe.style.fontSize = size + 'px';
      var max = 0;
      for (var i = 0; i < words.length; i++) {
        probe.textContent = words[i];
        var w = probe.offsetWidth;
        if (w > max) max = w;
      }
      return max;
    }

    // Binary search between 20px and 150px
    var lo = 20, hi = 150;

    if (widestAt(hi) <= available) {
      // Even at max size the widest word fits — use max
      el.style.fontSize = hi + 'px';
    } else {
      while (hi - lo > 1) {
        var mid = (lo + hi) >> 1;
        if (widestAt(mid) <= available) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      el.style.fontSize = lo + 'px';
    }

    document.body.removeChild(probe);
  }

  // Run after fonts are confirmed loaded (avoids measuring with fallback font)
  var ready = (typeof document.fonts !== 'undefined' && document.fonts.ready)
    ? document.fonts.ready
    : Promise.resolve();

  ready.then(function () {
    fit();

    // Re-fit on container resize (viewport change, zoom)
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(fit).observe(el.parentElement);
    } else {
      window.addEventListener('resize', fit);
    }
  });

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
