const questions = [
  ['Как подобрать продукт или оттенок?', 'Напишите нам в Telegram. Поможем выбрать уход, оттенок или продукты для желаемого образа.', '<a href="https://t.me/HaLoBeauty_support" target="_blank" rel="noreferrer">Помощь с подбором</a>'],
  ['Где посмотреть сроки и стоимость доставки?', 'Доступные способы, стоимость и сроки зависят от города. Подробности — на странице доставки; уточнить информацию по вашему заказу можно у поддержки.', '<a href="delivery.html">Доставка и оплата</a>'],
  ['Как работает программа лояльности?', 'За покупки возвращается 10% бонусами. Бонусами можно оплатить до 50% заказа. Они не начисляются на доставку и заказы, частично оплаченные бонусами или промокодом.', '<a href="loyalty.html">Условия программы</a>'],
  ['Где посмотреть состав и способ применения?', 'Информацию о продукте ищите в его карточке. Актуальный полный состав и рекомендации производителя указаны на упаковке. Если нужно уточнение, напишите нам.', ''],
  ['Как сохранить понравившийся товар?', 'Нажмите на сердечко в карточке. Товар появится в избранном — к нему удобно вернуться позже с этого же устройства.', '<a href="favorites.html">Моё избранное</a>'],
  ['Остались вопросы?', 'Поможем с выбором, заказом и документами на продукцию. Напишите в поддержку — разберёмся вместе.', '<a href="https://t.me/HaLoBeauty_support" target="_blank" rel="noreferrer">Написать в Telegram</a>'],
];

export function initFaq(root = document) {
  root.querySelectorAll('[data-faq]').forEach((section, index) => {
    section.innerHTML = `<div class="faq-intro"><h2 id="faq-title-${index}">Частые вопросы</h2><p>Всё важное о покупках и Ha Lo Beauty.</p></div><div class="faq-list">${questions.map(([question, answer, link]) => `<details name="halo-faq-${index}"><summary>${question}<span aria-hidden="true"></span></summary><div class="faq-answer"><p>${answer}</p>${link}</div></details>`).join('')}</div>`;
    section.setAttribute('aria-labelledby', `faq-title-${index}`);
    section.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => {
      if (detail.open) section.querySelectorAll('details').forEach(other => { if (other !== detail) other.open = false; });
    }));
  });
}
