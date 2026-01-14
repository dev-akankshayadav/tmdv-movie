import { Alert, Empty, Row, Col } from 'antd';
import Link from 'next/link';
import { MovieCard } from '@/app/components/MovieCard';
import { MoviesPagination } from '@/app/components/MoviesPagination';

interface MovieListProps {
  query: string;
  page: number;
}

interface SearchMovie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_url: string | null;
  vote_average: number;
}

interface SearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: SearchMovie[];
}

export async function MovieList({ query, page }: MovieListProps) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/movies/search?q=${encodeURIComponent(query)}&page=${page}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (response.status === 429) {
      return (
        <Alert
          message="Rate Limit Exceeded"
          description="The service is temporarily overloaded. Please try again in a few moments."
          type="error"
          showIcon
        />
      );
    }

    if (!response.ok) {
      return (
        <Alert
          description="Failed to fetch search results. Please try again."
          type="error"
          showIcon
        />
      );
    }

    const data: SearchResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      return <Empty description={`No movies found for "${query}"`} />;
    }

    return (
      <div className="space-y-8">
        {/* Results Grid */}
        <Row gutter={[16, 24]}>
          {data?.results.map((movie) => (
            <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
              <Link href={`/movie/${movie.id}`}>
                <MovieCard
                  id={movie?.id}
                  title={movie?.title}
                  posterUrl={movie?.poster_url}
                  releaseDate={movie?.release_date}
                  voteAverage={movie?.vote_average}
                  overview={movie?.overview}
                />
              </Link>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        {data?.total_pages > 1 && (
          <MoviesPagination
            query={query}
            currentPage={page}
            totalResults={data?.total_results}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('MovieList error:', error);
    return (
      <Alert
        message="Error"
        description="An unexpected error occurred while fetching results."
        type="error"
        showIcon
      />
    );
  }
}
