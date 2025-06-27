// Application types

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'blocked' | 'error' | 'offline';

export interface User {
  id: number;
  telegram_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  phone?: string;
  email?: string;
  status: UserStatus;
  registered_at: string;
  approved_at?: string;
  language_code?: string;
  photo_url?: string;
}

export interface Lot {
  id: number;
  title: string;
  description: string;
  image: string;
  lot_number: string;
  brand: string;
  year: string;
  mileage: string;
  currentBid: number;
  minBid: number;
  timeLeft: string;
  closingDate: string;
  specs: {
    engine?: string;
    transmission?: string;
    fuel?: string;
    color?: string;
    location?: string;
  };
  model?: string;
  condition?: string;
  basePrice?: number;
  bidIncrement?: number;
  totalBids?: number;
  gallery?: Array<{
    url: string;
    thumbnail: string;
    medium: string;
  }>;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface Bid {
  bid_id: number;
  lot_id: number;
  lot_title: string;
  amount: number;
  bid_date: string;
  is_winner: boolean;
  is_active: boolean;
  is_highest: boolean;
  current_highest: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PlaceBidRequest {
  lot_id: number;
  amount: number;
  telegram_id?: number;
  init_data?: string;
}

export interface PlaceBidResponse {
  success: boolean;
  bid_id: number;
  message: string;
  current_bid: number;
  next_min_bid: number;
}

export interface RegisterUserRequest {
  telegram_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  phone?: string;
  email?: string;
  language_code?: string;
}

export interface PriceRange {
  min: number;
  max: number;
  label: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface FilterState {
  brand: string;
  priceRange: string;
  searchTerm: string;
}

export interface AppState {
  user: User | null;
  lots: Lot[];
  brands: Brand[];
  favorites: number[];
  biddingHistory: Bid[];
  currentTab: 'auctions' | 'favorites' | 'profile';
  isLoading: boolean;
  error: string | null;
  filter: FilterState;
}
