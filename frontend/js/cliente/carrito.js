// js/carrito.js
// Carrito local (localStorage) + sincronización al backend para usuarios autenticados.

function getCartItems() {
  const itemsStr = localStorage.getItem('cart_items');
  try {
    return itemsStr ? JSON.parse(itemsStr) : [];
  } catch (_) {
    return [];
  }
}

function saveCartItems(items) {
  localStorage.setItem('cart_items', JSON.stringify(items));
  window.dispatchEvent(new Event('cartChanged'));
}

// ─── Sync helpers (fire-and-forget) ─────────────────────────────────────────
function _isAuthenticated() {
  return !!(sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token'));
}

async function _syncAddToAPI(productId, quantity) {
  if (!window.API || !_isAuthenticated()) return;
  try {
    await window.API.cart.addItem(Number(productId), quantity);
  } catch (err) {
    console.warn('[carrito] sync addItem falló:', err.message);
  }
}

async function _syncRemoveFromAPI(productId) {
  if (!window.API || !_isAuthenticated()) return;
  try {
    await window.API.cart.removeItem(Number(productId));
  } catch (err) {
    console.warn('[carrito] sync removeItem falló:', err.message);
  }
}

async function _syncClearAPI() {
  if (!window.API || !_isAuthenticated()) return;
  try {
    await window.API.cart.clear();
  } catch (err) {
    console.warn('[carrito] sync clear falló:', err.message);
  }
}

// ─── API pública ─────────────────────────────────────────────────────────────

function addProductToCart(product, qty = 1) {
  const items = getCartItems();
  const existing = items.find((item) => item.product.id === product.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    items.push({ product, quantity: qty });
  }
  saveCartItems(items);
  _syncAddToAPI(product.id, qty);
}

function removeProductFromCart(productId) {
  const items = getCartItems();
  const filtered = items.filter((item) => item.product.id !== productId);
  saveCartItems(filtered);
  _syncRemoveFromAPI(productId);
}

function clearCart() {
  saveCartItems([]);
  _syncClearAPI();
}

function getCartQuantity() {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return getCartItems().reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
}

/**
 * Para usuarios autenticados: carga el carrito del backend y lo sincroniza
 * con el localStorage. Se llama opcionalmente al iniciar sesión.
 */
async function syncCartFromAPI() {
  if (!window.API || !_isAuthenticated()) return;
  try {
    const apiCart = await window.API.cart.get();
    // apiCart = { userEmail, items: [{productId, productName, quantity, unitPrice, subtotal}], ... }
    if (!apiCart || !Array.isArray(apiCart.items) || apiCart.items.length === 0) return;

    // Solo sincronizar si el carrito local está vacío
    const localItems = getCartItems();
    if (localItems.length > 0) return;

    const mapped = apiCart.items.map((item) => ({
      product: {
        id: String(item.productId),
        name: item.productName,
        price: item.unitPrice,
        image: '../img/mochila_wayuu.png', // placeholder
        category: '',
        sellerName: '',
        stock: 99,
        rating: 5.0,
        reviewsCount: 0,
      },
      quantity: item.quantity,
    }));
    saveCartItems(mapped);
  } catch (err) {
    console.warn('[carrito] syncCartFromAPI falló:', err.message);
  }
}
window.syncCartFromAPI = syncCartFromAPI;
