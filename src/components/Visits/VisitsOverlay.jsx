// VisitsOverlay.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

/** Optional thumbnail card (kept zero-based) */
export function VisitsSwiperInfo({ visitsImgs, index, openOverlay }) {
  const imgs = visitsImgs?.data?.images || [];
  if (!imgs.length) return null;

  const { image, title } = imgs[index] || {};
  return (
    <div className="visits-card" onClick={() => openOverlay(index)}>
      <img src={image} alt={title || ""} className="visits-card-thumb" />
      <h3 className="visits-card-title">{title}</h3>
    </div>
  );
}

export default function VisitsOverlay({
  closeOverlay,
  visitsImgs,
  index = 0, // ZERO-BASED index from grid
  pag = 1, // starting API page
  filterPhotos = "", // optional query string additions
}) {
  const { baseURL } = useContext(UserContext);
  const { id } = useParams();

  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const swiperRef = useRef(null);
  const firstSlideSetRef = useRef(false);
  const fetchedPagesRef = useRef(new Set());
  const imagesKeySetRef = useRef(new Set());

  // Fix the start page for the "X of Y" counter
  const startPageRef = useRef(pag || 1);

  const [category, setCategory] = useState(
    visitsImgs?.data?.category_name || ""
  );
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [page, setPage] = useState(pag || 1);
  const [perPage, setPerPage] = useState(12);
  const [loading, setLoading] = useState(false);

  // Force re-render for the counter on slide change
  const [activeIndex, setActiveIndex] = useState(0);

  // Mobile: show more/less for description
  const [expandedIndex, setExpandedIndex] = useState(null);
  const toggleText = (idx) =>
    setExpandedIndex((curr) => (curr === idx ? null : idx));

  // ZERO-BASED initial active slide
  const initialActive = Math.max(0, index);

  // Seed and initial fetch when slug/page/filter change
  useEffect(() => {
    setImages([]);
    setTotalImages(0);
    setPage(pag || 1);
    setCategory(visitsImgs?.data?.category_name || "");
    fetchedPagesRef.current = new Set();
    imagesKeySetRef.current = new Set();
    firstSlideSetRef.current = false;
    startPageRef.current = pag || 1;

    // Seed from various shapes (supporting existing usage)
    let seed = [];
    if (Array.isArray(visitsImgs?.value)) seed = visitsImgs.value;
    else if (Array.isArray(visitsImgs)) seed = visitsImgs;
    else if (Array.isArray(visitsImgs?.data?.images))
      seed = visitsImgs.data.images;

    if (seed.length) {
      const seeded = [];
      for (const it of seed) {
        const key = `${it?.id ?? ""}|${it?.image ?? ""}`;
        if (!imagesKeySetRef.current.has(key)) {
          imagesKeySetRef.current.add(key);
          seeded.push(it);
        }
      }
      setImages(seeded);
    }

    fetchImages(id, pag || 1, filterPhotos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, pag, filterPhotos]);

  // Fetch images page-by-page (infinite load)
  const fetchImages = async (slug, wantedPage, extraQS = "") => {
    if (!slug || !wantedPage) return;
    if (fetchedPagesRef.current.has(wantedPage)) return;

    fetchedPagesRef.current.add(wantedPage);
    setLoading(true);
    try {
      const qs = `${baseURL}/v2/get/images?slug=${slug}&lang=ar&page=${wantedPage}${
        extraQS ? `&${extraQS}` : ""
      }`;
      const { data } = await axios.get(qs);

      const newImages = data?.data?.images || [];
      const total = data?.pagination?.total ?? 0;
      const per_page = data?.pagination?.per_page ?? 12;

      if (Array.isArray(newImages) && newImages.length) {
        setImages((prev) => {
          const merged = [...prev];
          for (const it of newImages) {
            const key = `${it?.id ?? ""}|${it?.image ?? ""}`;
            if (!imagesKeySetRef.current.has(key)) {
              imagesKeySetRef.current.add(key);
              merged.push(it);
            }
          }
          return merged;
        });
      }

      setTotalImages(total);
      setPerPage(per_page);
      setCategory(data?.data?.category_name || "");
    } catch (err) {
      console.log("Error fetching data:", err);
      fetchedPagesRef.current.delete(wantedPage);
    } finally {
      setLoading(false);
    }
  };

  // Keep Swiper updated if slides change
  useEffect(() => {
    const sw = swiperRef.current;
    if (!sw) return;
    try {
      sw.updateSlides();
      sw.update();
      if (sw.navigation && typeof sw.navigation.update === "function") {
        sw.navigation.update();
      }
    } catch {}
  }, [images.length, totalImages]);

  // Jump once to initially clicked image
  useEffect(() => {
    const sw = swiperRef.current;
    if (!sw) return;
    if (images.length && !firstSlideSetRef.current) {
      const target = Math.min(initialActive, images.length - 1);
      sw.slideTo(target);
      setActiveIndex(target);
      firstSlideSetRef.current = true;
    }
  }, [images.length, initialActive]);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);

    const nearEnd = swiper.activeIndex >= images.length - 2;
    const canLoadMore = images.length < totalImages;

    if (nearEnd && canLoadMore && !loading) {
      setPage((p) => {
        const next = p + 1;
        fetchImages(id, next, filterPhotos);
        return next;
      });
    }

    setExpandedIndex(null);
  };

  const handleZoom = (e) => e.target.classList.toggle("zoomed");

  // Human-readable counter (1-based)
  const displayedIndex = Math.min(
    (startPageRef.current - 1) * perPage + activeIndex + 1,
    totalImages || 0
  );

  const commonProps = {
    spaceBetween: 50,
    slidesPerView: 1,
    initialSlide: initialActive, // ZERO-BASED
    navigation: { nextEl: ".visits-back", prevEl: ".visits-front" },
    modules: [Navigation, Autoplay, Pagination, EffectFade],
    speed: 500,
    effect: "fade",
    onSwiper: (sw) => {
      swiperRef.current = sw;
      setActiveIndex(sw.activeIndex);
    },
    onSlideChange: handleSlideChange,
  };

  const mobileWrapperClass = "visits-swiper-relative visitOverlayRes";

  return (
    <div className="overlay overlayGallery">
      <div className="overlay-wrapper overlayCate">
        <img
          src="/assets/close.png"
          alt="close"
          className="visits-overlay-close"
          onClick={closeOverlay}
        />

        {/* ===== Desktop ===== */}
        <div className="visits-swiper-relative visitOverlay">
          <Swiper {...commonProps}>
            {images.map((visitImg, i) => (
              <SwiperSlide
                key={`${visitImg?.id ?? ""}-${visitImg?.image ?? i}`}
              >
                <div className="visits-swiper">
                  <div className="visits-swiper-right">
                    <p className="visits-papa">{category}</p>
                    <p
                      className="visits-visits"
                      dangerouslySetInnerHTML={{
                        __html: visitImg?.description || "",
                      }}
                    />
                  </div>

                  <div className="visits-swiper-line" />

                  <div className="visits-swiper-left">
                    <div className="image-stage">
                      <img
                        src={visitImg?.image}
                        alt={visitImg?.name || ""}
                        className="zoomable image-fit"
                        onClick={handleZoom}
                      />
                      <div className="zoom-icon" aria-hidden>
                        <i className="fa fa-search-plus"></i>
                      </div>
                      <div
                        className="media-counter"
                        aria-label="image position"
                      >
                        ( {displayedIndex} of {totalImages} )
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={visitImg?.image}
                  download
                  className="download-btn-visit"
                  onClick={(e) => e.stopPropagation()}
                >
                  ⬇ تحميل
                </a>
              </SwiperSlide>
            ))}

            {/* Desktop navigation */}
            <div
              className="visits-back visits-back-res"
              style={{
                cursor: "pointer",
                background: "#000",
                border: 0,
                outline: "none",
              }}
            >
              <img
                src="/assets/happen-left.png"
                alt="next"
                className="swiper-back"
                ref={prevBtnRef}
              />
            </div>
            <div
              className="visits-front visits-front-res"
              style={{
                cursor: "pointer",
                background: "#000",
                border: 0,
                outline: "none",
              }}
            >
              <img
                src="/assets/happen-right.png"
                alt="prev"
                className="swiper-front"
                ref={nextBtnRef}
              />
            </div>
          </Swiper>
        </div>

        {/* ===== Mobile (description BELOW image) ===== */}
        <div
          className={mobileWrapperClass}
          style={{
            display: window.innerWidth <= 698 ? "block" : "none",
          }}
        >
          <Swiper {...commonProps}>
            {images.map((visitImg, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <SwiperSlide key={`${visitImg?.id ?? ""}-m-${idx}`}>
                  <div className="visits-swiper">
                    <div className="image-stage">
                      <img
                        src={visitImg?.image}
                        alt={visitImg?.name || ""}
                        className="zoomable image-fit"
                        onClick={handleZoom}
                      />
                      <div
                        className="media-counter"
                        aria-label="image position"
                      >
                        {displayedIndex} of {totalImages}
                      </div>
                    </div>
                        <a
                          href={visitImg?.image}
                          download
                          className="custom-bottom-overlay"
                          onClick={(e) => e.stopPropagation()}
                          style={{ 
                            zIndex:"100000",
                            bottom:"112px"
                           }}
                        >
                          ⬇ تحميل
                        </a>
                    <div className="text-container bottom-block">
                      <p
                        className={
                          isExpanded
                            ? "visits-visits-res expanded"
                            : "visits-visits-res collapsed"
                        }
                        dangerouslySetInnerHTML={{
                          __html: visitImg?.description || "",
                        }}
                      />
                    
                      <button
                        className="read-more"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleText(idx);
                        }}
                      >
                        {isExpanded ? "عرض أقل" : "عرض المزيد"}
                      </button>
                    </div>
                  </div>

                </SwiperSlide>
              );
            })}

            <div
              className="visits-back visits-back-res"
              style={{
                cursor: "pointer",
                background: "#000",
                border: 0,
                outline: "none",
              }}
            >
              <img
                src="/assets/happen-left.png"
                alt="next"
                className="swiper-back"
                ref={prevBtnRef}
              />
            </div>
            <div
              className="visits-front visits-front-res"
              style={{
                cursor: "pointer",
                background: "#000",
                border: 0,
                outline: "none",
              }}
            >
              <img
                src="/assets/happen-right.png"
                alt="prev"
                className="swiper-front"
                ref={nextBtnRef}
              />
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}

