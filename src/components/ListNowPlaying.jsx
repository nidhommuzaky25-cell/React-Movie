// src/components/ListNowPlaying.jsx
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import { useBahasa } from "../context/bahasaContext";
import { translations } from "../../translations";

const ListNowPlaying = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const { theme } = useContext(ThemeContext);
  const { state } = useBahasa();
  const t = translations[state.language]; // ✅ ambil teks sesuai bahasa aktif

  const navigate = useNavigate();

  // ✅ Hanya ubah teks (bukan data poster) saat translate
  const fetchNowPlaying = async (page = 1) => {
    try {
      const res = await fetch(
        // tetap gunakan bahasa EN agar poster dan isi data tetap konsisten
        `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_KEY_TMDB}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch now playing movies");
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error("Error fetching now playing:", err);
    }
  };

  useEffect(() => {
    fetchNowPlaying(currentPage);
  }, [currentPage]); // tidak refresh data saat ganti bahasa

  // --- Auto scroll ---
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
      <h2
        className={`text-2xl font-bold mb-6 text-left drop-shadow-md ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {t.nowPlaying || "Now Playing Movies"}
      </h2>

      {/* 🎬 Carousel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
        onMouseMove={handleMouseMove}
        onMouseLeave={stopScroll}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movies/${movie.id}`)}
            className={`relative group flex-shrink-0 w-52 h-80 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            {/* Poster */}
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title || movie.original_title}
              className="w-full h-full object-cover"
            />

            {/* Overlay hover */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 p-4 flex flex-col justify-end
                ${
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
                {movie.title || movie.original_title}
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
                  {state.language === "id" ? "Rilis" : "Release"}:{" "}
                  {movie.release_date}
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
          </div>
        ))}
      </div>

      {/* Pagination */}
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
          {state.language === "id" ? "Sebelumnya" : "Previous"}
        </button>

        <span
          className={`font-medium ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {state.language === "id"
            ? `Halaman ${currentPage} dari ${totalPages}`
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
          {state.language === "id" ? "Berikutnya" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default ListNowPlaying;
