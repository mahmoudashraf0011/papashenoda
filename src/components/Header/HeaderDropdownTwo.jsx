// HeaderDropdownTwo.js
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip';
import 'swiper/css/autoplay';
import { Link } from 'react-router-dom';
import HomeHook from '../../Logic/Home/HomeHook';

export default function HeaderDropdownTwo({ showInfo = {}, openHeaderOne, setOpenHeaderOne, closeDp }) {
  const [mediaData, meditationsData, sayingsData, eventsData, total] = HomeHook();

  const info = showInfo || {}; // consumes parent's prop (fetched once)

  const closeWrapper = () => {
    setOpenHeaderOne(false);
    const el = document.querySelector('.overlayLight');
    if (el) el.style.display = 'none';
  };

  return (
    <>
      {openHeaderOne && (
        <div className="header-bottom-right-dropInfo2 scrolled" onMouseLeave={() => closeDp()}>
          <div className="header-bottom-right-dropInfo2-imgs">
            <div className="header-swiper-relative ">
              <Swiper
                spaceBetween={20}
                slidesPerView={4}
                modules={[Navigation, Autoplay, Pagination]}
                speed={2000}
                breakpoints={{
                  662: { slidesPerView: 5 },
                  1050: { slidesPerView: 5 },
                }}
              >
                {info?.mediaTypes
                  ? [
                      ...info.mediaTypes.slice(0, info.mediaTypes.length - 1),
                      {
                        id: 'extra',
                        image: '/assets/MediaGallery/1.png',
                        image_icon: '/assets/MediaGallery/icon5.png',
                        count: total,
                        name: 'مقالات وكتابات أخرى',
                        slug: 'writings',
                      },
                      info.mediaTypes[info.mediaTypes.length - 1],
                    ]
                      .slice()
                      .reverse()
                      .map((mediatype) => (
                        <SwiperSlide key={mediatype.id}>
                          <Link
                            to={mediatype.id === 'extra' || mediatype.id == 4 ? `/media/writings` : `/media/${mediatype.slug}`}
                            style={{ cursor: 'pointer', boxShadow: '' }}
                            onClick={() => closeWrapper()}
                          >
                            <div className="header-bottom-right-dropInfo2-imgInfo">
                              <img className="header-bottom-right-dropInfo2-img" src={mediatype.image} alt="" style={{ objectFit: 'cover' }} />
                              <div className="header-bottom-right-dropInfo2-img-abs">
                                <img className="header-bottom-right-dropInfo2-img-abs-img" src={mediatype.image_icon} alt="" />
                              </div>
                              <div className="header-bottom-right-dropInfo2-img-info">
                                <p className="header-bottom-right-dropInfo2-img-p2">({mediatype.count})</p>
                                <p className="header-bottom-right-dropInfo2-img-p">{mediatype.name}</p>
                              </div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      ))
                  : null}
              </Swiper>
            </div>
          </div>

          <div className="header-bottom-right-dropInfo2-lines-topics">
            <div className="header-bottom-right-dropInfo2-line"></div>
            <p className="header-bottom-right-dropInfo2-topics">مواضيع قد تهمك</p>
            <div className="header-bottom-right-dropInfo2-line"></div>
          </div>

          <div className="header-bottom-right-dropInfo2-topicsInfo">
            {info?.categories?.map((category) => (
              <Link
                key={category?.id || category?.slug}
                onClick={() => {
                  closeWrapper();
                  const el = document.querySelector('.overlayLight');
                  if (el) el.style.display = 'none';
                }}
                to={`/category/${category.slug}`}
                className="header-bottom-right-dropInfo2-topic"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
