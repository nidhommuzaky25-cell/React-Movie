// src/pages/home/HomeView.jsx
import { useContext } from "react";
import ListTrending from "../../components/ListTrending";
import ListSeries from "../../components/ListSeries";
import ListNowPlaying from "../../components/ListNowPlaying";
import Footer from "../../components/Footer";
import ListMovie from "../../components/ListMovie";
import ThemeContext from "../../context/ThemeContext";
import ListTrendingVideo from "../../components/ListTrendingVideo";
import { useTranslate } from "../../hooks/useTranslate"; // 🆕 import hook terjemahan

const HomeView = () => {
  const { theme } = useContext(ThemeContext);
  const t = useTranslate(); // 🆕 ambil teks sesuai bahasa aktif

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* 🔻 Contoh penggunaan terjemahan */}

      <ListTrendingVideo />
      <ListTrending />

      <ListNowPlaying />

      <ListMovie />

      <ListSeries />

      <Footer />
    </div>
  );
};

export default HomeView;
