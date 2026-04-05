import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Captions, Languages, ListVideo } from 'lucide-react';
import ReactPlayer from 'react-player';
import { fetchAnimeDetail } from '../utils/anilistApi';
import type { AnimeDetail } from '../utils/anilistApi';
import './WatchUrl.css';

const Player = ReactPlayer as any;

interface Provider {
  name: string;
  isNative: boolean;
  fetchUrl: (anilistId: string, ep: string, title: string, isDub: boolean) => Promise<string>;
}

const PROVIDERS: Provider[] = [
  {
    name: 'Server 1',
    isNative: false,
    fetchUrl: async (anilistId: string, ep: string, _title: string, isDub: boolean) => {
      return `https://vidsrc.cc/v2/embed/anime/ani${anilistId}/${ep}/${isDub ? 'dub' : 'sub'}`;
    }
  }
];

const WatchUrl = () => {
  const params = useParams();
  const id = params['*'];

  const [isDub, setIsDub] = useState(false);
  const [activeServer, setActiveServer] = useState(0);
  const [animeInfo, setAnimeInfo] = useState<AnimeDetail | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoadingServer, setIsLoadingServer] = useState(false);
  const [isNativeStream, setIsNativeStream] = useState(false);

  if (!id || !id.includes('-')) {
    return (
      <div className="container" style={{ paddingTop: '20vh', textAlign: 'center' }}>
        Invalid Episode ID format. Expected AnimeID-EpisodeNum.
      </div>
    );
  }

  const [animeId, episodeNum] = id.split('-');
  const currentEp = Number(episodeNum);
  
  // Fetch anime details
  useEffect(() => {
    fetchAnimeDetail(animeId)
      .then(data => setAnimeInfo(data))
      .catch(err => console.error('Failed to load anime info:', err));
  }, [animeId]);

  // Fetch Stream URL dynamically whenever server or episode changes
  useEffect(() => {
    if (!animeInfo?.title) return; // Wait until title is loaded

    let isMounted = true;
    setIsLoadingServer(true);
    setVideoUrl('');
    
    const provider = PROVIDERS[activeServer];
    setIsNativeStream(provider.isNative);

    provider.fetchUrl(animeId, episodeNum, animeInfo.title, isDub)
      .then(url => {
        if (isMounted) setVideoUrl(url);
      })
      .catch(err => {
        console.error('Failed to fetch provider URL:', err);
        if (isMounted) setVideoUrl('');
      })
      .finally(() => {
        if (isMounted) setIsLoadingServer(false);
      });

    return () => { isMounted = false; };
  }, [activeServer, animeId, episodeNum, animeInfo?.title, isDub]);

  const totalEpisodes = animeInfo?.episodes?.length || 0;

  return (
    <div className="watch-page animate-fade-in">
      {/* Player + Episode Panel Layout */}
      <div className="watch-layout container">
        {/* Left: Video Player */}
        <div className="watch-player-col">
          <div className="video-container">
            <div className="player-wrapper">
              {isLoadingServer || !animeInfo ? (
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: '100%', backgroundColor: '#000', color: '#fff', fontSize: '1.2rem'
                }}>
                  Loading {PROVIDERS[activeServer].name}...
                </div>
              ) : !videoUrl ? (
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: '100%', backgroundColor: '#000', color: '#ff6b6b', fontSize: '1.1rem',
                  padding: '2rem', textAlign: 'center'
                }}>
                  ⚠️ Stream unavailable on this server.<br/>
                  <span style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.8 }}>
                    Try selecting a different Server below.
                  </span>
                </div>
              ) : isNativeStream ? (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#000' }}>
                  <Player
                    url={videoUrl}
                    controls={true}
                    width="100%"
                    height="100%"
                    playing={true}
                  />
                </div>
              ) : (
                <iframe
                  key={`${activeServer}-${episodeNum}`}
                  src={videoUrl}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  style={{ backgroundColor: '#000' }}
                ></iframe>
              )}
            </div>
          </div>

          {/* Now Playing Info */}
          <div className="now-playing-bar">
            <Link to={`/anime/${animeId}`} className="back-link">
              <ArrowLeft size={18} /> Back to Details
            </Link>
            <div className="now-playing-info">
              <h2>
                {animeInfo?.title || 'Loading...'}
                <span className="ep-badge">EP {episodeNum}</span>
              </h2>
            </div>
          </div>

          {/* Server & Language Controls */}
          <div className="player-options">
            <div className="server-selector">
              <span className="option-label">Server:</span>
              {PROVIDERS.map((provider, i) => (
                <button
                  key={i}
                  className={`server-btn ${activeServer === i ? 'active' : ''}`}
                  onClick={() => setActiveServer(i)}
                >
                  {provider.name}
                </button>
              ))}
            </div>
            <div className="language-toggle">
              <button
                className={`lang-btn ${!isDub ? 'active' : ''}`}
                onClick={() => setIsDub(false)}
              >
                <Captions size={16} /> Sub
              </button>
              <button
                className={`lang-btn ${isDub ? 'active' : ''}`}
                onClick={() => setIsDub(true)}
              >
                <Languages size={16} /> Dub
              </button>
            </div>
          </div>
        </div>

        {/* Right: Episode List Panel */}
        <div className="episode-panel glass-panel">
          <div className="episode-panel-header">
            <ListVideo size={18} />
            <h3>Episodes</h3>
            {totalEpisodes > 0 && (
              <span className="ep-count">{totalEpisodes} EP</span>
            )}
          </div>
          <div className="episode-grid-scroll">
            {totalEpisodes === 0 ? (
              <div className="ep-loading">Loading episodes...</div>
            ) : (
              <div className="episode-grid">
                {animeInfo!.episodes.map(ep => (
                  <Link
                    key={ep.number}
                    to={`/watch/${animeId}-${ep.number}`}
                    className={`ep-item ${ep.number === currentEp ? 'active' : ''}`}
                  >
                    {ep.number}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchUrl;
