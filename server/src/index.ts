import express, { Request, Response } from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import { ANIME } from '@consumet/extensions';

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

const ANILIST_URL = 'https://graphql.anilist.co';

// API: Get top airing anime
app.get('/api/anime', async (req: Request, res: Response) => {
  try {
    const query = `
      query {
        Page(page: 1, perPage: 24) {
          media(type: ANIME, sort: TRENDING_DESC) {
            id
            title { english romaji }
            coverImage { large }
            averageScore
            format
            genres
          }
        }
      }
    `;

    const response = await fetch(ANILIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query })
    });

    const body = await response.json();
    
    // Transform Anilist data into our frontend schema
    const results = body.data.Page.media.map((a: any) => ({
      id: a.id.toString(),
      title: a.title.english || a.title.romaji,
      image: a.coverImage.large,
      rating: a.averageScore ? (a.averageScore / 10).toFixed(1) : 'N/A',
      type: a.format
    }));

    res.json(results);
  } catch (error) {
    console.error('Anilist API error:', error);
    res.status(500).json({ error: 'Server Error fetching catalog' });
  }
});

// API: Get specific anime details and episodes
app.get('/api/anime/:id(*)', async (req: Request, res: Response) => {
  try {
    const id = req.params[0];
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title { english romaji }
          coverImage { large }
          bannerImage
          averageScore
          description
          episodes
          genres
          format
          status
          startDate { year }
        }
      }
    `;

    const response = await fetch(ANILIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query, variables: { id: parseInt(id) } })
    });

    const body = await response.json();
    const a = body.data.Media;
    
    if (!a) return res.status(404).json({ error: 'Anime not found' });

    // Generate episode array for frontend display
    const totalEpisodes = a.episodes || 12; // Fallback to 12 if currently airing and unknown
    const episodeList = [];
    for (let i = 1; i <= totalEpisodes; i++) {
        episodeList.push({
            id: `${a.id}-${i}`,
            number: i,
            title: `Episode ${i}`,
        });
    }

    const animeDetails = {
      id: a.id.toString(),
      title: a.title.english || a.title.romaji,
      description: a.description?.replace(/<[^>]*>?/gm, ''), // strip html tags natively
      image: a.coverImage.large,
      cover: a.bannerImage || a.coverImage.large,
      rating: a.averageScore ? (a.averageScore / 10).toFixed(1) : 'N/A',
      genres: a.genres || [],
      episodes: episodeList,
      year: a.startDate?.year || 'Unknown',
      status: a.status
    };

    res.json(animeDetails);
  } catch (error) {
    console.error('Anilist Info API error:', error);
    res.status(500).json({ error: 'Server Error fetching details' });
  }
});

// API: Proxy for autoembed.cc (Server 2) - generates embed URL
app.get('/api/autoembed/:anilistId/:episodeNum', async (req: Request, res: Response) => {
  try {
    const { anilistId, episodeNum } = req.params;
    
    console.log(`[AutoEmbed] Fetching: AniList ID=${anilistId}, Episode=${episodeNum}`);
    
    // AutoEmbed format: https://watch-v2.autoembed.cc/tv/{id}/{season}-{episode}
    const embedUrl = `https://watch-v2.autoembed.cc/tv/${anilistId}/1-${episodeNum}`;
    
    console.log(`[AutoEmbed] Generated URL: ${embedUrl}`);
    
    res.json({
      success: true,
      embedUrl: embedUrl,
      provider: 'autoembed'
    });
  } catch (error) {
    console.error('[AutoEmbed] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch autoembed URL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API: MegaCloud Embed for Server 2
app.get('/api/stream/megacloud/:title/:episodeNum', async (req: Request, res: Response) => {
  try {
    const { title, episodeNum } = req.params;
    console.log(`[MegaCloud] Searching for: "${title}", Ep: ${episodeNum}`);
    
    // Use consumet to get stream links which often use MegaCloud
    const hianime = new ANIME.Hianime();
    const search = await hianime.search(title);
    
    if (!search.results || search.results.length === 0) {
      return res.status(404).json({ error: 'Anime not found' });
    }
    
    const info = await hianime.fetchAnimeInfo(search.results[0].id);
    const episode = info.episodes?.find((ep: any) => ep.number === parseInt(episodeNum));
    
    if (!episode) {
      return res.status(404).json({ error: 'Episode not found' });
    }
    
    const sources = await hianime.fetchEpisodeSources(episode.id);
    
    // Look for MegaCloud or VidCloud in sources
    const megaCloudSource = sources.sources?.find((s: any) => 
      s.url && (s.url.includes('megacloud') || s.url.includes('vixcloud') || s.url.includes('videocloud'))
    );
    
    if (megaCloudSource) {
      console.log(`[MegaCloud] Found: ${megaCloudSource.url}`);
      res.json({ 
        success: true, 
        embedUrl: megaCloudSource.url,
        provider: 'megacloud',
        type: megaCloudSource.type || 'hls'
      });
    } else {
      // Fallback to first available source
      const firstSource = sources.sources?.[0];
      if (firstSource) {
        console.log(`[MegaCloud] Using fallback: ${firstSource.url}`);
        res.json({ 
          success: true, 
          embedUrl: firstSource.url,
          provider: 'fallback',
          type: firstSource.type || 'hls'
        });
      } else {
        res.status(404).json({ error: 'No video sources found' });
      }
    }
  } catch (error) {
    console.error('[MegaCloud] Error:', error);
    res.status(500).json({ error: 'Failed to fetch MegaCloud stream' });
  }
});

// API: VideoCloud Direct Embed for Server 3
app.get('/api/stream/videocloud/:title/:episodeNum', async (req: Request, res: Response) => {
  try {
    const { title, episodeNum } = req.params;
    console.log(`[VideoCloud] Searching for: "${title}", Ep: ${episodeNum}`);
    
    // Try AnimePahe which often uses VideoCloud/MixDrop
    const animepahe = new ANIME.AnimePahe();
    const search = await animepahe.search(title);
    
    if (!search.results || search.results.length === 0) {
      return res.status(404).json({ error: 'Anime not found on AnimePahe' });
    }
    
    const info = await animepahe.fetchAnimeInfo(search.results[0].id);
    let targetEpisode = info.episodes?.find((ep: any) => ep.number === parseInt(episodeNum));
    
    if (!targetEpisode) {
      targetEpisode = info.episodes?.[parseInt(episodeNum) - 1];
    }
    
    if (!targetEpisode) {
      return res.status(404).json({ error: 'Episode not found' });
    }
    
    const sources = await animepahe.fetchEpisodeSources(targetEpisode.id);
    
    // Look for VideoCloud or similar hosts
    const videoCloudSource = sources.sources?.find((s: any) => 
      s.url && (s.url.includes('videocloud') || s.url.includes('vixcloud') || s.url.includes('mixdrop') || s.url.includes('kwik'))
    );
    
    if (videoCloudSource) {
      console.log(`[VideoCloud] Found: ${videoCloudSource.url}`);
      res.json({ 
        success: true, 
        embedUrl: videoCloudSource.url,
        provider: 'videocloud',
        type: videoCloudSource.type || 'mp4'
      });
    } else {
      // Fallback to first source
      const firstSource = sources.sources?.[0];
      if (firstSource) {
        console.log(`[VideoCloud] Using fallback: ${firstSource.url}`);
        res.json({ 
          success: true, 
          embedUrl: firstSource.url,
          provider: 'fallback'
        });
      } else {
        res.status(404).json({ error: 'No video sources found' });
      }
    }
  } catch (error) {
    console.error('[VideoCloud] Error:', error);
    res.status(500).json({ error: 'Failed to fetch VideoCloud stream' });
  }
});

// API: Native Stream via AnimePahe
app.get('/api/stream/native/:title/:episodeNum', async (req: Request, res: Response) => {
  try {
    const { title, episodeNum } = req.params;
    console.log(`[AnimePahe] Searching for: "${title}", Ep: ${episodeNum}`);
    
    const animepahe = new ANIME.AnimePahe();
    const search = await animepahe.search(title);
    if (!search.results || search.results.length === 0) {
      return res.status(404).json({ error: 'Anime not found on AnimePahe' });
    }
    
    const firstId = search.results[0].id;
    const info = await animepahe.fetchAnimeInfo(firstId);
    
    let targetEpisode = info.episodes?.find((ep: any) => ep.number === parseInt(episodeNum));
    if (!targetEpisode) {
        targetEpisode = info.episodes?.[parseInt(episodeNum) - 1]; // fallback index match
    }
    
    if (!targetEpisode) return res.status(404).json({ error: 'Episode range exceeded on AnimePahe' });
    
    const sources = await animepahe.fetchEpisodeSources(targetEpisode.id);
    res.json({ success: true, sources: sources.sources });
  } catch (error) {
    console.error('AnimePahe error:', error);
    res.status(500).json({ error: 'Failed to fetch Native Stream from AnimePahe' });
  }
});

// API: Native Stream proxy to bypass CORS/Hotlink protection
app.get('/api/stream/proxy', async (req: Request, res: Response) => {
  try {
    const videoUrl = req.query.url as string;
    const referer = (req.query.referer as string) || 'https://kwik.cx/';
    
    if (!videoUrl) return res.status(400).json({ error: 'Missing url query param' });

    const fetchRes = await fetch(videoUrl, {
      headers: {
        'Referer': referer,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...(req.headers.range && { 'Range': req.headers.range }) // Pass along byte-ranges
      }
    });

    if (videoUrl.includes('.m3u8')) {
      const m3u8Text = await fetchRes.text();
      const baseUrl = videoUrl.substring(0, videoUrl.lastIndexOf('/') + 1);
      
      const lines = m3u8Text.split('\n');
      const proxyRoute = `/api/stream/proxy?referer=${encodeURIComponent(referer)}&url=`;
      
      for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('#EXT-X-KEY:')) {
              const uriMatch = line.match(/URI="([^"]+)"/);
              if (uriMatch) {
                  let keyUrl = uriMatch[1];
                  if (!keyUrl.startsWith('http')) {
                      if (keyUrl.startsWith('/')) {
                          const urlObj = new URL(videoUrl);
                          keyUrl = `${urlObj.origin}${keyUrl}`;
                      } else {
                          keyUrl = baseUrl + keyUrl;
                      }
                  }
                  const proxiedKeyUrl = proxyRoute + encodeURIComponent(keyUrl);
                  lines[i] = line.replace(`URI="${uriMatch[1]}"`, `URI="${proxiedKeyUrl}"`);
              }
          } else if (line && !line.startsWith('#')) {
              let chunkUrl = line;
              if (!chunkUrl.startsWith('http')) {
                  // handle relative URLs in m3u8 natively
                  if (chunkUrl.startsWith('/')) {
                      const urlObj = new URL(videoUrl);
                      chunkUrl = `${urlObj.origin}${chunkUrl}`;
                  } else {
                      chunkUrl = baseUrl + chunkUrl;
                  }
              }
              lines[i] = proxyRoute + encodeURIComponent(chunkUrl);
          }
      }
      
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      // allow CORS natively just in case
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(lines.join('\n'));
    } else {
      // Stream chunks natively
      res.setHeader('Access-Control-Allow-Origin', '*');
      if (fetchRes.headers.get('content-type')) {
          res.setHeader('Content-Type', fetchRes.headers.get('content-type')!);
      }
      if (fetchRes.headers.get('content-length')) {
          res.setHeader('Content-Length', fetchRes.headers.get('content-length')!);
      }
      if (fetchRes.headers.get('accept-ranges')) {
          res.setHeader('Accept-Ranges', fetchRes.headers.get('accept-ranges')!);
      }
      if (fetchRes.headers.get('content-range')) {
          res.setHeader('Content-Range', fetchRes.headers.get('content-range')!);
      }
      res.status(fetchRes.status);
      
      const body = fetchRes.body;
      if (body) {
        // @ts-ignore
        const reader = body.getReader();
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };
        pump().catch(e => { console.error('Pump error:', e); res.end(); });
      } else {
        res.end();
      }
    }
  } catch (err) {
    console.error('Proxy Error:', err);
    res.status(500).end();
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Anime API Server running at http://localhost:${PORT}`);
  console.log(`Also accessible from network at http://0.0.0.0:${PORT}`);
});
