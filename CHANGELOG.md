# Changelog

## 2026-11-12

- Launched the Black November 2026 tyre-specials ads site-wide after design approval: the campaign pop-up (variant A) and the right-edge sidebar tab now run on the 21 main root pages via two shared files, css/promo-bn.css and js/promo-bn.js, tagged per page with a three-line block before </body>.
- Pop-up behaviour: auto-opens 2.5 s after load on every tagged page, once per browser session (sessionStorage tgw_bn_popup_seen); closes via ✕, outside click or Escape with scroll lock and focus restore; becomes a bottom sheet below 640 px.
- Sidebar behaviour: slim vertical "BLACK NOVEMBER" tab on the right edge, hover/tap expands the specials card, ✕ hides it for 7 days (localStorage tgw_bn_sidebar_until); hidden below 1100 px.
- Both ads link every CTA to specials.html; clicks fire a GA4 bn_specials_click event with a placement dimension (popup/sidebar) on pages with gtag.
- The injector is self-retiring: after 30 Nov 2026 23:59 SAST js/promo-bn.js exits and injects nothing; removing the tagged three lines per page is only cleanup. promo-bn.js also injects the Archivo/Inter Google Fonts link on pages that lack it (products.html, LSW.html).
- Ads deliberately excluded from: specials.html itself (the ads' destination), policy pages, feedback.html, 404, blog articles and promo-reel.html (fullscreen reel).
- Added verify/qa-promo-bn.cjs (Playwright) covering 19 behavioural checks with bn-int-*.png screenshots; all pass. black-november-preview.html remains as the design reference (noindex).

## 2026-09-30

- Added Google Analytics (gtag.js, G-D07TXJ8J69) to every static marketing page (blog and legacy article pages excluded for now).
- Rebuilt the mobile navigation (≤ 980px) as a slide-in drawer with a dimmed backdrop, dedicated close button, page scroll lock, Escape/overlay/link closing, focus management and a focus trap, delivered by the new shared css/mobile-nav.css and js/mobile-nav.js linked across every page with the site header.
- Made the Products menu row an animated accordion on mobile with a new "All Products" entry so products.html is finally reachable from phones; desktop hover menus are unchanged.
- Added a new Customer Feedback page (feedback.html) in the home page's style: dark hero, trust band and a feedback form built on the contact page's markup, styles, sanitisation and EmailJS delivery (same service and template), with the subject fixed to "Customer Feedback" and company name, email and a required customer comment.
- Replaced the "Featured Products" footer link with "Customer Feedback" across the site footer (all root pages, the shared js/chrome.js footer used by the blog articles, and partials/footer.html), and registered the new page in sitemap.xml and llms.txt.
- Removed the rotating banners from the Customer Feedback page: the announcement ticker and the partner-logo marquee (logo-banner.js) are no longer loaded on feedback.html.
- Fixed the events page mobile layout: the responsive overrides for the events hero, stats band and recommend form sat before their base styles in the cascade, so they never applied — the hero stayed two-column and overflowed the viewport by 99px on phones. The overrides now live after the base rules, the hero heading uses the site-wide compact mobile size, and the stats band collapses to two columns.
- Temporarily commented out the "Submit a recommendation" form on the events page (the section intro, guidelines and recently-recommended list remain; the form handler no-ops safely).
- Aligned the blog article navigation (js/chrome.js) with the main site: the Products label now links to products.html and the dropdown includes LSW plus the mobile All Products entry.

## 2026-09-22

- Imported the complete 43-entry agricultural tractor rim catalogue from the supplied backup HTML into the shared searchable catalogue, with Goodyear-blue agricultural accents and agricultural CSV export.

- Matched the Military Rims popup to the Commercial Rims catalogue interface, including the shared search, table, filters, row detail modal and CSV export behavior.

- Imported the live Military Rims catalogue into the Rims page's existing modal detail view, including vehicle fitments, Titan part numbers, rim sizes, load ratings, offsets and stud patterns.

- Refined the LSW redesign into a more focused product landing page by replacing the repetitive six-card grid with an immersive field visual and three core product outcomes.

- Completely redesigned the LSW page with a cinematic product hero, technical explainer, benefit grid, field gallery, machine guide and conversion-focused enquiry sections using all supplied LSW media.

- Added the 16 May 2026 "Nampo 2026" event article with the supplied cover and supporting photos.

- Added responsive product-family photography to the Products page using existing agricultural, LSW, rim, tyre, runflat and accessory assets.

- Expanded Products with verified Titan product-family, application, LSW, agriculture, rim and Tyron runflat content.

- Updated the military page rims visual to use the supplied Steel rim photograph.

- Added the 7 May 2026 "44 Years!" retirement celebration article with its cover and supporting team photo.

- Made the physical address on the contact page interactive with copy, map and directions options, and redesigned the WhatsApp Business coming-soon section.

- Rebuilt the Products and LSW page navigation and footer presentation with shared site chrome and the standard responsive menu behaviour.

- Replaced the Products and LSW page header and footer with the index page's standard site markup and matching responsive styles.

- Removed the redundant All Products dropdown item and aligned the Products and LSW page navigation and footer content with the main site pages.

- Restored the Products dropdown while keeping its label linked to products.html, added LSW as the final dropdown item, and created LSW.html with the supplied Goodyear LSW visual and product overview.

- Replaced the Products dropdown in every static page header and shared header partial with a direct link to products.html.

- Removed the Facebook and news-archive buttons from the news-page introduction.

- Reordered the news-page split view with articles on the left and Facebook on the right, and added a centred full-width feature card for the newest article on each numbered page.

- Refined the news-page split view: reduced the Facebook feed width, changed the article area to full-width cards with proportioned images, added seven-article numbered pagination, and removed the Featured Products and Request a Quote footer links.

- Restored the Facebook feed to its standard 500px size and placed it beside the eight newest blog articles on the news page, with a single-column mobile layout.

- Enlarged the Facebook timeline proportionally to 720px on desktop, with matching viewport height and responsive mobile sizing.

- Preserved the newsroom as news2.html and created news.html with matching SEO metadata, shared site layout and a responsive Facebook timeline, direct Facebook fallback and archive link. Normalized News.html links for case-sensitive hosting; the archive has its own canonical URL.

## 2026-09-21

- Replaced the blue announcement ticker across the static site pages with a responsive rotating partner-logo banner.
- Added proportional logo fitting, a white background, edge fade masks, reduced-motion support, and mobile sizing.
- Normalized each logo into a consistent visual frame and added a restrained scroll reveal with staggered logo entrance and edge fades.
- Reduced the logo rail height to a compact fit around the logo frames.
- Added transparent logo copies with the baked-in white backgrounds removed and reduced the rail height further.
- Enlarged the logo marks inside the compact rail for better visibility.
- Tightened logo spacing and expanded both side fade zones to approximately 20% of the banner width.
- Adjusted Goodyear and Haltech with optical scale corrections for better visual balance.
- Moved the logo strip to sit directly above the stats wrap so the hero content remains above it.
- Increased the banner height by 8px, moved it to the bottom of each hero, tightened mobile spacing, and added a gentle hover pause/resume interaction.
- Increased the actual logo frame by 8px and anchored the banner after the first main section on every page.
- Replaced the Tyron Easyfit local video with the supplied YouTube embed.
- Applied site-wide font and hero-spacing cleanup, removed repair-duration promises, removed the index Why Titan block, and replaced Goodyear partner marks with the Goodyear Farm Tyres logo.
- Corrected mojibake punctuation, restored the original Goodyear logo outside the rotating banner with white backing on dark areas, and reduced hero heading sizes.
- Removed the footer Goodyear white plate and set the original footer logo to a small, slightly larger display size.
- Set the footer Goodyear logo width to auto with a compact fixed height, added a new products showcase page using the supplied LSW visual, and compacted the rims hero typography and height.
- Corrected remaining inch, arrow, bullet, checkmark, and directional-symbol mojibake page by page across the non-blog HTML pages.
