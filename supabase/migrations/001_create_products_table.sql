-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- Create Vendors Table (Simplified placeholder if not exists, strictly for reference)
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  created_at timestamp with time zone default now()
);

-- 1. Products Table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  -- Basic Info
  name text not null,
  description text,
  category text,
  images text[] default '{}',

  -- Pricing
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  currency text default 'USD',

  -- Condition & Used Rating
  is_used boolean default false,
  condition_rating int check (condition_rating between 1 and 5),
  usage_duration_months int,

  -- Trade Pricing (Vendor-Only)
  has_trade_price boolean default false,
  trade_price numeric(10,2),

  -- Vendor Earnings
  vendor_earnings numeric(10,2) default 0,

  -- Status
  status text default 'approved'
    check (status in ('pending','approved','rejected'))
);

-- 2. Indexes for faster filtering
create index if not exists products_price_idx on products(price);
create index if not exists products_is_used_idx on products(is_used);
create index if not exists products_category_idx on products(category);
create index if not exists products_status_idx on products(status);

-- 3. Mock Data Seeder (Optional: Run to get test data)
/*
insert into vendors (name) values ('CircuitTech Solutions');

insert into products (vendor_id, name, description, price, category, is_used, condition_rating, images)
select 
  (select id from vendors limit 1),
  'Professional Oscilloscope 500MHz', 
  'High precision digital oscilloscope for lab use.', 
  1250.00, 
  'Test Equipment', 
  false, 
  null, 
  ARRAY['https://placehold.co/600x400/2563eb/white?text=Oscilloscope']
union all
select 
  (select id from vendors limit 1),
  'Used FPGA Development Board', 
  'Slightly used dev board, perfect working condition.', 
  450.00, 
  'Development Boards', 
  true, 
  4, 
  ARRAY['https://placehold.co/600x400/2563eb/white?text=FPGA+Board'];
*/
