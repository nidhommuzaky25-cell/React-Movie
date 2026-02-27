import React, { useState, useEffect } from 'react';

const ListTrendingVideo = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const TMDB_API_KEY = 'b35c5562c1d736c3dab4725c1d7e5bfa';
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  // Auto slide setiap 30 detik
  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const autoSlideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 30000); // 30 detik

    return () => clearInterval(autoSlideInterval);
  }, [trendingMovies.length]);

  const fetchTrendingMovies = async () => {
    try {
      const trendingResponse = await fetch(
        `${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}`
      );
      const trendingData = await trendingResponse.json();

      if (!trendingData.results || trendingData.results.length === 0) {
        setError('Tidak ada data trending yang ditemukan.');
        setLoading(false);
        return;
      }

      // Fetch video untuk 5 trending movies
      const moviesWithVideos = await Promise.all(
        trendingData.results.slice(0, 5).map(async (item) => {
          try {
            const videoResponse = await fetch(
              `${TMDB_BASE_URL}/${item.media_type}/${item.id}/videos?api_key=${TMDB_API_KEY}`
            );
            const videoData = await videoResponse.json();
            const trailer = videoData.results.find(
              video => video.type === 'Trailer' && video.site === 'YouTube'
            );

            return {
              title: item.title || item.name,
              overview: item.overview,
              videoKey: trailer?.key || null,
              rating: item.vote_average,
              backdropPath: item.backdrop_path
            };
          } catch (err) {
            return {
              title: item.title || item.name,
              overview: item.overview,
              videoKey: null,
              rating: item.vote_average,
              backdropPath: item.backdrop_path
            };
          }
        })
      );

      // Override slide pertama dengan Demon Slayer Infinity Castle
      moviesWithVideos[0] = {
        title: 'Demon Slayer: Kimetsu no Yaiba Infinity Castle Arc',
        overview: 'The Infinity Castle Arc is the final story arc of Demon Slayer. After Muzan Kibutsuji\'s attack, the Demon Slayer Corps fights in an otherworldly fortress where the laws of physics don\'t apply, facing their greatest challenge yet.',
        videoKey: 'a9tq0aS5Zu8', // Ganti dengan video key Demon Slayer yang kamu mau
        rating: 9.2,
        backdropPath: null
      };

      setTrendingMovies(moviesWithVideos);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie data:', error);
      setError('Terjadi kesalahan saat mengambil data.');
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + trendingMovies.length) % trendingMovies.length);
  };

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Mouse/Trackpad handlers for swipe
  const [mouseStart, setMouseStart] = useState(0);
  const [mouseEnd, setMouseEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setMouseEnd(0);
    setMouseStart(e.clientX);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    setMouseEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (!mouseStart || !mouseEnd) return;
    
    const distance = mouseStart - mouseEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const currentMovie = trendingMovies[currentIndex];

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-black select-none cursor-grab active:cursor-grabbing"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* Video Background */}
      {currentMovie?.videoKey ? (
        <div className="absolute inset-0 w-full h-full">
          <iframe
            key={currentMovie.videoKey}
            className="absolute top-1/2 left-1/2"
            style={{
              width: '100vw',
              height: '100vh',
              transform: 'translate(-50%, -50%) scale(1.5)',
              pointerEvents: 'none',
            }}
            src={`https://www.youtube.com/embed/${currentMovie.videoKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${currentMovie.videoKey}&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1`}
            title="Movie Trailer Background"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            loading="eager"
          />
        </div>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center flex items-center justify-center text-white text-2xl font-bold bg-gray-900"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie?.backdropPath})`,
          }}
        >
          Trailer tidak tersedia untuk film ini
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Navigation Controls - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
        {/* Indicator Dots Only */}
        <div className="flex gap-2">
          {trendingMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 w-2 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content - Title & Description with Animation (No Glassmorphism) */}
      <div className="absolute bottom-20 left-0 right-0 z-20 px-8 md:px-12 lg:px-16">
        <div 
          key={currentIndex}
          className="max-w-2xl animate-fadeInUp"
        >
          {/* Counter */}
          <div className="text-white/70 text-xs mb-3 animate-fadeIn">
            {currentIndex + 1} / {trendingMovies.length}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight animate-slideInLeft drop-shadow-2xl">
            {currentMovie?.title}
          </h1>
          
          <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-xl line-clamp-2 animate-slideInLeft animation-delay-100 drop-shadow-lg">
            {currentMovie?.overview}
          </p>

          {/* Rating */}
          {currentMovie?.rating && (
            <div className="flex items-center gap-2 mt-4 animate-fadeIn animation-delay-200">
              <span className="text-yellow-400 text-base">★</span>
              <span className="text-white font-semibold text-sm drop-shadow-lg">
                {currentMovie.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default ListTrendingVideo;