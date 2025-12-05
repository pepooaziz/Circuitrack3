-- 1. Update products table for Auction support
alter table products
add column if not exists is_auction boolean default false,
add column if not exists auction_start_price numeric(10,2),
add column if not exists auction_current_price numeric(10,2),
add column if not exists auction_end_at timestamp with time zone,
add column if not exists auction_status text default 'none'
  check (auction_status in ('none','scheduled','running','ended'));

-- 2. Create Bids Table
create table if not exists bids (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references auth.users(id), -- Assuming Supabase Auth
  bid_amount numeric(10,2) not null,
  created_at timestamp with time zone default now()
);

-- Index for faster bid retrieval
create index if not exists bids_product_id_idx on bids(product_id);
create index if not exists bids_created_at_idx on bids(created_at);

-- 3. Auction Events Log (Optional)
create table if not exists auction_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  event_type text,
  event_data jsonb,
  created_at timestamp with time zone default now()
);

-- 4. Enable Realtime for Bids
-- You need to enable this in Supabase Dashboard -> Database -> Replication -> Source
-- alter publication supabase_realtime add table bids;
