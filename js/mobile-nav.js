/* =========================================================================
   /js/mobile-nav.js — shared mobile navigation drawer for every page type
   (inline per-page headers, the site-chrome pages, and the
   chrome.js/partials.js blog articles).

   Supersedes the previous per-page mobile nav wiring: the hamburger and the
   Products parent link are cloned (cloneNode drops existing listeners), then
   re-bound here so every page behaves identically:

   - <= 980px: the hamburger opens a slide-in drawer (css/mobile-nav.css)
     with a dimmed backdrop, close button, scroll lock, Escape/overlay/link
     closing, focus management and a focus trap. The Products row works as an
     animated accordion whose first entry, "All Products", reaches
     products.html.
   - > 980px: nothing changes — Products still navigates and the dropdown
     still opens on hover/focus.
   ========================================================================= */
(function () {
  'use strict';

  var menu = document.getElementById('primary-menu');
  var toggle = document.querySelector('.nav-toggle');
  if (!menu || !toggle) return;

  var MQ = window.matchMedia('(max-width: 980px)');
  function isMobile() { return MQ.matches; }

  /* Replace the hamburger so previously attached listeners are gone. */
  var freshToggle = toggle.cloneNode(true);
  toggle.replaceWith(freshToggle);

  /* Backdrop + drawer header. The overlay is appended to .site-top (the
     drawer's stacking-context ancestor) so it always paints BELOW the drawer
     and ABOVE the page, whatever z-indexes the page uses. */
  var overlay = document.createElement('div');
  overlay.className = 'tgw-nav-overlay';
  var shell = document.querySelector('.site-top');
  (shell || document.body).appendChild(overlay);

  var head = document.createElement('div');
  head.className = 'tgw-nav-head';
  var title = document.createElement('span');
  title.className = 'tgw-nav-title';
  title.textContent = 'Menu';
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'tgw-nav-close';
  closeBtn.setAttribute('aria-label', 'Close menu');
  closeBtn.textContent = '\u2715';
  head.appendChild(title);
  head.appendChild(closeBtn);
  menu.insertBefore(head, menu.firstChild);

  function isOpen() { return menu.classList.contains('open'); }

  function setOpen(open) {
    menu.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.documentElement.classList.toggle('tgw-nav-lock', open);
    document.body.classList.toggle('tgw-nav-lock', open);
    freshToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    freshToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    freshToggle.textContent = open ? '\u2715' : '\u2630';
    if (open) {
      closeBtn.focus({ preventScroll: true });
    } else {
      menu.querySelectorAll('.has-dropdown.open').forEach(function (d) {
        d.classList.remove('open');
        var p = d.querySelector('a');
        if (p) p.setAttribute('aria-expanded', 'false');
      });
      if (document.activeElement === closeBtn) freshToggle.focus({ preventScroll: true });
    }
  }

  freshToggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!isOpen());
  });
  closeBtn.addEventListener('click', function () { setOpen(false); });
  overlay.addEventListener('click', function () { setOpen(false); });

  document.addEventListener('keydown', function (e) {
    /* Always run the full close (not just when the drawer looks open):
       the legacy per-page scripts also close the menu on Escape and fire
       first, which would otherwise leave the overlay and scroll lock stuck. */
    if (e.key === 'Escape') { setOpen(false); return; }
    if (!isOpen()) return;
    if (e.key === 'Tab') {
      var focusables = menu.querySelectorAll('a[href], button');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Products: accordion toggle on mobile, normal link on desktop. */
  menu.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    var fresh = link.cloneNode(true);
    link.replaceWith(fresh);
    fresh.addEventListener('click', function (e) {
      if (!isMobile()) return; /* desktop: navigate to products.html */
      e.preventDefault();
      e.stopPropagation();
      var item = fresh.parentElement;
      var open = item.classList.toggle('open');
      fresh.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* Close the drawer when any navigating link is chosen. */
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (!isOpen()) return;
      /* The Products parent row toggles the accordion on mobile — keep open. */
      if (isMobile() && a.parentElement && a.parentElement.classList.contains('has-dropdown')) return;
      setOpen(false);
    });
  });

  /* Leaving mobile closes everything. */
  var onChange = function (e) { if (!e.matches) setOpen(false); };
  if (MQ.addEventListener) MQ.addEventListener('change', onChange);
  else if (MQ.addListener) MQ.addListener(onChange);
})();
