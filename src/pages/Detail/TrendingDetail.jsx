// src/pages/Detail/TrendingDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ThemeContext from "../../context/ThemeContext";
import MovieDetail from "./MovieDetail"; // tetap file lama
import SeriesDetail from "./SeriesDetail"; // tetap file lama

const TrendingDetail = () => {
  const { id, media_type } = useParams();
  const [detail, setDetail] = useState(null);
  const [cast, setCast] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchTrendingDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/${media_type}/${id}?append_to_response=credits`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_KEY_TMDB}`,
            },
          }
        );
        const data = await res.json();
        setDetail(data);
        setCast(data.credits?.cast?.slice(0, 10) || []);
        setSeasons(data.seasons || []);
      } catch (err) {
        console.error("Error fetching trending detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingDetail();
  }, [id, media_type]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!detail) return <div className="min-h-screen flex items-center justify-center">Detail not found.</div>;

  // Pilih tampilan detail sesuai media_type
  if (media_type === "movie") {
    return <MovieDetail detail={detail} cast={cast} theme={theme} />;
  } else if (media_type === "tv") {
    return <SeriesDetail detail={detail} cast={cast} seasons={seasons} theme={theme} />;
  } else {
    return <div className="min-h-screen flex items-center justify-center">Unsupported media type</div>;
  }
};

export default TrendingDetail;
