import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonVideoCard = () => (
  <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '300px' }}>
    {/* محاكاة الـ iframe */}
    <Skeleton height={500} width="100%" className="rounded-lg" />

    {/* محاكاة زر التحميل */}
    <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
      <Skeleton height={30} width={100} />
    </div>
  </div>
);

export default SkeletonVideoCard;
