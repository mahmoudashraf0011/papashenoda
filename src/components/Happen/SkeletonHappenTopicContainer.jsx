import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonHappenTopic = () => (
  <div className="skeleton-happen-topic" style={{ width: '80%', margin: '0 auto', marginBottom: '20px' }}>
    {/* السطر الأول يحتوي على كارت واحد */}
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="skeleton-card" style={{ width: '100%', margin: '20px 15%' }}>
        {/* محاكاة الصورة */}
        <Skeleton height={300} width="100%" style={{ borderRadius: '10px' }} />
        
        {/* محاكاة عنوان الكارت */}
        <Skeleton height={20} width="80%" style={{ margin: '10px 0' }} />
        
        {/* محاكاة التاريخ */}
        <Skeleton height={20} width="40%" />
        
        {/* محاكاة الوصف */}
        <Skeleton height={40} width="100%" style={{ margin: '10px 0' }} />
        
        {/* محاكاة الزر */}
        <Skeleton height={30} width="40%" />
      </div>
    </div>

    {/* السطر الثاني يحتوي على 2 كارت في السطر */}
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div className="skeleton-card" style={{ width: '20%', margin: '20px 15%' }}>
        {/* محاكاة الصورة */}
        <Skeleton height={130} width={900} style={{ borderRadius: '10px',marginRight:"10%" }} />
        
        {/* محاكاة العنوان */}
        <Skeleton height={20} width="80%" style={{ margin: '10px 0' }} />
        
        {/* محاكاة التاريخ */}
        <Skeleton height={20} width="40%" />
        
        {/* محاكاة الوصف */}
        <Skeleton height={30} width="100%" style={{ margin: '10px 0' }} />
        
        {/* محاكاة الزر */}
        <Skeleton height={30} width="40%" />
      </div>
      <div className="skeleton-card" style={{ width: '48%' }}>
        {/* محاكاة الصورة */}
        <Skeleton height={150} width={200} style={{ borderRadius: '10px' }} />
        
        {/* محاكاة العنوان */}
        <Skeleton height={20} width="80%" style={{ margin: '10px 0' }} />
        
        {/* محاكاة التاريخ */}
        <Skeleton height={20} width="40%" />
        
        {/* محاكاة الوصف */}
        <Skeleton height={30} width="100%" style={{ margin: '10px 0' }} />
        
        {/* محاكاة الزر */}
        <Skeleton height={30} width="40%" />
      </div>
    </div>
  </div>
);

export default function SkeletonHappenTopicContainer() {
  return (
    <div className="skeleton-happen-topic-container">
      <SkeletonHappenTopic />
      {/* <SkeletonHappenTopic />
      <SkeletonHappenTopic /> */}
    </div>
  );
}

// الاستايل داخل نفس الكود
const styles = {
  '.skeleton-happen-topic-container': {
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '.skeleton-card': {
    backgroundColor: '#f4f4f4',
    padding: '15px',
    borderRadius: '10px',
  },
  '.skeleton-happen-topic': {
    marginBottom: '20px',
  },
};
