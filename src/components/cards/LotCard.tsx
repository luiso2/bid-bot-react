// Lot Card component

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAppStore } from '@/store/useAppStore';
import { useTelegram } from '@/hooks/useTelegram';
import { formatCurrency, calculateTimeLeft } from '@/utils/helpers';
import { showToast } from '@/components/Toast';
import { cn } from '@/utils/helpers';
import type { Lot } from '@/types';

interface LotCardProps {
  lot: Lot;
  onClick: () => void;
  onBidClick: () => void;
  delay?: number;
}

export const LotCard: React.FC<LotCardProps> = ({ lot, onClick, onBidClick, delay = 0 }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const { hapticFeedback } = useTelegram();
  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFavorite = favorites.includes(lot.id);
  const timeLeft = calculateTimeLeft(lot.closingDate);
  const isClosed = timeLeft === 'Cerrado';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(lot.id);
    hapticFeedback('light');
    showToast({
      message: isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos',
      type: isFavorite ? 'info' : 'success',
    });
  };

  const handleBidClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isClosed) {
      onBidClick();
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="card cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-tg-secondary-bg">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-pulse">🚗</div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-tg-secondary-bg">
            <span className="text-4xl">🚫</span>
          </div>
        ) : (
          <img
            src={lot.image || '/placeholder-car.jpg'}
            alt={lot.title}
            className={cn(
              'w-full h-full object-cover transition-all duration-300',
              'group-hover:scale-110',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
        
        {/* Time Badge */}
        <div className={cn(
          'absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium',
          isClosed 
            ? 'bg-red-500 text-white' 
            : 'bg-black/70 text-white backdrop-blur-sm'
        )}>
          ⏱ {timeLeft}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            'absolute top-2 right-2 p-2 rounded-full transition-all duration-200',
            'hover:scale-110 active:scale-95',
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-700 hover:bg-white'
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-tg-text line-clamp-2 group-hover:text-tg-link transition-colors">
            {lot.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-tg-hint">
            <span>{lot.year}</span>
            {lot.mileage && (
              <>
                <span>•</span>
                <span>{lot.mileage}</span>
              </>
            )}
          </div>
        </div>

        <div className="text-xl font-bold text-tg-link">
          {formatCurrency(lot.currentBid)}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBidClick}
            disabled={isClosed}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200',
              isClosed
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            )}
          >
            {isClosed ? 'Cerrado' : 'Pujar'}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="px-4 py-2 bg-tg-secondary-bg text-tg-text rounded-lg font-medium hover:bg-tg-hint/20 transition-colors"
          >
            Ver
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LotCard;
