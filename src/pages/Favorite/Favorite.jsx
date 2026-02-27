import React, { useEffect, useReducer } from 'react';
import FavoriteView from './FavoriteView';

const loadFavoritesFromStorage = () => {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const initialState = {
  favorites: [],
  loading: true,
};

const favoriteReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_FAVORITES':
      return {
        ...state,
        favorites: loadFavoritesFromStorage(),
        loading: false,
      };
    default:
      return state;
  }
};

const Favorite = () => {
  const [state, dispatch] = useReducer(favoriteReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_FAVORITES' });
  }, []);

  return <FavoriteView favorites={state.favorites} loading={state.loading} />;
};

export default Favorite;