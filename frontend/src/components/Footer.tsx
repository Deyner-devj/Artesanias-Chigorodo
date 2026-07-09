import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const FacebookSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Read user from localStorage to determine seller link rendering
  const userStr = localStorage.getItem("user");
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isSeller =
    loggedInUser &&
    (loggedInUser.role === "vendedor" || loggedInUser.role === "admin");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      alert("¡Gracias por suscribirte a nuestro boletín informativo!");
      setNewsletterEmail("");
    }
  };

  return (
    <footer
      className="main-footer"
      style={{ backgroundColor: "#0F3D2E", color: "#FAF6F0" }}
    >
      {/* Newsletter Bar with background image */}
      <div
        className="footer-newsletter-bar"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 61, 46, 0.92), rgba(15, 61, 46, 0.92)), url('/assets/hero_artesanias.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "1px solid rgba(235, 220, 185, 0.1)",
        }}
      >
        <div className="newsletter-content">
          <h3 style={{ color: "#FAF6F0" }}>Suscríbete a nuestro boletín</h3>
          <p style={{ color: "#E5DFD6" }}>
            Recibe historias, novedades de artesanos y ofertas exclusivas de
            forma mensual.
          </p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(229, 223, 214, 0.2)",
              borderRadius: "999px",
              color: "#ffffff",
            }}
            required
          />
          <button
            type="submit"
            className="newsletter-btn"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
          >
            Suscribirme
          </button>
        </form>
      </div>

      {/* Main Footer Links */}
      <div className="footer-body">
        <div className="footer-brand-column">
          <div
            className="footer-brand-title"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <img
              src="/assets/logo-vasija.svg"
              alt="Logo de Artesanías Chigorodó"
              style={{ width: "32px", height: "32px" }}
            />
            <h3
              style={{ color: "#FAF6F0", fontSize: "1.45rem", fontWeight: 800 }}
            >
              Artesanías{" "}
              <span className="highlight" style={{ color: "var(--secondary)" }}>
                Chigorodó
              </span>
            </h3>
          </div>
          <p
            style={{
              color: "#E5DFD6",
              opacity: 0.85,
              fontSize: "0.875rem",
              lineHeight: 1.5,
            }}
          >
            Plataforma para conectar y apoyar de forma directa a familias
            artesanas del país, promoviendo el comercio justo y salvaguardando
            la cultura ancestral.
          </p>
          <div
            className="social-links"
            style={{ display: "flex", gap: "1rem", marginTop: "1.25rem" }}
          >
            <a
              href="#"
              aria-label="Facebook"
              style={{ color: "#FAF6F0", opacity: 0.85 }}
            >
              <FacebookSVG />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              style={{ color: "#FAF6F0", opacity: 0.85 }}
            >
              <InstagramSVG />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              style={{ color: "#FAF6F0", opacity: 0.85 }}
            >
              <TwitterSVG />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              style={{ color: "#FAF6F0", opacity: 0.85 }}
            >
              <YoutubeSVG />
            </a>
          </div>
        </div>

        <div className="footer-links-column">
          <h4
            style={{
              color: "#FAF6F0",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            Información
          </h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link to="/products" style={{ color: "#E5DFD6" }}>
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link to="/products" style={{ color: "#E5DFD6" }}>
                Nuestros artesanos
              </Link>
            </li>
            <li>
              <Link to="/products" style={{ color: "#E5DFD6" }}>
                Blog de cultura
              </Link>
            </li>
            <li>
              <Link to="/products" style={{ color: "#E5DFD6" }}>
                Preguntas frecuentes
              </Link>
            </li>
            {isSeller ? (
              <li>
                <Link
                  to="/dashboard"
                  style={{ color: "#E5DFD6", fontWeight: 600 }}
                >
                  Panel de Vendedor
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/login" style={{ color: "#E5DFD6", fontWeight: 600 }}>
                  ¿Eres artesano? Vende aquí
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="footer-links-column">
          <h4
            style={{
              color: "#FAF6F0",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            Ayuda
          </h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link to="/products" style={{ color: "#E5DFD6" }}>
                Envíos y entregas
              </Link>
            </li>
            <li>
              <Link to="/products" style={{ color: "#E5DFD6" }}>
                Devoluciones y garantías
              </Link>
            </li>
            <li>
              <Link to="/products" style={{ color: "#E5DFD6" }}>
                Métodos de pago
              </Link>
            </li>
            <li>
              <Link to="/products" style={{ color: "#E5DFD6" }}>
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-links-column">
          <h4
            style={{
              color: "#FAF6F0",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            Medios de pago
          </h4>
          <p
            className="payment-support-desc"
            style={{ color: "#E5DFD6", opacity: 0.8, fontSize: "0.85rem" }}
          >
            Aceptamos transacciones directas y compras protegidas.
          </p>
          <div
            className="payment-badges-grid"
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            <span
              className="payment-badge"
              style={{
                backgroundColor: "#ffffff",
                color: "#0b428c",
                fontWeight: 800,
                padding: "0.35rem 0.65rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
              }}
            >
              PSE
            </span>
            <span
              className="payment-badge"
              style={{
                backgroundColor: "#ffffff",
                color: "#1A1A1A",
                fontWeight: 800,
                padding: "0.35rem 0.65rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
              }}
            >
              VISA
            </span>
            <span
              className="payment-badge"
              style={{
                backgroundColor: "#ffffff",
                color: "#FF5F00",
                fontWeight: 800,
                padding: "0.35rem 0.65rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
              }}
            >
              Mastercard
            </span>
            <span
              className="payment-badge"
              style={{
                backgroundColor: "#ffffff",
                color: "#00c1d5",
                fontWeight: 800,
                padding: "0.35rem 0.65rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
              }}
            >
              Nequi
            </span>
            <span
              className="payment-badge"
              style={{
                backgroundColor: "#ffffff",
                color: "#e82c2c",
                fontWeight: 800,
                padding: "0.35rem 0.65rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
              }}
            >
              Daviplata
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div
        className="footer-bottom-bar"
        style={{
          borderTop: "1px solid rgba(235, 220, 185, 0.1)",
          padding: "1.75rem 0",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#E5DFD6",
          opacity: 0.75,
        }}
      >
        <p>
          Artesanías Chigorodó. Todos los derechos reservados 2026. |
          Desarrollado por Deyner Chaverra y Sebastian Fernandez
        </p>
      </div>
    </footer>
  );
};

export default Footer;
