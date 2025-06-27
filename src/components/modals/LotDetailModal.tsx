// Lot Detail Modal component

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useTelegram } from '@/hooks/useTelegram';
import { formatCurrency, calculateTimeLeft, translateSpec } from '@/utils/helpers';
import { showToast } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { cn } from '@/utils/helpers';
import type { Lot } from '@/types';

interface LotDetailModalProps {
  lot: Lot;
  isOpen: boolean;
  onClose: () => void;
  onBidClick: () => void;
}

export const LotDetailModal: React.FC<LotDetailModalProps> = ({
  lot,
  isOpen,
  onClose,
  onBidClick,
}) => {
  const { hapticFeedback } = useTelegram();
  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isFavorite = favorites.includes(lot.id);
  const timeLeft = calculateTimeLeft(lot.closingDate);
  const isClosed = timeLeft === 'Cerrado';

  const handleFavoriteClick = () => {
    toggleFavorite(lot.id);
    hapticFeedback('light');
    showToast({
      message: isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos',
      type: isFavorite ? 'info' : 'success',
    });
  };

  const images = lot.gallery?.length ? lot.gallery : [{ url: lot.image, thumbnail: lot.image, medium: lot.image }];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden"
          >
            <div className="bg-tg-bg rounded-t-2xl shadow-xl">
              {/* Header */}
              <div className="sticky top-0 bg-tg-bg border-b border-tg-hint/20 p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-tg-text flex-1 mr-4">
                  {lot.title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-tg-secondary-bg rounded-lg transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              
              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Image Gallery */}
                <div className="relative">
                  <div className="aspect-video bg-tg-secondary-bg overflow-hidden">
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner size="lg" />
                      </div>
                    )}
                    <img
                      src={images[selectedImageIndex]?.url || lot.image}
                      alt={lot.title}
                      className={cn(
                        'w-full h-full object-contain',
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      )}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                    />
                  </div>
                  
                  {/* Gallery Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedImageIndex(index);
                            setImageLoaded(false);
                          }}
                          className={cn(
                            'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                            selectedImageIndex === index
                              ? 'border-tg-link'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          )}
                        >
                          <img
                            src={img.thumbnail}
                            alt={`${lot.title} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Price and Time */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-tg-hint">Puja actual</p>
                      <p className="text-2xl font-bold text-tg-link">
                        {formatCurrency(lot.currentBid)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-tg-hint">Cierre</p>
                      <p className={cn(
                        'text-lg font-medium',
                        isClosed ? 'text-red-500' : 'text-tg-text'
                      )}>
                        {timeLeft}
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {lot.description && (
                    <div>
                      <h4 className="font-semibold text-tg-text mb-2">Descripción</h4>
                      <p className="text-tg-hint text-sm leading-relaxed">
                        {lot.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Specifications */}
                  <div>
                    <h4 className="font-semibold text-tg-text mb-3">Especificaciones</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(lot.specs).map(([key, value]) => (
                        value && (
                          <div key={key} className="bg-tg-secondary-bg rounded-lg p-3">
                            <p className="text-xs text-tg-hint mb-1">{translateSpec(key)}</p>
                            <p className="text-sm font-medium text-tg-text">{value}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  {(lot.model || lot.condition) && (
                    <div className="grid grid-cols-2 gap-3">
                      {lot.model && (
                        <div className="bg-tg-secondary-bg rounded-lg p-3">
                          <p className="text-xs text-tg-hint mb-1">Modelo</p>
                          <p className="text-sm font-medium text-tg-text">{lot.model}</p>
                        </div>
                      )}
                      {lot.condition && (
                        <div className="bg-tg-secondary-bg rounded-lg p-3">
                          <p className="text-xs text-tg-hint mb-1">Condición</p>
                          <p className="text-sm font-medium text-tg-text">{lot.condition}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={onBidClick}
                      disabled={isClosed}
                      className={cn(
                        'flex-1 py-3 px-4 rounded-lg font-semibold transition-all',
                        isClosed
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'btn-primary'
                      )}
                    >
                      {isClosed ? 'Subasta Cerrada' : 'Realizar Puja'}
                    </button>
                    
                    <button
                      onClick={handleFavoriteClick}
                      className={cn(
                        'p-3 rounded-lg font-medium transition-all',
                        isFavorite
                          ? 'bg-red-500 text-white'
                          : 'bg-tg-secondary-bg text-tg-text hover:bg-tg-hint/20'
                      )}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LotDetailModal;
