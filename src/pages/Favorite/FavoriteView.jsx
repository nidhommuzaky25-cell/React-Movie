// src/pages/Favorite/FavoriteView.jsx
import React, { useContext } from "react";
import ListMovieCard from "../../components/ListMovieCard";
import ThemeContext from "../../context/ThemeContext";
import { useBahasa } from "../../context/bahasaContext";
import { translations } from "../../../translations";

function FavoriteView({ favorites, loading }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const { state } = useBahasa();
  const t = translations[state.language];

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
            : "bg-gradient-to-br from-gray-100 via-white to-gray-200"
        }`}
      >
        <div
          className={`text-center backdrop-blur-md p-6 rounded-2xl shadow-lg ${
            isDark ? "bg-white/5" : "bg-black/5"
          }`}
        >
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
              isDark ? "border-red-600" : "border-red-500"
            }`}
          ></div>
          <p
            className={`text-lg tracking-wide ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
            : "bg-gradient-to-br from-gray-100 via-white to-gray-200"
        }`}
      >
        <div
          className={`text-center backdrop-blur-md p-10 rounded-3xl shadow-xl border ${
            isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-gray-300"
          }`}
        >
          <div className="text-6xl mb-4">❤️</div>
          <h2
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t.emptyTitle}
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            {t.emptyDesc}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div
          className={`mb-10 p-6 rounded-2xl backdrop-blur-md border shadow-lg ${
            isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-gray-300"
          }`}
        >
          <h1
            className={`text-3xl font-extrabold mb-2 drop-shadow ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {t.headerTitle}
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            {t.headerDesc}
          </p>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              className="transform hover:scale-105 hover:shadow-[0_0_15px_rgba(255,50,50,0.4)] transition-all duration-300 rounded-2xl"
            >
              <ListMovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Footer Count */}
        {favorites.length > 0 && (
          <div
            className={`mt-10 text-center backdrop-blur-md p-4 rounded-xl border inline-block shadow-lg ${
              isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-gray-300"
            }`}
          >
            <p
              className={`tracking-wide ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t.showing}{" "}
              <span className="text-red-500 font-semibold">
                {favorites.length}
              </span>{" "}
              {t.count}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoriteView;
