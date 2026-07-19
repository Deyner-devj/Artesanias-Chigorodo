// js/animaciones.js

// 1. Mostrar notificación bonita (Toast)
window.showModernToast = function (message, type = "success") {
  const oldToast = document.getElementById("custom-toast");
  if (oldToast) oldToast.remove();

  const color = type === "success" ? "var(--secondary)" : "#ef4444";
  const icon =
    type === "success"
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

  const toast = document.createElement("div");
  toast.id = "custom-toast";
  toast.className = "toast-notification";
  toast.style.borderLeft = `5px solid ${color}`;
  // El icono es SVG estático controlado por nosotros (seguro para innerHTML).
  // El mensaje puede contener datos dinámicos (nombre de producto, búsqueda, etc.)
  // por lo que se inserta como texto plano con textContent para evitar XSS.
  toast.innerHTML = icon;
  const msgDiv = document.createElement("div");
  msgDiv.style.fontSize = "0.95rem";
  msgDiv.style.color = "var(--text-dark)";
  msgDiv.textContent = message;
  toast.appendChild(msgDiv);

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

// 2. Animación de "Volar al Carrito"
window.animateToCart = function (imgElement, productName, callback) {
  if (!imgElement) {
    if (callback) callback();
    showModernToast(`${productName} agregado al carrito`, "success");
    return;
  }

  const cartIcon =
    document.querySelector('a[href*="carrito.html"]') ||
    document.querySelector(".cart-badge");
  if (!cartIcon) {
    if (callback) callback();
    showModernToast(`${productName} agregado al carrito`, "success");
    return;
  }

  const rectOriginal = imgElement.getBoundingClientRect();
  const rectCart = cartIcon.getBoundingClientRect();
  const clone = imgElement.cloneNode(true);

  clone.classList.add("flying-product");
  clone.style.top = `${rectOriginal.top}px`;
  clone.style.left = `${rectOriginal.left}px`;
  clone.style.width = `${rectOriginal.width}px`;
  clone.style.height = `${rectOriginal.height}px`;

  document.body.appendChild(clone);
  clone.getBoundingClientRect(); // Forzar reflow

  clone.style.top = `${rectCart.top}px`;
  clone.style.left = `${rectCart.left}px`;
  clone.style.width = "25px";
  clone.style.height = "25px";
  clone.style.opacity = "0.2";

  clone.addEventListener(
    "transitionend",
    function () {
      clone.remove();
      cartIcon.classList.add("cart-bounce");
      setTimeout(() => cartIcon.classList.remove("cart-bounce"), 500);

      if (callback) callback();
      showModernToast(`${productName} agregado al carrito`, "success");
    },
    { once: true },
  );
};

// 3. Animación de "Tirar a la Papelera"
window.animateToTrash = function (rowElement, callback) {
  if (!rowElement) {
    if (callback) callback();
    return;
  }

  // Crear papelera flotante si no existe
  let trashOverlay = document.getElementById("trash-overlay-anim");
  if (!trashOverlay) {
    trashOverlay = document.createElement("div");
    trashOverlay.id = "trash-overlay-anim";
    trashOverlay.className = "trash-overlay";
    trashOverlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
    document.body.appendChild(trashOverlay);
  }

  setTimeout(() => trashOverlay.classList.add("show"), 10);

  // Seleccionar la imagen del producto a eliminar
  const imgElement = rowElement.querySelector("img");
  const elementToAnimate = imgElement ? imgElement : rowElement;

  const rectOriginal = elementToAnimate.getBoundingClientRect();
  const clone = elementToAnimate.cloneNode(true);

  clone.classList.add("item-deleting");
  clone.style.top = `${rectOriginal.top}px`;
  clone.style.left = `${rectOriginal.left}px`;
  clone.style.width = `${rectOriginal.width}px`;
  clone.style.height = `${rectOriginal.height}px`;

  rowElement.style.opacity = "0"; // Esconder original
  document.body.appendChild(clone);
  clone.getBoundingClientRect(); // Reflow

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  // Animar hacia el centro abajo girando
  clone.style.top = `${windowHeight - 80}px`;
  clone.style.left = `${windowWidth / 2 - 15}px`;
  clone.style.width = "30px";
  clone.style.height = "30px";
  clone.style.transform = "rotate(180deg) scale(0)";
  clone.style.opacity = "0";

  clone.addEventListener(
    "transitionend",
    function () {
      clone.remove();
      trashOverlay.classList.add("trash-bounce");

      setTimeout(() => {
        trashOverlay.classList.remove("trash-bounce");
        trashOverlay.classList.remove("show"); // Ocultar papelera
      }, 400);

      showModernToast(`Producto eliminado`, "error");
      if (callback) callback();
    },
    { once: true },
  );
};
