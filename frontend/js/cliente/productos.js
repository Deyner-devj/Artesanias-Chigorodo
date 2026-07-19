// --- Lógica de Rutas para Imágenes ---
const _path = window.location.pathname;
const _isSubfolder =
  _path.includes("/home/") ||
  _path.includes("/cliente/") ||
  _path.includes("/admin/") ||
  _path.includes("/artesano/");
const _rootPrefix = _isSubfolder ? "../" : "";
const _imgPrefix = `${_rootPrefix}img/`;

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

// Helper functions for products
function getProducts() {
  // If we have custom added products in localStorage, load them too
  const localProducts = localStorage.getItem("custom_products");
  if (localProducts) {
    try {
      return [...MOCK_PRODUCTS, ...JSON.parse(localProducts)];
    } catch (e) {
      console.error("Error parsing custom products", e);
    }
  }
  return MOCK_PRODUCTS;
}

// Obtener un producto por ID
function getProductById(id) {
  const products = getProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
}

// Agregar producto customizado
function addCustomProduct(product) {
  const localProducts = localStorage.getItem("custom_products");
  let customList = [];
  if (localProducts) {
    try {
      customList = JSON.parse(localProducts);
    } catch (e) {
      console.error("Error parsing custom products from localStorage", e);
    }
  }
  customList.push(product);
  localStorage.setItem("custom_products", JSON.stringify(customList));
}

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
