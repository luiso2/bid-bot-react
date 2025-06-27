// Tab Navigation component

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils/helpers';

interface Tab {
  id: 'auctions' | 'favorites' | 'profile';
  label: string;
  icon?: string;
}

const tabs: Tab[] = [
  { id: 'auctions', label: 'Subastas', icon: '🏷️' },
  { id: 'favorites', label: 'Favoritos', icon: '❤️' },
  { id: 'profile', label: 'Mi Perfil', icon: '👤' },
];

export const TabNavigation: React.FC = () => {
  const currentTab = useAppStore((state) => state.currentTab);
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const favorites = useAppStore((state) => state.favorites);

  return (
    <nav className="flex bg-tg-secondary-bg border-b border-tg-hint/20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={cn(
            'flex-1 py-3 px-4 text-sm font-medium transition-all duration-200',
            'relative flex items-center justify-center gap-1',
            currentTab === tab.id
              ? 'text-tg-link bg-tg-bg border-b-2 border-tg-link'
              : 'text-tg-hint hover:text-tg-text hover:bg-tg-bg/50'
          )}
        >
          {tab.icon && <span className="text-base">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.id === 'favorites' && favorites.length > 0 && (
            <span className="absolute top-1 right-1 bg-tg-link text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px]">
              {favorites.length}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default TabNavigation;
