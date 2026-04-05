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


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Anime API Server running at http://localhost:${PORT}`);
  console.log(`Also accessible from network at http://0.0.0.0:${PORT}`);
});
