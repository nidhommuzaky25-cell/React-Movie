import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FavoriteContext = createContext();

const loadFavoritesFromStorage = () => {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

const initialState = {
  favorites: [],
  loading: true,
};

const favoriteReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      const movie = action.payload;
      if (!state.favorites.find(fav => fav.id === movie.id)) {
        const newFavorites = [...state.favorites, movie];
        saveFavoritesToStorage(newFavorites);
        return { ...state, favorites: newFavorites };
      }
      return state;
    }
    case 'REMOVE_FAVORITE': {
      const movieId = action.payload;
      const newFavorites = state.favorites.filter(fav => fav.id !== movieId);
      saveFavoritesToStorage(newFavorites);
      return { ...state, favorites: newFavorites };
    }
    case 'LOAD_FAVORITES':
      return { ...state, favorites: loadFavoritesFromStorage(), loading: false };
    default:
      return state;
  }
};

export const FavoriteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoriteReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_FAVORITES' });
  }, []);

  const addFavorite = React.useCallback((movie) => {
    dispatch({ type: 'ADD_FAVORITE', payload: movie });
  }, []);

  const removeFavorite = React.useCallback((movieId) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: movieId });
  }, []);

  return (
    <FavoriteContext.Provider value={{ favorites: state.favorites, loading: state.loading, addFavorite, removeFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
};