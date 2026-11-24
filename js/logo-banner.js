(function () {
  'use strict';
  if (document.querySelector('.tgw-logo-banner')) return;
  var siteTop = document.querySelector('.site-top');
  if (!siteTop) return;

  var logos = [
    '1Titan.png',
    '2goodyear agri.jpg',
    '4AME Logo.png',
    '4michelin logo.png',
    '4Polyfil.png',
    '5LSW.JPG',
    '5nama logo.png',
    '6Haltech Logo.png',
    '7tyron.png'
  ];
  var root = document.createElement('div');
  root.className = 'tgw-logo-banner';
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'Titan Global Wheel partners and product brands');
  var track = document.createElement('div');
  track.className = 'tgw-logo-banner__track';

  logos.concat(logos).forEach(function (name, index) {
    var item = document.createElement('span');
    item.className = 'tgw-logo-banner__item';
    if (index >= logos.length) item.setAttribute('aria-hidden', 'true');
    var image = document.createElement('img');
    image.src = 'src/logo banner/transparent/' + encodeURIComponent(name.replace(/\.[^.]+$/, '') + '.png');
    image.alt = index < logos.length ? name.replace(/\.[^.]+$/, '').replace(/[0-9]/g, '').trim() : '';
    image.loading = 'eager';
    item.appendChild(image);
    track.appendChild(item);
  });
  root.appendChild(track);
  var placement = document.querySelector('main > section') || document.querySelector('main section');
  if (placement && placement.parentNode) {
    placement.insertAdjacentElement('afterend', root);
  } else {
    siteTop.insertAdjacentElement('afterend', root);
  }

  if (!('IntersectionObserver' in window)) {
    root.classList.add('is-visible');
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        root.classList.add('is-visible');
        observer.unobserve(root);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  observer.observe(root);

  var pauseTimer;
  root.addEventListener('mouseenter', function () {
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(function () {
      track.style.animationPlayState = 'paused';
    }, 650);
  });
  root.addEventListener('mouseleave', function () {
    clearTimeout(pauseTimer);
    track.style.animationPlayState = 'running';
  });
})();
