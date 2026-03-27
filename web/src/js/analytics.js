// Analytics event layer — wire to GA4 / Plausible / etc. when ready
// All WhatsApp CTAs have data-track="whatsapp-cta" + optional data-track-soap="{{ soap.slug }}"
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-track]');
  if (!btn) return;
  const event = {
    name: btn.dataset.track,
    soap: btn.dataset.trackSoap || null,
    location: btn.dataset.trackLocation || null,
    page: window.location.pathname,
    ts: Date.now()
  };
  // GA4 hook (uncomment when ready):
  // if (window.gtag) gtag('event', event.name, event);
  // Plausible hook (uncomment when ready):
  // if (window.plausible) plausible(event.name, { props: event });
  console.debug('[aum analytics]', event);
});
