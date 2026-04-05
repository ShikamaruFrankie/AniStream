import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Play, Star, Heart, Share2, Plus } from 'lucide-react';
import './AnimeDetail.css';
import { fetchAnimeDetail } from '../utils/anilistApi';
import type { AnimeDetail as AnimeDetailType } from '../utils/anilistApi';

const AnimeDetail = () => {
  const params = useParams();
  const id = params['*'];

  const [anime, setAnime] = useState<AnimeDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchAnimeDetail(id)
      .then(data => {
        setAnime(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container" style={{ paddingTop: '20vh', textAlign: 'center' }}>Loading Details...</div>;
  if (!anime) return <div className="container" style={{ paddingTop: '20vh', textAlign: 'center' }}>Anime not found</div>;

  return (
    <div className="anime-detail-page animate-fade-in">
      <div className="detail-banner" style={{ backgroundImage: `url(${anime.cover || anime.image})` }}>
        <div className="banner-overlay"></div>
      </div>

      <div className="container detail-content">
        <div className="detail-grid">
          {/* Sidebar / Poster */}
          <div className="detail-sidebar animate-slide-up">
            <div className="poster-wrapper glass-panel">
              <img src={anime.image} alt={anime.title} />
            </div>
            <div className="action-buttons">
              <Link to={`/watch/${anime.episodes?.[0]?.id || id}`} className="btn-primary w-full">
                <Play size={20} fill="currentColor" /> Watch Episode 1
              </Link>
              <div className="secondary-actions">
                <button className="btn-icon" title="Add to List"><Plus size={20} /></button>
                <button className="btn-icon" title="Favorite"><Heart size={20} /></button>
                <button className="btn-icon" title="Share"><Share2 size={20} /></button>
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="detail-main animate-slide-up animate-stagger-1">
            <h1 className="detail-title">{anime.title}</h1>
            
            <div className="detail-meta">
              <span className="meta-item rating">
                <Star size={16} fill="var(--color-primary)" color="var(--color-primary)" />
                {anime.rating}
              </span>
              <span className="meta-divider">•</span>
              <span className="meta-item">{anime.year}</span>
              <span className="meta-divider">•</span>
              <span className="meta-item">{anime.status}</span>
              <span className="meta-divider">•</span>
              <span className="meta-item">{anime.episodes?.length || 0} Episodes</span>
            </div>

            <div className="detail-genres">
              {(anime.genres || []).map((genre: string) => (
                <span key={genre} className="genre-tag">{genre}</span>
              ))}
            </div>

            <div className="detail-synopsis">
              <h3>Synopsis</h3>
              <p>{anime.description}</p>
            </div>

            <div className="episodes-section mt-4">
              <h3>Episodes</h3>
              <div className="episodes-list">
                {anime.episodes?.map((ep: any) => (
                  <Link to={`/watch/${ep.id}`} key={ep.id} className="episode-item glass-panel">
                    <div className="episode-number">{ep.number}</div>
                    <div className="episode-info">
                      <h4>{ep.title || `Episode ${ep.number}`}</h4>
                      {ep.description && <p className="text-muted">{ep.description}</p>}
                    </div>
                    <Play className="play-icon" size={20} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
