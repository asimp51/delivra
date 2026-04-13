export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  avatar_url?: string;
  role: 'customer' | 'vendor_owner' | 'rider' | 'admin';
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  icon_url?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  metadata: Record<string, any>;
  children?: Category[];
  attributes?: CategoryAttribute[];
}

export interface CategoryAttribute {
  id: string;
  category_id: string;
  attribute_name: string;
  attribute_type: 'text' | 'number' | 'boolean' | 'select' | 'multi_select';
  options: string[];
  is_required: boolean;
  sort_order: number;
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  cover_image_url?: string;
  category: Category;
  avg_rating: number;
  total_ratings: number;
  is_open: boolean;
  is_verified: boolean;
  is_active: boolean;
  commission_rate: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer: User;
  vendor: Vendor;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

export type OrderStatus =
  | 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup'
  | 'rider_assigned' | 'picked_up' | 'in_transit' | 'delivered'
  | 'cancelled' | 'refunded';

export interface Rider {
  id: string;
  user: User;
  vehicle_type: 'bicycle' | 'motorcycle' | 'car';
  is_online: boolean;
  is_on_delivery: boolean;
  avg_rating: number;
  total_deliveries: number;
  wallet_balance: number;
}

export interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_delivery';
  value: number;
  min_order_amount: number;
  max_discount?: number;
  max_uses?: number;
  used_count: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
}
