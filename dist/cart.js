import { updateCartQuantity, cartTotal, formatPrice } from './site-state.js';

const list = document.querySelector('[data-cart-list]');
const total = document.querySelector('[data-cart-total]');
const checkout = document.querySelector('[data-checkout]');
const note = document.querySelector('[data-checkout-note]');

const readCart = () => {
  try { return JSON.parse(localStorage.getItem('halo-cart') || '[]'); } catch { return []; }
};
const writeCart = (cart) => localStorage.setItem('halo-cart', JSON.stringify(cart));

const render = () => {
  const cart = readCart();
  total.textContent = formatPrice(cartTotal(cart));
  checkout.disabled = cart.length === 0;
  if (!cart.length) {
    list.innerHTML = `<div class="cart-empty"><h2>Корзина пока пуста</h2><p>Выберите любимые средства — они появятся здесь.</p><a href="catalog.html">Перейти в каталог →</a></div>`;
    return;
  }
  list.innerHTML = cart.map((item) => `
    <article class="cart-row" data-cart-id="${item.id}">
      <a href="product.html?id=${encodeURIComponent(item.id)}"><img src="${item.image}" alt="${item.name}"></a>
      <div class="cart-row-copy"><h2>${item.name}</h2><span>${item.price}</span><button type="button" data-remove>Удалить</button></div>
      <div class="cart-quantity" aria-label="Количество ${item.name}"><button type="button" data-minus>−</button><output>${item.quantity}</output><button type="button" data-plus>+</button></div>
    </article>`).join('');
};

list.addEventListener('click', (event) => {
  const row = event.target.closest('[data-cart-id]');
  if (!row) return;
  const cart = readCart();
  const item = cart.find((entry) => entry.id === row.dataset.cartId);
  if (!item) return;
  let quantity = item.quantity;
  if (event.target.closest('[data-minus]')) quantity -= 1;
  else if (event.target.closest('[data-plus]')) quantity += 1;
  else if (event.target.closest('[data-remove]')) quantity = 0;
  else return;
  writeCart(updateCartQuantity(cart, item.id, quantity));
  window.dispatchEvent(new CustomEvent('halo:cart-changed'));
  render();
});

checkout.addEventListener('click', () => {
  note.textContent = 'Заказ сохранён. Менеджер Ha Lo Beauty поможет завершить оформление.';
});

render();
