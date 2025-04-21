// Authentication Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'server' | 'chef';
  name: string;
}

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  image_url?: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

// Table Types
export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  server_id?: string;
}

// Order Types
export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  menuItem?: MenuItem;
}

export interface Order {
  id: string;
  table_id: string;
  server_id: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  total: number;
  items: OrderItem[];
  table?: Table;
}

// Reservation Types
export interface Reservation {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  party_size: number;
  date: string;
  time: string;
  notes?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  table_id?: string;
}

// Inventory Types
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  alert_threshold: number;
  cost_per_unit: number;
  last_restocked: string;
}

// Statistics Types
export interface DailySales {
  date: string;
  total: number;
  order_count: number;
}

export interface PopularDish {
  menu_item_id: string;
  name: string;
  quantity_sold: number;
  revenue: number;
}