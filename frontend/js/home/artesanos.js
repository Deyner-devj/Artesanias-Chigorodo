// js/home/artesanos.js
// Carga artesanos destacados desde el backend para el index

const DEFAULT_ARTISAN_IMAGE = '../img/artesanos/default-artisan.png';

document.addEventListener('DOMContentLoaded', async function() {
  await loadArtisans();
});

async function loadArtisans() {
  const artisansSection = document.querySelector('.artesanos-section');
  
  if (!artisansSection) {
    console.log('Sección de artesanos no encontrada');
    return;
  }

  try {
    const artisans = await window.API.artisans.getAll();
    
    if (!artisans || artisans.length === 0) {
      // Si no hay artesanos, mostrar mensaje
      artisansSection.innerHTML = `
        <div class="section-header">
          <p class="section-eyebrow">Nuestros artesanos</p>
          <h2 id="artesanos-heading">Conoce a los maestros</h2>
          <p>Personas que guardan con sus manos siglos de tradición cultural colombiana.</p>
        </div>
        <div class="artesanos-grid">
          <p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">
            Próximamente tendremos artesanos destacados.
          </p>
        </div>
        <div class="section-footer-link">
          <a href="nuestros-artesanos.html" class="btn btn-outline-green">
            Ver todos los artesanos
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      `;
      return;
    }

    // Tomar los primeros 3 artesanos
    const featuredArtisans = artisans.slice(0, 3);
    
    // Contar total de artesanos satisfechos (rating >= 4)
    const satisfiedCount = artisans.filter(a => a.rating && a.rating >= 4).length;

    // Crear el HTML dinámico
    const artisansHtml = `
      <div class="section-header">
        <p class="section-eyebrow">Nuestros artesanos</p>
        <h2 id="artesanos-heading">Conoce a los maestros</h2>
        <p>Personas que guardan con sus manos siglos de tradición cultural colombiana.</p>
      </div>
      <div class="artesanos-grid">
        ${featuredArtisans.map(artisan => createArtisanCard(artisan)).join('')}
      </div>
      <div class="section-footer-link">
        <a href="nuestros-artesanos.html" class="btn btn-outline-green">
          Ver todos los artesanos
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    `;

    artisansSection.innerHTML = artisansHtml;

  } catch (error) {
    console.error('Error cargando artesanos:', error);
    // Mostrar mensaje de error
    artisansSection.innerHTML = `
      <div class="section-header">
        <p class="section-eyebrow">Nuestros artesanos</p>
        <h2 id="artesanos-heading">Conoce a los maestros</h2>
        <p>Personas que guardan con sus manos siglos de tradición cultural colombiana.</p>
      </div>
      <div class="artesanos-grid">
        <p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">
          Error al cargar artesanos. Intenta más tarde.
        </p>
      </div>
      <div class="section-footer-link">
        <a href="nuestros-artesanos.html" class="btn btn-outline-green">
          Ver todos los artesanos
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    `;
  }
}

function createArtisanCard(artisan) {
  const name = artisan.fullName || 'Artesano';
  const specialty = artisan.specialty || artisan.bio || 'Especialista en artesanías tradicionales.';
  const city = artisan.city || 'Colombia';
  const productCount = artisan.productCount || 0;
  const rating = artisan.rating || 0;
  const imageUrl = artisan.imageUrl || DEFAULT_ARTISAN_IMAGE;
  
  // Generar inicial para el avatar
  const initial = name.charAt(0).toUpperCase();
  
  // SVG para la estrella
  const starSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="var(--primary)" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  `;

  // SVG para el icono de ubicación
  const locationSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `;

  return `
    <article class="artesano-card">
      <div class="artesano-img-wrapper">
        <img
          src="${escapeHtml(imageUrl)}"
          alt="${escapeHtml(name)} - ${escapeHtml(specialty)}"
          class="artesano-img"
          loading="lazy"
          onerror="this.onerror=null;this.src='${DEFAULT_ARTISAN_IMAGE}'"
        />
        <div class="artesano-img-overlay">
          <a href="nuestros-artesanos.html" class="artesano-visit-btn">Ver perfil</a>
        </div>
      </div>
      <div class="artesano-info">
        <div class="artesano-meta">
          <span class="artesano-location">
            ${locationSvg}
            ${escapeHtml(city)}
          </span>
        </div>
        <h3 class="artesano-name">${escapeHtml(name)}</h3>
        <p class="artesano-specialty">${escapeHtml(specialty)}</p>
        <div class="artesano-stats">
          <span class="artesano-stat">
            <strong>${productCount}</strong> productos
          </span>
          <span class="artesano-stat-divider">·</span>
          <span class="artesano-stat">
            <strong>${rating.toFixed(1)}</strong>
            ${starSvg}
          </span>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
