export const BRAND_CHANNEL = 'https://t.me/halobeautybyhanna';
const POLL_KEY = 'halo-brand-life-poll-v1';
const pollChoices = [['makeup', 'Макияж за пять минут'], ['care', 'Ритуал ухода'], ['backstage', 'Что происходит за кадром']];
const clips = [
  {src:'assets/sparkle-reel.mp4', poster:'assets/video-posters/clip-1.jpg', title:'Образ Ханны', copy:'Сияние в движении'},
  {src:'assets/review-2.mp4', poster:'assets/video-posters/clip-2.jpg', title:'Beauty-видео', copy:'Вдохновение для своего образа'},
  {src:'assets/review-3.mp4', poster:'assets/video-posters/clip-3.jpg', title:'Ещё один взгляд', copy:'Видео из подборки бренда'},
];
export function getProductVideos(id = '') {
  return (String(id).includes('sparkle') ? clips : [clips[1], clips[0], clips[2]]).map(clip => ({...clip}));
}
export function readPollChoice(storage) {
  try { const choice = storage.getItem(POLL_KEY); return pollChoices.some(([id]) => id === choice) ? choice : null; } catch { return null; }
}
export function savePollChoice(choice, storage) {
  if (!pollChoices.some(([id]) => id === choice)) return false;
  try { storage.setItem(POLL_KEY, choice); return true; } catch { return false; }
}
const channelLink = (label, cls = '') => `<a class="${cls}" href="${BRAND_CHANNEL}" target="_blank" rel="noreferrer">${label}<span aria-hidden="true">↗</span></a>`;
const pollMarkup = () => `<aside class="journal-poll" aria-labelledby="journal-poll-title"><p class="journal-tag">Твой голос</p><h3 id="journal-poll-title">Что показать в следующем видео?</h3><div class="journal-poll-options">${pollChoices.map(([id,label]) => `<button type="button" data-journal-vote="${id}" aria-pressed="false"><span>${label}</span><i aria-hidden="true"></i></button>`).join('')}</div><p class="journal-poll-status" data-journal-poll-status aria-live="polite">Мини-опрос: выбор сохраняется только на этом устройстве.</p>${channelLink('Обсудить в канале', 'journal-poll-link')}</aside>`;
function journalMarkup(full) {
  return `<header class="brand-life-heading"><div><p class="journal-tag">Ha Lo Journal</p><h2>Жизнь бренда</h2></div><p>Образы, маленькие ритуалы и всё, что остаётся за красивым кадром.</p>${full ? '' : '<a class="journal-all" href="news.html">Читать блог <span aria-hidden="true">↗</span></a>'}</header>
    <div class="journal-layout"><a class="journal-feature" href="${full ? '#journal-glow' : 'news.html#journal-glow'}"><img src="assets/award-hanna-01.jpg" alt="Ханна — образы Ha Lo Beauty" loading="lazy" width="960" height="1200"><div class="journal-feature-copy"><span class="journal-tag">Образы</span><h3>Не прятать сияние</h3><p>Смотрим на детали макияжа и находим свой акцент.</p><span class="journal-read">Читать историю <b aria-hidden="true">↗</b></span></div></a>
    <div class="journal-side"><a class="journal-note" href="${full ? '#journal-details' : 'news.html#journal-details'}"><div><p class="journal-tag">В деталях</p><h3>Один акцент. Твоё настроение.</h3><span class="journal-read">Заглянуть ближе <b aria-hidden="true">↗</b></span></div><img src="assets/product-highlighter-gold.png" alt="Хайлайтер Ha Lo Beauty" loading="lazy" width="600" height="600"></a>${pollMarkup()}</div></div>
    <div class="journal-channel"><div class="journal-channel-symbol" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M27 6 22 27l-8-6-4 4 1-7L25 8 8 17l-6-2L27 6Z"/></svg></div><div><h3>Ещё ближе — в Telegram</h3><p>Видео, закулисье и разговоры о красоте в @halobeautybyhanna.</p></div>${channelLink('Перейти в канал', 'journal-channel-button')}</div>
    ${full ? `<div class="journal-stories"><article id="journal-glow"><p class="journal-tag">Образы</p><h2>Не прятать сияние</h2><p>Иногда весь образ держится на одной детали: блике на веке, влажном финише губ или мягком свете на скулах. Необязательно повторять макияж целиком — можно забрать только настроение.</p><p>В разделе «Повтори образ Ханны» собраны видео и продукты из образов. Смотрите, как текстуры выглядят в движении, выбирайте оттенки и пробуйте свою версию.</p><a href="index.html#motion">Посмотреть образы Ханны ↗</a></article><article id="journal-details"><p class="journal-tag">В деталях</p><h2>Один акцент. Твоё настроение.</h2><p>Деликатное свечение на каждый день или заметный блеск для вечера? Начните с одного акцента и посмотрите на него при разном освещении. Сияющие текстуры по-разному раскрываются в мягком дневном свете и под вечерними огнями.</p><p>А если хочется увидеть больше закулисья, свежих образов и видео — заглядывайте в канал бренда. Именно там продолжается разговор.</p>${channelLink('Читать канал бренда')}</article></div>` : ''}`;
}
export function initBrandLife(root = document) {
  root.querySelectorAll('[data-brand-life]').forEach(section => {
    section.innerHTML = journalMarkup(section.hasAttribute('data-journal-full'));
    let storage; try { storage = window.localStorage; } catch { storage = null; }
    const paint = (choice, saved = true) => {
      section.querySelectorAll('[data-journal-vote]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.journalVote === choice)));
      if (choice) section.querySelector('[data-journal-poll-status]').textContent = saved ? 'Выбор сохранён на этом устройстве. Чтобы команда увидела ответ, поделись им в канале.' : 'Выбор отмечен. Поделись им в канале — сохранение на устройстве недоступно.';
    };
    paint(readPollChoice(storage));
    section.querySelectorAll('[data-journal-vote]').forEach(button => button.addEventListener('click', () => paint(button.dataset.journalVote, savePollChoice(button.dataset.journalVote, storage))));
  });
  root.querySelectorAll('[data-product-videos]').forEach(section => {
    const id = new URLSearchParams(window.location.search).get('id') || '';
    section.innerHTML = `<header class="product-videos-heading"><h2>Смотри в движении</h2><p>Временная видеоподборка бренда. Здесь могут быть другие продукты — позже добавим ролики к каждому средству.</p></header><div class="product-videos-rail" aria-label="Видеообразы Ha Lo Beauty">${getProductVideos(id).map((clip,index) => `<article class="product-video-card"><div class="product-video-frame"><video data-tutorial-video src="${clip.src}#t=0.1" poster="${clip.poster}" controls muted playsinline preload="metadata" aria-label="${clip.title}, видео ${index+1}"></video><p class="product-video-error" hidden>Видео не загрузилось. <a href="${clip.src}">Открыть отдельно</a></p></div><h3>${clip.title}</h3><p>${clip.copy}</p></article>`).join('')}</div>${channelLink('Больше видео в Telegram', 'product-videos-channel')}`;
    const videos = [...section.querySelectorAll('video')];
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => { if (!isIntersecting) target.pause(); }), {threshold:.1}) : null;
    videos.forEach(video => {
      video.addEventListener('play', () => videos.forEach(other => { if (video !== other) other.pause(); }));
      video.addEventListener('error', () => { video.parentElement.querySelector('.product-video-error').hidden = false; });
      observer?.observe(video);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) videos.forEach(video => video.pause()); });
  });
}
