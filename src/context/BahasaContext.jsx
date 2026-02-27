import React, { createContext, useReducer, useContext } from "react";
import { translations } from "../../translations";

export const initialState = { language: "en" };

export const bahasaReducer = (state, action) => {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

const BahasaContext = createContext();

export const BahasaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bahasaReducer, initialState);

  // ✅ Tambahkan fungsi translate di sini
  const t = (key) => {
    const lang = state.language;
    return translations
    
    
    [lang]?.[key] || key;
  };

  return (
    <BahasaContext.Provider value={{ state, dispatch, t }}>
      {children}
    </BahasaContext.Provider>
  );
};

export const useBahasa = () => useContext(BahasaContext);
