import React, { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

export const SkeletonLoadingVideo = () => (
  <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%' }}>
    <Skeleton height={200} width="100%" style={{ marginBottom: '10px' }} />
    <Skeleton height={20} width="60%" style={{ marginBottom: '10px' }} />
    <Skeleton height={16} width="50%" />
  </div>
);

export default function CategoryVideoCard({ item, desc, src }) {
  const navigate = useNavigate();

  const convertVideo = (video) => {
    if (!video) return null; // Early return if no video is provided

    const match = video.match(/(?:youtu\.be\/|v=)([^&/]+)/);

    if (match && match[1]) {
      const videoID = match[1];
      const videoSrc = `https://www.youtube.com/embed/${videoID}`;
      return videoSrc;
    } else {
      // Handle the case where the URL doesn't match the expected format
      console.error("Invalid YouTube URL provided:", video);
      return null;
    }
  }

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
    if (!item) return;

    if (!(item.second_url in availability)) {
      checkVideo(item.second_url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const modalRef = useRef(null);

  // --- Vimeo checking with per-URL cache to avoid duplicate network calls ---
  const vimeoCacheRef = useRef({}); // { [url]: Promise<{success, embedUrl?|error?}> }

  async function convertVimeoUrlAndCheck(url) {
    if (!url) return { success: false, error: "No URL provided" };

    // Return cached promise/result if available
    if (vimeoCacheRef.current[url]) {
      return vimeoCacheRef.current[url];
    }

    const fetchPromise = (async () => {
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
    })();

    // Store the pending promise in cache so subsequent calls reuse it
    vimeoCacheRef.current[url] = fetchPromise;
    return fetchPromise;
  }
  // -------------------------------------------------------------------------

  const [validVimeoUrls, setValidVimeoUrls] = useState({});
  const [invalidVimeoIds, setInvalidVimeoIds] = useState({});

  useEffect(() => {
    let mounted = true;

    async function validateVimeoLinks() {
      const validResults = {};
      const invalidResults = {};

      if (item?.url) {
        const result = await convertVimeoUrlAndCheck(item.url);
        if (!mounted) return;
        if (result.success) {
          validResults[item.id] = result.embedUrl;
        } else {
          invalidResults[item.id] = result.error;
        }
      }

      if (!mounted) return;
      setValidVimeoUrls(validResults);
      setInvalidVimeoIds(invalidResults);
    }

    validateVimeoLinks();

    return () => {
      mounted = false;
    };
  }, [item]); // only run when item changes

  let videoID = "";
  let videoSrc = "";
  let isAvailable = false;
  if (item?.second_url) {
    const match = item.second_url.match(/(?:youtu\.be\/|v=)([^&/]+)/);
    if (match && match[1]) {
      videoID = match[1];
      videoSrc = `https://www.youtube.com/embed/${videoID}`;
      isAvailable = availability?.[item.second_url];
    }
  }
  let embedUrl;
  if (item) {
    embedUrl = validVimeoUrls[item.id];
  }

  return (

    <div className='categoryVideoCard'>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {

          embedUrl ?
            <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>

              <iframe
                className='display-video-frame-cate'
                src={embedUrl}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                style={{ pointerEvents: 'none' }}

              />
              {
                item.third_url&&(
                <a
                href={item.third_url} // replace with real downloadable link
                download
                className="video-download-btn-cate"
                onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
              >
                ⬇ تحميل
              </a>
                )
              }

            </div>


            :
            isAvailable ? (
              <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>

                <iframe
                  className="video-video-frame"
                  src={videoSrc}
                  title={`YouTube video player`}
                  allow="encrypted-media"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen


                />

                {
                  item.third_url&&(
                    <a
                    href={item.third_url} // replace with real downloadable link
                    download
                    className="video-download-btn-cate"
                    onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                  >
                    ⬇ تحميل
                  </a>
                  )
                }


              </div>


            ) :

              (
                <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: "100%" }}>

                  <video controls className='second_video_videos'>
                    <source src={item & item.third_url} type="video/mp4" />
                  </video>
                  {
                    item.third_url&&(
                      <a
                      href={item.third_url} // replace with real downloadable link
                      download
                      className="video-download-btn-cate"
                      onClick={(e) => e.stopPropagation()} // prevent other onClick handlers
                    >
                      ⬇ تحميل
                    </a>
                    )
                  }

                </div>

              )

        }

        <div
          onClick={() => navigate(`/displayvideo/${item.slug}`)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            backgroundColor: 'rgba(0,0,0,0)' // Transparent overlay
          }}
        />
        <p dangerouslySetInnerHTML={{ __html: desc }} className='categoryVideoCardDesc'></p>
      </div>
    </div>
  )
}
