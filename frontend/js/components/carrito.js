// js/carrito.js

function getCartItems() {
  const itemsStr = localStorage.getItem('cart_items');
  if (itemsStr) {
    try {
      return JSON.parse(itemsStr);
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveCartItems(items) {
  localStorage.setItem('cart_items', JSON.stringify(items));
  window.dispatchEvent(new Event('cartChanged'));
}

function addProductToCart(product, qty = 1) {
  const items = getCartItems();
  const existing = items.find(item => item.product.id === product.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    items.push({ product, quantity: qty });
  }
  saveCartItems(items);
}

function decreaseProductInCart(productId) {
  const items = getCartItems();
  const existing = items.find(item => item.product.id === productId);
  if (existing) {
    if (existing.quantity > 1) {
      existing.quantity -= 1;
      saveCartItems(items);
    } else {
      removeProductFromCart(productId);
    }
  }
}

function removeProductFromCart(productId) {
  const items = getCartItems();
  const filtered = items.filter(item => item.product.id !== productId);
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
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}
