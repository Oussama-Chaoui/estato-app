'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useI18n } from '@/common/providers/I18nProvider';

// RTL languages configuration
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'sd'];

type Direction = 'ltr' | 'rtl';

interface DirectionContextType {
  direction: Direction;
  isRTL: boolean;
  setDirection: (direction: Direction) => void;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export const useDirection = () => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
};

interface DirectionProviderProps {
  children: ReactNode;
}

export const DirectionProvider = ({ children }: DirectionProviderProps) => {
  const { currentLocale } = useI18n();
  const [direction, setDirection] = useState<Direction>('ltr');

  const isRTL = direction === 'rtl';

  // Update direction when locale changes
  useEffect(() => {
    const newDirection = RTL_LANGUAGES.includes(currentLocale) ? 'rtl' : 'ltr';
    setDirection(newDirection);
    
    // Update document direction and font
    document.documentElement.dir = newDirection;
    document.documentElement.lang = currentLocale;
    
    // Apply Arabic font for RTL languages
    if (newDirection === 'rtl') {
      document.documentElement.classList.add('font-arabic');
      document.body.classList.add('font-arabic');
    } else {
      document.documentElement.classList.remove('font-arabic');
      document.body.classList.remove('font-arabic');
    }
  }, [currentLocale]);

  const handleSetDirection = (newDirection: Direction) => {
    setDirection(newDirection);
    document.documentElement.dir = newDirection;
    
    // Apply Arabic font for RTL languages
    if (newDirection === 'rtl') {
      document.documentElement.classList.add('font-arabic');
      document.body.classList.add('font-arabic');
    } else {
      document.documentElement.classList.remove('font-arabic');
      document.body.classList.remove('font-arabic');
    }
  };

  return (
    <DirectionContext.Provider value={{ direction, isRTL, setDirection: handleSetDirection }}>
      {children}
    </DirectionContext.Provider>
  );
};
