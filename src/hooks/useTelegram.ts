// Telegram WebApp hook

import { useEffect, useState, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface UseTelegramResult {
  webApp: typeof window.Telegram.WebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
  colorScheme: 'light' | 'dark';
  showPopup: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  hapticFeedback: (type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') => void;
  close: () => void;
  expand: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  openLink: (url: string) => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}

export function useTelegram(): UseTelegramResult {
  const [isReady, setIsReady] = useState(false);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const webAppRef = useRef<typeof window.Telegram.WebApp | null>(null);
  const userRef = useRef<TelegramUser | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (!tg) {
      logger.error('Telegram WebApp not available');
      return;
    }

    webAppRef.current = tg;
    
    // Initialize Telegram WebApp
    tg.ready();
    setIsReady(true);
    
    // Set initial color scheme
    setColorScheme(tg.colorScheme);
    
    // Get user data
    if (tg.initDataUnsafe?.user) {
      userRef.current = tg.initDataUnsafe.user;
      logger.telegram('User data loaded', userRef.current);
    }

    // Apply theme
    applyTelegramTheme(tg);

    // Set up event listeners
    const handleThemeChanged = () => {
      setColorScheme(tg.colorScheme);
      applyTelegramTheme(tg);
      logger.telegram('Theme changed', { colorScheme: tg.colorScheme });
    };

    const handleViewportChanged = () => {
      logger.telegram('Viewport changed', {
        height: tg.viewportHeight,
        stableHeight: tg.viewportStableHeight,
      });
    };

    tg.onEvent('themeChanged', handleThemeChanged);
    tg.onEvent('viewportChanged', handleViewportChanged);

    // Expand app
    tg.expand();

    // Setup main button
    tg.MainButton.setText('Cerrar');
    tg.MainButton.onClick(() => {
      tg.close();
    });
    tg.MainButton.show();

    logger.telegram('Telegram WebApp initialized', {
      version: tg.version,
      platform: tg.platform,
      colorScheme: tg.colorScheme,
    });

    return () => {
      tg.offEvent('themeChanged', handleThemeChanged);
      tg.offEvent('viewportChanged', handleViewportChanged);
    };
  }, []);

  const showPopup = useCallback((message: string, callback?: () => void) => {
    webAppRef.current?.showAlert(message, callback);
  }, []);

  const showConfirm = useCallback((message: string, callback?: (confirmed: boolean) => void) => {
    webAppRef.current?.showConfirm(message, callback);
  }, []);

  const hapticFeedback = useCallback((type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') => {
    const tg = webAppRef.current;
    if (!tg?.HapticFeedback) return;

    switch (type) {
      case 'success':
      case 'error':
      case 'warning':
        tg.HapticFeedback.notificationOccurred(type);
        break;
      case 'light':
      case 'medium':
      case 'heavy':
        tg.HapticFeedback.impactOccurred(type);
        break;
    }
  }, []);

  const close = useCallback(() => {
    webAppRef.current?.close();
  }, []);

  const expand = useCallback(() => {
    webAppRef.current?.expand();
  }, []);

  const enableClosingConfirmation = useCallback(() => {
    webAppRef.current?.enableClosingConfirmation();
  }, []);

  const disableClosingConfirmation = useCallback(() => {
    webAppRef.current?.disableClosingConfirmation();
  }, []);

  const openLink = useCallback((url: string) => {
    webAppRef.current?.openLink(url);
  }, []);

  const setHeaderColor = useCallback((color: string) => {
    if (webAppRef.current) {
      webAppRef.current.headerColor = color;
    }
  }, []);

  const setBackgroundColor = useCallback((color: string) => {
    if (webAppRef.current) {
      webAppRef.current.backgroundColor = color;
    }
  }, []);

  return {
    webApp: webAppRef.current,
    user: userRef.current,
    isReady,
    colorScheme,
    showPopup,
    showConfirm,
    hapticFeedback,
    close,
    expand,
    enableClosingConfirmation,
    disableClosingConfirmation,
    openLink,
    setHeaderColor,
    setBackgroundColor,
  };
}

function applyTelegramTheme(tg: typeof window.Telegram.WebApp) {
  const themeParams = tg.themeParams || {};
  const root = document.documentElement;

  // Map Telegram theme parameters to CSS variables
  const themeMap: Record<string, string | undefined> = {
    '--tg-theme-bg-color': themeParams.bg_color,
    '--tg-theme-text-color': themeParams.text_color,
    '--tg-theme-hint-color': themeParams.hint_color,
    '--tg-theme-link-color': themeParams.link_color,
    '--tg-theme-button-color': themeParams.button_color,
    '--tg-theme-button-text-color': themeParams.button_text_color,
    '--tg-theme-secondary-bg-color': themeParams.secondary_bg_color,
    '--tg-theme-header-bg-color': themeParams.header_bg_color,
    '--tg-theme-header-text-color': themeParams.header_text_color,
    '--tg-theme-accent-text-color': themeParams.accent_text_color,
    '--tg-theme-section-bg-color': themeParams.section_bg_color,
    '--tg-theme-section-header-text-color': themeParams.section_header_text_color,
    '--tg-theme-subtitle-text-color': themeParams.subtitle_text_color,
    '--tg-theme-destructive-text-color': themeParams.destructive_text_color,
  };

  // Apply theme variables to root element
  Object.entries(themeMap).forEach(([property, value]) => {
    if (value) {
      root.style.setProperty(property, value);
    }
  });

  // Set body background and text color
  if (themeParams.bg_color) {
    document.body.style.backgroundColor = themeParams.bg_color;
  }
  if (themeParams.text_color) {
    document.body.style.color = themeParams.text_color;
  }

  // Add color scheme class
  document.body.classList.remove('light-theme', 'dark-theme');
  document.body.classList.add(tg.colorScheme === 'dark' ? 'dark-theme' : 'light-theme');

  logger.telegram('Theme applied', {
    colorScheme: tg.colorScheme,
    themeParams,
  });
}
