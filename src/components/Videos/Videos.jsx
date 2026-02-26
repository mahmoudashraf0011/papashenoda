import React, { useContext, useEffect, useState, useRef } from 'react';
import './Videos.scss'
import './Videos-res.scss'
import './Responsive/VideosRes.css'
import VideosFIlter from './VideosFIlter';
import axios from 'axios';
import { UserContext } from '../Context/UserContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Paginate from '../Utility/Paginate';
import { OverlayPanel } from 'primereact/overlaypanel';
import CopyToClipboard from 'react-copy-to-clipboard';
import CustomModal from './CustomModal';
import VideosHooks from '../../Logic/Media/Videos/VideosHooks';
import Spinner from '../Utility/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip';
import 'swiper/css/autoplay';
import MultimediaShare from '../Utility/MultimediaShare';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";import SkeletonBooksSection from './SkeletonBooksSection';
;
export default function Videos() {
  const [baseURL, videos, categories, attrs, cateID, navigate, pag, page, op, token_popeShounda, visibleModal, fetchVideos, handlePageChange, AddToBook, copiedProductIds, bookMarkRef, handleCopy, handleShareClick, setCategories, setVideos, notFound, notFoundRes, activePage, setVisibleModal] = VideosHooks();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 1000);
    setLoading(false)
    return () => clearTimeout(timer);
  }, []);

  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
  });

  window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Ensure scroll starts at the top
  }, []);
  const [bookmarkedVideos, setBookmarkedVideos] = useState({});

  useEffect(() => {
    if (videos && Object.keys(bookmarkedVideos).length === 0) {
      const initialBookmarks = {};
      videos.media.forEach(mediaItem => {
        mediaItem.media.forEach(video => {
          initialBookmarks[video.id] = video.bookmarkshow;
        });
      });
      setBookmarkedVideos(initialBookmarks);
    }
  }, [videos]);



  // Toggle bookmark instantly
  const toggleBookmark = (video) => {
    const newStatus = !bookmarkedVideos[video.id];
    setBookmarkedVideos((prevState) => ({
      ...prevState,
      [video.id]: newStatus,
    }));

    AddToBook(video.id, video.bookmarkshow);
  };
  const location = useLocation();

  // useEffect(()=>{
  //     if(location.pathname=="/media/3"){
  //         if(document.querySelector(".p-multiselect-panel")){
  //             document.querySelector(".p-multiselect-panel").style.width="100px";

  //         }
  //       }
  // },[location.pathname])

  const [isOverlayBlockMediaShare, setOverlayBlockMediaShare] = useState(false);
  const [lockScrollPosition, setLockScrollPosition] = useState(0);
  const [videoID, setVideoID] = useState();
  const openMediaShareBlock = () => {
    document.body.classList.add("no-scroll");
    setOverlayBlockMediaShare(true);
  };

  useEffect(() => {
    if (isOverlayBlockMediaShare) {
      document.body.style.overflow = 'hidden';
    }

  }, [isOverlayBlockMediaShare])


  const closeMediaShareBlock = () => {
    document.body.classList.remove("no-scroll");
    setOverlayBlockMediaShare(false)
    document.body.style.overflow = 'visible';

  }

  let checkLogin = localStorage.getItem("token_popeShounda") || "";

  const [availability, setAvailability] = useState({}); // Store availability by video URL

  const checkVideo = (videoUrl) => {
    const idMatch = videoUrl.match(/(?:\/embed\/|v=|youtu\.be\/)([^?&]+)/);
    if (!idMatch || !idMatch[1]) {
      setAvailability((prev) => ({ ...prev, [videoUrl]: false }));
      return;
    }

    const videoId = idMatch[1];
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const img = new Image();
    img.onload = function () {
      const exists = !(img.width === 120 && img.height === 90);
      setAvailability((prev) => ({ ...prev, [videoUrl]: exists }));
    };
    img.onerror = function () {
      setAvailability((prev) => ({ ...prev, [videoUrl]: false }));
    };
    img.src = thumbUrl;
  };

  useEffect(() => {
    if (!videos) return;
    videos.media.forEach((mediaItem) => {
      mediaItem.media.forEach((video) => {
        if (!(video.second_url in availability)) {
          checkVideo(video.second_url);
        }
      });
    });
  }, [videos]);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedOutsideModal = modalRef.current && !modalRef.current.contains(event.target);
      const clickedShareCard = event.target.closest('.shareCard');
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


  //check viemo url
  async function convertVimeoUrlAndCheck(url) {
    try {
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);

      if (response.ok) {
        const data = await response.json();

        // ✅ Check if data.html exists before trying to match
        if (data.html) {
          const videoIdMatch = data.html.match(/player\.vimeo\.com\/video\/(\d+)/);
          if (videoIdMatch && videoIdMatch[1]) {
            return {
              success: true,
              embedUrl: `https://player.vimeo.com/video/${videoIdMatch[1]}`
            };
          }
        }

        // Optional fallback: try to extract ID from the original URL
        const fallbackMatch = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
        if (fallbackMatch && fallbackMatch[1]) {
          return {
            success: true,
            embedUrl: `https://player.vimeo.com/video/${fallbackMatch[1]}`
          };
        }

        return { success: false, error: "Video ID could not be extracted" };
      } else {
        return { success: false, error: "Video not embeddable or does not exist" };
      }
    } catch (err) {
      console.error("Vimeo check error:", err);
      return { success: false, error: err.message };
    }
  }
  const [validVimeoUrls, setValidVimeoUrls] = useState({});
  const [invalidVimeoIds, setInvalidVimeoIds] = useState({});

  useEffect(() => {
    async function validateVimeoLinks() {
      const validResults = {};
      const invalidResults = {};


      videos && videos.media.forEach((mediaItem) => {
        for (const video of mediaItem.media || []) {
          if (video.url) {
            const result = convertVimeoUrlAndCheck(video.url);
            if (result.success) {
              validResults[video.id] = result.embedUrl;
            } else {
              invalidResults[video.id] = result.error;
            }
          }
        }

      });


      setValidVimeoUrls(validResults);
      setInvalidVimeoIds(invalidResults);
    }

    validateVimeoLinks();
  }, [videos]);

  function convertVimeoUrl(url) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    } else {
      return null; // or return original URL if needed

    }
  }
  return (
    <div className='videos'>
      <div className="videos-wrapper">
        <div className="videos-top-head">
          <img src="/assets/videos-2.png" alt="" className='videos-top-img' />
          <p className='videos-top-p'>فيديوهات مركز معلم الاجيال</p>
          <img src="/assets/videos-1.png" alt="" className='videos-top-img' />
        </div>
        <div className="videos-top-head-res" style={{ display: "none" }}>
          <img src="/assets/videoBgLeft.png" alt="" className='videos-top-img' />
          <p className='videos-top-p'>فيديوهات مركز معلم الاجيال</p>
          <img src="/assets/videoBgRight.png" alt="" className='videos-top-img' />
        </div>
        <div className="videos-videos-big-cont fullVideos">
          <VideosFIlter cates={categories} attrs={attrs} fetchVideos={fetchVideos} notFound={notFound} />
          <div className=''>
            {videos && videos.media.map((mediaItem, index) => (
              <>
                <div key={index} className='videosContainer'>
                  <p className='videos-about'>{mediaItem.value}</p>
                  <div className="videos-videos-cont">
                    {mediaItem.media.map((video, subIndex) => {
                      const embedUrl = validVimeoUrls[video.id];

                      let videoID = "";
                      let videoSrc = "";
                      let isAvailable = false;
                      if (video?.second_url) {
                        const match = video.url.match(/(?:youtu\.be\/|v=)([^&/]+)/);
                        if (match && match[1]) {
                          videoID = match[1];
                          videoSrc = `https://www.youtube.com/embed/${videoID}`;
                          isAvailable = availability?.[video.second_url];
                        }
                      }

                      return (
                        <div className='video-video-width' style={{ position: 'relative', height: '343px' }} key={subIndex}>

                          {

                            video.url ?
                              <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>

                                <iframe
                                  className='display_video_frame_medition'
                                  src={convertVimeoUrl(video.url)}
                                  frameBorder="0"
                                  allow="autoplay; fullscreen; picture-in-picture"
                                  allowFullScreen
                                />
                                {
                                  video.third_url&&(
                                    <a
                                    href={video.third_url}
                                    download
                                    className="video-download-btn"
                                    onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                                  >
                                    تحميل ⬇
                                  </a>
                                  )
                                }
                              
                              </div>

                              :
                              (
                                isAvailable === undefined ? (
                                  <p>Checking...</p>
                                ) : isAvailable ? (
                                  <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>

                                    <iframe
                                      className="video-video-frame"
                                      src={videoSrc}
                                      title={`YouTube video player ${video.name}`}
                                      frameBorder="0"
                                      allow="encrypted-media"
                                      allowFullScreen
                                    />
                                       {
                                  video.third_url&&(
                                    <a
                                    href={video.third_url}
                                    download
                                    className="video-download-btn"
                                    onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                                  >
                                    تحميل ⬇
                                  </a>
                                  )
                                }
                                  </div>

                                ) : (
                                  <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>
                                    <video controls className='second_video_videos'>
                                      < source src={video.third_url} type="video/mp4" />
                                    </video>
                                    {
                                  video.third_url&&(
                                    <a
                                    href={video.third_url}
                                    download
                                    className="video-download-btn"
                                    onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                                  >
                                    تحميل ⬇
                                  </a>
                                  )
                                }
                                  </div>

                                )
                              )

                          }

                          <div className="videos-video-bottom-section " >
                            <div className="videos-video-bottom " >

                              <img src="/assets/dots.png" alt="" className='videos-video-dots' onClick={() => handleShareClick(video.id)} />
                              <div className="videos-video-archive3 ">
                                <p className='videos-video-bottom-p'><Link to={`/displayvideo/${video.slug}`}>{video.name}</Link></p>
                                {
                                  checkLogin ?
                                    <img src={bookmarkedVideos[video.id] ? "/assets/bookmark-yellow.png" : "/assets/archive.png"} alt="" className='videos-video-archive'
                                      onClick={() => toggleBookmark(video)}
                                    />
                                    : ""
                                }

                              </div>

                              <CustomModal
                                key={subIndex}
                                isVisible={visibleModal === video.id}

                              >
                                <div ref={modalRef} className='MultimediaShare-video-share'>
                                  <p className='video-share' onClick={() => {
                                    setOverlayBlockMediaShare(true)
                                  }}>مشاركة</p>
                                </div>

                                {
                                  isOverlayBlockMediaShare &&

                                  <MultimediaShare closeOverlay={closeMediaShareBlock} text={`https://popeshenoudasitetest.msol.dev/displayvideo/${video.slug}`} />

                                }
                              </CustomModal>

                              {copiedProductIds[video.id] && (
                                <span className='details-link'>Link copied!</span>
                              )}

                            </div>



                            {/* <p className='videos-video-date'>{video.created_at}</p> */}
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              top: 50,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              height: '140px',
                              background: 'rgba(255, 255, 255, 0)',
                              cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/displayvideo/${video.slug}`)}
                          >

                          </div>

                        </div>
                      );

                    })}
                  </div>

                </div>


              </>

            ))}
            {
              !loading ? <SkeletonBooksSection/> : null

            }
            {pag && pag.total_pages > 0 ?
              <Paginate pageCount={pag.total_pages} onPress={handlePageChange} activePage={activePage} />
              : ""}
            
          </div>

          <p className='noResult' ref={notFound} style={{ display: "none" }}>لا يوجد نتائج</p>

        </div>
        <div className="videos-videos-big-cont resVideos" style={{ display: "none" }} dir='rtl'>
          <VideosFIlter cates={categories} attrs={attrs} fetchVideos={fetchVideos} notFound={notFound} />
          <div className='' >
            {videos && videos.media.map((mediaItem, index) => (
              <>

                <div className='videosContaninerRes' key={index}>
                  <p className='videos-about'>{mediaItem.value}</p>
                  <div className="videos-videos-conts">
                    <Swiper

                      spaceBetween={20}
                      slidesPerView={1.25}

                      pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                      }}
                      modules={[Autoplay, Pagination]}
                      speed={2000}
                    >
                      {
                        mediaItem.media.map((video, subIndex) => {
                          let videoID = "";
                          let videoSrc = "";
                          let isAvailable = false;
                          if (video?.url) {
                            const match = video.url.match(/(?:youtu\.be\/|v=)([^&/]+)/);
                            if (match && match[1]) {
                              videoID = match[1];
                              videoSrc = `https://www.youtube.com/embed/${videoID}`;
                              isAvailable = availability?.[video.url];
                            }
                          }
                          const embedUrl = validVimeoUrls[video.id];

                          return (
                            <SwiperSlide >
                              <div style={{ position: 'relative', height: '343px' }} key={subIndex}>
                                {

                                  video.url ?
                                  <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>
                                    <iframe
                                        className='display_video_frame_medition'
                                        src={convertVimeoUrl(video.url)}
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                      /> 
                                      {
                                        video.third_url&&(
                                          <a
                                          href={video.third_url}
                                          download
                                          className="video-download-btn"
                                          onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                                        >
                                          تحميل ⬇
                                        </a>
                                        )
                                      }
                                  </div>

                                     :
                                    (
                                      isAvailable === undefined ? (
                                        <p>Checking...</p>
                                      ) : isAvailable ? (
                                        <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>
                                        <iframe
                                            className="video-video-frame"
                                            src={videoSrc}
                                            title={`YouTube video player ${video.name}`}
                                            frameBorder="0"
                                            allow="encrypted-media"
                                            allowFullScreen
                                          />
                                          {
                                            video.third_url&&(
                                              <a
                                              href={video.third_url}
                                              download
                                              className="video-download-btn"
                                              onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                                            >
                                              تحميل ⬇
                                            </a>
                                            )
                                          }
                                        </div>

                         
                                      ) : (
                                        <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>
                                          <video controls className='second_video_videos'>
                                            <source src={video.third_url} type="video/mp4" />
                                          </video>
                                          {
                                            video.third_url&&(
                                              <a
                                              href={video.third_url}
                                              download
                                              className="video-download-btn"
                                              onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                                            >
                                              تحميل ⬇
                                            </a>
                                            )
                                          }
                                        </div>

                                    
                                      )
                                    )

                                }
                                <div className="videos-video-bottom-section">
                                  <div className="videos-video-bottom">

                                    <img src="/assets/dots.png" alt="" className='videos-video-dots' onClick={() => handleShareClick(video.id)} />
                                    <div className="videos-video-archive3">
                                      <p className='videos-video-bottom-p'>
                                        <Link to={`/displayvideo/${video.slug}`}>{video.name}</Link>
                                      </p>
                                      {checkLogin ? (
                                        <img
                                          src={bookmarkedVideos[video.id] ? "/assets/bookmark-yellow.png" : "/assets/archive.png"}
                                          alt=""
                                          className='videos-video-archive'
                                          onClick={() => toggleBookmark(video)}
                                        />
                                      ) : ""}
                                    </div>


                                    <CustomModal
                                      key={subIndex}
                                      isVisible={visibleModal === video.id}

                                    >
                                      <p
                                        className="video-share"
                                        onClick={() => {
                                          setOverlayBlockMediaShare(true);
                                          setVideoID(video.id);

                                        }}
                                      >
                                        مشاركة
                                      </p>

                                    </CustomModal>

                                    {copiedProductIds[video.id] && (
                                      <span className='details-link'>Link copied!</span>
                                    )}

                                  </div>



                                  {/* <p className='videos-video-date'>{video.created_at}</p> */}
                                </div>
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    height: '200px',
                                    background: 'rgba(255, 255, 255, 0)',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => navigate(`/displayvideo/${video.slug}`)}
                                >

                                </div>

                              </div>

                            </SwiperSlide>
                          )
                        })
                      }


                      <div className="swiper-pagination"></div>

                    </Swiper>
                  </div>
                  {
                    isOverlayBlockMediaShare && <MultimediaShare closeOverlay={closeMediaShareBlock} text={`https://popeshenoudasitetest.msol.dev/displayvideo/${videoID}`} />
                  }
                </div>

              </>

            ))}
            {
              !loading ? <SkeletonBooksSection/> : null

            }
            {pag && pag.total_pages > 0 ?
              <Paginate pageCount={pag.total_pages} onPress={handlePageChange} activePage={activePage} />
              : ""}
            {/* {
              !loading ? < Spinner /> : ""
            } */}
          </div>


          <p className='noResult' ref={notFoundRes} style={{ display: "none" }}>لا يوجد نتائج</p>

        </div>
      </div>
      <ToastContainer />

    </div>
  )
}


