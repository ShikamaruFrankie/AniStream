import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Play } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false); // Close mobile menu if open
    }
  };

  return (
    <header className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Play fill="var(--color-primary)" color="var(--color-primary)" size={28} />
          <span>Ani<span className="text-primary">Stream</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links desktop-only">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/catalog" className={`nav-link ${isActive('/catalog')}`}>Catalog</Link>
          <Link to="/trending" className="nav-link">Trending</Link>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <div className="search-bar desktop-only">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search anime..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <button className="btn-primary desktop-only">Sign In</button>
          
          {/* Mobile Toggle */}
          <button className="btn-icon mobile-only" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="search-bar mobile-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search anime..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <Link to="/" className="nav-link" onClick={toggleMenu}>Home</Link>
        <Link to="/catalog" className="nav-link" onClick={toggleMenu}>Catalog</Link>
        <Link to="/trending" className="nav-link" onClick={toggleMenu}>Trending</Link>
        <button className="btn-primary w-full mt-4">Sign In</button>
      </div>
    </header>
  );
};

export default Navbar;
