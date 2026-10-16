export const mobileDockItems = Object.freeze([
  { id: 'menu', label: 'Меню', type: 'button' },
  { id: 'search', label: 'Поиск', href: 'catalog.html#catalog-search' },
  { id: 'catalog', label: 'Категории', href: 'catalog.html' },
  { id: 'favorite', label: 'Избранное', href: 'favorites.html' },
  { id: 'cart', label: 'Корзина', href: 'cart.html' },
  { id: 'profile', label: 'Профиль', href: 'account.html' },
]);

const icons = {
  menu: '<span></span><span></span><span></span>',
  search: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="14" cy="14" r="8.5"/><path d="m20.5 20.5 7 7"/></svg>',
  catalog: '<img src="assets/Vector.svg" alt="">',
  favorite: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27S5 21 5 12.5C5 6.5 12.5 5 16 10c3.5-5 11-3.5 11 2.5C27 21 16 27 16 27Z"/></svg>',
  cart: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 10h18l-1.5 17h-15L7 10Z"/><path d="M12 11V8a4 4 0 0 1 8 0v3"/></svg>',
  profile: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="5"/><path d="M6 29c1-7 5-10 10-10s9 3 10 10"/></svg>',
};

export function createMobileDockMarkup() {
  const items = mobileDockItems.map((item) => {
    const common = `class="mobile-dock-item mobile-dock-item--${item.id}" aria-label="${item.label}"`;
    if (item.type === 'button') return `<button type="button" ${common} data-mobile-menu aria-expanded="false" aria-controls="site-menu">${icons[item.id]}</button>`;
    return `<a ${common} href="${item.href}">${icons[item.id]}</a>`;
  }).join('');
  return `<nav class="mobile-dock" aria-label="Быстрая навигация">${items}</nav>`;
}

const fullMenu = [
  ['catalog.html', 'Каталог'], ['about.html', 'О бренде'], ['delivery.html', 'Доставка'],
  ['loyalty.html', 'Программа лояльности'], ['gift-card.html', 'Подарочная карта'],
  ['sale.html', 'Акции'], ['news.html', 'Новости'], ['contacts.html', 'Контакты'],
];

export function createHeaderActionsMarkup() {
  return `<a href="catalog.html#catalog-search" aria-label="Поиск">${icons.search}</a><a href="favorites.html" aria-label="Избранное">${icons.favorite}</a><a href="account.html" aria-label="Личный кабинет">${icons.profile}</a><a href="cart.html" aria-label="Корзина">${icons.cart}</a>`;
}

export function createDesktopMenuMarkup() {
  const links = fullMenu.map(([href, label], index) => `<a href="${href}"><small>${String(index + 1).padStart(2, '0')}</small><span>${label}</span><b>↗</b></a>`).join('');
  return `<button class="desktop-menu-toggle" type="button" data-site-menu-toggle aria-expanded="false" aria-controls="desktop-menu-panel"><span>Меню</span></button><nav id="desktop-menu-panel" class="desktop-menu-panel" aria-label="Полное меню">${links}</nav>`;
}

export function createFooterMarkup() {
  return `<div class="footer-brand"><img src="assets/logo.svg" alt="Ha Lo Beauty"></div>
    <nav class="footer-column" aria-label="Покупателям"><strong>Покупателям</strong><a href="catalog.html">Каталог</a><a href="cart.html">Корзина</a><a href="account.html">Личный кабинет</a><a href="delivery.html">Доставка и оплата</a><a href="loyalty.html">Программа лояльности</a></nav>
    <nav class="footer-column" aria-label="О компании"><strong>Ha Lo Beauty</strong><a href="about.html">О бренде</a><a href="sale.html">Акции</a><a href="news.html">Новости</a><a href="contacts.html">Контакты</a></nav>
    <nav class="footer-column" aria-label="Маркетплейсы"><strong>Мы онлайн</strong><a href="https://www.wildberries.ru/catalog/0/search.aspx?search=ha%20lo%20beauty" target="_blank" rel="noreferrer">Wildberries ↗</a><a href="https://www.ozon.ru/search/?text=ha%20lo%20beauty" target="_blank" rel="noreferrer">Ozon ↗</a><a href="https://market.yandex.ru/search?text=ha%20lo%20beauty" target="_blank" rel="noreferrer">Яндекс Маркет ↗</a></nav>
    <div class="footer-bottom"><span>© 2026 Ha Lo Beauty</span><a href="mailto:hb@halo-beauty.ru">hb@halo-beauty.ru</a></div>`;
}
