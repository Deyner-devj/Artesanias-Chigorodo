document.addEventListener("DOMContentLoaded", () => {
  inicializarDashboard();
  cargarDatosAdministrativos();
});

async function cargarDatosAdministrativos() {
  if (!window.API) return;
  try {
    const [summary, users] = await Promise.all([
      API.dashboard.getSummary(),
      API.users.getAll(),
    ]);
    setDashboardValue("admin-total-sales", formatCOP(summary.totalSales || 0));
    setDashboardValue("admin-pending-orders", summary.pendingOrders || 0);
    setDashboardValue("admin-total-products", summary.totalProducts || 0);
    setDashboardValue("admin-total-artisans", users.filter((user) => user.role === "VENDOR").length);
    renderRecentAdminOrders(summary.recentOrders || []);
  } catch (error) {
    console.error("No fue posible cargar el dashboard administrativo", error);
    if (window.UF) window.UF.toast("No fue posible cargar las métricas del panel.", "error");
  }
}

function setDashboardValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function renderRecentAdminOrders(orders) {
  const body = document.getElementById("admin-recent-orders");
  if (!body) return;
  if (!orders.length) {
    body.innerHTML = '<tr><td colspan="4">Aún no hay pedidos registrados.</td></tr>';
    return;
  }
  body.innerHTML = orders.map((order) => `
    <tr>
      <td class="font-mono">${escapeAdminHtml(order.orderNumber)}</td>
      <td>${escapeAdminHtml(order.customerName)}</td>
      <td>${formatCOP(order.total || 0)}</td>
      <td><span class="badge badge-info">${escapeAdminHtml(order.status)}</span></td>
    </tr>`).join("");
}

function escapeAdminHtml(value) {
  const node = document.createElement("span");
  node.textContent = value || "";
  return node.innerHTML;
}

async function inicializarDashboard() {
  // 1. Cargar Sidebar
  const sidebarContainer = document.getElementById("dash-sidebar-container");
  if (sidebarContainer) {
    try {
      const res = await fetch("components/sidebar.html");
      if (res.ok) {
        sidebarContainer.innerHTML = await res.text();
        resaltarMenuActivo();
      }
    } catch (e) {
      console.error("Error cargando el Sidebar:", e);
    }
  }

  // 2. Cargar Topbar
  const topbarContainer = document.getElementById("dash-topbar-container");
  if (topbarContainer) {
    try {
      const res = await fetch("components/topbar.html");
      if (res.ok) {
        topbarContainer.innerHTML = await res.text();
        actualizarTituloTopbar();

        // ¡ESTA ES LA CLAVE!
        // Asignar los eventos a los botones justo después de que el Topbar se dibujó en la pantalla
        configurarBotonesTopbar();
      }
    } catch (e) {
      console.error("Error cargando el Topbar:", e);
    }
  }

  // 3. Inicializar íconos de Lucide en elementos cargados dinámicamente
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ==========================================================================
// CONFIGURACIÓN DE BOTONES DEL TOPBAR (Notificaciones, Home, Perfil)
// ==========================================================================
function configurarBotonesTopbar() {
  // Buscar los botones del lado derecho del topbar (Campana = [0], Home = [1])
  const topbarButtons = document.querySelectorAll(
    ".topbar-right .topbar-icon-btn",
  );

  if (topbarButtons.length >= 2) {
    const btnNotificaciones = topbarButtons[0]; // El primer botón es la campana
    const btnHome = topbarButtons[1]; // El segundo botón es la casita

    // Acción para Notificaciones
    btnNotificaciones.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleNotificationsPanel(btnNotificaciones);
    };

    // Acción para el botón Home (Casita)
    btnHome.onclick = function (e) {
      e.preventDefault();
      window.location.href = "admin-dashboard.html"; // Redirige al inicio
    };
  }

  // Acción para el Avatar del Perfil (Círculo naranja)
  const avatarBtn = document.querySelector(".topbar-avatar");
  if (avatarBtn) {
    avatarBtn.style.cursor = "pointer";
    avatarBtn.onclick = function (e) {
      e.preventDefault();
      window.location.href = "perfil.html"; // Redirige a perfil
    };
  }

  // Buscador del topbar
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.onkeypress = function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const termino = this.value.trim();
        if (termino) window.location.href = `../home/productos.html?search=${encodeURIComponent(termino)}`;
      }
    };
  }
}

// ==========================================================================
// PANEL FLOTANTE DE NOTIFICACIONES
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
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      padding: 16px;
      z-index: 9999;
      display: none;
      border: 1px solid #e2e8f0;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 10px;">
        <h4 style="margin: 0; color: #0f172a; font-size: 0.95rem; font-weight: 700;">Notificaciones</h4>
        <span id="clear-notifications" style="font-size: 0.8rem; color: #ea580c; cursor: pointer; font-weight: 600;">Marcar leídas</span>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85rem; color: #475569; display: flex; flex-direction: column; gap: 10px;">
        <li style="padding: 8px; border-radius: 8px; background: #f8fafc; display: flex; gap: 10px; align-items: start;">
          <span style="font-size: 1.1rem; line-height: 1;">📦</span>
          <div><strong style="color: #0f172a;">Nuevo Pedido</strong><br><span style="color: #64748b; font-size: 0.75rem;">Se registró el pedido de una Vasija de Barro</span></div>
        </li>
      </ul>
    `;
    document.body.appendChild(panel);

    // Ocultar al hacer clic en "Marcar leídas"
    panel.querySelector("#clear-notifications").onclick = () => {
      const badge = buttonEl.querySelector(".notification-badge");
      if (badge) badge.style.display = "none";
      panel.style.display = "none";
    };

    // Cerrar al hacer clic en otro lugar
    document.addEventListener("click", (event) => {
      if (!panel.contains(event.target) && !buttonEl.contains(event.target)) {
        panel.style.display = "none";
      }
    });
  }

  if (panel.style.display === "none" || panel.style.display === "") {
    const rect = buttonEl.getBoundingClientRect();
    panel.style.top = rect.bottom + window.scrollY + 10 + "px";
    panel.style.left = rect.right + window.scrollX - 320 + "px";
    panel.style.display = "block";

    // Desaparece el punto rojo
    const badge = buttonEl.querySelector(".notification-badge");
    if (badge) badge.style.display = "none";
  } else {
    panel.style.display = "none";
  }
}

// ==========================================================================
// UTILIDADES DEL DASHBOARD ORIGINALES
// ==========================================================================
function resaltarMenuActivo() {
  const rutaActual =
    window.location.pathname.split("/").pop() || "admin-dashboard.html";
  const itemsMenu = document.querySelectorAll(".account-menu-item");
  itemsMenu.forEach((item) => {
    if (item.getAttribute("href") === rutaActual) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function actualizarTituloTopbar() {
  const tituloPagina = document.body.dataset.pageTitle;
  const elementoTitulo = document.getElementById("topbar-title");
  if (tituloPagina && elementoTitulo) {
    elementoTitulo.textContent = tituloPagina;
  }
}

// Controladores para menú móvil
function toggleMobileSidebar() {
  const sidebar = document.getElementById("dash-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (sidebar && overlay) {
    sidebar.classList.toggle("mobile-open");
    overlay.classList.toggle("mobile-open");
    document.body.style.overflow = sidebar.classList.contains("mobile-open")
      ? "hidden"
      : "";
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("dash-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (sidebar && overlay) {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("mobile-open");
    document.body.style.overflow = "";
  }
}

// Cerrar Sesión usando el modal de confirmación propio del sitio (main.js),
// en vez de confirm()/alert() nativos, para que se vea igual en todo el sitio.
function cerrarSesion(event) {
  event.preventDefault();

  const doLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    if (typeof showModernToast === "function") {
      showModernToast("Sesión cerrada con éxito. ¡Vuelve pronto!", "success");
    }
    setTimeout(() => {
      window.location.href = "../home/index.html";
    }, 1200);
  };

  if (typeof showModernConfirm === "function") {
    showModernConfirm(
      "¿Seguro que deseas cerrar sesión? Tendrás que ingresar tus datos de nuevo para acceder al panel.",
      doLogout,
    );
  } else {
    doLogout();
  }
}
