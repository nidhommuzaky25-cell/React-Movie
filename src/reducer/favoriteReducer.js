import { createSlice } from '@reduxjs/toolkit';

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

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: loadFavoritesFromStorage(),
  },
  reducers: {
    addFavorite: (state, action) => {
      const movie = action.payload;
      if (!state.favorites.find(fav => fav.id === movie.id)) {
        state.favorites.push(movie);
        saveFavoritesToStorage(state.favorites);
      }
    },
    removeFavorite: (state, action) => {
      const movieId = action.payload;
      state.favorites = state.favorites.filter(fav => fav.id !== movieId);
      saveFavoritesToStorage(state.favorites);
    },
    loadFavorites: (state) => {
      state.favorites = loadFavoritesFromStorage();
    },
  },
});

export const { addFavorite, removeFavorite, loadFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;