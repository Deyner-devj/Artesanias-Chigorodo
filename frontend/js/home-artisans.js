// La portada solo muestra artesanos que existan en el backend.
// No usa perfiles, conteos ni testimonios de ejemplo.
(function () {
  function initialLetters(name) {
    return String(name || "A")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function cardFor(artisan) {
    const card = document.createElement("article");
    card.className = "artesano-card";

    const image = document.createElement("div");
    image.className = "artesano-img-wrapper";
    image.style.cssText = "display:grid;place-items:center;background:linear-gradient(135deg,#e8f3ee,#f5eadf);min-height:220px;";
    const initials = document.createElement("span");
    initials.textContent = initialLetters(artisan.fullName);
    initials.setAttribute("aria-hidden", "true");
    initials.style.cssText = "display:grid;place-items:center;width:88px;height:88px;border-radius:50%;background:var(--primary);color:#fff;font-size:2rem;font-weight:700;";
    image.append(initials);

    const info = document.createElement("div");
    info.className = "artesano-info";
    const title = document.createElement("h3");
    title.className = "artesano-name";
    title.textContent = artisan.fullName;
    const description = document.createElement("p");
    description.className = "artesano-specialty";
    description.textContent = "Artesano registrado en la plataforma.";
    info.append(title, description);
    card.append(image, info);
    return card;
  }

  async function renderArtisans() {
    const grid = document.querySelector(".artesanos-grid");
    if (!grid) return;

    grid.replaceChildren();
    try {
      const artisans = await window.API.artisans.getAll();
      if (!Array.isArray(artisans) || artisans.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Aún no hay artesanos publicados.";
        grid.append(message);
        return;
      }
      artisans.slice(0, 3).forEach((artisan) => grid.append(cardFor(artisan)));
    } catch (error) {
      console.warn("No se pudo cargar el directorio de artesanos:", error.message);
      const message = document.createElement("p");
      message.textContent = "El directorio de artesanos no está disponible en este momento.";
      grid.append(message);
    }
  }

  document.querySelector(".testimonios-section")?.remove();
  renderArtisans();
})();
