/* =========================================================================
 ../../../chrome.js — single source of the shared header & footer HTML.
   Exposed as window.TGW_CHROME so partials.js can inject it WITHOUT fetch().
   (Scripts load on file://; fetch() does not.)

   Links inside the chrome are written with a ../../../ prefix (the legacy
   article location). At load time the prefix is recomputed from the current
   page depth, so the same chrome works on /src/news/articles/x.html (depth 3)
   and /blog/<slug>/ (depth 2) pages, plus file:// double-click preview.
   ========================================================================= */
// How many levels below the site root is this page?
//   /index.html            → 0
//   /about.html            → 0
//   /blog/<slug>/          → 2
//   /src/news/articles/x   → 3
// On file:// we discover the site root from this script's own URL
// (<root>/js/chrome.js) and count the hops from the current page up to it.
function tgwPagePrefix() {
  if (location.protocol === 'file:') {
    const src = (document.currentScript && document.currentScript.src) || '';
    if (src) {
      const root = src.split('/').slice(0, -2).join('/') + '/';
      const dir = location.href.slice(0, location.href.lastIndexOf('/') + 1);
      const r = root.split('/').filter(Boolean);
      const d = dir.split('/').filter(Boolean);
      let i = 0;
      while (i < r.length && i < d.length && r[i] === d[i]) i++;
      return '../'.repeat(Math.max(0, d.length - i));
    }
    return '../../../'; // fallback: legacy article depth
  }
  const p = location.pathname;
  const parts = p.split('/').filter(Boolean);
  if (parts.length === 0) return '';              // site root
  return '../'.repeat(p.endsWith('/') ? parts.length : parts.length - 1);
}
const TGW_PREFIX = tgwPagePrefix();
const TGW_RELINK = function (s) { return s.replace(/\.\.\/\.\.\/\.\.\//g, TGW_PREFIX); };
window.TGW_CHROME = {
  header: TGW_RELINK(
    '<!-- ============ HEADER ============ -->' +
    '<div class="site-top">' +
    '<header class="site" id="top">' +
      '<div class="wrap nav">' +
        '<a class="brand" href="../../../index.html" data-nav-home aria-label="Titan Global Wheel home">' +
          '<img class="logo-h" src="../../../src/logos/Titan%20Global%20Wheel%20_logo_hortizontal_2021_1.png" alt="Titan Global Wheel" />' +
        '</a>' +
        '<nav id="primary-menu" class="nav-links" aria-label="Primary">' +
          '<a href="../../../about.html" data-nav-link="about">About</a>' +
          '<div class="nav-item has-dropdown">' +
            '<a href="../../../products.html" aria-haspopup="true" aria-expanded="false">Products <span class="caret" aria-hidden="true"></span></a>' +
            '<ul class="dropdown">' +
              '<li><a href="../../../products.html" class="dd-overview">All Products</a></li>' +
              '<li><a href="../../../tyres.html">Tyres</a></li>' +
              '<li><a href="../../../rims.html">Rims</a></li>' +
              '<li><a href="../../../accessories.html">Accessories</a></li>' +
              '<li><a href="../../../runflats.html">Runflats</a></li>' +
              '<li><a href="../../../nama.html">NAMA X/T</a></li>' +
              '<li><a href="../../../LSW.html">LSW</a></li>' +
            '</ul>' +
          '</div>' +
          '<a href="../../../news.html" data-nav-link="news">News</a>' +
          '<a href="../../../events.html" data-nav-link="events">Events</a>' +
          '<a href="../../../contact.html" data-nav-link="contact">Contact Us</a>' +
        '</nav>' +
        '<div class="nav-cta">' +
          '<button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="primary-menu">☰</button>' +
        '</div>' +
      '</div>' +
    '</header>' +
    '<!-- ============ PROMO BANNER ============ -->' +
    '<div class="tgw-promo" role="region" aria-label="Announcements">' +
      '<div class="tgw-promo-ticker">' +
        '<div class="tgw-promo-track">' +
          '<span class="tgw-promo-item"><span class="tgw-promo-dot"></span>Find our Goodyear Lubricants exclusively on Takealot</span>' +
          '<span class="tgw-promo-sep">•</span>' +
          '<span class="tgw-promo-item">Our new NAMA tyres have launched</span>' +
          '<span class="tgw-promo-sep">•</span>' +
          '<span class="tgw-promo-item">Check out Crazy Werrie\'s NAMA tyres video on Facebook, Instagram, TikTok or YouTube</span>' +
          '<span class="tgw-promo-sep">•</span>' +
          '<span class="tgw-promo-item" aria-hidden="true"><span class="tgw-promo-dot"></span>Find our Goodyear Lubricants exclusively on Takealot</span>' +
          '<span class="tgw-promo-sep" aria-hidden="true">•</span>' +
          '<span class="tgw-promo-item" aria-hidden="true">Our new NAMA tyres have launched</span>' +
          '<span class="tgw-promo-sep" aria-hidden="true">•</span>' +
          '<span class="tgw-promo-item" aria-hidden="true">Check out Crazy Werrie\'s NAMA tyres video on Facebook, Instagram, TikTok or YouTube</span>' +
          '<span class="tgw-promo-sep" aria-hidden="true">•</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '</div>'
  ),

  footer: TGW_RELINK(
    '<!-- ============ FOOTER ============ -->' +
    '<footer class="site">' +
      '<div class="wrap">' +
        '<div class="foot-grid">' +
          '<div class="foot-brand">' +
            '<a class="brand foot-logo" href="../../../index.html" aria-label="Titan Global Wheel home">' +
              '<img class="logo-h" src="../../../src/logos/Titan%20Global%20Wheel%20_logo_hortizontal_2021_1.png" alt="Titan Global Wheel" />' +
            '</a>' +
            '<p>One of the largest combined manufacturers and suppliers of commercial, mining, agricultural, earthmoving and military wheels in sub-Saharan Africa.</p>' +
          '</div>' +
          '<div class="foot-col">' +
            '<h4>Products</h4>' +
            '<a href="../../../tyres.html">Tyres</a>' +
            '<a href="../../../rims.html">Rims</a>' +
            '<a href="../../../accessories.html">Accessories</a>' +
            '<a href="../../../feedback.html">Customer Feedback</a>' +
          '</div>' +
          '<div class="foot-col">' +
            '<h4>Industries</h4>' +
            '<a href="../../../agriculture.html">Agriculture</a>' +
            '<a href="../../../mining.html">Mining</a>' +
            '<a href="../../../military.html">Military</a>' +
            '<a href="../../../construction.html">Construction</a>' +
          '</div>' +
          '<div class="foot-col">' +
            '<h4>Company</h4>' +
            '<a href="../../../specials.html" data-nav-link="specials">Specials</a>' +
            '<a href="../../../about.html">About</a>' +
            '<a href="../../../news.html">News</a>' +
            '<a href="../../../events.html">Events</a>' +
            '<a href="#">Dealer Locator</a>' +
            '<a href="#">Request a Quote</a>' +
            '<a href="../../../contact.html">Contact</a>' +
          '</div>' +
        '</div>' +
        '<div class="foot-social">' +
          '<div class="socials">' +
            '<a class="social" href="https://www.linkedin.com/company/titan-global-wheel" target="_blank" rel="noopener" aria-label="Titan Global Wheel on LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0</svg></a>' +
            '<a class="social" href="https://www.facebook.com/TitanGlobalWheel" target="_blank" rel="noopener" aria-label="Titan Global Wheel on Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.668 4.533-4.668 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.885v2.267h3.328l-.532 3.49h-2.796v8.437C19.612 23.094 24 18.1 24 12.073</svg></a>' +
            '<a class="social" href="https://www.instagram.com/titanglobalwheel" target="_blank" rel="noopener" aria-label="Titan Global Wheel on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881</svg></a>' +
            '<a class="social" href="https://x.com/titanglobalwhee" target="_blank" rel="noopener" aria-label="Titan Global Wheel on X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298</svg></a>' +
            '<a class="social" href="https://www.tiktok.com/@titan.global.wheel" target="_blank" rel="noopener" aria-label="Titan Global Wheel on TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.43 3.9-1.41 1.87-4.32 2.37-6.21 1.06-.91-.56-1.6-1.5-1.92-2.5-.31-1-.34-2.07-.15-3.09.38-2.52 2.67-4.16 5.18-3.85.71.08 1.39.22 2.04.45.4-.66.51-1.45.27-2.18-.45-1.28-1.97-1.89-3.2-1.67-.9.15-1.69.72-2.08 1.54-.24.5-.31 1.06-.25 1.6v-4.3c.79-.07 1.59-.06 2.38-.05</svg></a>' +
            '<a class="social" href="https://www.youtube.com/@TitanGlobalWheel" target="_blank" rel="noopener" aria-label="Titan Global Wheel on YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568</svg></a>' +
          '</div>' +
          '<div class="foot-partners">' +
            '<a class="foot-partner" href="#" target="_blank" rel="noopener" aria-label="Goodyear"><img src="../../../src/logos/goodyear-logo.png" alt="Goodyear" /></a>' +
            '<a class="foot-partner" href="../../../nama.html" rel="noopener" aria-label="NAMA X/T tyres - see product page"><img src="../../../src/logos/nama.png" alt="NAMA" /></a>' +
          '</div>' +
          '<div class="foot-legal">' +
            '<span class="legal-item">Company Reg No. 2010/014325/07</span>' +
            '<span class="legal-item">VAT No. 4690261328</span>' +
            '<a class="cert-badge" href="#">B-BBEE Certificate</a>' +
            '<a class="cert-badge" href="#">ISO 9001 Certificate</a>' +
          '</div>' +
        '</div>' +
        '<div class="foot-bot">' +
          '<div class="foot-bot-left">' +
            '<span>© 2026 Titan Global Wheel. ISO-certified manufacturer.</span>' +
            '<span>Goodyear &amp; Tyron partner · Sub-Saharan Africa</span>' +
            '<a href="../../../Privacy-Policy.html">Privacy Policy</a>' +
            '<a href="../../../Cookies-Policy.html">Cookies Policy</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>'
  )
};
