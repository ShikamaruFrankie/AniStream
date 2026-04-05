import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import './AnimeCard.css';
import type { AnimeListItem } from '../utils/anilistApi';

interface AnimeCardProps {
  anime: AnimeListItem;
  index: number;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, index }) => {
  // Use index to calculate staggered animation delay classes if desired
  const delayClass = `animate-stagger-${(index % 4) + 1}`;

  return (
    <Link to={`/anime/${anime.id}`} className={`anime-card animate-fade-in ${delayClass}`}>
      <div className="card-image-wrapper">
        <img src={anime.image} alt={anime.title} loading="lazy" />
        <div className="card-overlay">
          <div className="play-button">
            <Play fill="white" size={24} />
          </div>
        </div>

      </div>
      <div className="card-content">
        <h3 className="card-title">{anime.title}</h3>
        <div className="card-badges">
          <span className="badge rating">
            <Star size={12} fill="currentColor" /> {anime.rating || 'N/A'}
          </span>
          <span className="badge type">{anime.type}</span>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
