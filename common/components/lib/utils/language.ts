export const getUserLanguage = (): string => {
  if (typeof window === 'undefined') {
    return 'fr'; // Default fallback for SSR
  }
  return localStorage.getItem('user-lang') || 'fr';
};

export const setUserLanguage = (lang: string): void => {
  if (typeof window === 'undefined') {
    return; // Don't try to access localStorage during SSR
  }
  localStorage.setItem('user-lang', lang);
};
