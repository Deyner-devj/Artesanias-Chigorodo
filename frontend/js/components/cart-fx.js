// ==========================================================================
// CART-FX: Animación "de deleite" para agregar productos al carrito, y
// transición cinematográfica al hacer clic en el ícono del carrito / en
// cualquier enlace "Ver mi carrito".
//
// No reemplaza el carrito real: sigue usando addProductToCart() de
// js/cliente/carrito.js para guardar los datos. Esto es 100% capa visual.
// ==========================================================================

(function () {
  "use strict";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Encadenamos las animaciones para que dos clics rápidos no se pisen entre sí.
  let cartFXChain = Promise.resolve();
  let cartFXNavigating = false;

  // ─── Construcción del overlay + carrito SVG (una sola vez, se reutiliza) ──
  let _overlayEl = null;

  function ensureOverlay() {
    if (_overlayEl) return _overlayEl;

    const overlay = document.createElement("div");
    overlay.id = "cartfx-overlay";
    overlay.innerHTML = `
      <div class="cartfx-stage">
        <div class="cartfx-cart-wrap">
          <svg class="cartfx-cart-svg" viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg">
            <path class="cfx-frame" d="M70 186 H192" />
            <path class="cfx-frame" d="M70 186 L46 60" />
            <path class="cfx-handle" d="M46 60 H24 a10 10 0 0 0 -10 10 v6" />
            <path class="cfx-handle" d="M46 60 L40 40 H74" />
            <path class="cfx-basket-outline" d="M60 68 H210 L192 168 H78 Z" />
            <line class="cfx-mesh" x1="65" y1="90" x2="203" y2="90" />
            <line class="cfx-mesh" x1="70" y1="112" x2="197" y2="112" />
            <line class="cfx-mesh" x1="75" y1="134" x2="191" y2="134" />
            <line class="cfx-mesh" x1="80" y1="156" x2="185" y2="156" />
            <line class="cfx-mesh" x1="90" y1="68" x2="86" y2="168" />
            <line class="cfx-mesh" x1="115" y1="68" x2="112" y2="168" />
            <line class="cfx-mesh" x1="140" y1="68" x2="139" y2="168" />
            <line class="cfx-mesh" x1="165" y1="68" x2="166" y2="168" />
            <line class="cfx-mesh" x1="190" y1="68" x2="192" y2="168" />
            <circle class="cfx-wheel" cx="86" cy="200" r="14" />
            <circle class="cfx-wheel" cx="176" cy="200" r="14" />
            <circle class="cfx-wheel-hub" cx="86" cy="200" r="4" />
            <circle class="cfx-wheel-hub" cx="176" cy="200" r="4" />
          </svg>
          <div class="cartfx-check">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    _overlayEl = overlay;
    return overlay;
  }

  function getCartIconEl() {
    return document.querySelector("[data-cart-icon]");
  }

  // ──────────────────────────────────────────────────────────────────────
  // 1. ANIMACIÓN "AGREGAR AL CARRITO"
  //    Producto vuela al centro → aparece el carrito y gira hasta encararnos
  //    → el producto cae dentro → check de confirmación → todo vuela hacia
  //    el ícono del carrito en el navbar.
  // ──────────────────────────────────────────────────────────────────────
  async function runAddToCartAnimation(product, sourceImgEl) {
    const overlay = ensureOverlay();
    const stage = overlay.querySelector(".cartfx-stage");
    const cartWrap = overlay.querySelector(".cartfx-cart-wrap");
    const checkFx = overlay.querySelector(".cartfx-check");

    // Reset por si quedó algo de una animación anterior interrumpida
    stage.style.transform = "";
    stage.style.opacity = "";
    cartWrap.style.transform = "";
    cartWrap.style.opacity = "0";
    cartWrap.style.display = "none";
    checkFx.classList.remove("show");
    overlay.classList.remove("cartfx-overlay-solid");

    overlay.classList.add("active");
    document.body.classList.add("cartfx-lock");

    // ── Paso 1: la imagen del producto vuela desde la tarjeta hasta el centro
    const flyer = document.createElement("div");
    flyer.className = "cartfx-flyer";

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetSize = Math.min(170, vw * 0.34);
    const stageRect = stage.getBoundingClientRect();
    const centerLeft = stageRect.left + stageRect.width / 2 - targetSize / 2;
    const centerTop = stageRect.top + stageRect.height * 0.32 - targetSize / 2;

    let originRect;
    if (sourceImgEl) {
      originRect = sourceImgEl.getBoundingClientRect();
      const src = sourceImgEl.currentSrc || sourceImgEl.src;
      flyer.style.backgroundImage = `url("${src}")`;
    } else if (product && product.image) {
      originRect = stageRect;
      flyer.style.backgroundImage = `url("${product.image}")`;
    } else {
      originRect = stageRect;
    }

    flyer.style.top = `${originRect.top}px`;
    flyer.style.left = `${originRect.left}px`;
    flyer.style.width = `${originRect.width}px`;
    flyer.style.height = `${originRect.height}px`;
    flyer.style.opacity = "1";
    document.body.appendChild(flyer);
    // Forzar reflow para que la animación siguiente parta del estado inicial
    flyer.getBoundingClientRect();

    await flyer.animate(
      [
        {
          top: `${originRect.top}px`,
          left: `${originRect.left}px`,
          width: `${originRect.width}px`,
          height: `${originRect.height}px`,
          transform: "rotate(0deg)",
          borderRadius: "14px",
          offset: 0,
        },
        {
          top: `${centerTop - 40}px`,
          left: `${centerLeft}px`,
          width: `${targetSize * 1.05}px`,
          height: `${targetSize * 1.05}px`,
          transform: "rotate(-6deg)",
          borderRadius: "18px",
          offset: 0.7,
        },
        {
          top: `${centerTop}px`,
          left: `${centerLeft}px`,
          width: `${targetSize}px`,
          height: `${targetSize}px`,
          transform: "rotate(0deg)",
          borderRadius: "16px",
          offset: 1,
        },
      ],
      {
        duration: 750,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "forwards",
      },
    ).finished;

    // ── Paso 2: el carrito aparece y gira hasta quedar de frente
    cartWrap.style.display = "block";
    await cartWrap.animate(
      [
        {
          transform: "translateY(50px) scale(0.4) rotateY(-150deg)",
          opacity: 0,
          offset: 0,
        },
        {
          transform: "translateY(0px) scale(1.08) rotateY(24deg)",
          opacity: 1,
          offset: 0.65,
        },
        {
          transform: "translateY(0px) scale(1) rotateY(0deg)",
          opacity: 1,
          offset: 1,
        },
      ],
      {
        duration: 850,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        fill: "forwards",
      },
    ).finished;

    await cartWrap.animate(
      [
        { transform: "scale(1) rotateY(0deg)" },
        { transform: "scale(1.03) rotateY(-4deg)" },
        { transform: "scale(1) rotateY(0deg)" },
      ],
      { duration: 260, easing: "ease-out", fill: "forwards" },
    ).finished;

    // ── Paso 3: el producto cae dentro de la canasta
    await flyer.animate(
      [
        {
          top: `${centerTop}px`,
          transform: "rotate(0deg) scale(1)",
          opacity: 1,
          offset: 0,
        },
        {
          top: `${centerTop + 55}px`,
          transform: "rotate(8deg) scale(0.6)",
          opacity: 0.9,
          offset: 0.6,
        },
        {
          top: `${centerTop + 95}px`,
          transform: "rotate(14deg) scale(0.15)",
          opacity: 0,
          offset: 1,
        },
      ],
      {
        duration: 620,
        easing: "cubic-bezier(0.55, 0.06, 0.68, 0.19)",
        fill: "forwards",
      },
    ).finished;
    flyer.remove();

    // Este es el momento real en que el producto "entra" al carrito:
    // ahora sí lo guardamos en el carrito de datos.
    if (typeof addProductToCart === "function" && product) {
      await addProductToCart(product, 1);
    }
    if (typeof window.dispatchEvent === "function") {
      window.dispatchEvent(new Event("itemAddedToCart"));
    }

    // El carrito "recibe" el producto con un pequeño rebote elástico
    await cartWrap.animate(
      [
        { transform: "scale(1, 1) translateY(0px)" },
        { transform: "scale(1.09, 0.93) translateY(4px)" },
        { transform: "scale(0.97, 1.05) translateY(-2px)" },
        { transform: "scale(1, 1) translateY(0px)" },
      ],
      { duration: 420, easing: "ease-out", fill: "forwards" },
    ).finished;

    // ── Paso 4: check de confirmación
    checkFx.classList.add("show");
    if (
      product &&
      product.name &&
      typeof window.showModernToast === "function"
    ) {
      window.showModernToast(
        `${product.name} se agregó a tu carrito`,
        "success",
      );
    }
    await sleep(500);
    checkFx.classList.remove("show");

    // ── Paso 5: todo vuela hacia el ícono del carrito del navbar
    const cartIconEl = getCartIconEl();
    const finalStageRect = stage.getBoundingClientRect();
    let dx = 0;
    let dy = 0;
    if (cartIconEl) {
      const targetRect = cartIconEl.getBoundingClientRect();
      dx =
        targetRect.left +
        targetRect.width / 2 -
        (finalStageRect.left + finalStageRect.width / 2);
      dy =
        targetRect.top +
        targetRect.height / 2 -
        (finalStageRect.top + finalStageRect.height / 2);
    } else {
      dx = vw / 2 - (finalStageRect.left + finalStageRect.width / 2);
      dy = -finalStageRect.top;
    }

    const overlayFade = overlay.animate(
      [{ opacity: 1 }, { opacity: 1 }, { opacity: 0 }],
      {
        duration: 620,
        delay: 60,
        fill: "forwards",
      },
    );

    await stage.animate(
      [
        { transform: "translate(0px, 0px) scale(1)", opacity: 1, offset: 0 },
        {
          transform: `translate(${dx * 0.55}px, ${dy * 0.55}px) scale(0.55)`,
          opacity: 0.9,
          offset: 0.6,
        },
        {
          transform: `translate(${dx}px, ${dy}px) scale(0.05)`,
          opacity: 0,
          offset: 1,
        },
      ],
      {
        duration: 600,
        easing: "cubic-bezier(0.5, 0, 0.75, 0)",
        fill: "forwards",
      },
    ).finished;

    await overlayFade.finished;

    overlay.classList.remove("active");
    document.body.classList.remove("cartfx-lock");
    stage.style.transform = "";
    stage.style.opacity = "";
    cartWrap.style.display = "none";
    cartWrap.style.opacity = "0";

    // El ícono del carrito "recibe" el producto con un pulso
    if (cartIconEl) {
      cartIconEl.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.35)" },
          { transform: "scale(0.9)" },
          { transform: "scale(1)" },
        ],
        { duration: 500, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
      );
    }
  }

  /**
   * Punto de entrada público. Se puede llamar desde cualquier botón de
   * "Agregar al carrito" del sitio.
   * @param {string|number} productId
   * @param {HTMLElement} [sourceImgEl] imagen del producto desde donde parte la animación
   */
  window.addToCartWithFX = function (productId, sourceImgEl) {
    let product = null;
    if (typeof getProductById === "function") {
      product = getProductById(productId);
    }
    if (!product) {
      console.warn("[cart-fx] Producto no encontrado:", productId);
      return;
    }
    if (product.stock === 0) {
      if (typeof window.showModernToast === "function") {
        window.showModernToast("Este producto está agotado", "error");
      }
      return;
    }
    cartFXChain = cartFXChain
      .then(() => runAddToCartAnimation(product, sourceImgEl || null))
      .catch((err) =>
        console.error("[cart-fx] Error en animación de carrito:", err),
      );
    return cartFXChain;
  };

  // ──────────────────────────────────────────────────────────────────────
  // Delegación de eventos: cualquier elemento [data-add-to-cart="ID"] en
  // cualquier página dispara la animación, sin necesidad de re-enlazar
  // listeners cada vez que se re-renderiza el catálogo.
  // ──────────────────────────────────────────────────────────────────────
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn || btn.disabled) return;
    e.preventDefault();
    e.stopPropagation();

    btn.classList.remove("cartfx-pop");
    // Forzar reflow para poder re-disparar la animación de "pop" en clics seguidos
    void btn.offsetWidth;
    btn.classList.add("cartfx-pop");

    const productId = btn.getAttribute("data-add-to-cart");
    const card = btn.closest(
      '.catalog-product-card, .product-card, .featured-product-card, [class*="product-card"]',
    );
    const img =
      (card ? card.querySelector("img") : null) ||
      document.getElementById("detail-img");

    // Bloqueamos el botón mientras dura SU animación encolada, para que
    // clics repetidos y rápidos no acumulen varias corridas de la FX que
    // se pisan visualmente. Se libera automáticamente cuando termina.
    btn.disabled = true;
    Promise.resolve(window.addToCartWithFX(productId, img)).finally(() => {
      btn.disabled = false;
    });
  });

  // ──────────────────────────────────────────────────────────────────────
  // 2. TRANSICIÓN AL HACER CLIC EN EL ÍCONO DEL CARRITO / "VER MI CARRITO"
  //    El carrito vuela desde el ícono hacia el centro, gira hasta encararnos,
  //    y luego la cámara "entra" en él (zoom + fundido) justo antes de
  //    navegar a carrito.html.
  // ──────────────────────────────────────────────────────────────────────
  async function playCartEntranceTransition(href) {
    if (cartFXNavigating) return;
    cartFXNavigating = true;

    const overlay = ensureOverlay();
    const stage = overlay.querySelector(".cartfx-stage");
    const cartWrap = overlay.querySelector(".cartfx-cart-wrap");

    stage.style.transform = "";
    stage.style.opacity = "1";
    cartWrap.style.transform = "";
    cartWrap.style.opacity = "0";
    cartWrap.style.display = "block";

    overlay.classList.add("active", "cartfx-overlay-solid");
    document.body.classList.add("cartfx-lock");

    const cartIconEl = getCartIconEl();
    const stageRect = stage.getBoundingClientRect();
    let dx = 0;
    let dy = 0;
    if (cartIconEl) {
      const originRect = cartIconEl.getBoundingClientRect();
      dx =
        originRect.left +
        originRect.width / 2 -
        (stageRect.left + stageRect.width / 2);
      dy =
        originRect.top +
        originRect.height / 2 -
        (stageRect.top + stageRect.height / 2);
    }

    // Paso 1: el carrito viaja desde el ícono del navbar hasta el centro
    await stage.animate(
      [
        {
          transform: `translate(${dx}px, ${dy}px) scale(0.15)`,
          opacity: 0,
          offset: 0,
        },
        {
          transform: `translate(${dx * 0.3}px, ${dy * 0.3}px) scale(0.7)`,
          opacity: 1,
          offset: 0.5,
        },
        { transform: "translate(0px, 0px) scale(1)", opacity: 1, offset: 1 },
      ],
      {
        duration: 650,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "forwards",
      },
    ).finished;
    cartWrap.style.opacity = "1";

    // Paso 2: gira sobre sí mismo y se coloca de frente
    await cartWrap.animate(
      [
        { transform: "scale(1) rotateY(0deg)", offset: 0 },
        { transform: "scale(1.06) rotateY(200deg)", offset: 0.55 },
        { transform: "scale(1) rotateY(360deg)", offset: 1 },
      ],
      {
        duration: 900,
        easing: "cubic-bezier(0.45, 0, 0.2, 1)",
        fill: "forwards",
      },
    ).finished;

    // Pequeña pausa para que el usuario vea el carrito ya de frente
    await sleep(320);

    // Paso 3: "entramos" al carrito → zoom dramático + fundido antes de navegar
    sessionStorage.setItem("cartfx_entrance_pending", "1");
    await stage.animate(
      [
        { transform: "scale(1)", opacity: 1, offset: 0 },
        { transform: "scale(2.6)", opacity: 1, offset: 0.65 },
        { transform: "scale(5.2)", opacity: 0, offset: 1 },
      ],
      {
        duration: 700,
        easing: "cubic-bezier(0.5, 0, 0.85, 0)",
        fill: "forwards",
      },
    ).finished;

    window.location.href = href;
  }

  document.addEventListener("click", function (e) {
    const trigger = e.target.closest("[data-cart-icon], [data-view-cart]");
    if (!trigger) return;
    const href = trigger.getAttribute("href");
    if (!href) return;

    // Si ya estamos en la página del carrito, dejamos el comportamiento normal.
    if (window.location.pathname.toLowerCase().endsWith("carrito.html")) return;

    e.preventDefault();
    playCartEntranceTransition(href);
  });

  // ──────────────────────────────────────────────────────────────────────
  // 3. REVELADO EN carrito.html: si venimos de la transición anterior,
  //    seguimos el "viaje" (salimos del interior del carrito) y luego
  //    aparece el contenido real del carrito.
  // ──────────────────────────────────────────────────────────────────────
  async function playCartEntranceReveal() {
    const pending = sessionStorage.getItem("cartfx_entrance_pending");
    document.documentElement.classList.remove("cartfx-pending");
    if (!pending) return;
    sessionStorage.removeItem("cartfx_entrance_pending");

    const container = document.querySelector(
      ".cart-page-container, #cart-main-container",
    );
    if (!container) return;

    container.classList.add("cartfx-pre-reveal");

    const overlay = ensureOverlay();
    const stage = overlay.querySelector(".cartfx-stage");
    const cartWrap = overlay.querySelector(".cartfx-cart-wrap");

    overlay.classList.add("active", "cartfx-overlay-solid");
    cartWrap.style.display = "block";
    cartWrap.style.opacity = "1";
    cartWrap.style.transform = "scale(1) rotateY(0deg)";
    stage.style.transform = "scale(3.4)";
    stage.style.opacity = "0";

    // Forzar reflow antes de animar hacia el estado final
    stage.getBoundingClientRect();

    await stage.animate(
      [
        { transform: "scale(3.4)", opacity: 0, offset: 0 },
        { transform: "scale(1.3)", opacity: 1, offset: 0.4 },
        { transform: "scale(0.4)", opacity: 0, offset: 1 },
      ],
      {
        duration: 750,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      },
    ).finished;

    overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 350,
      fill: "forwards",
    });
    await sleep(150);

    overlay.classList.remove("active", "cartfx-overlay-solid");
    document.body.classList.remove("cartfx-lock");
    cartWrap.style.display = "none";
    stage.style.transform = "";
    stage.style.opacity = "";

    // Revelado suave del contenido real del carrito
    requestAnimationFrame(() => {
      container.classList.remove("cartfx-pre-reveal");
      container.classList.add("cartfx-reveal");
    });
  }

  document.addEventListener("DOMContentLoaded", playCartEntranceReveal);
})();
