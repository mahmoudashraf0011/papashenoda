// import React from 'react'
// import './SayingsPhoto.css'
// import '../../Responsive/SayingsPhotoRes.css'
// import MediaHeader from '../../MediaHeader'
// import SayingsPhotoCard from './SayingsPhotoCard'
// import SayingsHook from '../../../../Logic/Media/Writings/Sayings/SayingsHook';
// import Spinner from '../../../Utility/Spinner';

// export default function SayingsPhotoContainer() {
//   const [sayingsWrittenDataLimited,sayingsPhotoDataLimited]=SayingsHook();

//   return (
//     <div className='sayingsPhoto' type="sayingPhoto" >
//         <div className='Container'>
//           <MediaHeader title="صور اقوال"  src="/media/10" />
//           <div className='sayingsPhotoItems'>
//             {
//             sayingsPhotoDataLimited && Array.isArray(sayingsPhotoDataLimited[0])?sayingsPhotoDataLimited[0].map((item)=>{
//               return(
                  
//                     <SayingsPhotoCard src={item.image} key={item.id}/>
                  
               
//               )
//             }):<Spinner />
//           }

//           </div>
//         </div>
//     </div>
//   )
// }


import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import './SayingsPhoto.css';
import '../../Responsive/SayingsPhotoRes.css';
import MediaHeader from '../../MediaHeader';
import SayingsPhotoCard from './SayingsPhotoCard';
import SayingsHook from '../../../../Logic/Media/Writings/Sayings/SayingsHook';
import Spinner from '../../../Utility/Spinner';
import SkeletonArticlesCard1 from '../../../../Pages/Media/Writings/Articles/SkeletonArticlesCard1';

export default function SayingsPhotoContainer() {
  // Fetch limited data
  const [sayingsWrittenDataLimited, sayingsPhotoDataLimited] = SayingsHook();

  // Original slides array
  const slides = Array.isArray(sayingsPhotoDataLimited?.[0])
    ? sayingsPhotoDataLimited[0].map(item => ({ image: item.image, id: item.id }))
    : [];

  // Create reversed slides for inverted navigation
  const reversedSlides = slides.slice().reverse();

  // Overlay state
  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Swiper instance ref
  const swiperRef = useRef(null);

  // Handlers
  const openOverlay = index => {
    // calculate index in reversedSlides
    const revIndex = slides.length - 1 - index;
    setActiveIndex(revIndex);
    setOverlayOpen(true);
  };

  const closeOverlay = () => {
    setOverlayOpen(false);
  };

  const handleZoom = e => {
    e.target.classList.toggle('zoomed');
  };

  return (
    <div className="sayingsPhoto" data-type="sayingPhoto">
      <div className="Container">
        <MediaHeader title="صور اقوال" src="/media/pictures-and-sayings" />

        {/* Thumbnail grid uses original slides order */}
        <div className="sayingsPhotoItems">
          {slides.length > 0 ? (
            slides.map((item, idx) => (
              <div key={item.id} onClick={() => openOverlay(idx)}>
                <SayingsPhotoCard src={item.image} />
              </div>
            ))
          ) : (
            <>
              <SkeletonArticlesCard1/>
              <SkeletonArticlesCard1/>
              <SkeletonArticlesCard1/>
              <SkeletonArticlesCard1/>
            </>
          )}
        </div>
      </div>

      {/* Overlay with reversed navigation */}
      {isOverlayOpen && (
        <div className="overlay">
          <div className="overlay-wrapper">
            <img
              src="/assets/close.png"
              alt="Close"
              className="visits-overlay-cancel"
              onClick={closeOverlay}
            />
            <h2 className="overlayDocsImgCate">صور اقوال</h2>

            <div className="overlayDocsContent">
              {/* Left arrow: go to previous in reversedSlides (which is next in original) */}
              <div
                className={`docs-prev docs-arrow ${activeIndex === 0 ? 'disabled' : ''}`}
                onClick={() => swiperRef.current.slidePrev()}
              >
                <img src="/assets/happen-left.png" alt="Prev" />
              </div>

              <Swiper
                onSwiper={swiper => (swiperRef.current = swiper)}
                initialSlide={activeIndex}
                slidesPerView={1}
                spaceBetween={50}
                effect="coverflow"
                modules={[EffectCoverflow]}
                speed={800}
                onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
              >
                {reversedSlides.map((item, i) => (
                  <SwiperSlide key={item.id}>
                    <div className="overlayDocsImg">
                      <img
                        src={item.image}
                        alt={`Slide ${i + 1}`}
                        className="zoomable"
                        onClick={handleZoom}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Right arrow: go to next in reversedSlides (which is previous in original) */}
              <div
                className={`docs-next docs-arrow ${activeIndex === reversedSlides.length - 1 ? 'disabled' : ''}`}
                onClick={() => swiperRef.current.slideNext()}
              >
                <img src="/assets/happen-right.png" alt="Next" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
