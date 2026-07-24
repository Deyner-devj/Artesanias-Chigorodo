// Panel Admin - Productos: 100% real contra el backend. Nada de datos de ejemplo.
// Lista, crea, edita y elimina productos usando /api/products (ya soportado por el backend).

let ADMIN_CATEGORIES_CACHE = [];

async function loadAdminProducts() {
  const body = document.getElementById("admin-products-table-body");
  if (!body || !window.API) return;

  try {
    const [products, categories] = await Promise.all([
      window.API.products.getAll(),
      window.API.categories.getAll().catch(() => []),
    ]);
    ADMIN_CATEGORIES_CACHE = categories;

    if (!products.length) {
      body.innerHTML =
        '<tr><td colspan="7">Aún no hay productos cargados.</td></tr>';
      return;
    }

    body.innerHTML = products
      .map((product) => {
        const categoryLabel = categoryCodeToLabel(product.category);
        const stockBadge =
          product.stock > 0
            ? '<span class="badge badge-success">Publicado</span>'
            : '<span class="badge badge-danger">Agotado</span>';
        return `<tr>
        <td class="font-semibold">${escapeHtml(product.name)}</td>
        <td>${escapeHtml(categoryLabel)}</td>
        <td>${escapeHtml(product.sellerName || "—")}</td>
        <td>${formatCOPAdmin(product.price)}</td>
        <td>${product.stock}</td>
        <td>${stockBadge}</td>
        <td class="row-actions">
          <button class="icon-btn" onclick="openProductModal(${product.id})"><i data-lucide="pencil"></i></button>
          <button class="icon-btn icon-btn-danger" onclick="deleteAdminProduct(${product.id})"><i data-lucide="trash-2"></i></button>
        </td>
      </tr>`;
      })
      .join("");

    if (typeof lucide !== "undefined") lucide.createIcons();
  } catch (error) {
    body.innerHTML = `<tr><td colspan="7">No fue posible cargar los productos: ${error.message}</td></tr>`;
  }
}

function categoryCodeToLabel(code) {
  const found = ADMIN_CATEGORIES_CACHE.find((c) => c.code === code);
  return found ? found.name : code || "Sin categoría";
}

function formatCOPAdmin(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value || 0);
}

function escapeHtml(str) {
  return String(str ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

// ─── Modal (auto-inyectado, sin dependencias externas) ─────────────────────
function ensureProductModal() {
  if (document.getElementById("product-modal-overlay")) return;

  const style = document.createElement("style");
  style.textContent = `
    #product-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.55); z-index: 99999; display: none; align-items: center; justify-content: center; padding: 1rem; }
    #product-modal-overlay.active { display: flex; }
    #product-modal-card { background: #fff; border-radius: 14px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 1.75rem; }
    #product-modal-card h3 { margin: 0 0 1rem; font-size: 1.2rem; font-weight: 800; color: #0f172a; }
    .pm-field { margin-bottom: 0.9rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .pm-field label { font-size: 0.8rem; font-weight: 600; color: #475569; }
    .pm-field input, .pm-field select, .pm-field textarea {
      border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.55rem 0.7rem; font-size: 0.9rem; font-family: inherit;
    }
    .pm-row { display: flex; gap: 0.75rem; }
    .pm-row .pm-field { flex: 1; }
    .pm-actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1.2rem; }
    .pm-btn { padding: 0.55rem 1.1rem; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
    .pm-btn-cancel { background: #f1f5f9; color: #334155; }
    .pm-btn-save { background: var(--primary, #d97706); color: #fff; }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "product-modal-overlay";
  overlay.innerHTML = `
    <div id="product-modal-card">
      <h3 id="product-modal-title">Nuevo producto</h3>
      <form id="product-modal-form">
        <input type="hidden" id="pm-id" />
        <div class="pm-field">
          <label>Nombre</label>
          <input type="text" id="pm-name" required />
        </div>
        <div class="pm-field">
          <label>Descripción</label>
          <textarea id="pm-description" rows="2"></textarea>
        </div>
        <div class="pm-row">
          <div class="pm-field">
            <label>Precio (COP)</label>
            <input type="number" id="pm-price" min="1" step="1" required />
          </div>
          <div class="pm-field">
            <label>Stock</label>
            <input type="number" id="pm-stock" min="0" step="1" required />
          </div>
        </div>
        <div class="pm-row">
          <div class="pm-field">
            <label>Categoría</label>
            <select id="pm-category" required></select>
          </div>
          <div class="pm-field">
            <label>Artesano (nombre)</label>
            <input type="text" id="pm-seller" placeholder="Ej: Eulalia Epiayu" />
          </div>
        </div>
        <div class="pm-field">
          <label>URLs de imágenes (separadas por coma)</label>
          <input type="text" id="pm-images" placeholder="https://.../foto1.jpg, https://.../foto2.jpg" />
        </div>
        <div class="pm-field">
          <label>Colores (separados por coma)</label>
          <input type="text" id="pm-colors" placeholder="Beige, Café, Verde" />
        </div>
        <div class="pm-actions">
          <button type="button" class="pm-btn pm-btn-cancel" id="pm-cancel">Cancelar</button>
          <button type="submit" class="pm-btn pm-btn-save">Guardar</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  document
    .getElementById("pm-cancel")
    .addEventListener("click", closeProductModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeProductModal();
  });
  document
    .getElementById("product-modal-form")
    .addEventListener("submit", handleProductFormSubmit);
}

function closeProductModal() {
  const overlay = document.getElementById("product-modal-overlay");
  if (overlay) overlay.classList.remove("active");
}

async function openProductModal(productId) {
  ensureProductModal();
  const overlay = document.getElementById("product-modal-overlay");
  const title = document.getElementById("product-modal-title");
  const categorySelect = document.getElementById("pm-category");

  categorySelect.innerHTML = ADMIN_CATEGORIES_CACHE.map(
    (c) => `<option value="${c.code}">${escapeHtml(c.name)}</option>`,
  ).join("");

  document.getElementById("pm-id").value = "";
  document.getElementById("pm-name").value = "";
  document.getElementById("pm-description").value = "";
  document.getElementById("pm-price").value = "";
  document.getElementById("pm-stock").value = "";
  document.getElementById("pm-seller").value = "";
  document.getElementById("pm-images").value = "";
  document.getElementById("pm-colors").value = "";

  if (productId) {
    title.textContent = "Editar producto";
    try {
      const product = await window.API.products.getById(productId);
      document.getElementById("pm-id").value = product.id;
      document.getElementById("pm-name").value = product.name || "";
      document.getElementById("pm-description").value =
        product.description || "";
      document.getElementById("pm-price").value = product.price || "";
      document.getElementById("pm-stock").value = product.stock || 0;
      document.getElementById("pm-seller").value = product.sellerName || "";
      document.getElementById("pm-images").value = (
        product.imageUrls || []
      ).join(", ");
      document.getElementById("pm-colors").value = (product.colors || []).join(
        ", ",
      );
      categorySelect.value = product.category || "";
    } catch (error) {
      if (window.UF)
        window.UF.toast(
          "No fue posible cargar el producto: " + error.message,
          "error",
        );
      return;
    }
  } else {
    title.textContent = "Nuevo producto";
  }

  overlay.classList.add("active");
}

async function handleProductFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("pm-id").value;
  const payload = {
    name: document.getElementById("pm-name").value.trim(),
    description: document.getElementById("pm-description").value.trim(),
    price: Number(document.getElementById("pm-price").value),
    stock: Number(document.getElementById("pm-stock").value),
    category: document.getElementById("pm-category").value,
    sellerName: document.getElementById("pm-seller").value.trim() || undefined,
    imageUrls: document
      .getElementById("pm-images")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    colors: document
      .getElementById("pm-colors")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  try {
    if (id) {
      await window.API.products.update(Number(id), payload);
    } else {
      await window.API.products.create(payload);
    }
    closeProductModal();
    await loadAdminProducts();
    if (window.UF)
      window.UF.toast("Producto guardado correctamente.", "success");
  } catch (error) {
    if (window.UF)
      window.UF.toast(
        "No fue posible guardar el producto: " + error.message,
        "error",
      );
  }
}

async function deleteAdminProduct(id) {
  if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer."))
    return;
  try {
    await window.API.products.delete(id);
    await loadAdminProducts();
  } catch (error) {
    if (window.UF)
      window.UF.toast(
        "No fue posible eliminar el producto: " + error.message,
        "error",
      );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAdminProducts();
  ensureProductModal();
  const btnNew = document.getElementById("btn-new-product");
  if (btnNew) btnNew.addEventListener("click", () => openProductModal(null));
});
