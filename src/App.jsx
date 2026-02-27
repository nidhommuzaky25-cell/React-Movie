import "./App.css";
import ListSeries from "./components/ListSeries";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import ListMovie from "./components/ListMovie";
import SeriesDetail from "./pages/Detail/SeriesDetail";
import MovieDetail from "./pages/Detail/MovieDetail";
import Search from "./pages/Search/Search";
import Favorite from "./pages/Favorite/Favorite";
import StoreProvider from "./store";
import ListTrending from "./components/ListTrending";
import TrendingDetail from "./pages/Detail/TrendingDetail";
import { BahasaProvider } from "./context/bahasaContext";

function App() {
  return (
    <>
      <StoreProvider>
        <ThemeProvider>
          <BahasaProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<ListMovie />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/series" element={<ListSeries />} />
              <Route path="/series/:id" element={<SeriesDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorite" element={<Favorite />} />
              <Route path="/trending" element={<ListTrending />} />
              <Route
                path="/trending/:media_type/:id"
                element={<TrendingDetail />}
              />
            </Routes>
          </BahasaProvider>
        </ThemeProvider>
      </StoreProvider>
    </>
  );
}

export default App;
