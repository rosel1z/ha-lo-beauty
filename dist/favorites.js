const grid = document.querySelector('[data-favorites-grid]');
const empty = document.querySelector('[data-favorites-empty]');

let favorites = [];
try { favorites = JSON.parse(localStorage.getItem('halo-favorites') || '[]'); } catch { favorites = []; }

if (!favorites.length) {
  empty.hidden = false;
} else {
  grid.innerHTML = favorites.map((product) => `
    <article class="full-catalog-card" data-catalog-product="${product.id}">
      <a class="full-catalog-media" href="product.html?id=${encodeURIComponent(product.id)}"><img src="${product.image}" alt="${product.name}"></a>
      <div class="full-catalog-copy"><h3><a href="product.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3><div class="full-catalog-meta"><p><strong>${product.price}</strong></p></div></div>
    </article>
  `).join('');
}
