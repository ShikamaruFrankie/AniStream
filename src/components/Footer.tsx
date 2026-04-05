import { Github, Twitter, Disc as Discord, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <Play fill="var(--color-primary)" color="var(--color-primary)" size={32} />
            <span>Ani<span className="text-primary">Stream</span></span>
          </div>
          <p className="footer-description">
            Your premium destination for high-quality anime streaming. Watch anytime, anywhere across all your devices.
          </p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon"><Twitter size={20} /></a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="social-icon"><Discord size={20} /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon"><Github size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h3>Navigation</h3>
            <Link to="/">Home</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/movies">Movies</Link>
          </div>
          <div className="link-group">
            <h3>Support</h3>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/report">Report an Issue</Link>
          </div>
          <div className="link-group">
            <h3>Legal</h3>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/dmca">DMCA</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AniStream. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
