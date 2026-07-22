function renderProductosListado(productsList, containerId = "products-grid") {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!productsList || productsList.length === 0) {
    container.innerHTML = `<p class="no-products">No se encontraron productos disponibles.</p>`;
    return;
  }

  container.innerHTML = productsList.map(p => `
    <div class="product-card" data-product-id="${p.id}">
      <div class="product-image-wrapper">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-seller">Por ${p.sellerName}</p>
        <div class="product-price-row">
          <span class="product-price">$${p.price.toLocaleString("es-CO")}</span>
        </div>
      </div>
    </div>
  `).join("");
}
