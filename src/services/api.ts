// API client service

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';
import { safeJSONParse } from '@/utils/helpers';
import type {
  User,
  Lot,
  Brand,
  Bid,
  PlaceBidRequest,
  PlaceBidResponse,
  RegisterUserRequest,
  ApiResponse,
} from '@/types';

class ApiClient {
  private client: AxiosInstance;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp to prevent caching
        config.params = {
          ...config.params,
          _t: Date.now(),
        };

        // Add Telegram init data if available
        const tg = window.Telegram?.WebApp;
        if (tg?.initData) {
          config.headers['X-Telegram-Init-Data'] = tg.initData;
        }

        // Add nonce if available
        const nonce = (window as any).jdAuctionData?.nonce;
        if (nonce) {
          config.headers['X-WP-Nonce'] = nonce;
        }

        logger.api(`${config.method?.toUpperCase()} ${config.url}`, config);
        return config;
      },
      (error) => {
        logger.error('Request error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.api(`Response ${response.status}`, response.data);
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config;
        const retryCount = (config as any)?._retryCount || 0;

        logger.error(`API Error ${error.response?.status}`, {
          message: error.message,
          response: error.response?.data,
        });

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 60;
          throw new Error(`Rate limit alcanzado. Intenta en ${retryAfter} segundos.`);
        }

        // Retry on 5xx errors
        if (
          error.response?.status &&
          error.response.status >= 500 &&
          retryCount < this.maxRetries &&
          config
        ) {
          (config as any)._retryCount = retryCount + 1;
          const delay = this.retryDelay * (retryCount + 1);
          
          logger.warn(`Retrying request in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          
          return this.client(config);
        }

        return Promise.reject(error);
      }
    );
  }

  // User endpoints
  async getUserStatus(telegramId: number): Promise<User> {
    const response = await this.client.get<User>(`/user/${telegramId}`);
    return response.data;
  }

  async registerUser(data: RegisterUserRequest): Promise<ApiResponse<{ user: User }>> {
    const response = await this.client.post<ApiResponse<{ user: User }>>('/register', data);
    return response.data;
  }

  // Lots endpoints
  async getActiveLots(): Promise<Lot[]> {
    const response = await this.client.get<Lot[]>('/lots');
    return response.data;
  }

  async getLotDetails(id: number, includeBids = false): Promise<Lot> {
    const response = await this.client.get<Lot>(`/lots/${id}`, {
      params: { include_bids: includeBids },
    });
    return response.data;
  }

  // Brands endpoint
  async getBrands(): Promise<{ brands: Brand[]; total: number }> {
    const response = await this.client.get<{ brands: Brand[]; total: number }>('/brands');
    return response.data;
  }

  // Bidding endpoints
  async placeBid(data: PlaceBidRequest): Promise<PlaceBidResponse> {
    // Add init_data from Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg?.initData) {
      data.init_data = tg.initData;
    }

    const response = await this.client.post<PlaceBidResponse>('/bid', data);
    return response.data;
  }

  async getUserBids(telegramId: number): Promise<Bid[]> {
    const response = await this.client.get<Bid[]>(`/user/${telegramId}/bids`);
    return response.data;
  }

  // Helper method to handle blob responses (for potential future use)
  async downloadFile(url: string): Promise<Blob> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    });
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience functions
export const api = {
  user: {
    getStatus: (telegramId: number) => apiClient.getUserStatus(telegramId),
    register: (data: RegisterUserRequest) => apiClient.registerUser(data),
    getBids: (telegramId: number) => apiClient.getUserBids(telegramId),
  },
  lots: {
    getActive: () => apiClient.getActiveLots(),
    getDetails: (id: number, includeBids = false) => apiClient.getLotDetails(id, includeBids),
    placeBid: (data: PlaceBidRequest) => apiClient.placeBid(data),
  },
  brands: {
    getAll: () => apiClient.getBrands(),
  },
};
