// js/artesano/agregar-producto.js
// Gestiona el formulario de creacion de nuevos productos para artesanos

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

function setupFormHandlers() {
  const form = document.querySelector('form');
  if (!form) return;

  // Reemplazar el onsubmit del HTML
  form.onsubmit = async (event) => {
    event.preventDefault();
    await handleProductSubmit(event);
  };

  // Manejar la seleccion de imagen
  const imageUrlInput = document.getElementById('add-product-image-url');
  if (imageUrlInput) {
    imageUrlInput.oninput = function() {
      const preview = document.getElementById('add-product-image-preview');
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
    <input type="file" id="product-image-file" accept="image/*" 
           style="display: none;" onchange="handleImageFileSelect(event)"
    />
    <button type="button" onclick="document.getElementById('product-image-file').click()"
            style="background: #e0e7ff; color: #3730a3; border: none; padding: 0.75rem; border-radius: 8px; 
                   font-weight: 600; cursor: pointer; font-family: inherit; width: 100%; text-align: center;">
      Seleccionar Imagen desde Dispositivo
    </button>
    <div id="file-name-display" style="margin-top: 0.5rem; font-size: 0.85rem; color: #64748b;"></div>
  `;

  // Insertar antes del grupo de imagen URL
  const imageUrlGroup = document.getElementById('add-product-image-url')?.parentNode;
  if (imageUrlGroup) {
    imageUrlGroup.parentNode.insertBefore(imageUploadGroup, imageUrlGroup);
  } else {
    // Si no se encuentra, agregar al final del form
    form.appendChild(imageUploadGroup);
  }
}

let selectedImageFile = null;

function handleImageFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    selectedImageFile = file;
    document.getElementById('file-name-display').textContent = `Archivo: ${file.name}`;
    
    // Mostrar preview
    const preview = document.getElementById('add-product-image-preview');
    if (preview) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
        // Actualizar el input de URL con un blob URL
        document.getElementById('add-product-image-url').value = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

async function handleProductSubmit(event) {
  const form = event.target;
  const formData = new FormData(form);
  
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
    visibilityStatus: formData.get('aa-select-1') || 'Visible en Catalogo',
    tags: formData.get('aa-input-10') || '',
  };

  // Validar que el nombre y precio sean validos
  if (!productData.name || productData.name.trim() === '') {
    if (window.UF) window.UF.showToast('El nombre del producto es obligatorio', 'error');
    return;
  }

  if (!productData.price || productData.price <= 0) {
    if (window.UF) window.UF.showToast('El precio debe ser mayor a cero', 'error');
    return;
  }

  try {
    // Crear el producto primero
    const newProduct = await API.products.create({
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
      visible: productData.visibilityStatus !== 'Oculto / Borrador',
      tags: productData.tags.split(',').map(t => t.trim()).filter(t => t),
    });

    const productId = newProduct.id;
    
    // Si hay una imagen seleccionada, subirla
    if (selectedImageFile) {
      await API.products.uploadImage(productId, selectedImageFile);
    }

    if (window.UF) {
      window.UF.showToast('Artesanía guardada en el catálogo exitosamente!', 'success');
    }
    
    // Redirigir a la lista de productos
    loadView('productos');
    
  } catch (error) {
    console.error('Error al crear producto:', error);
    if (window.UF) {
      window.UF.showToast(`Error al guardar producto: ${error.message || 'Intenta de nuevo'}`, 'error');
    }
  }
}

// Inicializar cuando se carga la vista
async function init() {
  await loadCategories();
  setupFormHandlers();
}

// Exponer funciones globalmente
window.handleImageFileSelect = handleImageFileSelect;
window.AgregarProductoJS = { init };
