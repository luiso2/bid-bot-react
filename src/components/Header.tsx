// Header component

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { USER_STATUS_EMOJI } from '@/utils/constants';

interface HeaderProps {
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const user = useAppStore((state) => state.user);
  
  const statusEmoji = user ? USER_STATUS_EMOJI[user.status] : '👤';
  const userName = user?.first_name || 'Cargando...';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-tg-header-bg text-tg-header-text shadow-lg">
      <h1 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">🚗</span>
        JD Emirates Subastas
      </h1>
      
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">
          {statusEmoji} {userName}
        </span>
        <button
          onClick={onProfileClick}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label="Profile"
        >
          👤
        </button>
      </div>
    </header>
  );
};

export default Header;
