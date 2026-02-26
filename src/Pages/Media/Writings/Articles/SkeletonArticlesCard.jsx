import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';

const SkeletonArticlesCard = () => (
  <div className="flex gap-4 w-full"> {/* استخدام Flexbox لتوزيع الكروت */}

    {/* كارت 1 */}
    <div className="w-8 p-4 mb-4">
      <div className="articleCard bg-white shadow-md rounded-lg p-4">
        {/* صورة التحميل */}
        <div className="articleCardImg mb-4">
          <Skeleton height={160} className="rounded-lg" />
        </div>

        {/* محتوى الكارت */}
        <div className="articleCardContent">
          <Link to="#">
            {/* العنوان */}
            <Skeleton height={24} width="80%" className="mb-2" />
            {/* الوصف */}
            <Skeleton height={16} width="100%" className="mb-4" />
            {/* زر "اقرأ المزيد" */}
            <Skeleton height={40} width="50%" />
          </Link>
        </div>

        {/* تحميل زر */}
        <div className="download-btn">
          <Skeleton height={30} width="100px" />
        </div>
      </div>
    </div>

    {/* كارت 2 */}
    <div className="w-8 p-4 mb-4">
      <div className="articleCard bg-white shadow-md rounded-lg p-4">
        <div className="articleCardImg mb-4">
          <Skeleton height={160} className="rounded-lg" />
        </div>

        <div className="articleCardContent">
          <Link to="#">
            <Skeleton height={24} width="80%" className="mb-2" />
            <Skeleton height={16} width="100%" className="mb-4" />
            <Skeleton height={40} width="50%" />
          </Link>
        </div>

        <div className="download-btn">
          <Skeleton height={30} width="100px" />
        </div>
      </div>
    </div>

    

  </div>
);

export default SkeletonArticlesCard;
