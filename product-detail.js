import { products } from './product-data.js';
import { catalogProducts } from './catalog-data.js';
import { clampQuantity, addCartItem, toggleFavorite, isFavorite } from './site-state.js';
import { getProductGallery, getProductCategory, initProductGallery } from './product-experience.js?v=1';
import { CARE_FORMULAS } from './care-rail.js?v=8';

const id = new URLSearchParams(window.location.search).get('id') ?? 'bb';
const aliases = Object.freeze({
  'bb-balm': 'bb',
  'glow-skin-elixir': 'elixir',
  'wow-eye-sparkle': 'sparkle',
  'baked-glow-highlighter': 'highlighter',
});
const featured = products[id] ?? products[aliases[id]];
const catalogProduct = catalogProducts.find((item) => item.id === id) ?? catalogProducts.find((item) => aliases[item.id] === id);
const product = featured ?? {
  name: catalogProduct?.name ?? products.bb.name,
  eyebrow: catalogProduct?.subtitle ?? products.bb.eyebrow,
  price: catalogProduct?.price ?? products.bb.price,
  sku: catalogProduct?.sku ?? 'уточняется',
  image: catalogProduct?.image ?? products.bb.image,
  description: catalogProduct
    ? `${catalogProduct.subtitle}. Оригинальный продукт Ha Lo Beauty. Подробные характеристики и состав указаны на упаковке.`
    : products.bb.description,
  specs: [
    catalogProduct?.category === 'care' ? 'Уходовая косметика' : 'Декоративная косметика',
    ...(catalogProduct?.variants?.length ? [`${catalogProduct.variants.length} варианта`] : []),
    'Оригинальная продукция Ha Lo Beauty',
  ],
};
const $ = (selector) => document.querySelector(selector);

$('[data-product-title]').textContent = product.name;
$('[data-product-eyebrow]').textContent = product.eyebrow;
$('[data-product-sku]').textContent = product.sku;
$('[data-product-price]').textContent = product.price;
$('[data-product-description]').textContent = product.description;
$('[data-product-image]').src = product.image;
$('[data-product-image]').alt = product.name;
$('[data-marketplace-buy]').href = `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(`Ha Lo Beauty ${product.name}`)}`;
document.title = `${product.name} — Ha Lo Beauty`;

const category = getProductCategory(catalogProduct?.category);
$('[data-product-category]').textContent = category.name;
$('[data-product-category]').href = category.href;
$('[data-product-current]').textContent = product.name;
const careFormula = CARE_FORMULAS[id];
if (careFormula) $('[data-product-description]').textContent = careFormula.description;
initProductGallery($('[data-product-gallery]'), getProductGallery(product, catalogProduct), product.name);

const featuredIngredients = {
  bb: [['Муцин улитки', 'Ухаживающий компонент формулы']],
  elixir: [['Гиалуроновая кислота', 'Увлажнение кожи'], ['Ниацинамид', 'Уход за тоном кожи'], ['Пантенол', 'Мягкость и комфорт']],
  oil: [['Масло арганы', 'Смягчение губ'], ['Масло кокоса', 'Питание и комфорт'], ['Витамин E', 'Ухаживающий компонент']],
};
const ingredients = careFormula?.ingredients ?? featuredIngredients[aliases[id] ?? id] ?? [];
const ingredientGrid = $('[data-product-ingredients]');
const dropImages = ['drop-lavender.jpg', 'drop-rose.jpg', 'drop-glycerin.jpg'];
ingredients.forEach(([name, benefit], index) => {
  const item = document.createElement('article');
  const image = document.createElement('img');
  image.src = `assets/ingredients/${dropImages[index % dropImages.length]}`;
  image.alt = ''; image.loading = 'lazy';
  const title = document.createElement('h3'); title.textContent = name;
  const copy = document.createElement('p'); copy.textContent = benefit;
  item.append(image, title, copy); ingredientGrid.append(item);
});
$('[data-product-ingredients-note]').hidden = ingredients.length > 0;
$('[data-product-inci-request]').href = `mailto:hb@halo-beauty.ru?subject=${encodeURIComponent(`Состав ${product.name}`)}`;
$('[data-product-certificate]').href = `mailto:hb@halo-beauty.ru?subject=${encodeURIComponent(`Документ о соответствии — ${product.name}`)}`;

const wishDialog = $('[data-wish-dialog]');
$('[data-wish-open]').addEventListener('click', () => wishDialog.showModal());
$('[data-wish-close]').addEventListener('click', () => wishDialog.close());
wishDialog.addEventListener('click', event => { if (event.target === wishDialog) {
  const box = wishDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) wishDialog.close();
} });
$('[data-wish-copy]').addEventListener('click', async () => {
  const url = new URL('product.html', location.href);
  url.searchParams.set('id', id);
  try {
    await navigator.clipboard.writeText(url.href);
    $('[data-wish-status]').textContent = 'Ссылка скопирована — её можно добавить в желание.';
  } catch {
    $('[data-wish-status]').textContent = `Скопируйте адрес: ${url.href}`;
  }
});

let selectedVariant = catalogProduct?.variants?.[0] ?? null;
const variantField = $('[data-detail-variants]');
if (catalogProduct?.variants?.length) {
  variantField.hidden = false;
  $('[data-detail-variant-name]').textContent = selectedVariant.label;
  $('[data-detail-variant-options]').innerHTML = catalogProduct.variants.map((variant, index) => `<button type="button" class="detail-variant${index === 0 ? ' is-selected' : ''}" style="--variant-tone:${variant.tone}" data-variant-index="${index}" aria-label="${variant.label}" aria-pressed="${index === 0}"></button>`).join('');
  variantField.addEventListener('click', (event) => {
    const button = event.target.closest('[data-variant-index]');
    if (!button) return;
    selectedVariant = catalogProduct.variants[Number(button.dataset.variantIndex)];
    $('[data-product-image]').src = selectedVariant.image;
    $('[data-product-image]').alt = `${product.name} — ${selectedVariant.label}`;
    $('[data-detail-variant-name]').textContent = selectedVariant.label;
    variantField.querySelectorAll('[data-variant-index]').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  });
}

document.querySelector(`[data-detail-recommendations] [data-product-id="${CSS.escape(id)}"]`)?.remove();

const specRows = featured
  ? product.specs.map((value, index) => ({ label: ['Страна происхождения', 'Вес состава', 'Особенности', 'Подходит'][index] ?? 'Характеристика', value }))
  : [
      { label: 'Страна происхождения', value: 'Уточняется' },
      { label: 'Вес состава', value: 'Уточняется' },
      ...product.specs.slice(0, 2).map((value, index) => ({ label: ['Категория', 'Варианты'][index] ?? 'Характеристика', value })),
    ];

$('[data-product-specs]').innerHTML = specRows
  .map(({ label, value }) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
  .join('');

let quantity = 1;
const renderQuantity = (next) => {
  quantity = clampQuantity(next);
  $('[data-detail-quantity]').textContent = String(quantity);
};

$('[data-detail-minus]').addEventListener('click', () => renderQuantity(quantity - 1));
$('[data-detail-plus]').addEventListener('click', () => renderQuantity(quantity + 1));
$('[data-detail-add]').addEventListener('click', () => {
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('halo-cart') || '[]'); } catch { cart = []; }
  const cartName = selectedVariant ? `${product.name} · ${selectedVariant.label}` : product.name;
  cart = addCartItem(cart, { id: selectedVariant ? `${id}-${selectedVariant.label}` : id, name: cartName, image: selectedVariant?.image ?? product.image, price: product.price }, quantity);
  localStorage.setItem('halo-cart', JSON.stringify(cart));
  $('[data-detail-confirmation]').textContent = `${quantity} × ${cartName} добавлено в корзину`;
  window.dispatchEvent(new CustomEvent('halo:cart-added', { detail: { name: cartName } }));
});

const favoriteButton = $('[data-detail-favorite]');
const readFavorites = () => {
  try { return JSON.parse(localStorage.getItem('halo-favorites') || '[]'); } catch { return []; }
};
const syncFavorite = () => {
  const active = isFavorite(readFavorites(), id);
  favoriteButton.classList.toggle('is-active', active);
  favoriteButton.setAttribute('aria-pressed', String(active));
  favoriteButton.querySelector('span').textContent = active ? 'В избранном' : 'Добавить в избранное';
};
favoriteButton.addEventListener('click', () => {
  const next = toggleFavorite(readFavorites(), { id, name: product.name, image: product.image, price: product.price });
  localStorage.setItem('halo-favorites', JSON.stringify(next));
  syncFavorite();
  window.dispatchEvent(new CustomEvent('halo:favorite-changed', { detail: { active: isFavorite(next, id), name: product.name } }));
});
syncFavorite();
