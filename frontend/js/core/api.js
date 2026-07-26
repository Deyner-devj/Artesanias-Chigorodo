// js/core/api.js
// Cliente HTTP centralizado para el backend Spring Boot en localhost:8080

// Carga el feedback visual antes de este cliente en todas las vistas que ya
// incluyen api.js. document.write es intencional aqui: este archivo se carga
// como script clasico durante el parseo y asi el recurso queda disponible de
// forma sincronica, incluso en las paginas antiguas que aun no lo referencian.
if (!window.UF && document.currentScript) {
  const feedbackSrc = document.currentScript.src.replace(
    /api\.js(?:\?.*)?$/,
    "ui-feedback.js",
  );
  document.write(`<script src="${feedbackSrc}"></script>`);
}

// Configuración flexible de la URL base del backend
// Detecta automáticamente si está en Docker o en desarrollo local
const API_BASE = (function() {
  // Si estamos en un entorno Docker (puede detectarse por la URL o host)
  // El frontend se sirve desde nginx en el puerto 5502
  // Pero desde el navegador, localhost:8080 apunta al backend expuesto
  const defaultBase = "http://localhost:8080";
  
  // Intenta detectar si estamos en un contenedor Docker
  // por la URL actual del navegador
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    const port = window.location.port;
    
    // Si el frontend está en el puerto 5502 (nginx en Docker)
    // o en cualquier otro puerto que no sea 8080, usamos localhost:8080
    // porque el backend está expuesto en el host
    if (host === 'localhost' || host === '127.0.0.1' || host === '') {
      return defaultBase;
    }
  }
  
  return defaultBase;
})();

// ─── Token helpers ───────────────────────────────────────────────────────────
function _getToken() {
  return (
    sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")
  );
}

function _saveToken(token) {
  sessionStorage.setItem("auth_token", token);
}

function _clearToken() {
  sessionStorage.removeItem("auth_token");
  localStorage.removeItem("auth_token");
}

// ─── Core fetch wrapper ──────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = _getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Todas las peticiones pasan por aqui: el contador del loader permite
  // cubrir solicitudes simultaneas sin ocultarlo antes de tiempo.
  const loaderMessage =
    options.loaderMessage || "Conectando con Artesanias Chigorodo...";
  if (window.UF) window.UF.showLoader(loaderMessage);

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } finally {
    if (window.UF) window.UF.hideLoader();
  }

  if (!response.ok) {
    let errMsg = `HTTP ${response.status}`;
    try {
      const errBody = await response.json();
      errMsg = errBody.message || errBody.error || errMsg;
    } catch (_) {}
    const err = new Error(errMsg);
    err.status = response.status;
    throw err;
  }

  // 204 No Content
  if (response.status === 204) return null;
  return response.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────
const auth = {
  async login(email, password) {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // data = { token, email, fullName, role }
    _saveToken(data.token);
    return data;
  },

  async register(fullName, email, password, role = "CLIENT", telephone = null, specialty = null) {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password, role, telephone, specialty }),
    });
    return data;
  },
  async forgotPassword(email) {
    return apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
  async resetPassword(token, password) {
    return apiFetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },
};

// ─── Products ────────────────────────────────────────────────────────────────
const products = {
  async getAll({ category, minPrice, maxPrice, search } = {}) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (minPrice != null) params.set("minPrice", minPrice);
    if (maxPrice != null) params.set("maxPrice", maxPrice);
    if (search) params.set("search", search);
    const qs = params.toString();
    return apiFetch(`/api/products${qs ? "?" + qs : ""}`);
  },

  async getById(id) {
    return apiFetch(`/api/products/${id}`);
  },

  async getMine() {
    return apiFetch("/api/products/mine");
  },

  async create(productData) {
    return apiFetch("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  async update(id, productData) {
    return apiFetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  async delete(id) {
    return apiFetch(`/api/products/${id}`, { method: "DELETE" });
  },

  async uploadImage(productId, imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);
    return apiFetch(`/api/products/${productId}/image`, {
      method: "POST",
      body: formData,
      headers: {},
    });
  },

  async uploadImages(productId, imageFiles) {
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("images", file));
    return apiFetch(`/api/products/${productId}/images`, {
      method: "POST",
      body: formData,
      headers: {},
    });
  },
};

// ─── Categories ──────────────────────────────────────────────────────────────
const categories = {
  async getAll() {
    return apiFetch("/api/categories");
  },
};

// ─── Cart ────────────────────────────────────────────────────────────────────
const cart = {
  async get() {
    return apiFetch("/api/cart");
  },

  async addItem(productId, quantity = 1) {
    return apiFetch("/api/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  async decreaseItem(productId) {
    return apiFetch(`/api/cart/items/${productId}/decrease`, {
      method: "PATCH",
    });
  },

  async removeItem(productId) {
    return apiFetch(`/api/cart/items/${productId}`, { method: "DELETE" });
  },

  async clear() {
    return apiFetch("/api/cart", { method: "DELETE" });
  },
};

// ─── Orders ──────────────────────────────────────────────────────────────────
const orders = {
  async create(orderData) {
    return apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  async getAll() {
    return apiFetch("/api/orders");
  },

  async getByOrderNumber(orderNumber) {
    return apiFetch(`/api/orders/${orderNumber}`);
  },

  async updateStatus(orderNumber, status) {
    return apiFetch(`/api/orders/${orderNumber}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async getReceived() {
    return apiFetch("/api/orders/received");
  },

  async getReceivedByStatus(status) {
    return apiFetch(`/api/orders/received/status/${status}`);
  },
};

// ─── Payments ────────────────────────────────────────────────────────────────
const payments = {
  async process(paymentData) {
    return apiFetch("/api/payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },
};

// ─── Reviews ─────────────────────────────────────────────────────────────────
const reviews = {
  async getByProduct(productId) {
    return apiFetch(`/api/reviews/product/${productId}`);
  },

  async getFeatured() {
    return apiFetch("/api/reviews/featured");
  },

  async create(reviewData) {
    return apiFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
const dashboard = {
  async getSummary() {
    return apiFetch("/api/dashboard/resumen");
  },
  async getArtisan() {
    return apiFetch("/api/dashboard/resumen");
  },
};

// ─── Contact ─────────────────────────────────────────────────────────────────
const contact = {
  async sendContact(data) {
    return apiFetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async subscribeNewsletter(email) {
    return apiFetch("/api/contact/newsletter", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

// ─── Users ───────────────────────────────────────────────────────────────────
const users = {
  async getProfile() {
    return apiFetch("/api/users/me");
  },

  async updateProfile(data) {
    return apiFetch("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Solo ADMIN. El backend responde 403 si el usuario autenticado no es admin.
  async getAll() {
    return apiFetch("/api/users");
  },

  async updateStatus(id, status) {
    return apiFetch(`/api/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

// ─── Addresses ────────────────────────────────────────────────────────────────
const addresses = {
  async getAll() {
    return apiFetch("/api/addresses");
  },

  async create(addressData) {
    return apiFetch("/api/addresses", {
      method: "POST",
      body: JSON.stringify(addressData),
    });
  },

  async delete(id) {
    return apiFetch(`/api/addresses/${id}`, { method: "DELETE" });
  },

  async setDefault(id) {
    return apiFetch(`/api/addresses/${id}/default`, { method: "PATCH" });
  },
};

// ─── Payment Methods (Cards) ──────────────────────────────────────────────────
const paymentMethods = {
  async getAll() {
    return apiFetch("/api/payment-methods");
  },

  async create(cardData) {
    return apiFetch("/api/payment-methods", {
      method: "POST",
      body: JSON.stringify(cardData),
    });
  },

  async delete(id) {
    return apiFetch(`/api/payment-methods/${id}`, { method: "DELETE" });
  },

  async setDefault(id) {
    return apiFetch(`/api/payment-methods/${id}/default`, { method: "PATCH" });
  },
};

// ─── Artisans (directorio público) ───────────────────────────────────────────
const artisans = {
  async getAll() {
    return apiFetch("/api/artisans");
  },

  async getById(id) {
    return apiFetch(`/api/artisans/${id}`);
  },

  async update(id, artisanData) {
    return apiFetch(`/api/artisans/${id}`, {
      method: "PUT",
      body: JSON.stringify(artisanData),
    });
  },

  async getProfile(id) {
    return apiFetch(`/api/artisans/${id}/profile`);
  },

  async getEarnings(id) {
    return apiFetch(`/api/artisans/${id}/earnings`);
  },

  async getWithdrawals(id) {
    return apiFetch(`/api/artisans/${id}/withdrawals`);
  },

  async createWithdrawal(id, withdrawalData) {
    return apiFetch(`/api/artisans/${id}/withdrawals`, {
      method: "POST",
      body: JSON.stringify(withdrawalData),
    });
  },

  async getBalance(id) {
    return apiFetch(`/api/artisans/${id}/earnings/balance`);
  },
};

const favorites = {
  async getAll() {
    return apiFetch("/api/favorites");
  },
  async add(productId) {
    return apiFetch(`/api/favorites/${productId}`, { method: "POST" });
  },
  async remove(productId) {
    return apiFetch(`/api/favorites/${productId}`, { method: "DELETE" });
  },
};

// ─── Stats ────────────────────────────────────────────────────────────────
const stats = {
  async getPublicStats() {
    return apiFetch("/api/stats/public");
  },
};

// ─── Sales Reports ────────────────────────────────────────────────────────────
const salesReports = {
  async getArtisan(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const qs = params.toString();
    return apiFetch(`/api/sales-reports/artisan${qs ? "?" + qs : ""}`);
  },
  
  async getArtisanCustomers() {
    return apiFetch("/api/sales-reports/artisan/customers");
  },
};

// ─── Admin Reports ────────────────────────────────────────────────────────────
const adminReports = {
  async get(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const qs = params.toString();
    return apiFetch(`/api/admin/reports${qs ? "?" + qs : ""}`);
  },
  
  async export(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const qs = params.toString();
    
    // Este endpoint devuelve un archivo Excel, por lo que no usamos apiFetch
    // sino que hacemos una petición directa para descargar el archivo
    const token = _getToken();
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    const url = `${API_BASE}/api/admin/reports/export${qs ? "?" + qs : ""}`;
    window.open(url, '_blank');
    
    // Alternativa: usar fetch y crear un enlace de descarga
    /*
    return fetch(url, { headers })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al exportar reporte');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_ventas_${startDate}_a_${endDate}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    */
  },
};

// ─── Exports ─────────────────────────────────────────────────────────────────
window.API = {
  auth,
  products,
  categories,
  cart,
  orders,
  payments,
  reviews,
  dashboard,
  users,
  artisans,
  favorites,
  contact,
  addresses,
  paymentMethods,
  stats,
  salesReports,
  adminReports,
};
window._API_clearToken = _clearToken;
