export type UserRole = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

export type ProductStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED';

export type ProductCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';

export type AuctionStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export type VendorStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export type CampaignStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'EXPIRED' | 'REJECTED';

export type CampaignType = 'FEATURED_7D' | 'HOMEPAGE' | 'CATEGORY_BOOST';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ApprovalTargetType = 'AUCTION' | 'TRADE_PRICE' | 'CAMPAIGN' | 'PRODUCT';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  user_id: string;
  name: string;
  company_name: string;
  country: string;
  contact_info: string | null;
  status: VendorStatus;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  category_id: string | null;
  name_ar: string;
  name_en: string;
  name_zh: string;
  description_ar: string;
  description_en: string;
  description_zh: string;
  is_used: boolean;
  condition: ProductCondition;
  usage_duration_months: number | null;
  base_price: number;
  currency: string;
  stock: number;
  legal_is_original: boolean;
  legal_ownership_pledge: boolean;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  name_zh: string;
  created_at: string;
}

export interface Auction {
  id: string;
  product_id: string;
  vendor_id: string;
  start_price: number;
  min_increment: number;
  current_price: number | null;
  start_at: string;
  end_at: string;
  status: AuctionStatus;
  winner_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  product_id: string;
  vendor_id: string;
  type: CampaignType;
  status: CampaignStatus;
  start_at: string | null;
  end_at: string | null;
  created_at: string;
  updated_at: string;
}
