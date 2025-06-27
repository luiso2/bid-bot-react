// Toast component for notifications

import React, { useEffect } from 'react';
import { Toaster, toast as hotToast, ToastOptions } from 'react-hot-toast';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  icon?: string | React.ReactNode;
}

const toastIcons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const toastStyles: Record<string, React.CSSProperties> = {
  success: {
    background: '#4caf50',
    color: 'white',
  },
  error: {
    background: '#f44336',
    color: 'white',
  },
  warning: {
    background: '#ff9800',
    color: 'white',
  },
  info: {
    background: '#2196f3',
    color: 'white',
  },
};

export const showToast = ({ message, type = 'info', duration = 3000, icon }: ToastProps) => {
  const options: ToastOptions = {
    duration,
    style: {
      ...toastStyles[type],
      borderRadius: '8px',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    icon: icon || toastIcons[type],
    position: 'top-center',
  };

  switch (type) {
    case 'success':
      hotToast.success(message, options);
      break;
    case 'error':
      hotToast.error(message, options);
      break;
    default:
      hotToast(message, options);
  }
};

export const Toast: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 20,
      }}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--tg-theme-bg-color)',
          color: 'var(--tg-theme-text-color)',
          border: '1px solid var(--tg-theme-hint-color)',
        },
      }}
    />
  );
};

export default Toast;
