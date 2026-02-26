import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
export default function CategoryVisitOverlayOutside({
  closeOverlay,
  visitsImgs,
  currentIndex,
}) {
  const sb = useRef();
  const sf = useRef();
  const textRefs = useRef([]); // Array of refs for text
  const buttonRefs = useRef([]); // Array of refs for buttons
  const containerRefs = useRef([]); // Array of refs for containers
  function toggleText(index) {
    const text = textRefs.current[index];
    const button = buttonRefs.current[index];
    const container = containerRefs.current[index];
    if (!text || !button || !container) {
      console.error("Refs are not properly assigned or undefined.");
      return;
    }
    console.log(text);
    if (text.classList.contains("collapsed")) {
      text.classList.remove("collapsed");
      text.classList.add("expanded");
      container.style.backgroundColor = "rgba(0,0,0,0.8)";
      container.style.position = "absolute";
      container.style.left = "5%";
      container.style.top = "200px";
      sf.current.style.display = "none";
      sb.current.style.display = "none";
      button.textContent = "عرض أقل";
    } else {
      text.classList.remove("expanded");
      text.classList.add("collapsed");
      container.style.backgroundColor = "transparent";
      container.style.position = "";
      container.style.left = "";
      container.style.top = "";
      sf.current.style.display = "block";
      sb.current.style.display = "block";
      button.textContent = "عرض المزيد";
    }
  }
  const imgZoomRef = useRef(null);
  const handleZoom = (e) => {
    e.target.classList.toggle("zoomed");
  };
  return (
    <>
      <div className="cateOverlay CategoryVisitOverlayOutside">
        <div className="overlay">
          <div className="overlay-wrapper">
            <img
              src="/assets/close.png"
              alt=""
              className="visits-overlay-close"
              onClick={closeOverlay}
            />

            <div className="visits-swiper-relative">
              <Swiper
                spaceBetween={50}
                slidesPerView={1}
                navigation={{
                  nextEl: ".visits-back ",
                  prevEl: ".visits-front",
                }}
                modules={[Navigation, Autoplay, Pagination, EffectFade]}
                speed={2000}
                effect="fade"
                initialSlide={currentIndex || 0}
              >
                {visitsImgs.value
                  ? visitsImgs.value.slice(0, 3).map((visitImg, index) => (
                      <SwiperSlide key={index}>
                        <div className="visits-swiper">
                          <div className="visits-swiper-right">
                            <p className="visits-papa">
                              {visitImg.category_name}
                            </p>

                            <p
                              className="visits-visits"
                              dangerouslySetInnerHTML={{
                                __html: visitImg.description,
                              }}
                            ></p>
                          </div>
                          <div className="visits-swiper-line"></div>
                          <div className="visits-swiper-left">
                            <img
                              src={
                                visitImg.image != null
                                  ? visitImg.image
                                  : "/assets/gallery-1.png"
                              }
                              alt=""
                              style={{ height: "700px" }}
                              ref={imgZoomRef}
                              onClick={handleZoom}
                              className="zoomable"
                            />
                            {visitImg.image != null && (
                              <div class="parent-container-download">
                                <a
                                  href={visitImg.image}
                                  download
                                  className="download-btn-cate"
                                  onClick={(e) => e.stopPropagation()} // Prevent parent click
                                >
                                  ⬇ تحميل
                                </a>
                              </div>
                            )}

                            <div className="visits-swiper-line-res"></div>
                            <p
                              className="visits-visits-res"
                              dangerouslySetInnerHTML={{
                                __html: visitImg.description,
                              }}
                            ></p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  : visitsImgs
                  ? visitsImgs.slice(0, 3).map((visitImg, index) => (
                      <SwiperSlide key={index}>
                        <div className="visits-swiper">
                          <div className="visits-swiper-right">
                            <p className="visits-papa">
                              {visitImg.category_name}
                            </p>

                            <p
                              className="visits-visits"
                              dangerouslySetInnerHTML={{
                                __html: visitImg.description,
                              }}
                            ></p>
                          </div>
                          <div className="visits-swiper-line"></div>
                          <div className="visits-swiper-left zoomable">
                            <img
                              src={
                                visitImg.image != null
                                  ? visitImg.image
                                  : "/assets/gallery-1.png"
                              }
                              alt=""
                              style={{ height: "700px" }}
                              ref={imgZoomRef}
                              onClick={handleZoom}
                              className="zoomable"
                            />

                            <a
                              href={visitImg.image}
                              download
                              className="download-btn"
                              onClick={(e) => e.stopPropagation()} // Prevent parent click
                            >
                              ⬇ تحميل
                            </a>

                            <div className="visits-swiper-line-res"></div>
                            <p
                              className="visits-visits-res"
                              dangerouslySetInnerHTML={{
                                __html: visitImg.description,
                              }}
                            ></p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  : ""}

                <div className="visits-back">
                  <img
                    src="/assets/happen-left.png"
                    alt=""
                    className="swiper-back"
                  />
                </div>
                <div className="visits-front">
                  <img
                    src="/assets/happen-right.png"
                    alt=""
                    className="swiper-front"
                  />
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      <div className="cateOverlayRes" style={{ display: "none" }}>
        <div className="overlay">
          <div className="overlay-wrapper overlayCate">
            <img
              src="/assets/close.png"
              alt=""
              className="visits-overlay-close"
              onClick={closeOverlay}
            />

            <div className="visits-swiper-relative" dir="rtl">
              <Swiper
                spaceBetween={50}
                slidesPerView={1}
                navigation={{
                  nextEl: ".visits-back",
                  prevEl: ".visits-front",
                }}
                modules={[Navigation, Autoplay, Pagination, EffectFade]}
                speed={2000}
                effect="fade"
                initialSlide={currentIndex}
              >
                {visitsImgs.value
                  ? visitsImgs.value.map((visitImg, index) => (
                      <SwiperSlide key={index}>
                        <div className="visits-swiper">
                          <div className="visits-swiper-right">
                            <p className="visits-papa">
                              {visitImg.category_name}
                            </p>
                            <p
                              className="visits-visits"
                              dangerouslySetInnerHTML={{
                                __html: visitImg.description,
                              }}
                            ></p>
                          </div>
                          <div className="visits-swiper-line"></div>
                          <div className="visits-swiper-left">
                            <img src={visitImg.image} alt="" />
                            <div className="visits-swiper-line-res"></div>

                            {visitImg.image != null && (
                              <div class="parent-container-download">
                                <a
                                  href={visitImg.image}
                                  download
                                  className="download-btn-cate"
                                  onClick={(e) => e.stopPropagation()} // Prevent parent click
                                >
                                  ⬇ تحميل
                                </a>
                              </div>
                            )}

                            <div
                              className="text-container"
                              ref={(el) => (containerRefs.current[index] = el)}
                            >
                              <p
                                className="visits-visits-res collapsed"
                                dangerouslySetInnerHTML={{
                                  __html: visitImg.description,
                                }}
                                ref={(el) => (textRefs.current[index] = el)}
                                id="text"
                              ></p>
                              <button
                                className="read-more"
                                onClick={() => toggleText(index)}
                                ref={(el) => (buttonRefs.current[index] = el)}
                              >
                                عرض المزيد
                              </button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  : visitsImgs
                  ? visitsImgs.map((visitImg, index) => (
                      <SwiperSlide key={index}>
                        <div className="visits-swiper">
                          <div className="visits-swiper-right">
                            <p className="visits-papa">
                              {visitImg.category_name}
                            </p>
                            <p
                              className="visits-visits"
                              dangerouslySetInnerHTML={{
                                __html: visitImg.description,
                              }}
                            ></p>
                          </div>
                          <div className="visits-swiper-line"></div>
                          <div className="visits-swiper-left">
                            <img
                              src={visitImg.image}
                              alt=""
                              className="zoomable"
                            />
                            <div className="visits-swiper-line-res"></div>
                            {visitImg.image != null && (
                              <div class="parent-container-download">
                                <a
                                  href={visitImg.image}
                                  download
                                  className="download-btn-cate"
                                  onClick={(e) => e.stopPropagation()} // Prevent parent click
                                >
                                  ⬇ تحميل
                                </a>
                              </div>
                            )}
                            <div
                              className="text-container"
                              ref={(el) => (containerRefs.current[index] = el)}
                            >
                              <p
                                className="visits-visits-res collapsed"
                                dangerouslySetInnerHTML={{
                                  __html: visitImg.description,
                                }}
                                ref={(el) => (textRefs.current[index] = el)}
                                id="text"
                              ></p>
                              <button
                                className="read-more"
                                onClick={() => toggleText(index)}
                                ref={(el) => (buttonRefs.current[index] = el)}
                              >
                                عرض المزيد
                              </button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  : ""}

                <div className="visits-back">
                  <img
                    src="/assets/happen-left.png"
                    alt=""
                    className="swiper-back"
                    ref={sb}
                  />
                </div>
                <div className="visits-front">
                  <img
                    src="/assets/happen-right.png"
                    alt=""
                    className="swiper-front"
                    ref={sf}
                  />
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
