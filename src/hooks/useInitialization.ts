// Initialization hook

import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useAppStore } from '@/store/useAppStore';
import { useTelegram } from '@/hooks/useTelegram';
import { api } from '@/services/api';
import { logger } from '@/utils/logger';
import { QUERY_KEYS } from '@/utils/constants';
import { showToast } from '@/components/Toast';

export function useInitialization() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user: telegramUser, isReady } = useTelegram();
  const setUser = useAppStore((state) => state.setUser);
  const setLots = useAppStore((state) => state.setLots);
  const setBrands = useAppStore((state) => state.setBrands);

  // Fetch user status
  const { data: userData, error: userError } = useQuery(
    QUERY_KEYS.user(telegramUser?.id || 0),
    () => api.user.getStatus(telegramUser!.id),
    {
      enabled: !!telegramUser?.id && isReady,
      retry: 1,
      onError: async (error: any) => {
        // If user not found, try to register
        if (error.response?.status === 404) {
          logger.info('User not found, registering...');
          try {
            const result = await api.user.register({
              telegram_id: telegramUser!.id,
              first_name: telegramUser!.first_name,
              last_name: telegramUser?.last_name,
              username: telegramUser?.username,
              language_code: telegramUser?.language_code || 'es',
            });
            
            if (result.success && result.data) {
              setUser(result.data.user);
              showToast({
                message: '¡Bienvenido! Tu cuenta está pendiente de aprobación.',
                type: 'info',
              });
            }
          } catch (regError) {
            logger.error('Registration failed', regError);
            setError('Error al registrar usuario');
          }
        }
      },
    }
  );

  // Fetch lots
  const { data: lotsData } = useQuery(
    QUERY_KEYS.lots,
    api.lots.getActive,
    {
      enabled: isReady,
      refetchInterval: 30000, // Refresh every 30 seconds
      onSuccess: (data) => {
        setLots(data);
        logger.success(`Loaded ${data.length} active lots`);
      },
    }
  );

  // Fetch brands
  useQuery(
    QUERY_KEYS.brands,
    api.brands.getAll,
    {
      enabled: isReady,
      onSuccess: (data) => {
        setBrands(data.brands);
        logger.success(`Loaded ${data.brands.length} brands`);
      },
    }
  );

  // Set user data when available
  useEffect(() => {
    if (userData) {
      setUser(userData);
      logger.user('User data loaded', userData);
    }
  }, [userData, setUser]);

  // Check initialization status
  useEffect(() => {
    if (!isReady) {
      setIsInitializing(true);
      return;
    }

    if (!telegramUser) {
      setError('No se pudo obtener datos de usuario de Telegram');
      setIsInitializing(false);
      return;
    }

    // Consider initialized when we have user data (or error) and lots
    if ((userData || userError) && lotsData) {
      setIsInitializing(false);
      logger.init('Initialization complete');
    }
  }, [isReady, telegramUser, userData, userError, lotsData]);

  return {
    isInitializing,
    error,
  };
}
