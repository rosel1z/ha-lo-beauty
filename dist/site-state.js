const shades = Object.freeze({
  'ice-latte': 'Ice Latte',
  kola: 'Kola',
  'old-money': 'Old Money',
  'salt-caramel': 'Salt Caramel',
});

export const clampQuantity = (value) => Math.min(9, Math.max(1, Number(value) || 1));

export const resolveShade = (value) => shades[value] ?? shades['old-money'];

export const createCartConfirmation = (quantity, shade) =>
  `${clampQuantity(quantity)} × ${resolveShade(shade)} добавлено в корзину`;

const toPriceNumber = (value) => Number(String(value ?? '').replace(/\D/g, '')) || 0;

export const addCartItem = (cart = [], product, quantity = 1) => {
  const nextQuantity = clampQuantity(quantity);
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    return cart.map((item) => item.id === product.id
      ? { ...item, quantity: clampQuantity(item.quantity + nextQuantity) }
      : item);
  }
  return [...cart, {
    ...product,
    priceValue: product.priceValue ?? toPriceNumber(product.price),
    quantity: nextQuantity,
  }];
};

export const updateCartQuantity = (cart = [], id, quantity) => {
  if (Number(quantity) <= 0) return cart.filter((item) => item.id !== id);
  return cart.map((item) => item.id === id ? { ...item, quantity: clampQuantity(quantity) } : item);
};

export const cartTotal = (cart = []) => cart.reduce(
  (sum, item) => sum + (item.priceValue ?? toPriceNumber(item.price)) * item.quantity,
  0,
);

export const formatPrice = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

export const isFavorite = (favorites = [], id) => favorites.some((item) => item.id === id);

export const toggleFavorite = (favorites = [], product) => (
  isFavorite(favorites, product.id)
    ? favorites.filter((item) => item.id !== product.id)
    : [...favorites, product]
);
