(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  if (!toggle || !navigation) return;
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '展开导航');
    navigation.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const opened = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opened));
    toggle.setAttribute('aria-label', opened ? '收起导航' : '展开导航');
    navigation.classList.toggle('is-open', opened);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 721px)').addEventListener('change', closeMenu);
})();
