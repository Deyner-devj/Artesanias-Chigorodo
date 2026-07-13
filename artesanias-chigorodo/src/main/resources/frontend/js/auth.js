// js/auth.js

// Mock test credentials
const TEST_USERS = [
  { email: 'cliente@chigorodo.test', password: 'Cliente123', name: 'Juan Pérez', role: 'cliente', id: 'client-test' },
  { email: 'vendedor@chigorodo.test', password: 'Vendedor123', name: 'María Elena', role: 'vendedor', id: 'seller-test' },
  { email: 'admin@chigorodo.test', password: 'Admin123', name: 'Admin Chigorodó', role: 'admin', id: 'admin-test' }
];

function loginUser(email, password) {
  const normalizedEmail = email.toLowerCase().trim();
  
  // 1. Check test users
  const testUser = TEST_USERS.find(u => u.email === normalizedEmail && u.password === password);
  if (testUser) {
    const sessionUser = { id: testUser.id, name: testUser.name, email: testUser.email, role: testUser.role };
    localStorage.setItem('user', JSON.stringify(sessionUser));
    return sessionUser;
  }
  
  // 2. Check registered users in localStorage
  const registeredUsersStr = localStorage.getItem('registered_users');
  if (registeredUsersStr) {
    try {
      const users = JSON.parse(registeredUsersStr);
      const user = users.find(u => u.email.toLowerCase().trim() === normalizedEmail && u.password === password);
      if (user) {
        const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role || 'cliente' };
        localStorage.setItem('user', JSON.stringify(sessionUser));
        return sessionUser;
      }
    } catch (e) {
      console.error("Error checking registered users", e);
    }
  }

  // 3. Fallback behavior (like original React code: always log in as guest if not found)
  const guestUser = {
    id: 'guest-' + Date.now(),
    name: email.split('@')[0],
    email: email,
    role: 'cliente'
  };
  localStorage.setItem('user', JSON.stringify(guestUser));
  return guestUser;
}

function registerUser(name, email, password) {
  const registeredUsersStr = localStorage.getItem('registered_users');
  let users = [];
  if (registeredUsersStr) {
    try {
      users = JSON.parse(registeredUsersStr);
    } catch (e) {}
  }
  
  // Check if already exists
  const exists = users.some(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (exists) {
    return false;
  }

  const newUser = {
    id: 'user-' + Date.now(),
    name: name,
    email: email.toLowerCase().trim(),
    password: password,
    role: 'cliente' // default role
  };

  users.push(newUser);
  localStorage.setItem('registered_users', JSON.stringify(users));
  return true;
}

function getLoggedInUser() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function logoutUser() {
  localStorage.removeItem('user');
}
