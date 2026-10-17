import test from 'node:test';
import assert from 'node:assert/strict';
import { getProductGallery, getProductCategory } from '../product-experience.js';

test('gallery uses actual product photos, removes duplicates and does not mix shades', () => {
  assert.deepEqual(getProductGallery({ image:'main.png' }, { image:'main.png', variants:[{image:'other-shade.png'}] }), ['main.png']);
  assert.deepEqual(getProductGallery({ image:'cutout.png' }, { image:'pack.png' }), ['cutout.png','pack.png']);
  assert.deepEqual(getProductGallery({ image:'cutout.png', gallery:['detail.png','cutout.png'] }), ['cutout.png','detail.png']);
});

test('breadcrumbs link to the actual product category', () => {
  assert.deepEqual(getProductCategory('care'), { name:'Уход', href:'catalog.html?category=care' });
  assert.deepEqual(getProductCategory('brushes'), { name:'Кисти', href:'catalog.html?category=brushes' });
  assert.deepEqual(getProductCategory(undefined), { name:'Макияж', href:'catalog.html?category=makeup' });
});
