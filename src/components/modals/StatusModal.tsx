// Status Modal component

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
}

export const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, status }) => {
  useEffect(() => {
    if (isOpen && status === 'pending') {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, status, onClose]);

  if (status !== 'pending') return null;

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
            onClick={onClose}
          >
            <div
              className="bg-tg-bg rounded-lg p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse-scale">⏳</div>
                <h2 className="text-xl font-semibold mb-3 text-tg-text">
                  Cuenta Pendiente de Aprobación
                </h2>
                <p className="text-tg-hint mb-4">
                  Tu cuenta está siendo revisada. Mientras tanto, puedes explorar los vehículos disponibles.
                </p>
                <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <span>ℹ️</span>
                    Necesitas aprobación para realizar pujas.
                  </p>
                </div>
                
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2 bg-tg-button text-tg-button-text rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Entendido
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatusModal;
