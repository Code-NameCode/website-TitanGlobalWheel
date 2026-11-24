(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if (!toggle || !menu) return;
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕' : '☰';
    if (!open) menu.querySelectorAll('.has-dropdown.open').forEach((item) => item.classList.remove('open'));
  };
  toggle.addEventListener('click', (event) => { event.stopPropagation(); setMenu(!menu.classList.contains('open')); });
  menu.querySelectorAll('.has-dropdown > a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!window.matchMedia('(max-width: 980px)').matches) return;
      event.preventDefault();
      const open = link.parentElement.classList.toggle('open');
      link.setAttribute('aria-expanded', String(open));
    });
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', (event) => { if (menu.classList.contains('open') && !menu.contains(event.target) && !toggle.contains(event.target)) setMenu(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 980) setMenu(false); });
})();
