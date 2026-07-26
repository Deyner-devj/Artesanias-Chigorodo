(function loadDashboardSubmodules() {
  const currentScript = document.currentScript ? document.currentScript.src : "";
  if (!currentScript) return;
  const basePath = currentScript.substring(0, currentScript.lastIndexOf("/")) + "/dashboard/";
  ["dashboard-metrics.js", "dashboard-charts.js", "dashboard-recent-orders.js", "dashboard-init.js"].forEach(file => {
    const s = document.createElement("script");
    s.src = basePath + file;
    document.head.appendChild(s);
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  loadView("resumen", true);
  createClayOverlayDOM();
  setupSidebarEventListeners();
  setupTopbarEventListeners();
});

// Mapeo a tus archivos HTML físicos
const viewFiles = {
  resumen: "resumen-view.html",
  "agregar-producto": "agregar-producto.html",
  clientes: "clientes.html",
  configuracion: "configuracion.html",
  "editar-productos": "editar-productos.html",
  ganancias: "ganancias.html",
  pedidos: "pedidos.html",
  perfil: "perfil.html",
  productos: "productos.html",
  "registro-artesano": "registro-artesano.html",
  ventas: "ventas.html",
};

// Mapeo de JS para cada vista
const viewScripts = {
  "agregar-producto": "agregar-producto.js",
  "editar-productos": "editar-productos.js",
  productos: "mis-productos.js",
  pedidos: "mis-pedidos.js",
  clientes: "clientes.js",
  perfil: "perfil-artesano.js",
  configuracion: "configuracion-artesano.js",
  ganancias: "ganancias.js",
  ventas: "ventas.js",
};

const viewTitles = {
  resumen: "Dashboard General",
  "agregar-producto": "Agregar Nuevo Producto",
  clientes: "Mis Clientes",
  configuracion: "Configuración de la Tienda",
  "editar-productos": "Modificar Catálogo",
  ganancias: "Mis Ganancias",
  pedidos: "Control de Pedidos",
  perfil: "Perfil del Artesano",
  productos: "Mis Productos",
  "registro-artesano": "Registro de Colaboradores",
  ventas: "Historial de Ventas",
};

// Escucha los clics en el menú lateral
function setupSidebarEventListeners() {
  document.querySelectorAll(".menu-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const viewName = btn.id.replace("btn-", "");
      if (viewFiles[viewName]) {
        loadView(viewName);
      }
    });
  });
}

// ==========================================================================
// EVENTOS DE LA TOPBAR
// ==========================================================================
function setupTopbarEventListeners() {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  const iconHome = document.querySelector('i[data-lucide="home"]');
  const btnHome = iconHome
    ? iconHome.closest("button")
    : document.getElementById("btn-home");

  if (btnHome) {
    btnHome.addEventListener("click", () => loadView("resumen"));
  }

  const btnProfile =
    document.querySelector(".topbar-avatar") ||
    document.querySelector(".avatar-header");
  if (btnProfile) {
    btnProfile.style.cursor = "pointer";
    btnProfile.addEventListener("click", () => loadView("perfil"));
  }

  const iconBell = document.querySelector('i[data-lucide="bell"]');
  const btnNotifications = iconBell
    ? iconBell.closest("button")
    : document.getElementById("btn-notifications");

  if (btnNotifications) {
    btnNotifications.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleNotificationsPanel(btnNotifications);
    });
  }

  const menuToggle =
    document.getElementById("menu-toggle") ||
    document.querySelector(".menu-toggle");
  if (menuToggle) {
    menuToggle.removeAttribute("onclick");
    menuToggle.addEventListener("click", toggleSidebar);
  }
}

// ==========================================================================
// PANEL DE NOTIFICACIONES
// ==========================================================================
function toggleNotificationsPanel(buttonEl) {
  let panel = document.getElementById("floating-notifications-panel");

  if (!panel) {
    panel = document.createElement("div");
    panel.id = "floating-notifications-panel";
    panel.style.cssText = `
      position: absolute;
      width: 320px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      padding: 15px;
      z-index: 9999;
      display: none;
      border: 1px solid #e2e8f0;
      transition: opacity 0.2s ease;
    `;

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
        <h4 style="margin: 0; color: #0f172a; font-size: 1.1rem; font-weight: 700;">Notificaciones</h4>
        <span style="font-size: 0.75rem; color: #ea580c; cursor: pointer;">Marcar leídas</span>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem; color: #475569;">
        <li style="padding: 10px 0; text-align: center; color: #64748b;">
          No hay notificaciones nuevas
        </li>
      </ul>
    `;
    document.body.appendChild(panel);

    const badge = buttonEl.querySelector(".notification-badge");
    if (badge) badge.style.display = "none";

    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && !buttonEl.contains(e.target)) {
        panel.style.display = "none";
      }
    });
  }

  if (panel.style.display === "none" || panel.style.display === "") {
    const rect = buttonEl.getBoundingClientRect();
    panel.style.top = rect.bottom + 15 + "px";
    panel.style.right = window.innerWidth - rect.right - 10 + "px";
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
}

function toggleSidebar() {
  const sidebar =
    document.querySelector(".sidebar") ||
    document.getElementById("sidebar") ||
    document.querySelector(".dash-sidebar");
  if (sidebar) {
    sidebar.classList.toggle("active");
  }
}

// ==========================================================================
// CREACIÓN DEL OVERLAY DE LA VASIJA (con la sección que emerge)
// ==========================================================================
function createClayOverlayDOM() {
  if (document.getElementById("clay-transition-container")) return;

  const overlay = document.createElement("div");
  overlay.id = "clay-transition-container";
  overlay.className = "clay-transition-overlay";

  overlay.innerHTML = `
    <div class="shatter-flash"></div>
    <div class="clay-pot-wrapper" id="clay-pot-wrapper">
      <div class="pot-ground-shadow"></div>
      <div class="clay-pot">
        <div class="pot-engraving"></div>
      </div>
      <div class="clay-shard shard-1" style="width: 32px; height: 32px; clip-path: polygon(50% 0%, 100% 100%, 0% 100%); top: 18%; left: 8%;"></div>
      <div class="clay-shard shard-2" style="width: 38px; height: 28px; clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); top: 28%; right: 4%;"></div>
      <div class="clay-shard shard-3" style="width: 28px; height: 36px; clip-path: polygon(0% 20%, 100% 0%, 60% 100%, 20% 80%); bottom: 22%; left: 12%;"></div>
      <div class="clay-shard shard-4" style="width: 32px; height: 32px; clip-path: polygon(30% 0%, 100% 40%, 70% 100%, 0% 60%); bottom: 26%; right: 12%;"></div>
      <div class="clay-shard shard-5" style="width: 22px; height: 22px; clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); top: 4%; left: 42%;"></div>
      <div class="clay-shard shard-6" style="width: 16px; height: 16px; clip-path: polygon(50% 0%, 100% 100%, 0% 100%); top: 45%; left: 2%;"></div>
      <div class="clay-shard shard-7" style="width: 18px; height: 14px; clip-path: polygon(0% 0%, 100% 0%, 50% 100%); top: 50%; right: 0%;"></div>
      <div class="clay-shard shard-8" style="width: 14px; height: 14px; clip-path: polygon(50% 0%, 100% 100%, 0% 100%); bottom: 8%; left: 48%;"></div>
      <div class="dust-cloud">
        <span class="dust-particle" style="--dx: -55px; --dy: -18px;"></span>
        <span class="dust-particle" style="--dx: 60px; --dy: -22px;"></span>
        <span class="dust-particle" style="--dx: -30px; --dy: -35px;"></span>
        <span class="dust-particle" style="--dx: 40px; --dy: -10px;"></span>
        <span class="dust-particle" style="--dx: 10px; --dy: -40px;"></span>
        <span class="dust-particle" style="--dx: -10px; --dy: -8px;"></span>
      </div>
      <div class="section-emerge" id="section-emerge">
        <div class="section-emerge-card">
          <div class="section-emerge-label">Sección</div>
          <div class="section-emerge-title" id="section-emerge-title">Dashboard</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ==========================================================================
// CONTROLADOR DE VISTAS: CAÍDA + RUPTURA + EMERGE LA SECCIÓN
// ==========================================================================
async function loadView(viewName, isInitialLoad = false) {
  const container = document.getElementById("dynamic-content");
  const headerTitle =
    document.getElementById("topbar-title") ||
    document.getElementById("header-title");
  const file = viewFiles[viewName];

  if (!file || !container) return;

  // 2. Si hay un script para esta vista, cargarlo
  const scriptName = viewScripts[viewName];

  // 1. Carga inicial sin animación
  if (isInitialLoad) {
    updateSidebarUI(viewName, headerTitle);
    const html = await fetchHTMLContent(file);
    if (html) {
      container.innerHTML = html;
      container.classList.add("view-reveal-active");
      setupViewEventListeners(viewName);
      
      // Cargar el script de la vista
      await loadViewScript(viewName).catch(err => {
        console.error(`Error cargando script para ${viewName}:`, err);
      });
    }
    return;
  }

  // 2. Transición con vasija
  const overlay = document.getElementById("clay-transition-container");
  const wrapper = document.getElementById("clay-pot-wrapper");
  const emergeTitle = document.getElementById("section-emerge-title");
  const emergeEl = document.getElementById("section-emerge");

  if (!overlay || !wrapper) {
    updateSidebarUI(viewName, headerTitle);
    const html = await fetchHTMLContent(file);
    if (html) {
      container.innerHTML = html;
      container.classList.add("view-reveal-active");
      setupViewEventListeners(viewName);
    }
    return;
  }

  // Limpiar estados previos
  overlay.classList.remove("shattering");
  overlay.classList.add("active");
  wrapper.classList.remove("dropping", "impact");
  if (emergeEl) emergeEl.classList.remove("emerge-active");

  // Poner el nombre de la sección que va a emerger
  if (emergeTitle) {
    emergeTitle.innerText = viewTitles[viewName] || "Dashboard";
  }

  let htmlContent = null;
  let isFinished = false;

  // Descargar el HTML en paralelo
  const fetchPromise = fetchHTMLContent(file).then((html) => {
    htmlContent = html;
  });

  // Safety timeout
  const safetyTimeout = setTimeout(() => {
    if (!isFinished) {
      isFinished = true;
      finishWithShatter();
    }
  }, 1500);

  // Iniciar caída
  wrapper.classList.remove("bouncing", "impact");
  void wrapper.offsetWidth;
  wrapper.classList.add("dropping");

  // Al terminar la caída
  async function onAnimationEnd(e) {
    if (e.target !== wrapper) return;

    if (e.animationName === "potDrop") {
      wrapper.classList.remove("dropping");
      wrapper.classList.add("impact");

      await fetchPromise;

      if (!isFinished) {
        isFinished = true;
        clearTimeout(safetyTimeout);
        finishWithShatter();
      }
    }
  }

  wrapper.addEventListener("animationend", onAnimationEnd);

  function finishWithShatter() {
    wrapper.removeEventListener("animationend", onAnimationEnd);
    overlay.classList.add("shattering");

    // Después del destello y los pedazos, cambiar el contenido
    setTimeout(() => {
      updateSidebarUI(viewName, headerTitle);

      container.classList.remove("view-reveal-active");
      void container.offsetWidth;

      if (htmlContent) {
        container.innerHTML = htmlContent;
      } else {
        container.innerHTML = `<p style="padding: 2rem; text-align: center; color: red; font-weight: bold;">⚠️ Error al cargar el archivo: "${file}". Verifica que el nombre sea idéntico y esté en la misma carpeta.</p>`;
      }
      container.classList.add("view-reveal-active");
      setupViewEventListeners(viewName);
      
      // Cargar el script de la vista
      loadViewScript(viewName).catch(err => {
        console.error(`Error cargando script para ${viewName}:`, err);
      });
    }, 220);

    // Ocultar el overlay al final
    setTimeout(() => {
      overlay.classList.remove("active", "shattering");
      wrapper.classList.remove("impact");
    }, 750);
  }
}

// Actualizar sidebar y título
function updateSidebarUI(viewName, headerTitle) {
  document
    .querySelectorAll(".menu-item")
    .forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.getElementById(`btn-${viewName}`);
  if (activeBtn) activeBtn.classList.add("active");

  if (headerTitle) {
    headerTitle.innerText = viewTitles[viewName] || "Dashboard";
  }
}

// Descarga de archivos
async function fetchHTMLContent(file) {
  const currentPath = window.location.pathname;
  const directory = currentPath.substring(0, currentPath.lastIndexOf("/"));
  const possibleUrls = [
    `./${file}`,
    `${directory}/${file}`,
    `/frontend/artesano/${file}`,
    `/frontend/admin/${file}`,
    `${file}`,
  ];

  for (const url of possibleUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
    } catch (e) {}
  }
  return null;
}

// ==========================================================================
// CARGA DE SCRIPTS DE VISTA
// ==========================================================================
async function loadViewScript(viewName) {
  const scriptName = viewScripts[viewName];
  if (!scriptName) return;

  // Verificar si ya está cargado
  if (window[`${viewName.charAt(0).toUpperCase() + viewName.slice(1)}JS`]) {
    return;
  }

  const currentScript = document.currentScript || document.querySelector('script[src*="artesano-dashboard.js"]');
  if (!currentScript) return;

  const basePath = currentScript.src.substring(0, currentScript.src.lastIndexOf('/')) + '/';
  const scriptUrl = basePath + scriptName;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = () => {
      // Verificar si el módulo tiene función init
      const moduleName = scriptName.replace('.js', '');
      const initFn = window[`${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}JS`]?.init;
      if (initFn) {
        Promise.resolve(initFn()).then(resolve).catch(reject);
      } else {
        resolve();
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ==========================================================================
// DESPACHOS
// ==========================================================================
function iniciarDespacho(pedidoId) {
  const container = document.getElementById(`dispatch-block-${pedidoId}`);
  if (!container) return;

  // Fase 1: preparando el paquete (se empaca la pieza)
  container.innerHTML = `
    <div class="dispatch-progress">
      <div class="delivery-scene">
        <div class="mini-factory"><div class="factory-smoke"></div></div>
        <div class="mini-road"></div>
        <div class="mini-package" id="package-${pedidoId}"></div>
        <div class="mini-truck" id="truck-${pedidoId}" style="animation-play-state: paused; left: 15px;">
          <div class="truck-bed"></div>
          <div class="truck-cabin"></div>
          <div class="truck-wheel wheel-front"></div>
          <div class="truck-wheel wheel-back"></div>
        </div>
      </div>
      <span class="dispatch-status-text" id="status-${pedidoId}">Empacando la pieza…</span>
    </div>
  `;

  // Fase 2: el paquete sube al camión y arranca el viaje
  setTimeout(() => {
    const pkg = document.getElementById(`package-${pedidoId}`);
    const truck = document.getElementById(`truck-${pedidoId}`);
    const status = document.getElementById(`status-${pedidoId}`);
    if (pkg) pkg.classList.add("loaded");
    if (status) status.textContent = "En camino al cliente…";
    setTimeout(() => {
      if (truck) {
        truck.style.animationPlayState = "running";
        truck.classList.add("truck-driving");
      }
      if (pkg) pkg.style.opacity = "0";
    }, 350);
  }, 1200);

  // Fase 3: sello de confirmación
  setTimeout(() => {
    container.innerHTML = `
      <div class="dispatched-stamp" id="stamp-${pedidoId}">Despachado ✓</div>
    `;

    setTimeout(() => {
      const stamp = document.getElementById(`stamp-${pedidoId}`);
      if (stamp) {
        stamp.classList.add("stamped");
        if (navigator.vibrate) {
          navigator.vibrate(80);
        }
      }
    }, 50);

    if (typeof showModernToast === "function") {
      showModernToast(`Pedido #${pedidoId} despachado con éxito`, "success");
    }
  }, 6600);
}

// ==========================================================================
// EVENTOS EN VISTAS
// ==========================================================================
function setupViewEventListeners(viewName) {
  if (viewName === "productos") {
    const btnAdd =
      document.querySelector(".content-body button, .content-body .btn") ||
      [...document.querySelectorAll("button")].find((el) =>
        el.textContent.includes("Añadir Nueva Pieza"),
      );

    if (btnAdd) {
      btnAdd.addEventListener("click", (e) => {
        e.preventDefault();
        showCraftLoading(
          "Añadiendo una nueva creación",
          "Preparando los materiales de moldeado...",
          1500,
          () => {
            loadView("agregar-producto");
          },
        );
      });
    }
  }

  if (viewName === "agregar-producto") {
    const btnCancel = [...document.querySelectorAll("button")].find((el) =>
      el.textContent.includes("Cancelar"),
    );

    if (btnCancel) {
      btnCancel.addEventListener("click", (e) => {
        e.preventDefault();
        showCraftConfirm(
          "¿Deseas detener la creación?",
          "Si sales ahora, perderás todos los detalles de esta obra.",
          () => {
            loadView("productos");
          },
        );
      });
    }
  }
}

// ==========================================================================
// MODALES
// ==========================================================================
function showCraftLoading(message, subtitle, duration, callback) {
  const overlay = document.createElement("div");
  overlay.className = "craft-modal-overlay";
  overlay.innerHTML = `
    <div class="craft-modal-card">
      <div class="craft-spinner"></div>
      <h3 style="color: #0f172a; font-weight: 800; font-size: 1.3rem; margin-bottom: 0.5rem;">${message}</h3>
      <p style="color: #64748b; font-size: 0.9rem;">${subtitle}</p>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add("active"), 10);

  setTimeout(() => {
    overlay.classList.remove("active");
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, 300);
  }, duration);
}

function showCraftSuccess(message, subtitle, duration, callback) {
  const overlay = document.createElement("div");
  overlay.className = "craft-modal-overlay";
  overlay.innerHTML = `
    <div class="craft-modal-card">
      <div class="craft-icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h3 style="color: #0f172a; font-weight: 800; font-size: 1.3rem; margin-bottom: 0.5rem; line-height: 1.4;">${message}</h3>
      <p style="color: #64748b; font-size: 0.9rem;">${subtitle}</p>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add("active"), 10);

  setTimeout(() => {
    overlay.classList.remove("active");
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, 300);
  }, duration);
}

function showCraftConfirm(message, subtitle, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "craft-modal-overlay";
  overlay.innerHTML = `
    <div class="craft-modal-card">
      <div class="craft-icon-container warning-theme">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h3 style="color: #0f172a; font-weight: 800; font-size: 1.3rem; margin-bottom: 0.5rem; line-height: 1.4;">${message}</h3>
      <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem;">${subtitle}</p>
      <div class="craft-modal-buttons">
        <button class="craft-btn-cancel" id="confirm-no">Seguir creando</button>
        <button class="craft-btn-confirm" id="confirm-yes">Sí, detener</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add("active"), 10);

  const close = () => {
    overlay.classList.remove("active");
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector("#confirm-no").addEventListener("click", close);
  overlay.querySelector("#confirm-yes").addEventListener("click", () => {
    close();
    if (onConfirm) onConfirm();
  });
}

function logout() {
  showCraftConfirm(
    "¿Cerrar Sesión?",
    "Tendrás que ingresar tus datos de nuevo para acceder al panel.",
    () => {
      showCraftSuccess("Cerrando sesión...", "¡Hasta pronto!", 1500, () => {
        sessionStorage.removeItem("user");
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
        window.location.href = "../home/index.html";
      });
    },
  );
}
