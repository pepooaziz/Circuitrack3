/*
  # Circuit Rack - Complete Database Schema
  
  1. Extensions
    - Enable pgvector for semantic search embeddings
    
  2. Enums
    - user_role: ADMIN, VENDOR, CUSTOMER
    - vendor_status: PENDING, ACTIVE, SUSPENDED
    - product_condition: NEW, LIKE_NEW, GOOD, FAIR
    - product_status: DRAFT, PENDING_APPROVAL, ACTIVE, SUSPENDED
    - order_status: PENDING, PAID, SHIPPED, COMPLETED, CANCELLED
    - payout_status: PENDING, PAID
    - trade_price_status: PENDING, APPROVED, REJECTED, ACTIVE
    - auction_status: DRAFT, PENDING_APPROVAL, ACTIVE, FINISHED, CANCELLED
    - campaign_type: FEATURED_7D, HOMEPAGE, CATEGORY_BOOST
    - campaign_status: PENDING, APPROVED, ACTIVE, EXPIRED, REJECTED
    - approval_target_type: AUCTION, TRADE_PRICE, CAMPAIGN, PRODUCT
    - approval_status: PENDING, APPROVED, REJECTED
    
  3. Tables
    - users: Core user authentication with roles
    - vendors: Vendor profiles linked to users
    - categories: Product categories with multilingual names
    - products: Products with multilingual fields and embeddings
    - product_images: Images for products
    - orders: Customer orders
    - order_items: Individual items in orders
    - payouts: Vendor payouts
    - trade_prices: Secondary market wholesale pricing (vendor-only)
    - auctions: Product auctions
    - auction_bids: Bids on auctions
    - promotion_campaigns: Promotional campaigns for products
    - admin_approvals: Approval workflow for auctions, trade prices, campaigns
    
  4. Security
    - RLS enabled on all tables
    - Policies for authenticated users based on roles
    - Vendor-only access to trade prices
    - Admin-only access to approvals
    
  5. Indexes
    - Foreign keys
    - Frequently filtered columns (status, role, etc.)
    - Vector similarity search on product embeddings
*/

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ADMIN', 'VENDOR', 'CUSTOMER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE vendor_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE product_condition AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payout_status AS ENUM ('PENDING', 'PAID');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE trade_price_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE auction_status AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'FINISHED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_type AS ENUM ('FEATURED_7D', 'HOMEPAGE', 'CATEGORY_BOOST');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('PENDING', 'APPROVED', 'ACTIVE', 'EXPIRED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE approval_target_type AS ENUM ('AUCTION', 'TRADE_PRICE', 'CAMPAIGN', 'PRODUCT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'CUSTOMER' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  company_name text NOT NULL,
  country text NOT NULL,
  contact_info text,
  status vendor_status DEFAULT 'PENDING' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  name_zh text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  name_zh text NOT NULL,
  description_ar text DEFAULT '' NOT NULL,
  description_en text DEFAULT '' NOT NULL,
  description_zh text DEFAULT '' NOT NULL,
  is_used boolean DEFAULT false NOT NULL,
  condition product_condition DEFAULT 'NEW' NOT NULL,
  usage_duration_months int,
  base_price decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  stock int DEFAULT 0 NOT NULL,
  legal_is_original boolean DEFAULT false NOT NULL,
  legal_ownership_pledge boolean DEFAULT false NOT NULL,
  embedding vector(1536),
  status product_status DEFAULT 'DRAFT' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  is_primary boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status order_status DEFAULT 'PENDING' NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity int NOT NULL,
  price_at_purchase decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Payouts table
CREATE TABLE IF NOT EXISTS payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  status payout_status DEFAULT 'PENDING' NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Trade prices table (secondary market)
CREATE TABLE IF NOT EXISTS trade_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  trade_price_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  min_order_qty int DEFAULT 1 NOT NULL,
  status trade_price_status DEFAULT 'PENDING' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Auctions table
CREATE TABLE IF NOT EXISTS auctions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  start_price decimal(10,2) NOT NULL,
  min_increment decimal(10,2) DEFAULT 1.00 NOT NULL,
  current_price decimal(10,2),
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  status auction_status DEFAULT 'DRAFT' NOT NULL,
  winner_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Auction bids table
CREATE TABLE IF NOT EXISTS auction_bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid REFERENCES auctions(id) ON DELETE CASCADE NOT NULL,
  bidder_user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Promotion campaigns table
CREATE TABLE IF NOT EXISTS promotion_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  type campaign_type NOT NULL,
  status campaign_status DEFAULT 'PENDING' NOT NULL,
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Admin approvals table
CREATE TABLE IF NOT EXISTS admin_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type approval_target_type NOT NULL,
  target_id uuid NOT NULL,
  status approval_status DEFAULT 'PENDING' NOT NULL,
  admin_id uuid REFERENCES users(id) ON DELETE SET NULL,
  comment text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for vendors
CREATE POLICY "Anyone can view active vendors"
  ON vendors FOR SELECT
  TO authenticated
  USING (status = 'ACTIVE');

CREATE POLICY "Vendors can view own profile"
  ON vendors FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Vendors can update own profile"
  ON vendors FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can create vendor profile"
  ON vendors FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for products
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated
  USING (status = 'ACTIVE');

CREATE POLICY "Vendors can view own products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
      AND vendors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- RLS Policies for product_images
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can manage own product images"
  ON product_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN vendors ON vendors.id = products.vendor_id
      WHERE products.id = product_images.product_id
      AND vendors.user_id = auth.uid()
    )
  );

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- RLS Policies for payouts
CREATE POLICY "Vendors can view own payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = payouts.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- RLS Policies for trade_prices (vendor-only access)
CREATE POLICY "Vendors can view trade prices"
  ON trade_prices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'VENDOR'
    )
  );

CREATE POLICY "Vendors can create trade prices for own products"
  ON trade_prices FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can update own trade prices"
  ON trade_prices FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = trade_prices.vendor_id
      AND vendors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- RLS Policies for auctions
CREATE POLICY "Anyone can view active auctions"
  ON auctions FOR SELECT
  TO authenticated
  USING (status IN ('ACTIVE', 'FINISHED'));

CREATE POLICY "Vendors can view own auctions"
  ON auctions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = auctions.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can create own auctions"
  ON auctions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can update own auctions"
  ON auctions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = auctions.vendor_id
      AND vendors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- RLS Policies for auction_bids
CREATE POLICY "Anyone can view auction bids"
  ON auction_bids FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create bids"
  ON auction_bids FOR INSERT
  TO authenticated
  WITH CHECK (bidder_user_id = auth.uid());

-- RLS Policies for promotion_campaigns
CREATE POLICY "Vendors can view own campaigns"
  ON promotion_campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = promotion_campaigns.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can create own campaigns"
  ON promotion_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can update own campaigns"
  ON promotion_campaigns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = promotion_campaigns.vendor_id
      AND vendors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- RLS Policies for admin_approvals (admin only)
CREATE POLICY "Admins can view all approvals"
  ON admin_approvals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage approvals"
  ON admin_approvals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_embedding ON products USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payouts_vendor_id ON payouts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_trade_prices_product_id ON trade_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_trade_prices_vendor_id ON trade_prices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_trade_prices_status ON trade_prices(status);
CREATE INDEX IF NOT EXISTS idx_auctions_product_id ON auctions(product_id);
CREATE INDEX IF NOT EXISTS idx_auctions_vendor_id ON auctions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_id ON auction_bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_bids_bidder_user_id ON auction_bids(bidder_user_id);
CREATE INDEX IF NOT EXISTS idx_promotion_campaigns_product_id ON promotion_campaigns(product_id);
CREATE INDEX IF NOT EXISTS idx_promotion_campaigns_vendor_id ON promotion_campaigns(vendor_id);
CREATE INDEX IF NOT EXISTS idx_promotion_campaigns_status ON promotion_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_admin_approvals_target_type_id ON admin_approvals(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_approvals_status ON admin_approvals(status);