import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonChooseCard = () => (
  <div 
    className="skeleton-card" 
    style={{ 
      flex: '0 0 19%',  // كل كارت يأخذ 19% من العرض 
      marginBottom: '20px', 
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      borderRadius: '8px'
    }}
  >
    <div className="soundsOptionsCardImg">
      {/* محاكاة صورة الكارت */}
      <Skeleton height={120} className="rounded-lg" style={{ marginBottom: '10px' }} />
    </div>
    <div className="soundsOptionsCardBet">
      {/* محاكاة عنوان الكارت */}
      <Skeleton height={20} width="80%" className="mb-3" />
      {/* محاكاة وصف الكارت */}
      <Skeleton height={16} width="60%" className="mb-2" />
      {/* محاكاة زر الضغط */}
      <Skeleton height={40} width="100%" />
    </div>
  </div>
);

const SkeletonLoading = () => (
  <div 
    className="skeleton-loading-container" 
    style={{
      display: 'flex',
      flexWrap: 'nowrap',  // منع الانتقال إلى سطر آخر
      gap: '45px',
      justifyContent: 'space-between', // توزيع الكروت بشكل متساوي
    }}
  >
    {/* عرض 5 كروت في نفس السطر */}
    <SkeletonChooseCard />
    <SkeletonChooseCard />
    <SkeletonChooseCard />
    <SkeletonChooseCard />
    <SkeletonChooseCard />
  </div>
);

export default SkeletonLoading;
