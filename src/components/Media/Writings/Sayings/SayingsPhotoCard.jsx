import React from 'react'

export default function SayingsPhotoCard({src}) {
  return (
    <div className='sayingsPhotoCard'>
        <a
          href={src}
          download
          className="download-btn-photo"
          onClick={(e) => e.stopPropagation()} // Prevent parent click
        >
          ⬇ تحميل
        </a>
        <div className='sayingsPhotoCardImg'>
          <img src={src} alt='img'/>
        </div>
    </div>
  )
}
// import React, { useState, useRef } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';

// // Swiper core styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/autoplay';
// import 'swiper/css/effect-coverflow';

// // Overlay & zoom styles
// // import './DocsContainer.css';
// // import '../../Writings/Docs/DocsContainer.css';

// export default function SayingsPhotoCard({
//   src,
//   imgs = [],
//   cate = '',
//   initialSlide = 0
// }) {
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(initialSlide);

//   const prevRef = useRef(null);
//   const nextRef = useRef(null);

//   const handleZoom = (e) => {
//     e.target.classList.toggle('zoomed');
//   };

//   const openOverlay = () => {
//     setShowOverlay(true);
//     document.body.style.overflow = 'hidden';
//   };

//   const closeOverlay = () => {
//     setShowOverlay(false);
//     document.body.style.overflow = 'auto';
//   };

//   // Flatten to array of URLs
//   const slides = imgs.length
//     ? imgs.map(item => (typeof item === 'object' ? item.image : item))
//     : [src];
//     console.log(imgs,'//////')
//   return (
//     <>
//       {/* trigger card */}
//       <div className="sayingsPhotoCard" onClick={openOverlay}>
//         <div className="sayingsPhotoCardImg">
//           <img src={src} alt={cate} />
//         </div>
//       </div>

//       {/* overlay */}
//       {showOverlay && (
//         <div className="overlay">
//           <div className="overlay-wrapper">
//             <img
//               src="/assets/close.png"
//               alt="Close"
//               className="visits-overlay-cancel"
//               onClick={closeOverlay}
//             />
//             <h2 className="overlayDocsImgCate">{cate}</h2>

//             <div className="overlayDocsContent">
//               {/* prev arrow */}
//               <div
//                 ref={prevRef}
//                 className={`docs-front docs-arrow ${
//                   activeIndex === 0 ? 'disabled' : ''
//                 }`}
//               >
//                 <img
//                   src="/assets/happen-right.png"
//                   alt="Previous"
//                   className="swiper-front"
//                 />
//               </div>

//               {/* swiper */}
//               <Swiper
//                 modules={[Navigation, Autoplay, Pagination, EffectCoverflow]}
//                 spaceBetween={50}
//                 slidesPerView={1}
//                 effect="coverflow"
//                 speed={2000}
//                 initialSlide={initialSlide}
//                 onBeforeInit={(swiper) => {
//                   swiper.params.navigation.prevEl = prevRef.current;
//                   swiper.params.navigation.nextEl = nextRef.current;
//                 }}
//                 navigation={{
//                   prevEl: prevRef.current,
//                   nextEl: nextRef.current,
//                 }}
//                 onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
//                 className="overlay-swiper"
//               >
//                 {imgs.map((slideSrc, i) => (
//                   <SwiperSlide key={i}>
//                     <div className="overlayDocsImg">
//                       <img
//                         src={slideSrc.image}
//                         alt={`slide ${i + 1}`}
//                         className="zoomable"
//                         onClick={handleZoom}
//                       />
//                       {console.log("hi",imgs)}
//                     </div>
//                   </SwiperSlide>
//                 ))}
//               </Swiper>

//               {/* next arrow */}
//               <div
//                 ref={nextRef}
//                 className={`docs-back docs-arrow ${
//                   activeIndex === slides.length - 1 ? 'disabled' : ''
//                 }`}
//               >
//                 <img
//                   src="/assets/happen-left.png"
//                   alt="Next"
//                   className="swiper-back"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
