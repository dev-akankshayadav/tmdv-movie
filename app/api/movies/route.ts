import { NextRequest, NextResponse } from 'next/server';
import { MoviesResponse } from '@/app/types/movie';
import { API_CACHE_REVALIDATE } from '@/app/lib/constants';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';

    if (!TMDB_TOKEN) {
      return NextResponse.json(
        { error: 'TMDB API token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${TMDB_API_BASE}/movie/popular?page=${page}&language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_TOKEN}`,
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // 60 seconds per requirements
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data: MoviesResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Movies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}
