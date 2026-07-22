// ==========================================================================
// PRODUCTOS LISTADO: Fetch y renderizado del catálogo de productos
// ==========================================================================
function renderProductCatalog(products) {
  const container = document.getElementById("products-grid");
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = `<p class="no-products-message">No se encontraron productos disponibles.</p>`;
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image-wrapper">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-card-body">
        <span class="product-category-tag">${p.category}</span>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-artisan">Por: ${p.sellerName}</p>
        <div class="product-price">$${p.price.toLocaleString("es-CO")} COP</div>
        <button class="btn btn-primary btn-add-cart" onclick="addToCart('${p.id}')">Añadir al Carrito</button>
      </div>
    </div>
  `).join("");
}

if (typeof window !== "undefined") {
  window.renderProductCatalog = renderProductCatalog;
}
