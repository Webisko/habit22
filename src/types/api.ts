/**
 * Kontrakt typów TypeScript dla API REST backendu Laravel 13 + Filament 5
 * Habit22 E-Commerce
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more_pages: boolean;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface ApiProductVariant {
  id: number;
  sku: string;
  name?: string | null;
  regular_price_amount: number;
  sale_price_amount?: number | null;
  stock_quantity: number;
  is_active: boolean;
  option_values?: Array<{
    id: number;
    option_id: number;
    option_name: string;
    value: string;
  }>;
}

export interface ApiProduct {
  id: number;
  slug: string;
  sku: string;
  type: 'physical' | 'digital' | 'service';
  name: string;
  short_description?: string | null;
  description?: string | null;
  is_new?: boolean;
  is_bestseller?: boolean;
  is_promoted?: boolean;
  is_recommended?: boolean;
  currency: string;
  regular_price_amount: number;
  sale_price_amount?: number | null;
  current_price_amount: number;
  lowest_price_last_30_days?: number | null;
  featured_image_url?: string | null;
  gallery_image_urls?: string[];
  categories?: ApiCategory[];
  variants?: ApiProductVariant[];
  average_rating?: number;
  reviews_count?: number;
  published_at?: string | null;
}

export interface ApiCatalogResponse {
  products: ApiProduct[];
  categories: ApiCategory[];
  pagination: ApiPagination;
}

export interface ApiBlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image_url?: string | null;
  reading_time_minutes?: number | null;
  author_name?: string | null;
  published_at?: string | null;
}

export interface ApiFaqItem {
  id: number;
  question: string;
  answer: string;
  group_name?: string | null;
  sort_order: number;
}

export interface ApiContentPage {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  body?: string | null;
  hero_image_url?: string | null;
  hero_image_alt?: string | null;
  template: string;
  template_label?: string | null;
  published_at?: string | null;
}

export interface ApiStoreSettings {
  store_name: string;
  support_email?: string | null;
  support_phone?: string | null;
  currency: string;
  free_shipping_threshold_amount?: number | null;
  default_shipping_cost_amount?: number | null;
  is_maintenance_mode?: boolean;
}

export interface ApiCartItem {
  id: number;
  product_id: number;
  product_variant_id?: number | null;
  name: string;
  sku: string;
  unit_price_amount: number;
  quantity: number;
  total_amount: number;
  image_url?: string | null;
}

export interface ApiCart {
  id: number;
  items: ApiCartItem[];
  items_count: number;
  subtotal_amount: number;
  total_amount: number;
  currency: string;
}

export interface InPostPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
}

export interface ApiQuoteRequestItem {
  slug: string;
  quantity: number;
}

export interface ApiQuoteResponse {
  subtotal_amount: number;
  regular_subtotal_amount: number;
  coupon_discount_amount: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
  coupon?: {
    code: string;
    discount_type: string;
    value: number;
  } | null;
}

export interface ApiPlaceOrderCustomer {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  wants_invoice?: boolean;
  company_name?: string;
  nip?: string;
}

export interface ApiPlaceOrderAddress {
  first_name?: string;
  last_name?: string;
  street: string;
  city: string;
  postal_code: string;
  country_code?: string;
}

export interface ApiPlaceOrderPayload {
  items: ApiQuoteRequestItem[];
  shipping_method_code: string;
  coupon_code?: string | null;
  payment_method: string;
  customer: ApiPlaceOrderCustomer;
  billing_address?: ApiPlaceOrderAddress;
  shipping_address?: ApiPlaceOrderAddress;
  delivery_point?: InPostPoint | null;
  terms_accepted: boolean;
  notes?: string;
}

export interface ApiPlaceOrderResponse {
  order: {
    id: number;
    number: string;
    status: string;
    payment_status: string;
    fulfillment_status: string;
    customer_email: string;
    shipping_method_code: string;
    shipping_method_name: string;
    subtotal_amount: number;
    discount_amount: number;
    shipping_amount: number;
    total_amount: number;
    items_count: number;
    placed_at: string;
  };
  payment: {
    provider: string;
    status: string;
    requires_redirect: boolean;
    redirect_url?: string | null;
    next_action: string;
  };
}

export interface ApiPaymentSessionResponse {
  payment_session: {
    id: number;
    provider: string;
    status: string;
    amount: number;
    currency: string;
    redirect_url?: string | null;
    next_action?: string | null;
  };
}

