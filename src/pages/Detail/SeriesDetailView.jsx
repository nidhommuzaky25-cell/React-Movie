// src/pages/Detail/SeriesDetailView.jsx
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ThemeContext from "../../context/ThemeContext";
import { useBahasa } from "../../context/bahasaContext";
import { translations } from "../../../translations";

const SeriesDetailView = () => {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const { state } = useBahasa();
  const t = translations[state.language]; // ambil terjemahan sesuai bahasa aktif

  const [series, setSeries] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const fetchSeriesDetail = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?append_to_response=credits`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_KEY_TMDB}`,
            },
          }
        );
        const data = await res.json();
        setSeries(data);
      } catch (err) {
        console.error("Error fetching series detail:", err);
      }
    };

    fetchSeriesDetail();

    const savedRating = localStorage.getItem(`rating_${id}`);
    if (savedRating) setUserRating(Number(savedRating));
  }, [id]);

  const handleRating = (value) => {
    setUserRating(value);
    localStorage.setItem(`rating_${id}`, value);
  };

  if (!series)
    return (
      <div
        className={`p-6 text-center text-lg ${
          theme === "dark" ? "text-gray-300 bg-black" : "text-gray-800 bg-white"
        }`}
      >
        {t.loading}
      </div>
    );

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark" ? "bg-black text-gray-200" : "bg-white text-gray-900"
      }`}
    >
      {/* ===== Banner ===== */}
      <div
        className="relative h-[550px] flex items-end"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${series.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

        <div className="relative z-10 flex items-end gap-8 p-10 max-w-7xl mx-auto">
          <img
            src={
              series.poster_path
                ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Poster"
            }
            alt={series.name}
            className="w-56 rounded-xl shadow-2xl"
          />

          <div className="max-w-3xl">
            <div className="mb-3">
              <span className="bg-cyan-400 text-black font-semibold px-3 py-1 rounded-full text-sm">
                {series.status}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg text-white">
              {series.name}
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed mb-4 max-w-2xl">
              {series.overview || t.noOverview}
            </p>

            <p className="text-gray-400 text-lg mb-4">{series.first_air_date}</p>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl text-yellow-400">⭐</span>
              <span className="text-xl font-semibold text-white">
                {series.vote_average?.toFixed(1)} / 10
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Info & Rating ===== */}
      <div className="max-w-6xl mx-auto py-12 grid md:grid-cols-2 gap-10 px-6">
        <div>
          <h2
            className={`text-2xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.seriesInfo}
          </h2>
          <div
            className={`space-y-3 text-base ${
              theme === "dark" ? "text-gray-300" : "text-gray-800"
            }`}
          >
            <p>
              <span className="font-semibold text-red-500">
                {t.originalTitle}:
              </span>{" "}
              {series.original_name}
            </p>
            <p>
              <span className="font-semibold text-red-500">{t.genres}:</span>{" "}
              {series.genres?.map((g) => g.name).join(", ")}
            </p>
            <p>
              <span className="font-semibold text-red-500">{t.seasons}:</span>{" "}
              {series.number_of_seasons}
            </p>
            <p>
              <span className="font-semibold text-red-500">{t.episodes}:</span>{" "}
              {series.number_of_episodes}
            </p>
            <p>
              <span className="font-semibold text-red-500">{t.popularity}:</span>{" "}
              {series.popularity}
            </p>
            {series.homepage && (
              <p>
                <span className="font-semibold text-red-500">{t.homepage}:</span>{" "}
                <a
                  href={series.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  {series.homepage}
                </a>
              </p>
            )}
          </div>
        </div>

        <div>
          <h2
            className={`text-2xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.yourRating}
          </h2>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  className={`text-3xl ${
                    value <= (hover || userRating)
                      ? "text-yellow-400"
                      : "text-gray-600"
                  } transition-transform transform hover:scale-110`}
                  onClick={() => handleRating(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(null)}
                >
                  ★
                </button>
              );
            })}
          </div>
          {userRating && (
            <p
              className={`mt-3 text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t.youRated} <b>{userRating}</b> / 10
            </p>
          )}
        </div>
      </div>

      {/* ===== Seasons ===== */}
      {series.seasons?.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h2
            className={`text-2xl font-bold mb-6 text-left ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.seasonList}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {series.seasons.map((s) => (
              <div
                key={s.id}
                className={`relative rounded-lg overflow-hidden shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 ${
                  theme === "dark" ? "bg-gray-900" : "bg-gray-200"
                }`}
              >
                <img
                  src={
                    s.poster_path
                      ? `https://image.tmdb.org/t/p/w300${s.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-black p-3">
                  <h3 className="text-sm font-semibold text-white truncate text-center">
                    {s.name}
                  </h3>
                  <p className="text-xs text-gray-400 text-center mt-1">
                    {s.air_date || t.noData}
                  </p>
                </div>
                <div className="absolute top-2 left-2 bg-red-600/90 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                  {s.episode_count} eps
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Cast ===== */}
      {series.credits?.cast?.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h2
            className={`text-2xl font-bold mb-6 text-left ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.cast}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {series.credits.cast.map((actor) => (
              <div
                key={actor.id}
                className={`relative rounded-xl overflow-hidden shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 ${
                  theme === "dark" ? "bg-gray-900" : "bg-gray-200"
                }`}
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={actor.name}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-black p-3">
                  <p className="text-sm font-semibold text-white truncate text-center">
                    {actor.name}
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    {actor.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesDetailView;
