import { clampQuantity, resolveShade, createCartConfirmation, addCartItem, toggleFavorite, isFavorite } from './site-state.js';
import { createMobileDockMarkup, createDesktopMenuMarkup, createFooterMarkup, createHeaderActionsMarkup } from './navigation.js?v=23';
import { catalogProducts } from './catalog-data.js';
import { getCareRailProducts, initCareRail } from './care-rail.js?v=7';
import { initLoyaltyCards } from './loyalty-cards.js?v=1';

initLoyaltyCards();

const header = document.querySelector('.site-header');
const hero = document.querySelector('[data-hero]');
const navigation = document.querySelector('.site-nav');
const headerActions = header?.querySelector('.header-actions');
const careRail = document.querySelector('[data-care-rail]');

document.querySelectorAll('.shimmer-field').forEach((field, fieldIndex) => {
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 72; index += 1) {
    const particle = document.createElement('i');
    const seed = index + fieldIndex * 29;
    const rawX = ((seed * 47.3 + 13) % 100);
    let x = rawX > 33 && rawX < 67 ? (index % 2 ? rawX - 29 : rawX + 29) : rawX;
    let y = ((seed * 31.7 + 7) % 100);
    const glint = index % 12 === 0;
    if (glint) {
      const positions = [[5, 18], [25, 50], [12, 79], [82, 12], [96, 45], [88, 82]];
      [x, y] = positions[(index / 12 + fieldIndex) % positions.length];
    }
    particle.className = glint ? 'shimmer-glint' : 'shimmer-grain';
    particle.style.cssText = `--x:${x}%;--y:${y}%;--size:${glint ? 30 + index % 5 * 3 : 1.6 + index % 4 * 0.55}px;--delay:${-(index % 19) * 0.41}s;--duration:${4.2 + index % 7 * 0.6}s;--drift:${index % 2 ? 5 : -4}px`;
    fragment.appendChild(particle);
  }
  field.appendChild(fragment);
});

if ('IntersectionObserver' in window) {
  const shimmerObserver = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => target.classList.toggle('is-visible', isIntersecting)), { threshold: 0.05 });
  document.querySelectorAll('.shimmer-field').forEach((field) => shimmerObserver.observe(field));
} else {
  document.querySelectorAll('.shimmer-field').forEach((field) => field.classList.add('is-visible'));
}

if (careRail) initCareRail(careRail, getCareRailProducts(catalogProducts));

document.querySelectorAll('[data-before-after-range]').forEach((range) => {
  const card = range.closest('.before-after-card');
  const updateReveal = () => card?.style.setProperty('--reveal', `${range.value}%`);
  range.addEventListener('input', updateReveal);
  updateReveal();
});

if (headerActions) headerActions.innerHTML = createHeaderActionsMarkup();

if (navigation && !navigation.querySelector('.mobile-menu-content')) {
  const mobileLinks = [['account.html', 'Личный кабинет'], ['catalog.html', 'Каталог'], ['delivery.html', 'Доставка и оплата'], ['loyalty.html', 'Программа лояльности'], ['about.html', 'О бренде'], ['gift-card.html', 'Подарочная карта'], ['sale.html', 'Акции'], ['news.html', 'Новости'], ['contacts.html', 'Контакты']];
  navigation.insertAdjacentHTML('beforeend', `<div class="mobile-menu-content">${mobileLinks.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</div>`);
}

if (navigation && !document.querySelector('.mobile-dock')) {
  document.body.insertAdjacentHTML('beforeend', createMobileDockMarkup());
}

if (header && !document.querySelector('.desktop-menu-toggle')) {
  const actions = header.querySelector('.header-actions, .product-back');
  actions?.insertAdjacentHTML('beforebegin', createDesktopMenuMarkup());
}

let footer = document.querySelector('.site-footer');
if (!footer) {
  footer = document.createElement('footer');
  footer.className = 'site-footer';
  document.body.insertBefore(footer, document.querySelector('.mobile-dock'));
}
footer.innerHTML = createFooterMarkup();

let globalNote = document.querySelector('.detail-note');
if (!globalNote && header) {
  globalNote = document.createElement('section');
  globalNote.className = 'detail-note global-detail-note';
  globalNote.dataset.detailNote = '';
  globalNote.setAttribute('aria-label', 'Преимущества магазина');
  globalNote.innerHTML = '<p class="is-active">Бесплатная доставка при заказе от 4 000 ₽</p><p>Оригинальная продукция Ha Lo Beauty</p><p>Помощь с подбором в Telegram</p>';
  header.insertAdjacentElement('afterend', globalNote);
  document.body.classList.add('has-global-note');
  const positionGlobalNote = () => { globalNote.style.top = `${header.offsetHeight}px`; };
  window.addEventListener('scroll', positionGlobalNote, { passive: true });
  window.addEventListener('resize', positionGlobalNote, { passive: true });
  positionGlobalNote();
}

const noteItems = [...document.querySelectorAll('[data-detail-note] p')];
if (noteItems.length > 1) {
  let noteIndex = 0;
  window.setInterval(() => {
    const previous = noteItems[noteIndex];
    previous.classList.remove('is-active');
    previous.classList.add('is-leaving');
    noteIndex = (noteIndex + 1) % noteItems.length;
    noteItems[noteIndex].classList.remove('is-leaving');
    noteItems[noteIndex].classList.add('is-active');
    window.setTimeout(() => previous.classList.remove('is-leaving'), 550);
  }, 3600);
}

const cartIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 13H6L5 8Z"></path><path d="M9 9V6a3 3 0 0 1 6 0v3"></path></svg>';
const heartIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21S3 16 3 9.5C3 5 9 3.5 12 7.5 15 3.5 21 5 21 9.5 21 16 12 21 12 21Z"></path></svg>';
const readCart = () => {
  try { return JSON.parse(localStorage.getItem('halo-cart') || '[]'); } catch { return []; }
};
const saveCart = (cart) => localStorage.setItem('halo-cart', JSON.stringify(cart));
const syncCartCount = () => {
  const count = readCart().reduce((total, item) => total + Number(item.quantity || 0), 0);
  document.querySelectorAll('.header-actions a[href="cart.html"], .mobile-dock-item--cart').forEach((link) => {
    let badge = link.querySelector('.cart-count');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-count';
      link.append(badge);
    }
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.hidden = count === 0;
  });
};
const readFavorites = () => {
  try { return JSON.parse(localStorage.getItem('halo-favorites') || '[]'); } catch { return []; }
};
const getCardProduct = (card) => {
  const link = card.querySelector('a[href*="product.html?id="]') ?? (card.matches('a') ? card : null);
  const url = new URL(link?.href ?? window.location.href);
  const price = card.querySelector('.catalog-card-copy > strong, .full-catalog-meta strong, .recommendation-card > span:last-of-type');
  return {
    id: url.searchParams.get('id') ?? card.dataset.catalogProduct ?? card.dataset.productId,
    name: card.querySelector('h3, .recommendation-card > strong')?.textContent.trim() ?? 'Товар Ha Lo Beauty',
    image: card.querySelector('img')?.getAttribute('src') ?? '',
    price: price?.textContent.trim() ?? '',
  };
};
const showCartToast = (name) => {
  let toast = document.querySelector('.cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(toast);
  }
  toast.innerHTML = `<span>${cartIcon}</span><div><strong>Товар добавлен в корзину</strong><small>${name}</small></div><a href="cart.html">В корзину →</a>`;
  toast.classList.add('is-visible');
  window.clearTimeout(showCartToast.timer);
  showCartToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
};
window.addEventListener('halo:cart-added', (event) => showCartToast(event.detail?.name ?? 'Ha Lo Beauty'));
window.addEventListener('halo:cart-added', syncCartCount);
window.addEventListener('halo:cart-changed', syncCartCount);
window.addEventListener('storage', syncCartCount);
syncCartCount();

const showFavoriteToast = ({ active, name }) => {
  let toast = document.querySelector('.favorite-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'favorite-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(toast);
  }
  toast.innerHTML = `<span>${heartIcon}</span><div><strong>${active ? 'Добавлено в избранное' : 'Удалено из избранного'}</strong><small>${name}</small></div>`;
  toast.classList.add('is-visible');
  window.clearTimeout(showFavoriteToast.timer);
  showFavoriteToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
};
window.addEventListener('halo:favorite-changed', (event) => showFavoriteToast(event.detail));

const addCardToCart = (control) => {
  const card = control.closest('.catalog-card, .full-catalog-card, .recommendation-card');
  if (!card) return;
  const product = getCardProduct(card);
  saveCart(addCartItem(readCart(), product, 1));
  control.classList.add('is-added');
  window.dispatchEvent(new CustomEvent('halo:cart-added', { detail: product }));
  window.setTimeout(() => control.classList.remove('is-added'), 900);
};
const activateControl = (handler) => (event) => {
  if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  handler(event.currentTarget);
};

const enableDragRail = (rail) => {
  let startX = 0;
  let startScroll = 0;
  let dragged = false;
  let isDown = false;
  rail.querySelectorAll('img').forEach((image) => image.setAttribute('draggable', 'false'));
  rail.addEventListener('dragstart', (event) => event.preventDefault());
  rail.addEventListener('mousedown', (event) => {
    if (event.button !== 0 || event.target.closest('button')) return;
    isDown = true;
    startX = event.clientX;
    startScroll = rail.scrollLeft;
    dragged = false;
    rail.classList.add('is-dragging');
  });
  rail.addEventListener('mousemove', (event) => {
    if (!isDown) return;
    event.preventDefault();
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 5) dragged = true;
    rail.scrollLeft = startScroll - distance;
  });
  const finishDrag = () => {
    isDown = false;
    rail.classList.remove('is-dragging');
  };
  rail.addEventListener('mouseup', finishDrag);
  rail.addEventListener('mouseleave', finishDrag);
  window.addEventListener('mouseup', finishDrag);
  rail.addEventListener('click', (event) => {
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
    dragged = false;
  }, true);
};

document.querySelectorAll('.product-grid, .recommendation-rail, .editorial-rail, .achievement-media, .results-reels-rail').forEach(enableDragRail);

const reviewVideos = [...document.querySelectorAll('.results-reel')];
reviewVideos.forEach((card) => {
  const video = card.querySelector('video');
  const playButton = card.querySelector('button');
  if (!video || !playButton) return;

  const pauseOthers = () => reviewVideos.forEach((otherCard) => {
    if (otherCard === card) return;
    otherCard.querySelector('video')?.pause();
  });
  const toggleVideo = async () => {
    if (video.paused) {
      pauseOthers();
      try { await video.play(); } catch { card.classList.remove('is-playing'); }
    } else {
      video.pause();
    }
  };

  playButton.addEventListener('click', toggleVideo);
  video.addEventListener('click', toggleVideo);
  video.addEventListener('play', () => card.classList.add('is-playing'));
  video.addEventListener('pause', () => card.classList.remove('is-playing'));
  video.addEventListener('ended', () => card.classList.remove('is-playing'));
});
document.querySelectorAll('.category-tile').forEach((tile) => {
  tile.addEventListener('pointerdown', () => {
    tile.closest('.category-grid')?.querySelectorAll('.category-tile').forEach((item) => item.classList.toggle('is-active', item === tile));
  });
});
const decorateCards = (scope = document) => {
  const cards = [];
  if (scope.matches?.('.catalog-card, .full-catalog-card, .recommendation-card')) cards.push(scope);
  cards.push(...scope.querySelectorAll?.('.catalog-card, .full-catalog-card, .recommendation-card') ?? []);
  cards.forEach((card) => {
    const media = card.querySelector('.catalog-card-media, .full-catalog-media, .recommendation-image');
    if (media && !media.querySelector('.favorite-button')) {
      const favorite = document.createElement('span');
      favorite.className = 'favorite-button';
      favorite.setAttribute('role', 'button');
      favorite.setAttribute('tabindex', '0');
      favorite.setAttribute('aria-label', 'Добавить в избранное');
      favorite.innerHTML = heartIcon;
      const product = getCardProduct(card);
      favorite.classList.toggle('is-active', isFavorite(readFavorites(), product.id));
      favorite.addEventListener('click', activateControl((control) => {
        const next = toggleFavorite(readFavorites(), product);
        localStorage.setItem('halo-favorites', JSON.stringify(next));
        const active = isFavorite(next, product.id);
        control.classList.toggle('is-active', active);
        control.setAttribute('aria-label', active ? 'Убрать из избранного' : 'Добавить в избранное');
        window.dispatchEvent(new CustomEvent('halo:favorite-changed', { detail: { active, name: product.name } }));
      }));
      favorite.addEventListener('keydown', activateControl((control) => control.click()));
      media.append(favorite);
    }
    if (!card.querySelector('.card-cart-button')) {
      const price = card.querySelector('.catalog-card-copy > strong, .full-catalog-meta strong, .recommendation-card > span:last-of-type');
      if (!price) return;
      const cart = document.createElement('span');
      cart.className = 'card-cart-button';
      cart.setAttribute('aria-hidden', 'true');
      cart.innerHTML = cartIcon;
      if (card.matches('.full-catalog-card')) {
        const purchase = price.closest('p');
        purchase.classList.add('card-purchase');
        purchase.setAttribute('role', 'button');
        purchase.setAttribute('tabindex', '0');
        purchase.setAttribute('aria-label', 'Добавить товар в корзину');
        purchase.prepend(cart);
        purchase.addEventListener('click', activateControl(addCardToCart));
        purchase.addEventListener('keydown', activateControl((control) => control.click()));
      } else {
        const purchase = document.createElement('span');
        purchase.className = 'card-purchase';
        purchase.setAttribute('role', 'button');
        purchase.setAttribute('tabindex', '0');
        purchase.setAttribute('aria-label', 'Добавить товар в корзину');
        price.insertAdjacentElement('beforebegin', purchase);
        purchase.append(cart, price);
        purchase.addEventListener('click', activateControl(addCardToCart));
        purchase.addEventListener('keydown', activateControl((control) => control.click()));
      }
    }
  });
};

decorateCards();
new MutationObserver((entries) => {
  entries.forEach((entry) => entry.addedNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) decorateCards(node);
  }));
}).observe(document.body, { childList: true, subtree: true });

const menuButtons = [...document.querySelectorAll('.menu-toggle, [data-mobile-menu], [data-site-menu-toggle]')];
const desktopMenu = document.querySelector('.desktop-menu-panel');

const syncHeader = () => {
  const heroExit = hero ? Math.max(24, hero.offsetHeight - (header?.offsetHeight ?? 0)) : 24;
  header?.classList.toggle('is-scrolled', window.scrollY >= heroExit);
};

const setMenuOpen = (open) => {
  menuButtons.forEach((button) => button.setAttribute('aria-expanded', String(open)));
  navigation?.classList.toggle('is-open', open);
  desktopMenu?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-is-open', open);
};

menuButtons.forEach((button) => button.addEventListener('click', () => {
  setMenuOpen(button.getAttribute('aria-expanded') !== 'true');
}));

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenuOpen(false);
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

if (window.location.hash === '#catalog-search') {
  requestAnimationFrame(() => document.querySelector('[data-catalog-search]')?.focus());
}

window.addEventListener('scroll', syncHeader, { passive: true });
window.addEventListener('resize', syncHeader, { passive: true });
syncHeader();

const shadeButtons = [...document.querySelectorAll('[data-shade]')];
const shadeName = document.querySelector('[data-shade-name]');
let selectedShade = document.querySelector('[data-shade][aria-pressed="true"]')?.dataset.shade ?? 'old-money';

shadeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedShade = button.dataset.shade;
    shadeButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    if (shadeName) shadeName.textContent = resolveShade(selectedShade);
  });
});

const quantityOutput = document.querySelector('[data-quantity]');
let quantity = 1;
const setQuantity = (next) => {
  quantity = clampQuantity(next);
  if (quantityOutput) quantityOutput.textContent = String(quantity);
};

document.querySelector('[data-quantity-minus]')?.addEventListener('click', () => setQuantity(quantity - 1));
document.querySelector('[data-quantity-plus]')?.addEventListener('click', () => setQuantity(quantity + 1));
document.querySelector('[data-add-to-cart]')?.addEventListener('click', () => {
  const confirmation = document.querySelector('[data-cart-confirmation]');
  if (confirmation) confirmation.textContent = createCartConfirmation(quantity, selectedShade);
});

const rail = document.querySelector('[data-recommendation-rail]');
const moveRail = (direction) => rail?.scrollBy({ left: direction * rail.clientWidth * 0.72, behavior: 'smooth' });
document.querySelector('[data-rail-prev]')?.addEventListener('click', () => moveRail(-1));
document.querySelector('[data-rail-next]')?.addEventListener('click', () => moveRail(1));

const resultsRail = document.querySelector('[data-results-rail]');
const moveResultsRail = (direction) => resultsRail?.scrollBy({ left: direction * resultsRail.clientWidth * 0.78, behavior: 'smooth' });
document.querySelector('[data-results-prev]')?.addEventListener('click', () => moveResultsRail(-1));
document.querySelector('[data-results-next]')?.addEventListener('click', () => moveResultsRail(1));

const motionRail = document.querySelector('[data-editorial-rail]');
const motionDots = [...document.querySelectorAll('[data-motion-dot]')];
const motionProgress = document.querySelector('[data-motion-progress]');
let motionIndex = 0;
let motionTimer;
let motionPaused = false;
const restartMotionProgress = () => {
  if (!motionProgress) return;
  motionProgress.classList.remove('is-running');
  void motionProgress.offsetWidth;
  if (!motionPaused) motionProgress.classList.add('is-running');
};
const scheduleMotion = () => {
  window.clearTimeout(motionTimer);
  restartMotionProgress();
  if (!motionPaused && motionRail && motionDots.length > 1) motionTimer = window.setTimeout(() => showMotion(motionIndex + 1), 5000);
};
function showMotion(index, behavior = 'smooth') {
  if (!motionRail || !motionDots.length) return;
  motionIndex = (index + motionDots.length) % motionDots.length;
  const slide = motionRail.children[motionIndex];
  const firstSlide = motionRail.children[0];
  motionRail.scrollTo({ left: slide ? slide.offsetLeft - (firstSlide?.offsetLeft ?? 0) : motionIndex * motionRail.clientWidth, behavior });
  motionDots.forEach((dot, dotIndex) => dot.setAttribute('aria-pressed', String(dotIndex === motionIndex)));
  scheduleMotion();
}
window.addEventListener('pageshow', () => showMotion(0, 'auto'));
document.querySelector('[data-motion-prev]')?.addEventListener('click', () => showMotion(motionIndex - 1));
document.querySelector('[data-motion-next]')?.addEventListener('click', () => showMotion(motionIndex + 1));
motionDots.forEach((dot) => dot.addEventListener('click', () => showMotion(Number(dot.dataset.motionDot))));
document.querySelectorAll('.look-products-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const slide = button.closest('.look-slide');
    const isOpen = slide?.classList.toggle('products-open') ?? false;
    button.setAttribute('aria-expanded', String(isOpen));
    button.firstChild.textContent = isOpen ? 'Скрыть продукты ' : 'Посмотреть продукты ';
    motionPaused = isOpen || Boolean(slide?.querySelector('video') && !slide.querySelector('video').paused);
    if (motionPaused) {
      window.clearTimeout(motionTimer);
      motionProgress?.classList.remove('is-running');
    } else {
      scheduleMotion();
    }
  });
});
document.querySelectorAll('.look-shades [data-look-product-index]').forEach((button) => {
  button.addEventListener('click', () => {
    const slide = button.closest('.look-slide');
    const products = [...slide.querySelectorAll('.float-product')];
    const selectedIndex = Number(button.dataset.lookProductIndex);
    slide.classList.add('products-open');
    slide.querySelector('.look-products-toggle')?.setAttribute('aria-expanded', 'true');
    slide.querySelectorAll('[data-look-product-index]').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    products.forEach((product, index) => product.classList.toggle('is-shade-selected', index === selectedIndex));
    products[selectedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  });
});
document.querySelectorAll('[data-motion-play]').forEach((button) => {
  const video = button.closest('.look-video')?.querySelector('video');
  const startAt = Number(video?.dataset.start ?? 0);
  video?.addEventListener('loadedmetadata', () => {
    if (startAt > 0 && startAt < video.duration) video.currentTime = startAt;
  }, { once: true });
  button.addEventListener('click', () => {
    if (!video) return;
    if (video.paused) {
      motionPaused = true;
      window.clearTimeout(motionTimer);
      motionProgress?.classList.remove('is-running');
      video.play();
      button.closest('.look-video')?.classList.add('is-playing');
      button.textContent = 'Ⅱ';
      button.setAttribute('aria-label', 'Поставить видео на паузу');
    } else {
      video.pause();
      button.closest('.look-video')?.classList.remove('is-playing');
      motionPaused = false;
      scheduleMotion();
      button.textContent = '▶';
      button.setAttribute('aria-label', 'Воспроизвести видео');
    }
  });
  video?.addEventListener('ended', () => {
    button.closest('.look-video')?.classList.remove('is-playing');
    motionPaused = false;
    button.textContent = '▶';
    button.setAttribute('aria-label', 'Воспроизвести видео');
    scheduleMotion();
  });
});

const polaroidStage = document.querySelector('.achievement-media');
if (polaroidStage && 'IntersectionObserver' in window) {
  polaroidStage.classList.add('has-polaroid-motion');
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      polaroidStage.classList.add('is-visible');
      observer.disconnect();
    }
  }, { threshold: 0.18 });
  observer.observe(polaroidStage);
}

if (polaroidStage) {
  const updateAwardCardScale = () => {
    const stageCenter = polaroidStage.getBoundingClientRect().left + polaroidStage.clientWidth / 2;
    polaroidStage.querySelectorAll('.polaroid').forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - stageCenter);
      const scale = Math.max(0.9, 1 - distance / Math.max(polaroidStage.clientWidth, 1) * 0.16);
      card.style.setProperty('--card-scale', scale.toFixed(3));
    });
  };
  polaroidStage.addEventListener('scroll', updateAwardCardScale, { passive: true });
  window.addEventListener('resize', updateAwardCardScale, { passive: true });
  requestAnimationFrame(updateAwardCardScale);
}
