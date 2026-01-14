import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MovieDetailView, MovieDetailSkeleton } from '@/app/components';

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: MoviePageProps) {
  const { id } = await params;

  try {
    const response = await fetch(`/api/movies/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return {
        title: 'Movie Not Found',
        description: 'The movie you are looking for does not exist.',
      };
    }

    const movie = await response.json();
    return {
      title: `${movie.title} - TMDB Movie Explorer`,
      description: movie.overview || 'View movie details on TMDB Movie Explorer',
    };
  } catch {
    return {
      title: 'Movie Details - TMDB Movie Explorer',
      description: 'View detailed movie information',
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  // Validate ID format
  if (!id || isNaN(Number(id))) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Suspense fallback={<MovieDetailSkeleton />}>
        <MovieDetailView movieId={id} />
      </Suspense>
    </div>
  );
}
