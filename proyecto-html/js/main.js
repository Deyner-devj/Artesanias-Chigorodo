// js/main.js

/**
 * Format numeric value as Colombian Peso (COP) currency
 * @param {number} val 
 * @returns {string}
 */
function formatCOP(val) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(val);
}

/**
 * Get query parameters from current URL
 * @returns {URLSearchParams}
 */
function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

// Generate unique order numbers
function generateOrderNumber() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `AC-2024-${randomNum}`;
}
