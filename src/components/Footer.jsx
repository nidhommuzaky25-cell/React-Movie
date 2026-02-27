import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import { useBahasa } from "../context/bahasaContext";

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useBahasa(); // ambil fungsi translate

  return (
    <footer
      className={`border-t mt-10 py-8 px-4 text-center transition-colors duration-500 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-2 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        PopCornPlay
      </h2>

      <p className="max-w-xl mx-auto mb-4 text-sm">{t("footerDescription")}</p>

      <div
        className={`my-4 w-3/4 mx-auto border-t ${
          theme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}
      ></div>

      <p
        className={`text-sm ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        © {new Date().getFullYear()}{" "}
        <span
          className={`font-semibold ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          PopCornPlay
        </span>{" "}
        {t("footerRights")}
      </p>
    </footer>
  );
};

export default Footer;
