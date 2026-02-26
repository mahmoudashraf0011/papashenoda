import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Card component for Skeleton
const SkeletonChooseCard = () => (
  <div 
    className="skeleton-card" 
    style={{ 
      flex: '1 1 28%', // تحديد عرض الكارت ليأخذ 32% من العرض لكل كارت (ثلاثة كروت في السطر)
      marginBottom: '20px', 
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#e6e3e3ff',
      borderRadius: '8px',
      boxSizing: 'border-box' // تأكد من تضمين المسافة في الحسابات
    }}
  >
    <div className="soundsOptionsCardImg">
      {/* محاكاة صورة الكارت */}
      <Skeleton height={400} width={100}  className="rounded-lg" style={{ marginBottom: '10px' }} />
    </div>
    <div className="soundsOptionsCardBet" >
      {/* محاكاة عنوان الكارت */}
      <Skeleton height={400} width={100}  className="mb-3" />
      {/* محاكاة وصف الكارت */}
      <Skeleton height={15}  className="mb-2" />
      {/* محاكاة زر الضغط */}
      <Skeleton height={20} width="50%" />
    </div>
  </div>
);

// Skeleton loading container that simulates the Gallery layout
const SkeletonGalleryCard = () => (
  <div 
    className="skeleton-loading-container" 
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '40px', // المسافة بين الكروت
      justifyContent: 'space-between',
      width: '100%',
      marginRight:"10%"
    }}
  >
    <SkeletonChooseCard />
    <SkeletonChooseCard />
    <SkeletonChooseCard />
  </div>
);


export default SkeletonGalleryCard;
