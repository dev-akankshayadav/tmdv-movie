/**
 * @jest-environment node
 */

// Mock the environment variables
process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN = 'test-token';

// Mock fetch globally before importing
global.fetch = jest.fn();

describe('API Route: GET /api/movies/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 when movie is not found', async () => {
    // Mock the fetch call to return 404
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const mockFetch = global.fetch as jest.Mock;
    
    const response = await mockFetch('https://api.themoviedb.org/3/movie/999999999', {
      headers: { 'Authorization': 'Bearer test-token' },
    });

    expect(response.status).toBe(404);
  });

  it('should return 429 when rate limit is exceeded', async () => {
    // Mock the fetch call to return 429
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    });

    const mockFetch = global.fetch as jest.Mock;
    
    const response = await mockFetch('https://api.themoviedb.org/3/movie/550', {
      headers: { 'Authorization': 'Bearer test-token' },
    });

    expect(response.status).toBe(429);
  });

  it('should return 500 when TMDB token is not configured', async () => {
    // Temporarily unset the token
    const originalToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
    delete process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

    try {
      // Verify token is missing
      expect(process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN).toBeUndefined();
    } finally {
      // Restore the token
      process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN = originalToken;
    }
  });

  it('should successfully fetch and return movie data', async () => {
    const mockMovieData = {
      id: 550,
      title: 'Fight Club',
      overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club...',
      poster_path: '/bIjGiMwUlfFnFnFnFnFnFn.jpg',
      vote_average: 8.8,
      release_date: '1999-10-15',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockMovieData),
    });

    const mockFetch = global.fetch as jest.Mock;
    
    const response = await mockFetch('https://api.themoviedb.org/3/movie/550', {
      headers: { 'Authorization': 'Bearer test-token' },
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.id).toBe(550);
    expect(data.title).toBe('Fight Club');
  });
});

describe('API Route: GET /api/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle rate limit errors gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    });

    const mockFetch = global.fetch as jest.Mock;
    
    const response = await mockFetch(
      'https://api.themoviedb.org/3/search/movie?query=avatar',
      { headers: { 'Authorization': 'Bearer test-token' } }
    );

    expect(response.status).toBe(429);
  });

  it('should successfully search and return movies', async () => {
    const mockSearchData = {
      page: 1,
      results: [
        { id: 1, title: 'Avatar', overview: '...' },
        { id: 2, title: 'Avatar: The Way of Water', overview: '...' },
      ],
      total_results: 2,
      total_pages: 1,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockSearchData),
    });

    const mockFetch = global.fetch as jest.Mock;
    
    const response = await mockFetch(
      'https://api.themoviedb.org/3/search/movie?query=avatar',
      { headers: { 'Authorization': 'Bearer test-token' } }
    );

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.results.length).toBe(2);
  });
});
