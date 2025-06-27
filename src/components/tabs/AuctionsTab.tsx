// Auctions Tab component

import React, { useState, useCallback } from 'react';
import { useAppStore, useFilteredLots } from '@/store/useAppStore';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { LotCard } from '@/components/cards/LotCard';
import { LotDetailModal } from '@/components/modals/LotDetailModal';
import { BidModal } from '@/components/modals/BidModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { logger } from '@/utils/logger';
import type { Lot } from '@/types';

export const AuctionsTab: React.FC = () => {
  const isLoading = useAppStore((state) => state.isLoading);
  const filteredLots = useFilteredLots();
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);

  const handleLotClick = useCallback((lot: Lot) => {
    logger.info('Lot clicked', { lotId: lot.id });
    setSelectedLot(lot);
    setShowDetailModal(true);
  }, []);

  const handleBidClick = useCallback((lot: Lot) => {
    logger.info('Bid button clicked', { lotId: lot.id });
    setSelectedLot(lot);
    setShowBidModal(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
    // Keep selected lot for a moment to prevent flickering
    setTimeout(() => setSelectedLot(null), 300);
  }, []);

  const handleCloseBidModal = useCallback(() => {
    setShowBidModal(false);
    setTimeout(() => setSelectedLot(null), 300);
  }, []);

  const handleBidFromDetail = useCallback(() => {
    setShowDetailModal(false);
    setShowBidModal(true);
  }, []);

  if (isLoading && filteredLots.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <SearchBar />
      <FilterBar />
      
      {filteredLots.length === 0 ? (
        <EmptyState
          title="No se encontraron vehículos"
          description="Intenta ajustar los filtros o buscar algo diferente"
          icon="🚗"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLots.map((lot, index) => (
            <LotCard
              key={lot.id}
              lot={lot}
              onClick={() => handleLotClick(lot)}
              onBidClick={() => handleBidClick(lot)}
              delay={index * 50}
            />
          ))}
        </div>
      )}

      {selectedLot && (
        <>
          <LotDetailModal
            lot={selectedLot}
            isOpen={showDetailModal}
            onClose={handleCloseDetailModal}
            onBidClick={handleBidFromDetail}
          />
          
          <BidModal
            lot={selectedLot}
            isOpen={showBidModal}
            onClose={handleCloseBidModal}
          />
        </>
      )}
    </div>
  );
};

export default AuctionsTab;
