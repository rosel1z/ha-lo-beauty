export const catalogCategories = Object.freeze(['care', 'makeup', 'kids', 'brushes', 'sets']);

const asset = (name) => `assets/catalog/${name}`;
const variant = (label, image, tone) => ({ label, image: asset(image), tone });

const baseCatalogProducts = [
  { id: 'acne-stop-serum', name: 'ACNE STOP SERUM', subtitle: 'Сыворотка для проблемной кожи', category: 'care', image: asset('ACNE STOP SERUM.png') },
  { id: 'glow-skin-elixir', name: 'ALL IN ONE GLOW SKIN ELIXIR', subtitle: 'Эликсир для сияния кожи', category: 'care', image: asset('ALL IN ONE GLOW SKIN ELIXIR.png') },
  { id: 'bubble-cleanser', name: 'BUBBLE CLEANSER', subtitle: 'Пенящееся средство для очищения', category: 'care', image: asset('BUBBLE CLEANSER.png') },
  { id: 'coconut-cleansing-cream', name: 'COCONUT CLEANSING CREAM', subtitle: 'Крем для деликатного очищения', category: 'care', image: asset('COCONUT CLEANSING CREAM.png') },
  { id: 'deo-spray', name: 'DEO SPRAY UNISEX', subtitle: 'Парфюмированный дезодорант-спрей', category: 'care', image: asset('DEO SPRAY UNISEX COCONUT.png'), variants: [variant('Coconut', 'DEO SPRAY UNISEX COCONUT.png', '#e6ddd1'), variant('Sandalwood', 'DEO SPRAY UNISEX SANDALWOOD.png', '#8b6856')] },
  { id: 'intimate-foam', name: 'INTIMATE FOAM', subtitle: 'Пена для деликатного ухода', category: 'care', image: asset('INTIMATE FOAM.png') },
  { id: 'mother-of-creams', name: 'MOTHER OF CREAMS', subtitle: 'Крем для ежедневного ухода', category: 'care', image: asset('MOTHER OF CREAMS.png') },
  { id: 'body-souffle', name: 'NATURAL BODY SOUFFLE', subtitle: 'Натуральное суфле для тела', category: 'care', image: asset('NATURAL BODY SOUFFLE «ПОТЕРЯЛА ГОЛОВУ».png'), variants: [variant('Потеряла голову', 'NATURAL BODY SOUFFLE «ПОТЕРЯЛА ГОЛОВУ».png', '#dfb9aa'), variant('Французский поцелуй', 'NATURAL BODY SOUFFLE «ФРАНЦУЗСКИЙ ПОЦЕЛУЙ».png', '#b47c7c')] },
  { id: 'sun-tan-oil', name: 'NATURAL SUN TAN OIL', subtitle: 'Натуральное масло для загара', category: 'care', image: asset('NATURAL SUN TAN OIL.png') },
  { id: 'peel-off-mask', name: 'PEEL OFF MASK 3 IN 1', subtitle: 'Маска-плёнка 3 в 1', category: 'care', image: asset('PEEL OFF MASK 3 IN 1.png') },
  { id: 'brightening-serum', name: 'SKIN BRIGHTENING SERUM', subtitle: 'Сыворотка для сияния кожи', category: 'care', image: asset('SKIN BRIGHTENING SERUM.png') },
  { id: 'ultra-moisturizing-serum', name: 'ULTRA MOISTURIZING SERUM', subtitle: 'Интенсивно увлажняющая сыворотка', category: 'care', image: asset('ULTRA MOISTURIZING SERUM.png') },
  { id: 'bio-spf-stick', name: 'WOW BIO SPF STICK', subtitle: 'Солнцезащитный стик', category: 'care', image: asset('WOW BIO SPF STICK.png') },
  { id: 'collagen-cream', name: 'WOW COLLAGEN CREAM', subtitle: 'Коллагеновый крем для лица', category: 'care', image: asset('WOW COLLAGEN CREAM.png') },
  { id: 'eye-cream', name: 'WOW EYE CREAM', subtitle: 'Крем для кожи вокруг глаз', category: 'care', image: asset('WOW EYE CREAM.png') },
  { id: 'hand-cream', name: 'WOW HAND CREAM', subtitle: 'Крем для рук', category: 'care', image: asset('WOW HAND CREAM.png') },
  { id: 'peptide-eye-patches', name: 'WOW LIFT PEPTIDE EYE PATCHES', subtitle: 'Гидрогелевые лифтинг-патчи', category: 'care', image: asset('WOW LIFT PEPTIDE EYE PATCHES.png') },
  { id: 'micellar-water', name: 'WOW MICELLAR WATER', subtitle: 'Мицеллярная вода', category: 'care', image: asset('WOW MICELLAR WATER.png') },
  { id: 'moisturizing-cream', name: 'WOW MOISTURIZING CREAM', subtitle: 'Увлажняющий крем для лица', category: 'care', image: asset('WOW MOISTURIZING CREAM.png') },
  { id: 'tone-up-cream', name: 'WOW TONE UP CREAM', subtitle: 'Крем для выравнивания тона', category: 'care', image: asset('WOW TONE UP CREAM.png') },
  { id: 'wow-oil', name: 'WOW OIL', subtitle: 'Ухаживающее масло', category: 'care', image: asset('МАСЛО WOW OIL.png'), variants: [variant('01', 'МАСЛО WOW OIL.png', '#d9b88c'), variant('02', 'МАСЛО WOW OIL-1.png', '#c99a70'), variant('03', 'МАСЛО WOW OIL-2.png', '#986f55')] },

  { id: 'all-day-lip-pencil', name: 'ALL DAY LIP PENCIL', subtitle: 'Суперстойкий карандаш для губ', category: 'makeup', image: asset('ALL DAY LIP PENCIL, SHADE_ ICE LATTE.png'), variants: [variant('Ice Latte', 'ALL DAY LIP PENCIL, SHADE_ ICE LATTE.png', '#a97562'), variant('Kola', 'ALL DAY LIP PENCIL, SHADE_ KOLA.png', '#5a292b'), variant('Old Money', 'ALL DAY LIP PENCIL, SHADE_ OLD MONEY.png', '#8d5e54'), variant('Salt Caramel', 'ALL DAY LIP PENCIL, SHADE_ SALT СARAME.png', '#c18469')] },
  { id: 'baked-glow-blush', name: 'BAKED GLOW BLUSH', subtitle: 'Запечённые сияющие румяна', category: 'makeup', image: asset('BAKED GLOW BLUSH (FIRE).png'), variants: [variant('Fire', 'BAKED GLOW BLUSH (FIRE).png', '#b9524e'), variant('Heart', 'BAKED GLOW BLUSH (HEART).png', '#c87787'), variant('Sunrise', 'BAKED GLOW BLUSH (SUNRISE).png', '#df9b75')] },
  { id: 'baked-glow-highlighter', name: 'BAKED GLOW HIGHLIGHTER', subtitle: 'Запечённый хайлайтер', category: 'makeup', image: asset('BAKED GLOW HIGHLIGHTER (GOLD).png'), variants: [variant('Gold', 'BAKED GLOW HIGHLIGHTER (GOLD).png', '#d8b86f'), variant('Pearl', 'BAKED GLOW HIGHLIGHTER (PEARL).png', '#e5d8d2'), variant('Sunset', 'BAKED GLOW HIGHLIGHTER (SUNSET).png', '#cf8d78')] },
  { id: 'ocean-breeze-palette', name: 'EYESHADOW PALETTE OCEAN BREEZE', subtitle: 'Палетка теней для век', category: 'makeup', image: asset('EYESHADOW PALETTE Ocean breeze.png') },
  { id: 'lami-brow-gel', name: 'LAMI BROW GEL', subtitle: 'Гель для укладки бровей', category: 'makeup', image: asset('LAMI BROW GEL.png') },
  { id: 'skin-photoshop-concealer', name: 'SKIN PHOTOSHOP CONCEALER', subtitle: 'Консилер с ниацинамидом', category: 'makeup', image: asset('SKIN PHOTOSHOP CONCEALER WITH NIACINAMIDE, SHADE_ C1.png'), variants: [variant('C1', 'SKIN PHOTOSHOP CONCEALER WITH NIACINAMIDE, SHADE_ C1.png', '#e8c7ad'), variant('C2', 'SKIN PHOTOSHOP CONCEALER WITH NIACINAMIDE, SHADE_ C2.png', '#ddb89d'), variant('C3', 'SKIN PHOTOSHOP CONCEALER WITH NIACINAMIDE, SHADE_ C3.png', '#cc9f82'), variant('C4', 'SKIN PHOTOSHOP CONCEALER WITH NIACINAMIDE, SHADE_ C4.png', '#ad7b60')] },
  { id: 'waterproof-eyeliner', name: 'WATERPROOF ALL DAY EYELINER', subtitle: 'Водостойкий гелевый карандаш для глаз', category: 'makeup', image: asset('БЕЖЕВЫЙ ГЕЛЕВЫЙ КАРАНДАШ ДЛЯ ГЛАЗ WATERPROOF ALL DAY EYELINER.png'), variants: [variant('Бежевый', 'БЕЖЕВЫЙ ГЕЛЕВЫЙ КАРАНДАШ ДЛЯ ГЛАЗ WATERPROOF ALL DAY EYELINER.png', '#d8bb9c'), variant('Коричневый', 'КОРИЧНЕВЫЙ WATERPROOF ALL DAY EYELINER.png', '#624438'), variant('Голубой', 'WATERPROOF ALL DAY EYELINER ГОЛУБОЙ.png', '#6ea0b5')] },
  { id: 'bb-balm', name: 'WOW BB BALM', subtitle: 'ББ-крем для лица', category: 'makeup', image: asset('bb обычный большой.png'), variants: [variant('Original', 'bb обычный большой.png', '#d8b49a'), variant('Light', 'bb light.png', '#ead0bc')] },
  { id: 'baby-doll', name: 'BABY DOLL', subtitle: 'Сияющий продукт для губ', category: 'makeup', image: asset('baby doll.png') },
  { id: 'lip-ice-baby', name: 'LIP ICE BABY', subtitle: 'Мерцающий продукт для губ', category: 'makeup', image: asset('lip ice baby.png') },
  { id: 'blur-skin-corrector', name: 'BLUR SKIN CORRECTOR 2-IN-1', subtitle: 'Корректор против блеска и расширенных пор', category: 'makeup', image: asset('КОРРЕКТОР ПРОТИВ ЖИРНОГО БЛЕСКА И РАСШИРЕННЫХ ПОР BLUR SKIN CORRECTOR 2-IN-1.png') },
  { id: 'sculptor-glow-palette', name: 'ПАЛЕТКА 2 В 1: СКУЛЬПТОР И СИЯНИЕ', subtitle: 'Идеальный дуэт для макияжа', category: 'makeup', image: asset('ПАЛЕТКА 2 В 1 СКУЛЬПТОР И СИЯНИЕ Идеальный дуэт для идеального макияжа.png') },
  { id: 'juicy-lip-oil', name: 'JUICY LIP OIL', subtitle: 'Фруктовое масло для губ в чехле', category: 'makeup', image: asset('ФРУКТОВОЕ МАСЛО ДЛЯ ГУБ В ЧЕХЛЕ С ПОДВЕСОМ JUICY LIP OIL.png') },
  { id: 'wow-eye-sparkle', name: 'WOW EYE SPARKLE', subtitle: 'Спаркл для век', category: 'makeup', image: asset('спаркл голд.png'), variants: [variant('Gold', 'спаркл голд.png', '#d8ad5d'), variant('Quartz', 'спаркл квартц.png', '#b6839d'), variant('Metallic', 'спаркл металлик.png', '#9f7c70'), variant('Graphit', 'спаркл графит.png', '#70666b'), variant('Diamond', 'спаркл даймонд.png', '#ddd9d4')] },
  { id: 'double-blush', name: 'WOW DOUBLE BLUSH 2 IN 1', subtitle: 'Двойные румяна', category: 'makeup', image: asset('WOW DOUBLE BLUSH 2 IN 1, SHADE_ BARBIE.png'), variants: [variant('Barbie', 'WOW DOUBLE BLUSH 2 IN 1, SHADE_ BARBIE.png', '#d9859b'), variant('Bentley', 'WOW DOUBLE BLUSH 2 IN 1, SHADE_ BENTLEY.png', '#9f6d67'), variant('Candy', 'WOW DOUBLE BLUSH 2 IN 1, SHADE_ CANDY.png', '#e797a1')] },
  { id: 'double-highlighter', name: 'WOW DOUBLE HIGHLIGHTER 2 IN 1', subtitle: 'Двойной хайлайтер Silver', category: 'makeup', image: asset('WOW DOUBLE HIGHLIGHTER 2 IN 1, SHADE_ SILVER.png') },

  { id: 'kids-care-gift-set', name: 'УХОДОВАЯ ЛИНЕЙКА ДЛЯ ДЕТЕЙ', subtitle: 'Подарочный набор с натуральными экстрактами · 0+', category: 'kids', image: asset('Набор в подарочном коробе «УХОДОВАЯ ЛИНЕЙКА ДЛЯ ДЕТЕЙ С НАТУРАЛЬНЫМИ ЭКСТРАКТАМИ».png') },

  { id: 'makeup-brush-360', name: 'MAKE UP BRUSH 360', subtitle: 'Кисть для макияжа', category: 'brushes', image: asset('MAKE UP BRUSH 360.png') },
  { id: 'makeup-puff-set', name: 'MAKE-UP PUFF SET', subtitle: 'Набор спонжей для макияжа', category: 'brushes', image: asset('MAKE-UP PUFF SET.png') },
  { id: 'makeup-brush-365', name: 'MAKEUP BRUSH № 365', subtitle: 'Кисть для макияжа', category: 'brushes', image: asset('MAKEUP BRUSH № 365.png') },
  { id: 'brush-013', name: 'КИСТЬ № 013', subtitle: 'Кисть для макияжа', category: 'brushes', image: asset('КИСТЬ 013.png') },
  { id: 'brush-911', name: 'КИСТЬ № 911', subtitle: 'Кисть для макияжа', category: 'brushes', image: asset('КИСТЬ 911.png') },

  { id: 'beauty-set-blush-contour', name: 'WOW BEAUTY SET', subtitle: 'Набор румян и контуринга', category: 'sets', image: asset('WOW BEAUTY SET BLUSH AND CONTOUR.png') },
];

// Price and article data is mirrored from the official Ha Lo Beauty catalog.
// Sale prices are displayed as the current price; oldPrice keeps the crossed-out price.
const officialDetails = Object.freeze({
  'acne-stop-serum': { price: '1 450 ₽', sku: 'UH3321-093' },
  'glow-skin-elixir': { price: '1 950 ₽', sku: 'UH3321-251' },
  'bubble-cleanser': { price: '1 550 ₽' },
  'coconut-cleansing-cream': { price: '1 870 ₽' },
  'deo-spray': { price: '850 ₽' },
  'intimate-foam': { price: '1 250 ₽' },
  'mother-of-creams': { price: '900 ₽', oldPrice: '1 700 ₽' },
  'body-souffle': { price: '1 100 ₽' },
  'sun-tan-oil': { price: '1 100 ₽', oldPrice: '1 450 ₽' },
  'peel-off-mask': { price: '1 450 ₽' },
  'brightening-serum': { price: '1 450 ₽' },
  'ultra-moisturizing-serum': { price: '1 450 ₽' },
  'bio-spf-stick': { price: '990 ₽' },
  'collagen-cream': { price: '1 770 ₽', sku: 'UH3321-096' },
  'eye-cream': { price: '1 100 ₽' },
  'hand-cream': { price: '450 ₽', oldPrice: '800 ₽' },
  'peptide-eye-patches': { price: '1 600 ₽' },
  'micellar-water': { price: '900 ₽' },
  'moisturizing-cream': { price: '1 770 ₽' },
  'tone-up-cream': { price: '1 770 ₽' },
  'wow-oil': { price: '1 100 ₽', oldPrice: '1 450 ₽' },
  'all-day-lip-pencil': { price: '650 ₽', sku: 'UH3321-245' },
  'baked-glow-blush': { price: '750 ₽' },
  'baked-glow-highlighter': { price: '750 ₽', sku: 'UH3321-278' },
  'ocean-breeze-palette': { price: '1 350 ₽' },
  'lami-brow-gel': { price: '800 ₽', sku: 'UH3321-174' },
  'skin-photoshop-concealer': { price: '800 ₽', oldPrice: '900 ₽', sku: 'UH3321-162' },
  'waterproof-eyeliner': { price: '650 ₽' },
  'bb-balm': { price: '2 300 ₽', sku: 'UH3321-061' },
  'baby-doll': { price: '800 ₽' },
  'lip-ice-baby': { price: '800 ₽' },
  'blur-skin-corrector': { price: '1 200 ₽' },
  'sculptor-glow-palette': { price: '1 450 ₽' },
  'juicy-lip-oil': { price: '1 500 ₽' },
  'wow-eye-sparkle': { price: '900 ₽' },
  'double-blush': { price: '950 ₽', oldPrice: '1 350 ₽' },
  'double-highlighter': { price: '950 ₽', oldPrice: '1 350 ₽' },
  'kids-care-gift-set': { price: '1 500 ₽' },
  'makeup-brush-360': { price: '950 ₽' },
  'makeup-puff-set': { price: '650 ₽' },
  'makeup-brush-365': { price: '650 ₽' },
  'brush-013': { price: '950 ₽' },
  'brush-911': { price: '950 ₽' },
  'beauty-set-blush-contour': { price: '850 ₽', oldPrice: '1 500 ₽' },
});

export const catalogProducts = Object.freeze(baseCatalogProducts.map((product) => Object.freeze({
  ...product,
  ...officialDetails[product.id],
})));

export const getProductsByCategory = (category) => catalogProducts.filter((product) => product.category === category);

