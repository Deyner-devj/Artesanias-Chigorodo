// Carga artesanos reales (usuarios con rol VENDOR) desde el backend.
// No usa datos de ejemplo: "Productos" se calcula cruzando /api/users con /api/products.
async function loadAdminArtisans() {
  const body = document.getElementById("artisans-table-body");
  if (!body) return;

  try {
    const [users, products] = await Promise.all([
      window.API.users.getAll(),
      window.API.products.getAll(),
    ]);

    const vendors = users.filter((user) => user.role === "VENDOR");

    // Cuenta cuántos productos tiene cada vendedor, cruzando por sellerId
    const productCountBySeller = products.reduce((acc, product) => {
      acc[product.sellerId] = (acc[product.sellerId] || 0) + 1;
      return acc;
    }, {});

    if (!vendors.length) {
      body.innerHTML =
        '<tr><td colspan="5">No hay artesanos registrados.</td></tr>';
      return;
    }

    body.innerHTML = vendors
      .map((vendor) => {
        const nextStatus = vendor.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const productCount = productCountBySeller[vendor.id] || 0;
        return `<tr>
        <td class="font-semibold">${vendor.fullName}</td>
        <td>${vendor.email}</td>
        <td>${productCount}</td>
        <td><span class="badge ${vendor.status === "ACTIVE" ? "badge-success" : "badge-danger"}">${vendor.status}</span></td>
        <td class="row-actions">
          <button class="icon-btn ${vendor.status === "ACTIVE" ? "icon-btn-danger" : ""}" onclick="changeArtisanStatus(${vendor.id}, '${nextStatus}')">
            ${nextStatus === "ACTIVE" ? "Activar" : "Suspender"}
          </button>
        </td>
      </tr>`;
      })
      .join("");
  } catch (error) {
    body.innerHTML = `<tr><td colspan="5">No fue posible cargar artesanos: ${error.message}</td></tr>`;
  }
}

async function changeArtisanStatus(id, status) {
  await window.API.users.updateStatus(id, status);
  await loadAdminArtisans();
}

document.addEventListener("DOMContentLoaded", loadAdminArtisans);
