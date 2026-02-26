import React, { useContext, useEffect, useState, useRef } from 'react';
import './DisplayVideo.scss'
import OneVideo from './OneVideo'
import axios from 'axios'
import { UserContext } from '../Context/UserContext';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip';
import 'swiper/css/autoplay';
import VideosHooks from '../../Logic/Media/Videos/VideosHooks';
import { ToastContainer } from 'react-toastify';
import SkeletonVideosSection from './SkeletonVideosSection';
import Skeleton from 'react-loading-skeleton';
export default function DisplayVideo() {
  const [, , categories, attrs, cateID, navigate, pag, page, op, token_popeShounda, visibleModal, fetchVideos, handlePageChange, AddToBook, copiedProductIds, bookMarkRef, handleCopy, handleShareClick, setCategories, , notFound, notFoundRes, activePage] = VideosHooks();
  const { id } = useParams();
  const { baseURL } = useContext(UserContext);
  const [disVideo, setdisVideo] = useState('');
  const [videos, setVideos] = useState('');
  useEffect(() => {
    // console.log("iddddddd", id);
    axios.get(`${baseURL}/v2/video?slug=${id}`, {
      headers: { Authorization: `Bearer ${token_popeShounda}` }
    })
      .then((response) => {
        setdisVideo(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios.get(`${baseURL}/getmedia/3`)
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, [id, token_popeShounda]); // Include dependencies if they change dynamically

  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
  });

  window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Ensure scroll starts at the top
  }, []);
  const convertVideo = (video) => {
    // Try matching the main video URL
    const mainMatch = video.match(/(?:youtu\.be\/|v=)([^&/]+)/);
    const videoID = mainMatch ? mainMatch[1] : "23ruEfLScnss"; // Fallback videoID if match fails

    // Start with the main video ID in the playlist
    let playlistIDs = [videoID];

    // If videos.data exists, process each additional video URL
    if (videos.data) {
      videos.data.media[0]?.media.forEach((item) => {
        const itemMatch = item.second_url.match(/(?:youtu\.be\/|v=)([^&/]+)/);
        if (itemMatch) {
          const listID = itemMatch[1];
          playlistIDs.push(listID);
        } else {
          // console.error("Invalid YouTube URL for item:", item.second_url);
        }
      });
    }

    // Create playlist parameter from all valid video IDs
    const playlistParam = playlistIDs.join(",");

    // Construct the final YouTube embed URL
    // (Update the `playlist` parameter to use the playlistParam if that's your intention)
    const videoSrc = `https://www.youtube.com/embed/${videoID}?autoplay=0&loop=1&playlist=${playlistParam}&controls=1&modestbranding=1&rel=0&showinfo=0&fs=0&disablekb=1`;

    return videoSrc;
  };

  const [bookmarkedVideos, setBookmarkedVideos] = useState({});

  const toggleBookmark = (video) => {
    const newStatus = !bookmarkedVideos[video.id];
    setBookmarkedVideos((prevState) => ({
      ...prevState,
      [video.id]: newStatus,
    }));

    AddToBook(video.id, video.bookmarkshow);
  };
  const [status, setStatus] = useState(null);
  const checkVideo = (video) => {
    // console.log(video);

    const match = video.match(/(?:youtu\.be\/|v=)([^&/]+)/);

    if (!match || !match[1]) {
      // console.error("Invalid YouTube URL");
      setStatus(false);
      return;
    }

    const id = match[1];
    const img = new Image();
    const thumbUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

    img.onload = function () {
      if (img.width === 120 && img.height === 90) {
        setStatus(false); // Likely not a real video
      } else {
        setStatus(true); // Valid video
      }
    };

    img.onerror = function () {
      setStatus(false);
    };

    img.src = thumbUrl;
  };
  useEffect(() => {
    if (disVideo) checkVideo(disVideo.video.second_url);
    // console.log("convertVimeoUrl", disVideo);
  }, [disVideo]);

  const [videoSrc, setVideoSrc] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function convertVimeoUrlAndCheck(url) {
      if (!url.includes("vimeo.com")) {
        setError(true);
        // console.log("Not a Vimeo URL");
        return;
      }

      try {
        // Use full URL in oEmbed to preserve token_popeShounda
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);

        if (response.ok) {
          const data = await response.json();
          // Extract the correct embed URL from the oEmbed response
          const embedHtml = data.html;

          // Parse the src from the returned iframe HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(embedHtml, "text/html");
          const iframe = doc.querySelector("iframe");

          if (iframe) {
            const embedSrc = iframe.getAttribute("src");
            setVideoSrc(embedSrc);

            setError(false);
          } else {
            throw new Error("Iframe not found");
          }
        } else {
          // console.log("oEmbed response not ok");
          setError(true);
        }
      } catch (err) {
        // console.error("Vimeo check failed:", err);
        setError(true);
      }
    }

    if (disVideo) {
      convertVimeoUrlAndCheck(disVideo.video.url);
    }
  }, [disVideo]);


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = (e) => setIsMobile(e.matches);

    // set initial
    setIsMobile(mql.matches);

    // subscribe
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange); // Safari fallback

    // cleanup
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);


  // return
  return (
    <div className='display-video-parent' style={{ width:"100%" }}>
      <div className='display-video' style={{ width:"100%" }}>
        <div className='bgMediaGallery2'></div>
        {/* <div className="display-video-wrapper">

          {disVideo.video && (() => {
            console.log("embedSrcembedSrcembedSrcembedSrc", videoSrc);

            // const videoID = disVideo.video.url.match(/(?:youtu\.be\/|v=)([^&/]+)/)[1];
            // const videoSrc = `https://www.youtube.com/embed/${videoID}`;
            return (
              <>
                <p className='display-video-about'>{disVideo.video.name}</p>

                {
                  !error ?
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>
                      <iframe
                        className='display-video-frame ded'
                        src={videoSrc}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                      <a
                        href={disVideo.url} // replace with real downloadable link
                        download
                        className="video-download-btn"
                        onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                      >
                        تحميل ⬇
                      </a>
                    </div>
                    :

                    status ?
                      <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>
                        <iframe
                          className='display-video-frame'
                          src={convertVideo(disVideo.video.second_url)}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                        <a
                          href={disVideo.video.second_url} // replace with real downloadable link
                          download
                          className="video-download-btn"
                          onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                        >
                          ⬇ تحميل
                        </a>
                      </div>

                      :
                      <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>

                        <video controls height={400}  width="100%" className='second_video'>
                          <source src={disVideo.video.third_url} type="video/mp4" />
                        </video>
                        <a
                          href={disVideo.video.third_url} // replace with real downloadable link
                          download
                          className="video-download-btn"
                          onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                        >
                          ⬇ تحميل
                        </a>
                      </div>




                }





              </>

            );
          })()}
        </div> */}
        <div className="display-video-wrapper">
          {!disVideo.video ? (
            // Skeleton Loading for video area
            <>
              <Skeleton width="100%" height={350} />
            </>
          ) : (
            <>
              <p className='display-video-about' style={{ width:"100%" }}>{disVideo.video.name}</p>

              {!error ? (
                <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>
                  
                  <iframe
                    className='display-video-frame ded'
                    src={videoSrc}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />

                  {
                    disVideo.video.third_url&&(
                      isMobile?
                          <a
                          href={disVideo.video.third_url}
                          download
                          className="video-download-btn-display"
                          onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                        >
                          ⬇
                        </a>
                      :

                      <a
                      href={disVideo.video.third_url}
                      download
                      className="video-download-btn video-download-btn-res"
                      onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                    >
                      ⬇ تحميل
                    </a>
               
                    )
                  }
 
                </div>
              ) : status ? (
                <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>
                  <iframe
                    className='display-video-frame'
                    src={convertVideo(disVideo.video.second_url)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                  {
                     disVideo.video.third_url&&(
                        <a
                        href={disVideo.video.third_url}
                        download
                        className="video-download-btn"
                        onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                      >
                        ⬇ تحميل
                      </a>
                     )
                  }
             
                </div>
              ) : (
                <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>
                  <video controls height={400} className='second_video'>
                    <source src={disVideo.video.third_url} type="video/mp4" />
                  </video>
                  {
                     disVideo.video.third_url&&(
                      <a
                      href={disVideo.video.third_url}
                      download
                      className="video-download-btn"
                      onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                    >
                      ⬇ تحميل
                    </a>
                     )

                  }
           
                </div>
              )}
            </>
          )}
        </div>

      </div>
      {/* <div className='display-video2'>
        {disVideo && disVideo.additionals.length > 0 && (
          <div className="display-video-wrapper">
            <p className='display-video-about2'>فيديوهات اخري</p>
            <div className="videos-videos-cont">
              {disVideo && disVideo.additionals.map((video, index) => {
                // const videoId = new URL(video.url).searchParams.get('v');
                // const videoSrc = `https://www.youtube.com/embed/${videoId}`;
                return (


                  <OneVideo src={convertVideo(video.second_url)} time={'32:20'} info={video.name} date={video.created_at} id={video.id} index={index} img={video.bookmarkshow ? `/assets/bookmark-yellow.png` : `/assets/archive.png`} bookmarkshow={video.bookmarkshow} secondurl={video.second_url} video={video} />

                )
              })}

            </div>
          </div>

        )}

      </div> */}
      <div className="display-video2">
        {disVideo && disVideo.additionals.length > 0 ? (
          <div className="display-video-wrapper">
            <p className="display-video-about2" style={{ width:"100%" }}>فيديوهات أخرى</p>
            <div className="videos-videos-cont">
              {disVideo.additionals.length > 0 ? (
                disVideo.additionals.map((video, index) => (
                  <OneVideo
                  key={index}
                  src={convertVideo(video.second_url)}
                  time={'32:20'}
                  info={video.name}
                  date={video.created_at}
                  id={video.id}
                  index={index}
                  img={video.bookmarkshow ? `/assets/bookmark-yellow.png` : `/assets/archive.png`}
                  bookmarkshow={video.bookmarkshow}
                  secondurl={video.second_url}
                  video={video}
            
                  /* pass hook-derived props so OneVideo doesn't call the hook itself */
                  fetchVideos={fetchVideos}
                  AddToBook={AddToBook}
                  navigate={navigate}
                  baseURL={baseURL}
                  token={token_popeShounda}
                  handleShareClick={handleShareClick}
                  handleCopy={handleCopy}
                  copiedProductIds={copiedProductIds}
                />
                ))
              ) : (
                <SkeletonVideosSection />
              )}
            </div>
          </div>
        ) : (
          <SkeletonVideosSection />
        )}
      </div>

      <div className='display-video2-res' style={{ display: "none" }} dir='rtl'>
        {disVideo && disVideo.additionals.length > 0 && (
          <div className="display-video-wrapper">
            <p className='display-video-about2'>فيديوهات اخري</p>
            <div className="videos-videos-cont-res" >
              <Swiper

                spaceBetween={10}
                slidesPerView={1.3}

                pagination={{
                  clickable: true,
                  el: '.swiper-pagination',
                }}
                modules={[Autoplay, Pagination]}
                speed={2000}
              >
                {
                  disVideo && disVideo.additionals.map((video, index) => {

                    return (
                      <SwiperSlide >
                         <OneVideo
                            src={convertVideo(video.second_url)}
                            time={'32:20'}
                            info={video.name}
                            date={video.created_at}
                            id={video.id}
                            index={index}
                            img={video.bookmarkshow ? `/assets/bookmark-yellow.png` : `/assets/archive.png`}
                            bookmarkshow={video.bookmarkshow}
                            secondurl={video.second_url}
                            video={video}

                            /* pass hook-derived props so OneVideo doesn't call the hook itself */
                            fetchVideos={fetchVideos}
                            AddToBook={AddToBook}
                            navigate={navigate}
                            baseURL={baseURL}
                            token={token_popeShounda}
                            handleShareClick={handleShareClick}
                            handleCopy={handleCopy}
                            copiedProductIds={copiedProductIds}
                          />

                      </SwiperSlide>
                    )
                  })
                }


                <div className="swiper-pagination"></div>

              </Swiper>


            </div>
          </div>

        )}

      </div>
      <ToastContainer />

    </div>

  )
}
