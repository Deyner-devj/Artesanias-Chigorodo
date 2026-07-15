/**
 * MANTENIMIENTO GLOBAL - SISTEMA DE CONTROL
 * Ejecución inmediata y protegida.
 */
(function () {
  // Verifica si el usuario actual es administrador.
  // OJO: usamos sessionStorage a propósito (no localStorage), porque
  // sessionStorage es propio de cada pestaña y se borra al cerrarla.
  // Así, si abres una pestaña nueva sin haber iniciado sesión ahí,
  // NO se te reconoce como admin y sí ves el aviso de mantenimiento.
  function esAdminActual() {
    try {
      const userStr = sessionStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      return !!(user && user.role === "admin");
    } catch (e) {
      return false;
    }
  }

  function esPaginaConfig() {
    return window.location.pathname.includes("configuracion.html");
  }

  function esProgramacionVencida(fecha) {
    if (!fecha) return false;
    return new Date().getTime() >= new Date(fecha).getTime();
  }

  function crearOverlay() {
    // Evitar duplicados
    if (document.getElementById("maint-professional")) return;

    const overlay = document.createElement("div");
    overlay.id = "maint-professional";
    overlay.style.cssText =
      "position:fixed; inset:0; background:#0f0f12; z-index:99999999; display:flex; align-items:center; justify-content:center; font-family:sans-serif; color:white; text-align:center; padding: 20px;";
    overlay.innerHTML = `
            <div style="max-width:500px;">
                <h1 style="color:#d37135; margin-bottom: 10px;">SISTEMA EN MANTENIMIENTO</h1>
                <p style="color:#a0a0a0;">Estamos optimizando la plataforma para Artesanías Chigorodó. Volveremos pronto.</p>
                <div style="width:100%; height:6px; background:#222; margin-top:30px; border-radius:3px; overflow:hidden;">
                    <div style="width:100%; height:100%; background:#d37135; animation:loading 2s infinite ease-in-out;"></div>
                </div>
            </div>
            <style>@keyframes loading{0%{width:0%}50%{width:100%}100%{width:0%}}</style>
        `;

    // Inserción segura: si el body no existe aún, esperamos un ciclo
    if (document.body) {
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";
      });
    }
  }

  function verificarMantenimiento() {
    const config = JSON.parse(localStorage.getItem("mantenimiento_config"));

    // Sin configuración guardada -> no hay nada que bloquear
    if (!config) return;

    // El admin y la propia página de configuración nunca se bloquean
    if (esAdminActual() || esPaginaConfig()) return;

    const debeBloquear =
      config.activoInstante === true ||
      esProgramacionVencida(config.fechaProgramada);

    if (debeBloquear) {
      crearOverlay();
    }
  }

  // EJECUCIÓN INMEDIATA: intenta bloquear apenas se carga el script
  verificarMantenimiento();

  // Segunda verificación cuando el DOM esté listo (por si el <body> no
  // existía todavía en la primera ejecución, o para cubrir todos los casos)
  document.addEventListener("DOMContentLoaded", verificarMantenimiento);
})();
