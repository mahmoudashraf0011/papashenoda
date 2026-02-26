import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonSayingWriteCard = () => (
  <div className="sayingWriteCard bg-gray shadow-md rounded-lg p-4 mb-4">
    {/* محاكاة الصورة */}
    <div className="sayingWriteCardImg mb-4">
      <Skeleton height={160} className="rounded-lg" />
    </div>

    {/* محاكاة محتوى الكارت */}
    <div className="sayingWriteCardContent">
      <div className="signQuote saywImg">
        <Skeleton circle height={40} width={40} />
      </div>
      <div>
        <Skeleton height={16} width="50%" className="mb-4" />
        <Skeleton height={40} width="20%" />
      </div>
    </div>

    {/* محاكاة التوقيع */}
    {/* <div className="sayingWriteCardSign">
      <div>
        <Skeleton height={20} width="60%" className="mb-2" />
        <Skeleton height={20} width="40%" className="mb-2" />
      </div>
      <Skeleton circle height={30} width={30} />
    </div> */}

    {/* محاكاة النقاط */}
   {/*  <Skeleton height={20} width="100px" /> */}
  </div>
);

export default SkeletonSayingWriteCard;
