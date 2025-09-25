// Shared type definitions for the frontend

// User Profile (from profiles table)
export interface UserProfile {
  id: string; // UUID
  username: string;
  role: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  user_type: 'admin' | 'owner' | 'renter' | 'guest';
  created_at: string;
  updated_at: string;
}

// Legacy User interface for backward compatibility
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

// Property interface matching database schema
export interface Property {
  id: number;
  title: string;
  description: string;
  price: number; // Monthly rent in Thai Baht
  location: string; // Full address
  property_type: 'apartment' | 'studio' | 'house' | 'condo' | 'villa';
  bedrooms: number;
  bathrooms: number;
  area_sqm: number; // Area in square meters
  amenities: string[];
  images: string[];
  is_available: boolean;
  owner_id: string; // UUID reference to profiles
  created_at: string;
  updated_at: string;
}

// Legacy PropertySummary for backward compatibility
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

// Tour Request interface
export interface TourRequest {
  id: number;
  property_id: number;
  requester_id: string; // UUID reference to profiles
  owner_id: string; // UUID reference to profiles
  requested_date: string;
  requested_time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  contact_method: 'phone' | 'email' | 'message';
  requester_name: string;
  requester_phone?: string;
  requester_email: string;
  created_at: string;
  updated_at: string;
}

// Property Review interface (simplified, not tied to bookings)
export interface PropertyReview {
  id: number;
  property_id: number;
  reviewer_id: string; // UUID reference to profiles
  rating: number; // 1-5 stars
  review_text?: string;
  reviewer_name: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Tour Notification interface
export interface TourNotification {
  id: number;
  tour_request_id: number;
  recipient_id: string; // UUID reference to profiles
  message: string;
  is_read: boolean;
  notification_type: 'tour_request' | 'tour_confirmed' | 'tour_cancelled' | 'tour_completed';
  created_at: string;
}

// Review interface (legacy - now replaced by PropertyReview)
export interface Review {
  id: number;
  property_id: number;
  reviewer_id: string; // UUID reference to profiles
  rating: number; // 1-5 stars
  comment: string;
  created_at: string;
}

// Favorites interface
export interface Favorite {
  id: number;
  user_id: string; // UUID reference to profiles
  property_id: number;
  created_at: string;
}

// Message interface
export interface Message {
  id: number;
  sender_id: string; // UUID reference to profiles
  recipient_id: string; // UUID reference to profiles
  property_id?: number; // Optional reference to property
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
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