const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: 'w200' | 'w400' | 'w500' | 'original' = 'w400'): string => {
  if (!path) {
    return '/placeholder-movie.jpg';
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) {
    return '/placeholder-backdrop.jpg';
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const tmdbApiUrl = (endpoint: string, params?: Record<string, string | number>): string => {
  const url = new URL(`${TMDB_API_BASE}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  
  return url.toString();
};
