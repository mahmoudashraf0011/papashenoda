import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton Image and Text for TopicRight
const SkeletonTopicRight = () => (
  <div className="topic-right-side">
    {/* محاكاة الصورة */}
    <Skeleton height={300} width="100%" className="visits-head-img" />
    
    {/* محاكاة الصورة المموهة */}
    <Skeleton height={300} width="100%" className="visits-head-img-blur" style={{ marginTop: '10px' }} />
    
    {/* محاكاة النص */}
    <div className="topic-right-ps">
      <Skeleton count={3} />
    </div>
  </div>
);

export default SkeletonTopicRight;
