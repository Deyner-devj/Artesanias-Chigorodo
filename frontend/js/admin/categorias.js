// Panel Admin - Categorías: solo lectura, 100% real (GET /api/categories + GET /api/products).
// El backend actual no expone crear/editar/eliminar categorías, por eso no hay botones de acción.

async function loadAdminCategories() {
  const body = document.getElementById("admin-categories-table-body");
  if (!body || !window.API) return;

  try {
    const [categories, products] = await Promise.all([
      window.API.categories.getAll(),
      window.API.products.getAll(),
    ]);

    const countByCode = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    if (!categories.length) {
      body.innerHTML =
        '<tr><td colspan="3">No hay categorías registradas.</td></tr>';
      return;
    }

    body.innerHTML = categories
      .map((cat) => {
        const count = countByCode[cat.code] || 0;
        const badge =
          count > 0
            ? '<span class="badge badge-success">Activa</span>'
            : '<span class="badge badge-warning">Sin productos activos</span>';
        return `<tr>
        <td class="font-semibold">${cat.name}</td>
        <td>${count}</td>
        <td>${badge}</td>
      </tr>`;
      })
      .join("");
  } catch (error) {
    body.innerHTML = `<tr><td colspan="3">No fue posible cargar las categorías: ${error.message}</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", loadAdminCategories);
