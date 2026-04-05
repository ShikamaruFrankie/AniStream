import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import { Search, Filter } from 'lucide-react';
import './Catalog.css';
import { fetchTrendingAnime, fetchSearchAnime } from '../utils/anilistApi';
import type { AnimeListItem } from '../utils/anilistApi';

const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Slice of Life'];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';

  const [activeGenre, setActiveGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [catalogData, setCatalogData] = useState<AnimeListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync internal state if URL changes from global Navbar
    setSearchQuery(urlSearchQuery);
    
    setLoading(true);
    const fetchFn = urlSearchQuery 
      ? () => fetchSearchAnime(urlSearchQuery) 
      : fetchTrendingAnime;

    fetchFn()
      .then(data => {
        setCatalogData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [urlSearchQuery]);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        setSearchParams({ search: searchQuery.trim() });
      } else {
        searchParams.delete('search');
        setSearchParams(searchParams);
      }
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '20vh'}}>Loading...</div>;

  return (
    <div className="catalog-page animate-fade-in">
      <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        
        <div className="catalog-header">
          <h1>Browse Anime</h1>
          
          <div className="catalog-controls">
            <div className="search-box glass-panel">
              <Search size={20} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyPress}
              />
            </div>
            
            <button className="btn-secondary filter-btn">
              <Filter size={20} /> Filters
            </button>
          </div>
        </div>

        <div className="genres-filter">
          {genres.map(genre => (
            <button 
              key={genre} 
              className={`genre-pill ${activeGenre === genre ? 'active' : ''}`}
              onClick={() => setActiveGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="catalog-grid">
          {catalogData.map((anime, index) => (
            <AnimeCard key={anime.id} anime={anime} index={index} />
          ))}
        </div>

        <div className="load-more">
          <button className="btn-primary">Load More Anime</button>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
