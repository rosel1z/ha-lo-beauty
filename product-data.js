export const products = Object.freeze({
  bb: {
    name: 'WOW BB BALM', eyebrow: 'ББ крем для лица', price: '2 300 ₽', sku: 'UH3321-061', image: 'assets/product-bb.png',
    description: 'Волшебный BB-крем с муцином улитки создаёт бархатное покрытие без эффекта маски, ухаживает за кожей и защищает её от УФ-лучей.',
    specs: ['Корея', '50 г', 'SPF 50', 'Для всех типов кожи'], official: 'https://halo-beauty.ru/bb-balm',
  },
  elixir: {
    name: 'ALL IN ONE GLOW SKIN ELIXIR', eyebrow: 'Эликсир для сияния кожи', price: '1 950 ₽', sku: 'UH3321-251', image: 'assets/product-elixir.png',
    description: 'Многофункциональный эликсир увлажняет, визуально разглаживает кожу и подготавливает её к макияжу, оставляя эффект свежего корейского сияния.',
    specs: ['Корея', '80 мл', '9 форм гиалуроновой кислоты', 'Ниацинамид и пантенол'], official: 'https://halo-beauty.ru/glow-skix-elixir',
  },
  oil: {
    name: 'DIAMOND LIP OIL', eyebrow: 'Мерцающее масло для губ', price: '900 ₽', sku: 'UH3321-252', image: 'assets/product-lip-oil.png',
    description: 'Невесомое масло увлажняет губы, дарит влажный блеск и визуальный 3D-объём. Коктейль масел арганы, ши, кокоса и витамина Е смягчает и питает.',
    specs: ['Китай', '6 мл', 'Масла арганы, ши и кокоса', 'Витамин E'], official: 'https://halo-beauty.ru/diamond-lip-oil-2',
  },
  sparkle: {
    name: 'WOW EYE SPARKLE GOLD', eyebrow: 'Спаркл для век · золото', price: '900 ₽', sku: 'UH3321-272', image: 'assets/product-sparkle-gold.png',
    description: 'Роскошный спаркл с эффектом влажного сияния. Сливочная текстура легко растушёвывается и наслаивается от деликатного свечения до выразительного акцента.',
    specs: ['Китай', '1,2 г', 'Мелкодисперсное сияние', 'Мягкая сливочная текстура'], official: 'https://halo-beauty.ru/wow-eye-sparkle-gold',
  },
  'sparkle-quartz': {
    name: 'WOW EYE SPARKLE QUARTZ', eyebrow: 'Спаркл для век · кварц', price: '900 ₽', sku: 'WB 1497774115', image: 'assets/product-sparkle-quartz.png',
    description: 'Сияющий оттенок Quartz с мягкой сливочной текстурой легко растушёвывается и наслаивается — от тонкого мерцания до яркого вечернего акцента.',
    specs: ['Китай', '1,2 г', 'Эффект влажного сияния', 'Невесомая текстура'], official: '',
  },
  'sparkle-metallic': {
    name: 'WOW EYE SPARKLE METALLIC', eyebrow: 'Спаркл для век · металлик', price: '900 ₽', sku: 'WB 1497774112', image: 'assets/product-sparkle-metallic.png',
    description: 'Насыщенный холодный Metallic отражает свет и придаёт взгляду глубину. Мелкодисперсные частицы создают ровное сияющее покрытие.',
    specs: ['Китай', '1,2 г', 'Насыщенный металлический финиш', 'Легко наслаивается'], official: '',
  },
  'sparkle-graphit': {
    name: 'WOW EYE SPARKLE GRAPHIT', eyebrow: 'Спаркл для век · графит', price: '900 ₽', sku: 'WB 1497774113', image: 'assets/product-sparkle-graphit.png',
    description: 'Глубокий графитовый оттенок для выразительного макияжа глаз. Сливочная формула легко распределяется и сохраняет комфорт.',
    specs: ['Китай', '1,2 г', 'Графитовый сияющий оттенок', 'Мягкая текстура'], official: '',
  },
  'sparkle-diamond': {
    name: 'WOW EYE SPARKLE DIAMOND', eyebrow: 'Спаркл для век · бриллиант', price: '900 ₽', sku: 'WB 1497774111', image: 'assets/product-sparkle-diamond.png',
    description: 'Светлый оттенок Diamond ловит каждый луч и создаёт чистое бриллиантовое сияние без ощущения тяжести на веках.',
    specs: ['Китай', '1,2 г', 'Бриллиантовое сияние', 'Для деликатного или яркого акцента'], official: '',
  },
  highlighter: {
    name: 'BAKED GLOW HIGHLIGHTER GOLD', eyebrow: 'Запечённый хайлайтер · золото', price: '750 ₽', sku: 'UH3321-278', image: 'assets/product-highlighter-gold.png',
    description: 'Нежная запечённая текстура придаёт коже мягкое сияние без выраженных блёсток. Интенсивность легко варьируется от естественного свечения до насыщенного glow-эффекта.',
    specs: ['Китай', '9,5 г', 'Светоотражающие минералы', 'Без эффекта пудровости'], official: 'https://halo-beauty.ru/baked-glow-highlighter-gold',
  },
});

export const getProduct = (id) => products[id] ?? products.bb;
