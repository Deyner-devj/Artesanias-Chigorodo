import axios from 'axios';
import type { LoginRequest, NewUser, User } from '../types';

const api = axios.create({ baseURL: '/api' });

const fallbackUser = (payload: { name?: string; email: string }): User => ({
  id: 'guest',
  name: payload.name ?? payload.email.split('@')[0],
  email: payload.email
});

export const loginApi = async (data: LoginRequest): Promise<User> => {
  try {
    const response = await api.post<User>('/auth/login', data);
    return response.data;
  } catch (error) {
    return fallbackUser({ email: data.email });
  }
};

export const registerApi = async (data: NewUser): Promise<User> => {
  try {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  } catch (error) {
    return fallbackUser({ name: data.name, email: data.email });
  }
};