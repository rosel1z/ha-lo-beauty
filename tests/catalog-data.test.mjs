import test from 'node:test';
import assert from 'node:assert/strict';

import { catalogProducts, catalogCategories, getProductsByCategory } from '../catalog-data.js';

test('catalog exposes all five approved categories', () => {
  assert.deepEqual(catalogCategories, ['care', 'makeup', 'kids', 'brushes', 'sets']);
});

test('catalog contains the supplied collection and local image paths', () => {
  assert.ok(catalogProducts.length >= 35);
  for (const product of catalogProducts) {
    assert.ok(catalogCategories.includes(product.category));
    assert.match(product.image, /^assets\/catalog\//);
  }
});

test('shade families are grouped into one product card', () => {
  const pencil = catalogProducts.find((product) => product.id === 'all-day-lip-pencil');
  const concealer = catalogProducts.find((product) => product.id === 'skin-photoshop-concealer');
  const sparkle = catalogProducts.find((product) => product.id === 'wow-eye-sparkle');
  assert.equal(pencil.variants.length, 4);
  assert.equal(concealer.variants.length, 4);
  assert.equal(sparkle.variants.length, 5);
});

test('category filtering returns only products from the selected category', () => {
  for (const category of catalogCategories) {
    const products = getProductsByCategory(category);
    assert.ok(products.length > 0);
    assert.ok(products.every((product) => product.category === category));
  }
});

test('children and brush products are assigned to their dedicated categories', () => {
  assert.equal(catalogProducts.find((product) => product.id === 'kids-care-gift-set').category, 'kids');
  assert.equal(catalogProducts.find((product) => product.id === 'makeup-brush-360').category, 'brushes');
});

test('catalog carries current official prices and verified articles', () => {
  const acne = catalogProducts.find((product) => product.id === 'acne-stop-serum');
  const highlighter = catalogProducts.find((product) => product.id === 'baked-glow-highlighter');
  const brushes = catalogProducts.find((product) => product.id === 'makeup-brush-360');

  assert.equal(acne.price, '1 450 ₽');
  assert.equal(acne.sku, 'UH3321-093');
  assert.equal(highlighter.price, '750 ₽');
  assert.equal(highlighter.sku, 'UH3321-278');
  assert.equal(brushes.price, '950 ₽');
});
