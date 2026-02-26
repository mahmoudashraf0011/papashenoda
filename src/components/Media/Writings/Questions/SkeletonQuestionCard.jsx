import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonQuestionCard = () => (
  <div className="questionCard bg-white shadow-md rounded-lg p-4 mb-4">
    <div className="questionCardContent">
      {/* محاكاة أيقونة الصوت */}
      <Skeleton circle height={30} width={30} className="mb-4" />

      <div className="questionCardContentRight">
        {/* محاكاة السؤال */}
        <Skeleton height={20} width="70%" className="mb-4" />
      </div>

      {/* محاكاة أيقونة التبديل */}
      <Skeleton height={20} width={20} />
    </div>

    {/* محاكاة الوصف */}
    <div className="questionCardDropdown">
      <Skeleton height={60} width="100%" className="mb-4" />
      {/* محاكاة زر التحميل */}
      <Skeleton height={30} width={100} />
    </div>
  </div>
);

export default SkeletonQuestionCard;
