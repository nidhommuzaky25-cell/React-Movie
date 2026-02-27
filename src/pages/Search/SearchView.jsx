// src/pages/search/SearchView.jsx
import ListMovie from "../../components/ListMovie";
import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { useTranslate } from "../../hooks/useTranslate"; // 🆕 tambahkan hook translate

const SearchView = ({ query, setQuery, results, handleSearch }) => {
  const { theme } = useContext(ThemeContext);
  const t = useTranslate(); // 🆕 ambil teks terjemahan aktif

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1
        className={`text-3xl font-bold text-center mb-6 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {t.search || "Search Movies"} {/* 🆕 gunakan translate */}
      </h1>

      <form
        onSubmit={handleSearch}
        className="flex justify-center gap-2 mb-10"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            t.language === "indonesia"
              ? ""
              : "Search movies..."
          } // 🆕 placeholder dinamis
          className={`px-4 py-2 rounded-lg w-80 outline-none ${
            theme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800"
          }`}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg font-semibold ${
            theme === "dark"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {t.search || "Search"} {/* 🆕 tombol ikut translate */}
        </button>
      </form>

      {/* Jika hasil pencarian ada, tampilkan menggunakan ListMovie */}
      {results.length > 0 ? (
        <ListMovie movies={results} isSearchMode={true} />
      ) : (
        <p className="text-center text-gray-500">
          {query
            ? t.language === "indonesia"
              ? ""
              : "No results found."
            : t.language === "indonesia"
              ? ""
              : "Type a keyword to search movies."}
        </p>
      )}
    </div>
  );
};

export default SearchView;
