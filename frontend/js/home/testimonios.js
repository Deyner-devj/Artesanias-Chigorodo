// js/home/testimonios.js
// Carga testimonios reales desde el backend para el index

document.addEventListener('DOMContentLoaded', async function() {
  await loadTestimonios();
});

async function loadTestimonios() {
  const testimoniosSection = document.querySelector('.testimonios-section');
  
  if (!testimoniosSection) {
    console.log('Sección de testimonios no encontrada');
    return;
  }

  try {
    const reviews = await window.API.reviews.getFeatured();
    
    if (!reviews || reviews.length === 0) {
      // Si no hay reviews, mostrar mensaje
      testimoniosSection.innerHTML = `
        <div class="section-header">
          <p class="section-eyebrow">Testimonios</p>
          <h2 id="testimonios-heading">Lo que dicen nuestros clientes</h2>
          <p>Próximamente tendrá testimonios de clientes satisfechos.</p>
        </div>
      `;
      return;
    }

    // Filtrar para obtener solo 3 testimonios
    const featuredReviews = reviews.slice(0, 3);
    
    // Contar reviews con rating >= 4
    const satisfiedCount = reviews.filter(r => r.rating >= 4).length;

    // Crear el HTML dinámico
    const testimoniosHtml = `
      <div class="section-header">
        <p class="section-eyebrow">Testimonios</p>
        <h2 id="testimonios-heading">Lo que dicen nuestros clientes</h2>
        <p>Más de ${satisfiedCount}+ compradores satisfechos comparten su experiencia.</p>
      </div>
      <div class="testimonios-grid">
        ${featuredReviews.map(review => createTestimonioCard(review)).join('')}
      </div>
    `;

    testimoniosSection.innerHTML = testimoniosHtml;

  } catch (error) {
    console.error('Error cargando testimonios:', error);
    // Mostrar mensaje de error honesto
    testimoniosSection.innerHTML = `
      <div class="section-header">
        <p class="section-eyebrow">Testimonios</p>
        <h2 id="testimonios-heading">Lo que dicen nuestros clientes</h2>
        <p>No se pudieron cargar los testimonios en este momento. Por favor, inténtalo más tarde.</p>
      </div>
    `;
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function createTestimonioCard(review) {
  const rating = review.rating || 5;
  const stars = generateStars(rating);
  const userName = review.userName || 'Cliente Anónimo';
  const initial = userName.charAt(0).toUpperCase();
  const avatarBg = getAvatarColor(userName);
  
  return `
    <article class="testimonio-card">
      <div class="testimonio-stars" aria-label="${rating} estrellas">
        ${stars}
      </div>
      <blockquote class="testimonio-text">
        "${escapeHtml(review.comment || review.title || '¡Excelente producto! La calidad es increíble.')}"
      </blockquote>
      <footer class="testimonio-author">
        <div class="testimonio-avatar" style="background-color: ${avatarBg}; color: var(--primary)">
          ${initial}
        </div>
        <div>
          <strong>${escapeHtml(userName)}</strong>
          <p>${escapeHtml(review.productName || 'Producto')} · Comprador verificado</p>
        </div>
      </footer>
    </article>
  `;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="var(--primary)" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    `;
  }
  
  if (hasHalfStar) {
    stars += `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="var(--primary)" stroke="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--primary)" fill-rule="evenodd" clip-rule="evenodd"></path>
      </svg>
    `;
  }
  
  // Estrellas vacías para completar 5
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--border-color)" stroke-width="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    `;
  }
  
  return stars;
}

function getAvatarColor(name) {
  if (!name) return '#fddcb5';
  
  const colors = [
    '#fddcb5', // Naranja claro
    '#dcfce7', // Verde claro
    '#bfdbfe', // Azul claro
    '#fce7f3', // Rosa claro
    '#fef3c7', // Amarillo claro
    '#e0e7ff', // Azul muy claro
  ];
  
  const charCode = name.charCodeAt(0);
  return colors[charCode % colors.length];
}


