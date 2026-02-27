import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FaMoon, FaSun, FaSearch } from "react-icons/fa";
import ThemeContext from "../context/ThemeContext";
import { useBahasa } from "../context/bahasaContext";
import { translations } from "../../translations";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { state, dispatch } = useBahasa();
  const t = translations[state.language]; // ambil teks sesuai bahasa aktif

  const goToSearch = () => {
    navigate("/search"); // langsung pindah ke halaman search
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold transition-colors duration-300"
        >
          <span className="text-white">PopCorn</span>
          <span className="text-red-500">Play</span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition"
            >
              {t.home}
            </Link>
            <Link
              to="/movies"
              className="text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition"
            >
              {t.movies}
            </Link>
            <Link
              to="/series"
              className="text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition"
            >
              {t.series}
            </Link>
            <Link
              to="/favorite"
              className="text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition"
            >
              {t.favorite || "Favorite"}
            </Link>
          </div>

          {/* Icon search */}
          <button
            onClick={goToSearch}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <FaSearch size={16} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center"
          >
            {theme === "light" ? <FaMoon size={16} /> : <FaSun size={16} />}
          </button>

          {/* Language switcher */}
          <select
            value={state.language}
            onChange={(e) =>
              dispatch({ type: "SET_LANGUAGE", payload: e.target.value })
            }
            className="bg-[#1e2028] text-white rounded px-3 py-1"
          >
            <option value="en">English</option>
            <option value="id">Indonesia</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
