import { useDirection } from '@/common/contexts/DirectionContext';

// RTL languages configuration
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'sd'];

// Check if a locale is RTL
export const isRTLLocale = (locale: string): boolean => {
  return RTL_LANGUAGES.includes(locale);
};

// Get the opposite direction
export const getOppositeDirection = (direction: 'ltr' | 'rtl'): 'ltr' | 'rtl' => {
  return direction === 'ltr' ? 'rtl' : 'ltr';
};

// Hook to get RTL-aware icon class
export const useRTLIcon = () => {
  const { isRTL } = useDirection();
  
  return {
    // Flip icons horizontally for RTL
    flipIcon: (className: string) => {
      return isRTL ? `${className} transform scale-x-[-1]` : className;
    },
    
    // Get directional arrow class
    getArrowClass: (direction: 'left' | 'right') => {
      if (isRTL) {
        return direction === 'left' ? 'rotate-180' : '';
      }
      return direction === 'right' ? 'rotate-180' : '';
    },
    
    // Get start/end positioning classes
    getStartClass: () => isRTL ? 'right' : 'left',
    getEndClass: () => isRTL ? 'left' : 'right',
  };
};

// Hook to get RTL-aware font class
export const useRTLFont = () => {
  const { isRTL } = useDirection();
  
  return {
    // Get the appropriate font class based on RTL state
    getFontClass: (defaultClass: string = 'font-sans') => {
      return isRTL ? 'font-arabic' : defaultClass;
    },
    
    // Get font family string
    getFontFamily: () => {
      return isRTL 
        ? 'var(--font-noto-kufi-arabic), ui-sans-serif, system-ui, sans-serif'
        : 'var(--font-montserrat), ui-sans-serif, system-ui, sans-serif';
    },
  };
};

// Utility to get logical positioning classes
export const getLogicalPosition = (isRTL: boolean) => {
  return {
    start: isRTL ? 'right' : 'left',
    end: isRTL ? 'left' : 'right',
    marginStart: isRTL ? 'mr' : 'ml',
    marginEnd: isRTL ? 'ml' : 'mr',
    paddingStart: isRTL ? 'pr' : 'pl',
    paddingEnd: isRTL ? 'pl' : 'pr',
    borderStart: isRTL ? 'border-r' : 'border-l',
    borderEnd: isRTL ? 'border-l' : 'border-r',
  };
};

// Utility to get text alignment
export const getTextAlign = (isRTL: boolean, defaultAlign: 'left' | 'right' | 'center' = 'left') => {
  if (defaultAlign === 'center') return 'text-center';
  return isRTL 
    ? (defaultAlign === 'left' ? 'text-right' : 'text-left')
    : (defaultAlign === 'left' ? 'text-left' : 'text-right');
};
