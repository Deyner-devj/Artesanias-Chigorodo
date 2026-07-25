// js/artesano/editar-productos.js
// Gestiona el formulario de edicion de productos para artesanos

let currentProductId = null;
let selectedImageFile = null;

async function init() {
  // Obtener el ID del producto de sessionStorage
  currentProductId = sessionStorage.getItem('current_product_id');
  if (!currentProductId) {
    console.error('No se encontró el ID del producto a editar');
    if (window.UF) {
      window.UF.showToast('No se pudo cargar el producto. Intenta de nuevo.', 'error');
    }
    return;
  }

  await loadCategories();
  await loadProductData();
  setupFormHandlers();
}

async function loadCategories() {
  try {
    const categories = await API.categories.getAll();
    const select = document.querySelector('.aa-select');
    if (select) {
      select.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

async function loadProductData() {
  if (!currentProductId) return;

  try {
    const product = await API.products.getById(currentProductId);
    if (!product) {
      if (window.UF) {
        window.UF.showToast('Producto no encontrado.', 'error');
      }
      return;
    }

    // Llenar los campos del formulario con los datos del producto
    const inputs = document.querySelectorAll('.aa-input, .aa-textarea, .aa-select');
    
    // Mapear los campos a los datos del producto
    const fieldMapping = {
      'aa-input-0': 'name',
      'aa-textarea-0': 'description',
      'aa-select-0': 'categoryId',
      'aa-input-2': 'price',
      'aa-input-7': 'stock',
      'aa-input-3': 'material',
      'aa-input-4': 'technique',
      'aa-input-5': 'productionTimeDays',
      'aa-input-6': 'dimensions',
      'aa-input-8': 'weightKg',
      'aa-input-9': 'sku',
      'aa-select-1': 'visible',
      'aa-input-10': 'tags'
    };

    // Llenar inputs
    inputs.forEach(input => {
      const fieldName = Object.keys(fieldMapping).find(key => input.classList.contains(key));
      if (fieldName) {
        const productField = fieldMapping[fieldName];
        
        if (productField === 'visible') {
          // Para el select de visibilidad
          const isVisible = product.visible !== false;
          const options = input.querySelectorAll('option');
          options.forEach(opt => {
            if (isVisible && opt.textContent.includes('Visible')) {
              opt.selected = true;
            } else if (!isVisible && opt.textContent.includes('Oculto')) {
              opt.selected = true;
            }
          });
        } else if (productField === 'categoryId') {
          // Para el select de categoría
          if (product.category && product.category.id) {
            const option = input.querySelector(`option[value="${product.category.id}"]`);
            if (option) option.selected = true;
          }
        } else {
          // Para inputs normales
          let value = product[productField];
          if (value !== null && value !== undefined) {
            if (typeof value === 'boolean') {
              value = value.toString();
            }
            input.value = value;
          }
        }
      }
    });

    // Llenar el campo de imagen URL
    const imageUrlInput = document.getElementById('edit-product-image-url');
    if (imageUrlInput && product.mainImageUrl) {
      imageUrlInput.value = product.mainImageUrl;
      const preview = document.getElementById('edit-product-image-preview');
      if (preview) {
        preview.src = product.mainImageUrl;
      }
    }

  } catch (error) {
    console.error('Error al cargar datos del producto:', error);
    if (window.UF) {
      window.UF.showToast('Error al cargar datos del producto. Intenta de nuevo.', 'error');
    }
  }
}

function setupFormHandlers() {
  const form = document.querySelector('form');
  if (!form) return;

  // Reemplazar el onsubmit del HTML
  form.onsubmit = async (event) => {
    event.preventDefault();
    await handleProductUpdate(event);
  };

  // Manejar la seleccion de imagen
  const imageUrlInput = document.getElementById('edit-product-image-url');
  if (imageUrlInput) {
    imageUrlInput.oninput = function() {
      const preview = document.getElementById('edit-product-image-preview');
      if (preview) preview.src = this.value;
    };
  }

  // Agregar manejador para subir imagen desde archivo
  setupImageUpload();
}

function setupImageUpload() {
  const form = document.querySelector('form');
  if (!form) return;

  // Crear un nuevo grupo para subir imagen desde archivo
  const imageUploadGroup = document.createElement('div');
  imageUploadGroup.className = 'aa-form-group';
  imageUploadGroup.innerHTML = `
    <label class="aa-label">Subir Imagen (Archivo)</label>
    <input type="file" id="edit-product-image-file" accept="image/*" 
           style="display: none;" onchange="handleEditImageFileSelect(event)"
    />
    <button type="button" onclick="document.getElementById('edit-product-image-file').click()"
            style="background: #e0e7ff; color: #3730a3; border: none; padding: 0.75rem; border-radius: 8px; 
                   font-weight: 600; cursor: pointer; font-family: inherit; width: 100%; text-align: center;">
      Seleccionar Imagen desde Dispositivo
    </button>
    <div id="edit-file-name-display" style="margin-top: 0.5rem; font-size: 0.85rem; color: #64748b;"></div>
  `;

  // Insertar antes del grupo de imagen URL
  const imageUrlGroup = document.getElementById('edit-product-image-url')?.parentNode;
  if (imageUrlGroup) {
    imageUrlGroup.parentNode.insertBefore(imageUploadGroup, imageUrlGroup);
  } else {
    form.appendChild(imageUploadGroup);
  }
}

function handleEditImageFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    selectedImageFile = file;
    document.getElementById('edit-file-name-display').textContent = `Archivo: ${file.name}`;
    
    // Mostrar preview
    const preview = document.getElementById('edit-product-image-preview');
    if (preview) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
        document.getElementById('edit-product-image-url').value = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

async function handleProductUpdate(event) {
  const form = event.target;
  const formData = new FormData(form);
  
  if (!currentProductId) {
    if (window.UF) {
      window.UF.showToast('No se puede actualizar. ID de producto no encontrado.', 'error');
    }
    return;
  }

  // Extraer todos los campos
  const productData = {
    name: formData.get('aa-input-0') || '',
    description: formData.get('aa-textarea-0') || '',
    categoryId: formData.get('aa-select-0') || null,
    price: parseFloat(formData.get('aa-input-2') || 0),
    stock: parseInt(formData.get('aa-input-7') || 0),
    material: formData.get('aa-input-3') || null,
    technique: formData.get('aa-input-4') || null,
    productionTimeDays: parseInt(formData.get('aa-input-5') || null),
    dimensions: formData.get('aa-input-6') || null,
    weightKg: parseFloat(formData.get('aa-input-8') || null),
    sku: formData.get('aa-input-9') || null,
    visible: formData.get('aa-select-1') && formData.get('aa-select-1').includes('Visible'),
    tags: formData.get('aa-input-10') || '',
  };

  // Validar que el nombre y precio sean válidos
  if (!productData.name || productData.name.trim() === '') {
    if (window.UF) window.UF.showToast('El nombre del producto es obligatorio', 'error');
    return;
  }

  if (!productData.price || productData.price <= 0) {
    if (window.UF) window.UF.showToast('El precio debe ser mayor a cero', 'error');
    return;
  }

  try {
    // Actualizar el producto
    const updatedProduct = await API.products.update(currentProductId, {
      name: productData.name,
      description: productData.description,
      categoryId: productData.categoryId,
      price: productData.price,
      stock: productData.stock,
      material: productData.material,
      technique: productData.technique,
      productionTimeDays: productData.productionTimeDays,
      dimensions: productData.dimensions,
      weightKg: productData.weightKg,
      sku: productData.sku,
      visible: productData.visible,
      tags: productData.tags.split(',').map(t => t.trim()).filter(t => t),
    });

    // Si hay una imagen seleccionada, subirla
    if (selectedImageFile) {
      await API.products.uploadImage(currentProductId, selectedImageFile);
    }

    if (window.UF) {
      window.UF.showToast('¡Los cambios han sido guardados correctamente!', 'success');
    }
    
    // Limpiar el ID del producto
    sessionStorage.removeItem('current_product_id');
    
    // Redirigir a la lista de productos
    loadView('productos');
    
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    if (window.UF) {
      window.UF.showToast(`Error al guardar producto: ${error.message || 'Intenta de nuevo'}`, 'error');
    }
  }
}

// Exponer funciones globalmente
window.handleEditImageFileSelect = handleEditImageFileSelect;
window.EditarProductosJS = { init };
