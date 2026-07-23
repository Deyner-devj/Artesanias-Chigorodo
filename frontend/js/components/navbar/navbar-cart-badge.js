function updateCartBadge() {
  const badge = document.getElementById("cart-counter-badge");
  if (!badge) return;

  let totalItems = 0;
  if (typeof getCartTotalItems === "function") {
    totalItems = getCartTotalItems();
  }

  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "flex" : "none";
}

function initCartTransition() {
  const cartIcon = document.querySelector("[data-cart-icon]");
  if (!cartIcon) return;

  window.addEventListener("itemAddedToCart", function () {
    cartIcon.classList.add("cart-bounce");
    setTimeout(() => cartIcon.classList.remove("cart-bounce"), 600);
  });
}
