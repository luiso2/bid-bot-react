// Bid Modal component

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from 'react-query';
import { useAppStore } from '@/store/useAppStore';
import { useTelegram } from '@/hooks/useTelegram';
import { api } from '@/services/api';
import { formatCurrency, validateBidAmount, getDynamicIncrement, canUserBid } from '@/utils/helpers';
import { showToast } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { checkRateLimit } from '@/utils/rateLimiter';
import { logger } from '@/utils/logger';
import { QUERY_KEYS } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import type { Lot } from '@/types';

interface BidModalProps {
  lot: Lot;
  isOpen: boolean;
  onClose: () => void;
}

export const BidModal: React.FC<BidModalProps> = ({ lot, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { hapticFeedback, showConfirm } = useTelegram();
  const user = useAppStore((state) => state.user);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [showError, setShowError] = useState<string>('');

  const minBid = lot.minBid || lot.currentBid + getDynamicIncrement(lot.currentBid);

  useEffect(() => {
    if (isOpen) {
      setBidAmount(minBid.toString());
      setShowError('');
    }
  }, [isOpen, minBid]);

  const placeBidMutation = useMutation(
    (amount: number) => 
      api.lots.placeBid({
        lot_id: lot.id,
        amount,
        telegram_id: user?.telegram_id,
      }),
    {
      onSuccess: (data) => {
        logger.success('Bid placed successfully', data);
        showToast({ message: '¡Puja realizada con éxito!', type: 'success' });
        hapticFeedback('success');
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries(QUERY_KEYS.lots);
        queryClient.invalidateQueries(QUERY_KEYS.userBids(user?.telegram_id || 0));
        
        onClose();
      },
      onError: (error: any) => {
        logger.error('Bid failed', error);
        const message = error.response?.data?.message || error.message || 'Error al realizar la puja';
        showToast({ message, type: 'error' });
        hapticFeedback('error');
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError('');

    try {
      // Check if user can bid
      if (!user || !canUserBid(user.status)) {
        showToast({ message: 'Necesitas aprobación para realizar pujas', type: 'warning' });
        return;
      }

      // Validate amount
      const amount = parseFloat(bidAmount);
      const validation = validateBidAmount(amount, minBid);
      
      if (!validation.valid) {
        setShowError(validation.error || 'Cantidad inválida');
        hapticFeedback('error');
        return;
      }

      // Check rate limit
      checkRateLimit('place_bid', { max: 10, window: 60000 });

      // Confirm bid
      showConfirm(
        `¿Confirmas tu puja de ${formatCurrency(amount)} por "${lot.title}"?`,
        async (confirmed) => {
          if (confirmed) {
            placeBidMutation.mutate(amount);
          }
        }
      );
    } catch (error: any) {
      logger.error('Error placing bid', error);
      showToast({ message: error.message || 'Error al procesar la puja', type: 'error' });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setBidAmount(value);
    setShowError('');
  };

  const quickBidAmounts = [
    minBid,
    minBid + getDynamicIncrement(lot.currentBid),
    minBid + (getDynamicIncrement(lot.currentBid) * 2),
  ];

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-tg-bg rounded-lg p-6 max-w-md w-full shadow-xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-tg-text">Realizar Puja</h3>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-tg-secondary-bg rounded-lg transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              
              {/* Current Bid Info */}
              <div className="bg-tg-secondary-bg rounded-lg p-4 mb-6">
                <h4 className="font-medium text-tg-text mb-2">{lot.title}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-tg-hint">Puja actual:</span>
                    <span className="font-semibold text-lg text-tg-link">
                      {formatCurrency(lot.currentBid)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-tg-hint">Puja mínima:</span>
                    <span className="font-medium text-tg-text">
                      {formatCurrency(minBid)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-tg-hint">Cierre:</span>
                    <span className="font-medium text-tg-text">{lot.timeLeft}</span>
                  </div>
                </div>
              </div>
              
              {/* Bid Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-tg-text mb-2">
                    Tu puja (AED)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-hint">
                      AED
                    </span>
                    <input
                      type="text"
                      id="bidAmount"
                      value={bidAmount}
                      onChange={handleAmountChange}
                      className={cn(
                        'input-field pl-12 text-lg font-semibold',
                        showError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      )}
                      placeholder={minBid.toString()}
                    />
                  </div>
                  {showError && (
                    <p className="mt-1 text-sm text-red-500">{showError}</p>
                  )}
                </div>
                
                {/* Quick Bid Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {quickBidAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setBidAmount(amount.toString());
                        setShowError('');
                      }}
                      className="py-2 px-3 bg-tg-secondary-bg hover:bg-tg-hint/20 rounded-lg text-sm font-medium text-tg-text transition-colors"
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={placeBidMutation.isLoading || !bidAmount}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {placeBidMutation.isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Puja'
                  )}
                </button>
              </form>
              
              {/* Info */}
              <p className="mt-4 text-xs text-tg-hint text-center">
                Al realizar una puja, aceptas los términos y condiciones de la subasta.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BidModal;
