// Catalogo real. No existe catalogo local ni productos de respaldo.
const _path = window.location.pathname;
const _rootPrefix = ["/home/", "/cliente/", "/admin/", "/artesano/"].some((part) => _path.includes(part)) ? "../" : "";
const _imgPrefix = `${_rootPrefix}img/`;
const CATEGORY_LABEL_MAP = { TEXTILES: 'Tejidos', CERAMICS: 'Ceramica', JEWELRY: 'Joyeria', WOODWORK: 'Madera', HOME_DECOR: 'Hogar y Decoracion', ACCESSORIES: 'Accesorios' };
let apiProducts = [];
let loadingProducts = null;

function mapApiProduct(product) {
  return {
    ...product,
    id: String(product.id),
    image: product.imageUrls?.[0] || `${_imgPrefix}mochila_wayuu.png`,
    category: CATEGORY_LABEL_MAP[product.category] || product.category || 'Artesanias',
    sellerName: product.sellerName || 'Artesano',
    rating: product.rating ?? 0,
    reviewsCount: product.reviewsCount ?? 0,
  };
}

async function loadProducts() {
  if (!window.API) throw new Error('El servicio de catalogo no esta disponible.');
  if (!loadingProducts) {
    loadingProducts = window.API.products.getAll()
      .then((products) => { apiProducts = products.map(mapApiProduct); return apiProducts; })
      .finally(() => { loadingProducts = null; });
  }
  return loadingProducts;
}

function initProducts(callback) {
  loadProducts().then(() => callback?.()).catch((error) => {
    console.error('[productos]', error.message);
    callback?.();
  });
}
function getProducts() { return [...apiProducts]; }
function getProductById(id) { return apiProducts.find((product) => String(product.id) === String(id)) || null; }
async function getProductByIdAsync(id) { return mapApiProduct(await window.API.products.getById(id)); }
async function addCustomProduct(product) {
  const created = await window.API.products.create(product);
  apiProducts.unshift(mapApiProduct(created));
  return created;
}

window.initProducts = initProducts;
window.getProductByIdAsync = getProductByIdAsync;
document.addEventListener('DOMContentLoaded', () => { initProducts(); });
