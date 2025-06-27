// Favorites Tab component

import React, { useState, useCallback } from 'react';
import { useFavoriteLots } from '@/store/useAppStore';
import { LotCard } from '@/components/cards/LotCard';
import { LotDetailModal } from '@/components/modals/LotDetailModal';
import { BidModal } from '@/components/modals/BidModal';
import { EmptyState } from '@/components/EmptyState';
import { logger } from '@/utils/logger';
import type { Lot } from '@/types';

export const FavoritesTab: React.FC = () => {
  const favoriteLots = useFavoriteLots();
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);

  const handleLotClick = useCallback((lot: Lot) => {
    logger.info('Favorite lot clicked', { lotId: lot.id });
    setSelectedLot(lot);
    setShowDetailModal(true);
  }, []);

  const handleBidClick = useCallback((lot: Lot) => {
    logger.info('Bid button clicked on favorite', { lotId: lot.id });
    setSelectedLot(lot);
    setShowBidModal(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
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

  if (favoriteLots.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No tienes favoritos aún"
          description="Añade vehículos a favoritos desde las subastas"
          icon="❤️"
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-tg-text">
          Mis Favoritos ({favoriteLots.length})
        </h2>
        <p className="text-sm text-tg-hint mt-1">
          Vehículos que has marcado como favoritos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteLots.map((lot, index) => (
          <LotCard
            key={lot.id}
            lot={lot}
            onClick={() => handleLotClick(lot)}
            onBidClick={() => handleBidClick(lot)}
            delay={index * 50}
          />
        ))}
      </div>

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

export default FavoritesTab;
