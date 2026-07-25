// Carga estadísticas del sitio desde el backend
async function loadSiteStats() {
  if (!window.API || !window.API.stats) {
    console.warn('API.stats no disponible');
    return;
  }

  try {
    const stats = await window.API.stats.getPublicStats();
    
    // Actualizar estadísticas en index.html
    const artisansEl = document.getElementById('stat-artisans');
    const productsEl = document.getElementById('stat-products');
    const ratingEl = document.getElementById('stat-rating');
    
    if (artisansEl) {
      artisansEl.textContent = (stats.totalArtisans || 0) + '+';
    }
    
    if (productsEl) {
      productsEl.textContent = (stats.totalProducts || 0) + '+';
    }
    
    if (ratingEl) {
      const rating = stats.averageRating || 0;
      ratingEl.textContent = rating > 0 ? rating.toFixed(1) + ' ⭐' : '0.0 ⭐';
    }
    
    // También actualizar en landing.html si existe
    const landingArtisansEl = document.getElementById('landing-stat-artisans');
    const landingProductsEl = document.getElementById('landing-stat-products');
    const landingRatingEl = document.getElementById('landing-stat-rating');
    
    if (landingArtisansEl) {
      landingArtisansEl.textContent = (stats.totalArtisans || 0) + '+';
    }
    
    if (landingProductsEl) {
      landingProductsEl.textContent = (stats.totalProducts || 0) + '+';
    }
    
    if (landingRatingEl) {
      const rating = stats.averageRating || 0;
      landingRatingEl.textContent = rating > 0 ? rating.toFixed(1) : '0.0';
    }
    
    console.log('Estadísticas del sitio cargadas:', stats);
  } catch (error) {
    console.error('Error cargando estadísticas del sitio:', error.message);
  }
}

// Cargar estadísticas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadSiteStats);
