// Loading Spinner component

import React from 'react';
import { cn } from '@/utils/helpers';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div
      className={cn(
        'inline-block rounded-full border-tg-hint/30 border-t-tg-link animate-spin',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-tg-bg/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-tg-bg/80 backdrop-blur-sm z-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-tg-text font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
