import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonTopicLeftCard = () => (
  <div className="topic-left-headline-cont" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
    <div className="topic-left-headline" style={{ flex: '1' }}>
      <Skeleton width="80%" height={25} style={{ marginBottom: '10px' }} /> {/* محاكاة اسم الموضوع */}
      <Skeleton width="60%" height={20} style={{ marginBottom: '10px' }} /> {/* محاكاة تاريخ الموضوع */}
    </div>
    <div className="topic-right-headlineimg" style={{ marginLeft: '10px' }}>
      <Skeleton width={50} height={50} circle /> {/* محاكاة صورة الموضوع */}
    </div>
  </div>
);

const SkeletonTopicLeftSection = () => (
  <div className="topic-left-side">
    <p className='topic-left-p'>
      <Skeleton width="50%" height={20} /> {/* محاكاة عنوان القسم */}
    </p>
    {/* محاكاة الكروت */}
    <SkeletonTopicLeftCard />
    <SkeletonTopicLeftCard />
    <SkeletonTopicLeftCard />
  </div>
);

export default SkeletonTopicLeftSection;
