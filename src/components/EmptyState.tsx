// Empty State component

import React from 'react';
import { cn } from '@/utils/helpers';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = '📭',
  action,
  compact = false,
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      compact ? 'py-8' : 'py-16'
    )}>
      <div className={cn(
        'mb-4 animate-pulse-scale',
        compact ? 'text-4xl' : 'text-6xl'
      )}>
        {icon}
      </div>
      
      <h3 className={cn(
        'font-semibold text-tg-text mb-2',
        compact ? 'text-base' : 'text-lg'
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(
          'text-tg-hint',
          compact ? 'text-sm' : 'text-base',
          'max-w-sm mx-auto'
        )}>
          {description}
        </p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-6 py-2 bg-tg-button text-tg-button-text rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
