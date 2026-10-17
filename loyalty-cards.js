export function getCardTilt(x, y, width, height) {
  const horizontal = Math.max(0, Math.min(1, width > 0 ? x / width : .5));
  const vertical = Math.max(0, Math.min(1, height > 0 ? y / height : .5));
  return { rotateX: (vertical - .5) * -14, rotateY: (horizontal - .5) * 18,
    lightX: horizontal * 100, lightY: vertical * 100 };
}

export function initLoyaltyCards(root = document) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
  }, { threshold: .15 });
  root.querySelectorAll('[data-loyalty-card]').forEach(card => {
    observer.observe(card);
    const reset = () => {
      card.classList.remove('is-tilting');
      ['--card-rx', '--card-ry', '--card-light-x', '--card-light-y'].forEach(property => card.style.removeProperty(property));
    };
    card.addEventListener('pointermove', event => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      const bounds = card.getBoundingClientRect();
      const tilt = getCardTilt(event.clientX - bounds.left, event.clientY - bounds.top, bounds.width, bounds.height);
      card.classList.add('is-tilting');
      card.style.setProperty('--card-rx', `${tilt.rotateX}deg`);
      card.style.setProperty('--card-ry', `${tilt.rotateY}deg`);
      card.style.setProperty('--card-light-x', `${tilt.lightX}%`);
      card.style.setProperty('--card-light-y', `${tilt.lightY}%`);
    });
    ['pointerleave', 'pointercancel', 'blur'].forEach(event => card.addEventListener(event, reset));
    card.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse') reset(); });
    reducedMotion.addEventListener('change', reset);
  });
}
