// Global app store using Zustand

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import type { User, Lot, Brand, Bid, FilterState } from '@/types';
import { logger } from '@/utils/logger';

interface AppStore {
  // State
  user: User | null;
  lots: Lot[];
  brands: Brand[];
  favorites: number[];
  biddingHistory: Bid[];
  currentTab: 'auctions' | 'favorites' | 'profile';
  isLoading: boolean;
  error: string | null;
  filter: FilterState;

  // Actions
  setUser: (user: User | null) => void;
  setLots: (lots: Lot[]) => void;
  setBrands: (brands: Brand[]) => void;
  setFavorites: (favorites: number[]) => void;
  addFavorite: (lotId: number) => void;
  removeFavorite: (lotId: number) => void;
  toggleFavorite: (lotId: number) => void;
  setBiddingHistory: (bids: Bid[]) => void;
  setCurrentTab: (tab: 'auctions' | 'favorites' | 'profile') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  getFilteredLots: () => Lot[];
  getFavoriteLots: () => Lot[];
  reset: () => void;
}

const initialState = {
  user: null,
  lots: [],
  brands: [],
  favorites: [],
  biddingHistory: [],
  currentTab: 'auctions' as const,
  isLoading: false,
  error: null,
  filter: {
    brand: '',
    priceRange: '',
    searchTerm: '',
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // User actions
        setUser: (user) => {
          logger.user('Setting user', user);
          set({ user });
        },

        // Lots actions
        setLots: (lots) => {
          logger.info(`Setting ${lots.length} lots`);
          set({ lots });
        },

        // Brands actions
        setBrands: (brands) => {
          logger.info(`Setting ${brands.length} brands`);
          set({ brands });
        },

        // Favorites actions
        setFavorites: (favorites) => set({ favorites }),
        
        addFavorite: (lotId) => {
          const { favorites } = get();
          if (!favorites.includes(lotId)) {
            logger.info(`Adding favorite: ${lotId}`);
            set({ favorites: [...favorites, lotId] });
          }
        },
        
        removeFavorite: (lotId) => {
          const { favorites } = get();
          logger.info(`Removing favorite: ${lotId}`);
          set({ favorites: favorites.filter(id => id !== lotId) });
        },
        
        toggleFavorite: (lotId) => {
          const { favorites } = get();
          if (favorites.includes(lotId)) {
            get().removeFavorite(lotId);
          } else {
            get().addFavorite(lotId);
          }
        },

        // Bidding history actions
        setBiddingHistory: (bids) => {
          logger.info(`Setting ${bids.length} bids in history`);
          set({ biddingHistory: bids });
        },

        // Navigation actions
        setCurrentTab: (tab) => {
          logger.info(`Switching to tab: ${tab}`);
          set({ currentTab: tab });
        },

        // Loading/Error actions
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => {
          if (error) logger.error('Setting error', error);
          set({ error });
        },

        // Filter actions
        setFilter: (filter) => {
          const currentFilter = get().filter;
          set({ filter: { ...currentFilter, ...filter } });
        },
        
        resetFilter: () => {
          set({ filter: initialState.filter });
        },

        // Computed getters
        getFilteredLots: () => {
          const { lots, filter } = get();
          let filtered = [...lots];

          // Filter by search term
          if (filter.searchTerm) {
            const term = filter.searchTerm.toLowerCase();
            filtered = filtered.filter(lot => 
              lot.title.toLowerCase().includes(term) ||
              lot.brand.toLowerCase().includes(term) ||
              lot.year.includes(term)
            );
          }

          // Filter by brand
          if (filter.brand) {
            filtered = filtered.filter(lot => 
              lot.brand.toLowerCase() === filter.brand.toLowerCase()
            );
          }

          // Filter by price range
          if (filter.priceRange) {
            const [min, max] = filter.priceRange.split('-').map(Number);
            if (filter.priceRange === '50000+') {
              filtered = filtered.filter(lot => lot.currentBid > 50000);
            } else if (min !== undefined && max !== undefined) {
              filtered = filtered.filter(lot => 
                lot.currentBid >= min && lot.currentBid <= max
              );
            }
          }

          return filtered;
        },

        getFavoriteLots: () => {
          const { lots, favorites } = get();
          return lots.filter(lot => favorites.includes(lot.id));
        },

        // Reset store
        reset: () => {
          logger.warn('Resetting app store');
          set(initialState);
        },
      }),
      {
        name: 'jd-auction-store',
        partialize: (state) => ({
          favorites: state.favorites,
          filter: state.filter,
        }),
      }
    ),
    {
      name: 'JDAuctionStore',
    }
  )
);

// Selector hooks for performance
export const useUser = () => useAppStore((state) => state.user);
export const useLots = () => useAppStore((state) => state.lots);
export const useBrands = () => useAppStore((state) => state.brands);
export const useFavorites = () => useAppStore((state) => state.favorites);
export const useBiddingHistory = () => useAppStore((state) => state.biddingHistory);
export const useCurrentTab = () => useAppStore((state) => state.currentTab);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
export const useFilter = () => useAppStore((state) => state.filter);
export const useFilteredLots = () => useAppStore((state) => state.getFilteredLots());
export const useFavoriteLots = () => useAppStore((state) => state.getFavoriteLots());
