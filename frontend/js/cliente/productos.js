// Catalogo real. No existe catalogo local ni productos de respaldo.
const _path = window.location.pathname;
const _rootPrefix = ["/home/", "/cliente/", "/admin/", "/artesano/"].some((part) => _path.includes(part)) ? "../" : "";
const _imgPrefix = `${_rootPrefix}img/`;
const CATEGORY_LABEL_MAP = { TEXTILES: 'Tejidos', CERAMICS: 'Ceramica', JEWELRY: 'Joyeria', WOODWORK: 'Madera', HOME_DECOR: 'Hogar y Decoracion', ACCESSORIES: 'Accesorios' };
let apiProducts = [];
let loadingProducts = null;
let productsLoadError = null;

function mapApiProduct(product) {
  return {
    ...product,
    id: String(product.id),
    image: product.imageUrls?.[0] || `${_imgPrefix}mochila_wayuu.png`,
    category: CATEGORY_LABEL_MAP[product.category] || product.category || 'Artesanias',
    sellerName: product.sellerName || '',
    rating: product.rating ?? 0,
    reviewsCount: product.reviewsCount ?? 0,
  };
}

async function loadProducts() {
  if (!window.API) {
    productsLoadError = new Error('El servicio de catalogo no esta disponible.');
    throw productsLoadError;
  }
  if (!loadingProducts) {
    loadingProducts = window.API.products.getAll()
      .then((products) => {
        apiProducts = products.map(mapApiProduct);
        productsLoadError = null;
        return apiProducts;
      })
      .catch((error) => {
        productsLoadError = error;
        console.error('[productos] Error cargando productos:', error.message);
        throw error;
      })
      .finally(() => { loadingProducts = null; });
  }
  return loadingProducts;
}

async function initProducts(callback) {
  try {
    await loadProducts();
    callback?.();
  } catch (error) {
    console.error('[productos] Error en initProducts:', error.message);
    callback?.();
    throw error;
  }
}
function getProducts() { return [...apiProducts]; }
function getProductById(id) { return apiProducts.find((product) => String(product.id) === String(id)) || null; }
function getProductsLoadError() { return productsLoadError; }
function isProductsLoaded() { return apiProducts.length > 0; }

async function getProductByIdAsync(id) {
  try {
    const product = await window.API.products.getById(id);
    return mapApiProduct(product);
  } catch (error) {
    console.error('[productos] Error obteniendo producto por ID:', error.message);
    throw error;
  }
}

async function addCustomProduct(product) {
  try {
    const created = await window.API.products.create(product);
    apiProducts.unshift(mapApiProduct(created));
    return created;
  } catch (error) {
    console.error('[productos] Error creando producto:', error.message);
    throw error;
  }
}

// Expose functions to window
window.initProducts = initProducts;
window.getProductByIdAsync = getProductByIdAsync;
window.getProducts = getProducts;
window.getProductById = getProductById;
window.getProductsLoadError = getProductsLoadError;
window.isProductsLoaded = isProductsLoaded;

document.addEventListener('DOMContentLoaded', () => { 
  initProducts(); 
});
