// Bidding History Card component

import React from 'react';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { cn } from '@/utils/helpers';
import type { Bid } from '@/types';

interface BiddingHistoryCardProps {
  bid: Bid;
}

export const BiddingHistoryCard: React.FC<BiddingHistoryCardProps> = ({ bid }) => {
  const getStatusInfo = () => {
    if (bid.is_active) {
      if (bid.is_highest) {
        return { text: 'Puja más alta', className: 'text-green-500', icon: '🏆' };
      }
      return { text: 'Superado', className: 'text-yellow-500', icon: '⚠️' };
    }
    
    if (bid.is_winner) {
      return { text: 'Ganador', className: 'text-green-500', icon: '🎉' };
    }
    
    return { text: 'Finalizado', className: 'text-tg-hint', icon: '🏁' };
  };

  const status = getStatusInfo();

  return (
    <div className="flex items-center justify-between p-3 bg-tg-secondary-bg rounded-lg hover:bg-tg-hint/10 transition-colors">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-tg-text truncate">{bid.lot_title}</h4>
        <div className="flex items-center gap-3 mt-1 text-sm text-tg-hint">
          <span>{formatCurrency(bid.amount)}</span>
          <span>•</span>
          <span>{formatDate(bid.bid_date, 'dd/MM/yyyy HH:mm')}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        <span className="text-lg">{status.icon}</span>
        <span className={cn('text-sm font-medium whitespace-nowrap', status.className)}>
          {status.text}
        </span>
      </div>
    </div>
  );
};

export default BiddingHistoryCard;
