/**
 * ══════════════════════════════════════════════════════════════════════════
 * UI-FEEDBACK.JS
 * Kit compartido: loader global, toasts, confirm dialog y deteccion de
 * calidad de red. Se incluye en TODAS las paginas (home, cliente, artesano,
 * admin) para reemplazar los alert()/confirm() nativos y las simulaciones
 * de carga dispersas por el proyecto.
 *
 * Uso:
 *   UF.showLoader("Cargando productos...")
 *   UF.hideLoader()
 *   UF.toast("Producto eliminado", "success")
 *   const ok = await UF.confirm("¿Eliminar este producto?")
 *   UF.withLock(button, async () => { ... })   // evita doble-click
 * ══════════════════════════════════════════════════════════════════════════
 */

(function () {
  let loaderCount = 0;
  let slowTimer = null;

  function ensureRoot() {
    if (!document.getElementById("global-loader")) {
      const loader = document.createElement("div");
      loader.id = "global-loader";
      loader.innerHTML = `<div class="uf-spinner"></div><div class="uf-loader-text" id="uf-loader-text">Cargando...</div>`;
      document.body.appendChild(loader);
    }
    if (!document.getElementById("uf-topbar")) {
      const bar = document.createElement("div");
      bar.id = "uf-topbar";
      document.body.appendChild(bar);
    }
    if (!document.getElementById("uf-toast-container")) {
      const cont = document.createElement("div");
      cont.id = "uf-toast-container";
      document.body.appendChild(cont);
    }
    if (!document.getElementById("uf-network-badge")) {
      const badge = document.createElement("div");
      badge.id = "uf-network-badge";
      badge.innerHTML = `<span class="dot"></span><span id="uf-network-label">Conexion</span>`;
      document.body.appendChild(badge);
    }
  }

  function showLoader(text) {
    ensureRoot();
    loaderCount++;
    const loader = document.getElementById("global-loader");
    const label = document.getElementById("uf-loader-text");
    if (label) label.textContent = text || "Cargando...";
    loader.classList.add("is-visible");

    const bar = document.getElementById("uf-topbar");
    bar.classList.add("is-active");
    bar.style.width = "0%";
    requestAnimationFrame(() => (bar.style.width = "70%"));

    // Si tarda demasiado (conexion lenta), avisamos visualmente
    clearTimeout(slowTimer);
    slowTimer = setTimeout(() => {
      loader.classList.add("is-slow");
      if (label)
        label.textContent =
          "Tu conexion parece lenta, esto puede tardar un poco mas...";
    }, 4000);
  }

  function hideLoader() {
    loaderCount = Math.max(0, loaderCount - 1);
    if (loaderCount > 0) return; // aun hay otras peticiones en curso
    clearTimeout(slowTimer);
    const loader = document.getElementById("global-loader");
    const bar = document.getElementById("uf-topbar");
    if (loader) {
      loader.classList.remove("is-slow");
      loader.classList.remove("is-visible");
    }
    if (bar) {
      bar.style.width = "100%";
      setTimeout(() => {
        bar.classList.remove("is-active");
        bar.style.width = "0%";
      }, 250);
    }
  }

  const ICONS = {
    success:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>',
    error:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    warning:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5"><path d="M12 2 1 21h22L12 2z"/><line x1="12" y1="9" x2="12" y2="14"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  };

  function toast(message, type = "info", duration = 3800) {
    ensureRoot();
    const container = document.getElementById("uf-toast-container");
    const el = document.createElement("div");
    el.className = "uf-toast";
    el.setAttribute("data-type", type);
    el.innerHTML = `
      <span class="uf-toast-icon">${ICONS[type] || ICONS.info}</span>
      <span>${message}</span>
      <button class="uf-toast-close" aria-label="Cerrar">&times;</button>
    `;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add("is-visible"));

    const remove = () => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 260);
    };
    el.querySelector(".uf-toast-close").addEventListener("click", remove);
    setTimeout(remove, duration);
  }

  function confirmDialog(
    message,
    {
      title = "Confirmar accion",
      okLabel = "Confirmar",
      cancelLabel = "Cancelar",
      danger = true,
    } = {},
  ) {
    ensureRoot();
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "uf-confirm-overlay";
      overlay.innerHTML = `
        <div class="uf-confirm-box" role="dialog" aria-modal="true">
          <div class="uf-confirm-title">${title}</div>
          <div class="uf-confirm-msg">${message}</div>
          <div class="uf-confirm-actions">
            <button class="uf-btn uf-btn-ghost" data-action="cancel">${cancelLabel}</button>
            <button class="uf-btn ${danger ? "uf-btn-danger" : "uf-btn-primary"}" data-action="ok">${okLabel}</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const close = (result) => {
        overlay.remove();
        resolve(result);
      };
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close(false);
      });
      overlay
        .querySelector('[data-action="cancel"]')
        .addEventListener("click", () => close(false));
      overlay
        .querySelector('[data-action="ok"]')
        .addEventListener("click", () => close(true));
    });
  }

  /**
   * Evita que un boton dispare la accion varias veces si el usuario
   * hace doble-click o clicks rapidos repetidos (causa reportada de
   * animaciones rotas en carrito, compra y paneles).
   */
  function withLock(button, handler) {
    return async function (...args) {
      if (!button || button.dataset.ufLocked === "1") return;
      button.dataset.ufLocked = "1";
      const prevDisabled = button.disabled;
      button.disabled = true;
      button.classList.add("uf-locked");
      try {
        await handler.apply(this, args);
      } finally {
        button.disabled = prevDisabled;
        button.classList.remove("uf-locked");
        // Pequeno margen para dejar terminar la animacion antes de re-habilitar
        setTimeout(() => {
          button.dataset.ufLocked = "0";
        }, 220);
      }
    };
  }

  /**
   * Calidad de red (Network Information API, con fallback a medicion
   * manual). Expone window.UF.network = { quality, effectiveType }.
   * Sirve para: activar skeletons, avisar de conexion lenta, y para
   * ajustar timeouts de la app en la seccion de rendimiento.
   */
  const network = { quality: "unknown", effectiveType: null };

  function classifyConnection() {
    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (conn && conn.effectiveType) {
      network.effectiveType = conn.effectiveType;
      if (conn.effectiveType === "slow-2g" || conn.effectiveType === "2g")
        network.quality = "slow";
      else if (conn.effectiveType === "3g") network.quality = "moderate";
      else network.quality = "fast";
    }
    updateBadge();
  }

  function updateBadge() {
    ensureRoot();
    const badge = document.getElementById("uf-network-badge");
    const label = document.getElementById("uf-network-label");
    if (!badge || network.quality === "unknown") return;
    badge.setAttribute("data-quality", network.quality);
    const labels = {
      slow: "Conexion lenta",
      moderate: "Conexion moderada",
      fast: "Conexion estable",
    };
    if (label) label.textContent = labels[network.quality] || "Conexion";
    badge.classList.add("is-visible");
    if (network.quality === "fast") {
      setTimeout(() => badge.classList.remove("is-visible"), 2500);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureRoot();
    classifyConnection();
    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (conn && conn.addEventListener)
      conn.addEventListener("change", classifyConnection);
  });

  window.UF = {
    showLoader,
    hideLoader,
    toast,
    confirm: confirmDialog,
    withLock,
    network,
  };
})();
