/* ============================================================
   Black November 2026 promo — pop-up (A) + sidebar injector
   Loaded via <script src="js/promo-bn.js" defer> on main root
   pages together with css/promo-bn.css. Assumes root-page depth
   (same-folder paths), like every page it is tagged on.

   Behaviour (as approved in black-november-preview.html):
   - Popup A auto-opens 2.5 s after load, once per browser
     session (sessionStorage key tgw_bn_popup_seen); close via
     ✕, outside click or Escape; page scroll locked while open.
   - Sidebar tab on the right edge, hover/tap expands the card;
     ✕ hides it for 7 days (localStorage tgw_bn_sidebar_until).
     Hidden below 1100 px by the stylesheet.
   - Popup shows the Black November campaign flyer image, fully
     clickable, linking to specials.html; clicks fire a GA event
     when gtag is present.
   - Auto-retires after 30 Nov 2026 23:59 SAST — the script
     exits and injects nothing. Removing the two tags per page
     is only final cleanup.
   ============================================================ */
(function () {
  'use strict';

  /* ---- kill switch: 1 Dec 2026 00:00 SAST ---- */
  if (Date.now() > Date.parse('2026-11-30T22:00:00Z')) return;
  if (document.getElementById('bnPop') || document.getElementById('bnSide')) return; /* idempotent */

  var POPUP_KEY = 'tgw_bn_popup_seen';
  var SIDE_KEY = 'tgw_bn_sidebar_until';
  var FLYER = 'partial/promos/black-november-brand-sale-1x1.png';

  /* ---- fonts: some tagged pages (products, LSW) load no Google Fonts ---- */
  if (!document.querySelector('link[href*="fonts.googleapis"]')) {
    var fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,700;0,800;0,900;1,900&family=Inter:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fonts);
  }

  /* ---- storage helpers (private-mode safe) ---- */
  function sget(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} }
  function lget(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lset(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }

  /* ---- GA: one event per specials-CTA click, when gtag exists ---- */
  function track(placement) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'bn_specials_click', { placement: placement });
    }
  }

  var lastFocus = null;

  /* ============================ MARKUP ============================ */
  var POPUP_HTML = [
    '<div class="bn-overlay" id="bnPop" role="dialog" aria-modal="true" aria-label="Black November tyre specials" hidden>',
    '  <div class="bn-pop">',
    '    <button class="bn-close" data-close aria-label="Close promotion">\u2715</button>',
    '    <a class="bn-pop__imglink" href="specials.html" data-bntrack="popup" aria-label="Black November tyre specials \u2014 enquire today">',
    '      <img class="bn-pop__img" src="' + FLYER + '" alt="Black November tyre sale \u2014 Goodyear Farm Tyres and Titan tyres. Full range available: agriculture, mining, construction, military. Enquire today at Titan Global Wheel.">',
    '    </a>',
    '  </div>',
    '</div>'
  ].join('\n');

  var SIDE_HTML = [
    '<div class="bn-side" id="bnSide" role="complementary" aria-label="Black November promotion">',
    '  <aside class="bn-side__card">',
    '    <button class="bn-side__close" data-sideclose aria-label="Hide Black November sidebar">\u2715</button>',
    '    <h3>BLACK <em>NOVEMBER</em></h3>',
    '    <span class="bn-side__pill">TYRE SPECIALS ON NOW</span>',
    '    <ul class="bn-side__list">',
    '      <li><b>SUPREME TFC</b><small>(GOODYEAR)</small><p>12.4-24 \u2192 20.8-38</p></li>',
    '      <li><b>OPTITRAC</b><small>(GOODYEAR)</small><p>280/70R18 \u2192 480/80R46</p></li>',
    '    </ul>',
    '    <a class="bn-side__cta" href="specials.html" data-bntrack="sidebar">ENQUIRE&nbsp;TODAY</a>',
    '    <p class="bn-side__fine">40+ models on special</p>',
    '  </aside>',
    '  <button class="bn-side__tab" id="bnSideTab" aria-expanded="false">BLACK&nbsp;NOVEMBER</button>',
    '</div>'
  ].join('\n');

  /* ============================ POPUP ============================ */
  var ov = null;

  function openPopup() {
    if (!ov) return;
    lastFocus = document.activeElement;
    ov.hidden = false;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { ov.classList.add('bn-show'); });
    });
    document.body.classList.add('bn-lock');
    var c = ov.querySelector('[data-close]');
    if (c) c.focus();
  }

  function closePopup() {
    if (!ov) return;
    ov.classList.remove('bn-show');
    document.body.classList.remove('bn-lock');
    setTimeout(function () { ov.hidden = true; }, 230);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ============================ INIT ============================ */
  /* GA wiring first so it covers both blocks */
  document.body.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-bntrack]') : null;
    if (a) track(a.getAttribute('data-bntrack'));
  });

  /* popup (once per session) */
  if (!sget(POPUP_KEY)) {
    document.body.insertAdjacentHTML('beforeend', POPUP_HTML);
    ov = document.getElementById('bnPop');
    ov.addEventListener('click', function (e) { if (e.target === ov) closePopup(); });
    ov.querySelector('[data-close]').addEventListener('click', closePopup);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ov && !ov.hidden) closePopup();
    });
  }

  /* sidebar (unless dismissed for 7 days) */
  var until = parseInt(lget(SIDE_KEY) || '0', 10);
  if (!(until > Date.now())) {
    document.body.insertAdjacentHTML('beforeend', SIDE_HTML);
    var side = document.getElementById('bnSide');
    var tab = document.getElementById('bnSideTab');
    tab.addEventListener('click', function () {
      var on = side.classList.toggle('bn-force');
      tab.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    side.querySelector('[data-sideclose]').addEventListener('click', function (e) {
      e.stopPropagation();
      lset(SIDE_KEY, String(Date.now() + 7 * 24 * 60 * 60 * 1000));
      side.classList.remove('bn-force');
      side.hidden = true;
    });
  }

  /* auto-open 2.5 s after load; the session key is set when it fires */
  setTimeout(function () {
    if (!sget(POPUP_KEY)) {
      sset(POPUP_KEY, '1');
      openPopup();
    }
  }, 2500);
})();
