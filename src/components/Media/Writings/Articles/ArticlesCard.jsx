import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useLocation } from 'react-router-dom';

// Skeleton Component for loading state
export const SkeletonArticleCard = () => (
  <div className="articleCard skeleton-card">
    <div className="articleCardImg">
      <Skeleton height={50} width="40%" className="skeleton-img" />
    </div>
    <div className="articleCardContent">
      <Skeleton height={30} width="80%" className="skeleton-title" />
      <Skeleton height={20} width="60%" className="skeleton-desc" />
      <Skeleton height={15} width="50%" className="skeleton-btn" />
    </div>
    <Skeleton height={40} width="30%" className="skeleton-download-btn" />
  </div>
);
const styles = `
  .skeleton-card {
  width: 100%;
  max-width: 400px;
  background-color: #999696ff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.skeleton-img {
  border-radius: 8px;
}
.skeleton-title {
  margin-top: 15px;
  margin-bottom: 10px;
}
.skeleton-desc {
  margin-bottom: 15px;
}
.skeleton-btn {
  margin-top: 15px;
}
.skeleton-download-btn {
  margin-top: 20px;
  width: 100%;
  height: 40px;
}
    width: 100%;
    max-width: 400px;
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  .skeleton-img {
    border-radius: 8px;
  }
  .skeleton-title {
    margin-top: 15px;
    margin-bottom: 10px;
  }
  .skeleton-desc {
    margin-bottom: 15px;
  }
  .skeleton-btn {
    margin-top: 15px;
  }
  .skeleton-download-btn {
    margin-top: 20px;
    width: 100%;
    height: 40px;
  }
`;

export default function ArticlesCard({ img, title, desc, src, check }) {
  const location = useLocation();

  // Save route to localStorage whenever the route changes
  useEffect(() => {
    localStorage.setItem("articleRoute", location.pathname + location.search);
  }, [location]);

  return (
    <div className="articleCard">
      <div className="articleCardImg">
        <Link to={src}>
          <img src={img} alt="article" />
        </Link>
      </div>
      <div className="articleCardContent">
        <Link to={src}>
          <h2 className="articleCardTitle">{title}</h2>
          <p className="articleCardDesc" dangerouslySetInnerHTML={{ __html: desc }}></p>
          <button className="articleCardBtn">
            اقرأ المزيد
            <FontAwesomeIcon icon={faAnglesLeft} className="moreIcon" />
          </button>
        </Link>
      </div>
      {check && (
        <a
          href={img}
          download
          className="download-btn"
          onClick={(e) => e.stopPropagation()} // Prevent parent click
        >
          ⬇ تحميل
        </a>
      )}
    </div>
  );
}
