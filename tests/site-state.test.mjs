import test from 'node:test';
import assert from 'node:assert/strict';
import { clampQuantity, resolveShade, createCartConfirmation, addCartItem, updateCartQuantity, cartTotal, toggleFavorite, isFavorite } from '../site-state.js';

test('keeps quantity between one and nine', () => {
  assert.equal(clampQuantity(0), 1);
  assert.equal(clampQuantity(4), 4);
  assert.equal(clampQuantity(12), 9);
});

test('resolves approved shade names', () => {
  assert.equal(resolveShade('old-money'), 'Old Money');
  assert.equal(resolveShade('salt-caramel'), 'Salt Caramel');
});

test('builds a cart confirmation with shade and quantity', () => {
  assert.equal(createCartConfirmation(2, 'kola'), '2 × Kola добавлено в корзину');
});

test('adds repeated products to one cart row', () => {
  const first = addCartItem([], { id: 'bb', name: 'WOW BB BALM', price: '2 300 ₽', image: 'bb.png' }, 1);
  const second = addCartItem(first, { id: 'bb', name: 'WOW BB BALM', price: '2 300 ₽', image: 'bb.png' }, 2);
  assert.equal(second.length, 1);
  assert.equal(second[0].quantity, 3);
});

test('updates cart quantities and removes zero rows', () => {
  const cart = [{ id: 'bb', name: 'WOW BB BALM', price: '2 300 ₽', priceValue: 2300, image: 'bb.png', quantity: 2 }];
  assert.equal(updateCartQuantity(cart, 'bb', 1)[0].quantity, 1);
  assert.deepEqual(updateCartQuantity(cart, 'bb', 0), []);
});

test('calculates the cart total', () => {
  const cart = [
    { priceValue: 2300, quantity: 2 },
    { priceValue: 900, quantity: 1 },
  ];
  assert.equal(cartTotal(cart), 5500);
});

test('toggles a product in favorites', () => {
  const product = { id: 'bb', name: 'WOW BB BALM', image: 'bb.png', price: '2 300 ₽' };
  const added = toggleFavorite([], product);
  assert.equal(isFavorite(added, 'bb'), true);
  assert.deepEqual(toggleFavorite(added, product), []);
});
