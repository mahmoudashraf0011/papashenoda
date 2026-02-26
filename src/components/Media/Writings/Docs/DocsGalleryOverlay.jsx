import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import axios from "axios";
import { UserContext } from "../../../Context/UserContext";
import "./DocsContainer.css";

export default function DocsGalleryOverlay({
  mediaId,
  closeOverlay,
  cate,
  filter,
  currentIndex = 0,
}) {
  const [galleryData, setGalleryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndexPhoto, setActiveIndexPhoto] = useState(currentIndex + 1);
  const [counterVisible, setCounterVisible] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { baseURL } = useContext(UserContext);

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    fetchGallery(mediaId);
    setActiveIndexPhoto(currentIndex + 1);
  }, [mediaId]);

  const fetchGallery = async (id) => {
    if (!id || isFetching) return;
    setIsFetching(true);
    setLoading(true);
    setCounterVisible(false);

    try {
      const res = await axios.get(
        `${baseURL}/v2/get/next/previous/document?media_id=${id}&${filter || ""}`
      );
      if (res.data.status === "success") {
        setGalleryData(res.data.data);

        if (res.data.data.current?.index) {
          setActiveIndexPhoto(res.data.data.current.index);
        }
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setCounterVisible(true), 200);
      setIsFetching(false);
      setImageLoading(false);
    }
  };

  // ✅ السهم اليمين = السابق
  const handleRightArrow = () => {
    if (galleryData?.previous?.id) {
      fetchGallery(galleryData.previous.id);
      setActiveIndexPhoto((prev) => Math.max(prev - 1, 1));
    }
  };

  // ✅ السهم الشمال = التالي
  const handleLeftArrow = () => {
    if (galleryData?.next?.id) {
      fetchGallery(galleryData.next.id);
      setActiveIndexPhoto((prev) =>
        Math.min(prev + 1, galleryData.documents_count || prev + 1)
      );
    }
  };

  const handleZoom = (e) => {
    e.target.classList.toggle("zoomed");
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const isSingleImage =
    galleryData?.documents_count && galleryData.documents_count <= 1;

  const currentPhotoNumber =
    galleryData?.current?.index || activeIndexPhoto || 1;

  return (
    <div className="overlay">
      <div className="overlay-wrapper">
        {/* Close Button */}
        <img
          src="/assets/close.png"
          alt="Close"
          className="visits-overlay-cancel"
          onClick={closeOverlay}
        />

        {/* Category Title */}
        <h2 className="overlayDocsImgCate">{cate}</h2>

        {loading ? (
          <div className="loading-wrapper">
            <div className="circle-loading"></div>
            {/* <p className="loading-text">جاري تحميل الصورة...</p> */}
          </div>
        ) : (
          <div className="overlayDocsContent" dir="ltr">
            {/* LEFT = NEXT */}
            {!isSingleImage && (
              <div
                className={`docs-back docs-arrow ${
                  !galleryData?.next?.id ? "disabled-arrow" : ""
                }`}
                onClick={handleLeftArrow}
              >
                <img
                  src={
                    isMobile
                      ? "/assets/happen-right.png"
                      : "/assets/happen-left.png"
                  }
                  alt="Next"
                />
              </div>
            )}

            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              modules={[Navigation, EffectFade]}
              effect="fade"
              speed={600}
              initialSlide={currentIndex}
            >
              {galleryData?.current && (
                <SwiperSlide key={galleryData.current.id}>
                  <div className="overlayDocsImg">
                    {imageLoading ? (
                      <div className="circle-loading"></div>
                    ) : (
                      <img
                        src={galleryData.current.image}
                        alt={galleryData.current.name}
                        className="zoomable"
                        onClick={handleZoom}
                        onLoad={handleImageLoad}
                      />
                    )}
                  </div>
                </SwiperSlide>
              )}
            </Swiper>

            {/* RIGHT = PREVIOUS */}
            {!isSingleImage && (
              <div
                className={`docs-front docs-arrow ${
                  !galleryData?.previous?.id || currentPhotoNumber === 1
                    ? "disabled-arrow"
                    : ""
                }`}
                onClick={handleRightArrow}
              >
                <img
                  src={
                    isMobile
                      ? "/assets/happen-left.png"
                      : "/assets/happen-right.png"
                  }
                  alt="Previous"
                />
              </div>
            )}

            {/* ✅ العداد الحقيقي */}
            {counterVisible && galleryData && (
              <div
                style={{
                  position: "fixed",
                  bottom: "110px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#fff",
                  background: "rgba(0,0,0,0.5)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "14px",
                }}
                className="counterNum"
              >
                {currentPhotoNumber} of {galleryData.documents_count}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Style */}
      <style>{`
        .disabled-arrow {
          opacity: 0.4;
          pointer-events: none;
        }

        .circle-loading {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2e2f30ff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        .loading-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .loading-text {
          margin-top: 12px;
          color: white;
          font-size: 14px;
          font-weight: 400;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (min-width: 750px) and (max-width: 830px) {
          .overlayDocsImg {
            margin-top: -30px;
            height: calc(100vh - 200px);
          }
          .overlayDocsImgCate {
            margin-top: 50px;
            font-size: 18px;
          }
          .counterNum {
            bottom: 25% !important;
          }
          .docs-arrow {
            margin-top: -28% !important;
          }
        }
      `}</style>
    </div>
  );
}
