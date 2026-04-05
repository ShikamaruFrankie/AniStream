import { useState, useEffect } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import AnimeCard from '../components/AnimeCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTrendingAnime, fetchPopularAnime, fetchActionHits } from '../utils/anilistApi';
import type { AnimeListItem } from '../utils/anilistApi';

const Home = () => {
  const [trendingAnime, setTrendingAnime] = useState<AnimeListItem[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeListItem[]>([]);
  const [actionAnime, setActionAnime] = useState<AnimeListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const trending = await fetchTrendingAnime();
        setTrendingAnime(trending);
        const popular = await fetchPopularAnime();
        setPopularAnime(popular);
        const action = await fetchActionHits();
        setActionAnime(action);
      } catch (err) {
        console.error('Failed to fetch anime', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="container" style={{ paddingTop: '20vh', textAlign: 'center' }}>Loading Anime...</div>;

  return (
    <div className="home-page animate-fade-in">
      <HeroCarousel />
      
      <div className="container" style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-lg)' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>Trending Now</h2>
            <p className="text-muted">Most popular shows this week</p>
          </div>
          <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)', fontWeight: 600 }}>
            View All <ChevronRight size={20} />
          </Link>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--spacing-lg)' 
        }}>
          {trendingAnime.map((anime, index) => (
            <AnimeCard key={anime.id} anime={anime} index={index} />
          ))}
        </div>
      </div>

      <div className="container" style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-lg)' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>All-Time Popular</h2>
            <p className="text-muted">Masterpieces you shouldn't miss</p>
          </div>
          <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)', fontWeight: 600 }}>
            View All <ChevronRight size={20} />
          </Link>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--spacing-lg)' 
        }}>
          {popularAnime.map((anime, index) => (
            <AnimeCard key={anime.id} anime={anime} index={index} />
          ))}
        </div>
      </div>

      <div className="container" style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-lg)' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>Top Action Hits</h2>
            <p className="text-muted">High-octane battles and epic stories</p>
          </div>
          <Link to="/catalog?search=Action" style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)', fontWeight: 600 }}>
            View All <ChevronRight size={20} />
          </Link>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--spacing-lg)' 
        }}>
          {actionAnime.map((anime, index) => (
            <AnimeCard key={anime.id} anime={anime} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
