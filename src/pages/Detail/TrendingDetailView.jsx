// src/pages/Detail/TrendingDetailView.jsx
const TrendingDetailView = ({ detail, cast, seasons, loading, theme }) => {
  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen text-xl ${
          theme === "dark" ? "text-white bg-black" : "text-gray-800 bg-white"
        }`}
      >
        Loading...
      </div>
    );
  }

  if (!detail) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen text-xl ${
          theme === "dark" ? "text-white bg-black" : "text-gray-800 bg-white"
        }`}
      >
        Detail not found.
      </div>
    );
  }

  const backdrop = detail.backdrop_path
    ? `https://image.tmdb.org/t/p/original${detail.backdrop_path}`
    : null;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Banner Section */}
      <div
        className="relative w-full h-[60vh] flex items-end bg-cover bg-center"
        style={{
          backgroundImage: backdrop
            ? `url(${backdrop})`
            : "linear-gradient(to bottom, #111, #000)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 p-8 flex items-end">
          <img
            src={
              detail.poster_path
                ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={detail.title || detail.name}
            className="w-48 h-72 object-cover rounded-xl shadow-lg"
          />
          <div className="ml-6 max-w-2xl">
            <h1 className="text-4xl font-bold mb-2 drop-shadow-md">
              {detail.title || detail.name}
            </h1>
            {detail.tagline && (
              <p className="text-lg mb-3 italic text-gray-300">
                {detail.tagline}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {detail.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === "dark"
                      ? "bg-red-700 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="text-base text-gray-300 mb-2 leading-relaxed">
              {detail.overview || "No description available."}
            </p>
            <p className="text-sm text-gray-400">
              ⭐ {detail.vote_average?.toFixed(1)} |{" "}
              {detail.release_date || detail.first_air_date} |{" "}
              {detail.runtime
                ? `${detail.runtime} min`
                : detail.number_of_episodes
                ? `${detail.number_of_episodes} eps`
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="px-8 py-10">
          <h2
            className={`text-3xl font-bold mb-6 ${
              theme === "dark" ? "text-red-500" : "text-red-600"
            }`}
          >
            Cast
          </h2>
          <div className="flex overflow-x-auto space-x-6 scrollbar-hide pb-4">
            {cast.map((person) => (
              <div
                key={person.id}
                className={`flex-shrink-0 w-36 text-center ${
                  theme === "dark" ? "bg-gray-900" : "bg-white"
                } rounded-xl shadow-md overflow-hidden`}
              >
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={person.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2">
                  <p className="font-semibold text-sm">{person.name}</p>
                  <p className="text-xs text-gray-400">{person.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasons Section (hanya untuk series/tv) */}
      {seasons && seasons.length > 0 && (
        <div className="px-8 py-10">
          <h2
            className={`text-3xl font-bold mb-6 ${
              theme === "dark" ? "text-red-500" : "text-red-600"
            }`}
          >
            Seasons
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {seasons.map((s) => (
              <div
                key={s.id}
                className={`rounded-xl overflow-hidden shadow-md ${
                  theme === "dark" ? "bg-gray-900" : "bg-white"
                }`}
              >
                <img
                  src={
                    s.poster_path
                      ? `https://image.tmdb.org/t/p/w300${s.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={s.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3">
                  <p className="font-semibold text-base">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.episode_count} Episodes</p>
                  <p className="text-xs text-gray-400">{s.air_date || "Unknown date"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingDetailView;
