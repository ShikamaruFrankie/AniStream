const ANILIST_URL = 'https://graphql.anilist.co';

export interface AnimeListItem {
  id: string;
  title: string;
  image: string;
  rating: string;
  type: string;
  genres: string[];
  description?: string;
  cover?: string;
}

export interface AnimeDetail {
  id: string;
  title: string;
  description: string;
  image: string;
  cover: string;
  rating: string;
  genres: string[];
  episodes: { id: string; number: number; title: string }[];
  year: number | string;
  status: string;
}

async function gqlFetch(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`AniList request failed: ${response.status}`);
  return response.json();
}

export async function fetchTrendingAnime(): Promise<AnimeListItem[]> {
  const query = `
    query {
      Page(page: 1, perPage: 24) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title { english romaji }
          coverImage { large extraLarge }
          bannerImage
          averageScore
          format
          genres
          description(asHtml: false)
        }
      }
    }
  `;

  const body = await gqlFetch(query);
  return body.data.Page.media.map((a: any) => ({
    id: a.id.toString(),
    title: a.title.english || a.title.romaji,
    image: a.coverImage.large,
    cover: a.bannerImage || a.coverImage.extraLarge || a.coverImage.large,
    rating: a.averageScore ? (a.averageScore / 10).toFixed(1) : 'N/A',
    type: a.format,
    genres: a.genres || [],
    description: a.description?.replace(/<[^>]*>?/gm, '').slice(0, 200),
  }));
}

export async function fetchAnimeDetail(id: string): Promise<AnimeDetail> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { english romaji }
        coverImage { large extraLarge }
        bannerImage
        averageScore
        description(asHtml: false)
        episodes
        nextAiringEpisode { episode }
        genres
        format
        status
        startDate { year }
      }
    }
  `;

  const body = await gqlFetch(query, { id: parseInt(id) });
  const a = body.data.Media;
  if (!a) throw new Error('Anime not found');

  // If episodes is null, check nextAiringEpisode or fallback
  let totalEpisodes = a.episodes;
  if (!totalEpisodes && a.nextAiringEpisode) {
    totalEpisodes = a.nextAiringEpisode.episode - 1;
  }
  if (!totalEpisodes) {
    // Some finished older anime or unupdated ones might lack this, fallback to 12
    totalEpisodes = 12; 
  }

  const episodeList = [];
  for (let i = 1; i <= totalEpisodes; i++) {
    episodeList.push({
      id: `${a.id}-${i}`,
      number: i,
      title: `Episode ${i}`,
    });
  }

  return {
    id: a.id.toString(),
    title: a.title.english || a.title.romaji,
    description: a.description?.replace(/<[^>]*>?/gm, '') || '',
    image: a.coverImage.large,
    cover: a.bannerImage || a.coverImage.extraLarge || a.coverImage.large,
    rating: a.averageScore ? (a.averageScore / 10).toFixed(1) : 'N/A',
    genres: a.genres || [],
    episodes: episodeList,
    year: a.startDate?.year || 'Unknown',
    status: a.status,
  };
}

export async function fetchPopularAnime(): Promise<AnimeListItem[]> {
  const query = `
    query {
      Page(page: 1, perPage: 24) {
        media(type: ANIME, sort: POPULARITY_DESC) {
          id
          title { english romaji }
          coverImage { large extraLarge }
          bannerImage
          averageScore
          format
          genres
          description(asHtml: false)
        }
      }
    }
  `;

  const body = await gqlFetch(query);
  return body.data.Page.media.map((a: any) => ({
    id: a.id.toString(),
    title: a.title.english || a.title.romaji,
    image: a.coverImage.large,
    cover: a.bannerImage || a.coverImage.extraLarge || a.coverImage.large,
    rating: a.averageScore ? (a.averageScore / 10).toFixed(1) : 'N/A',
    type: a.format,
    genres: a.genres || [],
    description: a.description?.replace(/<[^>]*>?/gm, '').slice(0, 200),
  }));
}

export async function fetchActionHits(): Promise<AnimeListItem[]> {
  const query = `
    query {
      Page(page: 1, perPage: 24) {
        media(type: ANIME, sort: POPULARITY_DESC, genre_in: ["Action"]) {
          id
          title { english romaji }
          coverImage { large extraLarge }
          bannerImage
          averageScore
          format
          genres
          description(asHtml: false)
        }
      }
    }
  `;

  const body = await gqlFetch(query);
  return body.data.Page.media.map((a: any) => ({
    id: a.id.toString(),
    title: a.title.english || a.title.romaji,
    image: a.coverImage.large,
    cover: a.bannerImage || a.coverImage.extraLarge || a.coverImage.large,
    rating: a.averageScore ? (a.averageScore / 10).toFixed(1) : 'N/A',
    type: a.format,
    genres: a.genres || [],
    description: a.description?.replace(/<[^>]*>?/gm, '').slice(0, 200),
  }));
}

export async function fetchSearchAnime(searchQuery: string): Promise<AnimeListItem[]> {
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 50) {
        media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
          id
          title { english romaji }
          coverImage { large extraLarge }
          bannerImage
          averageScore
          format
          genres
          description(asHtml: false)
        }
      }
    }
  `;

  const body = await gqlFetch(query, { search: searchQuery });
  return body.data.Page.media.map((a: any) => ({
    id: a.id.toString(),
    title: a.title.english || a.title.romaji,
    image: a.coverImage.large,
    cover: a.bannerImage || a.coverImage.extraLarge || a.coverImage.large,
    rating: a.averageScore ? (a.averageScore / 10).toFixed(1) : 'N/A',
    type: a.format,
    genres: a.genres || [],
    description: a.description?.replace(/<[^>]*>?/gm, '').slice(0, 200),
  }));
}
