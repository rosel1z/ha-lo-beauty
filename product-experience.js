export function getProductGallery(product, catalogProduct) {
  return [...new Set([product.image, ...(product.gallery || []), catalogProduct?.image].filter(Boolean))];
}

export function getProductCategory(category = 'makeup') {
  const names = { care:'Уход', makeup:'Макияж', brushes:'Кисти', kids:'Детское', sets:'Наборы' };
  const key = names[category] ? category : 'makeup';
  return { name:names[key], href:`catalog.html?category=${key}` };
}

export function initProductGallery(gallery, images, name) {
  if (!gallery || !images.length) return;
  const rail = gallery.querySelector('[data-gallery-rail]');
  const thumbs = gallery.querySelector('[data-gallery-thumbs]');
  rail.replaceChildren();
  thumbs.replaceChildren();
  const activate = (index, scroll = true) => {
    if (scroll) rail.scrollTo({ left:rail.children[index].offsetLeft - rail.children[0].offsetLeft, behavior:'smooth' });
    [...thumbs.children].forEach((button, item) => button.setAttribute('aria-pressed', String(item === index)));
    gallery.querySelector('[data-gallery-position]').textContent = `${index + 1} / ${images.length}`;
  };
  images.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = 'detail-gallery-slide';
    const image = document.createElement('img');
    image.src = src;
    image.alt = `${name} — фото ${index + 1}`;
    if (!index) image.setAttribute('data-product-image', '');
    else image.loading = 'lazy';
    slide.append(image);
    rail.append(slide);
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.setAttribute('aria-label', `Показать фото ${index + 1}`);
    const thumbnail = document.createElement('img');
    thumbnail.src = src; thumbnail.alt = ''; thumbnail.loading = 'lazy';
    thumb.append(thumbnail);
    thumb.addEventListener('click', () => activate(index));
    thumbs.append(thumb);
  });
  let scheduled = false;
  rail.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      const first = rail.children[0].offsetLeft;
      let closest = 0;
      [...rail.children].forEach((slide, index) => {
        if (Math.abs(slide.offsetLeft - first - rail.scrollLeft) < Math.abs(rail.children[closest].offsetLeft - first - rail.scrollLeft)) closest = index;
      });
      activate(closest, false); scheduled = false;
    });
  }, { passive:true });
  rail.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const current = [...thumbs.children].findIndex(button => button.getAttribute('aria-pressed') === 'true');
    activate(Math.max(0, Math.min(images.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1))));
  });
  gallery.classList.toggle('has-multiple', images.length > 1);
  activate(0, false);
}
