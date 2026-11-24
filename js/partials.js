/* =========================================================================
   /js/partials.js — injects the shared header/footer (from window.TGW_CHROME
   in chrome.js) into #site-header / #site-footer, then wires the mobile nav.

   Uses a <script>-delivered HTML string so it works on the file:// protocol
   (double-clicked files) as well as when served. No fetch() is used.
   ========================================================================= */
(function () {
  'use strict';

  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (!headerEl && !footerEl) return;

  if (window.TGW_CHROME) {
    if (headerEl) headerEl.innerHTML = window.TGW_CHROME.header;
    if (footerEl) footerEl.innerHTML = window.TGW_CHROME.footer;
  } else {
    console.warn('TGW_CHROME not found — did you include js/chrome.js before js/partials.js?');
  }

  markActive();
  wireNav();

  function markActive() {
    const path = location.pathname.replace(/index\.html$/, '');
    document.querySelectorAll('[data-nav-link]').forEach(function (a) {
      const key = a.getAttribute('data-nav-link');
      const want = key === 'home' ? '/' : '/' + key + '.html';
      if (path.endsWith(want)) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  function wireNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('primary-menu');
    if (!toggle || !menu) return;

    function setMenu(open) {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
      if (!open) {
        menu.querySelectorAll('.has-dropdown.open').forEach(function (d) {
          d.classList.remove('open');
          const p = d.querySelector('a');
          if (p) p.setAttribute('aria-expanded', 'false');
        });
      }
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!menu.classList.contains('open'));
    });

    const dropdownItems = menu.querySelectorAll('.has-dropdown');
    dropdownItems.forEach(function (item) {
      let closeTimer;
      const parentLink = item.querySelector('a');
      function openDropdown() {
        clearTimeout(closeTimer);
        item.classList.add('open');
        if (parentLink) parentLink.setAttribute('aria-expanded', 'true');
      }
      function closeDropdown() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(function () {
          item.classList.remove('open');
          if (parentLink) parentLink.setAttribute('aria-expanded', 'false');
        }, 250);
      }
      item.addEventListener('mouseenter', openDropdown);
      item.addEventListener('mouseleave', closeDropdown);
      item.addEventListener('focusin', openDropdown);
      item.addEventListener('focusout', closeDropdown);
    });

    const dropdownParents = menu.querySelectorAll('.has-dropdown > a');
    dropdownParents.forEach(function (parentLink) {
      parentLink.addEventListener('click', function (e) {
        if (!window.matchMedia('(max-width: 980px)').matches) return;
        e.preventDefault();
        e.stopPropagation();
        const item = parentLink.parentElement;
        const open = item.classList.toggle('open');
        parentLink.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        setMenu(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) setMenu(false);
    });
  }
})();
