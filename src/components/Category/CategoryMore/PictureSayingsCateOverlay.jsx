// PictureSayingsCateOverlay.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

const PictureSayingsCateOverlay = ({
  closeOverlayPhoto,
  initialIndex,
  activePage = 1,
  perPage = 8,
  handleZoom,
}) => {
  const { baseURL } = useContext(UserContext);
  const { id } = useParams(); // category slug

  // Detect RTL from <html dir> (fallback true)
  const isRTL =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).direction === "rtl"
      : true;

  const swiperRef = useRef(null);

  // items: { id, image, absoluteIndex }
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);

  const loadedPagesRef = useRef(new Set());
  const [minLoadedPage, setMinLoadedPage] = useState(null);
  const [maxLoadedPage, setMaxLoadedPage] = useState(null);

  const [localActiveIndex, setLocalActiveIndex] = useState(null);
  const fetchingNextRef = useRef(false);
  const fetchingPrevRef = useRef(false);
  const didSetInitialSlideRef = useRef(false);

  const computedInitialPage = useMemo(
    () => Math.floor(initialIndex / perPage) + 1,
    [initialIndex, perPage]
  );
  const initialPage = useMemo(
    () => (Number(activePage) > 0 ? Number(activePage) : computedInitialPage),
    [activePage, computedInitialPage]
  );

  // Fetch page (category API)
  const fetchPage = async (page, mode = "append") => {
    if (!page || page < 1) return;
    if (loadedPagesRef.current.has(page)) return;

    try {
      const url = `${baseURL}/get/by/category/slug?slug=${id}&lang=ar&media_type_slug=pictures-and-sayings&per_page=${perPage}&page=${page}`;
      const response = await axios.get(url);

      const list = Array.isArray(response?.data?.data?.media?.[0]?.value)
        ? response.data.data.media[0].value
        : [];
      const total = Number(response?.data?.pagination?.total || 0);
      if (total) setTotalImages(total);

      const startAbs = (page - 1) * perPage;
      const mapped = list.map((item, idx) => ({
        id: item.id,
        image: item.image,
        absoluteIndex: startAbs + idx,
      }));

      setImages((prev) => {
        if (mode === "replace") return mapped;
        if (mode === "prepend") return [...mapped, ...prev];
        return [...prev, ...mapped];
      });

      loadedPagesRef.current.add(page);
      setMinLoadedPage((prev) => (prev === null ? page : Math.min(prev, page)));
      setMaxLoadedPage((prev) => (prev === null ? page : Math.max(prev, page)));
    } catch (e) {
      console.error("Error fetching images page", page, e);
    }
  };

  // Initial load: current + next (no prepend to avoid index shift)
  useEffect(() => {
    (async () => {
      await fetchPage(initialPage, "replace");
      await fetchPage(initialPage + 1, "append");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPage, id, baseURL, perPage]);

  // Jump to the correct local index once images arrive
  useEffect(() => {
    if (!images.length || didSetInitialSlideRef.current) return;
    const idx = images.findIndex((x) => x.absoluteIndex === initialIndex);
    if (idx !== -1) {
      setLocalActiveIndex(idx);
      setTimeout(() => {
        if (swiperRef.current?.slideTo) {
          swiperRef.current.slideTo(idx, 0);
          didSetInitialSlideRef.current = true;
        }
      }, 0);
    }
  }, [images, initialIndex]);

  // Lazy-load next/prev near edges (compensate after prepend)
  const onSlideChange = (swiper) => {
    const idx = swiper.activeIndex;
    setLocalActiveIndex(idx);

    // near end -> next page
    const nearEnd = images.length - idx <= 2;
    const hasMoreNext =
      maxLoadedPage !== null && totalImages > maxLoadedPage * perPage;
    if (nearEnd && hasMoreNext && !fetchingNextRef.current) {
      fetchingNextRef.current = true;
      fetchPage(maxLoadedPage + 1, "append").finally(() => {
        fetchingNextRef.current = false;
      });
    }

    // near start -> prev page (prepend + compensate)
    const nearStart = idx <= 1;
    const hasMorePrev = minLoadedPage !== null && minLoadedPage > 1;
    if (nearStart && hasMorePrev && !fetchingPrevRef.current) {
      fetchingPrevRef.current = true;
      const beforeLen = images.length;
      fetchPage(minLoadedPage - 1, "prepend")
        .then(() => {
          const added = images.length + perPage - beforeLen; // ≈ perPage
          const newTarget = (swiper.activeIndex ?? 0) + added;
          setTimeout(() => {
            if (swiperRef.current?.slideTo) {
              swiperRef.current.slideTo(newTarget, 0);
            }
          }, 0);
        })
        .finally(() => {
          fetchingPrevRef.current = false;
        });
    }
  };

  const currentAbsolute = useMemo(() => {
    if (localActiveIndex == null || !images[localActiveIndex]) return null;
    return images[localActiveIndex].absoluteIndex;
  }, [localActiveIndex, images]);

  return (
    <div className="overlay">
      {/* FIXED: make wrapper RTL when isRTL is true */}
      <div className="overlay-wrapper" dir={isRTL ? "ltr" : "rtl"}>
        <img
          src="/assets/close.png"
          alt="Close"
          className="visits-overlay-cancel"
          onClick={closeOverlayPhoto}
        />
        <h2 className="overlayDocsImgCate">صور أقوال</h2>

        <div className="overlayDocsContent">
    
          <div
            className={`docs-prev docs-arrow ${localActiveIndex === 0 ? "disabled" : ""}`}
            onClick={() => {
              if (!swiperRef.current) return;
              // In RTL, PREV visually is slideNext()
              isRTL ? swiperRef.current.slideNext() : swiperRef.current.slidePrev();
            }}
          >
            <img src="/assets/happen-right.png" alt="Prev" />
          </div>
          <Swiper
            onSwiper={(sw) => (swiperRef.current = sw)}
            slidesPerView={1}
            spaceBetween={50}
            effect="coverflow"
            modules={[EffectCoverflow]}
            speed={800}
            onSlideChange={onSlideChange}
            // Visual tilt adjusted for RTL
            coverflowEffect={{
              rotate: isRTL ? 50 : -50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
          >
            {images.map((item, i) => (
              <SwiperSlide key={`${item.id}-${item.absoluteIndex}`}>
                <div className="overlayDocsImg">
                  <img
                    src={item.image}
                    alt={`Slide ${i + 1}`}
                    className="zoomable"
                    onClick={handleZoom}
                  />
                  <div style={{ textAlign: "center", marginTop: 30 }} dir="ltr">
                    ({currentAbsolute != null ? currentAbsolute + 1 : i + 1} of {totalImages})
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className={`docs-next docs-arrow ${
              images.length && localActiveIndex === images.length - 1 ? "disabled" : ""
            }`}
            onClick={() => {
              if (!swiperRef.current) return;
              // In RTL, NEXT visually is slidePrev()
              isRTL ? swiperRef.current.slidePrev() : swiperRef.current.slideNext();
            }}
          >
            <img src="/assets/happen-left.png" alt="Next" />
          </div>    
        </div>
      </div>
    </div>
  );
};

export default PictureSayingsCateOverlay;
