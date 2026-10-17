export const CARE_RAIL_IDS = Object.freeze([
  'moisturizing-cream',
  'ultra-moisturizing-serum',
  'brightening-serum',
  'eye-cream',
  'mother-of-creams',
  'acne-stop-serum',
]);

const CARE_RESULTS = Object.freeze({
  'moisturizing-cream': 1,
  'ultra-moisturizing-serum': 1,
  'brightening-serum': 3,
  'eye-cream': 2,
  'mother-of-creams': 1,
  'acne-stop-serum': 3,
});

export const getCareResult = (productId) => {
  const pair = CARE_RESULTS[productId] ?? 1;
  return {
    before: `assets/temporary/vois-before-${pair}.png`,
    after: `assets/temporary/vois-after-${pair}.png`,
  };
};

// Ingredients verified against the official Ha Lo Beauty product pages.
export const CARE_FORMULAS = Object.freeze({
  'moisturizing-cream': { description: 'Увлажняющий крем для мягкости и ровного тона кожи. Завершает ежедневный уход, помогает сохранить влагу и придаёт деликатное сияние.', ingredients: [['Ниацинамид', 'Ровный тон и сияние'], ['Алоэ вера', 'Увлажнение и мягкость'], ['Зелёный чай', 'Антиоксидантный уход']] },
  'ultra-moisturizing-serum': { description: 'Лёгкая сыворотка для обезвоженной кожи. Помогает убрать ощущение стянутости и подготовить кожу к нанесению крема.', ingredients: [['Гиалуроновая кислота', 'Помогает удерживать влагу'], ['Алоэ вера', 'Смягчает кожу'], ['Пантенол', 'Комфорт и увлажнение']] },
  'brightening-serum': { description: 'Сыворотка для более ровного тона и сияющего вида кожи. Лёгкая текстура подходит для ежедневного ухода и под макияж.', ingredients: [['Ниацинамид', 'Ровный тон'], ['Экстракт шелковицы', 'Уход за тоном кожи'], ['Ройбуш', 'Антиоксидантный уход']] },
  'eye-cream': { description: 'Питательный крем для деликатной кожи вокруг глаз. Помогает поддерживать увлажнённость, мягкость и упругость кожи.', ingredients: [['Коллаген', 'Мягкость и упругость'], ['Гиалуроновая кислота', 'Удержание влаги'], ['Масло ши', 'Питание и комфорт']] },
  'mother-of-creams': { description: 'Насыщенный крем для шеи, декольте и рук. Смягчает сухие участки тела и помогает коже оставаться увлажнённой.', ingredients: [['Масло жожоба', 'Питание и мягкость'], ['Масло макадамии', 'Уход за сухой кожей'], ['Коллаген', 'Увлажнение и упругость']] },
  'acne-stop-serum': { description: 'Сыворотка для проблемной кожи с ниацинамидом и растительными экстрактами. Дополняй дневной уход солнцезащитным средством.', ingredients: [['Ниацинамид', 'Ровный тон кожи'], ['Салициловая кислота', 'Отшелушивание'], ['Чайное дерево', 'Уход за проблемной кожей']] },
});

export const getCareRailProducts = (products) => {
  const byId = new Map(products.map((product) => [product.id, product]));
  return CARE_RAIL_IDS.map((id) => byId.get(id)).filter(Boolean);
};

export const wrapRailOffset = (offset, segmentWidth) => {
  if (!Number.isFinite(segmentWidth) || segmentWidth <= 0) return 0;
  return ((offset % segmentWidth) + segmentWidth) % segmentWidth;
};

export const getNextRailIndex = (current, delta, length) => {
  if (!Number.isInteger(length) || length <= 0) return 0;
  return ((current + delta) % length + length) % length;
};

export const getCareRailDetail = (products, index) => {
  if (!products.length) return null;
  const safeIndex = getNextRailIndex(0, index, products.length);
  const product = products[safeIndex];
  return {
    id: product.id,
    name: product.name,
    subtitle: product.subtitle,
    price: product.price,
    image: product.image,
    href: `product.html?id=${product.id}`,
    position: `${String(safeIndex + 1).padStart(2, '0')} / ${String(products.length).padStart(2, '0')}`,
  };
};

export const initCareRail = (root, products, options = {}) => {
  if (!root || !products.length) return { select: () => {}, destroy: () => {} };

  const windowRef = options.windowRef ?? window;
  const documentRef = options.documentRef ?? document;
  const viewport = root.querySelector('[data-care-rail-viewport]');
  const track = root.querySelector('[data-care-rail-track]');
  const productButtons = [...root.querySelectorAll('[data-care-product]')];
  if (!viewport || !track || !productButtons.length) return { select: () => {}, destroy: () => {} };

  const requestFrame = options.requestFrame ?? windowRef.requestAnimationFrame.bind(windowRef);
  const cancelFrame = options.cancelFrame ?? windowRef.cancelAnimationFrame.bind(windowRef);
  const reducedMotion = windowRef.matchMedia?.('(prefers-reduced-motion: reduce)') ?? { matches: false };
  const detailNodes = {
    name: root.querySelector('[data-care-detail-name]'),
    copy: root.querySelector('[data-care-detail-copy]'),
    price: root.querySelector('[data-care-detail-price]'),
    link: root.querySelector('[data-care-detail-link]'),
    resultBefore: root.querySelector('[data-care-result-before]'),
    resultAfter: root.querySelector('[data-care-result-after]'),
    resultCard: root.querySelector('.care-detail-result'),
    description: root.querySelector('[data-care-description]'),
    ingredients: root.querySelector('[data-care-ingredients]'),
  };
  const listeners = [];
  const on = (target, type, handler, settings) => {
    target?.addEventListener(type, handler, settings);
    listeners.push(() => target?.removeEventListener(type, handler, settings));
  };

  let activeIndex = 0;
  let offset = 0;
  let segmentWidth = 0;
  let frameId = 0;
  let previousTime = 0;
  let pointerId = null;
  let pointerStart = 0;
  let offsetStart = 0;
  let moved = false;
  let hovering = false;
  let focused = false;
  let manuallyPaused = false;

  const measure = () => {
    segmentWidth = track.scrollWidth / 2;
    offset = wrapRailOffset(offset, segmentWidth);
    track.style.setProperty('--care-rail-offset', `${offset}px`);
  };

  const select = (index, align = false) => {
    activeIndex = getNextRailIndex(0, index, products.length);
    const detail = getCareRailDetail(products, activeIndex);
    if (!detail) return;

    productButtons.forEach((button) => {
      const selected = button.dataset.careProduct === detail.id;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    root.querySelectorAll('[data-care-duplicate]').forEach((item) => {
      item.classList.toggle('is-active', item.dataset.careDuplicate === detail.id);
    });
    if (detailNodes.name) detailNodes.name.textContent = detail.name;
    if (detailNodes.copy) detailNodes.copy.textContent = detail.subtitle;
    if (detailNodes.price) detailNodes.price.textContent = detail.price;
    if (detailNodes.link) detailNodes.link.href = detail.href;
    const formula = CARE_FORMULAS[detail.id];
    if (formula && detailNodes.description) detailNodes.description.textContent = formula.description;
    if (formula && detailNodes.ingredients) {
      const drops = ['drop-lavender.jpg', 'drop-rose.jpg', 'drop-glycerin.jpg'];
      detailNodes.ingredients.innerHTML = formula.ingredients.map(([name, benefit], index) => `<div class="care-ingredient"><img src="assets/ingredients/${drops[index]}" alt="" loading="lazy"><strong>${name}</strong><span>${benefit}</span></div>`).join('');
    }
    const result = getCareResult(detail.id);
    if (detailNodes.resultBefore) detailNodes.resultBefore.src = result.before;
    if (detailNodes.resultAfter) detailNodes.resultAfter.src = result.after;
    if (detailNodes.resultCard) {
      detailNodes.resultCard.classList.remove('is-changing');
      void detailNodes.resultCard.offsetWidth;
      detailNodes.resultCard.classList.add('is-changing');
    }

    if (align && segmentWidth > 0) {
      offset = activeIndex * (segmentWidth / products.length);
      track.style.setProperty('--care-rail-offset', `${offset}px`);
    }
  };

  const updateSelectionFromOffset = () => {
    if (segmentWidth <= 0) return;
    const step = segmentWidth / products.length;
    const next = getNextRailIndex(0, Math.round(offset / step), products.length);
    if (next !== activeIndex) select(next);
  };

  const renderOffset = () => {
    offset = wrapRailOffset(offset, segmentWidth);
    track.style.setProperty('--care-rail-offset', `${offset}px`);
    updateSelectionFromOffset();
  };

  const tick = (time) => {
    const elapsed = previousTime ? Math.min(time - previousTime, 48) : 0;
    previousTime = time;
    const paused = manuallyPaused || reducedMotion.matches || documentRef.hidden || pointerId !== null || hovering || focused;
    if (!paused && segmentWidth > 0) {
      offset += elapsed * 0.024;
      renderOffset();
    }
    frameId = requestFrame(tick);
  };

  productButtons.forEach((button, index) => on(button, 'click', () => select(index, true)));
  root.querySelectorAll('[data-care-duplicate]').forEach((item) => {
    on(item, 'click', () => {
      const index = products.findIndex((product) => product.id === item.dataset.careDuplicate);
      if (index >= 0) select(index, true);
    });
  });
  on(root.querySelector('[data-care-prev]'), 'click', () => select(activeIndex - 1, true));
  on(root.querySelector('[data-care-next]'), 'click', () => select(activeIndex + 1, true));
  on(root, 'mouseenter', () => { hovering = true; });
  on(root, 'mouseleave', () => { hovering = false; });
  on(root, 'focusin', () => { focused = true; });
  on(root, 'focusout', (event) => { focused = root.contains(event.relatedTarget); });
  on(viewport, 'pointerdown', (event) => {
    pointerId = event.pointerId;
    pointerStart = event.clientX;
    offsetStart = offset;
    moved = false;
  });
  on(viewport, 'pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    const distance = event.clientX - pointerStart;
    if (!moved && Math.abs(distance) > 8) {
      moved = true;
      manuallyPaused = true;
      viewport.setPointerCapture?.(pointerId);
      root.classList.add('is-dragging');
    }
    if (!moved) return;
    offset = offsetStart - distance;
    renderOffset();
  });
  const finishPointer = (event) => {
    if (event.pointerId !== pointerId) return;
    if (viewport.hasPointerCapture?.(pointerId)) viewport.releasePointerCapture(pointerId);
    pointerId = null;
    root.classList.remove('is-dragging');
    // Keep the exact released position; snapping rounded short swipes back to their start.
  };
  on(viewport, 'pointerup', finishPointer);
  on(viewport, 'pointercancel', finishPointer);
  on(viewport, 'keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    select(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });
  on(viewport, 'click', (event) => {
    if (!moved) return;
    event.preventDefault();
    event.stopPropagation();
    moved = false;
  }, true);
  on(documentRef, 'visibilitychange', () => { previousTime = 0; });

  let resizeObserver;
  if ('ResizeObserver' in windowRef) {
    resizeObserver = new windowRef.ResizeObserver(measure);
    resizeObserver.observe(track);
  } else {
    on(windowRef, 'resize', measure, { passive: true });
  }

  measure();
  select(0);
  frameId = requestFrame(tick);

  return {
    select,
    destroy: () => {
      cancelFrame(frameId);
      resizeObserver?.disconnect();
      listeners.forEach((remove) => remove());
    },
  };
};
