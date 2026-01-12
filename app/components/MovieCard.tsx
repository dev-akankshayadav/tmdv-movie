'use client';

import { Card, Empty, Skeleton } from 'antd';
import { StarOutlined, CalendarOutlined } from '@ant-design/icons';
import Image from 'next/image';

interface MovieCardProps {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string;
  voteAverage: number;
  overview: string;
}

export function MovieCard({ 
  id, 
  title, 
  posterUrl, 
  releaseDate, 
  voteAverage, 
  overview 
}: MovieCardProps) {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  return (
    <Card
      hoverable
      cover={
        posterUrl ? (
          <div className="relative w-full h-72 bg-gray-200 overflow-hidden">
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative w-full h-72 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )
      }
      className="h-full"
    >
      <div className="space-y-2">
        <h3 className="font-semibold text-base line-clamp-2 hover:text-blue-600">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarOutlined />
          <span>{year}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <StarOutlined className="text-yellow-500" />
          <span className="font-semibold">{voteAverage?.toFixed(1) || 'N/A'}</span>
        </div>

        <p className="text-xs text-gray-700 line-clamp-3 mt-2">
          {overview || 'No description available'}
        </p>
      </div>
    </Card>
  );
}
