// fit-text.js — shared font-fitter utility
// Scales text so the widest word always fits the element's own width.
// Exposes window.fitTextAll(selector, opts)
// No dependencies. Used by product.js and coleccion.js.

(function () {
  'use strict';

  function createProbe(el) {
    var cs = getComputedStyle(el);
    var probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
      'position:absolute;top:-9999px;left:-9999px;visibility:hidden;' +
      'white-space:nowrap;pointer-events:none;' +
      'font-family:' + cs.fontFamily + ';' +
      'font-weight:' + cs.fontWeight + ';' +
      'letter-spacing:' + cs.letterSpacing + ';' +
      'text-transform:' + cs.textTransform + ';';
    document.body.appendChild(probe);
    return probe;
  }

  function fitOne(el, probe, opts) {
    // Measure the ELEMENT's own width — not the parent's
    var available = el.clientWidth;
    if (!available) return;

    // Copy this element's font properties to probe (elements may differ)
    var cs = getComputedStyle(el);
    probe.style.fontFamily = cs.fontFamily;
    probe.style.fontWeight = cs.fontWeight;
    probe.style.letterSpacing = cs.letterSpacing;
    probe.style.textTransform = cs.textTransform;

    var words = (el.textContent || '').trim().split(/\s+/);
    var lo = opts.min || 20;
    var hi = opts.max || 150;

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

    if (widestAt(hi) <= available) {
      el.style.fontSize = hi + 'px';
    } else if (widestAt(lo) > available) {
      el.style.fontSize = lo + 'px';
    } else {
      while (hi - lo > 1) {
        var mid = (lo + hi) >> 1;
        if (widestAt(mid) <= available) lo = mid;
        else hi = mid;
      }
      el.style.fontSize = lo + 'px';
    }
  }

  window.fitTextAll = function (selector, opts) {
    opts = opts || {};
    var els = document.querySelectorAll(selector);
    if (!els.length) return;

    function run() {
      var probe = createProbe(els[0]);
      for (var i = 0; i < els.length; i++) {
        fitOne(els[i], probe, opts);
      }
      document.body.removeChild(probe);
    }

    var ready = (typeof document.fonts !== 'undefined' && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();

    ready.then(function () {
      run();
      if (typeof ResizeObserver !== 'undefined') {
        var ro = new ResizeObserver(run);
        for (var i = 0; i < els.length; i++) {
          ro.observe(els[i]);
        }
      } else {
        window.addEventListener('resize', run);
      }
    });
  };
})();
