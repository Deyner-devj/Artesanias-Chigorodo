async function loadAdminUsers() {
  const body = document.getElementById('users-table-body');
  if (!body) return;
  try {
    const users = await window.API.users.getAll();
    body.innerHTML = users.map((user) => {
      const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      return `<tr><td class="font-semibold">${user.fullName}</td><td>${user.email}</td><td><span class="badge badge-info">${user.role}</span></td><td><span class="badge ${user.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}">${user.status}</span></td><td class="row-actions"><button class="icon-btn" onclick="changeUserStatus(${user.id}, '${nextStatus}')">${nextStatus === 'ACTIVE' ? 'Activar' : 'Suspender'}</button></td></tr>`;
    }).join('') || '<tr><td colspan="5">No hay usuarios registrados.</td></tr>';
  } catch (error) {
    body.innerHTML = `<tr><td colspan="5">No fue posible cargar usuarios: ${error.message}</td></tr>`;
  }
}
async function changeUserStatus(id, status) {
  await window.API.users.updateStatus(id, status);
  await loadAdminUsers();
}
document.addEventListener('DOMContentLoaded', loadAdminUsers);
