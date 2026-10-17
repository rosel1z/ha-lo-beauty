import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function readIndex() {
  try {
    return await readFile(new URL('../index.html', import.meta.url), 'utf8');
  } catch {
    assert.fail('index.html must exist');
  }
}

test('uses the separated Ha Lo Beauty brand name', async () => {
  const html = await readIndex();
  assert.match(html, /Ha Lo Beauty/);
  assert.doesNotMatch(html, />HALO Beauty</);
});

test('contains every approved section and category', async () => {
  const html = await readIndex();
  for (const id of ['top', 'categories', 'motion', 'recommendations', 'help']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  for (const category of ['Уход', 'Макияж', 'Детское', 'Кисти', 'Наборы']) {
    assert.match(html, new RegExp(category));
  }
});

test('keeps the lip feature off the home page and exposes all service pages', async () => {
  const html = await readIndex();
  assert.doesNotMatch(html, /id=["']featured-product["']/);
  assert.doesNotMatch(html, /Ha Lo lips/);

  const pages = [
    ['about.html', 'О бренде'],
    ['delivery.html', 'Доставка и оплата'],
    ['loyalty.html', 'Программа лояльности'],
    ['gift-card.html', 'Подарочная карта'],
    ['sale.html', 'Акции'],
    ['news.html', 'Новости'],
    ['contacts.html', 'Контакты'],
  ];

  for (const [path, title] of pages) {
    assert.match(html, new RegExp(`href=["']${path}["']`));
    const page = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(page, new RegExp(title));
  }
});

test('provides standalone cart and account pages', async () => {
  for (const page of ['cart.html', 'account.html']) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    assert.match(html, /Ha Lo Beauty/);
  }
});

test('keeps the retired influencer block off the home page', async () => {
  const html = await readIndex();
  assert.doesNotMatch(html, /VOICE BEAUTY AWARDS 2025/);
  assert.doesNotMatch(html, /Главный бьюти-инфлюенсер года/);
  assert.match(html, /ALL DAY LIP PENCIL/);
  assert.match(html, /650\s*₽/);
});

test('loads the concept stylesheet and supplied hero banner', async () => {
  const html = await readIndex();
  assert.match(html, /href=["']styles\.css(?:\?v=\d+)?["']/);
  assert.doesNotMatch(html, /poster=["']assets\/banner-main\.png["']/);
  assert.match(html, /Новая коллекция Ha Lo Beauty/);
});

test('uses a silent looping launch film with paired header logos', async () => {
  const html = await readIndex();
  const video = html.match(/<video\b[^>]*data-hero-video[^>]*>/)?.[0] ?? '';
  assert.match(video, /src=["']assets\/hero-launch\.mp4["']/);
  for (const attribute of ['autoplay', 'muted', 'loop', 'playsinline']) {
    assert.match(video, new RegExp(`\\b${attribute}\\b`));
  }
  assert.match(html, /assets\/logo-white\.svg/);
  assert.match(html, /assets\/logo-black\.svg/);
});

test('turns the launch film into a branded catalog entry point', async () => {
  const html = await readIndex();
  assert.match(html, /class=["']hero-copy["']/);
  assert.match(html, /Не прячь/);
  assert.match(html, /своё сияние/);
  assert.match(html, /href=["']catalog\.html["'][^>]*>\s*Смотреть каталог/);
  assert.match(html, /Та самая косметика от певицы ХАННА/);
});

test('places an accessible care rail between bestsellers and reviews', async () => {
  const html = await readIndex();
  const productsIndex = html.indexOf('id="products"');
  const railIndex = html.indexOf('data-care-rail');
  const reviewsIndex = html.indexOf('class="results-reels"');

  assert.ok(productsIndex < railIndex && railIndex < reviewsIndex);
  assert.match(html, /Корейский уход/);
  assert.doesNotMatch(html, /data-care-detail-index/);
  assert.match(html, /корейскими технологами/i);
  assert.match(html, /data-before-after-range/);
  assert.match(html, /data-care-rail-track/);
  assert.match(html, /data-care-detail[^>]*aria-live=["']polite["']/);
  assert.doesNotMatch(html, /data-care-prev|data-care-next/);
  assert.match(html, /href=["']catalog\.html\?category=care["']/);

  for (const file of [
    'moisturizing-cream.png',
    'ultra-moisturizing-serum.png',
    'skin-brightening-serum.png',
    'wow-eye-cream.png',
    'mother-of-creams.png',
    'acne-stop-serum.png',
  ]) {
    assert.match(html, new RegExp(`assets/care-rail/${file.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}`));
  }
});

test('renders five category links and keeps the full catalog on its own page', async () => {
  const html = await readIndex();
  const catalog = await readFile(new URL('../catalog.html', import.meta.url), 'utf8');
  const links = html.match(/class=["'][^"']*category-tile[^"']*["']/g) ?? [];
  assert.equal(links.length, 5);
  assert.match(html, /data-category-filter=["']care["']/);
  assert.match(html, /data-category-filter=["']makeup["']/);
  assert.doesNotMatch(html, /data-catalog-grid/);
  assert.match(catalog, /data-catalog-grid/);
  assert.match(catalog, /src=["']catalog\.js["']/);
  assert.match(html, /<script type=["']module["'] src=["']script\.js(?:\?v=\d+)?["']><\/script>/);
});

test('uses the supplied banner, a slim marquee, text-only categories and products below', async () => {
  const html = await readIndex();
  assert.match(html, /assets\/hero-launch\.mp4/);
  assert.match(html, /class=["']marquee["']/);
  const categoryMarkup = html.match(/<div class="category-grid">([\s\S]*?)<\/div>\s*<\/section>/)?.[1] ?? '';
  assert.doesNotMatch(categoryMarkup, /<img/);
  assert.match(html, /class=["'][^"']*product-grid[^"']*["']/);
  assert.match(html, /WOW BB BALM/);
});

test('renders linked recommendations and verified support contacts', async () => {
  const html = await readIndex();
  const recommendations = html.match(/class=["'][^"']*recommendation-card[^"']*["']/g) ?? [];
  assert.equal(recommendations.length, 4);
  assert.match(html, /product\.html\?id=bb/);
  assert.match(html, /product\.html\?id=elixir/);
  assert.match(html, /tel:\+79251327220/);
  assert.match(html, /mailto:hb@halo-beauty\.ru/);
  assert.match(html, /https:\/\/t\.me\/HaLoBeauty_support/);
});

test('links product cards to a standalone product page', async () => {
  const html = await readIndex();
  const productPage = await readFile(new URL('../product.html', import.meta.url), 'utf8');
  assert.match(html, /product\.html\?id=bb/);
  assert.match(html, /product\.html\?id=elixir/);
  assert.match(productPage, /data-product-title/);
  assert.match(productPage, /product-detail\.js/);
});

test('adds the supplied sparkle reel in a video slider before recommendations', async () => {
  const html = await readIndex();
  assert.match(html, /id=["']motion["']/);
  assert.match(html, /assets\/sparkle-reel\.mp4/);
  assert.ok(html.indexOf('id="motion"') < html.indexOf('id="recommendations"'));
  assert.match(html, /data-editorial-rail/);
  assert.match(html, /class=["'][^"']*look-slide[^"']*["']/);
  assert.match(html, /class=["'][^"']*floating-products[^"']*["']/);
  assert.doesNotMatch(html, /motion-card[^\n]*hanna-lip-pencil/);
  for (const shade of ['Gold', 'Quartz', 'Metallic', 'Graphit', 'Diamond']) {
    assert.match(html, new RegExp(shade, 'i'));
  }
});

test('motion carousel uses clean labels and visible slide selectors', async () => {
  const html = await readIndex();
  assert.doesNotMatch(html, />0[12]\s*·\s*/);
  assert.equal((html.match(/data-motion-dot/g) ?? []).length, 2);
  assert.match(html, /aria-label=["']Выбрать образ 1["']/);
  assert.match(html, /aria-label=["']Выбрать образ 2["']/);
});

test('product cards stay compact without article numbers', async () => {
  const html = await readIndex();
  const catalogScript = await readFile(new URL('../catalog.js', import.meta.url), 'utf8');
  const productSections = html.slice(html.indexOf('id="products"'), html.indexOf('id="achievement"'));
  assert.doesNotMatch(productSections, /Арт\./);
  assert.doesNotMatch(catalogScript, /Арт\./);
  assert.match(catalogScript, /sale-badge/);
});

test('keeps the award story free from the redundant brand link', async () => {
  const html = await readIndex();
  assert.doesNotMatch(html, /class=["']story-link["']/);
});

test('catalog product photos are borderless and responsive', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const mediaRule = css.match(/\.full-catalog-media\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.doesNotMatch(mediaRule, /border\s*:/);
  assert.doesNotMatch(css, /\.full-catalog-media::after/);
  assert.match(css, /@media\s*\(max-width:\s*1180px\)/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
  assert.match(css, /@media\s*\(max-width:\s*420px\)/);
});

test('product page includes marketplace purchase, reviews and store links', async () => {
  const page = await readFile(new URL('../product.html', import.meta.url), 'utf8');
  assert.match(page, /data-marketplace-buy/);
  assert.match(page, /Отзывы/);
  for (const store of ['Wildberries', 'Ozon', 'Яндекс Маркет', 'Золотое Яблоко']) {
    assert.match(page, new RegExp(store));
  }
});

test('every shopping page exposes the complete working menu', async () => {
  const requiredLinks = [
    'catalog.html',
    'about.html',
    'delivery.html',
    'loyalty.html',
    'gift-card.html',
    'sale.html',
    'news.html',
    'contacts.html',
  ];

  for (const path of ['index.html', 'catalog.html', 'product.html']) {
    const page = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(page, /class=["'][^"']*menu-toggle[^"']*["']/);
    assert.match(page, /id=["']site-menu["']/);
    assert.match(page, /src=["']script\.js(?:\?v=\d+)?["']/);
    for (const href of requiredLinks) assert.match(page, new RegExp(`href=["']${href}["']`));
  }
});

