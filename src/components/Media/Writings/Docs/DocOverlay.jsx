import React, { useContext, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import './DocsContainer.css';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../../Context/UserContext';

export default function DocOverlay({ closeOverlay, img, cate, imgs, initialSlide = 0, activePage }) {
  const { baseURL } = useContext(UserContext);

  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { id, mediaID } = useParams();

  // Gallery state
  const [imagesPhoto, setImagesPhoto] = useState([]);
  const [totalImagesPhoto, setTotalImagesPhoto] = useState(0);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [activeIndexPhoto, setActiveIndexPhoto] = useState(initialSlide || 0);
  const [pagePhoto, setPagePhoto] = useState(activePage || 1);
  const [isPrepending, setIsPrepending] = useState(false);
  const imagesPerBatchPhoto = 8;

  const fetchedPagesRef = useRef(new Set());
  const startPageRef = useRef(activePage || 1);
  const swiperRef = useRef(null);

  const ele = useRef(null);

  // Responsive flag
  useEffect(() => {
    const checkResponsive = () => setIsMobile(window.innerWidth <= 768);
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  const isSearch = location.pathname.includes('search');
  const isDocs = location.pathname.includes('docs/');

  const buildSearchParams = () => {
    let defaultData = {};
    try {
      const raw = localStorage.getItem('allFilter');
      if (raw) defaultData = JSON.parse(raw);
    } catch {}
    const safeSearchWord = defaultData.searchWord ? `search=${encodeURIComponent(defaultData.searchWord)}&` : '';
    const safeQueryStringOfCates = defaultData.queryStringOfCates ? `${defaultData.queryStringOfCates}&` : '';
    const safeQueryStringMedia = defaultData.queryStringMedia ? `${defaultData.queryStringMedia}&` : '';
    const safeSearchValue = defaultData.searchValue
      ? `key_words[]=${encodeURIComponent(defaultData.searchValue)}&`
      : '';
    return `${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`;
  };

  // ✅ Fetch images (append or prepend)
  const fetchImagesPhoto = async (page, { prepend = false } = {}) => {
    if (fetchedPagesRef.current.has(page)) return 0;
    fetchedPagesRef.current.add(page);

    if (prepend && (!startPageRef.current || page < startPageRef.current)) {
      startPageRef.current = page;
    }

    setLoadingPhoto(true);
    try {
      let url, response, newImages, total;
      if (isSearch) {
        const qs = buildSearchParams();
        url = `${baseURL}/v2/public-search?media_type_slug=documents&page=${page}&per_page=${imagesPerBatchPhoto}&${qs}`;
        response = await axios.get(url);
        newImages = response?.data?.data?.[0]?.value ?? [];
        total = response?.data?.pagination?.total ?? 0;
      } else if (isDocs) {
        url = `${baseURL}/v2/document/by/category?slug=${id}&lang=ar&per_page=${imagesPerBatchPhoto}&page=${page}&`;
        response = await axios.get(url);
        newImages = response?.data?.data?.media ?? [];
        total = response?.data?.pagination?.total ?? 0;
      } else {
        url = `${baseURL}/get/by/category/slug?slug=${id}&lang=ar&media_type_slug=${mediaID}&per_page=${imagesPerBatchPhoto}&page=${page}`;
        response = await axios.get(url);
        newImages = response?.data?.data?.media?.[0]?.value ?? [];
        total = response?.data?.pagination?.total ?? 0;
      }

      const incoming = Array.isArray(newImages) ? newImages : [];
      setImagesPhoto((prev) => {
        const seen = new Set(prev.map((x) => x.id));
        const filtered = incoming.filter((x) => !seen.has(x.id));
        return prepend ? [...filtered, ...prev] : [...prev, ...filtered];
      });
      setTotalImagesPhoto(total || 0);
      return incoming.length;
    } catch (error) {
      console.error('Error fetching data photo:', error);
      return 0;
    } finally {
      setLoadingPhoto(false);
    }
  };

  // Initial load
  useEffect(() => {
    setImagesPhoto([]);
    setTotalImagesPhoto(0);
    setActiveIndexPhoto(initialSlide || 0);
    fetchedPagesRef.current = new Set();
    startPageRef.current = activePage || 1;
    setPagePhoto(activePage || 1);

    (async () => {
      await fetchImagesPhoto(activePage || 1);
      if (swiperRef.current) {
        try {
          swiperRef.current.slideTo(initialSlide || 0, 0);
        } catch {}
      }
    })();

    console.log("activePage",activePage);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mediaID, location.pathname, activePage]);

  // ✅ Handle Zoom (restored)
  const handleZoom = (e) => {
    e.target.classList.toggle('zoomed');
  };

  // Slide change
  const handleSlideChangePhoto = (swiper) => {
    const newIndex = swiper.activeIndex;
    setActiveIndexPhoto(newIndex);
    const nearEnd = newIndex >= imagesPhoto.length - 2;
    const canLoadMore = imagesPhoto.length < totalImagesPhoto;
    if (nearEnd && canLoadMore && !loadingPhoto) {
      const nextPage = (pagePhoto || startPageRef.current) + 1;
      setPagePhoto(nextPage);
      fetchImagesPhoto(nextPage);
    }
  };

  // ✅ Next and Prev
  const handleNextClick = async () => {
    if (!swiperRef.current) return;
    const nextIndex = activeIndexPhoto + 1;
    if (nextIndex < imagesPhoto.length) {
      setActiveIndexPhoto(nextIndex);
      swiperRef.current.slideTo(nextIndex, 400);
      return;
    }
    if (imagesPhoto.length < totalImagesPhoto && !loadingPhoto) {
      const nextPage = (pagePhoto || startPageRef.current) + 1;
      setPagePhoto(nextPage);
      const prevLen = imagesPhoto.length;
      const incoming = await fetchImagesPhoto(nextPage);
      if (incoming > 0) {
        const newIndex = prevLen;
        setActiveIndexPhoto(newIndex);
        swiperRef.current.slideTo(newIndex, 400);
      }
    }
  };

  const handlePrevClick = async () => {
    if (!swiperRef.current) return;
    if (activeIndexPhoto > 0) {
      const newIndex = activeIndexPhoto - 1;
      setActiveIndexPhoto(newIndex);
      swiperRef.current.slideTo(newIndex, 400);
      return;
    }
    const earliestPage = startPageRef.current || activePage || 1;
    if (earliestPage > 1 && !loadingPhoto && !isPrepending) {
      setIsPrepending(true);
      const prevPage = earliestPage - 1;
      const incoming = await fetchImagesPhoto(prevPage, { prepend: true });
      if (incoming > 0) {
        startPageRef.current = prevPage;
        const newIndex = incoming - 1;
        setActiveIndexPhoto(newIndex);
        setTimeout(() => {
          try {
            swiperRef.current.slideTo(newIndex, 400);
          } catch {}
        }, 50);
      }
      setIsPrepending(false);
    }
  };

  // Global display index
  let displayIndex = activeIndexPhoto + 1;
  if (startPageRef.current && Number.isFinite(imagesPerBatchPhoto)) {
    const offset = (startPageRef.current - 1) * imagesPerBatchPhoto;
    displayIndex = offset + activeIndexPhoto + 1;
  }

  const handleClose = () => {
    if (typeof closeOverlay === 'function') closeOverlay();
  };

  const slidesOverlayPhoto = Array.isArray(imagesPhoto)
    ? imagesPhoto.map((item) => ({ image: item.image, id: item.id }))
    : [];

  const path = '/media/documents';
  const dir = location.pathname.includes(path) ? 'ltr' : 'rtl';

  const hasPrevAvailable = startPageRef.current > 1 || activeIndexPhoto > 0;
  const hasNextAvailable =
    (startPageRef.current - 1) * imagesPerBatchPhoto + imagesPhoto.length <
      (totalImagesPhoto || 0) ||
    activeIndexPhoto < imagesPhoto.length - 1;

  return (
    <div className="overlay">
      <div className="overlay-wrapper">
        <img
          src="/assets/close.png"
          alt="Close"
          className="visits-overlay-cancel"
          onClick={handleClose}
        />
        <h2 className="overlayDocsImgCate">{cate}</h2>

        <div className="overlayDocsContent" dir={dir}>
          {/* Prev */}
          <div
            className={`overlay-docs-back docs-arrow ${
              !hasPrevAvailable || isPrepending ? 'disabled' : ''
            }`}
            role="button"
            tabIndex={0}
            aria-label="Previous"
            style={{ pointerEvents: hasPrevAvailable && !isPrepending ? 'auto' : 'none', zIndex: 9999 }}
            onClick={handlePrevClick}
          >
            <img
              src={isMobile ? '/assets/happen-right.png' : '/assets/happen-right.png'}
              alt="Previous"
              className="swiper-back"
              style={{ pointerEvents: 'none' }}
            />
          </div>

          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            modules={[Autoplay, Pagination, EffectCoverflow]}
            speed={800}
            effect="coverflow"
            initialSlide={initialSlide}
            onSwiper={(s) => (swiperRef.current = s)}
            onSlideChange={handleSlideChangePhoto}
            coverflowEffect={{
              rotate: -50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
          >
            {slidesOverlayPhoto.map((item, index) => (
              <SwiperSlide key={item.id ?? index}>
                <div className="overlayDocsImg">
                  {/* ✅ handleZoom fully restored */}
                  <img
                    src={item.image}
                    className="zoomable"
                    ref={ele}
                    onClick={handleZoom}
                    alt={`doc-${item.id}`}
                  />
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: isMobile ? '10px' : '30px',
                    direction: 'ltr',
                  }}
                >
                  ({displayIndex} of {totalImagesPhoto || slidesOverlayPhoto.length})
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Next */}
          <div
            className={`overlay-docs-front docs-arrow ${!hasNextAvailable ? 'disabled' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Next"
            style={{ pointerEvents: hasNextAvailable ? 'auto' : 'none', zIndex: 9999 }}
            onClick={handleNextClick}
          >
            <img
              src={isMobile ? '/assets/happen-left.png' : '/assets/happen-left.png'}
              alt="Next"
              className="swiper-front"
              style={{ pointerEvents: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
