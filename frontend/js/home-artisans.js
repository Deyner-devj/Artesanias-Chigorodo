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

    // Imagen del artesano
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "artesano-img-wrapper";
    
    const img = document.createElement("img");
    img.className = "artesano-img";
    img.loading = "lazy";
    img.alt = `Artesano ${artisan.fullName}`;
    
    if (artisan.imageUrl) {
      img.src = artisan.imageUrl;
    } else {
      img.src = "../img/home/categoria-tejidos.png";
    }
    
    const overlay = document.createElement("div");
    overlay.className = "artesano-img-overlay";
    const visitBtn = document.createElement("a");
    visitBtn.href = "nuestros-artesanos.html";
    visitBtn.className = "artesano-visit-btn";
    visitBtn.textContent = "Ver perfil";
    overlay.append(visitBtn);
    
    imageWrapper.append(img, overlay);

    const info = document.createElement("div");
    info.className = "artesano-info";
    
    // Meta (ubicación)
    const meta = document.createElement("div");
    meta.className = "artesano-meta";
    const location = document.createElement("span");
    location.className = "artesano-location";
    location.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg> Chigorodó, Antioquia';
    meta.append(location);
    info.append(meta);
    
    const title = document.createElement("h3");
    title.className = "artesano-name";
    title.textContent = artisan.fullName;
    info.append(title);
    
    const description = document.createElement("p");
    description.className = "artesano-specialty";
    description.textContent = artisan.specialty || artisan.bio || "Artesano registrado en la plataforma.";
    info.append(description);
    
    const stats = document.createElement("div");
    stats.className = "artesano-stats";
    
    const productCount = document.createElement("span");
    productCount.className = "artesano-stat";
    productCount.innerHTML = `<strong>${artisan.productCount || 0}</strong> productos`;
    stats.append(productCount);
    
    if (artisan.rating && artisan.rating > 0) {
      const divider = document.createElement("span");
      divider.className = "artesano-stat-divider";
      divider.textContent = "·";
      stats.append(divider);
      
      const ratingSpan = document.createElement("span");
      ratingSpan.className = "artesano-stat";
      ratingSpan.innerHTML = `<strong>${artisan.rating.toFixed(1)}</strong><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="var(--primary)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      stats.append(ratingSpan);
    }
    
    info.append(stats);
    card.append(imageWrapper, info);
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
        message.style.cssText = "color: var(--text-muted); grid-column: 1 / -1; text-align: center;";
        grid.append(message);
        return;
      }
      artisans.slice(0, 3).forEach((artisan) => grid.append(cardFor(artisan)));
    } catch (error) {
      console.warn("No se pudo cargar el directorio de artesanos:", error.message);
      const message = document.createElement("p");
      message.textContent = "El directorio de artesanos no está disponible en este momento.";
      message.style.cssText = "color: var(--text-muted); grid-column: 1 / -1; text-align: center;";
      grid.append(message);
    }
  }

  document.querySelector(".testimonios-section")?.remove();
  renderArtisans();
})();
