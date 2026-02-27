import React from "react";
import HomeView from "./HomeView";
import { useTranslate } from "../../hooks/useTranslate";

const Home = () => {
  const t = useTranslate(); // ambil teks sesuai bahasa aktif

  return (
    <div>
      <HomeView t={t} />
    </div>
  );
};

export default Home;
