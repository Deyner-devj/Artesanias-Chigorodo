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

  // Estilos del overlay (se inyectan una sola vez). Vive aquí y no en un
  // .css aparte porque mantenimiento.js debe funcionar solo, sin depender
  // de que la página que lo carga tenga los estilos correctos.
  function inyectarEstilosOverlay() {
    if (document.getElementById("maint-styles")) return;
    const style = document.createElement("style");
    style.id = "maint-styles";
    style.textContent = `
      #maint-professional {
        position: fixed;
        inset: 0;
        z-index: 99999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #fff;
        text-align: center;
        padding: 24px;
        background:
          radial-gradient(circle at 50% 35%, rgba(211,113,53,0.16) 0%, rgba(211,113,53,0) 55%),
          #0f0f12;
        opacity: 0;
        animation: maint-fade-in 0.5s ease forwards;
      }
      @keyframes maint-fade-in { to { opacity: 1; } }

      .maint-card { max-width: 460px; }

      /* --- Torno de alfarero con la vasija tomando forma --- */
      .maint-wheel-wrap {
        position: relative;
        width: 128px;
        height: 128px;
        margin: 0 auto 28px;
      }
      .maint-wheel-base {
        position: absolute;
        left: 50%;
        bottom: 6px;
        transform: translateX(-50%);
        width: 100px;
        height: 14px;
        border-radius: 50%;
        background: rgba(211,113,53,0.18);
        filter: blur(1px);
      }
      .maint-wheel-disc {
        position: absolute;
        left: 50%;
        bottom: 14px;
        transform: translateX(-50%);
        width: 92px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid rgba(211,113,53,0.55);
        border-top-color: rgba(211,113,53,0.9);
        animation: maint-spin-disc 2.2s linear infinite;
      }
      @keyframes maint-spin-disc {
        0% { transform: translateX(-50%) rotate(0deg) scaleY(1); }
        50% { transform: translateX(-50%) rotate(180deg) scaleY(0.85); }
        100% { transform: translateX(-50%) rotate(360deg) scaleY(1); }
      }
      .maint-vasija {
        position: absolute;
        left: 50%;
        bottom: 26px;
        transform: translateX(-50%);
        width: 56px;
        height: auto;
        color: #d37135;
        animation: maint-vasija-breathe 2.2s ease-in-out infinite;
        transform-origin: bottom center;
      }
      @keyframes maint-vasija-breathe {
        0%, 100% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.04); }
      }
      .maint-dust {
        position: absolute;
        border-radius: 50%;
        background: #d37135;
        opacity: 0;
        animation: maint-dust-float 2.2s ease-in infinite;
      }
      .maint-dust:nth-child(1) { left: 32%; bottom: 22px; width: 4px; height: 4px; animation-delay: 0.1s; }
      .maint-dust:nth-child(2) { left: 66%; bottom: 24px; width: 3px; height: 3px; animation-delay: 0.7s; }
      .maint-dust:nth-child(3) { left: 50%; bottom: 20px; width: 3px; height: 3px; animation-delay: 1.3s; }
      @keyframes maint-dust-float {
        0% { opacity: 0; transform: translateY(0) scale(1); }
        30% { opacity: 0.7; }
        100% { opacity: 0; transform: translateY(-38px) scale(0.3); }
      }

      .maint-title {
        color: #f4f4f5;
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.01em;
        margin: 0 0 10px;
      }
      .maint-title span { color: #d37135; }
      .maint-text {
        color: #a0a0a0;
        font-size: 0.98rem;
        line-height: 1.55;
        margin: 0 0 28px;
      }

      .maint-progress-track {
        width: 100%;
        height: 6px;
        background: #222227;
        border-radius: 3px;
        overflow: hidden;
      }
      .maint-progress-fill {
        width: 40%;
        height: 100%;
        border-radius: 3px;
        background: linear-gradient(90deg, #d37135, #e8935f, #d37135);
        background-size: 200% 100%;
        animation: maint-progress-move 1.8s ease-in-out infinite,
                   maint-progress-shine 1.8s linear infinite;
      }
      @keyframes maint-progress-move {
        0% { margin-left: -40%; }
        50% { margin-left: 60%; }
        100% { margin-left: -40%; }
      }
      @keyframes maint-progress-shine {
        0% { background-position: 0% 0; }
        100% { background-position: 200% 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        #maint-professional, .maint-wheel-disc, .maint-vasija, .maint-dust,
        .maint-progress-fill {
          animation: none !important;
        }
        #maint-professional { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  function crearOverlay() {
    // Evitar duplicados
    if (document.getElementById("maint-professional")) return;

    inyectarEstilosOverlay();

    const overlay = document.createElement("div");
    overlay.id = "maint-professional";
    overlay.innerHTML = `
      <div class="maint-card">
        <div class="maint-wheel-wrap">
          <div class="maint-dust"></div>
          <div class="maint-dust"></div>
          <div class="maint-dust"></div>
          <svg class="maint-vasija" viewBox="0 0 56 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4h16 M22 4c-3 8-4 14-2 20 3 8 10 8 10 8s7 0 10-8c2-6 1-12-2-20"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 32c-6 6-8 14-6 22 2 9 8 12 14 12s12-3 14-12c2-8 0-16-6-22"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="maint-wheel-disc"></div>
          <div class="maint-wheel-base"></div>
        </div>
        <h1 class="maint-title">Sistema en <span>mantenimiento</span></h1>
        <p class="maint-text">Estamos dando forma a las mejoras de la plataforma para Artesanías Chigorodó. Volveremos muy pronto.</p>
        <div class="maint-progress-track">
          <div class="maint-progress-fill"></div>
        </div>
      </div>
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
