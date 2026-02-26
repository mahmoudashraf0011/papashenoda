import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonCardRes = () => (
  <div className="mediaGalleryCard bg-white shadow-md rounded-lg p-4 mb-4">
    {/* صورة التحميل */}
    <div className="mediaGalleryCardImg mb-4">
      <Skeleton height={120} className="rounded-lg" />
    </div>

    {/* محتوى الكارت */}
    <div className="mediaGalleryCardContent">
      <div className="mediaGalleryCardUp flex justify-between items-center mb-4">
        {/* العداد */}
        <Skeleton height={20} width="30%" />
        {/* العنوان */}
        <Skeleton height={20} width="50%" />
      </div>
      {/* الوصف */}
      <Skeleton height={16} width="80%" className="mb-4" />
      {/* زر "المزيد" */}
      <Skeleton height={40} width="40%" className="mb-4" />
    </div>

    {/* الأيقونة */}
    <div className="IconContainer">
      <Skeleton circle height={30} width={30} />
    </div>
  </div>
);

export default SkeletonCardRes;
