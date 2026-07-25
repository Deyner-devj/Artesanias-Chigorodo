// js/artesano/mis-productos.js
// Gestiona la carga y visualizacion de productos del artesano

async function loadMisProductos() {
  try {
    const products = await API.products.getMine();
    renderMisProductos(products);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    if (window.UF) {
      window.UF.showToast('Error al cargar tus productos. Intenta de nuevo.', 'error');
    }
    // Mostrar mensaje de error en la tabla
    const tbody = document.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #ef4444; padding: 1rem;">No se pudieron cargar los productos</td></tr>';
    }
  }
}

function renderMisProductos(products) {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;

  if (!products || products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 1rem;">No tienes productos registrados. Agrega tu primera artesanía.</td></tr>';
    return;
  }

  const rows = products.map(product => {
    const statusColor = product.visible !== false ? '#22c55e' : '#f59e0b';
    const statusText = product.visible !== false ? 'Visible' : 'Oculto';
    
    return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 1rem 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${product.mainImageUrl || '../img/default-product.png'}" 
                 alt="${product.name}" 
                 style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;"
                 onerror="this.src='../img/default-product.png'"
            />
            <div>
              <div style="font-weight: 600; color: #0f172a;">${product.name || 'Sin nombre'}</div>
              <div style="font-size: 0.75rem; color: #94a3b8;">${product.sku || 'Sin SKU'}</div>
            </div>
          </div>
        </td>
        <td style="padding: 1rem 0.5rem; color: #475569;">${product.category?.name || 'Sin categoría'}</td>
        <td style="padding: 1rem 0.5rem; color: #0f172a; font-weight: 600;">$ ${formatCurrency(product.price)}</td>
        <td style="padding: 1rem 0.5rem; color: #475569;">${product.stock || 0}</td>
        <td style="padding: 1rem 0.5rem; text-align: right;">
          <button onclick="editProduct(${product.id})" 
                  style="background: #3b82f6; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">
            Editar
          </button>
          <button onclick="toggleProductVisibility(${product.id}, ${product.visible !== false})" 
                  style="background: ${statusColor}; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.75rem; cursor: pointer;">
            ${statusText}
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rows;
}

function editProduct(productId) {
  // Guardar el ID del producto para que editar-productos.js lo use
  sessionStorage.setItem('current_product_id', productId);
  loadView('editar-productos');
}

async function toggleProductVisibility(productId, isVisible) {
  try {
    const updateData = { visible: !isVisible };
    await API.products.update(productId, updateData);
    
    if (window.UF) {
      window.UF.showToast(`Producto ${!isVisible ? 'publicado' : 'ocultado'} correctamente`, 'success');
    }
    
    // Recargar la lista
    await loadMisProductos();
  } catch (error) {
    console.error('Error al actualizar visibilidad:', error);
    if (window.UF) {
      window.UF.showToast('Error al actualizar producto', 'error');
    }
  }
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0';
  return new Intl.NumberFormat('es-CO').format(amount);
}

// Inicializar cuando se carga la vista
async function init() {
  await loadMisProductos();
}

// Exponer funciones globalmente para uso en HTML
window.editProduct = editProduct;
window.toggleProductVisibility = toggleProductVisibility;
window.MisProductosJS = { init };
