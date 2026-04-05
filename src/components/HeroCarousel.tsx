import { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HeroCarousel.css';
import { fetchTrendingAnime } from '../utils/anilistApi';
import type { AnimeListItem } from '../utils/anilistApi';

const HeroCarousel = () => {
  const [featuredAnime, setFeaturedAnime] = useState<AnimeListItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchTrendingAnime()
      .then(data => {
        // Take top 3 for carousel
        setFeaturedAnime(data.slice(0, 3));
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (featuredAnime.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredAnime.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredAnime]);

  if (featuredAnime.length === 0) return <div style={{ height: '70vh' }}></div>;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredAnime.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length);



  return (
    <div className="hero-carousel">
      {featuredAnime.map((anime, index) => (
        <div 
          key={anime.id} 
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${anime.cover || anime.image})` }}
        >
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <div className={`hero-info ${index === currentSlide ? 'animate-slide-up' : ''}`}>
              <div className="hero-genres">
                {(anime.genres || []).map((genre: string) => (
                  <span key={genre} className="genre-tag">{genre}</span>
                ))}
              </div>
              <h1 className="hero-title">{anime.title}</h1>
              <p className="hero-description">{anime.description}</p>
              
              <div className="hero-actions">
                <Link to={`/watch/${anime.id}-1`} className="btn-primary">
                  <Play size={20} fill="currentColor" /> Watch Now
                </Link>
                <Link to={`/anime/${anime.id}`} className="btn-secondary">
                  <Info size={20} /> More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button className="carousel-control prev" onClick={prevSlide} aria-label="Previous slide">
        <ChevronLeft size={32} />
      </button>
      <button className="carousel-control next" onClick={nextSlide} aria-label="Next slide">
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {featuredAnime.map((_, index) => (
          <button 
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
