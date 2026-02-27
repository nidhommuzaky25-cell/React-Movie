// src/pages/Detail/MovieDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieDetailView from "./MovieDetailView";
import { useTranslate } from "../../hooks/useTranslate"; // ✅ Tambahkan hook translate

const API_KEY = "a9056bdddd286d24f60cebb84a5babeb";
const BASE_URL = "https://api.themoviedb.org/3";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const t = useTranslate(); // ✅ gunakan sistem translate

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Jalankan semua fetch bersamaan agar lebih cepat
        const [movieRes, creditsRes, similarRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`),
          fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`),
        ]);

        if (!movieRes.ok || !creditsRes.ok || !similarRes.ok) {
          throw new Error("Failed to fetch movie data");
        }

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();
        const similarData = await similarRes.json();

        setMovie(movieData);
        setCredits(creditsData.cast?.slice(0, 10) || []);
        setSimilar(similarData.results?.slice(0, 6) || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  // ✅ Gunakan teks dari translate
  if (loading) return <p className="text-center text-lg p-8">{t.loading || "Loading..."}</p>;
  if (error) return <p className="text-center text-red-500">{t.errorFetching || "Terjadi kesalahan saat memuat data"}</p>;
  if (!movie) return <p className="text-center">{t.noMovieData || "Data film tidak ditemukan"}</p>;

  return <MovieDetailView movie={movie} credits={credits} similar={similar} />;
}
