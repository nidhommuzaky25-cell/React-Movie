// src/components/ListMovieCard.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import { useTranslate } from "../hooks/useTranslate";

const ListMovieCard = ({ movie }) => {
  const { theme } = useContext(ThemeContext);
  const t = useTranslate();

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="relative group flex-shrink-0 w-52 h-80 transition-transform duration-300"
    >
      {/* Poster */}
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={movie.title}
        className="w-full h-full object-cover rounded-2xl"
      />

      {/* Overlay Detail */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 p-4 flex flex-col justify-end rounded-2xl ${
          theme === "dark"
            ? "bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100"
            : "bg-gradient-to-t from-white/80 via-white/50 to-transparent opacity-0 group-hover:opacity-100"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-1 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {movie.title}
        </h3>
        <p
          className={`text-xs line-clamp-3 mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {movie.overview || t.noDescription}
        </p>
        {movie.release_date && (
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {t.release}: {movie.release_date}
          </p>
        )}
      </div>

      {/* Rating */}
      {movie.vote_average && (
        <div
          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-md ${
            theme === "dark" ? "bg-red-600 text-white" : "bg-red-500 text-white"
          }`}
        >
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      )}
    </Link>
  );
};

export default ListMovieCard;
