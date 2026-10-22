(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  if (toggle && navigation) {
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
    navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); }
    });
    document.addEventListener('click', event => {
      if (!navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
  }
  const catalog = document.querySelector('[data-catalog]');
  if (!catalog) return;
  const input = document.querySelector('#catalog-search');
  const clear = document.querySelector('#clear-search');
  const empty = document.querySelector('#catalog-empty');
  const resultCount = document.querySelector('#result-count');
  const title = document.querySelector('#catalog-title');
  const filters = [...document.querySelectorAll('[data-category-filter]')];
  const groups = [...catalog.querySelectorAll('[data-catalog-group]')];
  const normalize = value => value.normalize('NFKC').toLocaleLowerCase('zh-CN').trim();
  const entries = [...catalog.querySelectorAll('[data-catalog-item]')].map(element => ({
    element, category: element.dataset.category,
    text: normalize(`${element.dataset.search || ''} ${element.textContent}`)
  }));
  let selectedCategory = 'all';
  function render() {
    const terms = normalize(input.value).split(/\s+/).filter(Boolean);
    let count = 0;
    entries.forEach(entry => {
      const matches = (selectedCategory === 'all' || selectedCategory === entry.category) && terms.every(term => entry.text.includes(term));
      entry.element.hidden = !matches;
      if (matches) count += 1;
    });
    groups.forEach(group => {
      const visible = [...group.querySelectorAll('[data-catalog-item]')].filter(item => !item.hidden).length;
      group.hidden = visible === 0;
      group.querySelector('[data-group-count]').textContent = String(visible);
    });
    filters.forEach(button => {
      const active = button.dataset.categoryFilter === selectedCategory;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
      if (active) title.textContent = button.dataset.categoryName;
    });
    resultCount.textContent = terms.length ? `找到 ${count} 项内容` : `共 ${count} 项内容`;
    clear.hidden = input.value.length === 0;
    empty.hidden = count !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => { selectedCategory = button.dataset.categoryFilter; render(); }));
  input.addEventListener('input', render);
  clear.addEventListener('click', () => { input.value = ''; render(); input.focus(); });
  document.querySelector('#reset-catalog').addEventListener('click', () => { selectedCategory = 'all'; input.value = ''; render(); input.focus(); });
  document.querySelectorAll('[data-show-category]').forEach(link => link.addEventListener('click', () => { selectedCategory = link.dataset.showCategory; input.value = ''; render(); }));
  render();
})();
