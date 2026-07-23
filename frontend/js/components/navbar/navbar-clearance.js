// ==========================================================================
// NAVBAR CLEARANCE: calcula dinámicamente cuánto espacio real ocupa el
// navbar flotante (incluyendo cuando se envuelve en varias filas en
// pantallas pequeñas) y lo expone como la variable CSS --navbar-clearance.
//
// Antes cada página "adivinaba" un padding-top fijo (ej: 140px en móvil),
// y como el navbar puede envolverse distinto según el ancho real del
// dispositivo, texto/logo, o si el usuario tiene sesión iniciada, ese
// número fijo casi nunca coincidía → el título del hero quedaba tapado
// por el navbar en varios celulares/tablets.
// ==========================================================================

function updateNavbarClearance() {
  const navbarEl = document.querySelector(".navbar-container");
  if (!navbarEl) return;

  const rect = navbarEl.getBoundingClientRect();
  // rect.top = separación entre el navbar y el techo de la pantalla
  // rect.height = alto real ya renderizado (incluye filas envueltas)
  const EXTRA_BREATHING_ROOM = 24; // aire extra entre el navbar y el contenido
  const clearance = Math.ceil(rect.top + rect.height + EXTRA_BREATHING_ROOM);

  document.documentElement.style.setProperty(
    "--navbar-clearance",
    `${clearance}px`,
  );
}

function initNavbarClearance() {
  updateNavbarClearance();

  let resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateNavbarClearance, 120);
  });
  window.addEventListener("orientationchange", updateNavbarClearance);

  // Las fuentes web pueden cambiar el ancho del texto del logo/menú después
  // del primer render, lo que cambia si el navbar envuelve o no.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateNavbarClearance).catch(function () {});
  }

  // Reintento tardío por si algo (imágenes, badges async) aún movía el layout.
  window.setTimeout(updateNavbarClearance, 400);
}

window.initNavbarClearance = initNavbarClearance;
window.updateNavbarClearance = updateNavbarClearance;
