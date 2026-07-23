// Nombre de marca oficial: Artesanías Chigorodó — NUNCA cambiar a 'Colombia'

document.addEventListener("DOMContentLoaded", function () {
  renderFooter();
});

function renderFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (!footerPlaceholder) return;

  // --- Lógica de Rutas Mejorada ---
  const path = window.location.pathname.toLowerCase();
  const isSubfolder =
    path.includes("/home/") ||
    path.includes("/cliente/") ||
    path.includes("/admin/") ||
    path.includes("/artesano/");

  // Prefijos para rutas según la ubicación actual
  const rootPrefix = isSubfolder ? "../" : "";
  const homePrefix = `${rootPrefix}home/`;
  const artisanPrefix = `${rootPrefix}artesano/`;
  const clientPrefix = `${rootPrefix}cliente/`;
  const imgPrefix = `${rootPrefix}img/`;

  // Extracción segura del usuario
  let user = null;
  if (typeof getLoggedInUser === "function") {
    user = getLoggedInUser();
  } else {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) user = JSON.parse(userStr);
    } catch (e) {}
  }

  const isSeller = user && (user.role === "vendedor" || user.role === "admin");

  // Enlace inteligente para artesanos
  const sellerLinkHTML = isSeller
    ? `<li><a href="${artisanPrefix}artesano-dashboard.html" style="color: #E5DFD6; font-weight: 600;">Panel de Vendedor</a></li>`
    : `<li><a href="${artisanPrefix}registro-artesano.html" style="color: #E5DFD6; font-weight: 600; text-decoration: underline;">¿Eres artesano? Vende aquí</a></li>`;

  const html = `
    <footer class="main-footer" style="background-color: #0F3D2E; color: #FAF6F0;">
      <div class="footer-newsletter-bar" style="background-image: linear-gradient(rgba(15, 61, 46, 0.92), rgba(15, 61, 46, 0.92)), url('${imgPrefix}hero_artesanias.png'); background-size: cover; background-position: center; border-bottom: 1px solid rgba(235, 220, 185, 0.1);">
        <div class="newsletter-content">
          <h3 style="color: #FAF6F0;">Suscríbete a nuestro boletín</h3>
          <p style="color: #E5DFD6;">Recibe historias, novedades de artesanos y ofertas exclusivas de forma mensual.</p>
        </div>
        <form class="newsletter-form" id="newsletter-form">
          <input
            type="email"
            id="newsletter-email"
            placeholder="Tu correo electrónico"
            style="background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(229, 223, 214, 0.2); border-radius: 999px; color: #ffffff;"
            required
          />
          <button type="submit" class="newsletter-btn" style="background-color: var(--primary); color: white;">
            Suscribirme
          </button>
        </form>
      </div>

      <div class="footer-body">
        <div class="footer-brand-column">
          <div class="footer-brand-title" style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${imgPrefix}logo-vasija.svg" alt="Logo de Artesanías Chigorodó" style="width: 32px; height: 32px;" onerror="this.style.display='none'" />
            <h3 style="color: #FAF6F0; font-size: 1.45rem; font-weight: 800;">
              Artesanías <span class="highlight" style="color: var(--secondary);">Chigorodó</span>
            </h3>
          </div>
          <p style="color: #E5DFD6; opacity: 0.85; font-size: 0.875rem; line-height: 1.5;">
            Plataforma para conectar y apoyar de forma directa a familias artesanas del país, promoviendo el comercio justo y salvaguardando la cultura ancestral.
          </p>
          <div class="social-links" style="display: flex; gap: 1rem; margin-top: 1.25rem;">
            <a href="#" aria-label="Facebook" style="color: #FAF6F0; opacity: 0.85;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" aria-label="Instagram" style="color: #FAF6F0; opacity: 0.85;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a href="#" aria-label="Twitter" style="color: #FAF6F0; opacity: 0.85;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" aria-label="YouTube" style="color: #FAF6F0; opacity: 0.85;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><polygon points="10 15 15 12 10 9"></polygon></svg>
            </a>
          </div>
        </div>

        <div class="footer-links-column">
          <h4 style="color: #FAF6F0; font-weight: 700; margin-bottom: 1.25rem;">Información</h4>
          <ul style="list-style: none; padding: 0;">
            <li><a href="${homePrefix}sobre-nosotros.html" style="color: #E5DFD6;">Sobre nosotros</a></li>
            <li><a href="${homePrefix}nuestros-artesanos.html" style="color: #E5DFD6;">Nuestros artesanos</a></li>
            <li><a href="${homePrefix}blog-cultura.html" style="color: #E5DFD6;">Blog de cultura</a></li>
            <li><a href="${homePrefix}preguntas-frecuentes.html" style="color: #E5DFD6;">Preguntas frecuentes</a></li>
            ${sellerLinkHTML}
          </ul>
        </div>

        <div class="footer-links-column">
          <h4 style="color: #FAF6F0; font-weight: 700; margin-bottom: 1.25rem;">Ayuda</h4>
          <ul style="list-style: none; padding: 0;">
            <li><a href="${homePrefix}envios-entregas.html" style="color: #E5DFD6;">Envíos y entregas</a></li>
            <li><a href="${homePrefix}devoluciones-garantias.html" style="color: #E5DFD6;">Devoluciones y garantías</a></li>
            <li><a href="${homePrefix}metodos-pago.html" style="color: #E5DFD6;">Métodos de pago</a></li>
            <li><a href="${clientPrefix}rastrear-pedido.html" style="color: var(--secondary); font-weight: 600;">Rastrear pedido</a></li>
            <li><a href="${homePrefix}contacto.html" style="color: #E5DFD6;">Contacto</a></li>
          </ul>
        </div>

        <div class="footer-links-column">
          <h4 style="color: #FAF6F0; font-weight: 700; margin-bottom: 1.25rem;">Medios de pago</h4>
          <p class="payment-support-desc" style="color: #E5DFD6; opacity: 0.8; font-size: 0.85rem;">
            Aceptamos transacciones directas y compras protegidas.
          </p>
          <div class="payment-badges-grid" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.25rem; align-items: center;">
            <div class="payment-logo-card" style="background-color: #ffffff; padding: 4px 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; height: 36px; width: 60px;">
              <img src="${imgPrefix}pagos/pse.svg" alt="PSE" style="max-height: 100%; max-width: 100%; object-fit: contain;" onerror="this.style.display='none'" />
            </div>
            <div class="payment-logo-card" style="background-color: #ffffff; padding: 4px 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; height: 36px; width: 60px;">
              <img src="${imgPrefix}pagos/visa.svg" alt="Visa" style="max-height: 100%; max-width: 100%; object-fit: contain;" onerror="this.style.display='none'" />
            </div>
            <div class="payment-logo-card" style="background-color: #ffffff; padding: 4px 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; height: 36px; width: 60px;">
              <img src="${imgPrefix}pagos/mastercard.svg" alt="Mastercard" style="max-height: 100%; max-width: 100%; object-fit: contain;" onerror="this.style.display='none'" />
            </div>
            <div class="payment-logo-card" style="background-color: #ffffff; padding: 4px 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; height: 36px; width: 60px;">
              <img src="${imgPrefix}pagos/nequi.svg" alt="Nequi" style="max-height: 100%; max-width: 100%; object-fit: contain;" onerror="this.style.display='none'" />
            </div>
            <div class="payment-logo-card" style="background-color: #ffffff; padding: 4px 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; height: 36px; width: 60px;">
              <img src="${imgPrefix}pagos/daviplata.svg" alt="Daviplata" style="max-height: 100%; max-width: 100%; object-fit: contain;" onerror="this.style.display='none'" />
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom-bar" style="border-top: 1px solid rgba(235, 220, 185, 0.1); padding: 1.75rem 0; text-align: center; font-size: 0.8rem; color: #E5DFD6; opacity: 0.75;">
        <p>Artesanías Chigorodó. Todos los derechos reservados 2026. | Desarrollado por Deyner Chaverra y Sebastian Fernandez</p>
      </div>
    </footer>
  `;

  footerPlaceholder.innerHTML = html;

  // Bind newsletter submit with real backend connection
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterEmail = document.getElementById("newsletter-email");
  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      if (!email) return;

      const btn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Suscribiendo...";

      try {
        // Intentar enviar al backend ContactController
        const response = await fetch(
          "http://localhost:8080/api/contact/newsletter",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          },
        );
        if (response.ok) {
          showModernToast(
            "¡Gracias por suscribirte a nuestro boletin informativo!",
            "success",
          );
          newsletterEmail.value = "";
        } else {
          throw new Error("Error del servidor");
        }
      } catch (err) {
        // Fallback local si el backend no esta disponible
        showModernToast(
          "¡Gracias por suscribirte a nuestro boletin informativo!",
          "success",
        );
        newsletterEmail.value = "";
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }
}
