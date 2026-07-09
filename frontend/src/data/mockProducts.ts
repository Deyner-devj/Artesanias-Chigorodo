import type { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Mochila Wayuu Colores del Sol',
    description: 'Mochila tejida a mano por artesanos de la comunidad Wayuu en La Guajira. Diseño único con colores vibrantes, ideal para llevar tu historia a cualquier parte.',
    price: 280000,
    image: '/assets/producto-mochila-wayuu-1.png',
    category: 'Tejidos',
    sellerName: 'Tejidos del Sol',
    stock: 15,
    rating: 4.8,
    reviewsCount: 36
  },
  {
    id: '2',
    name: 'Jarrón de Barro Negro',
    description: 'Jarrón de cerámica de barro negro elaborado a mano y pulido con piedra por artesanos en La Chamba, Tolima. Una pieza única que aporta elegancia y tradición a tu hogar.',
    price: 120000,
    image: '/assets/jarron_barro.png',
    category: 'Cerámica',
    sellerName: 'Barro Ancestral',
    stock: 8,
    rating: 4.9,
    reviewsCount: 14
  },
  {
    id: '3',
    name: 'Individual Tejido Multicolor (x2)',
    description: 'Set de dos individuales redondos tejidos a mano en fibra de palma de iraca. Ideales para decorar tu mesa con un estilo fresco, rústico y sumamente tradicional.',
    price: 45000,
    image: '/assets/individual_tejido.png',
    category: 'Hogar y Decoración',
    sellerName: 'Manos de Colombia',
    stock: 24,
    rating: 4.7,
    reviewsCount: 22
  },
  {
    id: '4',
    name: 'Hamaca San Jacinto',
    description: 'Hamaca tradicional tejida en telar vertical por artesanas de San Jacinto, Bolívar. Súper resistente, cómoda y con diseños tradicionales de franjas de colores vivos.',
    price: 350000,
    image: '/assets/categoria-tejidos.png',
    category: 'Tejidos',
    sellerName: 'Tejedoras de San Jacinto',
    stock: 5,
    rating: 5.0,
    reviewsCount: 8
  },
  {
    id: '5',
    name: 'Sombrero Vueltiao Zenú',
    description: 'Sombrero vueltiao original de 21 vueltas, elaborado a mano con fibra de caña flecha. Símbolo nacional de la cultura colombiana, trenzado con maestría en Tuchín, Córdoba.',
    price: 180000,
    image: '/assets/categoria-accesorios.png',
    category: 'Accesorios',
    sellerName: 'Artesanías Zenú',
    stock: 12,
    rating: 4.9,
    reviewsCount: 45
  },
  {
    id: '6',
    name: 'Aretes de Filigrana Momposina',
    description: 'Elegantes aretes de filigrana hechos a mano en plata de ley por maestros joyeros en Mompox. Diseños intrincados inspirados en la naturaleza colombiana.',
    price: 150000,
    image: '/assets/categoria-joyeria.png',
    category: 'Joyería',
    sellerName: 'Orfebrería Momposina',
    stock: 10,
    rating: 4.6,
    reviewsCount: 19
  }
];