// Favoritos persistidos por usuario en el backend. La cache solo vive en memoria.
let favoriteItems = [];

function normalizeProduct(product) {
  return { ...product, image: product.image || product.imageUrls?.[0] || "../img/mochila_wayuu.png" };
}

async function loadFavorites() {
  if (!window.API) throw new Error("El servicio de favoritos no esta disponible.");
  favoriteItems = (await window.API.favorites.getAll()).map(normalizeProduct);
  window.dispatchEvent(new Event("favoritesChanged"));
  return favoriteItems;
}

function getFavorites() { return [...favoriteItems]; }
function isFavorite(productId) { return favoriteItems.some((item) => String(item.id) === String(productId)); }
function getFavoritesCount() { return favoriteItems.length; }

async function addFavorite(product) {
  await window.API.favorites.add(product.id);
  if (!isFavorite(product.id)) favoriteItems.unshift(normalizeProduct(product));
  window.dispatchEvent(new Event("favoritesChanged"));
  return true;
}

async function removeFavorite(productId) {
  await window.API.favorites.remove(productId);
  favoriteItems = favoriteItems.filter((item) => String(item.id) !== String(productId));
  window.dispatchEvent(new Event("favoritesChanged"));
  return true;
}

async function toggleFavorite(product) {
  if (isFavorite(product.id)) { await removeFavorite(product.id); return false; }
  await addFavorite(product); return true;
}

window.favoritesAPI = { get: getFavorites, load: loadFavorites, add: addFavorite, remove: removeFavorite, is: isFavorite, count: getFavoritesCount, toggle: toggleFavorite, ids: () => favoriteItems.map((item) => String(item.id)) };
