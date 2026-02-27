// src/pages/Detail/SeriesDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SeriesDetailView from "./SeriesDetailView";
import { useBahasa } from "../../context/bahasaContext";

const API_KEY = "a9056bdddd286d24f60cebb84a5babeb";
const BASE_URL = "https://api.themoviedb.org/3";

export default function SeriesDetail() {
  const { id } = useParams();
  const { state } = useBahasa(); // 🔄 ambil bahasa aktif
  const [series, setSeries] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeriesDetail = async () => {
      try {
        setLoading(true);

        const language = state.language === "id" ? "id-ID" : "en-US";

        const [seriesRes, creditsRes] = await Promise.all([
          fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${language}`),
          fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=${language}`),
        ]);

        if (!seriesRes.ok || !creditsRes.ok)
          throw new Error("Failed to fetch series data");

        const seriesData = await seriesRes.json();
        const creditsData = await creditsRes.json();

        setSeries(seriesData);
        setCredits(creditsData.cast || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesDetail();
  }, [id, state.language]); // 🔁 update kalau bahasa diganti

  if (loading)
    return (
      <p className="text-center text-lg p-8">
        {state.language === "id" ? "Memuat..." : "Loading..."}
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500">
        {state.language === "id"
          ? "Gagal memuat data serial."
          : "Failed to load series data."}
      </p>
    );

  if (!series)
    return (
      <p className="text-center">
        {state.language === "id"
          ? "Data serial tidak ditemukan."
          : "No series data found."}
      </p>
    );

  return <SeriesDetailView series={series} credits={credits} />;
}
