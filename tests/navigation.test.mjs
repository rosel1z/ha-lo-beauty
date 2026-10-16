import test from 'node:test';
import assert from 'node:assert/strict';
import { mobileDockItems, createMobileDockMarkup, createDesktopMenuMarkup, createFooterMarkup } from '../navigation.js';

test('mobile dock exposes six useful actions in the requested order', () => {
  assert.deepEqual(mobileDockItems.map((item) => item.id), ['menu', 'search', 'catalog', 'favorite', 'cart', 'profile']);
  const markup = createMobileDockMarkup();
  assert.match(markup, /data-mobile-menu/);
  assert.match(markup, /catalog\.html#catalog-search/);
  assert.match(markup, /catalog\.html/);
  assert.match(markup, /cart\.html/);
  assert.match(markup, /account\.html/);
});

test('desktop menu exposes every main section', () => {
  const markup = createDesktopMenuMarkup();
  for (const label of ['Каталог', 'О бренде', 'Доставка', 'Программа лояльности', 'Подарочная карта', 'Акции', 'Новости', 'Контакты']) {
    assert.match(markup, new RegExp(label));
  }
});

test('shared footer links to the main information and shopping pages', () => {
  const markup = createFooterMarkup();
  for (const href of ['catalog.html', 'about.html', 'delivery.html', 'loyalty.html', 'contacts.html']) {
    assert.match(markup, new RegExp(`href="${href}"`));
  }
  assert.match(markup, /Wildberries/);
  assert.match(markup, /Ozon/);
});
