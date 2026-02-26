import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton Card Component for videos
const SkeletonVideoCard = () => (
  <div className="skeleton-video-card" style={{
    flex: '1 1 30%', // يعرض 3 كروت في السطر
    marginBottom: '20px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: '8px',
  }}>
    <Skeleton height={200} className="rounded-lg" style={{ marginBottom: '30%' }} />
    <Skeleton height={20} width="80%" className="mb-9" />
    <Skeleton height={16} width="60%" className="mb-8" />
    <Skeleton height={30} width="40%" />
  </div>
);

// Skeleton loading section for additional videos
const SkeletonVideosSectionRes = () => (
  <div className="skeleton-videos-section" style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',  // لضمان تموضع العناصر في المنتصف
    width: '100%',             // تأكيد أن العنصر يغطي العرض الكامل
  }}>
    <SkeletonVideoCard />
    {/* <SkeletonVideoCard />
    <SkeletonVideoCard /> */}
  </div>
);

export default SkeletonVideosSectionRes;
