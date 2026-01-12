import { mapTMDBMovieResponse, mapTMDBMovieDetailResponse } from '@/app/lib/mappers';

describe('mapTMDBMovieResponse', () => {
  it('should successfully map a valid TMDB movie response', () => {
    const mockData = {
      id: 550,
      title: 'Fight Club',
      overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club...',
      poster_path: '/bIjGiMwUlfFnFnFnFnFnFn.jpg',
      backdrop_path: '/bkiGiMwUlfFnFnFnFnFnFn.jpg',
      vote_average: 8.8,
      vote_count: 26237,
      release_date: '1999-10-15',
      genre_ids: [18, 53],
      popularity: 85.5,
    };

    const result = mapTMDBMovieResponse(mockData);

    expect(result).toEqual(mockData);
    expect(result.id).toBe(550);
    expect(result.title).toBe('Fight Club');
    expect(result.vote_average).toBe(8.8);
  });

  it('should handle missing optional fields', () => {
    const mockData = {
      id: 123,
      title: 'Test Movie',
    };

    const result = mapTMDBMovieResponse(mockData);

    expect(result.id).toBe(123);
    expect(result.title).toBe('Test Movie');
    expect(result.overview).toBe('');
    expect(result.poster_path).toBeNull();
    expect(result.genre_ids).toEqual([]);
  });

  it('should throw error for missing required fields', () => {
    const mockData = {
      id: 123,
      // missing title
    };

    expect(() => mapTMDBMovieResponse(mockData)).toThrow('Missing required fields: id, title');
  });

  it('should throw error for invalid data type', () => {
    expect(() => mapTMDBMovieResponse(null)).toThrow('Invalid movie data');
    expect(() => mapTMDBMovieResponse('invalid')).toThrow('Invalid movie data');
  });
});

describe('mapTMDBMovieDetailResponse', () => {
  it('should successfully map a valid TMDB movie detail response', () => {
    const mockData = {
      id: 550,
      title: 'Fight Club',
      overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club...',
      poster_path: '/bIjGiMwUlfFnFnFnFnFnFn.jpg',
      backdrop_path: '/bkiGiMwUlfFnFnFnFnFnFn.jpg',
      vote_average: 8.8,
      vote_count: 26237,
      release_date: '1999-10-15',
      genre_ids: [18, 53],
      popularity: 85.5,
      tagline: 'Lose yourself',
      runtime: 139,
      budget: 63000000,
      revenue: 100853753,
      genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
      production_companies: [{ id: 1, name: 'Fox 2000 Pictures' }],
      production_countries: [{ iso_3166_1: 'US', name: 'United States' }],
      spoken_languages: [{ iso_639_1: 'en', name: 'English' }],
    };

    const result = mapTMDBMovieDetailResponse(mockData);

    expect(result.id).toBe(550);
    expect(result.title).toBe('Fight Club');
    expect(result.tagline).toBe('Lose yourself');
    expect(result.runtime).toBe(139);
    expect(result.budget).toBe(63000000);
    expect(result.genres.length).toBe(2);
  });

  it('should handle missing optional detail fields', () => {
    const mockData = {
      id: 123,
      title: 'Test Movie',
    };

    const result = mapTMDBMovieDetailResponse(mockData);

    expect(result.id).toBe(123);
    expect(result.title).toBe('Test Movie');
    expect(result.tagline).toBe('');
    expect(result.runtime).toBe(0);
    expect(result.budget).toBe(0);
    expect(result.genres).toEqual([]);
  });
});
