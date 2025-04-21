/*
  # Restaurant Management Initial Schema

  1. Tables
    - `profiles` - Staff profiles linked to auth.users
    - `menu_items` - Restaurant menu items
    - `tables` - Restaurant tables
    - `orders` - Customer orders
    - `order_items` - Individual items in an order
    - `reservations` - Customer reservations
    - `inventory` - Restaurant inventory items

  2. Security
    - Row Level Security policies for each table
    - Role-based access control
*/

-- Create profiles table linked to auth users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'server', 'chef')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('appetizer', 'main', 'dessert', 'beverage')),
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Tables in the restaurant
CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL UNIQUE,
  capacity INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'occupied', 'reserved')) DEFAULT 'available',
  server_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES tables(id),
  server_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled')) DEFAULT 'open',
  total DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'preparing', 'ready', 'served')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  party_size INTEGER NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  table_id UUID REFERENCES tables(id),
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'completed')) DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  alert_threshold DECIMAL(10, 2) NOT NULL,
  cost_per_unit DECIMAL(10, 2) NOT NULL,
  last_restocked TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles - Admins can read all profiles, users can read their own
CREATE POLICY "Admins can manage all profiles"
  ON profiles
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view their own profiles"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Menu Items - All authenticated users can read, only admins can modify
CREATE POLICY "All authenticated users can read menu items"
  ON menu_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage menu items"
  ON menu_items
  USING (auth.jwt() ->> 'role' = 'admin');

-- Tables - All staff can read, only admins and servers can modify
CREATE POLICY "All authenticated users can read tables"
  ON tables
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and servers can update tables"
  ON tables
  FOR UPDATE
  USING (auth.jwt() ->> 'role' IN ('admin', 'server'));

CREATE POLICY "Admins can manage tables"
  ON tables
  USING (auth.jwt() ->> 'role' = 'admin');

-- Orders - All staff can read, admins and assigned servers can modify
CREATE POLICY "All authenticated users can read orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Servers can manage their own orders"
  ON orders
  USING (
    auth.jwt() ->> 'role' = 'server' AND
    server_id = auth.uid()
  );

CREATE POLICY "Admins can manage all orders"
  ON orders
  USING (auth.jwt() ->> 'role' = 'admin');

-- Order Items - All staff can read, chefs can update status, servers can add/modify their orders
CREATE POLICY "All authenticated users can read order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Chefs can update order item status"
  ON order_items
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'chef'
  )
  WITH CHECK (
    status IN ('preparing', 'ready')
  );

CREATE POLICY "Servers can update their order items"
  ON order_items
  USING (
    auth.jwt() ->> 'role' = 'server' AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.server_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items
  USING (auth.jwt() ->> 'role' = 'admin');

-- Reservations - Admins and servers can manage
CREATE POLICY "All authenticated users can read reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and servers can manage reservations"
  ON reservations
  USING (auth.jwt() ->> 'role' IN ('admin', 'server'));

-- Inventory - Admins and chefs can read/update
CREATE POLICY "Admins and chefs can read inventory"
  ON inventory
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('admin', 'chef'));

CREATE POLICY "Admins can manage inventory"
  ON inventory
  USING (auth.jwt() ->> 'role' = 'admin');

-- Fixed policy to allow chefs to update inventory
CREATE POLICY "Chefs can update inventory quantities"
  ON inventory
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'chef');

-- Create trigger function to enforce field-level restrictions for chef updates
CREATE OR REPLACE FUNCTION restrict_chef_inventory_updates()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user is a chef and is trying to modify restricted fields
  IF (SELECT auth.jwt() ->> 'role') = 'chef' THEN
    -- Only allow updating quantity and last_restocked fields
    IF (OLD.name != NEW.name) OR 
       (OLD.unit != NEW.unit) OR 
       (OLD.alert_threshold != NEW.alert_threshold) OR 
       (OLD.cost_per_unit != NEW.cost_per_unit) THEN
      RAISE EXCEPTION 'Chefs can only update quantity and last_restocked fields';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on inventory table
CREATE TRIGGER restrict_chef_inventory_updates_trigger
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION restrict_chef_inventory_updates();

-- Functions

-- Function to calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_id UUID) 
RETURNS DECIMAL AS $$
DECLARE
  total DECIMAL(10, 2);
BEGIN
  SELECT SUM(price * quantity) INTO total
  FROM order_items
  WHERE order_id = calculate_order_total.order_id;
  
  RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update order total when items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders
  SET total = calculate_order_total(NEW.order_id),
      updated_at = now()
  WHERE id = NEW.order_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_total();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the timestamp update triggers for all tables
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_menu_items_timestamp
BEFORE UPDATE ON menu_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_tables_timestamp
BEFORE UPDATE ON tables
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_order_items_timestamp
BEFORE UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_reservations_timestamp
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_inventory_timestamp
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();