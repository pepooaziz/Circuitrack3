-- 1. Vendors Table
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  company_name text not null,
  logo_url text,
  country text,
  bio text,
  status text default 'pending' check (status in ('pending', 'active', 'suspended', 'rejected')),
  unique(user_id)
);

-- 2. Vendor Earnings Table
create table if not exists vendor_earnings (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade not null,
  order_id uuid, -- Reference to orders table if exists later
  amount numeric(10,2) not null,
  description text,
  created_at timestamp with time zone default now()
);

-- 3. Payout Requests Table
create table if not exists payout_requests (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade not null,
  amount numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'paid', 'rejected')),
  admin_note text,
  created_at timestamp with time zone default now()
);

-- 4. Boost Campaigns Table
create table if not exists boost_campaigns (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  campaign_type text check (campaign_type in ('7_days', '14_days', '30_days')),
  start_date timestamp with time zone default now(),
  end_date timestamp with time zone,
  status text default 'active' check (status in ('active', 'expired', 'cancelled')),
  created_at timestamp with time zone default now()
);

-- 5. Row Level Security Models (RLS) - Basic Setup
alter table vendors enable row level security;
alter table vendor_earnings enable row level security;
alter table payout_requests enable row level security;
alter table boost_campaigns enable row level security;

-- Policies (Simplified for demo, production needs strict checks)
-- Vendors can view/edit their own profile
create policy "Vendors manage own profile" on vendors
  for all using (auth.uid() = user_id);

-- Vendors can view their own earnings
create policy "Vendors view own earnings" on vendor_earnings
  for select using (
    exists (select 1 from vendors where id = vendor_earnings.vendor_id and user_id = auth.uid())
  );

-- Vendors can manage their own products (Assuming products table has vendor_id)
-- Note: Assuming products table already has RLS enabled or will be
create policy "Vendors manage own products" on products
  for all using (
    exists (select 1 from vendors where id = products.vendor_id and user_id = auth.uid())
  );
