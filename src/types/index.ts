// Shared type definitions for the frontend
export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PropertySummary {
  id: number;
  title: string;
  location?: string;
  city?: string;
  state?: string;
  price?: number;
  monthlyRent?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  area?: number | string;
  status?: string;
  propertyType?: string;
  imageUrl?: string;
  listedAt?: string;
  owner_id?: number;
}

export interface APIResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  size: number;
}