import test from 'node:test';
import assert from 'node:assert/strict';
import { getProductVideos, savePollChoice, readPollChoice } from '../brand-life.js';

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
  assert.equal(savePollChoice('care', storage), true);
  assert.equal(readPollChoice(storage), 'care');
  assert.equal(savePollChoice('invalid', storage), false);
  assert.equal(readPollChoice(storage), 'care');
  assert.equal(savePollChoice('care', {setItem(){throw new Error('blocked');}}), false);
  assert.equal(readPollChoice({getItem(){throw new Error('blocked');}}), null);
});
