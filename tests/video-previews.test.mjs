import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';

test('review and look videos show an existing poster before playback', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const videos = [...html.matchAll(/<video\b[^>]*>/g)].map(match => match[0]).filter(tag => /assets\/(review-\d|sparkle-reel)/.test(tag));
  assert.equal(videos.length, 8);
  for (const tag of videos) {
    const poster = tag.match(/poster="([^"]+)"/)?.[1];
    assert.ok(poster, `Missing preview: ${tag}`);
    assert.ok(existsSync(new URL(`../${poster}`, import.meta.url)), `Missing preview file: ${poster}`);
  }
});
