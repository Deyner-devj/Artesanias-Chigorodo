// js/cliente/perfil.js
// Modulo para manejar el perfil del cliente, direcciones y metodos de pago

// ============================================================================
// MODAL MANAGEMENT
// ============================================================================

// Crear el modal container si no existe
function ensureModalContainer() {
  if (!document.getElementById('modal-container')) {
    const container = document.createElement('div');
    container.id = 'modal-container';
    container.style.cssText = `
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    `;
    document.body.appendChild(container);
  }
}

// Mostrar modal
function showModal(content) {
  ensureModalContainer();
  const container = document.getElementById('modal-container');
  container.innerHTML = content;
  container.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Cerrar modal
function hideModal() {
  const container = document.getElementById('modal-container');
  if (container) {
    container.style.display = 'none';
    container.innerHTML = '';
  }
  document.body.style.overflow = '';
}

// Crear modal header
function createModalHeader(title, onClose) {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; font-size: 1.3rem; font-weight: 700;">${title}</h3>
      <button onclick="${onClose}" style="background: none; border: none; cursor: pointer; padding: 0.25rem; color: var(--text-muted);">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;
}

// ============================================================================
// ADDRESS MODAL
// ============================================================================

let currentAddressId = null;

function openAddressModal(address = null) {
  currentAddressId = address ? address.id : null;
  
  const addressData = address || {
    recipientName: '',
    addressLine: '',
    city: '',
    country: 'Colombia',
    postalCode: '',
    phone: '',
    isDefault: false
  };

  const modalContent = `
    <div style="background: white; padding: 2rem; border-radius: 16px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
      ${createModalHeader(currentAddressId ? 'Editar Dirección' : 'Agregar Nueva Dirección', 'hideAddressModal()')}
      
      <form onsubmit="saveAddress(event)" id="address-form">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Nombre del destinatario *</label>
          <input 
            type="text" 
            id="modal-recipient-name"
            value="${addressData.recipientName || ''}"
            required
            style="width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem;"
          />
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Dirección *</label>
          <input 
            type="text" 
            id="modal-address-line"
            value="${addressData.addressLine || addressData.address || ''}"
            required
            style="width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem;"
          />
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Ciudad *</label>
          <input 
            type="text" 
            id="modal-city"
            value="${addressData.city || ''}"
            required
            style="width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem;"
          />
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">País</label>
            <input 
              type="text" 
              id="modal-country"
              value="${addressData.country || 'Colombia'}"
              style="width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem;"
            />
          </div>
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Código Postal</label>
            <input 
              type="text" 
              id="modal-postal-code"
              value="${addressData.postalCode || ''}"
              style="width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem;"
            />
          </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
            <input 
              type="checkbox" 
              id="modal-is-default"
              ${addressData.isDefault ? 'checked' : ''}
              style="width: 18px; height: 18px; accent-color: var(--secondary);"
            />
            <span style="font-weight: 600; color: var(--text-dark);">Establecer como dirección predeterminada</span>
          </label>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button 
            type="button" 
            onclick="hideAddressModal()" 
            style="padding: 12px 24px; border: 1px solid var(--border-color); background: white; color: var(--text-dark); border-radius: 8px; cursor: pointer; font-weight: 600;"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            style="padding: 12px 24px; background: var(--secondary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;"
          >
            ${currentAddressId ? 'Guardar Cambios' : 'Agregar Dirección'}
          </button>
        </div>
      </form>
    </div>
  `;

  showModal(modalContent);
  
  // Auto-enfocar el primer campo
  setTimeout(() => {
    document.getElementById('modal-recipient-name')?.focus();
  }, 100);
}

function hideAddressModal() {
  hideModal();
  currentAddressId = null;
}

async function saveAddress(event) {
  event.preventDefault();
  
  const recipientName = document.getElementById('modal-recipient-name').value.trim();
  const addressLine = document.getElementById('modal-address-line').value.trim();
  const city = document.getElementById('modal-city').value.trim();
  const country = document.getElementById('modal-country').value.trim();
  const postalCode = document.getElementById('modal-postal-code').value.trim();
  const isDefault = document.getElementById('modal-is-default').checked;

  if (!recipientName || !addressLine || !city) {
    showModernToast('Por favor completa los campos obligatorios', 'error');
    return;
  }

  try {
    const addressData = {
      recipientName,
      address: addressLine,
      addressLine,
      city,
      country,
      postalCode: postalCode || null,
      isDefault
    };

    if (currentAddressId) {
      // Update existing address
      await window.API.addresses.update(currentAddressId, addressData);
      showModernToast('Dirección actualizada con éxito', 'success');
    } else {
      // Create new address
      await window.API.addresses.create(addressData);
      showModernToast('Dirección agregada con éxito', 'success');
    }

    hideAddressModal();
    await renderAddresses(document.querySelector('#account-tab-panel'));
  } catch (error) {
    const errorMessage = error.message || 'Error al guardar la dirección';
    showModernToast(`Error: ${errorMessage}`, 'error');
  }
}

async function editAddress(addressId) {
  try {
    const address = await window.API.addresses.getById(addressId);
    openAddressModal(address);
  } catch (error) {
    showModernToast('Error al cargar la dirección', 'error');
  }
}

async function deleteAddress(addressId, event) {
  event?.stopPropagation();
  
  showModernConfirm(
    '¿Estás seguro de que deseas eliminar esta dirección?',
    async function() {
      try {
        await window.API.addresses.delete(addressId);
        showModernToast('Dirección eliminada con éxito', 'success');
        await renderAddresses(document.querySelector('#account-tab-panel'));
      } catch (error) {
        showModernToast('Error al eliminar la dirección', 'error');
      }
    }
  );
}

async function setDefaultAddress(addressId, event) {
  event?.stopPropagation();
  
  try {
    await window.API.addresses.setDefault(addressId);
    showModernToast('Dirección establecida como predeterminada', 'success');
    await renderAddresses(document.querySelector('#account-tab-panel'));
  } catch (error) {
    showModernToast('Error al establecer dirección predeterminada', 'error');
  }
}

// ============================================================================
// PAYMENT METHOD MODAL
// ============================================================================

let currentPaymentMethodId = null;

function openPaymentMethodModal(method = null) {
  currentPaymentMethodId = method ? method.id : null;
  
  const methodData = method || {
    cardType: 'CREDIT_CARD',
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    isDefault: false
  };

  const cardTypes = [
    { value: 'CREDIT_CARD', label: 'Tarjeta de Crédito' },
    { value: 'DEBIT_CARD', label: 'Tarjeta Débito' },
    { value: 'VISA', label: 'Visa' },
    { value: 'MASTERCARD', label: 'Mastercard' },
    { value: 'AMEX', label: 'American Express' }
  ];

  const cardTypeOptions = cardTypes.map(ct => 
    `<option value="${ct.value}" ${methodData.cardType === ct.value ? 'selected' : ''}>${ct.label}</option>`
  ).join('');

  const modalContent = `
    <div style="background: white; padding: 2rem; border-radius: 16px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
      ${createModalHeader(currentPaymentMethodId ? 'Editar Tarjeta' : 'Agregar Nueva Tarjeta', 'hidePaymentMethodModal()')}
      
      <form onsubmit="savePaymentMethod(event)" id="payment-method-form">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Tipo de tarjeta *</label>
          <select 
            id="modal-card-type"
            required
            style="width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem;"
          >
            ${cardTypeOptions}
          </select>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Número de tarjeta *</label>
          <input 
            type="text" 
            id="modal-card-number"
            value="${methodData.cardNumber || ''}"
            placeholder="1234 5678 9012 3456"
            required
            style="width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem;"
            maxlength="19"
          />
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Nombre del titular *</label>
          <input 
            type="text" 
            id="modal-card-holder"
            value="${methodData.cardHolderName || ''}"
            required
            style="width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem;"
          />
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Fecha de expiración *</label>
          <input 
            type="text" 
            id="modal-expiry-date"
            value="${methodData.expiryDate || ''}"
            placeholder="MM/AA"
            required
            style="width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem;"
            maxlength="5"
          />
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
            <input 
              type="checkbox" 
              id="modal-method-is-default"
              ${methodData.isDefault ? 'checked' : ''}
              style="width: 18px; height: 18px; accent-color: var(--secondary);"
            />
            <span style="font-weight: 600; color: var(--text-dark);">Establecer como método de pago predeterminado</span>
          </label>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button 
            type="button" 
            onclick="hidePaymentMethodModal()" 
            style="padding: 12px 24px; border: 1px solid var(--border-color); background: white; color: var(--text-dark); border-radius: 8px; cursor: pointer; font-weight: 600;"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            style="padding: 12px 24px; background: var(--secondary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;"
          >
            ${currentPaymentMethodId ? 'Guardar Cambios' : 'Agregar Tarjeta'}
          </button>
        </div>
      </form>
    </div>
  `;

  showModal(modalContent);
  
  // Auto-formatear número de tarjeta
  const cardNumberInput = document.getElementById('modal-card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
      let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formatted.substring(0, 19);
    });
  }
  
  // Auto-formatear fecha de expiración
  const expiryInput = document.getElementById('modal-expiry-date');
  if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }
  
  setTimeout(() => {
    document.getElementById('modal-card-number')?.focus();
  }, 100);
}

function hidePaymentMethodModal() {
  hideModal();
  currentPaymentMethodId = null;
}

async function savePaymentMethod(event) {
  event.preventDefault();
  
  const cardType = document.getElementById('modal-card-type').value;
  const cardNumber = document.getElementById('modal-card-number').value.replace(/\s/g, '');
  const cardHolderName = document.getElementById('modal-card-holder').value.trim();
  const expiryDate = document.getElementById('modal-expiry-date').value.trim();
  const isDefault = document.getElementById('modal-method-is-default').checked;

  if (!cardType || !cardNumber || !cardHolderName || !expiryDate) {
    showModernToast('Por favor completa todos los campos', 'error');
    return;
  }

  if (cardNumber.length < 13 || cardNumber.length > 19) {
    showModernToast('Número de tarjeta inválido', 'error');
    return;
  }

  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    showModernToast('Fecha de expiración inválida. Usa formato MM/AA', 'error');
    return;
  }

  try {
    const methodData = {
      cardType,
      cardNumber,
      cardHolderName,
      expiryDate,
      isDefault
    };

    if (currentPaymentMethodId) {
      // Update existing method
      await window.API.paymentMethods.update(currentPaymentMethodId, methodData);
      showModernToast('Tarjeta actualizada con éxito', 'success');
    } else {
      // Create new method
      await window.API.paymentMethods.create(methodData);
      showModernToast('Tarjeta agregada con éxito', 'success');
    }

    hidePaymentMethodModal();
    await renderPaymentMethods(document.querySelector('#account-tab-panel'));
  } catch (error) {
    const errorMessage = error.message || 'Error al guardar la tarjeta';
    showModernToast(`Error: ${errorMessage}`, 'error');
  }
}

async function editPaymentMethod(methodId, event) {
  event?.stopPropagation();
  
  try {
    const method = await window.API.paymentMethods.getById(methodId);
    openPaymentMethodModal(method);
  } catch (error) {
    showModernToast('Error al cargar la tarjeta', 'error');
  }
}

async function deletePaymentMethod(methodId, event) {
  event?.stopPropagation();
  
  showModernConfirm(
    '¿Estás seguro de que deseas eliminar esta tarjeta?',
    async function() {
      try {
        await window.API.paymentMethods.delete(methodId);
        showModernToast('Tarjeta eliminada con éxito', 'success');
        await renderPaymentMethods(document.querySelector('#account-tab-panel'));
      } catch (error) {
        showModernToast('Error al eliminar la tarjeta', 'error');
      }
    }
  );
}

async function setDefaultPaymentMethod(methodId, event) {
  event?.stopPropagation();
  
  try {
    await window.API.paymentMethods.setDefault(methodId);
    showModernToast('Tarjeta establecida como predeterminada', 'success');
    await renderPaymentMethods(document.querySelector('#account-tab-panel'));
  } catch (error) {
    showModernToast('Error al establecer tarjeta predeterminada', 'error');
  }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

// Exportar funciones para que sean accesibles globalmente
window.perfilHandlers = {
  openAddressModal,
  hideAddressModal,
  saveAddress,
  editAddress,
  deleteAddress,
  setDefaultAddress,
  openPaymentMethodModal,
  hidePaymentMethodModal,
  savePaymentMethod,
  editPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod
};
