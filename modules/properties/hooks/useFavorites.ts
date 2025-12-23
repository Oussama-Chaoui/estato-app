import { useState, useEffect } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [count, setCount] = useState(0);

  // Load favorites from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
      setFavorites(storedFavorites);
      setCount(storedFavorites.length);
    };

    loadFavorites();

    // Listen for storage changes (when favorites are updated from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favoriteProperties') {
        loadFavorites();
      }
    };

    // Listen for custom favorites update event
    const handleFavoritesUpdated = (e: CustomEvent) => {
      setFavorites(e.detail);
      setCount(e.detail.length);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated as EventListener);
    };
  }, []);

  return { favorites, count };
}; 