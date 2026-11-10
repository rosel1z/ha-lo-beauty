export const BRAND_CHANNEL = 'https://t.me/s/halobeautybyhanna';
const POLL_KEY = 'halo-packaging-poll-v2';
const pollChoices = [['soft-type', 'Мягкий шрифт', 'assets/launch/mousse-soft-type.jpg'], ['bold-type', 'Выразительный шрифт', 'assets/launch/mousse-bold-type.jpg']];
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
const pollMarkup = () => `<aside class="journal-poll journal-packaging-poll" aria-labelledby="journal-poll-title"><p class="journal-tag">Выбираем вместе</p><h3 id="journal-poll-title">Какую упаковку выберешь?</h3><p class="journal-poll-intro">Salted Caramel: два варианта, а какой твой?</p><div class="journal-poll-options">${pollChoices.map(([id,label,image]) => `<button type="button" data-journal-vote="${id}" aria-pressed="false"><img src="${image}" alt="Упаковка мусса для душа Salted Caramel — ${label.toLowerCase()}" loading="lazy" width="955" height="1280"><span>${label}<i aria-hidden="true"></i></span></button>`).join('')}</div><p class="journal-poll-status" data-journal-poll-status aria-live="polite">Выбор сохраняется на устройстве. Расскажи о нём в нашем канале.</p>${channelLink('Обсудить упаковку', 'journal-poll-link')}</aside>`;
const launchPhotos = [['contour-chocolate.jpg','Два оттенка стика-скульптора в шоколадной композиции'],['contour-brush.jpg','Стик-скульптор со встроенной кистью'],['contour-silver.jpg','Серебристая упаковка стиков'],['contour-detail.jpg','Детали корпуса и кисти'],['contour-shades.jpg','Два оттенка стика-скульптора крупным планом'],['contour-duo.jpg','Стики Milk Chocolate и Dark Chocolate']];
export function journalMarkup(full) {
  return `<header class="brand-life-heading"><div><h2>Жизнь бренда</h2></div><p>Первые спойлеры новинок, закулисье и решения, которые принимаем вместе.</p>${full ? '' : '<a class="journal-all" href="news.html">Читать блог <span aria-hidden="true">↗</span></a>'}</header>
    <div class="journal-layout"><a class="journal-feature journal-launch" href="${full ? '#journal-launch' : 'news.html#journal-launch'}"><img src="assets/launch/contour-chocolate.jpg" alt="Будущая новинка — стики-скульпторы Milk Chocolate и Dark Chocolate" loading="lazy" width="1400" height="1875"><div class="journal-feature-copy"><span class="journal-tag">Скоро · первый спойлер</span><h3>Шоколадный спойлер</h3><p>Milk Chocolate &amp; Dark Chocolate. Два оттенка, серебристая упаковка и кисточка с другой стороны.</p><span class="journal-read">Рассмотреть новинку <b aria-hidden="true">↗</b></span></div></a>
    <div class="journal-side"><article class="journal-note journal-round-card"><div class="journal-round-frame"><video class="journal-round-video" src="assets/launch/telegram-3540.mp4" poster="assets/launch/telegram-3540.jpg" playsinline preload="metadata" aria-label="Видеокружок Ha Lo Beauty из Telegram, пост 3540"></video><span aria-hidden="true">0:18</span></div><div><p class="journal-tag">Из нашего Telegram</p><h3>Кружок для своих</h3><button type="button" class="journal-round-toggle" data-journal-round-toggle aria-pressed="false">Смотреть со звуком <span aria-hidden="true">▷</span></button><a class="journal-round-source" href="https://t.me/halobeautybyhanna/3540" target="_blank" rel="noreferrer">Открыть пост ↗</a></div></article>${pollMarkup()}</div></div>
    <div class="journal-channel"><div class="journal-channel-symbol" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M27 6 22 27l-8-6-4 4 1-7L25 8 8 17l-6-2L27 6Z"/></svg></div><div><h3>Ещё ближе — в Telegram</h3><p>Новинки, закулисье и разговоры о красоте в @halobeautybyhanna.</p></div>${channelLink('Перейти в канал', 'journal-channel-button')}</div>
    ${full ? `<article class="journal-launch-story" id="journal-launch"><div class="journal-launch-story-copy"><p class="journal-tag">Будущая новинка</p><h2>Milk Chocolate &amp; Dark Chocolate</h2><p>А вот и наши долгожданные новинки потихоньку подъезжают! Новые стики-скульпторы — в двух вкусных оттенках: Milk Chocolate и Dark Chocolate.</p><p>Пока небольшой спойлер. Совсем скоро покажем их вживую, а сейчас можно рассмотреть детали упаковки.</p><p>И отдельная любовь — встроенная кисточка с другой стороны. Один стик, два шага: нанести и растушевать. Ну разве не прелесть?</p>${channelLink('Следить за запуском в Telegram')}</div><div class="journal-launch-gallery" tabindex="0" aria-label="Фото будущей новинки — листайте горизонтально">${launchPhotos.map(([file,alt])=>`<a href="assets/launch/${file}" target="_blank" rel="noreferrer"><img src="assets/launch/${file}" alt="${alt}" loading="lazy" width="1400" height="1875"></a>`).join('')}</div></article>` : ''}`;
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
    const roundVideo = section.querySelector('.journal-round-video');
    const roundButton = section.querySelector('[data-journal-round-toggle]');
    if (roundVideo && roundButton) {
      const syncRound = () => {
        const playing = !roundVideo.paused && !roundVideo.ended;
        roundButton.setAttribute('aria-pressed', String(playing));
        roundButton.innerHTML = playing ? 'Пауза <span aria-hidden="true">Ⅱ</span>' : 'Смотреть со звуком <span aria-hidden="true">▷</span>';
        roundVideo.closest('.journal-round-card').classList.toggle('is-playing', playing);
      };
      roundButton.addEventListener('click', async () => {
        if (!roundVideo.paused) { roundVideo.pause(); return; }
        try { roundVideo.muted = false; await roundVideo.play(); } catch { roundButton.textContent = 'Не удалось запустить — открой пост ниже'; }
      });
      ['play','pause','ended'].forEach(event=>roundVideo.addEventListener(event,syncRound));
      if ('IntersectionObserver' in window) new IntersectionObserver(entries=>entries.forEach(({isIntersecting})=>{if(!isIntersecting) roundVideo.pause();}),{threshold:.2}).observe(roundVideo);
      document.addEventListener('visibilitychange',()=>{if(document.hidden) roundVideo.pause();});
    }
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
