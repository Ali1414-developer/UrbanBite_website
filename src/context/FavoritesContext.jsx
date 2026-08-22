import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);
const FAVORITES_KEY = 'urbanbite_favorites';

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : ['bg-1', 'pz-1', 'ck-1', 'fs-1'];
    } catch (e) {
      return ['bg-1', 'pz-1', 'ck-1', 'fs-1'];
    }
  });

  // Sync favorites from backend if logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchBackendFavorites = async () => {
      try {
        const { data } = await api.get('/users/favorites');
        if (data.success && Array.isArray(data.data)) {
          setFavorites(data.data);
        }
      } catch (err) {
        console.warn('Backend favorites sync warning:', err.message);
      }
    };
    fetchBackendFavorites();
  }, [isAuthenticated]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = async (foodId, foodName = 'Item') => {
    const exists = favorites.includes(foodId);

    setFavorites((prev) => {
      if (exists) {
        toast.success(`Removed ${foodName} from favorites`);
        return prev.filter((id) => id !== foodId);
      } else {
        toast.success(`Added ${foodName} to favorites!`);
        return [...prev, foodId];
      }
    });

    if (isAuthenticated) {
      try {
        if (exists) {
          await api.delete(`/users/favorites/${foodId}`);
        } else {
          await api.post(`/users/favorites/${foodId}`);
        }
      } catch (err) {
        console.warn('Backend favorite sync error:', err.message);
      }
    }
  };

  const isFavorite = (foodId) => {
    return favorites.includes(foodId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        count: favorites.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
