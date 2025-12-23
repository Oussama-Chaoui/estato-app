"use client";
import { createContext, useContext, ReactNode } from 'react';
import useSettings from '@/modules/settings/hooks/useSettings';
import { WEBSITE_FOCUS } from '@/modules/settings/defs/types';

interface SettingsContextType {
  websiteFocus: WEBSITE_FOCUS | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setWebsiteFocus: (focus: WEBSITE_FOCUS) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const settings = useSettings();

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}; 