// ==========================================================================
// PRODUCTOS BUSQUEDA: Buscador dinámico por palabras clave
// ==========================================================================
function searchProducts(query) {
  if (!query || query.trim() === "") {
    if (typeof renderProductCatalog === "function" && typeof getProducts === "function") {
      renderProductCatalog(getProducts());
    }
    return;
  }

  const q = query.toLowerCase().trim();
  const allProducts = typeof getProducts === "function" ? getProducts() : [];
  const results = allProducts.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q) ||
    p.sellerName.toLowerCase().includes(q)
  );

  if (typeof renderProductCatalog === "function") {
    renderProductCatalog(results);
  }
}

if (typeof window !== "undefined") {
  window.searchProducts = searchProducts;
}
