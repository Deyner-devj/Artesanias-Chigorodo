// ==========================================
// FAVORITOS - Gestion de productos favoritos
// Almacena en localStorage bajo clave "favorites"
// ==========================================

const FAVORITES_KEY = "favorites";

/**
 * Obtiene la lista de productos favoritos almacenados
 * @returns {Array} Lista de objetos { id, name, image, price, addedAt }
 */
function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Agrega un producto a favoritos
 * @param {Object} product - Producto con al menos { id, name, image, price }
 * @returns {boolean} true si se agrego, false si ya existia
 */
function addFavorite(product) {
  const favorites = getFavorites();
  const exists = favorites.some((fav) => String(fav.id) === String(product.id));
  if (exists) return false;

  favorites.push({
    id: String(product.id),
    name: product.name || "Producto",
    image: product.image || "",
    price: product.price || 0,
    addedAt: new Date().toISOString(),
  });

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent("favoritesChanged"));
  return true;
}

/**
 * Elimina un producto de favoritos
 * @param {string|number} productId
 * @returns {boolean} true si se elimino
 */
function removeFavorite(productId) {
  let favorites = getFavorites();
  const initialLength = favorites.length;
  favorites = favorites.filter((fav) => String(fav.id) !== String(productId));
  if (favorites.length === initialLength) return false;

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent("favoritesChanged"));
  return true;
}

/**
 * Verifica si un producto esta en favoritos
 * @param {string|number} productId
 * @returns {boolean}
 */
function isFavorite(productId) {
  const favorites = getFavorites();
  return favorites.some((fav) => String(fav.id) === String(productId));
}

/**
 * Obtiene el numero total de favoritos
 * @returns {number}
 */
function getFavoritesCount() {
  return getFavorites().length;
}

/**
 * Alterna (agrega/remueve) un producto de favoritos
 * @param {Object} product
 * @returns {boolean} true si ahora esta en favoritos, false si se removio
 */
function toggleFavorite(product) {
  if (isFavorite(product.id)) {
    removeFavorite(product.id);
    return false; // ya no esta en favoritos
  } else {
    addFavorite(product);
    return true; // ahora esta en favoritos
  }
}

/**
 * Obtiene los IDs de todos los favoritos
 * @returns {string[]}
 */
function getFavoriteIds() {
  return getFavorites().map((fav) => String(fav.id));
}

/**
 * Limpia todos los favoritos
 */
function clearFavorites() {
  localStorage.removeItem(FAVORITES_KEY);
  window.dispatchEvent(new CustomEvent("favoritesChanged"));
}

// Exponer funciones globalmente
window.favoritesAPI = {
  get: getFavorites,
  add: addFavorite,
  remove: removeFavorite,
  is: isFavorite,
  count: getFavoritesCount,
  toggle: toggleFavorite,
  ids: getFavoriteIds,
  clear: clearFavorites,
};
