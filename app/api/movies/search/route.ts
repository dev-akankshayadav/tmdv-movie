import { NextRequest, NextResponse } from 'next/server';
import { MoviesResponse } from '@/app/types/movie';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const page = searchParams.get('page') || '1';

    // Validate token
    if (!TMDB_TOKEN) {
      return NextResponse.json(
        { error: 'API configuration error', message: 'TMDB token not configured' },
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
      `${TMDB_API_BASE}/search/movie?query=${encodeURIComponent(query)}&page=${pageNum}&language=en-US&include_adult=false`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_TOKEN}`,
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds per requirements
      }
    );

    if (response.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: 'TMDB API error', message: `HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data: MoviesResponse = await response.json();

    // Return normalized response per spec
    return NextResponse.json({
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      results: data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
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
