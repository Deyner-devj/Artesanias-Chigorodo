// Carrito real: los productos y cantidades pertenecen al usuario autenticado.
// Se conserva una cache en memoria para renderizar la interfaz, nunca en localStorage.
let cartItems = [];

function isAuthenticated() { return Boolean(sessionStorage.getItem('auth_token')); }
function getCartItems() { return [...cartItems]; }
function notifyCartChanged() { window.dispatchEvent(new Event('cartChanged')); }
function mapCartItem(item) {
  return { product: { id: String(item.productId), name: item.productName, price: item.unitPrice, image: item.imageUrl || '../img/mochila_wayuu.png', stock: item.stock || 0 }, quantity: item.quantity };
}

async function syncCartFromAPI() {
  if (!isAuthenticated() || !window.API) { cartItems = []; notifyCartChanged(); return cartItems; }
  const response = await window.API.cart.get();
  cartItems = (response.items || []).map(mapCartItem);
  notifyCartChanged();
  return getCartItems();
}

async function addProductToCart(product, quantity = 1) {
  if (!isAuthenticated()) throw new Error('Debes iniciar sesion para agregar productos al carrito.');
  const response = await window.API.cart.addItem(Number(product.id), quantity);
  cartItems = (response.items || []).map(mapCartItem);
  notifyCartChanged();
  return getCartItems();
}

async function removeProductFromCart(productId) {
  const response = await window.API.cart.removeItem(Number(productId));
  cartItems = (response.items || []).map(mapCartItem);
  notifyCartChanged();
  return getCartItems();
}

async function decreaseProductInCart(productId) {
  const response = await window.API.cart.decreaseItem(Number(productId));
  cartItems = (response.items || []).map(mapCartItem);
  notifyCartChanged();
  return getCartItems();
}

async function clearCart() {
  const response = await window.API.cart.clear();
  cartItems = (response.items || []).map(mapCartItem);
  notifyCartChanged();
}

function getCartQuantity() { return cartItems.reduce((total, item) => total + item.quantity, 0); }
function getCartTotal() { return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0); }
window.getCartTotalItems = getCartQuantity;
window.syncCartFromAPI = syncCartFromAPI;
window.decreaseProductInCart = decreaseProductInCart;

document.addEventListener('DOMContentLoaded', () => {
  syncCartFromAPI().catch((error) => console.error('[carrito]', error.message));
});
