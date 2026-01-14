import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface TMDBMovie {
  id: number;
  title: string;
  release_date?: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

interface TMDBSearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TMDBMovie[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const page = searchParams.get('page') || '1';

    // Validate API key
    if (!TMDB_API_KEY) {
      console.error('TMDB API key not configured');
      return NextResponse.json(
        { error: 'API configuration error', message: 'TMDB API key not configured' },
        { status: 500 }
      );
    }

    // Validate query parameter
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Bad request', message: 'Query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Validate page parameter
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return NextResponse.json(
        { error: 'Bad request', message: 'Page must be a number >= 1' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${TMDB_API_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${pageNum}&language=en-US&include_adult=false`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (response.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('TMDB API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'TMDB API error', message: `HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data: TMDBSearchResponse = await response.json();

    return NextResponse.json({
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      results: data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date || '',
        overview: movie.overview,
        poster_url: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
          : null,
        vote_average: movie.vote_average,
      })),
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch search results' },
      { status: 500 }
    );
  }
}