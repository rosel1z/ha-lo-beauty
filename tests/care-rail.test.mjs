import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogProducts } from '../catalog-data.js';
import {
  CARE_RAIL_IDS,
  getCareRailProducts,
  getCareRailDetail,
  getCareResult,
  getNextRailIndex,
  wrapRailOffset,
} from '../care-rail.js';

test('selects the approved care products in editorial order', () => {
  assert.deepEqual(CARE_RAIL_IDS, [
    'moisturizing-cream',
    'ultra-moisturizing-serum',
    'brightening-serum',
    'eye-cream',
    'mother-of-creams',
    'acne-stop-serum',
  ]);

  const products = getCareRailProducts(catalogProducts);
  assert.deepEqual(products.map(({ id }) => id), CARE_RAIL_IDS);
  assert.equal(products[0].name, 'WOW MOISTURIZING CREAM');
  assert.equal(products[0].price, '1 770 ₽');
  assert.equal(products[0].image, 'assets/catalog/WOW MOISTURIZING CREAM.png');
});

test('binds a before-and-after result to the selected care product', () => {
  assert.deepEqual(getCareResult('moisturizing-cream'), {
    before: 'assets/temporary/vois-before-1.png',
    after: 'assets/temporary/vois-after-1.png',
  });
  assert.deepEqual(getCareResult('eye-cream'), {
    before: 'assets/temporary/vois-before-2.png',
    after: 'assets/temporary/vois-after-2.png',
  });
});

test('resolves the exact detail shown for the selected product', () => {
  const products = getCareRailProducts(catalogProducts);
  assert.deepEqual(getCareRailDetail(products, 1), {
    id: 'ultra-moisturizing-serum',
    name: 'ULTRA MOISTURIZING SERUM',
    subtitle: 'Интенсивно увлажняющая сыворотка',
    price: '1 450 ₽',
    image: 'assets/catalog/ULTRA MOISTURIZING SERUM.png',
    href: 'product.html?id=ultra-moisturizing-serum',
    position: '02 / 06',
  });
});

test('wraps rail offsets in both directions without invalid zero-width values', () => {
  assert.equal(wrapRailOffset(725, 300), 125);
  assert.equal(wrapRailOffset(-50, 300), 250);
  assert.equal(wrapRailOffset(20, 0), 0);
});

test('moves through product indexes cyclically', () => {
  assert.equal(getNextRailIndex(5, 1, 6), 0);
  assert.equal(getNextRailIndex(0, -1, 6), 5);
  assert.equal(getNextRailIndex(2, 8, 6), 4);
  assert.equal(getNextRailIndex(2, 1, 0), 0);
});
