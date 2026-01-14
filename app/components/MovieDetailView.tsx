import { Tag, Rate, Card, Alert } from 'antd';
import {
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { MovieDetail } from '@/app/types/movie';

interface MovieDetailViewProps {
  movieId: string;
}

export async function MovieDetailView({ movieId }: MovieDetailViewProps) {
  try {
    const response = await fetch(`/api/movies/${movieId}`, {
      next: { revalidate: 60 },
    });

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
          message="Movie Not Found"
          description={response.status === 404 
            ? "The movie you're looking for doesn't exist." 
            : "Failed to load details. Please try again."}
          type="error"
          showIcon
        />
      );
    }

    const movie: MovieDetail = await response.json();

    return (
      <div className="space-y-6">
        {/* Backdrop */}
        {movie?.backdrop_path && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie?.backdrop_path}`}
              alt={movie?.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="sticky top-20">
              {movie?.poster_path ? (
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${movie?.poster_path}`}
                    alt={movie?.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-3 space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {movie?.title}
              </h1>
              {movie?.tagline && (
                <p className="text-lg text-gray-600 italic mb-4">{movie?.tagline}</p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <Rate
                    disabled
                    value={movie?.vote_average ? movie?.vote_average / 2 : 0}
                    allowHalf
                    className="text-lg"
                  />
                  <div className="text-sm text-gray-600 mt-1">
                    {movie?.vote_average?.toFixed(1) || 'N/A'}/10
                  </div>
                </div>
                {movie?.genres && movie.genres.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {movie?.genres.map((genre) => (
                      <Tag key={genre.id} color="blue">
                        {genre.name}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Overview */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                {movie?.overview || 'No overview available'}
              </p>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {movie?.release_date && (
                <Card size="small" className="text-center">
                  <CalendarOutlined className="mr-2" />
                  <div className="font-semibold text-sm">Release Date</div>
                  <div className="text-gray-600 text-sm">
                    {new Date(movie?.release_date).toLocaleDateString()}
                  </div>
                </Card>
              )}
              {movie?.runtime && movie?.runtime > 0 && (
                <Card size="small" className="text-center">
                  <ClockCircleOutlined className="mr-2" />
                  <div className="font-semibold text-sm">Runtime</div>
                  <div className="text-gray-600 text-sm">{movie?.runtime} min</div>
                </Card>
              )}
              {movie?.budget && movie?.budget > 0 && (
                <Card size="small" className="text-center">
                  <DollarOutlined className="mr-2" />
                  <div className="font-semibold text-sm">Budget</div>
                  <div className="text-gray-600 text-sm">
                    ${(movie?.budget / 1000000).toFixed(1)}M
                  </div>
                </Card>
              )}
              {movie?.revenue && movie?.revenue > 0 && (
                <Card size="small" className="text-center">
                  <FireOutlined className="mr-2" />
                  <div className="font-semibold text-sm">Revenue</div>
                  <div className="text-gray-600 text-sm">
                    ${(movie?.revenue / 1000000).toFixed(1)}M
                  </div>
                </Card>
              )}
            </div>

            {/* Production Companies */}
            {movie?.production_companies && movie?.production_companies?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Production Companies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie?.production_companies.map((company) => (
                    <Tag key={company?.id}>{company?.name}</Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('MovieDetailView error:', error);
    return (
      <Alert
        message="Error"
        description="An unexpected error occurred while loading movie details."
        type="error"
        showIcon
      />
    );
  }
}
