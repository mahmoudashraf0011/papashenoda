import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

// تعريف الاستايل باستخدام styled-components
const SkeletonBooksSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* المسافة بين الكروت */
`;

const SkeletonBookCard = styled.div`
  flex: 1 1 30%;
  padding: 10px;
`;

const SkeletonBook = () => (
  <SkeletonBookCard>
    {/* محاكاة صورة الكتاب */}
    <Skeleton height={200} className="rounded-lg" style={{ marginBottom: '10px', marginTop:"30px" }} />
    {/* محاكاة عنوان الكتاب */}
    <Skeleton height={20} width="80%" className="mb-3" />
    {/* محاكاة الأزرار */}
    <div style={{ display: 'flex', gap: '10px' }}>
      <Skeleton height={30} width="45%" />
      <Skeleton height={30} width="45%" />
    </div>
  </SkeletonBookCard>
);

const SkeletonBooks = () => (
  <SkeletonBooksSection>
    {/* عرض 3 كروت في كل سطر */}
    <SkeletonBook />
    <SkeletonBook />
    <SkeletonBook />
    <SkeletonBook />
    <SkeletonBook />
    <SkeletonBook />
    <SkeletonBook />
    <SkeletonBook />
    <SkeletonBook />
  </SkeletonBooksSection>
);

export default SkeletonBooks;
