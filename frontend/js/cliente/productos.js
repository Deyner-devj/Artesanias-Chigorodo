const _path = window.location.pathname;
const _isSubfolder =
  _path.includes("/home/") ||
  _path.includes("/cliente/") ||
  _path.includes("/admin/") ||
  _path.includes("/artesano/");
const _rootPrefix = _isSubfolder ? "../" : "";
const _imgPrefix = `${_rootPrefix}img/`;

// Auto-carga de submódulos de la subcarpeta productos/
(function loadProductosSubmodules() {
  const currentScript = document.currentScript ? document.currentScript.src : "";
  if (!currentScript) return;
  const basePath = currentScript.substring(0, currentScript.lastIndexOf("/")) + "/productos/";
  ["productos-listado.js", "productos-filtros.js", "productos-busqueda.js", "productos-paginacion.js"].forEach(file => {
    const s = document.createElement("script");
    s.src = basePath + file;
    document.head.appendChild(s);
  });
})();

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Mochila Wayuu Colores del Sol",
    description:
      "Mochila tejida a mano por artesanos de la comunidad Wayuu en La Guajira. Diseño único con colores vibrantes, ideal para llevar tu historia a cualquier parte.",
    price: 280000,
    image: `${_imgPrefix}producto-mochila-wayuu-1.png`,
    category: "Tejidos",
    sellerName: "Tejidos del Sol",
    stock: 15,
    rating: 4.8,
    reviewsCount: 36,
  },
  {
    id: "2",
    name: "Jarrón de Barro Negro",
    description:
      "Jarrón de cerámica de barro negro elaborado a mano y pulido con piedra por artesanos en La Chamba, Tolima. Una pieza única que aporta elegancia y tradición a tu hogar.",
    price: 120000,
    image: `${_imgPrefix}jarron_barro.png`,
    category: "Cerámica",
    sellerName: "Barro Ancestral",
    stock: 8,
    rating: 4.9,
    reviewsCount: 14,
  },
  {
    id: "3",
    name: "Individual Tejido Multicolor (x2)",
    description:
      "Set de dos individuales redondos tejidos a mano en palma de iraca. Ideales para decorar tu mesa con un estilo fresco, rústico y sumamente tradicional.",
    price: 45000,
    image: `${_imgPrefix}individual_tejido.png`,
    category: "Hogar y Decoración",
    sellerName: "Manos de Colombia",
    stock: 24,
    rating: 4.7,
    reviewsCount: 22,
  },
  {
    id: "4",
    name: "Hamaca San Jacinto",
    description:
      "Hamaca tradicional tejida en telar vertical por artesanas de San Jacinto, Bolívar. Súper resistente, cómoda y con diseños tradicionales de franjas de colores vivos.",
    price: 350000,
    image: `${_imgPrefix}producto-hamaca-sanjacinto.svg`,
    category: "Tejidos",
    sellerName: "Tejedoras de San Jacinto",
    stock: 5,
    rating: 5.0,
    reviewsCount: 8,
  },
  {
    id: "5",
    name: "Sombrero Vueltiao Zenú",
    description:
      "Sombrero vueltiao original de 21 vueltas, elaborado a mano con fibra de caña flecha. Símbolo nacional de la cultura colombiana, trenzado con maestría en Tuchín, Córdoba.",
    price: 180000,
    image: `${_imgPrefix}login-bg-sombrero-vueltiao.png`,
    category: "Accesorios",
    sellerName: "Artesanías Zenú",
    stock: 12,
    rating: 4.9,
    reviewsCount: 45,
  },
  {
    id: "6",
    name: "Aretes de Filigrana Momposina",
    description:
      "Elegantes aretes de filigrana hechos a mano en plata de ley por maestros joyeros en Mompox. Diseños intrincados inspirados en la naturaleza colombiana.",
    price: 150000,
    image: `${_imgPrefix}categoria-joyeria.png`,
    category: "Joyería",
    sellerName: "Orfebrería Momposina",
    stock: 10,
    rating: 4.6,
    reviewsCount: 19,
  },
];

// ─── Mapa de categorías: enum backend → nombre visible ───────────────────────
const CATEGORY_LABEL_MAP = {
  TEXTILES:   'Tejidos',
  CERAMICS:   'Cerámica',
  JEWELRY:    'Joyería',
  WOODWORK:   'Madera',
  HOME_DECOR: 'Hogar y Decoración',
  ACCESSORIES:'Accesorios',
};

// ─── Cache en memoria de los productos del backend ────────────────────────────
let _apiProductsCache = null;      // null = no cargado; [] = vacío; [...] = datos
let _apiProductsLoading = false;
let _apiProductsListeners = [];    // callbacks esperando la carga

/**
 * Convierte la respuesta del backend al formato que usa el frontend.
 */
function _mapApiProduct(p) {
  const imageUrl = Array.isArray(p.imageUrls) && p.imageUrls.length > 0
    ? p.imageUrls[0]
    : `${_imgPrefix}mochila_wayuu.png`;
  const categoryLabel = CATEGORY_LABEL_MAP[p.category] || p.category || 'Artesanías';
  return {
    id: String(p.id),
    name: p.name,
    description: p.description,
    price: p.price,
    image: imageUrl,
    category: categoryLabel,
    sellerName: p.sellerName || 'Artesano Local',
    sellerId: p.sellerId,
    stock: p.stock != null ? p.stock : 10,
    rating: p.rating != null ? p.rating : 5.0,
    reviewsCount: p.reviewsCount != null ? p.reviewsCount : 0,
  };
}

/**
 * Carga los productos desde el backend y llena el cache.
 * Llama a los listeners pendientes cuando termina.
 */
async function _loadProductsFromAPI() {
  if (_apiProductsLoading) return;
  _apiProductsLoading = true;
  try {
    const apiProducts = await window.API.products.getAll();
    _apiProductsCache = apiProducts.map(_mapApiProduct);
  } catch (err) {
    console.warn('[productos] Backend no disponible, usando MOCK_PRODUCTS. Error:', err.message);
    _apiProductsCache = null; // quedará en null → getProducts() devolverá MOCK
  } finally {
    _apiProductsLoading = false;
    _apiProductsListeners.forEach((fn) => fn());
    _apiProductsListeners = [];
  }
}

/**
 * Inicia la carga de productos en background.
 * Llama a `callback` cuando los productos estén disponibles (o ya lo están).
 */
function initProducts(callback) {
  if (_apiProductsCache !== null) {
    if (callback) callback();
    return;
  }
  if (callback) _apiProductsListeners.push(callback);
  if (!window.API) {
    if (callback) callback();
    return;
  }
  _loadProductsFromAPI();
}
window.initProducts = initProducts;

// ─── Helpers públicos ─────────────────────────────────────────────────────────

/**
 * Devuelve el array de productos (sincrónico).
 * Si el cache del backend está listo, lo usa; si no, devuelve MOCK_PRODUCTS.
 */
function getProducts() {
  if (_apiProductsCache !== null && _apiProductsCache.length > 0) {
    return _apiProductsCache;
  }
  // Fallback: MOCK_PRODUCTS + custom locales
  const localProducts = localStorage.getItem('custom_products');
  if (localProducts) {
    try { return [...MOCK_PRODUCTS, ...JSON.parse(localProducts)]; } catch (_) {}
  }
  return MOCK_PRODUCTS;
}

// Obtener un producto por ID
function getProductById(id) {
  const list = getProducts();
  return list.find((p) => String(p.id) === String(id)) || null;
}

// Busca un producto por ID directamente en la API (más preciso)
async function getProductByIdAsync(id) {
  if (window.API) {
    try {
      const p = await window.API.products.getById(id);
      return _mapApiProduct(p);
    } catch (_) {}
  }
  return getProductById(id);
}

// Agregar producto customizado (sigue funcionando en modo offline/artesano)
async function addCustomProduct(product) {
  // Intentar API primero si el usuario está autenticado
  if (window.API) {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      try {
        const created = await window.API.products.create(product);
        // Actualizar cache
        if (_apiProductsCache !== null) {
          _apiProductsCache.unshift(_mapApiProduct(created));
        }
        return created;
      } catch (err) {
        console.warn('[productos] No se pudo crear via API, guardando local.', err.message);
      }
    }
  }
  // Fallback localStorage
  const localProducts = localStorage.getItem('custom_products');
  let customList = [];
  try { customList = JSON.parse(localProducts || '[]'); } catch (_) {}
  customList.push(product);
  localStorage.setItem('custom_products', JSON.stringify(customList));
}

// ─── Auto-carga al inicio ─────────────────────────────────────────────────────
// Se ejecuta cuando api.js está disponible (que carga antes que este script).
document.addEventListener('DOMContentLoaded', () => {
  if (window.API) initProducts();
});

// ──────────────────────────────────────────────────────────────────────────
// SÚPER INTEGRACIÓN GLOBAL: Clics y animaciones en CUALQUIER imagen de producto del sitio
// ──────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Escucha clics de forma global en cualquier elemento de la página
  document.addEventListener("click", (e) => {
    // 1. Detectar si el elemento clickeado es una imagen de producto o su contenedor inmediato
    const targetElement = e.target;

    // Filtro inteligente: ¿Es una imagen de producto o un wrapper que contiene "img"?
    const isProductImage =
      targetElement.tagName === "IMG" &&
      (targetElement.closest('[class*="product"]') ||
        targetElement.closest('[class*="card"]'));

    const isImageWrapper =
      targetElement.closest('[class*="img-wrapper"]') ||
      targetElement.closest('[class*="img-container"]') ||
      targetElement.closest('[class*="image-wrapper"]');

    if (isProductImage || isImageWrapper) {
      // 2. Lógica para DETALLES: Si el usuario hace clic en la imagen dentro de la página de detalles
      // Detectamos si LA IMAGEN CLICKEADA pertenece a una vista de detalle (no basta con que
      // exista una vista de detalle en algún lugar de la página, como con querySelector global,
      // porque eso rompía el comportamiento cuando había productos relacionados u otras tarjetas
      // en la misma página).
      const isDetailView = targetElement.closest(
        ".product-detail-container, #product-detail-view, .detail-image",
      );

      if (
        isDetailView &&
        targetElement.closest(".product-image-main, .detail-image, img")
      ) {
        e.preventDefault();
        const modal = document.createElement("div");
        modal.style.cssText =
          "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center; z-index:99999; cursor:zoom-out;";
        modal.innerHTML = `<img src="${targetElement.src}" style="max-width:90%; max-height:90%; border-radius:10px; box-shadow:0 0 30px rgba(0,0,0,0.5);">`;
        modal.onclick = () => modal.remove();
        document.body.appendChild(modal);
        return;
      }

      // Intentamos obtener la tarjeta contenedora (producto, artesano o categoría)
      const productCard =
        targetElement.closest('[class*="product-card"]') ||
        targetElement.closest(".featured-product-card") ||
        targetElement.closest(".product-card") ||
        targetElement.closest(".artesano-card") ||
        targetElement.closest(".category-card") ||
        targetElement.closest('[class*="-card"]') ||
        targetElement.closest(".card");

      if (productCard) {
        // Imagen de referencia para la animación de transición (la que "vuela"/zoomea
        // hacia la página de detalle). Si no encontramos una imagen específica dentro
        // de la tarjeta, usamos la imagen sobre la que se hizo clic.
        const cardImg = productCard.querySelector("img") || targetElement;

        // Función auxiliar: si existe animateProductDetailTransition (la misma que usan
        // los botones "Ver detalles" de productos), la usamos para que la animación sea
        // idéntica en todas partes. Si no existe, hacemos una navegación normal.
        const goTo = (href) => {
          if (!href) return;
          if (typeof animateProductDetailTransition === "function") {
            animateProductDetailTransition(cardImg, href);
          } else {
            window.location.href = href;
          }
        };

        // Si la propia tarjeta ES el enlace (p. ej. las tarjetas de categoría,
        // que son un <a class="category-card">), disparamos la misma animación
        // de transición hacia esa URL en vez de dejar la navegación nativa sin animar.
        if (productCard.tagName === "A" && productCard.getAttribute("href")) {
          e.preventDefault();
          goTo(productCard.href);
          return;
        }

        e.preventDefault();

        // 2. Buscamos el botón/enlace de "Ver detalles", "Ver perfil", etc. de forma súper flexible
        const viewButton = productCard.querySelector(
          // Botones específicos de catálogo, destacados, artesanos o categorías
          "button.btn-secondary, " +
            ".btn-details, " +
            ".btn-add-catalog, " +
            ".artesano-visit-btn, " +
            "a[class*='visit-btn'], " +
            "button[onclick*='openDetail'], " +
            "button[onclick*='verDetalle'], " +
            "a[onclick*='openDetail'], " +
            "a[onclick*='verDetalle'], " +
            "a[onclick*='animateProductDetailTransition'], " +
            "a[href*='producto.html'], " +
            "a[href*='nuestros-artesanos.html'], " +
            "a[href*='productos.html']:not([class*='cart']), " +
            // Cualquier botón/enlace que contenga "Detalle" o "Ver" en su texto y no sea carrito
            "button:not([class*='cart']):not([class*='add-to-cart']), " +
            "a.btn:not([class*='cart']):not([class*='add-to-cart'])",
        );

        // 3. Si encontramos el botón/enlace...
        if (viewButton) {
          const onclickAttr = viewButton.getAttribute("onclick") || "";
          if (onclickAttr.includes("animateProductDetailTransition")) {
            // Ya dispara la animación por su cuenta (como "Ver detalles" de productos):
            // lo dejamos hacer su propia lógica tal cual estaba.
            viewButton.click();
          } else if (
            viewButton.tagName === "A" &&
            viewButton.getAttribute("href")
          ) {
            // Enlace "plano" sin animación propia (p. ej. "Ver perfil" del artesano):
            // le damos la misma animación de transición que a los productos.
            goTo(viewButton.href);
          } else {
            viewButton.click();
          }
        } else {
          // Fallback ultra-seguro por ID/data-id si no hay botón visible
          const productId =
            productCard.getAttribute("data-id") ||
            productCard.getAttribute("id") ||
            productCard.dataset.id;

          if (productId) {
            if (typeof openProductDetail === "function") {
              openProductDetail(productId);
            } else if (typeof verDetalle === "function") {
              verDetalle(productId);
            } else if (typeof renderProductDetailModal === "function") {
              renderProductDetailModal(productId);
            }
          }
        }
      }
    }
  });

  // Estilos globales inyectados dinámicamente para que TODA imagen de producto
  // tenga cursor interactivo de "mano" y un zoom ultra fluido al pasar el mouse por encima.
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
    /* Aplica a cualquier contenedor de imagen: productos, destacados, artesanos o categorías */
    [class*="product-card"] img,
    .featured-product-card img,
    .product-card img,
    .artesano-card img,
    .category-card img,
    [class*="-card"] img,
    .card img,
    [class*="img-wrapper"],
    [class*="-image-wrapper"],
    [class*="img-container"] {
      cursor: pointer !important;
    }
    
    /* Asegura que la transición de animación sea suave en todas las imágenes */
    [class*="product-card"] img,
    .featured-product-card img,
    .product-card img,
    .artesano-card img,
    .category-card img,
    [class*="-card"] img,
    .card img {
      transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
    }
    
    /* Efecto Zoom en Hover para todo el ecosistema de imágenes: productos, artesanos y categorías */
    [class*="product-card"]:hover img,
    .featured-product-card:hover img,
    .product-card:hover img,
    .artesano-card:hover img,
    .category-card:hover img,
    [class*="-card"]:hover img,
    .card:hover img,
    [class*="img-wrapper"]:hover img,
    [class*="-image-wrapper"]:hover img,
    [class*="img-container"]:hover img {
      transform: scale(1.06) !important;
    }
  `;
  document.head.appendChild(styleElement);
});
