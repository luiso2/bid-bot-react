// Application constants

export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '/wp-json/jd-auction/v1';

export const PRICE_RANGES = [
  { value: '', label: 'Todos los precios' },
  { value: '0-10000', label: 'AED 0 - AED 10,000' },
  { value: '10000-20000', label: 'AED 10,000 - AED 20,000' },
  { value: '20000-30000', label: 'AED 20,000 - AED 30,000' },
  { value: '30000-50000', label: 'AED 30,000 - AED 50,000' },
  { value: '50000+', label: 'AED 50,000+' },
];

export const USER_STATUS_EMOJI = {
  pending: '⏳',
  approved: '✅',
  rejected: '❌',
  blocked: '🚫',
  error: '⚠️',
  offline: '📵',
} as const;

export const TOAST_DURATION = {
  short: 2000,
  medium: 3000,
  long: 5000,
} as const;

export const CACHE_KEYS = {
  user: 'user',
  lots: 'lots',
  brands: 'brands',
  bids: 'bids',
} as const;

export const QUERY_KEYS = {
  user: (telegramId: number) => ['user', telegramId] as const,
  lots: ['lots'] as const,
  brands: ['brands'] as const,
  lot: (id: number) => ['lot', id] as const,
  userBids: (telegramId: number) => ['userBids', telegramId] as const,
} as const;

export const RATE_LIMITS = {
  bid: { max: 10, window: 60000 }, // 10 bids per minute
  register: { max: 2, window: 300000 }, // 2 attempts per 5 minutes
  profile: { max: 5, window: 300000 }, // 5 updates per 5 minutes
} as const;

export const BID_INCREMENT_RULES = [
  { max: 5000, increment: 100 },
  { max: 10000, increment: 250 },
  { max: 25000, increment: 500 },
  { max: 50000, increment: 1000 },
  { max: 100000, increment: 2500 },
  { max: Infinity, increment: 5000 },
] as const;

export const DEBUG_MODE = (typeof import.meta !== 'undefined' && import.meta.env?.DEV) || (typeof window !== 'undefined' && window.location.search.includes('debug=true'));

export const REFRESH_INTERVALS = {
  lots: 30000, // 30 seconds
  bids: 60000, // 1 minute
} as const;
