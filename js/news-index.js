/* =========================================================================
   /js/news-index.js — renders the full news grid from article data, with
   live search and category filtering.

   Data source: an inline <script type="application/json" id="news-data"> block
   embedded in the page (preferred — works when the file is opened directly via
   file://). When the page is served over http and no inline block is present,
   it falls back to fetching src/news/articles/manifest.json.
   ========================================================================= */
(function () {
  'use strict';

  const grid = document.getElementById('news-grid');
  const featuredSlot = document.getElementById('news-featured-slot');
  const paginationEl = document.getElementById('news-pagination');
  const searchInput = document.getElementById('news-search');
  const searchClear = document.getElementById('news-search-clear');
  const filtersEl = document.getElementById('news-filters');
  const countEl = document.getElementById('news-count');
  if (!grid) return;

  const PER_PAGE = 12;
  let allArticles = [];
  let currentPage = 1;
  const state = { search: '', category: 'All' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function catSlug(c) {
    return String(c || '').replace(/\s+/g, '\\ ');
  }
  // File:// browsers won't auto-serve index.html from a directory URL, so on
  // file:// point at the explicit file ("blog/foo/" → "blog/foo/index.html").
  // Over http(s) keep the clean trailing-slash URL.
  function hrefFor(u) {
    if (!u || u === '#') return '#';
    if (location.protocol === 'file:' && /\/$/.test(u)) return u + 'index.html';
    return u;
  }
  function featuredCard(a) {
    const href = (!a.url || a.url === '#') ? '#' : esc(hrefFor(a.url));
    const cat = esc(a.category || '');
    const date = a.date ? esc(fmtDate(a.date)) : '';
    return (
      '<a class="news-featured reveal" href="' + href + '" aria-label="Featured article: ' + esc(a.title) + '" style="--rd:0s">' +
        '<span class="news-featured__image">' +
          '<span class="news-featured__label" aria-hidden="true">Featured</span>' +
          '<img src="' + esc(a.image) + '" alt="' + esc(a.title) + '" loading="lazy" />' +
        '</span>' +
        '<div class="news-featured__content">' +
          '<div class="news-featured__meta">' +
            '<span class="cat-badge cat-badge--' + catSlug(cat) + '">' + cat + '</span>' +
            (date ? '<span class="date">' + date + '</span>' : '') +
          '</div>' +
          '<h3>' + esc(a.title) + '</h3>' +
          '<p>' + esc(a.excerpt || '') + '</p>' +
          '<span class="cta-link">Read full story <span class="arrow">→</span></span>' +
        '</div>' +
      '</a>'
    );
  }
  function articleCard(a, i, isPlaceholder, rd) {
    const href = (isPlaceholder || !a.url || a.url === '#') ? '#' : esc(hrefFor(a.url));
    const onClick = isPlaceholder
      ? ' onclick="event.preventDefault(); var l=this.querySelector(\'.lbl\'); if(l){l.textContent=\'Coming soon\'; setTimeout(function(){l.textContent=\'Read more\';},1500);}"'
      : '';
    const cat = esc(a.category || '');
    const date = a.date ? '<span class="date">' + esc(fmtDate(a.date)) + '</span>' : '';
    return (
      '<a class="news-card reveal' + (isPlaceholder ? ' placeholder' : '') + '" href="' + href + '"' + onClick + ' style="--rd:' + (rd == null ? i * 0.06 : rd) + 's">' +
        '<span class="thumb"><img src="' + esc(a.image) + '" alt="' + esc(a.title) + '" loading="lazy" /></span>' +
        '<div class="body">' +
          '<div class="meta">' +
            '<span class="cat-badge cat-badge--' + catSlug(cat) + '">' + cat + '</span>' +
            date +
          '</div>' +
          '<h3>' + esc(a.title) + '</h3>' +
          '<p>' + esc(a.excerpt || '') + '</p>' +
          '<span class="more"><span class="lbl">Read more</span> <span class="arrow">→</span></span>' +
        '</div>' +
      '</a>'
    );
  }

  function getFiltered() {
    const q = state.search.trim().toLowerCase();
    return allArticles.filter(function (a) {
      if (state.category !== 'All' && (a.category || '') !== state.category) return false;
      if (!q) return true;
      const hay = [a.title, a.excerpt, a.category, (a.tags || []).join(' ')].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function renderPage(page) {
    const list = getFiltered();
    const start = (page - 1) * PER_PAGE;
    const slice = list.slice(start, start + PER_PAGE);
    if (slice.length) {
      // Cap the entrance stagger so cards animate in quickly as you scroll.
      const html = slice.map(function (a, i) {
        const rd = Math.min(i * 0.05, 0.5);
        return articleCard(a, i, a.placeholder || !a.url || a.url === '#', rd);
      }).join('');
      grid.insertAdjacentHTML('beforeend', html);

      const cards = grid.querySelectorAll('.news-card.reveal:not(.in)');
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
          });
        }, { rootMargin: '0px 0px 0px 0px', threshold: 0.05 });
        cards.forEach(function (c) { obs.observe(c); });
      } else {
        cards.forEach(function (c) { c.classList.add('in'); });
      }
    }
  }

  function renderPagination(totalPages) {
    if (!paginationEl) return;
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

    // Build the visible page numbers. With <= 7 pages, show them all.
    // Otherwise collapse the middle with ellipses: 1 … 4 5 6 … 12
    const items = [];
    function addPage(n) {
      const isCurrent = n === currentPage;
      items.push(
        '<button type="button" class="news-page"' +
          (isCurrent ? ' aria-current="page"' : '') +
          ' data-page="' + n + '">' + n + '</button>'
      );
    }
    function addEllipsis() {
      items.push('<span class="news-page-ellipsis" aria-hidden="true">…</span>');
    }

    if (totalPages <= 7) {
      for (let n = 1; n <= totalPages; n++) addPage(n);
    } else {
      addPage(1);
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);
      if (left > 2) addEllipsis();
      for (let n = left; n <= right; n++) addPage(n);
      if (right < totalPages - 1) addEllipsis();
      addPage(totalPages);
    }

    const prevDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages;
    const prev = '<button type="button" class="news-page" data-page="prev"' +
      (prevDisabled ? ' disabled' : '') + ' aria-label="Previous page"><span class="arrow">‹</span></button>';
    const next = '<button type="button" class="news-page" data-page="next"' +
      (nextDisabled ? ' disabled' : '') + ' aria-label="Next page"><span class="arrow">›</span></button>';

    paginationEl.innerHTML = prev + items.join('') + next;
  }

  function renderFeatured() {
    if (!featuredSlot) return;
    const list = getFiltered();
    if (!list.length) {
      featuredSlot.innerHTML = '';
      return;
    }
    const first = list[0];
    featuredSlot.innerHTML = featuredCard(first);
    const fc = featuredSlot.querySelector('.news-featured.reveal');
    if (fc && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px 0px 0px', threshold: 0.05 });
      obs.observe(fc);
    } else if (fc) {
      fc.classList.add('in');
    }
  }

  function updateCount() {
    if (!countEl) return;
    const total = getFiltered().length;
    countEl.innerHTML = '<strong>' + total + '</strong> article' + (total === 1 ? '' : 's');
  }

  function applyFilter() {
    currentPage = 1;
    grid.innerHTML = '';
    if (featuredSlot) featuredSlot.innerHTML = '';
    const list = getFiltered();
    if (!list.length) {
      grid.innerHTML = '<p class="news-empty">No articles match your search. Try a different keyword or category.</p>';
      if (paginationEl) paginationEl.innerHTML = '';
      updateCount();
      return;
    }
    renderFeatured();
    renderPage(currentPage);
    renderPagination(Math.max(1, Math.ceil(list.length / PER_PAGE)));
    updateCount();
  }

  // ---- pagination clicks ----
  if (paginationEl) {
    paginationEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.news-page');
      if (!btn || btn.disabled) return;
      const v = btn.getAttribute('data-page');
      const list = getFiltered();
      const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      let next = currentPage;
      if (v === 'prev') next = Math.max(1, currentPage - 1);
      else if (v === 'next') next = Math.min(totalPages, currentPage + 1);
      else next = parseInt(v, 10) || 1;
      if (next === currentPage) return;
      currentPage = next;
      grid.innerHTML = '';
      if (featuredSlot) featuredSlot.innerHTML = '';
      renderFeatured();
      renderPage(currentPage);
      renderPagination(totalPages);
      // Scroll the grid back to the top of the news section
      const top = grid.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  }

  function buildChips() {
    if (!filtersEl) return;
    const counts = {};
    allArticles.forEach(function (a) {
      const c = a.category || 'Uncategorised';
      counts[c] = (counts[c] || 0) + 1;
    });
    const cats = ['All'].concat(Object.keys(counts).sort(function (x, y) { return x.localeCompare(y); }));
    filtersEl.innerHTML = cats.map(function (c) {
      const label = c === 'All' ? 'All articles' : c;
      const count = c === 'All' ? allArticles.length : counts[c];
      const pressed = c === state.category ? 'true' : 'false';
      return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + pressed + '">' +
        esc(label) + '<span class="chip-count">' + count + '</span></button>';
    }).join('');

    filtersEl.querySelectorAll('.chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.category = btn.getAttribute('data-cat');
        filtersEl.querySelectorAll('.chip').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        applyFilter();
      });
    });
  }

  // ---- search wiring (debounced) ----
  if (searchInput) {
    let t;
    searchInput.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        state.search = searchInput.value;
        if (searchClear) searchClear.hidden = !searchInput.value;
        applyFilter();
      }, 120);
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      state.search = '';
      searchClear.hidden = true;
      searchInput.focus();
      applyFilter();
    });
  }

  function start(list) {
    allArticles = (list || []).slice().sort(function (x, y) {
      return (y.date || '').localeCompare(x.date || '');
    });
    if (searchClear) searchClear.hidden = true;
    buildChips();
    applyFilter();
  }

  // 1) Prefer inline data (works on file://)
  const inline = document.getElementById('news-data');
  if (inline) {
    try {
      const data = JSON.parse(inline.textContent);
      start(data.articles || data);
      return;
    } catch (e) {
      console.warn('Inline news-data could not be parsed, falling back to fetch:', e);
    }
  }

  // 2) Fallback: fetch the manifest (only works when served over http)
  if (location.protocol === 'file:') {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#6b7480; padding:40px 0;">Article data is unavailable in this view.</p>';
    return;
  }
  fetch('src/news/articles/manifest.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) { start(data.articles || []); })
    .catch(function (e) {
      console.warn('Could not load news manifest:', e);
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#6b7480; padding:40px 0;">Articles are temporarily unavailable.</p>';
    });
})();
