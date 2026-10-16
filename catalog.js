import { catalogProducts, getProductsByCategory } from './catalog-data.js';

const categoryNames = Object.freeze({
  all: 'Все товары',
  care: 'Уход',
  makeup: 'Макияж',
  kids: 'Детское',
  brushes: 'Кисти',
  sets: 'Наборы',
});

const grid = document.querySelector('[data-catalog-grid]');
const title = document.querySelector('[data-catalog-title]');
const count = document.querySelector('[data-catalog-count]');
const filters = [...document.querySelectorAll('[data-category-filter]')];
const search = document.querySelector('[data-catalog-search]');
const sort = document.querySelector('[data-catalog-sort]');
let activeCategory = new URLSearchParams(window.location.search).get('category') || 'all';

if (!categoryNames[activeCategory]) activeCategory = 'all';

const renderVariants = (product) => {
  if (!product.variants?.length) return '';
  return `<div class="catalog-variants" aria-label="Варианты ${product.name}">${product.variants.map((item, index) => `
    <button type="button" class="catalog-variant${index === 0 ? ' is-selected' : ''}" data-variant-image="${item.image}" data-variant-label="${item.label}" style="--variant-tone:${item.tone}" aria-label="${item.label}" aria-pressed="${index === 0}"></button>
  `).join('')}</div>`;
};

const getDiscount = (product) => {
  const current = Number(String(product.price ?? '').replace(/\D/g, ''));
  const previous = Number(String(product.oldPrice ?? '').replace(/\D/g, ''));
  return current && previous && previous > current ? Math.round((1 - current / previous) * 100) : 0;
};

const renderCategory = (category) => {
  activeCategory = category;
  const query = search?.value.trim().toLocaleLowerCase('ru') ?? '';
  let products = (category === 'all' ? catalogProducts : getProductsByCategory(category)).filter((product) => (
    `${product.name} ${product.subtitle}`.toLocaleLowerCase('ru').includes(query)
  ));

  if (sort?.value === 'price-asc') products = [...products].sort((a, b) => Number(a.price?.replace(/\D/g, '') || Infinity) - Number(b.price?.replace(/\D/g, '') || Infinity));
  if (sort?.value === 'price-desc') products = [...products].sort((a, b) => Number(b.price?.replace(/\D/g, '') || 0) - Number(a.price?.replace(/\D/g, '') || 0));

  title.textContent = categoryNames[category];
  count.textContent = String(products.length);
  grid.innerHTML = products.map((product) => `
    <article class="full-catalog-card" data-catalog-product="${product.id}">
      <div class="full-catalog-media">${getDiscount(product) ? `<span class="sale-badge">−${getDiscount(product)}%</span>` : ''}<a href="product.html?id=${encodeURIComponent(product.id)}"><img src="${product.image}" alt="${product.name}" loading="lazy"></a>${renderVariants(product)}</div>
      <div class="full-catalog-copy">
        <span>${product.subtitle}</span>
        <h3><a href="product.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3>
        <div class="full-catalog-meta"><p><strong>${product.price ?? ''}</strong>${product.oldPrice ? `<del>${product.oldPrice}</del>` : ''}</p></div>
      </div>
    </article>
  `).join('');

  filters.forEach((filter) => {
    const selected = filter.dataset.categoryFilter === category;
    filter.classList.toggle('is-active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
};

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const nextCategory = filter.dataset.categoryFilter;
    const url = new URL(window.location.href);
    url.searchParams.set('category', nextCategory);
    window.history.replaceState({}, '', url);
    renderCategory(nextCategory);
  });
});

search?.addEventListener('input', () => renderCategory(activeCategory));
sort?.addEventListener('change', () => renderCategory(activeCategory));

grid?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-variant-image]');
  if (!button) return;
  const card = button.closest('[data-catalog-product]');
  const image = card?.querySelector('.full-catalog-media img');
  if (!image) return;
  image.src = button.dataset.variantImage;
  image.alt = `${card.querySelector('h3').textContent} — ${button.dataset.variantLabel}`;
  card.querySelectorAll('[data-variant-image]').forEach((item) => {
    const selected = item === button;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
});

if (grid && title && count) renderCategory(activeCategory);

