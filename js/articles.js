/* =========================================================================
   /js/articles.js — builds the related-articles and share-to-socials blocks
   on every article page. Related articles are matched by category + shared tags.

   Data source: an inline <script type="application/json" id="news-data"> block
   embedded in the page (preferred — works on file://). Falls back to fetching
   src/news/articles/manifest.json when the page is served over http.
   ========================================================================= */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  // Site-relative path → path usable from THIS page.
  // Data is stored site-relative WITHOUT a leading slash ("blog/x/",
  // "src/news/images/x.jpg"). On http(s) a leading "/" makes it resolve from
  // the origin at any depth. On file:// we compute the path relative to this
  // page's directory, discovering the site root from this script's own URL
  // (<root>/js/articles.js).
  function siteRel(p) {
    if (!p) return p || '';
    const target = String(p).replace(/^\/+/, '');
    if (location.protocol === 'file:') {
      const src = (document.currentScript && document.currentScript.src) || '';
      const root = src ? src.split('/').slice(0, -2).join('/') + '/' : '';
      const dir = location.href.slice(0, location.href.lastIndexOf('/') + 1);
      const r = root.split('/').filter(Boolean);
      const d = dir.split('/').filter(Boolean);
      let i = 0;
      while (i < r.length && i < d.length && r[i] === d[i]) i++;
      let rel = '../'.repeat(Math.max(0, d.length - i)) + target;
      // Browsers don't auto-serve index.html from file:// directory URLs,
      // so point at the explicit file for directory-style targets
      // ("blog/foo/" → "blog/foo/index.html").
      if (/\/$/.test(rel)) rel += 'index.html';
      return rel;
    }
    // http(s): resolve against the page’s own depth so the same data
    // works at the site root AND under a sub-path (e.g. staging servers)
    const parts = location.pathname.split('/').filter(Boolean);
    const prefix = location.pathname.endsWith('/') ? parts.length : parts.length - 1;
    return '../'.repeat(Math.max(0, prefix)) + target;
  }
  // Article URLs are stored site-relative ("blog/other-slug/"). Return a path
  // that resolves from any depth on http and from the page dir on file://.
  function relUrl(u) {
    const s = siteRel(u);
    return s || '#';
  }
  // Image paths are stored site-relative ("src/news/images/x.jpg").
  function relImg(p) {
    return siteRel(p);
  }
  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function shareUrl() {
    return location.origin + location.pathname;
  }
  function shareTitle() {
    return document.title.replace(/\s+—\s+Titan Global Wheel\s*$/i, '');
  }
  function readDataJson(el, name) {
    const raw = el.getAttribute('data-' + name);
    try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }

  // ---------- share block ----------
  function buildShare() {
    const el = document.getElementById('share');
    if (!el) return;
    const url = encodeURIComponent(shareUrl());
    const title = encodeURIComponent(shareTitle());
    const text = encodeURIComponent(shareTitle() + ' — Titan Global Wheel');

    const networks = [
      { network: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>' },
      { network: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.668 4.533-4.668 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.885v2.267h3.328l-.532 3.49h-2.796v8.437C19.612 23.094 24 18.1 24 12.073z"/></svg>' },
      { network: 'x', label: 'X (Twitter)', href: 'https://twitter.com/intent/tweet?url=' + url + '&text=' + text,
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>' },
      { network: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/?text=' + text + '%20' + url,
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.66 14.32a3.18 3.18 0 0 0-4.5 0l-1.41 1.41a1 1 0 0 0 1.41 1.41l1.42-1.41a1.18 1.18 0 0 1 1.66 0 1.17 1.17 0 0 1 0 1.66l-1.41 1.41a1 1 0 0 0 1.41 1.42l1.42-1.42a3.18 3.18 0 0 0 0-4.49zm-11.32 4.5a3.18 3.18 0 0 0 4.5 0l1.41-1.41a1 1 0 0 0-1.41-1.41L9.42 17.4a1.18 1.18 0 0 1-1.66 0 1.17 1.17 0 0 1 0-1.66l1.41-1.41a1 1 0 0 0-1.41-1.42L6.34 14.32a3.18 3.18 0 0 0 0 4.5zM14.32 9.68a3.18 3.18 0 0 0-4.5 0L8.41 11.1a1 1 0 0 0 1.41 1.41l1.42-1.41a1.18 1.18 0 0 1 1.66 0 1.17 1.17 0 0 1 0 1.66L11.49 14.16a1 1 0 0 0 1.41 1.42l1.42-1.42a3.18 3.18 0 0 0 0-4.49z"/></svg>' },
      { network: 'email', label: 'Email', href: 'mailto:?subject=' + title + '&body=' + text + '%20' + url,
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>' },
      { network: 'copy', label: 'Copy link', isButton: true,
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.66 14.32a3.18 3.18 0 0 0-4.5 0l-1.41 1.41a1 1 0 0 0 1.41 1.41l1.42-1.41a1.18 1.18 0 0 1 1.66 0 1.17 1.17 0 0 1 0 1.66l-1.41 1.41a1 1 0 0 0 1.41 1.42l1.42-1.42a3.18 3.18 0 0 0 0-4.49zm-11.32 4.5a3.18 3.18 0 0 0 4.5 0l1.41-1.41a1 1 0 0 0-1.41-1.41L9.42 17.4a1.18 1.18 0 0 1-1.66 0 1.17 1.17 0 0 1 0-1.66l1.41-1.41a1 1 0 0 0-1.41-1.42L6.34 14.32a3.18 3.18 0 0 0 0 4.5zM14.32 9.68a3.18 3.18 0 0 0-4.5 0L8.41 11.1a1 1 0 0 0 1.41 1.41l1.42-1.41a1.18 1.18 0 0 1 1.66 0 1.17 1.17 0 0 1 0 1.66L11.49 14.16a1 1 0 0 0 1.41 1.42l1.42-1.42a3.18 3.18 0 0 0 0-4.49z"/></svg>' }
    ];

    const buttons = networks.map(function (n) {
      const tag = n.isButton ? 'button' : 'a';
      const attrs = n.isButton
        ? ' type="button" data-network="' + n.network + '"'
        : ' href="' + esc(n.href) + '" data-network="' + n.network + '" target="_blank" rel="noopener"';
      return '<' + tag + attrs + ' class="share-btn">' + n.icon + '<span class="lbl">' + esc(n.label) + '</span></' + tag + '>';
    }).join('');

    el.innerHTML =
      '<div class="wrap">' +
        '<div class="sec-head">' +
          '<h2 id="share-h">Share this article</h2>' +
          '<p>Know someone who would find this useful? Send it their way.</p>' +
        '</div>' +
        '<div class="share-buttons">' + buttons + '</div>' +
      '</div>';

    const copyBtn = el.querySelector('[data-network="copy"]');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        const url = shareUrl();
        const after = function (ok) {
          const lbl = copyBtn.querySelector('.lbl');
          const original = lbl.getAttribute('data-orig') || lbl.textContent;
          lbl.setAttribute('data-orig', original);
          lbl.textContent = ok ? 'Copied!' : 'Press Ctrl+C';
          copyBtn.classList.add('copied');
          setTimeout(function () { lbl.textContent = original; copyBtn.classList.remove('copied'); }, 1800);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(url).then(function () { after(true); }).catch(function () { after(false); });
        } else {
          const ta = document.createElement('textarea');
          ta.value = url; ta.style.position = 'fixed'; ta.style.left = '-9999px';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); after(true); } catch (e) { after(false); }
          document.body.removeChild(ta);
        }
      });
    }

    if (navigator.share) {
      const nativeBtn = document.createElement('button');
      nativeBtn.type = 'button';
      nativeBtn.className = 'share-btn';
      nativeBtn.setAttribute('data-network', 'native');
      nativeBtn.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16.08a2.93 2.93 0 0 0-1.97.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.5.47 1.17.77 1.94.77 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.77A2.99 2.99 0 0 0 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.73 0 1.4-.27 1.94-.72l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>' +
        '<span class="lbl">Share</span>';
      nativeBtn.addEventListener('click', function () {
        navigator.share({ title: shareTitle(), url: shareUrl() }).catch(function () {});
      });
      el.querySelector('.share-buttons').prepend(nativeBtn);
    }
  }

  // ---------- related block ----------
  function scoreArticle(article, current) {
    let score = 0;
    if (article.category && current.category && article.category === current.category) score += 3;
    const aTags = article.tags || [];
    const cTags = current.tags || [];
    score += aTags.filter(function (t) { return cTags.indexOf(t) !== -1; }).length * 2;
    if (article.date && current.date) {
      const a = new Date(article.date), b = new Date(current.date);
      const days = Math.abs((a - b) / 86400000);
      if (!isNaN(days) && days < 60) score += 1;
    }
    return score;
  }

  function buildRelated(manifest) {
    const el = document.getElementById('related');
    if (!el) return;
    const slug = el.getAttribute('data-related-slug');
    const category = el.getAttribute('data-related-category');
    const tags = readDataJson(el, 'related-tags') || [];
    const current = manifest.find(function (a) { return a.slug === slug; }) || { category: category, tags: tags, date: '' };

    const others = manifest.filter(function (a) { return a.slug !== slug; });
    const scored = others.map(function (a) {
      return { a: a, s: scoreArticle(a, current) };
    }).sort(function (x, y) { return y.s - x.s || (y.a.date || '').localeCompare(x.a.date || ''); });

    let picks = scored.filter(function (x) { return x.s > 0; }).slice(0, 3).map(function (x) { return x.a; });
    if (picks.length < 3) {
      const used = picks.map(function (p) { return p.slug; });
      const filler = others
        .filter(function (a) { return used.indexOf(a.slug) === -1; })
        .sort(function (x, y) { return (y.date || '').localeCompare(x.date || ''); })
        .slice(0, 3 - picks.length);
      picks = picks.concat(filler);
    }

    if (!picks.length) { el.style.display = 'none'; return; }

    const cards = picks.map(function (a, i) {
      const isPlaceholder = a.placeholder || !a.url || a.url === '#';
      const href = isPlaceholder ? '#' : esc(relUrl(a.url));
      const onClick = isPlaceholder
        ? ' onclick="event.preventDefault(); var l=this.querySelector(\'.lbl\'); if(l){l.textContent=\'Coming soon\'; setTimeout(function(){l.textContent=\'Read more\';},1500);}"'
        : '';
      return (
        '<a class="news-card reveal" href="' + href + '"' + onClick + ' style="--rd:' + (i * 0.06) + 's">' +
          '<span class="thumb"><img src="' + esc(relImg(a.image)) + '" alt="' + esc(a.title) + '" loading="lazy" /></span>' +
          '<div class="body">' +
            '<span class="meta">' + esc(a.category || '') + (a.date ? ' · ' + esc(fmtDate(a.date)) : '') + '</span>' +
            '<h3>' + esc(a.title) + '</h3>' +
            '<p>' + esc(a.excerpt || '') + '</p>' +
            '<span class="more"><span class="lbl">Read more</span> <span class="arrow">→</span></span>' +
          '</div>' +
        '</a>'
      );
    }).join('');

    el.innerHTML =
      '<div class="wrap">' +
        '<div class="sec-head">' +
          '<h2 id="related-h">Related articles</h2>' +
          '<p>More stories from ' + esc(category || 'our newsroom') + '.</p>' +
        '</div>' +
        '<div class="news-grid">' + cards + '</div>' +
      '</div>';

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
      el.querySelectorAll('.news-card.reveal').forEach(function (c) { obs.observe(c); });
    } else {
      el.querySelectorAll('.news-card.reveal').forEach(function (c) { c.classList.add('in'); });
    }
  }

  // ---------- bootstrap ----------
  buildShare();

  const relatedEl = document.getElementById('related');
  if (relatedEl) {
    const inline = document.getElementById('news-data');
    if (inline) {
      try { buildRelated(JSON.parse(inline.textContent).articles || []); return; }
      catch (e) { console.warn('Inline news-data could not be parsed, falling back to fetch:', e); }
    }
    if (location.protocol === 'file:') { relatedEl.style.display = 'none'; return; }
    fetch('manifest.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) { buildRelated(data.articles || []); })
      .catch(function (e) { console.warn('Related articles could not be loaded:', e); relatedEl.style.display = 'none'; });
  }
})();
