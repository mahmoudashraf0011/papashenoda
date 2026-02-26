import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import './DocsContainer.css';

export default function DocOverlayOutside({ closeOverlay, cate, imgs = [], initialSlide = 0 }) {
  const [activeIndex, setActiveIndex] = useState(initialSlide);
  const ele = useRef();

  // optional: keep if you use it for layout styles elsewhere
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkResponsive = () => setIsMobile(window.innerWidth <= 768);
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  // If you intentionally want to cap at 4 images, keep this slice and use slides.length below.
  // If you want all images, just set slides = imgs.
  const slides = imgs.slice(0, 4);
  const atStart = activeIndex === 0;
  const atEnd = activeIndex === Math.max(slides.length - 1, 0);

  // detect RTL only to choose arrow icon directions (logic stays the same)
  const isRtl = true; // because we set dir="rtl" on Swiper

  const handleZoom = (e) => {
    e.target.classList.toggle('zoomed');
  };

  return (
    <div className="overlay">
      <div className="overlay-wrapper">
        <img
          src="/assets/close.png"
          alt="Close"
          className="visits-overlay-cancel"
          onClick={closeOverlay}
        />

        <h2 className="overlayDocsImgCate">{cate}</h2>

        <div className="overlayDocsContent">
     
          {
            isMobile?
                    <div  className={`docs-front docs-arrow ${atEnd ? 'disabled' : ''}`}>
                    <img
                      src={isRtl ? '/assets/happen-right.png' : '/assets/happen-left.png'}
                      alt="Previous"
                      className="swiper-back"
                    />
            </div>
            :
              <div className={`docs-front docs-arrow ${atEnd ? 'disabled' : ''}`}>
              <img
                src={isRtl ? '/assets/happen-left.png' : '/assets/happen-right.png'}
                alt="Next"
                className="swiper-front"
              />
            </div>
          }
  
          <Swiper
            dir="rtl"
            spaceBetween={50}
            slidesPerView={1}
            modules={[Navigation, Autoplay, Pagination, EffectCoverflow]}
            navigation={{
              prevEl: '.docs-back',
              nextEl: '.docs-front',
            }}
            speed={600}
            effect="coverflow"
            initialSlide={initialSlide}
            watchOverflow
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {slides.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="overlayDocsImg">
                  <img
                    src={item.image}
                    alt={`slide-${index}`}
                    className="zoomable"
                    ref={ele}
                    onClick={handleZoom}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {
            !isMobile?
                    <div className={`docs-back docs-arrow ${atStart ? 'disabled' : ''}`}>
                    <img
                      src={isRtl ? '/assets/happen-right.png' : '/assets/happen-left.png'}
                      alt="Previous"
                      className="swiper-back"
                    />
            </div>
            :
              <div className={`docs-back docs-arrow ${atStart ? 'disabled' : ''}`}>
              <img
                src={isRtl ? '/assets/happen-left.png' : '/assets/happen-right.png'}
                alt="Next"
                className="swiper-front"
              />
            </div>
          }
     
        </div>
      </div>
    </div>
  );
}
