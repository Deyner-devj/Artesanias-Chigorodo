// js/main.js

/**
 * Format numeric value as Colombian Peso (COP) currency
 * @param {number} val
 * @returns {string}
 */
function formatCOP(val) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(val);
}

/**
 * Get query parameters from current URL
 * @returns {URLSearchParams}
 */
function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

/**
 * Show a professional toast notification
 * @param {string} message
 * @param {string} type
 */
function showModernToast(message, type = "success") {
  const oldToast = document.getElementById("custom-toast");
  if (oldToast) oldToast.remove();

  const color = type === "success" ? "var(--secondary)" : "#ef4444";
  const icon =
    type === "success"
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

  const toast = document.createElement("div");
  toast.id = "custom-toast";
  toast.className = "toast-notification";
  toast.style.borderLeft = `5px solid ${color}`;
  // El icono es SVG estático controlado por nosotros (seguro para innerHTML).
  // El mensaje puede contener datos dinámicos, por lo que se inserta como
  // texto plano con textContent para evitar XSS.
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
}
window.showModernToast = showModernToast;

/**
 * Professional transition from product card image to detail page
 * @param {HTMLElement} imgElement
 * @param {string} targetUrl
 */
function animateProductDetailTransition(imgElement, targetUrl) {
  if (!imgElement) {
    window.location.href = targetUrl;
    return;
  }

  // Prevent double click/animation
  if (window.isNavigatingWithAnim) return;
  window.isNavigatingWithAnim = true;

  const rect = imgElement.getBoundingClientRect();
  const clone = imgElement.cloneNode(true);

  // Identificador propio: sin esto, no había forma de encontrar y limpiar
  // este clon/overlay si el usuario volvía con el botón "atrás" del navegador
  // (bfcache), y se quedaban pegados en pantalla congelados.
  clone.id = "product-transition-clone";
  clone.removeAttribute("onclick");

  // Style clone to overlay original image
  clone.style.position = "fixed";
  clone.style.top = `${rect.top}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.zIndex = "99999";
  clone.style.pointerEvents = "none";
  clone.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
  clone.style.borderRadius = "12px";
  clone.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
  clone.style.objectFit = "cover";

  // Create full-screen overlay backdrop
  const overlay = document.createElement("div");
  overlay.id = "product-transition-overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.backgroundColor = "#faf9f6"; // match warm cream background
  overlay.style.opacity = "0";
  overlay.style.zIndex = "99998";
  overlay.style.transition = "opacity 0.6s ease";
  overlay.style.pointerEvents = "none";

  document.body.appendChild(overlay);
  document.body.appendChild(clone);

  // Force reflow
  clone.getBoundingClientRect();
  overlay.getBoundingClientRect();

  // Trigger animation: center and zoom
  overlay.style.opacity = "1";

  // Calculate center of viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Target dimensions (e.g. 50vw or max 500px)
  const targetSize = Math.min(viewportWidth * 0.5, viewportHeight * 0.5, 450);

  clone.style.top = `${(viewportHeight - targetSize) / 2}px`;
  clone.style.left = `${(viewportWidth - targetSize) / 2}px`;
  clone.style.width = `${targetSize}px`;
  clone.style.height = `${targetSize}px`;
  clone.style.transform = "scale(1.2)";
  clone.style.boxShadow = "0 25px 60px rgba(0,0,0,0.25)";
  clone.style.borderRadius = "20px";

  // Navigate after animation finishes
  setTimeout(() => {
    window.location.href = targetUrl;
  }, 600);
}
window.animateProductDetailTransition = animateProductDetailTransition;

// ---------------------------------------------------------------------------
// Limpieza al volver con el botón "atrás"/"adelante" del navegador:
// cuando la navegación fue una animación de zoom (animateProductDetailTransition)
// y el navegador restaura la página desde el bfcache, el clon de la imagen y el
// overlay que se crearon quedan congelados en pantalla tapando todo, porque el
// script no se vuelve a ejecutar desde cero. Aquí se limpian por su id.
// ---------------------------------------------------------------------------
window.addEventListener("pageshow", function (e) {
  if (!e.persisted) return;

  const staleClone = document.getElementById("product-transition-clone");
  const staleOverlay = document.getElementById("product-transition-overlay");
  if (staleClone) staleClone.remove();
  if (staleOverlay) staleOverlay.remove();

  window.isNavigatingWithAnim = false;
});

/**
 * Show a professional animated confirmation dialog
 * @param {string} message
 * @param {function} onConfirm
 */
function showModernConfirm(message, onConfirm) {
  const oldModal = document.getElementById("custom-confirm-modal");
  if (oldModal) oldModal.remove();

  const backdrop = document.createElement("div");
  backdrop.id = "custom-confirm-modal";
  backdrop.style.position = "fixed";
  backdrop.style.inset = "0";
  backdrop.style.backgroundColor = "rgba(0,0,0,0.4)";
  backdrop.style.backdropFilter = "blur(4px)";
  backdrop.style.display = "flex";
  backdrop.style.alignItems = "center";
  backdrop.style.justifyContent = "center";
  backdrop.style.zIndex = "999999";
  backdrop.style.opacity = "0";
  backdrop.style.transition = "opacity 0.3s ease";

  const modal = document.createElement("div");
  modal.style.background = "var(--bg-card, #ffffff)";
  modal.style.padding = "2rem";
  modal.style.borderRadius = "18px";
  modal.style.boxShadow = "0 20px 50px rgba(0,0,0,0.15)";
  modal.style.width = "min(400px, calc(100% - 2rem))";
  modal.style.textAlign = "center";
  modal.style.transform = "scale(0.8)";
  modal.style.transition =
    "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

  // Icon
  const iconHtml = `<div style="width: 60px; height: 60px; border-radius: 50%; background-color: var(--primary-light, rgba(196,107,45,0.08)); color: var(--primary, #c46b2d); display: grid; place-items: center; margin: 0 auto 1.25rem;">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  </div>`;

  modal.innerHTML = `
    ${iconHtml}
    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-dark, #111827); font-family: var(--font-sans);">¿Estás seguro?</h3>
    <p style="font-size: 0.95rem; color: var(--text-muted, #6b7280); line-height: 1.5; margin-bottom: 1.75rem; font-family: var(--font-sans);">${message}</p>
    <div style="display: flex; gap: 1rem; justify-content: center;">
      <button id="confirm-cancel" style="padding: 10px 20px; font-size: 0.9rem; font-weight: 600; border-radius: 12px; border: 1px solid var(--border-color, #e5e7eb); background-color: transparent; color: var(--text-muted, #6b7280); cursor: pointer; transition: all 200ms ease; font-family: var(--font-sans);">Cancelar</button>
      <button id="confirm-ok" style="padding: 10px 20px; font-size: 0.9rem; font-weight: 600; border-radius: 12px; border: none; background-color: var(--primary, #c46b2d); color: white; cursor: pointer; transition: all 200ms ease; font-family: var(--font-sans);">Confirmar</button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Fade in
  setTimeout(() => {
    backdrop.style.opacity = "1";
    modal.style.transform = "scale(1)";
  }, 10);

  const closeModal = (confirmed) => {
    backdrop.style.opacity = "0";
    modal.style.transform = "scale(0.8)";
    setTimeout(() => {
      backdrop.remove();
      if (confirmed && onConfirm) onConfirm();
    }, 300);
  };

  backdrop
    .querySelector("#confirm-cancel")
    .addEventListener("click", () => closeModal(false));
  backdrop
    .querySelector("#confirm-ok")
    .addEventListener("click", () => closeModal(true));

  // Hover effects
  const btnCancel = backdrop.querySelector("#confirm-cancel");
  const btnOk = backdrop.querySelector("#confirm-ok");
  btnCancel.addEventListener(
    "mouseover",
    () => (btnCancel.style.backgroundColor = "rgba(0,0,0,0.03)"),
  );
  btnCancel.addEventListener(
    "mouseout",
    () => (btnCancel.style.backgroundColor = "transparent"),
  );
  btnOk.addEventListener(
    "mouseover",
    () => (btnOk.style.backgroundColor = "var(--primary-hover, #b05c24)"),
  );
  btnOk.addEventListener(
    "mouseout",
    () => (btnOk.style.backgroundColor = "var(--primary, #c46b2d)"),
  );
}
window.showModernConfirm = showModernConfirm;
