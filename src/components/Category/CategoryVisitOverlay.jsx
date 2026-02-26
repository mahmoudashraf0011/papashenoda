import React, { useContext, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Context/UserContext';
import './CategoryVisitOverlay.css'

export default function CategoryVisitOverlay({
  closeOverlay,
  visitsImgs,
  index = 0,
  pag = 1,
  filterPhotos = ''
}) {
  const { baseURL } = useContext(UserContext);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const sb = useRef(null);
  const sf = useRef(null);
  const textRefs = useRef([]);
  const buttonRefs = useRef([]);
  const containerRefs = useRef([]);

  function toggleText(i) {
    const text = textRefs.current[i];
    const button = buttonRefs.current[i];
    const container = containerRefs.current[i];
    if (!text || !button || !container) return;

    const isCollapsed = text.classList.contains('collapsed');
    text.classList.toggle('collapsed', !isCollapsed);
    text.classList.toggle('expanded', isCollapsed);

    if (isCollapsed) {
      container.style.backgroundColor = 'rgba(0,0,0,0.8)';
      container.style.position = 'absolute';
      container.style.left = '5%';
      container.style.top = '200px';
      if (sf.current) sf.current.style.display = 'none';
      if (sb.current) sb.current.style.display = 'none';
      button.textContent = 'عرض أقل';
    } else {
      container.style.backgroundColor = 'transparent';
      container.style.position = '';
      container.style.left = '';
      container.style.top = '';
      if (sf.current) sf.current.style.display = 'block';
      if (sb.current) sb.current.style.display = 'block';
      button.textContent = 'عرض المزيد';
    }
  }

  const { id, mediaID } = useParams();
  const location = useLocation();

  const initialPageRef = useRef(pag || 1);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [page, setPage] = useState(pag || 1);

  const imagesPerBatch = 6;
  const fetchedPagesRef = useRef(new Set());
  const imagesKeySetRef = useRef(new Set());

  const swiperRef = useRef(null);
  const appliedInitialRef = useRef(false);
  const userTouchedRef = useRef(false);

  useEffect(() => {
    setImages([]);
    setTotalImages(0);
    setPage(pag || 1);
    initialPageRef.current = pag || 1;
    setCurrentIndex(index || 0);
    fetchedPagesRef.current = new Set();
    imagesKeySetRef.current = new Set();
    appliedInitialRef.current = false;
    userTouchedRef.current = false;

    let seed = [];
    if (Array.isArray(visitsImgs?.value)) seed = visitsImgs.value;
    else if (Array.isArray(visitsImgs)) seed = visitsImgs;

    if (seed.length) {
      const seeded = [];
      for (const it of seed) {
        const key = `${it?.id ?? ''}|${it?.image ?? ''}`;
        if (!imagesKeySetRef.current.has(key)) {
          imagesKeySetRef.current.add(key);
          seeded.push(it);
        }
      }
      setImages(seeded);
    }

    fetchImages(id, pag || 1);
  }, [id, filterPhotos, mediaID]);

  const fetchImages = async (mediaTypeSlug, pageToLoad) => {
    if (!mediaTypeSlug) return;
    if (fetchedPagesRef.current.has(pageToLoad)) return;
    fetchedPagesRef.current.add(pageToLoad);

    setLoading(true);
    try {
      let url;
      if (location.pathname.includes('search')) {
        url = `${baseURL}/v2/public-search?media_type_slug=${encodeURIComponent(
          mediaTypeSlug
        )}&page=${pageToLoad}&per_page=${imagesPerBatch}&${filterPhotos || ''}`;
      } else {
        url = `${baseURL}/get/by/category/slug?slug=${mediaTypeSlug}&lang=ar&media_type_slug=${mediaID}&page=${pageToLoad}&per_page=${imagesPerBatch}`;
      }

      const response = await axios.get(url);
      const newImages = location.pathname.includes('search')
        ? response?.data?.data?.[0]?.value ?? []
        : response?.data?.data?.media?.[0]?.value ?? [];
      const total = response?.data?.pagination?.total ?? 0;

      if (Number.isFinite(total)) setTotalImages(total);

      if (Array.isArray(newImages) && newImages.length) {
        setImages((prev) => {
          const merged = [...prev];
          for (const it of newImages) {
            const key = `${it?.id ?? ''}|${it?.image ?? ''}`;
            if (!imagesKeySetRef.current.has(key)) {
              imagesKeySetRef.current.add(key);
              merged.push(it);
            }
          }
          return merged;
        });
      }
    } catch (e) {
      console.log('Error fetching images:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sw = swiperRef.current;
    if (!sw) return;
    try {
      sw.updateSlides();
      sw.update();
      sw.navigation?.update?.();
    } catch {}
  }, [images.length, totalImages]);

  const handleSlideChange = (swiper) => {
    userTouchedRef.current = true;
    const newIndex = swiper.activeIndex;
    setCurrentIndex(newIndex);

    const nearEnd = newIndex >= images.length - 2;
    const canLoadMore = images.length < totalImages;

    if (nearEnd && canLoadMore && !loading) {
      setPage((p) => {
        const next = p + 1;
        fetchImages(id, next);
        return next;
      });
    }
  };

  const commonProps = {
    spaceBetween: 50,
    slidesPerView: 1,
    initialSlide: index,
    navigation: {
      nextEl: '.visits-back--one',
      prevEl: '.visits-front--one',
    },
    modules: [Navigation, Autoplay, Pagination, EffectFade],
    speed: 2000,
    effect: 'fade',
    onSlideChange: handleSlideChange,
    onSwiper: (sw) => {
      swiperRef.current = sw;
      setTimeout(() => {
        try {
          sw.updateSlides();
          sw.update();
          sw.navigation?.update?.();
          if (!appliedInitialRef.current && Number.isFinite(index)) {
            sw.slideTo(index, 0, false);
            appliedInitialRef.current = true;
          }
        } catch {}
      }, 0);
    },
  };

  const imgZoomRef = useRef(null);
  const handleZoom = (e) => e.target.classList.toggle('zoomed');
  const displayIndex =
    (initialPageRef.current - 1) * imagesPerBatch + currentIndex + 1;

  return (
    <div className={isMobile ? 'cateOverlayRes' : 'cateOverlay'}>
      <div className="overlay">
        <div className={`overlay-wrapper ${isMobile ? 'overlayCate' : ''}`}>
          <img
            src="/assets/close.png"
            alt="close"
            className="visits-overlay-close"
            onClick={closeOverlay}
          />

          <div className="visits-swiper-relative">
            <Swiper {...commonProps} key={isMobile ? 'm' : 'd'}>
              {images.map((visitImg, i) => (
                <SwiperSlide key={visitImg?.id ?? `${visitImg?.image ?? 'img'}-${i}`}>
                  <div className="visits-swiper">
                    <div className="visits-swiper-right">
                      <p className="visits-papa">{visitImg?.category_name}</p>
                      <p
                        className="visits-visits"
                        dangerouslySetInnerHTML={{ __html: visitImg?.description || '' }}
                      />
                    </div>

                    <div className="visits-swiper-line" />

                    <div className="visits-swiper-left">
                      {/* ✅ image container */}
                      <div className="visits-media">
                        <img
                          src={visitImg?.image ?? '/assets/gallery-1.png'}
                          alt=""
                          className="zoomable"
                          ref={imgZoomRef}
                          onClick={handleZoom}
                        />
                      </div>

                      <div style={{ textAlign: 'center', marginTop: 50, direction: 'ltr' }}>
                        ( {Math.min(displayIndex, totalImages || displayIndex)} of {totalImages || images.length} )
                      </div>


                      {visitImg.image != null && (
                        <div class="parent-container-download">
                          <a
                            href={visitImg.image}
                            download
                            className="download-btn-cate"
                            onClick={(e) => e.stopPropagation()} // Prevent parent click
                          >
                            ⬇ تحميل
                          </a>
                        </div>
                      )}

                      {isMobile && (
                        <>
                          <div className="visits-swiper-line-res" />
                          <div
                            className="text-container"
                            ref={(el) => (containerRefs.current[i] = el)}
                          >
                            <p
                              className="visits-visits-res collapsed"
                              dangerouslySetInnerHTML={{ __html: visitImg?.description || '' }}
                              ref={(el) => (textRefs.current[i] = el)}
                            />

                            

                            <button
                              className="read-more"
                              onClick={() => toggleText(i)}
                              ref={(el) => (buttonRefs.current[i] = el)}
                            >
                              عرض المزيد
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              <div className="visits-back visits-back--one">
                <img src="/assets/happen-left.png" alt="prev" className="swiper-back" ref={sb} />
              </div>
              <div className="visits-front visits-front--one">
                <img src="/assets/happen-right.png" alt="next" className="swiper-front" ref={sf} />
              </div>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
