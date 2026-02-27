// src/store.js
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "./reducer/favoriteReducer"; // pastikan path benar

const store = configureStore({
  reducer: {
    favorites: favoriteReducer,
  },
});

export default function StoreProvider({ children }) {
  return React.createElement(Provider, { store }, children);
}
