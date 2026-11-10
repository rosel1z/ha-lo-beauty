import test from 'node:test';
import assert from 'node:assert/strict';
import { getProductVideos, savePollChoice, readPollChoice, journalMarkup } from '../brand-life.js';

test('video selection uses sparkle tutorial for sparkle products and does not mutate its source', () => {
  assert.equal(getProductVideos('sparkle-quartz')[0].src, 'assets/sparkle-reel.mp4');
  const clips = getProductVideos('bb');
  clips.pop();
  assert.equal(getProductVideos('bb').length, 3);
  assert.equal(new Set(getProductVideos('unknown').map(item => item.src)).size, 3);
});

test('poll saves only valid choices and gracefully handles blocked storage', () => {
  const values = new Map();
  const storage = { getItem:key => values.get(key), setItem:(key,value) => values.set(key,value) };
  assert.equal(readPollChoice(storage), null);
  assert.equal(savePollChoice('soft-type', storage), true);
  assert.equal(readPollChoice(storage), 'soft-type');
  assert.equal(savePollChoice('invalid', storage), false);
  assert.equal(readPollChoice(storage), 'soft-type');
  assert.equal(savePollChoice('care', storage), false);
  assert.equal(savePollChoice('bold-type', {setItem(){throw new Error('blocked');}}), false);
  assert.equal(readPollChoice({getItem(){throw new Error('blocked');}}), null);
});

test('journal renders the upcoming launch without the removed label or generic stories', () => {
  const preview = journalMarkup(false);
  const article = journalMarkup(true);
  assert.doesNotMatch(preview, /Ha Lo Journal|Не прятать сияние|Что показать в следующем видео/);
  assert.match(preview, /Milk Chocolate/);
  assert.match(preview, /Dark Chocolate/);
  assert.match(preview, /data-journal-round-toggle/);
  assert.match(preview, /Какую упаковку выберешь/);
  assert.doesNotMatch(preview, /Мягкий шрифт|Выразительный шрифт/);
  assert.match(preview, /Вариант 1/);
  assert.match(preview, /Вариант 2/);
  assert.match(preview, /autoplay muted loop playsinline/);
  assert.equal((preview.match(/<img src="assets\/launch\/contour-/g) || []).length, 6);
  assert.match(preview, /data-launch-next/);
  assert.match(preview, /Ханна о блеске/);
  assert.doesNotMatch(preview, /Кружок для своих|Рассмотреть новинку|Шоколадный спойлер/);
  assert.match(preview, /<button[^>]*data-journal-round-toggle[^>]*aria-label="Включить звук"/);
  assert.equal((article.match(/<img src="assets\/launch\/contour-/g) || []).length, 12);
  assert.match(article, /Скоро|скоро/);
});
