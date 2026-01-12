import { Skeleton } from 'antd';

export function MovieDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Backdrop skeleton */}
      <div style={{ width: '100%', height: 384, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
        <Skeleton active paragraph={{ rows: 0 }} />
      </div>
      
      {/* Main content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Poster skeleton */}
        <div className="md:col-span-1">
          <div style={{ width: '100%', aspectRatio: '2/3', backgroundColor: '#f0f0f0', borderRadius: 8 }}>
            <Skeleton active paragraph={{ rows: 0 }} />
          </div>
        </div>
        
        {/* Details skeleton */}
        <div className="md:col-span-3 space-y-6">
          <Skeleton active paragraph={{ rows: 3 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      </div>
    </div>
  );
}
