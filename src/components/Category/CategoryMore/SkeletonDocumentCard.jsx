import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Skeleton from 'react-loading-skeleton';
import { Link, useParams } from 'react-router-dom'


export const SkeletonDocumentCard = () => (
  <div className="articleCard skeleton-card">
    <div className="articleCardImg">
      {/* <Skeleton height={50} width="40%" className="skeleton-img" /> */}
    </div>
    <div className="articleCardContent">
      {/* <Skeleton height={30} width="80%" className="skeleton-title" />
      <Skeleton height={20} width="60%" className="skeleton-desc" />
      <Skeleton height={15} width="50%" className="skeleton-btn" /> */}
    </div>
   {/*  <Skeleton height={40} width="30%" className="skeleton-download-btn" /> */}
  </div>
);
const styles = `
  .skeleton-card {
  width: 100%;
  max-width: 400px;
  background-color: #3d3a3aff;
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
