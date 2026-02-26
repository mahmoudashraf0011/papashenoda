import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton Article Card Component
const SkeletonArticleCard = () => (
  <div className="articleCard">
    <div className="articleCardContent">
      <Skeleton height={30} width="80%" />
      
    </div>
    <div className="articleCardImg">
      <Skeleton height={20} width="60%" />
      <Skeleton height={100} width="100%" />
      <Skeleton height={40} width="40%" />
    </div>
  </div>
);

export default SkeletonArticleCard;
