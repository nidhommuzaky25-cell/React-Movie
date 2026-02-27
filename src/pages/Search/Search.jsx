// src/pages/search/Search.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SearchView from "./SearchView";
import { useTranslate } from "../../hooks/useTranslate"; // 🆕 import hook translate

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const query = searchParams.get("query") || "";
  const t = useTranslate(); // 🆕 ambil bahasa aktif

  // 🔍 Fungsi untuk melakukan pencarian
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ query }); // simpan ke URL
  };

  // 🧠 Ambil data otomatis saat query atau bahasa berubah
  useEffect(() => {
    const fetchData = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await axios.get("https://api.themoviedb.org/3/search/movie", {
          params: {
            query: query,
            // 🆕 Gunakan kode bahasa dari sistem translate (misal "id-ID" / "en-US")
            language: t.language === "indonesia" ? "id-ID" : "en-US",
          },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_KEY_TMDB}`,
          },
        });

        setResults(res.data.results || []);
      } catch (err) {
        console.error("Error fetching search:", err);
      }
    };

    fetchData();
  }, [query, t.language]); // 🆕 re-render saat bahasa berubah

  return (
    <SearchView
      query={query}
      setQuery={(val) => setSearchParams({ query: val })}
      results={results}
      handleSearch={handleSearch}
      t={t} // 🆕 kirim translate ke komponen tampilan
    />
  );
};

export default Search;
