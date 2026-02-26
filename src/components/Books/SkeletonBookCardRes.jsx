import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import { ReactReader } from 'react-reader';
import { Link } from 'react-router-dom';


export const SkeletonBookCardRes = () => (
  <div className="skeleton-book-card-container">
    <div className="skeleton-book-card">
      <div className="skeleton-book-card-content">
        {/* الصورة على الشمال */}
        <div className="skeleton-book-img-container">
          <Skeleton height={200} width="100%" className="skeleton-book-img" />
        </div>

        {/* المعلومات على اليمين */}
        <div className="books-section-one-info">
          <Skeleton height={30} width="100%" style={{ marginBottom: '10px' }} />
          <Skeleton height={20} width="80%" style={{ marginBottom: '10px' }} />
          <div className="book-links">
            <Skeleton height={40} width="60%" style={{ marginBottom: '10px' }} />
            <Skeleton height={40} width="60%" style={{ marginBottom: '10px' }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const styles = `
  .skeleton-book-card-container {
    display: flex;
    justify-content: center; /* Centering horizontally */
    align-items: center; /* Centering vertically */
    width: 40%;
    height: 100vh; /* Full viewport height */
    padding: 20px;
    box-sizing: border-box;  /* To ensure padding is included in the total width/height */
  }

  .skeleton-book-card {
    width: 90%; /* Increased width for each card */
    max-width: 1000px; /* Max width to prevent too large cards */
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }

  .skeleton-book-card-content {
    display: flex;
    flex-direction: row; /* صف أفقي */
    justify-content: flex-start; /* Align content to start */
    align-items: center; /* Vertically center content */
  }

  .skeleton-book-img-container {
    flex: 0 0 40%; /* الصورة تأخذ 40% من العرض */
    margin-right: 20px; /* مسافة بين الصورة والمحتوى */
  }

  .skeleton-book-img {
    margin-top: 15px;
    border-radius: 8px;
  }

  .books-section-one-info {
    flex: 1; /* يجعل النص يأخذ المساحة المتبقية */
    padding: 15px 0;
  }

  .book-links {
    margin-top: 10px;
  }

  .skeleton-book-card-container .skeleton-book-card + .skeleton-book-card {
    margin-top: 20px;
  }
`;

export default SkeletonBookCardRes;
 ;



