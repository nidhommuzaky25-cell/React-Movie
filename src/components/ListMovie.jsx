import { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import { useBahasa } from "../context/bahasaContext";
import { translations } from "../../translations";

const ListMovie = ({ movies: propMovies = [], isSearchMode = false }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const { state } = useBahasa();
  const t = translations[state.language] || translations.en; // fallback

  // 🔹 Fetch film populer (hanya jika bukan search)
  const fetchMovies = async (page = 1) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?language=${
          state.language === "id" ? "id-ID" : "en-US"
        }&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_KEY_TMDB}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch movies");
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  useEffect(() => {
    if (!isSearchMode) fetchMovies(currentPage);
  }, [currentPage, isSearchMode, state.language]);

  const movieList = isSearchMode ? propMovies : movies;

  // --- Auto Scroll ---
  const handleMouseMove = (e) => {
    const container = scrollRef.current;
    if (!container) return;
    const { left, right, width } = container.getBoundingClientRect();
    const x = e.clientX;
    const leftZone = left + width * 0.1;
    const rightZone = right - width * 0.1;
    clearInterval(scrollIntervalRef.current);

    if (x < leftZone) {
      scrollIntervalRef.current = setInterval(() => {
        container.scrollLeft -= 10;
      }, 16);
    } else if (x > rightZone) {
      scrollIntervalRef.current = setInterval(() => {
        container.scrollLeft += 10;
      }, 16);
    }
  };

  const stopScroll = () => clearInterval(scrollIntervalRef.current);

  return (
    <div
      className={`p-8 min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-black via-[#1a0000] to-black text-white"
          : "bg-gradient-to-b from-gray-100 via-white to-gray-200 text-gray-900"
      }`}
    >
      {/* Judul Section */}
      <h2
        className={`text-2xl font-bold mb-6 text-left drop-shadow-md ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {isSearchMode ? t.searchResults || "Search Results" : t.popular || "Popular Movies"}
      </h2>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
        onMouseMove={handleMouseMove}
        onMouseLeave={stopScroll}
      >
        {movieList.length > 0 ? (
          movieList.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className={`relative group flex-shrink-0 w-52 h-80 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
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

              {/* Overlay Info */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 p-4 flex flex-col justify-end ${
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
                  {movie.overview ||
                    (state.language === "id"
                      ? "Tidak ada deskripsi tersedia."
                      : "No description available.")}
                </p>
                {movie.release_date && (
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t.release || "Release"}: {movie.release_date}
                  </p>
                )}
              </div>

              {/* Rating */}
              {movie.vote_average && (
                <div
                  className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-md shadow-md ${
                    theme === "dark"
                      ? "bg-red-600 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  ⭐ {movie.vote_average.toFixed(1)}
                </div>
              )}
            </Link>
          ))
        ) : (
          <p className="text-center w-full">
            {isSearchMode
              ? t.noResults || "No results found."
              : t.loadingMovies || "Loading movies..."}
          </p>
        )}
      </div>

      {/* Pagination */}
      {!isSearchMode && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-1 rounded-md font-semibold disabled:opacity-50 transition-colors duration-300 ${
              theme === "dark"
                ? "bg-gray-800 text-gray-300 hover:bg-red-700 hover:text-white"
                : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            {t.previous || "Previous"}
          </button>

          <span
            className={`font-medium ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {t.pageOf
              ? t.pageOf.replace("{current}", currentPage).replace("{total}", totalPages)
              : `Page ${currentPage} of ${totalPages}`}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-1 rounded-md font-semibold disabled:opacity-50 transition-colors duration-300 ${
              theme === "dark"
                ? "bg-gray-800 text-gray-300 hover:bg-red-700 hover:text-white"
                : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            {t.next || "Next"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ListMovie;
