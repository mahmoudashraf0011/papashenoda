import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton Card Component
const SkeletonDocsCard = () => (
  <div className="skeleton-card" style={{
    flex: '1 1 48%',  // تقسيم العرض بحيث يكون هناك 2 كروت في السطر الواحد
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
      height: '200px',  // تقليل الارتفاع ليتناسب مع الموبايل
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
const SkeletonDocsSectionRes = () => (
  <div className="skeleton-docs-section" style={{
    display: 'flex',
    flexWrap: 'nowrap',  // جعل الكروت في صف واحد
    gap: '20px',
    justifyContent: 'space-between',
    width: '100%',
    overflow: 'hidden',  // لمنع التمرير
  }}>
    {/* عرض 2 كروت في السطر */}
    <SkeletonDocsCard />
    {/* <SkeletonDocsCard /> */}
  </div>
);

export default SkeletonDocsSectionRes;
