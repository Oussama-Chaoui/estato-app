import { ReactNode } from 'react';
import { SettingsProvider } from '@/common/contexts/SettingsContext';
import { I18nProvider } from './I18nProvider';
import { DirectionProvider } from '@/common/contexts/DirectionContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <I18nProvider>
      <DirectionProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </DirectionProvider>
    </I18nProvider>
  );
}; 