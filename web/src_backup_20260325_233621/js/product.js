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
