// Visits.jsx
import React, { useState, useEffect, useContext } from 'react';
import './Visits.scss';
import './Visits-res.scss';

import axios from 'axios';
import { UserContext } from '../Context/UserContext';
import { useParams } from 'react-router-dom';

import VisitsPhotos from './VisitsPhotos';
import VisitsOverlay from './VisitsOverlay';
import Paginate from '../Utility/Paginate';
import SkeletonVisitsSection from './SkeletonVisitsSection';

export default function Visits() {
  const [visitsImgs, setVisitsImgs] = useState(null); // images payload from API
  const [page, setPage] = useState(1);                // current pagination page
  const [pag, setPag] = useState(null);               // pagination meta
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // ZERO-BASED selected image index
  const [loading, setLoading] = useState(true);

  const { id } = useParams();        // slug from URL
  const { baseURL } = useContext(UserContext);

  // One-time window listeners (moved out of render)
  useEffect(() => {
    const onHashChange = (e) => {
      e.preventDefault();
    };
    window.addEventListener('hashchange', onHashChange);

    // Clear hash on initial mount
    const origOnload = window.onload;
    window.onload = function () {
      try {
        window.history.replaceState(null, null, ' ');
      } catch {}
      if (typeof origOnload === 'function') origOnload();
    };

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  // Ensure scroll starts at top when component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch visits images from API
  const fetchVisits = () => {
    setLoading(true);
    axios
      .get(`${baseURL}/v2/get/images?slug=${id}&lang=ar&page=${page}`)
      .then((response) => {
        setVisitsImgs(response.data || null);
        setPag(response.data?.pagination || null);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  // Fetch on mount & when page changes
  useEffect(() => {
    if (!id) return;
    fetchVisits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page]);

  // Open overlay with the clicked image (index is ZERO-BASED)
  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setOverlayVisible(true);
  };

  const closeOverlay = () => setOverlayVisible(false);

  // Handle pagination
  const handlePageChange = (selectedPage) => {
    setPage(selectedPage);
    window.scrollTo(1600, 1600);
  };

  return (
    <div className="visits">
      <div className="visits-wrapper" style={{ width: '100%' }}>
        {/* Overlay */}
        {isOverlayVisible && visitsImgs && (
          <VisitsOverlay
            closeOverlay={closeOverlay}
            visitsImgs={visitsImgs}
            index={currentIndex}                  // ZERO-BASED
            pag={pag?.current_page || 1}
          />
        )}

        {/* Skeleton / Empty / Hero */}
        {loading ? (
          <div className="visits-videos-big-cont">
            <SkeletonVisitsSection />
          </div>
        ) : !visitsImgs ||
          !Array.isArray(visitsImgs?.data?.images) ||
          visitsImgs.data.images.length === 0 ? (
          <div className="visits-videos-big-cont">
            <p className="noResult" style={{ marginTop: '5%' }}>
              لا يوجد نتائج
            </p>
          </div>
        ) : (
          <div className="visits-head-img-rel">
            <img
              src={visitsImgs.data.hero_image}
              alt="hero_image"
              className="visits-head-img"
              style={{ width: '100%' }}
            />
          </div>
        )}

        {/* Grid + Pagination */}
        {visitsImgs &&
          Array.isArray(visitsImgs?.data?.images) &&
          visitsImgs.data.images.length > 0 && (
            <div className="visits-videos-big-cont">
              <p className="videos-about">{visitsImgs.data.category_name}</p>
              <VisitsPhotos
                handleImageClick={handleImageClick}
                visitsImgs={visitsImgs.data}
              />
              {pag?.total !== 0 && (
                <Paginate
                  pageCount={pag?.total_pages || 1}
                  onPress={handlePageChange}
                />
              )}
            </div>
          )}
      </div>
    </div>
  );
}
