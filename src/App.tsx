// Main App component

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { Toast } from '@/components/Toast';
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { LoadingOverlay } from '@/components/LoadingSpinner';
import { AuctionsTab } from '@/components/tabs/AuctionsTab';
import { FavoritesTab } from '@/components/tabs/FavoritesTab';
import { ProfileTab } from '@/components/tabs/ProfileTab';
import { StatusModal } from '@/components/modals/StatusModal';
import { useAppStore } from '@/store/useAppStore';
import { useTelegram } from '@/hooks/useTelegram';
import { useInitialization } from '@/hooks/useInitialization';
import { logger } from '@/utils/logger';
import { DEBUG_MODE } from '@/utils/constants';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 30000, // 30 seconds
    },
  },
});

// Error Fallback component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-tg-bg">
      <div className="text-center">
        <p className="text-6xl mb-4">😔</p>
        <h2 className="text-xl font-semibold mb-2 text-tg-text">Algo salió mal</h2>
        <p className="text-tg-hint mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-2 bg-tg-button text-tg-button-text rounded-lg font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
};

function AppContent() {
  const { isReady, user: telegramUser } = useTelegram();
  const { isInitializing, error: initError } = useInitialization();
  const currentTab = useAppStore((state) => state.currentTab);
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const user = useAppStore((state) => state.user);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    if (isReady) {
      logger.init('App ready', { telegramUser, isInitializing });
    }
  }, [isReady, telegramUser, isInitializing]);

  useEffect(() => {
    // Show status modal for pending users
    if (user && user.status === 'pending' && !showStatusModal) {
      const timer = setTimeout(() => {
        setShowStatusModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, showStatusModal]);

  if (!isReady || isInitializing) {
    return <LoadingOverlay message="Inicializando..." />;
  }

  if (initError) {
    throw new Error(initError);
  }

  return (
    <div className="min-h-screen bg-tg-bg">
      <Header onProfileClick={() => setCurrentTab('profile')} />
      <TabNavigation />
      
      <main className="pb-safe-area-inset">
        {currentTab === 'auctions' && <AuctionsTab />}
        {currentTab === 'favorites' && <FavoritesTab />}
        {currentTab === 'profile' && <ProfileTab />}
      </main>

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        status={user?.status || 'pending'}
      />

      <Toast />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        {DEBUG_MODE && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
