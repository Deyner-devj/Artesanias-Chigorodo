// js/artesano/perfil-artesano.js
// Gestiona el perfil del artesano

let currentUser = null;

async function init() {
  try {
    // Obtener el usuario actual
    currentUser = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    
    if (!currentUser) {
      if (window.UF) {
        window.UF.showToast('No se pudo obtener tu información de perfil. Inicia sesión de nuevo.', 'error');
      }
      return;
    }

    // Cargar datos del perfil
    await loadProfileData();
    setupFormHandlers();
    
  } catch (error) {
    console.error('Error al inicializar perfil del artesano:', error);
    if (window.UF) {
      window.UF.showToast('Error al cargar el perfil. Intenta de nuevo.', 'error');
    }
  }
}

async function loadProfileData() {
  try {
    // Obtener perfil del usuario
    const profile = await API.users.getProfile();
    
    if (!profile) {
      throw new Error('Perfil no encontrado');
    }

    // Obtener perfil de artesano si existe
    let artisanProfile = null;
    try {
      artisanProfile = await API.artisans.getById(currentUser.id);
    } catch (e) {
      // Si no es artesano o no tiene perfil de artesano, usar datos del usuario
      console.log('No se encontró perfil de artesano, usando datos de usuario');
    }

    // Llenar el formulario con los datos
    const form = document.querySelector('form');
    if (!form) return;

    // Obtener todos los inputs
    const inputs = form.querySelectorAll('input[type="text"], textarea');
    
    // Mapear datos del perfil
    const profileData = artisanProfile || profile;
    
    // Llenar campo de nombre de marca/artesano
    const brandNameInput = inputs[0]; // Primer input es el nombre de marca
    if (brandNameInput) {
      brandNameInput.value = profileData.fullName || profileData.name || 'Asociación Artesanal Chigorodó';
    }

    // Llenar biografía
    const bioTextarea = form.querySelector('textarea');
    if (bioTextarea) {
      bioTextarea.value = artisanProfile?.bio || profile.bio || 'Somos tejedores dedicados a salvaguardar y expandir el patrimonio cultural de las mochilas tejidas tradicionales en Chigorodó.';
    }

  } catch (error) {
    console.error('Error al cargar datos del perfil:', error);
    if (window.UF) {
      window.UF.showToast('Error al cargar datos del perfil. Intenta de nuevo.', 'error');
    }
  }
}

function setupFormHandlers() {
  const form = document.querySelector('form');
  if (!form) return;

  // Reemplazar el onsubmit del HTML
  form.onsubmit = async (event) => {
    event.preventDefault();
    await handleProfileUpdate(event);
  };
}

async function handleProfileUpdate(event) {
  const form = event.target;
  const formData = new FormData(form);
  
  // Extraer datos del formulario
  const inputs = form.querySelectorAll('input[type="text"], textarea');
  const brandNameInput = inputs[0];
  const bioTextarea = form.querySelector('textarea');

  const profileData = {
    fullName: brandNameInput?.value || '',
    bio: bioTextarea?.value || '',
  };

  // Validar
  if (!profileData.fullName || profileData.fullName.trim() === '') {
    if (window.UF) window.UF.showToast('El nombre es obligatorio', 'error');
    return;
  }

  try {
    // Actualizar perfil de usuario
    await API.users.updateProfile(profileData);

    // Si hay perfil de artesano, actualizarlo también
    try {
      await API.artisans.update(currentUser.id, {
        bio: profileData.bio,
        displayName: profileData.fullName
      });
    } catch (e) {
      console.log('No se pudo actualizar perfil de artesano, solo se actualizó perfil de usuario');
    }

    if (window.UF) {
      window.UF.showToast('¡Perfil público actualizado con éxito!', 'success');
    }
    
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    if (window.UF) {
      window.UF.showToast(`Error al guardar perfil: ${error.message || 'Intenta de nuevo'}`, 'error');
    }
  }
}

// Exponer el módulo
window.PerfilArtesanoJS = { init };
