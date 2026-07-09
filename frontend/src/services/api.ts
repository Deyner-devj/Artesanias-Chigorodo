import axios from 'axios';
import type { Product, NewUser, LoginRequest } from '../types';

const api = axios.create({ baseURL: '/api' });

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const login = async (data: LoginRequest) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: NewUser) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};