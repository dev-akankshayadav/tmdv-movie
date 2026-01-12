import { Movie, MovieDetail } from '@/app/types/movie';
import { getImageUrl, getBackdropUrl } from '@/app/lib/tmdb';

/**
 * Maps and validates TMDB API response to Movie type
 */
export function mapTMDBMovieResponse(data: unknown): Movie {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid movie data');
  }

  const obj = data as Record<string, unknown>;

  // Validate required fields
  if (typeof obj.id !== 'number' || typeof obj.title !== 'string') {
    throw new Error('Missing required fields: id, title');
  }

  return {
    id: obj.id,
    title: obj.title,
    overview: typeof obj.overview === 'string' ? obj.overview : '',
    poster_path: typeof obj.poster_path === 'string' ? obj.poster_path : null,
    backdrop_path: typeof obj.backdrop_path === 'string' ? obj.backdrop_path : null,
    vote_average: typeof obj.vote_average === 'number' ? obj.vote_average : 0,
    vote_count: typeof obj.vote_count === 'number' ? obj.vote_count : 0,
    release_date: typeof obj.release_date === 'string' ? obj.release_date : '',
    genre_ids: Array.isArray(obj.genre_ids) ? obj.genre_ids : [],
    popularity: typeof obj.popularity === 'number' ? obj.popularity : 0,
  };
}

/**
 * Maps and validates TMDB API response to MovieDetail type
 */
export function mapTMDBMovieDetailResponse(data: unknown): MovieDetail {
  const baseMovie = mapTMDBMovieResponse(data);

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid movie detail data');
  }

  const obj = data as Record<string, unknown>;

  return {
    ...baseMovie,
    tagline: typeof obj.tagline === 'string' ? obj.tagline : '',
    runtime: typeof obj.runtime === 'number' ? obj.runtime : 0,
    budget: typeof obj.budget === 'number' ? obj.budget : 0,
    revenue: typeof obj.revenue === 'number' ? obj.revenue : 0,
    status: typeof obj.status === 'string' ? obj.status : 'Released',
    genres: Array.isArray(obj.genres) ? obj.genres : [],
    production_companies: Array.isArray(obj.production_companies) ? obj.production_companies : [],
    production_countries: Array.isArray(obj.production_countries) ? obj.production_countries : [],
    spoken_languages: Array.isArray(obj.spoken_languages) ? obj.spoken_languages : [],
  };
}
