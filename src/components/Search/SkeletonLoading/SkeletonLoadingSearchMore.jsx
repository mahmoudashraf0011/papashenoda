import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton for Video Card
const SkeletonLoadingSearchMore = () => (
  <div className="skeleton-video-card">
    <div className="skeleton-video-img">
      <Skeleton height={200} width="100%" />
    </div>
    <div className="skeleton-video-content">
      <Skeleton height={20} width="80%" style={{ margin: '10px 0' }} />
      <Skeleton height={16} width="60%" style={{ margin: '10px 0' }} />
      <Skeleton height={30} width="40%" />
    </div>
  </div>
);

export default SkeletonLoadingSearchMore;
