import React, { useContext, useEffect, useMemo, useState } from "react";
import "./Gallery.scss";
import "./Gallery-res.scss";

import GalleryImg from "./GalleryImg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import axios from "axios";
import { UserContext } from "../Context/UserContext";
import SkeletonGalleryCard from "./SkeletonGalleryCard ";
import SkeletonGalleryCardRes from "./SkeletonGalleryCardRes ";

export default function Gallery() {
  // --- one-time window effects
  useEffect(() => {
    const handleHashChange = (e) => e.preventDefault();
    window.addEventListener("hashchange", handleHashChange);
    // Clear hash if any on initial load
    const id = requestAnimationFrame(() => {
      if (window.location.hash) {
        window.history.replaceState(null, null, " ");
      }
      window.scrollTo(0, 0);
    });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const [gallery, setGallery] = useState([]);
  const { baseURL } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  // --- fetch data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(`${baseURL}/category-images?lang=ar`);
        if (!cancelled) {
          setGallery(data?.data ?? []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [baseURL]);

  // --- responsive breakpoint
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slides = useMemo(() => gallery ?? [], [gallery]);

  return (
    <div className="gallery">
      <div className="gallery-wrapper">
        <div className="gallery-top-head">
          <img src="/assets/gallery-1.png" alt="" className="gallery-top-img" />
          <p className="gallery-top-p">معرض صور مركز معلم الأجيال </p>
          <img
            src="/assets/gallery-right.png"
            alt=""
            className="gallery-top-right"
          />
        </div>

        {/* Loading skeletons */}
        {loading && (
          <>
            {Array.from({ length: 5 }).map((_, idx) =>
              isMobile ? (
                <SkeletonGalleryCardRes key={idx} />
              ) : (
                <SkeletonGalleryCard key={idx} />
              )
            )}
          </>
        )}

        {/* Content */}
        {!loading && (
          <div className="gallery-imgs-cont" style={{ width: "100%" }}>
            {/* Static grid list */}
            <div className="gallery-img-responsive">
              {slides.map((item, index) => (
                <GalleryImg
                  key={index}
                  src={item.image}
                  info={item.name}
                  children={item.children}
                  slug={item.slug}
                  hero_image={item.hero_image}
                />
              ))}
            </div>

            {/* Swiper carousel */}
            <div className="gallery-swiper-relative" dir="ltr">
              {/* Navigation buttons */}
              <div
                className="swiper-button-prev"
                style={{
                  left: "-90px",
                  background: "#ddd",
                  borderRadius: "50%",
                  padding: "35px",
                  color: "#001857",
                  width: "20px",
                }}
              />
              <div
                className="swiper-button-next"
                style={{
                  right: "-90px",
                  background: "#ddd",
                  borderRadius: "50%",
                  padding: "35px",
                  color: "#001857",
                }}
              />

              <Swiper
                slidesPerView={3}
                spaceBetween={20}
                centeredSlides={false}
                slidesOffsetBefore={0}
                slidesOffsetAfter={350}
                watchOverflow={true}
                autoplay={{
                  delay: 1000,
                  disableOnInteraction: false,
                  reverseDirection: true,
                  pauseOnMouseEnter: true, // <-- pauses autoplay on hover
                }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                modules={[Autoplay, Navigation]}
                onSwiper={(swiper) => {
                  // ensure it sizes correctly after render
                  setTimeout(() => swiper.update(), 200);
                }}
              >
                {slides.map((item, index) => (
                  <SwiperSlide key={index}>
                    {/* No manual hover handlers needed */}
                    <GalleryImg
                      src={item.image}
                      info={item.name}
                      children={item.children}
                      slug={item.slug}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}