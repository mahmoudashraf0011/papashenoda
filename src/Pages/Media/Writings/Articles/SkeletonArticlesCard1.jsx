import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';

const SkeletonArticlesCard1 = () => {
  // نعمل array فيها 8 عناصر علشان نعمل 8 كروت
  const cards = Array(2).fill(0);

  return (
    <div className="flex flex-wrap justify-center w-full">
      {cards.map((_, index) => (
        <div
          key={index}
          className="p-4"
          style={{ width: "320px", height: "1600px",marginLeft:"3%" }}
        >
          <div className="articleCard bg-gray-200 shadow-md rounded-lg p-4">
            {/* صورة التحميل */}
            <div className="articleCardImg mb-4">
              {/* <Skeleton height={160} className="rounded-lg" /> */}
            </div>

            {/* محتوى الكارت */}
            <div className="articleCardContent">
              <Link to="#">
                {/* <Skeleton height={24} width="80%" className="mb-2" />
                <Skeleton height={16} width="100%" className="mb-4" />
                <Skeleton height={40} width="50%" /> */}
              </Link>
            </div>

            {/* زر التحميل */}
            <div className="download-btn mt-4">
              {/* <Skeleton height={30} width="100px" /> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonArticlesCard1;
