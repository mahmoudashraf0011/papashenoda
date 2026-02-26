import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton Card Component
const SkeletonDocsCard = () => (
  <div className="skeleton-card" style={{
    flex: '1 1 23%',  // تقسيم العرض بحيث يكون هناك 4 كروت في السطر الواحد
    marginBottom: '20px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: '20px', // نفس الشكل الذي تم تحديده
  }}>
    <div style={{
      position: 'relative',
      height: '350px',
      overflow: 'hidden',
      borderRadius: '20px',
    }}>
      {/* محاكاة الصورة الخلفية */}
      <Skeleton height="100%" width="100%" className="rounded-lg" style={{
        position: 'absolute',
        filter: 'blur(20px)',
        transform: 'scale(1.1)',
      }} />

      {/* محاكاة الصورة الأمامية */}
      <div className="docsCardImg" style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Skeleton height="100%" width="100%" className="rounded-lg" />
        <Skeleton width={100} height={30} style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
        }} />
      </div>
    </div>
  </div>
);

// Skeleton loading section
const SkeletonDocsSection1 = () => (
  <div className="skeleton-docs-section" style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'space-between',
  }}>
    {/* عرض 4 كروت في السطر */}
    <SkeletonDocsCard />
    {/* <SkeletonDocsCard />
    <SkeletonDocsCard />
    <SkeletonDocsCard /> */}
  </div>
);

export default SkeletonDocsSection1;
