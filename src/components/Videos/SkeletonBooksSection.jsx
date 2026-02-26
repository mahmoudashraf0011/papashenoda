import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton Card Component
const SkeletonBookCard = () => (
  <div className="skeleton-book-card" style={{ flex: '1 1 30%', marginBottom: '20px', padding: '10px' }}>
    {/* محاكاة صورة الكتاب */}
    <Skeleton height={200} className="rounded-lg" style={{ marginBottom: '10px' }} />
    
    {/* محاكاة عنوان الكتاب */}
    <Skeleton height={20} width="80%" className="mb-3" />
    
    {/* محاكاة الأزرار */}
    <div style={{ display: 'flex', gap: '10px' }}>
      <Skeleton height={30} width="45%" />
      <Skeleton height={30} width="45%" />
    </div>
  </div>
);

// Skeleton loading section
const SkeletonBooksSection = () => (
  <div className="skeleton-books-section" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
    {/* عرض 3 كروت في كل سطر */}
    <SkeletonBookCard />
    <SkeletonBookCard />
    <SkeletonBookCard />
    <SkeletonBookCard />
    <SkeletonBookCard />
    <SkeletonBookCard />
    <SkeletonBookCard />
    <SkeletonBookCard />
    <SkeletonBookCard />
  </div>
);

export default SkeletonBooksSection;
