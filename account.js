const form = document.querySelector('[data-account-form]');
const greeting = document.querySelector('[data-account-greeting]');
const status = document.querySelector('[data-account-status]');

const load = () => {
  let profile = {};
  try { profile = JSON.parse(localStorage.getItem('halo-profile') || '{}'); } catch { profile = {}; }
  Object.entries(profile).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });
  if (profile.name) greeting.textContent = `Здравствуйте, ${profile.name}`;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const profile = Object.fromEntries(new FormData(form));
  localStorage.setItem('halo-profile', JSON.stringify(profile));
  greeting.textContent = profile.name ? `Здравствуйте, ${profile.name}` : 'Добро пожаловать';
  status.textContent = 'Данные сохранены';
});

load();
