import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getCardTilt } from '../loyalty-cards.js';

test('card tilt stays restrained at edges and neutral in the centre', () => {
  assert.deepEqual(getCardTilt(50, 50, 100, 100), { rotateX: -0, rotateY: 0, lightX: 50, lightY: 50 });
  assert.deepEqual(getCardTilt(-100, 200, 100, 100), { rotateX: -7, rotateY: -9, lightX: 0, lightY: 100 });
  assert.deepEqual(getCardTilt(50, 50, 0, 0), { rotateX: -0, rotateY: 0, lightX: 50, lightY: 50 });
});

test('loyalty cards follow recommendations and preserve existing programme terms', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.indexOf('id="loyalty-club"') > html.indexOf('id="recommendations"'));
  assert.ok(html.indexOf('id="loyalty-club"') < html.indexOf('id="help"'));
  for (const name of ['bronze', 'silver', 'gold']) {
    assert.match(html, new RegExp(`assets/loyalty/${name}\\.png`));
  }
  assert.match(html, /10%/);
  assert.match(html, /50%/);
  assert.equal((html.match(/data-loyalty-card/g) || []).length, 3);
});
