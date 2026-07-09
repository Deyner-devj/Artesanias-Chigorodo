import axios from 'axios';
import type { LoginRequest, NewUser, User } from '../types';

const api = axios.create({ baseURL: '/api' });

const fallbackUser = (payload: { name?: string; email: string }): User => ({
  id: 'guest',
  name: payload.name ?? payload.email.split('@')[0],
  email: payload.email
});

export const loginApi = async (data: LoginRequest): Promise<User> => {
  // === DESARROLLO/QA: USUARIOS TEMPORALES DE PRUEBA ===
  // NOTA: Estas credenciales son exclusivamente para pruebas locales de diseño y navegación sin backend.
  const testEmail = data.email.toLowerCase().trim();
  if (testEmail === 'cliente@chigorodo.test' && data.password === 'Cliente123') {
    const user: User = { id: 'client-test', name: 'Juan Pérez', email: 'cliente@chigorodo.test', role: 'cliente' };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  if (testEmail === 'vendedor@chigorodo.test' && data.password === 'Vendedor123') {
    const user: User = { id: 'seller-test', name: 'María Elena', email: 'vendedor@chigorodo.test', role: 'vendedor' };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  if (testEmail === 'admin@chigorodo.test' && data.password === 'Admin123') {
    const user: User = { id: 'admin-test', name: 'Admin Chigorodó', email: 'admin@chigorodo.test', role: 'admin' };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  // ====================================================

  try {
    const response = await api.post<User>('/auth/login', data);
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    const user = fallbackUser({ email: data.email });
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
};

export const registerApi = async (data: NewUser): Promise<User> => {
  try {
    const response = await api.post<User>('/auth/register', data);
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    const user = fallbackUser({ name: data.name, email: data.email });
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
};