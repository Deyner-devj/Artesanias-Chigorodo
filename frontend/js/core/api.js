// js/core/api.js
// Cliente HTTP centralizado para el backend Spring Boot en localhost:8080

const API_BASE = "http://localhost:8080";

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

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

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

  async register(fullName, email, password, role = "CLIENT") {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password, role }),
    });
    return data;
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

// ─── Artisans (directorio público) ───────────────────────────────────────────
const artisans = {
  async getAll() {
    return apiFetch("/api/artisans");
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
};
window._API_clearToken = _clearToken;
