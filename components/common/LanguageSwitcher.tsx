'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useI18n } from '@/common/providers/I18nProvider';
import { setUserLanguage } from '@/common/components/lib/utils/language';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/components/lib/utils/twMerge';
import Image from 'next/image';

const languages = [
  { code: 'en', name: 'English', countryCode: 'us' },
  { code: 'fr', name: 'Français', countryCode: 'fr' },
  { code: 'es', name: 'Español', countryCode: 'es' },
  { code: 'ar', name: 'العربية', countryCode: 'ma' },
];

export const LanguageSwitcher = () => {
  const { t } = useTranslation(['common']);
  const { currentLocale, changeLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[1];

  const handleLanguageChange = async (locale: string) => {
    await changeLocale(locale);
    setUserLanguage(locale);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative h-11 px-3 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95",
            "bg-white/80 hover:bg-white text-gray-600 hover:text-primary-600 border border-transparent hover:border-gray-100",
            "flex items-center gap-2 font-medium text-sm"
          )}
          aria-label="Change language"
        >
          <Image
            src={`https://flagcdn.com/w20/${currentLanguage.countryCode}.png`}
            alt={`${currentLanguage.name} flag`}
            width={20}
            height={15}
            className="rounded-sm"
          />
          <span className="font-semibold">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 cursor-pointer",
              currentLocale === language.code && "bg-primary-50 text-primary-700"
            )}
          >
            <Image
              src={`https://flagcdn.com/w20/${language.countryCode}.png`}
              alt={`${language.name} flag`}
              width={20}
              height={15}
              className="rounded-sm"
            />
            <span className="flex-1 font-medium">{t(`common:languages.${language.code}`)}</span>
            {currentLocale === language.code && (
              <Check className="w-4 h-4 text-primary-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
