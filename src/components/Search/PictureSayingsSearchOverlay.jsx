import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { useParams } from "react-router-dom";
import { UserContext } from "../Context/UserContext";


const PictureSayingsSearchOverlay = ({
  closeOverlayPhoto,
  initialIndex,
  activePage = 1,
  perPage = 8,
  handleZoom,
}) => {
  const { baseURL } = useContext(UserContext);
  const { id } = useParams();

  // ===== RTL Flag =====
  const isRTL = true; // شغّل/اطفِ لو محتاج

  // ===== Filters identical to container =====
  let defaultData = {};
  if (localStorage.getItem("allFilter")) {
    defaultData = JSON.parse(localStorage.getItem("allFilter"));
  }
  const safeSearchWord = defaultData.searchWord ? `search=${defaultData.searchWord}&` : "";
  const safeQueryStringOfCates = defaultData.queryStringOfCates ? defaultData.queryStringOfCates + "&" : "";
  const safeQueryStringMedia = defaultData.queryStringMedia ? defaultData.queryStringMedia + "&" : "";
  const safeSearchValue = defaultData.searchValue ? `key_words[]=${defaultData.searchValue}&` : "";
  const filterPhotos = `${safeSearchWord}${safeQueryStringOfCates}${safeQueryStringMedia}${safeSearchValue}`;

  // ===== Swiper ref =====
  const swiperRef = useRef(null);

  // ===== Data state =====
  // items: { id, image, absoluteIndex }
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);

  // Loaded pages tracking (to avoid duplicate fetches)
  const loadedPagesRef = useRef(new Set());
  const [minLoadedPage, setMinLoadedPage] = useState(null);
  const [maxLoadedPage, setMaxLoadedPage] = useState(null);

  // UI state
  const [localActiveIndex, setLocalActiveIndex] = useState(null);

  // Guards for in-flight fetches
  const fetchingNextRef = useRef(false);
  const fetchingPrevRef = useRef(false);
  const didSetInitialSlideRef = useRef(false);

  // ===== Initial page computed from absolute index (fallback to activePage if given) =====
  const computedInitialPage = useMemo(
    () => Math.floor(initialIndex / perPage) + 1,
    [initialIndex, perPage]
  );

  // Trust the caller's activePage if provided (>0); otherwise use computed
  const initialPage = useMemo(
    () => (Number(activePage) > 0 ? Number(activePage) : computedInitialPage),
    [activePage, computedInitialPage]
  );

  // ===== Fetch helper =====
  // mode: 'replace' | 'append' | 'prepend'
  const fetchPage = async (page, mode = "append") => {
    if (!page || page < 1) return;
    if (loadedPagesRef.current.has(page)) return;

    try {
      const url = `${baseURL}/v2/public-search?media_type_slug=${id}&page=${page}&per_page=${perPage}&${filterPhotos}`;
      const res = await axios.get(url);

      const list = Array.isArray(res?.data?.data?.[0]?.value) ? res.data.data[0].value : [];
      const total = Number(res?.data?.pagination?.total || 0);
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
        return [...prev, ...mapped]; // append
      });

      loadedPagesRef.current.add(page);
      setMinLoadedPage((prev) => (prev === null ? page : Math.min(prev, page)));
      setMaxLoadedPage((prev) => (prev === null ? page : Math.max(prev, page)));
    } catch (e) {
      console.error("Error fetching images page", page, e);
    }
  };

  // ===== Initial load (no prepend to avoid index shift) =====
  useEffect(() => {
    (async () => {
      await fetchPage(initialPage, "replace");
      await fetchPage(initialPage + 1, "append");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPage, id, baseURL, perPage, filterPhotos]);

  // ===== Position swiper on the correct local index once images are in =====
  useEffect(() => {
    if (!images.length || didSetInitialSlideRef.current) return;

    const idx = images.findIndex((x) => x.absoluteIndex === initialIndex);
    if (idx !== -1) {
      setLocalActiveIndex(idx);
      setTimeout(() => {
        if (swiperRef.current && typeof swiperRef.current.slideTo === "function") {
          swiperRef.current.slideTo(idx, 0);
          didSetInitialSlideRef.current = true;
        }
      }, 0);
    }
  }, [images, initialIndex]);

  // ===== Slide change: prefetch next / prev when near edges =====
  const onSlideChange = (swiper) => {
    const idx = swiper.activeIndex;
    setLocalActiveIndex(idx);

    // Near end → fetch next page
    const nearEnd = images.length - idx <= 2;
    const hasMoreNext = maxLoadedPage !== null && totalImages > maxLoadedPage * perPage;
    if (nearEnd && hasMoreNext && !fetchingNextRef.current) {
      fetchingNextRef.current = true;
      const pageToFetch = maxLoadedPage + 1;
      fetchPage(pageToFetch, "append").finally(() => {
        fetchingNextRef.current = false;
      });
    }

    // Near start → fetch previous page (and compensate slide index)
    const nearStart = idx <= 1;
    const hasMorePrev = minLoadedPage !== null && minLoadedPage > 1;
    if (nearStart && hasMorePrev && !fetchingPrevRef.current) {
      fetchingPrevRef.current = true;
      const pageToFetch = minLoadedPage - 1;

      const beforeLen = images.length;
      fetchPage(pageToFetch, "prepend")
        .then(() => {
          const added = images.length + perPage - beforeLen; // ≈ perPage
          const newTarget = (swiper.activeIndex ?? 0) + added;
          setTimeout(() => {
            if (swiperRef.current && typeof swiperRef.current.slideTo === "function") {
              swiperRef.current.slideTo(newTarget, 0);
            }
          }, 0);
        })
        .finally(() => {
          fetchingPrevRef.current = false;
        });
    }
  };

  // ===== Current absolute index for "X of total" label =====
  const currentAbsolute = useMemo(() => {
    if (localActiveIndex == null || !images[localActiveIndex]) return null;
    return images[localActiveIndex].absoluteIndex;
  }, [localActiveIndex, images]);

  return (
    <div className="overlay">
      {/* لاحظ dir="rtl" هنا */}
      <div className="overlay-wrapper" dir={isRTL ? "rtl" : "ltr"}>
        <img
          src="/assets/close.png"
          alt="Close"
          className="visits-overlay-cancel"
          onClick={closeOverlayPhoto}
        />
        <h2 className="overlayDocsImgCate">صور أقوال</h2>

        <div className="overlayDocsContent">


          <div
            className={`docs-next docs-arrow ${localActiveIndex === 0 ? "disabled" : ""} `}
            onClick={() => {
              if (swiperRef.current) {
                isRTL ? swiperRef.current.slidePrev() : swiperRef.current.slideNext();
              }
            }}
          >
            <img src="/assets/happen-right.png" alt={isRTL ? "Prev" : "Next"} />
          </div>
          <Swiper
            onSwiper={(sw) => (swiperRef.current = sw)}
            slidesPerView={1}
            spaceBetween={50}
            effect="coverflow"
            modules={[EffectCoverflow]}
            speed={800}
            onSlideChange={onSlideChange}
            // Swiper يكتشف RTL من dir تلقائيًا
            coverflowEffect={{
              // نعكس الدوران علشان الـ 3D يبقى مناسب للـ RTL
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
                    (
                    {" "}
                    {currentAbsolute != null ? currentAbsolute + 1 : i + 1} of {totalImages}
                    {" "}
                    )
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className={`docs-prev docs-arrow ${
              images.length && localActiveIndex === images.length - 1 ? "disabled" : ""
            }`}
            onClick={() => {
              if (swiperRef.current) {
                isRTL ? swiperRef.current.slideNext() : swiperRef.current.slidePrev();
              }
            }}
          >
            <img src="/assets/happen-left.png" alt={isRTL ? "Next" : "Prev"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PictureSayingsSearchOverlay;
