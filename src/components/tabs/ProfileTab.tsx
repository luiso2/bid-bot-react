// Profile Tab component

import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAppStore } from '@/store/useAppStore';
import { useTelegram } from '@/hooks/useTelegram';
import { api } from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { BiddingHistoryCard } from '@/components/cards/BiddingHistoryCard';
import { EmptyState } from '@/components/EmptyState';
import { showToast } from '@/components/Toast';
import { logger } from '@/utils/logger';
import { QUERY_KEYS } from '@/utils/constants';
import { isValidEmail, isValidPhone } from '@/utils/helpers';
import { checkRateLimit } from '@/utils/rateLimiter';

interface ProfileFormData {
  displayName: string;
  phone: string;
  email: string;
  location: string;
}

export const ProfileTab: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const { hapticFeedback } = useTelegram();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: user?.first_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    location: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);

  // Fetch bidding history
  const { data: biddingHistory, isLoading: isLoadingBids } = useQuery(
    QUERY_KEYS.userBids(user?.telegram_id || 0),
    () => api.user.getBids(user!.telegram_id),
    {
      enabled: !!user?.telegram_id && user.status === 'approved',
      refetchInterval: 60000, // Refresh every minute
      onSuccess: (data) => {
        logger.info(`Loaded ${data.length} bids`);
      },
    }
  );

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.first_name || '',
        phone: user.phone || '',
        email: user.email || '',
        location: '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      checkRateLimit('save_profile', { max: 5, window: 300000 });
      
      // Validate email if provided
      if (formData.email && !isValidEmail(formData.email)) {
        showToast({ message: 'Email inválido', type: 'error' });
        return;
      }
      
      // Validate phone if provided
      if (formData.phone && !isValidPhone(formData.phone)) {
        showToast({ message: 'Teléfono inválido', type: 'error' });
        return;
      }
      
      setIsSaving(true);
      
      // TODO: Implement API call to save profile
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
      
      showToast({ message: 'Perfil guardado exitosamente', type: 'success' });
      hapticFeedback('success');
      
      logger.success('Profile saved', formData);
    } catch (error: any) {
      logger.error('Error saving profile', error);
      showToast({ message: error.message || 'Error al guardar perfil', type: 'error' });
      hapticFeedback('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <EmptyState
          title="No hay datos de usuario"
          description="Por favor, recarga la aplicación"
          icon="👤"
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Form */}
      <div className="bg-tg-bg rounded-lg border border-tg-hint/20 p-4">
        <h2 className="text-lg font-semibold mb-4 text-tg-text">Mi Perfil</h2>
        
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-tg-text mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Tu nombre"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-tg-text mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input-field"
              placeholder="+971 50 123 4567"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-tg-text mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-tg-text mb-1">
              Ubicación
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ciudad, País"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSaving}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="sm" />
                Guardando...
              </>
            ) : (
              'Guardar Perfil'
            )}
          </button>
        </form>
      </div>

      {/* User Status */}
      <div className="bg-tg-bg rounded-lg border border-tg-hint/20 p-4">
        <h3 className="text-lg font-semibold mb-2 text-tg-text">Estado de Cuenta</h3>
        <div className="flex items-center justify-between">
          <span className="text-tg-hint">Estado:</span>
          <span className={`font-medium ${
            user.status === 'approved' ? 'text-green-500' : 
            user.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {user.status === 'approved' ? 'Aprobado ✅' :
             user.status === 'pending' ? 'Pendiente ⏳' :
             user.status === 'rejected' ? 'Rechazado ❌' : 
             'Bloqueado 🚫'}
          </span>
        </div>
        {user.status === 'pending' && (
          <p className="text-sm text-tg-hint mt-2">
            Tu cuenta está siendo revisada. Recibirás una notificación cuando sea aprobada.
          </p>
        )}
      </div>

      {/* Bidding History */}
      {user.status === 'approved' && (
        <div className="bg-tg-bg rounded-lg border border-tg-hint/20 p-4">
          <h3 className="text-lg font-semibold mb-4 text-tg-text">Historial de Pujas</h3>
          
          {isLoadingBids ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : biddingHistory && biddingHistory.length > 0 ? (
            <div className="space-y-3">
              {biddingHistory.map((bid) => (
                <BiddingHistoryCard key={bid.bid_id} bid={bid} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No has realizado pujas"
              description="Tus pujas aparecerán aquí"
              icon="🏷️"
              compact
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
