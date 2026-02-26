import React, { useEffect, useRef, useState, useContext } from "react";
import "../Videos/Videos.scss";
import "./ProfileBookMarkContainer.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { useNavigate } from "react-router-dom";
import RecentlySoundsCard from "../Media/Sounds/RecentlySoundsCard";
import GenerlaSoundsCard from "../Media/Sounds/General/GenerlaSoundsCard";
import Paginate from "../Utility/Paginate";
import BookmarkHook from "../../Logic/Bookmark/BookmarkHook";
import { UserContext } from "../Context/UserContext";
import Play from "../../components/Footer/Play";
import Spinner from "../Utility/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-flip";
import "swiper/css/autoplay";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MultimediaShare from "../Utility/MultimediaShare";
import VideosHooks from "../../Logic/Media/Videos/VideosHooks";
import CustomModal from "../Videos/CustomModal";
import { SkeletonCategorySoundCard } from "../Category/Categories/CategorySoundCard";
import { SkeletonLoadingVideo } from "../Category/Categories/CategoryVideoCard";
import SkeletonVideosSection from "../Videos/SkeletonVideosSection";
import SkeletonCard from "../Home/SkeletonCard";
import { SkeletonArticleCard } from "../Media/Writings/Articles/ArticlesCard";
import SkeletonDocsSection from "../Media/Writings/Docs/SkeletonDocsSection";
import SkeletonVideosSectionRes from "../Videos/SkeletonVideosSectionRes";
import SkeletonDocsSectionRes from "../Media/Writings/Docs/SkeletonDocsSectionRes";
export default function ProfileBookMarkContainer() {
  const [
    data,
    videosFavData,
    soundsFavData,
    pageCount,
    handleChangePage,
    handleDeleteFav,
    handleChooseFav,
    getHeaders,
    headFav,
    fav,
    ele,
    check,
  ] = BookmarkHook();
  const {
    baseURL,
    categoryId,
    setCategoryId,
    setAudioURL,
    setAudioId,
    fetchAudio,
    setClicked,
    recent,
    clicked,
    SendAudio,
    pag,
    setPag,
    setPage,
    pag2,
    setPag2,
    setPage2,
  } = useContext(UserContext);
  const [
    ,
    videos,
    categories,
    attrs,
    cateID,
    ,
    ,
    page,
    ,
    token_popeShounda,
    visibleModal,
    fetchVideos,
    handlePageChange,
    AddToBook,
    copiedProductIds,
    bookMarkRef,
    handleCopy,
    handleShareClick,
    setCategories,
    setVideos,
    notFound,
    notFoundRes,
    activePage,
    setVisibleModal,
  ] = VideosHooks();

  const [showPlay, setShowPlay] = useState(false);

  const op = useRef(null);
  const navigate = useNavigate();
  const convertVideo = (video) => {
    const mainMatch = video.match(/(?:youtu\.be\/|v=)([^&/]+)/);
    const videoID = mainMatch ? mainMatch[1] : "23ruEfLScnss"; // Fallback videoID if match fails

    const videoSrc = `https://www.youtube.com/embed/${videoID}`;
    return videoSrc;
  };
  function isImage(file) {
    // Checking MIME type
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/svg+xml",
    ];

    return validImageTypes.includes(file.type);
  }

  useEffect(() => {
    if (soundsFavData.length == 0 || videosFavData.length == 0) {
      getHeaders();
    }
  }, [soundsFavData.length, videosFavData.length]);

  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedOutsideModal =
        modalRef.current && !modalRef.current.contains(event.target);
      const clickedShareCard = event.target.closest(".shareCard");
      if (clickedOutsideModal && !clickedShareCard) {
        setVisibleModal(null); // Close the modal
        setOverlayBlockMediaShare(false); // Close the share if needed
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // for share video
  const [isOverlayBlockMediaShare, setOverlayBlockMediaShare] = useState(false);
  const [videoID, setVideoID] = useState();
  const openMediaShareBlock = () => {
    document.body.classList.add("no-scroll");
    setOverlayBlockMediaShare(true);
  };
  const closeMediaShareBlock = () => {
    document.body.classList.remove("no-scroll");
    setOverlayBlockMediaShare(false);
  };
  function convertVimeoUrl(url) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    } else {
      return null; // or return original URL if needed
    }
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [videoTabOpened, setVideoTabOpened] = useState(false);
  const [audioTabOpened, setaudioTabOpened] = useState(false);

  return (
    <div className="profileBookMarkContainer">
      <div className="profileBookMarkContainerHeader" ref={headFav}>
        {data
          ? data.map((head, i) => {
              return (
                <div
                  className={`profileBookMarkContainerHeaderItem`}
                  id={`fav${head.id}`}
                  key={head.id}
                  onClick={() => {
                    handleChooseFav(head.id);
                    if (head.id === 3) setVideoTabOpened(true); // أول ما يفتح تبويب الفيديوهات
                    if (head.id === 5) setaudioTabOpened(true);
                  }}
                >{`مقاطع ${head.name} المفضلة `}</div>
              );
            })
          : check == false && (
              <p style={{ textAlign: "center" }}>
                <Spinner />
              </p>
            )}
      </div>
      <div>
        {fav == 5 ? (
          <>
            <div className="soundsItems">
              {soundsFavData.map((item, index) => {
                return (
                  <GenerlaSoundsCard
                    img={
                      item.sharepoint_image
                        ? item.image
                        : "/assets/default/sounds/Audio-DF.png"
                    }
                    key={index}
                    title={item.name}
                    desc="قداسة البابا شنوده الثالث"
                    id={item.id}
                    handelFunction={handleDeleteFav}
                    index={index}
                    bookmarkshow={item.bookmarkshow}
                    url={item.url}
                    onClick={() => {
                      SendAudio(
                        item.url,
                        item.id,
                        item.sharepoint_image
                          ? item.image
                          : "/assets/default/sounds/Audio-DF.png",
                        item.name,
                        item.bookmarkshow,
                        soundsFavData,
                        index
                      );
                    }}
                  />
                );
              })}
            </div>
            <div
              className="soundsItemsRes"
              style={{ display: "none" }}
              dir="rtl"
            >
              <Swiper
                spaceBetween={10}
                slidesPerView={1.3}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination",
                }}
                modules={[Autoplay, Pagination]}
                speed={2000}
              >
                {soundsFavData
                  ? soundsFavData.map((item, index) => {
                      return (
                        <SwiperSlide>
                          <GenerlaSoundsCard
                            img={
                              item.sharepoint_image
                                ? item.image
                                : "/assets/default/sounds/Audio-DF.png"
                            }
                            key={index}
                            title={item.name}
                            desc="قداسة البابا شنوده الثالث"
                            id={item.id}
                            handelFunction={handleDeleteFav}
                            index={index}
                            bookmarkshow={item.bookmarkshow}
                            url={item.url}
                            onClick={() =>
                              SendAudio(
                                item.url,
                                item.id,
                                item.sharepoint_image
                                  ? item.image
                                  : "/assets/default/sounds/Audio-DF.png",
                                item.name,
                                item.bookmarkshow,
                                soundsFavData,
                                index
                              )
                            }
                          />
                        </SwiperSlide>
                      );
                    })
                  : ""}
              </Swiper>
            </div>

            {soundsFavData.length >= 1 ? (
              <Paginate pageCount={pageCount} onPress={handleChangePage} />
            ) : (
              <>
                {audioTabOpened&&Array.from({ length: 1 }).map((_, idx) =>
                  isMobile ? (
                    <SkeletonDocsSectionRes key={idx} />
                  ) : (
                    <SkeletonDocsSection key={idx} />
                  )
                )}
                {/* <SkeletonDocsSection /> */}
              </>
            )}
          </>
        ) : fav == 3 ? (
          <>
            <div className="videos-videos-cont">
              {videosFavData.map((item, subIndex) => {
                return (
                  <div>
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      {item.url ? (
                        <iframe
                          className="display_video_frame_medition"
                          src={convertVimeoUrl(item.url)}
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          style={{ marginBottom: "100px" }}
                        />
                      ) : (
                        ""
                      )}

                      <div
                        onClick={() => navigate(`/displayvideo/${item.slug}`)}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          backgroundColor: "rgba(0,0,0,0)", // Transparent overlay
                        }}
                      />
                    </div>

                    <div className="videos-video-bottoms">
                      <div className="videos-video-data">
                        <img
                          src="./assets/dots.png"
                          alt=""
                          className="videos-video-points"
                          onClick={() => handleShareClick(item.id)}
                          style={{ cursor: "pointer" }}
                        />
                        <div className="videos-video-content">
                          <p className="videos-video-bottom-name">
                            {item.name}
                          </p>
                          <img
                            src="./assets/archive2.png"
                            alt=""
                            className="videos-video-img"
                            onClick={() => handleDeleteFav(item.id)}
                          />
                        </div>

                        <CustomModal
                          key={subIndex}
                          isVisible={visibleModal === item.id}
                        >
                          <div ref={modalRef}>
                            <p
                              className="video-share"
                              onClick={() => setOverlayBlockMediaShare(true)}
                            >
                              مشاركة
                            </p>
                          </div>

                          {isOverlayBlockMediaShare && (
                            <MultimediaShare
                              closeOverlay={closeMediaShareBlock}
                              text={`https://popeshenoudasitetest.msol.dev/displayvideo/${item.slug}`}
                            />
                          )}
                        </CustomModal>
                      </div>

                      {/* <p className='videos-video-date'>{item.created_at}</p> */}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "240px",
                        background: "rgba(255, 255, 255, 0)",
                        cursor: "pointer",
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div className="videos-videos-cont-Res" style={{ display: "none" }}>
              <Swiper
                spaceBetween={10}
                slidesPerView={1.3}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination",
                }}
                modules={[Autoplay, Pagination]}
                speed={2000}
              >
                {videosFavData
                  ? videosFavData.map((item, subIndex) => {
                      return (
                        <SwiperSlide>
                          <div>
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                width: "100%",
                                height: "160px",
                              }}
                            >
                              {item.url ? (
                                <iframe
                                  className="display_video_frame_medition"
                                  src={convertVimeoUrl(item.url)}
                                  frameBorder="0"
                                  allow="autoplay; fullscreen; picture-in-picture"
                                  allowFullScreen
                                  style={{ height: "100%" }}
                                />
                              ) : (
                                ""
                              )}
                              <div
                                onClick={() =>
                                  navigate(`/displayvideo/${item.slug}`)
                                }
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  cursor: "pointer",
                                  backgroundColor: "rgba(0,0,0,0)", // Transparent overlay
                                }}
                              />
                            </div>

                            <div className="videos-video-bottoms">
                              <div className="videos-video-data">
                                <img
                                  src="./assets/dots.png"
                                  alt=""
                                  className="videos-video-points"
                                  onClick={() => handleShareClick(item.id)}
                                />
                                <div className="videos-video-content">
                                  <p className="videos-video-bottom-name">
                                    {item.name}
                                  </p>
                                  <img
                                    src="./assets/archive2.png"
                                    alt=""
                                    className="videos-video-img"
                                    onClick={() => handleDeleteFav(item.id)}
                                  />
                                </div>
                                <CustomModal
                                  key={subIndex}
                                  isVisible={visibleModal === item.id}
                                >
                                  <p
                                    className="video-share"
                                    onClick={() => {
                                      setOverlayBlockMediaShare(true);
                                      setVideoID(item.id);
                                    }}
                                  >
                                    مشاركة
                                  </p>
                                </CustomModal>
                              </div>

                              {/* <p className='videos-video-date'>{item.created_at}</p> */}
                            </div>
                            <div
                              style={{
                                position: "initial",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                height: "240px",
                                background: "rgba(255, 255, 255, 0)",
                                cursor: "pointer",
                              }}
                            ></div>
                          </div>
                        </SwiperSlide>
                      );
                    })
                  : ""}
              </Swiper>
            </div>

            {videosFavData.length >= 1 ? (
              <Paginate pageCount={pageCount} onPress={handleChangePage} />
            ) : (
              videoTabOpened &&
              Array.from({ length: 1 }).map((_, idx) =>
                isMobile ? (
                  <SkeletonVideosSectionRes key={idx} />
                ) : (
                  <SkeletonVideosSection key={idx} />
                )
              )
            )}
          </>
        ) : (
          ""
        )}
        <p className="noResult" ref={ele} style={{ display: "none" }}>
          لا يوجد نتائج
        </p>
      </div>

      <Play />
      <ToastContainer />

      {isOverlayBlockMediaShare && (
        <MultimediaShare
          closeOverlay={closeMediaShareBlock}
          text={`https://popeshenoudasitetest.msol.dev/displayvideo/${videoID}`}
        />
      )}
    </div>
  );
}
