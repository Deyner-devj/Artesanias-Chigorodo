export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
