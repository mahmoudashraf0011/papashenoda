// SayingFilterContainer
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import SayingWriteCard from '../SayingWriteCard';
import MediaHeader from '../../../MediaHeader';
import './SayingFilterContainer.css';
import SayingsPhotoCard from '../SayingsPhotoCard';
import { useParams } from 'react-router-dom';
import SayingsDetailsHook from '../../../../../Logic/Media/Writings/Sayings/SayingsDetailsHook';
import Paginate from '../../../../Utility/Paginate';
import Spinner from '../../../../Utility/Spinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import SkeletonSayingWriteCard from '../SkeletonSayingWriteCard';
import { UserContext } from '../../../../Context/UserContext';
import SkeletonArticlesCard1 from '../../../../../Pages/Media/Writings/Articles/SkeletonArticlesCard1';

export default function SayingFilterContainer() {
  const { baseURL } = useContext(UserContext);
  const { id } = useParams();

  // ===== Hook data (kept as-is) =====
  const [
    sayingsWrittenData, sayingsPhotoData, sayingsWrittenFilter, sayingsPhotoFilter,
    pageCountSP, pageCountSW, sayingsPhotoAttrs, sayingsWrittenAttrs,
    handleChangePageSW, handleChangePageSP, getData, notFound, notFoundWrite, activePage
  ] = SayingsDetailsHook();

  // ===== main grid images state (unchanged unless real paginate/append happens) =====
  const [images, setImages] = useState([]);   // main grid items
  const [totalImages, setTotalImages] = useState(0);
  const [loading, setLoading] = useState(false);

  const imagesPerBatch = 8;
  const cateID = JSON.parse(localStorage.getItem('sayingPhotoAttr'));

  const [currentListPage, setCurrentListPage] = useState(activePage || 1);

  // page number of images[0] in the main grid
  const [firstLoadedPage, setFirstLoadedPage] = useState(1);

  // track which pages the main grid already loaded
  const loadedPagesRef = useRef(new Set());

  // ===== overlay / lightbox isolated buffer (NEW) =====
  const [overlayImages, setOverlayImages] = useState(null); // null when overlay closed, array when open
  const overlayLoadedPagesRef = useRef(new Set()); // pages loaded inside overlay buffer
  const overlayFirstLoadedPageRef = useRef(null); // page number of overlayImages[0]
  const overlayFetchInProgressRef = useRef(false); // guard for overlay fetches
  const overlayJustOpenedRef = useRef(false); // ignore first onSlideChange inside overlay

  // track how many prepended items we added inside overlay (for internal consistency)
  const overlayPrependedCountRef = useRef(0);

  // ===== Overlay / Lightbox state (UI) =====
  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);     // index inside current active images (overlayImages when open, images otherwise)
  const selectedIndexRef = useRef(0);
  const swiperRef = useRef(null);
  const [swiperKey, setSwiperKey] = useState('0');

  // small guard to avoid overlapping fetches (main grid)
  const fetchInProgressRef = useRef(false);

  // RTL / helpers
  const isRTL = true;

  const prefetchAround = (idx, arr = (overlayImages ?? images)) => {
    const preload = (src) => {
      if (!src) return;
      const img = new Image();
      img.src = src;
    };
    preload(arr[idx - 1]?.image);
    preload(arr[idx + 1]?.image);
  };

  // ===== Helpers to compute pages for arrays =====
  const getLoadedPagesCountFor = (arr) => {
    return Math.ceil((arr?.length || 0) / imagesPerBatch) || 0;
  };
  const computeLastLoadedPageFor = (firstPage, arr) => {
    return firstPage + Math.max(0, getLoadedPagesCountFor(arr) - 1);
  };

  // ===== Main grid fetch (replace/append) - unchanged semantics =====
  const fetchImagesMain = async (page, { replace = false } = {}) => {
    if (!page || page < 1) return;
    // skip if main already loaded the page
    if (loadedPagesRef.current.has(page) && !replace) return;
    if (fetchInProgressRef.current) return;
    fetchInProgressRef.current = true;
    setLoading(true);
    try {
      const url = `${baseURL}/getmedia/10?${cateID ? cateID + '&' : ''}per_page=${imagesPerBatch}&page=${page}&lang=ar`;
      const response = await axios.get(url);
      const newImages = response?.data?.data ?? [];
      const total = response?.data?.pagination?.total ?? 0;
      setTotalImages(total);

      setImages(prev => {
        if (replace) {
          setFirstLoadedPage(page);
          loadedPagesRef.current.clear();
          loadedPagesRef.current.add(page);
          return newImages;
        } else {
          const existingIds = new Set((prev || []).map(i => i.id));
          const filtered = newImages.filter(i => !existingIds.has(i.id));
          if (!prev || prev.length === 0) {
            setFirstLoadedPage(page);
          }
          loadedPagesRef.current.add(page);
          return [...(prev || []), ...filtered];
        }
      });
    } catch (err) {
      console.log('Error fetching main images:', err);
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  };

  // initial load / paginate replacements
  useEffect(() => {
    if (!id || id !== 'written-quotes-more') {
      setCurrentListPage(activePage || 1);
      setImages([]); // reset main grid
      loadedPagesRef.current.clear();
      fetchImagesMain(activePage || 1, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, id]);

  useEffect(() => {
    if (!id || id !== 'written-quotes-more') {
      setImages([]);
      loadedPagesRef.current.clear();
      fetchImagesMain(1, { replace: true });
      setCurrentListPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== OVERLAY fetch functions (operate only on overlayImages) =====
  const initOverlayBuffer = (startArray) => {
    setOverlayImages([...startArray]);
    // compute overlayFirstLoadedPageRef from current main firstLoadedPage
    overlayFirstLoadedPageRef.current = firstLoadedPage;
    overlayLoadedPagesRef.current = new Set();
    const pagesCount = getLoadedPagesCountFor(startArray);
    for (let i = 0; i < pagesCount; i++) {
      overlayLoadedPagesRef.current.add(firstLoadedPage + i);
    }
    overlayPrependedCountRef.current = 0;
  };

  const fetchImagesOverlay = async (page, { mode = 'append' } = {}) => {
    if (!page || page < 1) return;
    if (overlayLoadedPagesRef.current.has(page)) return;
    if (overlayFetchInProgressRef.current) return;

    overlayFetchInProgressRef.current = true;
    try {
      const url = `${baseURL}/getmedia/10?${cateID ? cateID + '&' : ''}per_page=${imagesPerBatch}&page=${page}&lang=ar`;
      const response = await axios.get(url);
      const newImages = response?.data?.data ?? [];
      const total = response?.data?.pagination?.total ?? 0;
      setTotalImages(total);

      setOverlayImages(prev => {
        if (!prev) prev = [];
        if (mode === 'replace') {
          overlayFirstLoadedPageRef.current = page;
          overlayLoadedPagesRef.current.clear();
          overlayLoadedPagesRef.current.add(page);
          return newImages;
        }
        if (mode === 'prepend') {
          const existingIds = new Set((prev || []).map(i => i.id));
          const filtered = newImages.filter(i => !existingIds.has(i.id));
          overlayPrependedCountRef.current += filtered.length;
          overlayLoadedPagesRef.current.add(page);
          overlayFirstLoadedPageRef.current = page;
          return [...filtered, ...prev];
        }
        // append
        const existingIds = new Set((prev || []).map(i => i.id));
        const filtered = newImages.filter(i => !existingIds.has(i.id));
        if (!prev || prev.length === 0) {
          overlayFirstLoadedPageRef.current = page;
        }
        overlayLoadedPagesRef.current.add(page);
        return [...prev, ...filtered];
      });
    } catch (err) {
      console.log('Error fetching overlay images:', err);
    } finally {
      overlayFetchInProgressRef.current = false;
    }
  };

  // ===== OPEN overlay: create an isolated buffer and ensure nearby pages for navigation (only overlay) =====
  const openOverlay = async (indexInGrid) => {
    // compute absolute global index of clicked image (zero-based)
    // absoluteIndexGlobal = (firstLoadedPage - 1)*imagesPerBatch + indexInGrid
    const absoluteIndexGlobal = Math.max(0, (firstLoadedPage - 1) * imagesPerBatch + indexInGrid);

    // snapshot main grid into a local start array (use this instead of reading overlayImages state immediately)
    const startArray = [...(images || [])];

    // init overlay refs/state based on this snapshot (synchronous refs)
    setOverlayImages(startArray);
    overlayFirstLoadedPageRef.current = firstLoadedPage;
    overlayLoadedPagesRef.current = new Set();
    const pagesCount = getLoadedPagesCountFor(startArray);
    for (let i = 0; i < pagesCount; i++) {
      overlayLoadedPagesRef.current.add(firstLoadedPage + i);
    }
    overlayPrependedCountRef.current = 0;

    // set a provisional selectedIndex relative to the overlay buffer (based on startArray)
    const safeIndex = Math.max(0, Math.min(indexInGrid, (startArray?.length || 1) - 1));
    selectedIndexRef.current = safeIndex;
    setSelectedIndex(safeIndex);

    // create new swiper key so it mounts fresh
    setSwiperKey(`lightbox-${(startArray?.length || 0)}-${safeIndex}-${Date.now()}`);

    overlayJustOpenedRef.current = true; // ignore first automatic onSlideChange inside overlay

    // open overlay (so UI shows quickly)
    setOverlayOpen(true);
    document.body.style.overflow = 'hidden';

    // then ensure previous page is present in overlay (but do not change main grid)
    const overlayFirst = overlayFirstLoadedPageRef.current || 1;
    const prevPage = overlayFirst > 1 ? overlayFirst - 1 : null;
    if (prevPage && !overlayLoadedPagesRef.current.has(prevPage)) {
      try {
        overlayFetchInProgressRef.current = true;
        const url = `${baseURL}/getmedia/10?${cateID ? cateID + '&' : ''}per_page=${imagesPerBatch}&page=${prevPage}&lang=ar`;
        const response = await axios.get(url);
        const prevImages = response?.data?.data ?? [];

        // determine which of prevImages are new when compared to our local snapshot (startArray)
        const existingIds = new Set((startArray || []).map(i => i.id));
        const filtered = prevImages.filter(i => !existingIds.has(i));

        if (filtered.length > 0) {
          // prepend into the overlay buffer (use functional update)
          setOverlayImages(prev => {
            const newArr = [...filtered, ...(prev || [])];
            return newArr;
          });

          // record overlay page & firstLoaded
          overlayLoadedPagesRef.current.add(prevPage);
          overlayFirstLoadedPageRef.current = prevPage;
          overlayPrependedCountRef.current += filtered.length;

          // recompute overlay-selected index from absolute index and overlayFirstLoadedPageRef
          const overlayFirstAfter = overlayFirstLoadedPageRef.current || 1;
          const overlaySelectedIndex = absoluteIndexGlobal - (overlayFirstAfter - 1) * imagesPerBatch;
          const clamped = Math.max(0, overlaySelectedIndex);
          setSelectedIndex(clamped);
          selectedIndexRef.current = clamped;

          // ensure swiper moves to the recomputed index without animation
          setTimeout(() => {
            swiperRef.current?.slideTo(selectedIndexRef.current, 0, false);
          }, 0);
        } else {
          // no new items were prepended; still ensure swiper aligns to current selected index
          setTimeout(() => {
            swiperRef.current?.slideTo(selectedIndexRef.current, 0, false);
          }, 0);
        }
      } catch (err) {
        console.log('Error while preloading prev page into overlay on open:', err);
      } finally {
        overlayFetchInProgressRef.current = false;
      }
    } else {
      // no prepend happened — ensure the selectedIndex aligns with absolute index and overlayFirstLoadedPage
      const overlayFirstNow = overlayFirstLoadedPageRef.current || firstLoadedPage;
      const overlaySelectedIndex = absoluteIndexGlobal - (overlayFirstNow - 1) * imagesPerBatch;
      const clamped = Math.max(0, Math.min(overlaySelectedIndex, (startArray?.length || 1) - 1));
      setSelectedIndex(clamped);
      selectedIndexRef.current = clamped;
      setTimeout(() => {
        swiperRef.current?.slideTo(selectedIndexRef.current, 0, false);
      }, 0);
    }

    // prefetch near the selected index (use startArray for prefetch because overlayImages state may still be updating)
    prefetchAround(selectedIndexRef.current, startArray);
  };

  // ===== CLOSE overlay: discard overlay buffer (do not touch main images) =====
  const closeOverlay = () => {
    setOverlayImages(null);
    overlayLoadedPagesRef.current.clear();
    overlayFirstLoadedPageRef.current = null;
    overlayPrependedCountRef.current = 0;
    overlayFetchInProgressRef.current = false;
    overlayJustOpenedRef.current = false;
    setOverlayOpen(false);
    document.body.style.overflow = '';
  };

  // ===== handle slide change inside overlay (works on overlayImages) or when not overlay (main images) =====
  const handleSlideChange = (swiper) => {
    const idx = swiper.activeIndex;
    setSelectedIndex(idx);
    const activeArr = overlayImages ?? images;
    prefetchAround(idx, activeArr);

    if (isOverlayOpen) {
      if (overlayJustOpenedRef.current) {
        overlayJustOpenedRef.current = false;
        return;
      }

      // append next page inside overlay if needed
      const overlayFirst = overlayFirstLoadedPageRef.current || 1;
      const overlayLast = computeLastLoadedPageFor(overlayFirst, overlayImages);
      const nextPage = overlayLast + 1;
      const isAtLastSlide = idx >= (overlayImages?.length || 0) - 1;
      const stillHasMore = (overlayImages?.length || 0) < (totalImages || 0);
      if (isAtLastSlide && stillHasMore && !overlayFetchInProgressRef.current && !overlayLoadedPagesRef.current.has(nextPage)) {
        fetchImagesOverlay(nextPage, { mode: 'append' });
      }

      // prepend previous page inside overlay when at first slide
      const isAtFirstSlide = idx === 0;
      const prevPage = (overlayFirstLoadedPageRef.current || 1) > 1 ? (overlayFirstLoadedPageRef.current - 1) : null;
      if (isAtFirstSlide && prevPage && !overlayLoadedPagesRef.current.has(prevPage) && !overlayFetchInProgressRef.current) {
        (async () => {
          try {
            overlayFetchInProgressRef.current = true;
            const url = `${baseURL}/getmedia/10?${cateID ? cateID + '&' : ''}per_page=${imagesPerBatch}&page=${prevPage}&lang=ar`;
            const response = await axios.get(url);
            const prevImages = response?.data?.data ?? [];
            const existingIds = new Set((overlayImages || []).map(i => i.id));
            const filtered = prevImages.filter(i => !existingIds.has(i));
            if (filtered.length > 0) {
              setOverlayImages(prev => [...filtered, ...(prev || [])]);
              overlayPrependedCountRef.current += filtered.length;
              overlayLoadedPagesRef.current.add(prevPage);
              overlayFirstLoadedPageRef.current = prevPage;
              // shift indices so user stays on equivalent image
              setSelectedIndex(s => s + filtered.length);
              selectedIndexRef.current = selectedIndexRef.current + filtered.length;
              setTimeout(() => {
                swiperRef.current?.slideTo(selectedIndexRef.current, 0, false);
              }, 0);
            }
          } catch (err) {
            console.log('Error prepending previous page into overlay on first-slide-nav:', err);
          } finally {
            overlayFetchInProgressRef.current = false;
          }
        })();
      }

      return;
    }

    // Non-overlay behavior (main grid) – keep earlier behavior minimal/default
  };

  // ===== Zoom handler (unchanged) =====
  const handleZoom = (e) => {
    e.target.classList.toggle('zoomed');
  };

  // ===== global index for counter: when overlay open use overlayFirstLoadedPageRef, else main firstLoadedPage =====
  const getGlobalIndex = () => {
    const baseFirst = isOverlayOpen ? (overlayFirstLoadedPageRef.current || 1) : firstLoadedPage;
    const baseOffset = Math.max(0, (baseFirst - 1) * imagesPerBatch);
    return baseOffset + (selectedIndex + 1);
  };

  // ===== UI =====
  return (
    <div className="sayingFilterContainer">
      {id === 'written-quotes-more' ? (
        // written quotes (unchanged)
        <>
          <div className="Container">
            <MediaHeader title="اقوال مكتوبة" />
            <div className="sayingsWriteItems">
              {loading ? (
                <>
                  <SkeletonSayingWriteCard />
                  <SkeletonSayingWriteCard />
                  <SkeletonSayingWriteCard />
                  <SkeletonSayingWriteCard />
                </>
              ) : (
                sayingsWrittenData?.[0]?.map((item) => (
                  <SayingWriteCard
                    key={item.id}
                    img={item.image}
                    desc={item.quote}
                    name="البابا شنوده الثالث"
                    cate={item.name}
                    checked={item.sharepoint_image}
                  />
                )) || ''
              )}
            </div>
            <p className="noResult" ref={notFoundWrite} style={{ display: 'none' }}>
              لا يوجد نتائج
            </p>
          </div>
          {pageCountSW !== 0 && (
            <Paginate pageCount={pageCountSW} onPress={handleChangePageSW} activePage={activePage} />
          )}
        </>
      ) : (
        // photos grid
        <>
          <div className="Container">
            <MediaHeader title="صور اقوال" />
            <div className="sayingsPhotoItems">
              {images && images.length > 0 ? (
                images.map((item, idx) => (
                  <div key={item.id || `${item.image}-${idx}`} onClick={() => openOverlay(idx)}>
                    <SayingsPhotoCard src={item.image || '/assets/media/writings/Sayings/1.png'} />
                  </div>
                ))
              ) : loading ? (
                <>
                  <SkeletonArticlesCard1 />
                  <SkeletonArticlesCard1 />
                  <SkeletonArticlesCard1 />
                  <SkeletonArticlesCard1 />
                </>
              ) : (
                <p className="noResult" style={{ textAlign: 'center', width: '100%' }}>لا يوجد نتائج</p>
              )}
            </div>
            <p className="noResult" ref={notFound} style={{ display: 'none' }}>
              لا يوجد نتائج
            </p>
          </div>

          {/* external paginate (unchanged) */}
          {pageCountSP !== 0 && (
            <Paginate pageCount={pageCountSP} onPress={handleChangePageSP} activePage={activePage} />
          )}

          {/* Overlay lightbox (uses overlayImages if open; otherwise won't render) */}
          {isOverlayOpen && (
            <div
              className="overlay"
              onClick={(e) => {
                if (e.target.classList.contains('overlay')) closeOverlay();
              }}
            >
              <div className="overlay-wrapper" role="dialog" aria-modal="true" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <img
                  src="/assets/close.png"
                  alt="Close"
                  className="visits-overlay-cancel"
                  onClick={closeOverlay}
                />
                <h2 className="overlayDocsImgCate">صور اقوال</h2>

                <div className="overlayDocsContent">
                  {/* Prev (right in RTL) */}
                  <div
                    className={`docs-prev docs-arrow ${selectedIndex === 0 ? 'disabled' : ''}`}
                    onClick={() => {
                      if (selectedIndex > 0) swiperRef.current?.slidePrev();
                    }}
                    aria-label="Previous"
                    role="button"
                  >
                    <img src="/assets/happen-right.png" alt="Previous" />
                  </div>

                  <Swiper
                    key={swiperKey}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                      const idx = selectedIndexRef.current ?? selectedIndex;
                      if (typeof idx === 'number') {
                        swiper.slideTo(idx, 0, false);
                      }
                    }}
                    initialSlide={selectedIndex}
                    slidesPerView={1}
                    spaceBetween={100}
                    effect="coverflow"
                    modules={[EffectCoverflow]}
                    speed={600}
                    onSlideChange={handleSlideChange}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    coverflowEffect={{
                      rotate: isRTL ? 20 : -20,
                      stretch: 0,
                      depth: 120,
                      modifier: 1,
                      slideShadows: true,
                    }}
                  >
                    {(overlayImages || []).map((item, idx) => (
                      <SwiperSlide key={item.id || `${item.image}-${idx}`}>
                        <div className="overlayDocsImg" onClick={(e) => e.stopPropagation()}>
                          <img
                            src={item.image}
                            alt={`Saying ${idx + 1}`}
                            className="zoomable"
                            loading="lazy"
                            decoding="async"
                            onClick={handleZoom}
                            draggable={false}
                          />
                          <div style={{ textAlign: 'center', marginTop: 18, fontWeight: 500, direction: "ltr" }}>
                            ({getGlobalIndex()} of {totalImages || (overlayImages?.length || 0)})
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Next (left in RTL) */}
                  <div
                    className={`docs-next docs-arrow ${selectedIndex >= (overlayImages?.length || 0) - 1 ? 'disabled' : ''}`}
                    onClick={() => {
                      if (selectedIndex < (overlayImages?.length || 0) - 1) swiperRef.current?.slideNext();
                    }}
                    aria-label="Next"
                    role="button"
                  >
                    <img src="/assets/happen-left.png" alt="Next" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <ToastContainer />
    </div>
  );
}
