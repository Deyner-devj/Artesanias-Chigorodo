// js/artesano/configuracion-artesano.js
// Gestiona la configuración del taller del artesano

let currentUser = null;

async function init() {
  try {
    // Obtener el usuario actual
    currentUser = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    
    if (!currentUser) {
      if (window.UF) {
        window.UF.showToast('No se pudo obtener tu información. Inicia sesión de nuevo.', 'error');
      }
      return;
    }

    // Cargar datos de configuración
    await loadConfigurationData();
    setupFormHandlers();
    
  } catch (error) {
    console.error('Error al inicializar configuración del artesano:', error);
    if (window.UF) {
      window.UF.showToast('Error al cargar la configuración. Intenta de nuevo.', 'error');
    }
  }
}

async function loadConfigurationData() {
  try {
    // Obtener perfil del artesano
    let artisanProfile = null;
    try {
      artisanProfile = await API.artisans.getById(currentUser.id);
    } catch (e) {
      console.log('No se encontró perfil de artesano extendido');
    }

    // Obtener perfil de usuario
    const userProfile = await API.users.getProfile();

    // Llenar el formulario con los datos disponibles
    const form = document.querySelector('form');
    if (!form) return;

    // Obtener todos los inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Datos del taller
    const data = artisanProfile || userProfile || {};
    
    // Mapear campos del formulario
    // Usamos nombres descriptivos para identificar los campos
    inputs.forEach(input => {
      const label = input.previousElementSibling || input.parentNode.querySelector('label');
      const fieldName = label?.textContent?.toLowerCase() || '';
      
      if (fieldName.includes('taller') || fieldName.includes('marca')) {
        input.value = data.displayName || data.fullName || 'Tejidos del Sol';
      } else if (fieldName.includes('responsable')) {
        input.value = data.fullName || 'María Elena Epieyu';
      } else if (fieldName.includes('especialidad')) {
        if (data.specialty) {
          const option = input.querySelector(`option[value="${data.specialty}"]`);
          if (option) option.selected = true;
        }
      } else if (fieldName.includes('ciudad') || fieldName.includes('región')) {
        input.value = data.location || data.city || 'Alta Guajira, La Guajira';
      } else if (fieldName.includes('historia')) {
        input.value = data.bio || data.history || 'Comunidad de tejedoras de la Alta Guajira dedicada a preservar las técnicas ancestrales del tejido Wayuu.';
      } else if (fieldName.includes('correo') && fieldName.includes('alertas')) {
        input.value = data.email || userProfile?.email || 'contacto@artesaniaschigorodo.com';
      } else if (fieldName.includes('teléfono') || fieldName.includes('whatsapp')) {
        input.value = data.phone || userProfile?.telephone || '+57 312 456 7890';
      } else if (fieldName.includes('documento') || fieldName.includes('nit')) {
        input.value = data.documentNumber || '';
      } else if (fieldName.includes('banco')) {
        input.value = data.bank || 'Bancolombia';
      } else if (fieldName.includes('número de cuenta')) {
        input.value = data.accountNumber || '***-****87-45';
      } else if (fieldName.includes('tiempo') && fieldName.includes('despacho')) {
        input.value = data.averageShippingTime || 3;
      } else if (fieldName.includes('ciudad de origen')) {
        input.value = data.shippingCity || 'Riohacha, La Guajira';
      }
    });

    // Marcar checkboxes de notificaciones
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const label = checkbox.nextElementSibling || checkbox.parentNode.querySelector('label');
      const labelText = label?.textContent?.toLowerCase() || '';
      
      // Por defecto, marcar las dos primeras como checked
      if (labelText.includes('pedido nuevo') || labelText.includes('notificación por correo')) {
        checkbox.checked = true;
      } else if (labelText.includes('whatsapp')) {
        checkbox.checked = true;
      }
    });

  } catch (error) {
    console.error('Error al cargar datos de configuración:', error);
    if (window.UF) {
      window.UF.showToast('Error al cargar configuración. Intenta de nuevo.', 'error');
    }
  }
}

function setupFormHandlers() {
  const form = document.querySelector('form');
  if (!form) return;

  // Reemplazar el onsubmit del HTML
  form.onsubmit = async (event) => {
    event.preventDefault();
    await handleConfigurationUpdate(event);
  };
}

async function handleConfigurationUpdate(event) {
  const form = event.target;
  const formData = new FormData(form);
  
  // Extraer datos del formulario
  const inputs = form.querySelectorAll('input:not([type="checkbox"]), select, textarea');
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');

  const configData = {};
  
  // Extraer campos de texto
  inputs.forEach(input => {
    const label = input.previousElementSibling || input.parentNode.querySelector('label');
    const fieldName = label?.textContent?.toLowerCase() || '';
    
    if (fieldName.includes('taller') || fieldName.includes('marca')) {
      configData.workshopName = input.value;
    } else if (fieldName.includes('responsable')) {
      configData.responsibleName = input.value;
    } else if (fieldName.includes('especialidad')) {
      configData.specialty = input.value;
    } else if (fieldName.includes('ciudad') || fieldName.includes('región')) {
      configData.location = input.value;
    } else if (fieldName.includes('historia')) {
      configData.bio = input.value;
    } else if (fieldName.includes('correo') && fieldName.includes('alertas')) {
      configData.notificationEmail = input.value;
    } else if (fieldName.includes('teléfono') || fieldName.includes('whatsapp')) {
      configData.phone = input.value;
    } else if (fieldName.includes('documento') || fieldName.includes('nit')) {
      configData.documentNumber = input.value;
    } else if (fieldName.includes('tipo de cuenta')) {
      configData.accountType = input.value;
    } else if (fieldName.includes('banco')) {
      configData.bank = input.value;
    } else if (fieldName.includes('número de cuenta')) {
      configData.accountNumber = input.value;
    } else if (fieldName.includes('tiempo') && fieldName.includes('despacho')) {
      configData.averageShippingTime = parseInt(input.value) || 3;
    } else if (fieldName.includes('ciudad de origen')) {
      configData.shippingCity = input.value;
    }
  });

  // Extraer preferencias de notificaciones
  configData.notifications = {};
  checkboxes.forEach(checkbox => {
    const label = checkbox.nextElementSibling || checkbox.parentNode.querySelector('label');
    const labelText = label?.textContent?.toLowerCase() || '';
    
    if (labelText.includes('correo') && labelText.includes('pedido nuevo')) {
      configData.notifications.emailNewOrder = checkbox.checked;
    } else if (labelText.includes('whatsapp') && labelText.includes('despachar')) {
      configData.notifications.whatsappReadyToShip = checkbox.checked;
    } else if (labelText.includes('resumen semanal')) {
      configData.notifications.weeklySummary = checkbox.checked;
    }
  });

  // Validar
  if (!configData.workshopName || configData.workshopName.trim() === '') {
    if (window.UF) window.UF.showToast('El nombre del taller es obligatorio', 'error');
    return;
  }

  try {
    // Actualizar perfil de artesano
    await API.artisans.update(currentUser.id, {
      displayName: configData.workshopName,
      bio: configData.bio,
      location: configData.location,
      specialty: configData.specialty,
      phone: configData.phone,
      email: configData.notificationEmail,
      documentNumber: configData.documentNumber,
      bank: configData.bank,
      accountNumber: configData.accountNumber,
      accountType: configData.accountType,
      averageShippingTime: configData.averageShippingTime,
      shippingCity: configData.shippingCity,
      notificationPreferences: configData.notifications
    });

    // Actualizar perfil de usuario con datos básicos
    await API.users.updateProfile({
      telephone: configData.phone,
      fullName: configData.responsibleName
    });

    if (window.UF) {
      window.UF.showToast('¡Configuraciones guardadas con éxito!', 'success');
    }
    
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    if (window.UF) {
      window.UF.showToast(`Error al guardar configuración: ${error.message || 'Intenta de nuevo'}`, 'error');
    }
  }
}

// Exponer el módulo
window.ConfiguracionArtesanoJS = { init };
