import { Suspense } from 'react';
import { MovieSearch } from '@/app/components/MovieSearch';
import { MovieList } from '@/app/components/MovieList';
import { Empty } from 'antd';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: 'TMDB Movie Explorer - Search Movies',
  description: 'Search and discover movies from The Movie Database (TMDB)',
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim();
  const page = parseInt(params.page || '1', 10);

  return (
    <div className="space-y-8">

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Search Movies</h1>
          <p className="text-gray-600 mb-6">
            Find detailed information about millions of movies .  
          </p>
          <MovieSearch />
        </div>
      </section>

      {/* Results Section */}
      {query && query.length >= 2 ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Search Results for "{query}"
            </h2>
            <p className="text-gray-600 text-sm">Page {page}</p>
          </div>
          <Suspense fallback={<div className="text-center py-12">Loading results...</div>}>
            <MovieList query={query} page={page} />
          </Suspense>
        </section>
      ) : (
        <section className="py-12">
          <Empty description="Enter a search term (minimum 2 characters) to explore movies" />
        </section>
      )}
    </div>
  );
}
