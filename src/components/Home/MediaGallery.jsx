import React from "react";
import "./MediaGallery.css";
import "./Responsive/HomeRes.css";
import SectionHeader from "../Utility/SectionHeader";
import MediaGalleryCard from "./MediaGalleryCard";
import HomeHook from "../../Logic/Home/HomeHook";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-flip";
import "swiper/css/autoplay";
import MediaGalleryCardRes from "./MediaGalleryCardRes";
import SkeletonCard from "./SkeletonCard";
import { Link } from "react-router-dom";
import SkeletonCardRes from "./SkeletonCardRes";

export default function MediaGallery() {
  const [mediaData, meditationsData, sayingsData, eventsData, total, loading] =
    HomeHook();
  return (
    <div className="mediaGallery">
      <SectionHeader
        title="معـــــــــرض"
        subtitle="المــــــــــــــــــــــــــيديا"
      />
      {/* <div className='Container'>
        <div className='mediaGalleryItems'>
          {
            mediaData[0] ?
              [
                ...mediaData[0].slice(0, mediaData[0].length - 1), // all items except the last
                {
                  id: 'extra',
                  image: 'assets/MediaGallery/1.png',
                  name: 'مقالات وكتابات أخرى',
                  count: total,
                  description: 'مقالات وكتابات أخرى للبابا شنوده الثالث',
                  image_icon: 'assets/MediaGallery/icon5.png',
                  slug: 'writings'
                },
                mediaData[0][mediaData[0].length - 1] // last original item
              ].map((item) => (
                <MediaGalleryCard
                  key={item.id}
                  img={item.image}
                  cate={item.name}
                  count={item.count}
                  desc={item.description}
                  cardIcon={item.image_icon}
                  src={item.id === 'extra' || item.id == 4 ? `/media/writings` : `/media/${item.slug}`}
                />
              ))
              : ""
          }
        </div>
      </div> */}
      <div className="mediaGalleryItems grid grid-cols-3 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          mediaData[0] &&
          [
            ...mediaData[0].slice(0, mediaData[0].length - 1),
            {
              id: "extra",
              image: "assets/MediaGallery/1.png",
              name: "مقالات وكتابات أخرى",
              count: total,
              description: "مقالات وكتابات أخرى للبابا شنوده الثالث",
              image_icon: "assets/MediaGallery/icon5.png",
              slug: "writings",
            },
            mediaData[0][mediaData[0].length - 1],
          ].map((item) => (
            <MediaGalleryCard
              key={item.id}
              img={item.image}
              cate={item.name}
              count={item.count}
              desc={item.description}
              cardIcon={item.image_icon}
              src={
                item.id === "extra" || item.id == 4
                  ? `/media/writings`
                  : `/media/${item.slug}`
              }
            />
          ))
        )}
      </div>

      <div className="bgMediaGallery"></div>
      <div className="bgMediaGallery two"></div>

      {/* <div className='mediaGalleryRes' style={{ display: "none" }}>
        <Swiper

          spaceBetween={20}
          slidesPerView={1.2}

          pagination={{
            clickable: true,
            el: '.swiper-pagination',
          }}
          modules={[Autoplay, Pagination]}
          speed={2000}
        >
          {
            mediaData[0] ? mediaData[0].map((item) => {
              return (
                <SwiperSlide >
                  <MediaGalleryCardRes img={item.image} cate={item.name} count={item.count} desc={item.description} cardIcon={item.image_icon} src={item.id == 4 ? `/media/writings` : `/media/${item.slug}`} key={item.id} />

                </SwiperSlide>
              )
            }) : ""
          }
          <SwiperSlide >
            <MediaGalleryCardRes img="assets/MediaGallery/1.png" cate="مقالات وكتابات اخرى" count={total} desc="مقالات وكتابات اخرى " cardIcon={`assets/MediaGallery/icon5.png`} src={`/media/writings`} />
          </SwiperSlide>

          <div className="swiper-pagination"></div>

        </Swiper>
      </div> */}
      <div className="mediaGalleryRes" style={{ display: "none" }}>
        {loading ? (
          <>
            <SkeletonCardRes />
            {/* <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard /> */}
          </>
        ) : (
        <Swiper
          spaceBetween={20}
          slidesPerView={1.2}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
          }}
          modules={[Autoplay, Pagination]}
          speed={2000}
        >
          {mediaData[0]
            ? // دمج أول 3 عناصر من الـ API، ثم العنصر الثابت، ثم آخر عنصر من الـ API
              [
                ...mediaData[0].slice(0, 3), // أول 3 عناصر من الـ API
                {
                  id: "extra",
                  image: "assets/MediaGallery/1.png",
                  name: "مقالات وكتابات أخرى",
                  count: total,
                  description: "مقالات وكتابات أخرى للبابا شنوده الثالث",
                  image_icon: "assets/MediaGallery/icon5.png",
                  slug: "writings",
                },
                mediaData[0][mediaData[0].length - 1], // آخر عنصر من الـ API
              ].map((item) => (
                <SwiperSlide key={item.id}>
                  <MediaGalleryCardRes
                    img={item.image}
                    cate={item.name}
                    count={item.count}
                    desc={item.description}
                    cardIcon={item.image_icon}
                    src={
                      item.id === "extra"
                        ? `/media/writings`
                        : `/media/${item.slug}`
                    }
                  />
                </SwiperSlide>
              ))
            : ""}

          <div className="swiper-pagination"></div>
        </Swiper>
        )}
      </div>
      
    </div>
  );
}
