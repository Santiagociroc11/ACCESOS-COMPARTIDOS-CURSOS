export interface Account {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  requiresDynamicPin: boolean;
  createdAt: string;
  category: string;
}

export interface PinResponse {
  row_number: number;
  TIMESTAMP: number;
  CODIGO: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

export const PREDEFINED_CATEGORIES: Category[] = [
  {
    id: 'trabajo',
    name: 'Trabajo',
    icon: 'Briefcase',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    description: 'Cuentas relacionadas con el trabajo'
  },
  {
    id: 'educacion',
    name: 'Educación',
    icon: 'GraduationCap',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    description: 'Cursos, academias y plataformas educativas'
  },
  {
    id: 'finanzas',
    name: 'Finanzas',
    icon: 'CreditCard',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'Bancos, inversiones y finanzas'
  },
  {
    id: 'redes-sociales',
    name: 'Redes Sociales',
    icon: 'Users',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    description: 'Facebook, Instagram, Twitter, etc.'
  },
  {
    id: 'entretenimiento',
    name: 'Entretenimiento',
    icon: 'Play',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    description: 'Netflix, Spotify, juegos, etc.'
  },
  {
    id: 'compras',
    name: 'Compras',
    icon: 'ShoppingBag',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    description: 'E-commerce y tiendas online'
  },
  {
    id: 'desarrollo',
    name: 'Desarrollo',
    icon: 'Code',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    description: 'GitHub, hosting, herramientas dev'
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: 'User',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    description: 'Cuentas personales y privadas'
  },
  {
    id: 'salud',
    name: 'Salud',
    icon: 'Heart',
    color: 'text-pink-700',
    bgColor: 'bg-pink-100',
    description: 'Apps de salud y bienestar'
  },
  {
    id: 'otros',
    name: 'Otros',
    icon: 'MoreHorizontal',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    description: 'Otras categorías'
  }
];