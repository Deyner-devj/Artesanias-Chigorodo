// ==========================================================================
// PRODUCTOS FILTROS: Filtros por categoría y rango de precio
// ==========================================================================
function filterProducts(category = "ALL", maxPrice = Infinity) {
  const allProducts = typeof getProducts === "function" ? getProducts() : [];
  const filtered = allProducts.filter(p => {
    const matchCategory = category === "ALL" || p.category.toUpperCase() === category.toUpperCase();
    const matchPrice = p.price <= maxPrice;
    return matchCategory && matchPrice;
  });

  if (typeof renderProductCatalog === "function") {
    renderProductCatalog(filtered);
  }
}

if (typeof window !== "undefined") {
  window.filterProducts = filterProducts;
}
