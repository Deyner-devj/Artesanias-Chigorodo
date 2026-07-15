document.addEventListener("DOMContentLoaded", () => {
  // Inicializa la primera vista sin animación para no molestar en la carga inicial
  loadView("resumen", true);
  createClayOverlayDOM();
  setupSidebarEventListeners();
  setupTopbarEventListeners(); // Inicializa los elementos de la topbar
});

// Mapeo directo a tus archivos HTML físicos
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

// Escucha los clics en el menú lateral directamente
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
// CONFIGURACIÓN DE EVENTOS DE LA TOPBAR (Barra Superior) - VERSIÓN CORREGIDA
// ==========================================================================
function setupTopbarEventListeners() {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 1. Botón Inicio (Casita) -> Te lleva al Dashboard (Resumen)
  // Busca el botón que contiene el icono de "home"
  const iconHome = document.querySelector('i[data-lucide="home"]');
  const btnHome = iconHome
    ? iconHome.closest("button")
    : document.getElementById("btn-home");

  if (btnHome) {
    btnHome.addEventListener("click", () => {
      console.log("🏠 Redirigiendo al Dashboard...");
      loadView("resumen");
    });
  }

  // 2. Avatar de Perfil -> Te lleva a Mi Perfil
  // Busca directamente la bolita con las iniciales (clase .topbar-avatar)
  const btnProfile = document.querySelector(".topbar-avatar");
  if (btnProfile) {
    btnProfile.style.cursor = "pointer"; // Hace que parezca un botón clickeable
    btnProfile.addEventListener("click", () => {
      console.log("👤 Redirigiendo a Perfil...");
      loadView("perfil");
    });
  }

  // 3. Botón de Notificaciones -> Abre el panel flotante
  const iconBell = document.querySelector('i[data-lucide="bell"]');
  const btnNotifications = iconBell
    ? iconBell.closest("button")
    : document.getElementById("btn-notifications");

  if (btnNotifications) {
    btnNotifications.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita que se cierre instantáneamente
      toggleNotificationsPanel(btnNotifications);
    });
  }

  // 4. Menú Lateral (Hamburguesa)
  const menuToggle =
    document.getElementById("menu-toggle") ||
    document.querySelector(".menu-toggle");
  if (menuToggle) {
    menuToggle.removeAttribute("onclick"); // Limpia conflictos si existen
    menuToggle.addEventListener("click", toggleSidebar);
  }
}

// ==========================================================================
// CREADOR DEL PANEL DE NOTIFICACIONES
// ==========================================================================
function toggleNotificationsPanel(buttonEl) {
  let panel = document.getElementById("floating-notifications-panel");

  // Si el panel no existe aún en el HTML, lo creamos y lo inyectamos
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "floating-notifications-panel";
    // Estilos del panel desplegable
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

    // Contenido del panel
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
        <h4 style="margin: 0; color: #0f172a; font-size: 1.1rem; font-weight: 700;">Notificaciones</h4>
        <span style="font-size: 0.75rem; color: #ea580c; cursor: pointer;">Marcar leídas</span>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem; color: #475569;">
        <li style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; display: flex; gap: 10px; align-items: start;">
          <span style="background: #e0f2fe; padding: 5px; border-radius: 5px;">📦</span>
          <div><strong>Nuevo Pedido</strong><br><span style="font-size: 0.8rem">Juan Pérez compró 'Vasija de Arcilla'</span></div>
        </li>
        <li style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; display: flex; gap: 10px; align-items: start;">
          <span style="background: #fef3c7; padding: 5px; border-radius: 5px;">⭐</span>
          <div><strong>Nueva Reseña</strong><br><span style="font-size: 0.8rem">Tienes un comentario de 5 estrellas</span></div>
        </li>
        <li style="padding: 10px 0; display: flex; gap: 10px; align-items: start;">
          <span style="background: #dcfce7; padding: 5px; border-radius: 5px;">💸</span>
          <div><strong>Pago Recibido</strong><br><span style="font-size: 0.8rem">Tu desembolso ha sido procesado</span></div>
        </li>
      </ul>
    `;
    document.body.appendChild(panel);

    // Ocultar el punto rojo (badge) de la campana porque ya abrimos las notificaciones
    const badge = buttonEl.querySelector(".notification-badge");
    if (badge) badge.style.display = "none";

    // Detectar clic fuera del panel para cerrarlo
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && !buttonEl.contains(e.target)) {
        panel.style.display = "none";
      }
    });
  }

  // Alternar entre abrir y cerrar el panel
  if (panel.style.display === "none" || panel.style.display === "") {
    // Calcular dónde está el botón de la campana para poner el panel debajo
    const rect = buttonEl.getBoundingClientRect();
    panel.style.top = rect.bottom + 15 + "px"; // 15px debajo del botón
    panel.style.right = window.innerWidth - rect.right - 10 + "px"; // Alineado a la derecha
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
}

// Función alternativa para desplegar u ocultar el menú lateral
function toggleSidebar() {
  const sidebar =
    document.querySelector(".sidebar") ||
    document.getElementById("sidebar") ||
    document.querySelector(".dash-sidebar");
  if (sidebar) {
    sidebar.classList.toggle("active");
  } else {
    console.warn("No se encontró el elemento contenedor del Sidebar.");
  }
}

// ==========================================================================
// CREACIÓN DINÁMICA DEL OVERLAY DE LA VASIJA
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
    </div>
  `;
  document.body.appendChild(overlay);
}

// ==========================================================================
// CONTROLADOR DE VISTAS CON CAÍDA Y RUPTURA DE VASIJA
// ==========================================================================
async function loadView(viewName, isInitialLoad = false) {
  const container = document.getElementById("dynamic-content");
  const headerTitle =
    document.getElementById("topbar-title") ||
    document.getElementById("header-title");
  const file = viewFiles[viewName];

  if (!file || !container) return;

  // 1. Carga inicial inmediata sin animación
  if (isInitialLoad) {
    updateSidebarUI(viewName, headerTitle);
    const html = await fetchHTMLContent(file);
    if (html) {
      container.innerHTML = html;
      container.classList.add("view-reveal-active");
      setupViewEventListeners(viewName);
    }
    return;
  }

  // 2. Transición con vasija
  const overlay = document.getElementById("clay-transition-container");
  const wrapper = document.getElementById("clay-pot-wrapper");

  // Si no existen los elementos visuales de la transición, cargamos directo para no romper la app
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

  // Limpiamos estados previos
  overlay.classList.remove("shattering");
  overlay.classList.add("active");
  wrapper.classList.remove("dropping", "impact", "bouncing");

  let htmlContent = null;
  let isFinished = false;

  // Iniciamos la descarga del HTML en paralelo
  const fetchPromise = fetchHTMLContent(file).then((html) => {
    htmlContent = html;
  });

  // Temporizador de Emergencia (Seguridad Absoluta)
  // Si en 1.5 segundos no ha terminado la animación o la descarga, forzamos el renderizado.
  const safetyTimeout = setTimeout(() => {
    if (!isFinished) {
      console.warn(
        "⚠️ Tiempo límite de transición excedido. Forzando carga segura...",
      );
      isFinished = true;
      finishWithShatter();
    }
  }, 1500);

  // Iniciar caída
  startDrop();

  function startDrop() {
    wrapper.classList.remove("bouncing", "impact");
    void wrapper.offsetWidth; // Forzar reflujo
    wrapper.classList.add("dropping");
  }

  // Al terminar la animación de caída
  async function onAnimationEnd(e) {
    if (e.target !== wrapper) return;

    if (e.animationName === "potDrop") {
      wrapper.classList.remove("dropping");
      wrapper.classList.add("impact");

      // Esperar a que se complete la descarga del HTML real
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
    }, 220);

    // Escondemos por completo el overlay de la vasija al final
    setTimeout(() => {
      overlay.classList.remove("active", "shattering");
      wrapper.classList.remove("impact");
    }, 750);
  }
}

// Auxiliar: Actualizar la interfaz de navegación lateral e interfaz general
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

// Auxiliar: Descarga de archivos unificada
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
// CONTROLADOR DINÁMICO DE DESPACHOS
// ==========================================================================
function iniciarDespacho(pedidoId) {
  const container = document.getElementById(`dispatch-block-${pedidoId}`);
  if (!container) return;

  container.innerHTML = `
    <div class="delivery-scene">
      <div class="mini-factory"><div class="factory-smoke"></div></div>
      <div class="mini-road"></div>
      <div class="mini-truck">
        <div class="truck-bed"></div>
        <div class="truck-cabin"></div>
        <div class="truck-wheel wheel-front"></div>
        <div class="truck-wheel wheel-back"></div>
      </div>
    </div>
  `;

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
  }, 5000);
}

// ==========================================================================
// CONTROLADORES DE EVENTOS EN VISTAS
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
    const btnPublish = [...document.querySelectorAll("button")].find((el) =>
      el.textContent.includes("Publicar en Tienda"),
    );
    const btnCancel = [...document.querySelectorAll("button")].find((el) =>
      el.textContent.includes("Cancelar"),
    );

    if (btnPublish) {
      btnPublish.addEventListener("click", (e) => {
        e.preventDefault();
        showCraftSuccess(
          "Obra publicada con éxito",
          "La pieza ya está disponible para todo el público de la tienda.",
          2200,
          () => {
            loadView("productos");
          },
        );
      });
    }

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
// MODALES COMPLEMENTARIOS VECTORIALES
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
