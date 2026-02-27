import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../reducer/favoriteReducer";
import ThemeContext from "../../context/ThemeContext";
import { useTranslate } from "../../hooks/useTranslate";
import soundtrack from "../../assets/soundtrack/Mugenjō no Hate ni.mp3"; // ✅ import soundtrack

export default function MovieDetailView({ movie, credits, similar }) {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);
  const t = useTranslate();

  const [userRating, setUserRating] = useState(
    Number(localStorage.getItem(`rating_${movie?.id}`)) || 0
  );
  const [hover, setHover] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // ✅ tambahan untuk kontrol audio
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (movie) setIsFavorited(favorites.some((fav) => fav.id === movie.id));
  }, [favorites, movie]);

  const handleRating = (value) => {
    setUserRating(value);
    localStorage.setItem(`rating_${movie.id}`, value);
  };

  const toggleFavorite = () => {
    if (isFavorited) {
      dispatch(removeFavorite(movie.id));
    } else {
      dispatch(addFavorite(movie));
    }
    setIsFavorited(!isFavorited);
  };

  // ✅ fungsi play/pause soundtrack
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // ✅ hentikan musik otomatis saat keluar halaman
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const formatRuntime = (minutes) => {
    if (!minutes) return t.notAvailable || "Not available";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  if (!movie)
    return (
      <div
        className={`p-6 text-center text-lg ${
          theme === "dark" ? "text-gray-300 bg-black" : "text-gray-800 bg-white"
        }`}
      >
        {t.loading || "Loading..."}
      </div>
    );

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark" ? "bg-black text-gray-200" : "bg-white text-gray-900"
      }`}
    >
      {/* Banner Section */}
      <div
        className="relative h-[550px] flex items-end"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

        <div className="relative z-10 flex items-end gap-8 p-10 max-w-7xl mx-auto">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Poster"
            }
            alt={movie.title}
            className="w-56 rounded-xl shadow-2xl"
          />

          <div className="max-w-3xl">
            <div className="mb-3">
              <span className="bg-cyan-400 text-black font-semibold px-3 py-1 rounded-full text-sm">
                {movie.status}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg text-white">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="italic text-gray-300 mb-2">{movie.tagline}</p>
            )}

            <p className="text-lg text-gray-300 leading-relaxed mb-4 max-w-2xl">
              {movie.overview || t.noOverview || "No overview available."}
            </p>

            <p className="text-gray-400 text-lg mb-4">
              {t.releaseDate || "Release Date"}: {movie.release_date}
            </p>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl text-yellow-400">⭐</span>
              <span className="text-xl font-semibold text-white">
                {movie.vote_average?.toFixed(1)} / 10
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info + Rating */}
      <div className="max-w-6xl mx-auto py-12 grid md:grid-cols-2 gap-10 px-6">
        {/* Info */}
        <div>
          <h2
            className={`text-2xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.movieInfo || "Movie Information"}
          </h2>
          <div
            className={`space-y-3 text-base ${
              theme === "dark" ? "text-gray-300" : "text-gray-800"
            }`}
          >
            <p>
              <span className="font-semibold text-red-500">
                {t.originalTitle || "Original Title"}:
              </span>{" "}
              {movie.original_title}
            </p>
            <p>
              <span className="font-semibold text-red-500">
                {t.genres || "Genres"}:
              </span>{" "}
              {movie.genres?.map((g) => g.name).join(", ")}
            </p>
            <p>
              <span className="font-semibold text-red-500">
                {t.runtime || "Runtime"}:
              </span>{" "}
              {formatRuntime(movie.runtime)}
            </p>
            <p>
              <span className="font-semibold text-red-500">
                {t.popularity || "Popularity"}:
              </span>{" "}
              {movie.popularity}
            </p>
            {movie.homepage && (
              <p>
                <span className="font-semibold text-red-500">
                  {t.homepage || "Homepage"}:
                </span>{" "}
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  {movie.homepage}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h2
            className={`text-2xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.yourRating || "Your Rating"}
          </h2>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  className={`text-3xl transition-transform transform hover:scale-110 ${
                    value <= (hover || userRating)
                      ? "text-yellow-400"
                      : theme === "dark"
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleRating(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(null)}
                >
                  ★
                </button>
              );
            })}
          </div>

          {userRating > 0 && (
            <p
              className={`mt-3 text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t.youRated || "You rated this movie"} {userRating} / 10
            </p>
          )}

          <button
            onClick={toggleFavorite}
            className={`mt-6 px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isFavorited
                ? "bg-red-500 hover:bg-red-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-black"
            }`}
          >
            {isFavorited
              ? `❤️ ${t.favorited || "Favorited"}`
              : `🤍 ${t.addToFavorites || "Add to Favorites"}`}
          </button>

          {/* ✅ Tombol soundtrack khusus Kimetsu no Yaiba */}
          {movie.title?.toLowerCase().includes("kimetsu no yaiba") &&
            movie.title?.toLowerCase().includes("infinity castle") && (
              <div className="mt-6">
                <button
                  onClick={togglePlay}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isPlaying ? "⏸ Pause Soundtrack" : "🎵 Play Soundtrack"}
                </button>
                <audio ref={audioRef} src={soundtrack} />
              </div>
            )}
        </div>
      </div>

      {/* Cast */}
      {credits?.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h2
            className={`text-2xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.cast || "Cast"}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {credits.map((actor) => (
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

      {/* Similar Movies */}
      {similar?.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2
            className={`text-2xl font-bold mb-8 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.similarMovies || "Similar Movies"}
          </h2>

          <div className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4">
            {similar.map((movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                className="relative group flex-shrink-0 w-52 h-80 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 bg-gray-900"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <h3 className="text-lg font-semibold mb-1 text-white">{movie.title}</h3>
                  <p className="text-xs line-clamp-3 mb-2 text-gray-300">
                    {movie.overview || t.noDescription || "No description available."}
                  </p>
                  {movie.release_date && (
                    <p className="text-xs text-gray-400">
                      {t.release || "Release"}: {movie.release_date}
                    </p>
                  )}
                </div>

                {movie.vote_average && (
                  <div className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-md shadow-md bg-red-600 text-white">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
