import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonWritingsCard = () => (
  <div className="writingsCard bg-white shadow-md rounded-lg p-4 mb-4">
    {/* محاكاة محتوى الكارت */}
    <div className="writingsCardContent">
      {/* محاكاة العنوان */}
      <Skeleton height={24} width="80%" className="mb-2" />
      {/* محاكاة الوصف */}
      <Skeleton height={16} width="100%" className="mb-4" />
    </div>
    {/* محاكاة الصورة */}
    <div className="writingsCardImg mb-4">
      <Skeleton height={120} className="rounded-lg mb-15" />
    </div>
  </div>
);

export default SkeletonWritingsCard;
