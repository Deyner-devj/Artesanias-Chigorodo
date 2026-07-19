// js/carrito.js
function getCartItems() {
  const itemsStr = localStorage.getItem("cart_items");
  try {
    return itemsStr ? JSON.parse(itemsStr) : [];
  } catch (e) {
    return [];
  }
}

function saveCartItems(items) {
  localStorage.setItem("cart_items", JSON.stringify(items));
  // IMPORTANTE: Esto avisa al navbar que debe actualizarse
  window.dispatchEvent(new Event("cartChanged"));
}

// Asegúrate de que al agregar, siempre llames a esto
function addProductToCart(product, qty = 1) {
  const items = getCartItems();
  const existing = items.find((item) => item.product.id === product.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    items.push({ product, quantity: qty });
  }
  saveCartItems(items);
}
function removeProductFromCart(productId) {
  const items = getCartItems();
  const filtered = items.filter((item) => item.product.id !== productId);
  saveCartItems(filtered);
}

function clearCart() {
  saveCartItems([]);
}

function getCartQuantity() {
  const items = getCartItems();
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  const items = getCartItems();
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
}

// La animación de transición al carrito (círculo → centro → giro →
// vista superior → sumergirse) vive únicamente en navbar.js, porque es
// el único script cargado en TODAS las páginas. Aquí ya no se duplica
// para evitar que dos animaciones compitan sobre el mismo elemento.
